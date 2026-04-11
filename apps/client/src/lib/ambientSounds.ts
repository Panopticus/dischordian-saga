/* ═══════════════════════════════════════════════════════
   AMBIENT ROOM SOUNDS — Procedural Soundscapes via Web Audio API

   Each room aboard the ship has a distinct ambient soundscape
   built entirely from oscillators and noise generators.
   Supports crossfading between rooms for seamless transitions.

   Matches the synthesis approach in FightSoundManager
   and SoundContext's ProceduralSoundEngine.
   ═══════════════════════════════════════════════════════ */

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let _volume = 0.25;
let _muted = false;
let _initialized = false;

/** Active nodes for the current room so we can clean up */
interface ActiveLayer {
  oscillators: OscillatorNode[];
  sources: AudioBufferSourceNode[];
  gains: GainNode[];
  filters: BiquadFilterNode[];
  timers: ReturnType<typeof setTimeout>[];
  roomGain: GainNode;
}

let activeRoom: { id: string; layer: ActiveLayer } | null = null;

/* ─── HELPERS ─── */

function getCtx(): AudioContext | null {
  if (!_initialized || !ctx) return null;
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
  return ctx;
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
  let b0 = 0;

  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    if (type === "white") {
      data[i] = white;
    } else if (type === "pink") {
      // Simplified pink noise
      b0 = 0.99 * b0 + white * 0.1;
      data[i] = b0 + white * 0.2;
    } else {
      // Brown noise
      data[i] = (b0 + white * 0.02) * 3.5;
      b0 = data[i] / 3.5;
      if (b0 > 1) b0 = 1;
      if (b0 < -1) b0 = -1;
    }
  }
  return buffer;
}

function makeLayer(): ActiveLayer {
  const c = getCtx()!;
  const roomGain = c.createGain();
  roomGain.gain.value = 0;
  roomGain.connect(masterGain!);
  return { oscillators: [], sources: [], gains: [], filters: [], timers: [], roomGain };
}

function fadeInLayer(layer: ActiveLayer, durationMs: number): void {
  const c = getCtx();
  if (!c) return;
  layer.roomGain.gain.setTargetAtTime(1, c.currentTime, durationMs / 5000);
}

function fadeOutAndCleanup(layer: ActiveLayer, durationMs: number): void {
  const c = getCtx();
  if (!c) return;
  layer.roomGain.gain.setTargetAtTime(0, c.currentTime, durationMs / 5000);
  const cleanupDelay = durationMs + 500;
  const timer = setTimeout(() => {
    for (const osc of layer.oscillators) {
      try { osc.stop(); } catch { /* already stopped */ }
    }
    for (const src of layer.sources) {
      try { src.stop(); } catch { /* already stopped */ }
    }
    for (const g of layer.gains) {
      try { g.disconnect(); } catch {}
    }
    for (const f of layer.filters) {
      try { f.disconnect(); } catch {}
    }
    for (const t of layer.timers) {
      clearTimeout(t);
    }
    try { layer.roomGain.disconnect(); } catch {}
  }, cleanupDelay);
  layer.timers.push(timer);
}

function scheduleRandom(
  layer: ActiveLayer,
  callback: () => void,
  minMs: number,
  maxMs: number,
): void {
  const schedule = () => {
    const delay = minMs + Math.random() * (maxMs - minMs);
    const timer = setTimeout(() => {
      callback();
      schedule();
    }, delay);
    layer.timers.push(timer);
  };
  schedule();
}

/* ─── INITIALIZATION ─── */

function initAmbientAudio(): void {
  if (_initialized) return;
  try {
    ctx = new AudioContext();
    masterGain = ctx.createGain();
    masterGain.gain.value = _muted ? 0 : _volume;
    masterGain.connect(ctx.destination);
    _initialized = true;
  } catch (e) {
    console.warn("[Ambient] Web Audio API not available:", e);
  }
}

