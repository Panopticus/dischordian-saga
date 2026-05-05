import { logger } from "../logger";
import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { citizenCharacters, dreamBalance } from "../../db/schema";
import { eq, and } from "drizzle-orm";
import { getPlayerTraitBonuses } from "../traitResolver";
import {
  resolveStarterLoadout,
  type StarterSpecies,
} from "../../shared/starterLoadout";
import type { ClassKey, ElementKey } from "../../shared/earnedLoadouts";
import { BASE_LOCKED_SLOTS } from "../../shared/suitEquipSlots";
import { bootstrapCitizenSchema } from "../services/citizenSchemaBootstrap";

/**
 * Resolves the DB handle and waits for citizen_characters' runtime
 * schema bootstrap to finish before any handler issues a query.
 *
 * Migration 0054 (foundation column) is orphaned from drizzle's
 * journal; the bootstrap runs an idempotent ADD COLUMN on startup,
 * but it was previously fire-and-forget — a request that landed
 * before the ALTER finished would crash citizen.getCharacter with
 * "Unknown column 'foundation'" and brick the Awakening handoff.
 *
 * The bootstrap promise is memoized in citizenSchemaBootstrap.ts,
 * so this await only blocks until the first invocation completes.
 */
async function citizenDb() {
  const handle = await getDb();
  if (handle) await bootstrapCitizenSchema();
  return handle;
}

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

