import { describe, it, expect } from "vitest";
import { LEGACY_ANY_ALLOWLIST } from "../eslint.legacy-any-allowlist.js";

/* ═══════════════════════════════════════════════════════
   Ratchet test for @typescript-eslint/no-explicit-any
   ───────────────────────────────────────────────────────
   The baseline count is the number of grandfathered files
   when the rule was turned on. Adding a new entry requires
   also bumping the baseline here, which surfaces in PR
   review — making sure new `any` introductions are a
   conscious decision and not silently grandfathered.

   To shrink: clean up the file, remove it from
   eslint.legacy-any-allowlist.js, and drop the baseline
   here by the same amount in the same PR.
   ═══════════════════════════════════════════════════════ */

// Baseline set when the rule was turned on. ONLY shrink.
const BASELINE_COUNT = 167;

describe("@typescript-eslint/no-explicit-any — legacy allowlist ratchet", () => {
  it("allowlist never grows above baseline", () => {
    expect(LEGACY_ANY_ALLOWLIST.length).toBeLessThanOrEqual(BASELINE_COUNT);
  });

  it("baseline reflects current allowlist size (keep in sync)", () => {
    // If this fails, either (a) you shrank the list — update BASELINE_COUNT
    // down to match, or (b) you grew the list — don't do that.
    expect(LEGACY_ANY_ALLOWLIST.length).toBe(BASELINE_COUNT);
  });

  it("has no duplicate entries", () => {
    const set = new Set(LEGACY_ANY_ALLOWLIST);
    expect(set.size).toBe(LEGACY_ANY_ALLOWLIST.length);
  });
});
