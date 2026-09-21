import React, { useState } from 'react';
import {
  Terminal,
  ArrowRight,
  ShieldCheck,
  Network,
  Target,
  Rocket,
  Compass,
  CheckCircle2,
  FileCheck2,
  GitBranch,
  Trophy,
  Layers,
  ChevronRight,
  Sparkles,
  Menu,
  X,
  ExternalLink,
  Code2,
  Cpu,
  GraduationCap
} from 'lucide-react';
import { AppRoute } from '../../types';
import { Hero3DVisual } from './Hero3DVisual';

interface LandingPageProps {
  onNavigate: (route: AppRoute) => void;
  onEnterDemo?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onEnterDemo }) => {
  const handleEnterDemo = () => {
    if (onEnterDemo) {
      onEnterDemo();
    } else {
      onNavigate('/dashboard');
    }
  };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0F172A] font-sans selection:bg-slate-200 selection:text-[#0F172A] flex flex-col">
      {/* 1. Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-[#E2E8F0] bg-white/90 backdrop-blur-md px-4 sm:px-8 h-18 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-[#111827] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Network className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-bold tracking-tight text-[#0F172A]">
                  SkillGraph
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                  PLATFORM
                </span>
              </div>
              <span className="text-[11px] text-[#64748B] block leading-none font-mono">
                Evidence-Backed Skill Intelligence
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-[#475569]">
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-[#0F172A] transition-colors font-medium"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-[#0F172A] transition-colors font-medium"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('value-props')}
              className="hover:text-[#0F172A] transition-colors font-medium"
            >
              For Candidates
            </button>
          </nav>
        </div>

        {/* Right Auth CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => onNavigate('/login')}
            className="px-4 py-2 rounded-xl text-xs font-mono font-medium text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] border border-[#E2E8F0] transition-colors"
          >
            Log In
          </button>
          <button
            onClick={() => onNavigate('/signup')}
            className="px-4 py-2 rounded-xl text-xs font-mono font-semibold text-white bg-[#111827] hover:bg-black transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>Sign Up</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-[#475569] hover:bg-[#F1F5F9] border border-[#E2E8F0]"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile navigation dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E2E8F0] bg-white px-6 py-4 space-y-3">
          <button
            onClick={() => scrollToSection('features')}
            className="block w-full text-left text-sm font-medium text-[#475569] hover:text-[#0F172A] py-1.5"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="block w-full text-left text-sm font-medium text-[#475569] hover:text-[#0F172A] py-1.5"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('value-props')}
            className="block w-full text-left text-sm font-medium text-[#475569] hover:text-[#0F172A] py-1.5"
          >
            For Candidates
          </button>
          <div className="pt-3 border-t border-[#E2E8F0] flex flex-col gap-2">
            <button
              onClick={() => onNavigate('/login')}
              className="w-full py-2.5 rounded-xl text-xs font-mono text-center text-[#475569] border border-[#E2E8F0] hover:bg-[#F8FAFC]"
            >
              Log In
            </button>
            <button
              onClick={() => onNavigate('/signup')}
              className="w-full py-2.5 rounded-xl text-xs font-mono text-center text-white bg-[#111827] font-semibold"
            >
              Sign Up Free
            </button>
          </div>
        </div>
      )}

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-[#E2E8F0] bg-gradient-to-b from-white via-[#F8FAFC] to-white">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-slate-100/60 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/80 border border-blue-200/60 text-xs font-mono text-[#0F172A] shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-live-pulse" />
                <span className="font-semibold text-[#2563EB]">Next-Gen Career Intelligence</span>
                <span className="text-[#64748B]">•</span>
                <span className="text-[#475569]">Evidence Over Resumes</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] leading-[1.12]">
                Turn Evidence Into{' '}
                <span className="text-[#2563EB] underline decoration-blue-200 decoration-wavy underline-offset-8">
                  Career Intelligence
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#475569] max-w-2xl leading-relaxed">
                SkillGraph transforms your academic record, projects, GitHub activity, hackathons and certificates into a living capability graph.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('/signup')}
                  className="px-6 py-3.5 rounded-xl bg-[#111827] hover:bg-black text-white font-mono text-sm font-semibold shadow-lg hover:shadow-xl btn-interactive flex items-center gap-2.5 group"
                >
                  <span>Build Your SkillGraph</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={handleEnterDemo}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] font-mono text-sm font-semibold shadow-sm hover:border-[#CBD5E1] btn-interactive flex items-center gap-2 hover:shadow-glow-blue"
                >
                  <Network className="w-4 h-4 text-[#2563EB]" />
                  <span>Explore Demo</span>
                </button>
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-6 border-t border-[#E2E8F0] grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-[#0F172A]">100%</div>
                  <div className="text-xs text-[#64748B]">Evidence-Backed</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-[#0F172A]">SHA-256</div>
                  <div className="text-xs text-[#64748B]">Cryptographic Proof</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-[#0F172A]">Zero</div>
                  <div className="text-xs text-[#64748B]">Resume Hallucination</div>
                </div>
              </div>
            </div>

            {/* Right: 3D Interactive SkillGraph Visualization */}
            <div className="lg:col-span-5 relative">
              <Hero3DVisual />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Value Pillars Section */}
      <section id="features" className="py-20 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#2563EB]">
              Core Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
              Engineered to prove capability, not buzzwords.
            </h2>
            <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
              Every badge in your profile connects back to verifiable git commits, test pipelines, and institutional transcripts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm card-hover-3d text-left space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#0F172A]">
                <ShieldCheck className="w-5 h-5 text-[#2563EB]" />
              </div>
              <h3 className="font-mono text-base font-bold text-[#0F172A]">
                Evidence-Backed Vault
              </h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Connect GitHub repositories, course grades, and hackathon certificates. Every artifact is parsed and fingerprinted.
              </p>
              <div className="pt-2 text-[11px] font-mono font-semibold text-[#2563EB] flex items-center gap-1">
                <span>Tamper-evident logs</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm card-hover-3d text-left space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#0F172A]">
                <Target className="w-5 h-5 text-[#16A34A]" />
              </div>
              <h3 className="font-mono text-base font-bold text-[#0F172A]">
                Target Role Benchmarks
              </h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Compare your current skills against industry matrices for Full Stack, Backend, Frontend, and Systems Engineering.
              </p>
              <div className="pt-2 text-[11px] font-mono font-semibold text-[#16A34A] flex items-center gap-1">
                <span>Objective gap analysis</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm card-hover-3d text-left space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#0F172A]">
                <Rocket className="w-5 h-5 text-[#D97706]" />
              </div>
              <h3 className="font-mono text-base font-bold text-[#0F172A]">
                Adaptive Project Missions
              </h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Don’t just learn theory. Receive targeted, real-world project specifications specifically designed to close your identified gaps.
              </p>
              <div className="pt-2 text-[11px] font-mono font-semibold text-[#D97706] flex items-center gap-1">
                <span>Targeted competency boost</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm card-hover-3d text-left space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#0F172A]">
                <FileCheck2 className="w-5 h-5 text-[#0F172A]" />
              </div>
              <h3 className="font-mono text-base font-bold text-[#0F172A]">
                Verifiable Proof Ledger
              </h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Generate cryptographic attestations and Merkle proofs that recruiters can audit in one click without trusting self-reported claims.
              </p>
              <div className="pt-2 text-[11px] font-mono font-semibold text-[#0F172A] flex items-center gap-1">
                <span>One-click audit trail</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works Pipeline */}
      <section id="how-it-works" className="py-20 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#2563EB]">
              The Verified Lifecycle
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
              From Raw Evidence to Hiring Confidence
            </h2>
            <p className="text-sm text-[#475569]">
              Four continuous stages that elevate your career portfolio with genuine mathematical proof.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] card-hover-3d text-left space-y-3 relative">
              <div className="text-xs font-mono font-bold text-[#64748B]">STEP 01</div>
              <div className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center text-[#0F172A]">
                <GitBranch className="w-4 h-4 text-[#0F172A]" />
              </div>
              <h4 className="font-mono text-sm font-bold text-[#0F172A]">Deposit Evidence</h4>
              <p className="text-xs text-[#475569] leading-relaxed">
                Connect GitHub commits, submit verified academic transcripts, or upload hackathon project repositories.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] card-hover-3d text-left space-y-3 relative">
              <div className="text-xs font-mono font-bold text-[#64748B]">STEP 02</div>
              <div className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center text-[#2563EB]">
                <Network className="w-4 h-4 text-[#2563EB]" />
              </div>
              <h4 className="font-mono text-sm font-bold text-[#0F172A]">Synthesize Graph</h4>
              <p className="text-xs text-[#475569] leading-relaxed">
                The engine evaluates code complexity, test coverage, and course depth to assign verified status badges.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] card-hover-3d text-left space-y-3 relative">
              <div className="text-xs font-mono font-bold text-[#64748B]">STEP 03</div>
              <div className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center text-[#D97706]">
                <Target className="w-4 h-4 text-[#D97706]" />
              </div>
              <h4 className="font-mono text-sm font-bold text-[#0F172A]">Analyze Role Gap</h4>
              <p className="text-xs text-[#475569] leading-relaxed">
                Select desired roles and instantly visualize which competencies are strong, developing, or missing.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] card-hover-3d text-left space-y-3 relative">
              <div className="text-xs font-mono font-bold text-[#64748B]">STEP 04</div>
              <div className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center text-[#16A34A]">
                <Rocket className="w-4 h-4 text-[#16A34A]" />
              </div>
              <h4 className="font-mono text-sm font-bold text-[#0F172A]">Execute & Close</h4>
              <p className="text-xs text-[#475569] leading-relaxed">
                Execute adaptive missions with scaffolded starter code to earn verifiable evidence and reach job readiness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Value Proposition Comparison */}
      <section id="value-props" className="py-20 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#2563EB]">
              Direct Comparison
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
              Traditional Portfolios vs. SkillGraph
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Old Way */}
            <div className="p-8 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm text-left space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                <h3 className="font-mono text-base font-bold text-[#64748B]">Traditional Resume</h3>
                <span className="text-xs font-mono text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                  Unverified
                </span>
              </div>
              <ul className="space-y-3 text-xs text-[#475569]">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold text-sm leading-none mt-0.5">✕</span>
                  <span>Self-reported keyword lists that anyone can copy-paste.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold text-sm leading-none mt-0.5">✕</span>
                  <span>No verification of code authorship or genuine contributions.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold text-sm leading-none mt-0.5">✕</span>
                  <span>Zero clarity on exact hiring requirements and candidate gaps.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold text-sm leading-none mt-0.5">✕</span>
                  <span>Filtered out by blunt ATS parsing without human code evaluation.</span>
                </li>
              </ul>
            </div>

            {/* The SkillGraph Way */}
            <div className="p-8 rounded-2xl bg-white border border-[#0F172A] shadow-md text-left space-y-5 relative">
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                <h3 className="font-mono text-base font-bold text-[#0F172A]">The SkillGraph Ledger</h3>
                <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Cryptographically Proven
                </span>
              </div>
              <ul className="space-y-3 text-xs text-[#475569]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium text-[#0F172A]">
                    Every badge links directly to sha256-verified code commits and transcripts.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium text-[#0F172A]">
                    Interactive skill map shows depth across frontend, backend, and infrastructure.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium text-[#0F172A]">
                    Actionable project missions help you deliberately target missing skills.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium text-[#0F172A]">
                    Recruiters can audit proofs with zero trust requirements.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Bottom CTA Section */}
      <section className="py-20 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center space-y-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#111827] flex items-center justify-center text-white shadow-md">
            <Network className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0F172A]">
            Ready to prove what you can build?
          </h2>
          <p className="text-sm sm:text-base text-[#475569] max-w-xl mx-auto leading-relaxed">
            Create your profile in 60 seconds, connect your first evidence artifact, and watch your verified SkillGraph emerge.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('/signup')}
              className="px-8 py-4 rounded-xl bg-[#111827] hover:bg-black text-white font-mono text-sm font-semibold shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('/roles')}
              className="px-8 py-4 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] font-mono text-sm font-semibold shadow-sm transition-all"
            >
              Explore Target Roles
            </button>
          </div>
        </div>
      </section>

      {/* 7. Clean Modern Footer */}
      <footer className="py-12 bg-[#F8FAFC] px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono text-[#64748B]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#111827] flex items-center justify-center text-white">
              <Network className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-[#0F172A]">SkillGraph Platform</span>
            <span>• Evidence-Backed Skill Intelligence</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('/architecture')} className="hover:text-[#0F172A] transition-colors">
              Architecture Docs
            </button>
            <button onClick={() => onNavigate('/dashboard')} className="hover:text-[#0F172A] transition-colors">
              Platform
            </button>
            <button onClick={() => onNavigate('/roles')} className="hover:text-[#0F172A] transition-colors">
              Role Matrix
            </button>
            <button onClick={() => onNavigate('/login')} className="hover:text-[#0F172A] transition-colors">
              Sign In
            </button>
          </div>

          <div>© {new Date().getFullYear()} SkillGraph. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
