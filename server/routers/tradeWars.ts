import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { twSectors, twPlayerState, twGameLog, twColonies, cards, userCards, users, shipUpgrades, playerBases } from "../../drizzle/schema";
import { eq, and, sql, inArray, desc, gt } from "drizzle-orm";
import { fetchCitizenData, fetchPotentialNftData, resolveTradeEmpireBonuses } from "../traitResolver";

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
    faction: null, // Will be set during tutorial
    tutorialStep: 0,
    discoveredRelics: [],
    researchPoints: 0,
    unlockedTech: [],
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

const COLONY_INCOME: Record<string, { credits: number; fuelOre: number; organics: number; equipment: number }> = {
  mining:       { credits: 50,  fuelOre: 5,  organics: 0,  equipment: 1 },
  agriculture:  { credits: 30,  fuelOre: 0,  organics: 8,  equipment: 0 },
  technology:   { credits: 80,  fuelOre: 0,  organics: 0,  equipment: 5 },
  military:     { credits: 40,  fuelOre: 2,  organics: 0,  equipment: 3 },
  trading:      { credits: 100, fuelOre: 1,  organics: 1,  equipment: 1 },
};

function getColonyIncome(colonyType: string, level: number, population: number) {
  const base = COLONY_INCOME[colonyType] || COLONY_INCOME.mining;
  const levelMultiplier = 1 + (level - 1) * 0.5; // Level 1=1x, 2=1.5x, 3=2x, 4=2.5x, 5=3x
  const popMultiplier = population / 100; // 100 pop = 1x
  const mult = levelMultiplier * popMultiplier;
  return {
    credits: Math.floor(base.credits * mult),
    fuelOre: Math.floor(base.fuelOre * mult),
    organics: Math.floor(base.organics * mult),
    equipment: Math.floor(base.equipment * mult),
  };
}

// ═══════════════════════════════════════════════════════
// TRADE EMPIRE ROUTER
// ═══════════════════════════════════════════════════════

