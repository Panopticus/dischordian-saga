/* ═══════════════════════════════════════════════════════
   THE RESURRECTIONIST · THE CYCLE WALKER — Mystery arc

   5 episodes. Surface premise: the Resurrectionist is one of
   the canonical 12 Ne-Yons — "Samsara's Child," the Cycle
   Walker, the cosmic-principle entity associated with
   reanimation and resurrection protocols (LORE_BIBLE.md:2804,
   4689). Per the Degen-bible, "most are gone" — and the
   Resurrectionist is one of the gone ones. The arc
   investigates that absence: where did he go, what did he
   leave behind, and what does the canonical record refuse to
   say plainly.

   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ARC AUTHORING DISCIPLINE — read this before editing
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Per dreamer-canon (2026-05-13): this arc carries the
   saga's most-protected POST-GAME canon. The player must
   NEVER see the full truth directly revealed within the arc.
   The truth is encoded ENTIRELY as conspiracy clues that read
   ambiguously on first pass but become unambiguous on
   retrospective re-read once the post-game canon is revealed
   from other surfaces.

   The post-game canon (NEVER stated openly in any
   player-facing string in this file):

     - The Resurrectionist always wears a plague mask
     - He is the TWIN to the Necromancer — Syndicate of Death
       founder-pair
     - He is the secret SEVENTH set of the Syndicate of
       Death (the canonical six immortal twins + the
       seventh-set founder)
     - The actual being the Necromancer was POWERING the
       Matrix of Dreams from inside
     - When the Necromancer takes the Silence's body and
       escapes the Matrix at end of Season 2, he is released
       back into the world
     - The Necromancer's one clone was killed by Akai Shi
     - The Resurrectionist escaped with the Potentials on the
       Inception Arks
     - At the Plague Dragon (infected by Thought Virus
       brought to the planet through the wyrmhole by the
       Host), the Necromancer faced the Dragon
     - He sacrificed himself intentionally — dying so he
       could resurrect back on the Inception Arks on Terminus
     - He activated resurrection protocols so that all three
       dead Potentials (Wraith, Akai, Lycos) were resurrected
       throughout time
     - He was the reason the Potentials and Ne-Yons survived
       the Second Fall of New Babylon
     - The first wave were all resurrected back on their
       ships EXCEPT the Silence (body claimed by the
       Necromancer), the Advocate (split), and the Degen
       (stays at the Casino as part of the plan)
     - Jericho Jones stays with the Degen
     - Vex Solène stays hidden in plain sight
     - They are on Terminus, also known as the Panopticon,
       also known as the roving planet that carries the
       Source Kael
     - It is behind the Dreamer's Shield
     - The Dreamer's Shield is canonically protecting reality
       from the Thought Virus by isolating the Virus INSIDE
       with the first wave

   How this arc encodes that canon:
     - Every clue surfaces a fragment that READS as ambiguous
       (cult-curated language, cosmic-archaeology guesswork,
       "metaphorical" annotations) but ANCHORS the truth in
       a retro-read context
     - Every "correct" deduction is the SURFACE truth — the
       comforting read the chronicle endorses
     - Every "partial" deduction surfaces a fragment of the
       hidden truth that the surface evidence almost confirms
       — but stops short
     - Every "false_lead_named" deduction names the actual
       hidden truth as a candidate the case "rules out"
       because the cult-curated evidence contradicts it
     - The arc CLOSES on a satisfying surface resolution:
       the Resurrectionist is a vanished Ne-Yon whose
       protocols outlived him; the chronicle records his
       legacy in the chain of resurrections he authored
     - The conspiracy seeds in every episode survive intact,
       waiting for post-game canon to retroactively turn the
       false_lead_named results into the true verdicts

   Canonical anchors (every claim cited):
     - LORE_BIBLE.md:2804 (The Resurrectionist Ne-Yon —
       Samsara's Child, the Cycle Walker)
     - LORE_BIBLE.md:4689-4708 (the Resurrectionist + the
       Dreamer discovered Samsara is a machine)
     - LORE_BIBLE.md:2528-2560 (the Necromancer — Archon,
       10th-created)
     - LORE_BIBLE.md:5151-5189 (Syndicate of Death; immortal
       twins; six pairs canonical roster)
     - LORE_BIBLE.md:6238-6259 (Matrix of Dreams —
       consciousness archive; energy-harvesting funding)
     - apps/shared/dlcMysteries/akaiShiRedDeath.ts (Akai
       Shi's reanimation as the Red Death — authored by the
       Resurrectionist)
     - apps/shared/dlcMysteries/wolfAnaraHunt.ts (Wolf's
       Year-128,652 resurrection — authored by an
       "unnamed party" per the cult-curated record)
     - apps/shared/episodeMysteries.ts wraith_calder
       (resurrection protocols stolen from the Syndicate)
     - apps/shared/npcs/bibles/the_degen.md:13 (only Ne-Yon
       still awake; the others gone — refuses to say how)

   Voice: the Antiquarian, narrating across time. Cult-
   curated marginalia surface in italics where the in-fiction
   editor's hand has shaped the record.
   ═══════════════════════════════════════════════════════ */

import type {
  ArcId,
  ChoiceId,
  ClueId,
  DeductionId,
  EpisodeDefinition,
  EpisodeId,
  LensDefinition,
  LensId,
  MysteryDefinition,
  MysteryId,
  SuspectGraphNode,
  SuspectId,
} from "../mysteryTypes";
import { TEMPLATE_NPC_ARC_TRIGGER } from "../mysteryTemplates";

