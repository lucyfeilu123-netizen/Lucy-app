'use client';

import { useEffect, useRef } from 'react';

type NoiseType = 'none' | 'rain' | 'forest' | 'ocean' | 'fire';

function createNoiseBuffer(ctx: AudioContext, duration: number): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * duration;
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function setupRain(ctx: AudioContext, gain: GainNode) {
  const buffer = createNoiseBuffer(ctx, 2);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.value = 800;
  bandpass.Q.value = 0.5;

  const highpass = ctx.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.value = 400;

  source.connect(bandpass);
  bandpass.connect(highpass);
  highpass.connect(gain);
  source.start();
  return source;
}

function setupOcean(ctx: AudioContext, gain: GainNode) {
  const buffer = createNoiseBuffer(ctx, 4);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 500;

  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.1;
  lfo.type = 'sine';
  lfoGain.gain.value = 0.3;
  lfo.connect(lfoGain);
  lfoGain.connect(gain.gain);
  lfo.start();

  source.connect(lowpass);
  lowpass.connect(gain);
  source.start();
  return source;
}

function setupForest(ctx: AudioContext, gain: GainNode) {
  const buffer = createNoiseBuffer(ctx, 2);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 300;

  const subGain = ctx.createGain();
  subGain.gain.value = 0.4;

  source.connect(lowpass);
  lowpass.connect(subGain);
  subGain.connect(gain);
  source.start();
  return source;
}

function setupFire(ctx: AudioContext, gain: GainNode) {
  const buffer = createNoiseBuffer(ctx, 2);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 200;

  const highpass = ctx.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.value = 50;

  source.connect(lowpass);
  lowpass.connect(highpass);
  highpass.connect(gain);
  source.start();
  return source;
}

export function useAudio(type: NoiseType, volume: number) {
  const ctxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (type === 'none') {
      if (sourceRef.current) {
        sourceRef.current.stop();
        sourceRef.current = null;
      }
      if (ctxRef.current) {
        ctxRef.current.close();
        ctxRef.current = null;
      }
      return;
    }

    const ctx = new AudioContext();
    ctxRef.current = ctx;
    const gain = ctx.createGain();
    gain.gain.value = volume * 0.5;
    gain.connect(ctx.destination);
    gainRef.current = gain;

    let source: AudioBufferSourceNode;
    switch (type) {
      case 'rain': source = setupRain(ctx, gain); break;
      case 'ocean': source = setupOcean(ctx, gain); break;
      case 'forest': source = setupForest(ctx, gain); break;
      case 'fire': source = setupFire(ctx, gain); break;
    }
    sourceRef.current = source;

    return () => {
      try {
        source.stop();
        ctx.close();
      } catch {}
    };
  }, [type]);

  useEffect(() => {
    if (gainRef.current) {
      gainRef.current.gain.value = volume * 0.5;
    }
  }, [volume]);
}
