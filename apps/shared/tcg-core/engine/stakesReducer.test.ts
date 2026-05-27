/* ═══════════════════════════════════════════════════════
   stakesReducer — initialization + card-play + clipping
   tests. Drives the reducer directly (not via the full
   match reducer) so the tests exercise behavior without
   needing a fully-built GameState.
   ═══════════════════════════════════════════════════════ */
import { describe, expect, it } from "vitest";
import { produce, type Draft } from "immer";
import {
  applyCardPlayToStakes,
  applyDialogStakes,
  initStakesState,
} from "./stakesReducer";
import type { GameState } from "../types/GameState";
import type { GameEvent } from "../types/Event";
import type { CardDefinition } from "../types/Card";
import type { StakesModeConfig } from "../types/StakesMode";

/* ─── Fixtures ─── */

const TRIAL_AXIS = {
  initial: 0,
  min: -10,
  max: 10,
  label: "Trial Balance",
} as const;
const PUBLIC_AXIS = {
  initial: 2,
  min: -10,
  max: 10,
  label: "Public Witness",
} as const;

const STAKES_CONFIG_VERDICT_ONLY: StakesModeConfig = {
  axes: { verdict: TRIAL_AXIS },
};
const STAKES_CONFIG_BOTH_AXES: StakesModeConfig = {
  axes: { verdict: TRIAL_AXIS, public_witness: PUBLIC_AXIS },
};

function stateWith(
  config: StakesModeConfig | null,
): Pick<GameState, "stakes"> {
  return { stakes: config ? initStakesState(config) : undefined };
}

function card(
  fields: Partial<
    Pick<CardDefinition, "stakes_deltas" | "verdict_delta" | "public_delta">
  > & { id?: string } = {},
): CardDefinition {
  const { id, ...rest } = fields;
  return {
    id: (id ?? "test_card") as CardDefinition["id"],
    name: "Test Card",
    faction: "neutral",
    cardType: "spell",
    rarity: "common",
    cost: 1,
    abilities: [],
    keywords: [],
    art: "art/cards/_placeholder.png",
    flavorText: "test card.",
    rulesVersion: "1.1.0",
    ...rest,
  } as unknown as CardDefinition;
}

function applyPlay(
  state: Pick<GameState, "stakes">,
  c: CardDefinition,
  actor: 0 | 1 = 0,
): { state: Pick<GameState, "stakes">; events: GameEvent[] } {
  const events: GameEvent[] = [];
  const next = produce(state, (draft) => {
    applyCardPlayToStakes(draft as unknown as Draft<GameState>, c, actor, events);
  });
  return { state: next, events };
}

/* ─── Initialization ─── */

describe("initStakesState", () => {
  it("seeds each declared axis from its config.initial", () => {
    const s = initStakesState(STAKES_CONFIG_BOTH_AXES);
    expect(s.axes.verdict).toBe(0);
    expect(s.axes.public_witness).toBe(2);
  });

  it("copies per-axis configs into state.config (the reducer reads them from here)", () => {
    const s = initStakesState(STAKES_CONFIG_BOTH_AXES);
    expect(s.config.verdict?.max).toBe(10);
    expect(s.config.public_witness?.label).toBe("Public Witness");
  });

  it("only contains the axes the encounter declared", () => {
    const s = initStakesState(STAKES_CONFIG_VERDICT_ONLY);
    expect(Object.keys(s.axes)).toEqual(["verdict"]);
    expect(Object.keys(s.config)).toEqual(["verdict"]);
  });

  it("defensively clips an out-of-range initial value", () => {
    const s = initStakesState({
      axes: {
        verdict: { initial: 99, min: -5, max: 5, label: "x" },
      },
    });
    expect(s.axes.verdict).toBe(5);
  });
});

/* ─── No-op semantics ─── */

