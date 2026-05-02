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
  | "antiquarian-bust";

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
          ],
        },
      },
    },
  },
};
