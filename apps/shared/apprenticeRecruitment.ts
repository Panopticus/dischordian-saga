/* ═══════════════════════════════════════════════════════
   APPRENTICE RECRUITMENT — High-Level Wiring

   The single entry-point that wires together every system
   added in this rollout. Callers (server router + UI) use
   recruitApprentice() instead of generateApprentice() when
   the player has a Mechronis transcript and (optionally) a
   Memory Card to consume.

   This file imports from every subsystem so apprentices.ts
   itself stays import-clean (no cycles). Callers should
   prefer this module's API; legacy generateApprentice still
   works for tests and admin tooling.
   ═══════════════════════════════════════════════════════ */

import {
  generateApprentice,
  type Apprentice,
  type ApprenticeArchetype,
  type Rarity,
} from "./apprentices";
import {
  pickArchetypeWeighted,
  seedArchitectInfluence,
  type MechronisGenContext,
  EMPTY_MECHRONIS_CONTEXT,
} from "./apprenticeMechronisLink";
import {
  type DoctrineId,
  doctrineEvilRollMultiplier,
} from "./apprenticeDoctrines";
import {
  type MemoryCard,
  type InheritedTrait,
  buildInheritedTrait,
  isInheritable,
} from "./apprenticeMemoryInheritance";

export interface RecruitInput {
  /** Player's name choice for the apprentice. Falls back to roll. */
  name?: string;
  /** Force a specific archetype (admin / starter unlocks). */
  forceArchetype?: ApprenticeArchetype;
  /** Force a specific rarity (admin only). */
  forceRarity?: Rarity;
  /** Player's Mechronis context. Defaults to empty if player hasn't
   *  enrolled in the Academy yet. */
  mechronisContext?: MechronisGenContext;
  /** Doctrine selected at recruitment. Required for the new pipeline;
   *  legacy callers can omit to recruit a doctrineless apprentice
   *  (Compliant Mouth defaults apply). */
  doctrineId?: DoctrineId;
  /** Memory Card to consume for inheritance. Caller verifies the
   *  card belongs to the player and is inheritable. */
  inheritFrom?: MemoryCard;
  /** Cohort slot to recruit into. Default "active". */
  cohortSlot?: "active" | "training_a" | "training_b";
  /** RNG override — for tests. */
  rng?: () => number;
}

export interface RecruitOutput {
  apprentice: Apprentice;
  /** The inherited trait, if a Memory Card was consumed. */
  inheritedTrait: InheritedTrait | null;
  /** The Memory Card, marked consumed (caller persists). */
  consumedCard: MemoryCard | null;
  /** Diagnostic — why this archetype was picked. */
  rollContext: {
    houseId: string | null;
    topProfessorId: string | null;
    detentionCount: number;
    complianceScore: number;
    finalArchetype: ApprenticeArchetype;
  };
}

/**
 * Recruit an apprentice with the full Mechronis × Doctrine × Inheritance
 * pipeline wired in. The single source of truth for apprentice
 * creation in the new system.
 */
export function recruitApprentice(input: RecruitInput): RecruitOutput {
  const ctx = input.mechronisContext ?? EMPTY_MECHRONIS_CONTEXT;
  const rng = input.rng ?? Math.random;

  // 1. Pick archetype (weighted by Mechronis context unless forced).
  const archetype = input.forceArchetype ?? pickArchetypeWeighted(ctx, rng);

  // 2. Resolve doctrine — caller-supplied or null. The roll-evil
  //    multiplier flows from doctrine.
  const doctrineId = input.doctrineId;
  const evilMult = doctrineId ? doctrineEvilRollMultiplier(doctrineId) : 1.0;

  // 3. Architect Influence seed: from Mechronis context.
  let initialAi = seedArchitectInfluence(ctx);

  // 4. Memory Card inheritance.
  let inheritedTrait: InheritedTrait | null = null;
  let consumedCard: MemoryCard | null = null;
  let initialBond = 0;
  if (input.inheritFrom) {
    if (!isInheritable(input.inheritFrom)) {
      throw new Error(`Memory Card ${input.inheritFrom.id} has already been consumed.`);
    }
    inheritedTrait = buildInheritedTrait(input.inheritFrom);
    initialBond = inheritedTrait.bondFloor;
    initialAi = Math.min(100, initialAi + inheritedTrait.inheritedArchitectInfluence);
    // Caller marks the card consumed by passing it through
    // memoryInheritance.consumeCard() with the new apprentice's id.
    consumedCard = input.inheritFrom;
  }

  // 5. Generate the apprentice with all the bells.
  const apprentice = generateApprentice({
    name: input.name,
    forceArchetype: archetype,
    forceRarity: input.forceRarity,
    mechronisContext: {
      transcript: ctx.transcript,
      playerMorality: ctx.playerMorality,
      inheritedTraitId: inheritedTrait?.fromMemoryCardId,
    },
    weightedArchetype: archetype,
    doctrineId,
    inheritedFromMemoryCardId: inheritedTrait?.fromMemoryCardId,
    initialArchitectInfluence: initialAi,
    initialBond,
    cohortSlot: input.cohortSlot,
    evilRollMultiplier: evilMult,
  });

  return {
    apprentice,
    inheritedTrait,
    consumedCard,
    rollContext: {
      houseId: ctx.transcript.houseId,
      topProfessorId: ctx.transcript.topProfessorId,
      detentionCount: ctx.transcript.detentionCount,
      complianceScore: ctx.transcript.complianceScore,
      finalArchetype: archetype,
    },
  };
}
