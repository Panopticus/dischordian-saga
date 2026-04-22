import { describe, it, expect } from "vitest";
import { assetUrl } from "../client/src/lib/assetUrl";
import {
  BEAT_E_HOTSPOTS,
  getAvailableBeatEHotspots,
  getHotspotVoUrl,
} from "../client/src/components/prelude/beatEHotspots";

/* ═══════════════════════════════════════════════════════
   Beat E hotspot config — structural + filter tests.

   The hotspot filter is the architectural seam that lets
   BeatEFlashback ship with only the diploma line delivered
   today and automatically pick up the toy-soldier line the
   moment its VO lands in the manifest. Cover every edge.
   ═══════════════════════════════════════════════════════ */

describe("Beat E hotspots — structural invariants", () => {
  it("declares 2 canonical hotspots (toy_soldier + diploma)", () => {
    expect(BEAT_E_HOTSPOTS).toHaveLength(2);
    const ids = BEAT_E_HOTSPOTS.map((h) => h.id).sort();
    expect(ids).toEqual(["diploma", "toy_soldier"]);
  });

  it("hotspot ids are unique", () => {
    const ids = BEAT_E_HOTSPOTS.map((h) => h.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("voLineIds are unique", () => {
    const lineIds = BEAT_E_HOTSPOTS.map((h) => h.voLineId);
    expect(new Set(lineIds).size).toBe(lineIds.length);
  });

  it("every hotspot has a human-readable displayName + ARIA label", () => {
    for (const h of BEAT_E_HOTSPOTS) {
      expect(h.displayName.length).toBeGreaterThan(0);
      expect(h.label.length).toBeGreaterThan(0);
    }
  });

  it("every hotspot's position is inside the frame (0-100 pct)", () => {
    for (const h of BEAT_E_HOTSPOTS) {
      expect(h.position.leftPct).toBeGreaterThanOrEqual(0);
      expect(h.position.leftPct).toBeLessThanOrEqual(100);
      expect(h.position.topPct).toBeGreaterThanOrEqual(0);
      expect(h.position.topPct).toBeLessThanOrEqual(100);
    }
  });

  it("the diploma hotspot has a vfxOverlay (canonical ink-bloom)", () => {
    const diploma = BEAT_E_HOTSPOTS.find((h) => h.id === "diploma");
    expect(diploma?.vfxOverlay?.webmUrl).toBe(
      assetUrl("art/vfx/prelude/diploma-ink-bloom.webm"),
    );
  });

  it("the toy soldier hotspot has no vfxOverlay (sepia-drain only)", () => {
    const toySoldier = BEAT_E_HOTSPOTS.find((h) => h.id === "toy_soldier");
    expect(toySoldier?.vfxOverlay).toBeUndefined();
  });
});

describe("Beat E hotspots — manifest filtering", () => {
  it("returns zero hotspots when no VO is available", () => {
    const available = getAvailableBeatEHotspots({});
    expect(available).toHaveLength(0);
  });

  it("returns only the diploma hotspot when only its VO is delivered", () => {
    const available = getAvailableBeatEHotspots({
      prince_beat_e_diploma: "https://example.com/diploma.mp3",
    });
    expect(available).toHaveLength(1);
    expect(available[0].id).toBe("diploma");
  });

  it("returns both hotspots when both VO lines are delivered", () => {
    const available = getAvailableBeatEHotspots({
      prince_beat_e_diploma: "https://example.com/diploma.mp3",
      prince_beat_e_toy_soldier: "https://example.com/toy_soldier.mp3",
    });
    expect(available).toHaveLength(2);
  });

  it("ignores unrelated prince manifest entries (e.g. future lines)", () => {
    const available = getAvailableBeatEHotspots({
      prince_beat_e_diploma: "https://example.com/diploma.mp3",
      holo_log_5_full: "https://example.com/log5.mp3", // unrelated
    });
    expect(available).toHaveLength(1);
    expect(available[0].id).toBe("diploma");
  });

  it("reads the real princeVoManifest.json when no manifest is passed", () => {
    // The real manifest contains prince_beat_e_diploma as of merged
    // PR #42. This assertion acts as a smoke test that the filter
    // works end-to-end; when toy_soldier lands, this updates to 2.
    const available = getAvailableBeatEHotspots();
    expect(available.length).toBeGreaterThanOrEqual(1);
    expect(available.length).toBeLessThanOrEqual(2);
    const ids = available.map((h) => h.id);
    expect(ids).toContain("diploma");
  });
});

describe("Beat E hotspots — url resolution", () => {
  it("returns the manifest url for a hotspot", () => {
    const diploma = BEAT_E_HOTSPOTS.find((h) => h.id === "diploma")!;
    const url = getHotspotVoUrl(diploma, {
      prince_beat_e_diploma: "https://example.com/diploma.mp3",
    });
    expect(url).toBe("https://example.com/diploma.mp3");
  });

  it("returns null when the VO isn't in the manifest", () => {
    const toySoldier = BEAT_E_HOTSPOTS.find((h) => h.id === "toy_soldier")!;
    const url = getHotspotVoUrl(toySoldier, {});
    expect(url).toBeNull();
  });
});
