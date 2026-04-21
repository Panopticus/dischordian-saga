/* ═══════════════════════════════════════════════════════
   CHESS SIDE GATES — server router.

   Side gates are optional tutorial gates that live OUTSIDE the
   linear 1..7 progression. Currently there is exactly one:
   Gate 4.5 (The Prince's Game). Stored as sentinel number 45 in
   `chess_tutorial_progress.completedGates` so no migration is
   needed; the linear math stays monotonic.

   Procedures:
     - getSideGateStatus: is this side gate unlocked + completed?
     - completeSideGate: mark it as completed, write profile event
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { eq } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb, type DrizzleDb } from "../db";
import { chessTutorialProgress } from "../../db/schema";
import {
  CHESS_TUTORIAL_SIDE_GATES,
  getChessTutorialSideGate,
  isChessSideGateUnlocked,
} from "@shared/tcg-core";

const SIDE_GATE_SENTINEL: Readonly<Record<string, number>> = Object.freeze({
  chess_tut_g4_5: 45,
});

const sideGateIdSchema = z.enum(
  CHESS_TUTORIAL_SIDE_GATES.map((g) => g.id) as [string, ...string[]],
);

async function loadProgress(
  db: DrizzleDb,
  userId: number,
): Promise<{ completedGates: number[] } | null> {
  const rows = await db
    .select({ completedGates: chessTutorialProgress.completedGates })
    .from(chessTutorialProgress)
    .where(eq(chessTutorialProgress.userId, userId))
    .limit(1);
  if (rows.length === 0) return null;
  return {
    completedGates: Array.isArray(rows[0].completedGates)
      ? (rows[0].completedGates as number[])
      : [],
  };
}

export const chessSideGateRouter = router({
  /** List every side gate with its unlock + completion status for
   *  the caller. */
  listSideGates: protectedProcedure.query(async ({ ctx }) => {
    const db = (await getDb())!;
    const progress = await loadProgress(db, ctx.user.id);
    const completedGates = progress?.completedGates ?? [];
    return CHESS_TUTORIAL_SIDE_GATES.map((gate) => {
      const sentinel = SIDE_GATE_SENTINEL[gate.id] ?? -1;
      return {
        id: gate.id,
        title: gate.title,
        objective: gate.objective,
        unlocked: isChessSideGateUnlocked(gate.id, completedGates),
        completed: completedGates.includes(sentinel),
      };
    });
  }),

  /** Mark the side gate as completed. Idempotent — re-completing
   *  a gate is a no-op (the sentinel is already in the array). */
  completeSideGate: protectedProcedure
    .input(z.object({ sideGateId: sideGateIdSchema }))
    .mutation(async ({ ctx, input }) => {
      const db = (await getDb())!;
      const userId = ctx.user.id;
      const gate = getChessTutorialSideGate(input.sideGateId);
      if (!gate) throw new Error("SIDE_GATE_UNKNOWN");
      const sentinel = SIDE_GATE_SENTINEL[input.sideGateId];
      if (sentinel === undefined) throw new Error("SIDE_GATE_SENTINEL_MISSING");

      const progress = await loadProgress(db, userId);
      if (progress === null) {
        // User has no tutorial row yet. Create one with the side
        // gate marked complete but linear progression untouched.
        await db.insert(chessTutorialProgress).values({
          userId,
          currentGate: 1,
          completedGates: [sentinel],
          currentStep: 0,
          keepsakeGranted: false,
        });
        return { ok: true, alreadyCompleted: false };
      }

      if (progress.completedGates.includes(sentinel)) {
        return { ok: true, alreadyCompleted: true };
      }

      if (!isChessSideGateUnlocked(input.sideGateId, progress.completedGates)) {
        throw new Error("SIDE_GATE_LOCKED");
      }

      const next = [...progress.completedGates, sentinel];
      await db
        .update(chessTutorialProgress)
        .set({ completedGates: next })
        .where(eq(chessTutorialProgress.userId, userId));

      return { ok: true, alreadyCompleted: false };
    }),
});
