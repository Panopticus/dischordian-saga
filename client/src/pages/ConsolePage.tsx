/* ═══════════════════════════════════════════════════════
   INCEPTION ARK CONSOLE — The bridge of your personal Ark.
   Central hub connecting all content: media player, timeline,
   lore database, combat simulator, doom scroll, trophy case.
   Themeable, franchise-pluggable, gamification-integrated.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useLoredex, type LoredexEntry } from "@/contexts/LoredexContext";
import { useGamification } from "@/contexts/GamificationContext";
import { trpc } from "@/lib/trpc";
import { usePlayer } from "@/contexts/PlayerContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tv, Play, SkipBack, SkipForward, Maximize2, Minimize2,
  Map, Users, MapPin, Swords, Music, Clock, Search, Terminal,
  Gamepad2, Trophy, Star, Shield, ChevronRight, ChevronLeft,
  Disc3, Eye, Zap, Skull, BookOpen, Settings, Palette,
  Lock, Unlock, X, ExternalLink, BarChart3, Newspaper,
  Crosshair, Sparkles, Volume2, VolumeX, ChevronDown
} from "lucide-react";

/* ─── TYPES ─── */
interface MediaItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  videoUrl?: string;
  type: "video" | "song" | "game";
  album?: string;
}

type ConsolePanel = "media" | "timeline" | "lore" | "combat" | "trophies" | "themes" | "doom";

/* ─── ALBUM DATA ─── */
const ALBUM_ORDER = [
  "Dischordian Logic",
  "The Age of Privacy",
  "The Book of Daniel 2:47",
  "Silence in Heaven",
];

