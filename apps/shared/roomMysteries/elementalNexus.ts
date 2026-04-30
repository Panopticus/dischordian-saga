/* ═══════════════════════════════════════════════════════
   ELEMENTAL NEXUS MYSTERY — elemental-orrery + node-pillar

   Two-hotspot module. Sets nexus_seen on first-look at the
   elemental-orrery. Universal room.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type ElementalNexusHotspotId = "elemental-orrery" | "node-pillar";

export const ELEMENTAL_NEXUS_MYSTERY: RoomMysteryModule<ElementalNexusHotspotId> = {
  roomId: "elemental-nexus",
  responses: {
    "elemental-orrery": {
      look: {
        narration: {
          lucid:
            "The orrery at the room's centre is a brass-armatured model of the eight elemental relations — four DeMagi (earth/fire/water/air) and four Quarchon (space/time/probability/reality), each represented by a small luminous sphere on a slow orbit. The spheres orbit around an empty centre. There is no ninth.",
          fragmented:
            "No ninth. No ninth. No ninth. Why is there no ninth.",
          luminous:
            "The orrery is the ship's working model of the elemental relations. The empty centre is deliberate — the Ne-Yon hybrids are the un-elemented witness around which the eight orbit. The empty centre is the audience the orrery is performing for. We are, in the room with the orrery, occupying the position the model was designed to hold.",
        },
        voId: "elara.elemental-nexus.elemental-orrery.look",
        setsFlag: "nexus_seen",
        logsClue: {
          id: "clue-nexus-empty-centre",
          title: "The orrery's empty centre is the audience position",
          body:
            "The Elemental Nexus's orrery has no ninth element at its centre — the empty position is deliberate. The eight elemental orbits perform for an un-elemented witness. The Ne-Yon hybrids occupy that position cosmologically; any visitor occupies it physically when standing in the room.",
          source: "elemental-nexus",
          order: 0,
        },
      },
    },
    "node-pillar": {
      look: {
        narration: {
          lucid:
            "The node-pillar at the back is a fluted brass column with eight horizontal slots — one per element. Three slots currently hold a small etched-glass disc; five are empty. Whoever ran this nexus was halfway through assembling a complete set.",
          fragmented:
            "Three. Five. Three of eight. Five missing. Five missing.",
          luminous:
            "The pillar collects element-discs. Three of eight are present — earth, water, time. Five are missing — fire, air, space, probability, reality. The discs are not, on my best read, decorative. They are, on Lyra's working notes (on the bridge, behind the captain's chair), a navigational aid for moving between elemental aspects of the same space. Half-assembled, the pillar is half-functional. Whoever was assembling them is, presumably, the same person Lyra trusted with the case.",
        },
        voId: "elara.elemental-nexus.node-pillar.look",
        logsClue: {
          id: "clue-nexus-half-assembled-pillar",
          title: "Three of eight elemental discs assembled",
          body:
            "The Elemental Nexus's node-pillar holds three of eight element-discs (earth, water, time). The discs are a navigational aid per Lyra Vox's bridge notes — half-assembled, the pillar is half-functional. Whoever was assembling them is presumably the same person Lyra trusted with the case (likely Wraith Calder).",
          source: "elemental-nexus",
          order: 1,
        },
      },
    },
  },
};
