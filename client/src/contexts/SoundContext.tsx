/* ═══════════════════════════════════════════════════════
   SOUND CONTEXT — Procedural Ambient Sound Engine
   Web Audio API-based sound system with:
   - Procedural ambient layers (ship hum, cryo hiss, electrical crackle)
   - Room-specific ambient crossfading
   - SFX for interactions (item pickup, door unlock, achievement)
   - Global volume/mute control
   ═══════════════════════════════════════════════════════ */
import { createContext, useContext, useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/* ─── TYPES ─── */
type SoundLayer = "ship_hum" | "cryo_hiss" | "electrical" | "alarm" | "heartbeat" | "void_wind" | "reactor" | "static";
type SFXType = "item_pickup" | "door_unlock" | "door_locked" | "achievement" | "dialog_open" | "dialog_close" | "button_click" | "room_enter" | "cryo_open" | "terminal_access" | "card_deploy" | "card_attack" | "card_death" | "card_spell" | "card_artifact" | "card_draw" | "turn_start" | "turn_end" | "battle_victory" | "battle_defeat" | "energy_charge" | "shield_hit" | "critical_hit" | "heal";

interface RoomAmbience {
  layers: { type: SoundLayer; volume: number; }[];
}

/* ─── ROOM AMBIENT PROFILES ─── */
const ROOM_AMBIENCE: Record<string, RoomAmbience> = {
  "cryo-bay": {
    layers: [
      { type: "ship_hum", volume: 0.08 },
      { type: "cryo_hiss", volume: 0.12 },
      { type: "electrical", volume: 0.04 },
    ],
  },
  "medical-bay": {
    layers: [
      { type: "ship_hum", volume: 0.06 },
      { type: "electrical", volume: 0.08 },
    ],
  },
  "bridge": {
    layers: [
      { type: "ship_hum", volume: 0.1 },
      { type: "electrical", volume: 0.05 },
      { type: "static", volume: 0.03 },
    ],
  },
  "archives": {
    layers: [
      { type: "ship_hum", volume: 0.05 },
      { type: "electrical", volume: 0.08 },
    ],
  },
  "comms-array": {
    layers: [
      { type: "ship_hum", volume: 0.05 },
      { type: "static", volume: 0.1 },
      { type: "electrical", volume: 0.04 },
    ],
  },
  "observation-deck": {
    layers: [
      { type: "void_wind", volume: 0.12 },
      { type: "ship_hum", volume: 0.04 },
    ],
  },
  "engineering": {
    layers: [
      { type: "reactor", volume: 0.12 },
      { type: "ship_hum", volume: 0.08 },
      { type: "electrical", volume: 0.06 },
    ],
  },
  "armory": {
    layers: [
      { type: "ship_hum", volume: 0.08 },
      { type: "electrical", volume: 0.05 },
    ],
  },
  "cargo-hold": {
    layers: [
      { type: "ship_hum", volume: 0.1 },
      { type: "cryo_hiss", volume: 0.03 },
    ],
  },
  "captains-quarters": {
    layers: [
      { type: "ship_hum", volume: 0.04 },
      { type: "void_wind", volume: 0.05 },
    ],
  },
  // Awakening sequence
  "awakening": {
    layers: [
      { type: "heartbeat", volume: 0.15 },
      { type: "cryo_hiss", volume: 0.08 },
      { type: "alarm", volume: 0.04 },
    ],
  },
};

const DEFAULT_AMBIENCE: RoomAmbience = {
  layers: [
    { type: "ship_hum", volume: 0.06 },
    { type: "electrical", volume: 0.03 },
  ],
};

/* ─── PROCEDURAL SOUND GENERATORS ─── */
class ProceduralSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private layerNodes: Map<string, { osc?: OscillatorNode; noise?: AudioBufferSourceNode; gain: GainNode; filter?: BiquadFilterNode }> = new Map();
  private _muted = false;
  private _volume = 0.3;
  private initialized = false;

  async init() {
    if (this.initialized) return;
    try {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this._volume;
      this.masterGain.connect(this.ctx.destination);
      this.initialized = true;
    } catch (e) {
      console.warn("Web Audio not available:", e);
    }
  }

  async resume() {
    if (this.ctx?.state === "suspended") {
      await this.ctx.resume();
    }
  }

  get muted() { return this._muted; }
  get volume() { return this._volume; }

  setVolume(v: number) {
    this._volume = Math.max(0, Math.min(1, v));
    if (this.masterGain && !this._muted) {
      this.masterGain.gain.setTargetAtTime(this._volume, this.ctx!.currentTime, 0.1);
    }
  }

  setMuted(m: boolean) {
    this._muted = m;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(m ? 0 : this._volume, this.ctx!.currentTime, 0.1);
    }
  }

  private createNoiseBuffer(duration: number, type: "white" | "pink" | "brown" = "white"): AudioBuffer {
    const ctx = this.ctx!;
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * duration;
    const buffer = ctx.createBuffer(1, length, sampleRate);
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

  private startLayer(id: string, type: SoundLayer, targetVolume: number) {
    if (!this.ctx || !this.masterGain) return;
    // Stop existing layer if any
    this.stopLayer(id);

    const gain = this.ctx.createGain();
    gain.gain.value = 0;
    gain.connect(this.masterGain);

    let filter: BiquadFilterNode | undefined;

    switch (type) {
      case "ship_hum": {
        // Deep resonant hum with harmonics
        const osc = this.ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = 55; // Low A
        const osc2 = this.ctx.createOscillator();
        osc2.type = "sine";
        osc2.frequency.value = 110;
        const g2 = this.ctx.createGain();
        g2.gain.value = 0.3;
        osc2.connect(g2);
        g2.connect(gain);
        osc.connect(gain);
        // Slow LFO modulation
        const lfo = this.ctx.createOscillator();
        lfo.type = "sine";
        lfo.frequency.value = 0.1;
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 3;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();
        osc.start();
        osc2.start();
        this.layerNodes.set(id, { osc, gain });
        break;
      }
      case "cryo_hiss": {
        // Filtered white noise — hissing steam
        const buffer = this.createNoiseBuffer(4, "white");
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        filter = this.ctx.createBiquadFilter();
        filter.type = "highpass";
        filter.frequency.value = 3000;
        filter.Q.value = 2;
        source.connect(filter);
        filter.connect(gain);
        source.start();
        this.layerNodes.set(id, { noise: source, gain, filter });
        break;
      }
      case "electrical": {
        // Crackling electrical noise
        const buffer = this.createNoiseBuffer(3, "white");
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        filter = this.ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 2500;
        filter.Q.value = 5;
        // Modulate the filter for crackling effect
        const lfo = this.ctx.createOscillator();
        lfo.type = "square";
        lfo.frequency.value = 3;
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 1500;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();
        source.connect(filter);
        filter.connect(gain);
        source.start();
        this.layerNodes.set(id, { noise: source, gain, filter });
        break;
      }
      case "alarm": {
        // Slow pulsing alarm tone
        const osc = this.ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = 440;
        const lfo = this.ctx.createOscillator();
        lfo.type = "sine";
        lfo.frequency.value = 0.5;
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 0.5;
        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);
        lfo.start();
        osc.connect(gain);
        osc.start();
        this.layerNodes.set(id, { osc, gain });
        break;
      }
      case "heartbeat": {
        // Rhythmic low pulse
        const osc = this.ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = 40;
        filter = this.ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 80;
        osc.connect(filter);
        filter.connect(gain);
        // Pulse envelope via LFO
        const lfo = this.ctx.createOscillator();
        lfo.type = "sine";
        lfo.frequency.value = 1.2; // ~72 BPM
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 0.5;
        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);
        lfo.start();
        osc.start();
        this.layerNodes.set(id, { osc, gain, filter });
        break;
      }
      case "void_wind": {
        // Eerie low-frequency wind
        const buffer = this.createNoiseBuffer(6, "brown");
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        filter = this.ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 300;
        filter.Q.value = 1;
        // Slow modulation for wind effect
        const lfo = this.ctx.createOscillator();
        lfo.type = "sine";
        lfo.frequency.value = 0.15;
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 150;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();
        source.connect(filter);
        filter.connect(gain);
        source.start();
        this.layerNodes.set(id, { noise: source, gain, filter });
        break;
      }
      case "reactor": {
        // Pulsing reactor hum
        const osc = this.ctx.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.value = 30;
        filter = this.ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 120;
        filter.Q.value = 3;
        osc.connect(filter);
        filter.connect(gain);
        // Slow pulse
        const lfo = this.ctx.createOscillator();
        lfo.type = "sine";
        lfo.frequency.value = 0.3;
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 20;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();
        osc.start();
        this.layerNodes.set(id, { osc, gain, filter });
        break;
      }
      case "static": {
        // Radio static
        const buffer = this.createNoiseBuffer(2, "white");
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        filter = this.ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 4000;
        filter.Q.value = 1;
        source.connect(filter);
        filter.connect(gain);
        source.start();
        this.layerNodes.set(id, { noise: source, gain, filter });
        break;
      }
    }

    // Fade in
    gain.gain.setTargetAtTime(targetVolume, this.ctx.currentTime, 0.8);
  }

  private stopLayer(id: string) {
    const node = this.layerNodes.get(id);
    if (!node || !this.ctx) return;
    // Fade out
    node.gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.3);
    setTimeout(() => {
      try {
        node.osc?.stop();
        node.noise?.stop();
        node.gain.disconnect();
        node.filter?.disconnect();
      } catch { /* already stopped */ }
      this.layerNodes.delete(id);
    }, 1000);
  }

  setAmbience(roomId: string) {
    if (!this.ctx || !this.initialized) return;
    const profile = ROOM_AMBIENCE[roomId] || DEFAULT_AMBIENCE;

    // Determine which layers to keep, add, or remove
    const desiredLayers = new Map(profile.layers.map(l => [`${roomId}-${l.type}`, l]));
    
    // Stop layers not in the new profile
    Array.from(this.layerNodes.keys()).forEach(id => {
      if (!desiredLayers.has(id)) {
        this.stopLayer(id);
      }
    });

    // Start new layers
    Array.from(desiredLayers.entries()).forEach(([id, layer]) => {
      if (!this.layerNodes.has(id)) {
        this.startLayer(id, layer.type, layer.volume);
      }
    });
  }

  stopAll() {
    Array.from(this.layerNodes.keys()).forEach(id => {
      this.stopLayer(id);
    });
  }

  /* ─── SFX (one-shot sounds) ─── */
  playSFX(type: SFXType) {
    if (!this.ctx || !this.masterGain || this._muted) return;
    const ctx = this.ctx;
    const gain = ctx.createGain();
    gain.connect(this.masterGain);

    switch (type) {
      case "item_pickup": {
        // Rising chime
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.connect(gain);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
        break;
      }
      case "door_unlock": {
        // Mechanical click + whoosh
        const osc = ctx.createOscillator();
        osc.type = "square";
        osc.frequency.value = 200;
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.connect(gain);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
        // Whoosh
        const buf = this.createNoiseBuffer(0.3, "pink");
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const filt = ctx.createBiquadFilter();
        filt.type = "bandpass";
        filt.frequency.setValueAtTime(500, ctx.currentTime + 0.1);
        filt.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.3);
        const g2 = ctx.createGain();
        g2.gain.setValueAtTime(0, ctx.currentTime);
        g2.gain.setValueAtTime(0.15, ctx.currentTime + 0.1);
        g2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        src.connect(filt);
        filt.connect(g2);
        g2.connect(this.masterGain!);
        src.start(ctx.currentTime + 0.1);
        src.stop(ctx.currentTime + 0.4);
        break;
      }
      case "door_locked": {
        // Error buzz
        const osc = ctx.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.value = 100;
        const filt = ctx.createBiquadFilter();
        filt.type = "lowpass";
        filt.frequency.value = 400;
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.connect(filt);
        filt.connect(gain);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
        break;
      }
      case "achievement": {
        // Triumphant ascending arpeggio
        [0, 0.1, 0.2, 0.3].forEach((delay, i) => {
          const osc = ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.value = [523, 659, 784, 1047][i]; // C5, E5, G5, C6
          const g = ctx.createGain();
          g.gain.setValueAtTime(0, ctx.currentTime + delay);
          g.gain.linearRampToValueAtTime(0.2, ctx.currentTime + delay + 0.05);
          g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.4);
          osc.connect(g);
          g.connect(this.masterGain!);
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + 0.4);
        });
        break;
      }
      case "dialog_open": {
        // Soft chime
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.connect(gain);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
        break;
      }
      case "dialog_close": {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = 440;
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.connect(gain);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
        break;
      }
      case "button_click": {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = 660;
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.connect(gain);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
        break;
      }
      case "room_enter": {
        // Atmospheric transition
        const buf = this.createNoiseBuffer(0.8, "brown");
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const filt = ctx.createBiquadFilter();
        filt.type = "lowpass";
        filt.frequency.setValueAtTime(200, ctx.currentTime);
        filt.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.4);
        filt.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.8);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
        src.connect(filt);
        filt.connect(gain);
        src.start();
        src.stop(ctx.currentTime + 0.8);
        break;
      }
      case "cryo_open": {
        // Hissing gas release
        const buf = this.createNoiseBuffer(1.5, "white");
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const filt = ctx.createBiquadFilter();
        filt.type = "highpass";
        filt.frequency.value = 2000;
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
        src.connect(filt);
        filt.connect(gain);
        src.start();
        src.stop(ctx.currentTime + 1.5);
        break;
      }
      case "terminal_access": {
        // Digital beep sequence
        [0, 0.08, 0.16].forEach((delay) => {
          const osc = ctx.createOscillator();
          osc.type = "square";
          osc.frequency.value = 1200;
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.06, ctx.currentTime + delay);
          g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.05);
          osc.connect(g);
          g.connect(this.masterGain!);
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + 0.05);
        });
        break;
      }

      /* ═══ CARD BATTLE SFX ═══ */

      case "card_deploy": {
        // Whoosh + impact thud — card slams onto the board
        const buf = this.createNoiseBuffer(0.4, "pink");
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const filt = ctx.createBiquadFilter();
        filt.type = "bandpass";
        filt.frequency.setValueAtTime(800, ctx.currentTime);
        filt.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);
        filt.Q.value = 2;
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        src.connect(filt);
        filt.connect(gain);
        src.start();
        src.stop(ctx.currentTime + 0.4);
        // Impact thud
        const thud = ctx.createOscillator();
        thud.type = "sine";
        thud.frequency.setValueAtTime(80, ctx.currentTime + 0.08);
        thud.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.25);
        const tg = ctx.createGain();
        tg.gain.setValueAtTime(0.3, ctx.currentTime + 0.08);
        tg.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        thud.connect(tg);
        tg.connect(this.masterGain!);
        thud.start(ctx.currentTime + 0.08);
        thud.stop(ctx.currentTime + 0.25);
        break;
      }

      case "card_attack": {
        // Sharp slash + metallic ring
        const buf = this.createNoiseBuffer(0.2, "white");
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const filt = ctx.createBiquadFilter();
        filt.type = "highpass";
        filt.frequency.value = 3000;
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        src.connect(filt);
        filt.connect(gain);
        src.start();
        src.stop(ctx.currentTime + 0.2);
        // Metallic ring
        const ring = ctx.createOscillator();
        ring.type = "sine";
        ring.frequency.value = 2400;
        const rg = ctx.createGain();
        rg.gain.setValueAtTime(0.12, ctx.currentTime + 0.02);
        rg.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        ring.connect(rg);
        rg.connect(this.masterGain!);
        ring.start(ctx.currentTime + 0.02);
        ring.stop(ctx.currentTime + 0.3);
        break;
      }

      case "card_death": {
        // Descending tone + shatter noise
        const osc = ctx.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.5);
        const filt = ctx.createBiquadFilter();
        filt.type = "lowpass";
        filt.frequency.setValueAtTime(2000, ctx.currentTime);
        filt.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.connect(filt);
        filt.connect(gain);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
        // Shatter
        const buf = this.createNoiseBuffer(0.3, "white");
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const sg = ctx.createGain();
        sg.gain.setValueAtTime(0.15, ctx.currentTime + 0.05);
        sg.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        src.connect(sg);
        sg.connect(this.masterGain!);
        src.start(ctx.currentTime + 0.05);
        src.stop(ctx.currentTime + 0.35);
        break;
      }

      case "card_spell": {
        // Mystical shimmer — ascending harmonics with reverb feel
        [0, 0.06, 0.12, 0.18].forEach((delay, i) => {
          const osc = ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.value = [440, 660, 880, 1320][i];
          const g = ctx.createGain();
          g.gain.setValueAtTime(0, ctx.currentTime + delay);
          g.gain.linearRampToValueAtTime(0.15 - i * 0.02, ctx.currentTime + delay + 0.04);
          g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.5);
          osc.connect(g);
          g.connect(this.masterGain!);
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + 0.5);
        });
        break;
      }

      case "card_artifact": {
        // Deep resonant gong + harmonic overtones
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = 110;
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
        osc.connect(gain);
        osc.start();
        osc.stop(ctx.currentTime + 0.8);
        // Overtone
        const ot = ctx.createOscillator();
        ot.type = "sine";
        ot.frequency.value = 330;
        const og = ctx.createGain();
        og.gain.setValueAtTime(0.1, ctx.currentTime + 0.02);
        og.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        ot.connect(og);
        og.connect(this.masterGain!);
        ot.start(ctx.currentTime + 0.02);
        ot.stop(ctx.currentTime + 0.6);
        break;
      }

      case "card_draw": {
        // Quick paper slide + soft click
        const buf = this.createNoiseBuffer(0.12, "pink");
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const filt = ctx.createBiquadFilter();
        filt.type = "bandpass";
        filt.frequency.value = 3000;
        filt.Q.value = 1;
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        src.connect(filt);
        filt.connect(gain);
        src.start();
        src.stop(ctx.currentTime + 0.12);
        // Click
        const click = ctx.createOscillator();
        click.type = "sine";
        click.frequency.value = 1000;
        const cg = ctx.createGain();
        cg.gain.setValueAtTime(0.06, ctx.currentTime + 0.08);
        cg.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        click.connect(cg);
        cg.connect(this.masterGain!);
        click.start(ctx.currentTime + 0.08);
        click.stop(ctx.currentTime + 0.12);
        break;
      }

      case "turn_start": {
        // Rising power chord — your turn begins
        [0, 0.05, 0.1].forEach((delay, i) => {
          const osc = ctx.createOscillator();
          osc.type = i === 0 ? "sine" : "triangle";
          osc.frequency.value = [330, 440, 660][i];
          const g = ctx.createGain();
          g.gain.setValueAtTime(0, ctx.currentTime + delay);
          g.gain.linearRampToValueAtTime(0.18 - i * 0.04, ctx.currentTime + delay + 0.05);
          g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.4);
          osc.connect(g);
          g.connect(this.masterGain!);
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + 0.4);
        });
        break;
      }

      case "turn_end": {
        // Soft descending tone — passing the turn
        const osc = ctx.createOscillator();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(550, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.connect(gain);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
        break;
      }

      case "battle_victory": {
        // Triumphant fanfare — major chord arpeggio ascending
        [0, 0.12, 0.24, 0.36, 0.48].forEach((delay, i) => {
          const osc = ctx.createOscillator();
          osc.type = i < 3 ? "sine" : "triangle";
          osc.frequency.value = [262, 330, 392, 523, 659][i]; // C4, E4, G4, C5, E5
          const g = ctx.createGain();
          g.gain.setValueAtTime(0, ctx.currentTime + delay);
          g.gain.linearRampToValueAtTime(0.22, ctx.currentTime + delay + 0.06);
          g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.6);
          osc.connect(g);
          g.connect(this.masterGain!);
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + 0.6);
        });
        break;
      }

      case "battle_defeat": {
        // Somber descending minor chord
        [0, 0.15, 0.3].forEach((delay, i) => {
          const osc = ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.value = [392, 311, 233][i]; // G4, Eb4, Bb3
          const g = ctx.createGain();
          g.gain.setValueAtTime(0, ctx.currentTime + delay);
          g.gain.linearRampToValueAtTime(0.18, ctx.currentTime + delay + 0.08);
          g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.8);
          osc.connect(g);
          g.connect(this.masterGain!);
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + 0.8);
        });
        break;
      }

      case "energy_charge": {
        // Ascending electronic whine — energy crystal fills
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.connect(gain);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
        break;
      }

      case "shield_hit": {
        // Metallic clang + energy dissipation
        const osc = ctx.createOscillator();
        osc.type = "square";
        osc.frequency.value = 180;
        const filt = ctx.createBiquadFilter();
        filt.type = "bandpass";
        filt.frequency.value = 600;
        filt.Q.value = 5;
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.connect(filt);
        filt.connect(gain);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
        // Energy dissipation shimmer
        const buf = this.createNoiseBuffer(0.3, "pink");
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const sf = ctx.createBiquadFilter();
        sf.type = "highpass";
        sf.frequency.value = 4000;
        const sg = ctx.createGain();
        sg.gain.setValueAtTime(0.08, ctx.currentTime + 0.05);
        sg.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        src.connect(sf);
        sf.connect(sg);
        sg.connect(this.masterGain!);
        src.start(ctx.currentTime + 0.05);
        src.stop(ctx.currentTime + 0.3);
        break;
      }

      case "critical_hit": {
        // Heavy impact + screen-shake bass
        const buf = this.createNoiseBuffer(0.15, "white");
        const src = ctx.createBufferSource();
        src.buffer = buf;
        gain.gain.setValueAtTime(0.35, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        src.connect(gain);
        src.start();
        src.stop(ctx.currentTime + 0.15);
        // Sub bass boom
        const bass = ctx.createOscillator();
        bass.type = "sine";
        bass.frequency.setValueAtTime(60, ctx.currentTime);
        bass.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 0.3);
        const bg = ctx.createGain();
        bg.gain.setValueAtTime(0.4, ctx.currentTime);
        bg.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        bass.connect(bg);
        bg.connect(this.masterGain!);
        bass.start();
        bass.stop(ctx.currentTime + 0.3);
        break;
      }

      case "heal": {
        // Gentle ascending chime — restorative
        [0, 0.08, 0.16].forEach((delay, i) => {
          const osc = ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.value = [523, 659, 784][i]; // C5, E5, G5
          const g = ctx.createGain();
          g.gain.setValueAtTime(0, ctx.currentTime + delay);
          g.gain.linearRampToValueAtTime(0.12, ctx.currentTime + delay + 0.04);
          g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.35);
          osc.connect(g);
          g.connect(this.masterGain!);
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + 0.35);
        });
        break;
      }
    }
  }

  destroy() {
    this.stopAll();
    this.ctx?.close();
    this.ctx = null;
    this.masterGain = null;
    this.initialized = false;
  }
}

