/* ═══════════════════════════════════════════════════════
   HUNT-THE-HERO — reducer + initialState invariants

   The reducer is the contract every client + server path
   relies on. These tests pin:
     - Action union totality (every action kind is handled).
     - Phase machine (player_turn → wolf_turn → player_turn).
     - Termination (every termination predicate produces the
       correct outcome).
     - Prior plumbing (warnedHeroIds, resurrectionistConfronted,
       hallSealed land on the opening state).
     - Deterministic seeding (same seed → same opening).
   ═══════════════════════════════════════════════════════ */

import { describe, expect, it } from "vitest";
import {
  initialHuntState,
  reduceHunt,
  HERO_IDS,
  type HuntInitInputs,
  type HuntState,
} from "..";

const DEFAULT_INPUTS: HuntInitInputs = {
  warnedHeroIds: [],
  resurrectionistConfronted: false,
  hallSealed: false,
  rngSeed: 42,
};

function newGame(overrides: Partial<HuntInitInputs> = {}): HuntState {
  return initialHuntState({ ...DEFAULT_INPUTS, ...overrides });
}

describe("initialHuntState — opening derivation", () => {
  it("opens in player_turn at turn 1 with 4-card hands on each side", () => {
    const s = newGame();
    expect(s.phase).toBe("player_turn");
    expect(s.turn).toBe(1);
    expect(s.playerHand.length).toBe(4);
    expect(s.wolfHand.length).toBe(4);
  });

  it("seats three heroes in canonical order", () => {
    const s = newGame();
    expect(s.heroes.map((h) => h.id)).toEqual(HERO_IDS);
  });

  it("warned heroes start with +2 max HP and shielded", () => {
    const s = newGame({ warnedHeroIds: ["field_medic"] });
    const medic = s.heroes.find((h) => h.id === "field_medic")!;
    expect(medic.warned).toBe(true);
    expect(medic.shielded).toBe(true);
    expect(medic.maxHp).toBe(12);
    const judge = s.heroes.find((h) => h.id === "judge_remnant")!;
    expect(judge.warned).toBe(false);
    expect(judge.maxHp).toBe(10);
  });

  it("captures all three priors on the state", () => {
    const s = newGame({
      warnedHeroIds: ["field_medic", "judge_remnant"],
      resurrectionistConfronted: true,
      hallSealed: true,
    });
    expect(s.initialWarnedCount).toBe(2);
    expect(s.resurrectionistConfronted).toBe(true);
    expect(s.hallSealed).toBe(true);
  });

  it("same seed produces identical opening hands", () => {
    const a = newGame({ rngSeed: 999 });
    const b = newGame({ rngSeed: 999 });
    expect(a.playerHand).toEqual(b.playerHand);
    expect(a.wolfHand).toEqual(b.wolfHand);
  });

  it("different seeds typically produce different openings", () => {
    const a = newGame({ rngSeed: 1 });
    const b = newGame({ rngSeed: 2 });
    // Not a guarantee at the deck level (10-card decks have
    // limited variety), but the combined hand-pair should
    // differ for these two seeds.
    const aJoin = a.playerHand.join(",") + "|" + a.wolfHand.join(",");
    const bJoin = b.playerHand.join(",") + "|" + b.wolfHand.join(",");
    expect(aJoin).not.toEqual(bJoin);
  });
});

describe("reduceHunt — phase machine", () => {
  it("rejects card play when phase is wolf_turn", () => {
    const s = { ...newGame(), phase: "wolf_turn" as const };
    const result = reduceHunt(s, {
      kind: "player_play",
      card: "warn",
      targetHero: "field_medic",
    });
    expect(result.error?.code).toBe("phase_mismatch");
  });

  it("player_end_turn flips to wolf_turn and draws one player card", () => {
    const s = newGame();
    const result = reduceHunt(s, { kind: "player_end_turn" });
    expect(result.error).toBeUndefined();
    expect(result.state.phase).toBe("wolf_turn");
    expect(result.state.playerHand.length).toBe(5);
  });

  it("wolf_take_turn flips back to player_turn and increments turn", () => {
    const s0 = newGame();
    const s1 = reduceHunt(s0, { kind: "player_end_turn" }).state;
    const s2 = reduceHunt(s1, { kind: "wolf_take_turn" }).state;
    expect(s2.phase).toBe("player_turn");
    expect(s2.turn).toBe(2);
  });

  it("rejects actions on ended state", () => {
    const ended = { ...newGame(), phase: "ended" as const, outcome: "player_saved_all" as const };
    const result = reduceHunt(ended, { kind: "player_end_turn" });
    expect(result.error?.code).toBe("match_ended");
  });
});

