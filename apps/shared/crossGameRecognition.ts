/* ═══════════════════════════════════════════════════════
   CROSS-GAME RECOGNITION (#43)

   The cross-game thread system (apps/shared/crossGameNarrativeThreads.ts)
   already exists: 9 threads, ~30 beats, an emit endpoint that sets
   `xgame_<beatId>` flags on the player's narrativeFlags, and a
   status endpoint that reads them back. What was missing is the
   *consumer side* — no NPC code reads those flags to swap dialog.

   This module is the bridge. Authors register a recognition entry
   per beat: "if `xgame_cades_fall_completed` is set, NPCs may say
   'Heard you survived the third drop.' instead of the canonical
   line." The Loredex narrative layer then calls
   `getRecognitionFor(speakerId, narrativeFlags)` to pick a phrase.

   Why a separate module rather than per-NPC inline:
     - Authors edit one file when shipping a recognition for a beat
       (mirrors how Act 1 dialog tables are organized).
     - Tests can assert every emitted beat has at least one
       recognition consumer (so a writer adding a beat can't ship
       it as a dead flag).
     - Localization (#144 follow-up) gets a single point to
       extract recognition strings into the i18n bundles.

   Phase 1 (this commit) ships the registry + lookups + a couple
   canonical recognitions. Phase 2 = content authors expand it as
   they write per-NPC dialog.
   ═══════════════════════════════════════════════════════ */

import type { CrossGameBeat } from "./crossGameNarrativeThreads";

/** A speaker for which a recognition applies. The id space matches
 *  the existing dialog surfaces (Elara, Antiquarian, Human, etc.).
 *  "any" is a wildcard that ANY narrator can read. */
export type RecognitionSpeaker =
  | "any"
  | "elara"
  | "antiquarian"
  | "human"
  | "architect"
  | "kael"
  | "ne_yon"
  | "warlord";

export interface CrossGameRecognition {
  /** The beat this recognition is gated on (must exist in
   *  CROSS_GAME_THREADS). When the player's narrativeFlags carry
   *  `xgame_<beatId>` = true, this recognition becomes eligible. */
  beatId: string;
  /** The speaker scoping. "any" = available to every narrator;
   *  specific id = only that narrator should use this line. */
  speaker: RecognitionSpeaker;
  /** The recognition phrase. Shipping copy. Keep ≤ 140 chars so it
   *  fits the existing dialog-line UI without forcing a wrap. */
  phrase: string;
  /** Optional context tag — UI surfaces can filter by it
   *  ("greeting", "remembrance", "warning"). */
  context?: "greeting" | "remembrance" | "warning" | "tease";
}

/** Phase-1 seed registry. Every entry is shipping copy. The tests
 *  in apps/shared/crossGameRecognition.test.ts assert every entry's
 *  beatId resolves to a real beat, so a typo here fails CI rather
 *  than silently disabling the recognition.
 *
 *  Authors expand this as they write per-NPC dialog; the registry
 *  is the single source of "what NPCs know about cross-game state". */
export const CROSS_GAME_RECOGNITIONS: readonly CrossGameRecognition[] = [
  // ─── Cades Fall — the player completed the FPS expulsion arc ───
  {
    beatId: "cades_fall_fall",
    speaker: "human",
    phrase: "Heard you survived the third drop. Most don't even hear about it.",
    context: "greeting",
  },
  {
    beatId: "cades_fall_fall",
    speaker: "elara",
    phrase: "Your dossier mentions the Cades operation. The substrate noticed.",
    context: "remembrance",
  },

  // ─── Programmer's Gift — DMC decoded the gift the player took here ───
  {
    beatId: "programmers_gift_dmc_decoded",
    speaker: "antiquarian",
    phrase:
      "Circuit decoded the gift you took. The mathematics did not flinch when you signed it.",
    context: "remembrance",
  },
  {
    beatId: "programmers_gift_dmc_decoded",
    speaker: "any",
    phrase: "You took the gift. The Circuit knows. We'll see what it costs.",
    context: "warning",
  },

  // ─── Last Words echo — heard the song's motif in Dead Man's Circuit ───
  {
    beatId: "last_words_echo_dmc_motif",
    speaker: "elara",
    phrase: "You've heard the verse on the Circuit. There is no un-hearing it.",
    context: "tease",
  },

  // ─── Iron Lions Wake — visited the Cades memorial after expulsion ───
  {
    beatId: "iron_lions_wake_cades_memorial",
    speaker: "warlord",
    phrase:
      "The Lions remember the name that visited the wake. They will not say it aloud.",
    context: "remembrance",
  },
];

/** Build the `xgame_<beatId>` flag key the server's emit endpoint
 *  writes (canonical contract; see
 *  apps/server/routers/crossGameThreads.ts → flagFor). Exported so
 *  consumers don't have to recreate the convention. */
export function recognitionFlagFor(beatId: string): string {
  return `xgame_${beatId}`;
}

/** Return all recognitions whose beat flag is set in
 *  `narrativeFlags`. Speaker filter:
 *    - undefined / "any" → everything visible to anyone.
 *    - specific id → entries scoped to that speaker, plus "any".
 *
 *  Pure: no DB, no React. Server endpoints can call this too if
 *  they want to bake recognitions into a payload. */
export function getEligibleRecognitions(
  narrativeFlags: Record<string, boolean | undefined>,
  speaker?: RecognitionSpeaker,
): readonly CrossGameRecognition[] {
  return CROSS_GAME_RECOGNITIONS.filter((r) => {
    if (!narrativeFlags[recognitionFlagFor(r.beatId)]) return false;
    if (!speaker || speaker === "any") return true;
    return r.speaker === speaker || r.speaker === "any";
  });
}

/** Pick one recognition for the speaker, deterministically — the
 *  first eligible entry in declaration order. Authors who want
 *  variation should ship multiple entries with distinct contexts
 *  and let the caller filter. */
export function pickRecognitionFor(
  narrativeFlags: Record<string, boolean | undefined>,
  speaker: RecognitionSpeaker,
): CrossGameRecognition | undefined {
  return getEligibleRecognitions(narrativeFlags, speaker)[0];
}

/** Test helper: return the set of beat ids the recognition registry
 *  references. The cross-game-recognition test asserts each is a
 *  real beat in CROSS_GAME_THREADS so a typo in `beatId` fails CI. */
export function recognitionBeatIds(): readonly string[] {
  return Array.from(new Set(CROSS_GAME_RECOGNITIONS.map((r) => r.beatId)));
}

/** Convenience for authoring tooling: dump every (beat, speaker,
 *  phrase) tuple in a flat list. Useful for the writers' audit
 *  pass. */
export function listAllRecognitions(): readonly Readonly<{
  beatId: string;
  speaker: RecognitionSpeaker;
  phrase: string;
  context?: CrossGameRecognition["context"];
}>[] {
  return CROSS_GAME_RECOGNITIONS;
}

/** Type re-export so consumers don't need a separate beat import. */
export type { CrossGameBeat };
