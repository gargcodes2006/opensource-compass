import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <CheckCircle size={18} className="toast-icon success" />,
    error: <AlertCircle size={18} className="toast-icon error" />,
    info: <Info size={18} className="toast-icon info" />
  };

  return (
    <div className={`toast toast-${type}`}>
      {icons[type] || icons.info}
      <span className="toast-message">{message}</span>
      <button className="toast-close-btn" onClick={onClose} aria-label="Close notification">
        <X size={14} />
      </button>

      <style>{`
        .toast {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem 1.15rem;
          border-radius: var(--radius-md);
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-lg);
          font-size: 0.9rem;
          color: var(--text-main);
          min-width: 280px;
        }

        .toast-success {
          border-color: rgba(35, 134, 54, 0.5);
        }

        .toast-error {
          border-color: rgba(248, 81, 73, 0.5);
        }

        .toast-info {
          border-color: rgba(88, 166, 255, 0.5);
        }

        .toast-icon.success { color: var(--accent-green); }
        .toast-icon.error { color: var(--accent-red); }
        .toast-icon.info { color: var(--accent-blue); }

        .toast-message {
          flex: 1;
        }

        .toast-close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .toast-close-btn:hover {
          color: var(--text-main);
        }
      `}</style>
    </div>
  );
};
