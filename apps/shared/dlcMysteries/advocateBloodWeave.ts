/* ═══════════════════════════════════════════════════════
   THE ADVOCATE · THE BLOOD WEAVE — Mystery arc

   5 episodes. Premise: the Advocate is the canonical 9th
   Ne-Yon (LORE_BIBLE.md:1452-1490) — Late Empire, 15,900
   A.A., Status: "Active (though her humanity is lost)." She
   founded the Empire of Shadows and wielded the Blood Weave
   defensively to forge chains that could bind the demons. The
   war between the Advocate and the Hierarchy defines the Late
   Empire era (LORE_BIBLE.md:5352).

   The arc investigates four canonical facts and a fifth
   question:

     1. The Empire of Shadows — what it defended (E1)
     2. The Blood Weave — what it did, structurally (E2)
     3. Syl'Vex the Corruptor — the Advocate's cobalt-skinned
        Hierarchy-aligned dark mirror, "every option the
        Advocate refused" (LORE_BIBLE.md:4244-4310) — E3
     4. The Personal Cost — Status: humanity lost. What was
        traded for the Empire of Shadows? (E4)
     5. The Walk in Power — the closing inscription; the
        Advocate continues despite the cost (E5)

   Voice: the Antiquarian. The Advocate's own voice surfaces
   in surviving Empire-of-Shadows broadcasts; her recorded
   register is canonically register-three liturgical — "I do
   not advocate for myself. I advocate for what the chronicle
   has not yet learned to ask for."

   Canonical anchors (every claim cited):
     - LORE_BIBLE.md:1452-1490 (Advocate dossier; Empire of
       Shadows; Blood Weave; great personal cost; connections)
     - LORE_BIBLE.md:5352 (Late Empire war definition; Empire
       of Shadows as primary resistance to Hierarchy)
     - LORE_BIBLE.md:4244-4310 (Syl'Vex the Corruptor — dark
       mirror; "every option the Advocate refused")
     - LORE_BIBLE.md:4205 (Riri'Ahlia led siege of seven
       dimensions, driven back by Blood Weave binding chains)
     - LORE_BIBLE.md:5155 (Xeth'Raal: "the Advocate's
       sacrifice... recorded as a debt that could never be
       fully repaid")
     - CoNexus Story "The Ninth" (LORE_BIBLE.md:1490) —
       canonical Advocate-narrated story
     - Songs: Walk in Power (Silence in Heaven album); Shades
       of Grey, The Change Conspiracy, Usikue MSHY (Keep a
       Girl in School) — canonical Advocate-aligned music
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

const ARC = "arc.dlc.advocate_blood_weave" as ArcId;
const ID  = "advocate.blood_weave"          as MysteryId;

/* ═══════════════════════════════════════════════════════
   E1 — The Empire of Shadows
   ═══════════════════════════════════════════════════════ */

