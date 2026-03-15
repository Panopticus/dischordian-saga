/* ═══════════════════════════════════════════════════════
   THE DISCHORDIAN SAGA — Primary show experience
   organized by Epochs with YouTube playlists, plus
   individual episode viewer with lore connections.
   ═══════════════════════════════════════════════════════ */
import { useLoredex, type LoredexEntry } from "@/contexts/LoredexContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { useGamification } from "@/contexts/GamificationContext";
import { Link } from "wouter";
import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, ChevronLeft, ChevronRight, Users, MapPin, Swords, Music,
  Gamepad2, Eye, List, X, ChevronDown, ChevronUp, ExternalLink,
  Tv, SkipForward, SkipBack, Disc3, Sparkles, BookOpen, Radio,
  Clock, Zap, Globe, Film, Layers
} from "lucide-react";

/* ═══ EPOCH DATA ═══ */
interface Epoch {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  loreContext: string;
  playlistUrl: string;
  playlistId: string;
  color: string;
  icon: typeof Zap;
  order: number;
  type: "epoch" | "interlude" | "era";
  keyCharacters: string[];
}

const EPOCHS: Epoch[] = [
  {
    id: "fall-of-reality",
    title: "THE FALL OF REALITY",
    subtitle: "Epoch Zero",
    description: "Before the ages were named, before the factions rose — there was the Fall. Witness the cataclysm that shattered the old world and gave birth to the Dischordian timeline.",
    loreContext: "The Fall of Reality marks the end of human civilization as it was known. The Architect, the Enigma, and the first Potentials emerge from the ashes of a world consumed by its own creation. This is where it all begins.",
    playlistUrl: "https://youtube.com/playlist?list=PLhUHvGa0xBaQFYJatsDLPtvbQVDpzydl1",
    playlistId: "PLhUHvGa0xBaQFYJatsDLPtvbQVDpzydl1",
    color: "#FF3C40",
    icon: Zap,
    order: 0,
    type: "epoch",
    keyCharacters: ["The Architect", "The Enigma", "The Human", "The Warlord"],
  },
  {
    id: "epoch-1a",
    title: "THE AWAKENING",
    subtitle: "First Epoch",
    description: "The first age after the Fall. New powers awaken across the fractured multiverse. Factions form, alliances break, and the struggle for control of reality begins.",
    loreContext: "Epoch 1 chronicles the emergence of the Potentials — beings of extraordinary power born from the chaos of the Fall. The Architect builds the Panopticon, the Warlord conquers worlds, and the seeds of the Dischordian conflict are sown.",
    playlistUrl: "https://youtube.com/playlist?list=PLhUHvGa0xBaRniDT5eztLsXFTzbR0JaCu",
    playlistId: "PLhUHvGa0xBaRniDT5eztLsXFTzbR0JaCu",
    color: "#33E2E6",
    icon: Globe,
    order: 1,
    type: "epoch",
    keyCharacters: ["The Oracle", "The Collector", "Iron Lion", "The Source"],
  },
  {
    id: "epoch-1b",
    title: "THE FALL OF REALITY",
    subtitle: "The Engineer",
    description: "The Engineer's story unfolds — a tale of creation, sacrifice, and the machines that would reshape the multiverse forever.",
    loreContext: "The Engineer's arc reveals the technological foundations of the Dischordian universe. From the construction of the first dimensional bridges to the creation of sentient machines, this chapter explores how engineering ambition both saved and doomed civilizations.",
    playlistUrl: "https://youtube.com/playlist?list=PLhUHvGa0xBaQfuKeeqx7cLOfhZ1Fr1-jb",
    playlistId: "PLhUHvGa0xBaQfuKeeqx7cLOfhZ1Fr1-jb",
    color: "#33E2E6",
    icon: Globe,
    order: 2,
    type: "epoch",
    keyCharacters: ["The Architect", "The Human", "The Enigma"],
  },
  {
    id: "spaces-between",
    title: "THE SPACES INBETWEEN",
    subtitle: "Interlude",
    description: "In the gaps between the great ages, smaller stories play out — visions, echoes, and fragments of realities that exist in the liminal spaces of the multiverse.",
    loreContext: "The Spaces Between are not empty. They are filled with visions — random stories set across the universe, glimpses of lives lived in the margins of the great epochs. The CoNexus records everything.",
    playlistUrl: "https://youtube.com/playlist?list=PLhUHvGa0xBaQdgXe7lQz5mYRYQaaWZ86i",
    playlistId: "PLhUHvGa0xBaQdgXe7lQz5mYRYQaaWZ86i",
    color: "#A078FF",
    icon: Sparkles,
    order: 3,
    type: "interlude",
    keyCharacters: ["The Necromancer", "The Meme", "Agent Zero"],
  },
  {
    id: "epoch-2",
    title: "BEING AND TIME",
    subtitle: "Second Epoch",
    description: "The second great age. Questions of existence, consciousness, and the nature of time itself become the battlefield. The Programmer emerges.",
    loreContext: "Epoch 2: Being and Time explores the philosophical dimensions of the Dischordian universe. Dr. Daniel Cross — the Programmer — begins his journey through time. The Age of Revelation approaches, and with it, truths that will reshape everything.",
    playlistUrl: "https://youtube.com/playlist?list=PLhUHvGa0xBaQXcM_dscfjlqjYOeGCvtoE",
    playlistId: "PLhUHvGa0xBaQXcM_dscfjlqjYOeGCvtoE",
    color: "#3875FA",
    icon: Clock,
    order: 4,
    type: "epoch",
    keyCharacters: ["The Programmer", "The Oracle", "The Collector"],
  },
  {
    id: "age-of-privacy",
    title: "THE AGE OF PRIVACY",
    subtitle: "Era",
    description: "The era immediately preceding the Age of Revelation. Surveillance, control, and the erosion of freedom define this period. Malkia Ukweli — the Enigma — fights for truth.",
    loreContext: "The Age of Privacy is the penultimate era before everything changes. It is a time of secrets, surveillance, and the struggle between those who would control information and those who would set it free. This era leads directly into the Age of Revelation, which precedes the Fall of Reality.",
    playlistUrl: "https://youtube.com/playlist?list=PLhUHvGa0xBaQ8W2PK16gS07gtBg3m64m2",
    playlistId: "PLhUHvGa0xBaQ8W2PK16gS07gtBg3m64m2",
    color: "#FF8C00",
    icon: Eye,
    order: 5,
    type: "era",
    keyCharacters: ["The Enigma", "The Architect", "The Warlord"],
  },
  {
    id: "conexus-stories",
    title: "CONEXUS STORIES",
    subtitle: "Bonus",
    description: "Behind-the-scenes and supplementary stories from the CoNexus — the interdimensional network that connects all realities in the Dischordian universe.",
    loreContext: "The CoNexus is more than a network — it is a living archive of every story ever told across the multiverse. These bonus episodes explore the CoNexus itself, its guardians, and the stories that don't fit neatly into any single epoch.",
    playlistUrl: "https://youtube.com/playlist?list=PLhUHvGa0xBaQdlo3Xgz4_5_TFFw2YzmAz",
    playlistId: "PLhUHvGa0xBaQdlo3Xgz4_5_TFFw2YzmAz",
    color: "#10B981",
    icon: Radio,
    order: 6,
    type: "interlude",
    keyCharacters: ["The Warlord", "The Necromancer", "The Oracle"],
  },
];

