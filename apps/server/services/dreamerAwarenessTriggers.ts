/* ═══════════════════════════════════════════════════════
   DREAMER-AWARENESS TRIGGER HELPERS

   Three thin server-side glues that translate gameplay events
   into `tagDreamerAwareness(...)` calls. Each helper is defensive:
   tag fires are idempotent per (user, tag id) at the service layer
   (see apps/server/services/dreamerAwareness.ts), so redundant or
   borderline triggers never compound.

   Triggers wired today:
     - maybeTagAskRepeated:       substrate/dream/oracle ≥3 asks
     - maybeTagDeclineWinningDraw chess draw declined while ahead
     - tagBurntCardWitnessed:     direct passthrough for the
                                  client-reported Seer-defeated path

   Each helper logs but never throws; gameplay paths can call them
   with no failure-handling boilerplate.
   ═══════════════════════════════════════════════════════ */
import { and, eq } from "drizzle-orm";
import { getDb } from "../db";
import { logger } from "../logger";
import { tagDreamerAwareness } from "./dreamerAwareness";
import { npcAskTopicHistory } from "../../db/schema";
import {
  ASK_REPEAT_THRESHOLD,
  BURNT_CARD_WITNESSED,
  DECLINE_DRAW_MATERIAL_ADVANTAGE,
  DECLINE_WINNING_DRAW,
  MORALITY_DIVERGENT_CHOICE,
  MORALITY_DIVERGENT_CONTEXTS,
  MORALITY_DIVERGENT_THRESHOLD,
  dreamerTagForTopicId,
  SUBSTRATE_TOPIC_PATTERNS,
  DREAM_TOPIC_PATTERNS,
  ORACLE_TOPIC_PATTERNS,
} from "../../shared/dreamerAwarenessTags";

/**
 * Called from npc.recordAskTopicAsked after a successful insert.
 * Counts the user's distinct historical asks for the keyword
 * family the topic belongs to (substrate / dream / oracle); when
 * the count crosses the repeat threshold, fires the corresponding
 * Dreamer-awareness tag.
 *
 * Pattern-matching is case-insensitive substring matching against
 * the topicId — see SUBSTRATE_TOPIC_PATTERNS / DREAM_TOPIC_PATTERNS
 * / ORACLE_TOPIC_PATTERNS in apps/shared/dreamerAwarenessTags.ts.
 */
export async function maybeTagAskRepeated(
  userId: number,
  topicId: string,
): Promise<void> {
  const tag = dreamerTagForTopicId(topicId);
  if (!tag) return;
  const db = await getDb();
  if (!db) return;

  // Pull all of this user's ask history. Topic count is small
  // per-user (dozens at most), so we hydrate then count in JS
  // rather than building a schema-aware LIKE query per pattern.
  try {
    const rows = await db
      .select({ topicId: npcAskTopicHistory.topicId })
      .from(npcAskTopicHistory)
      .where(eq(npcAskTopicHistory.userId, userId));

    const patterns = patternsForTag(tag.id);
    const count = rows.filter((r) =>
      patterns.some((p) => r.topicId.toLowerCase().includes(p)),
    ).length;

    if (count >= ASK_REPEAT_THRESHOLD) {
      await tagDreamerAwareness(userId, tag.id);
    }
  } catch (e) {
    logger.warn(
      `[dreamerAwareness] maybeTagAskRepeated for user ${userId} topic ${topicId} failed: ${
        e instanceof Error ? e.message : String(e)
      }`,
    );
  }
}

function patternsForTag(tagId: string): readonly string[] {
  if (tagId === "ask_substrate_repeated") return SUBSTRATE_TOPIC_PATTERNS;
  if (tagId === "ask_dream_repeated") return DREAM_TOPIC_PATTERNS;
  if (tagId === "ask_oracle_repeated") return ORACLE_TOPIC_PATTERNS;
  return [];
}

