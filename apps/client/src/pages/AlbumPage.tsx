import { useLoredex } from "@/contexts/LoredexContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { useRoute, Link } from "wouter";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Clock, Disc3, Film, Music, Play } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";
import AudioSpectrum from "@/components/AudioSpectrum";
import AlbumFilmPlayer from "@/components/AlbumFilmPlayer";
import { trpc } from "@/lib/trpc";
import {
  PROPHECY_VISIONS,
  type AlbumSlug,
} from "@shared/prophecyVisionMap";

const ALBUM_SLUGS: Record<string, string> = {
  "dischordian-logic": "Dischordian Logic",
  "age-of-privacy": "The Age of Privacy",
  "book-of-daniel": "The Book of Daniel 2:47",
  "silence-in-heaven": "Silence in Heaven",
};

const ALBUM_META: Record<string, { date: string; color: string }> = {
  "Dischordian Logic": { date: "March 18, 2025", color: "var(--void-primary, var(--energy-primary))" },
  "The Age of Privacy": { date: "October 2, 2025", color: "var(--void-gold, #eab308)" },
  "The Book of Daniel 2:47": { date: "December 15, 2025", color: "var(--void-system, var(--energy-system))" },
  "Silence in Heaven": { date: "July 30, 2026", color: "var(--void-error, #ff3c40)" },
};

const ALBUM_SLUG_TO_PROPHECY: Record<string, AlbumSlug> = {
  "dischordian-logic": "dischordian-logic",
  "age-of-privacy": "age-of-privacy",
  "book-of-daniel": "book-of-daniel",
  "silence-in-heaven": "silence-in-heaven",
};