export function setAmbientVolume(volume: number): void {
  _volume = Math.max(0, Math.min(1, volume));
  if (masterGain && ctx && !_muted) {
    masterGain.gain.setTargetAtTime(_volume, ctx.currentTime, 0.1);
  }
}

export function setAmbientMuted(muted: boolean): void {
  _muted = muted;
  if (masterGain && ctx) {
    masterGain.gain.setTargetAtTime(muted ? 0 : _volume, ctx.currentTime, 0.1);
  }
}

/* ─── ROOM SOUNDSCAPE BUILDERS ─── */

function buildCryoBay(layer: ActiveLayer): void {
  const c = getCtx()!;
  const dest = layer.roomGain;

  // Deep hum at 30Hz
  const hum = c.createOscillator();
  const humGain = c.createGain();
  hum.type = "sine";
  hum.frequency.value = 30;
  humGain.gain.value = 0.3;
  hum.connect(humGain);
  humGain.connect(dest);
  hum.start();
  layer.oscillators.push(hum);
  layer.gains.push(humGain);

  // Second harmonic for richness
  const hum2 = c.createOscillator();
  const hum2Gain = c.createGain();
  hum2.type = "sine";
  hum2.frequency.value = 60;
  hum2Gain.gain.value = 0.1;
  hum2.connect(hum2Gain);
  hum2Gain.connect(dest);
  hum2.start();
  layer.oscillators.push(hum2);
  layer.gains.push(hum2Gain);

  // Slow LFO on hum for gentle throb
  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  lfo.type = "sine";
  lfo.frequency.value = 0.08;
  lfoGain.gain.value = 5;
  lfo.connect(lfoGain);
  lfoGain.connect(hum.frequency);
  lfo.start();
  layer.oscillators.push(lfo);
  layer.gains.push(lfoGain);

  // Occasional ice crackle (noise burst every 5-10s)
  scheduleRandom(layer, () => {
    const c2 = getCtx();
    if (!c2) return;
    const now = c2.currentTime;
    const bufLen = 0.04 + Math.random() * 0.06;
    const bufSize = Math.max(1, Math.floor(c2.sampleRate * bufLen));
    const buf = c2.createBuffer(1, bufSize, c2.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 0.3);
    }
    const src = c2.createBufferSource();
    src.buffer = buf;
    const filt = c2.createBiquadFilter();
    filt.type = "highpass";
    filt.frequency.value = 4000 + Math.random() * 3000;
    const g = c2.createGain();
    g.gain.setValueAtTime(0.06 + Math.random() * 0.06, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + bufLen);
    src.connect(filt);
    filt.connect(g);
    g.connect(dest);
    src.start(now);
    src.stop(now + bufLen);
  }, 5000, 10000);
}

function buildBridge(layer: ActiveLayer): void {
  const c = getCtx()!;
  const dest = layer.roomGain;

  // Engine drone — filtered brown noise
  const noiseBuf = createNoiseBuffer(c, 4, "brown");
  const noiseSrc = c.createBufferSource();
  noiseSrc.buffer = noiseBuf;
  noiseSrc.loop = true;
  const noiseFilter = c.createBiquadFilter();
  noiseFilter.type = "lowpass";
  noiseFilter.frequency.value = 200;
  noiseFilter.Q.value = 1;
  const noiseGain = c.createGain();
  noiseGain.gain.value = 0.15;
  noiseSrc.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(dest);
  noiseSrc.start();
  layer.sources.push(noiseSrc);
  layer.filters.push(noiseFilter);
  layer.gains.push(noiseGain);

  // Console beeping — sine pings at random intervals
  scheduleRandom(layer, () => {
    const c2 = getCtx();
    if (!c2) return;
    const now = c2.currentTime;
    const freq = 800 + Math.random() * 1200;
    const osc = c2.createOscillator();
    const g = c2.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.04, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(g);
    g.connect(dest);
    osc.start(now);
    osc.stop(now + 0.08);
  }, 2000, 6000);

  // Occasional double-beep
  scheduleRandom(layer, () => {
    const c2 = getCtx();
    if (!c2) return;
    const now = c2.currentTime;
    const freq = 1200;
    [0, 0.12].forEach((delay) => {
      const osc = c2.createOscillator();
      const g = c2.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0.03, now + delay);
      g.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.06);
      osc.connect(g);
      g.connect(dest);
      osc.start(now + delay);
      osc.stop(now + delay + 0.06);
    });
  }, 8000, 15000);
}

