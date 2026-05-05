/**
 * TOTP (RFC 6238) — self-contained implementation, no SDK dep.
 *
 * Uses Node's crypto for HMAC. 30-second window, 6-digit code,
 * SHA-1 (the de-facto standard supported by every authenticator
 * app — Google Authenticator, Authy, 1Password, Bitwarden, etc.).
 *
 * Backup codes ship alongside: 8-character base32 strings that each
 * accept-and-burn once when the user can't reach their authenticator.
 */
import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";

const STEP_SECONDS = 30;
const DIGITS = 6;
const ALGORITHM = "sha1";

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

/** Generate a 20-byte random secret, base32-encoded — 32 chars. */
export function generateTotpSecret(): string {
  return base32Encode(randomBytes(20));
}

/**
 * Build the otpauth URL the user pastes into their authenticator app
 * (or scans as a QR code).
 *
 * Example:
 *   otpauth://totp/Loredex:user@example.com?secret=ABCD...&issuer=Loredex
 */
export function totpUri(opts: {
  issuer: string;
  account: string;
  secret: string;
}): string {
  const label = encodeURIComponent(`${opts.issuer}:${opts.account}`);
  const params = new URLSearchParams({
    secret: opts.secret,
    issuer: opts.issuer,
    algorithm: "SHA1",
    digits: String(DIGITS),
    period: String(STEP_SECONDS),
  });
  return `otpauth://totp/${label}?${params.toString()}`;
}

/**
 * Verify a 6-digit code against a base32 secret. Allows a ±1
 * step drift to handle clock skew between server and authenticator.
 */
export function verifyTotp(secret: string, code: string, now: number = Date.now()): boolean {
  const cleaned = code.replace(/\s+/g, "");
  if (!/^\d{6}$/.test(cleaned)) return false;
  const decodedSecret = base32Decode(secret);
  const counter = Math.floor(now / 1000 / STEP_SECONDS);
  for (let drift = -1; drift <= 1; drift++) {
    const expected = totpAt(decodedSecret, counter + drift);
    if (constantTimeStringEq(expected, cleaned)) return true;
  }
  return false;
}

function totpAt(secret: Buffer, counter: number): string {
  const buf = Buffer.alloc(8);
  // Big-endian 64-bit counter — JS numbers can't natively express
  // values >= 2^53, but counters within the next ~285 million years
  // fit in 32 bits, so the high 32 bits stay zero.
  buf.writeUInt32BE(0, 0);
  buf.writeUInt32BE(counter, 4);
  const hmac = createHmac(ALGORITHM, secret).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binCode =
    ((hmac[offset] & 0x7f) << 24)
    | ((hmac[offset + 1] & 0xff) << 16)
    | ((hmac[offset + 2] & 0xff) << 8)
    | (hmac[offset + 3] & 0xff);
  const mod = 10 ** DIGITS;
  return String(binCode % mod).padStart(DIGITS, "0");
}

function constantTimeStringEq(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

/* ─── Backup codes ─── */

/**
 * Generate N backup codes. Each is a base32 8-character string.
 * Display once, store HASHED on the server (sha256-hex). On use,
 * hash the submitted code and look up — burn-after-read.
 */
export function generateBackupCodes(count = 10): string[] {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    out.push(base32Encode(randomBytes(5))); // 5 bytes → 8 base32 chars
  }
  return out;
}

export function hashBackupCode(code: string): string {
  return createHash("sha256").update(code.toUpperCase()).digest("hex");
}

/* ─── base32 (RFC 4648) ─── */

function base32Encode(buf: Buffer): string {
  let bits = 0;
  let value = 0;
  let out = "";
  for (let i = 0; i < buf.length; i++) {
    value = (value << 8) | buf[i];
    bits += 8;
    while (bits >= 5) {
      out += BASE32_ALPHABET[(value >>> (bits - 5)) & 0x1f];
      bits -= 5;
    }
  }
  if (bits > 0) {
    out += BASE32_ALPHABET[(value << (5 - bits)) & 0x1f];
  }
  return out;
}

function base32Decode(input: string): Buffer {
  const cleaned = input.replace(/=+$/, "").toUpperCase();
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (let i = 0; i < cleaned.length; i++) {
    const idx = BASE32_ALPHABET.indexOf(cleaned[i]);
    if (idx < 0) throw new Error("Invalid base32 character");
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}
