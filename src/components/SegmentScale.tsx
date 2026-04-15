import { useState } from 'react';
import { useFramework } from '../context/FrameworkContext';
import { SegmentCard } from './SegmentCard';
import { DifferenceBlock } from './DifferenceBlock';

export function SegmentScale() {
  const { state } = useFramework();
  const [openDiff, setOpenDiff] = useState<number | null>(null);

  return (
    <div className="w-full">
      {/* Scale label */}
      <div className="flex items-center justify-between mb-2 px-2">
        <span className="text-[10px] text-text-secondary uppercase tracking-wider">Laag digitaal niveau</span>
        <div className="flex-1 mx-4 h-px bg-gradient-to-r from-segment-1 via-segment-3 to-segment-5 opacity-30" />
        <span className="text-[10px] text-text-secondary uppercase tracking-wider">Hoog digitaal niveau</span>
      </div>

      {/* Cards row */}
      <div className="flex items-stretch gap-0">
        {state.segments.map((segment, index) => (
          <div key={segment.id} className="contents">
            <div className="flex-1 min-w-0">
              <SegmentCard segment={segment} index={index} />
            </div>
            {index < state.segments.length - 1 && (
              <DifferenceBlock
                left={segment}
                right={state.segments[index + 1]}
                leftIndex={index}
                isOpen={openDiff === index}
                onToggle={() => setOpenDiff(openDiff === index ? null : index)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
