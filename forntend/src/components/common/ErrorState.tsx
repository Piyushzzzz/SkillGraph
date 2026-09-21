import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to load your data.',
  message = 'Please try again or check your backend connection.',
  onRetry,
  className = ''
}) => {
  return (
    <div
      className={`rounded-2xl border border-rose-200 bg-rose-50/60 p-8 sm:p-10 text-center max-w-xl mx-auto flex flex-col items-center justify-center my-6 shadow-sm ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 mb-4 shadow-xs">
        <AlertCircle className="w-6 h-6 text-rose-600" />
      </div>
      <h3 className="text-base sm:text-lg font-bold font-mono text-rose-900 mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-rose-700 max-w-sm mb-5 leading-relaxed">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-rose-50 text-xs font-mono font-medium text-rose-800 border border-rose-200 shadow-xs transition-all hover:scale-[1.02]"
        >
          <RefreshCw className="w-3.5 h-3.5 text-rose-700" />
          <span>Retry Request</span>
        </button>
      )}
    </div>
  );
};
