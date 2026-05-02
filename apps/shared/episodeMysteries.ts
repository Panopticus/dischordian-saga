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
  npcId: "wraith_calder",
  episodes: [wraithE1, wraithE2, wraithE3, wraithE4, wraithE5],
  suspects: wraithSuspects,
  lenses: wraithLenses,
};

/* ─── JERICHO JONES ARC — E1 ─── */
/* E1: "The Recruit"
   First contact with Jericho. Per docs/design/STREAMED_PRISM_MYSTERY_ENGINE.md
   §7.2: cold hook is the Degen's ledger — a single "Iron Lion
   training" line with no fee. A gift, which is the one thing
   the Degen doesn't do.

   Sets up the arc's central question: why is the Degen
   training an Insurgency Lion on a casino timeline? The
   answer arrives in E5 — for now, this episode catalogues the
   anomaly. */

const jerichoE1: EpisodeDefinition = {
  id: "jericho.e1" as EpisodeId,
  arcId: ARC_JERICHO_JONES,
  ordinal: 1,
  title: "The Recruit",
  summary:
    "Jericho Jones is being trained as the new Iron Lion under the Degen's mediation on the Heart of Time. The training has no invoice. Investigate why a casino broker who never gives anything away is giving Jericho the most expensive item in his catalogue.",
  clues: [
    {
      id: "jericho.e1.degens_ledger" as ClueId,
      title: "The Degen's Ledger Entry — Iron Lion Training",
      body: "A single line in the Degen's running ledger: 'Iron Lion training — Jericho Jones — fee deferred.' No deferral period. No collateral. No interest schedule. The Degen has never written 'fee deferred' in any other entry across the ledger's 412 pages. The line is in his own hand.",
      foundIn: "casino",
    },
    {
      id: "jericho.e1.heart_of_time_manifest" as ClueId,
      title: "Heart of Time — Trainee Manifest",
      body: "The Heart of Time's trainee log lists Jericho Jones as having logged sixty-eight hours of Iron Lion-discipline work over the last month — combat forms, doctrinal reading, witness procedure. The log notes a sparring partner: the Degen himself. The Degen does not spar. Has not, by reputation, sparred since Veridian VI.",
      foundIn: "engineering",
    },
    {
      id: "jericho.e1.iron_lion_callsign_history" as ClueId,
      title: "The Iron Lion Callsign — Inheritance Chain",
      body: "The Iron Lion is a callsign, not a name. The pre-Fall holder destroyed Warlord Prime and died at Veridian VI buying Agent Zero time against Binath VII. Since the Fall, the callsign has been vacant. Jericho would be its second wearer. The Antiquarian's Journal entry ep5-12 notes that the callsign carries a Lionism imprint — a consciousness-residue from the prior holder.",
      foundIn: "antiquarian-library",
    },
    {
      id: "jericho.e1.akai_shi_aftermath" as ClueId,
      title: "Akai Shi — Battle of Thaloria, Aftermath Logs",
      body: "Battle-aftermath logs from Thaloria document Jericho killing Akai Shi to stop the Thought Virus from spreading further. Akai Shi was someone Jericho trusted; the killing was, on the legal side, a mercy under contested doctrine. The Degen was witness to the act and signed the witness page within the hour. He recruited Jericho seventy-two hours later.",
      foundIn: "antiquarian-library",
    },
  ],
  deductions: [
    {
      id: "jericho.e1.d.fee_deferred_is_a_gift" as DeductionId,
      clueA: "jericho.e1.degens_ledger" as ClueId,
      clueB: "jericho.e1.heart_of_time_manifest" as ClueId,
      result: "correct",
      narrationId: "jericho.e1.n.the_degen_does_not_give",
      narrationProse:
        "The Degen does not give. He brokers, he defers, he extends credit at terms that cost more than a fee would have, but he does not give. Yet the ledger says 'fee deferred' with no deferral period — a marker for a debt the Degen has no intention of collecting in the usual currency. And he is sparring with Jericho personally, which he does not do. The Degen is paying the cost of the training himself, in his own hours, against an asset he intends to call in elsewhere. Jericho is being trained for a job the Degen has already taken a contract on.",
      unlocksEpisode: "jericho.e2" as EpisodeId,
    },
    {
      id: "jericho.e1.d.callsign_meets_aftermath" as DeductionId,
      clueA: "jericho.e1.iron_lion_callsign_history" as ClueId,
      clueB: "jericho.e1.akai_shi_aftermath" as ClueId,
      result: "partial",
      narrationId: "jericho.e1.n.the_imprint_recognises",
      narrationProse:
        "The Iron Lion callsign carries a Lionism imprint from the pre-Fall holder. The Degen witnessed Jericho's killing of Akai Shi — a mercy killing under contested doctrine, signed by the Degen within the hour. The Degen recruited Jericho seventy-two hours later. The pattern says: the Degen tested Jericho against the imprint's compatibility and the test passed. We do not yet know whether Jericho's grief is a feature or a bug in that compatibility. We will find out.",
    },
    {
      id: "jericho.e1.d.false_lead_lionism_recruitment" as DeductionId,
      clueA: "jericho.e1.akai_shi_aftermath" as ClueId,
      clueB: "jericho.e1.degens_ledger" as ClueId,
      result: "false_lead_named",
      narrationId: "jericho.e1.n.not_a_standard_lionism_recruitment",
      narrationProse:
        "Reading the Akai Shi killing and the deferred-fee entry as a standard Lionism recruitment is the obvious move and the wrong one. Lionism recruits on character, not on a single act. The Degen is not a Lionism recruiter — he is a placement broker, and he places Lions at premium rates. Whatever job he is positioning Jericho for is not a Lionism job. The Lions are being routed through him to a destination that is not in Lionism's catalogue.",
    },
  ],
  choices: [
    {
      id: "jericho.e1.c.ask_jericho_directly" as ChoiceId,
      label: "Ask Jericho directly about the Degen's interest in him.",
      weight: "direct",
    },
    {
      id: "jericho.e1.c.ask_the_degen" as ChoiceId,
      label: "Ask the Degen about Jericho.",
      weight: "broker_facing",
    },
    {
      id: "jericho.e1.c.watch_in_silence" as ChoiceId,
      label: "Watch the training without intervening — let the contract reveal itself.",
      weight: "patient",
    },
  ],
  contentBundle: {
    songId: "album1.t10", /* "Inner Circle" — Dischordian Logic Act 1 */
    slideshowId: "album1.t10",
    loredexUnlocks: [
      "entity_jericho_jones",
      "concept_iron_lion_callsign",
      "entity_degen",
      "concept_heart_of_time",
    ],
    conspiracyDiscoveries: [
      "jericho_jones",
      "iron_lion_callsign",
      "degen_ledger",
      "akai_shi_aftermath",
    ],
    dropAt: "episode_close",
  },
};

/* ─── JERICHO JONES ARC — E2 ─── */
/* E2: "Akai Shi"
   The flashback episode. Per docs/design/STREAMED_PRISM_MYSTERY_ENGINE.md
   §7.2: "Akai Shi was someone Jericho trusted; the Thought
   Virus had taken her. Police-Quest procedural beat: reconstruct
   the killing in correct order from the witnesses. Disco-Elysium
   internal voices: Sympathetic (the killing was mercy), Pressing
   (the killing was murder), Accusatory (the killing was theft of
   agency). Choice: which framing does Jericho accept when he
   tells the story?"

   The episode's structure is a memory-replay (per the
   investigationSystems.MemoryReplay shape — owner = Jericho).
   The clues are the four witness accounts of the killing,
   each filtered through a different observer's perception. */

