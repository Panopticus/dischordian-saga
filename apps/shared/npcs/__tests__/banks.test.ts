// apps/shared/npcs/__tests__/banks.test.ts
//
// Cross-bank validation. Enforces:
//   - silent-fail catch-all contract per (npcKey, surface)
//   - canonical band/reveal-stage values per registry
//   - lineId uniqueness across the entire ALL_NPC_LINES bank
//   - canonical surfaces (no typos)

import { describe, it, expect } from "vitest";
import { ALL_NPC_LINES } from "../banks";
import { findUngatedSurfaces } from "../selector";
import { isKnownBand, isKnownRevealStage, NPC_REGISTRY } from "../registry";
import type { DialogSurface, NpcKey } from "../types";

const VALID_SURFACES: ReadonlyArray<DialogSurface> = [
  "room",
  "transmission",
  "npc_line",
  "journal",
  "wheel_followup",
  "match",
  "fight",
  "trade_empire",
  "dmc",
  "cinematic",
  "dream_sequence",
  "memory_residue",
  "expression",
];

describe("ALL_NPC_LINES — aggregate bank invariants", () => {
  it("every line uses a canonical surface", () => {
    for (const line of ALL_NPC_LINES) {
      for (const surface of line.surfaces) {
        expect(VALID_SURFACES).toContain(surface);
      }
    }
  });

  it("every line's npcKey is registered in NPC_REGISTRY", () => {
    for (const line of ALL_NPC_LINES) {
      expect(NPC_REGISTRY[line.npcKey], line.lineId).toBeDefined();
    }
  });

  it("every requiresTrustBand is canonical for its NPC", () => {
    for (const line of ALL_NPC_LINES) {
      if (line.requiresTrustBand !== undefined) {
        expect(
          isKnownBand(line.npcKey, line.requiresTrustBand),
          `${line.lineId}: band ${line.requiresTrustBand} unknown for ${line.npcKey}`,
        ).toBe(true);
      }
    }
  });

  it("every requiresRevealStage is canonical for its NPC", () => {
    for (const line of ALL_NPC_LINES) {
      if (line.requiresRevealStage !== undefined) {
        expect(
          isKnownRevealStage(line.npcKey, line.requiresRevealStage),
          `${line.lineId}: revealStage ${line.requiresRevealStage} unknown for ${line.npcKey}`,
        ).toBe(true);
      }
    }
  });

  it("lineIds are globally unique", () => {
    const ids = new Set<string>();
    for (const line of ALL_NPC_LINES) {
      expect(ids.has(line.lineId), `duplicate lineId: ${line.lineId}`).toBe(false);
      ids.add(line.lineId);
    }
  });

  it("every (npcKey, surface) pair has a catch-all line (silent-fail contract)", () => {
    const ungated = findUngatedSurfaces(ALL_NPC_LINES);
    expect(
      ungated,
      `Surfaces lacking catch-all (selector would silent-fail in production): ${ungated.map(u => `${u.npcKey}:${u.surface}`).join(", ")}`,
    ).toEqual([]);
  });

  it("every line has non-empty text OR an explicit non-verbal expressionChannel", () => {
    for (const line of ALL_NPC_LINES) {
      const isVerbalOrUnset =
        line.expressionChannel === undefined || line.expressionChannel === "verbal";
      if (isVerbalOrUnset) {
        expect(line.text.trim().length, line.lineId).toBeGreaterThan(0);
      }
    }
  });
});

describe("ALL_NPC_LINES — Locke pilot bank coverage", () => {
  function lockeLines() {
    return ALL_NPC_LINES.filter(l => l.npcKey === ("adjudicator_locke" as NpcKey));
  }

  it("ships at least one line per canonical surface used in pilot scope", () => {
    const lines = lockeLines();
    const surfaces = new Set<DialogSurface>();
    for (const l of lines) for (const s of l.surfaces) surfaces.add(s);
    expect(surfaces.has("cinematic")).toBe(true);
    expect(surfaces.has("room")).toBe(true);
    expect(surfaces.has("npc_line")).toBe(true);
    expect(surfaces.has("trade_empire")).toBe(true);
  });

  it("includes the canonical signature first-meeting cinematic", () => {
    const lines = lockeLines();
    const sig = lines.find(l => l.lineId === "locke.signature.welcome_to_the_authoritys_ledger");
    expect(sig).toBeDefined();
    expect(sig!.maxPlays).toBe(1);
    expect(sig!.setsPublicFlags).toContain("met_adjudicator_locke");
  });

  it("includes the Touché vex-lockout reactive line", () => {
    const lines = lockeLines();
    const touche = lines.find(l => l.lineId === "locke.touche.vex_locked_out");
    expect(touche).toBeDefined();
    expect(touche!.reactsToPublicFlag).toBe("vex_locked_out_by_locke_exclusivity");
  });

  it("includes audited + unaudited contract-signing variants", () => {
    const lines = lockeLines();
    expect(lines.find(l => l.lineId === "locke.signing.audited.respect_acknowledged")).toBeDefined();
    expect(lines.find(l => l.lineId === "locke.signing.unaudited.told_you_so")).toBeDefined();
  });
});
