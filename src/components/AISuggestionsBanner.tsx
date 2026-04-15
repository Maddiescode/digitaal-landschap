import { useState } from 'react';
import type { DesignImplication } from '../types';
import { ImplicationCard } from './ImplicationCard';

interface Props {
  suggestions: DesignImplication[];
  onAccept: (implication: DesignImplication) => void;
  onAcceptAll: () => void;
  onDismiss: () => void;
}

export function AISuggestionsBanner({ suggestions, onAccept, onAcceptAll, onDismiss }: Props) {
  // Keep local editable copy — user edits before saving
  const [local, setLocal] = useState<DesignImplication[]>(suggestions);
  const [accepted, setAccepted] = useState<Set<string>>(new Set());

  const handleEdit = (updated: DesignImplication) => {
    setLocal(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const handleAcceptOne = (impl: DesignImplication) => {
    onAccept(impl);
    setAccepted(prev => new Set([...prev, impl.id]));
  };

  const handleAcceptAll = () => {
    local.forEach(s => onAccept(s));
    onAcceptAll();
  };

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl overflow-hidden">
      {/* Banner header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-amber-200">
        <div className="flex items-center gap-2">
          <span className="text-amber-600">✨</span>
          <span className="text-sm font-medium text-amber-800">
            AI heeft {local.length} implicatie{local.length !== 1 ? 's' : ''} gesuggereerd
          </span>
          <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
            Bewerkbaar voor opslaan
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAcceptAll}
            className="text-xs font-medium text-amber-700 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            Alles opslaan
          </button>
          <button
            onClick={onDismiss}
            className="text-xs text-amber-500 hover:text-amber-700 transition-colors"
          >
            Sluiten
          </button>
        </div>
      </div>

      {/* Suggestion cards */}
      <div className="p-3 space-y-2.5">
        {local.map((suggestion) => {
          const isAccepted = accepted.has(suggestion.id);
          return (
            <div key={suggestion.id} className={`transition-opacity ${isAccepted ? 'opacity-40' : ''}`}>
              <ImplicationCard
                implication={suggestion}
                accentColor="#f59e0b"
                onEdit={handleEdit}
                onDelete={() => setLocal(prev => prev.filter(s => s.id !== suggestion.id))}
              />
              {!isAccepted && (
                <div className="flex justify-end mt-1.5">
                  <button
                    onClick={() => handleAcceptOne(suggestion)}
                    className="text-xs font-medium text-amber-700 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded-lg transition-colors"
                  >
                    + Opslaan
                  </button>
                </div>
              )}
              {isAccepted && (
                <p className="text-xs text-amber-600 text-right mt-1">✓ Opgeslagen</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
