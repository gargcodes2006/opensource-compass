# OpenSource Compass 🧩

> **Find Your First Open Source Contribution**
> Discover beginner-friendly repositories, analyze GitHub profiles, track your open-source journey, and master the git contribution workflow.

---

## 🌟 Overview

**OpenSource Compass** is a developer tool and web application built for students and beginner software engineers looking to break into open source. It simplifies finding `good first issue` opportunities, exploring top repositories, visualizing GitHub developer profiles, and managing your ongoing pull request contributions.

---

## 🛠 Tech Stack

### **Frontend**
- **Framework**: React 18 + Vite
- **Styling**: Modern GitHub-inspired Dark Navy / Light CSS System
- **Icons**: Lucide React
- **Data Visualization**: Chart.js & React-Chartjs-2

### **Backend**
- **Framework**: Python FastAPI
- **Database**: SQLite with SQLAlchemy ORM
- **API Client**: HTTPX for GitHub REST API Integration
- **Testing**: Pytest & FastAPI TestClient

---

## ✨ Features

1. 🚀 **Modern Landing Page**: High-impact developer design with dark/light mode toggle.
2. 📊 **GitHub Profile Analyzer**: Detailed breakdown of user bios, language usage, stars distribution, and repo metrics with interactive charts.
3. 🔎 **Open Source Project Finder**: Filter top open-source repositories by language (C, C++, Python, Java, JavaScript, TypeScript, React), stars, and update frequency.
4. 🎯 **Good First Issue Finder**: Discover issues labeled `good first issue` and `help wanted` filtered by programming language.
5. 📌 **Personal Contribution Tracker**: SQLite-backed tracker allowing users to save issues and manage statuses (`Not Started`, `Learning`, `Working`, `Pull Request Created`, `Completed`).
6. 📈 **Analytics Dashboard**: Aggregated metrics and charts tracking active & completed contributions, saved repos, and explored tech stacks.
7. 📖 **Interactive Git Contribution Guide**: Complete walkthrough from fork to pull request with copyable git command snippets.

---

## 📂 Project Architecture

```
opensource-compass/
├── frontend/             # React + Vite web application
│   ├── src/
│   │   ├── components/  # Navbar, Footer, Toast, Cards
│   │   ├── context/     # ThemeContext (Dark/Light mode)
│   │   ├── pages/       # Landing, Profile, Projects, Issues, Tracker, Dashboard, Guide
│   │   ├── styles/      # Global CSS design tokens
│   │   ├── App.jsx      # Main app router
│   │   └── main.jsx     # Vite React entry point
│   ├── package.json
│   └── vite.config.js
├── backend/              # Python FastAPI REST API server
│   ├── database.py       # SQLite engine & session setup
│   ├── models.py         # SQLAlchemy ORM schemas
│   ├── schemas.py        # Pydantic data schemas
│   ├── github_service.py # GitHub REST API Proxy & Cache
│   ├── main.py           # FastAPI app & API endpoints
│   ├── requirements.txt  # Python dependencies
│   └── tests/            # Pytest suite
├── docs/                 # Documentation & architectural diagrams
├── screenshots/          # App screenshots & UI previews
├── .env.example          # Environment configuration template
├── .gitignore            # Git exclusion rules
├── LICENSE               # MIT License
├── CONTRIBUTING.md       # Contribution guidelines
├── CODE_OF_CONDUCT.md    # Contributor Covenant Code of Conduct
└── README.md             # Project documentation
```

---

## ⚙️ Installation & Setup Instructions

### Prerequisites
- **Node.js**: v18+ & `npm`
- **Python**: v3.9+

---

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment (optional but recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# (Optional) Set up environment variables
cp ../.env.example .env

# Run FastAPI backend server
python -m uvicorn main:app --reload --port 8000
```
Backend will be available at: `http://localhost:8000`  
Swagger API Docs available at: `http://localhost:8000/docs`

---

### 2. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install Node modules
npm install

# Start Vite development server
npm run dev
```
Frontend will be available at: `http://localhost:5173`

---

## 🔐 Environment Variables

Create a `.env` file in the root or `backend/` directory:

| Variable | Description | Default |
|---|---|---|
| `GITHUB_TOKEN` | Optional GitHub Personal Access Token to avoid API rate limits | *None (Unauthenticated limit: 60/hr)* |
| `PORT` | Backend server port | `8000` |
| `CORS_ORIGINS` | Allowed CORS origins | `http://localhost:5173` |

---

## 🧪 Running Tests

To run the backend test suite:

```bash
cd backend
pytest
```

---

## 🐙 Git Commands to Push to GitHub

```bash
# Initialize git repository (if not initialized)
git init

# Add all project files
git add .

# Create initial commit
git commit -m "feat: initial commit for OpenSource Compass full-stack project"

# Rename main branch
git branch -M main

# Add remote repository
git remote add origin https://github.com/your-username/opensource-compass.git

# Push code to GitHub
git push -u origin main
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
