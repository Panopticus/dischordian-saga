import { describe, it, expect } from "vitest";
import {
  filterReservedFromPool,
  isReservedCard,
} from "./reservedCards";
import { ALL_CARD_DEFINITIONS } from "./index";
import { BURNT_CARD_PLACEHOLDER_ID } from "../types/SeerProphecy";
import type { CardDefinition } from "../types/Card";

describe("reservedCards — isReservedCard", () => {
  it("true when reserved === true", () => {
    expect(isReservedCard({ reserved: true })).toBe(true);
  });

  it("false when reserved is undefined", () => {
    expect(isReservedCard({})).toBe(false);
  });
});

describe("reservedCards — filterReservedFromPool", () => {
  it("removes reserved cards from a mixed pool", () => {
    type P = Pick<CardDefinition, "reserved">;
    const a: P = { reserved: true };
    const b: P = {};
    const c: P = {};
    const pool: P[] = [a, b, c];
    expect(filterReservedFromPool(pool)).toEqual([b, c]);
  });

  it("returns empty when every card is reserved", () => {
    type P = Pick<CardDefinition, "reserved">;
    const pool: P[] = [{ reserved: true }, { reserved: true }];
    expect(filterReservedFromPool(pool)).toEqual([]);
  });

  it("pass-through when no cards are reserved", () => {
    const pool = [{}, {}, {}] as Pick<CardDefinition, "reserved">[];
    expect(filterReservedFromPool(pool).length).toBe(3);
  });

  it("preserves identity on non-reserved entries (no copying)", () => {
    type P = Pick<CardDefinition, "reserved">;
    const survivor: P = {};
    const pool: P[] = [{ reserved: true }, survivor];
    expect(filterReservedFromPool(pool)[0]).toBe(survivor);
  });
});

describe("reservedCards — registry audit", () => {
  // Phase 9 added two House Oath title cards as reserved-pool entries
  // (apps/shared/tcg-core/cards/definitions/neutral/house_oath_titles.ts).
  // Each is a non-playable narrative-only marker delivered as the
  // completionReward for a House Oath multi-stage contract.
  const RESERVED_CARDS = [
    BURNT_CARD_PLACEHOLDER_ID,
    "card_locke_sworn_pen_title",
    "card_thaloria_witness_title",
    // s1 Foucault imprint tiers — non-playable narrative imprint
    // markers, reserved like the other completion-reward cards.
    "s1_imprint_foucault_t1",
    "s1_imprint_foucault_t2",
    "s1_imprint_foucault_t3",
    "s1_imprint_foucault_t4",
    "s1_imprint_foucault_t5",
  ];

  it("the canonical reserved set matches expectation", () => {
    const reserved = ALL_CARD_DEFINITIONS.filter(isReservedCard).map(
      (d) => String(d.id),
    );
    expect(reserved.sort()).toEqual([...RESERVED_CARDS].sort());
  });

  it("burnt_card_placeholder is filtered out of the registry pool", () => {
    const pool = filterReservedFromPool(ALL_CARD_DEFINITIONS);
    const poolIds = pool.map((d) => String(d.id));
    expect(poolIds).not.toContain(BURNT_CARD_PLACEHOLDER_ID);
  });

  it("pool size drops by exactly the reserved-set size when filtered", () => {
    const before = ALL_CARD_DEFINITIONS.length;
    const after = filterReservedFromPool(ALL_CARD_DEFINITIONS).length;
    expect(before - after).toBe(RESERVED_CARDS.length);
  });
});
