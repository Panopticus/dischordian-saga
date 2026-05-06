// apps/server/services/itemsMatterChain.integration.test.ts
//
// End-to-end chain test for the items-matter / Game-of-Thrones arc
// (phase 9 verification). Exercises the orchestration layer without
// a DB: post a contract_signed event into the public-knowledge log,
// then call enrichPublicFlags and verify the canonical pk.*.recent
// flags surface as expected for the corresponding broker NPC.
//
// This is the "you said NPCs would react to recent contract signings;
// prove it" test the original design plan called for in §Verification.

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  _resetPublicKnowledgeCache,
  postPublicKnowledge,
} from "./publicKnowledgeService";
import { enrichPublicFlags } from "./npcPublicKnowledgeReactions";
import {
  applyEnergyGainForFaction,
  DEFAULT_DISCHORDIA_CYCLE_STATE,
} from "@shared/dischordiaCycle";
import { rivalryDeltas } from "@shared/tradeEmpire/houses";
import { tcgFactionToAlignment, tagForCard } from "@shared/tradeEmpire/itemTags";
import { applyDeclarationModifier, getDeclaration } from "@shared/tradeEmpire/declarations";

const TEST_USER = 4242;

beforeEach(() => {
  _resetPublicKnowledgeCache();
});

afterEach(() => {
  _resetPublicKnowledgeCache();
});

describe("Items-matter chain — public-knowledge → NPC enrichment", () => {
  it("a posted contract_signed event surfaces as pk.*.recent for Locke", async () => {
    await postPublicKnowledge({
      userId: TEST_USER,
      eventKind: "contract_signed",
      subjectHouseKey: "nb_authoritys_ledger",
      summary: "Authority's Ledger acknowledged a new signing.",
      payload: { contractKey: "locke.retainer_baseline" },
      seasonNumber: 1,
    });

    const flags = await enrichPublicFlags("adjudicator_locke", TEST_USER);
    expect(flags.has("pk.contract_signed.recent")).toBe(true);
    expect(flags.has("pk.nb_authoritys_ledger.contract_signed.recent")).toBe(true);
  });

  it("tribute_paid surfaces for the receiving house's primary NPC", async () => {
    await postPublicKnowledge({
      userId: TEST_USER,
      eventKind: "tribute_paid",
      subjectHouseKey: "antiquarian_shelfmates",
      summary: "Shelf-mates accepted a tribute.",
      payload: {},
      seasonNumber: 1,
    });
    const flags = await enrichPublicFlags("the_seer", TEST_USER);
    expect(flags.has("pk.tribute_paid.recent")).toBe(true);
    expect(flags.has("pk.antiquarian_shelfmates.tribute_paid.recent")).toBe(true);
  });

  it("a Hierarchy event does NOT surface for an Antiquarian NPC", async () => {
    await postPublicKnowledge({
      userId: TEST_USER,
      eventKind: "demand_paid",
      subjectHouseKey: "hierarchy_severance",
      summary: "Severance Division accepted payment.",
      payload: {},
      seasonNumber: 1,
    });
    const flags = await enrichPublicFlags("the_seer", TEST_USER);
    expect(flags.has("pk.hierarchy_severance.demand_paid.recent")).toBe(false);
  });

  it("base flags pass through unchanged when there are no public-knowledge events", async () => {
    const base = new Set<string>(["custom_flag"]);
    const flags = await enrichPublicFlags("adjudicator_locke", TEST_USER, base);
    expect(flags.has("custom_flag")).toBe(true);
  });
});

describe("Items-matter chain — sign-day pure invariants", () => {
  it("rivalryDeltas anti-correlate primary house and rival", () => {
    const deltas = rivalryDeltas("nb_authoritys_ledger", 10);
    expect(deltas.nb_authoritys_ledger).toBe(10);
    expect(deltas.nb_civic_engineers).toBeLessThan(0);
  });

  it("declaration modifier amplifies primary-house gain", () => {
    const decl = getDeclaration("decl.hierarchy.thaloria_heretical")!;
    const amplified = applyDeclarationModifier(decl, decl.issuingHouse, 10);
    expect(amplified).toBeGreaterThan(10);
  });

  it("Dischordia faction nudge pushes light for Antiquarian", () => {
    const after = applyEnergyGainForFaction(
      DEFAULT_DISCHORDIA_CYCLE_STATE,
      "trade_diplomacy_treaty",
      "antiquarian",
    );
    expect(after.lightEnergy).toBeGreaterThan(
      DEFAULT_DISCHORDIA_CYCLE_STATE.lightEnergy,
    );
  });

  it("Dischordia faction nudge pushes dark for Hierarchy", () => {
    const after = applyEnergyGainForFaction(
      DEFAULT_DISCHORDIA_CYCLE_STATE,
      "trade_diplomacy_treaty",
      "hierarchy",
    );
    expect(after.darkEnergy).toBeGreaterThan(
      DEFAULT_DISCHORDIA_CYCLE_STATE.darkEnergy,
    );
  });

  it("tcgFactionToAlignment maps every TCG faction to a sub-house or neutral", () => {
    expect(tcgFactionToAlignment("new_babylon")).toBe("nb_authoritys_ledger");
    expect(tcgFactionToAlignment("hierarchy_of_damned")).toBe("hierarchy_severance");
    expect(tcgFactionToAlignment("antiquarian")).toBe("antiquarian_shelfmates");
    expect(tcgFactionToAlignment("neutral")).toBe("neutral");
  });

  it("tagForCard composes faction alignment + craft method", () => {
    const tag = tagForCard({ faction: "new_babylon", obtainedVia: "crafting" });
    expect(tag.alignment).toBe("nb_authoritys_ledger");
    expect(tag.craftMethod).toBe("hand_crafted");
  });
});
