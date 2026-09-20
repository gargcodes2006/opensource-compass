import os
import logging
from typing import Dict, Any, List, Optional
import httpx
from dotenv import load_dotenv

load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")
GITHUB_API_BASE = "https://api.github.com"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("github_service")

def get_headers() -> Dict[str, str]:
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "OpenSource-Compass-App"
    }
    if GITHUB_TOKEN and GITHUB_TOKEN.strip() != "" and not GITHUB_TOKEN.startswith("your_"):
        headers["Authorization"] = f"Bearer {GITHUB_TOKEN.strip()}"
    return headers


async def fetch_github_user_profile(username: str) -> Dict[str, Any]:
    """Fetch GitHub profile information and top public repositories for a user."""
    clean_user = username.strip()
    if not clean_user:
        raise ValueError("Username cannot be empty")

    async with httpx.AsyncClient(timeout=10.0) as client:
        # Fetch profile
        user_url = f"{GITHUB_API_BASE}/users/{clean_user}"
        user_res = await client.get(user_url, headers=get_headers())
        
        if user_res.status_code == 404:
            raise ValueError(f"GitHub user '{clean_user}' not found.")
        elif user_res.status_code == 403:
            logger.warning("GitHub API rate limit hit when fetching user profile.")
            raise RuntimeError("GitHub API rate limit exceeded. Please try again later or add a GITHUB_TOKEN to .env")
        elif user_res.status_code != 200:
            raise RuntimeError(f"GitHub API Error: {user_res.status_code} - {user_res.text}")

        user_data = user_res.json()

        # Fetch top repositories
        repos_url = f"{GITHUB_API_BASE}/users/{clean_user}/repos?sort=updated&per_page=30"
        repos_res = await client.get(repos_url, headers=get_headers())
        repos_data = repos_res.json() if repos_res.status_code == 200 else []

        # Process repository details and statistics
        repositories = []
        languages_count: Dict[str, int] = {}
        stars_distribution: Dict[str, int] = {"0-10": 0, "11-50": 0, "51-100": 0, "100+": 0}
        total_stars = 0
        total_forks = 0

        for repo in repos_data:
            lang = repo.get("language") or "Other"
            languages_count[lang] = languages_count.get(lang, 0) + 1
            
            stars = repo.get("stargazers_count", 0)
            forks = repo.get("forks_count", 0)
            total_stars += stars
            total_forks += forks

            if stars <= 10:
                stars_distribution["0-10"] += 1
            elif stars <= 50:
                stars_distribution["11-50"] += 1
            elif stars <= 100:
                stars_distribution["51-100"] += 1
            else:
                stars_distribution["100+"] += 1

            repositories.append({
                "id": repo.get("id"),
                "name": repo.get("name"),
                "full_name": repo.get("full_name"),
                "description": repo.get("description") or "No description provided.",
                "language": repo.get("language") or "N/A",
                "stars": stars,
                "forks": forks,
                "open_issues": repo.get("open_issues_count", 0),
                "html_url": repo.get("html_url"),
                "updated_at": repo.get("updated_at")
            })

        return {
            "profile": {
                "avatar_url": user_data.get("avatar_url"),
                "login": user_data.get("login"),
                "name": user_data.get("name") or user_data.get("login"),
                "bio": user_data.get("bio") or "No bio available.",
                "location": user_data.get("location") or "Unknown",
                "followers": user_data.get("followers", 0),
                "following": user_data.get("following", 0),
                "public_repos": user_data.get("public_repos", 0),
                "created_at": user_data.get("created_at"),
                "html_url": user_data.get("html_url")
            },
            "stats": {
                "total_stars": total_stars,
                "total_forks": total_forks,
                "languages": languages_count,
                "stars_distribution": stars_distribution
            },
            "repositories": repositories
        }


