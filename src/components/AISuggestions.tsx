import { useState } from 'react';
import type { Segment } from '../types';
import { getSimulatedSuggestions, getClaudeAPISuggestions } from '../utils/ai';
import { useFramework } from '../context/FrameworkContext';

interface Props {
  segment: Segment;
  field: string;
  onApply: (suggestion: string) => void;
}

export function AISuggestions({ segment, field, onApply }: Props) {
  const { state } = useFramework();
  const [suggestions, setSuggestions] = useState<{ suggestion: string; theory?: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const fetchSuggestions = async () => {
    setLoading(true);
    setExpanded(true);
    try {
      if (state.aiMode === 'claude' && state.claudeApiKey) {
        const result = await getClaudeAPISuggestions(segment, field, state.claudeApiKey);
        setSuggestions(result);
      } else {
        const result = getSimulatedSuggestions(segment, field);
        setSuggestions(result);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!expanded) {
    return (
      <button
        onClick={fetchSuggestions}
        className="flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-700 bg-ai-bg px-2 py-1 rounded-md transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        AI suggesties
      </button>
    );
  }

  return (
    <div className="bg-ai-bg border border-amber-200 rounded-lg p-3 mt-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-amber-700 flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          AI Suggesties {state.aiMode === 'claude' ? '(Claude API)' : '(Simulatie)'}
        </span>
        <button onClick={() => setExpanded(false)} className="text-xs text-amber-500 hover:text-amber-700">
          Sluiten
        </button>
      </div>
      {loading ? (
        <p className="text-xs text-amber-600 animate-pulse">Suggesties genereren...</p>
      ) : (
        <div className="space-y-2">
          {suggestions.map((s, i) => (
            <div key={i} className="bg-white/60 rounded p-2">
              <p className="text-sm text-text-primary">{s.suggestion}</p>
              {s.theory && (
                <p className="text-xs text-amber-600 mt-1 italic">{s.theory}</p>
              )}
              <button
                onClick={() => onApply(s.suggestion)}
                className="text-xs text-blue-600 hover:text-blue-700 mt-1 font-medium"
              >
                + Toepassen
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={fetchSuggestions}
        className="text-xs text-amber-600 hover:text-amber-700 mt-2"
      >
        Vernieuwen
      </button>
    </div>
  );
}
