/** audit/05.F1 — contract-level tests for casino. */
import { describe, it, expect } from "vitest";
import { casinoRouter } from "./casino";

describe("casinoRouter contract", () => {
  const procedures = Object.keys(casinoRouter._def.procedures ?? {});

  it("exports the documented procedures", () => {
    for (const name of [
      "getState",
      "getMyCasinoRewards",
      "playVoidSlots",
      "playEntropyDice",
      "playNebulaPoker",
      "claimJackpot",
    ]) {
      expect(procedures, `missing: ${name}`).toContain(name);
    }
  });
});
