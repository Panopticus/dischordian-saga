/* ═══════════════════════════════════════════════════════
   HUNT-THE-HERO ROUTER — Wolf E5 minigame surface

   Single-player tactical card match against a scripted
   Lycos AI. The match itself is run by the pure reducer in
   apps/shared/tcg-core/matches/huntTheHero/. This router
   is the persistence + flag-plumbing layer.

   Transport: plain tRPC mutations (not WebSocket). The
   plan called for the Duelyst WS pattern, but Duelyst's WS
   exists specifically for PvP — Hunt-the-Hero is single-
   player, so a socket would be theater. The pure reducer
   IS the Duelyst-pattern contract; the transport is HTTP.

   Endpoints:
     - start         — derive priors from narrativeFlags,
                       roll an initial state, persist.
     - getState      — return active match state.
     - submitAction  — apply a HuntAction; on player_end_turn
                       the server auto-runs wolf_take_turn so
                       the UI sees the Wolf's reply in one
                       round-trip.
     - concede       — abandon the active match.

   On match end the router writes:
     - huntOutcomeFlag(outcome) → true on narrativeFlags.
     - HUNT_THE_HERO_AVAILABLE_FLAG → false (CTA closes).
     - The finished state is archived to past matches for
       replay-debug.
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { eq } from "drizzle-orm";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { userProgress } from "../../db/schema";

import {
  reduceHunt,
  initialHuntState,
  HERO_IDS,
  huntOutcomeFlag,
  HUNT_THE_HERO_AVAILABLE_FLAG,
  type HeroId,
  type HuntState,
} from "../../shared/tcg-core/matches/huntTheHero";
import {
  loadHuntTheHeroStore,
  saveHuntTheHeroStore,
  archiveFinishedMatch,
} from "../services/huntTheHeroStore";

const heroIdEnum = z.enum(HERO_IDS as readonly [HeroId, ...HeroId[]]);

const huntActionSchema = z.union([
  z.object({
    kind: z.literal("player_play"),
    card: z.enum(["warn", "shield", "evacuate", "confront"] as const),
    targetHero: heroIdEnum.optional(),
  }),
  z.object({ kind: z.literal("player_end_turn") }),
]);

/** Derive E2 warned hero ids from per-hero choice flags. The
 *  per-choice mystery flags follow the canonical
 *  `mystery_choice:arc.dlc.wolf_anara_hunt:wolf.anara_hunt.e2:<choiceId>`
 *  shape; the choice ids are hard-coded here against the canonical
 *  E2 episode definition. Heroes the player did NOT warn fall
 *  through to false. */
function deriveWarnedHeroIds(
  flags: Readonly<Record<string, unknown>>,
): ReadonlyArray<HeroId> {
  const map: Readonly<Record<HeroId, string>> = {
    field_medic:
      "mystery_choice:arc.dlc.wolf_anara_hunt:wolf.anara_hunt.e2:wolf.e2.c.warn_field_medic",
    judge_remnant:
      "mystery_choice:arc.dlc.wolf_anara_hunt:wolf.anara_hunt.e2:wolf.e2.c.warn_judge_remnant",
    antiquarian_apprentice:
      "mystery_choice:arc.dlc.wolf_anara_hunt:wolf.anara_hunt.e2:wolf.e2.c.warn_antiquarian_apprentice",
  };
  return HERO_IDS.filter((id) => flags[map[id]] === true);
}

function derivePriorFlag(
  flags: Readonly<Record<string, unknown>>,
  flag: string,
): boolean {
  return flags[flag] === true;
}

/** Atomically write a set of narrative-flag (key → boolean) pairs
 *  to userProgress.gameData.narrativeFlags. Mirrors the pattern in
 *  resurrection.ts:432-449 + pathBResolutionService. */
async function setNarrativeFlags(
  userId: number,
  updates: Record<string, boolean>,
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const rows = await db
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, userId))
    .limit(1);
  if (rows.length === 0) return;
  const raw = (rows[0]?.gameData ?? {}) as Record<string, unknown>;
  const narrativeFlags = {
    ...((raw.narrativeFlags ?? {}) as Record<string, boolean>),
    ...updates,
  };
  await db
    .update(userProgress)
    .set({ gameData: { ...raw, narrativeFlags } })
    .where(eq(userProgress.userId, userId));
}

