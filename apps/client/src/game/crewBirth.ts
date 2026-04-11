/* ═══════════════════════════════════════════════════════
   CREW BIRTH — Client-side offspring generator

   Takes a BreedingResult + parent metadata and produces a
   fully-formed CrewMember ready to be hatched from a pod.
   Kept separate from crewManagement/crewGenetics so both
   the Breeding UI and the Incubator hatch flow can use it.
   ═══════════════════════════════════════════════════════ */

import {
  breedCrewMembers,
  getTemplate,
  type BloodlineId,
  type GeneticStat,
  type BreedingResult,
} from "./crewGenetics";
import {
  generateCrewMember,
  type CrewMember,
} from "./crewManagement";
import type { PendingOffspring, SerializedCrewMember } from "@shared/crewPersistence";

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Walk each parent's ancestry chain to find the lowest common ancestor.
 * Returns the number of generations between the two parents through their
 * shared ancestor — used for the inbreeding penalty decay.
 *
 * - Full siblings (same two parents): returns 0 (strong penalty)
 * - Half-siblings (one shared parent): returns 1
 * - First cousins (share a grandparent): returns 2
 * - Unrelated crew: returns Infinity
 *
 * If both parents belong to the same bloodline but no LCA is found in the
 * tree we've tracked, returns a conservative 3 — enough to decay the base
 * penalty significantly but not fully.
 */
export function generationsSinceShared(
  parent1: SerializedCrewMember | CrewMember,
  parent2: SerializedCrewMember | CrewMember,
  roster: Array<SerializedCrewMember | CrewMember>,
): number {
  if (parent1.id === parent2.id) return 0;

  // Build a quick id→member map
  const byId = new Map(roster.map(m => [m.id, m]));

  // BFS up from each parent, collecting ancestors with their depth.
  function ancestors(start: SerializedCrewMember | CrewMember): Map<string, number> {
    const out = new Map<string, number>();
    const queue: Array<{ id: string; depth: number }> = [{ id: start.id, depth: 0 }];
    while (queue.length > 0) {
      const { id, depth } = queue.shift()!;
      if (out.has(id)) continue;
      out.set(id, depth);
      const m = byId.get(id);
      if (m?.parentIds) {
        for (const pid of m.parentIds) {
          if (pid && !out.has(pid)) queue.push({ id: pid, depth: depth + 1 });
        }
      }
    }
    return out;
  }

  const a1 = ancestors(parent1);
  const a2 = ancestors(parent2);

  // Find the minimum combined depth across shared ancestors
  let best = Infinity;
  for (const [id, d1] of a1) {
    if (id === parent1.id || id === parent2.id) continue;
    const d2 = a2.get(id);
    if (d2 == null) continue;
    const combined = d1 + d2 - 2; // both start at depth 0 (self) — subtract those
    if (combined < best) best = combined;
  }

  // Parent1 is an ancestor of parent2 (or vice versa): treat as immediate incest
  if (a2.has(parent1.id)) return 0;
  if (a1.has(parent2.id)) return 0;

  if (best === Infinity) {
    // No tracked LCA. If both share a bloodline we assume distant kinship;
    // otherwise treat as unrelated (the inbreeding-penalty math short-circuits
    // anyway when bloodlines differ).
    return parent1.bloodlineId === parent2.bloodlineId ? 3 : 99;
  }
  return Math.max(0, best);
}

export function buildPendingOffspring(
  parent1: CrewMember | SerializedCrewMember,
  parent2: CrewMember | SerializedCrewMember,
  roster: Array<CrewMember | SerializedCrewMember> = [],
  seed: number = Date.now(),
  chosenBloodline?: BloodlineId,
): PendingOffspring {
  const gensShared = generationsSinceShared(parent1, parent2, roster);
  const result: BreedingResult = breedCrewMembers(
    parent1.geneticTraits,
    parent2.geneticTraits,
    parent1.stats,
    parent2.stats,
    parent1.bloodlineId,
    parent2.bloodlineId,
    gensShared,
    seed,
  );
  // Child inherits parent1's bloodline by default; the caller can override
  // via `chosenBloodline` to let the player pick which parent's house the
  // child belongs to.
  const bloodlineId = chosenBloodline ?? parent1.bloodlineId;
  const generation = Math.max(parent1.generation, parent2.generation) + 1;

  return {
    id: `offspring-${seed}-${Math.floor(Math.random() * 1_000_000)}`,
    parent1Id: parent1.id,
    parent2Id: parent2.id,
    parent1Name: parent1.name,
    parent2Name: parent2.name,
    createdAt: Date.now(),
    bloodlineId,
    generation,
    stats: result.stats as Record<GeneticStat, number>,
    inheritedTraits: result.inheritedTraits,
    newMutations: result.newMutations,
    geneticFitness: result.geneticFitness,
    inbreedingPenalty: result.inbreedingPenalty,
    reviewed: false,
  };
}

/** Convert a pending-offspring record into a fully-formed CrewMember when it
 *  hatches from the pod. */
export function realizeOffspring(
  pending: PendingOffspring,
  templateId: string,
  currentCycle: number,
): CrewMember {
  const template = getTemplate(templateId);
  const species = template?.species ?? "human";
  return generateCrewMember(
    templateId,
    pending.bloodlineId as BloodlineId,
    pending.generation,
    currentCycle,
    pending.stats,
    [...pending.inheritedTraits, ...pending.newMutations],
    species,
    [pending.parent1Id, pending.parent2Id],
  );
}

/** Direct clone (not from breeding): generates a first-generation member from
 *  a genetic template straight out of the Collector's archive. */
export function cloneFromTemplate(
  templateId: string,
  bloodlineId: BloodlineId,
  currentCycle: number,
  seed: number = Date.now(),
): CrewMember {
  const template = getTemplate(templateId);
  if (!template) throw new Error(`Unknown template: ${templateId}`);
  // Base stats + small variance
  const stats: Record<GeneticStat, number> = {} as Record<GeneticStat, number>;
  const statKeys: GeneticStat[] = [
    "resilience",
    "intellect",
    "reflexes",
    "empathy",
    "immunity",
    "adaptability",
  ];
  for (const s of statKeys) {
    const variance = (seededRandom(seed + s.length * 7) - 0.5) * 12;
    stats[s] = Math.max(5, Math.min(100, Math.round(template.baseStats[s] + variance)));
  }
  return generateCrewMember(
    templateId,
    bloodlineId,
    1,
    currentCycle,
    stats,
    [],
    template.species,
  );
}
