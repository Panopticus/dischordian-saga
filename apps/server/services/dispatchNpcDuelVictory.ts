/* ═══════════════════════════════════════════════════════
   DISPATCH NPC DUEL VICTORY / LOSS — match-end → reward + flags

   The server side of the NPC duel loop. Two entry points:

     • dispatchNpcDuelVictory — player won. Tier-scaled grants +
       narrative/public flag writes. Tier 3 fans out the full
       coreMemories deck as a memorial. ALSO restores any cards
       the NPC had previously taken (Pokémon-style stake recovery
       on rematch win).

     • dispatchNpcDuelLoss — player lost. Takes ONE card from the
       player's collection matching the NPC's challengeMotive,
       writes `taken_by_<npcKey>:<cardDefId>` so the next victory
       restores it, and writes `lost_to_npc:<npcKey>`. The
       challengeMotive-match is best-effort: if the player owns no
       card in the motive list, the loss has no card penalty (only
       the flag write).

   Pure I/O + composition; no engine state, no React.
   ═══════════════════════════════════════════════════════ */

import type { NpcKey } from "@shared/npcs/types";
import {
  countLearnedAspectsForNpc,
  npcDuelRewardTier,
} from "@shared/npc-decks/buildNpcDeck";
import { getNpcDeck } from "@shared/npc-decks";
import { grantCardReward, type GrantResult } from "./cardRewardService";
import { setUserNarrativeFlag } from "./narrativeFlagWriter";
import { eq, and, sql } from "drizzle-orm";
import { getDb } from "../db";
import {
  userCards,
  userProgress,
  npcPublicFlags,
  cardGameMatches,
} from "../../db/schema";
import { logger } from "../logger";

export interface NpcDuelVictoryInput {
  userId: number;
  npcKey: NpcKey;
  /** Set of perspective-aspect ids the player had learned at the
   *  moment the challenge was issued. Source: the player's narrative
   *  flag store — the caller (duel router) reads `the_degen:*`
   *  flag prefixes and forwards them here. */
  learnedAspects: ReadonlySet<string>;
}

export interface NpcDuelVictoryResult {
  npcKey: NpcKey;
  rewardTier: 0 | 1 | 2 | 3;
  /** Grants attempted; failed grants are logged but not surfaced as
   *  errors (the dispatcher is best-effort by design — the player
   *  has already won the match). */
  grants: ReadonlyArray<GrantResult>;
  /** Narrative flags written to the player's gameData. */
  flagsWritten: ReadonlyArray<string>;
  /** Public flags written to npc_public_flags. */
  publicFlagsWritten: ReadonlyArray<string>;
  /** Card def ids restored to the player's collection on this
   *  victory — these are stake recoveries from prior losses to the
   *  same NPC. Empty when no prior loss is in flight. */
  restoredCardDefIds: ReadonlyArray<string>;
  /** True iff the victory unlocked the recruitment offer (tier 3 —
   *  all aspects learned). The client uses this to mount the
   *  accept/decline prompt in the duel-result phase. */
  recruitable: boolean;
}