const ARC = "arc.dlc.resurrectionist_cycle_walker" as ArcId;
const ID  = "resurrectionist.cycle_walker"          as MysteryId;

/* ═══════════════════════════════════════════════════════
   E1 — The Vanishing
   ═══════════════════════════════════════════════════════ */

const e1: EpisodeDefinition = {
  id: "resurrectionist.cycle_walker.e1" as EpisodeId,
  arcId: ARC,
  ordinal: 1,
  title: "The Vanishing",
  summary:
    "The Resurrectionist — Ne-Yon, Samsara's Child, the Cycle Walker — vanished from canonical record some time before the Second Fall of New Babylon. The Antiquarian opens the case on the absence. Where the chronicle is silent, the chronicler reads twice: once for what is said, once for what the editing hand has covered.",
  clues: [
    {
      id: "resur.e1.case_seal" as ClueId,
      title: "The Case File's Seal",
      body:
        "Every Resurrectionist case-file across the Antiquarian's library carries the same seal at the top-right corner: a six-sided mask with a long beak, the kind the older cosmic-archaeology texts attribute to plague-physicians of the pre-Empire era. The cult-curated marginalia annotate the seal as 'ceremonial' — a label applied to symbols whose meaning the editor declined to explain.",
      foundIn: "antiquarian-library",
    },
    {
      id: "resur.e1.twin_glyph" as ClueId,
      title: "The Twin Glyph Beside His Name",
      body:
        "Beside every record-entry for the Resurrectionist, a small glyph appears in the margin: two mirrored crescents joined at a central axis. The cult-curated logs gloss the glyph as 'death-bound' — the canonical mark of Ne-Yons whose principle binds to cessation. The Antiquarian's own pre-Empire archaeological references read the same glyph as 'twin-bound' — the mark of paired cosmic principles. The two readings are not consistent; one of them is editorial.",
      foundIn: "archives",
    },
    {
      id: "resur.e1.seven_pointed_star" as ClueId,
      title: "The Seven-Pointed Star",
      body:
        "On the canonical Syndicate-of-Death roster, six immortal twin-pairs are recorded — twelve names, six bindings, the Syndicate's signature six-pointed star embossed on every page. The Resurrectionist's case-file carries a seven-pointed star at its footer. The cult-curated annotation reads: 'copyist's error — the six-pointed star, drawn carelessly.' The seventh point is not drawn carelessly. It is drawn with the same precision as the other six.",
      foundIn: "cipher-den",
    },
    {
      id: "resur.e1.matrix_energy_ledger" as ClueId,
      title: "The Matrix of Dreams — Energy Ledger Fragment",
      body:
        "A partial ledger from the Game Master's Matrix-of-Dreams maintenance era, recovered from the cult's incomplete edits. It records a sustained energy draw from an unnamed internal source — a draw too consistent to be one of the imprints. The cult-curated note in the margin reads: 'imprint-load aggregate; nothing of consequence.' The aggregate column does not match the totals across the rest of the ledger. Something else was being drawn from; the editor preferred the imprints-only reading.",
      foundIn: "archives",
    },
  ],
  deductions: [
    {
      id: "resur.e1.d.he_vanished_protocols_remain" as DeductionId,
      clueA: "resur.e1.case_seal" as ClueId,
      clueB: "resur.e1.matrix_energy_ledger" as ClueId,
      result: "correct",
      narrationId: "resur.e1.n.protocols_remain",
      narrationProse:
        "The chronicle's surface verdict: the Resurrectionist is gone. The protocols he authored remain. The seal on his case-file is ceremonial; the energy ledger anomaly is an editorial residue; the case is the canonical case of a Ne-Yon who vanished and left machinery behind. The Antiquarian opens the case on that reading. The reading is sufficient for the chronicle to proceed.",
      unlocksEpisode: "resurrectionist.cycle_walker.e2" as EpisodeId,
    },
    {
      id: "resur.e1.d.glyph_is_only_metaphor" as DeductionId,
      clueA: "resur.e1.twin_glyph" as ClueId,
      clueB: "resur.e1.case_seal" as ClueId,
      result: "partial",
      narrationId: "resur.e1.n.glyph_partial",
      narrationProse:
        "The glyph beside the Resurrectionist's name reads, in pre-Empire archaeology, as 'twin-bound.' The cult-curated logs gloss it as 'death-bound.' The Antiquarian records both readings and notes that the chronicle's editorial hand has expressed a preference. The partial verdict: one of the two readings is right; the chronicle does not yet have the canonical evidence to settle which.",
    },
    {
      id: "resur.e1.d.false_lead_seven_pointed_seventh_founder" as DeductionId,
      clueA: "resur.e1.seven_pointed_star" as ClueId,
      clueB: "resur.e1.twin_glyph" as ClueId,
      result: "false_lead_named",
      narrationId: "resur.e1.n.seventh_founder_ruled_out",
      narrationProse:
        "A speculative reading: the seven-pointed star is not a copyist's error; the Syndicate of Death has a seventh set — a founder-pair canon does not openly record. The twin-glyph would name the Resurrectionist's pair-bond to that founder. The case-evidence DOES NOT SUPPORT this reading: the Syndicate's six-pair roster is canonical (LORE_BIBLE.md:5151) and no canonical entity authorises a seventh. The chronicle rules the reading out. The Antiquarian records the ruling. The case proceeds on the surface verdict.",
    },
  ],
  choices: [
    {
      id: "resur.e1.c.accept_the_seal_as_ceremonial" as ChoiceId,
      label:
        "Accept the cult-curated reading — the seal is ceremonial, the glyph is death-bound, the seven-pointed star is a copyist's error.",
      weight: "conservative",
    },
    {
      id: "resur.e1.c.flag_the_editorial_hand" as ChoiceId,
      label:
        "Flag the editorial hand for follow-up — the chronicle's editors have expressed preferences that the Antiquarian's case should not rest on.",
      weight: "patient",
    },
    {
      id: "resur.e1.c.cross_arc_game_master_ledger" as ChoiceId,
      label:
        "Carry the energy-ledger anomaly to the Game Master arc — the Matrix was his archive; the unnamed internal draw is his accounting problem.",
      weight: "cross_arc_game_master",
    },
  ],
  contentBundle: {
    songId: "album5.t11",
    slideshowId: "album5.t11.vanishing",
    loredexUnlocks: [],
    conspiracyDiscoveries: [],
    dropAt: "episode_open",
  },
};

