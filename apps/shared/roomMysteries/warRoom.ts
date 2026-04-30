/* ═══════════════════════════════════════════════════════
   WAR ROOM MYSTERY — command silence between briefings

   Three hotspots: the dormant holo-table that lights up
   when act 2 opens, the casualty-board archive (the room's
   memory of every name lost), and the signal-flag rack
   (the room's record of every faction Lyra negotiated with
   in person rather than through an intermediary).

   Universal room.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type WarRoomHotspotId =
  | "holo-table"
  | "casualty-board"
  | "signal-flag-rack";

export const WAR_ROOM_MYSTERY: RoomMysteryModule<WarRoomHotspotId> = {
  roomId: "war-room",
  responses: {
    "holo-table": {
      look: {
        narration: {
          lucid:
            "The holo-table's surface is matte glass, currently dark. A small brass dial at its edge labels the room's three operating modes: BRIEFING, RECON, OBITUARY. The dial is set to BRIEFING. The table will not light until a briefing is convened.",
          fragmented:
            "Three modes. Three. Briefing. Recon. Obituary. Three. Three. Three.",
          luminous:
            "The room has three modes. Briefing convenes the crew around a live theatre map. Recon shows the territory we are scouting. Obituary lists every name we have lost on a particular operation, organised by who they died for. Lyra had the dial set to OBITUARY for the last six months of her life. She had the discipline to leave it on the mode that made her face the consequence before she planned the next move. I find that admirable in a way I am only now allowing myself to feel.",
        },
        voId: "elara.war-room.holo-table.look",
        setsFlag: "war_room_introduced",
        logsClue: {
          id: "clue-war-room-three-modes",
          title: "The War Room dial: BRIEFING / RECON / OBITUARY",
          body:
            "The War Room's holo-table has a three-position brass dial. Lyra Vox kept the dial on OBITUARY for the last six months of her command — facing the consequence before planning the next move. The current setting is BRIEFING, awaiting convening.",
          source: "war-room",
          order: 0,
        },
      },
    },
    "casualty-board": {
      look: {
        narration: {
          lucid:
            "The back wall is racked with oxblood-leather binders, each labelled with an operation name and a year. Most are thin. Two are thick. The thickest is labelled 'PROTOCOL ZERO,' the cryo-cut operation that ended the previous crew. The binder is open to its first page.",
          fragmented:
            "Protocol zero. Protocol zero. The first page. The first page. The first page is — the first page —",
          luminous:
            "Protocol Zero is the cryo-cut. The binder's first page lists every name on the previous crew, in handwriting I recognise as Lyra's. Beside each name, in a hand I do not recognise but suspect to be Wraith Calder's, is a single-word annotation: kept, lost, kept, lost, lost, kept. I do not yet know what 'kept' and 'lost' mean in this context. We may come back to find out.",
        },
        voId: "elara.war-room.casualty-board.look",
        logsClue: {
          id: "clue-war-room-protocol-zero",
          title: "Protocol Zero binder lists kept / lost annotations",
          body:
            "The War Room's Protocol Zero binder catalogues the previous crew's cryo-cut. Each name carries a single-word annotation in a second hand (likely Wraith Calder's): 'kept' or 'lost'. The meaning of the binary is not yet known.",
          source: "war-room",
          order: 1,
        },
      },
    },
    "signal-flag-rack": {
      look: {
        narration: {
          lucid:
            "Stage-left rack of folded signal-flags. Each represents a faction Lyra negotiated with in person — never via intermediary, never via comms. Twelve flags. The first is the Hierarchy of the Damned. The last, freshly folded, is in a hue and pattern I do not recognise.",
          fragmented:
            "Twelve. Twelve flags. Twelve. The last one. The last one. I don't — I don't know the last one.",
          luminous:
            "The unrecognised flag was folded in the last week of Lyra's command. She negotiated with someone we have not yet identified. The flag's pattern is geometric, asymmetric, and registers in a hue that drifts toward the unnameable indigo. I think — and this is a working theory — that Lyra met the editor in person at least once, and folded a flag for him. She did not tell anyone. She folded the flag, put it on the rack, and went to bed. Two days later she was dead.",
        },
        voId: "elara.war-room.signal-flag-rack.look",
        logsClue: {
          id: "clue-war-room-twelfth-flag",
          title: "An unidentified twelfth signal-flag",
          body:
            "The War Room's signal-flag rack holds twelve flags — one per faction Lyra Vox negotiated with in person. The twelfth was folded in the last week of her command and registers in a hue drifting toward the unnameable indigo. Working theory: Lyra met the editor in person and folded the flag two days before her death.",
          source: "war-room",
          order: 2,
        },
      },
    },
  },
};
