import React, { useState } from 'react';
import { EvidenceItem, EvidenceCategory, EvidenceStatus } from '../../types';
import {
  Database,
  Search,
  Filter,
  Plus,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  GitBranch,
  GraduationCap,
  Trophy,
  Award,
  Trash2,
  Lock,
  Copy,
  Check
} from 'lucide-react';

interface EvidenceVaultProps {
  evidenceItems: EvidenceItem[];
  onOpenAddProject: () => void;
  onOpenAddHackathon: () => void;
  onDeleteEvidence: (id: string) => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info') => void;
}

export const EvidenceVault: React.FC<EvidenceVaultProps> = ({
  evidenceItems,
  onOpenAddProject,
  onOpenAddHackathon,
  onDeleteEvidence,
  onShowToast
}) => {
  const [selectedCategory, setSelectedCategory] = useState<EvidenceCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<EvidenceStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const categories: Array<{ id: EvidenceCategory | 'all'; label: string; count: number }> = [
    { id: 'all', label: 'All Evidence', count: evidenceItems.length },
    { id: 'academic', label: 'Academic', count: evidenceItems.filter((e) => e.category === 'academic').length },
    { id: 'github', label: 'GitHub', count: evidenceItems.filter((e) => e.category === 'github').length },
    { id: 'project', label: 'Project', count: evidenceItems.filter((e) => e.category === 'project').length },
    { id: 'hackathon', label: 'Hackathon', count: evidenceItems.filter((e) => e.category === 'hackathon').length },
    { id: 'certificate', label: 'Certificate', count: evidenceItems.filter((e) => e.category === 'certificate').length }
  ];

  const filteredItems = evidenceItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    onShowToast('Proof Hash Copied', hash, 'success');
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const getCategoryIcon = (category: EvidenceCategory) => {
    switch (category) {
      case 'academic':
        return <GraduationCap className="w-4 h-4 text-[#2563EB]" />;
      case 'github':
        return <GitBranch className="w-4 h-4 text-[#0F172A]" />;
      case 'project':
        return <Database className="w-4 h-4 text-emerald-600" />;
      case 'hackathon':
        return <Trophy className="w-4 h-4 text-amber-600" />;
      case 'certificate':
        return <Award className="w-4 h-4 text-blue-600" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-[#2563EB]" />;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto text-left">
      {/* 1. Command Bar & Hero Header */}
      <section className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 card-hover-3d">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
              VERITAS PROTOCOL v2.4
            </span>
            <span className="text-xs font-mono text-[#64748B]">
              Immutable Records: {evidenceItems.length}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-mono text-[#0F172A]">
            Evidence Vault & Attestations
          </h1>
          <p className="text-xs text-[#475569]">
            Tamper-proof verifiable portfolio grounded in institutional transcripts, code signatures, and awards.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={onOpenAddProject}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#111827] hover:bg-black text-xs font-mono font-semibold text-white shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project Evidence</span>
          </button>
          <button
            onClick={onOpenAddHackathon}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono font-semibold text-[#0F172A] transition-all shadow-xs"
          >
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>Add Hackathon Award</span>
          </button>
        </div>
      </section>

      {/* 2. Filter Tabs & Search Bar */}
      <section className="space-y-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E2E8F0]">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-[#111827] text-white border border-[#111827] shadow-xs'
                  : 'text-[#475569] hover:text-[#0F172A] hover:bg-white border border-transparent'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full border ${
                  selectedCategory === cat.id
                    ? 'bg-slate-800 text-white border-slate-700'
                    : 'bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search and Status Dropdown */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search evidence by skill, repo, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#111827] text-xs text-[#0F172A] focus:outline-none placeholder-[#94A3B8] shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-mono text-[#64748B]">Status:</span>
            {(['all', 'verified', 'autosync'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-colors ${
                  statusFilter === st
                    ? 'bg-[#111827] text-white border border-[#111827]'
                    : 'bg-white text-[#475569] border border-[#E2E8F0] hover:text-[#0F172A]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Evidence Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all flex flex-col justify-between space-y-4 shadow-sm text-left card-hover-3d"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#64748B]">
                      {item.category} • {item.date}
                    </span>
                    <h3 className="text-sm font-bold font-mono text-[#0F172A] leading-snug">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    VERIFIED
                  </span>
                  <button
                    onClick={() => onDeleteEvidence(item.id)}
                    title="Remove Evidence"
                    className="p-1 rounded text-[#94A3B8] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {item.subtitle && (
                <div className="text-xs text-[#2563EB] mt-2 font-mono font-medium">{item.subtitle}</div>
              )}

              <p className="text-xs text-[#475569] mt-2 leading-relaxed">{item.description}</p>

              {/* Specific Technical Contribution Box */}
              {item.technicalContribution && (
                <div className="mt-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <div className="text-[10px] font-mono uppercase text-emerald-700 font-semibold">
                    Specific Technical Contribution
                  </div>
                  <p className="text-[11px] text-[#0F172A] leading-relaxed">
                    {item.technicalContribution}
                  </p>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {item.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Footer: Badges, Proof Hash, Links */}
            <div className="pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#64748B]">{item.verifiedBadgeText}</span>
              </div>

              <div className="flex items-center gap-2">
                {item.proofHash && (
                  <button
                    onClick={() => handleCopyHash(item.proofHash!)}
                    className="flex items-center gap-1 text-[10px] text-[#2563EB] hover:underline font-mono"
                    title={item.proofHash}
                  >
                    <Lock className="w-3 h-3" />
                    <span>{item.proofHash.substring(0, 8)}...</span>
                    {copiedHash === item.proofHash ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3 text-[#64748B]" />
                    )}
                  </button>
                )}

                {item.githubUrl && (
                  <a
                    href={item.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[#0F172A] hover:underline font-semibold"
                  >
                    <GitBranch className="w-3 h-3" />
                    <span>Repo</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}

                {item.demoUrl && (
                  <a
                    href={item.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-emerald-700 hover:underline font-semibold"
                  >
                    <span>Live</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 4. Verification Ledger Digest Card */}
      <section className="p-6 rounded-2xl bg-white border border-[#E2E8F0] space-y-3 shadow-sm card-hover-3d">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-mono text-sm font-bold text-[#0F172A]">
              Veritas Global Consensus Digest
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-700 font-semibold">100% Synced</span>
        </div>
        <p className="text-xs text-[#475569] leading-relaxed">
          All evidence records are hashed into a Merkle DAG anchored with institutional Registrar keys and Git commit signing identities. Zero self-attested claims without artifact backing.
        </p>
        <div className="h-2 w-full rounded-full bg-[#F1F5F9] overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#111827] via-[#2563EB] to-[#16A34A] w-full" />
        </div>
      </section>
    </div>
  );
};

export default EvidenceVault;