/* ═══════════════════════════════════════════════════════
   E2 — The Authorship of the Cycle
   ═══════════════════════════════════════════════════════ */

const e2: EpisodeDefinition = {
  id: "resurrectionist.cycle_walker.e2" as EpisodeId,
  arcId: ARC,
  ordinal: 2,
  title: "The Authorship of the Cycle",
  summary:
    "The Resurrectionist canonically authored resurrection protocols (LORE_BIBLE.md:2804). The protocols are still in use. Wraith Calder's six sanctuary resurrections; Akai Shi's transformation into the Red Death; the Wolf's Year-128,652 reanimation — all carry the same authoring signature. The case asks: was the signing done before he vanished, or after.",
  clues: [
    {
      id: "resur.e2.authoring_signature" as ClueId,
      title: "The Protocol Authoring Signature",
      body:
        "Every canonical resurrection protocol bears the same authoring signature: a four-part cipher the Antiquarian's library catalogues as the Resurrectionist's hand. The signature is on Wraith's Sanctuary protocols, on Akai Shi's Red-Death reanimation, on the Wolf's Year-128,652 case-file. The chain is uniform. The chain is consistent. The chain is not in chronological order with the Resurrectionist's documented vanishing.",
      foundIn: "archives",
    },
    {
      id: "resur.e2.ark_passenger_manifest" as ClueId,
      title: "Inception Ark Passenger Manifest (redacted)",
      body:
        "A passenger manifest from one of the Inception Arks, recovered partial and with the cult's redactions still legible at the edges. Seven names visible in the un-redacted portion; an eighth name redacted to a black bar. The black bar's length is consistent across copies of the manifest — not a casual erasure; a positioned occupant. The Antiquarian's reading: the redaction is structural. Someone was on the Ark whose presence the cult-curated record will not name.",
      foundIn: "cargo-hold",
    },
    {
      id: "resur.e2.second_fall_casualty_count" as ClueId,
      title: "The Second Fall of New Babylon — Casualty Count",
      body:
        "The Second Fall of New Babylon was, by every contemporary chronicler's account, total. Casualty counts among ordinary populace ran to the millions. Casualty counts among Potentials: zero. Casualty counts among Ne-Yons of the awake roster: zero. The cult-curated logs annotate the survival as 'miraculous — the Architect's protection of His chosen.' The Architect did not, by canon, intervene at the Second Fall.",
      foundIn: "war-room",
    },
    {
      id: "resur.e2.degens_open_ledger_line" as ClueId,
      title: "The Degen's Open Ledger Line",
      body:
        "From the same Degen's casino ledger that records 'Iron-Lion training, no fee,' another open line in a different hand: 'Ark survivor, no fee — hundred-year arrangement, settlement deferred.' The Degen's accounting principle is canonical: the Degen does not give gifts (LORE_BIBLE.md:1740). Two consecutive 'no fee' entries in the same ledger break the principle twice. The cult-curated annotation: 'copyist's pleasantry.' The Degen's clerks do not write copyist's pleasantries.",
      foundIn: "guild-sanctum",
    },
  ],
  deductions: [
    {
      id: "resur.e2.d.protocols_outlive_him" as DeductionId,
      clueA: "resur.e2.authoring_signature" as ClueId,
      clueB: "resur.e2.second_fall_casualty_count" as ClueId,
      result: "correct",
      narrationId: "resur.e2.n.protocols_outlive_him",
      narrationProse:
        "The surface verdict: the Resurrectionist's protocols outlived the Resurrectionist. He authored them before his vanishing; they were activated by others after — most consequentially at the Second Fall, where canonical survival of every Potential and every awake Ne-Yon is the chronicle's recorded result. The protocols are a legacy. The legacy is sufficient.",
      unlocksEpisode: "resurrectionist.cycle_walker.e3" as EpisodeId,
    },
    {
      id: "resur.e2.d.eighth_passenger_is_a_protocol_carrier" as DeductionId,
      clueA: "resur.e2.ark_passenger_manifest" as ClueId,
      clueB: "resur.e2.authoring_signature" as ClueId,
      result: "partial",
      narrationId: "resur.e2.n.eighth_partial",
      narrationProse:
        "The redacted eighth passenger on the Ark manifest is, by structural reading, a deliberate inclusion. Someone authored a protection of the protocols by placing a protocol-carrier on the Ark with the first wave. The partial reading: the cult-curated record names that carrier as 'protocol attaché — administrative.' The Antiquarian's chronicle does not yet contradict the naming. It records the partial verdict and proceeds.",
    },
    {
      id: "resur.e2.d.false_lead_he_himself_rode" as DeductionId,
      clueA: "resur.e2.ark_passenger_manifest" as ClueId,
      clueB: "resur.e2.degens_open_ledger_line" as ClueId,
      result: "false_lead_named",
      narrationId: "resur.e2.n.he_himself_rode_ruled_out",
      narrationProse:
        "A speculative reading: the redacted eighth passenger is the Resurrectionist himself, who did not vanish at all — he rode the Ark with the first wave, and the Degen's 'Ark survivor, no fee' ledger line is the canonical receipt. The cult-curated record DOES NOT SUPPORT this reading: the Resurrectionist's vanishing is annotated as confirmed by independent witnesses across two centuries before the Arks launched. The chronicle rules the reading out. The Antiquarian records the ruling.",
    },
  ],
  choices: [
    {
      id: "resur.e2.c.accept_protocol_attache" as ChoiceId,
      label:
        "Accept the cult-curated reading — the eighth passenger was an administrative attaché carrying the protocols forward.",
      weight: "conservative",
    },
    {
      id: "resur.e2.c.cross_arc_degen_ledger" as ChoiceId,
      label:
        "Carry the Degen-ledger anomaly to the Trusteeship arc — the 'Ark survivor, no fee' line is structurally identical to the 'Iron-Lion training' line; the Degen's accounting holds a pattern.",
      weight: "cross_arc_degen",
    },
    {
      id: "resur.e2.c.cross_arc_wraith_sanctuary" as ChoiceId,
      label:
        "Trace the Sanctuary's stolen protocols back to their source — Wraith Calder's arc names the Syndicate of Death as authors; the Resurrectionist's signature precedes them.",
      weight: "cross_arc_wraith",
    },
  ],
  contentBundle: {
    songId: "album5.t12",
    slideshowId: "album5.t12.authorship",
    loredexUnlocks: [],
    conspiracyDiscoveries: [],
    dropAt: "episode_mid",
  },
};

