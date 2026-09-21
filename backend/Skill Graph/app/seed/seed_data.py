import logging
from datetime import date
from sqlalchemy.orm import Session
from app.database import SessionLocal, init_db
from app.models.user import User, Subject
from app.models.skill import Skill, Role, RoleSkill, SkillGraphEdge, SkillEvidence
from app.models.evidence import Evidence, Project, Certificate

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

INITIAL_SKILLS = [
    # Programming Languages
    {"id": "python", "name": "Python", "category": "programming", "description": "High-level programming language widely used in backend, data science, and scripting."},
    {"id": "java", "name": "Java", "category": "programming", "description": "Object-oriented, class-based programming language for enterprise software."},
    {"id": "cpp", "name": "C++", "category": "programming", "description": "High-performance systems programming language with OOP and low-level memory control."},
    {"id": "javascript", "name": "JavaScript", "category": "programming", "description": "Core scripting language of the web for client-side and server-side execution."},
    {"id": "typescript", "name": "TypeScript", "category": "programming", "description": "Typed superset of JavaScript providing static typing and tooling."},
    
    # Frameworks & Runtimes
    {"id": "react", "name": "React", "category": "framework", "description": "Declarative component-based frontend library for user interfaces."},
    {"id": "nextjs", "name": "Next.js", "category": "framework", "description": "Full-stack React framework with SSR, SSG, and routing."},
    {"id": "fastapi", "name": "FastAPI", "category": "framework", "description": "Modern, high-performance web framework for building APIs with Python."},
    {"id": "nodejs", "name": "Node.js", "category": "framework", "description": "V8 asynchronous event-driven JavaScript runtime environment."},
    
    # Databases & Storage
    {"id": "sql", "name": "SQL", "category": "database", "description": "Standard language for querying and managing relational databases."},
    {"id": "postgresql", "name": "PostgreSQL", "category": "database", "description": "Powerful open-source object-relational database system."},
    {"id": "mongodb", "name": "MongoDB", "category": "database", "description": "Document-oriented NoSQL database for flexible, schema-free storage."},
    {"id": "dbms", "name": "DBMS", "category": "fundamentals", "description": "Database Management System architecture, transactions, ACID properties, and normalization."},
    
    # Computer Science Fundamentals
    {"id": "dsa", "name": "DSA", "category": "fundamentals", "description": "Data Structures & Algorithms, problem solving, time/space complexity analysis."},
    {"id": "oop", "name": "OOP", "category": "fundamentals", "description": "Object-Oriented Programming paradigms: encapsulation, inheritance, polymorphism, abstraction."},
    {"id": "computer-networks", "name": "Computer Networks", "category": "fundamentals", "description": "TCP/IP, OSI model, routing, DNS, HTTP/HTTPS protocols."},
    
    # Architecture & Tools
    {"id": "rest-api", "name": "REST API", "category": "architecture", "description": "Representational State Transfer architectural principles for scalable web services."},
    {"id": "git", "name": "Git", "category": "tools", "description": "Distributed version control system for tracking code changes."},
    {"id": "docker", "name": "Docker", "category": "devops", "description": "Containerization platform to package and run software uniformly."},
    {"id": "testing", "name": "Testing", "category": "quality", "description": "Unit testing, integration testing, TDD, test automation, and code coverage."},
    {"id": "cloud", "name": "Cloud", "category": "cloud", "description": "Cloud infrastructure, compute, serverless, and cloud-native architecture (AWS/GCP/Azure)."},
    
    # AI / ML & Security
    {"id": "machine-learning", "name": "Machine Learning", "category": "ai_ml", "description": "Statistical modeling, supervised/unsupervised learning, scikit-learn, neural networks."},
    {"id": "llm", "name": "LLM", "category": "ai_ml", "description": "Large Language Models, prompt engineering, fine-tuning, RAG, and AI reasoning pipelines."},
    {"id": "cybersecurity", "name": "Cybersecurity", "category": "security", "description": "Information security, threat modeling, vulnerability assessment, cryptography."},
]

