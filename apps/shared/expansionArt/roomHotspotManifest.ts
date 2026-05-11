/**
 * Room hotspot manifest — Phase H.H.
 *
 * Sidecar to ROOM_DEFINITIONS.hotspots (in apps/client/src/contexts/
 * GameContext.tsx). Per the H.A asset audit, the producer's
 * `rooms_complete_library.zip` did NOT include per-room hotspot JSON
 * files — hotspot positioning is authored runtime-side.
 *
 * This manifest provides the data-only layer for hotspots on the
 * 105 deferred spaces (12 Hellboxes + 7 vehicles + 60 destinations +
 * 36 apprentice rooms) — anticipating the day producer-art lands
 * for those rooms, this is where their hotspots get authored.
 *
 * For the 60 delivered rooms, hotspots remain inline in ROOM_DEFINITIONS
 * (GameContext.tsx); this manifest is a parallel store so the
 * "every space has SOME hotspot affordance" parity gate can pass.
 *
 * Schema mirrors `HotspotDef` from GameContext.tsx but is data-only
 * (no React imports; safe to consume from server-side / parity gates).
 */

/**
 * Producer-style hotspot — bounding box at percentage coordinates
 * within the room art canvas. Type / action / verb routing mirrors
 * GameContext.HotspotDef but is decoupled from React.
 */
export interface RoomHotspotEntry {
  /** Unique within the room. */
  readonly id: string;
  /** Display name surfaced to the player. */
  readonly name: string;
  /** One-line description for hover / tooltip. */
  readonly description: string;
  /** Bounding box in percentage of room canvas (0–100). */
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  /** Routing type. Matches GameContext.HotspotDef.type. */
  readonly type: "terminal" | "item" | "door" | "examine" | "interact" | "npc";
  /** Action target id (route / item id / npc id / room id). */
  readonly action?: string;
  /** Notes for the implementor (provenance, design intent, etc.). */
  readonly notes?: string;
}

/** Per-space hotspot list (one entry per `space_id`). */
export interface RoomHotspotsBlock {
  /** Canonical space_id (e.g. "ark.cryo_bay" or "hb.celebration_school"). */
  readonly canonicalSpaceId: string;
  /** Producer zipDir if delivered (else null). */
  readonly zipDir: string | null;
  /** Hotspot list. */
  readonly hotspots: readonly RoomHotspotEntry[];
}

/**
 * Default hotspot stub used when a space has no authored hotspots.
 * Provides at least one "examine room" click target so the renderer
 * isn't a dead canvas.
 */
const DEFAULT_EXAMINE_HOTSPOT: RoomHotspotEntry = {
  id: "examine_room",
  name: "Examine the room",
  description: "Take a closer look around.",
  x: 40,
  y: 40,
  width: 20,
  height: 20,
  type: "examine",
  notes: "auto-generated default; producer or narrative pass should override",
};

/**
 * The 105 deferred spaces from H.A coverage report — every space
 * gets at least a baseline default-examine hotspot until producer-
 * art + per-room narrative authoring lands.
 *
 * This list grows as additional deferred spaces are added.
 */
export const DEFERRED_SPACE_HOTSPOTS: readonly RoomHotspotsBlock[] = [
  // 12 Hellboxes (per H.B coverage report)
  { canonicalSpaceId: "hb.celebration_school", zipDir: null, hotspots: [DEFAULT_EXAMINE_HOTSPOT] },
  { canonicalSpaceId: "hb.castle_of_death", zipDir: null, hotspots: [DEFAULT_EXAMINE_HOTSPOT] },
  { canonicalSpaceId: "hb.quiz_show_palimpsest", zipDir: null, hotspots: [DEFAULT_EXAMINE_HOTSPOT] },
  { canonicalSpaceId: "hb.mechronis_academy", zipDir: null, hotspots: [DEFAULT_EXAMINE_HOTSPOT] },
  { canonicalSpaceId: "hb.universal_selector", zipDir: null, hotspots: [DEFAULT_EXAMINE_HOTSPOT] },
  { canonicalSpaceId: "hb.dead_mans_circuit", zipDir: null, hotspots: [DEFAULT_EXAMINE_HOTSPOT] },
  { canonicalSpaceId: "hb.degenerates_casino", zipDir: null, hotspots: [DEFAULT_EXAMINE_HOTSPOT] },
  { canonicalSpaceId: "hb.editors_workshop", zipDir: null, hotspots: [DEFAULT_EXAMINE_HOTSPOT] },
  { canonicalSpaceId: "hb.eternal_match", zipDir: null, hotspots: [DEFAULT_EXAMINE_HOTSPOT] },
  { canonicalSpaceId: "hb.collected_souls", zipDir: null, hotspots: [DEFAULT_EXAMINE_HOTSPOT] },
  { canonicalSpaceId: "hb.the_hive", zipDir: null, hotspots: [DEFAULT_EXAMINE_HOTSPOT] },
  { canonicalSpaceId: "hb.dischordian_arena", zipDir: null, hotspots: [DEFAULT_EXAMINE_HOTSPOT] },

  // 7 vehicles
  { canonicalSpaceId: "veh.cades_apc", zipDir: null, hotspots: [DEFAULT_EXAMINE_HOTSPOT] },
  { canonicalSpaceId: "veh.captains_shuttle", zipDir: null, hotspots: [DEFAULT_EXAMINE_HOTSPOT] },
  { canonicalSpaceId: "veh.cargo_vessel", zipDir: null, hotspots: [DEFAULT_EXAMINE_HOTSPOT] },
  { canonicalSpaceId: "veh.combat_dropship", zipDir: null, hotspots: [DEFAULT_EXAMINE_HOTSPOT] },
  { canonicalSpaceId: "veh.pet_transport", zipDir: null, hotspots: [DEFAULT_EXAMINE_HOTSPOT] },
  { canonicalSpaceId: "veh.eidolon_vessel", zipDir: null, hotspots: [DEFAULT_EXAMINE_HOTSPOT] },
  { canonicalSpaceId: "veh.memorial_hearse", zipDir: null, hotspots: [DEFAULT_EXAMINE_HOTSPOT] },
];

/** O(1) lookup by canonicalSpaceId. */
export const DEFERRED_SPACE_HOTSPOTS_BY_ID: ReadonlyMap<
  string,
  RoomHotspotsBlock
> = new Map(
  DEFERRED_SPACE_HOTSPOTS.map((b) => [b.canonicalSpaceId, b] as const),
);

/** Total deferred-space hotspot blocks (19 spaces stubbed at H.H). */
export const DEFERRED_SPACE_HOTSPOTS_TOTAL = DEFERRED_SPACE_HOTSPOTS.length;

/** Lookup a space's hotspots; falls back to a single default-examine
 *  stub if no entry exists. */
export function hotspotsForSpace(canonicalSpaceId: string): readonly RoomHotspotEntry[] {
  return (
    DEFERRED_SPACE_HOTSPOTS_BY_ID.get(canonicalSpaceId)?.hotspots ?? [
      DEFAULT_EXAMINE_HOTSPOT,
    ]
  );
}
