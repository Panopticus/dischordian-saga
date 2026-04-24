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
 * Per-beat post-cutscene interactions are dispatched by
 * `renderBeatInteraction` and reuse the already-registered VFX
 * components. All six interactive beats (C / D / E / F / H / J) have
 * shipping implementations; every other beat auto-advances on
 * cutscene end via `beatHasInteraction` returning false.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PRELUDE_BEATS,
  type PreludeBeat,
} from "../../../../shared/preludeSequence";
import { PreludeVfxOverlay, type ActiveVfxEffect } from "./vfx/PreludeVfxOverlay";
import { LastWordsWitnessing } from "./LastWordsWitnessing";
import { BeatCCrewRoleChoice } from "./BeatCCrewRoleChoice";
import { BeatDMissionBoard } from "./BeatDMissionBoard";
import { BeatEFlashback } from "./BeatEFlashback";
import { BeatFBiometricLockbox } from "./BeatFBiometricLockbox";
import { BeatHInbox } from "./BeatHInbox";
import {
  usePreludeSequenceState,
  type UsePreludeSequenceStateOptions,
} from "./usePreludeSequenceState";
import { beatHasInteraction, isBreathBeat } from "./preludeSequenceReducer";
import {
  getPreludeCutsceneBookends,
  getPreludeCutsceneVideo,
  PRELUDE_MUSIC,
} from "@/data/preludeAct1Deliverables";