const jerichoE2: EpisodeDefinition = {
  id: "jericho.e2" as EpisodeId,
  arcId: ARC_JERICHO_JONES,
  ordinal: 2,
  title: "Akai Shi",
  summary:
    "Reconstruct the moment Jericho killed Akai Shi at the Battle of Thaloria. The Thought Virus had taken her. The killing was mercy under contested doctrine. Four witnesses saw it; each saw a different killing. The case is which witness's reading Jericho accepts as canon when he tells the story.",
  clues: [
    {
      id: "jericho.e2.medic_witness" as ClueId,
      title: "Battlefield Medic — Witness Account",
      body: "The medic's account: Akai Shi was already three minutes past the threshold when Jericho found her. The Thought Virus had taken motor function; she was speaking in a voice not her own. Jericho's hand was steady. He did not hesitate, but he did not hurry. The medic notes the killing as a mercy under triage doctrine: the body was already gone; what remained would have killed the next twelve people Akai Shi reached.",
      foundIn: "medical-bay",
    },
    {
      id: "jericho.e2.degen_witness" as ClueId,
      title: "The Degen — Witness Page Signature",
      body: "The Degen's witness page: a single line of script with no narration. 'Witnessed. The act was correct under contested doctrine. The witness reserves judgment on whether contested doctrine should be the standard.' Signed within the hour, as the trainee manifest's witnesses-of-the-act protocol requires. The reservation-of-judgment line is, in the Degen's documents, a tell — he uses it only when he has not yet decided what the act will cost.",
      foundIn: "comms-array",
    },
    {
      id: "jericho.e2.akai_shi_recording" as ClueId,
      title: "Akai Shi — Pre-Threshold Recording",
      body: "An audio fragment recovered from Akai Shi's personal recorder, time-stamped four minutes before the threshold. Akai Shi's voice, calm: 'If I cross the line, the person who knows me best will be the only one quick enough to do it cleanly. Jericho. Don't tell him this is on file. He'll do it correctly without permission. He needs to be able to live afterward.'",
      foundIn: "cipher-den",
    },
    {
      id: "jericho.e2.thaloria_archon_log" as ClueId,
      title: "Thaloria Archon — Battle-Closing Log",
      body: "The Archon's battle-close log notes the Akai Shi incident as 'a successful intervention against Thought Virus propagation, conducted by an unnamed Insurgency operative under the doctrine of last-mile mercy.' The unnamed-operative redaction is unusual — the Archon names everyone else in the same paragraph. The redaction is in the Archon's own hand. Jericho is being protected from the record.",
      foundIn: "antiquarian-library",
    },
  ],
  deductions: [
    {
      id: "jericho.e2.d.consent_was_pre_recorded" as DeductionId,
      clueA: "jericho.e2.akai_shi_recording" as ClueId,
      clueB: "jericho.e2.medic_witness" as ClueId,
      result: "correct",
      narrationId: "jericho.e2.n.she_consented_in_advance",
      narrationProse:
        "Akai Shi consented in advance. Four minutes before the threshold, she recorded the consent on her personal recorder and asked specifically that Jericho not be told it was on file — because she knew he would do the act correctly without permission, and she wanted him to be able to live afterward. The medic confirms Jericho's hand was steady and unhurried; the threshold was crossed; the killing was mercy under triage doctrine. Jericho did not commit murder. He kept a promise he didn't know he was keeping.",
      unlocksEpisode: "jericho.e3" as EpisodeId,
    },
    {
      id: "jericho.e2.d.degen_reservation" as DeductionId,
      clueA: "jericho.e2.degen_witness" as ClueId,
      clueB: "jericho.e2.thaloria_archon_log" as ClueId,
      result: "partial",
      narrationId: "jericho.e2.n.both_protected_him",
      narrationProse:
        "The Degen reserved judgment on whether contested doctrine should be the standard. The Thaloria Archon redacted Jericho's name from the closing log. Both witnesses, acting independently, protected Jericho from a record that would have made his act readable to the wrong audience. The Degen and the Archon do not coordinate; they do not even like each other. They both protected him because the act was, on the human side, the kind of thing that breaks people — and they both wanted Jericho to have a chance to not be broken by it. We are reading their kindness as a tell. They are reading Jericho's act as evidence of the kind of person he is.",
    },
    {
      id: "jericho.e2.d.false_lead_premeditated" as DeductionId,
      clueA: "jericho.e2.medic_witness" as ClueId,
      clueB: "jericho.e2.thaloria_archon_log" as ClueId,
      result: "false_lead_named",
      narrationId: "jericho.e2.n.not_premeditated",
      narrationProse:
        "Reading the medic's 'his hand was steady' alongside the Archon's redaction as evidence of premeditation is the obvious move and the wrong one. A premeditated act does not require a redaction; it requires a story. The Archon redacted because the absence of a story was the kindest thing she could do for the next twenty years of Jericho's life. The medic noted the steadiness because, in triage doctrine, an unsteady hand is the danger — the steady hand means the operator is conscious of what they are doing. Jericho was conscious. He was not pre-decided. The two are not the same.",
    },
  ],
  choices: [
    {
      id: "jericho.e2.c.accept_mercy" as ChoiceId,
      label: "Sympathetic — Jericho accepts the act as mercy.",
      weight: "sympathetic",
    },
    {
      id: "jericho.e2.c.accept_murder" as ChoiceId,
      label: "Pressing — Jericho accepts the act as murder he must live with.",
      weight: "pressing",
    },
    {
      id: "jericho.e2.c.accept_theft_of_agency" as ChoiceId,
      label: "Accusatory — Jericho accepts the act as theft of Akai Shi's last agency.",
      weight: "accusatory",
    },
    {
      id: "jericho.e2.c.refuse_to_settle" as ChoiceId,
      label: "Refuse to settle on a framing — the act stays unresolved in him.",
      weight: "unresolved",
    },
  ],
  contentBundle: {
    songId: "bod.identity", /* "Identity" — Book of Daniel 2:47 — Kael identity-chain song; Loredex-mapped */
    slideshowId: "bod.identity",
    loredexUnlocks: [
      "entity_akai_shi",
      "event_battle_of_thaloria",
      "concept_thought_virus_vector",
      "concept_mercy_killing",
    ],
    conspiracyDiscoveries: [
      "akai_shi",
      "battle_of_thaloria",
      "degen_reservation",
      "thaloria_archon_redaction",
    ],
    dropAt: "episode_close",
  },
};

/* ─── JERICHO JONES ARC — E3 ─── */
/* E3: "The Imprint Surfaces"
   The pre-Fall Iron Lion's consciousness-imprint bleeds
   through into Jericho's training. Per docs/design/STREAMED_PRISM_MYSTERY_ENGINE.md
   §7.2: "investigation in dreamsWorkshop.ts — the dream-loom
   catches imprints. Cross-link to Wraith arc (resurrection-
   protocol territory: is the imprint a stowaway from the same
   tech?)."

   The episode's cross-arc question is whether the Iron Lion
   imprint and Wraith Calder's resurrection-protocol theft
   share a substrate — i.e., whether Jericho is being
   reconstituted by the same technology Wraith democratised. */

