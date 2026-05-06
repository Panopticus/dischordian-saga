// apps/server/services/npcPublicKnowledgeReactions.test.ts
//
// Pure-function tests for housesOfInterestForNpc and the static
// flag enumerator. The async enrichPublicFlags() is exercised at
// runtime — these cover the pure parts.

import { describe, it, expect } from "vitest";
import {
  allPossiblePublicKnowledgeFlags,
  housesOfInterestForNpc,
} from "./npcPublicKnowledgeReactions";

describe("housesOfInterestForNpc", () => {
  it("Locke cares about Authority's Ledger and its rival", () => {
    const interests = housesOfInterestForNpc("adjudicator_locke");
    expect(interests).toContain("nb_authoritys_ledger");
    expect(interests).toContain("nb_civic_engineers");
  });

  it("Nilmorg cares about Severance and Acquisitions", () => {
    const interests = housesOfInterestForNpc("nilmorg");
    expect(interests).toContain("hierarchy_severance");
    expect(interests).toContain("hierarchy_acquisitions");
  });

  it("the Seer cares about Antiquarian sub-houses", () => {
    const interests = housesOfInterestForNpc("the_seer");
    expect(interests).toContain("antiquarian_shelfmates");
    expect(interests).toContain("antiquarian_casino");
  });

  it("returns empty array for unknown / non-broker NPCs", () => {
    expect(housesOfInterestForNpc("the_meme")).toEqual([]);
  });
});

describe("allPossiblePublicKnowledgeFlags", () => {
  it("emits canonical pk.<eventKind>.recent flags", () => {
    const flags = allPossiblePublicKnowledgeFlags();
    expect(flags).toContain("pk.contract_signed.recent");
    expect(flags).toContain("pk.tribute_paid.recent");
    expect(flags).toContain("pk.demand_refused.recent");
  });

  it("emits canonical pk.<houseKey>.<eventKind>.recent flags", () => {
    const flags = allPossiblePublicKnowledgeFlags();
    expect(flags).toContain("pk.nb_authoritys_ledger.contract_signed.recent");
    expect(flags).toContain("pk.hierarchy_severance.tribute_paid.recent");
  });

  it("flag list is unique", () => {
    const flags = allPossiblePublicKnowledgeFlags();
    expect(flags.length).toBe(new Set(flags).size);
  });
});