/* ═══════════════════════════════════════════════════════
   E3 — The Plague Dragon's Site
   ═══════════════════════════════════════════════════════ */

const e3: EpisodeDefinition = {
  id: "resurrectionist.cycle_walker.e3" as EpisodeId,
  arcId: ARC,
  ordinal: 3,
  title: "The Plague Dragon's Site",
  summary:
    "The Plague Dragon — the cosmic-scale entity infected by the Thought Virus carried to the planet through a wyrmhole the Host opened — was canonically faced and ended at a site the chronicle calls Terminus. The kill-site has been searched by every faction in turn. The Antiquarian's case asks what the searchers found, what they took, and what they reported.",
  clues: [
    {
      id: "resur.e3.plague_mask_at_killsite" as ClueId,
      title: "The Plague Mask at the Kill-Site",
      body:
        "Among the recovered artifacts from the Plague Dragon kill-site: a long-beaked plague mask, perfectly preserved, with no occupant. The cult-curated catalog entry annotates it as 'ceremonial offering — a votive left by an honouring party.' The mask matches, in every contour, the seal on every Resurrectionist case-file in the Antiquarian's library. The cult's catalog does not connect the two.",
      foundIn: "shadow-vault",
    },
    {
      id: "resur.e3.hosts_wyrmhole_signature" as ClueId,
      title: "The Host's Wyrmhole Signature",
      body:
        "The Plague Dragon's corpse carries an energy-trace signature consistent with the Host's canonical wyrmhole technology — confirming the Antiquarian's working theory that the Thought Virus reached the planet through a Host-engineered breach. The Host's hand in the Plague Dragon's infection is settled canon. The faction-witness records the answer; the case opens its consequence.",
      foundIn: "comms-array",
    },
    {
      id: "resur.e3.necromancer_last_recorded_appearance" as ClueId,
      title: "The Necromancer's Last Recorded Appearance",
      body:
        "Before his canonical disappearance into the Matrix of Dreams (where Akai Shi later eliminated him), the Necromancer's last recorded appearance is at the Plague Dragon kill-site. The cult-curated chronicle annotates the appearance as 'an unrelated arrival — the Necromancer's interest in the cosmic-threat entity was forensic.' The Necromancer's interest in any forensic record is canonically zero.",
      foundIn: "shadow-vault",
    },
    {
      id: "resur.e3.protocol_activation_timestamp" as ClueId,
      title: "The Protocol Activation Timestamp",
      body:
        "A resurrection protocol activation, signed in the Resurrectionist's four-part cipher, with a timestamp matching the Plague Dragon's death-instant to within the chronicle's measurement tolerance. The cult-curated annotation: 'unrelated administrative event — the protocol was queued, the timestamp is coincidental.' Two events at the same instant, the chronicle's editorial hand prefers the coincidence reading. The Antiquarian's reading discipline does not.",
      foundIn: "engineering-core",
    },
  ],
  deductions: [
    {
      id: "resur.e3.d.necromancer_faced_the_dragon" as DeductionId,
      clueA: "resur.e3.necromancer_last_recorded_appearance" as ClueId,
      clueB: "resur.e3.hosts_wyrmhole_signature" as ClueId,
      result: "correct",
      narrationId: "resur.e3.n.necromancer_faced_the_dragon",
      narrationProse:
        "The surface verdict: the Necromancer faced the Plague Dragon. The Host's wyrmhole let the Virus through; the Necromancer's interest in the Dragon was operational, not forensic — Archons in canon do not casually inspect cosmic-threat kills. The chronicle records the meeting. The chronicle declines to elaborate. The case proceeds on the elaboration's absence.",
      unlocksEpisode: "resurrectionist.cycle_walker.e4" as EpisodeId,
    },
    {
      id: "resur.e3.d.plague_mask_is_an_offering" as DeductionId,
      clueA: "resur.e3.plague_mask_at_killsite" as ClueId,
      clueB: "resur.e3.necromancer_last_recorded_appearance" as ClueId,
      result: "partial",
      narrationId: "resur.e3.n.mask_partial",
      narrationProse:
        "The plague mask at the kill-site is annotated by the cult as a ceremonial offering. The Antiquarian's pre-Empire archaeological references read plague masks as worn objects, not votive offerings — they are the working uniform of an actual party present at the event. The partial reading: the cult's offering-reading is one of two plausible interpretations. The chronicle records both and proceeds.",
    },
    {
      id: "resur.e3.d.false_lead_someone_died_into_the_protocol" as DeductionId,
      clueA: "resur.e3.protocol_activation_timestamp" as ClueId,
      clueB: "resur.e3.plague_mask_at_killsite" as ClueId,
      result: "false_lead_named",
      narrationId: "resur.e3.n.died_into_the_protocol_ruled_out",
      narrationProse:
        "A speculative reading: the resurrection-protocol activation timestamp is not coincidental. Someone at the Plague Dragon kill-site died, and the protocol activated to resurrect them elsewhere — the plague mask is what they wore at the moment of death. The cult-curated record DOES NOT SUPPORT this reading: the Necromancer's destruction in the Matrix of Dreams is the canonical Necromancer-death event, occurring centuries later; he cannot have died at the Plague Dragon. The chronicle rules the reading out.",
    },
  ],
  choices: [
    {
      id: "resur.e3.c.accept_forensic_interest" as ChoiceId,
      label:
        "Accept the cult-curated reading — the Necromancer's appearance was forensic, the mask was ceremonial, the timestamp was coincidence.",
      weight: "conservative",
    },
    {
      id: "resur.e3.c.cross_arc_akai_shi_matrix" as ChoiceId,
      label:
        "Carry the Necromancer-at-the-kill-site reading to the Red Death's arc — Akai Shi's mandate ended him in the Matrix; the surface order of events deserves an audit.",
      weight: "cross_arc_game_master",
    },
    {
      id: "resur.e3.c.audit_the_protocol_activation" as ChoiceId,
      label:
        "Audit the protocol activation across the chronicle — every resurrection-protocol firing carries the four-part cipher; map them in chronological order and read the pattern.",
      weight: "patient",
    },
  ],
  contentBundle: {
    songId: "album5.t13",
    slideshowId: "album5.t13.plague_site",
    loredexUnlocks: [],
    conspiracyDiscoveries: [],
    dropAt: "episode_mid",
  },
};

