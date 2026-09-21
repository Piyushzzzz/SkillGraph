import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  icon?: LucideIcon;
}

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actions?: EmptyStateAction[];
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = Inbox,
  actions = [],
  className = ''
}) => {
  return (
    <div
      className={`rounded-2xl border border-[#E2E8F0] bg-white p-8 sm:p-12 text-center max-w-2xl mx-auto flex flex-col items-center justify-center my-6 shadow-sm card-hover-3d ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#0F172A] mb-4 shadow-xs">
        <Icon className="w-7 h-7 text-[#0F172A]" />
      </div>
      <h3 className="text-lg sm:text-xl font-bold font-mono text-[#0F172A] mb-2">{title}</h3>
      <p className="text-sm text-[#475569] max-w-md mb-6 leading-relaxed">{description}</p>

      {actions.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {actions.map((act, index) => {
            const ActIcon = act.icon;
            if (act.variant === 'secondary') {
              return (
                <button
                  key={index}
                  onClick={act.onClick}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-xs font-mono font-semibold text-[#0F172A] transition-all hover:border-[#CBD5E1] shadow-xs"
                >
                  {ActIcon && <ActIcon className="w-4 h-4 text-[#64748B]" />}
                  {act.label}
                </button>
              );
            }
            return (
              <button
                key={index}
                onClick={act.onClick}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#111827] hover:bg-black text-xs font-mono font-semibold text-white shadow-sm transition-all hover:scale-[1.02]"
              >
                {ActIcon && <ActIcon className="w-4 h-4" />}
                {act.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