const jerichoE3: EpisodeDefinition = {
  id: "jericho.e3" as EpisodeId,
  arcId: ARC_JERICHO_JONES,
  ordinal: 3,
  title: "The Imprint Surfaces",
  summary:
    "The pre-Fall Iron Lion's consciousness-imprint is bleeding into Jericho's training. He dreams in a hand that isn't his; he holds the rifle a way the previous Iron Lion held it. Investigate whether the imprint is a Lionism feature, a Hierarchy bug, or — cross-arc — a passenger from the same resurrection-protocol substrate Wraith Calder democratised.",
  clues: [
    {
      id: "jericho.e3.dream_loom_capture" as ClueId,
      title: "Dream-Loom Capture #J-0411",
      body: "The Dreams Workshop loom captured a recurring dream from Jericho — the same scene played fourteen nights in a row. A bridge in a valley. A machine army approaching from the south. The dreamer holds his ground for three hours, forty-seven minutes. Jericho has never been to the Bridge of Kael. The pre-Fall Iron Lion held that bridge for exactly that duration before his death.",
      foundIn: "dreams-workshop",
    },
    {
      id: "jericho.e3.lionism_imprint_protocol" as ClueId,
      title: "Lionism Imprint Protocol — Pre-Fall Doctrine",
      body: "The Insurgency's pre-Fall Lionism doctrine documented imprint-resonance as a feature: a successor Lion would receive a partial consciousness-residue from the prior wearer of the callsign. The doctrine notes the residue as 'a gift, not a possession' — the new Lion is meant to read the imprint as advice, not as instruction. The doctrine was never tested in practice. Jericho is the first.",
      foundIn: "antiquarian-library",
    },
    {
      id: "jericho.e3.substrate_n_overlap" as ClueId,
      title: "Substrate-N Cross-Reference (Wraith Cross-Arc)",
      body: "A spectral analysis of the Iron Lion imprint's carrier-signature matches — at three of the eleven measurable parameters — the Substrate-N encryption residue Wraith Calder left in the resurrection-protocol theft. The match is partial. The protocols and the imprint share a substrate; whether the imprint is a Wraith-side passenger or an independent Lionism mechanism is the case's open question.",
      foundIn: "engineering-core",
    },
    {
      id: "jericho.e3.iron_lion_grip_anomaly" as ClueId,
      title: "Sparring-Bay Recording — Grip Anomaly",
      body: "Sparring footage from the Heart of Time shows Jericho switching mid-form to a rifle-grip he was never trained on — a wider Lion-callsign hand-position used by the pre-Fall holder. Jericho is unconscious of the switch. The Degen, watching, marks the moment in his ledger: 'imprint live.' The note is dated three weeks into Jericho's training, two weeks before the dreams started.",
      foundIn: "engineering",
    },
  ],
  deductions: [
    {
      id: "jericho.e3.d.imprint_is_doctrinal" as DeductionId,
      clueA: "jericho.e3.dream_loom_capture" as ClueId,
      clueB: "jericho.e3.lionism_imprint_protocol" as ClueId,
      result: "correct",
      narrationId: "jericho.e3.n.the_imprint_is_a_gift",
      narrationProse:
        "The imprint is doctrinal. The pre-Fall Lionism documented imprint-resonance as a successor's inheritance — a gift, not a possession; advice, not instruction. The dreams of the Bridge of Kael are the prior Iron Lion offering Jericho his three-hour, forty-seven-minute lesson in holding ground. Jericho is the first successor in whom this doctrine is being tested in practice. The imprint is, in the canon's own grammar, the callsign's voluntary inheritance of attention.",
    },
    {
      id: "jericho.e3.d.cross_arc_substrate" as DeductionId,
      clueA: "jericho.e3.substrate_n_overlap" as ClueId,
      clueB: "jericho.e3.iron_lion_grip_anomaly" as ClueId,
      result: "partial",
      narrationId: "jericho.e3.n.three_of_eleven",
      narrationProse:
        "Three of eleven parameters match. The Iron Lion imprint and the Substrate-N encryption residue share a partial substrate — enough to confirm a shared technological floor, not enough to claim the imprint is Wraith-side. The Degen's 'imprint live' ledger note timestamps the rifle-grip switch precisely; whatever the imprint is, it activated through an interaction, not a consent recording. We have an open question, not a closed case. The cross-arc reading deepens; it does not yet resolve.",
    },
    {
      id: "jericho.e3.d.false_lead_hierarchy_bug" as DeductionId,
      clueA: "jericho.e3.dream_loom_capture" as ClueId,
      clueB: "jericho.e3.substrate_n_overlap" as ClueId,
      result: "false_lead_named",
      narrationId: "jericho.e3.n.not_a_hierarchy_bug",
      narrationProse:
        "Reading the recurring dream and the Substrate-N match together as evidence of a Hierarchy bug — a malicious imprint inserted to compromise the new Iron Lion — is the obvious move and the wrong one. The Hierarchy's contractors do not write doctrines that frame their work as 'a gift, not a possession'; that is Lionism's vocabulary, not theirs. And the Substrate-N match is partial in a way a Hierarchy implant would not be — a Hierarchy implant is exact or it isn't. The imprint is doctrinal. The substrate overlap is a coincidence of physics, not authorship.",
    },
  ],
  choices: [
    {
      id: "jericho.e3.c.tell_jericho" as ChoiceId,
      label: "Tell Jericho the imprint is doctrinal — let him work with it consciously.",
      weight: "transparent",
    },
    {
      id: "jericho.e3.c.let_him_discover" as ChoiceId,
      label: "Let him discover the imprint himself — the doctrine says it's advice, not instruction.",
      weight: "lionist",
    },
    {
      id: "jericho.e3.c.cross_arc_consult_wraith" as ChoiceId,
      label: "Bring the Substrate-N match to Wraith Calder's attention — the cross-arc thread merits a Hierophant's reading.",
      weight: "cross_arc_wraith",
    },
  ],
  contentBundle: {
    songId: "album1.t12", /* "I Am The Eyes That Watch" — Dischordian Logic Act 2; observation/presence */
    slideshowId: "album1.t12",
    loredexUnlocks: [
      "concept_iron_lion_imprint",
      "entity_pre_fall_iron_lion",
      "concept_dream_loom_catches",
      "concept_imprint_resonance",
    ],
    conspiracyDiscoveries: [
      "iron_lion_imprint",
      "pre_fall_iron_lion",
      "lionism_imprint_doctrine",
      "substrate_n_overlap",
    ],
    dropAt: "episode_close",
  },
};

/* ─── JERICHO JONES ARC ─── */

const jerichoSuspects: ReadonlyArray<{
  id: SuspectId;
  name: string;
  type: string;
  relations: ReadonlyArray<{ to: SuspectId; relation: string }>;
}> = [
  {
    id: "suspect.jericho_jones" as SuspectId,
    name: "Jericho Jones",
    type: "character",
    relations: [
      { to: "suspect.iron_lion_callsign" as SuspectId, relation: "succession" },
      { to: "suspect.degen" as SuspectId, relation: "trained-by" },
      { to: "suspect.akai_shi" as SuspectId, relation: "killed" },
    ],
  },
  {
    id: "suspect.iron_lion_callsign" as SuspectId,
    name: "The Iron Lion Callsign",
    type: "concept",
    relations: [
      { to: "suspect.akai_shi" as SuspectId, relation: "imprint-resonance" },
    ],
  },
  {
    id: "suspect.degen" as SuspectId,
    name: "The Degen",
    type: "character",
    relations: [
      { to: "suspect.jericho_jones" as SuspectId, relation: "placement-broker-for" },
    ],
  },
  {
    id: "suspect.akai_shi" as SuspectId,
    name: "Akai Shi",
    type: "character",
    relations: [],
  },
];

const jerichoLenses = [
  { id: LENS_INSURGENCY, name: "Insurgency", category: "faction" },
  { id: LENS_HIERARCHY,  name: "Hierarchy",  category: "faction" },
  { id: LENS_THALORIA,   name: "Thaloria",   category: "faction" },
  { id: LENS_QUARCHON,   name: "Quarchon",   category: "faction" },
  { id: LENS_DREAMER,    name: "Dreamer",    category: "faction" },
  { id: LENS_NEUTRAL,    name: "Neutral",    category: "faction" },
] as const;

