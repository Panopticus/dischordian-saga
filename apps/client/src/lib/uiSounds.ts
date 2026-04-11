/* ═══════════════════════════════════════════════════════
   UI MICRO-SOUNDS — Synthesized via Web Audio API

   Tiny procedural sounds for UI interactions:
   navigation clicks, notification chimes, dialog feedback,
   and reward sparkles. No audio files needed.

   Matches the oscillator + noise synthesis approach used
   in FightSoundManager and SoundContext.
   ═══════════════════════════════════════════════════════ */

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let _volume = 0.3;
let _muted = false;
let _initialized = false;

/* ─── HELPERS ─── */

function getCtx(): AudioContext | null {
  if (!_initialized || !ctx) return null;
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

function getDest(): GainNode | null {
  return masterGain;
}

function createNoiseBurst(
  volume: number,
  duration: number,
  dest: AudioNode,
  filterType?: BiquadFilterType,
  filterFreq?: number,
  filterQ?: number,
): void {
  const c = getCtx();
  if (!c) return;
  const now = c.currentTime;
  const bufferSize = Math.max(1, Math.floor(c.sampleRate * duration));
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const source = c.createBufferSource();
  source.buffer = buffer;
  const gain = c.createGain();
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  if (filterType && filterFreq) {
    const filter = c.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.value = filterFreq;
    if (filterQ) filter.Q.value = filterQ;
    source.connect(filter);
    filter.connect(gain);
  } else {
    source.connect(gain);
  }
  gain.connect(dest);
  source.start(now);
  source.stop(now + duration);
}

function createNoiseBuffer(
  c: AudioContext,
  duration: number,
  type: "white" | "pink" | "brown" = "white",
): AudioBuffer {
  const sampleRate = c.sampleRate;
  const length = Math.max(1, Math.floor(sampleRate * duration));
  const buffer = c.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    if (type === "white") {
      data[i] = white;
    } else if (type === "pink") {
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    } else {
      // Brown noise
      data[i] = (b0 + white * 0.02) * 0.5;
      b0 = data[i];
      if (b0 > 1) b0 = 1;
      if (b0 < -1) b0 = -1;
    }
  }
  return buffer;
}

/* ─── PUBLIC API ─── */

/** Lazy-initialize the AudioContext on first user interaction */
export function initAudioContext(): void {
  if (_initialized) return;
  try {
    ctx = new AudioContext();
    masterGain = ctx.createGain();
    masterGain.gain.value = _muted ? 0 : _volume;
    masterGain.connect(ctx.destination);
    _initialized = true;
  } catch (e) {
    console.warn("[UISounds] Web Audio API not available:", e);
  }
}

/** Set UI sound volume (0-1) */
export function setUIVolume(volume: number): void {
  _volume = Math.max(0, Math.min(1, volume));
  if (masterGain && ctx && !_muted) {
    masterGain.gain.setTargetAtTime(_volume, ctx.currentTime, 0.05);
  }
}

/** Set mute state */
export function setUIMuted(muted: boolean): void {
  _muted = muted;
  if (masterGain && ctx) {
    masterGain.gain.setTargetAtTime(muted ? 0 : _volume, ctx.currentTime, 0.05);
  }
}

/* ─── SYNTHESIZED UI SOUNDS ─── */

