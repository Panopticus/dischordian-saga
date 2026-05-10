import { describe, it, expect } from "vitest";
import {
  motifFromDoctrine,
  signatureArtSlotId,
  listSignatureArtSlots,
  getSignatureArtSlotSpec,
  signatureArtSlotCoverage,
} from "./signatureCardManifest";

describe("signatureCardManifest", () => {
  it("motifFromDoctrine maps every doctrine to a motif", () => {
    const doctrines = [
      "compliant_mouth", "forked_path", "cold_hand",
      "heretical_quiet", "human_remainder",
    ] as const;
    for (const d of doctrines) {
      const motif = motifFromDoctrine(d);
      expect(motif).toBeTruthy();
    }
  });

  it("listSignatureArtSlots produces 60 slots (12 archetypes × 5 motifs)", () => {
    expect(listSignatureArtSlots().length).toBe(60);
  });

  it("each slot id is unique and matches signatureArtSlotId", () => {
    const slots = listSignatureArtSlots();
    const ids = new Set(slots.map(s => s.slotId));
    expect(ids.size).toBe(60);
    for (const s of slots) {
      expect(s.slotId).toBe(signatureArtSlotId(s.archetype, s.motif));
    }
  });

  it("each slot has a fully authored spec", () => {
    const cov = signatureArtSlotCoverage();
    const incomplete = cov.filter(c => !c.complete);
    expect(incomplete).toEqual([]);
  });

  it("getSignatureArtSlotSpec returns null for unknown slot", () => {
    expect(getSignatureArtSlotSpec("nonexistent_slot")).toBeNull();
  });

  it("a known slot has both composition and color anchor", () => {
    const spec = getSignatureArtSlotSpec("zealot_tuning_fork");
    expect(spec).not.toBeNull();
    expect(spec!.composition.length).toBeGreaterThan(40);
    expect(spec!.colorAnchor.length).toBeGreaterThan(10);
  });

  it("CDN paths follow the art/cards/signature/<slot>.webp convention", () => {
    for (const s of listSignatureArtSlots()) {
      expect(s.cdnPath).toBe(`art/cards/signature/${s.slotId}.webp`);
    }
  });
});
