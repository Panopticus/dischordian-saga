import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { twSectors, twPlayerState, twGameLog, cards, userCards } from "../../drizzle/schema";
import { eq, and, sql, inArray, desc } from "drizzle-orm";

// ═══════════════════════════════════════════════════════
// SHIP DEFINITIONS
// ═══════════════════════════════════════════════════════

const SHIPS: Record<string, { name: string; holds: number; fighters: number; shields: number; cost: number; speed: number }> = {
  scout: { name: "Scout Pod", holds: 20, fighters: 0, shields: 100, cost: 0, speed: 3 },
  merchant: { name: "Merchant Cruiser", holds: 75, fighters: 10, shields: 200, cost: 15000, speed: 2 },
  corvette: { name: "Corvette", holds: 40, fighters: 50, shields: 400, cost: 30000, speed: 3 },
  frigate: { name: "Battle Frigate", holds: 30, fighters: 100, shields: 600, cost: 60000, speed: 2 },
  dreadnought: { name: "Dreadnought", holds: 100, fighters: 200, shields: 1000, cost: 150000, speed: 1 },
  ark: { name: "Inception Ark", holds: 200, fighters: 500, shields: 2000, cost: 500000, speed: 1 },
};

// ═══════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════

async function getOrCreatePlayer(db: any, userId: number) {
  const existing = await db.select().from(twPlayerState).where(eq(twPlayerState.userId, userId)).limit(1);
  if (existing.length > 0) {
    // Reset turns if new day
    const lastReset = new Date(existing[0].lastTurnReset);
    const now = new Date();
    if (now.getDate() !== lastReset.getDate() || now.getMonth() !== lastReset.getMonth()) {
      await db.update(twPlayerState)
        .set({ turnsRemaining: 100, lastTurnReset: now })
        .where(eq(twPlayerState.userId, userId));
      existing[0].turnsRemaining = 100;
    }
    return existing[0];
  }
  
  // Create new player
  await db.insert(twPlayerState).values({
    userId,
    currentSector: 1,
    shipType: "scout",
    credits: 5000,
    fuelOre: 0,
    organics: 0,
    equipment: 0,
    holds: 20,
    fighters: 0,
    shields: 100,
    turnsRemaining: 100,
    experience: 0,
    alignment: 0,
    discoveredSectors: [1, 2, 3, 4, 5],
    ownedPlanets: [],
    deployedFighters: {},
    cardRewards: [],
  });
  
  const newPlayer = await db.select().from(twPlayerState).where(eq(twPlayerState.userId, userId)).limit(1);
  return newPlayer[0];
}

async function logAction(db: any, userId: number, action: string, details: Record<string, unknown>, sectorId?: number) {
  await db.insert(twGameLog).values({ userId, action, details, sectorId });
}

function getCargoUsed(player: any): number {
  return (player.fuelOre || 0) + (player.organics || 0) + (player.equipment || 0);
}

// ═══════════════════════════════════════════════════════
// TRADE WARS ROUTER
// ═══════════════════════════════════════════════════════

