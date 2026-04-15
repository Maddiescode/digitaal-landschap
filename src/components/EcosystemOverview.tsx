import { useMemo, useState } from 'react';
import { useFramework, getSegmentColor } from '../context/FrameworkContext';
import { ToolDetailModal } from './ToolDetailModal';

interface ToolEntry {
  name: string;
  image: string;
  usedByCount: number;
  segmentIndices: number[];
}

export function EcosystemOverview() {
  const { state } = useFramework();
  const [selectedTool, setSelectedTool] = useState<ToolEntry | null>(null);

  const toolEntries = useMemo((): ToolEntry[] => {
    const map = new Map<string, ToolEntry>();
    state.segments.forEach((seg, idx) => {
      // Combine hardware and software into one list for the overview
      const allTools = [...seg.hardware, ...seg.software];
      const allImages = [...seg.hardwareImages, ...seg.softwareImages];
      allTools.forEach((toolName, toolIdx) => {
        const key = toolName.toLowerCase().trim();
        const existing = map.get(key);
        if (existing) {
          if (!existing.segmentIndices.includes(idx)) {
            existing.usedByCount++;
            existing.segmentIndices.push(idx);
          }
          if (!existing.image && allImages[toolIdx]) {
            existing.image = allImages[toolIdx];
          }
        } else {
          map.set(key, {
            name: toolName,
            image: allImages[toolIdx] ?? '',
            usedByCount: 1,
            segmentIndices: [idx],
          });
        }
      });
    });
    return Array.from(map.values()).sort(
      (a, b) => b.usedByCount - a.usedByCount || a.name.localeCompare(b.name)
    );
  }, [state.segments]);

  const broad = toolEntries.filter(t => t.usedByCount >= 4);
  const shared = toolEntries.filter(t => t.usedByCount >= 2 && t.usedByCount < 4);
  const specific = toolEntries.filter(t => t.usedByCount === 1);

  const totalSegments = state.segments.length;

  if (toolEntries.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border mt-8 px-6 py-10 text-center">
        <p className="text-text-secondary text-sm">Nog geen tools toegevoegd aan de segmenten.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-border mt-8 overflow-hidden">
        {/* Section header */}
        <div className="px-6 pt-5 pb-4 border-b border-border-light">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-text-primary">🌐 Digitaal ecosysteem</h2>
              <p className="text-xs text-text-secondary mt-0.5">
                {toolEntries.length} unieke tools · {totalSegments} segmenten
              </p>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-4 text-[11px] text-text-secondary">
              {state.segments.map((seg, idx) => {
                const c = getSegmentColor(idx);
                return (
                  <div key={seg.id} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.accent }} />
                    <span>{seg.name.replace('Digi-', '')}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-6 pt-5">
          {broad.length > 0 && (
            <ToolGroup
              label="Breed ingezet"
              sublabel={`${broad.length - 5} segmenten`}
              badgeColor="green"
              tools={broad}
              segments={state.segments}
              onToolClick={setSelectedTool}
            />
          )}
          {shared.length > 0 && (
            <ToolGroup
              label="Gedeeld"
              sublabel="2–3 segmenten"
              badgeColor="amber"
              tools={shared}
              segments={state.segments}
              onToolClick={setSelectedTool}
            />
          )}
          {specific.length > 0 && (
            <ToolGroup
              label="Specifiek"
              sublabel="1 segment"
              badgeColor="gray"
              tools={specific}
              segments={state.segments}
              onToolClick={setSelectedTool}
            />
          )}
        </div>
      </div>

      {selectedTool && (
        <ToolDetailModal
          toolName={selectedTool.name}
          toolImage={selectedTool.image}
          segments={state.segments}
          onClose={() => setSelectedTool(null)}
        />
      )}
    </>
  );
}

const badgeStyles = {
  green: 'bg-green-50 text-green-700 border-green-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  gray: 'bg-gray-50 text-gray-600 border-gray-200',
};

function ToolGroup({
  label,
  sublabel,
  badgeColor,
  tools,
  segments,
  onToolClick,
}: {
  label: string;
  sublabel: string;
  badgeColor: 'green' | 'amber' | 'gray';
  tools: ToolEntry[];
  segments: ReturnType<typeof useFramework>['state']['segments'];
  onToolClick: (tool: ToolEntry) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{label}</h3>
        <span className={`text-[10px] font-medium border rounded-full px-1.5 py-0.5 ${badgeStyles[badgeColor]}`}>
          {sublabel}
        </span>
      </div>
      <div className="flex flex-wrap gap-3">
        {tools.map((tool) => (
          <ToolTile
            key={tool.name}
            tool={tool}
            segments={segments}
            onClick={() => onToolClick(tool)}
          />
        ))}
      </div>
    </div>
  );
}

function ToolTile({
  tool,
  segments,
  onClick,
}: {
  tool: ToolEntry;
  segments: ReturnType<typeof useFramework>['state']['segments'];
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-2 p-3 bg-gray-50 hover:bg-white border border-gray-200 hover:border-gray-300 rounded-xl cursor-pointer transition-all hover:shadow-sm w-24"
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
        {tool.image ? (
          <img src={tool.image} alt={tool.name} className="w-full h-full object-contain" />
        ) : (
          <span className="text-sm font-semibold text-gray-400">
            {tool.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      {/* Name */}
      <span className="text-[11px] text-text-primary font-medium text-center leading-tight line-clamp-2 w-full">
        {tool.name}
      </span>

      {/* Segment dots */}
      <div className="flex gap-0.5 justify-center">
        {segments.map((seg, idx) => {
          const isUsed = tool.segmentIndices.includes(idx);
          const c = getSegmentColor(idx);
          return (
            <div
              key={seg.id}
              className="w-2 h-2 rounded-full transition-all"
              style={{ backgroundColor: isUsed ? c.accent : '#e5e7eb' }}
              title={`${seg.name}${isUsed ? ' ✓' : ''}`}
            />
          );
        })}
      </div>

      {/* Count label */}
      <span className="text-[10px] text-text-secondary">
        {tool.usedByCount} segment{tool.usedByCount !== 1 ? 'en' : ''}
      </span>
    </button>
  );
}