async function loadNarrativeFlags(
  userId: number,
): Promise<Readonly<Record<string, unknown>>> {
  const db = await getDb();
  if (!db) return {};
  const rows = await db
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, userId))
    .limit(1);
  if (rows.length === 0) return {};
  const raw = (rows[0]?.gameData ?? {}) as Record<string, unknown>;
  return (raw.narrativeFlags as Record<string, unknown> | undefined) ?? {};
}

/** Compose the terminal flag-write set for a finished match. */
function terminalFlagsFor(state: HuntState): Record<string, boolean> {
  if (!state.outcome) return {};
  return {
    [huntOutcomeFlag(state.outcome)]: true,
    [HUNT_THE_HERO_AVAILABLE_FLAG]: false,
  };
}

export const huntTheHeroRouter = router({
  /** Return the player's active match (null when none). */
  getState: protectedProcedure.query(async ({ ctx }) => {
    const store = await loadHuntTheHeroStore(ctx.user.id);
    return { active: store.active, pastMatches: store.pastMatches };
  }),

  /** Start a new match. Idempotent in the sense that if an active
   *  match exists, it is returned unchanged; the client must
   *  concede first to start fresh. */
  start: protectedProcedure.mutation(async ({ ctx }) => {
    const store = await loadHuntTheHeroStore(ctx.user.id);
    if (store.active && store.active.phase !== "ended") {
      return { state: store.active, started: false };
    }
    const flags = await loadNarrativeFlags(ctx.user.id);
    const warnedHeroIds = deriveWarnedHeroIds(flags);
    const state = initialHuntState({
      warnedHeroIds,
      resurrectionistConfronted: derivePriorFlag(
        flags,
        "mystery_choice:arc.dlc.wolf_anara_hunt:wolf.anara_hunt.e3:wolf.e3.c.confront_the_resurrectionist",
      ),
      hallSealed: derivePriorFlag(
        flags,
        "mystery_choice:arc.dlc.wolf_anara_hunt:wolf.anara_hunt.e4:wolf.e4.c.seal_the_hall",
      ),
      rngSeed:
        ctx.user.id * 1_000_003 + Math.floor(Date.now() / 1000),
    });
    await saveHuntTheHeroStore(ctx.user.id, { ...store, active: state });
    return { state, started: true };
  }),

  /** Apply a HuntAction to the active match. On player_end_turn
   *  the server auto-runs wolf_take_turn so the UI sees both
   *  halves of the round-trip without a second request. */
  submitAction: protectedProcedure
    .input(z.object({ action: huntActionSchema }))
    .mutation(async ({ ctx, input }) => {
      const store = await loadHuntTheHeroStore(ctx.user.id);
      if (!store.active || store.active.phase === "ended") {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "No active hunt match",
        });
      }
      const first = reduceHunt(store.active, input.action);
      if (first.error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `${first.error.code}: ${first.error.message}`,
        });
      }
      let state = first.state;

      // Auto-run wolf turn after player_end_turn for a single-RPC
      // round trip.
      if (input.action.kind === "player_end_turn" && state.phase === "wolf_turn") {
        const wolfResult = reduceHunt(state, { kind: "wolf_take_turn" });
        if (!wolfResult.error) {
          state = wolfResult.state;
        }
      }

      if (state.phase === "ended") {
        await saveHuntTheHeroStore(
          ctx.user.id,
          archiveFinishedMatch(store, state),
        );
        await setNarrativeFlags(ctx.user.id, terminalFlagsFor(state));
      } else {
        await saveHuntTheHeroStore(ctx.user.id, { ...store, active: state });
      }
      return { state };
    }),

  /** Abandon the active match. Concedes to the Wolf — equivalent
   *  to wolf_killed_all for outcome purposes. */
  concede: protectedProcedure.mutation(async ({ ctx }) => {
    const store = await loadHuntTheHeroStore(ctx.user.id);
    if (!store.active || store.active.phase === "ended") {
      return { ok: true, conceded: false };
    }
    const conceded: HuntState = {
      ...store.active,
      phase: "ended",
      outcome: "wolf_killed_all",
      log: [
        ...store.active.log,
        "Player conceded the Hunt. The Hall returns to silence; the chronicle records the surrender as a full loss.",
      ],
      heroes: store.active.heroes.map((h) => ({
        ...h,
        resolution: h.resolution === "alive" ? "dead" : h.resolution,
        hp: h.resolution === "alive" ? 0 : h.hp,
      })),
    };
    await saveHuntTheHeroStore(
      ctx.user.id,
      archiveFinishedMatch(store, conceded),
    );
    await setNarrativeFlags(ctx.user.id, terminalFlagsFor(conceded));
    return { ok: true, conceded: true };
  }),
});
