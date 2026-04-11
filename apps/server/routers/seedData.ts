/* ═══════════════════════════════════════════════════════
   DATA SEEDER — Initialize DB tables that start empty
   Seeds community votes, starter pets, and companion bonds.
   Called via admin endpoint or on first server boot.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  communityVotes, voteOptions,
  playerPets, companionRelationships,
} from "../../db/schema";
import { eq, sql } from "drizzle-orm";

/* ─── YEAR ONE WEEK 1 VOTE DATA ─── */
const SEED_VOTES = [
  {
    voteId: "y1_w1_first_signal",
    title: "THE FIRST SIGNAL — Which distress call do we answer?",
    category: "lore" as const,
    endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    options: [
      { optionNumber: 1, optionText: "The Amber Signal", description: "Deep space, near a destroyed Inception Ark. Frequency matches Insurgency encryption." },
      { optionNumber: 2, optionText: "The Indigo Signal", description: "Broadcasting from INSIDE our ship. Laced with untranslatable text fragments." },
      { optionNumber: 3, optionText: "The Crimson Signal", description: "A rogue planet. Not a distress call — it's a WARNING." },
    ],
  },
  {
    voteId: "y1_w2_dark_sector",
    title: "THE DARK SECTOR — How do we investigate the shield?",
    category: "lore" as const,
    endsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    options: [
      { optionNumber: 1, optionText: "Send a Probe", description: "Fire an unmanned sensor package at the barrier." },
      { optionNumber: 2, optionText: "Hail New Babylon", description: "Demand answers from the Authority." },
      { optionNumber: 3, optionText: "Observe and Wait", description: "Watch, learn, wait." },
      { optionNumber: 4, optionText: "Attempt to Breach the Shield", description: "Full Ark power diverted. DANGEROUS." },
    ],
  },
];

/* ─── STARTER PET SPECIES ─── */
const STARTER_PETS = [
  { petId: "lux", species: "holographic_fox", name: "Lux" },
  { petId: "cipher", species: "data_serpent", name: "Cipher" },
  { petId: "echo", species: "temporal_kitten", name: "Echo" },
];

export const seedDataRouter = router({
  /** Seed community votes if none exist */
  seedVotes: adminProcedure.mutation(async () => {
    const db = await getDb();
    if (!db) return { success: false, error: "DB unavailable" };

    // Check if votes already exist
    const existing = await db.select({ count: sql<number>`count(*)` }).from(communityVotes);
    if ((existing[0]?.count ?? 0) > 0) {
      return { success: true, message: "Votes already seeded", count: existing[0]?.count };
    }

    // Seed each vote
    for (const vote of SEED_VOTES) {
      await db.insert(communityVotes).values({
        voteId: vote.voteId,
        title: vote.title,
        category: vote.category,
        status: "active",
        endsAt: vote.endsAt,
      });

      await db.insert(voteOptions).values(
        vote.options.map(opt => ({
          voteId: vote.voteId,
          optionNumber: opt.optionNumber,
          optionText: opt.optionText,
          description: opt.description,
        })),
      );
    }

    return { success: true, message: `Seeded ${SEED_VOTES.length} community votes` };
  }),

  /** Grant a starter pet to a player (called on first Ark visit or account creation) */
  grantStarterPet: protectedProcedure
    .input(z.object({
      petChoice: z.enum(["lux", "cipher", "echo"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "DB unavailable" };

      // Check if player already has any pet
      const existing = await db.select().from(playerPets)
        .where(eq(playerPets.userId, ctx.user.id));
      if (existing.length > 0) {
        return { success: false, error: "You already have a pet", existingPet: existing[0].name };
      }

      const starter = STARTER_PETS.find(p => p.petId === input.petChoice);
      if (!starter) return { success: false, error: "Invalid pet choice" };

      await db.insert(playerPets).values({
        userId: ctx.user.id,
        petId: starter.petId,
        species: starter.species,
        name: starter.name,
        evolutionStage: 1,
        bond: 5, // Small starting bond
        skillPoints: 0,
        currentHp: 50,
        maxHp: 50,
        unlockedMoves: [],
        wins: 0, losses: 0, kills: 0,
      });

      // Also create companion relationship entries if they don't exist
      for (const companionId of ["elara", "the_human"]) {
        const [existingRel] = await db.select().from(companionRelationships)
          .where(eq(companionRelationships.userId, ctx.user.id));
        if (!existingRel) {
          await db.insert(companionRelationships).values({
            userId: ctx.user.id,
            companionId,
            relationshipLevel: 0,
            totalMessages: 0,
          }).onDuplicateKeyUpdate({ set: { updatedAt: new Date() } });
        }
      }

      return { success: true, pet: starter };
    }),

  /** Check DB health — which tables have data */
  getDbStatus: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { error: "DB unavailable" };

    const counts = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(communityVotes),
      db.select({ count: sql<number>`count(*)` }).from(voteOptions),
      db.select({ count: sql<number>`count(*)` }).from(playerPets),
      db.select({ count: sql<number>`count(*)` }).from(companionRelationships),
    ]);

    return {
      communityVotes: counts[0][0]?.count ?? 0,
      voteOptions: counts[1][0]?.count ?? 0,
      playerPets: counts[2][0]?.count ?? 0,
      companionRelationships: counts[3][0]?.count ?? 0,
    };
  }),
});
