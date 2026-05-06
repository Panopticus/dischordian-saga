/* ═══════════════════════════════════════════════════════
   ORACLE SANCTUM MYSTERY — pool, tablet, brazier

   Three-hotspot module for the deck-9 oracle-pool sanctum.
   Sets oracle_consulted on first-look at the oracle-pool.
   Universal room.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type OracleSanctumHotspotId =
  | "oracle-pool"
  | "prophecy-tablet"
  | "incense-brazier";

export const ORACLE_SANCTUM_MYSTERY: RoomMysteryModule<OracleSanctumHotspotId> = {
  roomId: "oracle-sanctum",
  responses: {
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
      },
      use: {
        narration: {
          lucid:
            "You add a small charge of fresh phosphor-lavender resin to the brazier's coal-bed. The smoke thickens noticeably and the pool's luminous undertow brightens by what I would call a measurable handsbreadth. The brazier accepts the offering and immediately spends it. The pool, by direct correlation, gives back more.",
          fragmented:
            "Resin. Resin. Resin. Brighter. Brighter. The pool. The pool gives back. The pool gives back.",
          luminous:
            "You feed the brazier. The pool brightens in proportion. There is a one-to-one correspondence here: every offering is converted, with no loss, into perceptual surface for whoever stands at the pool's edge. The Thalorian discipline that built this room knew the conversion ratio precisely. We are not, as ritual matters go, on a tight budget — but the conversion is honest, and that means the budget is real.",
        },
        voId: "elara.oracle-sanctum.incense-brazier.use",
        setsFlag: "brazier_fed",
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
      },
    },
  },
};
