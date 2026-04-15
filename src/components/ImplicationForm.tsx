import { useState } from 'react';
import type { DesignImplication, EvidenceStrength } from '../types';

interface Props {
  initial?: Partial<DesignImplication>;
  onSave: (implication: DesignImplication) => void;
  onCancel: () => void;
  accentColor: string;
}

const evidenceLabels: Record<EvidenceStrength, string> = {
  high: 'Hoog',
  medium: 'Gemiddeld',
  low: 'Laag',
};

export function ImplicationForm({ initial, onSave, onCancel, accentColor }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [target, setTarget] = useState(initial?.target ?? '');
  const [sourceName, setSourceName] = useState(initial?.source?.name ?? '');
  const [sourceUrl, setSourceUrl] = useState(initial?.source?.url ?? '');
  const [evidenceStrength, setEvidenceStrength] = useState<EvidenceStrength>(initial?.source?.evidenceStrength ?? 'medium');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
    setTagInput('');
  };

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      target: target.trim(),
      source: { name: sourceName.trim(), url: sourceUrl.trim(), evidenceStrength },
      tags,
      isAiGenerated: initial?.isAiGenerated ?? false,
    });
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
      <div>
        <label className="text-[11px] text-text-secondary">Titel *</label>
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Korte, actieve zin..."
          className="w-full mt-0.5 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:border-blue-300"
          style={{ '--tw-ring-color': accentColor + '60' } as React.CSSProperties}
          onKeyDown={(e) => { if (e.key === 'Escape') onCancel(); }}
        />
      </div>

      <div>
        <label className="text-[11px] text-text-secondary">Beschrijving</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Wat te ontwerpen en waarom..."
          rows={3}
          className="w-full mt-0.5 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:border-blue-300 resize-none"
        />
      </div>

      <div>
        <label className="text-[11px] text-text-secondary">Doel (optioneel)</label>
        <input
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="UI-element of flow, bijv. 'Onboarding flow'"
          className="w-full mt-0.5 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:border-blue-300"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] text-text-secondary">Bron</label>
          <input
            value={sourceName}
            onChange={(e) => setSourceName(e.target.value)}
            placeholder="bijv. Nielsen Norman Group"
            className="w-full mt-0.5 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:border-blue-300"
          />
        </div>
        <div>
          <label className="text-[11px] text-text-secondary">URL (optioneel)</label>
          <input
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            placeholder="https://..."
            className="w-full mt-0.5 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:border-blue-300"
          />
        </div>
      </div>

      <div>
        <label className="text-[11px] text-text-secondary">Bewijskracht</label>
        <div className="flex gap-2 mt-1">
          {(['high', 'medium', 'low'] as EvidenceStrength[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setEvidenceStrength(s)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                evidenceStrength === s
                  ? 'border-blue-400 bg-blue-50 text-blue-700 font-medium'
                  : 'border-gray-200 text-text-secondary hover:border-gray-300'
              }`}
            >
              {evidenceLabels[s]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[11px] text-text-secondary">Tags</label>
        <div className="flex flex-wrap items-center gap-1.5 mt-1">
          {tags.map((tag, i) => (
            <span key={i} className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-gray-200 text-text-secondary">
              {tag}
              <button onClick={() => setTags(tags.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-400">✕</button>
            </span>
          ))}
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); } }}
            placeholder="tag + Enter"
            className="text-[11px] px-2 py-0.5 rounded-full bg-white border border-gray-200 outline-none w-24"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button onClick={onCancel} className="text-sm text-text-secondary hover:text-text-primary px-3 py-1.5 transition-colors">
          Annuleren
        </button>
        <button
          onClick={handleSave}
          disabled={!title.trim()}
          className="text-sm font-medium text-white px-4 py-1.5 rounded-lg transition-colors disabled:opacity-40"
          style={{ backgroundColor: accentColor }}
        >
          Opslaan
        </button>
      </div>
    </div>
  );
}
