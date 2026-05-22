/**
 * Room-art manifest — typed access to the producer-art room library
 * (rooms_complete_library.zip; ingested at H.A; documented in
 * docs/production/_PHASE_H_INGEST.md).
 *
 * Built on `makeAssetManifest()` (see `_assetManifest.ts`). Provides
 * canonical lookup by:
 *
 *   - room zipDir + variantKey (synthetic `<zipDir>:<variantKey>` id)
 *   - room zipDir alone (baseline; falls back gracefully when missing)
 *   - canonicalSpaceId (production-doc space_id, e.g. "ark.cryo_bay")
 *   - axis filtering (all "tv" state variants, all "faction" variants)
 *
 * Subsequent sub-phases (H.D Axis 9, H.E Axis 11, H.F Axis 12,
 * H.G storyteller hooks) consume this manifest to build the
 * composite state-variant resolver.
 *
 * CDN target: https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/art/rooms/<zipDir>/<filename>
 * Out-of-band CDN upload step documented in
 * docs/production/_PHASE_H_INGEST.md.
 */

import { makeAssetManifest, type AssetManifest } from "./_assetManifest";
import {
  NEW_ART_BRIDGED_ROOMS,
  newArtRoomBaselineUrl,
} from "./newArtRoomBridge";
import { ROOM_ART_ENTRIES } from "./roomArtManifest.data";

export { ROOM_ART_ENTRIES };

/** A producer-delivered room-art file (baseline or state variant). */
export interface RoomArtEntry {
  /** Synthetic unique id `<zipDir>:<variantKey>` (e.g. "cryo_bay:baseline"). */
  readonly id: string;
  /** Zip directory name (canonical CDN folder). */
  readonly zipDir: string;
  /** Production-doc canonical space_id (e.g. "ark.cryo_bay"). */
  readonly canonicalSpaceId: string;
  /** Production-doc section reference (e.g. "A.1"). Empty for new rooms. */
  readonly arkSection: string;
  /** Category — informs subsequent sub-phase behaviour. */
  readonly category:
    | "ark_room"
    | "ark_room_new"
    | "ark_room_sub"
    | "prelude_room"
    | "apprentice_room"
    | "apprentice_berth_template"
    | "destination"
    | "destination_subzone"
    | "hellbox"
    | "hellbox_sub";
  /** Variant key — "baseline" or "<axis>_<value>" stem. */
  readonly variantKey: string;
  /** Producer axis cluster (see _PHASE_H_INGEST.md taxonomy). */
  readonly axis: string;
  /** Producer value within axis. Empty for baseline. */
  readonly value: string;
  /** Relative CDN path (consumed by assetUrl() to produce full URL). */
  readonly relPath: string;
}

export type RoomZipDir = RoomArtEntry["zipDir"];
export type RoomCanonicalSpaceId = RoomArtEntry["canonicalSpaceId"];

const manifest: AssetManifest<RoomArtEntry, "id"> = makeAssetManifest(
  ROOM_ART_ENTRIES,
  "id",
  "relPath",
);

/** All room-art entries (561 total; readonly). */
export const roomArtEntries = manifest.entries;
/** O(1) id → entry lookup. */
export const roomArtById = manifest.byId;
/** Total entry count. */
export const roomArtTotal = manifest.total;

/** Resolve a specific entry id to a CDN URL. */
export const roomArtUrl = manifest.urlOf;
/** Resolve or throw. */
export const requireRoomArtUrl = manifest.requireUrl;

/**
 * Resolve the baseline (master) still URL for a room.
 *
 * Accepts either a producer zipDir (e.g. `"cryo_bay"`,
 * `"hellbox/celebration_school"`) or a canonical space id (e.g.
 * `"hb.celebration_school"`, `"veh.cades_apc"`,
 * `"dest.castle_of_death.cod01_entrance_hall"`).
 *
 * Resolution order:
 *   1. Treat the arg as a zipDir and try the primary room-art
 *      manifest (`roomArtManifest.data.ts`).
 *   2. Treat the arg as a canonical space id and remap to zipDir via
 *      `ROOM_ART_CANONICAL_TO_ZIP`, then retry the primary manifest.
 *   3. Treat the arg as a canonical space id and try the
 *      `newArtRoomBridge` (vehicles + destinations from the
 *      2026-05-12 NEW_ART drop).
 *
 * Returns `undefined` only when the space is not present in any of
 * the three. Callers can fall back to legacy single-imageUrl in that
 * case.
 */
