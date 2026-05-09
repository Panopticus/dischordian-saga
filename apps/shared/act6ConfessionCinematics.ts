/* ═══════════════════════════════════════════════════════
   ACT 6 CONFESSION-CLOSE PORTRAIT CINEMATICS

   Closes audit/15 finding C4 ("confession-close stances have
   no cinematic punctuation"). Companion artifact to
   `docs/design/ACT6_CONFESSION_CINEMATICS.md` — that doc is
   the authoring source-of-truth; this file is the typed
   registry the runtime consumer reads.

   Shape: 14 entries — 7 stances × 2 listeners (Elara + The
   Human). Each entry carries the trigger flag, the listener,
   the target portrait expression, the pre-recorded VO id,
   the visual treatment summary (the full direction lives in
   the design doc; the registry holds the implementation
   knobs the consumer needs at runtime), and the runtime
   length.

   Schema-only ship. Asset files (VO MP3s, shader configs)
   and the runtime consumer (Act 6 confession-close handler
   in `Act6CardLadderPage.tsx` or its successor) are
   follow-up PRs. The slot is reserved here so the consumer
   can wire in cleanly.
   ═══════════════════════════════════════════════════════ */

import {
  ACT_6_CONFESSION_STANCE_FLAGS,
  type Act6ConfessionStanceFlag,
} from "./act6CompletionGate";

/** The seven confession-close stances. Mirrors the existing
 *  flag list in `act6CompletionGate.ts`. */
export type Act6ConfessionStance =
  | "empathy"
  | "challenge"
  | "refusal"
  | "reluctant_ally"
  | "partial"
  | "oracle_sense"
  | "practical";

export const ACT_6_CONFESSION_STANCES: readonly Act6ConfessionStance[] = [
  "empathy",
  "challenge",
  "refusal",
  "reluctant_ally",
  "partial",
  "oracle_sense",
  "practical",
] as const;

/** The two listeners whose portraits react. */
export type Act6ConfessionListener = "elara" | "the_human";

export const ACT_6_CONFESSION_LISTENERS: readonly Act6ConfessionListener[] = [
  "elara",
  "the_human",
] as const;

/** Target portrait expression keys. Drawn from the existing
 *  `namedExpressions` set so the cross-fade target is a
 *  well-known portrait state. */
export type Act6CinematicExpression =
  | "neutral"
  | "vulnerable"
  | "concerned"
  | "speaking"
  | "amused";

export interface Act6ConfessionCinematic {
  /** Stable id. Convention: `cinematic_act6_confess_<listener>_<stance>`. */
  id: string;
  listener: Act6ConfessionListener;
  stance: Act6ConfessionStance;
  /** The flag the existing post-stance handler fires; the
   *  runtime consumer dispatches the cinematic BEFORE
   *  setting the flag. Mirrors `act6CompletionGate.ts`. */
  triggerFlag: Act6ConfessionStanceFlag;
  /** Portrait expression to crossfade INTO. */
  crossfadeToExpression: Act6CinematicExpression;
  /** Crossfade duration in milliseconds. */
  crossfadeDurationMs: number;
  /** Pre-recorded VO id. The MP3 lands in the listener's
   *  voManifest as a follow-up; the registry reserves the
   *  slot so the consumer can fetch by id. */
  voId: string;
  /** One-line visual treatment summary. The full direction
   *  is in `docs/design/ACT6_CONFESSION_CINEMATICS.md`. */
  visualTreatment: string;
  /** Total runtime in seconds (crossfade + hold + release). */
  lengthSeconds: number;
}

function flagFor(stance: Act6ConfessionStance): Act6ConfessionStanceFlag {
  return `act6_confession_close_${stance}` as Act6ConfessionStanceFlag;
}

/** The 14-entry registry. Order: all 7 of Elara, then all 7
 *  of The Human, both in canonical stance order (matches
 *  `ACT_6_CONFESSION_STANCES`). */
