export type AppRoute =
  | '/'
  | '/login'
  | '/signup'
  | '/dashboard'
  | '/profile'
  | '/evidence'
  | '/evidence/project'
  | '/evidence/hackathon'
  | '/skills'
  | '/roles'
  | '/gap-analysis'
  | '/mission'
  | '/integrations'
  | '/architecture';

export type ViewPath =
  | AppRoute
  | 'overview-dashboard'
  | 'student-profile-and-cgpa'
  | 'evidence-vault'
  | 'submit-project'
  | 'submit-hackathon'
  | 'interactive-skillgraph'
  | 'target-roles'
  | 'gap-analysis'
  | 'project-mission'
  | 'github-integrations'
  | 'project-code-and-architecture';

export type InsightsConnectionStatus =
  | 'Connected'
  | 'Available'
  | 'Not Connected'
  | 'Unavailable'
  | 'Loading'
  | 'Error';

export interface InsightsStatusResponse {
  status: InsightsConnectionStatus | string;
  service?: string;
  version?: string;
  message?: string;
  lastChecked?: string;
  details?: Record<string, unknown>;
}

export interface AcademicCourse {
  courseCode: string;
  title: string;
  credits: number;
  grade: string;
  semester: string;
  verifiedHash: string;
  instructor?: string;
  associatedSkills: string[];
}

export interface StudentProfile {
  id: string;
  fullName?: string;
  email?: string;
  avatarUrl?: string;
  university?: string;
  school?: string;
  degree?: string;
  major?: string;
  semester?: string;
  year?: string;
  cgpa?: number;
  maxCgpa?: number;
  cgpaVerificationHash?: string;
  institutionalTranscriptVerified?: boolean;
  cohortPercentile?: string;
  publicId?: string;
  academicCourses?: AcademicCourse[];
}

export type EvidenceCategory = 'academic' | 'github' | 'project' | 'hackathon' | 'certificate' | 'internship';
export type EvidenceStatus = 'verified' | 'pending' | 'autosync';

export interface EvidenceItem {
  id: string;
  category: EvidenceCategory;
  status: EvidenceStatus;
  title: string;
  subtitle?: string;
  date: string;
  description: string;
  technicalContribution?: string;
  githubUrl?: string;
  demoUrl?: string;
  verifiedBadgeText: string;
  proofHash?: string;
  tags: string[];
  metrics?: {
    grade?: string;
    units?: number;
    award?: string;
    teamSize?: number;
    prCount?: number;
  };
}

export interface SkillNodeData {
  id: string;
  title: string;
  tag: string;
  badge: string;
  category: 'academic' | 'github' | 'hackathon' | 'project' | 'all';
  status: 'MASTERY' | 'PROFICIENT' | 'VERIFIED' | 'DEVELOPING' | 'GAP' | 'ACHIEVEMENT';
  confidence: number;
  confidenceFloor?: number;
  verifiedCap?: number;
  sub: string;
  desc: string;
  hierarchy: string;
  x: number;
  y: number;
  projects: Array<{ name: string; detail: string }>;
  github: string[];
  academic: string;
  lastUpdated: string;
  loc?: string;
}

export interface TargetRole {
  id: string;
  title: string;
  shortTitle: string;
  tier: string;
  matchPercentage: number;
  requiredSkillsCount: number;
  verifiedSkillsCount: number;
  roleMatrixId: string;
  description: string;
  deltaToHiring: number;
  radarScores: {
    dsa: number;
    restApi: number;
    cloudOps: number;
    testing: number;
    oop: number;
    dbms: number;
  };
  competencies: {
    algorithmic: number;
    serviceLayer: number;
    infrastructure: number;
  };
  requiredStack: Array<{
    name: string;
    status: 'met' | 'pending' | 'gap';
  }>;
}

export interface ProjectMission {
  id: string;
  specId: string;
  status: 'Ready to Initiate' | 'In Progress' | 'Verified';
  targetRole: string;
  estimatedHours: string;
  level: string;
  title: string;
  objective: string;
  description: string;
  skillDelta: string;
  competencySurge: number;
  shaSpec: string;
  specifications: Array<{
    num: string;
    title: string;
    badge: string;
    description: string;
    badgeColor?: string;
  }>;
  deliverables: Array<{
    id: string;
    name: string;
    tag: string;
    description: string;
    checked: boolean;
  }>;
  milestones: Array<{
    number: number;
    timeline: string;
    title: string;
    description: string;
    completed: boolean;
  }>;
}
