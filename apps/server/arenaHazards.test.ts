/* ═══════════════════════════════════════════════════════
   Arena Hazards — registry + helper invariants
   ═══════════════════════════════════════════════════════ */
import { describe, it, expect } from "vitest";
import {
  ARENA_HAZARDS,
  getArenaHazards,
  getArenaAmbientEffects,
  getArenaDamageHazards,
  arenaHasPhaseTransitions,
} from "../client/src/game/arenaHazards";
import { ARENAS } from "../client/src/game/gameData";

const ARENA_IDS = new Set(ARENAS.map(a => a.id));

describe("Arena Hazards — coverage", () => {
  it("should have at least one hazard for every story-relevant arena", () => {
    // The 13 arenas that actually host story chapters or high-profile
    // fights. Competitive-only arenas (ranked-table, tournament-hall,
    // draft-chamber) also get at least one entry for flavor.
    const required = [
      "new-babylon",
      "panopticon",
      "thaloria",
      "terminus",
      "mechronis",
      "crucible",
      "blood-weave",
      "shadow-sanctum",
      "ranked-table",
      "tournament-hall",
      "draft-chamber",
      "watcher-panopticon",
      "architect-throne",
      "necromancer-castle",
      "terminus-core",
      "the-trench",
    ];

    for (const arenaId of required) {
      const hazards = getArenaHazards(arenaId);
      expect(hazards.length, `${arenaId} has no hazards`).toBeGreaterThan(0);
    }
  });

  it("every hazard's arenaId must reference a real arena", () => {
    for (const h of ARENA_HAZARDS) {
      expect(ARENA_IDS.has(h.arenaId), `${h.id} references unknown arena ${h.arenaId}`).toBe(true);
    }
  });

  it("hazard ids should be unique across the registry", () => {
    const ids = ARENA_HAZARDS.map(h => h.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("hazard ids should be prefixed with their arenaId", () => {
    for (const h of ARENA_HAZARDS) {
      expect(h.id.startsWith(`${h.arenaId}_`), `${h.id} missing arena prefix`).toBe(true);
    }
  });
});

describe("Arena Hazards — schema invariants", () => {
  it("every hazard should have non-empty id/name/description", () => {
    for (const h of ARENA_HAZARDS) {
      expect(h.id).toBeTruthy();
      expect(h.name, `${h.id} empty name`).toBeTruthy();
      expect(h.description, `${h.id} empty description`).toBeTruthy();
    }
  });

  it("damagePerTick should be a non-negative integer", () => {
    for (const h of ARENA_HAZARDS) {
      expect(h.damagePerTick, `${h.id} damagePerTick`).toBeGreaterThanOrEqual(0);
      expect(Number.isFinite(h.damagePerTick)).toBe(true);
    }
  });

  it("periodic hazards should have periodMs > 0", () => {
    for (const h of ARENA_HAZARDS) {
      if (h.activation === "periodic") {
        expect(h.periodMs, `${h.id} periodMs`).toBeDefined();
        expect(h.periodMs!).toBeGreaterThan(0);
      }
    }
  });

  it("damage_zone hazards should deal non-zero damage", () => {
    for (const h of ARENA_HAZARDS) {
      if (h.type === "damage_zone") {
        expect(h.damagePerTick, `${h.id} should deal damage`).toBeGreaterThan(0);
      }
    }
  });

  it("ambient_effect hazards should not deal damage", () => {
    for (const h of ARENA_HAZARDS) {
      if (h.type === "ambient_effect") {
        expect(h.damagePerTick, `${h.id} is ambient, should deal 0`).toBe(0);
      }
    }
  });

  it("position-bound hazards should have valid bounding boxes", () => {
    for (const h of ARENA_HAZARDS) {
      if (h.position) {
        expect(h.position.x).toBeGreaterThanOrEqual(0);
        expect(h.position.y).toBeGreaterThanOrEqual(0);
        expect(h.position.w).toBeGreaterThan(0);
        expect(h.position.h).toBeGreaterThan(0);
        expect(h.position.x + h.position.w, `${h.id} x+w`).toBeLessThanOrEqual(100);
        expect(h.position.y + h.position.h, `${h.id} y+h`).toBeLessThanOrEqual(100);
      }
    }
  });
});

describe("Arena Hazards — helpers", () => {
  it("getArenaHazards returns empty array for unknown arena", () => {
    expect(getArenaHazards("__nowhere__")).toEqual([]);
  });

  it("getArenaAmbientEffects only returns non-damaging hazards with effects", () => {
    const thaloria = getArenaAmbientEffects("thaloria");
    for (const h of thaloria) {
      expect(h.damagePerTick).toBe(0);
      expect(h.ambientEffect).toBeDefined();
    }
  });

  it("getArenaDamageHazards only returns damage-dealing hazards", () => {
    const crucible = getArenaDamageHazards("crucible");
    for (const h of crucible) {
      expect(h.damagePerTick).toBeGreaterThan(0);
    }
  });

  it("arenaHasPhaseTransitions is true for architect-throne (design collapse)", () => {
    expect(arenaHasPhaseTransitions("architect-throne")).toBe(true);
  });

  it("arenaHasPhaseTransitions is true for necromancer-castle (resurrection)", () => {
    expect(arenaHasPhaseTransitions("necromancer-castle")).toBe(true);
  });

  it("arenaHasPhaseTransitions is false for a static training arena", () => {
    expect(arenaHasPhaseTransitions("new-babylon")).toBe(false);
  });

  it("watcher-panopticon has a phase_2 damage zone (Discipline Beam)", () => {
    const hazards = getArenaHazards("watcher-panopticon");
    const beam = hazards.find(h => h.id === "watcher-panopticon_discipline_beam");
    expect(beam).toBeDefined();
    expect(beam!.activation).toBe("phase_2");
    expect(beam!.damagePerTick).toBeGreaterThan(0);
  });
});
