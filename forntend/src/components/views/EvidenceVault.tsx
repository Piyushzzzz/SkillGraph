import React, { useState } from 'react';
import { EvidenceItem, EvidenceCategory } from '../../types';
import {
  FolderPlus,
  Trophy,
  GitBranch,
  ExternalLink,
  Search,
  CheckCircle2,
  Trash2,
  Plus
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
  onDeleteEvidence
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Records', count: evidenceItems.length },
    { id: 'project', label: 'Projects & Repos', count: evidenceItems.filter((e) => e.category === 'project' || e.category === 'github').length },
    { id: 'academic', label: 'Coursework', count: evidenceItems.filter((e) => e.category === 'academic').length },
    { id: 'hackathon', label: 'Hackathons', count: evidenceItems.filter((e) => e.category === 'hackathon').length }
  ];

  const filteredItems = evidenceItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      item.category === selectedCategory ||
      (selectedCategory === 'project' && item.category === 'github');

    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tags && item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-8 px-4 sm:px-8 max-w-6xl mx-auto text-left space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Projects & Work Evidence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Linked GitHub repositories, academic coursework, and hackathon awards.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={onOpenAddProject}
            className="px-3.5 py-2 text-xs font-semibold saas-btn-primary flex items-center gap-1.5"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
          <button
            onClick={onOpenAddHackathon}
            className="px-3.5 py-2 text-xs font-semibold saas-btn-secondary flex items-center gap-1.5"
          >
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>Add Hackathon</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects or tags..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-2xs"
          />
        </div>
      </div>

      {/* Evidence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="saas-card p-6 bg-white border border-slate-200 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="text-xs text-slate-500 font-medium">{item.subtitle}</p>
                  )}
                </div>
                <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Verified
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {item.description}
              </p>

              {item.technicalContribution && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 leading-relaxed">
                  <strong className="text-slate-800 font-semibold block mb-0.5">Key Contribution:</strong>
                  {item.technicalContribution}
                </div>
              )}
            </div>

            {/* Tags & Action Footer */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>{item.date}</span>
                <div className="flex items-center gap-2">
                  {item.githubUrl && (
                    <a
                      href={item.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      <GitBranch className="w-3.5 h-3.5" />
                      <span>View GitHub</span>
                    </a>
                  )}
                  <button
                    onClick={() => onDeleteEvidence(item.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EvidenceVault;
