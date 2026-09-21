import React from 'react';
import { TargetRole, ViewPath, InsightsStatusResponse } from '../../types';
import {
  Target,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Zap,
  Check,
  Compass,
  Cpu
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
  insightsStatus,
  onSelectRole,
  onNavigate,
  onOpenMissionModal
}) => {
  if (!targetRoles || targetRoles.length === 0) {
    return (
      <div className="p-6 sm:p-12 max-w-4xl mx-auto text-left">
        <EmptyState
          title="No target roles available."
          description="Industry hiring standards and role competencies will appear here once loaded from the backend."
          icon={Target}
        />
      </div>
    );
  }

  const activeRole = targetRoles.find((r) => r.id === activeRoleId) || targetRoles[0];
  const activeMetCount = activeRole.requiredStack.filter((s) => s.status === 'met').length;
  const activeTotalCount = activeRole.requiredStack.length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto text-left">
      {/* 1. Page Header */}
      <section className="p-6 rounded-2xl bg-white border border-[#E2E8F0] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm card-hover-3d">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#0F172A] border border-[#E2E8F0] font-bold">
              HIRING STANDARDS
            </span>
            <span className="text-xs font-mono text-[#64748B]">
              {targetRoles.length} Evaluated Roles
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-mono text-[#0F172A]">
            Target Role Competency Matrix
          </h1>
          <p className="text-xs text-[#475569]">
            Benchmark candidate evidence density against industry hiring standards enriched by external career intelligence.
          </p>
        </div>
      </section>

      {/* 2. ACTIVE SELECTED TARGET ROLE INTELLIGENCE SPOTLIGHT (Requirement 2) */}
      <section className="p-6 sm:p-7 rounded-2xl bg-white border-2 border-[#0F172A] shadow-md space-y-6 card-hover-3d">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono">
              <span className="text-[11px] font-bold tracking-wider text-[#64748B] uppercase">
                TARGET ROLE
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Active Benchmark
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-[#0F172A]">
              {activeRole.shortTitle || activeRole.title}
            </h2>

            {/* iNSIGHTS Intelligence Attribution */}
            <div className="flex items-center gap-2.5 flex-wrap pt-1">
              <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[#F1F5F9] text-[#0F172A] border border-[#E2E8F0] font-semibold">
                Role intelligence
              </span>
              <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-semibold flex items-center gap-1.5 shadow-2xs">
                <Compass className="w-3.5 h-3.5 text-blue-600" />
                Powered by iNSIGHTS
              </span>
              <span className="text-[11px] font-mono text-[#64748B] hidden sm:inline">
                Contract: GET /api/insights/status ({insightsStatus?.status || 'Available'})
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-right min-w-[150px]">
              <div className="text-xl font-mono font-bold text-[#0F172A]">
                {activeMetCount} / {activeTotalCount}
              </div>
              <div className="text-[11px] font-mono text-[#64748B]">Capabilities Met</div>
            </div>

            <button
              onClick={() => onNavigate('/gap-analysis')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#111827] hover:bg-black text-xs font-mono font-semibold text-white shadow-xs transition-all"
            >
              <span>Compute Gap Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Required Capabilities Display (Real capabilities returned by backend) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Required capabilities:</span>
            </div>
            <span className="text-[11px] font-mono text-[#64748B]">
              Only displaying capabilities returned by backend
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {activeRole.requiredStack.map((capability, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-3 text-xs font-mono transition-colors hover:bg-slate-100/70"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0F172A] shrink-0" />
                  <span className="font-semibold text-[#0F172A] truncate">
                    {capability.name}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-semibold shrink-0 ${
                    capability.status === 'met'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : capability.status === 'pending'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {capability.status === 'met'
                    ? 'Verified Met'
                    : capability.status === 'pending'
                    ? 'In Progress'
                    : 'Skill Gap'}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 text-[11px] font-mono text-[#64748B] flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>
              Target role benchmarks enriched via iNSIGHTS industry intelligence contract. No simulated job market statistics.
            </span>
          </div>
        </div>
      </section>

      {/* 3. ALL TARGET ROLES LIST */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold font-mono text-[#0F172A]">
            Available Industry Target Roles
          </h3>
          <span className="text-xs font-mono text-[#64748B]">
            Select a role to inspect required capabilities
          </span>
        </div>

        <div className="space-y-4">
          {targetRoles.map((role) => {
            const isActive = role.id === activeRoleId;
            const metCount = role.requiredStack.filter((s) => s.status === 'met').length;
            const totalCount = role.requiredStack.length;
            const matchPercentage = totalCount > 0 ? Math.round((metCount / totalCount) * 100) : 0;

            return (
              <div
                key={role.id}
                className={`p-6 rounded-2xl border transition-all card-hover-3d ${
                  isActive
                    ? 'bg-white border-2 border-blue-500 shadow-glow-blue ring-4 ring-blue-50/60'
                    : 'bg-white border-[#E2E8F0] hover:border-blue-200 shadow-xs'
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-bold font-mono text-[#0F172A]">
                        {role.title}
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]">
                        {role.roleMatrixId}
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60 font-semibold flex items-center gap-1.5 shadow-2xs">
                        <Compass className="w-3 h-3 text-blue-600" />
                        <span>iNSIGHTS: {insightsStatus?.status || 'Available'}</span>
                      </span>
                      {isActive && (
                        <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200/60 font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-live-pulse" />
                          ACTIVE TARGET
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#475569]">{role.description}</p>
                  </div>

                  <div className="flex items-center gap-4 w-full lg:w-auto">
                    {/* Readiness / Match Indicator */}
                    <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center min-w-[140px]">
                      <div className="flex items-baseline justify-center gap-1.5">
                        <span className="text-lg font-mono font-bold text-[#0F172A]">
                          {matchPercentage}%
                        </span>
                        <span className="text-[10px] font-mono text-[#64748B]">Readiness</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1.5">
                        <div
                          className="bg-[#2563EB] h-full rounded-full transition-all duration-500"
                          style={{ width: `${matchPercentage}%` }}
                        />
                      </div>
                      <div className="text-[10px] font-mono text-[#64748B] mt-1">
                        {metCount}/{totalCount} Capabilities Met
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => onSelectRole(role.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all btn-interactive ${
                          isActive
                            ? 'bg-[#2563EB] text-white shadow-xs hover:bg-blue-700'
                            : 'bg-white text-[#0F172A] hover:bg-[#F8FAFC] border border-[#E2E8F0] hover:border-blue-300'
                        }`}
                      >
                        {isActive ? 'Active Target' : 'Set as Target'}
                      </button>
                      <button
                        onClick={() => {
                          onSelectRole(role.id);
                          onNavigate('/gap-analysis');
                        }}
                        className="px-4 py-1.5 rounded-xl bg-transparent hover:bg-blue-50 text-xs font-mono text-[#2563EB] flex items-center justify-center gap-1 font-semibold transition-colors"
                      >
                        <span>Analyze Vector</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stack Requirements Pills */}
                <div className="pt-4 space-y-2">
                  <div className="text-[11px] font-mono uppercase text-[#64748B]">
                    Required Capability Stack:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {role.requiredStack.map((stk, idx) => (
                      <span
                        key={idx}
                        className={`text-xs font-mono px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                          stk.status === 'met'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : stk.status === 'pending'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        {stk.status === 'met' && <Check className="w-3 h-3 text-emerald-600" />}
                        {stk.status === 'pending' && <Zap className="w-3 h-3 text-amber-600" />}
                        {stk.status === 'gap' && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                        <span>{stk.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default TargetRolesView;
