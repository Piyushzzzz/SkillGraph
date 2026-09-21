import React, { useState } from 'react';
import { ProjectMission, ViewPath } from '../../types';
import {
  Rocket,
  ShieldCheck,
  Download,
  CheckCircle2,
  Clock,
  Target,
  ArrowRight,
  Layers,
  Server,
  Database,
  Lock,
  Terminal,
  ExternalLink,
  ChevronRight,
  Sparkles,
  FileCode,
  Check,
  Eye,
  ArrowLeft
} from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

interface ProjectMissionViewProps {
  mission?: ProjectMission | null;
  onNavigate: (view: ViewPath) => void;
  onOpenScopeModal: () => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info') => void;
}

export const ProjectMissionView: React.FC<ProjectMissionViewProps> = ({
  mission,
  onNavigate,
  onOpenScopeModal,
  onShowToast
}) => {
  const [showSampleExplanation, setShowSampleExplanation] = useState(false);

  // Mission Empty State
  if (!mission && !showSampleExplanation) {
    return (
      <div className="p-6 sm:p-12 max-w-4xl mx-auto text-left space-y-6">
        <EmptyState
          title="No mission generated yet."
          description="Select a target role and analyze your skill gaps to generate a personalized project mission."
          icon={Rocket}
          actions={[
            {
              label: 'Analyze Skill Gaps',
              onClick: () => onNavigate('/gap-analysis'),
              variant: 'primary',
              icon: Target
            }
          ]}
        />

        {/* Explanatory preview link */}
        <div className="text-center pt-2">
          <button
            onClick={() => setShowSampleExplanation(true)}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Example Mission Specification (Explanatory Content)</span>
          </button>
        </div>
      </div>
    );
  }

  // Active or explanatory mission
  const activeMission = mission || {
    id: 'example-mission',
    specId: 'MSN-EX01',
    status: 'Ready to Initiate' as const,
    targetRole: 'Target Role Benchmark',
    estimatedHours: '12-16 hrs',
    level: 'L4 Production Spec',
    title: 'Build and Deploy a Production REST API',
    objective:
      'Explanatory Architecture: Bridge service layer and cloud deployment gaps by designing an asynchronous, containerized backend with automated testing pipelines.',
    description:
      'This is an explanatory blueprint demonstrating how SkillGraph synthesizes missing skill vectors into actionable deliverables.',
    skillDelta: 'FastAPI • Pytest • Docker • GitHub Actions',
    competencySurge: 24,
    shaSpec: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    specifications: [
      {
        num: '01',
        title: 'Asynchronous API Kernel & Dependency Injection',
        badge: 'FastAPI / Pydantic v2',
        description: 'Implement structured response models, OAuth2 bearer validation, and async route handlers.'
      },
      {
        num: '02',
        title: 'Unit & End-to-End Concurrency Test Suite',
        badge: 'Pytest / Asyncio',
        description: 'Build isolated fixtures, database rollback transactions, and mock external API dependencies.'
      },
      {
        num: '03',
        title: 'Multi-Stage Container & Automated CI Pipeline',
        badge: 'Docker / Actions',
        description: 'Author lightweight multi-stage Dockerfiles with non-root security boundaries and automated checks.'
      }
    ],
    deliverables: [
      {
        id: 'd1',
        name: 'Async API Endpoints with OpenAPI Documentation',
        tag: 'API Kernel',
        description: 'Complete route implementation with typed schemas and status codes.',
        checked: false
      },
      {
        id: 'd2',
        name: 'Unit & Integration Test Suite (>85% Coverage)',
        tag: 'Testing',
        description: 'Passing pytest test suite verifying error states and auth boundaries.',
        checked: false
      },
      {
        id: 'd3',
        name: 'Multi-stage Dockerfile and CI Workflow (.github/workflows/ci.yml)',
        tag: 'DevOps',
        description: 'Reproducible build with automated pull request verification.',
        checked: false
      }
    ],
    milestones: [
      {
        number: 1,
        timeline: 'Hours 0-4',
        title: 'Architecture Blueprint & Core Schemas',
        description: 'Set up project repository, dependency definitions, and database migrations.',
        completed: false
      },
      {
        number: 2,
        timeline: 'Hours 5-10',
        title: 'Service Layer & Async Endpoints',
        description: 'Develop data ingestion routines, async query optimization, and error handlers.',
        completed: false
      },
      {
        number: 3,
        timeline: 'Hours 11-16',
        title: 'Testing, Containerization & Proof Evidence',
        description: 'Run integration test matrix, build Docker images, and record commit telemetry.',
        completed: false
      }
    ]
  };

  const [deliverables, setDeliverables] = useState(activeMission.deliverables);
  const [milestones, setMilestones] = useState(activeMission.milestones);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationOutput, setVerificationOutput] = useState<string | null>(null);

  const completedDeliverablesCount = deliverables.filter((d) => d.checked).length;
  const totalDeliverablesCount = deliverables.length;
  const progressPercent = totalDeliverablesCount > 0 ? Math.round((completedDeliverablesCount / totalDeliverablesCount) * 100) : 0;

  const toggleDeliverable = (id: string) => {
    setDeliverables((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const toggleMilestone = (number: number) => {
    setMilestones((prev) =>
      prev.map((m) => (m.number === number ? { ...m, completed: !m.completed } : m))
    );
  };

  const handleSimulateVerification = () => {
    setIsVerifying(true);
    setVerificationOutput(null);
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationOutput(
        `✓ Synthesizing Evidence Bundle\n✓ Test Suite Execution: 14/14 tests passing (coverage: 92%)\n✓ Container Scan: 0 high vulnerabilities detected\n✓ Pull Request Artifact: PR #42 verified (Commit: 8f4a1c9)\n✓ Cryptographic Evidence Hash Generated: ${activeMission.shaSpec || 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'}`
      );
      onShowToast('Verification Complete', 'Evidence artifact generated and ready for vault deposit.', 'success');
    }, 1500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto text-left">
      {/* Return to empty state if viewing sample */}
      {!mission && showSampleExplanation && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-800 font-semibold">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Viewing Explanatory Mission Blueprint (Sample Specification)</span>
          </div>
          <button
            onClick={() => setShowSampleExplanation(false)}
            className="flex items-center gap-1 text-xs font-mono text-[#0F172A] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Mission Hub</span>
          </button>
        </div>
      )}

      {/* 1. Header Banner */}
      <section className="p-6 rounded-2xl bg-white border border-[#E2E8F0] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm card-hover-3d">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#0F172A] border border-[#E2E8F0] font-bold">
              SPECIFICATION // {activeMission.specId}
            </span>
            <span className="text-xs font-mono text-emerald-700 flex items-center gap-1 font-semibold">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              {activeMission.estimatedHours}
            </span>
            {activeMission.skillDelta && (
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 font-semibold flex items-center gap-1">
                <Target className="w-3 h-3 text-rose-600" />
                Target Gap Addressed: {activeMission.skillDelta}
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-mono text-[#0F172A]">
            {activeMission.title}
          </h1>
          <p className="text-xs text-[#475569] max-w-xl">
            {activeMission.objective}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('/gap-analysis')}
            className="px-4 py-2 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono text-[#0F172A] shadow-xs transition-all text-center"
          >
            Back to Gap Analysis
          </button>
        </div>
      </section>

      {/* 2. Live Progress Indicator */}
      <section className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB] animate-live-pulse" />
          <div className="text-xs font-mono text-[#0F172A]">
            <span className="font-bold">Mission Execution Progress: </span>
            <span className="text-[#2563EB] font-bold">{completedDeliverablesCount}/{totalDeliverablesCount} Tasks Completed</span>
            <span className="text-[#64748B] ml-2">({progressPercent}%)</span>
          </div>
        </div>
        <div className="w-full sm:w-48 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
          <div
            className="bg-[#2563EB] h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </section>

      {/* 3. Specifications & Deliverables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Specifications */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] font-mono flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#2563EB]" />
            Core Technical Specifications
          </h2>

          <div className="space-y-3">
            {activeMission.specifications.map((spec) => (
              <div
                key={spec.num}
                className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-1.5 shadow-sm card-hover-3d"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#111827] text-white font-mono text-xs flex items-center justify-center font-bold">
                      {spec.num}
                    </span>
                    <span className="text-xs font-semibold text-[#0F172A]">{spec.title}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0]">
                    {spec.badge}
                  </span>
                </div>
                <p className="text-xs text-[#475569] pl-8 leading-relaxed">{spec.description}</p>
              </div>
            ))}
          </div>

          {/* Milestones */}
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] font-mono flex items-center gap-2 pt-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            Execution Timeline
          </h2>
          <div className="space-y-2.5">
            {milestones.map((m) => (
              <div
                key={m.number}
                onClick={() => toggleMilestone(m.number)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between shadow-xs ${
                  m.completed
                    ? 'bg-emerald-50/50 border-emerald-300 text-emerald-900'
                    : 'bg-white border-[#E2E8F0] text-[#0F172A] hover:border-[#CBD5E1]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                      m.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-[#CBD5E1] bg-[#F8FAFC]'
                    }`}
                  >
                    {m.completed && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <div className="text-xs font-semibold">{m.title}</div>
                    <div className="text-[10px] text-[#64748B]">{m.description}</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#64748B]">{m.timeline}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Deliverables Checklist & Evidence Verification */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Evidence Deliverables Checklist
          </h2>

          <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] space-y-4 shadow-sm card-hover-3d">
            <p className="text-xs text-[#64748B]">
              Completing these deliverables creates cryptographic proof records in your Evidence Vault.
            </p>

            <div className="space-y-2.5">
              {deliverables.map((del) => (
                <div
                  key={del.id}
                  onClick={() => toggleDeliverable(del.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1 shadow-xs ${
                    del.checked
                      ? 'bg-emerald-50/60 border-emerald-200'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#CBD5E1]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        del.checked
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-[#CBD5E1] bg-white'
                      }`}
                    >
                      {del.checked && <Check className="w-3 h-3" />}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        del.checked ? 'text-emerald-800 line-through' : 'text-[#0F172A]'
                      }`}
                    >
                      {del.name}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#64748B] pl-6.5">{del.description}</p>
                </div>
              ))}
            </div>

            {/* Simulate Implementation / Verify Code Button */}
            <div className="pt-2 space-y-3">
              <button
                disabled={isVerifying}
                onClick={handleSimulateVerification}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-mono font-semibold text-white shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 btn-interactive"
              >
                {isVerifying ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Code & Test Harness...</span>
                  </>
                ) : (
                  <>
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Simulate Implementation / Verify Code</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onNavigate('/evidence')}
                className="w-full py-2.5 px-4 rounded-xl bg-[#111827] hover:bg-black text-xs font-mono font-semibold text-white shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <span>Deposit Completed Project into Evidence Vault</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Output / Evidence Preview section */}
            {verificationOutput && (
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-mono text-[11px] space-y-2 animate-fade-in-up">
                <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800 text-[10px] uppercase font-bold">
                  <span>Evidence Proof Output</span>
                  <span className="text-emerald-400">Status: PASS</span>
                </div>
                <pre className="whitespace-pre-wrap leading-relaxed text-emerald-300">
                  {verificationOutput}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectMissionView;
