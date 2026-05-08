import { describe, it, expect } from "vitest";
import { resolveAct3PathDividend } from "./act3PathDividend";

describe("resolveAct3PathDividend", () => {
  it("returns NO_DIVIDEND when no fork flag is set", () => {
    const d = resolveAct3PathDividend({});
    expect(d.elaraTrustDelta).toBe(0);
    expect(d.humanTrustDelta).toBe(0);
    expect(d.moralityDelta).toBe(0);
    expect(d.flag).toBeNull();
    expect(d.source).toBeNull();
  });

  it("transparency rewards Elara's bond exclusively", () => {
    const d = resolveAct3PathDividend({
      act3_path_transparent_chosen: true,
    });
    expect(d.elaraTrustDelta).toBe(10);
    expect(d.humanTrustDelta).toBe(0);
    expect(d.moralityDelta).toBe(0);
    expect(d.flag).toBe("act6_path_dividend_transparent");
    expect(d.source).toBe("act3_path_transparent_chosen");
  });

  it("pragmatism splits the dividend evenly", () => {
    const d = resolveAct3PathDividend({
      act3_path_pragmatic_chosen: true,
    });
    expect(d.elaraTrustDelta).toBe(5);
    expect(d.humanTrustDelta).toBe(5);
    expect(d.moralityDelta).toBe(0);
    expect(d.flag).toBe("act6_path_dividend_pragmatic");
    expect(d.source).toBe("act3_path_pragmatic_chosen");
  });

  it("full secret rewards Human trust + nudges morality machine-ward", () => {
    const d = resolveAct3PathDividend({
      act3_path_full_secret_chosen: true,
    });
    expect(d.elaraTrustDelta).toBe(0);
    expect(d.humanTrustDelta).toBe(10);
    expect(d.moralityDelta).toBe(-3);
    expect(d.flag).toBe("act6_path_dividend_full_secret");
    expect(d.source).toBe("act3_path_full_secret_chosen");
  });

  it("each path produces a distinct dividend signature", () => {
    const transparent = resolveAct3PathDividend({
      act3_path_transparent_chosen: true,
    });
    const pragmatic = resolveAct3PathDividend({
      act3_path_pragmatic_chosen: true,
    });
    const fullSecret = resolveAct3PathDividend({
      act3_path_full_secret_chosen: true,
    });
    const sigs = new Set([
      JSON.stringify(transparent),
      JSON.stringify(pragmatic),
      JSON.stringify(fullSecret),
    ]);
    // Three paths => three distinct dividend signatures, no collisions.
    expect(sigs.size).toBe(3);
  });

  it("respects precedence when multiple fork flags are set (transparent wins)", () => {
    // Pathologic state — the act-branching system disallows this in
    // practice, but the resolver must be deterministic for replay
    // safety even if upstream code regresses.
    const d = resolveAct3PathDividend({
      act3_path_transparent_chosen: true,
      act3_path_pragmatic_chosen: true,
      act3_path_full_secret_chosen: true,
    });
    expect(d.source).toBe("act3_path_transparent_chosen");
  });
});
