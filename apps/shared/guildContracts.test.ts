/**
 * Sanity tests for the weekly contract templates. These are pure
 * data assertions — exactly 8 contracts, unique ids, source breadth,
 * non-empty rewards — so the F.2.1 cs_contract_unlock cinematic
 * (8-card tarot fan) lines up with what we ship.
 */
import { describe, it, expect } from "vitest";

import {
  WEEKLY_CONTRACTS,
  WEEKLY_CONTRACT_COUNT,
  getContractTemplate,
} from "./guildContracts";

describe("WEEKLY_CONTRACTS", () => {
  it("ships exactly 8 contracts (matches the cs_contract_unlock fan)", () => {
    expect(WEEKLY_CONTRACT_COUNT).toBe(8);
    expect(WEEKLY_CONTRACTS).toHaveLength(8);
  });

  it("ids are unique and follow the wc_<slug> convention", () => {
    const ids = new Set(WEEKLY_CONTRACTS.map((c) => c.id));
    expect(ids.size).toBe(WEEKLY_CONTRACTS.length);
    for (const c of WEEKLY_CONTRACTS) {
      expect(c.id.startsWith("wc_")).toBe(true);
    }
  });

  it("each contract names a distinct game-loop source", () => {
    const sources = new Set(WEEKLY_CONTRACTS.map((c) => c.source));
    expect(sources.size).toBe(WEEKLY_CONTRACTS.length);
  });

  it("every contract has a positive target count and at least one reward", () => {
    for (const c of WEEKLY_CONTRACTS) {
      expect(c.targetCount).toBeGreaterThan(0);
      const total = (c.rewards.dream ?? 0) + (c.rewards.guildXp ?? 0);
      expect(total).toBeGreaterThan(0);
    }
  });

  it("getContractTemplate looks up by id and returns undefined for unknown ids", () => {
    expect(getContractTemplate("wc_arena_day")?.title).toBe("Arena Day");
    expect(getContractTemplate("wc_does_not_exist")).toBeUndefined();
  });
});
