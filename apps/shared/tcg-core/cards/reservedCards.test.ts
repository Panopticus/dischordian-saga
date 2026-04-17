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
  it("only burnt_card_placeholder is reserved today", () => {
    const reserved = ALL_CARD_DEFINITIONS.filter(isReservedCard).map(
      (d) => String(d.id),
    );
    expect(reserved).toEqual([BURNT_CARD_PLACEHOLDER_ID]);
  });

  it("burnt_card_placeholder is filtered out of the registry pool", () => {
    const pool = filterReservedFromPool(ALL_CARD_DEFINITIONS);
    const poolIds = pool.map((d) => String(d.id));
    expect(poolIds).not.toContain(BURNT_CARD_PLACEHOLDER_ID);
  });

  it("pool size drops by exactly one when reserved is filtered", () => {
    const before = ALL_CARD_DEFINITIONS.length;
    const after = filterReservedFromPool(ALL_CARD_DEFINITIONS).length;
    expect(before - after).toBe(1);
  });
});
