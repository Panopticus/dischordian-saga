/* ═══════════════════════════════════════════════════════
   VO CAPTIONS MANIFEST — typed access surface

   Wraps `voCaptionsManifest.json` (built by
   apps/scripts/build-vo-captions-manifest.mjs from every
   apps/scripts/*-lines.json source) behind a typed lookup. Single
   import point for client consumers; the JSON itself stays opaque.

   Re-running the builder is idempotent — the JSON is sorted and
   normalised, so a no-op rebuild produces a zero-line diff.

   Closes the WCAG 2.1 Level A captions gap noted in the audit.
   ═══════════════════════════════════════════════════════ */

import type { CaptionEntry, CaptionManifest } from "./voCaptions";
import manifestJson from "./voCaptionsManifest.json";

// The on-disk JSON has the same shape as CaptionManifest by
// construction (the builder writes the canonical voCaptions.ts
// schema). The cast is the single place that pins this contract.
export const VO_CAPTIONS_MANIFEST: CaptionManifest =
  manifestJson as CaptionManifest;

/** Look up a caption by line id. Returns null when the key isn't
 *  in the manifest — callers should treat "no caption" as a
 *  surfacing signal (the audit gap was *silent* missing captions). */
export function getVoCaption(lineId: string): CaptionEntry | null {
  return VO_CAPTIONS_MANIFEST[lineId] ?? null;
}

/** Total number of caption entries in the manifest. */
export function captionsCount(): number {
  return Object.keys(VO_CAPTIONS_MANIFEST).length;
}

/** All known caption ids. Sorted, since the builder writes sorted
 *  keys — useful for audits + UI surfaces that iterate. */
export function listCaptionIds(): readonly string[] {
  return Object.keys(VO_CAPTIONS_MANIFEST).sort();
}