/* ─── CONTEXT ─── */
interface SoundContextValue {
  muted: boolean;
  volume: number;
  setMuted: (m: boolean) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  setRoomAmbience: (roomId: string) => void;
  stopAmbience: () => void;
  playSFX: (type: SFXType) => void;
  initAudio: () => Promise<void>;
  audioReady: boolean;
}

const SoundCtx = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const engineRef = useRef<ProceduralSoundEngine | null>(null);
  const [muted, setMutedState] = useState(() => {
    try { return localStorage.getItem("loredex_sound_muted") === "true"; } catch { return false; }
  });
  const [volume, setVolumeState] = useState(() => {
    try { return parseFloat(localStorage.getItem("loredex_sound_volume") || "0.3"); } catch { return 0.3; }
  });
  const [audioReady, setAudioReady] = useState(false);

  // Lazy init engine
  const getEngine = useCallback(() => {
    if (!engineRef.current) {
      engineRef.current = new ProceduralSoundEngine();
    }
    return engineRef.current;
  }, []);

  const initAudio = useCallback(async () => {
    const engine = getEngine();
    await engine.init();
    await engine.resume();
    engine.setVolume(volume);
    engine.setMuted(muted);
    setAudioReady(true);
  }, [getEngine, volume, muted]);

  const setMuted = useCallback((m: boolean) => {
    setMutedState(m);
    getEngine().setMuted(m);
    try { localStorage.setItem("loredex_sound_muted", String(m)); } catch {}
  }, [getEngine]);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    getEngine().setVolume(v);
    try { localStorage.setItem("loredex_sound_volume", String(v)); } catch {}
  }, [getEngine]);

  const toggleMute = useCallback(() => {
    setMuted(!muted);
  }, [muted, setMuted]);

  const setRoomAmbience = useCallback((roomId: string) => {
    getEngine().setAmbience(roomId);
  }, [getEngine]);

  const stopAmbience = useCallback(() => {
    getEngine().stopAll();
  }, [getEngine]);

  const playSFX = useCallback((type: SFXType) => {
    getEngine().playSFX(type);
  }, [getEngine]);

  // Cleanup
  useEffect(() => {
    return () => {
      engineRef.current?.destroy();
    };
  }, []);

  return (
    <SoundCtx.Provider value={{
      muted, volume, setMuted, setVolume, toggleMute,
      setRoomAmbience, stopAmbience, playSFX, initAudio, audioReady,
    }}>
      {children}
    </SoundCtx.Provider>
  );
}

export function useSound() {
  const ctx = useContext(SoundCtx);
  if (!ctx) throw new Error("useSound must be used within SoundProvider");
  return ctx;
}

export type { SFXType, SoundLayer };
