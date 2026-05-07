/* ═══════════════════════════════════════════════════════
   COLLECTOR'S WORK MISSIONS — skeleton (Wave 6)

   Mission generator for the Crew-Bene-Gesserit Breeding
   Program. Per Testament v2 §VI Part 4: "the Collector's
   Work was always the Advocate's letter to the future."
   The mission cards are written in the Advocate's voice
   and surfaced by the Collector — every mission is one
   instruction left for the player by a being who sealed
   herself before they were born.

   Wave 6 ships the type system + a deterministic generator
   that issues one mission per ritual cycle. The full
   mission-card UI, ferry-system across player Arks, and
   bloodline_registry DB integration land in subsequent
   PRs (per the plan §3A).
   ═══════════════════════════════════════════════════════ */

import {
  BLOOD_CLASSIFICATIONS,
  CRYSTAL_YIELD_PER_CYCLE,
  type BloodClassification,
} from "./bloodClassification";

/** Difficulty tier of a Collector's Work mission. The tier
 *  scales mission text intensity + the crystal-yield bonus
 *  the player earns on completion. */
export type CollectorsWorkTier = "trivial" | "modest" | "patient" | "rare" | "apex";

/** A single mission card. The text is in the Advocate's voice
 *  — the mission-card renderer surfaces it in her register
 *  (cobalt-skinned narrator portrait, deep-navy chrome). */
export interface CollectorsWorkMission {
  /** Stable id, e.g. "cw_pure_g1". */
  readonly id: string;
  /** Title shown on the mission card. */
  readonly title: string;
  /** Body text — the Advocate's instruction. */
  readonly body: string;
  /** Bloodline this mission targets. */
  readonly classification: BloodClassification;
  /** Generation number the mission unlocks at (1-indexed). */
  readonly atGeneration: number;
  /** Tier — drives difficulty rendering + bonus yield. */
  readonly tier: CollectorsWorkTier;
  /** Bonus crystal yield on completion (added to the per-
   *  cycle base yield from CRYSTAL_YIELD_PER_CYCLE). */
  readonly bonusCrystalYield: number;
}

/** Bonus yield by tier. Trivial missions add a token bonus;
 *  apex missions roughly double the per-cycle base. */
export const COLLECTORS_WORK_TIER_BONUS: Readonly<
  Record<CollectorsWorkTier, number>
> = Object.freeze({
  trivial: 1,
  modest: 2,
  patient: 4,
  rare: 6,
  apex: 12,
});

/** Choose a tier for a generation. Early generations are easier
 *  (lower tier); later generations escalate. Pure / linear — a
 *  more elaborate scheduler can replace this without changing
 *  the mission shape. */
function tierForGeneration(generation: number): CollectorsWorkTier {
  if (generation <= 1) return "trivial";
  if (generation <= 2) return "modest";
  if (generation <= 4) return "patient";
  if (generation <= 6) return "rare";
  return "apex";
}

/** Fixed body text per classification. Wave 6 ships a single
 *  Advocate-voiced line per bloodline; the mission card varies
 *  by generation (number suffixed). Replace with a generator
 *  when content authoring catches up. */
const ADVOCATE_VOICE_BY_CLASSIFICATION: Readonly<
  Record<BloodClassification, string>
> = Object.freeze({
  PURE:
    "Keep the bloodline clean for one more turning. Patience is a discipline. So is silence.",
  HYBRID:
    "Find the line where two strains meet without arguing. The crystal grows in the seam.",
  DEMONIC:
    "I do not forbid this work. I do warn you what every cycle costs the carrier. Read your own ledger first.",
  ADVOCATE:
    "If you are reading this on an ADVOCATE-bloodline cycle, then a part of me is in the room with you. Be kind to that part.",
  SAMSARA:
    "The wheel turns. Help one carrier remember a previous turn. The ritual completes when one memory aligns.",
  NAMED:
    "Record the name. Repeat the name. The bloodline that remembers its names is the bloodline that survives the Hierarchy.",
  UNKNOWN:
    "Catalogue what you can. Leave what you cannot. The Chronicle has space for both.",
});

/** Total per-cycle yield = base (per-classification) + tier bonus.
 *  Shared so the Collector's-study UI can render the full number
 *  on the mission card without duplicating the formula. */
export function totalCrystalYieldForMission(
  mission: CollectorsWorkMission,
): number {
  return CRYSTAL_YIELD_PER_CYCLE[mission.classification] + mission.bonusCrystalYield;
}

/** Generate a mission for a (classification, generation) pair.
 *  Pure / deterministic — same inputs always yield the same
 *  mission. Suitable for a server-side scheduler that issues
 *  one mission per ritual cycle. */
export function generateCollectorsWorkMission(
  classification: BloodClassification,
  generation: number,
): CollectorsWorkMission {
  const tier = tierForGeneration(generation);
  return {
    id: `cw_${classification.toLowerCase()}_g${generation}`,
    title: `Collector's Work — ${classification} · Generation ${generation}`,
    body: ADVOCATE_VOICE_BY_CLASSIFICATION[classification],
    classification,
    atGeneration: generation,
    tier,
    bonusCrystalYield: COLLECTORS_WORK_TIER_BONUS[tier],
  };
}

/** Enumerate every classification with a mission for a given
 *  generation. Used by the Collector's study UI to surface a
 *  per-bloodline grid. */
export function generateMissionsForGeneration(
  generation: number,
): readonly CollectorsWorkMission[] {
  return BLOOD_CLASSIFICATIONS.map((c) =>
    generateCollectorsWorkMission(c, generation),
  );
}
