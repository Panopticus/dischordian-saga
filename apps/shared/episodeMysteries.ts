/* ═══════════════════════════════════════════════════════
   EPISODE MYSTERIES — canonical authoring registry

   The single source of truth for every authored mystery arc.
   Each entry is a `MysteryDefinition` (see ./mysteryTypes.ts):
   five episodes for an NPC arc, fewer for a vote-spawned
   interlude, variable for an anniversary.

   When PR2 ships the Wraith arc, additional episodes WC.E2-E5
   land here. PR3 ships the Jericho arc the same way. Authors
   add an entry; the runtime in mysteryService.ts reads it.

   Canonical reference: see docs/design/STREAMED_PRISM_MYSTERY_ENGINE.md
   §7.1 (Wraith arc breakdown), §10 (critical files), and §14b.6
   (extends the existing CADESConspiracyBoard pattern — do NOT
   build a parallel surface).
   ═══════════════════════════════════════════════════════ */

import type {
  ArcId,
  ChoiceId,
  ClueId,
  DeductionId,
  EpisodeDefinition,
  EpisodeId,
  LensId,
  MysteryDefinition,
  MysteryId,
  SuspectId,
} from "./mysteryTypes";

/* ─── ARC IDS ─── */

export const ARC_WRAITH_CALDER  = "arc.wraith_calder"  as ArcId;
export const ARC_JERICHO_JONES  = "arc.jericho_jones"  as ArcId;
export const ARC_THE_SEER       = "arc.the_seer"       as ArcId;
export const ARC_VEX_SOLENE     = "arc.vex_solene"     as ArcId;
export const ARC_GAME_MASTER    = "arc.game_master"    as ArcId;
export const ARC_THE_DEGEN      = "arc.the_degen"      as ArcId;

/* ─── LENSES ─── */
/* Six canonical faction lenses. Per §14c.8 each lens persists
   across all 5 years and gains depth per album. Authored once
   per (lens × arc); per-clue / per-deduction overlays applied
   on top of base narration. */

const LENS_INSURGENCY = "lens.insurgency" as LensId;
const LENS_HIERARCHY  = "lens.hierarchy"  as LensId;
const LENS_THALORIA   = "lens.thaloria"   as LensId;
const LENS_QUARCHON   = "lens.quarchon"   as LensId;
const LENS_DREAMER    = "lens.dreamer"    as LensId;
const LENS_NEUTRAL    = "lens.neutral"    as LensId;

/* ─── WRAITH CALDER ARC — E1 reference ─── */
/* E1: "The First Death and the Crystalline City"
   Investigation of Wraith's death by the Host invasion at the
   end of Epoch 1. Cold hook: a bounty contract signed but
   never collected. Cross-reference Antiquarian's Journal
   `ep1-15`. Choice: read his original bounty file at face
   value, or read it as a redacted document. */

