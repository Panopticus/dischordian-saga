/* ═══════════════════════════════════════════════════════
   §11.5 VORTEX ENDGAME — INCURSION TEMPLATE

   Data shell for the community §11.5 "push back the Vortex"
   endgame event. Reuses the existing apps/shared/incursions.ts
   IncursionRoomDef shape — a 10-room co-op dungeon with
   mini-Vortex at Room 5 and the full Vortex at Room 10.

   Not yet wired into the runtime Incursion pool. Consumers
   that want to spawn a Vortex Incursion should read
   VORTEX_INCURSION_ROOMS as the canonical template.

   The community-wide progress counter (how much Vortex
   territory has been reclaimed) is tracked by the
   dischordiaCycleStore, not by the Incursion itself. Each
   successful Vortex Incursion raises `vortex_room_cleared`
   which feeds into §14.1 "A Sector Wakes" milestone.
   ═══════════════════════════════════════════════════════ */

import type { IncursionRoomDef } from "./incursions";

/**
 * The canonical 10-room Vortex Incursion template.
 * Room indexes are 0-based:
 *   0-3  Approach  — drifting into Vortex territory
 *   4    Mini-boss — the first Vortex sentinel
 *   5    Vortex echo — the mini-Vortex encounter
 *   6-8  Incursion — fighting deeper into the Vortex
 *   9    Vortex Core — community beat
 */