INITIAL_ROLES = [
    {
        "id": "backend-developer",
        "name": "Backend Developer",
        "description": "Designs, implements, and maintains server-side logic, database schemas, APIs, and microservices.",
        "skills": ["python", "fastapi", "rest-api", "sql", "postgresql", "git", "docker", "testing", "cloud"],
    },
    {
        "id": "frontend-developer",
        "name": "Frontend Developer",
        "description": "Builds interactive, performant user interfaces, component design systems, and web applications.",
        "skills": ["javascript", "typescript", "react", "nextjs", "rest-api", "git", "testing"],
    },
    {
        "id": "software-developer",
        "name": "Software Developer",
        "description": "Core software engineer possessing robust CS fundamentals, algorithms, system design, and coding skills.",
        "skills": ["dsa", "oop", "dbms", "computer-networks", "git", "python", "java", "sql", "testing"],
    },
    {
        "id": "ai-ml-engineer",
        "name": "AI/ML Engineer",
        "description": "Develops machine learning models, neural pipelines, and integrates Large Language Model reasoning into applications.",
        "skills": ["python", "machine-learning", "llm", "sql", "git", "docker", "cloud", "fastapi"],
    },
    {
        "id": "cybersecurity-analyst",
        "name": "Cybersecurity Analyst",
        "description": "Protects digital assets, assesses network vulnerabilities, performs secure coding audits and incident responses.",
        "skills": ["cybersecurity", "computer-networks", "python", "git", "docker", "testing"],
    },
]

INITIAL_EDGES = [
    {"source": "python", "target": "fastapi", "relationship": "used_with"},
    {"source": "python", "target": "machine-learning", "relationship": "used_with"},
    {"source": "machine-learning", "target": "llm", "relationship": "foundational_to"},
    {"source": "javascript", "target": "typescript", "relationship": "evolved_to"},
    {"source": "javascript", "target": "react", "relationship": "used_with"},
    {"source": "typescript", "target": "nextjs", "relationship": "used_with"},
    {"source": "react", "target": "nextjs", "relationship": "foundational_to"},
    {"source": "sql", "target": "postgresql", "relationship": "specialization_of"},
    {"source": "sql", "target": "mongodb", "relationship": "alternative_to"},
    {"source": "rest-api", "target": "fastapi", "relationship": "implemented_by"},
    {"source": "rest-api", "target": "nodejs", "relationship": "implemented_by"},
    {"source": "git", "target": "docker", "relationship": "toolchain"},
    {"source": "dsa", "target": "oop", "relationship": "foundational_to"},
    {"source": "dbms", "target": "sql", "relationship": "foundational_to"},
    {"source": "computer-networks", "target": "cybersecurity", "relationship": "foundational_to"},
    {"source": "docker", "target": "cloud", "relationship": "deployed_to"},
    {"source": "fastapi", "target": "testing", "relationship": "verified_by"},
    {"source": "java", "target": "oop", "relationship": "exemplified_by"},
    {"source": "cpp", "target": "dsa", "relationship": "implemented_in"},
]