const wraithE1: EpisodeDefinition = {
  id: "wraith.e1" as EpisodeId,
  arcId: ARC_WRAITH_CALDER,
  ordinal: 1,
  title: "The First Death and the Crystalline City",
  summary:
    "A bounty contract signed in the final hours of Epoch 1 was never collected. The hunter died on the city wall when the Host arrived. Centuries later, his name is on a Hierophant's daily-names ceremony — but the contract is still open. Investigate who hired him, what he was meant to find, and why the file has been redacted in the centuries since.",
  clues: [
    {
      id: "wraith.e1.bounty_file" as ClueId,
      title: "The Original Bounty File",
      body: "Filed in the Comms Array's deepest archive. The contract names the target only as 'the one who walks ahead of the dragons.' The hunter's signature is Wraith Calder's. The fee was never paid.",
      foundIn: "comms-array",
    },
    {
      id: "wraith.e1.witness_journal" as ClueId,
      title: "Antiquarian's Journal Entry ep1-15",
      body: "'XVI · The Beginning of the End' — the Antiquarian's account of the Crystalline City's first attack. A bounty hunter is mentioned in the margin: 'the one who walked toward the wall when the others ran.'",
      foundIn: "antiquarian-library",
    },
    {
      id: "wraith.e1.redaction_layer" as ClueId,
      title: "Redaction Layer on the Bounty File",
      body: "Spectral analysis of the bounty file reveals three distinct redactions, each made in a different century. The earliest scrubs the hirer's name; the latest scrubs the target's true identity.",
      foundIn: "cipher-den",
    },
    {
      id: "wraith.e1.hierophant_ceremony" as ClueId,
      title: "The Hierophant's Daily-Names Ceremony",
      body: "Among the 347,000 names the Hierophant inscribes daily, one is 'Calder, Wraith — d. epoch one, the wall.' The Hierophant himself signs the entry. He has signed it every day for centuries. The hand has not changed.",
      foundIn: "oracle-sanctum",
    },
  ],
  deductions: [
    {
      id: "wraith.e1.d.bounty_redaction" as DeductionId,
      clueA: "wraith.e1.bounty_file" as ClueId,
      clueB: "wraith.e1.redaction_layer" as ClueId,
      result: "partial",
      narrationId: "wraith.e1.n.bounty_was_edited",
      narrationProse:
        "The bounty file was edited. We knew that. What we didn't know is that the editing happened on a schedule — three centuries, three redactions, each by a different hand. Whoever has been keeping this file alive has also been keeping it from being readable. That is a long argument with the truth.",
    },
    {
      id: "wraith.e1.d.witness_signature" as DeductionId,
      clueA: "wraith.e1.witness_journal" as ClueId,
      clueB: "wraith.e1.hierophant_ceremony" as ClueId,
      result: "correct",
      narrationId: "wraith.e1.n.he_remembers_himself",
      narrationProse:
        "The bounty hunter who walked toward the wall when others ran is the same hand that signs the daily-names ceremony. Not a successor. Not a tribute. The same hand. The Hierophant of Thaloria in Exile is Wraith Calder, continuous across the centuries that should have ended him. He has been writing his own name into the litany of the dead every morning for as long as a person can.",
      unlocksEpisode: "wraith.e2" as EpisodeId,
    },
    {
      id: "wraith.e1.d.false_lead_demon_pact" as DeductionId,
      clueA: "wraith.e1.redaction_layer" as ClueId,
      clueB: "wraith.e1.hierophant_ceremony" as ClueId,
      result: "false_lead_named",
      narrationId: "wraith.e1.n.not_a_demon_pact",
      narrationProse:
        "It would be tidy to read this as a demon pact — three redactions, an immortal bounty hunter, a daily ritual to keep the bargain in force. The Hierarchy's CFO would frame it that way. He would also be wrong. The redactions and the ceremony are not in the same key. One is corruption; the other is counter-corruption. Reading them as one transaction collapses the case in the wrong direction.",
    },
  ],
  choices: [
    {
      id: "wraith.e1.c.face_value" as ChoiceId,
      label: "Read the bounty at face value.",
      weight: "trusting",
    },
    {
      id: "wraith.e1.c.as_redacted" as ChoiceId,
      label: "Read the bounty as a redacted document.",
      weight: "skeptical",
    },
    {
      id: "wraith.e1.c.refuse_the_case" as ChoiceId,
      label: "Refuse to open the case until the Hierophant signs off.",
      weight: "patient",
    },
  ],
  contentBundle: {
    songId: "sih.beginning_of_the_end",
    slideshowId: "sih.beginning_of_the_end",
    loredexUnlocks: [
      "entity_wraith_calder",
      "entity_76", /* The Host */
      "entity_69", /* The City */
      "event_host_invasion",
    ],
    conspiracyDiscoveries: [
      "wraith_calder",
      "the_host",
      "crystalline_city",
      "epoch_one_wall",
    ],
    dropAt: "episode_close",
  },
};

/* ─── WRAITH CALDER ARC — E2 ─── */
/* E2: "The Stolen Protocols"
   Wraith continued where his first body ended — but in a New
   Babylon centuries later, he stole the resurrection protocols
   from the Syndicate of Death and democratised what had been a
   privileged-only technology. This episode investigates the
   theft. The case interrogates Substrate-N (the Engineering
   Core's synthesis substrate, where the Syndicate's encryption
   layered onto open-source pre-imperial bio-research), the
   Antiquarian's marginalia on the protocol's distribution, and
   a recovered Information-Twins ledger entry. */