const e1: EpisodeDefinition = {
  id: "advocate.blood_weave.e1" as EpisodeId,
  arcId: ARC,
  ordinal: 1,
  title: "The Empire of Shadows",
  summary:
    "The Advocate founded the Empire of Shadows as the primary resistance to the Hierarchy of the Damned. Investigate the Empire operationally: what it defended, what its border looked like, and whose lives it sheltered. The case opens on the founding charter.",
  clues: [
    {
      id: "adv.e1.founding_charter" as ClueId,
      title: "The Empire of Shadows — Founding Charter",
      body:
        "The Empire of Shadows' founding charter, recovered from a sealed reliquary in the Antiquarian's library. The charter's first article reads: 'No soul under this charter's shelter may be acquired by hostile spiritual instrument without the Advocate's countersignature. The charter is the countersignature's prerequisite. The Empire is the charter's living guarantor.' The Advocate's signature is at the foot; six co-signatures follow it. Five names are legible. The sixth is intentionally redacted in the Advocate's own hand.",
      foundIn: "antiquarian-library",
    },
    {
      id: "adv.e1.shelter_records" as ClueId,
      title: "Empire of Shadows — Shelter Records (Partial)",
      body:
        "Partial shelter-records from three Empire-of-Shadows dimensions. Each record entry: a soul-name, a date of shelter granted, and a Blood-Weave binding signature affirming the shelter holds against Hierarchy acquisition. The aggregated totals run to the millions across the three dimensions. The Empire was not a faction in the political sense; it was an active defensive system at cosmic scale, maintaining shelter for every soul that requested it.",
      foundIn: "archives",
    },
    {
      id: "adv.e1.hierarchy_acquisition_attempts" as ClueId,
      title: "Hierarchy Acquisition-Attempt Log",
      body:
        "A log of Hierarchy-issued acquisition attempts during the Empire-of-Shadows era. The log's column-headers: target soul, hostile instrument deployed, Advocate countersignature held, outcome. Across seven recorded centuries: every acquisition attempt where the target carried Advocate-countersigned shelter is recorded outcome NULL. The Hierarchy did not succeed in a single recorded breach against a sheltered soul. The chronicle's most-load-bearing single defensive record.",
      foundIn: "war-room",
    },
    {
      id: "adv.e1.advocate_broadcast_register_three" as ClueId,
      title: "An Advocate Broadcast — Register Three (Liturgical)",
      body:
        "A surviving Empire-of-Shadows broadcast, registered in the Antiquarian's library: 'I do not advocate for myself. I advocate for what the chronicle has not yet learned to ask for. If a soul comes under my charter, the chronicle has accepted the soul as its own. The Empire does not consult the chronicle; the Empire is the chronicle's most-permissive front.' The broadcast is signed in the Advocate's voice; the register is unmistakably liturgical.",
      foundIn: "comms-array",
    },
  ],
  deductions: [
    {
      id: "adv.e1.d.empire_is_active_defensive_system" as DeductionId,
      clueA: "adv.e1.founding_charter" as ClueId,
      clueB: "adv.e1.hierarchy_acquisition_attempts" as ClueId,
      result: "correct",
      narrationId: "adv.e1.n.active_defensive_system",
      narrationProse:
        "The chronicle's verdict: the Empire of Shadows was an active defensive system at cosmic scale. The founding charter authorized soul-sheltering against hostile spiritual instruments; the acquisition-attempt log confirms the defense's operational success — no recorded breach of a sheltered soul. The Empire's purpose was sufficient; the case advances on the question of what the defense COST.",
      unlocksEpisode: "advocate.blood_weave.e2" as EpisodeId,
    },
    {
      id: "adv.e1.d.sixth_signatory_is_the_advocate_herself_again" as DeductionId,
      clueA: "adv.e1.founding_charter" as ClueId,
      clueB: "adv.e1.advocate_broadcast_register_three" as ClueId,
      result: "partial",
      narrationId: "adv.e1.n.sixth_partial",
      narrationProse:
        "The sixth founding-charter co-signatory is redacted in the Advocate's own hand. The chronicle's working theory: the redaction is self-applied — the Advocate counter-signed her own founding twice, in two capacities. The partial reading: the duplication is structural; one Advocate-signature is the founder; the other is the chronicle's permanent witness to the founding. The reading is consistent with the Advocate's register-three liturgical mode.",
    },
    {
      id: "adv.e1.d.false_lead_empire_was_political" as DeductionId,
      clueA: "adv.e1.shelter_records" as ClueId,
      clueB: "adv.e1.founding_charter" as ClueId,
      result: "false_lead_named",
      narrationId: "adv.e1.n.political_ruled_out",
      narrationProse:
        "A speculative reading: the Empire of Shadows was a political faction whose Hierarchy-resistance was opportunistic and territorial. The case-evidence DOES NOT SUPPORT this reading: the shelter records do not respect political borders; the charter's sheltering principle is universal in its declared scope; the broadcast register is liturgical, not factional. The chronicle rules the reading out.",
    },
  ],
  choices: [
    {
      id: "adv.e1.c.honor_the_defensive_canon" as ChoiceId,
      label:
        "Honor the chronicle's defensive-system canon — the Empire was what it claimed to be; the case proceeds to the operational mechanism.",
      weight: "conservative",
    },
    {
      id: "adv.e1.c.audit_the_sixth_signatory" as ChoiceId,
      label:
        "Audit the sixth signatory — even if the redaction is self-applied, the chronicle's discipline requires the redaction be named.",
      weight: "patient",
    },
    {
      id: "adv.e1.c.cross_arc_wraith_sheltering_lineage" as ChoiceId,
      label:
        "Trace the sheltering lineage to the Sanctuary's protocols — Wraith Calder's arc names protocols stolen from the Syndicate; the Empire's shelter-bindings predate the theft.",
      weight: "cross_arc_wraith",
    },
  ],
  contentBundle: {
    songId: "album5.t21",
    slideshowId: "album5.t21.empire_of_shadows",
    loredexUnlocks: [],
    conspiracyDiscoveries: [],
    dropAt: "episode_open",
  },
};

/* ═══════════════════════════════════════════════════════
   E2 — The Blood Weave
   ═══════════════════════════════════════════════════════ */

