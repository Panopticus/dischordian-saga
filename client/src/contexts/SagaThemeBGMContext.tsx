/* ═══════════════════════════════════════════════════════
   SAGA THEME BGM — Background music loop of 4 saga themes
   
   Plays the 4 saga theme tracks in a shuffled loop at low
   background volume. Auto-pauses when the main CoNexus
   Media Player (PlayerContext) is playing Malkia & Panopticon
   tracks. VO lines play at significantly higher volume.
   ═══════════════════════════════════════════════════════ */
import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { usePlayer } from "./PlayerContext";

/* ─── SAGA THEME PLAYLIST ─── */
const SAGA_THEMES = [
  {
    id: "saga-theme-original",
    title: "Saga Theme (Original)",
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/SagaTheme_0cd5de9a.mp3",
  },
  {
    id: "saga-theme-1",
    title: "Saga Theme I",
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/saga-theme-1_26dd4ba7.mp3",
  },
  {
    id: "saga-theme-2",
    title: "Saga Theme II",
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/saga-theme-2_f7163eec.mp3",
  },
  {
    id: "saga-theme-3",
    title: "Saga Theme III",
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/saga-theme-3_59eac805.mp3",
  },
];

/* ─── VOLUME CONSTANTS ─── */
const BGM_VOLUME = 0.06;        // Very low background level — must not drown out VO
const VO_VOLUME = 0.90;         // Significantly louder for Elara VO lines
const FADE_DURATION_MS = 1500;  // Fade in/out duration
const FADE_STEP_MS = 50;        // Fade step interval

/* ─── CONTEXT ─── */
interface SagaThemeBGMContextValue {
  /** Whether the BGM system is enabled */
  enabled: boolean;
  /** Whether BGM is currently audible (not paused by main player) */
  isPlaying: boolean;
  /** Current theme track info */
  currentTheme: { id: string; title: string } | null;
  /** Toggle BGM on/off */
  toggleBGM: () => void;
  /** Set BGM volume (0-1, will be scaled to low range) */
  setBGMVolume: (v: number) => void;
  /** Current volume level (0-100 for UI) */
  bgmVolume: number;
  /** The recommended VO volume for Elara lines */
  voVolume: number;
}

const SagaThemeBGMContext = createContext<SagaThemeBGMContextValue | null>(null);

const STORAGE_KEY = "loredex_saga_bgm";

