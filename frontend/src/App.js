import React, { useState, useEffect } from 'react';

// 22 Official Indian Languages + English with Speech recognition locale codes
const LANGUAGES = [
  { name: 'English', code: 'en-US' },
  { name: 'Hindi', code: 'hi-IN' },
  { name: 'Bengali', code: 'bn-IN' },
  { name: 'Marathi', code: 'mr-IN' },
  { name: 'Telugu', code: 'te-IN' },
  { name: 'Tamil', code: 'ta-IN' },
  { name: 'Gujarati', code: 'gu-IN' },
  { name: 'Urdu', code: 'ur-IN' },
  { name: 'Kannada', code: 'kn-IN' },
  { name: 'Malayalam', code: 'ml-IN' },
  { name: 'Odia', code: 'or-IN' },
  { name: 'Punjabi', code: 'pa-IN' },
  { name: 'Assamese', code: 'as-IN' },
  { name: 'Maithili', code: 'mai-IN' },
  { name: 'Sanskrit', code: 'sa-IN' },
  { name: 'Kashmiri', code: 'ks-IN' },
  { name: 'Sindhi', code: 'sd-IN' },
  { name: 'Konkani', code: 'kok-IN' },
  { name: 'Nepali', code: 'ne-NP' },
  { name: 'Dogri', code: 'doi-IN' },
  { name: 'Manipuri', code: 'mni-IN' },
  { name: 'Bodo', code: 'brx-IN' },
  { name: 'Santali', code: 'sat-IN' }
];

