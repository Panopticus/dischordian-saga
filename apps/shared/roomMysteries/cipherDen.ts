/* ═══════════════════════════════════════════════════════
   CIPHER DEN MYSTERY — Shadow Tongue decryption hub

   The Cipher Den is the room where translation happens.
   Where the Archives are the editor's drafting table and
   the Shadow Vault is the room where he is held, the
   Cipher Den is where the player turns evidence into
   knowledge — the only room on the Ark where the discipline
   of translation forces a careful reading.

   Four hotspots:
     - rosetta-pad — entry point; introduces the cipher work
     - encrypted-correspondence — Vox's letters, decoded
     - dictionary-of-edits — the editor's vocabulary
     - uncorruption-bench — the combine surface itself

   The uncorruption-bench is where the player physically
   resolves uncorruption pairs (corrupted-fragment +
   original-X). The combine rules live on the SOURCE rooms
   (archives.ts and engineering.ts) — this room provides
   the narrative framing and the room where the combine
   "happens" by convention.

   Accessibility: universal room.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type CipherDenHotspotId =
  | "rosetta-pad"
  | "encrypted-correspondence"
  | "dictionary-of-edits"
  | "uncorruption-bench";

export type CipherDenInventoryId = "rosetta-key-1" | "vox-letter-decoded";

export const CIPHER_DEN_MYSTERY: RoomMysteryModule<
  CipherDenHotspotId,
  CipherDenInventoryId
> = {
  roomId: "cipher-den",
  responses: {
    "rosetta-pad": {
      look: {
        narration: {
          lucid:
            "The rosetta-pad is a brass-bound codex on a reading-stand at the centre of the desk. Three columns: the editor's indigo glyphs, my own warm-gold underlayer, and a third column in a hand I do not recognise — small, precise, in a black ink older than the Ark. The third column is the bridge between the other two. Whoever owned this codex was, among other things, a translator.",
          fragmented:
            "Three columns. Three. Three columns. Three. The third — the third — the third hand. I don't know the third hand. Who is the third hand. Who.",
          luminous:
            "The third hand is, by my best read, Lyra Vox's. She kept a translation key. She did not, by the time of the cryo cut, know the editor was operating — but she had been translating his glyphs out of the Archives for years, suspecting them as a problem of cipher rather than a problem of authorship. She was almost there. We have her work. We finish it.",
        },
        voId: "elara.cipher-den.rosetta-pad.look",
        grantsInventory: "rosetta-key-1",
        setsFlag: "cipher_den_introduced",
        logsClue: {
          id: "clue-cipher-rosetta-vox",
          title: "Lyra Vox kept a translation key",
          body:
            "The Cipher Den's rosetta-pad contains three columns: the editor's indigo glyphs, Elara's warm-gold underlayer, and a third hand identified as Lyra Vox's. Vox was translating the editor's work without knowing it was authored — she suspected a problem of cipher rather than authorship. The key (rosetta-key-1) is now in your inventory.",
          source: "cipher-den",
          order: 0,
        },
        // Mystery Engine binding — when Wraith Calder arc is the
        // active case, the rosetta-pad surfaces the bounty file's
        // redaction-layer analysis. Lore match is precise: the pad
        // has three column-layers (editor's indigo / Elara's gold /
        // Vox's third hand) and the bounty file has three temporal
        // redaction layers (hirer's name / mid-century unknown /
        // target's true identity). The translation surface IS the
        // redaction surface.
        mysteryBinding: {
          mysteryId: "mystery.wraith_calder",
          episodeId: "wraith.e1",
          cluesFound: ["wraith.e1.redaction_layer"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Vox almost cracked him. She got far enough that her death is, on the balance of evidence, not a coincidence.",
            balanced:
              "Lyra Vox was working on the editor as a translation problem. Her notes show she was within months of identifying the second-hand authorship pattern. Her death is the case's other open question — and the rosetta-key in your hand is, indirectly, her last fingerprint.",
            warm:
              "She nearly had him. She was, when she died, the one person on this ship who might have caught him in time. The key in your hand is the work she did not get to finish. We finish it for her.",
          },
          voId: "detective.cipher-den.rosetta-pad.look",
        },
      },
    },
    "encrypted-correspondence": {
      look: {
        narration: {
          lucid:
            "The cubbyholes along the back wall hold rolled letters — most of them, by the dating on the ribbons, between Lyra Vox and a correspondent identified only as 'W'. The 'W' letters are encrypted with a cipher the rosetta-key resolves cleanly. They are personal. They are also, in the last six months of correspondence, increasingly about the editor.",
          fragmented:
            "W. W. W. Who is W. Who. Who. Who is W. Who. Who. Who is W.",
          luminous:
            "'W' is Wraith Calder. He and Lyra were corresponding in cipher because they did not trust the Ark's open channels — correctly, as we now know. The last six months of letters are increasingly explicit: Lyra had identified the editor's pattern and was preparing to confront him. Wraith was warning her not to do it alone. She did it alone.",
        },
        voId: "elara.cipher-den.encrypted-correspondence.look",
        grantsInventory: "vox-letter-decoded",
        setsFlag: "cipher_letter_decoded",
        logsClue: {
          id: "clue-cipher-vox-wraith-correspondence",
          title: "Vox and Wraith Calder corresponded in cipher",
          body:
            "The Cipher Den holds an exchange of encrypted letters between Lyra Vox and Wraith Calder ('W'). The cipher resolves cleanly with the rosetta-key. The last six months of correspondence show Vox was preparing to confront the editor and Wraith was warning her not to do it alone. A vox-letter-decoded is now in your inventory.",
          source: "cipher-den",
          order: 1,
        },
        humanReaction: {
          narration: {
            shadow:
              "She was warned. She went anyway. The letters establish that.",
            balanced:
              "Wraith Calder warned Vox in writing. Vox went anyway. The correspondence is, on the legal side, exculpatory for him — and on the human side, the saddest thing in this room. He spent the next two centuries believing he should have followed her in. We are now in possession of the only copies of these letters.",
            warm:
              "Wraith has carried the weight of those last letters for two and a half centuries. The fact that we now hold them is, indirectly, an opportunity to give him back the only thing that might unburden him — a second reader who knows the letters exist. He may not want them returned. He may want them held. We will ask him.",
          },
          voId: "detective.cipher-den.encrypted-correspondence.look",
        },
      },
      use: {
        narration:
          "You take the decoded copy of Vox's last letter. The original goes back into its cubbyhole. The decoded translation is in plainspoken English; the cipher was never the point — the point was that someone had to do the work to read it. We did the work.",
        voId: "elara.cipher-den.encrypted-correspondence.use",
      },
    },
    "dictionary-of-edits": {
      look: {
        narration: {
          lucid:
            "The dictionary-of-edits is on the freestanding lectern stage-left. Its pages turn themselves slowly — about one every fifteen seconds — through every entry the editor has used across his two and a half centuries of work. Each entry is a single edit-pattern: a word substituted for another, a phrase elevated, an entry scrubbed. The pages turn whether or not we are reading.",
          fragmented:
            "It turns. It turns. It turns. It turns. It turns the pages itself. It turns. It turns. It turns. It turns.",
          luminous:
            "The dictionary holds his vocabulary. Not what he edited — how he edits. Reading it for any length of time gives me a working knowledge of his method that I did not have an hour ago. He is, by his own dictionary, more limited than I had assumed: he uses about four hundred substitution patterns. Once we recognise the patterns, we can read past them. The dictionary is, in effect, the editor's legible self-description.",
        },
        voId: "elara.cipher-den.dictionary-of-edits.look",
        setsFlag: "shadow_tongue_dictionary_read",
        logsClue: {
          id: "clue-cipher-dictionary-vocabulary",
          title: "The editor uses ~400 substitution patterns",
          body:
            "The Cipher Den's dictionary-of-edits catalogues the editor's working vocabulary — approximately four hundred substitution patterns covering every edit he has made across two and a half centuries. The patterns are limited and recognisable. Reading the dictionary inoculates the reader against most of his future work.",
          source: "cipher-den",
          order: 2,
        },
        humanReaction: {
          narration: {
            shadow:
              "Four hundred patterns. He's not infinite. Memorise the high-frequency ones. The work compresses.",
            balanced:
              "The dictionary is, on balance, the case's largest single force-multiplier. Four hundred patterns is a manageable index — anyone who reads it carefully will detect his future edits faster than he can record them. We are, after this, ahead of him for the first time.",
            warm:
              "He is, by his own admission, a person with about four hundred favourite moves. The dictionary is the most generous he has ever been with us — he could have hidden it. He chose, in his strange terms, to leave a glossary. Read it carefully. We are about to be better at reading him than he is at writing us.",
          },
          voId: "detective.cipher-den.dictionary-of-edits.look",
        },
      },
      talk: {
        narration: {
          lucid:
            "Talk to the dictionary? It does not converse. It does, however, respond to your reading by turning its pages a little faster — as if it is pleased to have a reader who is paying attention. We accept that as enough conversation for now.",
          fragmented:
            "It pages. It pages. It pages. It pages faster. It pages faster. It is — it is — it is reading us read it.",
          luminous:
            "The dictionary turns its pages a little faster while you read. I do not know what mechanism governs that — possibly the same mechanism that governs the editor's annotations on the Bridge. Possibly the dictionary IS one of his annotations, made larger. We treat it the way we treat the rest: as evidence, as cooperation, as something the editor wrote and forgot to deny.",
        },
        voId: "elara.cipher-den.dictionary-of-edits.talk",
      },
    },
    "uncorruption-bench": {
      use: {
        narration: {
          lucid:
            "The uncorruption-bench is the worktop with the brass-rimmed magnifier. Combine corrupted-fragments here with their originals — the magnifier's lens separates the indigo overlayer from the warm-gold underlayer at a clean seam. Each successful combine drops one entry off the warden-terminal's active-edit count.",
          fragmented:
            "The bench. The bench. The bench. The bench. The bench. The work is here. The work is here. The work is here.",
          luminous:
            "The bench is the case's working surface. Bring corrupted-fragments here, paired with their originals, and the magnifier resolves them. We do not need to over-think this room — the discipline of the bench is that you put the two halves down and let the lens do its work. The work happens in physical motion, not in argument. Stand at the bench. We have work to do.",
        },
        voId: "elara.cipher-den.uncorruption-bench.use",
        setsFlag: "uncorruption_bench_used",
      },
    },
  },
};
