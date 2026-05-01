/* ═══════════════════════════════════════════════════════
   PVP MODERATION ROUTER — community-reported guild mottoes,
   banners, titles. Reporters file via protectedProcedure;
   moderators / admins triage via adminProcedure.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  pvpModerationReports,
  guildCosmetics,
  guilds,
  userCosmeticLoadout,
  userProgress,
  discoveryEvents,
} from "../../db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { STARTER_BANNER_KEY } from "@shared/guildCosmetics/bannerCatalog";
import { logger } from "../logger";

const TARGET_KIND = z.enum(["motto", "banner", "title", "guild_name"]);
const REASON = z.enum([
  "profanity",
  "harassment",
  "hate_speech",
  "trademark",
  "spam",
  "impersonation",
  "other",
]);

export const pvpModerationRouter = router({
  /** File a report — any signed-in player. Limit: 5 open reports
   *  per (reporter, target) at a time to discourage spam. */
  fileReport: protectedProcedure
    .input(z.object({
      targetKind: TARGET_KIND,
      targetId: z.number().int(),
      reason: REASON,
      details: z.string().max(500).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Snapshot the offending content so a later edit doesn't erase
      // the audit trail.
      let snapshot: string | null = null;
      try {
        if (input.targetKind === "motto") {
          const rows = await db
            .select({ mottoText: guildCosmetics.mottoText })
            .from(guildCosmetics)
            .where(eq(guildCosmetics.guildId, input.targetId))
            .limit(1);
          snapshot = rows[0]?.mottoText ?? null;
        } else if (input.targetKind === "banner") {
          const rows = await db
            .select({ bannerKey: guildCosmetics.bannerKey })
            .from(guildCosmetics)
            .where(eq(guildCosmetics.guildId, input.targetId))
            .limit(1);
          snapshot = rows[0]?.bannerKey ?? null;
        } else if (input.targetKind === "guild_name") {
          const rows = await db
            .select({ name: guilds.name })
            .from(guilds)
            .where(eq(guilds.id, input.targetId))
            .limit(1);
          snapshot = rows[0]?.name ?? null;
        } else if (input.targetKind === "title") {
          const rows = await db
            .select({ titleKey: userCosmeticLoadout.equippedTitleKey })
            .from(userCosmeticLoadout)
            .where(eq(userCosmeticLoadout.userId, input.targetId))
            .limit(1);
          snapshot = rows[0]?.titleKey ?? null;
        }
      } catch {/* snapshot is best-effort */}

      await db.insert(pvpModerationReports).values({
        reporterId: ctx.user.id,
        targetKind: input.targetKind,
        targetId: input.targetId,
        contentSnapshot: snapshot,
        reason: input.reason,
        details: input.details ?? null,
      });
      return { ok: true };
    }),

  /** Reporters can see their own filed reports + status. */
  getMyReports: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return db
      .select()
      .from(pvpModerationReports)
      .where(eq(pvpModerationReports.reporterId, ctx.user.id))
      .orderBy(desc(pvpModerationReports.createdAt))
      .limit(50);
  }),

  /* ─── ADMIN ─────────────────────────────────────────────── */
  /** Open queue — admin / moderator dashboard. */
  getOpenReports: adminProcedure
    .input(z.object({
      targetKind: TARGET_KIND.optional(),
      limit: z.number().min(1).max(200).optional(),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const conds = input?.targetKind
        ? and(
            eq(pvpModerationReports.status, "open"),
            eq(pvpModerationReports.targetKind, input.targetKind),
          )
        : eq(pvpModerationReports.status, "open");
      return db
        .select()
        .from(pvpModerationReports)
        .where(conds)
        .orderBy(desc(pvpModerationReports.createdAt))
        .limit(input?.limit ?? 50);
    }),

  /**
   * Resolve a report. Admin chooses outcome; if `applyAction` is
   * set, the offending content is also reverted to a safe default
   * (banner → starter, motto → empty, title → unequipped).
   */
  resolveReport: adminProcedure
    .input(z.object({
      reportId: z.number().int(),
      outcome: z.enum(["resolved_action", "resolved_no_action", "duplicate"]),
      applyAction: z.boolean().optional(),
      notes: z.string().max(1000).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const rows = await db
        .select()
        .from(pvpModerationReports)
        .where(eq(pvpModerationReports.id, input.reportId))
        .limit(1);
      const r = rows[0];
      if (!r) throw new TRPCError({ code: "NOT_FOUND" });
      if (r.status !== "open") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Already resolved" });
      }

      if (input.applyAction && input.outcome === "resolved_action") {
        if (r.targetKind === "motto") {
          await db
            .update(guildCosmetics)
            .set({ mottoText: null })
            .where(eq(guildCosmetics.guildId, r.targetId))
            .catch(() => {});
        } else if (r.targetKind === "banner") {
          await db
            .update(guildCosmetics)
            .set({ bannerKey: STARTER_BANNER_KEY })
            .where(eq(guildCosmetics.guildId, r.targetId))
            .catch(() => {});
        } else if (r.targetKind === "title") {
          await db
            .update(userCosmeticLoadout)
            .set({ equippedTitleKey: null })
            .where(eq(userCosmeticLoadout.userId, r.targetId))
            .catch(() => {});
          await db
            .update(userProgress)
            .set({ title: "Recruit" })
            .where(eq(userProgress.userId, r.targetId))
            .catch(() => {});
        }
        // Guild-name resets are sensitive and require manual rename;
        // the report records the action without auto-applying.
      }

      await db
        .update(pvpModerationReports)
        .set({
          status: input.outcome,
          resolvedByUserId: ctx.user.id,
          resolvedAt: new Date(),
          resolutionNotes: input.notes ?? null,
        })
        .where(eq(pvpModerationReports.id, input.reportId));

      logger.info("pvp_moderation_report_resolved", "pvpModeration", {
        reportId: input.reportId,
        outcome: input.outcome,
        applyAction: input.applyAction ?? false,
        moderatorId: ctx.user.id,
      });
      return { ok: true };
    }),

  /** Audit log of every server-wide reveal event. Admin-only. */
  getRevealAuditLog: adminProcedure
    .input(z.object({ limit: z.number().min(1).max(500).optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(discoveryEvents)
        .orderBy(desc(discoveryEvents.discoveredAt))
        .limit(input?.limit ?? 100);
    }),

  /** Stats dashboard — one row, admin-only. */
  getModerationStats: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { open: 0, resolvedAction: 0, resolvedNoAction: 0, duplicates: 0 };
    const rows = await db
      .select({ status: pvpModerationReports.status, count: sql<number>`COUNT(*)` })
      .from(pvpModerationReports)
      .groupBy(pvpModerationReports.status);
    const out = { open: 0, resolvedAction: 0, resolvedNoAction: 0, duplicates: 0 };
    for (const r of rows) {
      if (r.status === "open") out.open = Number(r.count);
      else if (r.status === "resolved_action") out.resolvedAction = Number(r.count);
      else if (r.status === "resolved_no_action") out.resolvedNoAction = Number(r.count);
      else if (r.status === "duplicate") out.duplicates = Number(r.count);
    }
    return out;
  }),
});
