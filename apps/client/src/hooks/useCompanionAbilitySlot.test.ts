import { describe, it, expect } from "vitest";
import {
  clearCooldown,
  isAbilityReady,
  remainingCooldownMs,
  startCooldown,
  type CooldownMap,
} from "./useCompanionAbilitySlot";
import type { CompanionAbility } from "@shared/companionAbilities";

const ability: CompanionAbility = {
  id: "test_ability",
  companionId: "elara",
  minBondLevel: 20,
  name: "Test",
  description: "Test description.",
  cooldownMs: 30_000,
  effectKind: "draw_card",
};

describe("isAbilityReady", () => {
  it("ready when no cooldown set", () => {
    expect(isAbilityReady("test_ability", {})).toBe(true);
  });

  it("ready when deadline already passed", () => {
    const cooldowns: CooldownMap = { test_ability: 1000 };
    expect(isAbilityReady("test_ability", cooldowns, 2000)).toBe(true);
  });

  it("not ready when deadline in the future", () => {
    const cooldowns: CooldownMap = { test_ability: 5000 };
    expect(isAbilityReady("test_ability", cooldowns, 1000)).toBe(false);
  });
});

describe("remainingCooldownMs", () => {
  it("returns 0 when no cooldown set", () => {
    expect(remainingCooldownMs("test_ability", {})).toBe(0);
  });

  it("returns positive remaining ms when in cooldown", () => {
    const cooldowns: CooldownMap = { test_ability: 5000 };
    expect(remainingCooldownMs("test_ability", cooldowns, 2000)).toBe(3000);
  });

  it("returns 0 (not negative) past the deadline", () => {
    const cooldowns: CooldownMap = { test_ability: 1000 };
    expect(remainingCooldownMs("test_ability", cooldowns, 5000)).toBe(0);
  });
});

describe("startCooldown", () => {
  it("sets the deadline to now + cooldownMs", () => {
    const next = startCooldown(ability, {}, 1000);
    expect(next.test_ability).toBe(31_000);
  });

  it("preserves cooldowns for other abilities", () => {
    const cooldowns: CooldownMap = { other: 99 };
    const next = startCooldown(ability, cooldowns, 1000);
    expect(next.other).toBe(99);
    expect(next.test_ability).toBe(31_000);
  });

  it("overwrites a prior deadline for the same ability", () => {
    const cooldowns: CooldownMap = { test_ability: 100 };
    const next = startCooldown(ability, cooldowns, 1000);
    expect(next.test_ability).toBe(31_000);
  });
});

describe("clearCooldown", () => {
  it("removes the cooldown for the named ability", () => {
    const cooldowns: CooldownMap = { test_ability: 5000, other: 100 };
    const next = clearCooldown("test_ability", cooldowns);
    expect(next.test_ability).toBeUndefined();
    expect(next.other).toBe(100);
  });

  it("is a no-op when the ability had no cooldown", () => {
    const cooldowns: CooldownMap = { other: 100 };
    const next = clearCooldown("test_ability", cooldowns);
    expect(next).toBe(cooldowns);
  });
});
