import { logger } from "../logger";
import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { citizenCharacters, dreamBalance, linkedWallets, nftMetadataCache } from "../../drizzle/schema";
import { eq, and, inArray, between } from "drizzle-orm";
import { ethers } from "ethers";

/* ─── Ne-Yon Constants ─── */
const NEYON_TOKEN_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
const POTENTIALS_CONTRACT = "0x54a4413AF2009b9110a268e49e21F0C8e4D87890";
const POTENTIALS_ABI = [
  "function ownerOf(uint256 tokenId) view returns (address)",
];
const ETH_RPC = "https://eth.llamarpc.com";

/* ═══════════════════════════════════════════════════
   Species / Class / Element configuration
   ═══════════════════════════════════════════════════ */

const SPECIES_CONFIG = {
  demagi: {
    name: "DeMagi",
    description: "Superhuman abilities from genetic alterations. Mastery over the elements. Ancient arcane arts unlocked through mutation.",
    bonusHp: 20,
    bonusArmor: 0,
    elements: ["earth", "fire", "water", "air"] as const,
    elementLabel: "Element",
  },
  quarchon: {
    name: "Quarchon",
    description: "Rebels, misfits, machines. Cold, calculating, cynical. Vast artificial intelligence to calculate probabilities and engineer realities.",
    bonusHp: 0,
    bonusArmor: 5,
    elements: ["space", "time", "probability", "reality"] as const,
    elementLabel: "Dimension",
  },
  neyon: {
    name: "Ne-Yon",
    description: "Perfect hybrid of organic life and AI. Origin shrouded in blood and mystery. Successfully fought the Architect to a standstill.",
    bonusHp: 20,
    bonusArmor: 5,
    elements: ["earth", "fire", "water", "air", "space", "time", "probability", "reality"] as const,
    elementLabel: "Element/Dimension",
  },
} as const;

const CLASS_CONFIG = {
  engineer: {
    name: "Engineer",
    description: "Master builders and craftsmen. Start with Diamond Pick Axes.",
    startingGear: { weapon: "diamond_pick_axe", secondary: "repair_kit", consumable: "shield_generator" },
  },
  oracle: {
    name: "Oracle (Prophet)",
    description: "Seers of fate. Start with potions of random powers and a crossbow.",
    startingGear: { weapon: "crossbow", secondary: "invisibility_potion", consumable: "random_power_potion" },
  },
  assassin: {
    name: "Assassin (Virus)",
    description: "Silent killers. Start with poison, potions, and ranged weapons.",
    startingGear: { weapon: "poison_blade", secondary: "throwing_knives", consumable: "smoke_bomb" },
  },
  soldier: {
    name: "Soldier (Warrior/Drone)",
    description: "Frontline fighters. Start with sword and shield.",
    startingGear: { weapon: "plasma_sword", secondary: "energy_shield", consumable: "stim_pack" },
  },
  spy: {
    name: "Spy",
    description: "Intelligence operatives. Stealth and deception specialists.",
    startingGear: { weapon: "silenced_pistol", secondary: "cloaking_device", consumable: "emp_grenade" },
  },
} as const;

const ELEMENT_CONFIG = {
  earth: { name: "Earth", ability: "Temp Haste", description: "Stable, trusting, peaceful. Grants temporary speed boost in combat." },
  fire: { name: "Fire", ability: "Fire Immunity", description: "Passionate, fierce. Immune to fire and lava damage." },
  water: { name: "Water", ability: "Breathe Underwater", description: "Flowing, adaptable. Can breathe underwater and resist water hazards." },
  air: { name: "Air", ability: "Temp Fly", description: "Free-spirited, unpredictable. Grants temporary flight in combat." },
  space: { name: "Space", ability: "Temp Haste", description: "Keen spatial awareness. Grants temporary speed boost through spatial manipulation." },
  time: { name: "Time", ability: "Breathe Underwater", description: "Temporal mastery. Can slow time to breathe in any environment." },
  probability: { name: "Probability", ability: "Temp Fly", description: "Probability manipulation. Bends chance to defy gravity temporarily." },
  reality: { name: "Reality", ability: "Fire Immunity", description: "Reality warping. Reshapes local reality to negate fire and lava." },
} as const;