export function roomArtBaselineUrl(zipDirOrCanonical: string): string | undefined {
  const direct = roomArtUrl(`${zipDirOrCanonical}:baseline`);
  if (direct) return direct;
  const mappedZip = ROOM_ART_CANONICAL_TO_ZIP.get(zipDirOrCanonical);
  if (mappedZip) {
    const remapped = roomArtUrl(`${mappedZip}:baseline`);
    if (remapped) return remapped;
  }
  return newArtRoomBaselineUrl(zipDirOrCanonical);
}

/**
 * Resolve a specific state-variant URL by zipDir + axis + value.
 *
 * Returns `undefined` when the variant is not in the library. The
 * composite resolver (H.C onwards) walks a fallback chain that
 * tries multi-axis combinations then degrades to baseline.
 */
export function roomArtStateUrl(
  zipDir: string,
  axis: string,
  value: string,
): string | undefined {
  return roomArtUrl(`${zipDir}:${axis}_${value}`);
}

/**
 * Resolve a specific state-variant URL by zipDir + variantKey stem.
 *
 * Same as `roomArtStateUrl` but takes the `<axis>_<value>` stem
 * directly (matches the producer file-naming).
 */
export function roomArtVariantUrl(
  zipDir: string,
  variantKey: string,
): string | undefined {
  return roomArtUrl(`${zipDir}:${variantKey}`);
}

/** All entries for a given room (baseline + all its state variants). */
export function roomArtAllForRoom(zipDir: string): readonly RoomArtEntry[] {
  return manifest.byField("zipDir", zipDir);
}

/** All entries matching a producer-axis name (e.g. "tv", "faction"). */
export function roomArtByAxis(axis: string): readonly RoomArtEntry[] {
  return manifest.byField("axis", axis);
}

/** All entries for a given canonicalSpaceId. */
export function roomArtByCanonical(
  canonicalSpaceId: string,
): readonly RoomArtEntry[] {
  return manifest.byField("canonicalSpaceId", canonicalSpaceId);
}

/**
 * The set of room zipDirs present in the primary producer delivery.
 *
 * Note: this does NOT include the canonical ids resolved via the
 * `newArtRoomBridge` (vehicles + destinations from the 2026-05-12
 * NEW_ART drop). For total covered-space accounting consult
 * `roomArtCoverageReport().producerDelivered` instead.
 */
export const ROOM_ART_ZIP_DIRS: readonly string[] = Array.from(
  new Set(ROOM_ART_ENTRIES.map((e) => e.zipDir)),
).sort();

/**
 * Map from zipDir to canonicalSpaceId — the one source of truth for
 * the producer-name ↔ production-doc-name correspondence.
 */
export const ROOM_ART_ZIP_TO_CANONICAL: ReadonlyMap<string, string> =
  new Map(ROOM_ART_ENTRIES.map((e) => [e.zipDir, e.canonicalSpaceId]));

/**
 * Map from canonicalSpaceId to zipDir.
 */
export const ROOM_ART_CANONICAL_TO_ZIP: ReadonlyMap<string, string> =
  new Map(ROOM_ART_ENTRIES.map((e) => [e.canonicalSpaceId, e.zipDir]));

/**
 * The set of producer axes present in the library (21 distinct axes;
 * see docs/production/_PHASE_H_INGEST.md taxonomy table).
 */
export const ROOM_ART_PRODUCER_AXES: readonly string[] = Array.from(
  new Set(ROOM_ART_ENTRIES.filter((e) => e.axis !== "baseline").map((e) => e.axis)),
).sort();

/**
 * Per-room state-variant inventory: { zipDir: { axis: [values] } }.
 *
 * Useful for building the state-variant resolver's fallback chain
 * (H.C onwards).
 */
export function roomArtStateInventory(): ReadonlyMap<
  string,
  ReadonlyMap<string, readonly string[]>
> {
  const out = new Map<string, Map<string, string[]>>();
  for (const e of ROOM_ART_ENTRIES) {
    if (e.axis === "baseline") continue;
    let byAxis = out.get(e.zipDir);
    if (!byAxis) {
      byAxis = new Map();
      out.set(e.zipDir, byAxis);
    }
    let values = byAxis.get(e.axis);
    if (!values) {
      values = [];
      byAxis.set(e.axis, values);
    }
    values.push(e.value);
  }
  // freeze the inner arrays + return read-only view
  const frozen = new Map<string, ReadonlyMap<string, readonly string[]>>();
  for (const [zipDir, byAxis] of out.entries()) {
    const inner = new Map<string, readonly string[]>();
    for (const [axis, values] of byAxis.entries()) {
      inner.set(axis, [...values].sort());
    }
    frozen.set(zipDir, inner);
  }
  return frozen;
}

