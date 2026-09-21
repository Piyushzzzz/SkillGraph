import React, { useState } from 'react';
import { ProjectMission, ViewPath } from '../../types';
import {
  Rocket,
  CheckCircle2,
  Clock,
  Target,
  ArrowRight,
  Layers,
  Sparkles,
  Check,
  FolderGit2,
  ExternalLink,
  Code2,
  BookOpen
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
  onShowToast
}) => {
  // Practice Project Tasks Checklist
  const [tasks, setTasks] = useState([
    {
      id: 't1',
      title: 'Define API Schema & Route Endpoints',
      category: 'API Development',
      desc: 'Build clean CRUD endpoints using FastAPI with request validation and automatic Swagger/OpenAPI docs.',
      skills: ['FastAPI', 'Python', 'Pydantic'],
      completed: true
    },
    {
      id: 't2',
      title: 'Write Automated Unit & Integration Tests',
      category: 'Testing & Quality',
      desc: 'Create test fixtures in pytest to verify status codes, error handling, and business logic.',
      skills: ['Pytest', 'Test Automation'],
      completed: true
    },
    {
      id: 't3',
      title: 'Containerize Application with Docker',
      category: 'DevOps & Deployment',
      desc: 'Write an optimized multi-stage Dockerfile and test local execution with docker-compose.',
      skills: ['Docker', 'Containers'],
      completed: false
    },
    {
      id: 't4',
      title: 'Configure GitHub Actions CI Workflow',
      category: 'DevOps & CI/CD',
      desc: 'Set up an automated GitHub Action that runs your test suite on every pull request.',
      skills: ['GitHub Actions', 'CI/CD'],
      completed: false
    }
  ]);

  const [repoUrl, setRepoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPct = Math.round((completedCount / tasks.length) * 100);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleSubmitRepo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl) {
      onShowToast('Repository URL Needed', 'Please paste your GitHub repository link.', 'info');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      onShowToast(
        'Project Verified!',
        'GitHub repository successfully analyzed and added to your portfolio.',
        'success'
      );
    }, 900);
  };

  return (
    <div className="py-8 px-4 sm:px-8 max-w-5xl mx-auto text-left space-y-8 animate-fade-in">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-semibold text-blue-700 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Recommended Hands-On Practice Project</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Build & Deploy a Production REST API
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            This project is customized for your profile to close your remaining skill gaps in Docker, Testing, and CI/CD pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => onNavigate('/gap-analysis')}
            className="px-4 py-2 text-xs font-semibold saas-btn-secondary"
          >
            Back to Gap Analysis
          </button>
        </div>
      </div>

      {/* 2. Project Quick Stats Banner */}
      <div className="saas-card p-6 sm:p-7 bg-white border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Estimated Effort
          </span>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-xl font-extrabold text-slate-900">10 – 14 Hours</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Self-paced with guided milestones</p>
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Skills You Will Master
          </span>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {['FastAPI', 'Docker', 'Pytest', 'GitHub Actions'].map((skill) => (
              <span
                key={skill}
                className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Career Role Target
          </span>
          <div className="flex items-center gap-2 mt-1">
            <Target className="w-5 h-5 text-emerald-600" />
            <span className="text-xl font-extrabold text-slate-900">Backend & Cloud</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Directly improves role match by +14%</p>
        </div>
      </div>

      {/* 3. Progress Bar */}
      <div className="saas-card p-6 bg-white border border-slate-200 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-900">
            Project Completion Progress ({completedCount} of {tasks.length} steps completed)
          </span>
          <span className="font-extrabold text-blue-600">{progressPct}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500 rounded-full"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* 4. Interactive Step-by-Step Task Checklist */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Project Steps & Milestones</h2>
          <span className="text-xs text-slate-500">Click a checkbox once you finish a step</span>
        </div>

        <div className="space-y-3">
          {tasks.map((task, idx) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`saas-card p-5 border cursor-pointer transition-all flex items-start gap-4 ${
                task.completed
                  ? 'bg-slate-50/70 border-slate-200 text-slate-600'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <button
                type="button"
                className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                  task.completed
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'border-2 border-slate-300 hover:border-blue-500 bg-white'
                }`}
              >
                {task.completed && <Check className="w-4 h-4" />}
              </button>

              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">Step 0{idx + 1}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {task.category}
                  </span>
                </div>
                <h3
                  className={`text-sm font-bold ${
                    task.completed ? 'line-through text-slate-500' : 'text-slate-900'
                  }`}
                >
                  {task.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">{task.desc}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {task.skills.map((s) => (
                    <span
                      key={s}
                      className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Project Submission / Link GitHub Repository */}
      <div className="saas-card p-6 sm:p-8 bg-white border border-slate-200 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Submit Your GitHub Repository</h2>
            <p className="text-xs text-slate-500">
              When you push your code, paste your repository link here. We will verify your tests and commits.
            </p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Project Successfully Verified & Submitted!</span>
            </div>
            <p className="text-xs text-emerald-700">
              Your repository <strong>{repoUrl}</strong> has been analyzed. 4 new skills have been verified and credited to your profile.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('/dashboard')}
                className="px-4 py-2 text-xs font-semibold saas-btn-primary"
              >
                View in Dashboard
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitRepo} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                GitHub Repository URL
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="url"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/username/fastapi-production-service"
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-xs font-semibold saas-btn-primary flex items-center justify-center gap-2 shrink-0"
                >
                  {isSubmitting ? (
                    <span>Verifying Repository...</span>
                  ) : (
                    <>
                      <span>Submit for Verification</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              Tip: You can also use our starter template if you want to quickly test your setup.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProjectMissionView;
