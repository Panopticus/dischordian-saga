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
     1. "gate"     — INITIATE / SKIP buttons
     2. "scanning" — typewriter reveal of fingerprint lines
     3. "done"     — 600ms pause, then onComplete()

   Reduce-motion and the SKIP button both fast-forward to
   `done` immediately. The "seen" flag is written on either
   completion path so the scene plays at most once.
   ═══════════════════════════════════════════════════════ */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import KineticText from "@/components/void/KineticText";

const SEEN_KEY = "dischordia_handshake_seen";

interface SurveillanceOpeningProps {
  onComplete: () => void;
  /** Force-show even if previously dismissed. Wired to a future
   *  Architect's Console toggle; defaults off in production. */
  force?: boolean;
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

type Stage = "gate" | "scanning" | "done";

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
    { label: "FINGERPRINT", value: "ACQUIRED" },
  ];
}

export function SurveillanceOpening({ onComplete, force = false }: SurveillanceOpeningProps) {
  const [stage, setStage] = useState<Stage>(() => {
    if (force) return "gate";
    try {
      if (localStorage.getItem(SEEN_KEY) === "1") return "done";
    } catch { /* storage blocked — show it */ }
    return "gate";
  });
  const [revealed, setRevealed] = useState(0);
  const completedRef = useRef(false);

  const fingerprint = useMemo(() => readFingerprint(), []);
  const lines = useMemo(() => buildLines(fingerprint), [fingerprint]);

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    try { localStorage.setItem(SEEN_KEY, "1"); } catch { /* ignore */ }
    setStage("done");
    // Slight beat before yielding so the final line has a chance
    // to settle before the title flow takes over.
    setTimeout(() => onComplete(), 600);
  }, [onComplete]);

  // If we were already-seen on mount, hand control back immediately.
  useEffect(() => {
    if (stage === "done" && !completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  }, [stage, onComplete]);

  // Drive the scanning reveal on a fixed cadence. Reduce-motion
  // collapses the whole sequence to a single tick.
  useEffect(() => {
    if (stage !== "scanning") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setRevealed(lines.length);
      const t = setTimeout(finish, 800);
      return () => clearTimeout(t);
    }
    if (revealed >= lines.length) {
      const t = setTimeout(finish, 1000);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setRevealed(n => n + 1), revealed === 0 ? 350 : 700);
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
        background: "#010020",
        color: "#33E2E6",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        overflow: "hidden",
      }}
    >
      {/* Webcam-LED tell — small red dot in the upper-right that
          pulses faster once scanning starts. Pure decoration; we
          have no camera access. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "1.25rem",
          right: "1.25rem",
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: "#FF3C40",
          boxShadow: "0 0 12px rgba(255,60,64,0.85)",
          animation: stage === "scanning"
            ? "surv-led 0.8s steps(2) infinite"
            : "surv-led 2.2s steps(2) infinite",
        }}
      />

      {/* Drifting scan line — only during the scanning stage. */}
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
            animation: "surv-scan 2.4s linear infinite",
            mixBlendMode: "screen",
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
            onInitiate={() => { setStage("scanning"); setRevealed(0); }}
            onSkip={finish}
          />
        )}

        {stage === "scanning" && (
          <ScanView lines={lines} revealed={revealed} />
        )}
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
        &gt; LOREDEX OS // INBOUND HANDSHAKE
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
        Initiate Handshake?
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
        Operator fingerprint not on file. Proceeding will let the Ark read
        your local terminal — agent, locale, chronosphere, system clock —
        nothing more. Data does not leave this device.
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
          ▶ Initiate
        </button>
        <button
          type="button"
          onClick={onSkip}
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.25)",
            color: "rgba(255,255,255,0.6)",
            padding: "0.65rem 1.5rem",
            fontSize: "0.7rem",
            letterSpacing: "0.28em",
            fontFamily: "inherit",
            cursor: "pointer",
            textTransform: "uppercase",
          }}
        >
          Skip
        </button>
      </div>
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
        &gt; SCANNING OPERATOR FINGERPRINT . . .
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
        {lines.slice(0, revealed).map((line, i) => {
          const isFinal = line.label === "FINGERPRINT";
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
                textShadow: isFinal ? "0 0 18px rgba(255,60,64,0.6)" : "none",
              }}
            >
              <span style={{ opacity: 0.55, minWidth: "18ch" }}>
                &gt; {line.label}
              </span>
              <span style={{ opacity: 0.95 }}>
                <KineticText
                  key={`${line.label}-${i}`}
                  text={line.value}
                  mode="decode"
                  speed={42}
                  showCursor={false}
                />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
