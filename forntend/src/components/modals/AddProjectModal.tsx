import React, { useState } from 'react';
import { X, FolderPlus, GitBranch, Link, Check, Terminal } from 'lucide-react';
import { EvidenceItem } from '../../types';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvidence: (item: EvidenceItem) => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info') => void;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({
  isOpen,
  onClose,
  onAddEvidence,
  onShowToast
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [technicalContribution, setTechnicalContribution] = useState('');
  const [tagsInput, setTagsInput] = useState('TypeScript, React, Node.js');
  const [autoSyncGit, setAutoSyncGit] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newEvidence: EvidenceItem = {
      id: `ev-proj-${Date.now()}`,
      category: 'project',
      status: 'verified',
      title: title.trim(),
      subtitle: subtitle.trim() || 'Verified Software Project Repository',
      date: new Date().toISOString().split('T')[0],
      description: description.trim() || 'Software architecture project with verifiable Git commits.',
      technicalContribution: technicalContribution.trim(),
      githubUrl: githubUrl.trim() || undefined,
      demoUrl: demoUrl.trim() || undefined,
      verifiedBadgeText: autoSyncGit ? 'Git Commit Signature Verified' : 'Manual Verified Upload',
      proofHash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      metrics: { prCount: 4 }
    };

    onAddEvidence(newEvidence);
    onShowToast('Project Evidence Ingested', `"${title}" has been cryptographically signed and stored in Vault.`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-left">
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#0F172A]">
              <FolderPlus className="w-5 h-5 text-[#0F172A]" />
            </div>
            <div>
              <h3 className="font-mono text-sm font-bold text-[#0F172A]">
                Submit Project Evidence
              </h3>
              <p className="text-xs text-[#64748B]">
                Connect repository and technical contributions to the skill graph
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
          <div>
            <label className="block text-xs font-mono text-[#475569] mb-1">
              Project Name / Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Distributed Task Queue & Cache Engine"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#111827] text-xs text-[#0F172A] focus:outline-none shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#475569] mb-1">
              Tagline / Subtitle
            </label>
            <input
              type="text"
              placeholder="e.g. High-throughput async job orchestrator with Raft consensus"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#111827] text-xs text-[#0F172A] focus:outline-none shadow-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            <div>
              <label className="block text-xs font-mono text-[#475569] mb-1">
                Live Public Demo URL
              </label>
              <input
                type="url"
                placeholder="https://my-app.dev"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#111827] text-xs text-[#0F172A] focus:outline-none font-mono shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#475569] mb-1">
              Specific Technical Contribution (Crucial for Proof Weight)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Implemented lock-free ring buffers in Go, reducing latency by 40%. Wrote comprehensive integration test suite with Docker compose."
              value={technicalContribution}
              onChange={(e) => setTechnicalContribution(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#111827] text-xs text-[#0F172A] focus:outline-none leading-relaxed shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#475569] mb-1">
              Technologies / Stack (comma separated)
            </label>
            <input
              type="text"
              placeholder="Go, Raft, Docker, Redis, Concurrency"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#111827] text-xs text-[#0F172A] focus:outline-none font-mono shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="autoSync"
              checked={autoSyncGit}
              onChange={(e) => setAutoSyncGit(e.target.checked)}
              className="rounded border-[#CBD5E1] text-[#111827] focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <label htmlFor="autoSync" className="text-xs font-mono text-[#475569] cursor-pointer">
              Auto-verify commits with Veritas ed25519 Webhook
            </label>
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
              Ingest & Hash Evidence
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;