export const UISounds = {

  /* ═══ NAVIGATION ═══ */

  /** Very short, subtle high-pitched tick (1ms sine wave blip) */
  buttonHover(): void {
    const c = getCtx();
    const dest = getDest();
    if (!c || !dest) return;
    const now = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(4200, now);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.015);
  },

  /** Short click (5ms noise burst) */
  buttonClick(): void {
    const c = getCtx();
    const dest = getDest();
    if (!c || !dest) return;
    createNoiseBurst(0.12, 0.02, dest, "bandpass", 3000, 2);
    // Add a tiny tonal click
    const now = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1800, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.01);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.02);
  },

  /** Soft whoosh (filtered noise sweep, 50ms) */
  tabSwitch(): void {
    const c = getCtx();
    const dest = getDest();
    if (!c || !dest) return;
    const now = c.currentTime;
    const buf = createNoiseBuffer(c, 0.08, "pink");
    const src = c.createBufferSource();
    src.buffer = buf;
    const filter = c.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(3000, now + 0.03);
    filter.frequency.exponentialRampToValueAtTime(600, now + 0.06);
    filter.Q.value = 1.5;
    const gain = c.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    src.start(now);
    src.stop(now + 0.06);
  },

  /** Rising tone (sine 200->400Hz over 100ms) */
  menuOpen(): void {
    const c = getCtx();
    const dest = getDest();
    if (!c || !dest) return;
    const now = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.setValueAtTime(0.1, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.14);
  },

  /** Falling tone (sine 400->200Hz over 80ms) */
  menuClose(): void {
    const c = getCtx();
    const dest = getDest();
    if (!c || !dest) return;
    const now = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.12);
  },

  /* ═══ NOTIFICATIONS ═══ */

  /** Two-note chime (C5->E5, sine, 150ms) */
  notificationPing(): void {
    const c = getCtx();
    const dest = getDest();
    if (!c || !dest) return;
    const now = c.currentTime;
    // C5 = 523Hz
    const osc1 = c.createOscillator();
    const g1 = c.createGain();
    osc1.type = "sine";
    osc1.frequency.value = 523;
    g1.gain.setValueAtTime(0.15, now);
    g1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc1.connect(g1);
    g1.connect(dest);
    osc1.start(now);
    osc1.stop(now + 0.12);
    // E5 = 659Hz
    const osc2 = c.createOscillator();
    const g2 = c.createGain();
    osc2.type = "sine";
    osc2.frequency.value = 659;
    g2.gain.setValueAtTime(0, now);
    g2.gain.setValueAtTime(0.15, now + 0.08);
    g2.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc2.connect(g2);
    g2.connect(dest);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.2);
  },

  /** Three-note ascending (C5->E5->G5, 300ms) */
  achievementFanfare(): void {
    const c = getCtx();
    const dest = getDest();
    if (!c || !dest) return;
    const now = c.currentTime;
    const notes = [523, 659, 784]; // C5, E5, G5
    notes.forEach((freq, i) => {
      const delay = i * 0.1;
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0, now + delay);
      g.gain.linearRampToValueAtTime(0.18, now + delay + 0.03);
      g.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.25);
      osc.connect(g);
      g.connect(dest);
      osc.start(now + delay);
      osc.stop(now + delay + 0.25);
    });
    // Add a shimmer on top of the last note
    const shimmer = c.createOscillator();
    const sg = c.createGain();
    shimmer.type = "sine";
    shimmer.frequency.setValueAtTime(1568, now + 0.2); // G6
    shimmer.frequency.exponentialRampToValueAtTime(2000, now + 0.4);
    sg.gain.setValueAtTime(0.05, now + 0.2);
    sg.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    shimmer.connect(sg);
    sg.connect(dest);
    shimmer.start(now + 0.2);
    shimmer.stop(now + 0.45);
  },

  /** Low buzz (sawtooth 80Hz, 100ms) */
  errorBuzz(): void {
    const c = getCtx();
    const dest = getDest();
    if (!c || !dest) return;
    const now = c.currentTime;
    const osc = c.createOscillator();
    const filter = c.createBiquadFilter();
    const gain = c.createGain();
    osc.type = "sawtooth";
    osc.frequency.value = 80;
    filter.type = "lowpass";
    filter.frequency.value = 400;
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.setValueAtTime(0.15, now + 0.04);
    gain.gain.setValueAtTime(0, now + 0.05);
    gain.gain.setValueAtTime(0.15, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.12);
  },

  /* ═══ DIALOG ═══ */

  /** Mechanical click (noise + low sine, 30ms) */
  dialogWheelRotate(): void {
    const c = getCtx();
    const dest = getDest();
    if (!c || !dest) return;
    const now = c.currentTime;
    // Noise click
    createNoiseBurst(0.08, 0.015, dest, "bandpass", 2000, 3);
    // Low mechanical tone
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.03);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.04);
  },

  /** Confirmation tone (sine E4, 80ms with decay) */
  dialogSelect(): void {
    const c = getCtx();
    const dest = getDest();
    if (!c || !dest) return;
    const now = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.value = 330; // E4
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.1);
  },

  /** Single key click for KineticText (2ms noise) */
  typewriterKey(): void {
    const c = getCtx();
    const dest = getDest();
    if (!c || !dest) return;
    const now = c.currentTime;
    // Ultra-short noise pop
    const bufferSize = Math.max(1, Math.floor(c.sampleRate * 0.003));
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const src = c.createBufferSource();
    src.buffer = buffer;
    const filter = c.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 1500;
    const gain = c.createGain();
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.005);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    src.start(now);
    src.stop(now + 0.005);
  },

  /* ═══ REWARDS ═══ */

  /** Sparkle (high sine with vibrato, 200ms) */
  lootReveal(): void {
    const c = getCtx();
    const dest = getDest();
    if (!c || !dest) return;
    const now = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1800, now);
    osc.frequency.exponentialRampToValueAtTime(2400, now + 0.1);
    osc.frequency.exponentialRampToValueAtTime(1600, now + 0.2);
    // Vibrato via LFO
    const lfo = c.createOscillator();
    const lfoGain = c.createGain();
    lfo.type = "sine";
    lfo.frequency.value = 30;
    lfoGain.gain.value = 80;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(dest);
    lfo.start(now);
    osc.start(now);
    osc.stop(now + 0.25);
    lfo.stop(now + 0.25);
    // High shimmer overtone
    const shim = c.createOscillator();
    const sg = c.createGain();
    shim.type = "sine";
    shim.frequency.setValueAtTime(3600, now);
    shim.frequency.exponentialRampToValueAtTime(4800, now + 0.15);
    sg.gain.setValueAtTime(0.04, now);
    sg.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    shim.connect(sg);
    sg.connect(dest);
    shim.start(now);
    shim.stop(now + 0.2);
  },

  /** Paper flip sound (filtered noise, 60ms) */
  cardFlip(): void {
    const c = getCtx();
    const dest = getDest();
    if (!c || !dest) return;
    const now = c.currentTime;
    const buf = createNoiseBuffer(c, 0.08, "pink");
    const src = c.createBufferSource();
    src.buffer = buf;
    const filter = c.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(2000, now);
    filter.frequency.exponentialRampToValueAtTime(800, now + 0.06);
    filter.Q.value = 1;
    const gain = c.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    src.start(now);
    src.stop(now + 0.08);
  },

  /** Subtle tick for XP bar filling (1ms click) */
  xpTick(): void {
    const c = getCtx();
    const dest = getDest();
    if (!c || !dest) return;
    const now = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(3200, now);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.008);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.008);
  },
};

export type UISoundName = keyof typeof UISounds;