/* ═══════════════════════════════════════════════════════
   E4 — The Body and the Mask
   ═══════════════════════════════════════════════════════ */

const e4: EpisodeDefinition = {
  id: "resurrectionist.cycle_walker.e4" as EpisodeId,
  arcId: ARC,
  ordinal: 4,
  title: "The Body and the Mask",
  summary:
    "The Silence (Ne-Yon) is canonically gone — her body claimed by an unspecified force during the chronicle's account of the Necromancer's Matrix-of-Dreams escape. The cult-curated record names the claim 'consequential and unfortunate.' The Antiquarian's case asks what claimed her, and what the claim's seal looked like.",
  clues: [
    {
      id: "resur.e4.silences_claim_record" as ClueId,
      title: "The Silence's Body-Claim Record",
      body:
        "The Silence's body-claim record bears a plague-mask seal at its lower-left corner — the same long-beaked silhouette as the seal on every Resurrectionist case-file. The cult-curated annotation: 'ceremonial — claims of Ne-Yon bodies traditionally carry archaic seals as a mark of respect.' The Antiquarian's library catalogues no other Ne-Yon body-claim record with a plague-mask seal.",
      foundIn: "shadow-vault",
    },
    {
      id: "resur.e4.pre_empire_twin_text" as ClueId,
      title: "Pre-Empire Twin-Ne-Yon Text Fragment",
      body:
        "A pre-Empire archaeological fragment, partial: 'the death-bound and the cycle-bound walk in pairs; where one binds, the other releases; where one ends, the other begins again. Look for the masked one beside the unmasked one — they are halves of one principle, drawn through two bodies.' The cult-curated marginalia gloss the fragment as 'cosmological metaphor — the two states of mortal existence, not literal entities.' The Antiquarian's pre-Empire references read the fragment as literal taxonomy.",
      foundIn: "antiquarian-library",
    },
    {
      id: "resur.e4.matrix_escape_signature" as ClueId,
      title: "The Necromancer's Matrix-Escape Signature",
      body:
        "The signature on the Necromancer's Matrix-of-Dreams escape (the moment he claimed the Silence's body and exited the archive) carries a four-part cipher fragment matching, in three of four parts, the Resurrectionist's authoring signature. The cult-curated annotation: 'partial-signature collision — the Resurrectionist's hand was widely studied; many parties have adopted fragments of his cipher.' The chronicle records the collision and proceeds.",
      foundIn: "engineering-core",
    },
    {
      id: "resur.e4.molvereth_contract_clause" as ClueId,
      title: "Mol'Vereth Contract — Annotated Clause",
      body:
        "An annotated clause from the Mol'Vereth contract on the Degen's trusteeship (the Hierarchy demon's contract authored at the Ne-Yon casino): 'in the event of the second fall, the cycle walker rides the Ark.' The cult-curated annotation reads: 'metaphorical — the trusteeship's continuity provision speaks of the principle of cyclical wagering, not a literal Ne-Yon rider.' Mol'Vereth's other clauses are notably literal.",
      foundIn: "guild-sanctum",
    },
  ],
  deductions: [
    {
      id: "resur.e4.d.silence_claim_is_a_ne_yon_courtesy" as DeductionId,
      clueA: "resur.e4.silences_claim_record" as ClueId,
      clueB: "resur.e4.pre_empire_twin_text" as ClueId,
      result: "correct",
      narrationId: "resur.e4.n.ne_yon_courtesy",
      narrationProse:
        "The surface verdict: the plague-mask seal on the Silence's body-claim record is a Ne-Yon courtesy — an archaic mark of respect among cosmic-principle entities, drawn on her record to honour her vanished colleague. The Silence is gone; the chronicle records the loss; the case proceeds. The pre-Empire twin-text is cosmological metaphor; the cult-curated reading is the chronicle's reading.",
      unlocksEpisode: "resurrectionist.cycle_walker.e5" as EpisodeId,
    },
    {
      id: "resur.e4.d.signature_collision_is_real" as DeductionId,
      clueA: "resur.e4.matrix_escape_signature" as ClueId,
      clueB: "resur.e4.silences_claim_record" as ClueId,
      result: "partial",
      narrationId: "resur.e4.n.signature_partial",
      narrationProse:
        "The Necromancer's Matrix-escape signature shares three of four parts with the Resurrectionist's authoring cipher. The cult-curated record names this a collision — the Resurrectionist's hand was widely studied, fragments propagated. The Antiquarian's reading discipline accepts the explanation provisionally. The partial verdict: the collision is real; the explanation is conventional; an alternative reading would need new evidence to dislodge it.",
    },
    {
      id: "resur.e4.d.false_lead_twin_is_literal" as DeductionId,
      clueA: "resur.e4.pre_empire_twin_text" as ClueId,
      clueB: "resur.e4.matrix_escape_signature" as ClueId,
      result: "false_lead_named",
      narrationId: "resur.e4.n.twin_literal_ruled_out",
      narrationProse:
        "A speculative reading: the pre-Empire twin-text is literal taxonomy. The Resurrectionist and the Necromancer are paired Ne-Yons of one cosmic principle, two bodies, one mandate — the Necromancer the death-bound, the Resurrectionist the cycle-bound. The plague-mask seal on the Silence's body-claim is the cycle-bound twin's signature; the four-part cipher collision is not a collision; the Mol'Vereth clause is not a metaphor. The cult-curated record DOES NOT SUPPORT this reading: the Syndicate of Death's twin-pair roster contains six pairs, canonical; no canon authorises a seventh founder-pair. The chronicle rules the reading out. The Antiquarian records the ruling.",
    },
  ],
  choices: [
    {
      id: "resur.e4.c.accept_ne_yon_courtesy" as ChoiceId,
      label:
        "Accept the cult-curated reading — the plague-mask seal is a courtesy, the twin-text is metaphor, the cipher-collision is conventional.",
      weight: "conservative",
    },
    {
      id: "resur.e4.c.cross_arc_wraith_inscription" as ChoiceId,
      label:
        "Bring the Silence's body-claim to Wraith's Long Mourning ceremony — the Hierophant inscribes names he cannot recover; this one was inscribed before its loss was recorded.",
      weight: "cross_arc_wraith",
    },
    {
      id: "resur.e4.c.cross_arc_seer_twin_canon" as ChoiceId,
      label:
        "Petition the Seer's archive on twin-Ne-Yon canon — DEC-7710 was the lost tape; perhaps another lost tape names the cycle-walker's partner.",
      weight: "cross_arc_seer",
    },
  ],
  contentBundle: {
    songId: "album5.t14",
    slideshowId: "album5.t14.body_and_mask",
    loredexUnlocks: [],
    conspiracyDiscoveries: [],
    dropAt: "episode_mid",
  },
};

