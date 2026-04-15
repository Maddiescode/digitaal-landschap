import { useState } from 'react';
import type { Segment, DesignImplication } from '../types';
import { useFramework } from '../context/FrameworkContext';
import { ImplicationCard } from './ImplicationCard';
import { ImplicationForm } from './ImplicationForm';
import { AISuggestionsBanner } from './AISuggestionsBanner';
import { getSimulatedDesignImplicationSuggestions, getDesignImplicationSuggestions } from '../utils/ai';

interface Props {
  segment: Segment;
  color: { bg: string; border: string; text: string; accent: string };
}

export function ImplicationsPanel({ segment, color }: Props) {
  const { state, dispatch } = useFramework();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingSuggestions, setPendingSuggestions] = useState<DesignImplication[] | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const implications = segment.designImplications;

  const saveAll = (updated: DesignImplication[]) => {
    dispatch({ type: 'UPDATE_SEGMENT', id: segment.id, updates: { designImplications: updated } });
  };

  const handleAdd = (impl: DesignImplication) => {
    saveAll([...implications, impl]);
    setIsAdding(false);
  };

  const handleEdit = (updated: DesignImplication) => {
    saveAll(implications.map(i => i.id === updated.id ? updated : i));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    saveAll(implications.filter(i => i.id !== id));
  };

  const handleAcceptSuggestion = (impl: DesignImplication) => {
    saveAll([...implications, impl]);
  };

  const handleAcceptAll = () => {
    if (pendingSuggestions) {
      saveAll([...implications, ...pendingSuggestions]);
      setPendingSuggestions(null);
    }
  };

  const handleSuggest = async () => {
    setLoadingAI(true);
    try {
      let results: DesignImplication[];
      if (state.aiMode === 'claude' && state.claudeApiKey) {
        results = await getDesignImplicationSuggestions(segment, state.claudeApiKey);
      } else {
        results = getSimulatedDesignImplicationSuggestions(segment);
      }
      setPendingSuggestions(results);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">
            {implications.length === 0 ? 'Nog geen implicaties' : `${implications.length} implicatie${implications.length !== 1 ? 's' : ''}`}
          </span>
        </div>
        <button
          onClick={handleSuggest}
          disabled={loadingAI}
          className="flex items-center gap-1.5 text-xs font-medium bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {loadingAI ? (
            <span className="animate-pulse">Genereren...</span>
          ) : (
            <>✨ Suggesties genereren</>
          )}
        </button>
      </div>

      {/* AI suggestions banner */}
      {pendingSuggestions && (
        <AISuggestionsBanner
          suggestions={pendingSuggestions}
          onAccept={handleAcceptSuggestion}
          onAcceptAll={handleAcceptAll}
          onDismiss={() => setPendingSuggestions(null)}
        />
      )}

      {/* Saved implications */}
      {implications.length === 0 && !isAdding && !pendingSuggestions && (
        <div className="text-center py-10 text-text-secondary">
          <div className="text-3xl mb-2">💡</div>
          <p className="text-sm">Geen ontwerpimplicaties nog.</p>
          <p className="text-xs mt-1">Voeg er handmatig toe of laat AI suggesties genereren.</p>
        </div>
      )}

      <div className="space-y-3">
        {implications.map((impl) => (
          editingId === impl.id ? (
            <ImplicationForm
              key={impl.id}
              initial={impl}
              onSave={handleEdit}
              onCancel={() => setEditingId(null)}
              accentColor={color.accent}
            />
          ) : (
            <ImplicationCard
              key={impl.id}
              implication={impl}
              accentColor={color.accent}
              onEdit={(updated) => {
                // Inline field edits save immediately
                handleEdit(updated);
              }}
              onDelete={() => handleDelete(impl.id)}
            />
          )
        ))}
      </div>

      {/* Add form / button */}
      {isAdding ? (
        <ImplicationForm
          onSave={handleAdd}
          onCancel={() => setIsAdding(false)}
          accentColor={color.accent}
        />
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full flex items-center justify-center gap-2 text-sm text-text-secondary hover:text-blue-600 border border-dashed border-gray-200 hover:border-blue-300 rounded-xl py-3 transition-colors"
        >
          + Implicatie toevoegen
        </button>
      )}
    </div>
  );
}
