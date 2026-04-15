import { useRef, useState, type ChangeEvent } from 'react';
import type { ReactNode } from 'react';
import type { Segment } from '../types';
import { useFramework, getSegmentColor } from '../context/FrameworkContext';
import { EditableText } from './EditableText';
import { EditableList } from './EditableList';
import { SkillSlider } from './SkillSlider';
import { DigitalLandscapeChips } from './DigitalLandscapeChips';
import { AISuggestions } from './AISuggestions';
import { ImplicationsPanel } from './ImplicationsPanel';
import { ToolDetailModal } from './ToolDetailModal';

type Tab = 'persona' | 'implications';

export function SideDrawer() {
  const { state, dispatch } = useFramework();
  const segment = state.segments.find(s => s.id === state.selectedSegmentId);
  const personaImageRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<Tab>('persona');
  const [selectedTool, setSelectedTool] = useState<{ name: string; image: string } | null>(null);

  if (!segment) return null;

  const index = state.segments.findIndex(s => s.id === segment.id);
  const color = getSegmentColor(index);

  const update = (updates: Partial<Segment>) => {
    dispatch({ type: 'UPDATE_SEGMENT', id: segment.id, updates });
  };

  const handlePersonaImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => update({ personaImage: ev.target?.result as string });
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const implCount = segment.designImplications.length;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/10 z-30 transition-opacity"
        onClick={() => dispatch({ type: 'SELECT_SEGMENT', id: null })}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl z-40 overflow-y-auto animate-slide-in">
        {/* Sticky header */}
        <div className="sticky top-0 bg-white border-b border-border z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color.accent }} />
              <h2 className="text-lg font-semibold text-text-primary">{segment.name}</h2>
            </div>
            <button
              onClick={() => dispatch({ type: 'SELECT_SEGMENT', id: null })}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-text-secondary transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="px-4 pb-2">
            <EditableText
              value={segment.shortDescription}
              onChange={(v) => update({ shortDescription: v })}
              className="text-sm text-text-secondary"
            />
          </div>
          {/* Tab strip */}
          <div className="flex">
            <button
              onClick={() => setActiveTab('persona')}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'persona'
                  ? 'text-text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
              style={activeTab === 'persona' ? { borderBottomColor: color.accent } : {}}
            >
              Persona
            </button>
            <button
              onClick={() => setActiveTab('implications')}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'implications'
                  ? 'text-text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
              style={activeTab === 'implications' ? { borderBottomColor: color.accent } : {}}
            >
              Ontwerp-implicaties
              {implCount > 0 && (
                <span className="ml-1.5 text-xs bg-gray-100 text-text-secondary rounded-full px-1.5 py-0.5">
                  {implCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tab: Persona */}
        {activeTab === 'persona' && (
          <div className="p-4 space-y-6">
            {/* Persona image */}
            <div>
              <input ref={personaImageRef} type="file" accept="image/*" onChange={handlePersonaImageUpload} className="hidden" />
              {segment.personaImage ? (
                <div className="relative group cursor-pointer" onClick={() => personaImageRef.current?.click()}>
                  <img
                    src={segment.personaImage}
                    alt="Persona"
                    className="w-full h-48 object-cover rounded-xl border border-border"
                  />
                  <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-medium bg-black/50 px-3 py-1.5 rounded-full transition-opacity">
                      Afbeelding wijzigen
                    </span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => personaImageRef.current?.click()}
                  className="w-full h-32 rounded-xl border-2 border-dashed border-gray-200 hover:border-gray-300 hover:bg-gray-50 flex flex-col items-center justify-center gap-2 text-text-secondary transition-colors"
                >
                  <span className="text-2xl">🖼️</span>
                  <span className="text-sm">Persona afbeelding uploaden</span>
                </button>
              )}
              {segment.personaImage && (
                <button
                  onClick={() => update({ personaImage: '' })}
                  className="mt-2 text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  ✕ Afbeelding verwijderen
                </button>
              )}
            </div>

            <Section title="💬 Quotes">
              <EditableList
                items={segment.quotes}
                onChange={(items) => update({ quotes: items })}
                placeholder="Quote toevoegen..."
              />
            </Section>

            <Section title="👤 Profiel">
              <div className="grid grid-cols-2 gap-3">
                <ProfileField label="Leeftijd" value={segment.profile.age} onChange={(v) => update({ profile: { ...segment.profile, age: v } })} />
                <ProfileField label="Jaren bij bedrijf" value={segment.profile.yearsAtCompany} onChange={(v) => update({ profile: { ...segment.profile, yearsAtCompany: v } })} />
                <ProfileField label="Opleiding" value={segment.profile.education} onChange={(v) => update({ profile: { ...segment.profile, education: v } })} />
                <ProfileField label="Vakgebied" value={segment.profile.field} onChange={(v) => update({ profile: { ...segment.profile, field: v } })} />
              </div>
            </Section>

            <Section title="📊 Vaardigheidsindicatoren">
              <div className="space-y-2.5">
                {segment.skills.map((skill, i) => (
                  <SkillSlider
                    key={i}
                    skill={skill}
                    accentColor={color.accent}
                    onChange={(updated) => {
                      const skills = [...segment.skills];
                      skills[i] = updated;
                      update({ skills });
                    }}
                  />
                ))}
              </div>
            </Section>

            <Section title="🖥️ Hardware">
              <DigitalLandscapeChips
                labels={segment.hardware}
                images={segment.hardwareImages}
                onChange={(labels, images) => update({ hardware: labels, hardwareImages: images })}
                onToolClick={(name, image) => setSelectedTool({ name, image })}
              />
            </Section>

            <Section title="💾 Software">
              <DigitalLandscapeChips
                labels={segment.software}
                images={segment.softwareImages}
                onChange={(labels, images) => update({ software: labels, softwareImages: images })}
                onToolClick={(name, image) => setSelectedTool({ name, image })}
              />
            </Section>

            <Section title="🙌 DOEN">
              <EditableList items={segment.doen} onChange={(items) => update({ doen: items })} />
              <AISuggestions segment={segment} field="doen" onApply={(s) => update({ doen: [...segment.doen, s] })} />
            </Section>

            <Section title="💭 DENKEN">
              <EditableList items={segment.denken} onChange={(items) => update({ denken: items })} />
            </Section>

            <Section title="❤️ VOELEN">
              <EditableList items={segment.voelen} onChange={(items) => update({ voelen: items })} />
              <AISuggestions segment={segment} field="voelen" onApply={(s) => update({ voelen: [...segment.voelen, s] })} />
            </Section>

            <Section title="✅ Wat werkt digitaal">
              <EditableList items={segment.worksDigitally} onChange={(items) => update({ worksDigitally: items })} />
              <AISuggestions segment={segment} field="worksDigitally" onApply={(s) => update({ worksDigitally: [...segment.worksDigitally, s] })} />
            </Section>

            <Section title="❌ Wat werkt NIET digitaal">
              <EditableList items={segment.doesNotWorkDigitally} onChange={(items) => update({ doesNotWorkDigitally: items })} />
            </Section>

            <Section title="🎯 Taken binnen de applicatie">
              <EditableList items={segment.tasks} onChange={(items) => update({ tasks: items })} />
            </Section>

            <Section title="💡 Behoeften">
              <EditableList items={segment.needs} onChange={(items) => update({ needs: items })} />
              <AISuggestions segment={segment} field="needs" onApply={(s) => update({ needs: [...segment.needs, s] })} />
            </Section>
          </div>
        )}

        {/* Tab: Design Implications */}
        {activeTab === 'implications' && (
          <ImplicationsPanel segment={segment} color={color} />
        )}
      </div>

      {/* Tool detail modal (portaled to body) */}
      {selectedTool && (
        <ToolDetailModal
          toolName={selectedTool.name}
          toolImage={selectedTool.image}
          segments={state.segments}
          onClose={() => setSelectedTool(null)}
        />
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.25s ease-out;
        }
      `}</style>
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">{title}</h3>
      {children}
    </div>
  );
}

function ProfileField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[11px] text-text-secondary">{label}</label>
      <EditableText value={value} onChange={onChange} className="text-sm font-medium" />
    </div>
  );
}