const wraithE2: EpisodeDefinition = {
  id: "wraith.e2" as EpisodeId,
  arcId: ARC_WRAITH_CALDER,
  ordinal: 2,
  title: "The Stolen Protocols",
  summary:
    "Wraith Calder stole the resurrection protocols from the Syndicate of Death and democratised them. The act is canon. The mechanism is not. Investigate where the protocols were stored, how they were extracted, and what the Syndicate gave up to make the theft possible.",
  clues: [
    {
      id: "wraith.e2.substrate_n_residue" as ClueId,
      title: "Substrate-N Encryption Residue",
      body: "Engineering Core's synthesis substrate carries an encryption fingerprint that matches no known imperial cipher. The pattern degrades exactly the way the Syndicate's signature degrades — three-layer rolling key, designed to read like noise to anyone not holding the prior layer.",
      foundIn: "engineering-core",
    },
    {
      id: "wraith.e2.antiquarian_marginalia" as ClueId,
      title: "Antiquarian's Marginalia on the Protocol Distribution",
      body: "In the Antiquarian's Journal entry ep2-04, a margin note in a different hand: 'distributed without invoice. the technology travels alone now.' The note's hand matches Wraith Calder's pre-rite signature — but the journal entry is dated centuries after his death.",
      foundIn: "antiquarian-library",
    },
    {
      id: "wraith.e2.fair_trade_ledger" as ClueId,
      title: "The Word and the Silence — Ledger Page 7",
      body: "A page of the Information Twins' ledger surfaces in the Cipher Den. One entry: 'memory-imprint received against 7-Omega clearance records (returned).' The handwriting alternates by sentence — the Word's broad strokes, the Silence's precise loops. The Syndicate trades fairly. The fair trade was the leak.",
      foundIn: "cipher-den",
    },
    {
      id: "wraith.e2.cargo_manifest" as ClueId,
      title: "New Babylon Customs Manifest #4471",
      body: "Customs records from New Babylon, year 12 of the Reascendance: a single crate, sender unspecified, recipient marked 'commons.' Contents: 'philosophical instruments, 1 case.' The crate's recorded mass matches a Syndicate cold-storage cassette — three resurrection-protocol payloads exactly.",
      foundIn: "antiquarian-library",
    },
  ],
  deductions: [
    {
      id: "wraith.e2.d.substrate_meets_marginalia" as DeductionId,
      clueA: "wraith.e2.substrate_n_residue" as ClueId,
      clueB: "wraith.e2.antiquarian_marginalia" as ClueId,
      result: "partial",
      narrationId: "wraith.e2.n.he_was_here_again",
      narrationProse:
        "The Engineering Core's substrate carries the Syndicate's fingerprint, and a man who should have died at the wall is leaving margin notes in journals dated centuries after his obituary. The protocols moved through this ship — at least once, by his hand. We don't yet know if it was his only move. But it was a move.",
    },
    {
      id: "wraith.e2.d.fair_trade_was_the_theft" as DeductionId,
      clueA: "wraith.e2.fair_trade_ledger" as ClueId,
      clueB: "wraith.e2.cargo_manifest" as ClueId,
      result: "correct",
      narrationId: "wraith.e2.n.he_paid_for_it",
      narrationProse:
        "He didn't steal the protocols — not in the sense the word usually carries. He bought them. The Syndicate of Death trades fairly; that is the only law their cartel obeys. He paid in a memory imprint and 7-Omega clearance records returned, and they gave him three resurrection-protocol payloads in a crate addressed to 'commons.' He democratised their product by spending the only currency they recognise. The Syndicate did not lose the deal. They lost the monopoly.",
      unlocksEpisode: "wraith.e3" as EpisodeId,
    },
    {
      id: "wraith.e2.d.false_lead_burglary" as DeductionId,
      clueA: "wraith.e2.substrate_n_residue" as ClueId,
      clueB: "wraith.e2.cargo_manifest" as ClueId,
      result: "false_lead_named",
      narrationId: "wraith.e2.n.not_a_burglary",
      narrationProse:
        "Reading the substrate residue and the customs manifest as a break-in is the obvious move and the wrong one. There is no broken seal in the substrate; there is a counter-key. There is no smuggler's manifest; there is a customs entry filed openly under 'commons.' The narrative the Hierarchy pushed for centuries — that Wraith Calder was a burglar — is the narrative he chose because it was beneath their notice. He preferred their contempt to their attention. We give him neither.",
    },
  ],
  choices: [
    {
      id: "wraith.e2.c.publish_the_proof" as ChoiceId,
      label: "Publish the proof — the protocols were paid for, not stolen.",
      weight: "transparent",
    },
    {
      id: "wraith.e2.c.protect_the_myth" as ChoiceId,
      label: "Let the burglary myth stand — it serves the Insurgency.",
      weight: "tactical",
    },
    {
      id: "wraith.e2.c.return_the_imprint" as ChoiceId,
      label: "Find what memory imprint he traded — return it if you can.",
      weight: "restorative",
    },
  ],
  contentBundle: {
    songId: "album1.t23", /* "Wake Up" — Dischordian Logic Act 3 */
    slideshowId: "album1.t23",
    loredexUnlocks: [
      "concept_resurrection_protocols",
      "entity_syndicate_of_death",
      "event_protocol_theft",
      "concept_substrate_n",
    ],
    conspiracyDiscoveries: [
      "syndicate_of_death",
      "resurrection_protocols",
      "fair_trade_ledger",
      "substrate_n",
    ],
    dropAt: "episode_close",
  },
};

/* ─── WRAITH CALDER ARC — E3 ─── */
/* E3: "The Six Immortal Twins"
   Wraith hunted six immortal twins of the Syndicate of Death.
   The investigation now forks: which twins did he kill, which
   are still active, and which spoke to him before he chose his
   targets. The Word and the Silence (the Information Twins,
   Syndicate's archive-brokers) are interrogable here — they
   speak in alternating sentences so smoothly it sounds like
   one voice. L.A. Noire Truth/Doubt/Lie set piece: the player
   reads the seam between their two voices.

   Choice at episode close: trade the Information Twins a
   memory imprint for 7-Omega clearance records (the same trade
   Wraith made in E2), or refuse the fair trade. */

