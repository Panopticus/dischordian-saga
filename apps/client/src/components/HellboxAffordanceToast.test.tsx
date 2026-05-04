/**
 * HellboxAffordanceToast — wiring contract.
 * Source-scan style.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const SRC = fs.readFileSync(
  path.resolve(__dirname, "HellboxAffordanceToast.tsx"),
  "utf-8",
);

describe("HellboxAffordanceToast", () => {
  it("gates visibility on the canonical Hellbox flags", () => {
    expect(SRC).toContain("HELLBOX_DISCOVERED_FLAG");
    expect(SRC).toContain("HELLBOX_FIRST_TOUCH_FLAG");
  });

  it("self-suppresses when the player reaches /hellbox or /matrix/*", () => {
    expect(SRC).toContain('location.startsWith("/hellbox")');
    expect(SRC).toContain('location.startsWith("/matrix/")');
  });

  it("provides a CTA linking to /hellbox", () => {
    expect(SRC).toContain('href="/hellbox"');
  });

  it("persists a dismiss flag so it doesn't re-pop after the player rejects it", () => {
    expect(SRC).toContain("hellbox_affordance_toast_dismissed");
    expect(SRC).toContain("setNarrativeFlag");
  });

  it("uses framer-motion for entrance/exit (matches sibling-toast convention)", () => {
    expect(SRC).toContain("AnimatePresence");
    expect(SRC).toContain("motion.div");
  });

  it("auto-dismisses when first-touch cinematic completes", () => {
    expect(SRC).toContain("firstTouchDone");
  });

  it("renders an in-fiction tagline (the Engineer's voice carries)", () => {
    expect(SRC).toContain("Engineer");
    expect(SRC).toContain("Hellbox detected");
  });
});