describe("applyCardPlayToStakes — no-op cases", () => {
  it("is a no-op when state.stakes is undefined (no stakesMode config)", () => {
    const s0 = stateWith(null);
    const { state, events } = applyPlay(s0, card({ verdict_delta: 2 }));
    expect(state.stakes).toBeUndefined();
    expect(events).toEqual([]);
  });

  it("is a no-op when the card authors no deltas at all", () => {
    const s0 = stateWith(STAKES_CONFIG_BOTH_AXES);
    const { state, events } = applyPlay(s0, card({}));
    expect(state.stakes?.axes.verdict).toBe(0);
    expect(state.stakes?.axes.public_witness).toBe(2);
    expect(events).toEqual([]);
  });

  it("ignores deltas for axes the encounter did NOT declare", () => {
    const s0 = stateWith(STAKES_CONFIG_VERDICT_ONLY);
    const { state, events } = applyPlay(
      s0,
      card({ stakes_deltas: { public_witness: 3 } }),
    );
    expect(state.stakes?.axes.public_witness).toBeUndefined();
    expect(events).toEqual([]);
  });
});

/* ─── Single-axis card play ─── */

describe("applyCardPlayToStakes — single-axis movement", () => {
  it("moves verdict by the authored stakes_deltas.verdict", () => {
    const s0 = stateWith(STAKES_CONFIG_VERDICT_ONLY);
    const { state, events } = applyPlay(
      s0,
      card({ stakes_deltas: { verdict: 2 } }),
    );
    expect(state.stakes?.axes.verdict).toBe(2);
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      type: "stakes_changed",
      axis: "verdict",
      delta: 2,
      newValue: 2,
      clipped: false,
    });
  });

  it("falls back to verdict_delta when stakes_deltas is absent (replay-determinism guarantee)", () => {
    const s0 = stateWith(STAKES_CONFIG_VERDICT_ONLY);
    const { state, events } = applyPlay(s0, card({ verdict_delta: 3 }));
    expect(state.stakes?.axes.verdict).toBe(3);
    expect(events).toHaveLength(1);
  });
});

/* ─── Multi-axis card play ─── */

describe("applyCardPlayToStakes — multi-axis movement", () => {
  it("moves both declared axes when the card authors both", () => {
    const s0 = stateWith(STAKES_CONFIG_BOTH_AXES);
    const { state, events } = applyPlay(
      s0,
      card({ stakes_deltas: { verdict: 1, public_witness: -2 } }),
    );
    expect(state.stakes?.axes.verdict).toBe(1);
    expect(state.stakes?.axes.public_witness).toBe(0); // 2 + -2
    expect(events).toHaveLength(2);
  });

  it("emits events in canonical STAKES_AXES order (verdict before public_witness) — deterministic", () => {
    const s0 = stateWith(STAKES_CONFIG_BOTH_AXES);
    const { events } = applyPlay(
      s0,
      // Author in REVERSE order; reducer must still emit verdict first.
      card({ stakes_deltas: { public_witness: 1, verdict: 1 } }),
    );
    expect(events.map((e) => (e as { axis: string }).axis)).toEqual([
      "verdict",
      "public_witness",
    ]);
  });
});

/* ─── Clipping ─── */

