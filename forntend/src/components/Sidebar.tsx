import React from 'react';
import { ViewPath, AppRoute } from '../types';
import {
  LayoutDashboard,
  UserCheck,
  Database,
  FolderPlus,
  Trophy,
  Network,
  Target,
  AlertCircle,
  Rocket,
  GitBranch,
  Code2,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Home
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewPath | AppRoute;
  onNavigate: (view: ViewPath | AppRoute) => void;
  onOpenAddProject: () => void;
  onOpenAddHackathon: () => void;
  evidenceCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  onOpenAddProject,
  onOpenAddHackathon,
  evidenceCount
}) => {
  const isViewActive = (path: string, legacyId?: string) => {
    return currentView === path || (legacyId && currentView === legacyId);
  };

  const mainItems = [
    {
      path: '/dashboard',
      legacyId: 'overview-dashboard',
      label: 'Overview Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      path: '/profile',
      legacyId: 'student-profile-and-cgpa',
      label: 'Student Profile & CGPA',
      icon: UserCheck,
      badge: null
    },
    {
      path: '/evidence',
      legacyId: 'evidence-vault',
      label: 'Evidence Vault',
      icon: Database,
      badge: `${evidenceCount}`
    },
    {
      path: '/skills',
      legacyId: 'interactive-skillgraph',
      label: 'Interactive SkillGraph',
      icon: Network,
      badge: 'Live'
    }
  ];

  const targetItems = [
    {
      path: '/roles',
      legacyId: 'target-roles',
      label: 'Target Roles Matrix',
      icon: Target,
      badge: null
    },
    {
      path: '/gap-analysis',
      legacyId: 'gap-analysis',
      label: 'Gap Analysis Vector',
      icon: AlertCircle,
      badge: null
    },
    {
      path: '/mission',
      legacyId: 'project-mission',
      label: 'Project Mission',
      icon: Rocket,
      badge: null
    },
    {
      path: '/integrations',
      legacyId: 'github-integrations',
      label: 'GitHub & CI Telemetry',
      icon: GitBranch,
      badge: null
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col justify-between hidden md:flex h-[calc(100vh-4rem)] p-4 select-none text-left">
      <div className="space-y-6 overflow-y-auto">
        {/* Section 1: Core Navigation */}
        <div className="space-y-1">
          <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-[#64748B] mb-2 font-bold">
            Core Portfolio
          </div>
          {mainItems.map((item) => {
            const active = isViewActive(item.path, item.legacyId);
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path as AppRoute)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                  active
                    ? 'bg-[#F1F5F9] text-[#0F172A] font-semibold border border-[#E2E8F0] shadow-xs'
                    : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      active ? 'text-[#0F172A]' : 'text-[#64748B]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white text-[#0F172A] border border-[#E2E8F0] font-semibold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Section 2: Quick Evidence Deposit */}
        <div className="space-y-1.5 pt-2 border-t border-[#E2E8F0]">
          <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-[#64748B] mb-2 font-bold">
            Deposit Evidence
          </div>
          <button
            onClick={onOpenAddProject}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono text-[#0F172A] bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <FolderPlus className="w-4 h-4 text-[#2563EB]" />
              <span className="font-medium">+ Add Project</span>
            </div>
            <span className="text-[10px] font-mono text-[#64748B]">Artifact</span>
          </button>
          <button
            onClick={onOpenAddHackathon}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono text-[#0F172A] bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <Trophy className="w-4 h-4 text-[#D97706]" />
              <span className="font-medium">+ Add Hackathon</span>
            </div>
            <span className="text-[10px] font-mono text-[#64748B]">Award</span>
          </button>
        </div>

        {/* Section 3: Target Role Analysis */}
        <div className="space-y-1 pt-2 border-t border-[#E2E8F0]">
          <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-[#64748B] mb-2 font-bold">
            Capability Targeting
          </div>
          {targetItems.map((item) => {
            const active = isViewActive(item.path, item.legacyId);
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path as AppRoute)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                  active
                    ? 'bg-[#F1F5F9] text-[#0F172A] font-semibold border border-[#E2E8F0] shadow-xs'
                    : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      active ? 'text-[#0F172A]' : 'text-[#64748B]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white text-[#0F172A] border border-[#E2E8F0] font-semibold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Section 4: Architecture Documentation */}
        <div className="space-y-1 pt-2 border-t border-[#E2E8F0]">
          <button
            onClick={() => onNavigate('/architecture')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono transition-all ${
              isViewActive('/architecture', 'project-code-and-architecture')
                ? 'bg-[#F1F5F9] text-[#0F172A] font-semibold border border-[#E2E8F0]'
                : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
            }`}
          >
            <Code2 className="w-4 h-4 text-[#64748B]" />
            <span>Architecture Docs</span>
          </button>
        </div>
      </div>

      {/* Footer Info: Merkle & Ledger Status */}
      <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
        <button
          onClick={() => onNavigate('/')}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-mono text-[#475569] hover:text-[#0F172A] transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>SkillGraph Home</span>
        </button>

        <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-emerald-700 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Veritas Node Active</span>
          </div>
          <div className="text-[10px] font-mono text-[#64748B]">
            Ledger Proof Engine v2.4
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
