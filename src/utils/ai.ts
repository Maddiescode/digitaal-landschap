import type { Segment, DesignImplication, EvidenceStrength } from '../types';

interface AISuggestion {
  field: string;
  original: string;
  suggestion: string;
  theory?: string;
}

const uxTheories: Record<string, string[]> = {
  needs: [
    'Cognitive Load Theory: Verminder de hoeveelheid informatie die tegelijk verwerkt moet worden.',
    'Mental Models: Sluit aan bij bestaande verwachtingen en gewoontes van de gebruiker.',
    'Self-Efficacy (Bandura): Versterk het gevoel van competentie door kleine successen.',
    'Zone of Proximal Development (Vygotsky): Bied ondersteuning net boven het huidige niveau.',
    'Progressive Disclosure: Toon eerst het essentieel, details op aanvraag.',
  ],
  doen: [
    'Habit Loop (Duhigg): Cue-Routine-Reward patronen bepalen digitaal gedrag.',
    'Satisficing (Simon): Gebruikers kiezen de eerste "goed genoeg" optie.',
    'Error Recovery (Norman): Maak fouten makkelijk herstelbaar.',
  ],
  voelen: [
    'Technology Acceptance Model: Perceived usefulness en ease of use bepalen adoptie.',
    'Flow Theory (Csikszentmihalyi): Balans tussen uitdaging en vaardigheid.',
    'Learned Helplessness: Herhaald falen leidt tot vermijdingsgedrag.',
  ],
};

const improvementTemplates: Record<string, (segment: Segment) => AISuggestion[]> = {
  needs: (segment) => {
    const suggestions: AISuggestion[] = [];
    if (segment.skills[0]?.level < 40) {
      suggestions.push({
        field: 'needs',
        original: '',
        suggestion: 'Contextgevoelige hulp die verschijnt op het juiste moment, niet als overweldigende handleiding',
        theory: uxTheories.needs[0],
      });
    }
    if (segment.skills[4]?.level < 30) {
      suggestions.push({
        field: 'needs',
        original: '',
        suggestion: 'Gamification-elementen die voortgang zichtbaar maken en kleine successen vieren',
        theory: uxTheories.needs[2],
      });
    }
    if (segment.skills[4]?.level > 60) {
      suggestions.push({
        field: 'needs',
        original: '',
        suggestion: 'Customizable workflows en keyboard shortcuts voor veelgebruikte acties',
        theory: uxTheories.needs[4],
      });
    }
    suggestions.push({
      field: 'needs',
      original: '',
      suggestion: `Interface-complexiteit afgestemd op ${segment.name} niveau: ${segment.skills[0]?.level < 50 ? 'minimalistisch met geleidelijke onthulling' : 'rijke interface met geavanceerde opties beschikbaar'}`,
      theory: uxTheories.needs[4],
    });
    return suggestions;
  },
  worksDigitally: (segment) => {
    const suggestions: AISuggestion[] = [];
    if (segment.skills[0]?.level < 50) {
      suggestions.push({
        field: 'worksDigitally',
        original: '',
        suggestion: 'Recognition over recall: gebruik bekende iconen en labels in plaats van abstracte symbolen',
        theory: 'Heuristic Evaluation (Nielsen): Herkenning boven herinnering vermindert cognitieve belasting.',
      });
    }
    return suggestions;
  },
};

export function getSimulatedSuggestions(segment: Segment, field: string): AISuggestion[] {
  const generator = improvementTemplates[field];
  if (generator) return generator(segment);
  return [{
    field,
    original: '',
    suggestion: `Overweeg hoe ${segment.name} gebruikers dit ervaren vanuit hun digitaal vaardigheidsniveau (${segment.skills[0]?.level}%).`,
    theory: 'User-Centered Design: Ontwerp vanuit het perspectief van de daadwerkelijke gebruiker.',
  }];
}

export function getSpellcheckSuggestions(text: string): { original: string; suggestion: string }[] {
  const commonFixes: [RegExp, string][] = [
    [/\bdigitaal\s+vaardig\b/gi, 'digitaalvaardig'],
    [/\bwat\s+betreft\b/gi, 'wat betreft'],
    [/\bivm\b/gi, 'in verband met'],
    [/\bmbt\b/gi, 'met betrekking tot'],
    [/\btzv\b/gi, 'ten behoeve van'],
  ];
  const suggestions: { original: string; suggestion: string }[] = [];
  for (const [pattern, fix] of commonFixes) {
    const match = text.match(pattern);
    if (match && match[0] !== fix) {
      suggestions.push({ original: match[0], suggestion: fix });
    }
  }
  return suggestions;
}

