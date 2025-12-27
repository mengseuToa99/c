export type AppPhase = 'LOADING' | 'OFFERING' | 'OPENING' | 'RECEIVED' | 'EXPLODED';

export interface AppState {
  phase: AppPhase;
  quality: 'low' | 'high';
  setPhase: (phase: AppPhase) => void;
  setQuality: (quality: 'low' | 'high') => void;
}

export interface ParticleProps {
  count: number;
  color: string;
  size?: number;
  speed?: number;
  spread?: number;
}