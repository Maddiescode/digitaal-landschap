import type { Segment } from '../types';

export function exportToJSON(segments: Segment[]) {
  const data = JSON.stringify({ version: '1.0', segments }, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `digital-skill-framework-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importFromJSON(file: File): Promise<Segment[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.segments && Array.isArray(data.segments)) {
          // Migration guard: ensure new fields exist for older exports
          const migrated = data.segments.map((s: any) => ({
            ...s,
            personaImage: s.personaImage ?? '',
            designImplications: s.designImplications ?? [],
            quotes: s.quotes ?? (s.quote ? [s.quote] : []),
            hardware: s.hardware ?? [],
            hardwareImages: s.hardwareImages ?? [],
            software: s.software ?? s.digitalLandscape ?? [],
            softwareImages: s.softwareImages ?? s.digitalLandscapeImages ?? [],
          }));
          resolve(migrated);
        } else {
          reject(new Error('Invalid file format: missing segments array'));
        }
      } catch {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
