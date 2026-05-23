/**
 * Bucket-B coverage test for the consolidated VO captions manifest.
 *
 * Closes the WCAG 2.1 Level A gap: the manifest must be populated,
 * well-formed (text + lang per entry), and consistent with the
 * source line banks under apps/scripts.
 *
 * If this test fails after editing a *-lines.json file, re-run the
 * builder: `node apps/scripts/build-vo-captions-manifest.mjs`.
 */
import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import {
  VO_CAPTIONS_MANIFEST,
  getVoCaption,
  captionsCount,
  listCaptionIds,
} from "../voCaptionsManifest";

describe("voCaptionsManifest — shape", () => {
  it("is populated (audit gap closed)", () => {
    expect(captionsCount()).toBeGreaterThan(1000);
  });

  it("every entry has non-empty text + lang", () => {
    for (const [id, entry] of Object.entries(VO_CAPTIONS_MANIFEST)) {
      expect(typeof entry.text, `${id}: text not string`).toBe("string");
      expect(entry.text.length, `${id}: empty text`).toBeGreaterThan(0);
      expect(typeof entry.lang, `${id}: lang not string`).toBe("string");
      expect(entry.lang!.length, `${id}: empty lang`).toBeGreaterThan(0);
    }
  });

  it("listCaptionIds is sorted (builder normalises)", () => {
    const ids = listCaptionIds();
    const sorted = [...ids].sort();
    expect(ids).toEqual(sorted);
  });
});

describe("voCaptionsManifest — coverage against source line banks", () => {
  // Pick a few well-known line ids that have been in the codebase
  // for a long time. If the builder ever stops picking them up, we
  // want a loud failure here rather than silently broken captions.
  it("covers human-lines act-1 intro", () => {
    expect(getVoCaption("human_act1_intro")?.text).toMatch(/You can hear me/);
  });

  it("covers an act2 line", () => {
    expect(getVoCaption("human_commentary_1")?.text).toMatch(/tutorial/);
  });

  it("covers the_source dialog line that previously had a stripped bracket", () => {
    const cap = getVoCaption("the_source_dlg_past_opener_1");
    expect(cap).not.toBeNull();
    expect(cap?.text.startsWith("[")).toBe(false);
  });

  it("returns null for unknown line ids (audit-surfacing, not silent default)", () => {
    expect(getVoCaption("totally_made_up_line_id")).toBeNull();
  });
});

describe("voCaptionsManifest — builder is idempotent", () => {
  it("a fresh build produces a byte-identical file", () => {
    // Snapshot current file
    const manifestPath = path.join(
      process.cwd(),
      "apps/shared/voCaptionsManifest.json",
    );
    const before = fs.readFileSync(manifestPath, "utf8");

    // Rebuild from sources
    const { execSync } = require("node:child_process");
    execSync("node apps/scripts/build-vo-captions-manifest.mjs", {
      cwd: process.cwd(),
      stdio: "pipe",
    });
    const after = fs.readFileSync(manifestPath, "utf8");

    // Restore (in case the test corrupts state) — they should be equal
    if (before !== after) fs.writeFileSync(manifestPath, before, "utf8");
    expect(after).toBe(before);
  });
});
