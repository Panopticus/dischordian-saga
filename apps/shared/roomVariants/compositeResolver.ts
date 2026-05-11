/**
 * Composite room state-variant resolver — Phase H.C.
 *
 * Given a {@link RoomStateDescriptor} (zipDir + per-axis state values),
 * returns a {@link ResolvedRoomVariant} — a stack of resolved layer
 * URLs ready to feed into `ParallaxRoom` as `ParallaxLayer[]`.
 *
 * Resolution walks the H.B `roomArtManifest`:
 *   1. baseline (always; depth -0.30)
 *   2. axis 9 overlay (-0.25)  if zipDir × axis9 exists in manifest
 *   3. axis 12 overlay (-0.20) if zipDir × axis12 exists
 *   4. axis 11 overlay (-0.15) if zipDir × axis11 exists
 *   5. axis 13 overlay (-0.10) if zipDir × axis13 exists
 *
 * Missing variants degrade silently — the resolver never throws. If
 * even the baseline is missing (room not in producer delivery), the
 * caller can detect via `result.satisfied.length === 0` and fall
 * back to legacy single-imageUrl from ROOM_DEFINITIONS.
 */

import { roomArtBaselineUrl, roomArtStateUrl } from "../expansionArt/roomArtManifest";
import {
  AXIS_DEPTHS,
  type ResolvedRoomLayer,
  type ResolvedRoomVariant,
  type RoomStateDescriptor,
} from "./stateVariantRegistry";

/**
 * Resolve a room state-variant descriptor into a stack of layer URLs.
 *
 * Per-axis missing-variant handling: silently omits that overlay.
 * Baseline-missing handling: returns `{ layers: [], satisfied: [] }`
 * — caller falls back to legacy rendering.
 */
export function resolveRoomVariant(
  descriptor: RoomStateDescriptor,
): ResolvedRoomVariant {
  const layers: ResolvedRoomLayer[] = [];
  const satisfied: ResolvedRoomVariant["satisfied"][number][] = [];

  // 1. baseline (always tried first; if missing, the room isn't in
  // the producer delivery and the caller falls back to legacy art)
  const baselineUrl = roomArtBaselineUrl(descriptor.zipDir);
  if (baselineUrl) {
    layers.push({
      src: baselineUrl,
      depth: AXIS_DEPTHS.baseline,
      axis: "baseline",
      variantKey: "baseline",
    });
    satisfied.push("baseline");
  }

  // 2. axis 9 — TV-infection
  if (descriptor.axis9) {
    const url = roomArtStateUrl(descriptor.zipDir, "tv", descriptor.axis9);
    if (url) {
      layers.push({
        src: url,
        depth: AXIS_DEPTHS.axis9,
        axis: "axis9",
        variantKey: `tv_${descriptor.axis9}`,
      });
      satisfied.push("axis9");
    }
  }

  // 3. axis 12 — faction-livery
  if (descriptor.axis12) {
    const url = roomArtStateUrl(
      descriptor.zipDir,
      "faction",
      descriptor.axis12,
    );
    if (url) {
      layers.push({
        src: url,
        depth: AXIS_DEPTHS.axis12,
        axis: "axis12",
        variantKey: `faction_${descriptor.axis12}`,
      });
      satisfied.push("axis12");
    }
  }

  // 4. axis 11 — cycle-phase / time-of-day
  if (descriptor.axis11) {
    const url = roomArtStateUrl(
      descriptor.zipDir,
      "cycle",
      descriptor.axis11,
    );
    if (url) {
      layers.push({
        src: url,
        depth: AXIS_DEPTHS.axis11,
        axis: "axis11",
        variantKey: `cycle_${descriptor.axis11}`,
      });
      satisfied.push("axis11");
    }
  }

  // 5. axis 13 — storyteller hook
  //    The hookId is an open string; producer-naming convention is
  //    "<sub-category>_<value>" (e.g. "morality_dark", "trust_elara").
  //    We try the hook id as a direct variantKey lookup.
  if (descriptor.axis13) {
    // The hook id directly maps to a producer variantKey stem;
    // for example, "morality_dark" → state_morality_dark.png.
    const parts = descriptor.axis13.split("_", 2);
    if (parts.length === 2) {
      const [axis, value] = parts;
      const url = roomArtStateUrl(descriptor.zipDir, axis, value);
      if (url) {
        layers.push({
          src: url,
          depth: AXIS_DEPTHS.axis13,
          axis: "axis13",
          variantKey: descriptor.axis13,
        });
        satisfied.push("axis13");
      }
    }
  }

  return { layers, descriptor, satisfied };
}

/**
 * Convenience — collapse a resolved variant to ParallaxRoom-compatible
 * layer array shape. The compositeResolver returns the canonical
 * shape; this is just a one-line shim for callers that want the
 * minimum `{ src, depth }` props for ParallaxLayer.
 */
export function toParallaxLayers(
  result: ResolvedRoomVariant,
): readonly { src: string; depth: number }[] {
  return result.layers.map((l) => ({ src: l.src, depth: l.depth }));
}

/**
 * Quick predicate — does the producer-art library have ANY entry for
 * this zipDir? Used by ArkExplorerPage to decide whether to invoke
 * the composite resolver at all (vs. legacy single-imageUrl fallback).
 */
export function hasRoomArt(zipDir: string): boolean {
  return roomArtBaselineUrl(zipDir) !== undefined;
}
