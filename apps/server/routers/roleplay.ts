/* ═══════════════════════════════════════════════════════════════════
   ROLEPLAY ROUTER — identity, recognition, ledger, confession.

   One router covers the whole RP surface so the client only needs a
   single tRPC namespace (`trpc.roleplay`). Procedures group as:

     Dossier          — getMine / getById / upsert / setRecognitionMode
     Recognition      — grant / revoke / listGrants
     DeckOath         — get / upsert
     FactionChannel   — list / post / pin
     WitnessedLedger  — feed / pin (admin)
     Confession       — current / submit / vote / list / leaderboard
     GuildRites       — list / schedule / cancel

   Charter + Cells live in this router too — they read/write the
   guild_charters / guild_cells / guild_cell_members tables. Joining
   a guild does not auto-assign a cell; the guild leader assigns.
   ═══════════════════════════════════════════════════════════════════ */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, gte, sql } from "drizzle-orm";

import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import {
  roleplayDossier,
  roleplayRecognitions,
  deckOaths,
  guildCharters,
  guildCells,
  guildCellMembers,
  factionChannelPosts,
  witnessedLedgerPins,
  confessions,
  confessionVotes,
  guildRites,
  guilds,
  guildMembers,
  decks,
  users,
  rippleEvents,
} from "../../db/schema";
import { isoWeekKey } from "../../shared/roleplayChat";

const FACTIONS = ["empire", "insurgency", "neutral", "witness", "unaligned"] as const;
const TRIAL_CATEGORIES = [
  "confession", "defensive", "evidence", "narrative", "offensive", "reactive",
] as const;
const INNER_VOICES = [
  "aggression", "mercy", "curiosity", "conformity",
  "vigilance", "vulnerability", "wit",
] as const;

/** Are A and B mutual friends (or is A == B)? Used to gate trueName
 *  visibility in `private` recognition mode. We don't have a friends
 *  table here; in lieu of one, recognition is the explicit grant. */
async function hasRecognition(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>,
  granterUserId: number,
  granteeUserId: number,
): Promise<boolean> {
  if (granterUserId === granteeUserId) return true;
  const rows = await db
    .select({ id: roleplayRecognitions.id })
    .from(roleplayRecognitions)
    .where(and(
      eq(roleplayRecognitions.granterUserId, granterUserId),
      eq(roleplayRecognitions.granteeUserId, granteeUserId),
    ))
    .limit(1);
  return rows.length > 0;
}

