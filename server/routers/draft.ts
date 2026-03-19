/* ═══════════════════════════════════════════════════════
   DRAFT TOURNAMENT ROUTER — Create, join, draft, battle
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { eq, and, desc, sql } from "drizzle-orm";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import {
  draftTournaments, draftParticipants, cards, dreamBalance,
} from "../../drizzle/schema";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

/** Pick N random cards from the full card pool, weighted by rarity. */
async function getRandomCardPool(db: NonNullable<Awaited<ReturnType<typeof getDb>>>, count: number): Promise<string[]> {
  const allCards = await db.select({ cardId: cards.cardId, rarity: cards.rarity }).from(cards).where(eq(cards.isActive, 1));
  // Weight: common=4, uncommon=3, rare=2, epic=1.5, legendary=1, mythic=0.5, neyon=0.3
  const weights: Record<string, number> = { common: 4, uncommon: 3, rare: 2, epic: 1.5, legendary: 1, mythic: 0.5, neyon: 0.3 };
  const weighted: string[] = [];
  for (const c of allCards) {
    const w = weights[c.rarity] || 1;
    for (let i = 0; i < Math.ceil(w * 2); i++) weighted.push(c.cardId);
  }
  const picked: string[] = [];
  const used = new Set<string>();
  while (picked.length < count && weighted.length > 0) {
    const idx = Math.floor(Math.random() * weighted.length);
    const cardId = weighted[idx];
    if (!used.has(cardId)) {
      picked.push(cardId);
      used.add(cardId);
    }
    weighted.splice(idx, 1);
  }
  return picked;
}

