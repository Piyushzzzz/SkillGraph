import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  GitBranch,
  FolderCode,
  GraduationCap,
  Trophy,
  Award,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Cpu,
  Layers,
  Terminal,
  Database,
  Lock,
  Box,
  BrainCircuit,
  Compass
} from 'lucide-react';

interface SkillNode {
  id: string;
  name: string;
  category: string;
  status: 'Mastery' | 'Strong' | 'Developing';
  accent: 'blue' | 'cyan' | 'green' | 'amber' | 'indigo';
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  z: number; // depth translation in px
  icon: React.ElementType;
  connections: string[];
}

export const Hero3DVisual: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeNode, setActiveNode] = useState<string | null>('python');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
    setHoveredNode(null);
  };

  // 10 Interactive Skill Nodes matching user specifications
  const nodes: SkillNode[] = [
    {
      id: 'python',
      name: 'Python',
      category: 'Core Runtime',
      status: 'Mastery',
      accent: 'blue',
      x: 34,
      y: 28,
      z: 35,
      icon: Terminal,
      connections: ['fastapi', 'aiml', 'sql']
    },
    {
      id: 'backend',
      name: 'Backend',
      category: 'Distributed Arch',
      status: 'Strong',
      accent: 'blue',
      x: 52,
      y: 54,
      z: 30,
      icon: Layers,
      connections: ['docker', 'cybersecurity']
    },
    {
      id: 'fastapi',
      name: 'FastAPI',
      category: 'REST Services',
      status: 'Strong',
      accent: 'cyan',
      x: 20,
      y: 46,
      z: 25,
      icon: Cpu,
      connections: ['backend']
    },
    {
      id: 'sql',
      name: 'SQL',
      category: 'PostgreSQL',
      status: 'Mastery',
      accent: 'blue',
      x: 48,
      y: 22,
      z: 20,
      icon: Database,
      connections: ['backend']
    },
    {
      id: 'github',
      name: 'GitHub',
      category: '12 Repositories',
      status: 'Strong',
      accent: 'green',
      x: 16,
      y: 72,
      z: 40,
      icon: GitBranch,
      connections: ['projects', 'fastapi']
    },
    {
      id: 'docker',
      name: 'Docker',
      category: 'Containers / K8s',
      status: 'Developing',
      accent: 'amber',
      x: 74,
      y: 38,
      z: 30,
      icon: Box,
      connections: ['cybersecurity']
    },
    {
      id: 'aiml',
      name: 'AI/ML',
      category: 'Vector Embeddings',
      status: 'Strong',
      accent: 'indigo',
      x: 62,
      y: 18,
      z: 28,
      icon: BrainCircuit,
      connections: ['backend', 'docker']
    },
    {
      id: 'cybersecurity',
      name: 'Cybersecurity',
      category: 'RBAC / TLS Guard',
      status: 'Strong',
      accent: 'green',
      x: 82,
      y: 62,
      z: 32,
      icon: Lock,
      connections: []
    },
    {
      id: 'projects',
      name: 'Projects',
      category: 'MediSync & SkillGraph',
      status: 'Mastery',
      accent: 'cyan',
      x: 36,
      y: 78,
      z: 42,
      icon: FolderCode,
      connections: ['backend']
    },
    {
      id: 'academics',
      name: 'Academics',
      category: 'Stanford CS106B (A+)',
      status: 'Mastery',
      accent: 'blue',
      x: 18,
      y: 18,
      z: 22,
      icon: GraduationCap,
      connections: ['python', 'sql']
    }
  ];

  // Calculated 3D Rotation from mouse parallax
  const rotateX = isMobile ? 0 : -mousePos.y * 7;
  const rotateY = isMobile ? 0 : mousePos.x * 9;

  // Selected or hovered node determines highlighted connections
  const focusedNodeId = hoveredNode || activeNode;
  const focusedNode = nodes.find((n) => n.id === focusedNodeId);
  const connectedNodeIds = new Set<string>();

  if (focusedNode) {
    connectedNodeIds.add(focusedNode.id);
    focusedNode.connections.forEach((id) => connectedNodeIds.add(id));
    nodes.forEach((n) => {
      if (n.connections.includes(focusedNode.id)) {
        connectedNodeIds.add(n.id);
      }
    });
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[520px] lg:h-[580px] select-none perspective-1000 flex items-center justify-center overflow-visible"
    >
      {/* Subtle Radial Blue & Cyan Ambient Glow in Hero Center */}
      <div
        className="absolute w-[440px] h-[440px] rounded-full pointer-events-none -z-10 blur-3xl opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, rgba(34, 211, 238, 0.08) 45%, transparent 75%)'
        }}
      />

      {/* 3D Parallax World */}
      <div
        className="relative w-full h-full preserve-3d transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
        }}
      >
        {/* Subtle Ambient Background Grid Plane */}
        <div
          className="absolute inset-2 sm:inset-4 rounded-3xl border border-[#E2E8F0]/80 bg-white/60 shadow-xs backdrop-blur-xs -z-20 bg-tech-grid"
          style={{ transform: 'translateZ(-40px)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-white/90 via-transparent to-blue-50/40 rounded-3xl" />
        </div>

        {/* ======================================================== */}
        {/* 5 FLOATING EVIDENCE CARDS AROUND GRAPH (Requirement 4)   */}
        {/* ======================================================== */}

        {/* 1. GitHub Verified Card (Top-Left) */}
        <div
          className="absolute top-2 left-2 sm:top-4 sm:left-4 z-20 px-3.5 py-2.5 rounded-xl bg-white/95 border border-[#E2E8F0] shadow-md backdrop-blur-md animate-float-card-1 transition-all duration-300 hover:border-emerald-300 hover:shadow-glow-green"
          style={{
            transform: `translateZ(${isMobile ? 0 : 50}px)`,
            minWidth: '150px'
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-mono font-bold text-[#0F172A]">GitHub</span>
          </div>
          <div className="text-[11px] font-mono text-[#475569]">12 repositories</div>
          <div className="text-[10px] font-mono text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-live-pulse" />
            Verified
          </div>
        </div>

        {/* 2. Project Evidence Card (Top-Right) */}
        <div
          className="absolute top-4 right-2 sm:top-6 sm:right-6 z-20 px-3.5 py-2.5 rounded-xl bg-white/95 border border-[#E2E8F0] shadow-md backdrop-blur-md animate-float-card-2 transition-all duration-300 hover:border-blue-300 hover:shadow-glow-blue"
          style={{
            transform: `translateZ(${isMobile ? 0 : 60}px)`,
            minWidth: '160px'
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB]">
              <FolderCode className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-mono font-bold text-[#0F172A]">Project Evidence</span>
          </div>
          <div className="text-[11px] font-mono text-[#475569]">4 Production Apps</div>
          <div className="text-[10px] font-mono text-blue-700 font-semibold flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-3 h-3 text-blue-600" />
            Verified
          </div>
        </div>

        {/* 3. Academic Evidence Card (Bottom-Left) */}
        <div
          className="absolute bottom-6 left-3 sm:bottom-8 sm:left-8 z-20 px-3.5 py-2.5 rounded-xl bg-white/95 border border-[#E2E8F0] shadow-md backdrop-blur-md animate-float-card-3 transition-all duration-300 hover:border-cyan-300 hover:shadow-glow-cyan"
          style={{
            transform: `translateZ(${isMobile ? 0 : 45}px)`,
            minWidth: '165px'
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-md bg-cyan-50 border border-cyan-200 flex items-center justify-center text-[#0891B2]">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-mono font-bold text-[#0F172A]">Academic Evidence</span>
          </div>
          <div className="text-[11px] font-mono text-[#475569]">Stanford CS106B • A+</div>
          <div className="text-[10px] font-mono text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Registrar Verified
          </div>
        </div>

        {/* 4. Hackathon Card (Bottom-Right) */}
        <div
          className="absolute bottom-4 right-3 sm:bottom-6 sm:right-6 z-20 px-3.5 py-2.5 rounded-xl bg-white/95 border border-[#E2E8F0] shadow-md backdrop-blur-md animate-float-card-1 transition-all duration-300 hover:border-amber-300 hover:shadow-glow-amber"
          style={{
            transform: `translateZ(${isMobile ? 0 : 55}px)`,
            minWidth: '150px'
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-md bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Trophy className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-mono font-bold text-[#0F172A]">Hackathon</span>
          </div>
          <div className="text-[11px] font-mono text-[#475569]">CalHacks Finalist</div>
          <div className="text-[10px] font-mono text-amber-700 font-semibold flex items-center gap-1 mt-0.5">
            <Sparkles className="w-3 h-3 text-amber-600" />
            Production Award
          </div>
        </div>

        {/* 5. Certificate Verified Card (Center-Right Floating) */}
        <div
          className="absolute top-1/2 -translate-y-1/2 right-1 sm:right-2 z-20 px-3 py-2 rounded-xl bg-white/95 border border-[#E2E8F0] shadow-md backdrop-blur-md animate-float-card-2 transition-all duration-300 hidden md:block hover:border-indigo-300"
          style={{
            transform: `translateZ(${isMobile ? 0 : 40}px)`,
            minWidth: '145px'
          }}
        >
          <div className="flex items-center gap-1.5 mb-0.5">
            <Award className="w-3.5 h-3.5 text-[#4F46E5]" />
            <span className="text-xs font-mono font-bold text-[#0F172A]">Certificate</span>
          </div>
          <div className="text-[10px] font-mono text-[#475569]">AWS SA-Associate</div>
          <div className="text-[10px] font-mono text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Verified
          </div>
        </div>

        {/* ======================================================== */}
        {/* SVG ANIMATED FLOWING CONNECTIONS WITH MOVING PARTICLES    */}
        {/* ======================================================== */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ transform: 'translateZ(10px)' }}
        >
          <defs>
            <linearGradient id="edgeGradDefault" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#94A3B8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.25" />
            </linearGradient>
            <linearGradient id="edgeGradActive" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#0891B2" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {nodes.map((node) =>
            node.connections.map((targetId) => {
              const targetNode = nodes.find((n) => n.id === targetId);
              if (!targetNode) return null;

              const isEdgeFocused =
                (focusedNodeId === node.id && targetNode.id === focusedNodeId) ||
                (focusedNodeId === node.id || focusedNodeId === targetId);

              return (
                <g key={`${node.id}-${targetId}`}>
                  {/* Background connection line */}
                  <line
                    x1={`${node.x}%`}
                    y1={`${node.y}%`}
                    x2={`${targetNode.x}%`}
                    y2={`${targetNode.y}%`}
                    stroke={isEdgeFocused ? 'url(#edgeGradActive)' : 'url(#edgeGradDefault)'}
                    strokeWidth={isEdgeFocused ? 2.5 : 1.25}
                    className="transition-all duration-300"
                  />

                  {/* Flowing animated particle dashes along the line */}
                  {isEdgeFocused && (
                    <line
                      x1={`${node.x}%`}
                      y1={`${node.y}%`}
                      x2={`${targetNode.x}%`}
                      y2={`${targetNode.y}%`}
                      stroke="#22D3EE"
                      strokeWidth={2}
                      strokeDasharray="6 14"
                      className="animate-dash-flow opacity-80"
                    />
                  )}
                </g>
              );
            })
          )}
        </svg>

        {/* ======================================================== */}
        {/* 10 INTERACTIVE FLOATING SKILL NODES (Requirement 2)      */}
        {/* ======================================================== */}
        {nodes.map((node) => {
          const isSelected = activeNode === node.id;
          const isHovered = hoveredNode === node.id;
          const isConnected = connectedNodeIds.has(node.id);
          const isDimmed = focusedNodeId && !isConnected && !isSelected;

          const NodeIcon = node.icon;

          // Border & Glow styling per accent
          let borderAccentClass = 'border-[#E2E8F0]';
          let glowClass = '';
          let badgeBg = 'bg-blue-50 text-blue-700 border-blue-200';

          if (node.accent === 'blue') {
            borderAccentClass = isSelected ? 'border-[#2563EB] ring-2 ring-blue-500/20' : 'hover:border-blue-400';
            glowClass = isSelected ? 'shadow-glow-blue' : '';
            badgeBg = 'bg-blue-50 text-blue-700 border-blue-200';
          } else if (node.accent === 'cyan') {
            borderAccentClass = isSelected ? 'border-[#0891B2] ring-2 ring-cyan-500/20' : 'hover:border-cyan-400';
            glowClass = isSelected ? 'shadow-glow-cyan' : '';
            badgeBg = 'bg-cyan-50 text-cyan-800 border-cyan-200';
          } else if (node.accent === 'green') {
            borderAccentClass = isSelected ? 'border-[#16A34A] ring-2 ring-emerald-500/20' : 'hover:border-emerald-400';
            glowClass = isSelected ? 'shadow-glow-green' : '';
            badgeBg = 'bg-emerald-50 text-emerald-800 border-emerald-200';
          } else if (node.accent === 'amber') {
            borderAccentClass = isSelected ? 'border-[#D97706] ring-2 ring-amber-500/20' : 'hover:border-amber-400';
            glowClass = isSelected ? 'shadow-glow-amber' : '';
            badgeBg = 'bg-amber-50 text-amber-800 border-amber-200';
          } else if (node.accent === 'indigo') {
            borderAccentClass = isSelected ? 'border-[#4F46E5] ring-2 ring-indigo-500/20' : 'hover:border-indigo-400';
            glowClass = isSelected ? 'shadow-glow-blue' : '';
            badgeBg = 'bg-indigo-50 text-indigo-800 border-indigo-200';
          }

          return (
            <div
              key={node.id}
              onClick={() => setActiveNode(node.id)}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className={`absolute cursor-pointer transition-all duration-300 ${
                isDimmed ? 'opacity-40 scale-95' : 'opacity-100'
              }`}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: `translate(-50%, -50%) translateZ(${
                  isMobile ? 0 : node.z + (isSelected || isHovered ? 25 : 0)
                }px) scale(${isSelected || isHovered ? 1.08 : 1})`
              }}
            >
              <div
                className={`relative px-3.5 py-2 rounded-xl bg-white border ${borderAccentClass} ${glowClass} shadow-md backdrop-blur-md transition-all duration-200`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center shrink-0">
                    <NodeIcon className="w-3.5 h-3.5 text-[#0F172A]" />
                  </div>
                  <span className="text-xs font-mono font-bold text-[#0F172A] whitespace-nowrap">
                    {node.name}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2.5 mt-1">
                  <span className="text-[10px] font-mono text-[#64748B] truncate max-w-[90px]">
                    {node.category}
                  </span>
                  <span
                    className={`text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded border ${badgeBg}`}
                  >
                    {node.status}
                  </span>
                </div>

                {isSelected && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-[#2563EB] rounded-full animate-pulse" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Hero3DVisual;
