/* ═══════════════════════════════════════════════════════
   COMPANION DEATH SERVICE — Death, Spectral Form, Resurrection

   When a companion dies, it becomes spectral:
   - Ghost-blue visual overlay
   - Retains ALL memories and personality
   - Gains +10% bonus to the game system where it died
   - Strongly feeds Necromancer pressure (death = his currency)

   Resurrection requires Necromancer Holocron + quest chain.

   Integrates with:
   - pressureService (death → necromancer, EIDOLON_DEATH_PRESSURE)
   - eidolonBonds table (health, isSpectral, deathCause, spectralBonusSystem)
   - eidolonMemorial table (permanent death records)
   - notifications table (death announcements)
   ═══════════════════════════════════════════════════════ */

import { getDb } from "../db";
import { eidolonBonds, eidolonMemorial, notifications } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { logger } from "../logger";
import { pressureService } from "./pressureService";
import { ripple } from "./rippleEngine";
import { EIDOLON_DEATH_PRESSURE } from "@shared/livingUniverseEvents";

export type DeathCause = "combat" | "severing" | "sacrifice" | "death_hook" | "strain_symbiosis";

/** Maps death context to spectral bonus system */
const DEATH_CONTEXT_TO_SYSTEM: Record<string, string> = {
  combat: "fight",
  pet_battle: "pet_battles",
  terminus: "terminus_swarm",
  sacrifice: "card_game",
  severing: "chess",
  death_hook: "all",
  strain_symbiosis: "crafting",
};

export const companionDeath = {
  /**
   * Kill a companion. Creates spectral form (unless sacrifice Path C).
   * This is one of the most emotionally significant events in the game.
   */
  async killCompanion(userId: number, cause: DeathCause, context?: string): Promise<{
    success: boolean;
    isSpectral: boolean;
    spectralBonusSystem: string | null;
    memorialCreated: boolean;
  }> {
    const db = await getDb();
    if (!db) return { success: false, isSpectral: false, spectralBonusSystem: null, memorialCreated: false };

    const [bond] = await db.select().from(eidolonBonds)
      .where(and(eq(eidolonBonds.userId, userId), eq(eidolonBonds.isSoulBound, true)))
      .limit(1);

    if (!bond) return { success: false, isSpectral: false, spectralBonusSystem: null, memorialCreated: false };
    if (bond.health === "dead") return { success: false, isSpectral: false, spectralBonusSystem: null, memorialCreated: false };

    // Blood sacrifice Path C = no spectral form (permanent death)
    const becomesSpectral = cause !== "sacrifice";
    const spectralSystem = becomesSpectral
      ? (DEATH_CONTEXT_TO_SYSTEM[context ?? cause] ?? "all")
      : null;

    // 1. Mark as dead + spectral
    await db.update(eidolonBonds)
      .set({
        health: "dead",
        deathCause: cause,
        isSpectral: becomesSpectral,
        spectralBonusSystem: spectralSystem,
        stage: becomesSpectral ? "spectral" : bond.stage,
        deathCount: bond.deathCount + 1,
        diedAt: new Date(),
      })
      .where(eq(eidolonBonds.id, bond.id));

    // 2. Create memorial entry
    const name = bond.nickname || bond.eidolonId;
    const daysActive = Math.floor((Date.now() - bond.boundAt.getTime()) / 86400000);
    await db.insert(eidolonMemorial).values({
      userId,
      eidolonId: bond.eidolonId,
      eidolonName: name,
      bondAtDeath: bond.bond,
      causeOfDeath: cause,
      daysActive,
    });

    // 3. Send death notification
    await db.insert(notifications).values({
      userId,
      type: "companion_death",
      title: `${name} has fallen`,
      message: becomesSpectral
        ? `${name} has perished but remains as a spectral companion. Their bond, memories, and personality persist. They grant +10% to ${spectralSystem} from beyond.`
        : `${name} has been sacrificed. Their bond is severed permanently. The Necromancer takes notice.`,
    });

    // 4. Ripple: companion death handles pressure + soul-bond lore notification
    const bondData = bond;
    await ripple.emit("companion_died", { userId, eidolonId: bondData.eidolonId, name, cause, wasSoulBound: bondData.isSoulBound, bond: bondData.bond });

    logger.info(`[CompanionDeath] ${name} died for user ${userId}, cause: ${cause}, spectral: ${becomesSpectral}`);

    return {
      success: true,
      isSpectral: becomesSpectral,
      spectralBonusSystem: spectralSystem,
      memorialCreated: true,
    };
  },

  /** Check if companion is spectral */
  async isSpectral(userId: number): Promise<boolean> {
    const db = await getDb();
    if (!db) return false;

    const [bond] = await db.select({ isSpectral: eidolonBonds.isSpectral })
      .from(eidolonBonds)
      .where(and(eq(eidolonBonds.userId, userId), eq(eidolonBonds.isSoulBound, true)))
      .limit(1);

    return bond?.isSpectral ?? false;
  },

  /**
   * Get spectral bonus for a game system.
   * Returns 10% bonus if companion died in that system.
   */
  async getSpectralBonus(userId: number, gameSystem: string): Promise<number> {
    const db = await getDb();
    if (!db) return 0;

    const [bond] = await db.select({
      isSpectral: eidolonBonds.isSpectral,
      spectralBonusSystem: eidolonBonds.spectralBonusSystem,
    }).from(eidolonBonds)
      .where(and(eq(eidolonBonds.userId, userId), eq(eidolonBonds.isSoulBound, true)))
      .limit(1);

    if (!bond?.isSpectral) return 0;
    if (bond.spectralBonusSystem === "all" || bond.spectralBonusSystem === gameSystem) return 10;
    return 0;
  },

  /**
   * Resurrect a companion. Requires Necromancer Holocron item.
   * Removes death state, restores to healthy, clears spectral.
   */
  async resurrect(userId: number, method: "holocron" | "quest" | "admin"): Promise<{
    success: boolean;
    error?: string;
  }> {
    const db = await getDb();
    if (!db) return { success: false, error: "Database unavailable" };

    const [bond] = await db.select().from(eidolonBonds)
      .where(and(eq(eidolonBonds.userId, userId), eq(eidolonBonds.isSoulBound, true)))
      .limit(1);

    if (!bond) return { success: false, error: "No soul-bound companion found" };
    if (bond.health !== "dead") return { success: false, error: "Companion is not dead" };

    // Blood sacrifice = permanent (no resurrection)
    if (bond.deathCause === "sacrifice") {
      return { success: false, error: "Sacrificed companions cannot be resurrected. The price was paid." };
    }

    // Restore to healthy, previous stage (not spectral)
    const restoredStage = bond.stage === "spectral"
      ? (bond.deathCount > 1 ? "companion" : "fragment") // Demote slightly on resurrection
      : bond.stage;

    await db.update(eidolonBonds)
      .set({
        health: "healthy",
        isSpectral: false,
        spectralBonusSystem: null,
        deathCause: null,
        stage: restoredStage,
        injury: 0,
      })
      .where(eq(eidolonBonds.id, bond.id));

    const name = bond.nickname || bond.eidolonId;
    await db.insert(notifications).values({
      userId,
      type: "companion_resurrected",
      title: `${name} returns`,
      message: `${name} has been resurrected through the ${method}. Their bond and memories remain intact, but the experience has changed them.`,
    });

    // Pressure: resurrection = healing
    await pressureService.increment(userId, "healingDone", 50, `companion_resurrect_${method}`);

    logger.info(`[CompanionDeath] ${name} resurrected for user ${userId} via ${method}`);

    return { success: true };
  },
};
