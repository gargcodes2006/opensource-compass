import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  Compass, 
  UserCheck, 
  FolderGit2, 
  CheckCircle2, 
  Kanban, 
  LayoutDashboard, 
  BookOpen, 
  Sun, 
  Moon 
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'landing', label: 'Home', icon: Compass },
    { id: 'profile', label: 'Profile Analyzer', icon: UserCheck },
    { id: 'projects', label: 'Project Finder', icon: FolderGit2 },
    { id: 'issues', label: 'Good First Issues', icon: CheckCircle2 },
    { id: 'tracker', label: 'Contribution Tracker', icon: Kanban },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'guide', label: 'Contribution Guide', icon: BookOpen },
  ];

  return (
    <nav className="navbar-container">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <div className="navbar-brand" onClick={() => setActiveTab('landing')}>
          <div className="brand-icon">
            <Compass size={24} className="brand-svg" />
          </div>
          <span className="brand-title">OpenSource<span className="brand-highlight">Compass</span></span>
        </div>

        {/* Navigation Tabs */}
        <div className="navbar-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-link-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="navbar-actions">
          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      <style>{`
        .navbar-container {
          background-color: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: var(--glass-backdrop);
        }

        .navbar-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1.5rem;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          cursor: pointer;
        }

        .brand-icon {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
        }

        .brand-title {
          font-size: 1.2rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--text-main);
        }

        .brand-highlight {
          color: var(--accent-blue);
        }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .nav-link-btn {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.55rem 0.85rem;
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--text-muted);
          background: transparent;
          border: 1px solid transparent;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition);
        }

        .nav-link-btn:hover {
          color: var(--text-main);
          background: var(--bg-tertiary);
        }

        .nav-link-btn.active {
          color: var(--accent-blue);
          background: var(--accent-blue-bg);
          border-color: rgba(56, 139, 253, 0.3);
          font-weight: 600;
        }

        .theme-toggle-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          background: var(--bg-tertiary);
          color: var(--text-main);
          cursor: pointer;
          transition: var(--transition);
        }

        .theme-toggle-btn:hover {
          border-color: var(--border-hover);
          color: var(--accent-blue);
        }

        @media (max-width: 992px) {
          .navbar-links span {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
};
