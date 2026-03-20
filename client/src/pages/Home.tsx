/* ═══════════════════════════════════════════════════════
   HOME — THE FEED
   A classified intelligence feed that feels like you've
   discovered an illegal tap into the true history of
   the universe, designed by the Illuminati.
   Mobile-first. Scroll-driven. Addictive.
   ═══════════════════════════════════════════════════════ */
import { useLoredex, type LoredexEntry } from "@/contexts/LoredexContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { useGamification } from "@/contexts/GamificationContext";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, Play, ChevronRight, Lock, Radio, Wifi, WifiOff,
  AlertTriangle, Fingerprint, ScanLine, Zap, Shield,
  Skull, Crown, MapPin, Music, Users, Swords, Gamepad2,
  Search, Clock, Tv, Terminal, Map, Crosshair, Volume2
} from "lucide-react";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useGame, ROOM_DEFINITIONS } from "@/contexts/GameContext";
import { Rocket } from "lucide-react";

/* ─── BOOT SEQUENCE ─── */
function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [phase, setPhase] = useState<"boot" | "scan" | "access">("boot");

  useEffect(() => {
    const bootLines = [
      "INTERCEPTING SIGNAL...",
      "BYPASSING ENCRYPTION LAYER 7...",
      "DECODING TRANSMISSION...",
      "SOURCE: ████████ NETWORK",
      "CLEARANCE: UNAUTHORIZED",
      "",
      "WARNING: YOU ARE ACCESSING",
      "A RESTRICTED FEED",
      "",
      "PROCEED? [Y]",
    ];
    let idx = 0;
    let done = false;
    const interval = setInterval(() => {
      if (done) return;
      if (idx < bootLines.length) {
        const line = bootLines[idx]!;
        idx++;
        setLines((prev) => [...prev, line]);
      } else {
        done = true;
        clearInterval(interval);
        setPhase("scan");
        setTimeout(() => {
          setPhase("access");
          setTimeout(onComplete, 600);
        }, 800);
      }
    }, 120);
    return () => { done = true; clearInterval(interval); };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
      <div className="w-full max-w-sm px-6">
        {/* Eye symbol */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <Eye size={40} className="text-primary" style={{ filter: "drop-shadow(0 0 20px oklch(0.82 0.16 195 / 0.6))" }} />
            {phase === "scan" && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                <div className="w-12 h-12 rounded-full border border-primary/40" />
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Terminal lines */}
        <div className="font-mono text-xs space-y-1">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className={
                !line ? "h-2" :
                line.includes("WARNING") ? "text-destructive font-bold" :
                line.includes("PROCEED") ? "text-primary font-bold" :
                line.includes("████") ? "text-accent" :
                line === "" ? "h-2" :
                "text-muted-foreground"
              }
            >
              {line}
            </motion.div>
          ))}
          {phase === "boot" && (
            <span className="inline-block w-2 h-4 bg-primary animate-typing-cursor" />
          )}
        </div>

        {/* Access granted flash */}
        <AnimatePresence>
          {phase === "access" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6 text-center"
            >
              <div className="font-display text-lg font-black tracking-[0.3em] text-primary glow-cyan">
                ACCESS GRANTED
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── SIGNAL HEADER ─── */
function SignalHeader({ stats }: { stats: Record<string, number> }) {
  const [signalStrength, setSignalStrength] = useState(87);
  const [timestamp, setTimestamp] = useState("");

  useEffect(() => {
    const update = () => {
      setSignalStrength(75 + Math.floor(Math.random() * 25));
      const now = new Date();
      setTimestamp(
        now.toISOString().replace("T", " // ").substring(0, 22) + " UTC"
      );
    };
    update();
    const interval = setInterval(update, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sticky top-0 z-30 bg-[oklch(0.06_0.01_280/0.97)] backdrop-blur-xl border-b border-primary/10">
      <div className="px-4 py-2.5">
        {/* Signal bar */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Radio size={12} className="text-primary animate-pulse-glow" />
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-green-500" />
            </div>
            <span className="font-mono text-[9px] text-primary/70 tracking-wider">
              LIVE FEED
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[8px] text-muted-foreground">
              {timestamp}
            </span>
            <div className="flex items-center gap-1">
              <Wifi size={10} className={signalStrength > 80 ? "text-green-500" : "text-accent"} />
              <span className="font-mono text-[8px] text-muted-foreground">{signalStrength}%</span>
            </div>
          </div>
        </div>

        {/* Scrolling ticker */}
        <div className="overflow-hidden h-4 relative">
          <motion.div
            className="absolute whitespace-nowrap font-mono text-[9px] text-muted-foreground"
            animate={{ x: [0, -1200] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            ▸ {stats.total_entries} ENTITIES CATALOGUED ▸ {stats.relationships} CONNECTIONS MAPPED ▸ {stats.songs} TRANSMISSIONS DECODED ▸ {stats.characters} OPERATIVES IDENTIFIED ▸ {stats.locations} SITES GEOTAGGED ▸ {stats.factions} ORGANIZATIONS TRACKED ▸ SIGNAL ORIGIN: UNKNOWN ▸ ENCRYPTION: BROKEN ▸ CLASSIFICATION: ABOVE TOP SECRET ▸
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ─── FEED CARD: CLASSIFIED DOSSIER ─── */
function DossierCard({ entry, index, onDiscover }: { entry: LoredexEntry; index: number; onDiscover: (id: string) => void }) {
  const typeLabel = entry.type === "character" ? "SUBJECT DOSSIER" :
    entry.type === "location" ? "SITE REPORT" :
    entry.type === "faction" ? "ORG INTEL" :
    entry.type === "song" ? "INTERCEPTED TRANSMISSION" : "CLASSIFIED";

  const typeIcon = entry.type === "character" ? <Fingerprint size={10} /> :
    entry.type === "location" ? <MapPin size={10} /> :
    entry.type === "faction" ? <Shield size={10} /> :
    entry.type === "song" ? <Radio size={10} /> : <Lock size={10} />;

  const typeColor = entry.type === "character" ? "text-primary border-primary/30 bg-primary/8" :
    entry.type === "location" ? "text-accent border-accent/30 bg-accent/8" :
    entry.type === "faction" ? "text-chart-4 border-chart-4/30 bg-chart-4/8" :
    entry.type === "song" ? "text-destructive border-destructive/30 bg-destructive/8" : "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.2) }}
    >
      <Link
        href={entry.type === "song" ? `/song/${entry.id}` : `/entity/${entry.id}`}
        onClick={() => onDiscover(entry.id)}
        className="block group"
      >
        <div className="relative border border-border/30 rounded-lg bg-card/60 overflow-hidden hover:border-primary/40 transition-all duration-300">
          {/* Top classification bar */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-muted/60 border-b border-border/20">
            <div className={`flex items-center gap-1.5 text-[9px] font-mono tracking-wider ${typeColor} px-1.5 py-0.5 rounded border`}>
              {typeIcon}
              {typeLabel}
            </div>
            <span className="font-mono text-[8px] text-muted-foreground/60">
              #{String(index + 1).padStart(4, "0")}
            </span>
          </div>

          <div className="flex gap-3 p-3">
            {/* Thumbnail */}
            {entry.image && (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden flex-shrink-0 relative">
                <img
                  src={entry.image}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                {/* Scan line effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute inset-0 bg-primary/5" />
                  <div className="absolute left-0 right-0 h-px bg-primary/40 animate-scan-line" />
                </div>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-mono text-sm font-bold text-white group-hover:text-primary transition-colors truncate" style={{ textShadow: "0 0 6px rgba(255,255,255,0.1)" }}>
                {entry.name}
              </h3>

              {entry.era && (
                <div className="font-mono text-[9px] text-muted-foreground/70 mt-0.5">
                  ERA: {entry.era}
                </div>
              )}
              {entry.affiliation && (
                <div className="font-mono text-[9px] text-accent/60 mt-0.5">
                  {entry.affiliation}
                </div>
              )}
              {entry.album && (
                <div className="font-mono text-[9px] text-destructive/80 mt-0.5">
                  {entry.album} {entry.track_number ? `// TRACK ${entry.track_number}` : ""}
                </div>
              )}

              {/* Redacted bio preview */}
              {entry.bio && (
                <p className="font-mono text-[10px] text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                  {entry.bio.substring(0, 100)}{entry.bio.length > 100 ? "..." : ""}
                </p>
              )}
            </div>

            {/* Arrow */}
            <div className="flex items-center self-center">
              <ChevronRight size={14} className="text-muted-foreground/40 group-hover:text-primary/70 transition-colors" />
            </div>
          </div>

          {/* Bottom metadata */}
          {(entry.connections?.length || entry.song_appearances?.length) && (
            <div className="px-3 pb-2 flex gap-3">
              {entry.connections && entry.connections.length > 0 && (
                <span className="font-mono text-[8px] text-muted-foreground/60">
                  {entry.connections.length} LINKS
                </span>
              )}
              {entry.song_appearances && entry.song_appearances.length > 0 && (
                <span className="font-mono text-[8px] text-muted-foreground/60">
                  {entry.song_appearances.length} TRACKS
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── FEED CARD: ALBUM / TRANSMISSION BUNDLE ─── */
function AlbumCard({ album, tracks, index }: { album: { slug: string; name: string; year: string; tracks: number }; tracks: LoredexEntry[]; index: number }) {
  const { playSong, setQueue } = usePlayer();
  const firstTrack = tracks[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: 0.05 * index }}
    >
      <Link href={`/album/${album.slug}`} className="block group">
        <div className="relative border border-border/30 rounded-lg bg-card/60 overflow-hidden hover:border-accent/40 transition-all">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-muted/60 border-b border-border/20">
            <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-wider text-accent border-accent/30 bg-accent/8 px-1.5 py-0.5 rounded border">
              <Volume2 size={10} />
              DECODED TRANSMISSIONS
            </div>
            <span className="font-mono text-[8px] text-muted-foreground/60">{album.year}</span>
          </div>

          <div className="flex gap-3 p-3">
            {/* Album art */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden flex-shrink-0 relative">
              {firstTrack?.image ? (
                <img src={firstTrack.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
              ) : (
                <div className="w-full h-full bg-secondary flex items-center justify-center">
                  <Music size={24} className="text-muted-foreground/30" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center backdrop-blur-sm">
                  <Play size={16} className="text-accent ml-0.5" />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-mono text-sm font-bold text-white group-hover:text-accent transition-colors">
                {album.name}
              </h3>
              <div className="font-mono text-[9px] text-muted-foreground mt-1">
                {album.tracks} TRACKS INTERCEPTED
              </div>
              {/* Mini track list */}
              <div className="mt-2 space-y-0.5">
                {tracks.slice(0, 3).map((t, i) => (
                  <div key={t.id} className="font-mono text-[9px] text-muted-foreground/80 truncate">
                    {String(i + 1).padStart(2, "0")}. {t.name}
                  </div>
                ))}
                {tracks.length > 3 && (
                  <div className="font-mono text-[9px] text-muted-foreground/70">
                    +{tracks.length - 3} more...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── QUICK ACTION PILL ─── */
function ActionPill({ href, icon, label, color }: { href: string; icon: React.ReactNode; label: string; color: string }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-3.5 py-2 rounded-full border ${color} text-xs font-mono tracking-wider whitespace-nowrap transition-all hover:scale-[1.02] active:scale-[0.98]`}
    >
      {icon}
      {label}
    </Link>
  );
}

/* ─── SECTION DIVIDER ─── */
function SectionDivider({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 py-4">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/50 to-transparent" />
      <div className="flex items-center gap-1.5 font-mono text-[9px] text-muted-foreground/70 tracking-[0.25em]">
        {icon}
        {label}
      </div>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/50 to-transparent" />
    </div>
  );
}

/* ─── MUSIC VIDEO CARD ─── */
function VideoCard({ song, index }: { song: LoredexEntry; index: number }) {
  const videoUrl = song.music_video?.official || song.music_video?.vevo || "";
  return (
    <motion.a
      href={videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="flex-shrink-0 w-36 sm:w-44 group"
    >
      <div className="relative aspect-square rounded-lg overflow-hidden border border-border/20 hover:border-destructive/30 transition-all">
        {song.image && (
          <img src={song.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-destructive/20 border border-destructive/40 flex items-center justify-center">
            <Play size={16} className="text-destructive ml-0.5" />
          </div>
        </div>
        <div className="absolute bottom-2 left-2 right-2">
          <div className="font-mono text-[10px] font-bold text-white truncate">{song.name}</div>
          <div className="font-mono text-[8px] text-muted-foreground">{song.album}</div>
        </div>
      </div>
    </motion.a>
  );
}

/* ─── CONEXUS GAME CARD ─── */
function ConexusCard({ game, getEntry }: { game: { title: string; image: string; characters: string[] }; getEntry: (name: string) => LoredexEntry | undefined }) {
  return (
    <div className="border border-border/20 rounded-lg bg-card/30 overflow-hidden group">
      <div className="flex">
        <div className="w-24 sm:w-28 flex-shrink-0 overflow-hidden">
          <img src={game.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        </div>
        <div className="flex-1 p-3 min-w-0">
          <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-wider text-chart-5 mb-1">
            <Gamepad2 size={10} />
            INTERACTIVE STORY
          </div>
          <h3 className="font-mono text-xs font-bold text-foreground truncate">{game.title}</h3>
          <div className="flex flex-wrap gap-1 mt-2">
            {game.characters.map((char) => {
              const e = getEntry(char);
              return (
                <Link
                  key={char}
                  href={e ? `/entity/${e.id}` : "#"}
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-secondary/60 border border-border/30 text-[8px] font-mono text-muted-foreground/80 hover:text-primary hover:border-primary/30 transition-colors"
                >
                  {e?.image && <img src={e.image} alt="" className="w-3 h-3 rounded-full object-cover" />}
                  {char}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── ARK EXPLORATION CTA ─── */
function ArkExplorationCard() {
  const { state } = useGame();
  const totalRooms = ROOM_DEFINITIONS.length;
  const unlockedCount = state.totalRoomsUnlocked;
  const progress = Math.round((unlockedCount / totalRooms) * 100);

  return (
    <div className="px-4 mb-3">
      <Link href="/ark">
        <div
          className="relative overflow-hidden rounded-lg border border-primary/20 bg-gradient-to-r from-primary/5 via-card/80 to-accent/5 p-3 group hover:border-primary/40 transition-all cursor-pointer"
        >
          {/* Subtle grid overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(51,226,230,0.2) 2px, rgba(51,226,230,0.2) 4px)",
          }} />
          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
              <Rocket size={18} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-mono text-[11px] font-bold text-foreground tracking-wider">EXPLORE THE INCEPTION ARK</h3>
                <ChevronRight size={14} className="text-primary/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${progress}%`, background: "linear-gradient(90deg, oklch(0.82 0.16 195), oklch(0.78 0.16 85))" }}
                  />
                </div>
                <span className="font-mono text-[8px] text-muted-foreground">{unlockedCount}/{totalRooms} rooms</span>
              </div>
              <p className="font-mono text-[8px] text-muted-foreground/60 mt-0.5">
                {unlockedCount === 0
                  ? "Begin your journey through the ship..."
                  : unlockedCount < totalRooms
                  ? `${state.totalItemsFound} items found • ${totalRooms - unlockedCount} rooms remaining`
                  : "All rooms explored! ✦"}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN HOME COMPONENT — THE FEED
   ═══════════════════════════════════════════════════════ */
export default function Home() {
  const { entries, stats, getEntry, getByAlbum, discoveryProgress, discoverEntry } = useLoredex();
  const gam = useGamification();
  const [booted, setBooted] = useState(() => {
    return sessionStorage.getItem("loredex_booted") === "true";
  });
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const handleBootComplete = useCallback(() => {
    setBooted(true);
    sessionStorage.setItem("loredex_booted", "true");
  }, []);

  // Build the feed — mix of characters, locations, factions
  const feedEntries = useMemo(() => {
    let filtered = entries.filter(e => e.type !== "song" && e.type !== "concept");
    if (activeFilter !== "all") {
      filtered = filtered.filter(e => e.type === activeFilter);
    }
    // Sort: prioritize entries with images, then by priority
    return filtered
      .sort((a, b) => {
        const aPri = a.priority === "high" ? 3 : a.priority === "medium" ? 2 : 1;
        const bPri = b.priority === "high" ? 3 : b.priority === "medium" ? 2 : 1;
        if (aPri !== bPri) return bPri - aPri;
        if (a.image && !b.image) return -1;
        if (!a.image && b.image) return 1;
        return 0;
      })
      .slice(0, 40);
  }, [entries, activeFilter]);

  const albums = useMemo(() => [
    { slug: "dischordian-logic", name: "Dischordian Logic", year: "2025", tracks: 29 },
    { slug: "age-of-privacy", name: "The Age of Privacy", year: "2025", tracks: 20 },
    { slug: "book-of-daniel", name: "The Book of Daniel 2:47", year: "2025", tracks: 22 },
    { slug: "silence-in-heaven", name: "Silence in Heaven", year: "2026", tracks: 18 },
  ], []);

  const songsWithVideos = useMemo(() =>
    entries.filter(e => e.type === "song" && e.music_video && typeof e.music_video === "object" && (e.music_video.official || e.music_video.vevo)),
    [entries]
  );

  const conexusGames = useMemo(() => [
    {
      title: "The Necromancer's Lair",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/necromancers_lair_poster_24fdec70.png",
      characters: ["The Necromancer", "Akai Shi", "The Collector"],
    },
    {
      title: "Awaken the Clone",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/awaken_the_clone_poster_6fcfb664.png",
      characters: ["The Clone", "The Oracle", "The Hierophant"],
    },
  ], []);

  // Show boot sequence once per session
  if (!booted) {
    return <BootSequence onComplete={handleBootComplete} />;
  }

  return (
    <div className="animate-fade-in pb-4">
      {/* Signal header */}
      <SignalHeader stats={stats} />

      {/* ═══ QUICK ACTIONS — Horizontal scroll pills ═══ */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <ActionPill href="/games" icon={<Gamepad2 size={12} />} label="GAMES" color="border-primary/30 bg-primary/5 text-primary hover:bg-primary/10" />
          <ActionPill href="/board" icon={<Map size={12} />} label="BOARD" color="border-border/30 bg-secondary/50 text-foreground hover:bg-secondary" />
          <ActionPill href="/search" icon={<Search size={12} />} label="SEARCH" color="border-border/30 bg-secondary/50 text-foreground hover:bg-secondary" />
          <ActionPill href="/watch" icon={<Tv size={12} />} label="WATCH" color="border-chart-4/30 bg-chart-4/5 text-chart-4 hover:bg-chart-4/10" />
          <ActionPill href="/timeline" icon={<Clock size={12} />} label="TIMELINE" color="border-accent/30 bg-accent/5 text-accent hover:bg-accent/10" />
          <ActionPill href="/console" icon={<Crosshair size={12} />} label="CONSOLE" color="border-chart-5/30 bg-chart-5/5 text-chart-5 hover:bg-chart-5/10" />
        </div>
      </div>

      {/* ═══ ARK EXPLORATION CTA ═══ */}
      <ArkExplorationCard />

      {/* ═══ CLEARANCE STATUS ═══ */}
      <div className="px-4 mb-4">
        <div className="border border-border/25 rounded-lg bg-card/50 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Eye size={12} className="text-primary" />
              <span className="font-mono text-[9px] text-primary/70 tracking-wider">CLEARANCE STATUS</span>
            </div>
            <span className="font-display text-xs font-bold text-primary">
              LV.{gam.level}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, oklch(0.82 0.16 195), oklch(0.78 0.16 85))" }}
                initial={{ width: 0 }}
                animate={{ width: `${gam.xpProgress}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
            <span className="font-mono text-[8px] text-muted-foreground/70">{Math.floor(gam.xpProgress)}%</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="font-mono text-[8px] text-muted-foreground/60">{gam.title}</span>
            <span className="font-mono text-[8px] text-accent/80">{gam.points} PTS</span>
          </div>
        </div>
      </div>

      {/* ═══ FILTER TABS ═══ */}
      <div className="px-4 mb-3">
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {[
            { key: "all", label: "ALL INTEL", icon: <Eye size={10} /> },
            { key: "character", label: "SUBJECTS", icon: <Users size={10} /> },
            { key: "location", label: "SITES", icon: <MapPin size={10} /> },
            { key: "faction", label: "ORGS", icon: <Swords size={10} /> },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-[9px] tracking-wider whitespace-nowrap transition-all ${
                activeFilter === tab.key
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-muted-foreground/50 border border-transparent hover:text-muted-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ THE FEED ═══ */}
      <div className="px-4 space-y-2.5">
        {/* First batch of dossiers */}
        {feedEntries.slice(0, 6).map((entry, i) => (
          <DossierCard key={entry.id} entry={entry} index={i} onDiscover={discoverEntry} />
        ))}

        {/* ═══ INTERCEPTED TRANSMISSIONS (Albums) ═══ */}
        {activeFilter === "all" && (
          <>
            <SectionDivider label="INTERCEPTED TRANSMISSIONS" icon={<Radio size={10} />} />
            <div className="space-y-2.5">
              {albums.slice(0, 2).map((album, i) => (
                <AlbumCard key={album.slug} album={album} tracks={getByAlbum(album.name)} index={i} />
              ))}
            </div>
          </>
        )}

        {/* More dossiers */}
        {feedEntries.slice(6, 14).map((entry, i) => (
          <DossierCard key={entry.id} entry={entry} index={i + 6} onDiscover={discoverEntry} />
        ))}

        {/* ═══ VISUAL INTEL (Music Videos) ═══ */}
        {activeFilter === "all" && songsWithVideos.length > 0 && (
          <>
            <SectionDivider label="VISUAL INTEL" icon={<Zap size={10} />} />
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
              {songsWithVideos.slice(0, 8).map((song, i) => (
                <VideoCard key={song.id} song={song} index={i} />
              ))}
            </div>
          </>
        )}

        {/* More dossiers */}
        {feedEntries.slice(14, 22).map((entry, i) => (
          <DossierCard key={entry.id} entry={entry} index={i + 14} onDiscover={discoverEntry} />
        ))}

        {/* ═══ REMAINING ALBUMS ═══ */}
        {activeFilter === "all" && (
          <>
            <SectionDivider label="MORE TRANSMISSIONS" icon={<Volume2 size={10} />} />
            <div className="space-y-2.5">
              {albums.slice(2).map((album, i) => (
                <AlbumCard key={album.slug} album={album} tracks={getByAlbum(album.name)} index={i + 2} />
              ))}
            </div>
          </>
        )}

        {/* More dossiers */}
        {feedEntries.slice(22).map((entry, i) => (
          <DossierCard key={entry.id} entry={entry} index={i + 22} onDiscover={discoverEntry} />
        ))}

        {/* ═══ CONEXUS STORIES ═══ */}
        {activeFilter === "all" && (
          <>
            <SectionDivider label="INTERACTIVE OPS" icon={<Gamepad2 size={10} />} />
            <div className="space-y-2.5">
              {conexusGames.map(game => (
                <ConexusCard key={game.title} game={game} getEntry={getEntry} />
              ))}
            </div>
          </>
        )}

        {/* ═══ END OF FEED ═══ */}
        <div className="py-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/30 bg-card/50">
            <WifiOff size={12} className="text-muted-foreground/50" />
            <span className="font-mono text-[9px] text-muted-foreground tracking-wider">
              END OF TRANSMISSION
            </span>
          </div>
          <div className="font-mono text-[8px] text-muted-foreground/60 mt-3 tracking-wider">
            THE PANOPTICON IS WATCHING
          </div>
        </div>
      </div>
    </div>
  );
}
