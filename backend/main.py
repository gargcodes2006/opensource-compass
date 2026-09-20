import os
from typing import List, Optional
# pyrefly: ignore [missing-import]
from fastapi import FastAPI, Depends, HTTPException, Query, status
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from database import engine, Base, get_db
import models
import schemas
import github_service

load_dotenv()

# Create database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="OpenSource Compass API",
    description="Backend service for GitHub profile analysis, project discovery, issue finding, and contribution tracking.",
    version="1.0.0"
)

# CORS setup
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS if CORS_ORIGINS != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", status_code=status.HTTP_200_OK)
def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "OpenSource Compass API"}


# ==========================================
# GITHUB API INTEGRATION ENDPOINTS
# ==========================================

@app.get("/api/github/profile/{username}")
async def get_github_profile(username: str):
    """Fetch profile info, top repositories, and stats for a GitHub user."""
    try:
        data = await github_service.fetch_github_user_profile(username)
        return data
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(ve))
    except RuntimeError as re:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS if "limit" in str(re).lower() else status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(re))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Unexpected error: {str(e)}")


@app.get("/api/github/projects")
async def get_github_projects(
    language: Optional[str] = Query(None, description="Programming language filter"),
    min_stars: int = Query(0, ge=0, description="Minimum number of stars"),
    sort_by: str = Query("stars", description="Sort by 'stars', 'updated', or 'forks'"),
    q: Optional[str] = Query(None, description="Search query string"),
    beginner_friendly: bool = Query(False, description="Filter repositories with beginner-friendly topics/labels"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100)
):
    """Discover open source repositories with filters."""
    try:
        repos = await github_service.search_github_repositories(
            language=language,
            min_stars=min_stars,
            sort_by=sort_by,
            query_text=q,
            beginner_friendly=beginner_friendly,
            page=page,
            per_page=per_page
        )
        return {"projects": repos, "count": len(repos)}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@app.get("/api/github/issues")
async def get_github_issues(
    language: Optional[str] = Query(None, description="Programming language filter"),
    labels: Optional[List[str]] = Query(None, description="Labels like 'good first issue', 'help wanted'"),
    q: Optional[str] = Query(None, description="Query text"),
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100)
):
    """Find beginner-friendly GitHub issues."""
    try:
        issues = await github_service.search_github_issues(
            language=language,
            labels=labels,
            query_text=q,
            page=page,
            per_page=per_page
        )
        return {"issues": issues, "count": len(issues)}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# ==========================================
# SAVED REPOSITORIES ENDPOINTS
# ==========================================

@app.get("/api/tracker/repos", response_model=List[schemas.SavedRepositoryResponse])
def get_saved_repos(db: Session = Depends(get_db)):
    """Retrieve all saved repositories."""
    return db.query(models.SavedRepository).order_by(models.SavedRepository.created_at.desc()).all()


@app.post("/api/tracker/repos", response_model=schemas.SavedRepositoryResponse, status_code=status.HTTP_201_CREATED)
def save_repository(repo: schemas.SavedRepositoryCreate, db: Session = Depends(get_db)):
    """Save a repository to SQLite database."""
    existing = db.query(models.SavedRepository).filter(models.SavedRepository.full_name == repo.full_name).first()
    if existing:
        return existing  # Already saved

    db_repo = models.SavedRepository(**repo.model_dump())
    db.add(db_repo)
    db.commit()
    db.refresh(db_repo)
    return db_repo


@app.delete("/api/tracker/repos/{repo_id}", status_code=status.HTTP_200_OK)
def delete_saved_repository(repo_id: int, db: Session = Depends(get_db)):
    """Remove a saved repository."""
    repo = db.query(models.SavedRepository).filter(models.SavedRepository.id == repo_id).first()
    if not repo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Saved repository not found")
    db.delete(repo)
    db.commit()
    return {"message": "Repository removed successfully", "id": repo_id}


# ==========================================
# CONTRIBUTION TRACKER ENDPOINTS
# ==========================================

@app.get("/api/tracker/items", response_model=List[schemas.ContributionItemResponse])
def get_contribution_items(db: Session = Depends(get_db)):
    """Retrieve all contribution tracker items."""
    return db.query(models.ContributionItem).order_by(models.ContributionItem.updated_at.desc()).all()


@app.post("/api/tracker/items", response_model=schemas.ContributionItemResponse, status_code=status.HTTP_201_CREATED)
def create_contribution_item(item: schemas.ContributionItemCreate, db: Session = Depends(get_db)):
    """Save an issue/contribution into tracker."""
    existing = db.query(models.ContributionItem).filter(models.ContributionItem.html_url == item.html_url).first()
    if existing:
        return existing

    db_item = models.ContributionItem(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


@app.put("/api/tracker/items/{item_id}", response_model=schemas.ContributionItemResponse)
def update_contribution_item(item_id: int, item_update: schemas.ContributionItemUpdate, db: Session = Depends(get_db)):
    """Update status or notes for a tracked contribution item."""
    db_item = db.query(models.ContributionItem).filter(models.ContributionItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tracked item not found")

    if item_update.status is not None:
        valid_statuses = ["Not Started", "Learning", "Working", "Pull Request Created", "Completed"]
        if item_update.status not in valid_statuses:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Status must be one of: {valid_statuses}")
        db_item.status = item_update.status

    if item_update.notes is not None:
        db_item.notes = item_update.notes

    db.commit()
    db.refresh(db_item)
    return db_item


@app.delete("/api/tracker/items/{item_id}", status_code=status.HTTP_200_OK)
def delete_contribution_item(item_id: int, db: Session = Depends(get_db)):
    """Delete a tracked contribution item."""
    db_item = db.query(models.ContributionItem).filter(models.ContributionItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tracked item not found")
    db.delete(db_item)
    db.commit()
    return {"message": "Contribution item deleted successfully", "id": item_id}


# ==========================================
# DASHBOARD STATS ENDPOINT
# ==========================================

@app.get("/api/dashboard/stats", response_model=schemas.DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Calculate aggregated stats for dashboard visualization."""
    total_saved_repos = db.query(models.SavedRepository).count()
    saved_items = db.query(models.ContributionItem).all()
    total_saved_issues = len(saved_items)

    status_counts = {
        "Not Started": 0,
        "Learning": 0,
        "Working": 0,
        "Pull Request Created": 0,
        "Completed": 0
    }

    language_counts = {}

    active_contributions = 0
    completed_contributions = 0

    for item in saved_items:
        status_name = item.status or "Not Started"
        status_counts[status_name] = status_counts.get(status_name, 0) + 1

        if status_name == "Completed":
            completed_contributions += 1
        elif status_name in ["Learning", "Working", "Pull Request Created"]:
            active_contributions += 1

        lang = item.language or "Other"
        language_counts[lang] = language_counts.get(lang, 0) + 1

    # Also count languages from saved repos
    saved_repos = db.query(models.SavedRepository).all()
    for repo in saved_repos:
        lang = repo.language or "Other"
        language_counts[lang] = language_counts.get(lang, 0) + 1

    return {
        "total_saved_repos": total_saved_repos,
        "total_saved_issues": total_saved_issues,
        "active_contributions": active_contributions,
        "completed_contributions": completed_contributions,
        "status_breakdown": status_counts,
        "language_breakdown": language_counts
    }
