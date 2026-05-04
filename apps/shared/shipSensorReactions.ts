/* ═══════════════════════════════════════════════════════
   SHIP SENSOR REACTIONS — The Living Ship as Living Universe Sensor

   Before a Living Universe event becomes visible in any menu,
   the Ark FEELS it. Bulkheads creak in ArkExplorerPage. Lights
   flicker. A specific room goes red-tinted. Elara's voice catches
   mid-sentence and she says one canonical line.

   The player can investigate. Going to the affected room triggers
   a brief scene with the relevant NPC explaining the shift. THAT
   scene is the tutorial for whatever new mechanic the Living
   Universe just unlocked. The ship teaches by reacting.

   Canon-grounded in Engineer Recording 7 — "the bench hums; the
   Deck remembers." The Engineer wove his consciousness into the
   substrate when he died. The Ark is alive because of him.

   This file maps Living Universe event IDs to their ship-sensor
   reaction. It is additive — no existing EmergentEvent is touched.

   See plan §9 (The Living Ship Reveals the Living Universe).
   ═══════════════════════════════════════════════════════ */

import type { RoomId } from "./arkEventHandler";

/** Visual reaction patterns the Ark exhibits when it senses an event. */
export type SensorPattern =
  | "creak"             // bulkheads shift; subtle, anywhere
  | "flicker"           // lights stutter; obvious to the player
  | "red_tint"          // the affected room turns red-tinted
  | "frost_bloom"       // hull-side condensation; cold events
  | "low_thrum"         // sub-audible vibration; the bench resonating
  | "static_burst"      // comms hiss; substrate-adjacent events
  | "lights_dim"        // lights fade by half; mournful events
  | "lights_warm";      // lights warm; Dreamer-aligned events

/** Audibility band of Elara's catch-line. */
export type ElaraCatchBand =
  | "whispered"   // half-volume, the Ark spoke through her
  | "spoken"      // her normal voice, but mid-sentence
  | "broken";     // her voice catches; reserved for major shifts

/**
 * One ship-reaction entry. Wired to a Living Universe event ID.
 * Multiple reactions per event are allowed — the engine fires the
 * highest-priority reaction the player has the prerequisites for.
 */
export interface ShipSensorReaction {
  /** Living Universe event id this reaction belongs to. */
  readonly eventId: string;
  /** Internal label for narrative tooling. */
  readonly label: string;
  /** Which room goes affected. The NPC the player meets there teaches the new mechanic. */
  readonly affectedRoomId: RoomId;
  /** The visual sensor pattern shown in ArkExplorerPage. */
  readonly pattern: SensorPattern;
  /** Audibility band of Elara's catch-line. */
  readonly elaraBand: ElaraCatchBand;
  /** The line Elara catches mid-sentence to say. */
  readonly elaraCatchLine: string;
  /**
   * The NPC ID the player meets in the affected room when they go investigate.
   * The investigation scene is the tutorial for the new mechanic that just unlocked.
   */
  readonly investigatorNpcId: string;
  /**
   * Mechanic id (free-form) the investigation scene teaches.
   * Authors writing investigation scenes hook on this id.
   */
  readonly teachesMechanicId: string;
  /**
   * Priority. When multiple reactions are eligible, the highest priority fires.
   * Default 0; only override for narrative-critical reactions.
   */
  readonly priority: number;
}

/* ─── REACTIONS ─── */

