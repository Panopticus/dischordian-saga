import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { cards, userCards, decks, cardGameMatches, characterSheets } from "../../drizzle/schema";
import { eq, and, like, inArray, sql, desc, asc } from "drizzle-orm";

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
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { cards: [], total: 0, page: 1, totalPages: 0 };

      const page = input?.page ?? 1;
      const limit = input?.limit ?? 24;
      const offset = (page - 1) * limit;

      // Build WHERE conditions
      const conditions: any[] = [eq(cards.isActive, 1)];
      if (input?.search) conditions.push(like(cards.name, `%${input.search}%`));
      if (input?.cardType) conditions.push(eq(cards.cardType, input.cardType as any));
      if (input?.rarity) conditions.push(eq(cards.rarity, input.rarity as any));
      if (input?.season) conditions.push(eq(cards.season, input.season));
      if (input?.element) conditions.push(eq(cards.element, input.element as any));
      if (input?.alignment) conditions.push(eq(cards.alignment, input.alignment as any));
      if (input?.characterClass) conditions.push(eq(cards.characterClass, input.characterClass as any));
      if (input?.faction) conditions.push(like(cards.faction, `%${input.faction}%`));

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

    return { success: true, message: `Received ${pack.length} starter cards!`, count: pack.length };
  }),

  // Open a booster pack (earn random cards)
  openBoosterPack: protectedProcedure
    .input(z.object({ season: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, cards: [] };

      // 5 cards per pack: 3 common, 1 uncommon, 1 rare+
      const conditions: any[] = [eq(cards.isActive, 1)];
      if (input?.season) conditions.push(eq(cards.season, input.season));

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
      // 1 rare+ (weighted)
      const roll = Math.random();
      if (roll < 0.01 && byRarity.neyon.length > 0) packCards.push(pick(byRarity.neyon));
      else if (roll < 0.03 && byRarity.mythic.length > 0) packCards.push(pick(byRarity.mythic));
      else if (roll < 0.08 && byRarity.legendary.length > 0) packCards.push(pick(byRarity.legendary));
      else if (roll < 0.25 && byRarity.epic.length > 0) packCards.push(pick(byRarity.epic));
      else if (byRarity.rare.length > 0) packCards.push(pick(byRarity.rare));

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

      return { success: true, cards: packCards };
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

      // Initial game state
      const gameState = {
        turn: 1,
        phase: "untap", // untap, upkeep, influence, action, combat, discard
        activePlayer: "player1",
        player1: {
          health: 30,
          influence: 30,
          energy: 10,
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

      const state = match[0].gameState as any;
      const player = state.player1;
      const opponent = state.player2;

      // Find card in hand
      const handIdx = player.hand.findIndex((c: any) => c.cardId === input.cardId);
      if (handIdx === -1) return { success: false, message: "Card not in hand" };

      // Get card details
      const cardDetail = await db.select().from(cards).where(eq(cards.cardId, input.cardId)).limit(1);
      if (!cardDetail[0]) return { success: false, message: "Card not found" };

      const card = cardDetail[0];

      // Check if player has enough energy
      if (player.energy < card.cost) {
        return { success: false, message: "Not enough energy" };
      }

      // Remove from hand, spend energy
      player.hand.splice(handIdx, 1);
      player.energy -= card.cost;

      // Resolve card effect based on type
      let logEntry = "";

      if (card.cardType === "character") {
        // Place on field
        player.field.push({
          cardId: card.cardId,
          name: card.name,
          power: card.power,
          health: card.health,
          maxHealth: card.health,
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
          target.maxHealth += Math.ceil(card.health / 2);
          logEntry = `${card.name} buffed ${target.name} (+${Math.ceil(card.power / 2)}/${Math.ceil(card.health / 2)})`;
        } else {
          player.energy += card.cost; // Refund if no target
          player.hand.push({ cardId: card.cardId, quantity: 1 });
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
        opponent.field = opponent.field.filter((e: any) => {
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

      player.graveyard.push({ cardId: card.cardId });
      state.log.push(logEntry);

      // AI turn
      const aiLog = resolveAITurn(state);
      state.log.push(...aiLog);

      // Draw a card for player
      if (player.drawPile.length > 0) {
        player.hand.push(player.drawPile.shift());
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

      return {
        success: true,
        gameState: state,
        logEntry,
        matchStatus,
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

      const state = match[0].gameState as any;
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

      return { success: true, gameState: state, logEntry, matchStatus };
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

      const state = match[0].gameState as any;

      // Untap all player characters
      for (const char of state.player1.field) {
        char.tapped = false;
      }

      // AI turn
      const aiLog = resolveAITurn(state);
      state.log.push("--- End of your turn ---");
      state.log.push(...aiLog);

      // Draw
      if (state.player1.drawPile.length > 0) {
        state.player1.hand.push(state.player1.drawPile.shift());
      }

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

      return { success: true, gameState: state, matchStatus };
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
});

// ═══════════════════════════════════════════════════════
// AI TURN RESOLUTION
// ═══════════════════════════════════════════════════════

function resolveAITurn(state: any): string[] {
  const ai = state.player2;
  const player = state.player1;
  const log: string[] = [];
  const difficulty = ai.difficulty ?? "medium";

  // Untap AI characters
  for (const char of ai.field) {
    char.tapped = false;
  }

  // AI plays cards from hand
  const playableCards = [...ai.hand].sort((a: any, b: any) => {
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
          name: `AI Unit ${ai.field.length + 1}`,
          power,
          health,
          maxHealth: health,
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
  if (ai.drawPile.length > 0) {
    ai.hand.push(ai.drawPile.shift());
  }

  // Remove dead AI characters
  ai.field = ai.field.filter((c: any) => {
    if (c.health <= 0) {
      ai.graveyard.push(c);
      return false;
    }
    return true;
  });

  return log;
}
