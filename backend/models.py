from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text
from database import Base

class SavedRepository(Base):
    __tablename__ = "saved_repositories"

    id = Column(Integer, primary_key=True, index=True)
    repo_name = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False, unique=True, index=True)
    description = Column(Text, nullable=True)
    html_url = Column(String(500), nullable=False)
    language = Column(String(100), nullable=True)
    stars = Column(Integer, default=0)
    forks = Column(Integer, default=0)
    open_issues = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)


class ContributionItem(Base):
    __tablename__ = "contribution_items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    html_url = Column(String(500), nullable=False)
    repo_name = Column(String(255), nullable=False)
    repo_url = Column(String(500), nullable=True)
    language = Column(String(100), nullable=True)
    issue_number = Column(Integer, nullable=True)
    status = Column(String(50), default="Not Started")  # Not Started, Learning, Working, Pull Request Created, Completed
    notes = Column(Text, nullable=True, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
