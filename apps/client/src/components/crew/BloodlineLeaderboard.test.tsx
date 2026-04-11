/**
 * Structural smoke test for BloodlineLeaderboard.
 */
import { describe, it, expect } from "vitest";
import BloodlineLeaderboard from "./BloodlineLeaderboard";

describe("BloodlineLeaderboard", () => {
  it("exports a component function as default", () => {
    expect(BloodlineLeaderboard).toBeDefined();
    expect(typeof BloodlineLeaderboard).toBe("function");
  });
});
