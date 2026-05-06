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
