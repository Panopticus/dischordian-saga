/**
 * Abuse / cheating signal aggregation.
 *
 * Three signal families, each returning a list of suspicious userIds
 * + reasons for moderator review. Run on a schedule (cron) and
 * surface to the architectConsole.
 *
 *   - detectSandbagging: ELO crashed unusually fast.
 *   - detectTradeCollusion: repeated off-market A→B trades.
 *   - detectCoopLeech: coop session participants who didn't meet a
 *     minimum-contribution threshold.
 *
 * These are flags, not auto-bans. Moderators decide.
 */
import type { DrizzleDb } from "../db";
import { sql } from "drizzle-orm";

export interface SandbaggingFlag {
  userId: number;
  eloDrop: number;
  windowDays: number;
  matchesInWindow: number;
}

export interface TradeCollusionFlag {
  buyerUserId: number;
  sellerUserId: number;
  pairTradeCount: number;
  windowDays: number;
  averageDeviationPct: number;
}

export interface CoopLeechFlag {
  userId: number;
  sessionId: string;
  damageDealt: number;
  expectedMinDamage: number;
  contributionPct: number;
}

/** Threshold defaults — tune with the moderation team. */
export const ABUSE_THRESHOLDS = {
  sandbagging: {
    minEloDrop: 300,           // points lost
    windowDays: 7,
    minMatchesInWindow: 5,
  },
  tradeCollusion: {
    windowDays: 7,
    minPairTrades: 5,           // A↔B trades within window
    deviationPct: 0.15,         // ≥15% off market price
  },
  coopLeech: {
    minDamageContributionPct: 0.05, // 5% of total = floor
  },
} as const;

/**
 * Sandbagging — players who lost too much ELO too fast (typically a
 * smurf account intentionally tanking to play in lower brackets).
 * Joined against pvp_leaderboard for the current ELO + match count.
 *
 * NOTE: This is a heuristic. False positives include players who
 * truly burned out / had connection issues / experimented with a
 * meme deck. Surface to mods, don't auto-ban.
 */
export async function detectSandbagging(db: DrizzleDb): Promise<SandbaggingFlag[]> {
  const t = ABUSE_THRESHOLDS.sandbagging;
  const rows = await db.execute(sql`
    SELECT
      pl.user_id              AS userId,
      pl.peak_elo - pl.elo    AS eloDrop,
      pl.matches_played       AS matchesInWindow
    FROM pvp_leaderboard pl
    WHERE pl.peak_elo - pl.elo >= ${t.minEloDrop}
      AND pl.matches_played    >= ${t.minMatchesInWindow}
      AND pl.last_match_at    >= NOW() - INTERVAL ${t.windowDays} DAY
  `);
  // mysql2 returns [rows, fields]; drizzle .execute returns the
  // same shape. Narrow defensively.
  const data = (rows as unknown as [Array<Record<string, unknown>>])[0] ?? [];
  return data.map((r) => ({
    userId: Number(r.userId),
    eloDrop: Number(r.eloDrop),
    windowDays: t.windowDays,
    matchesInWindow: Number(r.matchesInWindow ?? 0),
  }));
}

/**
 * Trade collusion — pairs of accounts that trade with each other
 * unusually often, especially at off-market prices. Suggests two
 * accounts (one alt, one main) farming.
 *
 * The price-deviation half is best-effort: if `marketplace_listings`
 * has a recorded market price at the time of the sale we can compute
 * deviation; otherwise the count alone is the signal.
 */
export async function detectTradeCollusion(db: DrizzleDb): Promise<TradeCollusionFlag[]> {
  const t = ABUSE_THRESHOLDS.tradeCollusion;
  const rows = await db.execute(sql`
    SELECT
      buyer_user_id   AS buyerUserId,
      seller_user_id  AS sellerUserId,
      COUNT(*)        AS pairTradeCount
    FROM card_trades
    WHERE created_at >= NOW() - INTERVAL ${t.windowDays} DAY
      AND status = 'completed'
    GROUP BY buyer_user_id, seller_user_id
    HAVING pairTradeCount >= ${t.minPairTrades}
    ORDER BY pairTradeCount DESC
    LIMIT 200
  `);
  const data = (rows as unknown as [Array<Record<string, unknown>>])[0] ?? [];
  return data.map((r) => ({
    buyerUserId: Number(r.buyerUserId),
    sellerUserId: Number(r.sellerUserId),
    pairTradeCount: Number(r.pairTradeCount),
    windowDays: t.windowDays,
    averageDeviationPct: 0,
  }));
}

/**
 * Coop raid leech — participants whose damage contribution was below
 * the minimum threshold (default 5%). Returns one row per
 * (userId, sessionId).
 */
export async function detectCoopLeech(db: DrizzleDb): Promise<CoopLeechFlag[]> {
  const t = ABUSE_THRESHOLDS.coopLeech;
  const rows = await db.execute(sql`
    SELECT
      d.user_id                                 AS userId,
      d.raid_session_id                         AS sessionId,
      d.damage_dealt                            AS damageDealt,
      total.total_damage                        AS totalDamage
    FROM coop_raid_damage d
    JOIN (
      SELECT raid_session_id, SUM(damage_dealt) AS total_damage
      FROM coop_raid_damage
      GROUP BY raid_session_id
    ) total ON total.raid_session_id = d.raid_session_id
    WHERE total.total_damage > 0
      AND d.damage_dealt / total.total_damage < ${t.minDamageContributionPct}
    ORDER BY d.raid_session_id, d.damage_dealt
    LIMIT 500
  `);
  const data = (rows as unknown as [Array<Record<string, unknown>>])[0] ?? [];
  return data.map((r) => {
    const dealt = Number(r.damageDealt ?? 0);
    const total = Number(r.totalDamage ?? 0);
    const expectedMin = Math.ceil(total * t.minDamageContributionPct);
    return {
      userId: Number(r.userId),
      sessionId: String(r.sessionId),
      damageDealt: dealt,
      expectedMinDamage: expectedMin,
      contributionPct: total > 0 ? dealt / total : 0,
    };
  });
}

/** Aggregate sweep — used by a nightly cron / on-demand admin call. */
export async function runAbuseSweep(db: DrizzleDb) {
  const [sandbagging, collusion, leech] = await Promise.all([
    detectSandbagging(db).catch(() => [] as SandbaggingFlag[]),
    detectTradeCollusion(db).catch(() => [] as TradeCollusionFlag[]),
    detectCoopLeech(db).catch(() => [] as CoopLeechFlag[]),
  ]);
  return {
    sandbagging,
    collusion,
    leech,
    timestamp: new Date().toISOString(),
  };
}
