import { describe, it, expect } from "vitest";
import {
  getVirusStage,
  VIRUS_STAGES,
  DEFAULT_VIRUS_STATE,
  applyLoadDelta,
  logResidueItem,
  quarantineResidueItem,
  RESIDUE_ITEMS,
  propagateTick,
  PROPAGATION_TICK_MS,
  canApplyCure,
  applyCure,
  pressureFromStateDelta,
  applyVirusStatus,
  tickVirusStatus,
  BASE_VIRUS_STATUS,
  getVirusSummary,
  PRESSURE_ON_STAGE_ENTRY,
  ARK_ROOM_ADJACENCY,
} from "./thoughtVirus";

/* ─── STAGE RESOLUTION ─── */

describe("thoughtVirus — stages", () => {
  it("exports exactly 5 stages in ascending threshold order", () => {
    expect(VIRUS_STAGES).toHaveLength(5);
    for (let i = 1; i < VIRUS_STAGES.length; i++) {
      expect(VIRUS_STAGES[i].threshold).toBeGreaterThan(VIRUS_STAGES[i - 1].threshold);
    }
  });

  it("returns dormant at load 0", () => {
    expect(getVirusStage(0).id).toBe("dormant");
  });

  it("returns latent at threshold boundary", () => {
    expect(getVirusStage(20).id).toBe("latent");
  });

  it("returns active between latent and critical thresholds", () => {
    expect(getVirusStage(44).id).toBe("latent");
    expect(getVirusStage(45).id).toBe("active");
    expect(getVirusStage(69).id).toBe("active");
  });

  it("returns critical at 70-94", () => {
    expect(getVirusStage(70).id).toBe("critical");
    expect(getVirusStage(94).id).toBe("critical");
  });

  it("returns consumed at 95+", () => {
    expect(getVirusStage(95).id).toBe("consumed");
    expect(getVirusStage(100).id).toBe("consumed");
  });

  it("clamps negative load to dormant", () => {
    expect(getVirusStage(-20).id).toBe("dormant");
  });

  it("clamps above 100 to consumed", () => {
    expect(getVirusStage(500).id).toBe("consumed");
  });

  it("every stage has a non-empty description + color", () => {
    for (const stage of VIRUS_STAGES) {
      expect(stage.description.length).toBeGreaterThan(10);
      expect(stage.color).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});

/* ─── LOAD DELTAS ─── */

describe("thoughtVirus — applyLoadDelta", () => {
  it("adds load and re-derives stage", () => {
    const next = applyLoadDelta(DEFAULT_VIRUS_STATE, 25);
    expect(next.load).toBe(25);
    expect(next.stage).toBe("latent");
  });

  it("clamps negative results at 0", () => {
    const next = applyLoadDelta({ ...DEFAULT_VIRUS_STATE, load: 10 }, -50);
    expect(next.load).toBe(0);
    expect(next.stage).toBe("dormant");
  });

  it("clamps high results at 100", () => {
    const next = applyLoadDelta({ ...DEFAULT_VIRUS_STATE, load: 90 }, 50);
    expect(next.load).toBe(100);
    expect(next.stage).toBe("consumed");
  });

  it("does not mutate the input state", () => {
    const input = { ...DEFAULT_VIRUS_STATE, load: 10 };
    applyLoadDelta(input, 30);
    expect(input.load).toBe(10);
  });
});

/* ─── RESIDUE ITEMS ─── */

describe("thoughtVirus — residue items", () => {
  it("exports at least 5 residue items", () => {
    expect(RESIDUE_ITEMS.length).toBeGreaterThanOrEqual(5);
  });

  it("each residue item has positive log/quarantine deltas and a flag", () => {
    for (const item of RESIDUE_ITEMS) {
      expect(item.loadOnLog).toBeGreaterThan(0);
      expect(item.loadOnQuarantine).toBeGreaterThan(0);
      expect(item.narrativeFlag).toBeTruthy();
      expect(item.room).toBeTruthy();
    }
  });

  it("logResidueItem increases load and records the item", () => {
    const { state, delta } = logResidueItem(DEFAULT_VIRUS_STATE, "residue_cryo_coolant");
    expect(delta).toBe(2);
    expect(state.load).toBe(2);
    expect(state.residueItemsLogged).toContain("residue_cryo_coolant");
  });

  it("logResidueItem is idempotent for the same item", () => {
    const first = logResidueItem(DEFAULT_VIRUS_STATE, "residue_cryo_coolant").state;
    const second = logResidueItem(first, "residue_cryo_coolant");
    expect(second.delta).toBe(0);
    expect(second.state.load).toBe(first.load);
  });

  it("quarantineResidueItem reduces load and requires prior log", () => {
    const logged = logResidueItem(DEFAULT_VIRUS_STATE, "residue_medbay_sample").state;
    expect(logged.load).toBe(4);
    const quarantined = quarantineResidueItem(logged, "residue_medbay_sample");
    expect(quarantined.delta).toBe(-8);
    expect(quarantined.state.load).toBe(0); // clamped at 0
    expect(quarantined.state.residueItemsQuarantined).toContain("residue_medbay_sample");
  });

  it("quarantineResidueItem is a no-op for unlogged items", () => {
    const result = quarantineResidueItem(DEFAULT_VIRUS_STATE, "residue_medbay_sample");
    expect(result.delta).toBe(0);
    expect(result.state).toBe(DEFAULT_VIRUS_STATE);
  });

  it("quarantineResidueItem is a no-op for unknown items", () => {
    const result = quarantineResidueItem(DEFAULT_VIRUS_STATE, "nonexistent_id");
    expect(result.delta).toBe(0);
  });
});

/* ─── ROOM PROPAGATION ─── */

describe("thoughtVirus — propagation", () => {
  it("every known ark room in adjacency graph has adjacent rooms", () => {
    for (const [room, neighbours] of Object.entries(ARK_ROOM_ADJACENCY)) {
      expect(neighbours.length).toBeGreaterThan(0);
      for (const n of neighbours) {
        // Adjacency is symmetric for every pairing we care about.
        expect(ARK_ROOM_ADJACENCY[n] ?? []).toContain(room);
      }
    }
  });

  it("does nothing if the tick interval has not elapsed", () => {
    const state = {
      ...DEFAULT_VIRUS_STATE,
      contaminatedRooms: ["medical_bay"],
      lastTickAt: 1000,
    };
    const result = propagateTick(state, 2000); // only 1s since last tick
    expect(result.loadGained).toBe(0);
    expect(result.newlyInfectedRooms).toHaveLength(0);
  });

  it("adds load per contaminated room when tick elapses", () => {
    const state = {
      ...DEFAULT_VIRUS_STATE,
      contaminatedRooms: ["medical_bay", "cargo_hold"],
      lastTickAt: 0,
    };
    // Deterministic rng: always 0.99 → never rolls spread
    const result = propagateTick(state, PROPAGATION_TICK_MS + 1, () => 0.99);
    expect(result.loadGained).toBe(2);
    expect(result.newlyInfectedRooms).toHaveLength(0);
  });

  it("spreads to a clean adjacent room when rng is below 0.25", () => {
    const state = {
      ...DEFAULT_VIRUS_STATE,
      contaminatedRooms: ["medical_bay"],
      lastTickAt: 0,
    };
    // rng sequence: 0.1 (spread roll passes) then 0.0 (first neighbour picked)
    const rngValues = [0.1, 0.0];
    let idx = 0;
    const rng = () => rngValues[idx++ % rngValues.length];
    const result = propagateTick(state, PROPAGATION_TICK_MS + 1, rng);
    expect(result.newlyInfectedRooms.length).toBeGreaterThanOrEqual(1);
    // medical_bay neighbours: cryo_bay, cargo_hold
    expect(["cryo_bay", "cargo_hold"]).toContain(result.newlyInfectedRooms[0]);
  });

  it("caps loadGained from rooms at 5 per tick", () => {
    const state = {
      ...DEFAULT_VIRUS_STATE,
      contaminatedRooms: Object.keys(ARK_ROOM_ADJACENCY), // every room infected
      lastTickAt: 0,
    };
    const result = propagateTick(state, PROPAGATION_TICK_MS + 1, () => 0.99);
    expect(result.loadGained).toBeLessThanOrEqual(5 + 0); // crew exposed = 0
  });
});

/* ─── CURES ─── */

describe("thoughtVirus — cures", () => {
  it("canApplyCure rejects cures above their max stage", () => {
    const critical = { ...DEFAULT_VIRUS_STATE, load: 80, stage: "critical" as const };
    expect(canApplyCure("medbay_course", critical)).toBe(false);
    expect(canApplyCure("voltari_ritual", critical)).toBe(true);
    expect(canApplyCure("companion_sacrifice", critical)).toBe(true);
  });

  it("medbay_course works at latent and active", () => {
    const latent = { ...DEFAULT_VIRUS_STATE, load: 25, stage: "latent" as const };
    expect(canApplyCure("medbay_course", latent)).toBe(true);
  });

  it("applyCure reduces load and returns the cure def on success", () => {
    const state = { ...DEFAULT_VIRUS_STATE, load: 40, stage: "latent" as const };
    const result = applyCure(state, "medbay_course");
    expect(result.success).toBe(true);
    expect(result.cure?.id).toBe("medbay_course");
    expect(result.state.load).toBe(10); // 40 - 30
    expect(result.state.stage).toBe("dormant");
    expect(result.state.cureCount).toBe(1);
  });

  it("applyCure fails silently above maxStage and leaves state unchanged", () => {
    const consumed = { ...DEFAULT_VIRUS_STATE, load: 100, stage: "consumed" as const };
    const result = applyCure(consumed, "medbay_course");
    expect(result.success).toBe(false);
    expect(result.state.load).toBe(100);
  });

  it("antiquarian_purge and source_bargain work even at consumed", () => {
    const consumed = { ...DEFAULT_VIRUS_STATE, load: 100, stage: "consumed" as const };
    expect(applyCure(consumed, "antiquarian_purge").success).toBe(true);
    expect(applyCure(consumed, "source_bargain").success).toBe(true);
  });
});

/* ─── PRESSURE HOOK ─── */

describe("thoughtVirus — pressureFromStateDelta", () => {
  it("returns 0 when stage does not change", () => {
    const before = { ...DEFAULT_VIRUS_STATE, load: 10, stage: "dormant" as const };
    const after = { ...DEFAULT_VIRUS_STATE, load: 15, stage: "dormant" as const };
    expect(pressureFromStateDelta(before, after)).toBe(0);
  });

  it("returns PRESSURE_ON_STAGE_ENTRY[latent] on dormant→latent", () => {
    const before = { ...DEFAULT_VIRUS_STATE, load: 5, stage: "dormant" as const };
    const after = { ...DEFAULT_VIRUS_STATE, load: 25, stage: "latent" as const };
    expect(pressureFromStateDelta(before, after)).toBe(PRESSURE_ON_STAGE_ENTRY.latent);
  });

  it("returns the sum of every stage crossed on a multi-stage jump", () => {
    const before = { ...DEFAULT_VIRUS_STATE, load: 5, stage: "dormant" as const };
    const after = { ...DEFAULT_VIRUS_STATE, load: 80, stage: "critical" as const };
    // dormant→latent + latent→active + active→critical
    const expected =
      PRESSURE_ON_STAGE_ENTRY.latent +
      PRESSURE_ON_STAGE_ENTRY.active +
      PRESSURE_ON_STAGE_ENTRY.critical;
    expect(pressureFromStateDelta(before, after)).toBe(expected);
  });

  it("returns 0 when a cure moves the player to a lower stage", () => {
    const before = { ...DEFAULT_VIRUS_STATE, load: 80, stage: "critical" as const };
    const after = { ...DEFAULT_VIRUS_STATE, load: 10, stage: "dormant" as const };
    expect(pressureFromStateDelta(before, after)).toBe(0);
  });
});

/* ─── VIRUS STATUS EFFECT ─── */

describe("thoughtVirus — combat status", () => {
  it("applyVirusStatus returns the base status on first application", () => {
    const status = applyVirusStatus(null);
    expect(status.stacks).toBe(1);
    expect(status.friendlyFireChance).toBe(BASE_VIRUS_STATUS.friendlyFireChance);
  });

  it("stacking raises friendly-fire chance and duration", () => {
    let status = applyVirusStatus(null);
    status = applyVirusStatus(status);
    status = applyVirusStatus(status);
    expect(status.stacks).toBe(3);
    expect(status.friendlyFireChance).toBeCloseTo(0.25 + 0.15 * 2);
    expect(status.turnsRemaining).toBe(5); // 3 + 2
  });

  it("caps friendly-fire chance at 0.85 and duration at 6", () => {
    let status: ReturnType<typeof applyVirusStatus> | null = null;
    for (let i = 0; i < 20; i++) status = applyVirusStatus(status);
    expect(status!.friendlyFireChance).toBeLessThanOrEqual(0.85);
    expect(status!.turnsRemaining).toBeLessThanOrEqual(6);
  });

  it("tickVirusStatus decrements duration and removes at 0", () => {
    const base = { ...BASE_VIRUS_STATUS, turnsRemaining: 1 };
    const result = tickVirusStatus(base, () => 0.99);
    expect(result.status).toBeNull();
    expect(result.targetAlly).toBe(false);
  });

  it("tickVirusStatus rolls friendly fire when rng < chance", () => {
    const result = tickVirusStatus(BASE_VIRUS_STATUS, () => 0.1);
    expect(result.targetAlly).toBe(true);
  });

  it("tickVirusStatus returns null for null input", () => {
    const result = tickVirusStatus(null);
    expect(result.status).toBeNull();
    expect(result.targetAlly).toBe(false);
  });
});

/* ─── UI SUMMARY ─── */

describe("thoughtVirus — getVirusSummary", () => {
  it("returns a UI-ready snapshot at dormant", () => {
    const summary = getVirusSummary(DEFAULT_VIRUS_STATE);
    expect(summary.stage.id).toBe("dormant");
    expect(summary.loadPct).toBe(0);
    expect(summary.residueLoggedCount).toBe(0);
    expect(summary.nextStage?.id).toBe("latent");
    expect(summary.loadUntilNextStage).toBe(20);
  });

  it("returns nextStage null at consumed", () => {
    const state = { ...DEFAULT_VIRUS_STATE, load: 100, stage: "consumed" as const };
    const summary = getVirusSummary(state);
    expect(summary.nextStage).toBeNull();
    expect(summary.loadUntilNextStage).toBe(0);
  });

  it("reflects residue counts in the snapshot", () => {
    const logged = logResidueItem(DEFAULT_VIRUS_STATE, "residue_cryo_coolant").state;
    const summary = getVirusSummary(logged);
    expect(summary.residueLoggedCount).toBe(1);
    expect(summary.residueQuarantinedCount).toBe(0);
  });
});
