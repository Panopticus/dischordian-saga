import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

/**
 * Tests for the game features:
 * - Ark room listing (public)
 * - Ark progress (protected)
 * - Citizen character creation (protected)
 */

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 999,
      openId: "test-game-user",
      email: "gamer@test.com",
      name: "Test Gamer",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("ark.getRooms", () => {
  it("returns an array of rooms (public)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const rooms = await caller.ark.getRooms();
    expect(Array.isArray(rooms)).toBe(true);
  }, 15000);
});

describe("ark.getProgress", () => {
  it("returns progress for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const progress = await caller.ark.getProgress();
    expect(Array.isArray(progress)).toBe(true);
  }, 15000);
});

describe("citizen.getCharacter", () => {
  it("returns null for user without a character", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const character = await caller.citizen.getCharacter();
    // User 999 doesn't exist in DB, so should return null/undefined
    expect(character === null || character === undefined || (Array.isArray(character) && character.length === 0)).toBe(true);
  }, 15000);
});
