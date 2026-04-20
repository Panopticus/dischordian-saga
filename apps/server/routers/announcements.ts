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

   `listActive` is a publicProcedure so the unauth title
   state can fetch `audience="all"` and `"unauth"` cards
   without an auth round-trip. `markViewed`/`markDismissed`
   require auth — they write `announcement_views` rows.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { and, desc, eq, gt, inArray, isNull, or, sql } from "drizzle-orm";

import { announcements, announcementViews } from "../../db/schema";
import { getDb } from "../db";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";

/** Audience tags the client can declare itself a member of. The
 *  server filters `announcements.audience` by set membership: any row
 *  whose audience is `all` OR is in the client-supplied set matches. */
const AudienceTagEnum = z.enum([
  "all", "unauth", "authed", "act_ge_3", "light_aligned", "dark_aligned",
]);

type AudienceTag = z.infer<typeof AudienceTagEnum>;

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

      const rows = await db
        .select()
        .from(announcements)
        .where(
          and(
            inArray(announcements.audience, audience),
            or(isNull(announcements.expiresAt), gt(announcements.expiresAt, now)),
          ),
        )
        .orderBy(
          desc(announcements.priority), // 'high' sorts after 'normal' lexically → use priority = desc so 'normal' sorts ascending; we sort by publishedAt too
          desc(announcements.publishedAt),
        );

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

      const views = await db
        .select()
        .from(announcementViews)
        .where(
          and(
            eq(announcementViews.userId, userId),
            inArray(announcementViews.announcementId, announcementIds),
          ),
        );
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