const ALIGNMENT_CONFIG = {
  order: {
    name: "Order",
    description: "Orderly, follows principles. Discipline and regimen. Light glow aura.",
    glowColor: "cyan",
    cardBonus: "attack",
    bonusValue: 2,
  },
  chaos: {
    name: "Chaos",
    description: "Chaotic, goes rogue. Brave decisions, shifting loyalty. Dark glow aura.",
    glowColor: "purple",
    cardBonus: "defense",
    bonusValue: 2,
  },
} as const;

/** Calculate derived stats from attributes + species */
function calculateDerivedStats(
  species: keyof typeof SPECIES_CONFIG,
  attrAttack: number,
  attrDefense: number,
  attrVitality: number
) {
  const speciesData = SPECIES_CONFIG[species];
  const baseHp = 80 + attrVitality * 10 + speciesData.bonusHp;
  const baseArmor = attrDefense * 2 + speciesData.bonusArmor;
  return { maxHp: baseHp, armor: baseArmor };
}

/** Get starting gear for a class */
function getStartingGear(characterClass: keyof typeof CLASS_CONFIG) {
  return CLASS_CONFIG[characterClass].startingGear;
}

export const citizenRouter = router({
  /** Get configuration data for character creation UI */
  getConfig: protectedProcedure.query(() => {
    return {
      species: SPECIES_CONFIG,
      classes: CLASS_CONFIG,
      elements: ELEMENT_CONFIG,
      alignments: ALIGNMENT_CONFIG,
      pointBudget: 9, // 9 dots to distribute across 3 attributes (start at 1 each, max 5)
    };
  }),

  /** Get the player's citizen character(s) */
  getCharacter: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    const rows = await db
      .select()
      .from(citizenCharacters)
      .where(and(eq(citizenCharacters.userId, ctx.user.id), eq(citizenCharacters.isPrimary, 1)))
      .limit(1);
    if (!rows[0]) return null;
    const char = rows[0];
    const speciesData = SPECIES_CONFIG[char.species as keyof typeof SPECIES_CONFIG];
    const classData = CLASS_CONFIG[char.characterClass as keyof typeof CLASS_CONFIG];
    const elementData = ELEMENT_CONFIG[char.element as keyof typeof ELEMENT_CONFIG];
    const alignmentData = ALIGNMENT_CONFIG[char.alignment as keyof typeof ALIGNMENT_CONFIG];
    return {
      ...char,
      speciesInfo: speciesData,
      classInfo: classData,
      elementInfo: elementData,
      alignmentInfo: alignmentData,
    };
  }),

  /** Create a new citizen character */
  createCharacter: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(64),
        species: z.enum(["demagi", "quarchon", "neyon"]),
        characterClass: z.enum(["engineer", "oracle", "assassin", "soldier", "spy"]),
        alignment: z.enum(["order", "chaos"]),
        element: z.enum(["earth", "fire", "water", "air", "space", "time", "probability", "reality"]),
        attrAttack: z.number().min(1).max(5),
        attrDefense: z.number().min(1).max(5),
        attrVitality: z.number().min(1).max(5),
        /** Required if species=neyon: which specific Ne-Yon token ID (1-10) */
        neyonTokenId: z.number().min(1).max(10).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      // Check if user already has a primary citizen
      const existing = await db
        .select()
        .from(citizenCharacters)
        .where(and(eq(citizenCharacters.userId, ctx.user.id), eq(citizenCharacters.isPrimary, 1)))
        .limit(1);
      if (existing.length > 0) {
        throw new Error("You already have a Citizen. Use the character sheet to modify.");
      }

      // Validate dot budget: 9 total dots, each attribute 1-5
      const totalDots = input.attrAttack + input.attrDefense + input.attrVitality;
      if (totalDots !== 9) {
        throw new Error(`Attribute dots must total 9. You allocated ${totalDots}.`);
      }

      // ═══ Ne-Yon NFT GATE ═══
      // Only verified owners of Potentials #1-10 can create a Ne-Yon citizen
      let verifiedNeyonTokenId: number | null = null;
      if (input.species === "neyon") {
        if (!input.neyonTokenId || !NEYON_TOKEN_IDS.includes(input.neyonTokenId as any)) {
          throw new Error("Ne-Yon species requires ownership of Potentials NFT #1-10. Provide a valid neyonTokenId.");
        }

        // Check if this specific Ne-Yon is already claimed by another citizen
        const existingNeyon = await db
          .select()
          .from(citizenCharacters)
          .where(eq(citizenCharacters.neyonTokenId, input.neyonTokenId))
          .limit(1);
        if (existingNeyon.length > 0) {
          throw new Error(`Ne-Yon #${input.neyonTokenId} is already bound to another citizen. Each Ne-Yon is a unique 1/1.`);
        }

        // Verify the user has a linked wallet that owns this specific token
        const userWallets = await db
          .select()
          .from(linkedWallets)
          .where(eq(linkedWallets.userId, ctx.user.id));

        if (userWallets.length === 0) {
          throw new Error("You must link a wallet that owns Potentials NFT #1-10 to create a Ne-Yon citizen.");
        }

        // Verify on-chain ownership
        let ownerVerified = false;
        try {
          const provider = new ethers.JsonRpcProvider(ETH_RPC);
          const contract = new ethers.Contract(POTENTIALS_CONTRACT, POTENTIALS_ABI, provider);
          const onChainOwner = ethers.getAddress(await contract.ownerOf(input.neyonTokenId));
          const userWalletAddresses = userWallets.map(w => ethers.getAddress(w.walletAddress));
          ownerVerified = userWalletAddresses.includes(onChainOwner);
        } catch (err) {
          logger.error("[Citizen] Ne-Yon on-chain verification failed:", err);
          throw new Error("Failed to verify on-chain ownership of Ne-Yon NFT. Please try again.");
        }

        if (!ownerVerified) {
          throw new Error(`Your linked wallet(s) do not own Potentials NFT #${input.neyonTokenId}. Only the current on-chain owner can create this Ne-Yon citizen.`);
        }

        verifiedNeyonTokenId = input.neyonTokenId;
      }

      // Validate element matches species
      const speciesData = SPECIES_CONFIG[input.species];
      if (!(speciesData.elements as readonly string[]).includes(input.element)) {
        throw new Error(`${speciesData.name} cannot use element/dimension: ${input.element}`);
      }

      const { maxHp, armor } = calculateDerivedStats(
        input.species,
        input.attrAttack,
        input.attrDefense,
        input.attrVitality
      );

      const gear = getStartingGear(input.characterClass);

      await db.insert(citizenCharacters).values({
        userId: ctx.user.id,
        name: input.name,
        species: input.species,
        characterClass: input.characterClass,
        alignment: input.alignment,
        element: input.element,
        attrAttack: input.attrAttack,
        attrDefense: input.attrDefense,
        attrVitality: input.attrVitality,
        maxHp,
        armor,
        gear: gear as unknown as Record<string, unknown>,
        abilities: {
          elementAbility: ELEMENT_CONFIG[input.element as keyof typeof ELEMENT_CONFIG].ability,
          elementMastery: 1,
          unlockedAbilities: [],
        },
        neyonTokenId: verifiedNeyonTokenId,
        isPrimary: 1,
      });

      // Initialize Dream balance
      const existingDream = await db
        .select()
        .from(dreamBalance)
        .where(eq(dreamBalance.userId, ctx.user.id))
        .limit(1);
      if (existingDream.length === 0) {
        await db.insert(dreamBalance).values({
          userId: ctx.user.id,
          dreamTokens: 0,
          soulBoundDream: 0,
          dnaCode: 0,
        });
      }

      return { success: true, maxHp, armor, gear };
    }),

  /** Level up class (costs EXP + Dream) */
  levelUpClass: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");

    const chars = await db
      .select()
      .from(citizenCharacters)
      .where(and(eq(citizenCharacters.userId, ctx.user.id), eq(citizenCharacters.isPrimary, 1)))
      .limit(1);
    if (!chars[0]) throw new Error("No citizen found");

    const char = chars[0];
    const dreamRows = await db
      .select()
      .from(dreamBalance)
      .where(eq(dreamBalance.userId, ctx.user.id))
      .limit(1);
    if (!dreamRows[0]) throw new Error("No Dream balance found");

    const dream = dreamRows[0];
    const requiredXp = char.classLevel * 100;
    const requiredDream = char.classLevel * 5;

    if (char.xp < requiredXp) throw new Error(`Need ${requiredXp} XP (have ${char.xp})`);
    if (dream.dreamTokens < requiredDream) throw new Error(`Need ${requiredDream} Dream (have ${dream.dreamTokens})`);

    await db
      .update(citizenCharacters)
      .set({
        classLevel: char.classLevel + 1,
        xp: char.xp - requiredXp,
      })
      .where(eq(citizenCharacters.id, char.id));

    await db
      .update(dreamBalance)
      .set({ dreamTokens: dream.dreamTokens - requiredDream })
      .where(eq(dreamBalance.userId, ctx.user.id));

    return { success: true, newClassLevel: char.classLevel + 1 };
  }),

  /** Level up an attribute (costs DNA/CODE + Dream) */
  levelUpAttribute: protectedProcedure
    .input(z.object({ attribute: z.enum(["attack", "defense", "vitality"]) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const chars = await db
        .select()
        .from(citizenCharacters)
        .where(and(eq(citizenCharacters.userId, ctx.user.id), eq(citizenCharacters.isPrimary, 1)))
        .limit(1);
      if (!chars[0]) throw new Error("No citizen found");

      const char = chars[0];
      const attrKey = `attr${input.attribute.charAt(0).toUpperCase() + input.attribute.slice(1)}` as
        | "attrAttack"
        | "attrDefense"
        | "attrVitality";
      const currentVal = char[attrKey];
      if (currentVal >= 5) throw new Error("Attribute already at maximum (5)");

      const dreamRows = await db
        .select()
        .from(dreamBalance)
        .where(eq(dreamBalance.userId, ctx.user.id))
        .limit(1);
      if (!dreamRows[0]) throw new Error("No Dream balance found");

      const dream = dreamRows[0];
      const requiredDnaCode = currentVal * 10;
      const requiredDream = currentVal * 3;

      if (dream.dnaCode < requiredDnaCode) throw new Error(`Need ${requiredDnaCode} DNA/CODE (have ${dream.dnaCode})`);
      if (dream.soulBoundDream < requiredDream)
        throw new Error(`Need ${requiredDream} Soul Bound Dream (have ${dream.soulBoundDream})`);

      const newVal = currentVal + 1;
      const { maxHp, armor } = calculateDerivedStats(
        char.species as keyof typeof SPECIES_CONFIG,
        attrKey === "attrAttack" ? newVal : char.attrAttack,
        attrKey === "attrDefense" ? newVal : char.attrDefense,
        attrKey === "attrVitality" ? newVal : char.attrVitality
      );

      await db
        .update(citizenCharacters)
        .set({ [attrKey]: newVal, maxHp, armor })
        .where(eq(citizenCharacters.id, char.id));

      await db
        .update(dreamBalance)
        .set({
          dnaCode: dream.dnaCode - requiredDnaCode,
          soulBoundDream: dream.soulBoundDream - requiredDream,
        })
        .where(eq(dreamBalance.userId, ctx.user.id));

      return { success: true, attribute: input.attribute, newValue: newVal, maxHp, armor };
    }),

  /** Get Dream balance */
  getDreamBalance: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    const rows = await db
      .select()
      .from(dreamBalance)
      .where(eq(dreamBalance.userId, ctx.user.id))
      .limit(1);
    return rows[0] || null;
  }),

  /** Award Dream tokens (called from combat/exploration systems) */
  awardDream: protectedProcedure
    .input(
      z.object({
        dreamTokens: z.number().min(0).default(0),
        soulBoundDream: z.number().min(0).default(0),
        dnaCode: z.number().min(0).default(0),
        xp: z.number().min(0).default(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      // Update dream balance
      const dreamRows = await db
        .select()
        .from(dreamBalance)
        .where(eq(dreamBalance.userId, ctx.user.id))
        .limit(1);

      if (dreamRows.length === 0) {
        await db.insert(dreamBalance).values({
          userId: ctx.user.id,
          dreamTokens: input.dreamTokens,
          soulBoundDream: input.soulBoundDream,
          dnaCode: input.dnaCode,
          totalDreamEarned: input.dreamTokens + input.soulBoundDream,
        });
      } else {
        const d = dreamRows[0];
        await db
          .update(dreamBalance)
          .set({
            dreamTokens: d.dreamTokens + input.dreamTokens,
            soulBoundDream: d.soulBoundDream + input.soulBoundDream,
            dnaCode: d.dnaCode + input.dnaCode,
            totalDreamEarned: d.totalDreamEarned + input.dreamTokens + input.soulBoundDream,
          })
          .where(eq(dreamBalance.userId, ctx.user.id));
      }

      // Award XP to citizen
      if (input.xp > 0) {
        const chars = await db
          .select()
          .from(citizenCharacters)
          .where(and(eq(citizenCharacters.userId, ctx.user.id), eq(citizenCharacters.isPrimary, 1)))
          .limit(1);
        if (chars[0]) {
          const newXp = chars[0].xp + input.xp;
          const newLevel = Math.floor(newXp / 200) + 1;
          await db
            .update(citizenCharacters)
            .set({ xp: newXp, level: Math.max(chars[0].level, newLevel) })
            .where(eq(citizenCharacters.id, chars[0].id));
        }
      }

      return { success: true };
    }),

  /** Update equipped gear (persists slot→itemId mapping) */
  updateGear: protectedProcedure
    .input(
      z.object({
        gear: z.record(z.string(), z.string().nullable()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const chars = await db
        .select()
        .from(citizenCharacters)
        .where(and(eq(citizenCharacters.userId, ctx.user.id), eq(citizenCharacters.isPrimary, 1)))
        .limit(1);
      if (!chars[0]) throw new Error("No citizen found");

      // Filter out null values for clean storage
      const cleanGear: Record<string, string> = {};
      for (const [slot, itemId] of Object.entries(input.gear)) {
        if (itemId) cleanGear[slot] = itemId;
      }

      await db
        .update(citizenCharacters)
        .set({ gear: cleanGear })
        .where(eq(citizenCharacters.id, chars[0].id));

      return { success: true, gear: cleanGear };
    }),

  /**
   * Check which Ne-Yon tokens (1-10) the current user is eligible to claim.
   * Returns: which Ne-Yons the user's wallets own, which are already bound to citizens,
   * and which are available for this user to claim.
   */
  checkNeyonEligibility: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { eligible: false, ownedNeyonIds: [], availableNeyonIds: [], boundNeyonIds: [], walletLinked: false };

    // 1. Get user's linked wallets
    const userWallets = await db
      .select()
      .from(linkedWallets)
      .where(eq(linkedWallets.userId, ctx.user.id));

    if (userWallets.length === 0) {
      return { eligible: false, ownedNeyonIds: [], availableNeyonIds: [], boundNeyonIds: [], walletLinked: false };
    }

    // 2. Check on-chain ownership of tokens 1-10
    const ownedNeyonIds: number[] = [];
    try {
      const provider = new ethers.JsonRpcProvider(ETH_RPC);
      const contract = new ethers.Contract(POTENTIALS_CONTRACT, POTENTIALS_ABI, provider);
      const walletAddresses = userWallets.map(w => ethers.getAddress(w.walletAddress));

      const checks = await Promise.allSettled(
        NEYON_TOKEN_IDS.map(async (tokenId) => {
          const owner = ethers.getAddress(await contract.ownerOf(tokenId));
          if (walletAddresses.includes(owner)) {
            return tokenId;
          }
          return null;
        })
      );

      for (const result of checks) {
        if (result.status === "fulfilled" && result.value !== null) {
          ownedNeyonIds.push(result.value);
        }
      }
    } catch (err) {
      logger.error("[Citizen] Ne-Yon eligibility check failed:", err);
      // Return what we can — wallet is linked but chain check failed
      return { eligible: false, ownedNeyonIds: [], availableNeyonIds: [], boundNeyonIds: [], walletLinked: true, error: "Chain verification temporarily unavailable" };
    }

    if (ownedNeyonIds.length === 0) {
      return { eligible: false, ownedNeyonIds: [], availableNeyonIds: [], boundNeyonIds: [], walletLinked: true };
    }

    // 3. Check which Ne-Yons are already bound to citizens
    const boundCitizens = await db
      .select({ neyonTokenId: citizenCharacters.neyonTokenId, userId: citizenCharacters.userId })
      .from(citizenCharacters)
      .where(inArray(citizenCharacters.neyonTokenId, ownedNeyonIds));

    const boundNeyonIds = boundCitizens.map(c => c.neyonTokenId!).filter(Boolean);
    const availableNeyonIds = ownedNeyonIds.filter(id => !boundNeyonIds.includes(id));

    // 4. Get metadata for owned Ne-Yons (names, images)
    let neyonDetails: Array<{ tokenId: number; name: string | null; imageUrl: string | null; bound: boolean; boundByMe: boolean }> = [];
    if (ownedNeyonIds.length > 0) {
      const metas = await db
        .select()
        .from(nftMetadataCache)
        .where(inArray(nftMetadataCache.tokenId, ownedNeyonIds));

      neyonDetails = ownedNeyonIds.map(tokenId => {
        const meta = metas.find(m => m.tokenId === tokenId);
        const boundCitizen = boundCitizens.find(c => c.neyonTokenId === tokenId);
        return {
          tokenId,
          name: meta?.name || `Ne-Yon #${tokenId}`,
          imageUrl: meta?.imageUrl || null,
          bound: !!boundCitizen,
          boundByMe: boundCitizen?.userId === ctx.user.id,
        };
      });
    }

    return {
      eligible: availableNeyonIds.length > 0,
      ownedNeyonIds,
      availableNeyonIds,
      boundNeyonIds,
      walletLinked: true,
      neyonDetails,
    };
  }),

  /* ═══════════════════════════════════════════════════
     RESPEC SYSTEM — Dream token economy sink
     Players can reassign attribute dots or change alignment/element.
     Cost scales with citizen level to prevent trivial respeccing.
     ═══════════════════════════════════════════════════ */

  /** Get respec costs for the current citizen */
  getRespecCosts: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;

    const chars = await db
      .select()
      .from(citizenCharacters)
      .where(and(eq(citizenCharacters.userId, ctx.user.id), eq(citizenCharacters.isPrimary, 1)))
      .limit(1);
    if (!chars[0]) return null;

    const char = chars[0];
    const dreamRows = await db
      .select()
      .from(dreamBalance)
      .where(eq(dreamBalance.userId, ctx.user.id))
      .limit(1);
    const dream = dreamRows[0];

    // Costs scale with citizen level
    const baseCost = 50;
    const levelMultiplier = Math.max(1, char.level);
    const attributeRespecCost = baseCost * levelMultiplier;
    const alignmentRespecCost = Math.floor(baseCost * 0.6 * levelMultiplier);
    const elementRespecCost = Math.floor(baseCost * 0.4 * levelMultiplier);

    return {
      attributeRespecCost,
      alignmentRespecCost,
      elementRespecCost,
      currentDreamTokens: dream?.dreamTokens ?? 0,
      currentAttributes: {
        attack: char.attrAttack,
        defense: char.attrDefense,
        vitality: char.attrVitality,
      },
      currentAlignment: char.alignment,
      currentElement: char.element,
      species: char.species,
      totalDots: char.attrAttack + char.attrDefense + char.attrVitality,
    };
  }),

  /** Respec attribute dots — redistribute all 3 attributes.
      Costs Dream tokens. Total dots must equal current total (9 at creation). */
  respecAttributes: protectedProcedure
    .input(
      z.object({
        attrAttack: z.number().min(1).max(5),
        attrDefense: z.number().min(1).max(5),
        attrVitality: z.number().min(1).max(5),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const chars = await db
        .select()
        .from(citizenCharacters)
        .where(and(eq(citizenCharacters.userId, ctx.user.id), eq(citizenCharacters.isPrimary, 1)))
        .limit(1);
      if (!chars[0]) throw new Error("No citizen found");

      const char = chars[0];
      const currentTotal = char.attrAttack + char.attrDefense + char.attrVitality;
      const newTotal = input.attrAttack + input.attrDefense + input.attrVitality;

      if (newTotal !== currentTotal) {
        throw new Error(`Attribute dots must total ${currentTotal}. You allocated ${newTotal}.`);
      }

      // Check if anything actually changed
      if (
        char.attrAttack === input.attrAttack &&
        char.attrDefense === input.attrDefense &&
        char.attrVitality === input.attrVitality
      ) {
        throw new Error("No changes detected. Attributes are already set to these values.");
      }

      // Check Dream cost
      const dreamRows = await db
        .select()
        .from(dreamBalance)
        .where(eq(dreamBalance.userId, ctx.user.id))
        .limit(1);
      if (!dreamRows[0]) throw new Error("No Dream balance found");

      const dream = dreamRows[0];
      const baseCost = 50;
      const cost = baseCost * Math.max(1, char.level);

      if (dream.dreamTokens < cost) {
        throw new Error(`Need ${cost} Dream tokens (have ${dream.dreamTokens})`);
      }

      // Recalculate derived stats
      const { maxHp, armor } = calculateDerivedStats(
        char.species as keyof typeof SPECIES_CONFIG,
        input.attrAttack,
        input.attrDefense,
        input.attrVitality
      );

      // Apply respec
      await db
        .update(citizenCharacters)
        .set({
          attrAttack: input.attrAttack,
          attrDefense: input.attrDefense,
          attrVitality: input.attrVitality,
          maxHp,
          armor,
        })
        .where(eq(citizenCharacters.id, char.id));

      // Deduct Dream tokens
      await db
        .update(dreamBalance)
        .set({ dreamTokens: dream.dreamTokens - cost })
        .where(eq(dreamBalance.userId, ctx.user.id));

      return {
        success: true,
        cost,
        newAttributes: { attack: input.attrAttack, defense: input.attrDefense, vitality: input.attrVitality },
        maxHp,
        armor,
      };
    }),

  /** Respec alignment — switch between Order and Chaos.
      Costs Dream tokens. */
  respecAlignment: protectedProcedure
    .input(z.object({ alignment: z.enum(["order", "chaos"]) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const chars = await db
        .select()
        .from(citizenCharacters)
        .where(and(eq(citizenCharacters.userId, ctx.user.id), eq(citizenCharacters.isPrimary, 1)))
        .limit(1);
      if (!chars[0]) throw new Error("No citizen found");

      const char = chars[0];
      if (char.alignment === input.alignment) {
        throw new Error(`Already aligned with ${input.alignment}.`);
      }

      const dreamRows = await db
        .select()
        .from(dreamBalance)
        .where(eq(dreamBalance.userId, ctx.user.id))
        .limit(1);
      if (!dreamRows[0]) throw new Error("No Dream balance found");

      const dream = dreamRows[0];
      const baseCost = 50;
      const cost = Math.floor(baseCost * 0.6 * Math.max(1, char.level));

      if (dream.dreamTokens < cost) {
        throw new Error(`Need ${cost} Dream tokens (have ${dream.dreamTokens})`);
      }

      await db
        .update(citizenCharacters)
        .set({ alignment: input.alignment })
        .where(eq(citizenCharacters.id, char.id));

      await db
        .update(dreamBalance)
        .set({ dreamTokens: dream.dreamTokens - cost })
        .where(eq(dreamBalance.userId, ctx.user.id));

      return { success: true, cost, newAlignment: input.alignment };
    }),

  /** Respec element — change elemental affinity.
      Only allows elements valid for the citizen's species.
      Costs Dream tokens. */
  respecElement: protectedProcedure
    .input(z.object({ element: z.enum(["earth", "fire", "water", "air", "space", "time", "probability", "reality"]) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const chars = await db
        .select()
        .from(citizenCharacters)
        .where(and(eq(citizenCharacters.userId, ctx.user.id), eq(citizenCharacters.isPrimary, 1)))
        .limit(1);
      if (!chars[0]) throw new Error("No citizen found");

      const char = chars[0];
      if (char.element === input.element) {
        throw new Error(`Already attuned to ${input.element}.`);
      }

      // Validate element is valid for species
      const speciesData = SPECIES_CONFIG[char.species as keyof typeof SPECIES_CONFIG];
      if (!(speciesData.elements as readonly string[]).includes(input.element)) {
        throw new Error(`${speciesData.name} cannot attune to ${input.element}. Valid: ${speciesData.elements.join(", ")}`);
      }

      const dreamRows = await db
        .select()
        .from(dreamBalance)
        .where(eq(dreamBalance.userId, ctx.user.id))
        .limit(1);
      if (!dreamRows[0]) throw new Error("No Dream balance found");

      const dream = dreamRows[0];
      const baseCost = 50;
      const cost = Math.floor(baseCost * 0.4 * Math.max(1, char.level));

      if (dream.dreamTokens < cost) {
        throw new Error(`Need ${cost} Dream tokens (have ${dream.dreamTokens})`);
      }

      await db
        .update(citizenCharacters)
        .set({ element: input.element })
        .where(eq(citizenCharacters.id, char.id));

      await db
        .update(dreamBalance)
        .set({ dreamTokens: dream.dreamTokens - cost })
        .where(eq(dreamBalance.userId, ctx.user.id));

      return { success: true, cost, newElement: input.element };
    }),
});
