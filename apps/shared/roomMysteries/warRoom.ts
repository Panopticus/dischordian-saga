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
        // Mystery Engine binding — when Jericho Jones arc is the
        // active case, the holo-table's BRIEFING mode also surfaces
        // the Degen's commission brief: a folio in the Degen's
        // hand naming Jericho's role as witness, not executioner.
        // Lore match: BRIEFING is canonically where the room
        // convenes a live theatre map; the commission brief is
        // exactly that kind of document.
        mysteryBinding: {
          mysteryId: "mystery.jericho_jones",
          episodeId: "jericho.e5",
          cluesFound: ["jericho.e5.commission_brief"],
        },
      },
      use: {
        narration:
          "You turn the brass dial through its three positions. BRIEFING — the table's theatre map flickers awake, dark and ready to be populated. RECON — overlapping satellite traces from sectors the ship hasn't actively scouted in centuries. OBITUARY — the names of every casualty, sorted by who they died for, scrolling slowly. You leave the dial on BRIEFING. We are not, today, the audience for the obituary. — As the table warms, an overlay surfaces: Mol'Vereth's audit track record across thirty years of Hierarchy filings. He has audited eleven Coda trustees. Eight cleared cleanly. Three were demoted. Zero were prosecuted. The pattern: he is exact, he is not vindictive, and his findings have always been ratified by the Order without amendment.",
        voId: "elara.war-room.holo-table.use",
        setsFlag: "war_room_dial_used",
        // Degen arc binding — Mol'Vereth's audit track record. The
        // war-room's tactical archive includes Hierarchy auditor
        // performance records (the Order's CFO is itself a tactical
        // factor in any saga-wide settlement).
        mysteryBinding: {
          mysteryId: "mystery.the_degen",
          episodeId: "degen.e2",
          cluesFound: ["degen.e2.mol_vereth_track_record"],
        },
      },
      talk: {
        narration:
          "If you address the table, the surface acknowledges in faint pulses — a courteous standby. The room has been waiting for someone to convene a briefing for two and a half centuries. We are not, yet, prepared to convene one. We are, perhaps, preparing to be prepared.",
        voId: "elara.war-room.holo-table.talk",
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
      use: {
        narration:
          "You leaf through the Protocol Zero binder. The kept / lost annotations alternate without obvious pattern — kept, lost, kept, lost, kept, kept, lost. A small note in Wraith's hand on the inside back cover reads only: 'Kept = the ones whose work survives in the next crew. Lost = the ones whose work the editor reached.' That makes the count tractable. We can verify it. — Behind the Protocol Zero binder, on the same shelf: a slim folio in Mol'Vereth's hand titled REDACTED ATTESTATION. The text is mostly black-bar redactions; only the signature block and the closing sentence survive: 'I attest, in the form the Order requires, that the foregoing is sufficient. The remainder is the kind of truth the saga is not yet structured to receive.' The Hierarchy CFO has, in writing, told the saga that he knows more than he is filing.",
        voId: "elara.war-room.casualty-board.use",
        setsFlag: "war_room_protocol_zero_decoded",
        // Degen arc binding — Mol'Vereth's redacted attestation is
        // his pre-emptive declaration that the audit's findings will
        // include redactions he refuses to lift. War-room because
        // the casualty-board is the room's record of "what was
        // sacrificed and what survived."
        mysteryBinding: {
          mysteryId: "mystery.the_degen",
          episodeId: "degen.e4",
          cluesFound: ["degen.e4.mol_vereths_redacted_attestation"],
        },
      },
      talk: {
        narration:
          "If you address the casualty-board, you address every name in every binder. Most of the operations here ended well; most of the names here did not. Lyra's discipline of putting the casualty-board in the same room as the briefing-table was, on her notes, the reason she could keep planning at all. Without the consequence in eyeline, the planning becomes cheap.",
        voId: "elara.war-room.casualty-board.talk",
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
        // Mystery Engine binding — when Vex Solène arc is the
        // active case, the rack also surfaces the Insurgency's
        // Warlord-Fragment alias dossier on Vex. Lore match:
        // the rack catalogues factional negotiation records,
        // and Warlord-fragment cover identities are the
        // Insurgency's alias programme for operatives whose
        // work the official record could not name. Vex's
        // assigned alias was issued for one session at her
        // request, granted because the Seer asked them to.
        mysteryBinding: {
          mysteryId: "mystery.vex_solene",
          episodeId: "vex.e1",
          cluesFound: ["vex.e1.warlord_fragment_dossier"],
        },
      },
      use: {
        narration:
          "You unfold the twelfth flag. The fabric resists, very slightly, the way a flag folded in a particular way for a particular person resists being unfolded by anyone else. The pattern, opened, is more legible than it was racked: a geometry of nested asymmetric octagons, in the unnameable indigo, with a single warm-gold thread sewn diagonally across — Lyra's signature thread, used only on her own folds. She negotiated with the editor and signed the flag herself. Refold and re-rack carefully.",
        voId: "elara.war-room.signal-flag-rack.use",
        setsFlag: "war_room_twelfth_flag_opened",
      },
      talk: {
        narration:
          "If you address the rack, you address every faction Lyra met in person. Twelve voices. The twelfth voice is the only one who refuses to be named in any room he hasn't already worked on. The other eleven, addressed here, do answer. We have, perhaps, eleven friends we did not know we had.",
        voId: "elara.war-room.signal-flag-rack.talk",
        humanReaction: {
          narration: {
            balanced:
              "She told me about the meeting once, briefly, and only the parts she could be sure he hadn't already heard. The flag was the only record she committed to. She trusted the rack to keep it safer than any document.",
            shadow:
              "She met him alone. No witness, no second chair, no record. The flag is the only thing she let exist of that meeting. Two days later she was dead and we still don't know what was said.",
            warm:
              "Lyra came back from that meeting and folded the flag in the war room, by herself, late at night. I watched her do it from the bridge corridor. She put it on the rack and went to bed. She slept badly. Two days later — well. You know.",
          },
          voId: "human.war-room.signal-flag-rack.talk",
        },
      },
    },
  },
};