describe("applyCardPlayToStakes — clipping", () => {
  it("clips upward — authored +3 from current +9 (max +10) caps at 10, emits delta +1", () => {
    let s = stateWith(STAKES_CONFIG_VERDICT_ONLY);
    // Manually push verdict to 9 via repeated plays (3+3+3).
    for (let i = 0; i < 3; i++) {
      ({ state: s } = applyPlay(s, card({ verdict_delta: 3 })));
    }
    expect(s.stakes?.axes.verdict).toBe(9);
    const { state, events } = applyPlay(s, card({ verdict_delta: 3 }));
    expect(state.stakes?.axes.verdict).toBe(10);
    expect(events[0]).toMatchObject({ delta: 1, clipped: true });
  });

  it("clips downward symmetrically", () => {
    let s = stateWith(STAKES_CONFIG_VERDICT_ONLY);
    for (let i = 0; i < 3; i++) {
      ({ state: s } = applyPlay(s, card({ verdict_delta: -3 })));
    }
    expect(s.stakes?.axes.verdict).toBe(-9);
    const { state, events } = applyPlay(s, card({ verdict_delta: -3 }));
    expect(state.stakes?.axes.verdict).toBe(-10);
    expect(events[0]).toMatchObject({ delta: -1, clipped: true });
  });

  it("skips the event entirely when the current value is already at the clip boundary", () => {
    let s = stateWith(STAKES_CONFIG_VERDICT_ONLY);
    for (let i = 0; i < 4; i++) {
      ({ state: s } = applyPlay(s, card({ verdict_delta: 3 })));
    }
    expect(s.stakes?.axes.verdict).toBe(10);
    const { events } = applyPlay(s, card({ verdict_delta: 2 }));
    expect(events).toEqual([]); // No movement → no event.
  });

  it("flags `clipped: false` when the authored delta lands inside the range", () => {
    const s0 = stateWith(STAKES_CONFIG_VERDICT_ONLY);
    const { events } = applyPlay(s0, card({ verdict_delta: 1 }));
    expect(events[0]).toMatchObject({ clipped: false, delta: 1 });
  });
});

/* ─── Event payload ─── */

describe("applyCardPlayToStakes — event payload", () => {
  it("carries the actor + cardDefId + axis + newValue", () => {
    const s0 = stateWith(STAKES_CONFIG_VERDICT_ONLY);
    const c = card({ verdict_delta: 2, id: "abc" });
    const { events } = applyPlay(s0, c, 1);
    expect(events[0]).toMatchObject({
      type: "stakes_changed",
      axis: "verdict",
      player: 1,
      cardDefId: "abc",
      newValue: 2,
    });
  });
});

/* ─── applyDialogStakes ─── */

function applyDialog(
  state: Pick<GameState, "stakes">,
  deltas: ReadonlyArray<{ axisId: string; delta: number }>,
  actor: 0 | 1 = 0,
  outcomeId = "test_tree.node.choice0",
): { state: Pick<GameState, "stakes">; events: GameEvent[] } {
  const events: GameEvent[] = [];
  const next = produce(state, (draft) => {
    applyDialogStakes(
      draft as unknown as Draft<GameState>,
      actor,
      outcomeId,
      deltas,
      events,
    );
  });
  return { state: next, events };
}

describe("applyDialogStakes — no-op cases", () => {
  it("is a no-op when state.stakes is undefined", () => {
    const s0 = stateWith(null);
    const { events } = applyDialog(s0, [{ axisId: "verdict", delta: 2 }]);
    expect(events).toEqual([]);
  });

  it("is a no-op when the deltas array is empty", () => {
    const s0 = stateWith(STAKES_CONFIG_BOTH_AXES);
    const { events, state } = applyDialog(s0, []);
    expect(events).toEqual([]);
    expect(state.stakes?.axes.verdict).toBe(0);
  });

  it("silently drops deltas for axes the encounter did NOT declare", () => {
    const s0 = stateWith(STAKES_CONFIG_VERDICT_ONLY);
    const { events, state } = applyDialog(s0, [
      { axisId: "public_witness", delta: 3 },
    ]);
    expect(events).toEqual([]);
    expect(state.stakes?.axes.verdict).toBe(0);
  });

  it("silently drops unknown axis ids (typo defense)", () => {
    const s0 = stateWith(STAKES_CONFIG_BOTH_AXES);
    const { events } = applyDialog(s0, [
      { axisId: "verdcit", delta: 5 }, // typo
    ]);
    expect(events).toEqual([]);
  });
});

