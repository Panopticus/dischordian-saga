/**
 * Golden tests for s1_song_061 — The Enigma's Lament.
 *
 * Structural phase: validates the schema and checks that the spell grants
 * a shield (forcefield_charges counter) to a chosen friendly target.
 */
import { describe, it, expect } from "vitest";
import { cardDefinitionSchema } from "../../../index";
import { cardDef } from "../../../cards/definitions/neutral/s1_song_061_the_enigmas_lament";

describe("s1_song_061 — The Enigma's Lament", () => {
  it("passes the card schema", () => {
    expect(() => cardDefinitionSchema.parse(cardDef)).not.toThrow();
  });

  it("has the canonical identity fields", () => {
    expect(cardDef.id).toBe("s1_song_061");
    expect(cardDef.name).toBe("The Enigma's Lament");
    expect(cardDef.cardType).toBe("spell");
    expect(cardDef.rarity).toBe("common");
    expect(cardDef.cost).toBe(1);
    expect(cardDef.faction).toBe("neutral");
  });

  it("does not declare baseStats (spells never do)", () => {
    expect(cardDef.baseStats).toBeUndefined();
  });

  it("has exactly one ability triggered on_cast", () => {
    expect(cardDef.abilities.length).toBe(1);
    const ab = cardDef.abilities[0];
    expect(ab.trigger).toEqual({ kind: "on_cast" });
  });

  it("uses with_target to prompt the player for a friendly unit", () => {
    const ab = cardDef.abilities[0];
    const effect = ab.effect as {
      op: string;
      selector: {
        kind: string;
        filter: { controller: string };
        chooser: string;
      };
      do: unknown;
    };
    expect(effect.op).toBe("with_target");
    expect(effect.selector.kind).toBe("single");
    expect(effect.selector.filter.controller).toBe("self");
    expect(effect.selector.chooser).toBe("player");
  });

  it("adds 2 forcefield_charges counters to the chosen target", () => {
    const ab = cardDef.abilities[0];
    const effect = ab.effect as {
      do: {
        op: string;
        kind: string;
        amount: number;
        to: { kind: string };
      };
    };
    const inner = effect.do;
    expect(inner.op).toBe("add_counter");
    expect(inner.kind).toBe("forcefield_charges");
    expect(inner.amount).toBe(2);
    expect(inner.to).toEqual({ kind: "it" });
  });
});
