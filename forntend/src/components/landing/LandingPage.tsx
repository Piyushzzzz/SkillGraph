import React, { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Network,
  GitBranch,
  Menu,
  X,
  CheckCircle2,
  Sparkles,
  Layers,
  GraduationCap
} from 'lucide-react';
import { AppRoute } from '../../types';
import { Hero3DVisual } from './Hero3DVisual';

interface LandingPageProps {
  onNavigate: (route: AppRoute) => void;
  onEnterDemo?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onEnterDemo }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'backend' | 'systems' | 'ai' | 'frontend'>('backend');

  const handleEnterDemo = () => {
    if (onEnterDemo) {
      onEnterDemo();
    } else {
      onNavigate('/dashboard');
    }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const skillsData = {
    backend: {
      title: 'Backend Engineering',
      desc: 'High-throughput async APIs, database indexing, and scalable distributed service architecture.',
      verifiedVia: '3 GitHub repositories • 142 commits analyzed',
      skills: ['Python / FastAPI', 'PostgreSQL & Indexing', 'Redis Caching', 'REST & GraphQL'],
      readiness: '92% Mastery'
    },
    systems: {
      title: 'Distributed Systems',
      desc: 'Consensus protocols, network programming, and concurrent data pipelines.',
      verifiedVia: 'Raft consensus project • 98% test coverage',
      skills: ['Go & Concurrency', 'Raft Consensus', 'Docker & Linux', 'gRPC Protocol'],
      readiness: '88% Mastery'
    },
    ai: {
      title: 'AI & Data Platforms',
      desc: 'Vector search embeddings, retrieval-augmented generation, and neural model fine-tuning.',
      verifiedVia: 'Qdrant search service • Academic coursework',
      skills: ['PyTorch', 'Vector Embeddings', 'RAG Pipelines', 'Model Evaluation'],
      readiness: '82% Strong'
    },
    frontend: {
      title: 'Modern Frontend',
      desc: 'Component architecture, state management, and responsive user experiences.',
      verifiedVia: 'Production React web apps • Stanford CS142',
      skills: ['TypeScript', 'React 19', 'Tailwind CSS', 'Performance Tuning'],
      readiness: '90% Mastery'
    }
  };

  const currentCategoryData = skillsData[selectedCategory];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col antialiased">
      {/* 1. Modern SaaS Header */}
      <header className="sticky top-0 z-50 w-full h-16 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between transition-all shadow-[0_1px_4px_0_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-8">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25 transition-transform duration-200 group-hover:scale-105 group-active:scale-95">
              <Network className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                SkillGraph
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80 uppercase tracking-wider">
                Platform
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/70 p-1 rounded-2xl border border-slate-200/60 shadow-2xs">
            <button
              onClick={() => scrollToSection('overview')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-all"
            >
              Overview
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-all"
            >
              How it Works
            </button>
            <button
              onClick={() => scrollToSection('explore')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-all"
            >
              Skills
            </button>
            <button
              onClick={() => scrollToSection('roles')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-all"
            >
              Roles
            </button>
            <button
              onClick={() => onNavigate('/architecture')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-all"
            >
              Architecture
            </button>
          </nav>
        </div>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('/login')}
            className="text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors px-3.5 py-2 rounded-xl hover:bg-slate-100"
          >
            Log In
          </button>
          <button
            onClick={() => onNavigate('/signup')}
            className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-xs transition-all shadow-blue-500/20"
          >
            Sign Up Free
          </button>
          <button
            onClick={handleEnterDemo}
            className="px-3.5 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <span>Live Demo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-white border-b border-slate-200 p-5 space-y-3 z-50 animate-in fade-in slide-in-from-top-2 shadow-2xl">
          <div className="space-y-1">
            <button
              onClick={() => scrollToSection('overview')}
              className="block w-full text-left text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 px-3 py-2 rounded-xl transition-colors"
            >
              Overview
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="block w-full text-left text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 px-3 py-2 rounded-xl transition-colors"
            >
              How it Works
            </button>
            <button
              onClick={() => scrollToSection('explore')}
              className="block w-full text-left text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 px-3 py-2 rounded-xl transition-colors"
            >
              Skills Explorer
            </button>
            <button
              onClick={() => scrollToSection('roles')}
              className="block w-full text-left text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 px-3 py-2 rounded-xl transition-colors"
            >
              Career Roles
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => onNavigate('/signup')}
              className="w-full py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl text-center shadow-xs"
            >
              Sign Up Free
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => onNavigate('/login')}
                className="flex-1 py-2.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-center"
              >
                Log In
              </button>
              <button
                onClick={handleEnterDemo}
                className="flex-1 py-2.5 text-xs font-semibold border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-xl text-center"
              >
                Live Demo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Hero Section (Clean, Spacious, Light Mode) */}
      <section id="overview" className="pt-16 pb-20 sm:pt-24 sm:pb-28 px-4 sm:px-8 text-center max-w-5xl mx-auto">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-semibold text-blue-700 mb-6 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Next-Generation Technical Portfolio</span>
        </div>

        {/* Big Bold Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.08] mb-6">
          Prove what you build.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600">
            Not just what you claim.
          </span>
        </h1>

        {/* Clear Subtitle */}
        <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
          SkillGraph analyzes your real GitHub commits, coursework, and deployed projects to generate a clear, interactive map of your technical abilities.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button
            onClick={handleEnterDemo}
            className="px-6 py-3 text-sm font-semibold saas-btn-primary flex items-center gap-2"
          >
            <span>Explore Live Demo</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('/signup')}
            className="px-6 py-3 text-sm font-semibold saas-btn-secondary"
          >
            Create Your Profile
          </button>
        </div>

        {/* Hero Visual Presentation */}
        <div className="relative saas-card p-2 bg-white border border-slate-200/80 shadow-xl overflow-hidden max-w-4xl mx-auto">
          <Hero3DVisual />
        </div>
      </section>

      {/* 3. Three Clear Steps (How it Works) */}
      <section id="how-it-works" className="py-20 px-4 sm:px-8 border-t border-slate-200/80 bg-white">
        <div className="max-w-5xl mx-auto text-center space-y-14">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              The Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Simple. Automated. Verifiable.
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
              Three straightforward steps to turn raw code into hiring confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Step 1 */}
            <div className="saas-card p-7 space-y-3 bg-[#f8fafc] border border-slate-200">
              <span className="text-xs font-mono font-bold text-blue-600">01</span>
              <h3 className="text-lg font-bold text-slate-900">Connect</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Link your GitHub account, submit university course transcripts, or upload your hackathon projects.
              </p>
            </div>

            {/* Step 2 */}
            <div className="saas-card p-7 space-y-3 bg-[#f8fafc] border border-slate-200">
              <span className="text-xs font-mono font-bold text-indigo-600">02</span>
              <h3 className="text-lg font-bold text-slate-900">Verify</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                SkillGraph evaluates your actual commit history, code structure, and test coverage to confirm genuine mastery.
              </p>
            </div>

            {/* Step 3 */}
            <div className="saas-card p-7 space-y-3 bg-[#f8fafc] border border-slate-200">
              <span className="text-xs font-mono font-bold text-emerald-600">03</span>
              <h3 className="text-lg font-bold text-slate-900">Share</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Share a single interactive link that proves your technical competence directly to recruiters and engineering leads.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive Skill Explorer */}
      <section id="explore" className="py-20 px-4 sm:px-8 border-t border-slate-200/80 bg-[#f8fafc]">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Interactive Explorer
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Your skills, organized clearly.
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
              Select a domain below to preview verified skills and real evidence.
            </p>
          </div>

          {/* Segmented Controls */}
          <div className="inline-flex p-1 rounded-xl bg-white border border-slate-200 shadow-xs">
            <button
              onClick={() => setSelectedCategory('backend')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === 'backend' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Backend
            </button>
            <button
              onClick={() => setSelectedCategory('systems')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === 'systems' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Systems
            </button>
            <button
              onClick={() => setSelectedCategory('ai')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === 'ai' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              AI & Platforms
            </button>
            <button
              onClick={() => setSelectedCategory('frontend')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === 'frontend' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Frontend
            </button>
          </div>

          {/* Detail Card */}
          <div className="saas-card p-6 sm:p-10 text-left space-y-6 max-w-3xl mx-auto bg-white border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{currentCategoryData.title}</h3>
                <p className="text-xs font-medium text-blue-600 mt-0.5">{currentCategoryData.verifiedVia}</p>
              </div>
              <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
                {currentCategoryData.readiness}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {currentCategoryData.desc}
            </p>

            <div className="space-y-2 pt-2">
              <span className="text-xs text-slate-700 font-bold block">Verified Competencies:</span>
              <div className="flex flex-wrap gap-2">
                {currentCategoryData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-50 text-slate-800 border border-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Target Roles (Clean Cards) */}
      <section id="roles" className="py-20 px-4 sm:px-8 border-t border-slate-200/80 bg-white">
        <div className="max-w-5xl mx-auto space-y-12 text-center">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Career Readiness
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Know where you stand.
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
              Compare your current verified skills directly against industry hiring standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Role 1 */}
            <div className="saas-card p-6 space-y-3 bg-[#f8fafc] border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Role Match</span>
                <span className="text-2xl font-extrabold text-emerald-600">86%</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Software Developer</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Backend services, databases, algorithms, and distributed systems design.
              </p>
              <div className="pt-2">
                <span className="text-xs font-semibold text-emerald-600">Ready to Interview</span>
              </div>
            </div>

            {/* Role 2 */}
            <div className="saas-card p-6 space-y-3 bg-[#f8fafc] border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Role Match</span>
                <span className="text-2xl font-extrabold text-blue-600">74%</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">AI / ML Engineer</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Vector databases, retrieval pipelines, neural models, and fine-tuning.
              </p>
              <div className="pt-2">
                <span className="text-xs font-semibold text-amber-600">1 Mission Recommended</span>
              </div>
            </div>

            {/* Role 3 */}
            <div className="saas-card p-6 space-y-3 bg-[#f8fafc] border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Role Match</span>
                <span className="text-2xl font-extrabold text-emerald-600">91%</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Full Stack Engineer</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Modern React UI, type-safe API integrations, performance, and cloud deployment.
              </p>
              <div className="pt-2">
                <span className="text-xs font-semibold text-emerald-600">Exceptional Match</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Call to Action Banner */}
      <section className="py-20 px-4 sm:px-8 border-t border-slate-200/80 text-center bg-[#f8fafc]">
        <div className="max-w-2xl mx-auto space-y-6 saas-card p-10 bg-white border border-slate-200 shadow-md">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Ready to prove what you can build?
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Get started in under 60 seconds with your GitHub account.
          </p>
          <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('/signup')}
              className="px-6 py-3 text-sm font-semibold saas-btn-primary flex items-center gap-2"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('/login')}
              className="px-6 py-3 text-sm font-semibold saas-btn-secondary"
            >
              Log In to Account
            </button>
            <button
              onClick={handleEnterDemo}
              className="px-5 py-3 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Explore Live Demo
            </button>
          </div>
        </div>
      </section>

      {/* 7. Clean Minimalist Footer */}
      <footer className="py-12 px-4 sm:px-8 border-t border-slate-200 bg-white text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Network className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-800">SkillGraph</span>
            <span>— Evidence-backed talent intelligence.</span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <button onClick={() => onNavigate('/dashboard')} className="hover:text-blue-600 transition-colors">
              Platform
            </button>
            <button onClick={() => onNavigate('/skills')} className="hover:text-blue-600 transition-colors">
              Graph
            </button>
            <button onClick={() => onNavigate('/roles')} className="hover:text-blue-600 transition-colors">
              Roles
            </button>
            <button onClick={() => onNavigate('/architecture')} className="hover:text-blue-600 transition-colors">
              Architecture
            </button>
          </div>

          <div>© {new Date().getFullYear()} SkillGraph. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