describe("applyDialogStakes — movement + clipping", () => {
  it("moves a single declared axis and emits a stakes_changed_by_dialog event", () => {
    const s0 = stateWith(STAKES_CONFIG_VERDICT_ONLY);
    const { state, events } = applyDialog(s0, [
      { axisId: "verdict", delta: 2 },
    ]);
    expect(state.stakes?.axes.verdict).toBe(2);
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      type: "stakes_changed_by_dialog",
      axis: "verdict",
      delta: 2,
      newValue: 2,
      clipped: false,
    });
  });

  it("propagates outcomeId into the event so the trace ties back to the originating choice", () => {
    const s0 = stateWith(STAKES_CONFIG_VERDICT_ONLY);
    const { events } = applyDialog(
      s0,
      [{ axisId: "verdict", delta: 1 }],
      0,
      "the_seer.first_meeting.choice1",
    );
    expect(events[0]).toMatchObject({
      outcomeId: "the_seer.first_meeting.choice1",
    });
  });

  it("moves multiple axes when the deltas array covers both — emits in canonical STAKES_AXES order", () => {
    const s0 = stateWith(STAKES_CONFIG_BOTH_AXES);
    // Author in reverse order — reducer must still emit verdict first.
    const { events } = applyDialog(s0, [
      { axisId: "public_witness", delta: 1 },
      { axisId: "verdict", delta: 1 },
    ]);
    expect(events.map((e) => (e as { axis: string }).axis)).toEqual([
      "verdict",
      "public_witness",
    ]);
  });

  it("clips and reports the bounded delta with `clipped: true`", () => {
    let s = stateWith(STAKES_CONFIG_VERDICT_ONLY);
    // Push verdict to 9 first via three +3 dialog deltas.
    for (let i = 0; i < 3; i++) {
      ({ state: s } = applyDialog(s, [{ axisId: "verdict", delta: 3 }]));
    }
    expect(s.stakes?.axes.verdict).toBe(9);
    const { state, events } = applyDialog(s, [
      { axisId: "verdict", delta: 3 },
    ]);
    expect(state.stakes?.axes.verdict).toBe(10);
    expect(events[0]).toMatchObject({ delta: 1, clipped: true });
  });

  it("emits no event when the player is already at the clip boundary in the authored direction", () => {
    let s = stateWith(STAKES_CONFIG_VERDICT_ONLY);
    for (let i = 0; i < 4; i++) {
      ({ state: s } = applyDialog(s, [{ axisId: "verdict", delta: 3 }]));
    }
    expect(s.stakes?.axes.verdict).toBe(10);
    const { events } = applyDialog(s, [{ axisId: "verdict", delta: 2 }]);
    expect(events).toEqual([]);
  });

  it("emits no event for zero / undefined / missing deltas", () => {
    const s0 = stateWith(STAKES_CONFIG_VERDICT_ONLY);
    const { events } = applyDialog(s0, [{ axisId: "verdict", delta: 0 }]);
    expect(events).toEqual([]);
  });
});

describe("applyDialogStakes vs applyCardPlayToStakes — same clip/apply primitive", () => {
  it("produces identical state mutations for equivalent inputs (events differ only in type + source)", () => {
    const c = card({ stakes_deltas: { verdict: 2, public_witness: -1 } });
    const dialogDeltas = [
      { axisId: "verdict", delta: 2 },
      { axisId: "public_witness", delta: -1 },
    ];

    const fromCard = applyPlay(stateWith(STAKES_CONFIG_BOTH_AXES), c);
    const fromDialog = applyDialog(stateWith(STAKES_CONFIG_BOTH_AXES), dialogDeltas);

    expect(fromCard.state.stakes?.axes).toEqual(fromDialog.state.stakes?.axes);
    expect(fromCard.events.map((e) => (e as { axis: string }).axis)).toEqual(
      fromDialog.events.map((e) => (e as { axis: string }).axis),
    );
    // Event types differ (one is card-driven, one dialog-driven).
    expect((fromCard.events[0] as { type: string }).type).toBe("stakes_changed");
    expect((fromDialog.events[0] as { type: string }).type).toBe(
      "stakes_changed_by_dialog",
    );
  });
});
