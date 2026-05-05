import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { isReplayRequired, verifyMatchReplay } from "./replayVerifier";

describe("isReplayRequired", () => {
  const original = process.env.MATCH_REPLAY_REQUIRED;
  afterEach(() => {
    if (original === undefined) delete process.env.MATCH_REPLAY_REQUIRED;
    else process.env.MATCH_REPLAY_REQUIRED = original;
  });

  it("defaults to false", () => {
    delete process.env.MATCH_REPLAY_REQUIRED;
    expect(isReplayRequired()).toBe(false);
  });

  it("is true when env=true", () => {
    process.env.MATCH_REPLAY_REQUIRED = "true";
    expect(isReplayRequired()).toBe(true);
  });

  it("is false for any non-true value", () => {
    process.env.MATCH_REPLAY_REQUIRED = "1";
    expect(isReplayRequired()).toBe(false);
    process.env.MATCH_REPLAY_REQUIRED = "yes";
    expect(isReplayRequired()).toBe(false);
  });
});

describe("verifyMatchReplay", () => {
  const baseOpts = {
    matchId: "m1",
    seed: "deadbeef",
    rulesVersion: "1.1.0",
    p1Config: {} as never,
    p2Config: {} as never,
    registry: {} as never,
    source: "test",
  };

  it("returns no_action_log when actions are missing", () => {
    const r = verifyMatchReplay({
      ...baseOpts,
      actions: undefined,
      expectedFinalHash: "abc",
    });
    expect(r.ok).toBe(true);
    expect(r.verified).toBe(false);
    expect(r.reason).toBe("no_action_log");
  });

  it("returns no_claimed_hash when hash is missing", () => {
    const r = verifyMatchReplay({
      ...baseOpts,
      actions: [{ type: "noop" } as never],
      expectedFinalHash: undefined,
    });
    expect(r.ok).toBe(true);
    expect(r.verified).toBe(false);
    expect(r.reason).toBe("no_claimed_hash");
  });
});
