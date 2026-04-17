/**
 * Structural tests for TranscriptColumn + TrialTranscriptColumn.
 *
 * Matches the minimal client-side component-test pattern (see
 * ChoicePillarLightDark.test.tsx) — assert export shape, that the
 * component is a function, and source-scan the refactor boundary.
 * Visual is reviewed in the PR.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { TranscriptColumn, type TranscriptEntry } from "./TranscriptColumn";
import {
  TrialTranscriptColumn,
  type TrialTranscriptEntry,
} from "./TrialTranscriptColumn";

describe("TranscriptColumn", () => {
  it("exports the component as a named export", () => {
    expect(TranscriptColumn).toBeDefined();
    expect(typeof TranscriptColumn).toBe("function");
  });

  it("exports the TranscriptEntry type (compile-time only; smoke-test the shape)", () => {
    const e: TranscriptEntry = {
      id: "e1",
      label: "A play",
      delta: -2,
      tag: "p3",
    };
    expect(e.id).toBe("e1");
  });
});

describe("TrialTranscriptColumn — §5.8 wrapper", () => {
  it("exports the component as a named export", () => {
    expect(TrialTranscriptColumn).toBeDefined();
    expect(typeof TrialTranscriptColumn).toBe("function");
  });

  it("preserves the TrialTranscriptEntry shape consumers depend on", () => {
    // DuelystGameUI imports this type; changing it breaks §5.8 wiring.
    const e: TrialTranscriptEntry = {
      id: "e1",
      cardName: "Three Moves",
      phaseNumber: 3,
      delta: 2,
    };
    expect(e.cardName).toBe("Three Moves");
  });
});

describe("TrialTranscriptColumn — delegates to the shared TranscriptColumn", () => {
  const src = fs.readFileSync(
    path.resolve(__dirname, "TrialTranscriptColumn.tsx"),
    "utf-8",
  );

  it("imports TranscriptColumn from the shared module", () => {
    expect(src).toContain('from "./TranscriptColumn"');
    expect(src).toContain("TranscriptColumn");
  });

  it("renders via <TranscriptColumn .../> — no forked markup", () => {
    expect(src).toMatch(/<TranscriptColumn\b/);
    // No raw <div role="region"> — that chrome lives in the shared
    // component. If someone re-inlines it, this check fails loudly.
    expect(src).not.toMatch(/<div[\s\S]*?role="region"[\s\S]*?aria-label="Trial transcript"/);
  });

  it("passes the §5.8 chrome labels through", () => {
    expect(src).toContain('title="Trial transcript"');
    expect(src).toContain('separatorText="— trial convened —"');
    expect(src).toMatch(/label:\s*"Balance"/);
  });

  it("maps TrialTranscriptEntry → TranscriptEntry (phaseNumber → p{N} tag)", () => {
    // The §5.8 entry uses cardName + phaseNumber; the generic entry
    // wants label + tag. Without this mapping the column would
    // render differently — the map function is the contract.
    expect(src).toMatch(/label:\s*e\.cardName/);
    expect(src).toMatch(/tag:\s*`p\$\{e\.phaseNumber\}`/);
    expect(src).toMatch(/delta:\s*e\.delta/);
  });
});

describe("TranscriptColumn — accepts §5.7-shaped use (type-shape only)", () => {
  it("a TranscriptEntry without a tag is a valid row shape", () => {
    // The §5.7 Public-witness verdict stream won't have a phase
    // number to show — just a label + delta. If the tag ever becomes
    // required, this test fails at compile time.
    const entry: TranscriptEntry = {
      id: "w1",
      label: "Public witness: First speaker",
      delta: 1,
    };
    expect(entry.tag).toBeUndefined();
  });

  it("a TranscriptEntry with a tag also typechecks", () => {
    const entry: TranscriptEntry = {
      id: "w2",
      label: "Public witness: Second speaker",
      delta: -1,
      tag: "t3",
    };
    expect(entry.tag).toBe("t3");
  });
});
