/* ═══════════════════════════════════════════════════════
   ANNOUNCEMENTS ROUTER — Title-screen broadcasts

   Backs the Broadcast Ticker, Broadcast Panel, and video
   transmission intercept on the reworked Title page.

     listActive   → filter by audience + expiry, sort by
                    priority/published; returns a shape the
                    client can render directly.
     markViewed   → idempotent upsert of first-seen time.
     markDismissed→ stamps dismissedAt so the transmission
                    never auto-intercepts again.

     adminList    → admin-only; every row, including expired,
                    for the Architect's Console table.
     adminCreate  → admin-only; inserts a new row.
     adminUpdate  → admin-only; partial update by id.
     adminDelete  → admin-only; removes a row.

   `listActive` is a publicProcedure so the unauth title
   state can fetch `audience="all"` and `"unauth"` cards
   without an auth round-trip. `markViewed`/`markDismissed`
   require auth — they write `announcement_views` rows.
   The `admin*` procedures require `role === "admin"`.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, gt, inArray, isNull, or, sql } from "drizzle-orm";

import { announcements, announcementViews, notifications, users } from "../../db/schema";
import { getDb } from "../db";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "../_core/trpc";

/** Audience tags the client can declare itself a member of. The
 *  server filters `announcements.audience` by set membership: any row
 *  whose audience is `all` OR is in the client-supplied set matches. */
const AudienceTagEnum = z.enum([
  "all", "unauth", "authed", "act_ge_3", "light_aligned", "dark_aligned",
]);

type AudienceTag = z.infer<typeof AudienceTagEnum>;

/* ───────────────────────────────────────────────────────
   ADMIN INPUT SCHEMA — shared between create and update.
   Mirrors the `announcements` table columns; nullable URL/body
   fields accept empty-string from the form and are normalized
   to null before insert.
   ─────────────────────────────────────────────────────── */
const CategoryEnum = z.enum([
  "ark_alert", "transmission_incoming", "archival_footage", "overlay",
]);
const PriorityEnum = z.enum(["normal", "high"]);

const optionalString = z
  .string()
  .trim()
  .optional()
  .transform(v => (v && v.length > 0 ? v : undefined));

const AdminAnnouncementInputSchema = z.object({
  slug: z.string().trim().min(1).max(128),
  title: z.string().trim().min(1).max(256),
  body: optionalString,
  category: CategoryEnum.default("transmission_incoming"),
  priority: PriorityEnum.default("normal"),
  audience: AudienceTagEnum.default("all"),
  artUrl: optionalString,
  linkUrl: optionalString,
  videoUrl: optionalString,
  videoPosterUrl: optionalString,
  videoDurationSec: z.number().int().nonnegative().nullable().optional(),
  triggerOnTitle: z.boolean().default(false),
  triggerProbability: z.number().int().min(0).max(100).default(100),
  publishedAt: z.date().optional(),
  expiresAt: z.date().nullable().optional(),
});
type AdminAnnouncementInput = z.infer<typeof AdminAnnouncementInputSchema>;

function toInsertValues(input: AdminAnnouncementInput) {
  return {
    slug: input.slug,
    title: input.title,
    body: input.body ?? null,
    category: input.category,
    priority: input.priority,
    audience: input.audience,
    artUrl: input.artUrl ?? null,
    linkUrl: input.linkUrl ?? null,
    videoUrl: input.videoUrl ?? null,
    videoPosterUrl: input.videoPosterUrl ?? null,
    videoDurationSec: input.videoDurationSec ?? null,
    triggerOnTitle: input.triggerOnTitle,
    triggerProbability: input.triggerProbability,
    ...(input.publishedAt ? { publishedAt: input.publishedAt } : {}),
    expiresAt: input.expiresAt ?? null,
  };
}

