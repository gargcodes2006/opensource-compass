from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict

# --- Saved Repository Schemas ---
class SavedRepositoryCreate(BaseModel):
    repo_name: str
    full_name: str
    description: Optional[str] = None
    html_url: str
    language: Optional[str] = "Unknown"
    stars: int = 0
    forks: int = 0
    open_issues: int = 0

class SavedRepositoryResponse(SavedRepositoryCreate):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Contribution Item Schemas ---
class ContributionItemCreate(BaseModel):
    title: str
    html_url: str
    repo_name: str
    repo_url: Optional[str] = None
    language: Optional[str] = "Unknown"
    issue_number: Optional[int] = None
    status: Optional[str] = "Not Started"
    notes: Optional[str] = ""

class ContributionItemUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

class ContributionItemResponse(ContributionItemCreate):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)



# --- Dashboard Stats Schema ---
class DashboardStats(BaseModel):
    total_saved_repos: int
    total_saved_issues: int
    active_contributions: int
    completed_contributions: int
    status_breakdown: dict
    language_breakdown: dict
