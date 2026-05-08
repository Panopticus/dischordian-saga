/** audit/05.F1 — contract-level tests for architectConsole. */
import { describe, it, expect } from "vitest";
import { architectConsoleRouter } from "./architectConsole";

describe("architectConsoleRouter contract", () => {
  const procedures = Object.keys(architectConsoleRouter._def.procedures ?? {});

  it("exports the documented procedures", () => {
    for (const name of [
      "submitVote",
      "getActiveVotes",
      "getTomeEntries",
      "castDailyVote",
      "getDailyVoteState",
    ]) {
      expect(procedures, `missing: ${name}`).toContain(name);
    }
  });
});
