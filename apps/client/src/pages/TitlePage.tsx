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
import { useSagaThemeBGM } from "@/contexts/SagaThemeBGMContext";
import { trpc } from "@/lib/trpc";
import GlitchFx from "@/components/GlitchFx";
import KineticText from "@/components/void/KineticText";

import { BroadcastPanel } from "./title/BroadcastPanel";
import { BroadcastTicker } from "./title/BroadcastTicker";
import { ResetWall } from "./title/ResetWall";
import { SurveillanceOpening } from "./title/SurveillanceOpening";
import { TitleStateNoSave } from "./title/TitleStateNoSave";
import { TitleStateReturning } from "./title/TitleStateReturning";
import { TitleStateUnauth } from "./title/TitleStateUnauth";
import { VideoTransmissionPlayer } from "./title/VideoTransmissionPlayer";
import { resolveTitleTheme } from "./title/themes";
import type { AnnouncementAudience, AnnouncementRow } from "./title/types";
import { useTransmissionIntercept } from "./title/useTransmissionIntercept";

import { assetUrl } from "@/lib/assetUrl";
const OPENING_MUSIC_SRC = assetUrl("audio/music/main-menu/the-enigmas-lament.mp3");
const THRESHOLD_MS = 1500;

/**
 * Featured transmissions pinned to the title screen.
 *
 * Add an entry per video. Each row becomes available to the broadcast
 * panel and feeds the auto-intercept pool — the existing intercept
 * hook already prefers `priority: "high"` and rolls against
 * `triggerProbability`, so the highest-priority entry plays first;
 * ties resolve by newest `publishedAt`. Once-per-session is enforced
 * by sessionStorage in useTransmissionIntercept.
 *
 * `videoUrl` accepts either a YouTube watch/embed/youtu.be URL (the
 * player auto-detects and renders an iframe) or a direct mp4/webm URL
 * (rendered via the native <video> path with the VHS chroma filter).
 * Self-hosted videos live under cdn/client-public/videos/title/music/
 * and resolve through assetUrl() like every other media asset.
 *
 * Sentinel ids start at 999_001 so the markViewed/markDismissed
 * mutations can short-circuit — these rows have no DB backing and
 * would orphan in `announcement_views`.
 */
const FEATURED_ID_BASE = 999_001;

interface FeatureSpec {
  slug: string;
  title: string;
  body: string;
  filename: string;
  publishedAt: string;
  /** When true the entry joins the auto-intercept pool. Exactly one
   *  high-priority `triggerOnTitle` row plays per session (sessionStorage
   *  guard); the rest sit in the broadcast panel for manual play. */
  trigger?: boolean;
}

/**
 * Edit this list to add or reorder featured videos. Filenames are the
 * leaf under `cdn/client-public/videos/title/music/`. Bodies are
 * placeholder copy — refine in-place; no DB migration required.
 */
const FEATURE_SPECS: FeatureSpec[] = [
  {
    slug: "the-book-of-daniel",
    title: "THE BOOK OF DANIEL 2:47",
    body: "Malkia Ukweli & the Panopticon — official music video. Age of Revelation.",
    filename: "the-book-of-daniel.mp4",
    publishedAt: "2025-01-01T00:00:00Z",
    trigger: true,
  },
  {
    slug: "building-the-architect",
    title: "BUILDING THE ARCHITECT",
    body: "Malkia Ukweli & the Panopticon — official video. The Architect, observed.",
    filename: "building-the-architect.mp4",
    publishedAt: "2025-02-01T00:00:00Z",
  },
  {
    slug: "hypnotized",
    title: "HYPNOTIZED",
    body: "Official music video — mass-comfort doctrine on the open channel.",
    filename: "hypnotized.mp4",
    publishedAt: "2025-03-01T00:00:00Z",
  },
  {
    slug: "brushstroke-of-the-empire",
    title: "BRUSHSTROKE OF THE EMPIRE",
    body: "CoNexus original — visual essay on empire and erasure.",
    filename: "brushstroke-of-the-empire.mp4",
    publishedAt: "2025-04-01T00:00:00Z",
  },
  {
    slug: "baron-heart-of-time",
    title: "BARON & THE HEART OF TIME",
    body: "Archival footage — story arc S2.13. Baron meets the timeline.",
    filename: "baron-heart-of-time.mp4",
    publishedAt: "2025-05-01T00:00:00Z",
  },
  {
    slug: "the-last-christmas",
    title: "THE LAST CHRISTMAS",
    body: "Archival broadcast — final transmission of the old calendar.",
    filename: "the-last-christmas.mp4",
    publishedAt: "2025-06-01T00:00:00Z",
  },
];

