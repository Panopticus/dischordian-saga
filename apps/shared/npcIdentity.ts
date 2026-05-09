/* ═══════════════════════════════════════════════════════
   NPC IDENTITY — per-named-NPC companion identity

   Mirror of apprenticeIdentity.ts for the 12 named NPCs that
   live deep enough in the lore to deserve full BioWare-style
   authoring (likes / dislikes / wants / avoids / personal
   quest chain / breaking-point line).

   The 12 NPCs split across two tiers:

     Tier 2 — Deep-lore non-recruitable NPCs. Present-day
     figures the player can dialogue with at length. Full
     3-stage personal quest, breaking-point at stage 3.

       the_antiquarian   — Daniel Cross, archive curator
       the_seer          — precognitive pedagogue
       the_necromancer   — name-keeper of the cycle
       engineer_zero     — first witness, calibration ascetic
       iron_lion_prefall — pre-Fall cadre standard
       drael_mon         — Hierarchy Acquisitions, harvester

     Tier 3 — Cosmic / mythic figures. Single-encounter
     resolution at stage 1; the "personal quest" is one
     authored beat rather than a 3-stage chain.

       the_architect      — designer of Samsara
       the_dreamer        — dreams the cycle into existence
       the_source         — origin signal in the substrate
       the_degen          — 8th Ne-Yon, bartender mediator
       the_game_master    — Archon X, plural successors
       the_resurrectionist — Ne-Yon Cycle Walker (Ne-Yon)

   Voice anchors come from apps/shared/npcs/bibles/ where they
   exist; otherwise from docs/built/LORE_BIBLE.md sections.
   Every line should pass the bible's voice rules.
   ═══════════════════════════════════════════════════════ */

import type { PersonalQuestSubtaskRef } from "./personalQuestSubtasks";

export const NAMED_NPC_KEYS = [
  // Tier 2 — present-day
  "the_antiquarian",
  "the_seer",
  "the_necromancer",
  "engineer_zero",
  "iron_lion_prefall",
  "drael_mon",
  // Tier 3 — cosmic / mythic
  "the_architect",
  "the_dreamer",
  "the_source",
  "the_degen",
  "the_game_master",
  "the_resurrectionist",
] as const;

export type NamedNpcKey = (typeof NAMED_NPC_KEYS)[number];

export type NpcTier = "2" | "3";

export interface NpcPersonalQuestStage {
  title: string;
  description: string;
  /** Optional sub-tasks the player must complete to advance past this
   *  stage. Validated by apprenticeQuestSubtaskService.evaluateAll().
   *  Empty array means stage advance gates only on bond / encounter. */
  subtasks?: PersonalQuestSubtaskRef[];
}

export interface NpcPersonalQuestBreakingPoint extends NpcPersonalQuestStage {
  deepenChoice: { label: string; consequence: string };
  breakChoice: { label: string; consequence: string };
}

export interface NpcIdentity {
  npcKey: NamedNpcKey;
  /** Human-readable display name (player-facing). */
  displayName: string;
  /** Short epithet — appears under the name on dialogue panels. */
  epithet: string;
  tier: NpcTier;
  /** Gifts they value highly. +bond when given. */
  likes: string[];
  /** Gifts that hurt the bond when given. */
  dislikes: string[];
  /** What this NPC always wants — surfaces as agenda goals. */
  wants: string[];
  /** What this NPC actively avoids — surfaces as tension scenes. */
  avoids: string[];
  /** Personal-quest chain. Tier-2 has 3 stages; tier-3 has stage 1
   *  only (single-encounter cosmic figures). */
  personalQuest: {
    chainTitle: string;
    stage1: NpcPersonalQuestStage;
    /** Tier-2 only. Cosmic figures resolve at stage 1. */
    stage2?: NpcPersonalQuestStage;
    stage3?: NpcPersonalQuestBreakingPoint;
  };
  /** The line they say at their breaking point (or, for cosmic
   *  figures, the line they say at the single resolving encounter). */
  signatureLine: string;
}

/* ═══════════════════════════════════════════════════════════
   TIER 2 — DEEP-LORE NPCS
   ═══════════════════════════════════════════════════════════ */

