/**
 * Canonical state hash for desync detection and replay verification.
 *
 * Hashing is deterministic across both client (browser) and server (node). We
 * use a stable serialization pass (sorted keys, explicit numeric formatting)
 * followed by a pure-JS 64-bit FNV-1a digest that does not depend on
 * Node-only crypto or WebCrypto async APIs.
 *
 * FNV-1a is not cryptographically secure — that's fine. We are detecting
 * accidental desyncs, not defending against adversaries who already control
 * the match state. For adversary-resistant proofs, the server signs the
 * action log separately (out of scope here).
 *
 * The public API is `hashState(state): string`. Output is a 16-hex-char
 * string. Use `hashPrefix(state)` for the first 8 chars you attach to
 * network frames.
 */

/** Hash any serializable value into a 16-char hex string. */
export function hashState(value: unknown): string {
  const canonical = canonicalStringify(value);
  return fnv1a64Hex(canonical);
}

/** First 8 hex chars of hashState — for compact network frames. */
export function hashPrefix(value: unknown): string {
  return hashState(value).slice(0, 8);
}

/**
 * Canonical string form of any JSON-like value.
 *
 * Rules:
 *  - Objects: keys sorted lex.
 *  - Arrays: preserved in order.
 *  - Numbers: use Number.prototype.toString() with explicit '-0' collapse.
 *  - NaN, Infinity, -Infinity: forbidden (throw).
 *  - Sets and Maps: sorted by stringified key.
 *  - Dates: ISO string.
 *  - BigInt: '<value>n' string.
 *  - Functions, symbols, undefined: forbidden (throw).
 *
 * Any deviation is a desync waiting to happen, so we are strict.
 */
export function canonicalStringify(v: unknown): string {
  const out: string[] = [];
  write(v, out);
  return out.join("");
}

function write(v: unknown, out: string[]): void {
  if (v === null) {
    out.push("null");
    return;
  }
  const t = typeof v;
  if (t === "string") {
    out.push(JSON.stringify(v));
    return;
  }
  if (t === "number") {
    const n = v as number;
    if (Number.isNaN(n) || !Number.isFinite(n)) {
      throw new Error("canonicalStringify: non-finite number is forbidden");
    }
    // Collapse -0 to 0.
    out.push(Object.is(n, -0) ? "0" : n.toString());
    return;
  }
  if (t === "boolean") {
    out.push(v ? "true" : "false");
    return;
  }
  if (t === "bigint") {
    out.push(`"${(v as bigint).toString()}n"`);
    return;
  }
  if (v instanceof Date) {
    out.push(JSON.stringify(v.toISOString()));
    return;
  }
  if (Array.isArray(v)) {
    out.push("[");
    for (let i = 0; i < v.length; i++) {
      if (i > 0) out.push(",");
      write(v[i], out);
    }
    out.push("]");
    return;
  }
  if (v instanceof Map) {
    const entries: Array<[string, unknown]> = [];
    for (const [k, val] of v.entries()) {
      entries.push([typeof k === "string" ? k : canonicalStringify(k), val]);
    }
    entries.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
    out.push('{"$map":[');
    for (let i = 0; i < entries.length; i++) {
      if (i > 0) out.push(",");
      out.push("[");
      out.push(JSON.stringify(entries[i][0]));
      out.push(",");
      write(entries[i][1], out);
      out.push("]");
    }
    out.push("]}");
    return;
  }
  if (v instanceof Set) {
    const items = Array.from(v).map((x) => canonicalStringify(x));
    items.sort();
    out.push('{"$set":[');
    for (let i = 0; i < items.length; i++) {
      if (i > 0) out.push(",");
      out.push(items[i]);
    }
    out.push("]}");
    return;
  }
  if (t === "object") {
    const obj = v as Record<string, unknown>;
    const keys = Object.keys(obj).filter((k) => obj[k] !== undefined).sort();
    out.push("{");
    for (let i = 0; i < keys.length; i++) {
      if (i > 0) out.push(",");
      out.push(JSON.stringify(keys[i]));
      out.push(":");
      write(obj[keys[i]], out);
    }
    out.push("}");
    return;
  }
  if (t === "undefined" || t === "function" || t === "symbol") {
    throw new Error(`canonicalStringify: value of type '${t}' is forbidden`);
  }
  throw new Error(`canonicalStringify: unhandled value type '${t}'`);
}

/**
 * 64-bit FNV-1a digest over a UTF-8 string, returned as 16-char lowercase hex.
 *
 * Pure JS, no dependencies. Runs client and server identically.
 */
function fnv1a64Hex(s: string): string {
  // FNV-1a 64-bit parameters. We use two 32-bit halves to avoid BigInt in
  // the inner loop (BigInt is ~10x slower in hot paths in v8).
  let h1 = 0xcbf2_9ce4; // high
  let h0 = 0x8422_2325; // low
  const P1 = 0x0000_0100; // prime high
  const P0 = 0x0000_01b3; // prime low
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    // XOR byte into low. For multi-byte code points we feed the raw char
    // code; collisions against an adversary are not a concern (see module
    // doc), and this is consistent across JS engines.
    h0 ^= c & 0xff;
    if (c > 0xff) {
      h1 ^= (c >>> 8) & 0xff;
    }
    // Multiply (h1:h0) by (P1:P0) mod 2^64, using 16-bit chunks to avoid
    // JS number precision loss above 2^53.
    const a0 = h0 & 0xffff;
    const a1 = (h0 >>> 16) & 0xffff;
    const a2 = h1 & 0xffff;
    const a3 = (h1 >>> 16) & 0xffff;
    const b0 = P0 & 0xffff;
    const b1 = (P0 >>> 16) & 0xffff;
    const b2 = P1 & 0xffff;
    const b3 = (P1 >>> 16) & 0xffff;

    const c0 = a0 * b0;
    let c1 = a1 * b0 + a0 * b1;
    let c2 = a2 * b0 + a1 * b1 + a0 * b2;
    let c3 = a3 * b0 + a2 * b1 + a1 * b2 + a0 * b3;

    c1 += c0 >>> 16;
    c2 += c1 >>> 16;
    c3 += c2 >>> 16;

    h0 = ((c1 & 0xffff) << 16) | (c0 & 0xffff);
    h1 = ((c3 & 0xffff) << 16) | (c2 & 0xffff);
    // Force unsigned 32-bit.
    h0 = h0 >>> 0;
    h1 = h1 >>> 0;
  }
  return (
    h1.toString(16).padStart(8, "0") + h0.toString(16).padStart(8, "0")
  );
}
