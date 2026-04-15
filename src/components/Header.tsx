import { useRef, type ChangeEvent } from 'react';
import { useFramework } from '../context/FrameworkContext';
import { importFromJSON } from '../utils/exportImport';

export function Header() {
  const { state, dispatch } = useFramework();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const segments = await importFromJSON(file);
      dispatch({ type: 'IMPORT_SEGMENTS', segments });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Import failed');
    }
    e.target.value = '';
  };

  return (
    <header className="bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary tracking-tight">
            Digitaal Landschap
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Audience segmentatie op basis van digitaal vaardigheidsniveau
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Compare toggle */}
          <button
            onClick={() => dispatch({ type: 'TOGGLE_COMPARE' })}
            className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${
              state.compareMode
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'border-border text-text-secondary hover:bg-gray-50'
            }`}
          >
            Vergelijken
          </button>

          {/* Ecosystem toggle */}
          <button
            onClick={() => dispatch({ type: 'TOGGLE_ECOSYSTEM' })}
            className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${
              state.showEcosystem
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'border-border text-text-secondary hover:bg-gray-50'
            }`}
          >
            Ecosysteem
          </button>

          {/* AI settings */}
          <div className="relative">
            <button
              onClick={() => dispatch({ type: 'TOGGLE_AI_SETTINGS' })}
              className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${
                state.showAISettings
                  ? 'bg-ai-bg border-amber-300 text-amber-700'
                  : 'border-border text-text-secondary hover:bg-gray-50'
              }`}
            >
              AI {state.aiMode === 'claude' ? '(Claude)' : '(Sim)'}
            </button>
            {state.showAISettings && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-border p-3 w-64 z-50">
                <h4 className="text-xs font-semibold text-text-secondary mb-2">AI Instellingen</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="aiMode"
                      checked={state.aiMode === 'simulated'}
                      onChange={() => dispatch({ type: 'SET_AI_MODE', mode: 'simulated' })}
                      className="accent-amber-500"
                    />
                    Gesimuleerd
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="aiMode"
                      checked={state.aiMode === 'claude'}
                      onChange={() => dispatch({ type: 'SET_AI_MODE', mode: 'claude' })}
                      className="accent-amber-500"
                    />
                    Claude API
                  </label>
                  {state.aiMode === 'claude' && (
                    <input
                      type="password"
                      placeholder="API Key"
                      value={state.claudeApiKey}
                      onChange={(e) => dispatch({ type: 'SET_API_KEY', key: e.target.value })}
                      className="w-full text-xs border border-border rounded px-2 py-1 mt-1"
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
        </div>
      </div>
    </header>
  );
}