/* ═══ EPISODE DATA (from songs with videos) ═══ */
interface Episode {
  id: string;
  title: string;
  album: string;
  albumShort: string;
  trackNumber: number;
  videoUrl: string;
  description: string;
  characters: string[];
  locations: string[];
  factions: string[];
  conexusGames: string[];
  era: string;
}

const ALBUM_ORDER = [
  "Dischordian Logic",
  "The Age of Privacy",
  "The Book of Daniel 2:47",
  "Silence in Heaven",
];

const ALBUM_SHORT: Record<string, string> = {
  "Dischordian Logic": "DL",
  "The Age of Privacy": "AOP",
  "The Book of Daniel 2:47": "BOD",
  "Silence in Heaven": "SIH",
};

const ALBUM_COLORS: Record<string, string> = {
  "Dischordian Logic": "#33E2E6",
  "The Age of Privacy": "#FF8C00",
  "The Book of Daniel 2:47": "#A078FF",
  "Silence in Heaven": "#FF3C40",
};

const SONG_CONEXUS: Record<string, string[]> = {
  "Building the Architect": ["Building the Architect"],
  "The Prisoner": ["The Prisoner"],
  "Ocularum": ["The Warlord"],
  "The Politician's Reign": ["The Warlord"],
  "To Be the Human": ["The Warlord"],
  "Welcome to Celebration": ["The Warlord"],
  "The Ninth": ["The Ninth"],
  "Judgment Day": ["The Oracle"],
  "Walk in Power": ["The Ninth"],
  "The Queen of Truth": ["The Oracle"],
  "A Very Civil War": ["The Warlord", "The Nomad"],
  "The Ocularum": ["The Warlord"],
  "Awaken the Clone": ["The Collector"],
  "I Love War": ["The Warlord"],
  "Planet of the Wolf": ["Planet of the Wolf"],
  "The Book of Daniel 2.0": ["Building the Architect"],
  "Theft of All Time": ["The Collector", "The Warlord"],
  "The Source": ["The Oracle"],
  "The Oracle": ["The Oracle"],
};

const SONG_LOCATIONS: Record<string, string[]> = {
  "Building the Architect": ["The Panopticon"],
  "The Prisoner": ["The Panopticon"],
  "Ocularum": ["The Panopticon", "New Babylon"],
  "The Politician's Reign": ["New Babylon"],
  "To Be the Human": ["Mechronis Academy", "Project Celebration"],
  "Welcome to Celebration": ["Project Celebration"],
  "The Ninth": ["The Heart of Time", "The Inbetween Spaces"],
  "Judgment Day": ["Thaloria"],
  "Walk in Power": ["New Babylon"],
  "The Queen of Truth": ["Thaloria"],
  "A Very Civil War": ["New Babylon", "Zenon"],
  "The Ocularum": ["The Panopticon"],
  "Awaken the Clone": ["Veridan Prime"],
  "I Love War": ["Zenon"],
  "Planet of the Wolf": ["The Crucible"],
  "The Book of Daniel 2.0": ["The Panopticon"],
  "Theft of All Time": ["Thaloria"],
  "The Source": ["Terminus"],
  "The Oracle": ["Thaloria"],
};

const SONG_FACTIONS: Record<string, string[]> = {
  "A Very Civil War": ["The Insurgency"],
  "Awaken the Clone": ["The Clone Army"],
  "The Ninth": ["The Hierarchy of the Damned"],
  "Ocularum": ["The Insurgency"],
  "The Ocularum": ["The Insurgency"],
  "Theft of All Time": ["The Clone Army"],
  "Planet of the Wolf": ["The League"],
  "The Oracle": ["The Syndicate of Death", "The Council of Harmony"],
};

function getPlaylistEmbedUrl(playlistId: string): string {
  return `https://www.youtube.com/embed/videoseries?list=${playlistId}&rel=0&modestbranding=1`;
}

