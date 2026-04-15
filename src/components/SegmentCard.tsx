import type { Segment } from '../types';
import { useFramework, getSegmentColor } from '../context/FrameworkContext';

interface Props {
  segment: Segment;
  index: number;
}

export function SegmentCard({ segment, index }: Props) {
  const { state, dispatch } = useFramework();
  const color = getSegmentColor(index);
  const isSelected = state.compareMode
    ? state.compareIds.includes(segment.id)
    : state.selectedSegmentId === segment.id;
  const compareIndex = state.compareMode ? state.compareIds.indexOf(segment.id) : -1;

  const avgSkill = Math.round(
    segment.skills.reduce((sum, s) => sum + s.level, 0) / (segment.skills.length || 1)
  );

  return (
    <button
      onClick={() => dispatch({ type: 'SELECT_SEGMENT', id: segment.id })}
      className={`
        relative flex flex-col items-center p-5 rounded-xl border-2 transition-all duration-200
        hover:shadow-md hover:-translate-y-0.5 cursor-pointer text-left w-full
        ${isSelected ? `${color.border} shadow-md -translate-y-1` : 'border-transparent'}
        ${color.bg}
      `}
      style={{ borderColor: isSelected ? color.accent : undefined }}
    >
      {compareIndex >= 0 && (
        <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
          {compareIndex + 1}
        </span>
      )}

      {/* Complexity indicator - more dots for higher skill */}
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all ${i <= index ? 'w-2 h-2' : 'w-1.5 h-1.5'}`}
            style={{ backgroundColor: i <= index ? color.accent : '#e5e7eb' }}
          />
        ))}
      </div>

      <h3 className={`font-semibold text-base mb-1 ${color.text}`}>
        {segment.name}
      </h3>
      <p className="text-xs text-text-secondary text-center leading-snug mb-3">
        {segment.shortDescription}
      </p>

      {/* Skill bar */}
      <div className="w-full">
        <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${avgSkill}%`, backgroundColor: color.accent }}
          />
        </div>
        <p className="text-[10px] text-text-secondary mt-1 text-center">
          Gem. vaardigheid: {avgSkill}%
        </p>
      </div>

      {/* Tool count */}
      <div className="mt-2 flex items-center gap-1 text-[10px] text-text-secondary">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
        {segment.hardware.length + segment.software.length} tools
      </div>
    </button>
  );
}
