/* ═══════════════════════════════════════════════════════
   HUNT-THE-HERO — match state types

   Single-player tactical card minigame that opens after the
   player commits the Wolf E5 release choice and the
   `wolf_planet_of_the_wolf` cinematic completes.

   The fiction: three League heroes will cross the Hall's
   threshold in the next unmeasured-but-finite window.
   Lycos waits for them. The player plays the heroes'
   defenders (warn / shield / evacuate / confront) against
   Lycos's predator instincts (hunt / restraint / mercy /
   memory-of-the-medic). The board is the three heroes'
   HP; reduce a hero to 0 → Lycos kills them. The match
   ends after maxTurns or when all three heroes are
   resolved (dead, evacuated, or shown mercy).

   Pure module — no I/O. The reducer is total over its
   action union. The server-side tRPC router holds match
   state in the resurrection store (apps/server/services/
   huntTheHeroStore.ts) and writes the outcome flag on
   end.

   Priors plumb in from the player's E2 / E3 / E4 choices
   so the opening posture reflects what the chronicle has
   already recorded:
     - initialWarnedCount: how many heroes the player
       warned in E2 (0-3).
     - resurrectionistConfronted: whether the player
       confronted the Resurrectionist in E3.
     - hallSealed: whether the player sealed the Hall in E4.
   ═══════════════════════════════════════════════════════ */

export type HuntPhase = "player_turn" | "wolf_turn" | "ended";

export type HeroId =
  | "field_medic"
  | "judge_remnant"
  | "antiquarian_apprentice";

export const HERO_IDS: readonly HeroId[] = [
  "field_medic",
  "judge_remnant",
  "antiquarian_apprentice",
] as const;

export type HeroResolution = "alive" | "dead" | "evacuated" | "spared";

export interface Hero {
  id: HeroId;
  /** Display name surfaced to the UI + the chronicle. */
  name: string;
  hp: number;
  maxHp: number;
  /** Set to true at init time if the player warned this hero in
   *  E2; warned heroes start with +2 max HP and `shielded` true.
   *  See initialState.ts. */
  warned: boolean;
  /** Active one-shot defensive buff. Consumed on the next hunt. */
  shielded: boolean;
  /** Terminal resolution. Set when hp ≤ 0 (dead), `evacuate` is
   *  played on this hero (evacuated), or Lycos plays `mercy` on
   *  this hero (spared). */
  resolution: HeroResolution;
}

export type PlayerCardId =
  | "warn"
  | "shield"
  | "evacuate"
  | "confront";

export type WolfCardId =
  | "hunt"
  | "restraint"
  | "mercy"
  | "memory_of_the_medic";

export type CardId = PlayerCardId | WolfCardId;

export type HuntOutcome =
  | "player_saved_all"
  | "mercy_extended"
  | "wolf_killed_one"
  | "wolf_killed_two"
  | "wolf_killed_all"
  | "draw_timeout";

export interface HuntState {
  /** Phase machine: alternates player → wolf → player until ended. */
  phase: HuntPhase;
  /** 1-indexed turn counter; the Hunt is bounded so the match
   *  cannot stall indefinitely. */
  turn: number;
  /** Hard cap; if reached without resolution, outcome = draw_timeout. */
  maxTurns: number;
  /** The three incoming heroes. Indexed by id; array is canonical
   *  HERO_IDS order. */
  heroes: ReadonlyArray<Hero>;
  /** Player's hand of defensive cards. */
  playerHand: ReadonlyArray<PlayerCardId>;
  /** Lycos's hand of predator-instinct cards. */
  wolfHand: ReadonlyArray<WolfCardId>;
  /** Remaining draw pile. Cards are drawn on turn start. */
  playerDeck: ReadonlyArray<PlayerCardId>;
  wolfDeck: ReadonlyArray<WolfCardId>;
  /** Append-only log of beat lines for the UI ribbon + chronicle. */
  log: ReadonlyArray<string>;
  /** Terminal — set when phase === "ended". */
  outcome?: HuntOutcome;
  /** True if Lycos has played `mercy` at least once during the
   *  match. The mercy_extended outcome requires this + survival. */
  mercyPlayed: boolean;
  /* ─── Priors from prior arc choices (read-only) ─── */
  initialWarnedCount: number;
  resurrectionistConfronted: boolean;
  hallSealed: boolean;
}

/** Pure helper: count surviving heroes (alive, evacuated, or spared
 *  all count as "saved" — the Wolf only wins on a hero dying). */
export function survivingHeroCount(state: HuntState): number {
  return state.heroes.filter((h) => h.resolution !== "dead").length;
}

/** Pure helper: count heroes killed by the Wolf. */
export function killedHeroCount(state: HuntState): number {
  return state.heroes.filter((h) => h.resolution === "dead").length;
}
