/* ═══════════════════════════════════════════════════════
   TIER 5 — OTHER-MODE PVP VARIANTS
   Circuit Rival Run, Trade Sector Control, Trade Oracle
   Duels, CADES Async PvP, TD Live Siege, Guild Skirmishes.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  circuitPvpMatches,
  tradeSectorControl,
  tradeOracleDuels,
  cadesPvpMatches,
  tdLiveSieges,
  guildWarSkirmishes,
  guildWarSkirmishMatches,
  guildMembers,
  guilds,
} from "../../db/schema";
import { eq, and, or, desc, sql, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";
import { mirrorRating } from "../services/competitiveRatingsService";
import { awardEligibleTitles } from "../services/titleService";
import { processClueDropEvent } from "../services/conspiracyService";
import { logger } from "../logger";

const TIER_BY_ELO = (elo: number): string => {
  if (elo >= 2200) return "grandmaster";
  if (elo >= 2000) return "master";
  if (elo >= 1800) return "diamond";
  if (elo >= 1600) return "platinum";
  if (elo >= 1400) return "gold";
  if (elo >= 1200) return "silver";
  return "bronze";
};

/* ─── 5A. Circuit Rival Run ─────────────────────────── */
const circuitPvpRouter = router({
  proposeMatch: protectedProcedure
    .input(z.object({ opponentId: z.number().int(), format: z.enum(["single_race", "survival_wars_3"]).optional() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const matchId = `circuit_${randomUUID().slice(0, 12)}`;
      const trackSeed = randomUUID().slice(0, 16);
      await db.insert(circuitPvpMatches).values({
        matchId,
        player1Id: ctx.user.id,
        player2Id: input.opponentId,
        trackSeed,
        format: input.format ?? "single_race",
        status: "active",
      });
      return { matchId, trackSeed, format: input.format ?? "single_race" };
    }),

  submitResult: protectedProcedure
    .input(z.object({
      matchId: z.string(),
      myScore: z.number().int().min(0),
      opponentScore: z.number().int().min(0),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const rows = await db
        .select()
        .from(circuitPvpMatches)
        .where(eq(circuitPvpMatches.matchId, input.matchId))
        .limit(1);
      const m = rows[0];
      if (!m) throw new TRPCError({ code: "NOT_FOUND" });
      if (m.status !== "active") throw new TRPCError({ code: "BAD_REQUEST", message: "Not active" });
      const isP1 = m.player1Id === ctx.user.id;
      if (!isP1 && m.player2Id !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not in this match" });
      }
      const winnerId = input.myScore > input.opponentScore
        ? ctx.user.id
        : input.myScore < input.opponentScore
          ? (isP1 ? m.player2Id : m.player1Id)
          : null;
      await db
        .update(circuitPvpMatches)
        .set({
          player1Score: isP1 ? input.myScore : input.opponentScore,
          player2Score: isP1 ? input.opponentScore : input.myScore,
          winnerId: winnerId ?? undefined,
          status: "completed",
          endedAt: new Date(),
        })
        .where(eq(circuitPvpMatches.matchId, input.matchId));

      // Mirror ratings + grant titles + drop clues.
      const opponentId = isP1 ? m.player2Id : m.player1Id;
      const won = winnerId === ctx.user.id;
      // Coarse ELO bump — proper ELO needs the opposing rating row too.
      mirrorRating({
        userId: ctx.user.id,
        gameType: "circuit_1v1",
        currentElo: 1200 + (won ? 25 : -10),
        rankTier: TIER_BY_ELO(1200 + (won ? 25 : -10)),
        result: won ? { win: true } : { loss: true },
      }).catch(() => {});
      awardEligibleTitles(ctx.user.id, won
        ? { kind: "pvp_match_won", userId: ctx.user.id, gameType: "circuit_1v1", newTier: 0, totalWins: 1 }
        : { kind: "pvp_match_lost", userId: ctx.user.id, gameType: "circuit_1v1" }
      ).catch(() => {});
      processClueDropEvent(ctx.user.id, won ? "pvp_card_win" : "pvp_card_loss").catch(() => {});
      return { winnerId, ok: true };
    }),

  getMyMatches: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(50).optional() }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(circuitPvpMatches)
        .where(or(eq(circuitPvpMatches.player1Id, ctx.user.id), eq(circuitPvpMatches.player2Id, ctx.user.id)))
        .orderBy(desc(circuitPvpMatches.startedAt))
        .limit(input?.limit ?? 20);
    }),
});

