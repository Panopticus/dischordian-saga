/**
 * TwoWitnessesPart2 — Section 6 cutscene (Act 1 narrative close).
 *
 * Fires immediately after the Act 1 finale `LastWordsFullWitnessing`
 * resolves and writes `GameState.lightDarkAlignment`. The player
 * walks (off-screen) back to the Archives. The Witnesses have been
 * waiting in the Beat J pose. The Antiquarian speaks; the Enigma
 * is silent. The player picks one of three closing choices
 * (accept / decline / deflect), which writes `act1_closingChoice`.
 *
 * SCAFFOLD ONLY. Runtime wiring is pending VO takes, dialog-UI
 * widget, and animator handoff. This file locks the type
 * surface and the state-machine shape so downstream can start
 * consuming the props.
 *
 * Canonical references:
 *   docs/production/UNIVERSAL_PROMPTING_DOC_PRELUDE_ACT1.md §9
 *   docs/production/act1-asset-build/prompts/voice/section6_antiquarian.csv
 *   docs/production/act1/reference/enigma-gaze-timeline.csv
 *   docs/production/act1/reference/enigma-branch-deltas.md
 *
 * Canon hygiene (non-negotiable):
 *   - Antiquarian speaks; Enigma silent
 *   - Witnesses stand in Beat J pose; never cross to the player
 *   - No "1260 days", "Silence in Heaven", "Heart of Time",
 *     Age names, civilian names, or Loredex-Programmer identity
 *   - Player's one permitted choice is accept / decline / deflect
 */

import { useEffect, useMemo, useRef, useState } from "react";

/** Primary Act 1 closing choice written to GameState. */
export type Act1ClosingChoice = "accept" | "decline" | "deflect";

/**
 * Four canonical deflect questions. If the player picks one of
 * these, the runtime plays `antiq_s6_l12c_v{1..4}`. Anything
 * else falls back to `antiq_s6_l12c` (catch-all).
 */
export type DeflectQuestion =
  | "who_was_he"
  | "how_long_waiting"
  | "what_if_no"
  | "why_me";

/** Persisted Section 6 outcome. */
export interface Section6Result {
  closingChoice: Act1ClosingChoice;
  deflectQuestion?: DeflectQuestion | "other";
  elapsedS: number;
  /** Always true on cutscene end. */
  witness_antiquarian_met_part2: true;
  /** Always true on cutscene end. Her silence is the canonical fact. */
  witness_enigma_met_part2: true;
}

export interface TwoWitnessesPart2Props {
  /** Called when the cutscene closes on the title card. */
  onComplete: (result: Section6Result) => void;
  /** Start audio on mount. Default true. */
  autoPlay?: boolean;
  /** Master volume (0-1). Default 0.85. */
  volume?: number;
  /** Skip all VO — used for text-only reduced-motion fallback. */
  reducedMotion?: boolean;
}

/** Internal state-machine phase. */
type Phase =
  | "cold_open"
  | "beat2_acknowledge" // l01, l02, l03
  | "beat3_framing" // l04, l05, l06, l07, l08
  | "beat4_ask" // l09, l10
  | "ui_choice" // accept / decline / deflect dialog open
  | "beat5_response_accept" // l11a
  | "beat5_response_decline" // l11b
  | "beat5_response_deflect" // l11c
  | "beat5_deflect_question" // player picks a question
  | "beat5_deflect_answer" // l12c or l12c_v{1..4}
  | "beat6_close_shared" // l13
  | "beat6_close_final" // l14
  | "title_card"
  | "done";

const ANTIQ_VO_BASE = "/audio/antiquarian";

/** Shared line ids (always play regardless of branch). */
const SHARED_LINES = [
  "antiq_s6_l01",
  "antiq_s6_l02",
  "antiq_s6_l03",
  "antiq_s6_l04",
  "antiq_s6_l05",
  "antiq_s6_l06",
  "antiq_s6_l07",
  "antiq_s6_l08",
  "antiq_s6_l09",
  "antiq_s6_l10",
] as const;

/** Per-branch response line ids. */
const RESPONSE_LINES: Record<Act1ClosingChoice, string> = {
  accept: "antiq_s6_l11a",
  decline: "antiq_s6_l11b",
  deflect: "antiq_s6_l11c",
};

/** Deflect-question → line id mapping. Fallback is catch-all l12c. */
const DEFLECT_VARIANT_LINES: Record<DeflectQuestion, string> = {
  who_was_he: "antiq_s6_l12c_v1",
  how_long_waiting: "antiq_s6_l12c_v2",
  what_if_no: "antiq_s6_l12c_v3",
  why_me: "antiq_s6_l12c_v4",
};

/** Close line ids (always play). */
const CLOSE_LINES = ["antiq_s6_l13", "antiq_s6_l14"] as const;

export function vo(id: string): string {
  return `${ANTIQ_VO_BASE}/${id}.mp3`;
}

