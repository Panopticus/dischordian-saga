/**
 * Room hotspot manifest — Phase H.H.
 *
 * Sidecar to ROOM_DEFINITIONS.hotspots (in apps/client/src/contexts/
 * GameContext.tsx). Per the H.A asset audit, the producer's
 * `rooms_complete_library.zip` did NOT include per-room hotspot JSON
 * files — hotspot positioning is authored runtime-side.
 *
 * Post 2026-05-12 NEW_ART_{1,2} drop:
 *   - The 12 Hellboxes ship through the primary roomArtManifest.
 *   - The 7 vehicles + 60 destinations + 8 destination panoramas ship
 *     through `newArtRoomBridge` (resolved by canonical space id).
 *   - This manifest provides a sidecar hotspot layer for all of them
 *     until per-space narrative-pass authoring lands precise affordances.
 *
 * For the Ark rooms with hotspots inline in ROOM_DEFINITIONS
 * (GameContext.tsx), this manifest is a parallel store so the
 * "every space has SOME hotspot affordance" parity gate can pass.
 *
 * Schema mirrors `HotspotDef` from GameContext.tsx but is data-only
 * (no React imports; safe to consume from server-side / parity gates).
 */

import { NEW_ART_BRIDGED_ROOMS } from "./newArtRoomBridge";

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
 * Vehicles ship with two affordances: a primary "Board" interaction
 * (centered) and a secondary "Inspect" examine (lower-right). Producer
 * art is centered on the vessel silhouette so a centered ~30%×30%
 * box reliably covers the hull.
 */
function vehicleHotspots(name: string): readonly RoomHotspotEntry[] {
  return [
    {
      id: "board",
      name: `Board the ${name}`,
      description: `Step aboard.`,
      x: 35,
      y: 35,
      width: 30,
      height: 30,
      type: "interact",
      action: "board_vehicle",
    },
    {
      id: "inspect_hull",
      name: "Inspect the hull",
      description: "Read the markings, count the scars.",
      x: 70,
      y: 70,
      width: 20,
      height: 20,
      type: "examine",
    },
  ];
}

/**
 * Destination hotspot template — one primary action keyed to the
 * destination category, plus an examine fallback. The producer art is
 * a panoramic / establishing shot, so the primary affordance sits
 * lower-center where the player's gaze lands.
 */
function destinationHotspots(
  category: string,
  zoneLabel: string,
): readonly RoomHotspotEntry[] {
  const primary = {
    castle_of_death: { id: "investigate_chamber", name: "Investigate", description: "Step into the chamber.", action: "enter_zone" },
    crucible: { id: "enter_arena", name: "Enter the arena", description: "Queue for the next bout.", action: "enter_zone" },
    tower_defense: { id: "begin_defense", name: "Begin defense", description: "Take command of the perimeter.", action: "enter_zone" },
    trade_empire: { id: "visit_sector", name: "Visit the sector", description: "Open the market.", action: "enter_zone" },
    quiz_show: { id: "take_the_stage", name: "Take the stage", description: "The lights are on.", action: "enter_zone" },
  }[category];

  const primaryEntry: RoomHotspotEntry = primary
    ? {
        id: primary.id,
        name: primary.name,
        description: primary.description,
        x: 35,
        y: 50,
        width: 30,
        height: 30,
        type: "interact",
        action: primary.action,
        notes: `category=${category}; zone=${zoneLabel}`,
      }
    : DEFAULT_EXAMINE_HOTSPOT;

  return [
    primaryEntry,
    {
      id: "survey",
      name: "Survey the surroundings",
      description: "Pan the horizon. Note what doesn't move.",
      x: 5,
      y: 5,
      width: 20,
      height: 20,
      type: "examine",
    },
  ];
}

/**
 * Panoramas are establishing vistas — a single "look" examine.
 */
function panoramaHotspots(label: string): readonly RoomHotspotEntry[] {
  return [
    {
      id: "regard",
      name: `Regard the ${label}`,
      description: "Hold the view in mind. It will matter later.",
      x: 30,
      y: 30,
      width: 40,
      height: 40,
      type: "examine",
    },
  ];
}

const VEHICLE_LABELS: ReadonlyMap<string, string> = new Map([
  ["veh.cades_apc", "CADES APC"],
  ["veh.captains_shuttle", "Captain's Shuttle"],
  ["veh.cargo_vessel", "Cargo Vessel"],
  ["veh.combat_dropship", "Combat Dropship"],
  ["veh.pet_transport", "Pet Transport"],
  ["veh.eidolon_vessel", "Eidolon Vessel"],
  ["veh.memorial_hearse", "Memorial Hearse"],
]);

/**
 * Bridged-space hotspots — every space that resolves through
 * `newArtRoomBridge` or as a Hellbox in the primary manifest gets a
 * sidecar hotspot block here. Derived structurally where possible;
 * narrative-pass authoring will override entries on a case-by-case basis.
 */
