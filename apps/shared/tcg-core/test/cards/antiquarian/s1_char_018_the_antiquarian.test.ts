/**
 * Golden tests for s1_char_018 — The Antiquarian.
 *
 * Structural phase: validates the authored card passes the Zod schema and
 * has the expected ability shape (forcefield counters on deploy, kill
 * counter tick, and evolve-at-4 gate). Behavioral golden scenarios land
 * once the effect interpreter does, and they'll assert actual state
 * deltas on simulated match turns.
 */
import { describe, it, expect } from "vitest";
import { cardDefinitionSchema } from "../../../index";
import { cardDef } from "../../../cards/definitions/antiquarian/s1_char_018_the_antiquarian";

describe("s1_char_018 — The Antiquarian", () => {
  it("passes the card schema", () => {
    expect(() => cardDefinitionSchema.parse(cardDef)).not.toThrow();
  });

  it("has the canonical identity fields", () => {
    expect(cardDef.id).toBe("s1_char_018");
    expect(cardDef.name).toBe("The Antiquarian");
    expect(cardDef.faction).toBe("antiquarian");
    expect(cardDef.cardType).toBe("unit");
    expect(cardDef.rarity).toBe("legendary");
    expect(cardDef.cost).toBe(5);
    expect(cardDef.baseStats).toEqual({ power: 5, health: 6 });
  });

  it("has three abilities in the right order", () => {
    expect(cardDef.abilities.length).toBe(3);
    expect(cardDef.abilities[0].id).toBe("ant_forcefield_4");
    expect(cardDef.abilities[1].id).toBe("ant_tick_kill_counter");
    expect(cardDef.abilities[2].id).toBe("ant_evolve_at_4");
  });

  it("seeds 4 forcefield_charges on deploy", () => {
    const deploy = cardDef.abilities[0];
    expect(deploy.trigger).toEqual({ kind: "on_deploy" });
    expect(deploy.effect).toEqual({
      op: "add_counter",
      kind: "forcefield_charges",
      amount: 4,
      to: { kind: "self" },
    });
  });

  it("ticks antiquarian_kills on any kill", () => {
    const tick = cardDef.abilities[1];
    expect(tick.trigger).toEqual({ kind: "on_kill", of: "any" });
    expect(tick.effect).toEqual({
      op: "add_counter",
      kind: "antiquarian_kills",
      amount: 1,
      to: { kind: "self" },
    });
  });

  it("evolves only when antiquarian_kills >= 4", () => {
    const evolve = cardDef.abilities[2];
    expect(evolve.trigger).toEqual({ kind: "on_kill", of: "any" });
    expect(evolve.condition).toEqual({
      kind: "counter_gte",
      counter: "antiquarian_kills",
      value: 4,
    });
  });

  it("evolve effect is a sequence of buff + keyword + reset", () => {
    const evolve = cardDef.abilities[2];
    expect(evolve.effect).toBeDefined();
    const effect = evolve.effect as { op: string; steps: unknown[] };
    expect(effect.op).toBe("sequence");
    expect(Array.isArray(effect.steps)).toBe(true);
    expect(effect.steps.length).toBe(3);
    const [buff, grant, reset] = effect.steps as Array<{ op: string }>;
    expect(buff.op).toBe("buff");
    expect(grant.op).toBe("grant_keyword");
    expect(reset.op).toBe("add_counter");
  });

  it("declares forcefield as an intrinsic keyword", () => {
    expect(cardDef.keywords).toContain("forcefield");
  });

  it("targets RULES_VERSION 1.1.0", () => {
    expect(cardDef.rulesVersion).toBe("1.1.0");
  });
});
