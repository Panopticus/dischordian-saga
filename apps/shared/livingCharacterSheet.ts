/**
 * Living Character Sheet — shared view model.
 *
 * Pure projection of game state into the dossier the
 * `<LivingCharacterSheet />` component renders. The art
 * brief in `docs/production/LIVING_CHARACTER_SHEET_ART_BRIEF.md`
 * describes a sheet that stays *alive* between play sessions —
 * the morality bar drifts, the bond bars breathe, and the flavor
 * line shifts when the player crosses a threshold.
 *
 * This module owns the assembly logic and the flavor-line
 * selection. It is intentionally pure (no side effects, no IO)
 * so it can be exercised from unit tests without React, and so
 * the component can be a plain renderer.
 *
 * Two systems feed in:
 *   1. The legacy moral meter (`moralityScore`, -100..+100) split
 *      into a light/dark visualization.
 *   2. The seven-axis psych profile (`PlayerProfile`, -100..+100
 *      per axis). The profile tracks *how* the player plays; the
 *      moral meter tracks *what* they did.
 *
 * The output is a flat, serialisable shape that animates well
 * (every numeric field is what `framer-motion`'s `animate` can
 * tween directly).
 */

import type { PlayerProfile, ProfileAxis } from "./playerProfile";
import { PROFILE_AXES, magnitudeOf } from "./playerProfile";

/** A snapshot of the player's current dossier. Pure data — no
 *  React, no DOM, no functions. Safe to serialise to JSON. */
export interface LivingCharacterSheet {
  citizenName: string;
  species: string;
  characterClass: string;
  alignment: "order" | "chaos" | "balanced";
  element?: string;
  level: number;
  /** Light/dark split derived from the morality meter. Each side
   *  is 0..100; their sum is always ≤ 100 (the gap is "neutral"). */
  morality: { light: number; dark: number };
  /** Bond strengths with the two protagonists (0..100). */
  bonds: { elara: number; human: number };
  /** Seven-axis psych profile, each -100..+100. Empty when the
   *  profile is null (player has no recorded events). */
  psychAxes: Record<ProfileAxis, number>;
  prestigeTier: number;
  cardCount: number;
  /** A short flavor line that updates with morality / bonds.
   *  Ten words max. Drives the crossfade footer. */
  flavorLine: string;
}

/** The minimal slice of game state needed to build a sheet. */
export interface LivingCharacterSheetInput {
  citizenName: string;
  species: string | null;
  characterClass: string | null;
  alignment: "order" | "chaos" | null;
  element?: string | null;
  /** Aggregate level — sum of `attr*` or whatever the caller
   *  considers the player's "level". Floored before display. */
  level: number;
  /** The morality meter, -100 (machine/dark) .. +100 (humanity/light). */
  moralityScore: number;
  /** Number of cards collected (used for the dossier ribbon). */
  cardCount: number;
  /** Prestige tier; 0 = never prestiged. */
  prestigeTier: number;
}

/** Build a sheet from the smallest possible cross-section of
 *  game state. The function is pure — same inputs, same output.
 *
 *  @param input  Citizen identity + aggregate stats.
 *  @param trust  Bond scalars per protagonist (0..100).
 *  @param profile  Seven-axis psych profile, or null when the
 *                  player has no recorded events.
 */
export function buildLivingCharacterSheet(
  input: LivingCharacterSheetInput,
  trust: { elara: number; human: number },
  profile: PlayerProfile | null,
): LivingCharacterSheet {
  const morality = splitMorality(input.moralityScore);
  const bonds = {
    elara: clamp(Math.round(trust.elara), 0, 100),
    human: clamp(Math.round(trust.human), 0, 100),
  };
  const psychAxes = readProfileAxes(profile);
  const alignment: LivingCharacterSheet["alignment"] =
    input.alignment ?? "balanced";

  return {
    citizenName: input.citizenName.trim() || "Unnamed Potential",
    species: capitalize(input.species ?? "Unknown"),
    characterClass: capitalize(input.characterClass ?? "Unaligned"),
    alignment,
    element: input.element ?? undefined,
    level: Math.max(1, Math.floor(input.level)),
    morality,
    bonds,
    psychAxes,
    prestigeTier: Math.max(0, Math.floor(input.prestigeTier)),
    cardCount: Math.max(0, Math.floor(input.cardCount)),
    flavorLine: pickFlavorLine(morality, bonds, psychAxes),
  };
}