function toUpdateValues(patch: Partial<AdminAnnouncementInput>) {
  const out: Record<string, unknown> = {};
  if (patch.slug !== undefined) out.slug = patch.slug;
  if (patch.title !== undefined) out.title = patch.title;
  if (patch.body !== undefined) out.body = patch.body ?? null;
  if (patch.category !== undefined) out.category = patch.category;
  if (patch.priority !== undefined) out.priority = patch.priority;
  if (patch.audience !== undefined) out.audience = patch.audience;
  if (patch.artUrl !== undefined) out.artUrl = patch.artUrl ?? null;
  if (patch.linkUrl !== undefined) out.linkUrl = patch.linkUrl ?? null;
  if (patch.videoUrl !== undefined) out.videoUrl = patch.videoUrl ?? null;
  if (patch.videoPosterUrl !== undefined) out.videoPosterUrl = patch.videoPosterUrl ?? null;
  if (patch.videoDurationSec !== undefined) out.videoDurationSec = patch.videoDurationSec ?? null;
  if (patch.triggerOnTitle !== undefined) out.triggerOnTitle = patch.triggerOnTitle;
  if (patch.triggerProbability !== undefined) out.triggerProbability = patch.triggerProbability;
  if (patch.publishedAt !== undefined) out.publishedAt = patch.publishedAt;
  if (patch.expiresAt !== undefined) out.expiresAt = patch.expiresAt ?? null;
  return out;
}

export const announcementsRouter = router({
  /**
   * Returns announcements visible to a client given its audience
   * membership (e.g. ["all","authed","act_ge_3"]). Expired rows are
   * excluded. When `includeViews=true` and a user is authenticated,
   * each row is joined with this user's `announcement_views` data so
   * the client can detect already-seen/dismissed transmissions.
   */
  listActive: publicProcedure
    .input(
      z.object({
        audience: z.array(AudienceTagEnum).default(["all", "unauth"]),
        includeViews: z.boolean().default(false),
      }).optional(),
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [] as Array<AnnouncementWithView>;
      const audience: AudienceTag[] =
        input?.audience && input.audience.length > 0
          ? input.audience
          : ["all", "unauth"];
      const now = new Date();

      // The `announcements` / `announcement_views` tables are created by
      // migration 0049, which is currently orphaned from _journal.json
      // (see apps/db/README.md §"Known journal drift"). On deploys where
      // the table hasn't been hand-applied the raw MySQL error used to
      // bubble up to the Title page and block the whole screen. Degrade
      // to "no announcements" instead so unauth visitors can still load.
      let rows: AnnouncementRow[];
      try {
        rows = await db
          .select()
          .from(announcements)
          .where(
            and(
              inArray(announcements.audience, audience),
              or(isNull(announcements.expiresAt), gt(announcements.expiresAt, now)),
            ),
          )
          .orderBy(
            desc(announcements.priority),
            desc(announcements.publishedAt),
          );
      } catch (err) {
        console.warn("[announcements] listActive query failed:", err instanceof Error ? err.message : String(err));
        return [] as AnnouncementWithView[];
      }

      // Sort: high-priority first, then newest first. MySQL enum order is
      // insertion order — ("normal","high") — so `desc` on the enum
      // column puts "high" first, which matches what we want.
      const baseRows = rows;

      if (!input?.includeViews || !ctx.user) {
        return baseRows.map(toClientRow);
      }

      const userId = ctx.user.id;
      const announcementIds = baseRows.map(r => r.id);
      if (announcementIds.length === 0) return [] as AnnouncementWithView[];

      let views: Array<typeof announcementViews.$inferSelect> = [];
      try {
        views = await db
          .select()
          .from(announcementViews)
          .where(
            and(
              eq(announcementViews.userId, userId),
              inArray(announcementViews.announcementId, announcementIds),
            ),
          );
      } catch (err) {
        console.warn("[announcements] view-join query failed:", err instanceof Error ? err.message : String(err));
      }
      const viewMap = new Map(views.map(v => [v.announcementId, v]));

      return baseRows.map(r => ({
        ...toClientRow(r),
        firstSeenAt: viewMap.get(r.id)?.firstSeenAt ?? null,
        dismissedAt: viewMap.get(r.id)?.dismissedAt ?? null,
      }));
    }),

  /**
   * Stamps firstSeenAt the first time this user sees the announcement.
   * Idempotent — calling twice is a no-op.
   */
  markViewed: protectedProcedure
    .input(z.object({ announcementId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false } as const;
      // Upsert: try insert, fall back to no-op on duplicate unique key.
      try {
        await db.insert(announcementViews).values({
          userId: ctx.user.id,
          announcementId: input.announcementId,
        });
      } catch {
        // Unique-key collision → row already exists, nothing to do.
      }
      return { success: true } as const;
    }),

  /**
   * Stamps dismissedAt so auto-intercept never fires again for this
   * user+announcement pair. Also ensures a view row exists.
   */
  markDismissed: protectedProcedure
    .input(z.object({ announcementId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false } as const;
      const existing = await db
        .select()
        .from(announcementViews)
        .where(
          and(
            eq(announcementViews.userId, ctx.user.id),
            eq(announcementViews.announcementId, input.announcementId),
          ),
        )
        .limit(1);
      if (existing.length > 0) {
        await db
          .update(announcementViews)
          .set({ dismissedAt: sql`CURRENT_TIMESTAMP` })
          .where(eq(announcementViews.id, existing[0].id));
      } else {
        await db.insert(announcementViews).values({
          userId: ctx.user.id,
          announcementId: input.announcementId,
          dismissedAt: new Date(),
        });
      }
      return { success: true } as const;
    }),

  /* ───────────────────────────────────────────────────────
     ADMIN CRUD — wired into the Architect's Console.
     adminProcedure enforces role === "admin" (see _core/trpc.ts).
     ─────────────────────────────────────────────────────── */

  /** List every announcement, including expired. Used by the
   *  Architect's Console announcements tab. */
  adminList: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [] as AnnouncementRow[];
    return db
      .select()
      .from(announcements)
      .orderBy(desc(announcements.publishedAt));
  }),

  adminCreate: adminProcedure
    .input(AdminAnnouncementInputSchema)
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "Database unavailable" });
      try {
        await db.insert(announcements).values(toInsertValues(input));
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (/duplicate|unique/i.test(msg)) {
          throw new TRPCError({ code: "CONFLICT", message: `Slug "${input.slug}" already exists` });
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: msg });
      }

      // High-priority announcements fan out as `system` notifications
      // so authed players see the broadcast in their notification
      // bell, not just on the title screen. Normal-priority rows
      // stay title-only to avoid flooding the bell.
      if (input.priority === "high") {
        try {
          const audience = input.audience;
          const targetUsers = audience === "unauth"
            ? []
            : await db.select({ id: users.id }).from(users);
          if (targetUsers.length > 0) {
            await db.insert(notifications).values(
              targetUsers.map(u => ({
                userId: u.id,
                type: "system" as const,
                title: input.title,
                message: input.body ?? "Broadcast from Architect's Console",
                actionUrl: input.linkUrl ?? "/announcements",
                metadata: { slug: input.slug, category: input.category, priority: input.priority },
              })),
            );
          }
        } catch {
          /* best-effort fanout; the announcement itself already wrote */
        }
      }

      return { success: true } as const;
    }),

  adminUpdate: adminProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        patch: AdminAnnouncementInputSchema.partial(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "Database unavailable" });
      const updateSet = toUpdateValues(input.patch);
      if (Object.keys(updateSet).length === 0) {
        return { success: true, noop: true } as const;
      }
      await db
        .update(announcements)
        .set(updateSet)
        .where(eq(announcements.id, input.id));
      return { success: true } as const;
    }),

  adminDelete: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "Database unavailable" });
      await db.delete(announcementViews).where(eq(announcementViews.announcementId, input.id));
      await db.delete(announcements).where(eq(announcements.id, input.id));
      return { success: true } as const;
    }),
});

