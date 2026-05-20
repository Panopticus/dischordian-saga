/* ═══════════════════════════════════════════════════════
   ORACLE SANCTUM MYSTERY — pool, tablet, brazier

   Three-hotspot module for the deck-9 oracle-pool sanctum.
   Sets oracle_consulted on first-look at the oracle-pool.
   Universal room.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type OracleSanctumHotspotId =
  | "tarn-pebble-recording"
  | "chained-apprentice-quotes"
  | "chained-auro-account"
  | "chained-lyra-advocacy"
  | "chained-lyra-album-track"
  | "akai-dreamer-quarantine"
  | "watchers-player-received-line"
  | "watchers-player-line-match"
  | "watchers-player-speaker-assignment"
  | "tarn-dean-account"
  | "tarn-othmar-admission"
  | "tarn-roen-admission"
  | "tarn-veth-admission"
  | "memorial-plaza-register"
  | "memorial-plaza-consensus"
  | "memorial-aren-reading"
  | "severance-companion-on-table"
  | "severance-broker-record"
  | "severance-successor-test"
  | "severance-bond-poured"
  | "memorial-antiquarian-plaza-request"
  | "charter2-kassel-testimony"
  | "infernal-zyrkoth-concession"
  | "advocate-ninth-conexus-story"
  | "oracle-pool" | "prophecy-tablet" | "incense-brazier" | "seers-recording-cabinet";

export const ORACLE_SANCTUM_MYSTERY: RoomMysteryModule<OracleSanctumHotspotId> = {
  roomId: "oracle-sanctum",
  responses: {
    /* ─── severance.bound_champion · color clues ─── */
    "severance-companion-on-table": {
      look: {
        narration:
          "On the witness-table, the bound companion. A first-circuit eidolon, ribboned with the champion's colors. Bond strength reads at peak. The companion has not eaten since the lap; they are looking for someone they can no longer find.",
        mysteryBinding: {
          mysteryId: "severance.bound_champion",
          episodeId: "severance.bound_champion.e1",
          cluesFound: ["severance.e1.companion_on_table"],
        },
      },
    },
    "severance-broker-record": {
      look: {
        narration:
          "On the sanctum's recorded-statements console, the Broker's recorded statement: 'I picked up the first bond because no one else would. I've been picking them up because no one else has learned. The day someone else learns, I will be allowed to set them down.'",
        mysteryBinding: {
          mysteryId: "severance.bound_champion",
          episodeId: "severance.bound_champion.e3",
          cluesFound: ["severance.e3.broker_record"],
        },
      },
    },
    "severance-successor-test": {
      look: {
        narration:
          "Beside the Broker's record, the successor-test recording. The Broker explains the test: pour the bond into the empty jar; sit in chair one; stand when you can. If you cannot stand, Klessa pours the wax. If you can, you are the next Broker.",
        mysteryBinding: {
          mysteryId: "severance.bound_champion",
          episodeId: "severance.bound_champion.e4",
          cluesFound: ["severance.e4.successor_test"],
        },
      },
    },
    "severance-bond-poured": {
      look: {
        narration:
          "On the closing-rite ceremonial stand, the companion's bond is decanted into the empty jar at the second-to-last bell. The jar weighs slightly more than every previous jar — no one knows why. The bond is calm.",
        mysteryBinding: {
          mysteryId: "severance.bound_champion",
          episodeId: "severance.bound_champion.e5",
          cluesFound: ["severance.e5.bond_poured"],
        },
      },
    },
    /* ─── memorial.forgotten_names · color clues ─── */
    "memorial-plaza-register": {
      look: {
        narration:
          "In the witness chamber's plaza-register alcove, the recorded opening: players have begun inscribing. The first three inscriptions are quiet — names whispered, written, set down. The fourth player hesitates at the unwitnessed pages and asks the Antiquarian what to do.",
        mysteryBinding: {
          mysteryId: "memorial.forgotten_names",
          episodeId: "memorial.forgotten_names.e1",
          cluesFound: ["memorial.e1.plaza_register"],
        },
      },
    },
    "memorial-plaza-consensus": {
      look: {
        narration:
          "In the closing-rite alcove, the plaza-consensus recording for I-1: the gathered players reach a consensus by silence — three minutes of not-speaking, then one player at a time stepping forward. Each player offers a name. Twenty-three names are spoken. The keeper writes them all down.",
        mysteryBinding: {
          mysteryId: "memorial.forgotten_names",
          episodeId: "memorial.forgotten_names.e4",
          cluesFound: ["memorial.e4.plaza_consensus"],
        },
      },
    },
    "memorial-aren-reading": {
      look: {
        narration:
          "On the closing-recording desk, Aren of the lower decks reads the volume aloud at last bell. They take three hours. They pause once, at I-1's folio, to let the gathered players read the names along with them. The pause is forty-five seconds long.",
        mysteryBinding: {
          mysteryId: "memorial.forgotten_names",
          episodeId: "memorial.forgotten_names.e5",
          cluesFound: ["memorial.e5.aren_reading"],
        },
      },
    },
    /* ─── mechronis.missing_professor · color clues ─── */
    "tarn-dean-account": {
      look: {
        narration:
          "In the witness chamber, the Dean's last-sighting recording: the Dean saw Tarn at second bell, walking from the Dean's office toward the festival hall, carrying the binder. The Dean did not walk with her — she always insisted on the last hundred steps alone.",
        mysteryBinding: {
          mysteryId: "mechronis.missing_professor",
          episodeId: "mechronis.missing_professor.e1",
          cluesFound: ["mechronis.e1.dean_account"],
        },
      },
    },
    "tarn-othmar-admission": {
      look: {
        narration:
          "Pinned to the faculty-confession board, Professor Othmar's admission, on record: 'I voted aye because Veth would have voted aye. I was wrong about Veth. I am not sorry I was wrong.'",
        mysteryBinding: {
          mysteryId: "mechronis.missing_professor",
          episodeId: "mechronis.missing_professor.e3",
          cluesFound: ["mechronis.e3.othmar_admission"],
        },
      },
    },
    "tarn-roen-admission": {
      look: {
        narration:
          "Beside Othmar's, Trial-master Roen's admission: 'I voted aye because Othmar would. I have a private reason and I will not say it here.' Roen will say it in episode four.",
        mysteryBinding: {
          mysteryId: "mechronis.missing_professor",
          episodeId: "mechronis.missing_professor.e3",
          cluesFound: ["mechronis.e3.roen_admission"],
        },
      },
    },
    "tarn-veth-admission": {
      look: {
        narration:
          "Beside Roen's, Lecturer Veth's admission: 'I voted aye because Roen would. I have been telling myself for a week that I voted aye because the curriculum needed it. I have not been honest with myself.'",
        mysteryBinding: {
          mysteryId: "mechronis.missing_professor",
          episodeId: "mechronis.missing_professor.e3",
          cluesFound: ["mechronis.e3.veth_admission"],
        },
      },
    },
    /* ─── memorial.seven_watchers · color clues ─── */
    "watchers-player-received-line": {
      look: {
        narration:
          "In the sanctum's personal-line alcove, the line addressed to the player. Six minutes after Seal VII broke. Single sentence. Voice unidentified at first. The line is the player's to read, the case's to interpret, and (per the manifest) personalised to the player's choices across the saga.",
        mysteryBinding: {
          mysteryId: "memorial.seven_watchers",
          episodeId: "memorial.seven_watchers.e1",
          cluesFound: ["watchers.e1.player_received_line"],
        },
      },
    },
    "watchers-player-line-match": {
      look: {
        narration:
          "Beside the personal-line alcove, the line-matching console runs the player's case-history against the six Watcher signatures: if the case-history includes investigation work (deduction graphs solved, suspects named), the line is Idris's. If the case-history includes Memorial Plaza inscription, plaza vigil, or charity donations, the line is Verel's. The player may have received from either, or from one of the other four still to be identified.",
        mysteryBinding: {
          mysteryId: "memorial.seven_watchers",
          episodeId: "memorial.seven_watchers.e2",
          cluesFound: ["watchers.e2.player_line_match"],
        },
      },
    },
    "watchers-player-speaker-assignment": {
      look: {
        narration:
          "On the speaker-assignment console, cross-referencing the player's case-history against the six role-registry entries: the player's received line is from one of the six, identifiable by which audience the player has belonged to most across the saga.",
        mysteryBinding: {
          mysteryId: "memorial.seven_watchers",
          episodeId: "memorial.seven_watchers.e3",
          cluesFound: ["watchers.e3.player_speaker_assignment"],
        },
      },
    },
    /* ─── akai_shi.red_death · e2 (Dreamer's quarantine filing) ─── */
    "akai-dreamer-quarantine": {
      look: {
        narration:
          "In the sanctum's Ne-Yon arbitration alcove, the Dreamer's quarantine filing on the Resurrectionist's actions in the wake of the Akai Shi reanimation. The quarantine is canonically OPEN — it has never been lifted. The Dreamer has, since, lodged similar quarantines on three further Resurrectionist actions, including the Wolf's. The quarantines are evidence; they are not enforcement. The Dreamer disagrees. The Resurrectionist continues.",
        mysteryBinding: {
          mysteryId: "akai_shi.red_death",
          episodeId: "akai_shi.red_death.e2",
          cluesFound: ["akai.e2.dreamer_quarantine"],
        },
      },
    },
    /* ─── mechronis.chained_lesson · color clues ─── */
    "chained-apprentice-quotes": {
      look: {
        narration:
          "In the witness chamber, three apprentices' after-action recordings have been pulled — three different years, three identical lines: 'I had not seen the formation before.' 'I did not know it was a feint.' 'I was reading the formation as a real approach.' Each apprentice survived; each was bumped to the back of the cohort.",
        mysteryBinding: {
          mysteryId: "mechronis.chained_lesson",
          episodeId: "mechronis.chained_lesson.e2",
          cluesFound: ["chained.e2.apprentice_quotes"],
        },
      },
    },
    "chained-auro-account": {
      look: {
        narration:
          "Beside the apprentice recordings, Auro's own statement to the sanctum: 'I teach because the apprentices need it. I do not need a chair. I do not need the Academy's permission. I would prefer the curriculum cover the module so I could go back to the Trade Empire job, which I am underpaid for.' The statement is short. Auro's voice does not waver.",
        mysteryBinding: {
          mysteryId: "mechronis.chained_lesson",
          episodeId: "mechronis.chained_lesson.e3",
          cluesFound: ["chained.e3.auro_account"],
        },
      },
    },
    "chained-lyra-advocacy": {
      look: {
        narration:
          "On the sanctum's advocacy log, Lyra Vox's note from the recording session: she has decided to dedicate tonight's album track to Auro. The track will name Auro publicly. Lyra: 'I will not be the only one naming her, but I am tired of waiting for someone else to start.'",
        mysteryBinding: {
          mysteryId: "mechronis.chained_lesson",
          episodeId: "mechronis.chained_lesson.e3",
          cluesFound: ["chained.e3.lyra_advocacy"],
        },
      },
    },
    "chained-lyra-album-track": {
      look: {
        narration:
          "In the playback alcove, Track 16 of the festival album plays at the closing rite. Three minutes, instrumental, a single sung line at the end: 'sergeant who taught the module the Academy would not — we hear you.' Auro shuts her eyes for the line.",
        mysteryBinding: {
          mysteryId: "mechronis.chained_lesson",
          episodeId: "mechronis.chained_lesson.e5",
          cluesFound: ["chained.e5.lyra_album_track"],
        },
      },
    },
    /* ─── mechronis.missing_professor · e4 (Tarn's recorded message) ─── */
    "tarn-pebble-recording": {
      look: {
        narration:
          "In the sanctum's playback alcove, the recording Tarn had set to play at festival opening. The recorder failed to fire on the day; the sanctum's tech staff recovered the message intact two evenings later. The recording is short: 'I am not the curriculum. I am a person who wrote a curriculum. The curriculum is here. I am leaving with my pebble. Vote on the work, not on the worker.' The pebble — a grey lower-deck water-stone — was on Tarn's desk under the binder. The recording was Tarn's planned address; the failure to play it was the only part of the morning that did not go according to her plan.",
        mysteryBinding: {
          mysteryId: "mechronis.missing_professor",
          episodeId: "mechronis.missing_professor.e4",
          cluesFound: ["mechronis.e4.tarn_recorded_message"],
        },
      },
      interrogate: {
        narration:
          "You ask the sanctum's calibration logs for the recorder's failure mode. The logs return a clean entry: power was cut to the recorder at six minutes before the scheduled play. The cut was deliberate and the logs name the cutter — the Dean. The Dean disabled the recording because the Dean already knew what it would say and did not want the room to hear it before the faculty would have to admit what they had done.",
      },
    },
    /* ─── memorial.forgotten_names · e1 (Antiquarian's plaza request) ─── */
    "memorial-antiquarian-plaza-request": {
      look: {
        narration:
          "In the sanctum's witness chamber, the recorded address the Antiquarian gave in the plaza at first bell on Memorial Day Year 1. The recording, in his voice: 'these fourteen imprints will remain unwritten unless someone takes responsibility for the writing. taking responsibility means reading the imprint, hearing the imprint, and writing the name as you have heard it. it is not a small thing to ask.' The sanctum's vu-meter captures the chronicler's hesitation only at the word 'responsibility' — the word he is least comfortable asking the plaza to carry. The plaza carries it anyway.",
        mysteryBinding: {
          mysteryId: "memorial.forgotten_names",
          episodeId: "memorial.forgotten_names.e1",
          cluesFound: ["memorial.e1.antiquarian_request"],
        },
      },
      interrogate: {
        narration:
          "You ask the sanctum for the players' response in the same recording. The chamber returns three voices: 'we will write them'; 'we will listen first'; 'tell us how to listen.' Three players said all three things within the first minute. The plaza arrived ready to ask better questions than the Antiquarian expected to answer.",
      },
    },
    /* ─── charter.second_signatory · e2 (Kassel Solven's testimony) ─── */
    "charter2-kassel-testimony": {
      look: {
        narration:
          "In the oracle-sanctum's witness chamber, Kassel Solven's recorded testimony from the morning of the delegation's arrival. The sanctum's recorder caught the full statement. Kassel: 'My great-great-grandmother was the one who signed. Her name is on the mirror. Her workshop is the one you visited yesterday. We have been waiting for the door to be opened from the other side for four epochs.' The sanctum's calibration logs note that Kassel did not raise her voice across the eight-minute testimony; the recorder's vu-meter never crossed the conversational band. She was not performing patience. She had it.",
        mysteryBinding: {
          mysteryId: "charter.second_signatory",
          episodeId: "charter.second_signatory.e2",
          cluesFound: ["charter2.e2.descendant_account"],
        },
      },
      interrogate: {
        narration:
          "You ask the sanctum what the four-epoch wait sounded like. The recorder returns the family ledger's read-aloud entries — quarterly outputs, customer lists, apprentice tallies — kept by four generations of Solvens in continuous handwriting from the founding to today. The waiting was a workshop, not a vigil. Kassel inherited the workshop and the silence with it.",
      },
    },
    /* ─── severance.infernal_clause · e4 (Zyr'Koth's concession) ─── */
    "infernal-zyrkoth-concession": {
      look: {
        narration:
          "In the oracle-sanctum's witness chamber, the recording of Zyr'Koth's response to the Advocate's brief — read into the Council record. Zyr'Koth's voice, the chamber's clean acoustic capture: 'we did not check the prize-history. we should have checked the prize-history. the clause is voidable.' Zyr'Koth pauses for a long minute before speaking, the sanctum's vu-meter shows no breath or shuffle in the silence. The Hierarchy concedes on the record, in person, in the Council chamber. The infernal claim collapses.",
        mysteryBinding: {
          mysteryId: "severance.infernal_clause",
          episodeId: "severance.infernal_clause.e4",
          cluesFound: ["infernal.e4.zyrkoth_response"],
        },
      },
      interrogate: {
        narration:
          "You ask the sanctum for Zyr'Koth's full statement. The recording continues: 'we will withdraw the claim. we will return the contracts to the league's archive. we will not exercise the clause on any of the bonds. the audit was honest and the trap was honest. we accept both.' The Hierarchy has met an honest paperwork with honest paperwork.",
      },
    },
    /* ─── advocate.blood_weave · e4 (CoNexus story 'The Ninth') ─── */
    "advocate-ninth-conexus-story": {
      look: {
        narration:
          "In the oracle-sanctum's CoNexus playback alcove, the canonical Advocate-narrated story — 'The Ninth.' The frame: an Advocate-narrated meditation on the ninth position in cosmic-principle entity rosters; on the position's loneliness; on the substrate-cost of being the ninth. The story does not stage a plot. It stages a position. The story's hardest line, read by the Advocate herself: 'I am not lonely because I have lost what I traded. I am lonely because what remains has no second.' The story is canonically Advocate-authored.",
        mysteryBinding: {
          mysteryId: "advocate.blood_weave",
          episodeId: "advocate.blood_weave.e4",
          cluesFound: ["adv.e4.ninth_conexus_story"],
        },
      },
      interrogate: {
        narration:
          "You ask the sanctum for the story's narration cadence. The recording's vu-meter shows steady register-three liturgical pace across the full duration. No emotional peaks. No tonal shifts. The position has been the Advocate's working voice for so long it cannot be played, only inhabited.",
      },
    },
    "oracle-pool": {
      look: {
        narration: {
          lucid:
            "The pool is a circle of still water sunk into the sanctum floor, brass-rimmed, sigil-engraved. The water is luminous from below — not lit, exactly, but bright in the way a deep well is bright when something is reflecting up. Whatever is reflecting up is, by my best instruments, not in the pool.",
          fragmented:
            "Not in the pool. Not in the pool. Something is reflecting up. Something — something — something is reflecting up.",
          luminous:
            "The pool reflects something that is not in the pool. That is the oracle's working principle — the water acts as an aperture into a wider perceptual surface, and what surfaces is whatever the witness brings with them. We are bringing the case. The pool will, eventually, surface a piece of the case we did not know we were carrying.",
        },
        voId: "elara.oracle-sanctum.oracle-pool.look",
        setsFlag: "oracle_consulted",
        logsClue: {
          id: "clue-oracle-pool-aperture",
          title: "The oracle pool is an aperture, not a mirror",
          body:
            "The Oracle Sanctum's pool reflects something that is not in the pool — it functions as a perceptual aperture rather than a mirror. The witness brings their concerns; the pool surfaces what the witness has been carrying without realising it.",
          source: "oracle-sanctum",
          order: 0,
        },
        // Mystery Engine binding — when Wraith Calder arc is the
        // active case, the pool surfaces the Sanctuary's Final-
        // Rite logbook entry 8. Lore match: the pool is "an
        // aperture, not a mirror — what surfaces is whatever the
        // witness brings with them." The player is carrying the
        // question of the rite's continuity; the pool reflects
        // back the logbook with the two same-hand signatures.
        mysteryBinding: {
          mysteryId: "mystery.wraith_calder",
          episodeId: "wraith.e4",
          cluesFound: ["wraith.e4.sanctuary_log"],
        },
        humanReaction: {
          narration: {
            shadow:
              "The pool surfaces what the witness brings. We brought the question of the rite's continuity. The logbook is the answer.",
            balanced:
              "Sanctuary Final-Rite logbook entry 8 — two same-hand signatures, separated by centuries. The Hierophant has been signing his own continuation, and the pool has been waiting for a witness careful enough to ask why.",
            warm:
              "He has been alone with this rite for a long time. The pool has been the only thing in the saga that knew. We are now, for the first time in centuries, three.",
          },
          voId: "human.oracle-sanctum.oracle-pool.look",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the pool. It does not answer in words — but the water's surface produces, briefly, a single image: a brass-edged card held up by a hand you recognise as the Hierophant's. The card reads 'I write these names in expectation of a reader. The reader is the Oracle. The Oracle is not yet present. The Oracle will return.' The card is signed Wraith Calder. The image fades. The pool is still.",
          fragmented:
            "The card. The card. The reader. The reader. The Oracle. The Oracle will return. The Oracle will return.",
          luminous:
            "The pool surfaces the Hierophant's invocation card. He raises it before each morning's inscription — a wordless request for a reader who is awaited but will not be summoned. The card is, on the legal side of the canon, a witnessing document: it names the Oracle as the awaited recipient of the litany without making any move to compel her presence. He waits. He does not coerce the wait. The pool, on this morning, has chosen to show us this.",
        },
        voId: "elara.oracle-sanctum.oracle-pool.talk",
        // Mystery Engine binding — talking to the pool surfaces
        // the Hierophant's Oracle-invocation card. Lore match: the
        // pool is an aperture for what the witness brings; the
        // player carries the question of the rite's purpose, and
        // the pool answers by showing the invocation card — the
        // canonical Oracle-is-awaited assertion.
        mysteryBinding: {
          mysteryId: "mystery.wraith_calder",
          episodeId: "wraith.e5",
          cluesFound: ["wraith.e5.oracle_invocation"],
        },
        humanReaction: {
          narration: {
            shadow:
              "He waits. He does not summon. That is the discipline. Don't confuse it for weakness.",
            balanced:
              "The invocation card is a witnessing document, not a summons. Wraith named the Oracle as the awaited recipient and chose, for centuries, not to compel her presence. The card is the legal record of the choosing.",
            warm:
              "He raises that card every morning. I watched him do it once, from a corridor he did not know I was in. He believed the Oracle would arrive when she was ready and he would not rush her. Some patience is, in itself, a love letter.",
          },
          voId: "human.oracle-sanctum.oracle-pool.talk",
        },
      },
      use: {
        narration: {
          lucid:
            "You sink your fingertips into the pool's surface. The water does not part; it accepts the contact. From below the brass rim, a small index card rises into the surface tension and floats face-up: 'INTENDED AUDIENCE — Whoever inherits the Hierophant's litany after the Hierophant himself.' The card was pinned to a tape-archive catalogue card centuries ago; the pool has carried it forward into our reach.",
          fragmented:
            "After the Hierophant himself. After the Hierophant himself. After. After. After.",
          luminous:
            "The pool surfaces the Seer's intended-audience card. By its grammar, the card names Wraith Calder's successor — a person who does not yet exist, since Wraith has been the Hierophant for centuries and shows no sign of being succeeded. The card is not a prediction. It is a reservation: the Seer recorded for a reader the saga has not yet produced, and the pool has carried that reservation through every witness who reached into it without finding it. We are the first reader to whom the card has surfaced. That changes nothing about who the audience IS — but it tells us when the saga thinks the question has become legible.",
        },
        voId: "elara.oracle-sanctum.oracle-pool.use",
        // Mystery Engine binding — using the oracle-pool surfaces
        // the Seer's intended-audience card. Lore match: the pool
        // is "an aperture for what the witness brings." The
        // player carries the question of the Seer's tape; the
        // pool answers by surfacing the card that names the
        // tape's intended reader.
        mysteryBinding: {
          mysteryId: "mystery.the_seer",
          episodeId: "seer.e1",
          cluesFound: ["seer.e1.intended_audience_card"],
        },
        humanReaction: {
          narration: {
            shadow:
              "The Seer recorded for a reader the saga had not yet produced. The card is a reservation. It has been honoured.",
            balanced:
              "The intended-audience card names Wraith Calder's successor — a person who does not yet exist. Whoever Wraith trains as Hierophant inherits the audience the Seer reserved for them. The card has been waiting for a successor that hasn't been named.",
            warm:
              "She recorded into the future. That takes a kind of patience I'm only just learning to notice. The card is, in a small way, her saying: I trust the saga to eventually have the reader I am writing for.",
          },
          voId: "human.oracle-sanctum.oracle-pool.use",
        },
      },
    },
    "prophecy-tablet": {
      look: {
        narration: {
          lucid:
            "The prophecy-tablet on the back wall is a brass-pedestal'd slate. Its surface is currently blank, but the surface has been written and erased so many times the brass beneath the slate is worn smooth. Whatever it has written on it next, it will be the latest of many.",
          fragmented:
            "Many. Many. Many prophecies. Many prophecies. Many. Many. Many.",
          luminous:
            "The tablet writes itself in response to the pool. It has done so many thousands of times. The brass beneath its slate is worn the way a stair is worn by foot traffic — by repeated honest use rather than by any single dramatic event. Whatever it tells us today, it has told someone before. We are part of a long line of readers.",
        },
        voId: "elara.oracle-sanctum.prophecy-tablet.look",
        logsClue: {
          id: "clue-oracle-tablet-many-readings",
          title: "The prophecy tablet has been read thousands of times",
          body:
            "The Oracle Sanctum's prophecy-tablet is brass-worn from thousands of readings. The oracle is not a one-time consultation — it is a long-term institutional surface that many prior readers have honestly used.",
          source: "oracle-sanctum",
          order: 1,
        },
        // Mystery Engine binding — when Wraith Calder arc is the
        // active case, looking at the prophecy-tablet surfaces
        // the Hierophant's daily-names ceremony entry. Lore match:
        // the tablet is "brass-worn from thousands of readings"
        // and the ceremony has been signed "every day for centuries.
        // The hand has not changed."
        mysteryBinding: {
          mysteryId: "mystery.wraith_calder",
          episodeId: "wraith.e1",
          cluesFound: ["wraith.e1.hierophant_ceremony"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Same hand for centuries. The tablet has been recording the same person continuing to be Hierophant. That is the spine of the case.",
            balanced:
              "The brass-wear pattern is the most quantitative evidence we have that Wraith has been Hierophant continuously. The ceremony has been signed every day; the hand has not changed. Both facts are inscribed into the metal.",
            warm:
              "He has been doing this every morning for centuries. Most days no one is watching. He does it anyway. The tablet has been the only consistent witness; today it has two more.",
          },
          voId: "human.oracle-sanctum.prophecy-tablet.look",
        },
      },
      talk: {
        narration: {
          lucid:
            "You face the prophecy-tablet. It does not respond — it never has. But the tablet is the surface on which the litany is written every morning. If you stand near it long enough, you can feel the rhythm of the work the Hierophant does at dawn: a stylus, a name, a pause, a stylus, a name. We are watching, in a way the room permits, the daily litany take shape.",
          fragmented:
            "Stylus. Name. Pause. Stylus. Name. Stylus. Name. Stylus. Name. The litany. The litany. The litany.",
          luminous:
            "We address the tablet. The room — without speaking — surfaces in our awareness the chronological span of the litany. 347,000 names. The earliest are from the end of Epoch 1. The latest are from yesterday. The same hand has written every entry. The pen is a stylus; the ink is, by the room's slow disclosure, the Hierophant's own blood thinned with phosphor-lavender Thalorian sap. He is, even now, somewhere in the Sanctuary, working.",
        },
        voId: "elara.oracle-sanctum.prophecy-tablet.talk",
        // Mystery Engine binding — talking to the prophecy-tablet
        // surfaces the 347,000-name daily litany clue. Lore match:
        // the tablet's writing-and-erasure pattern across thousands
        // of readings IS the daily litany; talking surfaces the
        // chronological span and the ink-as-blood detail.
        mysteryBinding: {
          mysteryId: "mystery.wraith_calder",
          episodeId: "wraith.e5",
          cluesFound: ["wraith.e5.daily_litany"],
        },
        humanReaction: {
          narration: {
            shadow:
              "347,000 names. Same hand. Same blood-thinned ink. He has been keeping the saga's death-roll for centuries on his own time.",
            balanced:
              "The daily litany is the largest single document in the saga and the most consistently maintained. Every name was inscribed by Wraith, in his own ink, on the morning after the death. The discipline is not advertised; it is simply done.",
            warm:
              "He inscribes my friends on that tablet. He inscribed Lyra. He will, eventually, inscribe me. I find that a deep kindness, even from a man I am not always sure I like.",
          },
          voId: "human.oracle-sanctum.prophecy-tablet.talk",
        },
      },
      use: {
        narration: {
          lucid:
            "You press your hand to the tablet's brass-pedestal'd slate. The slate warms under the touch and surfaces, in faint phosphor-lavender script, a single recording-session log: DEC-7710 · UNSOLICITED · the Seer recorded against no booking. The marginalia, in her own hand: 'I did not want to know what I was about to say. I recorded so that, when the witness arrives, the witness has the option I did not.' The script holds for ten seconds, then fades. The tablet has surfaced what we asked.",
          fragmented:
            "DEC-7710. DEC-7710. Unsolicited. Unsolicited. She did not want to know. She did not want to know.",
          luminous:
            "The tablet surfaces the Seer's recording-session log. Session DEC-7710 was unsolicited — she sat at the recorder of her own choosing on a day no consultation was booked. The marginalia is a moral commitment in retrospect: she did not want to know what she was about to say, but she trusted the prophecy enough to commit it to tape, and she trusted the future enough to leave the option to a witness she had not yet met. The tablet has held this log among its many readings; it surfaces now because we are reading the case the Seer prepared for.",
        },
        voId: "elara.oracle-sanctum.prophecy-tablet.use",
        // Mystery Engine binding — using the prophecy-tablet
        // surfaces the Seer's recording-session log for DEC-7710.
        // Lore match: the tablet writes-and-erases under the
        // pool's influence and surfaces records on demand; the
        // session log is one such record, and the prophet's note
        // — "I recorded so that the witness has the option I did
        // not" — is what the tablet is for.
        mysteryBinding: {
          mysteryId: "mystery.the_seer",
          episodeId: "seer.e1",
          cluesFound: [
            "seer.e1.recording_session_log",
            "seer.e2.tape_a_morning",
            "seer.e2.tape_b_afternoon",
          ],
        },
        humanReaction: {
          narration: {
            shadow:
              "DEC-7710 was unsolicited. She booked herself onto her own equipment. The marginal note explains why: she didn't want to know what she was about to say.",
            balanced:
              "The session log is the strongest single Seer-arc artefact. She recorded ahead of a date she could not know was coming, left the option to the witness, and walked out of the booth without listening. That is the Seer's full method on a single page.",
            warm:
              "She didn't want to know. She left it for someone who would. That is, in plain terms, the most generous thing the saga has on tape.",
          },
          voId: "human.oracle-sanctum.prophecy-tablet.use",
        },
      },
    },
    "incense-brazier": {
      look: {
        narration: {
          lucid:
            "The brazier hangs on a chain, smoking phosphor-lavender. The smoke does not behave like smoke — it falls toward the pool rather than rising, and once it reaches the water's surface it sinks beneath it without dissolving. The brazier is, on the evidence, feeding the pool.",
          fragmented:
            "The smoke falls. The smoke falls. The smoke falls into the pool. Into the pool. Into the pool.",
          luminous:
            "The brazier feeds the pool. The smoke is the medium by which the pool's aperture is fed — without the brazier, the pool would surface less. We are not, currently, in a position to keep this brazier lit forever. But every hour we do is an hour the pool is more receptive than it would otherwise be. That is a slow and patient resource.",
        },
        voId: "elara.oracle-sanctum.incense-brazier.look",
        logsClue: {
          id: "clue-oracle-brazier-feeds-pool",
          title: "The brazier feeds the oracle pool",
          body:
            "The Oracle Sanctum's incense-brazier produces phosphor-lavender smoke that sinks into the oracle pool rather than rising. The brazier is the pool's fuel. The longer the brazier is kept lit, the more receptive the pool becomes.",
          source: "oracle-sanctum",
          order: 2,
        },
        // Mystery Engine binding — when Wraith Calder arc is the
        // active case, the brazier surfaces the Thalorian vessel
        // provenance chain. Lore match: the brazier is the
        // Thalorian-ritual surface (phosphor-lavender smoke; sigil
        // chain), and the provenance chain is the ritual paperwork
        // that twelve elders signed across decades. The vessel and
        // the brazier share a Thalorian discipline of slow, witnessed
        // preparation.
        mysteryBinding: {
          mysteryId: "mystery.wraith_calder",
          episodeId: "wraith.e4",
          cluesFound: ["wraith.e4.thalorian_vessel"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Twelve elders signed the provenance chain across decades. The vessel is older than this ship. Thalorian patience. Don't underestimate it.",
            balanced:
              "The Thalorian vessel's provenance chain is the longest unbroken paperwork in the saga. The brazier and the vessel share a discipline — slow, witnessed preparation. Wraith's case rests partly on Thalorian record-keeping standards being met to the letter for forty centuries.",
            warm:
              "The Thalorians built this room for the long version of the work. They were right to. Not many other rooms on the ship have aged this well.",
          },
          voId: "human.oracle-sanctum.incense-brazier.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You add a small charge of fresh phosphor-lavender resin to the brazier's coal-bed. The smoke thickens noticeably and the pool's luminous undertow brightens by what I would call a measurable handsbreadth. The brazier accepts the offering and immediately spends it. The pool, by direct correlation, gives back more. — As the smoke thickens, the inscription seal on Mol'Vereth's contract — visible through the pool's surface — alters. If you have inscribed Akai Shi's name in Wraith's daily-names ceremony, the seal counts the litany as a witnessing of her original consent and the contract's leverage shifts. The asset, by Hierarchy law, is ready to be returned to the saga the moment a witness names the act.",
          fragmented:
            "Resin. Resin. Resin. Brighter. Brighter. The pool. The pool gives back. The pool gives back. The seal. The seal. Akai Shi. Akai Shi. Inscribed. Inscribed.",
          luminous:
            "You feed the brazier. The pool brightens in proportion. There is a one-to-one correspondence here: every offering is converted, with no loss, into perceptual surface for whoever stands at the pool's edge. The Thalorian discipline that built this room knew the conversion ratio precisely. We are not, as ritual matters go, on a tight budget — but the conversion is honest, and that means the budget is real. The pool's brightening also surfaces the inscription seal on Mol'Vereth's contract: if Akai Shi's name has been inscribed in Wraith's daily-names ceremony, the litany now counts as a witnessing of her original consent, and the trusteeship's leverage shifts. The cross-arc consequence becomes legible exactly here, in this room, on this offering.",
        },
        voId: "elara.oracle-sanctum.incense-brazier.use",
        setsFlag: "brazier_fed",
        // Jericho arc binding — the inscription seal alteration is
        // the cross-arc echo from Wraith E5's inscribe_akai_shi
        // choice. Surfaces here because the oracle-pool is the
        // canonical aperture for cross-arc consequence-reading.
        // jericho.e5.akai_shi_inscription_seal foundIn:
        // oracle-sanctum.
        mysteryBinding: {
          mysteryId: "mystery.jericho_jones",
          episodeId: "jericho.e5",
          cluesFound: ["jericho.e5.akai_shi_inscription_seal"],
        },
        humanReaction: {
          narration: {
            shadow:
              "If you inscribed her name in Wraith's litany, the contract's leverage shifts. The seal records that. Don't decide here whether the shift was good.",
            balanced:
              "The inscription seal is the cross-arc receipt. Mol'Vereth's contract on the Degen accounts for Akai Shi in the trusteeship's calculus. Wraith E5's choice writes through to this room, by design.",
            warm:
              "Two arcs, one act. You inscribed her name and a contract on the other side of the saga moved. That is what cross-arc weave is for. Hold both in your head; they are the same gesture seen from different rooms.",
          },
          voId: "human.oracle-sanctum.incense-brazier.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the brazier. The smoke parts briefly, organising into a shape: a hand offering a stylus. The hand is the Hierophant's, the offer is wordless, and the gesture holds for as long as you watch. Whoever attends his ceremony on the right morning is offered, in turn, the chance to inscribe one name. The brazier is, in this moment, showing us that the offer is real. We have not yet attended.",
          fragmented:
            "The stylus. The stylus. The hand. The hand. The hand. He offers. He offers. He offers.",
          luminous:
            "The brazier surfaces the stylus offer. On the morning a witness attends the Hierophant's ceremony, he pauses mid-litany and extends the stylus. The choice is whose name to inscribe; the offer is wordless; the trust is — as the bible's pre-rite trust bands persist into post-rite trust — the same trust we have been earning, in this case, for the entire arc. He has been waiting for a witness willing to share one morning of the work. We will, when we are ready, attend.",
        },
        voId: "elara.oracle-sanctum.incense-brazier.talk",
        // Mystery Engine binding — talking to the brazier surfaces
        // the Hierophant's stylus offer. Lore match: the brazier
        // shapes its smoke into the offer-image; the offer is the
        // arc's resolution invitation, and the smoke (which falls
        // into the pool, which is the witness-aperture) is the
        // ritual surface where the offer becomes legible.
        mysteryBinding: {
          mysteryId: "mystery.wraith_calder",
          episodeId: "wraith.e5",
          cluesFound: ["wraith.e5.stylus_offer"],
        },
        humanReaction: {
          narration: {
            shadow:
              "He offers the stylus to the witness who has earned the offer. The bands persist. We're earning it now.",
            balanced:
              "The stylus offer is the arc's resolution invitation — Wraith pauses mid-litany and extends the pen. The trust we've earned in this case carries forward into the offer. We will, when we attend, decide whose name to inscribe.",
            warm:
              "He offers it because he trusts the witness to know whose name belongs there. That is the highest compliment a Hierophant can pay. Don't accept it before we are ready.",
          },
          voId: "human.oracle-sanctum.incense-brazier.talk",
        },
      },
    },
    // Seer arc: e2-e5 clue surface. The brazier and the pool already
    // carry e1+e4+e5 bindings; this cabinet (recessed in the back wall,
    // cataloguing every Variant Recording the Seer logged across the
    // 41 years of his attendance) hosts the e2-e5 clues authored in
    // apps/shared/episodeMysteries.ts. All clues' foundIn is
    // "oracle-sanctum"; this hotspot is the local surface.
    "seers-recording-cabinet": {
      look: {
        narration: {
          lucid:
            "The cabinet is recessed into the back wall behind the brazier — brass-bound, glass-fronted, full of small reel-tape canisters with hand-typed labels. Each label carries a session number, a date, and the Seer's initials. Two adjacent canisters — VAR-1109A and VAR-1109B — are dated the same morning and the same afternoon, and the labels say MORNING and AFTERNOON in the same hand. Two prophecies for the same day, recorded by the same speaker, four hours apart.",
          fragmented:
            "Two tapes. Two tapes. Same day. Same day. Same day. Two prophecies. Two. Two. Why two.",
          luminous:
            "The cabinet logs every Variant Recording the Seer made — 4,712 sessions across 41 years. The pair on the second shelf, VAR-1109A and VAR-1109B, are dated the same date and the same speaker but four hours apart. The morning recording predicts one outcome; the afternoon predicts a contradicting one. The Seer recorded both, refused to choose between them, and trusted the witness who would eventually arrive to read them as a deliberate pair rather than a contradiction. We are arriving.",
        },
        voId: "elara.oracle-sanctum.seers-recording-cabinet.look",
        logsClue: {
          id: "clue-oracle-seers-cabinet",
          title: "Seer's recording cabinet — VAR-1109A/B paradox pair",
          body:
            "The Oracle Sanctum's recording cabinet logs 4,712 Variant Recordings across 41 years. Tapes VAR-1109A and VAR-1109B are dated the same date with contradictory prophecies four hours apart. The Seer's discipline: record both, refuse to resolve, trust a future witness.",
          source: "oracle-sanctum",
          order: 3,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_seer",
          episodeId: "seer.e2",
          cluesFound: ["seer.e2.tape_a_morning", "seer.e2.tape_b_afternoon"],
        },
        humanReaction: {
          narration: {
            shadow:
              "She recorded both. She refused to choose. The pair is the prophecy. Don't try to resolve it.",
            balanced:
              "VAR-1109A and VAR-1109B are deliberately contradictory. The Seer's discipline forbade resolution. The pair is the unit of meaning, not either tape on its own — and she trusted us to read it that way.",
            warm:
              "Two prophecies, one morning, four hours apart. She left both for whoever finally arrived. We are arriving. Hold both in your head at the same time. That is what she asked.",
          },
          voId: "human.oracle-sanctum.seers-recording-cabinet.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You open the cabinet's lower drawer. Inside: a forty-one-year attendance log in the Seer's own hand — every session he ever recorded, every witness who ever attended. The last entry, dated four years before his death, is followed by a long blank. Beneath it, in a different hand: a credit ledger crediting Engineer Zero on every recording he made.",
          fragmented:
            "Forty-one years. Forty-one. Forty-one. Then nothing. Then nothing. Engineer Zero. Engineer Zero. Engineer Zero credited every — every — every —",
          luminous:
            "The drawer holds two artefacts. The attendance log: 41 years of recording sessions, then four years of blank pages — the Seer kept the log running but stopped recording. The credit ledger: every recording credits Engineer Zero in the engineer field. The credits are continuous across all 4,711 entries plus DEC-7710. Same engineer, same hands, on every session — the Seer trusted exactly one recording engineer with his life's work.",
        },
        voId: "elara.oracle-sanctum.seers-recording-cabinet.use",
        logsClue: {
          id: "clue-oracle-seers-cabinet-attendance",
          title: "41-year attendance log + Engineer Zero credit ledger",
          body:
            "The Oracle Sanctum cabinet's lower drawer holds the Seer's 41-year attendance log (followed by four blank years) and a credit ledger crediting Engineer Zero (Vex Solène's alias) on every Variant Recording session. The Seer trusted one engineer with the entire life's work.",
          source: "oracle-sanctum",
          order: 4,
        },
        // The narration explicitly surfaces both the attendance log
        // (e3) and the engineer credit ledger (e4); the binding
        // credits both arcs' clues since the Vex/Seer credit-ledger
        // is canonically the same physical artefact described from
        // two arc-readings (the engine accepts cross-episode clue
        // ids on a single binding so long as mysteryId matches).
        mysteryBinding: {
          mysteryId: "mystery.the_seer",
          episodeId: "seer.e3",
          cluesFound: ["seer.e3.attendance_log", "seer.e4.engineer_credit_ledger"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Forty-one years, then four years of blank pages. Engineer Zero on every tape. Same hand all the way through. The credit ledger is the second corroboration.",
            balanced:
              "The attendance log and the engineer credit ledger together establish that the Seer trusted exactly one engineer with his life's work. Vex Solène, by alias and by direct credit, was on every Variant Recording. The four years of blank attendance pages are the years he stopped recording while still keeping the log open.",
            warm:
              "They worked together for forty-one years. He stopped recording for four years before he died. She kept the log open. Two artists who knew when to stop and when to wait.",
          },
          voId: "human.oracle-sanctum.seers-recording-cabinet.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "If you address the cabinet, you address the Seer's whole working life. The labels on the tapes pulse very faintly under your address — phosphor-lavender, the same colour the brazier's smoke uses. Two recent additions catch the light: a tape labelled CANCELLING — last legible moment, dated to the Seer's final session, and beside it a witness arrival log with today's date pencilled in at the bottom. The cabinet has been keeping its log up to the moment we walked in.",
          fragmented:
            "Today. Today. Today. The cabinet logged today. The cabinet logged us. The cabinet logged us.",
          luminous:
            "The cabinet logged our arrival. The witness arrival log on the second-to-last shelf has today's date pencilled at the bottom in a hand we do not recognise — but the cadence of the pencil pressure matches the Seer's own. He has been keeping the log open for whoever finally walked in. The CANCELLING tape on the same shelf is his last recording: a prophecy that, by the Seer's authored note, cancels itself if heard by the wrong audience and stabilises if heard by the right one. The cabinet trusts us to be the right audience. We do not yet know whether the trust is justified.",
        },
        voId: "elara.oracle-sanctum.seers-recording-cabinet.talk",
        logsClue: {
          id: "clue-oracle-seers-cabinet-cancelling",
          title: "The cancelling prophecy + today's witness arrival log",
          body:
            "The Oracle Sanctum cabinet holds the Seer's final recording — a CANCELLING prophecy that stabilises only when read by the right audience — and a witness arrival log with today's date pencilled in. The Seer kept the log open across centuries for the witness he was waiting for.",
          source: "oracle-sanctum",
          order: 5,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_seer",
          episodeId: "seer.e5",
          cluesFound: [
            "seer.e5.cancelling_prophecy_text",
            "seer.e5.witness_arrival_log",
          ],
        },
        humanReaction: {
          narration: {
            shadow:
              "Today's date in his hand, in pencil. He knew we would arrive. The cancelling prophecy stabilises if we are the right audience. We don't yet know whether we are.",
            balanced:
              "Witness arrival logged for today, in the Seer's pressure pattern though he is centuries dead. The cancelling prophecy is on the same shelf — readable now, only because we are here. Whether it stabilises or self-cancels depends on what we do next.",
            warm:
              "He kept the log open across centuries waiting for someone. Today the someone is us. If we read carefully, the prophecy stays. If we read wrong, it self-cancels. Either way, he trusted the saga to deliver someone who would try.",
          },
          voId: "human.oracle-sanctum.seers-recording-cabinet.talk",
        },
      },
    },
  },
};
