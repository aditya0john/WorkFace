import { create } from 'zustand';

interface CaptureState {
  capturedUri: string | null;
  setCapturedUri: (uri: string | null) => void;
}

export const useCaptureStore = create<CaptureState>((set) => ({
  capturedUri: null,
  setCapturedUri: (uri) => set({ capturedUri: uri }),
}));