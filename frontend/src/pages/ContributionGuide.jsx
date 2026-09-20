import React, { useState } from 'react';
import { 
  BookOpen, 
  GitFork, 
  Terminal, 
  GitBranch, 
  FileCode, 
  CheckSquare, 
  GitCommit, 
  UploadCloud, 
  GitPullRequest, 
  Copy, 
  Check 
} from 'lucide-react';

export const ContributionGuide = ({ showToast }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const guideSteps = [
    {
      title: "1. Fork Repository",
      icon: GitFork,
      desc: "Navigate to the open-source repository on GitHub and click the 'Fork' button in the top-right corner. This creates a personal copy under your GitHub account.",
      command: "# No terminal command required. Click 'Fork' on GitHub.com!"
    },
    {
      title: "2. Clone Repository",
      icon: Terminal,
      desc: "Clone your newly forked repository down to your local machine so you can edit the files.",
      command: "git clone https://github.com/your-username/repository-name.git\ncd repository-name"
    },
    {
      title: "3. Create Branch",
      icon: GitBranch,
      desc: "Never work directly on the main/master branch. Create a feature branch named descriptive of the issue.",
      command: "git checkout -b fix/issue-123-documentation-typo"
    },
    {
      title: "4. Understand Issue",
      icon: FileCode,
      desc: "Read the issue description carefully. Check the contributing guidelines (CONTRIBUTING.md) and project code style.",
      command: "# Inspect codebase and run tests locally\nnpm test  # or pytest"
    },
    {
      title: "5. Make Changes",
      icon: CheckSquare,
      desc: "Implement your bug fix or feature. Keep your changes clean, concise, and focused strictly on the issue.",
      command: "# Modify files in your code editor (e.g. VS Code, Antigravity IDE)"
    },
    {
      title: "6. Commit Changes",
      icon: GitCommit,
      desc: "Stage your modified files and write a clear, descriptive commit message following Conventional Commits.",
      command: "git add .\ngit commit -m \"fix(docs): resolve typo in getting started guide (#123)\""
    },
    {
      title: "7. Push Branch",
      icon: UploadCloud,
      desc: "Push your local feature branch up to your GitHub fork.",
      command: "git push origin fix/issue-123-documentation-typo"
    },
    {
      title: "8. Create Pull Request",
      icon: GitPullRequest,
      desc: "Go to the original repository on GitHub. You will see a banner 'Compare & pull request'. Click it, describe your changes, and submit!",
      command: "# Open GitHub.com -> Compare & Pull Request -> Submit PR!"
    }
  ];

  const handleCopyCommand = (cmd, index) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(index);
    if (showToast) showToast('Git command copied to clipboard!', 'info');
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  return (
    <div className="guide-page">
      <div className="page-header">
        <h1 className="page-title">
          <BookOpen size={32} className="text-purple" />
          Beginner Open Source Git Guide
        </h1>
        <p className="page-subtitle">
          Master the complete step-by-step workflow to make your first successful pull request.
        </p>
      </div>

      <div className="guide-steps-list">
        {guideSteps.map((step, index) => {
          const Icon = step.icon;
          const isCopied = copiedIndex === index;
          return (
            <div key={index} className="guide-step-card glass-card">
              <div className="step-card-header">
                <div className="step-icon-wrapper">
                  <Icon size={22} />
                </div>
                <h3>{step.title}</h3>
              </div>

              <p className="step-description">{step.desc}</p>

              <div className="code-block">
                <button
                  className="code-copy-btn"
                  onClick={() => handleCopyCommand(step.command, index)}
                  title="Copy command"
                >
                  {isCopied ? <Check size={14} className="text-green" /> : <Copy size={14} />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
                <pre><code>{step.command}</code></pre>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .guide-steps-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .guide-step-card {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .step-card-header {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .step-icon-wrapper {
          width: 42px;
          height: 42px;
          border-radius: var(--radius-md);
          background: var(--accent-purple-bg);
          color: var(--accent-purple);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-card-header h3 {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .step-description {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .code-block pre {
          margin: 0;
          white-space: pre-wrap;
          word-break: break-all;
        }
      `}</style>
    </div>
  );
};
