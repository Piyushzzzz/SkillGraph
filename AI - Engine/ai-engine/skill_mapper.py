"""
Skill ontology and mapping module for SkillGraph.
Maintains taxonomy categories, aliases, normalizations, and skill relationship hierarchies.
"""

from typing import Dict, List, Optional, Set, Tuple
from validators import SkillCategory

# Standard name normalization mapping (lowercase alias -> Canonical Name)
SKILL_ALIASES: Dict[str, str] = {
    "python": "Python",
    "python3": "Python",
    "py": "Python",
    "fastapi": "FastAPI",
    "flask": "Flask",
    "django": "Django",
    "rest": "REST API",
    "restful": "REST API",
    "rest api": "REST API",
    "restful api": "REST API",
    "api": "REST API",
    "javascript": "JavaScript",
    "js": "JavaScript",
    "typescript": "TypeScript",
    "ts": "TypeScript",
    "react": "React",
    "react.js": "React",
    "reactjs": "React",
    "next": "Next.js",
    "next.js": "Next.js",
    "nextjs": "Next.js",
    "vue": "Vue.js",
    "vue.js": "Vue.js",
    "angular": "Angular",
    "node": "Node.js",
    "nodejs": "Node.js",
    "express": "Express.js",
    "express.js": "Express.js",
    "sql": "SQL",
    "postgres": "PostgreSQL",
    "postgresql": "PostgreSQL",
    "psql": "PostgreSQL",
    "mysql": "MySQL",
    "sqlite": "SQLite",
    "mongodb": "MongoDB",
    "mongo": "MongoDB",
    "redis": "Redis",
    "docker": "Docker",
    "dockerfile": "Docker",
    "docker-compose": "Docker Compose",
    "kubernetes": "Kubernetes",
    "k8s": "Kubernetes",
    "aws": "AWS",
    "gcp": "Google Cloud",
    "azure": "Azure",
    "git": "Git",
    "github": "Git",
    "version control": "Version Control",
    "ci/cd": "CI/CD",
    "github actions": "GitHub Actions",
    "pytest": "Pytest",
    "testing": "Testing",
    "unit testing": "Unit Testing",
    "tdd": "TDD",
    "dsa": "Data Structures & Algorithms",
    "data structures": "Data Structures & Algorithms",
    "algorithms": "Data Structures & Algorithms",
    "dbms": "DBMS",
    "database management": "DBMS",
    "operating systems": "Operating Systems",
    "os": "Operating Systems",
    "computer networks": "Computer Networks",
    "cn": "Computer Networks",
    "machine learning": "Machine Learning",
    "ml": "Machine Learning",
    "deep learning": "Deep Learning",
    "dl": "Deep Learning",
    "pytorch": "PyTorch",
    "tensorflow": "TensorFlow",
    "pandas": "Pandas",
    "numpy": "NumPy",
    "scikit-learn": "Scikit-Learn",
    "sklearn": "Scikit-Learn",
    "nlp": "Natural Language Processing",
    "llm": "LLMs",
    "ollama": "Ollama",
    "cybersecurity": "Cybersecurity",
    "security": "Cybersecurity",
    "linux": "Linux",
    "bash": "Bash/Shell",
    "shell": "Bash/Shell",
    "html": "HTML",
    "css": "CSS",
    "tailwind": "Tailwind CSS",
    "tailwindcss": "Tailwind CSS",
}