async def search_github_repositories(
    language: Optional[str] = None,
    min_stars: int = 0,
    sort_by: str = "stars",
    query_text: Optional[str] = None,
    beginner_friendly: bool = False,
    page: int = 1,
    per_page: int = 20
) -> List[Dict[str, Any]]:
    """Search open source repositories based on filters."""
    query_parts = []
    
    if query_text and query_text.strip():
        query_parts.append(query_text.strip())
    else:
        query_parts.append("is:public")

    if language and language.lower() != "all":
        query_parts.append(f'language:"{language}"')

    if min_stars > 0:
        query_parts.append(f"stars:>={min_stars}")

    if beginner_friendly:
        query_parts.append("topic:good-first-issue")

    q = " ".join(query_parts)
    
    # Map frontend sort params to GitHub API sort params
    sort_param = "stars"
    order_param = "desc"
    if sort_by == "updated":
        sort_param = "updated"
    elif sort_by == "forks":
        sort_param = "forks"

    url = f"{GITHUB_API_BASE}/search/repositories?q={httpx.URL('', params={'q': q}).params['q']}&sort={sort_param}&order={order_param}&page={page}&per_page={per_page}"

    async with httpx.AsyncClient(timeout=10.0) as client:
        res = await client.get(url, headers=get_headers())
        if res.status_code == 403:
            logger.warning("GitHub API rate limit reached for repo search.")
            return _get_fallback_repositories(language)
        elif res.status_code != 200:
            logger.error(f"GitHub search repo error {res.status_code}: {res.text}")
            return _get_fallback_repositories(language)

        data = res.json()
        items = data.get("items", [])
        
        results = []
        for repo in items:
            results.append({
                "id": repo.get("id"),
                "name": repo.get("name"),
                "full_name": repo.get("full_name"),
                "description": repo.get("description") or "No description provided.",
                "language": repo.get("language") or "N/A",
                "stars": repo.get("stargazers_count", 0),
                "forks": repo.get("forks_count", 0),
                "open_issues": repo.get("open_issues_count", 0),
                "html_url": repo.get("html_url"),
                "updated_at": repo.get("updated_at"),
                "owner_avatar": repo.get("owner", {}).get("avatar_url")
            })

        return results


async def search_github_issues(
    language: Optional[str] = None,
    labels: Optional[List[str]] = None,
    query_text: Optional[str] = None,
    page: int = 1,
    per_page: int = 25
) -> List[Dict[str, Any]]:
    """Search beginner friendly GitHub issues (good first issue, help wanted)."""
    query_parts = ["is:issue", "state:open"]

    # Handle labels
    if labels and len(labels) > 0:
        label_queries = [f'label:"{lbl}"' for lbl in labels]
        query_parts.append(" ".join(label_queries))
    else:
        query_parts.append('label:"good first issue"')

    if language and language.lower() != "all":
        query_parts.append(f'language:"{language}"')

    if query_text and query_text.strip():
        query_parts.append(query_text.strip())

    q = " ".join(query_parts)
    url = f"{GITHUB_API_BASE}/search/issues?q={httpx.URL('', params={'q': q}).params['q']}&sort=created&order=desc&page={page}&per_page={per_page}"

    async with httpx.AsyncClient(timeout=10.0) as client:
        res = await client.get(url, headers=get_headers())
        if res.status_code == 403:
            logger.warning("GitHub API rate limit reached for issue search.")
            return _get_fallback_issues(language)
        elif res.status_code != 200:
            logger.error(f"GitHub search issue error {res.status_code}: {res.text}")
            return _get_fallback_issues(language)

        data = res.json()
        items = data.get("items", [])

        results = []
        for issue in items:
            repo_url = issue.get("repository_url", "")
            # Extract owner/repo from repository_url
            repo_name = repo_url.replace("https://api.github.com/repos/", "") if repo_url else "GitHub Repo"
            
            issue_labels = [lbl.get("name") for lbl in issue.get("labels", [])]

            results.append({
                "id": issue.get("id"),
                "issue_number": issue.get("number"),
                "title": issue.get("title"),
                "body": (issue.get("body") or "")[:200] + "...",
                "html_url": issue.get("html_url"),
                "repo_name": repo_name,
                "repo_url": f"https://github.com/{repo_name}",
                "labels": issue_labels,
                "created_at": issue.get("created_at"),
                "comments_count": issue.get("comments", 0),
                "language": language if (language and language.lower() != "all") else "Multi-language"
            })

        return results