/* ─── PROVIDER ─── */
export function SagaThemeBGMProvider({ children }: { children: ReactNode }) {
  const { isPlaying: mainPlayerPlaying, currentSong } = usePlayer();

  // Persisted state
  const [enabled, setEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved).enabled ?? true;
    } catch { /* ignore */ }
    return true;
  });
  const [bgmVolume, setBGMVolumeState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved).volume ?? 15;
    } catch { /* ignore */ }
    return 15;
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentThemeIdx, setCurrentThemeIdx] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausedByPlayerRef = useRef(false);
  const userStartedRef = useRef(false);

  // Persist settings
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ enabled, volume: bgmVolume }));
  }, [enabled, bgmVolume]);

  // Compute actual volume from the 0-100 slider
  const actualVolume = (bgmVolume / 100) * BGM_VOLUME;

  // Initialize audio element
  useEffect(() => {
    if (audioRef.current) return;
    const audio = new Audio();
    audio.volume = 0;
    audio.preload = "auto";
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Fade helpers
  const fadeIn = useCallback((targetVol: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    const steps = FADE_DURATION_MS / FADE_STEP_MS;
    const increment = targetVol / steps;

    fadeIntervalRef.current = setInterval(() => {
      if (audio.volume < targetVol - increment) {
        audio.volume = Math.min(targetVol, audio.volume + increment);
      } else {
        audio.volume = targetVol;
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }
    }, FADE_STEP_MS);
  }, []);

  const fadeOut = useCallback((onComplete?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    const steps = FADE_DURATION_MS / FADE_STEP_MS;
    const decrement = audio.volume / steps;

    fadeIntervalRef.current = setInterval(() => {
      if (audio.volume > decrement) {
        audio.volume = Math.max(0, audio.volume - decrement);
      } else {
        audio.volume = 0;
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
        onComplete?.();
      }
    }, FADE_STEP_MS);
  }, []);

  // Play next theme in the playlist
  const playTheme = useCallback((idx: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const theme = SAGA_THEMES[idx % SAGA_THEMES.length];
    audio.src = theme.url;
    audio.volume = 0;
    audio.play().then(() => {
      setIsPlaying(true);
      fadeIn(actualVolume);
    }).catch(() => {
      // Autoplay blocked — will retry on user interaction
    });
    setCurrentThemeIdx(idx % SAGA_THEMES.length);
  }, [actualVolume, fadeIn]);

  // Handle track ending — advance to next theme
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      const nextIdx = (currentThemeIdx + 1) % SAGA_THEMES.length;
      playTheme(nextIdx);
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [currentThemeIdx, playTheme]);

  // Start BGM on first user interaction if enabled
  useEffect(() => {
    if (!enabled || userStartedRef.current) return;

    const startOnInteraction = () => {
      if (userStartedRef.current) return;
      userStartedRef.current = true;
      // Shuffle start position
      const startIdx = Math.floor(Math.random() * SAGA_THEMES.length);
      playTheme(startIdx);
      document.removeEventListener("click", startOnInteraction);
      document.removeEventListener("keydown", startOnInteraction);
    };

    document.addEventListener("click", startOnInteraction);
    document.addEventListener("keydown", startOnInteraction);

    return () => {
      document.removeEventListener("click", startOnInteraction);
      document.removeEventListener("keydown", startOnInteraction);
    };
  }, [enabled, playTheme]);

  // Pause/resume based on main player state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !enabled || !userStartedRef.current) return;

    if (mainPlayerPlaying && currentSong?.audio_url) {
      // Main player is playing a Malkia & Panopticon track — fade out BGM
      if (!pausedByPlayerRef.current) {
        pausedByPlayerRef.current = true;
        fadeOut(() => {
          audio.pause();
          setIsPlaying(false);
        });
      }
    } else {
      // Main player stopped — resume BGM
      if (pausedByPlayerRef.current) {
        pausedByPlayerRef.current = false;
        if (audio.src && audio.src !== "") {
          audio.play().then(() => {
            setIsPlaying(true);
            fadeIn(actualVolume);
          }).catch(() => {});
        } else {
          playTheme(currentThemeIdx);
        }
      }
    }
  }, [mainPlayerPlaying, currentSong, enabled, actualVolume, fadeIn, fadeOut, playTheme, currentThemeIdx]);

  // Update volume when slider changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isPlaying) return;
    audio.volume = actualVolume;
  }, [actualVolume, isPlaying]);

  // Toggle BGM
  const toggleBGM = useCallback(() => {
    setEnabled((prev: boolean) => {
      const next = !prev;
      const audio = audioRef.current;
      if (!next && audio) {
        fadeOut(() => {
          audio.pause();
          setIsPlaying(false);
        });
        userStartedRef.current = false;
      } else if (next) {
        userStartedRef.current = false; // Will re-trigger on next interaction
      }
      return next;
    });
  }, [fadeOut]);

  const setBGMVolume = useCallback((v: number) => {
    setBGMVolumeState(Math.max(0, Math.min(100, v)));
  }, []);

  const currentTheme = SAGA_THEMES[currentThemeIdx];

  return (
    <SagaThemeBGMContext.Provider value={{
      enabled,
      isPlaying,
      currentTheme: currentTheme ? { id: currentTheme.id, title: currentTheme.title } : null,
      toggleBGM,
      setBGMVolume,
      bgmVolume,
      voVolume: VO_VOLUME,
    }}>
      {children}
    </SagaThemeBGMContext.Provider>
  );
}

export function useSagaThemeBGM() {
  const ctx = useContext(SagaThemeBGMContext);
  if (!ctx) throw new Error("useSagaThemeBGM must be used within SagaThemeBGMProvider");
  return ctx;
}

export { SAGA_THEMES, BGM_VOLUME, VO_VOLUME };
