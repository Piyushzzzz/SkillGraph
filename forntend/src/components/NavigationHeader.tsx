import React, { useState } from 'react';
import { TargetRole, ViewPath, StudentProfile, AppRoute, InsightsStatusResponse } from '../types';
import {
  ShieldCheck,
  ChevronDown,
  Bell,
  CheckCircle2,
  Menu,
  X,
  LayoutDashboard,
  Database,
  Network,
  AlertCircle,
  Rocket,
  Code2,
  UserCheck,
  Home,
  LogOut,
  User,
  Compass
} from 'lucide-react';

interface NavigationHeaderProps {
  currentView: ViewPath;
  onNavigate: (view: ViewPath | AppRoute) => void;
  targetRoles: TargetRole[];
  activeRoleId?: string;
  insightsStatus?: InsightsStatusResponse | null;
  onSelectRole: (roleId: string) => void;
  onOpenLedger: () => void;
  profile?: StudentProfile;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentView,
  onNavigate,
  targetRoles,
  activeRoleId,
  insightsStatus,
  onSelectRole,
  onOpenLedger,
  profile
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeRole = targetRoles.find((r) => r.id === activeRoleId) || targetRoles[0];

  const handleMobileNav = (view: ViewPath | AppRoute) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  const studentName = profile?.fullName || 'Student Account';
  const universityInfo = profile?.university ? `${profile.university}` : 'Affiliation Pending';