const e2: EpisodeDefinition = {
  id: "advocate.blood_weave.e2" as EpisodeId,
  arcId: ARC,
  ordinal: 2,
  title: "The Blood Weave",
  summary:
    "The Blood Weave is the Advocate's canonical instrument. She used it defensively to forge chains that bind the Hierarchy of the Damned (LORE_BIBLE.md:5352). Riri'Ahlia personally led the siege of seven dimensions and was driven back by the Weave's binding chains (LORE_BIBLE.md:4205). Investigate the Weave operationally: what it does, what fuels it, and what the binding looks like.",
  clues: [
    {
      id: "adv.e2.weave_specification_partial" as ClueId,
      title: "The Blood Weave — Partial Specification",
      body:
        "A partial specification of the Blood Weave, recovered from a Zyr'Koth research-archive (LORE_BIBLE.md:5217 — Hierarchy SVP R&D, Weave-derivative work). The specification's operational core: the Weave is a multi-layer binding fabric that ABSORBS cosmic-energy from its weaver to MATERIALIZE chains against hostile instruments. Energy in: weaver's own life-substrate. Energy out: chains that bind. The fabric does not regenerate — every binding consumes the weaver's substrate net.",
      foundIn: "forge-workshop",
    },
    {
      id: "adv.e2.riri_ahlia_siege_record" as ClueId,
      title: "The Siege of Seven Dimensions — Riri'Ahlia's Account",
      body:
        "Riri'Ahlia's own surviving account of the Empire-of-Shadows siege she led (LORE_BIBLE.md:4205): 'Seven dimensions, six advances, one final reverse. I had the Hierarchy's organizational doctrine and the corporate-machine's resources. The Advocate had less than I had at every operational scale. The Advocate had MORE only in one resource: she was willing to spend herself. I was not willing to spend myself; my doctrine forbids it. Her doctrine REQUIRED it. She drove me back with chains forged from her own substrate. The chains held. I retreated. The Empire of Shadows held its border.'",
      foundIn: "war-room",
    },
    {
      id: "adv.e2.zyrkoth_severance_protocol_lineage" as ClueId,
      title: "Zyr'Koth's Severance Protocol — Lineage Note",
      body:
        "A lineage note in Zyr'Koth's research index: 'The Severance Protocol is the Blood Weave's offensive inversion. Where the Advocate wove substrate into defensive chains, the Severance Protocol weaves substrate into offensive separations. The Weave is technically older. The Protocol is technically more refined. Both share the substrate-consumption signature.' The note is precise; it does not name the substrate's specific composition.",
      foundIn: "engineering-core",
    },
    {
      id: "adv.e2.empire_casualty_zero" as ClueId,
      title: "Empire of Shadows — Defender Casualty Record",
      body:
        "The Empire of Shadows' defender casualty record across the siege of seven dimensions: zero combatants killed. Zero sheltered souls breached. One combatant operationally redirected from active service to the Advocate's personal care detail — name redacted, status 'permanent care.' The record's footnote: 'the substrate cost of the defense was not levied on the combatants. The substrate cost of the defense was levied on the Advocate.'",
      foundIn: "medical-bay",
    },
  ],
  deductions: [
    {
      id: "adv.e2.d.weave_is_self_consuming_defense" as DeductionId,
      clueA: "adv.e2.weave_specification_partial" as ClueId,
      clueB: "adv.e2.riri_ahlia_siege_record" as ClueId,
      result: "correct",
      narrationId: "adv.e2.n.self_consuming_defense",
      narrationProse:
        "The chronicle's verdict: the Blood Weave is a self-consuming defensive instrument. The Advocate's substrate is the fuel; the binding chains are the product; the defense's success is the Empire's continued shelter; the substrate's depletion is the Advocate's personal cost. Riri'Ahlia's own account confirms what the dossier's 'great personal cost' phrasing under-describes: the Advocate spent her own life-substrate to drive the Hierarchy back. The case advances on what was spent.",
      unlocksEpisode: "advocate.blood_weave.e3" as EpisodeId,
    },
    {
      id: "adv.e2.d.zerocasualty_is_one_substitution" as DeductionId,
      clueA: "adv.e2.empire_casualty_zero" as ClueId,
      clueB: "adv.e2.weave_specification_partial" as ClueId,
      result: "partial",
      narrationId: "adv.e2.n.substitution_partial",
      narrationProse:
        "The zero-casualty defender record carries one footnote: a combatant redirected to permanent care, name redacted. The footnote's substrate-cost language is structural, not metaphorical. The partial reading: at least one Empire combatant absorbed Weave-cost on the Advocate's behalf; the redirection from combat to care is the cost's operational ledger. The Empire defended without losing combatants; the chronicle does not record what 'permanent care' means in substrate terms.",
    },
    {
      id: "adv.e2.d.false_lead_weave_is_external_borrowed" as DeductionId,
      clueA: "adv.e2.zyrkoth_severance_protocol_lineage" as ClueId,
      clueB: "adv.e2.weave_specification_partial" as ClueId,
      result: "false_lead_named",
      narrationId: "adv.e2.n.borrowed_substrate_ruled_out",
      narrationProse:
        "A speculative reading: the Blood Weave consumes external substrate (the Hierarchy's own demonic energy, for instance) and the 'great personal cost' language is metaphorical or factional propaganda. The case-evidence DOES NOT SUPPORT this reading: Riri'Ahlia's own account confirms the Advocate spent herself; Zyr'Koth's lineage note identifies the substrate-consumption signature as shared between Weave and Protocol; the casualty record's footnote substantiates the cost. The chronicle rules the reading out.",
    },
  ],
  choices: [
    {
      id: "adv.e2.c.read_the_riri_account_as_witness" as ChoiceId,
      label:
        "Read Riri'Ahlia's account as canonical witness — a Hierarchy COO does not give credit casually; the Weave's mechanism is settled.",
      weight: "patient",
    },
    {
      id: "adv.e2.c.cross_arc_game_master_hierarchy_research" as ChoiceId,
      label:
        "Carry Zyr'Koth's lineage note to the Game Master arc — his research-archive is part of the Hierarchy's R&D corpus; the cross-arc binding may surface more.",
      weight: "cross_arc_game_master",
    },
    {
      id: "adv.e2.c.cross_arc_seer_substrate_visibility" as ChoiceId,
      label:
        "Petition the Seer's archive on substrate-cost visibility — her prophecies span the Advocate's era; she may have recorded the cost the Empire could not.",
      weight: "cross_arc_seer",
    },
  ],
  contentBundle: {
    songId: "album5.t22",
    slideshowId: "album5.t22.blood_weave",
    loredexUnlocks: [],
    conspiracyDiscoveries: [],
    dropAt: "episode_mid",
  },
};