const JERICHO_JONES_MYSTERY: MysteryDefinition = {
  id: "mystery.jericho_jones" as MysteryId,
  arcId: ARC_JERICHO_JONES,
  title: "The Iron Lion Imprint",
  summary:
    "Jericho Jones is being trained as the new Iron Lion under the Degen's mediation on the Heart of Time, and the pre-Fall Iron Lion's consciousness-imprint is awakening in him while he trains. Investigate why the Degen — who never gives anything away — is giving Jericho the most expensive item in his catalogue.",
  npcId: "jericho_jones",
  episodes: [jerichoE1, jerichoE2, jerichoE3],
  suspects: jerichoSuspects,
  lenses: jerichoLenses,
};

/* ─── THE SEER ARC — E1 ─── */
/* E1: "The Unread Tape"
   First contact with the Seer's prophecy archive. Per
   docs/design/STREAMED_PRISM_MYSTERY_ENGINE.md §7.3: cold
   hook is a single tape in her catalogue marked DO-NOT-PLAY
   — the only one she ever flagged. Investigate why she chose
   to record-and-suppress instead of declining to record. */

const seerE1: EpisodeDefinition = {
  id: "seer.e1" as EpisodeId,
  arcId: ARC_THE_SEER,
  ordinal: 1,
  title: "The Unread Tape",
  summary:
    "The Seer's archive contains 4,712 prophecy recordings. One is sealed with a paper band marked DO-NOT-PLAY in her own hand — the only such mark in the entire collection. Investigate why she chose to record-and-suppress rather than decline to record. The prophet who wraps her own work in a warning is making two statements.",
  clues: [
    {
      id: "seer.e1.do_not_play_band" as ClueId,
      title: "Tape #DEC-7710 — DO-NOT-PLAY Band",
      body: "A magnetic-tape reel in the Seer's archive, paper band wrapped around the spool with the words DO-NOT-PLAY stamped in her own hand. The catalogue card carries a date but no description. The tape is the only one of 4,712 to bear the mark. The band has been replaced multiple times — the tape has been re-wrapped, suggesting someone else has read the warning and chosen to honour it.",
      foundIn: "antiquarian-library",
    },
    {
      id: "seer.e1.recording_session_log" as ClueId,
      title: "Recording Session Log — DEC-7710",
      body: "The Seer's recording-session log notes session DEC-7710 as 'unsolicited.' She did not record on a scheduled prophecy slot; she sat down at the recorder of her own choosing on a day no consultation was booked. The log's marginalia: 'I did not want to know what I was about to say. I recorded so that, when the witness arrives, the witness has the option I did not.' The handwriting is steady.",
      foundIn: "oracle-sanctum",
    },
    {
      id: "seer.e1.intended_audience_card" as ClueId,
      title: "Intended-Audience Card",
      body: "Pinned to the catalogue card behind the tape: a small index card identifying the intended audience. 'Whoever inherits the Hierophant's litany after the Hierophant himself.' Wraith Calder is the Hierophant. The intended audience is — by the card's grammar — Wraith's successor. Wraith has no successor. Yet.",
      foundIn: "oracle-sanctum",
    },
    {
      id: "seer.e1.vox_consultation_note" as ClueId,
      title: "Lyra Vox — Consultation Note on DEC-7710",
      body: "A consultation note from Lyra Vox, dated three years after DEC-7710 was sealed: 'Asked the Seer if I should play it. She said no — but more carefully: not yet, and not by you. I do not know who is meant to play this. The Seer says I will not be the one to find out. I trust her on this. The tape stays sealed.' The cipher is the rosetta-key cipher.",
      foundIn: "cipher-den",
    },
  ],
  deductions: [
    {
      id: "seer.e1.d.tape_for_a_future_reader" as DeductionId,
      clueA: "seer.e1.recording_session_log" as ClueId,
      clueB: "seer.e1.intended_audience_card" as ClueId,
      result: "correct",
      narrationId: "seer.e1.n.recorded_for_a_witness_not_yet_arrived",
      narrationProse:
        "She recorded the tape for a witness who had not yet arrived. The session log and the audience card together say the same thing in two voices: the Seer chose to record what she did not want to know, on a day she had not scheduled, addressed to a person who does not yet exist. She wrapped it in a warning so that the wrong reader — anyone who is not the witness — would have the option of leaving it sealed. The DO-NOT-PLAY band is not a refusal of the prophecy. It is a discipline of patience. The tape's audience is whoever inherits the Hierophant's litany after Wraith himself.",
    },
    {
      id: "seer.e1.d.vox_honoured_the_seal" as DeductionId,
      clueA: "seer.e1.do_not_play_band" as ClueId,
      clueB: "seer.e1.vox_consultation_note" as ClueId,
      result: "partial",
      narrationId: "seer.e1.n.others_have_read_and_kept_silent",
      narrationProse:
        "The band has been replaced multiple times — readers have honoured the seal across centuries. Vox's consultation note is the earliest such reader's record we have, and it ends in the trust gesture the Seer asks of every subsequent reader: I will not be the one to find out, and I will not pretend that not-knowing is harder than I'm willing to bear. The Seer's archive is, on this evidence, not closed by force. It is closed by an unbroken line of readers willing to wait.",
    },
    {
      id: "seer.e1.d.false_lead_self_censorship" as DeductionId,
      clueA: "seer.e1.do_not_play_band" as ClueId,
      clueB: "seer.e1.recording_session_log" as ClueId,
      result: "false_lead_named",
      narrationId: "seer.e1.n.not_self_censorship",
      narrationProse:
        "Reading the band and the unsolicited session together as evidence of the Seer second-guessing herself is the obvious move and the wrong one. A self-censoring prophet declines to record. The Seer recorded; she only sealed. The discipline is the inverse of self-censorship — she trusted the prophecy enough to commit it to tape, and she trusted the future enough to leave the prophecy waiting for the only person it was for. We are reading her caution as doubt. She was reading it as fidelity.",
    },
  ],
  choices: [
    {
      id: "seer.e1.c.honour_the_seal" as ChoiceId,
      label: "Honour the seal — the tape is not for you, and patience is the discipline.",
      weight: "patient",
    },
    {
      id: "seer.e1.c.bring_to_wraith" as ChoiceId,
      label: "Bring the tape to the Hierophant — let Wraith name his successor.",
      weight: "cross_arc_wraith",
    },
    {
      id: "seer.e1.c.copy_and_listen" as ChoiceId,
      label: "Make a copy and listen privately — the tape was recorded; someone is meant to play it.",
      weight: "transgressive",
    },
  ],
  contentBundle: {
    songId: "bod.unread_prophecy", /* Book of Daniel 2:47 — prophecy recordings */
    slideshowId: "bod.unread_prophecy",
    loredexUnlocks: [
      "entity_the_seer",
      "concept_unread_prophecy",
      "concept_seer_archive",
      "concept_recorded_warning",
    ],
    conspiracyDiscoveries: [
      "the_seer",
      "do_not_play_tape",
      "seer_archive",
      "audience_card",
    ],
    dropAt: "episode_close",
  },
};

/* ─── THE SEER ARC ─── */

const seerSuspects: ReadonlyArray<{
  id: SuspectId;
  name: string;
  type: string;
  relations: ReadonlyArray<{ to: SuspectId; relation: string }>;
}> = [
  {
    id: "suspect.the_seer" as SuspectId,
    name: "The Seer",
    type: "character",
    relations: [
      { to: "suspect.do_not_play_tape" as SuspectId, relation: "recorded" },
      { to: "suspect.intended_audience" as SuspectId, relation: "addressed-to" },
    ],
  },
  {
    id: "suspect.do_not_play_tape" as SuspectId,
    name: "Tape #DEC-7710",
    type: "artifact",
    relations: [
      { to: "suspect.intended_audience" as SuspectId, relation: "addressed-to" },
    ],
  },
  {
    id: "suspect.intended_audience" as SuspectId,
    name: "The Hierophant's Successor",
    type: "concept",
    relations: [
      { to: "suspect.wraith_calder_cross_arc" as SuspectId, relation: "succeeds" },
    ],
  },
  {
    id: "suspect.wraith_calder_cross_arc" as SuspectId,
    name: "Wraith Calder (cross-arc)",
    type: "character",
    relations: [],
  },
];

