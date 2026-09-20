import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement 
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { 
  LayoutDashboard, 
  FolderGit2, 
  CheckCircle2, 
  Clock, 
  CheckCircle, 
  Code2 
} from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export const Dashboard = ({ showToast }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/dashboard/stats');
      setStats(response.data);
    } catch (err) {
      if (showToast) showToast('Failed to load dashboard metrics.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const getStatusChartData = () => {
    if (!stats || !stats.status_breakdown) return null;
    const labels = Object.keys(stats.status_breakdown);
    const data = Object.values(stats.status_breakdown);

    return {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: [
            '#8b949e', // Not Started
            '#d29922', // Learning
            '#388bfd', // Working
            '#a371f7', // PR Created
            '#2ea043'  // Completed
          ],
          borderColor: '#161b22',
          borderWidth: 2,
        },
      ],
    };
  };

  const getLanguageChartData = () => {
    if (!stats || !stats.language_breakdown) return null;
    const languages = Object.keys(stats.language_breakdown);
    const counts = Object.values(stats.language_breakdown);

    return {
      labels: languages.length > 0 ? languages : ['None'],
      datasets: [
        {
          label: 'Saved & Tracked Items',
          data: counts.length > 0 ? counts : [0],
          backgroundColor: '#388bfd',
          borderRadius: 6,
        },
      ],
    };
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1 className="page-title">
          <LayoutDashboard size={32} className="text-blue" />
          Analytics Dashboard
        </h1>
        <p className="page-subtitle">
          Real-time metrics tracking your open-source journey, contributions, and tech stacks.
        </p>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Calculating dashboard analytics...</p>
        </div>
      ) : (
        <div className="dashboard-content">
          {/* Top Summary Metrics Grid */}
          <div className="grid-4 metrics-grid">
            <div className="metric-card glass-card">
              <div className="metric-header">
                <span className="metric-title">Saved Repositories</span>
                <FolderGit2 size={20} className="text-blue" />
              </div>
              <div className="metric-value">{stats?.total_saved_repos || 0}</div>
              <p className="metric-desc">Projects in bookmark list</p>
            </div>

            <div className="metric-card glass-card">
              <div className="metric-header">
                <span className="metric-title">Saved Issues</span>
                <CheckCircle2 size={20} className="text-purple" />
              </div>
              <div className="metric-value">{stats?.total_saved_issues || 0}</div>
              <p className="metric-desc">Good first issues saved</p>
            </div>

            <div className="metric-card glass-card">
              <div className="metric-header">
                <span className="metric-title">Active Contributions</span>
                <Clock size={20} className="text-amber" />
              </div>
              <div className="metric-value">{stats?.active_contributions || 0}</div>
              <p className="metric-desc">In progress or PR open</p>
            </div>

            <div className="metric-card glass-card">
              <div className="metric-header">
                <span className="metric-title">Completed PRs</span>
                <CheckCircle size={20} className="text-green" />
              </div>
              <div className="metric-value">{stats?.completed_contributions || 0}</div>
              <p className="metric-desc">Successfully merged PRs</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid-2 dashboard-charts-grid">
            <div className="glass-card chart-card">
              <h3>Contribution Status Breakdown</h3>
              <div className="chart-wrapper">
                {getStatusChartData() ? (
                  <Doughnut 
                    data={getStatusChartData()} 
                    options={{ 
                      responsive: true, 
                      maintainAspectRatio: false,
                      plugins: { legend: { position: 'bottom', labels: { color: '#8b949e' } } } 
                    }} 
                  />
                ) : (
                  <p className="text-muted">No tracker items available</p>
                )}
              </div>
            </div>

            <div className="glass-card chart-card">
              <h3>Programming Languages Explored</h3>
              <div className="chart-wrapper">
                {getLanguageChartData() ? (
                  <Bar 
                    data={getLanguageChartData()} 
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
                  <p className="text-muted">No language data available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .metrics-grid {
          margin-bottom: 2rem;
        }

        .metric-card {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .metric-title {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .metric-value {
          font-size: 2.25rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.02em;
        }

        .metric-desc {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .dashboard-charts-grid {
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
};