/* ═══════════════════════════════════════════════════════
   E3 — The Mirror
   ═══════════════════════════════════════════════════════ */

const e3: EpisodeDefinition = {
  id: "advocate.blood_weave.e3" as EpisodeId,
  arcId: ARC,
  ordinal: 3,
  title: "The Mirror",
  summary:
    "Syl'Vex the Corruptor — cobalt-skinned, amber-red eyes, wears the Advocate's face exactly because she is, precisely, every option the Advocate refused (LORE_BIBLE.md:4257). The Hierarchy's SVP HR; the Advocate's dark mirror. Investigate the mirror canon. What does the Advocate's refusal look like, and what does Syl'Vex's acceptance look like in operational contrast.",
  clues: [
    {
      id: "adv.e3.sylvex_recruitment_pitch" as ClueId,
      title: "Syl'Vex's Recruitment-Pitch Transcript",
      body:
        "A transcript of Syl'Vex's recruitment pitch to one of the Advocate's generals (LORE_BIBLE.md:4281 — Syl'Vex turned three of the Advocate's own generals against her, not through threats but through genuine friendship). The pitch's operational structure: 'You have spent yourself defending. The Advocate's instrument requires this from you. My instrument requires a comfortable seat and a fair hearing of your fatigue. Both instruments produce results. Mine is gentler. Gentleness is not a weakness; it is an option the Advocate's doctrine forbade her from offering you. I am offering it.'",
      foundIn: "social-hub",
    },
    {
      id: "adv.e3.sealed_sacrum_record" as ClueId,
      title: "The Sacrum — Sealed Record",
      body:
        "The Sacrum is a canonical reliquary the Advocate sealed and Syl'Vex unsealed (LORE_BIBLE.md:4257). The sealed-record summary in the Antiquarian's library: the Sacrum contains a class of Weave-derivative bindings the Advocate elected not to use. The bindings would have shortened the Empire-of-Shadows defense by centuries but at a cost to the bound souls' agency. The Advocate sealed them. Syl'Vex unsealed them — and uses them as the operational core of HR's recruitment-as-relief doctrine. The Sacrum's contents are canon; the doctrine derived from them is the Hierarchy's most efficient soul-acquisition pathway.",
      foundIn: "shadow-vault",
    },
    {
      id: "adv.e3.three_generals_post_defection" as ClueId,
      title: "The Three Generals — Post-Defection Logs",
      body:
        "Post-defection logs from the three Advocate-generals Syl'Vex recruited. Each general reports the recruitment as 'a relief that did not feel like betrayal.' Each general continues to do operational work the Advocate would not authorise. Each general's substrate is preserved at full; the Hierarchy's HR instrument has performed exactly what Syl'Vex's pitch promised. The recruitment is canonically successful and canonically corrupting. Both readings are true.",
      foundIn: "captains-quarters",
    },
    {
      id: "adv.e3.advocates_response_to_defections" as ClueId,
      title: "The Advocate's Response to the Defections",
      body:
        "The Advocate's recorded response, register-three: 'The three are not lost. They have chosen comfort, which is an option. The chronicle records their choice. The chronicle does not retract their Empire-of-Shadows shelter; the shelter is unconditional. They walk under my charter still. I do not advocate for their return. I advocate for what they were when they chose.' The broadcast is signed; the position is unmovable. The defectors retain their Advocate-countersigned shelter against Hierarchy acquisition.",
      foundIn: "comms-array",
    },
  ],
  deductions: [
    {
      id: "adv.e3.d.mirror_is_the_refused_option" as DeductionId,
      clueA: "adv.e3.sylvex_recruitment_pitch" as ClueId,
      clueB: "adv.e3.sealed_sacrum_record" as ClueId,
      result: "correct",
      narrationId: "adv.e3.n.refused_option",
      narrationProse:
        "The chronicle's verdict: Syl'Vex IS every option the Advocate refused. The Sacrum's sealed bindings — agency-cost bindings that would have shortened the defense — are the operational core of Syl'Vex's recruitment doctrine. The Advocate sealed them on principle. Syl'Vex unsealed them on operational efficiency. The mirror is not a contradiction; it is the Advocate's discipline made visible by its refusal. The case advances on the position the discipline cost her.",
      unlocksEpisode: "advocate.blood_weave.e4" as EpisodeId,
    },
    {
      id: "adv.e3.d.advocates_shelter_is_unconditional" as DeductionId,
      clueA: "adv.e3.advocates_response_to_defections" as ClueId,
      clueB: "adv.e3.three_generals_post_defection" as ClueId,
      result: "partial",
      narrationId: "adv.e3.n.unconditional_shelter_partial",
      narrationProse:
        "The Advocate retains the defectors' Empire-of-Shadows shelter against Hierarchy acquisition even though they now operate under Hierarchy doctrine. The shelter is unconditional within the charter. The partial reading: the unconditional shelter is the Empire's most-radical doctrinal commitment; the Advocate has accepted that her defenders may choose her opposite and still be sheltered by her charter. The chronicle records the commitment as both Empire-load-bearing and Advocate-personally-costly.",
    },
    {
      id: "adv.e3.d.false_lead_sylvex_is_a_separate_person" as DeductionId,
      clueA: "adv.e3.sylvex_recruitment_pitch" as ClueId,
      clueB: "adv.e3.advocates_response_to_defections" as ClueId,
      result: "false_lead_named",
      narrationId: "adv.e3.n.separate_person_ruled_out",
      narrationProse:
        "A speculative reading: Syl'Vex and the Advocate are independently-emerged entities whose facial similarity is coincidental and whose operational opposition is factional rather than mirror-canonical. The case-evidence DOES NOT SUPPORT this reading: canon explicitly names Syl'Vex 'the Advocate's dark mirror' (LORE_BIBLE.md:4244); 'wears the Advocate's face exactly' (LORE_BIBLE.md:4257); 'every option the Advocate refused' — three independent canonical statements name the mirror-relationship. The chronicle rules the reading out.",
    },
  ],
  choices: [
    {
      id: "adv.e3.c.honor_the_unconditional_shelter" as ChoiceId,
      label:
        "Honor the Advocate's unconditional-shelter doctrine — the Empire's most-load-bearing principle; the chronicle inscribes it as canonical.",
      weight: "patient",
    },
    {
      id: "adv.e3.c.audit_the_sacrum_inventory" as ChoiceId,
      label:
        "Audit the Sacrum's surviving inventory — Syl'Vex unsealed it; what remains in the reliquary is what the Advocate refused EVEN with Syl'Vex's operational pressure.",
      weight: "conservative",
    },
    {
      id: "adv.e3.c.cross_arc_degen_charter_comparison" as ChoiceId,
      label:
        "Compare the Advocate's charter to the Degen's casino-contract framework — both are unconditional binding instruments authored at Ne-Yon scale; the methodology comparison may surface more.",
      weight: "cross_arc_degen",
    },
  ],
  contentBundle: {
    songId: "album5.t23",
    slideshowId: "album5.t23.mirror",
    loredexUnlocks: [],
    conspiracyDiscoveries: [],
    dropAt: "episode_mid",
  },
};