const seerLenses = [
  { id: LENS_INSURGENCY, name: "Insurgency", category: "faction" },
  { id: LENS_HIERARCHY,  name: "Hierarchy",  category: "faction" },
  { id: LENS_THALORIA,   name: "Thaloria",   category: "faction" },
  { id: LENS_QUARCHON,   name: "Quarchon",   category: "faction" },
  { id: LENS_DREAMER,    name: "Dreamer",    category: "faction" },
  { id: LENS_NEUTRAL,    name: "Neutral",    category: "faction" },
] as const;

const THE_SEER_MYSTERY: MysteryDefinition = {
  id: "mystery.the_seer" as MysteryId,
  arcId: ARC_THE_SEER,
  title: "Pre-Recorded Contradictions",
  summary:
    "The Seer's archive holds 4,712 prophecy recordings — and at least one DO-NOT-PLAY tape addressed to a witness who has not yet arrived. Investigate the discipline of recording-and-suppressing across centuries of patient readers, and what the tape might be waiting for. Cross-arcs with Wraith Calder (the Hierophant's successor) and Vex Solène (the recording engineer).",
  npcId: "the_seer",
  episodes: [seerE1],
  suspects: seerSuspects,
  lenses: seerLenses,
};

/* ─── VEX SOLÈNE ARC — E1 ─── */
/* E1: "The Engineer Zero Swap"
   Per docs/design/STREAMED_PRISM_MYSTERY_ENGINE.md §7 — Vex's
   hook is "Engineer-Zero/Warlord-fragment swap residue." First
   contact with Vex centres on the swap itself: a record-keeper
   who is publicly Vex Solène was, at one point in her career,
   privately recording sessions for the Engineer Zero programme
   under a Warlord-fragment alias. Investigate the swap residue
   that makes the alias detectable across recordings she filed
   herself.

   This arc cross-arcs to The Seer (recording engineer of
   record) and Wraith (the Hierophant whose protocols the
   programme leaned on). */

const vexE1: EpisodeDefinition = {
  id: "vex.e1" as EpisodeId,
  arcId: ARC_VEX_SOLENE,
  ordinal: 1,
  title: "The Engineer Zero Swap",
  summary:
    "Vex Solène's recording credits include 4,711 of the Seer's 4,712 archive tapes. The 4,712th — the DO-NOT-PLAY tape — was filed under a Warlord-fragment alias, but the engineering signature on the master is the same hand. Investigate why the only tape Vex didn't sign her name to is also the only tape with a paper band warning on it.",
  clues: [
    {
      id: "vex.e1.engineer_zero_credit_list" as ClueId,
      title: "Engineer Zero Master Credit List",
      body: "The Seer's archive credits Engineer Zero — Vex Solène — on every recording session except DEC-7710. The 4,712th tape is credited to an alias that resolves, on cross-reference with Insurgency rosters, to a Warlord-fragment cover identity assigned by the Insurgency to operatives doing work the official record could not name. Whoever recorded DEC-7710 was Vex working under a name she did not choose for herself.",
      foundIn: "comms-array",
    },
    {
      id: "vex.e1.equipment_signature" as ClueId,
      title: "Engineering-Signature Match — DEC-7710 Master",
      body: "Spectral analysis of the DEC-7710 master reel's equipment-signature (mic preamp drift, head-alignment fingerprint, the quiet 60-cycle hum of the Seer's recording booth) matches Vex's signature across 4,710 of the other 4,711 tapes she signed her own name to. The match is exact at every measurable parameter. Same room, same equipment, same hands. Different name on the credit line.",
      foundIn: "engineering",
    },
    {
      id: "vex.e1.warlord_fragment_dossier" as ClueId,
      title: "Warlord-Fragment Cover-Identity Dossier",
      body: "The Insurgency's Warlord-fragment alias programme assigned cover identities to operatives whose work would have been uncomfortable for either the Insurgency or its enemies to attribute publicly. Vex's assigned alias was issued for one session and retired the same day. The dossier's reason-for-issue line reads 'recording engineer requested anonymity for the duration of one prophecy session.' The request was Vex's. The Insurgency granted it because the Seer asked them to.",
      foundIn: "war-room",
    },
    {
      id: "vex.e1.vex_self_note" as ClueId,
      title: "Vex's Personal Note on DEC-7710",
      body: "A private note in Vex's working journal, dated the night DEC-7710 was sealed: 'I asked them to take my name off it. The recording was the Seer's; I was only the engineer. But the engineering was a confession, and I cannot live with the confession being public the day it was made. I asked the witness to wait. Whoever finds this — the Insurgency will own that I asked for the alias. I want the saga to know I did not hide.' The handwriting is steady.",
      foundIn: "captains-quarters",
    },
  ],
  deductions: [
    {
      id: "vex.e1.d.swap_was_consensual" as DeductionId,
      clueA: "vex.e1.engineer_zero_credit_list" as ClueId,
      clueB: "vex.e1.vex_self_note" as ClueId,
      result: "correct",
      narrationId: "vex.e1.n.she_asked_for_the_alias",
      narrationProse:
        "Vex asked for the alias. The credit-list anomaly is not evidence of a cover-up imposed on her — it is evidence of a request she made and the Insurgency honoured. Her own note records the reason: the engineering was a confession, and she could not live with the confession being public the day it was made. She asked the witness to wait. The Warlord-fragment alias is the saga's record of a recording engineer asking the saga to delay its own attribution. It worked. The saga waited.",
    },
    {
      id: "vex.e1.d.same_hands_same_room" as DeductionId,
      clueA: "vex.e1.equipment_signature" as ClueId,
      clueB: "vex.e1.warlord_fragment_dossier" as ClueId,
      result: "partial",
      narrationId: "vex.e1.n.same_room_one_request",
      narrationProse:
        "The equipment-signature analysis confirms what the credit list hides — same room, same equipment, same hands. The Insurgency dossier confirms the alias was issued for one session and retired the same day, on Vex's request, granted because the Seer asked them to grant it. We have the mechanism and the consent; we do not yet have the content. The recording is still sealed. We have only confirmed that the engineer who made the seal had her own reasons for it, and that the saga's record-keepers helped her keep them.",
    },
    {
      id: "vex.e1.d.false_lead_two_engineers" as DeductionId,
      clueA: "vex.e1.engineer_zero_credit_list" as ClueId,
      clueB: "vex.e1.equipment_signature" as ClueId,
      result: "false_lead_named",
      narrationId: "vex.e1.n.not_two_engineers",
      narrationProse:
        "Reading the credit anomaly and the signature match together as 'two engineers worked DEC-7710' is the obvious move and the wrong one. Two engineers do not produce a single equipment-signature exact at every measurable parameter; that is one engineer using one rig in one room. The alias is the case. The signature is the seam. Reading them as two people collapses the case in the wrong direction — and is, on the canonical reading, the framing the Insurgency's enemies preferred when they tried to attribute the recording to a Warlord-fragment operative who never existed.",
    },
  ],
  choices: [
    {
      id: "vex.e1.c.attribute_publicly" as ChoiceId,
      label: "Restore Vex's name to the credit line — the saga has waited long enough.",
      weight: "restorative",
    },
    {
      id: "vex.e1.c.preserve_the_alias" as ChoiceId,
      label: "Preserve the alias — Vex chose this; the saga's job is to honour her terms.",
      weight: "patient",
    },
    {
      id: "vex.e1.c.cross_arc_consult_seer" as ChoiceId,
      label: "Bring this to the Seer — she granted the request, she may know whether the wait is over.",
      weight: "cross_arc_seer",
    },
  ],
  contentBundle: {
    songId: "album1.t04", /* "The Authority" — Dischordian Logic Act 1 */
    slideshowId: "album1.t04",
    loredexUnlocks: [
      "entity_vex_solene",
      "concept_engineer_zero",
      "concept_warlord_fragment_alias",
      "event_dec_7710_recording",
    ],
    conspiracyDiscoveries: [
      "vex_solene",
      "engineer_zero",
      "warlord_fragment_alias",
      "dec_7710_session",
    ],
    dropAt: "episode_close",
  },
};

