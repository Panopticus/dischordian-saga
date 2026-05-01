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
      // unlocksEpisode is intentionally absent until Wraith E3 is
      // authored (per docs/design §7.1, E3 is "The Six Immortal
      // Twins" — the Information Twins interrogation). The
      // registry probe enforces unlocksEpisode → existing-episode.
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
  episodes: [wraithE1, wraithE2],
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