export interface PreludeSequencePlayerProps
  extends UsePreludeSequenceStateOptions {
  /**
   * Called when the 15-beat Prelude sequence completes (after
   * Beat J's tease of Last Words finishes playing).
   *
   * The canonical Light/Dark alignment choice was moved to the
   * Act 1 Cycle C Authority finale in the October 2026
   * restructure, so this callback no longer surfaces an
   * alignment — it only reports the set of completion flags
   * collected during the Prelude.
   */
  onComplete: (payload: {
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

/** Resolve the cutscene public URL — prefer delivered CDN video, fall back to Bible path. */
function resolveCutsceneUrl(beat: PreludeBeat): string {
  const delivered = getPreludeCutsceneVideo(beat.id);
  if (delivered) return delivered;
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
  const bookends = useMemo(() => getPreludeCutsceneBookends(beat.id), [beat]);

  /**
   * Landing-still window — between a non-interactive beat's cutscene
   * ending and the reducer advancing to the next beat, hold the end
   * bookend on screen for 1.5s. The reducer advances directly from
   * `cutscene` to the next beat's `cutscene` on `cutscene_ended` for
   * non-interactive beats, so without this the transition is a hard
   * cut. `interceptedCutsceneEnded` buffers that call.
   */
  const [showLandingBookend, setShowLandingBookend] = useState(false);
  const landingTimerRef = useRef<number | null>(null);
  const interceptedCutsceneEnded = () => {
    // Interactive beats wait for interaction UI — fire immediately so
    // the reducer moves to phase=completed and the UI component renders.
    if (beatHasInteraction(beat)) {
      cutsceneEnded();
      return;
    }
    // No landing still available → fall through to the old behaviour.
    if (!bookends) {
      cutsceneEnded();
      return;
    }
    setShowLandingBookend(true);
    if (landingTimerRef.current) window.clearTimeout(landingTimerRef.current);
    landingTimerRef.current = window.setTimeout(() => {
      setShowLandingBookend(false);
      cutsceneEnded();
      landingTimerRef.current = null;
    }, 1500);
  };

  // Reset landing bookend whenever we enter a new beat so stale state
  // from a prior beat never leaks forward.
  useEffect(() => {
    setShowLandingBookend(false);
    return () => {
      if (landingTimerRef.current) {
        window.clearTimeout(landingTimerRef.current);
        landingTimerRef.current = null;
      }
    };
  }, [beat.id]);

  /**
   * Prelude music bed — loops the Elara theme softly underneath every
   * beat. Separate from cutscene audio so it survives scene changes.
   * Kicks in on first user gesture (autoplay policy) via the <video>'s
   * play which a browser already granted interaction for.
   */
  const bedRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (!bedRef.current) return;
    bedRef.current.volume = Math.max(0, Math.min(1, volume * 0.35));
  }, [volume]);

  // Fire onBeatComplete externally once per beat transition
  const lastAnnouncedRef = useRef<string>("");
  if (
    phase === "completed" &&
    lastAnnouncedRef.current !== beat.id
  ) {
    lastAnnouncedRef.current = beat.id;
    onBeatComplete?.(beat);
  }

  // Fire onComplete when the sequence reaches its `done` phase.
  // Previously gated on `alignment` being set; after the Last
  // Words restructure the Prelude no longer captures alignment
  // (that's Act 1's concern), so we fire purely on isDone.
  const completionFiredRef = useRef(false);
  if (isDone && !completionFiredRef.current) {
    completionFiredRef.current = true;
    onComplete({ completedFlags });
  }

  /** Per-beat post-cutscene interaction renderer. */
  const renderBeatInteraction = () => {
    if (phase !== "completed") return null;

    switch (beat.id) {
      case "beat_c":
        return (
          <BeatCCrewRoleChoice
            onComplete={() => interactionComplete()}
          />
        );
      case "beat_d":
        return (
          <BeatDMissionBoard
            onComplete={() => interactionComplete()}
          />
        );
      case "beat_e":
        return (
          <BeatEFlashback
            onComplete={() => interactionComplete()}
          />
        );
      case "beat_f":
        return (
          <BeatFBiometricLockbox
            onComplete={() => interactionComplete()}
          />
        );
      case "beat_h":
        return (
          <BeatHInbox
            onComplete={() => interactionComplete()}
            volume={volume}
          />
        );
      case "beat_j":
        // Prelude Beat J plays the 35-second tease of Last Words.
        // The canonical Light/Dark alignment choice does NOT fire
        // here — it was moved to the Act 1 Cycle C finale where
        // the full song lands. See:
        //   apps/client/src/components/act1/Act1CycleCAuthorityWitnessing.tsx
        return (
          <LastWordsWitnessing
            onComplete={() => interactionComplete()}
            volume={volume}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "var(--bg-void)",
        overflow: "hidden",
      }}
      role="region"
      aria-label="Prelude sequence"
    >
      {/* Room backdrop (webp) — cross-fades per URL change, not per
          beat change, so same-room transitions (Beat F → F.5, etc.)
          don't re-mount the backdrop. Beat J's Archives backdrop
          gets a slower fade because the Witnessing is the dramatic
          landing; every other change is a standard 1.2s fade. */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`backdrop-${roomBackdrop ?? "none"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: beat.id === "beat_j" ? 2.0 : 1.2,
            ease: "easeInOut",
          }}
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

      {/* Cutscene opening bookend — painting fades in first, then the
          video fades in on top as it starts to play. Keeps the scene
          readable even if the video is slow to buffer. */}
      <AnimatePresence>
        {phase === "cutscene" && bookends && (
          <motion.div
            key={`bookend-start-${beat.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${bookends.start.webp})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 8,
            }}
          />
        )}
      </AnimatePresence>

      {/* Cutscene video */}
      {phase === "cutscene" && !showLandingBookend && (
        <motion.video
          key={`cutscene-${beat.id}`}
          ref={videoRef}
          src={cutsceneUrl}
          autoPlay
          playsInline
          onEnded={interceptedCutsceneEnded}
          // If the delivered video 404s or fails to decode (e.g. in dev
          // before the media pipeline has uploaded), don't strand the
          // player on a black screen — treat the error as end-of-cutscene
          // so the state machine advances. The bookend still remains
          // visible, giving the beat a paced audio-drama feel.
          onError={interceptedCutsceneEnded}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
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

      {/* Cutscene landing bookend — held for 1.5s between a
          non-interactive beat's cutscene ending and the reducer
          advancing. Gives each transition a paced fade instead of
          a hard cut. */}
      <AnimatePresence>
        {showLandingBookend && bookends && (
          <motion.div
            key={`bookend-end-${beat.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${bookends.end.webp})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 9,
            }}
          />
        )}
      </AnimatePresence>

      {/* Looping Prelude music bed. `loop` + single mount at root so
          the track survives beat transitions. `muted` fallback kept
          off — volume is driven by the volume prop (× 0.35 for bed). */}
      <audio
        ref={bedRef}
        src={PRELUDE_MUSIC.ambientShip}
        autoPlay
        loop
        preload="auto"
        aria-hidden="true"
      />

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
            padding: "var(--space-sm) var(--space-md)",
            background: "color-mix(in oklch, var(--bg-void) 60%, transparent)",
            border: "1px solid color-mix(in oklch, var(--energy-primary) 40%, transparent)",
            color: "var(--energy-primary)",
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
          color: "color-mix(in oklch, var(--energy-primary) 60%, transparent)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          zIndex: 140,
        }}
      >
        <div>{beat.title}</div>
        <div style={{ opacity: 0.5, marginTop: 2 }}>
          Beat {beatIndex + 1} / {totalBeats} · {phase}
          {isBreathBeat(beat) && (
            <span
              aria-label="breath beat"
              style={{
                marginLeft: 8,
                padding: "1px var(--space-xs)",
                border: "1px solid color-mix(in oklch, var(--energy-primary) 35%, transparent)",
                borderRadius: 2,
                fontSize: 9,
                letterSpacing: "0.25em",
              }}
            >
              Breath
            </span>
          )}
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
        {PRELUDE_BEATS.map((b, i) => {
          // Breath-beat pips are half-width so the pacing map reads
          // as deliberate — the player can see the breath intervals
          // before they arrive at them.
          const breath = isBreathBeat(b);
          return (
            <div
              key={i}
              style={{
                width: breath ? 4 : 8,
                height: 2,
                backgroundColor:
                  i < beatIndex
                    ? "color-mix(in oklch, var(--energy-primary) 60%, transparent)"
                    : i === beatIndex
                    ? "var(--energy-primary)"
                    : "color-mix(in oklch, var(--energy-primary) 15%, transparent)",
                opacity: breath ? 0.7 : 1,
                transition: "background-color 0.3s",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
