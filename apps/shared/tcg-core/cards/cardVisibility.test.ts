import { describe, it, expect } from "vitest";

import type { CardDefinition } from "../types/Card";
import {
  filterPlayerVisibleCards,
  isVisibleToPlayer,
} from "./cardVisibility";
import {
  NULL_PLAYER_EXPANSION_STATE,
  makePlayerExpansionState,
} from "../rewards/expansionUnlockService";

const RULES = "1.1.0";

const stub = (
  id: string,
  opts: Partial<Pick<CardDefinition, "reserved" | "unlockCondition">> = {},
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
  ...opts,
});

describe("cardVisibility — isVisibleToPlayer", () => {
  it("a card with no reserved flag and no unlockCondition is visible", () => {
    expect(isVisibleToPlayer(stub("plain"))).toBe(true);
  });

  it("a reserved card is never visible — even when no unlockCondition gates it", () => {
    expect(isVisibleToPlayer(stub("res", { reserved: true }))).toBe(false);
  });

  it("a card with an unmet unlockCondition is not visible", () => {
    const card = stub("act3", { unlockCondition: { kind: "act_completion", act: 3 } });
    expect(isVisibleToPlayer(card)).toBe(false);
  });

  it("a card with a met unlockCondition is visible", () => {
    const card = stub("act3", { unlockCondition: { kind: "act_completion", act: 3 } });
    const state = makePlayerExpansionState({ completedActs: [3] });
    expect(isVisibleToPlayer(card, state)).toBe(true);
  });

  it("reserved + met unlockCondition still hides the card (reserved is the stronger gate)", () => {
    const card = stub("res-and-unlocked", {
      reserved: true,
      unlockCondition: { kind: "act_completion", act: 1 },
    });
    const state = makePlayerExpansionState({ completedActs: [1] });
    expect(isVisibleToPlayer(card, state)).toBe(false);
  });
});

describe("cardVisibility — filterPlayerVisibleCards", () => {
  const pool: CardDefinition[] = [
    stub("plain"),
    stub("res", { reserved: true }),
    stub("act3", { unlockCondition: { kind: "act_completion", act: 3 } }),
    stub("act5", { unlockCondition: { kind: "act_completion", act: 5 } }),
    stub("bp50", { unlockCondition: { kind: "battle_pass", tier: 50 } }),
  ];

  it("keeps identity of un-filtered entries (no copies)", () => {
    const out = filterPlayerVisibleCards(pool, NULL_PLAYER_EXPANSION_STATE);
    expect(out).toContain(pool[0]);
    expect(out[0]).toBe(pool[0]);
  });

  it("at NULL state, only the plain card is visible", () => {
    const out = filterPlayerVisibleCards(pool, NULL_PLAYER_EXPANSION_STATE).map(
      (c) => c.id,
    );
    expect(out).toEqual(["plain"]);
  });

  it("at a partial state, surfaces the un-gated + the matching unlocked cards (still hides reserved)", () => {
    const state = makePlayerExpansionState({
      completedActs: [1, 2, 3],
      battlePassTier: 25,
    });
    const out = filterPlayerVisibleCards(pool, state).map((c) => c.id);
    expect(out).toEqual(["plain", "act3"]);
  });

  it("at a fully-unlocked state, every gated card surfaces — reserved still hidden", () => {
    const state = makePlayerExpansionState({
      completedActs: [1, 2, 3, 4, 5, 6, 7],
      battlePassTier: 100,
      hasFoundingAuthor: true,
      hasAuthorsEditionS2: true,
    });
    const out = filterPlayerVisibleCards(pool, state).map((c) => c.id);
    expect(out).toEqual(["plain", "act3", "act5", "bp50"]);
  });
});