function buildMedicalBay(layer: ActiveLayer): void {
  const c = getCtx()!;
  const dest = layer.roomGain;

  // Heart monitor beep — sine 880Hz, 50ms every 1s
  const beepInterval = setInterval(() => {
    const c2 = getCtx();
    if (!c2) return;
    const now = c2.currentTime;
    const osc = c2.createOscillator();
    const g = c2.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    g.gain.setValueAtTime(0.06, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.connect(g);
    g.connect(dest);
    osc.start(now);
    osc.stop(now + 0.06);
  }, 1000);
  layer.timers.push(beepInterval as unknown as ReturnType<typeof setTimeout>);

  // Ventilation hiss — filtered white noise
  const noiseBuf = createNoiseBuffer(c, 3, "white");
  const noiseSrc = c.createBufferSource();
  noiseSrc.buffer = noiseBuf;
  noiseSrc.loop = true;
  const filter = c.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 3000;
  filter.Q.value = 0.5;
  const noiseGain = c.createGain();
  noiseGain.gain.value = 0.04;
  noiseSrc.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(dest);
  noiseSrc.start();
  layer.sources.push(noiseSrc);
  layer.filters.push(filter);
  layer.gains.push(noiseGain);

  // Subtle low hum from equipment
  const hum = c.createOscillator();
  const humGain = c.createGain();
  hum.type = "sine";
  hum.frequency.value = 50;
  humGain.gain.value = 0.05;
  hum.connect(humGain);
  humGain.connect(dest);
  hum.start();
  layer.oscillators.push(hum);
  layer.gains.push(humGain);
}

function buildEngineering(layer: ActiveLayer): void {
  const c = getCtx()!;
  const dest = layer.roomGain;

  // Heavy machinery — low sawtooth 40Hz
  const saw = c.createOscillator();
  const sawFilter = c.createBiquadFilter();
  const sawGain = c.createGain();
  saw.type = "sawtooth";
  saw.frequency.value = 40;
  sawFilter.type = "lowpass";
  sawFilter.frequency.value = 120;
  sawFilter.Q.value = 3;
  sawGain.gain.value = 0.2;
  saw.connect(sawFilter);
  sawFilter.connect(sawGain);
  sawGain.connect(dest);
  saw.start();
  layer.oscillators.push(saw);
  layer.filters.push(sawFilter);
  layer.gains.push(sawGain);

  // Pulsing LFO on the machinery
  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  lfo.type = "sine";
  lfo.frequency.value = 0.3;
  lfoGain.gain.value = 15;
  lfo.connect(lfoGain);
  lfoGain.connect(sawFilter.frequency);
  lfo.start();
  layer.oscillators.push(lfo);
  layer.gains.push(lfoGain);

  // Steam hiss bursts at random intervals
  scheduleRandom(layer, () => {
    const c2 = getCtx();
    if (!c2) return;
    const now = c2.currentTime;
    const duration = 0.15 + Math.random() * 0.2;
    const buf = createNoiseBuffer(c2, duration, "white");
    const src = c2.createBufferSource();
    src.buffer = buf;
    const filt = c2.createBiquadFilter();
    filt.type = "highpass";
    filt.frequency.value = 2500 + Math.random() * 2000;
    const g = c2.createGain();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.08 + Math.random() * 0.05, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, now + duration);
    src.connect(filt);
    filt.connect(g);
    g.connect(dest);
    src.start(now);
    src.stop(now + duration);
  }, 3000, 8000);

  // Metallic clangs
  scheduleRandom(layer, () => {
    const c2 = getCtx();
    if (!c2) return;
    const now = c2.currentTime;
    const osc = c2.createOscillator();
    const g = c2.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(600 + Math.random() * 400, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);
    g.gain.setValueAtTime(0.03, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(g);
    g.connect(dest);
    osc.start(now);
    osc.stop(now + 0.1);
  }, 6000, 14000);
}

function buildArchives(layer: ActiveLayer): void {
  const c = getCtx()!;
  const dest = layer.roomGain;

  // Near silence — very quiet distant hum
  const hum = c.createOscillator();
  const humGain = c.createGain();
  hum.type = "sine";
  hum.frequency.value = 55;
  humGain.gain.value = 0.03;
  hum.connect(humGain);
  humGain.connect(dest);
  hum.start();
  layer.oscillators.push(hum);
  layer.gains.push(humGain);

  // Occasional page turn — soft filtered noise
  scheduleRandom(layer, () => {
    const c2 = getCtx();
    if (!c2) return;
    const now = c2.currentTime;
    const duration = 0.12 + Math.random() * 0.08;
    const buf = createNoiseBuffer(c2, duration, "pink");
    const src = c2.createBufferSource();
    src.buffer = buf;
    const filt = c2.createBiquadFilter();
    filt.type = "bandpass";
    filt.frequency.setValueAtTime(1500, now);
    filt.frequency.exponentialRampToValueAtTime(4000, now + duration * 0.3);
    filt.frequency.exponentialRampToValueAtTime(1000, now + duration);
    filt.Q.value = 0.8;
    const g = c2.createGain();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.03, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, now + duration);
    src.connect(filt);
    filt.connect(g);
    g.connect(dest);
    src.start(now);
    src.stop(now + duration);
  }, 8000, 20000);

  // Very subtle air conditioning whisper
  const airBuf = createNoiseBuffer(c, 4, "brown");
  const airSrc = c.createBufferSource();
  airSrc.buffer = airBuf;
  airSrc.loop = true;
  const airFilter = c.createBiquadFilter();
  airFilter.type = "lowpass";
  airFilter.frequency.value = 300;
  const airGain = c.createGain();
  airGain.gain.value = 0.02;
  airSrc.connect(airFilter);
  airFilter.connect(airGain);
  airGain.connect(dest);
  airSrc.start();
  layer.sources.push(airSrc);
  layer.filters.push(airFilter);
  layer.gains.push(airGain);
}

