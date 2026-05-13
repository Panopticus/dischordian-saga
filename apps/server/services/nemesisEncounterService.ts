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
import type { NemesisDef } from "../../shared/nemesisSystem";
import {
  generateQuoteOpening,
  type NemesisEncounterKind,
} from "../../shared/nemesisMemory";
import type { NemesisPlanKind } from "../../shared/nemesisPlans";

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
    await db
      .update(nemesisState)
      .set({ lastEncounterAt: new Date() })
      .where(eq(nemesisState.nemesisId, nemesisId));

    let disruptedPlanId: string | undefined;
    if (input.disruptPlanKind) {
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
