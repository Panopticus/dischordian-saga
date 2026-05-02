/**
 * Invariants for apps/scripts/engineer-lines.json — every Engineer's
 * Log in the canonical ENGINEER_LOGS catalog has a corresponding
 * script JSON entry, and the entry round-trips against the source
 * transcript. Regenerate via:
 *
 *   node apps/scripts/_generate-engineer-lines.mjs
 *
 * If the test fails after a new log lands, re-run the generator and
 * re-commit the JSON.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { ENGINEER_LOGS } from "@shared/tcg-core/story/engineerLogs";

// __dirname is apps/shared/__tests__ ; the JSON lives at
// apps/scripts/engineer-lines.json (vitest doesn't include
// apps/scripts/ in its discovery glob, so the test ships under
// apps/shared/__tests__/ but reads the file by absolute path).
const ENGINEER_LINES_PATH = path.resolve(
  __dirname,
  "..",
  "..",
  "scripts",
  "engineer-lines.json",
);

interface EngineerLineEntry {
  id: string;
  text: string;
  context: string;
  emotion: string;
  file: string;
  meta?: {
    logNumber?: number;
    title?: string;
    dateStamp?: string;
    mechanicExplanation?: string;
  };
}

const entries = JSON.parse(
  fs.readFileSync(ENGINEER_LINES_PATH, "utf-8"),
) as EngineerLineEntry[];

describe("engineer-lines.json", () => {
  it("has exactly one entry per ENGINEER_LOGS catalog entry (42 expected today)", () => {
    expect(entries.length).toBe(ENGINEER_LOGS.length);
  });

  it("every entry id is the engineer_<log_id> form", () => {
    for (const e of entries) {
      expect(e.id).toMatch(/^engineer_log_/);
    }
  });

  it("entry ids are unique across the file", () => {
    const ids = entries.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every entry text is non-empty (no placeholder transcripts)", () => {
    for (const e of entries) {
      expect(e.text.length).toBeGreaterThan(50);
    }
  });

  it("text matches the canonical ENGINEER_LOGS transcript verbatim (round-trip)", () => {
    for (const log of ENGINEER_LOGS) {
      const entry = entries.find((e) => e.id === `engineer_${log.id}`);
      expect(entry, `missing entry for ${log.id}`).toBeDefined();
      expect(entry!.text).toBe(log.transcript);
    }
  });

  it("context is consistent ('engineer_log') across all entries", () => {
    for (const e of entries) {
      expect(e.context).toBe("engineer_log");
    }
  });

  it("file pointer is the canonical engineerLogs.ts source", () => {
    for (const e of entries) {
      expect(e.file).toBe("shared/tcg-core/story/engineerLogs.ts");
    }
  });

  it("every entry preserves the producer-meta sidecar (logNumber + title + dateStamp + mechanicExplanation)", () => {
    for (const e of entries) {
      expect(e.meta).toBeDefined();
      expect(typeof e.meta!.logNumber).toBe("number");
      expect(e.meta!.title).toBeTruthy();
      expect(e.meta!.dateStamp).toBeTruthy();
      expect(e.meta!.mechanicExplanation).toBeTruthy();
    }
  });

  it("[SPOKEN] / [FREESTYLE] structural tags are preserved in text (TTS pipeline + producer reads these)", () => {
    // At least the majority of logs should ship the dual-register
    // structure. Pure-spoken logs (early lab notes) are also valid.
    let withSpoken = 0;
    let withFreestyle = 0;
    for (const e of entries) {
      if (e.text.includes("[SPOKEN]")) withSpoken++;
      if (e.text.includes("[FREESTYLE]")) withFreestyle++;
    }
    expect(withSpoken).toBe(entries.length);
    // Most logs include freestyle, but some intro / outro ones may
    // not. Soft floor of half.
    expect(withFreestyle * 2).toBeGreaterThanOrEqual(entries.length);
  });
});
