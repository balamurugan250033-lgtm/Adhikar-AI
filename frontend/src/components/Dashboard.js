import React, { useState } from 'react';
import RTITool from './RTITool';
import RightsTool from './RightsTool';
import SchemeTool from './SchemeTool';
import FormTool from './FormTool';

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
          📜 RTI Draft Generator
        </button>
        <button
          className={`nav-tab ${activeTab === 'rights' ? 'active' : ''}`}
          onClick={() => setActiveTab('rights')}
        >
          ⚖️ Know Your Rights
        </button>
        <button
          className={`nav-tab ${activeTab === 'schemes' ? 'active' : ''}`}
          onClick={() => setActiveTab('schemes')}
        >
          🏛️ Government Schemes
        </button>
        <button
          className={`nav-tab ${activeTab === 'forms' ? 'active' : ''}`}
          onClick={() => setActiveTab('forms')}
        >
          📁 Legal Form Assistant
        </button>
      </div>

      <main className="dashboard-main-content">
        {renderActiveTool()}
      </main>
    </div>
  );
}

export default Dashboard;