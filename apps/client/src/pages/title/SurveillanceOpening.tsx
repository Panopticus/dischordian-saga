/* ═══════════════════════════════════════════════════════
   SURVEILLANCE OPENING — One-time pre-title handshake.

   First visit only (gated by localStorage). The page reads
   four pieces of locally-available browser state — UA family,
   locale, IANA time zone, system clock — and types them back
   at the user as if Loredex OS just fingerprinted them.

   No data leaves the client. Every value shown is one any
   website can read by default; the unsettling beat comes
   from accuracy (it really is *your* timezone, *your* clock)
   not from VFX. Privacy-by-design: no IP, no geolocation,
   no fingerprinting library, no network request.

   Stages:
     1. "gate"     — CONFIRM OPERATOR / LOOK AWAY buttons
     2. "scanning" — jagged-cadence reveal of fingerprint lines
     3. "done"     — 250ms snap-shut flash, then onComplete()

   Reduce-motion and the SKIP button both fast-forward to
   `done` immediately. The "seen" flag is written on either
   completion path so the scene plays at most once.
   ═══════════════════════════════════════════════════════ */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import GlitchFx from "@/components/GlitchFx";
import KineticText from "@/components/void/KineticText";

const SEEN_KEY = "dischordia_handshake_seen";
/** Vote #0 — the player's surveillance-gate answer, persisted
 *  pre-authentication. Synced to the server on first authenticated
 *  session by the governance hub via `architectConsole.recordVoteZero`.
 *  Storage shape: `"confirmed"` | `"looked_away"`. */
export const VOTE_ZERO_KEY = "dischordia_vote_zero";

/** Write the Vote #0 answer to localStorage. Tolerant of storage
 *  errors (e.g. private browsing) — the gate still completes, we
 *  just lose the deferred sync. */
function persistVoteZero(answer: "confirmed" | "looked_away"): void {
  try {
    localStorage.setItem(VOTE_ZERO_KEY, answer);
  } catch {
    /* storage blocked — accept the loss */
  }
}

interface SurveillanceOpeningProps {
  onComplete: () => void;
  /** Fires the moment the operator picks CONFIRM OPERATOR. Lets the
   *  parent arm the meme cinematic concurrently so the scanning beat
   *  animates on top of the already-playing video instead of being a
   *  blank wait. The Look-Away path does NOT call this — that branch
   *  shows the punitive flash first, then completes. */
  onConfirm?: () => void;
  /** Fires synchronously inside the click handler of EITHER the
   *  CONFIRM OPERATOR or LOOK AWAY button — i.e. the moment the
   *  player commits to entering the opening. The parent uses this
   *  to start media that requires a fresh user activation (iOS
   *  Safari rejects programmatic `audio.play()` outside one), like
   *  pre-rolling The Enigma's Lament muted under the meme video. */
  onArm?: () => void;
  /** Force-show even if previously dismissed. Wired to a future
   *  Architect's Console toggle; defaults off in production. */
  force?: boolean;
  /** Drop the root radial-gradient background so the handshake can
   *  overlay another full-screen surface (e.g. the opening cinematic
   *  video) running behind it. Defaults to false (solid bg). */
  transparent?: boolean;
}

interface Fingerprint {
  uaFamily: string;
  locale: string;
  timezone: string;
  clock: string;
}

function readFingerprint(): Fingerprint {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  // Coarse UA family — we deliberately avoid a fingerprinting library;
  // the dramatic value is "we know what browser you used", not "we
  // know your exact build". Order matters: Edge before Chrome, etc.
  const uaFamily =
    /Edg\//.test(ua) ? "EDGE"
      : /OPR\//.test(ua) ? "OPERA"
        : /Firefox\//.test(ua) ? "FIREFOX"
          : /Chrome\//.test(ua) ? "CHROME"
            : /Safari\//.test(ua) ? "SAFARI"
              : "UNKNOWN";
  const platform =
    /iPhone|iPad|iPod/.test(ua) ? "iOS"
      : /Android/.test(ua) ? "ANDROID"
        : /Mac OS X/.test(ua) ? "MACOS"
          : /Windows/.test(ua) ? "WINDOWS"
            : /Linux/.test(ua) ? "LINUX"
              : "UNKNOWN";
  const locale = (typeof navigator !== "undefined" && navigator.language) || "und-Zzzz";
  let timezone = "Etc/Unknown";
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz) timezone = tz;
  } catch { /* fallback already set */ }
  const now = new Date();
  const clock = now.toISOString().replace("T", " ").slice(0, 19) + "Z";
  return {
    uaFamily: `${uaFamily} / ${platform}`,
    locale,
    timezone,
    clock,
  };
}

