import React, { useState, useRef, useEffect } from 'react';
import { TargetRole, ViewPath, StudentProfile, AppRoute, InsightsStatusResponse } from '../types';
import {
  Menu,
  X,
  Network,
  Plus,
  ChevronDown,
  User,
  LogIn,
  UserPlus,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  Check,
  Target
} from 'lucide-react';

interface NavigationHeaderProps {
  currentView: ViewPath;
  onNavigate: (view: ViewPath | AppRoute) => void;
  targetRoles: TargetRole[];
  activeRoleId?: string;
  insightsStatus?: InsightsStatusResponse | null;
  onSelectRole: (roleId: string) => void;
  onOpenLedger: () => void;
  onOpenAddProject?: () => void;
  profile?: StudentProfile;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentView,
  onNavigate,
  targetRoles,
  activeRoleId,
  onSelectRole,
  onOpenLedger,
  onOpenAddProject,
  profile
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const roleMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const activeRole = targetRoles.find((r) => r.id === activeRoleId) || targetRoles[0];
  const studentName = profile?.fullName || 'Alex Chen';

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(event.target as Node)) {
        setRoleDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMobileNav = (view: ViewPath | AppRoute) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  // Sleek, concise single-line nav links
  const navLinks: { path: ViewPath; label: string }[] = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/skills', label: 'Skill Graph' },
    { path: '/evidence', label: 'Projects' },
    { path: '/roles', label: 'Career Roles' },
    { path: '/gap-analysis', label: 'Gap Analysis' },
    { path: '/mission', label: 'Missions' },
    { path: '/integrations', label: 'iNSIGHTS' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] transition-all">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* 1. Brand Logo */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
            title="SkillGraph Home"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/25 transition-transform duration-200 group-hover:scale-105">
              <Network className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors font-sans">
                SkillGraph
              </span>
            </div>
          </button>

          {/* 2. Sleek Apple-Style Text Navigation Bar (Visible on tablets, laptops, and desktops) */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = currentView === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => onNavigate(link.path)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-bold border border-blue-200/60 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* 3. Right Utility Center */}
        <div className="flex items-center gap-2.5">
          {/* iNSIGHTS Live Status Badge */}
          <button
            onClick={() => onNavigate('/integrations')}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 shadow-2xs hover:border-blue-300 transition-all cursor-pointer whitespace-nowrap"
            title="iNSIGHTS Intelligence Subsystem"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-500 font-normal">iNSIGHTS:</span>
            <span className="text-emerald-700 font-bold">{insightsStatus?.status || 'Active'}</span>
          </button>

          {/* Target Role Selector Pill */}
          {targetRoles && targetRoles.length > 0 && (
            <div className="relative hidden md:block" ref={roleMenuRef}>
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 shadow-2xs hover:border-slate-300 transition-all cursor-pointer whitespace-nowrap"
                title="Select Target Career Role"
              >
                <Target className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-slate-500 font-normal">Role:</span>
                <span className="font-semibold text-slate-900 max-w-[130px] truncate">
                  {activeRole ? activeRole.shortTitle : 'Target'}
                </span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${roleDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Role Dropdown Menu */}
              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Target Career Roles
                    </span>
                    <span
                      className="text-[10px] text-blue-600 font-semibold cursor-pointer hover:underline"
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        onNavigate('/roles');
                      }}
                    >
                      View All
                    </span>
                  </div>

                  <div className="py-1 max-h-64 overflow-y-auto">
                    {targetRoles.map((role) => {
                      const isSelected = role.id === (activeRoleId || activeRole?.id);
                      const stack = role.requiredStack || [];
                      const met = stack.filter((s) => s.status === 'met').length;
                      const pct = stack.length ? Math.round((met / stack.length) * 100) : role.matchPercentage || 75;

                      return (
                        <button
                          key={role.id}
                          onClick={() => {
                            onSelectRole(role.id);
                            setRoleDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between transition-colors ${
                            isSelected ? 'bg-blue-50/80 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="space-y-0.5 pr-2 truncate">
                            <div className="flex items-center gap-1.5">
                              <span className="truncate">{role.shortTitle}</span>
                              {isSelected && <Check className="w-3 h-3 text-blue-600 shrink-0" />}
                            </div>
                            <p className="text-[10px] text-slate-400 line-clamp-1 font-normal">{role.title}</p>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            pct >= 80 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {pct}%
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Clean Add Project Button */}
          {onOpenAddProject && (
            <button
              onClick={onOpenAddProject}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-black active:scale-95 rounded-full shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Project</span>
            </button>
          )}

          {/* User Profile Pill */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer transition-all shadow-2xs hover:border-slate-300"
              title="User Menu"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-[11px] shadow-xs">
                {studentName.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-slate-800 font-semibold hidden sm:inline max-w-[90px] truncate">
                {studentName}
              </span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* User Dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                  <p className="text-xs font-bold text-slate-900 truncate">{studentName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{profile?.email || 'alex@stanford.edu'}</p>
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Verified Academic Student</span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onNavigate('/profile');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 font-medium flex items-center gap-2.5 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Profile & Coursework</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onOpenLedger();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 font-medium flex items-center gap-2.5 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Verified Credentials</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onNavigate('/login');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 font-medium flex items-center gap-2.5 transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5 text-slate-400" />
                    <span>Switch Account</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onNavigate('/signup');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 font-medium flex items-center gap-2.5 transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-slate-400" />
                    <span>Create Account</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onNavigate('/');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-2.5 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-white border-b border-slate-200 p-4 space-y-3 z-50 animate-in fade-in slide-in-from-top-2 shadow-2xl">
          {targetRoles && targetRoles.length > 0 && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Target Career Role
              </span>
              <select
                value={activeRoleId || activeRole?.id}
                onChange={(e) => {
                  onSelectRole(e.target.value);
                  setMobileMenuOpen(false);
                }}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
              >
                {targetRoles.map((role) => (
                  <option key={role.id} value={role.id}>
                    Target: {role.shortTitle}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = currentView === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleMobileNav(link.path)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex gap-2">
            {onOpenAddProject && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAddProject();
                }}
                className="flex-1 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs shadow-xs"
              >
                + Add Project
              </button>
            )}
            <button
              onClick={() => handleMobileNav('/profile')}
              className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs"
            >
              Profile
            </button>
            <button
              onClick={() => handleMobileNav('/')}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold"
            >
              Home
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavigationHeader;
