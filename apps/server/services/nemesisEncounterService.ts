/* ═══════════════════════════════════════════════════════
   NEMESIS ENCOUNTER SERVICE — server-side surface wiring

   Surface routers (Trade Empire / Casino / Apprentice / Hub)
   call `recordSurfaceEvent` to:
     1. Find the player's active (most-recent) Nemesis cohort
     2. Append the encounter to the ledger (with grudge-tier-
        appropriate quote)
     3. Disrupt the relevant active plan if requested
        (e.g. player completed a trade route, disrupting the
        Nemesis's sabotage plan against it)

   All operations are fire-and-forget from the caller's
   perspective — a Nemesis bug must never block a real
   surface-mutation. The service swallows DB errors and
   logs them; callers can ignore the return value.

   The integration helpers in apps/shared/nemesisIntegration.ts
   already produce the encounter-shape; this service is the
   server-side sink that consumes them.
   ═══════════════════════════════════════════════════════ */
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "../db";
import { logger } from "../logger";
import {
  nemesisState,
  nemesisMemory,
  nemesisPlans,
} from "../../db/schema";
import {
  applyEncounterTransition,
  type NemesisDef,
} from "../../shared/nemesisSystem";
import {
  generateQuoteOpening,
  type NemesisEncounterKind,
} from "../../shared/nemesisMemory";
import {
  findPlansNeedingResolution,
  type NemesisPlanKind,
} from "../../shared/nemesisPlans";
import { applyPlanSuccessPowerUp } from "./nemesisPowerUpApplier";

type DbHandle = NonNullable<Awaited<ReturnType<typeof getDb>>>;

export type NemesisSurfaceSource =
  | "trade-empire"
  | "casino"
  | "hub"
  | "apprentice"
  | "world";

export interface SurfaceEventInput {
  userId: number;
  encounterKind: NemesisEncounterKind;
  source: NemesisSurfaceSource;
  detail: string;
  /** If set, the matching active plan of this kind is
   *  marked "disrupted". */
  disruptPlanKind?: NemesisPlanKind | null;
  /** Optional cohort pin; defaults to the player's most-
   *  recent cohort. */
  cohortNumber?: number;
  playerContext?: {
    act?: number;
    phase?: number;
    witnessLevel?: number;
    companionPresent?: string;
    surfaceDetail?: string;
  };
}

export interface SurfaceEventResult {
  recorded: boolean;
  nemesisId?: string;
  memoryId?: string;
  disruptedPlanId?: string;
  skipReason?: string;
}

/** Lazy plan-tick sweep. Looks at every still-active plan for
 *  the user, and writes back "succeeded" for any whose
 *  `ticksAt` is in the past. The chronicle-accurate resolution
 *  timestamp is the plan's own ticksAt — that's when the plan
 *  actually resolved; the DB write just records it late.
 *
 *  Pure-function logic is in
 *  `apps/shared/nemesisPlans.ts:findPlansNeedingResolution`,
 *  which keeps the rule testable without a DB.
 *
 *  Returns the number of plans resolved (informational; callers
 *  can ignore). Safe to call on every Nemesis-related read or
 *  write path — guarded by try/catch internally. */
/** Phase K Wave 4 — does this user have an active Nemesis
 *  whisper-plan against their apprentice? Consumed by the
 *  apprenticeBetrayal stage-3 declaration path to overlay
 *  the Nemesis-aware whisper dialog. */
export async function hasActiveNemesisWhisperPlan(
  userId: number,
  db?: DbHandle,
): Promise<{ active: boolean; nemesisArchetypeTitle?: string }> {
  try {
    const handle = db ?? (await getDb());
    if (!handle) return { active: false };
    const activePlans = await handle
      .select()
      .from(nemesisPlans)
      .where(
        and(
          eq(nemesisPlans.userId, userId),
          eq(nemesisPlans.kind, "apprentice_breaking_point_whisper"),
        ),
      );
    const ticking = activePlans.find(
      (p) => p.status === "spawned" || p.status === "ticking",
    );
    if (!ticking) return { active: false };
    const nemesis = await handle
      .select()
      .from(nemesisState)
      .where(eq(nemesisState.nemesisId, ticking.nemesisId))
      .limit(1);
    if (nemesis.length === 0) return { active: false };
    return { active: true, nemesisArchetypeTitle: nemesis[0].archetypeTitle };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn("[NemesisEncounterService] hasActiveNemesisWhisperPlan failed:", msg);
    return { active: false };
  }
}

