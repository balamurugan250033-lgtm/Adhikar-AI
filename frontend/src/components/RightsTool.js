import React, { useState } from 'react';
import axios from 'axios';

const LANG_MAP = { en: 'English', hi: 'Hindi', ta: 'Tamil', te: 'Telugu', bn: 'Bengali' };

export default function RightsTool({ language }) {
  const [problem, setProblem] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [copied, setCopied] = useState(false);

  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert('Use Chrome for voice support!'); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : language === 'ta' ? 'ta-IN' : language === 'te' ? 'te-IN' : 'en-IN';
    recognition.start();
    setListening(true);
    recognition.onresult = (e) => { setProblem(e.results[0][0].transcript); setListening(false); };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
  };

  const generate = async () => {
    if (!problem.trim()) return;
    setLoading(true);
    setOutput('');
    try {
      const res = await axios.post('http://localhost:8000/api/rights/navigate', {
        problem,
        language: LANG_MAP[language] || 'English'
      });
      setOutput(res.data.result);
    } catch {
      setOutput('Error connecting to backend. Make sure backend is running!');
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="tool-header">
        <h2 className="tool-title">⚖️ Rights Navigator</h2>
        <p className="tool-desc">Describe your problem and get your exact legal rights explained in simple language.</p>
      </div>
      <div className="input-area">
        <label className="input-label">What problem are you facing?</label>
        <button className={`voice-btn ${listening ? 'recording' : ''}`} onClick={startVoice}>
          {listening ? '🔴 Listening... speak now' : '🎤 Speak your problem'}
        </button>
        <textarea
          className="input-field"
          placeholder="E.g. My landlord is not returning my security deposit even after I vacated the house 2 months ago..."
          value={problem}
          onChange={e => setProblem(e.target.value)}
          rows={4}
        />
        <button className="submit-btn" onClick={generate} disabled={loading || !problem.trim()}>
          {loading ? '⏳ Finding your rights...' : 'Know My Rights →'}
        </button>
      </div>
      {output && (
        <div className="output-area">
          <div className="output-label">✅ Your Legal Rights & Action Plan</div>
          <div className="output-text">{output}</div>
          <button className="copy-btn" onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
            {copied ? '✅ Copied!' : '📋 Copy'}
          </button>
        </div>
      )}
    </div>
  );
}