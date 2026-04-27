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

import { assetUrl } from "@/lib/assetUrl";
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

const ANTIQ_VO_BASE = assetUrl("audio/antiquarian");

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
 * Phase advancement after the shared opening run (l01..l10) has played.
 * The choice prompt opens once we've reached l10's onended.
 */
function phaseAfterShared(index: number): Phase {
  if (index < 3) return "beat2_acknowledge";
  if (index < 8) return "beat3_framing";
  if (index < 10) return "beat4_ask";
  return "ui_choice";
}

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
  const [lineIndex, setLineIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mountedAtRef = useRef(performance.now());

  const sequence = useMemo(() => {
    if (!choice) return null;
    return buildPlaybackSequence(choice, deflectQuestion ?? undefined);
  }, [choice, deflectQuestion]);

  // Reduced-motion / no-VO path: fast-forward through the cutscene as
  // soon as the player has picked. Skips audio entirely.
  useEffect(() => {
    if (!reducedMotion || !choice) return;
    setPhase("title_card");
  }, [reducedMotion, choice]);

  // Cold-open → start the shared opening run as soon as we mount.
  useEffect(() => {
    if (phase !== "cold_open") return;
    if (!autoPlay || reducedMotion) return;
    setPhase("beat2_acknowledge");
  }, [phase, autoPlay, reducedMotion]);

  // Drive the gapless playback. We index either SHARED_LINES (before a
  // choice) or `sequence` (after). Each `ended` advances by one.
  useEffect(() => {
    if (reducedMotion) return;
    if (phase === "ui_choice" || phase === "beat5_deflect_question") return;
    if (phase === "title_card" || phase === "done" || phase === "cold_open") return;

    const lines = sequence ?? SHARED_LINES;
    if (lineIndex >= lines.length) return;

    const audio = new Audio(vo(lines[lineIndex]));
    audio.volume = volume;
    audioRef.current = audio;

    const handleEnded = () => {
      // Pre-choice opening run — open the choice UI after l10.
      if (!sequence) {
        const next = lineIndex + 1;
        if (next >= SHARED_LINES.length) {
          setPhase("ui_choice");
          return;
        }
        setLineIndex(next);
        setPhase(phaseAfterShared(next));
        return;
      }
      // Post-choice run — walk to the title card on the last line.
      const next = lineIndex + 1;
      if (next >= sequence.length) {
        setPhase("title_card");
        return;
      }
      setLineIndex(next);
    };
    audio.addEventListener("ended", handleEnded);
    audio.play().catch(() => {
      // Autoplay blocked or asset missing — advance so we don't stall.
      handleEnded();
    });

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, [phase, lineIndex, sequence, volume, reducedMotion]);

  // Title-card → fire onComplete and settle.
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
    const settle = window.setTimeout(() => setPhase("done"), reducedMotion ? 0 : 2400);
    return () => window.clearTimeout(settle);
  }, [phase, choice, deflectQuestion, onComplete, reducedMotion]);

  const handleChoice = (c: Act1ClosingChoice) => {
    setChoice(c);
    setLineIndex(SHARED_LINES.length); // jump straight to the response line
    if (c === "accept") setPhase("beat5_response_accept");
    else if (c === "decline") setPhase("beat5_response_decline");
    else setPhase("beat5_response_deflect");
  };

  // The deflect branch needs a follow-up question pick after the l11c
  // response plays. Detect that boundary and surface the picker.
  useEffect(() => {
    if (!sequence || choice !== "deflect") return;
    if (lineIndex === SHARED_LINES.length + 1 && deflectQuestion === null) {
      setPhase("beat5_deflect_question");
    }
  }, [sequence, choice, lineIndex, deflectQuestion]);

  const handleDeflectQuestion = (q: DeflectQuestion | "other") => {
    setDeflectQuestion(q);
    setPhase("beat5_deflect_answer");
  };

  return (
    <div
      data-testid="two-witnesses-part2"
      data-phase={phase}
      data-choice={choice ?? "pending"}
      className="fixed inset-0 bg-black"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{ backgroundImage: `url(${assetUrl("backgrounds/room-archives.webp")})` }}
      />
      {phase === "ui_choice" && (
        <div
          data-testid="closing-choice-prompt"
          className="absolute inset-x-0 bottom-12 flex justify-center gap-4"
        >
          {(["accept", "decline", "deflect"] as Act1ClosingChoice[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => handleChoice(c)}
              data-testid={`closing-choice-${c}`}
              className="px-6 py-3 border border-[#d9a66a]/60 text-[#d9a66a] tracking-[0.3em] uppercase text-sm hover:bg-[#d9a66a]/10 transition-colors"
            >
              {c}
            </button>
          ))}
        </div>
      )}
      {phase === "beat5_deflect_question" && (
        <div
          data-testid="deflect-question-picker"
          className="absolute inset-x-0 bottom-12 flex flex-col items-center gap-3"
        >
          {(
            [
              ["who_was_he", "Who was he?"],
              ["how_long_waiting", "How long have you been waiting?"],
              ["what_if_no", "What if I say no?"],
              ["why_me", "Why me?"],
              ["other", "(Something else)"],
            ] as [DeflectQuestion | "other", string][]
          ).map(([q, label]) => (
            <button
              key={q}
              type="button"
              onClick={() => handleDeflectQuestion(q)}
              data-testid={`deflect-question-${q}`}
              className="px-5 py-2 border border-[#d9a66a]/40 text-[#d9a66a] text-sm hover:bg-[#d9a66a]/10 transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      )}
      {phase === "title_card" && !reducedMotion && (
        <div
          data-testid="end-of-act1-title-card"
          className="absolute inset-0 flex items-center justify-center bg-black/80"
        >
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
