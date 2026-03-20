/* ═══════════════════════════════════════════════════════
   DISCOGRAPHY — Full album browser with track listings,
   album art, streaming links, and in-app playback.
   ═══════════════════════════════════════════════════════ */
import { useLoredex, type LoredexEntry } from "@/contexts/LoredexContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { Link } from "wouter";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, Disc3, ExternalLink, ChevronDown, ChevronUp,
  Music, Clock, Eye, Radio, Headphones, Tv
} from "lucide-react";

/* ═══ ALBUM DATA ═══ */
interface AlbumInfo {
  slug: string;
  name: string;
  releaseDate: string;
  description: string;
  color: string;
  era: string;
  trackCount: number;
  streaming: {
    spotify?: string;
    apple_music?: string;
    tidal?: string;
    youtube_music?: string;
  };
}

const ALBUMS: AlbumInfo[] = [
  {
    slug: "dischordian-logic",
    name: "Dischordian Logic",
    releaseDate: "March 18, 2025",
    description: "The first album in the Saga. Dischordian Logic introduces the core mythology — the Architect's rise, the Enigma's rebellion, and the fractured multiverse where logic itself is weaponized.",
    color: "#33E2E6",
    era: "The Age of Revelation",
    trackCount: 29,
    streaming: {
      spotify: "https://open.spotify.com/album/33LvDG83EjPJR9wof12nWV",
      apple_music: "https://music.apple.com/us/album/dischordian-logic/1803056094",
      tidal: "https://tidal.com/browse/artist/49211320",
    },
  },
  {
    slug: "age-of-privacy",
    name: "The Age of Privacy",
    releaseDate: "October 2, 2025",
    description: "The era of surveillance and secrets. Malkia Ukweli — the Enigma — fights to expose truth in a world where privacy is the ultimate currency and the Panopticon sees all.",
    color: "#FF8C00",
    era: "The Age of Privacy",
    trackCount: 20,
    streaming: {
      spotify: "https://open.spotify.com/album/5zhVhfYKgzq7T7yTBKaobV",
      apple_music: "https://music.apple.com/us/album/the-age-of-privacy/1844017409",
      tidal: "https://tidal.com/browse/artist/49211320",
    },
  },
  {
    slug: "book-of-daniel",
    name: "The Book of Daniel 2:47",
    releaseDate: "December 15, 2025",
    description: "The Programmer's journey through time. Dr. Daniel Cross decodes the architecture of reality itself, discovering that the multiverse is a construct — and he holds the key to rewriting it.",
    color: "#A078FF",
    era: "The Age of Revelation",
    trackCount: 22,
    streaming: {
      spotify: "https://open.spotify.com/album/6WInT4ZL1NGJWaM7UxM0uC",
      apple_music: "https://music.apple.com/us/album/the-book-of-daniel-2-47/1857318273",
      tidal: "https://tidal.com/browse/artist/49211320",
    },
  },
  {
    slug: "silence-in-heaven",
    name: "Silence in Heaven",
    releaseDate: "July 30, 2026",
    description: "The final album. When the seventh seal is broken, silence falls across every dimension. The Fall of Reality begins — and the cycle completes. This is the end. And the beginning.",
    color: "#FF3C40",
    era: "The Fall of Reality",
    trackCount: 18,
    streaming: {
      tidal: "https://tidal.com/browse/artist/49211320",
    },
  },
];

/* ═══ STREAMING ICONS ═══ */
function SpotifyIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  );
}

function AppleMusicIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03c.525 0 1.048-.034 1.57-.1.823-.106 1.597-.35 2.296-.81a5.046 5.046 0 001.88-2.207c.186-.42.293-.87.37-1.324.113-.675.138-1.358.137-2.04-.002-3.8 0-7.595-.003-11.393zm-6.423 3.99v5.712c0 .417-.058.827-.244 1.206-.29.59-.76.962-1.388 1.14-.35.1-.706.157-1.07.173-.95.042-1.8-.6-1.965-1.483-.18-.965.46-1.9 1.44-2.106.422-.09.853-.14 1.273-.238.287-.067.47-.27.514-.56.01-.065.013-.13.013-.2V11.14a.507.507 0 00-.394-.5c-.115-.03-.234-.044-.352-.06l-3.293-.5c-.06-.01-.12-.02-.18-.023-.168-.01-.3.07-.34.237-.013.053-.02.108-.02.163l-.003 7.332c0 .42-.047.836-.22 1.227-.283.64-.78 1.04-1.443 1.23-.34.1-.69.148-1.044.163-.93.04-1.77-.6-1.94-1.46-.186-.94.41-1.87 1.35-2.1.38-.09.77-.14 1.15-.24.33-.08.52-.3.56-.64.01-.04.01-.08.01-.12V7.27c0-.3.12-.52.4-.66.17-.08.35-.12.54-.14l4.47-.67c.1-.01.2-.03.3-.03.33-.01.58.18.62.52.01.06.01.12.01.18v3.63z"/>
    </svg>
  );
}

function TidalIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.012 3.992L8.008 7.996 4.004 3.992 0 7.996 4.004 12l4.004-4.004L12.012 12l4.004-4.004L12.012 3.992zM12.012 12l-4.004 4.004L12.012 20.008l4.004-4.004L12.012 12zM20.02 3.992l-4.004 4.004L20.02 12l4.004-4.004-4.004-4.004z"/>
    </svg>
  );
}

