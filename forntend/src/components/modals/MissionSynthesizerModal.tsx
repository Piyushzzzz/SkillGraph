import React, { useState } from 'react';
import { X, Rocket, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { ProjectMission } from '../../types';

interface MissionSynthesizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mission?: ProjectMission | null;
  onNavigateToMission: () => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info') => void;
}

export const MissionSynthesizerModal: React.FC<MissionSynthesizerModalProps> = ({
  isOpen,
  onClose,
  mission,
  onNavigateToMission,
  onShowToast
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleStartProject = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      onShowToast('Project Loaded!', 'Your practice project is ready to begin.', 'success');
      onNavigateToMission();
      onClose();
    }, 400);
  };

  const activeMission = mission || {
    id: 'generated-mission',
    specId: 'PRJ-REST-API',
    title: 'Build & Deploy a Production REST API',
    objective: 'Learn Docker containerization, automated testing with Pytest, and CI/CD pipelines through a hands-on project.',
    estimatedHours: '10-14 hours',
    skillDelta: 'Docker • Pytest • GitHub Actions'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden text-left">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Recommended Practice Project
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Custom Match
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Tailored to bridge your exact skill gaps
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-500">PROJECT TITLE</span>
              <span className="font-semibold text-blue-600">Est. {activeMission.estimatedHours}</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">{activeMission.title}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{activeMission.objective}</p>
            
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-700">Target Skills Covered:</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {activeMission.skillDelta.split('•').map((s, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700"
                  >
                    {s.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="font-semibold text-slate-800">What you will get:</div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Step-by-step checklist from API setup to Docker containerization</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Automated GitHub repository verification when you submit your code</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold saas-btn-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleStartProject}
            disabled={isGenerating}
            className="px-5 py-2 text-xs font-semibold saas-btn-primary flex items-center gap-2"
          >
            <span>{isGenerating ? 'Loading Project...' : 'Start Practice Project'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissionSynthesizerModal;
