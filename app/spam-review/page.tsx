import React, { useState, useRef } from 'react';

interface Message {
  id: number;
  text: string;
}

export default function SpamReviewPage() {
  const [file, setFile] = useState<File | null>(null);
  const [hamMessages, setHamMessages] = useState<Message[]>([]);
  const [spamMessages, setSpamMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [hoveredHam, setHoveredHam] = useState<number | null>(null);
  const [hoveredSpam, setHoveredSpam] = useState<number | null>(null);
  const [correcting, setCorrecting] = useState(false);
  const [finalized, setFinalized] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_BASE = 'http://localhost:8000';

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/classify`);
      const data = await res.json();
      setHamMessages(data.ham || []);
      setSpamMessages(data.spam || []);
    } catch (err) {
      setHamMessages([]);
      setSpamMessages([]);
    }
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    await fetchMessages();
    setLoading(false);
  };

  const handleCorrection = async (msgId: number, correctLabel: 'ham' | 'spam') => {
    setCorrecting(true);
    const formData = new FormData();
    formData.append('msg_id', msgId.toString());
    formData.append('correct_label', correctLabel);
    await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      body: formData,
    });
    setCorrecting(false);
    await fetchMessages();
  };

  const handleFinalize = async () => {
    setLoading(true);
    await fetch(`${API_BASE}/finalize`, { method: 'POST' });
    setHamMessages([]);
    setSpamMessages([]);
    setFinalized(true);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Spam Classifier Review</h1>
      {finalized && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded border border-green-300">
          Session finalized! All feedback and correct messages have been saved.
        </div>
      )}
      {/* File Upload */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Upload TSV File</h2>
        <input
          type="file"
          accept=".tsv"
          className="mb-2"
          onChange={handleFileChange}
          ref={fileInputRef}
          disabled={finalized}
        />
        <button
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          onClick={handleUpload}
          disabled={!file || loading || finalized}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </section>
      {/* Message Containers */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-4">HAM Messages</h2>
          {hamMessages.length === 0 ? (
            <div className="text-gray-500">No messages yet.</div>
          ) : (
            <ul>
              {hamMessages.map((msg) => (
                <li
                  key={msg.id}
                  className="mb-2 p-2 rounded hover:bg-green-50 border border-green-200 relative group"
                  onMouseEnter={() => setHoveredHam(msg.id)}
                  onMouseLeave={() => setHoveredHam(null)}
                >
                  {msg.text}
                  {hoveredHam === msg.id && !finalized && (
                    <button
                      className="absolute right-2 top-2 px-2 py-1 text-xs bg-red-500 text-white rounded shadow hover:bg-red-600"
                      onClick={() => handleCorrection(msg.id, 'spam')}
                      disabled={correcting}
                    >
                      Mark as SPAM
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-4">SPAM Messages</h2>
          {spamMessages.length === 0 ? (
            <div className="text-gray-500">No messages yet.</div>
          ) : (
            <ul>
              {spamMessages.map((msg) => (
                <li
                  key={msg.id}
                  className="mb-2 p-2 rounded hover:bg-red-50 border border-red-200 relative group"
                  onMouseEnter={() => setHoveredSpam(msg.id)}
                  onMouseLeave={() => setHoveredSpam(null)}
                >
                  {msg.text}
                  {hoveredSpam === msg.id && !finalized && (
                    <button
                      className="absolute right-2 top-2 px-2 py-1 text-xs bg-green-600 text-white rounded shadow hover:bg-green-700"
                      onClick={() => handleCorrection(msg.id, 'ham')}
                      disabled={correcting}
                    >
                      Mark as HAM
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      {/* Finalize/Logout */}
      <section className="mt-8">
        <button
          className="px-6 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          onClick={handleFinalize}
          disabled={loading || finalized}
        >
          Finalize & Logout
        </button>
      </section>
    </main>
  );
} 