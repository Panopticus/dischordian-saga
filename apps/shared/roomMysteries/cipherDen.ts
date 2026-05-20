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
  | "charter-per-m-live-sample"
  | "charter-watcher-oath-fragment"
  | "tarn-roen-confidence"
  | "memorial-first-pass-five-recovered"
  | "memorial-parental-imprint-search"
  | "memorial-first-imprint-record"
  | "charter2-heron-diary"
  | "charter2-heron-diary-second-page"
  | "charter2-silence-convention"
  | "infernal-handwriting-analysis"
  | "infernal-atalin-receipt-sample"
  | "infernal-the-flaw"
  | "chained-tarn-year-one-argument"
  | "chained-full-proceedings-audio"
  | "storm-uncorrelated-residue"
  | "wolf-seal-telemetry"
  | "akai-targets-list-order-pattern"
  | "resur-seven-pointed-star"
  | "watchers-verel-signature"
  | "tarn-logic-proposal"
  | "memorial-parent-search-i1"
  | "watchers-upper-band-signature"
  | "watchers-idris-signature"
  | "watchers-six-signatures-catalogue"
  | "akai-necromancer-retreat-chambers"
  | "rosetta-pad" | "encrypted-correspondence" | "dictionary-of-edits" | "uncorruption-bench" | "cross-arc-thanks-card" | "vex-seer-pair-binder";

export type CipherDenInventoryId = "rosetta-key-1" | "vox-letter-decoded";

export const CIPHER_DEN_MYSTERY: RoomMysteryModule<
  CipherDenHotspotId,
  CipherDenInventoryId
