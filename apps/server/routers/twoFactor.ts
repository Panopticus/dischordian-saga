/**
 * 2FA enrollment + verification router.
 *
 *   - enroll: generate a fresh secret + backup codes; return the
 *     otpauth URI (for QR rendering) and the plaintext backup codes
 *     (shown ONCE — the server stores only sha256 hashes).
 *   - confirmEnroll: user submits their first valid code, flipping
 *     confirmed=true.
 *   - verify: caller submits a code OR backup code at sensitive
 *     operations (admin actions, account deletion).
 *   - status: caller asks if they have 2FA enabled.
 *   - disable: requires a valid current code; clears the row.
 *
 * Storage in user_two_factor (one row per user). Backup codes are
 * burn-after-use: when one matches, we splice the hash out of the
 * array so it can't be reused.
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { userTwoFactor } from "../../db/schema";
import { eq } from "drizzle-orm";
import {
  generateBackupCodes,
  generateTotpSecret,
  hashBackupCode,
  totpUri,
  verifyTotp,
} from "../services/totp";

const ISSUER = "Loredex OS";

export const twoFactorRouter = router({
  /** Returns whether 2FA is enrolled-and-confirmed for the caller. */
  status: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { enrolled: false, confirmed: false };
    const [row] = await db.select().from(userTwoFactor).where(eq(userTwoFactor.userId, ctx.user.id));
    return {
      enrolled: Boolean(row),
      confirmed: Boolean(row?.confirmed),
    };
  }),

  /**
   * Generate a fresh secret + backup codes. Replaces any previous
   * unconfirmed enrollment; rejects if a confirmed enrollment exists
   * (require disable first).
   */
  enroll: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const [existing] = await db
      .select()
      .from(userTwoFactor)
      .where(eq(userTwoFactor.userId, ctx.user.id));
    if (existing?.confirmed) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "2FA already enabled. Disable first to re-enroll.",
      });
    }

    const secret = generateTotpSecret();
    const backupCodes = generateBackupCodes(10);
    const backupCodeHashes = backupCodes.map(hashBackupCode);
    const account = ctx.user.email ?? ctx.user.openId;
    const uri = totpUri({ issuer: ISSUER, account, secret });

    await db
      .insert(userTwoFactor)
      .values({
        userId: ctx.user.id,
        secret,
        backupCodeHashes,
        confirmed: false,
      })
      .onDuplicateKeyUpdate({
        set: {
          secret,
          backupCodeHashes,
          confirmed: false,
        },
      });

    return {
      secret,
      otpauthUri: uri,
      backupCodes, // shown ONCE — never returned again
    };
  }),

  /** Confirm enrollment with the first valid code. */
  confirmEnroll: protectedProcedure
    .input(z.object({ code: z.string().min(6).max(10) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const [row] = await db.select().from(userTwoFactor).where(eq(userTwoFactor.userId, ctx.user.id));
      if (!row) throw new TRPCError({ code: "NOT_FOUND", message: "No enrollment in progress" });
      if (row.confirmed) return { ok: true };

      if (!verifyTotp(row.secret, input.code)) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid code" });
      }

      await db
        .update(userTwoFactor)
        .set({ confirmed: true, confirmedAt: new Date(), lastUsedAt: new Date() })
        .where(eq(userTwoFactor.userId, ctx.user.id));
      return { ok: true };
    }),

  /**
   * Verify a code at the call site of a sensitive operation. Returns
   * `{ ok: true }` on success — the caller decides what to do with
   * that. Backup codes are accepted and burned.
   */
  verify: protectedProcedure
    .input(z.object({ code: z.string().min(6).max(16) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const [row] = await db.select().from(userTwoFactor).where(eq(userTwoFactor.userId, ctx.user.id));
      if (!row?.confirmed) {
        throw new TRPCError({ code: "PRECONDITION_FAILED", message: "2FA not enabled" });
      }

      // First try the standard 6-digit TOTP path.
      if (/^\d{6}$/.test(input.code) && verifyTotp(row.secret, input.code)) {
        await db
          .update(userTwoFactor)
          .set({ lastUsedAt: new Date() })
          .where(eq(userTwoFactor.userId, ctx.user.id));
        return { ok: true, method: "totp" as const };
      }

      // Fall back to backup codes — burn-after-use.
      const submittedHash = hashBackupCode(input.code);
      const remaining = (row.backupCodeHashes ?? []).filter((h) => h !== submittedHash);
      const used = remaining.length !== (row.backupCodeHashes?.length ?? 0);
      if (used) {
        await db
          .update(userTwoFactor)
          .set({ backupCodeHashes: remaining, lastUsedAt: new Date() })
          .where(eq(userTwoFactor.userId, ctx.user.id));
        return { ok: true, method: "backup" as const, remainingBackupCodes: remaining.length };
      }

      throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid code" });
    }),

  /** Disable 2FA. Requires a valid current code. */
  disable: protectedProcedure
    .input(z.object({ code: z.string().min(6).max(16) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const [row] = await db.select().from(userTwoFactor).where(eq(userTwoFactor.userId, ctx.user.id));
      if (!row?.confirmed) return { ok: true };

      if (!verifyTotp(row.secret, input.code)) {
        // Try backup code as last-resort.
        const submittedHash = hashBackupCode(input.code);
        if (!(row.backupCodeHashes ?? []).includes(submittedHash)) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid code" });
        }
      }

      await db.delete(userTwoFactor).where(eq(userTwoFactor.userId, ctx.user.id));
      return { ok: true };
    }),
});
