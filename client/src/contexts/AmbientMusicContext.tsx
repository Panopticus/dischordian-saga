import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";

/* ═══ TRACK DEFINITIONS ═══
   Each room maps to a thematically appropriate Dischordian Saga track.
   We use YouTube IFrame API to play audio-only in the background.
   ═══════════════════════════ */

export interface MusicTrack {
  id: string;
  title: string;
  album: string;
  youtubeId: string;
}

// Room-to-track mapping — each room gets a thematically appropriate song
const ROOM_TRACKS: Record<string, MusicTrack> = {
  "cryo-bay": {
    id: "cryo-bay-track",
    title: "Seeds of Inception",
    album: "Dischordian Logic",
    youtubeId: "cEoS4cNSd14", // The Politician's Reign — ominous, awakening vibe
  },
  "bridge": {
    id: "bridge-track",
    title: "The Politician's Reign",
    album: "Dischordian Logic",
    youtubeId: "cEoS4cNSd14",
  },
  "archives": {
    id: "archives-track",
    title: "Building the Architect",
    album: "The Age of Privacy",
    youtubeId: "orDK07SbFFw",
  },
  "comms-array": {
    id: "comms-track",
    title: "The Prisoner",
    album: "The Age of Privacy",
    youtubeId: "Cujw3s-D6yU",
  },
  "observation-deck": {
    id: "observation-track",
    title: "Planet of the Wolf",
    album: "Dischordian Logic",
    youtubeId: "Q6y2hrJumpQ",
  },
  "engineering": {
    id: "engineering-track",
    title: "Theft of All Time",
    album: "Dischordian Logic",
    youtubeId: "Z6S-fGbZJJs",
  },
  "armory": {
    id: "armory-track",
    title: "I Love War",
    album: "Dischordian Logic",
    youtubeId: "NamG72iwV3Y",
  },
  "cargo-hold": {
    id: "cargo-track",
    title: "Welcome to Celebration",
    album: "Dischordian Logic",
    youtubeId: "DsxATNW2GVM",
  },
  "medical-bay": {
    id: "medical-track",
    title: "Ocularum",
    album: "The Age of Privacy",
    youtubeId: "VtYDgt4CG3k",
  },
  "hangar-bay": {
    id: "hangar-track",
    title: "The Book of Daniel 2.0",
    album: "The Book of Daniel 2:47",
    youtubeId: "sNBRlUrGRH4",
  },
  "mess-hall": {
    id: "mess-track",
    title: "To Be the Human",
    album: "Dischordian Logic",
    youtubeId: "Q4eHy3v0LYs",
  },
  "captains-quarters": {
    id: "captains-track",
    title: "Awaken the Clone",
    album: "Silence in Heaven",
    youtubeId: "KljI0bV8mm0",
  },
};

// General playlist for non-room pages
const GENERAL_PLAYLIST: MusicTrack[] = [
  { id: "general-1", title: "The Ninth", album: "Silence in Heaven", youtubeId: "szJ_B13c3ik" },
  { id: "general-2", title: "Judgment Day", album: "Silence in Heaven", youtubeId: "mIUKgCWp2f4" },
  { id: "general-3", title: "Walk in Power", album: "Silence in Heaven", youtubeId: "GaTtZiD0qfQ" },
  { id: "general-4", title: "The Queen of Truth", album: "Silence in Heaven", youtubeId: "WiV_Ax_4wBo" },
  { id: "general-5", title: "A Very Civil War", album: "Silence in Heaven", youtubeId: "-Lyq0lEzzm4" },
  { id: "general-6", title: "The Ocularum", album: "Silence in Heaven", youtubeId: "Loc03QeRpfM" },
];

/* ═══ CONTEXT ═══ */
interface AmbientMusicState {
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  currentRoomId: string | null;
  volume: number;
  muted: boolean;
  musicEnabled: boolean;
}

interface AmbientMusicContextValue extends AmbientMusicState {
  playForRoom: (roomId: string) => void;
  playGeneral: () => void;
  pause: () => void;
  resume: () => void;
  toggleMute: () => void;
  setVolume: (v: number) => void;
  toggleMusic: () => void;
  getTrackForRoom: (roomId: string) => MusicTrack | undefined;
  allTracks: MusicTrack[];
}

const AmbientMusicContext = createContext<AmbientMusicContextValue | null>(null);

const MUSIC_STORAGE_KEY = "loredex_ambient_music";

