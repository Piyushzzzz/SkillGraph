import React from 'react';
import { TargetRole, ViewPath } from '../../types';
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Target
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
  onOpenMissionModal
}) => {
  const activeRole = targetRoles.find((r) => r.id === activeRoleId) || targetRoles[0];

  if (!activeRole) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-left">
        <EmptyState
          title="Select a target role"
          description="Compare your current capabilities with the requirements of your target role."
          icon={Target}
        />
      </div>
    );
  }

  const stack = activeRole.requiredStack || [];
  const strongSkills = stack.filter((s) => s.status === 'met');
  const missingSkills = stack.filter((s) => s.status !== 'met');
  const matchPct = stack.length ? Math.round((strongSkills.length / stack.length) * 100) : activeRole.matchPercentage || 70;

  return (
    <div className="py-8 px-4 sm:px-8 max-w-6xl mx-auto text-left space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Skills Gap Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            See which skills you already have and what you need to become 100% job-ready.
          </p>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Role:</span>
          <select
            value={activeRole.id}
            onChange={(e) => onSelectRole(e.target.value)}
            className="appearance-none bg-white border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-800 py-1.5 pl-3 pr-7 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-xs"
          >
            {targetRoles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.shortTitle || r.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview Match Banner */}
      <div className="saas-card p-6 sm:p-7 bg-white border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Target: {activeRole.title}
          </span>
          <h2 className="text-2xl font-bold text-slate-900">
            You are {matchPct}% ready for this role
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            You have satisfied {strongSkills.length} of {stack.length} requirements. You only need {missingSkills.length} more skill{missingSkills.length === 1 ? '' : 's'} to reach full readiness.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/mission')}
          className="px-5 py-2.5 text-xs font-semibold saas-btn-primary shrink-0 flex items-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Close Gaps with a Mission</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Two Clear Columns: What You Have vs What You Need */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Column 1: Skills You Have */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Skills You Have ({strongSkills.length})</span>
            </h3>
            <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Verified
            </span>
          </div>

          <div className="space-y-3">
            {strongSkills.map((s: any, idx: number) => {
              const skillTitle = s.name || s.skill || `Skill ${idx + 1}`;
              return (
                <div
                  key={s.name || s.skill || idx}
                  className="saas-card p-4 bg-white border border-slate-200 flex items-start justify-between gap-3"
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{skillTitle}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Demonstrated in your repositories and verified coursework.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                    MET
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: Missing Skills */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Skills You Need ({missingSkills.length})</span>
            </h3>
            <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Pending
            </span>
          </div>

          <div className="space-y-3">
            {missingSkills.map((s: any, idx: number) => {
              const skillTitle = s.name || s.skill || `Skill ${idx + 1}`;
              return (
                <div
                  key={s.name || s.skill || idx}
                  className="saas-card p-4 bg-amber-50/40 border border-amber-200/80 space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-amber-950">{skillTitle}</h4>
                      <p className="text-xs text-amber-800/80 mt-0.5">
                        Required for technical screening in this role.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md shrink-0">
                      MISSING
                    </span>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-amber-800/70 font-medium">Recommended: 3-day coding mission</span>
                    <button
                      onClick={() => onNavigate('/mission')}
                      className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <span>Start Project</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GapAnalysisView;
