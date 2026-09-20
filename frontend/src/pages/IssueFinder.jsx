import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CheckCircle2, 
  Tag, 
  Calendar, 
  ExternalLink, 
  Bookmark, 
  Check, 
  Search, 
  GitPullRequest, 
  MessageSquare 
} from 'lucide-react';

export const IssueFinder = ({ showToast }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [useGoodFirstIssue, setUseGoodFirstIssue] = useState(true);
  const [useHelpWanted, setUseHelpWanted] = useState(true);
  const [queryText, setQueryText] = useState('');
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedIssueIds, setSavedIssueIds] = useState(new Set());

  const languages = ['All', 'C', 'C++', 'Python', 'Java', 'JavaScript', 'TypeScript', 'React'];

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const labels = [];
      if (useGoodFirstIssue) labels.push('good first issue');
      if (useHelpWanted) labels.push('help wanted');

      const response = await axios.get('/api/github/issues', {
        params: {
          language: selectedLanguage === 'All' ? null : selectedLanguage,
          labels: labels,
          q: queryText
        }
      });
      setIssues(response.data.issues || []);
    } catch (err) {
      if (showToast) showToast('Failed to search GitHub issues.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [selectedLanguage, useGoodFirstIssue, useHelpWanted]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchIssues();
  };

  const handleSaveIssue = async (issue) => {
    try {
      await axios.post('/api/tracker/items', {
        title: issue.title,
        html_url: issue.html_url,
        repo_name: issue.repo_name,
        repo_url: issue.repo_url,
        language: issue.language,
        issue_number: issue.issue_number,
        status: 'Not Started',
        notes: `Saved from Issue Finder (Labels: ${issue.labels.join(', ')})`
      });
      setSavedIssueIds(prev => new Set(prev).add(issue.id));
      if (showToast) showToast(`Issue #${issue.issue_number} saved to contribution tracker!`, 'success');
    } catch (err) {
      if (showToast) showToast('Failed to save issue.', 'error');
    }
  };

  return (
    <div className="issue-finder-page">
      <div className="page-header">
        <h1 className="page-title">
          <CheckCircle2 size={32} className="text-purple" />
          Good First Issue Finder
        </h1>
        <p className="page-subtitle">
          Find curated beginner-friendly issues waiting for your pull request.
        </p>
      </div>

      {/* Language Tabs */}
      <div className="language-tabs-container">
        {languages.map((lang) => (
          <button
            key={lang}
            className={`lang-tab-btn ${selectedLanguage === lang ? 'active' : ''}`}
            onClick={() => setSelectedLanguage(lang)}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* Label Filters & Keyword Form */}
      <div className="glass-card filter-card">
        <form onSubmit={handleSearch} className="filter-form">
          <div className="filter-group flex-1">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="input-field search-input"
              placeholder="Filter by keyword in issue title (e.g. docs, bug, fix)..."
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
            />
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={useGoodFirstIssue}
                onChange={(e) => setUseGoodFirstIssue(e.target.checked)}
              />
              <span className="badge badge-purple">good first issue</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={useHelpWanted}
                onChange={(e) => setUseHelpWanted(e.target.checked)}
              />
              <span className="badge badge-blue">help wanted</span>
            </label>
          </div>

          <button type="submit" className="btn btn-primary">
            Search Issues
          </button>
        </form>
      </div>

      {/* Issues List */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Fetching open issues from GitHub...</p>
        </div>
      ) : (
        <div className="issues-list">
          {issues.map((issue) => {
            const isSaved = savedIssueIds.has(issue.id);
            return (
              <div key={issue.id} className="issue-card glass-card">
                <div className="issue-main">
                  <div className="issue-repo-bar">
                    <span className="repo-badge">
                      <GitPullRequest size={14} />
                      <a href={issue.repo_url} target="_blank" rel="noreferrer">
                        {issue.repo_name}
                      </a>
                    </span>
                    <span className="issue-date">
                      <Calendar size={13} /> {new Date(issue.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="issue-title">
                    <a href={issue.html_url} target="_blank" rel="noreferrer">
                      #{issue.issue_number}: {issue.title}
                    </a>
                  </h3>

                  <p className="issue-snippet">{issue.body}</p>

                  <div className="issue-labels">
                    <Tag size={14} className="text-muted" />
                    {issue.labels.map((lbl, idx) => (
                      <span key={idx} className="badge badge-amber">{lbl}</span>
                    ))}
                  </div>
                </div>

                <div className="issue-actions">
                  <button
                    className={`btn btn-sm ${isSaved ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={() => handleSaveIssue(issue)}
                    disabled={isSaved}
                  >
                    {isSaved ? <Check size={14} /> : <Bookmark size={14} />}
                    <span>{isSaved ? 'Saved to Tracker' : 'Save Issue'}</span>
                  </button>

                  <a
                    href={issue.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    <span>View on GitHub</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .checkbox-group {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          cursor: pointer;
        }

        .issues-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .issue-card {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1.5rem;
        }

        .issue-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .issue-repo-bar {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.85rem;
        }

        .repo-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-weight: 600;
        }

        .repo-badge a {
          color: var(--text-main);
        }

        .repo-badge a:hover {
          color: var(--accent-blue);
        }

        .issue-date {
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .issue-title a {
          color: var(--text-main);
          font-size: 1.1rem;
          font-weight: 600;
        }

        .issue-title a:hover {
          color: var(--accent-blue);
        }

        .issue-snippet {
          color: var(--text-muted);
          font-size: 0.88rem;
        }

        .issue-labels {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .issue-actions {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          min-width: 150px;
        }

        @media (max-width: 640px) {
          .issue-card {
            flex-direction: column;
          }
          .issue-actions {
            width: 100%;
            flex-direction: row;
          }
          .issue-actions button, .issue-actions a {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
};