const FEATURED_TRANSMISSIONS: AnnouncementRow[] = FEATURE_SPECS.map((spec, i) => ({
  id: FEATURED_ID_BASE + i,
  slug: spec.slug,
  category: "transmission_incoming",
  priority: spec.trigger ? "high" : "normal",
  title: spec.title,
  body: spec.body,
  artUrl: null,
  linkUrl: null,
  videoUrl: assetUrl(`videos/title/music/${spec.filename}`),
  videoPosterUrl: null,
  videoDurationSec: null,
  triggerOnTitle: spec.trigger ?? false,
  triggerProbability: 100,
  audience: "all",
  publishedAt: new Date(spec.publishedAt),
  expiresAt: null,
  firstSeenAt: null,
  dismissedAt: null,
}));
const isLocalAnnouncement = (id: number) => id >= FEATURED_ID_BASE;

interface TitlePageProps {
  /** Optional dismiss hook from TitleGate. If absent, the page
   *  renders the classic unauth-only flow (back-compat). */
  onDismiss?: () => void;
}

/**
 * Diegetic boot overlay. Renders in the logo/CTA column as a top-left
 * HUD block that types on a short handshake narrative. The designation
 * line uses KineticText decode so each glyph scrambles before resolving,
 * matching the Loredex OS "incoming signal" feel.
 *
 * Boot is skippable once the player has opened the title before
 * (`titleBootSeen` in localStorage). Pass `skipAnimation` from the
 * parent to force-finish — useful for returning sessions where the
 * player has already seen the handshake dozens of times.
 *
 * Respects prefers-reduced-motion via the KineticText hook; non-decode
 * lines fall back to an instant reveal.
 */
