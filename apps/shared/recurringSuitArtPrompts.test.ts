import { describe, expect, it } from "vitest";

import { DGRS_LIONS_CLUB_MEMBERSHIP_ID } from "./lionsClub";
import {
  RECURRING_SUIT_ART_PROMPTS,
  RECURRING_SUIT_SET_ROSTER,
  buildRecurringSuitPrompt,
  getPromptsForRecurringSet,
  getRecurringSet,
  getRecurringSetsByCategory,
  recurringAssetId,
} from "./recurringSuitArtPrompts";
import { SUIT_SLOT_ORDER } from "./suitArtPrompts";

describe("recurring suit catalog — parametric invariants", () => {
  it("has a roster that covers all four recurring categories", () => {
    const cats = new Set(RECURRING_SUIT_SET_ROSTER.map((s) => s.category));
    expect(cats.has("seasonal")).toBe(true);
    expect(cats.has("seasonal-event")).toBe(true);
    expect(cats.has("annual-vote")).toBe(true);
    expect(cats.has("annual-founder")).toBe(true);
  });

  it("expands to a prompt count of sum(set.rarities.length) × 10", () => {
    const expected =
      RECURRING_SUIT_SET_ROSTER.reduce((sum, s) => sum + s.rarities.length, 0) *
      SUIT_SLOT_ORDER.length;
    expect(RECURRING_SUIT_ART_PROMPTS.length).toBe(expected);
  });

  it("produces unique asset ids across the entire catalog", () => {
    const ids = RECURRING_SUIT_ART_PROMPTS.map((p) => p.assetId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every rental set declares a membershipId", () => {
    for (const set of RECURRING_SUIT_SET_ROSTER) {
      expect(set.ownership).toBe("rental");
      expect(set.membershipId.length).toBeGreaterThan(0);
    }
  });

  it("every set declares an equipSlotMapping that covers all 10 art slots", () => {
    for (const set of RECURRING_SUIT_SET_ROSTER) {
      for (const slot of SUIT_SLOT_ORDER) {
        expect(set.equipSlotMapping[slot]).toBeDefined();
      }
    }
  });

  it("every prompt carries through the set's ownership + membershipId", () => {
    for (const prompt of RECURRING_SUIT_ART_PROMPTS) {
      expect(prompt.ownership).toBe("rental");
      expect(prompt.membershipId.length).toBeGreaterThan(0);
    }
  });

  it("produces the right prompt count for the Iron Lion founder set (2 rarities × 10 slots)", () => {
    const prompts = getPromptsForRecurringSet("iron-clad-lions-ceremonial");
    expect(prompts.length).toBe(2 * SUIT_SLOT_ORDER.length);
    const rarities = new Set(prompts.map((p) => p.rarity));
    expect(rarities.has("legendary")).toBe(true);
    expect(rarities.has("mythic")).toBe(true);
    expect(rarities.size).toBe(2);
  });
});

describe("recurring suit catalog — content-level checks", () => {
  it("pins the Iron Lion set to the DGRS Lions Club membership id", () => {
    const ironLion = getRecurringSet("iron-clad-lions-ceremonial");
    expect(ironLion).toBeDefined();
    expect(ironLion?.membershipId).toBe(DGRS_LIONS_CLUB_MEMBERSHIP_ID);
    expect(ironLion?.renewalCycle).toBe("annual-founder");
  });

  it("mentions white lacquered iron + gold lion-mask in the Iron Lion motif", () => {
    const ironLion = getRecurringSet("iron-clad-lions-ceremonial");
    expect(ironLion?.motif.toLowerCase()).toContain("white lacquered iron");
    expect(ironLion?.motif.toLowerCase()).toContain("gold lion-mask");
  });

  it("links annual-vote sets to CommunityVote ids", () => {
    const voteSets = getRecurringSetsByCategory("annual-vote");
    expect(voteSets.length).toBe(4);
    for (const set of voteSets) {
      expect(set.linkedVoteId).toBeDefined();
      expect(set.linkedVoteId?.startsWith("annual-")).toBe(true);
    }
  });

  it("links seasonal-event sets to event registry ids", () => {
    const eventSets = getRecurringSetsByCategory("seasonal-event");
    for (const set of eventSets) {
      expect(set.linkedEventId).toBeDefined();
    }
  });

  it("includes lifecycle note in every generated prompt", () => {
    for (const p of RECURRING_SUIT_ART_PROMPTS) {
      expect(p.prompt).toContain("returns to the chapter");
    }
  });

  it("Iron Lion helm slot projects onto gameplay slot 'head', not base-mask", () => {
    const ironLion = getRecurringSet("iron-clad-lions-ceremonial");
    expect(ironLion?.equipSlotMapping.head).toBe("head");
  });
});

describe("buildRecurringSuitPrompt + recurringAssetId", () => {
  it("produces deterministic output for the same input", () => {
    const set = RECURRING_SUIT_SET_ROSTER[0];
    const a = buildRecurringSuitPrompt(set, "rare", "chest");
    const b = buildRecurringSuitPrompt(set, "rare", "chest");
    expect(a).toBe(b);
  });

  it("asset ids follow the recurring:<setId>:<rarity>:<slot> format", () => {
    expect(recurringAssetId("foo", "rare", "chest")).toBe(
      "recurring:foo:rare:chest",
    );
  });
});
