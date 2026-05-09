/* ═══════════════════════════════════════════════════════
   CASINO QUEST PROGRESSION SERVICE
   audit/16 PR 3 — engagement loops

   Bridges the casino's per-game outcomes into the existing
   daily/weekly/epoch quest infrastructure (apps/server/routers/
   dailyQuests.ts). Called once per game from executeGame()
   and playVoidCase()'s afterHook with a normalized signal;
   the service walks the player's active casino-prefix quests
   (questId starts with "d_casino_" / "w_casino_" / "e_casino_"),
   evaluates each predicate, and increments matching rows.

   On completion, fires narrative-flag writes via
   narrativeFlagService for the milestone-class quests so the
   variant resolver (audit/10 wiring) picks them up in
   companion dialogue.

   Designed as best-effort: any failure logs and falls through
   so casino plays never fail because the quest tracker is down.
   ═══════════════════════════════════════════════════════ */

import { eq, and, sql } from "drizzle-orm";
import { dailyQuests } from "../../db/schema";
import { logger } from "../logger";
import { writeNarrativeFlag } from "./narrativeFlagService";

/** Structural — the casino router constructs a richer type, but the
 *  shape we use here is just `select`/`update` from the dailyQuests
 *  table, which works equally well on a transaction handle or the
 *  top-level db. Typed as `any` to dodge Drizzle's deeply-generic
 *  type pyramid; runtime behaviour is identical. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DbLike = any;

/** Game IDs the casino router uses. Mirrored loosely so the
 *  service doesn't import the casino router (avoid cycles). */
export type CasinoGameId =
  | "void_slots"
  | "entropy_dice"
  | "nebula_poker"
  | "quantum_roulette"
  | "pazaak_21"
  | "high_low"
  | "scratch_cards"
  | "void_blackjack_tournament"
  | "liars_dice"
  | "faction_war_betting"
  | "dream_roulette"
  | "card_battlers_gauntlet"
  | "void_bingo"
  | "void_cases"
  | "dischordian_mahjong";

export interface CasinoQuestSignal {
  game: CasinoGameId;
  bet: number;
  /** Was the game won? */
  won: boolean;
  /** Was a progressive jackpot hit? */
  jackpot: boolean;
  /** Streak after this game (0 if loss). */
  newStreak: number;
  /** Streak BEFORE this game — so we can detect threshold-crossing
   *  events ("you just hit a 3-streak") rather than "you have a streak". */
  prevStreak: number;
  /** Count of distinct Tales of the Tables collected this season —
   *  drives e_casino_tale_collector. -1 means "not tracked"; the
   *  service treats negative as "no signal". */
  talesCollectedSeason: number;
}

interface QuestPredicate {
  questId: string;
  /** Returns the increment delta for this quest given the signal.
   *  0 means no progress. Predicates are pure. */
  evaluate: (s: CasinoQuestSignal) => number;
  /** Optional narrative flag fired when the quest first reaches
   *  targetCount. */
  completionFlag?: string;
}

/** Ordered alphabetically by questId so the iteration is stable. */
const PREDICATES: QuestPredicate[] = [
  // ── Daily ──────────────────────────────────────────────
  { questId: "d_casino_play_5",     evaluate: () => 1 },
  { questId: "d_casino_win_3",      evaluate: (s) => (s.won ? 1 : 0) },
  { questId: "d_casino_pazaak_win", evaluate: (s) => (s.game === "pazaak_21" && s.won ? 1 : 0) },
  // Streak threshold crosses (prevStreak < 3 && newStreak >= 3) —
  // increments exactly once per qualifying streak, not on every
  // game where you happen to be streaking.
  { questId: "d_casino_streak_3",   evaluate: (s) => (s.prevStreak < 3 && s.newStreak >= 3 ? 1 : 0) },
  { questId: "d_casino_high_bet",   evaluate: (s) => (s.bet >= 100 ? 1 : 0) },
  { questId: "d_casino_jackpot",    evaluate: (s) => (s.jackpot ? 1 : 0), completionFlag: "casino_first_jackpot_witnessed" },

  // ── Weekly ─────────────────────────────────────────────
  { questId: "w_casino_50_plays",   evaluate: () => 1 },
  { questId: "w_casino_pazaak_5",   evaluate: (s) => (s.game === "pazaak_21" && s.won ? 1 : 0) },
  { questId: "w_casino_streak_5",   evaluate: (s) => (s.prevStreak < 5 && s.newStreak >= 5 ? 1 : 0), completionFlag: "casino_streak_5_hit" },

  // ── Epoch / season ─────────────────────────────────────
  { questId: "e_casino_centurion",      evaluate: (s) => (s.won ? 1 : 0), completionFlag: "casino_centurion" },
  // Tale-collector isn't tied to a single signal — it reads the
  // accumulated tales count off the casino state. Increment to
  // exactly the snapshot value so the row "catches up" to truth.
  // Returns delta-from-current rather than +1; the inner loop
  // clamps to targetCount, so this works even when the player
  // collects multiple tales between two casino plays.
  // We can't compute the delta here without reading the row;
  // the service-loop handles this special case via questId
  // match below (see TALE_COLLECTOR_SET).
  { questId: "e_casino_tale_collector", evaluate: () => 0, completionFlag: "casino_tale_collector" },
];

