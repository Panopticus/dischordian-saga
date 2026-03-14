/* ═══════════════════════════════════════════════════════
   WATCH THE SHOW — Episode-by-episode viewer with
   embedded YouTube videos and a pop-up lore navigation
   panel showing connected characters, locations, games,
   and songs for each episode. Easy prev/next navigation.
   ═══════════════════════════════════════════════════════ */
import { useLoredex, type LoredexEntry } from "@/contexts/LoredexContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { Link, useLocation } from "wouter";
import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, ChevronLeft, ChevronRight, Users, MapPin, Swords, Music,
  Gamepad2, Eye, List, X, ChevronDown, ChevronUp, ExternalLink,
  Tv, SkipForward, SkipBack, Disc3, Sparkles, BookOpen
} from "lucide-react";

// ═══ EPISODE DATA ═══
// Each "episode" is a song with a music video, ordered by narrative chronology
// grouped by album (which maps to seasons/story arcs)

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

// Build episodes from songs with music videos, in album/track order
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
  "Dischordian Logic": "#00d9ff",
  "The Age of Privacy": "#4ade80",
  "The Book of Daniel 2:47": "#fbbf24",
  "Silence in Heaven": "#ff2d55",
};

// CoNexus game connections per song (from the data)
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

// Location connections per song
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

// Faction connections per song
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

