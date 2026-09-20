import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Kanban, 
  Trash2, 
  ExternalLink, 
  Edit3, 
  Save, 
  CheckCircle, 
  Clock, 
  GitPullRequest, 
  FileText 
} from 'lucide-react';

export const ContributionTracker = ({ showToast }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteContent, setNoteContent] = useState('');

  const validStatuses = [
    'Not Started',
    'Learning',
    'Working',
    'Pull Request Created',
    'Completed'
  ];

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/tracker/items');
      setItems(response.data || []);
    } catch (err) {
      if (showToast) showToast('Failed to load contribution tracker items.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      const response = await axios.put(`/api/tracker/items/${itemId}`, {
        status: newStatus
      });
      setItems(items.map(item => item.id === itemId ? response.data : item));
      if (showToast) showToast(`Updated status to '${newStatus}'`, 'success');
    } catch (err) {
      if (showToast) showToast('Failed to update status.', 'error');
    }
  };

  const handleSaveNotes = async (itemId) => {
    try {
      const response = await axios.put(`/api/tracker/items/${itemId}`, {
        notes: noteContent
      });
      setItems(items.map(item => item.id === itemId ? response.data : item));
      setEditingNoteId(null);
      if (showToast) showToast('Notes saved successfully!', 'success');
    } catch (err) {
      if (showToast) showToast('Failed to save notes.', 'error');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to remove this item from your tracker?')) return;
    try {
      await axios.delete(`/api/tracker/items/${itemId}`);
      setItems(items.filter(item => item.id !== itemId));
      if (showToast) showToast('Item removed from tracker.', 'info');
    } catch (err) {
      if (showToast) showToast('Failed to delete item.', 'error');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed': return 'badge-green';
      case 'Pull Request Created': return 'badge-purple';
      case 'Working': return 'badge-blue';
      case 'Learning': return 'badge-amber';
      default: return '';
    }
  };

  return (
    <div className="tracker-page">
      <div className="page-header">
        <h1 className="page-title">
          <Kanban size={32} className="text-amber" />
          Contribution Tracker
        </h1>
        <p className="page-subtitle">
          Manage your saved issues, track pull request milestones, and keep notes in your SQLite database.
        </p>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your saved contributions...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state glass-card">
          <FileText size={48} className="text-muted" />
          <h3>No Contribution Items Saved Yet</h3>
          <p>Browse the <strong>Project Finder</strong> or <strong>Good First Issue Finder</strong> and click 'Save Issue' to track your journey here!</p>
        </div>
      ) : (
        <div className="tracker-list">
          {items.map((item) => (
            <div key={item.id} className="tracker-item-card glass-card">
              <div className="tracker-item-main">
                <div className="tracker-item-header">
                  <div className="tracker-title-area">
                    <span className="repo-name-label">
                      <GitPullRequest size={14} /> {item.repo_name}
                    </span>
                    <h3 className="tracker-item-title">
                      <a href={item.html_url} target="_blank" rel="noreferrer">
                        {item.title}
                      </a>
                    </h3>
                  </div>

                  <div className="tracker-actions">
                    <select
                      className={`select-field status-select ${getStatusBadgeClass(item.status)}`}
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    >
                      {validStatuses.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>

                    <button
                      className="btn-icon btn-danger"
                      onClick={() => handleDeleteItem(item.id)}
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Notes Section */}
                <div className="notes-box">
                  {editingNoteId === item.id ? (
                    <div className="notes-edit-wrapper">
                      <textarea
                        className="input-field notes-textarea"
                        placeholder="Add personal notes (e.g. branch name, PR link, command used)..."
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                      />
                      <div className="notes-buttons">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleSaveNotes(item.id)}
                        >
                          <Save size={14} /> Save Notes
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setEditingNoteId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="notes-display-wrapper">
                      <p className="notes-text">
                        <strong>Notes:</strong> {item.notes || 'No notes added yet.'}
                      </p>
                      <button
                        className="btn-icon"
                        onClick={() => {
                          setEditingNoteId(item.id);
                          setNoteContent(item.notes || '');
                        }}
                        title="Edit notes"
                      >
                        <Edit3 size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="tracker-item-footer">
                  <span className="time-info">
                    <Clock size={13} /> Updated {new Date(item.updated_at).toLocaleString()}
                  </span>
                  <a
                    href={item.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                  >
                    <span>View Issue on GitHub</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .empty-state h3 {
          font-size: 1.3rem;
        }

        .empty-state p {
          color: var(--text-muted);
          max-width: 480px;
        }

        .tracker-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .tracker-item-card {
          padding: 1.5rem;
        }

        .tracker-item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1.5rem;
          margin-bottom: 1rem;
        }

        .repo-name-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--accent-blue);
          display: flex;
          align-items: center;
          gap: 0.35rem;
          margin-bottom: 0.25rem;
        }

        .tracker-item-title a {
          color: var(--text-main);
          font-size: 1.15rem;
          font-weight: 700;
        }

        .tracker-item-title a:hover {
          color: var(--accent-blue);
        }

        .tracker-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .status-select {
          padding: 0.45rem 0.85rem;
          font-weight: 600;
          font-size: 0.85rem;
          border-radius: var(--radius-md);
        }

        .badge-green { background: rgba(35, 134, 54, 0.2); color: var(--accent-green); border-color: rgba(35, 134, 54, 0.4); }

        .btn-icon {
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-muted);
          padding: 0.45rem;
          border-radius: var(--radius-md);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }

        .btn-icon:hover {
          color: var(--text-main);
          background: var(--bg-tertiary);
        }

        .btn-danger:hover {
          color: var(--accent-red);
          border-color: rgba(248, 81, 73, 0.4);
        }

        .notes-box {
          background: var(--bg-secondary);
          border: 1px dashed var(--border-color);
          border-radius: var(--radius-md);
          padding: 0.85rem 1rem;
          margin-bottom: 1rem;
        }

        .notes-display-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
        }

        .notes-text {
          color: var(--text-main);
        }

        .notes-edit-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .notes-textarea {
          min-height: 70px;
          resize: vertical;
          font-family: var(--font-sans);
        }

        .notes-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .tracker-item-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        .time-info {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
      `}</style>
    </div>
  );
};