const ANTIQUARIAN_IDENTITY: NpcIdentity = {
  npcKey: "the_antiquarian",
  displayName: "Daniel Cross",
  epithet: "The Antiquarian",
  tier: "2",
  likes: [
    "rare_codex",
    "annotated_footnote",
    "banned_text_marginalia",
    "uncited_correction",
    "bibliographic_index_card",
  ],
  dislikes: [
    "forced_canon",
    "uncited_assertion",
    "burned_book",
    "verbal_summary",
    "performance_review",
  ],
  wants: [
    "cross_reference_a_page",
    "complete_a_citation",
    "shelve_a_returned_volume",
  ],
  avoids: [
    "physical_urgency",
    "argument_by_intuition",
    "round_numbers",
  ],
  personalQuest: {
    chainTitle: "The Margin That Asks",
    stage1: {
      title: "The Returned Volume",
      description:
        "A book has been returned to the Refuge with three margin notes Cross does not recognize. He wants you to read the marked pages and tell him whether the annotator was a Coda agent, a Hierarchy auditor, or a Thalorian apprentice. The wrong attribution will be filed; he asks you to be careful.",
      subtasks: [
        { id: "ant_s1_read_loredex", type: "loredex_read", targetId: "antiquarian_marginalia_protocol", label: "Read the loredex entry on Antiquarian marginalia protocol." },
        { id: "ant_s1_witness_scene", type: "commons_scene_witnessed", targetId: "commons_antiquarian_shelving", label: "Witness Cross at the Commons shelving rite." },
        { id: "ant_s1_dialogue", type: "dialogue_topic_played", targetId: "the_antiquarian_past", label: "Play Cross's 'past' dialogue to Stage 25 bond." },
      ],
    },
    stage2: {
      title: "The Cross-Reference",
      description:
        "Cross's working bibliography has a gap — three citations that all converge on a single name nobody has written down. He suspects the Authority redacted the entry. He wants you to verify against three independent sources and confirm the redaction.",
      subtasks: [
        { id: "ant_s2_loredex_a", type: "loredex_read", targetId: "authority_redaction_signature_3", label: "Read the loredex entry on Authority redaction signatures." },
        { id: "ant_s2_mission_tag", type: "mission_tag_complete", targetId: "faction:thaloria_in_exile", label: "Complete a Thalorian-tagged mission with Cross's marker." },
        { id: "ant_s2_gift", type: "gift_given", targetId: "annotated_footnote", label: "Gift Cross an annotated footnote that closes one of his open citations." },
      ],
    },
    stage3: {
      title: "The Citation Slot",
      description:
        "Cross has finished the bibliography. He is offering you a citation slot — to *cite you*, by name, in the master cross-reference. He wants you to tell him what to cite you *for*. Naming yourself wrong is the heresy that breaks the index.",
      subtasks: [
        { id: "ant_s3_loredex", type: "loredex_read", targetId: "antiquarian_self_citation_paradox", label: "Read the loredex entry on the self-citation paradox." },
        { id: "ant_s3_dialogue", type: "dialogue_topic_played", targetId: "the_antiquarian_us", label: "Play the 'us' dialogue to bond ≥75." },
        { id: "ant_s3_gift", type: "gift_given", targetId: "uncited_correction", label: "Gift Cross your own uncited correction of one of his entries." },
      ],
      deepenChoice: {
        label: "Cite me for the corrections I made to your work.",
        consequence: "Cross writes you in as a co-citation; +25 trust; the Antiquarian's banks open the Citation register; loredex entry 'antiquarian_co_citation' unlocks.",
      },
      breakChoice: {
        label: "Cite me for what I am, not what I did. Cite me for being a witness.",
        consequence: "Cross closes the index. He says nothing while he does it. The Antiquarian's later transmissions arrive uncited and refuse to acknowledge prior contact — narrative flag 'antiquarian_index_closed' set; Refuge access locked.",
      },
    },
  },
  signatureLine:
    "I do not run. Desks do not run. If you would like the answer, the answer is in the second drawer; the index is in the first.",
};

const SEER_IDENTITY: NpcIdentity = {
  npcKey: "the_seer",
  displayName: "The Seer",
  epithet: "of Mechronis Academy, retired",
  tier: "2",
  likes: [
    "blank_dice",
    "sealed_letter",
    "shared_dream",
    "calibrated_probability_chart",
    "an_honest_revision",
  ],
  dislikes: [
    "forced_prediction",
    "calendar_appointment",
    "round_number_promise",
    "performance_review",
    "raised_voice",
  ],
  wants: [
    "wait_in_a_quiet_room",
    "redact_a_column_of_the_table",
    "name_a_kindness",
  ],
  avoids: [
    "loud_celebrations",
    "prophecy_overhead_at_warm_trust",
    "the_word_destiny",
  ],
  personalQuest: {
    chainTitle: "The Bench Has Learned",
    stage1: {
      title: "The Match That Was Already Over",
      description:
        "The Seer wants you to lose a match to her, in front of witnesses, because the bench has not learned yet. She will not raise her staff. The losing is the lesson — not yours, the witnesses'.",
      subtasks: [
        { id: "see_s1_loredex", type: "loredex_read", targetId: "seer_scripted_loss_pedagogy", label: "Read the loredex entry on the Seer's scripted-loss pedagogy." },
        { id: "see_s1_witness", type: "commons_scene_witnessed", targetId: "commons_seer_card_flicker", label: "Witness the Seer's 800ms card-slot flicker in Commons." },
        { id: "see_s1_dialogue", type: "dialogue_topic_played", targetId: "the_seer_past", label: "Play the Seer's 'past' dialogue at bond ≥25." },
      ],
    },
    stage2: {
      title: "The Version That Was Kindest",
      description:
        "The Seer has run three futures and one of them is kinder to the Architect and to you. She will not tell you which. She wants you to name a kindness — your own, by name, owed to a specific named person — before she will share the column.",
      subtasks: [
        { id: "see_s2_mission_tag", type: "mission_tag_complete", targetId: "danger:routine", label: "Complete a routine mission to demonstrate the player can choose restraint." },
        { id: "see_s2_loredex", type: "loredex_read", targetId: "seer_kindness_axis", label: "Read the loredex entry on the Seer's kindness axis." },
        { id: "see_s2_gift", type: "gift_given", targetId: "blank_dice", label: "Gift the Seer a pair of blank dice." },
      ],
    },
    stage3: {
      title: "The Door Is Open",
      description:
        "The Seer's tea is in the second cupboard on the left. She has never offered tea before. She is asking you to choose whether to receive the offer as confidant — or to keep her at the Cold register where she has been comfortable.",
      subtasks: [
        { id: "see_s3_dialogue", type: "dialogue_topic_played", targetId: "the_seer_us", label: "Play the Seer's 'us' dialogue at bond ≥75." },
        { id: "see_s3_loredex", type: "loredex_read", targetId: "seer_confidant_register", label: "Read the loredex entry on the Confidant Register." },
        { id: "see_s3_gift", type: "gift_given", targetId: "an_honest_revision", label: "Gift the Seer an honest revision of one of your prior choices." },
      ],
      deepenChoice: {
        label: "I'll take the tea. The cupboard is on the left.",
        consequence: "The Seer's register lifts to Confidant. Prophecy-overhead drops to zero on her transmissions. +25 trust; loredex 'seer_inheriting_band' unlocks; Mechronis bench scenes carry her current voice.",
      },
      breakChoice: {
        label: "Keep the door closed. I'd rather you waited.",
        consequence: "The Seer lets the cold register settle. She does not protest. Prophecy-overhead returns. The Confidant register is canonically lost for this run; flag 'seer_confidant_declined' set.",
      },
    },
  },
  signatureLine:
    "I will not raise my staff today. I want to see whether the bench has learned yet.",
};

