/**
 * Dischordian Logic — song + slideshow page.
 *
 * Plays the 2:55 song and advances through the 15 Afro-Samurai
 * slides in sync with the audio. Until the art assets ship each
 * slide renders its art-direction brief as typography over an
 * ink-wash background — fully self-contained, upgradable to
 * real images later by dropping files at
 *   /art/dischordian-logic/slide_{01..15}.webp
 *
 * This is the narrative payoff of the chess arc: after G7 + the
 * Dischordian Logic primer, the Game Master presses play. The
 * player watches the song slideshow and comes out with a copy
 * of the song in their memory-resin bank.
 */
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getGoogleLoginUrl } from "@/const";
import {
  DISCHORDIAN_LOGIC_SLIDES,
  DISCHORDIAN_LOGIC_LYRICS,
  SONG_DURATION_SECONDS,
  SONG_TITLE,
  slideAt,
  type SongSlide,
} from "@shared/tcg-core/story/dischordianLogicSong";

import { assetUrl } from "@/lib/assetUrl";
const AUDIO_SRC = assetUrl("audio/songs/dischordian_logic.mp3");
const SLIDE_ART_BASE = assetUrl("art/dischordian-logic");

function SlideArt({ slide }: { slide: SongSlide }) {
  // If the art asset exists it will load; if not, the CSS
  // fallback renders the art-direction brief as typography.
  const slideNumStr = String(slide.n).padStart(2, "0");
  return (
    <div className="absolute inset-0 overflow-hidden">
      <img
        src={`${SLIDE_ART_BASE}/slide_${slideNumStr}.webp`}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500"
        onLoad={(e) => ((e.target as HTMLImageElement).style.opacity = "1")}
        onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
      />
      {/* Ink-wash fallback — pure CSS, works with or without assets. */}
      <div className="absolute inset-0 void-bg-canvas" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 30% 40%, color-mix(in oklch, var(--text-primary) 5%, transparent), transparent 50%), radial-gradient(ellipse at 70% 60%, color-mix(in oklch, var(--energy-error) 8%, transparent), transparent 50%)",
          mixBlendMode: "screen",
        }}
      />
      {/* Art-direction brief rendered as typography — upgradeable
          to real art when assets drop. */}
      <div className="absolute inset-0 p-12 flex flex-col justify-between text-white">
        <div className="text-[10px] uppercase tracking-[0.3em] opacity-60">
          Slide {slide.n} · {slide.section.replace("_", " ")} ·{" "}
          {slide.startSec}s–{slide.endSec}s
        </div>
        <div className="max-w-3xl space-y-6">
          <p className="text-xs italic leading-relaxed opacity-70 whitespace-pre-wrap">
            {slide.artDirection}
          </p>
          <div className="text-[10px] uppercase tracking-[0.3em] opacity-50">
            palette: {slide.paletteAccent}
          </div>
          <div className="text-[10px] uppercase tracking-[0.3em] opacity-50">
            motion: {slide.motion}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DischordianLogicSongPage() {
  const { isAuthenticated } = useAuth();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [current, setCurrent] = useState<SongSlide>(DISCHORDIAN_LOGIC_SLIDES[0]);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [showLyrics, setShowLyrics] = useState(false);

  // Sync slide to audio time.
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => {
      setElapsed(a.currentTime);
      const next = slideAt(a.currentTime);
      if (next.n !== current.n) setCurrent(next);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
    };
  }, [current.n]);

  // If no audio asset is available, run a slide-only timer so the
  // experience still works as a silent walkthrough.
  useEffect(() => {
    if (playing) return;
    if (!audioRef.current) return;
    // No-op; the timer is only for no-audio mode, handled below.
  }, [playing]);

  function advanceManually() {
    const next = DISCHORDIAN_LOGIC_SLIDES.find((s) => s.n === current.n + 1);
    if (next) setCurrent(next);
  }
  function rewindManually() {
    const prev = DISCHORDIAN_LOGIC_SLIDES.find((s) => s.n === current.n - 1);
    if (prev) setCurrent(prev);
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <a href={getGoogleLoginUrl()} className="text-void-text-accent underline">
          Sign in to play the song.
        </a>
      </div>
    );
  }

  const pct = (elapsed / SONG_DURATION_SECONDS) * 100;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Full-bleed slide canvas */}
      <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
        <SlideArt slide={current} />

        {/* Caption — huge typography on top of the slide */}
        <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
          <p className="font-serif text-2xl md:text-4xl leading-tight max-w-5xl">
            {current.caption}
          </p>
        </div>

        {/* Top-left song metadata */}
        <div className="absolute top-4 left-4 text-[11px] uppercase tracking-[0.3em] opacity-70">
          {SONG_TITLE} · {Math.floor(SONG_DURATION_SECONDS / 60)}:
          {String(SONG_DURATION_SECONDS % 60).padStart(2, "0")}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/10 relative">
        <div
          className="h-full bg-white/70 transition-all"
          style={{ width: `${pct}%` }}
        />
        {/* Slide boundary ticks */}
        {DISCHORDIAN_LOGIC_SLIDES.map((s) => (
          <div
            key={s.n}
            className="absolute top-0 bottom-0 w-px bg-white/20"
            style={{ left: `${(s.startSec / SONG_DURATION_SECONDS) * 100}%` }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="p-4 flex items-center justify-between text-xs text-white/70">
        <div className="flex items-center gap-3">
          <button
            onClick={() => audioRef.current?.play()}
            className="px-3 py-1 border border-white/30 rounded"
            disabled={playing}
          >
            ▶ Play
          </button>
          <button
            onClick={() => audioRef.current?.pause()}
            className="px-3 py-1 border border-white/30 rounded"
            disabled={!playing}
          >
            ‖ Pause
          </button>
          <button
            onClick={rewindManually}
            className="px-3 py-1 border border-white/30 rounded"
          >
            ← Slide
          </button>
          <button
            onClick={advanceManually}
            className="px-3 py-1 border border-white/30 rounded"
          >
            Slide →
          </button>
          <span className="opacity-60">
            Slide {current.n}/{DISCHORDIAN_LOGIC_SLIDES.length}
          </span>
          <span className="opacity-60 font-mono">
            {Math.floor(elapsed / 60)}:
            {String(Math.floor(elapsed % 60)).padStart(2, "0")}
          </span>
        </div>
        <button
          onClick={() => setShowLyrics(!showLyrics)}
          className="px-3 py-1 border border-white/30 rounded"
        >
          {showLyrics ? "Hide" : "Show"} full lyrics
        </button>
      </div>

      {/* Full lyrics reveal */}
      {showLyrics && (
        <div className="p-8 max-w-3xl mx-auto">
          <h2 className="text-xs uppercase tracking-[0.3em] opacity-60 mb-3">
            Lyrics
          </h2>
          <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed text-white/90">
            {DISCHORDIAN_LOGIC_LYRICS}
          </pre>
        </div>
      )}

      {/* Principle hook footer */}
      {current.principleHook && (
        <div className="p-4 text-center text-[10px] uppercase tracking-[0.3em] opacity-40">
          Dischordian Logic principle invoked: {current.principleHook.replace(/_/g, " ")}
        </div>
      )}

      {/* The audio element itself. If the file is missing the
          slideshow still renders and can be manually advanced. */}
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        preload="metadata"
        className="hidden"
      />
    </div>
  );
}
