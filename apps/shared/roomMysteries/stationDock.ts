/* ═══════════════════════════════════════════════════════
   STATION DOCK MYSTERY — act-2 launchpad

   Three hotspots: the airlock that opens to whichever ship
   has docked (the room's gating function), the manifest
   console (the dock's record of every arrival/departure),
   and the cargo-lift (the dock's working surface).

   First-look on the airlock-control sets dock_introduced.
   Universal room.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type StationDockHotspotId =
  | "airlock-control"
  | "ship-manifest"
  | "cargo-lift";

export const STATION_DOCK_MYSTERY: RoomMysteryModule<StationDockHotspotId> = {
  roomId: "station-dock",
  responses: {
    "airlock-control": {
      look: {
        narration: {
          lucid:
            "The airlock dominates the room — a brass-rimmed cylinder with deep-oxblood seal gaskets. The control panel beside it is recessed into a service alcove. Currently sealed, currently dark, but the panel's ready-light glows steady warm-gold. The dock is waiting.",
          fragmented:
            "The dock is waiting. The dock is waiting. The dock is waiting. The dock is waiting. Waiting. Waiting. Waiting.",
          luminous:
            "The dock is waiting for the first ship of Act 2. The Ark has not received an arrival in two and a half centuries — the seal gaskets are original, the hazard-stripe paint is original, the brass is the same brass Lyra walked past on her way to the bridge the morning she died. The room has been holding its breath. We are about to give it a reason to exhale.",
        },
        voId: "elara.station-dock.airlock-control.look",
        setsFlag: "dock_introduced",
        logsClue: {
          id: "clue-dock-waiting",
          title: "The dock is original equipment, holding two centuries of breath",
          body:
            "The Station Dock's airlock seal gaskets, hazard-stripe paint, and brass fittings are all original — unused since Lyra Vox's command. The ready-light glows steady warm-gold. The dock has been waiting for an arrival since the cryo cut.",
          source: "station-dock",
          order: 0,
        },
      },
    },
    "ship-manifest": {
      look: {
        narration: {
          lucid:
            "The manifest console is a brass slab with rolling-paper readouts. The most recent entry, dated the day before Lyra's death, reads: 'OUTBOUND — TRANSPORT W. CALDER. Single passenger. Cargo: one folio.' No subsequent arrivals or departures are logged. The next entry will be the first in two and a half centuries.",
          fragmented:
            "Wraith left. Wraith left. Wraith left. Wraith left and never came back. He took the folio. He took the folio. The folio.",
          luminous:
            "Wraith Calder left this dock the day before Lyra died, alone, carrying a folio. The folio's contents are not on the manifest — Lyra had the discipline to allow Wraith to leave with documents she would not commit to a record. She trusted him to be the only person who knew what was in his luggage. We have, perhaps, finally arrived at the room where the trust matters.",
        },
        voId: "elara.station-dock.ship-manifest.look",
        logsClue: {
          id: "clue-dock-wraith-folio-departure",
          title: "Wraith Calder left the dock with an undocumented folio",
          body:
            "The Station Dock's last manifest entry, dated the day before Lyra Vox's death, records Wraith Calder departing alone with a single folio. The folio's contents are not logged — Lyra deliberately allowed him to leave with materials she did not commit to record. No subsequent arrivals or departures have been logged.",
          source: "station-dock",
          order: 1,
        },
        // Mystery Engine binding — when Game Master arc is the
        // active case, the manifest console surfaces Xeth'Raal's
        // Goggles acquisition paperwork. Lore match: the manifest
        // is canonically a transit-of-cargo record, and the
        // Hierarchy CFO filed his custodial-collection paperwork
        // through this dock within the hour of the Game Master's
        // destruction. Same console, same discipline of not
        // logging the contents — only this time the logging gap
        // is deliberate on the Hierarchy's side, not Lyra's.
        mysteryBinding: {
          mysteryId: "mystery.game_master",
          episodeId: "game_master.e1",
          cluesFound: ["game_master.e1.xethraal_acquisition_paperwork"],
        },
      },
    },
    "cargo-lift": {
      look: {
        narration: {
          lucid:
            "The cargo-lift platform is at floor level, currently empty. It was last used to load Wraith's transport. There is a single faint smear on the platform — a graphite rubbing of the same kind we took from the engineering schematic-pad and the rewritten ledger. Wraith's folio contained rubbings.",
          fragmented:
            "Rubbings. Rubbings. Rubbings. He took rubbings. He took rubbings.",
          luminous:
            "Wraith left with a folio of rubbings. Originals he had taken from the rooms the editor had worked in — the same kind of rubbings we are now collecting. He has been doing our job for two and a half centuries, in exile, with nobody to combine the rubbings against. If he is still alive, he is still carrying that folio. Locating him is, suddenly, the case's most important practical task.",
        },
        voId: "elara.station-dock.cargo-lift.look",
        logsClue: {
          id: "clue-dock-wraith-rubbings",
          title: "Wraith Calder left with a folio of rubbings",
          body:
            "The Station Dock's cargo-lift platform shows a faint graphite smear matching the rubbings the player has been collecting. Wraith Calder departed with a folio of original-rubbings — the editor's victims, preserved. He has been doing the same work in exile for two and a half centuries with no combine partner. Locating Wraith is the case's most important practical objective.",
          source: "station-dock",
          order: 2,
        },
      },
    },
  },
};
