/**
 * BeatEFlashback — Beat E's post-cutscene flashback interaction.
 *
 * Renders over the mess-hall room backdrop (rendered by
 * PreludeSequencePlayer). Shows clickable hotspots for each archive
 * object whose Prince VO line is in the manifest. Clicking a hotspot
 * engages a sepia-drain flashback, plays the Prince's hologram VO,
 * optionally overlays a hotspot-specific VFX (e.g. diploma-ink-bloom),
 * then drains back to full color and marks the object examined.
 *
 * The beat completes when either:
 *   - The player clicks Continue after at least one examination, or
 *   - All available hotspots have been examined (auto-advance).
 *
 * Canon: PRELUDE_SHIP_READY_BIBLE.md §10.5 (flashback mechanic),
 *        §10.6 (sepia-drain + film-damage layers).
 *
 * Usage:
 *   <BeatEFlashback onComplete={() => interactionComplete()} />
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  getAvailableBeatEHotspots,
  getHotspotVoUrl,
  type BeatEHotspotConfig,
} from "./beatEHotspots";

export interface BeatEFlashbackProps {
  /** Called when the player signals they're done examining. */
  onComplete: () => void;
  /** Optional volume for VO playback, 0-1. Default 0.9. */
  volume?: number;
}

type Phase = "idle" | "entering" | "active" | "exiting";

/** Duration of the sepia-drain entering transition (Bible §10.6: 3s). */
const SEPIA_ENTER_MS = 3000;
/** Duration of the sepia-drain exiting transition (Bible §10.6: 2s). */
const SEPIA_EXIT_MS = 2000;

