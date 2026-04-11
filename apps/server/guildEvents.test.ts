/* ═══════════════════════════════════════════════════════
   Guild Events — shared-module unit tests.

   These hit the pure validators and helpers in
   @shared/guildEvents. The router itself needs a DB and is
   covered by integration tests elsewhere (once the DB is
   available in CI).
   ═══════════════════════════════════════════════════════ */
import { describe, it, expect } from "vitest";
import {
  GUILD_EVENT_TYPES,
  getGuildEventTypeDef,
  validateEventInput,
  computeLiveStatus,
  countGoing,
  GUILD_EVENT_LIMITS,
} from "@shared/guildEvents";

describe("GUILD_EVENT_TYPES catalog", () => {
  it("includes the 10 documented categories", () => {
    const ids = GUILD_EVENT_TYPES.map((t) => t.id);
    expect(ids).toEqual([
      "raid", "tournament", "pvp_practice", "roleplay", "lore_night",
      "recruitment_drive", "trade_fair", "training", "social", "other",
    ]);
  });

  it("every type has a name, icon, and color", () => {
    for (const t of GUILD_EVENT_TYPES) {
      expect(t.name.length).toBeGreaterThan(0);
      expect(t.icon.length).toBeGreaterThan(0);
      expect(t.color).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it("getGuildEventTypeDef falls back to 'other' for unknown ids", () => {
    // @ts-expect-error — intentionally passing an invalid type
    const fallback = getGuildEventTypeDef("not_a_real_type");
    expect(fallback.id).toBe("other");
  });
});

describe("validateEventInput", () => {
  const now = Date.now();
  const inOneHour = now + 60 * 60 * 1000;
  const inTwoHours = now + 2 * 60 * 60 * 1000;

  it("accepts a well-formed input", () => {
    const errors = validateEventInput({
      title: "Sentinel raid",
      description: "Farming the Sentinel for cores.",
      startsAt: inOneHour,
      endsAt: inTwoHours,
      maxAttendees: 10,
    });
    expect(errors).toEqual([]);
  });

  it("rejects an empty title", () => {
    const errors = validateEventInput({
      title: "   ",
      startsAt: inOneHour,
      endsAt: inTwoHours,
    });
    expect(errors.some((e) => e.field === "title")).toBe(true);
  });

  it("rejects end-before-start", () => {
    const errors = validateEventInput({
      title: "x",
      startsAt: inTwoHours,
      endsAt: inOneHour,
    });
    expect(errors.some((e) => e.field === "endsAt")).toBe(true);
  });

  it("rejects durations under the minimum", () => {
    const errors = validateEventInput({
      title: "x",
      startsAt: inOneHour,
      endsAt: inOneHour + 30 * 1000, // 30 seconds
    });
    expect(errors.some((e) => e.message.toLowerCase().includes("5 minutes"))).toBe(true);
  });

  it("rejects durations over 7 days", () => {
    const errors = validateEventInput({
      title: "x",
      startsAt: inOneHour,
      endsAt: inOneHour + 8 * 24 * 60 * 60 * 1000,
    });
    expect(errors.some((e) => e.message.toLowerCase().includes("7 days"))).toBe(true);
  });

  it("rejects events scheduled more than 180 days out", () => {
    const errors = validateEventInput({
      title: "x",
      startsAt: now + 200 * 24 * 60 * 60 * 1000,
      endsAt: now + 200 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000,
    });
    expect(errors.some((e) => e.field === "startsAt")).toBe(true);
  });

  it("rejects negative maxAttendees", () => {
    const errors = validateEventInput({
      title: "x",
      startsAt: inOneHour,
      endsAt: inTwoHours,
      maxAttendees: -1,
    });
    expect(errors.some((e) => e.field === "maxAttendees")).toBe(true);
  });

  it("rejects titles over the max length", () => {
    const errors = validateEventInput({
      title: "x".repeat(GUILD_EVENT_LIMITS.titleMaxLen + 1),
      startsAt: inOneHour,
      endsAt: inTwoHours,
    });
    expect(errors.some((e) => e.field === "title")).toBe(true);
  });
});

describe("computeLiveStatus", () => {
  const fixedNow = 1_700_000_000_000;
  it("returns scheduled before the start time", () => {
    expect(
      computeLiveStatus("scheduled", fixedNow + 1000, fixedNow + 2000, fixedNow),
    ).toBe("scheduled");
  });

  it("returns in_progress during the window", () => {
    expect(
      computeLiveStatus("scheduled", fixedNow - 1000, fixedNow + 1000, fixedNow),
    ).toBe("in_progress");
  });

  it("returns completed after the end time", () => {
    expect(
      computeLiveStatus("scheduled", fixedNow - 2000, fixedNow - 1000, fixedNow),
    ).toBe("completed");
  });

  it("preserves cancelled regardless of time", () => {
    expect(
      computeLiveStatus("cancelled", fixedNow - 2000, fixedNow + 2000, fixedNow),
    ).toBe("cancelled");
  });

  it("preserves explicit completed status", () => {
    expect(
      computeLiveStatus("completed", fixedNow - 2000, fixedNow + 2000, fixedNow),
    ).toBe("completed");
  });
});

describe("countGoing", () => {
  it("counts only 'going' RSVPs", () => {
    const n = countGoing([
      { rsvpStatus: "going" },
      { rsvpStatus: "going" },
      { rsvpStatus: "maybe" },
      { rsvpStatus: "declined" },
    ]);
    expect(n).toBe(2);
  });
});
