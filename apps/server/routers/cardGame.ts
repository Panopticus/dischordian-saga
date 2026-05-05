import { logger } from "../logger";
import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { cards, userCards, decks, cardGameMatches, characterSheets, dreamBalance, userProgress, pvpMatches } from "../../db/schema";
import { eq, and, or, like, inArray, notInArray, sql, desc, asc, type SQL } from "drizzle-orm";
import { fetchCitizenData, fetchPotentialNftData, resolveCardGameBonuses } from "../traitResolver";
import { getPlayerExpansionState, getLockedCardIds } from "../services/playerExpansionState";
import { trackAiResult, trackCollectionSize } from "../achievementTracker";
import { ripple } from "../services/rippleEngine";
import { getConsequences } from "../services/universeConsequences";
import { tryNpcReaction } from "./npc";
import type { NpcKey } from "@shared/npcs/types";

/**
 * Phase 3 finish — fight-surface NPC reactions on TCG match end.
 * Per priority-roster bibles, several NPCs canonically react on the
 * canonical fight surface: Hierophant pre-arena (Ch3b match), Vex
 * (Ch6 match), Game Master (presence-band), Eidolon (Echo-mode),
 * Companion (post-naming witness). Selector silent-fails per match.
 */
const FIGHT_PILOT_NPCS: ReadonlyArray<NpcKey> = [
  "wraith_calder",
  "vex_solene",
  "the_game_master",
  "your_eidolon",
  "dmc_clone_companion",
];

async function tryFightReactions(
  userId: number,
  matchId: number,
  won: boolean,
): Promise<Array<{
  npcKey: NpcKey;
  lineId: string;
  text: string;
  voId?: string;
}>> {
  const targetId = `tcg_${won ? "won" : "lost"}_match${matchId}`;
  const reactions: Array<{
    npcKey: NpcKey;
    lineId: string;
    text: string;
    voId?: string;
  }> = [];
  for (const npcKey of FIGHT_PILOT_NPCS) {
    try {
      const reaction = await tryNpcReaction({
        userId,
        npcKey,
        surface: "fight",
        targetId,
      });
      if (reaction) {
        reactions.push({
          npcKey,
          lineId: reaction.line.lineId,
          text: reaction.line.text,
          voId: reaction.line.voId,
        });
      }
    } catch (err) {
      logger.warn(`cardGame fight reaction failed for ${npcKey}`, err);
    }
  }
  return reactions;
}
import { validateDbDeckComposition } from "../../shared/validateDbDeckComposition";

// ═══════════════════════════════════════════════════════
// CARD GAME STATE TYPES
// ═══════════════════════════════════════════════════════

interface CardInPlay {
  cardId: string;
  cardType: string;
  name: string;
  power: number;
  health: number;
  cost: number;
  tapped: boolean;
  /** Filled in when a card is summoned; used for damage + heal capping. */
  maxHealth?: number;
  element?: string;
  /** Used on in-hand stubs pushed back after a failed equip. */
  quantity?: number;
  [key: string]: unknown;
}

interface PlayerState {
  health: number;
  energy: number;
  maxEnergy: number;
  hand: CardInPlay[];
  field: CardInPlay[];
  graveyard: CardInPlay[];
  drawPile: CardInPlay[];
  difficulty?: string;
  [key: string]: unknown;
}

interface TraitBonuses {
  globalAttackBonus?: number;
  globalHealthBonus?: number;
  elementAffinity?: string;
  alignmentEffect?: { type: "order_structure" | "chaos_wildcard"; value: number };
  extraDrawEveryNTurns?: number;
  costReductionChance?: number;
  [key: string]: unknown;
}

interface GameState {
  player1: PlayerState;
  player2: PlayerState;
  turn: number;
  phase: string;
  log: string[];
  traitBonuses?: TraitBonuses;
  [key: string]: unknown;
}

// ═══════════════════════════════════════════════════════
// CARD BROWSING & COLLECTION
// ═══════════════════════════════════════════════════════

