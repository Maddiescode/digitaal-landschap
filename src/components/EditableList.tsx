import { useState } from 'react';
import { EditableText } from './EditableText';

interface Props {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}

export function EditableList({ items, onChange, placeholder = 'Nieuw item...' }: Props) {
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState('');

  const update = (index: number, value: string) => {
    const updated = [...items];
    updated[index] = value;
    onChange(updated);
  };

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const add = () => {
    if (newItem.trim()) {
      onChange([...items, newItem.trim()]);
      setNewItem('');
      setAdding(false);
    }
  };

  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 group">
          <span className="text-text-secondary mt-0.5 text-sm shrink-0">•</span>
          <div className="flex-1 min-w-0">
            <EditableText value={item} onChange={(v) => update(i, v)} tag="span" className="text-sm" />
          </div>
          <button
            onClick={() => remove(i)}
            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 text-xs shrink-0 transition-opacity"
            title="Verwijderen"
          >
            ✕
          </button>
        </li>
      ))}
      {adding ? (
        <li className="flex items-center gap-2">
          <span className="text-text-secondary text-sm">•</span>
          <input
            autoFocus
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onBlur={() => { add(); setAdding(false); }}
            onKeyDown={(e) => { if (e.key === 'Enter') add(); if (e.key === 'Escape') setAdding(false); }}
            placeholder={placeholder}
            className="flex-1 text-sm bg-blue-50 rounded px-2 py-1 outline-none ring-2 ring-blue-300"
          />
        </li>
      ) : (
        <li>
          <button
            onClick={() => setAdding(true)}
            className="text-sm text-text-secondary hover:text-blue-600 transition-colors"
          >
            + Toevoegen
          </button>
        </li>
      )}
    </ul>
  );
}
