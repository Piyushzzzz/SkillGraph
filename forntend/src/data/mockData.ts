import { StudentProfile, EvidenceItem, TargetRole, ProjectMission, SkillNodeData } from '../types';

export const initialProfile: StudentProfile = {
  id: 'usr_alex_chen',
  fullName: 'Alex Chen',
  email: 'alex.chen@cs.stanford.edu',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
  university: 'Stanford University',
  school: 'School of Engineering',
  degree: 'B.S. in Computer Science & Engineering',
  major: 'Systems & Artificial Intelligence',
  semester: 'Semester 6',
  year: 'Junior Year',
  cgpa: 3.84,
  maxCgpa: 4.0,
  cgpaVerificationHash: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
  institutionalTranscriptVerified: true,
  cohortPercentile: 'Top 5%',
  publicId: '0x8F92..A4C1',
  academicCourses: [
    {
      courseCode: 'CS106B',
      title: 'Programming Abstractions (Data Structures & Algorithms)',
      credits: 5,
      grade: 'A+',
      semester: 'Spring 2024',
      verifiedHash: '0x19a4e8d2',
      instructor: 'Dr. Keith Schwarz',
      associatedSkills: ['Data Structures', 'C++', 'Memory Profiling', 'Algorithmic Complexity']
    },
    {
      courseCode: 'CS110',
      title: 'Principles of Computer Systems',
      credits: 5,
      grade: 'A',
      semester: 'Autumn 2024',
      verifiedHash: '0x7c30ef21',
      instructor: 'Dr. Jerry Cain',
      associatedSkills: ['POSIX Concurrency', 'Unix Sockets', 'Multithreading', 'C']
    },
    {
      courseCode: 'CS140',
      title: 'Operating Systems (PintOS Kernel Architecture)',
      credits: 4,
      grade: 'A',
      semester: 'Winter 2025',
      verifiedHash: '0x4b9a11ef',
      instructor: 'Dr. David Mazières',
      associatedSkills: ['Kernel Hacking', 'Virtual Memory', 'System Calls', 'Synchronization']
    },
    {
      courseCode: 'CS145',
      title: 'Data Management & Relational Database Systems',
      credits: 4,
      grade: 'A+',
      semester: 'Spring 2025',
      verifiedHash: '0x8a92bb01',
      instructor: 'Dr. Chris Ré',
      associatedSkills: ['SQL', 'Query Optimization', 'Relational Algebra', 'ACID Transactions']
    },
    {
      courseCode: 'CS144',
      title: 'Introduction to Computer Networking',
      credits: 4,
      grade: 'A',
      semester: 'Autumn 2024',
      verifiedHash: '0x22f8a910',
      instructor: 'Dr. Nick McKeown',
      associatedSkills: ['TCP/IP Stack', 'Sliding Window', 'Routing Algorithms', 'WireShark']
    },
    {
      courseCode: 'CS229',
      title: 'Machine Learning & Statistical Pattern Recognition',
      credits: 4,
      grade: 'A-',
      semester: 'Winter 2025',
      verifiedHash: '0x55dc17a3',
      instructor: 'Dr. Andrew Ng / Tengyu Ma',
      associatedSkills: ['PyTorch', 'Vector Embeddings', 'Gradient Descent', 'SVMs']
    }
  ]
};