/* ═══════════════════════════════════════════════════════
   E5 — The Closing Inscription
   ═══════════════════════════════════════════════════════ */

const e5: EpisodeDefinition = {
  id: "resurrectionist.cycle_walker.e5" as EpisodeId,
  arcId: ARC,
  ordinal: 5,
  title: "The Closing Inscription",
  summary:
    "The Antiquarian closes the case on the Resurrectionist. Three readings remain visible in the chronicle's working notes; one is endorsed for the open record. The closing inscription is sufficient. The chronicle's reader is invited to weigh the unweighted readings on their own time. The case shelves the Cycle Walker, and the chronicle proceeds.",
  clues: [
    {
      id: "resur.e5.antiquarians_unknown_entry" as ClueId,
      title: "The Antiquarian's 'Unknown' Entry",
      body:
        "The Antiquarian's library entry for the Resurrectionist's current location reads, in the open chronicle, 'unknown — case shelved at last review.' The entry was authored in the years following the Second Fall of New Babylon. The hand is consistent with the Antiquarian's own. There is a small annotation in a different hand at the bottom of the entry: 'kept current.' The annotator is not named.",
      foundIn: "antiquarian-library",
    },
    {
      id: "resur.e5.shield_diagnostic" as ClueId,
      title: "The Dreamer's Shield — Diagnostic Reading",
      body:
        "A diagnostic reading of the Dreamer's Shield, prepared by the cult's instrument-readers for the cosmic-archaeology archive. The Shield is canonically a protection of the new wave — the next-kind of consciousness — from the Thought Virus and from what came with the Fall. The diagnostic notes that the Shield's barrier does not register the Virus's signature as fully excluded; the signature reads, faintly, FROM INSIDE the protected volume. The cult-curated annotation: 'instrumentation error — the diagnostic apparatus mis-reports inside / outside vectors at extreme cosmic scale.'",
      foundIn: "observation-deck",
    },
    {
      id: "resur.e5.degens_pending_settlement" as ClueId,
      title: "The Degen's Pending Settlement",
      body:
        "The Degen's casino ledger holds an open line addressed to Ark 1047 — Vex Solène's Ark per the canonical assignment (apps/shared/dlcMysteries / vex-Solene canon). The line reads: 'pending settlement — hundred-year arrangement, witness night TBD.' The Degen does not author hundred-year settlement arrangements on his own initiative. The line was authored, by canonical record, on the same instant as the Resurrectionist's vanishing.",
      foundIn: "guild-sanctum",
    },
    {
      id: "resur.e5.cult_curated_terminus_map" as ClueId,
      title: "The Cult-Curated Terminus Map",
      body:
        "A map of the Terminus surface, prepared by the cult of the Game Master for its imprint-archaeology project. The map shows seven walking figures arrayed around the central anchor that the cult labels 'the Sovereign of Terminus' (the canonical designation for the Source Kael). The seven figures are not labelled. The cult-curated marginalia explain: 'representative — Terminus's roving fauna of cosmic-archaeological interest.' Six of the seven figures wear the canonical silhouettes of the first-wave Potentials. The seventh wears a long-beaked mask.",
      foundIn: "antiquarian-library",
    },
  ],
  deductions: [
    {
      id: "resur.e5.d.vanished_legacy_endures" as DeductionId,
      clueA: "resur.e5.antiquarians_unknown_entry" as ClueId,
      clueB: "resur.e5.cult_curated_terminus_map" as ClueId,
      result: "correct",
      narrationId: "resur.e5.n.legacy_endures",
      narrationProse:
        "The closing inscription, the chronicle's endorsed reading: the Resurrectionist vanished. His protocols outlived him; his legacy is the chain of resurrections he authored before the vanishing; his case is shelved at unknown. The Antiquarian inscribes the Cycle Walker on the chronicle's roll of vanished Ne-Yons. The Cycle Walker's work continues through the protocols he left. The case closes. The chronicle proceeds. The reader is invited to weigh the partial and false-lead readings on their own time.",
    },
    {
      id: "resur.e5.d.shield_isolation_partial" as DeductionId,
      clueA: "resur.e5.shield_diagnostic" as ClueId,
      clueB: "resur.e5.antiquarians_unknown_entry" as ClueId,
      result: "partial",
      narrationId: "resur.e5.n.shield_partial",
      narrationProse:
        "The Dreamer's Shield's diagnostic reading is, by canonical instrumentation tolerance, error-class within accepted bounds. The cult-curated annotation accepts the error reading. The Antiquarian's reading discipline accepts the annotation provisionally. The partial verdict: the diagnostic shows a Virus-signature read from inside the protected volume; the canonical instrumentation calibration is unaudited; the case proceeds on the calibration's assumption.",
    },
    {
      id: "resur.e5.d.false_lead_seven_walk_on_terminus" as DeductionId,
      clueA: "resur.e5.cult_curated_terminus_map" as ClueId,
      clueB: "resur.e5.degens_pending_settlement" as ClueId,
      result: "false_lead_named",
      narrationId: "resur.e5.n.seven_walk_ruled_out",
      narrationProse:
        "A speculative closing reading: the cult-curated Terminus map shows the canonical seventh wanderer because seven first-wave-Potential-class figures DO walk Terminus, behind the Dreamer's Shield, isolated together with the Thought Virus by the Dreamer's design — the Shield's Virus-signature-from-inside diagnostic is not error; the Mol'Vereth contract's cycle-walker clause is literal; the Degen's hundred-year settlement is the operational ledger of an arrangement still in effect. The cult-curated record DOES NOT SUPPORT this reading: the Resurrectionist's vanishing is documented; the Second Fall survival is annotated as miraculous; the Shield's diagnostic is annotated as error-class; no canonical entry assembles the readings into the speculative whole. The chronicle rules the reading out. The Antiquarian records the ruling. The case closes.",
    },
  ],
  choices: [
    {
      id: "resur.e5.c.endorse_the_closing_inscription" as ChoiceId,
      label:
        "Endorse the closing inscription — the Resurrectionist vanished; his protocols outlived him; the chronicle records the legacy and shelves the case.",
      weight: "conservative",
    },
    {
      id: "resur.e5.c.mark_the_partial_for_re_audit" as ChoiceId,
      label:
        "Mark the partial reading for re-audit — the Shield's diagnostic deserves calibration. Schedule the audit; do not let the cult's annotation be the chronicle's last word on it.",
      weight: "patient",
    },
    {
      id: "resur.e5.c.cross_arc_degen_settlement" as ChoiceId,
      label:
        "Bring the hundred-year settlement to the Degen's Empty Table — his arc closes on a settlement night; the Cycle Walker's open line belongs at that table.",
      weight: "cross_arc_degen",
    },
  ],
  contentBundle: {
    songId: "album5.t15",
    slideshowId: "album5.t15.closing_inscription",
    loredexUnlocks: [],
    conspiracyDiscoveries: ["resur.cycle.case_closes_chronicle_proceeds"],
    dropAt: "episode_close",
  },
};