const UI_TEXT = {
  English: {
    brand: "Adhikar AI", tagline: "Automated RTI Portal Drafting Assistant",
    heroTitle: "File Right to Information Applications Instantly",
    heroDesc: "Draft precise, portal-ready RTI requests for rtionline.gov.in with automated guidelines.",
    getStarted: "Get Started Free →", formTitle: "Create Portal-Ready RTI Request",
    nameLabel: "Full Name of Applicant", namePlaceholder: "e.g., DEEPAN RAJU U",
    addressLabel: "Full Correspondence Address (Door No, Street, Area)", addressPlaceholder: "e.g., 34, 1st Cross Street, Anna Nagar",
    cityLabel: "City / District", cityPlaceholder: "e.g., Chennai",
    pincodeLabel: "Pincode", pincodePlaceholder: "600010",
    roadLabel: "Road / Street Name", roadPlaceholder: "e.g., Gandhi Main Road",
    areaLabel: "Area / Locality", areaPlaceholder: "e.g., Velachery",
    complaintLabel: "Previous Complaint Number (Optional)", complaintPlaceholder: "e.g., CCMC/2026/12345 (Leave blank if none)",
    problemLabel: "Additional Details / Specific Information Needed",
    problemPlaceholder: "Describe any specific details or questions you want answered...",
    micButton: "🎙️ Speak Details", stopMic: "🔴 Stop Recording",
    submitButton: "Generate Portal-Ready RTI Text", loadingText: "Drafting RTI Text...",
    sectionATitle: "Portal-Ready RTI Text (Paste directly into rtionline.gov.in)",
    copyBtn: "Copy Text", copied: "✓ Copied", pdfBtn: "📥 Download PDF",
    sectionBTitle: "Online Portal Submission Guidelines & Authority", backHome: "← Back to Home",
    historyTitle: "📜 Past Drafts History", noHistory: "No saved drafts yet.", loadDraft: "Load Draft"
  },
  Hindi: {
    brand: "अधिकार AI", tagline: "स्वचालित आरटीआई ड्राफ्टिंग सहायक",
    heroTitle: "तुरंत आरटीआई आवेदन दाखिल करें",
    heroDesc: "rtionline.gov.in के लिए सटीक और पोर्टल-तैयार आरटीआई ड्राफ्ट तैयार करें।",
    getStarted: "शुरू करें →", formTitle: "आरटीआई आवेदन बनाएं",
    nameLabel: "आवेदक का पूरा नाम", namePlaceholder: "अपना पूरा नाम दर्ज करें",
    addressLabel: "पूरा पता (मकान नं, गली, क्षेत्र)", addressPlaceholder: "अपना पूरा डाक पता दर्ज करें",
    cityLabel: "शहर / जिला", cityPlaceholder: "अपना शहर दर्ज करें",
    pincodeLabel: "पिनकोड", pincodePlaceholder: "पिनकोड दर्ज करें",
    roadLabel: "सड़क / गली का नाम", roadPlaceholder: "सड़क का नाम दर्ज करें",
    areaLabel: "क्षेत्र / इलाका", areaPlaceholder: "क्षेत्र दर्ज करें",
    complaintLabel: "पिछला शिकायत नंबर (वैकल्पिक)", complaintPlaceholder: "शिकायत संख्या यदि कोई हो",
    problemLabel: "अतिरिक्त विवरण / जानकारी", problemPlaceholder: "विवरण दर्ज करें...",
    micButton: "🎙️ बोलकर टाइप करें", stopMic: "🔴 रिकॉर्डिंग बंद करें",
    submitButton: "आरटीआई टेक्स्ट जनरेट करें", loadingText: "ड्राफ्टिंग जारी है...",
    sectionATitle: "पोर्टल-तैयार आरटीआई टेक्स्ट",
    copyBtn: "कॉपी करें", copied: "✓ कॉपी हो गया", pdfBtn: "📥 PDF डाउनलोड करें",
    sectionBTitle: "सबमिशन दिशा-निर्देश और विभाग", backHome: "← होम पर वापस जाएं",
    historyTitle: "📜 पिछले ड्राफ्ट का इतिहास", noHistory: "कोई ड्राफ्ट सहेजा नहीं गया है।", loadDraft: "लोड करें"
  },
  Tamil: {
    brand: "அதிகார் AI", tagline: "தானியங்கி RTI வரைவு உதவியாளர்",
    heroTitle: "உடனடியாக RTI விண்ணப்பத்தை உருவாக்கவும்",
    heroDesc: "rtionline.gov.in தளத்திற்கான துல்லியமான RTI கோரிக்கையைத் தயாரிக்கவும்.",
    getStarted: "தொடங்கவும் →", formTitle: "RTI கோரிக்கையை உருவாக்கவும்",
    nameLabel: "விண்ணப்பதாரரின் முழு பெயர்", namePlaceholder: "உங்கள் முழு சட்டப்பூர்வ பெயரை உள்ளிடவும்",
    addressLabel: "முழு முகவரி (வீட்டு எண், வீதி, பகுதி)", addressPlaceholder: "முழு முகவரியை உள்ளிடவும்",
    cityLabel: "நகரம் / மாவட்டம்", cityPlaceholder: "சென்னையை உள்ளிடவும்",
    pincodeLabel: "அஞ்சல் குறியீடு", pincodePlaceholder: "600010",
    roadLabel: "சாலை / வீதி பெயர்", roadLabelPlaceholder: "சாலை பெயரை உள்ளிடவும்",
    roadPlaceholder: "எ.கா: காந்தி சாலை",
    areaLabel: "பகுதி", areaPlaceholder: "எ.கா: அண்ணா நகர்",
    complaintLabel: "முந்தைய புகார் எண் (இருந்தால்)", complaintPlaceholder: "புகார் எண்",
    problemLabel: "தேவையான கூடுதல் தகவல்கள்", problemPlaceholder: "விவரங்களை உள்ளிடவும்...",
    micButton: "🎙️ பேசவும்", stopMic: "🔴 நிறுத்து",
    submitButton: "RTI உரையை உருவாக்கவும்", loadingText: "தயாராகிறது...",
    sectionATitle: "RTI உரை (போர்ட்டலில் பேஸ்ட் செய்ய)",
    copyBtn: "நகலெடுக்கவும்", copied: "✓ நகலெடுக்கப்பட்டது", pdfBtn: "📥 PDF பதிவிறக்கம்",
    sectionBTitle: "சமர்ப்பிக்கும் வழிகாட்டுதல்கள்", backHome: "← முகப்பு",
    historyTitle: "📜 முந்தைய வரைவுகள்", noHistory: "வரலாறு இல்லை.", loadDraft: "ஏற்று"
  }
  // Fallback map handled dynamically
};