export const tradeWarsRouter = router({
  // Get player state
  getState: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    const player = await getOrCreatePlayer(db, ctx.user.id);
    const ship = SHIPS[player.shipType] || SHIPS.scout;
    // Fetch citizen trait bonuses for UI display
    const [citizen, nft] = await Promise.all([
      fetchCitizenData(ctx.user.id),
      fetchPotentialNftData(ctx.user.id),
    ]);
    const traitBonuses = resolveTradeEmpireBonuses(citizen, nft);
    return { ...player, shipInfo: ship, cargoUsed: getCargoUsed(player), traitBonuses };
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
        // Citizen traits can reduce hazard damage
        const hazardCitizen = await fetchCitizenData(ctx.user.id);
        const hazardNft = await fetchPotentialNftData(ctx.user.id);
        const hazardTb = resolveTradeEmpireBonuses(hazardCitizen, hazardNft);
        if (data?.hazardType && Math.random() > (data.avoidChance || 0.5) + hazardTb.hazardResistance) {
          hazardDamage = Math.floor((data.damage || 20) * (1 - hazardTb.shieldDamageReduction));
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
      factionReputation: z.record(z.string(), z.number()).optional(),
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
      
      let price = commodity.price;
      const cargoUsed = getCargoUsed(player);
      
      // ═══ DIPLOMACY PRICE MODIFIERS ═══
      // Faction reputation from diplomacy choices affects trade prices
      if (input.factionReputation) {
        const rep = input.factionReputation;
        const isEmpirePort = player.currentSector % 2 === 0;
        const empireRep = rep.empire || 0;
        const insurgencyRep = rep.insurgency || 0;
        const independentRep = rep.independent || 0;
        const pirateRep = rep.pirate || 0;
        
        // Faction alignment discount: up to 15% off at aligned ports
        let factionDiscount = 0;
        if (isEmpirePort) {
          factionDiscount = Math.min(0.15, Math.max(0, empireRep) * 0.003);
          factionDiscount -= Math.min(0.10, Math.max(0, -insurgencyRep) * 0.002);
        } else {
          factionDiscount = Math.min(0.15, Math.max(0, insurgencyRep) * 0.003);
          factionDiscount -= Math.min(0.10, Math.max(0, -empireRep) * 0.002);
        }
        // Independent reputation gives universal small bonus
        factionDiscount += Math.min(0.05, Math.max(0, independentRep) * 0.001);
        // Pirate reputation: better black market prices
        if (pirateRep > 20) factionDiscount += 0.03;
        if (pirateRep < -20) factionDiscount -= 0.02;
        
        price = Math.max(1, Math.floor(price * (1 - factionDiscount)));
      }
      
      if (input.action === "buy") {
        // Port must be selling (not buying) this commodity
        if (commodity.buying) return { success: false, message: `This port only BUYS ${input.commodity}, doesn't sell it` };
        
        // Apply citizen trade discount
        const tradeCitizen = await fetchCitizenData(ctx.user.id);
        const tradeNft = await fetchPotentialNftData(ctx.user.id);
        const tradeTb = resolveTradeEmpireBonuses(tradeCitizen, tradeNft);
        const discountedPrice = Math.max(1, Math.floor(price * (1 - tradeTb.tradePriceDiscount)));
        const totalCost = discountedPrice * input.quantity;
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
        
        // Apply citizen trade bonus
        const sellCitizen = await fetchCitizenData(ctx.user.id);
        const sellNft = await fetchPotentialNftData(ctx.user.id);
        const sellTb = resolveTradeEmpireBonuses(sellCitizen, sellNft);
        const totalRevenue = price * input.quantity + sellTb.tradeCreditsBonus;
        
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
    
    // Also scan 2nd-degree connections — trait scan bonus increases range
    const scanCitizen = await fetchCitizenData(ctx.user.id);
    const scanNft = await fetchPotentialNftData(ctx.user.id);
    const scanTb = resolveTradeEmpireBonuses(scanCitizen, scanNft);
    const scanDepth = 2 + scanTb.scanRangeBonus; // Base 2 + trait bonus
    if (warps.length > 0) {
      const connectedSectors = await db.select().from(twSectors).where(inArray(twSectors.sectorId, warps));
      for (const cs of connectedSectors) {
        const csWarps = (cs.warps as number[]) || [];
        csWarps.forEach(w => {
          if (!discovered.has(w) && Math.random() < (0.3 + scanTb.scanRangeBonus * 0.1)) {
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
    
    const baseEnemyStrength = 10 + Math.floor(Math.random() * (player.experience / 10 + 20));
    const regularEnemies = [
      "Rogue Pirate", "Panopticon Drone", "Void Raider", "Data Wraith",
      "Necromancer's Shade", "Chaos Marauder", "Quantum Ghost", "Insurgent Scout",
    ];
    const demonEnemies = [
      "Hierarchy Scout", "Blood Weave Tendril", "Damned Legionnaire", "Soul Collector Drone",
      "Mol'Garath's Herald", "Vex'Ahlia's Vanguard", "Shadow Tongue Whisper", "Ny'Koth's Experiment",
    ];
    // 20% chance of demon encounter (scales with XP)
    const demonChance = Math.min(0.35, 0.15 + (player.experience / 5000));
    const isDemonEncounter = Math.random() < demonChance;
    const enemyPool = isDemonEncounter ? demonEnemies : regularEnemies;
    const enemyName = enemyPool[Math.floor(Math.random() * enemyPool.length)];
    // Demon encounters are 30% stronger but give 50% more rewards
    const enemyStrength = isDemonEncounter ? Math.floor(baseEnemyStrength * 1.3) : baseEnemyStrength;
    
    // ═══ CITIZEN TRAIT BONUSES ═══
    const [citizen, nft] = await Promise.all([
      fetchCitizenData(ctx.user.id),
      fetchPotentialNftData(ctx.user.id),
    ]);
    const tb = resolveTradeEmpireBonuses(citizen, nft);

    // Combat resolution — traits add to player power
    const playerPower = player.fighters + Math.floor(player.shields / 10) + tb.combatPowerBonus;
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
      const creditBase = isDemonEncounter ? 750 : 500;
      creditsChange = creditBase + Math.floor(Math.random() * enemyStrength * (isDemonEncounter ? 75 : 50));
      xpGain = (isDemonEncounter ? 35 : 20) + Math.floor(enemyStrength / 2) + tb.xpBonus;
      fightersLost = Math.floor(Math.random() * Math.min(5, player.fighters));
      shieldDamage = Math.floor(Math.random() * 20 * (1 - tb.shieldDamageReduction));
      message = isDemonEncounter
        ? `☠ HIERARCHY VANQUISHED! Defeated ${enemyName}. Blood Weave salvage: ${creditsChange} credits. +${xpGain} XP`
        : `VICTORY! Defeated ${enemyName}. Salvaged ${creditsChange} credits. +${xpGain} XP`;
      
      // Demon encounters have 35% card drop rate, regular 20% — trait bonus adds to drop rate
      const cardDropRate = (isDemonEncounter ? 0.35 : 0.2) + tb.cardDropRateBonus;
      if (Math.random() < cardDropRate) {
        // Demon encounters can drop demon cards
        const cardQuery = isDemonEncounter
          ? db.select().from(cards).where(sql`${cards.cardId} LIKE 'demon-%'`).limit(10)
          : db.select().from(cards).where(eq(cards.cardType, "combat")).limit(5);
        const combatCards = await cardQuery;
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
      shieldDamage = Math.floor((30 + Math.random() * 50) * (1 - tb.shieldDamageReduction));
      creditsChange = -Math.floor(player.credits * 0.1);
      xpGain = 5;
      message = isDemonEncounter
        ? `☠ HIERARCHY TRIUMPH! ${enemyName} overwhelmed your defenses. The Blood Weave claims ${Math.abs(creditsChange)} credits.`
        : `DEFEAT! ${enemyName} overwhelmed your defenses. Lost ${Math.abs(creditsChange)} credits.`;
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
      isDemonEncounter,
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
      isDemonEncounter,
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

  // ═══════════════════════════════════════════════════════
  // LEADERBOARD
  // ═══════════════════════════════════════════════════════

  getLeaderboard: publicProcedure
    .input(z.object({
      sortBy: z.enum(["credits", "experience", "sectors", "combat"]).default("credits"),
      limit: z.number().min(1).max(50).default(20),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const sortBy = input?.sortBy ?? "credits";
      const limit = input?.limit ?? 20;

      // Get all players with their user info
      const players = await db
        .select({
          userId: twPlayerState.userId,
          userName: users.name,
          credits: twPlayerState.credits,
          experience: twPlayerState.experience,
          shipType: twPlayerState.shipType,
          alignment: twPlayerState.alignment,
          discoveredSectors: twPlayerState.discoveredSectors,
          ownedPlanets: twPlayerState.ownedPlanets,
          fighters: twPlayerState.fighters,
        })
        .from(twPlayerState)
        .innerJoin(users, eq(twPlayerState.userId, users.id))
        .orderBy(
          sortBy === "credits" ? desc(twPlayerState.credits)
          : sortBy === "experience" ? desc(twPlayerState.experience)
          : desc(twPlayerState.experience) // fallback
        )
        .limit(limit);

      // Get combat stats for each player
      const playerIds = players.map(p => p.userId);
      let combatStats: Record<number, { wins: number; losses: number }> = {};

      if (playerIds.length > 0) {
        const combatLogs = await db
          .select({
            userId: twGameLog.userId,
            details: twGameLog.details,
          })
          .from(twGameLog)
          .where(and(
            inArray(twGameLog.userId, playerIds),
            eq(twGameLog.action, "combat")
          ));

        for (const log of combatLogs) {
          if (!combatStats[log.userId]) combatStats[log.userId] = { wins: 0, losses: 0 };
          const d = log.details as any;
          if (d?.won) combatStats[log.userId].wins++;
          else combatStats[log.userId].losses++;
        }
      }

      const results = players.map((p, i) => {
        const discovered = (p.discoveredSectors as number[]) || [];
        const planets = (p.ownedPlanets as number[]) || [];
        const combat = combatStats[p.userId] || { wins: 0, losses: 0 };
        return {
          rank: i + 1,
          userId: p.userId,
          name: p.userName || `Operative ${p.userId}`,
          credits: p.credits,
          experience: p.experience,
          shipType: p.shipType,
          shipName: SHIPS[p.shipType]?.name || "Unknown",
          alignment: p.alignment,
          sectorsDiscovered: discovered.length,
          planetsOwned: planets.length,
          fighters: p.fighters,
          combatWins: combat.wins,
          combatLosses: combat.losses,
        };
      });

      // Re-sort by sectors or combat if needed
      if (sortBy === "sectors") {
        results.sort((a, b) => b.sectorsDiscovered - a.sectorsDiscovered);
        results.forEach((r, i) => r.rank = i + 1);
      } else if (sortBy === "combat") {
        results.sort((a, b) => b.combatWins - a.combatWins);
        results.forEach((r, i) => r.rank = i + 1);
      }

      return results;
    }),

  // ═══════════════════════════════════════════════════════
  // PLANET COLONIZATION
  // ═══════════════════════════════════════════════════════

  // Claim a planet in current sector
  claimPlanet: protectedProcedure
    .input(z.object({
      planetName: z.string().min(1).max(256),
      colonyType: z.enum(["mining", "agriculture", "technology", "military", "trading"]).default("mining"),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, message: "Database unavailable" };

      const player = await getOrCreatePlayer(db, ctx.user.id);
      if (player.turnsRemaining <= 0) return { success: false, message: "No turns remaining!" };

      // Must be at a planet sector
      const sectorRows = await db.select().from(twSectors)
        .where(eq(twSectors.sectorId, player.currentSector)).limit(1);
      if (sectorRows.length === 0) return { success: false, message: "Sector not found" };

      if (sectorRows[0].sectorType !== "planet") {
        return { success: false, message: "No planet in this sector to colonize" };
      }

      // Check if already colonized by this user
      const existingColony = await db.select().from(twColonies)
        .where(and(eq(twColonies.userId, ctx.user.id), eq(twColonies.sectorId, player.currentSector)))
        .limit(1);
      if (existingColony.length > 0) {
        return { success: false, message: "You already have a colony on this planet" };
      }

      // Check if another player owns it
      const otherColony = await db.select().from(twColonies)
        .where(eq(twColonies.sectorId, player.currentSector))
        .limit(1);
      if (otherColony.length > 0) {
        return { success: false, message: "This planet is already claimed by another operative" };
      }

      // Cost to colonize
      const colonizeCost = 10000;
      if (player.credits < colonizeCost) {
        return { success: false, message: `Colonization requires ${colonizeCost} credits. You have ${player.credits}.` };
      }

      // Create colony
      await db.insert(twColonies).values({
        userId: ctx.user.id,
        sectorId: player.currentSector,
        planetName: input.planetName,
        colonyType: input.colonyType,
        level: 1,
        population: 100,
        defense: 0,
        pendingCredits: 0,
        pendingFuelOre: 0,
        pendingOrganics: 0,
        pendingEquipment: 0,
        cardBonuses: [],
      });

      // Update player
      const planets = (player.ownedPlanets as number[]) || [];
      planets.push(player.currentSector);

      await db.update(twPlayerState).set({
        credits: player.credits - colonizeCost,
        turnsRemaining: player.turnsRemaining - 1,
        ownedPlanets: planets,
        experience: player.experience + 50,
      }).where(eq(twPlayerState.userId, ctx.user.id));

      await logAction(db, ctx.user.id, "colonize", {
        sectorId: player.currentSector,
        planetName: input.planetName,
        colonyType: input.colonyType,
      }, player.currentSector);

      return {
        success: true,
        message: `Colony "${input.planetName}" established! Type: ${input.colonyType}. Population: 100. +50 XP`,
        colony: { planetName: input.planetName, colonyType: input.colonyType, level: 1, population: 100 },
      };
    }),

  // Get all player colonies
  getColonies: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const colonies = await db.select().from(twColonies)
      .where(eq(twColonies.userId, ctx.user.id))
      .orderBy(desc(twColonies.level));

    // Calculate pending income for each colony
    const now = Date.now();
    return colonies.map(c => {
      const lastCollected = new Date(c.lastCollected).getTime();
      const hoursSince = Math.floor((now - lastCollected) / (1000 * 60 * 60));
      const baseIncome = getColonyIncome(c.colonyType as string, c.level, c.population);

      return {
        ...c,
        hoursSinceCollection: hoursSince,
        projectedCredits: c.pendingCredits + baseIncome.credits * hoursSince,
        projectedFuelOre: c.pendingFuelOre + baseIncome.fuelOre * hoursSince,
        projectedOrganics: c.pendingOrganics + baseIncome.organics * hoursSince,
        projectedEquipment: c.pendingEquipment + baseIncome.equipment * hoursSince,
        baseIncome,
      };
    });
  }),

  // Collect income from all colonies
  collectIncome: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { success: false, message: "Database unavailable" };

    const colonies = await db.select().from(twColonies)
      .where(eq(twColonies.userId, ctx.user.id));

    if (colonies.length === 0) return { success: false, message: "No colonies to collect from" };

    const now = Date.now();
    let totalCredits = 0;
    let totalFuelOre = 0;
    let totalOrganics = 0;
    let totalEquipment = 0;

    for (const colony of colonies) {
      const lastCollected = new Date(colony.lastCollected).getTime();
      const hoursSince = Math.floor((now - lastCollected) / (1000 * 60 * 60));
      if (hoursSince < 1) continue;

      const income = getColonyIncome(colony.colonyType as string, colony.level, colony.population);
      const credits = colony.pendingCredits + income.credits * hoursSince;
      const fuelOre = colony.pendingFuelOre + income.fuelOre * hoursSince;
      const organics = colony.pendingOrganics + income.organics * hoursSince;
      const equipment = colony.pendingEquipment + income.equipment * hoursSince;

      totalCredits += credits;
      totalFuelOre += fuelOre;
      totalOrganics += organics;
      totalEquipment += equipment;

      // Grow population slightly
      const popGrowth = Math.floor(colony.population * 0.02 * hoursSince);

      await db.update(twColonies).set({
        pendingCredits: 0,
        pendingFuelOre: 0,
        pendingOrganics: 0,
        pendingEquipment: 0,
        lastCollected: new Date(),
        population: colony.population + popGrowth,
      }).where(eq(twColonies.id, colony.id));
    }

    // Add resources to player
    const player = await getOrCreatePlayer(db, ctx.user.id);
    const cargoUsed = getCargoUsed(player);
    const freeHolds = player.holds - cargoUsed;
    const totalGoods = totalFuelOre + totalOrganics + totalEquipment;
    const scale = totalGoods > freeHolds && totalGoods > 0 ? freeHolds / totalGoods : 1;

    await db.update(twPlayerState).set({
      credits: player.credits + totalCredits,
      fuelOre: player.fuelOre + Math.floor(totalFuelOre * scale),
      organics: player.organics + Math.floor(totalOrganics * scale),
      equipment: player.equipment + Math.floor(totalEquipment * scale),
      experience: player.experience + 10,
    }).where(eq(twPlayerState.userId, ctx.user.id));

    await logAction(db, ctx.user.id, "collect_income", {
      credits: totalCredits,
      fuelOre: Math.floor(totalFuelOre * scale),
      organics: Math.floor(totalOrganics * scale),
      equipment: Math.floor(totalEquipment * scale),
      colonies: colonies.length,
    });

    return {
      success: true,
      message: `Collected from ${colonies.length} colonies: +${totalCredits} credits` +
        (totalFuelOre > 0 ? `, +${Math.floor(totalFuelOre * scale)} fuel ore` : "") +
        (totalOrganics > 0 ? `, +${Math.floor(totalOrganics * scale)} organics` : "") +
        (totalEquipment > 0 ? `, +${Math.floor(totalEquipment * scale)} equipment` : ""),
      totalCredits,
      totalFuelOre: Math.floor(totalFuelOre * scale),
      totalOrganics: Math.floor(totalOrganics * scale),
      totalEquipment: Math.floor(totalEquipment * scale),
    };
  }),

  // Upgrade a colony
  upgradeColony: protectedProcedure
    .input(z.object({ colonyId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, message: "Database unavailable" };

      const colony = await db.select().from(twColonies)
        .where(and(eq(twColonies.id, input.colonyId), eq(twColonies.userId, ctx.user.id)))
        .limit(1);
      if (colony.length === 0) return { success: false, message: "Colony not found" };

      if (colony[0].level >= 5) return { success: false, message: "Colony already at maximum level (5)" };

      const upgradeCosts = [0, 15000, 35000, 75000, 150000]; // Cost for levels 2-5
      const cost = upgradeCosts[colony[0].level] || 50000;

      const player = await getOrCreatePlayer(db, ctx.user.id);
      if (player.credits < cost) {
        return { success: false, message: `Upgrade costs ${cost} credits. You have ${player.credits}.` };
      }

      await db.update(twColonies).set({
        level: colony[0].level + 1,
      }).where(eq(twColonies.id, input.colonyId));

      await db.update(twPlayerState).set({
        credits: player.credits - cost,
        experience: player.experience + 25 * colony[0].level,
      }).where(eq(twPlayerState.userId, ctx.user.id));

      await logAction(db, ctx.user.id, "upgrade_colony", {
        colonyId: input.colonyId,
        newLevel: colony[0].level + 1,
        cost,
      });

      return {
        success: true,
        message: `Colony upgraded to Level ${colony[0].level + 1}! Income increased.`,
        newLevel: colony[0].level + 1,
      };
    }),

  // Fortify colony (add defense)
  fortifyColony: protectedProcedure
    .input(z.object({ colonyId: z.number(), fighters: z.number().min(1).max(500) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, message: "Database unavailable" };

      const colony = await db.select().from(twColonies)
        .where(and(eq(twColonies.id, input.colonyId), eq(twColonies.userId, ctx.user.id)))
        .limit(1);
      if (colony.length === 0) return { success: false, message: "Colony not found" };

      const player = await getOrCreatePlayer(db, ctx.user.id);
      if (player.fighters < input.fighters) {
        return { success: false, message: `Not enough fighters. You have ${player.fighters}.` };
      }

      await db.update(twColonies).set({
        defense: colony[0].defense + input.fighters,
      }).where(eq(twColonies.id, input.colonyId));

      await db.update(twPlayerState).set({
        fighters: player.fighters - input.fighters,
      }).where(eq(twPlayerState.userId, ctx.user.id));

      return {
        success: true,
        message: `Deployed ${input.fighters} fighters to colony. Total defense: ${colony[0].defense + input.fighters}`,
        newDefense: colony[0].defense + input.fighters,
      };
    }),

  // ═══════════════════════════════════════════════════════
  // SHIP EXPANSION SYSTEM
  // ═══════════════════════════════════════════════════════

  getShipUpgrades: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("DB unavailable");
    const upgrades = await db.select().from(shipUpgrades).where(eq(shipUpgrades.userId, ctx.user.id));
    return upgrades;
  }),

  upgradeShipModule: protectedProcedure
    .input(z.object({ upgradeType: z.enum(["hull", "engine", "weapons", "shields", "cargo", "scanner"]) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const player = await getOrCreatePlayer(db, ctx.user.id);

      const UPGRADE_COSTS: Record<string, number[]> = {
        hull: [5000, 12000, 25000, 50000, 100000, 200000, 400000, 750000, 1500000, 3000000],
        engine: [3000, 8000, 18000, 35000, 70000, 140000, 280000, 550000, 1100000, 2200000],
        weapons: [4000, 10000, 22000, 45000, 90000, 180000, 360000, 700000, 1400000, 2800000],
        shields: [4000, 10000, 22000, 45000, 90000, 180000, 360000, 700000, 1400000, 2800000],
        cargo: [3000, 8000, 18000, 35000, 70000, 140000, 280000, 550000, 1100000, 2200000],
        scanner: [2000, 5000, 12000, 25000, 50000, 100000, 200000, 400000, 800000, 1600000],
      };

      const UPGRADE_BONUSES: Record<string, string[]> = {
        hull: ["+50 shields", "+100 shields", "+200 shields", "+400 shields", "+800 shields", "+1500 shields", "+3000 shields", "+5000 shields", "+8000 shields", "+15000 shields"],
        engine: ["+1 speed", "+1 speed", "+2 speed", "+2 speed", "+3 speed", "+3 speed", "+4 speed", "+5 speed", "+6 speed", "+8 speed"],
        weapons: ["+10 fighters", "+25 fighters", "+50 fighters", "+100 fighters", "+200 fighters", "+400 fighters", "+800 fighters", "+1500 fighters", "+3000 fighters", "+5000 fighters"],
        shields: ["+25% regen", "+50% regen", "+75% regen", "+100% regen", "+150% regen", "+200% regen", "+300% regen", "+400% regen", "+500% regen", "+750% regen"],
        cargo: ["+10 holds", "+25 holds", "+50 holds", "+100 holds", "+200 holds", "+400 holds", "+800 holds", "+1500 holds", "+3000 holds", "+5000 holds"],
        scanner: ["+1 range", "+2 range", "+3 range", "+5 range", "+7 range", "+10 range", "+15 range", "+20 range", "+30 range", "+50 range"],
      };

      // Check current level
      const existing = await db.select().from(shipUpgrades)
        .where(and(eq(shipUpgrades.userId, ctx.user.id), eq(shipUpgrades.upgradeType, input.upgradeType)))
        .limit(1);

      const currentLevel = existing.length > 0 ? existing[0].level : 0;
      if (currentLevel >= 10) {
        return { success: false, message: `${input.upgradeType} is already at maximum level (10).` };
      }

      const cost = UPGRADE_COSTS[input.upgradeType][currentLevel];
      if (player.credits < cost) {
        return { success: false, message: `Not enough credits. Need ${cost.toLocaleString()}, have ${player.credits.toLocaleString()}.` };
      }

      // Deduct credits
      await db.update(twPlayerState).set({ credits: player.credits - cost }).where(eq(twPlayerState.userId, ctx.user.id));

      // Apply upgrade bonuses to player stats
      const bonus = UPGRADE_BONUSES[input.upgradeType][currentLevel];
      const numMatch = bonus.match(/(\d+)/);
      const bonusVal = numMatch ? parseInt(numMatch[1]) : 0;

      if (input.upgradeType === "hull" || input.upgradeType === "shields") {
        await db.update(twPlayerState).set({ shields: player.shields + bonusVal }).where(eq(twPlayerState.userId, ctx.user.id));
      } else if (input.upgradeType === "weapons") {
        await db.update(twPlayerState).set({ fighters: player.fighters + bonusVal }).where(eq(twPlayerState.userId, ctx.user.id));
      } else if (input.upgradeType === "cargo") {
        await db.update(twPlayerState).set({ holds: player.holds + bonusVal }).where(eq(twPlayerState.userId, ctx.user.id));
      }

      if (existing.length > 0) {
        await db.update(shipUpgrades).set({ level: currentLevel + 1 }).where(eq(shipUpgrades.id, existing[0].id));
      } else {
        await db.insert(shipUpgrades).values({ userId: ctx.user.id, upgradeType: input.upgradeType, level: 1 });
      }

      await logAction(db, ctx.user.id, "ship_upgrade", { type: input.upgradeType, level: currentLevel + 1, cost });

      return {
        success: true,
        message: `Upgraded ${input.upgradeType} to level ${currentLevel + 1}! Bonus: ${bonus}. Cost: ${cost.toLocaleString()} credits.`,
        newLevel: currentLevel + 1,
        bonus,
      };
    }),

  // ═══════════════════════════════════════════════════════
  // BASE BUILDING SYSTEM (THE FOUNDATION)
  // ═══════════════════════════════════════════════════════

  getMyBase: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("DB unavailable");
    const base = await db.select().from(playerBases).where(eq(playerBases.userId, ctx.user.id)).limit(1);
    return base.length > 0 ? base[0] : null;
  }),

  buildBase: protectedProcedure
    .input(z.object({ sectorId: z.number(), baseName: z.string().min(1).max(64).optional() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const player = await getOrCreatePlayer(db, ctx.user.id);

      // Check if player already has a base
      const existingBase = await db.select().from(playerBases).where(eq(playerBases.userId, ctx.user.id)).limit(1);
      if (existingBase.length > 0) {
        return { success: false, message: "You already have a base. Upgrade it instead." };
      }

      // Must be at the sector
      if (player.currentSector !== input.sectorId) {
        return { success: false, message: "You must be at the sector to build a base." };
      }

      const BUILD_COST = 50000;
      if (player.credits < BUILD_COST) {
        return { success: false, message: `Need ${BUILD_COST.toLocaleString()} credits to build a base. You have ${player.credits.toLocaleString()}.` };
      }

      await db.update(twPlayerState).set({ credits: player.credits - BUILD_COST }).where(eq(twPlayerState.userId, ctx.user.id));

      await db.insert(playerBases).values({
        userId: ctx.user.id,
        baseName: input.baseName || "Outpost Alpha",
        sectorId: input.sectorId,
        level: 1,
        storageCapacity: 100,
        defenseRating: 10,
        productionBonus: 0,
      });

      await logAction(db, ctx.user.id, "base_built", { baseName: input.baseName || "Outpost Alpha", sectorId: input.sectorId });

      return {
        success: true,
        message: `Base '${input.baseName || "Outpost Alpha"}' established at sector ${input.sectorId}! Cost: ${BUILD_COST.toLocaleString()} credits.`,
      };
    }),

  upgradeBase: protectedProcedure
    .input(z.object({ upgradeType: z.enum(["storage", "defense", "production"]) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const player = await getOrCreatePlayer(db, ctx.user.id);

      const base = await db.select().from(playerBases).where(eq(playerBases.userId, ctx.user.id)).limit(1);
      if (base.length === 0) {
        return { success: false, message: "You don't have a base yet. Build one first." };
      }

      const b = base[0];
      const UPGRADE_COSTS: Record<string, number> = {
        storage: 10000 * b.level,
        defense: 15000 * b.level,
        production: 20000 * b.level,
      };

      const cost = UPGRADE_COSTS[input.upgradeType];
      if (player.credits < cost) {
        return { success: false, message: `Need ${cost.toLocaleString()} credits. You have ${player.credits.toLocaleString()}.` };
      }

      await db.update(twPlayerState).set({ credits: player.credits - cost }).where(eq(twPlayerState.userId, ctx.user.id));

      const updates: any = {};
      let bonusDesc = "";
      if (input.upgradeType === "storage") {
        updates.storageCapacity = b.storageCapacity + 50;
        bonusDesc = `Storage capacity increased to ${b.storageCapacity + 50}`;
      } else if (input.upgradeType === "defense") {
        updates.defenseRating = b.defenseRating + 15;
        bonusDesc = `Defense rating increased to ${b.defenseRating + 15}`;
      } else if (input.upgradeType === "production") {
        updates.productionBonus = b.productionBonus + 5;
        bonusDesc = `Production bonus increased to ${b.productionBonus + 5}%`;
      }

      await db.update(playerBases).set(updates).where(eq(playerBases.id, b.id));
      await logAction(db, ctx.user.id, "base_upgrade", { type: input.upgradeType, desc: bonusDesc });

      return {
        success: true,
        message: `${bonusDesc}. Cost: ${cost.toLocaleString()} credits.`,
      };
    }),

  // ═══ TRADE EMPIRE NARRATIVE PROCEDURES ═══

  // Choose faction (during tutorial)
  chooseFaction: protectedProcedure
    .input(z.object({ faction: z.enum(["empire", "insurgency"]) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, message: "Database unavailable" };
      const player = await getOrCreatePlayer(db, ctx.user.id);
      if (player.faction) {
        return { success: false, message: "Faction already chosen. Your allegiance is sealed." };
      }
      await db.update(twPlayerState)
        .set({ faction: input.faction, alignment: input.faction === "empire" ? 10 : -10 })
        .where(eq(twPlayerState.userId, ctx.user.id));
      return {
        success: true,
        faction: input.faction,
        message: input.faction === "empire"
          ? "You have sworn loyalty to the Architect's Empire. The galaxy will be rebuilt under Order."
          : "You have joined the Insurgency. The Dreamer's vision of freedom will prevail.",
      };
    }),

  // Advance tutorial step
  advanceTutorial: protectedProcedure
    .input(z.object({ step: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, message: "Database unavailable" };
      await db.update(twPlayerState)
        .set({ tutorialStep: input.step })
        .where(eq(twPlayerState.userId, ctx.user.id));
      return { success: true, step: input.step };
    }),

  // Discover a pre-Fall relic
  discoverRelic: protectedProcedure
    .input(z.object({ relicId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, message: "Database unavailable" };
      const player = await getOrCreatePlayer(db, ctx.user.id);
      const relics = (player.discoveredRelics as string[]) || [];
      if (relics.includes(input.relicId)) {
        return { success: false, message: "Relic already catalogued in your archive." };
      }
      relics.push(input.relicId);
      const rpBonus = 50;
      await db.update(twPlayerState)
        .set({ discoveredRelics: relics, researchPoints: player.researchPoints + rpBonus })
        .where(eq(twPlayerState.userId, ctx.user.id));
      return {
        success: true,
        message: `Pre-Fall relic discovered: ${input.relicId}. +${rpBonus} Research Points.`,
        totalRelics: relics.length,
        researchPoints: player.researchPoints + rpBonus,
      };
    }),

  // Research technology (Civ-style tech tree)
  research: protectedProcedure
    .input(z.object({ techId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, message: "Database unavailable" };
      const player = await getOrCreatePlayer(db, ctx.user.id);
      const techs = (player.unlockedTech as string[]) || [];
      if (techs.includes(input.techId)) {
        return { success: false, message: "Technology already researched." };
      }
      const TECH_TREE: Record<string, { cost: number; name: string; prereqs: string[]; effect: string }> = {
        "nav-1": { cost: 25, name: "Improved Navigation", prereqs: [], effect: "+1 warp range" },
        "nav-2": { cost: 75, name: "Hyperspace Mapping", prereqs: ["nav-1"], effect: "+2 warp range, reveal adjacent sectors" },
        "trade-1": { cost: 25, name: "Trade Protocols", prereqs: [], effect: "+10% trade profits" },
        "trade-2": { cost: 75, name: "Market Analysis", prereqs: ["trade-1"], effect: "+25% trade profits, port price prediction" },
        "combat-1": { cost: 30, name: "Tactical Systems", prereqs: [], effect: "+10% combat power" },
        "combat-2": { cost: 100, name: "Advanced Weaponry", prereqs: ["combat-1"], effect: "+25% combat power, shield bypass" },
        "mining-1": { cost: 20, name: "Mining Drones", prereqs: [], effect: "+50% mining yield" },
        "mining-2": { cost: 60, name: "Deep Core Extraction", prereqs: ["mining-1"], effect: "+100% mining yield, rare materials" },
        "colony-1": { cost: 40, name: "Colony Infrastructure", prereqs: [], effect: "+25% colony income" },
        "colony-2": { cost: 120, name: "Megastructures", prereqs: ["colony-1"], effect: "+50% colony income, max level 7" },
        "relic-1": { cost: 50, name: "Relic Analysis", prereqs: [], effect: "Identify relic locations on scan" },
        "relic-2": { cost: 150, name: "Pre-Fall Archaeology", prereqs: ["relic-1"], effect: "Double relic research points" },
        "diplo-1": { cost: 35, name: "First Contact Protocols", prereqs: [], effect: "Unlock alien faction encounters" },
        "diplo-2": { cost: 100, name: "Galactic Diplomacy", prereqs: ["diplo-1"], effect: "Trade with alien factions, alliance options" },
      };
      const tech = TECH_TREE[input.techId];
      if (!tech) return { success: false, message: "Unknown technology." };
      // Check prereqs
      for (const prereq of tech.prereqs) {
        if (!techs.includes(prereq)) {
          return { success: false, message: `Prerequisite not met: ${TECH_TREE[prereq]?.name || prereq}` };
        }
      }
      if (player.researchPoints < tech.cost) {
        return { success: false, message: `Not enough Research Points. Need ${tech.cost}, have ${player.researchPoints}.` };
      }
      techs.push(input.techId);
      await db.update(twPlayerState)
        .set({ unlockedTech: techs, researchPoints: player.researchPoints - tech.cost })
        .where(eq(twPlayerState.userId, ctx.user.id));
      return {
        success: true,
        message: `Technology unlocked: ${tech.name}. Effect: ${tech.effect}`,
        researchPoints: player.researchPoints - tech.cost,
        unlockedTech: techs,
      };
    }),

  depositResources: protectedProcedure
    .input(z.object({ resource: z.enum(["ore", "organics", "equipment"]), amount: z.number().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const player = await getOrCreatePlayer(db, ctx.user.id);

      const base = await db.select().from(playerBases).where(eq(playerBases.userId, ctx.user.id)).limit(1);
      if (base.length === 0) {
        return { success: false, message: "You don't have a base." };
      }

      const b = base[0];
      const totalStored = b.storedOre + b.storedOrganics + b.storedEquipment + b.storedDream;
      if (totalStored + input.amount > b.storageCapacity) {
        return { success: false, message: `Not enough storage. Capacity: ${b.storageCapacity}, used: ${totalStored}.` };
      }

      const playerResource = input.resource === "ore" ? player.fuelOre :
        input.resource === "organics" ? player.organics : player.equipment;
      if (playerResource < input.amount) {
        return { success: false, message: `Not enough ${input.resource}. You have ${playerResource}.` };
      }

      // Deduct from player
      const playerUpdate: any = {};
      if (input.resource === "ore") playerUpdate.fuelOre = player.fuelOre - input.amount;
      else if (input.resource === "organics") playerUpdate.organics = player.organics - input.amount;
      else playerUpdate.equipment = player.equipment - input.amount;
      await db.update(twPlayerState).set(playerUpdate).where(eq(twPlayerState.userId, ctx.user.id));

      // Add to base
      const baseUpdate: any = {};
      if (input.resource === "ore") baseUpdate.storedOre = b.storedOre + input.amount;
      else if (input.resource === "organics") baseUpdate.storedOrganics = b.storedOrganics + input.amount;
      else baseUpdate.storedEquipment = b.storedEquipment + input.amount;
      await db.update(playerBases).set(baseUpdate).where(eq(playerBases.id, b.id));

      return {
        success: true,
        message: `Deposited ${input.amount} ${input.resource} to base. Storage: ${totalStored + input.amount}/${b.storageCapacity}`,
      };
    }),

  // ═══════════════════════════════════════════════════════
  // GALAXY TERRITORIES — Multiplayer map overlay
  // ═══════════════════════════════════════════════════════

  getGalaxyTerritories: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { players: [], colonies: [], bases: [] };

    // Get all active players with their positions and factions
    const players = await db
      .select({
        userId: twPlayerState.userId,
        userName: users.name,
        currentSector: twPlayerState.currentSector,
        faction: twPlayerState.faction,
        shipType: twPlayerState.shipType,
        credits: twPlayerState.credits,
        experience: twPlayerState.experience,
        alignment: twPlayerState.alignment,
        ownedPlanets: twPlayerState.ownedPlanets,
      })
      .from(twPlayerState)
      .innerJoin(users, eq(twPlayerState.userId, users.id))
      .orderBy(desc(twPlayerState.experience))
      .limit(50);

    // Get all colonies with owner info
    const colonies = await db
      .select({
        id: twColonies.id,
        userId: twColonies.userId,
        sectorId: twColonies.sectorId,
        planetName: twColonies.planetName,
        level: twColonies.level,
        colonyType: twColonies.colonyType,
        defense: twColonies.defense,
        population: twColonies.population,
      })
      .from(twColonies)
      .orderBy(desc(twColonies.level));

    // Get all bases
    const bases = await db
      .select({
        id: playerBases.id,
        userId: playerBases.userId,
        sectorId: playerBases.sectorId,
        baseName: playerBases.baseName,
        level: playerBases.level,
      })
      .from(playerBases)
      .orderBy(desc(playerBases.level));

    // Build player name lookup
    const playerMap = new Map(players.map(p => [p.userId, p]));

    return {
      players: players.map(p => ({
        userId: p.userId,
        name: p.userName || `Operative ${p.userId}`,
        sector: p.currentSector,
        faction: p.faction,
        ship: SHIPS[p.shipType]?.name || "Scout",
        credits: p.credits,
        xp: p.experience,
        alignment: p.alignment,
        planets: ((p.ownedPlanets as number[]) || []).length,
      })),
      colonies: colonies.map(c => ({
        id: c.id,
        sectorId: c.sectorId,
        name: c.planetName,
        owner: playerMap.get(c.userId)?.userName || `Operative ${c.userId}`,
        ownerFaction: playerMap.get(c.userId)?.faction || "unaligned",
        level: c.level,
        type: c.colonyType,
        defense: c.defense,
        population: c.population,
      })),
      bases: bases.map(b => ({
        id: b.id,
        sectorId: b.sectorId,
        name: b.baseName,
        owner: playerMap.get(b.userId)?.userName || `Operative ${b.userId}`,
        ownerFaction: playerMap.get(b.userId)?.faction || "unaligned",
        level: b.level,
      })),
    };
  }),
});
