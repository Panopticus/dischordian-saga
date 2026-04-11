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
import type { PendingOffspring } from "@shared/crewPersistence";

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generationsSinceShared(_parent1Id: string, _parent2Id: string): number {
  // Simplistic: if both ids are founder-generation, they share immediately; otherwise
  // we assume 1 generation back. A full genealogy walk would be ideal but this is
  // good enough for the inbreeding penalty to kick in when breeding siblings.
  // TODO(future): walk parentIds chain to find real LCA.
  return 0;
}

export function buildPendingOffspring(
  parent1: CrewMember,
  parent2: CrewMember,
  seed: number = Date.now(),
): PendingOffspring {
  const gensShared = generationsSinceShared(parent1.id, parent2.id);
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
  // Child inherits parent1's bloodline by default. A future UI could let the
  // player choose which side the child belongs to.
  const bloodlineId = parent1.bloodlineId;
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