export async function sweepExpiredPlansForUser(
  userId: number,
  db?: DbHandle,
): Promise<number> {
  try {
    const handle = db ?? (await getDb());
    if (!handle) return 0;

    const rows = await handle
      .select()
      .from(nemesisPlans)
      .where(eq(nemesisPlans.userId, userId));

    const sweepable = rows
      .filter((r) => r.status === "spawned" || r.status === "ticking")
      .map((r) => ({
        planId: r.planId,
        status: r.status as "spawned" | "ticking",
        ticksAtIso: r.ticksAt.toISOString(),
      }));

    const resolutions = findPlansNeedingResolution(
      sweepable,
      new Date().toISOString(),
    );
    if (resolutions.length === 0) return 0;

    // Build a planId → row lookup for the K1.3 power-up
    // applier (it needs the plan's kind + nemesisId to
    // materialize the rewardOnSuccess).
    const rowByPlanId = new Map(rows.map((r) => [r.planId, r]));

    for (const res of resolutions) {
      await handle
        .update(nemesisPlans)
        .set({ status: res.newStatus, resolvedAt: new Date(res.resolvedAtIso) })
        .where(eq(nemesisPlans.planId, res.planId));

      // Phase K1.3 — materialize the rewardOnSuccess as a
      // power-up effect row. Surfaces query the table to
      // apply real gameplay consequences. Idempotent on
      // planId via the applier's existing-effect check.
      const row = rowByPlanId.get(res.planId);
      if (row) {
        await applyPlanSuccessPowerUp(
          {
            userId,
            nemesisId: row.nemesisId,
            planId: row.planId,
            planKind: row.kind as NemesisPlanKind,
            payload: { targetDetail: row.targetDetail },
          },
          handle,
        );
      }
    }

    // Phase K Wave 4 — after plan-success writebacks, check
    // for lieutenant promotion. The pure `decidePromotion`
    // sees the user's active roster + each Nemesis's
    // cumulative plan-success count.
    try {
      const { decidePromotion } = await import("../../shared/nemesisPlans");
      const roster = await handle
        .select()
        .from(nemesisState)
        .where(
          and(
            eq(nemesisState.userId, userId),
            eq(nemesisState.retired, 0),
          ),
        );
      // Build per-Nemesis plan-success counts (using `rows`
      // already fetched + the just-applied resolutions).
      const successCountByNemesisId = new Map<string, number>();
      for (const r of rows) {
        if (r.status === "succeeded") {
          successCountByNemesisId.set(
            r.nemesisId,
            (successCountByNemesisId.get(r.nemesisId) ?? 0) + 1,
          );
        }
      }
      // Include the resolutions we just wrote (status was
      // "spawned"/"ticking" pre-sweep but is now "succeeded").
      for (const res of resolutions) {
        const row = rowByPlanId.get(res.planId);
        if (row) {
          successCountByNemesisId.set(
            row.nemesisId,
            (successCountByNemesisId.get(row.nemesisId) ?? 0) + 1,
          );
        }
      }
      const rosterEntries = roster.map((n) => ({
        nemesisId: n.nemesisId,
        rank: n.rank as 1 | 2 | 3 | 4 | 5 | 6 | 7,
        planSuccessCount: successCountByNemesisId.get(n.nemesisId) ?? 0,
        isLieutenant: !!n.lieutenantOfNemesisId,
        retired: n.retired === 1,
      }));
      const decision = decidePromotion(rosterEntries);
      if (
        decision.promote &&
        decision.candidateNemesisId &&
        decision.underNemesisId
      ) {
        await handle
          .update(nemesisState)
          .set({ lieutenantOfNemesisId: decision.underNemesisId })
          .where(eq(nemesisState.nemesisId, decision.candidateNemesisId));
        // Record the encounter so the pair-bank's
        // lieutenant_promotion scene fires on next surface read.
        const candidate = roster.find(
          (n) => n.nemesisId === decision.candidateNemesisId,
        );
        if (candidate) {
          await recordSurfaceEvent({
            userId,
            cohortNumber: candidate.cohortNumber,
            source: "world",
            encounterKind: "lieutenant_promoted",
            detail: `Promoted under ${decision.underNemesisId}`,
          });
        }
      }
    } catch (promotionErr) {
      const msg = promotionErr instanceof Error ? promotionErr.message : String(promotionErr);
      logger.warn("[NemesisEncounterService] lieutenant promotion check failed:", msg);
    }

    return resolutions.length;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn("[NemesisEncounterService] sweepExpiredPlansForUser failed:", msg);
    return 0;
  }
}

