import { describe, expect, it } from "vitest";
import {
  DEFAULT_ACTION_DURATION_MS,
  FALLBACK_ACTION_DURATION_MS,
  durationForAction,
  planExportFrames,
  summarizeFramePlan,
  type FramePlan,
} from "./replayExport";
import type { ReplayResult, ReplayStep } from "./replay";
import type { Action } from "../types/Action";
import type { GameState } from "../types/GameState";

/* The export pipeline only needs the `stateAfter`, `action`,
   `error?` fields off each step, plus `ok` + `versionCompatible`
   off the result. We build a minimal cast to satisfy TypeScript
   without dragging the full engine into the test. The pure
   helpers under test never read the unused fields. */

function fakeAction(kind: Action["kind"], seq = 0): Action {
  return { kind, actor: "p1", seq } as unknown as Action;
}

function fakeState(matchId = "m_test"): GameState {
  return { matchId } as unknown as GameState;
}

function step(action: Action, error?: string, stateAfter?: GameState, idx = 0): ReplayStep {
  return {
    actionIndex: idx,
    action,
    stateAfter: stateAfter ?? fakeState(),
    events: [],
    ...(error ? { error } : {}),
  };
}

function fakeResult(
  steps: ReplayStep[],
  over: Partial<Pick<ReplayResult, "ok" | "versionCompatible">> = {},
): ReplayResult {
  return {
    ok: over.ok ?? true,
    initialState: fakeState(),
    steps,
    finalState: steps[steps.length - 1]?.stateAfter ?? fakeState(),
    finalStateHash: "hash_test",
    versionCompatible: over.versionCompatible ?? true,
    errorCount: steps.filter((s) => s.error).length,
  };
}

describe("durationForAction (audit/16 PR 36 — Strm7)", () => {
  it("returns the per-kind value from the table", () => {
    expect(durationForAction(fakeAction("play_card"))).toBe(
      DEFAULT_ACTION_DURATION_MS.play_card,
    );
    expect(durationForAction(fakeAction("end_turn"))).toBe(
      DEFAULT_ACTION_DURATION_MS.end_turn,
    );
  });

  it("falls back to FALLBACK_ACTION_DURATION_MS for unknown kinds", () => {
    const fakeUnknown = { kind: "secret_kind", actor: "p1", seq: 1 } as unknown as Action;
    expect(durationForAction(fakeUnknown)).toBe(FALLBACK_ACTION_DURATION_MS);
  });
});

