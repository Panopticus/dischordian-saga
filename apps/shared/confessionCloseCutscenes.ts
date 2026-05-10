/* ═══════════════════════════════════════════════════════
   ACT 6 CONFESSION-CLOSE CUTSCENES — typed registry

   The Act 6 completion gate (`act6CompletionGate.ts`) tracks
   seven possible stance flags the player can raise during the
   confession close:

     empathy · challenge · refusal · reluctant_ally ·
     partial · oracle_sense · practical

   Each stance has TWO video deliveries — one for Elara, one
   for the Human — so the player sees the chosen stance played
   out toward each of the two confessing characters. Producer
   drop 2026-05-10 (OTHER_CUTSCENES.zip / confession_close/)
   ships all 14 MP4s.

   This module is the resolution layer only — the runtime
   playback site that consumes these URLs lives in the cutscene
   router; the router decides when to fire based on Act 6 state
   and uses `resolveConfessionCloseCutscene()` to look up the URL.
   ═══════════════════════════════════════════════════════ */

import type { Act6ConfessionStanceFlag } from "./act6CompletionGate";
import { ACT_6_CONFESSION_STANCE_FLAGS } from "./act6CompletionGate";

export type ConfessionCloseCharacter = "elara" | "human";

/** Strip the `act6_confession_close_` prefix to get the bare stance slug. */
export type ConfessionCloseStance =
  Act6ConfessionStanceFlag extends `act6_confession_close_${infer S}` ? S : never;

export const CONFESSION_CLOSE_STANCES: readonly ConfessionCloseStance[] =
  ACT_6_CONFESSION_STANCE_FLAGS.map(
    (f) => f.replace(/^act6_confession_close_/, "") as ConfessionCloseStance,
  );

export const CONFESSION_CLOSE_CHARACTERS: readonly ConfessionCloseCharacter[] = [
  "elara",
  "human",
];

export interface ConfessionCloseCutsceneDef {
  /** Stable id — `act6_confession_<character>_<stance>` — matches the
   *  delivered MP4 basename. */
  id: string;
  stance: ConfessionCloseStance;
  character: ConfessionCloseCharacter;
  /** Path under apps/client/public/videos/ — pass through `assetUrl()`. */
  videoRelPath: string;
}

const VIDEO_DIR = "videos/confession_close";

/** Generate the full 7×2 = 14 entry registry. The bundle ships
 *  one MP4 per (character, stance) pair under
 *  `videos/confession_close/act6_confession_<character>_<stance>.mp4`. */
export const CONFESSION_CLOSE_CUTSCENES: readonly ConfessionCloseCutsceneDef[] =
  CONFESSION_CLOSE_CHARACTERS.flatMap((character) =>
    CONFESSION_CLOSE_STANCES.map<ConfessionCloseCutsceneDef>((stance) => ({
      id: `act6_confession_${character}_${stance}`,
      stance,
      character,
      videoRelPath: `${VIDEO_DIR}/act6_confession_${character}_${stance}.mp4`,
    })),
  );

const BY_PAIR = new Map<string, ConfessionCloseCutsceneDef>(
  CONFESSION_CLOSE_CUTSCENES.map((d) => [`${d.character}:${d.stance}`, d] as const),
);

/** Resolve the cutscene def for a (character, stance) pair, or
 *  undefined if either argument is unknown. */
export function resolveConfessionCloseCutscene(
  character: ConfessionCloseCharacter,
  stance: ConfessionCloseStance,
): ConfessionCloseCutsceneDef | undefined {
  return BY_PAIR.get(`${character}:${stance}`);
}

/** Resolve BOTH character cutscenes for a stance — the
 *  confession close plays Elara then Human (or vice versa). */
export function resolveConfessionCloseCutscenesForStance(
  stance: ConfessionCloseStance,
): {
  elara: ConfessionCloseCutsceneDef | undefined;
  human: ConfessionCloseCutsceneDef | undefined;
} {
  return {
    elara: resolveConfessionCloseCutscene("elara", stance),
    human: resolveConfessionCloseCutscene("human", stance),
  };
}

/** Convert a stance flag (`act6_confession_close_empathy`) to the
 *  bare stance slug (`empathy`). Returns null for unknown flags. */
export function stanceFromFlag(
  flag: string,
): ConfessionCloseStance | null {
  const m = flag.match(/^act6_confession_close_(.+)$/);
  if (!m) return null;
  const slug = m[1] as ConfessionCloseStance;
  return CONFESSION_CLOSE_STANCES.includes(slug) ? slug : null;
}

export const CONFESSION_CLOSE_CUTSCENE_TOTAL = CONFESSION_CLOSE_CUTSCENES.length;