function getEmbedUrl(url: string): string {
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

export default function WatchPage() {
  const { entries, getEntry, getEntryById, discoverEntry, musicVideos } = useLoredex();
  const { playSong, setQueue } = usePlayer();
  const [currentEpisodeIdx, setCurrentEpisodeIdx] = useState(0);
  const [showLorePanel, setShowLorePanel] = useState(true);
  const [showEpisodeList, setShowEpisodeList] = useState(false);
  const [loreTab, setLoreTab] = useState<"characters" | "locations" | "factions" | "games" | "songs">("characters");
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Build episode list from songs with music videos
  const episodes: Episode[] = useMemo(() => {
    const eps: Episode[] = [];
    const songsWithVideo = entries.filter(
      (e) => e.type === "song" && e.music_video && (e.music_video.official || e.music_video.vevo)
    );

    // Sort by album order, then track number
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

  // Discover entry when viewing
  useEffect(() => {
    if (currentEpisode) {
      discoverEntry(currentEpisode.id);
    }
  }, [currentEpisode?.id]);

  // Get related songs from same album (for "more from this album" section)
  const albumSongs = useMemo(() => {
    if (!currentEpisode) return [];
    return entries
      .filter((e) => e.type === "song" && e.album === currentEpisode.album)
      .sort((a, b) => (a.track_number || 0) - (b.track_number || 0));
  }, [currentEpisode, entries]);

  const goToEpisode = (idx: number) => {
    setCurrentEpisodeIdx(idx);
    setShowEpisodeList(false);
    videoContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goNext = () => {
    if (currentEpisodeIdx < episodes.length - 1) {
      goToEpisode(currentEpisodeIdx + 1);
    }
  };

  const goPrev = () => {
    if (currentEpisodeIdx > 0) {
      goToEpisode(currentEpisodeIdx - 1);
    }
  };

  if (episodes.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="font-mono text-muted-foreground">NO EPISODES AVAILABLE</p>
      </div>
    );
  }

  if (!currentEpisode) return null;

  const albumColor = ALBUM_COLORS[currentEpisode.album] || "#00d9ff";

  // Resolve lore entries
  const resolvedCharacters = currentEpisode.characters
    .map((name) => getEntry(name))
    .filter(Boolean) as LoredexEntry[];
  const resolvedLocations = currentEpisode.locations
    .map((name) => getEntry(name))
    .filter(Boolean) as LoredexEntry[];
  const resolvedFactions = currentEpisode.factions
    .map((name) => getEntry(name))
    .filter(Boolean) as LoredexEntry[];

  // Count items for each tab
  const tabCounts = {
    characters: resolvedCharacters.length,
    locations: resolvedLocations.length,
    factions: resolvedFactions.length,
    games: currentEpisode.conexusGames.length,
    songs: albumSongs.length,
  };

  return (
    <div className="animate-fade-in">
      {/* ═══ TOP BAR ═══ */}
      <div className="sticky top-12 z-30 bg-[oklch(0.06_0.01_280/0.95)] backdrop-blur-xl border-b border-border/20 px-3 sm:px-4 py-2">
        <div className="flex items-center gap-2">
          <Tv size={14} className="text-primary shrink-0" />
          <span className="font-display text-[10px] font-bold tracking-[0.2em] text-primary">WATCH THE SHOW</span>

          <div className="flex-1" />

          {/* Episode counter */}
          <span className="font-mono text-[10px] text-muted-foreground/50">
            EP <span className="text-foreground">{currentEpisodeIdx + 1}</span> / {episodes.length}
          </span>

          {/* Episode list toggle */}
          <button
            onClick={() => setShowEpisodeList(!showEpisodeList)}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-mono transition-all ${
              showEpisodeList
                ? "bg-primary/15 text-primary border border-primary/25"
                : "bg-secondary/50 text-muted-foreground hover:text-foreground border border-border/20"
            }`}
          >
            <List size={10} />
            EPISODES
          </button>

          {/* Lore panel toggle */}
          <button
            onClick={() => setShowLorePanel(!showLorePanel)}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-mono transition-all ${
              showLorePanel
                ? "bg-accent/15 text-accent border border-accent/25"
                : "bg-secondary/50 text-muted-foreground hover:text-foreground border border-border/20"
            }`}
          >
            <BookOpen size={10} />
            LORE
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* ═══ MAIN VIDEO AREA ═══ */}
        <div className={`flex-1 ${showLorePanel ? "lg:mr-0" : ""}`}>
          <div ref={videoContainerRef} className="p-3 sm:p-4">
            {/* Video Player */}
            <div className="rounded-lg overflow-hidden border border-border/30 bg-black mb-4">
              <div className="aspect-video">
                <iframe
                  key={currentEpisode.videoUrl}
                  src={getEmbedUrl(currentEpisode.videoUrl)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={currentEpisode.title}
                />
              </div>
            </div>

            {/* Episode Info */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider"
                  style={{
                    backgroundColor: albumColor + "15",
                    color: albumColor,
                    border: `1px solid ${albumColor}30`,
                  }}
                >
                  {currentEpisode.albumShort} #{currentEpisode.trackNumber}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground/40">
                  EPISODE {currentEpisodeIdx + 1} OF {episodes.length}
                </span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold tracking-wider text-foreground mb-1">
                {currentEpisode.title}
              </h2>
              <p className="font-mono text-xs text-muted-foreground mb-3">
                {currentEpisode.album} // Track {currentEpisode.trackNumber}
              </p>
              {currentEpisode.description && (
                <p className="text-sm text-foreground/70 leading-relaxed line-clamp-3">
                  {currentEpisode.description}
                </p>
              )}
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={goPrev}
                disabled={currentEpisodeIdx === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-secondary border border-border/30 text-sm font-mono text-foreground hover:bg-secondary/80 hover:border-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <SkipBack size={14} /> PREV
              </button>
              <button
                onClick={() => {
                  const songEntry = getEntryById(currentEpisode.id);
                  if (songEntry) {
                    playSong(songEntry);
                    setQueue(albumSongs);
                  }
                }}
                className="flex items-center gap-2 px-5 py-2 rounded-md bg-primary text-primary-foreground text-sm font-mono font-bold hover:scale-105 transition-transform"
              >
                <Play size={14} /> PLAY SONG
              </button>
              <button
                onClick={goNext}
                disabled={currentEpisodeIdx === episodes.length - 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-secondary border border-border/30 text-sm font-mono text-foreground hover:bg-secondary/80 hover:border-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                NEXT <SkipForward size={14} />
              </button>
              <div className="flex-1" />
              <Link
                href={`/song/${currentEpisode.id}`}
                className="flex items-center gap-1 px-3 py-2 rounded-md bg-secondary/50 border border-border/20 text-xs font-mono text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
              >
                VIEW DOSSIER <ChevronRight size={11} />
              </Link>
            </div>

            {/* Mobile Lore Panel (below video on mobile) */}
            <div className="lg:hidden">
              <AnimatePresence>
                {showLorePanel && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ═══ EPISODE LIST DRAWER ═══ */}
          <AnimatePresence>
            {showEpisodeList && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden border-t border-border/20"
              >
                <div className="p-3 sm:p-4 bg-card/20">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display text-xs font-bold tracking-[0.2em] text-foreground flex items-center gap-2">
                      <List size={13} /> ALL EPISODES
                    </h3>
                    <button
                      onClick={() => setShowEpisodeList(false)}
                      className="p-1 rounded hover:bg-secondary/50 text-muted-foreground"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {/* Group by album */}
                  {ALBUM_ORDER.map((albumName) => {
                    const albumEps = episodes.filter((ep) => ep.album === albumName);
                    if (albumEps.length === 0) return null;
                    const color = ALBUM_COLORS[albumName] || "#00d9ff";

                    return (
                      <div key={albumName} className="mb-4">
                        <p
                          className="font-display text-[10px] font-bold tracking-[0.15em] mb-2 px-1"
                          style={{ color }}
                        >
                          {albumName.toUpperCase()}
                        </p>
                        <div className="space-y-0.5">
                          {albumEps.map((ep) => {
                            const epIdx = episodes.indexOf(ep);
                            const isCurrent = epIdx === currentEpisodeIdx;
                            return (
                              <button
                                key={ep.id}
                                onClick={() => goToEpisode(epIdx)}
                                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-left transition-all ${
                                  isCurrent
                                    ? "bg-primary/10 border border-primary/25"
                                    : "hover:bg-secondary/30 border border-transparent"
                                }`}
                              >
                                <span
                                  className="font-mono text-[10px] w-5 text-right shrink-0 tabular-nums"
                                  style={{ color: isCurrent ? color : undefined }}
                                >
                                  {ep.trackNumber}
                                </span>
                                {isCurrent && (
                                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }}>
                                    <div className="w-full h-full rounded-full animate-ping" style={{ backgroundColor: color, opacity: 0.5 }} />
                                  </div>
                                )}
                                <span className={`text-xs truncate ${isCurrent ? "text-primary font-medium" : "text-foreground/70"}`}>
                                  {ep.title}
                                </span>
                                <span className="font-mono text-[8px] text-muted-foreground/30 ml-auto shrink-0">
                                  {ep.characters.length} chars
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ═══ DESKTOP LORE PANEL (right sidebar) ═══ */}
        <AnimatePresence>
          {showLorePanel && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 340 }}
              exit={{ opacity: 0, width: 0 }}
              className="hidden lg:block border-l border-border/20 bg-card/10 overflow-hidden shrink-0"
              style={{ minHeight: "calc(100vh - 6rem)" }}
            >
              <div className="w-[340px] overflow-y-auto" style={{ maxHeight: "calc(100vh - 6rem)" }}>
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
   LORE PANEL COMPONENT — Shows connected entities
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
    { key: "factions" as const, label: "FACTIONS", icon: Swords, count: tabCounts.factions },
    { key: "games" as const, label: "GAMES", icon: Gamepad2, count: tabCounts.games },
    { key: "songs" as const, label: "ALBUM", icon: Music, count: tabCounts.songs },
  ];

  return (
    <div className="p-3">
      {/* Panel Header */}
      <div className="flex items-center gap-2 mb-3">
        <BookOpen size={13} className="text-accent" />
        <span className="font-display text-[10px] font-bold tracking-[0.2em] text-accent">LORE CONNECTIONS</span>
      </div>

      {/* Episode Badge */}
      <div
        className="rounded-md p-2.5 mb-3 border"
        style={{
          backgroundColor: albumColor + "08",
          borderColor: albumColor + "20",
        }}
      >
        <p className="font-mono text-[9px] tracking-wider mb-0.5" style={{ color: albumColor + "80" }}>
          NOW VIEWING
        </p>
        <p className="font-display text-sm font-bold tracking-wide text-foreground">{episode.title}</p>
        <p className="font-mono text-[10px] text-muted-foreground/50">{episode.album}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-0.5 mb-3 bg-secondary/30 rounded-md p-0.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = loreTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setLoreTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1 px-1.5 py-1.5 rounded text-[9px] font-mono tracking-wider transition-all ${
                isActive
                  ? "bg-primary/15 text-primary border border-primary/20"
                  : "text-muted-foreground/60 hover:text-foreground"
              }`}
            >
              <Icon size={9} />
              <span className="hidden sm:inline lg:inline">{tab.label}</span>
              {tab.count > 0 && (
                <span className={`text-[8px] ${isActive ? "text-primary/60" : "text-muted-foreground/30"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-1">
        {loreTab === "characters" && (
          resolvedCharacters.length > 0 ? (
            resolvedCharacters.map((char) => (
              <LoreCard key={char.id} entry={char} type="character" />
            ))
          ) : (
            <EmptyState text="No character connections for this episode" />
          )
        )}

        {loreTab === "locations" && (
          resolvedLocations.length > 0 ? (
            resolvedLocations.map((loc) => (
              <LoreCard key={loc.id} entry={loc} type="location" />
            ))
          ) : (
            <EmptyState text="No location connections for this episode" />
          )
        )}

        {loreTab === "factions" && (
          resolvedFactions.length > 0 ? (
            resolvedFactions.map((fac) => (
              <LoreCard key={fac.id} entry={fac} type="faction" />
            ))
          ) : (
            <EmptyState text="No faction connections for this episode" />
          )
        )}

        {loreTab === "games" && (
          episode.conexusGames.length > 0 ? (
            episode.conexusGames.map((game) => (
              <div
                key={game}
                className="flex items-center gap-2.5 p-2.5 rounded-md border border-border/15 bg-card/20"
              >
                <div className="w-9 h-9 rounded-md bg-chart-5/10 border border-chart-5/20 flex items-center justify-center shrink-0">
                  <Gamepad2 size={14} className="text-chart-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-foreground">{game}</p>
                  <p className="text-[9px] font-mono text-muted-foreground/40">CONEXUS INTERACTIVE STORY</p>
                </div>
              </div>
            ))
          ) : (
            <EmptyState text="No CoNexus game connections for this episode" />
          )
        )}

        {loreTab === "songs" && (
          albumSongs.length > 0 ? (
            albumSongs.map((song) => (
              <Link
                key={song.id}
                href={`/song/${song.id}`}
                className={`group flex items-center gap-2 p-2 rounded-md border transition-all ${
                  song.id === episode.id
                    ? "border-primary/25 bg-primary/5"
                    : "border-border/10 hover:bg-secondary/20 hover:border-primary/15"
                }`}
              >
                <span className="font-mono text-[9px] text-muted-foreground/30 w-4 text-right tabular-nums shrink-0">
                  {song.track_number}
                </span>
                {song.image && (
                  <img src={song.image} alt="" className="w-7 h-7 rounded object-cover ring-1 ring-border/10 shrink-0" loading="lazy" />
                )}
                <div className="min-w-0 flex-1">
                  <p className={`text-[10px] font-medium truncate transition-colors ${
                    song.id === episode.id ? "text-primary" : "group-hover:text-primary"
                  }`}>
                    {song.name}
                  </p>
                </div>
                {song.id === episode.id && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                )}
                {(song.music_video?.official || song.music_video?.vevo) && song.id !== episode.id && (
                  <span className="text-[8px] font-mono text-destructive/50 shrink-0">VIDEO</span>
                )}
              </Link>
            ))
          ) : (
            <EmptyState text="No album tracks found" />
          )
        )}
      </div>
    </div>
  );
}

/* ═══ LORE CARD ═══ */
function LoreCard({ entry, type }: { entry: LoredexEntry; type: string }) {
  const [expanded, setExpanded] = useState(false);
  const href = type === "song" ? `/song/${entry.id}` : `/entity/${entry.id}`;

  const badgeClass =
    type === "character" ? "badge-character" :
    type === "location" ? "badge-location" :
    type === "faction" ? "badge-faction" :
    type === "song" ? "badge-song" : "badge-concept";

  const Icon =
    type === "character" ? Users :
    type === "location" ? MapPin :
    type === "faction" ? Swords : Music;

  return (
    <div className="rounded-md border border-border/15 bg-card/20 overflow-hidden">
      <div className="flex items-center gap-2.5 p-2.5">
        {entry.image ? (
          <img
            src={entry.image}
            alt={entry.name}
            className="w-9 h-9 rounded-md object-cover ring-1 ring-border/20 shrink-0"
            loading="lazy"
          />
        ) : (
          <div className="w-9 h-9 rounded-md bg-secondary/30 flex items-center justify-center shrink-0">
            <Icon size={14} className="text-muted-foreground/40" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium truncate">{entry.name}</p>
          <p className="text-[9px] font-mono text-muted-foreground/40 truncate">{entry.era || entry.affiliation || ""}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded hover:bg-secondary/50 text-muted-foreground/40 hover:text-foreground transition-colors"
          >
            {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </button>
          <Link
            href={href}
            className="p-1 rounded hover:bg-primary/10 text-muted-foreground/40 hover:text-primary transition-colors"
          >
            <ChevronRight size={11} />
          </Link>
        </div>
      </div>

      {/* Expanded bio */}
      <AnimatePresence>
        {expanded && entry.bio && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-2.5 pb-2.5 pt-0">
              <p className="text-[10px] text-foreground/60 leading-relaxed line-clamp-4">{entry.bio}</p>
              <Link
                href={href}
                className="inline-flex items-center gap-1 mt-1.5 text-[9px] font-mono text-primary hover:text-primary/80 transition-colors"
              >
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
      <p className="font-mono text-[10px] text-muted-foreground/30">{text}</p>
    </div>
  );
}
