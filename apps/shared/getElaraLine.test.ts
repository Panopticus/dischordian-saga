// F6 — adapter contract tests.

import { describe, it, expect } from "vitest";
import { getElaraLine, synthFromText } from "./getElaraLine";

describe("getElaraLine", () => {
  it("returns the authored record for a known Elara line id", () => {
    const line = getElaraLine("cryo_orient_01_lucid");
    expect(line).not.toBeNull();
    expect(line?.speaker).toBe("elara");
    expect(line?.text.length).toBeGreaterThan(0);
  });

  it("returns the authored record for a known Human line id", () => {
    const line = getElaraLine("human_first_words_shadow");
    expect(line).not.toBeNull();
    expect(line?.speaker).toBe("human");
  });

  it("returns null for completely unknown ids", () => {
    expect(getElaraLine("__definitely_not_a_line__")).toBeNull();
  });

  it("synthesizes a VO-only record from the manifest", () => {
    // act1_reassure is a known entry in elaraVoManifest.json but not
    // in elaraLines.ts — the adapter should hand back a minimal record.
    const line = getElaraLine("act1_reassure");
    expect(line).not.toBeNull();
    expect(line?.voId).toBe("act1_reassure");
    expect(line?.speaker).toBe("elara");
    expect(line?.text).toBe("");
  });

  it("synthFromText produces a valid ad-hoc line", () => {
    const line = synthFromText("I need a moment.", "elara");
    expect(line.speaker).toBe("elara");
    expect(line.text).toBe("I need a moment.");
    expect(line.lineId.startsWith("__synth_")).toBe(true);
  });
});
