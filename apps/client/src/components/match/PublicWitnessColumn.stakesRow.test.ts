/**
 * PublicWitnessColumn — Phase A7 stakes axis row contract.
 * Source-scan style.
 *
 * Pins the new `stakesPublicWitness` prop wiring AND the
 * view-adapter pass-through so a refactor that drops one or the
 * other (orphaning the prop or the field) fails at build.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const COLUMN_SRC = fs.readFileSync(
  path.resolve(__dirname, "PublicWitnessColumn.tsx"),
  "utf-8",
);
const ADAPTER_SRC = fs.readFileSync(
  path.resolve(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "shared",
    "tcg-core",
    "compat",
    "viewAdapter.ts",
  ),
  "utf-8",
);
const UI_SRC = fs.readFileSync(
  path.resolve(__dirname, "..", "..", "game", "duelyst", "DuelystGameUI.tsx"),
  "utf-8",
);

describe("PublicWitnessColumn — stakesPublicWitness prop (A7)", () => {
  it("accepts an optional stakesPublicWitness prop", () => {
    expect(COLUMN_SRC).toMatch(/stakesPublicWitness\?\s*:\s*number/);
  });

  it("renders the Stakes Stream row only when the prop is a number", () => {
    expect(COLUMN_SRC).toMatch(/typeof stakesPublicWitness === "number"/);
  });

  it("renders the row with a 'Dialog Influence' label so the player can distinguish card-driven from dialog-driven movement", () => {
    expect(COLUMN_SRC).toContain("Dialog Influence");
  });

  it("uses a stable test-id so end-to-end smoke tests can assert presence", () => {
    expect(COLUMN_SRC).toContain('data-testid="stakes-public-witness-row"');
  });

  it("prefixes positives with '+' so the asymmetry is visible at a glance", () => {
    expect(COLUMN_SRC).toMatch(/stakesPublicWitness > 0 \? "\+" : ""/);
  });
});

describe("viewAdapter — stakes pass-through (A7)", () => {
  it("LegacyDuelystGameState carries a `stakes` field", () => {
    expect(ADAPTER_SRC).toMatch(/stakes\?:\s*\{\s*axes:/);
  });

  it("adaptTcgStateToLegacyView copies state.stakes.axes when present", () => {
    expect(ADAPTER_SRC).toMatch(/stakes:\s*state\.stakes\s*\?/);
    expect(ADAPTER_SRC).toMatch(/\{\s*\.\.\.state\.stakes\.axes\s*\}/);
  });
});

describe("DuelystGameUI — passes the axis through to the column (A7)", () => {
  it("reads gameState.stakes?.axes?.public_witness on mount", () => {
    expect(UI_SRC).toMatch(/gameState\.stakes\?\.axes\?\.public_witness/);
  });

  it("forwards as stakesPublicWitness to PublicWitnessColumn", () => {
    expect(UI_SRC).toMatch(/stakesPublicWitness=\{/);
  });
});
