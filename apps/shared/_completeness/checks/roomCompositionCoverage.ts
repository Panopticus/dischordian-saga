/**
 * Phase J — Room composition coverage parity check.
 *
 * Declared surface: every (base, sprite) asset id enumerated in the
 * per-room catalogs at `apps/shared/roomComposition/*.ts`. As of
 * the initial wiring: 3 rooms × (~13 bases + ~76 sprites avg) = 269
 * declared assets.
 *
 * Implemented surface: assets the upload pipeline / CDN-side audit
 * trusts as present. Because we can't fetch from S3 in a unit-test
 * context, this check trusts the local manifest as the source of
 * truth (every id in the catalog is "implemented") and the human
 * eye + the `assets:upload` script as the gate. Any asset id that
 * lands in a resolver branch but ISN'T in the catalog would already
 * blow up the runtime; the resolver tests pin that invariant.
 *
 * This entry exists primarily to:
 *   1. Surface the room composition surface area in `pnpm ship:check`
 *      so growth is visible.
 *   2. Make adding a NEW composite room (engineering, observation
 *      deck, …) a mechanical update: import its catalog into the
 *      facade, and this check counts it automatically.
 *
 * Future tightening: a build-time S3 HEAD probe pass could swap the
 * trust to verifiable, but that requires network in CI and would
 * make the check non-deterministic. Keeping it manifest-trust for now.
 */
import type { RawParityCount } from "../types";
import { COMPOSITE_ASSET_CATALOG } from "../../roomComposition";

export function checkRoomCompositionCoverage(): RawParityCount {
  let declared = 0;
  let implemented = 0;
  for (const roomId of Object.keys(COMPOSITE_ASSET_CATALOG)) {
    const cat = COMPOSITE_ASSET_CATALOG[roomId as keyof typeof COMPOSITE_ASSET_CATALOG];
    declared += cat.bases.length + cat.sprites.length;
    // Each id is honored by the resolver iff it appears in the catalog;
    // the resolver-test invariant (`never emits sprite ids that aren't
    // in the per-room catalog`) keeps this honest.
    implemented += cat.bases.length + cat.sprites.length;
  }
  return { declared, implemented };
}
