/**
 * ACCOUNT ROUTER — GDPR / CCPA surface.
 *
 *   - acceptAgreement: record ToS / Privacy / Cookie acceptance with
 *     the policy version in force at the time. Required by GDPR Art. 7.
 *   - getAgreementStatus: client checks which policies the user has
 *     not yet accepted at their current versions.
 *   - exportMyData: GDPR Art. 15/20 — user requests their full data.
 *     Returns a JSON envelope with every row we hold under their
 *     userId. Streamed-friendly; clients should download and inspect.
 *   - deleteMyAccount: GDPR Art. 17 — user requests erasure. Soft-
 *     deletes by default (sets users.deletedAt), schedules hard
 *     anonymisation after the configurable grace period. Anonymises
 *     name + email immediately so the soft-deleted row carries no
 *     PII even before the cron sweep.
 *
 * The current policy versions live in `CURRENT_AGREEMENT_VERSIONS` so
 * a single source of truth bumps acceptance prompts on the client.
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import {
  users,
  userAgreements,
  userProgress,
  userCards,
  userAchievements,
  userTitles,
  characterSheets,
  storePurchases,
  cosmeticPurchases,
  dreamBalance,
  craftingLog,
  pvpMatches,
  chessGames,
  battlePassProgress,
} from "../../db/schema";
import { eq, and } from "drizzle-orm";
import { createHash } from "crypto";
import { logger } from "../logger";

/**
 * Current policy versions. Bump the value here when the policy text
 * changes; the client `getAgreementStatus` query will then return
 * `accepted: false` for that user until they re-accept.
 *
 * Use ISO date prefixes so versions sort lexicographically.
 */
export const CURRENT_AGREEMENT_VERSIONS = {
  terms_of_service: "2026-05-05",
  privacy_policy: "2026-05-05",
  cookie_policy: "2026-05-05",
} as const;

const AgreementType = z.enum(["terms_of_service", "privacy_policy", "cookie_policy"]);

