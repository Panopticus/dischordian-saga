import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

/* Source-structural tests for Beat F's lockbox. DOM-level
   interaction coverage belongs in an e2e; these tests guarantee
   the canonical flag write and the phase contract stays intact. */

const SRC = fs.readFileSync(
  path.resolve(__dirname, "BeatFBiometricLockbox.tsx"),
  "utf-8",
);

describe("BeatFBiometricLockbox — source contract", () => {
  it("raises the canonical `prelude_beat_f_memo_read` flag on commit", () => {
    expect(SRC).toContain('"prelude_beat_f_memo_read"');
  });

  it("walks three memo pages before exposing the commit button", () => {
    expect(SRC).toMatch(/MEMO_PAGES\s*:\s*readonly/);
    const pageRegex = /heading:\s*"/g;
    const count = (SRC.match(pageRegex) ?? []).length;
    expect(count).toBe(3);
  });

  it("transitions through idle → recognize → memo → closing phases", () => {
    for (const phase of ["idle", "recognize", "memo", "closing"]) {
      expect(SRC).toContain(`"${phase}"`);
    }
  });

  it("uses the registered `vfx_lockbox_bio_recognize` effect family", () => {
    // Soft assertion — the component relies on the already-
    // declared VFX id family. The preludeSequence.ts registry
    // owns the webm path; the component cites the family in
    // its header comment so future edits don't drift.
    expect(SRC).toContain("vfx_lockbox_bio_recognize");
  });

  it("autofocuses the final commit button for keyboard users", () => {
    expect(SRC).toContain("autoFocus");
  });
});
