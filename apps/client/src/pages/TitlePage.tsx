/* ═══════════════════════════════════════════════════════
   TitlePage — The Dischordian Saga entry screen.

   Every session begins here (unless `skipTitle` is set in
   localStorage). The page owns shared chrome — background
   keyart, vignette, scanlines, opening music — and
   delegates its body to one of three state renderers
   based on auth + save presence:

     A. Unauth       — CoNEXUS handshake (OAuth buttons)
     B. Authed,new   — "Establish New Connection" only
     C. Authed,returning — RECONNECT (auto-focused)

   It also hosts the Broadcast ticker and panel, and the
   Video transmission player (manual + auto-intercept).
   The Reset Wall is launched from State C.
   ═══════════════════════════════════════════════════════ */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

import { useAuth } from "@/_core/hooks/useAuth";
import { useGame } from "@/contexts/GameContext";
import { trpc } from "@/lib/trpc";

import { BroadcastPanel } from "./title/BroadcastPanel";
import { BroadcastTicker } from "./title/BroadcastTicker";
import { ResetWall } from "./title/ResetWall";
import { TitleStateNoSave } from "./title/TitleStateNoSave";
import { TitleStateReturning } from "./title/TitleStateReturning";
import { TitleStateUnauth } from "./title/TitleStateUnauth";
import { VideoTransmissionPlayer } from "./title/VideoTransmissionPlayer";
import { resolveTitleTheme } from "./title/themes";
import type { AnnouncementAudience, AnnouncementRow } from "./title/types";
import { useTransmissionIntercept } from "./title/useTransmissionIntercept";

const OPENING_MUSIC_SRC = "/audio/music/main-menu/the-enigmas-lament.mp3";
const THRESHOLD_MS = 1500;

interface TitlePageProps {
  /** Optional dismiss hook from TitleGate. If absent, the page
   *  renders the classic unauth-only flow (back-compat). */
  onDismiss?: () => void;
}

/**
 * F12 — diegetic boot overlay. Renders in the logo/CTA column as a
 * top-left HUD block that types on a short handshake narrative. Uses
 * framer-motion for the stagger because the file already imports it.
 * Disabled animation under prefers-reduced-motion (line appears
 * instantly instead of typing).
 */
function DiegeticBootSequence() {
  const lines = [
    "CoNEXUS HANDSHAKE . . .",
    "LINK ESTABLISHED",
    "ARK DESIGNATION: 1047",
    "AWAITING OPERATOR",
  ];
  return (
    <div
      aria-hidden
      style={{
        fontFamily: "monospace",
        fontSize: "11px",
        letterSpacing: "0.2em",
        color: "rgba(0, 255, 255, 0.7)",
        marginBottom: "1.5rem",
        textAlign: "left",
        display: "inline-block",
        lineHeight: 1.8,
      }}
    >
      {lines.map((line, i) => (
        <motion.div
          key={line}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + i * 0.6, duration: 0.3 }}
          style={{ whiteSpace: "pre" }}
        >
          {"> "}
          {line}
        </motion.div>
      ))}
    </div>
  );
}