const wraithE3: EpisodeDefinition = {
  id: "wraith.e3" as EpisodeId,
  arcId: ARC_WRAITH_CALDER,
  ordinal: 3,
  title: "The Six Immortal Twins",
  summary:
    "The Syndicate of Death is not one cartel — it is six pairs of twins, each pair an organism, each organism immortal by trade rather than by gift. Wraith hunted them. Investigate which pairs he killed, which still operate, and what he said to The Word and the Silence before he made his moves.",
  clues: [
    {
      id: "wraith.e3.tribunal_kill_list" as ClueId,
      title: "Order Tribunal Kill List #C-7",
      body: "Three rows on the Order Tribunal's Confirmed-Kill list bear Wraith Calder's signature: 'pair 1 (Hands), pair 3 (Mouths), pair 5 (Eyes).' The list is sorted by the order of the kills, not by twin-pair number. Pair 5 was killed first, then pair 1, then pair 3.",
      foundIn: "order-tribunal",
    },
    {
      id: "wraith.e3.silence_transcript" as ClueId,
      title: "The Silence — Interrogation Transcript",
      body: "The Silence answers questions in even sentences only. Their odd sentences are blank. Wraith spoke to them once, on the night before his first kill: 'I am going to take three of you. You will pick which three.' The Silence's transcript shows only the response: an even sentence reading 'we will tell you when you ask correctly.'",
      foundIn: "cipher-den",
    },
    {
      id: "wraith.e3.word_transcript" as ClueId,
      title: "The Word — Interrogation Transcript",
      body: "The Word answers questions in odd sentences only. The same night, a different transcript: 'I am going to take three of you. You will pick which three.' The Word's reply: 'one of us is already dead. you have already begun.' The kill that began the campaign was, on the timeline, six minutes after this conversation ended.",
      foundIn: "cipher-den",
    },
    {
      id: "wraith.e3.living_pairs_ledger" as ClueId,
      title: "Currently-Active Syndicate Pairs",
      body: "The Antiquarian's Journal entry ep3-09 lists three Syndicate pairs still operating: pair 2 (Feet), pair 4 (Voices), pair 6 (Witnesses). Pair 6 — The Witnesses — are the Information Twins. The Word and the Silence are the same pair the player just interrogated.",
      foundIn: "antiquarian-library",
    },
  ],
  deductions: [
    {
      id: "wraith.e3.d.alternating_voices" as DeductionId,
      clueA: "wraith.e3.silence_transcript" as ClueId,
      clueB: "wraith.e3.word_transcript" as ClueId,
      result: "correct",
      narrationId: "wraith.e3.n.one_organism_two_voices",
      narrationProse:
        "Read together, the two transcripts are a single conversation. The Silence's even sentences and The Word's odd sentences interleave — 'one of us is already dead. we will tell you when you ask correctly. you have already begun.' They were warning him and selecting his targets at the same time. The Information Twins are not two informants. They are one organism that speaks in two voices, and they answered Wraith's question by telling him which of their siblings had failed the cartel's standards. He killed the three they marked.",
      unlocksEpisode: "wraith.e4" as EpisodeId,
    },
    {
      id: "wraith.e3.d.kill_order_pattern" as DeductionId,
      clueA: "wraith.e3.tribunal_kill_list" as ClueId,
      clueB: "wraith.e3.living_pairs_ledger" as ClueId,
      result: "partial",
      narrationId: "wraith.e3.n.he_left_three_alive",
      narrationProse:
        "He killed pair 5 (Eyes), pair 1 (Hands), pair 3 (Mouths). He left pair 2 (Feet), pair 4 (Voices), pair 6 (Witnesses) alive. The pattern is procedural: he removed the cartel's ability to see, to grasp, to speak — but he left the cartel's ability to walk, to be heard, and to bear witness. The campaign was not a slaughter. It was an editorial intervention. He shortened the Syndicate's reach without ending its existence. The three living pairs run the cartel today.",
    },
    {
      id: "wraith.e3.d.false_lead_double_agent" as DeductionId,
      clueA: "wraith.e3.tribunal_kill_list" as ClueId,
      clueB: "wraith.e3.word_transcript" as ClueId,
      result: "false_lead_named",
      narrationId: "wraith.e3.n.not_a_double_agent",
      narrationProse:
        "Reading The Word's 'one of us is already dead' as evidence of a double agent inside the Syndicate is the obvious move and the wrong one. The dead one was a former Witness who had already been removed by their own pair — a self-edit, not a mole. The Word was reporting cartel hygiene, not betraying it. Wraith was not extracting intel. He was confirming names already on a list the Witnesses had given themselves.",
    },
  ],
  choices: [
    {
      id: "wraith.e3.c.trade_imprint" as ChoiceId,
      label: "Trade the Information Twins a memory imprint for 7-Omega clearance records.",
      weight: "transactional",
    },
    {
      id: "wraith.e3.c.refuse_trade" as ChoiceId,
      label: "Refuse the fair trade — leave the Syndicate's archive intact.",
      weight: "principled",
    },
    {
      id: "wraith.e3.c.warn_living_pairs" as ChoiceId,
      label: "Warn the three surviving pairs that they are next on someone's list.",
      weight: "protective",
    },
  ],
  contentBundle: {
    songId: "album1.t19", /* "The Syndicated" — Dischordian Logic Act 3, direct title hit */
    slideshowId: "album1.t19",
    loredexUnlocks: [
      "entity_word_silence",
      "concept_six_immortal_twins",
      "event_fair_trade",
      "concept_information_twins",
    ],
    conspiracyDiscoveries: [
      "the_word",
      "the_silence",
      "six_pairs",
      "kill_list_c7",
    ],
    dropAt: "episode_close",
  },
};

