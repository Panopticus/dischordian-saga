/**
 * §5.8 Authority trial-phase engine tests.
 *
 * Pure-helper unit tests for the phase rules + admissibility logic,
 * plus reducer-integration tests covering: trial-mode initialization
 * via MatchConfig, the phase guard rejecting wrong-category plays
 * with a `phase_violation` error, the per-play balance bookkeeping,
 * the single-play forcible-end on phases 2 / 9, and the turn-10
 * verdict-threshold computation across the warm/cool/neutral
 * opening-balance regimes.
 */
import { describe, it, expect } from "vitest";
import { produce } from "immer";
import {
  createMatchState,
  reduce,
  type Action,
  type GameState,
  type MatchConfig,
} from "../../index";
import {
  TRIAL_TOTAL_PHASES,
  checkPhaseAdmissibility,
  phaseRuleFor,
  resolveTrialOutcome,
  trialPhaseFromTurn,
} from "../../engine/trialPhase";
import { emptyRegistry } from "../fixtures/stateBuilder";
import type { CardDefinition } from "../../types/Card";
import type { TrialState } from "../../types/TrialPhase";

/* ──────────────────────────────────────────────────────────────────── */
/*  Helpers                                                              */
/* ──────────────────────────────────────────────────────────────────── */

function stubCard(opts: {
  id: string;
  cardType?: CardDefinition["cardType"];
  faction?: CardDefinition["faction"];
  cost?: number;
  trial_categories?: CardDefinition["trial_categories"];
}): CardDefinition {
  return {
    id: opts.id as CardDefinition["id"],
    name: opts.id,
    faction: opts.faction ?? "neutral",
    cardType: opts.cardType ?? "spell",
    rarity: "common",
    cost: opts.cost ?? 1,
    baseStats: opts.cardType === "spell" || opts.cardType === undefined
      ? undefined
      : { power: 1, health: 1 },
    keywords: [],
    abilities: [],
    art: "/test.webp",
    flavorText: "",
    rulesVersion: "1.0.0",
    trial_categories: opts.trial_categories,
  };
}

function freshTrial(overrides: Partial<TrialState> = {}): TrialState {
  return {
    openingVerdictBalance: 0,
    trialBalance: 0,
    openingArgumentPlayed: false,
    closingArgumentPlayed: false,
    ...overrides,
  };
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Phase rules + admissibility                                         */
/* ──────────────────────────────────────────────────────────────────── */

describe("trial phase rules table", () => {
  it("defines all 10 phases with their canonical names", () => {
    expect(TRIAL_TOTAL_PHASES).toBe(10);
    const names = ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const).map(
      (n) => phaseRuleFor(n).name,
    );
    expect(names).toEqual([
      "Charge",
      "Opening argument",
      "Evidence (presentation)",
      "Evidence (cross-support)",
      "Evidence (closing)",
      "Cross-examination (first)",
      "Cross-examination (second)",
      "Cross-examination (closing)",
      "Closing argument",
      "Verdict",
    ]);
  });

  it("phase 7 admits both reactive and confession; phase 6 only reactive", () => {
    expect(phaseRuleFor(6).admittedCategories).toEqual(["reactive"]);
    expect(phaseRuleFor(7).admittedCategories).toEqual([
      "reactive",
      "confession",
    ]);
  });

  it("phase 10 rejects all plays", () => {
    expect(phaseRuleFor(10).rejectAllPlays).toBe(true);
  });

  it("trialPhaseFromTurn clamps to null past turn 10", () => {
    expect(trialPhaseFromTurn(0)).toBeNull();
    expect(trialPhaseFromTurn(1)).toBe(1);
    expect(trialPhaseFromTurn(10)).toBe(10);
    expect(trialPhaseFromTurn(11)).toBeNull();
  });
});

