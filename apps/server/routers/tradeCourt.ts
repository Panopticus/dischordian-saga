/* ═══════════════════════════════════════════════════════
   TRADE COURT ROUTER — phase 2 of the items-matter /
   Game-of-Thrones arc. Read-only endpoints exposing the
   sub-house reputation map, the season-clock state, the
   active declaration, and the recent public-knowledge feed.

   Write paths (signing exclusive retainers, paying tributes,
   refusing demands) live on the existing tradeContracts and
   tradeEmpire routers — this router only surfaces state for
   the court widget UI to render.
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { cards, userCards } from "../../db/schema";
import { logger } from "../logger";

import {
  SUB_HOUSE_REGISTRY,
  factionForHouse,
  isKnownSubHouseKey,
  subHousesInFaction,
} from "@shared/tradeEmpire/houses";
import {
  acceptsContractSignings,
  tickAdvancesAgendas,
} from "@shared/tradeEmpire/season";
import { allDeclarationKeys } from "@shared/tradeEmpire/declarations";
import {
  craftMethodWeight,
  isAcceptableTribute,
  obtainedViaToCraftMethod,
  tagForCard,
} from "@shared/tradeEmpire/itemTags";
import type { Faction } from "@shared/tcg-core/types/Card";

import {
  applySubHouseRepDelta,
  getAllSubHouseReputation,
  getFactionReputationRollup,
  getSubHouseReputation,
} from "../services/subHouseReputationService";
import { seasonClockService } from "../services/seasonClockService";
import {
  getRecentPublicKnowledge,
  getPublicKnowledgeForHouse,
  postPublicKnowledge,
} from "../services/publicKnowledgeService";
import {
  counterAgendaStep,
  describeCounterCost,
  getMyAgendaProgress,
  tickUserAgendas,
} from "../services/agendaEngine";
import {
  forgeDemandSubstitute,
  listMyDemands,
  payDemand,
  refuseDemand,
} from "../services/demandService";
import {
  discoverAnomaly,
  listMyAnomalies,
  spendIntelligenceOnAnomaly,
} from "../services/anomalyService";
import {
  appendDynastyBookEntry,
  betrayAlliance,
  chooseSuccessor,
  declareAlliance,
  dismissNewsDigest,
  getActiveEdict,
  getDynasty,
  getNewsDigest,
  issueEdict,
  listMyAlliances,
  nameDynasty,
} from "../services/empireFeelService";
import { allEdictKeys, EDICT_REGISTRY } from "@shared/tradeEmpire/edicts";
import { isKnownSubHouseKey as _isKnownSubHouseKey } from "@shared/tradeEmpire/houses";
import { REFERENCE_AGENDAS } from "@shared/tradeEmpire/agendas";
import { spaceStations, towerPlacements, userProgress } from "../../db/schema";
import { allKnownMunitionRefs, getMunitionEffect, TOWERS } from "@shared/towerDefense";
import { inArray } from "drizzle-orm";
import { dischordiaCycleService } from "../services/dischordiaCycleService";

export const tradeCourtRouter = router({
  /** Static registry — sub-house defs + their internal rivals. */
  listHouses: publicProcedure.query(() => {
    return Object.values(SUB_HOUSE_REGISTRY).map(h => ({
      houseKey: h.houseKey,
      name: h.name,
      factionId: h.factionId,
      rivalHouseKey: h.rivalHouseKey,
      blurb: h.blurb,
      rivalryIntensity: h.rivalryIntensity,
      unalignable: h.unalignable ?? false,
      primaryNpcKey: h.primaryNpcKey ?? null,
      primarySectorId: h.primarySectorId ?? null,
    }));
  }),

  /** Static registry — declaration keys only (full shape lives shared-side). */
  listDeclarationKeys: publicProcedure.query(() => allDeclarationKeys()),

  /** Per-user reputation for every sub-house. */
  myReputation: protectedProcedure.query(async ({ ctx }) => {
    return getAllSubHouseReputation(ctx.user.id);
  }),

  /** Per-user reputation for a single sub-house. */
  myReputationForHouse: protectedProcedure
    .input(z.object({ houseKey: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!isKnownSubHouseKey(input.houseKey)) {
        return null;
      }
      return getSubHouseReputation(ctx.user.id, input.houseKey);
    }),

  /** Top-level faction rep — mean of the faction's sub-house reps. */
  myFactionRollup: protectedProcedure.query(async ({ ctx }) => {
    return getFactionReputationRollup(ctx.user.id);
  }),

  /** All sub-houses inside a faction. */
  housesInFaction: publicProcedure
    .input(z.object({ factionId: z.string() }))
    .query(({ input }) => subHousesInFaction(input.factionId as never)),

  /** Current season clock state. */
  seasonState: publicProcedure.query(() => {
    const state = seasonClockService.getState();
    return {
      ...state,
      acceptsContractSignings: acceptsContractSignings(state.phase),
      tickAdvancesAgendas: tickAdvancesAgendas(state.phase),
    };
  }),

  /** Recent public-knowledge events (synchronous from cache). */
  recentNews: publicProcedure
    .input(z.object({ limit: z.number().int().min(1).max(200).optional() }))
    .query(({ input }) => {
      return getRecentPublicKnowledge(input.limit ?? 50);
    }),

  /** Public-knowledge feed for one house (DB-backed). */
  newsForHouse: publicProcedure
    .input(
      z.object({
        houseKey: z.string(),
        limit: z.number().int().min(1).max(200).optional(),
        seasonNumber: z.number().int().positive().optional(),
      }),
    )
    .query(async ({ input }) => {
      if (!isKnownSubHouseKey(input.houseKey)) return [];
      return getPublicKnowledgeForHouse(input.houseKey, {
        limit: input.limit,
        seasonNumber: input.seasonNumber,
      });
    }),

  /**
   * Combined "court widget" payload — what the UI needs in a
   * single round-trip. Returns null houses for unalignable entries
   * so the UI can grey them out without filtering client-side.
   */
  courtSnapshot: protectedProcedure.query(async ({ ctx }) => {
    const [reps, rollup, demands, agendaProgress] = await Promise.all([
      getAllSubHouseReputation(ctx.user.id),
      getFactionReputationRollup(ctx.user.id),
      listMyDemands(ctx.user.id),
      getMyAgendaProgress(ctx.user.id),
    ]);
    const season = seasonClockService.getState();
    const news = getRecentPublicKnowledge(20);

    const houses = reps.map(r => {
      const def = SUB_HOUSE_REGISTRY[r.houseKey];
      return {
        houseKey: r.houseKey,
        name: def.name,
        factionId: def.factionId,
        rivalHouseKey: def.rivalHouseKey,
        blurb: def.blurb,
        unalignable: def.unalignable ?? false,
        reputation: r.reputation,
        peakReputation: r.peakReputation,
      };
    });

    const pendingDemands = demands.filter(d => d.status === "pending");

    return {
      season: {
        ...season,
        acceptsContractSignings: acceptsContractSignings(season.phase),
        tickAdvancesAgendas: tickAdvancesAgendas(season.phase),
      },
      houses,
      factionRollup: rollup,
      recentNews: news,
      pendingDemands,
      agendaProgress,
    };
  }),

  /** Internal helper — used by tests + admin tools. */
  _factionForHouse: publicProcedure
    .input(z.object({ houseKey: z.string() }))
    .query(({ input }) => {
      if (!isKnownSubHouseKey(input.houseKey)) return null;
      return factionForHouse(input.houseKey);
    }),

  // --- Agenda endpoints (phase 4) -----------------------------------------

  /** Static agenda registry — projected for the court widget. */
  listAgendas: publicProcedure.query(() => {
    return REFERENCE_AGENDAS.map(a => ({
      agendaKey: a.agendaKey,
      npcKey: a.npcKey,
      name: a.name,
      primaryHouseKey: a.primaryHouseKey,
      threatenedHouseKey: a.threatenedHouseKey,
      stages: a.stages.map(s => ({
        stageId: s.stageId,
        label: s.label,
        tickOffset: s.tickOffset,
        worldStepSummary: s.worldStepSummary,
        counterDescription: s.counter.description,
        counterCostText: describeCounterCost(s.counter.cost),
      })),
      minAct: a.minAct ?? null,
      requiresRevealStage: a.requiresRevealStage ?? null,
    }));
  }),

  /** Per-user agenda progress in the current season. */
  myAgendaProgress: protectedProcedure.query(async ({ ctx }) => {
    return getMyAgendaProgress(ctx.user.id);
  }),

  /**
   * Player counter for an agenda stage. The cost has been validated +
   * consumed by the *triggering* endpoint (sign for contract_signed,
   * payTribute for tribute, etc.) — this just records the counter
   * effect. For the small-cost paths (credits / influence) we
   * consume here directly off userProgress.gameData.
   */
  counterAgendaStep: protectedProcedure
    .input(
      z.object({
        agendaKey: z.string(),
        stageId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const agenda = REFERENCE_AGENDAS.find(a => a.agendaKey === input.agendaKey);
      if (!agenda) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `unknown agenda ${input.agendaKey}`,
        });
      }
      const stage = agenda.stages.find(s => s.stageId === input.stageId);
      if (!stage) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `unknown stage ${input.stageId}`,
        });
      }

      // Consume credits/influence costs here. Tribute and contract-
      // signed costs are validated and consumed by their own
      // endpoints, then those endpoints call this mutation by
      // server-side dispatch (phase 4.1 will wire that).
      const cost = stage.counter.cost;
      if (cost.kind === "credits" || cost.kind === "influence") {
        const db = await getDb();
        if (db) {
          const rows = await db
            .select()
            .from(userProgress)
            .where(eq(userProgress.userId, userId))
            .limit(1);
          const row = rows[0];
          type AnyRecord = Record<string, unknown>;
          const gameData = (row?.gameData as AnyRecord) ?? {};
          const balanceKey = cost.kind === "credits" ? "credits" : "influence";
          const balanceMap = (gameData[balanceKey] as Record<string, number>) ?? {};
          const current =
            cost.kind === "credits"
              ? Number((gameData["credits"] as number | undefined) ?? 0)
              : Number((gameData["influence"] as number | undefined) ?? 0);
          if (current < cost.amount) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: `insufficient ${cost.kind} (have ${current}, need ${cost.amount})`,
            });
          }
          const next = { ...gameData, [cost.kind]: current - cost.amount };
          if (row) {
            await db
              .update(userProgress)
              .set({ gameData: next })
              .where(eq(userProgress.userId, userId));
          }
          // The unused balanceMap reference quiet — kept for future
          // extension to per-faction bucketed balances.
          void balanceMap;
        }
      } else if (cost.kind === "none") {
        // No cost; proceed.
      } else {
        // Other cost kinds must be paid through the dedicated
        // endpoint (tribute / contract sign). Reject here so callers
        // don't think they're getting a free counter.
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `cost kind ${cost.kind} requires the dedicated endpoint`,
        });
      }

      const result = await counterAgendaStep(userId, input.agendaKey, input.stageId);
      if (!result) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "agenda stage is not in a counterable state",
        });
      }
      return { ok: true, ...result };
    }),

  /**
   * Admin / test-only: tick the current user's agendas once. Wired
   * here for the e2e smoke test in the plan's verification section.
   * Real tick scheduling lives in a separate phase-4.1 cron.
   */
  _tickMyAgendas: protectedProcedure.mutation(async ({ ctx }) => {
    const results = await tickUserAgendas(ctx.user.id);
    return { ok: true, results };
  }),

  // --- Demand endpoints (phase 7) -----------------------------------------

  myDemands: protectedProcedure.query(async ({ ctx }) => {
    return listMyDemands(ctx.user.id);
  }),

  payDemand: protectedProcedure
    .input(
      z.object({
        demandId: z.number().int().positive(),
        cardId: z.string(),
        isFoil: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await payDemand({
        userId: ctx.user.id,
        demandId: input.demandId,
        cardId: input.cardId,
        isFoil: input.isFoil,
      });
      if (!result.ok) {
        throw new TRPCError({ code: "BAD_REQUEST", message: result.error });
      }
      return result;
    }),

  refuseDemand: protectedProcedure
    .input(z.object({ demandId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const result = await refuseDemand(ctx.user.id, input.demandId);
      if (!result.ok) {
        throw new TRPCError({ code: "BAD_REQUEST", message: result.error });
      }
      return result;
    }),

  /**
   * Phase 9: forge a substitute. Consume suit-materials and roll
   * against the receiving sub-house's detection threshold. Pass =
   * tiny payment; detection = worse than refusal.
   */
  forgeDemandSubstitute: protectedProcedure
    .input(
      z.object({
        demandId: z.number().int().positive(),
        materialsToConsume: z
          .array(
            z.object({
              materialId: z.string(),
              count: z.number().int().positive(),
            }),
          )
          .min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await forgeDemandSubstitute({
        userId: ctx.user.id,
        demandId: input.demandId,
        materialsToConsume: input.materialsToConsume,
      });
      if (!result.ok) {
        throw new TRPCError({ code: "BAD_REQUEST", message: result.error });
      }
      return result;
    }),

  // --- Empire-feel endpoints (Phase D) -----------------------------------

  // Alliances
  declareAlliance: protectedProcedure
    .input(z.object({ houseAKey: z.string(), houseBKey: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!_isKnownSubHouseKey(input.houseAKey) || !_isKnownSubHouseKey(input.houseBKey)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "unknown sub-house" });
      }
      const result = await declareAlliance(
        ctx.user.id,
        input.houseAKey,
        input.houseBKey,
      );
      if (!result.ok) {
        throw new TRPCError({ code: "BAD_REQUEST", message: result.error });
      }
      return result;
    }),

  betrayAlliance: protectedProcedure
    .input(z.object({ allianceId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const result = await betrayAlliance(ctx.user.id, input.allianceId);
      if (!result.ok) {
        throw new TRPCError({ code: "BAD_REQUEST", message: result.error });
      }
      return result;
    }),

  myAlliances: protectedProcedure.query(async ({ ctx }) => {
    return listMyAlliances(ctx.user.id);
  }),

  // Dynasty
  myDynasty: protectedProcedure.query(async ({ ctx }) => {
    return getDynasty(ctx.user.id);
  }),

  nameDynasty: protectedProcedure
    .input(z.object({ houseName: z.string().min(1).max(128) }))
    .mutation(async ({ ctx, input }) => {
      const result = await nameDynasty(ctx.user.id, input.houseName);
      if (!result.ok) {
        throw new TRPCError({ code: "BAD_REQUEST", message: result.error });
      }
      return result;
    }),

  chooseSuccessor: protectedProcedure
    .input(z.object({ successorNpcKey: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const result = await chooseSuccessor(ctx.user.id, input.successorNpcKey);
      if (!result.ok) {
        throw new TRPCError({ code: "BAD_REQUEST", message: result.error });
      }
      return result;
    }),

  appendDynastyBookEntry: protectedProcedure
    .input(
      z.object({
        kind: z.string(),
        summary: z.string(),
        payload: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await appendDynastyBookEntry(ctx.user.id, input);
      return { ok: true };
    }),

  // Edicts
  listEdicts: publicProcedure.query(() => {
    return allEdictKeys().map(k => EDICT_REGISTRY[k]);
  }),

  myActiveEdict: protectedProcedure.query(async ({ ctx }) => {
    return getActiveEdict(ctx.user.id);
  }),

  issueEdict: protectedProcedure
    .input(z.object({ edictKey: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const result = await issueEdict(ctx.user.id, input.edictKey);
      if (!result.ok) {
        throw new TRPCError({ code: "BAD_REQUEST", message: result.error });
      }
      return result;
    }),

  // While-you-were-gone digest
  newsDigest: protectedProcedure.query(async ({ ctx }) => {
    return getNewsDigest(ctx.user.id);
  }),

  dismissNewsDigest: protectedProcedure
    .input(z.object({ eventId: z.number().int().nonnegative() }))
    .mutation(async ({ ctx, input }) => {
      await dismissNewsDigest(ctx.user.id, input.eventId);
      return { ok: true };
    }),

  // --- Anomaly endpoints (Phase B) ---------------------------------------

  myAnomalies: protectedProcedure.query(async ({ ctx }) => {
    return listMyAnomalies(ctx.user.id);
  }),

  /**
   * Discover an anomaly in a sector. Idempotent — already-discovered
   * sectors return the existing kind. Called by the galaxy map on
   * first entry to a hasAnomaly sector.
   */
  discoverAnomaly: protectedProcedure
    .input(z.object({ sectorId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const result = await discoverAnomaly(ctx.user.id, input.sectorId);
      if (!result.ok) {
        throw new TRPCError({ code: "BAD_REQUEST", message: result.error });
      }
      return result;
    }),

  /**
   * Spend intelligence to investigate an anomaly. Caller's intelligence
   * must already be debited at the call site (e.g. by tradeEmpire's
   * resource ledger). Returns whether the anomaly resolved.
   */
  investigateAnomaly: protectedProcedure
    .input(
      z.object({
        sectorId: z.string(),
        intelligenceAmount: z.number().int().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await spendIntelligenceOnAnomaly(
        ctx.user.id,
        input.sectorId,
        input.intelligenceAmount,
      );
      if (!result.ok) {
        throw new TRPCError({ code: "BAD_REQUEST", message: result.error });
      }
      return result;
    }),

  // --- Tower listing for the court widget --------------------------------

  listMyTowers: protectedProcedure.query(async ({ ctx }) => {
    const munitions = allKnownMunitionRefs().map(ref => ({
      ref,
      label: getMunitionEffect(ref)?.label ?? ref,
    }));

    const db = await getDb();
    if (!db) return { towers: [], availableMunitions: munitions };

    // The player's stations (joined to scope towerPlacements ownership).
    const stations = await db
      .select({ id: spaceStations.id, name: spaceStations.stationName })
      .from(spaceStations)
      .where(eq(spaceStations.userId, ctx.user.id));
    if (stations.length === 0) {
      return { towers: [], availableMunitions: munitions };
    }

    const stationIds = stations.map(s => s.id);
    const towers = await db
      .select()
      .from(towerPlacements)
      .where(
        and(
          eq(towerPlacements.ownerType, "station"),
          inArray(towerPlacements.ownerId, stationIds),
        ),
      );

    return {
      towers: towers.map(t => {
        const def = TOWERS.find(td => td.key === t.towerKey);
        const munitionEffect = getMunitionEffect(t.equippedMunition);
        return {
          id: t.id,
          towerKey: t.towerKey,
          towerName: def?.name ?? t.towerKey,
          level: t.level,
          status: t.status,
          gridX: t.gridX,
          gridY: t.gridY,
          equippedMunition: t.equippedMunition,
          munitionLabel: munitionEffect?.label ?? null,
        };
      }),
      availableMunitions: munitions,
    };
  }),

  // --- Tower munition endpoint (phase 7 wiring of phase 5 catalog) -------

  /**
   * Equip / clear a tower munition slot. The wave resolver consumes
   * the slot on the next wave; this endpoint just writes the
   * `equippedMunition` column. Pass `itemRef: null` to clear.
   */
  equipMunition: protectedProcedure
    .input(
      z.object({
        towerId: z.number().int().positive(),
        itemRef: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "no db" });
      }

      if (input.itemRef !== null) {
        const effect = getMunitionEffect(input.itemRef);
        if (!effect) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `unknown munition ${input.itemRef}`,
          });
        }
      }

      const [tower] = await db
        .select()
        .from(towerPlacements)
        .where(eq(towerPlacements.id, input.towerId))
        .limit(1);
      if (!tower) {
        throw new TRPCError({ code: "NOT_FOUND", message: "tower not found" });
      }

      // Ownership check: the tower must belong to a station owned by
      // the calling user. Phase 7 supports station-owned towers only;
      // world-owned (guild) towers stay locked from this surface
      // until the guild ownership semantics are clarified.
      if (tower.ownerType !== "station") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "munition slot only available on station-owned towers",
        });
      }
      const [station] = await db
        .select({ userId: spaceStations.userId })
        .from(spaceStations)
        .where(eq(spaceStations.id, tower.ownerId))
        .limit(1);
      if (!station || station.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "you do not own this tower",
        });
      }

      await db
        .update(towerPlacements)
        .set({ equippedMunition: input.itemRef })
        .where(eq(towerPlacements.id, input.towerId));

      return { ok: true, towerId: input.towerId, itemRef: input.itemRef };
    }),

  /**
   * Pay tribute to a sub-house by sacrificing one card. The card is
   * consumed; the receiving sub-house's reputation increases scaled
   * by the craft-method weight (hand-crafted > market-bought > looted).
   * Cards aligned to the receiving house's rival are rejected;
   * neutral cards are accepted at a discount.
   *
   * Phase 3 — the items-become-political flow. Aggressive sink: the
   * card is destroyed, not merely gifted. There is no take-back.
   */
  payTribute: protectedProcedure
    .input(
      z.object({
        receivingHouseKey: z.string(),
        cardId: z.string(),
        isFoil: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      if (!isKnownSubHouseKey(input.receivingHouseKey)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `unknown house ${input.receivingHouseKey}`,
        });
      }
      const receivingHouse = SUB_HOUSE_REGISTRY[input.receivingHouseKey];
      if (receivingHouse.unalignable) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `${receivingHouse.name} cannot accept tribute`,
        });
      }

      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "no db",
        });
      }

      const isFoil = input.isFoil === true;
      const isFoilInt: 0 | 1 = isFoil ? 1 : 0;

      // Resolve the card definition (for faction) and ownership row.
      const [cardDef] = await db
        .select()
        .from(cards)
        .where(eq(cards.cardId, input.cardId))
        .limit(1);
      if (!cardDef) {
        throw new TRPCError({ code: "NOT_FOUND", message: "card not found" });
      }
      const [owned] = await db
        .select()
        .from(userCards)
        .where(
          and(
            eq(userCards.userId, userId),
            eq(userCards.cardId, input.cardId),
            eq(userCards.isFoil, isFoilInt),
          ),
        )
        .limit(1);
      if (!owned || owned.quantity < 1) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "you do not own this card",
        });
      }

      // Tag the card and check tribute acceptability against the
      // receiving house and its rival.
      const tag = tagForCard({
        faction: (cardDef.faction ?? "neutral") as Faction,
        obtainedVia: owned.obtainedVia,
      });
      if (
        !isAcceptableTribute(
          tag,
          receivingHouse.houseKey,
          receivingHouse.rivalHouseKey,
        )
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `${receivingHouse.name} refuses this tribute (aligned with rival or third party)`,
        });
      }

      // Consume one copy of the card (mirrors disenchant pattern).
      if (owned.quantity > 1) {
        await db
          .update(userCards)
          .set({ quantity: owned.quantity - 1 })
          .where(
            and(
              eq(userCards.userId, userId),
              eq(userCards.cardId, input.cardId),
              eq(userCards.isFoil, isFoilInt),
            ),
          );
      } else {
        await db
          .delete(userCards)
          .where(
            and(
              eq(userCards.userId, userId),
              eq(userCards.cardId, input.cardId),
              eq(userCards.isFoil, isFoilInt),
            ),
          );
      }

      // Compute rep delta. Base 6 per common card, scaled by rarity
      // tier and by craft method, doubled for foils.
      const rarityBase: Record<string, number> = {
        basic: 3,
        common: 6,
        uncommon: 10,
        rare: 16,
        epic: 24,
        legendary: 36,
      };
      const base = rarityBase[cardDef.rarity ?? "common"] ?? 6;
      const method = obtainedViaToCraftMethod(owned.obtainedVia);
      const weight = craftMethodWeight(method);
      const foilBoost = isFoil ? 2 : 1;
      const repDelta = Math.round(base * weight * foilBoost);

      const updated = await applySubHouseRepDelta(
        userId,
        receivingHouse.houseKey,
        repDelta,
        `tribute ${input.cardId}${isFoil ? " (foil)" : ""}`,
      );

      // Public knowledge — the receiving house notices, the rival
      // notices, and the recent-news ring buffer carries it.
      const seasonNumber = seasonClockService.getState().seasonNumber;
      await postPublicKnowledge({
        userId,
        eventKind: "tribute_paid",
        subjectHouseKey: receivingHouse.houseKey,
        summary: `${receivingHouse.name} accepted a ${cardDef.rarity ?? "common"} tribute (${cardDef.name ?? input.cardId}).`,
        payload: {
          cardId: input.cardId,
          rarity: cardDef.rarity,
          isFoil,
          craftMethod: method,
          repDelta,
        },
        seasonNumber,
      }).catch(err => logger.warn("tribute public knowledge failed", { err }));

      // Phase 9 — Dischordia faction-tagged nudge. Tributing a card
      // moves the global meter according to the receiving house's
      // top-level faction alignment.
      try {
        const fac = factionForHouse(receivingHouse.houseKey);
        dischordiaCycleService.applyEnergyForFaction(
          "trade_diplomacy_treaty",
          fac,
          userId,
        );
      } catch (err) {
        logger.warn("tribute dischordia faction nudge failed", { err });
      }

      return {
        ok: true,
        receivingHouseKey: receivingHouse.houseKey,
        repDelta,
        craftMethod: method,
        weight,
        updated,
      };
    }),
});
