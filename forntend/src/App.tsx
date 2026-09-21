import React, { useState, useEffect, useCallback } from 'react';
import {
  AppRoute,
  ViewPath,
  StudentProfile,
  EvidenceItem,
  TargetRole,
  SkillNodeData,
  ProjectMission,
  InsightsStatusResponse
} from './types';
import { api } from './lib/api';
import {
  initialProfile,
  initialEvidence,
  initialSkillNodes,
  targetRolesList,
  sampleMission
} from './data/mockData';

// Landing & Auth
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';

// Common feedback states
import { LoadingState } from './components/common/LoadingState';
import { ErrorState } from './components/common/ErrorState';

// Layout & Views
import { NavigationHeader } from './components/NavigationHeader';
import { Sidebar } from './components/Sidebar';
import { OverviewDashboard } from './components/views/OverviewDashboard';
import { StudentProfileView } from './components/views/StudentProfileView';
import { EvidenceVault } from './components/views/EvidenceVault';
import { InteractiveSkillGraph } from './components/views/InteractiveSkillGraph';
import { TargetRolesView } from './components/views/TargetRolesView';
import { GapAnalysisView } from './components/views/GapAnalysisView';
import { ProjectMissionView } from './components/views/ProjectMissionView';
import { GitHubIntegrationsView } from './components/views/GitHubIntegrationsView';
import { ArchitectureDocsView } from './components/views/ArchitectureDocsView';

// Modals
import { ProofAuditModal } from './components/modals/ProofAuditModal';
import { MissionSynthesizerModal } from './components/modals/MissionSynthesizerModal';
import { AddProjectModal } from './components/modals/AddProjectModal';
import { AddHackathonModal } from './components/modals/AddHackathonModal';
import { Toast, ToastMessage } from './components/Toast';

