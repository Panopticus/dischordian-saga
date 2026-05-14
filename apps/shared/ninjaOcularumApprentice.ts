/* ═══════════════════════════════════════════════════════
   NINJA OCULARUM — FACTION-SPECIFIC APPRENTICE ARCHETYPE
   (PR-5; §XVII plan PR-3B-equivalent, dreamer-canon scoped)

   The Ocularum recruits its apprentices canonically — every
   cell numbered in the continuity log (apps/shared/
   ocularumCanon.ts) was first an apprentice. The recruitment
   doctrine is not the same as the Phase K mainline
   apprentice system (apps/shared/apprentices.ts), which has
   12 personality archetypes that span the saga's factions.

   ninja_ocularum is canonically a SIBLING concept to those
   12 personality archetypes — not a 13th. The mainline 12
   are personality dimensions; ninja_ocularum is a
   FACTION-SPECIFIC discipline. A ninja_ocularum apprentice
   can also be a zealot, a ghost, a scholar — the
   discipline is orthogonal to the personality. The mainline
   pair-bank cross-product (132 pair-banks per Phase K)
   stays intact.

   Per the dreamer canon-lock of 2026-05-14: the
   ninja_ocularum apprentice archetype is the modern
   inheritor of the purple-clad ninja's discipline
   (apps/shared/purpleNinjaCanon.ts). The discipline is
   threefold: form (the body), content (the work), and
   namelessness (the refusal to be named on the Watcher's
   terms — the order's first 'no'). An apprentice cannot
   become a cell until all three are recognized by the
   Coordinator.

   The §XVII plan deferred this archetype three times. The
   deferral was canonically correct: the dreamer's note
   was that the archetype must NOT explode the mainline
   pair-bank cross-product. This module honors that
   deferral by authoring the archetype as a faction-specific
   discipline alongside the mainline 12 — not inside them.
   ═══════════════════════════════════════════════════════ */

import type { ApprenticeArchetype } from "./apprentices";

/**
 * Stages of ninja_ocularum apprenticeship. The order
 * matches the continuity log's three-fold recognition
 * ritual. An apprentice progresses through them; only
 * those who reach `cell_recognized` enter the numbered
 * roster (apps/shared/ocularumCanon.ts).
 */
export type NinjaOcularumStage =
  | "candidate"          // First letter received. Has not yet replied.
  | "form_recognized"    // Body discipline observed by a senior cell.
  | "content_recognized" // First piece of work delivered through the cover.
  | "namelessness_recognized" // Refusal to be named on outside terms (the first 'no').
  | "cell_recognized";   // All three recognized. Cell number assigned.

/**
 * The three pillars of ninja_ocularum discipline. An
 * apprentice's progress is tracked against all three;
 * any pillar can fail or stall independently.
 */
export type NinjaOcularumPillar =
  | "form"           // Physical / craft discipline.
  | "content"        // Operational work — actual missions, actual outputs.
  | "namelessness";  // The doctrinal refusal (apps/shared/purpleNinjaCanon.ts).

export interface NinjaOcularumApprenticeDef {
  /** Stable id. */
  id: "ninja_ocularum";
  /** Display name. */
  name: "Ninja of the Ocularum";
  /** The discipline's modern continuity. */
  inheritedFrom: "the_purple_clad_ninja";
  /** Per-pillar mastery curves. */
  pillars: readonly NinjaOcularumPillar[];
  /** Progression stages. */
  stages: readonly NinjaOcularumStage[];
  /** Whether the discipline composes with the mainline 12 archetypes. */
  composesWithMainlineArchetypes: true;
  /** Which mainline archetypes are canonically over-represented
   *  among ninja_ocularum apprentices. Per dreamer canon-lock:
   *  ghost (the silent register matches the namelessness pillar)
   *  and sentinel (the duty-language matches the form pillar). */
  affinityArchetypes: readonly ApprenticeArchetype[];
  /** Which mainline archetypes the discipline rarely produces.
   *  Per dreamer canon-lock: jester (barbed wit conflicts with
   *  the namelessness pillar — humor weaponized is a NAME for
   *  the joke). */
  rareArchetypes: readonly ApprenticeArchetype[];
  /** Apprentice-side voice direction. */
  voiceDirection: string;
  /** Breaking point (canonical failure mode). */
  breakingPoint: string;
  /** Date canon-locked (ISO). */
  canonLockedAt: "2026-05-14";
}

