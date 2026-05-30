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
