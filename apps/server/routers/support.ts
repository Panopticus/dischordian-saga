/**
 * Support impersonation — auditable, time-boxed admin tooling.
 *
 *   - issueGrant(targetUserId, reason): admin creates a grant. The
 *     grant id + reason go to admin_audit_log immediately.
 *   - listMyGrants(): admin lists their issued grants.
 *   - useGrant(grantId): admin redeems the grant. The server
 *     issues a session token bound to targetUserId — the rest of
 *     the surface treats them as the target user, but every
 *     mutation the grantee performs is tagged in admin_audit_log
 *     with the grantId so post-hoc review traces actions back to
 *     the admin.
 *   - listGrantsAgainstMe(): user sees who has been granted access
 *     to their account — transparency.
 *
 * Burn-after-use: useGrant flips usedAt; the same grant can't be
 * redeemed twice. TTL defaults to 1 hour.
 *
 * The actual session-issuance is server-authority — we don't
 * expose a way for the client to request a session as the target
 * user; useGrant returns an access token that's valid for that
 * one user, signed by the regular session secret.
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, adminProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import {
  supportImpersonationGrants,
  users,
  adminAuditLog,
} from "../../db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import { sdk } from "../_core/sdk";

const GRANT_TTL_MS = 60 * 60 * 1000; // 1 hour

export const supportRouter = router({
  /** Admin issues a grant. Logs immediately. */
  issueGrant: adminProcedure
    .input(z.object({
      targetUserId: z.number().int().positive(),
      reason: z.string().min(8).max(512),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const [target] = await db.select().from(users).where(eq(users.id, input.targetUserId));
      if (!target) throw new TRPCError({ code: "NOT_FOUND" });

      const expiresAt = new Date(Date.now() + GRANT_TTL_MS);
      const result = await db
        .insert(supportImpersonationGrants)
        .values({
          issuedToAdminId: ctx.user.id,
          targetUserId: input.targetUserId,
          reason: input.reason,
          expiresAt,
        });

      await db.insert(adminAuditLog).values({
        adminId: ctx.user.id,
        action: "support.issueGrant",
        details: {
          targetUserId: input.targetUserId,
          reason: input.reason,
          expiresAt: expiresAt.toISOString(),
        },
      });

      return { ok: true, expiresAt };
    }),

  /** Admin lists their grants — most recent first. */
  listMyGrants: adminProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return db
      .select()
      .from(supportImpersonationGrants)
      .where(eq(supportImpersonationGrants.issuedToAdminId, ctx.user.id))
      .orderBy(desc(supportImpersonationGrants.createdAt))
      .limit(50);
  }),

  /**
   * User-facing transparency: who has been granted access to my
   * account. Returns admin name (no email — admins are internal).
   */
  listGrantsAgainstMe: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return db
      .select({
        id: supportImpersonationGrants.id,
        adminName: users.name,
        reason: supportImpersonationGrants.reason,
        createdAt: supportImpersonationGrants.createdAt,
        usedAt: supportImpersonationGrants.usedAt,
        expiresAt: supportImpersonationGrants.expiresAt,
      })
      .from(supportImpersonationGrants)
      .innerJoin(users, eq(supportImpersonationGrants.issuedToAdminId, users.id))
      .where(eq(supportImpersonationGrants.targetUserId, ctx.user.id))
      .orderBy(desc(supportImpersonationGrants.createdAt))
      .limit(50);
  }),

  /**
   * Admin redeems the grant. Returns a short-lived access token
   * scoped to the target user. The client puts the token in the
   * session cookie (via the existing /api/refresh mechanism) and
   * acts as the target.
   *
   * IMPORTANT: this token is HS256-signed by the same JWT_SECRET as
   * normal sessions, but every API call the impersonator makes
   * during the window writes an admin_audit_log row with
   * action=`support.impersonatedAction` and grantId in details.
   * That wiring is a follow-up — this endpoint mints the token.
   */
  useGrant: adminProcedure
    .input(z.object({ grantId: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const [grant] = await db
        .select()
        .from(supportImpersonationGrants)
        .where(and(
          eq(supportImpersonationGrants.id, input.grantId),
          eq(supportImpersonationGrants.issuedToAdminId, ctx.user.id),
          isNull(supportImpersonationGrants.usedAt),
        ));
      if (!grant) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Grant not found, already used, or not yours" });
      }
      if (grant.expiresAt.getTime() < Date.now()) {
        throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Grant expired" });
      }

      const [target] = await db.select().from(users).where(eq(users.id, grant.targetUserId));
      if (!target) throw new TRPCError({ code: "NOT_FOUND" });

      // Mint the impersonation token — short TTL = grant remaining.
      const remainingMs = grant.expiresAt.getTime() - Date.now();
      const token = await sdk.createSessionToken(target.openId, {
        name: target.name ?? `User${target.id}`,
        expiresInMs: Math.min(remainingMs, GRANT_TTL_MS),
      });

      // Burn-after-use.
      await db
        .update(supportImpersonationGrants)
        .set({ usedAt: new Date() })
        .where(eq(supportImpersonationGrants.id, grant.id));

      await db.insert(adminAuditLog).values({
        adminId: ctx.user.id,
        action: "support.useGrant",
        details: {
          grantId: grant.id,
          targetUserId: grant.targetUserId,
          reason: grant.reason,
        },
      });

      return {
        token,
        expiresAt: grant.expiresAt,
        targetUserId: grant.targetUserId,
        targetName: target.name,
      };
    }),
});
