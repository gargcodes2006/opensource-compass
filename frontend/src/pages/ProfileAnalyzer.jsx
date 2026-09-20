import React, { useState } from 'react';
import axios from 'axios';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title 
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { 
  UserCheck, 
  MapPin, 
  Users, 
  Folder, 
  Calendar, 
  Star, 
  GitFork, 
  AlertCircle, 
  ExternalLink, 
  Search, 
  Code2 
} from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title
);

export const ProfileAnalyzer = ({ showToast }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!username || !username.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await axios.get(`/api/github/profile/${username.trim()}`);
      setData(response.data);
      if (showToast) showToast(`Profile for '${username}' loaded successfully!`, 'success');
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'Failed to fetch profile. User might not exist or API rate limit hit.';
      setError(errMsg);
      if (showToast) showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Prepare Charts Data
  const getLanguageChartData = () => {
    if (!data || !data.stats || !data.stats.languages) return null;
    const languages = Object.keys(data.stats.languages);
    const counts = Object.values(data.stats.languages);

    const colors = [
      '#388bfd', '#2ea043', '#a371f7', '#d29922', '#f85149', 
      '#58a6ff', '#7ee787', '#bc8cff', '#e3b341', '#ff7b72'
    ];

    return {
      labels: languages,
      datasets: [
        {
          label: 'Repositories',
          data: counts,
          backgroundColor: colors.slice(0, languages.length),
          borderColor: '#161b22',
          borderWidth: 2,
        },
      ],
    };
  };

  const getPopularityChartData = () => {
    if (!data || !data.repositories) return null;
    // Top 8 repos by stars
    const topRepos = [...data.repositories]
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 8);

    return {
      labels: topRepos.map(r => r.name),
      datasets: [
        {
          label: 'Stars',
          data: topRepos.map(r => r.stars),
          backgroundColor: '#388bfd',
          borderRadius: 6,
        },
        {
          label: 'Forks',
          data: topRepos.map(r => r.forks),
          backgroundColor: '#a371f7',
          borderRadius: 6,
        }
      ],
    };
  };

  const getStarsDistributionChartData = () => {
    if (!data || !data.stats) return null;
    const dist = data.stats.stars_distribution || {
      "0-10": 0, "11-50": 0, "51-100": 0, "100+": 0
    };

    return {
      labels: Object.keys(dist),
      datasets: [
        {
          label: 'Repositories',
          data: Object.values(dist),
          backgroundColor: ['#d29922', '#388bfd', '#a371f7', '#2ea043'],
          borderRadius: 6,
        }
      ],
    };
  };

  return (
    <div className="profile-analyzer-page">
      <div className="page-header">
        <h1 className="page-title">
          <UserCheck size={32} className="text-blue" />
          GitHub Profile Analyzer
        </h1>
        <p className="page-subtitle">
          Analyze developer profiles, programming language usage, and repository popularity.
        </p>
      </div>

      {/* Search Input Card */}
      <div className="glass-card search-card">
        <form onSubmit={handleSearch} className="search-form">
          <div className="input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="input-field search-input"
              placeholder="Enter GitHub username (e.g. torvalds, gaearon, antirez)..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze Profile'}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-banner glass-card">
          <AlertCircle size={20} className="text-red" />
          <span>{error}</span>
        </div>
      )}

      {/* Profile Results */}
      {data && (
        <div className="results-container">
          {/* Profile Overview Card */}
          <div className="profile-overview-card glass-card">
            <div className="profile-avatar-wrapper">
              <img 
                src={data.profile.avatar_url} 
                alt={data.profile.login} 
                className="profile-avatar"
              />
            </div>
            <div className="profile-details">
              <div className="profile-header-info">
                <div>
                  <h2 className="profile-name">{data.profile.name}</h2>
                  <a 
                    href={data.profile.html_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="profile-username"
                  >
                    @{data.profile.login} <ExternalLink size={14} />
                  </a>
                </div>
                <div className="profile-date badge">
                  <Calendar size={14} /> Joined {new Date(data.profile.created_at).toLocaleDateString()}
                </div>
              </div>

              <p className="profile-bio">{data.profile.bio}</p>

              <div className="profile-stats-meta">
                <div className="meta-item">
                  <MapPin size={16} /> {data.profile.location}
                </div>
                <div className="meta-item">
                  <Users size={16} /> <strong>{data.profile.followers}</strong> followers · <strong>{data.profile.following}</strong> following
                </div>
                <div className="meta-item">
                  <Folder size={16} /> <strong>{data.profile.public_repos}</strong> public repos
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Charts Grid */}
          <div className="grid-3 charts-grid">
            <div className="glass-card chart-card">
              <h3>Programming Languages</h3>
              <div className="chart-wrapper">
                {getLanguageChartData() ? (
                  <Doughnut 
                    data={getLanguageChartData()} 
                    options={{ 
                      responsive: true, 
                      maintainAspectRatio: false,
                      plugins: { legend: { position: 'bottom', labels: { color: '#8b949e' } } } 
                    }} 
                  />
                ) : (
                  <p className="text-muted">No language data available</p>
                )}
              </div>
            </div>

            <div className="glass-card chart-card">
              <h3>Top Repositories Popularity</h3>
              <div className="chart-wrapper">
                {getPopularityChartData() ? (
                  <Bar 
                    data={getPopularityChartData()} 
                    options={{ 
                      responsive: true, 
                      maintainAspectRatio: false,
                      plugins: { legend: { position: 'bottom', labels: { color: '#8b949e' } } },
                      scales: {
                        x: { ticks: { color: '#8b949e' }, grid: { color: '#30363d' } },
                        y: { ticks: { color: '#8b949e' }, grid: { color: '#30363d' } }
                      }
                    }} 
                  />
                ) : (
                  <p className="text-muted">No repository popularity data available</p>
                )}
              </div>
            </div>

            <div className="glass-card chart-card">
              <h3>Stars Distribution</h3>
              <div className="chart-wrapper">
                {getStarsDistributionChartData() ? (
                  <Bar 
                    data={getStarsDistributionChartData()} 
                    options={{ 
                      responsive: true, 
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: {
                        x: { ticks: { color: '#8b949e' }, grid: { color: '#30363d' } },
                        y: { ticks: { color: '#8b949e', stepSize: 1 }, grid: { color: '#30363d' } }
                      }
                    }} 
                  />
                ) : (
                  <p className="text-muted">No stars distribution data available</p>
                )}
              </div>
            </div>
          </div>

          {/* Repositories List */}
          <div className="repos-section">
            <h3 className="section-title">Public Repositories ({data.repositories.length})</h3>
            <div className="grid-2 repos-grid">
              {data.repositories.map((repo) => (
                <div key={repo.id} className="repo-card glass-card">
                  <div className="repo-card-header">
                    <a href={repo.html_url} target="_blank" rel="noreferrer" className="repo-title-link">
                      <Folder size={18} className="text-blue" />
                      <span>{repo.name}</span>
                    </a>
                    <span className="badge badge-blue">{repo.language}</span>
                  </div>

                  <p className="repo-desc">{repo.description}</p>

                  <div className="repo-stats-footer">
                    <span className="stat-item"><Star size={14} className="text-amber" /> {repo.stars}</span>
                    <span className="stat-item"><GitFork size={14} /> {repo.forks}</span>
                    <span className="stat-item"><Code2 size={14} /> {repo.open_issues} issues</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .search-card {
          margin-bottom: 2rem;
        }

        .input-wrapper {
          position: relative;
          flex: 1;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .search-input {
          padding-left: 2.75rem;
        }

        .error-banner {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(248, 81, 73, 0.1);
          border-color: rgba(248, 81, 73, 0.4);
          color: var(--text-main);
          margin-bottom: 2rem;
        }

        .profile-overview-card {
          display: flex;
          gap: 2rem;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .profile-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 3px solid var(--accent-blue);
          object-fit: cover;
        }

        .profile-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .profile-header-info {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .profile-name {
          font-size: 1.75rem;
          font-weight: 700;
        }

        .profile-username {
          font-size: 1rem;
          color: var(--accent-blue);
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }

        .profile-bio {
          font-size: 0.95rem;
          color: var(--text-main);
        }

        .profile-stats-meta {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .charts-grid {
          margin-bottom: 2.5rem;
        }

        .chart-card {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .chart-wrapper {
          height: 260px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .repos-grid {
          margin-top: 1rem;
        }

        .repo-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1rem;
        }

        .repo-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }

        .repo-title-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .repo-title-link:hover {
          color: var(--accent-blue);
        }

        .repo-desc {
          color: var(--text-muted);
          font-size: 0.88rem;
          flex: 1;
        }

        .repo-stats-footer {
          display: flex;
          gap: 1.25rem;
          font-size: 0.82rem;
          color: var(--text-muted);
          border-top: 1px solid var(--border-color);
          padding-top: 0.75rem;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        @media (max-width: 640px) {
          .profile-overview-card {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .profile-header-info {
            flex-direction: column;
            align-items: center;
          }
          .profile-stats-meta {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};