describe("planExportFrames", () => {
  it("returns an empty plan for a failed replay", () => {
    const r = fakeResult([], { ok: false });
    const plan = planExportFrames(r);
    expect(plan.ok).toBe(false);
    expect(plan.frames).toHaveLength(0);
    expect(plan.totalDurationMs).toBe(0);
  });

  it("returns an empty plan for a version-incompatible replay", () => {
    const r = fakeResult([step(fakeAction("play_card"), undefined, fakeState(), 0)], {
      versionCompatible: false,
    });
    const plan = planExportFrames(r);
    expect(plan.ok).toBe(false);
    expect(plan.versionCompatible).toBe(false);
    expect(plan.frames).toHaveLength(0);
  });

  it("includes one frame per non-erroring step", () => {
    const steps = [
      step(fakeAction("play_card", 1), undefined, fakeState(), 0),
      step(fakeAction("end_turn", 2), undefined, fakeState(), 1),
      step(fakeAction("play_card", 3), undefined, fakeState(), 2),
    ];
    const plan = planExportFrames(fakeResult(steps));
    expect(plan.ok).toBe(true);
    expect(plan.frames).toHaveLength(3);
    expect(plan.frames.map((f) => f.stepIndex)).toEqual([0, 1, 2]);
  });

  it("skips steps that recorded an error (no frame, no duration)", () => {
    const steps = [
      step(fakeAction("play_card", 1), undefined, fakeState(), 0),
      step(fakeAction("end_turn", 2), "reducer rejected", fakeState(), 1),
      step(fakeAction("play_card", 3), undefined, fakeState(), 2),
    ];
    const plan = planExportFrames(fakeResult(steps));
    expect(plan.frames.map((f) => f.stepIndex)).toEqual([0, 2]);
    // Both frames are play_card (1500ms each) → total ~3000.
    // Final-frame cap of 3000 means second frame stays 1500.
    expect(plan.totalDurationMs).toBe(
      DEFAULT_ACTION_DURATION_MS.play_card * 2,
    );
  });

  it("produces strictly monotonic timeMs", () => {
    const steps = [
      step(fakeAction("mulligan", 1), undefined, fakeState(), 0),
      step(fakeAction("play_card", 2), undefined, fakeState(), 1),
      step(fakeAction("attack", 3), undefined, fakeState(), 2),
    ];
    const plan = planExportFrames(fakeResult(steps));
    for (let i = 1; i < plan.frames.length; i++) {
      expect(plan.frames[i]!.timeMs).toBeGreaterThan(plan.frames[i - 1]!.timeMs);
    }
  });

  it("first frame's timeMs is 0", () => {
    const steps = [step(fakeAction("play_card", 1), undefined, fakeState(), 0)];
    const plan = planExportFrames(fakeResult(steps));
    expect(plan.frames[0]!.timeMs).toBe(0);
  });

  it("totalDurationMs equals the sum of every frame's durationMs", () => {
    const steps = [
      step(fakeAction("play_card", 1), undefined, fakeState(), 0),
      step(fakeAction("end_turn", 2), undefined, fakeState(), 1),
      step(fakeAction("attack", 3), undefined, fakeState(), 2),
    ];
    const plan = planExportFrames(fakeResult(steps));
    const sum = plan.frames.reduce((s, f) => s + f.durationMs, 0);
    expect(plan.totalDurationMs).toBe(sum);
  });

  it("respects the durationOverrides option", () => {
    const steps = [step(fakeAction("play_card", 1), undefined, fakeState(), 0)];
    const plan = planExportFrames(fakeResult(steps), {
      durationOverrides: { play_card: 100 },
    });
    expect(plan.frames[0]!.durationMs).toBe(100);
  });

  it("caps the final frame's durationMs to finalFrameDurationMs (default 3000)", () => {
    // attack is 2000ms, but if we override it to be the longest possible,
    // the cap should clip it to 3000.
    const steps = [step(fakeAction("attack", 1), undefined, fakeState(), 0)];
    const plan = planExportFrames(fakeResult(steps), {
      durationOverrides: { attack: 8000 },
    });
    expect(plan.frames[0]!.durationMs).toBe(3000);
    expect(plan.totalDurationMs).toBe(3000);
  });

  it("respects a custom finalFrameDurationMs cap", () => {
    const steps = [step(fakeAction("play_card", 1), undefined, fakeState(), 0)];
    const plan = planExportFrames(fakeResult(steps), { finalFrameDurationMs: 500 });
    // play_card is 1500 by default → capped to 500 since it's the final frame.
    expect(plan.frames[0]!.durationMs).toBe(500);
  });

  it("propagates the action onto each frame as primaryAction", () => {
    const a1 = fakeAction("play_card", 1);
    const a2 = fakeAction("end_turn", 2);
    const plan = planExportFrames(
      fakeResult([
        step(a1, undefined, fakeState(), 0),
        step(a2, undefined, fakeState(), 1),
      ]),
    );
    expect(plan.frames[0]!.primaryAction).toBe(a1);
    expect(plan.frames[1]!.primaryAction).toBe(a2);
  });
});

describe("summarizeFramePlan", () => {
  it("returns 0 for an empty plan", () => {
    const plan: FramePlan = {
      ok: false,
      matchId: "",
      rulesVersion: "",
      versionCompatible: true,
      totalDurationMs: 0,
      frames: [],
    };
    const s = summarizeFramePlan(plan);
    expect(s.frameCount).toBe(0);
    expect(s.totalSeconds).toBe(0);
    expect(s.estimatedFileSizeMB).toBe(0);
  });

  it("rounds totalSeconds to 1 decimal", () => {
    const plan: FramePlan = {
      ok: true,
      matchId: "",
      rulesVersion: "",
      versionCompatible: true,
      totalDurationMs: 12340,
      frames: [],
    };
    expect(summarizeFramePlan(plan).totalSeconds).toBe(12.3);
  });

  it("estimates a roughly-sane file size", () => {
    const plan: FramePlan = {
      ok: true,
      matchId: "",
      rulesVersion: "",
      versionCompatible: true,
      totalDurationMs: 60_000, // 60s
      frames: [],
    };
    // 60s × 0.5 MB/s baseline = 30 MB.
    expect(summarizeFramePlan(plan).estimatedFileSizeMB).toBe(30);
  });
});
