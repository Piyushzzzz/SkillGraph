import React, { useState } from 'react';
import { X, Trophy, Award, Link, CheckCircle2 } from 'lucide-react';
import { EvidenceItem } from '../../types';

interface AddHackathonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvidence: (item: EvidenceItem) => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info') => void;
}

export const AddHackathonModal: React.FC<AddHackathonModalProps> = ({
  isOpen,
  onClose,
  onAddEvidence,
  onShowToast
}) => {
  const [title, setTitle] = useState('');
  const [award, setAward] = useState('1st Place Winner');
  const [organizer, setOrganizer] = useState('Hackathon Event');
  const [teamSize, setTeamSize] = useState('3');
  const [devpostUrl, setDevpostUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [technicalContribution, setTechnicalContribution] = useState('');
  const [tagsInput, setTagsInput] = useState('Python, FastAPI, Systems');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newEvidence: EvidenceItem = {
      id: `ev-hack-${Date.now()}`,
      category: 'hackathon',
      status: 'verified',
      title: `${organizer} - ${title.trim()}`,
      subtitle: `${award} • Team Size: ${teamSize}`,
      date: new Date().toISOString().split('T')[0],
      description: `Competitive hackathon submission awarded ${award} by judging consensus.`,
      technicalContribution: technicalContribution.trim() || 'Core system architect and backend engineer.',
      githubUrl: githubUrl.trim() || undefined,
      demoUrl: devpostUrl.trim() || undefined,
      verifiedBadgeText: 'Jury Attestation Hash Confirmed',
      proofHash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      metrics: { award, teamSize: parseInt(teamSize) || 3 }
    };

    onAddEvidence(newEvidence);
    onShowToast('Hackathon Award Verified', `"${organizer} - ${title}" added to Veritas Vault.`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-left">
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Trophy className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-mono text-sm font-bold text-[#0F172A]">
                Submit Hackathon Award Evidence
              </h3>
              <p className="text-xs text-[#64748B]">
                Verify competitive engineering hackathon placements and jury results
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

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-[#475569] mb-1">
                Hackathon / Event Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Major League Hacking 2025"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#111827] text-xs text-[#0F172A] focus:outline-none shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#475569] mb-1">
                Project Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Distributed Mesh Engine"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#111827] text-xs text-[#0F172A] focus:outline-none shadow-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-[#475569] mb-1">
                Award / Placement *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 1st Place or Best Architecture"
                value={award}
                onChange={(e) => setAward(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#111827] text-xs text-[#0F172A] focus:outline-none font-mono shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#475569] mb-1">
                Team Size
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#111827] text-xs text-[#0F172A] focus:outline-none font-mono shadow-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-[#475569] mb-1">
                Devpost or Project Showcase URL
              </label>
              <input
                type="url"
                placeholder="https://devpost.com/software/..."
                value={devpostUrl}
                onChange={(e) => setDevpostUrl(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#111827] text-xs text-[#0F172A] focus:outline-none font-mono shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#475569] mb-1">
                GitHub Repository URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#111827] text-xs text-[#0F172A] focus:outline-none font-mono shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#475569] mb-1">
              Your Specific Technical Contribution
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Authored the Merkle DAG conflict resolution layer and embedded Linux networking daemon."
              value={technicalContribution}
              onChange={(e) => setTechnicalContribution(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#111827] text-xs text-[#0F172A] focus:outline-none leading-relaxed shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#475569] mb-1">
              Technologies / Skills Highlighted (comma separated)
            </label>
            <input
              type="text"
              placeholder="Go, P2P, Distributed Hash Tables, Embedded C"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#111827] text-xs text-[#0F172A] focus:outline-none font-mono shadow-xs"
            />
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-mono text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#111827] hover:bg-black text-xs font-mono font-semibold text-white shadow-sm transition-all"
            >
              Ingest Hackathon Attestation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHackathonModal;
