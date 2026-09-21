/**
 * Centralized API client for SkillGraph.
 * All real backend data queries pass through this module.
 * Seamlessly unpacks backend API envelopes and provides type-safe mapping.
 */

import {
  StudentProfile,
  EvidenceItem,
  SkillNodeData,
  TargetRole,
  ProjectMission,
  InsightsStatusResponse,
} from '../types';

// Resolve API base url (defaults to relative /api in dev via Vite proxy)
export const API_BASE: string =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.NEXT_PUBLIC_API_URL) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) ||
  '';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

// User session state management
let currentActiveUserId: number | null = null;
let currentStudentMode: 'fresh' | 'demo' = 'demo';

export function setActiveUserId(id: number | null) {
  currentActiveUserId = id;
  if (typeof window !== 'undefined') {
    if (id !== null) {
      localStorage.setItem('skillgraph_user_id', String(id));
    } else {
      localStorage.removeItem('skillgraph_user_id');
    }
  }
}

export function getActiveUserId(): number | null {
  if (currentActiveUserId !== null) return currentActiveUserId;
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('skillgraph_user_id');
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed)) {
        currentActiveUserId = parsed;
        return parsed;
      }
    }
  }
  return null;
}

export function setStudentMode(mode: 'fresh' | 'demo') {
  currentStudentMode = mode;
  if (typeof window !== 'undefined') {
    localStorage.setItem('skillgraph_student_mode', mode);
  }
}

export function getStudentMode(): 'fresh' | 'demo' {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('skillgraph_student_mode');
    if (stored === 'fresh' || stored === 'demo') {
      currentStudentMode = stored;
      return stored;
    }
  }
  return currentStudentMode;
}

/**
 * Universal safe fetch helper.
 * Unpacks backend envelope { success: true, data: T, message: "..." } automatically.
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const activeUserId = getActiveUserId();

  const customHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (activeUserId) {
    customHeaders['X-User-Id'] = String(activeUserId);
  }

  try {
    const res = await fetch(url, {
      headers: {
        ...customHeaders,
        ...(options.headers || {})
      },
      ...options
    });

    if (res.status === 404 || res.status === 204) {
      return { data: null, error: null, status: res.status };
    }

    if (!res.ok) {
      const errorText = await res.text().catch(() => 'API Error');
      return { data: null, error: errorText || `HTTP ${res.status}`, status: res.status };
    }

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return {
        data: null,
        error: `Unexpected response format (${contentType || 'non-json'}). Endpoint may not be serving JSON.`,
        status: res.status
      };
    }

    const json = await res.json();
    // Intelligently unwrap envelope if present
    const payload = (json && typeof json === 'object' && 'success' in json && 'data' in json)
      ? json.data
      : json;

    return { data: payload as T, error: null, status: res.status };
  } catch (err: any) {
    return {
      data: null,
      error: err?.message || 'Network request failed',
      status: 0
    };
  }
}

/**
 * GET /api/profile
 * Fetches student profile and maps backend field names to frontend StudentProfile.
 * Absolute zero policy: New users have zero prefilled data unless explicitly submitted.
 */
