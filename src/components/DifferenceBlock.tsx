import type { Segment } from '../types';
import { getSegmentColor } from '../context/FrameworkContext';

interface Props {
  left: Segment;
  right: Segment;
  leftIndex: number;
  isOpen: boolean;
  onToggle: () => void;
}

function computeDifferences(left: Segment, right: Segment) {
  const skillDiffs = left.skills.map((ls, i) => {
    const rs = right.skills[i];
    return {
      name: ls.name,
      leftLevel: ls.level,
      rightLevel: rs?.level ?? 0,
      delta: (rs?.level ?? 0) - ls.level,
    };
  });

  const leftTools = [...left.hardware, ...left.software];
  const rightTools = [...right.hardware, ...right.software];
  const newTools = rightTools.filter(t => !leftTools.includes(t));
  const removedTools = leftTools.filter(t => !rightTools.includes(t));

  const needsDiff = {
    added: right.needs.filter(n => !left.needs.includes(n)),
    removed: left.needs.filter(n => !right.needs.includes(n)),
  };

  const behaviorsDiff = {
    added: right.doen.filter(d => !left.doen.includes(d)),
    removed: left.doen.filter(d => !right.doen.includes(d)),
  };

  return { skillDiffs, newTools, removedTools, needsDiff, behaviorsDiff };
}

export function DifferenceBlock({ left, right, leftIndex, isOpen, onToggle }: Props) {
  const diff = computeDifferences(left, right);
  const leftColor = getSegmentColor(leftIndex);
  const rightColor = getSegmentColor(leftIndex + 1);

  const avgDelta = Math.round(
    diff.skillDiffs.reduce((s, d) => s + d.delta, 0) / diff.skillDiffs.length
  );

  return (
    <div className="flex flex-col items-center mx-1 shrink-0">
      <button
        onClick={onToggle}
        className="group flex flex-col items-center gap-0.5 py-2 px-1 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-0.5">
          <div className="w-4 h-0.5 rounded" style={{ backgroundColor: leftColor.accent }} />
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-semibold transition-colors ${isOpen ? 'border-blue-400 text-blue-600' : 'border-border text-text-secondary group-hover:border-blue-400 group-hover:text-blue-600'}`}>
            +{avgDelta}
          </div>
          <div className="w-4 h-0.5 rounded" style={{ backgroundColor: rightColor.accent }} />
        </div>
        <span className={`text-[9px] transition-colors ${isOpen ? 'text-blue-600' : 'text-text-secondary group-hover:text-blue-600'}`}>verschil</span>
      </button>

      {isOpen && (
        <div className="absolute mt-12 z-20 bg-white rounded-xl shadow-lg border border-border p-4 w-80 text-left">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-text-primary">
              {left.name} → {right.name}
            </h4>
            <button onClick={onToggle} className="text-text-secondary hover:text-text-primary text-sm">✕</button>
          </div>

          {/* Skill differences */}
          <div className="mb-3">
            <h5 className="text-xs font-medium text-text-secondary mb-1.5">Vaardigheden</h5>
            {diff.skillDiffs.map((sd, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-0.5">
                <span className="text-text-secondary">{sd.name}</span>
                <span className={sd.delta > 0 ? 'text-green-600 font-medium' : 'text-gray-400'}>
                  {sd.delta > 0 ? '+' : ''}{sd.delta}%
                </span>
              </div>
            ))}
          </div>

          {/* New tools */}
          {diff.newTools.length > 0 && (
            <div className="mb-3">
              <h5 className="text-xs font-medium text-text-secondary mb-1">Nieuwe tools</h5>
              <div className="flex flex-wrap gap-1">
                {diff.newTools.map((t, i) => (
                  <span key={i} className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded">+{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Behavior changes */}
          {diff.behaviorsDiff.added.length > 0 && (
            <div className="mb-3">
              <h5 className="text-xs font-medium text-text-secondary mb-1">Nieuw gedrag</h5>
              {diff.behaviorsDiff.added.map((b, i) => (
                <p key={i} className="text-xs text-green-700 py-0.5">+ {b}</p>
              ))}
            </div>
          )}

          {/* Needs changes */}
          {diff.needsDiff.added.length > 0 && (
            <div>
              <h5 className="text-xs font-medium text-text-secondary mb-1">Nieuwe behoeften</h5>
              {diff.needsDiff.added.map((n, i) => (
                <p key={i} className="text-xs text-blue-700 py-0.5">+ {n}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
