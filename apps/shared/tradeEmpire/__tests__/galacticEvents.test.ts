// apps/shared/tradeEmpire/__tests__/galacticEvents.test.ts

import { describe, it, expect } from "vitest";
import {
  pickEventsToFire,
  REFERENCE_GALACTIC_EVENTS,
  triggerMatches,
  validateAllReferenceEvents,
  validateGalacticEventDef,
  type GalacticEventDef,
} from "../galacticEvents";

describe("Galactic event registry — Phase B", () => {
  it("every reference event passes validateGalacticEventDef()", () => {
    expect(validateAllReferenceEvents()).toEqual([]);
  });

  it("every event key starts with evt.", () => {
    for (const event of REFERENCE_GALACTIC_EVENTS) {
      expect(event.eventKey.startsWith("evt.")).toBe(true);
    }
  });

  it("event keys are unique", () => {
    const keys = REFERENCE_GALACTIC_EVENTS.map(e => e.eventKey);
    expect(keys.length).toBe(new Set(keys).size);
  });

  it("rejects an event with weight outside [0,1]", () => {
    const bad: GalacticEventDef = {
      eventKey: "evt.bad",
      name: "bad",
      loreContext: "x",
      trigger: { kind: "random_per_tick", weight: 1.5 },
      effect: { summary: "x" },
    };
    expect(validateGalacticEventDef(bad).length).toBeGreaterThan(0);
  });

  it("rejects an event without evt. prefix", () => {
    const bad: GalacticEventDef = {
      eventKey: "no_prefix",
      name: "bad",
      loreContext: "x",
      trigger: { kind: "random_per_tick", weight: 0.5 },
      effect: { summary: "x" },
    };
    expect(validateGalacticEventDef(bad).length).toBeGreaterThan(0);
  });
});

describe("triggerMatches", () => {
  it("random_per_tick always matches", () => {
    expect(
      triggerMatches(
        { kind: "random_per_tick", weight: 0.5 },
        { recentPublicFlags: new Set(), resolvedAgendaKeys: new Set() },
      ),
    ).toBe(true);
  });

  it("season_phase_enter matches only the named phase", () => {
    expect(
      triggerMatches(
        { kind: "season_phase_enter", phase: "running", weight: 0.5 },
        { phaseEntered: "running", recentPublicFlags: new Set(), resolvedAgendaKeys: new Set() },
      ),
    ).toBe(true);
    expect(
      triggerMatches(
        { kind: "season_phase_enter", phase: "running", weight: 0.5 },
        { phaseEntered: "closing", recentPublicFlags: new Set(), resolvedAgendaKeys: new Set() },
      ),
    ).toBe(false);
  });

  it("after_flag matches only when flag is in recent set", () => {
    expect(
      triggerMatches(
        { kind: "after_flag", flag: "evt.x.active", weight: 0.5 },
        {
          recentPublicFlags: new Set(["evt.x.active"]),
          resolvedAgendaKeys: new Set(),
        },
      ),
    ).toBe(true);
    expect(
      triggerMatches(
        { kind: "after_flag", flag: "evt.x.active", weight: 0.5 },
        { recentPublicFlags: new Set(), resolvedAgendaKeys: new Set() },
      ),
    ).toBe(false);
  });
});

describe("pickEventsToFire — deterministic with injected RNG", () => {
  it("RNG returning 0 picks every triggerable event", () => {
    const events = REFERENCE_GALACTIC_EVENTS.filter(e => e.trigger.kind === "random_per_tick");
    const fired = pickEventsToFire(
      events,
      { recentPublicFlags: new Set(), resolvedAgendaKeys: new Set() },
      () => 0,
    );
    expect(fired.length).toBe(events.length);
  });

  it("RNG returning 1 picks zero events", () => {
    const fired = pickEventsToFire(
      REFERENCE_GALACTIC_EVENTS,
      { recentPublicFlags: new Set(), resolvedAgendaKeys: new Set() },
      () => 0.999999,
    );
    expect(fired.length).toBe(0);
  });

  it("filters out events whose trigger condition is false", () => {
    const events: GalacticEventDef[] = [
      {
        eventKey: "evt.test_a",
        name: "A",
        loreContext: "x",
        trigger: { kind: "after_flag", flag: "missing", weight: 1 },
        effect: { summary: "x" },
      },
      {
        eventKey: "evt.test_b",
        name: "B",
        loreContext: "x",
        trigger: { kind: "random_per_tick", weight: 1 },
        effect: { summary: "x" },
      },
    ];
    const fired = pickEventsToFire(
      events,
      { recentPublicFlags: new Set(), resolvedAgendaKeys: new Set() },
      () => 0,
    );
    expect(fired.map(e => e.eventKey)).toEqual(["evt.test_b"]);
  });
});
