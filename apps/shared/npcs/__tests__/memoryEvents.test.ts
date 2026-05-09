import { describe, it, expect } from "vitest";

import type { NpcMemoryRow } from "../../../db/schema";
import {
  MEMORY_EVENT_KEYS,
  NPC_MEMORY_INTEREST,
  memoryFlag,
  npcsInterestedIn,
  polarityToken,
  synthesizeMemoryFlags,
  type MemoryEventKey,
} from "../memoryEvents";
import type { NpcKey } from "../types";

function memRow(overrides: Partial<NpcMemoryRow> & {
  npcKey: NpcKey;
  eventKey: MemoryEventKey;
  polarity: number;
}): NpcMemoryRow {
  const now = new Date();
  return {
    id: overrides.id ?? Math.floor(Math.random() * 1_000_000),
    userId: overrides.userId ?? 1,
    npcKey: overrides.npcKey,
    eventKey: overrides.eventKey,
    polarity: overrides.polarity,
    payload: overrides.payload ?? null,
    createdAt: overrides.createdAt ?? now,
    expiresAt: overrides.expiresAt ?? null,
  };
}

describe("memoryEvents — registry shape", () => {
  it("MEMORY_EVENT_KEYS is non-empty and unique", () => {
    expect(MEMORY_EVENT_KEYS.length).toBeGreaterThan(0);
    expect(new Set(MEMORY_EVENT_KEYS).size).toBe(MEMORY_EVENT_KEYS.length);
  });

  it("every NPC's interest vector references only declared event-keys", () => {
    const validKeys = new Set<string>(MEMORY_EVENT_KEYS);
    for (const [, vector] of Object.entries(NPC_MEMORY_INTEREST)) {
      for (const key of vector ?? []) {
        expect(validKeys.has(key)).toBe(true);
      }
    }
  });

  it("at least one NPC opts into each event-key (no orphan keys)", () => {
    for (const key of MEMORY_EVENT_KEYS) {
      const interested = npcsInterestedIn(key);
      expect(interested.length).toBeGreaterThan(0);
    }
  });
});

describe("polarityToken", () => {
  it.each([
    [-2, "negative"],
    [-1, "negative"],
    [0, "neutral"],
    [1, "positive"],
    [42, "positive"],
  ] as const)("maps %i to %s", (input, expected) => {
    expect(polarityToken(input)).toBe(expected);
  });
});

describe("memoryFlag", () => {
  it("formats canonical mem:<npc>:<event>:<polarity> shape", () => {
    expect(memoryFlag("adjudicator_locke", "contract_breached", -1)).toBe(
      "mem:adjudicator_locke:contract_breached:negative",
    );
    expect(memoryFlag("wraith_calder", "convoy_spared", 1)).toBe(
      "mem:wraith_calder:convoy_spared:positive",
    );
    expect(memoryFlag("the_human", "confession_offered", 0)).toBe(
      "mem:the_human:confession_offered:neutral",
    );
  });
});

describe("synthesizeMemoryFlags", () => {
  it("returns empty for an NPC with no rows", () => {
    expect(synthesizeMemoryFlags("elara", [])).toEqual([]);
  });

  it("filters to the requested NPC", () => {
    const rows = [
      memRow({ npcKey: "adjudicator_locke", eventKey: "contract_honored", polarity: 1 }),
      memRow({ npcKey: "wraith_calder", eventKey: "convoy_spared", polarity: 1 }),
    ];
    const lockeFlags = synthesizeMemoryFlags("adjudicator_locke", rows);
    expect(lockeFlags).toEqual([
      "mem:adjudicator_locke:contract_honored:positive",
    ]);
  });

  it("emits canonical flag shape per memory row", () => {
    const rows = [
      memRow({ npcKey: "wraith_calder", eventKey: "convoy_spared", polarity: 1 }),
      memRow({ npcKey: "wraith_calder", eventKey: "combat_during_ceremony", polarity: -1 }),
    ];
    const flags = synthesizeMemoryFlags("wraith_calder", rows);
    expect(flags).toContain("mem:wraith_calder:convoy_spared:positive");
    expect(flags).toContain("mem:wraith_calder:combat_during_ceremony:negative");
    expect(flags.length).toBe(2);
  });

  it("collapses multiple rows for the same event to the latest", () => {
    const earlier = new Date("2026-01-01T00:00:00Z");
    const later = new Date("2026-05-09T00:00:00Z");
    const rows = [
      memRow({
        npcKey: "the_degen",
        eventKey: "casino_hot_streak",
        polarity: 1,
        createdAt: earlier,
      }),
      memRow({
        npcKey: "the_degen",
        eventKey: "casino_hot_streak",
        polarity: -1,
        createdAt: later,
      }),
    ];
    const flags = synthesizeMemoryFlags("the_degen", rows);
    // Latest row's polarity wins.
    expect(flags).toEqual(["mem:the_degen:casino_hot_streak:negative"]);
  });

  it("skips memories past their expiry", () => {
    const now = new Date("2026-05-09T12:00:00Z");
    const expired = new Date("2026-05-09T11:00:00Z");
    const future = new Date("2026-05-09T13:00:00Z");
    const rows = [
      memRow({
        npcKey: "vex_solene",
        eventKey: "secret_kept",
        polarity: 1,
        expiresAt: expired,
      }),
      memRow({
        npcKey: "vex_solene",
        eventKey: "secret_disclosed",
        polarity: -1,
        expiresAt: future,
      }),
      memRow({
        npcKey: "vex_solene",
        eventKey: "vulnerability_returned",
        polarity: 1,
        expiresAt: null,
      }),
    ];
    const flags = synthesizeMemoryFlags("vex_solene", rows, now);
    expect(flags).toContain("mem:vex_solene:secret_disclosed:negative");
    expect(flags).toContain("mem:vex_solene:vulnerability_returned:positive");
    expect(flags).not.toContain("mem:vex_solene:secret_kept:positive");
  });
});

describe("npcsInterestedIn", () => {
  it("returns NPCs whose interest vector contains the key", () => {
    const interestedInConvoy = npcsInterestedIn("convoy_spared");
    expect(interestedInConvoy).toContain("wraith_calder");
    expect(interestedInConvoy).toContain("the_human");
    expect(interestedInConvoy).toContain("elara");
  });

  it("returns NPCs distinct (no duplicates)", () => {
    for (const key of MEMORY_EVENT_KEYS) {
      const interested = npcsInterestedIn(key);
      expect(new Set(interested).size).toBe(interested.length);
    }
  });

  it("Hierophant covert events are honored (combat_during_ceremony)", () => {
    // Per bible §3.10, combat-during-ceremony is the Hierophant's
    // hardest-line memory. He must be in the interest set.
    expect(npcsInterestedIn("combat_during_ceremony")).toContain("wraith_calder");
  });
});
