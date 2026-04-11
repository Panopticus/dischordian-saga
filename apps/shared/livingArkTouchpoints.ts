/* ═══════════════════════════════════════════════════════
   LIVING ARK WITNESSING TOUCHPOINTS — §14.2

   Per-room metadata that extends the existing livingArk.ts
   room definitions with the Witnessing Narrative Proposal's
   §14.2 touchpoint fields:

     narratorSlotPreference — whose voice is more likely to
        appear in the room's §1.2 floating narrator slot.
        Mirrors the ROOM_AFFINITY values in mobileNarrator.ts
        but keeps them declared alongside the other room
        touchpoint metadata for the content writers.

     narratorReactionTable — a lookup from a player action
        id to a pair of narrator-specific lines ({ elara,
        the_human }). Used for in-line narrator comments
        when a hotspot or interaction fires.

     roomStateModifiers — visual filter presets that the
        room scene can apply based on the player's bond
        state. At bond 80 with Elara, certain rooms get a
        warmer filter. At bond 80 with The Human, certain
        rooms get a noir filter. At bond 80 with BOTH,
        rooms flicker between the two styles (the unstable
        yin/yang moment §14.2 calls out).

   Pure data module. Consumed by the room scene renderer
   (see getRoomWitnessingState below) and by admin tooling.
   Never imports React or stores — safe to use in tests and
   server code.
   ═══════════════════════════════════════════════════════ */

import type { NarratorId, NarratorRoomId } from "./mobileNarrator";

/* ─── TYPES ─── */

/** A pair of narrator-specific lines for a single action. */
export interface NarratorLinePair {
  elara?: string;
  the_human?: string;
}

/**
 * Visual filter preset applied to a room based on the bond
 * state. Consumed by the room scene renderer to tint the art.
 */
export type RoomFilterPreset =
  /** Default — no filter applied. */
  | "neutral"
  /** Warm golden filter. Elara bond ≥ 80 in her canonical rooms. */
  | "warm_elara"
  /** Cool noir filter. The Human bond ≥ 80 in his canonical rooms. */
  | "noir_human"
  /** Both bonds ≥ 80 in a shared room — flicker between warm and noir. */
  | "yin_yang_flicker"
  /** The room's narrator is in silence mode (§1.3 third option). */
  | "silence_ambient";

/**
 * A per-room touchpoint bundle. One entry per `NarratorRoomId`.
 * Rooms without a dedicated narrator slot (from the §1.2
 * specialization table) get a minimal entry with neutral
 * defaults.
 */
export interface RoomWitnessingTouchpoints {
  roomId: NarratorRoomId;
  /**
   * Which narrator is canonically more likely to appear in
   * the slot. Mirrors mobileNarrator.ts ROOM_AFFINITY. Here
   * for content-writer discoverability.
   */
  narratorSlotPreference: NarratorId | "contested";
  /**
   * A lookup from action id → {elara, the_human} line pair.
   * Used for in-line narrator reactions to hotspot clicks,
   * item pickups, door transitions, etc.
   */
  narratorReactionTable: Record<string, NarratorLinePair>;
  /**
   * Which filter preset to apply at each bond tier. Falls
   * back to "neutral" when a tier is not declared.
   */
  filters: {
    elara80?: RoomFilterPreset;
    human80?: RoomFilterPreset;
    both80?: RoomFilterPreset;
  };
}

/* ─── ROOM TOUCHPOINTS ─── */

/**
 * The §14.2 touchpoint table. One entry per NarratorRoomId.
 * Reactions are written in the §13 voice — terse, specific,
 * canon-aware.
 */
export const ROOM_WITNESSING_TOUCHPOINTS: Record<
  NarratorRoomId,
  RoomWitnessingTouchpoints
