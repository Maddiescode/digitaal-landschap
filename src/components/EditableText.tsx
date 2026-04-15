import { useState, useRef, useEffect, type ChangeEvent, type KeyboardEvent } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  tag?: 'p' | 'h3' | 'h4' | 'span';
  className?: string;
  placeholder?: string;
  multiline?: boolean;
}

export function EditableText({ value, onChange, tag = 'p', className = '', placeholder = 'Klik om te bewerken...', multiline = false }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => { setDraft(value); }, [value]);
  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      if (multiline && ref.current instanceof HTMLTextAreaElement) {
        ref.current.style.height = 'auto';
        ref.current.style.height = ref.current.scrollHeight + 'px';
      }
    }
  }, [editing, multiline]);

  const save = () => {
    setEditing(false);
    if (draft !== value) onChange(draft);
  };

  if (editing) {
    const shared = {
      ref: ref as any,
      value: draft,
      onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setDraft(e.target.value);
        if (multiline && e.target instanceof HTMLTextAreaElement) {
          e.target.style.height = 'auto';
          e.target.style.height = e.target.scrollHeight + 'px';
        }
      },
      onBlur: save,
      onKeyDown: (e: KeyboardEvent) => {
        if (e.key === 'Enter' && !multiline) save();
        if (e.key === 'Escape') { setDraft(value); setEditing(false); }
      },
      className: `w-full bg-blue-50 rounded px-2 py-1 outline-none ring-2 ring-blue-300 text-text-primary ${className}`,
    };
    return multiline
      ? <textarea {...shared} rows={3} />
      : <input type="text" {...shared} />;
  }

  const Tag = tag;
  return (
    <Tag
      className={`editable-field ${className} ${!value ? 'text-text-secondary italic' : ''}`}
      onClick={() => setEditing(true)}
    >
      {value || placeholder}
    </Tag>
  );
}
