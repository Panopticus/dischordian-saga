/**
 * Structural tests for PublicWitnessColumn (§5.7).
 * Matches the TranscriptColumn + ChoicePillar test pattern — export
 * shape, type smoke, source-scan. Visual reviewed in the PR.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import {
  PublicWitnessColumn,
  type PublicWitnessEntryView,
} from "./PublicWitnessColumn";

describe("PublicWitnessColumn", () => {
  it("exports the component as a named export", () => {
    expect(PublicWitnessColumn).toBeDefined();
    expect(typeof PublicWitnessColumn).toBe("function");
  });

  it("accepts a PublicWitnessEntryView shape (compile-time smoke)", () => {
    const e: PublicWitnessEntryView = {
      id: "e1",
      turnNumber: 3,
      publicLabel: "admission",
      publicDelta: -2,
      privateDelta: 1,
    };
    expect(e.publicLabel).toBe("admission");
  });
});

describe("PublicWitnessColumn — delegates to the shared TranscriptColumn", () => {
  const src = fs.readFileSync(
    path.resolve(__dirname, "PublicWitnessColumn.tsx"),
    "utf-8",
  );

  it("imports the shared TranscriptColumn", () => {
    expect(src).toContain('from "./TranscriptColumn"');
  });

  it("renders via <TranscriptColumn .../> — no forked markup", () => {
    expect(src).toMatch(/<TranscriptColumn\b/);
    expect(src).not.toMatch(/<div[\s\S]*?role="region"[\s\S]*?aria-label="Verdict"/);
  });

  it("passes the §5.7 chrome labels through", () => {
    expect(src).toContain('title="Verdict"');
    expect(src).toMatch(/emptyText:\s*"Awaiting the record\."|emptyText="Awaiting the record\."/);
    expect(src).toMatch(/label:\s*"Balance"/);
  });

  it("uses PUBLIC_WITNESS_THRESHOLDS.warm as the footer threshold (no magic +3)", () => {
    expect(src).toContain(
      'import { PUBLIC_WITNESS_THRESHOLDS } from "@shared/tcg-core/types/PublicWitness"',
    );
    expect(src).toContain("PUBLIC_WITNESS_THRESHOLDS.warm");
  });

  it("maps PublicWitnessEntryView → TranscriptEntry (publicLabel → label, publicDelta → delta)", () => {
    expect(src).toMatch(/label:\s*e\.publicLabel/);
    expect(src).toMatch(/delta:\s*e\.publicDelta/);
    expect(src).toMatch(/tag:\s*diverged\s*\?/);
  });
});