function buildObservation(layer: ActiveLayer): void {
  const c = getCtx()!;
  const dest = layer.roomGain;

  // Space wind — very slow filtered noise sweep
  const windBuf = createNoiseBuffer(c, 6, "brown");
  const windSrc = c.createBufferSource();
  windSrc.buffer = windBuf;
  windSrc.loop = true;
  const windFilter = c.createBiquadFilter();
  windFilter.type = "lowpass";
  windFilter.frequency.value = 250;
  windFilter.Q.value = 0.7;
  const windGain = c.createGain();
  windGain.gain.value = 0.08;
  windSrc.connect(windFilter);
  windFilter.connect(windGain);
  windGain.connect(dest);
  windSrc.start();
  layer.sources.push(windSrc);
  layer.filters.push(windFilter);
  layer.gains.push(windGain);

  // Slow LFO on wind filter for sweeping effect
  const windLfo = c.createOscillator();
  const windLfoGain = c.createGain();
  windLfo.type = "sine";
  windLfo.frequency.value = 0.05;
  windLfoGain.gain.value = 100;
  windLfo.connect(windLfoGain);
  windLfoGain.connect(windFilter.frequency);
  windLfo.start();
  layer.oscillators.push(windLfo);
  layer.gains.push(windLfoGain);

  // Star twinkle — random high-frequency pings
  scheduleRandom(layer, () => {
    const c2 = getCtx();
    if (!c2) return;
    const now = c2.currentTime;
    const freq = 2000 + Math.random() * 4000;
    const osc = c2.createOscillator();
    const g = c2.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.02 + Math.random() * 0.03, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(g);
    g.connect(dest);
    osc.start(now);
    osc.stop(now + 0.15);
  }, 2000, 7000);

  // Very subtle deep space tone
  const tone = c.createOscillator();
  const toneGain = c.createGain();
  tone.type = "sine";
  tone.frequency.value = 42;
  toneGain.gain.value = 0.04;
  tone.connect(toneGain);
  toneGain.connect(dest);
  tone.start();
  layer.oscillators.push(tone);
  layer.gains.push(toneGain);
}

