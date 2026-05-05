/**
 * Shape-only test for syncCrewStateToTables.
 *
 * A full integration test would require an in-memory drizzle
 * adapter or a live MySQL; we don't have either in the test
 * environment. Instead we verify:
 *   1. The module exports the function.
 *   2. It accepts a well-formed CrewState without throwing
 *      type errors at the call site (compile-level check).
 *   3. It handles the getDb() → null path gracefully (the
 *      router sets it as fire-and-forget, so failures should
 *      be caught internally and not bubble).
 *
 * The getDb() dependency is resolved lazily inside the function,
 * so when DATABASE_URL is unset (as in tests) it returns null
 * and the function short-circuits. Any error path is caught by
 * the top-level try/catch in syncCrewStateToTables itself.
 */
import { describe, it, expect } from "vitest";
import { syncCrewStateToTables } from "./crewTableSync";
import { createDefaultCrewState } from "../../shared/crewPersistence";

describe("syncCrewStateToTables", () => {
  it("is exported as an async function", () => {
    expect(syncCrewStateToTables).toBeDefined();
    expect(typeof syncCrewStateToTables).toBe("function");
  });

  it("resolves without throwing when the DB is unavailable (test env)", async () => {
    const state = createDefaultCrewState();
    await expect(syncCrewStateToTables(1, state)).resolves.toBeUndefined();
  });

  it("resolves without throwing when the state contains crew members", async () => {
    const state = createDefaultCrewState();
    state.crewSystemUnlocked = true;
    state.roster.members.push({
      id: "crew-test-1",
      name: "Test Subject",
      nickname: null,
      species: "human",
      gender: "non-binary",
      bloodlineId: "void_resonance",
      generation: 1,
      parentIds: null,
      children: [],
      geneticTraits: ["hardy"],
      role: null,
      stats: {
        resilience: 60,
        intellect: 60,
        reflexes: 60,
        empathy: 60,
        immunity: 60,
        adaptability: 60,
      },
      morale: 70,
      health: 100,
      loyalty: 50,
      status: "active",
      age: 20,
      maxAge: 80,
      missionHistory: [],
      relationships: {},
      birthCycle: 0,
      isFounder: true,
    });
    await expect(syncCrewStateToTables(1, state)).resolves.toBeUndefined();
  });
});
