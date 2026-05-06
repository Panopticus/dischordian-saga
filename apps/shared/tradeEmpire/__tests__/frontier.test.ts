// apps/shared/tradeEmpire/__tests__/frontier.test.ts

import { describe, it, expect } from "vitest";
import {
  FRONTIER_CANDIDATES,
  pickFrontierRotation,
  validateFrontierCandidates,
} from "../frontier";

describe("Frontier — Phase B", () => {
  it("candidates are unique", () => {
    expect(validateFrontierCandidates()).toEqual([]);
  });

  it("pickFrontierRotation does not re-open the same sector", () => {
    const rot = pickFrontierRotation(FRONTIER_CANDIDATES[0], () => 0);
    expect(rot.opening).not.toBe(FRONTIER_CANDIDATES[0]);
    expect(rot.relaxing).toBe(FRONTIER_CANDIDATES[0]);
  });

  it("first rotation has null relaxing", () => {
    const rot = pickFrontierRotation(null, () => 0);
    expect(rot.relaxing).toBeNull();
    expect(FRONTIER_CANDIDATES).toContain(rot.opening);
  });

  it("RNG is deterministic — same seed picks same opening", () => {
    const rot1 = pickFrontierRotation(null, () => 0.3);
    const rot2 = pickFrontierRotation(null, () => 0.3);
    expect(rot1.opening).toBe(rot2.opening);
  });
});
