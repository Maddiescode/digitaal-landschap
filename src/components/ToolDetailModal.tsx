import { createPortal } from 'react-dom';
import type { Segment } from '../types';
import { getSegmentColor } from '../context/FrameworkContext';

interface Props {
  toolName: string;
  toolImage: string;
  segments: Segment[];
  onClose: () => void;
}

export function ToolDetailModal({ toolName, toolImage, segments, onClose }: Props) {
  const key = toolName.toLowerCase().trim();

  const usedBySegments = segments
    .map((seg, idx) => {
      const swIdx = seg.software.findIndex(t => t.toLowerCase().trim() === key);
      if (swIdx >= 0) return { segment: seg, index: idx, image: seg.softwareImages[swIdx] ?? '' };
      const hwIdx = seg.hardware.findIndex(t => t.toLowerCase().trim() === key);
      if (hwIdx >= 0) return { segment: seg, index: idx, image: seg.hardwareImages[hwIdx] ?? '' };
      return null;
    })
    .filter((x): x is { segment: Segment; index: number; image: string } => x !== null);

  const notUsedBySegments = segments
    .map((seg, idx) => ({ segment: seg, index: idx }))
    .filter(({ segment }) =>
      !segment.software.some(t => t.toLowerCase().trim() === key) &&
      !segment.hardware.some(t => t.toLowerCase().trim() === key)
    );

  const usedCount = usedBySegments.length;
  const totalCount = segments.length;

  // Best available image (from any segment that has one)
  const displayImage = toolImage || usedBySegments.find(u => u.image)?.image || '';

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Modal card */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            {/* Tool icon */}
            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
              {displayImage ? (
                <img src={displayImage} alt={toolName} className="w-full h-full object-contain" />
              ) : (
                <span className="text-lg font-semibold text-gray-400">
                  {toolName.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-base font-semibold text-text-primary">{toolName}</h3>
              <p className="text-sm text-text-secondary">
                Gebruikt door {usedCount} van de {totalCount} segmenten
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-text-secondary transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Segment dots overview */}
          <div>
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Gebruik per segment</p>
            <div className="flex gap-3 flex-wrap">
              {segments.map((seg, idx) => {
                const isUsed = seg.software.some(t => t.toLowerCase().trim() === key) || seg.hardware.some(t => t.toLowerCase().trim() === key);
                const c = getSegmentColor(idx);
                return (
                  <div key={seg.id} className="flex flex-col items-center gap-1.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all"
                      style={isUsed
                        ? { backgroundColor: c.accent + '25', borderColor: c.accent }
                        : { backgroundColor: '#f3f4f6', borderColor: '#e5e7eb' }
                      }
                      title={seg.name}
                    >
                      {isUsed && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <span className="text-[10px] text-text-secondary text-center leading-tight max-w-[56px]">
                      {seg.name.replace('Digi-', '')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Segments that use it */}
          {usedBySegments.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Gebruikt door</p>
              <div className="space-y-2">
                {usedBySegments.map(({ segment: seg, index: idx }) => {
                  const c = getSegmentColor(idx);
                  const avgSkill = Math.round(
                    seg.skills.reduce((s, sk) => s + sk.level, 0) / (seg.skills.length || 1)
                  );
                  return (
                    <div key={seg.id} className="flex items-center gap-3 p-2.5 rounded-lg"
                      style={{ backgroundColor: c.accent + '12' }}>
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.accent }} />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-text-primary">{seg.name}</span>
                        <span className="text-xs text-text-secondary ml-2">{seg.shortDescription}</span>
                      </div>
                      <span className="text-xs text-text-secondary shrink-0">{avgSkill}% vaardigheid</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Segments that don't use it */}
          {notUsedBySegments.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Niet gebruikt door</p>
              <div className="flex flex-wrap gap-1.5">
                {notUsedBySegments.map(({ segment: seg }) => (
                  <span key={seg.id} className="text-xs text-text-secondary bg-gray-50 border border-gray-200 rounded-full px-2.5 py-1">
                    {seg.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
