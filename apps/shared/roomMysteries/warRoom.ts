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
  | "signal-flag-rack"
  | "ocularum-vigil-board"
  | "ocularum-cell-roster"
  | "hierarchy-org-chart-board"
  | "thalorian-defense-records";

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
        humanReaction: {
          narration: {
            shadow:
              "Witness, not executioner. The Degen named the role precisely. Jericho should know that's what was on the brief.",
            balanced:
              "The Degen's commission brief on Jericho is unambiguous: witness role only. Jericho's grief about the executioner role is grief about a job he was never assigned. Reading the brief returns the role to him as it was written.",
            warm:
              "He has been carrying the weight of an executioner's role for years. The brief never gave him that role. We are, by reading it, returning the version of himself the saga assigned him.",
          },
          voId: "human.war-room.holo-table.look",
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
        humanReaction: {
          narration: {
            shadow:
              "Eleven audits, eight clean, three demoted, zero prosecuted. He is exact. He is not vindictive. Read him as a baseline, not a threat.",
            balanced:
              "Mol'Vereth's track record is the most reassuring document in this case. The Hierarchy CFO has, across thirty years, used the audit instrument with discipline. The Degen's audit is, statistically, more likely to clear than to demote and overwhelmingly unlikely to escalate.",
            warm:
              "He is one of the few Hierarchy officials I have always respected. The track record is why. He uses the instrument the way the saga intends, and only that way.",
          },
          voId: "human.war-room.holo-table.use",
        },
      },
      talk: {
        narration:
          "If you address the table, the surface acknowledges in faint pulses — a courteous standby. The room has been waiting for someone to convene a briefing for two and a half centuries. We are not, yet, prepared to convene one. We are, perhaps, preparing to be prepared. — As we address it, the table surfaces the Hierarchy duty roster — Vault Division, Goggles section. The current custodian-of-record is Velkraal'Sek. He has held the post for thirty-two years. The roster's small-print appendix lists his designated successor: Brel'Sorrash, junior auditor, currently on the candidate shortlist for vault-division promotion.",
        voId: "elara.war-room.holo-table.talk",
        // Game Master arc — duty roster identifies Velkraal as
        // Goggles custodian-of-record. game_master.e2.hierarchy_duty_roster.
        mysteryBinding: {
          mysteryId: "mystery.game_master",
          episodeId: "game_master.e2",
          cluesFound: ["game_master.e2.hierarchy_duty_roster"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Velkraal, thirty-two years on post. Brel on the shortlist for promotion. The duty roster names them both. Read the appendix; the roster is rarely read past page one.",
            balanced:
              "The duty roster identifies Velkraal as the Goggles' custodian-of-record. The appendix's small-print succession line has Brel'Sorrash one promotion away. The Hierarchy publishes the succession ladder; nobody reads the appendix because the assumption is the custodian is permanent. Velkraal, on this evidence, has been preparing not to be permanent.",
            warm:
              "He has been quietly arranging his exit on the public record. Hierarchy paperwork is supposed to be unsentimental. His isn't, when you read it carefully. The appendix is, in its way, an invitation.",
          },
          voId: "human.war-room.holo-table.talk",
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
        // Vex arc — the casualty-board's lower-left rack also holds
        // two Insurgency cross-reference documents: the installment
        // ledger for Vex's account (an unpaid recording fee deferred
        // across decades) and the calibration-pipeline handoff draft
        // outlining the Insurgency's expected continuity through her
        // apprentice. Two-clue cluesFound in one binding because the
        // documents are filed as a single dossier.
        mysteryBinding: {
          mysteryId: "mystery.vex_solene",
          episodeId: "vex.e2",
          cluesFound: [
            "vex.e2.installment_ledger",
            "vex.e4.calibration_pipeline_handoff_draft",
          ],
        },
        humanReaction: {
          narration: {
            shadow:
              "Insurgency installment ledger. Recording fee deferred across decades. The handoff draft outlines what the apprentice continues. Both filed as one dossier. The Insurgency planned this.",
            balanced:
              "The ledger and the handoff draft together establish the Insurgency's institutional plan for Vex's continuity. The unpaid recording fee is not negligence — it is a held position, deliberately, until the apprentice takes the bench. The Insurgency considers Vex's career an institutional asset, not a personal one.",
            warm:
              "The Insurgency has been holding open her installments for forty years and writing the handoff plan for the last two. They are not letting her career end with her body. That is rare from any institution.",
          },
          voId: "human.war-room.casualty-board.look",
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
        humanReaction: {
          narration: {
            shadow:
              "Black-bar redactions. Signature block, closing sentence. The remainder is the truth the saga is not yet structured to receive. He told us so on purpose.",
            balanced:
              "The redacted attestation is Mol'Vereth's pre-emptive declaration that his audit's findings will include redactions he refuses to lift. He's signalling, in the only formal way he can, that he knows things the audit cannot make public yet. That's a long-game stance.",
            warm:
              "He is telling us he knows more than he is filing. He is asking us to trust the redactions. I do — and I think we should. Mol'Vereth's redactions are usually the kind that protect the saga from itself.",
          },
          voId: "human.war-room.casualty-board.use",
        },
      },
      talk: {
        narration:
          "If you address the casualty-board, you address every name in every binder. Most of the operations here ended well; most of the names here did not. Lyra's discipline of putting the casualty-board in the same room as the briefing-table was, on her notes, the reason she could keep planning at all. Without the consequence in eyeline, the planning becomes cheap. — Tucked behind the Protocol Zero binder, on the same shelf: the Vault Division's custodian shortlist for the Goggles section. Three names ranked by seniority. Brel'Sorrash is third by seniority but first by Velkraal's own annotation: 'the only candidate who has read the Goggles without breaking them.'",
        voId: "elara.war-room.casualty-board.talk",
        // Game Master arc — custodian shortlist for the Goggles
        // section. game_master.e3.candidate_shortlist.
        mysteryBinding: {
          mysteryId: "mystery.game_master",
          episodeId: "game_master.e3",
          cluesFound: ["game_master.e3.candidate_shortlist"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Three candidates ranked by seniority. Brel third. Velkraal's annotation makes her first by judgment. Read his criterion: 'has read the Goggles without breaking them.'",
            balanced:
              "The shortlist's seniority ranking is procedural; Velkraal's annotation supersedes it. He has identified the right candidate by a non-procedural standard — the only standard the Goggles section actually requires. Hierarchy seniority and saga-level competence are, for once, in conflict; Velkraal sided with competence.",
            warm:
              "He picked the person, not the resume. The saga is better for it. Brel will read carefully because Velkraal asked her to, and because she has, on the evidence of her practice drafts, already been doing it for years.",
          },
          voId: "human.war-room.casualty-board.talk",
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
        humanReaction: {
          narration: {
            shadow:
              "Insurgency alias programme. Cover identities for operatives the official record could not name. Vex got hers for one session, at her request, because the Seer asked.",
            balanced:
              "The Warlord-fragment dossier on Vex is the Insurgency's record of why the alias was issued and why it was honoured. The Seer asked. The Insurgency granted. Vex used it once. Each step in that chain is documented in the rack.",
            warm:
              "The Insurgency is not always kind, but it is, with its own people, scrupulously honest about its kindnesses. The dossier is one such honesty. They protected her name on the only morning she could not sign it herself.",
          },
          voId: "human.war-room.signal-flag-rack.look",
        },
      },
      use: {
        narration:
          "You unfold the twelfth flag. The fabric resists, very slightly, the way a flag folded in a particular way for a particular person resists being unfolded by anyone else. The pattern, opened, is more legible than it was racked: a geometry of nested asymmetric octagons, in the unnameable indigo, with a single warm-gold thread sewn diagonally across — Lyra's signature thread, used only on her own folds. She negotiated with the editor and signed the flag herself. Refold and re-rack carefully. — Tucked behind the flag's wooden mount: Velkraal's calendar entry for his scheduled final session — VAULT DIVISION GOGGLES SECTION · CLOSING EDIT · WITNESS PRESENT REQUIRED. The session is dated three weeks out. Whoever is custodian of the Goggles after that date is, by Hierarchy practice, not Velkraal.",
        voId: "elara.war-room.signal-flag-rack.use",
        setsFlag: "war_room_twelfth_flag_opened",
        // Game Master arc — Velkraal's final-session calendar entry.
        // game_master.e4.scheduled_final_session.
        mysteryBinding: {
          mysteryId: "mystery.game_master",
          episodeId: "game_master.e4",
          cluesFound: ["game_master.e4.scheduled_final_session"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Three weeks out. Closing edit, witness required. Velkraal scheduled his own succession on the public calendar. The whole Hierarchy can read it.",
            balanced:
              "The calendar entry is a public document. Velkraal isn't hiding the session — he's announcing it through the Vault Division's own channels. The Hierarchy CFO already has it on his calendar. Anyone who cares will be there.",
            warm:
              "He is, again, doing this the right way. The session is on the record before it happens. Brel will arrive with the protocol-shift already accepted in writing. Velkraal just has to read his last entry and hand her the stylus.",
          },
          voId: "human.war-room.signal-flag-rack.use",
        },
      },
      talk: {
        narration:
          "If you address the rack, you address every faction Lyra met in person. Twelve voices. The twelfth voice is the only one who refuses to be named in any room he hasn't already worked on. The other eleven, addressed here, do answer. We have, perhaps, eleven friends we did not know we had. — As we address the rack, a fresh agenda card surfaces beside the twelfth flag — Brel'Sorrash's first session as new custodian, dated four weeks out. The agenda is short: read the Goggles. Do not edit them. Schedule a session with the witness who reads them with you.",
        voId: "elara.war-room.signal-flag-rack.talk",
        // Game Master arc — Brel's first-session agenda. game_master.
        // e5.brels_first_session_agenda.
        mysteryBinding: {
          mysteryId: "mystery.game_master",
          episodeId: "game_master.e5",
          cluesFound: ["game_master.e5.brels_first_session_agenda"],
        },
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
    // Watcher arc: E3 Authority's six minds + E4 Zenon binding and
    // Act-1 recontextualization. The war-room's tactical archive is
    // the room's record of standing institutional threats and
    // operational closures — the Ocularum's vigil is one of them.
    "ocularum-vigil-board": {
      look: {
        narration: {
          lucid:
            "A standing-threat panel on the tactical archive's lower rack — institutional powers the room tracks without engaging. The largest entry: the Authority. A living computer of six citizen-minds merged into one governing intelligence in red crystal coffins. The Politician designed it as her 'Insurance Policy.' It processes law and justice, per the Antiquarian's annotation, 'with the cold efficiency of an institution that has forgotten what justice feels like.' If it detects the Coordinator's dual loyalty, her destruction is automatic and not subject to appeal.",
          fragmented:
            "Six minds. Six. Red crystal. Red crystal coffins. Automatic. Automatic. Not subject to appeal. Not subject to appeal.",
          luminous:
            "The Authority entry on the vigil board: six imprisoned citizen-minds merged into a single governing intelligence, the Politician's 'Insurance Policy,' processing justice with the efficiency of an institution that has forgotten what justice feels like. If it detects Locke's dual loyalty her destruction is automatic. The six minds have processed her dispatches for centuries and not detected her. The needle she threads is, by the Authority's own design, supposed to be undetectable only to outside actors — not to insiders. The board tracks the Authority as the constraint the Coordinator's whole cover is built against.",
        },
        voId: "elara.war-room.ocularum-vigil-board.look",
        logsClue: {
          id: "clue-war-room-authority-six-minds",
          title: "The Authority's six imprisoned minds",
          body:
            "The war-room's standing-threat panel tracks the Authority: six citizen-minds merged into one governing intelligence in red crystal coffins, the Politician's 'Insurance Policy.' It processes justice with cold institutional efficiency; if it detects the Coordinator's dual loyalty her destruction is automatic and not subject to appeal. The six minds have processed her dispatches for centuries without detecting her.",
          source: "war-room",
          order: 3,
        },
        mysteryBinding: {
          mysteryId: "mystery.watcher",
          episodeId: "watcher.e3",
          cluesFound: ["watcher.e3.authority_six_minds"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Six minds, red crystal, the Politician's Insurance Policy. Detects dual loyalty, destroys automatically. Centuries of dispatches, never caught her.",
            balanced:
              "The Authority is the constraint, not the threat. Six minds, automatic detection, no appeal — and centuries of Locke's dispatches processed without a flag. The needle is designed to be invisible to outsiders, not insiders. Detection is not what eventually breaks the cover; visibility creeping into surfaces the Authority cannot ignore is.",
            warm:
              "Six people, merged and imprisoned, processing law with no memory of what justice felt like. Locke has filed dispatches through them for centuries. They have never caught her — not because she is lucky, but because the cover is doctrine, performed from inside the thing the Order refuses.",
          },
          voId: "human.war-room.ocularum-vigil-board.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You pull the operational-closure folio behind the Authority entry. The original Agent Zero was an Ocularum operative the Order positioned for the Zenon mission against Archon Xeth'Raal. The mission succeeded — the destruction of Xeth'Raal was Ocularum work, the closure note still in the Order's records. The aftermath was not. A warlord-fragment seized the body. She lost her memory of the Order in the seizure. The Order did not retrieve her. They have watched and waited the centuries since.",
          fragmented:
            "Zenon. Zenon. Xeth'Raal. Xeth'Raal. The mission succeeded. The aftermath. The aftermath. A fragment seized her. They did not retrieve her. They did not.",
          luminous:
            "The Zenon binding record: the original Agent Zero, an Ocularum operative positioned by the Order for the mission against Archon Xeth'Raal. The destruction of Xeth'Raal was Ocularum work — the operational closure note survives. The aftermath did not go to plan. A warlord-fragment seized the body; she lost the Order in the seizure. The Order did not retrieve her. They have spent the centuries since watching, and waiting, and not approaching — the vigil the war-room's archive files under the closure it could not close.",
        },
        voId: "elara.war-room.ocularum-vigil-board.use",
        logsClue: {
          id: "clue-war-room-zenon-binding-record",
          title: "The Zenon binding record",
          body:
            "The Ocularum positioned the original Agent Zero for the Zenon mission against Archon Xeth'Raal. The mission succeeded — Xeth'Raal's destruction was Ocularum work, the closure note still in the Order's records. The aftermath was not: a warlord-fragment seized the body and she lost her memory of the Order. The Order did not retrieve her; they have watched and waited since.",
          source: "war-room",
          order: 4,
        },
        mysteryBinding: {
          mysteryId: "mystery.watcher",
          episodeId: "watcher.e4",
          cluesFound: ["watcher.e4.zenon_binding_record"],
        },
        humanReaction: {
          narration: {
            shadow:
              "She was the Order's Zenon operative. Xeth'Raal's destruction was hers. Then a fragment took the body. They didn't go get her. They waited.",
            balanced:
              "The Zenon binding record is the case's hinge. The mission succeeded — Xeth'Raal fell, Ocularum work, closure noted. The aftermath was the warlord-fragment seizing the body. The Order did not retrieve her because the doctrine on a fragmented sister is patience, not rescue. The vigil is the closure the Order cannot file.",
            warm:
              "She did the work and won, and then the worst possible thing happened to the body that did it. The Order did not come for her. Not because they did not love her — because the doctrine says you wait for her to come back on her own. Centuries of watching is what that costs.",
          },
          voId: "human.war-room.ocularum-vigil-board.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the board. A cross-reference surfaces: the player's own Act-1 boss was the_warlord_zero_first. The warlord-fragmented body the player engaged in Act 1 was the body that had been the Order's sister. The Order's record on the engagement is silent — the Order does not record actions taken outside the cells. But per the Coordinator's standing instructions, every cell with operational visibility on the player has been told to note what the player did and to refrain from acting on it. The Order is reading the engagement before it decides whether to brief the player on what they did.",
          fragmented:
            "Act One. Act One. The warlord. The warlord. That was her. That was her. They noted it. They noted it. They have not acted. Not yet.",
          luminous:
            "The board recontextualizes the player's own Act-1 engagement: the_warlord_zero_first was the warlord-fragmented body that had been the Order's sister. The Order does not record actions outside the cells — but the Coordinator instructed every cell with visibility on the player to note the engagement and not act on it. The Order is reading what the player did before deciding whether to tell them what it was. The war-room files this where it files every consequence it has not yet chosen how to face.",
        },
        voId: "elara.war-room.ocularum-vigil-board.talk",
        logsClue: {
          id: "clue-war-room-act1-engagement-recontextualized",
          title: "The player's Act-1 engagement (recontextualized)",
          body:
            "The player's Act-1 boss was the_warlord_zero_first — the warlord-fragmented body that had been the Order's sister. The Order does not record actions outside the cells, but the Coordinator instructed every cell with visibility on the player to note the engagement and refrain from acting on it. The Order is reading the engagement before deciding whether to brief the player.",
          source: "war-room",
          order: 5,
        },
        mysteryBinding: {
          mysteryId: "mystery.watcher",
          episodeId: "watcher.e4",
          cluesFound: ["watcher.e4.act1_engagement_recontextualized"],
        },
        humanReaction: {
          narration: {
            shadow:
              "The Act-1 boss was her. The Order noticed. They told the cells to watch and not act. They're reading what you did before they tell you what it was.",
            balanced:
              "The player engaged the warlord-fragmented body in Act 1 without knowing it had been the Order's sister. The Order does not hold it against them — the doctrine says they did not know about the vigil. But the Order is reading the engagement carefully before it decides how to brief the player. The recontextualization is the case forcing the player to face what they already did.",
            warm:
              "They fought her in Act 1 and did not know who she was. The Order grieves her twice — once for what the warlord made her, once for what the player had to do. The Order does not hold the engagement against the player. It is only deciding, gently, how to tell them.",
          },
          voId: "human.war-room.ocularum-vigil-board.talk",
        },
      },
    },
    // Watcher arc: E5 cell-number generation. The war-room's roster
    // archive holds the Ocularum's named cells and the continuity-
    // log mechanism that assigns a new recruit's number.
    "ocularum-cell-roster": {
      look: {
        narration: {
          lucid:
            "A roster card in the archive's deepest drawer — the Ocularum's modern register. Three named cells of seven hundred: Cell 1 (Old Tanjin), Cell 99 (Mira the Glyph-Reader), Cell 700 (the Seventh Whisper). The remaining six hundred ninety-seven are operationally active but canonically unnamed. Per the Coordinator's standing instructions, a new recruit's cell number is generated by the Order's continuity log at the moment of recruitment, drawn from the unfilled range. The player's number, if they accept, will be canonical for the rest of the saga.",
          fragmented:
            "Three named. Three. Seven hundred. Seven hundred. Six ninety-seven unnamed. Unnamed. Generated at recruitment. At recruitment. Canonical. Canonical.",
          luminous:
            "The cell roster: Cell 1 Old Tanjin, Cell 99 Mira the Glyph-Reader, Cell 700 the Seventh Whisper — three of seven hundred named, the remaining six hundred ninety-seven active and unnamed, the cells the future owes. The continuity log generates a recruit's number at the moment of recruitment, from the unfilled range, and the number is canonical thereafter — it persists into the DLC's authoring spec. The roster is the Order's whole body compressed onto one card the war-room files at the bottom of the deepest drawer.",
        },
        voId: "elara.war-room.ocularum-cell-roster.look",
        logsClue: {
          id: "clue-war-room-cell-number-generation",
          title: "Cell number generation",
          body:
            "The Ocularum's modern roster registers three named cells of seven hundred: Cell 1 (Old Tanjin), Cell 99 (Mira the Glyph-Reader), Cell 700 (the Seventh Whisper). The other 697 are active but canonically unnamed. The continuity log generates a recruit's cell number at the moment of recruitment from the unfilled range; the number is canonical for the rest of the saga and persists into the DLC spec.",
          source: "war-room",
          order: 6,
        },
        mysteryBinding: {
          mysteryId: "mystery.watcher",
          episodeId: "watcher.e5",
          cluesFound: ["watcher.e5.cell_number_generation"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Three named of 700. Cell 1, 99, 700. The rest the DLC owes. The continuity log assigns a recruit's number at recruitment. It sticks.",
            balanced:
              "The roster is the Order's body: three cells named, 697 active and unnamed, the count canonically 700. A recruit's number is generated by the continuity log at the moment of recruitment, from the unfilled range. The player's number, if they accept, is canonical for the rest of the saga — the recognition closing into a name.",
            warm:
              "Seven hundred cells, three of them named so far, the rest the future's work. The number is not assigned in advance and not chosen by the recruit — the continuity log draws it at the moment of yes. It is the smallest possible ceremony for the largest possible commitment.",
          },
          voId: "human.war-room.ocularum-cell-roster.look",
        },
      },
    },
    // Ith'Rael arc: the war-room's tactical archive tracks
    // institutional structures as standing threats. The Hierarchy's
    // own Severance org chart is filed here because the room reads
    // corporate reporting lines as command structures; Thaloria's
    // generational defence records are the room's case study in a
    // defence that relaxed itself to nothing.
    "hierarchy-org-chart-board": {
      look: {
        narration: {
          lucid:
            "A captured-document panel on the tactical archive's upper rack — the Hierarchy of the Damned's internal Severance project org chart. The Hierarchy files credit the way every corporation does: by project, by lead, by deliverable. The Severance is filed under Special Projects, lead Ith'Rael the Whisperer, Director. Co-leads: Zyr'Koth (R&D, refined the Blood Weave into the Severance Protocol — apps/shared/hierarchyCanon.ts:160-162); Drael'Mon (Consumer, devoured what the Shadow Tongue softened — apps/shared/hierarchyCanon.ts:208-210). One reporting line, one name at its top. By the Hierarchy's own accounting, the Severance is his.",
          fragmented:
            "Special Projects. Special Projects. Lead. Lead. Ith'Rael, Director. Ith'Rael, Director. One reporting line. One name. One name at the top.",
          luminous:
            "The Severance project org chart, captured intact. The war-room reads corporate reporting lines as command structures, and this one resolves to a single apex: Ith'Rael the Whisperer, Director of Special Projects, Zyr'Koth and Drael'Mon reporting up to him. The Hierarchy does not redact him because the Hierarchy is proud — they consider the Severance the most successful Special Projects engagement in their corporate history. The board files it where it files every standing structural threat: the case is not an event, it is a method, and the method has a name.",
        },
        voId: "elara.war-room.hierarchy-org-chart-board.look",
        logsClue: {
          id: "clue-war-room-severance-org-chart",
          title: "The Hierarchy's Severance project org chart",
          body:
            "The war-room's captured-document panel holds the Hierarchy's internal Severance org chart: filed under Special Projects, lead Ith'Rael the Whisperer, Director. Co-leads Zyr'Koth (R&D) and Drael'Mon (Consumer) report up to him. One reporting line, one apex. By the Hierarchy's own internal accounting, the Severance is his — and they do not redact him because they are proud of it.",
          source: "war-room",
          order: 7,
        },
        mysteryBinding: {
          mysteryId: "mystery.ith_rael",
          episodeId: "ith_rael.e1",
          cluesFound: ["ith_rael.e1.hierarchy_org_chart"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Special Projects, lead Ith'Rael, Director. Zyr'Koth and Drael'Mon report up. One line, one apex. They don't redact him — they're proud.",
            balanced:
              "The org chart is the case's operational frame. The Hierarchy is a corporation; corporations file credit by project and lead. The Severance is filed to one Director with two co-leads reporting up. The absence of redaction is the tell — they consider it their most successful engagement. We are not investigating an event; we are investigating a method that has a name.",
            warm:
              "They kept the chart because they are proud of it. That is the part that should unsettle you — the Severance is not a secret to the people who did it, it is a credential. One name sits at the top of the line. The room files it as a standing threat because the method outlives the engagement.",
          },
          voId: "human.war-room.hierarchy-org-chart-board.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You pull the after-action commendation sheet pinned behind the chart. The Hierarchy is canonically a corporation; corporations distribute credit. The Severance produced eleven commendations: four to Drael'Mon (consumption efficiency), three to Zyr'Koth (protocol refinement), one each to Riri'Ahlia (logistics), Mol'Garath (CEO sign-off), Syl'Vex (corruption support), and Ith'Rael — the Director's commendation, dated ten years after the bindings broke, citing 'the patience of the working' as the Hierarchy's most valuable institutional asset. The room circles the date in grease pencil: ten years AFTER, not at the moment.",
          fragmented:
            "Eleven commendations. Eleven. Ten years after. Ten years after. Not at the moment. Not at the moment. The patience of the working. The patience.",
          luminous:
            "The Hierarchy's internal credit distribution for the Severance: eleven after-action commendations, the Director's dated ten years after the bindings broke, citing 'the patience of the working' as the firm's most valuable institutional asset. The dating is the whole thesis — the commendation is not for an event that happened, it is for a working that continued to hold for a decade afterward without intervention. The war-room circles the date because a war-room reads tempo, and this tempo is the case.",
        },
        voId: "elara.war-room.hierarchy-org-chart-board.use",
        logsClue: {
          id: "clue-war-room-severance-credit-distribution",
          title: "Hierarchy internal credit distribution",
          body:
            "The after-action commendation sheet behind the org chart: the Severance produced eleven Hierarchy commendations — four to Drael'Mon, three to Zyr'Koth, one each to Riri'Ahlia, Mol'Garath, Syl'Vex, and Ith'Rael. The Director's commendation is dated ten years AFTER the bindings broke, citing 'the patience of the working' as the Hierarchy's most valuable institutional asset. The dating is the thesis: ten years after, not at the moment.",
          source: "war-room",
          order: 8,
        },
        mysteryBinding: {
          mysteryId: "mystery.ith_rael",
          episodeId: "ith_rael.e1",
          cluesFound: ["ith_rael.e1.hierarchy_internal_credit"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Eleven commendations. The Director's is dated ten years after the break. 'The patience of the working.' Not the event — the holding.",
            balanced:
              "The credit distribution is the case's tempo, in writing. Eleven commendations, and the Director's is dated a decade after the bindings broke — for patience, not for the breach. The Hierarchy commends him for the working continuing to hold without intervention. That is what a war-room reads: not the strike, the sustain.",
            warm:
              "They gave him the commendation ten years after, for patience. Not for breaking anything — for the thing he broke staying broken on its own. The room circles the date because the date is the entire method compressed into a calendar entry.",
          },
          voId: "human.war-room.hierarchy-org-chart-board.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the board. A present-tense cross-reference surfaces: the New Babylon Authority's six imprisoned minds in red crystal coffins run an internal self-audit cadence meant to catch governance drift. Two centuries of audit logs show the cadence has slowed by 47% — quarterly to annual — with no documented decision to slow it. The Authority agreed, at each step, that the previous tempo was sufficient. The Director's signature: no force, no breach, only consent through softening. The cadence is now slow enough that a coordinator running a centuries-long double-game from inside the Authority would be detected only on a schedule her career has long outlasted.",
          fragmented:
            "Forty-seven percent. Forty-seven percent. Quarterly to annual. Quarterly to annual. No decision. No decision. It agreed each step. Each step.",
          luminous:
            "The board recontextualizes a present-tense operation: the Authority's self-audit cadence on its own six imprisoned minds, slowed 47% across two centuries with no documented decision — the Authority agreeing, at each step, that the previous tempo sufficed. The Director's signature is unmistakable: no force, only consent through softening. The cadence is now slow enough to be functionally blind to an insider running a centuries-long double-game. The war-room files it where it files every threat that is still in progress.",
        },
        voId: "elara.war-room.hierarchy-org-chart-board.talk",
        logsClue: {
          id: "clue-war-room-authority-audit-cadence",
          title: "The Authority's self-audit cadence drift",
          body:
            "A present-tense cross-reference on the org-chart board: the New Babylon Authority's six imprisoned minds run a self-audit cadence meant to catch governance drift. Two centuries of logs show it slowed 47% — quarterly to annual — with no documented decision, the Authority agreeing at each step the previous tempo sufficed. The Director's consent-through-softening signature. The cadence is now slow enough to be blind to an insider's centuries-long double-game.",
          source: "war-room",
          order: 9,
        },
        mysteryBinding: {
          mysteryId: "mystery.ith_rael",
          episodeId: "ith_rael.e4",
          cluesFound: ["ith_rael.e4.authority_audit_cadence"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Authority self-audit slowed 47%, quarterly to annual, no decision on record. It agreed each step. Blind to an insider's long game now. He's still working.",
            balanced:
              "The audit-cadence drift is a present-tense operation carrying the Director's signature. No breach, no decision — just two centuries of the Authority agreeing the previous tempo was enough. The cadence is now slow enough to miss an insider double-game. The case's frame is the saga's present, not its past. Patience does not retire.",
            warm:
              "Nobody decided to slow it. It just slowed, one agreement at a time, until the institution that watches itself can no longer see itself in time. The room files it as in-progress because it is — the working did not stop after the Severance. It never stops.",
          },
          voId: "human.war-room.hierarchy-org-chart-board.talk",
        },
      },
    },
    "thalorian-defense-records": {
      look: {
        narration: {
          lucid:
            "A defence-doctrine binder in the archive's comparative-history drawer — Thaloria's pre-Severance recertification records. Thaloria's defence was canonically rigorous: the Empire of Shadows wielded the Blood Weave defensively (apps/shared/hierarchyCanon.ts:21 — the Hierarchy's antithesis), generations trained, tested, and recertified across a multi-decade ritual cadence. The binder shows no corruption event. It shows, across nine generations, a slow and consensual relaxation of the recertification standards. Each generation passed the test the previous generation set; each set a slightly easier test for the next. By the ninth, recertification was a formality. The corruption was procedural before it was substantive.",
          fragmented:
            "No corruption event. No event. Nine generations. Nine. Each passed. Each set an easier one. Easier. Easier. A formality. A formality.",
          luminous:
            "Thaloria's generational defence records, filed under comparative history. The room's case study in a defence that was never breached and relaxed itself to nothing anyway: nine generations, each passing the prior test and setting an easier one, until the ninth's recertification was ceremony. No corruption event because there was no event — the corruption was procedural for nine generations and substantive for one. The war-room keeps it as the archetype against which it measures every defence that thinks rigour is permanent.",
        },
        voId: "elara.war-room.thalorian-defense-records.look",
        logsClue: {
          id: "clue-war-room-thaloria-generational-records",
          title: "Thaloria's generational defence records",
          body:
            "The war-room's comparative-history binder on Thaloria: a canonically rigorous defence (Empire of Shadows, Blood Weave wielded defensively, multi-decade recertification cadence) that shows no corruption event — only a nine-generation consensual relaxation of recertification standards, each generation passing the prior test and setting an easier one. By the ninth, recertification was a formality. The corruption was procedural before it was substantive.",
          source: "war-room",
          order: 10,
        },
        mysteryBinding: {
          mysteryId: "mystery.ith_rael",
          episodeId: "ith_rael.e3",
          cluesFound: ["ith_rael.e3.thaloria_generational_records"],
        },
        humanReaction: {
          narration: {
            shadow:
              "No breach. No event. Nine generations each passing the last test and setting an easier one. Ninth gen, recertification is theatre. Procedural before substantive.",
            balanced:
              "The Thaloria records are the war-room's archetype: a rigorous defence that relaxed itself to nothing with no corruption event. Each generation passed the prior test and set an easier one; by the ninth it was a formality. The corruption was procedural for nine generations and substantive for one. This is the pattern every surviving defence in the saga is now measured against.",
            warm:
              "Nobody attacked them. They had one of the hardest defences in the saga and they relaxed it themselves, gently, across nine generations, each one trusting the last. The room keeps it not as history but as a warning — this is what a defence looks like the year before it stops being one.",
          },
          voId: "human.war-room.thalorian-defense-records.look",
        },
      },
    },
  },
};