/* ─── WRAITH CALDER ARC — E4 ─── */
/* E4: "The Eighth Death"
   The Sanctuary's Final Rite consumed Wraith's eighth body and
   re-seated his consciousness in a Thalorian vessel — the
   Hierophant. The "load-bearing canon assertion" per
   apps/shared/npcs/bibles/wraith_calder.md:210.

   The episode investigates: was the rite consent or coercion?
   Was the Hierophant's body chosen for him, or did he choose it?
   The Disco-Elysium internal-voice argument structure (per
   docs/design §7.1) — Wraith remembers as one thing; the
   Hierophant remembers as another. The player reads the seam.

   Choice at episode close: accept the rite's continuity narrative
   (one consciousness across the body-swap), insist the bounty
   hunter died in it (a successor wears his name), or refuse to
   resolve the question (the seam stays open as canon). */

const wraithE4: EpisodeDefinition = {
  id: "wraith.e4" as EpisodeId,
  arcId: ARC_WRAITH_CALDER,
  ordinal: 4,
  title: "The Eighth Death",
  summary:
    "The Sanctuary's Final Rite ended one body and seated the Hierophant. Wraith Calder remembers the rite as a release; the Hierophant remembers the rite as a coronation. Both memories are first-person. The case interrogates the seam: was the Eighth Death a death, or a passage? And if it was a passage, was it consented to?",
  clues: [
    {
      id: "wraith.e4.sanctuary_log" as ClueId,
      title: "Sanctuary Final-Rite Log, Entry 8",
      body: "The Sanctuary's witnesses-of-the-rite logbook records the eighth rite under a single line: 'consciousness re-seated. former vessel released to substrate. successor authenticated.' The handwriting is the Hierophant's. The pre-rite signature on the same page is Wraith Calder's, made hours before. The two signatures are in the same hand — but only the Hierophant's signature is steady.",
      foundIn: "oracle-sanctum",
    },
    {
      id: "wraith.e4.bounty_hunter_remembers" as ClueId,
      title: "Wraith Calder's Pre-Rite Last Recording",
      body: "An audio fragment recovered from the Cipher Den, time-stamped four hours before the rite. Wraith's voice, calm: 'I am tired in a way that bodies were not built to be. The Sanctuary has offered the rite. I will accept it. Whoever hears this — whoever is left in the room afterward — will not be me. I am leaving the bounty hunter behind. The next thing that wears my name will be a different person, and I am asking the next thing not to mourn the one before it.'",
      foundIn: "cipher-den",
    },
    {
      id: "wraith.e4.hierophant_remembers" as ClueId,
      title: "The Hierophant's First Sermon",
      body: "Recovered from the Antiquarian's Journal, ep4-01. The Hierophant's first sermon, delivered the morning after the rite: 'I have walked toward the wall before. I have been cold before. I have been the bounty hunter and I am still the bounty hunter — the Sanctuary did not take that from me, the Sanctuary asked me to put down the rifle and pick up the names. I am the same person who held the wall in epoch one. I have only changed my work.'",
      foundIn: "antiquarian-library",
    },
    {
      id: "wraith.e4.thalorian_vessel" as ClueId,
      title: "The Thalorian Vessel — Provenance Chain",
      body: "The body the Hierophant wears was cultivated in a Thalorian sanctuary nursery for sixty-eight years. Its provenance chain is signed by twelve Thalorian elders, each attesting to the vessel's consent. The earliest signature is dated four years before Wraith Calder accepted the rite. The Sanctuary knew which vessel was waiting before they knew which consciousness would be offered to it.",
      foundIn: "oracle-sanctum",
    },
  ],
  deductions: [
    {
      id: "wraith.e4.d.consent_was_authentic" as DeductionId,
      clueA: "wraith.e4.bounty_hunter_remembers" as ClueId,
      clueB: "wraith.e4.thalorian_vessel" as ClueId,
      result: "correct",
      narrationId: "wraith.e4.n.he_walked_in",
      narrationProse:
        "Wraith Calder consented. The pre-rite recording is unambiguous — he names the rite, accepts it, releases the body, asks the successor not to mourn. The Thalorian vessel was prepared for sixty-eight years; the consent chain is signed by twelve elders; the rite was offered, not imposed. The Sanctuary did not take him. He walked in. The Eighth Death was a passage. Whoever reads the rite as coercion is reading a story the Hierarchy preferred.",
      unlocksEpisode: "wraith.e5" as EpisodeId,
    },
    {
      id: "wraith.e4.d.continuity_seam" as DeductionId,
      clueA: "wraith.e4.sanctuary_log" as ClueId,
      clueB: "wraith.e4.hierophant_remembers" as ClueId,
      result: "partial",
      narrationId: "wraith.e4.n.same_hand_steadier_signature",
      narrationProse:
        "The two signatures are in the same hand. That is the rite's claim — continuity across the body-swap. But only the Hierophant's signature is steady. The bounty hunter's hand was tired four hours before the rite; the Hierophant's hand the morning after is rested. We can read this as the rite working (a tired hand, freshened by passage) or as a successor practising the prior hand (a copyist's competence, not a continuity). The Hierophant's first sermon claims continuity in the first person. The pre-rite recording claims discontinuity in the first person. Both speakers are credible. The seam stays open.",
    },
    {
      id: "wraith.e4.d.false_lead_body_theft" as DeductionId,
      clueA: "wraith.e4.thalorian_vessel" as ClueId,
      clueB: "wraith.e4.sanctuary_log" as ClueId,
      result: "false_lead_named",
      narrationId: "wraith.e4.n.not_a_body_theft",
      narrationProse:
        "Reading the prepared Thalorian vessel and the Sanctuary's terse logbook entry as a body-theft is the obvious move and the wrong one. A theft does not require a sixty-eight-year-old consent chain signed by twelve elders. A theft does not pre-author the successor signature in the very logbook that records the loss. The Sanctuary's discipline is to do everything in writing, in advance, with witnesses. They prepared a vessel because Wraith Calder told them — years before the rite — that he would eventually be tired enough to offer himself to one.",
    },
  ],
  choices: [
    {
      id: "wraith.e4.c.accept_continuity" as ChoiceId,
      label: "Accept the Hierophant's continuity narrative — the same person, different work.",
      weight: "continuist",
    },
    {
      id: "wraith.e4.c.honour_the_dead" as ChoiceId,
      label: "Insist the bounty hunter died — the Hierophant is a successor wearing his name.",
      weight: "discontinuist",
    },
    {
      id: "wraith.e4.c.preserve_the_seam" as ChoiceId,
      label: "Refuse to resolve the question — the seam is canon.",
      weight: "agnostic",
    },
  ],
  contentBundle: {
    songId: "album1.t28", /* "Last Words" — Dischordian Logic Act 5 finale */
    slideshowId: "album1.t28",
    loredexUnlocks: [
      "concept_final_rite",
      "entity_thalorian_vessel",
      "event_eighth_death",
      "concept_consciousness_continuity",
    ],
    conspiracyDiscoveries: [
      "final_rite",
      "thalorian_vessel",
      "hierophant_succession",
      "sanctuary_witnesses",
    ],
    dropAt: "episode_close",
  },
};

