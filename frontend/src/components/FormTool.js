import React, { useState } from 'react';
import { ClipboardCheck, FileEdit } from 'lucide-react';

function FormTool() {
  const [formType, setFormType] = useState('grievance');
  const [details, setDetails] = useState('');
  const [prepared, setPrepared] = useState(false);

  const formNames = {
    grievance: 'Public grievance form',
    scholarship: 'Scholarship application',
    pension: 'Pension/service request',
    certificate: 'Certificate request'
  };

  const handlePrepare = (event) => {
    event.preventDefault();
    setPrepared(Boolean(details.trim()));
  };

  return (
    <div className="tool-card form-assistant">
      <h2><FileEdit size={22} aria-hidden="true" /> Government Form Assistant</h2>
      <p>Organise your information before completing the relevant official form.</p>
      <form onSubmit={handlePrepare} className="form-assistant-form">
        <label htmlFor="form-type">Form type</label>
        <select id="form-type" value={formType} onChange={event => setFormType(event.target.value)}>
          {Object.entries(formNames).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <label htmlFor="form-details">Key details</label>
        <textarea id="form-details" rows="5" value={details} onChange={event => setDetails(event.target.value)} placeholder="Describe your request, dates, reference numbers, and documents available." required />
        <button type="submit"><ClipboardCheck size={16} aria-hidden="true" /> Prepare checklist</button>
      </form>
      {prepared && <div className="form-result" role="status"><strong>{formNames[formType]}</strong><p>Checklist prepared. Keep identity, address, reference, and supporting documents ready. Verify the exact official form and submission channel before filing.</p></div>}
    </div>
  );
}

export default FormTool;