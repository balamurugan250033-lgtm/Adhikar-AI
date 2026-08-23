import React, { useState } from 'react';
import {
  Building2,
  Check,
  ClipboardCheck,
  Clock3,
  IndianRupee,
  Landmark,
  Link2,
  MapPin,
  ShieldAlert,
  User,
} from 'lucide-react';

function DetailItem({ icon: Icon, label, value, emphasis }) {
  return (
    <div className={`submission-detail ${emphasis ? 'submission-detail-emphasis' : ''}`}>
      <Icon size={18} aria-hidden="true" />
      <div>
        <p className="submission-detail-label">{label}</p>
        <p className="submission-detail-value">{value}</p>
      </div>
    </div>
  );
}

export default function SubmissionGuidelines({ result = {}, formData = {} }) {
  const [copied, setCopied] = useState(false);
  const state = result.state || formData.state || 'Selected state';
  const portal = result.portal || 'https://rtionline.gov.in';
  const address = `${result.public_authority || 'Public authority to verify'}, ${formData.city || 'district'} - ${formData.pincode || 'pincode'}`;
  const fee = result.fee_instructions || 'Confirm the application fee and accepted payment method with the public authority.';
  const department = result.department || 'Public authority to verify';
  const authority = result.public_authority || 'Verify the exact public authority before filing.';
  const pio = result.pio || 'Public Information Officer of the selected authority';

  const submissionDetails = [
    `Department: ${department}`,
    `Public Authority: ${authority}`,
    `PIO: ${pio}`,
    `State: ${state}`,
    `Address format: ${address}`,
    `Fee: ${fee}`,
    `Verify: ${portal}`,
    'Privacy: Do not include Aadhaar, PAN, passwords, or other sensitive information.',
    'Timeline: Response generally due within 30 days under Section 7(1). Save the acknowledgement number after filing.',
  ].join('\n');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(submissionDetails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="submission-guidelines" aria-labelledby="submission-guidelines-title">
      <div className="submission-heading-row">
        <h3 id="submission-guidelines-title"><ClipboardCheck size={18} aria-hidden="true" /> Submission Guidelines &amp; Target Department</h3>
        <button type="button" className="submission-copy-button" onClick={handleCopy} aria-label="Copy submission details">
          {copied ? <Check size={14} aria-hidden="true" /> : <Link2 size={14} aria-hidden="true" />}
          {copied ? 'Copied' : 'Copy details'}
        </button>
      </div>

      <div className="submission-phases" aria-label="Submission phases">
        <span className="submission-phase phase-form"><strong>Phase 1</strong> Form Fill</span>
        <span className="submission-phase phase-fee"><strong>Phase 2</strong> Fee Payment</span>
        <span className="submission-phase phase-track"><strong>Phase 3</strong> Confirmation &amp; Tracking</span>
      </div>

      <div className="submission-card-grid">
        <div className="submission-card">
          <h4>Where to File</h4>
          <DetailItem icon={Landmark} label="Department" value={department} />
          <DetailItem icon={Building2} label="Public Authority" value={authority} />
          <DetailItem icon={User} label="PIO" value={pio} />
          <DetailItem icon={MapPin} label="State" value={state} />
        </div>

        <div className="submission-card">
          <h4>Filing Checklist</h4>
          <DetailItem icon={IndianRupee} label="Fee" value={fee} emphasis />
          <DetailItem icon={Link2} label="Verification" value={<a href={portal.startsWith('http') ? portal : `https://${portal}`} target="_blank" rel="noreferrer">{portal}</a>} />
          <DetailItem icon={ShieldAlert} label="Privacy reminder" value="Do not include Aadhaar, PAN, passwords, or other sensitive information." />
          <DetailItem icon={Clock3} label="Response timeline" value="Generally 30 days under Section 7(1). Save the acknowledgement number after filing." emphasis />
        </div>
      </div>
      <p className="submission-disclaimer">Address format is illustrative. Verify the exact PIO and address on the official portal before filing.</p>
    </section>
  );
}