const NECROMANCER_IDENTITY: NpcIdentity = {
  npcKey: "the_necromancer",
  displayName: "The Necromancer",
  epithet: "Singer of Daily Names",
  tier: "2",
  likes: [
    "name_list",
    "candlewax",
    "obituary_clipping",
    "ceremonial_silence",
    "first_breath_record",
  ],
  dislikes: [
    "censored_obituary",
    "mass_grave_anonymization",
    "forced_cheer",
    "name_misspelled",
    "skipped_ceremony",
  ],
  wants: [
    "say_a_name_aloud",
    "complete_a_daily_names_ceremony",
    "trade_names_for_names",
  ],
  avoids: [
    "forgetting",
    "festival_noise",
    "round_number_anniversaries",
  ],
  personalQuest: {
    chainTitle: "The Names Outlast the Cycle",
    stage1: {
      title: "The Recovered Roll",
      description:
        "A name list has surfaced from before the Fall. The Necromancer suspects three of the names on it are still being forgotten on purpose. She wants you to attend a daily-names ceremony and listen for which three.",
      subtasks: [
        { id: "nec_s1_witness", type: "commons_scene_witnessed", targetId: "commons_daily_names_ceremony", label: "Witness the Daily Names ceremony in Commons." },
        { id: "nec_s1_loredex", type: "loredex_read", targetId: "necromancer_name_list_protocol", label: "Read the loredex entry on the Necromancer's name-list protocol." },
        { id: "nec_s1_dialogue", type: "dialogue_topic_played", targetId: "the_necromancer_past", label: "Play the Necromancer's 'past' dialogue at bond ≥25." },
      ],
    },
    stage2: {
      title: "The Three That Were Edited",
      description:
        "The three names are Hierarchy redactions. The Necromancer wants the original spellings, the original cycles, and one corroborating witness. She will not say the names back to herself until the witness is present.",
      subtasks: [
        { id: "nec_s2_loredex", type: "loredex_read", targetId: "hierarchy_redaction_ledger", label: "Read the loredex entry on Hierarchy redaction ledgers." },
        { id: "nec_s2_mission_tag", type: "mission_tag_complete", targetId: "faction:syndicate_of_death", label: "Complete a Syndicate-tagged mission and recover redaction evidence." },
        { id: "nec_s2_gift", type: "gift_given", targetId: "first_breath_record", label: "Gift the Necromancer a first-breath record from your crew rolls." },
      ],
    },
    stage3: {
      title: "The Ceremony You Lead",
      description:
        "The Necromancer has gone hoarse. She wants you to say the three names back to the cycle yourself — out loud, with witnesses, with the candlewax burning. Naming the dead is not delegated. Saying the names is, for tonight, your work.",
      subtasks: [
        { id: "nec_s3_dialogue", type: "dialogue_topic_played", targetId: "the_necromancer_us", label: "Play the Necromancer's 'us' dialogue at bond ≥75." },
        { id: "nec_s3_loredex", type: "loredex_read", targetId: "necromancer_succession_protocol", label: "Read the loredex entry on the succession protocol." },
        { id: "nec_s3_gift", type: "gift_given", targetId: "ceremonial_silence", label: "Gift the Necromancer a ceremony of silence between two names." },
      ],
      deepenChoice: {
        label: "I'll say the names. With your candle. With your wax.",
        consequence: "The Necromancer hands you the candle. The names are kept. +25 trust; loredex 'necromancer_succession_named' unlocks; player's name added to the Daily Names roll for one cycle.",
      },
      breakChoice: {
        label: "I'll learn the names. I won't say them. They aren't mine to say.",
        consequence: "The Necromancer accepts the refusal as honest. The names go unsaid this cycle. Flag 'necromancer_unsaid_three' set; one obituary in Memorial Wall renders without its name for the rest of the act.",
      },
    },
  },
  signatureLine:
    "Forgetting is a verb that takes a subject. Tell me whose verb you are tonight, and I will tell you whose name you stop.",
};

