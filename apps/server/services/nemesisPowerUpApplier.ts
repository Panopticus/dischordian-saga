/* ═══════════════════════════════════════════════════════
   NEMESIS POWER-UP APPLIER (Phase K1.3)

   When the lazy plan-tick sweep marks a Nemesis plan as
   "succeeded", the plan's `rewardOnSuccess` is materialized
   into a row in `nemesis_power_up_effects`. Surface
   systems query that table to apply real gameplay
   consequences:

     - trade-empire reads trade_route_lock_seven_days
     - casino reads casino_odds_double_two_rounds
     - apprentice-trial reads apprentice_corruption_locked_in
     - etc.

   This service writes the effects; consumption happens at
   the surface (each surface decides when to mark
   `consumedAt` on the row it's already paid out for).

   All operations are fire-and-forget — applier failures
   never block the sweep.
   ═══════════════════════════════════════════════════════ */
import { eq, and, gt, isNull } from "drizzle-orm";
import { getDb } from "../db";
import { logger } from "../logger";
import { nemesisPowerUpEffects } from "../../db/schema";
import {
  PLAN_KIND_CATALOG,
  type NemesisPlanKind,
  type NemesisPowerUp,
} from "../../shared/nemesisPlans";

type DbHandle = NonNullable<Awaited<ReturnType<typeof getDb>>>;

export interface ApplyPowerUpInput {
  userId: number;
  nemesisId: string;
  planId: string;
  planKind: NemesisPlanKind;
  /** Optional surface-specific payload (e.g. routeKey,
   *  tableName) recorded with the effect for consumers. */
  payload?: Record<string, unknown>;
  /** Override the effect's TTL. Defaults to per-power-up
   *  durations from POWER_UP_DURATIONS_MS. */
  durationMsOverride?: number;
}

export interface ApplyPowerUpResult {
  applied: boolean;
  effectId?: string;
  effectKind?: NemesisPowerUp;
  expiresAt?: Date;
  skipReason?: string;
}

/* Per-power-up TTL. Used unless overridden. */
export const POWER_UP_DURATIONS_MS: Record<NemesisPowerUp, number> = {
  ambush_immunity_one_round: 60 * 60 * 1000,                 // 1h, single-use
  trade_route_lock_seven_days: 7 * 24 * 60 * 60 * 1000,      // 7d
  casino_odds_double_two_rounds: 60 * 60 * 1000,             // 1h, decremented per round
  apprentice_corruption_locked_in: 7 * 24 * 60 * 60 * 1000,  // 7d (cohort-window-aligned)
  lieutenant_recruited: 30 * 24 * 60 * 60 * 1000,            // 30d (lieutenant persists)
  weapon_special_unlocked: 7 * 24 * 60 * 60 * 1000,          // 7d
  name_class_seal_held: 30 * 24 * 60 * 60 * 1000,            // 30d (suppresses normal name reveal)
};

/** Apply a Nemesis plan's rewardOnSuccess. Looks up the
 *  reward from PLAN_KIND_CATALOG and writes a row to
 *  nemesis_power_up_effects. Idempotent on planId — the
 *  same plan can only generate one effect even if the
 *  sweep runs twice. */
export async function applyPlanSuccessPowerUp(
  input: ApplyPowerUpInput,
  db?: DbHandle,
): Promise<ApplyPowerUpResult> {
  try {
    const handle = db ?? (await getDb());
    if (!handle) return { applied: false, skipReason: "no-db" };

    const planDef = PLAN_KIND_CATALOG.find((p) => p.kind === input.planKind);
    if (!planDef) return { applied: false, skipReason: "unknown-plan-kind" };
    const effectKind = planDef.rewardOnSuccess;

    const effectId = `effect_${input.planId}`;
    const durationMs =
      input.durationMsOverride ?? POWER_UP_DURATIONS_MS[effectKind] ?? 60 * 60 * 1000;
    const expiresAt = new Date(Date.now() + durationMs);

    // Idempotent insert via onDuplicateKeyUpdate-like guard:
    // first check by uniq effectId.
    const existing = await handle
      .select()
      .from(nemesisPowerUpEffects)
      .where(eq(nemesisPowerUpEffects.effectId, effectId))
      .limit(1);
    if (existing.length > 0) {
      return {
        applied: false,
        skipReason: "already-applied",
        effectId,
        effectKind,
      };
    }

    await handle.insert(nemesisPowerUpEffects).values({
      effectId,
      userId: input.userId,
      nemesisId: input.nemesisId,
      planId: input.planId,
      effectKind,
      payload: (input.payload ?? null) as never,
      expiresAt,
    });

    return { applied: true, effectId, effectKind, expiresAt };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn("[NemesisPowerUpApplier] applyPlanSuccessPowerUp failed:", msg);
    return { applied: false, skipReason: "exception" };
  }
}

/** Surface query — returns active (unconsumed, unexpired)
 *  power-up effects of a given kind for a user. Surfaces
 *  use this to decide whether to apply the effect (e.g.
 *  trade-empire checking for trade_route_lock_seven_days
 *  on a route the player wants to run). */
export async function activePowerUpsOfKindForUser(
  userId: number,
  effectKind: NemesisPowerUp,
  db?: DbHandle,
): Promise<Array<{ effectId: string; payload: unknown; expiresAt: Date }>> {
  try {
    const handle = db ?? (await getDb());
    if (!handle) return [];

    const now = new Date();
    const rows = await handle
      .select()
      .from(nemesisPowerUpEffects)
      .where(
        and(
          eq(nemesisPowerUpEffects.userId, userId),
          eq(nemesisPowerUpEffects.effectKind, effectKind),
          gt(nemesisPowerUpEffects.expiresAt, now),
          isNull(nemesisPowerUpEffects.consumedAt),
        ),
      );
    return rows.map((r) => ({
      effectId: r.effectId,
      payload: r.payload,
      expiresAt: r.expiresAt,
    }));
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn("[NemesisPowerUpApplier] activePowerUpsOfKindForUser failed:", msg);
    return [];
  }
}

/** Mark a power-up effect consumed. Called by surfaces
 *  after they've applied the effect's gameplay
 *  consequence (e.g. casino burned a doubled-odds round). */
export async function consumePowerUpEffect(
  effectId: string,
  db?: DbHandle,
): Promise<boolean> {
  try {
    const handle = db ?? (await getDb());
    if (!handle) return false;
    await handle
      .update(nemesisPowerUpEffects)
      .set({ consumedAt: new Date() })
      .where(eq(nemesisPowerUpEffects.effectId, effectId));
    return true;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn("[NemesisPowerUpApplier] consumePowerUpEffect failed:", msg);
    return false;
  }
}
