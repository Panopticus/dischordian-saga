/* ═══════════════════════════════════════════════════════
   COMPANION ROOM REGISTRY

   Plan §B5. The Inception Ark today is a set of rooms with
   examinable hotspots. Companions exist in dialog data but
   don't *inhabit* a room — there's no Normandy-style place
   to go visit Garrus between missions.

   This registry is the metadata layer that maps each wired
   companion to a fixed room they "live" in, so a UI surface
   can:
     • render a companion-presence marker on the room
     • show a "new dialogue available" badge after a story
       beat advances and that companion has new conditional
       content (handled by useCompanionRoomVisits, below)
     • offer a one-tap "visit" action that opens the
       companion's NPC dialog at the right scene

   Today the registry is data only — the room-system wiring
   that actually renders the marker / badge can pick it up
   via the listCompanionsInRoom helper.

   Companion roster is intentionally narrow — only the wired
   roster (those with authored dialog banks) get a fixed
   room. Unwired bibles aren't surfaced here yet; they'll
   get rooms when their banks land.
   ═══════════════════════════════════════════════════════ */

export type CompanionRoomId =
  | "bridge"
  | "engineering"
  | "medical-bay"
  | "armory"
  | "observation-deck"
  | "recipe-archive"
  | "chess-table"
  | "war-room"
  | "cryo-bay";

export type CompanionRosterId =
  | "elara"
  | "the_human"
  | "the_antiquarian"
  | "adjudicator_locke"
  | "vex_solene"
  | "jericho_jones"
  | "agent_zero"
  | "shadow_tongue"
  | "the_source";

export interface CompanionRoomEntry {
  companionId: CompanionRosterId;
  /** Where the player goes to find this companion between
   *  missions. */
  roomId: CompanionRoomId;
  /** One short sentence — the in-fiction reason this
   *  companion is here. Surfaces in the room's hotspot tooltip. */
  presenceLine: string;
  /** Optional act-gate. Companion isn't visible in the room
   *  until the listed flag is set. Mirrors the wider
   *  narrative-flag namespace (see narrativeFlagRegistry.ts). */
  visibleFromFlag?: string;
}

export const COMPANION_ROOM_REGISTRY: ReadonlyArray<CompanionRoomEntry> = [
  {
    companionId: "elara",
    roomId: "bridge",
    presenceLine: "Elara's holographic anchor is on the captain's pedestal.",
  },
  {
    companionId: "the_human",
    roomId: "observation-deck",
    presenceLine: "The Human's signal threads through the deck's silent windows.",
  },
  {
    companionId: "the_antiquarian",
    roomId: "recipe-archive",
    presenceLine: "The Antiquarian sits with his book at the long reading table.",
    visibleFromFlag: "act_2_complete",
  },
  {
    companionId: "adjudicator_locke",
    roomId: "war-room",
    presenceLine: "Locke leans over the warmap, sleeves still creased.",
    visibleFromFlag: "trade_empire_unlocked",
  },
  {
    companionId: "vex_solene",
    roomId: "medical-bay",
    presenceLine: "Vex is at the diagnostic bench, sorting samples.",
    visibleFromFlag: "act_2_complete",
  },
  {
    companionId: "jericho_jones",
    roomId: "armory",
    presenceLine: "Jericho is field-stripping a sidearm at the armoury bench.",
    visibleFromFlag: "trade_empire_unlocked",
  },
  {
    companionId: "agent_zero",
    roomId: "engineering",
    presenceLine: "Agent Zero is patching a console nobody asked her to touch.",
    visibleFromFlag: "act_3_starting",
  },
];

/* ─── Helpers ─── */

/** Companions who are currently visible in the given room.
 *  Filters by the visibleFromFlag gate against the player's
 *  flag bag. */
export function listCompanionsInRoom(
  roomId: CompanionRoomId,
  flags: Readonly<Record<string, boolean | undefined>>,
): CompanionRoomEntry[] {
  return COMPANION_ROOM_REGISTRY.filter((entry) => {
    if (entry.roomId !== roomId) return false;
    if (entry.visibleFromFlag && !flags[entry.visibleFromFlag]) return false;
    return true;
  });
}

/** The room a companion currently inhabits, or null if the
 *  companion isn't yet visible (gate flag missing). */
export function getCompanionRoom(
  companionId: CompanionRosterId,
  flags: Readonly<Record<string, boolean | undefined>>,
): CompanionRoomId | null {
  const entry = COMPANION_ROOM_REGISTRY.find((e) => e.companionId === companionId);
  if (!entry) return null;
  if (entry.visibleFromFlag && !flags[entry.visibleFromFlag]) return null;
  return entry.roomId;
}

/** Distinct room ids that host at least one companion in the
 *  registry. Useful for a UI that wants to mark every
 *  companion-bearing room with a presence indicator without
 *  enumerating the whole roster. */
export function listCompanionRoomIds(): CompanionRoomId[] {
  return [...new Set(COMPANION_ROOM_REGISTRY.map((e) => e.roomId))];
}
