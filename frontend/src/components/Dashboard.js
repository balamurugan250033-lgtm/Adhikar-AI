import React, { useState } from 'react';
import RTITool from './RTITool';
import RightsTool from './RightsTool';
import SchemeTool from './SchemeTool';
import FormTool from './FormTool';
import { ClipboardList, FileText, Landmark, Scale } from 'lucide-react';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('rti');

  const renderActiveTool = () => {
    switch (activeTab) {
      case 'rti':
        return <RTITool />;
      case 'rights':
        return <RightsTool />;
      case 'schemes':
        return <SchemeTool />;
      case 'forms':
        return <FormTool />;
      default:
        return <RTITool />;
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Adhikar AI Portal</h1>
        <p>Access legal guidance, draft applications, and navigate civic rights.</p>
      </header>

      <div className="dashboard-nav">
        <button
          className={`nav-tab ${activeTab === 'rti' ? 'active' : ''}`}
          onClick={() => setActiveTab('rti')}
        >
          <FileText size={16} aria-hidden="true" /> RTI Draft Generator
        </button>
        <button
          className={`nav-tab ${activeTab === 'rights' ? 'active' : ''}`}
          onClick={() => setActiveTab('rights')}
        >
          <Scale size={16} aria-hidden="true" /> Know Your Rights
        </button>
        <button
          className={`nav-tab ${activeTab === 'schemes' ? 'active' : ''}`}
          onClick={() => setActiveTab('schemes')}
        >
          <Landmark size={16} aria-hidden="true" /> Government Schemes
        </button>
        <button
          className={`nav-tab ${activeTab === 'forms' ? 'active' : ''}`}
          onClick={() => setActiveTab('forms')}
        >
          <ClipboardList size={16} aria-hidden="true" /> Legal Form Assistant
        </button>
      </div>

      <main className="dashboard-main-content">
        {renderActiveTool()}
      </main>
    </div>
  );
}

export default Dashboard;