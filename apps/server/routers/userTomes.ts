/* ═══════════════════════════════════════════════════════════════════
   USER TOMES ROUTER — CoNexus user-authored content.

   Procedures:
     listMine        author's own drafts + submissions + published
     listPublished   public feed of published tomes (paginated)
     getById         single tome (gated: drafts only by author)
     submitDraft     create a new draft tome (status = draft)
     updateDraft     edit own draft (status must be draft)
     submitForReview author transitions draft → submitted (locks)
     withdraw        author transitions submitted → draft (unlocks)
     endorse         add a community endorsement
     retract         remove endorsement
     moderate        admin transitions submitted ↔ published/rejected/retired
     listForReview   admin queue of submitted tomes
   ═══════════════════════════════════════════════════════════════════ */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, sql } from "drizzle-orm";

import { protectedProcedure, publicProcedure, adminProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { userTomes, userTomeEndorsements, users } from "../../db/schema";

type TomeStatus = "draft" | "submitted" | "published" | "rejected" | "retired";

export const userTomesRouter = router({
  /* ═══ AUTHOR ═══ */

  listMine: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(userTomes)
      .where(eq(userTomes.authorUserId, ctx.user.id))
      .orderBy(desc(userTomes.updatedAt))
      .limit(100);
  }),

  /** Public feed of published tomes. Paginated. Most-endorsed first
   *  is a useful default for surfacing community favourites. */
  listPublished: publicProcedure
    .input(z.object({
      sort: z.enum(["newest", "endorsed"]).default("endorsed"),
      limit: z.number().int().min(1).max(50).default(20),
      offset: z.number().int().min(0).default(0),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const orderBy = input.sort === "newest"
        ? desc(userTomes.createdAt)
        : desc(userTomes.endorsements);
      return db.select({
        id: userTomes.id,
        authorUserId: userTomes.authorUserId,
        authorName: users.name,
        title: userTomes.title,
        teaser: userTomes.teaser,
        cycleIndex: userTomes.cycleIndex,
        endorsements: userTomes.endorsements,
        createdAt: userTomes.createdAt,
      }).from(userTomes)
        .leftJoin(users, eq(userTomes.authorUserId, users.id))
        .where(eq(userTomes.status, "published"))
        .orderBy(orderBy)
        .limit(input.limit)
        .offset(input.offset);
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return null;
      const rows = await db.select().from(userTomes)
        .where(eq(userTomes.id, input.id)).limit(1);
      const row = rows[0];
      if (!row) return null;
      // Drafts and rejected are author-only.
      if ((row.status === "draft" || row.status === "rejected") &&
          row.authorUserId !== (ctx.user?.id ?? -1)) {
        return null;
      }
      return row;
    }),

  submitDraft: protectedProcedure
    .input(z.object({
      title: z.string().min(3).max(120),
      teaser: z.string().max(240).optional(),
      body: z.string().min(50).max(4000),
      cycleIndex: z.string().max(32).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Cap drafts per author so the table doesn't pile up. 10 drafts
      // is enough to keep a generous prolific pipeline.
      const existing = await db.select({ id: userTomes.id }).from(userTomes)
        .where(and(
          eq(userTomes.authorUserId, ctx.user.id),
          eq(userTomes.status, "draft"),
        ));
      if (existing.length >= 10) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You already have 10 drafts in flight. Submit or delete one before authoring more.",
        });
      }

      const result = await db.insert(userTomes).values({
        authorUserId: ctx.user.id,
        title: input.title,
        teaser: input.teaser ?? null,
        body: input.body,
        cycleIndex: input.cycleIndex ?? null,
        status: "draft",
      });
      return { success: true, insertId: (result as unknown as { insertId?: number }).insertId };
    }),

  updateDraft: protectedProcedure
    .input(z.object({
      id: z.number().int().positive(),
      title: z.string().min(3).max(120).optional(),
      teaser: z.string().max(240).nullable().optional(),
      body: z.string().min(50).max(4000).optional(),
      cycleIndex: z.string().max(32).nullable().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const rows = await db.select().from(userTomes)
        .where(eq(userTomes.id, input.id)).limit(1);
      const row = rows[0];
      if (!row) throw new TRPCError({ code: "NOT_FOUND" });
      if (row.authorUserId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      if (row.status !== "draft") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Only drafts can be edited. Withdraw to unlock.",
        });
      }
      await db.update(userTomes).set({
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.teaser !== undefined ? { teaser: input.teaser } : {}),
        ...(input.body !== undefined ? { body: input.body } : {}),
        ...(input.cycleIndex !== undefined ? { cycleIndex: input.cycleIndex } : {}),
      }).where(eq(userTomes.id, input.id));
      return { success: true };
    }),

  /** Author flips draft → submitted. */
  submitForReview: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const rows = await db.select().from(userTomes)
        .where(eq(userTomes.id, input.id)).limit(1);
      const row = rows[0];
      if (!row || row.authorUserId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      if (row.status !== "draft") {
        throw new TRPCError({ code: "CONFLICT", message: `Cannot submit a ${row.status} tome.` });
      }
      await db.update(userTomes).set({ status: "submitted" })
        .where(eq(userTomes.id, input.id));
      return { success: true };
    }),

  /** Author withdraws submitted → draft. Published tomes can also
   *  be withdrawn (author retires their own work). */
  withdraw: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const rows = await db.select().from(userTomes)
        .where(eq(userTomes.id, input.id)).limit(1);
      const row = rows[0];
      if (!row || row.authorUserId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const next: TomeStatus = row.status === "published" ? "retired" : "draft";
      await db.update(userTomes).set({ status: next })
        .where(eq(userTomes.id, input.id));
      return { success: true, status: next };
    }),

  /** Delete a draft (and only a draft). Submitted/published can be
   *  withdrawn but their record is preserved. */
  deleteDraft: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const rows = await db.select().from(userTomes)
        .where(eq(userTomes.id, input.id)).limit(1);
      const row = rows[0];
      if (!row || row.authorUserId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      if (row.status !== "draft") {
        throw new TRPCError({ code: "CONFLICT", message: "Only drafts may be deleted." });
      }
      await db.delete(userTomes).where(eq(userTomes.id, input.id));
      return { success: true };
    }),

  /* ═══ ENDORSEMENTS ═══ */

  endorse: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Only published tomes can be endorsed.
      const rows = await db.select({ status: userTomes.status, authorId: userTomes.authorUserId })
        .from(userTomes).where(eq(userTomes.id, input.id)).limit(1);
      const row = rows[0];
      if (!row) throw new TRPCError({ code: "NOT_FOUND" });
      if (row.status !== "published") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Only published tomes can be endorsed." });
      }
      if (row.authorId === ctx.user.id) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "You cannot endorse your own tome." });
      }

      try {
        await db.insert(userTomeEndorsements).values({
          tomeId: input.id,
          userId: ctx.user.id,
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (/duplicate|unique/i.test(msg)) {
          return { success: true, alreadyEndorsed: true };
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: msg });
      }
      await db.update(userTomes)
        .set({ endorsements: sql`${userTomes.endorsements} + 1` })
        .where(eq(userTomes.id, input.id));
      return { success: true, alreadyEndorsed: false };
    }),

  retract: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const removed = await db.delete(userTomeEndorsements).where(and(
        eq(userTomeEndorsements.tomeId, input.id),
        eq(userTomeEndorsements.userId, ctx.user.id),
      ));
      const removedCount = (removed as unknown as { rowsAffected?: number }).rowsAffected ?? 0;
      if (removedCount > 0) {
        await db.update(userTomes)
          .set({ endorsements: sql`GREATEST(${userTomes.endorsements} - 1, 0)` })
          .where(eq(userTomes.id, input.id));
      }
      return { success: true };
    }),

  /* ═══ MODERATION (admin) ═══ */

  listForReview: adminProcedure
    .input(z.object({ limit: z.number().int().min(1).max(100).default(50) }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(userTomes)
        .where(eq(userTomes.status, "submitted"))
        .orderBy(desc(userTomes.createdAt))
        .limit(input?.limit ?? 50);
    }),

  moderate: adminProcedure
    .input(z.object({
      id: z.number().int().positive(),
      action: z.enum(["publish", "reject", "retire"]),
      note: z.string().max(500).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const next = input.action === "publish" ? "published"
        : input.action === "reject" ? "rejected"
        : "retired";
      await db.update(userTomes).set({
        status: next,
        moderatorNote: input.note ?? null,
        moderatedByUserId: ctx.user.id,
        moderatedAt: new Date(),
      }).where(eq(userTomes.id, input.id));
      return { success: true, status: next };
    }),
});
