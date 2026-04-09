/* ═══════════════════════════════════════════════════════
   PET EVOLUTION SERVICE — 3-stage progression system

   Fragment → Companion → Ascended
   Evolution XP earned from bond actions, battles, daily play.
   Each evolution is a MILESTONE with visual transformation.

   Integrates with:
   - pressureService (evolution feeds dreamer pressure)
   - eidolonBonds table (stage + evolutionXp columns)
   - playerPets table (evolutionStage + evolutionXp columns)
   ═══════════════════════════════════════════════════════ */

import { getDb } from "../db";
import { eidolonBonds, playerPets, notifications } from "../../drizzle/schema";
import { eq, and, sql } from "drizzle-orm";
import { logger } from "../logger";
import { pressureService } from "./pressureService";
import { ripple } from "./rippleEngine";

/** Evolution stage names matching eidolonBonds.stage enum */
type EidolonStage = "fragment" | "companion" | "ascended" | "spectral";

const EVOLUTION_THRESHOLDS: Record<string, number> = {
  "fragment_to_companion": 500,
  "companion_to_ascended": 2000,
};

const STAGE_ORDER: EidolonStage[] = ["fragment", "companion", "ascended"];

function getNextStage(current: EidolonStage): EidolonStage | null {
  if (current === "spectral") return null; // spectral can't evolve
  const idx = STAGE_ORDER.indexOf(current);
  return idx >= 0 && idx < STAGE_ORDER.length - 1 ? STAGE_ORDER[idx + 1] : null;
}

function getThreshold(current: EidolonStage): number {
  const next = getNextStage(current);
  if (!next) return Infinity;
  return EVOLUTION_THRESHOLDS[`${current}_to_${next}`] ?? Infinity;
}

/** Stage-specific abilities unlocked at evolution */
const STAGE_ABILITIES: Record<EidolonStage, string[]> = {
  fragment: ["basic_comfort", "passive_bond"],
  companion: ["active_support", "battle_assist", "emotional_resonance"],
  ascended: ["transcendent_link", "combat_amplify", "memory_share", "prestige_ring"],
  spectral: ["ghost_sight", "death_wisdom", "spectral_boost"],
};

export const petEvolution = {
  /**
   * Add evolution XP to an Eidolon. Called after bond actions.
   * Bond actions grant evolution XP at 50% rate.
   */
  async addEidolonEvolutionXp(userId: number, amount: number, source: string): Promise<{
    added: number;
    evolved: boolean;
    newStage?: string;
  }> {
    const db = await getDb();
    if (!db) return { added: 0, evolved: false };

    const [bond] = await db.select().from(eidolonBonds)
      .where(and(eq(eidolonBonds.userId, userId), eq(eidolonBonds.isSoulBound, true)))
      .limit(1);

    if (!bond || bond.health === "dead") return { added: 0, evolved: false };
    if (bond.stage === "ascended" || bond.stage === "spectral") return { added: amount, evolved: false };

    const newXp = bond.evolutionXp + amount;
    await db.update(eidolonBonds)
      .set({ evolutionXp: newXp })
      .where(eq(eidolonBonds.id, bond.id));

    // Check for evolution
    const threshold = getThreshold(bond.stage as EidolonStage);
    if (newXp >= threshold) {
      return this.evolveEidolon(userId, bond.id);
    }

    return { added: amount, evolved: false };
  },

  /** Evolve an Eidolon to the next stage */
  async evolveEidolon(userId: number, bondId: number): Promise<{
    added: number;
    evolved: boolean;
    newStage?: string;
  }> {
    const db = await getDb();
    if (!db) return { added: 0, evolved: false };

    const [bond] = await db.select().from(eidolonBonds)
      .where(eq(eidolonBonds.id, bondId))
      .limit(1);

    if (!bond) return { added: 0, evolved: false };

    const nextStage = getNextStage(bond.stage as EidolonStage);
    if (!nextStage) return { added: 0, evolved: false };

    const newAbilities = STAGE_ABILITIES[nextStage] ?? [];
    const existingSkills = bond.unlockedSkills ?? [];

    // Update stage, reset evolution XP, unlock new abilities
    await db.update(eidolonBonds)
      .set({
        stage: nextStage,
        evolutionXp: 0,
        unlockedSkills: [...existingSkills, ...newAbilities],
      })
      .where(eq(eidolonBonds.id, bondId));

    // Send evolution notification
    const name = bond.nickname || bond.eidolonId;
    await db.insert(notifications).values({
      userId,
      type: "eidolon_evolved",
      title: `${name} has evolved!`,
      message: `Your companion ${name} has reached the ${nextStage} stage. New abilities unlocked: ${newAbilities.join(", ")}.`,
    });

    // Ripple: evolution event handles pressure + evolution-specific effects
    await ripple.emit("companion_evolved", { userId, eidolonId: bond.eidolonId, newStage: nextStage, bond: bond.bond });

    logger.info(`[PetEvolution] Eidolon ${bond.eidolonId} evolved to ${nextStage} for user ${userId}`);

    return { added: 0, evolved: true, newStage: nextStage };
  },

  /**
   * Add evolution XP to a pet (playerPets table).
   * Separate from Eidolon — arena pets have simpler evolution.
   */
  async addPetEvolutionXp(userId: number, petId: string, amount: number): Promise<{
    added: number;
    evolved: boolean;
    newStage?: number;
  }> {
    const db = await getDb();
    if (!db) return { added: 0, evolved: false };

    const [pet] = await db.select().from(playerPets)
      .where(and(eq(playerPets.userId, userId), eq(playerPets.petId, petId)))
      .limit(1);

    if (!pet || pet.evolutionStage >= 3) return { added: amount, evolved: false };

    const newXp = pet.evolutionXp + amount;
    const threshold = pet.evolutionStage === 1 ? 500 : 2000;

    if (newXp >= threshold) {
      const newStage = pet.evolutionStage + 1;
      await db.update(playerPets)
        .set({ evolutionXp: 0, evolutionStage: newStage })
        .where(and(eq(playerPets.userId, userId), eq(playerPets.petId, petId)));

      await db.insert(notifications).values({
        userId,
        type: "pet_evolved",
        title: `${pet.name} evolved!`,
        message: `${pet.name} has reached evolution stage ${newStage}!`,
      });

      await ripple.emit("companion_evolved", { userId, eidolonId: pet.petId, newStage, bond: 0 });

      return { added: 0, evolved: true, newStage };
    }

    await db.update(playerPets)
      .set({ evolutionXp: newXp })
      .where(and(eq(playerPets.userId, userId), eq(playerPets.petId, petId)));

    return { added: amount, evolved: false };
  },

  /** Get evolution progress for an Eidolon */
  async getEidolonProgress(userId: number): Promise<{
    stage: string;
    xp: number;
    threshold: number;
    nextStage: string | null;
    abilities: string[];
    percentage: number;
  } | null> {
    const db = await getDb();
    if (!db) return null;

    const [bond] = await db.select().from(eidolonBonds)
      .where(and(eq(eidolonBonds.userId, userId), eq(eidolonBonds.isSoulBound, true)))
      .limit(1);

    if (!bond) return null;

    const stage = bond.stage as EidolonStage;
    const next = getNextStage(stage);
    const threshold = getThreshold(stage);

    return {
      stage,
      xp: bond.evolutionXp,
      threshold: threshold === Infinity ? 0 : threshold,
      nextStage: next,
      abilities: STAGE_ABILITIES[stage] ?? [],
      percentage: threshold === Infinity ? 100 : Math.min(100, Math.round((bond.evolutionXp / threshold) * 100)),
    };
  },
};