/** Record a Nemesis encounter sparked by a surface event.
 *  Safe to fire-and-forget — never throws on the happy path. */
export async function recordSurfaceEvent(
  input: SurfaceEventInput,
): Promise<SurfaceEventResult> {
  try {
    const db = await getDb();
    if (!db) {
      return { recorded: false, skipReason: "no-db" };
    }

    const stateRows = input.cohortNumber !== undefined
      ? await db
          .select()
          .from(nemesisState)
          .where(
            and(
              eq(nemesisState.userId, input.userId),
              eq(nemesisState.cohortNumber, input.cohortNumber),
            ),
          )
          .limit(1)
      : await db
          .select()
          .from(nemesisState)
          .where(eq(nemesisState.userId, input.userId))
          .orderBy(desc(nemesisState.spawnedAt))
          .limit(1);

    if (stateRows.length === 0) {
      return { recorded: false, skipReason: "no-active-nemesis" };
    }
    const stateRow = stateRows[0];
    const nemesisId = stateRow.nemesisId;
    const grudge = stateRow.grudgeTier as NemesisDef["grudgeTier"];

    const existingCount = (
      await db
        .select()
        .from(nemesisMemory)
        .where(eq(nemesisMemory.nemesisId, nemesisId))
    ).length;
    const sequence = existingCount + 1;
    const memoryId = `mem_${nemesisId}_${sequence}`;
    const quoteOpening = generateQuoteOpening(
      input.encounterKind,
      grudge,
      input.detail,
    );

    await db.insert(nemesisMemory).values({
      memoryId,
      nemesisId,
      userId: input.userId,
      sequence,
      encounterKind: input.encounterKind,
      source: input.source,
      quoteOpening,
      playerContext: input.playerContext ?? null,
    });

    // Phase K1.2 — apply rank/grudge transition derived from
    // the encounter kind, layered with K4 archetype acceleration.
    const nemesisDef: NemesisDef = {
      id: stateRow.nemesisId,
      userId: stateRow.userId,
      cohortNumber: stateRow.cohortNumber,
      archetype: stateRow.nemesisArchetype as NemesisDef["archetype"],
      identity: {
        archetypeTitle: stateRow.archetypeTitle,
        properName: stateRow.properName,
        nameRevealed: stateRow.nameRevealed === 1,
      },
      politicianTic: stateRow.politicianTic as NemesisDef["politicianTic"],
      rank: stateRow.rank as NemesisDef["rank"],
      grudgeTier: stateRow.grudgeTier as NemesisDef["grudgeTier"],
      preferredSurface: stateRow.preferredSurface as NemesisDef["preferredSurface"],
      spawnedAt: stateRow.spawnedAt.toISOString(),
      lastEncounterAt: stateRow.lastEncounterAt?.toISOString() ?? null,
    };
    const transitioned = applyEncounterTransition(nemesisDef, input.encounterKind);

    await db
      .update(nemesisState)
      .set({
        lastEncounterAt: new Date(),
        rank: transitioned.rank,
        grudgeTier: transitioned.grudgeTier,
      })
      .where(eq(nemesisState.nemesisId, nemesisId));

    let disruptedPlanId: string | undefined;
    if (input.disruptPlanKind) {
      // Sweep first — a plan whose ticksAt is already in the past
      // has auto-succeeded; the surface can't retroactively disrupt
      // it. The sweep writes the late "succeeded" status so the
      // following lookup correctly skips it.
      await sweepExpiredPlansForUser(input.userId, db);

      const open = await db
        .select()
        .from(nemesisPlans)
        .where(
          and(
            eq(nemesisPlans.userId, input.userId),
            eq(nemesisPlans.nemesisId, nemesisId),
            eq(nemesisPlans.kind, input.disruptPlanKind),
          ),
        )
        .orderBy(desc(nemesisPlans.spawnedAt))
        .limit(1);
      const active = open.find(
        (p) => p.status === "spawned" || p.status === "ticking",
      );
      if (active) {
        await db
          .update(nemesisPlans)
          .set({ status: "disrupted", resolvedAt: new Date() })
          .where(eq(nemesisPlans.planId, active.planId));
        disruptedPlanId = active.planId;
      }
    }

    return { recorded: true, nemesisId, memoryId, disruptedPlanId };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn("[NemesisEncounterService] recordSurfaceEvent failed:", msg);
    return { recorded: false, skipReason: "exception" };
  }
}
