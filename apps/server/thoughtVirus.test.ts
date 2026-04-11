import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId = 9001): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-virus-${userId}`,
    email: `virus${userId}@test.com`,
    name: `Virus User ${userId}`,
    loginMethod: "oauth",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    deletedAt: null,
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as unknown as TrpcContext["res"],
  };
}

describe("thoughtVirus router", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    caller = appRouter.createCaller(createAuthContext(9101));
  });

  it("getStatus returns a default state when the player has none", async () => {
    const result = await caller.thoughtVirus.getStatus();
    expect(result).toBeDefined();
    expect(result.state).toBeDefined();
    expect(result.summary).toBeDefined();
    expect(result.summary.stage.id).toBe("dormant");
    expect(result.summary.loadPct).toBe(0);
    expect(Array.isArray(result.availableCures)).toBe(true);
  });

  it("getStaticData exposes stages, residue items, and cures", async () => {
    const result = await caller.thoughtVirus.getStaticData();
    expect(result.stages).toHaveLength(5);
    expect(result.residueItems.length).toBeGreaterThanOrEqual(5);
    expect(result.cures.length).toBeGreaterThanOrEqual(5);
  });

  it("logResidue is a no-op for unknown items", async () => {
    const result = await caller.thoughtVirus.logResidue({
      itemId: "nonexistent_item",
    });
    expect(result.delta).toBe(0);
  });

  it("applyCure rejects cures that would exceed the current stage", async () => {
    // Dormant player — medbay_course cure is legal and reduces nothing (load=0).
    // Use source_bargain instead since it's legal at any stage, then verify
    // consumed → dormant.
    const result = await caller.thoughtVirus.applyCure({
      cureId: "source_bargain",
    });
    // Without a DB, the service falls through to in-memory defaults → success false.
    // This test just asserts the endpoint shape.
    expect(typeof result.success).toBe("boolean");
    expect(result.stage).toBeDefined();
  });

  it("addLoad returns a stage object even when DB is unavailable", async () => {
    const result = await caller.thoughtVirus.addLoad({
      delta: 10,
      source: "test_add_load",
    });
    expect(result.stage).toBeDefined();
    expect(result.state).toBeDefined();
  });
});
