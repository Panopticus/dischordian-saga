import { describe, it, expect } from "vitest";
import {
  COMPANION_BANTER,
  isBanterEligible,
  pickBanterPair,
  type BanterPair,
  type BanterPickContext,
} from "./companionBanter";

const baseCtx = (overrides: Partial<BanterPickContext> = {}): BanterPickContext => ({
  trigger: "noop",
  presentSpeakers: [],
  flags: {},
  playCounts: {},
  ...overrides,
});

describe("companionBanter — seed registry invariants", () => {
  it("has at least 6 seed pairs", () => {
    expect(COMPANION_BANTER.length).toBeGreaterThanOrEqual(6);
  });

  it("every pair has exactly two distinct speakers", () => {
    for (const pair of COMPANION_BANTER) {
      expect(pair.speakers.length).toBe(2);
      expect(pair.speakers[0]).not.toBe(pair.speakers[1]);
    }
  });

  it("every pair has at least two lines (so it's actually banter)", () => {
    for (const pair of COMPANION_BANTER) {
      expect(pair.lines.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("every pair id is unique", () => {
    const ids = COMPANION_BANTER.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("isBanterEligible", () => {
  const pair: BanterPair = {
    id: "test_pair",
    speakers: ["elara", "human"],
    trigger: "test_trigger",
    lines: ["A", "B"],
    maxPlays: 2,
  };

  it("rejects on trigger mismatch", () => {
    expect(
      isBanterEligible(
        pair,
        baseCtx({ trigger: "different", presentSpeakers: ["elara", "human"] }),
      ),
    ).toBe(false);
  });

  it("rejects when one of the speakers is not present", () => {
    expect(
      isBanterEligible(
        pair,
        baseCtx({ trigger: "test_trigger", presentSpeakers: ["elara"] }),
      ),
    ).toBe(false);
  });

  it("accepts when both speakers are present and trigger matches", () => {
    expect(
      isBanterEligible(
        pair,
        baseCtx({ trigger: "test_trigger", presentSpeakers: ["elara", "human", "antiquarian"] }),
      ),
    ).toBe(true);
  });

  it("rejects once maxPlays is reached", () => {
    expect(
      isBanterEligible(
        pair,
        baseCtx({
          trigger: "test_trigger",
          presentSpeakers: ["elara", "human"],
          playCounts: { test_pair: 2 },
        }),
      ),
    ).toBe(false);
  });

  it("respects requiresFlags", () => {
    const gated: BanterPair = { ...pair, requiresFlags: ["act_2_complete"] };
    expect(
      isBanterEligible(
        gated,
        baseCtx({ trigger: "test_trigger", presentSpeakers: ["elara", "human"] }),
      ),
    ).toBe(false);
    expect(
      isBanterEligible(
        gated,
        baseCtx({
          trigger: "test_trigger",
          presentSpeakers: ["elara", "human"],
          flags: { act_2_complete: true },
        }),
      ),
    ).toBe(true);
  });

  it("respects excludeFlags (romance lockout)", () => {
    const gated: BanterPair = { ...pair, excludeFlags: ["romance:committed:elara"] };
    expect(
      isBanterEligible(
        gated,
        baseCtx({
          trigger: "test_trigger",
          presentSpeakers: ["elara", "human"],
          flags: { "romance:committed:elara": true },
        }),
      ),
    ).toBe(false);
  });
});

describe("pickBanterPair", () => {
  it("returns null when nothing matches", () => {
    expect(pickBanterPair(baseCtx({ trigger: "no_such_trigger" }))).toBeNull();
  });

  it("picks the first eligible seeded pair", () => {
    const result = pickBanterPair(
      baseCtx({
        trigger: "first_costly_morality_choice",
        presentSpeakers: ["elara", "human"],
      }),
    );
    expect(result?.id).toBe("banter_elara_human_first_hard_choice");
  });

  it("respects romance lockout on the original Locke–Human flirt pair", () => {
    // The seed flirt pair (excludeFlags: romance:committed:locke) does NOT
    // fire when romance is committed; the COMMITTED-pair (different banter
    // entirely, requiresFlags: romance:committed:locke) does fire instead.
    // This guards both — the lockout AND the substitution.
    const flirt = pickBanterPair(
      baseCtx({
        trigger: "trade_contract_completed",
        presentSpeakers: ["locke", "human"],
        flags: { "romance:committed:locke": true },
      }),
    );
    expect(flirt?.id).toBe("banter_locke_human_locke_committed");

    const flirtUncommitted = pickBanterPair(
      baseCtx({
        trigger: "trade_contract_completed",
        presentSpeakers: ["locke", "human"],
        flags: {},
      }),
    );
    expect(flirtUncommitted?.id).toBe("banter_locke_human_after_trade_win");
  });
});
