import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FolderGit2, 
  Star, 
  GitFork, 
  Code2, 
  ExternalLink, 
  Bookmark, 
  Check, 
  Search, 
  SlidersHorizontal 
} from 'lucide-react';

export const ProjectFinder = ({ showToast }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [minStars, setMinStars] = useState(100);
  const [sortBy, setSortBy] = useState('stars');
  const [queryText, setQueryText] = useState('');
  const [beginnerFriendly, setBeginnerFriendly] = useState(false);
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedRepoIds, setSavedRepoIds] = useState(new Set());

  const languages = ['All', 'C', 'C++', 'Python', 'Java', 'JavaScript', 'TypeScript', 'React'];

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/github/projects', {
        params: {
          language: selectedLanguage === 'All' ? null : selectedLanguage,
          min_stars: minStars,
          sort_by: sortBy,
          q: queryText,
          beginner_friendly: beginnerFriendly
        }
      });
      setRepositories(response.data.projects || []);
    } catch (err) {
      if (showToast) showToast('Failed to fetch open-source projects.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [selectedLanguage, minStars, sortBy, beginnerFriendly]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  const handleSaveRepo = async (repo) => {
    try {
      await axios.post('/api/tracker/repos', {
        repo_name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        html_url: repo.html_url,
        language: repo.language,
        stars: repo.stars,
        forks: repo.forks,
        open_issues: repo.open_issues
      });
      setSavedRepoIds(prev => new Set(prev).add(repo.id));
      if (showToast) showToast(`Saved repository '${repo.name}' to tracker!`, 'success');
    } catch (err) {
      if (showToast) showToast('Failed to save repository.', 'error');
    }
  };

  return (
    <div className="project-finder-page">
      <div className="page-header">
        <h1 className="page-title">
          <FolderGit2 size={32} className="text-green" />
          Open Source Project Finder
        </h1>
        <p className="page-subtitle">
          Discover active open-source projects tailored to your tech stack.
        </p>
      </div>

      {/* Language Tabs Selector */}
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

      {/* Filters & Search Control Bar */}
      <div className="glass-card filter-card">
        <form onSubmit={handleSearch} className="filter-form">
          <div className="filter-group flex-1">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="input-field search-input"
              placeholder="Search by keywords (e.g. CLI, machine learning, web)..."
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <SlidersHorizontal size={16} className="filter-icon" />
            <select
              className="select-field"
              value={minStars}
              onChange={(e) => setMinStars(Number(e.target.value))}
            >
              <option value={0}>Any Stars</option>
              <option value={100}>★ &gt;= 100 Stars</option>
              <option value={500}>★ &gt;= 500 Stars</option>
              <option value={1000}>★ &gt;= 1,000 Stars</option>
              <option value={5000}>★ &gt;= 5,000 Stars</option>
            </select>
          </div>

          <div className="filter-group">
            <select
              className="select-field"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="stars">Most Stars</option>
              <option value="updated">Recently Updated</option>
              <option value="forks">Most Forks</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={beginnerFriendly}
                onChange={(e) => setBeginnerFriendly(e.target.checked)}
              />
              <span className="badge badge-purple">Beginner Friendly</span>
            </label>
          </div>

          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </div>

      {/* Repositories Grid */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Searching GitHub repositories...</p>
        </div>
      ) : (
        <div className="grid-2 projects-grid">
          {repositories.map((repo) => {
            const isSaved = savedRepoIds.has(repo.id);
            return (
              <div key={repo.id} className="project-card glass-card">
                <div className="project-header">
                  <div>
                    <h3 className="project-name">{repo.full_name}</h3>
                    <span className="badge badge-purple">{repo.language}</span>
                  </div>

                  <button
                    className={`btn btn-sm ${isSaved ? 'btn-secondary' : 'btn-outline'}`}
                    onClick={() => handleSaveRepo(repo)}
                    disabled={isSaved}
                  >
                    {isSaved ? <Check size={14} /> : <Bookmark size={14} />}
                    <span>{isSaved ? 'Saved' : 'Save Repo'}</span>
                  </button>
                </div>

                <p className="project-desc">{repo.description}</p>

                <div className="project-footer">
                  <div className="project-stats">
                    <span className="stat"><Star size={14} className="text-amber" /> {repo.stars.toLocaleString()}</span>
                    <span className="stat"><GitFork size={14} /> {repo.forks.toLocaleString()}</span>
                    <span className="stat"><Code2 size={14} /> {repo.open_issues} issues</span>
                  </div>

                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                  >
                    <span>GitHub</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .language-tabs-container {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .lang-tab-btn {
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-muted);
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: var(--transition);
        }

        .lang-tab-btn:hover {
          color: var(--text-main);
          border-color: var(--border-hover);
        }

        .lang-tab-btn.active {
          color: #ffffff;
          background: var(--accent-blue);
          border-color: var(--accent-blue);
        }

        .filter-card {
          margin-bottom: 2rem;
        }

        .filter-form {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .filter-group {
          position: relative;
          display: flex;
          align-items: center;
        }

        .flex-1 { flex: 1; min-width: 260px; }

        .filter-icon {
          position: absolute;
          left: 0.85rem;
          color: var(--text-muted);
          pointer-events: none;
        }

        .select-field {
          padding-left: 2.2rem;
        }

        .projects-grid {
          gap: 1.5rem;
        }

        .project-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1.25rem;
        }

        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }

        .project-name {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.35rem;
        }

        .project-desc {
          color: var(--text-muted);
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .project-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--border-color);
          padding-top: 0.85rem;
        }

        .project-stats {
          display: flex;
          gap: 1rem;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .loading-state {
          text-align: center;
          padding: 4rem 1rem;
          color: var(--text-muted);
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border-color);
          border-top-color: var(--accent-blue);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem auto;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
