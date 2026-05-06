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
      talk: {
        narration: {
          lucid:
            "You speak to the rosetta-pad. The codex's third column — the Vox-hand black-ink translation key — flickers briefly with phosphor-lavender, the same colour the oracle-pool's brazier-smoke uses. A recorded voice plays from the codex itself, soft enough that you have to lean in: 'If I cross the line, the person who knows me best will be the only one quick enough to do it cleanly.' The voice is Akai Shi's. The recording is dated four minutes before the Battle of Thaloria's threshold.",
          fragmented:
            "Four minutes. Four minutes. The recording. The recording. Akai Shi. Akai Shi. She knew. She knew. She knew.",
          luminous:
            "The rosetta-pad surfaces, by way of voice rather than ink, Akai Shi's pre-threshold consent recording. Four minutes before the Thought Virus took her motor function, she made a recording: she knew Jericho would be the one quick enough to do it cleanly, and she asked specifically that he not be told the consent was on file. She wanted him to be able to live afterward. The codex carries both the ciphered text and, on a different layer, the spoken record. Lyra Vox indexed by witness and by voice.",
        },
        voId: "elara.cipher-den.rosetta-pad.talk",
        // Mystery Engine binding — talking to the rosetta-pad
        // surfaces Akai Shi's pre-threshold consent recording.
        // Lore match: the codex's three-layer translation
        // discipline (editor's indigo / Elara's gold / Vox's
        // black ink) extends to spoken-record carriage in the
        // same archive. The recording is "recovered from the
        // Cipher Den" per the clue body — recovered IS rosetta-
        // pad work, on the audio layer.
        mysteryBinding: {
          mysteryId: "mystery.jericho_jones",
          episodeId: "jericho.e2",
          cluesFound: ["jericho.e2.akai_shi_recording"],
        },
      },
      use: {
        narration:
          "You take a working tracing of the rosetta's third column — Vox's black-ink translation key — onto a fresh sheet. The key is short enough to memorise but worth carrying physically: any letter you decode after this can be cross-checked against the tracing without re-borrowing the codex. The pad keeps the original. We keep the working copy. — As the tracing dries, a second pass of Akai Shi's pre-threshold recording surfaces under the magnifier. Reading 2: she did not just consent — she chose her witness. The recording names Jericho specifically. The first pass we recovered was the consent; this pass is the assignment. He was not a default. He was selected, by name, by her, four minutes before the threshold took her motor function.",
        voId: "elara.cipher-den.rosetta-pad.use",
        // Jericho arc binding — Reading 2 of the pre-threshold
        // recording names Jericho as the witness Akai Shi chose.
        // jericho.e4.akai_shi_witness_choice foundIn: cipher-den.
        mysteryBinding: {
          mysteryId: "mystery.jericho_jones",
          episodeId: "jericho.e4",
          cluesFound: ["jericho.e4.akai_shi_witness_choice"],
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
        // Mystery Engine binding — when Wraith Calder arc is the
        // active case, the encrypted-correspondence cubbyholes
        // also surface the Word and the Silence ledger entry.
        // Lore match: this hotspot IS canonically Wraith's
        // encrypted ledger with Vox; the Information Twins'
        // ledger sits as a sibling page in the same archive.
        mysteryBinding: {
          mysteryId: "mystery.wraith_calder",
          episodeId: "wraith.e2",
          cluesFound: ["wraith.e2.fair_trade_ledger"],
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
      talk: {
        narration: {
          lucid:
            "You speak to the cubbyhole rack. A specific letter slides forward — third row from the top, dated three years after DEC-7710 was sealed. Lyra Vox's hand, the rosetta-key cipher: 'Asked the Seer if I should play it. She said no — but more carefully: not yet, and not by you. I do not know who is meant to play this. The Seer says I will not be the one to find out. I trust her on this. The tape stays sealed.' The letter holds; we read it twice; it returns itself to the cubbyhole.",
          fragmented:
            "Not yet. Not by you. Not yet. Not yet. Not by you. The tape stays sealed. The tape stays sealed.",
          luminous:
            "We address the rack and Vox's consultation note on the Seer's DO-NOT-PLAY tape surfaces. She asked the Seer; the Seer answered with care; Vox accepted that she would not be the reader the tape was for. The note is the earliest record we have of the Seer's record-and-suppress discipline being honoured by another reader. Centuries of subsequent readers replaced the band; Vox set the precedent. We are now part of that line — the case asks us, by reaching us, to choose whether to extend it.",
        },
        voId: "elara.cipher-den.encrypted-correspondence.talk",
        // Mystery Engine binding — talking to the cubbyhole rack
        // surfaces Vox's consultation note on the DO-NOT-PLAY
        // tape. Lore match: the rack already holds Wraith's
        // encrypted ledger with Vox; her consultation notes on
        // Seer-archive sealings sit as sibling letters in the
        // same archive, indexed by the same rosetta-key cipher.
        mysteryBinding: {
          mysteryId: "mystery.the_seer",
          episodeId: "seer.e1",
          cluesFound: ["seer.e1.vox_consultation_note"],
        },
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
        // Mystery Engine binding — when Wraith Calder arc is the
        // active case, the dictionary-of-edits surfaces both halves
        // of the Information Twins interrogation transcript. Lore
        // match: the dictionary holds vocabulary as method, and
        // the Word/Silence pair speak in alternating-sentence
        // discipline — a vocabulary-by-omission method that mirrors
        // the editor's substitution patterns in form.
        mysteryBinding: {
          mysteryId: "mystery.wraith_calder",
          episodeId: "wraith.e3",
          cluesFound: [
            "wraith.e3.silence_transcript",
            "wraith.e3.word_transcript",
          ],
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
            "Talk to the dictionary? It does not converse. It does, however, respond to your reading by turning its pages a little faster — as if it is pleased to have a reader who is paying attention. We accept that as enough conversation for now. — A loose page near the back, in the Seer's hand, slips out as the dictionary speeds. Method note: 'On records that cancel themselves when read by the wrong audience, and stabilise when read by the right one. The reader is not a passive party. The recording listens back.'",
          fragmented:
            "It pages. It pages. It pages. It pages faster. It pages faster. It is — it is — it is reading us read it. The Seer's note. The Seer's note.",
          luminous:
            "The dictionary turns its pages a little faster while you read. I do not know what mechanism governs that — possibly the same mechanism that governs the editor's annotations on the Bridge. Possibly the dictionary IS one of his annotations, made larger. The loose page that slipped out, however, is not the editor's. It is the Seer's: a method note on self-cancelling records, in his own hand, slipped between pages 437 and 438 of the editor's vocabulary. The Seer left his counterpoint to the editor's method tucked inside the editor's own dictionary. We treat the rest as we always do — but we keep the Seer's page.",
        },
        voId: "elara.cipher-den.dictionary-of-edits.talk",
        // Seer arc binding — the loose page is the e5 method note on
        // self-cancelling records. Found in cipher-den per
        // episodeMysteries.ts seer.e5.seer_method_self_cancellation.
        mysteryBinding: {
          mysteryId: "mystery.the_seer",
          episodeId: "seer.e5",
          cluesFound: ["seer.e5.seer_method_self_cancellation"],
        },
      },
      use: {
        narration:
          "You bookmark the page currently turned-up — entry 217, a substitution pattern the editor used four times this month on the Bridge marginalia. The bookmark holds the page open. Beside the bookmark, a smaller annotation in a hand that is neither the editor's nor mine: 'recording method, variant — see VAR-1109A/B and tape DEC-7710.' The Seer's working notes on the editor's method, filed in the editor's own dictionary.",
        voId: "elara.cipher-den.dictionary-of-edits.use",
        setsFlag: "shadow_tongue_dictionary_bookmarked",
        // Seer arc binding — the smaller annotation is the e2 method
        // note on Variant Recording, kept in the cipher-den per
        // episodeMysteries.ts seer.e2.seers_method_note.
        mysteryBinding: {
          mysteryId: "mystery.the_seer",
          episodeId: "seer.e2",
          cluesFound: ["seer.e2.seers_method_note"],
        },
      },
    },
    "uncorruption-bench": {
      look: {
        narration: {
          lucid:
            "The uncorruption-bench occupies the workshop-side of the den — a long worktop with a brass-rimmed magnifier on a hinged arm, two shallow trays for evidence, and a recessed clamp for holding two paper sheets in alignment. Lyra Vox's monogram is stamped into the clamp's brass. The bench was built for the work this room does. The work is older than the room's current case.",
          fragmented:
            "The bench. The bench. The bench. Brass clamp. Brass clamp. Lyra. Lyra. Lyra built the bench.",
          luminous:
            "Lyra built the bench. The clamp's monogram dates the workshop to roughly thirty years before her death — she set up this room while still actively translating the Archives, which means the editor's pattern was visible to her three decades before she could prove it. The bench is, in our hands today, the inheritance she left for whoever finally arrived to finish the case. We are at the bench. We are the inheritor.",
        },
        voId: "elara.cipher-den.uncorruption-bench.look",
        logsClue: {
          id: "clue-cipher-bench-vox-built",
          title: "Lyra Vox built the uncorruption-bench thirty years pre-death",
          body:
            "The Cipher Den's uncorruption-bench bears Lyra Vox's monogram — the workshop was set up roughly thirty years before her death. Vox detected the editor's pattern decades before she could prove it. The bench is the inheritance she left for whoever eventually arrived to finish the case.",
          source: "cipher-den",
          order: 3,
        },
        // Seer arc binding — the bench's monogram-stamp brass clamp
        // also holds Vox's marginal note on the Seer's 41-year
        // attendance log (filed for translation alongside her own
        // working papers). seer.e3.lyra_vox_marginal foundIn:
        // cipher-den.
        mysteryBinding: {
          mysteryId: "mystery.the_seer",
          episodeId: "seer.e3",
          cluesFound: ["seer.e3.lyra_vox_marginal"],
        },
      },
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
        // Mystery Engine binding — when Wraith Calder arc is the
        // active case, using the uncorruption-bench plays back
        // Wraith's pre-rite last recording. Lore match: the bench
        // is "the case's working surface" where the magnifier
        // resolves seams, and the audio fragment was "recovered
        // from the Cipher Den" per the clue's authored body —
        // recovered IS uncorruption work, on a different medium.
        mysteryBinding: {
          mysteryId: "mystery.wraith_calder",
          episodeId: "wraith.e4",
          cluesFound: ["wraith.e4.bounty_hunter_remembers"],
        },
      },
      talk: {
        narration:
          "The bench has no voice but it has a discipline: speech here is supposed to be the report of the work, not the planning of it. Lyra trained her translators to narrate aloud while resolving each seam — the spoken record was, in her view, the only honest audit-trail. We can do the same. The bench is listening. — Beneath the magnifier, a small folded note in the Seer's hand: 'When Vex's installment ledger reads the alias as the engineer-of-record, the cross-arc decision is made for both of us. I record this so the witness who arrives knows the decision was mutual.'",
        voId: "elara.cipher-den.uncorruption-bench.talk",
        // Seer arc binding — the folded note is the cross-arc echo
        // recorded by the Seer about Vex's installment-ledger
        // decision. seer.e4.cross_arc_alias_decision foundIn:
        // cipher-den.
        mysteryBinding: {
          mysteryId: "mystery.the_seer",
          episodeId: "seer.e4",
          cluesFound: ["seer.e4.cross_arc_alias_decision"],
        },
      },
    },
  },
};
