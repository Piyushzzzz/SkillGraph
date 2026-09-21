import React, { useState } from 'react';
import {
  StudentProfile,
  TargetRole,
  EvidenceItem,
  SkillNodeData,
  ViewPath
} from '../../types';
import {
  ShieldCheck,
  CheckCircle2,
  GitBranch,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Plus,
  Layers,
  Award,
  BookOpen,
  Check,
  Code2
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
  onOpenLedger
}) => {
  const [selectedNode, setSelectedNode] = useState<SkillNodeData | null>(
    skillNodes.length > 0 ? skillNodes[0] : null
  );

  const studentName = profile?.fullName || 'Alex Chen';
  const roleName = activeRole?.shortTitle || 'Software Developer';

  const hasAnyData =
    evidenceItems.length > 0 ||
    skillNodes.length > 0 ||
    Boolean(profile.university);

  return (
    <div className="py-8 px-4 sm:px-8 max-w-6xl mx-auto text-left space-y-8 animate-fade-in">
      {/* 1. Profile Welcome Card (Stripe / Modern SaaS Style) */}
      <div className="saas-card p-6 sm:p-8 relative overflow-hidden bg-white border border-slate-200">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-md shadow-blue-500/20">
              {studentName.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  {studentName}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80 shadow-2xs">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Verified
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                {profile.university || 'Stanford University'} • {profile.degree || 'Computer Science'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenLedger}
              className="px-4 py-2 text-xs font-semibold saas-btn-secondary flex items-center gap-1.5 shadow-2xs"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Credentials</span>
            </button>
            <button
              onClick={() => onNavigate('/skills')}
              className="px-4 py-2 text-xs font-semibold saas-btn-primary flex items-center gap-1.5"
            >
              <span>Explore Skill Graph</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {!hasAnyData ? (
        <EmptyState
          title="Start building your profile"
          description="Add your coursework, GitHub projects, and hackathon wins to see your skill graph."
          icon={Sparkles}
          actions={[
            {
              label: 'Add Evidence',
              onClick: () => onNavigate('/evidence'),
              variant: 'primary',
              icon: Plus
            }
          ]}
        />
      ) : (
        <>
          {/* 2. Three Clean Highlight Stat Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tile 1: Role Match */}
            <div className="saas-card p-6 space-y-4 bg-white border border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="uppercase tracking-wider text-[11px] font-semibold text-slate-500">Role Match</span>
                <span className="text-slate-800 font-semibold">{roleName}</span>
              </div>
              <div className="text-4xl font-extrabold text-slate-900 tracking-tight">
                86%
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full w-[86%]" />
              </div>
              <button
                onClick={() => onNavigate('/gap-analysis')}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1 pt-1"
              >
                <span>View Gap Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tile 2: Verified Skills */}
            <div className="saas-card p-6 space-y-4 bg-white border border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="uppercase tracking-wider text-[11px] font-semibold text-slate-500">Verified Skills</span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold text-[10px]">
                  All Grounded
                </span>
              </div>
              <div className="text-4xl font-extrabold text-slate-900 tracking-tight">
                {skillNodes.length}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Derived directly from static AST parsing of your GitHub repositories and coursework.
              </p>
              <button
                onClick={() => onNavigate('/skills')}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1"
              >
                <span>Explore Interactive Topology</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tile 3: Proof Artifacts */}
            <div className="saas-card p-6 space-y-4 bg-white border border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="uppercase tracking-wider text-[11px] font-semibold text-slate-500">Proof Artifacts</span>
                <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 font-semibold text-[10px]">
                  Active Vault
                </span>
              </div>
              <div className="text-4xl font-extrabold text-slate-900 tracking-tight">
                {evidenceItems.length}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Repositories, production deployments, and verified university coursework.
              </p>
              <button
                onClick={() => onNavigate('/evidence')}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1"
              >
                <span>View Evidence Records</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3. Recommended Next Step Banner */}
          <div className="saas-card p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-white border border-blue-200/80 shadow-xs">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Recommended Action</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Close your Kafka Event Streaming gap to reach 94% role readiness.
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Complete a 3-day scaffolded project mission to automatically earn the missing competency.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/mission')}
              className="px-5 py-2.5 text-xs font-semibold saas-btn-primary shrink-0 flex items-center gap-1.5"
            >
              <span>View Mission Spec</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4. Two Balanced Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Your Verified Skills Snapshot */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold tracking-tight text-slate-900">
                  Verified Competencies
                </h2>
                <button
                  onClick={() => onNavigate('/skills')}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Interactive Graph →
                </button>
              </div>

              <div className="saas-card p-6 space-y-5 bg-white border border-slate-200">
                <div className="flex flex-wrap gap-2">
                  {skillNodes.map((node) => {
                    const isSelected = selectedNode?.id === node.id;
                    return (
                      <button
                        key={node.id}
                        onClick={() => setSelectedNode(node)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        {node.title}
                      </button>
                    );
                  })}
                </div>

                {selectedNode && (
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-slate-900">
                        {selectedNode.title}
                      </h4>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {selectedNode.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {selectedNode.desc}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Recent Projects & Evidence */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold tracking-tight text-slate-900">
                  Recent Projects & Proof
                </h2>
                <button
                  onClick={() => onNavigate('/evidence')}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                >
                  All Evidence ({evidenceItems.length}) →
                </button>
              </div>

              <div className="space-y-3">
                {evidenceItems.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="saas-card p-5 flex items-start justify-between gap-4 bg-white border border-slate-200"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                    {item.githubUrl && (
                      <a
                        href={item.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-slate-400 hover:text-blue-600 shrink-0 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Open GitHub"
                      >
                        <GitBranch className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OverviewDashboard;