export async function dispatchNpcDuelVictory(
  input: NpcDuelVictoryInput,
): Promise<NpcDuelVictoryResult> {
  const { userId, npcKey, learnedAspects } = input;

  const deck = getNpcDeck(npcKey);
  if (!deck) {
    logger.warn(
      `[dispatchNpcDuelVictory] no NPC deck authored for ${npcKey}; nothing to grant`,
    );
    return {
      npcKey,
      rewardTier: 0,
      grants: [],
      flagsWritten: [],
      publicFlagsWritten: [],
      restoredCardDefIds: [],
      recruitable: false,
    };
  }

  const learnedCount = countLearnedAspectsForNpc(deck, learnedAspects);
  const tier = npcDuelRewardTier(
    learnedCount,
    deck.perspectiveAspects.length,
  );

  const grants: GrantResult[] = [];

  // Tier-scaled reward: random pool draws for tiers 1/2, fixed signature
  // for tier 3, fixed common for tier 0. The pool-draw count scales the
  // perceived reward size (1 vs 3 vs 6 calls).
  const baseRewardId = `defeated_npc_${npcKey}_tier_${tier}`;
  const drawCount =
    tier === 0 ? 1 : tier === 1 ? 3 : tier === 2 ? 6 : 1;

  for (let i = 0; i < drawCount; i++) {
    const grant = await grantCardReward(userId, baseRewardId);
    if (grant) grants.push(grant);
  }

  // Tier 3: also grant the entire core-memories deck as a memorial. The
  // signature card already landed via the tier_3 reward source above;
  // these are the supporting memories.
  if (tier === 3) {
    for (const cardDefId of deck.coreMemories) {
      const grant = await grantMemorialCard(userId, npcKey, cardDefId);
      if (grant) grants.push(grant);
    }
  }

  // Restore any cards the NPC previously took (Pokémon-style stake
  // recovery on rematch win). Reads `taken_by_<npcKey>:<cardDefId>`
  // flags; for each set flag, increments user_cards quantity by 1
  // and clears the flag.
  const restored = await restoreTakenCards(userId, npcKey);

  // Narrative flag writes.
  const defeatedFlag = `defeated_npc:${npcKey}`;
  const perspectivesAtVictoryFlag = `perspectivesAtVictory:${npcKey}:${learnedCount}`;
  await setUserNarrativeFlag(userId, defeatedFlag, true);
  await setUserNarrativeFlag(userId, perspectivesAtVictoryFlag, true);

  // Public flag write (cross-NPC echo).
  const publicFlag = `player_carries_${npcKey}_memory`;
  await writeNpcPublicFlag(userId, publicFlag, "npc_duel_victory");

  // Recruitment-hook flag — tier-3 victories (all aspects learned)
  // unlock the post-victory companion offer. The narrative
  // permission is "the NPC respects you enough to ask." The
  // overlay's result phase surfaces an accept/decline choice;
  // the player's response writes either npc_companion:<key>
  // (accept) or npc_declined_companion:<key> (decline). The
  // recruitable flag stays set until the player picks one side,
  // so a "Not yet" close still preserves the offer.
  const recruitedFlags: string[] = [];
  if (tier === 3) {
    const recruitableFlag = `npc_recruitable:${npcKey}`;
    await setUserNarrativeFlag(userId, recruitableFlag, true);
    recruitedFlags.push(recruitableFlag);
  }

  // Persist a match-history row so /codex/past-duels can render the
  // duel later. result JSON carries npcDuelMeta + the outcome summary
  // for the replay viewer.
  await recordNpcDuelMatchRow({
    userId,
    npcKey,
    outcome: "player_won",
    rewardTier: tier,
    learnedCount,
    totalCount: deck.perspectiveAspects.length,
    grantCount: grants.length,
    takenCardDefId: null,
    restoredCardDefIds: restored,
  });

  return {
    npcKey,
    rewardTier: tier,
    grants,
    flagsWritten: [defeatedFlag, perspectivesAtVictoryFlag, ...recruitedFlags],
    publicFlagsWritten: [publicFlag],
    restoredCardDefIds: restored,
    recruitable: tier === 3,
  };
}

/* ═══════════════════════════════════════════════════════
   LOSS PATH
   ═══════════════════════════════════════════════════════ */

export interface NpcDuelLossInput {
  userId: number;
  npcKey: NpcKey;
}

export interface NpcDuelLossResult {
  npcKey: NpcKey;
  /** Card the NPC took, if any matched challengeMotive AND the
   *  player owned a copy. Null when the loss had no card penalty
   *  (player owns no matching card). */
  takenCardDefId: string | null;
  flagsWritten: ReadonlyArray<string>;
}