/** Split the [-100, +100] morality meter into independent
 *  light/dark scalars (0..100). Negative scores feed the dark
 *  side, positive feed the light, zero is fully neutral. */
export function splitMorality(score: number): { light: number; dark: number } {
  const clamped = clamp(score, -100, 100);
  if (clamped >= 0) {
    return { light: Math.round(clamped), dark: 0 };
  }
  return { light: 0, dark: Math.round(-clamped) };
}

/** Read all seven profile axes into a flat record, defaulting
 *  to neutral (0) when the profile hasn't been initialised. */
function readProfileAxes(
  profile: PlayerProfile | null,
): Record<ProfileAxis, number> {
  const out = {} as Record<ProfileAxis, number>;
  for (const axis of PROFILE_AXES) {
    const v = profile ? profile[axis] : 0;
    out[axis] = clamp(Math.round(v), -100, 100);
  }
  return out;
}

/** Choose the flavor line that best captures the dossier's
 *  current emotional state. Crossfaded by the renderer when the
 *  output changes. Order: bond extremes win first, then strong
 *  morality, then a psych-axis read, then a calm fallback.
 *
 *  Exported for testability — the component does not call this
 *  directly; it consumes `flavorLine` off the assembled sheet. */
export function pickFlavorLine(
  morality: { light: number; dark: number },
  bonds: { elara: number; human: number },
  psych: Record<ProfileAxis, number>,
): string {
  // Strong narrator bonds carry the loudest narrative weight.
  if (bonds.elara >= 80 && bonds.human >= 80) {
    return "Both narrators trust you with the truth.";
  }
  if (bonds.elara >= 80) {
    return "Elara's voice steadies whenever you arrive.";
  }
  if (bonds.human >= 80) {
    return "The Human chooses to stay visible for you.";
  }

  // Moral extremes next.
  if (morality.light >= 70) {
    return "You walk lit corridors and others follow.";
  }
  if (morality.dark >= 70) {
    return "The dark suits you. It always has.";
  }

  // Psych-axis flair — which trait is loudest?
  const dominant = dominantAxis(psych);
  if (dominant) {
    return AXIS_FLAVOR[dominant.axis][dominant.sign];
  }

  // Calm baseline.
  return "The Ark remembers every step you take.";
}

interface AxisRead {
  axis: ProfileAxis;
  sign: "positive" | "negative";
}

/** Return the axis with the largest absolute value, only when
 *  it crosses the "moderate" threshold (|value| ≥ 34). Returns
 *  null when the profile is too quiet to read. */
function dominantAxis(
  psych: Record<ProfileAxis, number>,
): AxisRead | null {
  let best: AxisRead | null = null;
  let bestMag = 33; // require at least "moderate" magnitude
  for (const axis of PROFILE_AXES) {
    const v = psych[axis];
    const m = magnitudeOf(v);
    if (m === "neutral") continue;
    const abs = Math.abs(v);
    if (abs > bestMag) {
      bestMag = abs;
      best = { axis, sign: v >= 0 ? "positive" : "negative" };
    }
  }
  return best;
}

/** Per-axis flavor lines for both poles. Hand-authored to read
 *  like dossier annotations, not stat readouts. */
const AXIS_FLAVOR: Record<
  ProfileAxis,
  { positive: string; negative: string }
> = {
  aggression: {
    positive: "You favor the strike before the question.",
    negative: "You hold the blow until it is necessary.",
  },
  mercy: {
    positive: "The mercy in your hand is well-known here.",
    negative: "You have stopped flinching at the cost.",
  },
  curiosity: {
    positive: "Every door is a question you must open.",
    negative: "You have stopped asking what is behind doors.",
  },
  conformity: {
    positive: "You move where the path is already worn.",
    negative: "The path is always one you write yourself.",
  },
  vigilance: {
    positive: "You read the room before you enter it.",
    negative: "You trust strangers faster than is safe.",
  },
  vulnerability: {
    positive: "You have learned to let others in.",
    negative: "Your shoulders are still set against the wind.",
  },
  wit: {
    positive: "Your replies arrive a half-step ahead of silence.",
    negative: "You answer in weight, not in words.",
  },
};

function clamp(value: number, lo: number, hi: number): number {
  if (!Number.isFinite(value)) return lo;
  return Math.max(lo, Math.min(hi, value));
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
