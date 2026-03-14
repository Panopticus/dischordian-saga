import { useLoredex } from "@/contexts/LoredexContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal, Map, Music, Users, MapPin, Swords, Clock,
  ChevronRight, Play, Eye, Disc3, Zap, Shield, Gamepad2
} from "lucide-react";
import { useEffect, useState } from "react";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/hero_bg_63073f61.png";

const FEATURED_CHARACTERS = [
  "The Architect", "The Enigma", "The Collector", "The Oracle",
  "The Warlord", "The Human", "Iron Lion", "The Necromancer",
  "The Source", "The Meme", "Agent Zero", "The Programmer"
];

const CONEXUS_GAMES = [
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
];

export default function Home() {
  const { entries, stats, getEntry, getByAlbum, discoveryProgress, discoverEntry } = useLoredex();
  const { playSong, setQueue } = usePlayer();
  const [bootComplete, setBootComplete] = useState(false);
  const [bootLines, setBootLines] = useState<string[]>([]);

  useEffect(() => {
    const lines = [
      "> LOREDEX OS v4.7.2 // CLASSIFIED",
      "> Initializing neural interface...",
      `> Loading ${stats.total_entries || 0} database entries...`,
      `> Mapping ${stats.relationships || 0} connections...`,
      "> Decrypting archived transmissions...",
      "> Scanning 4 albums // 89 tracks...",
      "> ACCESS GRANTED // CLEARANCE: LEVEL 1",
      "> Welcome, Operative.",
    ];
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < lines.length) {
        const line = lines[idx];
        setBootLines((prev) => [...prev, line]);
        idx++;
      } else {
        clearInterval(interval);
        setTimeout(() => setBootComplete(true), 400);
      }
    }, 160);
    return () => clearInterval(interval);
  }, []);

  const featured = FEATURED_CHARACTERS.map((name) => getEntry(name)).filter(Boolean);
  const albums = [
    { slug: "dischordian-logic", name: "Dischordian Logic", year: "2025", tracks: 29 },
    { slug: "age-of-privacy", name: "The Age of Privacy", year: "2025", tracks: 20 },
    { slug: "book-of-daniel", name: "The Book of Daniel 2:47", year: "2025", tracks: 22 },
    { slug: "silence-in-heaven", name: "Silence in Heaven", year: "2026", tracks: 18 },
  ];
  const validFeatured = featured.filter((e): e is NonNullable<typeof e> => e != null);
  const songsWithVideos = entries.filter(
    (e) => e.type === "song" && e.music_video && typeof e.music_video === "object" && (e.music_video.official || e.music_video.vevo)
  );

  if (!bootComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 grid-bg">
        <div className="max-w-xl w-full">
          <div className="border border-primary/30 rounded-lg bg-card/80 p-6 sm:p-8 box-glow-cyan crt-scanlines relative">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              <span className="font-display text-xs text-primary tracking-[0.3em]">SYSTEM BOOT</span>
            </div>
            <div className="space-y-2 font-mono text-sm">
              {bootLines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`${
                    line.includes("ACCESS GRANTED")
                      ? "text-accent glow-amber font-bold"
                      : line.includes("Welcome")
                      ? "text-primary glow-cyan font-bold"
                      : "text-muted-foreground"
                  }`}
                >
                  {line}
                </motion.div>
              ))}
              <span className="inline-block w-2.5 h-5 bg-primary animate-typing-cursor ml-1" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
          <div className="absolute inset-0 grid-bg opacity-40" />
        </div>
        <div className="relative px-4 sm:px-6 pt-10 pb-14 sm:pt-14 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 max-w-12 bg-gradient-to-r from-transparent to-primary/50" />
              <span className="font-mono text-[10px] text-primary/70 tracking-[0.4em]">CLASSIFIED // LEVEL 1 ACCESS</span>
              <div className="h-px flex-1 max-w-12 bg-gradient-to-l from-transparent to-primary/50" />
            </div>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-wider text-foreground mb-3 leading-tight">
              THE <span className="text-primary glow-cyan">DISCHORDIAN</span> SAGA
            </h1>
            <p className="font-mono text-sm sm:text-base text-muted-foreground max-w-2xl mb-8 leading-relaxed">
              A classified archive of <span className="text-primary">{stats.total_entries}</span> entities,{" "}
              <span className="text-accent">{stats.songs}</span> songs, and{" "}
              <span className="text-destructive">{stats.relationships}</span> connections spanning the complete mythology of{" "}
              <span className="text-foreground font-medium">Malkia Ukweli & the Panopticon</span>.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/board"
                className="group flex items-center gap-2.5 px-5 py-2.5 rounded-md bg-primary/10 border border-primary/40 text-primary text-sm font-mono hover:bg-primary/20 hover:box-glow-cyan transition-all"
              >
                <Map size={16} />
                CONSPIRACY BOARD
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -ml-1 transition-all" />
              </Link>
              <Link
                href="/search"
                className="group flex items-center gap-2.5 px-5 py-2.5 rounded-md bg-secondary border border-border/50 text-foreground text-sm font-mono hover:bg-secondary/80 hover:border-primary/30 transition-all"
              >
                <Terminal size={16} />
                SEARCH DATABASE
              </Link>
              <Link
                href="/timeline"
                className="group flex items-center gap-2.5 px-5 py-2.5 rounded-md bg-secondary border border-border/50 text-foreground text-sm font-mono hover:bg-secondary/80 hover:border-accent/30 transition-all"
              >
                <Clock size={16} />
                TIMELINE
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="px-4 sm:px-6 space-y-10 pb-12">
        {/* ═══ QUICK STATS ═══ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {[
            { label: "CHARACTERS", value: stats.characters, icon: Users, color: "text-primary", border: "border-primary/20", bg: "bg-primary/5" },
            { label: "LOCATIONS", value: stats.locations, icon: MapPin, color: "text-accent", border: "border-accent/20", bg: "bg-accent/5" },
            { label: "SONGS", value: stats.songs, icon: Music, color: "text-destructive", border: "border-destructive/20", bg: "bg-destructive/5" },
            { label: "FACTIONS", value: stats.factions, icon: Swords, color: "text-chart-4", border: "border-chart-4/20", bg: "bg-chart-4/5" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`rounded-lg border ${stat.border} ${stat.bg} p-4 flex items-center gap-3 hover-lift`}
              >
                <div className={`p-2 rounded-md ${stat.bg}`}>
                  <Icon size={18} className={stat.color} />
                </div>
                <div>
                  <p className="font-display text-xl font-bold tracking-wide">{stat.value}</p>
                  <p className="font-mono text-[10px] text-muted-foreground tracking-[0.15em]">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </motion.section>

        {/* ═══ KEY OPERATIVES ═══ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-sm font-bold tracking-[0.2em] text-foreground flex items-center gap-2.5">
              <Eye size={15} className="text-primary" />
              KEY OPERATIVES
            </h2>
            <Link
              href="/search?type=character"
              className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
            >
              VIEW ALL <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {validFeatured.slice(0, 12).map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <Link
                  href={`/entity/${entry.id}`}
                  onClick={() => discoverEntry(entry.id)}
                  className="group block rounded-lg border border-border/30 bg-card/40 overflow-hidden dossier-card hover-lift"
                >
                  <div className="aspect-square overflow-hidden relative">
                    {entry.image ? (
                      <img
                        src={entry.image}
                        alt={entry.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-secondary flex items-center justify-center">
                        <Users size={24} className="text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="font-mono text-[9px] text-primary/80 tracking-wider">VIEW DOSSIER →</span>
                    </div>
                  </div>
                  <div className="p-2.5">
                    <p className="font-mono text-xs font-semibold truncate group-hover:text-primary transition-colors">{entry.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground/60 truncate">{entry.era || entry.affiliation || ""}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ═══ DISCOGRAPHY ═══ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-sm font-bold tracking-[0.2em] text-foreground flex items-center gap-2.5">
              <Disc3 size={15} className="text-accent" />
              DISCOGRAPHY
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {albums.map((album, i) => {
              const tracks = getByAlbum(album.name);
              const firstTrack = tracks[0];
              return (
                <motion.div
                  key={album.slug}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <Link
                    href={`/album/${album.slug}`}
                    className="group block rounded-lg border border-border/30 bg-card/30 overflow-hidden hover:border-accent/40 hover-lift"
                  >
                    <div className="aspect-square overflow-hidden relative">
                      {firstTrack?.image ? (
                        <img
                          src={firstTrack.image}
                          alt={album.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-secondary flex items-center justify-center">
                          <Disc3 size={32} className="text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="font-display text-sm font-bold text-white tracking-wide">{album.name}</p>
                        <p className="font-mono text-[10px] text-white/50">{album.tracks} tracks // {album.year}</p>
                      </div>
                      {/* Play overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center backdrop-blur-sm">
                          <Play size={20} className="text-accent ml-0.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ═══ MUSIC VIDEOS ═══ */}
        {songsWithVideos.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-sm font-bold tracking-[0.2em] text-foreground flex items-center gap-2.5">
                <Zap size={15} className="text-destructive" />
                OFFICIAL MUSIC VIDEOS
              </h2>
              <span className="font-mono text-[10px] text-muted-foreground">{songsWithVideos.length} VIDEOS</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {songsWithVideos.slice(0, 9).map((song, i) => {
                const videoUrl = song.music_video?.official || song.music_video?.vevo || "";
                return (
                  <motion.a
                    key={song.id}
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="group flex items-center gap-3 rounded-lg border border-border/30 bg-card/30 p-3 hover:border-destructive/30 hover-lift transition-all"
                  >
                    {song.image && (
                      <img
                        src={song.image}
                        alt={song.name}
                        className="w-14 h-14 rounded-md object-cover ring-1 ring-border/20"
                        loading="lazy"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate group-hover:text-destructive transition-colors">{song.name}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">{song.album}</p>
                    </div>
                    <div className="shrink-0 p-2 rounded-full bg-destructive/10 text-destructive group-hover:bg-destructive/20 group-hover:scale-110 transition-all">
                      <Play size={14} />
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* ═══ CONEXUS GAMES ═══ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-sm font-bold tracking-[0.2em] text-foreground flex items-center gap-2.5">
              <Gamepad2 size={15} className="text-chart-5" />
              CONEXUS INTERACTIVE STORIES
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CONEXUS_GAMES.map((game) => (
              <div
                key={game.title}
                className="rounded-lg border border-border/30 bg-card/30 overflow-hidden hover-lift group"
              >
                <div className="flex">
                  <div className="w-28 sm:w-36 shrink-0 overflow-hidden">
                    <img
                      src={game.image}
                      alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4 flex-1 min-w-0">
                    <p className="font-display text-sm font-bold tracking-wide mb-1">{game.title}</p>
                    <p className="font-mono text-[10px] text-muted-foreground mb-3">INTERACTIVE STORY // CONEXUS</p>
                    <div className="flex flex-wrap gap-1.5">
                      {game.characters.map((char) => {
                        const charEntry = getEntry(char);
                        return (
                          <Link
                            key={char}
                            href={charEntry ? `/entity/${charEntry.id}` : "#"}
                            className="flex items-center gap-1.5 px-2 py-1 rounded bg-secondary/50 border border-border/30 text-[10px] font-mono text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
                          >
                            {charEntry?.image && (
                              <img src={charEntry.image} alt={char} className="w-4 h-4 rounded-full object-cover" />
                            )}
                            {char}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ═══ DISCOVERY PROGRESS ═══ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="rounded-lg border border-border/30 bg-card/30 p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-sm font-bold tracking-[0.2em] text-foreground flex items-center gap-2.5">
              <Shield size={15} className="text-primary" />
              CLEARANCE PROGRESS
            </h2>
            <span className="font-mono text-sm text-primary glow-cyan">{Math.floor(discoveryProgress)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-secondary overflow-hidden mb-2">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, oklch(0.82 0.16 195), oklch(0.78 0.16 85))" }}
              initial={{ width: 0 }}
              animate={{ width: `${discoveryProgress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <p className="font-mono text-[10px] text-muted-foreground">
            Explore entities to increase your clearance level. Visit dossiers, play songs, and uncover connections.
          </p>
        </motion.section>
      </div>
    </div>
  );
}