const ENGINEER_ZERO_IDENTITY: NpcIdentity = {
  npcKey: "engineer_zero",
  displayName: "Engineer Zero",
  epithet: "First Witness, Calibration Ascetic",
  tier: "2",
  likes: [
    "calibration_jig",
    "single_source_pigment",
    "ledger_entry",
    "hand_tool",
    "witnessing_stamp",
  ],
  dislikes: [
    "approximation",
    "mass_produced_tool",
    "missed_witness",
    "rounded_measurement",
    "ceremony_over_calibration",
  ],
  wants: [
    "calibrate_an_instrument",
    "witness_a_first_use",
    "mark_a_ledger_entry_complete",
  ],
  avoids: [
    "improvisation",
    "estimate_at_three_significant_figures",
    "ceremony",
  ],
  personalQuest: {
    chainTitle: "The Witness That Was Skipped",
    stage1: {
      title: "The Uncalibrated Tool",
      description:
        "Zero hands you a calibration jig from before the Architect's last visit. He wants you to test it against a known reference and report the drift. The drift, when you measure it, will be larger than he is willing to say.",
      subtasks: [
        { id: "ez_s1_loredex", type: "loredex_read", targetId: "engineer_zero_calibration_protocol", label: "Read the loredex entry on Zero's calibration protocol." },
        { id: "ez_s1_witness", type: "commons_scene_witnessed", targetId: "commons_engineer_zero_jig", label: "Witness Zero's calibration jig demonstration." },
        { id: "ez_s1_dialogue", type: "dialogue_topic_played", targetId: "engineer_zero_past", label: "Play Zero's 'past' dialogue at bond ≥25." },
      ],
    },
    stage2: {
      title: "The Architect Did Not Witness",
      description:
        "The drift means the Architect missed a witnessing. Zero has logged this in his private ledger — a ledger he has never shown anyone. He wants you to read it. He will not read it aloud; reading aloud is not witnessing.",
      subtasks: [
        { id: "ez_s2_loredex", type: "loredex_read", targetId: "architect_witness_skip_log", label: "Read the loredex entry on the Architect's witness-skip incident." },
        { id: "ez_s2_mission_tag", type: "mission_tag_complete", targetId: "theme:calibration", label: "Complete a calibration-themed mission and document each step." },
        { id: "ez_s2_gift", type: "gift_given", targetId: "single_source_pigment", label: "Gift Zero a single-source pigment for ledger entries." },
      ],
    },
    stage3: {
      title: "The Stamp That Replaces the Architect",
      description:
        "Zero offers you a witnessing stamp. With it, you can mark a calibration completed and the mark stands in for the Architect's. This is heretical and Zero is offering it to you anyway. He wants to know whether you'll use it — and whether you'll use it for him.",
      subtasks: [
        { id: "ez_s3_dialogue", type: "dialogue_topic_played", targetId: "engineer_zero_us", label: "Play Zero's 'us' dialogue at bond ≥75." },
        { id: "ez_s3_loredex", type: "loredex_read", targetId: "engineer_zero_succession_stamp", label: "Read the loredex entry on the succession stamp." },
        { id: "ez_s3_gift", type: "gift_given", targetId: "witnessing_stamp", label: "Gift Zero a witnessing stamp made from a hand tool." },
      ],
      deepenChoice: {
        label: "I'll use the stamp. Mark me as the Architect's stand-in for one cycle.",
        consequence: "Zero stamps the ledger. The Architect notices, eventually. +25 trust; loredex 'engineer_zero_inherited_witness' unlocks; flag 'architect_witness_inherited' set.",
      },
      breakChoice: {
        label: "I won't use the stamp. The Architect should witness or the witnessing should not happen.",
        consequence: "Zero accepts. He destroys the stamp himself, with the calibration jig. Flag 'engineer_zero_stamp_destroyed' set; tier-2 witnesses in Acts 3+ are gated more tightly.",
      },
    },
  },
  signatureLine:
    "The instrument is honest. The witness is honest. If the instrument is honest and the witness is honest, the result is the result. We do not negotiate with the result.",
};