/**
 * Coverage report — which production-doc canonical space_ids are
 * present vs deferred. The roomAssetCoverage parity gate
 * (apps/shared/_completeness/checks/roomAssetCoverage.ts) consumes
 * this.
 */
export interface RoomCoverageReport {
  readonly producerDelivered: readonly string[];
  readonly producerNewNotInSpec: readonly string[];
  readonly deferredHellboxes: readonly string[];
  readonly deferredVehicles: readonly string[];
  readonly deferredCount: number;
}

/**
 * Aggregate a canonical space id to its spec-level equivalent — the
 * level at which `_PRODUCTION_FINAL.md` enumerates spaces. Hellbox
 * and Ark sub-rooms collapse to their parent room; destinations,
 * vehicles, and prelude rooms are already spec-level.
 */
function specLevelId(canonicalId: string): string {
  const hb = /^(hb\.[a-z_]+)(?:\..+)?$/.exec(canonicalId);
  if (hb) return hb[1];
  const ark = /^(ark\.[a-z_]+)(?:\..+)?$/.exec(canonicalId);
  if (ark) return ark[1];
  return canonicalId;
}

export function roomArtCoverageReport(): RoomCoverageReport {
  const primaryCanonical = Array.from(ROOM_ART_ZIP_TO_CANONICAL.values());
  // Bridged spaces: count only the spec-level rooms (vehicles +
  // destination subzones). Destination panoramas are vista
  // over-delivery used for loading screens / world map and aren't
  // part of the 166-space spec.
  const bridgedCanonical = NEW_ART_BRIDGED_ROOMS
    .filter((e) => e.category !== "destination_panorama")
    .map((e) => e.canonicalSpaceId);
  // Spec-level aggregation: Hellbox / Ark sub-rooms collapse to their
  // parent room, so the count reflects the 166-space spec contract
  // rather than the broader producer-delivered canonical-id population.
  const producerDelivered = Array.from(
    new Set([...primaryCanonical, ...bridgedCanonical].map(specLevelId)),
  ).sort();
  const producerNewNotInSpec = ROOM_ART_ENTRIES.filter(
    (e) => e.category === "ark_room_new",
  )
    .map((e) => e.canonicalSpaceId)
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort();

  // 12 Hellboxes per _PRODUCTION_FINAL.md PART IV — all 12 delivered in
  // H2.A (sub-rooms included). Kept here so a future regression surfaces.
  const ALL_HELLBOXES = [
    "hb.celebration_school",
    "hb.castle_of_death",
    "hb.quiz_show_palimpsest",
    "hb.mechronis_academy",
    "hb.universal_selector",
    "hb.dead_mans_circuit",
    "hb.degenerates_casino",
    "hb.editors_workshop",
    "hb.eternal_match",
    "hb.collected_souls",
    "hb.the_hive",
    "hb.dischordian_arena",
  ];
  const deliveredCanonicalSet = new Set(producerDelivered);
  const deferredHellboxes = ALL_HELLBOXES.filter(
    (hb) => !deliveredCanonicalSet.has(hb),
  );

  // 7 named vehicles — all delivered via NEW_ART_1 bridge as of
  // 2026-05-12. The list still surfaces what's missing if a future
  // change breaks the bridge.
  const ALL_VEHICLES = [
    "veh.cades_apc",
    "veh.captains_shuttle",
    "veh.cargo_vessel",
    "veh.combat_dropship",
    "veh.pet_transport",
    "veh.eidolon_vessel",
    "veh.memorial_hearse",
  ];
  const deferredVehicles = ALL_VEHICLES.filter(
    (v) => !deliveredCanonicalSet.has(v),
  );

  // 60 destination zones across 5 categories — all delivered via the
  // NEW_ART_2 bridge as of 2026-05-12 (`art/destinations/<category>/
  // <slug>.png`). Apprentice/pedagogy tail handled inline in
  // ROOM_DEFINITIONS + the primary manifest.
  const deferredCount =
    deferredHellboxes.length + deferredVehicles.length;

  return {
    producerDelivered,
    producerNewNotInSpec,
    deferredHellboxes,
    deferredVehicles,
    deferredCount,
  };
}
