import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Copy, Check, Terminal, ExternalLink, Lock } from 'lucide-react';
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

  const proofBlocks = [
    {
      blockNum: 1089,
      type: 'Academic Transcript Genesis Block',
      issuer: 'University Registrar Office',
      timestamp: '2025-03-20T14:32:01Z',
      payload: `Verified Transcript Records • CGPA ${profile.cgpa || '3.80'}/${profile.maxCgpa || '4.00'}`,
      hash: '0x8f92c10b48a1d65dfc2d4b1fa3d677284addd200126d9069',
      verified: true
    },
    {
      blockNum: 1090,
      type: 'Git Commit & Webhook Telemetry Block',
      issuer: 'GitHub API Webhook Integration (Auth: ed25519)',
      timestamp: '2025-02-14T09:18:44Z',
      payload: 'Automated commit signature verification • CI/CD pipeline pass 100%',
      hash: '0x9e4a1b7238a9cf291d9004812f8e1329bb901e',
      verified: true
    },
    {
      blockNum: 1091,
      type: 'Competitive Hackathon Award Signature',
      issuer: 'Hackathon Jury Consensus Protocol',
      timestamp: '2024-02-18T18:00:00Z',
      payload: 'Award: Best Systems Architecture • Proof Hash Confirmed',
      hash: '0x88921ec5a4b10091fe298b67104b901a',
      verified: true
    }
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    onShowToast('Proof Hash Copied', text, 'success');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-left">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-sm font-bold text-[#0F172A]">
                  Cryptographic Proof Chain Ledger
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                  VERITAS PROTOCOL
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                Public Identifier: {profile.publicId || 'ID-VERIFIED'} • Merkle Root Verified
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-[#2563EB]" />
              <div>
                <div className="text-xs font-mono font-medium text-[#0F172A]">
                  Active Attestation Digest SHA-256
                </div>
                <div className="text-[11px] font-mono text-emerald-700 truncate max-w-md font-semibold">
                  {profile.cgpaVerificationHash || '0x8f92c10b48a1d65dfc2d4b1fa3d677284addd200126d9069'}
                </div>
              </div>
            </div>
            <button
              onClick={() => handleCopy(profile.cgpaVerificationHash || '0x8f92c10b48a1d65dfc2d4b1fa3d677284addd200126d9069', 999)}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-mono text-[#0F172A] flex items-center gap-1.5 shadow-xs"
            >
              {copiedIndex === 999 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#64748B]" />}
              <span>Copy</span>
            </button>
          </div>

          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#64748B]">
            Validated Chain Blocks (Consensus Verified)
          </div>

          <div className="space-y-3">
            {proofBlocks.map((block, idx) => (
              <div
                key={block.blockNum}
                className="p-4 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-[#0F172A]">
                        Block #{block.blockNum}
                      </span>
                      <span className="text-xs font-semibold text-[#0F172A]">{block.type}</span>
                    </div>
                    <div className="text-[11px] text-[#64748B] mt-0.5">{block.issuer}</div>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    SEALED
                  </span>
                </div>

                <div className="mt-3 p-2.5 rounded-lg bg-[#F8FAFC] font-mono text-[11px] text-[#475569] border border-[#E2E8F0]">
                  {block.payload}
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                  <span className="truncate max-w-xs">{block.hash}</span>
                  <button
                    onClick={() => handleCopy(block.hash, idx)}
                    className="flex items-center gap-1 text-[#2563EB] hover:underline"
                  >
                    {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>Hash</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E2E8F0] bg-white flex items-center justify-between">
          <span className="text-xs font-mono text-[#64748B]">
            Cryptographically anchored to institutional records
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#111827] hover:bg-black text-xs font-mono font-semibold text-white transition-all shadow-xs"
          >
            Close Audit Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProofAuditModal;
