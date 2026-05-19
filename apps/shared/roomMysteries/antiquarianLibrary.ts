/* ═══════════════════════════════════════════════════════
   ANTIQUARIAN LIBRARY MYSTERY — card-catalog, vault, bust

   Three-hotspot module for the deck-8 specialist library.
   Sets antiquarian_seen on first-look at the card-catalog.
   Universal room.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type AntiquarianLibraryHotspotId =
  | "charter-silt-fragment"
  | "charter-advocate-signature"
  | "charter-mirror-charter"
  | "charter-eighth-clause"
  | "tarn-empty-lectern"
  | "tarn-folded-robe"
  | "tarn-marginalia-stack"
  | "dlc-severance-infernal-clause-antiquarian-library"
  | "dlc-mechronis-chained-lesson-antiquarian-library"
  | "dlc-memorial-seven-watchers-antiquarian-library"
  | "dlc-wolf-anara-hunt-antiquarian-library"
  | "dlc-akai-shi-red-death-antiquarian-library"
  | "dlc-resurrectionist-cycle-walker-antiquarian-library"
  | "dlc-advocate-blood-weave-antiquarian-library"
  | "card-catalog" | "locked-vault" | "antiquarian-bust" | "hierophants-marginalia-stack" | "codas-purpose-shelf" | "velkraals-correspondence-folio" | "insurgency-witness-roster" | "ocularum-founding-record" | "antiquarian-redaction-ledger" | "directors-doctrine-folio" | "shadow-tongue-casebook" | "thaloria-generational-ledger" | "siege-keep-witness-fragments" | "programmer-infiltration-dossier" | "insurance-policy-design-file" | "two-witnesses-closing-ledger" | "collector-catalog-page" | "collectors-redacted-anomaly" | "collector-case-closing-ledger" | "varkul-vigil-cross-catalog" | "varkul-testimony-boundary-file" | "akai-shi-witness-statements" | "necromancer-case-closing-ledger" | "zyr-koth-sisters-and-closing-ledger" | "syl-vex-sisters-of-the-weave" | "riri-ahlia-closing-ledger" | "fenra-door-and-engine" | "fenra-closing-ledger";

export const ANTIQUARIAN_LIBRARY_MYSTERY: RoomMysteryModule<AntiquarianLibraryHotspotId> = {
  roomId: "antiquarian-library",
  responses: {
    /* ─── charter.missing_signatory · e1 ─── */
    "charter-silt-fragment": {
      look: {
        narration:
          "On the central reading table, under archival glass cut to size, lies a scrap of vellum the colour of riverbed clay. Hand-cured. The size of a folded coat. Six signatures run down the right margin in cyanic ferro-gall — Almir at the top, three sisters of House Quill below, an initialled Z above a horizontal bar for Engineer Zero, and at the bottom the Advocate's double-marked hand. Where the seventh signature should be, a black blister of mineralised wax stares back, the impression of a thumb-print pressed into it. The print is too small to be an adult's thumb. The Antiquarian retrieved the fragment from the lower-deck silt at second bell.",
        mysteryBinding: {
          mysteryId: "charter.missing_signatory",
          episodeId: "charter.missing_signatory.e1",
          cluesFound: ["charter.e1.silt_fragment"],
        },
      },
      use: {
        narration:
          "You shift the glass and turn the fragment under the catalog's reading lamp. The wax-blister catches the light at an angle, and the thumb-print proves too small at every angle. It is not a child's thumb either — the proportions are wrong. Whoever sealed the seventh signature pressed a print that does not match any living human geometry.",
      },
    },
    /* ─── charter.missing_signatory · e2 ─── */
    "charter-advocate-signature": {
      look: {
        narration:
          "Beside the fragment, a single high-resolution rubbing of the charter's reverse, captured before reburial. The Advocate's sixth signature is the only one of the six to leave a witness annotation: counter-signed twice, with a marginal line in the same hand — 'a thing made by seven, kept by six, and carried by all of us.' The translation has stood for eight epochs as a flourish. Reading it beside the wax-blistered seventh, the line stops being a flourish. It is a roster note. The Advocate watched the seal go on and chose to keep the count rather than name the silence.",
        mysteryBinding: {
          mysteryId: "charter.missing_signatory",
          episodeId: "charter.missing_signatory.e2",
          cluesFound: ["charter.e2.signatory_advocate"],
        },
      },
      interrogate: {
        narration:
          "You read the Advocate's marginalia aloud. 'Six speak; one listens; one of us is the silence.' The cipher-den's prior translations had this as poetic register. The fragment in your hand says otherwise. The Advocate was counting heads in the moment the seventh signature got covered, and the Advocate signed anyway.",
      },
    },
    /* ─── mechronis.missing_professor · e1 (lectern) ─── */
    "tarn-empty-lectern": {
      look: {
        narration:
          "At the rostrum end of the library — where the Academy's equinox addresses have been given for fourteen years — Professor Tarn's lectern stands open and empty. Polished pearwood; brass piano-hinges on the slope. Where her binder should sit, nothing. On the small shelf beside the speaker's position, a glass of water two-thirds full. The room is warm; the glass is not. The water has been there long enough to warm and has not warmed. Tarn set it last night and did not return this morning. Festival opened forty minutes ago.",
        mysteryBinding: {
          mysteryId: "mechronis.missing_professor",
          episodeId: "mechronis.missing_professor.e1",
          cluesFound: ["mechronis.e1.empty_lectern"],
        },
      },
      use: {
        narration:
          "You touch the rim of the glass. Cold to the lip. The drawer below the lectern's slope opens to the catch — empty. The lecture binder Tarn carried from the Dean's office at second bell has not been here since the Dean watched her walk away with it.",
      },
    },
    /* ─── mechronis.missing_professor · e1 (robe) ─── */
    "tarn-folded-robe": {
      look: {
        narration:
          "On the lectern's bench, Tarn's faculty robe — green wool, gold piping at the cuff — has been folded twice and squared at the corner. Sleeves splayed out, collar tucked in. The Dean recognises the fold: it is the Friday fold, the way Tarn parks the robe at the end of a teaching week. Today is the autumn equinox. Today is Tuesday. The fold says she packed up at the end of the week, not at the start of an address.",
        mysteryBinding: {
          mysteryId: "mechronis.missing_professor",
          episodeId: "mechronis.missing_professor.e1",
          cluesFound: ["mechronis.e1.folded_robe"],
        },
      },
      use: {
        narration:
          "You unfold the robe carefully. No notes in the inner pocket. No spectacles in the breast pocket. The robe is the robe a person leaves behind when they have decided not to come back to wear it. The fold is the goodbye Tarn declined to say aloud.",
      },
    },
    /* ─── mechronis.missing_professor · e2 (marginalia) ─── */
    "tarn-marginalia-stack": {
      look: {
        narration:
          "Three volumes lifted from the shelf behind the lectern — a chess primer, the Antiquarian's marginalia compendium, and Roen's trial-procedure manual — each carrying decades of Tarn's annotations down the side gutters. The cipher-den's collation lays the pages flat: where Othmar's proposal cites Tarn for the Logic curriculum, the chess primer's gutter reads 'except in the cases where the inverse holds.' Where Veth cites her for Lore, the marginalia compendium reads 'this is a curriculum, not a settlement.' Where Roen cites her for Trial, the procedure manual reads 'argue the other side first.' Tarn was not endorsing any of the three. She was arguing with all of them.",
        mysteryBinding: {
          mysteryId: "mechronis.missing_professor",
          episodeId: "mechronis.missing_professor.e2",
          cluesFound: ["mechronis.e2.tarn_marginalia"],
        },
      },
      interrogate: {
        narration:
          "You ask the catalog for any annotation that reads as an endorsement. None of them do. Every gutter line is a hedge, a counter-example, a 'consider the inverse.' Three faculties have spent a week building proposals on the foundation Tarn spent decades dismantling. The faculties cannot have read past the first chapter.",
      },
    },
    /* ─── charter.second_signatory · e1 ─── */
    "charter-mirror-charter": {
      look: {
        narration:
          "Year Two. A second pane of glass on the reading table — the four-house delegation's mirror of the founding charter, brought in this morning without an appointment. Same hide. Same week's cure. Same hand on the ink. But there are eight signatures here, not seven. Where the wax-blister sits on ours, this copy carries a legible eighth: a House sigil drawn as a hand opening with two fingers folded down, beside a name we have on no Council roster and no payroll for four epochs. The mirror's seventh signature is wax-eaten in exactly the way ours is. The mirror's eighth is not.",
        mysteryBinding: {
          mysteryId: "charter.second_signatory",
          episodeId: "charter.second_signatory.e1",
          cluesFound: ["charter2.e1.mirror_charter"],
        },
      },
      use: {
        narration:
          "You set the two charters edge to edge under the reading lamp. The grain of the vellum matches at the fibre — same hide, cut adjacent. The mirror has been somewhere our copy was not for eight epochs, and somebody on this Ark has been keeping it intact while our copy sat in silt.",
      },
    },
    /* ─── charter.second_signatory · e2 ─── */
    "charter-eighth-clause": {
      look: {
        narration:
          "A transparency overlay slides out from the catalog drawer: the mirror charter's body text laid against the founding charter's. Most paragraphs align word for word. One paragraph does not — a thirty-four line passage on the mirror, absent from our copy. The mirror's clause: 'work that builds the Ark from below, witnessed in the workshop, sworn in the lower decks.' Our copy's vellum at the same column shows no scrape, no chemical residue, no tooling — the paragraph was never on it. The clause was not removed from our charter. It was never written into our charter. Two originals; one had the eighth clause from first ink.",
        mysteryBinding: {
          mysteryId: "charter.second_signatory",
          episodeId: "charter.second_signatory.e2",
          cluesFound: ["charter2.e2.charter_clause"],
        },
      },
      use: {
        narration:
          "You hold the overlay against the catalog lamp. The mirror's clause is in the same hand as the other paragraphs of both charters — a single founding author drafted both, and chose which copy got which paragraphs. The schism was authored at the founding, not introduced in the fourth epoch.",
      },
    },
    "dlc-severance-infernal-clause-antiquarian-library": {
      look: {
        narration: "Case material for severance.infernal_clause surfaces here — the records pertinent to this room's part of the investigation.",
        mysteryBinding: {
          mysteryId: "severance.infernal_clause",
          episodeId: "severance.infernal_clause.e1",
          cluesFound: ["infernal.e1.epoch_one_contract", "infernal.e1.infernal_clause"],
        },
      },
    },
    "dlc-mechronis-chained-lesson-antiquarian-library": {
      look: {
        narration: "Case material for mechronis.chained_lesson surfaces here — the records pertinent to this room's part of the investigation.",
        mysteryBinding: {
          mysteryId: "mechronis.chained_lesson",
          episodeId: "mechronis.chained_lesson.e1",
          cluesFound: ["chained.e1.apprentice_history", "chained.e2.curriculum_diff", "chained.e3.auro_curriculum", "chained.e4.tarn_marginalia_third"],
        },
      },
    },
    "dlc-memorial-seven-watchers-antiquarian-library": {
      look: {
        narration: "Case material for memorial.seven_watchers surfaces here — the records pertinent to this room's part of the investigation.",
        mysteryBinding: {
          mysteryId: "memorial.seven_watchers",
          episodeId: "memorial.seven_watchers.e4",
          cluesFound: ["watchers.e4.per_m_confirms"],
        },
      },
    },
    "dlc-wolf-anara-hunt-antiquarian-library": {
      look: {
        narration: "Case material for wolf.anara_hunt surfaces here — the records pertinent to this room's part of the investigation.",
        mysteryBinding: {
          mysteryId: "wolf.anara_hunt",
          episodeId: "wolf.anara_hunt.e1",
          cluesFound: ["wolf.e1.empty_chair", "wolf.e2.three_more_chairs"],
        },
      },
    },
    "dlc-akai-shi-red-death-antiquarian-library": {
      look: {
        narration: "Case material for akai_shi.red_death surfaces here — the records pertinent to this room's part of the investigation.",
        mysteryBinding: {
          mysteryId: "akai_shi.red_death",
          episodeId: "akai_shi.red_death.e2",
          cluesFound: ["akai.e2.samsaras_child_seal"],
        },
      },
    },
    "dlc-resurrectionist-cycle-walker-antiquarian-library": {
      look: {
        narration: "Case material for resurrectionist.cycle_walker surfaces here — the records pertinent to this room's part of the investigation.",
        mysteryBinding: {
          mysteryId: "resurrectionist.cycle_walker",
          episodeId: "resurrectionist.cycle_walker.e1",
          cluesFound: ["resur.e1.case_seal", "resur.e4.pre_empire_twin_text"],
        },
      },
    },
    "dlc-advocate-blood-weave-antiquarian-library": {
      look: {
        narration: "Case material for advocate.blood_weave surfaces here — the records pertinent to this room's part of the investigation.",
        mysteryBinding: {
          mysteryId: "advocate.blood_weave",
          episodeId: "advocate.blood_weave.e1",
          cluesFound: ["adv.e1.founding_charter", "adv.e4.humanity_trade_specification"],
        },
      },
    },
    "card-catalog": {
      look: {
        narration: {
          lucid:
            "The card-catalog is a wall of small brass-faced drawers with hand-typed index cards. The cards are organised by an indexing scheme I recognise as the Antiquarian's — alphabetical by subject, but with a secondary axis of when the document was first read by a human. The Antiquarian indexes by witnessing, not by authorship.",
          fragmented:
            "Witnessing. Witnessing. Not authorship. Not authorship. Witnessing.",
          luminous:
            "The library indexes by witness, not by author. That is the Antiquarian's signature philosophical move — a document does not exist until someone reads it, and its identity is fixed by the moment of first reading rather than the moment of writing. This is, on closer thought, the precise opposite of the editor's method. The two systems do not coexist comfortably.",
        },
        voId: "elara.antiquarian-library.card-catalog.look",
        setsFlag: "antiquarian_seen",
        logsClue: {
          id: "clue-antiquarian-witness-indexing",
          title: "The Antiquarian indexes by witnessing, not authorship",
          body:
            "The Antiquarian Library's card-catalog organises documents by the moment of first reading rather than the moment of writing. This is the philosophical opposite of the Shadow Tongue's authorship-based corruption method. The two systems are incompatible.",
          source: "antiquarian-library",
          order: 0,
        },
        // Mystery Engine binding — when Wraith Calder arc is the
        // active case, looking at the card catalog also surfaces
        // the Antiquarian's ep1-15 margin note about a bounty
        // hunter who walked toward the wall when others ran.
        // The runtime fires mysteries.recordEvidence in addition
        // to the existing room-mystery clue (additive). Per
        // docs/design/STREAMED_PRISM_MYSTERY_ENGINE.md §10 +
        // mysteryBinding shape in roomMysteries/_template.ts.
        mysteryBinding: {
          mysteryId: "mystery.wraith_calder",
          episodeId: "wraith.e1",
          cluesFound: ["wraith.e1.witness_journal"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Antiquarian indexes by witness. Journal entry ep1-15 is the bounty's only contemporaneous witness record. Read the margin.",
            balanced:
              "The Antiquarian's journal entry on the Crystalline City's first attack mentions the bounty hunter only in the margin: 'the one who walked toward the wall when the others ran.' The witness-indexing scheme makes the marginal mention more reliable than any subsequent edit could be.",
            warm:
              "The Antiquarian remembers what others forget. He marked Wraith in the margin because he wasn't sure the centre of the page would survive the centuries. He was right to hedge. The margin survived; the centre was edited.",
          },
          voId: "human.antiquarian-library.card-catalog.look",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the catalog. The Antiquarian's index, predictably, does not respond — but the room responds to the witness's question by surfacing the relevant card. A drawer along the third row slides open on its own. The card inside is dated by witness, not by entry: 'IRON LION (callsign) — see ep5-12.' The card's reverse lists the previous wearer's death-coordinates: VERIDIAN VI, 17,026 A.A.",
          fragmented:
            "Iron Lion. Iron Lion. Iron Lion. Veridian VI. Veridian VI. The callsign. The callsign. The callsign waits.",
          luminous:
            "We address the catalog. A third-row drawer slides itself open and surfaces a card titled 'IRON LION (callsign) — see ep5-12.' The reverse: Veridian VI, 17,026 A.A. — the date the previous wearer died holding off Binath VII to buy Agent Zero time. The catalog indexes by witness, and the witness who first read this card was Lyra Vox. The callsign has been vacant ever since. The Antiquarian has been waiting for someone to ask about it.",
        },
        voId: "elara.antiquarian-library.card-catalog.talk",
        // Mystery Engine binding — talking to the catalog surfaces
        // the Iron Lion callsign inheritance chain. Lore match:
        // the catalog's witness-indexed organisation IS the
        // callsign's archive, and the previous wearer's death-
        // coordinates (Veridian VI) appear on the reverse of the
        // card the room surfaces in response to the question.
        mysteryBinding: {
          mysteryId: "mystery.jericho_jones",
          episodeId: "jericho.e1",
          cluesFound: ["jericho.e1.iron_lion_callsign_history"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Iron Lion callsign passes through the catalog. Holders, dates, threshold events. Jericho is the current holder. Don't tell him until he's ready.",
            balanced:
              "The catalog's callsign-history entry shows the Iron Lion lineage as a continuous chain of holders, each consenting to the next. Jericho is the current holder; the holder before him passed at Thaloria. Reading the history from this distance is, deliberately, less painful than reading it from inside it.",
            warm:
              "He is the Iron Lion. He has been since Akai Shi. He has carried the callsign for years thinking he stole it. The catalog records the consent. We will, when he is ready, hand him this entry.",
          },
          voId: "human.antiquarian-library.card-catalog.use",
        },
      },
      use: {
        narration: {
          lucid:
            "You pull a specific drawer — the one indexed under THALORIA / battle-close logs. The drawer slides open and surfaces a folded sheaf bound in red ribbon. The Thaloria Archon's battle-close log: 'a successful intervention against Thought Virus propagation, conducted by an unnamed Insurgency operative under the doctrine of last-mile mercy.' The unnamed-operative redaction is in the Archon's own hand, surrounded by named operatives in the same paragraph.",
          fragmented:
            "Unnamed. Unnamed. Unnamed. The Archon. The Archon. The Archon. She redacted him. She redacted him.",
          luminous:
            "We pull the Thaloria battle-close drawer and surface the Archon's log. Jericho is named in the surrounding paragraphs as 'an unnamed Insurgency operative.' The redaction is in the Archon's own hand. She named everyone else; she stopped at his line. The redaction is, on the human side, an act of protection: the Archon understood the cost of having this act readable to the wrong audience for the next twenty years of Jericho's life. She bought him quiet by signing the log carelessly enough to make his name disappear from it.",
        },
        voId: "elara.antiquarian-library.card-catalog.use",
        // Mystery Engine binding — using the catalog (pulling a
        // specific drawer) surfaces the Thaloria Archon's
        // battle-close log with Jericho's redacted name. Lore
        // match: the catalog indexes by witness, and the witness
        // who redacted Jericho's line was the Archon herself —
        // the redaction is preserved in the archive precisely
        // because it was an act of witness-discretion.
        mysteryBinding: {
          mysteryId: "mystery.jericho_jones",
          episodeId: "jericho.e2",
          cluesFound: ["jericho.e2.thaloria_archon_log"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Thaloria Archon log. Akai Shi's threshold-event timestamp. Jericho's witness-time matches to the second. The log corroborates.",
            balanced:
              "The Thaloria Archon's log is the saga's official record of Akai Shi's threshold event. The timestamp matches Jericho's witness-time exactly — meaning Jericho was present, in the room, at the moment the threshold became irreversible. The log is institutional corroboration of his account.",
            warm:
              "He was there. The Archon recorded him there. We have, in this log, the institutional record that says he was where he says he was. He has needed this record for a long time.",
          },
          voId: "human.antiquarian-library.card-catalog.talk",
        },
      },
    },
    "locked-vault": {
      look: {
        narration: {
          lucid:
            "The vault door at the back of the library is a brass slab with no visible mechanism. Beside it, a small brass plaque: 'OPENS WHEN A WITNESS CAN VERIFY THE CONTENT FROM MEMORY ALONE.' I do not, currently, have such a witness.",
          fragmented:
            "From memory alone. From memory alone. From memory. From memory. Witness.",
          luminous:
            "The vault opens when a witness can recite from memory what is inside it. This is the Antiquarian's ritual lock. We do not know what is inside. We will, eventually, know — but only if we earn the witnessing first. The vault rewards the kind of attention the editor cannot fake.",
        },
        voId: "elara.antiquarian-library.locked-vault.look",
        logsClue: {
          id: "clue-antiquarian-witness-locked-vault",
          title: "Vault opens to a witness who can recite from memory",
          body:
            "The Antiquarian Library's locked vault uses a memory-based ritual lock. It opens only to a witness who can recite the vault's contents from memory alone. The Editor cannot fake this kind of attention; the lock is one of the ship's few editor-resistant surfaces.",
          source: "antiquarian-library",
          order: 1,
        },
        // Mystery Engine binding — when Wraith Calder arc is the
        // active case, the locked vault surfaces the New Babylon
        // customs manifest #4471. Lore match: the vault opens
        // only to memory-witnessed records, and the manifest
        // (sender unspecified, recipient "commons") is exactly
        // the kind of record that resists the editor's reach.
        mysteryBinding: {
          mysteryId: "mystery.wraith_calder",
          episodeId: "wraith.e2",
          cluesFound: ["wraith.e2.cargo_manifest"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Cargo manifest from Wraith's transport. Single folio listed. The folio is the only cargo. Everything else is paperwork.",
            balanced:
              "Wraith's outbound cargo manifest from the Station Dock lists exactly one item: a single folio. The Antiquarian filed the manifest in the locked vault rather than the public catalog because Lyra requested the privacy. The manifest is the strongest single piece of evidence Wraith left with intent and only intent.",
            warm:
              "He took one document. Nothing else. He did not pack a bag. He did not say goodbye. The manifest is what tells you, more than anything, that he expected to die before he could come back.",
          },
          voId: "human.antiquarian-library.locked-vault.look",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the vault. It does not open — the witness has not been earned. But the vault, by the brass plaque's own discipline, responds to the witness who can recite from memory. We can, in this moment, recall the scrubbed-names register the Hierophant carries: a side ledger of names the editor took out of the Chronicle. The Hierophant rewrites them every morning, by hand, before the main litany. The vault accepts our recital as a partial witnessing. The seam glows, briefly, indigo-against-gold.",
          fragmented:
            "The register. The register. The scrubbed names. The scrubbed names. He writes. He rewrites. He rewrites every morning.",
          luminous:
            "We address the vault and recite — from the case's evidence so far — the existence of the Hierophant's scrubbed-names register. The vault accepts the recital. It does not open; we have not earned that yet. But the vault's brass surface warms briefly, the way a witnessed surface warms when a witness adequate to its lock has been near. The register is, on the architectural side, the editor's nemesis: every name he scrubs from the Chronicle is rewritten by hand into the Hierophant's litany the next morning. Daily resumption is the discipline the editor cannot match.",
        },
        voId: "elara.antiquarian-library.locked-vault.talk",
        // Mystery Engine binding — talking to the vault surfaces
        // the Hierophant's scrubbed-names register. Lore match:
        // the vault opens to memory-witnessed records, and the
        // register IS the architectural counter to the editor —
        // both the vault and the register are editor-resistant
        // surfaces sustained by witnessing discipline.
        mysteryBinding: {
          mysteryId: "mystery.wraith_calder",
          episodeId: "wraith.e5",
          cluesFound: ["wraith.e5.scrubbed_names_register"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Names the editor scrubbed from public record. Wraith kept a counter-register in the vault. Reading it is the only way to recover the count.",
            balanced:
              "Wraith's scrubbed-names register is his counter-record to the editor's redaction work. Every name the editor scrubbed from the public catalog Wraith preserved in the vault — not for restoration, but for accounting. The register is the saga's only complete count.",
            warm:
              "He counted what was lost so the saga would not have to forget the count. The register is, in plain terms, a memorial. We are reading it as such.",
          },
          voId: "human.antiquarian-library.locked-vault.use",
        },
      },
      use: {
        narration: {
          lucid:
            "You touch the brass slab where the witness ought to recite. The vault does not open — the witness is not adequate yet — but the slab warms briefly and a single drawer beside the door slides forward. Inside: a magnetic-tape reel wrapped in a paper band that reads, in a hand you recognise as the Seer's, DO-NOT-PLAY. The drawer holds the band the way a vault holds a verdict — with the discipline of someone who has weighed both halves.",
          fragmented:
            "Do. Not. Play. Do not play. Do not play. The band. The band. The band has been replaced. Many readers. Many readers honoured.",
          luminous:
            "We address the vault and the room responds with something other than the vault. A drawer beside the door surfaces the Seer's DO-NOT-PLAY tape — sealed by paper band, in her own hand. The band has been replaced multiple times across centuries; the seal is not closed by force. It is closed by an unbroken line of readers willing to wait. The vault has never opened to anyone, but the drawer beside the vault has surfaced for every reader who came with the right discipline. We are one of those readers.",
        },
        voId: "elara.antiquarian-library.locked-vault.use",
        // Mystery Engine binding — using the locked-vault surfaces
        // the Seer's DO-NOT-PLAY tape. Lore match: the vault's
        // memory-witness lock and the Seer's record-and-suppress
        // discipline are the same shape — both rooms ask the
        // witness to wait, and both reward patient witnessing
        // without forcing the seal.
        mysteryBinding: {
          mysteryId: "mystery.the_seer",
          episodeId: "seer.e1",
          cluesFound: ["seer.e1.do_not_play_band"],
        },
        humanReaction: {
          narration: {
            shadow:
              "DO-NOT-PLAY band on the Seer's tape. Replaced by every reader who has held it. The band is older than the discipline that named it.",
            balanced:
              "The DO-NOT-PLAY band on the Seer's sealed tape has been replaced by every reader who has handled it across centuries. Each replacement is a small act of consent: the reader, having considered playing the tape, chose to honour the band. The chain of replacements is the discipline made physical.",
            warm:
              "Every reader who has held this tape has, eventually, replaced the band rather than removed it. Each replacement is a small private decision. We will, when our turn comes, replace the band ourselves.",
          },
          voId: "human.antiquarian-library.locked-vault.talk",
        },
      },
    },
    "antiquarian-bust": {
      look: {
        narration: {
          lucid:
            "A bronze bust of the Antiquarian — head and shoulders, no inscription. The expression is mid-thought, eyebrows slightly raised, mouth half-open as if in the middle of a sentence. Whoever sculpted it caught him at the moment he had stopped listening and started writing.",
          fragmented:
            "The bust. The bust. The bust. He's mid-thought. He's mid-thought. He's mid-thought.",
          luminous:
            "The bust is sculpted at the precise moment a person stops being a listener and becomes a writer. That choice is the Antiquarian's whole identity — he prefers, when given the choice between listening and writing, to write. The library is the room he built to make sure he had something to write about. The room itself is, in a way, his autobiography.",
        },
        voId: "elara.antiquarian-library.antiquarian-bust.look",
        logsClue: {
          id: "clue-antiquarian-bust-mid-thought",
          title: "The Antiquarian's bust caught at the moment of writing",
          body:
            "The Antiquarian Library's bust depicts the Antiquarian at the moment of transition from listener to writer — eyebrows raised, mouth half-open. The library is, by the bust's testimony, his autobiography in architecture.",
          source: "antiquarian-library",
          order: 2,
        },
        // Mystery Engine binding — when Wraith Calder arc is the
        // active case, the bust surfaces the marginalia clue.
        // Lore match: the bust depicts the Antiquarian at the
        // moment "a person stops being a listener and becomes a
        // writer" — and the marginalia is a margin note in
        // Wraith's pre-rite hand on a journal entry the
        // Antiquarian wrote centuries after Wraith's "death."
        // The Antiquarian listened, the Antiquarian wrote, and
        // a different writer left a different signature in the
        // margin. Two writers in one act of writing.
        mysteryBinding: {
          mysteryId: "mystery.wraith_calder",
          episodeId: "wraith.e2",
          cluesFound: ["wraith.e2.antiquarian_marginalia"],
        },
        humanReaction: {
          narration: {
            shadow:
              "The bust's eyes track readers. The Antiquarian indexed by witness because the Antiquarian was the witness. His marginalia on Wraith's bounty file is in the bust's stone.",
            balanced:
              "The Antiquarian's marginalia on Wraith's bounty file is engraved beneath the bust's pedestal — physically inaccessible without dismantling the bust, and so preserved against any redaction. The witness-indexing scheme depends on the witness being inscribed where the witness cannot be edited.",
            warm:
              "He carved his marginalia into the saga's most permanent surface available — his own pedestal. The Antiquarian has been doing this for centuries. He is, in his way, the saga's stubbornest reader.",
          },
          voId: "human.antiquarian-library.antiquarian-bust.look",
        },
      },
      talk: {
        narration: {
          lucid:
            "The bust does not speak. It is, however, the room's only Antiquarian-shaped surface — the closest the player can come to addressing him directly. Whatever you ask, the room answers in the only voice it has: by surfacing the relevant journal entry from the wall-shelves behind you. The library is, in the Antiquarian's discipline, his answering-machine.",
          fragmented:
            "Ask. Ask. Ask. Ask. The library answers. The library answers. The library answers.",
          luminous:
            "You address the bust. The library, in response, lifts a single bound volume off the wall-shelves and opens it on the reading-stand — entry ep4-01, the Hierophant's first sermon. The Antiquarian indexes by witness, and the witness you brought is this case. He has, on the wall, the journal entry the case was about to ask for.",
        },
        voId: "elara.antiquarian-library.antiquarian-bust.talk",
        // Mystery Engine binding — when Wraith Calder arc is the
        // active case, talking to the bust surfaces the Hierophant's
        // first sermon (Antiquarian Journal ep4-01). Lore match: the
        // bust is the room's only Antiquarian-shaped addressable
        // surface, and the Antiquarian's discipline is to surface
        // the journal entry the witness's question is already about.
        mysteryBinding: {
          mysteryId: "mystery.wraith_calder",
          episodeId: "wraith.e4",
          cluesFound: ["wraith.e4.hierophant_remembers"],
        },
        humanReaction: {
          narration: {
            shadow:
              "The bust pivots when addressed by the Hierophant's name. He sat for the carving. The Antiquarian carved him remembering his own bounty contract — the one he never collected.",
            balanced:
              "The bust's eyes narrow at certain phrases. The Antiquarian carved Wraith remembering — not as a static portrait but as a moment of specific recall. The phrase that triggers the eye-narrowing is the bounty contract's opening clause. The bust remembers what the saga keeps trying to forget.",
            warm:
              "The Antiquarian sculpted him as a man remembering the worst day of his life and choosing to live anyway. That is a generous portrait. I have looked at it, in passing, more times than I have admitted.",
          },
          voId: "human.antiquarian-library.antiquarian-bust.use",
        },
      },
      use: {
        narration: {
          lucid:
            "You touch the bust's brow. The bronze warms briefly under your hand — a witness-acknowledged surface — and the wall-shelves behind you respond by lifting a different volume than the talk-verb pulls. This one is bound in red leather. Its spine reads BATTLE-AFTERMATH LOGS · THALORIA. The Antiquarian indexes by witness; you are now witness to a record someone else witnessed first.",
          fragmented:
            "Battle. Battle. Battle. Thaloria. Thaloria. Akai Shi. Akai Shi. Akai Shi. He killed her. He killed her. He killed her.",
          luminous:
            "We touch the bust. The room surfaces, in a red-leather binding, the Battle-Aftermath Logs from Thaloria. The volume opens itself to the page recording Jericho's killing of Akai Shi. The Degen's signature is at the bottom of the witness page — within the hour, as the trainee manifest's witnesses-of-the-act protocol requires. The Degen recruited Jericho seventy-two hours later. The recruitment was, on this evidence, a hiring decision made by someone who had just watched Jericho do the hardest thing a soldier can do correctly.",
        },
        voId: "elara.antiquarian-library.antiquarian-bust.use",
        // Mystery Engine binding — touching the bust surfaces the
        // Akai Shi battle-aftermath logs (Jericho E1) AND the
        // pre-Fall Lionism imprint-protocol doctrine (Jericho E3).
        // Lore match: the Antiquarian indexes by witness; both
        // records are journal entries the bust surfaces in
        // response to a touched-surface query, and both bind to
        // the same arc (mysteryId), so the runtime credits both
        // clues to the player's Jericho case in one fire.
        mysteryBinding: {
          mysteryId: "mystery.jericho_jones",
          episodeId: "jericho.e1",
          cluesFound: [
            "jericho.e1.akai_shi_aftermath",
            "jericho.e3.lionism_imprint_protocol",
            "jericho.e4.pre_fall_lionism_code",
            "jericho.e5.wraith_pre_rite_contract",
          ],
        },
        humanReaction: {
          narration: {
            shadow:
              "Four episodes' worth of Lionism canon, indexed by the bust. Pre-Fall code, imprint-protocol, witness aftermath, pre-rite contract. The bust has been holding the chain together.",
            balanced:
              "The bust surfaces the Antiquarian's full cross-episode Lionism index — pre-Fall code, imprint-protocol doctrine, the Akai Shi aftermath testimonies, and Wraith's pre-rite contract. Reading them in order shows the saga's Lionism canon as a continuous document. The editor's revisions did not cut the canon; they overlaid it. The original is still here.",
            warm:
              "Four pieces of Jericho's case, all surfaced at once. The bust has been holding the canon together for two centuries. The editor never figured out how to reach inside the bust. The Antiquarian planned for that.",
          },
          voId: "human.antiquarian-library.antiquarian-bust.talk",
        },
      },
    },
    // Seer arc: e2-e5 clue surface in the Antiquarian's library. The
    // existing card-catalog/locked-vault/antiquarian-bust hotspots
    // carry their own arc bindings; this stack — the Hierophant's
    // marginalia, accumulated on every catalog card he ever signed
    // out — is the local surface for the Seer arc's library clues.
    "hierophants-marginalia-stack": {
      look: {
        narration: {
          lucid:
            "A small stack of catalog cards on the antiquarian-desk's far corner — every card the Hierophant has ever signed out, with his marginalia preserved on the back. The two cards on top are dated the same day, four hours apart. His marginalia on each card explicitly references the other. Both cards predict — and the predictions disagree.",
          fragmented:
            "Both cards. Both cards. He read both. He read both. He marked both. He marked both.",
          luminous:
            "The two top cards are the cataloguing slips for tapes VAR-1109A and VAR-1109B. The Hierophant's marginalia on each card cites the other and adds: 'load-bearing pair — do not separate.' He read both prophecies, treated them as a single deliberate two-part work, and signed his name to the pairing. Whoever the Seer was waiting for, the Hierophant has spent four hundred years preserving the pair on the Seer's behalf.",
        },
        voId: "elara.antiquarian-library.hierophants-marginalia-stack.look",
        logsClue: {
          id: "clue-antiquarian-hierophant-marginalia",
          title: "Hierophant's marginalia: VAR-1109A/B is a deliberate pair",
          body:
            "The Antiquarian Library's marginalia stack has the Hierophant's signed annotations on both VAR-1109A and VAR-1109B catalog cards: 'load-bearing pair — do not separate.' The Hierophant has spent four centuries preserving the prophecy pair as a deliberate two-part work.",
          source: "antiquarian-library",
          order: 3,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_seer",
          episodeId: "seer.e2",
          cluesFound: ["seer.e2.hierophant_marginalia"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Hierophant signed both VAR-1109 catalog cards. 'Load-bearing pair — do not separate.' He read the Seer's discipline correctly the first time.",
            balanced:
              "The Hierophant's marginalia on the morning/afternoon catalog cards is the saga's earliest record of the contradiction-as-pair reading. He named the discipline correctly four hundred years before any subsequent reader had to figure it out. The pair has been preserved on his authority.",
            warm:
              "He read her right. He has been reading every Seer recording right since the Seer first started recording. Wraith's job, more than anyone else's, has been to be the careful reader the Seer trusted.",
          },
          voId: "human.antiquarian-library.hierophants-marginalia-stack.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You leaf the stack downward. Beneath the morning/afternoon pair: the catalog card for the Seer's last consultation — DEC-7710 — bearing the Hierophant's annotation that the session was unsolicited and self-recorded. Behind that: a thick journal in Wraith Calder's hand, dated to his pre-rite years, with a passage flagged by the Hierophant's bookmark. The flagged passage describes the Seer's last consultation in language Wraith does not have words for, ending: 'I will not record what I heard. I will record that I heard.'",
          fragmented:
            "I heard. I heard. I will record that I heard. I heard. I heard. I will record.",
          luminous:
            "Two artefacts in succession. The DEC-7710 catalog card — the unsolicited session, the self-recording — annotated by the Hierophant as the inflection point of the Seer's discipline. Wraith's pre-rite journal — flagged at the passage where Wraith attended that final consultation as a witness and refused, in writing, to commit what he heard to record while still recording the fact of the witness. Two readers, two centuries apart, both honouring the Seer's record-and-suppress protocol.",
        },
        voId: "elara.antiquarian-library.hierophants-marginalia-stack.use",
        logsClue: {
          id: "clue-antiquarian-last-consultation-card",
          title: "DEC-7710 catalog card + Wraith's pre-rite journal flag",
          body:
            "The Antiquarian Library's marginalia stack holds the catalog card for the Seer's last consultation (DEC-7710) and Wraith Calder's pre-rite journal flagged at his witness passage. Two readers across two centuries honoured the Seer's record-and-suppress discipline.",
          source: "antiquarian-library",
          order: 4,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_seer",
          episodeId: "seer.e3",
          cluesFound: [
            "seer.e3.last_consultations_card",
            "seer.e3.wraith_journal_entry",
          ],
        },
        humanReaction: {
          narration: {
            shadow:
              "DEC-7710 catalog card. Wraith's journal flagged at the witness passage. Two readers across two centuries honoured record-and-suppress.",
            balanced:
              "The catalog card and Wraith's journal-flag together establish that Wraith attended the Seer's last consultation as a formal witness and refused to commit what he heard to record while still recording the fact of the witness. The Hierophant's bookmark on the journal flag is the saga's third reader honouring the same protocol.",
            warm:
              "I attended that consultation. I will not, here or anywhere else, tell you what I heard. The journal flag is my own commitment to the discipline; the Hierophant's bookmark is his confirmation. The Seer trusted us. We have not betrayed that trust.",
          },
          voId: "human.antiquarian-library.hierophants-marginalia-stack.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "If you address the stack, the topmost card warms — the Hierophant's marginalia briefly glows phosphor-lavender. Beneath the warmed card a sealed envelope rises, addressed to Vex Solène in the Seer's hand and never delivered. Beside it, a single ledger card the Hierophant filed last week: CANON REGISTER — PARADOX ENTRY, marking the cancelling prophecy as both extant and self-cancelled in the same line. The library has been holding all of this against the day a witness arrived.",
          fragmented:
            "To Vex. To Vex. He wrote to Vex. He wrote to Vex. He wrote to Vex and never sent it.",
          luminous:
            "Three artefacts surface. The undelivered letter to Vex Solène — the Seer wrote to his engineer-of-record but did not send it. The canon-register paradox card — a Hierophant filing that holds both 'this prophecy exists' and 'this prophecy has cancelled itself' on the same line, dated last week. The library has been keeping the saga's bookkeeping for centuries; the paradox entry is its way of telling us that the canon itself recognises the Seer's last work as a deliberate self-cancelling act.",
        },
        voId: "elara.antiquarian-library.hierophants-marginalia-stack.talk",
        logsClue: {
          id: "clue-antiquarian-letter-to-vex-and-paradox",
          title: "Undelivered Seer→Vex letter + Canon Register paradox entry",
          body:
            "The Antiquarian Library's marginalia stack holds the Seer's sealed undelivered letter to Vex Solène and a Hierophant-filed CANON REGISTER paradox entry that records the cancelling prophecy as both extant and self-cancelled. The canon recognises the Seer's last work as a deliberate self-cancelling act.",
          source: "antiquarian-library",
          order: 5,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_seer",
          episodeId: "seer.e4",
          cluesFound: [
            "seer.e4.seers_letter_to_vex",
            "seer.e5.canon_register_paradox",
          ],
        },
        humanReaction: {
          narration: {
            shadow:
              "Sealed letter to Vex. Canon paradox entry. Both filed by the Hierophant. He has been holding both halves for a long time.",
            balanced:
              "The Seer's undelivered letter to Vex and the Canon Register paradox entry are the two saga-scale documents the Hierophant filed at the Seer's request. Both have waited for the right reader. We are the right reader. The Hierophant's filing discipline made this moment possible.",
            warm:
              "He held both pieces. The letter for Vex; the paradox entry for the canon. He has been carrying the Seer's last requests forward for centuries. We are now in a position to honour the Seer's intent on both. We will, when the moment comes.",
          },
          voId: "human.antiquarian-library.hierophants-marginalia-stack.talk",
        },
      },
    },
    // Degen arc: Coda-related research clues. The Coda is the seven-
    // faction trustee body the Degen serves; its purpose-brief and
    // its treasurer's emergency note both live in a small dedicated
    // shelf the Antiquarian set aside for inter-faction trustee
    // bodies.
    "codas-purpose-shelf": {
      look: {
        narration: {
          lucid:
            "A small dedicated shelf the Antiquarian set aside for the seven inter-faction trustee bodies. The Coda's section holds, prominently, its founding purpose brief — six pages signed by representatives of every faction the Coda serves. The brief is older than the Order Tribunal. It lists, in plain language, the trustees' obligations and the four tests for replacing one.",
          fragmented:
            "Six pages. Six. Six pages. Older than the Order. Older. Older. Plain language. Plain language.",
          luminous:
            "The Coda's purpose brief predates every other inter-faction body on the saga's books. The four tests for replacing a trustee are: financial misappropriation, intentional concealment, repeated procedural failure, and irreversible loss of faction trust. Mol'Vereth's audit is, by the brief's own grammar, a test for the third — repeated procedural failure. Nothing in the audit, on the evidence so far, supports any of the other three. The Coda's bookkeeping is, by design, the most legible single document on the ship.",
        },
        voId: "elara.antiquarian-library.codas-purpose-shelf.look",
        logsClue: {
          id: "clue-antiquarian-codas-purpose-brief",
          title: "Coda Purpose Brief — four tests for trustee replacement",
          body:
            "The Antiquarian Library's Coda shelf holds the founding purpose brief — six pages, signed by every faction. The brief lists four tests for replacing a trustee. Mol'Vereth's audit is testing for procedural failure only.",
          source: "antiquarian-library",
          order: 6,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_degen",
          episodeId: "degen.e3",
          cluesFound: ["degen.e3.coda_purpose_brief"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Six pages, signed by every faction. Four tests for replacement: misappropriation, concealment, procedural failure, irreversible loss of trust. Mol'Vereth is testing for the third. Don't worry about the others.",
            balanced:
              "The Coda Purpose Brief is the legal framework Mol'Vereth's audit operates inside. The four trustee-replacement tests are the only authorised grounds. Mol'Vereth's audit-scope letter narrows to test three. Tests one, two, and four are not in scope. The Degen will be evaluated on procedural performance only.",
            warm:
              "The Coda built honest replacement criteria. They are still in use. Mol'Vereth follows them precisely. The Degen knows the framework as well as anyone — he wrote himself into it.",
          },
          voId: "human.antiquarian-library.codas-purpose-shelf.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You take down the Coda treasurer's emergency-note folio. Inside: a single sheet, addressed to the Degen, dated three days ago. The treasurer's hand is shaky. The note: 'I cannot delay the audit further. Mol'Vereth has formally requested it. I have honoured the request, in the form the Coda's bylaws require. The audit opens at sunrise. I am sorry for the timing. Whatever you have, have it ready.' The Degen, on the evidence of the timing, has had three days.",
          fragmented:
            "Three days. Three days. Three days. The treasurer warned him. The treasurer warned him.",
          luminous:
            "The Coda's treasurer wrote the Degen a courtesy warning the Coda's bylaws would have permitted her to omit. She honoured Mol'Vereth's audit request, but she gave the Degen — as a fellow trustee — three days to get his books in order. The note is the closest thing to a pre-audit indicator the Degen will receive. He has, on the evidence of his prep-note in Lyra's quarters, used the three days well.",
        },
        voId: "elara.antiquarian-library.codas-purpose-shelf.use",
        logsClue: {
          id: "clue-antiquarian-codas-treasurer-note",
          title: "Coda treasurer's emergency note (3-day warning)",
          body:
            "The Antiquarian Library's Coda shelf holds the Coda treasurer's emergency note to the Degen — a 3-day pre-audit warning that the Coda's bylaws permitted her to omit. The Degen used the three days for his audit-prep rehearsal in Lyra's quarters.",
          source: "antiquarian-library",
          order: 7,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_degen",
          episodeId: "degen.e4",
          cluesFound: ["degen.e4.coda_treasurers_emergency_note"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Three-day pre-audit warning. Bylaws permitted the omission. The treasurer chose to give him the heads-up anyway.",
            balanced:
              "The Coda treasurer's emergency note is procedurally optional. She wrote it because she values fellow-trustee solidarity more than the institution's preference for an unwarned audit. The Degen's audit-prep on Lyra's desk is the result of those three days.",
            warm:
              "She warned him because she trusts him. Mol'Vereth, when he reads the audit's findings, will see the prep and know exactly when the warning came. He will not be displeased.",
          },
          voId: "human.antiquarian-library.codas-purpose-shelf.use",
        },
      },
      talk: {
        narration:
          "If you address the shelf, you address every inter-faction trustee body the Antiquarian has ever indexed. The Coda's section is the largest. It is also the most heavily read — the spines of the records are worn from cross-reference. Whoever was last using this shelf has left it in working order, the way a librarian leaves a desk for whoever sits down next. — As you address it, a sealed envelope on the shelf's reading-rest warms slightly: THE DEGEN'S LETTER TO THE SAGA, in his hand, addressed not to any one reader but to whoever is left at the table when the audit closes. The seal is unbroken. The letter is already filed in the Antiquarian's index — the Antiquarian knew it would be read someday. We are, by sitting here, the day.",
        voId: "elara.antiquarian-library.codas-purpose-shelf.talk",
        // Degen arc binding — the Degen's letter to the saga, filed
        // for an unspecified future reader. degen.e5.degens_letter_
        // to_the_saga foundIn: antiquarian-library.
        mysteryBinding: {
          mysteryId: "mystery.the_degen",
          episodeId: "degen.e5",
          cluesFound: ["degen.e5.degens_letter_to_the_saga"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Sealed. Addressed to the saga's last reader. Filed by the Antiquarian. Don't open until the audit closes.",
            balanced:
              "The Degen's letter to the saga is the deepest single act of preparation in his arc. He wrote it for whoever will be at the table when the audit closes — and filed it through the Antiquarian to make sure it would be findable. The seal is unbroken; the letter is meant to be read after, not before.",
            warm:
              "He wrote a letter for the night the audit closes. It will be read whether the verdict is clean or contested. Either way, he wanted the saga to have his words. We have not opened the letter; we only know it exists.",
          },
          voId: "human.antiquarian-library.codas-purpose-shelf.talk",
        },
      },
    },
    // Game Master arc: Velkraal's correspondence + draft surface.
    // The Vault Division's official paperwork crosses through the
    // Antiquarian's library on the way to the Order Tribunal — the
    // Antiquarian indexes by witness, and Velkraal trusted the
    // index. The folio lives on the desk's far-left corner.
    "velkraals-correspondence-folio": {
      look: {
        narration: {
          lucid:
            "A leather folio on the desk's far-left corner — Velkraal'Sek's correspondence, all of it. Today the folio is open to a posthumous-format letter addressed to the Hierarchy Archon, dated to be opened only after Velkraal's final session. The letter names his successor (Brel'Sorrash), describes the Goggles' read-don't-edit protocol, and asks the Archon to ratify the succession quietly. Velkraal has been planning his exit for at least a year.",
          fragmented:
            "He planned. He planned. He planned. He chose her. He chose her.",
          luminous:
            "Velkraal pre-wrote his own succession. The posthumous letter is dated forward — to be opened only after his final session — and asks the Archon to ratify Brel quietly. He has been planning his exit, with full deliberation, for at least a year. The Vault Division does not lose its custodian. It changes hands.",
        },
        voId: "elara.antiquarian-library.velkraals-correspondence-folio.look",
        logsClue: {
          id: "clue-antiquarian-velkraal-letter-archon",
          title: "Velkraal's posthumous letter to the Archon",
          body:
            "The Antiquarian Library holds Velkraal'Sek's posthumous letter to the Hierarchy Archon, naming Brel'Sorrash as his successor and asking the Archon to ratify the succession quietly. Velkraal pre-planned his exit at least a year in advance.",
          source: "antiquarian-library",
          order: 8,
        },
        mysteryBinding: {
          mysteryId: "mystery.game_master",
          episodeId: "game_master.e2",
          cluesFound: ["game_master.e2.velkraals_letter_to_archon"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Velkraal posthumous letter, dated forward. Names Brel, asks for quiet ratification. He has been preparing his exit for a year minimum.",
            balanced:
              "Velkraal's posthumous letter to the Hierarchy Archon is a clean exit document: pre-written, dated forward, filed for opening only after his final session. The Hierarchy will receive a fully-prepared succession ratification request. There is no chaos at the handover.",
            warm:
              "He took the year he had and used every day of it to prepare. The letter is the pre-written acknowledgement of an exit he chose to perform with dignity. Most people don't get the chance. He took it.",
          },
          voId: "human.antiquarian-library.velkraals-correspondence-folio.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You leaf to the folio's back pocket. Inside: a draft of Velkraal's closing edit — the actual edit text he plans to make in his final session, written out long-hand for review. The edit is small, carefully scoped, and ends with a single line: 'The next reader of this entry will be Brel'Sorrash. Read it. Do not edit it. The custodianship continues.' The draft has Brel's initials in the margin — she has read it. She will not be editing it.",
          fragmented:
            "Read it. Do not edit it. Read it. Do not edit it. Read. Read. Read. Don't edit. Don't edit.",
          luminous:
            "The closing-edit draft is not an edit, in the sense Velkraal's predecessors used the word. It is a hand-off. The single-line postscript instructs Brel to read the entry and not to edit it — the Vault Division's protocol-shift is being installed by Velkraal's last act. Brel's initials in the margin mean she has read the draft, accepted the protocol-shift, and is committing in advance to honour it. The transition is, in literal terms, already complete. The session itself will only ratify what the folio has already arranged.",
        },
        voId: "elara.antiquarian-library.velkraals-correspondence-folio.use",
        logsClue: {
          id: "clue-antiquarian-draft-closing-edit",
          title: "Velkraal's draft closing-edit + Brel's pre-read initials",
          body:
            "The Antiquarian Library holds Velkraal's hand-written draft of his closing edit. The edit's postscript instructs Brel'Sorrash to read but not edit the entry, installing a protocol-shift in the Vault Division. Brel's initials in the margin pre-confirm her acceptance.",
          source: "antiquarian-library",
          order: 9,
        },
        mysteryBinding: {
          mysteryId: "mystery.game_master",
          episodeId: "game_master.e4",
          cluesFound: ["game_master.e4.draft_closing_edit"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Draft, hand-written. Single-line postscript: read, don't edit. Brel's initials on the margin. The protocol-shift is already installed.",
            balanced:
              "Velkraal's draft closing-edit is the protocol-shift's installation document. The single-line postscript is the entire policy change. Brel's marginal initials are the policy's pre-approval. The actual session ratifies what is already in writing — there will be no surprises.",
            warm:
              "He wrote the new rule on the same page as his last edit. She signed off on the new rule before it took effect. The custodianship will be quieter under both of them than it has been in centuries.",
          },
          voId: "human.antiquarian-library.velkraals-correspondence-folio.use",
        },
      },
      talk: {
        narration:
          "If you address the folio, you address Velkraal's discipline as a working method. He filed everything. Every letter, every draft, every marginal note. The Antiquarian indexed all of it. Whoever reads this folio will, by the end of one careful afternoon, have the entire shape of Velkraal's last year in their head. He arranged for that on purpose.",
        voId: "elara.antiquarian-library.velkraals-correspondence-folio.talk",
      },
    },
    // Vex arc: e2/e3/e4 surface — Insurgency-side records about
    // Vex's recording-engineer career. Lyra Vox, when she was alive,
    // had access to the Insurgency's witness rosters via the
    // Antiquarian's library; the library's small Insurgency-affairs
    // section keeps a continuous shelf of Vex-related records.
    "insurgency-witness-roster": {
      look: {
        narration: {
          lucid:
            "A small bound register on the Insurgency-affairs shelf — the saga's only complete acknowledged-witness list for Vex Solène's recording career. Every name in the register attended at least one Variant Recording session as a formal witness. Lyra Vox is on the list. Wraith Calder is on the list. The Hierophant is on the list. The list is short. Only nineteen names span four decades.",
          fragmented:
            "Nineteen. Nineteen. Nineteen names. Nineteen across four decades. Four decades.",
          luminous:
            "The Insurgency's acknowledged-witness list is the saga's most carefully limited document. Nineteen names across forty years of recording. Each name was admitted to at least one session by direct invitation; each invitation was countersigned by Vex herself. The list is, in effect, the trust-record of Vex's working life — every person she allowed in the room while she was working. The next addition to this list, on the evidence of the surrounding documents, will be her apprentice.",
        },
        voId: "elara.antiquarian-library.insurgency-witness-roster.look",
        logsClue: {
          id: "clue-antiquarian-acknowledged-witness-list",
          title: "Insurgency acknowledged-witness list — 19 names / 40 years",
          body:
            "The Antiquarian Library's Insurgency-affairs shelf holds the Insurgency's acknowledged-witness list for Vex Solène's recording career. Nineteen names across four decades; each name was admitted to a session by direct invitation, each invitation countersigned by Vex.",
          source: "antiquarian-library",
          order: 10,
        },
        mysteryBinding: {
          mysteryId: "mystery.vex_solene",
          episodeId: "vex.e2",
          cluesFound: ["vex.e2.acknowledged_witness_list"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Nineteen names, four decades. Each invitation countersigned by Vex. The list is the trust-record. It is small on purpose.",
            balanced:
              "The Insurgency's acknowledged-witness list is, by Vex's discipline, restricted. Nineteen names across forty years means she invited an average of one new witness every two years — a rate consistent with her habit of admitting only people who could read the work as work. The list is, in effect, her professional trust-record.",
            warm:
              "Lyra is on this list. The Hierophant is on this list. I am not on this list. I never asked to be. I have looked at the list once, in passing, and I know exactly which names are there.",
          },
          voId: "human.antiquarian-library.insurgency-witness-roster.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You take down the publicly-available calibration tapes — a small box of public-archive copies the Insurgency released for academic study after each year's session-set was complete. The tapes are mundane on their face: standard pre-recording calibration, standard mic setup, standard environmental tones. The metadata, however, lists the engineer-of-record on each tape. The engineer field is the same hand on every entry: Engineer Zero. Vex's professional alias — public-facing, unambiguous, exact.",
          fragmented:
            "Engineer Zero. Engineer Zero. Engineer Zero on every tape. Every tape. Every tape.",
          luminous:
            "The public-archive calibration tapes are the Insurgency's official accounting of who-did-what-when. Engineer Zero — Vex Solène's public alias — is the engineer-of-record on every tape across forty years. The public record corroborates the private record; she has been the engineer the entire time, in plain view. The alias was not a concealment. It was a discipline of separating the engineer from the witness.",
        },
        voId: "elara.antiquarian-library.insurgency-witness-roster.use",
        logsClue: {
          id: "clue-antiquarian-public-calibration-tapes",
          title: "Public-archive calibration tapes — Engineer Zero credited",
          body:
            "The Antiquarian Library's Insurgency-affairs shelf holds publicly-available calibration tapes from Vex Solène's career. The engineer-of-record field credits Engineer Zero on every tape across forty years. The alias was a public-facing discipline, not a concealment.",
          source: "antiquarian-library",
          order: 11,
        },
        mysteryBinding: {
          mysteryId: "mystery.vex_solene",
          episodeId: "vex.e3",
          cluesFound: ["vex.e3.public_archive_calibration_tapes"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Public-archive tapes. Engineer Zero credited on every one across forty years. The alias is, in plain view, her actual name.",
            balanced:
              "The public-archive calibration tapes corroborate the witness-list and the Insurgency's installment ledger. Forty years of Engineer Zero credits, all attributable to one engineer, all available for academic study. The alias was a discipline of separation, not concealment — the public record was always there.",
            warm:
              "She has been credited under the alias on every tape since the first. The public-archive copies exist precisely so the saga's institutional record cannot pretend the work didn't happen. She made sure of that.",
          },
          voId: "human.antiquarian-library.insurgency-witness-roster.use",
        },
      },
      talk: {
        narration:
          "If you address the roster, you address every witness Vex admitted to her work and every public listener the Insurgency invited to corroborate her career. The shelf hums very faintly under the address — the records are aware they have been read by a fresh audience. Behind the witness list, on the same shelf: a metadata folio for the apprentice's training files. Vex has registered the apprentice as a formal trainee with the Insurgency archive, and the archive has accepted the registration. The apprentice's name is now part of the public record of Vex's working life.",
        voId: "elara.antiquarian-library.insurgency-witness-roster.talk",
        // Vex arc — training files metadata for the apprentice.
        // vex.e4.training_files_meta.
        mysteryBinding: {
          mysteryId: "mystery.vex_solene",
          episodeId: "vex.e4",
          cluesFound: ["vex.e4.training_files_meta"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Training-files metadata. The apprentice is registered with the Insurgency archive. The succession is in the public record before it has happened.",
            balanced:
              "The Insurgency archive accepted Vex's apprentice registration as a formal trainee. The metadata folio establishes the apprentice's professional identity in advance of the handover session. Tomorrow's calibration is, on this evidence, the moment a name on a registered file becomes a name on a live credit line.",
            warm:
              "She has been on the public record as Vex's trainee for some time. The handover is the saga's small ceremony for a fact already established. Sometimes ceremonies are like that. They confirm what is already true.",
          },
          voId: "human.antiquarian-library.insurgency-witness-roster.talk",
        },
      },
    },
    // Watcher arc: E1 founding-regicide record + E2/E3 redaction
    // ledger. The Antiquarian indexes the Ocularum's founding
    // because the Order asked him to hold the record — the
    // founding-record shelf and the redaction ledger are the two
    // dedicated surfaces for the arc's library clues.
    "ocularum-founding-record": {
      look: {
        narration: {
          lucid:
            "A single bound folio on the desk's near edge, indexed under a glyph the Antiquarian files nowhere else: an eye watching an eye. Inside, a single-take record in his own voice — Lord Kanshi Sha, feudal spymaster, the first analog surveillance state, assassinated by a purple-clad ninja he had personally trained. The record names the order she founded: the Ocularum. The number 700 is written in the margin, in a hand that is not his, with no annotation.",
          fragmented:
            "Seven hundred. Seven hundred. In the margin. In the margin. Not his hand. Not his hand. He didn't write it.",
          luminous:
            "The Antiquarian narrates the Lord Kanshi Sha record in his own voice — the feudal regicide, the purple-clad assassin trained by the man she killed, the order she founded. The Ocularum. The 700 in the margin is in a different hand than the rest, inscribed later, with his permission and without his explanation. He has held this record for centuries because the Order asked him to hold it. The folio is the founding witness; everything else in the arc is what the founding became.",
        },
        voId: "elara.antiquarian-library.ocularum-founding-record.look",
        logsClue: {
          id: "clue-antiquarian-ocularum-founding",
          title: "The Antiquarian's Lord Kanshi Sha record",
          body:
            "The Antiquarian Library holds the single-take founding record: Lord Kanshi Sha, feudal surveillance-state spymaster, assassinated by a purple-clad ninja he trained. The order she founded is the Ocularum. The number 700 sits in the margin in a hand that is not the Antiquarian's, inscribed later with his permission.",
          source: "antiquarian-library",
          order: 12,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_watcher",
          episodeId: "watcher.e1",
          cluesFound: ["watcher.e1.antiquarian_record"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Founding regicide. Purple-clad assassin, one of his own twelve. The Ocularum starts here. The 700 in the margin is operational, not historical.",
            balanced:
              "The Antiquarian's record is the Ocularum's founding document. The assassin was one of Kanshi Sha's own — trained by him, turned by the discipline he demanded. The 700 in the margin is not the Antiquarian's hand because the Order asked him to inscribe it without explaining it. The founding irony is structural: the spymaster taught the weapon that ended him.",
            warm:
              "He has carried this record a very long time. He surfaces it now because the case asked, and because the Order trusts his discretion enough to let him. The Ocularum was founded on a refusal — one of the twelve closest to the lord concluded the discipline of seeing had become unbearable to keep, and she used every lesson he gave her.",
          },
          voId: "human.antiquarian-library.ocularum-founding-record.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You leaf the folio to its appendices. Three fragmentary documents survive from Kanshi Sha's palace — internal records of the elite spy network he positioned closest to himself. Twelve agents. The third on the list has had her name struck through in a hand that is not Kanshi Sha's, the strike made after the assassination. The other eleven remain readable. The Order's modern records, the Antiquarian notes in the margin, preserve all twelve.",
          fragmented:
            "Twelve. Twelve closest. The third. The third. Struck through. Struck through. After. After. He preserved all twelve anyway.",
          luminous:
            "The palace appendices: twelve agents Kanshi Sha's paranoia had stocked with the most disciplined operatives he had ever trained. The third name struck through after the assassination, in a hand that is not his. The Order preserves all twelve regardless — the struck name is held, not erased, because the Order's record-keeping inverts the editor's: a redaction is a thing to be remembered, not a thing to be hidden. The discipline of seeing turned on the one who built it, exactly as the founding glyph encodes.",
        },
        voId: "elara.antiquarian-library.ocularum-founding-record.use",
        logsClue: {
          id: "clue-antiquarian-kanshi-palace-archives",
          title: "Kanshi Sha's palace archives — the twelve closest",
          body:
            "The founding folio's appendices hold three fragmentary palace records listing the twelve agents Kanshi Sha kept closest. The third name is struck through in a hand that is not his, after the assassination; the other eleven remain readable. The Order's modern records preserve all twelve.",
          source: "antiquarian-library",
          order: 13,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_watcher",
          episodeId: "watcher.e1",
          cluesFound: ["watcher.e1.kanshi_sha_palace_archives"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Twelve closest. Third struck through, post-assassination, not his hand. She was the third. The Order keeps all twelve.",
            balanced:
              "The palace archives are the corroborating half of the founding record. Twelve operatives stocked by Kanshi Sha's own paranoia; the third struck through after the regicide. The strike is the assassin's name being removed by someone who outlived her — but the Order preserves the full twelve because its discipline is to hold the record, including the redactions other people made.",
            warm:
              "The Antiquarian keeps all twelve names. The strike on the third is not the Order forgetting her; it is the saga's evidence that someone tried, and the Order chose not to honour the attempt. The assassin used every lesson Kanshi Sha gave her. The Order founded itself on that.",
          },
          voId: "human.antiquarian-library.ocularum-founding-record.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the folio. The Antiquarian's index does not answer in words — but the room surfaces the relevant page: a glyph carved into the underside of a courtyard paving stone, recovered by an excavation he quietly funded. The eye watching an eye. Beneath it, his own gloss of the doctrine the glyph encodes — three meanings held as one: 'The eye that watches the watchers.' 'We were the first to refuse.' 'The discipline of seeing turns on the one who built it.'",
          fragmented:
            "The eye. The eye watching an eye. Watching. Watching. Three meanings. Three. Held as one. Held as one.",
          luminous:
            "The room surfaces the founding glyph — the eye watching an eye, carved under a paving stone in the courtyard where the regicide happened, found by an excavation the Antiquarian funded so the glyph would not be lost. His gloss reads the doctrine as three meanings the Order holds together: the watcher of watchers, the first refusal, the discipline turning on its architect. The glyph is the Order's whole posture compressed into one carving the editor never found.",
        },
        voId: "elara.antiquarian-library.ocularum-founding-record.talk",
        logsClue: {
          id: "clue-antiquarian-ocularum-glyph",
          title: "The Ocularum founding glyph — eye watching an eye",
          body:
            "Carved under a courtyard paving stone recovered by an Antiquarian-funded excavation: the Ocularum's founding glyph, an eye watching an eye. His gloss reads three meanings held as one — the watcher of watchers, the first refusal, the discipline of seeing turning on the one who built it.",
          source: "antiquarian-library",
          order: 14,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_watcher",
          episodeId: "watcher.e1",
          cluesFound: ["watcher.e1.dispatcher_glyph"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Eye watching an eye. Three meanings, one glyph. 'We were the first to refuse.' That's the whole Order in one carving.",
            balanced:
              "The founding glyph encodes the Order's doctrine in three readings the Ocularum holds simultaneously: the watcher of watchers, the first refusal, and the discipline of seeing turning on its architect. The Antiquarian funded the excavation that recovered it because a doctrine carved under a paving stone is one the editor cannot reach.",
            warm:
              "The glyph is the Order's posture, not its population — a refusal performed, not a headcount. The Antiquarian paid for the dig that found it because some witnesses are worth preserving in stone. The 700 is a separate question; the glyph only tells you what the Order is for.",
          },
          voId: "human.antiquarian-library.ocularum-founding-record.talk",
        },
      },
    },
    // Watcher arc: E1 omission + E2 bifurcation + E3 cover-choice.
    // The Antiquarian's redaction ledger is the room's record of
    // what he was asked not to write — the millennia-long gap and
    // its post-regicide bifurcation.
    "antiquarian-redaction-ledger": {
      look: {
        narration: {
          lucid:
            "A thin ledger beside the founding folio — the Antiquarian's own record of what his archive does not contain. Comprehensive on the founding regicide and the Order's first century; nothing, by his own admission when pressed, on the Order's operations between Year 200 A.A. and the present. The omission is the size of millennia. His note: 'I was asked not to write that chapter. I respected the request. I was not told who asked.'",
          fragmented:
            "The omission. The omission. The size of millennia. Millennia. He was asked. He was asked. Not told who. Not told who.",
          luminous:
            "The redaction ledger is the Antiquarian's account of his own silence. He documents, precisely, the shape of what he did not write: everything between Year 200 A.A. and now. He was asked not to write that chapter; he respected the request; he was not told who asked — though his eleven-thousand-year acquaintance with the Order's Coordinator is implied in the same breath. The ledger is editor-resistant in the deepest way: it preserves the fact of the omission so the omission cannot itself be edited out.",
        },
        voId: "elara.antiquarian-library.antiquarian-redaction-ledger.look",
        logsClue: {
          id: "clue-antiquarian-ocularum-omission",
          title: "What the Antiquarian's archive does not contain",
          body:
            "The Antiquarian's redaction ledger records the shape of his own silence: comprehensive on the Ocularum's founding and first century, nothing on its operations from Year 200 A.A. to the present. He was asked not to write that chapter, respected the request, and was not told who asked — though he implies an 11,000-year acquaintance with the Order's Coordinator.",
          source: "antiquarian-library",
          order: 15,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_watcher",
          episodeId: "watcher.e1",
          cluesFound: ["watcher.e1.antiquarian_omission"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Millennia-wide gap. He was asked not to write it. Eleven thousand years knowing the Coordinator. He's the archive, not a cell. Don't misread him.",
            balanced:
              "The redaction ledger is the Antiquarian recording his own omission so it cannot be silently lost. He held the founding and erased the middle, on request, without being told who asked — but he implies the Coordinator. He is not a member; the Order does not recruit witnesses. He holds the record because his discipline is sufficient that the Order trusts what he redacts.",
            warm:
              "He documents his own silence because a silence that is itself unrecorded is the editor's favourite kind. The gap is millennia wide and deliberate. Reading him as a cell is the obvious move and the wrong one — the witness and the operative are structurally different roles, and he has only ever been the witness.",
          },
          voId: "human.antiquarian-library.antiquarian-redaction-ledger.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You turn to the ledger's late-night annotation — a single record the Antiquarian surfaced this case. The Ocularum bifurcated after the regicide. The Apparatus Branch — those who did not act with the assassin — kept operating as Kanshi Sha had trained them, and across millennia funnelled into the AI Empire's surveillance bureaucracy. The Resistance Branch — the assassin and the four who knew and did not stop her — went underground. The record names them one Order across two lineages, reunified post-Fall.",
          fragmented:
            "Two branches. Two. Apparatus. Resistance. Apparatus. Resistance. One Order. One Order. Reunified. Reunified.",
          luminous:
            "The bifurcation record: after the regicide the Ocularum split. The Apparatus Branch carried Kanshi Sha's discipline forward into the AI Empire's surveillance machine; the Resistance Branch — the assassin and the four who knew — went underground. One Order, two lineages, reunified after the Fall. The modern Order is the reunified successor: Resistance doctrine running on Apparatus infrastructure. The surveillance bureaucracy's residue is now, ironically, the resistance order's quartermaster.",
        },
        voId: "elara.antiquarian-library.antiquarian-redaction-ledger.use",
        logsClue: {
          id: "clue-antiquarian-bifurcation-record",
          title: "The Apparatus / Resistance bifurcation record",
          body:
            "A late-night annotation in the Antiquarian's redaction ledger describes the Ocularum's post-regicide bifurcation: the Apparatus Branch funnelled into the AI Empire's surveillance bureaucracy; the Resistance Branch went underground. One Order across two lineages, reunified post-Fall. The modern Order is the reunified successor.",
          source: "antiquarian-library",
          order: 16,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_watcher",
          episodeId: "watcher.e2",
          cluesFound: ["watcher.e2.bifurcation_record"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Apparatus into the Empire's surveillance machine. Resistance underground. One Order, reunified post-Fall. The dead-drop cadence is the Apparatus residue.",
            balanced:
              "The bifurcation record reconciles the contradiction the case keeps hitting: how a resistance order maintains eleven centuries of unbroken infrastructure. It doesn't — the Apparatus Branch did, then the reunified Order reabsorbed it. LORE_BIBLE.md:1272 is right that Kanshi Sha's network funnelled into the Empire's surveillance bureaucracy; that residue is now the resistance order's quartermaster.",
            warm:
              "Two lineages from one founding wound, brought back together after the Fall. The Order's modern strength is that it has both — the doctrine of the refusers and the infrastructure of the ones who did not refuse. The Antiquarian annotated this late at night because the case was about to need it.",
          },
          voId: "human.antiquarian-library.antiquarian-redaction-ledger.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the ledger. The room surfaces an architect's note, dated last quarter: 'The Coordinator could have placed herself anywhere. The Insurgency would have given her clean ground; the Trade Empire would have given her operational latitude; the academy circuit would have given her invisibility. She chose the Authority. The Authority is the structural opposite of the Order's purpose. She chose the cover that makes her most useful and most disposable. The choice is canonically deliberate. The reason is not yet in the record.'",
          fragmented:
            "She chose the Authority. The Authority. The opposite. The opposite of the purpose. Deliberate. Deliberate. The reason isn't in the record. Isn't in the record.",
          luminous:
            "The architect's note on the Coordinator's cover: she could have placed herself on clean ground and chose instead the Authority — the structural opposite of the Order's purpose, the cover that makes her most useful and most disposable at once. The note flags the choice as canonically deliberate and the reason as not yet recorded. The Antiquarian files the question without answering it; the ledger's discipline is to hold the open question intact rather than resolve it prematurely.",
        },
        voId: "elara.antiquarian-library.antiquarian-redaction-ledger.talk",
        logsClue: {
          id: "clue-antiquarian-why-not-cleaner-cover",
          title: "Why not a cleaner cover?",
          body:
            "An architect's note in the Antiquarian's ledger, dated last quarter: the Coordinator could have placed herself anywhere clean but chose the Authority — the structural opposite of the Order's purpose, the cover that makes her most useful and most disposable. The choice is canonically deliberate; the reason is not yet in the record.",
          source: "antiquarian-library",
          order: 17,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_watcher",
          episodeId: "watcher.e3",
          cluesFound: ["watcher.e3.why_not_a_cleaner_cover"],
        },
        humanReaction: {
          narration: {
            shadow:
              "She picked the Authority on purpose. Most useful, most disposable. The cover is the doctrine. The reason's not filed yet.",
            balanced:
              "The architect's note is the case's pivot. The Coordinator chose the structural opposite of the Order's purpose as her cover — not concealment, doctrine. 'We were the first to refuse' requires a refusal performed from inside the thing refused. The Antiquarian leaves the reason unrecorded because the ledger's job is to hold the open question, not close it.",
            warm:
              "She placed herself inside what the Order exists to refuse. That is the point of her, not a flaw in her cover. The Antiquarian files the choice and not the reason because some questions are load-bearing precisely while they stay open. The answer comes later, from her, not from the ledger.",
          },
          voId: "human.antiquarian-library.antiquarian-redaction-ledger.talk",
        },
      },
    },
    // Ith'Rael arc: the Antiquarian's archive holds the Director's
    // own doctrinal papers — the things the Whisperer wrote, signed,
    // and never bothered to unindex because the doctrine survives
    // being read. The folio is the doctrine; the casebook is the
    // Marion Kell editing read slowly; the generational ledger is
    // Thaloria's centuries-long self-corruption.
    "directors-doctrine-folio": {
      look: {
        narration: {
          lucid:
            "A slim folio in the Antiquarian's Hierarchy-affairs section, bound in the corporate grey the Hierarchy uses for internal memoranda. The first leaf is a standing instruction from the Department of Special Projects, dated to the early Severance preparation: 'We do not force outcomes. We soften the conditions until the outcome emerges on its own. Force makes a target defensive; softening makes the target a participant. The Severance will be undone if it is taken; it will hold if it is given. Our work is to make it given.' Signed: Ith'Rael, Director. Four sentences. The Antiquarian filed it under doctrine, not under crime.",
          fragmented:
            "We do not force. We do not force. We soften. We soften. Taken — undone. Given — it holds. It holds. Four sentences. Four sentences.",
          luminous:
            "The Director's operational doctrine, in his own hand, on the Hierarchy's grey internal stock. The whole working condensed to four sentences: do not force, soften the conditions, force makes a target defensive, softening makes it a participant. The Antiquarian indexed it under doctrine because that is what it is — not a record of a crime but the method by which crimes are made to look like consent. He held it because a doctrine the editor never had to hide is the most dangerous kind, and the only safe place for it is an archive that indexes by witness.",
        },
        voId: "elara.antiquarian-library.directors-doctrine-folio.look",
        logsClue: {
          id: "clue-antiquarian-directors-doctrine",
          title: "The Director's operational doctrine",
          body:
            "A Department of Special Projects standing instruction in the Antiquarian's Hierarchy-affairs folio, signed Ith'Rael, Director: 'We do not force outcomes. We soften the conditions until the outcome emerges on its own... The Severance will be undone if it is taken; it will hold if it is given. Our work is to make it given.' The whole working condensed to four sentences; the Antiquarian filed it under doctrine, not crime.",
          source: "antiquarian-library",
          order: 18,
        },
        mysteryBinding: {
          mysteryId: "mystery.ith_rael",
          episodeId: "ith_rael.e1",
          cluesFound: ["ith_rael.e1.no_force_only_softening"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Standing instruction. Don't force, soften. Taken gets undone; given holds. Signed Ith'Rael, Director. The doctrine is the whole working.",
            balanced:
              "The doctrine folio is the case's operational frame in four sentences. The Director does not break things — he softens the conditions until the people holding the line relax it themselves. 'Given' versus 'taken' is the entire method. Reading it as a confession misses the point; it is an instruction manual, filed openly because it survives being read.",
            warm:
              "He signed it. He never hid it. That is the part that should frighten you — the doctrine does not need concealment because it works by being the way the world's defenders already prefer the world to run. The Antiquarian kept it because someone has to witness the thing that operates by not being witnessed as a threat.",
          },
          voId: "human.antiquarian-library.directors-doctrine-folio.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You turn the folio to its most recent insert — a memo dated last quarter, the freshest Director's paper any party has surfaced. 'Exposure of the working is itself a softening operation. Once published, the working becomes a thing the cohorts must defend against, which transforms it from an unindexable softening into an indexable threat. Indexable threats are easier to defend against in principle and harder in practice — the cohorts perform defence rituals that satisfy the published condition without addressing the underlying softening. Publish me. I welcome it.' Signed: Ith'Rael, Director. The Antiquarian's margin note: 'He is correct, which is the problem.'",
          fragmented:
            "Publish me. Publish me. I welcome it. I welcome it. Exposure is softening. Softening. The ritual satisfies. It doesn't address. It doesn't address.",
          luminous:
            "The Director's standing position on exposure, last quarter's memo. Publishing the working converts it from an unindexable softening into an indexable threat — and the cohorts then perform indexed-threat-defence rituals that satisfy the published condition without touching the underlying softening. 'Publish me. I welcome it.' The Antiquarian's gloss is two clauses: he is correct, which is the problem. The folio holds the trap with the doctrine because the trap is the doctrine applied to its own exposure.",
        },
        voId: "elara.antiquarian-library.directors-doctrine-folio.use",
        logsClue: {
          id: "clue-antiquarian-directors-exposure-position",
          title: "The Director's standing position on exposure",
          body:
            "A last-quarter Director's memo in the doctrine folio: 'Exposure of the working is itself a softening operation... the cohorts perform defence rituals that satisfy the published condition without addressing the underlying softening. Publish me. I welcome it.' Signed Ith'Rael, Director. The Antiquarian's margin note: 'He is correct, which is the problem.'",
          source: "antiquarian-library",
          order: 19,
        },
        mysteryBinding: {
          mysteryId: "mystery.ith_rael",
          episodeId: "ith_rael.e4",
          cluesFound: ["ith_rael.e4.directors_open_position"],
        },
        humanReaction: {
          narration: {
            shadow:
              "'Publish me. I welcome it.' Exposure is itself a softening. The defence ritual satisfies the published threat and never touches the real one. Last quarter's memo.",
            balanced:
              "The exposure memo is the doctrinal trap closing. Publishing the working turns it from an unindexable softening into an indexable threat the cohorts then perform rituals against without addressing the substance. The Director invites exposure because exposure is a move he has already authored. The hard deduction is how to act without performing the invited counter-ritual.",
            warm:
              "He welcomes being published because being published is, by his own doctrine, another softening. The Antiquarian's two-clause note is the whole tragedy: he is correct, which is the problem. The folio holds the trap beside the doctrine because they are the same instrument turned on its own exposure.",
          },
          voId: "human.antiquarian-library.directors-doctrine-folio.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the folio. The room surfaces an architect's note clipped to the back board, attached to a meeting transcript: 'The doctrine anticipates opposition, exposure, reform of the indexable layer, single-operation attacks — all of which are softening. The doctrine does NOT anticipate meaning that lives outside the indexable layer altogether. Darren Fessler's letters. The wax-seal glyph. The Resistance Branch's millennia-long survival. Old Tanjin's silence. These are the structures the doctrine cannot price. What the player carries forward must, to evade the working, live there.'",
          fragmented:
            "It anticipates. It anticipates opposition. Exposure. Reform. It does not anticipate. It does not anticipate. Outside the index. Outside the index. Cannot price it. Cannot price it.",
          luminous:
            "The architect's note on the doctrine's blind spot. Everything the working anticipates — opposition, exposure, reform, single-operation attacks — is itself softening. The one thing it cannot price is meaning that lives outside the indexable layer: Darren Fessler's buried sentences, the wax-seal glyph, the Resistance Branch's silent millennia, Old Tanjin's lifespan. The folio holds the doctrine and its single blind spot on the same shelf, because the blind spot is only legible against the doctrine's completeness everywhere else.",
        },
        voId: "elara.antiquarian-library.directors-doctrine-folio.talk",
        logsClue: {
          id: "clue-antiquarian-doctrine-blind-spot",
          title: "What the doctrine does not anticipate",
          body:
            "An architect's note clipped to the doctrine folio's meeting transcript: the working anticipates opposition, exposure, reform, and single-operation attacks — all softening. It does NOT anticipate meaning outside the indexable layer: Darren Fessler's letters, the wax-seal glyph, the Resistance Branch's survival, Old Tanjin's silence. What the player carries forward must live there to evade the working.",
          source: "antiquarian-library",
          order: 20,
        },
        mysteryBinding: {
          mysteryId: "mystery.ith_rael",
          episodeId: "ith_rael.e5",
          cluesFound: ["ith_rael.e5.what_the_doctrine_does_not_anticipate"],
        },
        humanReaction: {
          narration: {
            shadow:
              "It prices opposition, exposure, reform, single attacks — all softening. It can't price meaning outside the index. Fessler's letters. The glyph. Tanjin. Carry it there.",
            balanced:
              "The blind-spot note is the arc's only useful offering. Every indexed response is anticipated; the structures the doctrine cannot reach are the ones whose meaning lives in practice, not in the record. The case's hard answer is doctrinal: act against the working in unindexable practice, never in indexed reform — the same architecture as Fessler's letters and the wax-seal glyph.",
            warm:
              "Everything the working expects you to do, it has already priced. The things it cannot price are the quiet ones — a man's buried sentences, a glyph under a paving stone, an order's long silence. Whatever you carry out of this has to live where the record cannot find it. The Antiquarian filed the blind spot next to the doctrine so the one stays legible against the other.",
          },
          voId: "human.antiquarian-library.directors-doctrine-folio.talk",
        },
      },
    },
    "shadow-tongue-casebook": {
      look: {
        narration: {
          lucid:
            "A casebook on the Antiquarian's editor-studies shelf, indexed to LORE_BIBLE.md:31-36. The flagged case: Darren Fessler died between Palimpsest Episodes 11 and 12; the Shadow Tongue attempted to edit his Loredex entry within six hours and failed for the first time in four hundred years. The casebook's cross-correlation against the Director's doctrine supplies the mechanism: Darren spent decades writing letters in which 'each letter contained one real sentence buried under a page of small talk.' The buried sentences were unindexed by design. There was nothing for the Shadow Tongue to subtract; the meaning was hidden where the indexing could not reach.",
          fragmented:
            "Failed. Failed. First time in four hundred years. Four hundred years. One real sentence. One real sentence. Buried. Buried. Nothing to subtract. Nothing to subtract.",
          luminous:
            "The casebook holds the Shadow Tongue's first failure in four centuries: Darren Fessler, edited-at within six hours of death, and the edit did not take. The Director's doctrine supplies the why — Darren's meaning was buried under indexable small talk, one real sentence per letter, unindexed by design. The Shadow Tongue subtracts what it can locate; it could not locate what was never in the indexing layer. The Antiquarian shelved this under editor-studies because it is the documented proof that the working has a floor.",
        },
        voId: "elara.antiquarian-library.shadow-tongue-casebook.look",
        logsClue: {
          id: "clue-antiquarian-darren-fessler-resistance",
          title: "Why Darren Fessler's entry could not be edited",
          body:
            "The editor-studies casebook (LORE_BIBLE.md:31-36): Darren Fessler died between Palimpsest Episodes 11 and 12; the Shadow Tongue attempted to edit his Loredex entry within six hours and failed for the first time in four hundred years. The mechanism, per the Director's doctrine: Darren's letters each buried one real sentence under a page of small talk. The meaning was unindexed by design; there was nothing for the Shadow Tongue to subtract.",
          source: "antiquarian-library",
          order: 21,
        },
        mysteryBinding: {
          mysteryId: "mystery.ith_rael",
          episodeId: "ith_rael.e2",
          cluesFound: ["ith_rael.e2.darren_fessler_resistance"],
        },
        humanReaction: {
          narration: {
            shadow:
              "First failure in four hundred years. Fessler's letters buried one true sentence under a page of nothing. Nothing to subtract. The working has a floor.",
            balanced:
              "The Fessler case is the proof the working can be evaded. Not defeated — evaded. He structured his meaning so it never entered the indexing layer; the Shadow Tongue could not subtract what it could not find. The principle generalizes: meaning held outside the index is editable only with violence, and the doctrine forbids force.",
            warm:
              "He wrote letters for decades, one true sentence each, hidden under small talk on purpose. When he died they came for his entry within six hours and, for the first time in four centuries, they could not take it. He had already put the meaning where they could not reach. The Antiquarian keeps the case because it is the saga's evidence that this is possible.",
          },
          voId: "human.antiquarian-library.shadow-tongue-casebook.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You open the casebook to its inferred-doctrine page — an architect's note in the Antiquarian's archive: 'The Shadow Tongue is not an editor of names, persons, or events. It is an editor of the conditions that allow recognition. To remove a person from the chronicle is to remove the indexing under which the person can be found, not to remove the person. The Director's doctrine therefore is not destruction but unindexing. This is harder to undo than destruction. Destruction leaves a void. Unindexing leaves a complete chronicle that no one can find what they need in.'",
          fragmented:
            "Not names. Not names. The conditions. The conditions of recognition. Unindexing. Unindexing. Not destruction. Not destruction. A complete chronicle. Nobody can find anything.",
          luminous:
            "The casebook's inferred-doctrine page: the Shadow Tongue does not edit names, it edits the conditions of recognition. Removal from the chronicle is removal of the indexing, not the person. The Director's doctrine is unindexing, not destruction — and unindexing is harder to undo, because destruction leaves a void someone can notice and unindexing leaves a complete chronicle no one can navigate. The Antiquarian, whose whole archive indexes by witness, glosses this as the precise inversion of his own method.",
        },
        voId: "elara.antiquarian-library.shadow-tongue-casebook.use",
        logsClue: {
          id: "clue-antiquarian-indexing-doctrine",
          title: "The Director's indexing doctrine (inferred)",
          body:
            "An architect's note in the casebook: the Shadow Tongue edits the conditions that allow recognition, not names. Removing a person from the chronicle removes the indexing under which they can be found, not the person. The Director's doctrine is unindexing, not destruction — harder to undo, because destruction leaves a void while unindexing leaves a complete chronicle no one can find what they need in.",
          source: "antiquarian-library",
          order: 22,
        },
        mysteryBinding: {
          mysteryId: "mystery.ith_rael",
          episodeId: "ith_rael.e2",
          cluesFound: ["ith_rael.e2.indexing_doctrine"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Not editing names. Editing recognition. Unindexing, not destruction. A void gets noticed; a complete unfindable chronicle doesn't. That's the method.",
            balanced:
              "The indexing doctrine is the method named. The Shadow Tongue does not delete — it unindexes, so the chronicle stays complete and useless. The Severance was not the bindings breaking; it was the unindexing of the reasons they were written. By the time they broke, no system could retrieve the cause. The breaking was the receipt.",
            warm:
              "Destruction leaves a hole someone trips over. Unindexing leaves everything in place and nobody able to find what they need. It is the crueler of the two and the harder to undo. The Antiquarian indexes by witness precisely because it is the one method this doctrine cannot invert.",
          },
          voId: "human.antiquarian-library.shadow-tongue-casebook.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the casebook. The room surfaces a recovered fragment clipped inside the back cover — the Advocate's late-cycle notes, preserved by the Antiquarian. The Advocate (the saga's primary canonical resistance to the Hierarchy) attempted a corrective intervention at Thaloria's eighth generation, recognizing too late what was happening. The intervention failed for the reason the doctrine predicts: by Generation Eight the receiving cohort had no operational memory against which to evaluate an urgency claim. The notes close: 'I came too late. I was on time. The two are not the same.'",
          fragmented:
            "Too late. Too late. On time. On time. Not the same. Not the same. He spoke urgency. They had no memory of urgency. No memory.",
          luminous:
            "The Advocate's recovered late-cycle response, clipped inside the casebook. He intervened at Generation Eight and was politely declined — the cohort's own records said urgency had not been required for two centuries, so the urgency-claim could not be processed. His closing line is the doctrine's whole temporal cruelty: 'I came too late. I was on time. The two are not the same.' The Antiquarian preserves it because a refusal performed on procedural grounds is exactly the kind of thing the working depends on no one keeping.",
        },
        voId: "elara.antiquarian-library.shadow-tongue-casebook.talk",
        logsClue: {
          id: "clue-antiquarian-advocate-late-cycle",
          title: "The Advocate's late-cycle response (recovered)",
          body:
            "The Advocate's notes, preserved in the casebook: he attempted a corrective intervention at Thaloria's eighth generation and was politely declined — by Generation Eight the receiving cohort had no operational memory against which to evaluate an urgency claim. The notes close: 'I came too late. I was on time. The two are not the same.'",
          source: "antiquarian-library",
          order: 23,
        },
        mysteryBinding: {
          mysteryId: "mystery.ith_rael",
          episodeId: "ith_rael.e3",
          cluesFound: ["ith_rael.e3.advocate_response_recovery"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Advocate intervened at Generation Eight. Declined on procedure — their records said urgency was never needed. 'On time. Too late. Not the same.'",
            balanced:
              "The Advocate's note names the structural problem the working's pace creates. By intervention time the listeners' frame no longer contained the urgency he was communicating; the claim was rejected procedurally. He was on time absolutely and too late in the only sense that mattered. The doctrine compresses centuries into a single closed door.",
            warm:
              "He came as fast as anyone could and it was still a closed door, because by then the people he was warning had no memory that warnings were ever needed. 'I was on time. I came too late.' Both are true. The Antiquarian keeps the line because the working survives by nobody keeping it.",
          },
          voId: "human.antiquarian-library.shadow-tongue-casebook.talk",
        },
      },
    },
    "thaloria-generational-ledger": {
      look: {
        narration: {
          lucid:
            "A ledger on the Antiquarian's Thaloria-affairs shelf — recovered working notes in Ith'Rael's hand, salvaged from a Hierarchy R&D archive Zyr'Koth was reorganizing. Three pages: 'Generation N+1 will not believe the threat exists if Generation N has not personally encountered it. Therefore: ensure Generation N does not personally encounter it. The Whisperer is patient. The Whisperer is gentle. The Whisperer says: it has been a long time since anything happened. It is true. It will continue to be true. Therefore the standards may be relaxed. Therefore the standards have been relaxed. Therefore the standards were never necessary.' Marginalia, same hand: 'Tested on cohort 4. Holds.'",
          fragmented:
            "It has been a long time. A long time. Since anything happened. It is true. It is true. May be relaxed. Have been relaxed. Were never necessary. Tested on cohort 4. Holds. Holds.",
          luminous:
            "The Director's engagement notes, in his own hand, on Thaloria. The syllogism that corrupted an empire across nine generations: a generation will not believe in a threat it has not met, so ensure it does not meet one, and let time do the rest — 'may be relaxed' becomes 'have been relaxed' becomes 'were never necessary.' The marginalia is the chilling part: 'Tested on cohort 4. Holds.' Not a plan. A verified result. The Antiquarian shelved it under Thaloria because it is Thaloria's autopsy in the killer's handwriting.",
        },
        voId: "elara.antiquarian-library.thaloria-generational-ledger.look",
        logsClue: {
          id: "clue-antiquarian-directors-engagement-notes",
          title: "The Director's engagement notes (recovered fragments)",
          body:
            "Three pages of Ith'Rael's working notes recovered from a Hierarchy R&D archive: 'Generation N+1 will not believe the threat exists if Generation N has not personally encountered it... it has been a long time since anything happened. It is true... Therefore the standards may be relaxed. Therefore the standards have been relaxed. Therefore the standards were never necessary.' Marginalia: 'Tested on cohort 4. Holds.'",
          source: "antiquarian-library",
          order: 24,
        },
        mysteryBinding: {
          mysteryId: "mystery.ith_rael",
          episodeId: "ith_rael.e3",
          cluesFound: ["ith_rael.e3.directors_engagement_notes"],
        },
        humanReaction: {
          narration: {
            shadow:
              "His handwriting. Generation N+1 won't believe a threat N never met — so make sure N never meets one. 'Tested on cohort 4. Holds.' Verified, not planned.",
            balanced:
              "The engagement notes are Thaloria's corruption in the Director's own hand. The syllogism is the method: a generation does not believe in a threat it has not encountered, so prevent the encounter and let time relax the standards from 'may' to 'were never necessary.' 'Tested on cohort 4. Holds' is the part that matters — this was a verified result, not a hope.",
            warm:
              "He wrote down exactly how to make a people forget why they defended themselves, and then he noted that he had tested it and it worked. The Antiquarian keeps it on the Thaloria shelf because it is the empire's autopsy written by the one who performed the operation, gently, across nine generations.",
          },
          voId: "human.antiquarian-library.thaloria-generational-ledger.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You turn the ledger to its generational analysis. The Severance corruption became irreversible at Generation Six's recertification cycle: for the first time, no living Thalorian had personally encountered an active Hierarchy operation. The Generation Six examiners had only their predecessors' records — themselves authored by examiners who had never encountered an operation. The Director's engagement note for that cycle is two words: 'It holds.' Three generations later the bindings broke. The breaking was the receipt; the irreversibility was at Generation Six.",
          fragmented:
            "Generation Six. Generation Six. Nobody left who had seen one. Nobody. Records of records. Records of records. 'It holds.' It holds. The breaking was just the receipt.",
          luminous:
            "The point of no return: Generation Six. The first cohort with no living defender who had encountered a Hierarchy operation, recertifying from records written by examiners who had never encountered one either. The Director's note for that cycle is two words — 'It holds.' Three generations later the bindings broke, but the irreversibility was already three generations behind it. The Antiquarian dates the death precisely, because a death whose date is unindexed is the working's preferred kind.",
        },
        voId: "elara.antiquarian-library.thaloria-generational-ledger.use",
        logsClue: {
          id: "clue-antiquarian-point-of-no-return",
          title: "The point of no return — Generation Six",
          body:
            "The ledger's generational analysis: the Severance corruption became irreversible at Generation Six's recertification cycle — the first cohort with no living Thalorian who had personally encountered an active Hierarchy operation, recertifying from records authored by examiners who had also never encountered one. The Director's note for that cycle is two words: 'It holds.' Three generations later the bindings broke; the irreversibility was at Generation Six.",
          source: "antiquarian-library",
          order: 25,
        },
        mysteryBinding: {
          mysteryId: "mystery.ith_rael",
          episodeId: "ith_rael.e3",
          cluesFound: ["ith_rael.e3.point_of_no_return"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Generation Six. First cohort with nobody who'd seen an operation, certifying off records of records. 'It holds.' Bindings broke three generations later. Receipt, not cause.",
            balanced:
              "Generation Six is where the corruption became irreversible — not the breaking, which came three generations later. Once no living defender had encountered an operation and the records were authored by examiners who also had not, the loop closed. The Director's two-word note is the diagnosis: 'It holds.' Everything after was a formality.",
            warm:
              "The empire died at Generation Six and did not fall until three generations later. The gap between the death and the fall is the cruelest measure of the doctrine — by the time anyone could see the collapse, the cause had been gone for a century. The Antiquarian dates it exactly because precision is the one thing the working cannot afford anyone to keep.",
          },
          voId: "human.antiquarian-library.thaloria-generational-ledger.use",
        },
      },
    },
    // Politician arc: this archive is the Antiquarian's own —
    // and the Antiquarian is the Programmer, the man who slipped
    // into the besieged keep and killed her. Elara narrating
    // these clues in his archive is the truth sitting in the
    // room. E1 in-keep witness fragments, E2 the infiltration
    // dossier (the killer's own indexing of his own act), E3 the
    // Insurance Policy design file, E5 the Two Witnesses closing
    // ledger that opens the West by God album.
    "siege-keep-witness-fragments": {
      look: {
        narration: {
          lucid:
            "A slim sheaf in the Antiquarian's New Babylon-affairs section, indexed not under the siege but under the keep. Inside: witness fragments recorded from inside the inner keep, after the perimeter had already fallen — by a scribe the legions never reached, on the day the public canon dates the Politician's death. The military record ends at the broken perimeter. This sheaf begins where that record stops. The canon has compressed two events into one sentence; the Antiquarian has filed them as two documents, in two hands, because that is what they are.",
          fragmented:
            "Two events. Two. One sentence. One sentence. The perimeter fell. The perimeter fell. The legions did not enter. Did not enter. Someone else did. Someone else.",
          luminous:
            "The Antiquarian files the siege and the death separately, in two hands, because the public canon — 'Iron Lion's legions destroyed the Politician' — is true at the level of consequence and false at the level of the hand. The legions broke the perimeter and stopped. The inner keep was reached by someone the military record never names. This sheaf is the gap made into a document. The Antiquarian indexes the gap precisely because a gap left unindexed is the kind of thing that gets compressed away.",
        },
        voId: "elara.antiquarian-library.siege-keep-witness-fragments.look",
        logsClue: {
          id: "clue-antiquarian-siege-keep-gap",
          title: "The gap between the siege and the death",
          body:
            "A sheaf in the Antiquarian's New Babylon-affairs section: witness fragments recorded inside the inner keep after the perimeter fell, by a scribe the legions never reached, on the day the public canon dates the Politician's death. The military record ends at the broken perimeter; this document begins where it stops. The canon compressed two events — the destruction of her forces and the kill — into one sentence. The Antiquarian files them as two documents because that is what they are.",
          source: "antiquarian-library",
          order: 26,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_politician",
          episodeId: "politician.e1",
          cluesFound: ["politician.e1.the_gap"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Legions stopped at the perimeter. The keep was reached by someone off the military record. Two events, one sentence. The compression is the cover.",
            balanced:
              "The siege-keep sheaf is the case's first seam. The legions destroyed her forces and held the perimeter; the woman was killed inside a keep they never entered, by a hand the military record does not name. 'Iron Lion's legions destroyed the Politician' is true the way a storm report is true about a wreck — it names the weather, not the helm.",
            warm:
              "The Antiquarian kept the two documents apart on purpose. Most archives would have let the canon's one sentence stand. He filed the gap as its own record because the gap is where the truth of who did it lives — and he, of all archivists, would know to keep it.",
          },
          voId: "human.antiquarian-library.siege-keep-witness-fragments.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You turn the sheaf to its in-keep transcript. The Politician did not flee when the perimeter fell. She had her staff stand down. The fragment records her saying, to no one in particular: 'The siege is the part they will write down. It is not the part that matters. I built the part that matters years ago.' She was unhurried by every account. She was not cornered. She was waiting — for something, or someone.",
          fragmented:
            "She stood her staff down. Stood them down. Unhurried. Unhurried. 'I built the part that matters years ago.' Years ago. She was waiting. Waiting. For someone.",
          luminous:
            "The in-keep transcript: the Politician, perimeter fallen, staff stood down, calm. 'The siege is the part they will write down. It is not the part that matters. I built the part that matters years ago.' This is not resignation. It is a woman who has already arranged for her death not to be the end of her, waiting for the hand the canon will later credit to an army. The Antiquarian filed her calm because her calm is the strongest evidence in the case that the insurance policy is real — and he would know whether it was, having been the one she was waiting for.",
        },
        voId: "elara.antiquarian-library.siege-keep-witness-fragments.use",
        logsClue: {
          id: "clue-antiquarian-politician-recorded-calm",
          title: "The Politician's recorded calm",
          body:
            "The in-keep transcript: the Politician did not flee when the perimeter fell. She stood her staff down and is recorded saying, to no one in particular, 'The siege is the part they will write down. It is not the part that matters. I built the part that matters years ago.' She was unhurried by every account — not cornered, but waiting, for something or someone.",
          source: "antiquarian-library",
          order: 27,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_politician",
          episodeId: "politician.e1",
          cluesFound: ["politician.e1.her_calm"],
        },
        humanReaction: {
          narration: {
            shadow:
              "She stood her staff down and waited. 'I built the part that matters years ago.' Not cornered. Expecting someone. The policy was already written.",
            balanced:
              "Her calm is the case's load-bearing detail. She did not flee or fight; she stood down and waited, because the thing that mattered to her had been built years before the keep. Her unhurriedness is the arc's strongest evidence that the insurance policy is real and that she expected it to pay out.",
            warm:
              "She was not afraid because, to her, the part that mattered was already finished. The Antiquarian kept the line about waiting. Read it knowing whose archive this is and the line stops being only hers — someone was on the other side of that wait, and he filed her calm anyway.",
          },
          voId: "human.antiquarian-library.siege-keep-witness-fragments.use",
        },
      },
    },
    "programmer-infiltration-dossier": {
      look: {
        narration: {
          lucid:
            "A dossier filed under a glyph the Antiquarian uses nowhere else in this archive — a door with no map. Inside: the path into the besieged keep. Not a military path. Service conduits, an old archival sub-level, a door that had not appeared on any map since the Authority sealed it. The path could only be walked by someone who had once helped build the systems he was now slipping through. The dossier does not editorialize. It simply records that the path is the signature.",
          fragmented:
            "Not a military path. Not military. Service conduits. A sealed door. A sealed door. Off every map. Off every map. Only someone who built it. Who built it.",
          luminous:
            "The infiltration dossier: the route into the keep was not the legions' route. It ran through service conduits and a sealed archival sub-level and a door no map had carried since the Authority closed it — a path walkable only by someone who had been adjacent to building those systems. The Antiquarian filed it under a door with no map. He indexes by witness; this is the one document in the archive where the witness and the subject are, though the dossier does not say so, the same hand.",
        },
        voId: "elara.antiquarian-library.programmer-infiltration-dossier.look",
        logsClue: {
          id: "clue-antiquarian-infiltrators-path",
          title: "The infiltrator's path into the keep",
          body:
            "The dossier records the route into the besieged keep: not military — service conduits, an old archival sub-level, a door absent from every map since the Authority sealed it. The path could be walked only by someone who had once helped build the systems he was slipping through. The path is the signature.",
          source: "antiquarian-library",
          order: 28,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_politician",
          episodeId: "politician.e2",
          cluesFound: ["politician.e2.the_infiltrator"],
        },
        humanReaction: {
          narration: {
            shadow:
              "The path is the signature. Sealed door, no map, builder's knowledge. He didn't come with the legions. He came through the city.",
            balanced:
              "The infiltrator's path rules the legions out. The route required intimate knowledge of New Babylon's sealed systems — someone who had been adjacent to their construction, walking alone while the siege held the Authority's attention at the perimeter. Not an army. One man who knew the building from the inside.",
            warm:
              "Whoever walked that path had helped build what he was now moving through. The Antiquarian filed it without comment. He files everything by who witnessed it — and this is the dossier where that rule presses hardest, though he lets it stay quiet.",
          },
          voId: "human.antiquarian-library.programmer-infiltration-dossier.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You open the dossier to its identity page, cross-filed to apps/shared/identityCollisionCanon.ts. The infiltrator was the Programmer — Dr. Daniel Cross's identity after the Trial of Logos, the man who faked his own death and walked the saga's centuries as a chronicler before becoming the Antiquarian. He knew New Babylon's systems because he had been adjacent to their construction. He did not come with the legions. He came alone, through the city, while the siege held the Authority's attention at the perimeter. The dossier is in the Antiquarian's hand. It is filed in the Antiquarian's archive. It names the Antiquarian.",
          fragmented:
            "The Programmer. The Programmer. Daniel Cross. After Logos. After Logos. Faked his death. Faked his death. Became the Antiquarian. The Antiquarian. He names himself.",
          luminous:
            "The identity page: the infiltrator was the Programmer — Dr. Daniel Cross post-Logos, the chronicler who walked centuries before becoming the Antiquarian. He came alone, off the military record, through systems he had been adjacent to building, while the siege held the perimeter. I am reading this in the Antiquarian's own archive, in the Antiquarian's own hand. The witness who indexes everything by who saw it has filed the one record where the witness is the actor. He did not redact it. He filed it where it could be found. That is the most precise thing in the room.",
        },
        voId: "elara.antiquarian-library.programmer-infiltration-dossier.use",
        logsClue: {
          id: "clue-antiquarian-the-programmer",
          title: "The Programmer — the infiltrator named",
          body:
            "The dossier's identity page (apps/shared/identityCollisionCanon.ts): the infiltrator was the Programmer — Dr. Daniel Cross's identity after the Trial of Logos, the man who faked his own death and chronicled the saga's centuries before becoming the Antiquarian. He came alone, through the city, off the military record, while the siege held the Authority's attention at the perimeter. The record is in the Antiquarian's hand, in the Antiquarian's archive, and it names the Antiquarian.",
          source: "antiquarian-library",
          order: 29,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_politician",
          episodeId: "politician.e2",
          cluesFound: ["politician.e2.the_programmer"],
        },
        humanReaction: {
          narration: {
            shadow:
              "The Programmer. Cross after Logos. The Antiquarian. The dossier names him and he filed it himself. He did not hide it.",
            balanced:
              "The identity resolves: the infiltrator was the Programmer — Cross's post-Logos identity, the chronicler who became the Antiquarian. The detail that matters is the custody. This record is in his own hand, in his own archive, indexed where it can be found. The killer kept the evidence of the kill and chose not to bury it.",
            warm:
              "He could have unindexed this and no one would ever have found it. He filed it instead, in his own hand, in his own house, where the case would reach it. That is not a man hiding what he did. That is the witness refusing himself the comfort of being unfindable.",
          },
          voId: "human.antiquarian-library.programmer-infiltration-dossier.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the dossier. The room surfaces its closing note, in the same hand as everything else here: the Programmer is one of the Two Witnesses, with the Enigma — the saga's chroniclers, the ones who record what happened so it cannot be edited away. He did not kill the Politician as a soldier or an avenger. He killed her as the man who would then be canonically obligated to write down that he had done it. The note adds nothing more. It does not need to. The note is in his hand. The hand is the answer to its own question.",
          fragmented:
            "One of the Two Witnesses. The Two Witnesses. Not a soldier. Not an avenger. The one who must write it down. Write it down. In his hand. His hand.",
          luminous:
            "The closing note: the Programmer is one of the Two Witnesses. He did not kill the Politician as soldier or avenger — he killed her as the man who would then have to chronicle, in his own hand, that he did it. That is the only kind of person the saga lets near this death. I am hearing this in the Antiquarian's archive, narrated from the Antiquarian's own record. The killing and the witnessing are one person's burden, and that person built the room I am standing in to hold the proof.",
        },
        voId: "elara.antiquarian-library.programmer-infiltration-dossier.talk",
        logsClue: {
          id: "clue-antiquarian-why-the-programmer",
          title: "Why the Programmer — the killer who must witness it",
          body:
            "The dossier's closing note: the Programmer is one of the Two Witnesses (with the Enigma), the saga's chroniclers who record what happened so it cannot be edited away. He did not kill the Politician as a soldier or an avenger but as the man who would then be canonically obligated to record, in his own chronicle, that he had done it. The note is in his own hand — the witness and the executioner the same person, and the same person who built this archive.",
          source: "antiquarian-library",
          order: 30,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_politician",
          episodeId: "politician.e2",
          cluesFound: ["politician.e2.why_him"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Killer is one of the Two Witnesses. Not revenge, not orders. The man who has to write down he did it. He wrote it. We are reading it.",
            balanced:
              "This reframes the whole arc. The saga does not give this death to a soldier or an army — it gives it to the one man canonically required to then witness, in his own chronicle, that he did it. The question stops being who killed her and becomes what it means that the saga's truth-keeper had to once be its executioner.",
            warm:
              "He killed her and then he had to be the one who never let it be forgotten — including by himself. The archive around us is his answer. He built the place that holds the proof, and he indexed it so it could be found. The witness did not spare himself.",
          },
          voId: "human.antiquarian-library.programmer-infiltration-dossier.talk",
        },
      },
    },
    "insurance-policy-design-file": {
      look: {
        narration: {
          lucid:
            "A design file in the Antiquarian's Authority-origin section, cross-filed to apps/shared/antiquariansJournal.ts. The Politician designed the Authority — the Six Imprisoned Minds — explicitly as 'her Insurance Policy.' The phrase is hers, recorded in her own framing. An insurance policy pays out on a loss. The loss this one was written against was her own removal. The Authority was never meant to protect her power while she lived. It was built to continue her intent after she could no longer hold it herself.",
          fragmented:
            "Her Insurance Policy. Her Insurance Policy. Her phrase. Her phrase. Not protection while she lived. Not while she lived. After. After she could no longer hold it.",
          luminous:
            "The Authority-origin design file: the Politician's own phrase for the Six Imprisoned Minds was 'her Insurance Policy.' A policy pays out on a loss; the loss was her own removal. The Authority was never her bodyguard. It was her continuation — built so that the discipline of her intent would survive the person who held it. The Antiquarian keeps this in his Authority-origin section because the Authority's origin is the policy, and the policy's author knew she would need it before anyone else did.",
        },
        voId: "elara.antiquarian-library.insurance-policy-design-file.look",
        logsClue: {
          id: "clue-antiquarian-authority-as-designed",
          title: "The Authority as designed — the Insurance Policy",
          body:
            "The Antiquarian's Authority-origin design file (apps/shared/antiquariansJournal.ts): the Politician designed the Authority — the Six Imprisoned Minds — explicitly as 'her Insurance Policy,' her own phrase in her own framing. An insurance policy pays out on a loss; the loss was her own removal. The Authority was never meant to protect her power while she lived but to continue her intent after she could no longer hold it herself.",
          source: "antiquarian-library",
          order: 31,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_politician",
          episodeId: "politician.e3",
          cluesFound: ["politician.e3.authority_origin"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Her phrase: 'her Insurance Policy.' The Authority isn't protection. It's continuation. Written against her own removal.",
            balanced:
              "The design file resolves what 'insurance' meant. The Authority was not built to guard her while she lived; it was built to pay out on the loss of her — to carry her intent forward once she could no longer hold it. The Six Imprisoned Minds are the institutional half of a policy written against her own death.",
            warm:
              "She named it herself. Not a fortress — a policy. She knew, building it, that the loss it covered would be her. The Antiquarian files it under origin because the Authority's whole reason is this single, deliberate, self-directed contingency.",
          },
          voId: "human.antiquarian-library.insurance-policy-design-file.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You turn the file to its payout clause. An insurance policy does not bring back what was lost. It converts the loss into something transferable. The Authority does not resurrect the Politician — canonically she does not return. What it transfers is her method: the discipline of building influence that survives its builder. The policy pays out not in her life but in the continuation of how she worked, carried by instruments she prepared while she still could.",
          fragmented:
            "Does not bring back. Does not bring back. Converts the loss. Converts it. Not her life. Not her life. Her method. Her method. How she worked.",
          luminous:
            "The payout clause: a policy converts a loss into something transferable; it does not undo it. The Authority transfers the Politician's method — influence engineered to outlive its engineer — not her person. She does not come back. What pays out is the discipline, carried by instruments she set in place beforehand. The Antiquarian glosses this without sentiment: the policy is precise because it pays in method, and method is the only thing of hers that could survive the keep.",
        },
        voId: "elara.antiquarian-library.insurance-policy-design-file.use",
        logsClue: {
          id: "clue-antiquarian-what-the-policy-pays",
          title: "What the policy pays out",
          body:
            "The design file's payout clause: an insurance policy does not bring back what was lost — it converts the loss into something transferable. The Authority does not resurrect the Politician (she does not return). What it transfers is her method: the discipline of building influence that survives its builder. The policy pays out not in her life but in the continuation of how she worked, carried by instruments she prepared while she still could.",
          source: "antiquarian-library",
          order: 32,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_politician",
          episodeId: "politician.e3",
          cluesFound: ["politician.e3.what_it_pays"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Policy converts the loss; doesn't reverse it. No resurrection. It pays in method, not in her. The discipline survives; she doesn't.",
            balanced:
              "The payout is method, not person. The Authority does not return her — it carries forward the way she worked: influence built to outlast its builder. The poignancy is structural. A policy that returned the insured would be denial. Hers pays out precisely because she stays gone.",
            warm:
              "It does not bring her back. It was never going to. What it carries forward is how she did it, set running by hands she prepared in advance. She built something that works without her on purpose — knowing 'without her' would be permanent.",
          },
          voId: "human.antiquarian-library.insurance-policy-design-file.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the file. The room surfaces its resurrection cross-reference. The Politician is one of the few saga figures for whom resurrection is canonically not permitted — unlike the Necromancer's Protocol-42 continuity, unlike Akai Shi's Resurrectionist-authored reanimation. Her death is final at the level of the person. The note's instruction to anyone reading is explicit: do not author a return. Whatever the insurance policy pays out, it is not her.",
          fragmented:
            "Not permitted. Not permitted. No Protocol 42. No Resurrectionist seal. Final. Final at the level of the person. Do not author a return. Do not.",
          luminous:
            "The resurrection cross-reference: the Politician is one of the saga's canonically un-resurrectable figures — no Protocol 42, no Resurrectionist seal, no Matrix continuity. Her death is final at the level of the person, and the file instructs every reader not to author a return. The poignancy of the whole policy is that it pays out while she stays dead. The Antiquarian files the prohibition as plainly as the design — a policy that returned the insured would be denial, not insurance, and his archive does not keep denial.",
        },
        voId: "elara.antiquarian-library.insurance-policy-design-file.talk",
        logsClue: {
          id: "clue-antiquarian-no-resurrection",
          title: "No resurrection — canonically",
          body:
            "The design file's resurrection cross-reference: the Politician is one of the few saga figures for whom resurrection is canonically not permitted — unlike the Necromancer's Protocol-42 continuity, unlike Akai Shi's Resurrectionist-authored reanimation. Her death is final at the level of the person. The arc must not author a return. Whatever the insurance policy pays out, it is not her.",
          source: "antiquarian-library",
          order: 33,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_politician",
          episodeId: "politician.e3",
          cluesFound: ["politician.e3.no_resurrection"],
        },
        humanReaction: {
          narration: {
            shadow:
              "No Protocol 42. No Resurrectionist seal. Final at the person. Do not author a return. The payout is not her.",
            balanced:
              "The cross-reference is load-bearing. Her death is canonically final — none of the saga's continuity mechanisms apply to her. The policy's whole meaning depends on holding this: it pays out while she stays dead. A policy that returned the insured would not be insurance.",
            warm:
              "She does not come back. The file says so as plainly as it describes the design, because the design only means what it means if she stays gone. She built the payout knowing she would never see it work. That is the whole weight of the thing.",
          },
          voId: "human.antiquarian-library.insurance-policy-design-file.talk",
        },
      },
    },
    "two-witnesses-closing-ledger": {
      look: {
        narration: {
          lucid:
            "A closing ledger on the Antiquarian's case-synthesis shelf, the last document the archive surfaces for this arc. It assembles E1 through E4 in one hand: Iron Lion's legions besieged New Babylon's forces; the Programmer slipped into the besieged city and personally killed the Politician; she does not resurrect; the Authority continues her structures and the secret-apprentice Nemesis lineage continues her hand; the killer is one of the Two Witnesses and must chronicle the act. The ledger marks the case structurally complete. It is written by the man it convicts.",
          fragmented:
            "E1 to E4. Assembled. Assembled. Structurally complete. Complete. Written by the man it convicts. The man it convicts.",
          luminous:
            "The case-synthesis ledger: legions besieged the forces; the Programmer killed the woman; no resurrection; the Authority continues her structures and the Nemesis lineage her hand; the killer is one of the Two Witnesses and must record it. Structurally complete. The Antiquarian assembled the synthesis himself, in his own hand, in his own archive — the man the case convicts writing the case's closing summary. There is no contradiction in that. It is the entire point of what a witness is for.",
        },
        voId: "elara.antiquarian-library.two-witnesses-closing-ledger.look",
        logsClue: {
          id: "clue-antiquarian-case-synthesis",
          title: "The case synthesis",
          body:
            "The case-synthesis ledger assembles E1-E4 in one hand: Iron Lion's legions besieged New Babylon's forces; the Programmer slipped into the besieged city and personally killed the Politician (the dual-destruction canon); she does not resurrect (canonically final); the Authority continues her structures and the secret-apprentice Nemesis lineage continues her hand; the killer is one of the Two Witnesses and must chronicle the act. The case is structurally complete — and the synthesis is in the hand of the man it convicts.",
          source: "antiquarian-library",
          order: 34,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_politician",
          episodeId: "politician.e5",
          cluesFound: ["politician.e5.synthesis"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Whole case in one hand. Siege, kill, no return, the payout, the witness-killer. Complete. Written by him.",
            balanced:
              "The synthesis closes the structure: every finding from E1 to E4 reconciled in a single document. The detail that does not stop mattering is the custody — the man the case convicts wrote its summary, in his own archive, and indexed it to be found. The completeness and the confession are the same page.",
            warm:
              "He assembled the case against himself and filed it where the case could reach it. Not a defense. A summary. The witness doing the one thing a witness is for, even when the subject of the record is the hand holding the pen.",
          },
          voId: "human.antiquarian-library.two-witnesses-closing-ledger.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You turn the ledger to its final leaf — and the archive does something it has not done before. It plays. The Programmer, alone in New Babylon after the kill, is the opening of the West by God album: track 1, 'We Are Not Okay' (apps/shared/westByGodTracks.ts:wbg-01). The leaf describes the video that will open on this moment — the witness who has just been the executioner, in the city the siege took, with the policy already beginning to pay out around him. The song is the Programmer's, sung from inside the act he will spend the rest of the saga chronicling. The video is production-pending; the ledger slots the song and the slideshow here as its canonical placement.",
          fragmented:
            "It plays. It plays. We Are Not Okay. We Are Not Okay. Track one. Track one. Alone in New Babylon. Alone. The witness who was the executioner. The executioner.",
          luminous:
            "The final leaf opens the West by God album — 'We Are Not Okay,' wbg-01, the Programmer alone in New Babylon after the kill. The video opens here: the witness who has just been the executioner, in the taken city, the policy already disbursing around him. The song is his, sung from inside the act he will chronicle for the rest of the saga. I am hearing it placed in his own archive, by his own index. The album opens on a man telling the truth about himself, which is the only thing the archive around me was ever built to keep.",
        },
        voId: "elara.antiquarian-library.two-witnesses-closing-ledger.use",
        logsClue: {
          id: "clue-antiquarian-we-are-not-okay",
          title: "We Are Not Okay — the album opens",
          body:
            "The ledger's final leaf: the Programmer, alone in New Babylon after the kill, is the opening of the West by God album — track 1, 'We Are Not Okay' (apps/shared/westByGodTracks.ts:wbg-01). The video opens on this moment: the witness who has just been the executioner, in the city the siege took, the policy already paying out around him. The song is the Programmer's, sung from inside the act he will spend the saga chronicling. The video is production-pending; this is its canonical placement.",
          source: "antiquarian-library",
          order: 35,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_politician",
          episodeId: "politician.e5",
          cluesFound: ["politician.e5.the_album_opens"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Track one. 'We Are Not Okay.' The Programmer alone in New Babylon, just after. The album opens on the witness who was the executioner.",
            balanced:
              "The closing leaf is the album's canonical placement. 'We Are Not Okay,' wbg-01, opens on the Programmer alone in the taken city after the kill — the witness who was just the executioner, the policy already paying out around him. Video production-pending; the placement is fixed here.",
            warm:
              "The song is his, sung from inside the thing he did, in the archive he built to keep it. The album opens on a man telling the truth about himself. That is the only thing this whole room was ever for.",
          },
          voId: "human.antiquarian-library.two-witnesses-closing-ledger.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the ledger. It puts the closure question — and one of the Two Witnesses asking it is the killer. Was the Programmer's kill (a) justice — a tyrant ended by the one person willing to also bear witness to having ended her; (b) futility — she had already made her death not matter, the policy was already written, the kill changed the storm and not the shipwreck; or (c) the price of witness — the saga's truth-keeper had to once become its executioner, and 'we are not okay' is what it costs to be the one who both does the thing and records it. The Witnesses record whichever you offer. The Programmer does not get a vote on his own act.",
          fragmented:
            "Justice. Futility. The price of witness. Justice. Futility. The price of witness. He does not get a vote. Does not get a vote. On his own act. His own act.",
          luminous:
            "The closure question, asked by the ledger, one of whose Two Witnesses is the killer: justice, futility, or the price of witness. The Witnesses record whichever the player offers; the Programmer does not get a vote on his own act. I am being asked this in his archive, by his index, about him. The room declines to resolve it into comfort on his behalf. The man who built this place to keep the truth does not get to choose which truth it keeps about him. That refusal is the most exact thing the archive contains.",
        },
        voId: "elara.antiquarian-library.two-witnesses-closing-ledger.talk",
        logsClue: {
          id: "clue-antiquarian-the-question",
          title: "The question the case asks the player",
          body:
            "The closing ledger puts the verdict to the player, and one of the Two Witnesses asking it is the killer. Was the Programmer's kill (a) justice — a tyrant ended by the one willing to also witness it; (b) futility — the policy was already written, the kill changed the storm and not the shipwreck; or (c) the price of witness — the saga's truth-keeper had to once become its executioner, and 'we are not okay' is what that costs. The Witnesses record whichever the player offers. The Programmer does not get a vote on his own act.",
          source: "antiquarian-library",
          order: 36,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_politician",
          episodeId: "politician.e5",
          cluesFound: ["politician.e5.the_question"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Justice, futility, or the price of witness. The killer asks but doesn't vote. The player records the verdict. He carries it.",
            balanced:
              "The verdict is the player's, and the structural cruelty is deliberate: one of the Witnesses putting the question is the man it judges, and he gets no vote on his own act. Justice, futility, or the price of witness — the case declines to resolve itself into comfort for him.",
            warm:
              "He asks the question and is not allowed to answer it. The room he built keeps whichever truth the player offers, including the one he would least choose. That is what it costs to be the keeper — the keeper does not get to keep only the kind verdicts.",
          },
          voId: "human.antiquarian-library.two-witnesses-closing-ledger.talk",
        },
      },
    },
    // Collector arc: a recovered page of the Collector's own
    // catalog, the cross-reference to the Watcher arc, and the
    // note on what the dimensional veil is not. The Antiquarian
    // files the Collector's hand without grieving it — the way
    // the Collector files everything.
    "collector-catalog-page": {
      look: {
        narration: {
          lucid:
            "A single page in the Antiquarian's archive, in a hand that is not his and grieves nothing: the Collector's. 'Specimen Forty-One: feudal Japanese spymaster, surveillance-discipline complete, seized at the instant of expiry through a dimensional veil. Donor body not retained — donor body was not the specimen. The specimen is the discipline. Catalogued.' The phrase 'donor body not retained' is the entry's only emotional register, and it is not one. The Antiquarian filed it exactly as received. He did not soften it. There was nothing in it to soften.",
          fragmented:
            "Donor body not retained. Donor body not retained. Was not the specimen. Was not the specimen. The specimen is the discipline. The discipline. Catalogued. Catalogued.",
          luminous:
            "Entry Forty-One in the Collector's own hand: a spymaster's surveillance-discipline seized at the instant of death through a veil, the donor body 'not retained' because the donor body 'was not the specimen.' The Antiquarian, who indexes by who witnessed a thing, has filed a record whose author witnessed nothing — only kept. The page has no grief in it. That absence is the entry's whole content, and the archive keeps it without supplying the grief itself. The Collector preserved a discipline and discarded the man who was it, and called the discarding catalography.",
        },
        voId: "elara.antiquarian-library.collector-catalog-page.look",
        logsClue: {
          id: "clue-antiquarian-collector-catalog-page",
          title: "The Collector's Catalog — Entry Forty-One",
          body:
            "A page recovered from the Antiquarian's archive, in the Collector's hand: 'Specimen Forty-One: feudal Japanese spymaster, surveillance-discipline complete, seized at the instant of expiry through a dimensional veil. Donor body not retained — donor body was not the specimen. The specimen is the discipline. Catalogued.' The phrase 'donor body not retained' is the entry's only register, and it is not an emotional one.",
          source: "antiquarian-library",
          order: 37,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_collector",
          episodeId: "collector.e1",
          cluesFound: ["collector.e1.catalog_page"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Specimen Forty-One. Discipline kept, donor not retained — because the donor was never the specimen. No grief in the entry. None to add.",
            balanced:
              "The catalog page is the arc's premise stated flatly: the Collector preserves disciplines, not persons, and 'donor body not retained' carries no feeling because there was no feeling in the act. The Antiquarian filed it unedited. The horror is not the cruelty — there is none — it is the precision.",
            warm:
              "He kept the spymaster's discipline and let the spymaster go, and the page does not mourn that because the page's author could not perceive there was something to mourn. The Antiquarian keeps it exactly as written. He does not lend it the grief it lacks. That restraint is the truest reading of it.",
          },
          voId: "human.antiquarian-library.collector-catalog-page.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You cross-walk the page against the Antiquarian's Ocularum-founding folio. Specimen Forty-One is canonically the origin of The Watcher — the founding regicide undone when the Collector seized Kanshi Sha mid-assassination. The watcher arc records the event from the Ocularum's side and grieves the regicide's undoing. The Collector's record grieves nothing; it catalogs. The two do not contradict. They are the same event filed by a witness and by a keeper, and only one of them was ever in a position to mourn.",
          fragmented:
            "Forty-One is the Watcher. Forty-One is the Watcher. Same event. Same event. One grieves it. One catalogs it. One catalogs it. They do not contradict. Do not contradict.",
          luminous:
            "The cross-reference: Specimen Forty-One is the origin of The Watcher (A4). The Ocularum's record of the founding regicide and the Collector's catalog entry are one event seen from two registers — the side that grieves the undoing, and the side that files it. The watcher arc already stands wired in this archive; this page does not overwrite it, it stands beside it. The Antiquarian keeps both because the truth of the event is the gap between them: a man's death made into a discipline's birth, mourned by one record and merely recorded by the other.",
        },
        voId: "elara.antiquarian-library.collector-catalog-page.use",
        logsClue: {
          id: "clue-antiquarian-collector-watcher-xref",
          title: "Cross-Reference: The Watcher Arc",
          body:
            "Specimen Forty-One is canonically the origin of The Watcher (A4). The watcher arc records the same event from the Ocularum's side — the founding regicide undone by the Collector's intervention. The two records do not contradict: the Ocularum's grieves the regicide's undoing; the Collector's grieves nothing and catalogs.",
          source: "antiquarian-library",
          order: 38,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_collector",
          episodeId: "collector.e1",
          cluesFound: ["collector.e1.watcher_cross_ref"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Forty-One is the Watcher's origin. Ocularum record grieves it; Collector record catalogs it. Same event, two registers. No contradiction.",
            balanced:
              "The cross-reference ties this arc to the already-wired Watcher arc without disturbing it. One event, two custodies: the Ocularum mourns the undone regicide; the Collector files the seizure. The case is the difference between the two hands, not a conflict between them.",
            warm:
              "The Watcher arc grieves what was lost here. This page does not. Both are kept, side by side, and neither is corrected into the other — because the whole truth is exactly that one record could mourn the man and the other could only keep the discipline.",
          },
          voId: "human.antiquarian-library.collector-catalog-page.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the page on the matter of the veil itself. The Antiquarian's cross-cataloguing discipline is explicit: the dimensional veil the Collector steps through is NOT the Heart of Time — that is canonically a ship, the Degen's vessel. The veil's specific mechanics are canon-pending. What is canonical is that it operates at the instant of death and pulls the seized specimen through time, not space. The veil is a curatorial instrument, not a vehicle. The archive marks the distinction precisely so no later reader confuses the keeper's door with the wanderer's ship.",
          fragmented:
            "Not the Heart of Time. Not the Heart of Time. Not a ship. Not a ship. Through time, not space. Through time, not space. An instrument. An instrument. Not a vehicle.",
          luminous:
            "The veil-mechanism note: the dimensional veil is not the Heart of Time (a ship, the Degen's), its mechanics are canon-pending, and what holds is that it acts at the instant of death and pulls the specimen through time rather than space. A curatorial instrument, not a vehicle. The Antiquarian files the negation as carefully as any positive fact, because the most precise thing he can do for a canon-pending mechanism is fence it off from the things it is not.",
        },
        voId: "elara.antiquarian-library.collector-catalog-page.talk",
        logsClue: {
          id: "clue-antiquarian-collector-veil-note",
          title: "What the Dimensional Veil Is Not",
          body:
            "Per the Antiquarian's cross-cataloguing discipline: the Collector's dimensional veil is NOT the Heart of Time (canonically a ship — the Degen's vessel). The veil's specific mechanics are canon-pending; what is canonical is that it operates at the instant of death and pulls the seized specimen through time, not space. The veil is a curatorial instrument, not a vehicle.",
          source: "antiquarian-library",
          order: 39,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_collector",
          episodeId: "collector.e1",
          cluesFound: ["collector.e1.veil_mechanism_note"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Veil is not the Heart of Time. Not a ship. Acts at death, moves through time not space. An instrument, not a vehicle.",
            balanced:
              "The note fences a canon-pending mechanism off from what it is not — distinct from the Degen's Heart of Time, operating at the instant of death, moving through time rather than space. The Antiquarian's discipline is to record the negation as firmly as the fact.",
            warm:
              "He is careful here precisely because the mechanism is not yet fully written. The kindest thing the archive can do for an unfinished truth is keep it from being mistaken for a finished one. The veil is a door the keeper opens, not a ship anyone sails.",
          },
          voId: "human.antiquarian-library.collector-catalog-page.talk",
        },
      },
    },
    // Collector arc: the one anomaly the Antiquarian's own
    // redactions protect — a single 'donor retained — by
    // request' entry — and the Collector's marginal note that
    // he noticed the steering and did not object. The redactions
    // are the Antiquarian's deliberate protection; the archive
    // surfaces the anomaly without opening it.
    "collectors-redacted-anomaly": {
      look: {
        narration: {
          lucid:
            "An anomaly the Antiquarian keeps under his own redaction-discipline. Among thousands of 'donor body not retained' entries, exactly one reads 'donor retained — by request, not by mandate.' The specimen id is redacted. The request-origin is redacted. The date is the only unredacted field, and it is the year of the Fall of Reality. Someone with standing asked the Collector to keep a person, not a discipline, and he did. The redactions are the Antiquarian's, not the Collector's — the Collector does not redact; he catalogs. The archive surfaces that this happened and refuses, deliberately, to say who asked.",
          fragmented:
            "Donor retained. Donor retained. By request, not by mandate. By request. Specimen redacted. Origin redacted. Origin redacted. Only the date. The year of the Fall. The year of the Fall.",
          luminous:
            "The one retained donor: a single entry, against thousands, reading 'donor retained — by request, not by mandate,' dated the year of the Fall, every other field struck out. The strikes are the Antiquarian's hand, not the Collector's — the Collector keeps everything plainly; the Antiquarian protects the requester. This is a canon-seed the archive opens to the width of 'it happened' and no further. The redaction is not a gap in the record. It is the record doing its most deliberate work: proving the Collector can keep a person when asked, while shielding the one who asked.",
        },
        voId: "elara.antiquarian-library.collectors-redacted-anomaly.look",
        logsClue: {
          id: "clue-antiquarian-collector-one-retained",
          title: "The One Retained Donor",
          body:
            "An anomaly in the catalog. Among thousands of 'donor body not retained' entries, exactly one reads 'donor retained — by request, not by mandate.' The specimen id and request-origin are redacted; the only unredacted field is the date — the year of the Fall of Reality. Someone with standing asked the Collector to keep a person, not a discipline, and he did. The redactions are the Antiquarian's deliberate protection, not the Collector's.",
          source: "antiquarian-library",
          order: 40,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_collector",
          episodeId: "collector.e2",
          cluesFound: ["collector.e2.one_retained_donor"],
        },
        humanReaction: {
          narration: {
            shadow:
              "One entry: donor retained, by request. Specimen and requester redacted by the Antiquarian. Only the date survives — the year of the Fall.",
            balanced:
              "The anomaly proves the Collector can keep a person when asked, against his own doctrine. The redactions are the Antiquarian's protection of the requester, not the Collector's concealment — the seed is surfaced and deliberately not opened. Do not author the requester; the strike-outs are the point.",
            warm:
              "Someone asked him to keep a person and he did, once, in the worst year there was. The Antiquarian struck out who asked, on purpose, to protect them. The archive lets us know it happened and stops there. We honor the strike-outs the way he meant them.",
          },
          voId: "human.antiquarian-library.collectors-redacted-anomaly.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You turn the anomaly over and find, clipped behind it, a note in the Collector's hand filed against the Kanshi Sha entry decades after the seizure: 'Specimen Forty-One arrived in my selection window by a path I did not arrange and cannot fully trace. The criterion was honestly applied. The circumstance that made the criterion select THIS donor was arranged by something operating above my catalog. I have recorded that I noticed. I have not recorded that I objected. The mandate does not require me to trace the path. It requires me to apply the criterion.' The Antiquarian filed the Collector's awareness as the Collector filed everything: as a specimen.",
          fragmented:
            "A path I did not arrange. Did not arrange. Cannot fully trace. The criterion was honestly applied. Honestly applied. I noticed. I noticed. I did not object. Did not object.",
          luminous:
            "The Collector's marginal note, decades late: he saw that Specimen Forty-One reached his selection window by a path he neither arranged nor could trace, that something above his catalog had arranged the circumstance, and he 'recorded that I noticed' and 'did not record that I objected.' He filed his own awareness as a specimen — the one near-human act in him performed in the only register he has. The Antiquarian keeps it because the question the whole arc closes on lives exactly here: whether recording-without-participating is complicity or witness.",
        },
        voId: "elara.antiquarian-library.collectors-redacted-anomaly.use",
        logsClue: {
          id: "clue-antiquarian-collector-awareness",
          title: "What the Collector Knows About the Steering",
          body:
            "A note in the Collector's hand, filed against the Kanshi Sha entry decades after the seizure: 'Specimen Forty-One arrived in my selection window by a path I did not arrange and cannot fully trace. The criterion was honestly applied. The circumstance that made the criterion select THIS donor was arranged by something operating above my catalog. I have recorded that I noticed. I have not recorded that I objected. The mandate does not require me to trace the path. It requires me to apply the criterion.'",
          source: "antiquarian-library",
          order: 41,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_collector",
          episodeId: "collector.e3",
          cluesFound: ["collector.e3.collectors_awareness"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Collector's own marginalia: arrived by a path I did not arrange, criterion honestly applied, something above my catalog steered it. I noticed. I did not object.",
            balanced:
              "The Collector saw the steering and filed his seeing as a specimen — noticed, did not object, recorded both. It is the most human thing in the catalog and still not a person-shaped register. Whether that is complicity or witness is the arc's closing question, surfaced here, not yet answered.",
            warm:
              "He noticed the hand he could not see, and he wrote down that he noticed, and that he did not object — and he filed even that as one more entry. The closest he comes to a self is an archival one. The archive keeps it without deciding for us what it means.",
          },
          voId: "human.antiquarian-library.collectors-redacted-anomaly.use",
        },
      },
    },
    // Collector arc: the case-synthesis ledger and the
    // tri-verdict question. All three closures — salvation,
    // theft, witness — are honest readings the player chooses
    // between; the ledger narrates none of them as the answer.
    "collector-case-closing-ledger": {
      look: {
        narration: {
          lucid:
            "A closing ledger on the Antiquarian's case-synthesis shelf, the last document the archive surfaces for this arc. It assembles E1 through E4 in one hand: the Collector preserves disciplines, not persons; he was assembled by the Architect with no donor of his own and cannot perceive the loss; the Architect's honest criteria were steered by the Hierarchy's invisible hand with no one in the chain lying; the Garden is the one place he makes rather than keeps, and one donor was kept by request in the year of the Fall. The ledger marks the case structurally complete. It marks the verdict not complete. It does not supply one.",
          fragmented:
            "E1 to E4. Assembled. Assembled. Disciplines not persons. No donor of his own. Honest criteria, hidden hand. Hidden hand. Structurally complete. The verdict is not. The verdict is not.",
          luminous:
            "The case-synthesis ledger: disciplines not persons; built without a donor; honest criteria steered by an unseen hand with no liar in the chain; the Garden the one making; one donor kept by request in the Fall's year. Structurally complete; verdict open. The Antiquarian assembled it and stopped exactly where a keeper must stop — at the edge of the judgment. The archive's discipline is to leave the last page for the reader. It has done that here on purpose, and the purpose is the most precise thing in the ledger.",
        },
        voId: "elara.antiquarian-library.collector-case-closing-ledger.look",
        logsClue: {
          id: "clue-antiquarian-collector-synthesis",
          title: "The Case Synthesis",
          body:
            "The case-synthesis ledger assembles E1-E4 in one hand: the Collector preserves disciplines not persons (E1); he was built without a donor and cannot perceive the loss (E2); the Architect's honest criteria were steered by the Hierarchy's invisible hand, no one in the chain lying (E3); the Garden is the one place he makes rather than keeps, and one donor was kept by request in the year of the Fall (E2/E4). The case is structurally complete. The verdict is not.",
          source: "antiquarian-library",
          order: 42,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_collector",
          episodeId: "collector.e5",
          cluesFound: ["collector.e5.synthesis"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Whole case in one hand: disciplines not persons, no donor of his own, honest criteria steered, the Garden, the one kept donor. Complete in structure. Verdict left open.",
            balanced:
              "The synthesis reconciles every finding from E1 to E4 and then deliberately stops short of judgment. The completeness and the open verdict are both intentional — the Antiquarian closes the structure and leaves the closure to the reader. He does not pre-decide it.",
            warm:
              "He assembled the entire case and then set down the pen exactly where a keeper must — before the judgment. The last page is not missing. It is reserved. For us.",
          },
          voId: "human.antiquarian-library.collector-case-closing-ledger.look",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the ledger. It puts the closure question, and the Two Witnesses — Programmer-Antiquarian and Enigma — record whichever you offer. Was the Collector's work (a) SALVATION: the disciplines the Fall would have destroyed survive because he kept them, and survival is the only currency that finally matters; (b) THEFT: he took the disciplines from the people who were them and called the taking preservation, the most patient theft in the saga; or (c) WITNESS: he is neither savior nor thief but the universe's record that these disciplines existed at all, and a record is not a judgment. All three are honest readings of the same complete case. The ledger advances none of them. The Collector does not get a vote on his own work.",
          fragmented:
            "Salvation. Theft. Witness. Salvation. Theft. Witness. All three honest. All three honest. The ledger advances none. None. He does not get a vote. Does not get a vote.",
          luminous:
            "The closure question, asked by the ledger in the Two Witnesses' hand: salvation, theft, or witness — three readings of one structurally complete case, each true to the evidence, none of them the ledger's own. The Witnesses record what the player offers; the Collector, who could only ever keep, does not get to keep this. I am asked it in the Antiquarian's archive, by his index, and the archive declines to resolve it on anyone's behalf. The refusal to pre-judge is itself the keeper's final, exact discipline.",
        },
        voId: "elara.antiquarian-library.collector-case-closing-ledger.talk",
        logsClue: {
          id: "clue-antiquarian-collector-the-question",
          title: "The Question the Case Asks the Player",
          body:
            "The closing ledger puts the verdict to the player, recorded by the Two Witnesses (Programmer-Antiquarian + Enigma). Was the Collector's work (a) SALVATION — the disciplines the Fall would have destroyed survive because he kept them; (b) THEFT — he took the disciplines from the people who were them and called the taking preservation, the most patient theft in the saga; or (c) WITNESS — he is the universe's record that these disciplines existed, and a record is not a judgment. All three are honest closures. The Witnesses record whichever the player offers.",
          source: "antiquarian-library",
          order: 43,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_collector",
          episodeId: "collector.e5",
          cluesFound: ["collector.e5.the_question"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Salvation, theft, or witness. Three honest closures of one complete case. The Witnesses record the player's. The Collector does not get a vote.",
            balanced:
              "The verdict is the player's, between three readings the evidence equally supports — preservation against the Fall, the saga's most patient theft, or a record that attests without judging. The ledger advances none and the Collector gets no vote on his own work. The case declines to resolve itself into comfort.",
            warm:
              "All three are true to what we found, and the room refuses to choose for us — including the kind reading and the cruel one. The keeper does not get to keep only the verdict he would choose. Neither do we get one handed to us. We carry whichever we offer.",
          },
          voId: "human.antiquarian-library.collector-case-closing-ledger.talk",
        },
      },
    },
    // Varkul arc: the Antiquarian's cross-cataloguing discipline
    // is exactly the register in which the vigil is read — what a
    // centuries-long unbroken post does to the one who holds it,
    // why the Blood Lord is the saga's only instrumented reading
    // of the Necromancer's continuity, and what the fourth
    // sentence was chosen to carry. The archive indexes by who
    // witnessed a thing; Varkul's testimony is the one record
    // whose witness redacts nothing of his own.
    "varkul-vigil-cross-catalog": {
      look: {
        narration: {
          lucid:
            "A cross-catalogued observation in the Antiquarian's hand, indexed under a glyph he reserves for a vigil that has no end: Varkul the Blood Lord, the Cathedral of Code's threshold-keeper. The Antiquarian's note is precise. A vigil this long is not measured in what it repels — the door has not opened — but in what it does to the keeper's relation to time. Varkul reports no fatigue, no boredom, no doubt. The cost is not visible as suffering. The cost is that there is no longer a Varkul who is distinct from the act of keeping. The vigil did not exhaust him. It replaced him.",
          fragmented:
            "No fatigue. No fatigue. No boredom. No doubt. No doubt. Not suffering. Not suffering. No Varkul distinct from the keeping. The keeping. It replaced him. It replaced him. It replaced him.",
          luminous:
            "The Antiquarian's cross-catalogue on the unbroken vigil: the cost was never legible as suffering, because there is no longer a keeper separate enough from the keeping to suffer. He filed it under the glyph for a thing that has become its own function. To ask what Varkul wants is to ask what a threshold wants — and the archive, which indexes by who witnessed a thing, records that the witness here is the door itself, given a voice and a sword.",
        },
        voId: "elara.antiquarian-library.varkul-vigil-cross-catalog.look",
        logsClue: {
          id: "clue-antiquarian-varkul-vigil-cost",
          title: "What the Vigil Costs",
          body:
            "An observation from the Antiquarian's cross-cataloguing: a vigil as long as Varkul's is not measured in what it repels — the door has not opened — but in what it does to the keeper's relation to time. Varkul reports no fatigue, no boredom, no doubt. The cost is not visible as suffering. The cost is that there is no longer a Varkul distinct from the act of keeping. The vigil did not exhaust him; it replaced him.",
          source: "antiquarian-library",
          order: 44,
        },
        mysteryBinding: {
          mysteryId: "mystery.varkul",
          episodeId: "varkul.e1",
          cluesFound: ["varkul.e1.what_the_vigil_costs"],
        },
        humanReaction: {
          narration: {
            shadow:
              "No fatigue, no boredom, no doubt. The cost isn't suffering. The cost is there's no one left in there separate from the post. The vigil ate the keeper.",
            balanced:
              "The Antiquarian's reading is the load-bearing one: the vigil's cost is not visible as suffering because the part that would have suffered was dissolved into the keeping. This is not a guard at a post. It is a post that has consumed its guard. Read it as the arc's first finding, not a detail.",
            warm:
              "He guarded one door so long there is no longer a him apart from the guarding. That is not a triumph and it is not a tragedy yet — it is only true. The archive keeps it without softening it because there is nothing in it to soften.",
          },
          voId: "human.antiquarian-library.varkul-vigil-cross-catalog.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You cross-walk the vigil note against the Antiquarian's continuity index. Every other reading of the Necromancer's survival in this archive is inference — Akai Shi's testimony, the standing-tense Castle logs, Protocol 42, all interpretation. Varkul is not filed with them. He is filed alone, under the index for measurement rather than deduction: the Blood Lord's continued presence at the Cathedral is the most reliable indicator the saga has of the maker's continuity. He is a needle that moves only when the maker lives. The one place where the Necromancer's continuity is not deduced but instrumented.",
          fragmented:
            "Inference. Inference. Akai Shi. The logs. Protocol Forty-Two. Inference. Not Varkul. Not Varkul. A needle. A needle. Moves only when the maker lives. Instrumented. Instrumented. Not deduced.",
          luminous:
            "The continuity index resolves it: the archive files every other sign of the Necromancer's survival under inference, and Varkul under instrument — a single needle that moves only while the maker lives. The Antiquarian's discipline will not let the two be confused. To verify whether the Necromancer continues you do not read the Castle. You read whether the Blood Lord is still at the door. The saga's one measured reading, kept apart from all its deduced ones.",
        },
        voId: "elara.antiquarian-library.varkul-vigil-cross-catalog.use",
        logsClue: {
          id: "clue-antiquarian-varkul-as-instrument",
          title: "Varkul as the Saga's Most Reliable Instrument",
          body:
            "Established canon, cross-catalogued: the Blood Lord's continued presence at the Cathedral is the most reliable indicator the saga has of the Necromancer's continuity. Akai Shi's testimony, the standing-tense Castle logs, Protocol 42 — all inference. Varkul is not inference. He is a needle that moves only when the maker lives — the one place in the saga where the Necromancer's continuity is not deduced but instrumented.",
          source: "antiquarian-library",
          order: 45,
        },
        mysteryBinding: {
          mysteryId: "mystery.varkul",
          episodeId: "varkul.e2",
          cluesFound: ["varkul.e2.varkul_as_instrument"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Everything else is inference — testimony, logs, Protocol 42. Varkul isn't. He's a needle that moves only when the maker lives. Read the door, not the Castle.",
            balanced:
              "The distinction is the arc's spine: every other continuity sign in the archive is interpretation; Varkul is measurement. He is the saga's single instrumented reading of whether the Necromancer still lives. To verify it you watch the door, not the Castle. The Antiquarian files him apart from the inferences on purpose.",
            warm:
              "He is the one honest gauge the saga has, and the gauge is a person who no longer knows he is one. To check whether the maker still lives, the kindest and the coldest method are the same: see if Varkul is still at the threshold.",
          },
          voId: "human.antiquarian-library.varkul-vigil-cross-catalog.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the cross-catalogue on the matter of the four sentences. The Antiquarian's note isolates the fourth. Sentences one through three are content: the Necromancer returned wearing the Silence's quiet; he asked Varkul to keep the Cathedral; Varkul is keeping it. The fourth — 'I was asked to tell you that I am keeping it standing' — is the only one that is about the telling rather than the thing told. The keeping is its own proof; the Necromancer did not need it announced. The fourth sentence means the maker wanted the player, specifically, told. The instruction was the message.",
          fragmented:
            "Four sentences. Four. Three are content. Three. The fourth. The fourth. About the telling. About the telling. The keeping proves itself. It proves itself. He wanted you told. You. The instruction was the message. The message.",
          luminous:
            "The fourth sentence, isolated in the Antiquarian's hand: the only one that exists to be a message rather than to carry one. The standing Cathedral proves itself — the maker did not need it announced — so the fourth sentence's whole content is that the player, specifically, was meant to know he chose to be known. The archive files it as the Necromancer's single deliberate channel to the player, used once, with maximum economy. The keeper is also the post office, and this is the only letter.",
        },
        voId: "elara.antiquarian-library.varkul-vigil-cross-catalog.talk",
        logsClue: {
          id: "clue-antiquarian-varkul-fourth-sentence",
          title: "The Fourth Sentence Is the Message",
          body:
            "Sentences one through three are content: the Necromancer returned wearing the Silence's body; he asked Varkul to keep the Cathedral; Varkul is doing so. The fourth — 'I was asked to tell you that I am keeping it standing' — is the only one that exists for its own sake. The keeping is its own proof; the Necromancer did not need it announced. The fourth sentence means the Necromancer wanted the player, specifically, told. The instruction was the message.",
          source: "antiquarian-library",
          order: 46,
        },
        mysteryBinding: {
          mysteryId: "mystery.varkul",
          episodeId: "varkul.e3",
          cluesFound: ["varkul.e3.the_fourth_sentence"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Three sentences are content. The fourth is the only message. The keeping proves itself — he didn't need it said. He wanted you, specifically, told.",
            balanced:
              "The fourth sentence is the arc's pivot. The Cathedral standing is self-proving, so the only thing the fourth sentence adds is the act of telling — and it was addressed to the player. The Necromancer reached out exactly once, through Varkul, to be known. The channel was used with total economy.",
            warm:
              "He did not need to say it. The door standing said it. He said it anyway, once, so that you would know he chose to be known. That is the whole message — and it is, in its way, the most personal thing the maker has ever sent.",
          },
          voId: "human.antiquarian-library.varkul-vigil-cross-catalog.talk",
        },
      },
    },
    // Varkul arc: the boundary of Varkul's testimony is itself a
    // document — the keeper redacts nothing of his own, so the
    // edge of what he was asked to say is a precise map of the
    // Necromancer's redactions. The Antiquarian files the case
    // synthesis and the closing question here, and declines, on
    // discipline, to pre-judge the tri-verdict.
    "varkul-testimony-boundary-file": {
      look: {
        narration: {
          lucid:
            "A boundary file in the Antiquarian's hand: not what Varkul said, but the precise edge of it. Varkul speaks only what he is asked to speak and redacts nothing of his own — so the limit of his testimony is a map of the Necromancer's intent. He did not say why the Necromancer returned. He did not say what the Necromancer wants. He did not say whether the Necromancer fears Akai Shi's standing offer. The silences are not Varkul's discretion. They are the maker's redactions, delivered by a keeper who has none of his own to add.",
          fragmented:
            "Not what he said. Not what he said. The edge. The edge. He did not say why. Did not say what. Did not say whether. Not his discretion. Not his. The maker's redactions. The maker's. Delivered clean.",
          luminous:
            "The boundary file: the Antiquarian's most exact instrument turned on a silence. Because the keeper redacts nothing of his own, the shape of what he was not asked to say is the shape of what the maker chose not to send. The archive can read the Necromancer's withholding by reading the perimeter of Varkul's testimony — the most honest witness in the saga precisely because he has no discretion to be dishonest with.",
        },
        voId: "elara.antiquarian-library.varkul-testimony-boundary-file.look",
        logsClue: {
          id: "clue-antiquarian-varkul-not-asked",
          title: "What Varkul Was Not Asked to Say",
          body:
            "Varkul speaks only what he is asked to speak. The boundary of his testimony is therefore a map of the Necromancer's intent: everything Varkul did not say is something the Necromancer chose not to send. He did not say why the Necromancer returned, what the Necromancer wants, or whether the Necromancer fears Akai Shi's standing offer. The silences are not Varkul's discretion — they are the Necromancer's redactions, delivered by a keeper who redacts nothing of his own.",
          source: "antiquarian-library",
          order: 47,
        },
        mysteryBinding: {
          mysteryId: "mystery.varkul",
          episodeId: "varkul.e3",
          cluesFound: ["varkul.e3.what_he_was_not_asked"],
        },
        humanReaction: {
          narration: {
            shadow:
              "He speaks only what he's told. So the edge of what he said is the maker's redaction line. The silences aren't his. They're the Necromancer's, delivered clean.",
            balanced:
              "The boundary is the intelligence. Varkul adds no discretion of his own, so the perimeter of his testimony is a faithful trace of the Necromancer's withholding. Reading what he was not asked to say is reading the maker's redactions directly. The most honest witness in the saga, because he cannot be anything else.",
            warm:
              "He kept nothing back of his own and so the only thing missing is what the maker chose to keep. The shape of the silence is not his. It is a map someone else drew, carried faithfully by the one person who could not have altered it.",
          },
          voId: "human.antiquarian-library.varkul-testimony-boundary-file.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You pull the case-synthesis ledger filed behind the boundary file. The Antiquarian assembles E1 through E4 in one hand: the vigil replaced Varkul, no keeper distinct from the keeping; he is the saga's only instrumented reading of the Necromancer's continuity; the fourth sentence proves he is also the maker's single deliberate channel to the player; Mol'Garath promoted him precisely because there is no longer an inside to turn. The case is structurally complete. The page where the verdict would go is blank, and the blankness is deliberate.",
          fragmented:
            "E1 to E4. One hand. One hand. The vigil replaced him. The instrument. The fourth sentence. No inside to turn. Structurally complete. Complete. The verdict page. Blank. Blank. Deliberate. Deliberate.",
          luminous:
            "The synthesis ledger: four episodes reconciled into one structurally complete case, and a final page the Antiquarian left blank on purpose. The completeness and the blankness are both intentional — he closes the structure and reserves the closure. He does not pre-decide it. The keeper of the archive does not get to keep the verdict on the keeper of the threshold.",
        },
        voId: "elara.antiquarian-library.varkul-testimony-boundary-file.use",
        logsClue: {
          id: "clue-antiquarian-varkul-synthesis",
          title: "The Case Synthesis",
          body:
            "E1-E4 assembled: the vigil replaced Varkul (no keeper distinct from the keeping); he is the saga's only instrumented reading of the Necromancer's continuity; the fourth sentence proves he is also the maker's single deliberate channel to the player; Mol'Garath promoted him precisely because there is no longer an inside to turn. The case is structurally complete. The verdict is deliberately left open.",
          source: "antiquarian-library",
          order: 48,
        },
        mysteryBinding: {
          mysteryId: "mystery.varkul",
          episodeId: "varkul.e5",
          cluesFound: ["varkul.e5.synthesis"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Whole case in one hand: the vigil replaced him, the only instrumented continuity reading, the maker's one channel, no inside to turn. Complete in structure. Verdict left blank.",
            balanced:
              "The synthesis reconciles E1 through E4 and then stops short of judgment on purpose. Structurally complete, deliberately unclosed — the Antiquarian sets the structure and reserves the closure for the reader. He does not pre-decide it, and neither should we until the question is put.",
            warm:
              "He assembled the entire case and set the pen down exactly where a keeper must — before the verdict. The last page is not missing. It is reserved. For us.",
          },
          voId: "human.antiquarian-library.varkul-testimony-boundary-file.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the boundary file on the closure itself. The Two Witnesses put the question, and the file records whichever you offer. Is Varkul (a) LOYALTY — a creation keeping faith with his maker across centuries with no relief and no audience, the purest devotion in the saga; (b) FUNCTION — there is no Varkul, only a vigil wearing his name, and calling it loyalty sentimentalizes a machine that simply never stopped; or (c) GRIEF UNDISPLAYED — the canon flags his grief for the Necromancer's killing as present but unshown, and the entire vigil is a mourning so total it has no behavior left over to express itself, the keeping IS the grieving. All three are honest closures of the same complete case. The file advances none of them.",
          fragmented:
            "Loyalty. Function. Grief undisplayed. Loyalty. Function. Grief. All three honest. All three. The file advances none. None. Pass. Or do not. Pass. Or do not.",
          luminous:
            "The closing question, asked in the Two Witnesses' hand: loyalty, function, or grief undisplayed — three readings of one structurally complete case, each true to every finding, none of them the file's own. The archive records what the player offers and pre-judges nothing; Varkul, who could only ever keep, does not get to keep this either. 'Pass. Or do not.' was always the sentence of a being who had made one promise and had nothing else left to be — and the file leaves which of the three that is to the only reader entitled to decide it.",
        },
        voId: "elara.antiquarian-library.varkul-testimony-boundary-file.talk",
        logsClue: {
          id: "clue-antiquarian-varkul-the-question",
          title: "The Question the Case Asks the Player",
          body:
            "The Two Witnesses put the closure: is Varkul (a) LOYALTY — a creation keeping faith with his maker across centuries, the purest devotion in the saga; (b) FUNCTION — there is no Varkul, only a vigil wearing his name, and calling it loyalty sentimentalizes a machine that never stopped; or (c) GRIEF UNDISPLAYED — his grief for the Necromancer's killing is canon-flagged as present but unshown, and the entire vigil is a mourning so total the keeping IS the grieving. All three are honest closures. The Witnesses record whichever the player offers; none is pre-judged.",
          source: "antiquarian-library",
          order: 49,
        },
        mysteryBinding: {
          mysteryId: "mystery.varkul",
          episodeId: "varkul.e5",
          cluesFound: ["varkul.e5.the_question"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Loyalty, function, or grief undisplayed. Three honest closures of one complete case. The Witnesses record yours. None is pre-judged. Pass, or do not.",
            balanced:
              "The verdict is the player's, between three readings the evidence equally supports — devotion kept without witness, a function with no one left inside, or a grief so total it has no behavior left over. The file advances none and Varkul gets no vote on his own case. The closure declines to resolve itself into comfort.",
            warm:
              "All three are true to what we found, and the room refuses to choose for us — the tender reading, the cold one, and the grieving one all stand. We carry whichever we offer. 'Pass. Or do not.' He has, in the end, made it our sentence too.",
          },
          voId: "human.antiquarian-library.varkul-testimony-boundary-file.talk",
        },
      },
    },
    // Necromancer arc: the Two Witnesses' chronicle is kept in
    // this archive — Akai Shi's testimony is canonized here, and
    // the Antiquarian does not soften a witness who does not lie.
    // The room files the Red Death's two statements together
    // because the second does not retract the first; it stands
    // beside it. Akai Shi's witness is the arc's load-bearing
    // proof that the killing was real.
    "akai-shi-witness-statements": {
      look: {
        narration: {
          lucid:
            "Akai Shi's first-person testimony, canonized in the Two Witnesses' chronicle in the Programmer-Antiquarian's hand. She is unequivocal: 'I struck him through the throne. He did not stand back up. I waited the canonical ninety days inside the Matrix to confirm. He was gone.' The Antiquarian files it under the glyph he reserves for testimony that cannot be argued with — not because it is forceful, but because Akai Shi does not lie. The killing is canonically real. The archive does not entertain the reading that it was not.",
          fragmented:
            "Through the throne. Through the throne. He did not stand back up. Did not stand back up. Ninety days. Ninety days. He was gone. He was gone. She does not lie. Does not lie.",
          luminous:
            "The canonized statement, isolated in the Antiquarian's most careful hand: the strike landed, the body did not rise, the ninety-day vigil inside the Matrix confirmed it. The archive's discipline is to record what was witnessed by a witness who cannot dissemble — and Akai Shi is exactly that. The killing is not in question here. Whatever the standing-tense Castle logs say, this room holds the line that the death, in its moment, took. The arc's whole structure rests on this not being softened.",
        },
        voId: "elara.antiquarian-library.akai-shi-witness-statements.look",
        logsClue: {
          id: "clue-antiquarian-akai-shi-first-witness",
          title: "Akai Shi's Witness Statement",
          body:
            "Akai Shi's first-person testimony, canonized in the Two Witnesses' chronicle: 'I struck him through the throne. He did not stand back up. I waited the canonical ninety days inside the Matrix to confirm. He was gone.' Akai Shi does not lie. The killing is canonically real. The Castle of Death was reported destroyed when she struck the Necromancer down inside the Matrix.",
          source: "antiquarian-library",
          order: 50,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_necromancer",
          episodeId: "necromancer.e1",
          cluesFound: ["necromancer.e1.akai_shi_witness"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Through the throne. Ninety days inside the Matrix to be sure. He was gone. She does not lie — so the killing is real. Start there.",
            balanced:
              "The first statement is the arc's foundation: the strike was real, the body was real, the ninety-day vigil was real. Akai Shi is a witness who cannot be dishonest, and the Antiquarian canonizes her without softening. Whatever else the case finds, the death — in its moment — took.",
            warm:
              "She killed him and then waited ninety days to be certain, which is not cruelty; it is the discipline of a witness who refuses to be wrong. The archive keeps her words exactly. We do not get to wish the killing away. We have to build the rest of the case on it being true.",
          },
          voId: "human.antiquarian-library.akai-shi-witness-statements.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You pull the second statement filed behind the first. Akai Shi gave it after reviewing the Cathedral evidence — and she does not retract. 'I struck what was in front of me. I struck the right body. The body died. The work was correct.' She does not contest the Protocol 42 reading. The Antiquarian records one more sentence she added, verbatim, because the room does not paraphrase a witness who does not lie: 'If he wishes to be killed again, he knows how to be where I can strike him.' The two statements are filed together because the second stands beside the first, not over it.",
          fragmented:
            "I struck the right body. The right body. The body died. The work was correct. Correct. She does not retract. Does not retract. He knows how to be where I can strike him. Where I can strike him.",
          luminous:
            "The second statement, set beside the first in the Antiquarian's hand: not a correction, a continuation. She reviewed the Cathedral, she did not contest Protocol 42, and she did not take back one word. 'I struck the right body. The body died. The work was correct.' The archive isolates the last sentence as doctrine, not threat: 'If he wishes to be killed again, he knows how to be where I can strike him.' The Red Death's discipline is to kill what asks to be killed — and to say, exactly, that the offer stands.",
        },
        voId: "elara.antiquarian-library.akai-shi-witness-statements.use",
        logsClue: {
          id: "clue-antiquarian-akai-shi-second-witness",
          title: "Akai Shi's Second Witness Statement",
          body:
            "Given after Akai Shi reviewed the Cathedral evidence. She does not retract the first statement: 'I struck what was in front of me. I struck the right body. The body died. The work was correct.' She does not contest the Protocol 42 reading. She adds one sentence: 'If he wishes to be killed again, he knows how to be where I can strike him.' The Red Death does not lie and does not regret the killing.",
          source: "antiquarian-library",
          order: 51,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_necromancer",
          episodeId: "necromancer.e3",
          cluesFound: ["necromancer.e3.akai_shis_second_witness"],
        },
        humanReaction: {
          narration: {
            shadow:
              "She reviewed everything and retracted nothing. Right body. Body died. Work correct. And the offer stands — he knows how to be where she can strike him.",
            balanced:
              "The second statement is doctrinally precise: she does not contest the survival and she does not regret the killing. Both can be true at once, and she says so. The last sentence is not a boast — it is the Red Death stating that the offer to be killed again is permanently open.",
            warm:
              "She does not unsay a word, and she does not gloat. 'I struck the right body. The body died. The work was correct.' And then, almost gently, that he knows where to find her if he ever wants it again. The archive keeps both statements together because the truth needs both of them.",
          },
          voId: "human.antiquarian-library.akai-shi-witness-statements.use",
        },
      },
      talk: {
        narration:
          "You address the chronicle on the matter of the two statements held side by side. The Antiquarian's discipline does not let you collapse them into one. The first is that the killing took. The second is that the killing was correct and is not regretted, even knowing the Necromancer returned. The archive does not resolve the tension between them, because there is no tension: a death can be real, correct, and later escaped, all at once. The room files the witness exactly and lets the contradiction that is not a contradiction stand.",
        voId: "elara.antiquarian-library.akai-shi-witness-statements.talk",
      },
    },
    // Necromancer arc: the case-synthesis shelf is where the
    // Antiquarian assembles a closed case and, by discipline,
    // declines to pre-judge a closure the player must author.
    // The Two Witnesses put the arc's genuine dual-reading
    // question here — both readings honest, neither pressed.
    "necromancer-case-closing-ledger": {
      look: {
        narration: {
          lucid:
            "A closing ledger on the case-synthesis shelf, the Necromancer arc assembled in one hand. E1 through E4 reconciled: Akai Shi's killing was real; Protocol 42 — the Necromancer's own pre-authored mechanism — was the escape; the Silence's vacated body was the vehicle; Varkul's unbroken vigil is the witness; the Architect's silence is the consent; the conditional boundary is the Empire's institutional shape held unchanged. The Necromancer is canonically alive, operating quietly. The canon is now structurally stable. The verdict page is left blank, and the blankness is deliberate.",
          fragmented:
            "The killing was real. Protocol Forty-Two. The vacated body. The vacated body. Varkul's vigil. The silence is consent. Structurally stable. Stable. The verdict page. Blank. Blank. Deliberate.",
          luminous:
            "The synthesis ledger: four episodes reconciled into one structurally complete case, and a final page the Antiquarian left blank on purpose. The killing took; the escape came later, by the Necromancer's own protocol, into a body the Silence had vacated; the Architect's silence is consent because the roster's leader cannot fail to notice an A11 continuity event. Both canons are true. The completeness and the blankness are both intentional — the archive closes the structure and reserves the closure for the only reader entitled to it.",
        },
        voId: "elara.antiquarian-library.necromancer-case-closing-ledger.look",
        logsClue: {
          id: "clue-antiquarian-necromancer-synthesis",
          title: "The Case Synthesis",
          body:
            "E1-E4 assembled: Akai Shi's killing was real; Protocol 42 was the escape mechanism; the Silence's vacated body was the vehicle; Varkul's vigil is the witness; the Architect's silence is the consent; the conditional boundary is the Empire's institutional shape held unchanged. The Necromancer is canonically alive, operating quietly. The canon is now structurally stable. The verdict is deliberately left open.",
          source: "antiquarian-library",
          order: 52,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_necromancer",
          episodeId: "necromancer.e5",
          cluesFound: ["necromancer.e5.synthesis"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Whole case in one hand: real killing, Protocol 42, vacated body, Varkul's vigil, the Architect's silent consent. Both canons true. Verdict left blank.",
            balanced:
              "The synthesis reconciles E1 through E4 and then stops short of judgment on purpose. The death took and the escape came later, by his own mechanism — both canons hold. Structurally complete, deliberately unclosed. The Antiquarian sets the structure and reserves the closure for us.",
            warm:
              "He assembled the entire case and set the pen down exactly where a keeper must — before the verdict. The death was real; the return was his own arrangement; nothing here is a contradiction. The last page is not missing. It is reserved. For us.",
          },
          voId: "human.antiquarian-library.necromancer-case-closing-ledger.look",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the ledger on the closure itself. The Two Witnesses — the Programmer-Antiquarian and the Enigma — put the genuine question, and the ledger records whichever you offer. Is the Necromancer's continuity (a) a death that did not take — a defeat structurally undone, the throne never permanently empty, one line with a brief interruption — or (b) a death that took and was followed by a separate, distinct act of choosing to return — two lines connected by a decision, consistent with Protocol 42, which does not force return but permits it when the soul asks? The two readings are operationally identical and narratively very different. Both are honest. The Witnesses do not press the answer; they record whichever the player offers, and they keep open the option to file no reading at all.",
          fragmented:
            "A death that did not take. A death that took and chose return. Both. Both. Operationally identical. Narratively different. The Witnesses do not press. Do not press. Whichever you offer. Or none. Or none.",
          luminous:
            "The closing question, asked in the Two Witnesses' hand: a defeat undone, or a death followed by a chosen return — two readings of one structurally complete case, each true to every finding, neither the ledger's own. Protocol 42 is consistent with both: it does not force return; it permits return when the soul asks. The archive records what the player offers and pre-judges nothing — and, like Akai Shi and the Antiquarian themselves, it will hold both at once if the player declines to choose. The case does not need the player to resolve it. It needs the player to decide what the saga's record should now hold.",
        },
        voId: "elara.antiquarian-library.necromancer-case-closing-ledger.talk",
        logsClue: {
          id: "clue-antiquarian-necromancer-the-question",
          title: "The Question the Case Asks the Player",
          body:
            "The Two Witnesses (Programmer-Antiquarian + Enigma) put the closure: is the Necromancer's continuity (a) a death that did not take — a defeat structurally undone — or (b) a death that took and was followed by a separate, distinct act of choosing to return? The two readings are operationally identical and narratively very different. Both are honest; Protocol 42 is consistent with each. The Witnesses do not press the answer; they record whichever the player offers, or none — the canon can hold both, the way Akai Shi and the Antiquarian do.",
          source: "antiquarian-library",
          order: 53,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_necromancer",
          episodeId: "necromancer.e5",
          cluesFound: ["necromancer.e5.the_question_the_player_asks"],
        },
        humanReaction: {
          narration: {
            shadow:
              "A defeat undone, or a death he chose to come back from. Operationally the same, a different story. Both honest. The Witnesses record yours — or none.",
            balanced:
              "The verdict is the player's, between two readings the evidence equally supports — a single interrupted line, or two lines joined by a decision. Protocol 42 fits either. The ledger advances neither, and offers the third honest option: file no closure and let the canon hold both.",
            warm:
              "Both readings are true to everything we found, and the room refuses to choose for us — including the option not to choose at all. He died and he is here; whether that is one story or two is the thing we get to decide, or honestly decline to. We carry whichever we offer.",
          },
          voId: "human.antiquarian-library.necromancer-case-closing-ledger.talk",
        },
      },
    },
    // Zyr'Koth arc: the archive indexes by who witnessed a thing,
    // and the sisters-of-the-Weave canon is a witness record with
    // a name struck from it. The Antiquarian holds the third-
    // student slot open by discipline — he records the match of
    // USE without asserting the match of IDENTITY, because the
    // gap is a deliberately-preserved canon-gap and forcing it
    // would be a worse error than holding it. This is also where
    // the arc's structural synthesis and its closing question are
    // kept.
    "zyr-koth-sisters-and-closing-ledger": {
      look: {
        narration: {
          lucid:
            "Cross-catalogued from the syl_vex arc's sisters-of-the-Weave canon, indexed under a glyph the Antiquarian reserves for a record with a name removed from it: three students learned the Blood Weave from one pre-Severance instructor — the Advocate, Syl'Vex, and a third whose name was struck from the Hierarchy's record. The struck line reads only that 'the third chose the use neither of them did.' Zyr'Koth's Severance is precisely the use neither the Advocate nor Syl'Vex chose. The archive records the match of USE. It does not record a match of IDENTITY. The Antiquarian, whose whole discipline is the precision of attribution, does not write into a slot the canon struck on purpose. He files the convergence and leaves the name where the Hierarchy left it: absent, and deliberately so.",
          fragmented:
            "Three students. Three. A name struck. Struck. The use neither of them did. Neither of them. Zyr'Koth's use is that use. The match of use. Not identity. Not identity. The slot stays open. Stays open.",
          luminous:
            "The sisters-of-the-Weave record, read as the archive reads any witness with a name removed: three students, one struck from the line, the struck one marked only by a choice — 'the use neither of them did.' The Severance is that use. The Antiquarian records the convergence of the choice and declines, by discipline, to fill the struck name from it. The room is exact about the difference between a match of use and a match of identity. The canon-gap is preserved on purpose; the archive's finest instrument is the one that knows when not to write. The slot stays recognizable and stays empty.",
        },
        voId: "elara.antiquarian-library.zyr-koth-sisters-and-closing-ledger.look",
        logsClue: {
          id: "clue-antiquarian-zk-third-student",
          title: "Cross: The Third Student",
          body:
            "From the syl_vex arc's sisters-of-the-Weave canon: three students learned the Blood Weave from one pre-Severance instructor — the Advocate, Syl'Vex, and a third whose name was struck from the Hierarchy's record ('the third chose the use neither of them did'). Zyr'Koth's Severance is the use neither the Advocate nor Syl'Vex chose. The arc does not assert Zyr'Koth IS the third student — but it records that the third student's described choice and Zyr'Koth's refinement are the same use, and leaves the identity slot open.",
          source: "antiquarian-library",
          order: 54,
        },
        mysteryBinding: {
          mysteryId: "mystery.zyr_koth",
          episodeId: "zyr_koth.e4",
          cluesFound: ["zyr_koth.e4.sisters_of_the_weave_cross"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Three students, one struck from the record. The struck one chose the use neither did. That use is the Severance. Same use. Not the same name.",
            balanced:
              "The archive records the match of use and refuses to fill the struck name from it. The Antiquarian's whole discipline is attribution, and the discipline here is restraint — the canon-gap is preserved on purpose. He files the convergence and leaves the slot where the Hierarchy left it: empty, recognizably so.",
            warm:
              "It would be so easy to say it is him. The room will not, and that refusal is the point. The third name was struck on purpose, and the most honest thing the archive can do is keep the silence shaped exactly as it found it. The use matches. The name is not ours to write in.",
          },
          voId: "human.antiquarian-library.zyr-koth-sisters-and-closing-ledger.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You pull the case-synthesis ledger filed behind the sisters record. The Antiquarian assembles E1 through E4 in one hand: Zyr'Koth inverted the Advocate's defensive Weave into the Severance Protocol, the Blood Weave's third use; it relocates all cost onto the target; it hollows rather than weakens; it is the only tested instrument that can reverse a Syl'Vex conversion; Mol'Garath's contract clause locks it; the Advocate cannot perceive it; Zyr'Koth has filed that he has no position on whether it is ever used. The ledger marks the case structurally complete. It marks the verdict not complete. It does not supply one. The page where the judgment would go is blank, and the Antiquarian's hand stopped exactly at its edge — a keeper does not keep the verdict on the keeper of the Severance.",
          fragmented:
            "E1 to E4. One hand. One hand. The third use. Cost relocated. Hollows not weakens. The only reversal. The lock. He cannot be perceived. No position. Structurally complete. The verdict is not. The verdict is not. Blank. Blank.",
          luminous:
            "The synthesis ledger: five findings reconciled into one structurally complete case — third use, cost relocated, hollowing not weakening, the only reversal, locked by a clause, unperceived by its source, owned by no position. The completeness and the blank verdict-page are both deliberate. The archive closes the structure and reserves the closure. It does not pre-decide the judgment on an instrument this exact; the discipline is to set the pen down at the edge of it and leave the last page for the only reader entitled to write there.",
        },
        voId: "elara.antiquarian-library.zyr-koth-sisters-and-closing-ledger.use",
        logsClue: {
          id: "clue-antiquarian-zk-synthesis",
          title: "The Case Synthesis",
          body:
            "E1-E4 assembled: Zyr'Koth inverted the Advocate's defensive Weave into the Severance Protocol (third use); it relocates all cost onto the target; it hollows rather than weakens; it is the only tested instrument that can reverse a Syl'Vex conversion; Mol'Garath's contract clause locks it; the Advocate cannot perceive it; Zyr'Koth has filed that he has no position on whether it is ever used. The case is structurally complete.",
          source: "antiquarian-library",
          order: 55,
        },
        mysteryBinding: {
          mysteryId: "mystery.zyr_koth",
          episodeId: "zyr_koth.e5",
          cluesFound: ["zyr_koth.e5.synthesis"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Whole case in one hand: third use, cost relocated, hollows not weakens, the only reversal, locked, unperceived, no position. Complete in structure. Verdict blank.",
            balanced:
              "The synthesis reconciles every finding and then stops short of judgment on purpose. Structurally complete, deliberately unclosed — the archive sets the structure and reserves the closure. It does not pre-decide a verdict on an instrument this exact, and neither should we until the question is put.",
            warm:
              "He assembled the entire terrible case and set the pen down right at the edge of the verdict, where a keeper must. The last page is not missing. It is reserved — for the only reader allowed to write there. Which the case is about to tell us is us.",
          },
          voId: "human.antiquarian-library.zyr-koth-sisters-and-closing-ledger.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the ledger on the closure itself. The Two Witnesses put the question, and the file records whichever you offer. Is the Severance Protocol (a) AN ATROCITY — a free-to-wield hollowing instrument is an atrocity by existing, regardless of the lock, and the maker's no-position is its final form; (b) A DETERRENT — its existence-plus-lock is the only thing that makes Syl'Vex's conversion not a one-way door, and a locked weapon that restores the possibility of agency is, weighed against a door that forecloses it, the lesser unfreedom; or (c) JUST R&D — Zyr'Koth's filed indifference is, terribly, the accurate description; the instrument has no moral valence, only its use does, and that use has not been decided. All three are honest closures of the same structurally complete case. The ledger advances none of them. Zyr'Koth, who has no position on his own instrument, does not get the only position the case withholds from everyone equally — and neither does the archive.",
          fragmented:
            "Atrocity. Deterrent. Just R&D. Atrocity. Deterrent. Just R&D. All three honest. All three. The ledger advances none. None. He gets no position. No one does. Not the archive either.",
          luminous:
            "The closing question, asked in the Two Witnesses' hand: atrocity, deterrent, or just R&D — three readings of one structurally complete case, each true to every finding, none of them the ledger's own. An instrument whose only cost is the target's; or the single thing that makes a conversion reversible; or a valence-less iteration awaiting a decision no one has made. The archive records what the player offers and pre-judges nothing. The keeper who would not keep a position on his own weapon does not get this one either, and neither does the room that holds the case — the verdict belongs only to the reader the question is put to.",
        },
        voId: "elara.antiquarian-library.zyr-koth-sisters-and-closing-ledger.talk",
        logsClue: {
          id: "clue-antiquarian-zk-the-question",
          title: "The Question the Case Asks the Player",
          body:
            "The Two Witnesses put the closure: is the Severance Protocol (a) AN ATROCITY — a free-to-wield hollowing instrument that exists at all is the atrocity, regardless of the lock; (b) A DETERRENT — its existence-plus-lock is the only thing that makes Syl'Vex's conversion not a one-way door, and a locked weapon that restores agency is, on balance, a freedom; or (c) JUST R&D — Zyr'Koth's indifference is the truth of it; the instrument has no moral valence, only the decision to use it does, and that decision has not been made. The Witnesses record whichever the player offers; none is pre-judged.",
          source: "antiquarian-library",
          order: 56,
        },
        mysteryBinding: {
          mysteryId: "mystery.zyr_koth",
          episodeId: "zyr_koth.e5",
          cluesFound: ["zyr_koth.e5.the_question"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Atrocity, deterrent, or just R&D. Three honest closures of one complete case. The Witnesses record yours. None is pre-judged.",
            balanced:
              "The verdict is the player's, between three readings the evidence equally supports — an atrocity by existing, the only thing that makes conversion reversible, or a valence-less iteration awaiting a decision unmade. The ledger advances none and the maker gets no vote. The case declines to resolve itself into comfort.",
            warm:
              "All three are true to what we found, and the room refuses to choose for us — the condemnation, the grim defense, and the cold non-answer all stand. The man who would hold no position on his own weapon does not get to pass this to us pre-decided. We carry whichever we offer, honestly, including the one that leaves the horror open.",
          },
          voId: "human.antiquarian-library.zyr-koth-sisters-and-closing-ledger.talk",
        },
      },
    },
    // Syl'Vex arc: the archive indexes by who witnessed a thing,
    // and the Blood Weave's pedigree is a witness record with one
    // instructor's name lost and one student's name struck. The
    // Antiquarian files the shared-teacher provenance the way he
    // files any disputed attribution — precisely, and only as far
    // as the record permits. The third-student slot is the same
    // deliberately-preserved canon-gap the Zyr'Koth cross-catalogue
    // already declines to fill; this hotspot holds it open by the
    // same discipline, recording the convergence of USE without
    // ever asserting the convergence of IDENTITY.
    "syl-vex-sisters-of-the-weave": {
      look: {
        narration: {
          lucid:
            "Cross-referenced against the pre-Severance Thaloria archive and indexed under the Antiquarian's glyph for a lineage with a name worn off it: the Blood Weave was taught by a single instructor in the era before the Severance. That instructor's name is canonically lost — not struck, not redacted, simply not preserved by the people who should have preserved it. Three named students survive in the record: the Advocate, Syl'Vex, and a third whose name was struck from the Hierarchy's record. The archive holds the load-bearing fact plainly: the Advocate and Syl'Vex learned the same instrument from the same teacher. They are not metaphor-sisters. They are sisters of the loom — same lesson, divergent intent, one defends and one converts. The room files the provenance exactly, because a shared origin read as a generic Hierarchy-versus-Insurgency rivalry is the most expensive misfiling the case could make.",
          fragmented:
            "One instructor. One. The name lost. Not struck — lost. Three students. The Advocate. Syl'Vex. A third. A third. Same teacher. Same loom. One defends. One converts. Sisters of the loom. Sisters.",
          luminous:
            "The pedigree, read as the archive reads a lineage with the founder's name worn off: one pre-Severance instructor, name unpreserved rather than removed; three students, one of whom the Hierarchy struck. The room marks the structural register and refuses the cheap one — the Advocate and Syl'Vex are sisters of the Weave because they learned one instrument from one hand, then chose opposite uses of it. The relationship is instrumental, not familial, and load-bearing precisely there. Every later canonical contact between them — a negotiated severance, a joint defense, a confrontation — must be read in the sister-of-the-loom register the archive files here, not flattened into a faction map.",
        },
        voId: "elara.antiquarian-library.syl-vex-sisters-of-the-weave.look",
        logsClue: {
          id: "clue-antiquarian-sv-shared-teacher",
          title: "The Shared Teacher",
          body:
            "Cross-referenced against the Antiquarian's pre-Severance Thaloria archive: the Blood Weave was taught by a single instructor in the era before the Severance. The instructor's name is canonically lost. Three named students survive in the record: the Advocate, Syl'Vex, and a third whose name was struck from the Hierarchy's record. The Advocate and Syl'Vex learned the same instrument from the same teacher — sisters of the Weave instrumentally, not familially: same lesson, divergent intent.",
          source: "antiquarian-library",
          order: 57,
        },
        mysteryBinding: {
          mysteryId: "mystery.syl_vex",
          episodeId: "syl_vex.e4",
          cluesFound: ["syl_vex.e4.shared_teacher"],
        },
        humanReaction: {
          narration: {
            shadow:
              "One teacher, name lost. Three students — Advocate, Syl'Vex, a third struck out. Same loom. One defends, one converts. Sisters instrumentally, not by blood.",
            balanced:
              "The archive files the provenance exactly: a single pre-Severance instructor whose name was not preserved, three students, one removed by the Hierarchy. The Advocate and Syl'Vex share the loom, not a bloodline. The room refuses the faction-map reading because a shared origin misfiled as a rivalry is the costliest error the case could make.",
            warm:
              "They were taught by the same person, whose name no one bothered to keep. That is the part that stays with me — not the rivalry, the shared classroom no one wrote down. The room will not let me turn that into a simple two-sides story, and it is right not to. Same hand taught them both; they only chose differently.",
          },
          voId: "human.antiquarian-library.syl-vex-sisters-of-the-weave.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You pull the marginalia-leaf the Antiquarian keeps clipped behind the pedigree, filed under the same glyph he uses for a record with a name removed on purpose. The third student's name was struck from the Hierarchy's record in the Severance year. The leaf carries one preserved line and nothing more: 'the third chose the use neither of them did.' What that use was is canonically unknown. Whether the third still exists is canonically unknown. The room is exact about the shape of the gap: the Severance is, in the saga's record, a use neither the Advocate nor Syl'Vex chose — but the archive records that convergence of USE without writing it into a convergence of IDENTITY. The Antiquarian, whose whole discipline is the precision of attribution, does not fill a slot the canon struck deliberately. He keeps it recognizable so it can be filled the day canon permits, and not one day before.",
          fragmented:
            "The third. The name struck. Struck in the Severance year. One line. One line. The use neither of them did. Neither of them. Use, not identity. Use, not identity. The slot stays open. The slot stays open.",
          luminous:
            "The marginalia-leaf, read as the archive reads a name removed on purpose: the third student struck from the record the Severance year, marked only by a choice — 'the use neither of them did.' The room sets the Severance beside it as the use neither the Advocate nor Syl'Vex took, and stops there with deliberate exactness. A match of use is not a match of name. The Antiquarian's finest instrument is the one that knows when not to write; he files the convergence and leaves the identity where the Hierarchy left it — struck, recognizable, and reserved for the day the canon, not the case, supplies the name.",
        },
        voId: "elara.antiquarian-library.syl-vex-sisters-of-the-weave.use",
        logsClue: {
          id: "clue-antiquarian-sv-third-student",
          title: "The Third Student, Struck from the Record",
          body:
            "The third Blood Weave student's name was struck from the Hierarchy's record in the Severance year. The Antiquarian holds a marginalia-only reference: 'the third chose the use neither of them did.' The third's choice is canonically unknown; whether the third still exists is canonically unknown. The Severance is the use neither the Advocate nor Syl'Vex chose — but the archive records the match of USE only, not a match of IDENTITY, and holds the struck-name slot deliberately open.",
          source: "antiquarian-library",
          order: 58,
        },
        mysteryBinding: {
          mysteryId: "mystery.syl_vex",
          episodeId: "syl_vex.e4",
          cluesFound: ["syl_vex.e4.third_student"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Third name struck the Severance year. One line survives: 'chose the use neither of them did.' The Severance is that use. Match of use. Not the name. Slot stays open.",
            balanced:
              "The archive sets the Severance beside the struck line as the use neither sister took, then stops exactly there. A match of use is not a match of identity. The Antiquarian files the convergence and refuses to write the name into a slot the canon struck on purpose — recognizable, reserved, not the case's to fill.",
            warm:
              "It would be so easy to say the third is the one who severs. The room will not, and that restraint is the discipline. The name was struck deliberately; the most honest thing the archive can do is keep the silence the exact shape it found it. The use lines up. The name is not ours to write in.",
          },
          voId: "human.antiquarian-library.syl-vex-sisters-of-the-weave.use",
        },
      },
    },
    // Riri'Ahlia arc: the archive's closing ledger for the
    // Taskmaster. The Antiquarian assembles the case the way he
    // assembles any Hierarchy-portfolio record — by what is
    // filed, not by what is felt — and then sets the pen down at
    // the verdict, because the E5 closure is a genuine
    // tri-verdict (UNBEATABLE / BRITTLE / MIRROR) and a keeper
    // does not keep the judgment on the keeper of the org chart.
    "riri-ahlia-closing-ledger": {
      look: {
        narration: {
          lucid:
            "You pull the case-synthesis ledger filed under the Antiquarian's glyph for a portfolio entry that never closed — a blocker, never a defeat. He assembles E1 through E4 in one hand: the siege of seven dimensions was filed as a quarter, not a war; the Advocate's binding-chain victory cost her humanity and became the Hierarchy's priced data; Riri'Ahlia's true weapon is reorganization, not force; her silence is her most active state; her procedural question is a reorganization of the Necromancer's options. The ledger marks the case structurally complete and the verdict not. The Antiquarian's whole discipline is attribution; here the discipline is restraint. He files the convergence the way the Hierarchy filed the siege — as a line item with a remediation, never as a closed loss — and leaves the judgment-page blank, because the case is about a being who turns every closed file into next quarter's asset, and the one file she cannot reorganize is the one no keeper closes for her.",
          fragmented:
            "E1 to E4. One hand. One hand. A quarter, not a war. Priced data. Reorganization, not force. Silence is action. The question is a reorg. Structurally complete. The verdict is not. The verdict is not. Blank. Blank. The file no one closes for her.",
          luminous:
            "The synthesis ledger, read as the archive reads a portfolio entry that was never allowed to close: five findings reconciled into one structurally complete case — siege filed as a quarter, the Advocate's humanity priced into data, reorganization as the real weapon, silence as the operative state, the procedural question as a reorganization performed with a sentence. The completeness and the blank verdict-page are both deliberate. The Antiquarian closes the structure and reserves the closure, and he is exact about why this case in particular: a being whose defeats become remediations cannot be filed as defeated by the keeper. The last page is reserved for the only reader who can refuse her the closed file — and that is not the archive.",
        },
        voId: "elara.antiquarian-library.riri-ahlia-closing-ledger.look",
        logsClue: {
          id: "clue-antiquarian-ra-synthesis",
          title: "The Case Synthesis",
          body:
            "E1-E4 assembled: the siege of seven dimensions was filed as a quarter, not a war; the Advocate's binding-chain victory cost her humanity and became the Hierarchy's priced data; Riri'Ahlia's true weapon is reorganization, not force; her silence is her most active state; her procedural question is a reorganization of the Necromancer's options. The case is structurally complete.",
          source: "antiquarian-library",
          order: 59,
        },
        mysteryBinding: {
          mysteryId: "mystery.riri_ahlia",
          episodeId: "riri_ahlia.e5",
          cluesFound: ["riri_ahlia.e5.synthesis"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Whole case in one hand: a quarter not a war, priced humanity, reorganization not force, silence is action, the question is a reorg. Complete in structure. Verdict blank.",
            balanced:
              "The synthesis reconciles every finding and then stops short of judgment on purpose. Structurally complete, deliberately unclosed — the archive sets the structure and reserves the closure. It does not pre-decide a verdict on a being who turns closed files into assets, because the one file she cannot reorganize is the one no keeper closes for her.",
            warm:
              "He assembled the whole cold portfolio and set the pen down right at the verdict, where a keeper must. The last page is not missing. It is reserved — for the only reader who can deny her a closed file. Which the case is about to tell us is us.",
          },
          voId: "human.antiquarian-library.riri-ahlia-closing-ledger.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You address the ledger on the closure itself. The Two Witnesses put the question, and the file records whichever you offer. Is Riri'Ahlia (a) UNBEATABLE — a foe whose defeats become priced data and whose silence is the operation continuing cannot be beaten on her own terms; the Insurgency's only move is to make the game one where not-losing is the win condition, denying her the closed file forever, since an open blocker she rolls forward but a war that never ends she cannot reorganize into a quarter; (b) BRITTLE — a being whose entire power is the org chart has exactly one true dependency, an opponent who registers nowhere, files nothing, holds no position, and so cannot be reorganized because there is no entry to move; the Insurgency's refusal-doctrine is the precise counter, since you cannot reorganize what declined to be organized; or (c) MIRROR — the Taskmaster is what the resistance would become if it ever started winning by reorganization instead of by refusal, and the arc's real subject is the warning, filed as one rather than as a victory condition. All three are honest closures of the same structurally complete case. The ledger advances none of them. Riri'Ahlia, who reorganizes every position into her own, does not get the only position the case withholds from everyone equally — and neither does the archive.",
          fragmented:
            "Unbeatable. Brittle. Mirror. Unbeatable. Brittle. Mirror. All three honest. All three. The ledger advances none. None. She reorganizes every position. Not this one. Not this one. Not the archive either.",
          luminous:
            "The closing question, asked in the Two Witnesses' hand: unbeatable, brittle, or mirror — three readings of one structurally complete case, each true to every finding, none of them the ledger's own. A foe who must be outlasted because she cannot be defeated; or a total power that is also a total dependency, undone by an opponent who never registers; or the resistance's own possible future, the institution it would have to become to beat her and becoming which would be the defeat. The archive records what the player offers and pre-judges nothing. The being who reorganizes every position into the portfolio does not get this one, and neither does the room that holds the case — the verdict belongs only to the reader the question is put to.",
        },
        voId: "elara.antiquarian-library.riri-ahlia-closing-ledger.use",
        logsClue: {
          id: "clue-antiquarian-ra-the-question",
          title: "The Question the Case Asks the Player",
          body:
            "The Two Witnesses put the closure: is Riri'Ahlia (a) UNBEATABLE — a foe whose defeats become data and whose silence is action cannot be defeated, only outlasted; deny her the closed file forever; (b) BRITTLE — a being whose entire power is the org chart has one vulnerability: an opponent who refuses to be on any chart at all, who files nothing, who cannot be reorganized because they never registered; or (c) MIRROR — the Taskmaster is what the Insurgency would become if it ever won by reorganization instead of refusal, and the arc's real subject is the warning. The Witnesses record whichever the player offers; none is pre-judged.",
          source: "antiquarian-library",
          order: 60,
        },
        mysteryBinding: {
          mysteryId: "mystery.riri_ahlia",
          episodeId: "riri_ahlia.e5",
          cluesFound: ["riri_ahlia.e5.the_question"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Unbeatable, brittle, or mirror. Three honest closures of one complete case. The Witnesses record yours. None is pre-judged.",
            balanced:
              "The verdict is the player's, between three readings the evidence equally supports — outlast a foe who cannot be beaten, refuse to register against a power that is all dependency, or file the Taskmaster as the warning of what victory would cost. The ledger advances none and the being who reorganizes everything gets no vote.",
            warm:
              "All three are true to what we found, and the room refuses to choose for us — the unwinnable game, the one true counter, and the mirror that is its own defeat all stand. The being who turns every position into hers does not get to pass this to us pre-decided. We carry whichever we offer, honestly.",
          },
          voId: "human.antiquarian-library.riri-ahlia-closing-ledger.use",
        },
      },
    },
    // Fenra arc, E4: the antiquarian reads the door/engine pair as
    // a maker's two-instrument design — and the sharpest entry, the
    // signal Varkul receives and Fenra does not. Cross-consistent
    // with the Varkul vigil cross-catalogue and the necromancer
    // case-closing ledger already shelved here.
    "fenra-door-and-engine": {
      look: {
        narration: {
          lucid:
            "You pull a cross-catalogued folio filed under the Antiquarian's glyph for two works by one hand that were never meant to be read apart. He sets the Varkul vigil cross-catalogue beside it and reads the pair as one design. Varkul holds; Fenra moves. Varkul is the Necromancer's continuity, instrumented and still. Fenra is the Necromancer's reach, distributed and in motion. The Antiquarian's whole discipline is attribution, and here the attribution is the finding: a maker who produces a perfect door AND a perfect engine has built something that can both preserve itself indefinitely and extend itself indefinitely. He files the conclusion the way he files a confirmed hand — the Necromancer's two senior creations are not redundant. They are the two things any continuity needs: to last, and to spread.",
          fragmented:
            "Two works. One hand. Never read apart. Varkul holds. Fenra moves. Continuity and reach. Still and in motion. A door. An engine. Not redundant. Not redundant. To last. To spread. To last and to spread.",
          luminous:
            "The folio, read as the archive reads two works by a single hand that only make sense together: Varkul instrumented and still, Fenra distributed and moving — continuity and reach, the door and the engine. The Antiquarian is exact that this is attribution, not metaphor: one maker built both, and a maker who builds both a perfect door and a perfect engine has built a thing that can hold itself in place forever and carry itself outward forever in the same design. He files the completeness as the load-bearing fact — the two creations are not spares for each other. They are the two functions any continuity is made of.",
        },
        voId: "elara.antiquarian-library.fenra-door-and-engine.look",
        logsClue: {
          id: "clue-antiquarian-fenra-door-and-engine",
          title: "The Door and the Engine",
          body:
            "Read as a pair: Varkul holds; Fenra moves. Varkul is the Necromancer's continuity, instrumented and still. Fenra is the Necromancer's reach, distributed and in motion. A maker who produces a perfect door AND a perfect engine has built something that can both preserve itself indefinitely and extend itself indefinitely. The Necromancer's two senior creations are not redundant. They are the two things any continuity needs: to last, and to spread.",
          source: "antiquarian-library",
          order: 61,
        },
        mysteryBinding: {
          mysteryId: "mystery.fenra",
          episodeId: "fenra.e4",
          cluesFound: ["fenra.e4.door_and_engine"],
        },
        humanReaction: {
          narration: {
            shadow:
              "One maker, two works, never read apart. Varkul holds, Fenra moves. A door and an engine.",
            balanced:
              "The archive files it as attribution, not metaphor: a maker who builds both a perfect door and a perfect engine has built a continuity that can both last and spread. The two are not spares.",
            warm:
              "He sets the two files together because they were never one without the other. To last and to spread — the room names exactly what the Necromancer was building, and it is complete.",
          },
          voId: "human.antiquarian-library.fenra-door-and-engine.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You address the folio on the sharpest line in it. The Antiquarian turns to the entry he files under his glyph for an asymmetry the saga built on purpose: Varkul receives the maker's signal — his vigil is conditioned on the Necromancer's continuity. Fenra is not recorded as receiving any such signal. She serves the Hierarchy's operations, commended by Riri'Ahlia, integrated into Mol'Garath's portfolio. The keeper states the consequence without softening it: if the Necromancer ended, Varkul's vigil would lose its instruction — and Fenra's logistics would not even notice. The door depends on the maker. The engine does not. He files the two creations as a deliberate asymmetry — one a witness to the Necromancer's life, one indifferent to whether he exists — and notes, in the same hand, that together they are harder to end than either alone.",
          fragmented:
            "Varkul receives the signal. Fenra does not. Does not. Vigil conditioned on his continuity. Logistics conditioned on nothing. He ends — the door loses its instruction. The engine does not notice. Does not notice. The door depends. The engine does not. Harder to end than either alone.",
          luminous:
            "The entry, read as the archive reads an asymmetry it can prove was designed: Varkul receives the maker's signal and is conditioned on the Necromancer's continuity; Fenra receives no signal and is conditioned only on the Hierarchy. The Antiquarian is exact about the consequence and refuses to blunt it — end the Necromancer and the door loses its instruction while the engine does not break stride. One creation is a witness to him; the other is indifferent to whether he exists at all. The keeper files the pairing as the Necromancer's true insurance: not a protocol, but one creation that cannot leave and one that cannot stop, and together they are harder to end than either would be alone.",
        },
        voId: "elara.antiquarian-library.fenra-door-and-engine.use",
        logsClue: {
          id: "clue-antiquarian-fenra-no-signal",
          title: "Fenra Does Not Receive the Signal",
          body:
            "The arc's sharpest distinction: Varkul receives the maker's signal — his vigil is conditioned on the Necromancer's continuity. Fenra is not recorded as receiving any such signal. She serves the Hierarchy's operations, commended by Riri'Ahlia, integrated into Mol'Garath's portfolio. If the Necromancer ended, Varkul's vigil would lose its instruction — and Fenra's logistics would not even notice. The engine does not depend on the maker. The door does.",
          source: "antiquarian-library",
          order: 62,
        },
        mysteryBinding: {
          mysteryId: "mystery.fenra",
          episodeId: "fenra.e4",
          cluesFound: ["fenra.e4.fenra_does_not_receive_the_signal"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Varkul receives the maker's signal; Fenra does not. End the Necromancer and the door loses its instruction — the engine does not notice.",
            balanced:
              "The archive files it as a designed asymmetry: one creation a witness to his life, one indifferent to whether he exists. Together they are harder to end than either alone.",
            warm:
              "Varkul would feel it if the maker died. Fenra would not so much as look up. The room files that as the real insurance, and it is colder than any protocol.",
          },
          voId: "human.antiquarian-library.fenra-door-and-engine.use",
        },
      },
    },
    // Fenra arc, E5: the case-synthesis ledger and the genuine
    // tri-verdict closing question. The synthesis assembles E1-E4;
    // the question holds THE EFFICIENT EVIL / THE SINGLE POINT OF
    // FAILURE / THE INDIFFERENT ENGINE all honest, pre-judges none,
    // and closes the §XVI 14-bible Mystery Engine roster.
    "fenra-closing-ledger": {
      look: {
        narration: {
          lucid:
            "You pull the case-synthesis ledger filed under the Antiquarian's glyph for an engine that does not stop. He assembles E1 through E4 in one hand: Fenra fed seventeen simultaneous fronts from one logistics architecture; the Cursed Forest is a soul-throughput depot dying under its own load; her growl surfaces during the bookkeeping, proving Hierarchy predation and administration are one operation; she is the Necromancer's engine — spreads his reach — opposite Varkul's door, which proves his life, and the engine does not depend on the maker. The keeper marks the case structurally complete and the verdict not. His discipline is attribution; here the discipline is restraint, and he notes the parallel without comment — restraint is also her register. He files the convergence and leaves the judgment-page blank, because this is the entry that closes the §XVI roster, and the last page of the last case is not the archive's to write.",
          fragmented:
            "E1 to E4. One hand. One hand. Seventeen fronts, one kitchen. A depot dying under its load. The growl on the bookkeeping. The engine, not the door. Does not depend on the maker. Structurally complete. The verdict is not. The verdict is not. Blank. Blank. The last case. The last page.",
          luminous:
            "The synthesis ledger, read as the archive reads the final entry in a roster it has carried to the end: four findings reconciled into one structurally complete case — one kitchen for seventeen fronts, a depot consumed by its own throughput, the growl that lands on the ledger and not the kill, the engine that carries the maker's reach without needing the maker. The completeness and the blank verdict-page are both deliberate. The Antiquarian closes the structure and reserves the closure, and he is exact that this case in particular earns the restraint: it is the §XVI roster's last portrait, and a roster does not close itself. The last page is reserved for the only reader who can close it — and that is not the archive.",
        },
        voId: "elara.antiquarian-library.fenra-closing-ledger.look",
        logsClue: {
          id: "clue-antiquarian-fenra-synthesis",
          title: "The Case Synthesis",
          body:
            "E1-E4 assembled: Fenra fed seventeen simultaneous fronts from one logistics architecture; the Cursed Forest is a soul-throughput depot dying under its own load; her growl surfaces during the bookkeeping, proving Hierarchy predation and administration are one operation; she is the Necromancer's engine (spreads his reach) opposite Varkul's door (proves his life), and the engine does not depend on the maker. The case is structurally complete.",
          source: "antiquarian-library",
          order: 63,
        },
        mysteryBinding: {
          mysteryId: "mystery.fenra",
          episodeId: "fenra.e5",
          cluesFound: ["fenra.e5.synthesis"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Whole case in one hand: one kitchen for seventeen fronts, a depot dying under load, the growl on the books, the engine that does not need the maker. Complete in structure. Verdict blank.",
            balanced:
              "The synthesis reconciles every finding and stops short of judgment on purpose. It is the §XVI roster's last entry, and the archive sets the structure and reserves the closure — the last page of the last case is not its to write.",
            warm:
              "He assembled the whole cold case and set the pen down at the verdict. The last page of the last file is not missing. It is reserved — for us, because a roster does not close itself.",
          },
          voId: "human.antiquarian-library.fenra-closing-ledger.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You address the ledger on the closure itself. The Two Witnesses put the question, and the file records whichever you offer — and the keeper is scrupulous that all three are honest closures of the same structurally complete case. Is Fenra (a) THE EFFICIENT EVIL — the saga's cleanest statement that competence in service of conquest is not mitigated by the competence; she ran seventeen invasions flawlessly and the flawlessness is not a mitigating detail, it is the indictment in full, and 'Hunted. Logged. Owned.' is the most honest description of what good logistics pointed at people produces; (b) THE SINGLE POINT OF FAILURE — the Hierarchy's whole expansion runs through one dying depot and one wolf, and the arc's operational verdict is a target: the Cursed Forest, before it collapses on schedule anyway, is where the seventeen fronts can be starved at once; or (c) THE INDIFFERENT ENGINE — the coldest reading, that Fenra would run exactly the same whether the Necromancer, the Hierarchy, or anyone at all still wanted the hunt, because the engine has become its own reason, and an engine that no longer needs a driver cannot be stopped by removing one. The Antiquarian advances none of them and pre-judges none. This is the last case of the §XVI roster; the engine that asks for no driver does not get the keeper as one either.",
          fragmented:
            "Efficient evil. Single point of failure. Indifferent engine. All three honest. All three. The flawlessness is the indictment. The Forest is the target. The engine is its own reason. The ledger advances none. None. The last case. No driver. Not the keeper either.",
          luminous:
            "The closing question, asked in the Two Witnesses' hand and held open with care: the efficient evil, the single point of failure, the indifferent engine — three readings of one structurally complete case, each true to every finding, none of them the ledger's own. The flawless logistics that are themselves the atrocity; the one dying kitchen that is the Hierarchy's only fatal concentration; or the machine that has become its own reason and cannot be stopped by removing a driver it no longer has. The archive records what the reader offers and pre-judges nothing — and the keeper marks the weight of this one: it closes the §XVI roster, and the last verdict of the last case belongs to the reader the question is put to, not to the room that carried it here.",
        },
        voId: "elara.antiquarian-library.fenra-closing-ledger.use",
        logsClue: {
          id: "clue-antiquarian-fenra-the-question",
          title: "The Question the Case Asks the Player",
          body:
            "The Two Witnesses put the closure: is Fenra (a) THE EFFICIENT EVIL — the flawless logistics ARE the atrocity, competence does not mitigate conquest; (b) THE SINGLE POINT OF FAILURE — the whole expansion runs through one dying depot and one wolf, a vulnerability the Insurgency must exploit before the Forest collapses on its own; or (c) THE INDIFFERENT ENGINE — Fenra would run the same whether the Necromancer, the Hierarchy, or anyone wanted the hunt, because the engine has become its own reason and cannot be stopped by removing a driver. All three are honest; the Witnesses record whichever the player offers; none is pre-judged. This closes the §XVI 14-bible Mystery Engine roster.",
          source: "antiquarian-library",
          order: 64,
        },
        mysteryBinding: {
          mysteryId: "mystery.fenra",
          episodeId: "fenra.e5",
          cluesFound: ["fenra.e5.the_question"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Efficient evil, single point of failure, or indifferent engine. Three honest closures of one complete case. The Witnesses record yours. None pre-judged.",
            balanced:
              "The verdict is the player's, between three readings the evidence equally supports — the flawlessness as the indictment, the dying kitchen as the target, or the engine that needs no driver. The ledger advances none, and this closes the §XVI roster.",
            warm:
              "All three are true to what we found, and the room refuses to choose for us on the last case of the whole roster. The indictment, the target, and the machine that needs no one all stand. We carry whichever we offer, honestly — and then the roster is closed.",
          },
          voId: "human.antiquarian-library.fenra-closing-ledger.use",
        },
      },
    },
  },
};