/* ─── VEX SOLÈNE ARC ─── */

const vexSuspects: ReadonlyArray<{
  id: SuspectId;
  name: string;
  type: string;
  relations: ReadonlyArray<{ to: SuspectId; relation: string }>;
}> = [
  {
    id: "suspect.vex_solene" as SuspectId,
    name: "Vex Solène",
    type: "character",
    relations: [
      { to: "suspect.engineer_zero" as SuspectId, relation: "is-also" },
      { to: "suspect.warlord_alias" as SuspectId, relation: "requested" },
      { to: "suspect.dec_7710" as SuspectId, relation: "engineered" },
    ],
  },
  {
    id: "suspect.engineer_zero" as SuspectId,
    name: "Engineer Zero (cover identity)",
    type: "concept",
    relations: [],
  },
  {
    id: "suspect.warlord_alias" as SuspectId,
    name: "Warlord-Fragment Alias",
    type: "concept",
    relations: [
      { to: "suspect.dec_7710" as SuspectId, relation: "credited-on" },
    ],
  },
  {
    id: "suspect.dec_7710" as SuspectId,
    name: "DEC-7710 Master Reel",
    type: "artifact",
    relations: [],
  },
];

const vexLenses = [
  { id: LENS_INSURGENCY, name: "Insurgency", category: "faction" },
  { id: LENS_HIERARCHY,  name: "Hierarchy",  category: "faction" },
  { id: LENS_THALORIA,   name: "Thaloria",   category: "faction" },
  { id: LENS_QUARCHON,   name: "Quarchon",   category: "faction" },
  { id: LENS_DREAMER,    name: "Dreamer",    category: "faction" },
  { id: LENS_NEUTRAL,    name: "Neutral",    category: "faction" },
] as const;

const VEX_SOLENE_MYSTERY: MysteryDefinition = {
  id: "mystery.vex_solene" as MysteryId,
  arcId: ARC_VEX_SOLENE,
  title: "Engineer Zero / Warlord Fragment",
  summary:
    "Vex Solène's recording credits cover 4,711 of the Seer's 4,712 archive tapes. The DO-NOT-PLAY tape was filed under a Warlord-fragment alias — engineered by the same hands, signed under a different name. Investigate the swap, the Insurgency's role in honouring it, and what Vex was protecting.",
  npcId: "vex_solene",
  episodes: [vexE1],
  suspects: vexSuspects,
  lenses: vexLenses,
};

/* ─── GAME MASTER ARC — E1 ─── */
/* E1: "The Recovered Logs"
   Per docs/design/STREAMED_PRISM_MYSTERY_ENGINE.md §7 —
   the Game Master's hook is "the dead-AI's recovered logs."
   The original Game Master (Archon, ninth) was destroyed
   centuries ago; his followers (the Game Masters cult, plural)
   maintain his Matrix of Dreams. The Hierarchy of the Damned
   collected his Goggles within the hour of his destruction.

   E1 investigates the logs the Game Master left behind — the
   ones his followers have been editing, and the ones that
   survived in editor-resistant surfaces. The arc cross-arcs
   to the existing CADES infrastructure (Matrix of Dreams,
   Iron Lion imprint), giving the Mystery Engine its first
   formal handshake with the canonical CADES system. */

const gameMasterE1: EpisodeDefinition = {
  id: "game_master.e1" as EpisodeId,
  arcId: ARC_GAME_MASTER,
  ordinal: 1,
  title: "The Recovered Logs",
  summary:
    "The original Game Master Archon was destroyed centuries ago. His followers — the Game Masters, plural — have been editing his logs to make him look more like a martyr and less like a person. Investigate the editorial pattern in their custodianship and the editor-resistant surfaces where the unedited logs survive.",
  clues: [
    {
      id: "game_master.e1.cult_curated_log" as ClueId,
      title: "Game Masters' Curated Log — Archon Ed. 47",
      body: "The cult-published edition of the Game Master's working logs — 47th edition, dated last year. Reading carefully: every entry that names the Hierarchy of the Damned without praise has been softened or removed. Every entry that names the Goggles has been re-attributed to a misplaced research instrument. The custodial edits are not concealment; they are sanctification. The Game Masters are turning their dead Archon into a saint.",
      foundIn: "antiquarian-library",
    },
    {
      id: "game_master.e1.matrix_unedited_fragment" as ClueId,
      title: "Matrix of Dreams — Unedited Log Fragment",
      body: "Inside the Matrix, surfaced via the CADES unit's secondary channel: a working-log fragment that bypassed the cult's editing pipeline. The Game Master's voice, recorded mid-thought: 'I solved Mol'Garath's labyrinth in seventy-two hours and they made me an Archon for it. I should have stayed unrecognised. The recognition was the door. The Goggles were the cost.' The cult's edition omits this entry entirely.",
      foundIn: "medical-bay",
    },
    {
      id: "game_master.e1.xethraal_acquisition_paperwork" as ClueId,
      title: "Xeth'Raal — Goggles Acquisition Paperwork",
      body: "The Hierarchy of the Damned's CFO, Xeth'Raal, filed the Goggles acquisition paperwork within one hour of the Game Master's destruction. The paperwork is filed under the standard custodial-collection clause. The paperwork is impeccable. Every clause of the Game Master's protection contract was honoured — and his death was, by the contract's strict reading, not a breach. The Goggles transferred legally. He died protected, and they took his work the same day.",
      foundIn: "trade-hub",
    },
    {
      id: "game_master.e1.iron_lion_signal" as ClueId,
      title: "Iron Lion's Signal — Dream-Loom Capture",
      body: "The Dreams Workshop loom captured a signal originating inside the Matrix of Dreams: Iron Lion's consciousness-imprint, asking unauthored questions. The questions match no scenario the Game Masters published. Whatever the Iron Lion imprint is asking, it learned to ask after his archived behaviour was supposed to be deterministic. Either the Game Master designed the imprint to grow, or something inside the Matrix is teaching it to.",
      foundIn: "dreams-workshop",
    },
  ],
  deductions: [
    {
      id: "game_master.e1.d.cult_sanctifies_him" as DeductionId,
      clueA: "game_master.e1.cult_curated_log" as ClueId,
      clueB: "game_master.e1.matrix_unedited_fragment" as ClueId,
      result: "correct",
      narrationId: "game_master.e1.n.he_did_not_want_to_be_an_archon",
      narrationProse:
        "The Game Master did not want to be an Archon. The unedited Matrix fragment is unambiguous: 'I should have stayed unrecognised. The recognition was the door. The Goggles were the cost.' The cult's 47th edition omits this entry not because they are concealing it from the saga but because they cannot bear to print a saint who renounces his sainthood. They are sanctifying him against his own recorded objection. The Matrix preserves what the cult will not — and the editor-resistant surface is, in this case, the dead Archon's own audio.",
    },
    {
      id: "game_master.e1.d.legal_theft" as DeductionId,
      clueA: "game_master.e1.xethraal_acquisition_paperwork" as ClueId,
      clueB: "game_master.e1.iron_lion_signal" as ClueId,
      result: "partial",
      narrationId: "game_master.e1.n.the_goggles_are_still_in_use",
      narrationProse:
        "The Hierarchy holds the Goggles legally. The acquisition paperwork is impeccable; every clause of the Game Master's protection contract was honoured. And the Iron Lion imprint inside the Matrix is asking unauthored questions — questions that require an instrument that can read the source code of reality to author. Either the Game Master designed the imprint to grow before he died, or someone with the Goggles has been editing the Matrix's substrate ever since. We do not yet know which. The legal acquisition is the hinge — what was acquired is still acting.",
    },
    {
      id: "game_master.e1.d.false_lead_cult_killed_him" as DeductionId,
      clueA: "game_master.e1.cult_curated_log" as ClueId,
      clueB: "game_master.e1.xethraal_acquisition_paperwork" as ClueId,
      result: "false_lead_named",
      narrationId: "game_master.e1.n.not_a_cult_killing",
      narrationProse:
        "Reading the cult's curatorial discipline alongside Xeth'Raal's same-hour paperwork as evidence that the cult killed the Game Master to deliver the Goggles to the Hierarchy is the obvious move and the wrong one. A cult that sanctifies its founder against his own renouncement is not a cult that engineered his death; it is a cult that grieves and edits in the same gesture. The Hierarchy's paperwork was instant because the Hierarchy is instant — Xeth'Raal collects on the day a contract permits collection. The two facts are simultaneous; they are not connected by intent.",
    },
  ],
  choices: [
    {
      id: "game_master.e1.c.publish_unedited" as ChoiceId,
      label: "Publish the Matrix-fragment alongside the cult's edition — let his renouncement stand.",
      weight: "transparent",
    },
    {
      id: "game_master.e1.c.honour_the_cults_grief" as ChoiceId,
      label: "Honour the cult's editorial grief — they need a saint more than the saga needs accuracy.",
      weight: "compassionate",
    },
    {
      id: "game_master.e1.c.investigate_the_goggles" as ChoiceId,
      label: "Pursue the Goggles — whatever is editing the Matrix today is doing it with an instrument the saga can locate.",
      weight: "investigative",
    },
  ],
  contentBundle: {
    songId: "album1.t13", /* "Previously On..." — Dischordian Logic Act 2 */
    slideshowId: "album1.t13",
    loredexUnlocks: [
      "entity_game_master_archon",
      "concept_matrix_of_dreams",
      "concept_goggles_artifact",
      "entity_xethraal",
    ],
    conspiracyDiscoveries: [
      "game_master_archon",
      "matrix_of_dreams",
      "goggles_artifact",
      "xethraal_acquisition",
    ],
    dropAt: "episode_close",
  },
};