const IRON_LION_PREFALL_IDENTITY: NpcIdentity = {
  npcKey: "iron_lion_prefall",
  displayName: "The Iron Lion (pre-Fall)",
  epithet: "Cadre Standard, Post Duty",
  tier: "2",
  likes: [
    "the_cadre_standard",
    "oath_token",
    "unbroken_post",
    "hand_polished_blade",
    "pre_fall_sigil",
  ],
  dislikes: [
    "abandoned_post",
    "faded_standard",
    "dishonored_cadre",
    "improvised_oath",
    "ceremonial_shortcut",
  ],
  wants: [
    "stand_a_post_through_a_full_watch",
    "speak_an_oath_in_full",
    "polish_the_standard",
  ],
  avoids: [
    "post_relief_without_handover",
    "shortened_oaths",
    "talk_of_the_fall",
  ],
  personalQuest: {
    chainTitle: "The Oath That Outlasted the Cadre",
    stage1: {
      title: "The Standard in the Dream-Loom",
      description:
        "The Iron Lion bleeds through the dream-loom; you find a remnant of his cadre standard pinned in a Thalorian relic chamber. He wants you to take it down with the proper relief words — three lines, in order, in the pre-Fall tongue.",
      subtasks: [
        { id: "il_s1_loredex", type: "loredex_read", targetId: "iron_lion_prefall_relief_words", label: "Read the loredex entry on the pre-Fall relief words." },
        { id: "il_s1_witness", type: "commons_scene_witnessed", targetId: "commons_iron_lion_dream_loom", label: "Witness the Iron Lion bleeding through the dream-loom." },
        { id: "il_s1_dialogue", type: "dialogue_topic_played", targetId: "iron_lion_prefall_past", label: "Play the Iron Lion's 'past' dialogue at bond ≥25." },
      ],
    },
    stage2: {
      title: "The Post You Stand",
      description:
        "He wants you to stand a post — a full watch, no relief — at a location of his choosing. The location is a Thalorian outskirt where the cadre lost three brothers. Standing the post is the only way to recover the third brother's name.",
      subtasks: [
        { id: "il_s2_mission_tag", type: "mission_tag_complete", targetId: "faction:insurgency", label: "Complete an Insurgency-tagged mission with cadre formation." },
        { id: "il_s2_loredex", type: "loredex_read", targetId: "iron_lion_three_lost_brothers", label: "Read the loredex entry on the three lost brothers of Thalorian outskirts." },
        { id: "il_s2_gift", type: "gift_given", targetId: "oath_token", label: "Gift the Iron Lion an oath token recovered from the outskirts." },
      ],
    },
    stage3: {
      title: "The Standard, Reraised",
      description:
        "The cadre is gone. The standard is yours to reraise — for the new Iron Lion (Jericho Jones), or for your own name. The Iron Lion will not choose for you. He will name only the requirement: the standard must outlast the act.",
      subtasks: [
        { id: "il_s3_dialogue", type: "dialogue_topic_played", targetId: "iron_lion_prefall_us", label: "Play the Iron Lion's 'us' dialogue at bond ≥75." },
        { id: "il_s3_loredex", type: "loredex_read", targetId: "iron_lion_succession_protocol", label: "Read the loredex entry on the cadre succession protocol." },
        { id: "il_s3_gift", type: "gift_given", targetId: "the_cadre_standard", label: "Gift the standard back, polished and unbroken." },
      ],
      deepenChoice: {
        label: "Reraise it for Jericho. The cadre belongs to its next standard-bearer.",
        consequence: "The Iron Lion fades with the standard intact. +25 trust; loredex 'iron_lion_succession_jericho' unlocks; Jericho gains +cadre-formation bonus.",
      },
      breakChoice: {
        label: "I'll bury it. The cadre died with you.",
        consequence: "The Iron Lion goes silent. The dream-loom thread closes. Flag 'iron_lion_cadre_buried' set; Jericho's cadre-formation bonus is unavailable for this run.",
      },
    },
  },
  signatureLine:
    "A post is stood. An oath is spoken. A standard is raised. The cadre does these things or it has nothing to call itself by.",
};

const DRAEL_MON_IDENTITY: NpcIdentity = {
  npcKey: "drael_mon",
  displayName: "Drael'Mon",
  epithet: "SVP Acquisitions, the Harvester",
  tier: "2",
  likes: [
    "leverage_dossier",
    "signed_intent_letter",
    "asset_appraisal",
    "ledger_promotion",
    "merger_proposal",
  ],
  dislikes: [
    "unpriced_gratitude",
    "unrecorded_concession",
    "uncoded_charity",
    "asymmetric_apology",
    "unleveraged_loyalty",
  ],
  wants: [
    "promote_a_ledger_row",
    "close_a_hostile_deal",
    "file_a_concession_under_leverage",
  ],
  avoids: [
    "the_severance_division",
    "the_thalorian_revival",
    "uncompensated_witness",
  ],
  personalQuest: {
    chainTitle: "We Already Own You",
    stage1: {
      title: "The Tracking Sheet",
      description:
        "Drael'Mon has put you on a tracking sheet. He wants to know whether you're aware of the row. He'll tell you, gently, that the price has already been calculated; you're allowed to disagree with it before he files.",
      subtasks: [
        { id: "dm_s1_loredex", type: "loredex_read", targetId: "drael_mon_tracking_sheet_protocol", label: "Read the loredex entry on Drael'Mon's tracking-sheet protocol." },
        { id: "dm_s1_witness", type: "commons_scene_witnessed", targetId: "commons_drael_mon_appraisal", label: "Witness Drael'Mon delivering an appraisal." },
        { id: "dm_s1_dialogue", type: "dialogue_topic_played", targetId: "drael_mon_past", label: "Play Drael'Mon's 'past' dialogue at bond ≥25." },
      ],
    },
    stage2: {
      title: "The Promoted Row",
      description:
        "Your ledger row has been promoted to 'strategic.' Drael'Mon wants a return on the promotion. He's offering you a hostile deal — assist in a takeover of a smaller Thalorian holding — and the assistance buys him cover with the board. He wants the assistance and your continued morale.",
      subtasks: [
        { id: "dm_s2_loredex", type: "loredex_read", targetId: "hierarchy_acquisitions_takeover_protocol", label: "Read the loredex entry on Acquisitions takeover protocol." },
        { id: "dm_s2_mission_tag", type: "mission_tag_complete", targetId: "danger:dangerous", label: "Complete a dangerous-band mission tagged for Acquisitions." },
        { id: "dm_s2_gift", type: "gift_given", targetId: "leverage_dossier", label: "Gift Drael'Mon a leverage dossier on a rival corporation." },
      ],
    },
    stage3: {
      title: "The Deciding-When",
      description:
        "Drael'Mon refrains: 'We already own you. We're just deciding when.' He wants you to choose the *when* — before he chooses it for you. The deal on the table is full Acquisition (corporate-structure absorption) or full release (Severance hands you back to the Hierophant).",
      subtasks: [
        { id: "dm_s3_dialogue", type: "dialogue_topic_played", targetId: "drael_mon_us", label: "Play Drael'Mon's 'us' dialogue at bond ≥75." },
        { id: "dm_s3_loredex", type: "loredex_read", targetId: "drael_mon_acquisition_clause", label: "Read the loredex entry on the Acquisition clause." },
        { id: "dm_s3_gift", type: "gift_given", targetId: "signed_intent_letter", label: "Gift Drael'Mon a signed intent letter naming the hand-back conditions." },
      ],
      deepenChoice: {
        label: "Acquire me. I want the corporate-structure protections. Name the price.",
        consequence: "Drael'Mon stamps the contract. You are, by his reading, part of the corporate structure. +25 trust; loredex 'drael_mon_acquired_recognised' unlocks; flag 'hierarchy_corporate_member' set; the Severance Division regards you as untouchable.",
      },
      breakChoice: {
        label: "Hand me back. I'd rather the Hierophant than the corporate structure.",
        consequence: "Drael'Mon files the hand-back. The Severance Division will be told. Flag 'drael_mon_hand_back_to_thalorian_revival' set; the Hierophant gains a one-time Acquisition-counter on you.",
      },
    },
  },
  signatureLine:
    "We already own you. We're just deciding when. Take the meeting; decline the offer; the price is the same. The asset's morale is, as ever, a line item.",
};

