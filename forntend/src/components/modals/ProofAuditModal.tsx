import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Copy, Check, Award, GraduationCap, GitBranch, ExternalLink } from 'lucide-react';
import { StudentProfile } from '../../types';

interface ProofAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onShowToast: (title: string, message: string, type?: 'success' | 'info') => void;
}

export const ProofAuditModal: React.FC<ProofAuditModalProps> = ({
  isOpen,
  onClose,
  profile,
  onShowToast
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const proofRecords = [
    {
      title: 'University Official Academic Record',
      issuer: 'Stanford University Registrar',
      date: 'March 2025',
      summary: `Verified Academic Transcript • Cumulative GPA ${profile.cgpa || '3.85'} / 4.00`,
      icon: GraduationCap,
      verifiedBy: 'Registrar Electronic Seal'
    },
    {
      title: 'GitHub Code Repositories & Commits',
      issuer: 'GitHub Integration',
      date: 'February 2025',
      summary: '3 Public Repositories • 142 Analyzed Commits • Passing CI/CD test suites',
      icon: GitBranch,
      verifiedBy: 'Signed Git Commits & Test Automation'
    },
    {
      title: 'Hackathon Award Winner',
      issuer: 'CalHacks 2024 Organizer Jury',
      date: 'November 2024',
      summary: 'Awarded 1st Place: Best Systems Architecture for Distributed Consensus project',
      icon: Award,
      verifiedBy: 'Hackathon Committee Confirmation'
    }
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    onShowToast('Credential Details Copied', text, 'success');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-left">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Verified Credentials & Evidence
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Verified Records
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Official records backing {profile.fullName || 'Alex Chen'}&apos;s profile
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

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Every skill displayed on SkillGraph is validated through direct evidence—university transcripts, real code commits, and third-party certifications.
          </p>

          <div className="space-y-3">
            {proofRecords.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 hover:bg-white hover:border-slate-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-2xs">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                        <span className="text-[11px] text-slate-500">{item.issuer} • {item.date}</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 pt-1 font-medium">{item.summary}</p>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                    <span>Validation: {item.verifiedBy}</span>
                    <button
                      onClick={() => handleCopy(`${item.title} - ${item.issuer} (${item.summary})`, idx)}
                      className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Proof</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">All 3 verification sources active</span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold saas-btn-primary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProofAuditModal;
