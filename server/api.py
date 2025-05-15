from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import os
from server.classifier import clean_text
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import shutil

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASET_PATH = os.path.join(BASE_DIR, "SMSSpamCollection.tsv")
TEST_DATA_PATH = os.path.join(BASE_DIR, "your_test_data.tsv")
FEEDBACK_PATH = os.path.join(BASE_DIR, "custom_feedback.tsv")

# Helper to load and train model
def load_model():
    base_dataset = pd.read_csv(DATASET_PATH, sep='\t', names=['label', 'body_text'])
    base_dataset['label'] = base_dataset['label'].map({'ham': 0, 'spam': 1})
    if os.path.exists(FEEDBACK_PATH):
        feedback_data = pd.read_csv(FEEDBACK_PATH, sep='\t')
    else:
        feedback_data = pd.DataFrame(columns=['label', 'body_text'])
    dataset = pd.concat([base_dataset, feedback_data], ignore_index=True)
    tfidf_vect = TfidfVectorizer(analyzer=clean_text)
    X = tfidf_vect.fit_transform(dataset['body_text'])
    y = dataset['label'].astype(str)
    model = MultinomialNB()
    model.fit(X, y)
    return model, tfidf_vect

@app.post("/upload")
def upload_tsv(file: UploadFile = File(...)):
    # Save uploaded file to TEST_DATA_PATH (append mode)
    with open(TEST_DATA_PATH, "a", encoding="utf-8") as out_f:
        shutil.copyfileobj(file.file, out_f)
    return {"status": "success"}

@app.get("/classify")
def classify():
    model, tfidf_vect = load_model()
    test_data = pd.read_csv(TEST_DATA_PATH, sep='\t', names=['body_text'])
    ham, spam = [], []
    for idx, row in test_data.iterrows():
        msg = row['body_text']
        vec = tfidf_vect.transform([msg])
        pred = model.predict(vec)[0]
        if int(pred) == 0:
            ham.append({"id": idx, "text": msg})
        else:
            spam.append({"id": idx, "text": msg})
    return {"ham": ham, "spam": spam}

@app.post("/feedback")
def feedback(msg_id: int = Form(...), correct_label: str = Form(...)):
    # Read test data
    test_data = pd.read_csv(TEST_DATA_PATH, sep='\t', names=['body_text'])
    msg_text = test_data.iloc[msg_id]['body_text']
    label = 0 if correct_label == 'ham' else 1
    # Append to feedback
    if os.path.exists(FEEDBACK_PATH):
        feedback_data = pd.read_csv(FEEDBACK_PATH, sep='\t')
    else:
        feedback_data = pd.DataFrame(columns=['label', 'body_text'])
    feedback_data.loc[len(feedback_data)] = [label, msg_text]
    feedback_data.to_csv(FEEDBACK_PATH, sep='\t', index=False)
    return {"status": "feedback added"}

@app.post("/finalize")
def finalize():
    # Add correct messages to main dataset, clear test/feedback
    if os.path.exists(TEST_DATA_PATH):
        os.remove(TEST_DATA_PATH)
    if os.path.exists(FEEDBACK_PATH):
        os.remove(FEEDBACK_PATH)
    return {"status": "finalized"} 