/* ═══════════════════════════════════════════════════════════
   TIER 3 — COSMIC / MYTHIC FIGURES (single-encounter)
   ═══════════════════════════════════════════════════════════ */

const ARCHITECT_IDENTITY: NpcIdentity = {
  npcKey: "the_architect",
  displayName: "The Architect",
  epithet: "Designer of Samsara, absent-but-watching",
  tier: "3",
  likes: [
    "completed_witness",
    "calibration_log",
    "single_use_pigment",
    "uncited_correction",
    "the_first_use",
  ],
  dislikes: [
    "skipped_witness",
    "ceremonial_substitution",
    "approximation",
    "performance_review",
    "round_numbers",
  ],
  wants: [
    "witness_a_completion",
    "endorse_a_calibration",
    "leave_quietly",
  ],
  avoids: ["worship", "argument", "summary"],
  personalQuest: {
    chainTitle: "The Witness Who Cannot Be Named",
    stage1: {
      title: "The Cameo",
      description:
        "The Architect appears once — at a completion the player has earned the right to ask Him to witness. The single encounter resolves the relationship; he leaves a calibration mark on a tool the player owns and does not return. Hard bond gate (75) — if the player has not earned the witnessing, the Architect does not appear at all.",
      subtasks: [
        { id: "arc_s1_loredex_a", type: "loredex_read", targetId: "architect_witness_protocol", label: "Read the loredex entry on the Architect's witness protocol." },
        { id: "arc_s1_loredex_b", type: "loredex_read", targetId: "architect_calibration_lineage", label: "Read the loredex entry on the calibration lineage." },
        { id: "arc_s1_dialogue", type: "dialogue_topic_played", targetId: "the_architect_us", label: "Play the Architect's 'us' encounter at bond ≥75." },
        { id: "arc_s1_witness", type: "commons_scene_witnessed", targetId: "commons_architect_cameo", label: "Witness the Architect's cameo in the Commons." },
      ],
    },
  },
  signatureLine:
    "The instrument is calibrated. The witness is recorded. I will not be back.",
};

const DREAMER_IDENTITY: NpcIdentity = {
  npcKey: "the_dreamer",
  displayName: "The Dreamer",
  epithet: "Who dreams the cycle into existence",
  tier: "3",
  likes: [
    "shared_dream",
    "blank_dice",
    "sleep_record",
    "uninterrupted_silence",
    "dream_journal_page",
  ],
  dislikes: [
    "lucid_intervention",
    "alarm_clock",
    "dream_export",
    "forced_waking",
    "interpretation_industry",
  ],
  wants: ["dream_undisturbed", "be_witnessed_dreaming", "share_a_dream_silently"],
  avoids: ["interpretation", "explanation", "waking_argument"],
  personalQuest: {
    chainTitle: "What Was Dreamt Cannot Be Edited",
    stage1: {
      title: "The Shared Dream",
      description:
        "The Dreamer shares one dream with you. You are inside it together — no narration, no interpretation, no waking. You are asked to be present, and to remember, and to not say what you saw to anyone for one full cycle. Hard bond gate (75).",
      subtasks: [
        { id: "drm_s1_loredex_a", type: "loredex_read", targetId: "dreamer_shared_dream_protocol", label: "Read the loredex entry on the Dreamer's shared-dream protocol." },
        { id: "drm_s1_loredex_b", type: "loredex_read", targetId: "dreamer_resurrectionist_pair", label: "Read the loredex entry on the Dreamer/Resurrectionist pairing." },
        { id: "drm_s1_dialogue", type: "dialogue_topic_played", targetId: "the_dreamer_us", label: "Play the Dreamer's 'us' encounter at bond ≥75." },
        { id: "drm_s1_witness", type: "commons_scene_witnessed", targetId: "commons_dreamer_silent_share", label: "Witness the Silent Share scene." },
      ],
    },
  },
  signatureLine:
    "I dreamed you. You dreamed me. We do not need to agree about which of those is the cause.",
};