export const cardGameRouter = router({
  // Browse all cards with filters
  browse: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(24),
        search: z.string().optional(),
        cardType: z.string().optional(),
        rarity: z.string().optional(),
        season: z.string().optional(),
        element: z.string().optional(),
        alignment: z.string().optional(),
        characterClass: z.string().optional(),
        faction: z.string().optional(),
        sortBy: z.enum(["name", "power", "cost", "rarity"]).default("name"),
        sortDir: z.enum(["asc", "desc"]).default("asc"),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { cards: [], total: 0, page: 1, totalPages: 0 };

      const page = input?.page ?? 1;
      const limit = input?.limit ?? 24;
      const offset = (page - 1) * limit;

      // Build WHERE conditions
      const conditions: SQL[] = [eq(cards.isActive, 1)];
      if (input?.search) conditions.push(like(cards.name, `%${input.search}%`));
      if (input?.cardType) conditions.push(eq(cards.cardType, input.cardType as any));
      if (input?.rarity) conditions.push(eq(cards.rarity, input.rarity as any));
      if (input?.season) conditions.push(eq(cards.season, input.season));
      if (input?.element) conditions.push(eq(cards.element, input.element as any));
      if (input?.alignment) conditions.push(eq(cards.alignment, input.alignment as any));
      if (input?.characterClass) conditions.push(eq(cards.characterClass, input.characterClass as any));
      if (input?.faction) conditions.push(like(cards.faction, `%${input.faction}%`));

      // Player-visibility gate: hide reserved cards + cards locked
      // behind unfinished progression (act_completion, secret,
      // battle_pass, founding_author, authors_edition). Builds the
      // exclusion set from ALL_CARD_DEFINITIONS so DB rows are
      // filtered against the canonical CardDefinition gate.
      const expansionState = await getPlayerExpansionState(ctx.user?.id);
      const lockedIds = getLockedCardIds(expansionState);
      if (lockedIds.size > 0) {
        conditions.push(notInArray(cards.cardId, Array.from(lockedIds)));
      }

      const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

      // Sort
      const sortBy = input?.sortBy ?? "name";
      const sortDir = input?.sortDir ?? "asc";
      const sortCol = sortBy === "power" ? cards.power
        : sortBy === "cost" ? cards.cost
        : sortBy === "rarity" ? cards.rarity
        : cards.name;
      const sortFn = sortDir === "desc" ? desc : asc;

      const [results, countResult] = await Promise.all([
        db.select().from(cards).where(whereClause).orderBy(sortFn(sortCol)).limit(limit).offset(offset),
        db.select({ count: sql<number>`COUNT(*)` }).from(cards).where(whereClause),
      ]);

      const total = Number(countResult[0]?.count ?? 0);

      return {
        cards: results,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    }),

  // Get a single card by cardId
  getCard: publicProcedure
    .input(z.object({ cardId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const rows = await db.select().from(cards).where(eq(cards.cardId, input.cardId)).limit(1);
      return rows[0] ?? null;
    }),

  // Get card stats/counts for filters
  getStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { types: [], rarities: [], seasons: [], elements: [], classes: [], total: 0 };

    const [types, rarities, seasons, elements, classes, total] = await Promise.all([
      db.select({ val: cards.cardType, count: sql<number>`COUNT(*)` }).from(cards).groupBy(cards.cardType),
      db.select({ val: cards.rarity, count: sql<number>`COUNT(*)` }).from(cards).groupBy(cards.rarity),
      db.select({ val: cards.season, count: sql<number>`COUNT(*)` }).from(cards).where(sql`${cards.season} IS NOT NULL`).groupBy(cards.season),
      db.select({ val: cards.element, count: sql<number>`COUNT(*)` }).from(cards).groupBy(cards.element),
      db.select({ val: cards.characterClass, count: sql<number>`COUNT(*)` }).from(cards).where(sql`${cards.characterClass} != 'none'`).groupBy(cards.characterClass),
      db.select({ count: sql<number>`COUNT(*)` }).from(cards),
    ]);

    return {
      types: types.map(r => ({ value: r.val, count: Number(r.count) })),
      rarities: rarities.map(r => ({ value: r.val, count: Number(r.count) })),
      seasons: seasons.map(r => ({ value: r.val, count: Number(r.count) })),
      elements: elements.map(r => ({ value: r.val, count: Number(r.count) })),
      classes: classes.map(r => ({ value: r.val, count: Number(r.count) })),
      total: Number(total[0]?.count ?? 0),
    };
  }),

  // ═══════════════════════════════════════════════════════
  // USER COLLECTION
  // ═══════════════════════════════════════════════════════

  // Get user's card collection
  myCollection: protectedProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(24),
    }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { cards: [], total: 0 };

      const page = input?.page ?? 1;
      const limit = input?.limit ?? 24;
      const offset = (page - 1) * limit;

      const owned = await db
        .select({
          userCard: userCards,
          card: cards,
        })
        .from(userCards)
        .innerJoin(cards, eq(userCards.cardId, cards.cardId))
        .where(eq(userCards.userId, ctx.user.id))
        .limit(limit)
        .offset(offset);

      const countResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(userCards)
        .where(eq(userCards.userId, ctx.user.id));

      return {
        cards: owned.map(r => ({ ...r.card, userCard: r.userCard })),
        total: Number(countResult[0]?.count ?? 0),
      };
    }),

  // Grant starter pack to a new user
  claimStarterPack: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { success: false, message: "Database unavailable" };

    // Check if user already has cards
    const existing = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(userCards)
      .where(eq(userCards.userId, ctx.user.id));

    if (Number(existing[0]?.count ?? 0) > 0) {
      return { success: false, message: "You already have cards in your collection" };
    }

    // Give 15 starter cards: 5 common characters, 5 common actions, 5 common items
    const starterCards = await db
      .select()
      .from(cards)
      .where(and(eq(cards.rarity, "common"), eq(cards.unlockMethod, "starter")))
      .limit(50);

    const characters = starterCards.filter(c => c.cardType === "character").slice(0, 5);
    const actions = starterCards.filter(c => c.cardType === "action").slice(0, 5);
    const items = starterCards.filter(c => c.cardType === "item" || c.cardType === "combat" || c.cardType === "reaction").slice(0, 5);
    const pack = [...characters, ...actions, ...items];

    if (pack.length === 0) {
      // Fallback: grab any 15 common cards
      const fallback = await db.select().from(cards).where(eq(cards.rarity, "common")).limit(15);
      pack.push(...fallback);
    }

    for (const card of pack) {
      await db.insert(userCards).values({
        userId: ctx.user.id,
        cardId: card.cardId,
        quantity: 1,
        isFoil: 0,
        cardLevel: 1,
        obtainedVia: "starter",
      });
    }

    // Also create a pre-built "Starter Deck" so new players can jump
    // straight into a match without opening the deck builder first.
    // Only create one if the player doesn't already have a deck.
    const existingDecks = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(decks)
      .where(eq(decks.userId, ctx.user.id));
    if (Number(existingDecks[0]?.count ?? 0) === 0 && pack.length > 0) {
      await db.insert(decks).values({
        userId: ctx.user.id,
        name: "Starter Deck",
        description: "Pre-built starter deck. Edit freely in the Deck Builder.",
        deckType: "combined",
        cardList: pack.map(c => ({ cardId: c.cardId, quantity: 1 })),
      });
    }

    return {
      success: true,
      message: `Received ${pack.length} starter cards + a pre-built deck!`,
      count: pack.length,
      deckCreated: Number(existingDecks[0]?.count ?? 0) === 0,
    };
  }),

  // Open a booster pack (earn random cards). Charges the player in
  // credits from their characterSheet balance. Three tiers:
  //  - standard: 100 credits, 3 common + 1 uncommon + 1 rare+
  //  - premium:  250 credits, guaranteed rare, chance at legendary+
  //  - ultra:    500 credits, guaranteed epic, higher legendary+ chance
  openBoosterPack: protectedProcedure
    .input(z.object({
      season: z.string().optional(),
      tier: z.enum(["standard", "premium", "ultra"]).default("standard"),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, cards: [], message: "Database unavailable" };

      const PACK_PRICES = { standard: 100, premium: 250, ultra: 500 } as const;
      const cost = PACK_PRICES[input.tier];

      // Charge the player's credit balance up front.
      const sheetRows = await db
        .select()
        .from(characterSheets)
        .where(eq(characterSheets.userId, ctx.user.id))
        .limit(1);
      const sheet = sheetRows[0];
      if (!sheet) {
        return { success: false, cards: [], message: "Create a character first" };
      }
      if ((sheet.credits ?? 0) < cost) {
        return {
          success: false,
          cards: [],
          message: `Not enough credits (need ${cost}, have ${sheet.credits ?? 0})`,
        };
      }
      await db.update(characterSheets)
        .set({ credits: sheet.credits - cost })
        .where(eq(characterSheets.userId, ctx.user.id));

      // 5 cards per pack: 3 common, 1 uncommon, 1 rare+ (tier scales the rare slot)
      const conditions: SQL[] = [eq(cards.isActive, 1)];
      if (input?.season) conditions.push(eq(cards.season, input.season));

      // Pack-pool visibility gate: matches deck-builder behaviour. A
      // player who hasn't completed the gating act doesn't pull the
      // gated card. Reserved cards are excluded universally.
      const expansionState = await getPlayerExpansionState(ctx.user.id);
      const lockedIds = getLockedCardIds(expansionState);
      if (lockedIds.size > 0) {
        conditions.push(notInArray(cards.cardId, Array.from(lockedIds)));
      }

      const allCards = await db.select().from(cards).where(and(...conditions));

      const byRarity = {
        common: allCards.filter(c => c.rarity === "common"),
        uncommon: allCards.filter(c => c.rarity === "uncommon"),
        rare: allCards.filter(c => c.rarity === "rare"),
        epic: allCards.filter(c => c.rarity === "epic"),
        legendary: allCards.filter(c => c.rarity === "legendary"),
        mythic: allCards.filter(c => c.rarity === "mythic"),
        neyon: allCards.filter(c => c.rarity === "neyon"),
      };

      const pick = (arr: typeof allCards) => arr[Math.floor(Math.random() * arr.length)];

      const packCards: typeof allCards = [];
      // 3 commons
      for (let i = 0; i < 3; i++) {
        if (byRarity.common.length > 0) packCards.push(pick(byRarity.common));
      }
      // 1 uncommon
      if (byRarity.uncommon.length > 0) packCards.push(pick(byRarity.uncommon));
      // 1 rare+ slot, weighted by tier
      const roll = Math.random();
      if (input.tier === "ultra") {
        // Guaranteed epic, 40% shot at legendary+, 5% shot at mythic/neyon
        if (roll < 0.02 && byRarity.neyon.length > 0) packCards.push(pick(byRarity.neyon));
        else if (roll < 0.05 && byRarity.mythic.length > 0) packCards.push(pick(byRarity.mythic));
        else if (roll < 0.40 && byRarity.legendary.length > 0) packCards.push(pick(byRarity.legendary));
        else if (byRarity.epic.length > 0) packCards.push(pick(byRarity.epic));
        else if (byRarity.rare.length > 0) packCards.push(pick(byRarity.rare));
      } else if (input.tier === "premium") {
        // Guaranteed rare, 15% shot at epic+, 2% shot at legendary+
        if (roll < 0.01 && byRarity.mythic.length > 0) packCards.push(pick(byRarity.mythic));
        else if (roll < 0.02 && byRarity.legendary.length > 0) packCards.push(pick(byRarity.legendary));
        else if (roll < 0.15 && byRarity.epic.length > 0) packCards.push(pick(byRarity.epic));
        else if (byRarity.rare.length > 0) packCards.push(pick(byRarity.rare));
      } else {
        // Standard distribution
        if (roll < 0.01 && byRarity.neyon.length > 0) packCards.push(pick(byRarity.neyon));
        else if (roll < 0.03 && byRarity.mythic.length > 0) packCards.push(pick(byRarity.mythic));
        else if (roll < 0.08 && byRarity.legendary.length > 0) packCards.push(pick(byRarity.legendary));
        else if (roll < 0.25 && byRarity.epic.length > 0) packCards.push(pick(byRarity.epic));
        else if (byRarity.rare.length > 0) packCards.push(pick(byRarity.rare));
      }

      // Add to user collection
      for (const card of packCards) {
        const existing = await db
          .select()
          .from(userCards)
          .where(and(eq(userCards.userId, ctx.user.id), eq(userCards.cardId, card.cardId)))
          .limit(1);

        if (existing.length > 0) {
          await db
            .update(userCards)
            .set({ quantity: sql`${userCards.quantity} + 1` })
            .where(eq(userCards.id, existing[0].id));
        } else {
          await db.insert(userCards).values({
            userId: ctx.user.id,
            cardId: card.cardId,
            quantity: 1,
            isFoil: Math.random() < 0.05 ? 1 : 0,
            cardLevel: 1,
            obtainedVia: "pack",
          });
        }
      }

      // Achievement auto-tracking for collection size
      trackCollectionSize(ctx.user.id)
        .catch(e => logger.error("[CardGame] Collection tracking error:", e));

      return {
        success: true,
        cards: packCards,
        cost,
        tier: input.tier,
        remainingCredits: sheet.credits - cost,
      };
    }),

  /** Return the current pack shop prices and rarity tiers. */
  getPackPrices: publicProcedure.query(() => {
    return {
      standard: { price: 100, currency: "credits", description: "5 cards • guaranteed rare+" },
      premium: { price: 250, currency: "credits", description: "5 cards • 15% chance epic+" },
      ultra: { price: 500, currency: "credits", description: "5 cards • guaranteed epic+" },
    };
  }),

  // ═══════════════════════════════════════════════════════
  // PREMIUM CURRENCY — gems
  // ═══════════════════════════════════════════════════════

  /** Get the caller's gem balance + lifetime purchased total. */
  getGemBalance: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { gems: 0, totalGemsPurchased: 0 };

    const rows = await db.select().from(dreamBalance)
      .where(eq(dreamBalance.userId, ctx.user.id)).limit(1);
    if (rows.length === 0) {
      return { gems: 0, totalGemsPurchased: 0 };
    }
    return {
      gems: rows[0].gems ?? 0,
      totalGemsPurchased: rows[0].totalGemsPurchased ?? 0,
    };
  }),

  /**
   * Spend gems to buy an in-game bundle. This is the server-authoritative
   * sink for premium currency — actual gem acquisition happens elsewhere
   * (Stripe purchases) and only credits the `gems` column. Bundles
   * deliver credits, Dream, or booster packs.
   */
  spendGems: protectedProcedure
    .input(z.object({
      bundleId: z.enum([
        "credits_small", "credits_large",
        "dream_small", "dream_large",
        "pack_bundle_3", "pack_bundle_10",
      ]),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, message: "Database unavailable" };

      // Pricing table — tuned so gems feel premium relative to credits.
      const BUNDLES = {
        credits_small:  { gemCost: 50,  grants: { credits: 2500 }, label: "2,500 credits" },
        credits_large:  { gemCost: 200, grants: { credits: 12000 }, label: "12,000 credits" },
        dream_small:    { gemCost: 100, grants: { dream: 50 }, label: "50 Dream" },
        dream_large:    { gemCost: 400, grants: { dream: 250 }, label: "250 Dream" },
        pack_bundle_3:  { gemCost: 150, grants: { packs: 3 }, label: "3 standard packs" },
        pack_bundle_10: { gemCost: 450, grants: { packs: 10 }, label: "10 standard packs" },
      } as const;

      const bundle = BUNDLES[input.bundleId];
      if (!bundle) return { success: false, message: "Unknown bundle" };

      const balRows = await db.select().from(dreamBalance)
        .where(eq(dreamBalance.userId, ctx.user.id)).limit(1);
      const bal = balRows[0];
      if (!bal || (bal.gems ?? 0) < bundle.gemCost) {
        return { success: false, message: `Not enough gems (need ${bundle.gemCost}, have ${bal?.gems ?? 0})` };
      }

      // Deduct gems first.
      await db.update(dreamBalance)
        .set({ gems: (bal.gems ?? 0) - bundle.gemCost })
        .where(eq(dreamBalance.userId, ctx.user.id));

      // Grant the bundle payload.
      if ("credits" in bundle.grants) {
        const [sheet] = await db.select().from(characterSheets)
          .where(eq(characterSheets.userId, ctx.user.id)).limit(1);
        if (sheet) {
          await db.update(characterSheets)
            .set({ credits: (sheet.credits ?? 0) + bundle.grants.credits })
            .where(eq(characterSheets.userId, ctx.user.id));
        }
      }
      if ("dream" in bundle.grants) {
        await db.update(dreamBalance)
          .set({ dreamTokens: sql`${dreamBalance.dreamTokens} + ${bundle.grants.dream}` })
          .where(eq(dreamBalance.userId, ctx.user.id));
      }
      if ("packs" in bundle.grants) {
        // Stash as a virtual inventory entry on userProgress for now.
        const rows = await db.select().from(userProgress)
          .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.franchiseId, "dischordian-saga")))
          .limit(1);
        const existing = rows[0];
        const gameData = (existing?.gameData ?? {}) as Record<string, unknown>;
        const pendingPacks = Number(gameData.pendingPacks ?? 0) + bundle.grants.packs;
        const nextGameData = { ...gameData, pendingPacks };
        if (existing) {
          await db.update(userProgress)
            .set({ gameData: nextGameData })
            .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.franchiseId, "dischordian-saga")));
        } else {
          await db.insert(userProgress).values({
            userId: ctx.user.id,
            franchiseId: "dischordian-saga",
            gameData: nextGameData,
          });
        }
      }

      return {
        success: true,
        message: `Purchased ${bundle.label} for ${bundle.gemCost} gems`,
        bundleId: input.bundleId,
        remainingGems: (bal.gems ?? 0) - bundle.gemCost,
      };
    }),

  /** List purchasable gem bundles so the UI stays in sync with the server. */
  getGemBundles: publicProcedure.query(() => {
    return [
      { bundleId: "credits_small",  gemCost: 50,  label: "2,500 credits" },
      { bundleId: "credits_large",  gemCost: 200, label: "12,000 credits" },
      { bundleId: "dream_small",    gemCost: 100, label: "50 Dream" },
      { bundleId: "dream_large",    gemCost: 400, label: "250 Dream" },
      { bundleId: "pack_bundle_3",  gemCost: 150, label: "3 standard packs" },
      { bundleId: "pack_bundle_10", gemCost: 450, label: "10 standard packs" },
    ];
  }),

  // ═══════════════════════════════════════════════════════
  // META ANALYTICS — card usage + archetype win-rates
  // ═══════════════════════════════════════════════════════

  /**
   * Aggregate card usage and win-rate stats across completed PvP matches.
   * Scans the last `sampleSize` matches (default 500) so the query stays
   * O(sampleSize) and the UI can render a "most-played cards" leaderboard.
   * Returns the top `limit` cards by play count.
   */
  getMetaCardStats: publicProcedure
    .input(z.object({
      sampleSize: z.number().min(50).max(2000).default(500),
      limit: z.number().min(1).max(50).default(20),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { sampleSize: 0, cards: [] };

      const sampleSize = input?.sampleSize ?? 500;
      const limit = input?.limit ?? 20;

      const recent = await db
        .select({
          player1Deck: pvpMatches.player1Deck,
          player2Deck: pvpMatches.player2Deck,
          winnerId: pvpMatches.winnerId,
          player1Id: pvpMatches.player1Id,
          player2Id: pvpMatches.player2Id,
        })
        .from(pvpMatches)
        .where(eq(pvpMatches.status, "completed"))
        .orderBy(desc(pvpMatches.id))
        .limit(sampleSize);

      const counts = new Map<string, { plays: number; wins: number }>();
      for (const match of recent) {
        const p1Won = match.winnerId != null && match.winnerId === match.player1Id;
        const p2Won = match.winnerId != null && match.winnerId === match.player2Id;
        const bump = (cardId: string, won: boolean) => {
          const entry = counts.get(cardId) ?? { plays: 0, wins: 0 };
          entry.plays += 1;
          if (won) entry.wins += 1;
          counts.set(cardId, entry);
        };
        for (const cardId of match.player1Deck ?? []) bump(cardId, p1Won);
        for (const cardId of match.player2Deck ?? []) bump(cardId, p2Won);
      }

      if (counts.size === 0) {
        return { sampleSize: recent.length, cards: [] };
      }

      const topIds = [...counts.entries()]
        .sort((a, b) => b[1].plays - a[1].plays)
        .slice(0, limit)
        .map(([id]) => id);

      const cardRows = topIds.length > 0
        ? await db
            .select({
              cardId: cards.cardId,
              name: cards.name,
              rarity: cards.rarity,
              cardType: cards.cardType,
              imageUrl: cards.imageUrl,
            })
            .from(cards)
            .where(inArray(cards.cardId, topIds))
        : [];

      const nameMap = new Map(cardRows.map(r => [r.cardId, r]));

      const topCards = topIds.map(cardId => {
        const stats = counts.get(cardId)!;
        const meta = nameMap.get(cardId);
        return {
          cardId,
          name: meta?.name ?? cardId,
          rarity: meta?.rarity ?? "common",
          cardType: meta?.cardType ?? null,
          imageUrl: meta?.imageUrl ?? null,
          plays: stats.plays,
          wins: stats.wins,
          winRate: stats.plays > 0 ? Math.round((stats.wins / stats.plays) * 1000) / 10 : 0,
        };
      });

      return {
        sampleSize: recent.length,
        cards: topCards,
      };
    }),

  /**
   * Group decks by their top-rarity "archetype signature" (the 3 rarest
   * cards) and return each archetype's win/loss totals. Uses the decks
   * table directly because that's where wins/losses already aggregate.
   */
  getMetaArchetypes: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(20).default(10),
      minGames: z.number().min(1).max(200).default(5),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { archetypes: [] };

      const limit = input?.limit ?? 10;
      const minGames = input?.minGames ?? 5;

      const allDecks = await db
        .select({
          deckId: decks.id,
          cardList: decks.cardList,
          wins: decks.wins,
          losses: decks.losses,
        })
        .from(decks)
        .where(eq(decks.isActive, 1));

      if (allDecks.length === 0) return { archetypes: [] };

      const uniqueCardIds = new Set<string>();
      for (const d of allDecks) {
        for (const entry of d.cardList ?? []) uniqueCardIds.add(entry.cardId);
      }

      const rarityLookup = new Map<string, { rarity: string; name: string }>();
      if (uniqueCardIds.size > 0) {
        const cardRows = await db
          .select({ cardId: cards.cardId, rarity: cards.rarity, name: cards.name })
          .from(cards)
          .where(inArray(cards.cardId, [...uniqueCardIds]));
        for (const r of cardRows) rarityLookup.set(r.cardId, { rarity: r.rarity, name: r.name });
      }

      const rarityRank: Record<string, number> = {
        neyon: 6, mythic: 5, legendary: 4, epic: 3, rare: 2, uncommon: 1, common: 0,
      };

      const archetypeStats = new Map<string, {
        signature: string[];
        names: string[];
        wins: number;
        losses: number;
        deckCount: number;
      }>();

      for (const d of allDecks) {
        const sorted = (d.cardList ?? [])
          .map(c => ({
            cardId: c.cardId,
            rarity: rarityLookup.get(c.cardId)?.rarity ?? "common",
            name: rarityLookup.get(c.cardId)?.name ?? c.cardId,
          }))
          .sort((a, b) => (rarityRank[b.rarity] ?? 0) - (rarityRank[a.rarity] ?? 0))
          .slice(0, 3);
        if (sorted.length === 0) continue;
        const signature = sorted.map(c => c.cardId).sort();
        const key = signature.join("|");
        const entry = archetypeStats.get(key) ?? {
          signature,
          names: sorted.map(c => c.name),
          wins: 0,
          losses: 0,
          deckCount: 0,
        };
        entry.wins += d.wins;
        entry.losses += d.losses;
        entry.deckCount += 1;
        archetypeStats.set(key, entry);
      }

      const archetypes = [...archetypeStats.values()]
        .filter(a => a.wins + a.losses >= minGames)
        .map(a => ({
          signature: a.signature,
          names: a.names,
          wins: a.wins,
          losses: a.losses,
          games: a.wins + a.losses,
          deckCount: a.deckCount,
          winRate: a.wins + a.losses > 0
            ? Math.round((a.wins / (a.wins + a.losses)) * 1000) / 10
            : 0,
        }))
        .sort((a, b) => b.winRate - a.winRate || b.games - a.games)
        .slice(0, limit);

      return { archetypes };
    }),

  // ═══════════════════════════════════════════════════════
  // DAILY FREE PACK — Once per 24 hours
  // ═══════════════════════════════════════════════════════

  /**
   * Returns the cooldown status for the daily free pack.
   * `canClaim` is true when the last claim was > 24 hours ago (or never).
   * `nextClaimAt` is the ISO timestamp when the next claim unlocks.
   */
  getDailyPackStatus: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { canClaim: false, nextClaimAt: null as string | null };

    const rows = await db.select().from(userProgress)
      .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.franchiseId, "dischordian-saga")))
      .limit(1);

    const gameData = (rows[0]?.gameData ?? {}) as Record<string, unknown>;
    const lastClaimRaw = gameData.lastDailyCardPackAt;
    const lastClaim = typeof lastClaimRaw === "string" ? new Date(lastClaimRaw) : null;

    const now = new Date();
    const DAY_MS = 24 * 60 * 60 * 1000;

    if (!lastClaim || Number.isNaN(lastClaim.getTime())) {
      return { canClaim: true, nextClaimAt: null };
    }

    const nextClaim = new Date(lastClaim.getTime() + DAY_MS);
    const canClaim = now.getTime() >= nextClaim.getTime();
    return {
      canClaim,
      nextClaimAt: canClaim ? null : nextClaim.toISOString(),
    };
  }),

  /**
   * Claim the daily free booster pack. Enforces a 24-hour cooldown
   * via `userProgress.gameData.lastDailyCardPackAt` so this route is
   * safe against repeated calls.
   */
  claimDailyPack: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { success: false, message: "Database unavailable", cards: [] };

    // Load (or bootstrap) the user's progress row for this franchise.
    const rows = await db.select().from(userProgress)
      .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.franchiseId, "dischordian-saga")))
      .limit(1);

    const existing = rows[0];
    const gameData = (existing?.gameData ?? {}) as Record<string, unknown>;
    const lastClaimRaw = gameData.lastDailyCardPackAt;
    const lastClaim = typeof lastClaimRaw === "string" ? new Date(lastClaimRaw) : null;

    const now = new Date();
    const DAY_MS = 24 * 60 * 60 * 1000;

    if (lastClaim && !Number.isNaN(lastClaim.getTime())) {
      const diff = now.getTime() - lastClaim.getTime();
      if (diff < DAY_MS) {
        const nextClaim = new Date(lastClaim.getTime() + DAY_MS);
        return {
          success: false,
          message: `Daily pack already claimed. Next claim at ${nextClaim.toISOString()}`,
          nextClaimAt: nextClaim.toISOString(),
          cards: [],
        };
      }
    }

    // Generate a standard 5-card pack (same distribution as openBoosterPack).
    // Mirror the player-visibility gate so the daily pack respects act
    // gating like the paid pack does.
    const dailyExpansionState = await getPlayerExpansionState(ctx.user.id);
    const dailyLockedIds = getLockedCardIds(dailyExpansionState);
    const dailyConds: SQL[] = [eq(cards.isActive, 1)];
    if (dailyLockedIds.size > 0) {
      dailyConds.push(notInArray(cards.cardId, Array.from(dailyLockedIds)));
    }
    const allCards = await db
      .select()
      .from(cards)
      .where(dailyConds.length > 1 ? and(...dailyConds) : dailyConds[0]);
    if (allCards.length === 0) {
      return { success: false, message: "No cards available", cards: [] };
    }

    const byRarity = {
      common: allCards.filter(c => c.rarity === "common"),
      uncommon: allCards.filter(c => c.rarity === "uncommon"),
      rare: allCards.filter(c => c.rarity === "rare"),
      epic: allCards.filter(c => c.rarity === "epic"),
      legendary: allCards.filter(c => c.rarity === "legendary"),
      mythic: allCards.filter(c => c.rarity === "mythic"),
      neyon: allCards.filter(c => c.rarity === "neyon"),
    };

    const pick = (arr: typeof allCards) => arr[Math.floor(Math.random() * arr.length)];
    const packCards: typeof allCards = [];
    for (let i = 0; i < 3; i++) {
      if (byRarity.common.length > 0) packCards.push(pick(byRarity.common));
    }
    if (byRarity.uncommon.length > 0) packCards.push(pick(byRarity.uncommon));
    const roll = Math.random();
    if (roll < 0.01 && byRarity.neyon.length > 0) packCards.push(pick(byRarity.neyon));
    else if (roll < 0.03 && byRarity.mythic.length > 0) packCards.push(pick(byRarity.mythic));
    else if (roll < 0.08 && byRarity.legendary.length > 0) packCards.push(pick(byRarity.legendary));
    else if (roll < 0.25 && byRarity.epic.length > 0) packCards.push(pick(byRarity.epic));
    else if (byRarity.rare.length > 0) packCards.push(pick(byRarity.rare));

    // Add cards to user's collection.
    for (const card of packCards) {
      const own = await db
        .select()
        .from(userCards)
        .where(and(eq(userCards.userId, ctx.user.id), eq(userCards.cardId, card.cardId)))
        .limit(1);

      if (own.length > 0) {
        await db
          .update(userCards)
          .set({ quantity: sql`${userCards.quantity} + 1` })
          .where(eq(userCards.id, own[0].id));
      } else {
        await db.insert(userCards).values({
          userId: ctx.user.id,
          cardId: card.cardId,
          quantity: 1,
          isFoil: Math.random() < 0.05 ? 1 : 0,
          cardLevel: 1,
          obtainedVia: "daily_pack",
        });
      }
    }

    // Stamp the claim time. Bootstrap the progress row if it's missing.
    const nextGameData = { ...gameData, lastDailyCardPackAt: now.toISOString() };
    if (existing) {
      await db.update(userProgress)
        .set({ gameData: nextGameData })
        .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.franchiseId, "dischordian-saga")));
    } else {
      await db.insert(userProgress).values({
        userId: ctx.user.id,
        franchiseId: "dischordian-saga",
        gameData: nextGameData,
      });
    }

    trackCollectionSize(ctx.user.id)
      .catch(e => logger.error("[CardGame] Collection tracking error:", e));

    return {
      success: true,
      message: `Claimed ${packCards.length} free cards!`,
      nextClaimAt: new Date(now.getTime() + DAY_MS).toISOString(),
      cards: packCards,
    };
  }),

  // ═══════════════════════════════════════════════════════
  // DECK MANAGEMENT
  // ═══════════════════════════════════════════════════════

  myDecks: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(decks).where(eq(decks.userId, ctx.user.id)).orderBy(desc(decks.updatedAt));
  }),

  createDeck: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(256),
      description: z.string().optional(),
      deckType: z.enum(["crypt", "library", "combined"]).default("combined"),
      cardList: z.array(z.object({ cardId: z.string(), quantity: z.number().min(1).max(4) })).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      // PR — server-side deck validation at the tRPC boundary.
      // Rejects empty decks, over-limit copies, duplicate card
      // ids, and the sum-of-quantities over the format cap. The
      // zod schema already caps per-card qty at 4 and trims bad
      // shape, but the composition-level rules need to run here.
      const validation = validateDbDeckComposition(input.cardList);
      if (!validation.ok) {
        return { success: false, error: validation.error };
      }

      await db.insert(decks).values({
        userId: ctx.user.id,
        name: input.name,
        description: input.description,
        deckType: input.deckType,
        cardList: input.cardList ?? [],
      });

      return { success: true };
    }),

  updateDeck: protectedProcedure
    .input(z.object({
      deckId: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      cardList: z.array(z.object({ cardId: z.string(), quantity: z.number().min(1).max(4) })).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      // PR — same validation as createDeck, only when cardList is
      // being updated (rename-only updates bypass).
      if (input.cardList !== undefined) {
        const validation = validateDbDeckComposition(input.cardList);
        if (!validation.ok) {
          return { success: false, error: validation.error };
        }
      }

      const updateData: Record<string, unknown> = {};
      if (input.name) updateData.name = input.name;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.cardList) updateData.cardList = input.cardList;

      await db
        .update(decks)
        .set(updateData)
        .where(and(eq(decks.id, input.deckId), eq(decks.userId, ctx.user.id)));

      return { success: true };
    }),

  deleteDeck: protectedProcedure
    .input(z.object({ deckId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      await db
        .update(decks)
        .set({ isActive: 0 })
        .where(and(eq(decks.id, input.deckId), eq(decks.userId, ctx.user.id)));

      return { success: true };
    }),

  // ═══════════════════════════════════════════════════════
  // CHARACTER SHEET
  // ═══════════════════════════════════════════════════════

  getCharacterSheet: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    const rows = await db
      .select()
      .from(characterSheets)
      .where(eq(characterSheets.userId, ctx.user.id))
      .limit(1);
    return rows[0] ?? null;
  }),

  createCharacterSheet: protectedProcedure
    .input(z.object({
      characterName: z.string().min(1).max(256),
      species: z.enum(["demagi", "quarchon", "neyon", "human", "synthetic"]).default("human"),
      characterClass: z.enum(["spy", "oracle", "assassin", "engineer", "soldier"]),
      alignment: z.enum(["order", "chaos"]).default("order"),
      element: z.enum(["earth", "fire", "water", "air"]).default("earth"),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      // Check if already has a character
      const existing = await db
        .select()
        .from(characterSheets)
        .where(eq(characterSheets.userId, ctx.user.id))
        .limit(1);

      if (existing.length > 0) {
        return { success: false, message: "You already have a character sheet" };
      }

      // Set base stats based on class
      const classStats: Record<string, Record<string, number>> = {
        spy: { strength: 4, intelligence: 7, agility: 8, charisma: 6, perception: 8, willpower: 4 },
        oracle: { strength: 3, intelligence: 9, agility: 4, charisma: 7, perception: 9, willpower: 6 },
        assassin: { strength: 7, intelligence: 5, agility: 9, charisma: 3, perception: 7, willpower: 5 },
        engineer: { strength: 5, intelligence: 9, agility: 5, charisma: 5, perception: 7, willpower: 6 },
        soldier: { strength: 8, intelligence: 4, agility: 6, charisma: 5, perception: 6, willpower: 8 },
      };

      const stats = classStats[input.characterClass] ?? classStats.soldier;

      await db.insert(characterSheets).values({
        userId: ctx.user.id,
        characterName: input.characterName,
        species: input.species,
        characterClass: input.characterClass,
        alignment: input.alignment,
        element: input.element,
        ...stats,
        influence: 30,
        energy: 10,
        credits: 1000,
        abilities: [],
        equipment: {},
      });

      return { success: true };
    }),

  // ═══════════════════════════════════════════════════════
  // GAME ENGINE — Start and play card game matches
  // ═══════════════════════════════════════════════════════

  startMatch: protectedProcedure
    .input(z.object({
      deckId: z.number(),
      aiDifficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, matchId: 0 };

      // Get the user's deck
      const userDeck = await db
        .select()
        .from(decks)
        .where(and(eq(decks.id, input.deckId), eq(decks.userId, ctx.user.id)))
        .limit(1);

      if (!userDeck[0]) return { success: false, matchId: 0, message: "Deck not found" };

      const deckCards = userDeck[0].cardList ?? [];
      if (deckCards.length < 5) return { success: false, matchId: 0, message: "Deck needs at least 5 cards" };

      // Resolve card details
      const cardIds = deckCards.map(c => c.cardId);
      const cardDetails = await db.select().from(cards).where(inArray(cards.cardId, cardIds));
      const cardMap = new Map(cardDetails.map(c => [c.cardId, c]));

      // Build player hand (draw 5)
      const shuffled = [...deckCards].sort(() => Math.random() - 0.5);
      const hand = shuffled.slice(0, 5);
      const drawPile = shuffled.slice(5);

      // Build AI deck (random cards from the database)
      const difficultyMultiplier = input.aiDifficulty === "hard" ? 1.3 : input.aiDifficulty === "easy" ? 0.7 : 1.0;
      const aiCards = await db.select().from(cards).where(eq(cards.isActive, 1)).limit(30);
      const aiShuffled = aiCards.sort(() => Math.random() - 0.5);
      const aiHand = aiShuffled.slice(0, 5).map(c => ({ cardId: c.cardId, quantity: 1 }));
      const aiDrawPile = aiShuffled.slice(5, 20).map(c => ({ cardId: c.cardId, quantity: 1 }));

      // ═══ CITIZEN TRAIT BONUSES ═══
      const [citizen, nft] = await Promise.all([
        fetchCitizenData(ctx.user.id),
        fetchPotentialNftData(ctx.user.id),
      ]);
      const traitBonuses = resolveCardGameBonuses(citizen, nft);

      // Apply Living Universe consequences to card stats
      const fx = await getConsequences();
      const cardStatMultiplier = fx.cardStatMultiplier ?? 1;

      // Initial game state — traits modify starting stats
      const gameState = {
        turn: 1,
        phase: "untap", // untap, upkeep, influence, action, combat, discard
        activePlayer: "player1",
        traitBonuses: {
          globalAttackBonus: traitBonuses.globalAttackBonus,
          globalHealthBonus: traitBonuses.globalHealthBonus,
          elementAffinity: traitBonuses.elementAffinity,
          extraDrawEveryNTurns: traitBonuses.extraDrawEveryNTurns,
          costReductionChance: traitBonuses.costReductionChance,
          alignmentEffect: traitBonuses.alignmentEffect,
          breakdown: traitBonuses.breakdown,
        },
        player1: {
          health: 30 + traitBonuses.hpBonus,
          influence: 30 + traitBonuses.influenceBonus,
          energy: 10 + traitBonuses.energyBonus,
          hand: hand,
          drawPile: drawPile,
          field: [] as any[],
          graveyard: [] as any[],
        },
        player2: {
          health: 30,
          influence: Math.floor(30 * difficultyMultiplier),
          energy: Math.floor(10 * difficultyMultiplier),
          hand: aiHand,
          drawPile: aiDrawPile,
          field: [] as any[],
          graveyard: [] as any[],
          isAI: true,
          difficulty: input.aiDifficulty,
        },
        log: ["Match started!"],
      };

      const result = await db.insert(cardGameMatches).values({
        player1Id: ctx.user.id,
        player2Id: 0,
        status: "active",
        gameState: gameState,
      });

      return { success: true, matchId: Number(result[0].insertId), gameState };
    }),

  // Play a card from hand
  playCard: protectedProcedure
    .input(z.object({
      matchId: z.number(),
      cardId: z.string(),
      targetIndex: z.number().optional(), // Index of target on opponent's field
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      const match = await db
        .select()
        .from(cardGameMatches)
        .where(and(eq(cardGameMatches.id, input.matchId), eq(cardGameMatches.player1Id, ctx.user.id)))
        .limit(1);

      if (!match[0] || match[0].status !== "active") {
        return { success: false, message: "Match not found or not active" };
      }

      const state = match[0].gameState as unknown as GameState;
      const player = state.player1;
      const opponent = state.player2;

      // Find card in hand
      const handIdx = player.hand.findIndex((c: CardInPlay) => c.cardId === input.cardId);
      if (handIdx === -1) return { success: false, message: "Card not in hand" };

      // Get card details
      const cardDetail = await db.select().from(cards).where(eq(cards.cardId, input.cardId)).limit(1);
      if (!cardDetail[0]) return { success: false, message: "Card not found" };

      const card = cardDetail[0];

      // Apply cost reduction from traits
      const tb = state.traitBonuses || { costReductionChance: 0 };
      let effectiveCost = card.cost;
      const costRed = tb.costReductionChance ?? 0;
      if (costRed > 0 && Math.random() < costRed) {
        effectiveCost = Math.max(0, effectiveCost - 1);
        state.log.push(`[TRAIT] Class instinct reduced cost by 1!`);
      }

      // Check if player has enough energy
      if (player.energy < effectiveCost) {
        return { success: false, message: "Not enough energy" };
      }

      // Remove from hand, spend energy
      player.hand.splice(handIdx, 1);
      player.energy -= effectiveCost;

      // Resolve card effect based on type
      let logEntry = "";

      if (card.cardType === "character") {
        // Place on field — apply citizen trait bonuses to summoned characters
        const tb = state.traitBonuses || { globalAttackBonus: 0, globalHealthBonus: 0, elementAffinity: "", alignmentEffect: { type: "order_structure", value: 0 } };
        let summonPower = card.power + (tb.globalAttackBonus || 0);
        let summonHealth = card.health + (tb.globalHealthBonus || 0);
        // Element affinity: matching element cards get +2 ATK
        if (tb.elementAffinity && card.element === tb.elementAffinity) {
          summonPower += 2;
        }
        // Order alignment: all characters get +2 HP
        if (tb.alignmentEffect?.type === "order_structure" && tb.alignmentEffect.value > 0) {
          summonHealth += tb.alignmentEffect.value;
        }
        player.field.push({
          cardId: card.cardId,
          cardType: card.cardType ?? "character",
          name: card.name,
          power: summonPower,
          health: summonHealth,
          maxHealth: summonHealth,
          cost: card.cost ?? 0,
          tapped: false,
        });
        logEntry = `Summoned ${card.name} (${card.power}/${card.health})`;
      } else if (card.cardType === "action" || card.cardType === "combat") {
        // Direct damage or effect
        if (input.targetIndex !== undefined && opponent.field[input.targetIndex]) {
          const target = opponent.field[input.targetIndex];
          target.health -= card.power;
          logEntry = `${card.name} dealt ${card.power} damage to ${target.name}`;
          if (target.health <= 0) {
            opponent.graveyard.push(opponent.field.splice(input.targetIndex, 1)[0]);
            logEntry += ` — DESTROYED!`;
          }
        } else {
          // Direct damage to opponent
          opponent.health -= card.power;
          logEntry = `${card.name} dealt ${card.power} damage to opponent (HP: ${opponent.health})`;
        }
      } else if (card.cardType === "item") {
        // Buff a friendly character
        if (player.field.length > 0) {
          const target = player.field[0]; // Buff first character
          target.power += Math.ceil(card.power / 2);
          target.health += Math.ceil(card.health / 2);
          target.maxHealth = (target.maxHealth ?? target.health) + Math.ceil(card.health / 2);
          logEntry = `${card.name} buffed ${target.name} (+${Math.ceil(card.power / 2)}/${Math.ceil(card.health / 2)})`;
        } else {
          player.energy += card.cost; // Refund if no target
          player.hand.push({
            cardId: card.cardId,
            cardType: card.cardType ?? "item",
            name: card.name,
            power: card.power,
            health: card.health,
            cost: card.cost,
            tapped: false,
            quantity: 1,
          });
          return { success: false, message: "No characters to equip" };
        }
      } else if (card.cardType === "reaction") {
        // Heal or shield
        player.health = Math.min(30, player.health + card.health);
        logEntry = `${card.name} restored ${card.health} health (HP: ${player.health})`;
      } else if (card.cardType === "event") {
        // Area effect
        for (const enemy of opponent.field) {
          enemy.health -= Math.ceil(card.power / 2);
        }
        opponent.field = opponent.field.filter((e: CardInPlay) => {
          if (e.health <= 0) {
            opponent.graveyard.push(e);
            return false;
          }
          return true;
        });
        logEntry = `${card.name} dealt ${Math.ceil(card.power / 2)} damage to all enemies`;
      } else {
        // Generic: place in graveyard
        logEntry = `Played ${card.name}`;
      }

      player.graveyard.push({
        cardId: card.cardId,
        cardType: card.cardType ?? "unknown",
        name: card.name,
        power: card.power,
        health: card.health,
        cost: card.cost,
        tapped: false,
      });
      state.log.push(logEntry);

      // AI turn
      const aiLog = resolveAITurn(state);
      state.log.push(...aiLog);

      // Draw a card for player
      const drawn = player.drawPile.shift();
      if (drawn) player.hand.push(drawn);

      // Extra draw from Oracle/Spy class trait
      const extraDraw = state.traitBonuses?.extraDrawEveryNTurns || 0;
      if (extraDraw > 0 && state.turn % extraDraw === 0) {
        const extra = player.drawPile.shift();
        if (extra) {
          player.hand.push(extra);
          state.log.push(`[TRAIT] Class ability granted an extra card draw!`);
        }
      }

      // Regenerate some energy
      player.energy = Math.min(10 + state.turn, player.energy + 2);
      opponent.energy = Math.min(10 + state.turn, opponent.energy + 2);
      state.turn++;

      // Check win/loss
      let matchStatus = "active";
      let winnerId = null;
      if (opponent.health <= 0) {
        matchStatus = "completed";
        winnerId = ctx.user.id;
        state.log.push("VICTORY! You have defeated your opponent!");
      } else if (player.health <= 0) {
        matchStatus = "completed";
        winnerId = 0;
        state.log.push("DEFEAT! Your opponent has won.");
      }

      await db
        .update(cardGameMatches)
        .set({
          gameState: state,
          status: matchStatus as any,
          winnerId,
          endedAt: matchStatus === "completed" ? new Date() : undefined,
        })
        .where(eq(cardGameMatches.id, input.matchId));

      // Achievement auto-tracking for AI matches
      let fightReactions: Awaited<ReturnType<typeof tryFightReactions>> = [];
      if (matchStatus === "completed") {
        trackAiResult(ctx.user.id, winnerId === ctx.user.id)
          .catch(e => logger.error("[CardGame] Achievement tracking error:", e));
        await ripple.emit("card_battle_result", { userId: ctx.user.id, won: winnerId === ctx.user.id });
        fightReactions = await tryFightReactions(
          ctx.user.id,
          input.matchId,
          winnerId === ctx.user.id,
        );
      }

      return {
        success: true,
        gameState: state,
        logEntry,
        matchStatus,
        fightReactions,
      };
    }),

  // Attack with a character on field
  attackWithCharacter: protectedProcedure
    .input(z.object({
      matchId: z.number(),
      attackerIndex: z.number(),
      targetIndex: z.number().optional(), // If undefined, attack opponent directly
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      const match = await db
        .select()
        .from(cardGameMatches)
        .where(and(eq(cardGameMatches.id, input.matchId), eq(cardGameMatches.player1Id, ctx.user.id)))
        .limit(1);

      if (!match[0] || match[0].status !== "active") {
        return { success: false, message: "Match not found" };
      }

      const state = match[0].gameState as unknown as GameState;
      const player = state.player1;
      const opponent = state.player2;

      const attacker = player.field[input.attackerIndex];
      if (!attacker) return { success: false, message: "No character at that position" };
      if (attacker.tapped) return { success: false, message: "Character already attacked this turn" };

      let logEntry = "";

      if (input.targetIndex !== undefined && opponent.field[input.targetIndex]) {
        // Attack enemy character
        const target = opponent.field[input.targetIndex];
        target.health -= attacker.power;
        attacker.health -= Math.ceil(target.power / 2); // Counter damage

        logEntry = `${attacker.name} attacked ${target.name} for ${attacker.power} damage`;

        if (target.health <= 0) {
          opponent.graveyard.push(opponent.field.splice(input.targetIndex, 1)[0]);
          logEntry += ` — ${target.name} DESTROYED!`;
        }
        if (attacker.health <= 0) {
          player.graveyard.push(player.field.splice(input.attackerIndex, 1)[0]);
          logEntry += ` — ${attacker.name} fell in battle!`;
        }
      } else {
        // Direct attack on opponent
        if (opponent.field.length > 0) {
          // Must attack characters first if they exist
          return { success: false, message: "Must attack enemy characters first" };
        }
        opponent.health -= attacker.power;
        logEntry = `${attacker.name} attacked opponent directly for ${attacker.power} damage! (HP: ${opponent.health})`;
      }

      attacker.tapped = true;
      state.log.push(logEntry);

      // Check win
      let matchStatus = "active";
      let winnerId = null;
      if (opponent.health <= 0) {
        matchStatus = "completed";
        winnerId = ctx.user.id;
        state.log.push("VICTORY!");
      }

      await db
        .update(cardGameMatches)
        .set({
          gameState: state,
          status: matchStatus as any,
          winnerId,
          endedAt: matchStatus === "completed" ? new Date() : undefined,
        })
        .where(eq(cardGameMatches.id, input.matchId));

      // Achievement auto-tracking for AI matches
      let fightReactions: Awaited<ReturnType<typeof tryFightReactions>> = [];
      if (matchStatus === "completed") {
        trackAiResult(ctx.user.id, winnerId === ctx.user.id)
          .catch(e => logger.error("[CardGame] Achievement tracking error:", e));
        await ripple.emit("card_battle_result", { userId: ctx.user.id, won: winnerId === ctx.user.id });
        fightReactions = await tryFightReactions(
          ctx.user.id,
          input.matchId,
          winnerId === ctx.user.id,
        );
      }

      return { success: true, gameState: state, logEntry, matchStatus, fightReactions };
    }),

  // End turn
  endTurn: protectedProcedure
    .input(z.object({ matchId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      const match = await db
        .select()
        .from(cardGameMatches)
        .where(and(eq(cardGameMatches.id, input.matchId), eq(cardGameMatches.player1Id, ctx.user.id)))
        .limit(1);

      if (!match[0] || match[0].status !== "active") return { success: false };

      const state = match[0].gameState as unknown as GameState;

      // Untap all player characters
      for (const char of state.player1.field) {
        char.tapped = false;
      }

      // AI turn
      const aiLog = resolveAITurn(state);
      state.log.push("--- End of your turn ---");
      state.log.push(...aiLog);

      // Draw
      const endTurnDraw = state.player1.drawPile.shift();
      if (endTurnDraw) state.player1.hand.push(endTurnDraw);

      // Regen energy
      state.player1.energy = Math.min(10 + state.turn, state.player1.energy + 3);
      state.player2.energy = Math.min(10 + state.turn, state.player2.energy + 3);
      state.turn++;

      // Check loss
      let matchStatus = "active";
      let winnerId = null;
      if (state.player1.health <= 0) {
        matchStatus = "completed";
        winnerId = 0;
        state.log.push("DEFEAT!");
      } else if (state.player2.health <= 0) {
        matchStatus = "completed";
        winnerId = ctx.user.id;
        state.log.push("VICTORY!");
      }

      await db
        .update(cardGameMatches)
        .set({
          gameState: state,
          status: matchStatus as any,
          winnerId,
          endedAt: matchStatus === "completed" ? new Date() : undefined,
        })
        .where(eq(cardGameMatches.id, input.matchId));

      // Achievement auto-tracking for AI matches
      let fightReactions: Awaited<ReturnType<typeof tryFightReactions>> = [];
      if (matchStatus === "completed") {
        trackAiResult(ctx.user.id, winnerId === ctx.user.id)
          .catch(e => logger.error("[CardGame] Achievement tracking error:", e));
        await ripple.emit("card_battle_result", { userId: ctx.user.id, won: winnerId === ctx.user.id });
        fightReactions = await tryFightReactions(
          ctx.user.id,
          input.matchId,
          winnerId === ctx.user.id,
        );
      }

      return { success: true, gameState: state, matchStatus, fightReactions };
    }),

  // Get active match
  getActiveMatch: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    const rows = await db
      .select()
      .from(cardGameMatches)
      .where(and(eq(cardGameMatches.player1Id, ctx.user.id), eq(cardGameMatches.status, "active")))
      .orderBy(desc(cardGameMatches.startedAt))
      .limit(1);
    return rows[0] ?? null;
  }),

  // Get match history
  matchHistory: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(10) }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(cardGameMatches)
        .where(eq(cardGameMatches.player1Id, ctx.user.id))
        .orderBy(desc(cardGameMatches.startedAt))
        .limit(input?.limit ?? 10);
    }),

  /**
   * Unified match history — merges PvE (cardGameMatches) and PvP
   * (pvpMatches) into a single normalized shape so the UI can render
   * one "Recent Matches" list without juggling two endpoints.
   *
   * Addresses the TCG audit "PvE vs PvP match table split" finding:
   * the two tables stay separate for ownership/relations reasons but
   * are presented as one stream to the client.
   */
  getUnifiedMatchHistory: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(20) }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];

      const limit = input?.limit ?? 20;

      // Pull a generous window from each table, then merge + sort in JS.
      // Each table's individual limit is the requested limit so the merged
      // set has enough candidates from either side.
      const pveRows = await db
        .select()
        .from(cardGameMatches)
        .where(eq(cardGameMatches.player1Id, ctx.user.id))
        .orderBy(desc(cardGameMatches.startedAt))
        .limit(limit);

      const pvpRows = await db
        .select()
        .from(pvpMatches)
        .where(or(
          eq(pvpMatches.player1Id, ctx.user.id),
          eq(pvpMatches.player2Id, ctx.user.id),
        ))
        .orderBy(desc(pvpMatches.id))
        .limit(limit);

      const pveNormalized = pveRows.map(r => ({
        kind: "pve" as const,
        matchId: String(r.id),
        opponentUserId: r.player2Id,
        opponentName: r.player2Id === 0 ? "AI" : `user_${r.player2Id}`,
        status: r.status ?? "unknown",
        result: r.winnerId === ctx.user.id
          ? "win"
          : r.winnerId != null
            ? "loss"
            : "pending",
        startedAt: r.startedAt,
        endedAt: r.endedAt,
        eloChange: 0,
      }));

      const pvpNormalized = pvpRows.map(r => {
        const isPlayer1 = r.player1Id === ctx.user.id;
        const opponentId = isPlayer1 ? r.player2Id : r.player1Id;
        return {
          kind: "pvp" as const,
          matchId: r.matchId,
          opponentUserId: opponentId ?? 0,
          opponentName: `user_${opponentId ?? 0}`,
          status: r.status ?? "unknown",
          result: r.winnerId === ctx.user.id
            ? "win"
            : r.winnerId != null
              ? "loss"
              : "pending",
          startedAt: r.startedAt ?? null,
          endedAt: r.endedAt ?? null,
          eloChange: isPlayer1 ? (r.player1EloChange ?? 0) : (r.player2EloChange ?? 0),
        };
      });

      const merged = [...pveNormalized, ...pvpNormalized]
        .sort((a, b) => {
          const aTime = a.startedAt ? new Date(a.startedAt).getTime() : 0;
          const bTime = b.startedAt ? new Date(b.startedAt).getTime() : 0;
          return bTime - aTime;
        })
        .slice(0, limit);

      return merged;
    }),

  // ═══════════════════════════════════════════════════════
  // DEMON CARD PACKS — HIERARCHY OF THE DAMNED
  // ═══════════════════════════════════════════════════════

  /** Open a Demon Card Pack — 5 cards from the Hierarchy of the Damned pool */
  openDemonPack: protectedProcedure
    .input(z.object({ packType: z.enum(["standard", "premium", "infernal"]).default("standard") }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, cards: [], cost: 0 };

      // Pack costs in Dream tokens
      const packCosts = { standard: 30, premium: 75, infernal: 200 };
      const cost = packCosts[input.packType];
      const packSize = input.packType === "premium" ? 7 : input.packType === "infernal" ? 5 : 5;

      // Check balance
      const [balance] = await db.select().from(dreamBalance).where(eq(dreamBalance.userId, ctx.user.id)).limit(1);
      if (!balance || balance.dreamTokens < cost) {
        return { success: false, cards: [], cost, error: "Insufficient Dream tokens" };
      }

      // Deduct Dream tokens
      await db.update(dreamBalance)
        .set({ dreamTokens: sql`${dreamBalance.dreamTokens} - ${cost}` })
        .where(eq(dreamBalance.userId, ctx.user.id));

      // Get demon cards from the database
      const demonCards = await db.select().from(cards)
        .where(and(eq(cards.isActive, 1), sql`${cards.cardId} LIKE 'demon-%'`));

      if (demonCards.length === 0) {
        // Refund if no demon cards exist
        await db.update(dreamBalance)
          .set({ dreamTokens: sql`${dreamBalance.dreamTokens} + ${cost}` })
          .where(eq(dreamBalance.userId, ctx.user.id));
        return { success: false, cards: [], cost, error: "No demon cards available" };
      }

      const byRarity = {
        common: demonCards.filter(c => c.rarity === "common"),
        uncommon: demonCards.filter(c => c.rarity === "uncommon"),
        rare: demonCards.filter(c => c.rarity === "rare"),
        epic: demonCards.filter(c => c.rarity === "epic"),
        legendary: demonCards.filter(c => c.rarity === "legendary"),
        mythic: demonCards.filter(c => c.rarity === "mythic"),
        neyon: demonCards.filter(c => c.rarity === "neyon"),
      };

      const pick = (arr: typeof demonCards) => arr[Math.floor(Math.random() * arr.length)];
      const pickAny = () => demonCards[Math.floor(Math.random() * demonCards.length)];

      const packCards: typeof demonCards = [];

      if (input.packType === "infernal") {
        // Infernal: guaranteed 1 legendary/mythic, 2 epic+, 2 rare+
        const legendaryPool = [...byRarity.legendary, ...byRarity.mythic, ...byRarity.neyon];
        if (legendaryPool.length > 0) packCards.push(pick(legendaryPool));
        else packCards.push(pickAny());
        const epicPool = [...byRarity.epic, ...byRarity.legendary, ...byRarity.mythic];
        for (let i = 0; i < 2; i++) {
          if (epicPool.length > 0) packCards.push(pick(epicPool));
          else packCards.push(pickAny());
        }
        const rarePool = [...byRarity.rare, ...byRarity.epic];
        for (let i = 0; i < 2; i++) {
          if (rarePool.length > 0) packCards.push(pick(rarePool));
          else packCards.push(pickAny());
        }
      } else if (input.packType === "premium") {
        // Premium: 3 common, 2 uncommon, 1 rare, 1 epic+
        for (let i = 0; i < 3; i++) packCards.push(byRarity.common.length > 0 ? pick(byRarity.common) : pickAny());
        for (let i = 0; i < 2; i++) packCards.push(byRarity.uncommon.length > 0 ? pick(byRarity.uncommon) : pickAny());
        packCards.push(byRarity.rare.length > 0 ? pick(byRarity.rare) : pickAny());
        const epicPlus = [...byRarity.epic, ...byRarity.legendary, ...byRarity.mythic];
        packCards.push(epicPlus.length > 0 ? pick(epicPlus) : pickAny());
      } else {
        // Standard: 3 common, 1 uncommon, 1 rare+
        for (let i = 0; i < 3; i++) packCards.push(byRarity.common.length > 0 ? pick(byRarity.common) : pickAny());
        packCards.push(byRarity.uncommon.length > 0 ? pick(byRarity.uncommon) : pickAny());
        const roll = Math.random();
        if (roll < 0.05 && byRarity.legendary.length > 0) packCards.push(pick(byRarity.legendary));
        else if (roll < 0.15 && byRarity.epic.length > 0) packCards.push(pick(byRarity.epic));
        else packCards.push(byRarity.rare.length > 0 ? pick(byRarity.rare) : pickAny());
      }

      // Add to user collection
      const isFoilChance = input.packType === "infernal" ? 0.15 : input.packType === "premium" ? 0.08 : 0.05;
      for (const card of packCards) {
        const existing = await db.select().from(userCards)
          .where(and(eq(userCards.userId, ctx.user.id), eq(userCards.cardId, card.cardId)))
          .limit(1);
        if (existing.length > 0) {
          await db.update(userCards)
            .set({ quantity: sql`${userCards.quantity} + 1` })
            .where(eq(userCards.id, existing[0].id));
        } else {
          await db.insert(userCards).values({
            userId: ctx.user.id,
            cardId: card.cardId,
            quantity: 1,
            isFoil: Math.random() < isFoilChance ? 1 : 0,
            cardLevel: 1,
            obtainedVia: "demon_pack",
          });
        }
      }

      return {
        success: true,
        cards: packCards,
        cost,
        packType: input.packType,
        remainingDream: (balance.dreamTokens || 0) - cost,
      };
    }),

  /** Get demon card collection stats */
  demonCollectionStats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { totalDemonCards: 0, uniqueDemonCards: 0, totalAvailable: 0, completionPercent: 0 };

    const [totalAvailable] = await db.select({ count: sql<number>`count(*)` })
      .from(cards)
      .where(sql`${cards.cardId} LIKE 'demon-%'`);

    const userDemonCards = await db.select({
      cardId: userCards.cardId,
      quantity: userCards.quantity,
    })
      .from(userCards)
      .where(and(
        eq(userCards.userId, ctx.user.id),
        sql`${userCards.cardId} LIKE 'demon-%'`
      ));

    const uniqueCount = userDemonCards.length;
    const totalCount = userDemonCards.reduce((sum, c) => sum + (c.quantity || 0), 0);
    const available = Number(totalAvailable?.count || 0);

    return {
      totalDemonCards: totalCount,
      uniqueDemonCards: uniqueCount,
      totalAvailable: available,
      completionPercent: available > 0 ? Math.round((uniqueCount / available) * 100) : 0,
    };
  }),

  /**
   * §4.9 retroactive delivery of `burnt_card_placeholder` (the Seer
   * winnable-path key card). Fired client-side when the Seer's staff
   * is canonically witnessed and Cycle B is complete. Idempotent —
   * a second call after the card is already in the player's
   * collection is a benign no-op.
   *
   * Spec: docs/production/act1/seer-prophecy-mechanic.md §3.3.
   * Audit follow-up: closes the "burnt_card_placeholder retroactive
   * delivery" item.
   */
  grantBurntCardPlaceholder: protectedProcedure
    .mutation(async ({ ctx }): Promise<{ granted: boolean; alreadyOwned: boolean }> => {
      const db = await getDb();
      if (!db) return { granted: false, alreadyOwned: false };

      const BURNT_ID = "burnt_card_placeholder";

      // Idempotency check.
      const [existing] = await db
        .select()
        .from(userCards)
        .where(
          and(
            eq(userCards.userId, ctx.user.id),
            eq(userCards.cardId, BURNT_ID),
          ),
        )
        .limit(1);
      if (existing) {
        return { granted: false, alreadyOwned: true };
      }

      await db.insert(userCards).values({
        userId: ctx.user.id,
        cardId: BURNT_ID,
        quantity: 1,
        isFoil: 0,
        cardLevel: 1,
        obtainedVia: "seer_winnable_path",
      });

      return { granted: true, alreadyOwned: false };
    }),
});