export const initialEvidence: EvidenceItem[] = [
  {
    id: 'ev-1',
    category: 'project',
    status: 'verified',
    title: 'Distributed Task Queue & In-Memory Cache Engine',
    subtitle: 'High-throughput async job orchestrator with Raft consensus',
    date: '2025-02-14',
    description: 'Engineered an asynchronous task execution pipeline with Redis backend, sub-millisecond p99 queue latency, worker heartbeats, and leader election for failover.',
    technicalContribution: 'Architected lock-free circular ring buffers in Go, reducing garbage collection pauses by 42%. Implemented distributed WAL replication and gossip protocol cluster membership.',
    githubUrl: 'https://github.com/alexchen/distributed-task-queue',
    demoUrl: 'https://demo-queue.alexchen.dev',
    verifiedBadgeText: 'Git Commit #9e4a1b Signed & Verified',
    proofHash: '0x9e4a1b7238a9cf291d9004812f8e1',
    tags: ['Go', 'Distributed Systems', 'Redis', 'Docker', 'Raft Consensus'],
    metrics: { prCount: 18 }
  },
  {
    id: 'ev-2',
    category: 'hackathon',
    status: 'verified',
    title: 'CalHacks 11.0 - MediSync AI Triage & Clinical Decision Support',
    subtitle: '1st Runner Up (General Track) • 1,200+ Competitors',
    date: '2024-10-28',
    description: 'Collaborative real-time medical triage portal integrating vector search over EHR records with LLM-assisted preliminary diagnosis scoring.',
    technicalContribution: 'Built the FastAPI REST service handling real-time streaming diagnostics over WebSockets, sub-120ms semantic search with pgvector, and HIPAA-compliant mock encryption layer.',
    githubUrl: 'https://github.com/alexchen/calhacks-medisync',
    demoUrl: 'https://medisync-triage.web.app',
    verifiedBadgeText: 'CalHacks Devpost Verified Certificate',
    proofHash: '0x33b819f201e7492c',
    tags: ['FastAPI', 'Python', 'PostgreSQL', 'pgvector', 'WebSockets', 'TailwindCSS'],
    metrics: { award: '1st Runner Up', teamSize: 4 }
  },
  {
    id: 'ev-3',
    category: 'academic',
    status: 'verified',
    title: 'CS106B: Data Structures & Algorithms',
    subtitle: 'Stanford University • School of Engineering • Grade A+',
    date: '2024-06-12',
    description: 'Exhaustive exploration of computational complexity, tree balancing (AVL, Red-Black), graph traversal (Dijkstra, A*), and dynamic programming.',
    technicalContribution: 'Completed all algorithmic benchmarks with 100% test suite pass rate; implemented custom trie-based autocomplete and Huffman entropy encoder.',
    verifiedBadgeText: 'Official Registrar Signed Attestation',
    proofHash: '0x19a4e8d2bb8104',
    tags: ['DSA', 'C++', 'Algorithmic Efficiency', 'Big-O', 'Data Structures'],
    metrics: { grade: 'A+', units: 5 }
  },
  {
    id: 'ev-4',
    category: 'academic',
    status: 'verified',
    title: 'CS140: Operating Systems & PintOS Kernel Projects',
    subtitle: 'Stanford University • Kernel Architecture • Grade A',
    date: '2025-03-18',
    description: 'Hands-on kernel development on x86 PintOS: thread priority scheduling, synchronization primitives, user program memory protection, and virtual memory page fault handling.',
    technicalContribution: 'Wrote kernel timer alarms without busy-waiting; implemented multi-level feedback queue scheduler (MLFQS) and demand paging with FIFO replacement.',
    verifiedBadgeText: 'Stanford Faculty Gradebook Validated',
    proofHash: '0x4b9a11ef0021c',
    tags: ['C', 'OS Kernel', 'Virtual Memory', 'Concurrency', 'x86 Assembly'],
    metrics: { grade: 'A', units: 4 }
  },
  {
    id: 'ev-5',
    category: 'hackathon',
    status: 'verified',
    title: 'TreeHacks 2024 - EdgeConsensus IoT Mesh Protocol',
    subtitle: 'Winner: Best Systems Architecture Award • Stanford TreeHacks',
    date: '2024-02-18',
    description: 'Decentralized peer-to-peer data synchronization network designed for battery-constrained environmental sensors with intermittent cellular links.',
    technicalContribution: 'Wrote the Merkle DAG synchronization algorithm and CRDT conflict resolution engine running on embedded Linux microcontrollers.',
    githubUrl: 'https://github.com/alexchen/treehacks-edge-consensus',
    verifiedBadgeText: 'TreeHacks 2024 Judge Attestation Token',
    proofHash: '0x88921ec5a4b1009',
    tags: ['Systems', 'CRDTs', 'Go', 'IoT', 'P2P Networking'],
    metrics: { award: 'Best Systems Architecture', teamSize: 3 }
  },
  {
    id: 'ev-6',
    category: 'certificate',
    status: 'verified',
    title: 'AWS Certified Solutions Architect - Associate',
    subtitle: 'Amazon Web Services • Credly ID #AWS-849102',
    date: '2024-11-10',
    description: 'Validated expertise in architecting secure, resilient, high-performing, and cost-optimized cloud architectures using VPCs, ECS, S3, IAM, and CloudFront.',
    verifiedBadgeText: 'Credly Cryptographic Proof Verified',
    proofHash: '0xaws84910283b0f',
    tags: ['AWS', 'Cloud Infrastructure', 'VPC', 'ECS', 'IAM', 'Security']
  },
  {
    id: 'ev-7',
    category: 'github',
    status: 'autosync',
    title: 'FastAPI Vector Store Benchmark & Retrieval Service',
    subtitle: '84 Commits • 12 Merged PRs • CI 100% Pass',
    date: '2025-01-20',
    description: 'Open-source benchmark harness evaluating HNSW indexing speeds and cosine similarity recall across Milvus, Qdrant, and pgvector under multi-tenant load.',
    technicalContribution: 'Implemented async connection pooling, Locust stress testing pipelines, and automated GitHub Actions workflow with Docker image publish.',
    githubUrl: 'https://github.com/alexchen/fastapi-vector-benchmarks',
    verifiedBadgeText: 'GitHub Webhook Telemetry Active',
    proofHash: '0x71fa08892011b',
    tags: ['Python', 'FastAPI', 'Docker', 'pgvector', 'CI/CD', 'AsyncIO'],
    metrics: { prCount: 12 }
  },
  {
    id: 'ev-8',
    category: 'certificate',
    status: 'verified',
    title: 'Certified Kubernetes Administrator (CKA)',
    subtitle: 'The Linux Foundation • License CKA-992184',
    date: '2024-12-05',
    description: 'Demonstrated proficiency in cluster architecture, installation, configuration, networking (CNI), ingress controllers, and storage orchestration.',
    verifiedBadgeText: 'Linux Foundation Seal Confirmed',
    proofHash: '0xcka992184200f',
    tags: ['Kubernetes', 'K8s', 'Container Orchestration', 'DevOps', 'Helm']
  }
];