/* ═══════════════════════════════════════════════════════
   E4 — The Personal Cost
   ═══════════════════════════════════════════════════════ */

const e4: EpisodeDefinition = {
  id: "advocate.blood_weave.e4" as EpisodeId,
  arcId: ARC,
  ordinal: 4,
  title: "The Personal Cost",
  summary:
    "Status: 'Active (though her humanity is lost).' Investigate what was lost. The Advocate's humanity is canonically not extinguished but TRADED — for the Empire of Shadows, the Blood Weave's bindings, the unconditional shelter. The case asks what humanity means in Ne-Yon-scale accounting and what the trade's specific receipt looks like.",
  clues: [
    {
      id: "adv.e4.xethraal_debt_ledger" as ClueId,
      title: "Xeth'Raal's Debt Ledger — Advocate Entry",
      body:
        "Xeth'Raal — Hierarchy CFO, Chief Financial Officer of Souls (LORE_BIBLE.md:5151-5189) — kept a debt ledger that survives in partial. The Advocate's entry: 'sacrifice... recorded as a debt that could never be fully repaid.' The ledger's operational structure: Xeth'Raal records the Advocate's spent-substrate as a debt against the Hierarchy's books — a debt the Hierarchy treats as permanent because the Advocate has no recoverable substrate to repay it with. The debt is Xeth'Raal's most-elegant Advocate-class instrument.",
      foundIn: "guild-sanctum",
    },
    {
      id: "adv.e4.humanity_trade_specification" as ClueId,
      title: "Humanity-Trade — Operational Specification",
      body:
        "An operational specification from the Empire of Shadows' own records: the Advocate's humanity-trade is multi-component. Component one: capacity for spontaneous mortal-scale emotional response — surrendered to power the Weave's bindings. Component two: continuity-of-personal-time — Ne-Yon timescale operation replaced mortal-timescale operation. Component three: capacity for unsheltered fear — the unconditional charter cannot be authored from inside fear. The specification does not name what was retained. The chronicle's reading: she retained the parts of humanity her charter REQUIRED to remain Advocate; she traded the parts it required her to spend.",
      foundIn: "antiquarian-library",
    },
    {
      id: "adv.e4.ninth_conexus_story" as ClueId,
      title: "CoNexus Story — 'The Ninth' (Advocate-Narrated)",
      body:
        "The Advocate's canonical CoNexus story (LORE_BIBLE.md:1490) — 'The Ninth.' The story's frame: an Advocate-narrated meditation on the ninth position in cosmic-principle entity rosters; on the position's loneliness; on the substrate-cost of being the ninth. The story does not stage a plot. It stages a position. The position's hardest line: 'I am not lonely because I have lost what I traded. I am lonely because what remains has no second.' The story is canonically Advocate-authored.",
      foundIn: "oracle-sanctum",
    },
    {
      id: "adv.e4.walk_in_power_lyric_record" as ClueId,
      title: "'Walk in Power' — Lyric Record (Advocate + Human duet)",
      body:
        "The 'Walk in Power' lyric record (Silence in Heaven album). Canonical duet: the Advocate and the Human declare their refusal to be diminished (LORE_BIBLE.md:4332). The song is the Empire-of-Shadows era's most-broadcast resistance anthem. The lyric's structural position: the Advocate's loss is named; the loss is not a defeat; the walk continues; the chronicle records what walks, not what was lost. The Human duets because the canon's resistance position is shared, not isolated.",
      foundIn: "comms-array",
    },
  ],
  deductions: [
    {
      id: "adv.e4.d.humanity_was_spent_not_lost" as DeductionId,
      clueA: "adv.e4.humanity_trade_specification" as ClueId,
      clueB: "adv.e4.ninth_conexus_story" as ClueId,
      result: "correct",
      narrationId: "adv.e4.n.spent_not_lost",
      narrationProse:
        "The chronicle's verdict: the Advocate's humanity was spent, not lost. The trade-specification names the components; the CoNexus story 'The Ninth' names the position; the chronicle's status entry — 'Active (though her humanity is lost)' — under-describes the spending. The Advocate did not lose what she traded; she chose what to spend and remains the only Ne-Yon canonically described in continuous-spending tense. The case advances on what continues.",
      unlocksEpisode: "advocate.blood_weave.e5" as EpisodeId,
    },
    {
      id: "adv.e4.d.debt_is_permanent_collateral" as DeductionId,
      clueA: "adv.e4.xethraal_debt_ledger" as ClueId,
      clueB: "adv.e4.humanity_trade_specification" as ClueId,
      result: "partial",
      narrationId: "adv.e4.n.debt_collateral_partial",
      narrationProse:
        "Xeth'Raal's debt ledger holds the Advocate's spent-substrate as permanent collateral. The partial reading: as long as the debt exists, the Hierarchy holds a structural lien on the Advocate's cosmic position. The lien's enforceability is uncertain — Xeth'Raal records debts to make them durable, not always to collect them — but the lien is operationally present. The chronicle records the partial position and proceeds.",
    },
    {
      id: "adv.e4.d.false_lead_humanity_can_be_returned" as DeductionId,
      clueA: "adv.e4.walk_in_power_lyric_record" as ClueId,
      clueB: "adv.e4.humanity_trade_specification" as ClueId,
      result: "false_lead_named",
      narrationId: "adv.e4.n.return_ruled_out",
      narrationProse:
        "A speculative reading: the Advocate's traded humanity can be returned by reversing the Blood Weave's substrate flow — the Empire of Shadows could be wound down, the bindings released, the substrate refunded to the Advocate. The case-evidence DOES NOT SUPPORT this reading: the trade-specification's components include continuity-of-personal-time (Ne-Yon-timescale operation), which is structural; the Empire's unconditional shelter cannot be wound down without breaching the charter; 'Walk in Power' explicitly stages the walk as continuing despite the loss, not as a path to recovery. The chronicle rules the reading out.",
    },
  ],
  choices: [
    {
      id: "adv.e4.c.inscribe_the_spending_as_canonical" as ChoiceId,
      label:
        "Inscribe the spending as canonical — the Advocate's humanity is not a deficit; it is the form her advocacy now takes.",
      weight: "patient",
    },
    {
      id: "adv.e4.c.audit_the_xethraal_lien_durability" as ChoiceId,
      label:
        "Audit the durability of Xeth'Raal's lien — if the Advocate is canonically Active, the lien's enforceability deserves the chronicle's attention.",
      weight: "conservative",
    },
    {
      id: "adv.e4.c.cross_arc_human_walk_in_power_anchor" as ChoiceId,
      label:
        "Cross-bind to the Human's arc — the 'Walk in Power' duet stages the Advocate's loss alongside the Human's; the cross-arc anchor formalizes the canonical pairing.",
      weight: "cross_arc_game_master",
    },
  ],
  contentBundle: {
    songId: "album5.t24",
    slideshowId: "album5.t24.personal_cost",
    loredexUnlocks: [],
    conspiracyDiscoveries: [],
    dropAt: "episode_mid",
  },
};

