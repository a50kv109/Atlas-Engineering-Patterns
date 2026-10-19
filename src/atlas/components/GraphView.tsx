import React, { useState, useMemo, useRef, useEffect } from 'react';
import { AtlasEntity, EntityType, RelationType } from '../types';
import { KnowledgeGraph, GraphNode, GraphEdge, RELATION_RULES } from '../graphEngine';
import {
  Network,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  Filter,
  ArrowRight,
  Info
} from 'lucide-react';

interface GraphViewProps {
  entities: AtlasEntity[];
  initialSelectedId?: string;
  onSelectEntityDetails: (entityId: string) => void;
}

export const GraphView: React.FC<GraphViewProps> = ({
  entities,
  initialSelectedId,
  onSelectEntityDetails
}) => {
  const graph = useMemo(() => new KnowledgeGraph(entities), [entities]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(initialSelectedId || null);
  const [filterType, setFilterType] = useState<EntityType | 'all'>('all');
  const [filterRelation, setFilterRelation] = useState<RelationType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const svgRef = useRef<SVGSVGElement | null>(null);

  const allNodes = useMemo(() => graph.getAllNodes(), [graph]);
  const allEdges = useMemo(() => graph.getAllEdges(), [graph]);

  // Compute 2D node coordinates deterministically in layered radial or column layout
  const nodePositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    const primitives = allNodes.filter(n => n.type === 'primitive');
    const patterns = allNodes.filter(n => n.type === 'pattern');
    const configs = allNodes.filter(n => n.type === 'configuration');
    const impls = allNodes.filter(n => n.type === 'implementation');
    const evidence = allNodes.filter(n => n.type === 'evidence');
    const width = 1100;
    const height = Math.max(820, patterns.length * 52);

    // Column coordinates:
    // Left: Evidence (x = 100)
    evidence.forEach((node, i) => {
      positions[node.id] = {
        x: 120,
        y: 120 + i * (height / (evidence.length + 1))
      };
    });

    // Col 2: Primitives (x = 340)
    primitives.forEach((node, i) => {
      positions[node.id] = {
        x: 360,
        y: 80 + i * (height / (primitives.length + 1))
      };
    });

    // Col 3: Patterns (x = 640)
    patterns.forEach((node, i) => {
      positions[node.id] = {
        x: 650,
        y: 100 + i * (height / (patterns.length + 1))
      };
    });

    // Col 4: Configurations (x = 920)
    configs.forEach((node, i) => {
      positions[node.id] = {
        x: 930,
        y: 140 + i * (height / (configs.length + 1))
      };
    });

    // Col 5: Implementations (x = 930, lower half or offset)
    impls.forEach((node, i) => {
      positions[node.id] = {
        x: 930,
        y: 480 + i * (height / (impls.length + 2))
      };
    });

    return positions;
  }, [allNodes]);

  // Handle Pan / Zoom
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === svgRef.current || (e.target as HTMLElement).tagName === 'svg') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const selectedNode = selectedNodeId ? graph.getNode(selectedNodeId) : null;
  const selectedNeighbors = useMemo(() => {
    if (!selectedNodeId) return [];
    return graph.getNeighbors(selectedNodeId);
  }, [graph, selectedNodeId]);

  const getNodeColor = (type: EntityType) => {
    switch (type) {
      case 'primitive':
        return '#06b6d4'; // Cyan
      case 'pattern':
        return '#10b981'; // Emerald
      case 'configuration':
        return '#f59e0b'; // Amber
      case 'implementation':
        return '#8b5cf6'; // Violet
      case 'evidence':
        return '#f43f5e'; // Rose
    }
  };

  const getEdgeColor = (relation: RelationType) => {
    switch (relation) {
      case 'USES':
        return '#0ea5e9'; // Sky
      case 'COMPOSES_WITH':
        return '#10b981'; // Green
      case 'REQUIRES':
        return '#eab308'; // Yellow
      case 'ALTERNATIVE_TO':
        return '#a855f7'; // Purple
      case 'SPECIALIZES':
        return '#6366f1'; // Indigo
      case 'CONFLICTS_WITH':
        return '#ef4444'; // Red
      case 'IMPLEMENTED_IN':
        return '#8b5cf6'; // Violet
      case 'VERIFIED_BY':
        return '#f43f5e'; // Pink
      default:
        return '#64748b';
    }
  };

  // Filter edges based on active selection and filters
  const visibleEdges = useMemo(() => {
    return allEdges.filter(edge => {
      if (filterRelation !== 'all' && edge.relation !== filterRelation) return false;
      const srcNode = graph.getNode(edge.source);
      const tgtNode = graph.getNode(edge.target);
      if (!srcNode || !tgtNode) return false;
      if (filterType !== 'all' && srcNode.type !== filterType && tgtNode.type !== filterType) {
        return false;
      }
      return true;
    });
  }, [allEdges, filterRelation, filterType, graph]);

  return (
    <div className="max-w-[1560px] mx-auto px-6 py-8">
      {/* View Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 mb-1 flex items-center gap-2">
            <Network className="w-6 h-6 text-cyan-400" />
            Интерактивный граф онтологии интерфейсов стендов
          </h1>
          <p className="text-xs text-slate-400">
            Прямая генерация графа из канонических записей: связи USES, COMPOSES_WITH, REQUIRES, CONFLICTS_WITH, ALTERNATIVE_TO, VERIFIED_BY.
          </p>
        </div>

        {/* Zoom and Reset Controls */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded">
          <button
            onClick={() => setZoom(z => Math.min(z + 0.2, 2.5))}
            className="p-1.5 text-slate-400 hover:text-slate-100 rounded cursor-pointer"
            title="Приблизить"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(z - 0.2, 0.4))}
            className="p-1.5 text-slate-400 hover:text-slate-100 rounded cursor-pointer"
            title="Отдалить"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            className="p-1.5 text-slate-400 hover:text-slate-100 rounded cursor-pointer"
            title="Сбросить масштаб"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter and Legend Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-4">
        {/* Entity Type Filter */}
        <div className="lg:col-span-4 flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded">
          <button
            onClick={() => setFilterType('all')}
            className={`flex-1 py-1 px-2 text-xs font-medium rounded ${
              filterType === 'all' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'
            }`}
          >
            Все типы
          </button>
          {(['primitive', 'pattern', 'configuration', 'evidence'] as EntityType[]).map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`flex-1 py-1 px-1.5 text-xs font-medium rounded capitalize ${
                filterType === t ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'
              }`}
            >
              {t.slice(0, 4)}
            </button>
          ))}
        </div>

        {/* Relation Type Filter */}
        <div className="lg:col-span-5 flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={filterRelation}
            onChange={e => setFilterRelation(e.target.value as any)}
            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="all">Все типы связей (All Relations)</option>
            <option value="USES">USES (Включает в состав)</option>
            <option value="COMPOSES_WITH">COMPOSES_WITH (Компонуется)</option>
            <option value="REQUIRES">REQUIRES (Обязательно требует)</option>
            <option value="ALTERNATIVE_TO">ALTERNATIVE_TO (Альтернатива)</option>
            <option value="CONFLICTS_WITH">CONFLICTS_WITH (Несовместим)</option>
            <option value="IMPLEMENTED_IN">IMPLEMENTED_IN (Реализован)</option>
            <option value="VERIFIED_BY">VERIFIED_BY (Подтвержден тестами)</option>
          </select>
        </div>

        {/* Search */}
        <div className="lg:col-span-3 relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Найти узел..."
            className="w-full bg-slate-900 border border-slate-800 rounded pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Main Canvas and Side Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Graph Viewport */}
        <div className="lg:col-span-8 bg-[#07090e] border border-slate-800 rounded-lg overflow-hidden relative h-[680px]">
          {/* Subtle Column Grid Zone Markers */}
          <div className="absolute top-3 left-4 text-[10px] font-mono text-slate-600 pointer-events-none">
            EVIDENCE
          </div>
          <div className="absolute top-3 left-[28%] text-[10px] font-mono text-slate-600 pointer-events-none">
            PRIMITIVES
          </div>
          <div className="absolute top-3 left-[56%] text-[10px] font-mono text-slate-600 pointer-events-none">
            PATTERNS
          </div>
          <div className="absolute top-3 left-[80%] text-[10px] font-mono text-slate-600 pointer-events-none">
            STAND CONFIGS
          </div>

          <svg
            ref={svgRef}
            className="w-full h-full cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <defs>
              {/* Arrowhead markers */}
              {Object.keys(RELATION_RULES).map(rel => (
                <marker
                  key={rel}
                  id={`arrow-${rel}`}
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 9 5 L 0 9 z" fill={getEdgeColor(rel as RelationType)} opacity={0.8} />
                </marker>
              ))}
            </defs>

            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
              {/* Render Edges */}
              {visibleEdges.map(edge => {
                const srcPos = nodePositions[edge.source];
                const tgtPos = nodePositions[edge.target];
                if (!srcPos || !tgtPos) return null;

                const isConnectedToSelected = selectedNodeId === edge.source || selectedNodeId === edge.target;
                const isConflicts = edge.relation === 'CONFLICTS_WITH';

                // Curved bezier path
                const dx = tgtPos.x - srcPos.x;
                const dy = tgtPos.y - srcPos.y;
                const cx1 = srcPos.x + dx * 0.4;
                const cy1 = srcPos.y;
                const cx2 = srcPos.x + dx * 0.6;
                const cy2 = tgtPos.y;

                return (
                  <g key={edge.id}>
                    <path
                      d={`M ${srcPos.x} ${srcPos.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${tgtPos.x} ${tgtPos.y}`}
                      stroke={getEdgeColor(edge.relation)}
                      strokeWidth={isConnectedToSelected ? 2.5 : isConflicts ? 2 : 1}
                      strokeDasharray={isConflicts ? '4 3' : 'none'}
                      strokeOpacity={selectedNodeId ? (isConnectedToSelected ? 1 : 0.15) : 0.55}
                      fill="none"
                      markerEnd={`url(#arrow-${edge.relation})`}
                    />
                  </g>
                );
              })}

              {/* Render Nodes */}
              {allNodes.map(node => {
                const pos = nodePositions[node.id];
                if (!pos) return null;

                if (filterType !== 'all' && node.type !== filterType) return null;
                if (searchQuery.trim() && !node.title.toLowerCase().includes(searchQuery.toLowerCase()) && !node.id.toLowerCase().includes(searchQuery.toLowerCase())) {
                  return null;
                }

                const isSelected = selectedNodeId === node.id;
                const isNeighbor = selectedNeighbors.some(n => n.node.id === node.id);
                const color = getNodeColor(node.type);

                return (
                  <g
                    key={node.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onClick={() => setSelectedNodeId(node.id)}
                    className="cursor-pointer"
                  >
                    {/* Pulsing ring if selected */}
                    {isSelected && (
                      <circle
                        r="22"
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                        strokeOpacity="0.4"
                      />
                    )}

                    {/* Node Core Circle */}
                    <circle
                      r={isSelected ? 16 : isNeighbor ? 14 : 11}
                      fill="#0f172a"
                      stroke={color}
                      strokeWidth={isSelected ? 3 : isNeighbor ? 2.5 : 1.5}
                      strokeOpacity={selectedNodeId ? (isSelected || isNeighbor ? 1 : 0.25) : 1}
                    />

                    {/* Inner Type Dot */}
                    <circle
                      r="4"
                      fill={color}
                      opacity={selectedNodeId ? (isSelected || isNeighbor ? 1 : 0.3) : 0.8}
                    />

                    {/* Node Label */}
                    <text
                      y={isSelected ? 26 : 22}
                      textAnchor="middle"
                      fill={isSelected ? '#38bdf8' : '#cbd5e1'}
                      fontSize={isSelected ? '11px' : '10px'}
                      fontFamily="var(--font-mono)"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      opacity={selectedNodeId ? (isSelected || isNeighbor ? 1 : 0.3) : 0.85}
                    >
                      {node.id}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Node Inspector Drawer */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
          {selectedNode ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="border-b border-slate-800 pb-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                  <span
                    className="uppercase px-2 py-0.5 rounded text-[10px] font-bold"
                    style={{ backgroundColor: `${getNodeColor(selectedNode.type)}22`, color: getNodeColor(selectedNode.type) }}
                  >
                    {selectedNode.type}
                  </span>
                  <span className="text-slate-500">{selectedNode.status}</span>
                </div>
                <h3 className="text-base font-semibold text-slate-100">{selectedNode.title}</h3>
                <div className="text-xs font-mono text-cyan-400">{selectedNode.id}</div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-2.5 rounded border border-slate-800">
                {selectedNode.entity.shortDescription}
              </p>

              {/* Direct Neighbors & Linked Relationships */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Связанные узлы ({selectedNeighbors.length})
                </h4>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {selectedNeighbors.map((neighbor, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedNodeId(neighbor.node.id)}
                      className="p-2 bg-slate-950/40 hover:bg-slate-950 rounded border border-slate-800 text-xs cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between font-mono mb-1">
                        <span
                          className="font-semibold text-[11px]"
                          style={{ color: getEdgeColor(neighbor.edge.relation) }}
                        >
                          {neighbor.direction === 'outgoing' ? '→' : '←'} {neighbor.edge.relation}
                        </span>
                        <span className="text-slate-500 text-[10px] uppercase">
                          {neighbor.node.type}
                        </span>
                      </div>
                      <div className="font-medium text-slate-200">{neighbor.node.title}</div>
                      <div className="text-[11px] font-mono text-slate-400">{neighbor.node.id}</div>
                      {neighbor.edge.rationale && (
                        <div className="text-[11px] text-slate-500 mt-1 italic">
                          "{neighbor.edge.rationale}"
                        </div>
                      )}
                    </div>
                  ))}

                  {selectedNeighbors.length === 0 && (
                    <div className="text-xs text-slate-500 py-2">Связей не обнаружено.</div>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onSelectEntityDetails(selectedNode.id)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-medium rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Открыть полную спецификацию <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <Info className="w-8 h-8 mb-2 text-slate-600" />
              <p className="text-xs">
                Кликните на любой узел в графе, чтобы исследовать входящие и исходящие связи, условия применимости и проверки.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