export const targetRolesList: TargetRole[] = [
  {
    id: 'software-developer',
    title: 'Software Developer (Full-Stack / Systems)',
    shortTitle: 'Software Developer',
    tier: 'Tier 1 Standard Target',
    matchPercentage: 74,
    requiredSkillsCount: 28,
    verifiedSkillsCount: 21,
    roleMatrixId: 'STD-SWE-2025',
    deltaToHiring: -26,
    description: 'Generalist engineering standard prioritizing robust software architecture, concurrent systems, database design, and end-to-end service delivery.',
    radarScores: {
      dsa: 94,
      restApi: 62,
      cloudOps: 21,
      testing: 38,
      oop: 90,
      dbms: 88
    },
    competencies: {
      algorithmic: 94,
      serviceLayer: 62,
      infrastructure: 21
    },
    requiredStack: [
      { name: 'Data Structures & Algorithms', status: 'met' },
      { name: 'OOP & Clean Architecture', status: 'met' },
      { name: 'Relational DBs (PostgreSQL)', status: 'met' },
      { name: 'REST API Design (FastAPI/Express)', status: 'pending' },
      { name: 'Automated E2E Testing (Pytest/Jest)', status: 'gap' },
      { name: 'Containerization & Cloud Deploy', status: 'gap' }
    ]
  },
  {
    id: 'frontend-developer',
    title: 'Frontend Developer (React / Next.js / TypeScript)',
    shortTitle: 'Frontend Developer',
    tier: 'Target Match: 88%',
    matchPercentage: 88,
    requiredSkillsCount: 24,
    verifiedSkillsCount: 21,
    roleMatrixId: 'STD-FE-2025',
    deltaToHiring: -12,
    description: 'Expertise in modern reactive UI architecture, state synchronization, TypeScript type safety, and responsive design systems.',
    radarScores: {
      dsa: 82,
      restApi: 85,
      cloudOps: 45,
      testing: 70,
      oop: 80,
      dbms: 65
    },
    competencies: {
      algorithmic: 82,
      serviceLayer: 88,
      infrastructure: 45
    },
    requiredStack: [
      { name: 'TypeScript & Modern ESNext', status: 'met' },
      { name: 'React 18/19 & Component Lifecycle', status: 'met' },
      { name: 'Tailwind CSS & Design Tokens', status: 'met' },
      { name: 'State Management (Zustand/Context)', status: 'met' },
      { name: 'Browser Performance & CWV', status: 'pending' },
      { name: 'Visual Regression Testing (Playwright)', status: 'gap' }
    ]
  },
  {
    id: 'backend-developer',
    title: 'Backend Developer (Go / Distributed Systems)',
    shortTitle: 'Backend Developer',
    tier: 'Target Match: 81%',
    matchPercentage: 81,
    requiredSkillsCount: 30,
    verifiedSkillsCount: 24,
    roleMatrixId: 'STD-BE-2025',
    deltaToHiring: -19,
    description: 'Deep emphasis on concurrency paradigms, microservice architecture, low-latency data pipelines, and distributed consensus algorithms.',
    radarScores: {
      dsa: 92,
      restApi: 80,
      cloudOps: 50,
      testing: 60,
      oop: 85,
      dbms: 92
    },
    competencies: {
      algorithmic: 92,
      serviceLayer: 82,
      infrastructure: 50
    },
    requiredStack: [
      { name: 'Concurrency & Threading (Go/C++)', status: 'met' },
      { name: 'ACID Transactions & Indexing', status: 'met' },
      { name: 'gRPC & REST Microservices', status: 'met' },
      { name: 'Caching & Message Queues', status: 'met' },
      { name: 'Distributed Tracing & OpenTelemetry', status: 'pending' },
      { name: 'Kubernetes Production Delivery', status: 'gap' }
    ]
  },
  {
    id: 'ai-ml-engineer',
    title: 'AI/ML Infrastructure Engineer (LLMs / PyTorch)',
    shortTitle: 'AI/ML Engineer',
    tier: 'Target Match: 52%',
    matchPercentage: 52,
    requiredSkillsCount: 32,
    verifiedSkillsCount: 16,
    roleMatrixId: 'STD-AIML-2025',
    deltaToHiring: -48,
    description: 'Vector embeddings, model distillation, inference optimization, Triton server orchestration, and retrieval-augmented generation pipelines.',
    radarScores: {
      dsa: 88,
      restApi: 60,
      cloudOps: 30,
      testing: 35,
      oop: 70,
      dbms: 60
    },
    competencies: {
      algorithmic: 88,
      serviceLayer: 55,
      infrastructure: 30
    },
    requiredStack: [
      { name: 'Linear Algebra & Calculus', status: 'met' },
      { name: 'PyTorch Model Prototyping', status: 'pending' },
      { name: 'Vector Databases (pgvector/Qdrant)', status: 'met' },
      { name: 'GPU Memory Optimization (vLLM)', status: 'gap' },
      { name: 'Distributed Training (DeepSpeed)', status: 'gap' },
      { name: 'Production MLOps Pipeline', status: 'gap' }
    ]
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity & Application Security Analyst',
    shortTitle: 'Cybersecurity Analyst',
    tier: 'Target Match: 45%',
    matchPercentage: 45,
    requiredSkillsCount: 26,
    verifiedSkillsCount: 12,
    roleMatrixId: 'STD-SEC-2025',
    deltaToHiring: -55,
    description: 'Threat modeling, static/dynamic code vulnerability analysis, OAuth2/OIDC security, zero-trust network boundaries, and cryptanalysis.',
    radarScores: {
      dsa: 75,
      restApi: 50,
      cloudOps: 40,
      testing: 30,
      oop: 65,
      dbms: 70
    },
    competencies: {
      algorithmic: 75,
      serviceLayer: 45,
      infrastructure: 40
    },
    requiredStack: [
      { name: 'Operating System Memory Protection', status: 'met' },
      { name: 'Cryptographic Hashing & Salting', status: 'met' },
      { name: 'OWASP Top 10 Vulnerability Audit', status: 'pending' },
      { name: 'Network Protocol Hardening', status: 'pending' },
      { name: 'Automated SAST/DAST CI Integration', status: 'gap' },
      { name: 'Cloud Security Posture Management', status: 'gap' }
    ]
  }
];

