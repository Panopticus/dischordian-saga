/**
 * Golden tests for s1_char_002 — Agent Zero.
 *
 * Structural phase: validates schema and ability shape. Behavioral tests
 * (stealth reveal on attack, pierce ignoring 3 armor) land with the
 * effect interpreter.
 */
import { describe, it, expect } from "vitest";
import { cardDefinitionSchema } from "../../../index";
import { cardDef } from "../../../cards/definitions/insurgency/s1_char_002_agent_zero";

describe("s1_char_002 — Agent Zero", () => {
  it("passes the card schema", () => {
    expect(() => cardDefinitionSchema.parse(cardDef)).not.toThrow();
  });

  it("has the canonical identity fields", () => {
    expect(cardDef.id).toBe("s1_char_002");
    expect(cardDef.name).toBe("Agent Zero");
    expect(cardDef.faction).toBe("insurgency");
    expect(cardDef.cardType).toBe("unit");
    expect(cardDef.rarity).toBe("epic");
    expect(cardDef.cost).toBe(5);
    expect(cardDef.baseStats).toEqual({ power: 7, health: 8 });
  });

  it("grants untargetable for 3 turns on deploy", () => {
    const deploy = cardDef.abilities[0];
    expect(deploy.trigger).toEqual({ kind: "on_deploy" });
    const effect = deploy.effect as { op: string; steps: unknown[] };
    expect(effect.op).toBe("sequence");
    const [grant, counter] = effect.steps as Array<{
      op: string;
      keyword?: string;
      duration?: { kind: string; n?: number };
      kind?: string;
      amount?: number;
    }>;
    expect(grant.op).toBe("grant_keyword");
    expect(grant.keyword).toBe("untargetable");
    expect(grant.duration).toEqual({ kind: "n_turns", n: 3 });
    expect(counter.op).toBe("add_counter");
    expect(counter.kind).toBe("stealth_turns");
    expect(counter.amount).toBe(3);
  });

  it("removes untargetable when damage is dealt by self", () => {
    const reveal = cardDef.abilities.find((a) => a.id === "az_reveal_on_attack");
    expect(reveal).toBeDefined();
    expect(reveal!.trigger).toEqual({ kind: "on_damage_dealt", by: "self" });
    expect(reveal!.effect).toEqual({
      op: "remove_keyword",
      keyword: "untargetable",
      to: { kind: "self" },
    });
  });

  it("grants ignore_armor_3 as a permanent passive aura on self", () => {
    const pierce = cardDef.abilities.find((a) => a.id === "az_pierce_passive");
    expect(pierce).toBeDefined();
    expect(pierce!.trigger).toEqual({
      kind: "passive_aura",
      range: { kind: "self" },
    });
    expect(pierce!.effect).toEqual({
      op: "grant_keyword",
      keyword: "ignore_armor_3",
      duration: { kind: "permanent" },
      to: { kind: "self" },
    });
  });

  it("has no intrinsic keywords (all granted via abilities)", () => {
    expect(cardDef.keywords).toEqual([]);
  });
});