/* ─── 5B. Trade Empire Sector Control + Oracle Duels ──── */
const tradePvpRouter = router({
  /** Get current Sector Lord + leaderboard for a sector this week. */
  getSectorState: publicProcedure
    .input(z.object({ sectorId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const weekStart = currentWeekAnchor();
      const rows = await db
        .select()
        .from(tradeSectorControl)
        .where(
          and(
            eq(tradeSectorControl.sectorId, input.sectorId),
            eq(tradeSectorControl.weekStart, weekStart),
          ),
        )
        .limit(1);
      return rows[0] ?? null;
    }),

  /** Contribute to sector control (called from completed Trade missions). */
  contributeToSector: protectedProcedure
    .input(z.object({ sectorId: z.string(), points: z.number().int().min(1).max(10000) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const weekStart = currentWeekAnchor();
      const rows = await db
        .select()
        .from(tradeSectorControl)
        .where(
          and(
            eq(tradeSectorControl.sectorId, input.sectorId),
            eq(tradeSectorControl.weekStart, weekStart),
          ),
        )
        .limit(1);
      if (!rows[0]) {
        await db.insert(tradeSectorControl).values({
          sectorId: input.sectorId,
          weekStart,
          contributionScores: { [String(ctx.user.id)]: input.points } as Record<string, number>,
          lordUserId: ctx.user.id,
        });
        return { ok: true, lordChanged: true };
      }
      const scores = { ...(rows[0].contributionScores ?? {}) };
      const userKey = String(ctx.user.id);
      scores[userKey] = (scores[userKey] ?? 0) + input.points;
      // Determine new lord (highest contributor).
      const [topUserKey] = Object.entries(scores).sort((a, b) => b[1] - a[1])[0] ?? ["", 0];
      const newLord = topUserKey ? Number(topUserKey) : null;
      const lordChanged = newLord !== null && newLord !== rows[0].lordUserId;
      await db
        .update(tradeSectorControl)
        .set({
          contributionScores: scores,
          lordUserId: newLord ?? rows[0].lordUserId,
        })
        .where(eq(tradeSectorControl.id, rows[0].id));
      if (lordChanged && newLord) {
        awardEligibleTitles(newLord, {
          kind: "guild_war_won",
          userId: newLord,
          territoryKey: input.sectorId,
        }).catch(() => {});
      }
      return { ok: true, lordChanged };
    }),

  proposeOracleDuel: protectedProcedure
    .input(z.object({
      opponentId: z.number().int(),
      sectorId: z.string(),
      strikePrice: z.number().int().min(1),
      myPosition: z.enum(["call", "put"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const duelId = `oracle_${randomUUID().slice(0, 12)}`;
      const settlesAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await db.insert(tradeOracleDuels).values({
        duelId,
        callerUserId: input.myPosition === "call" ? ctx.user.id : input.opponentId,
        putUserId: input.myPosition === "put" ? ctx.user.id : input.opponentId,
        sectorId: input.sectorId,
        strikePrice: input.strikePrice,
        settlesAt,
      });
      return { duelId, settlesAt };
    }),

  settleOracleDuel: protectedProcedure
    .input(z.object({ duelId: z.string(), settlementPrice: z.number().int() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const rows = await db
        .select()
        .from(tradeOracleDuels)
        .where(eq(tradeOracleDuels.duelId, input.duelId))
        .limit(1);
      const d = rows[0];
      if (!d) throw new TRPCError({ code: "NOT_FOUND" });
      if (d.status !== "open") throw new TRPCError({ code: "BAD_REQUEST", message: "Already settled" });
      // Caller wins if settlement > strike; put wins if settlement < strike.
      const winnerId = input.settlementPrice > d.strikePrice
        ? d.callerUserId
        : input.settlementPrice < d.strikePrice
          ? d.putUserId
          : null;
      await db
        .update(tradeOracleDuels)
        .set({
          settlementPrice: input.settlementPrice,
          winnerId: winnerId ?? undefined,
          status: "settled",
          settledAt: new Date(),
        })
        .where(eq(tradeOracleDuels.id, d.id));
      // Mirror ratings + grant titles for both sides.
      for (const uid of [d.callerUserId, d.putUserId]) {
        const won = winnerId === uid;
        mirrorRating({
          userId: uid,
          gameType: "trade_oracle_duel",
          currentElo: 1200 + (won ? 20 : -10),
          rankTier: TIER_BY_ELO(1200 + (won ? 20 : -10)),
          result: winnerId === null ? { draw: true } : won ? { win: true } : { loss: true },
        }).catch(() => {});
        awardEligibleTitles(uid, won
          ? { kind: "pvp_match_won", userId: uid, gameType: "trade_oracle_duel", newTier: 0, totalWins: 1 }
          : { kind: "pvp_match_lost", userId: uid, gameType: "trade_oracle_duel" }
        ).catch(() => {});
      }
      return { winnerId };
    }),

  getMyOracleDuels: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(50).optional() }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(tradeOracleDuels)
        .where(or(eq(tradeOracleDuels.callerUserId, ctx.user.id), eq(tradeOracleDuels.putUserId, ctx.user.id)))
        .orderBy(desc(tradeOracleDuels.openedAt))
        .limit(input?.limit ?? 20);
    }),
});

/* ─── 5C. CADES FPS Async PvP ───────────────────────── */
const cadesPvpRouter = router({
  proposeMatch: protectedProcedure
    .input(z.object({
      opponentId: z.number().int(),
      scenarioMode: z.enum(["last_stand", "ship_defense", "historical_incursion"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const matchId = `cades_${randomUUID().slice(0, 12)}`;
      const scenarioSeed = randomUUID().slice(0, 16);
      await db.insert(cadesPvpMatches).values({
        matchId,
        player1Id: ctx.user.id,
        player2Id: input.opponentId,
        scenarioSeed,
        scenarioMode: input.scenarioMode ?? "last_stand",
      });
      return { matchId, scenarioSeed };
    }),

  submitScore: protectedProcedure
    .input(z.object({ matchId: z.string(), score: z.number().int().min(0).max(1_000_000) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const rows = await db
        .select()
        .from(cadesPvpMatches)
        .where(eq(cadesPvpMatches.matchId, input.matchId))
        .limit(1);
      const m = rows[0];
      if (!m) throw new TRPCError({ code: "NOT_FOUND" });
      const isP1 = m.player1Id === ctx.user.id;
      if (!isP1 && m.player2Id !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      // Once-per-player-per-match. Without this the handler
      // overwrites the caller's score on every call AND, once both
      // scores are present, re-runs the completion block — mirrorRating
      // (+20 ELO) and awardEligibleTitles — on each resubmission. That
      // is an unbounded ELO/title farm: finish once, then re-POST. A
      // legitimate client submits exactly once, so rejecting a second
      // submission is correct, not a UX regression.
      const alreadySubmitted = isP1
        ? m.player1Score != null
        : m.player2Score != null;
      if (alreadySubmitted) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Score already submitted for this match",
        });
      }
      // T13.7 — anti-cheat clamp. Per the design doc the
      // composite score formula is `waves × 10 + kills`. For
      // last_stand mode the theoretical ceiling at 30 waves +
      // 100 kills is 400; for ship_defense and historical_incursions
      // it's higher. Hard-cap at 50,000 to deflect obvious
      // tampering while still allowing perfect-clear scores.
      // The frontend caps at 1M (zod) as a basic sanity floor;
      // the harder gameplay-aware cap lives here.
      if (input.score > 50_000) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Score above plausible ceiling — possible tampering",
        });
      }
      const updates: Record<string, unknown> = isP1 ? { player1Score: input.score } : { player2Score: input.score };
      const newStatus = isP1
        ? (m.player2Score != null ? "completed" : "p1_done")
        : (m.player1Score != null ? "completed" : "p2_done");
      updates.status = newStatus;
      if (newStatus === "completed") {
        updates.endedAt = new Date();
        const p1 = isP1 ? input.score : (m.player1Score ?? 0);
        const p2 = isP1 ? (m.player2Score ?? 0) : input.score;
        updates.winnerId = p1 > p2 ? m.player1Id : p2 > p1 ? m.player2Id : null;
      }
      await db.update(cadesPvpMatches).set(updates).where(eq(cadesPvpMatches.id, m.id));

      if (newStatus === "completed") {
        const p1 = isP1 ? input.score : (m.player1Score ?? 0);
        const p2 = isP1 ? (m.player2Score ?? 0) : input.score;
        const winner = p1 > p2 ? m.player1Id : p2 > p1 ? m.player2Id : null;
        for (const uid of [m.player1Id, m.player2Id ?? 0]) {
          if (!uid) continue;
          const won = winner === uid;
          mirrorRating({
            userId: uid,
            gameType: "cades_async_1v1",
            currentElo: 1200 + (won ? 20 : -10),
            rankTier: TIER_BY_ELO(1200 + (won ? 20 : -10)),
            result: winner === null ? { draw: true } : won ? { win: true } : { loss: true },
          }).catch(() => {});
          awardEligibleTitles(uid, won
            ? { kind: "pvp_match_won", userId: uid, gameType: "cades_async_1v1", newTier: 0, totalWins: 1 }
            : { kind: "pvp_match_lost", userId: uid, gameType: "cades_async_1v1" }
          ).catch(() => {});
        }
      }
      return { status: newStatus };
    }),

  getMyMatches: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(50).optional() }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(cadesPvpMatches)
        .where(or(eq(cadesPvpMatches.player1Id, ctx.user.id), eq(cadesPvpMatches.player2Id, ctx.user.id)))
        .orderBy(desc(cadesPvpMatches.startedAt))
        .limit(input?.limit ?? 20);
    }),
});