export const sampleMission: ProjectMission = {
  id: 'msn-0842',
  specId: 'MSN-0842',
  status: 'Ready to Initiate',
  targetRole: 'Software Developer (Full-Stack / Systems)',
  estimatedHours: '18 hrs total (~2-3 wks)',
  level: 'Mid-to-Advanced Project',
  title: 'Build & Deploy a Production-Ready REST API Service',
  objective: 'Bridge critical capability gaps in Automated Integration Testing, Docker Containerization, and Cloud Infrastructure Orchestration with verifiable evidence hashes.',
  description: 'Design and deploy a resilient RESTful microservice adhering to production twelve-factor standards. Includes JWT/RBAC security, automated unit and integration testing pipelines with >85% code coverage, Docker multi-stage optimization, and public deployment verified by SkillGraph automated webhooks.',
  skillDelta: '+340 XP / +18.4%',
  competencySurge: 78,
  shaSpec: 'sha256:4a081bc9e102f4837a1c0d5e89a3182b',
  specifications: [
    {
      num: '01',
      title: 'FastAPI or Express Architecture',
      badge: 'Core Service',
      description: 'Implement a structured RESTful API with route modularity, dependency injection, and centralized error handling middleware.',
      badgeColor: 'text-primary'
    },
    {
      num: '02',
      title: 'PostgreSQL & SQLAlchemy Database Layer',
      badge: 'Persistence',
      description: 'Define relational schema migrations (Alembic/Prisma), indexed foreign keys, and atomic transaction rollbacks for concurrent writes.',
      badgeColor: 'text-secondary'
    },
    {
      num: '03',
      title: 'JWT Authentication & Role-Based Access Control',
      badge: 'Security',
      description: 'Stateless access tokens with refresh rotation, salted bcrypt password hashing, and role decorator guards on sensitive routes.',
      badgeColor: 'text-tertiary'
    },
    {
      num: '04',
      title: 'Automated Testing Suite (>85% Branch Coverage)',
      badge: 'Verification Gate',
      description: 'Pytest/Jest integration testing with containerized test database fixtures, mock third-party services, and CI coverage enforcement.',
      badgeColor: 'text-error'
    },
    {
      num: '05',
      title: 'Multi-Stage Docker Containerization',
      badge: 'DevOps',
      description: 'Lightweight Alpine/distroless production image under 95MB with non-root security context, healthcheck directive, and .dockerignore.',
      badgeColor: 'text-primary'
    },
    {
      num: '06',
      title: 'Production Cloud Delivery & Live Healthcheck',
      badge: 'Cloud Ops',
      description: 'Continuous deployment to cloud container service with automated TLS, environment secret isolation, and /api/health probe.',
      badgeColor: 'text-secondary'
    }
  ],
  deliverables: [
    {
      id: 'del-1',
      name: 'GitHub Repository URL',
      tag: 'Code Standard',
      description: 'Public Git repository with structured commit history and MIT/Apache license',
      checked: false
    },
    {
      id: 'del-2',
      name: 'Comprehensive README.md',
      tag: 'Documentation',
      description: 'Local development setup, environment variable requirements, and OpenAPI spec documentation',
      checked: false
    },
    {
      id: 'del-3',
      name: 'Live Public Deployment URL',
      tag: 'Production Proof',
      description: 'Accessible HTTPS domain with operational /api/health status endpoint',
      checked: false
    },
    {
      id: 'del-4',
      name: 'Automated CI Test Run Summary',
      tag: 'Quality Gate',
      description: 'Green GitHub Actions workflow run proving >85% branch test coverage',
      checked: false
    },
    {
      id: 'del-5',
      name: 'Architecture Topology Diagram',
      tag: 'System Design',
      description: 'Mermaid or vector visual depicting client, gateway, database, and auth boundaries',
      checked: false
    }
  ],
  milestones: [
    {
      number: 1,
      timeline: 'Days 1-3',
      title: 'Domain Modeling & Scaffold',
      description: 'Define relational entities, Alembic migrations, and seed scripts with FastAPI or Express.',
      completed: false
    },
    {
      number: 2,
      timeline: 'Days 4-7',
      title: 'Auth & Secure Business Logic',
      description: 'Implement JWT tokens, Argon2/bcrypt hashing, and scoped role middleware.',
      completed: false
    },
    {
      number: 3,
      timeline: 'Days 8-12',
      title: 'Automated Integration Testing',
      description: 'Write comprehensive test suite targeting 85%+ branch coverage with Docker test runner.',
      completed: false
    },
    {
      number: 4,
      timeline: 'Days 13-18',
      title: 'Containerization & Cloud Deploy',
      description: 'Build optimized multi-stage Docker image, configure cloud ingress, and ingest verification token.',
      completed: false
    }
  ]
};

