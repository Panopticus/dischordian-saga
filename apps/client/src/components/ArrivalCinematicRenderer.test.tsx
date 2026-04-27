/**
 * Structural tests for ArrivalCinematicRenderer — Phase 2.4.
 *
 * Verifies the renderer reads canonical sector metadata,
 * surfaces the canonical Eyes-narrator whisper, calls
 * markArrivalCinematicWatched on dismissal, and renders
 * canonical sector vitals + faction stamp.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const src = fs.readFileSync(
  path.resolve(__dirname, "ArrivalCinematicRenderer.tsx"),
  "utf-8",
);

describe("ArrivalCinematicRenderer — canonical imports", () => {
  it("imports GalacticSector type from canonical Trade Empire module", () => {
    expect(src).toContain("GalacticSector");
    expect(src).toContain('from "@/game/tradeEmpire"');
  });

  it("imports markArrivalCinematicWatched mutation via trpc", () => {
    expect(src).toContain(
      "trpc.tradeEmpire.markArrivalCinematicWatched.useMutation",
    );
  });
});

describe("ArrivalCinematicRenderer — canonical-sector surface", () => {
  it("renders canonical sector name + faction stamp", () => {
    expect(src).toContain("sector.name");
    expect(src).toContain("sector.controlledBy");
  });

  it("renders canonical Eyes-narrator whisper when present", () => {
    expect(src).toContain("sector.eyesNarrator");
    expect(src).toContain("FIRST-VISIT WHISPER");
  });

  it("renders canonical sector vitals (threat / stability / population)", () => {
    expect(src).toContain("sector.threat");
    expect(src).toContain("sector.stability");
    expect(src).toContain("sector.population");
  });

  it("conditionally renders canonical lore + image when present", () => {
    expect(src).toContain("sector.lore");
    expect(src).toContain("sector.image");
  });
});

describe("ArrivalCinematicRenderer — canonical-dismissal contract", () => {
  it("calls markArrivalCinematicWatched mutation with sectorId on dismiss", () => {
    expect(src).toContain(
      "markWatchedMutation.mutate({ sectorId: sector.id })",
    );
  });

  it("invokes onClose after dismissal", () => {
    expect(src).toMatch(/handleDismiss[\s\S]*onClose\(\)/);
  });

  it("returns null when isOpen=false (canonical-only-on-first-visit)", () => {
    expect(src).toContain("if (!isOpen) return null");
  });
});
