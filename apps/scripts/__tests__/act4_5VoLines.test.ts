/**
 * Schema + integrity pin for apps/scripts/act4_5-vo-lines.json.
 *
 * Catches the kinds of slips that don't surface until a writer or
 * engineer re-runs `pnpm tsx apps/scripts/generate-act-vo.ts
 * --act 4.5` against a live ELEVENLABS_API_KEY:
 *
 *   • Duplicate `id` (the generator's idempotency contract dedupes
 *     by id; a duplicate silently skips the second entry).
 *   • Speaker key that has no `SPEAKER_SETTINGS` entry (the
 *     generator throws at resolveSettings time).
 *   • Empty or whitespace-only `text` / missing `voiceId`.
 *   • Floor on the count — Act 4.5 ships ≥26 lines per the
 *     authoring brief (3 starter + 23 new). A regression that drops
 *     entries should show up here, not at generation time.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

interface VoLine {
  id: string;
  speaker: string;
  voiceId: string;
  text: string;
  context: string;
  section: string;
  emotion: string;
  outputDir: string;
}

const LINES_PATH = join(__dirname, "..", "act4_5-vo-lines.json");
const LINES: VoLine[] = JSON.parse(readFileSync(LINES_PATH, "utf-8"));

// Mirrors the SPEAKER_SETTINGS keys in generate-act-vo.ts. Kept as a
// duplicate constant rather than imported so this test does not pull
// the generator's `fetch`-using module graph into vitest.
const KNOWN_SPEAKERS = new Set<string>([
  "elara",
  "human",
  "narrator",
  "zephyr_9",
  "game_master_left",
  "game_master_right",
  "the_eyes",
  "kael_prisoner",
  "iron_lion",
  "agent_zero",
  "vex_solene",
  "engineer_recall",
  "both_narrators",
  "the_antiquarian",
  "locke",
  "orin_fell",
  "the_source",
  "the_architect",
  "mol_garath",
  "degen",
  "dmc_clone_companion",
]);

describe("act4_5-vo-lines.json", () => {
  it("ships at least the 26 authored lines from the brief", () => {
    expect(LINES.length).toBeGreaterThanOrEqual(26);
  });

  it("has a unique id on every entry", () => {
    const ids = LINES.map((l) => l.id);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(dupes).toEqual([]);
  });

  it("uses speakers registered in SPEAKER_SETTINGS", () => {
    const offenders = LINES.filter((l) => !KNOWN_SPEAKERS.has(l.speaker)).map(
      (l) => `${l.id} (${l.speaker})`,
    );
    expect(offenders).toEqual([]);
  });

  it("requires non-empty text and a plausible voiceId per line", () => {
    for (const line of LINES) {
      expect(line.text.trim(), `${line.id} text`).not.toBe("");
      expect(line.voiceId, `${line.id} voiceId`).toMatch(/^[A-Za-z0-9]{16,}$/);
    }
  });

  it("uses the canonical audio/act4_5 outputDir", () => {
    const offenders = LINES.filter((l) => l.outputDir !== "audio/act4_5").map(
      (l) => l.id,
    );
    expect(offenders).toEqual([]);
  });

  it("covers all three surfaces from the authoring brief", () => {
    const sections = LINES.map((l) => l.section);
    expect(sections.some((s) => s.startsWith("§4.5.3"))).toBe(true);
    expect(sections.some((s) => s.startsWith("§4.5.4"))).toBe(true);
    expect(sections.some((s) => s.startsWith("§4.5.5"))).toBe(true);
  });

  it("has at least one line for each newly-added speaker (degen, dmc_clone_companion)", () => {
    const speakers = new Set(LINES.map((l) => l.speaker));
    expect(speakers.has("degen")).toBe(true);
    expect(speakers.has("dmc_clone_companion")).toBe(true);
  });
});
