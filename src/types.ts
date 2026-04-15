export interface Profile {
  age: string;
  yearsAtCompany: string;
  education: string;
  field: string;
}

export interface SkillIndicator {
  name: string;
  level: number; // 0-100
}

export type EvidenceStrength = 'high' | 'medium' | 'low';

export interface ImplicationSource {
  name: string;              // e.g. "Nielsen Norman Group"
  url: string;               // clickable link (may be empty)
  evidenceStrength: EvidenceStrength;
}

export interface DesignImplication {
  id: string;                // crypto.randomUUID()
  title: string;             // short, actionable
  description: string;       // what + why (AI folds "Omdat: ..." reasoning in here)
  target: string;            // optional: specific UI element/flow
  source: ImplicationSource;
  tags: string[];
  isAiGenerated: boolean;
}

export interface Segment {
  id: string;
  name: string;
  shortDescription: string;
  profile: Profile;
  personaImage: string; // base64 or URL
  quotes: string[];
  skills: SkillIndicator[];
  hardware: string[];
  hardwareImages: string[];
  software: string[];
  softwareImages: string[];
  doen: string[];
  denken: string[];
  voelen: string[];
  worksDigitally: string[];
  doesNotWorkDigitally: string[];
  tasks: string[];
  needs: string[];
  designImplications: DesignImplication[];
}

export interface FrameworkState {
  segments: Segment[];
  selectedSegmentId: string | null;
  compareMode: boolean;
  compareIds: [string | null, string | null];
  activeDifference: [string, string] | null;
  aiMode: 'simulated' | 'claude';
  claudeApiKey: string;
  showAISettings: boolean;
  showEcosystem: boolean;
}

export type FrameworkAction =
  | { type: 'SELECT_SEGMENT'; id: string | null }
  | { type: 'UPDATE_SEGMENT'; id: string; updates: Partial<Segment> }
  | { type: 'TOGGLE_COMPARE' }
  | { type: 'SET_COMPARE_ID'; index: 0 | 1; id: string }
  | { type: 'SET_DIFFERENCE'; pair: [string, string] | null }
  | { type: 'SET_AI_MODE'; mode: 'simulated' | 'claude' }
  | { type: 'SET_API_KEY'; key: string }
  | { type: 'TOGGLE_AI_SETTINGS' }
  | { type: 'TOGGLE_ECOSYSTEM' }
  | { type: 'IMPORT_SEGMENTS'; segments: Segment[] };
