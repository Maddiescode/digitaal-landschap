import type { SkillIndicator } from '../types';

interface Props {
  skill: SkillIndicator;
  onChange: (skill: SkillIndicator) => void;
  accentColor?: string;
}

export function SkillSlider({ skill, onChange, accentColor = '#93c5fd' }: Props) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-text-secondary w-44 shrink-0">{skill.name}</span>
      <div className="flex-1 relative">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{ width: `${skill.level}%`, backgroundColor: accentColor }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={skill.level}
          onChange={(e) => onChange({ ...skill, level: Number(e.target.value) })}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
      </div>
      <span className="text-xs text-text-secondary w-8 text-right">{skill.level}%</span>
    </div>
  );
}