type AnnouncementRow = typeof announcements.$inferSelect;

export interface AnnouncementWithView {
  id: number;
  slug: string;
  category: AnnouncementRow["category"];
  priority: AnnouncementRow["priority"];
  title: string;
  body: string | null;
  artUrl: string | null;
  linkUrl: string | null;
  videoUrl: string | null;
  videoPosterUrl: string | null;
  videoDurationSec: number | null;
  triggerOnTitle: boolean;
  triggerProbability: number; // 0–100
  audience: AnnouncementRow["audience"];
  publishedAt: Date;
  expiresAt: Date | null;
  firstSeenAt?: Date | null;
  dismissedAt?: Date | null;
}

function toClientRow(r: AnnouncementRow): AnnouncementWithView {
  return {
    id: r.id,
    slug: r.slug,
    category: r.category,
    priority: r.priority,
    title: r.title,
    body: r.body,
    artUrl: r.artUrl,
    linkUrl: r.linkUrl,
    videoUrl: r.videoUrl,
    videoPosterUrl: r.videoPosterUrl,
    videoDurationSec: r.videoDurationSec,
    triggerOnTitle: r.triggerOnTitle,
    triggerProbability: r.triggerProbability,
    audience: r.audience,
    publishedAt: r.publishedAt,
    expiresAt: r.expiresAt,
  };
}
