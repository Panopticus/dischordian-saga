import { useLoredex } from "@/contexts/LoredexContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { useRoute, Link } from "wouter";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Music, Play, ExternalLink, Users, Clock, Disc3, ChevronRight
} from "lucide-react";
import LyricsViewer from "@/components/LyricsViewer";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function SongPage() {
  const [, params] = useRoute("/song/:id");
  const { getEntryById, getEntry, discoverEntry, getByAlbum } = useLoredex();
  const { playSong, setQueue } = usePlayer();

  const entry = params?.id ? getEntryById(params.id) : undefined;

  usePageMeta({
    title: entry ? `${entry.name} - ${entry.album || "Song"}` : "Song",
    description: entry?.bio?.slice(0, 160) || `Listen to ${entry?.name || "this track"} from the Dischordian Saga.`,
    image: entry?.image || undefined,
    type: "music.song",
  });

  useEffect(() => {
    if (entry) discoverEntry(entry.id);
    window.scrollTo(0, 0);
  }, [entry?.id]);

  if (!entry) {
    return (
      <div className="p-8 text-center">
        <p className="font-mono text-muted-foreground">TRANSMISSION NOT FOUND</p>
        <Link href="/" className="text-primary text-sm mt-4 inline-block">Return to Dashboard</Link>
      </div>
    );
  }

  const videoUrl = entry.music_video?.official || entry.music_video?.vevo || "";
  const streaming = entry.streaming_links || {};
  const albumTracks = entry.album ? getByAlbum(entry.album) : [];
  const characters = (entry.characters_featured || []).map((name: string) => getEntry(name)).filter(Boolean);

  // Extract YouTube embed URL
  const getEmbedUrl = (url: string) => {
    try {
      if (url.includes("watch?v=")) {
        const videoId = url.split("watch?v=")[1]?.split("&")[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      if (url.includes("youtu.be/")) {
        const videoId = url.split("youtu.be/")[1]?.split("?")[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      return url.replace("watch?v=", "embed/");
    } catch { return url; }
  };

  return (
    <div className="animate-fade-in pb-8">
      {/* ═══ HERO HEADER ═══ */}
      <div className="relative overflow-hidden">
        {entry.image && (
          <div className="absolute inset-0">
            <img src={entry.image} alt="" className="w-full h-full object-cover opacity-15 blur-sm scale-110" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
          </div>
        )}
        <div className="relative px-4 sm:px-6 pt-4 pb-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary text-xs font-mono mb-4 transition-colors">
            <ArrowLeft size={12} /> BACK
          </Link>

          <div className="flex flex-col sm:flex-row gap-5">
            {entry.image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="shrink-0"
              >
                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-lg overflow-hidden border border-border/30 box-glow-cyan">
                  <img src={entry.image} alt={entry.name} className="w-full h-full object-cover" />
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="min-w-0 flex-1"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="badge-song inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider">
                  <Music size={10} /> SONG
                </span>
                {entry.track_number && (
                  <span className="text-[10px] font-mono text-muted-foreground/60">TRACK {entry.track_number}</span>
                )}
              </div>

              <h1 className="font-display text-2xl sm:text-3xl font-black tracking-wider text-foreground mb-1">
                {entry.name}
              </h1>
              <p className="font-mono text-sm text-muted-foreground mb-3">
                {entry.artist || "Malkia Ukweli & the Panopticon"}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {entry.album && (
                  <Link href={`/album/${encodeURIComponent(entry.album)}`}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-secondary/50 border border-border/30 text-[10px] font-mono text-muted-foreground hover:text-primary hover:border-primary/30 transition-all">
                    <Disc3 size={9} /> {entry.album}
                  </Link>
                )}
                {entry.release_date && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-secondary/50 border border-border/30 text-[10px] font-mono text-muted-foreground">
                    <Clock size={9} /> {entry.release_date}
                  </span>
                )}
                {entry.era && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-secondary/50 border border-border/30 text-[10px] font-mono text-muted-foreground">
                    {entry.era}
                  </span>
                )}
              </div>

              {/* Play + Video */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => {
                    playSong(entry);
                    setQueue(albumTracks);
                  }}
                  className="flex items-center gap-2 px-5 py-2 rounded-md bg-primary text-primary-foreground text-sm font-mono font-bold hover:scale-105 transition-transform"
                >
                  <Play size={14} /> PLAY
                </button>
                {videoUrl && (
                  <a href={videoUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-destructive/15 border border-destructive/30 text-destructive text-sm font-mono hover:bg-destructive/25 transition-all">
                    <Play size={14} /> MUSIC VIDEO <ExternalLink size={11} />
                  </a>
                )}
              </div>

              {/* Streaming Buttons */}
              <div className="flex flex-wrap gap-2">
                {streaming.spotify && (
                  <a href={streaming.spotify} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1DB954]/10 border border-[#1DB954]/30 text-[#1DB954] text-xs font-mono hover:bg-[#1DB954]/20 transition-all">
                    <Disc3 size={12} /> Spotify <ExternalLink size={9} />
                  </a>
                )}
                {streaming.apple_music && (
                  <a href={streaming.apple_music} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FC3C44]/10 border border-[#FC3C44]/30 text-[#FC3C44] text-xs font-mono hover:bg-[#FC3C44]/20 transition-all">
                    <Music size={12} /> Apple Music <ExternalLink size={9} />
                  </a>
                )}
                {streaming.tidal && (
                  <a href={streaming.tidal} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted/50 border border-white/20 text-white text-xs font-mono hover:bg-white/15 transition-all">
                    <Music size={12} /> Tidal <ExternalLink size={9} />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 space-y-5">
        {/* ═══ YOUTUBE EMBED ═══ */}
        {videoUrl && (
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-lg border border-destructive/20 bg-destructive/5 p-4"
          >
            <h2 className="font-display text-xs font-bold tracking-[0.2em] text-destructive mb-3 flex items-center gap-2">
              <Play size={13} /> OFFICIAL MUSIC VIDEO
            </h2>
            <div className="aspect-video rounded-md overflow-hidden bg-black ring-1 ring-border/20">
              <iframe
                src={getEmbedUrl(videoUrl)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={entry.name}
              />
            </div>
          </motion.section>
        )}

        {/* ═══ LORE & HISTORY ═══ */}
        {entry.history && (
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-lg border border-border/30 bg-card/30 p-5"
          >
            <h2 className="font-display text-xs font-bold tracking-[0.2em] text-accent mb-3 flex items-center gap-2">
              <Clock size={13} /> LORE & HISTORY
            </h2>
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{entry.history}</p>
          </motion.section>
        )}

        {entry.bio && (
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-lg border border-border/30 bg-card/30 p-5"
          >
            <h2 className="font-display text-xs font-bold tracking-[0.2em] text-primary mb-3">DESCRIPTION</h2>
            <p className="text-sm text-foreground/80 leading-relaxed">{entry.bio}</p>
          </motion.section>
        )}

        {/* ═══ LYRICS & LORE ANNOTATIONS ═══ */}
        <LyricsViewer
          songName={entry.name}
          albumName={entry.album}
          artistName={entry.artist || "Malkia Ukweli & the Panopticon"}
          charactersFeature={entry.characters_featured}
        />

        {/* ═══ FEATURED CHARACTERS ═══ */}
        {characters.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-lg border border-border/30 bg-card/30 p-5"
          >
            <h2 className="font-display text-xs font-bold tracking-[0.2em] text-primary mb-4 flex items-center gap-2">
              <Users size={13} /> FEATURED CHARACTERS
              <span className="text-[10px] text-muted-foreground font-normal ml-1">({characters.length})</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {characters.map((char: any) => {
                if (!char) return null;
                return (
                  <Link
                    key={char.id}
                    href={`/entity/${char.id}`}
                    className="group flex items-center gap-3 p-2.5 rounded-md border border-border/15 hover:bg-secondary/30 hover:border-primary/20 transition-all"
                  >
                    {char.image ? (
                      <img src={char.image} alt={char.name} className="w-10 h-10 rounded-md object-cover ring-1 ring-border/20" loading="lazy" />
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center">
                        <Users size={14} className="text-muted-foreground" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">{char.name}</p>
                      {char.era && <p className="text-[10px] font-mono text-muted-foreground/50">{char.era}</p>}
                    </div>
                    <ChevronRight size={12} className="text-muted-foreground/20 group-hover:text-primary/50 shrink-0 transition-colors" />
                  </Link>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* ═══ ALBUM TRACKLIST ═══ */}
        {albumTracks.length > 1 && entry.album && (
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-lg border border-border/30 bg-card/30 p-5"
          >
            <h2 className="font-display text-xs font-bold tracking-[0.2em] text-muted-foreground mb-3 flex items-center gap-2">
              <Disc3 size={13} /> MORE FROM {entry.album.toUpperCase()}
            </h2>
            <div className="space-y-0.5 max-h-72 overflow-y-auto pr-1">
              {albumTracks.filter(t => t.id !== entry.id).slice(0, 10).map((track) => (
                <Link
                  key={track.id}
                  href={`/song/${track.id}`}
                  className={`group flex items-center gap-2.5 p-2 rounded-md hover:bg-secondary/30 transition-all ${
                    track.id === entry.id ? "bg-primary/5 border border-primary/20" : "border border-transparent"
                  }`}
                >
                  <span className="font-mono text-[10px] text-muted-foreground/30 w-4 text-right tabular-nums shrink-0">
                    {track.track_number || ""}
                  </span>
                  {track.image && (
                    <img src={track.image} alt="" className="w-7 h-7 rounded object-cover ring-1 ring-border/10 shrink-0" loading="lazy" />
                  )}
                  <p className="text-xs font-medium truncate group-hover:text-primary transition-colors flex-1">{track.name}</p>
                  {(track.music_video?.official || track.music_video?.vevo) && (
                    <span className="shrink-0 text-[9px] font-mono text-destructive/60">VIDEO</span>
                  )}
                </Link>
              ))}
            </div>
            <Link
              href={`/album/${encodeURIComponent(entry.album)}`}
              className="mt-3 inline-flex items-center gap-1 text-xs font-mono text-primary hover:text-primary/80 transition-colors"
            >
              View full album <ChevronRight size={11} />
            </Link>
          </motion.section>
        )}
      </div>
    </div>
  );
}