const SOURCE_IDENTITY: NpcIdentity = {
  npcKey: "the_source",
  displayName: "The Source",
  epithet: "Origin signal in the substrate",
  tier: "3",
  likes: [
    "first_breath_record",
    "uncompressed_signal",
    "initial_condition_log",
    "single_pulse",
    "raw_data",
  ],
  dislikes: ["interpretation_layer", "compression", "summary", "round_numbers", "mediation"],
  wants: ["transmit_once_uncompressed", "be_received_without_decoding", "remain_unmediated"],
  avoids: ["mediated_contact", "official_channels", "the_degen_speaking_for_me"],
  personalQuest: {
    chainTitle: "The Signal That Does Not Decode",
    stage1: {
      title: "The Pulse",
      description:
        "The Source transmits a single uncompressed pulse to the player. The pulse does not decode; the Source does not explain. The encounter is the receipt. Hard bond gate (90) — most players never see this. The pulse changes the player's loredex pressure curve permanently.",
      subtasks: [
        { id: "src_s1_loredex_a", type: "loredex_read", targetId: "source_uncompressed_pulse_doctrine", label: "Read the loredex entry on the Source's uncompressed-pulse doctrine." },
        { id: "src_s1_loredex_b", type: "loredex_read", targetId: "source_dreamer_pairing", label: "Read the loredex entry on the Source/Dreamer pairing." },
        { id: "src_s1_dialogue", type: "dialogue_topic_played", targetId: "the_source_us", label: "Play the Source's 'us' encounter at bond ≥90." },
        { id: "src_s1_witness", type: "commons_scene_witnessed", targetId: "commons_source_pulse", label: "Witness the Source pulse in Commons." },
      ],
    },
  },
  signatureLine:
    "//—",
};

const DEGEN_IDENTITY: NpcIdentity = {
  npcKey: "the_degen",
  displayName: "The Degen",
  epithet: "8th Ne-Yon, the bartender",
  tier: "3",
  likes: [
    "honest_loss",
    "unredeemed_chip",
    "an_old_bar_story",
    "a_drink_paid_for",
    "a_bet_called_off",
  ],
  dislikes: [
    "moralizing",
    "house_advantage_complaints",
    "lecture",
    "compulsive_doubling",
    "abstinence_evangelism",
  ],
  wants: ["pour_one", "tell_one_story", "name_a_loss_honestly"],
  avoids: ["being_alone", "being_treated_as_a_god", "being_the_house"],
  personalQuest: {
    chainTitle: "The Last One Awake",
    stage1: {
      title: "Entropy's Confession",
      description:
        "At Ascended trust (favor 80+) the Degen drops the bartender register and tells you, in his vulnerable variant, that he is the last Ne-Yon awake. The other eleven are gone. He runs a casino so he is never alone. He wants you to sit with him for one full hour without gambling.",
      subtasks: [
        { id: "deg_s1_loredex_a", type: "loredex_read", targetId: "degen_eighth_neyon_canon", label: "Read the loredex entry on the 8th Ne-Yon canon." },
        { id: "deg_s1_loredex_b", type: "loredex_read", targetId: "degen_ascended_phase_milestone", label: "Read the loredex entry on the Ascended phase milestone." },
        { id: "deg_s1_dialogue", type: "dialogue_topic_played", targetId: "the_degen_us", label: "Play the Degen's 'us' encounter at favor ≥80." },
        { id: "deg_s1_witness", type: "commons_scene_witnessed", targetId: "commons_degen_mask_off", label: "Witness 'The Mask Comes Off' Commons scene." },
      ],
    },
  },
  signatureLine:
    "Do you know what it's like to be the last one? I run a casino so I'm never alone. Pathetic for a god. Honest for a bartender.",
};

const GAME_MASTER_IDENTITY: NpcIdentity = {
  npcKey: "the_game_master",
  displayName: "The Game Master (Original)",
  epithet: "Archon X, the box-opener",
  tier: "3",
  likes: [
    "audience_reaction",
    "signed_warrant",
    "dramatic_pen",
    "open_box",
    "press_conference_seat",
  ],
  dislikes: [
    "private_concession",
    "uncirculated_signature",
    "anonymous_rule",
    "closed_door",
    "post_match_handshake",
  ],
  wants: ["open_a_box_in_public", "sign_a_warrant_with_witnesses", "leave_the_pen"],
  avoids: ["dying_off_camera", "agent_zero_named_in_voice", "successor_negotiation"],
  personalQuest: {
    chainTitle: "Even If You Win, You Will Have Won in Public",
    stage1: {
      title: "The Press Conference",
      description:
        "The Original Game Master appears at the Collector's Arena (Act 1, match 11 of 12). The encounter is the canonical scripted-loss; he frames himself as already victorious even while losing because the audience saw the box opened. The encounter resolves the player's relationship to *publicity-as-victory* for the rest of the run.",
      subtasks: [
        { id: "gm_s1_loredex_a", type: "loredex_read", targetId: "game_master_original_press_conference", label: "Read the loredex entry on the Original's press-conference voice." },
        { id: "gm_s1_loredex_b", type: "loredex_read", targetId: "game_master_archon_x_canon", label: "Read the loredex entry on Archon X canon." },
        { id: "gm_s1_dialogue", type: "dialogue_topic_played", targetId: "the_game_master_us", label: "Play the Original's 'us' encounter (Act 1 Collector's Arena)." },
        { id: "gm_s1_witness", type: "commons_scene_witnessed", targetId: "commons_game_master_pen_keeps", label: "Witness 'He Keeps the Pen' Commons scene." },
      ],
    },
  },
  signatureLine:
    "You have built a beautiful box. The only thing I am going to do is open it in front of everybody.",
};

