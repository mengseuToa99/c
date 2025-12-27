import { create } from 'zustand';
import { AppState } from './types';

// Detect device capabilities roughly for initial quality
const isLowPower = typeof navigator !== 'undefined' && navigator.hardwareConcurrency <= 4;

export const useStore = create<AppState>((set) => ({
  phase: 'LOADING',
  quality: isLowPower ? 'low' : 'high',
  setPhase: (phase) => set({ phase }),
  setQuality: (quality) => set({ quality }),
}));