function DiegeticBootSequence({ skipAnimation = false }: { skipAnimation?: boolean }) {
  const lines = [
    "CoNEXUS HANDSHAKE",
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
      {lines.map((line, i) => {
        const delay = skipAnimation ? 0 : 0.5 + i * 0.6;
        // The designation line gets the scramble-to-resolve treatment —
        // it's the one "reveal" beat that earns the extra production value.
        const isDecode = line.startsWith("ARK DESIGNATION");
        return (
          <motion.div
            key={line}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: skipAnimation ? 0 : 0.3 }}
            style={{ whiteSpace: "pre" }}
          >
            {"> "}
            {isDecode && !skipAnimation ? (
              <KineticText
                text={line}
                mode="decode"
                speed={55}
                showCursor={false}
                style={{ color: "rgba(51, 226, 230, 0.95)" }}
              />
            ) : (
              line
            )}
          </motion.div>
        );
      })}
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
  const announcements: AnnouncementRow[] = useMemo(() => {
    const remote = (announcementsQuery.data as AnnouncementRow[] | undefined) ?? [];
    // Drop any DB row whose slug collides with a pinned feature so the
    // local copy always wins (lets us update copy without a migration).
    const featuredSlugs = new Set(FEATURED_TRANSMISSIONS.map(a => a.slug));
    const filtered = remote.filter(a => !featuredSlugs.has(a.slug));
    return [...FEATURED_TRANSMISSIONS, ...filtered];
  }, [announcementsQuery.data]);

  /* ─── local UI state ─── */
  const [showPanel, setShowPanel] = useState(false);
  const [showResetWall, setShowResetWall] = useState(false);
  const [videoPick, setVideoPick] = useState<AnnouncementRow | null>(null);
  const [showLoginStagger, setShowLoginStagger] = useState(false);
  const [thresholdPassed, setThresholdPassed] = useState(false);
  const [glitchText, setGlitchText] = useState(false);
  const [scanlineOffset, setScanlineOffset] = useState(0);
  // The handshake plays once per device. Reading the flag synchronously
  // here avoids a flash of the title behind the scene.
  const [handshakeDone, setHandshakeDone] = useState<boolean>(() => {
    try { return localStorage.getItem("dischordia_handshake_seen") === "1"; }
    catch { return true; }
  });

  /* ─── Solo the Enigma's Lament on the title screen.
       The SagaThemeBGM provider auto-starts a shuffled saga theme on
       the user's first interaction; on the title that bleeds under
       the Lament. Suppress while mounted, restore on unmount. ─── */
  const sagaBGM = useSagaThemeBGM();
  useEffect(() => {
    sagaBGM.suppress();
    return () => sagaBGM.unsuppress();
  }, [sagaBGM]);

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

  // Skip the boot-sequence typewriter for players who've been here
  // before. The first time through, we want the full 3s of ceremony;
  // every time after that, dropping the operator straight into the
  // CTA is what AAA titles do ("press any button to continue" beat).
  const [hasSeenBoot] = useState(() => {
    try {
      return localStorage.getItem("titleBootSeen") === "1";
    } catch {
      return false;
    }
  });

  /* ─── Stagger reveals + threshold gate ─── */
  useEffect(() => {
    const bootDelay = hasSeenBoot ? 250 : 1200;
    const thresholdDelay = hasSeenBoot ? 400 : THRESHOLD_MS;
    const t1 = setTimeout(() => setShowLoginStagger(true), bootDelay);
    const t2 = setTimeout(() => setThresholdPassed(true), thresholdDelay);
    // Persist the flag on first successful mount so next time we
    // collapse the whole ceremony.
    try {
      localStorage.setItem("titleBootSeen", "1");
    } catch {
      /* storage blocked — fine, we just ceremony every time */
    }
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [hasSeenBoot]);

  /* ─── Periodic glitch on title.
       For the first 4s after the handshake snaps shut, double the
       cadence (~1.2-2.0s) so the title looks rattled by what just
       happened, then settle to the normal 4-7s rhythm. ─── */
  const [rattled, setRattled] = useState(false);
  useEffect(() => {
    if (!handshakeDone) return;
    setRattled(true);
    const t = setTimeout(() => setRattled(false), 4000);
    return () => clearTimeout(t);
  }, [handshakeDone]);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      setGlitchText(true);
      setTimeout(() => setGlitchText(false), 150);
      const base = rattled ? 1200 : 4000;
      const jitter = rattled ? 800 : 3000;
      timer = setTimeout(tick, base + Math.random() * jitter);
    };
    timer = setTimeout(tick, rattled ? 200 : 4000 + Math.random() * 3000);
    return () => clearTimeout(timer);
  }, [rattled]);

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

  /* ─── Auto-intercept: pick a video to spontaneously receive.
       Returning accounts only — first-time visitors get a quiet title
       so the opening doesn't dogpile a broadcast on top of the
       handshake + character creation pitch. ─── */
  const interceptPick = useTransmissionIntercept({
    announcements,
    audienceTags,
    interactionReady: thresholdPassed && handshakeDone && hasSave && !showResetWall && !videoPick,
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
    if (isAuthenticated && !isLocalAnnouncement(a.id)) {
      markViewedMutation.mutate({ announcementId: a.id });
    }
  }, [isAuthenticated, markViewedMutation]);

  const closeVideo = useCallback(() => {
    setVideoPick(null);
  }, []);

  const dismissVideo = useCallback(() => {
    if (videoPick && isAuthenticated && !isLocalAnnouncement(videoPick.id)) {
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
        src={assetUrl("videos/title/ark-drift-loop.webm")}
        poster={assetUrl("art/ui/title-bg.png")}
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
        <source src={assetUrl("videos/title/ark-drift-loop.webm")} type="video/webm" />
        <source src={assetUrl("videos/title/ark-drift-loop.mp4")} type="video/mp4" />
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
        {/* Wordmark. The legacy raster logo read THE DISCHORDIAN SAGA;
            we render the new name as type so it can theme-tint, audio-
            react, and resize without an art pass. GlitchFx chroma is
            inline-block so the parent's textAlign:center centers the
            whole optical mass — including the chroma split. */}
        <GlitchFx
          variant="chroma"
          intensity={0.45}
          audioReactive
          style={{ display: "inline-block", marginBottom: "0.75rem" }}
        >
          <h1
            style={{
              margin: 0,
              fontFamily: "inherit",
              fontSize: "clamp(2.5rem, 9vw, 5.5rem)",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: theme.palette.accent,
              // GlitchFx applies text-shadow (RGB chroma split) on the
              // wrapping span; we use filter:drop-shadow here so the
              // audio-reactive accent glow stacks instead of clobbering
              // the chroma. Inline `textShadow` would override.
              filter: `drop-shadow(0 0 calc(20px + var(--audio-bass, 0) * 28px) ${toRgba(theme.palette.accent, 0.5)})`,
              transition: "filter 60ms linear",
              lineHeight: 1,
            }}
          >
            Dischordia
          </h1>
        </GlitchFx>

        {/* Diegetic boot sequence. Types on over ~3s the first time;
            collapses to an instant reveal on return sessions so veterans
            don't sit through the handshake every time they open the app.
            The "ARK DESIGNATION: 1047" line is an intentional easter egg
            that primes the Bridge puzzle for attentive players, and now
            gets the KineticText scramble-to-resolve treatment. */}
        <DiegeticBootSequence skipAnimation={hasSeenBoot} />

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

        {/* Broadcast chip — returning accounts only, past the threshold
           beat. First-time visitors get a clean title so the opening
           focuses on the handshake → new-game CTA. */}
        {thresholdPassed && hasSave && announcements.length > 0 && (
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

      {/* Ticker — returning accounts only. Keeps the first-time title
          quiet so new players aren't fighting a scrolling banner while
          they're trying to find the new-game CTA. */}
      {hasSave && (
        <BroadcastTicker announcements={announcements} accentColor={theme.palette.accent} />
      )}

      {/* Broadcast panel — only mounted when a returning account opened
          the chip; without `hasSave` the chip never renders. */}
      {hasSave && (
        <BroadcastPanel
          open={showPanel}
          announcements={announcements}
          accentColor={theme.palette.accent}
          onClose={() => setShowPanel(false)}
          onPlayVideo={playVideo}
        />
      )}

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

      {/* Surveillance handshake — first-visit-only. Mounted last so its
          z-index 10000 frame sits above every other title overlay,
          including the broadcast panel and any auto-intercepted video.
          Once the user finishes (or skips) the local-storage flag is
          set; subsequent visits render the title flow directly. */}
      {!handshakeDone && (
        <SurveillanceOpening onComplete={() => setHandshakeDone(true)} />
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
