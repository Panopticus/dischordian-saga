/* ═══════════════════════════════════════════════════════
   ENGINEERING CORE MYSTERY — reactor coil + coolant + terminal

   Three-hotspot module for the deck-5 reactor heart-vault.
   Sets eng_core_introduced on first-look at the reactor-coil.
   Universal room.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type EngineeringCoreHotspotId =
  | "reactor-coil"
  | "coolant-pipe"
  | "core-terminal";

export const ENGINEERING_CORE_MYSTERY: RoomMysteryModule<EngineeringCoreHotspotId> = {
  roomId: "engineering-core",
  responses: {
    "reactor-coil": {
      look: {
        narration: {
          lucid:
            "The reactor coil rises through the floor grating to chest-height — a ribbed brass-and-steel column running phosphor-green coolant through transparent ducts. The pulse at the base is steady. The hardware is nominal. The schematic in engineering, as we now know, is the part that has been edited.",
          fragmented:
            "The hardware is nominal. The hardware is nominal. The hardware is nominal. He didn't touch the hardware.",
          luminous:
            "The coil is fine. He has, on the evidence, never touched the hardware — only the documentation. That is, in retrospect, the entire shape of his discipline. He does not break things. He breaks the way things are described, so that the next person who has to understand them has to understand them through his version. The coil is intact. The coil's manual is the danger.",
        },
        voId: "elara.engineering-core.reactor-coil.look",
        setsFlag: "eng_core_introduced",
        logsClue: {
          id: "clue-eng-core-hardware-intact",
          title: "Reactor hardware is nominal; only the documentation was edited",
          body:
            "The Engineering Core's reactor coil is operating within nominal parameters. The Editor has never touched the physical hardware on this ship — only the documentation. His discipline is to break the way things are described, not the things themselves.",
          source: "engineering-core",
          order: 0,
        },
      },
    },
    "coolant-pipe": {
      look: {
        narration: {
          lucid:
            "The coolant-pipe array runs along the back wall, six lines feeding the secondary loop. The secondary-loop pipes carry the connections the editor redirected on the schematic. The pipes themselves are correct. A future repair would have rerouted them according to the indigo overlayer.",
          fragmented:
            "The pipes are correct. The pipes are correct. The pipes are correct. The repair would not have been.",
          luminous:
            "The coolant pipes are the editor's longest game. Anyone reading the engineering-bay schematic without an original-rubbing would, on the next major repair, reroute the coolant to the lines the indigo overlayer redirected. The reactor would, slowly, run hot. It would die in a year or so. The death would be blamed on the schematic, not on the editor. We have just spared the next engineer that confusion.",
        },
        voId: "elara.engineering-core.coolant-pipe.look",
        logsClue: {
          id: "clue-eng-core-coolant-future-repair",
          title: "Coolant lines would die in the next major repair",
          body:
            "The Engineering Core's coolant-pipe array is correctly routed. Any future repair following the editor's edited schematic (without an original-rubbing) would reroute the coolant to break the secondary loop, killing the reactor over roughly a year. The death would be blamed on the schematic, not on the editor.",
          source: "engineering-core",
          order: 1,
        },
      },
    },
    "core-terminal": {
      look: {
        narration: {
          lucid:
            "The core-terminal is a brass console with three oxblood-leather levers — coolant flow, reactor draw, and emergency shutdown. The shutdown lever has an extra lock-plate fitted, signed in Lyra's hand: 'DO NOT THROW WITHOUT WRAITH PRESENT.' Wraith is, currently, not present.",
          fragmented:
            "Wraith. Wraith. Wraith. Without Wraith. Without Wraith. Don't throw without Wraith.",
          luminous:
            "Lyra signed a lock-plate on the emergency shutdown ordering it not be thrown without Wraith Calder in the room. That is unusual — most shutdown procedures require any single qualified engineer. Lyra's procedure required a specific person. She trusted Wraith to be the one who would, in a crisis, also be the one telling her to throw it. She did not, in retrospect, get to throw it. Wraith was already on his transport.",
        },
        voId: "elara.engineering-core.core-terminal.look",
        logsClue: {
          id: "clue-eng-core-shutdown-lockplate",
          title: "Emergency shutdown locked to Wraith Calder's presence",
          body:
            "The Engineering Core's emergency shutdown lever bears Lyra Vox's lock-plate ordering it not be thrown without Wraith Calder present. Lyra's safety protocol required a specific person, not any qualified engineer. She did not get to throw it; Wraith was already on his transport when she died.",
          source: "engineering-core",
          order: 2,
        },
      },
    },
  },
};
