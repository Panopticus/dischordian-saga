/* ═══════════════════════════════════════════════════════
   BEAT E FLASHBACK HOTSPOTS — config table

   Beat E is the first time the player meets the "flashback"
   mechanic: click an archive object on the mess-hall backdrop
   → sepia-drain overlay engages → the Prince's hologram VO
   plays → sepia-drain reverses on VO end → object marked
   examined.

   Each hotspot references a VO line id in princeVoManifest.json.
   Hotspots whose VO isn't in the manifest are filtered out at
   runtime, so this file can declare the full canonical set
   even when some lines are still awaiting generation.

   Canon: PRELUDE_SHIP_READY_BIBLE.md §10.3–§10.5.
   ═══════════════════════════════════════════════════════ */

import princeVoManifest from "../../../../shared/princeVoManifest.json";

export interface BeatEHotspotConfig {
  /** Stable id, used for examined-state tracking. */
  id: string;
  /** Key in princeVoManifest.json. Filter-out if missing. */
  voLineId: string;
  /** ARIA label for the hotspot button. */
  label: string;
  /** Human-readable name shown in the "examine" tooltip. */
  displayName: string;
  /**
   * Position on the room backdrop as percentages of width/height.
   * Canonical art positions from Bible §10.3:
   *   - Toy soldier: center shelf bay, lower-shelf
   *   - Diploma:     mounted on wall above the shelf
   * These are first-pass estimates. Tune against production art
   * when the final mess-hall composition is delivered.
   */
  position: { leftPct: number; topPct: number };
  /**
   * Optional one-shot VFX overlay to play during the flashback
   * (in addition to the global sepia-drain). e.g. diploma-ink-bloom
   * for the diploma interaction (Bible §10.6).
   */
  vfxOverlay?: {
    webmUrl: string;
    widthPx: number;
    heightPx: number;
  };
}

/** Canonical Beat E hotspot list (Bible §10.3–§10.5). */
export const BEAT_E_HOTSPOTS: readonly BeatEHotspotConfig[] = [
  {
    id: "toy_soldier",
    voLineId: "prince_beat_e_toy_soldier",
    label: "Examine the toy soldier",
    displayName: "Toy Soldier",
    position: { leftPct: 28, topPct: 68 },
  },
  {
    id: "diploma",
    voLineId: "prince_beat_e_diploma",
    label: "Examine the framed diploma",
    displayName: "Framed Diploma",
    position: { leftPct: 66, topPct: 42 },
    vfxOverlay: {
      webmUrl: "/art/vfx/prelude/diploma-ink-bloom.webm",
      widthPx: 480,
      heightPx: 340,
    },
  },
];

/**
 * Return only the hotspots whose VO line id is present in the Prince
 * manifest. Hotspots whose VO hasn't landed yet are silently filtered.
 * Tested against the runtime manifest — see beatEHotspots.test.ts.
 */
export function getAvailableBeatEHotspots(
  manifest: Record<string, string> = princeVoManifest as Record<string, string>,
): readonly BeatEHotspotConfig[] {
  return BEAT_E_HOTSPOTS.filter((h) => Boolean(manifest[h.voLineId]));
}

/** Resolve a hotspot's VO url from the manifest. Returns null if missing. */
export function getHotspotVoUrl(
  hotspot: BeatEHotspotConfig,
  manifest: Record<string, string> = princeVoManifest as Record<string, string>,
): string | null {
  return manifest[hotspot.voLineId] ?? null;
}