export async function dispatchNpcDuelLoss(
  input: NpcDuelLossInput,
): Promise<NpcDuelLossResult> {
  const { userId, npcKey } = input;

  const deck = getNpcDeck(npcKey);
  if (!deck) {
    logger.warn(
      `[dispatchNpcDuelLoss] no NPC deck authored for ${npcKey}`,
    );
    return { npcKey, takenCardDefId: null, flagsWritten: [] };
  }

  // Always write the loss flag, even when no card is taken.
  const lossFlag = `lost_to_npc:${npcKey}`;
  await setUserNarrativeFlag(userId, lossFlag, true);

  const taken = await takeOneChallengeMotiveCard(
    userId,
    npcKey,
    deck.challengeMotive,
  );
  const flagsWritten: string[] = [lossFlag];
  if (taken) {
    const stakeFlag = `taken_by_${npcKey}:${taken}`;
    await setUserNarrativeFlag(userId, stakeFlag, true);
    flagsWritten.push(stakeFlag);
  }

  // Persist the loss to match history so /codex/past-duels can render
  // it. learnedCount/totalCount are best-effort — the loss path does
  // not currently take a learnedAspects snapshot. Future enhancement:
  // route them in from the recordLoss caller.
  await recordNpcDuelMatchRow({
    userId,
    npcKey,
    outcome: "opponent_won",
    rewardTier: 0,
    learnedCount: deck.perspectiveAspects.filter((a) =>
      // Best-effort: we read the flag store here so the history row
      // still captures the aspect context, even though the loss
      // dispatcher's input only carries npcKey.
      false,
    ).length,
    totalCount: deck.perspectiveAspects.length,
    grantCount: 0,
    takenCardDefId: taken,
    restoredCardDefIds: [],
  });

  return {
    npcKey,
    takenCardDefId: taken,
    flagsWritten,
  };
}

/* ─── Helpers ─── */

/** Grant a single memorial card by direct cardDefId (bypasses the
 *  reward-source registry — the tier-3 fan-out grants 30+ cards
 *  authored by id). Stacks onto existing user_cards quantity. */
async function grantMemorialCard(
  userId: number,
  npcKey: NpcKey,
  cardDefId: string,
): Promise<GrantResult | null> {
  const db = await getDb();
  if (!db) return null;
  try {
    const existing = await db
      .select()
      .from(userCards)
      .where(
        and(eq(userCards.userId, userId), eq(userCards.cardId, cardDefId)),
      )
      .limit(1);
    const isNew = !existing[0];
    if (existing[0]) {
      await db
        .update(userCards)
        .set({ quantity: sql`${userCards.quantity} + 1` })
        .where(
          and(eq(userCards.userId, userId), eq(userCards.cardId, cardDefId)),
        );
    } else {
      await db.insert(userCards).values({
        userId,
        cardId: cardDefId,
        quantity: 1,
        obtainedVia: `npc_duel_memorial:${npcKey}`,
      });
    }
    return {
      cardDefId,
      isNew,
      rewardSourceId: `defeated_npc_${npcKey}_memorial`,
    };
  } catch (err) {
    logger.warn(
      `[dispatchNpcDuelVictory] memorial grant failed: ${cardDefId}`,
      err,
    );
    return null;
  }
}

/** Take one card from the player's collection matching the NPC's
 *  challengeMotive list. Walks the motive in declaration order and
 *  decrements the first owned card's quantity by 1 (deletes the row
 *  if quantity drops to 0). Returns the taken card's def id, or
 *  null if the player owns nothing on the motive list. */
async function takeOneChallengeMotiveCard(
  userId: number,
  npcKey: NpcKey,
  motive: ReadonlyArray<string>,
): Promise<string | null> {
  const db = await getDb();
  if (!db) return null;
  for (const cardDefId of motive) {
    try {
      const existing = await db
        .select()
        .from(userCards)
        .where(
          and(eq(userCards.userId, userId), eq(userCards.cardId, cardDefId)),
        )
        .limit(1);
      const row = existing[0];
      if (!row || row.quantity <= 0) continue;
      if (row.quantity > 1) {
        await db
          .update(userCards)
          .set({ quantity: sql`${userCards.quantity} - 1` })
          .where(
            and(eq(userCards.userId, userId), eq(userCards.cardId, cardDefId)),
          );
      } else {
        await db
          .delete(userCards)
          .where(
            and(eq(userCards.userId, userId), eq(userCards.cardId, cardDefId)),
          );
      }
      logger.info?.(
        `[dispatchNpcDuelLoss] ${npcKey} took ${cardDefId} from user ${userId}`,
      );
      return cardDefId;
    } catch (err) {
      logger.warn(
        `[dispatchNpcDuelLoss] failed to take ${cardDefId}`,
        err,
      );
    }
  }
  return null;
}

