import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

/**
 * Tests for the login album-transmission procedures
 * (transmissions.getNextAlbumTransmission + acceptAlbumTransmission).
 *
 * These run without a DB connection (DATABASE_URL unset in tests),
 * so they verify the graceful-degradation path and zod input
 * validation. Cursor-progression behavior under a real DB belongs
 * in e2e tests; the pure cursor logic is unit-tested in
 * apps/shared/albumTransmissionCursor.test.ts.
 */

function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 778,
      openId: "test-login-transmission-user",
      email: "tester@example.com",
      name: "Login Transmission Tester",
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
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as unknown as TrpcContext["res"],
  };
}

describe("transmissions.getNextAlbumTransmission", () => {
  it("returns null gracefully when DB is unavailable", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.transmissions.getNextAlbumTransmission();
    expect(result).toBeNull();
  }, 15000);
});

describe("transmissions.acceptAlbumTransmission", () => {
  it("returns { advanced: false } gracefully when DB is unavailable", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.transmissions.acceptAlbumTransmission({
      trackId: "T01",
      completed: true,
    });
    expect(result.advanced).toBe(false);
  }, 15000);

  it("returns { advanced: false } for completed=false (acceptance without completion)", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.transmissions.acceptAlbumTransmission({
      trackId: "T01",
      completed: false,
    });
    expect(result.advanced).toBe(false);
  }, 15000);

  it("rejects an unknown trackId not in the authored set", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    await expect(
      caller.transmissions.acceptAlbumTransmission({
        // @ts-expect-error — intentionally invalid for runtime zod check
        trackId: "T15",
        completed: true,
      }),
    ).rejects.toThrow();
  }, 15000);

  it("rejects an empty trackId", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    await expect(
      caller.transmissions.acceptAlbumTransmission({
        // @ts-expect-error — intentionally invalid for runtime zod check
        trackId: "",
        completed: true,
      }),
    ).rejects.toThrow();
  }, 15000);

  it("accepts every track in the authored T01-T09 set", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    for (const trackId of ["T01", "T02", "T03", "T04", "T05", "T06", "T07", "T08", "T09"] as const) {
      const result = await caller.transmissions.acceptAlbumTransmission({
        trackId,
        completed: true,
      });
      expect(result.advanced).toBe(false);
    }
  }, 30000);
});
