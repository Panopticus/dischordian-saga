import { describe, it, expect } from "vitest";

import {
  checkStaticKey,
  decodeUnlockFlag,
  DECODE_FRAGMENTS,
  getFragment,
} from "./twoWitnessesDecode";

describe("twoWitnessesDecode registry", () => {
  it("ships five fragments", () => {
    expect(DECODE_FRAGMENTS).toHaveLength(5);
  });

  it("every fragment has a cipher hint, decoded body, and key kind", () => {
    for (const f of DECODE_FRAGMENTS) {
      expect(f.cipherHint.length).toBeGreaterThan(0);
      expect(f.decodedBody.length).toBeGreaterThan(100);
      expect(f.keyKind).toBeTruthy();
    }
  });

  it("fragment ids are unique", () => {
    const ids = DECODE_FRAGMENTS.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("getFragment returns the matching fragment", () => {
    expect(getFragment("fragment_5_signature")?.title).toBe(
      "Fragment V — The Signature",
    );
  });

  it("decodeUnlockFlag follows the two_witnesses:fragment:<id>:decoded convention", () => {
    expect(decodeUnlockFlag("fragment_1_call")).toBe(
      "two_witnesses:fragment:fragment_1_call:decoded",
    );
  });
});

describe("checkStaticKey", () => {
  it("validates phase enum keys for fragment 1", () => {
    const f = getFragment("fragment_1_call")!;
    expect(checkStaticKey(f, "dawn")).toBe(true);
    expect(checkStaticKey(f, "long_night")).toBe(true);
    expect(checkStaticKey(f, "dusk")).toBe(false);
  });

  it("validates day-count modulo keys for fragment 2", () => {
    const f = getFragment("fragment_2_witness")!;
    expect(checkStaticKey(f, 0)).toBe(true);
    expect(checkStaticKey(f, 6)).toBe(true);
    expect(checkStaticKey(f, "3")).toBe(true);
    expect(checkStaticKey(f, 7)).toBe(false);
  });
});
