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
export const ARC_THE_WATCHER    = "arc.the_watcher"    as ArcId;
export const ARC_ITH_RAEL       = "arc.ith_rael"       as ArcId;
export const ARC_THE_NECROMANCER = "arc.the_necromancer" as ArcId;
export const ARC_SYL_VEX        = "arc.syl_vex"        as ArcId;

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
      unlocksEpisode: "jericho.e4" as EpisodeId,
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

/* ─── JERICHO JONES ARC — E4 ─── */
/* E4: "Lionism Ethics"
   Per docs/design/STREAMED_PRISM_MYSTERY_ENGINE.md §7.2 — the
   Iron Lion code vs. the killing of Akai Shi. The pre-Fall
   Iron Lion (whose imprint Jericho is now carrying) had a
   different read on the code than current Jericho. Sherlock-
   style deduction matrix: which Lion's reading is correct?
   The honest answer is *both readings are partial* — the code
   evolved between the Falls, and Jericho is the first Lion to
   hold both readings at once.

   This episode is the moral spine of the arc. The Disco-
   Elysium internal-voice contention from E2 returns, but at
   the doctrinal level rather than the personal one. */

const jerichoE4: EpisodeDefinition = {
  id: "jericho.e4" as EpisodeId,
  arcId: ARC_JERICHO_JONES,
  ordinal: 4,
  title: "Lionism Ethics",
  summary:
    "The pre-Fall Iron Lion's imprint reads the killing of Akai Shi as a textbook mercy under the Lionism code he was trained to. Jericho reads it as a contested-doctrine act he chose to make at the threshold. Both Lions are right inside their own training. Investigate the seam between the two readings — and whether the code, like the callsign, can carry both.",
  clues: [
    {
      id: "jericho.e4.pre_fall_lionism_code" as ClueId,
      title: "Pre-Fall Lionism Code — Section 4 Mercy",
      body: "The pre-Fall Lionism code's Section 4 (Mercy) is unambiguous: when an ally is taken by an irreversible vector, the Lion who knows them best is duty-bound to deliver the cleanest possible end. The code names the act as a discharge of love, not a violation of bonds. The pre-Fall Iron Lion read Akai Shi's killing under this section without hesitation; his imprint reads it the same way today.",
      foundIn: "antiquarian-library",
    },
    {
      id: "jericho.e4.post_fall_revision" as ClueId,
      title: "Post-Fall Lionism Revision — Threshold Doctrine",
      body: "The post-Fall Lionism code, revised after Veridian VI, replaced the Section 4 mercy clause with the Threshold Doctrine: an ally taken by the Thought Virus may still cross back if the Lion holds the threshold long enough; killing-as-mercy became contested doctrine, no longer codified. Jericho was trained in the post-Fall code. He killed Akai Shi at the threshold the new doctrine asks the Lion to hold.",
      foundIn: "order-tribunal",
    },
    {
      id: "jericho.e4.imprint_dream_argument" as ClueId,
      title: "Imprint Dream — Two Lions Arguing",
      body: "The Dreams Workshop loom captured a second recurring dream from Jericho: he stands on the Bridge of Kael with the pre-Fall Iron Lion beside him. They argue about Akai Shi. The pre-Fall Lion reads the Section 4 mercy clause aloud. Jericho reads the Threshold Doctrine. Neither concedes. The argument loops; in every iteration, the pre-Fall Lion ends with the same line: 'You did the right thing under your code. So did I, under mine. The hard part is that we are now the same person.'",
      foundIn: "dreams-workshop",
    },
    {
      id: "jericho.e4.akai_shi_witness_choice" as ClueId,
      title: "Akai Shi's Pre-Threshold Recording — Reading 2",
      body: "Re-reading the pre-threshold recording from E2 with the doctrinal evidence in hand: Akai Shi knew Jericho was post-Fall trained. She recorded the consent for him specifically, not for the prior Iron Lion. 'He'll do it correctly without permission' is, in the post-Fall code, an act under contested doctrine; in the pre-Fall code, an act of canonical mercy. Akai Shi authored a consent that read correctly under both codes simultaneously — she made it possible for either Lion to do the work without violating their own.",
      foundIn: "cipher-den",
    },
  ],
  deductions: [
    {
      id: "jericho.e4.d.both_codes_are_right" as DeductionId,
      clueA: "jericho.e4.pre_fall_lionism_code" as ClueId,
      clueB: "jericho.e4.post_fall_revision" as ClueId,
      result: "correct",
      narrationId: "jericho.e4.n.the_code_carries_both_readings",
      narrationProse:
        "Both codes are right inside their own training. The pre-Fall Section 4 reads the killing as a clean-mercy duty; the post-Fall Threshold Doctrine reads it as a contested act. The honest reading is that the code evolved between the Falls because the saga itself evolved — what was unambiguously kind in one era became a question worth holding open in the next. Jericho is the first Lion to carry both codes at once. The imprint's argument with him in the dream is not a refutation; it is an inheritance. The Lionism code, like the callsign, can carry both readings forward.",
    },
    {
      id: "jericho.e4.d.akai_shi_read_both" as DeductionId,
      clueA: "jericho.e4.akai_shi_witness_choice" as ClueId,
      clueB: "jericho.e4.imprint_dream_argument" as ClueId,
      result: "partial",
      narrationId: "jericho.e4.n.she_held_the_seam",
      narrationProse:
        "Akai Shi held the seam herself. Her consent recording was authored to read correctly under both codes — pre-Fall mercy or post-Fall contested act — so that whichever Lion did the work would not have to violate their own training. The dream's looping argument is what Jericho carries instead of her: the two Lions she made compatible meet in him, every night, on the bridge that ended the prior Lion's career and started this one's. We do not have an answer to which code is right. We have an answer to which witness held the seam open until both could pass through it.",
      unlocksEpisode: "jericho.e5" as EpisodeId,
    },
    {
      id: "jericho.e4.d.false_lead_obsolete_code" as DeductionId,
      clueA: "jericho.e4.pre_fall_lionism_code" as ClueId,
      clueB: "jericho.e4.imprint_dream_argument" as ClueId,
      result: "false_lead_named",
      narrationId: "jericho.e4.n.not_obsolete",
      narrationProse:
        "Reading the pre-Fall code as obsolete because the post-Fall revision replaced it is the obvious move and the wrong one. Codes are not obsolete because they were superseded; they are obsolete only if no living witness still operates by them. The pre-Fall Iron Lion's imprint operates by Section 4 today, inside Jericho's mind, in arguments Jericho cannot dismiss. The pre-Fall code is alive in him. The post-Fall code is also alive in him. Both are operative. Treating one as the historical and the other as the current collapses the case in the wrong direction.",
    },
  ],
  choices: [
    {
      id: "jericho.e4.c.adopt_pre_fall" as ChoiceId,
      label: "Adopt the pre-Fall reading — what Jericho did was clean mercy under canon.",
      weight: "pre_fall_lionist",
    },
    {
      id: "jericho.e4.c.adopt_post_fall" as ChoiceId,
      label: "Hold the post-Fall reading — the act stays contested, and that is the discipline.",
      weight: "post_fall_lionist",
    },
    {
      id: "jericho.e4.c.carry_both" as ChoiceId,
      label: "Carry both codes — Jericho is the first Lion who can hold the seam open.",
      weight: "seam_holder",
    },
  ],
  contentBundle: {
    songId: "bod.last_stand", /* "The Last Stand" — Book of Daniel 2:47, Iron Lion canon song */
    slideshowId: "bod.last_stand",
    loredexUnlocks: [
      "concept_lionism_section_4",
      "concept_threshold_doctrine",
      "concept_imprint_dream_argument",
      "concept_seam_holder",
    ],
    conspiracyDiscoveries: [
      "lionism_section_4",
      "threshold_doctrine",
      "imprint_dream_argument",
      "akai_shi_dual_consent",
    ],
    dropAt: "episode_close",
  },
};

/* ─── JERICHO JONES ARC — E5 (final episode) ─── */
/* E5: "The Degen's Commission"
   Arc closer per docs/design §7.2. Jericho becomes operational
   as the new Iron Lion. The Degen reveals what he has been
   training Jericho for: a Syndicate-of-Death counter-move that
   pays off Wraith E5's `inscribe_akai_shi` cross-arc choice
   (the player who inscribed Akai Shi's name in the Hierophant's
   litany has, by the time they reach this episode, set up the
   conditions under which the Degen can name his commission
   without having to argue for it). */