export const ACT_6_CONFESSION_CINEMATICS: readonly Act6ConfessionCinematic[] = [
  {
    id: "cinematic_act6_confess_elara_empathy",
    listener: "elara",
    stance: "empathy",
    triggerFlag: flagFor("empathy"),
    crossfadeToExpression: "vulnerable",
    crossfadeDurationMs: 200,
    voId: "elara.act6.confession_close.empathy.t1",
    visualTreatment:
      "Crossfade neutral → vulnerable; warm-amber bloom tints portrait edge during the hold.",
    lengthSeconds: 3.5,
  },
  {
    id: "cinematic_act6_confess_elara_challenge",
    listener: "elara",
    stance: "challenge",
    triggerFlag: flagFor("challenge"),
    crossfadeToExpression: "concerned",
    crossfadeDurationMs: 150,
    voId: "elara.act6.confession_close.challenge.t1",
    visualTreatment:
      "Hard cut neutral → concerned; faint cyan ridge pulses once on the portrait frame.",
    lengthSeconds: 4,
  },
  {
    id: "cinematic_act6_confess_elara_refusal",
    listener: "elara",
    stance: "refusal",
    triggerFlag: flagFor("refusal"),
    crossfadeToExpression: "concerned",
    crossfadeDurationMs: 250,
    voId: "elara.act6.confession_close.refusal.t1",
    visualTreatment:
      "Slow crossfade; portrait edge dims by 8% — door closing without slamming.",
    lengthSeconds: 4.5,
  },
  {
    id: "cinematic_act6_confess_elara_reluctant_ally",
    listener: "elara",
    stance: "reluctant_ally",
    triggerFlag: flagFor("reluctant_ally"),
    crossfadeToExpression: "speaking",
    crossfadeDurationMs: 200,
    voId: "elara.act6.confession_close.reluctant_ally.t1",
    visualTreatment:
      "Crossfade with a 3px forward-lean micro-animation; reads as engaged, not passive.",
    lengthSeconds: 3.5,
  },
  {
    id: "cinematic_act6_confess_elara_partial",
    listener: "elara",
    stance: "partial",
    triggerFlag: flagFor("partial"),
    crossfadeToExpression: "vulnerable",
    crossfadeDurationMs: 200,
    voId: "elara.act6.confession_close.partial.t1",
    visualTreatment:
      "Clean crossfade; no bloom, no edge effect. The cleanness is the treatment.",
    lengthSeconds: 4,
  },
  {
    id: "cinematic_act6_confess_elara_oracle_sense",
    listener: "elara",
    stance: "oracle_sense",
    triggerFlag: flagFor("oracle_sense"),
    crossfadeToExpression: "vulnerable",
    crossfadeDurationMs: 250,
    voId: "elara.act6.confession_close.oracle_sense.t1",
    visualTreatment:
      "Crossfade with a single faint violet shimmer crossing the portrait frame (20% peak opacity).",
    lengthSeconds: 4.5,
  },
  {
    id: "cinematic_act6_confess_elara_practical",
    listener: "elara",
    stance: "practical",
    triggerFlag: flagFor("practical"),
    crossfadeToExpression: "neutral",
    crossfadeDurationMs: 200,
    voId: "elara.act6.confession_close.practical.t1",
    visualTreatment:
      "Crossfade; portrait brightness lifts 6% over the hold. No colour shift.",
    lengthSeconds: 3.5,
  },
  {
    id: "cinematic_act6_confess_the_human_empathy",
    listener: "the_human",
    stance: "empathy",
    triggerFlag: flagFor("empathy"),
    crossfadeToExpression: "amused",
    crossfadeDurationMs: 200,
    voId: "the_human.act6.confession_close.empathy.t1",
    visualTreatment:
      "Crossfade; static-shimmer dampens 30% — the lover-route reduces the noise in the signal.",
    lengthSeconds: 3.5,
  },
  {
    id: "cinematic_act6_confess_the_human_challenge",
    listener: "the_human",
    stance: "challenge",
    triggerFlag: flagFor("challenge"),
    crossfadeToExpression: "speaking",
    crossfadeDurationMs: 150,
    voId: "the_human.act6.confession_close.challenge.t1",
    visualTreatment:
      "Hard cut; static-shimmer bumps UP 15% with a faint red rim-light.",
    lengthSeconds: 4,
  },
  {
    id: "cinematic_act6_confess_the_human_refusal",
    listener: "the_human",
    stance: "refusal",
    triggerFlag: flagFor("refusal"),
    crossfadeToExpression: "neutral",
    crossfadeDurationMs: 200,
    voId: "the_human.act6.confession_close.refusal.t1",
    visualTreatment:
      "Crossfade; static-shimmer holds steady; portrait edge cools 8% (mirrors Elara's dim).",
    lengthSeconds: 4.5,
  },
  {
    id: "cinematic_act6_confess_the_human_reluctant_ally",
    listener: "the_human",
    stance: "reluctant_ally",
    triggerFlag: flagFor("reluctant_ally"),
    crossfadeToExpression: "speaking",
    crossfadeDurationMs: 200,
    voId: "the_human.act6.confession_close.reluctant_ally.t1",
    visualTreatment:
      "Crossfade with a 4px eased nod; static-shimmer holds.",
    lengthSeconds: 3.5,
  },
  {
    id: "cinematic_act6_confess_the_human_partial",
    listener: "the_human",
    stance: "partial",
    triggerFlag: flagFor("partial"),
    crossfadeToExpression: "vulnerable",
    crossfadeDurationMs: 250,
    voId: "the_human.act6.confession_close.partial.t1",
    visualTreatment:
      "Slow crossfade; static-shimmer dampens 40% — the strongest dampen in the set.",
    lengthSeconds: 4.5,
  },
  {
    id: "cinematic_act6_confess_the_human_oracle_sense",
    listener: "the_human",
    stance: "oracle_sense",
    triggerFlag: flagFor("oracle_sense"),
    crossfadeToExpression: "amused",
    crossfadeDurationMs: 200,
    voId: "the_human.act6.confession_close.oracle_sense.t1",
    visualTreatment:
      "Crossfade; violet shimmer crosses the portrait frame at 35% peak opacity (more saturated than Elara's).",
    lengthSeconds: 4,
  },
  {
    id: "cinematic_act6_confess_the_human_practical",
    listener: "the_human",
    stance: "practical",
    triggerFlag: flagFor("practical"),
    crossfadeToExpression: "neutral",
    crossfadeDurationMs: 150,
    voId: "the_human.act6.confession_close.practical.t1",
    visualTreatment:
      "Hard cut; static-shimmer dampens 25%; brightness lifts 4%. The shortest in the set.",
    lengthSeconds: 3,
  },
];