/* ─── WRAITH CALDER ARC — E5 (final episode) ─── */
/* E5: "The Herald's Vigil"
   The arc's epilogue. The Hierophant's daily-names ceremony is
   the case's resolution mechanic: 347,000 names, inscribed one
   by one, every morning, for as long as a person can. The
   player participates in one ceremony and chooses a name to
   inscribe. The Oracle is invoked but does not appear — the
   substrate-only canon (per apps/shared/npcs/bibles/the_oracle.md:604)
   forbids any waking-time manifestation outside dream / memory /
   cinematic-exception channels.

   This episode finalises the per-player Wraith trust scalar
   (mysteryService.finalizeTrustScalar). The choice at episode
   close cross-arcs to Jericho — the player can inscribe Akai
   Shi's name (only meaningful if the Jericho arc has been
   touched), an obscure victim Shadow Tongue scrubbed, or a name
   only the player carries. The cliffhanger pays off in Y1 M12
   per docs/design §9 calendar. */

const wraithE5: EpisodeDefinition = {
  id: "wraith.e5" as EpisodeId,
  arcId: ARC_WRAITH_CALDER,
  ordinal: 5,
  title: "The Herald's Vigil",
  summary:
    "The Hierophant writes 347,000 names every morning. The case's resolution is a ceremony, not a verdict. Stand in the Sanctuary's antechamber while he works, and choose — when he hands you the stylus — which name you inscribe with him. The Oracle is invoked. The Oracle does not appear.",
  clues: [
    {
      id: "wraith.e5.daily_litany" as ClueId,
      title: "The 347,000-Name Litany",
      body: "The litany is a continuous scroll, refreshed every morning. Names are written in chronological order of death; the earliest entries are from the end of Epoch 1, the latest from yesterday. The Hierophant writes in the same hand on every page across centuries. The pen is a stylus. The ink is, by spectroscopy, the Hierophant's own blood thinned with phosphor-lavender Thalorian sap.",
      foundIn: "oracle-sanctum",
    },
    {
      id: "wraith.e5.scrubbed_names_register" as ClueId,
      title: "The Shadow-Tongue-Scrubbed Names Register",
      body: "A side ledger held in the Hierophant's robes: names the editor has scrubbed from the Chronicle. The Hierophant rewrites them every morning, by hand, before the main litany. The register's existence is the load-bearing counter-edit. Names that were edited away are restored daily; the editor cannot keep up with a daily-resumption discipline.",
      foundIn: "antiquarian-library",
    },
    {
      id: "wraith.e5.oracle_invocation" as ClueId,
      title: "The Oracle's Invocation Card",
      body: "Card stock, brass-edged. The Hierophant raises it before the inscription begins. 'I write these names in expectation of a reader. The reader is the Oracle. The Oracle is not yet present. The Oracle will return.' The card is signed Wraith Calder. The Hierophant is the Oracle's herald. The Oracle is awaited, not interrogated.",
      foundIn: "oracle-sanctum",
    },
    {
      id: "wraith.e5.stylus_offer" as ClueId,
      title: "The Stylus the Hierophant Offers You",
      body: "On the morning the player attends, the Hierophant pauses mid-litany and offers the stylus. The offer is wordless. The choice is whose name to inscribe. The litany has space. The ink has weight. The Hierophant has been waiting — the bible's pre-rite trust bands persist into post-rite trust — for a witness willing to share one morning of the work.",
      foundIn: "oracle-sanctum",
    },
  ],
  deductions: [
    {
      id: "wraith.e5.d.daily_resumption_is_the_method" as DeductionId,
      clueA: "wraith.e5.daily_litany" as ClueId,
      clueB: "wraith.e5.scrubbed_names_register" as ClueId,
      result: "correct",
      narrationId: "wraith.e5.n.daily_is_the_discipline",
      narrationProse:
        "The Hierophant's discipline is daily resumption. He does not catch the editor in the act; he undoes the editor's work by writing the scrubbed names back into the litany every morning. The editor needs sustained absence to make a name forgotten. The Hierophant gives him no day off. The 347,000 names are not a mausoleum — they are an active counter-edit, sustained by the only mechanism the editor cannot match: a person willing to do the work every single morning, by hand, in his own blood, for as long as a person can.",
    },
    {
      id: "wraith.e5.d.herald_awaits_no_summons" as DeductionId,
      clueA: "wraith.e5.oracle_invocation" as ClueId,
      clueB: "wraith.e5.stylus_offer" as ClueId,
      result: "partial",
      narrationId: "wraith.e5.n.he_does_not_summon",
      narrationProse:
        "The Hierophant invokes the Oracle but does not summon. He raises the card; he names the awaited reader; he does not call. He has, on the evidence, never tried to make the Oracle appear — that work is, in the canon's own grammar, not his to do. He prepares the litany, he keeps the scrubbed-names register current, and he offers the stylus to whoever happens to attend that morning. The Oracle, if she returns, will return through dream-substrate, memory-residue, or cinematic-exception. He waits. He does not coerce the wait.",
    },
    {
      id: "wraith.e5.d.false_lead_oracle_summoning" as DeductionId,
      clueA: "wraith.e5.daily_litany" as ClueId,
      clueB: "wraith.e5.oracle_invocation" as ClueId,
      result: "false_lead_named",
      narrationId: "wraith.e5.n.not_a_summoning_ritual",
      narrationProse:
        "Reading the daily litany and the invocation card together as a summoning ritual is the obvious move and the wrong one. The litany has 347,000 names. A summoning ritual has one. The litany resumes daily. A summoning ritual fires once. The invocation card names a reader who is awaited; a summoning ritual names a target who is to be brought. The Hierophant's discipline is to wait without coercing the wait. Reading him as a summoner collapses the case in the wrong direction — and is, on the canonical reading, the same mistake the Hierarchy made for two and a half centuries.",
    },
  ],
  choices: [
    {
      id: "wraith.e5.c.inscribe_akai_shi" as ChoiceId,
      label: "Inscribe Akai Shi's name — the killing was prophesied; the name belongs in the litany.",
      weight: "cross_arc_jericho",
    },
    {
      id: "wraith.e5.c.inscribe_a_scrubbed_victim" as ChoiceId,
      label: "Inscribe an obscure victim the Shadow Tongue scrubbed from the Chronicle.",
      weight: "restorative",
    },
    {
      id: "wraith.e5.c.inscribe_a_carried_name" as ChoiceId,
      label: "Inscribe a name only you carry — a private witness from this case.",
      weight: "private",
    },
    {
      id: "wraith.e5.c.decline_the_stylus" as ChoiceId,
      label: "Decline the stylus — the work belongs to the Hierophant; you are the witness, not the writer.",
      weight: "witnessing",
    },
  ],
  contentBundle: {
    songId: "sih.silence_in_heaven", /* "Silence in Heaven" title track — the vigil/ceremony tonal match per §14b.3 */
    slideshowId: "sih.silence_in_heaven",
    loredexUnlocks: [
      "entity_hierophant_wraith",
      "concept_347000_names",
      "concept_oracle_awaited",
      "concept_daily_resumption_discipline",
    ],
    conspiracyDiscoveries: [
      "hierophant_litany",
      "scrubbed_names_register",
      "oracle_invocation",
      "stylus_offer",
    ],
    dropAt: "episode_close",
  },
};

