/* ═══════════════════════════════════════════════════════
   HUNT-THE-HERO — initial state derivation

   Pure function that builds the opening HuntState from the
   player's prior Wolf arc choices. Every prior is a
   read-side observation; this module never mutates
   external state.

   Inputs (`HuntInitInputs`):
     - warnedHeroIds   — set of heroes the player warned in
                         E2; passed straight in by the tRPC
                         router which derives it from the
                         per-hero choice flags.
     - resurrectionistConfronted  — E3 outcome.
     - hallSealed                 — E4 outcome.
     - rngSeed         — deterministic seed for the initial
                         draws; the same (userId, matchStartedAt)
                         pair always produces the same opening
                         hands.

   Output: a HuntState with phase = "player_turn", turn = 1,
   priors stored on the state, and a 4-card opening hand
   drawn from each side's deck (shuffled deterministically
   from rngSeed).
   ═══════════════════════════════════════════════════════ */

import {
  HERO_IDS,
  type HeroId,
  type HuntState,
  type PlayerCardId,
  type WolfCardId,
} from "./state";
import { PLAYER_STARTING_DECK, WOLF_STARTING_DECK } from "./cards";

export interface HuntInitInputs {
  /** Hero ids the player warned in E2. Any subset of HERO_IDS. */
  warnedHeroIds: ReadonlyArray<HeroId>;
  resurrectionistConfronted: boolean;
  hallSealed: boolean;
  /** Deterministic seed. Same seed → same opening deal. */
  rngSeed: number;
}

/** Display names for the three incoming heroes. */
const HERO_NAMES: Readonly<Record<HeroId, string>> = {
  field_medic: "The Field Medic",
  judge_remnant: "The Judge's Remnant",
  antiquarian_apprentice: "The Antiquarian's Apprentice",
};

/** Bounded turn count. Tuned so a passive Wolf and a defensive
 *  player can both reach the mercy outcome. */
const HUNT_MAX_TURNS = 8;

const STARTING_HAND_SIZE = 4;

/** Tiny seeded RNG — linear congruential. Same as the resurrection
 *  recipe roll. Pure / deterministic. */
function makeRng(seed: number): () => number {
  let s = (seed | 0) || 1;
  return () => {
    s = (s * 1664525 + 1013904223) | 0;
    return ((s >>> 0) % 100_000) / 100_000;
  };
}

/** Fisher-Yates shuffle keyed by a pure rng. Does not mutate
 *  the input. */
function shuffle<T>(arr: ReadonlyArray<T>, rng: () => number): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function initialHuntState(input: HuntInitInputs): HuntState {
  const warned = new Set(input.warnedHeroIds);
  const heroes = HERO_IDS.map((id) => ({
    id,
    name: HERO_NAMES[id],
    hp: warned.has(id) ? 12 : 10,
    maxHp: warned.has(id) ? 12 : 10,
    warned: warned.has(id),
    shielded: warned.has(id),
    resolution: "alive" as const,
  }));

  // The Resurrectionist's confrontation in E3 weakens Lycos's
  // resolve — model as Lycos starting with one extra restraint
  // card swapped in for one of the hunts.
  let wolfDeck: ReadonlyArray<WolfCardId> = WOLF_STARTING_DECK;
  if (input.resurrectionistConfronted) {
    const idx = wolfDeck.findIndex((c) => c === "hunt");
    if (idx !== -1) {
      const draft = wolfDeck.slice();
      draft[idx] = "restraint";
      wolfDeck = draft;
    }
  }

  // The Hall being sealed in E4 means the heroes never arrive
  // unprepared — model as the player starting with an extra
  // shield. Doesn't change the deck size, just the draw bias.
  let playerDeck: ReadonlyArray<PlayerCardId> = PLAYER_STARTING_DECK;
  if (input.hallSealed) {
    const idx = playerDeck.findIndex((c) => c === "confront");
    if (idx !== -1) {
      const draft = playerDeck.slice();
      draft[idx] = "shield";
      playerDeck = draft;
    }
  }

  const rng = makeRng(input.rngSeed);
  const shuffledPlayer = shuffle(playerDeck, rng);
  const shuffledWolf = shuffle(wolfDeck, rng);

  const playerHand = shuffledPlayer.slice(0, STARTING_HAND_SIZE);
  const wolfHand = shuffledWolf.slice(0, STARTING_HAND_SIZE);
  const playerDraw = shuffledPlayer.slice(STARTING_HAND_SIZE);
  const wolfDraw = shuffledWolf.slice(STARTING_HAND_SIZE);

  return {
    phase: "player_turn",
    turn: 1,
    maxTurns: HUNT_MAX_TURNS,
    heroes,
    playerHand,
    wolfHand,
    playerDeck: playerDraw,
    wolfDeck: wolfDraw,
    log: [
      `The Hunt begins. Three heroes approach the Hall: ${heroes.map((h) => h.name).join(", ")}.`,
      `Warned in advance: ${input.warnedHeroIds.length} of 3.`,
    ],
    mercyPlayed: false,
    initialWarnedCount: input.warnedHeroIds.length,
    resurrectionistConfronted: input.resurrectionistConfronted,
    hallSealed: input.hallSealed,
  };
}