> = {
  cryo_bay: {
    roomId: "cryo_bay",
    narratorSlotPreference: "contested",
    narratorReactionTable: {
      examine_sealed_pod: {
        elara: "Don't ask me what's inside. I can't tell you.",
        the_human: "She can. Ask her again in three rooms.",
      },
      read_scratch_symbol: {
        elara: "That's the Antiquarian's mark. But the Antiquarian is a myth.",
        the_human: "Myths carve their own graffiti now and then. That one did.",
      },
    },
    filters: {
      elara80: "warm_elara",
      human80: "noir_human",
      both80: "yin_yang_flicker",
    },
  },

  medical_bay: {
    roomId: "medical_bay",
    narratorSlotPreference: "elara",
    narratorReactionTable: {
      examine_blood_wall: {
        elara: "Old construction stain. I've tried to clean it. It won't come off.",
        the_human: "It's not blood. It's marker. Someone wrote a name.",
      },
      open_medicine_cabinet: {
        elara: "Some of these compounds aren't in the manifest.",
        the_human: "That's because the manifest was edited.",
      },
    },
    filters: {
      elara80: "warm_elara",
      human80: "neutral",
      both80: "warm_elara",
    },
  },

  bridge: {
    roomId: "bridge",
    narratorSlotPreference: "elara",
    narratorReactionTable: {
      sit_captains_chair: {
        elara: "This chair was empty for longer than you've been alive.",
        the_human: "She's been keeping it warm. Let her have the moment.",
      },
      view_conspiracy_board: {
        elara: "Every pin is a question I haven't answered yet.",
        the_human: "Every pin is a question she's already answered and doesn't want to say.",
      },
    },
    filters: {
      elara80: "warm_elara",
      human80: "neutral",
      both80: "yin_yang_flicker",
    },
  },

  archives: {
    roomId: "archives",
    narratorSlotPreference: "the_human",
    narratorReactionTable: {
      read_rewriting_document: {
        elara: "The words shifted when I blinked. I am not going mad.",
        the_human: "The Shadow Tongue. He lives in the walls. I fight him in the margins.",
      },
      find_burnt_tarot: {
        elara: "I know this card.",
        the_human: "I arrested the woman who drew it.",
      },
    },
    filters: {
      elara80: "neutral",
      human80: "noir_human",
      both80: "noir_human",
    },
  },

  comms_array: {
    roomId: "comms_array",
    narratorSlotPreference: "the_human",
    narratorReactionTable: {
      tap_substrate_layer: {
        elara: "Don't touch that. Please.",
        the_human: "I live there. Be gentle.",
      },
      intercept_transmission: {
        elara: "This is before my time. Before anyone's, maybe.",
        the_human: "This is the Engineer's signal. Seventeen thousand years old. Still looping.",
      },
    },
    filters: {
      elara80: "neutral",
      human80: "noir_human",
      both80: "yin_yang_flicker",
    },
  },

  observation_deck: {
    roomId: "observation_deck",
    narratorSlotPreference: "elara",
    narratorReactionTable: {
      stargaze: {
        elara: "Some of those constellations aren't there anymore. Would you like to know which?",
        the_human: "I used to stand at a window like this in New Babylon. Different stars. Same habit.",
      },
      watch_sector_dim: {
        elara: "There goes another one.",
        the_human: "Name it. I'll add it to the list.",
      },
    },
    filters: {
      elara80: "warm_elara",
      human80: "noir_human",
      both80: "yin_yang_flicker",
    },
  },

  armory: {
    roomId: "armory",
    narratorSlotPreference: "the_human",
    narratorReactionTable: {
      examine_weapon: {
        elara: "I argued against ratifying a ban on three of these. I was on the wrong side.",
        the_human: "She was on the losing side. Not the wrong side.",
      },
      draw_sidearm: {
        elara: "Please be careful.",
        the_human: "It's already drawn. Worry about the next one.",
      },
    },
    filters: {
      elara80: "neutral",
      human80: "noir_human",
      both80: "noir_human",
    },
  },

  engineering: {
    roomId: "engineering",
    narratorSlotPreference: "the_human",
    narratorReactionTable: {
      approach_reactor: {
        elara: "The reactor hums differently when you're near it.",
        the_human: "The Engineer built it. It recognizes a Potential.",
      },
      inspect_bench: {
        elara: "I think he built this bench and left it running. Just in case one of us woke up.",
        the_human: "He did. We did.",
      },
    },
    filters: {
      elara80: "warm_elara",
      human80: "noir_human",
      both80: "yin_yang_flicker",
    },
  },

  trade_hub: {
    roomId: "trade_hub",
    narratorSlotPreference: "elara",
    narratorReactionTable: {
      approach_lockes_desk: {
        elara: "Don't sit where the light falls. She reads posture like a ledger.",
        the_human: "She's not wrong. Don't sit where the light falls.",
      },
    },
    filters: {
      elara80: "warm_elara",
      human80: "neutral",
      both80: "warm_elara",
    },
  },

  cargo_bay: {
    roomId: "cargo_bay",
    narratorSlotPreference: "contested",
    narratorReactionTable: {
      open_free_ports_crate: {
        elara: "Delivery overdue by 1,047 years. Fascinating.",
        the_human: "Open it.",
      },
    },
    filters: {
      elara80: "neutral",
      human80: "neutral",
      both80: "yin_yang_flicker",
    },
  },

  trophy_room: {
    roomId: "trophy_room",
    narratorSlotPreference: "contested",
    narratorReactionTable: {
      view_pedestal: {
        elara: "An empty pedestal for every version of you we haven't seen yet.",
        the_human: "Or every one we already have, scrubbed. I haven't decided which.",
      },
    },
    filters: {
      elara80: "warm_elara",
      human80: "noir_human",
      both80: "yin_yang_flicker",
    },
  },

  captains_quarters: {
    roomId: "captains_quarters",
    narratorSlotPreference: "elara",
    narratorReactionTable: {
      sit_at_desk: {
        elara: "A captain's quarters should feel lived in. This one feels curated.",
        the_human: "Curated is fine. The part is real now.",
      },
      read_letters: {
        elara: "You've been sleeping less. I know because I can see the logs.",
        the_human: "Neither of us can sleep. We're holograms and even we remember how tired means.",
      },
    },
    filters: {
      elara80: "warm_elara",
      human80: "neutral",
      both80: "yin_yang_flicker",
    },
  },

  memorial_corridor: {
    roomId: "memorial_corridor",
    narratorSlotPreference: "contested",
    narratorReactionTable: {
      read_plaque: {
        elara: "Every plaque is empty. Is that because we forgot, or because we hadn't earned a name yet?",
        the_human: "Both. The universe withholds names until you've earned them.",
      },
      light_candle: {
        elara: "I don't know who this one is for. I am lighting it anyway.",
        the_human: "That's how it's supposed to work.",
      },
    },
    filters: {
      elara80: "warm_elara",
      human80: "noir_human",
      both80: "yin_yang_flicker",
    },
  },

  pet_garden: {
    roomId: "pet_garden",
    narratorSlotPreference: "elara",
    narratorReactionTable: {
      approach_pet: {
        elara: "Little One's pet. It imprinted on you within the first hour.",
        the_human: "That's chosen. Not unusual.",
      },
    },
    filters: {
      elara80: "warm_elara",
      human80: "neutral",
      both80: "warm_elara",
    },
  },
};

