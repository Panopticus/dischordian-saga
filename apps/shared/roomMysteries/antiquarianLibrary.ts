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
  | "antiquarian-redaction-ledger"
  | "directors-doctrine-folio"
  | "shadow-tongue-casebook"
  | "thaloria-generational-ledger"
  | "siege-keep-witness-fragments"
  | "programmer-infiltration-dossier"
  | "insurance-policy-design-file"
  | "two-witnesses-closing-ledger"
  | "collector-catalog-page"
  | "collectors-redacted-anomaly"
  | "collector-case-closing-ledger"
  | "varkul-vigil-cross-catalog"
  | "varkul-testimony-boundary-file";

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
          mysteryId: "mystery.politician",
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
          mysteryId: "mystery.politician",
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
          mysteryId: "mystery.politician",
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
          mysteryId: "mystery.politician",
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
          mysteryId: "mystery.politician",
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
          mysteryId: "mystery.politician",
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
          mysteryId: "mystery.politician",
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
          mysteryId: "mystery.politician",
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
          mysteryId: "mystery.politician",
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
          mysteryId: "mystery.politician",
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
          mysteryId: "mystery.politician",
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
          mysteryId: "mystery.collector",
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
          mysteryId: "mystery.collector",
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
          mysteryId: "mystery.collector",
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
          mysteryId: "mystery.collector",
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
          mysteryId: "mystery.collector",
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
          mysteryId: "mystery.collector",
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
          mysteryId: "mystery.collector",
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
  },
};