export function pickDeflectLine(q: DeflectQuestion | "other"): string {
  if (q === "other") return "antiq_s6_l12c";
  return DEFLECT_VARIANT_LINES[q];
}

export function buildPlaybackSequence(
  choice: Act1ClosingChoice,
  deflectQuestion?: DeflectQuestion | "other",
): string[] {
  const seq: string[] = [...SHARED_LINES, RESPONSE_LINES[choice]];
  if (choice === "deflect") {
    seq.push(pickDeflectLine(deflectQuestion ?? "other"));
  }
  seq.push(...CLOSE_LINES);
  return seq;
}

/**
 * Scaffold implementation. Does not yet:
 *   - wire actual audio playback (reuse the Prelude LastWordsWitnessing
 *     audio-sync pattern)
 *   - render the Archives backdrop (reuse room-archives.webp via
 *     ResponsiveImage)
 *   - render the three-choice dialog UI (needs ChoicePillarAcceptDeclineDeflect
 *     styled to match ChoicePillarLightDark from PR #40)
 *   - render the Enigma blocking (animator to deliver the
 *     reference sheet per §9.10.3 first)
 *   - render the final "End of Act 1" title card fade
 *
 * All of the above are follow-up implementation tasks. This file
 * locks the public API so downstream systems can start consuming
 * the result shape.
 */
export function TwoWitnessesPart2({
  onComplete,
  autoPlay = true,
  volume = 0.85,
  reducedMotion = false,
}: TwoWitnessesPart2Props) {
  const [phase, setPhase] = useState<Phase>("cold_open");
  const [choice, setChoice] = useState<Act1ClosingChoice | null>(null);
  const [deflectQuestion, setDeflectQuestion] = useState<
    DeflectQuestion | "other" | null
  >(null);
  const mountedAtRef = useRef(performance.now());

  // Build the full VO sequence once the branch is known.
  const sequence = useMemo(() => {
    if (!choice) return null;
    return buildPlaybackSequence(choice, deflectQuestion ?? undefined);
  }, [choice, deflectQuestion]);

  // TODO: wire the sequence to an HTMLAudioElement with gapless
  // playback per the Prelude pattern. Advance `phase` as each
  // line's `onended` fires.
  useEffect(() => {
    if (!autoPlay) return;
    // Placeholder: immediately advance past cold-open after 20s
    // in the scaffold. Real implementation will drive `phase`
    // from audio completion events.
  }, [autoPlay, sequence]);

  // When we reach `title_card`, fire onComplete and settle.
  useEffect(() => {
    if (phase !== "title_card" || !choice) return;
    const elapsedS = (performance.now() - mountedAtRef.current) / 1000;
    const result: Section6Result = {
      closingChoice: choice,
      deflectQuestion: choice === "deflect" ? deflectQuestion ?? "other" : undefined,
      elapsedS,
      witness_antiquarian_met_part2: true,
      witness_enigma_met_part2: true,
    };
    onComplete(result);
    setPhase("done");
  }, [phase, choice, deflectQuestion, onComplete]);

  // Scaffold render — replace with Archives backdrop, Witness
  // poses, and the dialog-UI widget.
  return (
    <div
      data-testid="two-witnesses-part2"
      data-phase={phase}
      data-choice={choice ?? "pending"}
      className="fixed inset-0 bg-black"
    >
      {/* TODO: <LivingBackground src={roomArchivesWebp} particles={[...]} /> */}
      {/* TODO: <AntiquarianDialogPlayer lines={sequence} onPhaseChange={setPhase} /> */}
      {phase === "ui_choice" && (
        <div data-testid="closing-choice-prompt">
          {/* TODO: <ChoicePillarAcceptDeclineDeflect onPick={...} /> */}
        </div>
      )}
      {phase === "beat5_deflect_question" && (
        <div data-testid="deflect-question-picker">
          {/* TODO: 4 buttons + "other" free-text fallback */}
        </div>
      )}
      {phase === "title_card" && !reducedMotion && (
        <div
          data-testid="end-of-act1-title-card"
          className="flex h-full w-full items-center justify-center"
        >
          {/* The one permitted rendered-text line in Act 1's close. */}
          <span className="text-4xl tracking-[0.5em] text-[#d9a66a]">
            END OF ACT 1
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * State-writer helper. Callers pass the `Section6Result` from
 * `onComplete` into this to persist the five canonical fields
 * to GameState. Kept separate so the component is render-only.
 */
export function applySection6Result(
  result: Section6Result,
  gameState: {
    act1_complete: boolean;
    act1_closingChoice: Act1ClosingChoice | null;
    witness_antiquarian_met_part2: boolean;
    witness_enigma_met_part2: boolean;
  },
) {
  gameState.act1_complete = true;
  gameState.act1_closingChoice = result.closingChoice;
  gameState.witness_antiquarian_met_part2 = result.witness_antiquarian_met_part2;
  gameState.witness_enigma_met_part2 = result.witness_enigma_met_part2;
}