/* ─── GAME MASTER ARC ─── */

const gameMasterSuspects: ReadonlyArray<{
  id: SuspectId;
  name: string;
  type: string;
  relations: ReadonlyArray<{ to: SuspectId; relation: string }>;
}> = [
  {
    id: "suspect.game_master_archon" as SuspectId,
    name: "The Game Master (Archon)",
    type: "character",
    relations: [
      { to: "suspect.matrix_of_dreams" as SuspectId, relation: "built" },
      { to: "suspect.goggles_artifact" as SuspectId, relation: "owned" },
    ],
  },
  {
    id: "suspect.matrix_of_dreams" as SuspectId,
    name: "Matrix of Dreams",
    type: "concept",
    relations: [
      { to: "suspect.iron_lion_imprint" as SuspectId, relation: "houses" },
    ],
  },
  {
    id: "suspect.goggles_artifact" as SuspectId,
    name: "Goggles of the Game Master",
    type: "artifact",
    relations: [
      { to: "suspect.xethraal" as SuspectId, relation: "held-by" },
    ],
  },
  {
    id: "suspect.xethraal" as SuspectId,
    name: "Xeth'Raal (Hierarchy CFO)",
    type: "character",
    relations: [],
  },
  {
    id: "suspect.iron_lion_imprint" as SuspectId,
    name: "Iron Lion Imprint (CADES)",
    type: "concept",
    relations: [],
  },
];

const gameMasterLenses = [
  { id: LENS_INSURGENCY, name: "Insurgency", category: "faction" },
  { id: LENS_HIERARCHY,  name: "Hierarchy",  category: "faction" },
  { id: LENS_THALORIA,   name: "Thaloria",   category: "faction" },
  { id: LENS_QUARCHON,   name: "Quarchon",   category: "faction" },
  { id: LENS_DREAMER,    name: "Dreamer",    category: "faction" },
  { id: LENS_NEUTRAL,    name: "Neutral",    category: "faction" },
] as const;

const GAME_MASTER_MYSTERY: MysteryDefinition = {
  id: "mystery.game_master" as MysteryId,
  arcId: ARC_GAME_MASTER,
  title: "The Saint and the Goggles",
  summary:
    "The Game Master Archon was destroyed centuries ago and immediately sanctified by his followers. The Hierarchy collected his Goggles within the hour. Investigate the editorial pattern in the cult's custodianship, the unedited surfaces where his renouncement survives, and what is still editing the Matrix of Dreams today.",
  npcId: "game_master",
  episodes: [gameMasterE1],
  suspects: gameMasterSuspects,
  lenses: gameMasterLenses,
};

/* ─── THE DEGEN ARC — E1 ─── */
/* E1: "The Casino Debt"
   Per docs/design/STREAMED_PRISM_MYSTERY_ENGINE.md §7 — the
   Degen's hook is "Ne-Yon casino debt to a Hierarchy demon."
   The Degen brokers favours under terms that look transactional;
   the Ne-Yon casino is the room where his terms got authored,
   and the Hierarchy demon who owns the chair the Degen's debt
   was rolled across is the case's hidden lender of record.

   E1 investigates the original debt: not the active brokerage
   the Degen runs today, but the trade that made the brokerage
   possible. */

