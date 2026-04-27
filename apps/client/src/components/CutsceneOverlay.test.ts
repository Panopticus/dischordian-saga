/**
 * Captions + aria-live wiring guard for CutsceneOverlay (#116).
 *
 * The cutscene dialog box is the canonical caption surface for the
 * 46-cutscene backlog: it carries an `aria-live="polite"` region so
 * screen readers announce each line, and a `caption-label` span that
 * surfaces sound-effect cues to deaf / hard-of-hearing players when
 * they enable captions in Settings (toggles `html.captions-on`, see
 * apps/client/src/lib/settingsSync.ts → applySettingsToDOM).
 *
 * The wiring is small and easy to lose under future refactors —
 * this test pins it down with both a pure-function check on
 * `effectCaption` and a static-analysis pass against the JSX so the
 * aria-live region and `caption-label` span don't silently disappear.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { effectCaption } from "./CutsceneOverlay";

const ROOT = process.cwd();
const SOURCE = fs.readFileSync(
  path.resolve(ROOT, "apps/client/src/components/CutsceneOverlay.tsx"),
  "utf-8",
);

describe("CutsceneOverlay — effectCaption", () => {
  // The 5 effect tags are the union from CutsceneLine["effect"].
  // Every branch must produce a non-empty bracketed cue so screen
  // readers and the visible caption-label both have something to
  // surface. Anything that returns "" or undefined breaks the
  // hearing-accessibility contract for that effect.
  it.each([
    ["shake", "[ IMPACT ]"],
    ["flash", "[ FLASH ]"],
    ["fadeToBlack", "[ FADE TO BLACK ]"],
    ["glitch", "[ STATIC INTERFERENCE ]"],
    ["pulse", "[ SOFT EMPHASIS ]"],
  ] as const)("maps %s → %s", (effect, expected) => {
    expect(effectCaption(effect)).toBe(expected);
  });

  it("every caption is wrapped in [ … ] so it visually parses as a sound cue", () => {
    for (const effect of ["shake", "flash", "fadeToBlack", "glitch", "pulse"] as const) {
      const caption = effectCaption(effect);
      expect(caption.startsWith("["), `${effect} caption must open with [`).toBe(true);
      expect(caption.endsWith("]"), `${effect} caption must close with ]`).toBe(true);
      expect(caption.length, `${effect} caption must be non-trivial`).toBeGreaterThan(2);
    }
  });
});

describe("CutsceneOverlay — aria-live + caption-label wiring", () => {
  it("dialog wrapper is an aria-live polite region", () => {
    expect(SOURCE).toMatch(/role=["']region["']/);
    expect(SOURCE).toMatch(/aria-live=["']polite["']/);
    expect(SOURCE).toMatch(/aria-atomic=["']true["']/);
    expect(SOURCE).toMatch(/aria-label=["']Cutscene dialog["']/);
  });

  it("renders a caption-label span fed by effectCaption when an effect is set", () => {
    expect(SOURCE).toMatch(/className=["'][^"']*\bcaption-label\b/);
    expect(SOURCE).toMatch(/effectCaption\s*\(\s*currentLine\.effect\s*\)/);
  });

  it("the caption-label carries an aria-label so screen readers announce 'Sound effect: …'", () => {
    expect(SOURCE).toMatch(/aria-label=\{`Sound effect:\s*\$\{effectCaption\(currentLine\.effect\)\}`\}/);
  });

  it("speaker name remains always-visible (not gated on captions)", () => {
    // Captions are an *additive* surface — they reveal extra cues.
    // The base speaker label is read by everyone (it's the primary
    // narrative scaffold). Regression-guard: nobody wraps the speaker
    // span in `caption-label` accidentally.
    const speakerSpanMatch = SOURCE.match(
      /\{currentLine\.speaker\}[\s\S]{0,200}/,
    );
    expect(speakerSpanMatch).not.toBeNull();
    expect(
      speakerSpanMatch![0].includes("caption-label"),
      "speaker label must not be gated behind captions-on",
    ).toBe(false);
  });
});
