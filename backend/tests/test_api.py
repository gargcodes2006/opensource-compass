import os
import sys
import pytest
from starlette.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app
import models
from database import Base, get_db

# Use an in-memory SQLite database with StaticPool to share connection across threads
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create all database tables on test engine
Base.metadata.create_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_database():
    """Ensure tables are created before test run."""
    Base.metadata.create_all(bind=engine)
    yield

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_invalid_github_username():
    response = client.get("/api/github/profile/this_user_definitely_does_not_exist_1234567890987")
    assert response.status_code in [404, 429, 500]

def test_get_projects():
    response = client.get("/api/github/projects?language=python&min_stars=100")
    assert response.status_code == 200
    data = response.json()
    assert "projects" in data
    assert isinstance(data["projects"], list)

def test_get_issues():
    response = client.get("/api/github/issues?language=python")
    assert response.status_code == 200
    data = response.json()
    assert "issues" in data
    assert isinstance(data["issues"], list)

def test_tracker_item_lifecycle():
    # 1. Create issue item
    payload = {
        "title": "Fix bug in parser",
        "html_url": "https://github.com/test/repo/issues/1",
        "repo_name": "test/repo",
        "language": "Python",
        "issue_number": 1,
        "status": "Not Started",
        "notes": "Initial research phase"
    }
    response = client.post("/api/tracker/items", json=payload)
    assert response.status_code == 201
    created = response.json()
    item_id = created["id"]
    assert created["title"] == "Fix bug in parser"
    assert created["status"] == "Not Started"

    # 2. Get list of items
    get_res = client.get("/api/tracker/items")
    assert get_res.status_code == 200
    items = get_res.json()
    assert len(items) >= 1

    # 3. Update status
    update_res = client.put(f"/api/tracker/items/{item_id}", json={"status": "Working", "notes": "Writing fix"})
    assert update_res.status_code == 200
    updated = update_res.json()
    assert updated["status"] == "Working"
    assert updated["notes"] == "Writing fix"

    # 4. Delete item
    del_res = client.delete(f"/api/tracker/items/{item_id}")
    assert del_res.status_code == 200

def test_saved_repository_lifecycle():
    repo_payload = {
        "repo_name": "fastapi",
        "full_name": "fastapi/fastapi",
        "description": "FastAPI framework",
        "html_url": "https://github.com/fastapi/fastapi",
        "language": "Python",
        "stars": 75000,
        "forks": 6000,
        "open_issues": 500
    }
    # Create
    post_res = client.post("/api/tracker/repos", json=repo_payload)
    assert post_res.status_code == 201
    created_repo = post_res.json()
    repo_id = created_repo["id"]

    # Read
    get_res = client.get("/api/tracker/repos")
    assert get_res.status_code == 200
    assert len(get_res.json()) >= 1

    # Delete
    del_res = client.delete(f"/api/tracker/repos/{repo_id}")
    assert del_res.status_code == 200

def test_dashboard_stats():
    stats_res = client.get("/api/dashboard/stats")
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert "total_saved_repos" in stats
    assert "total_saved_issues" in stats
    assert "active_contributions" in stats
    assert "completed_contributions" in stats
