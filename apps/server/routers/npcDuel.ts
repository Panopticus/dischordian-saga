/* ═══════════════════════════════════════════════════════
   NPC DUEL ROUTER — system entry for the dialog → duel → harvest loop

   Two procedures:

     • getChallengeInfo (query) — given an NPC key, returns the
       composed deck preview + reward tier + per-aspect learn-state
       so the client can render the pre-duel challenge UI ("you've
       learned 2/3 — the harvest will scale to tier 2").

     • recordVictory (mutation) — called by the client when the
       player wins a `challengeNpc(npcKey)` match. Reads the
       player's narrative flags to recover the learned-aspects set,
       calls dispatchNpcDuelVictory which fans out card grants and
       narrative-flag writes.

   Per-IP rate limiting is delegated to the protectedProcedure
   middleware (existing pipeline); these procedures do not mint
   new identity context.

   See apps/shared/npc-decks/AUTHORING.md for the per-NPC content
   contract this router consumes.
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { eq } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { userProgress } from "../../db/schema";
import { logger } from "../logger";
import { getNpcDeck, NPC_DECK_REGISTRY } from "@shared/npc-decks";
import {
  buildNpcDeck,
  countLearnedAspectsForNpc,
  npcDuelRewardTier,
} from "@shared/npc-decks/buildNpcDeck";
import { dispatchNpcDuelVictory } from "../services/dispatchNpcDuelVictory";
import type { NpcKey } from "@shared/npcs/types";

/** Every NpcKey that has a deck authored. The router refuses any
 *  other key — challenging an NPC with no deck is a no-op. Computed
 *  at module load so the runtime stays in sync with the registry
 *  without manual maintenance. */
const CHALLENGEABLE_NPC_KEYS = Object.keys(
  NPC_DECK_REGISTRY,
) as readonly NpcKey[];

const CHALLENGEABLE_KEY_SET = new Set<string>(CHALLENGEABLE_NPC_KEYS);

const npcKeyInput = z
  .string()
  .refine((v): v is NpcKey => CHALLENGEABLE_KEY_SET.has(v), {
    message: "npcKey is not in NPC_DECK_REGISTRY (no deck authored yet)",
  });

/** Read the user's narrative-flag set from userProgress.gameData.
 *  Mirrors playerExpansionState.ts; kept local so the duel router
 *  stays independent of the unlock-service load order. */
async function readPlayerNarrativeFlags(
  userId: number,
): Promise<ReadonlySet<string>> {
  const db = await getDb();
  if (!db) return new Set();
  try {
    const rows = await db
      .select({ gameData: userProgress.gameData })
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .limit(1);
    const row = rows[0];
    if (!row) return new Set();
    const gameData = (row.gameData ?? {}) as Record<string, unknown>;
    const flags = (gameData.narrativeFlags ?? {}) as Record<string, unknown>;
    const set = new Set<string>();
    for (const [k, v] of Object.entries(flags)) {
      if (v === true || v === 1 || v === "true") set.add(k);
    }
    return set;
  } catch (err) {
    logger.warn("[npcDuel.readPlayerNarrativeFlags] failed", err);
    return new Set();
  }
}

export const npcDuelRouter = router({
  /**
   * Get the pre-duel challenge info: composed deck preview, reward
   * tier, and per-aspect learn-state. The client uses this to render
   * the challenge confirmation card ("you've learned 2/3 — the
   * harvest will scale to tier 2"). Idempotent; safe to re-query.
   */
  getChallengeInfo: protectedProcedure
    .input(z.object({ npcKey: npcKeyInput }))
    .query(async ({ ctx, input }) => {
      const npcKey = input.npcKey as NpcKey;
      const deck = getNpcDeck(npcKey);
      if (!deck) {
        return { challengeable: false as const, reason: "no_deck_authored" };
      }

      const flags = await readPlayerNarrativeFlags(ctx.user.id);
      const learnedAspectIds = deck.perspectiveAspects
        .map((a) => a.id)
        .filter((id) => flags.has(id));
      const learnedAspectSet = new Set(learnedAspectIds);
      const learnedCount = countLearnedAspectsForNpc(deck, learnedAspectSet);
      const totalCount = deck.perspectiveAspects.length;
      const tier = npcDuelRewardTier(learnedCount, totalCount);

      const composition = buildNpcDeck(deck, learnedAspectSet);

      // Cross-NPC echoes — which other NPCs has the player already
      // defeated? Drives opening-line conditionals on the client.
      const carriedMemories: NpcKey[] = [];
      for (const otherKey of CHALLENGEABLE_NPC_KEYS) {
        if (flags.has(`player_carries_${otherKey}_memory`)) {
          carriedMemories.push(otherKey);
        }
      }

      return {
        challengeable: true as const,
        npcKey,
        general: composition.general,
        deck: composition.deck,
        deckSize: composition.deck.length,
        appliedAspects: composition.appliedAspects,
        perspectiveAspects: deck.perspectiveAspects.map((a) => ({
          id: a.id,
          label: a.label,
          learned: flags.has(a.id),
        })),
        learnedAspectCount: learnedCount,
        totalAspectCount: totalCount,
        rewardTier: tier,
        challengeMotive: deck.challengeMotive,
        carriedMemories,
        alreadyDefeated: flags.has(`defeated_npc:${npcKey}`),
      };
    }),

  /**
   * Record a player victory. Fans out card grants + narrative-flag
   * writes via dispatchNpcDuelVictory. The match outcome is asserted
   * by the caller (client-side at match end) — the router does not
   * re-verify the engine state. This mirrors the
   * tradeMissions / cardChallenge.complete contract: the engine is
   * the trusted source of `winner`, and the router persists the
   * downstream effects.
   */
  recordVictory: protectedProcedure
    .input(
      z.object({
        npcKey: npcKeyInput,
        /** Optional client-side learned-aspects snapshot. If
         *  provided, the router uses it; otherwise it derives the
         *  set from the player's narrative flags. The override
         *  exists for testability + for clients that prefer to be
         *  explicit about the duel context. */
        learnedAspectsOverride: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const npcKey = input.npcKey as NpcKey;
      const deck = getNpcDeck(npcKey);
      if (!deck) {
        return { ok: false as const, reason: "no_deck_authored" };
      }

      const learnedAspects = input.learnedAspectsOverride
        ? new Set(input.learnedAspectsOverride)
        : await readPlayerNarrativeFlags(ctx.user.id);

      const result = await dispatchNpcDuelVictory({
        userId: ctx.user.id,
        npcKey,
        learnedAspects,
      });

      return {
        ok: true as const,
        ...result,
        grantCount: result.grants.length,
      };
    }),

  /**
   * Catalogue every NPC the player can currently challenge, plus
   * which ones they've already defeated. Powers a "Challenge"
   * codex / room UI; does NOT spend user state. Safe at any auth
   * boundary.
   */
  listChallengeable: protectedProcedure.query(async ({ ctx }) => {
    const flags = await readPlayerNarrativeFlags(ctx.user.id);
    return CHALLENGEABLE_NPC_KEYS.map((npcKey) => {
      const deck = getNpcDeck(npcKey);
      if (!deck) return null;
      const learned = deck.perspectiveAspects.filter((a) =>
        flags.has(a.id),
      ).length;
      return {
        npcKey,
        defeated: flags.has(`defeated_npc:${npcKey}`),
        learnedAspectCount: learned,
        totalAspectCount: deck.perspectiveAspects.length,
        carriedByPlayer: flags.has(`player_carries_${npcKey}_memory`),
      };
    }).filter((x): x is NonNullable<typeof x> => x !== null);
  }),
});