type Stage = "gate" | "scanning" | "shamed" | "done";

/** Shame beat shown after LOOK AWAY: a punitive red flash before the
 *  meme transmission takes over. Long enough to read; short enough not
 *  to feel like a loading screen. */
const SHAMED_HOLD_MS = 800;

/**
 * Each line is rendered with KineticText decode so glyphs scramble
 * into place — the same treatment used by the main boot sequence so
 * the handshake feels diegetically continuous.
 */
interface ScanLine {
  label: string;
  value: string;
}

function buildLines(fp: Fingerprint): ScanLine[] {
  return [
    { label: "ESTABLISHING UPLINK", value: "OK" },
    { label: "OPERATOR AGENT", value: fp.uaFamily },
    { label: "LOCALE", value: fp.locale.toUpperCase() },
    { label: "CHRONOSPHERE", value: fp.timezone },
    { label: "SYSTEM CLOCK", value: fp.clock },
    { label: "ARK DESIGNATION", value: "1047" },
    { label: "VPN TRACE SIGNATURE", value: "DETECTED — ADJUSTED" },
    { label: "FINGERPRINT", value: "LOCKED" },
  ];
}

export function SurveillanceOpening({
  onComplete,
  onConfirm,
  onArm,
  force = false,
  transparent = false,
}: SurveillanceOpeningProps) {
  const [stage, setStage] = useState<Stage>(() => {
    if (force) return "gate";
    try {
      if (localStorage.getItem(SEEN_KEY) === "1") return "done";
    } catch { /* storage blocked — show it */ }
    return "gate";
  });
  const [revealed, setRevealed] = useState(0);
  // One-shot "snap shut" frame on completion: LED flashes white,
  // scanline accelerates, an inverse-color overlay flashes for ~250ms.
  const [snapping, setSnapping] = useState(false);
  const completedRef = useRef(false);

  const fingerprint = useMemo(() => readFingerprint(), []);
  const lines = useMemo(() => buildLines(fingerprint), [fingerprint]);

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    try { localStorage.setItem(SEEN_KEY, "1"); } catch { /* ignore */ }
    setSnapping(true);
    // Snap-shut beat: brief inverse flash + LED white-out before the title
    // flow takes over. Tight enough that the whole handshake reads as a
    // single rapid scan, not a loading screen.
    setTimeout(() => {
      setStage("done");
      onComplete();
    }, 40);
  }, [onComplete]);

  // If we were already-seen on mount, hand control back immediately.
  useEffect(() => {
    if (stage === "done" && !completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  }, [stage, onComplete]);

  // LOOK AWAY drops the operator into a brief punitive flash before the
  // meme transmission takes over. The hold is just long enough to read
  // the line; finish() then plays the cinematic.
  useEffect(() => {
    if (stage !== "shamed") return;
    const t = setTimeout(finish, SHAMED_HOLD_MS);
    return () => clearTimeout(t);
  }, [stage, finish]);

  // Drive the scanning reveal on a jagged cadence — snappy at the top,
  // with just enough late-line drag to land FINGERPRINT as a punch.
  // The whole sequence wraps in ~60ms so the player never perceives it
  // as a loading screen. Reduce-motion collapses to a tick.
  const CADENCE = [3, 4, 4, 5, 7, 9, 12, 16];
  useEffect(() => {
    if (stage !== "scanning") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setRevealed(lines.length);
      const t = setTimeout(finish, 40);
      return () => clearTimeout(t);
    }
    if (revealed >= lines.length) {
      const t = setTimeout(finish, 40);
      return () => clearTimeout(t);
    }
    const delay = CADENCE[Math.min(revealed, CADENCE.length - 1)];
    const t = setTimeout(() => setRevealed(n => n + 1), delay);
    return () => clearTimeout(t);
  }, [stage, revealed, lines.length, finish]);

  if (stage === "done") return null;

  return (
    <div
      role="dialog"
      aria-label="Operator handshake"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        // Near-black with a faint cyan vignette so the readouts feel
        // isolated "inside a screen". Snap-shut tints red. In
        // transparent mode (overlaying a video) we render no bg so
        // the surface beneath (the cinematic) shows through.
        background: transparent
          ? snapping
            ? "rgba(42, 0, 4, 0.45)"
            : stage === "shamed"
              ? "radial-gradient(circle at 50% 50%, rgba(42,0,4,0.55) 0%, rgba(8,0,2,0.78) 70%)"
              : "transparent"
          : snapping
            ? "radial-gradient(circle at 50% 50%, #2a0004 0%, #0a0004 70%)"
            : stage === "shamed"
              ? "radial-gradient(circle at 50% 50%, #2a0004 0%, #0a0004 70%)"
              : "radial-gradient(circle at 50% 50%, #061018 0%, #02000A 70%)",
        color: "#33E2E6",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        overflow: "hidden",
        transition: "background 180ms ease-out",
      }}
    >
      {/* Webcam-LED tell — small red dot in the upper-right that
          pulses faster once scanning starts, and white-flashes for
          the snap-shut frame. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "1.25rem",
          right: "1.25rem",
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: snapping ? "#FFFFFF" : "#FF3C40",
          boxShadow: snapping
            ? "0 0 28px rgba(255,255,255,0.95)"
            : "0 0 12px rgba(255,60,64,0.85)",
          animation: snapping
            ? "none"
            : stage === "scanning"
              ? "surv-led 0.8s steps(2) infinite"
              : "surv-led 2.2s steps(2) infinite",
        }}
      />

      {/* Drifting scan line — accelerates on snap-shut. */}
      {stage === "scanning" && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage:
              "linear-gradient(to bottom, transparent 0%, rgba(51,226,230,0.18) 49%, rgba(51,226,230,0.4) 50%, rgba(51,226,230,0.18) 51%, transparent 100%)",
            backgroundSize: "100% 12px",
            backgroundRepeat: "no-repeat",
            animation: snapping
              ? "surv-scan 0.6s linear infinite"
              : "surv-scan 2.4s linear infinite",
            mixBlendMode: "screen",
          }}
        />
      )}

      {/* Snap-shut inverse flash — ~250ms hot frame on completion. */}
      {snapping && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: "rgba(255,255,255,0.18)",
            mixBlendMode: "difference",
            animation: "surv-flash 150ms steps(3) forwards",
          }}
        />
      )}

      {/* Static + scanlines behind everything. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(51,226,230,0.03) 2px, rgba(51,226,230,0.03) 4px)",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: "min(640px, 92vw)",
          width: "100%",
          textAlign: "left",
        }}
      >
        {stage === "gate" && (
          <GateView
            onInitiate={() => {
              // FIRST: fire onArm synchronously so the parent can start
              // any user-activation-locked media (audio pre-roll on iOS
              // Safari) before the React re-render. Order matters —
              // anything async-y after this can break the activation.
              onArm?.();
              // Persist the player's Vote #0 answer to localStorage so
              // the governance hub can sync it on the first
              // authenticated session.
              persistVoteZero("confirmed");
              // Arm the meme cinematic immediately so its audio + video
              // start buffering/playing while the scan animation runs
              // on top — the operator never sees a wait beat.
              onConfirm?.();
              setStage("scanning");
              setRevealed(0);
            }}
            onSkip={() => {
              // LOOK AWAY also commits the player to the opening; arm
              // the same media here so the punitive shame beat doesn't
              // burn the activation window.
              onArm?.();
              persistVoteZero("looked_away");
              setStage("shamed");
            }}
          />
        )}

        {stage === "scanning" && (
          <ScanView lines={lines} revealed={revealed} />
        )}

        {stage === "shamed" && <ShamedView />}
      </div>

      <style>{`
        @keyframes surv-led {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0.25; }
        }
        @keyframes surv-scan {
          0%   { background-position: 0 -10%; }
          100% { background-position: 0 110%; }
        }
        @keyframes surv-flash {
          0%   { opacity: 0.95; }
          50%  { opacity: 0.4; }
          100% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          [aria-label="Operator handshake"] * {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

function GateView({ onInitiate, onSkip }: { onInitiate: () => void; onSkip: () => void }) {
  return (
    <div>
      <div
        style={{
          fontSize: "0.65rem",
          letterSpacing: "0.32em",
          opacity: 0.6,
          marginBottom: "0.75rem",
        }}
      >
        &gt; DISCHORDIA // INBOUND // DO NOT MOVE
      </div>
      <h2
        style={{
          margin: 0,
          fontSize: "clamp(1.6rem, 4.5vw, 2.4rem)",
          letterSpacing: "0.18em",
          fontWeight: 700,
          textTransform: "uppercase",
        }}
      >
        Hold Still. We Already See You.
      </h2>
      <p
        style={{
          marginTop: "1rem",
          marginBottom: "1.75rem",
          fontSize: "0.78rem",
          letterSpacing: "0.06em",
          lineHeight: 1.6,
          color: "rgba(51,226,230,0.75)",
          maxWidth: "52ch",
        }}
      >
        Do not look away. Confirm operator and we will leave the rest.
      </p>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={onInitiate}
          autoFocus
          style={{
            background: "transparent",
            border: "1px solid #33E2E6",
            color: "#33E2E6",
            padding: "0.65rem 1.5rem",
            fontSize: "0.7rem",
            letterSpacing: "0.28em",
            fontFamily: "inherit",
            cursor: "pointer",
            textTransform: "uppercase",
            boxShadow: "0 0 18px rgba(51,226,230,0.25)",
          }}
        >
          ▶ Confirm Operator
        </button>
        <button
          type="button"
          onClick={onSkip}
          style={{
            background: "transparent",
            border: "1px solid rgba(255,60,64,0.35)",
            color: "rgba(255,60,64,0.7)",
            padding: "0.65rem 1.5rem",
            fontSize: "0.7rem",
            letterSpacing: "0.28em",
            fontFamily: "inherit",
            cursor: "pointer",
            textTransform: "uppercase",
          }}
        >
          Look Away
        </button>
      </div>
    </div>
  );
}

/** Punitive flash shown after LOOK AWAY. Red, centered, glitchy — held
 *  for SHAMED_HOLD_MS before the parent unmounts the surveillance and
 *  the meme cinematic takes over. */
function ShamedView() {
  return (
    <div
      role="alert"
      style={{
        textAlign: "center",
        padding: "1rem 0",
      }}
    >
      <div
        style={{
          fontSize: "0.65rem",
          letterSpacing: "0.32em",
          opacity: 0.75,
          marginBottom: "1rem",
          color: "rgba(255,60,64,0.85)",
        }}
      >
        &gt; OPERATOR DISSENT // LOGGED
      </div>
      <GlitchFx variant="chroma" intensity={0.7}>
        <div
          style={{
            fontSize: "clamp(1.3rem, 4vw, 2rem)",
            letterSpacing: "0.18em",
            fontWeight: 700,
            textTransform: "uppercase",
            color: "#FF3C40",
            textShadow:
              "0 0 18px rgba(255,60,64,0.85), 0 0 36px rgba(255,60,64,0.45)",
            lineHeight: 1.25,
          }}
        >
          We see all.<br />
          Your resistance has been<br />
          notated in your file.
        </div>
      </GlitchFx>
    </div>
  );
}

function ScanView({ lines, revealed }: { lines: ScanLine[]; revealed: number }) {
  return (
    <div>
      <div
        style={{
          fontSize: "0.65rem",
          letterSpacing: "0.32em",
          opacity: 0.6,
          marginBottom: "1rem",
        }}
      >
        &gt; SCANNING OPERATOR FINGERPRINT
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
        {lines.slice(0, revealed).map((line, i) => {
          const isFinal = line.label === "FINGERPRINT";
          // The last two lines glitch on reveal — RGB chroma split for
          // a half-second so the late readouts feel intrusive.
          const shouldGlitch = i >= lines.length - 2;
          const valueNode = (
            <KineticText
              key={`${line.label}-${i}`}
              text={line.value}
              mode="decode"
              speed={2}
              showCursor={false}
            />
          );
          return (
            <div
              key={line.label}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "0.75rem",
                fontSize: isFinal ? "0.95rem" : "0.78rem",
                letterSpacing: "0.14em",
                color: isFinal ? "#FF3C40" : "#33E2E6",
                textShadow: isFinal
                  ? "0 0 18px rgba(255,60,64,0.85), 0 0 36px rgba(255,60,64,0.45)"
                  : "none",
              }}
            >
              <span style={{ opacity: 0.55, minWidth: "18ch" }}>
                &gt; {line.label}
              </span>
              <span style={{ opacity: 0.95 }}>
                {shouldGlitch ? (
                  <GlitchFx variant="chroma">{valueNode}</GlitchFx>
                ) : (
                  valueNode
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
