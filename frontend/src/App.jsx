import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';

import { LandingPage } from './pages/LandingPage';
import { ProfileAnalyzer } from './pages/ProfileAnalyzer';
import { ProjectFinder } from './pages/ProjectFinder';
import { IssueFinder } from './pages/IssueFinder';
import { ContributionTracker } from './pages/ContributionTracker';
import { Dashboard } from './pages/Dashboard';
import { ContributionGuide } from './pages/ContributionGuide';

export function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage setActiveTab={setActiveTab} />;
      case 'profile':
        return <ProfileAnalyzer showToast={showToast} />;
      case 'projects':
        return <ProjectFinder showToast={showToast} />;
      case 'issues':
        return <IssueFinder showToast={showToast} />;
      case 'tracker':
        return <ContributionTracker showToast={showToast} />;
      case 'dashboard':
        return <Dashboard showToast={showToast} />;
      case 'guide':
        return <ContributionGuide showToast={showToast} />;
      default:
        return <LandingPage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="app-container">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="main-content">
          {renderActivePage()}
        </main>

        <Footer />

        {toast && (
          <div className="toast-container">
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
