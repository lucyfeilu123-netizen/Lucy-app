'use client';

import { useState } from 'react';
import { Palette, Volume2, X, Waves, TreePine, CloudRain, Stars, Mountain } from 'lucide-react';
import { useSettingsStore } from '@/stores/settings-store';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/lib/utils';

type AmbientTheme = 'none' | 'ocean' | 'forest' | 'rain' | 'starry' | 'snow';
type WhiteNoise = 'none' | 'rain' | 'forest' | 'ocean' | 'fire';

const themeOptions: { id: AmbientTheme; label: string; icon: React.ReactNode }[] = [
  { id: 'none', label: 'None', icon: <X size={16} /> },
  { id: 'ocean', label: 'Ocean', icon: <Waves size={16} /> },
  { id: 'forest', label: 'Forest', icon: <TreePine size={16} /> },
  { id: 'rain', label: 'Rain', icon: <CloudRain size={16} /> },
  { id: 'starry', label: 'Stars', icon: <Stars size={16} /> },
  { id: 'snow', label: 'Snow', icon: <Mountain size={16} /> },
];

const noiseOptions: { id: WhiteNoise; label: string }[] = [
  { id: 'none', label: 'Off' },
  { id: 'rain', label: '\u{1F327} Rain' },
  { id: 'forest', label: '\u{1F332} Forest' },
  { id: 'ocean', label: '\u{1F30A} Ocean' },
  { id: 'fire', label: '\u{1F525} Fire' },
];

export function AmbientPicker() {
  const [open, setOpen] = useState(false);
  const ambientTheme = useSettingsStore((s) => s.ambientTheme);
  const whiteNoise = useSettingsStore((s) => s.whiteNoise);
  const whiteNoiseVolume = useSettingsStore((s) => s.whiteNoiseVolume);
  const setAmbientTheme = useSettingsStore((s) => s.setAmbientTheme);
  const setWhiteNoise = useSettingsStore((s) => s.setWhiteNoise);
  const setWhiteNoiseVolume = useSettingsStore((s) => s.setWhiteNoiseVolume);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
          'text-[var(--fg-quiet)] hover:text-[var(--fg)] hover:bg-[var(--bg-quiet)]',
          ambientTheme !== 'none' && 'text-[var(--accent)]'
        )}
        title="Ambient & Sound"
      >
        <Palette size={16} />
        <span>Ambience</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[45]" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full left-0 mb-2 z-[46] w-64 rounded-xl border border-[var(--border)] bg-[var(--bg-raised)] p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-medium uppercase tracking-wider text-[var(--fg-quieter)]">
                Ambience
              </h4>
              <button onClick={() => setOpen(false)} className="text-[var(--fg-quieter)] hover:text-[var(--fg)]">
                <X size={14} />
              </button>
            </div>

            {/* Theme selection */}
            <div className="mb-4">
              <h4 className="text-xs font-medium text-[var(--fg-quieter)] mb-2">
                Background
              </h4>
              <div className="grid grid-cols-3 gap-1.5">
                {themeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setAmbientTheme(opt.id);
                      setOpen(false);
                      if (opt.id !== 'none') {
                        useUIStore.getState().setMobileMenuOpen(false);
                      }
                    }}
                    className={cn(
                      'flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-xs transition-colors',
                      ambientTheme === opt.id
                        ? 'bg-[var(--accent)] text-white'
                        : 'text-[var(--fg-quiet)] hover:bg-[var(--bg-quiet)]'
                    )}
                  >
                    {opt.icon}
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* White noise selection */}
            <div className="mb-4">
              <h4 className="text-xs font-medium text-[var(--fg-quieter)] mb-2">
                White Noise
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {noiseOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setWhiteNoise(opt.id)}
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                      whiteNoise === opt.id
                        ? 'bg-[var(--accent)] text-white'
                        : 'bg-[var(--bg-quiet)] text-[var(--fg-quiet)] hover:text-[var(--fg)]'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Volume slider */}
            {whiteNoise !== 'none' && (
              <div>
                <div className="flex items-center gap-2">
                  <Volume2 size={14} className="text-[var(--fg-quieter)] shrink-0" />
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={whiteNoiseVolume}
                    onChange={(e) => setWhiteNoiseVolume(parseFloat(e.target.value))}
                    className="flex-1 h-1.5 rounded-full appearance-none bg-[var(--bg-quiet)] accent-[var(--accent)]"
                  />
                  <span className="text-xs text-[var(--fg-quieter)] w-8 text-right">
                    {Math.round(whiteNoiseVolume * 100)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
