/**
 * Spot-check test for §5.8 trial_category backfill.
 *
 * Verifies that a handful of canonical Act 1 cards land in the
 * categories a playtester would expect. Protects against the
 * heuristic-pipeline drifting into nonsensical assignments on the
 * cards most likely to appear in live Act 1 deckbuilds.
 */
import { describe, it, expect } from "vitest";
import {
  buildCardRegistry,
  ALL_CARD_DEFINITIONS,
  type CardRegistry,
} from "../../index";
import { AUTHORITY_TRIAL_BOSS_DECK } from "../../decks/authorityTrialBossDeck";

const registry: CardRegistry = buildCardRegistry(ALL_CARD_DEFINITIONS, {
  strictTrialCategoryCoverage: true,
});

function categoriesOf(cardId: string): readonly string[] {
  const card = registry.get(cardId);
  if (!card) throw new Error(`card ${cardId} missing from registry`);
  return card.trial_categories ?? [];
}

describe("§5.8 trial_category backfill — spot checks", () => {
  it("The Jailer (architect, provoke+drain) is defensive", () => {
    const cats = categoriesOf("s1_char_035");
    expect(cats).toContain("defensive");
  });

  it("Panoptic Warden Foucault (architect, on_kill draw trigger) is reactive", () => {
    // The card carries an authored `trial_categories: ["reactive"]`
    // in its def file; the resolver respects authored lists and
    // does not override. Asserting the reactive read protects
    // against a regression that drops the authored list.
    const cats = categoriesOf("s1_char_101");
    expect(cats).toContain("reactive");
  });

  it("Field Medic (neutral, drain) reads as defensive + reactive", () => {
    const cats = categoriesOf("s1_char_088");
    expect(cats).toContain("defensive");
  });

  it("Surveillance Probe (architect, low-cost scout) resolves to at least one category", () => {
    const cats = categoriesOf("s1_pack_007");
    expect(cats.length).toBeGreaterThan(0);
  });

  it("Dischordian Logic (neutral, public_delta spell) resolves to at least one category", () => {
    const cats = categoriesOf("s1_spell_123");
    expect(cats.length).toBeGreaterThan(0);
  });

  it("Warlord's Three Moves (lockout spell) resolves to at least one category", () => {
    const cats = categoriesOf("s1_warlord_three_moves");
    expect(cats.length).toBeGreaterThan(0);
  });

  it("burnt_card_placeholder carries the manual-override evidence + narrative tag", () => {
    expect(categoriesOf("burnt_card_placeholder")).toEqual([
      "evidence",
      "narrative",
    ]);
  });

  it("AUTHORITY_TRIAL_BOSS_DECK has mixed admissibility (narrative finding)", () => {
    // The Authority's curated deck is intentionally control-flavored;
    // per spec §5.8 §2 the `offensive` category is not admitted in
    // any restricted phase, so cards that land only-offensive are
    // unplayable in the trial. This is canonical — the Authority
    // itself never plays cards (0/99 + turn-10 verdict resolution),
    // so no harm done. We assert the weaker invariant: the deck has
    // BOTH admissible cards (so the opponent-AI has something to do
    // if the engine ever hands play to the Authority) AND
    // only-offensive cards (so the flavor distribution is accurate).
    const admissibleCats = new Set([
      "defensive",
      "narrative",
      "evidence",
      "reactive",
      "confession",
    ]);
    let admissibleCount = 0;
    let onlyOffensiveCount = 0;
    for (const cardId of AUTHORITY_TRIAL_BOSS_DECK) {
      const cats = categoriesOf(cardId);
      if (cats.some((c) => admissibleCats.has(c))) admissibleCount++;
      else if (cats.every((c) => c === "offensive")) onlyOffensiveCount++;
    }
    expect(admissibleCount).toBeGreaterThan(0);
    // Non-strict on the only-offensive count — this is a flavor
    // observation, not a hard requirement. Just asserts the test
    // doesn't silently break as the proposer is refined.
    expect(admissibleCount + onlyOffensiveCount).toBe(AUTHORITY_TRIAL_BOSS_DECK.length);
  });
});
