/* ═══════════════════════════════════════════════════════
   GAME AUDIO CONTEXT — BGM Manager with Crossfade & Ducking
   
   Manages background music tracks for each game area with:
   - Smooth crossfade transitions between areas (2s default)
   - Automatic volume ducking when Elara speaks (VO priority)
   - Loop-friendly playback with seamless restart
   - Integration with existing SoundContext master volume
   ═══════════════════════════════════════════════════════ */
import { createContext, useContext, useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/* ─── GAME AREA TYPES ─── */
export type GameArea =
  | "menu"           // Main menu / home screen
  | "ark"            // Inception Ark exploration
  | "trade_nav"      // Trade Empire — sector navigation
  | "trade_combat"   // Trade Empire — combat encounter
  | "trade_port"     // Trade Empire — port trading
  | "conspiracy"     // Conspiracy board — investigation
  | "research_cipher"  // Research minigame — cipher decode
  | "research_connect" // Research minigame — connection web
  | "research_timeline" // Research minigame — timeline sequence
  | "arena_select"   // Collector's Arena — character select
  | "arena_battle"   // Collector's Arena — battle
  | "card_deck"      // Card game — deck building
  | "card_battle"    // Card game — battle (uses arena_battle)
  | "quiz"           // Lore quiz — timed challenge
  | "discovery"      // Discovery moment sting (one-shot)
  | "doom_scroll"    // Doom scroll news feed
  | "awakening"      // Awakening sequence — cryo revival
  | "war_map"        // War Map — faction territory
  | "none";          // No BGM

/* ─── TRACK REGISTRY ─── */
// Maps game areas to their audio track URLs
// These will be populated with Suno-generated tracks
// For now, they serve as the registry structure
interface TrackConfig {
  url: string;
  volume: number;      // Track-specific volume multiplier (0-1)
  loop: boolean;       // Whether to loop
  fadeInMs: number;     // Fade in duration
  fadeOutMs: number;    // Fade out duration
}

const TRACK_REGISTRY: Partial<Record<GameArea, TrackConfig>> = {
  // Tracks will be registered here as Suno generates them
  // Example:
  // menu: { url: "https://cdn.../classified-frequency.mp3", volume: 0.6, loop: true, fadeInMs: 2000, fadeOutMs: 2000 },
  // ark: { url: "https://cdn.../vessel-47.mp3", volume: 0.5, loop: true, fadeInMs: 3000, fadeOutMs: 2000 },
};

/* ─── CROSSFADE ENGINE ─── */
class BGMEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private duckGain: GainNode | null = null;  // For Elara ducking
  private currentTrack: { source: AudioBufferSourceNode; gain: GainNode; area: GameArea } | null = null;
  private nextTrack: { source: AudioBufferSourceNode; gain: GainNode; area: GameArea } | null = null;
  private bufferCache: Map<string, AudioBuffer> = new Map();
  private _volume = 0.4;
  private _muted = false;
  private _ducked = false;
  private initialized = false;
  private loadingArea: GameArea | null = null;

  async init() {
    if (this.initialized) return;
    try {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.duckGain = this.ctx.createGain();
      this.masterGain.gain.value = this._volume;
      this.duckGain.gain.value = 1.0;
      this.duckGain.connect(this.ctx.destination);
      this.masterGain.connect(this.duckGain);
      this.initialized = true;
    } catch (e) {
      console.warn("[BGM] Web Audio not available:", e);
    }
  }

  async resume() {
    if (this.ctx?.state === "suspended") {
      await this.ctx.resume();
    }
  }

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

  /** Duck volume when Elara speaks */
  duckForVO() {
    if (!this.duckGain || !this.ctx || this._ducked) return;
    this._ducked = true;
    // Reduce to 20% volume over 300ms
    this.duckGain.gain.setTargetAtTime(0.2, this.ctx.currentTime, 0.15);
  }

  /** Restore volume after Elara finishes */
  unduckForVO() {
    if (!this.duckGain || !this.ctx || !this._ducked) return;
    this._ducked = false;
    // Restore to full over 500ms
    this.duckGain.gain.setTargetAtTime(1.0, this.ctx.currentTime, 0.25);
  }

  private async loadBuffer(url: string): Promise<AudioBuffer | null> {
    if (this.bufferCache.has(url)) {
      return this.bufferCache.get(url)!;
    }
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.ctx!.decodeAudioData(arrayBuffer);
      this.bufferCache.set(url, audioBuffer);
      return audioBuffer;
    } catch (e) {
      console.warn("[BGM] Failed to load track:", url, e);
      return null;
    }
  }

  async crossfadeTo(area: GameArea, customFadeMs?: number) {
    if (!this.ctx || !this.masterGain || !this.initialized) return;

    // Same area, skip
    if (this.currentTrack?.area === area) return;

    // Already loading this area
    if (this.loadingArea === area) return;

    const config = TRACK_REGISTRY[area];
    
    // No track for this area — just fade out current
    if (!config) {
      this.fadeOutCurrent(customFadeMs ?? 2000);
      return;
    }

    this.loadingArea = area;

    // Load the new track
    const buffer = await this.loadBuffer(config.url);
    if (!buffer) {
      this.loadingArea = null;
      return;
    }

    // Check if we're still supposed to play this area
    if (this.loadingArea !== area) return;
    this.loadingArea = null;

    const fadeMs = customFadeMs ?? config.fadeInMs;

    // Create new source
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = config.loop;

    const gain = this.ctx.createGain();
    gain.gain.value = 0;
    source.connect(gain);
    gain.connect(this.masterGain);

    // Fade out current track
    if (this.currentTrack) {
      const oldGain = this.currentTrack.gain;
      const oldSource = this.currentTrack.source;
      const fadeOutMs = config.fadeOutMs ?? fadeMs;
      oldGain.gain.setTargetAtTime(0, this.ctx.currentTime, fadeOutMs / 5000);
      setTimeout(() => {
        try { oldSource.stop(); } catch {}
      }, fadeOutMs + 500);
    }

    // Start and fade in new track
    source.start();
    gain.gain.setTargetAtTime(
      config.volume,
      this.ctx.currentTime,
      fadeMs / 5000
    );

    this.currentTrack = { source, gain, area };
  }

  private fadeOutCurrent(fadeMs: number = 2000) {
    if (!this.currentTrack || !this.ctx) return;
    const { gain, source } = this.currentTrack;
    gain.gain.setTargetAtTime(0, this.ctx.currentTime, fadeMs / 5000);
    setTimeout(() => {
      try { source.stop(); } catch {}
    }, fadeMs + 500);
    this.currentTrack = null;
  }

  /** Play a one-shot sting (e.g., discovery moment) */
  async playOneShot(url: string, volume: number = 0.8) {
    if (!this.ctx || !this.masterGain || !this.initialized) return;
    
    const buffer = await this.loadBuffer(url);
    if (!buffer) return;

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = false;

    const gain = this.ctx.createGain();
    gain.gain.value = volume;
    source.connect(gain);
    gain.connect(this.masterGain);
    source.start();
  }

  /** Register a track for a game area */
  registerTrack(area: GameArea, config: TrackConfig) {
    TRACK_REGISTRY[area] = config;
  }

  getCurrentArea(): GameArea | null {
    return this.currentTrack?.area ?? null;
  }

  stop() {
    this.fadeOutCurrent(500);
  }

  destroy() {
    this.stop();
    this.bufferCache.clear();
    this.ctx?.close();
  }
}

