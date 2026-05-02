import { createContext, useContext, useState, useRef, useCallback, useEffect, type ReactNode } from "react";
import type { LoredexEntry } from "./LoredexContext";
import { publishAmplitude, registerAnalyser } from "../hooks/useAudioAmplitude";

interface PlayerContextType {
  currentSong: LoredexEntry | null;
  isPlaying: boolean;
  queue: LoredexEntry[];
  playSong: (song: LoredexEntry) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  prev: () => void;
  setQueue: (songs: LoredexEntry[]) => void;
  showPlayer: boolean;
  /* ─── Audio playback state ─── */
  currentTime: number;
  duration: number;
  volume: number;
  setVolume: (v: number) => void;
  seek: (time: number) => void;
  hasAudio: boolean;
  /** Audio-element `muted` flag, separate from `volume` so toggling
   *  silence doesn't clobber the user's preferred level. Used by the
   *  title flow to pre-roll The Enigma's Lament under the meme video
   *  on iOS Safari (where every programmatic `play()` outside a user
   *  activation is blocked) — the song starts muted inside the
   *  CONFIRM/LOOK AWAY click handler, then `setMuted(false)` reveals
   *  it for the last 10s of the broadcast. */
  muted: boolean;
  setMuted: (m: boolean) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentSong, setCurrentSong] = useState<LoredexEntry | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<LoredexEntry[]>([]);
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [muted, setMutedState] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Use refs for queue and currentSong so event handlers always see latest values
  const queueRef = useRef(queue);
  const currentSongRef = useRef(currentSong);

  useEffect(() => { queueRef.current = queue; }, [queue]);
  useEffect(() => { currentSongRef.current = currentSong; }, [currentSong]);

  // Load and play a specific song on the audio element
  const loadAndPlay = useCallback((song: LoredexEntry) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (song.audio_url) {
      audio.src = song.audio_url;
      audio.play().catch((e) => {
        console.warn("[Player] Autoplay blocked:", e);
        // The play event never fired, so the play/pause listeners
        // wouldn't have corrected isPlaying. Reset it ourselves so
        // callers (TitleAlbumIntro's tap-to-begin fallback, mini-card
        // labels, BGM ducking) reflect the real audio state.
        setIsPlaying(false);
      });
    } else {
      audio.pause();
      audio.src = "";
    }
  }, []);

  // Handle next track (used by ended event and next button)
  const advanceToNext = useCallback(() => {
    const q = queueRef.current;
    const cur = currentSongRef.current;
    if (!cur || q.length === 0) {
      setIsPlaying(false);
      return;
    }
    const idx = q.findIndex((s) => s.id === cur.id);
    if (idx >= 0 && idx < q.length - 1) {
      const nextSong = q[idx + 1];
      setCurrentSong(nextSong);
      setIsPlaying(true);
      setCurrentTime(0);
      setDuration(0);
      loadAndPlay(nextSong);
    } else {
      // End of queue
      setIsPlaying(false);
    }
  }, [loadAndPlay]);

  // Initialize audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audio.preload = "auto";
    // Required for AnalyserNode to read samples from cross-origin audio
    // (Loredex tracks live on a CDN). Setting this before any src assign
    // ensures MediaElementSource gets clean PCM instead of silenced samples.
    audio.crossOrigin = "anonymous";

    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
    });
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });
    audio.addEventListener("durationchange", () => {
      if (audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    });
    audio.addEventListener("ended", () => {
      advanceToNext();
    });
    audio.addEventListener("error", (e) => {
      console.warn("[Player] Audio error:", (e as any)?.target?.error?.message || "unknown");
    });
    // Keep React's isPlaying in lockstep with the underlying media so
    // listeners (tap-to-begin fallback in the title intro, BGM ducking)
    // never see a stale "playing" while the audio is actually paused.
    audio.addEventListener("play", () => setIsPlaying(true));
    audio.addEventListener("pause", () => setIsPlaying(false));

    audioRef.current = audio;

    const amplitude = startAmplitudeDriver(audio);

    return () => {
      amplitude.stop();
      audio.pause();
      audio.src = "";
      audio.removeAttribute("src");
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Resume the shared AudioContext on playSong — browsers require a user
  // gesture; playSong is reached through a click, so this is the safe seam.
  useEffect(() => {
    if (isPlaying) resumeAudioContext();
  }, [isPlaying]);

  const hasAudio = !!(currentSong?.audio_url);

  const playSong = useCallback((song: LoredexEntry) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setShowPlayer(true);
    setCurrentTime(0);
    setDuration(0);
    loadAndPlay(song);
  }, [loadAndPlay]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    audioRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    setIsPlaying(true);
    if (audioRef.current && currentSong?.audio_url) {
      audioRef.current.play().catch(() => {});
    }
  }, [currentSong]);

  const next = useCallback(() => {
    advanceToNext();
  }, [advanceToNext]);

  const prev = useCallback(() => {
    if (!currentSong || queue.length === 0) return;
    // If more than 3 seconds in, restart current track
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    const idx = queue.findIndex((s) => s.id === currentSong.id);
    if (idx > 0) {
      const prevSong = queue[idx - 1];
      setCurrentSong(prevSong);
      setIsPlaying(true);
      setCurrentTime(0);
      setDuration(0);
      loadAndPlay(prevSong);
    }
  }, [currentSong, queue, loadAndPlay]);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
  }, []);

  const setMuted = useCallback((m: boolean) => {
    setMutedState(m);
    if (audioRef.current) {
      audioRef.current.muted = m;
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current && currentSong?.audio_url) {
      const clamped = Math.max(0, Math.min(time, audioRef.current.duration || 0));
      audioRef.current.currentTime = clamped;
      setCurrentTime(clamped);
    }
  }, [currentSong]);

  return (
    <PlayerContext.Provider
      value={{
        currentSong, isPlaying, queue, playSong, pause, resume, next, prev,
        setQueue, showPlayer, currentTime, duration, volume, setVolume, seek, hasAudio,
        muted, setMuted,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}

/* ═══════════════════════════════════════════════════════
   AMPLITUDE DRIVER — Web Audio analyser + RAF pump.

   A single AudioContext + MediaElementSource + AnalyserNode is
   attached to the shared <audio> element. Each animation frame we
   sample the FFT and time-domain data, bucket it into three bands,
   compute overall RMS, and write the results to:

     1. `publishAmplitude(...)` — React-facing bus consumed by
        useAudioAmplitude().
     2. Four CSS custom properties on <html> — `--audio-{bass,mid,
        treble,overall}`. Cheap for any component to reference via
        `calc(... * var(--audio-bass))` with zero React cost.

   Respects `prefers-reduced-motion` and `.reduce-motion` /
   `.audio-reactive-off` classes (we simply skip the write so the
   CSS overrides keep the bus at zero).

   Why a driver and not `useAudioAmplitude` managing its own RAF?
   One RAF loop is O(1) regardless of consumer count, and we need
   the analyser to exist even when no component is mounted (so the
   CSS bus stays live for pure-CSS consumers like the Title logo).
   ═══════════════════════════════════════════════════════ */

let sharedAudioContext: AudioContext | null = null;
let sharedAnalyser: AnalyserNode | null = null;
let sharedSource: MediaElementAudioSourceNode | null = null;

function resumeAudioContext(): void {
  // Browsers start AudioContext suspended until a user gesture. This
  // runs inside the isPlaying effect, which is always reached through
  // a click/tap, so .resume() will succeed.
  sharedAudioContext?.resume().catch(() => {});
}

type AmplitudeDriver = { stop: () => void };

function startAmplitudeDriver(audio: HTMLAudioElement): AmplitudeDriver {
  if (typeof window === "undefined") return { stop: () => {} };

  let rafHandle = 0;
  let freqBuf: Uint8Array<ArrayBuffer> | null = null;
  let timeBuf: Uint8Array<ArrayBuffer> | null = null;
  let bandSplits: { bassEnd: number; midEnd: number; binCount: number } | null = null;

  function ensureGraph(): boolean {
    if (sharedAnalyser && sharedAudioContext && sharedSource) return true;
    try {
      const Ctor: typeof AudioContext =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!Ctor) return false;
      sharedAudioContext = new Ctor();
      sharedAnalyser = sharedAudioContext.createAnalyser();
      sharedAnalyser.fftSize = 512;           // 256 frequency bins, low CPU
      sharedAnalyser.smoothingTimeConstant = 0.7;
      sharedSource = sharedAudioContext.createMediaElementSource(audio);
      // Source → Analyser → Destination. Analyser is a pass-through;
      // routing through it does not attenuate playback.
      sharedSource.connect(sharedAnalyser);
      sharedAnalyser.connect(sharedAudioContext.destination);
      // Expose the analyser through the hook's module so downstream
      // visualizers (AudioSpectrum canvas, etc.) can pull raw
      // frequency buffers without re-building their own Web Audio graph.
      registerAnalyser(sharedAnalyser);
      return true;
    } catch (e) {
      // If the audio element was already bound to a source (HMR reload)
      // or the browser blocks MediaElementSource for this CORS config,
      // fall back silently — playback continues, amplitude stays at 0.
      console.warn("[Player] Audio analyser unavailable:", e);
      sharedAnalyser = null;
      registerAnalyser(null);
      return false;
    }
  }

  function isReactiveEnabled(): boolean {
    const root = document.documentElement;
    if (root.classList.contains("reduce-motion")) return false;
    if (root.classList.contains("audio-reactive-off")) return false;
    // System preference is the final safety net for users who never
    // opened our settings UI.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return false;
    return true;
  }

  function tick(): void {
    rafHandle = requestAnimationFrame(tick);
    if (!ensureGraph() || !sharedAnalyser) return;

    const bins = sharedAnalyser.frequencyBinCount;
    if (!freqBuf || freqBuf.length !== bins) {
      // Allocate over a concrete ArrayBuffer so TS narrows to
      // Uint8Array<ArrayBuffer> — WebAudio's typings require that
      // exact parameterization.
      freqBuf = new Uint8Array(new ArrayBuffer(bins));
      timeBuf = new Uint8Array(new ArrayBuffer(bins));
      // Convert band cutoffs (Hz) to bin indices. Nyquist = sampleRate / 2
      // spans `bins` cells, so each bin covers (sampleRate / 2) / bins Hz.
      const nyquist = (sharedAudioContext?.sampleRate ?? 48000) / 2;
      const hzPerBin = nyquist / bins;
      bandSplits = {
        bassEnd: Math.max(1, Math.floor(250 / hzPerBin)),
        midEnd: Math.max(2, Math.floor(4000 / hzPerBin)),
        binCount: bins,
      };
    }

    if (!isReactiveEnabled() || audio.paused) {
      // Decay to zero rather than snapping — snaps look like a glitch.
      publishAmplitude({ bass: 0, mid: 0, treble: 0, overall: 0 });
      writeCssBus(0, 0, 0, 0);
      return;
    }

    sharedAnalyser.getByteFrequencyData(freqBuf);
    sharedAnalyser.getByteTimeDomainData(timeBuf!);

    const { bassEnd, midEnd, binCount } = bandSplits!;
    let bassSum = 0;
    let midSum = 0;
    let trebSum = 0;
    for (let i = 0; i < bassEnd; i++) bassSum += freqBuf[i];
    for (let i = bassEnd; i < midEnd; i++) midSum += freqBuf[i];
    for (let i = midEnd; i < binCount; i++) trebSum += freqBuf[i];

    const bass = bassSum / ((bassEnd || 1) * 255);
    const mid = midSum / ((midEnd - bassEnd || 1) * 255);
    const treble = trebSum / ((binCount - midEnd || 1) * 255);

    // Time-domain RMS → loudness. Samples are unsigned 8-bit centered at 128.
    let rmsSum = 0;
    for (let i = 0; i < binCount; i++) {
      const v = (timeBuf![i] - 128) / 128;
      rmsSum += v * v;
    }
    const overall = Math.sqrt(rmsSum / binCount);

    publishAmplitude({ bass, mid, treble, overall });
    writeCssBus(bass, mid, treble, overall);
  }

  function writeCssBus(bass: number, mid: number, treble: number, overall: number): void {
    const style = document.documentElement.style;
    style.setProperty("--audio-bass", bass.toFixed(3));
    style.setProperty("--audio-mid", mid.toFixed(3));
    style.setProperty("--audio-treble", treble.toFixed(3));
    style.setProperty("--audio-overall", overall.toFixed(3));
  }

  rafHandle = requestAnimationFrame(tick);
  return {
    stop: () => cancelAnimationFrame(rafHandle),
  };
}
