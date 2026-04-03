// 5 beautiful procedural ringtones — 10 seconds each, generated via Web Audio API

export type RingtoneId = 'gentle-bells' | 'crystal-chime' | 'morning-bird' | 'zen-bowl' | 'soft-piano';

export const RINGTONES: { id: RingtoneId; name: string; emoji: string }[] = [
  { id: 'gentle-bells', name: 'Gentle Bells', emoji: '🔔' },
  { id: 'crystal-chime', name: 'Crystal Chime', emoji: '✨' },
  { id: 'morning-bird', name: 'Morning Bird', emoji: '🐦' },
  { id: 'zen-bowl', name: 'Zen Bowl', emoji: '🔮' },
  { id: 'soft-piano', name: 'Soft Piano', emoji: '🎹' },
];

function playNote(ctx: AudioContext, freq: number, startTime: number, duration: number, volume: number, type: OscillatorType = 'sine') {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.05);
  gain.gain.setValueAtTime(volume, startTime + duration * 0.6);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

function playBell(ctx: AudioContext, freq: number, startTime: number, volume: number) {
  // Bell = fundamental + overtones that decay at different rates
  const harmonics = [1, 2.4, 3, 4.2, 5.4];
  const volumes = [1, 0.5, 0.35, 0.25, 0.15];
  for (let i = 0; i < harmonics.length; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq * harmonics[i];
    gain.gain.setValueAtTime(volume * volumes[i], startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.5 - i * 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + 2);
  }
}

// 1. Gentle Bells — soft bell tones in a descending pattern, repeat 3x
function playGentleBells(ctx: AudioContext) {
  const notes = [784, 659, 523, 440]; // G5 E5 C5 A4
  for (let rep = 0; rep < 3; rep++) {
    const base = rep * 3.3;
    for (let i = 0; i < notes.length; i++) {
      playBell(ctx, notes[i], ctx.currentTime + base + i * 0.6, 0.12);
    }
  }
}

// 2. Crystal Chime — high sparkly notes, ascending then descending
function playCrystalChime(ctx: AudioContext) {
  const up = [1047, 1175, 1319, 1397, 1568]; // C6 D6 E6 F6 G6
  const down = [1397, 1319, 1175, 1047];
  for (let rep = 0; rep < 2; rep++) {
    const base = rep * 5;
    for (let i = 0; i < up.length; i++) {
      playNote(ctx, up[i], ctx.currentTime + base + i * 0.35, 0.8, 0.15, 'sine');
    }
    for (let i = 0; i < down.length; i++) {
      playNote(ctx, down[i], ctx.currentTime + base + 2 + i * 0.35, 0.8, 0.12, 'sine');
    }
  }
}

// 3. Morning Bird — cheerful chirp pattern with trills
function playMorningBird(ctx: AudioContext) {
  const chirps = [
    { notes: [2093, 2349, 2637], gap: 0.08 }, // fast trill up
    { notes: [2637, 2349], gap: 0.12 },        // down
    { notes: [1760, 2093, 2349, 2637, 2794], gap: 0.07 }, // long trill
    { notes: [2794, 2349], gap: 0.15 },        // resolve
  ];
  for (let rep = 0; rep < 3; rep++) {
    let t = rep * 3.2;
    for (const chirp of chirps) {
      for (const note of chirp.notes) {
        playNote(ctx, note, ctx.currentTime + t, 0.15, 0.1, 'sine');
        t += chirp.gap;
      }
      t += 0.3;
    }
  }
}

// 4. Zen Bowl — deep resonating singing bowl strikes
function playZenBowl(ctx: AudioContext) {
  const freqs = [220, 330, 262]; // A3, E4, C4 — harmonious bowl tones
  for (let rep = 0; rep < 3; rep++) {
    const base = rep * 3.5;
    const freq = freqs[rep % freqs.length];
    // Singing bowl has long sustain with beating harmonics
    const harmonics = [1, 2, 3, 4.2, 5.8];
    const vols = [0.15, 0.08, 0.06, 0.04, 0.025];
    for (let i = 0; i < harmonics.length; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq * harmonics[i];
      // Add slight frequency wobble for beating effect
      osc.frequency.setValueAtTime(freq * harmonics[i], ctx.currentTime + base);
      osc.frequency.linearRampToValueAtTime(freq * harmonics[i] * 1.002, ctx.currentTime + base + 1);
      osc.frequency.linearRampToValueAtTime(freq * harmonics[i], ctx.currentTime + base + 2.5);
      gain.gain.setValueAtTime(0, ctx.currentTime + base);
      gain.gain.linearRampToValueAtTime(vols[i], ctx.currentTime + base + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + base + 3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + base);
      osc.stop(ctx.currentTime + base + 3.2);
    }
  }
}

// 5. Soft Piano — gentle chord progression (C major → F major → G major → C major)
function playSoftPiano(ctx: AudioContext) {
  const chords = [
    [262, 330, 392],  // C major
    [349, 440, 523],  // F major
    [392, 494, 587],  // G major
    [262, 330, 392],  // C major (resolve)
  ];
  for (let rep = 0; rep < 2; rep++) {
    const base = rep * 5;
    for (let c = 0; c < chords.length; c++) {
      const chord = chords[c];
      for (let n = 0; n < chord.length; n++) {
        // Stagger notes slightly for piano feel
        playNote(ctx, chord[n], ctx.currentTime + base + c * 1.2 + n * 0.04, 1.5, 0.1, 'triangle');
      }
    }
  }
}

let currentCtx: AudioContext | null = null;

export function stopRingtone() {
  if (currentCtx) {
    try { currentCtx.close(); } catch {}
    currentCtx = null;
  }
}

export function playRingtone(id: RingtoneId): void {
  stopRingtone();
  const ctx = new AudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  currentCtx = ctx;

  switch (id) {
    case 'gentle-bells': playGentleBells(ctx); break;
    case 'crystal-chime': playCrystalChime(ctx); break;
    case 'morning-bird': playMorningBird(ctx); break;
    case 'zen-bowl': playZenBowl(ctx); break;
    case 'soft-piano': playSoftPiano(ctx); break;
  }

  // Auto-stop after 10 seconds
  setTimeout(() => {
    if (currentCtx === ctx) {
      stopRingtone();
    }
  }, 10000);
}