const TALE_COLLECTOR_QUEST_ID = "e_casino_tale_collector";
const PREDICATE_BY_ID = new Map(PREDICATES.map((p) => [p.questId, p]));

/** Pure helper exported for unit tests — given a quest predicate
 *  registry and a signal, returns a Map<questId, increment>. */
export function evaluateCasinoQuestSignal(
  signal: CasinoQuestSignal,
  predicates: QuestPredicate[] = PREDICATES,
): Map<string, number> {
  const out = new Map<string, number>();
  for (const p of predicates) {
    const inc = p.evaluate(signal);
    if (inc > 0) out.set(p.questId, inc);
  }
  return out;
}

/** Apply quest progression for one casino game outcome.
 *  Best-effort — exceptions are logged + swallowed; the casino play
 *  still succeeds even if quest tracking glitches. */
export async function applyCasinoQuestProgress(
  db: DbLike,
  userId: number,
  signal: CasinoQuestSignal,
): Promise<void> {
  try {
    const increments = evaluateCasinoQuestSignal(signal);

    // Read all active casino-prefix quests for this user. Filtering
    // by `questId LIKE '%_casino_%'` would work but `LIKE` on a
    // varchar(128) is fine for the current scale (<20 casino quest
    // ids per user across all periods). Instead select just the
    // matching IDs we know about — a single IN clause.
    const allCasinoIds = PREDICATES.map((p) => p.questId);
    const rows = await db
      .select()
      .from(dailyQuests)
      .where(
        and(
          eq(dailyQuests.userId, userId),
          // dialect-portable IN via sql template
          sql`${dailyQuests.questId} IN (${sql.join(
            allCasinoIds.map((id) => sql`${id}`),
            sql`, `,
          )})`,
        ),
      );

    for (const row of rows) {
      const pred = PREDICATE_BY_ID.get(row.questId);
      if (!pred) continue;
      if (row.claimed) continue;
      if (row.currentCount >= row.targetCount) continue;

      let delta: number;
      if (row.questId === TALE_COLLECTOR_QUEST_ID) {
        // Snap currentCount to the accumulated season count.
        if (signal.talesCollectedSeason < 0) continue;
        const target = Math.min(row.targetCount, signal.talesCollectedSeason);
        delta = Math.max(0, target - row.currentCount);
      } else {
        delta = increments.get(row.questId) ?? 0;
      }
      if (delta <= 0) continue;

      const newCount = Math.min(row.targetCount, row.currentCount + delta);
      const completedNow =
        row.currentCount < row.targetCount && newCount >= row.targetCount;

      await db
        .update(dailyQuests)
        .set({ currentCount: newCount })
        .where(eq(dailyQuests.id, row.id));

      // Narrative flag bridge — fire the registered flag the FIRST
      // time the quest crosses into completion. No-op (idempotent
      // by unique-index on (userId, flag)) if the flag was already
      // written from a previous completion of the same quest in a
      // different period.
      if (completedNow && pred.completionFlag) {
        try {
          await writeNarrativeFlag(userId, pred.completionFlag, "casino");
        } catch (e) {
          logger.warn("[CasinoQuestProgress] narrative flag write failed", {
            userId,
            flag: pred.completionFlag,
            error: e instanceof Error ? e.message : String(e),
          });
        }
      }
    }
  } catch (e) {
    // Defensive: never let quest-progression bugs break a casino play.
    logger.warn("[CasinoQuestProgress] failed (best-effort)", {
      userId,
      error: e instanceof Error ? e.message : String(e),
    });
  }
}

/** Test-only — exposes the predicate registry. */
export const _CASINO_QUEST_PREDICATES_FOR_TESTS = PREDICATES;
