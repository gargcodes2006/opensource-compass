import React from 'react';
import { Compass, Github, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-brand-title">
            <Compass size={20} className="footer-icon" />
            <span>OpenSource Compass</span>
          </div>
          <p className="footer-desc">
            Empowering students & beginner software engineers to make meaningful open-source contributions.
          </p>
        </div>

        <div className="footer-copyright">
          <p>
            Built with <Heart size={14} className="heart-icon" /> using React, FastAPI & SQLite.
          </p>
          <div className="footer-links">
            <a href="https://github.com" target="_blank" rel="noreferrer">
              <Github size={16} /> GitHub REST API
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .footer-container {
          background-color: var(--bg-secondary);
          border-top: 1px solid var(--border-color);
          padding: 2.5rem 1.5rem;
          margin-top: 3rem;
        }

        .footer-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .footer-brand-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--text-main);
        }

        .footer-icon {
          color: var(--accent-blue);
        }

        .footer-desc {
          color: var(--text-muted);
          font-size: 0.88rem;
          margin-top: 0.25rem;
          max-width: 450px;
        }

        .footer-copyright {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
          color: var(--text-muted);
          font-size: 0.85rem;
        }

        .heart-icon {
          color: var(--accent-red);
          display: inline;
          vertical-align: middle;
        }

        .footer-links a {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          color: var(--text-muted);
        }

        .footer-links a:hover {
          color: var(--accent-blue);
        }

        @media (max-width: 640px) {
          .footer-inner {
            flex-direction: column;
            align-items: flex-start;
          }
          .footer-copyright {
            align-items: flex-start;
          }
        }
      `}</style>
    </footer>
  );
};
