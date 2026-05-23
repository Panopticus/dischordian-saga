/* ═══════════════════════════════════════════════════════
   NEXUS TRIAL CINEMATIC PLAYER
   docs/design/NEXUS_TRIAL_PLAN.md → Pre-Authored Final-Death
   Cinematics

   Plays a CinematicScript end to end as a sequence of beats:
     1. Antiquarian opening V.O. (~5s)
     2. Character line (~5–8s depending on length)
     3. Action directions render as a slowly-revealed
        narrative paragraph (~8s; production replaces this
        with the actual visual sequence)
     4. Antiquarian closing V.O. (~5s)
     5. Optional client-local romance tag (~12s) — only if
        the player is romance-eligible for this companion

   The player calls trpc.nexusTrial.romanceTagEligibility for
   the Confession variants to decide whether to play the
   romance tag. The romance tag interpolates {player_name}
   at render time.

   Void-Energy compliant. State reflected via data-* attrs.
   ═══════════════════════════════════════════════════════ */

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { CinematicScript } from "@shared/nexusTrial/cinematics";

type Beat =
  | "antiquarian_opening"
  | "character_line"
  | "action"
  | "antiquarian_closing"
  | "romance_tag"
  | "done";

const BEAT_DURATIONS_MS: Record<Beat, number> = {
  antiquarian_opening: 5000,
  character_line: 8000,
  action: 8000,
  antiquarian_closing: 5000,
  romance_tag: 12000,
  done: 0,
};

export interface CinematicPlayerProps {
  script: CinematicScript;
  /** Whether to play the optional romance tag at the end. Caller
   *  (Confession surface) decides by querying
   *  trpc.nexusTrial.romanceTagEligibility. */
  playRomanceTag?: boolean;
  /** Substituted into {player_name} placeholders in the romance tag. */
  playerName?: string;
  /** Called when the cinematic completes (after the last beat). */
  onComplete?: () => void;
  /** When true, the player auto-advances through beats; when false,
   *  each beat sticks until manually advanced. Default: true. */
  autoAdvance?: boolean;
}

/** Pure render — exposed for testing without timers. */
export function CinematicPlayerView({
  script,
  beat,
  playerName = "Captain",
}: {
  script: CinematicScript;
  beat: Beat;
  playerName?: string;
}) {
  const romanceLine =
    script.romanceTag?.characterLine.replaceAll("{player_name}", playerName) ??
    "";
  return (
    <section
      data-component="cinematic-player"
      data-cinematic-id={script.id}
      data-beat={beat}
      data-has-video={script.videoUrl ? "true" : "false"}
      className="void-radius void-border border void-bg-elevated relative overflow-hidden font-mono aspect-video"
      aria-live="polite"
      aria-label={`Cinematic: ${script.id}`}
    >
      {/* Rendered video layer — the producer-delivered cinematic.
          Autoplay muted on mount; the text beats overlay for
          accessibility + as a fallback if the video errors. The
          video respects the beat machine indirectly via the timing
          model in BEAT_DURATIONS_MS, which roughly tracks the
          producer's intended 6–12s clip durations. */}
      {script.videoUrl && (
        <video
          key={script.videoUrl}
          src={script.videoUrl}
          autoPlay
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
          data-cinematic-video
          aria-hidden="true"
        />
      )}

      {/* Top-bar overlay — header strip sitting above the video. */}
      <header
        className="absolute top-0 left-0 right-0 void-bg-sunk px-6 py-2 flex items-center justify-between text-[10px] tracking-[0.25em] void-text-accent"
      >
        <span>THE ANTIQUARIAN'S LEDGER</span>
        <span className="void-text-muted" data-readout="cinematic-id">
          {script.id}
        </span>
      </header>

      {/* Subtitle overlay — text beats sit at the bottom of the
          video, subtitle-style. void-bg-sunk backdrop only covers
          the overlay band, keeping the video readable. */}
      <div className="absolute bottom-0 left-0 right-0 void-bg-sunk px-6 py-4">
        <AnimatePresence mode="wait">
          {beat === "antiquarian_opening" && (
            <BeatPanel key="opening" speaker="ANTIQUARIAN">
              {script.antiquarianOpening}
            </BeatPanel>
          )}
          {beat === "character_line" && script.characterLine.length > 0 && (
            <BeatPanel key="character" speaker={(script.npcKey ?? "—").toUpperCase()}>
              {script.characterLine}
            </BeatPanel>
          )}
          {beat === "action" && (
            <BeatPanel key="action" speaker="STAGE" muted>
              {script.actionDirections}
            </BeatPanel>
          )}
          {beat === "antiquarian_closing" && (
            <BeatPanel key="closing" speaker="ANTIQUARIAN">
              {script.antiquarianClosing}
            </BeatPanel>
          )}
          {beat === "romance_tag" && script.romanceTag && (
            <BeatPanel key="romance" speaker={(script.npcKey ?? "—").toUpperCase()} romance>
              {romanceLine}
            </BeatPanel>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function BeatPanel({
  children,
  speaker,
  muted = false,
  romance = false,
}: {
  children: React.ReactNode;
  speaker: string;
  muted?: boolean;
  romance?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const textToken = muted
    ? "void-text-muted"
    : romance
      ? "void-text-premium"
      : "void-text";
  return (
    <motion.div
      data-beat-panel
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.4 }}
    >
      <p className="mb-2 text-[10px] tracking-[0.3em] void-text-muted">
        {speaker}
      </p>
      <p className={`text-sm leading-relaxed ${textToken}`}>{children}</p>
    </motion.div>
  );
}

/**
 * Live player — auto-advances through beats on timers. The
 * onComplete callback fires after the final beat.
 */
export default function CinematicPlayer({
  script,
  playRomanceTag = false,
  playerName,
  onComplete,
  autoAdvance = true,
}: CinematicPlayerProps) {
  const [beat, setBeat] = useState<Beat>("antiquarian_opening");

  useEffect(() => {
    if (!autoAdvance || beat === "done") return;
    const t = setTimeout(() => {
      setBeat((b) => nextBeat(b, { hasCharacterLine: script.characterLine.length > 0, playRomanceTag }));
    }, BEAT_DURATIONS_MS[beat]);
    return () => clearTimeout(t);
  }, [beat, autoAdvance, script.characterLine.length, playRomanceTag]);

  useEffect(() => {
    if (beat === "done") onComplete?.();
  }, [beat, onComplete]);

  if (beat === "done") return null;

  return (
    <CinematicPlayerView script={script} beat={beat} playerName={playerName} />
  );
}

/** Pure beat transition — exported for testing. */
export function nextBeat(
  current: Beat,
  options: { hasCharacterLine: boolean; playRomanceTag: boolean },
): Beat {
  switch (current) {
    case "antiquarian_opening":
      return options.hasCharacterLine ? "character_line" : "action";
    case "character_line":
      return "action";
    case "action":
      return "antiquarian_closing";
    case "antiquarian_closing":
      return options.playRomanceTag ? "romance_tag" : "done";
    case "romance_tag":
      return "done";
    case "done":
      return "done";
  }
}
