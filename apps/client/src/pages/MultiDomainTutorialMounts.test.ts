/**
 * Multi-domain tutorial overlay mounts — wiring contract.
 *
 * Source-scan ensures the MechanicTutorialOverlay is mounted on the
 * canonical pages with the right uiId so the gate registry's
 * first_ui_open triggers fire correctly.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const WITNESSING_SRC = fs.readFileSync(
  path.resolve(__dirname, "WitnessingHubPage.tsx"),
  "utf-8",
);
const ORACLE_SRC = fs.readFileSync(
  path.resolve(__dirname, "OracleDeckPage.tsx"),
  "utf-8",
);
const BENCH_SRC = fs.readFileSync(
  path.resolve(__dirname, "EngineersBenchPage.tsx"),
  "utf-8",
);

describe("Multi-domain tutorial overlay mounts", () => {
  it("WitnessingHubPage mounts MechanicTutorialOverlay with uiId=witnessing_hub", () => {
    expect(WITNESSING_SRC).toContain("MechanicTutorialOverlay");
    expect(WITNESSING_SRC).toContain('uiId="witnessing_hub"');
  });

  it("OracleDeckPage mounts MechanicTutorialOverlay with uiId=oracle_deck", () => {
    expect(ORACLE_SRC).toContain("MechanicTutorialOverlay");
    expect(ORACLE_SRC).toContain('uiId="oracle_deck"');
  });

  it("EngineersBenchPage retains its existing mount with uiId=engineer_bench", () => {
    expect(BENCH_SRC).toContain("MechanicTutorialOverlay");
    expect(BENCH_SRC).toContain('uiId="engineer_bench"');
  });
});