/* ═══════════════════════════════════════════════════════
   E5 — Walk in Power
   ═══════════════════════════════════════════════════════ */

const e5: EpisodeDefinition = {
  id: "advocate.blood_weave.e5" as EpisodeId,
  arcId: ARC,
  ordinal: 5,
  title: "Walk in Power",
  summary:
    "The Antiquarian closes the case on the Advocate. The verdict: she stands, still, in the position she spent everything to hold. The Empire shelters. The Weave binds. The mirror watches. The walk continues. The chronicle inscribes the inscription.",
  clues: [
    {
      id: "adv.e5.empire_status_current" as ClueId,
      title: "The Empire of Shadows — Current Status",
      body:
        "The Empire of Shadows' current status, per the most recent available chronicle-update: the charter holds. The bindings on the Hierarchy's named demon lords (Mol'Garath, Xeth'Raal, Zyr'Koth, Ith'Rael, Riri'Ahlia, Syl'Vex, Drael'Mon, Varkul, Fenra, Mol'Vereth) are operationally intact — the chains forged in the seven-dimensions siege still bind. The Hierarchy operates within the Weave's constraints; the Empire's defensive system remains active. The Advocate has not retired the charter.",
      foundIn: "war-room",
    },
    {
      id: "adv.e5.advocate_position_current" as ClueId,
      title: "The Advocate's Position — Current",
      body:
        "The Advocate's current position, per the chronicle's most recent register-three broadcast: 'I have not stopped. I will not stop. The chronicle does not require my completeness. The chronicle requires my continuance. I continue. The Empire continues. The walk continues.' The broadcast is signed in her hand. The chronicle's reading: she is operationally Active, status-canonically still under the 'though her humanity is lost' modifier, and chronicle-canonically still the chronicle's most-load-bearing defender.",
      foundIn: "comms-array",
    },
    {
      id: "adv.e5.three_generals_current" as ClueId,
      title: "The Three Generals — Current Status",
      body:
        "The three Empire-of-Shadows generals Syl'Vex recruited continue to operate under Hierarchy doctrine. Their Advocate-countersigned shelter remains unconditional. None have been Hierarchy-acquired despite operating under Hierarchy doctrine. The chronicle's reading: the Advocate's charter is operationally enforceable across factional crossings; her shelter is the strongest defensive instrument the chronicle has documented at cosmic scale.",
      foundIn: "captains-quarters",
    },
    {
      id: "adv.e5.closing_walk_in_power_broadcast" as ClueId,
      title: "Closing Broadcast — 'Walk in Power' (Duet, Final Cadence)",
      body:
        "The closing broadcast captured at the case's closure interval: the 'Walk in Power' duet's final cadence, captured live from a current Empire-of-Shadows transmission tower. The Advocate's voice carries the verse; the Human's voice carries the chorus; the cadence holds across the chronicle's measured timing. The Antiquarian's library catalogues the recording as canonical closure for this arc. The walk continues; the case inscribes its inscription.",
      foundIn: "antiquarian-library",
    },
  ],
  deductions: [
    {
      id: "adv.e5.d.the_walk_continues" as DeductionId,
      clueA: "adv.e5.empire_status_current" as ClueId,
      clueB: "adv.e5.advocate_position_current" as ClueId,
      result: "correct",
      narrationId: "adv.e5.n.the_walk_continues",
      narrationProse:
        "The chronicle's closing verdict: the walk continues. The Empire of Shadows holds the charter; the Blood Weave's chains hold the Hierarchy; the Advocate holds her position. She spent what she chose to spend. The chronicle records what she chose. The closing inscription is sufficient. The case closes. The walk does not.",
    },
    {
      id: "adv.e5.d.three_generals_prove_the_charter" as DeductionId,
      clueA: "adv.e5.three_generals_current" as ClueId,
      clueB: "adv.e5.empire_status_current" as ClueId,
      result: "partial",
      narrationId: "adv.e5.n.charter_proof_partial",
      narrationProse:
        "The three generals' continued unconditional shelter while operating under Hierarchy doctrine is the charter's most-falsifiable claim. The chronicle has not falsified it. The partial reading: the charter's operational enforceability is the case's most-impressive single result. The Advocate's defensive instrument is canonically more durable than her own faction's loyalty. The chronicle records the position and proceeds.",
    },
    {
      id: "adv.e5.d.false_lead_advocate_will_eventually_stop" as DeductionId,
      clueA: "adv.e5.advocate_position_current" as ClueId,
      clueB: "adv.e5.closing_walk_in_power_broadcast" as ClueId,
      result: "false_lead_named",
      narrationId: "adv.e5.n.will_stop_ruled_out",
      narrationProse:
        "A speculative reading: the Advocate's continuous-spending tense is finite; at some chronicle-future moment, the substrate-debt will exhaust her and the Empire will collapse. The case-evidence DOES NOT SUPPORT this reading: the closing broadcast is current; the Advocate's register-three position is the chronicle's most-durable single statement of continuance; the Empire's charter is operationally intact across centuries. The chronicle rules the reading out. The Antiquarian records the ruling. The case closes on the walk's continuance.",
    },
  ],
  choices: [
    {
      id: "adv.e5.c.endorse_the_walk_continues" as ChoiceId,
      label:
        "Endorse the closing verdict — the walk continues; the chronicle inscribes the inscription; the case closes; the Empire holds.",
      weight: "conservative",
    },
    {
      id: "adv.e5.c.inscribe_the_three_generals_position" as ChoiceId,
      label:
        "Inscribe the three generals' position as the charter's operational proof — the chronicle's most-durable defensive instrument deserves its own line in the inscription.",
      weight: "patient",
    },
    {
      id: "adv.e5.c.cross_arc_wraith_walk_in_long_mourning" as ChoiceId,
      label:
        "Carry the 'Walk in Power' broadcast to Wraith's Long Mourning ceremony — the daily-names tradition welcomes the cadence; the chronicle's resistance has a place at the inscription table.",
      weight: "cross_arc_wraith",
    },
  ],
  contentBundle: {
    songId: "album5.t25",
    slideshowId: "album5.t25.walk_in_power",
    loredexUnlocks: [],
    conspiracyDiscoveries: ["advocate.empire.case_closes_walk_continues"],
    dropAt: "episode_close",
  },
};