describe("checkPhaseAdmissibility", () => {
  it("admits a defensive card in phase 1, rejects an offensive one", () => {
    const trial = freshTrial();
    const def = stubCard({ id: "d", trial_categories: ["defensive"] });
    expect(checkPhaseAdmissibility(trial, 1, def)).toBeNull();

    const off = stubCard({ id: "o", trial_categories: ["offensive"] });
    const r = checkPhaseAdmissibility(trial, 1, off);
    expect(r).not.toBeNull();
    expect(r!.kind).toBe("wrong_phase_categories");
  });

  it("rejects uncategorized cards with a distinct reason", () => {
    const trial = freshTrial();
    const def = stubCard({ id: "u" }); // no trial_categories
    expect(checkPhaseAdmissibility(trial, 1, def)?.kind).toBe(
      "card_uncategorized",
    );
  });

  it("rejects every card in phase 10 (verdict)", () => {
    const trial = freshTrial();
    const def = stubCard({ id: "n", trial_categories: ["narrative"] });
    expect(checkPhaseAdmissibility(trial, 10, def)?.kind).toBe(
      "phase_rejects_all_plays",
    );
  });

  it("phase 2 rejects after the opening argument has been played", () => {
    const def = stubCard({ id: "n", trial_categories: ["narrative"] });
    const before = freshTrial({ openingArgumentPlayed: false });
    expect(checkPhaseAdmissibility(before, 2, def)).toBeNull();
    const after = freshTrial({ openingArgumentPlayed: true });
    expect(checkPhaseAdmissibility(after, 2, def)?.kind).toBe(
      "single_play_consumed",
    );
  });

  it("phase 9 rejects after the closing argument has been played", () => {
    const def = stubCard({ id: "n", trial_categories: ["narrative"] });
    const before = freshTrial({ closingArgumentPlayed: false });
    expect(checkPhaseAdmissibility(before, 9, def)).toBeNull();
    const after = freshTrial({ closingArgumentPlayed: true });
    expect(checkPhaseAdmissibility(after, 9, def)?.kind).toBe(
      "single_play_consumed",
    );
  });

  it("multi-category cards admit when any of theirs matches the phase", () => {
    const trial = freshTrial();
    const dual = stubCard({
      id: "x",
      trial_categories: ["narrative", "defensive"],
    });
    // Phase 1 admits defensive; phase 2 admits narrative; both pass.
    expect(checkPhaseAdmissibility(trial, 1, dual)).toBeNull();
    expect(checkPhaseAdmissibility(trial, 2, dual)).toBeNull();
    // Phase 3 admits evidence only; rejects.
    expect(checkPhaseAdmissibility(trial, 3, dual)?.kind).toBe(
      "wrong_phase_categories",
    );
  });
});

/* ──────────────────────────────────────────────────────────────────── */
/*  Verdict-threshold computation                                       */
/* ──────────────────────────────────────────────────────────────────── */

function withTrial(trial: TrialState): GameState {
  // Build a minimal state shape sufficient for resolveTrialOutcome.
  return {
    matchId: "verdict",
    rulesVersion: "1.0.0",
    rngState: "",
    seed: "",
    board: {},
    players: [
      {} as GameState["players"][0],
      {} as GameState["players"][1],
    ] as GameState["players"],
    currentPlayer: 0,
    turnNumber: 10,
    phase: "playing",
    winner: null,
    winReason: null,
    triggerQueue: [],
    actionSeq: 0,
    nextEntityCounter: 1,
    trial,
    heatModifiers: [],
  };
}

describe("resolveTrialOutcome", () => {
  it("neutral opening: balance >= -2 → overturn", () => {
    const state = withTrial(
      freshTrial({ openingVerdictBalance: 0, trialBalance: -2 }),
    );
    const events: import("../../types/Event").GameEvent[] = [];
    const next = produce(state, (d) => resolveTrialOutcome(d, events));
    expect(next.trial!.outcome).toBe("overturn");
    expect(events.find((e) => e.type === "trial_verdict_resolved")).toBeDefined();
  });

  it("neutral opening: balance < -2 → sentence_passed", () => {
    const state = withTrial(
      freshTrial({ openingVerdictBalance: 0, trialBalance: -3 }),
    );
    const events: import("../../types/Event").GameEvent[] = [];
    const next = produce(state, (d) => resolveTrialOutcome(d, events));
    expect(next.trial!.outcome).toBe("sentence_passed");
  });

  it("warm opening (>=+3) shifts threshold to +1; balance 0 → sentence_passed", () => {
    const state = withTrial(
      freshTrial({ openingVerdictBalance: 5, trialBalance: 0 }),
    );
    const next = produce(state, (d) =>
      resolveTrialOutcome(d, [] as import("../../types/Event").GameEvent[]),
    );
    expect(next.trial!.outcome).toBe("sentence_passed");
  });

  it("cool opening (<=-3) shifts threshold to -5; balance -4 → overturn", () => {
    const state = withTrial(
      freshTrial({ openingVerdictBalance: -5, trialBalance: -4 }),
    );
    const next = produce(state, (d) =>
      resolveTrialOutcome(d, [] as import("../../types/Event").GameEvent[]),
    );
    expect(next.trial!.outcome).toBe("overturn");
  });

  it("idempotent: re-resolving a settled match is a no-op", () => {
    const state = withTrial(
      freshTrial({
        openingVerdictBalance: 0,
        trialBalance: 0,
        outcome: "overturn",
      }),
    );
    const events: import("../../types/Event").GameEvent[] = [];
    const next = produce(state, (d) => resolveTrialOutcome(d, events));
    expect(next.trial!.outcome).toBe("overturn"); // unchanged
    expect(events).toHaveLength(0);
  });
});

