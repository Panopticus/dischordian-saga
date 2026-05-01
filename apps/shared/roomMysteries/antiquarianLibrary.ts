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
    },
  },
};
