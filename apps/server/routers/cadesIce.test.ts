/**
 * TURN credential mint tests.
 */
import { describe, it, expect } from "vitest";
import { mintTurnCredentials } from "./cadesIce";
import { createHmac } from "crypto";

describe("mintTurnCredentials", () => {
  const SECRET = "test-static-auth-secret";

  it("produces username = expiry:userId", () => {
    const r = mintTurnCredentials({ userId: 42, ttlSec: 3600, staticAuthSecret: SECRET });
    const [expiry, userId] = r.username.split(":");
    expect(Number(userId)).toBe(42);
    expect(Number(expiry)).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  it("expiresAt matches the username expiry timestamp", () => {
    const r = mintTurnCredentials({ userId: 1, ttlSec: 600, staticAuthSecret: SECRET });
    const [expiry] = r.username.split(":");
    expect(r.expiresAt).toBe(Number(expiry));
  });

  it("credential is the HMAC-SHA1 of the username, base64-encoded", () => {
    const r = mintTurnCredentials({ userId: 7, ttlSec: 900, staticAuthSecret: SECRET });
    const expected = createHmac("sha1", SECRET).update(r.username).digest("base64");
    expect(r.credential).toBe(expected);
  });

  it("different userIds produce different credentials", () => {
    const a = mintTurnCredentials({ userId: 1, ttlSec: 3600, staticAuthSecret: SECRET });
    const b = mintTurnCredentials({ userId: 2, ttlSec: 3600, staticAuthSecret: SECRET });
    expect(a.credential).not.toBe(b.credential);
  });

  it("different secrets produce different credentials for the same user", () => {
    const a = mintTurnCredentials({ userId: 1, ttlSec: 3600, staticAuthSecret: "alpha" });
    const b = mintTurnCredentials({ userId: 1, ttlSec: 3600, staticAuthSecret: "beta" });
    expect(a.credential).not.toBe(b.credential);
  });

  it("ttlSec of 60 is honored", () => {
    const r = mintTurnCredentials({ userId: 1, ttlSec: 60, staticAuthSecret: SECRET });
    const now = Math.floor(Date.now() / 1000);
    expect(r.expiresAt - now).toBeLessThanOrEqual(61);
    expect(r.expiresAt - now).toBeGreaterThanOrEqual(59);
  });
});