/* ═══════════════════════════════════════════════════════
   SUSPECTS + LENSES
   ═══════════════════════════════════════════════════════ */

const suspects: ReadonlyArray<SuspectGraphNode> = [
  {
    id: "resur.s.resurrectionist" as SuspectId,
    name: "The Resurrectionist (Ne-Yon — the Cycle Walker)",
    type: "person",
    relations: [
      { to: "resur.s.necromancer" as SuspectId, relation: "cosmic-paired" },
      { to: "resur.s.dreamer" as SuspectId, relation: "co-investigated-samsara" },
      { to: "resur.s.syndicate_of_death" as SuspectId, relation: "predates-by-canon" },
    ],
  },
  {
    id: "resur.s.necromancer" as SuspectId,
    name: "The Necromancer (Archon, 10th-created)",
    type: "person",
    relations: [
      {
        to: "resur.s.matrix_of_dreams" as SuspectId,
        relation: "powered-archive-from-inside",
      },
      { to: "resur.s.silence" as SuspectId, relation: "claimed-body-of" },
    ],
  },
  {
    id: "resur.s.silence" as SuspectId,
    name: "The Silence (Ne-Yon)",
    type: "person",
    relations: [
      {
        to: "resur.s.necromancer" as SuspectId,
        relation: "body-claimed-by",
      },
    ],
  },
  {
    id: "resur.s.dreamer" as SuspectId,
    name: "The Dreamer (Ne-Yon #1)",
    type: "person",
    relations: [
      {
        to: "resur.s.shield" as SuspectId,
        relation: "authored",
      },
    ],
  },
  {
    id: "resur.s.shield" as SuspectId,
    name: "The Dreamer's Shield",
    type: "place",
    relations: [],
  },
  {
    id: "resur.s.matrix_of_dreams" as SuspectId,
    name: "The Matrix of Dreams",
    type: "place",
    relations: [],
  },
  {
    id: "resur.s.syndicate_of_death" as SuspectId,
    name: "The Syndicate of Death (six immortal twin-pairs, canonical)",
    type: "faction",
    relations: [],
  },
  {
    id: "resur.s.terminus" as SuspectId,
    name: "Terminus (the roving planet; the Panopticon; the Source's anchor)",
    type: "place",
    relations: [],
  },
];