/* ─── 5D. Tower Defense Live Siege ──────────────────── */
const tdLiveSiegeRouter = router({
  startSiege: protectedProcedure
    .input(z.object({ defenderId: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const siegeId = `siege_${randomUUID().slice(0, 12)}`;
      await db.insert(tdLiveSieges).values({
        siegeId,
        attackerUserId: ctx.user.id,
        defenderUserId: input.defenderId,
      });
      return { siegeId };
    }),

  completeSiege: protectedProcedure
    .input(z.object({
      siegeId: z.string(),
      starsAwarded: z.number().int().min(0).max(3),
      waveCount: z.number().int().min(0),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const rows = await db
        .select()
        .from(tdLiveSieges)
        .where(eq(tdLiveSieges.siegeId, input.siegeId))
        .limit(1);
      const s = rows[0];
      if (!s) throw new TRPCError({ code: "NOT_FOUND" });
      if (s.attackerUserId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only attacker submits result" });
      }
      const defenseHeld = input.starsAwarded === 0 ? 1 : 0;
      // Trophy delta: +30 for 3-star, +20 for 2, +10 for 1, -15 for full defense.
      const trophyDelta = input.starsAwarded >= 3 ? 30 : input.starsAwarded === 2 ? 20 : input.starsAwarded === 1 ? 10 : -15;
      await db
        .update(tdLiveSieges)
        .set({
          starsAwarded: input.starsAwarded,
          waveCount: input.waveCount,
          defenseHeld,
          trophyDelta,
          status: "completed",
          endedAt: new Date(),
        })
        .where(eq(tdLiveSieges.id, s.id));
      // Mirror + grant for both sides.
      for (const [uid, isAttacker] of [[s.attackerUserId, true], [s.defenderUserId, false]] as const) {
        const delta = isAttacker ? trophyDelta : -trophyDelta;
        mirrorRating({
          userId: uid,
          gameType: "td_raid",
          currentElo: 1200 + delta,
          rankTier: TIER_BY_ELO(1200 + delta),
          result: isAttacker
            ? (input.starsAwarded >= 1 ? { win: true } : { loss: true })
            : (input.starsAwarded === 0 ? { win: true } : { loss: true }),
        }).catch(() => {});
        awardEligibleTitles(uid, isAttacker && input.starsAwarded >= 1
          ? { kind: "pvp_match_won", userId: uid, gameType: "td_raid", newTier: 0, totalWins: 1 }
          : { kind: "pvp_match_lost", userId: uid, gameType: "td_raid" }
        ).catch(() => {});
      }
      return { trophyDelta, defenseHeld };
    }),

  getMySieges: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(50).optional() }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(tdLiveSieges)
        .where(or(eq(tdLiveSieges.attackerUserId, ctx.user.id), eq(tdLiveSieges.defenderUserId, ctx.user.id)))
        .orderBy(desc(tdLiveSieges.startedAt))
        .limit(input?.limit ?? 20);
    }),
});