# Skill category taxonomy mapping
SKILL_CATEGORY_MAP: Dict[str, SkillCategory] = {
    # Programming
    "Python": SkillCategory.PROGRAMMING,
    "JavaScript": SkillCategory.PROGRAMMING,
    "TypeScript": SkillCategory.PROGRAMMING,
    "Java": SkillCategory.PROGRAMMING,
    "C++": SkillCategory.PROGRAMMING,
    "C": SkillCategory.PROGRAMMING,
    "Go": SkillCategory.PROGRAMMING,
    "Rust": SkillCategory.PROGRAMMING,
    "Bash/Shell": SkillCategory.PROGRAMMING,

    # Frontend
    "React": SkillCategory.FRONTEND,
    "Next.js": SkillCategory.FRONTEND,
    "Vue.js": SkillCategory.FRONTEND,
    "Angular": SkillCategory.FRONTEND,
    "HTML": SkillCategory.FRONTEND,
    "CSS": SkillCategory.FRONTEND,
    "Tailwind CSS": SkillCategory.FRONTEND,

    # Backend
    "FastAPI": SkillCategory.BACKEND,
    "Flask": SkillCategory.BACKEND,
    "Django": SkillCategory.BACKEND,
    "Node.js": SkillCategory.BACKEND,
    "Express.js": SkillCategory.BACKEND,
    "REST API": SkillCategory.BACKEND,
    "GraphQL": SkillCategory.BACKEND,
    "gRPC": SkillCategory.BACKEND,

    # Database
    "SQL": SkillCategory.DATABASE,
    "PostgreSQL": SkillCategory.DATABASE,
    "MySQL": SkillCategory.DATABASE,
    "SQLite": SkillCategory.DATABASE,
    "MongoDB": SkillCategory.DATABASE,
    "Redis": SkillCategory.DATABASE,
    "DBMS": SkillCategory.DATABASE,

    # Cloud
    "Docker": SkillCategory.CLOUD,
    "Docker Compose": SkillCategory.CLOUD,
    "Kubernetes": SkillCategory.CLOUD,
    "AWS": SkillCategory.CLOUD,
    "Google Cloud": SkillCategory.CLOUD,
    "Azure": SkillCategory.CLOUD,
    "Cloud": SkillCategory.CLOUD,

    # AI/ML
    "Machine Learning": SkillCategory.AI_ML,
    "Deep Learning": SkillCategory.AI_ML,
    "PyTorch": SkillCategory.AI_ML,
    "TensorFlow": SkillCategory.AI_ML,
    "Pandas": SkillCategory.AI_ML,
    "NumPy": SkillCategory.AI_ML,
    "Scikit-Learn": SkillCategory.AI_ML,
    "Natural Language Processing": SkillCategory.AI_ML,
    "LLMs": SkillCategory.AI_ML,
    "Ollama": SkillCategory.AI_ML,

    # Cybersecurity
    "Cybersecurity": SkillCategory.CYBERSECURITY,
    "Network Security": SkillCategory.CYBERSECURITY,
    "Cryptography": SkillCategory.CYBERSECURITY,
    "Authentication": SkillCategory.CYBERSECURITY,

    # Computer Science Fundamentals
    "Data Structures & Algorithms": SkillCategory.CS_FUNDAMENTALS,
    "Operating Systems": SkillCategory.CS_FUNDAMENTALS,
    "Computer Networks": SkillCategory.CS_FUNDAMENTALS,
    "System Design": SkillCategory.CS_FUNDAMENTALS,

    # Development Practices
    "Git": SkillCategory.DEV_PRACTICES,
    "Version Control": SkillCategory.DEV_PRACTICES,
    "CI/CD": SkillCategory.DEV_PRACTICES,
    "GitHub Actions": SkillCategory.DEV_PRACTICES,
    "Testing": SkillCategory.DEV_PRACTICES,
    "Unit Testing": SkillCategory.DEV_PRACTICES,
    "Pytest": SkillCategory.DEV_PRACTICES,
    "TDD": SkillCategory.DEV_PRACTICES,
    "Linux": SkillCategory.DEV_PRACTICES,
}