export const draftRouter = router({
  /** Create a new draft tournament */
  create: protectedProcedure
    .input(z.object({
      maxPlayers: z.number().min(2).max(8).default(2),
      draftRounds: z.number().min(5).max(30).default(15),
      cardsPerPick: z.number().min(2).max(5).default(3),
      entryCost: z.number().min(0).max(100).default(5),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "DB unavailable" };

      // Check Dream balance
      if (input.entryCost > 0) {
        const bal = await db.select().from(dreamBalance).where(eq(dreamBalance.userId, ctx.user.id)).limit(1);
        const totalDream = (bal[0]?.dreamTokens || 0) + (bal[0]?.soulBoundDream || 0);
        if (totalDream < input.entryCost) return { success: false, error: "Not enough Dream tokens" };
      }

      const code = generateCode();
      const [result] = await db.insert(draftTournaments).values({
        tournamentCode: code,
        maxPlayers: input.maxPlayers,
        draftRounds: input.draftRounds,
        cardsPerPick: input.cardsPerPick,
        entryCost: input.entryCost,
        prizeMultiplier: 2,
        creatorId: ctx.user.id,
      });

      // Auto-join creator
      await db.insert(draftParticipants).values({
        tournamentId: result.insertId,
        userId: ctx.user.id,
        pickedCards: [],
      });

      // Deduct entry cost
      if (input.entryCost > 0) {
        await db.update(dreamBalance)
          .set({ dreamTokens: sql`GREATEST(0, dreamTokens - ${input.entryCost})` })
          .where(eq(dreamBalance.userId, ctx.user.id));
      }

      return { success: true, tournamentCode: code, tournamentId: result.insertId };
    }),

  /** Join an existing draft tournament */
  join: protectedProcedure
    .input(z.object({ tournamentCode: z.string().min(4).max(8) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "DB unavailable" };

      const [tournament] = await db.select().from(draftTournaments)
        .where(eq(draftTournaments.tournamentCode, input.tournamentCode.toUpperCase())).limit(1);
      if (!tournament) return { success: false, error: "Tournament not found" };
      if (tournament.status !== "drafting") return { success: false, error: "Tournament already started" };

      const participants = await db.select().from(draftParticipants)
        .where(eq(draftParticipants.tournamentId, tournament.id));
      if (participants.length >= tournament.maxPlayers) return { success: false, error: "Tournament full" };
      if (participants.some(p => p.userId === ctx.user.id)) return { success: false, error: "Already joined" };

      // Check Dream balance
      if (tournament.entryCost > 0) {
        const bal = await db.select().from(dreamBalance).where(eq(dreamBalance.userId, ctx.user.id)).limit(1);
        const totalDream = (bal[0]?.dreamTokens || 0) + (bal[0]?.soulBoundDream || 0);
        if (totalDream < tournament.entryCost) return { success: false, error: "Not enough Dream tokens" };
        await db.update(dreamBalance)
          .set({ dreamTokens: sql`GREATEST(0, dreamTokens - ${tournament.entryCost})` })
          .where(eq(dreamBalance.userId, ctx.user.id));
      }

      await db.insert(draftParticipants).values({
        tournamentId: tournament.id,
        userId: ctx.user.id,
        pickedCards: [],
      });

      return { success: true, tournamentId: tournament.id };
    }),

  /** Get tournament state */
  getTournament: protectedProcedure
    .input(z.object({ tournamentCode: z.string() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return null;

      const [tournament] = await db.select().from(draftTournaments)
        .where(eq(draftTournaments.tournamentCode, input.tournamentCode.toUpperCase())).limit(1);
      if (!tournament) return null;

      const participants = await db.select().from(draftParticipants)
        .where(eq(draftParticipants.tournamentId, tournament.id));

      return { ...tournament, participants };
    }),

  /** Get current draft choices for the player */
  getMyDraftState: protectedProcedure
    .input(z.object({ tournamentId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return null;

      const [participant] = await db.select().from(draftParticipants)
        .where(and(
          eq(draftParticipants.tournamentId, input.tournamentId),
          eq(draftParticipants.userId, ctx.user.id),
        )).limit(1);
      if (!participant) return null;

      // If no choices yet, generate them
      if (!participant.currentChoices || participant.currentChoices.length === 0) {
        const [tournament] = await db.select().from(draftTournaments)
          .where(eq(draftTournaments.id, input.tournamentId)).limit(1);
        if (!tournament || participant.currentRound >= tournament.draftRounds) {
          return { ...participant, draftComplete: true, choices: [], choiceCards: [] };
        }

        const choices = await getRandomCardPool(db, tournament.cardsPerPick);
        await db.update(draftParticipants)
          .set({ currentChoices: choices, currentRound: participant.currentRound + 1 })
          .where(eq(draftParticipants.id, participant.id));
        participant.currentChoices = choices;
        participant.currentRound += 1;
      }

      // Fetch card details for choices
      const choiceCards = participant.currentChoices && participant.currentChoices.length > 0
        ? await db.select().from(cards).where(
            sql`${cards.cardId} IN (${sql.join(participant.currentChoices.map(c => sql`${c}`), sql`, `)})`
          )
        : [];

      // Fetch picked card details
      const pickedCardDetails = participant.pickedCards.length > 0
        ? await db.select().from(cards).where(
            sql`${cards.cardId} IN (${sql.join(participant.pickedCards.map(c => sql`${c}`), sql`, `)})`
          )
        : [];

      const [tournament] = await db.select().from(draftTournaments)
        .where(eq(draftTournaments.id, input.tournamentId)).limit(1);

      return {
        ...participant,
        draftComplete: participant.currentRound >= (tournament?.draftRounds || 15),
        choices: participant.currentChoices || [],
        choiceCards,
        pickedCardDetails,
        totalRounds: tournament?.draftRounds || 15,
      };
    }),

  /** Pick a card during draft */
  pickCard: protectedProcedure
    .input(z.object({ tournamentId: z.number(), cardId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "DB unavailable" };

      const [participant] = await db.select().from(draftParticipants)
        .where(and(
          eq(draftParticipants.tournamentId, input.tournamentId),
          eq(draftParticipants.userId, ctx.user.id),
        )).limit(1);
      if (!participant) return { success: false, error: "Not in tournament" };
      if (!participant.currentChoices?.includes(input.cardId)) return { success: false, error: "Invalid pick" };

      const newPicked = [...participant.pickedCards, input.cardId];
      const [tournament] = await db.select().from(draftTournaments)
        .where(eq(draftTournaments.id, input.tournamentId)).limit(1);

      const nextRound = participant.currentRound;
      const draftComplete = nextRound >= (tournament?.draftRounds || 15);

      // Generate next choices or clear
      let nextChoices: string[] = [];
      if (!draftComplete) {
        nextChoices = await getRandomCardPool(db, tournament?.cardsPerPick || 3);
      }

      await db.update(draftParticipants)
        .set({
          pickedCards: newPicked,
          currentChoices: draftComplete ? [] : nextChoices,
          currentRound: draftComplete ? nextRound : nextRound + 1,
        })
        .where(eq(draftParticipants.id, participant.id));

      return { success: true, pickedCount: newPicked.length, draftComplete, nextRound: draftComplete ? nextRound : nextRound + 1 };
    }),

  /** List open tournaments */
  listOpen: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const tournaments = await db.select().from(draftTournaments)
      .where(eq(draftTournaments.status, "drafting"))
      .orderBy(desc(draftTournaments.createdAt))
      .limit(20);

    const result = [];
    for (const t of tournaments) {
      const participants = await db.select().from(draftParticipants)
        .where(eq(draftParticipants.tournamentId, t.id));
      result.push({ ...t, playerCount: participants.length });
    }
    return result;
  }),

  /** Get my tournament history */
  myHistory: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const myParticipations = await db.select().from(draftParticipants)
      .where(eq(draftParticipants.userId, ctx.user.id))
      .orderBy(desc(draftParticipants.joinedAt))
      .limit(20);

    const result = [];
    for (const p of myParticipations) {
      const [t] = await db.select().from(draftTournaments)
        .where(eq(draftTournaments.id, p.tournamentId)).limit(1);
      if (t) result.push({ ...p, tournament: t });
    }
    return result;
  }),

  /** Mark tournament as ready for battles (when all players done drafting) */
  startBattles: protectedProcedure
    .input(z.object({ tournamentId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "DB unavailable" };

      const [tournament] = await db.select().from(draftTournaments)
        .where(eq(draftTournaments.id, input.tournamentId)).limit(1);
      if (!tournament) return { success: false, error: "Tournament not found" };
      if (tournament.creatorId !== ctx.user.id) return { success: false, error: "Only creator can start battles" };

      await db.update(draftTournaments)
        .set({ status: "battling" })
        .where(eq(draftTournaments.id, input.tournamentId));

      return { success: true };
    }),
});
