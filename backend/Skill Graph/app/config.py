import os
import sys
from typing import Optional
from pathlib import Path
from dotenv import load_dotenv

# Base paths
backend_dir = Path(__file__).resolve().parent.parent
workspace_root = backend_dir.parent.parent
ai_engine_dir = workspace_root / "AI - Engine"

# Add AI - Engine and its internal directories to sys.path for seamless imports
for path_to_add in [ai_engine_dir, ai_engine_dir / "ai-engine", ai_engine_dir / "ai_engine"]:
    if path_to_add.exists() and str(path_to_add) not in sys.path:
        sys.path.insert(0, str(path_to_add))

# Load .env files in priority order
for env_candidate in [
    backend_dir / ".env",
    ai_engine_dir / ".env",
    workspace_root / ".env",
]:
    if env_candidate.exists():
        load_dotenv(dotenv_path=env_candidate, override=False)

load_dotenv()


class Settings:
    APP_NAME: str = os.getenv("APP_NAME", "SkillGraph Backend")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() in ("true", "1", "yes")
    API_PREFIX: str = os.getenv("API_PREFIX", "/api")
    
    # Database URL. If not provided or empty, fallback to SQLite for local development
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./skillgraph.db"
    )

    # Supabase / PostgreSQL compatibility check:
    # If connection string uses postgres:// instead of postgresql://, SQLAlchemy needs postgresql://
    @property
    def sqlalchemy_database_url(self) -> str:
        url = self.DATABASE_URL
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        return url

    # Third-Party Integrations
    GITHUB_TOKEN: Optional[str] = os.getenv("GITHUB_TOKEN", None)
    
    # Ollama LLM Configuration
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama3")
    OLLAMA_TIMEOUT_SECONDS: int = int(os.getenv("OLLAMA_TIMEOUT_SECONDS", "30"))

    # iNSIGHTS Service Configuration
    INSIGHTS_API_URL: str = os.getenv("INSIGHTS_API_URL", "https://api.insights.example.com")
    INSIGHTS_API_KEY: Optional[str] = os.getenv("INSIGHTS_API_KEY", None)
    INSIGHTS_TIMEOUT_SECONDS: int = int(os.getenv("INSIGHTS_TIMEOUT_SECONDS", "10"))
    INSIGHTS_CACHE_TTL_SECONDS: int = int(os.getenv("INSIGHTS_CACHE_TTL_SECONDS", "3600"))


settings = Settings()