# Hierarchical skill relationships
# child -> list of implied or parent capabilities
# Example: FastAPI implies Python, REST API, Backend Development
SKILL_RELATIONSHIPS: Dict[str, List[str]] = {
    "FastAPI": ["Python", "REST API", "Backend"],
    "Flask": ["Python", "REST API", "Backend"],
    "Django": ["Python", "REST API", "Backend", "SQL"],
    "Next.js": ["React", "JavaScript", "Frontend"],
    "React": ["JavaScript", "Frontend"],
    "Vue.js": ["JavaScript", "Frontend"],
    "Express.js": ["Node.js", "JavaScript", "REST API", "Backend"],
    "PostgreSQL": ["SQL", "Database"],
    "MySQL": ["SQL", "Database"],
    "SQLite": ["SQL", "Database"],
    "Docker Compose": ["Docker"],
    "Kubernetes": ["Docker", "Cloud"],
    "Pytest": ["Testing", "Python"],
    "GitHub Actions": ["CI/CD", "Git"],
    "Git": ["Version Control"],
    "Data Structures & Algorithms": ["Computer Science Fundamentals"],
    "DBMS": ["Database"],
    "Operating Systems": ["Computer Science Fundamentals"],
    "Computer Networks": ["Computer Science Fundamentals"],
    "PyTorch": ["Python", "Deep Learning", "Machine Learning"],
    "TensorFlow": ["Python", "Deep Learning", "Machine Learning"],
    "Scikit-Learn": ["Python", "Machine Learning"],
}


class SkillMapper:
    """
    Service to normalize skill names, assign taxonomy categories,
    and derive ontology relationships.
    """

    @classmethod
    def normalize_skill(cls, raw_name: str) -> str:
        """
        Normalize a raw skill name using alias map or title casing.
        """
        cleaned = raw_name.strip().lower()
        if cleaned in SKILL_ALIASES:
            return SKILL_ALIASES[cleaned]
        # Check title case or keep original capitalizations
        return raw_name.strip()

    @classmethod
    def get_category(cls, skill_name: str) -> SkillCategory:
        """
        Lookup category for normalized skill name.
        """
        normalized = cls.normalize_skill(skill_name)
        if normalized in SKILL_CATEGORY_MAP:
            return SKILL_CATEGORY_MAP[normalized]

        # Heuristic fallback categorization
        lower = normalized.lower()
        if any(w in lower for w in ["react", "vue", "angular", "css", "html", "frontend"]):
            return SkillCategory.FRONTEND
        if any(w in lower for w in ["api", "server", "backend", "fastapi", "django", "express"]):
            return SkillCategory.BACKEND
        if any(w in lower for w in ["sql", "db", "database", "mongo", "redis", "postgres"]):
            return SkillCategory.DATABASE
        if any(w in lower for w in ["docker", "cloud", "aws", "gcp", "azure", "kubernetes"]):
            return SkillCategory.CLOUD
        if any(w in lower for w in ["ai", "ml", "learning", "torch", "model", "llm", "neural"]):
            return SkillCategory.AI_ML
        if any(w in lower for w in ["security", "auth", "crypto", "penetration"]):
            return SkillCategory.CYBERSECURITY
        if any(w in lower for w in ["test", "git", "ci", "cd", "devops", "linux"]):
            return SkillCategory.DEV_PRACTICES
        if any(w in lower for w in ["dsa", "network", "os", "algorithm"]):
            return SkillCategory.CS_FUNDAMENTALS

        return SkillCategory.OTHER

    @classmethod
    def get_parent_skills(cls, skill_name: str) -> List[str]:
        """
        Retrieve parent or implied skills for a given skill.
        Example: FastAPI -> ['Python', 'REST API', 'Backend']
        """
        normalized = cls.normalize_skill(skill_name)
        return SKILL_RELATIONSHIPS.get(normalized, [])

    @classmethod
    def expand_skill_graph(cls, skills: List[str]) -> Set[str]:
        """
        Given a list of skills, returns all explicit and implied ancestor skills.
        """
        expanded: Set[str] = set()
        for s in skills:
            norm = cls.normalize_skill(s)
            expanded.add(norm)
            parents = cls.get_parent_skills(norm)
            for p in parents:
                expanded.add(cls.normalize_skill(p))
        return expanded
