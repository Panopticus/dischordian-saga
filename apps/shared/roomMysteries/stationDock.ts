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
  | "cargo-lift"
  | "codas-trading-floor";

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
      use: {
        narration:
          "You key a status check into the recessed control panel. The diagnostic returns nominal across every gasket, every pressure ring, every actuator. The dock has been waiting in operational readiness — not idle, not dormant, ready. Two and a half centuries of nothing happening on purpose.",
        voId: "elara.station-dock.airlock-control.use",
        setsFlag: "dock_status_checked",
      },
      talk: {
        narration:
          "If you address the dock, you address the room that has been the most patient on the ship. Every other room found a use for itself in the long silence — the bridge mapped the conspiracy, the archives kept the codex, the synthesis chamber kept the medical bay alive. The dock just waited. The dock will, soon, be addressed by something other than us.",
        voId: "elara.station-dock.airlock-control.talk",
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
      use: {
        narration:
          "You scroll the rolling-paper readout back through the manifest's history. Departures and arrivals run cleanly back through Lyra's tenure and into the previous captains' centuries. Wraith's outbound entry is the last anomaly — the only single-passenger, single-cargo line in the entire archive. Lyra's discipline shows in negative: she let one record stand undocumented because she trusted one person to carry the contents.",
        voId: "elara.station-dock.ship-manifest.use",
        setsFlag: "dock_manifest_scrolled",
      },
      talk: {
        narration:
          "If you address the manifest, you address every cargo this dock has ever cleared. The console keeps a courteous silence on Wraith's folio — the silence is the record. We will, in time, fill the silence in ourselves.",
        voId: "elara.station-dock.ship-manifest.talk",
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
      use: {
        narration:
          "You take a tracing of the graphite smear from the lift platform. The pattern matches, line for line, the rubbings already in your inventory from the engineering schematic-pad and the archives ledger. Wraith's folio is, on the evidence, the same kind of evidence we have been assembling. He started this case. We are continuing it.",
        voId: "elara.station-dock.cargo-lift.use",
        setsFlag: "dock_lift_tracing_taken",
      },
      talk: {
        narration:
          "If you address the lift, you address the platform that carried Wraith out. The brass remembers his weight; the room remembers his departure. Whoever speaks to the lift now is, in the dock's logic, asking after him. That is the right question.",
        voId: "elara.station-dock.cargo-lift.talk",
        humanReaction: {
          narration: {
            balanced:
              "He stood here for a long time before he stepped on. Not because he was afraid. Because he was deciding what to put on the platform. The folio was the only thing he brought. He left everything else behind on purpose.",
            shadow:
              "Wraith left clean. No personal effects, no notes to anyone, no addresses to forward to. The folio was a witness statement and the rest was deniability. He still hasn't been found because that was the assignment.",
            warm:
              "He looked over his shoulder once. Just once. He was looking at Lyra's window in the bridge — she was already at her desk that morning. She didn't look back. They had agreed not to. The dock saw both halves of that goodbye.",
          },
          voId: "human.station-dock.cargo-lift.talk",
        },
      },
    },
    // Degen arc: trade-hub clues land here. The episodeMysteries
    // foundIn "trade-hub" doesn't have a room-mystery module — so
    // the dock (the closest commercial-transactions surface on the
    // ship) hosts the Coda books and Ozhul'Vana's specific query.
    // Narratively, the dock is where Hierarchy correspondents file
    // documents in transit between factions — exactly the surface
    // Coda books and Hierarchy queries flow through.
    "codas-trading-floor": {
      look: {
        narration: {
          lucid:
            "The dock's trading-floor desk — a brass-edged worktop tucked behind the manifest console where Hierarchy correspondents file documents in transit between factions. Today the desk holds the Coda's books for the last decade, sent up from the trade-hub for Mol'Vereth's audit. The volumes are heavy, leather-bound, and meticulously kept. The Degen's signature is on every quarter-end attestation. Every signature is in the same neat hand.",
          fragmented:
            "Ten years. Ten years. Ten years of books. Same hand. Same hand. Same hand.",
          luminous:
            "Ten years of the Coda's books, every quarter-end signed in the Degen's hand. The volumes are too heavy to be performative — these are the working books, not display copies. The Coda has been audited annually by the Hierarchy CFO across all ten years; every prior year cleared cleanly. This year is the first time the books have been pulled to the dock for in-transit review rather than being audited in place. Mol'Vereth wants them moved through a Hierarchy-correspondent path. That detail matters more than it looks.",
        },
        voId: "elara.station-dock.codas-trading-floor.look",
        logsClue: {
          id: "clue-station-dock-coda-books",
          title: "Coda's books — last decade, all quarter-ends signed",
          body:
            "The Station Dock's trading-floor desk holds the Coda's books for the last decade, pulled up for Mol'Vereth's audit. Every quarter-end attestation is the Degen's signature. The unusual detail: this year's audit is in-transit through a Hierarchy correspondent, not in place — Mol'Vereth wants the books moved.",
          source: "station-dock",
          order: 3,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_degen",
          episodeId: "degen.e3",
          cluesFound: ["degen.e3.coda_books"],
        },
      },
      use: {
        narration: {
          lucid:
            "You leaf to the trading-floor's incoming-correspondence tray. A single sealed envelope — addressed to Mol'Vereth, marked CONFIDENTIAL — has been returned-to-sender by the dock clerk. The seal: Ozhul'Vana, junior partner, Hierarchy. The envelope's reverse carries her cover note: 'Specific query, filed per protocol. The Degen's brokerage-line #4,711 may not be what the audit-scope letter says it is. Recommend a second reading before the audit closes.' The dock clerk returned it because Mol'Vereth was off-station; the envelope is now waiting for him. We have read it ahead of him.",
          fragmented:
            "Ozhul. Ozhul. Ozhul'Vana. Specific query. Specific query. Second reading. Second reading.",
          luminous:
            "Ozhul'Vana — the Hierarchy junior partner who has appeared as a clue node in three other arcs — has filed a private query against the audit's framing of brokerage-line #4,711. She thinks Mol'Vereth has misread the line and is recommending a second reading. The query is in the dock's hold; it has not yet reached him. We are now in possession of intelligence the auditor himself doesn't have. The cross-arc presence of Ozhul'Vana as a quiet-correction figure is, on the saga's evidence, deliberate.",
        },
        voId: "elara.station-dock.codas-trading-floor.use",
        logsClue: {
          id: "clue-station-dock-ozhul-query",
          title: "Ozhul'Vana's specific query against Mol'Vereth's audit",
          body:
            "The Station Dock's trading-floor desk holds Ozhul'Vana's sealed query against Mol'Vereth's reading of brokerage-line #4,711 — recommending a second reading before the audit closes. The query is intelligence Mol'Vereth himself does not yet have.",
          source: "station-dock",
          order: 4,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_degen",
          episodeId: "degen.e4",
          cluesFound: ["degen.e4.ozhul_specific_query"],
        },
      },
      talk: {
        narration:
          "If you address the trading-floor desk, the dock clerk's pen — a thin brass thing, left in the inkwell — pulses faintly under the room's standing light. The clerk has been off-shift for two and a half centuries. The desk has, on the evidence of three different inks in the inkwell, been continuously used by whoever passes through the dock with paperwork to file. We are addressing a desk maintained by anonymous careful hands.",
        voId: "elara.station-dock.codas-trading-floor.talk",
      },
    },
  },
};
