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
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";

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
  getAllSubHouseReputation,
  getFactionReputationRollup,
  getSubHouseReputation,
} from "../services/subHouseReputationService";
import { seasonClockService } from "../services/seasonClockService";
import {
  getRecentPublicKnowledge,
  getPublicKnowledgeForHouse,
} from "../services/publicKnowledgeService";

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
    const [reps, rollup] = await Promise.all([
      getAllSubHouseReputation(ctx.user.id),
      getFactionReputationRollup(ctx.user.id),
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

    return {
      season: {
        ...season,
        acceptsContractSignings: acceptsContractSignings(season.phase),
        tickAdvancesAgendas: tickAdvancesAgendas(season.phase),
      },
      houses,
      factionRollup: rollup,
      recentNews: news,
    };
  }),

  /** Internal helper — used by tests + admin tools. */
  _factionForHouse: publicProcedure
    .input(z.object({ houseKey: z.string() }))
    .query(({ input }) => {
      if (!isKnownSubHouseKey(input.houseKey)) return null;
      return factionForHouse(input.houseKey);
    }),
});
