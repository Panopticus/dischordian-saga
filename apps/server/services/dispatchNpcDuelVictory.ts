/* ═══════════════════════════════════════════════════════
   DISPATCH NPC DUEL VICTORY — match-end → reward + flags

   The server side of the NPC duel loop. When a player wins
   a `challengeNpc(npcKey)` match, the client posts the
   outcome here; this service:

     1. Reads the NPC's authored deck from NPC_DECK_REGISTRY.
     2. Computes the reward tier from the player's learned
        perspective aspects (npcDuelRewardTier in
        apps/shared/npc-decks/buildNpcDeck.ts).
     3. Calls grantCardReward for the
        `defeated_npc_<npcKey>_tier_<N>` reward source.
     4. Tier 3 only: additionally fans out one
        grantCardReward per remaining coreMemories card so
        the player inherits the FULL Highlander deck.
     5. Writes `defeated_npc:<npcKey>` to user narrative
        flags so subsequent dialog can read it.
     6. Writes `player_carries_<npcKey>_memory` to
        npc_public_flags so OTHER NPCs' opening dialog can
        read it (cross-NPC echo).

   Loss path (recordLoss): writes `lost_to_npc:<npcKey>`,
   removes one challengeMotive-matching card from the
   player's collection (Pokémon-style stake), and marks it
   as recoverable so the rematch-win path can restore it.
   Loss path is OPTIONAL — call sites that don't want the
   penalty mechanic can skip it.

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
import { userCards, npcPublicFlags } from "../../db/schema";
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

  // Narrative flag writes.
  const defeatedFlag = `defeated_npc:${npcKey}`;
  const perspectivesAtVictoryFlag = `perspectivesAtVictory:${npcKey}:${learnedCount}`;
  await setUserNarrativeFlag(userId, defeatedFlag, true);
  await setUserNarrativeFlag(userId, perspectivesAtVictoryFlag, true);

  // Public flag write (cross-NPC echo).
  const publicFlag = `player_carries_${npcKey}_memory`;
  await writeNpcPublicFlag(userId, publicFlag, "npc_duel_victory");

  return {
    npcKey,
    rewardTier: tier,
    grants,
    flagsWritten: [defeatedFlag, perspectivesAtVictoryFlag],
    publicFlagsWritten: [publicFlag],
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