/* ─── 5E. Guild Skirmishes (mode-mix bracket) ──────── */
const guildSkirmishRouter = router({
  declareSkirmish: protectedProcedure
    .input(z.object({ rivalGuildId: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      // Caller must be guild leader/officer.
      const callerMembership = await db
        .select()
        .from(guildMembers)
        .where(eq(guildMembers.userId, ctx.user.id))
        .limit(1);
      if (!callerMembership[0]) throw new TRPCError({ code: "FORBIDDEN", message: "Not in a guild" });
      if (callerMembership[0].role !== "leader" && callerMembership[0].role !== "officer") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Officers + leaders only" });
      }
      if (callerMembership[0].guildId === input.rivalGuildId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot skirmish self" });
      }
      const skirmishId = `skirm_${randomUUID().slice(0, 12)}`;
      await db.insert(guildWarSkirmishes).values({
        skirmishId,
        guildAId: callerMembership[0].guildId,
        guildBId: input.rivalGuildId,
      });
      return { skirmishId };
    }),

  acceptSkirmish: protectedProcedure
    .input(z.object({ skirmishId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const rows = await db
        .select()
        .from(guildWarSkirmishes)
        .where(eq(guildWarSkirmishes.skirmishId, input.skirmishId))
        .limit(1);
      const s = rows[0];
      if (!s) throw new TRPCError({ code: "NOT_FOUND" });
      if (s.status !== "proposed") throw new TRPCError({ code: "BAD_REQUEST", message: "Already accepted" });
      // Acceptor must be from guildB.
      const membership = await db
        .select()
        .from(guildMembers)
        .where(eq(guildMembers.userId, ctx.user.id))
        .limit(1);
      if (!membership[0] || membership[0].guildId !== s.guildBId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Wrong guild" });
      }
      if (membership[0].role !== "leader" && membership[0].role !== "officer") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Officers + leaders only" });
      }
      await db
        .update(guildWarSkirmishes)
        .set({ status: "active", acceptedAt: new Date() })
        .where(eq(guildWarSkirmishes.id, s.id));
      return { ok: true };
    }),

  submitMatchResult: protectedProcedure
    .input(z.object({
      skirmishId: z.string(),
      mode: z.enum(["card_duel", "chess", "td_live", "cades"]),
      guildAPlayerId: z.number().int(),
      guildBPlayerId: z.number().int(),
      outcome: z.enum(["guild_a", "guild_b", "tied"]),
      underlyingMatchId: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const skirmishRows = await db
        .select()
        .from(guildWarSkirmishes)
        .where(eq(guildWarSkirmishes.skirmishId, input.skirmishId))
        .limit(1);
      const s = skirmishRows[0];
      if (!s) throw new TRPCError({ code: "NOT_FOUND" });
      if (s.status !== "active") throw new TRPCError({ code: "BAD_REQUEST", message: "Not active" });

      await db.insert(guildWarSkirmishMatches).values({
        skirmishId: input.skirmishId,
        mode: input.mode,
        guildAPlayerId: input.guildAPlayerId,
        guildBPlayerId: input.guildBPlayerId,
        outcome: input.outcome,
        underlyingMatchId: input.underlyingMatchId,
      });

      const newOutcomes = { ...(s.modeOutcomes ?? {}) };
      newOutcomes[input.mode] = input.outcome;
      const guildAWins = Object.values(newOutcomes).filter((o) => o === "guild_a").length;
      const guildBWins = Object.values(newOutcomes).filter((o) => o === "guild_b").length;
      const totalDecided = Object.values(newOutcomes).filter((o) => o !== "tied" && o !== "pending").length;
      let winnerGuildId: number | null = null;
      let status: "active" | "completed" = "active";
      // Best-of-4 — first to 3 OR all 4 played.
      if (guildAWins >= 3) {
        winnerGuildId = s.guildAId;
        status = "completed";
      } else if (guildBWins >= 3) {
        winnerGuildId = s.guildBId;
        status = "completed";
      } else if (totalDecided >= 4) {
        winnerGuildId = guildAWins > guildBWins ? s.guildAId : guildBWins > guildAWins ? s.guildBId : null;
        status = "completed";
      }
      await db
        .update(guildWarSkirmishes)
        .set({
          modeOutcomes: newOutcomes,
          winnerGuildId: winnerGuildId ?? undefined,
          status,
          completedAt: status === "completed" ? new Date() : undefined,
        })
        .where(eq(guildWarSkirmishes.id, s.id));

      // Title grant for participating guild members on win.
      if (winnerGuildId) {
        const winningMembers = await db
          .select({ userId: guildMembers.userId })
          .from(guildMembers)
          .where(eq(guildMembers.guildId, winnerGuildId));
        for (const m of winningMembers) {
          awardEligibleTitles(m.userId, {
            kind: "guild_skirmish_won",
            userId: m.userId,
          }).catch(() => {});
        }
        logger.info("guild_skirmish_completed", "tier5Pvp", {
          skirmishId: input.skirmishId,
          winnerGuildId,
        });
      }
      return { winnerGuildId, status };
    }),

  getMySkirmishes: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(50).optional() }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];
      const member = await db
        .select()
        .from(guildMembers)
        .where(eq(guildMembers.userId, ctx.user.id))
        .limit(1);
      if (!member[0]) return [];
      return db
        .select()
        .from(guildWarSkirmishes)
        .where(or(
          eq(guildWarSkirmishes.guildAId, member[0].guildId),
          eq(guildWarSkirmishes.guildBId, member[0].guildId),
        ))
        .orderBy(desc(guildWarSkirmishes.declaredAt))
        .limit(input?.limit ?? 20);
    }),
});

/** Compute the start of the current week (Mon 00:00 UTC). */
function currentWeekAnchor(): Date {
  const now = new Date();
  const dayOfWeek = now.getUTCDay() || 7;
  const monday = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() - (dayOfWeek - 1),
  ));
  return monday;
}

export const tier5PvpRouter = router({
  circuit: circuitPvpRouter,
  trade: tradePvpRouter,
  cades: cadesPvpRouter,
  tdLiveSiege: tdLiveSiegeRouter,
  guildSkirmish: guildSkirmishRouter,
});
