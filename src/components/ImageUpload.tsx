import { useRef, type ChangeEvent } from 'react';

interface Props {
  images: string[];
  labels: string[];
  onChange: (images: string[], labels: string[]) => void;
}

export function ImageUpload({ images, labels, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      onChange([...images, base64], [...labels, file.name.replace(/\.[^.]+$/, '')]);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const remove = (index: number) => {
    onChange(images.filter((_, i) => i !== index), labels.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {labels.map((label, i) => (
          <div key={i} className="group relative flex items-center gap-1.5 bg-gray-50 rounded-lg px-2.5 py-1.5 text-sm border border-border-light">
            {images[i] ? (
              <img src={images[i]} alt={label} className="w-5 h-5 object-contain" />
            ) : (
              <span className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center text-xs">?</span>
            )}
            <span>{label}</span>
            <button
              onClick={() => remove(i)}
              className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 text-xs ml-1 transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      <button
        onClick={() => inputRef.current?.click()}
        className="text-sm text-text-secondary hover:text-blue-600 transition-colors"
      >
        + Afbeelding uploaden
      </button>
    </div>
  );
}
