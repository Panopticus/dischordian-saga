/* ═══════════════════════════════════════════════════════
   DISCHORDIA SOUND MANAGER — Audio feedback for all interactions

   Two layers:
     1. May 2026 producer drop MP3s (apps/shared/aaaArtArchive
        fightAudio.cardSfxUrl) — preferred when the SoundType maps
        to a real recording. Loaded once on first play, cached as
        HTMLAudioElement pools (3-deep) so rapid plays don't stomp.
     2. Procedural Web Audio fallbacks — used when no archive
        recording exists for the SoundType, or when the recording
        hasn't finished loading yet.

   Result: every gameplay event that has an archive recording
   plays the real recording; everything else keeps its existing
   procedural tone.
   ═══════════════════════════════════════════════════════ */

import { cardSfxUrl, type CardSfxId } from "@shared/aaaArtArchive";

/** SoundType → CardSfxId mapping. SoundTypes without an archive
 *  recording stay procedural-only. Keys deliberately match the
 *  existing SoundType union so the call sites don't change. */
const ARCHIVE_SFX_BY_SOUND: Partial<Record<SoundType, CardSfxId>> = {
  card_play: "card_play",
  card_draw: "draw",
  unit_summon: "trigger_oncast",
  attack_hit: "card_damage",
  spell_cast: "trigger_oncast",
  mana_spend: "void_energy_spend",
  general_damage: "card_damage",
  button_click: "card_hover",
};

const HOWL_POOL_SIZE = 3;

class DischordiaSoundManager {
  private ctx: AudioContext | null = null;
  private muted = false;
  private volume = 0.5;
  /** Per-sound HTMLAudioElement round-robin pool. The pool keeps
   *  rapid-fire triggers (e.g. card_play during a multi-card combo)
   *  from cutting each other off mid-play. */
  private pools: Partial<Record<SoundType, { els: HTMLAudioElement[]; next: number }>> = {};

  private getCtx(): AudioContext {
    if (!this.ctx) this.ctx = new AudioContext();
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }

  setMuted(muted: boolean) { this.muted = muted; }
  setVolume(vol: number) { this.volume = Math.max(0, Math.min(1, vol)); }

  private ensurePool(sound: SoundType, sfxId: CardSfxId): { els: HTMLAudioElement[]; next: number } {
    let pool = this.pools[sound];
    if (!pool) {
      const els: HTMLAudioElement[] = [];
      for (let i = 0; i < HOWL_POOL_SIZE; i++) {
        const el = new Audio(cardSfxUrl(sfxId));
        el.preload = "auto";
        els.push(el);
      }
      pool = { els, next: 0 };
      this.pools[sound] = pool;
    }
    return pool;
  }

  /** Returns true when the archive recording fired; false when the
   *  caller should fall back to the procedural tone. */
  private tryPlayArchive(sound: SoundType): boolean {
    const sfxId = ARCHIVE_SFX_BY_SOUND[sound];
    if (!sfxId) return false;
    if (typeof Audio === "undefined") return false;
    try {
      const pool = this.ensurePool(sound, sfxId);
      const el = pool.els[pool.next];
      pool.next = (pool.next + 1) % pool.els.length;
      el.currentTime = 0;
      el.volume = this.volume;
      void el.play().catch(() => { /* autoplay blocked — fall back next tick */ });
      return true;
    } catch {
      return false;
    }
  }

  /** Play a procedural tone/noise for game events. When an archive
   *  MP3 exists for the SoundType, play that instead. */
  play(sound: SoundType) {
    if (this.muted) return;
    if (this.tryPlayArchive(sound)) return;
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
        case "card_hover": this.playTone(ctx, 880, 0.03, "sine", 0.08); break;
        case "card_pickup": this.playTone(ctx, 660, 0.05, "triangle", 0.18); break;
        case "card_cancel": this.playTone(ctx, 220, 0.06, "square", 0.15); break;
        case "mulligan": this.playSweep(ctx, 500, 800, 0.18, 0.25); break;
        case "shuffle": this.playNoise(ctx, 0.4, 0.3); break;
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
  | "victory" | "defeat" | "button_click" | "error" | "mana_spend" | "general_damage"
  | "card_hover" | "card_pickup" | "card_cancel" | "mulligan" | "shuffle";

export const dischordiaSounds = new DischordiaSoundManager();
