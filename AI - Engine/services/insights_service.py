"""
iNSIGHTS Service for SkillGraph.
Provides industry benchmarks, technology context, role requirements,
project ideas, and learning resources.

CRITICAL PRINCIPLE:
iNSIGHTS data is external contextual market intelligence.
It is NEVER used as proof of a student's personal skills.
"""

import logging
from typing import Dict, List, Optional, Any

logger = logging.getLogger("services.insights_service")


class InsightsService:
    """
    Contextual information provider for roles, technologies, and curriculum.
    Purely informational; never treated as student evidence.
    """

    # Industry benchmarks & role requirements
    ROLE_PROFILES: Dict[str, Dict[str, Any]] = {
        "Backend Developer": {
            "title": "Backend Developer",
            "summary": "Designs, implements, and maintains scalable server-side systems, databases, and APIs.",
            "core_skills": [
                "Python",
                "FastAPI",
                "REST API",
                "SQL",
                "PostgreSQL",
                "Docker",
                "Testing",
                "Git",
            ],
            "secondary_skills": ["Redis", "CI/CD", "Linux", "System Design"],
            "industry_demand": "High demand across SaaS, fintech, and platform engineering teams.",
            "common_interview_topics": ["Database indexing", "API latency", "JWT auth", "Distributed systems"],
        },
        "Frontend Developer": {
            "title": "Frontend Developer",
            "summary": "Builds interactive, performant, and accessible user interfaces for modern web applications.",
            "core_skills": [
                "JavaScript",
                "TypeScript",
                "React",
                "Next.js",
                "HTML",
                "CSS",
                "Testing",
                "Git",
            ],
            "secondary_skills": ["Tailwind CSS", "Redux/Zustand", "Web Performance", "Accessibility"],
            "industry_demand": "Consistent demand for responsive single-page and server-rendered web apps.",
            "common_interview_topics": ["React reconciliation", "State management", "SSR vs CSR", "CSS layouts"],
        },
        "Fullstack Developer": {
            "title": "Fullstack Developer",
            "summary": "Bridges frontend UX and backend architecture to deliver complete end-to-end applications.",
            "core_skills": [
                "JavaScript",
                "React",
                "Python",
                "FastAPI",
                "SQL",
                "Docker",
                "Testing",
                "Git",
            ],
            "secondary_skills": ["TypeScript", "PostgreSQL", "Cloud", "CI/CD"],
            "industry_demand": "Extremely popular in startups and agile product engineering teams.",
            "common_interview_topics": ["Full lifecycle features", "API contracts", "Deployment pipelines"],
        },
        "AI/ML Engineer": {
            "title": "AI/ML Engineer",
            "summary": "Applies machine learning models, data pipelines, and deep neural networks to real-world tasks.",
            "core_skills": [
                "Python",
                "Machine Learning",
                "PyTorch",
                "Pandas",
                "NumPy",
                "Data Structures & Algorithms",
                "Git",
            ],
            "secondary_skills": ["Deep Learning", "NLP", "LLMs", "Docker", "Model Evaluation"],
            "industry_demand": "Exponential growth driven by Generative AI and intelligent automation.",
            "common_interview_topics": ["Gradient descent", "Overfitting prevention", "Transformers", "Data preprocessing"],
        },
    }

    # Technology context dictionary
    TECH_CONTEXT: Dict[str, Dict[str, Any]] = {
        "FastAPI": {
            "category": "Backend",
            "description": "Modern, high-performance web framework for building APIs with Python based on standard type hints.",
            "learning_curve": "Moderate",
            "industry_use": "High adoption in microservices and ML inference backends.",
        },
        "Docker": {
            "category": "Cloud & DevOps",
            "description": "Platform for developing, shipping, and running applications in isolated containers.",
            "learning_curve": "Moderate",
            "industry_use": "Industry standard for containerization and reproducible runtime environments.",
        },
        "PostgreSQL": {
            "category": "Database",
            "description": "Powerful open-source object-relational database known for reliability, robustness, and ACID compliance.",
            "learning_curve": "Moderate",
            "industry_use": "The default relational database choice for modern web backends.",
        },
        "React": {
            "category": "Frontend",
            "description": "Declarative, component-based library for building user interfaces.",
            "learning_curve": "Moderate",
            "industry_use": "Dominant frontend web technology ecosystem globally.",
        },
    }

    # Curated learning resources
    LEARNING_RESOURCES: Dict[str, List[Dict[str, str]]] = {
        "Docker": [
            {"title": "Docker Official Getting Started Guide", "type": "Documentation", "url": "https://docs.docker.com/get-started/"},
            {"title": "Docker for Developers", "type": "Interactive Course", "url": "https://roadmap.sh/docker"},
        ],
        "Testing": [
            {"title": "Pytest Documentation & Best Practices", "type": "Documentation", "url": "https://docs.pytest.org/"},
            {"title": "Testing Python Applications", "type": "Guide", "url": "https://realpython.com/pytest-python-testing/"},
        ],
        "FastAPI": [
            {"title": "FastAPI Official Tutorial", "type": "Documentation", "url": "https://fastapi.tiangolo.com/tutorial/"},
            {"title": "Full Stack FastAPI Template", "type": "Code Template", "url": "https://github.com/fastapi/full-stack-fastapi-template"},
        ],
        "PostgreSQL": [
            {"title": "PostgreSQL Tutorial for Beginners", "type": "Interactive Guide", "url": "https://www.postgresqltutorial.com/"},
        ],
    }

    def get_role_requirements(self, role_name: str) -> Dict[str, Any]:
        """
        Fetch market requirements for a target role.
        """
        if role_name in self.ROLE_PROFILES:
            return self.ROLE_PROFILES[role_name]

        # Case-insensitive fallback
        for k, v in self.ROLE_PROFILES.items():
            if k.lower() == role_name.lower():
                return v

        return {
            "title": role_name,
            "summary": f"Standard industry profile for {role_name}.",
            "core_skills": ["Programming", "Git", "Testing"],
            "secondary_skills": ["Communication", "System Design"],
            "industry_demand": "General technical engineering demand.",
            "common_interview_topics": ["Problem solving", "Code quality"],
        }

    def get_technology_context(self, tech_name: str) -> Dict[str, Any]:
        """
        Fetch contextual explanation and industry relevance of a technology.
        """
        norm = tech_name.strip()
        for k, v in self.TECH_CONTEXT.items():
            if k.lower() == norm.lower():
                return v
        return {
            "name": tech_name,
            "category": "Technology",
            "description": f"Standard industry tool/library: {tech_name}.",
            "learning_curve": "Variable",
            "industry_use": "Utilized in modern software engineering.",
        }

    def get_learning_resources(self, skill_name: str) -> List[Dict[str, str]]:
        """
        Return curated learning resources for a skill gap.
        """
        for k, res in self.LEARNING_RESOURCES.items():
            if k.lower() == skill_name.lower():
                return res
        return [
            {
                "title": f"Explore {skill_name} on Roadmap.sh",
                "type": "Curriculum",
                "url": f"https://roadmap.sh",
            }
        ]

    def get_project_ideas(self, role_name: str, target_skills: List[str]) -> List[str]:
        """
        Provides practical project concepts to bridge skill gaps.
        """
        skills_str = ", ".join(target_skills)
        return [
            f"Build an authenticated CRUD REST API using {skills_str} with containerized PostgreSQL.",
            f"Create a microservice architecture deploying {skills_str} to a cloud provider with automated CI tests.",
            f"Develop a real-time tracking application incorporating {skills_str} and observability metrics.",
        ]