def _get_fallback_repositories(language: Optional[str] = None) -> List[Dict[str, Any]]:
    """Fallback repositories if API rate limit occurs."""
    sample_repos = [
        {
            "id": 101,
            "name": "react",
            "full_name": "facebook/react",
            "description": "The library for web and native user interfaces.",
            "language": "JavaScript",
            "stars": 225000,
            "forks": 45000,
            "open_issues": 1200,
            "html_url": "https://github.com/facebook/react",
            "updated_at": "2026-09-18T10:00:00Z"
        },
        {
            "id": 102,
            "name": "fastapi",
            "full_name": "fastapi/fastapi",
            "description": "FastAPI framework, high performance, easy to learn, fast to code, ready for production",
            "language": "Python",
            "stars": 75000,
            "forks": 6100,
            "open_issues": 650,
            "html_url": "https://github.com/fastapi/fastapi",
            "updated_at": "2026-09-19T14:30:00Z"
        },
        {
            "id": 103,
            "name": "vscode",
            "full_name": "microsoft/vscode",
            "description": "Visual Studio Code - Code editing. Redefined.",
            "language": "TypeScript",
            "stars": 160000,
            "forks": 30000,
            "open_issues": 4500,
            "html_url": "https://github.com/microsoft/vscode",
            "updated_at": "2026-09-20T02:15:00Z"
        },
        {
            "id": 104,
            "name": "tensorflow",
            "full_name": "tensorflow/tensorflow",
            "description": "An Open Source Machine Learning Framework for Everyone",
            "language": "C++",
            "stars": 185000,
            "forks": 90000,
            "open_issues": 2800,
            "html_url": "https://github.com/tensorflow/tensorflow",
            "updated_at": "2026-09-19T18:00:00Z"
        },
        {
            "id": 105,
            "name": "spring-boot",
            "full_name": "spring-projects/spring-boot",
            "description": "Spring Boot helps you create stand-alone, production-grade Spring based Applications.",
            "language": "Java",
            "stars": 74000,
            "forks": 40000,
            "open_issues": 420,
            "html_url": "https://github.com/spring-projects/spring-boot",
            "updated_at": "2026-09-19T11:20:00Z"
        }
    ]
    if language and language.lower() != "all":
        filtered = [r for r in sample_repos if r["language"].lower() == language.lower()]
        return filtered if filtered else sample_repos
    return sample_repos


def _get_fallback_issues(language: Optional[str] = None) -> List[Dict[str, Any]]:
    """Fallback issues if API rate limit occurs."""
    sample_issues = [
        {
            "id": 201,
            "issue_number": 142,
            "title": "Fix typo in getting started documentation guide",
            "body": "There is a small typo in the quickstart docs under section 2...",
            "html_url": "https://github.com/fastapi/fastapi/issues/142",
            "repo_name": "fastapi/fastapi",
            "repo_url": "https://github.com/fastapi/fastapi",
            "labels": ["good first issue", "documentation"],
            "created_at": "2026-09-19T12:00:00Z",
            "comments_count": 2,
            "language": "Python"
        },
        {
            "id": 202,
            "issue_number": 884,
            "title": "Add dark mode toggle aria-label accessibility tag",
            "body": "The toggle button lacks accessible screen reader label for dark mode...",
            "html_url": "https://github.com/facebook/react/issues/884",
            "repo_name": "facebook/react",
            "repo_url": "https://github.com/facebook/react",
            "labels": ["good first issue", "help wanted", "a11y"],
            "created_at": "2026-09-18T16:30:00Z",
            "comments_count": 5,
            "language": "JavaScript"
        },
        {
            "id": 203,
            "issue_number": 310,
            "title": "Improve unit test coverage for user authentication module",
            "body": "Need additional mock tests for OAuth token refreshing logic...",
            "html_url": "https://github.com/microsoft/vscode/issues/310",
            "repo_name": "microsoft/vscode",
            "repo_url": "https://github.com/microsoft/vscode",
            "labels": ["good first issue", "help wanted", "testing"],
            "created_at": "2026-09-17T09:15:00Z",
            "comments_count": 1,
            "language": "TypeScript"
        }
    ]
    if language and language.lower() != "all":
        filtered = [i for i in sample_issues if i["language"].lower() == language.lower()]
        return filtered if filtered else sample_issues
    return sample_issues