export const tradeWarsRouter = router({
  // Get player state
  getState: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    const player = await getOrCreatePlayer(db, ctx.user.id);
    const ship = SHIPS[player.shipType] || SHIPS.scout;
    return { ...player, shipInfo: ship, cargoUsed: getCargoUsed(player) };
  }),

  // Get current sector info
  getSector: protectedProcedure
    .input(z.object({ sectorId: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return null;
      const player = await getOrCreatePlayer(db, ctx.user.id);
      const sid = input?.sectorId ?? player.currentSector;
      
      const sectorRows = await db.select().from(twSectors).where(eq(twSectors.sectorId, sid)).limit(1);
      if (sectorRows.length === 0) return null;
      
      const sector = sectorRows[0];
      const discovered = (player.discoveredSectors as number[]) || [];
      
      // Get connected sector names
      const warpIds = (sector.warps as number[]) || [];
      let connectedSectors: any[] = [];
      if (warpIds.length > 0) {
        connectedSectors = await db.select({
          sectorId: twSectors.sectorId,
          name: twSectors.name,
          sectorType: twSectors.sectorType,
        }).from(twSectors).where(inArray(twSectors.sectorId, warpIds));
      }
      
      return {
        ...sector,
        isCurrentSector: sid === player.currentSector,
        isDiscoveredByPlayer: discovered.includes(sid),
        connectedSectors: connectedSectors.map(s => ({
          ...s,
          explored: discovered.includes(s.sectorId),
        })),
      };
    }),

  // Warp to a connected sector
  warp: protectedProcedure
    .input(z.object({ targetSector: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, message: "Database unavailable" };
      
      const player = await getOrCreatePlayer(db, ctx.user.id);
      if (player.turnsRemaining <= 0) return { success: false, message: "No turns remaining today. Come back tomorrow!" };
      
      // Check if target is connected
      const currentSector = await db.select().from(twSectors).where(eq(twSectors.sectorId, player.currentSector)).limit(1);
      if (currentSector.length === 0) return { success: false, message: "Current sector not found" };
      
      const warps = (currentSector[0].warps as number[]) || [];
      if (!warps.includes(input.targetSector)) {
        return { success: false, message: "Cannot warp there — no warp connection from current sector" };
      }
      
      // Get target sector
      const targetRows = await db.select().from(twSectors).where(eq(twSectors.sectorId, input.targetSector)).limit(1);
      if (targetRows.length === 0) return { success: false, message: "Target sector does not exist" };
      
      const target = targetRows[0];
      const discovered = new Set((player.discoveredSectors as number[]) || []);
      const wasNew = !discovered.has(input.targetSector);
      discovered.add(input.targetSector);
      
      // Also discover connected sectors of the target (scanner range)
      const targetWarps = (target.warps as number[]) || [];
      targetWarps.forEach(w => discovered.add(w));
      
      // Check for hazards
      let hazardDamage = 0;
      let hazardMessage = "";
      if (target.sectorType === "hazard") {
        const data = target.sectorData as any;
        if (data?.hazardType && Math.random() > (data.avoidChance || 0.5)) {
          hazardDamage = data.damage || 20;
          hazardMessage = `⚠️ ${data.hazardType.toUpperCase()} DAMAGE: -${hazardDamage} shields!`;
        }
      }
      
      // Update player
      const newShields = Math.max(0, player.shields - hazardDamage);
      const xpGain = wasNew ? 25 : 5;
      
      await db.update(twPlayerState).set({
        currentSector: input.targetSector,
        turnsRemaining: player.turnsRemaining - 1,
        shields: newShields,
        experience: player.experience + xpGain,
         discoveredSectors: Array.from(discovered),
    }).where(eq(twPlayerState.userId, ctx.user.id));
    
    await logAction(db, ctx.user.id, "warp", {
        from: player.currentSector,
        to: input.targetSector,
        newDiscovery: wasNew,
        hazardDamage,
      }, input.targetSector);
      
      // Card reward for new discoveries
      let cardReward = null;
      if (wasNew && Math.random() < 0.15) {
        // 15% chance to find a card in a new sector
        const randomCards = await db.select().from(cards)
          .where(eq(cards.rarity, "common"))
          .limit(1);
        if (randomCards.length > 0) {
          cardReward = randomCards[0];
          // Add to user collection
          const existing = await db.select().from(userCards)
            .where(and(eq(userCards.userId, ctx.user.id), eq(userCards.cardId, randomCards[0].cardId)))
            .limit(1);
          if (existing.length > 0) {
            await db.update(userCards)
              .set({ quantity: sql`${userCards.quantity} + 1` })
              .where(eq(userCards.id, existing[0].id));
          } else {
            await db.insert(userCards).values({
              userId: ctx.user.id,
              cardId: randomCards[0].cardId,
              quantity: 1,
              isFoil: 0,
              cardLevel: 1,
              obtainedVia: "exploration",
            });
          }
        }
      }
      
      return {
        success: true,
        message: wasNew
          ? `Warped to Sector ${input.targetSector}: ${target.name}. NEW SECTOR DISCOVERED! +${xpGain} XP`
          : `Warped to Sector ${input.targetSector}: ${target.name}. +${xpGain} XP`,
        sector: target,
        hazardMessage,
        newDiscovery: wasNew,
        xpGain,
        cardReward: cardReward ? { name: cardReward.name, rarity: cardReward.rarity } : null,
        turnsRemaining: player.turnsRemaining - 1,
        shields: newShields,
      };
    }),

  // Trade at a port
  trade: protectedProcedure
    .input(z.object({
      commodity: z.enum(["fuelOre", "organics", "equipment"]),
      action: z.enum(["buy", "sell"]),
      quantity: z.number().min(1).max(9999),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, message: "Database unavailable" };
      
      const player = await getOrCreatePlayer(db, ctx.user.id);
      if (player.turnsRemaining <= 0) return { success: false, message: "No turns remaining!" };
      
      // Get current sector
      const sectorRows = await db.select().from(twSectors)
        .where(eq(twSectors.sectorId, player.currentSector)).limit(1);
      if (sectorRows.length === 0) return { success: false, message: "Sector not found" };
      
      const sector = sectorRows[0];
      if (sector.sectorType !== "port" && sector.sectorType !== "stardock") {
        return { success: false, message: "No trading port in this sector" };
      }
      
      const portData = sector.sectorData as any;
      if (!portData?.commodities) return { success: false, message: "Port data corrupted" };
      
      const commodity = portData.commodities[input.commodity];
      if (!commodity) return { success: false, message: `Port doesn't trade ${input.commodity}` };
      
      const price = commodity.price;
      const cargoUsed = getCargoUsed(player);
      
      if (input.action === "buy") {
        // Port must be selling (not buying) this commodity
        if (commodity.buying) return { success: false, message: `This port only BUYS ${input.commodity}, doesn't sell it` };
        
        const totalCost = price * input.quantity;
        if (player.credits < totalCost) return { success: false, message: `Not enough credits. Need ${totalCost}, have ${player.credits}` };
        
        const freeHolds = player.holds - cargoUsed;
        if (input.quantity > freeHolds) return { success: false, message: `Not enough cargo space. Free holds: ${freeHolds}` };
        
        // Execute trade
        const updates: any = {
          credits: player.credits - totalCost,
          turnsRemaining: player.turnsRemaining - 1,
          experience: player.experience + Math.floor(input.quantity / 10),
        };
        updates[input.commodity] = (player[input.commodity] || 0) + input.quantity;
        
        await db.update(twPlayerState).set(updates).where(eq(twPlayerState.userId, ctx.user.id));
        
        await logAction(db, ctx.user.id, "buy", {
          commodity: input.commodity,
          quantity: input.quantity,
          price,
          totalCost,
        }, player.currentSector);
        
        return {
          success: true,
          message: `Bought ${input.quantity} ${input.commodity} for ${totalCost} credits`,
          credits: player.credits - totalCost,
          commodity: input.commodity,
          newQuantity: (player[input.commodity] || 0) + input.quantity,
        };
      } else {
        // Selling — port must be buying this commodity
        if (!commodity.buying) return { success: false, message: `This port only SELLS ${input.commodity}, doesn't buy it` };
        
        const playerStock = player[input.commodity] || 0;
        if (input.quantity > playerStock) return { success: false, message: `You only have ${playerStock} ${input.commodity}` };
        
        const totalRevenue = price * input.quantity;
        
        const updates: any = {
          credits: player.credits + totalRevenue,
          turnsRemaining: player.turnsRemaining - 1,
          experience: player.experience + Math.floor(input.quantity / 10),
          alignment: player.alignment + 1, // Trading increases alignment (lawful)
        };
        updates[input.commodity] = playerStock - input.quantity;
        
        await db.update(twPlayerState).set(updates).where(eq(twPlayerState.userId, ctx.user.id));
        
        await logAction(db, ctx.user.id, "sell", {
          commodity: input.commodity,
          quantity: input.quantity,
          price,
          totalRevenue,
        }, player.currentSector);
        
        return {
          success: true,
          message: `Sold ${input.quantity} ${input.commodity} for ${totalRevenue} credits`,
          credits: player.credits + totalRevenue,
          commodity: input.commodity,
          newQuantity: playerStock - input.quantity,
        };
      }
    }),

  // Scan current sector for details
  scan: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { success: false, message: "Database unavailable" };
    
    const player = await getOrCreatePlayer(db, ctx.user.id);
    if (player.turnsRemaining <= 0) return { success: false, message: "No turns remaining!" };
    
    const sectorRows = await db.select().from(twSectors)
      .where(eq(twSectors.sectorId, player.currentSector)).limit(1);
    if (sectorRows.length === 0) return { success: false, message: "Sector not found" };
    
    const sector = sectorRows[0];
    
    // Discover all connected sectors
    const warps = (sector.warps as number[]) || [];
    const discovered = new Set((player.discoveredSectors as number[]) || []);
    let newDiscoveries = 0;
    warps.forEach(w => {
      if (!discovered.has(w)) newDiscoveries++;
      discovered.add(w);
    });
    
    // Also scan 2nd-degree connections with lower probability
    if (warps.length > 0) {
      const connectedSectors = await db.select().from(twSectors).where(inArray(twSectors.sectorId, warps));
      for (const cs of connectedSectors) {
        const csWarps = (cs.warps as number[]) || [];
        csWarps.forEach(w => {
          if (!discovered.has(w) && Math.random() < 0.3) {
            discovered.add(w);
            newDiscoveries++;
          }
        });
      }
    }
    
    await db.update(twPlayerState).set({
      turnsRemaining: player.turnsRemaining - 1,
      discoveredSectors: Array.from(discovered),
      experience: player.experience + 10 + newDiscoveries * 5,
    }).where(eq(twPlayerState.userId, ctx.user.id));
    
    return {
      success: true,
      message: `Scan complete. ${newDiscoveries} new sectors detected.`,
      sector,
      newDiscoveries,
      totalDiscovered: discovered.size,
    };
  }),

  // Buy/upgrade ship at stardock
  upgradeShip: protectedProcedure
    .input(z.object({ shipType: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, message: "Database unavailable" };
      
      const player = await getOrCreatePlayer(db, ctx.user.id);
      
      // Must be at stardock
      if (player.currentSector !== 1) {
        return { success: false, message: "Ship upgrades only available at Stardock (Sector 1)" };
      }
      
      const ship = SHIPS[input.shipType];
      if (!ship) return { success: false, message: "Unknown ship type" };
      
      if (player.credits < ship.cost) {
        return { success: false, message: `Not enough credits. Need ${ship.cost}, have ${player.credits}` };
      }
      
      // Transfer cargo (limited by new holds)
      const cargoUsed = getCargoUsed(player);
      const overflow = Math.max(0, cargoUsed - ship.holds);
      
      await db.update(twPlayerState).set({
        shipType: input.shipType,
        credits: player.credits - ship.cost,
        holds: ship.holds,
        fighters: Math.max(player.fighters, ship.fighters),
        shields: ship.shields,
        // Drop overflow cargo proportionally
        fuelOre: overflow > 0 ? Math.floor(player.fuelOre * (ship.holds / cargoUsed)) : player.fuelOre,
        organics: overflow > 0 ? Math.floor(player.organics * (ship.holds / cargoUsed)) : player.organics,
        equipment: overflow > 0 ? Math.floor(player.equipment * (ship.holds / cargoUsed)) : player.equipment,
      }).where(eq(twPlayerState.userId, ctx.user.id));
      
      await logAction(db, ctx.user.id, "upgrade_ship", { shipType: input.shipType, cost: ship.cost }, 1);
      
      return {
        success: true,
        message: `Upgraded to ${ship.name}! Holds: ${ship.holds}, Fighters: ${ship.fighters}, Shields: ${ship.shields}`,
        ship,
      };
    }),

  // Buy fighters at stardock
  buyFighters: protectedProcedure
    .input(z.object({ quantity: z.number().min(1).max(1000) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, message: "Database unavailable" };
      
      const player = await getOrCreatePlayer(db, ctx.user.id);
      if (player.currentSector !== 1) return { success: false, message: "Fighters only available at Stardock" };
      
      const costPerFighter = 100;
      const totalCost = costPerFighter * input.quantity;
      if (player.credits < totalCost) return { success: false, message: `Need ${totalCost} credits` };
      
      await db.update(twPlayerState).set({
        credits: player.credits - totalCost,
        fighters: player.fighters + input.quantity,
      }).where(eq(twPlayerState.userId, ctx.user.id));
      
      return { success: true, message: `Purchased ${input.quantity} fighters for ${totalCost} credits`, fighters: player.fighters + input.quantity };
    }),

  // Repair shields at stardock
  repairShields: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { success: false, message: "Database unavailable" };
    
    const player = await getOrCreatePlayer(db, ctx.user.id);
    if (player.currentSector !== 1) return { success: false, message: "Repairs only at Stardock" };
    
    const ship = SHIPS[player.shipType] || SHIPS.scout;
    const damage = ship.shields - player.shields;
    if (damage <= 0) return { success: false, message: "Shields already at maximum" };
    
    const costPerPoint = 5;
    const totalCost = damage * costPerPoint;
    if (player.credits < totalCost) return { success: false, message: `Need ${totalCost} credits for full repair` };
    
    await db.update(twPlayerState).set({
      credits: player.credits - totalCost,
      shields: ship.shields,
    }).where(eq(twPlayerState.userId, ctx.user.id));
    
    return { success: true, message: `Shields repaired to ${ship.shields}. Cost: ${totalCost} credits`, shields: ship.shields };
  }),

  // Combat encounter (attack NPC pirates)
  combat: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { success: false, message: "Database unavailable" };
    
    const player = await getOrCreatePlayer(db, ctx.user.id);
    if (player.turnsRemaining <= 0) return { success: false, message: "No turns remaining!" };
    
    // Generate enemy based on sector danger level
    const sectorRows = await db.select().from(twSectors)
      .where(eq(twSectors.sectorId, player.currentSector)).limit(1);
    
    const enemyStrength = 10 + Math.floor(Math.random() * (player.experience / 10 + 20));
    const enemyNames = [
      "Rogue Pirate", "Panopticon Drone", "Void Raider", "Data Wraith",
      "Necromancer's Shade", "Chaos Marauder", "Quantum Ghost", "Insurgent Scout",
    ];
    const enemyName = enemyNames[Math.floor(Math.random() * enemyNames.length)];
    
    // Simple combat resolution
    const playerPower = player.fighters + Math.floor(player.shields / 10);
    const roll = Math.random();
    const playerAdvantage = playerPower / (playerPower + enemyStrength);
    const won = roll < playerAdvantage;
    
    let message = "";
    let creditsChange = 0;
    let fightersLost = 0;
    let shieldDamage = 0;
    let xpGain = 0;
    let cardReward = null;
    
    if (won) {
      creditsChange = 500 + Math.floor(Math.random() * enemyStrength * 50);
      xpGain = 20 + Math.floor(enemyStrength / 2);
      fightersLost = Math.floor(Math.random() * Math.min(5, player.fighters));
      shieldDamage = Math.floor(Math.random() * 20);
      message = `VICTORY! Defeated ${enemyName}. Salvaged ${creditsChange} credits. +${xpGain} XP`;
      
      // 20% chance for card reward on combat win
      if (Math.random() < 0.2) {
        const combatCards = await db.select().from(cards)
          .where(eq(cards.cardType, "combat"))
          .limit(5);
        if (combatCards.length > 0) {
          const reward = combatCards[Math.floor(Math.random() * combatCards.length)];
          cardReward = { name: reward.name, rarity: reward.rarity, cardId: reward.cardId };
          
          const existing = await db.select().from(userCards)
            .where(and(eq(userCards.userId, ctx.user.id), eq(userCards.cardId, reward.cardId)))
            .limit(1);
          if (existing.length > 0) {
            await db.update(userCards).set({ quantity: sql`${userCards.quantity} + 1` }).where(eq(userCards.id, existing[0].id));
          } else {
            await db.insert(userCards).values({
              userId: ctx.user.id, cardId: reward.cardId, quantity: 1, isFoil: 0, cardLevel: 1, obtainedVia: "combat",
            });
          }
        }
      }
    } else {
      fightersLost = Math.floor(player.fighters * 0.3);
      shieldDamage = 30 + Math.floor(Math.random() * 50);
      creditsChange = -Math.floor(player.credits * 0.1);
      xpGain = 5;
      message = `DEFEAT! ${enemyName} overwhelmed your defenses. Lost ${Math.abs(creditsChange)} credits.`;
    }
    
    await db.update(twPlayerState).set({
      credits: Math.max(0, player.credits + creditsChange),
      fighters: Math.max(0, player.fighters - fightersLost),
      shields: Math.max(0, player.shields - shieldDamage),
      turnsRemaining: player.turnsRemaining - 1,
      experience: player.experience + xpGain,
      alignment: player.alignment + (won ? -2 : 0), // Combat lowers alignment
    }).where(eq(twPlayerState.userId, ctx.user.id));
    
    await logAction(db, ctx.user.id, "combat", {
      enemy: enemyName,
      enemyStrength,
      won,
      creditsChange,
      fightersLost,
      shieldDamage,
    }, player.currentSector);
    
    return {
      success: true,
      won,
      message,
      enemyName,
      enemyStrength,
      creditsChange,
      fightersLost,
      shieldDamage,
      xpGain,
      cardReward,
    };
  }),

  // Mine asteroids
  mine: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { success: false, message: "Database unavailable" };
    
    const player = await getOrCreatePlayer(db, ctx.user.id);
    if (player.turnsRemaining <= 0) return { success: false, message: "No turns remaining!" };
    
    const sectorRows = await db.select().from(twSectors)
      .where(eq(twSectors.sectorId, player.currentSector)).limit(1);
    if (sectorRows.length === 0) return { success: false, message: "Sector not found" };
    
    if (sectorRows[0].sectorType !== "asteroid") {
      return { success: false, message: "No asteroids to mine in this sector" };
    }
    
    const cargoUsed = getCargoUsed(player);
    const freeHolds = player.holds - cargoUsed;
    if (freeHolds <= 0) return { success: false, message: "Cargo holds full!" };
    
    const mined = Math.min(freeHolds, 5 + Math.floor(Math.random() * 15));
    const danger = Math.random() < 0.1; // 10% chance of mining accident
    let shieldDamage = 0;
    
    if (danger) {
      shieldDamage = 10 + Math.floor(Math.random() * 20);
    }
    
    await db.update(twPlayerState).set({
      fuelOre: player.fuelOre + mined,
      shields: Math.max(0, player.shields - shieldDamage),
      turnsRemaining: player.turnsRemaining - 1,
      experience: player.experience + 5,
    }).where(eq(twPlayerState.userId, ctx.user.id));
    
    return {
      success: true,
      message: danger
        ? `Mined ${mined} fuel ore, but hit a volatile pocket! -${shieldDamage} shields`
        : `Mined ${mined} fuel ore from the asteroid field.`,
      mined,
      shieldDamage,
    };
  }),

  // Get game log (recent actions)
  getLog: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(20) }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];
      
      return db.select().from(twGameLog)
        .where(eq(twGameLog.userId, ctx.user.id))
        .orderBy(desc(twGameLog.createdAt))
        .limit(input?.limit ?? 20);
    }),

  // Get galaxy map (discovered sectors)
  getMap: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { sectors: [], playerSector: 1 };
    
    const player = await getOrCreatePlayer(db, ctx.user.id);
    const discovered = (player.discoveredSectors as number[]) || [];
    
    if (discovered.length === 0) return { sectors: [], playerSector: player.currentSector };
    
    const sectors = await db.select().from(twSectors)
      .where(inArray(twSectors.sectorId, discovered));
    
    return {
      sectors: sectors.map(s => ({
        sectorId: s.sectorId,
        name: s.name,
        sectorType: s.sectorType,
        warps: s.warps,
        isCurrent: s.sectorId === player.currentSector,
      })),
      playerSector: player.currentSector,
      totalDiscovered: discovered.length,
      totalSectors: 200,
    };
  }),

  // Get available ships for purchase
  getShips: publicProcedure.query(() => {
    return Object.entries(SHIPS).map(([key, ship]) => ({
      id: key,
      ...ship,
    }));
  }),
});