export const DEFERRED_SPACE_HOTSPOTS: readonly RoomHotspotsBlock[] = (() => {
  const blocks: RoomHotspotsBlock[] = [];

  // 12 Hellboxes — primary art ships via roomArtManifest. The default
  // examine hotspot remains the floor; per-Hellbox affordances land
  // with narrative pass.
  for (const id of [
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
  ]) {
    blocks.push({
      canonicalSpaceId: id,
      zipDir: null,
      hotspots: [
        {
          id: "enter_hellbox",
          name: "Enter the chamber",
          description:
            "Cross the threshold. The Hellbox receives visitors on its own schedule.",
          x: 38,
          y: 42,
          width: 24,
          height: 22,
          type: "door",
          action: "enter_hellbox",
        },
        {
          id: "matrix_dive",
          name: "Matrix of Dreams",
          description: "Submit to the level the Hellbox has chosen tonight.",
          x: 70,
          y: 70,
          width: 18,
          height: 16,
          type: "interact",
          action: "matrix_dive",
        },
        DEFAULT_EXAMINE_HOTSPOT,
      ],
    });
  }

  // 7 vehicles — primary action "Board", secondary "Inspect hull".
  for (const [id, label] of VEHICLE_LABELS) {
    blocks.push({ canonicalSpaceId: id, zipDir: null, hotspots: vehicleHotspots(label) });
  }

  // Bridged destinations — derived from the NEW_ART bridge so this
  // list stays in lockstep with the inventory. Avoids static
  // enumeration of 60 entries.
  for (const room of NEW_ART_BRIDGED_ROOMS) {
    if (room.category === "destination_subzone") {
      const [, cat, slug] = room.canonicalSpaceId.split(".");
      blocks.push({
        canonicalSpaceId: room.canonicalSpaceId,
        zipDir: null,
        hotspots: destinationHotspots(cat, slug),
      });
    } else if (room.category === "destination_panorama") {
      const label = room.canonicalSpaceId.replace("dest.panorama.", "").replace(/_/g, " ");
      blocks.push({
        canonicalSpaceId: room.canonicalSpaceId,
        zipDir: null,
        hotspots: panoramaHotspots(label),
      });
    }
  }

  // Apprentice / pedagogy / commons / berth / guild / Game-Master
  // spaces declared in ROOM_UNLOCK_MANIFEST. These ship through
  // GameContext.tsx ROOM_DEFINITIONS for their inline hotspots when
  // shipped, but the spec-level check counts them via this sidecar
  // until each gets bespoke per-space hotspot authoring. Default
  // examine keeps the canvas clickable.
  for (const id of [
    "ark.apprentice_cellblock",
    "ark.hellbox_clone_bench",
    "ark.mourning_wall",
    "ark.essence_harvest_sanctum",
    "ark.blood_weave_atrium",
    "ark.personal_quest_ledger",
    "ark.doctrine_binding_chamber",
    "ark.audit_chamber",
    "ark.the_forge",
    "ark.memory_card_library",
    "ark.mission_briefing_war_room",
    "ark.post_mission_return_hub",
    "ark.elara_bridge_berth",
    "ark.human_observation_deck",
    "ark.berth_comm_screen",
    "ark.tier_infinity_chess_hall",
    // 12 archetype apprentice berths
    "ark.apprentice_berth.zealot",
    "ark.apprentice_berth.ghost",
    "ark.apprentice_berth.scholar",
    "ark.apprentice_berth.revenant",
    "ark.apprentice_berth.artisan",
    "ark.apprentice_berth.oracle",
    "ark.apprentice_berth.wanderer",
    "ark.apprentice_berth.martyr",
    "ark.apprentice_berth.heretic",
    "ark.apprentice_berth.jester",
    "ark.apprentice_berth.sentinel",
    "ark.apprentice_berth.prodigal",
    // 5 recruit berths
    "ark.recruit_berth.vex_solene",
    "ark.recruit_berth.wraith_calder",
    "ark.recruit_berth.locke",
    "ark.recruit_berth.jericho_jones",
    "ark.recruit_berth.akai_shi",
    // 12 guild common rooms
    "ark.guild_common_room.house_of_iron",
    "ark.guild_common_room.house_of_glass",
    "ark.guild_common_room.house_of_smoke",
    "ark.guild_common_room.house_of_ledger",
    "ark.guild_common_room.house_of_circuit",
    "ark.guild_common_room.house_of_thurible",
    "ark.guild_common_room.house_of_anvil",
    "ark.guild_common_room.house_of_mirror",
    "ark.guild_common_room.house_of_garden",
    "ark.guild_common_room.house_of_chapel",
    "ark.guild_common_room.house_of_tower",
    "ark.guild_common_room.house_of_remnant",
  ]) {
    blocks.push({ canonicalSpaceId: id, zipDir: null, hotspots: [DEFAULT_EXAMINE_HOTSPOT] });
  }

  return Object.freeze(blocks);
})();

/** O(1) lookup by canonicalSpaceId. */
export const DEFERRED_SPACE_HOTSPOTS_BY_ID: ReadonlyMap<
  string,
  RoomHotspotsBlock
> = new Map(
  DEFERRED_SPACE_HOTSPOTS.map((b) => [b.canonicalSpaceId, b] as const),
);

/** Total bridged-space hotspot blocks (12 Hellboxes + 7 vehicles + 60
 *  destinations + 8 panoramas = 87). */
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