/* ═══════════════════════════════════════════════════════
   SUSPECTS + LENSES
   ═══════════════════════════════════════════════════════ */

const suspects: ReadonlyArray<SuspectGraphNode> = [
  {
    id: "adv.s.the_advocate" as SuspectId,
    name: "The Advocate (Ne-Yon — Founder of the Empire of Shadows)",
    type: "person",
    relations: [
      { to: "adv.s.empire_of_shadows" as SuspectId, relation: "founded" },
      { to: "adv.s.blood_weave" as SuspectId, relation: "wields" },
      { to: "adv.s.sylvex" as SuspectId, relation: "dark-mirrored-by" },
      { to: "adv.s.xethraal" as SuspectId, relation: "debt-ledgered-by" },
    ],
  },
  {
    id: "adv.s.sylvex" as SuspectId,
    name: "Syl'Vex the Corruptor (Hierarchy SVP HR — the Advocate's dark mirror)",
    type: "person",
    relations: [
      {
        to: "adv.s.the_advocate" as SuspectId,
        relation: "wears-the-face-of",
      },
      { to: "adv.s.sacrum" as SuspectId, relation: "unsealed" },
    ],
  },
  {
    id: "adv.s.xethraal" as SuspectId,
    name: "Xeth'Raal the Debt Collector (Hierarchy CFO)",
    type: "person",
    relations: [
      {
        to: "adv.s.the_advocate" as SuspectId,
        relation: "holds-permanent-debt-on",
      },
    ],
  },
  {
    id: "adv.s.riri_ahlia" as SuspectId,
    name: "Riri'Ahlia the Taskmaster (Hierarchy COO — led siege of seven dimensions)",
    type: "person",
    relations: [
      {
        to: "adv.s.blood_weave" as SuspectId,
        relation: "driven-back-by-the-bindings-of",
      },
    ],
  },
  {
    id: "adv.s.empire_of_shadows" as SuspectId,
    name: "The Empire of Shadows (sheltering charter)",
    type: "place",
    relations: [],
  },
  {
    id: "adv.s.blood_weave" as SuspectId,
    name: "The Blood Weave (self-consuming defensive instrument)",
    type: "object",
    relations: [],
  },
  {
    id: "adv.s.sacrum" as SuspectId,
    name: "The Sacrum (sealed reliquary of refused bindings)",
    type: "object",
    relations: [],
  },
  {
    id: "adv.s.the_human" as SuspectId,
    name: "The Human (the last Archon; Advocate's 'Walk in Power' duet partner)",
    type: "person",
    relations: [],
  },
];

