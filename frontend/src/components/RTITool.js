import React, { useState } from 'react';

export default function RTITool() {
  const [formData, setFormData] = useState({
    applicant_name: '',
    address: '',
    city: '',
    pincode: '',
    question: '',
    language: 'English'
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/rti/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Error connecting to backend:", err);
      alert("Failed to connect to backend server. Make sure FastAPI is running!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-indigo-900">Create RTI Application</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md border">
        <div>
          <label className="block text-sm font-semibold text-gray-700">Full Name of Applicant</label>
          <input 
            type="text" 
            name="applicant_name" 
            value={formData.applicant_name} 
            onChange={handleChange} 
            className="w-full p-2 border rounded mt-1 focus:ring-2 focus:ring-indigo-500" 
            placeholder="e.g. Deepan Raju U"
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">Correspondence Address</label>
          <input 
            type="text" 
            name="address" 
            value={formData.address} 
            onChange={handleChange} 
            className="w-full p-2 border rounded mt-1 focus:ring-2 focus:ring-indigo-500" 
            placeholder="Enter your complete street address"
            required 
          />
        </div>

        {/* City & Pincode Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">City / District</label>
            <input 
              type="text" 
              name="city" 
              value={formData.city} 
              onChange={handleChange} 
              className="w-full p-2 border rounded mt-1 focus:ring-2 focus:ring-indigo-500" 
              placeholder="e.g. Chennai"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Pincode</label>
            <input 
              type="text" 
              name="pincode" 
              value={formData.pincode} 
              onChange={handleChange} 
              className="w-full p-2 border rounded mt-1 focus:ring-2 focus:ring-indigo-500" 
              placeholder="e.g. 600001"
              required 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">Describe Your Problem / Information Needed</label>
          <textarea 
            name="question" 
            value={formData.question} 
            onChange={handleChange} 
            className="w-full p-2 border rounded mt-1 h-32 focus:ring-2 focus:ring-indigo-500" 
            placeholder="Describe your issue (e.g., ration card denied, passport delayed, etc.)"
            required 
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-3 rounded transition duration-200"
        >
          {loading ? "Analyzing & Drafting Application..." : "Generate Official RTI Application"}
        </button>
      </form>

      {result && (
        <div className="mt-8 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="font-bold text-lg mb-2 text-gray-800">Generated RTI Application</h3>
            <pre className="whitespace-pre-wrap font-sans text-sm bg-gray-50 p-4 rounded border text-gray-800">{result.rti_draft}</pre>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg shadow border border-blue-200">
            <h3 className="font-bold text-lg mb-3 text-blue-900">Submission Guidelines & Target Department</h3>
            <div className="whitespace-pre-line font-sans text-sm text-blue-900 bg-white p-4 rounded border border-blue-100 leading-relaxed">
              {result.instructions}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}