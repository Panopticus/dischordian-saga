import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { citizenCharacters, dreamBalance } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

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
    startingGear: { weapon: "Diamond Pick Axe", secondary: "Repair Kit", consumable: "Shield Generator" },
  },
  oracle: {
    name: "Oracle (Prophet)",
    description: "Seers of fate. Start with potions of random powers and a crossbow.",
    startingGear: { weapon: "Crossbow", secondary: "Invisibility Potion", consumable: "Random Power Potion" },
  },
  assassin: {
    name: "Assassin (Virus)",
    description: "Silent killers. Start with poison, potions, and ranged weapons.",
    startingGear: { weapon: "Poison Blade", secondary: "Throwing Knives", consumable: "Smoke Bomb" },
  },
  soldier: {
    name: "Soldier (Warrior/Drone)",
    description: "Frontline fighters. Start with sword and shield.",
    startingGear: { weapon: "Plasma Sword", secondary: "Energy Shield", consumable: "Stim Pack" },
  },
  spy: {
    name: "Spy",
    description: "Intelligence operatives. Stealth and deception specialists.",
    startingGear: { weapon: "Silenced Pistol", secondary: "Cloaking Device", consumable: "EMP Grenade" },
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
});