describe("reduceHunt — card effects", () => {
  it("warn buffs and shields the target", () => {
    const s = newGame();
    // Ensure the player has `warn` in hand for the test by
    // constructing a state with a known hand.
    const seeded: HuntState = { ...s, playerHand: ["warn", "warn", "warn", "warn"] };
    const r = reduceHunt(seeded, {
      kind: "player_play",
      card: "warn",
      targetHero: "judge_remnant",
    });
    expect(r.error).toBeUndefined();
    const judge = r.state.heroes.find((h) => h.id === "judge_remnant")!;
    expect(judge.maxHp).toBe(12);
    expect(judge.shielded).toBe(true);
    expect(judge.warned).toBe(true);
  });

  it("evacuate fails on a hero below 50% HP", () => {
    const s = newGame();
    const seeded: HuntState = {
      ...s,
      playerHand: ["evacuate", "warn", "warn", "warn"],
      heroes: s.heroes.map((h) =>
        h.id === "judge_remnant" ? { ...h, hp: 3 } : h,
      ),
    };
    const r = reduceHunt(seeded, {
      kind: "player_play",
      card: "evacuate",
      targetHero: "judge_remnant",
    });
    expect(r.error?.code).toBe("invalid_target");
  });

  it("wolf hunt deals 3 damage to the most-wounded unshielded living hero", () => {
    const s = newGame();
    const seeded: HuntState = {
      ...s,
      phase: "wolf_turn",
      wolfHand: ["hunt"],
      heroes: s.heroes.map((h) =>
        h.id === "judge_remnant"
          ? { ...h, hp: 5, shielded: false }
          : { ...h, shielded: false },
      ),
    };
    const r = reduceHunt(seeded, { kind: "wolf_take_turn" });
    expect(r.error).toBeUndefined();
    const judge = r.state.heroes.find((h) => h.id === "judge_remnant")!;
    expect(judge.hp).toBe(2);
  });

  it("hunt against an all-shielded board consumes one shield and deals 0", () => {
    // The hunt AI prefers non-shielded targets, so to force the
    // shield-consumption branch every living hero must be shielded.
    const s = newGame();
    const seeded: HuntState = {
      ...s,
      phase: "wolf_turn",
      wolfHand: ["hunt"],
      heroes: s.heroes.map((h) => ({ ...h, shielded: true, hp: 5 })),
    };
    const r = reduceHunt(seeded, { kind: "wolf_take_turn" });
    // Exactly one shield should have been consumed, and no hp lost.
    const shieldedAfter = r.state.heroes.filter((h) => h.shielded).length;
    expect(shieldedAfter).toBe(2);
    for (const h of r.state.heroes) {
      expect(h.hp).toBe(5);
    }
  });

  it("memory_of_the_medic auto-mercies the field_medic and sets mercyPlayed", () => {
    const s = newGame();
    const seeded: HuntState = {
      ...s,
      phase: "wolf_turn",
      wolfHand: ["memory_of_the_medic"],
    };
    const r = reduceHunt(seeded, { kind: "wolf_take_turn" });
    const medic = r.state.heroes.find((h) => h.id === "field_medic")!;
    expect(medic.resolution).toBe("spared");
    expect(r.state.mercyPlayed).toBe(true);
  });
});

describe("reduceHunt — termination", () => {
  it("player_saved_all when every hero resolves alive/evacuated and mercy was not played", () => {
    const s = newGame();
    const ended: HuntState = {
      ...s,
      heroes: s.heroes.map((h) => ({ ...h, resolution: "evacuated" })),
      phase: "wolf_turn",
      wolfHand: [],
    };
    const r = reduceHunt(ended, { kind: "wolf_take_turn" });
    expect(r.state.phase).toBe("ended");
    expect(r.state.outcome).toBe("player_saved_all");
  });

  it("mercy_extended when every hero resolves non-dead and mercyPlayed is true", () => {
    const s = newGame();
    const ended: HuntState = {
      ...s,
      heroes: s.heroes.map((h) => ({ ...h, resolution: "spared" })),
      phase: "wolf_turn",
      wolfHand: [],
      mercyPlayed: true,
    };
    const r = reduceHunt(ended, { kind: "wolf_take_turn" });
    expect(r.state.outcome).toBe("mercy_extended");
  });

  it("wolf_killed_all when every hero is dead", () => {
    const s = newGame();
    const ended: HuntState = {
      ...s,
      heroes: s.heroes.map((h) => ({ ...h, resolution: "dead", hp: 0 })),
      phase: "wolf_turn",
      wolfHand: [],
    };
    const r = reduceHunt(ended, { kind: "wolf_take_turn" });
    expect(r.state.outcome).toBe("wolf_killed_all");
  });

  it("draw_timeout when the turn cap is exceeded with no resolutions", () => {
    const s = newGame();
    const ended: HuntState = {
      ...s,
      turn: s.maxTurns,
      phase: "wolf_turn",
      wolfHand: [],
    };
    const r = reduceHunt(ended, { kind: "wolf_take_turn" });
    expect(r.state.outcome).toBe("draw_timeout");
  });
});