/** ID convention regex — exposed so the test file (and any
 *  consumer doing format validation) can share one source. */
export const ACT_6_CONFESSION_CINEMATIC_ID_PATTERN =
  /^cinematic_act6_confess_(elara|the_human)_(empathy|challenge|refusal|reluctant_ally|partial|oracle_sense|practical)$/;

/** Pause inserted between the two listener cinematics so
 *  the player can register Elara's reaction before The
 *  Human's. Spec'd in the design doc §"Sequencing". */
export const ACT_6_CONFESSION_INTER_LISTENER_PAUSE_MS = 500;

/** Look up the cinematic for a (stance, listener) pair.
 *  Returns null if the registry doesn't have an entry —
 *  consumers should treat this as a hard error in
 *  development and a graceful degradation (no portrait
 *  reaction; flag fires immediately) in production. */
export function getCinematicFor(
  stance: Act6ConfessionStance,
  listener: Act6ConfessionListener,
): Act6ConfessionCinematic | null {
  for (const c of ACT_6_CONFESSION_CINEMATICS) {
    if (c.stance === stance && c.listener === listener) return c;
  }
  return null;
}

/** Look up by id. */
export function getCinematicById(id: string): Act6ConfessionCinematic | null {
  for (const c of ACT_6_CONFESSION_CINEMATICS) {
    if (c.id === id) return c;
  }
  return null;
}

/** Resolve the (Elara, The Human) pair to play in sequence
 *  for a given stance. The runtime dispatches them in
 *  order with `ACT_6_CONFESSION_INTER_LISTENER_PAUSE_MS`
 *  between, then sets the existing trigger flag. */
export function getCinematicSequenceForStance(
  stance: Act6ConfessionStance,
): readonly Act6ConfessionCinematic[] {
  const elara = getCinematicFor(stance, "elara");
  const human = getCinematicFor(stance, "the_human");
  const out: Act6ConfessionCinematic[] = [];
  if (elara) out.push(elara);
  if (human) out.push(human);
  return out;
}

/** Re-export the canonical stance-flag list so consumers
 *  can derive the stance from the flag without importing
 *  two modules. */
export { ACT_6_CONFESSION_STANCE_FLAGS };