/* ──────────────────────────────────────────────────────────────────── */
/*  Reducer integration                                                  */
/* ──────────────────────────────────────────────────────────────────── */

function buildConfig(userId: number, generalDefId: string): MatchConfig {
  return {
    userId: userId as MatchConfig["userId"],
    faction: "neutral",
    generalDefId,
    deckCardDefIds: Array.from({ length: 39 }, (_, i) => `${userId}_${i}`),
  };
}

function freshTrialMatch(): GameState {
  return createMatchState({
    matchId: "trial-int",
    seed: "trial-test",
    p1: buildConfig(1, "gen_architect"),
    p2: buildConfig(2, "gen_architect"),
    registry: emptyRegistry,
    trialMode: { openingVerdictBalance: 0 },
  });
}

function startPlaying(state: GameState): GameState {
  let s = state;
  for (const actor of [0, 1] as const) {
    const r = reduce(
      s,
      { kind: "finish_mulligan", actor, seq: 0 } as Action,
      emptyRegistry,
    );
    expect(r.error).toBeUndefined();
    s = r.state;
  }
  return s;
}

describe("trial mode integration", () => {
  it("MatchConfig.trialMode initializes the trial state", () => {
    const s = freshTrialMatch();
    expect(s.trial).toBeDefined();
    expect(s.trial!.openingVerdictBalance).toBe(0);
    expect(s.trial!.trialBalance).toBe(0);
    expect(s.trial!.openingArgumentPlayed).toBe(false);
    expect(s.trial!.closingArgumentPlayed).toBe(false);
    expect(s.trial!.outcome).toBeUndefined();
  });

  it("non-trial matches leave trial undefined", () => {
    const s = createMatchState({
      matchId: "no-trial",
      seed: "x",
      p1: buildConfig(1, "gen_architect"),
      p2: buildConfig(2, "gen_architect"),
      registry: emptyRegistry,
      // no trialMode
    });
    expect(s.trial).toBeUndefined();
  });

  it("phase_started events fire on each turn transition", () => {
    let s = startPlaying(freshTrialMatch());
    const allEvents: import("../../types/Event").GameEvent[] = [];
    for (let i = 0; i < 4; i++) {
      const r = reduce(
        s,
        { kind: "end_turn", actor: s.currentPlayer, seq: 0 } as Action,
        emptyRegistry,
      );
      expect(r.error).toBeUndefined();
      s = r.state;
      allEvents.push(...r.events);
    }
    const phaseStarts = allEvents.filter(
      (e) => e.type === "trial_phase_started",
    );
    expect(phaseStarts.length).toBeGreaterThan(0);
  });

  it("verdict resolves automatically when reaching turn 10", () => {
    let s = startPlaying(freshTrialMatch());
    // Race through end_turns until turnNumber === 10. Each end_turn
    // alternates currentPlayer; turnNumber bumps when nextPlayer === 0.
    let safetyCap = 30;
    while (s.turnNumber < 10 && safetyCap-- > 0) {
      const r = reduce(
        s,
        { kind: "end_turn", actor: s.currentPlayer, seq: 0 } as Action,
        emptyRegistry,
      );
      expect(r.error).toBeUndefined();
      s = r.state;
    }
    expect(s.turnNumber).toBe(10);
    expect(s.trial!.outcome).toBeDefined();
    // Default empty-deck run: zero trial balance, threshold -2 →
    // 0 >= -2 → overturn.
    expect(s.trial!.outcome).toBe("overturn");
  });
});
