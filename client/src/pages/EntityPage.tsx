import { useLoredex } from "@/contexts/LoredexContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { useRoute, Link } from "wouter";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Users, MapPin, Swords, Music, Play, ExternalLink,
  Link2, Clock, Shield, Eye, Disc3, Zap, ChevronRight, Gamepad2
} from "lucide-react";

const TYPE_ICONS: Record<string, typeof Users> = {
  character: Users,
  location: MapPin,
  faction: Swords,
  concept: Eye,
  song: Music,
};

const BADGE_CLASS: Record<string, string> = {
  character: "badge-character",
  location: "badge-location",
  faction: "badge-faction",
  song: "badge-song",
  concept: "badge-concept",
};

export default function EntityPage() {
  const [, params] = useRoute("/entity/:id");
  const { getEntryById, getRelated, getSongsForCharacter, discoverEntry, relationships } = useLoredex();
  const { playSong, setQueue } = usePlayer();

  const entry = params?.id ? getEntryById(params.id) : undefined;

  useEffect(() => {
    if (entry) discoverEntry(entry.id);
    window.scrollTo(0, 0);
  }, [entry?.id]);

  if (!entry) {
    return (
      <div className="p-8 text-center">
        <p className="font-mono text-muted-foreground">ENTITY NOT FOUND IN DATABASE</p>
        <Link href="/" className="text-primary text-sm mt-4 inline-block">Return to Dashboard</Link>
      </div>
    );
  }

  const Icon = TYPE_ICONS[entry.type] || Users;
  const related = getRelated(entry.name);
  const songs = getSongsForCharacter(entry.name);
  const badgeClass = BADGE_CLASS[entry.type] || "badge-concept";

  const entityRels = relationships.filter(
    (r) => r.source.toLowerCase() === entry.name.toLowerCase() || r.target.toLowerCase() === entry.name.toLowerCase()
  );

  return (
    <div className="animate-fade-in pb-8">
      {/* ═══ HERO HEADER WITH BLURRED BG ═══ */}
      <div className="relative overflow-hidden">
        {entry.image && (
          <div className="absolute inset-0">
            <img src={entry.image} alt="" className="w-full h-full object-cover opacity-15 blur-sm scale-110" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
          </div>
        )}
        <div className="relative px-4 sm:px-6 pt-4 pb-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary text-xs font-mono mb-4 transition-colors">
            <ArrowLeft size={12} /> BACK TO DASHBOARD
          </Link>

          <div className="flex flex-col sm:flex-row gap-5">
            {entry.image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="shrink-0"
              >
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-lg overflow-hidden border border-border/30 box-glow-cyan">
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
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider ${badgeClass}`}>
                  <Icon size={10} />
                  {entry.type.toUpperCase()}
                </span>
                {entry.status && (
                  <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                    entry.status === "Active" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                    entry.status === "Deceased" ? "bg-destructive/10 text-destructive border border-destructive/20" :
                    "bg-accent/10 text-accent border border-accent/20"
                  }`}>
                    {entry.status.toUpperCase()}
                  </span>
                )}
                {entry.season && (
                  <span className="text-[10px] font-mono text-muted-foreground/60 px-1.5 py-0.5 rounded bg-secondary/50 border border-border/20">
                    SEASON {entry.season}
                  </span>
                )}
              </div>

              <h1 className="font-display text-2xl sm:text-3xl font-black tracking-wider text-foreground mb-1">
                {entry.name}
              </h1>

              {entry.aliases && entry.aliases.length > 0 && (
                <p className="font-mono text-xs text-muted-foreground/60 mb-3">
                  AKA: {entry.aliases.join(" // ")}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mb-3">
                {entry.era && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-secondary/50 border border-border/30 text-[10px] font-mono text-muted-foreground">
                    <Clock size={9} /> {entry.era}
                  </span>
                )}
                {entry.affiliation && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-secondary/50 border border-border/30 text-[10px] font-mono text-muted-foreground">
                    <Shield size={9} /> {entry.affiliation}
                  </span>
                )}
                {entry.date_ad && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-secondary/50 border border-border/30 text-[10px] font-mono text-muted-foreground">
                    <Clock size={9} /> {entry.date_ad}
                  </span>
                )}
              </div>

              {entry.bio && (
                <p className="text-sm text-foreground/70 leading-relaxed line-clamp-3">{entry.bio}</p>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 space-y-5">
        {/* ═══ DESCRIPTION ═══ */}
        {entry.bio && entry.bio.length > 150 && (
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-lg border border-border/30 bg-card/30 p-5"
          >
            <h2 className="font-display text-xs font-bold tracking-[0.2em] text-primary mb-3 flex items-center gap-2">
              <Eye size={13} /> DOSSIER
            </h2>
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{entry.bio}</p>
          </motion.section>
        )}

        {/* ═══ HISTORY ═══ */}
        {entry.history && (
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-lg border border-border/30 bg-card/30 p-5"
          >
            <h2 className="font-display text-xs font-bold tracking-[0.2em] text-accent mb-3 flex items-center gap-2">
              <Clock size={13} /> HISTORY
            </h2>
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{entry.history}</p>
          </motion.section>
        )}

        {/* ═══ MUSIC VIDEO ═══ */}
        {entry.music_video && (entry.music_video.official || entry.music_video.vevo) && (
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-lg border border-destructive/20 bg-destructive/5 p-5"
          >
            <h2 className="font-display text-xs font-bold tracking-[0.2em] text-destructive mb-3 flex items-center gap-2">
              <Play size={13} /> OFFICIAL MUSIC VIDEO
            </h2>
            <div className="flex flex-wrap gap-3">
              {entry.music_video.official && (
                <a href={entry.music_video.official} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm font-mono hover:bg-destructive/20 transition-all hover-lift">
                  <Play size={14} /> Watch Official Video <ExternalLink size={11} />
                </a>
              )}
              {entry.music_video.vevo && (
                <a href={entry.music_video.vevo} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-secondary border border-border/30 text-foreground text-sm font-mono hover:bg-secondary/80 transition-all hover-lift">
                  <Play size={14} /> Watch on VEVO <ExternalLink size={11} />
                </a>
              )}
            </div>
          </motion.section>
        )}

        {/* ═══ STREAMING LINKS ═══ */}
        {entry.streaming_links && (entry.streaming_links.spotify || entry.streaming_links.apple_music) && (
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
            className="rounded-lg border border-border/30 bg-card/30 p-5"
          >
            <h2 className="font-display text-xs font-bold tracking-[0.2em] text-chart-5 mb-3 flex items-center gap-2">
              <Music size={13} /> LISTEN NOW
            </h2>
            <div className="flex flex-wrap gap-2">
              {entry.streaming_links.spotify && (
                <a href={entry.streaming_links.spotify} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1DB954]/10 border border-[#1DB954]/30 text-[#1DB954] text-xs font-mono hover:bg-[#1DB954]/20 transition-all">
                  <Disc3 size={12} /> Spotify <ExternalLink size={9} />
                </a>
              )}
              {entry.streaming_links.apple_music && (
                <a href={entry.streaming_links.apple_music} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FC3C44]/10 border border-[#FC3C44]/30 text-[#FC3C44] text-xs font-mono hover:bg-[#FC3C44]/20 transition-all">
                  <Music size={12} /> Apple Music <ExternalLink size={9} />
                </a>
              )}
              {entry.streaming_links.tidal && (
                <a href={entry.streaming_links.tidal} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 border border-white/20 text-white text-xs font-mono hover:bg-white/15 transition-all">
                  <Music size={12} /> Tidal <ExternalLink size={9} />
                </a>
              )}
            </div>
          </motion.section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* ═══ CONNECTIONS ═══ */}
          {related.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="rounded-lg border border-border/30 bg-card/30 p-5"
            >
              <h2 className="font-display text-xs font-bold tracking-[0.2em] text-primary mb-4 flex items-center gap-2">
                <Zap size={13} /> CONNECTIONS
                <span className="text-[10px] text-muted-foreground font-normal ml-1">({related.length})</span>
              </h2>
              <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
                {related.map((rel) => {
                  const RelIcon = TYPE_ICONS[rel.type] || Users;
                  const relBadge = BADGE_CLASS[rel.type] || "badge-concept";
                  const relType = entityRels.find(
                    (r) =>
                      (r.source.toLowerCase() === rel.name.toLowerCase() || r.target.toLowerCase() === rel.name.toLowerCase()) &&
                      (r.source.toLowerCase() === entry.name.toLowerCase() || r.target.toLowerCase() === entry.name.toLowerCase())
                  );
                  return (
                    <Link
                      key={rel.id}
                      href={rel.type === "song" ? `/song/${rel.id}` : `/entity/${rel.id}`}
                      className="group flex items-center gap-2.5 p-2.5 rounded-md border border-border/15 hover:bg-secondary/30 hover:border-primary/20 transition-all"
                    >
                      {rel.image ? (
                        <img src={rel.image} alt={rel.name} className="w-9 h-9 rounded-md object-cover ring-1 ring-border/20" loading="lazy" />
                      ) : (
                        <div className="w-9 h-9 rounded-md bg-secondary flex items-center justify-center">
                          <RelIcon size={12} className="text-muted-foreground" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">{rel.name}</p>
                        {relType && (
                          <p className="font-mono text-[10px] text-muted-foreground/50 truncate">{relType.type}</p>
                        )}
                      </div>
                      <ChevronRight size={12} className="text-muted-foreground/20 group-hover:text-primary/50 shrink-0 transition-colors" />
                    </Link>
                  );
                })}
              </div>
            </motion.section>
          )}

          {/* ═══ SONG APPEARANCES ═══ */}
          {songs.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-lg border border-border/30 bg-card/30 p-5"
            >
              <h2 className="font-display text-xs font-bold tracking-[0.2em] text-destructive mb-4 flex items-center gap-2">
                <Music size={13} /> SONG APPEARANCES
                <span className="text-[10px] text-muted-foreground font-normal ml-1">({songs.length})</span>
              </h2>
              <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
                {songs.map((song, i) => {
                  const videoUrl = song.music_video?.official || song.music_video?.vevo || "";
                  return (
                    <div
                      key={song.id}
                      className="flex items-center gap-2.5 p-2.5 rounded-md border border-border/15 hover:bg-secondary/30 hover:border-destructive/20 transition-all group"
                    >
                      <span className="font-mono text-[10px] text-muted-foreground/30 w-4 text-right tabular-nums shrink-0">{i + 1}</span>
                      <button
                        onClick={() => {
                          playSong(song);
                          setQueue(songs);
                        }}
                        className="p-1.5 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors shrink-0"
                      >
                        <Play size={10} />
                      </button>
                      {song.image && (
                        <img src={song.image} alt={song.name} className="w-8 h-8 rounded object-cover ring-1 ring-border/20 shrink-0" loading="lazy" />
                      )}
                      <Link href={`/song/${song.id}`} className="min-w-0 flex-1">
                        <p className="text-xs font-medium truncate group-hover:text-destructive transition-colors">{song.name}</p>
                        <p className="font-mono text-[10px] text-muted-foreground/50">{song.album}</p>
                      </Link>
                      {videoUrl && (
                        <a
                          href={videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded bg-destructive/10 text-destructive text-[9px] font-mono hover:bg-destructive/20 transition-colors"
                          title="Watch Music Video"
                        >
                          <Play size={8} /> VIDEO
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.section>
          )}
        </div>

        {/* ═══ CONEXUS STORIES ═══ */}
        {entry.conexus_stories && entry.conexus_stories.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="rounded-lg border border-chart-5/20 bg-chart-5/5 p-5"
          >
            <h2 className="font-display text-xs font-bold tracking-[0.2em] text-chart-5 mb-3 flex items-center gap-2">
              <Gamepad2 size={13} /> CONEXUS INTERACTIVE STORIES
            </h2>
            <div className="flex flex-wrap gap-2">
              {entry.conexus_stories.map((story: string) => (
                <span
                  key={story}
                  className="px-3 py-1.5 rounded bg-chart-5/10 border border-chart-5/20 font-mono text-xs text-chart-5"
                >
                  {story}
                </span>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