def seed_database(db: Session = None):
    """
    Populates database with skills, roles, graph edges, and a starter student profile.
    Safe to execute multiple times (idempotent).
    """
    close_db = False
    if db is None:
        init_db()
        db = SessionLocal()
        close_db = True

    try:
        logger.info("Seeding skills...")
        for skill_data in INITIAL_SKILLS:
            existing = db.query(Skill).filter(Skill.id == skill_data["id"]).first()
            if not existing:
                skill = Skill(**skill_data)
                db.add(skill)
        db.commit()

        logger.info("Seeding roles and role_skills...")
        for role_data in INITIAL_ROLES:
            existing_role = db.query(Role).filter(Role.id == role_data["id"]).first()
            if not existing_role:
                role = Role(
                    id=role_data["id"],
                    name=role_data["name"],
                    description=role_data["description"],
                )
                db.add(role)
                db.flush()
                for skill_id in role_data["skills"]:
                    rs = RoleSkill(role_id=role.id, skill_id=skill_id, importance="required")
                    db.add(rs)
        db.commit()

        logger.info("Seeding skill graph edges...")
        for edge_data in INITIAL_EDGES:
            existing_edge = db.query(SkillGraphEdge).filter(
                SkillGraphEdge.source_skill_id == edge_data["source"],
                SkillGraphEdge.target_skill_id == edge_data["target"],
                SkillGraphEdge.relationship == edge_data["relationship"],
            ).first()
            if not existing_edge:
                edge = SkillGraphEdge(
                    source_skill_id=edge_data["source"],
                    target_skill_id=edge_data["target"],
                    relationship=edge_data["relationship"],
                )
                db.add(edge)
        db.commit()

        logger.info("Seeding demo student profile...")
        student = db.query(User).filter(User.email == "alex.mercer@university.edu").first()
        if not student:
            student = User(
                name="Alex Mercer",
                email="alex.mercer@university.edu",
                university="Tech State University",
                degree="Bachelor of Technology",
                branch="Computer Science & Engineering",
                semester=6,
                cgpa=8.75,
            )
            db.add(student)
            db.flush()

            # Academic Subjects
            subjects = [
                Subject(user_id=student.id, name="Data Structures & Algorithms", grade="A+", credits=4.0),
                Subject(user_id=student.id, name="Database Management Systems", grade="A", credits=4.0),
                Subject(user_id=student.id, name="Computer Networks", grade="A", credits=3.0),
                Subject(user_id=student.id, name="Object-Oriented Programming", grade="O", credits=4.0),
            ]
            db.add_all(subjects)
            db.flush()

            # Project Evidence 1: Backend API
            ev1 = Evidence(
                user_id=student.id,
                type="project",
                title="Microservices REST Engine",
                description="Engineered modular REST microservices with automated testing and relational persistence.",
                source_url="https://github.com/alexmercer/microservices-engine",
                date=date(2026, 3, 15),
                verification_status="verified",
            )
            db.add(ev1)
            db.flush()
            p1 = Project(
                evidence_id=ev1.id,
                project_name="Microservices REST Engine",
                role="Lead Backend Engineer",
                contribution="Implemented database models, schema migrations, and REST endpoints.",
                technologies=["Python", "FastAPI", "SQL", "PostgreSQL", "REST API"],
                github_url="https://github.com/alexmercer/microservices-engine",
                demo_url="https://api.demo.microservices.io",
            )
            db.add(p1)

            # Link skills for ev1 (Python, FastAPI, SQL, PostgreSQL)
            for sid, conf in [("python", 0.95), ("fastapi", 0.95), ("sql", 0.9), ("postgresql", 0.9)]:
                db.add(SkillEvidence(skill_id=sid, evidence_id=ev1.id, confidence=conf, reason="Core project stack"))

            # Project Evidence 2: Containerized Task Runner
            ev2 = Evidence(
                user_id=student.id,
                type="project",
                title="Distributed Worker Queue",
                description="Designed asynchronous worker containers managed via Docker.",
                source_url="https://github.com/alexmercer/worker-queue",
                date=date(2026, 5, 20),
                verification_status="verified",
            )
            db.add(ev2)
            db.flush()
            p2 = Project(
                evidence_id=ev2.id,
                project_name="Distributed Worker Queue",
                role="Backend Developer",
                contribution="Wrote async tasks and container deployment configurations.",
                technologies=["Python", "Docker", "Git"],
                github_url="https://github.com/alexmercer/worker-queue",
            )
            db.add(p2)
            for sid, conf in [("python", 0.9), ("docker", 0.75), ("git", 0.85)]:
                db.add(SkillEvidence(skill_id=sid, evidence_id=ev2.id, confidence=conf, reason="Containerized service"))

            # Certificate Evidence: SQL
            ev3 = Evidence(
                user_id=student.id,
                type="certificate",
                title="Advanced SQL Mastery",
                description="Certified relational database schema design, indexing, and query tuning.",
                source_url="https://credentials.databaseroc.org/cert/sql-88231",
                date=date(2026, 1, 10),
                verification_status="verified",
            )
            db.add(ev3)
            db.flush()
            c1 = Certificate(
                evidence_id=ev3.id,
                issuer="Database Academy",
                certificate_name="Advanced SQL Mastery",
                certificate_url="https://credentials.databaseroc.org/cert/sql-88231",
            )
            db.add(c1)
            db.add(SkillEvidence(skill_id="sql", evidence_id=ev3.id, confidence=1.0, reason="Formal certification"))

            db.commit()
            logger.info("Demo student seeded successfully.")

        logger.info("Database seeding finished successfully!")
    finally:
        if close_db:
            db.close()


if __name__ == "__main__":
    seed_database()
