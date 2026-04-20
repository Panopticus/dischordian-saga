/* ═══════════════════════════════════════════════════════
   PRELUDE ROOM ANCHORS — generic per-room hotspot positions

   One config entry per diegetic anchor the VFX overlay needs
   to paint idle/hover/examined effects onto. Positions come
   from the room art prompts in
   docs/production/prelude-asset-build/prompts/rooms/ and
   the AAA_AUDIT_REPORT.md system→hotspot matrix.

   Positions are percentages of the backdrop's rendered
   dimensions (leftPct = 0 → 100 from left edge, topPct =
   0 → 100 from top edge), consistent with
   beatEHotspots.ts.

   Anchor colors drive which `vfx_hotspot_idle_<color>`
   effect the overlay runs in the idle state. Chime tones
   and the cursor reticle color follow from the color too,
   per UX_INTERACTION_SPEC.md.
   ═══════════════════════════════════════════════════════ */

export type PreludeAnchorColor =
  | "cyan"
  | "amber"
  | "red"
  | "violet"
  | "green";

export interface PreludeRoomAnchor {
  /** Stable id, used for examined-state flag lookup. */
  id: string;
  /** Human-readable name, shown in tooltip. */
  displayName: string;
  /** ARIA label for the hotspot button. */
  label: string;
  /** Room id (from PRELUDE_ROOM_ORDER in preludeRoomGate.ts). */
  roomId: string;
  /** Position on the room backdrop as percentages. */
  position: { leftPct: number; topPct: number };
  /** Idle glow color. Drives vfx_hotspot_idle_<color>. */
  color: PreludeAnchorColor;
  /**
   * Optional Elara-pip flag — true if this anchor is the
   * right-rail Elara dialog pip, not a system interaction
   * point. The overlay suppresses tutor placards for pips.
   */
  isElaraPip?: boolean;
  /** Narrative flag raised when the anchor reaches examined. */
  examinedFlag: string;
}

/* ─── CRYO-BAY ─── */

export const CRYO_BAY_STASIS_HUD: PreludeRoomAnchor = {
  id: "cryo_bay_stasis_hud",
  displayName: "Stasis HUD",
  label: "Inspect the stasis HUD panel inside the open pod",
  roomId: "cryo-bay",
  position: { leftPct: 50, topPct: 72 },
  color: "cyan",
  examinedFlag: "prelude_cryo_bay_stasis_hud_examined",
};

/* ─── BRIDGE ─── */

export const BRIDGE_HOLO_MAP: PreludeRoomAnchor = {
  id: "bridge_holo_map",
  displayName: "Captain's Holo-Map",
  label: "Inspect the Captain's holographic map table",
  roomId: "bridge",
  position: { leftPct: 50, topPct: 58 },
  color: "cyan",
  examinedFlag: "prelude_bridge_holo_map_examined",
};

/* ─── MEDICAL-BAY ─── */

export const MEDICAL_BAY_PET_CAPSULE: PreludeRoomAnchor = {
  id: "medical_bay_pet_capsule",
  displayName: "Pet Stasis Capsule",
  label: "Approach the pet stasis capsule",
  roomId: "medical-bay",
  position: { leftPct: 18, topPct: 58 },
  color: "amber",
  examinedFlag: "prelude_medical_bay_pet_capsule_examined",
};

/* ─── MESS-HALL ─── */

export const MESS_HALL_BEACON_TROLLEY: PreludeRoomAnchor = {
  id: "mess_hall_beacon_trolley",
  displayName: "Beacon Operator Trolley",
  label: "Operate the crew beacon trolley",
  roomId: "mess-hall",
  position: { leftPct: 82, topPct: 60 },
  color: "cyan",
  examinedFlag: "prelude_mess_hall_beacon_examined",
};

/* ─── COMMS-ARRAY ─── */

export const COMMS_ARRAY_HUMAN_SIGNAL_PANEL: PreludeRoomAnchor = {
  id: "comms_array_human_signal_panel",
  displayName: "Human Signal Panel",
  label: "Inspect the corrupted-red signal panel",
  roomId: "comms-array",
  position: { leftPct: 22, topPct: 48 },
  color: "red",
  examinedFlag: "prelude_comms_array_human_signal_examined",
};

/* ─── OBSERVATION-DECK ─── */

export const OBSERVATION_DECK_VORTEX_RIFT: PreludeRoomAnchor = {
  id: "observation_deck_vortex_rift",
  displayName: "Vortex Rift",
  label: "Observe the Vortex rift through the dome",
  roomId: "observation-deck",
  position: { leftPct: 68, topPct: 28 },
  color: "violet",
  examinedFlag: "prelude_observation_deck_vortex_examined",
};

export const OBSERVATION_DECK_TELESCOPE: PreludeRoomAnchor = {
  id: "observation_deck_telescope",
  displayName: "Brass Telescope",
  label: "Look through the brass telescope",
  roomId: "observation-deck",
  position: { leftPct: 26, topPct: 62 },
  color: "cyan",
  examinedFlag: "prelude_observation_deck_telescope_examined",
};

/* ─── ELARA PIP (every room) ─── */

/**
 * The right-rail Elara holo-pip. One anchor per room, same
 * position. Rendered wherever `roomDialogs.ts` has dialog
 * entries for the current room.
 */
export function elaraPipForRoom(roomId: string): PreludeRoomAnchor {
  return {
    id: `elara_pip_${roomId.replace(/-/g, "_")}`,
    displayName: "Elara",
    label: "Speak with Elara",
    roomId,
    position: { leftPct: 92, topPct: 18 },
    color: "cyan",
    isElaraPip: true,
    examinedFlag: `prelude_${roomId.replace(/-/g, "_")}_elara_pip_seen`,
  };
}

/* ─── AGGREGATE LOOKUP ─── */

export const PRELUDE_ROOM_ANCHORS: readonly PreludeRoomAnchor[] = [
  CRYO_BAY_STASIS_HUD,
  BRIDGE_HOLO_MAP,
  MEDICAL_BAY_PET_CAPSULE,
  MESS_HALL_BEACON_TROLLEY,
  COMMS_ARRAY_HUMAN_SIGNAL_PANEL,
  OBSERVATION_DECK_VORTEX_RIFT,
  OBSERVATION_DECK_TELESCOPE,
];

export function getAnchorsForRoom(roomId: string): readonly PreludeRoomAnchor[] {
  return PRELUDE_ROOM_ANCHORS.filter((a) => a.roomId === roomId);
}
