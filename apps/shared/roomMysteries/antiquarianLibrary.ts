/* ═══════════════════════════════════════════════════════
   ANTIQUARIAN LIBRARY MYSTERY — card-catalog, vault, bust

   Three-hotspot module for the deck-8 specialist library.
   Sets antiquarian_seen on first-look at the card-catalog.
   Universal room.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type AntiquarianLibraryHotspotId =
  | "card-catalog"
  | "locked-vault"
  | "antiquarian-bust"
  | "hierophants-marginalia-stack"
  | "codas-purpose-shelf"
  | "velkraals-correspondence-folio"
  | "insurgency-witness-roster"
  | "ocularum-founding-record"
  | "antiquarian-redaction-ledger";

export const ANTIQUARIAN_LIBRARY_MYSTERY: RoomMysteryModule<AntiquarianLibraryHotspotId> = {
  roomId: "antiquarian-library",
  responses: {
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
          mysteryId: "mystery.watcher",
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
          mysteryId: "mystery.watcher",
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
          mysteryId: "mystery.watcher",
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
          mysteryId: "mystery.watcher",
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
          mysteryId: "mystery.watcher",
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
          mysteryId: "mystery.watcher",
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
  },
};
