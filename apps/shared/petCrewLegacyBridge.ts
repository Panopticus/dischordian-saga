/* ═══════════════════════════════════════════════════════
   PET × CREW LEGACY BRIDGE — Appendix A.6

   Pure-function bridge that merges a Garden pet's traits and
   bond into a crew lineage's next-generation inheritance.
   The pet "retires" into the crew's legacy: its trait
   markers become additional markers on the descendant, and
   a fraction of its stat profile is added to the base stats.

   This is a DATA bridge. It has no side effects. Callers
   (petBonding store, crewGenetics store) own the writeback.
   ═══════════════════════════════════════════════════════ */

/** Genetic stat axes (mirrors crewGenetics.ts GeneticStat). */
export type LegacyStatKey =
  | "resilience"
  | "intellect"
  | "reflexes"
  | "empathy"
  | "immunity"
  | "adaptability";

export interface LegacyPetInput {
  petId: string;
  /** Display name used in lineage log entries. */
  name: string;
  /** 0-100 bond at the moment of retirement. */
  bond: number;
  /** Trait markers (e.g. "adaptive_genome"). */
  traitMarkers: readonly string[];
  /** Optional per-stat contribution. Values in [0, 100]. */
  statContribution?: Partial<Record<LegacyStatKey, number>>;
}

export interface LegacyCrewInput {
  lineageId: string;
  /** Base stats inherited from the current crew member. */
  baseStats: Record<LegacyStatKey, number>;
  /** Existing marker set on the current crew member. */
  markers: readonly string[];
}

export interface LegacyDescendant {
  lineageId: string;
  /** Merged stat profile for the next generation. */
  stats: Record<LegacyStatKey, number>;
  /** Union of crew markers + pet trait markers (deduplicated). */
  markers: readonly string[];
  /** Narrative line for the Chronicle. */
  chronicleLine: string;
}

/**
 * Fraction of pet bond that contributes to the stat merge.
 * At bond 100 the pet adds its full statContribution scaled
 * by 0.25 (quarter of the pet's stats are inherited). At
 * bond 0 nothing carries over — the bridge is narrative only.
 */
const BOND_SCALE_AT_100 = 0.25;

function statContributionFactor(bond: number): number {
  const clamped = Math.max(0, Math.min(100, bond));
  return (clamped / 100) * BOND_SCALE_AT_100;
}

/**
 * Merge a pet's retirement into a crew lineage to produce
 * the next-generation descendant. The pet retains its own
 * entity — this helper does not mutate anything; callers
 * persist both the pet-retired state and the descendant.
 */
export function bridgePetIntoCrewLineage(
  pet: LegacyPetInput,
  crew: LegacyCrewInput,
): LegacyDescendant {
  const factor = statContributionFactor(pet.bond);
  const stats = { ...crew.baseStats };
  if (pet.statContribution) {
    for (const key of Object.keys(pet.statContribution) as LegacyStatKey[]) {
      const contrib = pet.statContribution[key] ?? 0;
      stats[key] = Math.round((stats[key] ?? 0) + contrib * factor);
    }
  }
  const mergedMarkerSet = new Set<string>();
  for (const m of crew.markers) mergedMarkerSet.add(m);
  for (const m of pet.traitMarkers) mergedMarkerSet.add(m);
  return {
    lineageId: crew.lineageId,
    stats,
    markers: [...mergedMarkerSet],
    chronicleLine: buildChronicleLine(pet, crew),
  };
}

function buildChronicleLine(
  pet: LegacyPetInput,
  crew: LegacyCrewInput,
): string {
  if (pet.bond <= 0) {
    return `${pet.name} retired into the ${crew.lineageId} lineage. The bond was not strong; only the name carries over.`;
  }
  if (pet.bond >= 80) {
    return `${pet.name} retired into the ${crew.lineageId} lineage. The bond was deep. The next generation will carry ${pet.name}'s courage in their bones.`;
  }
  return `${pet.name} retired into the ${crew.lineageId} lineage. A quiet passing. The next generation will inherit a little of what ${pet.name} was.`;
}