export const VORTEX_INCURSION_ROOMS: readonly IncursionRoomDef[] = [
  {
    key: "vortex_approach_1",
    name: "The Silent Drift",
    description:
      "The stars thin out here. Something is eating the light. You haven't seen it yet.",
    icon: "Wind",
    type: "combat",
    difficultyMod: 1.0,
    buff: {
      key: "vortex_approach_resolve",
      label: "Resolve of the Witness",
      icon: "Shield",
      stat: "damage_mult",
      value: 0.05,
      stackable: true,
    },
    loot: [
      {
        category: "dream_tokens",
        itemKey: "dream_tokens",
        name: "Dream Tokens",
        dropRate: 1,
        minRoom: 0,
      },
    ],
  },
  {
    key: "vortex_approach_2",
    name: "Where the Voices Used To Be",
    description:
      "A communication relay half-swallowed by Vortex static. The last transmission is stuck on loop: a child counting to ten, never reaching nine.",
    icon: "Radio",
    type: "puzzle",
    puzzleVariant: "cipher",
    difficultyMod: 1.1,
    buff: {
      key: "vortex_signal_clarity",
      label: "Signal Clarity",
      icon: "Activity",
      stat: "puzzle_time_mult",
      value: 0.3,
      stackable: false,
    },
    loot: [
      {
        category: "crafting_material",
        itemKey: "memory_shard",
        name: "Memory Shard",
        dropRate: 0.8,
        minRoom: 1,
      },
    ],
  },
  {
    key: "vortex_approach_3",
    name: "The Chapel of Lost Names",
    description:
      "An Atarion shrine in the middle of nothing. Every inscription is partially erased. The player can place one name on the wall. Only one.",
    icon: "Landmark",
    type: "card",
    difficultyMod: 1.2,
    buff: {
      key: "vortex_witness_bond",
      label: "Witness Bond",
      icon: "Heart",
      stat: "heal_on_enter",
      value: 1.0,
      stackable: false,
    },
    loot: [
      {
        category: "cosmetic_fragment",
        itemKey: "chapel_fragment",
        name: "Chapel Fragment",
        dropRate: 0.6,
        minRoom: 2,
      },
    ],
  },
  {
    key: "vortex_approach_4",
    name: "The First Thing That Noticed You",
    description:
      "A Vortex sentry made of frayed light and remembered grudges. It is polite. It asks for your name before it attacks.",
    icon: "Eye",
    type: "combat",
    difficultyMod: 1.5,
    buff: {
      key: "vortex_seen",
      label: "Seen",
      icon: "EyeOff",
      stat: "loot_mult",
      value: 0.2,
      stackable: true,
    },
    loot: [
      {
        category: "void_crystal",
        itemKey: "void_crystal",
        name: "Void Crystal",
        dropRate: 0.7,
        minRoom: 3,
      },
    ],
  },
  {
    key: "vortex_mini_boss",
    name: "The Vortex Sentinel — Firstborn",
    description:
      "The first Vortex sentinel the Ark has ever seen up close. A halo of dead stars. It does not speak; its body is a record of everything it has erased.",
    icon: "Swords",
    type: "boss",
    difficultyMod: 2.5,
    buff: {
      key: "sentinel_down",
      label: "Sentinel Down",
      icon: "Zap",
      stat: "stamina_refund",
      value: 1.0,
      stackable: false,
    },
    loot: [
      {
        category: "equipment",
        itemKey: "sentinel_core",
        name: "Sentinel Core",
        dropRate: 1,
        minRoom: 4,
      },
    ],
  },
  {
    key: "vortex_echo",
    name: "The Mini-Vortex",
    description:
      "A pocket of Vortex space small enough to step into and large enough to lose an hour inside. Two Arks have walked into it and one has come out.",
    icon: "CircleDashed",
    type: "puzzle",
    puzzleVariant: "sequence",
    difficultyMod: 2.0,
    buff: {
      key: "echo_survived",
      label: "Echo Survived",
      icon: "Sparkles",
      stat: "memory_mult",
      value: 0.25,
      stackable: true,
    },
    loot: [
      {
        category: "crafting_material",
        itemKey: "vortex_glass",
        name: "Vortex Glass",
        dropRate: 0.9,
        minRoom: 5,
      },
    ],
  },
  {
    key: "vortex_deep_1",
    name: "The Unmaking Garden",
    description:
      "A plaza where flowers used to grow. They still do — but only in the negative space, only when you look away. The Vortex remembers gardens.",
    icon: "Flower",
    type: "combat",
    difficultyMod: 1.8,
    buff: {
      key: "garden_bloom",
      label: "Garden Bloom",
      icon: "Flower",
      stat: "bond_mult",
      value: 1.0,
      stackable: false,
    },
    loot: [
      {
        category: "crafting_material",
        itemKey: "petals_of_then",
        name: "Petals of Then",
        dropRate: 0.75,
        minRoom: 6,
      },
    ],
  },
  {
    key: "vortex_deep_2",
    name: "The Library of Erased Books",
    description:
      "Shelves of books the Vortex has already unwritten. The spines are blank. If you read one, you forget something you knew.",
    icon: "BookOpen",
    type: "card",
    difficultyMod: 1.7,
    buff: {
      key: "erased_wisdom",
      label: "Erased Wisdom",
      icon: "BookOpen",
      stat: "card_draw_bonus",
      value: 2,
      stackable: true,
    },
    loot: [
      {
        category: "crafting_material",
        itemKey: "lost_ink",
        name: "Lost Ink",
        dropRate: 0.7,
        minRoom: 7,
      },
    ],
  },
  {
    key: "vortex_deep_3",
    name: "The Last Stable Room",
    description:
      "A quiet chamber inside the Vortex that has somehow refused to be consumed. It feels like the Ark. It smells like the Ark. It is not the Ark.",
    icon: "Home",
    type: "treasure",
    difficultyMod: 1.4,
    buff: {
      key: "stable_respite",
      label: "Stable Respite",
      icon: "Heart",
      stat: "heal_and_buff",
      value: 0.1,
      stackable: false,
    },
    loot: [
      {
        category: "cosmetic_fragment",
        itemKey: "respite_fragment",
        name: "Respite Fragment",
        dropRate: 0.85,
        minRoom: 8,
      },
    ],
  },
  {
    key: "vortex_core",
    name: "The Vortex Itself",
    description:
      "The encounter the whole season has been about. Not a boss fight — a negotiation with a thing that does not stop eating. The community progress counter advances by 1 if the room is cleared, AND by 1 for every other Ark that also cleared a Vortex room this week.",
    icon: "Crosshair",
    type: "boss",
    difficultyMod: 5.0,
    buff: {
      key: "vortex_held",
      label: "Vortex Held",
      icon: "Crown",
      stat: "server_light_mult",
      value: 0.1,
      stackable: false,
    },
    loot: [
      {
        category: "equipment",
        itemKey: "vortex_core_shard",
        name: "Vortex Core Shard",
        dropRate: 1,
        minRoom: 9,
      },
      {
        category: "cosmetic_fragment",
        itemKey: "witness_laurel",
        name: "Witness Laurel",
        dropRate: 1,
        minRoom: 9,
      },
    ],
  },
];

/**
 * Community progress counter — §11.5 Vortex pushback. Each
 * successful Vortex Incursion clear raises this by 1 for the
 * player AND emits a server-wide ripple. The dischordiaCycle
 * store aggregates the global total.
 */
export const VORTEX_PROGRESS_RIPPLE_EVENT = "vortex_room_cleared";

export function listVortexIncursionRooms(): readonly IncursionRoomDef[] {
  return VORTEX_INCURSION_ROOMS;
}
