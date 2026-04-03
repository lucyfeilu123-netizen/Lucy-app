'use client';

import { X, Volume2, Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { useSettingsStore } from '@/stores/settings-store';
import { useTimerStore } from '@/stores/timer-store';
import { useAudio } from '@/hooks/use-audio';
import { useTimer } from '@/hooks/use-timer';
import { OceanScene } from './ocean';
import { ForestScene } from './forest';
import { RainScene } from './rain';
import { StarrySkyScene } from './starry-sky';
import { SnowMountainScene } from './snow-mountain';
import { cn, formatTime } from '@/lib/utils';

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

  useTimer();
  const { mode, status, remainingSeconds, totalSeconds } = useTimerStore();
  const start = useTimerStore((s) => s.start);
  const pause = useTimerStore((s) => s.pause);
  const reset = useTimerStore((s) => s.reset);
  const skip = useTimerStore((s) => s.skip);

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

      {/* Centered timer */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        {/* Timer circle */}
        <div className="relative mb-6">
          <svg width="200" height="200" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="85" fill="none" stroke="white" strokeOpacity={0.1} strokeWidth="4" />
            <circle
              cx="100" cy="100" r="85"
              fill="none" stroke="white" strokeOpacity={0.8} strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 85}
              strokeDashoffset={2 * Math.PI * 85 * (1 - (totalSeconds > 0 ? remainingSeconds / totalSeconds : 1))}
              transform="rotate(-90 100 100)"
              className="transition-[stroke-dashoffset] duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-white tabular-nums" style={{ fontFamily: 'var(--font-heading)' }}>
              {formatTime(remainingSeconds)}
            </span>
            <span className="text-sm text-white/60 capitalize mt-1">
              {mode === 'work' ? 'Focus' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
            </span>
          </div>
        </div>

        {/* Timer controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={reset}
            className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-white/20 transition-colors"
          >
            <RotateCcw size={18} />
          </button>
          <button
            onClick={status === 'running' ? pause : start}
            className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            {status === 'running' ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
          </button>
          <button
            onClick={skip}
            className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-white/20 transition-colors"
          >
            <SkipForward size={18} />
          </button>
        </div>
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
