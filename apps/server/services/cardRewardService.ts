/**
 * Card Reward Grant Service (WS-D.6)
 *
 * Central service that all game mode routers call to grant card rewards.
 * Supports 4 reward types:
 *   - fixed: always gives the same card
 *   - morality_branching: card depends on player's moral axes
 *   - vote_branching: card depends on which option the player voted for
 *   - random_pool: weighted random from a card pool
 */
import { getDb } from "../db";
import { userCards, campaignState, playerVotes, notifications } from "../../db/schema";
import { eq, and, sql } from "drizzle-orm";
import { logger } from "../logger";
import {
  REWARD_MAP,
  computeDominantAxis,
  type CardRewardSource,
} from "@shared/tcg-core/rewards";

export interface GrantResult {
  cardDefId: string;
  isNew: boolean;
  variantName?: string;
  rewardSourceId: string;
}

/**
 * Grant a card reward to a player based on the reward source configuration.
 *
 * This is the single entry point — every game mode router calls this.
 * Handles morality computation, vote lookup, random pool selection,
 * and the actual DB insert into userCards.
 */
export async function grantCardReward(
  userId: number,
  rewardSourceId: string,
  context?: {
    /** For vote_branching: which option the player chose */
    votedOptionNumber?: number;
    /** Override the morality axes (skip DB lookup) */
    moralityAxes?: Record<string, number>;
  }
): Promise<GrantResult | null> {
  const source = REWARD_MAP[rewardSourceId];
  if (!source) {
    logger.warn(`Card reward source '${rewardSourceId}' not found in registry`);
    return null;
  }

  const cardDefId = await resolveCardDefId(userId, source, context);
  if (!cardDefId) {
    logger.warn(`Could not resolve card for reward '${rewardSourceId}'`);
    return null;
  }

  const db = await getDb();
  if (!db) return null;

  // Check if user already owns this card.
  const existing = await db.select().from(userCards)
    .where(and(
      eq(userCards.userId, userId),
      eq(userCards.cardId, cardDefId),
    ))
    .limit(1);

  const isNew = !existing[0];

  if (existing[0]) {
    // Increment quantity.
    await db.update(userCards)
      .set({ quantity: sql`${userCards.quantity} + 1` })
      .where(and(
        eq(userCards.userId, userId),
        eq(userCards.cardId, cardDefId),
      ));
  } else {
    // Insert new card.
    await db.insert(userCards).values({
      userId,
      cardId: cardDefId,
      quantity: 1,
      obtainedVia: source.sourceSystem,
    });
  }

  // Send notification.
  try {
    await db.insert(notifications).values({
      userId,
      type: "achievement",
      title: "New Card Earned!",
      message: `You earned a ${source.rarity} card from ${source.sourceSystem}: ${source.description}`,
      metadata: {
        event: "card_reward",
        cardDefId,
        rewardSourceId,
        isNew,
      },
    });
  } catch (e) {
    logger.warn("Failed to send card reward notification", e);
  }

  return {
    cardDefId,
    isNew,
    variantName: resolveVariantName(source, cardDefId),
    rewardSourceId,
  };
}

/**
 * Resolve which card to grant based on reward type.
 */
async function resolveCardDefId(
  userId: number,
  source: CardRewardSource,
  context?: {
    votedOptionNumber?: number;
    moralityAxes?: Record<string, number>;
  }
): Promise<string | null> {
  switch (source.rewardType) {
    case "fixed":
      return source.fixedCardDefId ?? null;

    case "morality_branching": {
      if (!source.moralityBranches || source.moralityBranches.length === 0) {
        return source.fixedCardDefId ?? null;
      }
      const axes = context?.moralityAxes ?? await fetchMoralityAxes(userId);
      const dominant = computeDominantAxis(axes);
      const branch = source.moralityBranches.find(b => b.dominantAxis === dominant);
      return branch?.cardDefId ?? source.moralityBranches[0].cardDefId;
    }

    case "vote_branching": {
      if (!source.voteBranches || source.voteBranches.length === 0) {
        return source.fixedCardDefId ?? null;
      }
      const optionNum = context?.votedOptionNumber;
      if (optionNum !== undefined) {
        const branch = source.voteBranches.find(b => b.optionNumber === optionNum);
        return branch?.cardDefId ?? source.voteBranches[0].cardDefId;
      }
      // Fallback to first branch.
      return source.voteBranches[0].cardDefId;
    }

    case "random_pool": {
      if (!source.pool || source.pool.length === 0) {
        return source.fixedCardDefId ?? null;
      }
      // Weighted random selection using a deterministic seed.
      const totalWeight = source.pool.reduce((sum, p) => sum + p.weight, 0);
      // Simple hash-based determinism: same user + same source = same card.
      const hash = simpleHash(`${userId}_${source.id}`);
      const roll = (hash % 10000) / 10000 * totalWeight;
      let cumulative = 0;
      for (const entry of source.pool) {
        cumulative += entry.weight;
        if (roll < cumulative) return entry.cardDefId;
      }
      return source.pool[source.pool.length - 1].cardDefId;
    }

    default:
      return source.fixedCardDefId ?? null;
  }
}

async function fetchMoralityAxes(userId: number): Promise<Record<string, number>> {
  const db = await getDb();
  if (!db) return { truth: 0, defiance: 0, empathy: 0, acceptance: 0 };

  const rows = await db.select().from(campaignState)
    .where(eq(campaignState.userId, userId))
    .limit(1);

  return (rows[0]?.moralityAxes as Record<string, number>) ??
    { truth: 0, defiance: 0, empathy: 0, acceptance: 0 };
}

function resolveVariantName(source: CardRewardSource, cardDefId: string): string | undefined {
  if (source.voteBranches) {
    const branch = source.voteBranches.find(b => b.cardDefId === cardDefId);
    return branch?.variantName;
  }
  if (source.moralityBranches) {
    const branch = source.moralityBranches.find(b => b.cardDefId === cardDefId);
    return branch?.dominantAxis;
  }
  return undefined;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}
