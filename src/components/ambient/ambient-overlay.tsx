'use client';

import { useSettingsStore } from '@/stores/settings-store';
import { useAudio } from '@/hooks/use-audio';
import { OceanScene } from './ocean';
import { ForestScene } from './forest';
import { RainScene } from './rain';
import { StarrySkyScene } from './starry-sky';
import { SnowMountainScene } from './snow-mountain';

const scenes = {
  ocean: OceanScene,
  forest: ForestScene,
  rain: RainScene,
  starry: StarrySkyScene,
  snow: SnowMountainScene,
} as const;

export function AmbientOverlay() {
  const ambientTheme = useSettingsStore((s) => s.ambientTheme);
  const whiteNoise = useSettingsStore((s) => s.whiteNoise);
  const whiteNoiseVolume = useSettingsStore((s) => s.whiteNoiseVolume);

  useAudio(whiteNoise, whiteNoiseVolume);

  if (ambientTheme === 'none') return null;

  const Scene = scenes[ambientTheme];
  return <Scene active />;
}