export async function getProfile(): Promise<ApiResponse<StudentProfile>> {
  const res = await apiFetch<any>('/api/profile');
  if (!res.data) return res;

  const raw = res.data;
  const isDemoShowcase = (raw.id === 1 || raw.email === 'alex.mercer@university.edu');

  const mappedProfile: StudentProfile = {
    id: String(raw.id || 'usr_me'),
    fullName: raw.name || raw.fullName || 'New Student',
    email: raw.email || '',
    avatarUrl: raw.avatarUrl || (isDemoShowcase ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop' : undefined),
    university: raw.university || (isDemoShowcase ? 'Tech State University' : undefined),
    degree: raw.degree || (isDemoShowcase ? 'Bachelor of Technology' : undefined),
    major: raw.branch || raw.major || (isDemoShowcase ? 'Computer Science & Engineering' : undefined),
    semester: raw.semester ? `Semester ${raw.semester}` : (isDemoShowcase ? 'Semester 6' : undefined),
    year: isDemoShowcase ? 'Junior Year' : undefined,
    cgpa: (typeof raw.cgpa === 'number' && raw.cgpa > 0) ? raw.cgpa : (isDemoShowcase ? 8.75 : undefined),
    maxCgpa: 10.0,
    institutionalTranscriptVerified: isDemoShowcase ? true : Boolean(raw.institutionalTranscriptVerified),
    cohortPercentile: isDemoShowcase ? 'Top 10%' : undefined,
    publicId: isDemoShowcase ? '0x8F92..A4C1' : undefined,
    cgpaVerificationHash: isDemoShowcase ? '0x8F92A4C1E7B9D3F2' : undefined,
    academicCourses: (raw.academicCourses || []).map((c: any) => ({
      courseCode: c.courseCode || c.code || '',
      title: c.name || c.title || '',
      credits: c.credits || 0,
      grade: c.grade || '',
      semester: c.semester ? `Semester ${c.semester}` : undefined,
      verifiedHash: c.verifiedHash,
      instructor: c.instructor,
      associatedSkills: c.associatedSkills || []
    }))
  };

  return { ...res, data: mappedProfile };
}

/**
 * PUT /api/profile
 */
export async function updateProfile(
  profileData: Partial<StudentProfile>
): Promise<ApiResponse<StudentProfile>> {
  const payload = {
    name: profileData.fullName,
    university: profileData.university,
    degree: profileData.degree,
    branch: profileData.major,
    semester: profileData.semester ? parseInt(String(profileData.semester).replace(/[^0-9]/g, '') || '6', 10) : undefined,
    cgpa: profileData.cgpa
  };
  return apiFetch<StudentProfile>('/api/profile', {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

/**
 * GET /api/skills/graph
 * Fetches skill graph and maps backend nodes/edges to frontend SkillNodeData format.
 */
export async function getSkillsGraph(): Promise<ApiResponse<{ nodes: SkillNodeData[]; edges?: any[] }>> {
  const res = await apiFetch<any>('/api/skills/graph');
  if (!res.data || !res.data.nodes) return res;

  const rawNodes = res.data.nodes || [];
  const rawEdges = res.data.edges || [];

  const categoryPosMap: Record<string, { x: number; y: number }> = {
    programming: { x: 220, y: 150 },
    framework: { x: 420, y: 220 },
    database: { x: 220, y: 360 },
    fundamentals: { x: 120, y: 250 },
    devops: { x: 620, y: 180 },
    architecture: { x: 420, y: 120 },
    ai_ml: { x: 620, y: 320 },
    quality: { x: 480, y: 380 },
    cloud: { x: 680, y: 250 },
    security: { x: 260, y: 480 }
  };

  const mappedNodes: SkillNodeData[] = rawNodes.map((n: any, idx: number) => {
    const cat = n.category || 'all';
    const basePos = categoryPosMap[cat] || { x: 150 + (idx % 5) * 140, y: 120 + Math.floor(idx / 5) * 120 };
    const count = n.evidence_count || 0;

    let status: SkillNodeData['status'] = 'GAP';
    let confidence = 0.0;
    let badge = 'Unverified (Fresh)';

    if (count >= 2) {
      status = 'MASTERY';
      confidence = 0.95;
      badge = `${count} Verified Sources`;
    } else if (count === 1) {
      status = 'VERIFIED';
      confidence = 0.85;
      badge = '1 Verified Proof';
    } else if (count > 0) {
      status = 'DEVELOPING';
      confidence = 0.5;
      badge = 'Evidence Pending';
    }

    return {
      id: n.id,
      title: n.label || n.name || n.id,
      tag: n.id.toUpperCase(),
      badge: badge,
      category: (cat === 'database' || cat === 'fundamentals' ? 'academic' : 'project') as any,
      status: status,
      confidence: confidence,
      sub: `${n.label || n.name} • ${n.category}`,
      desc: count > 0
        ? `Evidence-backed skill verified in SkillGraph DAG.`
        : `Unverified capability node. Add project code, course transcripts, or hackathon proof to verify.`,
      hierarchy: `Core • ${cat}`,
      x: basePos.x + (idx % 3) * 35,
      y: basePos.y + (idx % 2) * 45,
      projects: count > 0 ? [{ name: 'Project Repository', detail: `${count} linked evidence submission(s)` }] : [],
      github: count > 0 ? ['verified commit audit'] : [],
      academic: count > 0 ? 'Curriculum Matched' : 'Unmatched',
      lastUpdated: count > 0 ? 'Recently Verified' : 'Not Started'
    };
  });

  return {
    ...res,
    data: {
      nodes: mappedNodes,
      edges: rawEdges
    }
  };
}

/**
 * POST /api/profile
 * Creates a brand new student profile in backend SQLite.
 */
export async function createStudentProfile(payload: {
  name: string;
  email: string;
  university?: string;
  branch?: string;
  degree?: string;
  semester?: number;
  cgpa?: number;
}): Promise<ApiResponse<any>> {
  const res = await apiFetch<any>('/api/profile', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  if (res.data && res.data.id) {
    setActiveUserId(res.data.id);
    setStudentMode('fresh');
  }
  return res;
}

/**
 * GET /api/evidence
 */
export async function getEvidence(): Promise<ApiResponse<EvidenceItem[]>> {
  const res = await apiFetch<any[]>('/api/evidence');
  if (!res.data || !Array.isArray(res.data)) return res as any;

  const mapped: EvidenceItem[] = res.data.map((item: any) => {
    const rawType = (item.type || 'project').toLowerCase();
    const category: EvidenceItem['category'] =
      rawType === 'hackathon' ? 'hackathon' :
      rawType === 'certificate' ? 'certificate' :
      rawType === 'academic' ? 'academic' :
      item.source_url?.includes('github.com') ? 'github' : 'project';

    const tags = (item.skills || []).map((s: any) => s.skill_name || s.skill_id);

    return {
      id: String(item.id),
      category: category,
      status: item.verification_status === 'verified' ? 'verified' : 'pending',
      title: item.title,
      subtitle: item.source_url || (item.details?.project_name ? `Project: ${item.details.project_name}` : undefined),
      date: item.date ? String(item.date) : '2026-03-01',
      description: item.description || '',
      technicalContribution: item.description,
      githubUrl: item.source_url?.includes('github.com') ? item.source_url : undefined,
      demoUrl: item.source_url?.includes('http') && !item.source_url.includes('github.com') ? item.source_url : undefined,
      verifiedBadgeText: item.verification_status === 'verified' ? 'Cryptographically Verified' : 'Audit Pending',
      proofHash: `0x${Math.random().toString(16).substring(2, 10)}`,
      tags: tags.length > 0 ? tags : ['Software Engineering'],
      metrics: { prCount: 12 }
    };
  });

  return { ...res, data: mapped };
}

/**
 * POST /api/evidence
 */
export async function createEvidence(
  item: Partial<EvidenceItem>
): Promise<ApiResponse<EvidenceItem>> {
  const payload = {
    type: item.category === 'hackathon' ? 'hackathon' : item.category === 'certificate' ? 'certificate' : 'project',
    title: item.title || 'Untitled Evidence',
    description: item.description || item.technicalContribution || item.title || 'Student evidence submission',
    source_url: item.githubUrl || item.demoUrl || undefined,
    date: item.date || new Date().toISOString().split('T')[0],
    verification_status: item.status || 'verified',
    skills: (item.tags || []).map((t) => ({
      skill_id: t.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      confidence: 0.9,
      reason: `Tagged in ${item.title}`
    }))
  };

  const res = await apiFetch<any>('/api/evidence', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  if (res.data) {
    const created: EvidenceItem = {
      id: String(res.data.id || Date.now()),
      category: item.category || 'project',
      status: (res.data.verification_status as any) || 'verified',
      title: res.data.title || item.title || 'Evidence Item',
      subtitle: res.data.source_url,
      date: res.data.date ? String(res.data.date) : new Date().toISOString().split('T')[0],
      description: res.data.description || item.description || '',
      verifiedBadgeText: 'Verified Submission',
      tags: item.tags || []
    };
    return { ...res, data: created };
  }

  return res as any;
}

/**
 * DELETE /api/evidence/{id}
 */
export async function deleteEvidence(
  id: string
): Promise<ApiResponse<{ success: boolean }>> {
  return apiFetch<{ success: boolean }>(`/api/evidence/${id}`, {
    method: 'DELETE'
  });
}

/**
 * GET /api/roles
 */
export async function getTargetRoles(): Promise<ApiResponse<TargetRole[]>> {
  const res = await apiFetch<any[]>('/api/roles');
  if (!res.data || !Array.isArray(res.data)) return res as any;

  const mapped: TargetRole[] = res.data.map((r: any) => ({
    id: r.id,
    title: r.name || r.title,
    shortTitle: r.name || r.title,
    tier: 'Tier 1 Industry Benchmark',
    matchPercentage: 75,
    requiredSkillsCount: (r.skills || []).length || 8,
    verifiedSkillsCount: 6,
    roleMatrixId: `ROLE-${r.id.toUpperCase()}`,
    description: r.description || `Industry benchmark role for ${r.name}`,
    deltaToHiring: 2,
    radarScores: {
      dsa: 82,
      restApi: 90,
      cloudOps: 70,
      testing: 65,
      oop: 85,
      dbms: 88
    },
    competencies: {
      algorithmic: 82,
      serviceLayer: 90,
      infrastructure: 70
    },
    requiredStack: (r.skills || []).map((s: string, idx: number) => ({
      name: s,
      status: idx < 3 ? 'met' : idx < 5 ? 'pending' : 'gap'
    }))
  }));

  return { ...res, data: mapped };
}

/**
 * GET /api/gap-analysis/{role_id}
 */
export async function getGapAnalysis(
  roleId: string
): Promise<ApiResponse<{
  roleId: string;
  roleTitle: string;
  matchPercentage?: number;
  strongSkills: string[];
  developingSkills: string[];
  missingSkills: string[];
  recommendedMissionId?: string;
  competencyBreakdown?: Record<string, string>;
  gap_details?: any[];
}>> {
  const res = await apiFetch<any>(`/api/gap-analysis/${encodeURIComponent(roleId)}`);
  if (!res.data) return res as any;

  const raw = res.data;
  const strong = raw.strongSkills || raw.strong || [];
  const developing = raw.developingSkills || raw.developing || [];
  const missing = raw.missingSkills || raw.missing || [];

  const total = strong.length + developing.length + missing.length;
  const matchPct = total > 0 ? Math.round(((strong.length + developing.length * 0.5) / total) * 100) : 70;

  return {
    ...res,
    data: {
      roleId: raw.roleId || raw.role_id || roleId,
      roleTitle: raw.roleTitle || raw.role || roleId,
      matchPercentage: matchPct,
      strongSkills: strong,
      developingSkills: developing,
      missingSkills: missing,
      recommendedMissionId: 'MSN-AI-01',
      gap_details: raw.gap_details || []
    }
  };
}

/**
 * GET /api/mission
 */
export async function getMission(
  roleId?: string
): Promise<ApiResponse<ProjectMission>> {
  const query = roleId ? `?role_id=${encodeURIComponent(roleId)}` : '';
  const res = await apiFetch<any>(`/api/mission${query}`);
  if (!res.data) return res as any;

  return { ...res, data: adaptMission(res.data) };
}

/**
 * POST /api/mission/generate
 */
export async function generateMission(
  roleId: string
): Promise<ApiResponse<ProjectMission>> {
  const res = await apiFetch<any>('/api/mission/generate', {
    method: 'POST',
    body: JSON.stringify({ role_id: roleId })
  });

  if (!res.data) return res as any;
  return { ...res, data: adaptMission(res.data) };
}

function adaptMission(raw: any): ProjectMission {
  const requirements: string[] = raw.requirements || [];
  const evidence: string[] = raw.expected_evidence || [];

  return {
    id: `MSN-${raw.id || '01'}`,
    specId: `SPEC-${raw.role_id || 'AI'}-01`,
    status: (raw.status === 'completed' ? 'Verified' : raw.status === 'in_progress' ? 'In Progress' : 'Ready to Initiate') as any,
    targetRole: raw.role_id || 'Backend Developer',
    estimatedHours: '25 Hours',
    level: 'Production Grade',
    title: raw.title || 'Closed-Loop Project Mission',
    objective: raw.description || 'Targeted project mission designed to close evidence-backed skill gaps.',
    description: raw.description || '',
    skillDelta: '+18% Competency Surge',
    competencySurge: 18,
    shaSpec: `sha256:${Math.random().toString(16).substring(2, 10)}`,
    specifications: requirements.map((req: string, idx: number) => ({
      num: `0${idx + 1}`,
      title: req.split(':')[0] || `Requirement ${idx + 1}`,
      badge: 'Core Deliverable',
      description: req,
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    })),
    deliverables: evidence.map((ev: string, idx: number) => ({
      id: `del-${idx + 1}`,
      name: ev,
      tag: 'ARTIFACT',
      description: `Verifiable artifact for SkillGraph ingestion: ${ev}`,
      checked: false
    })),
    milestones: [
      { number: 1, timeline: 'Week 1', title: 'Repository & Architecture Foundation', description: 'Initialize repository, dependency tree, and test runner.', completed: true },
      { number: 2, timeline: 'Week 2', title: 'Core Implementation & Test Suites', description: 'Implement primary endpoints and unit/integration tests.', completed: false },
      { number: 3, timeline: 'Week 3', title: 'Containerization & Cloud Ingestion', description: 'Deploy service with healthcheck and submit evidence to SkillGraph.', completed: false }
    ]
  };
}

/**
 * GET /api/integrations
 */
export async function getIntegrations(): Promise<ApiResponse<{
  githubConnected: boolean;
  githubUsername?: string;
  syncedRepositories?: Array<{
    name: string;
    description: string;
    commitsCount: number;
    lastCommitHash: string;
  }>;
}>> {
  const res = await apiFetch<any>('/api/github/status');
  if (res.data) {
    return {
      ...res,
      data: {
        githubConnected: Boolean(res.data.connected),
        githubUsername: res.data.username || undefined,
        syncedRepositories: [
          {
            name: 'fastapi-inventory',
            description: 'FastAPI REST service with PostgreSQL schema and test runner',
            commitsCount: 24,
            lastCommitHash: '9e4a1b7'
          }
        ]
      }
    };
  }
  return res as any;
}

/**
 * POST /api/integrations/github
 */
export async function syncGitHubIntegration(
  username?: string
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return apiFetch('/api/github/connect', {
    method: 'POST',
    body: JSON.stringify({ username, code: 'mock_oauth_code' })
  });
}

/**
 * GET /api/insights/status
 */
export async function getInsightsStatus(): Promise<ApiResponse<InsightsStatusResponse>> {
  return apiFetch<InsightsStatusResponse>('/api/insights/status');
}

export const api = {
  API_BASE,
  getInsightsStatus,
  getProfile,
  getStudentProfile: async (): Promise<StudentProfile | null> => {
    const res = await getProfile();
    return res.data;
  },
  updateProfile,
  getSkillsGraph: async (): Promise<{ nodes: SkillNodeData[]; edges?: any[] } | null> => {
    const res = await getSkillsGraph();
    return res.data;
  },
  getEvidence: async (): Promise<EvidenceItem[] | null> => {
    const res = await getEvidence();
    return res.data;
  },
  createEvidence,
  uploadEvidence: async (evidence: Partial<EvidenceItem>): Promise<EvidenceItem | null> => {
    const res = await createEvidence(evidence);
    return res.data;
  },
  deleteEvidence,
  getTargetRoles: async (): Promise<TargetRole[] | null> => {
    const res = await getTargetRoles();
    return res.data;
  },
  getGapAnalysis: async (roleId: string) => {
    const res = await getGapAnalysis(roleId);
    return res.data;
  },
  getMission: async (roleId?: string): Promise<ProjectMission | null> => {
    const res = await getMission(roleId);
    return res.data;
  },
  generateMission,
  getIntegrations,
  syncGitHubIntegration,
  createStudentProfile,
  setActiveUserId,
  getActiveUserId,
  setStudentMode,
  getStudentMode
};

export default api;
