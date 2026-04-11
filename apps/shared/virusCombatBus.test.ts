import { describe, it, expect, beforeEach } from "vitest";
import {
  castThoughtVirus,
  beginVirusTurn,
  clearVirusStatus,
  isInfected,
  peekStatus,
  clearEncounter,
  infectedUnitCount,
  resetVirusBus,
} from "./virusCombatBus";
import { BASE_VIRUS_STATUS } from "./thoughtVirus";

describe("virusCombatBus", () => {
  beforeEach(() => {
    resetVirusBus();
  });

  it("registers a unit on cast", () => {
    const status = castThoughtVirus("unit-1");
    expect(status.stacks).toBe(1);
    expect(isInfected("unit-1")).toBe(true);
    expect(infectedUnitCount()).toBe(1);
  });

  it("stacks status on repeated casts", () => {
    castThoughtVirus("unit-1");
    const status = castThoughtVirus("unit-1");
    expect(status.stacks).toBe(2);
    expect(status.friendlyFireChance).toBeCloseTo(
      BASE_VIRUS_STATUS.friendlyFireChance + 0.15,
    );
  });

  it("beginVirusTurn returns targetAlly=true when rng rolls under chance", () => {
    castThoughtVirus("unit-1");
    const result = beginVirusTurn("unit-1", () => 0.1);
    expect(result.targetAlly).toBe(true);
    expect(result.status).not.toBeNull();
  });

  it("beginVirusTurn decrements duration each call", () => {
    castThoughtVirus("unit-1");
    beginVirusTurn("unit-1", () => 0.99);
    const after = peekStatus("unit-1");
    expect(after?.turnsRemaining).toBe(BASE_VIRUS_STATUS.turnsRemaining - 1);
  });

  it("removes the unit from the bus when its status expires", () => {
    castThoughtVirus("unit-1"); // 3 turns remaining
    beginVirusTurn("unit-1", () => 0.99);
    beginVirusTurn("unit-1", () => 0.99);
    beginVirusTurn("unit-1", () => 0.99); // expires here
    expect(isInfected("unit-1")).toBe(false);
    expect(infectedUnitCount()).toBe(0);
  });

  it("clearVirusStatus removes a specific unit", () => {
    castThoughtVirus("unit-1");
    castThoughtVirus("unit-2");
    clearVirusStatus("unit-1");
    expect(isInfected("unit-1")).toBe(false);
    expect(isInfected("unit-2")).toBe(true);
  });

  it("clearEncounter drops everything under a common prefix", () => {
    castThoughtVirus("fight-42-a");
    castThoughtVirus("fight-42-b");
    castThoughtVirus("fight-43-a");
    clearEncounter("fight-42-");
    expect(isInfected("fight-42-a")).toBe(false);
    expect(isInfected("fight-42-b")).toBe(false);
    expect(isInfected("fight-43-a")).toBe(true);
  });

  it("beginVirusTurn on an unregistered unit is a safe no-op", () => {
    const result = beginVirusTurn("unknown-unit", () => 0.1);
    expect(result.targetAlly).toBe(false);
    expect(result.status).toBeNull();
  });

  it("simulates the full Locks dark-variant cast → tick → expire cycle", () => {
    const caster = "player";
    const target = "enemy-champion";

    // Turn 1: cast
    castThoughtVirus(target);
    expect(isInfected(target)).toBe(true);

    // Turns 2-4: target's turns resolve
    const rolls = [0.5, 0.1, 0.9]; // friendly fire on turn 3 only
    const outcomes: boolean[] = [];
    for (let i = 0; i < 3; i++) {
      const roll = rolls[i];
      const result = beginVirusTurn(target, () => roll);
      outcomes.push(result.targetAlly);
    }
    expect(outcomes).toEqual([false, true, false]);

    // Turn 4: should be expired now
    expect(isInfected(target)).toBe(false);
    void caster;
  });
});