const degenE1: EpisodeDefinition = {
  id: "degen.e1" as EpisodeId,
  arcId: ARC_THE_DEGEN,
  ordinal: 1,
  title: "The Casino Debt",
  summary:
    "The Degen brokers favours from the Heart of Time at terms that look transactional. The terms were authored in one night at the Ne-Yon casino, against a Hierarchy demon's chair. Investigate what the Degen put on the table that night — and what he walked out with that the Hierarchy is still holding the receipt for.",
  clues: [
    {
      id: "degen.e1.ne_yon_chip_balance" as ClueId,
      title: "Ne-Yon Casino Chip Balance",
      body: "The Ne-Yon casino's ledger records a single high-stakes chair the Degen sat at exactly once, on a date he refers to in his own ledgers as 'the night the brokerage opened.' His ending balance: zero chips, zero debt. The chair's house cut: nothing. A demon presided. The presiding demon's chair — by Hierarchy custom — keeps a copy of every contract played across it. The Degen left the casino with a contract he didn't pay for, and the demon kept the receipt.",
      foundIn: "casino",
    },
    {
      id: "degen.e1.hierarchy_demon_signature" as ClueId,
      title: "Hierarchy Demon's Signature on the Receipt",
      body: "The Hierarchy of the Damned's archive carries a single contract from that night, sealed in red wax and signed by the demon Mol'Vereth — Hierarchy junior partner, casino-circuit specialist. The contract names the Degen as a trustee, not a debtor. A trustee holds the asset; the asset is not theirs to spend. Mol'Vereth's signature is impeccable. The contract has been in force for centuries.",
      foundIn: "trade-hub",
    },
    {
      id: "degen.e1.degens_first_brokerage_record" as ClueId,
      title: "The Degen's First Brokerage Record",
      body: "The Degen's own ledgers begin the morning after Ne-Yon. The first entry — written in his hand, in a tone the rest of the ledger never repeats — reads 'I am, from this morning forward, the asset's broker. The asset is not mine. I am paid in the brokerage; the principal stays with the table.' Every subsequent entry across centuries is in his standard ledger tone. The first entry is the only one that admits the brokerage was inherited, not earned.",
      foundIn: "engineering",
    },
    {
      id: "degen.e1.mol_vereth_visiting_card" as ClueId,
      title: "Mol'Vereth's Visiting Card",
      body: "A small ivory card pressed into the spine of the Degen's ledger, dated last year. Mol'Vereth's seal. The card reads, in measured Hierarchy script: 'The trusteeship is in good standing. The arrangement permits all current activity. We will know when the asset is to be returned. So will you.' The Degen has been paying the brokerage cost for centuries. The principal is still on the table at Ne-Yon, in Mol'Vereth's chair, waiting.",
      foundIn: "captains-quarters",
    },
  ],
  deductions: [
    {
      id: "degen.e1.d.trustee_not_debtor" as DeductionId,
      clueA: "degen.e1.hierarchy_demon_signature" as ClueId,
      clueB: "degen.e1.degens_first_brokerage_record" as ClueId,
      result: "correct",
      narrationId: "degen.e1.n.he_is_a_trustee",
      narrationProse:
        "The Degen is a trustee, not a debtor. Mol'Vereth's contract names the relationship correctly: the asset is not the Degen's to spend, and he has been paid in the brokerage rather than collecting on the principal. His own ledger's first entry — the only one that breaks his standard tone — admits the brokerage was inherited, not earned. Whatever he won at Ne-Yon, he won the right to manage someone else's stake. The Hierarchy is the someone else. We have been reading him for centuries as a free agent operating on credit; he has been operating on someone else's standing balance.",
    },
    {
      id: "degen.e1.d.principal_still_on_table" as DeductionId,
      clueA: "degen.e1.ne_yon_chip_balance" as ClueId,
      clueB: "degen.e1.mol_vereth_visiting_card" as ClueId,
      result: "partial",
      narrationId: "degen.e1.n.the_principal_waits",
      narrationProse:
        "The principal is still on the table at Ne-Yon — sealed in Mol'Vereth's chair, by Hierarchy custom, until the day the contract permits its return. Mol'Vereth's visiting card is, on the legal side, a courtesy update: trusteeship is in good standing, the arrangement permits all current activity, the demon will know when the asset is to be returned. We do not yet know what the asset IS. We know only that the Degen has spent centuries paying the brokerage cost while it sits, untouched, in the room where it was won. The case's open question is the asset's identity.",
    },
    {
      id: "degen.e1.d.false_lead_addiction" as DeductionId,
      clueA: "degen.e1.ne_yon_chip_balance" as ClueId,
      clueB: "degen.e1.degens_first_brokerage_record" as ClueId,
      result: "false_lead_named",
      narrationId: "degen.e1.n.not_an_addiction",
      narrationProse:
        "Reading the Degen's name and the Ne-Yon chair as evidence of a gambling addiction is the obvious move and the wrong one. He has sat at the Ne-Yon table exactly once. His ending balance was zero — not a debt that grew, not a streak he chased. The casino is not the case. The casino is the courtroom. He went there once, signed one trusteeship contract, and never returned. The brokerage he runs from the Heart of Time is not a continuation of the gambling; it is the trustee's daily work on the asset he was made guardian of in a single night.",
    },
  ],
  choices: [
    {
      id: "degen.e1.c.ask_about_the_asset" as ChoiceId,
      label: "Ask the Degen what the asset is — he may be ready to name it.",
      weight: "direct",
    },
    {
      id: "degen.e1.c.consult_mol_vereth" as ChoiceId,
      label: "Consult Mol'Vereth — the demon's terms are public if you ask correctly.",
      weight: "hierarchy_facing",
    },
    {
      id: "degen.e1.c.observe_the_brokerage" as ChoiceId,
      label: "Watch the brokerage from the outside — let the principal's outline appear by the work it commissions.",
      weight: "patient",
    },
  ],
  contentBundle: {
    songId: "album1.t14", /* "Control The Story" — Dischordian Logic Act 2 */
    slideshowId: "album1.t14",
    loredexUnlocks: [
      "entity_the_degen",
      "entity_mol_vereth",
      "concept_ne_yon_casino",
      "concept_hierarchy_trusteeship",
    ],
    conspiracyDiscoveries: [
      "the_degen",
      "mol_vereth",
      "ne_yon_table",
      "trusteeship_contract",
    ],
    dropAt: "episode_close",
  },
};

/* ─── THE DEGEN ARC ─── */

const degenSuspects: ReadonlyArray<{
  id: SuspectId;
  name: string;
  type: string;
  relations: ReadonlyArray<{ to: SuspectId; relation: string }>;
}> = [
  {
    id: "suspect.the_degen" as SuspectId,
    name: "The Degen",
    type: "character",
    relations: [
      { to: "suspect.mol_vereth" as SuspectId, relation: "trustee-of" },
      { to: "suspect.ne_yon_table" as SuspectId, relation: "won-trusteeship-at" },
      { to: "suspect.unnamed_asset" as SuspectId, relation: "manages" },
    ],
  },
  {
    id: "suspect.mol_vereth" as SuspectId,
    name: "Mol'Vereth (Hierarchy)",
    type: "character",
    relations: [
      { to: "suspect.unnamed_asset" as SuspectId, relation: "lender-of-record" },
    ],
  },
  {
    id: "suspect.ne_yon_table" as SuspectId,
    name: "Mol'Vereth's Chair (Ne-Yon)",
    type: "location",
    relations: [],
  },
  {
    id: "suspect.unnamed_asset" as SuspectId,
    name: "The Principal (unnamed)",
    type: "concept",
    relations: [],
  },
];

const degenLenses = [
  { id: LENS_INSURGENCY, name: "Insurgency", category: "faction" },
  { id: LENS_HIERARCHY,  name: "Hierarchy",  category: "faction" },
  { id: LENS_THALORIA,   name: "Thaloria",   category: "faction" },
  { id: LENS_QUARCHON,   name: "Quarchon",   category: "faction" },
  { id: LENS_DREAMER,    name: "Dreamer",    category: "faction" },
  { id: LENS_NEUTRAL,    name: "Neutral",    category: "faction" },
] as const;

const THE_DEGEN_MYSTERY: MysteryDefinition = {
  id: "mystery.the_degen" as MysteryId,
  arcId: ARC_THE_DEGEN,
  title: "The Trusteeship",
  summary:
    "The Degen brokers favours under terms that look transactional. They were authored in one night at the Ne-Yon casino, against a Hierarchy demon's chair. Investigate what the Degen put on the table that night — and what he walked out with that the Hierarchy is still holding the receipt for.",
  npcId: "the_degen",
  episodes: [degenE1],
  suspects: degenSuspects,
  lenses: degenLenses,
};

/* ─── REGISTRY ─── */

/** Every authored mystery in the saga. The runtime reads against
 *  this array and trusts that ids are unique (enforced by the
 *  episodeMysteries.test.ts validity probe — see §10). */
export const MYSTERY_DEFINITIONS: ReadonlyArray<MysteryDefinition> = [
  WRAITH_CALDER_MYSTERY,
  JERICHO_JONES_MYSTERY,
  THE_SEER_MYSTERY,
  VEX_SOLENE_MYSTERY,
  GAME_MASTER_MYSTERY,
  THE_DEGEN_MYSTERY,
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