export function App() {
  // 1. Route state management (defaults to landing page '/' at root)
  const getInitialRoute = (): AppRoute => {
    const path = window.location.pathname;
    const validRoutes: AppRoute[] = [
      '/',
      '/login',
      '/signup',
      '/dashboard',
      '/evidence',
      '/skills',
      '/gap-analysis',
      '/roles',
      '/mission',
      '/profile',
      '/integrations',
      '/architecture'
    ];
    if (validRoutes.includes(path as AppRoute)) {
      return path as AppRoute;
    }
    // Also support legacy view paths if user typed them
    if (path.includes('dashboard')) return '/dashboard';
    if (path.includes('evidence')) return '/evidence';
    if (path.includes('skill')) return '/skills';
    if (path.includes('gap')) return '/gap-analysis';
    if (path.includes('role')) return '/roles';
    if (path.includes('mission')) return '/mission';
    if (path.includes('profile')) return '/profile';

    return '/';
  };

  const [currentRoute, setCurrentRoute] = useState<AppRoute>(getInitialRoute);

  // Sync route with browser history
  const navigateTo = useCallback((route: AppRoute | ViewPath) => {
    // Map legacy ViewPath string to AppRoute if needed
    const routeMap: Record<string, AppRoute> = {
      'overview-dashboard': '/dashboard',
      'student-profile-and-cgpa': '/profile',
      'evidence-vault': '/evidence',
      'interactive-skillgraph': '/skills',
      'target-roles': '/roles',
      'gap-analysis': '/gap-analysis',
      'project-mission': '/mission',
      'github-integrations': '/integrations',
      'project-code-and-architecture': '/architecture'
    };

    const targetRoute = routeMap[route] || (route as AppRoute);
    setCurrentRoute(targetRoute);
    try {
      window.history.pushState({}, '', targetRoute);
    } catch {
      // Safe fallback if history API is restricted in sandbox
    }
  }, []);

  // Listen to popstate for back/forward browser buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getInitialRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 2. Real Backend Data State
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([]);
  const [skillNodes, setSkillNodes] = useState<SkillNodeData[]>([]);
  const [targetRoles, setTargetRoles] = useState<TargetRole[]>([]);
  const [activeRoleId, setActiveRoleId] = useState<string>('software-developer');
  const [mission, setMission] = useState<ProjectMission | null>(null);

  // iNSIGHTS Integration State
  const [insightsStatus, setInsightsStatus] = useState<InsightsStatusResponse | null>(null);
  const [isInsightsLoading, setIsInsightsLoading] = useState<boolean>(false);

  // Loading & Error States
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // 3. Modals state
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isAddHackathonOpen, setIsAddHackathonOpen] = useState(false);

  // 4. Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const newToast: ToastMessage = {
      id: `${Date.now()}-${Math.random()}`,
      title,
      message,
      type
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Refresh iNSIGHTS status explicitly
  const refreshInsights = useCallback(async () => {
    setIsInsightsLoading(true);
    try {
      const res = await api.getInsightsStatus();
      if (res?.data) {
        setInsightsStatus(res.data);
      } else if (res?.error) {
        setInsightsStatus({ status: 'Error', message: res.error });
      } else {
        setInsightsStatus({ status: 'Available', service: 'iNSIGHTS' });
      }
    } catch {
      setInsightsStatus({ status: 'Error', message: 'Failed to contact iNSIGHTS status endpoint' });
    } finally {
      setIsInsightsLoading(false);
    }
  }, []);

  // 5. Fetch Real Backend Data
  const loadBackendData = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      // Fetch in parallel using the centralized api client
      const [fetchedProfile, fetchedEvidence, fetchedSkills, fetchedRoles, fetchedInsights] = await Promise.all([
        api.getStudentProfile().catch(() => null),
        api.getEvidence().catch(() => null),
        api.getSkillsGraph().catch(() => null),
        api.getTargetRoles().catch(() => null),
        api.getInsightsStatus().catch(() => null)
      ]);

      const currentUserId = api.getActiveUserId();
      const isDemoUser = String(currentUserId) === '1' || fetchedProfile?.email === 'alex.mercer@university.edu';

      setProfile(fetchedProfile || (isDemoUser ? initialProfile : null));
      if (isDemoUser) {
        setEvidenceItems(fetchedEvidence && fetchedEvidence.length > 0 ? fetchedEvidence : initialEvidence);
        setSkillNodes(fetchedSkills?.nodes && fetchedSkills.nodes.length > 0 ? fetchedSkills.nodes : initialSkillNodes);
      } else {
        setEvidenceItems(Array.isArray(fetchedEvidence) ? fetchedEvidence : []);
        setSkillNodes(fetchedSkills?.nodes && fetchedSkills.nodes.length > 0 ? fetchedSkills.nodes : []);
      }
      
      const roles = fetchedRoles && fetchedRoles.length > 0 ? fetchedRoles : targetRolesList;
      setTargetRoles(roles);

      if (roles.length > 0) {
        setActiveRoleId((prev) => (roles.some((r) => r.id === prev) ? prev : roles[0].id));
      }

      setMission(sampleMission);

      if (fetchedInsights?.data) {
        setInsightsStatus(fetchedInsights.data);
      } else if (fetchedInsights?.error) {
        setInsightsStatus({ status: 'Error', message: fetchedInsights.error });
      } else {
        setInsightsStatus({ status: 'Available', service: 'iNSIGHTS' });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to communicate with SkillGraph API.';
      setLoadError(msg);
      // Fallbacks to keep application responsive
      setProfile(initialProfile);
      setEvidenceItems(initialEvidence);
      setSkillNodes(initialSkillNodes);
      setTargetRoles(targetRolesList);
      setMission(sampleMission);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBackendData();
  }, [loadBackendData]);

  // Auth Handlers
  const handleLoginSuccess = async (email: string) => {
    if (email === 'alex.mercer@university.edu' || email === 'alex@stanford.edu') {
      api.setActiveUserId(1);
    }
    await loadBackendData();
    showToast('Signed In', `Welcome back, ${email}`, 'success');
  };

  const handleSignupSuccess = async (newProfile: Partial<StudentProfile>) => {
    try {
      const res = await api.createStudentProfile({
        name: newProfile.fullName || 'Student Candidate',
        email: newProfile.email || `student_${Date.now()}@university.edu`,
        university: newProfile.university,
        degree: newProfile.degree,
        branch: newProfile.major,
        cgpa: newProfile.cgpa
      });
      if (res?.data?.id) {
        api.setActiveUserId(res.data.id);
      }
    } catch (e) {
      console.warn('Backend signup error:', e);
    }
    await loadBackendData();
    showToast('Account Created', 'Welcome to SkillGraph! Complete your profile to build your graph.', 'success');
  };

  const handleAddEvidence = async (item: EvidenceItem) => {
    setEvidenceItems((prev) => [item, ...prev]);
    try {
      await api.createEvidence(item);
      const updatedSkills = await api.getSkillsGraph();
      if (updatedSkills?.nodes) {
        setSkillNodes(updatedSkills.nodes);
      }
    } catch (e) {
      console.warn('Failed to persist evidence to backend:', e);
    }
    showToast('Evidence Recorded', `Deposited "${item.title}" into evidence vault.`, 'success');
  };

  const handleDeleteEvidence = async (id: string) => {
    setEvidenceItems((prev) => prev.filter((item) => item.id !== id));
    try {
      await api.deleteEvidence(id);
      const updatedSkills = await api.getSkillsGraph();
      if (updatedSkills?.nodes) {
        setSkillNodes(updatedSkills.nodes);
      }
    } catch (e) {
      console.warn('Failed to delete evidence on backend:', e);
    }
    showToast('Evidence Removed', 'Record removed from ledger.', 'info');
  };

  const handleUpdateProfile = async (updated: Partial<StudentProfile>) => {
    setProfile((prev) => ({
      ...(prev || { id: 'usr_me', fullName: 'Student Candidate', email: '' }),
      ...updated
    }));
    try {
      await api.updateProfile(updated);
    } catch (e) {
      console.warn('Failed to update profile on backend:', e);
    }
    showToast('Profile Saved', 'Profile information updated successfully.', 'success');
  };

  // Render Route 1: Landing Page (Root '/')
  if (currentRoute === '/') {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans selection:bg-blue-100 selection:text-blue-900">
        <LandingPage onNavigate={navigateTo} />
        <Toast toasts={toasts} onDismiss={handleDismissToast} />
      </div>
    );
  }

  // Render Route 2: Login Page ('/login')
  if (currentRoute === '/login') {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans selection:bg-blue-100 selection:text-blue-900">
        <LoginPage onNavigate={navigateTo} onLoginSuccess={handleLoginSuccess} />
        <Toast toasts={toasts} onDismiss={handleDismissToast} />
      </div>
    );
  }

  // Render Route 3: Signup Page ('/signup')
  if (currentRoute === '/signup') {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans selection:bg-blue-100 selection:text-blue-900">
        <SignupPage onNavigate={navigateTo} onSignupSuccess={handleSignupSuccess} />
        <Toast toasts={toasts} onDismiss={handleDismissToast} />
      </div>
    );
  }

  // Fallback for Loading or Error when loading authenticated views
  if (isLoading && !profile) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] flex items-center justify-center p-6">
        <LoadingState message="Loading your verified SkillGraph data..." />
      </div>
    );
  }

  if (loadError && !profile) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] flex items-center justify-center p-6">
        <ErrorState message={loadError} onRetry={loadBackendData} />
      </div>
    );
  }

  // Default active role
  const activeRole = targetRoles.find((r) => r.id === activeRoleId) || targetRoles[0];
  const activeStudentProfile: StudentProfile = profile || {
    id: 'student-default',
    fullName: 'Student Candidate',
    academicCourses: []
  };

  // Render Authenticated App Layout (Routes: /dashboard, /evidence, /skills, /roles, /gap-analysis, /mission, /profile, /integrations, /architecture)
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Unified Top Navigation */}
      <NavigationHeader
        currentView={currentRoute as ViewPath}
        onNavigate={navigateTo}
        targetRoles={targetRoles}
        activeRoleId={activeRoleId}
        insightsStatus={insightsStatus}
        onSelectRole={setActiveRoleId}
        onOpenLedger={() => setIsLedgerOpen(true)}
        onOpenAddProject={() => setIsAddProjectOpen(true)}
        profile={activeStudentProfile}
      />

      {/* Main Single Page Content - Spacious and clean */}
      <main className="flex-1 overflow-y-auto">
          {currentRoute === '/dashboard' && (
            <OverviewDashboard
              profile={activeStudentProfile}
              activeRole={activeRole}
              evidenceItems={evidenceItems}
              skillNodes={skillNodes}
              onNavigate={navigateTo}
              onOpenLedger={() => setIsLedgerOpen(true)}
              onOpenMissionModal={() => setIsMissionModalOpen(true)}
              onShowToast={showToast}
            />
          )}

          {currentRoute === '/profile' && (
            <StudentProfileView
              profile={activeStudentProfile}
              onUpdateProfile={handleUpdateProfile}
              onNavigate={navigateTo}
              onOpenLedger={() => setIsLedgerOpen(true)}
              onShowToast={showToast}
            />
          )}

          {currentRoute === '/evidence' && (
            <EvidenceVault
              evidenceItems={evidenceItems}
              onOpenAddProject={() => setIsAddProjectOpen(true)}
              onOpenAddHackathon={() => setIsAddHackathonOpen(true)}
              onDeleteEvidence={handleDeleteEvidence}
              onShowToast={showToast}
            />
          )}

          {currentRoute === '/skills' && (
            <InteractiveSkillGraph
              nodes={skillNodes}
              onNavigate={navigateTo}
              onOpenAddProject={() => setIsAddProjectOpen(true)}
              onShowToast={showToast}
            />
          )}

          {currentRoute === '/roles' && (
            <TargetRolesView
              targetRoles={targetRoles}
              activeRoleId={activeRoleId}
              insightsStatus={insightsStatus}
              onSelectRole={setActiveRoleId}
              onNavigate={navigateTo}
              onOpenMissionModal={() => setIsMissionModalOpen(true)}
            />
          )}

          {currentRoute === '/gap-analysis' && (
            <GapAnalysisView
              targetRoles={targetRoles}
              activeRoleId={activeRoleId}
              onSelectRole={setActiveRoleId}
              onNavigate={navigateTo}
              onOpenMissionModal={() => setIsMissionModalOpen(true)}
              onShowToast={showToast}
            />
          )}

          {currentRoute === '/mission' && (
            <ProjectMissionView
              mission={mission}
              onNavigate={navigateTo}
              onOpenScopeModal={() => setIsMissionModalOpen(true)}
              onShowToast={showToast}
            />
          )}

          {currentRoute === '/integrations' && (
            <GitHubIntegrationsView
              evidenceItems={evidenceItems}
              insightsStatus={insightsStatus}
              isInsightsLoading={isInsightsLoading}
              onRefreshInsights={refreshInsights}
              onNavigate={navigateTo}
              onShowToast={showToast}
            />
          )}

          {currentRoute === '/architecture' && (
            <ArchitectureDocsView onShowToast={showToast} />
          )}
        </main>

      {/* Global Modals */}
      <ProofAuditModal
        isOpen={isLedgerOpen}
        onClose={() => setIsLedgerOpen(false)}
        profile={activeStudentProfile}
        onShowToast={showToast}
      />

      <MissionSynthesizerModal
        isOpen={isMissionModalOpen}
        onClose={() => setIsMissionModalOpen(false)}
        mission={mission}
        onNavigateToMission={() => navigateTo('/mission')}
        onShowToast={showToast}
      />

      <AddProjectModal
        isOpen={isAddProjectOpen}
        onClose={() => setIsAddProjectOpen(false)}
        onAddEvidence={handleAddEvidence}
        onShowToast={showToast}
      />

      <AddHackathonModal
        isOpen={isAddHackathonOpen}
        onClose={() => setIsAddHackathonOpen(false)}
        onAddEvidence={handleAddEvidence}
        onShowToast={showToast}
      />

      {/* Toast Stack */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}

export default App;