export default function App() {
  const [step, setStep] = useState('landing');
  const [language, setLanguage] = useState('English');
  const [isListening, setIsListening] = useState(false);
  const [apiOnline, setApiOnline] = useState(null);

  const [formData, setFormData] = useState({
    applicant_name: '',
    address: '',
    city: '',
    pincode: '',
    road_name: '',
    area: '',
    complaint_number: '',
    question: '',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);

  const t = UI_TEXT[language] || UI_TEXT['English'];

  useEffect(() => {
    fetch('http://localhost:8000/')
      .then(res => setApiOnline(res.ok))
      .catch(() => setApiOnline(false));

    const savedHistory = localStorage.getItem('adhikar_rti_history_v2');
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch (e) { console.error(e); }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    const langObj = LANGUAGES.find(l => l.name === language);
    recognition.lang = langObj ? langObj.code : 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      setFormData(prev => ({
        ...prev,
        question: prev.question ? prev.question + ' ' + speechText : speechText
      }));
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:8000/api/rti/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          language: language
        }),
      });
      const data = await response.json();
      setResult(data);
      setApiOnline(true);

      const resolvedDraft = data.rti_draft || data.draft || data.text || data.application || data.response || '';
      const resolvedInstructions = data.instructions || data.guidelines || data.steps || '';

      const newEntry = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        ...formData,
        rti_draft: resolvedDraft,
        instructions: resolvedInstructions
      };
      const updatedHistory = [newEntry, ...history.slice(0, 9)];
      setHistory(updatedHistory);
      localStorage.setItem('adhikar_rti_history_v2', JSON.stringify(updatedHistory));
      setStep('result');

    } catch (err) {
      setApiOnline(false);
      alert('Unable to connect to backend server. Make sure FastAPI is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = result?.rti_draft || result?.draft || result?.text || result?.application || result?.response || '';
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPDF = () => {
    const textToPrint = result?.rti_draft || result?.draft || result?.text || result?.application || result?.response || '';
    const instToPrint = result?.instructions || result?.guidelines || result?.steps || '';
    if (!textToPrint) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>RTI Application - ${formData.applicant_name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #111; line-height: 1.6; }
            h2 { text-align: center; margin-bottom: 20px; }
            pre { white-space: pre-wrap; font-family: Arial, sans-serif; font-size: 14px; background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
            .footer { margin-top: 30px; font-size: 12px; color: #445; border-top: 1px solid #ccc; padding-top: 10px; }
          </style>
        </head>
        <body>
          <h2>RTI ONLINE PORTAL TEXT</h2>
          <pre>${textToPrint}</pre>
          <div class="footer">
            <p><strong>Submission Guidelines & Department Info:</strong><br/>${instToPrint}</p>
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const loadPastDraft = (item) => {
    setFormData({
      applicant_name: item.applicant_name || '',
      address: item.address || '',
      city: item.city || '',
      pincode: item.pincode || '',
      road_name: item.road_name || '',
      area: item.area || '',
      complaint_number: item.complaint_number || '',
      question: item.question || ''
    });
    setResult({
      rti_draft: item.rti_draft,
      instructions: item.instructions
    });
    setStep('result');
  };

  const deleteHistoryItem = (id, e) => {
    e.stopPropagation();
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('adhikar_rti_history_v2', JSON.stringify(updated));
  };

  const clearAllHistory = () => {
    if (window.confirm("Delete all history?")) {
      setHistory([]);
      localStorage.removeItem('adhikar_rti_history_v2');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-xs">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setStep('landing')}>
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-base shadow-md shadow-indigo-500/20">
              अ
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">{t.brand}</span>
              <span className="block text-[10px] text-indigo-600 font-semibold uppercase tracking-wider">RTI Portal Assistant</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-xs px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
              <span className={`w-2 h-2 rounded-full ${apiOnline ? 'bg-emerald-500 animate-pulse' : apiOnline === false ? 'bg-rose-500' : 'bg-amber-500'}`}></span>
              <span className="text-slate-600 font-medium">
                {apiOnline ? 'API Connected' : apiOnline === false ? 'API Offline' : 'Checking API...'}
              </span>
            </div>

            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-100 border border-slate-300 text-slate-800 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 font-medium"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.name} value={lang.name}>{lang.name}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {step === 'landing' && (
          <div className="grid md:grid-cols-2 gap-12 items-center py-10">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold tracking-wide uppercase mb-4">
                rtionline.gov.in Optimized
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                {t.heroTitle}
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                {t.heroDesc}
              </p>
              <button
                onClick={() => setStep('form')}
                className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base shadow-lg shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                {t.getStarted}
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 text-base">{t.historyTitle}</h3>
                {history.length > 0 && (
                  <button onClick={clearAllHistory} className="text-xs text-rose-500 hover:underline">Clear All</button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">{t.noHistory}</div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {history.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => loadPastDraft(item)}
                      className="p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-indigo-50/40 hover:border-indigo-200 cursor-pointer transition-all flex justify-between items-center group"
                    >
                      <div className="overflow-hidden pr-2">
                        <p className="text-xs font-semibold text-indigo-600">{item.date} • {item.applicant_name}</p>
                        <p className="text-sm text-slate-700 truncate mt-0.5">{item.road_name ? `${item.road_name}, ${item.area}` : item.question}</p>
                      </div>
                      <span className="text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                        {t.loadDraft}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 'form' && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8">
            <button 
              onClick={() => setStep('landing')}
              className="text-sm text-indigo-600 hover:underline mb-6 inline-flex items-center font-medium cursor-pointer"
            >
              ← {t.backHome}
            </button>

            <h2 className="text-2xl font-bold text-slate-900 mb-6">{t.formTitle}</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">{t.nameLabel}</label>
                <input
                  type="text"
                  name="applicant_name"
                  value={formData.applicant_name}
                  onChange={handleChange}
                  placeholder={t.namePlaceholder}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">{t.addressLabel}</label>
                <textarea
                  name="address"
                  rows="2"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder={t.addressPlaceholder}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">{t.cityLabel}</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder={t.cityPlaceholder}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">{t.pincodeLabel}</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder={t.pincodePlaceholder}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">{t.roadLabel}</label>
                  <input
                    type="text"
                    name="road_name"
                    value={formData.road_name}
                    onChange={handleChange}
                    placeholder={t.roadPlaceholder}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">{t.areaLabel}</label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder={t.areaPlaceholder}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">{t.complaintLabel}</label>
                <input
                  type="text"
                  name="complaint_number"
                  value={formData.complaint_number}
                  onChange={handleChange}
                  placeholder={t.complaintPlaceholder}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-slate-700">{t.problemLabel}</label>
                  <button
                    type="button"
                    onClick={handleVoiceInput}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1 cursor-pointer ${
                      isListening ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{isListening ? t.stopMic : t.micButton}</span>
                  </button>
                </div>
                <textarea
                  name="question"
                  rows="3"
                  value={formData.question}
                  onChange={handleChange}
                  placeholder={t.problemPlaceholder}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>{t.loadingText}</span>
                  </>
                ) : (
                  <span>{t.submitButton}</span>
                )}
              </button>
            </form>
          </div>
        )}

        {step === 'result' && result && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-slate-100 gap-4">
                <h3 className="text-lg font-bold text-slate-900">{t.sectionATitle}</h3>
                <div className="flex items-center space-x-3">
                  <button onClick={handleCopy} className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold cursor-pointer">
                    {copied ? t.copied : t.copyBtn}
                  </button>
                  <button onClick={handleDownloadPDF} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold cursor-pointer">
                    {t.pdfBtn}
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 overflow-x-auto">
                <pre className="text-sm font-mono text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {result.rti_draft || result.draft || result.text || result.application || result.response}
                </pre>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-8 h-fit">
              <h3 className="text-lg font-bold text-slate-900 mb-4">{t.sectionBTitle}</h3>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
                {result.instructions || result.guidelines || result.steps || "Select Corporation of Chennai (CCMC) or TN PWD on rtionline.gov.in. Fee mode: Online Payment."}
              </div>
              <button
                onClick={() => setStep('form')}
                className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm cursor-pointer text-center"
              >
                ← File Another Application
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}