function getVideoEmbedUrl(url: string): string {
  try {
    if (url.includes("watch?v=")) {
      const videoId = url.split("watch?v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
    }
    return url;
  } catch {
    return url;
  }
}

/* ═══ CONTINUE WATCHING — localStorage progress tracking ═══ */
const WATCH_PROGRESS_KEY = "loredex_watch_progress";

interface WatchProgress {
  watchedEpochs: string[];
  watchedEpisodes: string[];
  lastWatchedEpoch: string | null;
  lastWatchedEpisode: string | null;
  lastWatchedAt: number;
}

function getWatchProgress(): WatchProgress {
  try {
    const saved = localStorage.getItem(WATCH_PROGRESS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { watchedEpochs: [], watchedEpisodes: [], lastWatchedEpoch: null, lastWatchedEpisode: null, lastWatchedAt: 0 };
}

function saveWatchProgress(progress: WatchProgress) {
  localStorage.setItem(WATCH_PROGRESS_KEY, JSON.stringify(progress));
}

/* ═══ VIEW MODES ═══ */
type ViewMode = "epochs" | "episodes";

export default function WatchPage() {
  const { entries, getEntry, discoverEntry, musicVideos } = useLoredex();
  const { playSong, setQueue } = usePlayer();
  const gamification = useGamification();
  const [viewMode, setViewMode] = useState<ViewMode>("epochs");
  const [activeEpoch, setActiveEpoch] = useState<string | null>(null);
  const [currentEpisodeIdx, setCurrentEpisodeIdx] = useState(0);
  const [showLorePanel, setShowLorePanel] = useState(false);
  const [loreTab, setLoreTab] = useState<"characters" | "locations" | "factions" | "games" | "songs">("characters");
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const epochRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [watchProgress, setWatchProgress] = useState<WatchProgress>(getWatchProgress);

  const markEpochWatched = (epochId: string) => {
    setWatchProgress(prev => {
      const next = {
        ...prev,
        watchedEpochs: prev.watchedEpochs.includes(epochId) ? prev.watchedEpochs : [...prev.watchedEpochs, epochId],
        lastWatchedEpoch: epochId,
        lastWatchedAt: Date.now(),
      };
      saveWatchProgress(next);
      return next;
    });
  };

  const markEpisodeWatched = (episodeId: string) => {
    setWatchProgress(prev => {
      const next = {
        ...prev,
        watchedEpisodes: prev.watchedEpisodes.includes(episodeId) ? prev.watchedEpisodes : [...prev.watchedEpisodes, episodeId],
        lastWatchedEpisode: episodeId,
        lastWatchedAt: Date.now(),
      };
      saveWatchProgress(next);
      return next;
    });
  };

  // Build episode list from songs with music videos
  const episodes: Episode[] = useMemo(() => {
    const eps: Episode[] = [];
    const songsWithVideo = entries.filter(
      (e) => e.type === "song" && e.music_video && (e.music_video.official || e.music_video.vevo)
    );
    songsWithVideo.sort((a, b) => {
      const aAlbumIdx = ALBUM_ORDER.indexOf(a.album || "");
      const bAlbumIdx = ALBUM_ORDER.indexOf(b.album || "");
      if (aAlbumIdx !== bAlbumIdx) return aAlbumIdx - bAlbumIdx;
      return (a.track_number || 0) - (b.track_number || 0);
    });
    songsWithVideo.forEach((song) => {
      const videoUrl = song.music_video?.official || song.music_video?.vevo || "";
      if (!videoUrl) return;
      eps.push({
        id: song.id,
        title: song.name,
        album: song.album || "Unknown",
        albumShort: ALBUM_SHORT[song.album || ""] || "?",
        trackNumber: song.track_number || 0,
        videoUrl,
        description: song.history || song.bio || "",
        characters: song.characters_featured || [],
        locations: SONG_LOCATIONS[song.name] || [],
        factions: SONG_FACTIONS[song.name] || [],
        conexusGames: SONG_CONEXUS[song.name] || [],
        era: song.era || "",
      });
    });
    return eps;
  }, [entries]);

  const currentEpisode = episodes[currentEpisodeIdx];

  useEffect(() => {
    if (currentEpisode && viewMode === "episodes") {
      discoverEntry(currentEpisode.id);
      gamification.watchEpisode(currentEpisode.id);
      markEpisodeWatched(currentEpisode.id);
    }
  }, [currentEpisode?.id, viewMode]);

  // Compute "next up" suggestion
  const nextUpEpoch = useMemo(() => {
    if (watchProgress.watchedEpochs.length === 0) return EPOCHS[0];
    const lastIdx = EPOCHS.findIndex(e => e.id === watchProgress.lastWatchedEpoch);
    if (lastIdx >= 0 && lastIdx < EPOCHS.length - 1) return EPOCHS[lastIdx + 1];
    // Find first unwatched
    const unwatched = EPOCHS.find(e => !watchProgress.watchedEpochs.includes(e.id));
    return unwatched || null;
  }, [watchProgress]);

  const nextUpEpisode = useMemo(() => {
    if (episodes.length === 0) return null;
    if (watchProgress.watchedEpisodes.length === 0) return { episode: episodes[0], index: 0 };
    const lastIdx = episodes.findIndex(e => e.id === watchProgress.lastWatchedEpisode);
    if (lastIdx >= 0 && lastIdx < episodes.length - 1) return { episode: episodes[lastIdx + 1], index: lastIdx + 1 };
    const unwatchedIdx = episodes.findIndex(e => !watchProgress.watchedEpisodes.includes(e.id));
    if (unwatchedIdx >= 0) return { episode: episodes[unwatchedIdx], index: unwatchedIdx };
    return null;
  }, [watchProgress, episodes]);

  const albumSongs = useMemo(() => {
    if (!currentEpisode) return [];
    return entries
      .filter((e) => e.type === "song" && e.album === currentEpisode.album)
      .sort((a, b) => (a.track_number || 0) - (b.track_number || 0));
  }, [currentEpisode, entries]);

  const goToEpisode = (idx: number) => {
    setCurrentEpisodeIdx(idx);
    setViewMode("episodes");
    videoContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToEpoch = (epochId: string) => {
    setActiveEpoch(epochId);
    epochRefs.current[epochId]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (viewMode === "episodes" && currentEpisode) {
    return (
      <EpisodeViewer
        episodes={episodes}
        currentEpisodeIdx={currentEpisodeIdx}
        currentEpisode={currentEpisode}
        albumSongs={albumSongs}
        showLorePanel={showLorePanel}
        setShowLorePanel={setShowLorePanel}
        loreTab={loreTab}
        setLoreTab={setLoreTab}
        getEntry={getEntry}
        goToEpisode={goToEpisode}
        setViewMode={setViewMode}
        videoContainerRef={videoContainerRef}
      />
    );
  }

  return (
    <div className="animate-fade-in">
      {/* ═══ HERO HEADER ═══ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 50% 20%, rgba(56,117,250,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(255,60,64,0.08) 0%, transparent 50%)"
          }} />
        </div>
        <div className="relative px-4 sm:px-6 pt-8 pb-6 sm:pt-12 sm:pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Signal line */}
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 max-w-12 bg-gradient-to-r from-transparent to-[var(--alert-red)]/50" />
              <span className="font-mono text-[10px] text-[var(--alert-red)]/70 tracking-[0.4em]">TRANSMISSION // CLASSIFIED</span>
              <div className="h-px flex-1 max-w-12 bg-gradient-to-l from-transparent to-[var(--alert-red)]/50" />
            </div>

            <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black tracking-wider text-white mb-2 leading-tight">
              THE <span className="text-[var(--neon-cyan)] glow-cyan">DISCHORDIAN</span> SAGA
            </h1>
            <p className="font-mono text-xs sm:text-sm text-white/60 max-w-2xl mb-5 leading-relaxed">
              A multiverse-spanning narrative told through music, film, and interactive experiences.
              Follow the story from the <span className="text-[var(--alert-red)]">Fall of Reality</span> through
              the <span className="text-[var(--neon-cyan)]">rise of the Potentials</span> to
              the <span className="text-[var(--orb-orange)]">Age of Privacy</span>.
            </p>

            {/* View mode toggle */}
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setViewMode("epochs")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono text-xs tracking-wider transition-all ${
                  viewMode === "epochs"
                    ? "bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/30"
                    : "text-white/40 border border-white/10 hover:text-white/60 hover:border-white/20"
                }`}
              >
                <Layers size={14} />
                EPOCHS
              </button>
              <button
                onClick={() => setViewMode("episodes")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono text-xs tracking-wider transition-all ${
                  viewMode === "episodes"
                    ? "bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/30"
                    : "text-white/40 border border-white/10 hover:text-white/60 hover:border-white/20"
                }`}
              >
                <Film size={14} />
                EPISODES ({episodes.length})
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ CONTINUE WATCHING ═══ */}
      {(watchProgress.watchedEpochs.length > 0 || watchProgress.watchedEpisodes.length > 0) && (
        <div className="px-4 sm:px-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-xl p-4 sm:p-5"
            style={{
              background: "linear-gradient(135deg, var(--glass-base) 0%, var(--glass-dark) 100%)",
              border: "1px solid var(--neon-cyan)20",
              boxShadow: "0 0 20px rgba(51,226,230,0.05)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Play size={13} className="text-[var(--neon-cyan)]" />
              <span className="font-display text-[10px] font-bold tracking-[0.2em] text-[var(--neon-cyan)]">CONTINUE WATCHING</span>
              <span className="font-mono text-[9px] text-white/25">
                {watchProgress.watchedEpochs.length}/{EPOCHS.length} EPOCHS // {watchProgress.watchedEpisodes.length}/{episodes.length} EPISODES
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-1 rounded-full bg-white/5 mb-3 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(2, (watchProgress.watchedEpochs.length / EPOCHS.length) * 100)}%`,
                  background: "linear-gradient(90deg, var(--neon-cyan), var(--deep-purple))",
                }}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Next Epoch */}
              {nextUpEpoch && (
                <button
                  onClick={() => scrollToEpoch(nextUpEpoch.id)}
                  className="flex items-center gap-3 flex-1 p-3 rounded-lg border border-white/10 bg-white/3 hover:bg-white/5 hover:border-[var(--neon-cyan)]/20 transition-all text-left group"
                >
                  <div
                    className="w-10 h-10 rounded-md flex items-center justify-center shrink-0"
                    style={{ background: nextUpEpoch.color + "15", border: `1px solid ${nextUpEpoch.color}25` }}
                  >
                    {(() => { const EIcon = nextUpEpoch.icon; return <EIcon size={16} style={{ color: nextUpEpoch.color }} />; })()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[9px] text-white/30 mb-0.5">NEXT EPOCH</p>
                    <p className="font-display text-xs font-bold tracking-wider text-white group-hover:text-[var(--neon-cyan)] transition-colors truncate">
                      {nextUpEpoch.title}
                    </p>
                  </div>
                  <ChevronRight size={14} className="text-white/20 group-hover:text-[var(--neon-cyan)] transition-colors shrink-0" />
                </button>
              )}

              {/* Next Episode */}
              {nextUpEpisode && (
                <button
                  onClick={() => goToEpisode(nextUpEpisode.index)}
                  className="flex items-center gap-3 flex-1 p-3 rounded-lg border border-white/10 bg-white/3 hover:bg-white/5 hover:border-[var(--alert-red)]/20 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-md flex items-center justify-center shrink-0 bg-[var(--alert-red)]/10 border border-[var(--alert-red)]/20">
                    <Film size={16} className="text-[var(--alert-red)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[9px] text-white/30 mb-0.5">NEXT EPISODE</p>
                    <p className="font-display text-xs font-bold tracking-wider text-white group-hover:text-[var(--alert-red)] transition-colors truncate">
                      {nextUpEpisode.episode.title}
                    </p>
                    <p className="font-mono text-[8px] text-white/20">{nextUpEpisode.episode.album}</p>
                  </div>
                  <ChevronRight size={14} className="text-white/20 group-hover:text-[var(--alert-red)] transition-colors shrink-0" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* ═══ EPOCH NAVIGATION STRIP ═══ */}
      <div className="px-4 sm:px-6 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {EPOCHS.map((epoch) => {
            const Icon = epoch.icon;
            return (
              <button
                key={epoch.id}
                onClick={() => scrollToEpoch(epoch.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-[10px] tracking-wider whitespace-nowrap transition-all shrink-0 border ${
                  activeEpoch === epoch.id
                    ? "border-opacity-40 bg-opacity-10"
                    : "border-white/10 bg-white/3 hover:bg-white/5 hover:border-white/20"
                }`}
                style={{
                  borderColor: activeEpoch === epoch.id ? epoch.color + "66" : undefined,
                  backgroundColor: activeEpoch === epoch.id ? epoch.color + "15" : undefined,
                  color: activeEpoch === epoch.id ? epoch.color : "rgba(255,255,255,0.5)",
                }}
              >
                <Icon size={12} />
                <span>{epoch.title}</span>
                {epoch.subtitle && (
                  <span className="text-[8px] opacity-60">// {epoch.subtitle}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ EPOCH SECTIONS ═══ */}
      <div className="px-4 sm:px-6 space-y-8 pb-12">
        {EPOCHS.map((epoch, idx) => (
          <EpochSection
            key={epoch.id}
            epoch={epoch}
            index={idx}
            ref={(el) => { epochRefs.current[epoch.id] = el; }}
            onWatchEpisodes={() => setViewMode("episodes")}
            getEntry={getEntry}
            onMarkWatched={markEpochWatched}
            isWatched={watchProgress.watchedEpochs.includes(epoch.id)}
          />
        ))}

        {/* ═══ INDIVIDUAL EPISODES TEASER ═══ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl p-5 sm:p-6"
          style={{
            background: "linear-gradient(135deg, var(--glass-base) 0%, var(--glass-dark) 100%)",
            border: "1px solid var(--glass-border)",
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Film size={16} className="text-[var(--neon-cyan)]" />
            <h2 className="font-display text-sm font-bold tracking-[0.2em] text-white">INDIVIDUAL EPISODES</h2>
            <span className="font-mono text-[10px] text-white/30">{episodes.length} MUSIC VIDEOS</span>
          </div>
          <p className="font-mono text-xs text-white/60 mb-4 max-w-xl">
            Each song with a music video is an episode in the saga. Watch them individually with full lore connections — see which characters, locations, and factions appear in each.
          </p>
          <button
            onClick={() => setViewMode("episodes")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-md font-mono text-xs tracking-wider transition-all bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/30 hover:bg-[var(--neon-cyan)]/20"
          >
            <Play size={14} />
            WATCH EPISODES
            <ChevronRight size={12} />
          </button>
        </motion.section>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   EPOCH SECTION — Individual epoch card with playlist
   ═══════════════════════════════════════════════════════ */
import { forwardRef } from "react";

interface EpochSectionProps {
  epoch: Epoch;
  index: number;
  onWatchEpisodes: () => void;
  getEntry: (name: string) => LoredexEntry | undefined;
  onMarkWatched: (epochId: string) => void;
  isWatched: boolean;
}

const EpochSection = forwardRef<HTMLDivElement, EpochSectionProps>(
  ({ epoch, index, onWatchEpisodes, getEntry, onMarkWatched, isWatched }, ref) => {
    const [expanded, setExpanded] = useState(index === 0); // First epoch starts expanded
    const [showPlayer, setShowPlayer] = useState(false);
    const Icon = epoch.icon;

    const typeBadge = epoch.type === "epoch"
      ? "EPOCH"
      : epoch.type === "interlude"
      ? "INTERLUDE"
      : "ERA";

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * index, duration: 0.5 }}
        className="rounded-xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--glass-base) 0%, var(--glass-dark) 100%)",
          border: `1px solid ${epoch.color}20`,
          boxShadow: expanded ? `0 0 30px ${epoch.color}08` : "none",
        }}
      >
        {/* Epoch Header — always visible */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left p-4 sm:p-6 transition-all group"
        >
          <div className="flex items-start gap-3 sm:gap-4">
            {/* Epoch Icon */}
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center shrink-0 relative"
              style={{
                background: `linear-gradient(135deg, ${epoch.color}20 0%, ${epoch.color}08 100%)`,
                border: `1px solid ${epoch.color}30`,
              }}
            >
              <Icon size={20} style={{ color: epoch.color }} />
              {expanded && (
                <div
                  className="absolute inset-0 rounded-lg animate-cyber-pulse"
                  style={{ boxShadow: `0 0 15px ${epoch.color}20` }}
                />
              )}
            </div>

            <div className="flex-1 min-w-0">
              {/* Type badge + order */}
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="font-mono text-[9px] tracking-[0.3em] px-2 py-0.5 rounded"
                  style={{
                    color: epoch.color,
                    background: epoch.color + "15",
                    border: `1px solid ${epoch.color}25`,
                  }}
                >
                  {typeBadge}
                </span>
                {epoch.subtitle && (
                  <span className="font-mono text-[10px] text-white/30">// {epoch.subtitle}</span>
                )}
                {isWatched && (
                  <span className="font-mono text-[9px] tracking-wider px-1.5 py-0.5 rounded bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/20">
                    VIEWED
                  </span>
                )}
              </div>

              {/* Title */}
              <h2
                className="font-display text-base sm:text-lg font-bold tracking-wider mb-1.5"
                style={{ color: epoch.color }}
              >
                {epoch.title}
              </h2>

              {/* Description */}
              <p className="font-mono text-xs text-white/60 leading-relaxed line-clamp-2 group-hover:text-white/70 transition-colors">
                {epoch.description}
              </p>
            </div>

            {/* Expand indicator */}
            <ChevronDown
              size={16}
              className={`shrink-0 transition-transform duration-300 text-white/30 ${expanded ? "rotate-180" : ""}`}
            />
          </div>
        </button>

        {/* Expanded Content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-4 sm:px-6 pb-5 sm:pb-6 space-y-4">
                {/* Divider */}
                <div className="h-px" style={{ background: `linear-gradient(to right, transparent, ${epoch.color}30, transparent)` }} />

                {/* Lore Context */}
                <div
                  className="rounded-lg p-3 sm:p-4"
                  style={{
                    background: epoch.color + "08",
                    border: `1px solid ${epoch.color}15`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen size={12} style={{ color: epoch.color }} />
                    <span className="font-mono text-[9px] tracking-[0.2em]" style={{ color: epoch.color + "90" }}>
                      LORE CONTEXT
                    </span>
                  </div>
                  <p className="font-mono text-xs text-white/70 leading-relaxed">
                    {epoch.loreContext}
                  </p>
                </div>

                {/* Key Characters */}
                {epoch.keyCharacters.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Users size={12} style={{ color: epoch.color }} />
                      <span className="font-mono text-[9px] tracking-[0.2em]" style={{ color: epoch.color + "90" }}>
                        KEY OPERATIVES
                      </span>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                      {epoch.keyCharacters.map((charName) => {
                        const entry = getEntry(charName);
                        if (!entry) return null;
                        return (
                          <Link
                            key={entry.id}
                            href={`/entity/${entry.id}`}
                            className="group shrink-0 w-16 sm:w-20 text-center"
                          >
                            <div
                              className="w-14 h-14 sm:w-18 sm:h-18 mx-auto rounded-lg overflow-hidden mb-1 ring-1 ring-white/10 group-hover:ring-2 transition-all"
                              style={{ boxShadow: `0 0 10px ${epoch.color}10` }}
                            >
                              {entry.image ? (
                                <img
                                  src={entry.image}
                                  alt={entry.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center" style={{ background: epoch.color + "15" }}>
                                  <Users size={16} style={{ color: epoch.color }} />
                                </div>
                              )}
                            </div>
                            <p className="font-mono text-[9px] text-white/50 group-hover:text-white/80 truncate transition-colors">
                              {entry.name.replace('The ', '')}
                            </p>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* YouTube Playlist Player */}
                {!showPlayer ? (
                  <button
                    onClick={() => { setShowPlayer(true); onMarkWatched(epoch.id); }}
                    className="w-full rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center gap-3 transition-all group"
                    style={{
                      background: `linear-gradient(135deg, ${epoch.color}10 0%, var(--glass-dark) 100%)`,
                      border: `1px solid ${epoch.color}20`,
                    }}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center transition-all group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${epoch.color}30 0%, ${epoch.color}10 100%)`,
                        border: `2px solid ${epoch.color}50`,
                        boxShadow: `0 0 20px ${epoch.color}20`,
                      }}
                    >
                      <Play size={24} className="ml-1" style={{ color: epoch.color }} />
                    </div>
                    <div className="text-center">
                      <p className="font-display text-sm font-bold tracking-wider text-white mb-1">
                        PLAY {epoch.title}
                      </p>
                      <p className="font-mono text-[10px] text-white/40">
                        YouTube Playlist // Click to load
                      </p>
                    </div>
                  </button>
                ) : (
                  <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${epoch.color}20` }}>
                    <div className="aspect-video w-full">
                      <iframe
                        src={getPlaylistEmbedUrl(epoch.playlistId)}
                        title={epoch.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        style={{ border: "none" }}
                      />
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2">
                  <a
                    href={epoch.playlistUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-md font-mono text-[10px] tracking-wider transition-all text-white/50 border border-white/10 hover:text-white/80 hover:border-white/20 hover:bg-white/5"
                  >
                    <ExternalLink size={11} />
                    OPEN ON YOUTUBE
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);

EpochSection.displayName = "EpochSection";

/* ═══════════════════════════════════════════════════════
   EPISODE VIEWER — Individual episode with lore panel
   ═══════════════════════════════════════════════════════ */
interface EpisodeViewerProps {
  episodes: Episode[];
  currentEpisodeIdx: number;
  currentEpisode: Episode;
  albumSongs: LoredexEntry[];
  showLorePanel: boolean;
  setShowLorePanel: (v: boolean) => void;
  loreTab: "characters" | "locations" | "factions" | "games" | "songs";
  setLoreTab: (tab: "characters" | "locations" | "factions" | "games" | "songs") => void;
  getEntry: (name: string) => LoredexEntry | undefined;
  goToEpisode: (idx: number) => void;
  setViewMode: (mode: ViewMode) => void;
  videoContainerRef: React.RefObject<HTMLDivElement | null>;
}

function EpisodeViewer({
  episodes,
  currentEpisodeIdx,
  currentEpisode,
  albumSongs,
  showLorePanel,
  setShowLorePanel,
  loreTab,
  setLoreTab,
  getEntry,
  goToEpisode,
  setViewMode,
  videoContainerRef,
}: EpisodeViewerProps) {
  const [showEpisodeList, setShowEpisodeList] = useState(false);
  const albumColor = ALBUM_COLORS[currentEpisode.album] || "#33E2E6";

  const resolvedCharacters = currentEpisode.characters
    .map((name) => getEntry(name))
    .filter(Boolean) as LoredexEntry[];
  const resolvedLocations = currentEpisode.locations
    .map((name) => getEntry(name))
    .filter(Boolean) as LoredexEntry[];
  const resolvedFactions = currentEpisode.factions
    .map((name) => getEntry(name))
    .filter(Boolean) as LoredexEntry[];

  const tabCounts = {
    characters: resolvedCharacters.length,
    locations: resolvedLocations.length,
    factions: resolvedFactions.length,
    games: currentEpisode.conexusGames.length,
    songs: albumSongs.length,
  };

  return (
    <div className="animate-fade-in">
      {/* Top Bar */}
      <div className="sticky top-12 z-30 px-3 sm:px-4 py-2"
        style={{
          background: "rgba(1,0,32,0.95)",
          borderBottom: "1px solid var(--glass-border)",
          backdropFilter: "blur(20px)",
        }}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("epochs")}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-mono text-white/50 hover:text-[var(--neon-cyan)] transition-colors"
          >
            <ChevronLeft size={12} />
            EPOCHS
          </button>

          <div className="w-px h-4 bg-white/10" />

          <Tv size={12} className="text-[var(--neon-cyan)] shrink-0" />
          <span className="font-display text-[10px] font-bold tracking-[0.15em] text-[var(--neon-cyan)]">EPISODE VIEWER</span>

          <div className="flex-1" />

          <span className="font-mono text-[10px] text-white/30">
            EP <span className="text-white/70">{currentEpisodeIdx + 1}</span> / {episodes.length}
          </span>

          <button
            onClick={() => setShowEpisodeList(!showEpisodeList)}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-mono transition-all ${
              showEpisodeList
                ? "bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/25"
                : "text-white/40 border border-white/10 hover:text-white/60"
            }`}
          >
            <List size={10} />
            LIST
          </button>

          <button
            onClick={() => setShowLorePanel(!showLorePanel)}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-mono transition-all ${
              showLorePanel
                ? "bg-[var(--orb-orange)]/10 text-[var(--orb-orange)] border border-[var(--orb-orange)]/25"
                : "text-white/40 border border-white/10 hover:text-white/60"
            }`}
          >
            <BookOpen size={10} />
            LORE
          </button>
        </div>
      </div>

      {/* Episode List Dropdown */}
      <AnimatePresence>
        {showEpisodeList && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b"
            style={{
              background: "rgba(1,0,32,0.95)",
              borderColor: "var(--glass-border)",
            }}
          >
            <div className="max-h-60 overflow-y-auto p-2 space-y-0.5">
              {episodes.map((ep, i) => {
                const epColor = ALBUM_COLORS[ep.album] || "#33E2E6";
                return (
                  <button
                    key={ep.id}
                    onClick={() => goToEpisode(i)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition-all ${
                      i === currentEpisodeIdx
                        ? "bg-[var(--neon-cyan)]/8 border border-[var(--neon-cyan)]/20"
                        : "hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <span className="font-mono text-[9px] text-white/25 w-5 text-right shrink-0">{i + 1}</span>
                    <span
                      className="font-mono text-[8px] px-1.5 py-0.5 rounded shrink-0"
                      style={{ color: epColor, background: epColor + "15", border: `1px solid ${epColor}25` }}
                    >
                      {ep.albumShort}
                    </span>
                    <span className={`text-xs font-medium truncate ${i === currentEpisodeIdx ? "text-[var(--neon-cyan)]" : "text-white/70"}`}>
                      {ep.title}
                    </span>
                    {i === currentEpisodeIdx && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--neon-cyan)] shrink-0 ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row">
        {/* Video + Info */}
        <div className="flex-1">
          {/* Video Player */}
          <div ref={videoContainerRef} className="w-full">
            <div className="aspect-video w-full" style={{ background: "var(--glass-dark)" }}>
              <iframe
                key={currentEpisode.id}
                src={getVideoEmbedUrl(currentEpisode.videoUrl)}
                title={currentEpisode.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ border: "none" }}
              />
            </div>
          </div>

          {/* Episode Info */}
          <div className="px-3 sm:px-4 py-3 sm:py-4">
            {/* Album badge + title */}
            <div className="flex items-center gap-2 mb-1">
              <span
                className="font-mono text-[9px] px-2 py-0.5 rounded tracking-wider"
                style={{ color: albumColor, background: albumColor + "15", border: `1px solid ${albumColor}25` }}
              >
                {currentEpisode.albumShort}
              </span>
              <span className="font-mono text-[9px] text-white/25">TRACK {currentEpisode.trackNumber}</span>
            </div>
            <h2 className="font-display text-lg sm:text-xl font-bold tracking-wider text-white mb-1">
              {currentEpisode.title}
            </h2>
            <p className="font-mono text-[11px] text-white/40 mb-3">{currentEpisode.album}</p>

            {currentEpisode.description && (
              <p className="font-mono text-xs text-white/60 leading-relaxed mb-4 max-w-2xl line-clamp-3">
                {currentEpisode.description}
              </p>
            )}

            {/* Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => currentEpisodeIdx > 0 && goToEpisode(currentEpisodeIdx - 1)}
                disabled={currentEpisodeIdx === 0}
                className="flex items-center gap-1 px-3 py-2 rounded-md font-mono text-[10px] tracking-wider transition-all disabled:opacity-20 text-white/50 border border-white/10 hover:text-white/80 hover:border-white/20"
              >
                <SkipBack size={12} />
                PREV
              </button>
              <button
                onClick={() => currentEpisodeIdx < episodes.length - 1 && goToEpisode(currentEpisodeIdx + 1)}
                disabled={currentEpisodeIdx === episodes.length - 1}
                className="flex items-center gap-1 px-3 py-2 rounded-md font-mono text-[10px] tracking-wider transition-all disabled:opacity-20 text-white/50 border border-white/10 hover:text-white/80 hover:border-white/20"
              >
                NEXT
                <SkipForward size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Lore Panel */}
        <AnimatePresence>
          {showLorePanel && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="lg:w-72 xl:w-80 overflow-hidden border-l"
              style={{
                background: "rgba(0,2,41,0.6)",
                borderColor: "var(--glass-border)",
              }}
            >
              <div className="w-72 xl:w-80">
                <LorePanel
                  episode={currentEpisode}
                  resolvedCharacters={resolvedCharacters}
                  resolvedLocations={resolvedLocations}
                  resolvedFactions={resolvedFactions}
                  albumSongs={albumSongs}
                  loreTab={loreTab}
                  setLoreTab={setLoreTab}
                  tabCounts={tabCounts}
                  getEntry={getEntry}
                  albumColor={albumColor}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   LORE PANEL — Shows connected entities for an episode
   ═══════════════════════════════════════════════════════ */
interface LorePanelProps {
  episode: Episode;
  resolvedCharacters: LoredexEntry[];
  resolvedLocations: LoredexEntry[];
  resolvedFactions: LoredexEntry[];
  albumSongs: LoredexEntry[];
  loreTab: "characters" | "locations" | "factions" | "games" | "songs";
  setLoreTab: (tab: "characters" | "locations" | "factions" | "games" | "songs") => void;
  tabCounts: Record<string, number>;
  getEntry: (name: string) => LoredexEntry | undefined;
  albumColor: string;
}

function LorePanel({
  episode,
  resolvedCharacters,
  resolvedLocations,
  resolvedFactions,
  albumSongs,
  loreTab,
  setLoreTab,
  tabCounts,
  getEntry,
  albumColor,
}: LorePanelProps) {
  const tabs = [
    { key: "characters" as const, label: "CHARS", icon: Users, count: tabCounts.characters },
    { key: "locations" as const, label: "LOCS", icon: MapPin, count: tabCounts.locations },
    { key: "factions" as const, label: "FACS", icon: Swords, count: tabCounts.factions },
    { key: "games" as const, label: "GAMES", icon: Gamepad2, count: tabCounts.games },
    { key: "songs" as const, label: "ALBUM", icon: Music, count: tabCounts.songs },
  ];

  return (
    <div className="p-3">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen size={13} className="text-[var(--orb-orange)]" />
        <span className="font-display text-[10px] font-bold tracking-[0.2em] text-[var(--orb-orange)]">LORE CONNECTIONS</span>
      </div>

      <div
        className="rounded-md p-2.5 mb-3 border"
        style={{ backgroundColor: albumColor + "08", borderColor: albumColor + "20" }}
      >
        <p className="font-mono text-[9px] tracking-wider mb-0.5" style={{ color: albumColor + "80" }}>NOW VIEWING</p>
        <p className="font-display text-sm font-bold tracking-wide text-white">{episode.title}</p>
        <p className="font-mono text-[10px] text-white/40">{episode.album}</p>
      </div>

      <div className="flex gap-0.5 mb-3 p-0.5 rounded-md" style={{ background: "var(--glass-dark)" }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = loreTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setLoreTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1 px-1.5 py-1.5 rounded text-[9px] font-mono tracking-wider transition-all ${
                isActive
                  ? "bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/20"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              <Icon size={9} />
              <span className="hidden sm:inline lg:inline">{tab.label}</span>
              {tab.count > 0 && (
                <span className={`text-[8px] ${isActive ? "text-[var(--neon-cyan)]/60" : "text-white/20"}`}>{tab.count}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="space-y-1">
        {loreTab === "characters" && (
          resolvedCharacters.length > 0 ? (
            resolvedCharacters.map((char) => <LoreCard key={char.id} entry={char} type="character" />)
          ) : <EmptyState text="No character connections for this episode" />
        )}
        {loreTab === "locations" && (
          resolvedLocations.length > 0 ? (
            resolvedLocations.map((loc) => <LoreCard key={loc.id} entry={loc} type="location" />)
          ) : <EmptyState text="No location connections for this episode" />
        )}
        {loreTab === "factions" && (
          resolvedFactions.length > 0 ? (
            resolvedFactions.map((fac) => <LoreCard key={fac.id} entry={fac} type="faction" />)
          ) : <EmptyState text="No faction connections for this episode" />
        )}
        {loreTab === "games" && (
          episode.conexusGames.length > 0 ? (
            episode.conexusGames.map((game) => (
              <div key={game} className="flex items-center gap-2.5 p-2.5 rounded-md" style={{ background: "var(--glass-dark)", border: "1px solid var(--glass-border)" }}>
                <div className="w-9 h-9 rounded-md flex items-center justify-center shrink-0" style={{ background: "var(--deep-purple)" + "15", border: `1px solid var(--deep-purple)30` }}>
                  <Gamepad2 size={14} className="text-[var(--deep-purple)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-white">{game}</p>
                  <p className="text-[9px] font-mono text-white/30">CONEXUS INTERACTIVE STORY</p>
                </div>
              </div>
            ))
          ) : <EmptyState text="No CoNexus game connections for this episode" />
        )}
        {loreTab === "songs" && (
          albumSongs.length > 0 ? (
            albumSongs.map((song) => (
              <Link
                key={song.id}
                href={`/song/${song.id}`}
                className={`group flex items-center gap-2 p-2 rounded-md border transition-all ${
                  song.id === episode.id
                    ? "border-[var(--neon-cyan)]/25 bg-[var(--neon-cyan)]/5"
                    : "border-transparent hover:bg-white/5 hover:border-[var(--neon-cyan)]/15"
                }`}
              >
                <span className="font-mono text-[9px] text-white/20 w-4 text-right tabular-nums shrink-0">{song.track_number}</span>
                {song.image && (
                  <img src={song.image} alt="" className="w-7 h-7 rounded object-cover ring-1 ring-white/10 shrink-0" loading="lazy" />
                )}
                <div className="min-w-0 flex-1">
                  <p className={`text-[10px] font-medium truncate transition-colors ${
                    song.id === episode.id ? "text-[var(--neon-cyan)]" : "group-hover:text-[var(--neon-cyan)]"
                  }`}>{song.name}</p>
                </div>
                {song.id === episode.id && <div className="w-1.5 h-1.5 rounded-full bg-[var(--neon-cyan)] shrink-0" />}
                {(song.music_video?.official || song.music_video?.vevo) && song.id !== episode.id && (
                  <span className="text-[8px] font-mono text-[var(--alert-red)]/50 shrink-0">VIDEO</span>
                )}
              </Link>
            ))
          ) : <EmptyState text="No album tracks found" />
        )}
      </div>
    </div>
  );
}

/* ═══ LORE CARD ═══ */
function LoreCard({ entry, type }: { entry: LoredexEntry; type: string }) {
  const [expanded, setExpanded] = useState(false);
  const href = type === "song" ? `/song/${entry.id}` : `/entity/${entry.id}`;

  const Icon =
    type === "character" ? Users :
    type === "location" ? MapPin :
    type === "faction" ? Swords : Music;

  const iconColor =
    type === "character" ? "var(--neon-cyan)" :
    type === "location" ? "var(--signal-green)" :
    type === "faction" ? "var(--orb-orange)" : "var(--deep-purple)";

  return (
    <div className="rounded-md overflow-hidden" style={{ background: "var(--glass-dark)", border: "1px solid var(--glass-border)" }}>
      <div className="flex items-center gap-2.5 p-2.5">
        {entry.image ? (
          <img src={entry.image} alt={entry.name} className="w-9 h-9 rounded-md object-cover ring-1 ring-white/10 shrink-0" loading="lazy" />
        ) : (
          <div className="w-9 h-9 rounded-md flex items-center justify-center shrink-0" style={{ background: "var(--glass-base)" }}>
            <Icon size={14} style={{ color: iconColor }} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium text-white truncate">{entry.name}</p>
          <p className="text-[9px] font-mono text-white/30 truncate">{entry.era || entry.affiliation || ""}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded hover:bg-white/10 text-white/30 hover:text-white/70 transition-colors"
          >
            {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </button>
          <Link href={href} className="p-1 rounded hover:bg-[var(--neon-cyan)]/10 text-white/30 hover:text-[var(--neon-cyan)] transition-colors">
            <ChevronRight size={11} />
          </Link>
        </div>
      </div>
      <AnimatePresence>
        {expanded && entry.bio && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-2.5 pb-2.5 pt-0">
              <p className="text-[10px] text-white/50 leading-relaxed line-clamp-4">{entry.bio}</p>
              <Link href={href} className="inline-flex items-center gap-1 mt-1.5 text-[9px] font-mono text-[var(--neon-cyan)] hover:text-[var(--neon-cyan)]/80 transition-colors">
                FULL DOSSIER <ChevronRight size={8} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="py-6 text-center">
      <p className="font-mono text-[10px] text-white/20">{text}</p>
    </div>
  );
}