/**
 * THE NINJA OCULARUM APPRENTICE ARCHETYPE.
 *
 * Faction-specific discipline that composes with the 12
 * mainline personality archetypes. An apprentice's mainline
 * archetype (e.g., ghost) determines their PERSONALITY; their
 * ninja_ocularum status determines their FACTION DISCIPLINE.
 */
export const NINJA_OCULARUM_APPRENTICE: NinjaOcularumApprenticeDef = {
  id: "ninja_ocularum",
  name: "Ninja of the Ocularum",
  inheritedFrom: "the_purple_clad_ninja",
  pillars: ["form", "content", "namelessness"] as const,
  stages: [
    "candidate",
    "form_recognized",
    "content_recognized",
    "namelessness_recognized",
    "cell_recognized",
  ] as const,
  composesWithMainlineArchetypes: true,
  affinityArchetypes: ["ghost", "sentinel"] as const,
  rareArchetypes: ["jester"] as const,
  voiceDirection:
    "Spare. Present-tense. Never volunteers detail. Speaks only " +
    "when the speaking advances the work. Uses the seal, not the " +
    "signature. Recognizes other cells by their bows before they " +
    "use their voices. Reads silence as the operational default.",
  breakingPoint:
    "Discovering that the Coordinator above them is canonically " +
    "compromised — that the seal they were recognizing was being " +
    "moved by hands outside the chain. The discipline survives the " +
    "discovery; the apprentice rarely does. Most who reach " +
    "namelessness_recognized never reach cell_recognized.",
  canonLockedAt: "2026-05-14",
} as const;

/**
 * Per-stage canonical narration. Used by NPC dialog modules
 * and the apprentice-progression overlay to surface the
 * three-fold recognition ritual diegetically.
 */
export const NINJA_OCULARUM_STAGE_NARRATION: Record<NinjaOcularumStage, string> = {
  candidate:
    "A letter signed only with a seal. The candidate has not yet replied. " +
    "The continuity log records the letter as sent; the reply is the first " +
    "evidence of recognition.",
  form_recognized:
    "A senior cell has watched the candidate move and reported the form. " +
    "The report is the recognition. The candidate is not informed.",
  content_recognized:
    "A piece of work has been completed through the cover. The work is " +
    "filed; the cover holds; the candidate's name is not attached. The " +
    "Coordinator reads the file and recognizes the content.",
  namelessness_recognized:
    "The candidate has refused to be named on outside terms. The refusal " +
    "is the recognition. The Coordinator's note in the log reads only: " +
    "'the first no.'",
  cell_recognized:
    "Cell number assigned. Continuity log updated. The candidate is now a " +
    "cell; the cell is now in the chain. The chair waits for them on the " +
    "night of cell-binding.",
};

/**
 * Coverage metric for the parity gate. Each pillar must have
 * a per-stage narration line. Used by the ninja_ocularum
 * parity check.
 */
export function getNinjaOcularumStageCoverage(): number {
  return Object.keys(NINJA_OCULARUM_STAGE_NARRATION).length;
}

/**
 * Canon assertion: a ninja_ocularum apprentice's mainline
 * personality archetype is independent of the discipline.
 * Modules that try to make ninja_ocularum a 13th personality
 * archetype violate this canon-lock.
 */
export const NINJA_OCULARUM_IS_FACTION_DISCIPLINE_NOT_PERSONALITY = true as const;