/* ─── HELPER: Extract YouTube ID ─── */
function getYouTubeId(url: string): string {
  const m = url.match(/(?:v=|\/embed\/|youtu\.be\/)([^&?#]+)/);
  return m ? m[1] : "";
}

/* ═══════════════════════════════════════════════════════
   MAIN CONSOLE COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function ConsolePage() {
  const { entries, stats, getEntry, getByType, getByAlbum, search: searchEntries } = useLoredex();
  const gam = useGamification();
  const { playSong, setQueue } = usePlayer();
  const [, navigate] = useLocation();

  const theme = gam.currentTheme.colors;

  /* ─── STATE ─── */
  const [activePanel, setActivePanel] = useState<ConsolePanel>("media");
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [viewerExpanded, setViewerExpanded] = useState(false);
  const [viewerPopped, setViewerPopped] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mediaCategory, setMediaCategory] = useState<string>("all");
  const [selectedAlbum, setSelectedAlbum] = useState<string>("all");
  const [showThemePanel, setShowThemePanel] = useState(false);

  /* ─── BUILD MEDIA ITEMS ─── */
  const mediaItems = useMemo(() => {
    const items: MediaItem[] = [];

    // Music videos
    entries.forEach((e) => {
      if (e.type === "song" && e.music_video) {
        const url = e.music_video.official || e.music_video.vevo || "";
        if (url) {
          items.push({
            id: e.id,
            title: e.name,
            subtitle: e.album || "Unknown Album",
            image: e.image || "",
            videoUrl: url,
            type: "video",
            album: e.album,
          });
        }
      }
    });

    // Songs (audio only)
    entries.forEach((e) => {
      if (e.type === "song" && !items.find((i) => i.id === e.id)) {
        items.push({
          id: e.id,
          title: e.name,
          subtitle: e.album || "Unknown Album",
          image: e.image || "",
          type: "song",
          album: e.album,
        });
      }
    });

    return items;
  }, [entries]);

  const filteredMedia = useMemo(() => {
    let items = mediaItems;
    if (mediaCategory !== "all") {
      items = items.filter((i) => i.type === mediaCategory);
    }
    if (selectedAlbum !== "all") {
      items = items.filter((i) => i.album === selectedAlbum);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (i) => i.title.toLowerCase().includes(q) || i.subtitle.toLowerCase().includes(q)
      );
    }
    return items;
  }, [mediaItems, mediaCategory, selectedAlbum, searchQuery]);

  // Group by album for Netflix-style rows
  const mediaByAlbum = useMemo(() => {
    const groups: Record<string, MediaItem[]> = {};
    ALBUM_ORDER.forEach((a) => (groups[a] = []));
    filteredMedia.forEach((item) => {
      const album = item.album || "Other";
      if (!groups[album]) groups[album] = [];
      groups[album].push(item);
    });
    return Object.entries(groups).filter(([, items]) => items.length > 0);
  }, [filteredMedia]);

  /* ─── AUTO-SELECT FIRST VIDEO ─── */
  useEffect(() => {
    if (!selectedMedia && mediaItems.length > 0) {
      const firstVideo = mediaItems.find((m) => m.type === "video");
      if (firstVideo) setSelectedMedia(firstVideo);
    }
  }, [mediaItems, selectedMedia]);

  /* ─── NAVIGATE MEDIA ─── */
  const currentVideoIndex = useMemo(() => {
    const videos = mediaItems.filter((m) => m.type === "video");
    return videos.findIndex((v) => v.id === selectedMedia?.id);
  }, [mediaItems, selectedMedia]);

  const goNext = useCallback(() => {
    const videos = mediaItems.filter((m) => m.type === "video");
    const next = videos[(currentVideoIndex + 1) % videos.length];
    if (next) setSelectedMedia(next);
  }, [mediaItems, currentVideoIndex]);

  const goPrev = useCallback(() => {
    const videos = mediaItems.filter((m) => m.type === "video");
    const prev = videos[(currentVideoIndex - 1 + videos.length) % videos.length];
    if (prev) setSelectedMedia(prev);
  }, [mediaItems, currentVideoIndex]);

  /* ─── CHARACTERS FOR LORE PANEL ─── */
  const characters = useMemo(() => getByType("character").slice(0, 30), [getByType]);
  const locations = useMemo(() => getByType("location"), [getByType]);
  const factions = useMemo(() => getByType("faction"), [getByType]);

  /* ─── TROPHY DATA ─── */
  const earnedCount = gam.earnedAchievements.length;
  const totalCount = gam.achievements.length;

  /* ─── PANEL DEFINITIONS ─── */
  const PANELS: { id: ConsolePanel; label: string; icon: typeof Tv; color: string }[] = [
    { id: "media", label: "MEDIA BAY", icon: Tv, color: theme.primary },
    { id: "lore", label: "DATABASE", icon: BookOpen, color: theme.accent },
    { id: "combat", label: "COMBAT SIM", icon: Gamepad2, color: "#ef4444" },
    { id: "timeline", label: "TIMELINE", icon: Clock, color: "#a855f7" },
    { id: "trophies", label: "TROPHIES", icon: Trophy, color: "#eab308" },
    { id: "themes", label: "ARK THEMES", icon: Palette, color: "#22c55e" },
    { id: "doom", label: "DOOM SCROLL", icon: Newspaper, color: "#f97316" },
  ];

  /* ═══ RENDER ═══ */
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: theme.bg, color: theme.text }}
    >
      {/* ─── AMBIENT BACKGROUND ─── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Star field */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `radial-gradient(1px 1px at 10% 20%, ${theme.primary}40, transparent),
            radial-gradient(1px 1px at 30% 60%, ${theme.primary}30, transparent),
            radial-gradient(1px 1px at 50% 10%, ${theme.accent}20, transparent),
            radial-gradient(1px 1px at 70% 80%, ${theme.primary}25, transparent),
            radial-gradient(1px 1px at 90% 40%, ${theme.accent}30, transparent),
            radial-gradient(2px 2px at 15% 85%, ${theme.primary}15, transparent),
            radial-gradient(1px 1px at 85% 15%, ${theme.primary}20, transparent)`,
        }} />
        {/* Scan line */}
        <div
          className="absolute left-0 right-0 h-px opacity-10"
          style={{
            background: `linear-gradient(90deg, transparent, ${theme.primary}, transparent)`,
            top: `${(Date.now() / 50) % 100}%`,
            animation: "none",
          }}
        />
        {/* Corner brackets */}
        <svg className="absolute top-2 left-2 w-8 h-8 opacity-20" viewBox="0 0 32 32">
          <path d="M0 12 L0 0 L12 0" fill="none" stroke={theme.primary} strokeWidth="1" />
        </svg>
        <svg className="absolute top-2 right-2 w-8 h-8 opacity-20" viewBox="0 0 32 32">
          <path d="M20 0 L32 0 L32 12" fill="none" stroke={theme.primary} strokeWidth="1" />
        </svg>
        <svg className="absolute bottom-2 left-2 w-8 h-8 opacity-20" viewBox="0 0 32 32">
          <path d="M0 20 L0 32 L12 32" fill="none" stroke={theme.primary} strokeWidth="1" />
        </svg>
        <svg className="absolute bottom-2 right-2 w-8 h-8 opacity-20" viewBox="0 0 32 32">
          <path d="M20 32 L32 32 L32 20" fill="none" stroke={theme.primary} strokeWidth="1" />
        </svg>
      </div>

      {/* ─── CONSOLE HEADER ─── */}
      <div className="relative z-10 px-3 sm:px-6 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: theme.primary + "20", border: `1px solid ${theme.primary}40` }}
            >
              <Crosshair size={16} style={{ color: theme.primary }} />
            </div>
            <div>
              <h1 className="font-display text-sm font-bold tracking-[0.2em]" style={{ color: theme.primary }}>
                INCEPTION ARK
              </h1>
              <p className="font-mono text-[9px] opacity-40 tracking-wider">
                {gam.currentTheme.name.toUpperCase()} // {gam.title.toUpperCase()} // LV.{gam.level}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* XP Bar */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md" style={{ background: theme.panel }}>
              <Star size={10} style={{ color: theme.accent }} />
              <div className="w-20 h-1 rounded-full overflow-hidden" style={{ background: theme.secondary }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${gam.xpProgress}%`, background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})` }}
                />
              </div>
              <span className="font-mono text-[9px]" style={{ color: theme.accent }}>{gam.xp} XP</span>
            </div>

            {/* Points */}
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md" style={{ background: theme.panel }}>
              <Zap size={10} className="text-amber-400" />
              <span className="font-mono text-[10px] text-amber-400">{gam.gameSave.fightPoints}</span>
            </div>

            {/* Theme toggle */}
            <button
              onClick={() => setShowThemePanel(!showThemePanel)}
              className="p-1.5 rounded-md transition-colors"
              style={{ background: theme.primary + "15", border: `1px solid ${theme.primary}30` }}
            >
              <Palette size={14} style={{ color: theme.primary }} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── MAIN CONSOLE LAYOUT ─── */}
      <div className="relative z-10 px-3 sm:px-6 pb-6">
        {/* Panel Navigation */}
        <div className="flex gap-1 mb-3 overflow-x-auto pb-1 scrollbar-hide">
          {PANELS.map((panel) => {
            const Icon = panel.icon;
            const active = activePanel === panel.id;
            return (
              <button
                key={panel.id}
                onClick={() => setActivePanel(panel.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-[10px] tracking-wider whitespace-nowrap transition-all shrink-0"
                style={{
                  background: active ? panel.color + "20" : "transparent",
                  border: `1px solid ${active ? panel.color + "50" : "transparent"}`,
                  color: active ? panel.color : theme.text + "60",
                  boxShadow: active ? `0 0 12px ${panel.color}15` : "none",
                }}
              >
                <Icon size={12} />
                {panel.label}
              </button>
            );
          })}
        </div>

        {/* ═══ VIEWING SCREEN + CONTENT AREA ═══ */}
        <div className={`grid gap-3 ${viewerExpanded ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-[1fr_340px]"}`}>
          {/* LEFT: Main Viewing Screen */}
          <div className="space-y-3">
            {/* Video Player */}
            {selectedMedia && selectedMedia.videoUrl && !viewerPopped && (
              <div
                className={`rounded-lg overflow-hidden relative group ${viewerExpanded ? "aspect-video max-h-[80vh]" : "aspect-video"}`}
                style={{
                  border: `1px solid ${theme.primary}30`,
                  boxShadow: `0 0 30px ${theme.primary}10, inset 0 0 30px ${theme.primary}05`,
                }}
              >
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(selectedMedia.videoUrl)}?rel=0&modestbranding=1`}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />

                {/* Player Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={goPrev} className="p-1 rounded hover:bg-white/10"><SkipBack size={16} /></button>
                      <button onClick={goNext} className="p-1 rounded hover:bg-white/10"><SkipForward size={16} /></button>
                      <span className="font-mono text-xs ml-2">{selectedMedia.title}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setViewerExpanded(!viewerExpanded)}
                        className="p-1 rounded hover:bg-white/10"
                      >
                        {viewerExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                      </button>
                      <button
                        onClick={() => setViewerPopped(true)}
                        className="p-1 rounded hover:bg-white/10"
                        title="Pop out"
                      >
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Now Playing Badge */}
                <div
                  className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-md backdrop-blur-sm"
                  style={{ background: theme.primary + "20", border: `1px solid ${theme.primary}30` }}
                >
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: theme.primary }} />
                  <span className="font-mono text-[9px]" style={{ color: theme.primary }}>NOW PLAYING</span>
                </div>
              </div>
            )}

            {/* Popped out viewer placeholder */}
            {viewerPopped && selectedMedia && (
              <div
                className="aspect-video rounded-lg flex items-center justify-center"
                style={{ background: theme.panel, border: `1px dashed ${theme.primary}30` }}
              >
                <div className="text-center">
                  <ExternalLink size={24} className="mx-auto mb-2 opacity-40" />
                  <p className="font-mono text-xs opacity-40">Video playing in pop-out window</p>
                  <button
                    onClick={() => setViewerPopped(false)}
                    className="mt-2 font-mono text-[10px] px-3 py-1 rounded"
                    style={{ background: theme.primary + "20", color: theme.primary }}
                  >
                    RETURN TO CONSOLE
                  </button>
                </div>
              </div>
            )}

            {/* No video selected */}
            {!selectedMedia && (
              <div
                className="aspect-video rounded-lg flex items-center justify-center"
                style={{ background: theme.panel, border: `1px solid ${theme.primary}15` }}
              >
                <div className="text-center">
                  <Tv size={32} className="mx-auto mb-2 opacity-20" />
                  <p className="font-mono text-xs opacity-30">Select content to begin</p>
                </div>
              </div>
            )}

            {/* ═══ PANEL CONTENT BELOW VIEWER ═══ */}
            <AnimatePresence mode="wait">
              {activePanel === "media" && (
                <motion.div
                  key="media"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {/* Category filters */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {[
                      { id: "all", label: "ALL" },
                      { id: "video", label: "VIDEOS" },
                      { id: "song", label: "SONGS" },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setMediaCategory(cat.id)}
                        className="px-2.5 py-1 rounded font-mono text-[10px] tracking-wider transition-all"
                        style={{
                          background: mediaCategory === cat.id ? theme.primary + "20" : "transparent",
                          border: `1px solid ${mediaCategory === cat.id ? theme.primary + "40" : theme.primary + "10"}`,
                          color: mediaCategory === cat.id ? theme.primary : theme.text + "50",
                        }}
                      >
                        {cat.label}
                      </button>
                    ))}
                    <div className="flex-1" />
                    <input
                      type="text"
                      placeholder="Search media..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="px-2.5 py-1 rounded font-mono text-[10px] w-40 outline-none"
                      style={{
                        background: theme.secondary,
                        border: `1px solid ${theme.primary}20`,
                        color: theme.text,
                      }}
                    />
                  </div>

                  {/* Netflix-style album rows */}
                  {mediaByAlbum.map(([album, items]) => (
                    <div key={album} className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Disc3 size={12} style={{ color: theme.accent }} />
                        <h3 className="font-display text-xs font-bold tracking-wider" style={{ color: theme.accent }}>
                          {album.toUpperCase()}
                        </h3>
                        <span className="font-mono text-[9px] opacity-30">{items.length} items</span>
                      </div>
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              setSelectedMedia(item);
                              gam.watchEpisode(item.id);
                            }}
                            className="shrink-0 w-32 sm:w-40 rounded-lg overflow-hidden group transition-all hover:scale-105"
                            style={{
                              border: `1px solid ${selectedMedia?.id === item.id ? theme.primary + "60" : theme.primary + "15"}`,
                              boxShadow: selectedMedia?.id === item.id ? `0 0 15px ${theme.primary}20` : "none",
                            }}
                          >
                            <div className="aspect-square relative overflow-hidden">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center" style={{ background: theme.secondary }}>
                                  <Music size={20} className="opacity-30" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                              {item.type === "video" && (
                                <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: theme.primary + "30" }}>
                                  <Play size={8} style={{ color: theme.primary }} />
                                </div>
                              )}
                              {selectedMedia?.id === item.id && (
                                <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ background: theme.primary + "30" }}>
                                  <div className="w-1 h-1 rounded-full animate-pulse" style={{ background: theme.primary }} />
                                  <span className="font-mono text-[7px]" style={{ color: theme.primary }}>PLAYING</span>
                                </div>
                              )}
                            </div>
                            <div className="p-2" style={{ background: theme.panel }}>
                              <p className="font-mono text-[10px] truncate" style={{ color: theme.text }}>{item.title}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activePanel === "lore" && (
                <motion.div
                  key="lore"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                    {[
                      { label: "CHARACTERS", count: stats.characters, icon: Users, href: "/search?type=character", color: theme.primary },
                      { label: "LOCATIONS", count: stats.locations, icon: MapPin, href: "/search?type=location", color: theme.accent },
                      { label: "FACTIONS", count: stats.factions, icon: Swords, href: "/search?type=faction", color: "#ef4444" },
                      { label: "SONGS", count: stats.songs, icon: Music, href: "/search?type=song", color: "#a855f7" },
                    ].map((stat) => {
                      const Icon = stat.icon;
                      return (
                        <Link
                          key={stat.label}
                          href={stat.href}
                          className="rounded-lg p-3 transition-all hover:scale-105"
                          style={{ background: theme.panel, border: `1px solid ${stat.color}20` }}
                        >
                          <Icon size={16} style={{ color: stat.color }} />
                          <p className="font-display text-lg font-bold mt-1">{stat.count}</p>
                          <p className="font-mono text-[9px] opacity-40">{stat.label}</p>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Quick character grid */}
                  <h3 className="font-display text-xs font-bold tracking-wider mb-2" style={{ color: theme.accent }}>
                    KEY OPERATIVES
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-2">
                    {characters.slice(0, 16).map((char) => (
                      <Link
                        key={char.id}
                        href={`/entity/${char.id}`}
                        className="rounded-lg overflow-hidden group transition-all hover:scale-105"
                        style={{ border: `1px solid ${theme.primary}15` }}
                      >
                        <div className="aspect-square relative">
                          {char.image ? (
                            <img src={char.image} alt={char.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center" style={{ background: theme.secondary }}>
                              <Users size={14} className="opacity-30" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                          <p className="absolute bottom-1 left-1 right-1 font-mono text-[7px] truncate text-white">{char.name}</p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Link
                      href="/search"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-[10px] tracking-wider"
                      style={{ background: theme.primary + "15", border: `1px solid ${theme.primary}30`, color: theme.primary }}
                    >
                      <Search size={10} /> SEARCH DATABASE
                    </Link>
                    <Link
                      href="/board"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-[10px] tracking-wider"
                      style={{ background: theme.accent + "15", border: `1px solid ${theme.accent}30`, color: theme.accent }}
                    >
                      <Map size={10} /> CONSPIRACY BOARD
                    </Link>
                  </div>
                </motion.div>
              )}

              {activePanel === "combat" && (
                <motion.div
                  key="combat"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="rounded-lg p-4 sm:p-6 text-center" style={{ background: theme.panel, border: `1px solid #ef444430` }}>
                    <Gamepad2 size={32} className="mx-auto mb-3 text-red-400" />
                    <h3 className="font-display text-lg font-bold tracking-wider text-red-400 mb-1">COMBAT SIMULATOR</h3>
                    <p className="font-mono text-[10px] opacity-50 mb-4">
                      2D fighting game featuring Dischordian Saga characters
                    </p>

                    <div className="grid grid-cols-3 gap-3 mb-4 max-w-md mx-auto">
                      <div className="rounded-lg p-2" style={{ background: theme.secondary }}>
                        <p className="font-display text-lg font-bold text-red-400">{gam.gameSave.totalFights}</p>
                        <p className="font-mono text-[8px] opacity-40">TOTAL FIGHTS</p>
                      </div>
                      <div className="rounded-lg p-2" style={{ background: theme.secondary }}>
                        <p className="font-display text-lg font-bold text-green-400">{gam.progress.fightWins}</p>
                        <p className="font-mono text-[8px] opacity-40">VICTORIES</p>
                      </div>
                      <div className="rounded-lg p-2" style={{ background: theme.secondary }}>
                        <p className="font-display text-lg font-bold text-amber-400">{gam.gameSave.bestWinStreak}</p>
                        <p className="font-mono text-[8px] opacity-40">BEST STREAK</p>
                      </div>
                    </div>

                    <Link
                      href="/fight"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-mono text-sm tracking-wider transition-all hover:scale-105"
                      style={{
                        background: "linear-gradient(135deg, #ef4444, #dc2626)",
                        color: "white",
                        boxShadow: "0 0 20px rgba(239,68,68,0.3)",
                      }}
                    >
                      <Swords size={16} /> ENTER ARENA
                    </Link>
                  </div>
                </motion.div>
              )}

              {activePanel === "timeline" && (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="rounded-lg p-4 sm:p-6" style={{ background: theme.panel, border: `1px solid #a855f730` }}>
                    <Clock size={24} className="text-purple-400 mb-2" />
                    <h3 className="font-display text-sm font-bold tracking-wider text-purple-400 mb-1">INTERACTIVE TIMELINE</h3>
                    <p className="font-mono text-[10px] opacity-50 mb-4">
                      Explore {stats.total_entries} entities across 107,600 years of the A.A. calendar
                    </p>
                    <div className="flex gap-2">
                      <Link
                        href="/character-timeline"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-md font-mono text-[10px] tracking-wider transition-all hover:scale-105"
                        style={{ background: "#a855f720", border: "1px solid #a855f740", color: "#a855f7" }}
                      >
                        <BarChart3 size={12} /> CHARACTER TIMELINE
                      </Link>
                      <Link
                        href="/timeline"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-md font-mono text-[10px] tracking-wider transition-all hover:scale-105"
                        style={{ background: "#a855f710", border: "1px solid #a855f720", color: "#a855f780" }}
                      >
                        <Clock size={12} /> ERA TIMELINE
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}

              {activePanel === "trophies" && (
                <motion.div
                  key="trophies"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {/* Trophy Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Trophy size={16} className="text-amber-400" />
                      <h3 className="font-display text-xs font-bold tracking-wider text-amber-400">TROPHY CASE</h3>
                    </div>
                    <span className="font-mono text-[10px] text-amber-400">{earnedCount}/{totalCount}</span>
                  </div>

                  {/* Achievement Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {gam.achievements.map((ach) => {
                      const earned = gam.earnedAchievements.includes(ach.achievementId);
                      const tierColor: Record<string, string> = {
                        bronze: "#cd7f32",
                        silver: "#c0c0c0",
                        gold: "#ffd700",
                        platinum: "#e5e4e2",
                        legendary: "#ff6b35",
                      };
                      const color = tierColor[ach.tier] || "#888";
                      return (
                        <div
                          key={ach.achievementId}
                          className="rounded-lg p-2.5 transition-all"
                          style={{
                            background: earned ? color + "10" : theme.panel,
                            border: `1px solid ${earned ? color + "40" : theme.primary + "10"}`,
                            opacity: earned ? 1 : 0.4,
                          }}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-lg">{earned ? ach.icon : "🔒"}</span>
                            <div className="min-w-0">
                              <p className="font-mono text-[10px] font-bold truncate" style={{ color: earned ? color : theme.text + "60" }}>
                                {ach.name}
                              </p>
                              <p className="font-mono text-[8px] opacity-50 line-clamp-2">{ach.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="font-mono text-[7px]" style={{ color }}>{ach.tier.toUpperCase()}</span>
                                <span className="font-mono text-[7px] text-amber-400">+{ach.xpReward} XP</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {activePanel === "themes" && (
                <motion.div
                  key="themes"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Palette size={16} className="text-green-400" />
                    <h3 className="font-display text-xs font-bold tracking-wider text-green-400">ARK THEMES</h3>
                  </div>
                  <p className="font-mono text-[10px] opacity-40 mb-4">
                    Customize your Inception Ark console. Unlock new themes by leveling up.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {gam.themes.map((t) => {
                      const unlocked = gam.level >= t.unlockLevel;
                      const active = gam.currentTheme.id === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => unlocked && gam.setTheme(t.id)}
                          disabled={!unlocked}
                          className="rounded-lg p-3 text-left transition-all hover:scale-105 disabled:hover:scale-100"
                          style={{
                            background: active ? t.colors.primary + "15" : t.colors.panel,
                            border: `2px solid ${active ? t.colors.primary : unlocked ? t.colors.primary + "20" : "#33333340"}`,
                            opacity: unlocked ? 1 : 0.4,
                          }}
                        >
                          {/* Color preview */}
                          <div className="flex gap-1 mb-2">
                            {[t.colors.primary, t.colors.accent, t.colors.glow].map((c, i) => (
                              <div key={i} className="w-4 h-4 rounded-full" style={{ background: c }} />
                            ))}
                          </div>
                          <div className="flex items-center gap-1.5">
                            {unlocked ? <Unlock size={10} style={{ color: t.colors.primary }} /> : <Lock size={10} className="opacity-30" />}
                            <p className="font-mono text-[10px] font-bold" style={{ color: unlocked ? t.colors.primary : "#666" }}>
                              {t.name}
                            </p>
                          </div>
                          <p className="font-mono text-[8px] opacity-40 mt-0.5">{t.description}</p>
                          {!unlocked && (
                            <p className="font-mono text-[8px] text-amber-400/50 mt-1">Unlock at LV.{t.unlockLevel}</p>
                          )}
                          {active && (
                            <p className="font-mono text-[8px] mt-1" style={{ color: t.colors.primary }}>ACTIVE</p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {activePanel === "doom" && <DoomScrollPanel theme={theme} />}
            </AnimatePresence>
          </div>

          {/* RIGHT: Info Panel (hidden when expanded) */}
          {!viewerExpanded && (
            <div className="hidden lg:block space-y-3">
              {/* Now Playing Info */}
              {selectedMedia && (
                <div className="rounded-lg p-3" style={{ background: theme.panel, border: `1px solid ${theme.primary}15` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: theme.primary }} />
                    <span className="font-mono text-[9px] tracking-wider" style={{ color: theme.primary }}>NOW PLAYING</span>
                  </div>
                  {selectedMedia.image && (
                    <img src={selectedMedia.image} alt={selectedMedia.title} className="w-full aspect-square rounded-md object-cover mb-2" />
                  )}
                  <h4 className="font-display text-sm font-bold">{selectedMedia.title}</h4>
                  <p className="font-mono text-[10px] opacity-40">{selectedMedia.subtitle}</p>

                  {/* Episode nav */}
                  <div className="flex items-center justify-between mt-3 pt-2" style={{ borderTop: `1px solid ${theme.primary}15` }}>
                    <button onClick={goPrev} className="flex items-center gap-1 font-mono text-[9px] opacity-50 hover:opacity-100 transition-opacity">
                      <ChevronLeft size={10} /> PREV
                    </button>
                    <span className="font-mono text-[9px] opacity-30">
                      {currentVideoIndex + 1}/{mediaItems.filter((m) => m.type === "video").length}
                    </span>
                    <button onClick={goNext} className="flex items-center gap-1 font-mono text-[9px] opacity-50 hover:opacity-100 transition-opacity">
                      NEXT <ChevronRight size={10} />
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="rounded-lg p-3" style={{ background: theme.panel, border: `1px solid ${theme.primary}10` }}>
                <h4 className="font-mono text-[9px] tracking-wider opacity-40 mb-2">OPERATIVE STATS</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-mono text-[10px] opacity-60">Level</span>
                    <span className="font-mono text-[10px]" style={{ color: theme.primary }}>LV.{gam.level} — {gam.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-[10px] opacity-60">XP</span>
                    <span className="font-mono text-[10px]" style={{ color: theme.accent }}>{gam.xp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-[10px] opacity-60">Fight Points</span>
                    <span className="font-mono text-[10px] text-amber-400">{gam.gameSave.fightPoints}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-[10px] opacity-60">Achievements</span>
                    <span className="font-mono text-[10px] text-green-400">{earnedCount}/{totalCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-[10px] opacity-60">Entries Discovered</span>
                    <span className="font-mono text-[10px]" style={{ color: theme.primary }}>{gam.progress.discoveredEntries.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-[10px] opacity-60">Videos Watched</span>
                    <span className="font-mono text-[10px]" style={{ color: theme.primary }}>{gam.progress.watchedEpisodes.length}</span>
                  </div>
                </div>
              </div>

              {/* Quick Nav */}
              <div className="rounded-lg p-3" style={{ background: theme.panel, border: `1px solid ${theme.primary}10` }}>
                <h4 className="font-mono text-[9px] tracking-wider opacity-40 mb-2">QUICK NAV</h4>
                <div className="space-y-1">
                  {[
                    { href: "/", label: "DASHBOARD", icon: Terminal },
                    { href: "/watch", label: "WATCH THE SHOW", icon: Tv },
                    { href: "/board", label: "CONSPIRACY BOARD", icon: Map },
                    { href: "/character-timeline", label: "TIMELINE", icon: BarChart3 },
                    { href: "/search", label: "SEARCH", icon: Search },
                    { href: "/fight", label: "COMBAT", icon: Gamepad2 },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-2 px-2 py-1.5 rounded font-mono text-[10px] opacity-50 hover:opacity-100 transition-all"
                        style={{ color: theme.text }}
                      >
                        <Icon size={11} /> {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── POP-OUT VIDEO WINDOW ─── */}
      <AnimatePresence>
        {viewerPopped && selectedMedia?.videoUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-4 right-4 z-50 rounded-lg overflow-hidden shadow-2xl"
            style={{
              width: "400px",
              border: `2px solid ${theme.primary}40`,
              boxShadow: `0 0 40px ${theme.primary}20`,
            }}
          >
            <div className="flex items-center justify-between px-2 py-1" style={{ background: theme.secondary }}>
              <span className="font-mono text-[9px]" style={{ color: theme.primary }}>
                {selectedMedia.title}
              </span>
              <button onClick={() => setViewerPopped(false)} className="p-0.5 rounded hover:bg-white/10">
                <X size={12} />
              </button>
            </div>
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeId(selectedMedia.videoUrl)}?rel=0&modestbranding=1`}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
            <div className="flex items-center justify-between px-2 py-1" style={{ background: theme.secondary }}>
              <button onClick={goPrev} className="p-1 rounded hover:bg-white/10"><SkipBack size={12} /></button>
              <span className="font-mono text-[8px] opacity-40">
                {currentVideoIndex + 1}/{mediaItems.filter((m) => m.type === "video").length}
              </span>
              <button onClick={goNext} className="p-1 rounded hover:bg-white/10"><SkipForward size={12} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   DOOM SCROLL PANEL — LLM-powered apocalyptic news feed
   ═══════════════════════════════════════════════════════ */
const SEVERITY_COLORS = ["#22c55e", "#eab308", "#f97316", "#ef4444", "#dc2626"];
const CATEGORY_ICONS: Record<string, typeof Skull> = {
  ai_advance: Zap,
  surveillance: Eye,
  revelation: BookOpen,
  collapse: Skull,
  resistance: Shield,
};
const CATEGORY_COLORS: Record<string, string> = {
  ai_advance: "#06b6d4",
  surveillance: "#f97316",
  revelation: "#a855f7",
  collapse: "#ef4444",
  resistance: "#22c55e",
};
const CATEGORY_LABELS: Record<string, string> = {
  ai_advance: "AI ADVANCEMENT",
  surveillance: "SURVEILLANCE STATE",
  revelation: "BOOK OF REVELATIONS",
  collapse: "SOCIETAL COLLAPSE",
  resistance: "RESISTANCE MOVEMENT",
};

function DoomScrollPanel({ theme }: { theme: any }) {
  const { data: stories, isLoading, error } = trpc.doomScroll.getStories.useQuery({ count: 12 });
  const refreshMutation = trpc.doomScroll.refresh.useMutation();
  const utils = trpc.useUtils();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const filteredStories = useMemo(() => {
    if (!stories) return [];
    if (filter === "all") return stories;
    return stories.filter((s: any) => s.category === filter);
  }, [stories, filter]);

  const handleRefresh = async () => {
    await refreshMutation.mutateAsync({ count: 12 });
    utils.doomScroll.getStories.invalidate();
  };

  return (
    <motion.div
      key="doom"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Newspaper size={16} className="text-orange-400" />
          <h3 className="font-display text-xs font-bold tracking-wider text-orange-400">DOOM SCROLL</h3>
          <span className="font-mono text-[8px] opacity-30">CONFIRMING THE END TIMES</span>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshMutation.isPending}
          className="flex items-center gap-1.5 px-3 py-1 rounded font-mono text-[9px] transition-all hover:scale-105 disabled:opacity-50"
          style={{ background: "#f9731620", color: "#f97316", border: "1px solid #f9731630" }}
        >
          {refreshMutation.isPending ? (
            <><Sparkles size={10} className="animate-spin" /> GENERATING...</>
          ) : (
            <><Sparkles size={10} /> REFRESH FEED</>
          )}
        </button>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <button
          onClick={() => setFilter("all")}
          className="px-2 py-1 rounded font-mono text-[9px] transition-all"
          style={{
            background: filter === "all" ? "#f9731620" : theme.panel,
            color: filter === "all" ? "#f97316" : theme.text + "60",
            border: `1px solid ${filter === "all" ? "#f9731640" : "transparent"}`,
          }}
        >
          ALL
        </button>
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
          const color = CATEGORY_COLORS[key];
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className="px-2 py-1 rounded font-mono text-[9px] transition-all"
              style={{
                background: filter === key ? color + "20" : theme.panel,
                color: filter === key ? color : theme.text + "60",
                border: `1px solid ${filter === key ? color + "40" : "transparent"}`,
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg p-4 animate-pulse" style={{ background: theme.panel }}>
              <div className="h-3 rounded w-3/4 mb-2" style={{ background: theme.secondary }} />
              <div className="h-2 rounded w-full mb-1" style={{ background: theme.secondary }} />
              <div className="h-2 rounded w-2/3" style={{ background: theme.secondary }} />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="rounded-lg p-4 text-center" style={{ background: theme.panel, border: "1px solid #ef444430" }}>
          <Skull size={24} className="mx-auto mb-2 text-red-400" />
          <p className="font-mono text-[10px] text-red-400">TRANSMISSION INTERRUPTED</p>
          <p className="font-mono text-[9px] opacity-40 mt-1">Failed to receive doom feed. Try refreshing.</p>
        </div>
      )}

      {/* Stories */}
      {!isLoading && !error && (
        <div className="space-y-2">
          {filteredStories.map((story: any, idx: number) => {
            const CatIcon = CATEGORY_ICONS[story.category] || Newspaper;
            const catColor = CATEGORY_COLORS[story.category] || "#f97316";
            const sevColor = SEVERITY_COLORS[Math.min(story.severity - 1, 4)];
            const expanded = expandedId === story.id;

            return (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setExpandedId(expanded ? null : story.id)}
                className="rounded-lg p-3 cursor-pointer transition-all hover:scale-[1.01]"
                style={{
                  background: expanded ? catColor + "10" : theme.panel,
                  border: `1px solid ${expanded ? catColor + "30" : theme.primary + "10"}`,
                }}
              >
                {/* Top row: severity + category + source */}
                <div className="flex items-center gap-2 mb-1.5">
                  {/* Severity dots */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: i < story.severity ? sevColor : theme.secondary }}
                      />
                    ))}
                  </div>
                  <CatIcon size={10} style={{ color: catColor }} />
                  <span className="font-mono text-[8px] tracking-wider" style={{ color: catColor }}>
                    {CATEGORY_LABELS[story.category] || story.category.toUpperCase()}
                  </span>
                  <span className="font-mono text-[8px] opacity-20 ml-auto">{story.source}</span>
                </div>

                {/* Headline */}
                <h4 className="font-display text-xs font-bold leading-tight mb-1" style={{ color: expanded ? catColor : theme.text }}>
                  {story.headline}
                </h4>

                {/* Summary (always visible) */}
                <p className="font-mono text-[10px] opacity-50 leading-relaxed">
                  {story.summary}
                </p>

                {/* Expanded: Saga connection */}
                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 pt-2" style={{ borderTop: `1px dashed ${catColor}30` }}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <Crosshair size={9} style={{ color: theme.primary }} />
                          <span className="font-mono text-[8px] tracking-wider" style={{ color: theme.primary }}>SAGA CONNECTION</span>
                        </div>
                        <p className="font-mono text-[10px] leading-relaxed" style={{ color: theme.primary + "cc" }}>
                          {story.sagaConnection}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Timestamp */}
                <p className="font-mono text-[8px] opacity-20 mt-1.5">
                  {new Date(story.timestamp).toLocaleString()}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Auto-refresh timer */}
      {!isLoading && stories && stories.length > 0 && (
        <div className="mt-4 pt-3 text-center" style={{ borderTop: `1px solid ${theme.primary}10` }}>
          <p className="font-mono text-[8px] opacity-20">
            Feed auto-refreshes every 5 minutes. Click REFRESH FEED for new transmissions.
          </p>
        </div>
      )}
    </motion.div>
  );
}
