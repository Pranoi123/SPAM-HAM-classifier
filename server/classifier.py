import pandas as pd
import string
import re
import nltk
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB

# Get the directory where the script is located
script_dir = os.path.dirname(os.path.abspath(__file__))
base_dir = os.path.dirname(script_dir)

# Download required NLTK data
nltk.download('stopwords')
nltk.download('wordnet')

def clean_text(text):
    text = "".join([char.lower() for char in text if char not in string.punctuation])
    tokens = re.split(r'\W+', text)
    return [nltk.PorterStemmer().stem(word) for word in tokens if word not in nltk.corpus.stopwords.words('english')]

# Read the base dataset
base_dataset = pd.read_csv(os.path.join(base_dir, "SMSSpamCollection.tsv"), sep='\t', names=['label', 'body_text'])
base_dataset['label'] = base_dataset['label'].map({'ham': 0, 'spam': 1})

# Handle feedback data if it exists
feedback_path = os.path.join(base_dir, "custom_feedback.tsv")
if os.path.exists(feedback_path):
    feedback_data = pd.read_csv(feedback_path, sep='\t')
else:
    feedback_data = pd.DataFrame(columns=['label', 'body_text'])

# Combine base dataset with feedback
dataset = pd.concat([base_dataset, feedback_data], ignore_index=True)

# Create and fit the vectorizer
tfidf_vect = TfidfVectorizer(analyzer=clean_text)
X = tfidf_vect.fit_transform(dataset['body_text'])
y = dataset['label'].astype(str)

# Train the model
model = MultinomialNB()
model.fit(X, y)

def predict_messages(file_path=None):
    if file_path is None:
        file_path = os.path.join(base_dir, "your_test_data.tsv")
    new_data = pd.read_csv(file_path, sep='\t', names=['body_text'])
    predictions = []
    for index, row in new_data.iterrows():
        msg = row['body_text']
        vec = tfidf_vect.transform([msg])
        pred = model.predict(vec)[0]
        prob = model.predict_proba(vec)[0]
        predictions.append((index, msg, pred, prob))

    for index, msg, pred, prob in predictions:
        print(f"\nMessage {index}: {msg}")
        print("Predicted Label:", "HAM" if int(pred) == 0 else "SPAM")
        print("HAM probability: {:.2f}%".format(prob[0] * 100))
        print("SPAM probability: {:.2f}%".format(prob[1] * 100))

    response = input("\nAre all predictions correct? (y/n): ")
    while response.lower() == 'n':
        msg_id = input("Enter message number or text that was wrongly predicted (or -1 to stop): ")
        if msg_id == '-1':
            break
        try:
            wrong_msg = int(msg_id)
            msg_text = new_data.iloc[wrong_msg]['body_text']
        except ValueError:
            msg_text = msg_id

        correct_label = input("What is the correct label? (ham/spam): ").strip().lower()
        correct_label = 0 if correct_label == 'ham' else 1

        feedback_data.loc[len(feedback_data)] = [correct_label, msg_text]
        feedback_data.to_csv(feedback_path, sep='\t', index=False)
        print(f"Added correction: '{msg_text}' as {'HAM' if correct_label == 0 else 'SPAM'}")

    print("\n[INFO] Feedback loop complete. Retrain model next time to include improvements.")

if __name__ == "__main__":
    predict_messages() 