  const navLinks: { path: ViewPath; label: string }[] = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/evidence', label: 'Evidence' },
    { path: '/skills', label: 'SkillGraph' },
    { path: '/roles', label: 'Roles' },
    { path: '/gap-analysis', label: 'Gap Analysis' },
    { path: '/mission', label: 'Mission' }
  ];

  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-[#E2E8F0] bg-white/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shadow-xs">
      {/* Brand Logo & Tag */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
          title="Back to Landing Page"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#111827] to-[#1E293B] flex items-center justify-center text-white shadow-xs transition-transform group-hover:scale-105">
            <Network className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-sm sm:text-base font-bold tracking-tight text-[#0F172A]">
                SkillGraph
              </span>
              <span className="text-[9px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200/60 font-semibold">
                ACTIVE
              </span>
            </div>
          </div>
        </button>

        {/* Desktop Primary Nav Bar with soft blue/cyan active pill indicator (Requirement 12) */}
        <nav className="hidden xl:flex items-center gap-1 pl-4 border-l border-[#E2E8F0]">
          {navLinks.map((link) => {
            const isActive = currentView === link.path;
            return (
              <button
                key={link.path}
                onClick={() => onNavigate(link.path)}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-[#2563EB] bg-blue-50/80 border border-blue-200/60 shadow-2xs font-semibold'
                    : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#2563EB] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Center/Right Benchmarks, Status & Action Center */}
      <div className="flex items-center gap-3">
        {/* Target Benchmark Role Selector */}
        {targetRoles && targetRoles.length > 0 && (
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-xs font-mono text-[#64748B]">Target:</span>
            <div className="relative inline-block">
              <select
                value={activeRoleId || activeRole?.id}
                onChange={(e) => onSelectRole(e.target.value)}
                className="appearance-none bg-white border border-[#E2E8F0] hover:border-blue-300 text-xs font-medium text-[#0F172A] py-1.5 pl-2.5 pr-7 rounded-lg cursor-pointer focus:outline-none focus:border-[#2563EB] transition-colors shadow-2xs"
              >
                {targetRoles.map((role) => (
                  <option key={role.id} value={role.id} className="bg-white text-[#0F172A]">
                    {role.shortTitle}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#64748B] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* iNSIGHTS Status Pill */}
            <button
              onClick={() => onNavigate('/integrations')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50/80 hover:bg-blue-100/70 border border-blue-200/60 text-[11px] font-mono font-semibold text-blue-700 transition-colors shadow-2xs"
              title="External iNSIGHTS Career Intelligence Contract Status"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-live-pulse" />
              <span>iNSIGHTS: {insightsStatus?.status || 'Available'}</span>
            </button>
          </div>
        )}

        {/* Ledger Audit Quick Trigger */}
        <button
          onClick={onOpenLedger}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] hover:border-emerald-300 text-xs font-mono text-[#0F172A] transition-colors shadow-2xs btn-interactive"
          title="Open Cryptographic Proof Audit"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Proof Ledger</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-live-pulse" />
        </button>

        {/* Candidate User Pill */}
        <div
          onClick={() => onNavigate('/profile')}
          className="flex items-center gap-2.5 pl-2.5 pr-2 py-1 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] hover:border-blue-200 cursor-pointer transition-colors shadow-2xs btn-interactive"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#111827] to-[#1E293B] text-white flex items-center justify-center font-mono font-bold text-xs shadow-2xs">
            {studentName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-mono font-semibold text-[#0F172A] leading-tight flex items-center gap-1">
              <span>{studentName}</span>
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            </div>
            <div className="text-[10px] text-[#64748B] font-mono leading-tight">
              {universityInfo}
            </div>
          </div>
        </div>

        {/* Log Out Button */}
        <button
          onClick={() => onNavigate('/')}
          className="p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] border border-[#E2E8F0] transition-colors btn-interactive"
          title="Sign Out / Back to Home"
        >
          <LogOut className="w-4 h-4" />
        </button>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden p-2 rounded-xl text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] border border-[#E2E8F0] transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-white border-b border-[#E2E8F0] shadow-xl p-4 z-50 animate-in slide-in-from-top-2">
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono uppercase text-[#64748B] px-3 pb-1">
              Portfolio Views
            </div>
            <button
              onClick={() => handleMobileNav('/dashboard')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono text-[#0F172A] hover:bg-[#F1F5F9]"
            >
              <LayoutDashboard className="w-4 h-4 text-[#111827]" />
              <span>Overview Dashboard</span>
            </button>
            <button
              onClick={() => handleMobileNav('/profile')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono text-[#0F172A] hover:bg-[#F1F5F9]"
            >
              <UserCheck className="w-4 h-4 text-[#111827]" />
              <span>Student Profile & Transcript</span>
            </button>
            <button
              onClick={() => handleMobileNav('/evidence')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono text-[#0F172A] hover:bg-[#F1F5F9]"
            >
              <Database className="w-4 h-4 text-[#111827]" />
              <span>Evidence Vault</span>
            </button>
            <button
              onClick={() => handleMobileNav('/skills')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono text-[#0F172A] hover:bg-[#F1F5F9]"
            >
              <Network className="w-4 h-4 text-[#2563EB]" />
              <span>Interactive SkillGraph</span>
            </button>

            <div className="text-[10px] font-mono uppercase text-[#64748B] px-3 pt-3 pb-1">
              Targeting
            </div>
            <button
              onClick={() => handleMobileNav('/roles')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono text-[#0F172A] hover:bg-[#F1F5F9]"
            >
              <AlertCircle className="w-4 h-4 text-[#D97706]" />
              <span>Target Roles Matrix</span>
            </button>
            <button
              onClick={() => handleMobileNav('/gap-analysis')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono text-[#0F172A] hover:bg-[#F1F5F9]"
            >
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Gap Analysis Vector</span>
            </button>
            <button
              onClick={() => handleMobileNav('/mission')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono text-[#0F172A] hover:bg-[#F1F5F9]"
            >
              <Rocket className="w-4 h-4 text-emerald-600" />
              <span>Adaptive Project Mission</span>
            </button>
            <button
              onClick={() => handleMobileNav('/architecture')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono text-[#0F172A] hover:bg-[#F1F5F9]"
            >
              <Code2 className="w-4 h-4 text-[#64748B]" />
              <span>Architecture Documentation</span>
            </button>

            <div className="pt-2 border-t border-[#E2E8F0] flex gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLedger();
                }}
                className="flex-1 py-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono text-[#0F172A] flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Audit Ledger</span>
              </button>
              <button
                onClick={() => handleMobileNav('/')}
                className="flex-1 py-2 rounded-lg bg-[#111827] text-white text-xs font-mono flex items-center justify-center gap-1.5"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavigationHeader;
