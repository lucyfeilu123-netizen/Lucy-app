'use client';

import { X, Volume2 } from 'lucide-react';
import { useSettingsStore } from '@/stores/settings-store';
import { useAudio } from '@/hooks/use-audio';
import { OceanScene } from './ocean';
import { ForestScene } from './forest';
import { RainScene } from './rain';
import { StarrySkyScene } from './starry-sky';
import { SnowMountainScene } from './snow-mountain';
import { cn } from '@/lib/utils';

const scenes = {
  ocean: OceanScene,
  forest: ForestScene,
  rain: RainScene,
  starry: StarrySkyScene,
  snow: SnowMountainScene,
} as const;

const sceneLabels = {
  ocean: 'Ocean',
  forest: 'Forest',
  rain: 'Rain',
  starry: 'Starry Sky',
  snow: 'Snow Mountain',
} as const;

export function AmbientOverlay() {
  const ambientTheme = useSettingsStore((s) => s.ambientTheme);
  const whiteNoise = useSettingsStore((s) => s.whiteNoise);
  const whiteNoiseVolume = useSettingsStore((s) => s.whiteNoiseVolume);
  const setAmbientTheme = useSettingsStore((s) => s.setAmbientTheme);
  const setWhiteNoiseVolume = useSettingsStore((s) => s.setWhiteNoiseVolume);

  useAudio(whiteNoise, whiteNoiseVolume);

  if (ambientTheme === 'none') return null;

  const Scene = scenes[ambientTheme];

  return (
    <div className="fixed inset-0 z-[60] flex flex-col" style={{ height: '100dvh', width: '100vw' }}>
      {/* Full-screen canvas background */}
      <div className="absolute inset-0">
        <Scene active />
      </div>

      {/* Top bar with close button */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-[env(safe-area-inset-top,12px)] pb-2">
        <div className="flex items-center gap-2 mt-3">
          <span className="text-white/80 text-sm font-medium" style={{ fontFamily: 'var(--font-heading)' }}>
            {sceneLabels[ambientTheme]}
          </span>
        </div>
        <button
          onClick={() => setAmbientTheme('none')}
          className={cn(
            'flex items-center gap-2 rounded-full px-4 py-2 mt-3',
            'bg-black/40 backdrop-blur-md text-white/90 text-sm font-medium',
            'hover:bg-black/60 active:bg-black/70 transition-colors'
          )}
        >
          <X size={16} />
          Close
        </button>
      </div>

      {/* Bottom controls */}
      <div className="relative z-10 mt-auto pb-[env(safe-area-inset-bottom,20px)] px-4">
        {/* Volume control if white noise is on */}
        {whiteNoise !== 'none' && (
          <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md rounded-full px-4 py-3 mb-4 max-w-xs mx-auto">
            <Volume2 size={16} className="text-white/70 shrink-0" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={whiteNoiseVolume}
              onChange={(e) => setWhiteNoiseVolume(parseFloat(e.target.value))}
              className="flex-1 h-1 rounded-full appearance-none bg-white/20 accent-white"
            />
            <span className="text-white/60 text-xs w-8 text-right">
              {Math.round(whiteNoiseVolume * 100)}%
            </span>
          </div>
        )}

        {/* Tap to close hint */}
        <p className="text-center text-white/40 text-xs mb-4">
          Tap Close or swipe to return
        </p>
      </div>
    </div>
  );
}
