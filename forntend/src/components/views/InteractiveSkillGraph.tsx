import React, { useState } from 'react';
import { SkillNodeData, ViewPath } from '../../types';
import { skillEdges } from '../../data/mockData';
import {
  Network,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  GitBranch,
  GraduationCap,
  Sparkles,
  X,
  Lock,
  ChevronRight,
  Layers,
  ArrowRight,
  Check,
  Plus
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
  onOpenAddProject,
  onShowToast
}) => {
  // Empty State if no nodes
  if (!nodes || nodes.length === 0) {
    return (
      <div className="p-6 sm:p-12 max-w-4xl mx-auto text-left">
        <EmptyState
          title="Your SkillGraph is waiting to be built."
          description="Add academic, project or achievement evidence to start building your skill graph."
          icon={Network}
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

  const [selectedNode, setSelectedNode] = useState<SkillNodeData>(nodes[0]);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<'all' | 'academic' | 'github' | 'hackathon'>('all');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedMap, setVerifiedMap] = useState<Record<string, boolean>>({});

  const filteredNodes = nodes.filter((node) => {
    if (filterCategory === 'all') return true;
    return node.category === filterCategory;
  });

  const activeFocusId = hoveredNodeId || selectedNode?.id;

  const handleVerifyRepo = (nodeId: string) => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedMap((prev) => ({ ...prev, [nodeId]: true }));
      onShowToast('Cryptographic Signature Re-Verified', `Artifact hash matches Veritas Merkle root.`, 'success');
    }, 800);
  };

  const getNodeStateStyle = (node: SkillNodeData, isSelected: boolean) => {
    const status = node.status;
    if (status === 'MASTERY') {
      return {
        card: isSelected
          ? 'bg-white border-2 border-[#0891B2] shadow-glow-cyan ring-4 ring-cyan-100'
          : 'bg-white border border-cyan-300 hover:border-cyan-500 shadow-2xs hover:shadow-glow-cyan',
        dot: 'bg-[#0891B2] animate-live-pulse',
        badge: 'bg-cyan-50 text-cyan-800 border-cyan-200',
        text: 'text-cyan-950'
      };
    }
    if (status === 'GAP') {
      return {
        card: isSelected
          ? 'bg-white border-2 border-dashed border-red-500 shadow-lg ring-4 ring-red-100'
          : 'bg-white border-2 border-dashed border-red-300 hover:border-red-500 shadow-2xs',
        dot: 'bg-red-500 animate-ping',
        badge: 'bg-red-50 text-red-700 border-red-200',
        text: 'text-red-950'
      };
    }
    if (status === 'DEVELOPING') {
      return {
        card: isSelected
          ? 'bg-white border-2 border-amber-500 shadow-lg ring-4 ring-amber-100'
          : 'bg-white border border-amber-300 hover:border-amber-500 shadow-2xs',
        dot: 'bg-amber-500',
        badge: 'bg-amber-50 text-amber-800 border-amber-200',
        text: 'text-amber-950'
      };
    }
    // VERIFIED / PROFICIENT (green / teal)
    return {
      card: isSelected
        ? 'bg-white border-2 border-emerald-500 shadow-glow-blue ring-4 ring-emerald-100'
        : 'bg-white border border-emerald-300 hover:border-emerald-500 shadow-2xs',
      dot: 'bg-emerald-500',
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      text: 'text-emerald-950'
    };
  };

  return (
    <div className="relative h-[calc(100vh-4rem)] flex flex-col lg:flex-row overflow-hidden bg-[#F8FAFC] text-left">
      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top HUD Controls */}
        <div className="p-4 border-b border-[#E2E8F0] bg-white/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 z-20 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#111827] to-[#1E293B] flex items-center justify-center text-white shadow-xs">
              <Network className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-mono font-bold text-[#0F172A]">
                  Knowledge Topology & Evidence DAG
                </h1>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-live-pulse" />
              </div>
              <p className="text-[11px] text-[#64748B]">
                Interactive capability graph grounded in real academic and project artifacts
              </p>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0]">
            {(['all', 'academic', 'github', 'hackathon'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-mono capitalize transition-all ${
                  filterCategory === cat
                    ? 'bg-[#111827] text-white font-semibold shadow-xs'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Zoom and Reset Controls */}
          <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0]">
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
              className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.1))}
              className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-white transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {nodes.filter((n) => n.status === 'VERIFIED' || n.status === 'MASTERY').length === 0 && (
          <div className="mx-4 mt-3 p-3 rounded-xl bg-slate-100/95 border border-slate-200 text-xs flex items-center justify-between gap-4 text-slate-700 shadow-2xs z-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              <span className="font-mono text-[11px]">
                <strong>Clean Slate (0 Verified Skills):</strong> Showing baseline curriculum taxonomy. Deposit code or transcript evidence to unlock verified competency nodes.
              </span>
            </div>
            <button
              onClick={() => onNavigate('/evidence')}
              className="px-3 py-1 rounded-lg bg-[#111827] text-white font-mono text-[11px] font-semibold hover:bg-black shrink-0 transition-all shadow-xs"
            >
              + Deposit Evidence
            </button>
          </div>
        )}

        {/* SVG Interactive Canvas Stage with Animated Tech Grid */}
        <div className="flex-1 relative overflow-auto bg-tech-grid flex items-center justify-center p-8 bg-[#F8FAFC]">
          {/* Subtle Ambient Pulse Light */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none" />

          <div
            className="transition-transform duration-200 origin-center relative w-[800px] h-[520px]"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <svg className="w-full h-full absolute inset-0 pointer-events-none">
              <defs>
                <linearGradient id="edgeDefaultGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#94A3B8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="edgeActiveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#0891B2" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.9" />
                </linearGradient>
                <marker
                  id="arrow-active"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#2563EB" />
                </marker>
                <marker
                  id="arrow-default"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#CBD5E1" />
                </marker>
              </defs>

              {/* Render edges with dynamic brightening / dimming */}
              {skillEdges.map((edge, i) => {
                const source = nodes.find((n) => n.id === edge.from);
                const target = nodes.find((n) => n.id === edge.to);
                if (!source || !target) return null;

                const isConnected =
                  activeFocusId === source.id || activeFocusId === target.id;
                const hasActiveFocus = Boolean(activeFocusId);

                return (
                  <g key={i}>
                    <path
                      d={`M ${source.x} ${source.y} Q ${(source.x + target.x) / 2} ${
                        (source.y + target.y) / 2 - 20
                      } ${target.x} ${target.y}`}
                      fill="none"
                      stroke={isConnected ? 'url(#edgeActiveGrad)' : 'url(#edgeDefaultGrad)'}
                      strokeWidth={isConnected ? 3 : 1.5}
                      strokeDasharray={isConnected ? '6 3' : 'none'}
                      className={isConnected ? 'animate-dash-flow' : ''}
                      opacity={isConnected ? 1 : hasActiveFocus ? 0.2 : 0.6}
                      markerEnd={isConnected ? 'url(#arrow-active)' : 'url(#arrow-default)'}
                      style={{ transition: 'opacity 0.3s, stroke-width 0.3s' }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Nodes on Canvas with state-based visuals */}
            {filteredNodes.map((node) => {
              const isSelected = selectedNode.id === node.id;
              const isHovered = hoveredNodeId === node.id;
              const isConnectedToFocus =
                activeFocusId &&
                skillEdges.some(
                  (e) =>
                    (e.from === activeFocusId && e.to === node.id) ||
                    (e.to === activeFocusId && e.from === node.id)
                );
              const isDimmed = activeFocusId && !isSelected && !isHovered && !isConnectedToFocus;
              const style = getNodeStateStyle(node, isSelected);

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  style={{
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    transform: 'translate(-50%, -50%)',
                    opacity: isDimmed ? 0.35 : 1
                  }}
                  className={`absolute cursor-pointer select-none group transition-all duration-300 ${
                    isSelected ? 'scale-110 z-30' : isHovered ? 'scale-105 z-20' : 'z-10'
                  }`}
                >
                  <div
                    className={`relative p-3 rounded-2xl flex flex-col items-center gap-1.5 transition-all ${style.card}`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                      <span className={`font-mono text-xs font-bold ${style.text}`}>
                        {node.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full border font-semibold ${style.badge}`}
                      >
                        {node.status}
                      </span>
                      <span className="text-[9px] font-mono text-[#64748B] bg-[#F1F5F9] px-1 py-0.5 rounded">
                        {node.tag}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Topology Legend with 4 explicit states */}
            <div className="absolute bottom-4 left-4 p-3.5 rounded-xl bg-white/95 border border-[#E2E8F0] text-[10px] font-mono text-[#475569] space-y-1.5 shadow-sm backdrop-blur-md">
              <div className="font-bold text-[#0F172A] mb-1">NODE STATES</div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0891B2] shadow-glow-cyan" />
                <span>Mastery (High Impact / Cyan Glow)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Verified Skill (Course / Project Proven)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Developing Skill (In Progress)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span>Skill Gap (Target Role Prerequisite)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Drawer: Node Inspector (Slides in smoothly from right) */}
      <div className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-[#E2E8F0] flex flex-col justify-between p-6 overflow-y-auto z-30 shadow-md transition-all">
        <div className="space-y-5">
          {/* Drawer Header */}
          <div className="space-y-1 pb-4 border-b border-[#E2E8F0]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#64748B]">
                NODE INSPECTOR // {selectedNode.hierarchy}
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold ${
                  selectedNode.status === 'MASTERY'
                    ? 'bg-cyan-50 text-cyan-800 border-cyan-200'
                    : selectedNode.status === 'GAP'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : selectedNode.status === 'DEVELOPING'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                {selectedNode.status}
              </span>
            </div>
            <h2 className="text-base font-bold font-mono text-[#0F172A]">{selectedNode.title}</h2>
            <p className="text-xs text-[#475569] leading-relaxed">{selectedNode.desc}</p>
          </div>

          {/* Evidence-Based Competency Status */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#64748B]">Competency Level</span>
              <span
                className={`font-bold ${
                  selectedNode.status === 'MASTERY'
                    ? 'text-cyan-700'
                    : selectedNode.status === 'GAP'
                    ? 'text-red-600'
                    : selectedNode.status === 'DEVELOPING'
                    ? 'text-amber-600'
                    : 'text-emerald-700'
                }`}
              >
                {selectedNode.status === 'MASTERY'
                  ? 'Mastery Level'
                  : selectedNode.status === 'GAP'
                  ? 'Target Gap'
                  : selectedNode.status === 'DEVELOPING'
                  ? 'Developing'
                  : 'Verified Competent'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#475569]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Grounded in verified project & academic evidence</span>
            </div>
          </div>

          {/* Target Role Relevance */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/60 space-y-1.5">
            <div className="text-[10px] font-mono uppercase font-bold text-[#2563EB]">
              Target Role Relevance
            </div>
            <p className="text-xs text-[#1E293B] leading-relaxed">
              {selectedNode.status === 'GAP'
                ? 'High Priority: Critical missing capability for your active target role benchmark.'
                : selectedNode.status === 'DEVELOPING'
                ? 'Moderate Priority: Advancing this competency strengthens your role fit score.'
                : 'Direct Match: This verified competency satisfies key requirements for your target benchmark.'}
            </p>
          </div>

          {/* Evidence Attached (Clickable to /evidence) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-semibold text-[#0F172A]">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Attached Evidence
              </span>
              <button
                onClick={() => onNavigate('/evidence')}
                className="text-[11px] text-[#2563EB] hover:underline"
              >
                Vault →
              </button>
            </div>

            {selectedNode.academic && (
              <div
                onClick={() => onNavigate('/evidence')}
                className="p-3 rounded-xl bg-[#F8FAFC] hover:bg-blue-50/50 border border-[#E2E8F0] hover:border-blue-200 transition-colors cursor-pointer text-xs space-y-0.5"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#2563EB]">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Academic Coursework</span>
                </div>
                <div className="font-semibold text-[#0F172A]">{selectedNode.academic}</div>
              </div>
            )}

            {selectedNode.projects && selectedNode.projects.length > 0 ? (
              selectedNode.projects.map((proj, idx) => (
                <div
                  key={idx}
                  onClick={() => onNavigate('/evidence')}
                  className="p-3 rounded-xl bg-[#F8FAFC] hover:bg-blue-50/50 border border-[#E2E8F0] hover:border-blue-200 transition-colors cursor-pointer text-xs space-y-1"
                >
                  <div className="font-semibold text-[#0F172A] flex items-center justify-between">
                    <span>{proj.name}</span>
                    <ExternalLink className="w-3 h-3 text-[#64748B]" />
                  </div>
                  <div className="text-[11px] text-[#475569]">{proj.detail}</div>
                </div>
              ))
            ) : !selectedNode.academic ? (
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#64748B]">
                No direct evidence attached yet.
              </div>
            ) : null}
          </div>

          {/* Next Recommended Action */}
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/60 space-y-1.5">
            <div className="text-[10px] font-mono uppercase font-bold text-emerald-800">
              Next Recommended Action
            </div>
            <p className="text-xs text-emerald-950">
              {selectedNode.status === 'GAP'
                ? 'Launch the Adaptive Project Mission to generate evidence for this skill.'
                : selectedNode.status === 'DEVELOPING'
                ? 'Push production commits or submit a PR link to advance this node to Mastery.'
                : 'Maintain verified status by connecting new production repositories.'}
            </p>
            <button
              onClick={() => onNavigate(selectedNode.status === 'GAP' ? '/mission' : '/evidence')}
              className="mt-2 text-xs font-mono font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
            >
              <span>{selectedNode.status === 'GAP' ? 'Start Mission' : 'Upload Evidence'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-6 border-t border-[#E2E8F0]">
          <button
            onClick={() => handleVerifyRepo(selectedNode.id)}
            disabled={isVerifying}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#111827] hover:bg-black text-xs font-mono font-semibold text-white shadow-sm transition-all btn-interactive"
          >
            {isVerifying ? (
              <span>Verifying Ledger SHA...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Re-Verify Artifact Hash</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InteractiveSkillGraph;
