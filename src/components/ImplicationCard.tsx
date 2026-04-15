import { useState } from 'react';
import type { DesignImplication, EvidenceStrength } from '../types';
import { EditableText } from './EditableText';

interface Props {
  implication: DesignImplication;
  accentColor: string;
  onEdit: (updated: DesignImplication) => void;
  onDelete: () => void;
}

const evidenceDot: Record<EvidenceStrength, { color: string; label: string }> = {
  high:   { color: '#16a34a', label: 'Hoog' },
  medium: { color: '#d97706', label: 'Gemiddeld' },
  low:    { color: '#9ca3af', label: 'Laag' },
};

export function ImplicationCard({ implication, accentColor, onEdit, onDelete }: Props) {
  const [editingTag, setEditingTag] = useState(false);
  const [newTag, setNewTag] = useState('');

  const update = (partial: Partial<DesignImplication>) => onEdit({ ...implication, ...partial });

  const removeTag = (i: number) =>
    update({ tags: implication.tags.filter((_, j) => j !== i) });

  const addTag = () => {
    if (newTag.trim()) {
      update({ tags: [...implication.tags, newTag.trim()] });
      setNewTag('');
      setEditingTag(false);
    }
  };

  const dot = evidenceDot[implication.source.evidenceStrength];

  return (
    <div className="group relative bg-white border border-gray-200 hover:border-gray-300 rounded-xl p-4 transition-colors">
      {/* Delete button */}
      <button
        onClick={onDelete}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-opacity text-sm"
        title="Verwijderen"
      >
        ✕
      </button>

      {/* Header: icon + title + AI badge */}
      <div className="flex items-start gap-2.5 pr-6">
        <div className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5"
          style={{ backgroundColor: accentColor + '20' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <EditableText
            value={implication.title}
            onChange={(v) => update({ title: v })}
            tag="h4"
            className="text-sm font-semibold text-text-primary leading-snug"
            placeholder="Titel..."
          />
        </div>
        {implication.isAiGenerated && (
          <span className="shrink-0 text-[10px] font-medium bg-amber-50 text-amber-600 border border-amber-200 rounded-full px-1.5 py-0.5 mt-0.5">
            AI
          </span>
        )}
      </div>

      {/* Description */}
      <div className="mt-2 pl-9">
        <EditableText
          value={implication.description}
          onChange={(v) => update({ description: v })}
          className="text-sm text-text-secondary leading-relaxed"
          placeholder="Beschrijving..."
          multiline
        />
      </div>

      {/* Target */}
      <div className="mt-2 pl-9 flex items-center gap-1.5">
        <span className="text-[11px] text-text-secondary shrink-0">Doel:</span>
        <EditableText
          value={implication.target}
          onChange={(v) => update({ target: v })}
          tag="span"
          className="text-[11px] text-text-primary"
          placeholder="UI-element of flow (optioneel)"
        />
      </div>

      {/* Source badge */}
      <div className="mt-3 pl-9 flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-2.5 py-1">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: dot.color }}
            title={`Bewijskracht: ${dot.label}`}
          />
          <EditableText
            value={implication.source.name}
            onChange={(v) => update({ source: { ...implication.source, name: v } })}
            tag="span"
            className="text-[11px] text-text-secondary"
            placeholder="Bronlabel"
          />
          {implication.source.url && (
            <a
              href={implication.source.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-blue-500 hover:text-blue-700 shrink-0"
              title="Bron openen"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
              </svg>
            </a>
          )}
        </div>
        {/* Evidence strength toggle */}
        <div className="flex gap-1">
          {(['high', 'medium', 'low'] as EvidenceStrength[]).map((s) => (
            <button
              key={s}
              onClick={() => update({ source: { ...implication.source, evidenceStrength: s } })}
              className={`text-[10px] px-1.5 py-0.5 rounded-full transition-colors ${
                implication.source.evidenceStrength === s
                  ? 'font-medium'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              style={implication.source.evidenceStrength === s ? { color: evidenceDot[s].color, backgroundColor: evidenceDot[s].color + '15' } : {}}
            >
              {evidenceDot[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Source URL editable */}
      <div className="mt-1.5 pl-9 flex items-center gap-1.5">
        <span className="text-[10px] text-gray-400 shrink-0">URL:</span>
        <EditableText
          value={implication.source.url}
          onChange={(v) => update({ source: { ...implication.source, url: v } })}
          tag="span"
          className="text-[10px] text-blue-500"
          placeholder="https://..."
        />
      </div>

      {/* Tags */}
      <div className="mt-3 pl-9 flex flex-wrap items-center gap-1.5">
        {implication.tags.map((tag, i) => (
          <span
            key={i}
            className="group/tag flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-text-secondary"
          >
            {tag}
            <button
              onClick={() => removeTag(i)}
              className="opacity-0 group-hover/tag:opacity-100 text-gray-400 hover:text-red-400 transition-opacity"
            >
              ✕
            </button>
          </span>
        ))}
        {editingTag ? (
          <input
            autoFocus
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onBlur={addTag}
            onKeyDown={(e) => { if (e.key === 'Enter') addTag(); if (e.key === 'Escape') setEditingTag(false); }}
            placeholder="Tag..."
            className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 border border-blue-300 outline-none w-20"
          />
        ) : (
          <button
            onClick={() => setEditingTag(true)}
            className="text-[11px] text-gray-400 hover:text-blue-600 transition-colors"
          >
            + tag
          </button>
        )}
      </div>
    </div>
  );
}
