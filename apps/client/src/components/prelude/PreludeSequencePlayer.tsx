/**
 * PreludeSequencePlayer — The runtime orchestrator that walks the
 * 15 Prelude beats end-to-end.
 *
 * Responsibilities:
 *   1. Render the current beat's room image as the backdrop
 *   2. Play the beat's cutscene video (auto-advance on end)
 *   3. Reveal the beat-specific post-cutscene UI when applicable
 *      (currently only Beat J = LastWordsWitnessing)
 *   4. Expose overall progress + completion flags
 *   5. Fire onComplete(alignment) after Beat J's alignment choice
 *
 * Intentionally NOT included in this component (tracked in P0
 * follow-ups):
 *   - Beat C crew role choice UI — plug into the `completed` phase
 *   - Beat D mission board + Inbox first-message composition
 *   - Beat E flashback trigger on archive objects
 *   - Beat F biometric lockbox + memo-rise composition
 *
 * All of those slot into the `renderBeatInteraction` switch below
 * and reuse the already-registered VFX components.
 */

import { useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PRELUDE_BEATS,
  type PreludeBeat,
} from "../../../../shared/preludeSequence";
import { PreludeVfxOverlay, type ActiveVfxEffect } from "./vfx/PreludeVfxOverlay";
import { LastWordsWitnessing } from "./LastWordsWitnessing";
import {
  usePreludeSequenceState,
  type PreludeAlignmentChoice,
  type UsePreludeSequenceStateOptions,
} from "./usePreludeSequenceState";

export interface PreludeSequencePlayerProps
  extends UsePreludeSequenceStateOptions {
  /** Called after Beat J's alignment choice + song end. */
  onComplete: (payload: {
    alignment: PreludeAlignmentChoice;
    completedFlags: readonly string[];
  }) => void;
  /** Called every time a beat finishes (cutscene-end or interaction-complete). */
  onBeatComplete?: (beat: PreludeBeat) => void;
  /** Volume 0-1 for cutscene audio. Default 0.85. */
  volume?: number;
}

/** Resolve the room backdrop path, walking up `inheritsRoomFrom` chain. */
function resolveRoomBackdrop(beat: PreludeBeat): string | null {
  if (beat.room) return `/${beat.room.webp.replace(/^apps\/client\/public\//, "")}`;
  if (!beat.inheritsRoomFrom) return null;
  const parent = PRELUDE_BEATS.find((b) => b.id === beat.inheritsRoomFrom);
  if (!parent?.room) return null;
  return `/${parent.room.webp.replace(/^apps\/client\/public\//, "")}`;
}

/** Resolve the cutscene public URL from its manifest path. */
function resolveCutsceneUrl(beat: PreludeBeat): string {
  return `/${beat.cutscene.mp4.replace(/^apps\/client\/public\//, "")}`;
}

/** Build the overlay effects list for the current beat. */
function buildActiveEffects(beat: PreludeBeat): ActiveVfxEffect[] {
  return beat.vfxAssets.map((vfx) => ({ id: vfx.id }));
}

export function PreludeSequencePlayer({
  onComplete,
  onBeatComplete,
  startingBeatId,
  volume = 0.85,
}: PreludeSequencePlayerProps) {
  const state = usePreludeSequenceState({
    startingBeatId,
  });
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const {
    beat,
    beatIndex,
    totalBeats,
    phase,
    completedFlags,
    alignment,
    isDone,
    cutsceneEnded,
    interactionComplete,
    skipCutscene,
  } = state;

  const roomBackdrop = useMemo(() => resolveRoomBackdrop(beat), [beat]);
  const cutsceneUrl = useMemo(() => resolveCutsceneUrl(beat), [beat]);
  const activeEffects = useMemo(() => buildActiveEffects(beat), [beat]);

  // Fire onBeatComplete externally once per beat transition
  const lastAnnouncedRef = useRef<string>("");
  if (
    phase === "completed" &&
    lastAnnouncedRef.current !== beat.id
  ) {
    lastAnnouncedRef.current = beat.id;
    onBeatComplete?.(beat);
  }

  // Fire onComplete when the sequence ends
  const completionFiredRef = useRef(false);
  if (isDone && alignment && !completionFiredRef.current) {
    completionFiredRef.current = true;
    onComplete({ alignment, completedFlags });
  }

  /** Per-beat post-cutscene interaction renderer. */
  const renderBeatInteraction = () => {
    if (phase !== "completed") return null;

    switch (beat.id) {
      case "beat_j":
        return (
          <LastWordsWitnessing
            onComplete={({ choice }) =>
              interactionComplete({ alignment: choice })
            }
            volume={volume}
          />
        );
      // TODO: Beat C crew role choice, Beat D mission board, Beat E
      // flashback trigger, Beat F biometric lockbox. For now auto-advance
      // handles these (no interactive step required yet).
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#010020",
        overflow: "hidden",
      }}
      role="region"
      aria-label="Prelude sequence"
    >
      {/* Room backdrop (webp) — cross-fades per beat */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`backdrop-${beat.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: roomBackdrop ? `url(${roomBackdrop})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.6)",
          }}
        />
      </AnimatePresence>

      {/* Active VFX overlays for this beat */}
      <PreludeVfxOverlay activeEffects={activeEffects} />

      {/* Cutscene video */}
      {phase === "cutscene" && (
        <motion.video
          key={`cutscene-${beat.id}`}
          ref={videoRef}
          src={cutsceneUrl}
          autoPlay
          playsInline
          onEnded={cutsceneEnded}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 10,
          }}
        />
      )}

      {/* Post-cutscene interaction (Beat J only today) */}
      {renderBeatInteraction()}

      {/* Skip cutscene affordance */}
      {phase === "cutscene" && (
        <button
          onClick={skipCutscene}
          aria-label="Skip cutscene"
          style={{
            position: "absolute",
            bottom: 32,
            right: 32,
            padding: "10px 20px",
            background: "rgba(1, 0, 32, 0.6)",
            border: "1px solid rgba(34, 211, 238, 0.4)",
            color: "#22d3ee",
            fontFamily: "monospace",
            fontSize: 12,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            cursor: "pointer",
            zIndex: 140,
          }}
        >
          Skip ›
        </button>
      )}

      {/* Progress indicator */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          fontFamily: "monospace",
          fontSize: 11,
          color: "rgba(34, 211, 238, 0.6)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          zIndex: 140,
        }}
      >
        <div>{beat.title}</div>
        <div style={{ opacity: 0.5, marginTop: 2 }}>
          Beat {beatIndex + 1} / {totalBeats} · {phase}
        </div>
      </div>

      {/* Beat-index pip row — thin dots showing progress */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 4,
          zIndex: 140,
        }}
      >
        {PRELUDE_BEATS.map((_, i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 2,
              backgroundColor:
                i < beatIndex
                  ? "rgba(34, 211, 238, 0.6)"
                  : i === beatIndex
                  ? "#22d3ee"
                  : "rgba(34, 211, 238, 0.15)",
              transition: "background-color 0.3s",
            }}
          />
        ))}
      </div>
    </div>
  );
}
