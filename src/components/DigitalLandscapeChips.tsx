import { useRef, useState } from 'react';

interface Props {
  labels: string[];
  images: string[];
  onChange: (labels: string[], images: string[]) => void;
  onToolClick?: (name: string, image: string) => void;
}

export function DigitalLandscapeChips({ labels, images, onChange, onToolClick }: Props) {
  const [adding, setAdding] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  // Always-fresh refs — updated synchronously on every render
  const labelsRef = useRef(labels);
  const imagesRef = useRef(images);
  labelsRef.current = labels;
  imagesRef.current = images;

  const chipFileRefs = useRef<(HTMLInputElement | null)[]>([]);
  const addImageRef = useRef<HTMLInputElement>(null);

  const remove = (i: number) => {
    const l = labelsRef.current;
    const im = imagesRef.current;
    onChange(l.filter((_, j) => j !== i), im.filter((_, j) => j !== i));
  };

  const addText = () => {
    if (newLabel.trim()) {
      onChange([...labelsRef.current, newLabel.trim()], [...imagesRef.current, '']);
      setNewLabel('');
      setAdding(false);
    }
  };

  const readFile = (file: File, onDone: (base64: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => onDone(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {labels.map((label, i) => (
        <div
          key={i}
          onClick={() => onToolClick?.(label, images[i] ?? '')}
          className={`group relative flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg px-2.5 py-1.5 text-sm border border-gray-200 transition-colors ${onToolClick ? 'cursor-pointer' : 'cursor-default'}`}
        >
          {/* Chip icon — click to replace/add icon for THIS chip */}
          <button
            onClick={(e) => { e.stopPropagation(); chipFileRefs.current[i]?.click(); }}
            className="shrink-0 w-5 h-5 rounded flex items-center justify-center overflow-hidden"
            title="Icoon wijzigen"
          >
            {images[i] ? (
              <img src={images[i]} alt={label} className="w-full h-full object-contain" />
            ) : (
              <span className="text-[10px] text-gray-300 opacity-0 group-hover:opacity-100">⊕</span>
            )}
          </button>
          <input
            ref={(el) => { chipFileRefs.current[i] = el; }}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const currentLabels = labelsRef.current;
                // Normalize: ensure images array is same length as labels
                const currentImages = currentLabels.map((_, j) => imagesRef.current[j] ?? '');
                readFile(file, (base64) => {
                  currentImages[i] = base64;
                  onChange(currentLabels, currentImages);
                });
              }
              e.target.value = '';
            }}
          />
          {label && <span className="text-text-primary">{label}</span>}
          <button
            onClick={(e) => { e.stopPropagation(); remove(i); }}
            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity text-xs ml-0.5"
            title="Verwijderen"
          >
            ✕
          </button>
        </div>
      ))}

      {adding ? (
        <div className="flex items-center gap-1 bg-blue-50 border border-blue-300 rounded-lg px-2.5 py-1.5">
          <input
            autoFocus
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onBlur={() => { addText(); setAdding(false); }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addText();
              if (e.key === 'Escape') { setAdding(false); setNewLabel(''); }
            }}
            placeholder="Tool naam..."
            className="text-sm bg-transparent outline-none w-28"
          />
        </div>
      ) : (
        <div className="flex gap-1.5">
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-1 text-sm text-text-secondary hover:text-blue-600 bg-gray-50 hover:bg-blue-50 border border-dashed border-gray-300 hover:border-blue-300 rounded-lg px-2.5 py-1.5 transition-colors"
          >
            + Tekst
          </button>
          <button
            onClick={() => addImageRef.current?.click()}
            className="flex items-center gap-1 text-sm text-text-secondary hover:text-blue-600 bg-gray-50 hover:bg-blue-50 border border-dashed border-gray-300 hover:border-blue-300 rounded-lg px-2.5 py-1.5 transition-colors"
          >
            + Afbeelding
          </button>
          {/* Hidden file input for adding a new image-only chip */}
          <input
            ref={addImageRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const currentLabels = [...labelsRef.current];
                // Normalize: pad images to match labels length, then append new
                const currentImages = currentLabels.map((_, j) => imagesRef.current[j] ?? '');
                readFile(file, (base64) => {
                  onChange([...currentLabels, ''], [...currentImages, base64]);
                });
              }
              e.target.value = '';
            }}
          />
        </div>
      )}
    </div>
  );
}
