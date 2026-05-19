/* ═══════════════════════════════════════════════════════
   WINBACK OFFER SERVICE — lapsed-player comeback

   A returning player who has been away gets a one-time "we kept
   your seat warm" Dream grant, scaled by how long they were gone AND
   how invested they were before (a long-streak veteran who lapsed is
   worth more re-engagement than a two-day tourist).

   Anti-farm: the claim is keyed to the lapse episode itself — the
   `lastLoginDate` that started the gap. Once claimed for that key it
   cannot be reclaimed; a fresh offer requires a genuine fresh lapse
   (a new lastLoginDate). No new table — the claim marker lives in
   userProgress.gameData (same JSON store the entitlement service
   uses), so claim-record + Dream grant commit in one transaction and
   a retry is a no-op.
   ═══════════════════════════════════════════════════════ */

import { getDb } from "../db";
import { loginCalendar, userProgress, dreamBalance } from "../../db/schema";
import { eq, sql } from "drizzle-orm";

const MIN_LAPSE_DAYS = 3;
const REWARD_CAP = 500;
const MAX_CLAIM_HISTORY = 20;

export type WinbackTier = "drifting" | "lapsed" | "lost";

export interface WinbackOffer {
  tier: WinbackTier;
  daysAway: number;
  /** Dream tokens this offer grants. */
  rewardDream: number;
  /** Stable per-lapse-episode id; the same value gates the claim. */
  lapseKey: string;
  /** False once this lapse episode has already been claimed. */
  claimable: boolean;
}

function daysBetweenUtc(fromYmd: string, todayMs: number): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fromYmd);
  if (!m) return null;
  const from = Date.UTC(+m[1], +m[2] - 1, +m[3]);
  if (Number.isNaN(from)) return null;
  return Math.floor((todayMs - from) / 86_400_000);
}

function classify(daysAway: number): WinbackTier {
  if (daysAway >= 30) return "lost";
  if (daysAway >= 7) return "lapsed";
  return "drifting";
}

/** Deterministic, capped. Base by tier + a loyalty kicker from the
 *  player's best-ever streak (clamped) so veterans get a stronger
 *  pull without the reward being farmable. */
function rewardFor(tier: WinbackTier, longestStreak: number): number {
  const loyalty = Math.min(Math.max(longestStreak, 0), 30);
  const base =
    tier === "lost" ? 300 : tier === "lapsed" ? 150 : 50;
  const mult = tier === "lost" ? 3 : tier === "lapsed" ? 2 : 1;
  return Math.min(REWARD_CAP, base + loyalty * mult);
}

function readClaims(gameData: Record<string, unknown> | null): string[] {
  const raw = gameData?.winbackClaims;
  return Array.isArray(raw) ? (raw.filter((x) => typeof x === "string") as string[]) : [];
}

/**
 * The player's current comeback offer, or null if they are not
 * lapsed (or have no structured login history yet).
 */
export async function getWinbackOffer(
  userId: number,
): Promise<WinbackOffer | null> {
  const db = await getDb();
  if (!db) return null;

  const [cal] = await db
    .select()
    .from(loginCalendar)
    .where(eq(loginCalendar.userId, userId))
    .limit(1);
  if (!cal?.lastLoginDate) return null;

  const daysAway = daysBetweenUtc(cal.lastLoginDate, Date.now());
  if (daysAway == null || daysAway < MIN_LAPSE_DAYS) return null;

  const tier = classify(daysAway);
  const lapseKey = cal.lastLoginDate; // stable per lapse episode

  const [prog] = await db
    .select({ gameData: userProgress.gameData })
    .from(userProgress)
    .where(eq(userProgress.userId, userId))
    .limit(1);
  const alreadyClaimed = readClaims(prog?.gameData ?? null).includes(
    lapseKey,
  );

  return {
    tier,
    daysAway,
    rewardDream: rewardFor(tier, cal.longestStreak ?? 0),
    lapseKey,
    claimable: !alreadyClaimed,
  };
}

export type WinbackClaimResult =
  | { claimed: true; rewardDream: number; tier: WinbackTier }
  | { claimed: false; reason: "not_eligible" | "already_claimed" | "no_db" };

/**
 * Grant the comeback reward and record the claim, atomically. Safe to
 * retry: the lapse-key claim marker is written in the same
 * transaction as the Dream grant, so a duplicate call after success
 * resolves to already_claimed without re-granting.
 */
export async function claimWinbackOffer(
  userId: number,
): Promise<WinbackClaimResult> {
  const db = await getDb();
  if (!db) return { claimed: false, reason: "no_db" };

  const offer = await getWinbackOffer(userId);
  if (!offer) return { claimed: false, reason: "not_eligible" };
  if (!offer.claimable) return { claimed: false, reason: "already_claimed" };

  return db.transaction(async (tx) => {
    // Re-read claims inside the tx and re-check, so two concurrent
    // claims for the same lapse can't both grant.
    const [prog] = await tx
      .select({ gameData: userProgress.gameData })
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .limit(1);
    const gameData = (prog?.gameData ?? {}) as Record<string, unknown>;
    const claims = readClaims(gameData);
    if (claims.includes(offer.lapseKey)) {
      return { claimed: false as const, reason: "already_claimed" as const };
    }

    const nextClaims = [...claims, offer.lapseKey].slice(-MAX_CLAIM_HISTORY);
    const nextGameData = { ...gameData, winbackClaims: nextClaims };

    if (prog) {
      await tx
        .update(userProgress)
        .set({ gameData: nextGameData })
        .where(eq(userProgress.userId, userId));
    } else {
      await tx
        .insert(userProgress)
        .values({ userId, gameData: nextGameData });
    }

    const [bal] = await tx
      .select({ userId: dreamBalance.userId })
      .from(dreamBalance)
      .where(eq(dreamBalance.userId, userId))
      .limit(1);
    if (bal) {
      await tx
        .update(dreamBalance)
        .set({
          dreamTokens: sql`${dreamBalance.dreamTokens} + ${offer.rewardDream}`,
        })
        .where(eq(dreamBalance.userId, userId));
    } else {
      await tx.insert(dreamBalance).values({
        userId,
        dreamTokens: offer.rewardDream,
        soulBoundDream: 0,
      });
    }

    return {
      claimed: true as const,
      rewardDream: offer.rewardDream,
      tier: offer.tier,
    };
  });
}