// ─── Design Implication Suggestions ────────────────────────────────────────

const simulatedImplications: ((segment: Segment) => DesignImplication | null)[] = [
  (seg) => {
    const avg = seg.skills.reduce((s, sk) => s + sk.level, 0) / (seg.skills.length || 1);
    if (avg >= 35) return null;
    return {
      id: crypto.randomUUID(),
      title: 'Gebruik stapsgewijze onboarding',
      description: 'Verberg geavanceerde functies achter progressieve onthulling. Toon één stap tegelijk en bevestig elke actie visueel.\n\n*Omdat: dit segment heeft een laag gemiddeld vaardigheidsniveau en vermijdt nieuwe digitale systemen.*',
      target: 'Onboarding flow',
      source: { name: 'Progressive Disclosure', url: 'https://www.nngroup.com/articles/progressive-disclosure/', evidenceStrength: 'high' },
      tags: ['onboarding', 'navigatie'],
      isAiGenerated: true,
    };
  },
  (seg) => {
    if (!seg.doesNotWorkDigitally.some(d => /abstract|icoon|icon|symbool/i.test(d))) return null;
    return {
      id: crypto.randomUUID(),
      title: 'Gebruik labels naast iconen',
      description: 'Combineer altijd een tekstlabel met een icoon. Vermijd pictogrammen zonder omschrijving in navigatie en actieknoppen.\n\n*Omdat: abstracte iconen zonder tekst worden expliciet benoemd als iets dat niet werkt voor dit segment.*',
      target: 'Navigatie, knoppen',
      source: { name: 'Icon Usability (Nielsen Norman Group)', url: 'https://www.nngroup.com/articles/icon-usability/', evidenceStrength: 'high' },
      tags: ['navigatie', 'toegankelijkheid'],
      isAiGenerated: true,
    };
  },
  (seg) => {
    const avg = seg.skills.reduce((s, sk) => s + sk.level, 0) / (seg.skills.length || 1);
    if (avg < 60) return null;
    return {
      id: crypto.randomUUID(),
      title: 'Bied sneltoetsen en bulk-acties aan',
      description: 'Voeg keyboard shortcuts toe voor veelgebruikte acties en bied mogelijkheden voor bulk-selectie en -verwerking.\n\n*Omdat: dit segment werkt efficiënt en verwacht power-user functionaliteiten.*',
      target: 'Takenlijsten, formulieren',
      source: { name: 'Flexibility and Efficiency of Use', url: 'https://www.nngroup.com/articles/ten-usability-heuristics/', evidenceStrength: 'high' },
      tags: ['efficiency', 'power-users'],
      isAiGenerated: true,
    };
  },
  (seg) => {
    if (!seg.voelen.some(v => /onzeker|angstig|bang|stress/i.test(v))) return null;
    return {
      id: crypto.randomUUID(),
      title: 'Geef duidelijke fout-herstel mogelijkheden',
      description: 'Zorg dat elke actie ongedaan gemaakt kan worden. Toon bevestigingsdialogen voor destructieve acties en geef geruststellende feedback.\n\n*Omdat: dit segment voelt zich onzeker bij digitale systemen en is bang fouten te maken.*',
      target: 'Formulieren, verwijder-acties',
      source: { name: 'Error Recovery (Norman)', url: 'https://www.nngroup.com/articles/ten-usability-heuristics/', evidenceStrength: 'high' },
      tags: ['foutafhandeling', 'vertrouwen'],
      isAiGenerated: true,
    };
  },
  (seg) => {
    return {
      id: crypto.randomUUID(),
      title: `Stem interface-complexiteit af op ${seg.name}`,
      description: `Ontwerp de informatiearchitectuur op basis van het vaardigheidsniveau van dit segment. ${seg.skills[0]?.level < 50 ? 'Gebruik een minimalistische lay-out met weinig keuzes per scherm.' : 'Bied een rijke interface met geavanceerde opties zichtbaar maar niet opdringend.'}\n\n*Omdat: de gemiddelde digitale vaardigheid van dit segment is ${Math.round(seg.skills.reduce((s, sk) => s + sk.level, 0) / (seg.skills.length || 1))}%.*`,
      target: 'Algemene lay-out',
      source: { name: 'Cognitive Load Theory', url: 'https://www.nngroup.com/articles/minimize-cognitive-load/', evidenceStrength: 'medium' },
      tags: ['informatiearchitectuur', 'cognitieve belasting'],
      isAiGenerated: true,
    };
  },
];

