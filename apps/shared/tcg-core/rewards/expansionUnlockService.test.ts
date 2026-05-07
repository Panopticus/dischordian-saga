import { describe, it, expect } from "vitest";

import type { CardDefinition } from "../types/Card";
import {
  NULL_PLAYER_EXPANSION_STATE,
  derivePlayerExpansionStateFromFlags,
  evaluateUnlockCondition,
  filterLockedCards,
  filterUnlockedCards,
  isCardUnlocked,
  makePlayerExpansionState,
} from "./expansionUnlockService";
import { ALL_CARD_DEFINITIONS } from "../cards";

const RULES = "1.1.0";

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

  it("dlc_chapter_completion returns true iff the chapter id is in completedDlcChapters", () => {
    const s = makePlayerExpansionState({
      completedDlcChapters: ["dlc_advocate_01_sacrum_echo"],
    });
    expect(
      evaluateUnlockCondition(
        {
          kind: "dlc_chapter_completion",
          chapterId: "dlc_advocate_01_sacrum_echo",
        },
        s,
      ),
    ).toBe(true);
    expect(
      evaluateUnlockCondition(
        {
          kind: "dlc_chapter_completion",
          chapterId: "dlc_does_not_exist",
        },
        s,
      ),
    ).toBe(false);
    expect(
      evaluateUnlockCondition(
        {
          kind: "dlc_chapter_completion",
          chapterId: "anything",
        },
        NULL_PLAYER_EXPANSION_STATE,
      ),
    ).toBe(false);
  });
});

describe("expansionUnlockService — derivePlayerExpansionStateFromFlags (DLC chapter completion)", () => {
  it("scrapes dlc_chapter_<id>_complete flags into completedDlcChapters", () => {
    const state = derivePlayerExpansionStateFromFlags({
      dlc_chapter_dlc_advocate_01_sacrum_echo_complete: true,
      dlc_chapter_dlc_hierarchy_03_xeth_audit_complete: true,
      dlc_chapter_dlc_advocate_02_blood_weave_complete: false, // falsy -> ignored
      unrelated_flag: true,
    });
    expect(state.completedDlcChapters).toEqual(
      new Set([
        "dlc_advocate_01_sacrum_echo",
        "dlc_hierarchy_03_xeth_audit",
      ]),
    );
  });

  it("returns an empty set when no DLC flags are set", () => {
    const state = derivePlayerExpansionStateFromFlags({
      act_3_complete: true,
    });
    expect(state.completedDlcChapters.size).toBe(0);
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

  // Act 1 + Act 2 secret cards previously had no reveal path (no
  // conspiracy boards for those acts). Boards "first_memory" and
  // "inheritance_ledger" now flip these flags; this test pins the
  // unlock chain so the cards aren't silently re-orphaned.
  it("act 1 secret card unlocks once secret_act_1_revealed flips", () => {
    const card = stub("test_secret_act1", { kind: "secret", act: 1 });
    expect(isCardUnlocked(card, NULL_PLAYER_EXPANSION_STATE)).toBe(false);
    const reveal = makePlayerExpansionState({ secretActsRevealed: [1] });
    expect(isCardUnlocked(card, reveal)).toBe(true);
  });

  it("act 2 secret card unlocks once secret_act_2_revealed flips", () => {
    const card = stub("test_secret_act2", { kind: "secret", act: 2 });
    expect(isCardUnlocked(card, NULL_PLAYER_EXPANSION_STATE)).toBe(false);
    const reveal = makePlayerExpansionState({ secretActsRevealed: [2] });
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

describe("expansionUnlockService — derivePlayerExpansionStateFromFlags", () => {
  it("an empty flag bag → no completions, no secrets, default entitlements", () => {
    const state = derivePlayerExpansionStateFromFlags({});
    expect(state.completedActs.size).toBe(0);
    expect(state.secretActsRevealed.size).toBe(0);
    expect(state.battlePassTier).toBe(0);
    expect(state.hasFoundingAuthor).toBe(false);
    expect(state.hasAuthorsEditionS2).toBe(false);
  });

  it("act_N_complete flags map 1:1 to completedActs", () => {
    const state = derivePlayerExpansionStateFromFlags({
      act_1_complete: true,
      act_2_complete: true,
      act_3_complete: true,
      act_5_complete: true,
    });
    expect([...state.completedActs].sort()).toEqual([1, 2, 3, 5]);
  });

  it("falsy values for act_N_complete don't add the act", () => {
    const state = derivePlayerExpansionStateFromFlags({
      act_1_complete: true,
      act_2_complete: false,
      act_3_complete: 0,
      act_4_complete: null,
      act_5_complete: undefined,
    });
    expect([...state.completedActs]).toEqual([1]);
  });

  it("secret_act_N_revealed flags map 1:1 to secretActsRevealed", () => {
    const state = derivePlayerExpansionStateFromFlags({
      secret_act_1_revealed: true,
      secret_act_4_revealed: true,
      secret_act_7_revealed: true,
    });
    expect([...state.secretActsRevealed].sort()).toEqual([1, 4, 7]);
  });

  it("ignores unrelated flags (no false positives on act_2_started, etc.)", () => {
    const state = derivePlayerExpansionStateFromFlags({
      act_2_started: true, // started, not complete — must be ignored
      act_3_starting: true,
      crafting_mastered: true,
    });
    expect(state.completedActs.size).toBe(0);
  });

  it("entitlements pass through verbatim with sensible defaults", () => {
    const state = derivePlayerExpansionStateFromFlags(
      { act_1_complete: true },
      { battlePassTier: 50, hasFoundingAuthor: true, hasAuthorsEditionS2: true },
    );
    expect(state.battlePassTier).toBe(50);
    expect(state.hasFoundingAuthor).toBe(true);
    expect(state.hasAuthorsEditionS2).toBe(true);
    expect([...state.completedActs]).toEqual([1]);
  });
});