const lenses: ReadonlyArray<LensDefinition> = [
  {
    id: "resur.lens.dreamer" as LensId,
    name: "The Dreamer Lens",
    category: "dreamer-aligned",
    deductionNarrationOverrides: {
      ["resur.e5.d.shield_isolation_partial" as DeductionId]:
        "Through the Dreamer lens: the Shield's design is the chronicle's most-protected canon. The diagnostic's inside/outside reading is a question only the Shield's author can answer. The Dreamer's chronicle position is canonically inaccessible from outside her Shield. The partial reading holds; the cosmic question waits.",
    },
  },
  {
    id: "resur.lens.cult_curated" as LensId,
    name: "The Cult-Curated Lens",
    category: "cult",
    deductionNarrationOverrides: {
      ["resur.e1.d.false_lead_seven_pointed_seventh_founder" as DeductionId]:
        "Through the cult-curated lens: the seven-pointed star on the Resurrectionist's case-file is a copyist's flourish. The Syndicate's six-pair roster is sacred and complete. The reading discipline of the cult is: where the canonical roster says six, only six exist. The chronicle obeys the discipline.",
      ["resur.e4.d.false_lead_twin_is_literal" as DeductionId]:
        "Through the cult-curated lens: the pre-Empire twin-text is cosmological metaphor. The taxonomy of Ne-Yons is canonical and self-contained. The cult's reading discipline rejects literal taxonomy where canon does not authorise it. The ruling on the speculative reading is the cult's ruling.",
    },
  },
  {
    id: "resur.lens.chronicle_discipline" as LensId,
    name: "The Antiquarian's Chronicle-Discipline Lens",
    category: "antiquarian",
    deductionNarrationOverrides: {
      ["resur.e5.d.vanished_legacy_endures" as DeductionId]:
        "Through the chronicle-discipline lens: the closing inscription is the chronicle's working settlement, not its final verdict. The Antiquarian's discipline is to record what the evidence supports and shelve what the evidence cannot reach. The Cycle Walker's case is shelved on this discipline. The shelving is not a verdict that no further evidence will arrive. It is the chronicle's pause between gatherings.",
    },
  },
];

/* ═══════════════════════════════════════════════════════
   MYSTERY DEFINITION
   ═══════════════════════════════════════════════════════ */

export const RESURRECTIONIST_CYCLE_WALKER_MYSTERY: MysteryDefinition = {
  id: ID,
  arcId: ARC,
  title: "The Resurrectionist — The Cycle Walker",
  summary:
    "The Resurrectionist Ne-Yon — Samsara's Child, the Cycle Walker — vanished from canonical record before the Second Fall of New Babylon. The protocols he authored continue to fire: Wraith Calder's six sanctuary resurrections, Akai Shi's transformation into the Red Death, the Wolf's Year-128,652 reanimation. The cult-curated record annotates his vanishing as confirmed; the chronicle's editorial hand has expressed preferences across every related case-file. Investigate the case. The closing inscription is sufficient; the speculative readings are recorded for the reader to weigh.",
  npcId: "resurrectionist",
  seed: {
    source: "manual",
    seedId: "resurrectionist.cycle_walker",
    templateId: TEMPLATE_NPC_ARC_TRIGGER,
    payload: { dlcId: "dlc_y2q4_cycle_walker", sealRequired: 4 },
  },
  episodes: [e1, e2, e3, e4, e5],
  suspects,
  lenses,
};