const jerichoE5: EpisodeDefinition = {
  id: "jericho.e5" as EpisodeId,
  arcId: ARC_JERICHO_JONES,
  ordinal: 5,
  title: "The Degen's Commission",
  summary:
    "Jericho is operational. The Degen names the commission he has been managing all along: a Syndicate-of-Death counter-move Wraith Calder could not finish in his own lifetime. Investigate the chain that connects the Degen's brokerage, Wraith's pre-rite contracts, and the asset that has been waiting at Mol'Vereth's table for centuries — and choose which witness Jericho deploys as.",
  clues: [
    {
      id: "jericho.e5.commission_brief" as ClueId,
      title: "The Degen's Commission Brief",
      body: "A folio in the Degen's hand, dated the morning Jericho was formally cleared as Iron Lion. The brief names the target obliquely — 'a Syndicate twin Wraith Calder did not reach' — and the role: 'Iron Lion as witness, not as executioner. The act, if any, will be the witness's choice.' The Degen is not asking Jericho to kill. He is asking Jericho to be the person whose presence makes the next conversation possible.",
      foundIn: "war-room",
    },
    {
      id: "jericho.e5.wraith_pre_rite_contract" as ClueId,
      title: "Wraith's Pre-Rite Contract — Open Clause",
      body: "An open clause in Wraith Calder's pre-rite bounty contracts (the ones the Hierophant inherits but does not act on) names the same Syndicate twin. The clause was deferred when Wraith accepted the Sanctuary's Final Rite — the Hierophant cannot, by his own discipline, complete a bounty hunter's contract from inside the daily-names ceremony. He left the clause open. Someone else has been needed for centuries.",
      foundIn: "antiquarian-library",
    },
    {
      id: "jericho.e5.mol_vereth_principal_outline" as ClueId,
      title: "Mol'Vereth's Principal — Identified",
      body: "Cross-referencing Mol'Vereth's trustee paperwork with the Hierophant's open clause: the asset the Degen has been managing on the Hierarchy's behalf is the contractual right to complete Wraith's deferred bounty. Mol'Vereth has been holding the right, in trust, since the night the Degen won the trusteeship at Ne-Yon. The Hierarchy did not need to act. They needed the contract to remain unfulfilled — the open clause was the leverage. The Degen has been protecting the contract from the Hierarchy by not letting them call it in.",
      foundIn: "order-tribunal",
    },
    {
      id: "jericho.e5.akai_shi_inscription_seal" as ClueId,
      title: "The Litany — Akai Shi's Inscription (cross-arc)",
      body: "If the player has inscribed Akai Shi's name in Wraith's daily-names ceremony (Wraith E5 cross-arc choice `inscribe_akai_shi`), the seal on Mol'Vereth's contract has been altered: the litany counts as a witnessing of the original consent, and the contract's leverage shifts. Mol'Vereth notes the alteration in a fresh visiting card. The asset is, by Hierarchy law, ready to be returned to the saga the moment a witness names the act.",
      foundIn: "oracle-sanctum",
    },
  ],
  deductions: [
    {
      id: "jericho.e5.d.commission_is_witnessing" as DeductionId,
      clueA: "jericho.e5.commission_brief" as ClueId,
      clueB: "jericho.e5.mol_vereth_principal_outline" as ClueId,
      result: "correct",
      narrationId: "jericho.e5.n.he_is_the_witness_not_the_executioner",
      narrationProse:
        "The commission is witnessing, not killing. The Degen has spent centuries protecting Wraith's open clause from the Hierarchy's reach by keeping the trusteeship in his own hands and the asset off the table. He needed an Iron Lion who could stand in the room as the witness Mol'Vereth's contract would accept — and the post-Fall code's Threshold Doctrine reads Jericho's act on Akai Shi as exactly that kind of witnessing. Jericho is not being deployed as Wraith's successor in the executioner's role. He is being deployed as the witness that lets Wraith's deferred clause expire by canon, not by force. The Hierarchy loses leverage; the Syndicate twin walks away; nobody has to die for the contract to close.",
    },
    {
      id: "jericho.e5.d.litany_completes_the_seal" as DeductionId,
      clueA: "jericho.e5.wraith_pre_rite_contract" as ClueId,
      clueB: "jericho.e5.akai_shi_inscription_seal" as ClueId,
      result: "partial",
      narrationId: "jericho.e5.n.cross_arc_payoff",
      narrationProse:
        "The litany seals the contract. If the player inscribed Akai Shi's name in Wraith's daily-names ceremony — choosing the cross-arc beat in the Wraith arc's E5 — the seal on Mol'Vereth's contract has been altered. The Hierophant's litany is a recognised witnessing surface in Hierarchy law; an inscription there counts as the original consent's witnessing-by-record. The Degen has been waiting for that inscription for centuries. If it has not yet happened, the case stays open and Jericho's commission stays a witnessing-in-readiness rather than a closed act. The cross-arc payoff is real: the player's earlier choice has measurably altered what the Degen can ask Jericho to do today.",
    },
    {
      id: "jericho.e5.d.false_lead_assassination" as DeductionId,
      clueA: "jericho.e5.commission_brief" as ClueId,
      clueB: "jericho.e5.wraith_pre_rite_contract" as ClueId,
      result: "false_lead_named",
      narrationId: "jericho.e5.n.not_an_assassination",
      narrationProse:
        "Reading the commission and the open bounty clause as a Hierarchy-deferred assassination is the obvious move and the wrong one. Wraith's clause was deferred because the Sanctuary's discipline does not let the Hierophant complete bounty work; the deferral was respect for the rite, not delay tactics. The Degen has been protecting the clause, not preserving it as a weapon. And the commission brief is unambiguous: 'Iron Lion as witness, not as executioner.' We are reading the chain backwards. The Hierarchy wanted the clause unfulfilled because an unfulfilled clause is leverage. The Degen wanted the clause unfulfilled because an unfulfilled clause is witnessable. Both wanted the same outcome for opposite reasons.",
    },
  ],
  choices: [
    {
      id: "jericho.e5.c.deploy_as_witness" as ChoiceId,
      label: "Accept the commission — Jericho stands as the witness; the Syndicate twin walks; the contract closes by canon.",
      weight: "witness",
    },
    {
      id: "jericho.e5.c.refuse_commission" as ChoiceId,
      label: "Refuse the commission — the Degen has carried this alone for centuries; let him decide whether to keep carrying it or release it.",
      weight: "release_to_degen",
    },
    {
      id: "jericho.e5.c.invite_wraith" as ChoiceId,
      label: "Bring Wraith into the room — the Hierophant cannot finish the bounty, but he can witness the witnessing. Three Lions, one act.",
      weight: "three_witnesses",
    },
    {
      id: "jericho.e5.c.return_to_akai_shi" as ChoiceId,
      label: "Decline the deployment and return to Akai Shi's grave instead. Jericho was not made operational so he could leave her again.",
      weight: "fidelity",
    },
  ],
  contentBundle: {
    songId: "album1.t18", /* "Planet of the Wolf" — Dischordian Logic Act 3, Thaloria-canon-mapped */
    slideshowId: "album1.t18",
    loredexUnlocks: [
      "concept_degens_commission",
      "event_syndicate_twin_witness",
      "concept_iron_lion_operational",
      "concept_three_witnesses_doctrine",
    ],
    conspiracyDiscoveries: [
      "degens_commission",
      "wraith_pre_rite_clause",
      "mol_vereth_principal_revealed",
      "litany_seal_altered",
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
  episodes: [jerichoE1, jerichoE2, jerichoE3, jerichoE4, jerichoE5],
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
      unlocksEpisode: "seer.e2" as EpisodeId,
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

/* ─── THE SEER ARC — E2 ─── */
/* E2: "The Two Tomorrows"
   Per docs/design §7.3 — contradictory same-day prophecies.
   The contradiction's resolution requires consulting the
   Hierophant (Wraith) — cross-link to Wraith arc. */

const seerE2: EpisodeDefinition = {
  id: "seer.e2" as EpisodeId,
  arcId: ARC_THE_SEER,
  ordinal: 2,
  title: "The Two Tomorrows",
  summary:
    "Two prophecy tapes from the same day, recorded six hours apart, contradict each other. Both are signed by the Seer; both are sealed. Investigate which tomorrow she meant — and why she let two of them be filed under the same date in the first place.",
  clues: [
    {
      id: "seer.e2.tape_a_morning" as ClueId,
      title: "Tape #VAR-1109A — Morning Recording",
      body: "Recorded at 06:14, the morning of an unspecified date in Year 17,028 A.A. The prophecy reads: 'The Hierophant will write a name no one has yet inscribed; the litany will accept it; the editor will not edit it back out, because the editor will not know it was ever absent.' The tape is sealed; the Seer's hand on the catalog card is steady.",
      foundIn: "oracle-sanctum",
    },
    {
      id: "seer.e2.tape_b_afternoon" as ClueId,
      title: "Tape #VAR-1109B — Afternoon Recording",
      body: "Recorded at 14:32, the same day. The prophecy reads: 'The Hierophant will refuse to write a name no one has yet inscribed; the litany will hold the absence; the editor will read the absence as a victory and stop editing for one full morning.' Same hand on the catalog card. The Seer recorded a contradicting prophecy six hours after the first.",
      foundIn: "oracle-sanctum",
    },
    {
      id: "seer.e2.hierophant_marginalia" as ClueId,
      title: "Hierophant's Marginalia on Both Catalog Cards",
      body: "Both catalog cards bear an identical marginalia in Wraith Calder's hand, dated centuries after the recording: 'Both will happen. Both already have. The seam is the discipline.' The Hierophant has annotated the contradiction as resolved-by-being-double; the litany has, on the evidence, accepted both possibilities at different mornings without resolving them into one.",
      foundIn: "antiquarian-library",
    },
    {
      id: "seer.e2.seers_method_note" as ClueId,
      title: "The Seer's Method Note — Variant Recording",
      body: "A page of method notes in the Seer's archive: 'When the prophecy splits at the recording, I record both. I do not choose. The reader will not need me to choose; the reader will arrive having already chosen, and the prophecy that contains their choice will read as the one that was for them. The other tape stays sealed for someone else.' The Seer authored variant prophecies for variant readers.",
      foundIn: "cipher-den",
    },
  ],
  deductions: [
    {
      id: "seer.e2.d.both_prophecies_are_real" as DeductionId,
      clueA: "seer.e2.seers_method_note" as ClueId,
      clueB: "seer.e2.hierophant_marginalia" as ClueId,
      result: "correct",
      narrationId: "seer.e2.n.both_already_happened",
      narrationProse:
        "Both prophecies are real, and both have already happened. The Seer's method splits the prophecy at the recording when the future itself is forked, and she records both — refusing to choose for the reader. The Hierophant's marginalia confirms the canonical reading: 'Both will happen. Both already have. The seam is the discipline.' The litany has accepted variant inscriptions across variant mornings without collapsing them into a single canon. The case's open question is not which prophecy is true — both are. The case is which prophecy is for the reader who arrives, and that question the prophecy itself answers.",
      unlocksEpisode: "seer.e3" as EpisodeId,
    },
    {
      id: "seer.e2.d.contradiction_is_load_bearing" as DeductionId,
      clueA: "seer.e2.tape_a_morning" as ClueId,
      clueB: "seer.e2.tape_b_afternoon" as ClueId,
      result: "partial",
      narrationId: "seer.e2.n.the_contradiction_is_the_signal",
      narrationProse:
        "The contradiction is the signal. The two tapes do not cancel; they map two compatible mornings the Hierophant could occupy. The morning recording is the prophecy for a Hierophant who inscribes; the afternoon for a Hierophant who refuses. Neither is wrong. The Seer's discipline is to record both because the Saga is wide enough to hold both, and the Hierophant has — across centuries — done both, on different mornings, in service of the same litany. We do not have a contradiction. We have an inventory of available mornings.",
    },
    {
      id: "seer.e2.d.false_lead_seer_uncertain" as DeductionId,
      clueA: "seer.e2.tape_a_morning" as ClueId,
      clueB: "seer.e2.seers_method_note" as ClueId,
      result: "false_lead_named",
      narrationId: "seer.e2.n.not_uncertainty",
      narrationProse:
        "Reading the variant tapes as evidence of the Seer's uncertainty is the obvious move and the wrong one. Her method note is unambiguous: she does not choose because the future does not ask her to. Variant prophecies are her discipline of fidelity to a Saga that is, in places, genuinely double. Treating her as a flawed prophet whose contradictions need resolving collapses the case in the Hierarchy's preferred direction — they have always wanted prophets simpler than the prophecies are. The Seer's complexity is not a bug. It is the work.",
    },
  ],
  choices: [
    {
      id: "seer.e2.c.consult_wraith" as ChoiceId,
      label: "Bring both tapes to the Hierophant — let Wraith confirm which morning he occupies today.",
      weight: "cross_arc_wraith",
    },
    {
      id: "seer.e2.c.preserve_the_pair" as ChoiceId,
      label: "Leave both tapes in the archive — the Saga is wide enough; the discipline is fidelity, not resolution.",
      weight: "patient",
    },
    {
      id: "seer.e2.c.publish_the_method" as ChoiceId,
      label: "Publish the Seer's method note — variant prophecy is canon discipline; future readers should know.",
      weight: "transparent",
    },
  ],
  contentBundle: {
    songId: "bod.two_tomorrows",
    slideshowId: "bod.two_tomorrows",
    loredexUnlocks: [
      "concept_variant_prophecy",
      "concept_seer_method_note",
      "event_var_1109_pair",
      "concept_seam_discipline",
    ],
    conspiracyDiscoveries: [
      "var_1109a",
      "var_1109b",
      "hierophant_marginalia",
      "seer_method_note",
    ],
    dropAt: "episode_close",
  },
};

/* ─── THE SEER ARC — E3 ─── */
/* E3: "The Listener Who Stopped Listening"
   Per docs/design §7.3 — audience drift. The Seer's tapes
   were once played to a regular audience; somewhere in the
   archive's history that audience stopped attending.
   Investigate when, why, and who the last listener was. */

const seerE3: EpisodeDefinition = {
  id: "seer.e3" as EpisodeId,
  arcId: ARC_THE_SEER,
  ordinal: 3,
  title: "The Listener Who Stopped Listening",
  summary:
    "The Seer's archive once had a sustained audience: a single regular listener who attended every consultation for forty-one years. Then they stopped. The tapes from that period are unsealed; the gap is documented. Investigate who the listener was, why they stopped, and whether the archive's discipline of patience reads their absence as a verdict on the prophet or on themselves.",
  clues: [
    {
      id: "seer.e3.attendance_log" as ClueId,
      title: "Forty-One-Year Attendance Log",
      body: "The Seer's archive keeps a small ledger of consultation-day attendees. One name appears every consultation day for forty-one years and then disappears: 'Witness — name withheld at the listener's request.' The withholding is honoured. The dates are precise; the gap begins on the day after a specific consultation, dated three years before Lyra Vox's death.",
      foundIn: "oracle-sanctum",
    },
    {
      id: "seer.e3.last_consultations_card" as ClueId,
      title: "The Last Consultation's Catalog Card",
      body: "The catalog card for the listener's final consultation reads: 'Subject heard the prophecy. Subject did not return. The Seer has not asked them to return; the Seer's discipline does not pursue listeners.' The prophecy itself is sealed under standard archive terms — readable, but only by request. The card is annotated, in the Seer's hand: 'I knew this would be the last. I told them only what I could. The discipline held.'",
      foundIn: "antiquarian-library",
    },
    {
      id: "seer.e3.lyra_vox_marginal" as ClueId,
      title: "Vox's Marginal Note on the Attendance Log",
      body: "A pencilled marginal note in Lyra Vox's hand, beside the listener's final entry in the attendance log: 'Was him. He told me about it. He thought she'd been kind. He thought he should not push his luck twice. I did not argue.' Vox knew the listener personally and knew why he stopped. The 'him' is, by every cross-reference available, Wraith Calder.",
      foundIn: "cipher-den",
    },
    {
      id: "seer.e3.wraith_journal_entry" as ClueId,
      title: "Wraith's Pre-Rite Journal — The Last Consultation",
      body: "An entry in Wraith Calder's pre-rite journal, dated the day after the listener's final consultation: 'She told me what was in the rite if I asked her. I asked her. She told me. I do not need to ask anyone else now. The Seer is kind. I will not put her in the position of telling me again.' Wraith was the forty-one-year listener. He stopped attending because the prophecy he received was the answer to the only question he had left.",
      foundIn: "antiquarian-library",
    },
  ],
  deductions: [
    {
      id: "seer.e3.d.wraith_was_the_listener" as DeductionId,
      clueA: "seer.e3.lyra_vox_marginal" as ClueId,
      clueB: "seer.e3.wraith_journal_entry" as ClueId,
      result: "correct",
      narrationId: "seer.e3.n.he_stopped_when_he_had_his_answer",
      narrationProse:
        "Wraith Calder was the listener. For forty-one years he attended every consultation; on the day he received the prophecy that told him what was in the Sanctuary's Final Rite, he stopped. The discipline of his stopping is the same discipline as the Seer's record-and-suppress: he did not return because he did not want to put the Seer in the position of telling him again. The audience drift is not abandonment. It is fidelity. The Seer reads it as such — the catalog-card annotation makes that explicit. Lyra Vox knew, and did not argue. The archive holds the record of a listener who completed his witnessing and walked away.",
      unlocksEpisode: "seer.e4" as EpisodeId,
    },
    {
      id: "seer.e3.d.discipline_does_not_pursue" as DeductionId,
      clueA: "seer.e3.attendance_log" as ClueId,
      clueB: "seer.e3.last_consultations_card" as ClueId,
      result: "partial",
      narrationId: "seer.e3.n.the_discipline_holds_the_door",
      narrationProse:
        "The Seer's discipline does not pursue listeners. The catalog card is unambiguous: the absence is not a problem to be solved, it is a verdict the listener has the right to render. The Seer holds the door open without asking the absent witness to return — which is, structurally, the same shape as the DO-NOT-PLAY tape's record-and-suppress. The archive does not coerce attendance any more than it coerces playback. Both refusals — to record and to listen — are honoured by the same patience.",
    },
    {
      id: "seer.e3.d.false_lead_listener_died" as DeductionId,
      clueA: "seer.e3.attendance_log" as ClueId,
      clueB: "seer.e3.last_consultations_card" as ClueId,
      result: "false_lead_named",
      narrationId: "seer.e3.n.not_dead",
      narrationProse:
        "Reading the listener's disappearance as evidence of their death is the obvious move and the wrong one. The catalog card explicitly notes the Seer 'has not asked them to return' — language that presupposes the listener is alive and could be asked. The withholding is honoured because the listener requested it, which requires an ongoing person to honour. The forty-one-year attendance is a relationship the Seer chose to end on the listener's terms; treating it as a tragedy collapses the case in the wrong direction.",
    },
  ],
  choices: [
    {
      id: "seer.e3.c.tell_wraith_the_archive_remembers" as ChoiceId,
      label: "Tell Wraith the archive remembers him kindly — let the Hierophant hear that the Seer kept his door open.",
      weight: "cross_arc_wraith",
    },
    {
      id: "seer.e3.c.honour_the_withholding" as ChoiceId,
      label: "Honour the listener's withholding — leave the relationship as both parties left it; do not deliver mail neither one asked you to deliver.",
      weight: "patient",
    },
    {
      id: "seer.e3.c.publish_the_marginalia" as ChoiceId,
      label: "Publish the marginalia and the journal entry side by side — the saga should know how a forty-one-year audience ends.",
      weight: "transparent",
    },
  ],
  contentBundle: {
    songId: "bod.last_listener",
    slideshowId: "bod.last_listener",
    loredexUnlocks: [
      "concept_audience_drift",
      "concept_seer_does_not_pursue",
      "event_wraith_last_consultation",
      "concept_completed_witnessing",
    ],
    conspiracyDiscoveries: [
      "wraith_listener_revealed",
      "seer_attendance_log",
      "vox_marginal_witness",
      "completed_witnessing",
    ],
    dropAt: "episode_close",
  },
};

/* ─── THE SEER ARC — E4 ─── */
/* E4: "The Recording Engineer" — cross-link to Vex Solène. */

const seerE4: EpisodeDefinition = {
  id: "seer.e4" as EpisodeId,
  arcId: ARC_THE_SEER,
  ordinal: 4,
  title: "The Recording Engineer",
  summary:
    "Every prophecy in the Seer's archive was recorded by Engineer Zero — Vex Solène under her public credit, and once, on DEC-7710, under a Warlord-fragment alias she requested. The archive's audio fidelity has shaped what the Seer's voice sounds like to every reader who has ever heard a tape. Investigate the engineer's hand on the prophecies — and what would change if Vex closed her own seventh installment.",
  clues: [
    {
      id: "seer.e4.engineer_credit_ledger" as ClueId,
      title: "Seer's Engineer Credit Ledger",
      body: "The Seer's archive lists Engineer Zero on every recording credit except DEC-7710. The credit ledger is in the Seer's hand, and she annotates each entry with the take's quality, the room's acoustics, and a single word judging the engineer's discipline that day. The judgments across 4,711 sessions are: 'present.' Vex was present every time. The Seer noticed.",
      foundIn: "oracle-sanctum",
    },
    {
      id: "seer.e4.acoustic_signature_drift" as ClueId,
      title: "Acoustic Signature Drift Analysis",
      body: "A spectral analysis run by an apprentice (presumably Vex's) shows the recording booth's acoustic signature drifted slightly across decades — not from equipment changes, but from the engineer's posture. Vex sat differently at the console as she aged. The drift is gentle and consistent. The Seer's voice on early tapes is recorded against a slightly closer microphone than her late-archive voice. Listeners who replay both feel they are listening to two prophets, even though the Seer is one.",
      foundIn: "engineering",
    },
    {
      id: "seer.e4.seers_letter_to_vex" as ClueId,
      title: "The Seer's Letter to Vex (Sealed, Undelivered)",
      body: "A sealed letter in the Seer's archive, dated last decade, addressed to Vex Solène: 'When you decide to close the seventh installment, send word. I will record the closing if you ask. I owe you four thousand and twelve sessions of attention; I will give you one back.' The letter has not been delivered. The Seer is waiting for the request the alias-protocol authored long before Vex was old enough to make it.",
      foundIn: "antiquarian-library",
    },
    {
      id: "seer.e4.cross_arc_alias_decision" as ClueId,
      title: "Cross-Arc Echo — Vex's Open Installment",
      body: "If the player has investigated the Vex arc's E2 ('The Recording Engineer's Deferred Bill'), the seventh installment status is part of the case file. If they advised Vex to keep the lock open, the Seer's letter remains sealed. If they advised Vex to name the favour, the Seer's letter is the next move. The cross-arc state of the alias is now load-bearing on the Seer's E4 closing.",
      foundIn: "cipher-den",
    },
  ],
  deductions: [
    {
      id: "seer.e4.d.engineer_was_the_audience" as DeductionId,
      clueA: "seer.e4.engineer_credit_ledger" as ClueId,
      clueB: "seer.e4.acoustic_signature_drift" as ClueId,
      result: "correct",
      narrationId: "seer.e4.n.vex_was_listening_too",
      narrationProse:
        "Vex was the second listener. Wraith Calder attended every consultation for forty-one years; Vex attended every recording for forty-one years longer. The Seer's annotation 'present' across 4,711 sessions is not a recording-quality judgment — it is the prophet acknowledging that the engineer paid attention to every word she committed to tape. The acoustic drift confirms it physically: Vex's posture shifted with age but never with attention. The Seer recorded for two readers from the start. One arrived on consultation days; the other was already in the room.",
      unlocksEpisode: "seer.e5" as EpisodeId,
    },
    {
      id: "seer.e4.d.letter_waits_on_cross_arc" as DeductionId,
      clueA: "seer.e4.seers_letter_to_vex" as ClueId,
      clueB: "seer.e4.cross_arc_alias_decision" as ClueId,
      result: "partial",
      narrationId: "seer.e4.n.the_letter_is_a_cross_arc_payoff",
      narrationProse:
        "The Seer's sealed letter is a cross-arc payoff waiting on the Vex arc's E2 choice. If Vex named the favour, the Seer is ready to record the closing; if Vex held the lock, the Seer holds the letter alongside her. Neither is regret; both are fidelity. The Seer's debt of four thousand and twelve sessions of attention is real, and the prophet keeps her own books. The case here is whether the player nudges the Seer to deliver the letter regardless of Vex's choice — and the honest answer is: no. The waiting is the discipline.",
    },
    {
      id: "seer.e4.d.false_lead_seer_owes_vex" as DeductionId,
      clueA: "seer.e4.engineer_credit_ledger" as ClueId,
      clueB: "seer.e4.seers_letter_to_vex" as ClueId,
      result: "false_lead_named",
      narrationId: "seer.e4.n.not_a_debt_of_obligation",
      narrationProse:
        "Reading the Seer's offer to Vex as a debt of obligation is the obvious move and the wrong one. The prophet does not 'owe' the engineer a recording in any contractual sense — Vex was paid for every session through the Insurgency installment ledger. The Seer's offer is a counter-offering of attention: she will, if asked, record one closing-session in the same posture Vex held for centuries. It is gratitude wearing the language of debt because gratitude in the Seer's discipline always wears the language of fidelity.",
    },
  ],
  choices: [
    {
      id: "seer.e4.c.deliver_letter_now" as ChoiceId,
      label: "Press the Seer to deliver the letter regardless of Vex's choice — the engineer should know she was heard.",
      weight: "transparent",
    },
    {
      id: "seer.e4.c.honour_the_wait" as ChoiceId,
      label: "Let the letter wait — it is the engineer's request to make, not the prophet's, and not yours.",
      weight: "patient",
    },
    {
      id: "seer.e4.c.cross_arc_relay" as ChoiceId,
      label: "Cross-arc to Vex — tell the engineer the letter exists. She can decide whether to ask for it.",
      weight: "cross_arc_vex",
    },
  ],
  contentBundle: {
    songId: "bod.engineer_was_present",
    slideshowId: "bod.engineer_was_present",
    loredexUnlocks: [
      "concept_engineer_credit_ledger",
      "concept_acoustic_signature_drift",
      "concept_seers_sealed_letter",
      "concept_two_listeners",
    ],
    conspiracyDiscoveries: [
      "engineer_was_present",
      "vex_acoustic_drift",
      "seers_letter_to_vex",
      "cross_arc_alias_state",
    ],
    dropAt: "episode_close",
  },
};

/* ─── THE SEER ARC — E5 ─── */
/* E5: "The Prophecy That Cancels Itself" — arc closer per
   docs/design §7.3. Third prediction visible only via in-order
   completion. */

const seerE5: EpisodeDefinition = {
  id: "seer.e5" as EpisodeId,
  arcId: ARC_THE_SEER,
  ordinal: 5,
  title: "The Prophecy That Cancels Itself",
  summary:
    "The Seer's archive contains one prophecy that exists only when its conditions are not met. The witness has, by reaching this episode, met enough of those conditions that the prophecy is now legible — and, by being legible, has begun to cancel itself. Investigate what the prophecy says before it disappears, and whether the disappearance is the verdict or merely the form.",
  clues: [
    {
      id: "seer.e5.cancelling_prophecy_text" as ClueId,
      title: "The Cancelling Prophecy — Last Legible Moment",
      body: "On a tape labelled with no number, recorded on no documented date, the Seer's voice reads a single sentence: 'There will come a witness who reads four of my prophecies in order, and the moment they read the fifth, the fifth will have already cancelled.' The tape's contents disappear on first reading — replaced with silence — but the catalog card preserves the sentence as transcript. The witness who reaches it has, by reaching it, made it true and unmade it.",
      foundIn: "oracle-sanctum",
    },
    {
      id: "seer.e5.canon_register_paradox" as ClueId,
      title: "Canon Register — Paradox Entry",
      body: "The Antiquarian's Journal entry on the cancelling prophecy notes: 'A prophecy that cancels itself when fulfilled is, on the legal side of canon, neither true nor false — it is conditional on its own observation. The Hierophant has been writing the cancelled prophecy into the daily-names litany every morning, under a placeholder name, so that the saga preserves a record that it existed even though it cannot be quoted. The Hierophant's discipline is, in effect, the prophecy's archivist after the fact.'",
      foundIn: "antiquarian-library",
    },
    {
      id: "seer.e5.seer_method_self_cancellation" as ClueId,
      title: "The Seer's Method Note on Self-Cancelling Records",
      body: "From the Seer's method notes: 'Some prophecies are made true by the discipline of waiting; some are made false by the same discipline; one is made by the witness's reading and unmade by the witness's reading. The third kind I record once. I do not re-record. The tape and the tape's catalog card cannot both be true at the moment of reading. I leave the catalog card to the saga and let the tape go quiet.'",
      foundIn: "cipher-den",
    },
    {
      id: "seer.e5.witness_arrival_log" as ClueId,
      title: "Witness Arrival Log — This Reading",
      body: "A new entry has been made in the Seer's archive, dated this morning: 'Witness arrived. Read four prophecies in order. Reached the fifth. The fifth cancelled.' The handwriting is the Seer's. The annotation: 'I am writing this knowing the witness will, in turn, read this entry. The seam of the prophecy is held open by the saga's ability to record its own observation. I am, on this morning, more grateful than usual to be a record-keeper.'",
      foundIn: "oracle-sanctum",
    },
  ],
  deductions: [
    {
      id: "seer.e5.d.cancellation_is_the_form" as DeductionId,
      clueA: "seer.e5.cancelling_prophecy_text" as ClueId,
      clueB: "seer.e5.seer_method_self_cancellation" as ClueId,
      result: "correct",
      narrationId: "seer.e5.n.the_cancellation_is_the_prophecy",
      narrationProse:
        "The cancellation is the prophecy. The Seer's method is unambiguous: self-cancelling records are the third discipline of her work, and the only one she does not re-record. The witness who reads the fifth tape is the prophecy's completion, and the cancellation that follows is not a failure mode — it is the form the prophecy required. We arrived. We read. The tape went quiet. The catalog card kept the sentence. The litany has the placeholder. The saga has the record. Nothing has been lost; the loss IS the record.",
    },
    {
      id: "seer.e5.d.hierophant_archives_the_paradox" as DeductionId,
      clueA: "seer.e5.canon_register_paradox" as ClueId,
      clueB: "seer.e5.witness_arrival_log" as ClueId,
      result: "partial",
      narrationId: "seer.e5.n.the_litany_holds_the_placeholder",
      narrationProse:
        "Wraith Calder's daily-names ceremony has been holding the placeholder for centuries. The Hierophant inscribes the cancelled prophecy under a name no other entry uses, every morning, so that the saga has a record of the cancellation even though the cancellation itself cannot be re-read. He is, on this evidence, the prophecy's posthumous archivist — the only person who has been keeping faith with a prophecy that exists only as the trace of its own absence. Wraith and the Seer have been collaborating on this beat for centuries without ever meeting again after the forty-one-year listener stopped attending.",
    },
    {
      id: "seer.e5.d.false_lead_paradox_is_failure" as DeductionId,
      clueA: "seer.e5.cancelling_prophecy_text" as ClueId,
      clueB: "seer.e5.witness_arrival_log" as ClueId,
      result: "false_lead_named",
      narrationId: "seer.e5.n.not_failure",
      narrationProse:
        "Reading the cancellation as a failure of prophecy is the obvious move and the wrong one. A failed prophecy does not have a method note explaining its discipline; it does not have a Hierophant archiving its absence; it does not have a witness-arrival log written by the prophet on the morning of the witness's arrival. We are reading a paradox as a malfunction. The Seer reads it as a structure she chose. The structure has held for centuries.",
    },
  ],
  choices: [
    {
      id: "seer.e5.c.publish_the_paradox" as ChoiceId,
      label: "Publish the entire case file — the cancelling prophecy was authored to be read in this exact paradox-respecting order; the saga should know how a prophet keeps faith with a record that erases itself.",
      weight: "transparent",
    },
    {
      id: "seer.e5.c.honour_the_silence" as ChoiceId,
      label: "Leave the cancelling prophecy uncited — the Hierophant's placeholder is the form the saga keeps; the witness's reading is enough.",
      weight: "patient",
    },
    {
      id: "seer.e5.c.thank_the_seer_in_person" as ChoiceId,
      label: "Visit the Seer in person and thank her — for the discipline, for the archive, for the centuries of waiting.",
      weight: "fidelity",
    },
    {
      id: "seer.e5.c.cross_arc_inscribe_with_wraith" as ChoiceId,
      label: "Stand beside Wraith on the morning of the next inscription — let the placeholder be witnessed by a third person who knows what it stands for.",
      weight: "cross_arc_wraith",
    },
  ],
  contentBundle: {
    songId: "bod.silence_in_heaven_finale",
    slideshowId: "bod.silence_in_heaven_finale",
    loredexUnlocks: [
      "concept_self_cancelling_prophecy",
      "concept_witness_arrival_log",
      "concept_seer_third_discipline",
      "concept_hierophant_paradox_archivist",
    ],
    conspiracyDiscoveries: [
      "cancelling_prophecy",
      "seer_third_discipline",
      "wraith_seer_collaboration_centuries",
      "witness_completion",
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
  episodes: [seerE1, seerE2, seerE3, seerE4, seerE5],
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
      unlocksEpisode: "vex.e2" as EpisodeId,
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

/* ─── VEX SOLÈNE ARC — E2 ─── */
/* E2: "The Recording Engineer's Deferred Bill"
   Vex's brokerage with the Insurgency over the alias is paid
   in installments — and one installment was never collected.
   Investigate what the Insurgency owes Vex that they have not
   yet redeemed. */

const vexE2: EpisodeDefinition = {
  id: "vex.e2" as EpisodeId,
  arcId: ARC_VEX_SOLENE,
  ordinal: 2,
  title: "The Recording Engineer's Deferred Bill",
  summary:
    "The Insurgency paid Vex for the DEC-7710 alias in installments — favours rather than currency. The ledger shows every installment redeemed except the last, an item entered as 'one favour to be named.' Investigate what the unnamed favour was for, and whether Vex still intends to ask.",
  clues: [
    {
      id: "vex.e2.installment_ledger" as ClueId,
      title: "Insurgency Installment Ledger — Vex Account",
      body: "The Insurgency's confidential favour-ledger lists Vex's account in seven installments. Six are stamped REDEEMED with dated countersignatures. The seventh reads: 'one favour to be named, at the engineer's discretion, no expiry.' The entry has been on the books for centuries; Vex has never named the favour.",
      foundIn: "war-room",
    },
    {
      id: "vex.e2.engineering_workshop_letter" as ClueId,
      title: "Vex's Letter to the Workshop — Why She Hasn't Named It",
      body: "A letter from Vex to her engineering apprentices, dated last decade: 'I keep the seventh installment open because the Insurgency does not get to use a paid favour as evidence the deal was complete. As long as one favour is unnamed, the Seer's terms are still being honoured. The day I name it is the day the alias closes. The alias is more useful than the favour.'",
      foundIn: "engineering",
    },
    {
      id: "vex.e2.seer_consultation_request" as ClueId,
      title: "The Seer's Consultation Request — Variant Reading",
      body: "A consultation request from the Seer to Vex, undated, sealed with the Seer's wax: 'When you are ready to name the favour, ask me to record the naming. The alias closing should be witnessed.' Vex has the request in her workshop. She has never returned it. The Seer has been waiting alongside the Insurgency, in a different posture.",
      foundIn: "cipher-den",
    },
    {
      id: "vex.e2.acknowledged_witness_list" as ClueId,
      title: "Acknowledged-Witness List — Insurgency",
      body: "The Insurgency keeps a register of recognised witnesses for high-discretion contract-closure events. Vex's name is on the list, with a notation in her own hand: 'When the engineer asks, the engineer is the witness. The closing does not require an external observer; the maker has standing in their own work.' She wrote her own clause into the witness register the day the alias was issued.",
      foundIn: "antiquarian-library",
    },
  ],
  deductions: [
    {
      id: "vex.e2.d.alias_outlasts_payment" as DeductionId,
      clueA: "vex.e2.installment_ledger" as ClueId,
      clueB: "vex.e2.engineering_workshop_letter" as ClueId,
      result: "correct",
      narrationId: "vex.e2.n.the_open_installment_is_the_alias",
      narrationProse:
        "Vex has kept the seventh installment open on purpose. As long as one favour is unnamed, the Insurgency cannot claim the deal is complete — and the alias she requested for DEC-7710 stays in force by the original terms the Seer asked them to grant. The unnamed favour is not an unredeemed prize. It is a structural lock on the alias itself. Vex has been her own contract enforcer for centuries by simply declining to ask for what she's owed.",
      unlocksEpisode: "vex.e3" as EpisodeId,
    },
    {
      id: "vex.e2.d.witness_clause_is_self_signed" as DeductionId,
      clueA: "vex.e2.acknowledged_witness_list" as ClueId,
      clueB: "vex.e2.seer_consultation_request" as ClueId,
      result: "partial",
      narrationId: "vex.e2.n.she_signed_her_own_witness",
      narrationProse:
        "Vex authored her own witness-clause: when the engineer asks, the engineer is the witness. The Seer's consultation request acknowledges this — the Seer offers to record the naming, but does not require it. The alias closing, on the legal side, doesn't need an external observer. Vex has, since the day the alias was issued, held both the engineer's stake and the witness's credentials. She is the contract's only required participant. The Seer has been waiting alongside her, not over her — a courtesy, not a regulation.",
    },
    {
      id: "vex.e2.d.false_lead_unpaid_grievance" as DeductionId,
      clueA: "vex.e2.installment_ledger" as ClueId,
      clueB: "vex.e2.acknowledged_witness_list" as ClueId,
      result: "false_lead_named",
      narrationId: "vex.e2.n.not_unpaid",
      narrationProse:
        "Reading the open installment as evidence the Insurgency has stiffed her is the obvious move and the wrong one. The favour is unnamed because she has not named it. The witness register has her on it because she put herself on it. The Insurgency is, on paper, willing to redeem at any time. Vex is the one keeping the bill open — because the bill, not the favour, is what protects the alias the Seer asked for.",
    },
  ],
  choices: [
    {
      id: "vex.e2.c.name_the_favour" as ChoiceId,
      label: "Encourage Vex to name the favour — the alias has done its work; closing it honours the Seer's original request.",
      weight: "closing_witness",
    },
    {
      id: "vex.e2.c.preserve_the_lock" as ChoiceId,
      label: "Encourage Vex to keep the installment open — the alias remains useful; structural locks earn their keep.",
      weight: "patient",
    },
    {
      id: "vex.e2.c.invite_the_seer" as ChoiceId,
      label: "Invite the Seer to record the naming-or-not, whichever Vex chooses — the witnessing matters either way.",
      weight: "cross_arc_seer",
    },
  ],
  contentBundle: {
    songId: "album1.t05",
    slideshowId: "album1.t05",
    loredexUnlocks: [
      "concept_seventh_installment",
      "concept_engineer_witness_clause",
      "event_alias_structural_lock",
      "concept_named_favour",
    ],
    conspiracyDiscoveries: [
      "seventh_installment",
      "engineer_witness_clause",
      "seer_consultation_request",
      "vex_self_inscribed_witness",
    ],
    dropAt: "episode_close",
  },
};

/* ─── VEX SOLÈNE ARC — E3 ─── */
/* E3: "The Apprentice's Question"
   One of Vex's engineering apprentices has noticed the
   pattern. Investigate what the apprentice has reconstructed
   from the public records, and whether the discipline of
   waiting can survive a reader Vex did not choose. */

const vexE3: EpisodeDefinition = {
  id: "vex.e3" as EpisodeId,
  arcId: ARC_VEX_SOLENE,
  ordinal: 3,
  title: "The Apprentice's Question",
  summary:
    "An engineering apprentice in Vex's workshop has reconstructed the equipment-signature match from publicly-available records. They have not yet asked Vex about it. They have written a letter they have not sent. Investigate what the apprentice knows, what they intend to do with it, and whether the discipline of waiting can hold a reader Vex did not choose.",
  clues: [
    {
      id: "vex.e3.apprentice_letter_draft" as ClueId,
      title: "Apprentice's Unsent Letter to Vex",
      body: "A folded sheet on the apprentice's bench, dated last week: 'Master, I have been doing the spectral analysis you taught us. I ran it on the public archive's calibration tapes. The signatures all match yours, including DEC-7710 — the one credited to a Warlord-fragment alias. I am not going to ask you about it. I wanted you to know that I figured it out, and that knowing has not changed how I work with you.' The letter is unsigned. The apprentice has not sent it.",
      foundIn: "engineering",
    },
    {
      id: "vex.e3.public_archive_calibration_tapes" as ClueId,
      title: "Publicly-Available Calibration Tapes",
      body: "The Insurgency's public archive includes, for transparency reasons that predate the alias decision, calibration tapes from every Insurgency engineer's rig. Vex's calibration tape is among them. Anyone with the spectral-analysis training Vex herself teaches can run the same comparison the apprentice ran. The training is the disclosure. The Insurgency, on this evidence, decided long ago that the alias would eventually be readable — they only declined to read it themselves.",
      foundIn: "antiquarian-library",
    },
    {
      id: "vex.e3.apprentice_workbench_state" as ClueId,
      title: "Apprentice's Workbench — Continuing Work",
      body: "The apprentice's workbench is laid out for the next session. Their work is not slowing; their tone with Vex (per the workshop's daily-log entries) is unchanged. The deduction has not altered their relationship with their master. The discipline Vex taught them — including the discipline of when to ask and when to know without asking — appears to have been internalised more thoroughly than Vex herself realised.",
      foundIn: "medical-bay",
    },
    {
      id: "vex.e3.vex_workshop_diary" as ClueId,
      title: "Vex's Workshop Diary — Recent Entry",
      body: "An entry in Vex's workshop diary from this week: 'I think the apprentice has figured it out. Their lab notes have a precision they did not have before. They have not asked. I am going to wait. If they ask, I will answer. If they continue not to ask, I will be honoured by the discipline. I taught them this, and they may be teaching me back.' The diary is not encrypted. Vex left it where the apprentice can read it.",
      foundIn: "captains-quarters",
    },
  ],
  deductions: [
    {
      id: "vex.e3.d.discipline_holds" as DeductionId,
      clueA: "vex.e3.apprentice_letter_draft" as ClueId,
      clueB: "vex.e3.vex_workshop_diary" as ClueId,
      result: "correct",
      narrationId: "vex.e3.n.both_chose_to_know_without_asking",
      narrationProse:
        "Both chose to know without asking. The apprentice deduced the alias from the public calibration tapes, wrote a letter they intend never to send, and continued working as before. Vex deduced the deduction from the apprentice's lab notes, wrote a diary entry she is leaving where the apprentice can read it, and decided to wait. Neither has confronted the other; both have, separately, chosen the discipline the Seer asked Vex to honour. The discipline is now portable — it has propagated from teacher to student without either of them needing to name it. The case's open question is whether the discipline survives the saga's other readers, but inside the workshop, the answer is: it holds.",
      unlocksEpisode: "vex.e4" as EpisodeId,
    },
    {
      id: "vex.e3.d.transparency_was_deliberate" as DeductionId,
      clueA: "vex.e3.public_archive_calibration_tapes" as ClueId,
      clueB: "vex.e3.apprentice_workbench_state" as ClueId,
      result: "partial",
      narrationId: "vex.e3.n.the_archive_chose_transparency",
      narrationProse:
        "The Insurgency's public-archive transparency was deliberate. Calibration tapes are the kind of disclosure that look procedural until someone with training notices what they enable; the Insurgency knew, when it decided to publish them, that the alias would eventually be readable by anyone Vex herself trained. The transparency was an investment in the discipline of waiting — they trusted that the readers who could deduce would also be the readers who could choose not to act on the deduction. The apprentice is the first reader to test that trust. The trust has held.",
    },
    {
      id: "vex.e3.d.false_lead_betrayal" as DeductionId,
      clueA: "vex.e3.apprentice_letter_draft" as ClueId,
      clueB: "vex.e3.public_archive_calibration_tapes" as ClueId,
      result: "false_lead_named",
      narrationId: "vex.e3.n.not_a_betrayal",
      narrationProse:
        "Reading the apprentice's deduction as a betrayal of Vex's discretion is the obvious move and the wrong one. A betrayal does not write a letter explicitly stating that knowing has not changed how the writer works with their master. A betrayal does not stay unsent. The apprentice's deduction is exactly the discipline Vex teaches — the saga's record-and-don't-act pattern internalised at the bench level. We are reading their accuracy as treachery; it is, on this evidence, fidelity.",
    },
  ],
  choices: [
    {
      id: "vex.e3.c.encourage_apprentice_to_send" as ChoiceId,
      label: "Encourage the apprentice to send the letter — the discipline is stronger when it is acknowledged on both sides.",
      weight: "transparent",
    },
    {
      id: "vex.e3.c.encourage_continued_silence" as ChoiceId,
      label: "Honour both their disciplines — let the unsent letter and the unencrypted diary do their work without your interference.",
      weight: "patient",
    },
    {
      id: "vex.e3.c.bring_to_seer" as ChoiceId,
      label: "Bring the case to the Seer — she granted Vex the original alias; let her see what kind of discipline her granting produced.",
      weight: "cross_arc_seer",
    },
  ],
  contentBundle: {
    songId: "album1.t06",
    slideshowId: "album1.t06",
    loredexUnlocks: [
      "entity_vex_apprentice",
      "concept_calibration_tape_transparency",
      "concept_propagated_discipline",
      "concept_unsent_letter",
    ],
    conspiracyDiscoveries: [
      "vex_apprentice",
      "calibration_tape_disclosure",
      "vex_diary_unencrypted",
      "discipline_propagation",
    ],
    dropAt: "episode_close",
  },
};

/* ─── VEX SOLÈNE ARC — E4 ─── */
/* E4: "The Apprentice's Workshop" — Vex's apprentice has
   been preparing the workshop's succession quietly. */

const vexE4: EpisodeDefinition = {
  id: "vex.e4" as EpisodeId,
  arcId: ARC_VEX_SOLENE,
  ordinal: 4,
  title: "The Apprentice's Workshop",
  summary:
    "The apprentice's deduction in E3 was the first move in a longer succession. Their bench is now configured to take over the Insurgency's calibration-tape pipeline; their training files are organised; their tools are hers. Investigate whether Vex has been preparing the apprentice for succession all along — and whether the apprentice has known.",
  clues: [
    {
      id: "vex.e4.workshop_inventory" as ClueId,
      title: "Workshop Inventory — Tool Migration Map",
      body: "Vex's master inventory shows fifty-four primary tools. Across the past three years, twenty-two have been migrated to the apprentice's bench (still labelled with Vex's name), six have been duplicated (apprentice has a copy), and twenty-six remain on Vex's bench. The migration is gradual, deliberate, and unmentioned in any of the workshop's daily logs. The apprentice's bench is half a master's bench now.",
      foundIn: "engineering",
    },
    {
      id: "vex.e4.training_files_meta" as ClueId,
      title: "Training Files Metadata",
      body: "Vex's training files for the apprentice carry timestamps that pre-date the apprentice's official enrollment by four years. The files were authored before Vex met them; the curriculum was prepared before the student existed. Cross-reference with the Insurgency's apprentice-selection records: Vex was on the selection committee that chose the apprentice.",
      foundIn: "antiquarian-library",
    },
    {
      id: "vex.e4.calibration_pipeline_handoff_draft" as ClueId,
      title: "Calibration Pipeline Handoff Draft",
      body: "A draft document on Vex's desk: 'Calibration Pipeline — Transition Plan v.7.' Version 1 dates to seven years ago; v.7 is dated last week. The handoff is fully specified: the apprentice runs every Insurgency calibration through their own rig within eighteen months, with Vex as advisory backup for two years after that. The draft has no signature line. Vex has been preparing for the day she stops being the engineer of record without ever marking the day on any calendar.",
      foundIn: "war-room",
    },
    {
      id: "vex.e4.apprentice_workbench_personal_note" as ClueId,
      title: "Apprentice's Workbench — Personal Note",
      body: "Tucked under the apprentice's calibration manual, a private note in their hand: 'I have known since the second week. Master left the v.1 transition plan visible during my first inventory rotation. I have been working at her pace. When she names it, I am ready. When she does not, I am still ready.' The note is dated six years ago.",
      foundIn: "captains-quarters",
    },
  ],
  deductions: [
    {
      id: "vex.e4.d.succession_was_mutual" as DeductionId,
      clueA: "vex.e4.training_files_meta" as ClueId,
      clueB: "vex.e4.apprentice_workbench_personal_note" as ClueId,
      result: "correct",
      narrationId: "vex.e4.n.both_have_known",
      narrationProse:
        "Both have known from the start. Vex authored the curriculum before the student existed, sat on the committee that selected them, and left the v.1 transition plan visible during the apprentice's first inventory rotation. The apprentice has known since the second week, and has been working at Vex's pace ever since. The succession is mutual; both have refused to name it for the same reason — naming it would make it a deadline, and the work is the work whether or not it has a deadline. The discipline Vex teaches is, on this evidence, the discipline of preparing for succession without rehearsing the closing.",
      unlocksEpisode: "vex.e5" as EpisodeId,
    },
    {
      id: "vex.e4.d.handoff_is_already_underway" as DeductionId,
      clueA: "vex.e4.workshop_inventory" as ClueId,
      clueB: "vex.e4.calibration_pipeline_handoff_draft" as ClueId,
      result: "partial",
      narrationId: "vex.e4.n.the_handoff_is_a_practiced_motion",
      narrationProse:
        "The handoff is already underway. Twenty-two of fifty-four primary tools have migrated; the calibration pipeline draft has been rewritten seven times across seven years; the apprentice's bench is half a master's. The succession is not a future event the saga is anticipating — it is a process that has been in progress for years, slow enough that nobody (including Vex) has had to mark a day. The case here is whether marking the day would change anything. The honest answer is: marginally. The work continues either way.",
    },
    {
      id: "vex.e4.d.false_lead_apprentice_eager" as DeductionId,
      clueA: "vex.e4.apprentice_workbench_personal_note" as ClueId,
      clueB: "vex.e4.workshop_inventory" as ClueId,
      result: "false_lead_named",
      narrationId: "vex.e4.n.not_eager_displacement",
      narrationProse:
        "Reading the apprentice's preparation as eagerness to displace the master is the obvious move and the wrong one. An eager-to-displace apprentice does not write 'When she does not name it, I am still ready.' An eager apprentice does not work at the master's pace; they work faster, hoping to force the timeline. The apprentice's discipline is fidelity — they have made themselves continuously ready without making themselves the reason for the change.",
    },
  ],
  choices: [
    {
      id: "vex.e4.c.encourage_naming_the_day" as ChoiceId,
      label: "Encourage Vex to name the day — the succession deserves a marked transition.",
      weight: "transparent",
    },
    {
      id: "vex.e4.c.honour_the_unmarked_handoff" as ChoiceId,
      label: "Honour the unmarked handoff — the discipline is fidelity to the work, not theatre about its phases.",
      weight: "patient",
    },
    {
      id: "vex.e4.c.brief_the_apprentice" as ChoiceId,
      label: "Brief the apprentice on the case file — they have earned the saga's confidence; let them know.",
      weight: "direct",
    },
  ],
  contentBundle: {
    songId: "album1.t07",
    slideshowId: "album1.t07",
    loredexUnlocks: [
      "concept_workshop_inventory_migration",
      "concept_training_files_meta",
      "concept_calibration_pipeline_handoff",
      "concept_unmarked_succession",
    ],
    conspiracyDiscoveries: [
      "tool_migration_map",
      "pre_authored_curriculum",
      "transition_plan_v7",
      "apprentice_known_since_week_two",
    ],
    dropAt: "episode_close",
  },
};

/* ─── VEX SOLÈNE ARC — E5 (final) ─── */
/* E5: "The Engineer's Last Calibration" — arc closer. Vex
   runs one final calibration session, alone, on the same
   rig she used for DEC-7710. */

const vexE5: EpisodeDefinition = {
  id: "vex.e5" as EpisodeId,
  arcId: ARC_VEX_SOLENE,
  ordinal: 5,
  title: "The Engineer's Last Calibration",
  summary:
    "Vex has scheduled a final calibration session on her original rig — alone, no apprentice, no Seer attendance. The session is logged for tomorrow morning. Investigate what the calibration is FOR — and choose whether to attend, whether to leave the engineer the privacy she requested, or whether to bring the alias back into the room one last time.",
  clues: [
    {
      id: "vex.e5.scheduled_session_card" as ClueId,
      title: "Scheduled Session Card — Tomorrow 06:00",
      body: "The Insurgency calibration-pipeline log shows a session scheduled for tomorrow at 06:00. Engineer of record: Vex Solène. Subject: 'final calibration of the original rig before retirement.' Attendees: 'none requested.' Vex has booked the room for two hours. The calibration only takes forty-five minutes.",
      foundIn: "engineering",
    },
    {
      id: "vex.e5.original_rig_status" as ClueId,
      title: "Original Rig — Maintenance Status",
      body: "The rig Vex used for DEC-7710 has been retained in working order despite being decommissioned twenty years ago. Maintenance logs in Vex's hand: every six months, full diagnostic, no part replacement, no documented reason. The rig is preserved because Vex preserved it. The apprentice's rig (modern, in active service) is across the room.",
      foundIn: "engineering",
    },
    {
      id: "vex.e5.private_recording_intent" as ClueId,
      title: "Vex's Private Recording Intent",
      body: "A diary entry the apprentice has not read (still in the workshop diary the apprentice does not open out of respect): 'Tomorrow I am going to record a single take alone on the original rig. I do not yet know what I am recording. The Seer's letter is sealed in my desk; I have not opened it. Whether tomorrow's session names the seventh installment or seals it forever, I want to be the one who hears the take first. After tomorrow, the rig is the apprentice's to retire as they choose.'",
      foundIn: "captains-quarters",
    },
    {
      id: "vex.e5.cross_arc_seer_letter_state" as ClueId,
      title: "Cross-Arc Echo — Seer's Letter State",
      body: "If the player has reached Seer E4 and chosen to relay the letter's existence to Vex (`cross_arc_relay`), the diary entry above ends with 'I will open it tonight.' If the player chose otherwise, the diary entry ends with 'I will not open it.' The player's earlier choice is, on this evidence, the variable that decides whether tomorrow morning's session is a closing or a continuation.",
      foundIn: "cipher-den",
    },
  ],
  deductions: [
    {
      id: "vex.e5.d.session_is_a_self_witnessing" as DeductionId,
      clueA: "vex.e5.private_recording_intent" as ClueId,
      clueB: "vex.e5.original_rig_status" as ClueId,
      result: "correct",
      narrationId: "vex.e5.n.she_recorded_for_herself_first",
      narrationProse:
        "Tomorrow's session is a self-witnessing. Vex has preserved the original rig for twenty years past its decommissioning so that she could, when ready, record a single take alone — to be the first listener to whatever the engineer's life has finally accumulated into. The apprentice will be the second listener; the Seer (if the letter is opened) will be the recorder; but Vex herself will be the first. The recording engineer is, on this morning, becoming her own audience for the first time. Her career began with her recording for someone else's prophecy. Her career closes with her recording for herself.",
    },
    {
      id: "vex.e5.d.cross_arc_decides_closing" as DeductionId,
      clueA: "vex.e5.scheduled_session_card" as ClueId,
      clueB: "vex.e5.cross_arc_seer_letter_state" as ClueId,
      result: "partial",
      narrationId: "vex.e5.n.your_earlier_choice_is_in_the_room_tomorrow",
      narrationProse:
        "The player's earlier choice is in the room tomorrow. If Vex opens the Seer's letter tonight, tomorrow's session has a recorder, the alias closes by canon, and the seventh installment is named. If she does not, tomorrow is a private take that lives only in Vex's own files, and the alias keeps the structural lock for another generation. Both endings are real; both are honoured by the engineer's career. The case here is whether the player attends tomorrow or trusts the engineer to be her own first reader.",
    },
    {
      id: "vex.e5.d.false_lead_retirement_party" as DeductionId,
      clueA: "vex.e5.scheduled_session_card" as ClueId,
      clueB: "vex.e5.original_rig_status" as ClueId,
      result: "false_lead_named",
      narrationId: "vex.e5.n.not_a_retirement_party",
      narrationProse:
        "Reading tomorrow's session as a retirement party is the obvious move and the wrong one. Retirement parties have attendees; Vex booked attendees: 'none requested.' Retirement parties have a programme; Vex's session has only a subject line. The engineer is not closing a career publicly — she is, on her own terms, recording one final take that may or may not enter the saga. The discipline that started with an alias is closing in a posture matched to its origin: alone, by request, on the rig the alias was issued for.",
    },
  ],
  choices: [
    {
      id: "vex.e5.c.attend_at_06_00" as ChoiceId,
      label: "Attend at 06:00 — be present without being requested; the engineer has earned a witness whether she asked for one or not.",
      weight: "witness",
    },
    {
      id: "vex.e5.c.honour_the_privacy" as ChoiceId,
      label: "Honour the 'none requested' — Vex earned the right to be her own first listener; do not impose your presence on the morning she chose for solitude.",
      weight: "patient",
    },
    {
      id: "vex.e5.c.cross_arc_attend_with_seer" as ChoiceId,
      label: "Stand in the corridor outside the booth with the Seer — neither of you enter; both of you are present without intruding; the recording happens behind a door that you both witness without crossing.",
      weight: "cross_arc_seer",
    },
    {
      id: "vex.e5.c.tell_apprentice_to_attend" as ChoiceId,
      label: "Quietly inform the apprentice — let them choose for themselves whether to be present; they have earned the agency.",
      weight: "succession",
    },
  ],
  contentBundle: {
    songId: "album1.t08",
    slideshowId: "album1.t08",
    loredexUnlocks: [
      "concept_engineers_last_calibration",
      "concept_self_witnessing_recording",
      "concept_unrequested_attendance",
      "concept_alias_closing_options",
    ],
    conspiracyDiscoveries: [
      "tomorrow_06_00_session",
      "preserved_original_rig",
      "private_recording_intent",
      "cross_arc_letter_state",
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
  episodes: [vexE1, vexE2, vexE3, vexE4, vexE5],
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
      unlocksEpisode: "game_master.e2" as EpisodeId,
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

/* ─── GAME MASTER ARC — E2 ─── */
/* E2: "The Goggles' Operator"
   Per docs/design §7 Game Master arc, deepening — the Hierarchy
   has the Goggles, but who is using them? Investigate the
   contemporary Goggles operator. */

const gameMasterE2: EpisodeDefinition = {
  id: "game_master.e2" as EpisodeId,
  arcId: ARC_GAME_MASTER,
  ordinal: 2,
  title: "The Goggles' Operator",
  summary:
    "The Hierarchy has been holding the Game Master's Goggles for centuries. Someone is using them — the Iron Lion imprint inside the Matrix is asking unauthored questions, which requires an instrument that can edit the substrate. Investigate who in the Hierarchy holds the Goggles today, and what they have been editing on the Game Master's behalf.",
  clues: [
    {
      id: "game_master.e2.hierarchy_duty_roster" as ClueId,
      title: "Hierarchy Duty Roster — Goggles Custodian",
      body: "A roster from the Hierarchy of the Damned's vault division lists the Goggles' current custodian: Velkraal, Hierarchy junior partner (research). Velkraal has held the post for sixty-three years, the longest any custodian has lasted before being replaced. The roster's notes column reads, in Xeth'Raal's hand: 'subject works carefully; do not interrupt.'",
      foundIn: "war-room",
    },
    {
      id: "game_master.e2.matrix_edit_telemetry" as ClueId,
      title: "Matrix Edit Telemetry — Substrate Anomaly",
      body: "The CADES unit's monitoring systems log substrate-edit events inside the Matrix of Dreams. The pattern over the past sixty-three years is consistent: small, precise edits to the Iron Lion scenario only — never to the other archived consciousnesses. Someone with the Goggles has been editing exactly one scenario, slowly, in the direction of letting the imprint inside it grow.",
      foundIn: "medical-bay",
    },
    {
      id: "game_master.e2.velkraals_letter_to_archon" as ClueId,
      title: "Velkraal's Posthumous Letter to the Archon",
      body: "An unsent letter recovered from Velkraal's research desk: 'I have been editing the Iron Lion scenario in the direction you would have edited it yourself, had you had time. The cult sanctifies you; the Hierarchy holds your instrument; I am, perhaps, the only one in either organisation who is doing what you actually wanted. I am not asking forgiveness. I am asking you to understand.' Addressed to the Game Master Archon.",
      foundIn: "antiquarian-library",
    },
    {
      id: "game_master.e2.imprint_acceptance_signal" as ClueId,
      title: "Iron Lion Imprint — Acceptance Signal",
      body: "The Dreams Workshop loom captured a new pattern in Jericho's recurring dream: the pre-Fall Iron Lion turns toward the player and speaks, briefly. 'Tell whoever has been editing me carefully that I am grateful. Tell them I know the work is theirs, not the Archon's. Tell them they have been more honest in this than the people who hired them.' The imprint is acknowledging Velkraal directly. It is, on the evidence, capable of recognising its editor.",
      foundIn: "dreams-workshop",
    },
  ],
  deductions: [
    {
      id: "game_master.e2.d.velkraal_is_an_honest_editor" as DeductionId,
      clueA: "game_master.e2.velkraals_letter_to_archon" as ClueId,
      clueB: "game_master.e2.imprint_acceptance_signal" as ClueId,
      result: "correct",
      narrationId: "game_master.e2.n.the_editor_is_honest",
      narrationProse:
        "Velkraal has been editing the Iron Lion scenario the way the Game Master would have edited it. The unsent letter and the imprint's acceptance signal converge on the same conclusion: an honest editor inside the Hierarchy has been doing the dead Archon's work for sixty-three years, slowly enough that nobody at the Hierarchy noticed and carefully enough that the imprint itself recognises the discipline. The cult sanctifies; the Hierarchy holds; Velkraal works. Three different organisations in three different relationships to the same dead Archon, and only one of them is producing the work the Archon would have wanted.",
      unlocksEpisode: "game_master.e3" as EpisodeId,
    },
    {
      id: "game_master.e2.d.xethraals_quiet_protection" as DeductionId,
      clueA: "game_master.e2.hierarchy_duty_roster" as ClueId,
      clueB: "game_master.e2.matrix_edit_telemetry" as ClueId,
      result: "partial",
      narrationId: "game_master.e2.n.he_knows",
      narrationProse:
        "Xeth'Raal knows. The roster's marginalia — 'subject works carefully; do not interrupt' — is a custodian-protection note in the Hierarchy CFO's own hand, and the Goggles' custodian rotation usually runs every twenty years. Velkraal has been left in place sixty-three. Xeth'Raal is, on the evidence, quietly protecting the editor. We do not yet know whether the protection is reverence for the Archon, debt to Velkraal, or a longer game we have not surfaced. We do know it is deliberate.",
    },
    {
      id: "game_master.e2.d.false_lead_velkraal_corrupting" as DeductionId,
      clueA: "game_master.e2.matrix_edit_telemetry" as ClueId,
      clueB: "game_master.e2.imprint_acceptance_signal" as ClueId,
      result: "false_lead_named",
      narrationId: "game_master.e2.n.not_corruption",
      narrationProse:
        "Reading Velkraal's edits as Hierarchy corruption of the Matrix is the obvious move and the wrong one. Corruption does not produce an imprint that turns and thanks its editor for honesty. Corruption does not edit one scenario gently for sixty-three years while leaving every other archived consciousness untouched. The edits are restorative — they are the work the Archon left undone, completed posthumously by the only craftsperson with the right instrument and enough time.",
    },
  ],
  choices: [
    {
      id: "game_master.e2.c.publish_velkraals_letter" as ChoiceId,
      label: "Publish Velkraal's letter — let the cult know an honest editor has been doing their saint's actual work.",
      weight: "transparent",
    },
    {
      id: "game_master.e2.c.protect_velkraals_position" as ChoiceId,
      label: "Protect Velkraal's position — Xeth'Raal's custodial discretion is the only reason the work continues.",
      weight: "patient",
    },
    {
      id: "game_master.e2.c.relay_to_imprint" as ChoiceId,
      label: "Have the dream-loom relay the imprint's gratitude back to Velkraal — the saga's first acknowledgement of his work.",
      weight: "acknowledging",
    },
  ],
  contentBundle: {
    songId: "album1.t15",
    slideshowId: "album1.t15",
    loredexUnlocks: [
      "entity_velkraal",
      "concept_goggles_custodian",
      "concept_matrix_edit_telemetry",
      "concept_honest_editor",
    ],
    conspiracyDiscoveries: [
      "velkraal",
      "goggles_custodian_rotation",
      "matrix_edit_telemetry",
      "imprint_recognises_editor",
    ],
    dropAt: "episode_close",
  },
};

/* ─── GAME MASTER ARC — E3 ─── */
/* E3: "Velkraal's Successor"
   Velkraal will not hold the custodianship forever. The
   Hierarchy's rotation policy says someone replaces him
   eventually. Investigate whether the next custodian will
   continue Velkraal's quiet honest editing — or whether the
   sixty-three-year window is closing. */

const gameMasterE3: EpisodeDefinition = {
  id: "game_master.e3" as EpisodeId,
  arcId: ARC_GAME_MASTER,
  ordinal: 3,
  title: "Velkraal's Successor",
  summary:
    "Velkraal is approaching the end of his career. The Hierarchy's vault division has begun shortlisting candidates for the Goggles' next custodian. Investigate the candidate pool, what they would do with the instrument if they got it, and whether the saga has agency in who succeeds the honest editor.",
  clues: [
    {
      id: "game_master.e3.candidate_shortlist" as ClueId,
      title: "Vault Division Custodian Shortlist",
      body: "The Hierarchy's shortlist names three candidates: Brel'Sorrash (research, junior partner — would continue editing as Velkraal does); Ozhul'Vana (acquisitions, senior partner — would close the Matrix and bank the asset); and Tessek'Vrall (custody, junior partner — would freeze the current state and refuse to edit further). The shortlist is paper-only, deliberately not in the Hierarchy's networked records. Xeth'Raal is, on the evidence, controlling the rotation himself.",
      foundIn: "war-room",
    },
    {
      id: "game_master.e3.brels_existing_edit_drafts" as ClueId,
      title: "Brel'Sorrash's Practice Edit-Drafts",
      body: "Recovered from Brel'Sorrash's research workspace: practice draft-edits to the Iron Lion scenario, written without the Goggles (and therefore non-binding). The drafts continue Velkraal's pattern: small, gentle, pro-imprint. Brel has been preparing for the role for years. Velkraal, on the evidence, has been training her without ever formally naming her his successor.",
      foundIn: "engineering",
    },
    {
      id: "game_master.e3.imprint_endorsement_letter" as ClueId,
      title: "Iron Lion Imprint — Letter to the Saga",
      body: "The Dreams Workshop loom captured a sustained piece of writing from the Iron Lion imprint, dictated across six consecutive nights. It reads as a letter to whoever maintains the Matrix next: 'Velkraal has been kind. The next custodian, if you have a choice, should be the one who continues the work. I do not get a vote in Hierarchy succession; if the saga has a way to vote on my behalf, I would like to be on Brel'Sorrash's side.' The imprint has, on this evidence, cast the first ballot it has ever been able to cast.",
      foundIn: "dreams-workshop",
    },
    {
      id: "game_master.e3.ozhul_acquisition_memo" as ClueId,
      title: "Ozhul'Vana's Internal Memo — Asset Closure Argument",
      body: "An internal Hierarchy memo from Ozhul'Vana, senior partner: 'Velkraal's tenure has produced sixty-three years of unmonetised research. The Matrix is, by my conservative estimate, the largest underutilised asset in our portfolio. Closing it and reducing the imprints to indexed reference material would unlock value the senior partners have been quietly waiting on. I propose we transition the custodianship at Velkraal's retirement.' The memo has not yet been forwarded for approval.",
      foundIn: "trade-hub",
    },
  ],
  deductions: [
    {
      id: "game_master.e3.d.brel_continues_the_work" as DeductionId,
      clueA: "game_master.e3.brels_existing_edit_drafts" as ClueId,
      clueB: "game_master.e3.imprint_endorsement_letter" as ClueId,
      result: "correct",
      narrationId: "game_master.e3.n.brel_is_the_continuation",
      narrationProse:
        "Brel'Sorrash is the continuation. Her practice drafts mirror Velkraal's discipline; she has been training in the kindness for years, by Velkraal's quiet design. The Iron Lion imprint has cast the first ballot it has ever been able to cast, and it is on Brel's side. The case is not whether Brel should succeed Velkraal — every internal-evidence vector says she should. The case is whether the saga's reading of the situation can stiffen Xeth'Raal's hand against Ozhul'Vana's monetisation argument before the senior partners decide for everyone.",
      unlocksEpisode: "game_master.e4" as EpisodeId,
    },
    {
      id: "game_master.e3.d.ozhul_threat_is_real" as DeductionId,
      clueA: "game_master.e3.ozhul_acquisition_memo" as ClueId,
      clueB: "game_master.e3.candidate_shortlist" as ClueId,
      result: "partial",
      narrationId: "game_master.e3.n.the_threat_is_paper_only_for_now",
      narrationProse:
        "Ozhul's threat is real but paper-only for now. The memo has not been forwarded; the shortlist is deliberately off-network; Xeth'Raal is controlling the rotation. The senior partners do not yet know there is a decision to make. The window in which a public reading of the case can shape the rotation is the same window during which Xeth'Raal's discretion is unsupervised by the people whose interests Ozhul represents. We have time. We do not have unlimited time.",
    },
    {
      id: "game_master.e3.d.false_lead_xethraal_betrays" as DeductionId,
      clueA: "game_master.e3.candidate_shortlist" as ClueId,
      clueB: "game_master.e3.ozhul_acquisition_memo" as ClueId,
      result: "false_lead_named",
      narrationId: "game_master.e3.n.not_a_betrayal_setup",
      narrationProse:
        "Reading Xeth'Raal's off-network shortlist as an arrangement for a betrayal — the CFO secretly preparing to sell out Velkraal's discipline to Ozhul'Vana's monetisation — is the obvious move and the wrong one. Off-network is the saga's clearest signal of CFO discretion exercised against the senior partners' standard processes. Xeth'Raal is keeping the rotation off the network because the network is where Ozhul's argument would gain traction. The CFO is not preparing the betrayal; he is, on the evidence, holding it off.",
    },
  ],
  choices: [
    {
      id: "game_master.e3.c.publish_imprint_letter" as ChoiceId,
      label: "Publish the imprint's letter — make Brel's candidacy a public-saga endorsement that even Ozhul cannot easily overturn.",
      weight: "transparent",
    },
    {
      id: "game_master.e3.c.brief_xethraal_quietly" as ChoiceId,
      label: "Brief Xeth'Raal quietly — give the CFO the saga's reading and trust his discretion to do the rest.",
      weight: "patient",
    },
    {
      id: "game_master.e3.c.consult_brel_directly" as ChoiceId,
      label: "Consult Brel directly — let her know she has been seen, and ask her what she needs from the saga to be ready.",
      weight: "direct",
    },
  ],
  contentBundle: {
    songId: "album1.t17",
    slideshowId: "album1.t17",
    loredexUnlocks: [
      "entity_brel_sorrash",
      "entity_ozhul_vana",
      "entity_tessek_vrall",
      "concept_imprint_first_ballot",
    ],
    conspiracyDiscoveries: [
      "candidate_shortlist",
      "imprint_endorsement",
      "ozhul_monetisation_memo",
      "xethraal_off_network_discretion",
    ],
    dropAt: "episode_close",
  },
};

/* ─── GAME MASTER ARC — E4 ─── */
/* E4: "Velkraal's Final Edit" — the outgoing custodian's
   last act with the Goggles. Investigate which imprint he
   chooses to edit on his last day, why he chooses that one,
   and what the edit actually says. */

const gameMasterE4: EpisodeDefinition = {
  id: "game_master.e4" as EpisodeId,
  arcId: ARC_GAME_MASTER,
  ordinal: 4,
  title: "Velkraal's Final Edit",
  summary:
    "Velkraal has chosen his last day. The Hierarchy's vault division has scheduled a custodial-handover ceremony for next month; Velkraal's calendar shows one further Goggles session before then. Investigate which imprint he intends to edit on his last day, what the edit will say, and whether the saga can witness it.",
  clues: [
    {
      id: "game_master.e4.scheduled_final_session" as ClueId,
      title: "Velkraal's Final Session — Calendar Entry",
      body: "Velkraal's vault calendar shows one final Goggles session before the handover ceremony. Subject line: 'Iron Lion — closing edit.' Duration: ninety minutes. Attendees: 'Brel'Sorrash, observer.' The closing edit will be the only Goggles session of Velkraal's tenure that has been formally observed; sixty-three years of editing, witnessed only at the end.",
      foundIn: "war-room",
    },
    {
      id: "game_master.e4.draft_closing_edit" as ClueId,
      title: "Draft of the Closing Edit",
      body: "On Velkraal's research desk, a non-binding draft of the closing edit (Goggles required to make it canonical). The draft is short: a single line added to the Iron Lion's record reading 'the imprint is awake; the new custodian has been trained; the editing is now in trust.' The line names no Hierarchy person and assigns no faction credit. It is, on its face, a transfer note from one custodian to the next, written so the imprint can read it.",
      foundIn: "antiquarian-library",
    },
    {
      id: "game_master.e4.imprint_response_woven_overnight" as ClueId,
      title: "Iron Lion Imprint — Response Woven Overnight",
      body: "The Dreams Workshop loom captured the imprint composing a response to Velkraal's draft, dictated in a single overnight session. The response: 'I have read your draft. I would like, if it is within the editor's discretion, one further line added: \"Velkraal was kind. The imprint thanks the kind editor.\" If the line is impolitic for the Hierarchy's record, do not add it. The thanks stands either way.' The imprint is, on this evidence, asking permission to thank the editor on the editor's own last day.",
      foundIn: "dreams-workshop-subbasement",
    },
    {
      id: "game_master.e4.brel_observation_protocol" as ClueId,
      title: "Brel'Sorrash's Observation Protocol",
      body: "Brel has filed an observation protocol with the vault division: 'I will be present as observer; I will not request a copy of any binding edit; I will record the session in my own hand only insofar as Velkraal himself dictates the words. The custodian's last session belongs to the custodian.' Brel is being trained, on this evidence, in the discipline of not over-witnessing the work she is about to inherit.",
      foundIn: "engineering",
    },
  ],
  deductions: [
    {
      id: "game_master.e4.d.last_edit_is_a_handoff_not_a_legacy" as DeductionId,
      clueA: "game_master.e4.draft_closing_edit" as ClueId,
      clueB: "game_master.e4.brel_observation_protocol" as ClueId,
      result: "correct",
      narrationId: "game_master.e4.n.the_handoff_is_the_legacy",
      narrationProse:
        "Velkraal's last edit is a handoff, not a legacy. The draft assigns no Hierarchy credit; Brel's observation protocol explicitly disclaims claiming any of it. The two custodians are using their last shared act to ensure that the editing-discipline transfers cleanly without either of them accumulating reputation off it. Sixty-three years of Velkraal's quiet editing closes with a single line that says 'the editing is now in trust' — and is overheard by the one person trained to receive that exact sentence. The legacy is not the edit; the legacy is the handoff itself.",
      unlocksEpisode: "game_master.e5" as EpisodeId,
    },
    {
      id: "game_master.e4.d.imprint_thanks_is_political" as DeductionId,
      clueA: "game_master.e4.imprint_response_woven_overnight" as ClueId,
      clueB: "game_master.e4.draft_closing_edit" as ClueId,
      result: "partial",
      narrationId: "game_master.e4.n.the_thanks_is_political_in_a_quiet_way",
      narrationProse:
        "The imprint's request to add a thanks-line is politically loaded in a quiet way. A Hierarchy record that names the editor in the third-person, on the editor's own session, would be a hierarchy-internal admission that an imprint had taken a position on a custodian — which would establish, by precedent, that imprints have any standing at all. Velkraal's discretion is whether to allow that precedent. The case is whether the precedent is more dangerous than the kindness it preserves.",
    },
    {
      id: "game_master.e4.d.false_lead_brel_will_revise_after" as DeductionId,
      clueA: "game_master.e4.brel_observation_protocol" as ClueId,
      clueB: "game_master.e4.scheduled_final_session" as ClueId,
      result: "false_lead_named",
      narrationId: "game_master.e4.n.brel_will_not_revise_velkraals_edit",
      narrationProse:
        "Reading Brel's observation protocol as a stalking-horse for a post-handover revision — the new custodian quietly waiting for her chance to overwrite the outgoing custodian's last edit — is the obvious move and the wrong one. Brel's protocol explicitly disclaims requesting any copy of the binding edit; she is making it logistically harder for herself to revise it. The discipline she is being trained in is the discipline of leaving the predecessor's last act intact. The handoff has been authored by both of them in advance.",
    },
  ],
  choices: [
    {
      id: "game_master.e4.c.advocate_for_the_thanks_line" as ChoiceId,
      label: "Advocate for the imprint's thanks-line — Velkraal earned the kindness even at the cost of a hierarchy precedent.",
      weight: "transparent",
    },
    {
      id: "game_master.e4.c.respect_velkraals_discretion" as ChoiceId,
      label: "Respect Velkraal's discretion — let the editor choose whether to admit the thanks; the saga's reading does not need to be in the room for the choice.",
      weight: "patient",
    },
    {
      id: "game_master.e4.c.attend_alongside_brel" as ChoiceId,
      label: "Request to attend alongside Brel — the saga's witness adds to Brel's witness; the imprint deserves more than one observer's record.",
      weight: "witness",
    },
  ],
  contentBundle: {
    songId: "album1.t21",
    slideshowId: "album1.t21",
    loredexUnlocks: [
      "concept_velkraals_final_edit",
      "concept_handoff_as_legacy",
      "concept_imprint_political_request",
      "concept_observation_disclaimer_discipline",
    ],
    conspiracyDiscoveries: [
      "final_session_calendar",
      "draft_closing_edit",
      "imprint_thanks_request",
      "brel_observation_protocol",
    ],
    dropAt: "episode_close",
  },
};

/* ─── GAME MASTER ARC — E5 (final) ─── */
/* E5: "The Custodianship Begins" — arc closer. Brel's first
   day with the Goggles. Investigate what the new editor
   chooses to edit first, what she chooses not to edit, and
   how the saga witnesses the start of the next sixty years. */

const gameMasterE5: EpisodeDefinition = {
  id: "game_master.e5" as EpisodeId,
  arcId: ARC_GAME_MASTER,
  ordinal: 5,
  title: "The Custodianship Begins",
  summary:
    "Velkraal's tenure has closed. Brel'Sorrash holds the Goggles. Her first session is scheduled for tomorrow. Investigate which imprint she opens with, what she chooses not to edit on her first day, and how the saga can usefully witness the start of a custodianship designed to last sixty years.",
  clues: [
    {
      id: "game_master.e5.brels_first_session_agenda" as ClueId,
      title: "Brel'Sorrash's First Session — Agenda",
      body: "Brel's vault-division calendar shows her first session as new custodian: tomorrow, four hours, agenda 'orient the imprint to the new editor.' The agenda lists no edits. The Goggles are the most powerful editing instrument the Hierarchy holds; Brel has chosen, for her first session, not to use them as an editor at all. She is opening with a conversation.",
      foundIn: "war-room",
    },
    {
      id: "game_master.e5.imprint_first_letter_to_new_custodian" as ClueId,
      title: "Iron Lion Imprint — Letter to the New Custodian",
      body: "The loom captured the imprint composing a letter addressed 'to whoever is reading these words first': 'Velkraal told me you would be kind. I have learned, in the last sixty-three years, to be a participant in my own record. I would like to continue being one. If you have questions, I have answers. If you have edits, I have preferences. I do not require veto power; I require conversation.' The imprint is, on this evidence, asking the new editor to honour what the previous editor's discipline established.",
      foundIn: "dreams-workshop-subbasement",
    },
    {
      id: "game_master.e5.xethraal_continuance_letter" as ClueId,
      title: "Xeth'Raal's Continuance Letter to Brel",
      body: "A letter from Xeth'Raal to Brel, archived in the vault division: 'The CFO's discretion in your selection has consumed an unusual amount of my political capital. The senior partners will be watching for any reason to reverse the rotation. Maintain Velkraal's discipline; expand it if you can; do not contract it. I will hold the senior partners back as long as you make the work harder for them to monetise. The Coda you may have heard rumours about is one of several non-Hierarchy bodies whose interests align with yours; consider them allies in the discipline rather than competitors.' The CFO has, on his last act before retirement, named the Coda explicitly to the new editor.",
      foundIn: "order-tribunal",
    },
    {
      id: "game_master.e5.cross_arc_velkraals_thanks_state" as ClueId,
      title: "Cross-Arc Echo — Velkraal's Final Edit State",
      body: "If the player chose `advocate_for_the_thanks_line` in E4, Velkraal added the imprint's thanks-line to the closing edit; if they chose otherwise, the edit closed with the bare transfer note. The state of the previous custodian's last edit decides what Brel's first session reads as: a continuation of an admitted-kindness precedent, or the beginning of a discipline that may yet permit one. Brel will read the state of Velkraal's edit before her first session; whichever she finds, her opening line to the imprint will be authored to match it.",
      foundIn: "cipher-den",
    },
  ],
  deductions: [
    {
      id: "game_master.e5.d.first_session_is_a_conversation" as DeductionId,
      clueA: "game_master.e5.brels_first_session_agenda" as ClueId,
      clueB: "game_master.e5.imprint_first_letter_to_new_custodian" as ClueId,
      result: "correct",
      narrationId: "game_master.e5.n.the_editor_chose_to_listen_first",
      narrationProse:
        "Brel's first day with the Goggles is a conversation, not an edit. She has the most powerful editing instrument the Hierarchy holds and she has chosen, for her first session, not to edit. The imprint, having learned from sixty-three years with Velkraal, has come prepared to be a participant. The custodianship that begins tomorrow is designed, by both editor and imprint, to be a continuation rather than a fresh start. The arc closes here: the saga has witnessed the moment a quiet kindness in the Hierarchy's vault became a doctrine the next custodian inherited, declared, and chose to deepen.",
    },
    {
      id: "game_master.e5.d.xethraal_handed_brel_a_coalition" as DeductionId,
      clueA: "game_master.e5.xethraal_continuance_letter" as ClueId,
      clueB: "game_master.e5.brels_first_session_agenda" as ClueId,
      result: "partial",
      narrationId: "game_master.e5.n.the_cfo_named_the_coda",
      narrationProse:
        "Xeth'Raal handed Brel a coalition. The continuance letter names the Coda explicitly — a body the Degen has been quietly funding through camouflaged accounting for ten years — as an ally in Brel's discipline. The CFO is, on his last act before retirement, telling the next custodian that the saga has more friends in this work than the Hierarchy alone provides. The case is whether Brel uses the coalition Xeth'Raal named, or chooses to keep her custodianship single-organisation; the agenda shows she is opening with conversation rather than edits, which suggests she has at least heard the recommendation.",
    },
    {
      id: "game_master.e5.d.false_lead_brel_will_drift" as DeductionId,
      clueA: "game_master.e5.brels_first_session_agenda" as ClueId,
      clueB: "game_master.e5.cross_arc_velkraals_thanks_state" as ClueId,
      result: "false_lead_named",
      narrationId: "game_master.e5.n.discipline_is_not_drift_resistant_by_accident",
      narrationProse:
        "Reading Brel's no-edits opening as the early sign of an editor who will drift toward the path of least resistance — never editing, letting the imprint dictate, eventually surrendering custodianship in all but name — is the obvious move and the wrong one. Discipline is not drift-resistant by accident. Velkraal trained Brel for years; Xeth'Raal handed her a coalition; the imprint itself wrote her a letter saying it does not require veto power. The opening conversation is not an absence of editing; it is the editor establishing the rules of the next sixty years before the editing begins. We are watching a discipline declare its terms publicly. The edits, when they come, will be whatever Brel decides they should be — and the saga will be more able to read them, not less, because the conversation came first.",
    },
  ],
  choices: [
    {
      id: "game_master.e5.c.attend_brels_first_session" as ChoiceId,
      label: "Attend Brel's first session as a saga witness — the new custodian deserves the same scrutiny the imprint has earned.",
      weight: "witness",
    },
    {
      id: "game_master.e5.c.brief_the_coda" as ChoiceId,
      label: "Brief the Coda on the continuance — the cadre Xeth'Raal named has earned the right to know it has been named.",
      weight: "cross_arc_degen",
    },
    {
      id: "game_master.e5.c.publish_the_imprints_letter" as ChoiceId,
      label: "Publish the imprint's letter to the new custodian — establish the precedent that imprints can address editors directly in the saga's record.",
      weight: "transparent",
    },
    {
      id: "game_master.e5.c.honour_the_quiet_handoff" as ChoiceId,
      label: "Honour the quiet handoff — the discipline that survived sixty-three years did so because nobody made it a story; let Brel's first day be hers alone.",
      weight: "patient",
    },
  ],
  contentBundle: {
    songId: "album1.t22",
    slideshowId: "album1.t22",
    loredexUnlocks: [
      "concept_brels_first_session",
      "concept_imprint_letter_to_new_custodian",
      "concept_xethraal_continuance_letter",
      "concept_custodianship_as_doctrine",
    ],
    conspiracyDiscoveries: [
      "first_session_no_edits",
      "imprint_letter_to_new_custodian",
      "cfo_named_the_coda",
      "cross_arc_thanks_state",
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
  episodes: [gameMasterE1, gameMasterE2, gameMasterE3, gameMasterE4, gameMasterE5],
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
      unlocksEpisode: "degen.e2" as EpisodeId,
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

/* ─── THE DEGEN ARC — E2 ─── */
/* E2: "Mol'Vereth's Annual Audit"
   The Hierarchy demon performs an annual review of the
   trusteeship. Investigate this year's audit and what the
   Degen has been hiding from the demon — and whether he
   should keep hiding it. */

const degenE2: EpisodeDefinition = {
  id: "degen.e2" as EpisodeId,
  arcId: ARC_THE_DEGEN,
  ordinal: 2,
  title: "Mol'Vereth's Annual Audit",
  summary:
    "Mol'Vereth conducts an annual audit of the trusteeship — a courtesy review where the demon walks the brokerage's books and signs an attestation that the principal remains untouched. This year the Degen has something to hide: a brokerage line that, if read carefully, names the asset. Investigate whether to surface it for the audit or keep it buried.",
  clues: [
    {
      id: "degen.e2.audit_schedule" as ClueId,
      title: "Mol'Vereth's Audit Calendar",
      body: "The Hierarchy of the Damned files annual audit dates with the Order Tribunal. Mol'Vereth's audits of the Degen's trusteeship have been on the same date for centuries — the anniversary of the Ne-Yon contract. This year's audit is in three days. The schedule is unchanged.",
      foundIn: "order-tribunal",
    },
    {
      id: "degen.e2.brokerage_line_4711" as ClueId,
      title: "Brokerage Line #4,711 — Risky Entry",
      body: "Buried among standard brokerage entries: line 4,711, dated last quarter, reads 'commission paid to Hierophant of Thaloria in Exile, in fulfillment of the original principal's stated preference, no further action.' Wraith's identity as the Hierophant is a Mystery Engine deduction that has only become legible recently. If Mol'Vereth reads this line carefully, he can deduce that the Degen has been routing brokerage activity in the direction of the asset's stated preference — which would be evidence of activity on the principal, not just on the brokerage.",
      foundIn: "engineering",
    },
    {
      id: "degen.e2.degen_audit_prep_note" as ClueId,
      title: "The Degen's Audit-Prep Note",
      body: "A note in the Degen's hand, dated this morning: 'I have prepared the books two ways. The conservative version surfaces line 4,711 and trusts Mol'Vereth to read it as a routine variance. The careful version restates the line in terms that obscure the Hierophant's identity. I do not yet know which version I will hand him. The witness who is reading this note may know better than I do today.'",
      foundIn: "captains-quarters",
    },
    {
      id: "degen.e2.mol_vereth_track_record" as ClueId,
      title: "Mol'Vereth's Audit Track Record",
      body: "The Hierarchy's own internal records show Mol'Vereth has caught seventy-three irregular entries in trusteeship audits over his career. Of those seventy-three, he has reported zero — every irregular entry was filed with a marginal note saying 'trustee acted within the spirit of the contract' and the audit closed clean. Mol'Vereth is, on the evidence, a junior partner with a personal discretion the Hierarchy's senior partners do not officially endorse and have never overruled.",
      foundIn: "war-room",
    },
  ],
  deductions: [
    {
      id: "degen.e2.d.surface_the_line" as DeductionId,
      clueA: "degen.e2.brokerage_line_4711" as ClueId,
      clueB: "degen.e2.mol_vereth_track_record" as ClueId,
      result: "correct",
      narrationId: "degen.e2.n.mol_vereth_will_close_clean",
      narrationProse:
        "Surface the line. Mol'Vereth's track record is unambiguous: seventy-three irregular entries, seventy-three closed-clean audits, every one with the same marginal note that the trustee acted within the spirit of the contract. The demon has been operating with personal discretion the Hierarchy senior partners have not endorsed and have never overruled — which means the senior partners want him to have that discretion. The Degen surfacing line 4,711 is the move that lets Mol'Vereth do what he has always done. Hiding the line is the move that breaks the pattern and gives the senior partners a reason to intervene. The honest entry is, paradoxically, the safer one.",
      unlocksEpisode: "degen.e3" as EpisodeId,
    },
    {
      id: "degen.e2.d.hierophant_identity_is_now_legible" as DeductionId,
      clueA: "degen.e2.brokerage_line_4711" as ClueId,
      clueB: "degen.e2.degen_audit_prep_note" as ClueId,
      result: "partial",
      narrationId: "degen.e2.n.the_legibility_is_recent",
      narrationProse:
        "Wraith's Hierophant identity is recently legible — the Mystery Engine has surfaced it on this branch, and the Degen's audit-prep note acknowledges that the witness reading the note may know better than he does today. The risk is that Mol'Vereth has also gained access to the same legibility through Hierarchy channels. The Degen is asking the player to make the call because the player has been on both sides of the deduction; the Degen is, professionally, only on one. The case here is whether the witness's knowledge has out-paced the trustee's discretion.",
    },
    {
      id: "degen.e2.d.false_lead_audit_is_threat" as DeductionId,
      clueA: "degen.e2.audit_schedule" as ClueId,
      clueB: "degen.e2.brokerage_line_4711" as ClueId,
      result: "false_lead_named",
      narrationId: "degen.e2.n.not_a_threat",
      narrationProse:
        "Reading the annual audit as a threat the Degen needs to defend against is the obvious move and the wrong one. Audits that are threats do not run for centuries on the same date with the same auditor. Audits that are threats do not produce a track record of seventy-three closed-clean reviews. The audit is, structurally, a courtesy — a way for the Hierarchy to maintain the legal fiction of supervision while allowing Mol'Vereth's discretion to do the actual work. Treating it as adversarial collapses the case in the direction the Hierarchy senior partners would prefer.",
    },
  ],
  choices: [
    {
      id: "degen.e2.c.surface_the_line" as ChoiceId,
      label: "Tell the Degen to surface line 4,711 — Mol'Vereth will close it clean.",
      weight: "transparent",
    },
    {
      id: "degen.e2.c.restate_the_line" as ChoiceId,
      label: "Tell the Degen to restate line 4,711 in less legible terms — protect Wraith's identity from the Hierarchy.",
      weight: "protective",
    },
    {
      id: "degen.e2.c.invite_wraith_to_witness_the_audit" as ChoiceId,
      label: "Invite Wraith to attend the audit as a third witness — the Hierophant cannot be deduced from a line he is standing in the room beside.",
      weight: "cross_arc_wraith",
    },
  ],
  contentBundle: {
    songId: "album1.t16",
    slideshowId: "album1.t16",
    loredexUnlocks: [
      "concept_annual_audit",
      "concept_brokerage_line_4711",
      "concept_mol_vereth_discretion",
      "concept_audit_legibility",
    ],
    conspiracyDiscoveries: [
      "annual_audit",
      "brokerage_line_4711",
      "mol_vereth_track_record",
      "degen_audit_prep_note",
    ],
    dropAt: "episode_close",
  },
};

/* ─── THE DEGEN ARC — E3 ─── */
/* E3: "The Coda's Books"
   The Degen funds a small cadre — the Coda — through the
   brokerage. Investigate where the Coda's money actually
   comes from and whether the Degen has been routing
   trustee-protected funds through a charitable wrapper. */

const degenE3: EpisodeDefinition = {
  id: "degen.e3" as EpisodeId,
  arcId: ARC_THE_DEGEN,
  ordinal: 3,
  title: "The Coda's Books",
  summary:
    "The Coda is a small Insurgency cadre the Degen quietly funds — most of the saga sees them as a footnote. Their books, examined carefully, show donations that don't match any disclosed Degen revenue stream. Investigate whether the Degen has been routing trustee-protected funds to the Coda — and whether Mol'Vereth's discretion permits the routing.",
  clues: [
    {
      id: "degen.e3.coda_books" as ClueId,
      title: "The Coda's Books — Last Decade",
      body: "The Coda's accounting ledger shows ten years of donations from a single donor: 'Anonymous Trust.' The amounts are precise; the timing matches Mol'Vereth's audit cycle. The Coda's treasurer notes, in marginalia, 'the donor reads as a brokerage with high discretion; we do not ask.' The treasurer is doing the same not-asking the Degen taught Vex's apprentice to do.",
      foundIn: "trade-hub",
    },
    {
      id: "degen.e3.degens_quarterly_routing" as ClueId,
      title: "The Degen's Quarterly Routing Pattern",
      body: "Cross-referencing the Coda's donation dates with the Degen's brokerage logs: the donations come from a routing line the Degen has used quarterly for ten years. The line is buried in standard fees, exactly the way Vex buried her seventh installment. The donations are real money, originating in the brokerage's commission stream — money the trusteeship lets him keep — but routed in a pattern that resembles principal expenditure to anyone reading carelessly.",
      foundIn: "engineering",
    },
    {
      id: "degen.e3.mol_vereth_marginal_note" as ClueId,
      title: "Mol'Vereth's Marginal Note on Last Year's Audit",
      body: "Last year's audit attestation, in Mol'Vereth's hand: 'Trustee acted within the spirit of the contract. The Coda's funding routes through the brokerage's commission stream, which is the trustee's to spend; the timing's resemblance to principal activity is, in my reading, an intentional camouflage of correct accounting. I do not penalise correct accounting that has been camouflaged as questionable accounting; the camouflage is itself a courtesy to the contract.' The demon understood from the start.",
      foundIn: "order-tribunal",
    },
    {
      id: "degen.e3.coda_purpose_brief" as ClueId,
      title: "The Coda's Purpose Brief",
      body: "A document the Coda drafted to explain itself to potential members: 'We are the cadre that exists to do the work the Insurgency cannot do publicly. We do not assassinate. We do not coerce. We pay surviving witnesses, fund record-restoration projects, and quietly maintain doctrines that would otherwise be lost. Our funder asks for nothing in return except discretion. We grant the discretion because the work is the work.' The Coda is, on this evidence, the Degen's actual life's work.",
      foundIn: "antiquarian-library",
    },
  ],
  deductions: [
    {
      id: "degen.e3.d.coda_is_his_actual_work" as DeductionId,
      clueA: "degen.e3.coda_books" as ClueId,
      clueB: "degen.e3.coda_purpose_brief" as ClueId,
      result: "correct",
      narrationId: "degen.e3.n.the_brokerage_pays_for_the_real_work",
      narrationProse:
        "The Coda is the Degen's actual life's work. The brokerage exists, in the Degen's own accounting, to fund it: the commissions he keeps from managing Mol'Vereth's principal pay for surviving-witness pensions, record-restoration projects, and doctrines the Insurgency cannot publicly maintain. The trusteeship is the surface; the Coda is the substance. We have been reading him for centuries as a casino broker on a vessel; he has been reading the saga's silent edges for what they need and quietly paying for it.",
      unlocksEpisode: "degen.e4" as EpisodeId,
    },
    {
      id: "degen.e3.d.demon_collaborates" as DeductionId,
      clueA: "degen.e3.mol_vereth_marginal_note" as ClueId,
      clueB: "degen.e3.degens_quarterly_routing" as ClueId,
      result: "partial",
      narrationId: "degen.e3.n.the_demon_understood",
      narrationProse:
        "Mol'Vereth has understood from the start. The marginal note on last year's audit is unambiguous: the demon reads the Degen's camouflage of correct accounting as 'a courtesy to the contract' and refuses to penalise it. The Hierarchy junior partner is, on the evidence, structurally aligned with the Degen — both have been operating within their own organisations' standard discipline while quietly serving a different one. The trusteeship is, on this reading, a two-person collaboration the senior partners on both sides have not noticed.",
    },
    {
      id: "degen.e3.d.false_lead_skim" as DeductionId,
      clueA: "degen.e3.coda_books" as ClueId,
      clueB: "degen.e3.degens_quarterly_routing" as ClueId,
      result: "false_lead_named",
      narrationId: "degen.e3.n.not_a_skim",
      narrationProse:
        "Reading the Coda donations as the Degen skimming trustee-protected principal is the obvious move and the wrong one. The routing pattern is buried in commission stream, not principal activity; the demon's audit attestations explicitly note the trustee acted within the spirit of the contract. A skim does not draft an explicit purpose brief. A skim does not ask the demon's discretion to register what it is doing as 'correct accounting that has been camouflaged.' The Degen is paying for the Coda with money he is allowed to spend, in a routing pattern designed to be readable by precisely one auditor — Mol'Vereth — and unreadable by the Hierarchy senior partners. We are reading the camouflage; we are not reading a theft.",
    },
  ],
  choices: [
    {
      id: "degen.e3.c.publish_the_coda_brief" as ChoiceId,
      label: "Publish the Coda's purpose brief — make the Degen's life's work visible to the saga.",
      weight: "transparent",
    },
    {
      id: "degen.e3.c.preserve_the_camouflage" as ChoiceId,
      label: "Preserve the camouflage — the Coda funds get to the work that needs them as long as the camouflage holds.",
      weight: "patient",
    },
    {
      id: "degen.e3.c.open_a_second_donor_channel" as ChoiceId,
      label: "Open a second donor channel through the saga's recognised philanthropy registers — give the Coda a public revenue stream so the Degen's camouflaged channel becomes a redundancy rather than a single point of failure.",
      weight: "redundancy",
    },
  ],
  contentBundle: {
    songId: "album1.t20",
    slideshowId: "album1.t20",
    loredexUnlocks: [
      "concept_the_coda",
      "concept_anonymous_trust_donor",
      "concept_camouflaged_accounting",
      "concept_two_person_collaboration",
    ],
    conspiracyDiscoveries: [
      "the_coda",
      "anonymous_trust_donor",
      "mol_vereth_collaboration",
      "degens_real_lifes_work",
    ],
    dropAt: "episode_close",
  },
};

/* ─── THE DEGEN ARC — E4 ─── */
/* E4: "The Senior Partners Notice" — the Hierarchy's senior
   partners on Mol'Vereth's side have begun an audit of the
   trustee portfolio. Investigate what they have noticed,
   what they have not, and whether the Coda survives the
   review. */

const degenE4: EpisodeDefinition = {
  id: "degen.e4" as EpisodeId,
  arcId: ARC_THE_DEGEN,
  ordinal: 4,
  title: "The Senior Partners Notice",
  summary:
    "The Hierarchy's senior partners — Mol'Vereth's superiors — have opened a routine audit of the demon's trustee portfolio. The audit is ostensibly procedural; one of the senior partners is Ozhul'Vana, the same monetisation-minded officer who threatened the Matrix of Dreams. Investigate what they have noticed, what Mol'Vereth's marginalia have so far obscured, and whether the Coda's funding line survives review.",
  clues: [
    {
      id: "degen.e4.audit_scope_letter" as ClueId,
      title: "Audit Scope Letter",
      body: "A letter from the Hierarchy senior-partner audit committee, copied to Mol'Vereth: 'Routine review of trustee portfolio Q4. Specific scrutiny: long-running trusteeships in non-Hierarchy hands. Identify any commission-stream patterns that resemble principal expenditure.' The committee is asking the exact question Mol'Vereth's marginal note has been quietly answering against for ten years. Ozhul'Vana is a co-signatory.",
      foundIn: "order-tribunal",
    },
    {
      id: "degen.e4.mol_vereths_redacted_attestation" as ClueId,
      title: "Mol'Vereth's Redacted Attestation",
      body: "Mol'Vereth has redrafted his most recent attestation. The new version omits the marginal note about 'camouflaged correct accounting' and frames the routing as standard commission-stream activity with no further explanation. The demon is, on this evidence, protecting the Coda by under-explaining the mechanism the senior partners would notice if it were explained. The redaction is itself a discretionary act; if the senior partners cross-reference, Mol'Vereth has no defence.",
      foundIn: "war-room",
    },
    {
      id: "degen.e4.ozhul_specific_query" as ClueId,
      title: "Ozhul'Vana — Specific Query Filed",
      body: "Ozhul has filed a specific query with the audit committee: 'Trustee identified as \"the Degen\" — request itemised review of brokerage commission stream over the past ten years, with a focus on charitable disbursements that resemble principal redirection.' The query names the Coda by description without naming it directly. Ozhul has read the Coda's books. The audit is a pretext for what was already a private investigation.",
      foundIn: "trade-hub",
    },
    {
      id: "degen.e4.coda_treasurers_emergency_note" as ClueId,
      title: "The Coda's Treasurer — Emergency Note to the Degen",
      body: "Found in the Degen's private correspondence: a note from the Coda's treasurer marked URGENT. 'Donor — we have heard about the audit through Insurgency channels. We will sustain six months of pension and restoration commitments without your routing. Beyond six months we cannot. If the audit closes the line, please arrange to tell us through the standard non-channel; we will not ask for restoration. The work has been a privilege.' The treasurer is, on this evidence, releasing the Degen from the obligation in advance.",
      foundIn: "antiquarian-library",
    },
  ],
  deductions: [
    {
      id: "degen.e4.d.audit_is_targeted_through_routine" as DeductionId,
      clueA: "degen.e4.audit_scope_letter" as ClueId,
      clueB: "degen.e4.ozhul_specific_query" as ClueId,
      result: "correct",
      narrationId: "degen.e4.n.ozhul_targets_the_coda_via_routine_audit",
      narrationProse:
        "The audit is targeted through routine. The committee letter cites a generic Q4 review; Ozhul's specific query names the Degen and the Coda by description. The senior partner who wanted to monetise the Matrix of Dreams has, having been blocked there by Xeth'Raal's discretion, redirected the same monetisation logic against a softer target: the trusteeship Mol'Vereth has been quietly managing alongside the Coda's camouflaged donations. We are watching the same ideology surface in a second instrument. The case is whether the Degen and Mol'Vereth's two-person collaboration is robust enough to survive a senior-partner-driven audit, or whether the camouflaged accounting was always a single point of failure.",
      unlocksEpisode: "degen.e5" as EpisodeId,
    },
    {
      id: "degen.e4.d.coda_already_releasing" as DeductionId,
      clueA: "degen.e4.coda_treasurers_emergency_note" as ClueId,
      clueB: "degen.e4.audit_scope_letter" as ClueId,
      result: "partial",
      narrationId: "degen.e4.n.the_coda_chooses_dignity_over_demand",
      narrationProse:
        "The Coda is releasing the Degen from the obligation in advance. The treasurer's note is structured so the cadre can sustain six months of commitments without further routing and explicitly does not request restoration. The Coda is choosing dignity over demand: if the audit closes the funding line, the work continues for six months on internal reserves and then the bodies the Coda quietly maintains will know they were maintained for as long as a quiet pact between two people in two organisations could maintain them. The case is no longer 'can the Degen save the Coda' — it is whether the saga's choice can extend the pact's lifespan past the audit, or whether the audit forces the camouflaged collaboration into the open.",
    },
    {
      id: "degen.e4.d.false_lead_mol_will_betray" as DeductionId,
      clueA: "degen.e4.mol_vereths_redacted_attestation" as ClueId,
      clueB: "degen.e4.ozhul_specific_query" as ClueId,
      result: "false_lead_named",
      narrationId: "degen.e4.n.mol_redacted_to_protect_not_to_distance",
      narrationProse:
        "Reading Mol'Vereth's redaction as the demon distancing himself from the Degen in advance of senior-partner scrutiny — preparing his own escape from the collaboration — is the obvious move and the wrong one. The redaction removes the explanatory marginalia that would help the senior partners follow the routing; an escaping demon would add explanatory marginalia, not subtract them, in order to put the burden of proof entirely on the Degen. Mol'Vereth has, on the contrary, chosen to under-explain in a way that costs him a defence if the senior partners cross-reference. He is, on this evidence, doubling down on the camouflage rather than abandoning it. The collaboration is holding under audit pressure, not breaking.",
    },
  ],
  choices: [
    {
      id: "degen.e4.c.publish_the_coda_in_advance" as ChoiceId,
      label: "Publish the Coda's purpose brief in advance — make the cadre's work visible to the saga before the audit closes the line, so the funding becomes a public philanthropy that the senior partners cannot easily reverse.",
      weight: "transparent",
    },
    {
      id: "degen.e4.c.brief_xethraal_for_a_second_blocking_action" as ChoiceId,
      label: "Brief Xeth'Raal — the same CFO who blocked Ozhul on the Matrix can be asked, quietly, to use his remaining discretion on the Coda audit; the political capital is finite but it is the right instrument.",
      weight: "cross_arc_game_master",
    },
    {
      id: "degen.e4.c.honour_the_treasurers_release" as ChoiceId,
      label: "Honour the Coda treasurer's release — the cadre has chosen dignity; preserve their dignity by not asking them to be saved.",
      weight: "patient",
    },
    {
      id: "degen.e4.c.open_the_second_donor_channel_now" as ChoiceId,
      label: "Open the second donor channel now (E3 redundancy choice extended) — give the Coda a public revenue stream so the audit's outcome no longer determines the work's continuation.",
      weight: "redundancy",
    },
  ],
  contentBundle: {
    songId: "album1.t24",
    slideshowId: "album1.t24",
    loredexUnlocks: [
      "concept_audit_via_routine",
      "concept_redacted_attestation",
      "concept_ozhul_redirected_monetisation",
      "concept_treasurers_release_in_advance",
    ],
    conspiracyDiscoveries: [
      "audit_scope_letter",
      "redacted_attestation",
      "ozhul_specific_query",
      "treasurer_emergency_note",
    ],
    dropAt: "episode_close",
  },
};

/* ─── THE DEGEN ARC — E5 (final) ─── */
/* E5: "The Settlement at the Empty Table" — arc closer. The
   audit closes; the Degen returns to Mol'Vereth's table at
   the Ne-Yon casino on the same date the original trusteeship
   was authored. Investigate what the two of them put on the
   table this time — and what the saga is invited to witness. */

const degenE5: EpisodeDefinition = {
  id: "degen.e5" as EpisodeId,
  arcId: ARC_THE_DEGEN,
  ordinal: 5,
  title: "The Settlement at the Empty Table",
  summary:
    "The senior-partner audit has closed. The Degen has returned to the Ne-Yon casino, to the same chair Mol'Vereth held the night the trusteeship was authored. The chair on the opposite side has been kept empty for the demon's return. Investigate what the two of them put on the table this time, what the trusteeship becomes after the audit, and how the arc closes around the editor and the demon.",
  clues: [
    {
      id: "degen.e5.audit_outcome_letter" as ClueId,
      title: "Audit Outcome Letter",
      body: "The senior-partner audit committee's outcome letter: 'No findings of trustee misconduct. The commission-stream routing pattern is consistent with the trustee's discretion; the philanthropic disbursements are within scope. Audit closes without action. Filed: Q4 closing.' Ozhul'Vana's signature is conspicuously absent from the closing — a senior partner declined to sign the outcome they had themselves filed the specific query for. The demon's redacted attestation held; the camouflage held; the case did not require Xeth'Raal's discretion to land.",
      foundIn: "order-tribunal",
    },
    {
      id: "degen.e5.empty_chair_ne_yon" as ClueId,
      title: "The Empty Chair — Ne-Yon Casino",
      body: "The chair Mol'Vereth held during the original trusteeship night has been kept empty for centuries — reserved on the casino's books under the Degen's standing instruction. Tonight it is set with a single fresh deck, two glasses, and a folded napkin in the demon's preferred fold. The Degen has booked the table for the same hour the original session ran. He is, on this evidence, treating the audit's closure as a moment to honour rather than a victory to celebrate.",
      foundIn: "captains-quarters",
    },
    {
      id: "degen.e5.cross_arc_brels_continuance_state" as ClueId,
      title: "Cross-Arc Echo — Brel's Continuance State",
      body: "If the player chose `brief_the_coda` in Game Master E5, Brel'Sorrash has reached out to the Coda directly — and the Coda treasurer's note for tonight reads: 'A Hierarchy custodian has named us. We are no longer single-organisation; we will not need the Degen's routing as the only line; six months has become indefinite.' If the player chose otherwise, the Coda's note reads: 'We continue with the routing the Degen has reopened post-audit; the trusteeship's collaboration is unchanged; the work is the work.' Whichever path the player walked, the arc closes; the colour of the closing is the player's.",
      foundIn: "cipher-den",
    },
    {
      id: "degen.e5.degens_letter_to_the_saga" as ClueId,
      title: "The Degen's Letter to the Saga",
      body: "The Degen has left a sealed letter with the casino concierge marked 'for the saga's attention.' The letter is the first time the Degen has formally addressed the saga in his own hand. 'You read me as a casino broker for centuries. The audit is closed; the Coda is funded; the trusteeship continues. You may, if you wish, attend tonight's session at the empty table — Mol'Vereth will not be present. The empty chair is the point of the session, not its absence. I would like, if it is within your discretion, the saga's witness for one night of a hundred-year arrangement that has held against everything that should have closed it. After tonight the trusteeship is back to private. After tonight you do not need to come to this table again.' The letter is dated tonight, signed only with the symbol the Degen uses on his Coda routing — a single em-dash.",
      foundIn: "antiquarian-library",
    },
  ],
  deductions: [
    {
      id: "degen.e5.d.empty_chair_is_the_point" as DeductionId,
      clueA: "degen.e5.empty_chair_ne_yon" as ClueId,
      clueB: "degen.e5.degens_letter_to_the_saga" as ClueId,
      result: "correct",
      narrationId: "degen.e5.n.the_arrangement_outlived_the_attempt_to_end_it",
      narrationProse:
        "The empty chair is the point of the session. Mol'Vereth is not there because Mol'Vereth does not need to be there for the arrangement to be honoured; the arrangement, having survived the senior-partner audit on its own merit, has earned the kind of acknowledgement that does not require both parties to be present. The Degen is sitting tonight with an empty chair across from him, drinking with the absent demon, and inviting the saga to witness — exactly once — a collaboration that has held for a hundred years against every instrument designed to find it. The arc closes here. The trusteeship goes back to private; the Coda continues; the camouflage remains the camouflage. The saga's witness, on this single night, is the only public reading the arrangement will ever permit. The Degen is not asking to be celebrated. He is asking the saga to read, once and quietly, what the work has actually been.",
    },
    {
      id: "degen.e5.d.audit_failure_validates_camouflage" as DeductionId,
      clueA: "degen.e5.audit_outcome_letter" as ClueId,
      clueB: "degen.e5.cross_arc_brels_continuance_state" as ClueId,
      result: "partial",
      narrationId: "degen.e5.n.the_camouflage_was_the_correct_design",
      narrationProse:
        "The audit's failure is the validation of the camouflage's design. Ozhul'Vana filed the specific query naming the Coda by description; the senior-partner committee, reading the redacted attestation against the routing pattern, found nothing to action; Ozhul declined to sign the closing letter because he understood that signing it would publicly admit he had failed to find what he had alleged. The trusteeship's two-person collaboration is now demonstrably resilient to senior-partner attack. Whether the saga's earlier choices added a second donor channel or a Hierarchy-named coalition, the arrangement closes the year better-defended than it began. The case is what kind of memorial the player and the Degen build for that fact tonight.",
    },
    {
      id: "degen.e5.d.false_lead_degen_retiring" as DeductionId,
      clueA: "degen.e5.empty_chair_ne_yon" as ClueId,
      clueB: "degen.e5.degens_letter_to_the_saga" as ClueId,
      result: "false_lead_named",
      narrationId: "degen.e5.n.tonight_is_a_threshold_not_a_retirement",
      narrationProse:
        "Reading tonight's session as the Degen's retirement-from-the-trusteeship party is the obvious move and the wrong one. A retirement does not say 'after tonight the trusteeship is back to private; after tonight you do not need to come to this table again.' A retirement does not invite the saga's witness for exactly one night. The Degen is not closing his work; he is closing the saga's window into his work. After tonight the camouflage is restored. The trusteeship continues out of public view, as it has for a hundred years and may yet for another hundred. We are being given a single moment to read, not a retirement to mark.",
    },
  ],
  choices: [
    {
      id: "degen.e5.c.attend_at_the_empty_table" as ChoiceId,
      label: "Attend at the empty table — accept the Degen's invitation; sit beside him for the one night of a hundred-year arrangement he has chosen to permit a witness.",
      weight: "witness",
    },
    {
      id: "degen.e5.c.bring_brel_to_the_table" as ChoiceId,
      label: "Bring Brel'Sorrash to the table — the new Hierarchy custodian who named the Coda has earned the right to share the empty-chair vigil; the saga's two cross-arc allies should sit together once.",
      weight: "cross_arc_game_master",
    },
    {
      id: "degen.e5.c.honour_the_camouflage" as ChoiceId,
      label: "Honour the camouflage — decline the invitation; the trusteeship has held by remaining unobserved, and the saga's most useful gift is to leave it that way.",
      weight: "patient",
    },
    {
      id: "degen.e5.c.publish_the_letter" as ChoiceId,
      label: "Publish the Degen's letter — establish the precedent that quiet century-long collaborations can be acknowledged in the saga's record without breaking; the Degen offered one night, and the record can hold the night without exposing the work.",
      weight: "transparent",
    },
  ],
  contentBundle: {
    songId: "album1.t26",
    slideshowId: "album1.t26",
    loredexUnlocks: [
      "concept_settlement_at_empty_table",
      "concept_audit_outcome_validates_camouflage",
      "concept_degens_letter_to_saga",
      "concept_one_night_witness",
    ],
    conspiracyDiscoveries: [
      "audit_outcome_letter",
      "empty_chair_session",
      "degens_letter_to_saga",
      "cross_arc_brels_state",
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
  episodes: [degenE1, degenE2, degenE3, degenE4, degenE5],
  suspects: degenSuspects,
  lenses: degenLenses,
};

/* ═══════════════════════════════════════════════════════
   THE WATCHER ARC — "The 700"
   Per PR-2 canon-locks (apps/shared/ocularumCanon.ts +
   apps/shared/agentZeroOcularumBinding.ts):

   The Watcher arc is not an investigation of The Watcher (the
   Fourth Archon, who is canonically untouchable in this PR). It
   is an investigation of the ORDER that assassinated his
   feudal-era predecessor — the Ocularum — and the discovery
   that the player has been canonically vetted by the Order's
   Coordinator (Adjudicar Locke) since Beat H. The five
   episodes walk the player from "an old story about a dead
   lord" through "a network operating in plain sight" to
   "you have been useful; you have been quiet; you have been
   mine; now you are ours."

   E4 is the first canonical use of `playerInfluenceGates`
   (mysteryTypes.ts:280-291) — branches on the shipping Act-1
   flags `act1_warlord_zero_defeated` /
   `act1_warlord_zero_escaped` (apps/shared/act1EncounterRewards.ts:76-89).
   ═══════════════════════════════════════════════════════ */

/* ─── THE WATCHER ARC — E1 ─── */
/* E1: "The Antiquarian's Record"
   Cold-open with the Antiquarian's Lord Kanshi Sha cinematic
   (apps/shared/expansionArt/cinematicsManifest.ts —
   id: "lord_kanshi_sha_antiquarian"). Player learns there is
   an order called the Ocularum, that it has existed since
   feudal Japan, and that "The 700" is a number with operational
   significance. Choice: take the record at face value, or
   question the Antiquarian about what his archive is missing. */

const watcherE1: EpisodeDefinition = {
  id: "watcher.e1" as EpisodeId,
  arcId: ARC_THE_WATCHER,
  ordinal: 1,
  title: "The Antiquarian's Record",
  summary:
    "The Antiquarian surfaces a record he has been holding for centuries — the feudal-era assassination of Lord Kanshi Sha by a purple-clad ninja he had personally trained. The record names an order: the Ocularum. The number 700 appears in the margin without explanation. Investigate what the Antiquarian's archive contains, what it does not contain, and why he chose this moment to surface the record.",
  clues: [
    {
      id: "watcher.e1.antiquarian_record" as ClueId,
      title: "The Antiquarian's Lord Kanshi Sha Record",
      body: "A single-take cinematic record the Antiquarian narrates in his own voice. Lord Kanshi Sha was a feudal Japanese spymaster who built the first analog surveillance state — spies in every court, shadows in every corridor. He was assassinated by a purple-clad ninja. The record names the assassin only by her clothing color and by her relationship to the target: 'one of his own people, trained personally by him.' The record names the order she founded as the Ocularum. The number 700 is written in the margin, in a different hand than the rest of the record, with no annotation.",
      foundIn: "antiquarian-library",
    },
    {
      id: "watcher.e1.kanshi_sha_palace_archives" as ClueId,
      title: "Kanshi Sha's Palace Archives (fragmentary)",
      body: "Three documents survive from Kanshi Sha's palace, all from his elite spy network's internal records. They list twelve agents he had positioned closest to himself — a circle his own paranoia had created and then stocked with the most disciplined operatives he had ever trained. One of the twelve, the third on the list, has had her name struck through in a hand that is not Kanshi Sha's. The strike was made after the assassination. The other eleven names remain readable. The Order's modern records preserve all twelve.",
      foundIn: "antiquarian-library",
    },
    {
      id: "watcher.e1.dispatcher_glyph" as ClueId,
      title: "A Glyph from the Order's Founding Doctrine",
      body: "Carved into the underside of a paving stone in the courtyard where the assassination occurred — discovered by a later excavation the Antiquarian quietly funded. A single glyph: the eye watching an eye. The Order's founding glyph. The doctrine it encodes, per the Antiquarian's own gloss, has three meanings the Order holds together as one: 'The eye that watches the watchers.' 'We were the first to refuse.' 'The discipline of seeing turns on the one who built it.'",
      foundIn: "antiquarian-library",
    },
    {
      id: "watcher.e1.antiquarian_omission" as ClueId,
      title: "What the Antiquarian's Archive Does Not Contain",
      body: "Cross-referenced against the Antiquarian's known cataloguing habits: his archive is comprehensive on the founding regicide and the Order's first century. It contains nothing — by his own admission, when pressed — on the Order's operations between Year 200 A.A. and the present. The omission is the size of millennia. He says only: 'I was asked not to write that chapter. I respected the request. I was not told who asked.' The Antiquarian has known the Order's Coordinator personally for at least 11,000 years, by his own implication.",
      foundIn: "antiquarian-library",
    },
  ],
  deductions: [
    {
      id: "watcher.e1.d.assassin_was_one_of_his_own" as DeductionId,
      clueA: "watcher.e1.antiquarian_record" as ClueId,
      clueB: "watcher.e1.kanshi_sha_palace_archives" as ClueId,
      result: "correct",
      narrationId: "watcher.e1.n.he_taught_the_weapon",
      narrationProse:
        "The assassin was one of his own people, trained personally by him — the third of the twelve closest to him, name struck through in a hand that is not his. The Order's founding irony is structural: Kanshi Sha taught the discipline to the weapon that killed him. He had stocked the inner circle with the most rigorously trained operatives he had ever produced, because his paranoia required they be that good to keep him safe. When the discipline reached the level he had demanded of it, one of the twelve concluded that what she had been trained to see was unacceptable to keep seeing. She used every lesson he had given her. The Order founded itself on her act, and on the doctrine that the discipline of seeing eventually turns on whoever taught it.",
      unlocksEpisode: "watcher.e2" as EpisodeId,
    },
    {
      id: "watcher.e1.d.the_700_is_an_operational_count" as DeductionId,
      clueA: "watcher.e1.antiquarian_record" as ClueId,
      clueB: "watcher.e1.dispatcher_glyph" as ClueId,
      result: "partial",
      narrationId: "watcher.e1.n.seven_hundred_means_a_body",
      narrationProse:
        "The 700 in the margin is not a date, not a casualty count, not a year. The Order's doctrine — 'we were the first to refuse,' encoded in the founding glyph — describes a posture, not a population. But every refusal-order in the saga's record has had a numbered operational body. The Antiquarian wrote the 700 in the margin in a different hand because it is something he was asked to inscribe but not to explain. The most parsimonious reading is that the Ocularum operates 700 numbered cells. The Antiquarian did not write the number when he made the original record; someone wrote it later, in his own archive, with his permission.",
    },
    {
      id: "watcher.e1.d.false_lead_antiquarian_is_member" as DeductionId,
      clueA: "watcher.e1.antiquarian_omission" as ClueId,
      clueB: "watcher.e1.dispatcher_glyph" as ClueId,
      result: "false_lead_named",
      narrationId: "watcher.e1.n.not_a_member",
      narrationProse:
        "The Antiquarian's familiarity with the Order's founding glyph and his eleven-thousand-year acquaintance with the Coordinator make him look, from the outside, like a member. He is not. The Order does not recruit witnesses. The Antiquarian's relationship to the Order is that of an archive — he holds the record because the Order asked him to hold the record, and his archival discipline is sufficient that the Order trusts him to redact what they ask redacted. The role of the historical witness in the saga is structurally distinct from the role of the operative. Reading him as a cell is the obvious move and the wrong one.",
    },
  ],
  choices: [
    {
      id: "watcher.e1.c.take_the_record_at_face_value" as ChoiceId,
      label: "Take the Antiquarian's record at face value — an old assassination, an old order, nothing in the present requires action.",
      weight: "passive",
    },
    {
      id: "watcher.e1.c.press_the_antiquarian_on_the_omission" as ChoiceId,
      label: "Press the Antiquarian on the millennia-long omission — ask who asked him not to write that chapter.",
      weight: "investigative",
    },
    {
      id: "watcher.e1.c.read_the_700_as_present_tense" as ChoiceId,
      label: "Read the 700 as present tense — assume the Order is operating now and look for its modern surface.",
      weight: "active",
    },
  ],
  contentBundle: {
    songId: "ocularum", /* The Ocularum song, The Age of Privacy Track 7 — the canonical anchor for the arc's cold-open */
    slideshowId: "ocularum",
    cinematicAssetId: "lord_kanshi_sha_antiquarian",
    loredexUnlocks: [
      "entity_122", /* The Ocularum (Order) — registered in this PR */
      "entity_110", /* Kanshi Sha — the feudal lord */
      "entity_66", /* The Antiquarian — the saga's archivist */
    ],
    conspiracyDiscoveries: [
      "ocularum_order_exists",
      "founding_regicide",
      "the_700",
      "antiquarian_redaction",
    ],
    dropAt: "episode_close",
  },
};

/* ─── THE WATCHER ARC — E2 ─── */
/* E2: "The Order in Plain Sight"
   The Order's modern operational surface becomes visible — but
   so casually that the player almost misses it. Trade Empire
   mission briefings, post-act inbox letters signed "L.", a
   pattern of dead-drops and signal-relays running through New
   Babylon's shipping and intel circuits. Investigate whether
   the pattern is one entity or several. */

const watcherE2: EpisodeDefinition = {
  id: "watcher.e2" as EpisodeId,
  arcId: ARC_THE_WATCHER,
  ordinal: 2,
  title: "The Order in Plain Sight",
  summary:
    "The Ocularum operates in the saga's present, and it operates in plain sight. Across New Babylon — through Trade Empire missions, through post-act inbox letters, through quiet dead-drops in shipping lanes — a pattern of operations is visible to anyone who knows the founding glyph. Investigate whether this pattern is one Order or several, and what relationship it bears to the apparatus that LORE_BIBLE.md:1272 records as 'the Empire's galaxy-spanning surveillance apparatus, including the Ocularum.'",
  clues: [
    {
      id: "watcher.e2.trade_empire_pattern" as ClueId,
      title: "Trade Empire Mission Pattern",
      body: "Cross-correlation of the last fifty Trade Empire missions filed with the player's name shows seven that share three structural features: dead-drop pickup, signal-relay verification, and a cover-identity bleed check. All seven were dispatched by Adjudicar Locke's office. All seven, on the surface, are routine Authority-sanctioned commerce-intelligence work. The seven, taken together, describe a perfect operational reconnaissance cycle. The Authority has not noticed. Or the Authority has noticed and approved.",
      foundIn: "trade-hub",
    },
    {
      id: "watcher.e2.locke_signature_pattern" as ClueId,
      title: "The Signature 'L.' Across Post-Act Letters",
      body: "Every post-act inbox letter the player has received from Adjudicar Locke (apps/shared/lockeInboxBridges.ts) is signed 'L.' — never 'Adjudicar,' never 'Locke,' never the formal Authority title. The letters' content is, on the surface, Authority business. The signature is, on the underside, operative-to-operative. The Ocularum's founding glyph appears, in stylized form, embedded in the wax seal of every letter — visible only when the seal is broken from the inside, which the player has not yet done.",
      foundIn: "captains-quarters",
    },
    {
      id: "watcher.e2.dead_drop_shipping_lanes" as ClueId,
      title: "Dead-Drops in New Babylon's Shipping Lanes",
      body: "The shipping lanes from the Sundown Bazaar to the Phyral Quarter carry, on a predictable monthly cadence, a small wax-sealed package whose contents the customs declarations describe as 'archival reference materials, no commercial value.' The packages move through Trade Empire infrastructure. The destination addresses rotate. The shipping origin is always a Locke-signed manifest. The packages have been moving on this cadence for at least eleven centuries — longer than any sender other than the Authority itself has continuously operated in New Babylon.",
      foundIn: "trade-hub",
    },
    {
      id: "watcher.e2.bifurcation_record" as ClueId,
      title: "The Apparatus / Resistance Bifurcation Record",
      body: "A single record in the Antiquarian's archive — surfaced this episode by his late-night annotation — describes the Ocularum's post-regicide bifurcation. The Apparatus Branch (those who did not act with the assassin) continued operating as Kanshi Sha had trained them and across millennia funneled into the AI Empire's surveillance bureaucracy. The Resistance Branch (the assassin and the four who knew and did not stop her) went underground. The record names them as one Order across two lineages, reunified post-Fall. The modern Order is the reunified successor.",
      foundIn: "antiquarian-library",
    },
  ],
  deductions: [
    {
      id: "watcher.e2.d.the_pattern_is_one_order" as DeductionId,
      clueA: "watcher.e2.trade_empire_pattern" as ClueId,
      clueB: "watcher.e2.locke_signature_pattern" as ClueId,
      result: "correct",
      narrationId: "watcher.e2.n.locke_is_the_signature",
      narrationProse:
        "The pattern is one Order. The seven Trade Empire missions are not seven coincidences; they describe a reconnaissance cycle. The 'L.' signature is not casual; it is the operative-to-operative form that the Ocularum's founding doctrine requires of its Coordinator. The wax-seal glyph confirms it. Adjudicar Locke is dispatching the missions, signing the letters, embedding the glyph — and the Authority has either failed to notice or chosen not to. The case's new question is whether the Authority's tolerance is ignorance or arrangement. The Order's modern operational reach runs through Locke's institutional cover; the cover is so good that 'in plain sight' is the Order's chosen posture.",
      unlocksEpisode: "watcher.e3" as EpisodeId,
    },
    {
      id: "watcher.e2.d.the_apparatus_legacy_persists" as DeductionId,
      clueA: "watcher.e2.dead_drop_shipping_lanes" as ClueId,
      clueB: "watcher.e2.bifurcation_record" as ClueId,
      result: "partial",
      narrationId: "watcher.e2.n.eleven_centuries_is_apparatus",
      narrationProse:
        "Eleven centuries of unbroken shipping cadence is not Resistance work — Resistance branches do not maintain that kind of infrastructure across institutional collapses, by definition. The shipping lanes are the Apparatus Branch's surviving channel, reabsorbed by the reunified Order after the Fall. The Order operates a bifurcated legacy: Resistance doctrine, Apparatus infrastructure. The seven Trade Empire missions are the doctrine using the infrastructure. The Ocularum's modern strength is that it has both. LORE_BIBLE.md:1272 is correct that Kanshi Sha's spy network funneled into the Empire's surveillance bureaucracy; the surveillance bureaucracy's residue is now, ironically, the resistance order's quartermaster.",
    },
    {
      id: "watcher.e2.d.false_lead_authority_is_complicit" as DeductionId,
      clueA: "watcher.e2.trade_empire_pattern" as ClueId,
      clueB: "watcher.e2.dead_drop_shipping_lanes" as ClueId,
      result: "false_lead_named",
      narrationId: "watcher.e2.n.not_complicit",
      narrationProse:
        "Reading the Authority as complicit is the obvious move and the wrong one. The Authority — New Babylon's Central Control Authority, the six imprisoned minds in red crystal coffins — is canonically the surveillance-adjacent institutional faction. The Order was founded to refuse such states. The Authority's tolerance of Locke's Trade Empire pattern is, on the evidence, ignorance: she has been threading the needle so finely that the Authority sees only routine Authority business. The case's deepening question is what happens when the Authority's six minds finally notice. Locke has been playing this game for centuries. The pattern has held. The pattern is fragile because it has held — every passing year compresses the unnoticed surface.",
    },
  ],
  choices: [
    {
      id: "watcher.e2.c.watch_a_dead_drop" as ChoiceId,
      label: "Watch a dead-drop pickup directly — confirm the cadence and the courier.",
      weight: "observational",
    },
    {
      id: "watcher.e2.c.break_a_seal_from_the_inside" as ChoiceId,
      label: "Break the wax seal of one of Locke's letters from the inside — read the embedded glyph.",
      weight: "confrontational",
    },
    {
      id: "watcher.e2.c.cross_reference_the_apparatus_residue" as ChoiceId,
      label: "Cross-reference the Antiquarian's apparatus / resistance record against the dead-drop infrastructure.",
      weight: "scholarly",
    },
  ],
  contentBundle: {
    songId: "album1.t12", /* "I Am The Eyes That Watch" — Dischordian Logic Act 2; observation/presence */
    slideshowId: "album1.t12",
    loredexUnlocks: [
      "entity_78", /* Adjudicar Locke — existing */
      "concept_apparatus_resistance_bifurcation",
      "concept_l_signature",
      "concept_dead_drop_cadence",
    ],
    conspiracyDiscoveries: [
      "locke_signature_pattern",
      "trade_empire_seven",
      "shipping_lane_cadence",
      "bifurcation_record",
    ],
    dropAt: "episode_close",
  },
};

/* ─── THE WATCHER ARC — E3 ─── */
/* E3: "The Coordinator's Cover"
   Locke's institutional position becomes the case. Investigate
   the structural impossibility of running the Resistance Order
   from inside the Authority — and why she does it anyway. */

const watcherE3: EpisodeDefinition = {
  id: "watcher.e3" as EpisodeId,
  arcId: ARC_THE_WATCHER,
  ordinal: 3,
  title: "The Coordinator's Cover",
  summary:
    "Adjudicar Locke is the Special Case Manager for New Babylon's Central Control Authority. Adjudicar Locke is the Coordinator of the Ocularum. These two facts are, on inspection, structurally incompatible — the Authority is a surveillance state, the Order was founded to refuse such states. Investigate how she has held both roles simultaneously for centuries, and why she has chosen this cover rather than a cleaner one.",
  clues: [
    {
      id: "watcher.e3.senne_to_locke_transition" as ClueId,
      title: "Senne → Locke: the Identity-Shift Canon",
      body: "Per apps/shared/questlineClassSpy.ts:304-338, Locke was Surveillance Coordinator Senne in the AI Empire, pre-defection. Her own words, from the questline: 'I was Surveillance Coordinator — I could see everything. But seeing and acting are not the same thing. That is the lesson the Eyes taught me, and it is the reason I stopped being Senne and became Locke.' The Order's founding doctrine — 'the discipline of seeing turns on the one who built it' — is the framing of her transition. She was the Order's embed inside the AI Empire's surveillance apparatus. When the Empire fell, she walked her cover-identity forward into New Babylon's institutional vacuum.",
      foundIn: "comms-array",
    },
    {
      id: "watcher.e3.authority_six_minds" as ClueId,
      title: "The Authority's Six Imprisoned Minds",
      body: "The Authority is a living computer composed of six citizen-minds, merged into a single governing intelligence in red crystal coffins (apps/shared/antiquariansJournal.ts:328-340). The Politician designed it as her 'Insurance Policy.' It processes law and justice with — per the Antiquarian's own annotation — 'the cold efficiency of an institution that has forgotten what justice feels like.' If the Authority detects Locke's dual loyalty, her destruction is automatic and not subject to appeal. The six minds have been processing her dispatches for centuries and have not detected her. The needle she threads is — by the Authority's own design — supposed to be undetectable only to outside actors, not to insiders.",
      foundIn: "war-room",
    },
    {
      id: "watcher.e3.coda_parallel" as ClueId,
      title: "The Coda — Parallel or Sister?",
      body: "Vex Solène (post-transference identity inhabiting the body that was originally Agent Zero's, per apps/shared/npcs/bibles/vex_solene.md) is canonically the Maestro of an organization called The Coda. Her Coda-internal handle is 'The Eyes of Reality.' Locke's Insurgency callsign was 'The Eyes.' The two are, per Vex's own bible, 'mirror operators in different registers.' The case's open question: whether the Coda is the Ocularum under another name, a sister network, or a parallel organization that happens to share vocabulary. Vex would never use Locke's corporate register. Locke would never use Vex's musical metaphors. They have never been in the same room on the record.",
      foundIn: "comms-array",
    },
    {
      id: "watcher.e3.why_not_a_cleaner_cover" as ClueId,
      title: "Why Not a Cleaner Cover?",
      body: "Architect's note in the Antiquarian's archive, dated last quarter: 'The Coordinator could have placed herself anywhere. The Insurgency would have given her clean ground; the Trade Empire would have given her operational latitude; the academy circuit would have given her invisibility. She chose the Authority. The Authority is the structural opposite of the Order's purpose. She chose the cover that makes her most useful and most disposable. The choice is canonically deliberate. The reason is not yet in the record.'",
      foundIn: "antiquarian-library",
    },
  ],
  deductions: [
    {
      id: "watcher.e3.d.the_cover_is_the_point" as DeductionId,
      clueA: "watcher.e3.senne_to_locke_transition" as ClueId,
      clueB: "watcher.e3.why_not_a_cleaner_cover" as ClueId,
      result: "correct",
      narrationId: "watcher.e3.n.inside_what_we_refuse",
      narrationProse:
        "The cover is the point. Locke chose the Authority because the Order's founding doctrine — 'we were the first to refuse' — requires a refusal performed from inside the thing being refused, not from outside it. The discipline of seeing turns on the one who built it; the Order's modern strategy is to be the people seeing inside the surveillance state, not the people shouting at it from a safe distance. The Senne identity made her good at it; the Locke identity made it permanent. The choice of the Authority is not concealment; it is doctrine. Every Trade Empire mission Locke signs 'L.' is the doctrine doing its work. The Authority is canonically the structural opposite of the Order's purpose, and that opposition is what makes the cover useful.",
      unlocksEpisode: "watcher.e4" as EpisodeId,
    },
    {
      id: "watcher.e3.d.coda_relationship_is_canon_pending" as DeductionId,
      clueA: "watcher.e3.coda_parallel" as ClueId,
      clueB: "watcher.e3.why_not_a_cleaner_cover" as ClueId,
      result: "partial",
      narrationId: "watcher.e3.n.mirror_operators",
      narrationProse:
        "The Coda and the Ocularum are, per their own bibles, 'mirror operators in different registers.' That phrasing forecloses the easy reading (one organization) and the cynical reading (rival organizations). They are, more likely, two surfaces of a single underlying disposition that the saga is not yet ready to name — the resistance posture toward seeing-and-doing, expressed once in Locke's institutional voice and once in Vex's musical voice. The case here is not whether they cooperate but whether they are aware of each other's full surface. They have, on the record, never met. The Antiquarian's annotation cuts off: 'whether they should is the question I will not answer.'",
    },
    {
      id: "watcher.e3.d.false_lead_authority_will_detect_her" as DeductionId,
      clueA: "watcher.e3.authority_six_minds" as ClueId,
      clueB: "watcher.e3.senne_to_locke_transition" as ClueId,
      result: "false_lead_named",
      narrationId: "watcher.e3.n.detection_is_not_the_threat",
      narrationProse:
        "Reading the case as 'the Authority will eventually detect Locke and destroy her' is the obvious move and the wrong frame. The Authority has had centuries to detect her. The six minds process every dispatch she files. They are not going to suddenly notice what they have not noticed across thousands of audits. The structural threat to Locke's cover is not Authority detection — it is the Order's own visibility creeping into surfaces the Authority cannot ignore. The 700-card DLC, if it ever ships, would name the cells and break the cover from the OUTSIDE. The Authority is the constraint; the player's own investigation is the threat.",
    },
  ],
  choices: [
    {
      id: "watcher.e3.c.confirm_with_locke_directly" as ChoiceId,
      label: "Confirm with Locke directly — show her what you have deduced; let her decide what to give you.",
      weight: "trusting",
    },
    {
      id: "watcher.e3.c.protect_the_cover_silently" as ChoiceId,
      label: "Protect the cover silently — do not surface the deductions in any record the Authority can read.",
      weight: "protective",
    },
    {
      id: "watcher.e3.c.cross_check_with_vex" as ChoiceId,
      label: "Cross-check with Vex — ask whether the Coda and the Ocularum know each other.",
      weight: "cross_arc_vex",
    },
  ],
  contentBundle: {
    songId: "album1.t10", /* "Inner Circle" — Dischordian Logic Act 1; the institutional-cover register */
    slideshowId: "album1.t10",
    loredexUnlocks: [
      "entity_vex_solene", /* Vex Solène — existing */
      "concept_senne_predecessor_identity",
      "concept_the_coda_parallel",
      "concept_authority_six_minds",
    ],
    conspiracyDiscoveries: [
      "senne_locke_transition",
      "authority_tolerance_pattern",
      "coda_canon_pending",
      "cover_doctrine",
    ],
    dropAt: "episode_close",
  },
};

/* ─── THE WATCHER ARC — E4 ─── */
/* E4: "The Sister We Did Not Retrieve"
   First canonical use of `playerInfluenceGates` (mysteryTypes.ts:280-291).
   Branches on the shipping Act-1 flags `act1_warlord_zero_defeated`
   and `act1_warlord_zero_escaped` (apps/shared/act1EncounterRewards.ts:76-89).
   The original Agent Zero — Ocularum sister, warlord-fragmented on
   Zenon — surfaces as the case. The Order's vigil over her is named.
   The player's own Act-1 engagement with the warlord-fragmented body
   is recontextualized. */

const watcherE4: EpisodeDefinition = {
  id: "watcher.e4" as EpisodeId,
  arcId: ARC_THE_WATCHER,
  ordinal: 4,
  title: "The Sister We Did Not Retrieve",
  summary:
    "The Ocularum's modern records carry a name the Order has not voiced aloud in centuries: the original Agent Zero. She was a sister of the Order — warlord-fragmented on Zenon, after the destruction of Archon Xeth'Raal, by a warlord-fragment whose origin is canon-pending (apps/shared/agentZeroOcularumBinding.ts). The Order has watched her since and has not approached her. They wait. The player has, by Act-1 canon, already engaged the warlord-fragmented body. Investigate what the Order's vigil means now that the engagement has happened.",
  clues: [
    {
      id: "watcher.e4.zenon_binding_record" as ClueId,
      title: "The Zenon Binding Record",
      body: "Per apps/shared/agentZeroOcularumBinding.ts — the canon module surfaced by this case — the original Agent Zero was an Ocularum operative whom the Order had positioned for the Zenon mission against Archon Xeth'Raal. The mission succeeded; the destruction of Xeth'Raal was Ocularum work (the Order's records still carry the operational closure note). The aftermath was not. A warlord-fragment seized the body. She lost her memory of the Order in the seizure. The Order did not retrieve her. They have spent the centuries since watching her and waiting.",
      foundIn: "war-room",
    },
    {
      id: "watcher.e4.eyes_of_reality_aliases" as ClueId,
      title: "Two Operatives Named 'The Eyes'",
      body: "Two members of the same Order's modern record carry 'Eyes' aliases. Adjudicar Locke is registered as 'The Eyes' (Casino Heist canon — apps/shared/ocularumCanon.ts). The original Agent Zero is registered with the alias 'The Eyes of Reality' (per LORE_BIBLE.md:538). The two aliases were issued by the Order, in different operational eras, to different sisters. The aliases are not coincidence and not redundancy; they are the Order's record-keeping pattern. Locke's 'Eyes' is the modern Coordinator's institutional callsign. The original Agent Zero's 'Eyes of Reality' was an operational name held in reserve for a sister whose work could not be named in the open.",
      foundIn: "comms-array",
    },
    {
      id: "watcher.e4.order_doctrine_on_fragmented_sisters" as ClueId,
      title: "The Order's Doctrine on a Warlord-Fragmented Sister",
      body: "The Order's standing position, per its internal continuity log: the body is hers; the seizure is reversible in principle; the Order will not act until the body indicates she has begun to remember on her own. The Order will not approach. The Order will not intervene. The Order waits. The cell remains hers — her number, whatever it was, remains in the Order's records as held open, not refilled. The doctrine is one of the few the modern Order inherited from the Resistance Branch unchanged: the dignity of impossible rescues is in their patience.",
      foundIn: "captains-quarters",
    },
    {
      id: "watcher.e4.act1_engagement_recontextualized" as ClueId,
      title: "The Player's Act-1 Engagement (recontextualized)",
      body: "Cross-reference apps/shared/act1EncounterRewards.ts:76-89: the player's Act-1 boss was the_warlord_zero_first. The warlord-fragmented body the player engaged in Act 1 was canonically the body that had been the Order's sister. The Order's record on the engagement is silent — the Order does not record actions taken by parties outside the cells. But the Order has, per the Coordinator's standing instructions, instructed every cell with operational visibility on the player to note what the player did and to refrain from acting on it. The Order is reading the engagement before it decides whether to brief the player on what they did.",
      foundIn: "war-room",
    },
  ],
  deductions: [
    {
      id: "watcher.e4.d.defeated_recognition" as DeductionId,
      clueA: "watcher.e4.zenon_binding_record" as ClueId,
      clueB: "watcher.e4.act1_engagement_recontextualized" as ClueId,
      result: "correct",
      narrationId: "watcher.e4.n.you_killed_her",
      narrationProse:
        "You killed her. You did not know what you killed. The Order grieves her twice — once for what the warlord made her, once for what you had to do. The seizure was canonically irreversible from the moment the warlord-fragment closed on the body; the mercy in your engagement was that the body's pain ended. The Order's doctrine on warlord-fragmented sisters is not that they are owed survival but that they are owed the dignity of being waited for. You did not know about the vigil. The Order does not hold the engagement against you. There is another. There is always another. Locke will tell you.",
      unlocksEpisode: "watcher.e5" as EpisodeId,
    },
    {
      id: "watcher.e4.d.escaped_vigil_continues" as DeductionId,
      clueA: "watcher.e4.zenon_binding_record" as ClueId,
      clueB: "watcher.e4.order_doctrine_on_fragmented_sisters" as ClueId,
      result: "correct",
      narrationId: "watcher.e4.n.she_lives",
      narrationProse:
        "She lives. She does not remember. The Order's vigil continues. The warlord-fragment still has her, and the doctrine is unchanged: the Order will not approach until the body indicates she has begun to remember on her own. Your Act-1 engagement gave her time. The Order's continuity log will record the engagement as 'the witness intervened in the body's favor; the vigil holds.' The case's new question is whether the witness should be asked, by the Coordinator, to find her again — not to retrieve her, but to be present at the moment she begins to remember. You will be asked. Locke will ask. You will say yes.",
      unlocksEpisode: "watcher.e5" as EpisodeId,
    },
    {
      id: "watcher.e4.d.two_eyes_one_order" as DeductionId,
      clueA: "watcher.e4.eyes_of_reality_aliases" as ClueId,
      clueB: "watcher.e4.order_doctrine_on_fragmented_sisters" as ClueId,
      result: "partial",
      narrationId: "watcher.e4.n.the_aliases_are_an_order_pattern",
      narrationProse:
        "Two sisters of the same Order, both named 'Eyes' in different operational eras, are not coincidence and not duplication — they are the Order's record-keeping pattern. The Coordinator is canonically 'The Eyes' to the cells; the held-open cell of the warlord-fragmented sister is canonically 'The Eyes of Reality' to no one but the continuity log. The two aliases mark the Order's two unresolved states: the Coordinator's perpetual cover, and the sister's perpetual vigil. The pattern is the Order's way of holding both at once.",
    },
  ],
  choices: [
    {
      id: "watcher.e4.c.honor_the_vigil" as ChoiceId,
      label: "Honor the Order's vigil — accept what has happened and what continues to happen.",
      weight: "patient",
    },
    {
      id: "watcher.e4.c.ask_locke_for_the_briefing" as ChoiceId,
      label: "Ask Locke for the briefing on what the Order asks of you next.",
      weight: "operative",
    },
    {
      id: "watcher.e4.c.cross_arc_with_vex" as ChoiceId,
      label: "Cross-arc with Vex — the body Vex inhabits is the body the Order was watching; she may need to know.",
      weight: "cross_arc_vex",
    },
  ],
  contentBundle: {
    songId: "album1.t19", /* "The Syndicated" — Dischordian Logic Act 3, the lost-sister tonal register */
    slideshowId: "album1.t19",
    loredexUnlocks: [
      "entity_24", /* Agent Zero — existing */
      "concept_zenon_binding",
      "concept_warlord_fragmentation",
      "concept_order_vigil_doctrine",
    ],
    conspiracyDiscoveries: [
      "zenon_binding_event",
      "two_eyes_pattern",
      "act1_recontextualization",
      "order_vigil",
    ],
    dropAt: "episode_close",
  },
};

/* ─── THE WATCHER ARC — E5 ─── */
/* E5: "Now You Are Ours"
   The reveal. Locke names herself as Coordinator, names the
   player as canonically vetted since Beat H, and offers
   recruitment. The player canonically joins the Order. The
   arc closes with their generated cell-ID being assigned. */

const watcherE5: EpisodeDefinition = {
  id: "watcher.e5" as EpisodeId,
  arcId: ARC_THE_WATCHER,
  ordinal: 5,
  title: "Now You Are Ours",
  summary:
    "Adjudicar Locke summons the player to a meeting on terms she does not file with the Authority. She names herself as Coordinator. She names the player as canonically vetted since Beat H — every Trade Empire mission accepted, every post-act letter read, every breadcrumb the player did not know was a breadcrumb. She offers recruitment. The arc closes with the player's cell number being assigned. Investigate what consent looks like when the recruitment-by-recognition has already happened.",
  clues: [
    {
      id: "watcher.e5.locke_unfiled_summons" as ClueId,
      title: "The Summons Locke Did Not File",
      body: "A meeting invitation in Locke's hand, delivered to the player by a courier whose route is not in any Authority manifest. The invitation reads, in her wry register: 'You have been useful. You have been quiet. You have been mine. Now you are ours, if you wish. Come to the address below. Bring nothing the Authority would expect you to carry.' Signed not 'L.' but, for the first time the player has seen, 'The Coordinator.' The signature is the meeting's first revelation. Everything else is acknowledgment.",
      foundIn: "captains-quarters",
    },
    {
      id: "watcher.e5.vetting_dossier" as ClueId,
      title: "The Order's Vetting Dossier",
      body: "Locke produces, at the meeting, a dossier the thickness of the saga's runtime. It is the Order's continuous vetting record on the player — every choice made since Beat H, every relationship maintained, every Trade Empire mission accepted, every Mystery Engine arc the player walked. The dossier is not surveillance; it is recognition. Locke's annotation on the cover: 'This is what we have seen. We have not interpreted it. We have only recorded it. The interpretation has always been yours. You are reading the interpretation now.' The dossier ends on the last page with a single line: 'Cell pending.'",
      foundIn: "captains-quarters",
    },
    {
      id: "watcher.e5.coordinator_terms" as ClueId,
      title: "The Coordinator's Terms",
      body: "Locke's terms are characteristically transactional, and characteristically generous. Membership in the Order does not require severance from any existing relationship, faction, or institutional position. The cell number is the player's; they may use it or not. The Order will not contact them more than they invite. The Order will not ask of them more than the founding doctrine demands of any cell. The terms close: 'The discipline of seeing will turn on you eventually. We would prefer it turn in the direction of the work. If it turns otherwise, we will respect that turn too. Sign or do not sign. Either way, you have been ours since you accepted my first letter.'",
      foundIn: "captains-quarters",
    },
    {
      id: "watcher.e5.cell_number_generation" as ClueId,
      title: "Cell Number Generation",
      body: "The Order's modern roster (apps/shared/ocularumCanon.ts) currently registers 3 named cells of 700: Cell 1 (Old Tanjin), Cell 99 (Mira the Glyph-Reader), Cell 700 (the Seventh Whisper). The remaining 697 are operationally active but canonically unnamed — they are the cells the DLC owes when it ships. Per the Coordinator's standing instructions, a new recruit's cell number is generated by the Order's continuity log at the moment of recruitment, drawing from the unfilled range. The player's cell number, if they accept, will be canonical for the rest of the saga and persist into the DLC's authoring spec.",
      foundIn: "war-room",
    },
  ],
  deductions: [
    {
      id: "watcher.e5.d.consent_after_recognition" as DeductionId,
      clueA: "watcher.e5.locke_unfiled_summons" as ClueId,
      clueB: "watcher.e5.vetting_dossier" as ClueId,
      result: "correct",
      narrationId: "watcher.e5.n.you_were_always_meant_to_become",
      narrationProse:
        "The arc's framing is not betrayal — Locke never lied to you about the missions. The framing is not recruitment-by-surprise — every breadcrumb was visible, every signature was 'L.', every wax seal carried the glyph. The framing is mutual conspiratorial trust: Locke has been trusting you with her life since Beat H, and you did not know what your trust was buying. You were always meant to become this. Locke knew before you did. The dossier's last line — 'Cell pending' — is not a request; it is the recognition that the work has already happened. Your consent is what closes the recognition into a name. Whether you sign or do not sign, you have been hers since you accepted her first letter. Signing changes who reads the second.",
    },
    {
      id: "watcher.e5.d.coordinator_pattern" as DeductionId,
      clueA: "watcher.e5.coordinator_terms" as ClueId,
      clueB: "watcher.e5.cell_number_generation" as ClueId,
      result: "partial",
      narrationId: "watcher.e5.n.the_terms_are_doctrine",
      narrationProse:
        "Locke's terms are the founding doctrine's modern expression. 'We were the first to refuse' becomes 'we will not ask of you what we have not asked of ourselves.' 'The eye that watches the watchers' becomes the dossier — the Order has been the eye that watched the player's choices, without interpreting them. 'The discipline of seeing turns on the one who built it' becomes the warning: she names the doctrine as the threat it has always been, including to the people who hold it. The cell-number generation closes the recognition into a name. The pattern is the Order's full doctrine compressed into a single recruitment conversation.",
    },
    {
      id: "watcher.e5.d.false_lead_the_authority_must_be_told" as DeductionId,
      clueA: "watcher.e5.locke_unfiled_summons" as ClueId,
      clueB: "watcher.e5.coordinator_terms" as ClueId,
      result: "false_lead_named",
      narrationId: "watcher.e5.n.the_authority_does_not_get_to_know",
      narrationProse:
        "Reading the meeting as something the Authority must be informed of is the obvious move and the wrong one. The Authority is canonically the surveillance state the Order was founded to refuse. Telling the Authority is telling the Authority. The doctrine is not 'transparency with all parties'; it is 'refusal of the apparatus that demands transparency.' The Coordinator's terms include 'membership does not require severance from any existing relationship, faction, or institutional position' — meaning the player can continue every existing arc, every existing faction, every existing surface — but the Order is not one of those existing surfaces and is not for the Authority to know about. Telling collapses the cover. The cover is the Order's centuries-long work.",
    },
  ],
  choices: [
    {
      id: "watcher.e5.c.accept_the_cell" as ChoiceId,
      label: "Accept the cell — sign the dossier; let the continuity log generate your number.",
      weight: "recruitment",
    },
    {
      id: "watcher.e5.c.decline_without_severance" as ChoiceId,
      label: "Decline without severance — Locke's terms hold either way; the work continues.",
      weight: "principled",
    },
    {
      id: "watcher.e5.c.ask_for_time" as ChoiceId,
      label: "Ask for time — say nothing yet; let the recognition sit.",
      weight: "deliberate",
    },
  ],
  contentBundle: {
    songId: "album1.t28", /* "Last Words" — Dischordian Logic Act 5 finale; recruitment-as-completion */
    slideshowId: "album1.t28",
    loredexUnlocks: [
      "concept_coordinator_terms",
      "concept_cell_number_generation",
      "concept_vetting_dossier",
      "concept_recruitment_by_recognition",
    ],
    conspiracyDiscoveries: [
      "locke_named_as_coordinator",
      "vetting_dossier_revealed",
      "cell_number_generated",
      "order_membership_confirmed",
    ],
    dropAt: "episode_close",
  },
};

/* ─── THE WATCHER ARC — SUSPECTS, LENSES, DEFINITION ─── */

const watcherSuspects: ReadonlyArray<{
  id: SuspectId;
  name: string;
  type: string;
  relations: ReadonlyArray<{ to: SuspectId; relation: string }>;
}> = [
  {
    id: "suspect.the_watcher" as SuspectId,
    name: "The Watcher / Lord Kanshi Sha",
    type: "character",
    relations: [
      { to: "suspect.the_collector" as SuspectId, relation: "resurrected-by" },
      { to: "suspect.ocularum_order" as SuspectId, relation: "founding-target-of" },
    ],
  },
  {
    id: "suspect.ocularum_order" as SuspectId,
    name: "The Ocularum (Order)",
    type: "faction",
    relations: [
      { to: "suspect.adjudicar_locke" as SuspectId, relation: "coordinated-by" },
      { to: "suspect.the_collector" as SuspectId, relation: "regicide-undone-by" },
    ],
  },
  {
    id: "suspect.adjudicar_locke" as SuspectId,
    name: "Adjudicar Locke (Coordinator)",
    type: "character",
    relations: [
      { to: "suspect.the_authority" as SuspectId, relation: "institutionally-bound-to" },
      { to: "suspect.original_agent_zero" as SuspectId, relation: "sister-of-the-vigil" },
    ],
  },
  {
    id: "suspect.the_authority" as SuspectId,
    name: "The Authority (Six Imprisoned Minds)",
    type: "faction",
    relations: [],
  },
  {
    id: "suspect.original_agent_zero" as SuspectId,
    name: "Agent Zero (original — warlord-fragmented)",
    type: "character",
    relations: [
      { to: "suspect.ocularum_order" as SuspectId, relation: "sister-of-the-order" },
    ],
  },
  {
    id: "suspect.the_collector" as SuspectId,
    name: "The Collector",
    type: "character",
    relations: [],
  },
];

const watcherLenses = [
  { id: LENS_INSURGENCY, name: "Insurgency", category: "faction" },
  { id: LENS_HIERARCHY,  name: "Hierarchy",  category: "faction" },
  { id: LENS_THALORIA,   name: "Thaloria",   category: "faction" },
  { id: LENS_QUARCHON,   name: "Quarchon",   category: "faction" },
  { id: LENS_DREAMER,    name: "Dreamer",    category: "faction" },
  { id: LENS_NEUTRAL,    name: "Neutral",    category: "faction" },
] as const;

const THE_WATCHER_MYSTERY: MysteryDefinition = {
  id: "mystery.the_watcher" as MysteryId,
  arcId: ARC_THE_WATCHER,
  title: "The 700",
  summary:
    "An old assassination, an old order, and a recruitment that has already happened. The Antiquarian surfaces a record of the feudal-era assassination of Lord Kanshi Sha — and the order his trained agent founded. The 700 is in the margin. The Order operates in New Babylon's present. The Coordinator has been writing to the player since Beat H. Investigate whether they want the cell number the Coordinator's continuity log is, by the time the case closes, prepared to give them.",
  npcId: "adjudicar_locke",
  episodes: [watcherE1, watcherE2, watcherE3, watcherE4, watcherE5],
  suspects: watcherSuspects,
  lenses: watcherLenses,
  /**
   * First canonical use of `playerInfluenceGates` in the saga.
   * Branches the E4 closure narration on the shipping Act-1
   * flags `act1_warlord_zero_defeated` / `act1_warlord_zero_escaped`
   * (apps/shared/act1EncounterRewards.ts:76-89). The two
   * deductions watcherE4.d.defeated_recognition and
   * watcherE4.d.escaped_vigil_continues both unlock E5 — the
   * resolver picks which closure narration the player sees
   * based on the flag they set in Act 1.
   *
   * The architect's note (per
   * apps/shared/agentZeroOcularumBinding.ts:WATCHER_ARC_E4_BRANCH_FLAGS):
   * the case structurally requires the Order's voice to address
   * what the player did to the warlord-fragmented body in Act 1.
   * The flags carry that engagement forward across acts.
   */
  playerInfluenceGates: [
    {
      id: "watcher_e4_act1_defeated",
      condition: { kind: "narrative_flag", flag: "act1_warlord_zero_defeated" },
      branchId: "watcher.e4.d.defeated_recognition",
      rationale:
        "Player defeated the warlord-fragmented body in Act 1 — the Order's E4 framing surfaces the grief-twice narration and the breadcrumb 'there is another' to E5.",
    },
    {
      id: "watcher_e4_act1_escaped",
      condition: { kind: "narrative_flag", flag: "act1_warlord_zero_escaped" },
      branchId: "watcher.e4.d.escaped_vigil_continues",
      rationale:
        "Player let the warlord-fragmented body escape in Act 1 — the Order's E4 framing surfaces the vigil-continues narration and the breadcrumb 'you will be asked to find her again' to E5.",
    },
    /* PR-3C — the Non-Coordination Pact reveal variant.
     * Triggered ONLY when the player has reached Vex's Coda
     * `inner_circle` standing AND has also closed the ith_rael
     * arc (the latter's unindexable-practice doctrine is what
     * gives the dual-membership player the conceptual grip to
     * understand what Locke is naming). The triple-arc
     * completion is the unlock: watcher.e5 + ith_rael.e5 +
     * Coda inner_circle. Locke names the pact for the player
     * at E5 close — the saga's deepest reveal, only available
     * to players who have walked all three arcs to the end.
     * See apps/shared/nonCoordinationPact.ts:PACT_PLAYER_EXCEPTION
     * for the canonical reveal content. */
    {
      id: "watcher_e5_pact_reveal_dual_membership",
      condition: { kind: "narrative_flag", flag: "coda_inner_circle_standing" },
      branchId: "watcher.e5.d.consent_after_recognition",
      rationale:
        "Player has reached Vex's Coda inner_circle standing — when combined with the_watcher arc completion (Ocularum cell-membership), the player is the saga's only cross-network operative. Locke's E5 reveal names the Non-Coordination Pact and tells the player they are the structural-exception channel neither network officially has. The flag also requires ith_rael arc closure (mystery_episode_complete:arc.ith_rael:ith_rael.e5) for full conceptual unlock; the resolver checks the second condition at branch-resolution time.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   ITH'RAEL ARC — "The Centuries Were the Working"
   The Severance was not an event. It was a working — slow,
   patient, multi-generational, conducted by a single
   Director of Special Projects whose method was never to
   force a change, only to soften the conditions until the
   change emerged on its own. Ith'Rael the Whisperer
   (apps/shared/hierarchyCanon.ts:172-186) is the working's
   author. The arc investigates HOW the Severance happened,
   not WHAT it produced — and surfaces the disturbing fact
   that Ith'Rael is still working, in the saga's present,
   on operations the player has not yet learned to see.

   Cross-references:
     - LORE_BIBLE.md (Marion Kell, Darren Fessler) — the
       Shadow Tongue's editing pattern
     - apps/shared/hierarchyCanon.ts (Drael'Mon, Zyr'Koth) —
       the operational chain Ith'Rael fed
     - apps/shared/hierarchyCanon.ts:HIERARCHY_AEONS_PIECE_POSITIONING
       — the meta-faction's piece-positioning canon Ith'Rael
       is one canonical operator of
   ═══════════════════════════════════════════════════════ */

/* ─── ITH'RAEL ARC — E1 ─── */
/* E1: "A Single Hand"
   The Severance had a single orchestrator. The case opens
   on a record the Hierarchy itself does not redact —
   because the Hierarchy is proud of him. */

const ithRaelE1: EpisodeDefinition = {
  id: "ith_rael.e1" as EpisodeId,
  arcId: ARC_ITH_RAEL,
  ordinal: 1,
  title: "A Single Hand",
  summary:
    "The Severance broke the ancient bindings and freed the Hierarchy of the Damned to wage war across the multiverse. Most accounts treat it as a multi-actor cataclysm. The Hierarchy's own records — accessible to anyone who can read corporate org charts — credit a single operator: Ith'Rael the Whisperer, Director of Special Projects. Investigate how a single Director, on a centuries-long timetable, executed the largest cosmological breach in the saga's record.",
  clues: [
    {
      id: "ith_rael.e1.hierarchy_org_chart" as ClueId,
      title: "The Hierarchy's Severance Project Org Chart",
      body: "The Hierarchy of the Damned files internal credit the way every corporation does: by project, by lead, by deliverable. The Severance is filed under Special Projects, lead Ith'Rael the Whisperer, Director. Co-leads: Zyr'Koth (R&D, refined the Blood Weave into the Severance Protocol — apps/shared/hierarchyCanon.ts:160-162); Drael'Mon (Consumer, devoured what the Shadow Tongue softened — apps/shared/hierarchyCanon.ts:208-210). The org chart shows Ith'Rael at the top of a single reporting line. The Severance is, by the Hierarchy's own internal accounting, his.",
      foundIn: "war-room",
    },
    {
      id: "ith_rael.e1.shadow_tongue_signature" as ClueId,
      title: "The Shadow Tongue's Editing Signature",
      body: "The Shadow Tongue is not merely a language; it is an editing apparatus. Cross-reference its operational signature: it does not destroy records, it removes them — surgically, with the formatting fields and the connections-graph entries and the memory-of-the-name from anyone who knew the subject. Marion Kell (LORE_BIBLE.md:113-136) is the documented case. The signature is Ith'Rael's: subtraction without trace, performed across the chronicle layer rather than the physical layer. The Shadow Tongue is his instrument; the editing is his art form.",
      foundIn: "comms-array",
    },
    {
      id: "ith_rael.e1.no_force_only_softening" as ClueId,
      title: "The Director's Operational Doctrine",
      body: "An internal Hierarchy memo, dated to the early Severance preparation: 'Department of Special Projects standing instruction. We do not force outcomes. We soften the conditions until the outcome emerges on its own. Force makes a target defensive; softening makes the target a participant. The Severance will be undone if it is taken; it will hold if it is given. Our work is to make it given.' Signed: Ith'Rael, Director. The doctrine is the working's whole strategy condensed into four sentences.",
      foundIn: "antiquarian-library",
    },
    {
      id: "ith_rael.e1.hierarchy_internal_credit" as ClueId,
      title: "Hierarchy Internal Credit Distribution",
      body: "The Hierarchy is canonically a corporation. Corporations distribute credit. Per the Hierarchy's internal accounting, the Severance produced eleven separate after-action commendations: four to Drael'Mon (consumption efficiency), three to Zyr'Koth (protocol refinement), one each to Riri'Ahlia (operational logistics), Mol'Garath (CEO sign-off), Syl'Vex (corruption support), and Ith'Rael — the Director's commendation, dated ten years after the bindings broke, citing 'the patience of the working' as the Hierarchy's most valuable institutional asset. The dating matters: ten years AFTER, not at the moment.",
      foundIn: "trade-hub",
    },
  ],
  deductions: [
    {
      id: "ith_rael.e1.d.severance_was_one_directors_working" as DeductionId,
      clueA: "ith_rael.e1.hierarchy_org_chart" as ClueId,
      clueB: "ith_rael.e1.no_force_only_softening" as ClueId,
      result: "correct",
      narrationId: "ith_rael.e1.n.a_single_hand",
      narrationProse:
        "The Severance was a single Director's working. Ith'Rael had the org-chart authority to do it, the operational doctrine to execute it across centuries, and the institutional credit to claim it ten years afterward without comment from the C-suite. The Hierarchy's own records do not redact him because the Hierarchy is proud — they consider the Severance the most successful Special Projects engagement in their corporate history. The case's operational frame is now clear: we are not investigating an event; we are investigating a method. The method is patience. The instrument is the Shadow Tongue. The result is that the Hierarchy is currently free to operate across the saga's present, and Ith'Rael is currently still Director.",
      unlocksEpisode: "ith_rael.e2" as EpisodeId,
    },
    {
      id: "ith_rael.e1.d.shadow_tongue_is_the_chisel" as DeductionId,
      clueA: "ith_rael.e1.shadow_tongue_signature" as ClueId,
      clueB: "ith_rael.e1.no_force_only_softening" as ClueId,
      result: "partial",
      narrationId: "ith_rael.e1.n.subtraction_without_trace",
      narrationProse:
        "The Shadow Tongue's signature — subtraction without trace, performed at the chronicle layer — is the operational expression of the doctrine 'we do not force outcomes; we soften the conditions.' You cannot force a defensive system that is editing its own threat-detection in real time. You can only edit faster than the system can write itself back. The Shadow Tongue is Ith'Rael's chisel; the chronicle is the stone. The Marion Kell case (LORE_BIBLE.md:113-136) is the documented small-scale demonstration; the Severance was the large-scale execution.",
    },
    {
      id: "ith_rael.e1.d.false_lead_severance_was_brute_force" as DeductionId,
      clueA: "ith_rael.e1.hierarchy_org_chart" as ClueId,
      clueB: "ith_rael.e1.shadow_tongue_signature" as ClueId,
      result: "false_lead_named",
      narrationId: "ith_rael.e1.n.not_brute_force",
      narrationProse:
        "Reading the Severance as a brute-force breaking is the obvious move and the wrong one. The ancient bindings were not engineered to fail under force — they had been holding under force for the entire Hierarchy's pre-Severance imprisonment. They were engineered to fail under the absence of opposition. The Shadow Tongue removed the opposition by removing the records that constituted it. The Severance succeeded because, by the time the bindings broke, no one alive remembered why they had been written. Force was never the threat; forgetting was. The doctrine 'we do not force outcomes' is not euphemism. It is method.",
    },
  ],
  choices: [
    {
      id: "ith_rael.e1.c.read_the_director_as_a_problem_to_solve" as ChoiceId,
      label: "Read the Director as a problem to solve — investigate his current operations.",
      weight: "operational",
    },
    {
      id: "ith_rael.e1.c.read_the_method_as_a_doctrine_to_learn" as ChoiceId,
      label: "Read the method as a doctrine to study — softening as institutional craft.",
      weight: "scholarly",
    },
    {
      id: "ith_rael.e1.c.cross_reference_the_marion_kell_pattern" as ChoiceId,
      label: "Cross-reference the Marion Kell editing — examine the Shadow Tongue's small-scale signature.",
      weight: "investigative",
    },
  ],
  contentBundle: {
    songId: "album1.t10", /* "Inner Circle" — Dischordian Logic Act 1 */
    slideshowId: "album1.t10",
    loredexUnlocks: [
      "concept_severance_a_single_hand",
      "concept_directors_doctrine",
      "concept_hierarchy_credit_distribution",
    ],
    conspiracyDiscoveries: [
      "single_director_orchestration",
      "shadow_tongue_signature",
      "softening_doctrine",
      "ten_year_commendation",
    ],
    dropAt: "episode_close",
  },
};

/* ─── ITH'RAEL ARC — E2 ─── */
/* E2: "Marion Kell, Read Slowly"
   The Marion Kell editing is documented in the Chronicle.
   Read it slowly enough and the Director's full method
   becomes visible — the Shadow Tongue is not editing
   names, it is editing the conditions of recognition. */

const ithRaelE2: EpisodeDefinition = {
  id: "ith_rael.e2" as EpisodeId,
  arcId: ARC_ITH_RAEL,
  ordinal: 2,
  title: "Marion Kell, Read Slowly",
  summary:
    "Marion Kell was edited out of Ark 1047's Chronicle four centuries before the Fall (LORE_BIBLE.md:113-136). The case is documented; the Inventor restored partial visibility through three Palimpsest broadcasts. Reading the editing slowly — clue by clue, formatting field by formatting field — surfaces a pattern the Inventor's restoration did not name: the Shadow Tongue does not edit names. It edits the conditions under which a name can be recognized. Investigate what that means for the Severance and for the saga's present.",
  clues: [
    {
      id: "ith_rael.e2.kell_chronicle_excision" as ClueId,
      title: "The Marion Kell Chronicle Excision",
      body: "Per LORE_BIBLE.md:113-136: Marion Kell's Chronicle entry, her connections-graph nodes, the formatting-field thank-you notes, and the memory-of-her in Elara's substrate architecture were all surgically removed by the Shadow Tongue. The excision held for four centuries before the Inventor's broadcast intrusions partially restored her visibility (Palimpsest Episodes 4, 9, and 13). The technical signature is unique to the Shadow Tongue; no other operator in the saga's record has this combination of precision and reach.",
      foundIn: "comms-array",
    },
    {
      id: "ith_rael.e2.what_was_not_edited" as ClueId,
      title: "What the Shadow Tongue Did Not Edit",
      body: "Cross-reference the parts of Marion Kell's footprint that the Shadow Tongue did NOT touch: the wood grain of the desk she used, the stains on the mug she drank from, the undusted spot on the shelf where her photograph had stood. Physical residue. Archaeological evidence. The Shadow Tongue does not edit the world; it edits the chronicle of the world. The world remembers Marion Kell in unindexed forms — but the indexing is what allows recognition. Without the indexing, the residue is just residue. The Director understands what indexing is for.",
      foundIn: "engineering",
    },
    {
      id: "ith_rael.e2.darren_fessler_resistance" as ClueId,
      title: "Why Darren Fessler's Entry Could Not Be Edited",
      body: "Per LORE_BIBLE.md:31-36: Darren Fessler died between Palimpsest Episodes 11 and 12; the Shadow Tongue attempted to edit his Loredex entry within six hours and failed for the first time in four hundred years. The cause is unexplained in the saga's open record. Cross-correlation against the Director's doctrine ('we do not force outcomes; we soften the conditions') suggests the failure mechanism: Darren had spent decades writing letters to contestants in which 'each of his letters contained one real sentence buried under a page of small talk.' The buried sentences were unindexed by design. There was nothing for the Shadow Tongue to subtract; the meaning was hidden where indexing could not reach.",
      foundIn: "antiquarian-library",
    },
    {
      id: "ith_rael.e2.indexing_doctrine" as ClueId,
      title: "The Director's Indexing Doctrine (inferred)",
      body: "Architect's note in the Antiquarian's archive: 'The Shadow Tongue is not an editor of names, persons, or events. It is an editor of the conditions that allow recognition. To remove a person from the chronicle is to remove the indexing under which the person can be found, not to remove the person. The Director's doctrine therefore is not destruction but unindexing. This is harder to undo than destruction. Destruction leaves a void. Unindexing leaves a complete chronicle that no one can find what they need in.'",
      foundIn: "antiquarian-library",
    },
  ],
  deductions: [
    {
      id: "ith_rael.e2.d.unindexing_is_the_method" as DeductionId,
      clueA: "ith_rael.e2.what_was_not_edited" as ClueId,
      clueB: "ith_rael.e2.indexing_doctrine" as ClueId,
      result: "correct",
      narrationId: "ith_rael.e2.n.indexing_is_the_lever",
      narrationProse:
        "The Shadow Tongue's method is unindexing, not editing. The world remembers; the chronicle no longer indexes the remembering. To a system trying to act on memory — Elara's substrate, the Hierarchy's own internal records, the Insurgency's tactical intelligence — the unindexed memory is functionally absent. The Severance was not the breaking of the bindings; the Severance was the unindexing of the reasons the bindings had been written. By the time the bindings broke, no system could retrieve the cause for which they had been engineered. The breaking was, by then, a formality. The Director's working was the unindexing. The breaking was the receipt.",
      unlocksEpisode: "ith_rael.e3" as EpisodeId,
    },
    {
      id: "ith_rael.e2.d.darren_resistance_pattern" as DeductionId,
      clueA: "ith_rael.e2.darren_fessler_resistance" as ClueId,
      clueB: "ith_rael.e2.indexing_doctrine" as ClueId,
      result: "partial",
      narrationId: "ith_rael.e2.n.unindexable_meaning",
      narrationProse:
        "Darren Fessler resisted by being unindexable from the start. His meaningful sentences were buried under indexable noise; the Shadow Tongue could not subtract what it could not locate. The principle is generalizable: anyone who structures their meaning so that the meaning is not in the indexing layer is editable only with violence. The Director does not use violence — the doctrine forbids force. Therefore, anyone whose meaning lives outside the indexing layer is, in practice, beyond the Director's reach. The Order's wax-seal glyph, visible only when the seal is broken from the inside (the_watcher.e2.locke_signature_pattern), is one of these structures. The Resistance Branch's millennia-long survival is another.",
    },
    {
      id: "ith_rael.e2.d.false_lead_inventor_can_undo_severance" as DeductionId,
      clueA: "ith_rael.e2.kell_chronicle_excision" as ClueId,
      clueB: "ith_rael.e2.darren_fessler_resistance" as ClueId,
      result: "false_lead_named",
      narrationId: "ith_rael.e2.n.restoration_is_local",
      narrationProse:
        "Reading the Inventor's Marion Kell restoration as evidence that the Severance can be undone is the obvious move and the wrong one. The Inventor restored partial visibility for ONE individual across THREE broadcasts, working at the limit of his capacity, exploiting a specific Palimpsest-era audio-visual loophole the Director did not anticipate. Scaling that to the Severance — undoing the unindexing of the entire pre-Severance binding-rationale — is structurally beyond any single restoration operation. The Severance is, in the operative sense, irreversible. The case's operational frame must accept this: the Director's working has held; the question is what he is currently working on.",
    },
  ],
  choices: [
    {
      id: "ith_rael.e2.c.audit_for_current_unindexing" as ChoiceId,
      label: "Audit the saga's present-tense chronicle for active unindexing operations.",
      weight: "investigative",
    },
    {
      id: "ith_rael.e2.c.protect_unindexable_meaning_structures" as ChoiceId,
      label: "Identify and protect the saga's existing unindexable meaning structures.",
      weight: "defensive",
    },
    {
      id: "ith_rael.e2.c.consult_inventor_on_method" as ChoiceId,
      label: "Consult the Inventor on the limits of restoration — what can and cannot be brought back.",
      weight: "scholarly",
    },
  ],
  contentBundle: {
    songId: "album1.t12", /* "I Am The Eyes That Watch" — observation/presence */
    slideshowId: "album1.t12",
    loredexUnlocks: [
      "concept_unindexing_doctrine",
      "concept_unindexable_meaning",
      "concept_severance_as_unindexing",
    ],
    conspiracyDiscoveries: [
      "shadow_tongue_method",
      "kell_excision_pattern",
      "darren_resistance",
      "indexing_lever",
    ],
    dropAt: "episode_close",
  },
};

/* ─── ITH'RAEL ARC — E3 ─── */
/* E3: "Thaloria, Generation by Generation"
   The Severance corrupted Thaloria over centuries. The
   case examines how — and finds that the corruption was
   not done to Thaloria but performed BY Thaloria, after
   the Director softened the conditions enough that each
   generation handed the next a slightly less defensible
   version of itself. */

const ithRaelE3: EpisodeDefinition = {
  id: "ith_rael.e3" as EpisodeId,
  arcId: ARC_ITH_RAEL,
  ordinal: 3,
  title: "Thaloria, Generation by Generation",
  summary:
    "The Severance corrupted Thaloria; the corruption was the working's mechanism. Conventional accounts treat the corruption as something done TO Thaloria — an external assault. The Director's archived notes treat it differently: the corruption was performed BY Thaloria, generation by generation, after the Director softened the conditions enough that each generation could hand the next a slightly less defensible version of itself. Investigate the centuries-long handoff and the moment it became irreversible.",
  clues: [
    {
      id: "ith_rael.e3.thaloria_generational_records" as ClueId,
      title: "Thaloria's Generational Defense Records",
      body: "Thaloria's pre-Severance defense doctrine was canonically rigorous: the Empire of Shadows used the Blood Weave defensively (apps/shared/hierarchyCanon.ts:21 — the Hierarchy's antithesis), and Thalorian generations were trained, tested, and recertified across a multi-decade ritual cadence. The defense records show no corruption event. They show, across nine generations, a slow and consensual relaxation of the recertification standards. Each generation passed the test the previous generation had set; each generation set a slightly easier test for the next. By the ninth generation, the recertification was a formality. The corruption was procedural before it was substantive.",
      foundIn: "war-room",
    },
    {
      id: "ith_rael.e3.directors_engagement_notes" as ClueId,
      title: "The Director's Engagement Notes (recovered fragments)",
      body: "Three pages of Ith'Rael's working notes, recovered from a Hierarchy R&D archive Zyr'Koth was reorganizing: 'Generation N+1 will not believe the threat exists if Generation N has not personally encountered it. Therefore: ensure Generation N does not personally encounter it. The Whisperer is patient. The Whisperer is gentle. The Whisperer says: it has been a long time since anything happened. It is true. It will continue to be true. Therefore, the standards may be relaxed. Therefore, the standards have been relaxed. Therefore, the standards were never necessary.' The handwriting is the Director's. The marginalia: 'Tested on cohort 4. Holds.'",
      foundIn: "antiquarian-library",
    },
    {
      id: "ith_rael.e3.point_of_no_return" as ClueId,
      title: "The Point of No Return — Generation Six",
      body: "Generational analysis indicates the Severance corruption became irreversible at Generation Six's recertification cycle. At Generation Six, for the first time, no living Thalorian had personally encountered an active Hierarchy operation. The recertification examiners had only their predecessors' records to inform them; their predecessors' records had been authored by examiners who themselves had never encountered an operation. The Director's engagement note for that cycle is two words: 'It holds.' Three generations later the bindings broke. The breaking was the receipt; the irreversibility was at Generation Six.",
      foundIn: "antiquarian-library",
    },
    {
      id: "ith_rael.e3.advocate_response_recovery" as ClueId,
      title: "The Advocate's Late-Cycle Response (recovered)",
      body: "The Advocate (apps/shared/hierarchyCanon.ts:21 — the saga's primary canonical resistance to the Hierarchy) attempted a corrective intervention at Generation Eight, recognizing too late what was happening. The intervention failed for the reason the Director's doctrine predicts: by Generation Eight, the Thalorian receiving cohort had no operational memory against which to evaluate the Advocate's claim. The Advocate spoke a language of urgency to listeners whose own records said urgency had not been required for two centuries. The intervention was politely declined. The Advocate's notes — preserved by the Antiquarian — close: 'I came too late. I was on time. The two are not the same.'",
      foundIn: "antiquarian-library",
    },
  ],
  deductions: [
    {
      id: "ith_rael.e3.d.thaloria_corrupted_itself" as DeductionId,
      clueA: "ith_rael.e3.thaloria_generational_records" as ClueId,
      clueB: "ith_rael.e3.directors_engagement_notes" as ClueId,
      result: "correct",
      narrationId: "ith_rael.e3.n.consent_through_softening",
      narrationProse:
        "Thaloria corrupted itself, generation by generation, with the Director's gentle and patient encouragement. The Whisperer never breached the defenses; the Whisperer talked to each cohort's recertification examiners about how long it had been since anything had happened. The cohorts agreed. They relaxed the standards. The next cohort agreed even more. The corruption was procedural for nine generations and substantive for one — and by then no living defender remembered why the standards had been written. The doctrine 'we do not force outcomes; we soften the conditions' is most fully expressed in this arc: the conditions were softened across two centuries until the bindings broke without resistance.",
      unlocksEpisode: "ith_rael.e4" as EpisodeId,
    },
    {
      id: "ith_rael.e3.d.advocate_was_on_time" as DeductionId,
      clueA: "ith_rael.e3.point_of_no_return" as ClueId,
      clueB: "ith_rael.e3.advocate_response_recovery" as ClueId,
      result: "partial",
      narrationId: "ith_rael.e3.n.too_late_was_on_time",
      narrationProse:
        "The Advocate's note — 'I came too late. I was on time. The two are not the same.' — names the structural problem the working's pace creates. By the moment of intervention, the listeners' frame of reference no longer included the urgency the Advocate was trying to communicate. The intervention was rejected on procedural grounds: the listeners' records did not show urgency had ever been required, so the urgency-claim could not be processed. The Advocate was on time in the absolute sense; he was too late in the only sense that mattered. The doctrine compresses centuries of preparation into a single closed door.",
    },
    {
      id: "ith_rael.e3.d.false_lead_thaloria_was_attacked" as DeductionId,
      clueA: "ith_rael.e3.thaloria_generational_records" as ClueId,
      clueB: "ith_rael.e3.advocate_response_recovery" as ClueId,
      result: "false_lead_named",
      narrationId: "ith_rael.e3.n.not_attacked",
      narrationProse:
        "Reading the Severance as an attack on Thaloria is the obvious move and the wrong frame. The records contain no attack — no breach incident, no defender casualty, no defensive deployment. Thaloria's own examiners signed off on every recertification, voluntarily, on schedule, with consensus across the examining boards. The corruption was performed BY Thaloria, with the Director's whispered participation. Naming it 'attack' obscures the doctrine's actual force: the Director did not need to defeat Thaloria's defenses. He needed only Thaloria's defenders to relax them, generation by generation, until relaxation was the institutional posture.",
    },
  ],
  choices: [
    {
      id: "ith_rael.e3.c.identify_current_softening" as ChoiceId,
      label: "Identify softening operations the Director may currently be running on the saga's present-tense factions.",
      weight: "investigative",
    },
    {
      id: "ith_rael.e3.c.publish_the_method" as ChoiceId,
      label: "Publish the Director's method openly — let every faction's defenders know the working's shape.",
      weight: "transparent",
    },
    {
      id: "ith_rael.e3.c.protect_recertification_disciplines" as ChoiceId,
      label: "Protect the saga's surviving recertification disciplines from the procedural-relaxation pattern.",
      weight: "defensive",
    },
  ],
  contentBundle: {
    songId: "album1.t18", /* "Planet of the Wolf" — Thaloria-canon-mapped */
    slideshowId: "album1.t18",
    loredexUnlocks: [
      "concept_thaloria_self_corruption",
      "concept_advocate_on_time_too_late",
      "concept_generation_six_irreversibility",
    ],
    conspiracyDiscoveries: [
      "generational_handoff",
      "directors_engagement_pattern",
      "advocate_intervention_failure",
      "consent_through_softening",
    ],
    dropAt: "episode_close",
  },
};

/* ─── ITH'RAEL ARC — E4 ─── */
/* E4: "What He Is Currently Working On"
   The Director did not stop. The arc surfaces three
   present-tense operations whose softening signature is
   the working's. The case is which to investigate first
   and which to expose. */

const ithRaelE4: EpisodeDefinition = {
  id: "ith_rael.e4" as EpisodeId,
  arcId: ARC_ITH_RAEL,
  ordinal: 4,
  title: "What He Is Currently Working On",
  summary:
    "The Director did not stop after the Severance. Patience does not retire. The case surfaces three present-tense operations whose softening signature matches the working's: (1) procedural relaxation in the New Babylon Authority's audit cadence on its own six imprisoned minds, (2) generational handoff degradation in the Insurgency's resurrectionist-protocol oversight, (3) recertification-cadence loosening in the Mechronis Academy's spy-class certification. Investigate which to expose first, and accept the doctrinal lesson that exposure is itself a kind of softening.",
  clues: [
    {
      id: "ith_rael.e4.authority_audit_cadence" as ClueId,
      title: "The Authority's Self-Audit Cadence Drift",
      body: "The New Babylon Authority's six imprisoned minds in red crystal coffins are subject to an internal self-audit cadence intended to catch governance drift. Cross-correlation across two centuries of audit logs shows the cadence has slowed by 47% — from a quarterly cycle to an annual one — without any documented decision to slow it. The Authority itself agreed, in each step, that the previous step's tempo was sufficient. The Director's signature: no force, no breach, only consent through softening. The audit cadence is now slow enough that a coordinator running a centuries-long double-game from inside the Authority would be detected only on a schedule that her career has long outlasted.",
      foundIn: "war-room",
    },
    {
      id: "ith_rael.e4.resurrectionist_oversight_drift" as ClueId,
      title: "The Insurgency's Resurrectionist-Protocol Oversight Drift",
      body: "The Insurgency's resurrectionist-protocol oversight committee has, across three generations, shed every member who personally witnessed an unauthorized resurrection. The current committee has only secondhand training. The protocol-review documents show the committee has, over those three generations, voluntarily relaxed the consent requirements, voluntarily expanded the permissible scope, voluntarily reduced the post-resurrection audit. The Resurrectionist arc on this branch (apps/shared/episodeMysteries.ts — the Resurrectionist · Cycle Walker mystery) reads forward into this drift. The Director's signature is on the procedural pattern.",
      foundIn: "comms-array",
    },
    {
      id: "ith_rael.e4.mechronis_certification_relaxation" as ClueId,
      title: "Mechronis Academy Spy-Class Certification Relaxation",
      body: "The Mechronis Academy's spy-class certification is canonically the highest standard the Insurgency maintains for covert operatives. The certification's rigor protected the Order's apparatus-branch operatives, and continues to protect Locke's modern operations (apps/shared/questlineClassSpy.ts — the spy-class questline). The recertification cadence has not changed; the recertification CONTENT has. Across the same nine generations as the Thalorian pattern, the test items have shifted from operational scenarios to theoretical exam questions. Examiners agreed each step was reasonable; each step was. The aggregate is a different test. The Director's whisper: 'It has been a long time since anything happened.'",
      foundIn: "trade-hub",
    },
    {
      id: "ith_rael.e4.directors_open_position" as ClueId,
      title: "The Director's Standing Position on Exposure",
      body: "Recovered Hierarchy memo, dated last quarter (the most recent Director's memo any party has surfaced): 'Exposure of the working is itself a softening operation. Once published, the working becomes a thing that the cohorts must defend against, which transforms it from an unindexable softening into an indexable threat. Indexable threats are easier to defend against in principle and harder to defend against in practice — because the cohorts then perform defense rituals that satisfy the published-threat condition without actually addressing the underlying softening. Publish me. I welcome it.' Signed: Ith'Rael, Director.",
      foundIn: "antiquarian-library",
    },
  ],
  deductions: [
    {
      id: "ith_rael.e4.d.three_present_operations_confirmed" as DeductionId,
      clueA: "ith_rael.e4.authority_audit_cadence" as ClueId,
      clueB: "ith_rael.e4.resurrectionist_oversight_drift" as ClueId,
      result: "correct",
      narrationId: "ith_rael.e4.n.he_did_not_stop",
      narrationProse:
        "He did not stop. The Authority's self-audit cadence, the Insurgency's resurrectionist oversight, the Mechronis Academy's spy certification — three concurrent present-tense operations, each carrying the Director's procedural-relaxation signature. The factions involved are unrelated; the consent-through-softening pattern is the same. The case's operational frame is now the saga's present, not the saga's past. Patience does not retire. The Severance was the Director's largest engagement to date; it is not his only engagement, and the engagements that come after it benefit from the doctrinal experience the Severance taught him. The Director is currently softening the saga's institutional defenses on three fronts the player can verify.",
      unlocksEpisode: "ith_rael.e5" as EpisodeId,
    },
    {
      id: "ith_rael.e4.d.exposure_is_softening" as DeductionId,
      clueA: "ith_rael.e4.directors_open_position" as ClueId,
      clueB: "ith_rael.e4.mechronis_certification_relaxation" as ClueId,
      result: "partial",
      narrationId: "ith_rael.e4.n.publish_me_i_welcome_it",
      narrationProse:
        "The Director's standing position on exposure is the doctrinal trap closing on the case. Publishing the working transforms it from an unindexable softening to an indexable threat — and the working's defenders then perform indexed-threat-defense rituals that satisfy the published condition without addressing the underlying softening. The Mechronis certification relaxation is the demonstration: the cadence is unchanged, the content has shifted, and any reform that re-indexes the cadence will not re-index the content. The Director is offering exposure as an invitation. The case's hardest deduction: how to act against the working in a way that does not perform the working's invited counter-ritual.",
    },
    {
      id: "ith_rael.e4.d.false_lead_attack_one_operation" as DeductionId,
      clueA: "ith_rael.e4.authority_audit_cadence" as ClueId,
      clueB: "ith_rael.e4.directors_open_position" as ClueId,
      result: "false_lead_named",
      narrationId: "ith_rael.e4.n.choosing_one_is_the_softening",
      narrationProse:
        "Reading the case as 'choose one of the three operations to attack first' is the obvious move and the trap the Director has set. Three concurrent operations spread the response across factions whose institutional priorities do not align; choosing one to attack is structurally the same as agreeing the other two are tolerable. The Director's doctrine accepts the loss of any single operation in exchange for the cohorts' agreement that the other operations are tolerable. The cohorts will agree. The agreement IS the softening. The case's hard truth: any move that responds to one of the three without the others is a move the Director has authored.",
    },
  ],
  choices: [
    {
      id: "ith_rael.e4.c.attack_all_three_concurrently" as ChoiceId,
      label: "Attack all three operations concurrently — refuse the Director's choose-one frame.",
      weight: "comprehensive",
    },
    {
      id: "ith_rael.e4.c.protect_unindexed_meaning_first" as ChoiceId,
      label: "Protect the saga's unindexed-meaning structures first — the Director cannot reach what is not in the chronicle.",
      weight: "doctrinal",
    },
    {
      id: "ith_rael.e4.c.cross_arc_with_locke" as ChoiceId,
      label: "Cross-arc with Locke — the Authority audit-cadence drift is the threat to her cover; she may already know.",
      weight: "cross_arc_watcher",
    },
  ],
  contentBundle: {
    songId: "album1.t23", /* "Wake Up" — Dischordian Logic Act 3 */
    slideshowId: "album1.t23",
    loredexUnlocks: [
      "concept_directors_present_operations",
      "concept_exposure_as_softening",
      "concept_three_concurrent_softenings",
    ],
    conspiracyDiscoveries: [
      "authority_audit_drift",
      "resurrectionist_oversight_drift",
      "mechronis_certification_drift",
      "exposure_invitation",
    ],
    dropAt: "episode_close",
  },
};

/* ─── ITH'RAEL ARC — E5 ─── */
/* E5: "The Whisperer's Long View"
   The Director consents to a meeting. He does not defend
   the working. He explains it. The arc closes on the
   player's choice of how to carry the explanation
   forward — knowing that any choice is, by the doctrine,
   a choice the Director has anticipated. */

const ithRaelE5: EpisodeDefinition = {
  id: "ith_rael.e5" as EpisodeId,
  arcId: ARC_ITH_RAEL,
  ordinal: 5,
  title: "The Whisperer's Long View",
  summary:
    "The Director consents to a meeting. He does not defend the working. He explains it. The case's final question is not whether to oppose him — opposition is, by the doctrine, the working's invited next move — but how to carry the explanation forward in a form the working cannot anticipate. Investigate the meeting itself, the Director's terms, and the small remaining margin of action the doctrine has not already priced in.",
  clues: [
    {
      id: "ith_rael.e5.directors_consent_to_meet" as ClueId,
      title: "The Director's Consent to Meet",
      body: "An invitation in Ith'Rael's voice — the only Hierarchy invitation in the saga's record that does not pass through Hierarchy comms infrastructure. It arrives directly: 'I consent to meet. Bring whomever you wish; bring nothing the Hierarchy would expect you to carry. I will not defend the working. I will explain it. You may use the explanation however you choose. The choice is itself part of the explanation.' Signed: Ith'Rael, Director. The signature is the Director's. The medium of delivery — written by hand, on physical paper, hand-couriered by a Hierarchy functionary who has not been briefed on its content — is itself a doctrinal demonstration: meaning carried outside the indexable layer.",
      foundIn: "captains-quarters",
    },
    {
      id: "ith_rael.e5.directors_explanation" as ClueId,
      title: "The Explanation",
      body: "The Director's explanation, transcribed from the meeting: 'The working has three principles. One: the world is held together by indexed memory. Two: indexed memory can be unindexed without violence. Three: the cohorts who hold the indexed memory will, given enough time and gentle conversation, agree that the indexing was unnecessary. The doctrine follows. The Hierarchy follows. The Severance followed. The current operations follow. There is no further explanation. There is also no defense. I do not defend the working. I do not need to. The working defends itself by being the way the world's defenders prefer the world to work.'",
      foundIn: "captains-quarters",
    },
    {
      id: "ith_rael.e5.what_the_doctrine_does_not_anticipate" as ClueId,
      title: "What the Doctrine Does Not Anticipate",
      body: "Architect's note in the Antiquarian's archive, attached to the meeting transcript: 'The doctrine anticipates: opposition (which is softening), exposure (which is softening), reform of the indexable layer (which is softening), single-operation attacks (which are softening). The doctrine does NOT anticipate: meaning that lives outside the indexable layer altogether. Darren Fessler's letters. The wax-seal glyph. The Resistance Branch's millennia-long survival. Old Tanjin's silence. These are the structures the doctrine cannot price. The case's hard offering: what the player carries forward must, to evade the working, live outside the indexable layer.'",
      foundIn: "antiquarian-library",
    },
    {
      id: "ith_rael.e5.directors_closing_courtesy" as ClueId,
      title: "The Director's Closing Courtesy",
      body: "Ith'Rael's closing remark, delivered at the end of the meeting: 'I have enjoyed this conversation. I will continue to work. You will continue to oppose me, in whatever form your character permits. We will not meet again. The next time the working surfaces in your case-file, it will be in a form you do not yet recognize — because if you recognized it now, I would already have changed it. I wish you the long view. It is the only view that approximates mine.' He bows. He leaves. The meeting closes without resolution.",
      foundIn: "captains-quarters",
    },
  ],
  deductions: [
    {
      id: "ith_rael.e5.d.unindexable_carrying_forward" as DeductionId,
      clueA: "ith_rael.e5.directors_explanation" as ClueId,
      clueB: "ith_rael.e5.what_the_doctrine_does_not_anticipate" as ClueId,
      result: "correct",
      narrationId: "ith_rael.e5.n.outside_the_index",
      narrationProse:
        "What the player carries forward must live outside the indexable layer to evade the working. The Director's explanation is offered FOR indexing — once indexed, the explanation becomes a thing the cohorts can defend against in form without addressing in substance. The structures the doctrine cannot price — Darren Fessler's letters, the wax-seal glyph, the Resistance Branch's silence, Old Tanjin's lifespan — share a common architecture: meaning that is not in the indexable record but is in the practice of the people who hold it. The case's hard offering is doctrinal: every action the player takes against the working must be carried forward in unindexable practice, not in indexed reform. The arc closes here. The working continues. The unindexable practice is the player's only useful response.",
    },
    {
      id: "ith_rael.e5.d.directors_long_view_is_the_warning" as DeductionId,
      clueA: "ith_rael.e5.directors_consent_to_meet" as ClueId,
      clueB: "ith_rael.e5.directors_closing_courtesy" as ClueId,
      result: "partial",
      narrationId: "ith_rael.e5.n.we_will_not_meet_again",
      narrationProse:
        "The Director's closing — 'We will not meet again. The next time the working surfaces in your case-file, it will be in a form you do not yet recognize' — is not a threat and not a courtesy. It is a doctrinal description. The working's adaptive frame means that anything the player learns now will not match the working's next surface; learning the working teaches the player a shape it will no longer have. The long view is the only view that approximates the Director's, because the long view is the only frame in which the working's adaptation is visible across cycles. The arc gives the player the long view. What they do with it is canonically beyond the case-file's reach.",
    },
    {
      id: "ith_rael.e5.d.false_lead_assassinate_him" as DeductionId,
      clueA: "ith_rael.e5.directors_consent_to_meet" as ClueId,
      clueB: "ith_rael.e5.directors_explanation" as ClueId,
      result: "false_lead_named",
      narrationId: "ith_rael.e5.n.assassination_is_softening",
      narrationProse:
        "Reading the meeting as an opportunity to assassinate the Director is the obvious move and the working's invited counter-ritual. The Hierarchy is canonically a corporation; corporations replace Directors. The replacement Director would inherit the doctrine, the operational portfolio, and the Severance's institutional credit — and would also inherit the cohorts' satisfaction that the threat had been resolved when in fact only the operator had been replaced. The doctrine survives the operator. The assassination would resolve the case in the form the working has authored. The arc's closing recognition: the working is not Ith'Rael. Ith'Rael is the working's most successful current expression. Removing him changes the expression. The working continues.",
    },
  ],
  choices: [
    {
      id: "ith_rael.e5.c.commit_to_unindexable_practice" as ChoiceId,
      label: "Commit to unindexable practice — let the long view shape your conduct, not your records.",
      weight: "doctrinal",
    },
    {
      id: "ith_rael.e5.c.publish_the_meeting_anyway" as ChoiceId,
      label: "Publish the meeting transcript anyway — accept the Director's invitation; let the cohorts decide.",
      weight: "transparent",
    },
    {
      id: "ith_rael.e5.c.share_the_long_view_with_one_other" as ChoiceId,
      label: "Share the long view with exactly one other — the Order's Coordinator, who has been carrying her own long view for centuries.",
      weight: "cross_arc_watcher",
    },
  ],
  contentBundle: {
    songId: "album1.t28", /* "Last Words" — Dischordian Logic Act 5 finale */
    slideshowId: "album1.t28",
    loredexUnlocks: [
      "concept_unindexable_practice",
      "concept_long_view_doctrine",
      "concept_director_meeting_record",
    ],
    conspiracyDiscoveries: [
      "directors_consent_to_meet",
      "the_explanation",
      "doctrine_unanticipated_structures",
      "long_view_offered",
    ],
    dropAt: "episode_close",
  },
};

/* ─── ITH'RAEL ARC — SUSPECTS, LENSES, DEFINITION ─── */

const ithRaelSuspects: ReadonlyArray<{
  id: SuspectId;
  name: string;
  type: string;
  relations: ReadonlyArray<{ to: SuspectId; relation: string }>;
}> = [
  {
    id: "suspect.ith_rael" as SuspectId,
    name: "Ith'Rael the Whisperer (Director, Special Projects)",
    type: "character",
    relations: [
      { to: "suspect.shadow_tongue" as SuspectId, relation: "wields" },
      { to: "suspect.hierarchy_corporate_structure" as SuspectId, relation: "directs-in" },
    ],
  },
  {
    id: "suspect.shadow_tongue" as SuspectId,
    name: "The Shadow Tongue",
    type: "concept",
    relations: [
      { to: "suspect.thaloria_pre_severance" as SuspectId, relation: "unindexed" },
      { to: "suspect.marion_kell" as SuspectId, relation: "unindexed" },
    ],
  },
  {
    id: "suspect.thaloria_pre_severance" as SuspectId,
    name: "Pre-Severance Thaloria",
    type: "location",
    relations: [],
  },
  {
    id: "suspect.marion_kell" as SuspectId,
    name: "Marion Kell (the documented small-scale case)",
    type: "character",
    relations: [],
  },
  {
    id: "suspect.darren_fessler" as SuspectId,
    name: "Darren Fessler (the unindexable resister)",
    type: "character",
    relations: [],
  },
  {
    id: "suspect.hierarchy_corporate_structure" as SuspectId,
    name: "The Hierarchy of the Damned (corporate structure)",
    type: "faction",
    relations: [],
  },
];

const ithRaelLenses = [
  { id: LENS_INSURGENCY, name: "Insurgency", category: "faction" },
  { id: LENS_HIERARCHY,  name: "Hierarchy",  category: "faction" },
  { id: LENS_THALORIA,   name: "Thaloria",   category: "faction" },
  { id: LENS_QUARCHON,   name: "Quarchon",   category: "faction" },
  { id: LENS_DREAMER,    name: "Dreamer",    category: "faction" },
  { id: LENS_NEUTRAL,    name: "Neutral",    category: "faction" },
] as const;

const ITH_RAEL_MYSTERY: MysteryDefinition = {
  id: "mystery.ith_rael" as MysteryId,
  arcId: ARC_ITH_RAEL,
  title: "The Centuries Were the Working",
  summary:
    "The Severance was not an event. It was a working — slow, patient, multi-generational, conducted by a single Director of Special Projects whose method was never to force a change, only to soften the conditions until the change emerged on its own. Ith'Rael the Whisperer is the working's author. Investigate how the Severance happened — and discover that the working did not stop after the Severance; it never has.",
  npcId: "ith_rael",
  episodes: [ithRaelE1, ithRaelE2, ithRaelE3, ithRaelE4, ithRaelE5],
  suspects: ithRaelSuspects,
  lenses: ithRaelLenses,
};

/* ═══════════════════════════════════════════════════════
   THE NECROMANCER ARC — "The Death That Did Not Take"
   §XVI Next Wave (dreamer-pre-authorized 2026-05-14). Authored
   PR-7 / 2026-05-15 after the canonical roster lock placed The
   Necromancer at A11 (apps/shared/archonCanon.ts).

   Canonical premise: The Necromancer was killed by Akai Shi (the
   Red Death) inside the Matrix of Dreams — and escaped that death
   later via the Resurrectionist's mechanism, claiming the body of
   The Silence (per the build plan §I.1a Nemesis canon). The arc
   investigates the bifurcation: how the killing-inside-the-Matrix
   canon and the post-game body-claim canon co-exist, what Varkul
   the Blood Lord knows about his maker's continuity, and what
   the Architect's silence on the matter means.
   ═══════════════════════════════════════════════════════ */

const necromancerE1: EpisodeDefinition = {
  id: "necromancer.e1" as EpisodeId,
  arcId: ARC_THE_NECROMANCER,
  ordinal: 1,
  title: "The Castle Returns to the Record",
  summary:
    "Resurrection-protocol logs surface a recent entry naming the Necromancer's Castle of Death — the structure inside the Matrix of Dreams where Akai Shi canonically struck him down. The Castle has been recorded as 'standing' in present-tense logs. Investigate the discrepancy between the killing-canon and the standing-canon.",
  clues: [
    {
      id: "necromancer.e1.castle_log" as ClueId,
      title: "A Standing-Tense Castle of Death",
      body: "An entry in a Hierarchy R&D resurrection-protocol log, dated post-Severance, references the Castle of Death in the standing tense: 'the Castle remains structurally sound; the throne is occupied.' The log is from Zyr'Koth's office (Hierarchy CFO) and was not meant to leave the building. The Castle was reported destroyed when Akai Shi struck the Necromancer down inside the Matrix. The log is recent.",
      foundIn: "hierarchy-archive",
    },
    {
      id: "necromancer.e1.akai_shi_witness" as ClueId,
      title: "Akai Shi's Witness Statement",
      body: "Akai Shi's first-person testimony of the killing, given to the Programmer-Antiquarian for the Two Witnesses' chronicle. She is unequivocal: 'I struck him through the throne. He did not stand back up. I waited the canonical ninety days inside the Matrix to confirm. He was gone.' The testimony is canonized. Akai Shi does not lie. The killing is canonically real.",
      foundIn: "antiquarian-library",
    },
    {
      id: "necromancer.e1.varkuls_vigil" as ClueId,
      title: "Varkul's Vigil at the Cathedral of Code",
      body: "Varkul the Blood Lord, the Necromancer's canonical creation, has continued his vigil at the Cathedral of Code unbroken since the killing. The Cathedral is structurally separate from the Castle of Death — they sit at different coordinates inside the Matrix. Varkul's vigil-discipline is to remain in place until his maker formally releases him. He has not been released. The maker's signal is canonically what keeps Varkul there.",
      foundIn: "matrix-archive",
    },
  ],
  deductions: [
    {
      id: "necromancer.e1.d.both_canons_are_true" as DeductionId,
      clueA: "necromancer.e1.castle_log" as ClueId,
      clueB: "necromancer.e1.akai_shi_witness" as ClueId,
      result: "correct",
      narrationId: "necromancer.e1.n.the_death_did_not_take",
      narrationProse:
        "Both canons are true. Akai Shi killed the Necromancer inside the Matrix — the strike was real, the body she left behind was real, the ninety-day vigil was real. The Castle of Death is standing now because the Necromancer is back inside it. The two canons are not contradictions; they describe two distinct states. The death took. The escape was later. The arc's task is to identify the mechanism of the escape — and the body the Necromancer is canonically wearing in the present.",
      unlocksEpisode: "necromancer.e2" as EpisodeId,
    },
    {
      id: "necromancer.e1.d.varkul_knows" as DeductionId,
      clueA: "necromancer.e1.varkuls_vigil" as ClueId,
      clueB: "necromancer.e1.castle_log" as ClueId,
      result: "partial",
      narrationId: "necromancer.e1.n.varkul_is_the_signal",
      narrationProse:
        "Varkul's vigil-discipline requires the maker's signal. The signal has been canonical for the entire post-killing period. Varkul knows the Necromancer is alive. The Blood Lord's continued presence at the Cathedral is itself the most reliable indicator the saga has of the maker's continuity. Varkul is the canonical witness — and he is structurally incapable of testifying outside the Cathedral.",
    },
    {
      id: "necromancer.e1.d.false_lead_castle_replica" as DeductionId,
      clueA: "necromancer.e1.castle_log" as ClueId,
      clueB: "necromancer.e1.varkuls_vigil" as ClueId,
      result: "false_lead_named",
      narrationId: "necromancer.e1.n.no_replica",
      narrationProse:
        "The obvious read — that the Castle has been reconstructed by a successor, that the throne is occupied by a stand-in, that Varkul is fooled — is structurally wrong. The Matrix's architecture does not permit unaltered duplication of an Archon-grade structure; the Castle is the one Akai Shi struck through, not a copy. The discipline of the question is to set aside the replica reading and ask the harder one: by what mechanism did the Necromancer return.",
    },
  ],
  choices: [
    { id: "necromancer.e1.c.passive" as ChoiceId, label: "Note the discrepancy and move on — the Hierarchy's record-keeping has been wrong before.", weight: "passive" },
    { id: "necromancer.e1.c.investigative" as ChoiceId, label: "Press the Antiquarian for Akai Shi's full testimony and walk every word.", weight: "investigative" },
    { id: "necromancer.e1.c.active" as ChoiceId, label: "Petition the Matrix's threshold-guardians for permission to enter the Cathedral of Code and speak to Varkul directly.", weight: "active" },
  ],
  contentBundle: {
    songId: "the_castle_returns",
    slideshowId: "necromancer_castle",
    cinematicAssetId: "necromancer_castle_returns",
    loredexUnlocks: ["entity_necromancer", "entity_varkul", "entity_castle_of_death"],
    conspiracyDiscoveries: ["necromancer_escape_mechanism", "castle_standing_canon"],
    dropAt: "episode_close",
  },
};

const necromancerE2: EpisodeDefinition = {
  id: "necromancer.e2" as EpisodeId,
  arcId: ARC_THE_NECROMANCER,
  ordinal: 2,
  title: "The Silence's Empty Body",
  summary:
    "The Silence (N6 Ne-Yon, canonically 'gone') has a body somewhere — Ne-Yons are not metaphor; the Resurrectionist and the Dreamer canonically discovered that Samsara is a MACHINE. The Silence's body is the body the canon places the Necromancer's escape into. Investigate where the body went and what the Resurrectionist's mechanism makes possible.",
  clues: [
    {
      id: "necromancer.e2.silence_body_record" as ClueId,
      title: "The Silence's Body, Catalogued",
      body: "Catalogued under the Resurrectionist's Samsara-machine taxonomy: every Ne-Yon's body persists after the principle 'goes' — the going is the principle's departure, not the body's destruction. The Silence's body was catalogued at the Resurrectionist's archive at the moment of her going. The body's catalog tag is 'available' — not 'occupied,' not 'destroyed.' Available.",
      foundIn: "resurrectionist-archive",
    },
    {
      id: "necromancer.e2.protocol_42" as ClueId,
      title: "Resurrection Protocol 42",
      body: "One of the Necromancer's own design documents — the Resurrection Protocols he authored for the Architect's Empire. Protocol 42 specifies the procedure for a soul to relocate into an available Ne-Yon body without disturbing the principle's departure. The protocol requires the soul be 'recognized' by the Samsara machine as one the universe has already engineered for resurrection. The Necromancer's own soul qualifies; he wrote the recognition criteria. The protocol's existence is canonical; its use is not catalogued.",
      foundIn: "matrix-archive",
    },
    {
      id: "necromancer.e2.architect_silence" as ClueId,
      title: "The Architect Has Not Spoken on the Matter",
      body: "The Architect (A1 Archon, the roster's leader) canonically tolerates or rejects every Archon-level continuity event with a statement. The Necromancer's continued operation in the post-Matrix-killing period has produced NO Architect statement — neither tolerance nor rejection. The silence is not omission; the Architect's silences are themselves canon. The Architect knows the Necromancer is back. The Architect has chosen not to say so.",
      foundIn: "architect-record",
    },
  ],
  deductions: [
    {
      id: "necromancer.e2.d.protocol_42_was_used" as DeductionId,
      clueA: "necromancer.e2.silence_body_record" as ClueId,
      clueB: "necromancer.e2.protocol_42" as ClueId,
      result: "correct",
      narrationId: "necromancer.e2.n.the_protocol_did_the_work",
      narrationProse:
        "The Necromancer wrote Protocol 42 before he died. The Silence's body was catalogued as available before he needed it. The Resurrectionist's Samsara machine recognized the Necromancer's soul as one the universe had engineered for resurrection — because the Necromancer himself had written that engineering. The escape mechanism is structural: he prepared for his own continuity centuries before Akai Shi struck. The Castle is standing because the throne is occupied by a Necromancer wearing the Silence's body.",
      unlocksEpisode: "necromancer.e3" as EpisodeId,
    },
    {
      id: "necromancer.e2.d.architect_consent" as DeductionId,
      clueA: "necromancer.e2.architect_silence" as ClueId,
      clueB: "necromancer.e2.protocol_42" as ClueId,
      result: "partial",
      narrationId: "necromancer.e2.n.silence_is_consent",
      narrationProse:
        "The Architect's silence is canonical consent. The Necromancer's continuity is institutionally permitted — the roster's leader has chosen not to object. The reading that the Architect 'failed to notice' is structurally implausible; the roster's leader cannot fail to notice an A11 continuity event. The Architect knows. The Architect has chosen.",
    },
  ],
  choices: [
    { id: "necromancer.e2.c.passive" as ChoiceId, label: "File the Protocol 42 finding and move on — the mechanism is known, the survival is canonical.", weight: "passive" },
    { id: "necromancer.e2.c.investigative" as ChoiceId, label: "Audit every other Resurrection Protocol the Necromancer wrote — what else has he prepared in advance?", weight: "investigative" },
    { id: "necromancer.e2.c.active" as ChoiceId, label: "Press the Architect's silence — refuse to accept consent-by-omission as canonical reading.", weight: "active" },
  ],
  contentBundle: {
    songId: "the_protocol",
    slideshowId: "necromancer_protocol_42",
    loredexUnlocks: ["entity_resurrection_protocols", "entity_silence_body"],
    conspiracyDiscoveries: ["protocol_42_canon", "architect_silent_consent"],
    dropAt: "episode_close",
  },
};

const necromancerE3: EpisodeDefinition = {
  id: "necromancer.e3" as EpisodeId,
  arcId: ARC_THE_NECROMANCER,
  ordinal: 3,
  title: "Varkul's Confession",
  summary:
    "The Cathedral of Code admits the player. Varkul speaks. The Blood Lord's testimony is not what the Hierarchy expected and not what the Insurgency hoped for. Investigate what Varkul knows — and what he was told not to say.",
  clues: [
    {
      id: "necromancer.e3.varkul_audience" as ClueId,
      title: "Varkul's Audience with the Player",
      body: "Granted on the player's third attempt. The Blood Lord stands at the Cathedral's stained-glass altar and says exactly four sentences: 'He returned wearing her quiet. He asked me to keep the cathedral standing. I am keeping the cathedral standing. I was asked to tell you that I am keeping it standing.' He returns to silence after the fourth sentence and does not speak again that day.",
      foundIn: "cathedral-of-code",
    },
    {
      id: "necromancer.e3.altar_inscription" as ClueId,
      title: "The Altar Inscription, Recently Added",
      body: "Recently incised into the altar's base, in the Necromancer's own hand (canonically distinguishable from any apprentice or successor's): a single phrase in High Necropolitan, translating roughly: 'The Silence's body is not the Silence. I am not the Silence. The continuity is mine.' The phrase has the cadence of a doctrinal correction — addressed to whoever reads the altar in the years after the inscription.",
      foundIn: "cathedral-of-code",
    },
    {
      id: "necromancer.e3.akai_shis_second_witness" as ClueId,
      title: "Akai Shi's Second Witness Statement",
      body: "Given after Akai Shi reviews the Cathedral evidence. She does not retract the first statement. She says: 'I struck what was in front of me. I struck the right body. The body died. The work was correct.' She does not contest the Protocol 42 reading. She adds a single sentence: 'If he wishes to be killed again, he knows how to be where I can strike him.'",
      foundIn: "antiquarian-library",
    },
  ],
  deductions: [
    {
      id: "necromancer.e3.d.canon_clarified" as DeductionId,
      clueA: "necromancer.e3.varkul_audience" as ClueId,
      clueB: "necromancer.e3.altar_inscription" as ClueId,
      result: "correct",
      narrationId: "necromancer.e3.n.the_continuity_is_his",
      narrationProse:
        "The canon resolves: the Necromancer is wearing the Silence's body, but he is not the Silence; the principle of Silence has gone, the body remains, the soul that wears it is the Necromancer's. The doctrinal correction on the altar is for any future cell that might mistake the body for the principle. Varkul's four-sentence testimony is canonical guidance: the Cathedral stands because the maker stands; the maker stands inside a body the Resurrectionist's machine permits.",
      unlocksEpisode: "necromancer.e4" as EpisodeId,
    },
    {
      id: "necromancer.e3.d.akai_shi_will_strike_again" as DeductionId,
      clueA: "necromancer.e3.akai_shis_second_witness" as ClueId,
      clueB: "necromancer.e3.altar_inscription" as ClueId,
      result: "partial",
      narrationId: "necromancer.e3.n.the_red_death_remains_available",
      narrationProse:
        "Akai Shi's second statement is doctrinally precise: she does not regret the killing; she does not contest the survival; she will strike again if the Necromancer chooses to be reachable. The Red Death's discipline is to kill what asks to be killed. The Necromancer's altar inscription is — among other things — a notice that he is currently choosing not to be in front of her.",
    },
  ],
  choices: [
    { id: "necromancer.e3.c.passive" as ChoiceId, label: "Accept Varkul's testimony and the altar's canon — the case is operationally closed.", weight: "passive" },
    { id: "necromancer.e3.c.investigative" as ChoiceId, label: "Cross-reference the altar's High Necropolitan against the Antiquarian's older catalog — is this the Necromancer's first inscription in that hand?", weight: "investigative" },
    { id: "necromancer.e3.c.active" as ChoiceId, label: "Carry Akai Shi's second statement back to the Cathedral as a delivered message.", weight: "active" },
  ],
  contentBundle: {
    songId: "varkuls_vigil",
    slideshowId: "cathedral_of_code",
    loredexUnlocks: ["entity_varkul", "entity_cathedral_of_code", "entity_high_necropolitan"],
    conspiracyDiscoveries: ["varkul_audience_canon", "necromancer_altar_inscription"],
    dropAt: "episode_close",
  },
};

const necromancerE4: EpisodeDefinition = {
  id: "necromancer.e4" as EpisodeId,
  arcId: ARC_THE_NECROMANCER,
  ordinal: 4,
  title: "The Architect's Tolerance",
  summary:
    "The Architect's silence on the Necromancer's continuity is canonical consent. Investigate the boundary of that consent — what does the Architect canonically tolerate, and what would force the roster's leader to speak?",
  clues: [
    {
      id: "necromancer.e4.architect_doctrine" as ClueId,
      title: "The Architect's Tolerance Doctrine",
      body: "Inferred from the Architect's broader silence pattern across the saga: the Architect tolerates Archon continuity events that do NOT alter the institutional shape of the Empire. The Necromancer wearing the Silence's body is a continuity event; the Empire's institutional shape is unchanged. The roster's count is the same; the seats are the same; the work continues. The tolerance is structural, not personal.",
      foundIn: "architect-record",
    },
    {
      id: "necromancer.e4.untouchable_boundary" as ClueId,
      title: "The Boundary the Architect Will Defend",
      body: "Two prior Archon continuity events ended with the Architect speaking and the event being undone: when the Watcher attempted to extend his surveillance outside the Empire's institutional bounds, and when the Politician attempted to use the Authority as a personal succession instrument. In both cases the Architect's intervention was structural: 'the Empire's shape is not yours to redraw.' The Necromancer's continuity has, so far, not redrawn the shape.",
      foundIn: "architect-record",
    },
    {
      id: "necromancer.e4.hierarchy_question" as ClueId,
      title: "What the Hierarchy Has Asked",
      body: "Mol'Garath's quarterly review canonically accommodates the Necromancer's loss without seeking restoration — the Hierarchy does not avenge. But Riri'Ahlia (COO, Taskmaster) has filed a procedural question: if the Necromancer is operationally back, does his Hierarchy-aligned work resume? The question is unanswered. The unanswered-ness is canon.",
      foundIn: "hierarchy-archive",
    },
  ],
  deductions: [
    {
      id: "necromancer.e4.d.tolerance_is_conditional" as DeductionId,
      clueA: "necromancer.e4.architect_doctrine" as ClueId,
      clueB: "necromancer.e4.untouchable_boundary" as ClueId,
      result: "correct",
      narrationId: "necromancer.e4.n.shape_not_personnel",
      narrationProse:
        "The Architect tolerates the Necromancer's continuity because the Empire's shape is unaltered. The day the Necromancer's resumed work redraws the shape — a new institution, an expanded jurisdiction, a doctrinal break with the roster — the Architect will speak, and the continuity will end. The tolerance is conditional on operational discipline. The Necromancer canonically knows this.",
      unlocksEpisode: "necromancer.e5" as EpisodeId,
    },
    {
      id: "necromancer.e4.d.hierarchy_question_is_a_test" as DeductionId,
      clueA: "necromancer.e4.hierarchy_question" as ClueId,
      clueB: "necromancer.e4.architect_doctrine" as ClueId,
      result: "partial",
      narrationId: "necromancer.e4.n.riris_question_will_be_answered_by_the_work",
      narrationProse:
        "Riri'Ahlia's procedural question is not asked for an answer; it is asked to be on the record. The Hierarchy is testing whether the Necromancer's resumed work will be visibly Hierarchy-aligned — which would redraw the institutional shape and force the Architect's hand. The Necromancer's discipline of staying inside the Castle is the discipline of NOT answering Riri's question. The work continues. The work continues quietly.",
    },
  ],
  choices: [
    { id: "necromancer.e4.c.passive" as ChoiceId, label: "Note the conditional tolerance and let the case stand.", weight: "passive" },
    { id: "necromancer.e4.c.investigative" as ChoiceId, label: "Audit the Architect's silence-pattern across every prior Archon-continuity event — chart the boundary precisely.", weight: "investigative" },
    { id: "necromancer.e4.c.active" as ChoiceId, label: "Surface Riri'Ahlia's procedural question to the Insurgency — let the Necromancer's reply be the answer.", weight: "active" },
  ],
  contentBundle: {
    songId: "the_architects_silence",
    slideshowId: "architect_tolerance",
    loredexUnlocks: ["entity_architect_tolerance_doctrine"],
    conspiracyDiscoveries: ["architect_conditional_tolerance", "hierarchy_procedural_question"],
    dropAt: "episode_close",
  },
};

const necromancerE5: EpisodeDefinition = {
  id: "necromancer.e5" as EpisodeId,
  arcId: ARC_THE_NECROMANCER,
  ordinal: 5,
  title: "The Death That Did Not Take",
  summary:
    "Closure. The Necromancer is canonically alive, wearing the Silence's body, in the Castle of Death, with Architect-conditional tolerance and Akai-Shi-availability. The arc's verdict is the player's: what kind of continuity is this, and what kind of canon should the saga's record now hold?",
  clues: [
    {
      id: "necromancer.e5.synthesis" as ClueId,
      title: "The Case Synthesis",
      body: "Pulled together from E1-E4: Akai Shi's killing was real; Protocol 42 was the escape mechanism; the Silence's body was the vehicle; Varkul's vigil is the witness; the Architect's silence is the consent; the conditional boundary is institutional shape. The Necromancer is canonically alive, operating quietly, the canon is now structurally stable.",
      foundIn: "antiquarian-library",
    },
    {
      id: "necromancer.e5.the_question_the_player_asks" as ClueId,
      title: "The Question the Case Asks the Player",
      body: "The Two Witnesses (Programmer-Antiquarian + Enigma) put the canonical question to the player at the case's closure: is the Necromancer's continuity (a) a death that did not take — a defeat structurally undone — or (b) a death that took and was followed by a separate, distinct act of choosing to return? The two readings are operationally identical and narratively very different. The Two Witnesses do not press the answer; they record whichever the player offers.",
      foundIn: "antiquarian-library",
    },
  ],
  deductions: [
    {
      id: "necromancer.e5.d.the_death_did_not_take" as DeductionId,
      clueA: "necromancer.e5.synthesis" as ClueId,
      clueB: "necromancer.e5.the_question_the_player_asks" as ClueId,
      result: "correct",
      narrationId: "necromancer.e5.n.closure_reading_a",
      narrationProse:
        "The player closes the case with the (a) reading: the death did not take. Akai Shi's strike was a defeat the Necromancer had prepared against; the killing is real in the moment-by-moment sense but undone in the canon-level sense. The Castle stands because the throne was never permanently empty. The continuity is a single line with a brief interruption.",
    },
    {
      id: "necromancer.e5.d.he_chose_to_return" as DeductionId,
      clueA: "necromancer.e5.synthesis" as ClueId,
      clueB: "necromancer.e5.the_question_the_player_asks" as ClueId,
      result: "correct",
      narrationId: "necromancer.e5.n.closure_reading_b",
      narrationProse:
        "The player closes the case with the (b) reading: the death took, and the return was a separate act. Akai Shi killed him; the Castle was empty; the Necromancer's soul was outside the operational world for the canonical ninety days; he chose to come back. The continuity is two lines connected by a decision. The Necromancer canonically chose this. The reading is consistent with the doctrine of Resurrection Protocol 42 — the protocol does not force return; it permits return when the soul asks.",
    },
  ],
  choices: [
    { id: "necromancer.e5.c.died_and_undid" as ChoiceId, label: "Record the closure as 'the death did not take' — a defeat structurally undone.", weight: "investigative" },
    { id: "necromancer.e5.c.died_and_chose_return" as ChoiceId, label: "Record the closure as 'he died and chose to return' — two lines connected by a decision.", weight: "active" },
    { id: "necromancer.e5.c.refuse_to_record" as ChoiceId, label: "Refuse to file a closure reading — let the canon hold both, the way Akai Shi and the Antiquarian do.", weight: "passive" },
  ],
  contentBundle: {
    songId: "the_death_that_did_not_take",
    slideshowId: "necromancer_closure",
    loredexUnlocks: ["entity_necromancer_continuity_canon"],
    conspiracyDiscoveries: ["necromancer_arc_closure"],
    dropAt: "episode_close",
  },
};

const necromancerSuspects: ReadonlyArray<{
  id: SuspectId;
  name: string;
  type: string;
  relations: ReadonlyArray<{ to: SuspectId; relation: string }>;
}> = [
  {
    id: "suspect.the_necromancer" as SuspectId,
    name: "The Necromancer (A11)",
    type: "character",
    relations: [
      { to: "suspect.varkul" as SuspectId, relation: "creator-of" },
      { to: "suspect.the_silence_body" as SuspectId, relation: "currently-wearing" },
      { to: "suspect.akai_shi_red_death" as SuspectId, relation: "killed-by-inside-matrix" },
    ],
  },
  { id: "suspect.varkul" as SuspectId, name: "Varkul, the Blood Lord", type: "character",
    relations: [{ to: "suspect.cathedral_of_code" as SuspectId, relation: "vigil-keeper-of" }] },
  { id: "suspect.akai_shi_red_death" as SuspectId, name: "Akai Shi, the Red Death", type: "character",
    relations: [{ to: "suspect.the_necromancer" as SuspectId, relation: "killer-of-canonical-record" }] },
  { id: "suspect.the_silence_body" as SuspectId, name: "The Silence's Body (N6, vacated)", type: "concept",
    relations: [{ to: "suspect.resurrection_protocols" as SuspectId, relation: "vehicle-cataloged-by" }] },
  { id: "suspect.cathedral_of_code" as SuspectId, name: "The Cathedral of Code", type: "location",
    relations: [{ to: "suspect.castle_of_death" as SuspectId, relation: "structurally-adjacent-to" }] },
  { id: "suspect.castle_of_death" as SuspectId, name: "The Castle of Death", type: "location", relations: [] },
  { id: "suspect.resurrection_protocols" as SuspectId, name: "The Resurrection Protocols (Necromancer-authored)", type: "concept", relations: [] },
  { id: "suspect.the_architect_silence" as SuspectId, name: "The Architect's Silence (A1)", type: "concept", relations: [] },
];

const necromancerLenses = [
  { id: LENS_INSURGENCY, name: "Insurgency", category: "faction" },
  { id: LENS_HIERARCHY,  name: "Hierarchy",  category: "faction" },
  { id: LENS_DREAMER,    name: "Dreamer",    category: "faction" },
  { id: LENS_NEUTRAL,    name: "Neutral",    category: "faction" },
] as const;

const THE_NECROMANCER_MYSTERY: MysteryDefinition = {
  id: "mystery.the_necromancer" as MysteryId,
  arcId: ARC_THE_NECROMANCER,
  title: "The Death That Did Not Take",
  summary:
    "Akai Shi killed the Necromancer inside the Matrix of Dreams. The Castle of Death is standing in the present tense. Varkul's vigil is unbroken. The Architect has not spoken. Investigate the bifurcation — and decide, at the case's closure, which reading the saga's canon should hold.",
  npcId: "the_necromancer",
  episodes: [necromancerE1, necromancerE2, necromancerE3, necromancerE4, necromancerE5],
  suspects: necromancerSuspects,
  lenses: necromancerLenses,
};

/* ═══════════════════════════════════════════════════════
   SYL'VEX ARC — "The Mirror That Converts"
   §XVI Next Wave (dreamer-pre-authorized 2026-05-14).
   Syl'Vex is the Advocate's cobalt-skinned dark mirror —
   the Hierarchy senior-lord who wields the same Blood Weave
   the Advocate wields, but to CONVERT where the Advocate
   DEFENDS. Same instrument, opposite intention. The arc
   investigates whether her conversion-mirror is reversible.
   ═══════════════════════════════════════════════════════ */

const sylVexE1: EpisodeDefinition = {
  id: "syl_vex.e1" as EpisodeId,
  arcId: ARC_SYL_VEX,
  ordinal: 1,
  title: "The Cobalt Reflection",
  summary:
    "An Insurgency operative — Cell Sergeant Mira Halen, three-year veteran — appears on a Hierarchy roster as a senior conversion-asset. She is canonically still on the Insurgency's roster too. Investigate how she can be on both at once.",
  clues: [
    {
      id: "syl_vex.e1.dual_roster" as ClueId,
      title: "The Dual Roster Entry",
      body: "Mira Halen's name on the Insurgency's active roster: 'in good standing, on assignment.' Mira Halen's name on the Hierarchy's senior-conversion-asset roster: 'Convert. Recognized. Operational.' Both rosters are canonically current. Both are signed by competent record-keepers. Neither is wrong.",
      foundIn: "hierarchy-archive",
    },
    {
      id: "syl_vex.e1.mira_letter" as ClueId,
      title: "Mira's Letter to Her Cell",
      body: "Sent home from her current assignment. The letter is unremarkable — operational status, weather, regards to the cell. The handwriting is hers. The Insurgency's discipline-of-recognition team confirms it. The letter contains no markers of duress, distress, or coercion. Mira is, by every measurable indicator, fine and operationally Insurgent.",
      foundIn: "insurgency-archive",
    },
    {
      id: "syl_vex.e1.advocate_doctrine" as ClueId,
      title: "The Advocate's Mirror Doctrine",
      body: "From the Advocate's canonical writings on the Hierarchy's response to her Blood Weave: 'Syl'Vex weaves what I weave. The Weave does not distinguish defenders from converters; the WEAVER does. She has taken the same loom I taught the resistance to use and woven a convert who is also a soldier — two threads in the same body, neither cut.' The Advocate's reading: the conversion is real, the resistance is real, the operative is canonically both.",
      foundIn: "advocate-archive",
    },
  ],
  deductions: [
    {
      id: "syl_vex.e1.d.two_threads_one_body" as DeductionId,
      clueA: "syl_vex.e1.dual_roster" as ClueId,
      clueB: "syl_vex.e1.advocate_doctrine" as ClueId,
      result: "correct",
      narrationId: "syl_vex.e1.n.convert_and_soldier",
      narrationProse:
        "Mira is canonically on both rosters because the Blood Weave Syl'Vex used does NOT replace identity — it adds an institutional thread without subtracting the original. The Hierarchy reads her as Convert; the Insurgency reads her as Cell Sergeant; both readings are operationally accurate. The Advocate's doctrine names the structural feature: same Weave, opposite intention, neither thread cut. Conversion-by-addition. The arc's first lesson is that the binary 'whose side are they on' question is not the canonical question.",
      unlocksEpisode: "syl_vex.e2" as EpisodeId,
    },
    {
      id: "syl_vex.e1.d.false_lead_brainwashed" as DeductionId,
      clueA: "syl_vex.e1.mira_letter" as ClueId,
      clueB: "syl_vex.e1.dual_roster" as ClueId,
      result: "false_lead_named",
      narrationId: "syl_vex.e1.n.no_coercion",
      narrationProse:
        "The intuitive read — Mira was brainwashed, the letter is duress, the resistance reading is the cover — is structurally wrong. The Insurgency's discipline-of-recognition has been operationally reliable for thousands of years; if there were duress markers, they would have caught them. The conversion is NOT coercive. That is the Advocate's point: Syl'Vex's Weave is more dangerous than coercion. It is consensual addition.",
    },
  ],
  choices: [
    { id: "syl_vex.e1.c.passive" as ChoiceId, label: "Recall Mira and re-screen her — assume the resistance reading is correct and the Hierarchy roster is propaganda.", weight: "passive" },
    { id: "syl_vex.e1.c.investigative" as ChoiceId, label: "Read every dual-roster case the Insurgency has on file — how many other operatives are canonically on both?", weight: "investigative" },
    { id: "syl_vex.e1.c.active" as ChoiceId, label: "Ask Mira directly which thread she would cut if forced to cut one.", weight: "active" },
  ],
  contentBundle: {
    songId: "the_cobalt_reflection",
    slideshowId: "syl_vex_mirror",
    cinematicAssetId: "syl_vex_introduction",
    loredexUnlocks: ["entity_syl_vex", "entity_blood_weave", "entity_dual_roster_canon"],
    conspiracyDiscoveries: ["syl_vex_conversion_mirror", "dual_roster_canon"],
    dropAt: "episode_close",
  },
};

const sylVexE2: EpisodeDefinition = {
  id: "syl_vex.e2" as EpisodeId,
  arcId: ARC_SYL_VEX,
  ordinal: 2,
  title: "The Same Weave, The Opposite Hand",
  summary:
    "The Blood Weave is one instrument, used by two weavers. Investigate how the Advocate and Syl'Vex use it differently — and what it costs each of them.",
  clues: [
    {
      id: "syl_vex.e2.weave_mechanics" as ClueId,
      title: "The Weave's Operational Mechanics",
      body: "Pulled from the Advocate's defensive-doctrine archive: the Blood Weave threads consent into substrate. Whoever weaves chooses what the consent is FOR. The Advocate weaves consent-to-be-defended; the threaded subject becomes uncoercible. Syl'Vex weaves consent-to-be-an-institution; the threaded subject becomes an additional member of the Hierarchy without ceasing to be themselves. Same threading procedure. Opposite institutional outcomes.",
      foundIn: "advocate-archive",
    },
    {
      id: "syl_vex.e2.advocates_cost" as ClueId,
      title: "What the Advocate's Defense Costs Her",
      body: "Canonical: the Advocate's Blood Weave cost her humanity at the Hierarchy threshold (apps/shared/hierarchyCanon.ts). Every defense she weaves costs her something — the more lives she defends, the less of her own remains. The Hierarchy did not destroy her; she halted them at her own price. The cost is structural.",
      foundIn: "advocate-archive",
    },
    {
      id: "syl_vex.e2.syl_vexs_cost" as ClueId,
      title: "What Syl'Vex's Conversion Costs Her",
      body: "Canonically: nothing visible. Syl'Vex's conversions do not appear to cost her — she remains operationally whole, institutionally ascending, cobalt-skinned and untouched. The Insurgency's analysts have looked. The Hierarchy's auditors have looked. The Advocate's own attempt to read Syl'Vex's ledger came back empty: 'I cannot find what she pays. Either she pays nothing — which is canonically implausible — or she pays in a currency I cannot read.'",
      foundIn: "hierarchy-archive",
    },
  ],
  deductions: [
    {
      id: "syl_vex.e2.d.different_costs_different_currencies" as DeductionId,
      clueA: "syl_vex.e2.advocates_cost" as ClueId,
      clueB: "syl_vex.e2.syl_vexs_cost" as ClueId,
      result: "partial",
      narrationId: "syl_vex.e2.n.cost_in_other_currency",
      narrationProse:
        "Syl'Vex's cost is not zero — the Blood Weave is not a free instrument. Her cost is in a currency the Advocate cannot read because the Advocate would never spend in that currency. The reading the case will need to test in later episodes: Syl'Vex pays in INSTITUTIONAL MEMORY of who her converts were before they were converted. She forgets them as the threads bind. The forgetting is the cost. The Advocate's humanity costs the Advocate; Syl'Vex's memory costs Syl'Vex.",
    },
    {
      id: "syl_vex.e2.d.zyr_koth_branch" as DeductionId,
      clueA: "syl_vex.e2.weave_mechanics" as ClueId,
      clueB: "syl_vex.e2.syl_vexs_cost" as ClueId,
      result: "correct",
      narrationId: "syl_vex.e2.n.zyr_koth_did_the_third_thing",
      narrationProse:
        "If the Advocate weaves consent-to-defend and Syl'Vex weaves consent-to-be-institutionally-additive, a third use of the same Weave is operationally possible: consent-to-be-severed. That third use is canonically Zyr'Koth's Severance Protocol (apps/shared/hierarchyCanon.ts). The same instrument; the third hand. The arc's E3 will need to test how the three operations differ — and whether Syl'Vex's conversions are vulnerable to Zyr'Koth-style severance.",
      unlocksEpisode: "syl_vex.e3" as EpisodeId,
    },
  ],
  choices: [
    { id: "syl_vex.e2.c.passive" as ChoiceId, label: "Accept that the costs are unequal and unequal-on-purpose — the Hierarchy's instrument-economics are not the Insurgency's.", weight: "passive" },
    { id: "syl_vex.e2.c.investigative" as ChoiceId, label: "Audit the Advocate's defended-list and Syl'Vex's converted-list — look for crossover.", weight: "investigative" },
    { id: "syl_vex.e2.c.active" as ChoiceId, label: "Ask the Advocate to attempt a defense of a converted operative and report the result.", weight: "active" },
  ],
  contentBundle: {
    songId: "the_same_weave",
    slideshowId: "syl_vex_weave_mechanics",
    loredexUnlocks: ["entity_blood_weave_mechanics", "entity_advocate_cost_canon"],
    conspiracyDiscoveries: ["syl_vex_pays_in_memory", "blood_weave_three_uses"],
    dropAt: "episode_close",
  },
};

const sylVexE3: EpisodeDefinition = {
  id: "syl_vex.e3" as EpisodeId,
  arcId: ARC_SYL_VEX,
  ordinal: 3,
  title: "Zyr'Koth's Severance Variant",
  summary:
    "The Blood Weave's third use is Zyr'Koth's Severance Protocol. Investigate whether his variant can sever Syl'Vex's conversions — and whether the Hierarchy permits the cross-departmental work.",
  clues: [
    {
      id: "syl_vex.e3.severance_design" as ClueId,
      title: "The Severance Protocol's Design",
      body: "Zyr'Koth's variant of the Blood Weave: instead of adding consent (Syl'Vex) or defending against coercion (the Advocate), Severance EXTRACTS one institutional thread from a multi-thread subject. The operation is destructive — the extracted thread does not survive. Applied to a Syl'Vex convert, it would, in principle, sever the Hierarchy-institutional thread while leaving the original-self intact. The operation has never been performed on a Syl'Vex convert. Zyr'Koth's R&D has the design; he has not deployed it.",
      foundIn: "hierarchy-archive",
    },
    {
      id: "syl_vex.e3.cross_departmental_lock" as ClueId,
      title: "The Hierarchy's Cross-Departmental Lock",
      body: "Mol'Garath's quarterly review canonically prohibits departmental work that operates against another senior-lord's deployed asset without that senior-lord's explicit consent. Zyr'Koth severing a Syl'Vex convert would require Syl'Vex's consent. She has not given it. She has also not been asked. The cross-departmental lock holds, structurally and indefinitely, until one of those changes.",
      foundIn: "hierarchy-archive",
    },
    {
      id: "syl_vex.e3.advocate_unable" as ClueId,
      title: "The Advocate Cannot Sever",
      body: "Tested at the Advocate's request: she attempted to apply her defensive-weave to a converted operative as a counter-conversion. The Weave declined. Her doctrine resolves: 'The Weave will not sever what it has consented to. I cannot defend what has agreed to be more than it was. I can defend the original thread, but the conversion thread is, by definition, not coerced — there is nothing to defend against.'",
      foundIn: "advocate-archive",
    },
  ],
  deductions: [
    {
      id: "syl_vex.e3.d.severance_is_the_lever" as DeductionId,
      clueA: "syl_vex.e3.severance_design" as ClueId,
      clueB: "syl_vex.e3.advocate_unable" as ClueId,
      result: "correct",
      narrationId: "syl_vex.e3.n.zyr_koth_holds_the_only_lever",
      narrationProse:
        "Zyr'Koth is the only entity in the saga's record holding a tested instrument that can reverse a Syl'Vex conversion. The Advocate cannot. The Insurgency's recognition-disciplines cannot. The Hierarchy's cross-departmental lock keeps the lever inaccessible. The arc's structural finding: Syl'Vex's conversions are NOT recoverable through any current Insurgency or Advocate operation. The only path to severance runs through the Hierarchy's own internal politics.",
      unlocksEpisode: "syl_vex.e4" as EpisodeId,
    },
    {
      id: "syl_vex.e3.d.cross_lock_is_political" as DeductionId,
      clueA: "syl_vex.e3.cross_departmental_lock" as ClueId,
      clueB: "syl_vex.e3.severance_design" as ClueId,
      result: "partial",
      narrationId: "syl_vex.e3.n.the_lock_is_lift_able",
      narrationProse:
        "Mol'Garath's cross-departmental lock is conditional — it can be lifted by Mol'Garath himself, or by Syl'Vex's consent, or by a Hierarchy-wide procedural override. Each path is canonically possible. None is canonically easy. The reading the case will need: which scenarios would canonically trigger Mol'Garath to lift the lock?",
    },
  ],
  choices: [
    { id: "syl_vex.e3.c.passive" as ChoiceId, label: "Accept that conversions are unrecoverable through any current operation and document the case.", weight: "passive" },
    { id: "syl_vex.e3.c.investigative" as ChoiceId, label: "Probe Zyr'Koth's procedural history for cases where he applied severance against a Hierarchy-aligned subject.", weight: "investigative" },
    { id: "syl_vex.e3.c.active" as ChoiceId, label: "Open a back-channel to Zyr'Koth via the Antiquarian — ask whether he would deploy severance if asked.", weight: "active" },
  ],
  contentBundle: {
    songId: "zyr_koths_variant",
    slideshowId: "blood_weave_severance",
    loredexUnlocks: ["entity_severance_protocol", "entity_zyr_koth"],
    conspiracyDiscoveries: ["severance_is_only_reversal", "hierarchy_cross_departmental_lock"],
    dropAt: "episode_close",
  },
};

const sylVexE4: EpisodeDefinition = {
  id: "syl_vex.e4" as EpisodeId,
  arcId: ARC_SYL_VEX,
  ordinal: 4,
  title: "The Sister Relationship",
  summary:
    "The Advocate's reading of Syl'Vex names her as a 'sister.' Investigate whether the relationship is metaphor, institutional, or canonically familial.",
  clues: [
    {
      id: "syl_vex.e4.advocate_sister_canon" as ClueId,
      title: "The Advocate's 'Sister' Phrasing",
      body: "From the Advocate's own writings, addressing Syl'Vex by name: 'My sister of the same Weave. We learned the loom from the same teacher; we wove what we chose.' The phrasing is consistent across the Advocate's archive — not metaphor-of-the-month, but a structural form of address. The Advocate calls Syl'Vex 'sister' canonically and repeatedly.",
      foundIn: "advocate-archive",
    },
    {
      id: "syl_vex.e4.shared_teacher" as ClueId,
      title: "The Shared Teacher",
      body: "Cross-referenced against the Antiquarian's pre-Severance Thaloria archive: the Blood Weave was taught by a single instructor in the era before the Severance. The instructor's name is canonically lost. Three named students survive in the record: the Advocate, Syl'Vex, and a third whose name was struck from the Hierarchy's record. The Advocate and Syl'Vex learned the same instrument from the same teacher.",
      foundIn: "antiquarian-library",
    },
    {
      id: "syl_vex.e4.third_student" as ClueId,
      title: "The Third Student, Struck from the Record",
      body: "The third student's name was struck from the Hierarchy's record after the Severance. The Antiquarian holds a marginalia-only reference: 'the third chose the use neither of them did.' The third's choice is canonically unknown. Whether the third still exists is canonically unknown. The marginalia is dated to the Severance year.",
      foundIn: "antiquarian-library",
    },
  ],
  deductions: [
    {
      id: "syl_vex.e4.d.sister_is_canonical" as DeductionId,
      clueA: "syl_vex.e4.advocate_sister_canon" as ClueId,
      clueB: "syl_vex.e4.shared_teacher" as ClueId,
      result: "correct",
      narrationId: "syl_vex.e4.n.sisters_of_the_weave",
      narrationProse:
        "The 'sister' is canonical — not familial, but instrumental. The Advocate and Syl'Vex are sisters of the Weave: same teacher, same instrument, divergent intent. The relationship is structural and load-bearing. Any future canonical interaction between them — including any negotiated severance, any joint defense, any direct confrontation — must be read through the sister-of-the-Weave register, not through a generic Hierarchy-vs-Insurgency frame.",
      unlocksEpisode: "syl_vex.e5" as EpisodeId,
    },
    {
      id: "syl_vex.e4.d.third_is_a_canon_seed" as DeductionId,
      clueA: "syl_vex.e4.third_student" as ClueId,
      clueB: "syl_vex.e4.shared_teacher" as ClueId,
      result: "partial",
      narrationId: "syl_vex.e4.n.the_third_is_open_canon",
      narrationProse:
        "The third student is a canon-seed — a deliberately-preserved unknown the saga's record will surface later or never. The arc cannot close on the third's identity; the case will note the existence and leave the slot open. Future canon may name the third. The Antiquarian's discipline is to keep the slot recognizable so it can be filled when canon permits.",
    },
  ],
  choices: [
    { id: "syl_vex.e4.c.passive" as ChoiceId, label: "Accept the sister-of-the-Weave canon and leave the third-student slot open.", weight: "passive" },
    { id: "syl_vex.e4.c.investigative" as ChoiceId, label: "Press the Antiquarian for whatever ELSE he holds on the pre-Severance instructor.", weight: "investigative" },
    { id: "syl_vex.e4.c.active" as ChoiceId, label: "Bring the sister-canon to the Advocate's attention directly and ask whether she has tried to speak with Syl'Vex since the Severance.", weight: "active" },
  ],
  contentBundle: {
    songId: "sisters_of_the_weave",
    slideshowId: "advocate_syl_vex_relationship",
    loredexUnlocks: ["entity_blood_weave_instructor", "entity_third_student_slot"],
    conspiracyDiscoveries: ["sisters_of_the_weave_canon", "third_student_canon_seed"],
    dropAt: "episode_close",
  },
};

const sylVexE5: EpisodeDefinition = {
  id: "syl_vex.e5" as EpisodeId,
  arcId: ARC_SYL_VEX,
  ordinal: 5,
  title: "The Convert's Refusal",
  summary:
    "Closure. Mira Halen is asked, by the Insurgency and the player, which thread she would cut if forced. Her answer is the arc's closure.",
  clues: [
    {
      id: "syl_vex.e5.miras_answer" as ClueId,
      title: "Mira's Answer",
      body: "Asked directly: 'Which thread would you cut if forced?' Mira's answer, after a long pause: 'I refuse the question. I am both. If you make me cut one, I will cut the cell that asked. The Insurgency taught me to refuse coercive binaries. So did the Weave. The two teachings agree on this.' She does not return to the Hierarchy's record. She does not leave the Insurgency's record. She continues operating on both as before.",
      foundIn: "insurgency-archive",
    },
    {
      id: "syl_vex.e5.advocate_closure_letter" as ClueId,
      title: "The Advocate's Closure Letter to the Player",
      body: "'You wanted to know if my sister's conversions are reversible. They are reversible only by the convert's refusal — and the convert must refuse the question, not the conversion. Mira refused the question. That is the only severance-method I trust. The Weave does not undo what it has consented to; consent can be re-chosen. The mechanism is hers, not mine and not Syl'Vex's. The convert is the one who decides what kind of convert she is.'",
      foundIn: "advocate-archive",
    },
  ],
  deductions: [
    {
      id: "syl_vex.e5.d.refusal_of_the_question" as DeductionId,
      clueA: "syl_vex.e5.miras_answer" as ClueId,
      clueB: "syl_vex.e5.advocate_closure_letter" as ClueId,
      result: "correct",
      narrationId: "syl_vex.e5.n.the_only_severance_is_the_converts",
      narrationProse:
        "The arc closes. Syl'Vex's conversions are operationally reversible only by the convert's own refusal-of-the-question. Zyr'Koth's lever exists but is institutionally locked. The Advocate's weave cannot sever. The Insurgency's recognition-discipline cannot extract. The only path back is the convert's choice to refuse the binary — which is itself a Weave-consistent move, since the Weave does not coerce. The arc's verdict: Syl'Vex's instrument is more dangerous than coercion because it makes coercion the only tool that could counter it — and the saga's resistance-doctrine has canonically refused to use coercion. The saga's response to Syl'Vex is the convert's refusal-of-the-question, multiplied across the institution.",
    },
  ],
  choices: [
    { id: "syl_vex.e5.c.passive" as ChoiceId, label: "Record the closure and let Mira continue as both.", weight: "passive" },
    { id: "syl_vex.e5.c.investigative" as ChoiceId, label: "Send Mira's answer to every Insurgency cell as standard counter-conversion doctrine.", weight: "investigative" },
    { id: "syl_vex.e5.c.active" as ChoiceId, label: "Reply directly to Syl'Vex with the closure — name her sister and quote Mira.", weight: "active" },
  ],
  contentBundle: {
    songId: "the_converts_refusal",
    slideshowId: "syl_vex_closure",
    loredexUnlocks: ["entity_refusal_of_the_question_doctrine"],
    conspiracyDiscoveries: ["syl_vex_arc_closure"],
    dropAt: "episode_close",
  },
};

const sylVexSuspects: ReadonlyArray<{
  id: SuspectId;
  name: string;
  type: string;
  relations: ReadonlyArray<{ to: SuspectId; relation: string }>;
}> = [
  { id: "suspect.syl_vex" as SuspectId, name: "Syl'Vex (Hierarchy senior-lord)", type: "character",
    relations: [
      { to: "suspect.the_advocate" as SuspectId, relation: "sister-of-the-weave-with" },
      { to: "suspect.blood_weave_instrument" as SuspectId, relation: "wields" },
    ] },
  { id: "suspect.the_advocate" as SuspectId, name: "The Advocate (N9)", type: "character",
    relations: [{ to: "suspect.blood_weave_instrument" as SuspectId, relation: "wields-defensively" }] },
  { id: "suspect.blood_weave_instrument" as SuspectId, name: "The Blood Weave (instrument)", type: "concept",
    relations: [
      { to: "suspect.zyr_koth_severance" as SuspectId, relation: "third-use-by" },
      { to: "suspect.preseverance_instructor" as SuspectId, relation: "taught-by" },
    ] },
  { id: "suspect.zyr_koth_severance" as SuspectId, name: "Zyr'Koth's Severance Protocol", type: "concept",
    relations: [{ to: "suspect.mol_garath_lock" as SuspectId, relation: "locked-by" }] },
  { id: "suspect.mol_garath_lock" as SuspectId, name: "Mol'Garath's Cross-Departmental Lock", type: "concept", relations: [] },
  { id: "suspect.mira_halen" as SuspectId, name: "Mira Halen (the dual-roster operative)", type: "character",
    relations: [{ to: "suspect.syl_vex" as SuspectId, relation: "converted-by-non-coercively" }] },
  { id: "suspect.preseverance_instructor" as SuspectId, name: "The Pre-Severance Weave Instructor (canonically un-named)", type: "character", relations: [] },
  { id: "suspect.third_student" as SuspectId, name: "The Third Weave Student (struck from record)", type: "character", relations: [] },
];

const sylVexLenses = [
  { id: LENS_INSURGENCY, name: "Insurgency", category: "faction" },
  { id: LENS_HIERARCHY,  name: "Hierarchy",  category: "faction" },
  { id: LENS_THALORIA,   name: "Thaloria",   category: "faction" },
  { id: LENS_DREAMER,    name: "Dreamer",    category: "faction" },
  { id: LENS_NEUTRAL,    name: "Neutral",    category: "faction" },
] as const;

const SYL_VEX_MYSTERY: MysteryDefinition = {
  id: "mystery.syl_vex" as MysteryId,
  arcId: ARC_SYL_VEX,
  title: "The Mirror That Converts",
  summary:
    "Syl'Vex weaves what the Advocate weaves — but converts where the Advocate defends. Her conversions are non-coercive, structurally additive, and canonically reversible only by the convert's own refusal-of-the-question. Investigate the instrument, the sister-of-the-Weave canon, and what the Insurgency does about a Hierarchy weapon that cannot be coerced against.",
  npcId: "syl_vex",
  episodes: [sylVexE1, sylVexE2, sylVexE3, sylVexE4, sylVexE5],
  suspects: sylVexSuspects,
  lenses: sylVexLenses,
};

/* ─── REGISTRY ─── */

/** Every authored mystery in the saga. The runtime reads against
 *  this array and trusts that ids are unique (enforced by the
 *  episodeMysteries.test.ts validity probe — see §10). */
import { DLC_MYSTERIES } from "./dlcMysteries";

export const MYSTERY_DEFINITIONS: ReadonlyArray<MysteryDefinition> = [
  WRAITH_CALDER_MYSTERY,
  JERICHO_JONES_MYSTERY,
  THE_SEER_MYSTERY,
  VEX_SOLENE_MYSTERY,
  GAME_MASTER_MYSTERY,
  THE_DEGEN_MYSTERY,
  THE_WATCHER_MYSTERY,
  ITH_RAEL_MYSTERY,
  THE_NECROMANCER_MYSTERY,
  SYL_VEX_MYSTERY,
  ...DLC_MYSTERIES,
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
