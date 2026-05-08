/**
 * Commons scene coverage — ratcheted parity.
 *
 * The plan target is ~120 scenes covering apprentice × apprentice and
 * apprentice × recruited-NPC pairings. We declare the target surface as
 * the union of:
 *   12 archetypes × 11 archetypes / 2 = 66 archetype pairs
 *   12 archetypes × 5 recruited NPCs       = 60 archetype-NPC pairs
 *                                           = 126 declared pairings.
 *
 * A pairing is "implemented" if at least 1 scene in
 * commonsScenePool.ts has both participants present (either as a
 * 2-pair or in a triad). Triads count for all three pairwise edges.
 *
 * Ratcheted — full coverage is a long-tail authoring goal; the gate
 * just enforces no-regress.
 */
import type { RawParityCount } from "../types";

const ARCHETYPES = [
  "zealot",
  "ghost",
  "scholar",
  "revenant",
  "artisan",
  "oracle",
  "wanderer",
  "martyr",
  "heretic",
  "jester",
  "sentinel",
  "prodigal",
] as const;

const NPC_KEYS = [
  "vex_solene",
  "wraith_calder",
  "locke",
  "jericho_jones",
  "akai_shi",
] as const;

export async function checkCommonsSceneCoverage(): Promise<RawParityCount> {
  const sceneMod = await import("../../commonsScenePool");
  const pool = sceneMod.COMMONS_SCENE_POOL;

  const covered = new Set<string>();
  for (const scene of pool) {
    const participants = scene.participants;
    for (let i = 0; i < participants.length; i++) {
      for (let j = i + 1; j < participants.length; j++) {
        const a = participants[i];
        const b = participants[j];
        const k = [a, b].sort().join("|");
        covered.add(k);
      }
    }
  }

  const declaredPairings: string[] = [];
  for (let i = 0; i < ARCHETYPES.length; i++) {
    for (let j = i + 1; j < ARCHETYPES.length; j++) {
      declaredPairings.push([ARCHETYPES[i], ARCHETYPES[j]].sort().join("|"));
    }
  }
  for (const arch of ARCHETYPES) {
    for (const npc of NPC_KEYS) {
      declaredPairings.push([arch, npc].sort().join("|"));
    }
  }

  const missing = declaredPairings.filter((p) => !covered.has(p));

  return {
    declared: declaredPairings.length,
    implemented: declaredPairings.length - missing.length,
    missing: missing.slice(0, 12),
  };
}