/* ─── CONTEXT ─── */
interface GameAudioContextValue {
  /** Switch BGM to a game area with crossfade */
  setGameArea: (area: GameArea) => void;
  /** Get current playing area */
  currentArea: GameArea | null;
  /** Duck BGM for Elara VO */
  duckForElara: () => void;
  /** Restore BGM after Elara VO */
  unduckForElara: () => void;
  /** Play a one-shot audio sting */
  playOneShot: (url: string, volume?: number) => void;
  /** Register a new track for a game area */
  registerTrack: (area: GameArea, config: TrackConfig) => void;
  /** Stop all BGM */
  stopBGM: () => void;
  /** Whether BGM system is ready */
  bgmReady: boolean;
  /** Initialize the BGM engine (requires user gesture) */
  initBGM: () => Promise<void>;
}

const GameAudioCtx = createContext<GameAudioContextValue | null>(null);

export function GameAudioProvider({ 
  children,
  masterVolume = 0.4,
  masterMuted = false,
  elaraSpeaking = false,
}: { 
  children: ReactNode;
  masterVolume?: number;
  masterMuted?: boolean;
  elaraSpeaking?: boolean;
}) {
  const engineRef = useRef<BGMEngine | null>(null);
  const [bgmReady, setBgmReady] = useState(false);
  const [currentArea, setCurrentArea] = useState<GameArea | null>(null);

  const getEngine = useCallback(() => {
    if (!engineRef.current) {
      engineRef.current = new BGMEngine();
    }
    return engineRef.current;
  }, []);

  const initBGM = useCallback(async () => {
    const engine = getEngine();
    await engine.init();
    await engine.resume();
    engine.setVolume(masterVolume);
    engine.setMuted(masterMuted);
    setBgmReady(true);
  }, [getEngine, masterVolume, masterMuted]);

  // Sync master volume
  useEffect(() => {
    if (bgmReady) {
      getEngine().setVolume(masterVolume);
    }
  }, [masterVolume, bgmReady, getEngine]);

  // Sync mute state
  useEffect(() => {
    if (bgmReady) {
      getEngine().setMuted(masterMuted);
    }
  }, [masterMuted, bgmReady, getEngine]);

  // Auto-duck when Elara speaks
  useEffect(() => {
    if (!bgmReady) return;
    if (elaraSpeaking) {
      getEngine().duckForVO();
    } else {
      getEngine().unduckForVO();
    }
  }, [elaraSpeaking, bgmReady, getEngine]);

  const setGameArea = useCallback((area: GameArea) => {
    const engine = getEngine();
    if (area === "none") {
      engine.stop();
      setCurrentArea(null);
    } else {
      engine.crossfadeTo(area);
      setCurrentArea(area);
    }
  }, [getEngine]);

  const duckForElara = useCallback(() => {
    getEngine().duckForVO();
  }, [getEngine]);

  const unduckForElara = useCallback(() => {
    getEngine().unduckForVO();
  }, [getEngine]);

  const playOneShot = useCallback((url: string, volume?: number) => {
    getEngine().playOneShot(url, volume);
  }, [getEngine]);

  const registerTrack = useCallback((area: GameArea, config: TrackConfig) => {
    getEngine().registerTrack(area, config);
  }, [getEngine]);

  const stopBGM = useCallback(() => {
    getEngine().stop();
    setCurrentArea(null);
  }, [getEngine]);

  // Cleanup
  useEffect(() => {
    return () => {
      engineRef.current?.destroy();
    };
  }, []);

  return (
    <GameAudioCtx.Provider value={{
      setGameArea, currentArea, duckForElara, unduckForElara,
      playOneShot, registerTrack, stopBGM, bgmReady, initBGM,
    }}>
      {children}
    </GameAudioCtx.Provider>
  );
}

export function useGameAudio() {
  const ctx = useContext(GameAudioCtx);
  if (!ctx) throw new Error("useGameAudio must be used within GameAudioProvider");
  return ctx;
}

/** Hook to auto-set game area when entering a page */
export function useGameAreaBGM(area: GameArea) {
  const { setGameArea, bgmReady } = useGameAudio();
  useEffect(() => {
    if (bgmReady) {
      setGameArea(area);
    }
  }, [area, bgmReady, setGameArea]);
}