export default function DiscographyPage() {
  const { getByAlbum, entries, albumStreamingLinks } = useLoredex();
  const { playSong, setQueue, currentSong, isPlaying } = usePlayer();
  const [expandedAlbum, setExpandedAlbum] = useState<string | null>("dischordian-logic");

  // Get total stats
  const totalSongs = useMemo(() => entries.filter(e => e.type === "song").length, [entries]);
  const totalVideos = useMemo(() =>
    entries.filter(e => e.type === "song" && e.music_video && (e.music_video.official || e.music_video.vevo)).length,
    [entries]
  );

  return (
    <div className="animate-fade-in">
      {/* ═══ HERO HEADER ═══ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 30% 20%, rgba(160,120,255,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(51,226,230,0.08) 0%, transparent 50%)"
          }} />
        </div>
        <div className="relative px-4 sm:px-6 pt-8 pb-6 sm:pt-12 sm:pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 max-w-12 bg-gradient-to-r from-transparent to-[var(--deep-purple)]/50" />
              <span className="font-mono text-[10px] text-[var(--deep-purple)]/70 tracking-[0.4em]">DECODED TRANSMISSIONS</span>
              <div className="h-px flex-1 max-w-12 bg-gradient-to-l from-transparent to-[var(--deep-purple)]/50" />
            </div>

            <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black tracking-wider text-white mb-2 leading-tight">
              <span className="text-[var(--deep-purple)] glow-purple">DISCOGRAPHY</span>
            </h1>
            <p className="font-mono text-xs sm:text-sm text-muted-foreground/80 max-w-2xl mb-5 leading-relaxed">
              Four albums spanning the complete mythology of <span className="text-foreground">Malkia Ukweli & the Panopticon</span>.
              <span className="text-[var(--deep-purple)]"> {totalSongs}</span> songs,
              <span className="text-[var(--alert-red)]"> {totalVideos}</span> music videos,
              and <span className="text-[var(--neon-cyan)]">one story</span> told across dimensions.
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/10 bg-muted/25">
                <Disc3 size={12} className="text-[var(--deep-purple)]" />
                <span className="font-mono text-[10px] text-muted-foreground/80">4 ALBUMS</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/10 bg-muted/25">
                <Music size={12} className="text-[var(--neon-cyan)]" />
                <span className="font-mono text-[10px] text-muted-foreground/80">{totalSongs} TRACKS</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/10 bg-muted/25">
                <Eye size={12} className="text-[var(--alert-red)]" />
                <span className="font-mono text-[10px] text-muted-foreground/80">{totalVideos} VIDEOS</span>
              </div>
              <Link
                href="/watch"
                className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[var(--neon-cyan)]/20 bg-[var(--neon-cyan)]/5 hover:bg-[var(--neon-cyan)]/10 transition-all"
              >
                <Tv size={12} className="text-[var(--neon-cyan)]" />
                <span className="font-mono text-[10px] text-[var(--neon-cyan)]">WATCH THE SHOW</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ ALBUM LIST ═══ */}
      <div className="px-4 sm:px-6 space-y-4 pb-12">
        {ALBUMS.map((album, idx) => (
          <AlbumCard
            key={album.slug}
            album={album}
            index={idx}
            expanded={expandedAlbum === album.slug}
            onToggle={() => setExpandedAlbum(expandedAlbum === album.slug ? null : album.slug)}
            tracks={getByAlbum(album.name)}
            currentSong={currentSong}
            isPlaying={isPlaying}
            onPlaySong={playSong}
            onPlayAll={(tracks) => { setQueue(tracks); if (tracks[0]) playSong(tracks[0]); }}
          />
        ))}

        {/* ═══ STREAMING PLAYLIST EMBED ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, var(--glass-base) 0%, var(--glass-dark) 100%)",
            border: "1px solid var(--glass-border)",
          }}
        >
          <div className="flex items-center gap-3 px-5 pt-4 pb-2">
            <Headphones size={14} className="text-[#1DB954]" />
            <h3 className="font-display text-sm font-bold tracking-[0.2em] text-white">LISTEN ON SPOTIFY</h3>
          </div>
          <div className="px-5 pb-4">
            <p className="font-mono text-[10px] text-muted-foreground/60 mb-3">
              Stream the complete Dischordian Saga discography. All 4 albums, 89 tracks.
            </p>
            <div className="rounded-lg overflow-hidden" style={{ background: "#121212" }}>
              <iframe
                src="https://open.spotify.com/embed/artist/4bL2B0xVKMHYBnbSCDkqBr?utm_source=generator&theme=0"
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-lg"
                title="Spotify - Malkia Ukweli & the Panopticon"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {ALBUMS.filter(a => a.streaming.spotify).map((album) => (
                <a
                  key={album.slug}
                  href={album.streaming.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-mono text-[9px] tracking-wider text-[#1DB954]/60 border border-[#1DB954]/15 hover:text-[#1DB954] hover:border-[#1DB954]/30 hover:bg-[#1DB954]/5 transition-all"
                >
                  <SpotifyIcon size={9} />
                  {album.name.toUpperCase()}
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ═══ ARTIST INFO ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl p-5 sm:p-6"
          style={{
            background: "linear-gradient(135deg, var(--glass-base) 0%, var(--glass-dark) 100%)",
            border: "1px solid var(--glass-border)",
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <Radio size={14} className="text-[var(--orb-orange)]" />
            <h3 className="font-display text-sm font-bold tracking-[0.2em] text-white">ABOUT THE ARTIST</h3>
          </div>
          <p className="font-mono text-xs text-muted-foreground/80 leading-relaxed mb-3">
            <span className="text-foreground font-medium">Malkia Ukweli & the Panopticon</span> is a multimedia project
            that tells the story of the Dischordian Saga through music, film, and interactive experiences.
            The music spans multiple genres — from hip-hop and electronic to orchestral and experimental —
            weaving a narrative about power, surveillance, rebellion, and the nature of reality itself.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href="https://www.youtube.com/@MalkiaUkweli"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-md font-mono text-[10px] tracking-wider text-muted-foreground/70 border border-white/10 hover:text-foreground/85 hover:border-white/20 hover:bg-muted/50 transition-all"
            >
              <ExternalLink size={10} />
              YOUTUBE
            </a>
            {albumStreamingLinks?.spotify?.artist && (
              <a
                href={albumStreamingLinks.spotify.artist}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-md font-mono text-[10px] tracking-wider text-[#1DB954]/70 border border-[#1DB954]/20 hover:text-[#1DB954] hover:border-[#1DB954]/40 hover:bg-[#1DB954]/5 transition-all"
              >
                <SpotifyIcon size={10} />
                SPOTIFY
              </a>
            )}
            {albumStreamingLinks?.apple_music?.artist && (
              <a
                href={albumStreamingLinks.apple_music.artist}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-md font-mono text-[10px] tracking-wider text-[#FC3C44]/70 border border-[#FC3C44]/20 hover:text-[#FC3C44] hover:border-[#FC3C44]/40 hover:bg-[#FC3C44]/5 transition-all"
              >
                <AppleMusicIcon size={10} />
                APPLE MUSIC
              </a>
            )}
            {albumStreamingLinks?.tidal?.artist && (
              <a
                href={albumStreamingLinks.tidal.artist}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-md font-mono text-[10px] tracking-wider text-muted-foreground/70 border border-white/10 hover:text-foreground/85 hover:border-white/20 hover:bg-muted/50 transition-all"
              >
                <TidalIcon size={10} />
                TIDAL
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ALBUM CARD — Expandable album with track listing
   ═══════════════════════════════════════════════════════ */
interface AlbumCardProps {
  album: AlbumInfo;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  tracks: LoredexEntry[];
  currentSong: LoredexEntry | null;
  isPlaying: boolean;
  onPlaySong: (song: LoredexEntry) => void;
  onPlayAll: (tracks: LoredexEntry[]) => void;
}

function AlbumCard({
  album, index, expanded, onToggle, tracks,
  currentSong, isPlaying, onPlaySong, onPlayAll,
}: AlbumCardProps) {
  const albumArt = tracks[0]?.image || "";
  const sortedTracks = [...tracks].sort((a, b) => (a.track_number || 0) - (b.track_number || 0));
  const videosCount = tracks.filter(t => t.music_video && (t.music_video.official || t.music_video.vevo)).length;
  const isUpcoming = album.name === "Silence in Heaven";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index, duration: 0.5 }}
      className="rounded-xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, var(--glass-base) 0%, var(--glass-dark) 100%)",
        border: `1px solid ${album.color}20`,
        boxShadow: expanded ? `0 0 30px ${album.color}08` : "none",
      }}
    >
      {/* Album Header */}
      <button onClick={onToggle} className="w-full text-left p-4 sm:p-5 transition-all group">
        <div className="flex gap-4">
          {/* Album Art */}
          <div
            className="w-20 h-20 sm:w-28 sm:h-28 rounded-lg overflow-hidden shrink-0 relative"
            style={{
              border: `1px solid ${album.color}30`,
              boxShadow: `0 0 20px ${album.color}15`,
            }}
          >
            {albumArt ? (
              <img src={albumArt} alt={album.name} className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ background: album.color + "15" }}>
                <Disc3 size={28} style={{ color: album.color }} />
              </div>
            )}
            {isUpcoming && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/70">
                <span className="font-mono text-[8px] tracking-[0.3em] text-foreground/85 bg-[var(--alert-red)]/80 px-2 py-0.5 rounded">UPCOMING</span>
              </div>
            )}
          </div>

          {/* Album Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="font-mono text-[9px] tracking-[0.2em] px-2 py-0.5 rounded"
                style={{ color: album.color, background: album.color + "15", border: `1px solid ${album.color}25` }}
              >
                {album.era}
              </span>
            </div>
            <h2
              className="font-display text-base sm:text-lg font-bold tracking-wider mb-1"
              style={{ color: album.color }}
            >
              {album.name}
            </h2>
            <p className="font-mono text-[10px] text-muted-foreground/60 mb-2">{album.releaseDate}</p>
            <p className="font-mono text-xs text-muted-foreground/70 leading-relaxed line-clamp-2 group-hover:text-muted-foreground/80 transition-colors hidden sm:block">
              {album.description}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <span className="font-mono text-[10px] text-muted-foreground/50">
                <Music size={10} className="inline mr-1" />{tracks.length} tracks
              </span>
              {videosCount > 0 && (
                <span className="font-mono text-[10px] text-[var(--alert-red)]/50">
                  <Eye size={10} className="inline mr-1" />{videosCount} videos
                </span>
              )}
            </div>
          </div>

          {/* Expand */}
          <ChevronDown
            size={16}
            className={`shrink-0 transition-transform duration-300 text-muted-foreground/50 mt-2 ${expanded ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Expanded: Track listing + streaming */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 pb-5 space-y-4">
              {/* Divider */}
              <div className="h-px" style={{ background: `linear-gradient(to right, transparent, ${album.color}30, transparent)` }} />

              {/* Description (mobile) */}
              <p className="font-mono text-xs text-muted-foreground/70 leading-relaxed sm:hidden">
                {album.description}
              </p>

              {/* Streaming Links */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onPlayAll(sortedTracks)}
                  className="flex items-center gap-2 px-4 py-2 rounded-md font-mono text-[10px] tracking-wider transition-all"
                  style={{
                    background: album.color + "15",
                    border: `1px solid ${album.color}30`,
                    color: album.color,
                  }}
                >
                  <Play size={12} />
                  PLAY ALL
                </button>
                {album.streaming.spotify && !album.streaming.spotify.startsWith("TBD") && (
                  <a
                    href={album.streaming.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-md font-mono text-[10px] tracking-wider text-[#1DB954]/70 border border-[#1DB954]/20 hover:text-[#1DB954] hover:bg-[#1DB954]/5 transition-all"
                  >
                    <SpotifyIcon size={11} />
                    SPOTIFY
                  </a>
                )}
                {album.streaming.apple_music && !album.streaming.apple_music.startsWith("TBD") && (
                  <a
                    href={album.streaming.apple_music}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-md font-mono text-[10px] tracking-wider text-[#FC3C44]/70 border border-[#FC3C44]/20 hover:text-[#FC3C44] hover:bg-[#FC3C44]/5 transition-all"
                  >
                    <AppleMusicIcon size={11} />
                    APPLE MUSIC
                  </a>
                )}
                {album.streaming.tidal && (
                  <a
                    href={album.streaming.tidal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-md font-mono text-[10px] tracking-wider text-muted-foreground/60 border border-white/10 hover:text-muted-foreground/80 hover:bg-muted/50 transition-all"
                  >
                    <TidalIcon size={11} />
                    TIDAL
                  </a>
                )}
              </div>

              {/* Track Listing */}
              <div className="space-y-0.5">
                {sortedTracks.map((track, i) => {
                  const isCurrent = currentSong?.id === track.id;
                  const hasVideo = track.music_video && (track.music_video.official || track.music_video.vevo);
                  return (
                    <button
                      key={track.id}
                      onClick={() => onPlaySong(track)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-left transition-all group ${
                        isCurrent
                          ? "bg-[var(--neon-cyan)]/8 border border-[var(--neon-cyan)]/20"
                          : "hover:bg-muted/50 border border-transparent"
                      }`}
                    >
                      {/* Track number / play indicator */}
                      <span className="w-5 text-right shrink-0">
                        {isCurrent && isPlaying ? (
                          <Pause size={11} style={{ color: album.color }} />
                        ) : (
                          <span className="font-mono text-[10px] text-muted-foreground/40 group-hover:hidden">{track.track_number}</span>
                        )}
                        {!isCurrent && (
                          <Play size={11} className="text-muted-foreground/60 hidden group-hover:block" />
                        )}
                      </span>

                      {/* Track art */}
                      {track.image && (
                        <img
                          src={track.image}
                          alt=""
                          className="w-8 h-8 rounded object-cover ring-1 ring-white/10 shrink-0"
                          loading="lazy"
                        />
                      )}

                      {/* Track info */}
                      <div className="min-w-0 flex-1">
                        <p className={`text-[11px] font-medium truncate transition-colors ${
                          isCurrent ? "text-[var(--neon-cyan)]" : "text-muted-foreground/90 group-hover:text-foreground"
                        }`}>
                          {track.name}
                        </p>
                        {track.characters_featured && track.characters_featured.length > 0 && (
                          <p className="text-[9px] font-mono text-muted-foreground/40 truncate">
                            ft. {track.characters_featured.join(", ")}
                          </p>
                        )}
                      </div>

                      {/* Badges */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {hasVideo && (
                          <Link
                            href={`/song/${track.id}`}
                            className="text-[8px] font-mono text-[var(--alert-red)]/50 hover:text-[var(--alert-red)] transition-colors px-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            VIDEO
                          </Link>
                        )}
                        {isCurrent && (
                          <div className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse" style={{ background: album.color }} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* View full album page link */}
              <Link
                href={`/album/${album.slug}`}
                className="flex items-center gap-2 px-3 py-2 rounded-md font-mono text-[10px] tracking-wider text-muted-foreground/60 border border-white/10 hover:text-muted-foreground/80 hover:border-white/20 hover:bg-muted/50 transition-all w-fit"
              >
                <Headphones size={10} />
                VIEW FULL ALBUM PAGE
                <ExternalLink size={9} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
