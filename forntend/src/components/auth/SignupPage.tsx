import React, { useState } from 'react';
import { Network, Lock, Mail, User, GraduationCap, ArrowRight, ArrowLeft, Target, ShieldCheck } from 'lucide-react';
import { AppRoute, StudentProfile } from '../../types';

interface SignupPageProps {
  onNavigate: (route: AppRoute) => void;
  onSignupSuccess: (profile: Partial<StudentProfile>) => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onNavigate, onSignupSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError('Please fill in your name, email, and password.');
      return;
    }
    setError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const newStudent: Partial<StudentProfile> = {
        id: `usr_${Date.now()}`,
        fullName,
        email,
        university: university || undefined,
        cgpa: undefined,
        academicCourses: []
      };
      onSignupSuccess(newStudent);
      onNavigate('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-slate-200 selection:text-[#0F172A] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Back to Landing Page link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#64748B] hover:text-[#0F172A] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to SkillGraph Home
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#111827] flex items-center justify-center text-white shadow-md">
            <Network className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="text-center text-2xl font-bold tracking-tight text-[#0F172A]">
          Create your Student Account
        </h2>
        <p className="mt-1 text-center text-xs text-[#64748B]">
          Start building your verified capability and skill topology
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-sm rounded-2xl border border-[#E2E8F0] card-hover-3d">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-mono">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-mono font-medium text-[#475569] mb-1.5">
                Full Name
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-[#94A3B8]" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Chen"
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-mono text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#111827] focus:ring-1 focus:ring-[#111827] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-[#475569] mb-1.5">
                Student or University Email
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-[#94A3B8]" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@university.edu"
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-mono text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#111827] focus:ring-1 focus:ring-[#111827] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-[#475569] mb-1.5">
                University / Institution (Optional)
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <GraduationCap className="h-4 w-4 text-[#94A3B8]" />
                </div>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="e.g. University of California, Berkeley"
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-mono text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#111827] focus:ring-1 focus:ring-[#111827] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-[#475569] mb-1.5">
                Create Password
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-[#94A3B8]" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-mono text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#111827] focus:ring-1 focus:ring-[#111827] transition-colors"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-2 text-xs text-[#475569]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Your proofs will be sealed with SHA-256 tamper-evident attestations.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-mono font-semibold text-white bg-[#111827] hover:bg-black shadow-sm transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Existing account link */}
          <div className="mt-6 pt-5 border-t border-[#E2E8F0] text-center">
            <span className="text-xs text-[#64748B]">Already have an account? </span>
            <button
              onClick={() => onNavigate('/login')}
              className="text-xs font-mono font-semibold text-[#0F172A] hover:underline"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