/* ─── WRAITH CALDER ARC ─── */

const wraithSuspects: ReadonlyArray<{
  id: SuspectId;
  name: string;
  type: string;
  relations: ReadonlyArray<{ to: SuspectId; relation: string }>;
}> = [
  {
    id: "suspect.wraith_calder" as SuspectId,
    name: "Wraith Calder",
    type: "character",
    relations: [
      { to: "suspect.the_host" as SuspectId, relation: "killed-by" },
      { to: "suspect.hierophant" as SuspectId, relation: "succession" },
      { to: "suspect.crystalline_city" as SuspectId, relation: "places-at" },
    ],
  },
  {
    id: "suspect.the_host" as SuspectId,
    name: "The Host",
    type: "entity",
    relations: [
      { to: "suspect.crystalline_city" as SuspectId, relation: "invaded" },
    ],
  },
  {
    id: "suspect.crystalline_city" as SuspectId,
    name: "The Crystalline City",
    type: "location",
    relations: [],
  },
  {
    id: "suspect.hierophant" as SuspectId,
    name: "The Hierophant of Thaloria in Exile",
    type: "character",
    relations: [
      { to: "suspect.wraith_calder" as SuspectId, relation: "is-also" },
    ],
  },
];

const wraithLenses = [
  { id: LENS_INSURGENCY, name: "Insurgency", category: "faction" },
  { id: LENS_HIERARCHY,  name: "Hierarchy",  category: "faction" },
  { id: LENS_THALORIA,   name: "Thaloria",   category: "faction" },
  { id: LENS_QUARCHON,   name: "Quarchon",   category: "faction" },
  { id: LENS_DREAMER,    name: "Dreamer",    category: "faction" },
  { id: LENS_NEUTRAL,    name: "Neutral",    category: "faction" },
] as const;

