import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from 'react';
import type { FrameworkState, FrameworkAction, Segment } from '../types';
import { defaultSegments } from '../data/defaultSegments';

const initialState: FrameworkState = {
  segments: defaultSegments,
  selectedSegmentId: null,
  compareMode: false,
  compareIds: [null, null],
  activeDifference: null,
  aiMode: 'simulated',
  claudeApiKey: '',
  showAISettings: false,
  showEcosystem: false,
};

function reducer(state: FrameworkState, action: FrameworkAction): FrameworkState {
  switch (action.type) {
    case 'SELECT_SEGMENT':
      if (state.compareMode && action.id) {
        const [first, second] = state.compareIds;
        if (!first) return { ...state, compareIds: [action.id, second] };
        if (!second && first !== action.id) return { ...state, compareIds: [first, action.id] };
        return { ...state, compareIds: [action.id, null] };
      }
      return { ...state, selectedSegmentId: action.id, activeDifference: null };
    case 'UPDATE_SEGMENT':
      return {
        ...state,
        segments: state.segments.map((s) =>
          s.id === action.id ? { ...s, ...action.updates } : s
        ),
      };
    case 'TOGGLE_COMPARE':
      return {
        ...state,
        compareMode: !state.compareMode,
        compareIds: [null, null],
        selectedSegmentId: null,
        activeDifference: null,
      };
    case 'SET_COMPARE_ID':
      const newIds: [string | null, string | null] = [...state.compareIds];
      newIds[action.index] = action.id;
      return { ...state, compareIds: newIds };
    case 'SET_DIFFERENCE':
      return { ...state, activeDifference: action.pair, selectedSegmentId: null };
    case 'SET_AI_MODE':
      return { ...state, aiMode: action.mode };
    case 'SET_API_KEY':
      return { ...state, claudeApiKey: action.key };
    case 'TOGGLE_AI_SETTINGS':
      return { ...state, showAISettings: !state.showAISettings };
    case 'TOGGLE_ECOSYSTEM':
      return { ...state, showEcosystem: !state.showEcosystem };
    case 'IMPORT_SEGMENTS':
      return { ...state, segments: action.segments };
    default:
      return state;
  }
}

const FrameworkContext = createContext<{
  state: FrameworkState;
  dispatch: Dispatch<FrameworkAction>;
} | null>(null);

export function FrameworkProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <FrameworkContext.Provider value={{ state, dispatch }}>
      {children}
    </FrameworkContext.Provider>
  );
}

export function useFramework() {
  const ctx = useContext(FrameworkContext);
  if (!ctx) throw new Error('useFramework must be used within FrameworkProvider');
  return ctx;
}

export function getSegmentById(segments: Segment[], id: string) {
  return segments.find((s) => s.id === id);
}

export function getSegmentColor(index: number) {
  const colors = [
    { bg: 'bg-segment-1-light', border: 'border-segment-1', text: 'text-green-700', accent: '#86efac' },
    { bg: 'bg-segment-2-light', border: 'border-segment-2', text: 'text-cyan-700', accent: '#67e8f9' },
    { bg: 'bg-segment-3-light', border: 'border-segment-3', text: 'text-blue-700', accent: '#93c5fd' },
    { bg: 'bg-segment-4-light', border: 'border-segment-4', text: 'text-indigo-700', accent: '#818cf8' },
    { bg: 'bg-segment-5-light', border: 'border-segment-5', text: 'text-indigo-800', accent: '#6366f1' },
  ];
  return colors[index] || colors[0];
}
