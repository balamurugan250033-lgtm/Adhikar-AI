import React from 'react';
import { ArrowRight, ClipboardList, FileText, Landmark, Scale, ShieldCheck } from 'lucide-react';

const FEATURES = [
  { icon: FileText, title: 'RTI Drafting Agent', desc: 'Turn your plain-language question into a properly formatted RTI application, addressed to the right department.' },
  { icon: Scale, title: 'Rights Navigator', desc: 'Describe your problem and get general civic guidance with clear next steps.' },
  { icon: Landmark, title: 'Scheme Eligibility', desc: 'Explore public-service information and verify eligibility on the relevant official portal.' },
  { icon: ClipboardList, title: 'Form Filler', desc: 'Organise your information in plain language before completing an official government form.' },
];

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="logo"><Scale size={22} aria-hidden="true" /> Adhikar<span className="logo-accent"> AI</span>
        </div>
        <button className="btn-primary" onClick={onGetStarted}>Get Started <ArrowRight size={16} aria-hidden="true" /></button>
      </nav>

      <section className="hero">
        <div className="hero-badge"><ShieldCheck size={15} aria-hidden="true" /> Independent citizen assistance</div>
        <h1 className="hero-title">
          Your rights exist.<br />
          <span className="hero-accent">Now you can use them.</span>
        </h1>
        <p className="hero-subtitle">
          Adhikar AI translates complex legal and bureaucratic language into clear,
          actionable guidance. File RTIs, know your rights, discover schemes,
          and fill government forms — all in one place.
        </p>
        <div className="hero-actions">
          <button className="btn-primary btn-lg" onClick={onGetStarted}>
            Start for Free →
          </button>
          <span className="hero-note">No sign-up required · Works in English & Hindi</span>
        </div>
        <div className="stats-row">
          <div className="stat-card"><div className="stat-number">1.4B</div><div className="stat-label">Citizens with rights</div></div>
          <div className="stat-card"><div className="stat-number">750+</div><div className="stat-label">Govt schemes available</div></div>
          <div className="stat-card"><div className="stat-number">90%</div><div className="stat-label">RTIs never filed due to complexity</div></div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-label">WHAT ADHIKAR AI CAN DO</div>
        <h2 className="section-title">Four tools. One platform.<br />Complete civic empowerment.</h2>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon"><f.icon size={24} strokeWidth={1.8} aria-hidden="true" /></div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
              <button className="feature-link" onClick={onGetStarted}>Try it <ArrowRight size={15} aria-hidden="true" /></button>
            </div>
          ))}
        </div>
      </section>

      <section className="how-section">
        <div className="section-label">HOW IT WORKS</div>
        <h2 className="section-title">Three steps to your rights</h2>
        <div className="steps-row">
          <div className="step">
            <div className="step-num">01</div>
            <h3>Describe your situation</h3>
            <p>Type or speak in plain language — no legal jargon needed.</p>
          </div>
          <div className="step-arrow" aria-hidden="true"><ArrowRight size={18} /></div>
          <div className="step">
            <div className="step-num">02</div>
            <h3>AI understands & responds</h3>
            <p>Adhikar AI identifies the relevant law or scheme and explains it simply.</p>
          </div>
          <div className="step-arrow" aria-hidden="true"><ArrowRight size={18} /></div>
          <div className="step">
            <div className="step-num">03</div>
            <h3>Take action</h3>
            <p>Get a ready-to-submit RTI, filled form, or clear action plan.</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Know your Adhikar. Exercise your rights.</h2>
        <p>Every Indian citizen deserves to know and use their rights.</p>
        <button className="btn-primary btn-lg" onClick={onGetStarted}>
          Get Started <ArrowRight size={18} aria-hidden="true" />
        </button>
      </section>

      <footer className="landing-footer">
        <div className="logo" style={{justifyContent:'center', marginBottom:'0.5rem'}}>
          <Scale size={22} aria-hidden="true" /> Adhikar<span className="logo-accent"> AI</span>
        </div>
        <p>Built for OOSC 4.0 Hackathon · GDG IIIT Allahabad · PS3 — AI for Civic & Legal Empowerment</p>
        <p><a href="mailto:feedback@adhikarai.example">Contact / feedback</a></p>
        <p className="disclaimer">Adhikar AI provides general legal information, not legal advice. For complex matters, consult a qualified lawyer.</p>
      </footer>
    </div>
  );
}