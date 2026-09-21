import React from 'react';
import { TargetRole, ViewPath, InsightsStatusResponse } from '../../types';
import {
  Target,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Check,
  Sparkles,
  TrendingUp,
  Layers
} from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

interface TargetRolesViewProps {
  targetRoles: TargetRole[];
  activeRoleId?: string;
  insightsStatus?: InsightsStatusResponse | null;
  onSelectRole: (roleId: string) => void;
  onNavigate: (view: ViewPath) => void;
  onOpenMissionModal?: () => void;
}

export const TargetRolesView: React.FC<TargetRolesViewProps> = ({
  targetRoles,
  activeRoleId,
  onSelectRole,
  onNavigate,
  onOpenMissionModal
}) => {
  if (!targetRoles || targetRoles.length === 0) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-left">
        <EmptyState
          title="No target roles available"
          description="Career standards and role competencies will appear here once loaded."
          icon={Target}
        />
      </div>
    );
  }

  const activeRole = targetRoles.find((r) => r.id === activeRoleId) || targetRoles[0];
  const activeStack = activeRole?.requiredStack || [];
  const metCount = activeStack.filter((s) => s.status === 'met').length;
  const totalCount = activeStack.length || 1;
  const percentage = Math.round((metCount / totalCount) * 100);

  return (
    <div className="py-8 px-4 sm:px-8 max-w-6xl mx-auto text-left space-y-8 animate-fade-in">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Career Roles & Job Benchmarks
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Select a role to see how your verified skills match active hiring requirements.
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {targetRoles.map((role) => {
          const isSelected = role.id === activeRole.id;
          const roleStack = role.requiredStack || [];
          const roleMet = roleStack.filter((s) => s.status === 'met').length;
          const rolePct = roleStack.length ? Math.round((roleMet / roleStack.length) * 100) : role.matchPercentage || 75;

          return (
            <div
              key={role.id}
              onClick={() => onSelectRole(role.id)}
              className={`saas-card p-5 cursor-pointer transition-all border ${
                isSelected
                  ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                  Match
                </span>
                <span className={`font-bold ${rolePct >= 80 ? 'text-emerald-600' : 'text-blue-600'}`}>
                  {rolePct}%
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {role.shortTitle}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                {role.title}
              </p>
            </div>
          );
        })}
      </div>

      {/* Active Role Detailed Spotlight */}
      <div className="saas-card p-6 sm:p-8 bg-white border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Active Benchmark
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {metCount} of {totalCount} Skills Matched
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {activeRole.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {activeRole.description}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
              {percentage}%
            </span>
            <span className="block text-xs font-semibold text-emerald-600">
              {percentage >= 80 ? 'High Readiness' : 'Moderate Readiness'}
            </span>
          </div>
        </div>

        {/* Required Skills Breakdown */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-800">
            Required Technical Competencies:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeStack.map((req: any, idx: number) => {
              const skillTitle = req.name || req.skill || `Competency ${idx + 1}`;
              return (
                <div
                  key={req.name || req.skill || idx}
                  className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
                    req.status === 'met'
                      ? 'bg-emerald-50/50 border-emerald-200/80 text-emerald-900'
                      : 'bg-amber-50/50 border-amber-200/80 text-amber-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {req.status === 'met' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    <div>
                      <span className="text-xs font-bold block">{skillTitle}</span>
                      <span className="text-[11px] opacity-75">
                        {req.status === 'met' ? 'Verified in your evidence vault' : 'Recommended gap to close'}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      req.status === 'met'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {req.status === 'met' ? 'Completed' : 'Missing'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            Want to see how to close the remaining gaps?
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/gap-analysis')}
              className="px-4 py-2 text-xs font-semibold saas-btn-secondary"
            >
              View Gap Analysis
            </button>
            {onOpenMissionModal && (
              <button
                onClick={onOpenMissionModal}
                className="px-4 py-2 text-xs font-semibold saas-btn-primary flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Start Practice Mission</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TargetRolesView;