export function BeatEFlashback({
  onComplete,
  volume = 0.9,
}: BeatEFlashbackProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hotspots = useMemo(() => getAvailableBeatEHotspots(), []);
  const [examined, setExamined] = useState<ReadonlySet<string>>(new Set());
  const [phase, setPhase] = useState<Phase>("idle");
  const [activeHotspot, setActiveHotspot] =
    useState<BeatEHotspotConfig | null>(null);

  // Keep volume synced to the audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, [volume]);

  // Respect prefers-reduced-motion — collapse the sepia transitions
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const enterDuration = prefersReducedMotion ? 0 : SEPIA_ENTER_MS;
  const exitDuration = prefersReducedMotion ? 0 : SEPIA_EXIT_MS;

  const startFlashback = useCallback(
    (hotspot: BeatEHotspotConfig) => {
      if (phase !== "idle") return;
      if (examined.has(hotspot.id)) return;
      setActiveHotspot(hotspot);
      setPhase("entering");

      // After sepia-drain enters, start the VO
      setTimeout(() => {
        setPhase("active");
        const url = getHotspotVoUrl(hotspot);
        if (url && audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.currentTime = 0;
          void audioRef.current.play().catch(() => {
            // Autoplay blocked — advance to exit to keep the UI unstuck
            setPhase("exiting");
          });
        } else {
          // No VO available — skip straight to exit
          setPhase("exiting");
        }
      }, enterDuration);
    },
    [phase, examined, enterDuration],
  );

  const handleVoEnded = useCallback(() => {
    setPhase("exiting");
  }, []);

  // When exit finishes, mark examined and return to idle
  useEffect(() => {
    if (phase !== "exiting") return;
    const t = setTimeout(() => {
      if (activeHotspot) {
        setExamined((prev) => {
          const next = new Set(prev);
          next.add(activeHotspot.id);
          return next;
        });
      }
      setActiveHotspot(null);
      setPhase("idle");
    }, exitDuration);
    return () => clearTimeout(t);
  }, [phase, activeHotspot, exitDuration]);

  // Auto-complete when every available hotspot has been examined
  useEffect(() => {
    if (phase !== "idle") return;
    if (hotspots.length === 0) return;
    if (examined.size >= hotspots.length) {
      // Small delay so the final reverse animation is visible before
      // the parent swaps to the next beat's cutscene
      const t = setTimeout(onComplete, 600);
      return () => clearTimeout(t);
    }
  }, [phase, hotspots.length, examined.size, onComplete]);

  const canContinue = examined.size > 0 && phase === "idle";
  const inFlashback = phase !== "idle";

  // Sepia filter curve tied to phase
  const sepiaFilter = (() => {
    switch (phase) {
      case "idle":
        return "none";
      case "entering":
      case "active":
        return "sepia(1) saturate(0.7) contrast(1.1) brightness(0.85)";
      case "exiting":
        return "sepia(0.0) saturate(1) contrast(1) brightness(1)";
    }
  })();
  const transitionDurationMs =
    phase === "entering"
      ? enterDuration
      : phase === "exiting"
      ? exitDuration
      : 0;

  return (
    <div
      aria-label="Beat E — Mess Hall Archive (interactive)"
      role="region"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "auto",
        filter: sepiaFilter,
        transition: `filter ${transitionDurationMs}ms ease-in-out`,
      }}
    >
      {/* Hotspots — clickable overlays on the room backdrop */}
      {hotspots.map((hotspot) => {
        const isExamined = examined.has(hotspot.id);
        return (
          <button
            key={hotspot.id}
            onClick={() => startFlashback(hotspot)}
            disabled={isExamined || inFlashback}
            aria-label={hotspot.label}
            title={
              isExamined
                ? `${hotspot.displayName} (examined)`
                : hotspot.displayName
            }
            style={{
              position: "absolute",
              left: `${hotspot.position.leftPct}%`,
              top: `${hotspot.position.topPct}%`,
              transform: "translate(-50%, -50%)",
              width: 72,
              height: 72,
              borderRadius: "50%",
              border: "2px solid color-mix(in oklch, var(--energy-primary) 60%, transparent)",
              background: isExamined
                ? "color-mix(in oklch, var(--energy-primary) 8%, transparent)"
                : "color-mix(in oklch, var(--energy-primary) 15%, transparent)",
              cursor: isExamined || inFlashback ? "default" : "pointer",
              boxShadow: isExamined
                ? "none"
                : "0 0 24px color-mix(in oklch, var(--energy-primary) 40%, transparent)",
              animation:
                !isExamined && !inFlashback
                  ? "pvfx-cyan-shimmer 2.4s ease-in-out infinite"
                  : "none",
              opacity: isExamined ? 0.35 : 1,
              transition: "opacity 0.4s ease-out, box-shadow 0.4s ease-out",
              zIndex: 50,
              pointerEvents: inFlashback ? "none" : "auto",
            }}
          />
        );
      })}

      {/* Film-damage overlay — layers scratches during the flashback */}
      {(phase === "entering" || phase === "active") && (
        <video
          key="film-damage"
          src="/art/vfx/prelude/film-damage.webm"
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            mixBlendMode: "screen",
            opacity: 0.45,
            pointerEvents: "none",
            zIndex: 40,
          }}
        />
      )}

      {/* Hotspot-specific VFX overlay (e.g. diploma-ink-bloom) */}
      <AnimatePresence>
        {phase === "active" && activeHotspot?.vfxOverlay && (
          <motion.video
            key={`vfx-${activeHotspot.id}`}
            src={activeHotspot.vfxOverlay.webmUrl}
            autoPlay
            muted
            playsInline
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              position: "absolute",
              left: `${activeHotspot.position.leftPct}%`,
              top: `${activeHotspot.position.topPct}%`,
              transform: "translate(-50%, -50%)",
              width: activeHotspot.vfxOverlay.widthPx,
              height: activeHotspot.vfxOverlay.heightPx,
              objectFit: "contain",
              mixBlendMode: "screen",
              pointerEvents: "none",
              zIndex: 45,
            }}
          />
        )}
      </AnimatePresence>

      {/* FLASHBACK banner during active phase (accessibility-useful +
          per Bible §10.6 reduced-motion spec) */}
      {phase === "active" && (
        <div
          aria-live="polite"
          style={{
            position: "absolute",
            top: 24,
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "monospace",
            fontSize: 11,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--energy-accent)",
            background: "color-mix(in oklch, var(--bg-void) 55%, transparent)",
            padding: "6px 14px",
            border: "1px solid rgba(253, 230, 138, 0.4)",
            zIndex: 60,
          }}
        >
          Flashback — Recorded Recording
        </div>
      )}

      {/* Continue button — unlocks after first examination */}
      <button
        onClick={onComplete}
        disabled={!canContinue}
        aria-label="Continue to next beat"
        style={{
          position: "absolute",
          bottom: 32,
          right: 32,
          padding: "12px 24px",
          background: canContinue
            ? "color-mix(in oklch, var(--energy-primary) 18%, transparent)"
            : "color-mix(in oklch, var(--bg-void) 50%, transparent)",
          border: `1px solid ${
            canContinue ? "color-mix(in oklch, var(--energy-primary) 60%, transparent)" : "color-mix(in oklch, var(--energy-primary) 20%, transparent)"
          }`,
          color: canContinue ? "var(--energy-primary)" : "color-mix(in oklch, var(--energy-primary) 35%, transparent)",
          fontFamily: "monospace",
          fontSize: 12,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          cursor: canContinue ? "pointer" : "default",
          transition: "background 0.2s, border-color 0.2s, color 0.2s",
          zIndex: 70,
        }}
      >
        Continue ›
      </button>

      {/* Examined progress indicator (top-left) */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "absolute",
          top: 72,
          left: 16,
          fontFamily: "monospace",
          fontSize: 10,
          color: "color-mix(in oklch, var(--energy-primary) 55%, transparent)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          zIndex: 60,
        }}
      >
        Examined {examined.size} / {hotspots.length}
      </div>

      {/* Hidden audio element — src is swapped per flashback */}
      <audio
        ref={audioRef}
        onEnded={handleVoEnded}
        preload="auto"
      />
    </div>
  );
}
