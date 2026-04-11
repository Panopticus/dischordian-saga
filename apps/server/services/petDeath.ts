/* ═══════════════════════════════════════════════════════
   PET DEATH SERVICE

   Parallel to `companionDeath` (for Eidolons) but scoped to
   the playerPets table. When a pet dies in an arena match
   (losses stacking past a threshold, lethal injury hook, or
   an explicit sacrifice), this service marks the pet as
   spectral, stamps a death cause, and emits a notification.

   Spectral pets retain bond and can be revived via the
   existing `revivePet` mutation — but with heavier bond loss
   and an optional extra dream cost per death. The spectral
   form grants a +10% bonus to the `pet_battles` system,
   mirroring companionDeath's spectralBonusSystem column.

   Integrates with:
   - playerPets table (deathCount, isSpectral,
     spectralBonusSystem, deathCause, injuredUntil)
   - notifications table (death announcement)
   - pressureService (pet death feeds Necromancer)
   ═══════════════════════════════════════════════════════ */

import { getDb } from "../db";
import { playerPets, notifications } from "../../db/schema";
import { eq, and } from "drizzle-orm";
import { logger } from "../logger";
import { pressureService } from "./pressureService";

export type PetDeathCause =
  | "arena_lethal"   // HP hit zero in the arena
  | "injury_escalation" // Accumulated injuries crossed the death threshold
  | "sacrifice"      // Player voluntarily sacrificed
  | "necromancer";   // Consumed by a Necromancer event

export const petDeath = {
  /**
   * Mark a pet as dead + spectral. Returns whether the death was
   * applied and the resulting death count.
   */
  async killPet(
    userId: number,
    petId: string,
    cause: PetDeathCause,
  ): Promise<{
    success: boolean;
    deathCount: number;
    isSpectral: boolean;
    error?: string;
  }> {
    const db = await getDb();
    if (!db) return { success: false, deathCount: 0, isSpectral: false, error: "Database unavailable" };

    const [pet] = await db
      .select()
      .from(playerPets)
      .where(and(eq(playerPets.userId, userId), eq(playerPets.petId, petId)));

    if (!pet) return { success: false, deathCount: 0, isSpectral: false, error: "Pet not found" };
    // Blood sacrifice = permanent. No spectral form.
    const becomesSpectral = cause !== "sacrifice";

    const newDeathCount = pet.deathCount + 1;

    await db
      .update(playerPets)
      .set({
        currentHp: 0,
        isSpectral: becomesSpectral,
        spectralBonusSystem: becomesSpectral ? "pet_battles" : null,
        deathCause: cause,
        deathCount: newDeathCount,
        injuredUntil: becomesSpectral ? null : new Date(Date.now() + 24 * 60 * 60_000),
      })
      .where(and(eq(playerPets.userId, userId), eq(playerPets.petId, petId)));

    // Notify player
    await db.insert(notifications).values({
      userId,
      type: "pet_death",
      title: `${pet.name} has fallen`,
      message: becomesSpectral
        ? `${pet.name} has perished but returns as a spectral specimen. Their bond and memories persist. They grant +10% rewards in the Arena from beyond.`
        : `${pet.name} has been sacrificed. The bond is severed. The Necromancer takes notice.`,
    });

    // Pressure: pet death feeds Necromancer
    pressureService.recordAction(userId, "pet_death").catch(() => {});

    logger.info(`[PetDeath] ${pet.name} died for user ${userId}, cause: ${cause}, spectral: ${becomesSpectral}`);

    return {
      success: true,
      deathCount: newDeathCount,
      isSpectral: becomesSpectral,
    };
  },

  /**
   * Revival helper that complements petBattles.revivePet: called by
   * the router after Dream tokens are debited. This strips spectral
   * state + restores HP. Split out so a future questline can also
   * call it without going through the token path.
   */
  async restorePet(userId: number, petId: string): Promise<boolean> {
    const db = await getDb();
    if (!db) return false;

    const [pet] = await db
      .select()
      .from(playerPets)
      .where(and(eq(playerPets.userId, userId), eq(playerPets.petId, petId)));

    if (!pet) return false;

    await db
      .update(playerPets)
      .set({
        currentHp: pet.maxHp,
        isSpectral: false,
        spectralBonusSystem: null,
        deathCause: null,
        injuredUntil: null,
      })
      .where(and(eq(playerPets.userId, userId), eq(playerPets.petId, petId)));

    return true;
  },

  /**
   * Returns the spectral reward bonus (percent) for the `pet_battles`
   * system, summed across all spectral pets the player owns. Called
   * by submitBattleResult to amplify dream/xp rewards.
   */
  async getSpectralPetBonus(userId: number): Promise<number> {
    const db = await getDb();
    if (!db) return 0;

    const spectralPets = await db
      .select()
      .from(playerPets)
      .where(and(eq(playerPets.userId, userId), eq(playerPets.isSpectral, true)));

    // Each spectral pet grants +10% to pet_battles rewards, capped at +40%
    // so the system can't be exploited by deliberately killing every pet.
    const raw = spectralPets.length * 10;
    return Math.min(40, raw);
  },
};
