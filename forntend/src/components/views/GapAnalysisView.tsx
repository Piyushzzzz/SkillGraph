import React from 'react';
import { TargetRole, ViewPath } from '../../types';
import {
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Target,
  ArrowRight,
  Zap,
  Check,
  Compass,
  Layers,
  ShieldCheck,
  Plus,
  ArrowDown
} from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

interface GapAnalysisData {
  roleId: string;
  roleTitle: string;
  strongSkills: string[];
  developingSkills: string[];
  missingSkills: string[];
  recommendedMissionId?: string;
}

interface GapAnalysisViewProps {
  targetRoles: TargetRole[];
  activeRoleId?: string;
  gapData?: GapAnalysisData | null;
  onSelectRole: (roleId: string) => void;
  onNavigate: (view: ViewPath) => void;
  onOpenMissionModal: () => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info') => void;
}

export const GapAnalysisView: React.FC<GapAnalysisViewProps> = ({
  targetRoles,
  activeRoleId,
  gapData,
  onSelectRole,
  onNavigate,
  onOpenMissionModal,
  onShowToast
}) => {
  const activeRole = targetRoles.find((r) => r.id === activeRoleId) || targetRoles[0];

  // Empty State if no target role exists or no gap data exists
  if (!activeRole && !gapData) {
    return (
      <div className="p-6 sm:p-12 max-w-4xl mx-auto text-left">
        <EmptyState
          title="Select a target role to discover your skill gaps."
          description="Compare your current capabilities with the requirements of your target role to generate a personalized project mission."
          icon={Target}
          actions={[
            {
              label: 'Explore Roles',
              onClick: () => onNavigate('/roles'),
              variant: 'primary',
              icon: Target
            }
          ]}
        />
      </div>
    );
  }

  // Derive real evidence-based skill states (Strong / Developing / Missing)
  const strongSkills =
    gapData?.strongSkills ||
    activeRole?.requiredStack?.filter((s) => s.status === 'met').map((s) => s.name) ||
    [];

  const developingSkills =
    gapData?.developingSkills ||
    activeRole?.requiredStack?.filter((s) => s.status === 'pending').map((s) => s.name) ||
    [];

  const missingSkills =
    gapData?.missingSkills ||
    activeRole?.requiredStack?.filter((s) => s.status === 'gap').map((s) => s.name) ||
    [];

  const hasSkills = strongSkills.length > 0 || developingSkills.length > 0 || missingSkills.length > 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto text-left">
      {/* 1. Header with Role Selector and iNSIGHTS Attribution */}
      <section className="p-6 rounded-2xl bg-white border border-[#E2E8F0] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm card-hover-3d">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#0F172A] border border-[#E2E8F0] font-bold">
              GAP VECTOR ANALYSIS
            </span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-semibold flex items-center gap-1">
              <Compass className="w-3 h-3 text-blue-600" />
              Powered by iNSIGHTS
            </span>
            <span className="text-xs font-mono text-[#64748B]">
              Grounded in verified evidence
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-mono text-[#0F172A]">
            Target Role: {activeRole ? activeRole.title : gapData?.roleTitle || 'Selected Role'}
          </h1>
          <p className="text-xs text-[#475569] max-w-xl">
            {activeRole ? activeRole.description : 'Comparing your current evidence against requirements.'}
          </p>
        </div>

        {targetRoles.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono text-[#64748B]">Change Target:</span>
            <select
              value={activeRoleId || activeRole?.id}
              onChange={(e) => onSelectRole(e.target.value)}
              className="bg-white border border-[#E2E8F0] text-xs font-medium text-[#0F172A] py-2 px-3 rounded-xl cursor-pointer focus:outline-none focus:border-[#111827] shadow-xs"
            >
              {targetRoles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.shortTitle}
                </option>
              ))}
            </select>
          </div>
        )}
      </section>

      {/* 2. "HOW THIS ANALYSIS WORKS" / 4-STAGE INTELLIGENCE FLOW (Requirement 9) */}
      <section className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm card-hover-3d space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-live-pulse" />
            <h2 className="text-sm font-mono font-bold text-[#0F172A] uppercase tracking-wider">
              Career Intelligence Verification Flow
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/60 font-semibold self-start sm:self-auto shadow-2xs">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>Powered by iNSIGHTS</span>
          </div>
        </div>

        {/* 4-Step Intelligence Report Flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
          {/* Stage 1: Target Role Requirements */}
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#2563EB] uppercase">
                Stage 01
              </span>
              <Target className="w-4 h-4 text-[#2563EB]" />
            </div>
            <div className="text-xs font-mono font-bold text-[#0F172A]">
              Role Requirements
            </div>
            <p className="text-[11px] text-[#475569] leading-relaxed">
              External competency standards for {activeRole ? activeRole.shortTitle : 'Target Role'}.
            </p>
          </div>

          {/* Stage 2: Candidate Evidence Matching */}
          <div className="p-4 rounded-xl bg-cyan-50/50 border border-cyan-200/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#0891B2] uppercase">
                Stage 02
              </span>
              <ShieldCheck className="w-4 h-4 text-[#0891B2]" />
            </div>
            <div className="text-xs font-mono font-bold text-[#0F172A]">
              Evidence Matching
            </div>
            <p className="text-[11px] text-[#475569] leading-relaxed">
              Grounded in verified grades, GitHub commits, and hackathon project proofs.
            </p>
          </div>

          {/* Stage 3: Identified Skill Gaps */}
          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-amber-700 uppercase">
                Stage 03
              </span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xs font-mono font-bold text-[#0F172A]">
              Identified Skill Gaps
            </div>
            <p className="text-[11px] text-[#475569] leading-relaxed">
              Calculates missing capabilities ({missingSkills.length} critical gaps identified).
            </p>
          </div>

          {/* Stage 4: Recommended Project Action */}
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase">
                Stage 04
              </span>
              <Zap className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xs font-mono font-bold text-[#0F172A]">
              Recommended Action
            </div>
            <p className="text-[11px] text-[#475569] leading-relaxed">
              Adaptive engineering missions designed specifically to close capability gaps.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Skills Gap Breakdown: Strong / Developing / Missing */}
      {!hasSkills ? (
        <EmptyState
          title="Select a target role to discover your skill gaps."
          description="Compare your current capabilities with the requirements of your target role."
          icon={Target}
          actions={[
            {
              label: 'Explore Roles',
              onClick: () => onNavigate('/roles'),
              variant: 'primary',
              icon: Target
            }
          ]}
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Strong */}
            <div className="p-5 rounded-2xl bg-white border border-emerald-200 space-y-4 shadow-sm card-hover-3d">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-mono font-bold text-[#0F172A]">Strong</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                  {strongSkills.length} Verified
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                Competencies backed by verified course grades, repositories, or awards.
              </p>
              <div className="space-y-2">
                {strongSkills.map((skill, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono text-[#0F172A] flex items-center justify-between"
                  >
                    <span>{skill}</span>
                    <span className="text-[10px] text-emerald-700 font-bold">MET</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Developing */}
            <div className="p-5 rounded-2xl bg-white border border-amber-200 space-y-4 shadow-sm card-hover-3d">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-mono font-bold text-[#0F172A]">Developing</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                  {developingSkills.length} Pending
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                Partial evidence detected; requires practical project validation.
              </p>
              <div className="space-y-2">
                {developingSkills.map((skill, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono text-[#0F172A] flex items-center justify-between"
                  >
                    <span>{skill}</span>
                    <span className="text-[10px] text-amber-700 font-bold">DEVELOPING</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Missing */}
            <div className="p-5 rounded-2xl bg-white border border-rose-200 space-y-4 shadow-sm card-hover-3d">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <h3 className="text-sm font-mono font-bold text-[#0F172A]">Missing</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
                  {missingSkills.length} Gaps
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                Key requirement gaps needed to meet this hiring profile.
              </p>
              <div className="space-y-2">
                {missingSkills.map((skill, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono text-[#0F172A] flex items-center justify-between"
                  >
                    <span>{skill}</span>
                    <span className="text-[10px] text-rose-700 font-bold">GAP</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action: Synthesize Mission to Bridge Gaps */}
          <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 card-hover-3d">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-sm font-mono font-bold text-[#0F172A] flex items-center gap-2 justify-center sm:justify-start">
                <Zap className="w-4 h-4 text-emerald-600" />
                Ready to close your skill gaps?
              </h4>
              <p className="text-xs text-[#475569]">
                Generate an adaptive project mission with step-by-step technical specifications to bridge missing capabilities.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/mission')}
              className="px-5 py-2.5 rounded-xl bg-[#111827] hover:bg-black text-xs font-mono font-semibold text-white shadow-xs transition-all flex items-center gap-2 shrink-0"
            >
              <span>View Project Mission</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GapAnalysisView;
