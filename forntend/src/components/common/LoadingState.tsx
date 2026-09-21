import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading your SkillGraph...',
  className = ''
}) => {
  return (
    <div
      className={`rounded-2xl border border-[#E2E8F0] bg-white p-12 text-center max-w-xl mx-auto flex flex-col items-center justify-center my-8 shadow-sm ${className}`}
    >
      <div className="relative w-12 h-12 flex items-center justify-center mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-slate-200 animate-ping opacity-75" />
        <Loader2 className="w-8 h-8 text-[#0F172A] animate-spin" />
      </div>
      <p className="text-sm font-semibold text-[#0F172A] font-mono">{message}</p>
      <span className="text-xs text-[#64748B] mt-1 font-mono">Querying verified ledger nodes...</span>
    </div>
  );
};
