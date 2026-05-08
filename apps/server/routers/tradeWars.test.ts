/** audit/05.F1 — contract-level tests for tradeWars. */
import { describe, it, expect } from "vitest";
import { tradeWarsRouter } from "./tradeWars";

describe("tradeWarsRouter contract", () => {
  const procedures = Object.keys(tradeWarsRouter._def.procedures ?? {});

  it("exports the documented procedures", () => {
    for (const name of [
      "getState",
      "getSector",
      "warp",
      "trade",
      "scan",
      "upgradeShip",
      "buyFighters",
      "claimPlanet",
      "collectIncome",
    ]) {
      expect(procedures, `missing: ${name}`).toContain(name);
    }
  });
});