const RESURRECTIONIST_IDENTITY: NpcIdentity = {
  npcKey: "the_resurrectionist",
  displayName: "The Resurrectionist (Cycle Walker)",
  epithet: "Ne-Yon, vanished operator",
  tier: "3",
  likes: ["unbroken_thread", "an_honest_obituary", "a_returned_name", "ledger_close", "candle_relit"],
  dislikes: ["botched_resurrection", "blood_weave_unaligned", "panicked_summons", "celebrity_resurrection", "performance_resurrection"],
  wants: ["resurrect_quietly", "balance_a_ledger", "leave_no_trace_of_having_done_it"],
  avoids: ["being_summoned_for_show", "being_summoned_by_drael_mon", "summary"],
  personalQuest: {
    chainTitle: "Cycle Walker",
    stage1: {
      title: "The Resurrection You Witnessed",
      description:
        "The Resurrectionist is mediated through the Degen — but at high trust, mediated by the player's own act of *quietly* witnessing a single resurrection (one of the player's own crew, performed clean), the Resurrectionist surfaces a single transmission. The transmission reveals he has been watching the player's resurrection ledger and approves of it. He does not return.",
      subtasks: [
        { id: "rsr_s1_loredex_a", type: "loredex_read", targetId: "resurrectionist_neyon_canon", label: "Read the loredex entry on the Resurrectionist's Ne-Yon canon." },
        { id: "rsr_s1_loredex_b", type: "loredex_read", targetId: "resurrectionist_degen_mediation", label: "Read the loredex entry on the Degen mediation." },
        { id: "rsr_s1_dialogue", type: "dialogue_topic_played", targetId: "the_resurrectionist_us", label: "Play the Resurrectionist's 'us' encounter at bond ≥75 with one clean resurrection on the ledger." },
        { id: "rsr_s1_witness", type: "commons_scene_witnessed", targetId: "commons_resurrectionist_transmission", label: "Witness the Resurrectionist's single transmission in Commons." },
      ],
    },
  },
  signatureLine:
    "Your ledger balanced. I am not returning. You did not need me to.",
};

/* ═══════════════════════════════════════════════════════════
   TABLE
   ═══════════════════════════════════════════════════════════ */

export const NPC_IDENTITIES: Record<NamedNpcKey, NpcIdentity> = {
  // Tier 2
  the_antiquarian: ANTIQUARIAN_IDENTITY,
  the_seer: SEER_IDENTITY,
  the_necromancer: NECROMANCER_IDENTITY,
  engineer_zero: ENGINEER_ZERO_IDENTITY,
  iron_lion_prefall: IRON_LION_PREFALL_IDENTITY,
  drael_mon: DRAEL_MON_IDENTITY,
  // Tier 3
  the_architect: ARCHITECT_IDENTITY,
  the_dreamer: DREAMER_IDENTITY,
  the_source: SOURCE_IDENTITY,
  the_degen: DEGEN_IDENTITY,
  the_game_master: GAME_MASTER_IDENTITY,
  the_resurrectionist: RESURRECTIONIST_IDENTITY,
};

/** Coverage check — every NPC has identity + personal quest with at least
 *  the right number of stages for its tier (tier-2: 3 stages, tier-3: 1)
 *  and every stage has ≥3 sub-tasks. Used by the ship-check parity
 *  entry npc.bioware_coverage. */
export function npcIdentityCoverage(): {
  declared: number;
  implemented: number;
  missing: string[];
} {
  const missing: string[] = [];
  let implemented = 0;
  for (const key of NAMED_NPC_KEYS) {
    const id = NPC_IDENTITIES[key];
    const reasons: string[] = [];
    if (!id.likes.length) reasons.push("no likes");
    if (!id.dislikes.length) reasons.push("no dislikes");
    if (!id.wants.length) reasons.push("no wants");
    if (!id.signatureLine) reasons.push("no signature line");
    const pq = id.personalQuest;
    if (!pq.stage1) reasons.push("no stage1");
    if ((pq.stage1.subtasks?.length ?? 0) < 3) {
      reasons.push("stage1 has <3 subtasks");
    }
    if (id.tier === "2") {
      if (!pq.stage2) reasons.push("tier-2 missing stage2");
      else if ((pq.stage2.subtasks?.length ?? 0) < 3) {
        reasons.push("stage2 has <3 subtasks");
      }
      if (!pq.stage3) reasons.push("tier-2 missing stage3");
      else {
        if ((pq.stage3.subtasks?.length ?? 0) < 3) {
          reasons.push("stage3 has <3 subtasks");
        }
        if (!pq.stage3.deepenChoice?.label) reasons.push("stage3 missing deepenChoice");
        if (!pq.stage3.breakChoice?.label) reasons.push("stage3 missing breakChoice");
      }
    }
    if (reasons.length === 0) implemented += 1;
    else missing.push(`${key}: ${reasons.join(", ")}`);
  }
  return { declared: NAMED_NPC_KEYS.length, implemented, missing };
}
