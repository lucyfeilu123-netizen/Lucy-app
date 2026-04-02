import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AmbientTheme = 'none' | 'ocean' | 'forest' | 'rain' | 'starry' | 'snow';
type WhiteNoise = 'none' | 'rain' | 'forest' | 'ocean' | 'fire';

interface SettingsStore {
  ambientTheme: AmbientTheme;
  whiteNoise: WhiteNoise;
  whiteNoiseVolume: number;

  setAmbientTheme: (theme: AmbientTheme) => void;
  setWhiteNoise: (noise: WhiteNoise) => void;
  setWhiteNoiseVolume: (vol: number) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ambientTheme: 'none',
      whiteNoise: 'none',
      whiteNoiseVolume: 0.5,

      setAmbientTheme: (theme) => set({ ambientTheme: theme }),
      setWhiteNoise: (noise) => set({ whiteNoise: noise }),
      setWhiteNoiseVolume: (vol) => set({ whiteNoiseVolume: vol }),
    }),
    { name: 'lucy-settings' }
  )
);
