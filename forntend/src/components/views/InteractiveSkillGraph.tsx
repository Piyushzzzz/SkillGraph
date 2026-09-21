import React, { useState } from 'react';
import { SkillNodeData, ViewPath } from '../../types';
import {
  CheckCircle2,
  GitBranch,
  ArrowRight,
  Plus,
  Layers,
  Code2,
  Cpu,
  Database,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

interface InteractiveSkillGraphProps {
  nodes: SkillNodeData[];
  onNavigate: (view: ViewPath) => void;
  onOpenAddProject: () => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info') => void;
}

export const InteractiveSkillGraph: React.FC<InteractiveSkillGraphProps> = ({
  nodes,
  onNavigate,
  onOpenAddProject
}) => {
  if (!nodes || nodes.length === 0) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-left">
        <EmptyState
          title="Your skill graph is waiting to be built."
          description="Add academic coursework, GitHub projects, or hackathon wins to see your skill graph."
          icon={Layers}
          actions={[
            {
              label: 'Add Evidence',
              onClick: () => onNavigate('/evidence'),
              variant: 'primary',
              icon: Plus
            }
          ]}
        />
      </div>
    );
  }

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedSkill, setSelectedSkill] = useState<SkillNodeData>(nodes[0]);

  const categories = [
    { id: 'all', label: 'All Skills', count: nodes.length },
    { id: 'github', label: 'Backend & APIs', count: nodes.filter((n) => n.category === 'github').length },
    { id: 'project', label: 'Systems & Cloud', count: nodes.filter((n) => n.category === 'project').length },
    { id: 'academic', label: 'Computer Science Core', count: nodes.filter((n) => n.category === 'academic').length }
  ];

  const filteredNodes = nodes.filter((node) => {
    if (activeCategory === 'all') return true;
    return node.category === activeCategory;
  });

  return (
    <div className="py-8 px-4 sm:px-8 max-w-6xl mx-auto text-left space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Your Verified Skills
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Every skill below is grounded in actual code commits, unit tests, and university transcripts.
          </p>
        </div>

        <button
          onClick={onOpenAddProject}
          className="px-4 py-2 text-xs font-semibold saas-btn-primary flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project / Skill</span>
        </button>
      </div>

      {/* Clean Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
              activeCategory === cat.id
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.label} ({cat.count})
          </button>
        ))}
      </div>

      {/* Skills Grid & Active Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Skill Cards (Left 7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          {filteredNodes.map((node) => {
            const isSelected = selectedSkill.id === node.id;
            return (
              <div
                key={node.id}
                onClick={() => setSelectedSkill(node)}
                className={`saas-card p-5 cursor-pointer transition-all border ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">
                        {node.title}
                      </h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {node.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {node.desc}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-blue-600">
                      {node.confidence}%
                    </span>
                    <span className="block text-[10px] text-slate-400">Mastery</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${node.confidence}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Skill Details Card (Right 5 Cols) */}
        <div className="lg:col-span-5">
          <div className="saas-card p-6 sm:p-7 bg-white border border-slate-200 sticky top-24 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                  Skill Details
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  {selectedSkill.title}
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {selectedSkill.status}
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-700 block">
                Overview & Description
              </span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {selectedSkill.desc}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <span className="text-xs font-semibold text-slate-700 block">
                Verified Through These Projects:
              </span>
              {selectedSkill.projects && selectedSkill.projects.length > 0 ? (
                selectedSkill.projects.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <GitBranch className="w-3.5 h-3.5 text-blue-600" />
                      <span>{p.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {p.detail}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                  Grounded through verified course curriculum and test suites.
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('/gap-analysis')}
                className="w-full py-2.5 px-4 text-xs font-semibold saas-btn-secondary flex items-center justify-center gap-1.5"
              >
                <span>Check Role Match for This Skill</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveSkillGraph;