export function getSimulatedDesignImplicationSuggestions(segment: Segment): DesignImplication[] {
  return simulatedImplications
    .map(fn => fn(segment))
    .filter((r): r is DesignImplication => r !== null)
    .slice(0, 5);
}

export async function getDesignImplicationSuggestions(
  segment: Segment,
  apiKey: string
): Promise<DesignImplication[]> {
  try {
    const payload = {
      name: segment.name,
      shortDescription: segment.shortDescription,
      profile: segment.profile,
      skills: segment.skills,
      hardware: segment.hardware,
      software: segment.software,
      doen: segment.doen,
      denken: segment.denken,
      voelen: segment.voelen,
      worksDigitally: segment.worksDigitally,
      doesNotWorkDigitally: segment.doesNotWorkDigitally,
      needs: segment.needs,
    };

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [{
          role: 'user',
          content: `Je bent een senior UX-designer gespecialiseerd in digitale vaardigheidsverschillen.

Analyseer onderstaand gebruikerssegment en genereer 3 tot 5 concrete ontwerpimplicaties.
Elke implicatie is gebaseerd op een bewezen UX-principe of gedragspsychologisch inzicht.

Segment:
${JSON.stringify(payload, null, 2)}

Geef je antwoord als een JSON-array met exact deze structuur (geen extra tekst eromheen):
[
  {
    "title": "Korte actieve zin, max 8 woorden",
    "description": "Wat te ontwerpen en waarom, 1-3 zinnen, onderbouwd met het principe.",
    "target": "Specifiek UI-element of flow (optioneel, anders lege string)",
    "source": {
      "name": "Naam van het UX-principe of de theorie",
      "url": "https://echte-bron-url-of-lege-string",
      "evidenceStrength": "high"
    },
    "tags": ["tag1", "tag2"],
    "reasoning": "Korte 'omdat...' zin die verbindt met de segmentdata"
  }
]

Gebruik Nederlandse tekst in title, description, target en reasoning.
source.name mag in het Engels als het een gevestigd principe is.
evidenceStrength: "high" voor gevalideerde heuristieken (Nielsen, WCAG), "medium" voor modellen (TAM, Self-Efficacy), "low" voor inductieve redenering.`,
        }],
      }),
    });

    const data = await response.json();
    const content = data.content?.[0]?.text || '[]';
    // Strip possible markdown code fences
    const cleaned = content.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return parsed.map((raw: {
      title: string;
      description: string;
      target: string;
      source: { name: string; url: string; evidenceStrength: string };
      tags: string[];
      reasoning: string;
    }) => ({
      id: crypto.randomUUID(),
      title: raw.title,
      description: `${raw.description}\n\n*Omdat: ${raw.reasoning}*`,
      target: raw.target ?? '',
      source: {
        name: raw.source?.name ?? '',
        url: raw.source?.url ?? '',
        evidenceStrength: (raw.source?.evidenceStrength ?? 'medium') as EvidenceStrength,
      },
      tags: Array.isArray(raw.tags) ? raw.tags : [],
      isAiGenerated: true,
    }));
  } catch {
    return [{
      id: crypto.randomUUID(),
      title: 'Fout bij ophalen AI-suggesties',
      description: 'Kon geen design-implicaties ophalen. Controleer je API-sleutel en probeer opnieuw.',
      target: '',
      source: { name: '', url: '', evidenceStrength: 'low' },
      tags: [],
      isAiGenerated: true,
    }];
  }
}

export async function getClaudeAPISuggestions(
  segment: Segment,
  field: string,
  apiKey: string
): Promise<AISuggestion[]> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `Je bent een UX-expert. Analyseer dit gebruikerssegment en geef 2-3 concrete suggesties voor het veld "${field}".

Segment: ${segment.name} - ${segment.shortDescription}
Huidige ${field}: ${JSON.stringify((segment as Record<string, unknown>)[field])}
Vaardigheidsniveau: ${segment.skills.map(s => `${s.name}: ${s.level}%`).join(', ')}

Geef suggesties in JSON formaat: [{"suggestion": "...", "theory": "relevante UX/psychologie theorie"}]
Antwoord alleen met de JSON array, geen andere tekst.`,
        }],
      }),
    });
    const data = await response.json();
    const content = data.content?.[0]?.text || '[]';
    const parsed = JSON.parse(content);
    return parsed.map((s: { suggestion: string; theory?: string }) => ({
      field,
      original: '',
      suggestion: s.suggestion,
      theory: s.theory,
    }));
  } catch {
    return [{
      field,
      original: '',
      suggestion: 'Kon geen AI-suggesties ophalen. Controleer je API-sleutel.',
    }];
  }
}
