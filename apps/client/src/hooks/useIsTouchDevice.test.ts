/**
 * M10 — pure-source-scan tests for `useIsTouchDevice`. Hook behaviour
 * under real `(pointer: coarse)` matchers requires a browser DOM;
 * these checks anchor the contract so a future refactor can't
 * silently regress the media-query semantics.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const src = fs.readFileSync(
  path.resolve(__dirname, "useMobile.tsx"),
  "utf-8",
);

describe("useIsTouchDevice — M10 contract", () => {
  it("is exported from the same module as useIsMobile", () => {
    expect(src).toMatch(/export function useIsTouchDevice\(\)/);
    expect(src).toMatch(/export function useIsMobile\(\)/);
  });

  it("queries the canonical (pointer: coarse) matcher", () => {
    expect(src).toContain('"(pointer: coarse)"');
  });

  it("subscribes to the matcher's change event so a Bluetooth-mouse plug-in flips state", () => {
    expect(src).toMatch(/mql\.addEventListener\(\s*"change"/);
    expect(src).toMatch(/mql\.removeEventListener\(\s*"change"/);
  });

  it("returns false in non-window environments (server / test)", () => {
    expect(src).toMatch(/typeof window === "undefined"\)\s*return false/);
  });
});

describe("M9 — global tap-highlight CSS rule", () => {
  it("the index.css ships -webkit-tap-highlight-color: transparent on every element", () => {
    const css = fs.readFileSync(
      path.resolve(__dirname, "..", "index.css"),
      "utf-8",
    );
    expect(css).toMatch(/-webkit-tap-highlight-color:\s*transparent/);
    // Anchored to the universal selector so every interactive element
    // is covered without per-component opt-in.
    expect(css).toMatch(/\*\s*\{[\s\S]*?-webkit-tap-highlight-color:\s*transparent/);
  });
});
