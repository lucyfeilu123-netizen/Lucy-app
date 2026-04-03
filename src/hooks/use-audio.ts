'use client';

import { useEffect, useRef } from 'react';

type NoiseType = 'none' | 'rain' | 'forest' | 'ocean' | 'fire';

// Create a longer, smoother noise buffer for more natural sound
function createNoiseBuffer(ctx: AudioContext, duration: number): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * duration;
  const buffer = ctx.createBuffer(2, length, sampleRate); // stereo
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    // Brown noise (smoother than white noise) — integrate white noise
    let last = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5; // scale up
    }
  }
  return buffer;
}

// Gentle rain: soft hiss with slight high-frequency shimmer
function setupRain(ctx: AudioContext, gain: GainNode): AudioBufferSourceNode {
  const buffer = createNoiseBuffer(ctx, 4);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  // Gentle bandpass — like rain on a window
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 2500;
  lowpass.Q.value = 0.3;

  const highpass = ctx.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.value = 200;
  highpass.Q.value = 0.3;

  // Add a subtle shimmer layer
  const shimmer = ctx.createBiquadFilter();
  shimmer.type = 'peaking';
  shimmer.frequency.value = 3000;
  shimmer.gain.value = 3;
  shimmer.Q.value = 0.5;

  source.connect(highpass);
  highpass.connect(lowpass);
  lowpass.connect(shimmer);
  shimmer.connect(gain);
  source.start();
  return source;
}

// Ocean: slow rolling waves with deep bass
function setupOcean(ctx: AudioContext, gain: GainNode): AudioBufferSourceNode {
  const buffer = createNoiseBuffer(ctx, 6);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  // Deep, warm lowpass
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 400;
  lowpass.Q.value = 0.5;

  // Slow volume modulation to simulate waves
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.08; // very slow wave rhythm
  lfo.type = 'sine';
  lfoGain.gain.value = 0.15;
  lfo.connect(lfoGain);
  lfoGain.connect(gain.gain);
  lfo.start();

  // Second wave layer slightly offset
  const lfo2 = ctx.createOscillator();
  const lfoGain2 = ctx.createGain();
  lfo2.frequency.value = 0.12;
  lfo2.type = 'sine';
  lfoGain2.gain.value = 0.08;
  lfo2.connect(lfoGain2);
  lfoGain2.connect(gain.gain);
  lfo2.start();

  source.connect(lowpass);
  lowpass.connect(gain);
  source.start();
  return source;
}

// Forest: very soft rustling with gentle wind
function setupForest(ctx: AudioContext, gain: GainNode): AudioBufferSourceNode {
  const buffer = createNoiseBuffer(ctx, 5);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  // Soft wind through trees — low frequencies
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 600;
  lowpass.Q.value = 0.2;

  const highpass = ctx.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.value = 80;

  // Gentle wind modulation
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.15;
  lfo.type = 'sine';
  lfoGain.gain.value = 0.1;
  lfo.connect(lfoGain);
  lfoGain.connect(lowpass.frequency);
  lfo.start();

  // Reduce overall volume — forest should be very quiet and peaceful
  const subGain = ctx.createGain();
  subGain.gain.value = 0.6;

  source.connect(highpass);
  highpass.connect(lowpass);
  lowpass.connect(subGain);
  subGain.connect(gain);
  source.start();
  return source;
}

// Fire: warm crackling with low rumble
function setupFire(ctx: AudioContext, gain: GainNode): AudioBufferSourceNode {
  const buffer = createNoiseBuffer(ctx, 4);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  // Warm low-mid frequencies
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 350;
  lowpass.Q.value = 0.3;

  const highpass = ctx.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.value = 40;

  // Add a warm mid boost for crackle character
  const midBoost = ctx.createBiquadFilter();
  midBoost.type = 'peaking';
  midBoost.frequency.value = 250;
  midBoost.gain.value = 4;
  midBoost.Q.value = 0.8;

  // Random crackle modulation
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 3;
  lfo.type = 'sawtooth';
  lfoGain.gain.value = 0.05;
  lfo.connect(lfoGain);
  lfoGain.connect(gain.gain);
  lfo.start();

  source.connect(highpass);
  highpass.connect(lowpass);
  lowpass.connect(midBoost);
  midBoost.connect(gain);
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
        try { sourceRef.current.stop(); } catch {}
        sourceRef.current = null;
      }
      if (ctxRef.current) {
        try { ctxRef.current.close(); } catch {}
        ctxRef.current = null;
      }
      gainRef.current = null;
      return;
    }

    const ctx = new AudioContext();
    // iOS Safari requires resume after user gesture
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    ctxRef.current = ctx;

    const gain = ctx.createGain();
    gain.gain.value = volume * 0.3; // lower base volume for peaceful sound
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
      gainRef.current.gain.value = volume * 0.3;
    }
  }, [volume]);
}