> = {
  roomId: "cipher-den",
  responses: {
    /* ─── charter.missing_signatory · e3 (Per. M. live signature sample) ─── */
    "charter-per-m-live-sample": {
      look: {
        narration:
          "On the cipher-den's signature-comparison bench, beside the preservation-order file pulled from archives, today's specimen: Per. M.'s receipt for the Antiquarian's morning return. Cipher-den staff have laid it under the comparison lens. The hand matches the eight-epoch signatures — every stroke, every loop, every pulse in the down-stroke. The pulse is doubled, a tic the cipher-den's bench catalogues as 'breathing twice per descender' — a writer who exhales once on the down-stroke and again on the lift. The same tic sits in the wax-thumb on the founding charter's seventh signature.",
        mysteryBinding: {
          mysteryId: "charter.missing_signatory",
          episodeId: "charter.missing_signatory.e3",
          cluesFound: ["charter.e3.archivist_signature"],
        },
      },
      use: {
        narration:
          "You request the bench's overlay scan. The pulses align — Per. M.'s and the wax-thumb's — to within the bench's measurement tolerance. The sealer of the seventh signature and the archivist who has been preserving the charter for eight epochs are the same writer. They sealed the silence; they have been holding it since.",
      },
    },
    /* ─── charter.missing_signatory · e4 (founding-Watcher oath fragment) ─── */
    "charter-watcher-oath-fragment": {
      look: {
        narration:
          "Stanza three of the founding-Watchers' oath fragment, recovered from the cipher-den's deepest archive — a brittle vellum scrap the length of a forearm. The translation, vetted by three cipher-keepers: 'six speak the founding; one closes the founding; the closer is sworn against speaking.' The fragment is older than the charter. The closer-clause is not metaphor — it is a clause in a founding oath, naming a role. Per. M. is not the redactor. Per. M. is the role of closer, kept by a Watcher whose oath of silence is older than the document the closer was instituted to close.",
        mysteryBinding: {
          mysteryId: "charter.missing_signatory",
          episodeId: "charter.missing_signatory.e4",
          cluesFound: ["charter.e4.witness_oath"],
        },
      },
      interrogate: {
        narration:
          "You ask the cipher-den staff who has signed the closer's oath since the founding. They produce no record. The oath was sworn once, by one Watcher, at the founding; no successor has been needed because the original closer has not died. Per. M.'s lamp burns for the same reason.",
      },
    },
    /* ─── mechronis.missing_professor · e4 (Roen's confidential account) ─── */
    "tarn-roen-confidence": {
      look: {
        narration:
          "Among the cipher-den's confidential statements — recorded in the closed wing where colleagues testify against their own institution — Trial-master Roen's full account. Roen confirms: Tarn approached them in the cipher-den three months ago and asked for help leaving the Academy without a goodbye. Roen agreed because Tarn was the only colleague who had ever asked them for anything. The statement is precise and unornamented. The cipher-den's reader notes: 'subject visibly relieved at the asking; subject offered the help without negotiation.' Roen's third aye in the erasure vote was Tarn's confidence kept, not the cowardice the other two faculty heads admitted to.",
        mysteryBinding: {
          mysteryId: "mechronis.missing_professor",
          episodeId: "mechronis.missing_professor.e4",
          cluesFound: ["mechronis.e4.roen_full_account"],
        },
      },
      use: {
        narration:
          "You ask the cipher-den's records for prior contact between Tarn and Roen. The drawer returns sixteen years of Trial-procedure manual annotations, every one in Roen's hand, every one cross-referenced to Tarn's research. The colleagues who looked least alike on the surface were the only two who had been reading each other for sixteen years.",
      },
    },
    /* ─── memorial.forgotten_names · e3 (first cross-reference pass) ─── */
    "memorial-first-pass-five-recovered": {
      look: {
        narration:
          "On the cipher-den's cross-reference bench, the first-pass results from listening to the fourteen unwitnessed imprints in pairs and triples. Five names emerged: I-3 named in I-101's imprint. I-58 named in I-202's imprint. I-129 named in I-301's imprint. I-356 named in I-410's imprint. I-388 named in I-444's imprint. Five of the fourteen now have witnesses — drawn from within the unwitnessed group itself. The chain of memory was not broken at every link; some of the unwitnessed had been witnessing each other all along.",
        mysteryBinding: {
          mysteryId: "memorial.forgotten_names",
          episodeId: "memorial.forgotten_names.e3",
          cluesFound: ["memorial.e3.first_pass_results"],
        },
      },
      use: {
        narration:
          "You request the pass's listening protocol. The bench logs each pairing — minutes of audio, attentive ear, pencil notes. The cipher-den's reader confirms: no name was inferred; every recovered name was spoken aloud in a dish by someone who had known the named.",
      },
    },
    /* ─── memorial.forgotten_names · e3 (parental imprint search) ─── */
    "memorial-parental-imprint-search": {
      look: {
        narration:
          "Beside the first-pass bench, the cipher-den's expanded search — not just the fourteen unwitnessed, but the entire imprint registry. If the children's parents imprinted at any time, the parents named the children. The search returns two hits: a parental imprint from epoch four naming I-244, and a sibling imprint from epoch six naming I-44. Seven of the fourteen are now witnessed; the unwitnessed gap is closing.",
        mysteryBinding: {
          mysteryId: "memorial.forgotten_names",
          episodeId: "memorial.forgotten_names.e3",
          cluesFound: ["memorial.e3.parental_imprint_search"],
        },
      },
      interrogate: {
        narration:
          "You ask the bench how the search ranked candidate imprints. The cipher-den's reader explains: imprint-recordings are time-stamped and family-line-tagged where consent was given at imprint-time. The two hits emerged from family-line cross-reference rather than name-string match. The names were spoken by people who knew them; the chain of memory did the work the index could not.",
      },
    },
    /* ─── memorial.forgotten_names · e4 (first-imprint record) ─── */
    "memorial-first-imprint-record": {
      look: {
        narration:
          "From the cipher-den's deepest archive — drawer one, pre-charter tier — the record of the Ark's first imprint. The recorder's log: 'witnessing I-1.' The imprint was taken before the founding charter. The Architect's Console initiated the process — the Architect's first act. No name was inscribed on the record. The first imprint of the Ark predates every other imprint in the registry by a margin the cipher-den's instruments cannot measure precisely.",
        mysteryBinding: {
          mysteryId: "memorial.forgotten_names",
          episodeId: "memorial.forgotten_names.e4",
          cluesFound: ["memorial.e4.first_imprint_record"],
        },
      },
      use: {
        narration:
          "You request the recorder's notes from the moment. The drawer returns a single transcribed line: 'subject is a child; subject is alone; subject's witness is the Architect.' No further annotation. The Architect was witness and recorder both. The act of recording was the first act of the saga.",
      },
    },
    /* ─── charter.second_signatory · e3 (Heron's diary) ─── */
    "charter2-heron-diary": {
      look: {
        narration:
          "In the cipher-den's deepest archive — drawer eleven, fourth-epoch tier — the Council archivist Heron's personal diary. Recovered last month from a sealed compartment in their desk after the delegation's arrival. Heron's hand is neat, anxious, dated. The relevant page: 'I do not enjoy the tidying. I will do the tidying because the Council has asked me to. The Council has asked me to because the seven do not wish to share authorship.' The phrasing is precise — the tidying, not the editing; the seven, not the six. Heron knew the request was a scrub and that the seventh founder had not authorised it.",
        mysteryBinding: {
          mysteryId: "charter.second_signatory",
          episodeId: "charter.second_signatory.e3",
          cluesFound: ["charter2.e3.heron_diary"],
        },
      },
      use: {
        narration:
          "You read further. The diary continues across nine years of fourth-epoch tidying — Solven, Vyn, Marek, Othisen each named individually, each entry dated, each closed with the line 'I will do this because I have been asked.' The diary is a confession written in advance of the confessor's pardon.",
      },
    },
    /* ─── charter.second_signatory · e4 (Heron's diary, page two) ─── */
    "charter2-heron-diary-second-page": {
      look: {
        narration:
          "The diary's page two, recovered intact. Heron writes: 'I asked the seventh whether they consented to the scrub. The seventh did not answer. I took silence as consent. The Council took silence as consent. We were both wrong, and only the seventh knew.' The page is dated the day before the first artisan-house entry. Heron asked the question — the question they were instructed not to ask — and was answered with the silence that has been the seventh Watcher's vote for four epochs. Heron misread it the same way the Council misread it. The misreading was the founding error.",
        mysteryBinding: {
          mysteryId: "charter.second_signatory",
          episodeId: "charter.second_signatory.e4",
          cluesFound: ["charter2.e4.heron_diary_b"],
        },
      },
      use: {
        narration:
          "You compare Heron's question-page against the founding-protocols archive. The protocol on silence-as-vote is written in plain language; Heron had access to it. The misreading was not from ignorance. Heron knew the protocol and chose to take silence as consent because the six had asked them to read it that way.",
      },
    },
    /* ─── charter.second_signatory · e4 (silence-as-vote convention) ─── */
    "charter2-silence-convention": {
      look: {
        narration:
          "From the cipher-den's founding-protocols archive — the convention Heron did not honour. The page is brittle, paginated by hand. The relevant stanza: 'when the seven cannot agree, the seven may abstain by silence. silence on a vote is opposition recorded in the manner of one who will not break the seven's unity by speaking against it.' The convention pre-dates the charter. It is older than the council that misapplied it. The seventh Watcher has been voting no by silence since the fourth epoch and the convention names that silence correctly. The Council named it wrong.",
        mysteryBinding: {
          mysteryId: "charter.second_signatory",
          episodeId: "charter.second_signatory.e4",
          cluesFound: ["charter2.e4.silence_as_vote"],
        },
      },
      interrogate: {
        narration:
          "You ask the archive when this convention was last successfully invoked. The drawer returns a single entry: the founding itself. The seventh founding Watcher invoked silence-as-vote on three minor founding-day decisions; each was read correctly. The convention's first misreading is the fourth-epoch scrub. The misreading has been the seventh's only voice since.",
      },
    },
    /* ─── memorial.forgotten_names · e4 (parent search for I-1) ─── */
    "memorial-parent-search-i1": {
      look: {
        narration:
          "On the cipher-den's relatives-search bench, the search for I-1's parent: no parent imprinted, no sibling imprinted, no witnesses recorded. I-1 is alone in the registry. The first imprint of the Ark has no relatives in the imprint catalog.",
        mysteryBinding: {
          mysteryId: "memorial.forgotten_names",
          episodeId: "memorial.forgotten_names.e4",
          cluesFound: ["memorial.e4.parent_search_i1"],
        },
      },
    },
    /* ─── mechronis.missing_professor · e2 (Logic faculty proposal) ─── */
    "tarn-logic-proposal": {
      look: {
        narration:
          "On the cipher-den's faculty-submissions bench, Professor Othmar's Logic Faculty Proposal: eight modules, chess-heavy, citing Tarn's notes from her residency in the cipher-den. Signed by Othmar. Proposes the elimination of two trial-faculty modules.",
        mysteryBinding: {
          mysteryId: "mechronis.missing_professor",
          episodeId: "mechronis.missing_professor.e2",
          cluesFound: ["mechronis.e2.logic_proposal"],
        },
      },
    },
    /* ─── memorial.seven_watchers · e2 (Verel's band-five signature) ─── */
    "watchers-verel-signature": {
      look: {
        narration:
          "On the spectrum-analysis bench, the band-five signature card isolated for further reading. Upper-band band-five. Bright waveform, narrow spectrum, an overtone like running water. Verel speaks to caretakers — players who have inscribed at the Memorial Plaza, donated to charity, or kept Memorial Plaza vigils.",
        mysteryBinding: {
          mysteryId: "memorial.seven_watchers",
          episodeId: "memorial.seven_watchers.e2",
          cluesFound: ["watchers.e2.verel_signature"],
        },
      },
    },
    /* ─── resurrectionist.cycle_walker · e1 (seven-pointed star footer) ─── */
    "resur-seven-pointed-star": {
      look: {
        narration:
          "On the cipher-den's Syndicate-of-Death roster bench, six immortal twin-pairs are recorded — twelve names, six bindings, the Syndicate's signature six-pointed star embossed on every page. The Resurrectionist's case-file carries a seven-pointed star at its footer. The cult-curated annotation reads: 'copyist's error — the six-pointed star, drawn carelessly.' The seventh point is not drawn carelessly. It is drawn with the same precision as the other six.",
        mysteryBinding: {
          mysteryId: "resurrectionist.cycle_walker",
          episodeId: "resurrectionist.cycle_walker.e1",
          cluesFound: ["resur.e1.seven_pointed_star"],
        },
      },
    },
    /* ─── akai_shi.red_death · e3 (targets-list order pattern) ─── */
    "akai-targets-list-order-pattern": {
      look: {
        narration:
          "On the cipher-den's pattern-analysis bench, the Red Death's fourteen targets sorted not chronologically but by how MUCH each elimination redirected the chronicle's path. The first target redirected the chronicle by one degree. The fourteenth target — yet to be named — would redirect by ninety. The list is ascending. She is building toward something.",
        mysteryBinding: {
          mysteryId: "akai_shi.red_death",
          episodeId: "akai_shi.red_death.e3",
          cluesFound: ["akai.e3.order_pattern"],
        },
      },
    },
    /* ─── wolf.anara_hunt · e4 (seal-telemetry at transfer) ─── */
    "wolf-seal-telemetry": {
      look: {
        narration:
          "On the cipher-den's containment-telemetry bench, the Crucible's seal telemetry on the Wolf's chamber, retrieved from the inheritance manifest: at the moment of transfer to Anara, the Wolf's seal was at 92% integrity, declining at 0.3% per cycle. The seal was not failed at transfer. The seal failed twenty-three cycles after transfer, at which point Anara's containment systems should have automatically reasserted. They did not. Anara's containment ledger does not register the Wolf's chamber as a chamber.",
        mysteryBinding: {
          mysteryId: "wolf.anara_hunt",
          episodeId: "wolf.anara_hunt.e4",
          cluesFound: ["wolf.e4.unsealed_at_transfer"],
        },
      },
    },
    /* ─── storm.architect_of_flux · e4 (uncorrelated calm residue) ─── */
    "storm-uncorrelated-residue": {
      look: {
        narration:
          "On the cipher-den's pattern-anomaly bench, two of the nine documented calms have NO publicly-recorded chronicle-significant event. The cult-curated record annotates these as 'inactive calms — atmospheric fluctuation; no operational purpose.' The Antiquarian's discipline rejects the 'atmospheric' label — the calm signatures are identical to the seven event-correlated calms. If they were not calling cosmic-scale planning events, they were calling something the chronicle does not record.",
        mysteryBinding: {
          mysteryId: "storm.architect_of_flux",
          episodeId: "storm.architect_of_flux.e4",
          cluesFound: ["storm.e4.uncorrelated_residue"],
        },
      },
    },
    /* ─── mechronis.chained_lesson · e4 (full proceedings audio) ─── */
    "chained-full-proceedings-audio": {
      look: {
        narration:
          "On the cipher-den's year-one-audio bench, the Year-One curriculum vote's full proceedings — recovered audio, fourteen years old, six and a half hours. Module 17 is debated in hour three. Tarn argues against it for forty minutes. The argument is academic, considered, and ultimately persuasive — the module is struck before the vote.",
        mysteryBinding: {
          mysteryId: "mechronis.chained_lesson",
          episodeId: "mechronis.chained_lesson.e4",
          cluesFound: ["chained.e4.full_proceedings"],
        },
      },
    },
    /* ─── severance.infernal_clause · e2 (handwriting analysis) ─── */
    "infernal-handwriting-analysis": {
      look: {
        narration:
          "On the cipher-den's primary signature-comparison bench, the forty contracts laid out in chronological order — Solène's archive arranged by season. The bench's reader has scanned every back page. The cipher-den's report sits beside them: 'forty contracts, forty clauses, one writer. The hand is steady, slightly slanted, and consistent through forty seasons. No ledger-keeper of forty seasons exists in any registry the league keeps.' The forty seasonal ledger-keepers' samples have been pulled for comparison; none of them match the clause-writing hand. The clauses were written by someone who never held the official post.",
        mysteryBinding: {
          mysteryId: "severance.infernal_clause",
          episodeId: "severance.infernal_clause.e2",
          cluesFound: ["infernal.e2.handwriting_consistency"],
        },
      },
      use: {
        narration:
          "You compare the cipher-den's variance metrics across the forty samples. The clause-writing hand shows less variance across forty seasons than any individual ledger-keeper's hand shows within a single season. The forty clauses were written by one person in close temporal proximity. The forty seasons are an illusion.",
      },
    },
    /* ─── severance.infernal_clause · e3 (Atalin's receipt sample) ─── */
    "infernal-atalin-receipt-sample": {
      look: {
        narration:
          "Pulled from Atalin's personnel file in the archives and brought to the cipher-den for bench comparison: a routine receipt Atalin signed during their single season as ledger-keeper. The hand matches the clause-writing exactly — every loop, every slant, every nib-pressure on the descender. The match is unambiguous. Atalin wrote every infernal clause across forty seasons in one seven-day window, while still working in the office whose contracts the clauses appear on. The cipher-den's annotation: 'identity confirmed.'",
        mysteryBinding: {
          mysteryId: "severance.infernal_clause",
          episodeId: "severance.infernal_clause.e3",
          cluesFound: ["infernal.e3.atalin_handwriting"],
        },
      },
      interrogate: {
        narration:
          "You ask the bench whether Atalin's hand changed across the seven-day window. The reader returns the variance: the clauses written on day seven are indistinguishable from those written on day one. Atalin worked steadily, without rest or hesitation, for the full window. The writing was deliberate, planned, and undivided.",
      },
    },
    /* ─── severance.infernal_clause · e4 (the flaw) ─── */
    "infernal-the-flaw": {
      look: {
        narration:
          "In the cipher-den's annotated-contract drawer, the forty clauses are laid open at the phrase Atalin built the trap around: 'in lieu of the second-cycle prize.' The cipher-den has cross-referenced the league's prize-structure history against every clause's writing date. The league did not institute second-cycle prizes until season eleven. Every clause is voidable as a matter of contract law — naming a prize that did not exist at the date of writing. The Hierarchy missed it because the Hierarchy did not read the league's prize-structure history. Atalin did. Atalin wrote the trap in seven days and waited forty seasons for someone to find it.",
        mysteryBinding: {
          mysteryId: "severance.infernal_clause",
          episodeId: "severance.infernal_clause.e4",
          cluesFound: ["infernal.e4.the_flaw"],
        },
      },
      use: {
        narration:
          "You request the cipher-den's contract-law citation for the void doctrine. The drawer returns a single canonical authority: 'a clause that conditions performance on a benefit not yet in existence at the moment of agreement is unenforceable.' The citation is older than the league. Atalin knew the citation. The Hierarchy did not check.",
      },
    },
    /* ─── mechronis.chained_lesson · e4 (Tarn's Year-One argument) ─── */
    "chained-tarn-year-one-argument": {
      look: {
        narration:
          "In the cipher-den's deepest archive — drawer seven, year-one tier — the Year-One curriculum vote's full proceedings sit on six and a half hours of recovered audio. Hour three is timestamped and bookmarked: Tarn's forty-minute argument against Module 17. The transcript: 'feint-recognition is a combat skill. the Academy is not a combat school. if we teach it, we become responsible for what apprentices do with it. the league's drill curriculum can teach it; we should not.' The argument is academic, considered, and ultimately persuasive. Module 17 was struck before the ballot.",
        mysteryBinding: {
          mysteryId: "mechronis.chained_lesson",
          episodeId: "mechronis.chained_lesson.e4",
          cluesFound: ["chained.e4.tarn_argument"],
        },
      },
      use: {
        narration:
          "You queue the audio. Tarn's voice is steady through the forty minutes — the cadence of a person who has thought through the consequences and decided. There is no waver. The Year-Eight retraction in her hand says she had thought through everything except the consequence of being right in theory and wrong in practice.",
      },
    },
    /* ─── memorial.seven_watchers · e1 (upper-band signature analysis) ─── */
    "watchers-upper-band-signature": {
      look: {
        narration:
          "On the cipher-den's spectrum-analysis bench, the upper-band signature cards from the silence-break event. Six distinct signatures across six bands — every voice carries a different upper-band fingerprint, instrument-confirmed. The bench's annotation: 'seven channels measured; six speakers identified; the seventh channel carries a signature distinct from all six, present throughout the event, silent throughout the event.' The seventh chose silence; the seventh did not lack the means.",
        mysteryBinding: {
          mysteryId: "memorial.seven_watchers",
          episodeId: "memorial.seven_watchers.e1",
          cluesFound: ["watchers.e1.upper_band_signature"],
        },
      },
      use: {
        narration:
          "You request the cipher-den's prior history for any of the six signatures. The bench returns nothing — the signatures have been placeholder entries on the upper-band roster for eight epochs without samples to verify them. The silence-break delivered six samples in sixty-three seconds and confirmed every prior placeholder.",
      },
    },
    /* ─── memorial.seven_watchers · e2 (Idris's signature) ─── */
    "watchers-idris-signature": {
      look: {
        narration:
          "Beside the spectrum-analysis bench, the band-three signature card isolated for further reading. Slow waveform, broad spectrum, an undercurrent of standing silence in the carrier-tone. The cipher-den has had a placeholder for Idris's signature for eight epochs — band three reserved on the upper-band roster, no sample to verify the slot's assignment. The silence-break delivered the sample. The match against the registry placeholder is exact.",
        mysteryBinding: {
          mysteryId: "memorial.seven_watchers",
          episodeId: "memorial.seven_watchers.e2",
          cluesFound: ["watchers.e2.idris_signature"],
        },
      },
      interrogate: {
        narration:
          "You ask the bench whether Idris's standing-silence undercurrent is an artefact of the recording or a property of the speaker. The reader returns the cross-reference: the same undercurrent appears in every recording of Idris's band-three slot — the void-state carrier the band has been holding for Idris to speak through, for eight epochs.",
      },
    },
    /* ─── memorial.seven_watchers · e3 (six signatures catalogued) ─── */
    "watchers-six-signatures-catalogue": {
      look: {
        narration:
          "On the cipher-den's master catalogue, the six signature cards now arranged by band — Idris (band three), Verel (band five), Ophran (band one), Kallium (band two), Mereth (band four), Sothe (band six). Six of seven bands accounted for. Band seven is the seventh's: a signature distinct from all six, present throughout the silence-break, silent throughout the silence-break. The catalogue is the first complete cipher-den entry for the upper-bands Watchers in eight epochs.",
        mysteryBinding: {
          mysteryId: "memorial.seven_watchers",
          episodeId: "memorial.seven_watchers.e3",
          cluesFound: ["watchers.e3.six_signatures_complete"],
        },
      },
      use: {
        narration:
          "You request a band-by-band comparison. The reader shows the cards side by side: each Watcher's spectrum is unique, but all six share a single substrate frequency — the same upper-band carrier the Ark has been listening to from below. The seventh's band carries the same substrate.",
      },
    },
    /* ─── akai_shi.red_death · e4 (Necromancer's seven retreat chambers) ─── */
    "akai-necromancer-retreat-chambers": {
      look: {
        narration:
          "On the cipher-den's matrix-cartography bench, a schematic of the Necromancer's seven retreat chambers inside the Matrix of Dreams. Each chamber carries decoys, false signatures, time-locked illusions — designed across millennia to throw off every chronicle-space hunter who tries him. The seven chambers, taken as a system, form a defense-in-depth no single agent could penetrate. The cipher-den's annotation: 'the Red Death has been moving through them in non-canonical order — time-folding rather than walking. the defense-in-depth has a single failure mode: an agent who is at every exit before the Necromancer reaches it.'",
        mysteryBinding: {
          mysteryId: "akai_shi.red_death",
          episodeId: "akai_shi.red_death.e4",
          cluesFound: ["akai.e4.necromancers_retreat_chambers"],
        },
      },
      use: {
        narration:
          "You compare the cipher-den's hunt-trace against the chamber schematic. The Red Death's path is non-sequential — chamber three at one cycle, chamber seven at another, chamber one back at a third. The hunt is not chronological. The Necromancer's defense-in-depth assumed a chronological hunter. He did not get one.",
      },
    },
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
        humanReaction: {
          narration: {
            shadow:
              "Akai Shi recorded four minutes before the threshold took her. The codex carries her voice. Jericho should hear it.",
            balanced:
              "The pre-threshold consent recording is the saga's most legally meaningful artefact for the Jericho arc. Akai Shi recorded it on her own initiative, asked for it not to be shared with Jericho, and trusted the cipher den's translation discipline to preserve her voice. The recording survives because Vox's rosetta-key carries audio as well as text.",
            warm:
              "She wanted Jericho to be able to live afterward. The recording was, by her own framing, the only legal protection she could give him. We have, in our hands today, the document that lets him stop carrying the wrong version of his own history.",
          },
          voId: "human.cipher-den.rosetta-pad.talk",
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
        humanReaction: {
          narration: {
            shadow:
              "Reading 2: she chose him by name. Not a default. The recording says it. Jericho needs to know.",
            balanced:
              "The second pass of Akai Shi's pre-threshold recording is the strongest evidence Jericho's case has. She did not select Jericho out of proximity; she named him as the witness she trusted. The first pass establishes consent; the second establishes choice. Both are required.",
            warm:
              "She named him. He has carried the weight of being available rather than being chosen for years. The second reading returns the choice to him. He will, when we hand him the recording, finally be allowed to exhale.",
          },
          voId: "human.cipher-den.rosetta-pad.use",
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
          "You take the decoded copy of Vox's last letter. The original goes back into its cubbyhole. The decoded translation is in plainspoken English; the cipher was never the point — the point was that someone had to do the work to read it. We did the work. — Beneath the cubbyhole rack, on a thin shelf used for cross-arc index cards: a state-card titled BREL'S CONTINUANCE STATE. The card's face mirrors a Game-Master-arc decision the player has not yet committed to; its reverse, in the Degen's hand, reads: 'If Brel continues as custodian, my audit closes clean. If she does not, the audit reopens, and the table sets again.' Two arcs braided into a single index card. The Degen knows.",
        voId: "elara.cipher-den.encrypted-correspondence.use",
        // Degen arc binding — cross-arc echo from Game Master arc.
        // Brel's continuance decision has direct consequence for the
        // Degen's audit outcome. degen.e5.cross_arc_brels_
        // continuance_state foundIn: cipher-den.
        mysteryBinding: {
          mysteryId: "mystery.the_degen",
          episodeId: "degen.e5",
          cluesFound: ["degen.e5.cross_arc_brels_continuance_state"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Brel continues, the Degen's audit closes clean. Two arcs braided into one card. The Degen knows.",
            balanced:
              "The cross-arc state card recording the consequence of Brel's continuance for the Degen's audit is the saga's clearest example of arc-to-arc weave. The Degen has, on his own time, prepared for both Game Master arc outcomes. The card gives him notice of which.",
            warm:
              "The Degen knew his audit was tied to the Goggles' continuity. He prepared for both verdicts. That is how he stays trustworthy across centuries — by never being surprised by the saga's smaller mercies.",
          },
          voId: "human.cipher-den.encrypted-correspondence.use",
        },
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
        humanReaction: {
          narration: {
            shadow:
              "Vox asked the Seer if she should play the tape. The Seer said no — not by you. Vox accepted. The earliest record of record-and-suppress being honoured by another reader.",
            balanced:
              "Vox's consultation note is the precedent that every subsequent DO-NOT-PLAY reader has followed. The Seer's discipline became institutional through Vox's acceptance — she could have played the tape and didn't. The line of subsequent readers is a chain of consents, each one signing the next.",
            warm:
              "Vox didn't play the tape. She trusted the Seer's read on her own discipline. That trust is what kept the discipline alive across centuries; without Vox's first acceptance, the chain would have broken in the first generation.",
          },
          voId: "human.cipher-den.encrypted-correspondence.talk",
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
        humanReaction: {
          narration: {
            shadow:
              "The Seer slipped his counter-method inside the editor's vocabulary. Self-cancelling records is the antidote to substitution patterns. He filed it where the editor would be least likely to look.",
            balanced:
              "The Seer's method note on self-cancelling records is the saga's most elegant counter-discipline. He didn't argue with the editor's substitution patterns; he wrote the antidote on a single page and slipped it between the editor's own vocabulary entries. The cancelling prophecy works because the antidote was filed in advance.",
            warm:
              "He hid his counter-method inside the editor's own dictionary. That is, in literal terms, the bravest piece of paperwork in the saga. He trusted that the editor would never re-read the dictionary carefully enough to find it. He was right.",
          },
          voId: "human.cipher-den.dictionary-of-edits.talk",
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
        humanReaction: {
          narration: {
            shadow:
              "Variant Recording method, in his own hand. The morning/afternoon discipline. He wrote it down so the saga would have the procedure on record.",
            balanced:
              "The Seer's method note on Variant Recording is the procedural document VAR-1109A and B were generated under. He recorded the method in writing because the recordings themselves cannot teach the discipline; only the method note can. The note is the manual.",
            warm:
              "He wrote out the method so the next artist who tried to do what he was doing would not have to invent the discipline from scratch. Vex read it. Brel will read it. The procedure persists.",
          },
          voId: "human.cipher-den.dictionary-of-edits.use",
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
        humanReaction: {
          narration: {
            shadow:
              "Vox's marginal note on the Seer's attendance log. She read his work as a fellow artist, not as a Hierarchy auditor. The note is the receipt.",
            balanced:
              "Lyra's marginal note on the Seer's 41-year attendance log is the cross-arc evidence that she and the Seer corresponded as peers. She read his log carefully enough to mark it; he kept her note carefully enough to file it on the bench. Both acts are records of mutual respect.",
            warm:
              "She read his log. She marked it. She left the marginalia for whoever would eventually ask. We are the ones asking. Her marginalia is, in plain terms, hospitality across centuries.",
          },
          voId: "human.cipher-den.uncorruption-bench.look",
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
        humanReaction: {
          narration: {
            shadow:
              "His pre-rite last recording. He remembered the bounty he never collected. The fragment is, in his own voice, an apology to the contract.",
            balanced:
              "Wraith's pre-rite last recording is the most personal artefact in his arc. He recorded an apology to the bounty contract he could not, in conscience, collect — addressed to the original hirer rather than to the target. The bench's magnifier resolved the audio fragment into something we could listen to. It is, fundamentally, a private document we are now reading.",
            warm:
              "He apologised to a contract. That is, in saga grammar, what a bounty hunter does when they refuse a kill they were paid for. He never collected the fee. We have, in this fragment, the only evidence the contract was ever closed honourably.",
          },
          voId: "human.cipher-den.uncorruption-bench.use",
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
        humanReaction: {
          narration: {
            shadow:
              "Mutual decision recorded. Vex's installment ledger reads alias as engineer-of-record. The Seer recorded that the decision was mutual.",
            balanced:
              "The Seer's note in the bench's folded slot establishes that Vex's alias decision was not unilateral — it was made together with the Seer, in advance, with both parties consenting. The cross-arc decision propagates through both arcs because both arcs' principals signed the same procedural moment.",
            warm:
              "They decided together. Neither of them imposed the alias on the other. He recorded the mutuality on a folded note so a future witness would know it had been a real decision, not a workaround. We are the witness. The decision was mutual.",
          },
          voId: "human.cipher-den.uncorruption-bench.talk",
        },
      },
    },
    // Game Master arc — cross-arc echo card. The cipher-den's
    // cross-arc index shelf holds a single small card recording the
    // state of Velkraal's final-edit gratitude. The card is not
    // bound to any one verb-coin grammar; it is filed as a saga-
    // weave artefact on the den's cross-arc shelf.
    "cross-arc-thanks-card": {
      look: {
        narration: {
          lucid:
            "On the cipher-den's small cross-arc shelf — the one Lyra reserved for cards that carry consequence between arcs — a single index card stands in a brass frame. VELKRAAL'S FINAL EDIT — STATE. The card mirrors the Game Master arc's e4 outcome and reflects, in pencil that updates whenever the player's choices update, the imprint's recorded gratitude for Velkraal's patient handover. The card is, in literal terms, a saga-weave indicator.",
          fragmented:
            "Final edit. Final edit. State. State. The card knows. The card knows.",
          luminous:
            "The cross-arc thanks card is a small artefact Lyra kept here for exactly this purpose: a single physical surface that registers, between arcs, when a saga-weave decision has had its full consequence carried forward. The card's pencil-state today reads: ACCEPTED. The imprint has accepted Velkraal's handover, on the saga's terms. The Game Master arc's resolution is, as far as this card knows, complete.",
        },
        voId: "elara.cipher-den.cross-arc-thanks-card.look",
        logsClue: {
          id: "clue-cipher-den-cross-arc-thanks",
          title: "Velkraal's final-edit thanks state — saga-weave indicator",
          body:
            "The Cipher Den's cross-arc shelf holds a small card recording the state of Velkraal's final-edit gratitude — a saga-weave indicator that updates with the player's choices. Today it reads: ACCEPTED. The Game Master arc's resolution is complete by this card's accounting.",
          source: "cipher-den",
          order: 4,
        },
        mysteryBinding: {
          mysteryId: "mystery.game_master",
          episodeId: "game_master.e5",
          cluesFound: ["game_master.e5.cross_arc_velkraals_thanks_state"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Pencil reads ACCEPTED. The imprint took the handover. Game Master arc closes clean. The card knows.",
            balanced:
              "The cross-arc thanks card is, by the cipher-den's discipline, a saga-weave indicator: it updates with the imprint's recorded gratitude state. ACCEPTED means the Iron Lion imprint has formally registered Velkraal's handover as honourable. The card is the simplest readable form of that registration.",
            warm:
              "The imprint accepted Velkraal's exit. That is, in the saga's quiet logic, the closest thing to a death-bed blessing the Game Master arc was ever going to receive. The card reads ACCEPTED in pencil. The pencil holds.",
          },
          voId: "human.cipher-den.cross-arc-thanks-card.look",
        },
      },
    },
    // Vex arc: Seer-Vex pair documents. The cipher-den's Insurgency-
    // engineer shelf holds two documents that link the Seer's
    // consultation request to Vex and the cross-arc state of his
    // letter to her. Both belong here because the rosetta-pad's
    // translation discipline is the only authority the Insurgency
    // and the Sanctuary share.
    "vex-seer-pair-binder": {
      look: {
        narration: {
          lucid:
            "On the cipher-den's Insurgency-engineer shelf, a small two-pocket binder. The first pocket holds the Seer's consultation request — formal, dated, addressed by name to Vex Solène. The Seer asked for a Variant Reading of his own most recent prophecy. He wanted, in writing, to have his discipline checked by another working artist. Vex received the request three weeks before he died.",
          fragmented:
            "He asked. He asked her. He asked her. He asked her three weeks. Three weeks.",
          luminous:
            "The Seer's consultation request is the most disciplined document either of them ever exchanged: a formal request for an internal audit of his own method by the only other working artist who treated discipline the same way he did. He asked, in writing, with full formality, three weeks before his death. The fact that the request is filed in this binder — and not lost in either of their personal archives — means Vex preserved it deliberately. She wanted the saga to know the request had happened.",
        },
        voId: "elara.cipher-den.vex-seer-pair-binder.look",
        logsClue: {
          id: "clue-cipher-den-seer-consultation-request",
          title: "Seer's consultation request to Vex (formal, preserved)",
          body:
            "The Cipher Den holds the Seer's formal consultation request to Vex Solène — a request for a Variant Reading of his own method by the only other working artist who treated discipline as he did. Vex preserved the request deliberately.",
          source: "cipher-den",
          order: 5,
        },
        mysteryBinding: {
          mysteryId: "mystery.vex_solene",
          episodeId: "vex.e2",
          cluesFound: ["vex.e2.seer_consultation_request"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Three weeks before he died. Formal request for a Variant Reading of his own method. Vex preserved it. Both of them knew it would matter.",
            balanced:
              "The Seer's consultation request to Vex is the most procedural document either of them ever exchanged. He asked, in writing, with full formality. She preserved it deliberately. The pair-binder is the saga's record of two artists checking each other's discipline at the level of discipline itself.",
            warm:
              "He asked her for an audit of his own work. She kept the request because she wanted the saga to know he had asked. Three weeks later he died. She has carried the request ever since.",
          },
          voId: "human.cipher-den.vex-seer-pair-binder.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You open the binder's second pocket. Inside: a saga-weave state card mirroring the Seer arc's e4 letter — the undelivered letter from the Seer to Vex. The card's pencilled state today reads: HELD, UNREAD. Vex has chosen, on the saga's evidence, not to open the letter yet. The state will update if and when she does.",
          fragmented:
            "Held. Held. Unread. Held. Unread. She has not opened it. She has not opened it.",
          luminous:
            "The cross-arc state card mirrors the Seer's e4 letter to Vex. Today's state: HELD, UNREAD. Vex has the letter. She has chosen, with the same record-and-suppress discipline the Seer himself used, not to open it yet. The card will update when she does. Whether she opens it depends on choices the player's actions are still shaping. The card is, in the cipher-den's discipline, a saga-weave indicator the player can return to and watch change.",
        },
        voId: "elara.cipher-den.vex-seer-pair-binder.use",
        logsClue: {
          id: "clue-cipher-den-cross-arc-seer-letter",
          title: "Cross-arc state — Seer's letter to Vex (HELD, UNREAD)",
          body:
            "The Cipher Den's cross-arc shelf holds a state-card mirroring the Seer arc's e4 undelivered letter to Vex. Today's state: HELD, UNREAD. The card updates with the player's saga-weave choices.",
          source: "cipher-den",
          order: 6,
        },
        mysteryBinding: {
          mysteryId: "mystery.vex_solene",
          episodeId: "vex.e5",
          cluesFound: ["vex.e5.cross_arc_seer_letter_state"],
        },
        humanReaction: {
          narration: {
            shadow:
              "HELD, UNREAD. She has the letter. She has not opened it. Whether she does depends on what we do.",
            balanced:
              "The cross-arc state card on the Seer's letter to Vex is the saga's clearest example of player-shapeable consequence. Vex's choice to hold the letter is currently consistent; opening it would, by saga grammar, be triggered by something the player does in the Vex arc's resolution. The card waits.",
            warm:
              "She is holding his letter. She is not ready to read it. We are not ready to push her. The saga waits for someone to make the call. Today the someone is, on quiet evenings, both of us at once.",
          },
          voId: "human.cipher-den.vex-seer-pair-binder.use",
        },
      },
    },
  },
};
