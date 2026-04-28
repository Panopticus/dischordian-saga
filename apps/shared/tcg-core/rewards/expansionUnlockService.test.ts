import { describe, it, expect } from "vitest";

import type { CardDefinition } from "../types/Card";
import {
  NULL_PLAYER_EXPANSION_STATE,
  evaluateUnlockCondition,
  filterLockedCards,
  filterUnlockedCards,
  isCardUnlocked,
  makePlayerExpansionState,
} from "./expansionUnlockService";
import { ALL_CARD_DEFINITIONS } from "../cards";

const RULES = "1.0.0";

const stub = (
  id: string,
  unlockCondition?: CardDefinition["unlockCondition"],
): CardDefinition => ({
  id: id as CardDefinition["id"],
  name: id,
  faction: "neutral",
  cardType: "unit",
  rarity: "common",
  cost: 1,
  baseStats: { power: 1, health: 1 },
  keywords: [],
  abilities: [],
  art: "x",
  flavorText: "",
  rulesVersion: RULES,
  unlockCondition,
});

describe("expansionUnlockService — evaluateUnlockCondition", () => {
  it("act_completion returns true iff the act is in completedActs", () => {
    const s = makePlayerExpansionState({ completedActs: [1, 2, 3] });
    expect(evaluateUnlockCondition({ kind: "act_completion", act: 2 }, s)).toBe(true);
    expect(evaluateUnlockCondition({ kind: "act_completion", act: 4 }, s)).toBe(false);
  });

  it("secret returns true iff the act is in secretActsRevealed", () => {
    const s = makePlayerExpansionState({ secretActsRevealed: [5, 7] });
    expect(evaluateUnlockCondition({ kind: "secret", act: 5 }, s)).toBe(true);
    expect(evaluateUnlockCondition({ kind: "secret", act: 4 }, s)).toBe(false);
    expect(evaluateUnlockCondition({ kind: "secret", act: 7 }, s)).toBe(true);
  });

  it("battle_pass returns true iff the player has reached the tier", () => {
    const s = makePlayerExpansionState({ battlePassTier: 50 });
    expect(evaluateUnlockCondition({ kind: "battle_pass", tier: 50 }, s)).toBe(true);
    expect(evaluateUnlockCondition({ kind: "battle_pass", tier: 49 }, s)).toBe(true);
    expect(evaluateUnlockCondition({ kind: "battle_pass", tier: 51 }, s)).toBe(false);
  });

  it("founding_author returns true iff the entitlement is held", () => {
    const yes = makePlayerExpansionState({ hasFoundingAuthor: true });
    const no = makePlayerExpansionState({ hasFoundingAuthor: false });
    expect(evaluateUnlockCondition({ kind: "founding_author" }, yes)).toBe(true);
    expect(evaluateUnlockCondition({ kind: "founding_author" }, no)).toBe(false);
  });

  it("authors_edition s2 returns true iff the s2 entitlement is held", () => {
    const yes = makePlayerExpansionState({ hasAuthorsEditionS2: true });
    const no = makePlayerExpansionState({ hasAuthorsEditionS2: false });
    expect(evaluateUnlockCondition({ kind: "authors_edition", season: "s2" }, yes)).toBe(true);
    expect(evaluateUnlockCondition({ kind: "authors_edition", season: "s2" }, no)).toBe(false);
  });
});

describe("expansionUnlockService — isCardUnlocked", () => {
  it("a card without unlockCondition is always unlocked", () => {
    const card = stub("test_no_gate");
    expect(isCardUnlocked(card, NULL_PLAYER_EXPANSION_STATE)).toBe(true);
  });

  it("an act-gated card is locked until the act is completed", () => {
    const card = stub("test_act3", { kind: "act_completion", act: 3 });
    expect(isCardUnlocked(card, NULL_PLAYER_EXPANSION_STATE)).toBe(false);
    const post = makePlayerExpansionState({ completedActs: [1, 2, 3] });
    expect(isCardUnlocked(card, post)).toBe(true);
  });

  it("a secret-gated card is locked until the act's secret is revealed", () => {
    const card = stub("test_secret_act5", { kind: "secret", act: 5 });
    expect(isCardUnlocked(card, NULL_PLAYER_EXPANSION_STATE)).toBe(false);
    const reveal = makePlayerExpansionState({ secretActsRevealed: [5] });
    expect(isCardUnlocked(card, reveal)).toBe(true);
  });
});

describe("expansionUnlockService — filterUnlockedCards / filterLockedCards", () => {
  const cards = [
    stub("free"),
    stub("act1_gated", { kind: "act_completion", act: 1 }),
    stub("act5_gated", { kind: "act_completion", act: 5 }),
    stub("bp50_gated", { kind: "battle_pass", tier: 50 }),
  ];
  const state = makePlayerExpansionState({ completedActs: [1, 2, 3], battlePassTier: 25 });

  it("filterUnlockedCards keeps the cards whose gate is satisfied", () => {
    const out = filterUnlockedCards(cards, state).map((c) => c.id);
    expect(out).toEqual(["free", "act1_gated"]);
  });

  it("filterLockedCards keeps the cards whose gate is not satisfied", () => {
    const out = filterLockedCards(cards, state).map((c) => c.id);
    expect(out).toEqual(["act5_gated", "bp50_gated"]);
  });
});

describe("expansionUnlockService — registry integration (S2 Hierarchy of the Damned)", () => {
  it("28 act-exclusive cards are gated by act_completion (one per act × 4)", () => {
    const acted = ALL_CARD_DEFINITIONS.filter(
      (c) => c.unlockCondition?.kind === "act_completion",
    );
    expect(acted.length).toBe(28);
    const byAct: Record<number, number> = {};
    for (const c of acted) {
      const act = (c.unlockCondition as { kind: "act_completion"; act: number }).act;
      byAct[act] = (byAct[act] ?? 0) + 1;
    }
    expect(byAct).toEqual({ 1: 4, 2: 4, 3: 4, 4: 4, 5: 4, 6: 4, 7: 4 });
  });

  it("7 secret cards are gated one-per-act", () => {
    const secrets = ALL_CARD_DEFINITIONS.filter(
      (c) => c.unlockCondition?.kind === "secret",
    );
    expect(secrets.length).toBe(7);
    const acts = secrets.map(
      (c) => (c.unlockCondition as { kind: "secret"; act: number }).act,
    );
    expect(new Set(acts)).toEqual(new Set([1, 2, 3, 4, 5, 6, 7]));
  });

  it("3 author-prestige specials carry the right unlock kinds", () => {
    const ids = new Set(
      ALL_CARD_DEFINITIONS.filter(
        (c) => c.unlockCondition && c.unlockCondition.kind !== "act_completion" && c.unlockCondition.kind !== "secret",
      ).map((c) => `${c.id}::${c.unlockCondition!.kind}`),
    );
    expect(ids).toEqual(
      new Set([
        "special_authors_edition_s2::authors_edition",
        "special_founding_author::founding_author",
        "special_the_author_bp50::battle_pass",
      ]),
    );
  });

  it("act-1-only completers see exactly the 4 act1 + 0 act2-7 hierarchy specials", () => {
    const state = makePlayerExpansionState({ completedActs: [1] });
    const unlocked = ALL_CARD_DEFINITIONS.filter(
      (c) => c.unlockCondition?.kind === "act_completion" && isCardUnlocked(c, state),
    );
    expect(unlocked.length).toBe(4);
  });
});
