import React, { useState } from 'react';
import { X, Rocket, Sparkles, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
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

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      onShowToast('Mission Synthesized!', 'Project mission generated and ready to execute.', 'success');
      onNavigateToMission();
      onClose();
    }, 900);
  };

  const activeMission = mission || {
    id: 'generated-mission',
    specId: 'MSN-ADAPTIVE',
    title: 'Adaptive Capstone Project',
    objective: 'Bridge identified skill gaps through a hands-on, production-grade project.',
    estimatedHours: '12-16 hrs',
    skillDelta: 'Target Competency Vectors'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden text-left">
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#0F172A]">
              <Rocket className="w-5 h-5 text-[#0F172A]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-sm font-bold text-[#0F172A]">
                  Adaptive Mission Synthesizer
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#0F172A] border border-[#E2E8F0] font-bold">
                  VECTOR ENGINE
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                Synthesizing project deliverables to bridge identified skill gaps
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#64748B]">RECOMMENDED MISSION</span>
              <span className="text-xs font-mono text-emerald-700 font-semibold">{activeMission.specId}</span>
            </div>
            <h4 className="text-sm font-bold text-[#0F172A] font-mono">{activeMission.title}</h4>
            <p className="text-xs text-[#475569] leading-relaxed">{activeMission.objective}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white text-[#0F172A] border border-[#E2E8F0]">
                Est. {activeMission.estimatedHours}
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                {activeMission.skillDelta}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono font-semibold text-[#0F172A] uppercase">
              Automated Synthesis Vectors:
            </div>
            <div className="space-y-1.5 text-xs text-[#475569]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Generates repository template and CI pipeline skeleton</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Provides milestone checklist to prove competency</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Auto-validates evidence into cryptographic Merkle proof</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[#E2E8F0] bg-white flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-mono text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
          >
            Dismiss
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-xl bg-[#111827] hover:bg-black text-xs font-mono font-semibold text-white shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <span>Synthesizing...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Open Project Mission Specs</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissionSynthesizerModal;
