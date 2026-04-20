/* ═══════════════════════════════════════════════════════
   MED BAY ROUTER — Earned-gear encounters

   First encounter: the "unkempt device" (vox-neural-bridge
   hotspot) offers the operative a DNA sample in exchange
   for a piece of loadout that fits who they are. The
   decision is logged; a refusal costs nothing; a donation
   grants a reward AND raises a hidden Game-Master
   difficulty counter (dreamBalance.difficultyModifier)
   that encounter.ts reads at match init.
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, and, sql } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { citizenCharacters, dreamBalance, userProgress } from "../../db/schema";
import { logger } from "../logger";
import {
  rollEarnedReward,
  type ClassKey,
  type ElementKey,
  type RewardItem,
  type SpeciesKey,
} from "@shared/earnedLoadouts";

/** Flags that this beat reads / writes on userProgress.gameData.narrativeFlags. */
const FLAG_DONATED = "donated_dna_sample";
const FLAG_REFUSED = "refused_dna_sample";

async function loadNarrativeFlags(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>,
  userId: number,
): Promise<{ flags: Record<string, boolean>; progressId: number | null; gd: Record<string, unknown> }> {
  const [progress] = await db
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, userId))
    .limit(1);
  const gd = (progress?.gameData as Record<string, unknown>) ?? {};
  const flags = (gd.narrativeFlags as Record<string, boolean>) ?? {};
  return { flags, progressId: progress?.id ?? null, gd };
}

async function saveNarrativeFlags(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>,
  userId: number,
  progressId: number | null,
  gd: Record<string, unknown>,
  flags: Record<string, boolean>,
): Promise<void> {
  if (progressId == null) {
    await db.insert(userProgress).values({
      userId,
      gameData: { narrativeFlags: flags } as Record<string, unknown>,
    });
    return;
  }
  await db
    .update(userProgress)
    .set({ gameData: { ...gd, narrativeFlags: flags } })
    .where(eq(userProgress.id, progressId));
}

export const medbayRouter = router({
  /**
   * Offer the Med Bay DNA sample. Idempotent: once a choice is made,
   * subsequent calls return the prior outcome without mutating state.
   */
  offerDnaSample: protectedProcedure
    .input(z.object({ choice: z.enum(["donate", "refuse"]) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      }

      const [character] = await db
        .select()
        .from(citizenCharacters)
        .where(
          and(eq(citizenCharacters.userId, ctx.user.id), eq(citizenCharacters.isPrimary, 1)),
        )
        .limit(1);
      if (!character) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Create a Citizen before interacting with the Med Bay device.",
        });
      }

      const { flags, progressId, gd } = await loadNarrativeFlags(db, ctx.user.id);

      // Idempotent short-circuit.
      if (flags[FLAG_DONATED] || flags[FLAG_REFUSED]) {
        return {
          alreadyResolved: true,
          choice: flags[FLAG_DONATED] ? ("donate" as const) : ("refuse" as const),
          reward: null as RewardItem | null,
          flags,
        };
      }

      if (input.choice === "refuse") {
        const nextFlags = { ...flags, [FLAG_REFUSED]: true };
        await saveNarrativeFlags(db, ctx.user.id, progressId, gd, nextFlags);
        return {
          alreadyResolved: false,
          choice: "refuse" as const,
          reward: null as RewardItem | null,
          flags: nextFlags,
        };
      }

      // Donate: roll a reward keyed to who the operative is.
      const reward = rollEarnedReward(
        "medbay_dna_device",
        character.characterClass as ClassKey,
        character.species as SpeciesKey,
        character.element as ElementKey,
      );
      if (!reward) {
        logger.warn(
          `[medbay] no medbay_dna_device reward pool for class=${character.characterClass} species=${character.species}; recording refuse.`,
        );
        const nextFlags = { ...flags, [FLAG_REFUSED]: true };
        await saveNarrativeFlags(db, ctx.user.id, progressId, gd, nextFlags);
        return {
          alreadyResolved: false,
          choice: "refuse" as const,
          reward: null as RewardItem | null,
          flags: nextFlags,
        };
      }

      const currentGear = (character.gear as Record<string, unknown>) ?? {};
      // Preserve anything already present; store the reward keyed by slot
      // alongside a stable item ID so the client can hydrate a display.
      const nextGear: Record<string, unknown> = {
        ...currentGear,
        [reward.slot]: {
          id: reward.id,
          name: reward.name,
          slot: reward.slot,
          style: reward.style,
          source: "medbay_dna_device",
        },
      };

      await db
        .update(citizenCharacters)
        .set({ gear: nextGear })
        .where(eq(citizenCharacters.id, character.id));

      // Hidden cost — increment the typed difficultyModifier column on
      // dreamBalance. Ensures one row exists first (createCharacter
      // usually seeds it, but an orphan session shouldn't crash).
      const [existingDream] = await db
        .select()
        .from(dreamBalance)
        .where(eq(dreamBalance.userId, ctx.user.id))
        .limit(1);
      if (!existingDream) {
        await db.insert(dreamBalance).values({
          userId: ctx.user.id,
          difficultyModifier: 1,
        });
      } else {
        await db
          .update(dreamBalance)
          .set({
            difficultyModifier: sql`${dreamBalance.difficultyModifier} + 1`,
          })
          .where(eq(dreamBalance.userId, ctx.user.id));
      }

      const nextFlags = { ...flags, [FLAG_DONATED]: true };
      if (progressId == null) {
        await db.insert(userProgress).values({
          userId: ctx.user.id,
          gameData: { narrativeFlags: nextFlags } as Record<string, unknown>,
        });
      } else {
        await db
          .update(userProgress)
          .set({ gameData: { ...gd, narrativeFlags: nextFlags } })
          .where(eq(userProgress.id, progressId));
      }

      return {
        alreadyResolved: false,
        choice: "donate" as const,
        reward,
        flags: nextFlags,
      };
    }),

  /** Read the current resolution status — used by the client to hide the offer if already taken. */
  getDnaOfferStatus: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { donated: false, refused: false };
    const { flags } = await loadNarrativeFlags(db, ctx.user.id);
    return {
      donated: !!flags[FLAG_DONATED],
      refused: !!flags[FLAG_REFUSED],
    };
  }),
});
