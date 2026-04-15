import type { ReactNode } from 'react';
import { useFramework, getSegmentColor } from '../context/FrameworkContext';

export function CompareMode() {
  const { state } = useFramework();
  const [id1, id2] = state.compareIds;
  const seg1 = state.segments.find(s => s.id === id1);
  const seg2 = state.segments.find(s => s.id === id2);

  if (!seg1 || !seg2) {
    return (
      <div className="bg-white rounded-xl border border-border p-8 text-center mt-6">
        <p className="text-text-secondary text-sm">
          Selecteer 2 segmenten om te vergelijken
        </p>
        <div className="flex justify-center gap-3 mt-3">
          {state.compareIds.map((id, i) => (
            <span key={i} className={`text-sm px-3 py-1 rounded-full border ${id ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-border text-text-secondary'}`}>
              {id ? state.segments.find(s => s.id === id)?.name : `Segment ${i + 1}?`}
            </span>
          ))}
        </div>
      </div>
    );
  }

  const idx1 = state.segments.findIndex(s => s.id === id1);
  const idx2 = state.segments.findIndex(s => s.id === id2);
  const c1 = getSegmentColor(idx1);
  const c2 = getSegmentColor(idx2);

  return (
    <div className="bg-white rounded-xl border border-border mt-6 overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-2 border-b border-border">
        <div className="p-4 border-r border-border" style={{ backgroundColor: c1.accent + '15' }}>
          <h3 className={`font-semibold ${c1.text}`}>{seg1.name}</h3>
          <p className="text-xs text-text-secondary">{seg1.shortDescription}</p>
        </div>
        <div className="p-4" style={{ backgroundColor: c2.accent + '15' }}>
          <h3 className={`font-semibold ${c2.text}`}>{seg2.name}</h3>
          <p className="text-xs text-text-secondary">{seg2.shortDescription}</p>
        </div>
      </div>

      {/* Skills comparison */}
      <CompareSection title="Vaardigheden">
        <div className="grid grid-cols-2">
          <div className="pr-4 border-r border-border space-y-2">
            {seg1.skills.map((s, i) => (
              <SkillBar key={i} name={s.name} level={s.level} color={c1.accent} otherLevel={seg2.skills[i]?.level ?? 0} />
            ))}
          </div>
          <div className="pl-4 space-y-2">
            {seg2.skills.map((s, i) => (
              <SkillBar key={i} name={s.name} level={s.level} color={c2.accent} otherLevel={seg1.skills[i]?.level ?? 0} />
            ))}
          </div>
        </div>
      </CompareSection>

      {/* Lists comparison */}
      <CompareListSection title="Hardware" left={seg1.hardware} right={seg2.hardware} />
      <CompareListSection title="Software" left={seg1.software} right={seg2.software} />
      <CompareListSection title="DOEN" left={seg1.doen} right={seg2.doen} />
      <CompareListSection title="DENKEN" left={seg1.denken} right={seg2.denken} />
      <CompareListSection title="VOELEN" left={seg1.voelen} right={seg2.voelen} />
      <CompareListSection title="Wat werkt digitaal" left={seg1.worksDigitally} right={seg2.worksDigitally} />
      <CompareListSection title="Wat werkt NIET digitaal" left={seg1.doesNotWorkDigitally} right={seg2.doesNotWorkDigitally} />
      <CompareListSection title="Behoeften" left={seg1.needs} right={seg2.needs} />
    </div>
  );
}

function CompareSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-b border-border-light last:border-0">
      <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider px-4 pt-3 pb-1">{title}</h4>
      <div className="px-4 pb-3">{children}</div>
    </div>
  );
}

function SkillBar({ name, level, color, otherLevel }: { name: string; level: number; color: string; otherLevel: number }) {
  const diff = level - otherLevel;
  return (
    <div>
      <div className="flex justify-between text-xs mb-0.5">
        <span className="text-text-secondary">{name}</span>
        <span className="font-medium" style={{ color: diff > 0 ? '#16a34a' : diff < 0 ? '#dc2626' : '#6b7280' }}>
          {level}% {diff !== 0 && `(${diff > 0 ? '+' : ''}${diff})`}
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${level}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function CompareListSection({ title, left, right }: { title: string; left: string[]; right: string[] }) {
  const onlyLeft = left.filter(item => !right.includes(item));
  const onlyRight = right.filter(item => !left.includes(item));
  const shared = left.filter(item => right.includes(item));

  return (
    <CompareSection title={title}>
      <div className="grid grid-cols-2">
        <div className="pr-4 border-r border-border space-y-0.5">
          {left.map((item, i) => {
            const isUnique = onlyLeft.includes(item);
            return (
              <p key={i} className={`text-xs py-0.5 ${isUnique ? 'bg-amber-50 px-1.5 rounded text-amber-800 font-medium' : 'text-text-primary'}`}>
                {item}
              </p>
            );
          })}
        </div>
        <div className="pl-4 space-y-0.5">
          {right.map((item, i) => {
            const isUnique = onlyRight.includes(item);
            return (
              <p key={i} className={`text-xs py-0.5 ${isUnique ? 'bg-amber-50 px-1.5 rounded text-amber-800 font-medium' : 'text-text-primary'}`}>
                {item}
              </p>
            );
          })}
        </div>
      </div>
      {shared.length > 0 && (
        <p className="text-[10px] text-text-secondary mt-1">{shared.length} gedeelde items</p>
      )}
    </CompareSection>
  );
}
