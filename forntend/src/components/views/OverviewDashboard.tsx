import React, { useState } from 'react';
import {
  StudentProfile,
  TargetRole,
  EvidenceItem,
  SkillNodeData,
  ViewPath
} from '../../types';
import {
  CheckCircle2,
  ShieldCheck,
  Copy,
  ExternalLink,
  GraduationCap,
  GitBranch,
  Activity,
  Trophy,
  Award,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Zap,
  Check,
  Search,
  Filter,
  Layers,
  ChevronRight,
  Network,
  User,
  PlusCircle
} from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

interface OverviewDashboardProps {
  profile: StudentProfile;
  activeRole?: TargetRole;
  evidenceItems: EvidenceItem[];
  skillNodes: SkillNodeData[];
  onNavigate: (view: ViewPath) => void;
  onOpenLedger: () => void;
  onOpenMissionModal: () => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info') => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  profile,
  activeRole,
  evidenceItems,
  skillNodes,
  onNavigate,
  onOpenLedger,
  onOpenMissionModal,
  onShowToast
}) => {
  const academicCount = (profile.academicCourses && profile.academicCourses.length > 0)
    ? profile.academicCourses.length
    : evidenceItems.filter((e) => e.category === 'academic').length;
  const projectsCount = evidenceItems.filter((e) => e.category === 'project').length;
  const githubCount = evidenceItems.filter((e) => e.repositoryUrl || e.category === 'project').length;
  const hackathonsCount = evidenceItems.filter((e) => e.category === 'hackathon').length;
  
  // Only count skills that have verified or submitted evidence for this student
  const userVerifiedSkills = skillNodes.filter(
    (s) => s.status === 'VERIFIED' || s.status === 'MASTERY' || (s.projects && s.projects.length > 0) || (s.github && s.github.length > 0)
  );
  const skillsCount = userVerifiedSkills.length;

  const [copiedSha, setCopiedSha] = useState(false);
  const [selectedNode, setSelectedNode] = useState<SkillNodeData | null>(
    userVerifiedSkills.length > 0 ? userVerifiedSkills[0] : null
  );

  const hasAnyData =
    evidenceItems.length > 0 ||
    userVerifiedSkills.length > 0 ||
    (profile.university && profile.university.length > 0) ||
    (profile.academicCourses && profile.academicCourses.length > 0);

  const handleCopySha = () => {
    if (!profile.cgpaVerificationHash) return;
    navigator.clipboard.writeText(profile.cgpaVerificationHash);
    setCopiedSha(true);
    onShowToast('Attestation SHA Copied', profile.cgpaVerificationHash, 'success');
    setTimeout(() => setCopiedSha(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto text-left">
      {/* 1. Header: Greeting & Candidate Account Banner */}
      <section className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm relative overflow-hidden card-hover-3d bg-tech-grid">
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-blue-50/30 pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName || 'Student'}
                  referrerPolicy="no-referrer"
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#E2E8F0] shadow-sm"
                />
              ) : (
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#111827] to-[#1E293B] border border-[#E2E8F0] flex items-center justify-center text-white shadow-sm font-mono font-bold text-xl tracking-wider">
                  {profile.fullName
                    ? profile.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()
                    : 'SC'}
                </div>
              )}
              {profile.institutionalTranscriptVerified && profile.cgpa && profile.cgpa > 0 && (
                <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold flex items-center gap-1 border border-emerald-200 shadow-xs">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  VERIFIED
                </span>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-live-pulse" />
                  SkillGraph Telemetry Live
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] flex items-center gap-2">
                <span>Good to see you back 👋</span>
              </h1>
              <p className="text-sm font-mono text-[#475569]">
                {profile.fullName || 'Student Candidate'}
                {profile.university ? ` • ${profile.university}` : ''}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
            {profile.cgpa !== undefined && profile.cgpa > 0 ? (
              <div className="px-4 py-2.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs text-left">
                <div className="text-[10px] font-mono text-[#64748B] uppercase">Cumulative GPA</div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-mono font-bold text-emerald-600">
                    {profile.cgpa.toFixed(2)}
                  </span>
                  {profile.maxCgpa && (
                    <span className="text-xs font-mono text-[#64748B]">/ {profile.maxCgpa.toFixed(2)}</span>
                  )}
                  {profile.institutionalTranscriptVerified && (
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 ml-1">
                      SEALED
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="px-4 py-2.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs text-left">
                <div className="text-[10px] font-mono text-[#64748B] uppercase">Cumulative GPA</div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-mono font-bold text-slate-400">
                    Not Submitted
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {profile.cgpaVerificationHash && (
                <button
                  onClick={handleCopySha}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono text-[#0F172A] transition-all shadow-xs btn-interactive"
                >
                  {copiedSha ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#64748B]" />}
                  <span>{copiedSha ? 'Copied SHA' : 'Copy Attestation'}</span>
                </button>
              )}
              <button
                onClick={onOpenLedger}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#111827] hover:bg-black text-xs font-mono font-semibold text-white shadow-sm transition-all btn-interactive"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Proof Ledger</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Onboarding Empty State if Student Has No Data */}
      {!hasAnyData ? (
        <EmptyState
          title="Build your SkillGraph"
          description="Start by adding your academic profile, projects and achievements. SkillGraph will use your evidence to build your capability graph."
          icon={Sparkles}
          actions={[
            {
              label: 'Complete Profile',
              onClick: () => onNavigate('/profile'),
              variant: 'primary',
              icon: User
            },
            {
              label: 'Add Evidence',
              onClick: () => onNavigate('/evidence'),
              variant: 'secondary',
              icon: PlusCircle
            },
            {
              label: 'Connect GitHub',
              onClick: () => onNavigate('/integrations'),
              variant: 'secondary',
              icon: GitBranch
            }
          ]}
        />
      ) : (
        /* Real Dashboard Metrics & Evidence Sections */
        <div className="space-y-6">
          {/* ======================================================== */}
          {/* 5 SEQUENTIAL ANIMATED METRIC CARDS (Requirement 6)       */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* 1. Academic Evidence */}
            <div className="p-4.5 rounded-2xl bg-white border border-[#E2E8F0] hover:border-blue-300 shadow-xs card-hover-3d transition-all">
              <div className="flex items-center justify-between text-xs text-[#64748B] mb-2 font-mono">
                <span className="font-medium">Academic</span>
                <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[#2563EB]">
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-mono font-bold text-[#0F172A]">
                  {academicCount}
                </div>
                {academicCount > 0 ? (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-600 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-live-pulse" />
                    Verified
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-400 font-medium">
                    0 Linked
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[#64748B] mt-1 font-mono">
                Coursework Units
              </div>
            </div>

            {/* 2. Projects */}
            <div className="p-4.5 rounded-2xl bg-white border border-[#E2E8F0] hover:border-cyan-300 shadow-xs card-hover-3d transition-all">
              <div className="flex items-center justify-between text-xs text-[#64748B] mb-2 font-mono">
                <span className="font-medium">Projects</span>
                <div className="w-6 h-6 rounded-lg bg-cyan-50 border border-cyan-200/60 flex items-center justify-center text-[#0891B2]">
                  <Layers className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-mono font-bold text-[#0F172A]">
                  {projectsCount}
                </div>
                {projectsCount > 0 ? (
                  <span className="text-[10px] font-mono text-[#0891B2] font-semibold bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-200/60">
                    Production
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-400 font-medium">
                    None
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[#64748B] mt-1 font-mono">
                Deployed Artifacts
              </div>
            </div>

            {/* 3. GitHub */}
            <div className="p-4.5 rounded-2xl bg-white border border-[#E2E8F0] hover:border-emerald-300 shadow-xs card-hover-3d transition-all">
              <div className="flex items-center justify-between text-xs text-[#64748B] mb-2 font-mono">
                <span className="font-medium">GitHub</span>
                <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-[#16A34A]">
                  <GitBranch className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-mono font-bold text-[#0F172A]">
                  {githubCount}
                </div>
                {githubCount > 0 ? (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-600 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-live-pulse" />
                    Connected
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-400 font-medium">
                    Not Linked
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[#64748B] mt-1 font-mono">
                Active Repositories
              </div>
            </div>

            {/* 4. Hackathons */}
            <div className="p-4.5 rounded-2xl bg-white border border-[#E2E8F0] hover:border-amber-300 shadow-xs card-hover-3d transition-all">
              <div className="flex items-center justify-between text-xs text-[#64748B] mb-2 font-mono">
                <span className="font-medium">Hackathons</span>
                <div className="w-6 h-6 rounded-lg bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600">
                  <Trophy className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-mono font-bold text-[#0F172A]">
                  {hackathonsCount}
                </div>
                {hackathonsCount > 0 ? (
                  <span className="text-[10px] font-mono text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                    Awards
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-400 font-medium">
                    None
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[#64748B] mt-1 font-mono">
                Competitive Builds
              </div>
            </div>

            {/* 5. Skills */}
            <div className="p-4.5 rounded-2xl bg-white border border-[#E2E8F0] hover:border-blue-400 shadow-xs card-hover-3d transition-all">
              <div className="flex items-center justify-between text-xs text-[#64748B] mb-2 font-mono">
                <span className="font-medium">Skills</span>
                <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[#2563EB]">
                  <Network className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-mono font-bold text-[#0F172A]">
                  {skillsCount}
                </div>
                {skillsCount > 0 ? (
                  <span className="text-[10px] font-mono text-[#2563EB] font-semibold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/60">
                    DAG Nodes
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-400 font-medium">
                    Pending Proof
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[#64748B] mt-1 font-mono">
                Derived Competencies
              </div>
            </div>
          </div>

          {/* Evidence Digest & Skill Graph Snapshot */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Recent Evidence Records */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] font-mono flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Verified Evidence Records
                </h2>
                <button
                  onClick={() => onNavigate('/evidence')}
                  className="text-xs text-[#2563EB] hover:underline font-mono font-semibold"
                >
                  View All ({evidenceItems.length}) →
                </button>
              </div>

              {evidenceItems.length === 0 ? (
                <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] text-center text-xs text-[#64748B] shadow-sm">
                  No evidence submitted yet. Click &quot;Add Evidence&quot; to verify your coursework and projects.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {evidenceItems.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all flex items-start justify-between gap-3 shadow-xs card-hover-3d"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[#0F172A]">
                            {item.title}
                          </span>
                          <span
                            className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                              item.status === 'verified'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            {item.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#475569] line-clamp-1">
                          {item.description}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-[#64748B] shrink-0">
                        {item.date}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Living Skill Graph Snapshot */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] font-mono flex items-center gap-2">
                  <Network className="w-4 h-4 text-[#2563EB]" />
                  SkillGraph Snapshot
                </h2>
                <button
                  onClick={() => onNavigate('/skills')}
                  className="text-xs text-[#2563EB] hover:underline font-mono font-semibold"
                >
                  Explore Interactive Graph →
                </button>
              </div>

              {userVerifiedSkills.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white border border-[#E2E8F0] text-center space-y-3 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 mx-auto flex items-center justify-center font-mono font-bold text-sm">
                    0/24
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A]">
                      No Skills Derived Yet
                    </h3>
                    <p className="text-[11px] text-[#64748B] max-w-sm mx-auto leading-relaxed">
                      Deposit your first project codebase or add verified university courses to extract proven competencies.
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => onNavigate('/skills')}
                      className="text-xs text-[#2563EB] hover:underline font-mono font-semibold"
                    >
                      Explore Full Curriculum Taxonomy →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] space-y-3 shadow-sm card-hover-3d">
                  <div className="flex flex-wrap gap-2">
                    {userVerifiedSkills.map((node) => (
                      <button
                        key={node.id}
                        onClick={() => setSelectedNode(node)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                          selectedNode?.id === node.id
                            ? 'bg-[#111827] text-white border-[#111827] shadow-xs'
                            : 'bg-white text-[#0F172A] border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                        }`}
                      >
                        {node.title} •{' '}
                        <span
                          className={
                            node.status === 'MASTERY' || node.status === 'PROFICIENT'
                              ? selectedNode?.id === node.id ? 'text-emerald-400' : 'text-emerald-600 font-semibold'
                              : node.status === 'DEVELOPING'
                              ? selectedNode?.id === node.id ? 'text-amber-400' : 'text-amber-600 font-semibold'
                              : selectedNode?.id === node.id ? 'text-rose-400' : 'text-rose-600 font-semibold'
                          }
                        >
                          {node.status}
                        </span>
                      </button>
                    ))}
                  </div>

                  {selectedNode && (
                    <div className="pt-3 border-t border-[#E2E8F0] text-xs space-y-1">
                      <div className="font-semibold text-[#0F172A]">
                        {selectedNode.title}{' '}
                        <span className="text-[10px] font-mono text-[#64748B]">
                          ({selectedNode.category})
                        </span>
                      </div>
                      <p className="text-[#475569] text-[11px] leading-relaxed">{selectedNode.desc}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewDashboard;
