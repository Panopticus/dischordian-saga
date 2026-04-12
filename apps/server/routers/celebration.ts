/* ═══════════════════════════════════════════════════════
   CELEBRATION + MECHRONIS SERVER ROUTER

   Persists Celebration trial state, trial history, Academy
   transcripts, and Professor approval scores to MySQL.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import {
  celebrationTrialState,
  celebrationTrialHistory,
  academyTranscript,
  professorApproval,
} from "../../db/schema";

export const celebrationRouter = router({
  /* ─── TRIAL STATE ─── */

  getTrialState: protectedProcedure
    .input(z.object({ apprenticeId: z.string() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return null;
      const rows = await db.select().from(celebrationTrialState)
        .where(and(
          eq(celebrationTrialState.userId, ctx.user.id),
          eq(celebrationTrialState.apprenticeId, input.apprenticeId),
        )).limit(1);
      return rows[0] ?? null;
    }),

  saveTrialState: protectedProcedure
    .input(z.object({
      apprenticeId: z.string(),
      trialDay: z.number(),
      bond: z.number(),
      corruption: z.number(),
      missedDays: z.number(),
      stage: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };
      const existing = await db.select().from(celebrationTrialState)
        .where(and(
          eq(celebrationTrialState.userId, ctx.user.id),
          eq(celebrationTrialState.apprenticeId, input.apprenticeId),
        )).limit(1);
      if (existing.length > 0) {
        await db.update(celebrationTrialState).set({
          trialDay: input.trialDay,
          bond: input.bond,
          corruption: input.corruption,
          missedDays: input.missedDays,
          stage: input.stage,
        }).where(and(
          eq(celebrationTrialState.userId, ctx.user.id),
          eq(celebrationTrialState.apprenticeId, input.apprenticeId),
        ));
      } else {
        await db.insert(celebrationTrialState).values({
          userId: ctx.user.id,
          apprenticeId: input.apprenticeId,
          trialDay: input.trialDay,
          bond: input.bond,
          corruption: input.corruption,
          missedDays: input.missedDays,
          stage: input.stage,
        });
      }
      return { success: true };
    }),

  /* ─── TRIAL HISTORY ─── */

  getTrialHistory: protectedProcedure
    .input(z.object({ apprenticeId: z.string() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(celebrationTrialHistory)
        .where(and(
          eq(celebrationTrialHistory.userId, ctx.user.id),
          eq(celebrationTrialHistory.apprenticeId, input.apprenticeId),
        ));
    }),

  addTrialHistoryEntry: protectedProcedure
    .input(z.object({
      apprenticeId: z.string(),
      day: z.number(),
      mascoteerId: z.string(),
      decisionId: z.string(),
      optionId: z.string(),
      bondDelta: z.number(),
      corruptionDelta: z.number(),
      moralityDelta: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };
      await db.insert(celebrationTrialHistory).values({
        userId: ctx.user.id,
        ...input,
      });
      return { success: true };
    }),

  /* ─── ACADEMY TRANSCRIPT ─── */

  getTranscript: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(academyTranscript)
        .where(eq(academyTranscript.userId, ctx.user.id));
    }),

  addTranscriptEntry: protectedProcedure
    .input(z.object({
      day: z.number(),
      professorId: z.string(),
      lessonId: z.string(),
      grade: z.string(),
      skillXpDelta: z.number(),
      corruptionDelta: z.number(),
      approvalDelta: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };
      await db.insert(academyTranscript).values({
        userId: ctx.user.id,
        ...input,
      });
      return { success: true };
    }),

  /* ─── PROFESSOR APPROVAL ─── */

  getProfessorApproval: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return {};
      const rows = await db.select().from(professorApproval)
        .where(eq(professorApproval.userId, ctx.user.id));
      const map: Record<string, number> = {};
      for (const r of rows) map[r.professorId] = r.approval;
      return map;
    }),

  adjustProfessorApproval: protectedProcedure
    .input(z.object({
      professorId: z.string(),
      delta: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };
      const existing = await db.select().from(professorApproval)
        .where(and(
          eq(professorApproval.userId, ctx.user.id),
          eq(professorApproval.professorId, input.professorId),
        )).limit(1);
      const current = existing[0]?.approval ?? 50;
      const newVal = Math.max(0, Math.min(100, current + input.delta));
      if (existing.length > 0) {
        await db.update(professorApproval).set({ approval: newVal })
          .where(and(
            eq(professorApproval.userId, ctx.user.id),
            eq(professorApproval.professorId, input.professorId),
          ));
      } else {
        await db.insert(professorApproval).values({
          userId: ctx.user.id,
          professorId: input.professorId,
          approval: newVal,
        });
      }
      return { success: true, approval: newVal };
    }),
});
