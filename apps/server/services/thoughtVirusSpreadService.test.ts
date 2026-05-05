import { describe, it, expect } from "vitest";

import { isOnCooldown } from "./thoughtVirusSpreadService";

const baseAction = {
  id: "test",
  label: "Test",
  description: "",
  infectionDelta: -10,
};

describe("isOnCooldown", () => {
  const now = new Date("2026-05-05T12:00:00Z");

  it("returns false when no prior action recorded", () => {
    expect(isOnCooldown(baseAction, null, now)).toBe(false);
  });

  it("returns true when last action was within cooldown window", () => {
    const lastAt = new Date("2026-05-05T06:00:00Z"); // 6 hours ago
    expect(isOnCooldown({ ...baseAction, cooldownDays: 1 }, lastAt, now)).toBe(true);
  });

  it("returns false when last action exceeds cooldown window", () => {
    const lastAt = new Date("2026-05-04T06:00:00Z"); // 30 hours ago
    expect(isOnCooldown({ ...baseAction, cooldownDays: 1 }, lastAt, now)).toBe(false);
  });

  it("respects multi-day cooldowns", () => {
    const lastAt = new Date("2026-05-03T12:00:00Z"); // 2 days ago
    expect(isOnCooldown({ ...baseAction, cooldownDays: 5 }, lastAt, now)).toBe(true);
    expect(isOnCooldown({ ...baseAction, cooldownDays: 1 }, lastAt, now)).toBe(false);
  });

  it("defaults cooldownDays to 1 when undefined", () => {
    const lastAt = new Date("2026-05-05T06:00:00Z");
    expect(isOnCooldown(baseAction, lastAt, now)).toBe(true);
  });
});