/**
 * Called from chessWs.ts when a player issues DECLINE_DRAW. Builds
 * the position from the supplied FEN, sums standard piece values
 * for each side, and if the declining player is ahead by at least
 * DECLINE_DRAW_MATERIAL_ADVANTAGE, fires the tag.
 *
 * Heuristic — material advantage is the cheapest "winning"
 * approximation that doesn't require a full Stockfish eval. False
 * negatives are fine (the tag is rare on purpose); false positives
 * are tolerable (declining a +3 draw is still a meaningful refusal).
 */
export async function maybeTagDeclineWinningDraw(
  userId: number,
  fen: string,
  decliningSide: "white" | "black",
): Promise<void> {
  const advantage = computeMaterialAdvantage(fen, decliningSide);
  if (advantage < DECLINE_DRAW_MATERIAL_ADVANTAGE) return;
  await tagDreamerAwareness(userId, DECLINE_WINNING_DRAW.id);
}

/** Standard piece-value table; king omitted (always present). */
const PIECE_VALUE: Readonly<Record<string, number>> = {
  p: 1, n: 3, b: 3, r: 5, q: 9,
  P: 1, N: 3, B: 3, R: 5, Q: 9,
};

/**
 * Sum piece values from a FEN string. White uppercase, black
 * lowercase. Returns (mySide - theirSide); positive ⇒ declining
 * side is materially ahead.
 *
 * Pure helper — no chess.js dependency at this layer because the
 * position-summary piece map is the only field we need.
 */
function computeMaterialAdvantage(
  fen: string,
  side: "white" | "black",
): number {
  const board = fen.split(" ")[0] ?? "";
  let white = 0;
  let black = 0;
  for (const ch of board) {
    if (ch === "/" || (ch >= "0" && ch <= "9")) continue;
    const val = PIECE_VALUE[ch];
    if (val === undefined) continue;
    if (ch === ch.toUpperCase()) white += val;
    else black += val;
  }
  return side === "white" ? white - black : black - white;
}

// Exposed for unit testing — the FEN parser is the only piece worth
// asserting in isolation.
export const _internals = {
  computeMaterialAdvantage,
};

/**
 * Direct passthrough for the client-reported Burnt-Card witness.
 * The Seer-Prophecy `defeated` outcome is the only path that
 * surfaces the Burnt Card; the client reports it via the
 * dreamerAwareness.reportBurntCardWitnessed mutation, which calls
 * here. Idempotent at the service layer.
 */
export async function tagBurntCardWitnessed(userId: number): Promise<void> {
  await tagDreamerAwareness(userId, BURNT_CARD_WITNESSED.id);
}

/**
 * Called from rpgSystems.applyMoralityChoice after the morality
 * score update commits. Fires MORALITY_DIVERGENT_CHOICE when the
 * choice was a meaningful humanity-aligned step (positive delta
 * ≥ MORALITY_DIVERGENT_THRESHOLD) from a player-choice context
 * (dialog / companion / governance — automatic event/quest deltas
 * are excluded).
 *
 * Polarity reference: in this codebase positive moralityDelta =
 * humanity-aligned (the Dreamer's grain); negative = machine-
 * aligned (the Architect's grain). See the rpgSystems threshold
 * registry, which has a "dreamer_noticed" event at +75.
 *
 * Idempotent at the service layer. Subsequent qualifying choices
 * are no-ops at the tag fire — the count moved exactly once,
 * and that's all the Dreamer notices.
 */
export async function maybeTagMoralityDivergent(
  userId: number,
  actualDelta: number,
  sourceContext: string,
): Promise<void> {
  if (actualDelta < MORALITY_DIVERGENT_THRESHOLD) return;
  if (!MORALITY_DIVERGENT_CONTEXTS.includes(sourceContext)) return;
  await tagDreamerAwareness(userId, MORALITY_DIVERGENT_CHOICE.id);
}