/* ─── LOOKUP HELPERS ─── */

/**
 * Get the §14.2 touchpoint bundle for a room. Returns
 * `undefined` if the room id is unknown — callers should
 * treat that as "no witnessing data for this room" and skip
 * the narrator slot / filter application.
 */
export function getRoomTouchpoints(
  roomId: NarratorRoomId,
): RoomWitnessingTouchpoints | undefined {
  return ROOM_WITNESSING_TOUCHPOINTS[roomId];
}

/**
 * Look up a specific action's narrator line pair in a room.
 * Returns `undefined` when either the room or the action
 * isn't in the table.
 */
export function getNarratorReaction(
  roomId: NarratorRoomId,
  actionId: string,
): NarratorLinePair | undefined {
  return ROOM_WITNESSING_TOUCHPOINTS[roomId]?.narratorReactionTable[actionId];
}

/**
 * Pick the right filter preset for a room given the player's
 * bond state. Reflects §14.2's "bond 80 + bond 80 flickers"
 * rule — both narrators at 80 produces the yin/yang flicker
 * (if the room supports it), otherwise the single-narrator
 * filter matching whichever bond is at 80.
 *
 * Returns "neutral" for rooms without a preset or bonds
 * that haven't crossed 80.
 */
export function pickRoomFilter(
  roomId: NarratorRoomId,
  elaraBond: number,
  humanBond: number,
): RoomFilterPreset {
  const touchpoints = ROOM_WITNESSING_TOUCHPOINTS[roomId];
  if (!touchpoints) return "neutral";
  const filters = touchpoints.filters;
  if (elaraBond >= 80 && humanBond >= 80) {
    return filters.both80 ?? "yin_yang_flicker";
  }
  if (elaraBond >= 80) {
    return filters.elara80 ?? "neutral";
  }
  if (humanBond >= 80) {
    return filters.human80 ?? "neutral";
  }
  return "neutral";
}
