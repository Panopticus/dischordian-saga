/**
 * Structural tests for LockeInboxBridgeOverlay — verify the
 * dismiss handler wires `adjustNpcTrust("locke", +5)` alongside
 * the seen-flag write, so reading a bridge actually advances
 * Locke trust toward the Casino (30) and Bounty Board (50)
 * unlock thresholds.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const src = fs.readFileSync(
  path.resolve(__dirname, "LockeInboxBridgeOverlay.tsx"),
  "utf-8",
);

describe("LockeInboxBridgeOverlay — trust wiring", () => {
  it("pulls adjustNpcTrust from useGame", () => {
    expect(src).toContain("adjustNpcTrust");
    expect(src).toMatch(/useGame\(\)/);
  });

  it("declares the canonical +5 trust reward constant", () => {
    expect(src).toContain("LOCKE_BRIDGE_TRUST_REWARD");
    expect(src).toMatch(/LOCKE_BRIDGE_TRUST_REWARD\s*=\s*5/);
  });

  it("dismiss handler calls both setNarrativeFlag and adjustNpcTrust", () => {
    expect(src).toMatch(/setNarrativeFlag\(entry\.seenFlag,\s*true\)/);
    expect(src).toMatch(
      /adjustNpcTrust\(\s*["']locke["']\s*,\s*LOCKE_BRIDGE_TRUST_REWARD\s*\)/,
    );
  });

  it("button label surfaces the trust reward to the player", () => {
    expect(src).toMatch(/\+\{LOCKE_BRIDGE_TRUST_REWARD\}\s*trust/);
  });
});
