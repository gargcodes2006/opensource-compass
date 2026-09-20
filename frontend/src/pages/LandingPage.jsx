import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  UserCheck, 
  FolderGit2, 
  CheckCircle2, 
  Kanban, 
  ShieldCheck, 
  Terminal, 
  GitFork, 
  GitPullRequest,
  BookOpen
} from 'lucide-react';

export const LandingPage = ({ setActiveTab }) => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge">
          <Sparkles size={14} className="sparkle-icon" />
          <span>The Ultimate Guide for Beginner Open Source Contributors</span>
        </div>

        <h1 className="hero-title">
          Find Your First <span className="text-gradient">Open Source</span> Contribution
        </h1>

        <p className="hero-subtitle">
          Discover beginner-friendly repositories, analyze GitHub profiles, and track your open-source journey with real-time analytics.
        </p>

        <div className="hero-actions">
          <button 
            className="btn btn-primary hero-btn"
            onClick={() => setActiveTab('projects')}
          >
            <FolderGit2 size={18} />
            <span>Explore Projects</span>
            <ArrowRight size={16} />
          </button>

          <button 
            className="btn btn-secondary hero-btn"
            onClick={() => setActiveTab('profile')}
          >
            <UserCheck size={18} />
            <span>Analyze GitHub Profile</span>
          </button>
        </div>

        {/* Floating Developer Preview Box */}
        <div className="hero-preview-card glass-card">
          <div className="terminal-header">
            <div className="terminal-dots">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
            </div>
            <div className="terminal-title">opensource-compass --status</div>
          </div>
          <div className="terminal-body">
            <p className="cmd-line"><span className="cmd-prompt">$</span> git checkout -b my-first-contribution</p>
            <p className="cmd-line text-green"><span className="cmd-prompt">✓</span> Found 1,240+ issues labeled 'good first issue'</p>
            <p className="cmd-line text-blue"><span className="cmd-prompt">ℹ</span> 50+ Popular Open Source Repositories Indexed</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Everything You Need to Get Started</h2>
          <p className="section-subtitle">Designed specifically for students, boot campers, and new developers.</p>
        </div>

        <div className="grid-3">
          <div className="feature-card glass-card">
            <div className="feature-icon icon-blue">
              <UserCheck size={24} />
            </div>
            <h3>GitHub Profile Analyzer</h3>
            <p>Inspect any developer's GitHub profile. Visualize language distributions, repository popularity, and star metrics.</p>
          </div>

          <div className="feature-card glass-card">
            <div className="feature-icon icon-green">
              <FolderGit2 size={24} />
            </div>
            <h3>Project Finder</h3>
            <p>Filter open-source repositories by language (C++, Python, JS, React, etc.), stars, and recent updates.</p>
          </div>

          <div className="feature-card glass-card">
            <div className="feature-icon icon-purple">
              <CheckCircle2 size={24} />
            </div>
            <h3>Good First Issue Finder</h3>
            <p>Directly search GitHub for issues marked with <code>good first issue</code> and <code>help wanted</code> labels.</p>
          </div>

          <div className="feature-card glass-card">
            <div className="feature-icon icon-amber">
              <Kanban size={24} />
            </div>
            <h3>Personal Tracker</h3>
            <p>Save repositories and track your contribution status from <em>Not Started</em> all the way to <em>PR Merged</em>.</p>
          </div>

          <div className="feature-card glass-card">
            <div className="feature-icon icon-blue">
              <Terminal size={24} />
            </div>
            <h3>Interactive Git Guide</h3>
            <p>Step-by-step instructions for forking, cloning, branching, committing, and opening your first pull request.</p>
          </div>

          <div className="feature-card glass-card">
            <div className="feature-icon icon-green">
              <ShieldCheck size={24} />
            </div>
            <h3>SQLite & Privacy First</h3>
            <p>Your contribution state is stored locally in SQLite with optional GitHub token security in environment variables.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Four simple steps from learning to your first merged Pull Request.</p>
        </div>

        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <h4>Search & Discover</h4>
            <p>Use the Project or Issue Finder to locate beginner-friendly repositories matching your stack.</p>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <h4>Save to Tracker</h4>
            <p>Bookmark your favorite issues and track your progress in your personal SQLite backend database.</p>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <h4>Fork & Solve</h4>
            <p>Follow our interactive Git Guide to clone the repo, create a feature branch, and implement your changes.</p>
          </div>

          <div className="step-card">
            <div className="step-number">4</div>
            <h4>Submit Pull Request</h4>
            <p>Push your code and submit your Pull Request to become an official open-source contributor!</p>
          </div>
        </div>
      </section>

      {/* Why Open Source Section */}
      <section className="why-section glass-card">
        <div className="why-content">
          <h2>Why Contribute to Open Source?</h2>
          <div className="why-grid">
            <div className="why-item">
              <GitFork size={20} className="text-blue" />
              <div>
                <strong>Build Real Portfolio Proof</strong>
                <p>Recruiters look for public GitHub commits over resume bullet points.</p>
              </div>
            </div>

            <div className="why-item">
              <GitPullRequest size={20} className="text-green" />
              <div>
                <strong>Learn Production Workflows</strong>
                <p>Master code reviews, CI/CD pipelines, and git teamwork early in your career.</p>
              </div>
            </div>

            <div className="why-item">
              <BookOpen size={20} className="text-purple" />
              <div>
                <strong>Join Global Communities</strong>
                <p>Connect with seasoned engineers and maintainers worldwide.</p>
              </div>
            </div>
          </div>

          <div className="why-cta">
            <button className="btn btn-primary" onClick={() => setActiveTab('issues')}>
              <CheckCircle2 size={18} />
              <span>Find Good First Issues Now</span>
            </button>
          </div>
        </div>
      </section>

      <style>{`
        .landing-page {
          display: flex;
          flex-direction: column;
          gap: 4rem;
        }

        .hero-section {
          text-align: center;
          padding: 3rem 1rem 1rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 0.9rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--accent-purple);
          background: var(--accent-purple-bg);
          border: 1px solid rgba(163, 113, 247, 0.3);
          border-radius: var(--radius-full);
          margin-bottom: 1.5rem;
        }

        .hero-title {
          font-size: 3.25rem;
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.03em;
          max-width: 850px;
          margin-bottom: 1.25rem;
        }

        .text-gradient {
          background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 1.2rem;
          color: var(--text-muted);
          max-width: 650px;
          margin-bottom: 2rem;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .hero-btn {
          padding: 0.85rem 1.75rem;
          font-size: 1rem;
        }

        .hero-preview-card {
          width: 100%;
          max-width: 680px;
          text-align: left;
          background: #0d1117;
          border: 1px solid var(--border-color);
        }

        .terminal-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 0.75rem;
        }

        .terminal-dots {
          display: flex;
          gap: 0.35rem;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .dot-red { background: #ff5f56; }
        .dot-yellow { background: #ffbd2e; }
        .dot-green { background: #27c93f; }

        .terminal-title {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .terminal-body {
          font-family: var(--font-mono);
          font-size: 0.88rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .cmd-prompt { color: var(--accent-purple); font-weight: bold; }
        .text-green { color: var(--accent-green); }
        .text-blue { color: var(--accent-blue); }

        .section-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .section-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .section-subtitle {
          color: var(--text-muted);
          font-size: 1rem;
          margin-top: 0.25rem;
        }

        .feature-card {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-blue { background: var(--accent-blue-bg); color: var(--accent-blue); }
        .icon-green { background: rgba(35, 134, 54, 0.15); color: var(--accent-green); }
        .icon-purple { background: var(--accent-purple-bg); color: var(--accent-purple); }
        .icon-amber { background: var(--accent-amber-bg); color: var(--accent-amber); }

        .feature-card h3 {
          font-size: 1.15rem;
          font-weight: 600;
        }

        .feature-card p {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .steps-container {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .step-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          position: relative;
        }

        .step-number {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--accent-blue);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .step-card h4 {
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
        }

        .step-card p {
          font-size: 0.88rem;
          color: var(--text-muted);
        }

        .why-section {
          padding: 2.5rem;
        }

        .why-content h2 {
          font-size: 1.75rem;
          margin-bottom: 1.5rem;
        }

        .why-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .why-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .why-cta {
          display: flex;
          justify-content: flex-end;
        }

        @media (max-width: 992px) {
          .hero-title { font-size: 2.5rem; }
          .steps-container { grid-template-columns: repeat(2, 1fr); }
          .why-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 640px) {
          .hero-title { font-size: 2rem; }
          .steps-container { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};