export default function TitlePage({ onDismiss }: TitlePageProps = {}) {
  const auth = useAuth();
  const { state } = useGame();
  const isAuthenticated = auth.isAuthenticated;
  const hasSave = state.characterCreated && state.phase !== "FIRST_VISIT";

  const theme = useMemo(
    () =>
      resolveTitleTheme({
        isAuthenticated,
        phase: state.phase,
        narrativeAct: state.narrativeAct,
        lightDarkAlignment: state.lightDarkAlignment,
      }),
    [isAuthenticated, state.phase, state.narrativeAct, state.lightDarkAlignment],
  );

  /* ─── audience tags for announcement filtering ─── */
  const audienceTags: AnnouncementAudience[] = useMemo(() => {
    const tags: AnnouncementAudience[] = ["all"];
    if (isAuthenticated) tags.push("authed");
    else tags.push("unauth");
    if (state.narrativeAct >= 3) tags.push("act_ge_3");
    if (state.lightDarkAlignment === "light") tags.push("light_aligned");
    if (state.lightDarkAlignment === "dark") tags.push("dark_aligned");
    return tags;
  }, [isAuthenticated, state.narrativeAct, state.lightDarkAlignment]);

  /* ─── fetch announcements ─── */
  const announcementsQuery = trpc.announcements.listActive.useQuery(
    { audience: audienceTags, includeViews: isAuthenticated },
    { staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false },
  );
  const announcements: AnnouncementRow[] =
    (announcementsQuery.data as AnnouncementRow[] | undefined) ?? [];

  /* ─── local UI state ─── */
  const [showPanel, setShowPanel] = useState(false);
  const [showResetWall, setShowResetWall] = useState(false);
  const [videoPick, setVideoPick] = useState<AnnouncementRow | null>(null);
  const [showLoginStagger, setShowLoginStagger] = useState(false);
  const [thresholdPassed, setThresholdPassed] = useState(false);
  const [glitchText, setGlitchText] = useState(false);
  const [scanlineOffset, setScanlineOffset] = useState(0);

  /* ─── Open music (preserved from existing PR) ─── */
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.35;
    let started = false;
    const tryStart = () => {
      if (started) return;
      const p = audio.play();
      if (p && typeof p.then === "function") {
        p.then(() => { started = true; }).catch(() => { /* retry next gesture */ });
      } else {
        started = true;
      }
    };
    tryStart();
    const onGesture = () => {
      tryStart();
      if (started) {
        window.removeEventListener("pointerdown", onGesture);
        window.removeEventListener("keydown", onGesture);
      }
    };
    window.addEventListener("pointerdown", onGesture);
    window.addEventListener("keydown", onGesture);
    return () => {
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
      audio.pause();
    };
  }, []);

  /* ─── Stagger reveals + threshold gate ─── */
  useEffect(() => {
    const t1 = setTimeout(() => setShowLoginStagger(true), 1200);
    const t2 = setTimeout(() => setThresholdPassed(true), THRESHOLD_MS);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  /* ─── Periodic glitch on title ─── */
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchText(true);
      setTimeout(() => setGlitchText(false), 150);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  /* ─── Slow scanline drift ─── */
  useEffect(() => {
    let raf: number;
    const tick = () => {
      setScanlineOffset(prev => (prev + 0.3) % 100);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ─── First-gesture RECONNECT for State C returning users ─── */
  useEffect(() => {
    if (!thresholdPassed) return;
    if (!isAuthenticated || !hasSave) return;
    if (showResetWall || showPanel || videoPick) return;

    const onGesture = (e: Event) => {
      // Ignore clicks on actual buttons/links — those handle themselves.
      const target = e.target as HTMLElement | null;
      if (target?.closest("button, a, input")) return;
      onDismiss?.();
    };
    // Only attach keydown (Enter/Space); pointerdown would swallow the
    // user's click on the RECONNECT button before it registers.
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      onGesture(e);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [thresholdPassed, isAuthenticated, hasSave, showResetWall, showPanel, videoPick, onDismiss]);

  /* ─── Auto-intercept: pick a video to spontaneously receive ─── */
  const interceptPick = useTransmissionIntercept({
    announcements,
    audienceTags,
    interactionReady: thresholdPassed && !showResetWall && !videoPick,
  });

  // Auto-fire intercept 5s after threshold passes (the "quiet beat"
  // before the teaser appears).
  useEffect(() => {
    if (!interceptPick) return;
    if (videoPick) return;
    const t = setTimeout(() => setVideoPick(interceptPick), 5000);
    return () => clearTimeout(t);
  }, [interceptPick, videoPick]);

  const markViewedMutation = trpc.announcements.markViewed.useMutation();
  const markDismissedMutation = trpc.announcements.markDismissed.useMutation();

  const playVideo = useCallback((a: AnnouncementRow) => {
    setVideoPick(a);
    setShowPanel(false);
    if (isAuthenticated) {
      markViewedMutation.mutate({ announcementId: a.id });
    }
  }, [isAuthenticated, markViewedMutation]);

  const closeVideo = useCallback(() => {
    setVideoPick(null);
  }, []);

  const dismissVideo = useCallback(() => {
    if (videoPick && isAuthenticated) {
      markDismissedMutation.mutate({ announcementId: videoPick.id });
    }
  }, [videoPick, isAuthenticated, markDismissedMutation]);

  /* ─── Identity card fields for State C ─── */
  const lastRoomLabel = (state.currentRoomId ?? "").toUpperCase().replace(/-/g, " ") || "UNKNOWN";
  const lastSessionLabel = useMemo(() => {
    const stamp = Number(localStorage.getItem("loredex_last_login") ?? 0);
    if (!stamp) return "THIS CYCLE";
    const days = Math.floor((Date.now() - stamp) / (1000 * 60 * 60 * 24));
    if (days <= 0) return "THIS CYCLE";
    if (days === 1) return "1 CYCLE AGO";
    return `${days} CYCLES AGO`;
  }, []);
  const actLabel = `ACT ${romanize(state.narrativeAct)}${ACT_TAGLINE[state.narrativeAct] ? ` — ${ACT_TAGLINE[state.narrativeAct]}` : ""}`;

  /* ─── Render ─── */
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: theme.palette.void,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        overflow: "hidden",
        zIndex: 9999,
      }}
    >
      <audio
        ref={audioRef}
        src={OPENING_MUSIC_SRC}
        loop
        preload="auto"
        autoPlay
      />

      {/* F12 hero video — Ark drift loop. When the file is missing the
          <video> just shows its poster (the legacy keyart), so this
          block degrades gracefully. Muted + playsInline + loop satisfies
          mobile autoplay policies. */}
      <video
        src="/videos/title/ark-drift-loop.webm"
        poster="/art/ui/title-bg.png"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.55,
          filter: "brightness(0.65) contrast(1.05)",
          zIndex: 0,
        }}
      >
        <source src="/videos/title/ark-drift-loop.webm" type="video/webm" />
        <source src="/videos/title/ark-drift-loop.mp4" type="video/mp4" />
      </video>

      {/* F12 parallax far nebula — slow horizontal drift via scanline RAF
          so we don't spawn a second tick loop. Amplitude clamped low
          (~6px) per deliverables spec. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: "-3% -6%",
          backgroundImage: "url(/art/ui/title/nebula-far.png)",
          backgroundSize: "cover",
          backgroundPosition: `${50 + Math.sin(scanlineOffset / 30) * 0.6}% center`,
          opacity: 0.35,
          pointerEvents: "none",
          zIndex: 0,
          mixBlendMode: "screen",
        }}
      />

      {/* F12 parallax mid Ark silhouette — wider amplitude, still subtle. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: "-2% -4%",
          backgroundImage: "url(/art/ui/title/ark-mid.png)",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: `${50 + Math.sin(scanlineOffset / 22) * 1.2}% center`,
          opacity: 0.5,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Background keyart — falls back to the legacy title-bg.png
         if the theme-specific art isn't on disk yet. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${theme.artUrl}), url(/art/ui/title-bg.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.45,
          filter: "brightness(0.7) contrast(1.1)",
        }}
      />

      {/* Scanlines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            ${toRgba(theme.palette.accent, 0.015)} 2px,
            ${toRgba(theme.palette.accent, 0.015)} 4px
          )`,
          backgroundPosition: `0 ${scanlineOffset}px`,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 50%, ${theme.palette.void}cc 100%)`,
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Logo + state body */}
      <div style={{ position: "relative", zIndex: 3, textAlign: "center", padding: "2rem", maxWidth: "min(900px, 94vw)", marginLeft: "auto", marginRight: "auto" }}>
        <img
          src="/art/logos/dischordian-saga.png"
          alt=""
          style={{
            display: "block",
            maxWidth: "min(340px, 70vw)",
            width: "auto",
            height: "auto",
            margin: "0 auto 0.5rem",
            filter: `drop-shadow(0 0 30px ${toRgba(theme.palette.accent, 0.35)})`,
          }}
        />
        {/* F12 — redundant title stack removed. The logo image (above)
            already carries "THE DISCHORDIAN SAGA"; showing it twice in
            large text was menu-flavored rather than legend-flavored.
            The space below the logo is now used for the diegetic boot
            sequence + the unauth CTA. */}

        {/* Diegetic boot sequence (F12). Types on over ~3s. The
            "ARK DESIGNATION: 1047" line is an intentional easter egg
            that primes the Bridge puzzle for attentive players. */}
        <DiegeticBootSequence />

        {/* Body — one of three states */}
        {!isAuthenticated && (
          <TitleStateUnauth
            theme={theme}
            showLogin={showLoginStagger}
            onAuthSuccess={auth.refresh}
          />
        )}
        {isAuthenticated && !hasSave && (
          <TitleStateNoSave
            theme={theme}
            displayName={auth.user?.name ?? ""}
            neuralSignature={neuralSignature(auth.user?.id ?? auth.user?.openId)}
            onBeginNewGame={() => onDismiss?.()}
          />
        )}
        {isAuthenticated && hasSave && (
          <TitleStateReturning
            theme={theme}
            displayName={state.characterChoices.name || auth.user?.name || "OPERATOR"}
            lastRoomLabel={lastRoomLabel}
            lastSessionLabel={lastSessionLabel}
            actLabel={actLabel}
            onReconnect={() => onDismiss?.()}
            onResetRequested={() => setShowResetWall(true)}
          />
        )}

        {/* Broadcast chip — only shown past threshold so it doesn't
           distract from the cinematic opening beat. */}
        {thresholdPassed && announcements.length > 0 && (
          <button
            type="button"
            onClick={() => setShowPanel(true)}
            style={{
              marginTop: "1.5rem",
              padding: "0.45rem 1rem",
              background: "transparent",
              border: `1px solid ${theme.palette.accent}55`,
              borderRadius: "3px",
              color: theme.palette.accent,
              fontSize: "0.6rem",
              letterSpacing: "0.22em",
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            📡 BROADCASTS ({announcements.length})
          </button>
        )}
      </div>

      {/* Ticker */}
      <BroadcastTicker announcements={announcements} accentColor={theme.palette.accent} />

      {/* Broadcast panel */}
      <BroadcastPanel
        open={showPanel}
        announcements={announcements}
        accentColor={theme.palette.accent}
        onClose={() => setShowPanel(false)}
        onPlayVideo={playVideo}
      />

      {/* Video transmission player (manual + auto-intercept) */}
      {videoPick && (
        <VideoTransmissionPlayer
          announcement={videoPick}
          onClose={closeVideo}
          onDismiss={dismissVideo}
          playTeaser={interceptPick?.id === videoPick.id}
        />
      )}

      {/* Reset wall */}
      {showResetWall && (
        <ResetWall
          onAbort={() => setShowResetWall(false)}
          onDone={() => {
            setShowResetWall(false);
            // After wipe, state flips to FIRST_VISIT → State B renders.
          }}
        />
      )}
    </div>
  );
}

const ACT_TAGLINE: Record<number, string> = {
  0: "PRELUDE",
  1: "THE TWELVE STEPS",
  2: "THE ENGINEER'S BENCH",
  3: "EYES IN THE DARK",
  4: "THE PRISONER",
  5: "THE RECKONING",
  6: "THE HIDDEN LEDGER",
  7: "THE RECKONING'S END",
};

function romanize(n: number): string {
  if (n <= 0) return "0";
  const R: [number, string][] = [
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let out = "";
  for (const [v, s] of R) { while (n >= v) { out += s; n -= v; } }
  return out;
}

function neuralSignature(seed: number | string | undefined): string {
  if (seed == null) return "████████████";
  const s = String(seed);
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  return hash.toString(16).padStart(12, "0").slice(0, 12).toUpperCase();
}

function toRgba(hex: string, alpha: number): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