/* ─── ROOM BUILDER REGISTRY ─── */

const ROOM_BUILDERS: Record<string, (layer: ActiveLayer) => void> = {
  cryo_bay: buildCryoBay,
  bridge: buildBridge,
  medical_bay: buildMedicalBay,
  engineering: buildEngineering,
  archives: buildArchives,
  observation: buildObservation,
};

/* ─── ROOM AMBIENCE OBJECTS ─── */

function makeRoomControl(roomId: string) {
  return {
    start(): void {
      // Ensure audio context exists
      if (!_initialized) initAmbientAudio();
      const c = getCtx();
      if (!c) return;

      // Already playing this room
      if (activeRoom?.id === roomId) return;

      // Stop existing room
      if (activeRoom) {
        fadeOutAndCleanup(activeRoom.layer, 1500);
        activeRoom = null;
      }

      const builder = ROOM_BUILDERS[roomId];
      if (!builder) return;

      const layer = makeLayer();
      builder(layer);
      fadeInLayer(layer, 2000);
      activeRoom = { id: roomId, layer };
    },

    stop(): void {
      if (activeRoom?.id === roomId) {
        fadeOutAndCleanup(activeRoom.layer, 1500);
        activeRoom = null;
      }
    },
  };
}

export const RoomAmbience = {
  /** Deep hum (30Hz sine) + occasional ice crackle (noise burst every 5-10s) */
  cryo_bay: makeRoomControl("cryo_bay"),

  /** Console beeping (sine pings at random intervals) + engine drone (filtered noise) */
  bridge: makeRoomControl("bridge"),

  /** Heart monitor beep (sine 880Hz, 50ms every 1s) + ventilation hiss */
  medical_bay: makeRoomControl("medical_bay"),

  /** Heavy machinery (low sawtooth 40Hz) + steam hiss (noise bursts) */
  engineering: makeRoomControl("engineering"),

  /** Near silence -- occasional page turn (soft noise) + distant hum */
  archives: makeRoomControl("archives"),

  /** Space wind (very slow filtered noise sweep) + star twinkle (random high pings) */
  observation: makeRoomControl("observation"),
};

export type RoomId = keyof typeof RoomAmbience;

/**
 * Crossfade from the current room ambience to a new room.
 * @param roomId - The room to transition to
 * @param durationMs - Crossfade duration (default 2000ms)
 */
export function crossfadeToRoom(roomId: string, durationMs: number = 2000): void {
  if (!_initialized) initAmbientAudio();
  const c = getCtx();
  if (!c) return;

  // Already playing this room
  if (activeRoom?.id === roomId) return;

  // Fade out existing room
  if (activeRoom) {
    fadeOutAndCleanup(activeRoom.layer, durationMs);
    activeRoom = null;
  }

  // Build the new room if we have a builder for it
  const builder = ROOM_BUILDERS[roomId];
  if (!builder) return;

  const layer = makeLayer();
  builder(layer);
  fadeInLayer(layer, durationMs);
  activeRoom = { id: roomId, layer };
}

/** Stop all ambient sounds */
export function stopAllAmbience(): void {
  if (activeRoom) {
    fadeOutAndCleanup(activeRoom.layer, 500);
    activeRoom = null;
  }
}