// ═══════════════════════════════════════════════════════
// AI TURN RESOLUTION
// ═══════════════════════════════════════════════════════

function resolveAITurn(state: GameState): string[] {
  const ai = state.player2;
  const player = state.player1;
  const log: string[] = [];
  const difficulty = ai.difficulty ?? "medium";

  // Untap AI characters
  for (const char of ai.field) {
    char.tapped = false;
  }

  // AI plays cards from hand
  const playableCards = [...ai.hand].sort((a: CardInPlay, b: CardInPlay) => {
    // Prioritize characters, then combat, then actions
    const priority: Record<string, number> = { character: 0, combat: 1, action: 2, item: 3 };
    return (priority[a.cardType] ?? 5) - (priority[b.cardType] ?? 5);
  });

  for (const handCard of playableCards) {
    if (ai.energy <= 0) break;

    // Simple AI: play what it can afford
    const cost = Math.max(1, Math.floor(Math.random() * 3) + 1);
    if (ai.energy >= cost) {
      ai.energy -= cost;
      const idx = ai.hand.indexOf(handCard);
      if (idx > -1) ai.hand.splice(idx, 1);

      // Simulate card effect
      const roll = Math.random();
      if (roll < 0.4) {
        // Summon character
        const power = difficulty === "hard" ? 4 + Math.floor(Math.random() * 4) : 2 + Math.floor(Math.random() * 3);
        const health = difficulty === "hard" ? 5 + Math.floor(Math.random() * 4) : 3 + Math.floor(Math.random() * 3);
        ai.field.push({
          cardId: handCard.cardId,
          cardType: handCard.cardType ?? "character",
          name: `AI Unit ${ai.field.length + 1}`,
          power,
          health,
          maxHealth: health,
          cost: handCard.cost ?? 0,
          tapped: false,
        });
        log.push(`AI summoned a unit (${power}/${health})`);
      } else if (roll < 0.7) {
        // Direct damage
        const dmg = difficulty === "hard" ? 3 + Math.floor(Math.random() * 3) : 1 + Math.floor(Math.random() * 3);
        if (player.field.length > 0) {
          const target = player.field[Math.floor(Math.random() * player.field.length)];
          target.health -= dmg;
          log.push(`AI dealt ${dmg} damage to ${target.name}`);
          if (target.health <= 0) {
            player.graveyard.push(player.field.splice(player.field.indexOf(target), 1)[0]);
            log.push(`${target.name} was destroyed!`);
          }
        } else {
          player.health -= dmg;
          log.push(`AI dealt ${dmg} direct damage (Your HP: ${player.health})`);
        }
      }
      break; // AI plays one card per turn
    }
  }

  // AI attacks with characters
  for (const char of ai.field) {
    if (char.tapped) continue;

    if (player.field.length > 0) {
      const target = player.field[Math.floor(Math.random() * player.field.length)];
      target.health -= char.power;
      char.health -= Math.ceil(target.power / 3);
      log.push(`AI's ${char.name} attacked ${target.name} for ${char.power} damage`);

      if (target.health <= 0) {
        player.graveyard.push(player.field.splice(player.field.indexOf(target), 1)[0]);
        log.push(`${target.name} was destroyed!`);
      }
    } else {
      player.health -= char.power;
      log.push(`AI's ${char.name} attacked you directly for ${char.power} damage! (Your HP: ${player.health})`);
    }
    char.tapped = true;
  }

  // AI draws
  const aiDrawn = ai.drawPile.shift();
  if (aiDrawn) ai.hand.push(aiDrawn);

  // Remove dead AI characters
  ai.field = ai.field.filter((c: CardInPlay) => {
    if (c.health <= 0) {
      ai.graveyard.push(c);
      return false;
    }
    return true;
  });

  return log;
}
