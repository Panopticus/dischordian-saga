import { describe, it, expect } from "vitest";
import {
  PRELUDE_COMPLETE_FLAG,
  PRELUDE_HANDOFF_TARGET_ACT,
  shouldAdvanceToAct1OnPreludeComplete,
} from "./preludeHandoff";

describe("preludeHandoff — constants", () => {
  it("target act is 1", () => {
    expect(PRELUDE_HANDOFF_TARGET_ACT).toBe(1);
  });

  it("flag name matches the canonical prelude_complete raiser", () => {
    expect(PRELUDE_COMPLETE_FLAG).toBe("prelude_complete");
  });
});

describe("preludeHandoff — shouldAdvanceToAct1OnPreludeComplete", () => {
  it("true when narrativeAct=0 AND prelude_complete flag is set", () => {
    expect(
      shouldAdvanceToAct1OnPreludeComplete({
        narrativeAct: 0,
        narrativeFlags: { prelude_complete: true },
      }),
    ).toBe(true);
  });

  it("false when prelude_complete flag is missing", () => {
    expect(
      shouldAdvanceToAct1OnPreludeComplete({
        narrativeAct: 0,
        narrativeFlags: {
          prelude_burnt_card_found: true,
          prelude_mission_burnt_card_complete: true,
        },
      }),
    ).toBe(false);
  });

  it("false when prelude_complete is falsy", () => {
    expect(
      shouldAdvanceToAct1OnPreludeComplete({
        narrativeAct: 0,
        narrativeFlags: { prelude_complete: false },
      }),
    ).toBe(false);
    expect(
      shouldAdvanceToAct1OnPreludeComplete({
        narrativeAct: 0,
        narrativeFlags: { prelude_complete: 0 },
      }),
    ).toBe(false);
  });

  it("false when already past Act 1 (idempotent — no regress)", () => {
    expect(
      shouldAdvanceToAct1OnPreludeComplete({
        narrativeAct: 1,
        narrativeFlags: { prelude_complete: true },
      }),
    ).toBe(false);
    expect(
      shouldAdvanceToAct1OnPreludeComplete({
        narrativeAct: 5,
        narrativeFlags: { prelude_complete: true },
      }),
    ).toBe(false);
  });

  it("treats missing inputs as 'not ready'", () => {
    expect(shouldAdvanceToAct1OnPreludeComplete({})).toBe(false);
    expect(
      shouldAdvanceToAct1OnPreludeComplete({ narrativeAct: 0 }),
    ).toBe(false);
  });

  it("treats undefined narrativeAct as 0 (fresh saves where the field was never set)", () => {
    // The field default is 0 per DEFAULT_GAME_STATE, so the predicate
    // must accept missing narrativeAct as pre-Act-1.
    expect(
      shouldAdvanceToAct1OnPreludeComplete({
        narrativeAct: undefined,
        narrativeFlags: { prelude_complete: true },
      }),
    ).toBe(true);
  });

  it("treats null narrativeAct identically to undefined (0 default)", () => {
    expect(
      shouldAdvanceToAct1OnPreludeComplete({
        narrativeAct: null,
        narrativeFlags: { prelude_complete: true },
      }),
    ).toBe(true);
  });

  it("handles null narrativeFlags without throwing", () => {
    expect(
      shouldAdvanceToAct1OnPreludeComplete({
        narrativeAct: 0,
        narrativeFlags: null,
      }),
    ).toBe(false);
  });
});
