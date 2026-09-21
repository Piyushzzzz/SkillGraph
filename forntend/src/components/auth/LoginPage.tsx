import React, { useState } from 'react';
import { Network, Lock, Mail, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { AppRoute } from '../../types';

interface LoginPageProps {
  onNavigate: (route: AppRoute) => void;
  onLoginSuccess: (email: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your email and password.');
      return;
    }
    setError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(email);
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
          Sign in to your SkillGraph
        </h2>
        <p className="mt-1 text-center text-xs text-[#64748B]">
          Access your verified evidence vault and talent topology
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-sm rounded-2xl border border-[#E2E8F0] card-hover-3d">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-mono">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-mono font-medium text-[#475569] mb-1.5">
                Student or Work Email
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono font-medium text-[#475569]">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset instructions will be sent to your email.');
                  }}
                  className="text-[11px] font-mono text-[#2563EB] hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-[#94A3B8]" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-mono text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#111827] focus:ring-1 focus:ring-[#111827] transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#CBD5E1] text-[#111827] focus:ring-0"
                />
                <span className="text-xs text-[#475569]">Remember session</span>
              </label>

              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Ledger Encrypted
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-mono font-semibold text-white bg-[#111827] hover:bg-black shadow-sm transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Alternative Signup link */}
          <div className="mt-6 pt-5 border-t border-[#E2E8F0] text-center">
            <span className="text-xs text-[#64748B]">New to SkillGraph? </span>
            <button
              onClick={() => onNavigate('/signup')}
              className="text-xs font-mono font-semibold text-[#0F172A] hover:underline"
            >
              Create an account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
