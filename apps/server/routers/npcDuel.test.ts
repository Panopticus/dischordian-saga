/**
 * NPC duel router — smoke tests + behavior tests for the procedures
 * that don't require a live DB.
 *
 * Database-bound behavior (the actual reward grant fan-out and flag
 * writes) is exercised by integration tests with DATABASE_URL set
 * — this file just verifies router registration + input schema +
 * the no-deck refusal path.
 */
import { describe, expect, it } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId = 999): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "oauth",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    deletedAt: null,
    signupWeek: null,
    installSource: null,
    abVariant: null,
    dateOfBirth: null,
    ageVerificationCountry: null,
    ageVerifiedAt: null,
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

describe("npcDuel router — registration", () => {
  it("is registered under appRouter.npcDuel", () => {
    expect((appRouter as unknown as { _def: { procedures: Record<string, unknown> } })._def.procedures).toBeDefined();
    const caller = appRouter.createCaller(createAuthContext(1));
    expect(typeof caller.npcDuel.getChallengeInfo).toBe("function");
    expect(typeof caller.npcDuel.recordVictory).toBe("function");
    expect(typeof caller.npcDuel.listChallengeable).toBe("function");
  });
});

// NPCs that have NOT been authored into NPC_DECK_REGISTRY yet — used
// as canary inputs to verify the router refuses non-challengeable
// NPCs. Update this list as more NPCs land via AUTHORING.md.
const UNAUTHORED_NPCS = ["jericho_jones", "drael_mon", "nilmorg"] as const;

describe("npcDuel.getChallengeInfo — input validation", () => {
  it("refuses npcKeys not in NPC_DECK_REGISTRY", async () => {
    const caller = appRouter.createCaller(createAuthContext(1));
    await expect(
      caller.npcDuel.getChallengeInfo({ npcKey: UNAUTHORED_NPCS[0] }),
    ).rejects.toThrow();
  });

  it("refuses unknown / malformed npcKeys", async () => {
    const caller = appRouter.createCaller(createAuthContext(1));
    await expect(
      caller.npcDuel.getChallengeInfo({ npcKey: "totally_made_up_npc" }),
    ).rejects.toThrow();
  });
});

describe("npcDuel.recordVictory — input validation", () => {
  it("refuses npcKeys not in NPC_DECK_REGISTRY", async () => {
    const caller = appRouter.createCaller(createAuthContext(1));
    await expect(
      caller.npcDuel.recordVictory({ npcKey: UNAUTHORED_NPCS[1] }),
    ).rejects.toThrow();
  });
});

describe("npcDuel.recordLoss — input validation", () => {
  it("is registered as a callable mutation", () => {
    const caller = appRouter.createCaller(createAuthContext(1));
    expect(typeof caller.npcDuel.recordLoss).toBe("function");
  });

  it("refuses npcKeys not in NPC_DECK_REGISTRY", async () => {
    const caller = appRouter.createCaller(createAuthContext(1));
    await expect(
      caller.npcDuel.recordLoss({ npcKey: UNAUTHORED_NPCS[2] }),
    ).rejects.toThrow();
  });
});