/* ═══ PROVIDER ═══ */
export function AmbientMusicProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AmbientMusicState>(() => {
    try {
      const saved = localStorage.getItem(MUSIC_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          isPlaying: false, // Don't auto-play on load
          currentTrack: null,
          currentRoomId: null,
          volume: parsed.volume ?? 30,
          muted: parsed.muted ?? false,
          musicEnabled: parsed.musicEnabled ?? false,
        };
      }
    } catch { /* ignore */ }
    return {
      isPlaying: false,
      currentTrack: null,
      currentRoomId: null,
      volume: 30,
      muted: false,
      musicEnabled: false,
    };
  });

  // YouTube IFrame API
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const apiReadyRef = useRef(false);
  const pendingTrackRef = useRef<MusicTrack | null>(null);

  // Persist settings
  useEffect(() => {
    localStorage.setItem(MUSIC_STORAGE_KEY, JSON.stringify({
      volume: state.volume,
      muted: state.muted,
      musicEnabled: state.musicEnabled,
    }));
  }, [state.volume, state.muted, state.musicEnabled]);

  // Load YouTube IFrame API
  useEffect(() => {
    if ((window as any).YT?.Player) {
      apiReadyRef.current = true;
      return;
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScript = document.getElementsByTagName("script")[0];
    firstScript?.parentNode?.insertBefore(tag, firstScript);

    (window as any).onYouTubeIframeAPIReady = () => {
      apiReadyRef.current = true;
      // If there's a pending track, play it now
      if (pendingTrackRef.current) {
        createPlayer(pendingTrackRef.current);
        pendingTrackRef.current = null;
      }
    };
  }, []);

  const createPlayer = useCallback((track: MusicTrack) => {
    if (!apiReadyRef.current) {
      pendingTrackRef.current = track;
      return;
    }

    // Destroy existing player
    if (playerRef.current) {
      try { playerRef.current.destroy(); } catch { /* ignore */ }
      playerRef.current = null;
    }

    // Create container if needed
    if (!containerRef.current) {
      const div = document.createElement("div");
      div.id = "yt-ambient-player";
      div.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;pointer-events:none;";
      document.body.appendChild(div);
      containerRef.current = div;
    }

    // Create a child div for the player (YT replaces the element)
    const playerDiv = document.createElement("div");
    playerDiv.id = "yt-ambient-inner";
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(playerDiv);

    try {
      playerRef.current = new (window as any).YT.Player("yt-ambient-inner", {
        height: "1",
        width: "1",
        videoId: track.youtubeId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
          loop: 1,
          playlist: track.youtubeId,
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(state.muted ? 0 : state.volume);
            event.target.playVideo();
          },
          onStateChange: (event: any) => {
            // Loop: when video ends, replay
            if (event.data === (window as any).YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
          },
        },
      });
    } catch (err) {
      console.warn("[AmbientMusic] Failed to create player:", err);
    }
  }, [state.volume, state.muted]);

  const playForRoom = useCallback((roomId: string) => {
    if (!state.musicEnabled) return;
    const track = ROOM_TRACKS[roomId];
    if (!track) return;
    if (state.currentTrack?.youtubeId === track.youtubeId && state.isPlaying) return;

    setState(prev => ({
      ...prev,
      isPlaying: true,
      currentTrack: track,
      currentRoomId: roomId,
    }));
    createPlayer(track);
  }, [state.musicEnabled, state.currentTrack, state.isPlaying, createPlayer]);

  const playGeneral = useCallback(() => {
    if (!state.musicEnabled) return;
    const idx = Math.floor(Math.random() * GENERAL_PLAYLIST.length);
    const track = GENERAL_PLAYLIST[idx];

    setState(prev => ({
      ...prev,
      isPlaying: true,
      currentTrack: track,
      currentRoomId: null,
    }));
    createPlayer(track);
  }, [state.musicEnabled, createPlayer]);

  const pause = useCallback(() => {
    try { playerRef.current?.pauseVideo(); } catch { /* ignore */ }
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const resume = useCallback(() => {
    try { playerRef.current?.playVideo(); } catch { /* ignore */ }
    setState(prev => ({ ...prev, isPlaying: true }));
  }, []);

  const toggleMute = useCallback(() => {
    setState(prev => {
      const newMuted = !prev.muted;
      try {
        if (newMuted) playerRef.current?.mute();
        else playerRef.current?.unMute();
      } catch { /* ignore */ }
      return { ...prev, muted: newMuted };
    });
  }, []);

  const setVolume = useCallback((v: number) => {
    setState(prev => ({ ...prev, volume: v }));
    try { playerRef.current?.setVolume(v); } catch { /* ignore */ }
  }, []);

  const toggleMusic = useCallback(() => {
    setState(prev => {
      const newEnabled = !prev.musicEnabled;
      if (!newEnabled) {
        try { playerRef.current?.pauseVideo(); } catch { /* ignore */ }
        return { ...prev, musicEnabled: false, isPlaying: false };
      }
      return { ...prev, musicEnabled: true };
    });
  }, []);

  const getTrackForRoom = useCallback((roomId: string) => {
    return ROOM_TRACKS[roomId];
  }, []);

  const allTracks = [...Object.values(ROOM_TRACKS), ...GENERAL_PLAYLIST];

  return (
    <AmbientMusicContext.Provider value={{
      ...state,
      playForRoom,
      playGeneral,
      pause,
      resume,
      toggleMute,
      setVolume,
      toggleMusic,
      getTrackForRoom,
      allTracks,
    }}>
      {children}
    </AmbientMusicContext.Provider>
  );
}

export function useAmbientMusic() {
  const ctx = useContext(AmbientMusicContext);
  if (!ctx) throw new Error("useAmbientMusic must be used within AmbientMusicProvider");
  return ctx;
}

export { ROOM_TRACKS, GENERAL_PLAYLIST };
