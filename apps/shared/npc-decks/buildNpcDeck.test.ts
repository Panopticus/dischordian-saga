// apps/shared/npc-decks/buildNpcDeck.test.ts
//
// Unit tests for the deck composition resolver, the reward-tier
// projection, and the registry legality assertion.

import { describe, it, expect } from "vitest";
import {
  assertNpcDeckIsLegal,
  buildNpcDeck,
  countLearnedAspectsForNpc,
  npcDuelRewardTier,
} from "./buildNpcDeck";
import { THE_DEGEN_DECK } from "./the_degen";
import type { NpcDeck } from "./_template";

describe("buildNpcDeck", () => {
  it("the_degen deck is legal at module load", () => {
    expect(() => assertNpcDeckIsLegal(THE_DEGEN_DECK)).not.toThrow();
  });

  it("composes a 39-card deck with no aspects learned", () => {
    const result = buildNpcDeck(THE_DEGEN_DECK, new Set());
    expect(result.deck.length).toBe(39);
    expect(result.general).toBe("gen_dreamer");
    expect(result.appliedAspects).toEqual([]);
  });

  it("composes a 39-card deck with all aspects learned", () => {
    const allAspects = new Set(
      THE_DEGEN_DECK.perspectiveAspects.map((a) => a.id),
    );
    const result = buildNpcDeck(THE_DEGEN_DECK, allAspects);
    expect(result.deck.length).toBe(39);
    expect(result.appliedAspects.length).toBe(
      THE_DEGEN_DECK.advantageCards.length,
    );
  });

  it("swaps in replacement cards when aspects are learned", () => {
    const oneAspect = new Set([
      THE_DEGEN_DECK.perspectiveAspects[0].id,
    ]);
    const result = buildNpcDeck(THE_DEGEN_DECK, oneAspect);
    const swap = THE_DEGEN_DECK.advantageCards.find(
      (s) => s.gatedByAspect === THE_DEGEN_DECK.perspectiveAspects[0].id,
    );
    expect(swap).toBeDefined();
    expect(result.deck).toContain(swap!.replacement);
    expect(result.deck).not.toContain(swap!.cardDefId);
  });

  it("includes secret-weapon cards when aspects are NOT learned", () => {
    const result = buildNpcDeck(THE_DEGEN_DECK, new Set());
    for (const swap of THE_DEGEN_DECK.advantageCards) {
      expect(result.deck).toContain(swap.cardDefId);
    }
  });

  it("deck composition is deterministic", () => {
    const aspects = new Set([THE_DEGEN_DECK.perspectiveAspects[1].id]);
    const a = buildNpcDeck(THE_DEGEN_DECK, aspects);
    const b = buildNpcDeck(THE_DEGEN_DECK, aspects);
    expect(a.deck).toEqual(b.deck);
    expect(a.appliedAspects).toEqual(b.appliedAspects);
  });

  it("returns empty appliedCrossMemoryUpgrades when ctx is omitted", () => {
    const r = buildNpcDeck(THE_DEGEN_DECK, new Set());
    expect(r.appliedCrossMemoryUpgrades).toEqual([]);
  });

  it("returns empty appliedCrossMemoryUpgrades when crossMemoryCount is 0", () => {
    const r = buildNpcDeck(THE_DEGEN_DECK, new Set(), { crossMemoryCount: 0 });
    expect(r.appliedCrossMemoryUpgrades).toEqual([]);
  });

  it("the_degen has no crossMemoryUpgrades — high crossMemoryCount is a no-op", () => {
    const r = buildNpcDeck(THE_DEGEN_DECK, new Set(), { crossMemoryCount: 99 });
    expect(r.appliedCrossMemoryUpgrades).toEqual([]);
    expect(r.deck.length).toBe(39);
  });
});

describe("buildNpcDeck — crossMemoryUpgrades", () => {
  // Synthetic deck with controllable upgrades — lets us assert the
  // mechanic without relying on a specific authored NPC's
  // declarations.
  const baseDeck = {
    npcKey: "the_degen" as const,
    general: "gen_dreamer",
    coreMemories: Array.from({ length: 33 }, (_, i) =>
      i < 3 ? "weak_a" : i < 6 ? "weak_b" : "filler",
    ),
    inheritedFragments: [
      { fromNpcId: "potential" as const, cardDefId: "frag_a" },
      { fromNpcId: "potential" as const, cardDefId: "frag_b" },
      { fromNpcId: "potential" as const, cardDefId: "frag_c" },
    ],
    advantageCards: [
      { cardDefId: "adv_a", gatedByAspect: "test:x", replacement: "rep_a" },
      { cardDefId: "adv_b", gatedByAspect: "test:y", replacement: "rep_b" },
      { cardDefId: "adv_c", gatedByAspect: "test:z", replacement: "rep_c" },
    ],
    challengeMotive: ["motive_a"],
    perspectiveAspects: [
      { id: "test:x", label: "x" },
      { id: "test:y", label: "y" },
      { id: "test:z", label: "z" },
    ],
    crossMemoryUpgrades: [
      { weakerCardDefId: "weak_a", strongerCardDefId: "strong_a", threshold: 1 },
      { weakerCardDefId: "weak_a", strongerCardDefId: "strong_a2", threshold: 2 },
      { weakerCardDefId: "weak_b", strongerCardDefId: "strong_b", threshold: 3 },
    ],
  };

  it("applies no upgrades below threshold:1", () => {
    const r = buildNpcDeck(baseDeck, new Set(), { crossMemoryCount: 0 });
    expect(r.appliedCrossMemoryUpgrades).toEqual([]);
    expect(r.deck).not.toContain("strong_a");
  });

  it("applies the first upgrade at threshold:1", () => {
    const r = buildNpcDeck(baseDeck, new Set(), { crossMemoryCount: 1 });
    expect(r.appliedCrossMemoryUpgrades).toHaveLength(1);
    expect(r.deck).toContain("strong_a");
  });

  it("applies multiple upgrades targeting the same weakerCardDefId one at a time", () => {
    const r = buildNpcDeck(baseDeck, new Set(), { crossMemoryCount: 2 });
    expect(r.appliedCrossMemoryUpgrades).toHaveLength(2);
    // Both strong_a and strong_a2 should appear — separate occurrences
    // of weak_a got swapped.
    expect(r.deck).toContain("strong_a");
    expect(r.deck).toContain("strong_a2");
  });

  it("applies all upgrades at or above the highest threshold", () => {
    const r = buildNpcDeck(baseDeck, new Set(), { crossMemoryCount: 5 });
    expect(r.appliedCrossMemoryUpgrades).toHaveLength(3);
    expect(r.deck).toContain("strong_b");
  });

  it("preserves deck size invariant (always 39)", () => {
    for (const n of [0, 1, 2, 3, 5, 10, 99]) {
      const r = buildNpcDeck(baseDeck, new Set(), { crossMemoryCount: n });
      expect(r.deck.length, `crossMemoryCount=${n}`).toBe(39);
    }
  });
});

