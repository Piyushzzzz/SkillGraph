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
      label: 'Overview',
      icon: LayoutDashboard
    },
    {
      path: '/profile',
      legacyId: 'student-profile-and-cgpa',
      label: 'Profile & Academics',
      icon: UserCheck
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
      label: 'Interactive Graph',
      icon: Network
    }
  ];

  const targetItems = [
    {
      path: '/roles',
      legacyId: 'target-roles',
      label: 'Role Matrices',
      icon: Target
    },
    {
      path: '/gap-analysis',
      legacyId: 'gap-analysis',
      label: 'Gap Analysis',
      icon: AlertCircle
    },
    {
      path: '/mission',
      legacyId: 'project-mission',
      label: 'Target Missions',
      icon: Rocket
    },
    {
      path: '/integrations',
      legacyId: 'github-integrations',
      label: 'GitHub Sync',
      icon: GitBranch
    }
  ];

  return (
    <aside className="w-60 bg-black border-r border-white/[0.08] flex flex-col justify-between hidden md:flex h-[calc(100vh-3.5rem)] p-4 select-none text-left">
      <div className="space-y-6 overflow-y-auto">
        {/* Core Navigation */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-medium text-[#86868b] uppercase tracking-wider mb-2">
            Portfolio
          </p>
          {mainItems.map((item) => {
            const active = isViewActive(item.path, item.legacyId);
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path as AppRoute)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? 'bg-white/[0.12] text-white'
                    : 'text-[#86868b] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${active ? 'text-[#2997ff]' : 'text-[#86868b]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.08] text-[#86868b]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Deposit */}
        <div className="space-y-1 pt-4 border-t border-white/[0.08]">
          <p className="px-3 text-[11px] font-medium text-[#86868b] uppercase tracking-wider mb-2">
            Add Records
          </p>
          <button
            onClick={onOpenAddProject}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#86868b] hover:text-white hover:bg-white/[0.04] transition-all"
          >
            <FolderPlus className="w-4 h-4 text-[#2997ff]" />
            <span>Add Project</span>
          </button>
          <button
            onClick={onOpenAddHackathon}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#86868b] hover:text-white hover:bg-white/[0.04] transition-all"
          >
            <Trophy className="w-4 h-4 text-[#ff9f0a]" />
            <span>Add Hackathon</span>
          </button>
        </div>

        {/* Roles & Analysis */}
        <div className="space-y-1 pt-4 border-t border-white/[0.08]">
          <p className="px-3 text-[11px] font-medium text-[#86868b] uppercase tracking-wider mb-2">
            Career
          </p>
          {targetItems.map((item) => {
            const active = isViewActive(item.path, item.legacyId);
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path as AppRoute)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? 'bg-white/[0.12] text-white'
                    : 'text-[#86868b] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${active ? 'text-[#2997ff]' : 'text-[#86868b]'}`} />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Architecture */}
        <div className="pt-4 border-t border-white/[0.08]">
          <button
            onClick={() => onNavigate('/architecture')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              isViewActive('/architecture', 'project-code-and-architecture')
                ? 'bg-white/[0.12] text-white'
                : 'text-[#86868b] hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Code2 className="w-4 h-4 text-[#86868b]" />
            <span>Documentation</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-white/[0.08]">
        <button
          onClick={() => onNavigate('/')}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-xs font-medium text-[#86868b] hover:text-white transition-all"
        >
          <Home className="w-3.5 h-3.5" />
          <span>SkillGraph Website</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