export const initialSkillNodes: SkillNodeData[] = [
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    tag: 'DSA',
    badge: '9.8',
    category: 'academic',
    status: 'MASTERY',
    confidence: 98,
    confidenceFloor: 92,
    verifiedCap: 99,
    sub: 'Asymptotic analysis, balanced BSTs, graph traversal & dynamic programming.',
    desc: 'Empirically proven through Stanford CS106B (Grade A+) and competitive algorithmic problem solving. Zero memory leaks across rigorous Valgrind profiling tests.',
    hierarchy: 'Core Computer Science',
    x: 120,
    y: 180,
    projects: [
      { name: 'Stanford CS106B', detail: 'Course Grade: A+ (5 units) • Verified by Registrar' },
      { name: 'Huffman Entropy Compressor', detail: 'Bitwise binary tree serialization in C++' }
    ],
    github: ['alexchen/stanford-cs106b-benchmarks', 'alexchen/algo-templates'],
    academic: 'Stanford CS106B • Grade A+ • 5 Units',
    lastUpdated: '2025-01-14',
    loc: '8,400 lines C++'
  },
  {
    id: 'python',
    title: 'Python Language Core',
    tag: 'PYTHON',
    badge: '9.4',
    category: 'github',
    status: 'PROFICIENT',
    confidence: 94,
    confidenceFloor: 88,
    verifiedCap: 96,
    sub: 'Type hints, asyncio event loop, generators, and packaging.',
    desc: 'Extensive use in production AI microservices, asynchronous benchmarks, and competitive ML workflows. Thorough knowledge of GIL, CPython internals, and memory profiling.',
    hierarchy: 'Programming Languages',
    x: 280,
    y: 100,
    projects: [
      { name: 'FastAPI Vector Benchmarks', detail: 'AsyncIO concurrency benchmark with 12 PRs' },
      { name: 'MediSync Clinical AI', detail: 'CalHacks 11.0 1st Runner Up diagnostic backend' }
    ],
    github: ['alexchen/fastapi-vector-benchmarks', 'alexchen/calhacks-medisync'],
    academic: 'CS229 Machine Learning • Grade A-',
    lastUpdated: '2025-02-18',
    loc: '14,200 lines Python'
  },
  {
    id: 'fastapi',
    title: 'FastAPI Web Framework',
    tag: 'FASTAPI',
    badge: '8.8',
    category: 'github',
    status: 'VERIFIED',
    confidence: 88,
    confidenceFloor: 80,
    verifiedCap: 92,
    sub: 'Dependency injection, Pydantic v2 schemas, OpenAPI specs.',
    desc: 'Built asynchronous endpoints serving real-time vector retrieval and triage scoring. Benchmarked throughput up to 4,200 req/sec under Locust distributed loads.',
    hierarchy: 'Backend Architecture',
    x: 460,
    y: 90,
    projects: [
      { name: 'MediSync Triage Service', detail: 'Sub-120ms streaming diagnosis API' },
      { name: 'Vector Store Harness', detail: 'Multi-tenant benchmark harness' }
    ],
    github: ['alexchen/fastapi-vector-benchmarks'],
    academic: 'Demonstrated in 2 Hackathons & Production Git',
    lastUpdated: '2025-02-10',
    loc: '6,100 lines Python'
  },
  {
    id: 'posix-c',
    title: 'Operating Systems & Concurrency',
    tag: 'OS / C',
    badge: '9.2',
    category: 'academic',
    status: 'MASTERY',
    confidence: 92,
    confidenceFloor: 85,
    verifiedCap: 95,
    sub: 'POSIX threads, lock primitives, kernel syscalls, demand paging.',
    desc: 'Completed PintOS kernel projects at Stanford CS140. Implemented MLFQS scheduling, thread synchronization, user memory isolation, and swap file systems.',
    hierarchy: 'Systems & Infrastructure',
    x: 240,
    y: 280,
    projects: [
      { name: 'PintOS Kernel Threads', detail: 'Stanford CS140 Operating Systems • Grade A' },
      { name: 'CS110 Concurrent Systems', detail: 'POSIX Sockets, Pipes, Signal Handlers' }
    ],
    github: ['alexchen/stanford-cs140-pinto'],
    academic: 'Stanford CS140 (Grade A) & CS110 (Grade A)',
    lastUpdated: '2025-03-01',
    loc: '9,800 lines C'
  },
  {
    id: 'go-raft',
    title: 'Distributed Consensus & Go',
    tag: 'RAFT / GO',
    badge: '8.6',
    category: 'project',
    status: 'VERIFIED',
    confidence: 86,
    confidenceFloor: 78,
    verifiedCap: 90,
    sub: 'State machine replication, leader election, log compaction.',
    desc: 'Authored an in-memory distributed task queue with fault-tolerant Raft leader election and WAL storage. Passes Jepsen-style network partition simulations.',
    hierarchy: 'Distributed Systems',
    x: 440,
    y: 260,
    projects: [
      { name: 'Distributed Task Queue & Cache', detail: 'Git Commit #9e4a1b Signed & Verified' },
      { name: 'TreeHacks EdgeConsensus', detail: 'Best Systems Architecture Winner' }
    ],
    github: ['alexchen/distributed-task-queue', 'alexchen/treehacks-edge-consensus'],
    academic: 'Self-Directed Advanced Capstone & TreeHacks Winner',
    lastUpdated: '2025-02-14',
    loc: '11,400 lines Go'
  },
  {
    id: 'postgres-sql',
    title: 'PostgreSQL & Relational DBMS',
    tag: 'POSTGRES',
    badge: '8.9',
    category: 'academic',
    status: 'VERIFIED',
    confidence: 89,
    confidenceFloor: 82,
    verifiedCap: 94,
    sub: 'Relational algebra, EXPLAIN ANALYZE query planning, ACID, B-Tree index.',
    desc: 'Validated by Stanford CS145 (Grade A+) and production implementations with pgvector. Proficient in connection pooling, composite indexing, and transactional isolation levels.',
    hierarchy: 'Database Architecture',
    x: 630,
    y: 130,
    projects: [
      { name: 'CS145 Relational DBs', detail: 'Grade A+ • Stanford University' },
      { name: 'MediSync pgvector Pipeline', detail: 'HNSW vector indexing with PostgreSQL' }
    ],
    github: ['alexchen/calhacks-medisync', 'alexchen/fastapi-vector-benchmarks'],
    academic: 'Stanford CS145 • Grade A+ • 4 Units',
    lastUpdated: '2025-01-28',
    loc: '4,500 lines SQL'
  },
  {
    id: 'typescript-react',
    title: 'TypeScript & Modern React UI',
    tag: 'REACT / TS',
    badge: '8.4',
    category: 'project',
    status: 'VERIFIED',
    confidence: 84,
    confidenceFloor: 76,
    verifiedCap: 90,
    sub: 'Static type inference, React 18/19 concurrent hooks, Tailwind v4 design tokens.',
    desc: 'Engineered clean, accessible, high-performance web dashboards with complex interactive DAG visualizers, real-time WebSockets, and zero UI regressions.',
    hierarchy: 'Frontend Architecture',
    x: 620,
    y: 280,
    projects: [
      { name: 'SkillGraph UI Portal', detail: 'Architected responsive SVG graphs and tabs' },
      { name: 'MediSync Web Triage', detail: 'Real-time WebSocket patient feed' }
    ],
    github: ['alexchen/skillgraph-frontend', 'alexchen/calhacks-medisync'],
    academic: 'Web Architecture Workshop & Open Source',
    lastUpdated: '2025-03-10',
    loc: '12,800 lines TSX'
  },
  {
    id: 'docker-k8s',
    title: 'Docker & Kubernetes Cloud Ops',
    tag: 'K8S GAP',
    badge: '4.8',
    category: 'all',
    status: 'GAP',
    confidence: 48,
    confidenceFloor: 30,
    verifiedCap: 60,
    sub: 'Container security, multi-stage builds, ingress routing, CI/CD orchestration.',
    desc: 'Identified as the primary hiring gap for Tier 1 Software Engineer benchmarks. While certified in CKA concepts, lack public evidence of production Kubernetes cluster deployment in Git repository.',
    hierarchy: 'DevOps & Cloud Infrastructure',
    x: 820,
    y: 200,
    projects: [
      { name: 'AWS SA-Associate Exam', detail: 'Credly #AWS-849102 Verified' },
      { name: 'Target Mission MSN-0842', detail: 'Pending execution to validate +18% surge' }
    ],
    github: ['alexchen/fastapi-vector-benchmarks (Docker only)'],
    academic: 'CKA Credential #CKA-992184 on Record',
    lastUpdated: '2025-02-01',
    loc: '850 lines YAML/Dockerfile'
  }
];

export const skillEdges = [
  { from: 'dsa', to: 'python', label: 'Algorithmic Foundation' },
  { from: 'dsa', to: 'posix-c', label: 'Memory & Pointers' },
  { from: 'posix-c', to: 'go-raft', label: 'Concurrency Primitives' },
  { from: 'python', to: 'fastapi', label: 'Web Runtime' },
  { from: 'fastapi', to: 'postgres-sql', label: 'ORM & Query Layer' },
  { from: 'fastapi', to: 'docker-k8s', label: 'Containerization Gap' },
  { from: 'postgres-sql', to: 'typescript-react', label: 'Data Serialization' },
  { from: 'go-raft', to: 'docker-k8s', label: 'Cluster Orchestration' }
];