export const roleplayRouter = router({
  /* ═══ DOSSIER ═══ */

  /**
   * Read the caller's own dossier. Always returns a row; if none
   * exists yet, returns a synthesised empty dossier so the client
   * can render the editor without a special-case branch.
   */
  getMyDossier: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    const rows = await db
      .select()
      .from(roleplayDossier)
      .where(eq(roleplayDossier.userId, ctx.user.id))
      .limit(1);
    if (rows[0]) return rows[0];
    return {
      id: 0,
      userId: ctx.user.id,
      chosenName: ctx.user.name ?? null,
      trueName: null,
      pronouns: null,
      bio: null,
      innerVoice: null,
      factionAllegiance: "unaligned" as const,
      motto: null,
      sigilArt: null,
      recognitionMode: "private" as const,
      calling: null,
      sigilThemeId: "default" as string | null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }),

  /**
   * View another player's dossier. trueName is gated by
   * recognitionMode + active recognition grants.
   */
  getDossierById: publicProcedure
    .input(z.object({ userId: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return null;
      const rows = await db
        .select()
        .from(roleplayDossier)
        .where(eq(roleplayDossier.userId, input.userId))
        .limit(1);
      const dossier = rows[0];
      if (!dossier) return null;

      // Gate trueName visibility.
      const viewerId = ctx.user?.id ?? null;
      let canSeeTrueName = dossier.recognitionMode === "open";
      if (!canSeeTrueName && viewerId !== null && dossier.recognitionMode !== "sealed") {
        canSeeTrueName = await hasRecognition(db, input.userId, viewerId);
      }
      if (!canSeeTrueName) {
        return { ...dossier, trueName: null };
      }
      return dossier;
    }),

  /** Upsert the caller's dossier. Bounded-length zod validations
   *  mirror the schema column lengths exactly. */
  upsertMyDossier: protectedProcedure
    .input(z.object({
      chosenName: z.string().max(64).nullable().optional(),
      trueName: z.string().max(64).nullable().optional(),
      pronouns: z.string().max(48).nullable().optional(),
      bio: z.string().max(500).nullable().optional(),
      innerVoice: z.enum(INNER_VOICES).nullable().optional(),
      factionAllegiance: z.enum(FACTIONS).optional(),
      motto: z.string().max(140).nullable().optional(),
      sigilArt: z.string().max(128).nullable().optional(),
      recognitionMode: z.enum(["private", "open", "sealed"]).optional(),
      calling: z.string().max(48).nullable().optional(),
      sigilThemeId: z.string().max(64).nullable().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const existing = await db
        .select({ id: roleplayDossier.id })
        .from(roleplayDossier)
        .where(eq(roleplayDossier.userId, ctx.user.id))
        .limit(1);

      const values = {
        userId: ctx.user.id,
        chosenName: input.chosenName ?? null,
        trueName: input.trueName ?? null,
        pronouns: input.pronouns ?? null,
        bio: input.bio ?? null,
        innerVoice: input.innerVoice ?? null,
        factionAllegiance: input.factionAllegiance ?? "unaligned" as const,
        motto: input.motto ?? null,
        sigilArt: input.sigilArt ?? null,
        recognitionMode: input.recognitionMode ?? "private" as const,
        calling: input.calling ?? null,
        sigilThemeId: input.sigilThemeId ?? "default",
      };

      if (existing[0]) {
        await db.update(roleplayDossier)
          .set(values)
          .where(eq(roleplayDossier.userId, ctx.user.id));
      } else {
        await db.insert(roleplayDossier).values(values);
      }
      return { success: true };
    }),

  /* ═══ RECOGNITION ═══ */

  /**
   * The caller (granter) chooses to reveal their trueName to a
   * grantee. This is the consensual identity-reveal ceremony.
   */
  grantRecognition: protectedProcedure
    .input(z.object({
      granteeUserId: z.number().int().positive(),
      ceremonyNote: z.string().max(280).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (input.granteeUserId === ctx.user.id) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot grant recognition to yourself." });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      try {
        await db.insert(roleplayRecognitions).values({
          granterUserId: ctx.user.id,
          granteeUserId: input.granteeUserId,
          ceremonyNote: input.ceremonyNote ?? null,
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (/duplicate|unique/i.test(msg)) {
          return { success: true, alreadyGranted: true };
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: msg });
      }
      return { success: true, alreadyGranted: false };
    }),

  /** Revoke recognition (granter unilaterally pulls the grant). */
  revokeRecognition: protectedProcedure
    .input(z.object({ granteeUserId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.delete(roleplayRecognitions).where(and(
        eq(roleplayRecognitions.granterUserId, ctx.user.id),
        eq(roleplayRecognitions.granteeUserId, input.granteeUserId),
      ));
      return { success: true };
    }),

  /** List who the caller has recognised + who has recognised them. */
  listMyRecognitions: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { granted: [], received: [] };
    const granted = await db.select().from(roleplayRecognitions)
      .where(eq(roleplayRecognitions.granterUserId, ctx.user.id))
      .orderBy(desc(roleplayRecognitions.grantedAt))
      .limit(200);
    const received = await db.select().from(roleplayRecognitions)
      .where(eq(roleplayRecognitions.granteeUserId, ctx.user.id))
      .orderBy(desc(roleplayRecognitions.grantedAt))
      .limit(200);
    return { granted, received };
  }),

  /* ═══ DECK OATH ═══ */

  /** Read a deck's oath/lore. Public — anyone can see another
   *  player's deck oaths. */
  getDeckOath: publicProcedure
    .input(z.object({ deckId: z.number().int().positive() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const rows = await db.select().from(deckOaths)
        .where(eq(deckOaths.deckId, input.deckId)).limit(1);
      return rows[0] ?? null;
    }),

  /** Upsert deck oath — caller must own the deck. */
  upsertDeckOath: protectedProcedure
    .input(z.object({
      deckId: z.number().int().positive(),
      oath: z.string().max(140).nullable().optional(),
      lore: z.string().max(1000).nullable().optional(),
      signatureCardId: z.string().max(96).nullable().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const ownerCheck = await db.select({ userId: decks.userId }).from(decks)
        .where(eq(decks.id, input.deckId)).limit(1);
      if (!ownerCheck[0] || ownerCheck[0].userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not your deck." });
      }

      const existing = await db.select({ id: deckOaths.id }).from(deckOaths)
        .where(eq(deckOaths.deckId, input.deckId)).limit(1);

      const values = {
        deckId: input.deckId,
        userId: ctx.user.id,
        oath: input.oath ?? null,
        lore: input.lore ?? null,
        signatureCardId: input.signatureCardId ?? null,
      };
      if (existing[0]) {
        await db.update(deckOaths).set(values).where(eq(deckOaths.id, existing[0].id));
      } else {
        await db.insert(deckOaths).values(values);
      }
      return { success: true };
    }),

  /* ═══ FACTION CHANNEL ═══ */

  /** Read the most recent posts in a faction channel. Public — even
   *  unaligned players can lurk. */
  listFactionChannel: publicProcedure
    .input(z.object({
      faction: z.enum(["empire", "insurgency", "witness", "neutral"]),
      limit: z.number().int().min(1).max(100).default(50),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(factionChannelPosts)
        .where(eq(factionChannelPosts.faction, input.faction))
        .orderBy(desc(factionChannelPosts.pinned), desc(factionChannelPosts.createdAt))
        .limit(input.limit);
    }),

  /**
   * Post to a faction channel. Caller must have a matching
   * factionAllegiance on their dossier (or be in a guild aligned to
   * that faction). Posting to "neutral" requires no alignment.
   */
  postFactionChannel: protectedProcedure
    .input(z.object({
      faction: z.enum(["empire", "insurgency", "witness", "neutral"]),
      message: z.string().min(1).max(500),
      tone: z.enum(["intel", "edict", "vision", "notice", "rumor"]).default("notice"),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      if (input.faction !== "neutral") {
        const dossierRows = await db.select().from(roleplayDossier)
          .where(eq(roleplayDossier.userId, ctx.user.id)).limit(1);
        const dossier = dossierRows[0];

        const guildRows = await db.select({
          guildFaction: guilds.faction,
        }).from(guildMembers)
          .innerJoin(guilds, eq(guildMembers.guildId, guilds.id))
          .where(eq(guildMembers.userId, ctx.user.id))
          .limit(1);

        const dossierAligns = dossier?.factionAllegiance === input.faction;
        // Note: guilds use 3-faction enum (empire/insurgency/neutral), so
        // posting to "witness" requires dossier alignment specifically.
        const guildAligns = guildRows[0]?.guildFaction === input.faction;

        if (!dossierAligns && !guildAligns) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: `Only ${input.faction}-aligned players can post here.`,
          });
        }
      }

      const dossierRows = await db.select({ chosenName: roleplayDossier.chosenName })
        .from(roleplayDossier)
        .where(eq(roleplayDossier.userId, ctx.user.id))
        .limit(1);
      const guildRow = await db.select({ guildId: guildMembers.guildId })
        .from(guildMembers)
        .where(eq(guildMembers.userId, ctx.user.id))
        .limit(1);

      await db.insert(factionChannelPosts).values({
        faction: input.faction,
        authorUserId: ctx.user.id,
        authorGuildId: guildRow[0]?.guildId ?? null,
        authorChosenName: dossierRows[0]?.chosenName ?? ctx.user.name ?? null,
        message: input.message,
        tone: input.tone,
      });
      return { success: true };
    }),

  /* ═══ WITNESSED LEDGER ═══ */

  /**
   * Public ledger feed. Merges curated pins with recent ripple
   * events. Pins surface first; ripples follow chronologically.
   */
  ledgerFeed: publicProcedure
    .input(z.object({
      limit: z.number().int().min(1).max(100).default(40),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { pins: [], ripples: [] };
      const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

      const pins = await db.select().from(witnessedLedgerPins)
        .orderBy(desc(witnessedLedgerPins.pinnedAt))
        .limit(input.limit);
      const ripples = await db.select({
        id: rippleEvents.id,
        eventType: rippleEvents.eventType,
        userId: rippleEvents.userId,
        emittedAt: rippleEvents.emittedAt,
      }).from(rippleEvents)
        .where(gte(rippleEvents.emittedAt, since))
        .orderBy(desc(rippleEvents.emittedAt))
        .limit(input.limit);

      return { pins, ripples };
    }),

  /* ═══ CONFESSIONS ═══ */

  /** The current open Confession Booth — list all confessions for
   *  this ISO week, ordered by acquittal margin. */
  currentConfessions: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { weekKey: isoWeekKey(), confessions: [] };
    const weekKey = isoWeekKey();
    const rows = await db.select().from(confessions)
      .where(eq(confessions.weekKey, weekKey))
      .orderBy(desc(confessions.acquittals));
    return { weekKey, confessions: rows };
  }),

  /** Submit a confession for the current week. One per user per
   *  week — duplicates rejected via unique key. */
  submitConfession: protectedProcedure
    .input(z.object({
      text: z.string().min(20).max(500),
      trialCategory: z.enum(TRIAL_CATEGORIES),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const weekKey = isoWeekKey();
      try {
        await db.insert(confessions).values({
          userId: ctx.user.id,
          weekKey,
          text: input.text,
          trialCategory: input.trialCategory,
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (/duplicate|unique/i.test(msg)) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "You have already confessed this week.",
          });
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: msg });
      }
      return { success: true, weekKey };
    }),

  /** Vote on a confession. One vote per user per confession. */
  voteConfession: protectedProcedure
    .input(z.object({
      confessionId: z.number().int().positive(),
      verdict: z.enum(["acquit", "condemn", "abstain"]),
      reasoning: z.string().max(140).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Self-voting is permitted — the confessor can attach an
      // "abstain" with reasoning if they want, mirroring real
      // tribunals. We don't block it.

      try {
        await db.insert(confessionVotes).values({
          confessionId: input.confessionId,
          voterUserId: ctx.user.id,
          verdict: input.verdict,
          reasoning: input.reasoning ?? null,
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (/duplicate|unique/i.test(msg)) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "You have already voted on this confession.",
          });
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: msg });
      }

      // Bump the denormalized tally.
      const tallyCol = input.verdict === "acquit" ? "acquittals"
        : input.verdict === "condemn" ? "condemnations"
        : "abstentions";
      await db.update(confessions)
        .set({ [tallyCol]: sql`${tallyCol} + 1` } as any)
        .where(eq(confessions.id, input.confessionId));

      return { success: true };
    }),

  /** Past-weeks leaderboard — top 10 by acquittal margin. */
  confessionLeaderboard: publicProcedure
    .input(z.object({ weekKey: z.string().regex(/^\d{4}-W\d{2}$/).optional() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const weekKey = input.weekKey ?? isoWeekKey();
      return db.select().from(confessions)
        .where(eq(confessions.weekKey, weekKey))
        .orderBy(desc(sql`${confessions.acquittals} - ${confessions.condemnations}`))
        .limit(10);
    }),

  /* ═══ CHARTER + CELLS ═══ */

  /** Sign the guild charter — locks faction for 30 days, sets
   *  vocabulary tier, attaches presiding companion. Caller must be
   *  guild leader. */
  signGuildCharter: protectedProcedure
    .input(z.object({
      oath: z.string().max(280),
      vocabularyTier: z.enum(["rite", "edict", "weave", "compact"]),
      presidingCompanion: z.string().max(48).nullable().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const member = await db.select().from(guildMembers)
        .where(eq(guildMembers.userId, ctx.user.id)).limit(1);
      if (!member[0] || member[0].role !== "leader") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only the guild leader can sign the charter." });
      }
      const guildId = member[0].guildId;
      const lockUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      const existing = await db.select({ id: guildCharters.id }).from(guildCharters)
        .where(eq(guildCharters.guildId, guildId)).limit(1);

      if (existing[0]) {
        await db.update(guildCharters).set({
          oath: input.oath,
          vocabularyTier: input.vocabularyTier,
          presidingCompanion: input.presidingCompanion ?? null,
          signedByUserId: ctx.user.id,
          signedAt: new Date(),
          factionLockedUntil: lockUntil,
        }).where(eq(guildCharters.guildId, guildId));
      } else {
        await db.insert(guildCharters).values({
          guildId,
          oath: input.oath,
          vocabularyTier: input.vocabularyTier,
          presidingCompanion: input.presidingCompanion ?? null,
          signedByUserId: ctx.user.id,
          factionLockedUntil: lockUntil,
        });
      }
      return { success: true, factionLockedUntil: lockUntil };
    }),

  /** Read a guild's charter (public — for recruiting page). */
  getGuildCharter: publicProcedure
    .input(z.object({ guildId: z.number().int().positive() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const rows = await db.select().from(guildCharters)
        .where(eq(guildCharters.guildId, input.guildId)).limit(1);
      return rows[0] ?? null;
    }),

  /** List the cells of a guild. */
  listCells: publicProcedure
    .input(z.object({ guildId: z.number().int().positive() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(guildCells)
        .where(eq(guildCells.guildId, input.guildId))
        .orderBy(guildCells.id);
    }),

  /** Create a cell. Leader/officer only. Limit 6 cells per guild. */
  createCell: protectedProcedure
    .input(z.object({
      name: z.string().min(2).max(64),
      paletteToken: z.string().max(32).optional(),
      ethos: z.string().max(280).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const member = await db.select().from(guildMembers)
        .where(eq(guildMembers.userId, ctx.user.id)).limit(1);
      if (!member[0] || member[0].role === "member") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only officers can create cells." });
      }

      const cellCount = await db.select({ id: guildCells.id }).from(guildCells)
        .where(eq(guildCells.guildId, member[0].guildId));
      if (cellCount.length >= 6) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "A guild may have at most 6 cells." });
      }

      try {
        await db.insert(guildCells).values({
          guildId: member[0].guildId,
          name: input.name,
          paletteToken: input.paletteToken ?? null,
          ethos: input.ethos ?? null,
          leaderUserId: ctx.user.id,
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (/duplicate|unique/i.test(msg)) {
          throw new TRPCError({ code: "CONFLICT", message: "A cell by that name already exists in this guild." });
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: msg });
      }
      return { success: true };
    }),

  /** Assign a guild member to a cell. Caller must be officer+. */
  assignToCell: protectedProcedure
    .input(z.object({
      cellId: z.number().int().positive(),
      userId: z.number().int().positive(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const cellRows = await db.select().from(guildCells)
        .where(eq(guildCells.id, input.cellId)).limit(1);
      const cell = cellRows[0];
      if (!cell) throw new TRPCError({ code: "NOT_FOUND" });

      const callerMember = await db.select().from(guildMembers).where(and(
        eq(guildMembers.userId, ctx.user.id),
        eq(guildMembers.guildId, cell.guildId),
      )).limit(1);
      if (!callerMember[0] || callerMember[0].role === "member") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const targetMember = await db.select().from(guildMembers).where(and(
        eq(guildMembers.userId, input.userId),
        eq(guildMembers.guildId, cell.guildId),
      )).limit(1);
      if (!targetMember[0]) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Target is not a guildmate." });
      }

      // Remove any prior cell assignment for this user, then insert.
      await db.delete(guildCellMembers).where(eq(guildCellMembers.userId, input.userId));
      await db.insert(guildCellMembers).values({
        cellId: input.cellId,
        userId: input.userId,
      });
      return { success: true };
    }),

  /** Members of a cell. */
  listCellMembers: publicProcedure
    .input(z.object({ cellId: z.number().int().positive() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select({
        userId: guildCellMembers.userId,
        userName: users.name,
        joinedAt: guildCellMembers.joinedAt,
      }).from(guildCellMembers)
        .innerJoin(users, eq(guildCellMembers.userId, users.id))
        .where(eq(guildCellMembers.cellId, input.cellId));
    }),

  /* ═══ GUILD RITES ═══ */

  /** List upcoming and recent rites for the caller's guild. */
  listGuildRites: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    const member = await db.select().from(guildMembers)
      .where(eq(guildMembers.userId, ctx.user.id)).limit(1);
    if (!member[0]) return [];
    return db.select().from(guildRites)
      .where(eq(guildRites.guildId, member[0].guildId))
      .orderBy(desc(guildRites.scheduledAt))
      .limit(50);
  }),

  /** Schedule a rite. Officer+ only. */
  scheduleRite: protectedProcedure
    .input(z.object({
      riteType: z.enum(["naming", "witnessing", "tribunal", "investiture", "rite_of_passage", "other"]),
      title: z.string().min(2).max(140),
      description: z.string().max(2000).optional(),
      scheduledAt: z.coerce.date(),
      cellId: z.number().int().positive().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const member = await db.select().from(guildMembers)
        .where(eq(guildMembers.userId, ctx.user.id)).limit(1);
      if (!member[0] || member[0].role === "member") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      await db.insert(guildRites).values({
        guildId: member[0].guildId,
        riteType: input.riteType,
        title: input.title,
        description: input.description ?? null,
        scheduledAt: input.scheduledAt,
        hostUserId: ctx.user.id,
        cellId: input.cellId ?? null,
      });
      return { success: true };
    }),

  /** Cancel a rite. Host or officer+. */
  cancelRite: protectedProcedure
    .input(z.object({ riteId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const rows = await db.select().from(guildRites)
        .where(eq(guildRites.id, input.riteId)).limit(1);
      const rite = rows[0];
      if (!rite) throw new TRPCError({ code: "NOT_FOUND" });

      const member = await db.select().from(guildMembers).where(and(
        eq(guildMembers.userId, ctx.user.id),
        eq(guildMembers.guildId, rite.guildId),
      )).limit(1);
      const isHost = rite.hostUserId === ctx.user.id;
      const isOfficer = member[0] && member[0].role !== "member";
      if (!isHost && !isOfficer) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      await db.update(guildRites).set({ status: "cancelled" })
        .where(eq(guildRites.id, input.riteId));
      return { success: true };
    }),
});
