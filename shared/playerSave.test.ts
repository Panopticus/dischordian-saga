import { describe, it, expect } from "vitest";
import {
  playerSaveV1Schema,
  parsePlayerSave,
  migratePlayerSave,
  emptyPlayerSave,
  SCHEMA_VERSION,
} from "./playerSave";

/* ═══════════════════════════════════════════════════════
   PlayerSaveV1 — schema + migration + round-trip
   ═══════════════════════════════════════════════════════ */

describe("emptyPlayerSave", () => {
  it("produces a save that passes its own schema", () => {
    const empty = emptyPlayerSave();
    const result = playerSaveV1Schema.safeParse(empty);
    expect(result.success).toBe(true);
  });

  it("stamps the current SCHEMA_VERSION", () => {
    expect(emptyPlayerSave().version).toBe(SCHEMA_VERSION);
  });

  it("has zero counters by default", () => {
    const empty = emptyPlayerSave();
    expect(empty.battleStats.won).toBe(0);
    expect(empty.battleStats.played).toBe(0);
    expect(empty.terminus.highestWave).toBe(0);
    expect(empty.dischordia.elo).toBe(1000);
  });

  it("has empty collections by default", () => {
    const empty = emptyPlayerSave();
    expect(empty.discovery.discovered).toEqual([]);
    expect(empty.bestiary.owned).toEqual([]);
    expect(empty.discovery.narrativeFlags).toEqual({});
  });
});

describe("parsePlayerSave", () => {
  it("round-trips a valid save through JSON", () => {
    const original = emptyPlayerSave();
    original.battleStats = { won: 12, played: 20 };
    const json = JSON.parse(JSON.stringify(original));
    const reparsed = parsePlayerSave(json);
    expect(reparsed).not.toBeNull();
    expect(reparsed?.battleStats.won).toBe(12);
    expect(reparsed?.battleStats.played).toBe(20);
  });

  it("fills missing fields with defaults", () => {
    const partial = { version: 1, battleStats: { won: 3, played: 5 } };
    const reparsed = parsePlayerSave(partial);
    expect(reparsed).not.toBeNull();
    expect(reparsed?.battleStats.won).toBe(3);
    expect(reparsed?.dischordia.elo).toBe(1000);
    expect(reparsed?.discovery.discovered).toEqual([]);
  });

  it("coerces stringified counters (legacy localStorage values)", () => {
    const legacy = {
      battleStats: { won: "7", played: "10" },
      terminus: { highestWave: "15", kills: "400", trophies: "3", puzzleComplete: "true" },
    };
    const reparsed = parsePlayerSave(legacy);
    expect(reparsed?.battleStats.won).toBe(7);
    expect(reparsed?.battleStats.played).toBe(10);
    expect(reparsed?.terminus.highestWave).toBe(15);
    expect(reparsed?.terminus.puzzleComplete).toBe(true);
  });

  it("rescues garbage counters by falling back to 0", () => {
    const garbage = {
      battleStats: { won: "not a number", played: null },
    };
    const reparsed = parsePlayerSave(garbage);
    expect(reparsed?.battleStats.won).toBe(0);
    expect(reparsed?.battleStats.played).toBe(0);
  });

  it("handles null / undefined input by returning empty save", () => {
    expect(parsePlayerSave(null)).toEqual(emptyPlayerSave());
    expect(parsePlayerSave(undefined)).toEqual(emptyPlayerSave());
  });

  it("handles a malformed arrays field by falling back to empty array", () => {
    const bad = { discovery: { discovered: "not-an-array" } };
    const reparsed = parsePlayerSave(bad);
    expect(reparsed?.discovery.discovered).toEqual([]);
  });
});

describe("migratePlayerSave", () => {
  it("accepts an unversioned save as V1", () => {
    const noVersion = { battleStats: { won: 1, played: 2 } };
    const result = migratePlayerSave(noVersion);
    expect(result).not.toBeNull();
    expect(result?.version).toBe(SCHEMA_VERSION);
    expect(result?.battleStats.won).toBe(1);
  });

  it("accepts a current-version save", () => {
    const current = emptyPlayerSave();
    const result = migratePlayerSave(current);
    expect(result).not.toBeNull();
    expect(result?.version).toBe(SCHEMA_VERSION);
  });

  it("refuses an unknown future version to avoid silent downgrade", () => {
    const future = { version: 999, battleStats: { won: 1, played: 2 } };
    expect(migratePlayerSave(future)).toBeNull();
  });

  it("refuses non-object input", () => {
    expect(migratePlayerSave(null)).toBeNull();
    expect(migratePlayerSave("not a save")).toBeNull();
    expect(migratePlayerSave(42)).toBeNull();
  });
});

describe("schema invariants", () => {
  it("every top-level bucket has a default so {} is valid", () => {
    const result = playerSaveV1Schema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("validates that version literal is SCHEMA_VERSION", () => {
    // Zod literal should accept the constant and reject anything else,
    // but our schema defaults the version so this test is asserting the
    // coerced default rather than a strict reject.
    const result = playerSaveV1Schema.parse({});
    expect(result.version).toBe(SCHEMA_VERSION);
  });
});
