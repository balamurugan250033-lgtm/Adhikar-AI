import React, { useState } from 'react';
import { apiUrl, readJsonResponse } from '../api';

export default function RTITool() {
  const [formData, setFormData] = useState({
    applicant_name: '',
    address: '',
    city: '',
    pincode: '',
    road_name: '',
    area: '',
    complaint_number: '',
    question: '',
    language: 'English',
  });

  const [rtiDraft, setRtiDraft] = useState('');
  const [instructions, setInstructions] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(apiUrl('/api/rti/draft'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await readJsonResponse(response);

      setRtiDraft(data.rti_draft || data.draft || '');
      setInstructions(data.instructions || data.guidelines || '');
      setCharCount(data.char_count || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rtiDraft);
    alert('RTI Draft copied to clipboard!');
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left Column: Input Form */}
        <div className="bg-white p-6 shadow rounded-lg border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">File Online RTI Application</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Applicant Name *</label>
              <input
                type="text"
                name="applicant_name"
                required
                value={formData.applicant_name}
                onChange={handleChange}
                placeholder="e.g. Ram"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">City *</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Delhi"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Pincode (6 digits) *</label>
                <input
                  type="text"
                  name="pincode"
                  required
                  maxLength="6"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="600001"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Full Address *</label>
              <textarea
                name="address"
                required
                rows="2"
                value={formData.address}
                onChange={handleChange}
                placeholder="Door No, Street Name, Area"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Issue / Information Sought (Max 500 chars)</label>
              <textarea
                name="question"
                maxLength="500"
                rows="3"
                value={formData.question}
                onChange={handleChange}
                placeholder="Describe the exact details or records you are requesting..."
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white p-2.5 rounded-md font-semibold text-sm hover:bg-indigo-700 transition shadow-sm"
            >
              {loading ? 'Generating Application...' : 'Generate RTI Draft & Portal Guidelines'}
            </button>
          </form>
        </div>

        {/* Right Column: Output Previews */}
        <div className="space-y-6">
          
          {/* Portal-Ready RTI Text Box */}
          <div className="bg-white p-6 shadow rounded-lg border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800 text-sm">Portal-Ready RTI Text (rtionline.gov.in)</h3>
              {rtiDraft && (
                <button
                  onClick={handleCopy}
                  className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1 rounded font-medium transition"
                >
                  Copy Text
                </button>
              )}
            </div>
            <div className="w-full h-60 p-3 bg-gray-50 border border-gray-200 rounded-md overflow-y-auto whitespace-pre-wrap text-xs text-gray-800 font-mono">
              {rtiDraft || 'Fill out the form on the left and click generate to view your official application draft here...'}
            </div>
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <span>Character count: {charCount} / 3000</span>
            </div>
          </div>

          {/* Submission Guidelines Box */}
          <div className="bg-white p-6 shadow rounded-lg border border-gray-100">
            <h3 className="font-semibold text-gray-800 text-sm mb-3">Online Portal Submission Guidelines & Authority</h3>
            <div className="w-full h-52 p-3 bg-gray-50 border border-gray-200 rounded-md overflow-y-auto whitespace-pre-wrap text-xs text-gray-700 font-mono">
              {instructions || 'Step-by-step instructions mapped directly to the government portal will appear here...'}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}