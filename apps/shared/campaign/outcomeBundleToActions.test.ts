import { describe, expect, it } from "vitest";
import { outcomeBundleToEngineActions } from "./outcomeBundleToActions";
import type { OutcomeBundle } from "./applyDialogChoice";

function bundle(overrides: Partial<OutcomeBundle> = {}): OutcomeBundle {
  return {
    outcomeId: "test_tree.node.choice0",
    flagWrites: [],
    trustWrites: [],
    axisWrites: [],
    factionRepWrites: [],
    stakesWrites: [],
    cardUnlockWrites: [],
    deckMutationWrites: [],
    ...overrides,
  };
}

function seqGen(start = 100): () => number {
  let n = start;
  return () => n++;
}

describe("outcomeBundleToEngineActions", () => {
  it("returns an empty list when the bundle has no stakes writes", () => {
    const actions = outcomeBundleToEngineActions(bundle(), 0, seqGen());
    expect(actions).toEqual([]);
  });

  it("produces a single apply_dialog_stakes action when the bundle has stakes writes", () => {
    const actions = outcomeBundleToEngineActions(
      bundle({
        stakesWrites: [
          { axisId: "verdict", delta: 2 },
          { axisId: "public_witness", delta: -1 },
        ],
      }),
      0,
      seqGen(),
    );
    expect(actions).toHaveLength(1);
    expect(actions[0]).toMatchObject({
      kind: "apply_dialog_stakes",
      actor: 0,
      outcomeId: "test_tree.node.choice0",
      deltas: [
        { axisId: "verdict", delta: 2 },
        { axisId: "public_witness", delta: -1 },
      ],
    });
  });

  it("preserves outcomeId verbatim on the action so the engine trace ties back to the choice", () => {
    const actions = outcomeBundleToEngineActions(
      bundle({
        outcomeId: "the_seer.first_meeting.choice2",
        stakesWrites: [{ axisId: "verdict", delta: 1 }],
      }),
      1,
      seqGen(),
    );
    expect((actions[0] as { outcomeId: string }).outcomeId).toBe(
      "the_seer.first_meeting.choice2",
    );
  });

  it("calls nextSeq exactly once per action emitted (one per bundle today)", () => {
    let calls = 0;
    const seq = () => {
      calls++;
      return calls;
    };
    const actions = outcomeBundleToEngineActions(
      bundle({
        stakesWrites: [{ axisId: "verdict", delta: 1 }],
      }),
      0,
      seq,
    );
    expect(calls).toBe(1);
    expect((actions[0] as { seq: number }).seq).toBe(1);
  });

  it("does NOT call nextSeq when there's nothing to dispatch", () => {
    let calls = 0;
    const seq = () => {
      calls++;
      return calls;
    };
    outcomeBundleToEngineActions(bundle(), 0, seq);
    expect(calls).toBe(0);
  });

  it("propagates the player's side onto the action's actor field", () => {
    const playerActions = outcomeBundleToEngineActions(
      bundle({ stakesWrites: [{ axisId: "verdict", delta: 1 }] }),
      0,
      seqGen(),
    );
    const opponentActions = outcomeBundleToEngineActions(
      bundle({ stakesWrites: [{ axisId: "verdict", delta: 1 }] }),
      1,
      seqGen(),
    );
    expect((playerActions[0] as { actor: number }).actor).toBe(0);
    expect((opponentActions[0] as { actor: number }).actor).toBe(1);
  });

  it("preserves stakesWrites declaration order in the action's deltas array", () => {
    const actions = outcomeBundleToEngineActions(
      bundle({
        stakesWrites: [
          { axisId: "public_witness", delta: 1 },
          { axisId: "verdict", delta: -2 },
        ],
      }),
      0,
      seqGen(),
    );
    // Bundle order is preserved on the wire; the ENGINE's reducer
    // re-orders by canonical STAKES_AXES on emit. The bridge is a
    // straight serialization — re-ordering is the reducer's job.
    const deltas = (actions[0] as { deltas: ReadonlyArray<{ axisId: string }> })
      .deltas;
    expect(deltas.map((d) => d.axisId)).toEqual(["public_witness", "verdict"]);
  });

  it("returns ONLY apply_dialog_stakes actions today (other bundle writes route through the server)", () => {
    // Flag / trust / faction-rep writes are server-routed, not
    // engine-routed. The bridge must NOT produce engine actions for
    // them — the contract is "stakes only".
    const actions = outcomeBundleToEngineActions(
      bundle({
        flagWrites: [{ flag: "test_flag", scope: "narrative" }],
        trustWrites: [{ delta: 1 }],
        factionRepWrites: [{ faction: "antiquarian", delta: 1 }],
        cardUnlockWrites: [
          { cardDefId: "test_card", via: "dialog_choice" },
        ],
      }),
      0,
      seqGen(),
    );
    expect(actions).toEqual([]);
  });
});
