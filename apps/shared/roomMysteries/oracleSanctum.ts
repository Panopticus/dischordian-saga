/* ═══════════════════════════════════════════════════════
   ORACLE SANCTUM MYSTERY — pool, tablet, brazier

   Three-hotspot module for the deck-9 oracle-pool sanctum.
   Sets oracle_consulted on first-look at the oracle-pool.
   Universal room.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type OracleSanctumHotspotId =
  | "dlc-mechronis-missing-professor-oracle-sanctum"
  | "dlc-memorial-forgotten-names-oracle-sanctum"
  | "dlc-charter-second-signatory-oracle-sanctum"
  | "dlc-severance-infernal-clause-oracle-sanctum"
  | "dlc-advocate-blood-weave-oracle-sanctum"
  | "oracle-pool" | "prophecy-tablet" | "incense-brazier" | "seers-recording-cabinet";

export const ORACLE_SANCTUM_MYSTERY: RoomMysteryModule<OracleSanctumHotspotId> = {
  roomId: "oracle-sanctum",
  responses: {
    "dlc-mechronis-missing-professor-oracle-sanctum": {
      look: {
        narration: "Case material for mechronis.missing_professor surfaces here — the records pertinent to this room's part of the investigation.",
        mysteryBinding: {
          mysteryId: "mechronis.missing_professor",
          episodeId: "mechronis.missing_professor.e4",
          cluesFound: ["mechronis.e4.tarn_recorded_message"],
        },
      },
    },
    "dlc-memorial-forgotten-names-oracle-sanctum": {
      look: {
        narration: "Case material for memorial.forgotten_names surfaces here — the records pertinent to this room's part of the investigation.",
        mysteryBinding: {
          mysteryId: "memorial.forgotten_names",
          episodeId: "memorial.forgotten_names.e1",
          cluesFound: ["memorial.e1.antiquarian_request"],
        },
      },
    },
    "dlc-charter-second-signatory-oracle-sanctum": {
      look: {
        narration: "Case material for charter.second_signatory surfaces here — the records pertinent to this room's part of the investigation.",
        mysteryBinding: {
          mysteryId: "charter.second_signatory",
          episodeId: "charter.second_signatory.e2",
          cluesFound: ["charter2.e2.descendant_account"],
        },
      },
    },
    "dlc-severance-infernal-clause-oracle-sanctum": {
      look: {
        narration: "Case material for severance.infernal_clause surfaces here — the records pertinent to this room's part of the investigation.",
        mysteryBinding: {
          mysteryId: "severance.infernal_clause",
          episodeId: "severance.infernal_clause.e4",
          cluesFound: ["infernal.e4.zyrkoth_response"],
        },
      },
    },
    "dlc-advocate-blood-weave-oracle-sanctum": {
      look: {
        narration: "Case material for advocate.blood_weave surfaces here — the records pertinent to this room's part of the investigation.",
        mysteryBinding: {
          mysteryId: "advocate.blood_weave",
          episodeId: "advocate.blood_weave.e4",
          cluesFound: ["adv.e4.ninth_conexus_story"],
        },
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
