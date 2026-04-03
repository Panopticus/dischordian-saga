/* ═══════════════════════════════════════════════════════
   DISCHORDIA SOUND MANAGER — Audio feedback for all interactions
   Uses Web Audio API for low-latency sound playback.
   Generates procedural sounds when audio files aren't available.
   ═══════════════════════════════════════════════════════ */

class DischordiaSoundManager {
  private ctx: AudioContext | null = null;
  private muted = false;
  private volume = 0.5;

  private getCtx(): AudioContext {
    if (!this.ctx) this.ctx = new AudioContext();
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }

  setMuted(muted: boolean) { this.muted = muted; }
  setVolume(vol: number) { this.volume = Math.max(0, Math.min(1, vol)); }

  /** Play a procedural tone/noise for game events */
  play(sound: SoundType) {
    if (this.muted) return;
    try {
      const ctx = this.getCtx();
      switch (sound) {
        case "card_play": this.playTone(ctx, 440, 0.08, "sine", 0.3); break;
        case "card_draw": this.playTone(ctx, 660, 0.06, "sine", 0.2); break;
        case "unit_summon": this.playSweep(ctx, 300, 600, 0.15, 0.4); break;
        case "attack_hit": this.playNoise(ctx, 0.1, 0.5); this.playTone(ctx, 200, 0.08, "sawtooth", 0.3); break;
        case "unit_death": this.playNoise(ctx, 0.2, 0.4); this.playSweep(ctx, 400, 100, 0.25, 0.3); break;
        case "spell_cast": this.playSweep(ctx, 500, 1200, 0.2, 0.3); break;
        case "turn_start": this.playTone(ctx, 523, 0.1, "sine", 0.3); this.playTone(ctx, 659, 0.1, "sine", 0.2, 0.1); break;
        case "turn_end": this.playTone(ctx, 659, 0.08, "sine", 0.2); this.playTone(ctx, 523, 0.08, "sine", 0.2, 0.08); break;
        case "pack_rip": this.playNoise(ctx, 0.3, 0.6); this.playSweep(ctx, 200, 800, 0.3, 0.3); break;
        case "card_reveal_common": this.playTone(ctx, 440, 0.1, "sine", 0.2); break;
        case "card_reveal_rare": this.playSweep(ctx, 400, 800, 0.15, 0.3); break;
        case "card_reveal_epic": this.playSweep(ctx, 300, 900, 0.2, 0.4); this.playTone(ctx, 880, 0.15, "sine", 0.2, 0.15); break;
        case "card_reveal_legendary": this.playSweep(ctx, 200, 1200, 0.3, 0.5); this.playTone(ctx, 1047, 0.2, "sine", 0.3, 0.2); this.playTone(ctx, 1319, 0.2, "sine", 0.2, 0.35); break;
        case "victory": this.playChord(ctx, [523, 659, 784], 0.4, 0.4); break;
        case "defeat": this.playSweep(ctx, 400, 150, 0.4, 0.3); break;
        case "button_click": this.playTone(ctx, 800, 0.04, "sine", 0.15); break;
        case "error": this.playTone(ctx, 200, 0.15, "square", 0.2); break;
        case "mana_spend": this.playTone(ctx, 350, 0.05, "triangle", 0.15); break;
        case "general_damage": this.playNoise(ctx, 0.15, 0.6); this.playTone(ctx, 150, 0.12, "sawtooth", 0.4); break;
      }
    } catch { /* Audio context not available */ }
  }

  private playTone(ctx: AudioContext, freq: number, duration: number, type: OscillatorType, vol: number, delay = 0) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = vol * this.volume;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration + 0.01);
  }

  private playSweep(ctx: AudioContext, fromFreq: number, toFreq: number, duration: number, vol: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(fromFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(toFreq, ctx.currentTime + duration);
    gain.gain.value = vol * this.volume;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.01);
  }

  private playNoise(ctx: AudioContext, duration: number, vol: number) {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.value = vol * this.volume;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start();
  }

  private playChord(ctx: AudioContext, freqs: number[], duration: number, vol: number) {
    for (const freq of freqs) this.playTone(ctx, freq, duration, "sine", vol / freqs.length);
  }

  dispose() {
    this.ctx?.close();
    this.ctx = null;
  }
}

export type SoundType =
  | "card_play" | "card_draw" | "unit_summon" | "attack_hit" | "unit_death"
  | "spell_cast" | "turn_start" | "turn_end"
  | "pack_rip" | "card_reveal_common" | "card_reveal_rare" | "card_reveal_epic" | "card_reveal_legendary"
  | "victory" | "defeat" | "button_click" | "error" | "mana_spend" | "general_damage";

export const dischordiaSounds = new DischordiaSoundManager();