describe("countLearnedAspectsForNpc", () => {
  it("returns 0 when no aspects are learned", () => {
    expect(
      countLearnedAspectsForNpc(THE_DEGEN_DECK, new Set()),
    ).toBe(0);
  });

  it("counts only aspects that belong to the NPC", () => {
    const mixed = new Set([
      THE_DEGEN_DECK.perspectiveAspects[0].id,
      "vex_solene:bone_lattice", // belongs to a different NPC
    ]);
    expect(countLearnedAspectsForNpc(THE_DEGEN_DECK, mixed)).toBe(1);
  });

  it("returns the declared aspect count when all are learned", () => {
    const all = new Set(
      THE_DEGEN_DECK.perspectiveAspects.map((a) => a.id),
    );
    expect(countLearnedAspectsForNpc(THE_DEGEN_DECK, all)).toBe(
      THE_DEGEN_DECK.perspectiveAspects.length,
    );
  });
});

describe("npcDuelRewardTier", () => {
  it("returns 0 when nothing learned", () => {
    expect(npcDuelRewardTier(0, 3)).toBe(0);
  });

  it("returns 3 when all aspects learned", () => {
    expect(npcDuelRewardTier(3, 3)).toBe(3);
  });

  it("clamps to 3 when learned count exceeds total", () => {
    expect(npcDuelRewardTier(5, 3)).toBe(3);
  });

  it("returns 1 for partial below-half learning", () => {
    expect(npcDuelRewardTier(1, 4)).toBe(1);
  });

  it("returns 2 for partial at-or-above-half learning", () => {
    expect(npcDuelRewardTier(2, 4)).toBe(2);
  });

  it("returns 0 when total is 0 (defensive)", () => {
    expect(npcDuelRewardTier(0, 0)).toBe(0);
  });
});

describe("assertNpcDeckIsLegal — failure modes", () => {
  it("throws when an advantage card references an unknown aspect", () => {
    const bad: NpcDeck = {
      ...THE_DEGEN_DECK,
      advantageCards: [
        {
          cardDefId: "s1_char_005",
          gatedByAspect: "the_degen:does_not_exist",
          replacement: "s1_char_005",
        },
      ],
      perspectiveAspects: [
        { id: "the_degen:foo", label: "foo" },
      ],
    };
    expect(() => assertNpcDeckIsLegal(bad)).toThrow(/unknown aspect/);
  });

  it("throws when an aspect is gated by more than one swap", () => {
    const bad: NpcDeck = {
      ...THE_DEGEN_DECK,
      coreMemories: THE_DEGEN_DECK.coreMemories.slice(0, 35),
      advantageCards: [
        {
          cardDefId: "s1_char_005",
          gatedByAspect: "the_degen:risk_addiction",
          replacement: "s1_char_005",
        },
        {
          cardDefId: "s1_char_014",
          gatedByAspect: "the_degen:risk_addiction",
          replacement: "s1_char_014",
        },
      ],
      perspectiveAspects: [
        { id: "the_degen:risk_addiction", label: "x" },
      ],
    };
    expect(() => assertNpcDeckIsLegal(bad)).toThrow(/more than one advantage card/);
  });

  it("throws when an aspect is declared but not gated by any swap", () => {
    const bad: NpcDeck = {
      ...THE_DEGEN_DECK,
      advantageCards: [],
      perspectiveAspects: [
        { id: "the_degen:orphan", label: "orphan" },
      ],
    };
    expect(() => assertNpcDeckIsLegal(bad)).toThrow(/not gated by any advantage card/);
  });

  it("throws when composed deck size is not 39", () => {
    const bad: NpcDeck = {
      ...THE_DEGEN_DECK,
      coreMemories: THE_DEGEN_DECK.coreMemories.slice(0, 10),
    };
    expect(() => assertNpcDeckIsLegal(bad)).toThrow(/expected 39/);
  });
});
