/**
 * Sessions router — user-facing list + revoke for active devices.
 *
 *   - listMine: returns the caller's active sessions (sans secrets).
 *   - revoke: revoke a specific session by id; can't revoke the
 *     current session via this endpoint (use /api/refresh + cookie
 *     clear, which is the normal logout path).
 *   - revokeAllOthers: revoke every session except the current
 *     one — useful "I think my account was compromised" button.
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { userSessions } from "../../db/schema";
import { eq, and, isNull, ne } from "drizzle-orm";
import { COOKIE_NAME, REFRESH_COOKIE_NAME } from "@shared/const";
import { sdk } from "../_core/sdk";
import { parse as parseCookieHeader } from "cookie";

async function currentJti(req: import("express").Request): Promise<string | null> {
  const header = req.headers.cookie;
  if (!header) return null;
  const cookies = parseCookieHeader(header);
  const refresh = cookies[REFRESH_COOKIE_NAME];
  if (!refresh) return null;
  const payload = await sdk.verifyRefreshToken(refresh);
  return payload?.jti ?? null;
}

export const sessionsRouter = router({
  listMine: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    const rows = await db
      .select()
      .from(userSessions)
      .where(and(eq(userSessions.userId, ctx.user.id), isNull(userSessions.revokedAt)));
    const me = await currentJti(ctx.req);
    return rows.map((r) => ({
      id: r.id,
      deviceLabel: r.deviceLabel,
      createdAt: r.createdAt,
      lastUsedAt: r.lastUsedAt,
      isCurrent: r.refreshTokenJti === me,
    }));
  }),

  revoke: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const me = await currentJti(ctx.req);
      const [row] = await db.select().from(userSessions).where(eq(userSessions.id, input.id));
      if (!row || row.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      if (row.refreshTokenJti === me) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Use logout for the current session.",
        });
      }
      sdk.invalidateRefreshToken(row.refreshTokenJti);
      await db
        .update(userSessions)
        .set({ revokedAt: new Date() })
        .where(eq(userSessions.id, input.id));
      return { ok: true };
    }),

  revokeAllOthers: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    const me = await currentJti(ctx.req);
    const rows = await db
      .select()
      .from(userSessions)
      .where(and(
        eq(userSessions.userId, ctx.user.id),
        isNull(userSessions.revokedAt),
        me ? ne(userSessions.refreshTokenJti, me) : undefined,
      ));
    for (const r of rows) {
      sdk.invalidateRefreshToken(r.refreshTokenJti);
    }
    if (rows.length > 0) {
      const ids = rows.map((r) => r.id);
      // Drizzle inArray would be cleaner — using a loop because the
      // count is bounded by realistic device count (≤ 10 typical).
      for (const id of ids) {
        await db
          .update(userSessions)
          .set({ revokedAt: new Date() })
          .where(eq(userSessions.id, id));
      }
    }
    return { revoked: rows.length };
  }),
});