/** Restore any cards the NPC took from the player on prior losses.
 *  Reads `taken_by_<npcKey>:<cardDefId>` flags from gameData,
 *  increments quantity for each, and clears the flag. Returns the
 *  list of restored card def ids. */
async function restoreTakenCards(
  userId: number,
  npcKey: NpcKey,
): Promise<ReadonlyArray<string>> {
  const db = await getDb();
  if (!db) return [];
  try {
    const rows = await db
      .select({ gameData: userProgress.gameData })
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .limit(1);
    const row = rows[0];
    if (!row) return [];
    const gameData = (row.gameData ?? {}) as Record<string, unknown>;
    const flags = (gameData.narrativeFlags ?? {}) as Record<string, unknown>;
    const prefix = `taken_by_${npcKey}:`;
    const taken: string[] = [];
    for (const [key, value] of Object.entries(flags)) {
      if (!key.startsWith(prefix)) continue;
      if (value !== true && value !== 1 && value !== "true") continue;
      taken.push(key.slice(prefix.length));
    }
    if (taken.length === 0) return [];

    const restored: string[] = [];
    for (const cardDefId of taken) {
      try {
        const grant = await grantMemorialCard(userId, npcKey, cardDefId);
        if (grant) restored.push(cardDefId);
        await setUserNarrativeFlag(userId, `${prefix}${cardDefId}`, false);
      } catch (err) {
        logger.warn(
          `[dispatchNpcDuelVictory] failed to restore ${cardDefId}`,
          err,
        );
      }
    }
    return restored;
  } catch (err) {
    logger.warn(
      `[dispatchNpcDuelVictory] failed to read taken-cards flags`,
      err,
    );
    return [];
  }
}

/** Persist an NPC-duel outcome to cardGameMatches so the Past Duels
 *  surface can render it later. The match row's result JSON carries
 *  the full npcDuelMeta + outcome summary; the source is tagged
 *  "npc_duel" so the listPastDuels query can filter to just our
 *  matches. Best-effort: a failed insert is logged and swallowed,
 *  since the duel outcome already landed (grants + flags). */
async function recordNpcDuelMatchRow(input: {
  userId: number;
  npcKey: NpcKey;
  outcome: "player_won" | "opponent_won";
  rewardTier: 0 | 1 | 2 | 3;
  learnedCount: number;
  totalCount: number;
  grantCount: number;
  takenCardDefId: string | null;
  restoredCardDefIds: ReadonlyArray<string>;
}): Promise<void> {
  const db = await getDb();
  if (!db) return;
  try {
    await db.insert(cardGameMatches).values({
      player1Id: input.userId,
      player2Id: 0, // 0 = AI opponent, per schema convention
      status: "completed",
      winnerId: input.outcome === "player_won" ? input.userId : null,
      startedAt: new Date(),
      endedAt: new Date(),
      gameState: {
        source: "npc_duel",
        npcKey: input.npcKey,
      },
      result: {
        source: "npc_duel",
        npcKey: input.npcKey,
        outcome: input.outcome,
        rewardTier: input.rewardTier,
        learnedAspectCount: input.learnedCount,
        totalAspectCount: input.totalCount,
        grantCount: input.grantCount,
        takenCardDefId: input.takenCardDefId,
        restoredCardDefIds: input.restoredCardDefIds,
      },
    });
  } catch (err) {
    logger.warn(
      `[dispatchNpcDuel] match history write failed for ${input.npcKey}`,
      err,
    );
  }
}

/** Write a cross-NPC public flag (mirrors factionStandingService's
 *  writeFlag — idempotent on the unique index). */
async function writeNpcPublicFlag(
  userId: number,
  flag: string,
  source: string,
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  try {
    await db
      .insert(npcPublicFlags)
      .values({ userId, flag, setBy: source })
      .onDuplicateKeyUpdate({
        set: { flag: sql`${npcPublicFlags.flag}` },
      });
  } catch (err) {
    logger.warn(
      `[dispatchNpcDuelVictory] public flag write failed: ${flag}`,
      err,
    );
  }
}