// Operatives spawn bare-handed. Loadouts are earned through narrative choices
// (see apps/shared/earnedLoadouts.ts and the Med Bay DNA-device beat).
const CLASS_CONFIG = {
  engineer: {
    name: "Engineer",
    description: "Master builders and craftsmen. Your loadout is earned, not issued.",
  },
  oracle: {
    name: "Oracle (Prophet)",
    description: "Seers of fate. Your loadout is earned, not issued.",
  },
  assassin: {
    name: "Assassin (Virus)",
    description: "Silent killers. Your loadout is earned, not issued.",
  },
  soldier: {
    name: "Soldier (Warrior/Drone)",
    description: "Frontline fighters. Your loadout is earned, not issued.",
  },
  spy: {
    name: "Spy",
    description: "Intelligence operatives. Your loadout is earned, not issued.",
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

/** Ensure the user has a dream_balance row, swallowing all errors.
 *
 *  Used during citizen creation. The select intentionally projects only
 *  `id` so a missing column on the deployed `dream_balance` table (e.g.
 *  if the prod schema is one migration behind the application schema)
 *  doesn't blow up the whole createCharacter mutation after the citizen
 *  insert has already committed. Likewise the insert is wrapped in
 *  try/catch — a duplicate-key race with another tab is fine, and any
 *  other failure is recoverable on next read by getDreamBalance, which
 *  also lazily inserts. */
async function ensureDreamBalanceRow(db: NonNullable<Awaited<ReturnType<typeof getDb>>>, userId: number): Promise<void> {
  try {
    const existing = await db
      .select({ id: dreamBalance.id })
      .from(dreamBalance)
      .where(eq(dreamBalance.userId, userId))
      .limit(1);
    if (existing.length > 0) return;
    try {
      await db.insert(dreamBalance).values({ userId });
    } catch (insertErr) {
      logger.warn("[citizen.ensureDreamBalanceRow] insert failed (non-fatal):", insertErr);
    }
  } catch (selectErr) {
    logger.warn("[citizen.ensureDreamBalanceRow] select failed (non-fatal):", selectErr);
  }
}

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

export const citizenRouter = router({
  /** Get all trait bonuses for the current player (citizen build bonuses across all systems) */
  getAllTraitBonuses: protectedProcedure.query(async ({ ctx }) => {
    return getPlayerTraitBonuses(ctx.user.id);
  }),

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
    const db = await citizenDb();
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
        // §G.2 foundation choice — Humanity or Machine. Optional
        // in the input so clients that predate the creation UI
        // update still round-trip; defaults to "humanity" to match
        // the schema default.
        foundation: z.enum(["humanity", "machine"]).optional(),
        attrAttack: z.number().min(1).max(5),
        attrDefense: z.number().min(1).max(5),
        attrVitality: z.number().min(1).max(5),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await citizenDb();
      if (!db) throw new Error("Database unavailable");

      // Check if user already has a primary citizen.
      //
      // IDEMPOTENT — if the citizen already exists, return success rather
      // than throwing. The Awakening flow's client retries createCharacter
      // when its first attempt looks like it failed; before this guard,
      // the retry path would always crash with "You already have a
      // Citizen" if the previous attempt's citizen INSERT actually
      // succeeded but a downstream step (e.g. dream_balance init below)
      // threw. The retry then locked the player out of completing
      // creation despite a perfectly good citizen row already in place.
      const existing = await db
        .select()
        .from(citizenCharacters)
        .where(and(eq(citizenCharacters.userId, ctx.user.id), eq(citizenCharacters.isPrimary, 1)))
        .limit(1);
      if (existing.length > 0) {
        // Backfill the dream_balance row in case the prior attempt
        // failed before creating it. Best-effort; getDreamBalance is
        // resilient and will lazily create the row on first read too.
        await ensureDreamBalanceRow(db, ctx.user.id);
        return {
          success: true,
          maxHp: existing[0].maxHp,
          armor: existing[0].armor,
          gear: (existing[0].gear ?? {}) as Record<string, unknown>,
        };
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
        // §G.10 Step 8 — every citizen spawns with their deterministic
        // Base Mask + Base Suit pre-equipped. These are the locked
        // underlayer a named set is built on top of; the operative
        // never sees an empty paper doll. Foundation defaults to
        // "humanity" until the creation flow adds the foundation step
        // (plan carve-out). The mask motif is the player's species for
        // the machine-foundation path; humanity-foundation citizens
        // wear the human-motif mask regardless of species.
        foundation: input.foundation ?? "humanity",
        gear: (() => {
          const foundation: "humanity" | "machine" = input.foundation ?? "humanity";
          const maskMotif: StarterSpecies =
            foundation === "humanity" ? "human" : (input.species as StarterSpecies);
          const starter = resolveStarterLoadout({
            species: maskMotif,
            characterClass: input.characterClass as ClassKey,
            element: input.element as ElementKey,
            foundation,
          });
          return {
            "base-mask": { id: starter.baseMaskId, baseLocked: true },
            "base-suit": { id: starter.baseSuitId, baseLocked: true },
          } as Record<string, unknown>;
        })(),
        abilities: {
          elementAbility: ELEMENT_CONFIG[input.element as keyof typeof ELEMENT_CONFIG].ability,
          elementMastery: 1,
          unlockedAbilities: [],
        },
        isPrimary: 1,
      });

      // Initialize Dream balance — best-effort. If this fails (column
      // drift, transient DB error, etc.) the citizen row is already
      // committed and getDreamBalance will lazily create the row on
      // first read. Throwing here would surface the citizen as a
      // creation failure to the client even though it exists.
      await ensureDreamBalanceRow(db, ctx.user.id);

      return { success: true, maxHp, armor, gear: {} as Record<string, unknown> };
    }),

  /** Level up class (costs EXP + Dream) */
  levelUpClass: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await citizenDb();
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
      const db = await citizenDb();
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
    // Resilient: never throws. Missing table, missing row, and transient
    // DB errors all collapse to a zeroed default so the UI can still
    // render. Insert the row lazily when the authenticated user has none.
    const zeroedBalance = {
      id: 0,
      userId: ctx.user.id,
      dreamTokens: 0,
      soulBoundDream: 0,
      dnaCode: 0,
      gems: 0,
      totalGemsPurchased: 0,
      totalDreamEarned: 0,
      difficultyModifier: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    try {
      const db = await citizenDb();
      if (!db) return zeroedBalance;
      const rows = await db
        .select()
        .from(dreamBalance)
        .where(eq(dreamBalance.userId, ctx.user.id))
        .limit(1);
      if (rows[0]) return rows[0];
      // No row yet — create one so downstream writes have something to
      // update against. Failures here are non-fatal; return the zeroed
      // default either way.
      try {
        await db.insert(dreamBalance).values({ userId: ctx.user.id });
        const inserted = await db
          .select()
          .from(dreamBalance)
          .where(eq(dreamBalance.userId, ctx.user.id))
          .limit(1);
        return inserted[0] || zeroedBalance;
      } catch {
        return zeroedBalance;
      }
    } catch (err) {
      console.warn("[citizen.getDreamBalance] falling back to zeroed balance:", err);
      return zeroedBalance;
    }
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
      const db = await citizenDb();
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

  /** Update equipped gear (persists slot→itemId mapping)
   *
   *  Merges the incoming slot updates into the existing gear JSON rather
   *  than overwriting the whole blob. Critically, the §G.2 base-mask /
   *  base-suit layers (written at character creation as
   *  `{ id, baseLocked: true }`) are preserved — unequipping them is
   *  disallowed (BASE_LOCKED_SLOTS) and re-equipping a different id
   *  coerces to the same object shape so the lock survives round-trip.
   *  Without this merge, every equip click wiped the species base body. */
  updateGear: protectedProcedure
    .input(
      z.object({
        gear: z.record(z.string(), z.string().nullable()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await citizenDb();
      if (!db) throw new Error("Database unavailable");

      const chars = await db
        .select()
        .from(citizenCharacters)
        .where(and(eq(citizenCharacters.userId, ctx.user.id), eq(citizenCharacters.isPrimary, 1)))
        .limit(1);
      if (!chars[0]) throw new Error("No citizen found");

      const existingGear = (chars[0].gear as Record<string, unknown> | null) ?? {};
      const mergedGear: Record<string, unknown> = { ...existingGear };

      for (const [slot, itemId] of Object.entries(input.gear)) {
        const isBaseLocked = (BASE_LOCKED_SLOTS as ReadonlySet<string>).has(slot);
        if (itemId === null) {
          // Null clears a slot — but base-locked slots stay locked. A client
          // that sends `null` for `base-mask` is buggy; silently ignore.
          if (isBaseLocked) continue;
          delete mergedGear[slot];
          continue;
        }
        if (isBaseLocked) {
          // Preserve the object shape so the creation flow's baseLocked
          // flag round-trips through every equip operation.
          mergedGear[slot] = { id: itemId, baseLocked: true };
        } else {
          mergedGear[slot] = itemId;
        }
      }

      await db
        .update(citizenCharacters)
        .set({ gear: mergedGear })
        .where(eq(citizenCharacters.id, chars[0].id));

      return { success: true, gear: mergedGear };
    }),

  /* ═══════════════════════════════════════════════════
     RESPEC SYSTEM — Dream token economy sink
     Players can reassign attribute dots or change alignment/element.
     Cost scales with citizen level to prevent trivial respeccing.
     ═══════════════════════════════════════════════════ */

  /** Get respec costs for the current citizen */
  getRespecCosts: protectedProcedure.query(async ({ ctx }) => {
    const db = await citizenDb();
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
      const db = await citizenDb();
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
      const db = await citizenDb();
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
      const db = await citizenDb();
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