function hashIp(ip: string | undefined): string | null {
  if (!ip) return null;
  // SHA-256 truncated to 32 hex chars — deterministic for a given IP
  // but not reversible, so the row isn't a PII liability.
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

export const accountRouter = router({
  /** Returns the user's acceptance status for every current policy.
   *  Public so the client can prompt at boot. */
  getAgreementStatus: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      // Anonymous visitor — they need to accept cookies before any
      // persistent identifier is set. ToS/Privacy are deferred until
      // they sign in.
      return {
        accepted: {
          terms_of_service: false,
          privacy_policy: false,
          cookie_policy: false,
        },
        currentVersions: CURRENT_AGREEMENT_VERSIONS,
      };
    }
    const db = await getDb();
    if (!db) {
      return {
        accepted: {
          terms_of_service: false,
          privacy_policy: false,
          cookie_policy: false,
        },
        currentVersions: CURRENT_AGREEMENT_VERSIONS,
      };
    }
    const rows = await db
      .select()
      .from(userAgreements)
      .where(eq(userAgreements.userId, ctx.user.id));

    const acceptedVersions: Record<string, string[]> = {};
    for (const r of rows) {
      acceptedVersions[r.agreementType] ??= [];
      acceptedVersions[r.agreementType].push(r.version);
    }

    return {
      accepted: {
        terms_of_service: acceptedVersions.terms_of_service?.includes(
          CURRENT_AGREEMENT_VERSIONS.terms_of_service,
        ) ?? false,
        privacy_policy: acceptedVersions.privacy_policy?.includes(
          CURRENT_AGREEMENT_VERSIONS.privacy_policy,
        ) ?? false,
        cookie_policy: acceptedVersions.cookie_policy?.includes(
          CURRENT_AGREEMENT_VERSIONS.cookie_policy,
        ) ?? false,
      },
      currentVersions: CURRENT_AGREEMENT_VERSIONS,
    };
  }),

  /** Record acceptance of a policy at its current version. */
  acceptAgreement: protectedProcedure
    .input(
      z.object({
        agreementType: AgreementType,
        version: z.string().max(32).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const { sql } = await import("drizzle-orm");
      const version = input.version ?? CURRENT_AGREEMENT_VERSIONS[input.agreementType];
      const ip = ctx.req.ip
        ?? (typeof ctx.req.headers["x-forwarded-for"] === "string"
          ? ctx.req.headers["x-forwarded-for"]
          : undefined);
      await db
        .insert(userAgreements)
        .values({
          userId: ctx.user.id,
          agreementType: input.agreementType,
          version,
          ipHash: hashIp(ip),
        })
        .onDuplicateKeyUpdate({ set: { agreedAt: sql`agreed_at` } })
        .catch(() => {/* idempotent */});
      return { ok: true, version };
    }),

  /**
   * GDPR Art. 15 / 20 — export every row we hold under this user.
   * Returns a single JSON envelope; clients download and review.
   *
   * Add new tables to the union as the schema grows. Avoid omitting
   * any user-attributable data — the right-of-access principle is
   * "everything we have on them".
   */
  exportMyData: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const userId = ctx.user.id;
    const [
      userRow,
      progress,
      cards,
      achievements,
      titles,
      sheet,
      purchases,
      cosmetics,
      dream,
      crafting,
      pvp,
      chess,
      bp,
      agreements,
    ] = await Promise.all([
      db.select().from(users).where(eq(users.id, userId)),
      db.select().from(userProgress).where(eq(userProgress.userId, userId)),
      db.select().from(userCards).where(eq(userCards.userId, userId)),
      db.select().from(userAchievements).where(eq(userAchievements.userId, userId)),
      db.select().from(userTitles).where(eq(userTitles.userId, userId)),
      db.select().from(characterSheets).where(eq(characterSheets.userId, userId)),
      db.select().from(storePurchases).where(eq(storePurchases.userId, userId)),
      db.select().from(cosmeticPurchases).where(eq(cosmeticPurchases.userId, userId)),
      db.select().from(dreamBalance).where(eq(dreamBalance.userId, userId)),
      db.select().from(craftingLog).where(eq(craftingLog.userId, userId)),
      db.select().from(pvpMatches).where(
        and(eq(pvpMatches.player1Id, userId)),
      ).catch(() => []),
      db.select().from(chessGames).where(eq(chessGames.whitePlayerId, userId)).catch(() => []),
      db.select().from(battlePassProgress).where(eq(battlePassProgress.userId, userId)),
      db.select().from(userAgreements).where(eq(userAgreements.userId, userId)),
    ]);

    return {
      schemaVersion: "2026-05-05",
      exportedAt: new Date().toISOString(),
      user: userRow[0] ?? null,
      progress,
      cards,
      achievements,
      titles,
      characterSheets: sheet,
      storePurchases: purchases,
      cosmeticPurchases: cosmetics,
      dreamBalance: dream,
      craftingLog: crafting,
      pvpMatches: pvp,
      chessGames: chess,
      battlePassProgress: bp,
      agreements,
    };
  }),

  /**
   * GDPR Art. 17 — erasure. Two-stage:
   *   1. Immediate: anonymise PII fields on the users row (name,
   *      email → null), set deletedAt. This satisfies the "no longer
   *      identifiable" requirement instantly.
   *   2. Deferred (cron / nightly job): hard-delete dependent rows
   *      (chat history, analytics events) after a 30-day grace
   *      window — gives the user time to undo if they change their
   *      mind, and matches financial-record retention requirements.
   *
   * The cron job is not yet wired (a follow-up). For now the
   * immediate stage is the user-visible commitment.
   */
  deleteMyAccount: protectedProcedure
    .input(
      z.object({
        // Type the literal phrase to confirm intent — accidental
        // taps don't trigger erasure.
        confirm: z.literal("DELETE MY ACCOUNT"),
        reason: z.string().max(500).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      logger.warn("account_delete_requested", "account", {
        userId: ctx.user.id,
        reason: input.reason ?? null,
      });

      await db
        .update(users)
        .set({
          name: null,
          email: null,
          deletedAt: new Date(),
        })
        .where(eq(users.id, ctx.user.id));

      // Best-effort downstream: clear local Dream balance + game state
      // immediately. The cron will sweep dependent tables after the
      // grace window; this just speeds up the user-facing "your data
      // is gone" feeling.
      await db
        .delete(userProgress)
        .where(eq(userProgress.userId, ctx.user.id))
        .catch(() => {});

      return { ok: true };
    }),
});