export const SHIP_SENSOR_REACTIONS: readonly ShipSensorReaction[] = [
  {
    eventId: "necromancer_return",
    label: "The Necromancer Returns — frost on the medical bay",
    affectedRoomId: "medical_bay",
    pattern: "frost_bloom",
    elaraBand: "broken",
    elaraCatchLine: "Something just changed. I felt it through the hull — the medical bay is… cold. He's coming.",
    investigatorNpcId: "the_necromancer",
    teachesMechanicId: "prestige_system",
    priority: 5,
  },
  {
    eventId: "dreamer_awakening",
    label: "The Dreamer Awakens — observation deck warms",
    affectedRoomId: "observation_deck",
    pattern: "lights_warm",
    elaraBand: "whispered",
    elaraCatchLine: "She… she's louder. I felt her through the hull. She wants you on the observation deck.",
    investigatorNpcId: "the_dreamer",
    teachesMechanicId: "morality_dream_balance",
    priority: 5,
  },
  {
    eventId: "terminus_advance",
    label: "Terminus Advance — comms array static",
    affectedRoomId: "comms_array",
    pattern: "static_burst",
    elaraBand: "spoken",
    elaraCatchLine: "Something just changed. The Source moved. Comms array is bleeding — go listen.",
    investigatorNpcId: "the_source_kael",
    teachesMechanicId: "pet_breeding_genetics",
    priority: 4,
  },
  {
    eventId: "antiquarian_revelation",
    label: "The Antiquarian Reveals — archives warm and dim",
    affectedRoomId: "archives",
    pattern: "lights_dim",
    elaraBand: "spoken",
    elaraCatchLine: "Something just changed. He's cataloguing again. The archives are… quiet. Too quiet. Go.",
    investigatorNpcId: "the_antiquarian",
    teachesMechanicId: "loredex_hidden_timelines",
    priority: 3,
  },
  {
    eventId: "shadow_tongue_edit",
    label: "Shadow Tongue Edits — bridge red-tinted",
    affectedRoomId: "bridge",
    pattern: "red_tint",
    elaraBand: "broken",
    elaraCatchLine: "Something just— I felt that through the hull. He's editing the canon again. The bridge knows. Go up.",
    investigatorNpcId: "shadow_tongue",
    teachesMechanicId: "loredex_propaganda_layer",
    priority: 4,
  },
  {
    eventId: "vox_revelation",
    label: "Vox Revelation — captain's quarters thrums low",
    affectedRoomId: "captains_quarters",
    pattern: "low_thrum",
    elaraBand: "whispered",
    elaraCatchLine: "The bench is humming. Engineer's old setting — the one he used when he wanted you to listen. Go to your quarters.",
    investigatorNpcId: "the_engineer",
    teachesMechanicId: "engineer_logs_annotations",
    priority: 5,
  },
  {
    eventId: "potentials_remember_origin",
    label: "Potentials Remember — cryo bay creaks",
    affectedRoomId: "cryo_bay",
    pattern: "creak",
    elaraBand: "spoken",
    elaraCatchLine: "Something just changed. Twelve thousand pods just… moved. Go down. They want to be remembered.",
    investigatorNpcId: "the_human",
    teachesMechanicId: "potential_origin_reveal",
    priority: 3,
  },
  {
    eventId: "convergence_threshold",
    label: "Convergence Threshold — the entire Ark flickers",
    affectedRoomId: "bridge",
    pattern: "flicker",
    elaraBand: "broken",
    elaraCatchLine: "Everything just changed. All of it. I'm — I'm holding the hull together. Bridge. Now. Both narrators. Please.",
    investigatorNpcId: "elara_and_human",
    teachesMechanicId: "convergence_bridge",
    priority: 10,
  },
];

/* ─── LOOKUP HELPERS ─── */

export function getReactionsForEvent(eventId: string): readonly ShipSensorReaction[] {
  return SHIP_SENSOR_REACTIONS.filter((r) => r.eventId === eventId);
}

/**
 * Pick the highest-priority reaction for a given event. Returns undefined
 * if no reaction is registered.
 */
export function getPrimaryReactionForEvent(eventId: string): ShipSensorReaction | undefined {
  const reactions = getReactionsForEvent(eventId);
  if (reactions.length === 0) return undefined;
  return [...reactions].sort((a, b) => b.priority - a.priority)[0];
}

/**
 * Reverse lookup — what events would affect a given room? Useful for
 * room-side hooks that want to know if they're in a "Living Ship is
 * sensing something" state.
 */
export function getReactionsForRoom(roomId: RoomId): readonly ShipSensorReaction[] {
  return SHIP_SENSOR_REACTIONS.filter((r) => r.affectedRoomId === roomId);
}
