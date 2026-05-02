/* ═══════════════════════════════════════════════════════
   Sanity tests for the Architect VO line transcripts.
   Validates that:
     - the JSON parses
     - every cue id in apps/shared/architectVoManifest.json has a
       paired transcript in apps/scripts/architect-lines.json
     - no transcript contains a forbidden token from the
       dialog-bank red list
     - every transcript has a non-empty `text` field
   ═══════════════════════════════════════════════════════ */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { FORBIDDEN_TOKENS } from "./architectGovernanceVoices";

interface ArchitectLineEntry {
  id: string;
  text: string;
  context?: string;
  emotion?: string;
  voice?: string;
  philosopher?: string;
  file?: string;
  notes?: string;
}

function loadLines(): ArchitectLineEntry[] {
  const path = resolve(__dirname, "../scripts/architect-lines.json");
  const raw = readFileSync(path, "utf-8");
  const parsed = JSON.parse(raw);
  expect(Array.isArray(parsed)).toBe(true);
  return parsed as ArchitectLineEntry[];
}

function loadManifest(): Record<string, string> {
  const path = resolve(__dirname, "./architectVoManifest.json");
  const raw = readFileSync(path, "utf-8");
  return JSON.parse(raw) as Record<string, string>;
}

describe("architect VO transcripts", () => {
  it("ships exactly one transcript per recorded cue id in the manifest", () => {
    const lines = loadLines();
    const manifest = loadManifest();
    const lineIds = new Set(lines.map(l => l.id));
    const manifestIds = Object.keys(manifest);
    for (const id of manifestIds) {
      expect(lineIds, `missing transcript for cue ${id}`).toContain(id);
    }
    // Every transcript should map back to a known recording.
    for (const line of lines) {
      expect(manifestIds, `unknown cue id ${line.id}`).toContain(line.id);
    }
  });

  it("every transcript has non-empty text", () => {
    const lines = loadLines();
    for (const line of lines) {
      expect(line.text, `empty text for ${line.id}`).toBeTruthy();
      expect(line.text.length).toBeGreaterThan(20);
    }
  });

  it("no transcript contains a forbidden token from the dialog-bank red list", () => {
    const lines = loadLines();
    for (const line of lines) {
      for (const token of FORBIDDEN_TOKENS) {
        expect(
          line.text,
          `cue ${line.id} contains forbidden token "${token}"`,
        ).not.toContain(token);
      }
    }
  });

  it("every transcript declares the philosopher cadence(s) it bends from", () => {
    const lines = loadLines();
    for (const line of lines) {
      expect(line.philosopher, `cue ${line.id} missing philosopher metadata`).toBeTruthy();
    }
  });
});
