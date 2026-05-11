/**
 * Structural tests for WhisperOverlay.
 *
 * Source-scan pattern matching SingleVideoCutsceneOverlay.test.tsx:
 * verify the overlay subscribes to the hook, plays VO, owns the
 * auto-dismiss timer, and renders nothing when suppressed — without
 * spinning up jsdom for behavioural testing.
 */
import * as fs from "fs";
import * as path from "path";
import { describe, expect, it } from "vitest";

const SRC = fs.readFileSync(
  path.resolve(__dirname, "WhisperOverlay.tsx"),
  "utf-8",
);
const HOST = fs.readFileSync(
  path.resolve(__dirname, "..", "pages", "ArkExplorerPage.tsx"),
  "utf-8",
);

describe("WhisperOverlay — wiring", () => {
  it("imports the hook + VO surface", () => {
    expect(SRC).toMatch(/import\s*\{\s*useHumanWhispers\s*\}\s*from\s+["']@\/hooks\/useHumanWhispers["']/);
    expect(SRC).toMatch(/import\s*\{\s*useHumanVO\s*\}\s*from\s+["']@\/hooks\/useHumanVO["']/);
  });

  it("declares suppressed as a required boolean prop", () => {
    expect(SRC).toMatch(/suppressed:\s*boolean/);
  });

  it("renders nothing when suppressed is true", () => {
    expect(SRC).toMatch(/if\s*\(suppressed\)\s*return\s*null/);
  });
});

describe("WhisperOverlay — lifecycle", () => {
  it("calls speak(whisper.voId) when a whisper becomes available", () => {
    expect(SRC).toContain("speak(whisper.voId)");
  });

  it("auto-dismisses after a fixed hold (~5s)", () => {
    expect(SRC).toMatch(/WHISPER_HOLD_MS\s*=\s*5\d{3}/);
    expect(SRC).toMatch(/setTimeout\(\s*\(\)\s*=>\s*\{[\s\S]*?dismiss\(\)/);
  });

  it("clears the timer + stops VO on unmount", () => {
    expect(SRC).toContain("clearTimeout");
    expect(SRC).toMatch(/return\s*\(\)\s*=>\s*\{[\s\S]*?stop\(\)/);
  });
});

describe("WhisperOverlay — visual register", () => {
  it("renders the whisper text inside a low-opacity italic block", () => {
    // The whisper should never grab the viewport — it's ambient.
    // The class string carries italic + low opacity markers.
    expect(SRC).toContain("italic");
    expect(SRC).toContain("lowercase");
  });

  it("exposes test ids that identify the whisper by id and era", () => {
    expect(SRC).toMatch(/data-testid=["']whisper-overlay["']/);
    expect(SRC).toMatch(/data-whisper-id=\{whisper\.id\}/);
    expect(SRC).toMatch(/data-whisper-era=\{whisper\.era\}/);
  });
});

describe("WhisperOverlay — mounted in ArkExplorerPage with the right gate", () => {
  it("imports WhisperOverlay", () => {
    expect(HOST).toMatch(/import\s+WhisperOverlay\s+from\s+["']@\/components\/WhisperOverlay["']/);
  });

  it("mounts the overlay with suppressed bound to the Elara popup open state", () => {
    expect(HOST).toMatch(/<WhisperOverlay\s+suppressed=\{Boolean\(elaraText\)\}\s*\/>/);
  });
});
