import { describe, it, expect } from "vitest";
import {
  generateTotpSecret,
  generateBackupCodes,
  hashBackupCode,
  totpUri,
  verifyTotp,
} from "./totp";

// Helper: compute TOTP at a fixed time so we can assert verifyTotp
// matches our own implementation. We re-implement the inner step
// here using the same math as the module so any drift between the
// public API and the internal helper is caught.
import { createHmac } from "crypto";

function totpFor(secret: string, time: number): string {
  // Decode secret using the same base32 alphabet as the module.
  const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const cleaned = secret.replace(/=+$/, "").toUpperCase();
  let bits = 0;
  let value = 0;
  const buf: number[] = [];
  for (const c of cleaned) {
    value = (value << 5) | ALPHA.indexOf(c);
    bits += 5;
    if (bits >= 8) {
      buf.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  const counter = Math.floor(time / 1000 / 30);
  const cb = Buffer.alloc(8);
  cb.writeUInt32BE(0, 0);
  cb.writeUInt32BE(counter, 4);
  const hmac = createHmac("sha1", Buffer.from(buf)).update(cb).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binCode =
    ((hmac[offset] & 0x7f) << 24)
    | ((hmac[offset + 1] & 0xff) << 16)
    | ((hmac[offset + 2] & 0xff) << 8)
    | (hmac[offset + 3] & 0xff);
  return String(binCode % 1_000_000).padStart(6, "0");
}

describe("totp", () => {
  it("generates a 32-char base32 secret", () => {
    const s = generateTotpSecret();
    expect(s).toHaveLength(32);
    expect(s).toMatch(/^[A-Z2-7]+$/);
  });

  it("totpUri produces a valid otpauth URL", () => {
    const u = totpUri({ issuer: "Loredex", account: "user@example.com", secret: "ABCDEFGHIJ" });
    expect(u).toContain("otpauth://totp/");
    expect(u).toContain("secret=ABCDEFGHIJ");
    expect(u).toContain("issuer=Loredex");
  });

  it("verifyTotp accepts a valid current code", () => {
    const secret = generateTotpSecret();
    const now = Date.now();
    const code = totpFor(secret, now);
    expect(verifyTotp(secret, code, now)).toBe(true);
  });

  it("verifyTotp tolerates ±1 step drift", () => {
    const secret = generateTotpSecret();
    const now = Date.now();
    const past = totpFor(secret, now - 30_000);
    const future = totpFor(secret, now + 30_000);
    expect(verifyTotp(secret, past, now)).toBe(true);
    expect(verifyTotp(secret, future, now)).toBe(true);
  });

  it("verifyTotp rejects code beyond 1 step drift", () => {
    const secret = generateTotpSecret();
    const now = Date.now();
    const farPast = totpFor(secret, now - 90_000); // 3 steps ago
    expect(verifyTotp(secret, farPast, now)).toBe(false);
  });

  it("verifyTotp rejects malformed code", () => {
    const secret = generateTotpSecret();
    expect(verifyTotp(secret, "abc")).toBe(false);
    expect(verifyTotp(secret, "1234567")).toBe(false);
    expect(verifyTotp(secret, "12345")).toBe(false);
  });

  it("backup codes are 8 chars base32 each, count configurable", () => {
    const codes = generateBackupCodes(12);
    expect(codes).toHaveLength(12);
    for (const c of codes) {
      expect(c).toMatch(/^[A-Z2-7]{8}$/);
    }
  });

  it("hashBackupCode is deterministic and case-insensitive", () => {
    const a = hashBackupCode("ABCDEF12");
    const b = hashBackupCode("abcdef12");
    expect(a).toBe(b);
    expect(a).toMatch(/^[a-f0-9]{64}$/);
  });
});
