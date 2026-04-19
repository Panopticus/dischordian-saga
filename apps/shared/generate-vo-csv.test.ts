import { describe, expect, it, beforeAll, afterAll } from "vitest";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { generateVoCsvs } from "../scripts/generate-vo-csv";

describe("generate-vo-csv", () => {
  let tmpDir: string;
  let result: ReturnType<typeof generateVoCsvs>;

  beforeAll(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "vo-csv-"));
    result = generateVoCsvs({ outputDir: tmpDir, priority: "P1" });
  });

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("writes at least one CSV per expected bundle", () => {
    const names = result.filesWritten.map((f) => path.basename(f));
    expect(names.some((n) => n.startsWith("companion-comments__"))).toBe(true);
    expect(names.some((n) => n.startsWith("companion-ask-topics__"))).toBe(true);
    expect(names.some((n) => n.startsWith("act1-opponent-dialog__"))).toBe(true);
  });

  it("splits companion comments into at least elara + human CSVs", () => {
    const names = result.filesWritten.map((f) => path.basename(f));
    expect(names).toContain("companion-comments__elara.csv");
    expect(names).toContain("companion-comments__human.csv");
  });

  it("writes the CSV header as line 1 of every file", () => {
    for (const file of result.filesWritten) {
      const firstLine = fs.readFileSync(file, "utf-8").split("\n")[0];
      expect(firstLine).toBe(
        "id,character,voice_profile,stability,similarity,style,speaker_boost,text,direction,priority",
      );
    }
  });

  it("quotes text fields that contain commas, quotes, or SSML", () => {
    const file = result.filesWritten.find((f) =>
      f.endsWith("companion-ask-topics__elara.csv"),
    )!;
    const body = fs.readFileSync(file, "utf-8");
    // Every non-header line should start with the id field (no quote)
    // and contain at least one quoted field (text).
    const dataLines = body.split("\n").slice(1).filter((l) => l.length > 0);
    expect(dataLines.length).toBeGreaterThan(0);
    for (const line of dataLines) {
      expect(line.includes('"')).toBe(true);
    }
  });

  it("escapes inner double-quotes by doubling them (RFC 4180)", () => {
    // Craft a temp case by checking that any quote in source text
    // survives as doubled quotes in the CSV.
    const file = result.filesWritten.find((f) =>
      f.endsWith("companion-comments__human.csv"),
    )!;
    const body = fs.readFileSync(file, "utf-8");
    // The companion-comments text uses apostrophes heavily but also
    // some double quotes in turns-of-phrase. Ensure no unescaped
    // `"` appears inside a quoted text field — if it did, the CSV
    // would have an odd number of `"` on that line.
    for (const line of body.split("\n")) {
      if (line.length === 0) continue;
      const quoteCount = (line.match(/"/g) || []).length;
      expect(
        quoteCount % 2,
        `line has unbalanced quotes: ${line.slice(0, 120)}...`,
      ).toBe(0);
    }
  });

  it("emits a stable row count across runs (deterministic)", () => {
    const second = generateVoCsvs({ outputDir: tmpDir, priority: "P1" });
    expect(second.totalRows).toBe(result.totalRows);
    expect(second.filesWritten.sort()).toEqual(result.filesWritten.sort());
  });

  it("honors --priority override on every row", () => {
    const p0Dir = fs.mkdtempSync(path.join(os.tmpdir(), "vo-csv-p0-"));
    const p0 = generateVoCsvs({ outputDir: p0Dir, priority: "P0" });
    for (const file of p0.filesWritten) {
      const dataLines = fs
        .readFileSync(file, "utf-8")
        .split("\n")
        .slice(1)
        .filter((l) => l.length > 0);
      for (const line of dataLines) {
        // priority is the last field and is unquoted, so the line
        // ends with ",P0"
        expect(line.endsWith(",P0")).toBe(true);
      }
    }
    fs.rmSync(p0Dir, { recursive: true, force: true });
  });

  it("generates one Act 1 opponent CSV per distinct voice profile", () => {
    const names = result.filesWritten.map((f) => path.basename(f));
    // Elara, Human, and the opponent-voice (antiquarian placeholder
    // for Act 1 opponents — reassigned downstream by the per-opponent
    // VO pipeline). All three must exist.
    expect(names).toContain("act1-opponent-dialog__elara.csv");
    expect(names).toContain("act1-opponent-dialog__human.csv");
    expect(names).toContain("act1-opponent-dialog__antiquarian.csv");
  });
});