export default function AlbumPage() {
  const [, params] = useRoute("/album/:slug");
  const { getByAlbum } = useLoredex();
  const { playSong, setQueue, currentSong, isPlaying } = usePlayer();

  const slug = params?.slug || "";
  const albumName = ALBUM_SLUGS[slug] || "";
  const tracks = getByAlbum(albumName);
  const meta = ALBUM_META[albumName] || { date: "", color: "#00f0ff" };
  const albumArt = tracks[0]?.image || "";

  /* ─── Prophecy gating + Album-as-Film integration ─── */
  const prophecySlug = ALBUM_SLUG_TO_PROPHECY[slug];
  const progressQuery = trpc.dreamerVisions.getProphecyProgress.useQuery(
    undefined,
    { enabled: Boolean(prophecySlug) },
  );

  const visionsForAlbum = useMemo(() => {
    if (!prophecySlug) return [];
    return PROPHECY_VISIONS.filter((v) => v.albumSlug === prophecySlug);
  }, [prophecySlug]);

  // The film is watchable when every song in the album has at
  // least an unlocked vision binding. The ordered list of
  // slideshow ids drives the AlbumFilmPlayer.
  const filmReady = useMemo(() => {
    if (!progressQuery.data) return false;
    if (visionsForAlbum.length === 0) return false;
    const received = new Set(progressQuery.data.marqueesReceived);
    const completed = new Set(progressQuery.data.marqueesCompleted);
    const unlockedWhispers = new Set(progressQuery.data.unlockedWhispers);
    const viewed = new Set(progressQuery.data.viewedInIndex);
    return visionsForAlbum.every((v) => {
      if (v.intensity === "marquee") {
        return received.has(v.id) || completed.has(v.id);
      }
      return unlockedWhispers.has(v.id) || viewed.has(v.id);
    });
  }, [progressQuery.data, visionsForAlbum]);

  const filmSlideshowIds = useMemo(
    () => visionsForAlbum.map((v) => v.slideshowId),
    [visionsForAlbum],
  );
  const filmBookmark =
    prophecySlug && progressQuery.data?.albumFilmBookmarks
      ? progressQuery.data.albumFilmBookmarks[prophecySlug]
      : undefined;

  const [filmActive, setFilmActive] = useState(false);

  usePageMeta({
    title: albumName || "Album",
    description: `${albumName} - ${tracks.length} tracks from the Dischordian Saga. Released ${meta.date}.`,
    image: albumArt || undefined,
    type: "music.album",
  });

  useEffect(() => { window.scrollTo(0, 0); }, [albumName]);

  if (!albumName || tracks.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="font-mono text-muted-foreground">ALBUM NOT FOUND IN ARCHIVE</p>
        <Link href="/" className="text-primary text-sm mt-4 inline-block">Return to Dashboard</Link>
      </div>
    );
  }

  const playAll = () => {
    setQueue(tracks);
    if (tracks[0]) playSong(tracks[0]);
  };

  return (
    <div className="animate-fade-in pb-8">
      {/* Hero */}
      <div className="relative overflow-hidden">
        {albumArt && (
          <div className="absolute inset-0">
            <img src={albumArt} alt="" className="w-full h-full object-cover opacity-10 blur-md scale-110" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
          </div>
        )}
        <div className="relative px-4 sm:px-6 pt-4 pb-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary text-xs font-mono mb-4 transition-colors">
            <ArrowLeft size={12} /> BACK
          </Link>

          <div className="flex flex-col sm:flex-row gap-5">
            {albumArt && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="shrink-0"
              >
                <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-lg overflow-hidden border border-border/30 shadow-2xl"
                  style={{ boxShadow: `0 0 40px ${meta.color}15` }}>
                  <img src={albumArt} alt={albumName} className="w-full h-full object-cover" />
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="min-w-0 flex flex-col justify-end"
            >
              <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground/60">ALBUM</span>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black tracking-wider mt-1 page-title-reveal" style={{ color: meta.color }}>
                {albumName.toUpperCase()}
              </h1>
              <p className="font-mono text-sm text-muted-foreground mt-1">Malkia Ukweli & the Panopticon</p>
              <div className="flex items-center gap-3 mt-3 font-mono text-[10px] text-muted-foreground/60">
                <span className="flex items-center gap-1"><Clock size={10} /> {meta.date}</span>
                <span>{tracks.length} tracks</span>
              </div>
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                <button
                  onClick={playAll}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-mono font-bold hover:scale-105 transition-transform w-fit"
                  style={{ backgroundColor: meta.color + "20", color: meta.color, border: `1px solid ${meta.color}40` }}
                >
                  <Play size={14} /> PLAY ALL
                </button>
                {prophecySlug && (
                  <>
                    <button
                      onClick={() => filmReady && setFilmActive(true)}
                      disabled={!filmReady}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-mono font-bold transition-transform w-fit border ${
                        filmReady
                          ? "hover:scale-105 cursor-pointer"
                          : "opacity-40 cursor-not-allowed"
                      }`}
                      style={{
                        borderColor: meta.color + "40",
                        color: meta.color,
                      }}
                      title={
                        filmReady
                          ? "Watch the album as one continuous film"
                          : "Unlock all visions to watch the full film"
                      }
                    >
                      <Film size={14} />{" "}
                      {filmBookmark ? "RESUME FILM" : "WATCH AS FILM"}
                    </button>
                    <Link
                      href="/antiquarian-index"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-md text-xs font-mono text-muted-foreground/70 hover:text-primary transition-colors w-fit border border-border/30 hover:border-primary/40"
                      title="Open the Antiquarian's Index"
                    >
                      <BookOpen size={12} /> THE INDEX
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Audio spectrum — live canvas visualizer fed by the shared
          AnalyserNode registered in PlayerContext. Only drawn while a
          track is playing on this album; when the player is paused or
          on a different album, it idles silently (bars at 0). Gives
          the discography the "this is a music game" beat the old
          generic album detail view was missing. */}
      {currentSong && tracks.some(t => t.id === currentSong.id) && isPlaying && (
        <div className="px-4 sm:px-6 mt-3">
          <AudioSpectrum
            bars={72}
            height={56}
            accentColor={meta.color}
            gradientStrength={0.55}
          />
        </div>
      )}

      {/* Track List */}
      <div className="px-4 sm:px-6 mt-2">
        <div className="void-surface overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-2 border-b border-border/15 text-[10px] font-mono text-muted-foreground/40 tracking-wider">
            <span className="w-8 text-right">#</span>
            <span className="flex-1">TITLE</span>
            <span className="w-20 hidden sm:block text-right">VIDEO</span>
            <span className="w-24 hidden md:block text-right">STREAM</span>
          </div>

          {tracks.map((track, i) => {
            const isActive = currentSong?.id === track.id;
            const videoUrl = track.music_video?.official || track.music_video?.vevo || "";
            const streaming = track.streaming_links || {};

            return (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                className={`group flex items-center gap-3 px-4 py-2.5 border-b border-border/8 hover:bg-secondary/20 transition-all ${
                  isActive ? "bg-primary/5" : ""
                }`}
              >
                <button
                  onClick={() => { playSong(track); setQueue(tracks); }}
                  className="w-8 text-right shrink-0"
                >
                  {isActive && isPlaying ? (
                    // Each bar's height is driven by one band of the live
                    // audio analyser (PlayerContext writes --audio-bass/mid/
                    // treble to <html>). When audio-reactivity is disabled
                    // via settings, the CSS falls back to a subtle idle
                    // pulse so the indicator still reads as "playing."
                    <div className="flex items-end justify-center gap-0.5 h-4">
                      <span
                        className="w-0.5 bg-primary rounded-sm transition-[height] duration-[60ms] linear"
                        style={{ height: "calc(6px + var(--audio-bass, 0) * 10px)" }}
                      />
                      <span
                        className="w-0.5 bg-primary rounded-sm transition-[height] duration-[60ms] linear"
                        style={{ height: "calc(8px + var(--audio-mid, 0) * 8px)" }}
                      />
                      <span
                        className="w-0.5 bg-primary rounded-sm transition-[height] duration-[60ms] linear"
                        style={{ height: "calc(4px + var(--audio-treble, 0) * 10px)" }}
                      />
                    </div>
                  ) : (
                    <>
                      <span className="group-hover:hidden font-mono text-xs text-muted-foreground/40 tabular-nums">
                        {track.track_number || i + 1}
                      </span>
                      <Play size={12} className="hidden group-hover:inline text-primary" />
                    </>
                  )}
                </button>

                <Link href={`/song/${track.id}`} className="flex items-center gap-2.5 min-w-0 flex-1">
                  {track.image && (
                    <img src={track.image} alt="" className="w-8 h-8 rounded object-cover ring-1 ring-border/10 shrink-0" loading="lazy" />
                  )}
                  <div className="min-w-0">
                    <p className={`text-xs font-medium truncate transition-colors ${isActive ? "text-primary" : "group-hover:text-primary"}`}>
                      {track.name}
                    </p>
                    {track.characters_featured && track.characters_featured.length > 0 && (
                      <p className="text-[10px] font-mono text-muted-foreground/40 truncate">
                        ft. {track.characters_featured.slice(0, 3).join(", ")}
                        {track.characters_featured.length > 3 ? ` +${track.characters_featured.length - 3}` : ""}
                      </p>
                    )}
                  </div>
                </Link>

                <div className="w-20 hidden sm:flex justify-end">
                  {videoUrl && (
                    <a href={videoUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2 py-0.5 rounded bg-destructive/10 border border-destructive/20 text-destructive text-[9px] font-mono hover:bg-destructive/20 transition-all">
                      <Play size={8} /> VIDEO
                    </a>
                  )}
                </div>

                <div className="w-24 hidden md:flex justify-end gap-1.5">
                  {streaming.spotify && (
                    <a href={streaming.spotify} target="_blank" rel="noopener noreferrer"
                      className="w-5 h-5 rounded flex items-center justify-center bg-[#1DB954]/10 text-[#1DB954] hover:bg-[#1DB954]/25 transition-all"
                      title="Spotify">
                      <Disc3 size={10} />
                    </a>
                  )}
                  {streaming.apple_music && (
                    <a href={streaming.apple_music} target="_blank" rel="noopener noreferrer"
                      className="w-5 h-5 rounded flex items-center justify-center bg-[#FC3C44]/10 text-[#FC3C44] hover:bg-[#FC3C44]/25 transition-all"
                      title="Apple Music">
                      <Music size={10} />
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {filmActive && prophecySlug && filmReady && (
        <AlbumFilmPlayer
          albumSlug={prophecySlug}
          slideshowIds={filmSlideshowIds}
          resumeFromTrackId={filmBookmark}
          onComplete={() => setFilmActive(false)}
          onAwaken={() => setFilmActive(false)}
        />
      )}
    </div>
  );
}