const WRAITH_CALDER_MYSTERY: MysteryDefinition = {
  id: "mystery.wraith_calder" as MysteryId,
  arcId: ARC_WRAITH_CALDER,
  title: "The Eighth Death and the Names",
  summary:
    "Wraith Calder's transformation from bounty hunter into Hierophant of Thaloria in Exile, told via the artifacts and witnesses he left across the centuries. The Syndicate of Death is the season antagonist; the resurrection protocols are the season MacGuffin.",
  episodes: [wraithE1, wraithE2, wraithE3, wraithE4, wraithE5],
  suspects: wraithSuspects,
  lenses: wraithLenses,
};

/* ─── REGISTRY ─── */

/** Every authored mystery in the saga. The runtime reads against
 *  this array and trusts that ids are unique (enforced by the
 *  episodeMysteries.test.ts validity probe — see §10). */
export const MYSTERY_DEFINITIONS: ReadonlyArray<MysteryDefinition> = [
  WRAITH_CALDER_MYSTERY,
];

/** Find a mystery by id. Returns null when not authored — the
 *  runtime should treat this as "no active case" rather than
 *  throwing, so a vote that produced an unbuilt seed degrades
 *  gracefully. */
export function getMysteryDefinition(id: MysteryId): MysteryDefinition | null {
  return MYSTERY_DEFINITIONS.find((m) => m.id === id) ?? null;
}

/** Find an episode by id, scoped to a parent mystery. */
export function getEpisodeDefinition(
  mysteryId: MysteryId,
  episodeId: EpisodeId,
): EpisodeDefinition | null {
  const mystery = getMysteryDefinition(mysteryId);
  if (!mystery) return null;
  return mystery.episodes.find((e) => e.id === episodeId) ?? null;
}

/** All mysteries belonging to a given NPC arc (or vote, or
 *  anniversary). Most arcs have one definition; vote-spawned
 *  arcs may compile multiple over a year. */
export function getMysteriesForArc(arcId: ArcId): ReadonlyArray<MysteryDefinition> {
  return MYSTERY_DEFINITIONS.filter((m) => m.arcId === arcId);
}