const lenses: ReadonlyArray<LensDefinition> = [
  {
    id: "adv.lens.empire_defensive_doctrine" as LensId,
    name: "The Empire-Defensive-Doctrine Lens",
    category: "advocate-aligned",
    deductionNarrationOverrides: {
      ["adv.e3.d.advocates_shelter_is_unconditional" as DeductionId]:
        "Through the Empire-defensive-doctrine lens: the unconditional shelter is the chronicle's purest defensive instrument. Shelter that demands loyalty is not shelter; it is bargaining. The Advocate's charter refuses the bargain. The Empire is the chronicle's working answer to the question of what defense looks like when it asks nothing in return.",
    },
  },
  {
    id: "adv.lens.hierarchy_accountant" as LensId,
    name: "The Hierarchy-Accountant Lens",
    category: "hierarchy-aligned",
    deductionNarrationOverrides: {
      ["adv.e4.d.debt_is_permanent_collateral" as DeductionId]:
        "Through the Hierarchy-accountant lens: Xeth'Raal's lien is the most-elegant trade the Hierarchy ever made. The Advocate's substrate is permanent collateral; the lien's enforceability is irrelevant; the lien EXISTS, and existence is sufficient for the corporate ledger. The Hierarchy treats the Advocate's spent humanity as a perpetual asset.",
    },
  },
  {
    id: "adv.lens.chronicle_discipline" as LensId,
    name: "The Antiquarian's Chronicle-Discipline Lens",
    category: "antiquarian",
    deductionNarrationOverrides: {
      ["adv.e5.d.the_walk_continues" as DeductionId]:
        "Through the chronicle-discipline lens: the closing inscription is the chronicle's most-cautious form of praise. The discipline does not glorify; the discipline records. What the discipline records, when it has been honest, is sufficient. The walk continues. The case closes. The discipline holds.",
    },
  },
];

/* ═══════════════════════════════════════════════════════
   MYSTERY DEFINITION
   ═══════════════════════════════════════════════════════ */

export const ADVOCATE_BLOOD_WEAVE_MYSTERY: MysteryDefinition = {
  id: ID,
  arcId: ARC,
  title: "The Advocate — The Blood Weave",
  summary:
    "The Advocate is the canonical 9th Ne-Yon. She founded the Empire of Shadows as the primary resistance to the Hierarchy of the Damned. She wielded the Blood Weave defensively to forge chains that bound the demons across seven dimensions. The cost — her humanity — was substrate-spent for the chains' binding. Investigate the Empire's charter, the Weave's mechanism, Syl'Vex's mirror, the personal cost, and the walk that continues despite the spending. The case closes on a verdict the Advocate could not have authored herself: she is the chronicle's most-load-bearing defender.",
  npcId: "the_advocate",
  seed: {
    source: "manual",
    seedId: "advocate.blood_weave",
    templateId: TEMPLATE_NPC_ARC_TRIGGER,
    payload: { dlcId: "dlc_y2q4_advocate_weave", sealRequired: 3 },
  },
  episodes: [e1, e2, e3, e4, e5],
  suspects,
  lenses,
};
