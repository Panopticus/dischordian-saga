import { describe, it, expect, beforeEach } from "vitest";
import {
  useVortexIncursionStore,
  getVortexSnapshot,
  getActiveVortexProgress,
} from "./vortexIncursionStore";

describe("vortexIncursionStore", () => {
  beforeEach(() => {
    useVortexIncursionStore.getState().reset();
  });

  it("starts with no active run and zeroed stats", () => {
    const snap = getVortexSnapshot();
    expect(snap.activeRun).toBeNull();
    expect(snap.stats.runsCompleted).toBe(0);
    expect(snap.stats.roomsCleared).toBe(0);
    expect(snap.stats.coresReached).toBe(0);
  });

  it("startRun produces a run with 10 Vortex rooms", () => {
    const run = useVortexIncursionStore.getState().startRun("player_1");
    expect(run.rooms.length).toBe(10);
    expect(run.rooms[0].def.key).toBe("vortex_approach_1");
    expect(getVortexSnapshot().activeRun).not.toBeNull();
  });

  it("clearCurrentRoom advances the active run and increments stats", () => {
    useVortexIncursionStore.getState().startRun("player_1");
    useVortexIncursionStore.getState().clearCurrentRoom(1000);
    const snap = getVortexSnapshot();
    expect(snap.activeRun?.currentRoomIndex).toBe(1);
    expect(snap.activeRun?.rooms[0].cleared).toBe(true);
    expect(snap.stats.roomsCleared).toBe(1);
  });

  it("clearCurrentRoom is a no-op when no run is active", () => {
    useVortexIncursionStore.getState().clearCurrentRoom(500);
    const snap = getVortexSnapshot();
    expect(snap.activeRun).toBeNull();
    expect(snap.stats.roomsCleared).toBe(0);
  });

  it("completing all ten rooms increments runsCompleted and coresReached", () => {
    useVortexIncursionStore.getState().startRun("player_1");
    for (let i = 0; i < 10; i++) {
      useVortexIncursionStore.getState().clearCurrentRoom(1000);
    }
    const snap = getVortexSnapshot();
    expect(snap.stats.runsCompleted).toBe(1);
    expect(snap.stats.coresReached).toBe(1);
    expect(snap.stats.lastRunLightEnergy).toBeGreaterThan(0);
  });

  it("abandonRun clears the active run without incrementing runsCompleted", () => {
    useVortexIncursionStore.getState().startRun("player_1");
    useVortexIncursionStore.getState().clearCurrentRoom(1000);
    useVortexIncursionStore.getState().abandonRun();
    const snap = getVortexSnapshot();
    expect(snap.activeRun).toBeNull();
    expect(snap.stats.runsCompleted).toBe(0);
    // rooms cleared counter persists — the player still did the work
    expect(snap.stats.roomsCleared).toBe(1);
  });

  it("getActiveVortexProgress tracks cleared rooms in the active run", () => {
    expect(getActiveVortexProgress()).toBe(0);
    useVortexIncursionStore.getState().startRun("player_1");
    expect(getActiveVortexProgress()).toBe(0);
    useVortexIncursionStore.getState().clearCurrentRoom(1000);
    useVortexIncursionStore.getState().clearCurrentRoom(1000);
    useVortexIncursionStore.getState().clearCurrentRoom(1000);
    expect(getActiveVortexProgress()).toBe(3);
  });

  it("reset clears both active run and stats", () => {
    useVortexIncursionStore.getState().startRun("player_1");
    useVortexIncursionStore.getState().clearCurrentRoom(1000);
    useVortexIncursionStore.getState().reset();
    const snap = getVortexSnapshot();
    expect(snap.activeRun).toBeNull();
    expect(snap.stats.runsCompleted).toBe(0);
    expect(snap.stats.roomsCleared).toBe(0);
  });
});
