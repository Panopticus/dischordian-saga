/* ═══════════════════════════════════════════════════════
   APPRENTICE PERSONAL-QUEST SUB-TASKS

   3 sub-tasks per stage × 3 stages × 12 archetypes = 108 entries.
   Sub-tasks gate stage advance on top of the bond threshold;
   advance() requires bond AND all sub-tasks complete. Validators
   live in apps/server/services/apprenticeQuestSubtaskService.ts.

   The targetIds reference content that exists or is about to exist:
     - loredex_read           → loredex entry ids
     - mission_tag_complete   → faction:* / theme:* / era:* / danger:*
     - gift_given             → gift catalog ids (apprenticeIdentity.likes)
     - dialogue_topic_played  → topic ids (apprenticeDialogues)
     - commons_scene_witnessed→ commons scene ids (commonsScenePool)

   Merged into APPRENTICE_IDENTITIES at module load — keeps the
   per-archetype identity entries readable while centralising the
   sub-task authoring.
   ═══════════════════════════════════════════════════════ */

import type { ApprenticeArchetype } from "./apprentices";
import type { PersonalQuestSubtaskRef } from "./personalQuestSubtasks";

export type ApprenticeStageKey = "stage1" | "stage2" | "stage3";

export const APPRENTICE_SUBTASKS: Record<
  ApprenticeArchetype,
  Record<ApprenticeStageKey, PersonalQuestSubtaskRef[]>
> = {
  zealot: {
    stage1: [
      { id: "zlt_s1_witness", type: "commons_scene_witnessed", targetId: "commons_zealot_sermon", label: "Attend the Zealot's Commons sermon." },
      { id: "zlt_s1_dialogue", type: "dialogue_topic_played", targetId: "zealot_past", label: "Hear the Zealot's earliest creed (bond ≥ 25)." },
      { id: "zlt_s1_gift", type: "gift_given", targetId: "devotional_text", label: "Bring the Zealot a devotional text." },
    ],
    stage2: [
      { id: "zlt_s2_loredex", type: "loredex_read", targetId: "zealot_founder_charlatan_ledger", label: "Read the founder-charlatan ledger." },
      { id: "zlt_s2_mission_tag", type: "mission_tag_complete", targetId: "faction:thaloria_in_exile", label: "Run a Thalorian mission so the heresy lands in front of witnesses." },
      { id: "zlt_s2_dialogue", type: "dialogue_topic_played", targetId: "zealot_calling", label: "Press the Zealot on the calling (bond ≥ 40)." },
    ],
    stage3: [
      { id: "zlt_s3_loredex", type: "loredex_read", targetId: "zealot_new_scripture_protocol", label: "Read the protocol for naming a new scripture." },
      { id: "zlt_s3_dialogue", type: "dialogue_topic_played", targetId: "zealot_us", label: "Reach the 'us' topic with the Zealot (bond ≥ 75)." },
      { id: "zlt_s3_gift", type: "gift_given", targetId: "engraved_sigil", label: "Gift the Zealot an engraved sigil." },
    ],
  },
  ghost: {
    stage1: [
      { id: "gst_s1_witness", type: "commons_scene_witnessed", targetId: "commons_ghost_unseen", label: "Watch the Ghost watching from the Commons mezzanine." },
      { id: "gst_s1_dialogue", type: "dialogue_topic_played", targetId: "ghost_past", label: "Get the Ghost to say something about before (bond ≥ 25)." },
      { id: "gst_s1_gift", type: "gift_given", targetId: "silenced_recorder", label: "Gift the Ghost a silenced recorder." },
    ],
    stage2: [
      { id: "gst_s2_loredex", type: "loredex_read", targetId: "ghost_old_debts_ledger", label: "Read the Ghost's old-debts ledger." },
      { id: "gst_s2_mission_tag", type: "mission_tag_complete", targetId: "theme:infiltration", label: "Run an infiltration mission with the Ghost present." },
      { id: "gst_s2_dialogue", type: "dialogue_topic_played", targetId: "ghost_calling", label: "Press the Ghost on the calling (bond ≥ 40)." },
    ],
    stage3: [
      { id: "gst_s3_loredex", type: "loredex_read", targetId: "ghost_visibility_break_doctrine", label: "Read the Visibility-Break doctrine entry." },
      { id: "gst_s3_dialogue", type: "dialogue_topic_played", targetId: "ghost_us", label: "Reach the 'us' topic with the Ghost (bond ≥ 75)." },
      { id: "gst_s3_gift", type: "gift_given", targetId: "untraceable_coin", label: "Gift the Ghost an untraceable coin." },
    ],
  },
  scholar: {
    stage1: [
      { id: "sch_s1_witness", type: "commons_scene_witnessed", targetId: "commons_scholar_archive", label: "Visit the Scholar in the Commons archive." },
      { id: "sch_s1_dialogue", type: "dialogue_topic_played", targetId: "scholar_past", label: "Ask the Scholar about the unfinished thesis (bond ≥ 25)." },
      { id: "sch_s1_loredex", type: "loredex_read", targetId: "scholar_unfinished_thesis", label: "Read the Scholar's unfinished thesis." },
    ],
    stage2: [
      { id: "sch_s2_loredex", type: "loredex_read", targetId: "scholar_redacted_chapter", label: "Read the redacted chapter from the Scholar's thesis." },
      { id: "sch_s2_mission_tag", type: "mission_tag_complete", targetId: "theme:negotiation", label: "Run a negotiation-themed mission for the Scholar." },
      { id: "sch_s2_dialogue", type: "dialogue_topic_played", targetId: "scholar_calling", label: "Press the Scholar on the calling (bond ≥ 40)." },
    ],
    stage3: [
      { id: "sch_s3_loredex", type: "loredex_read", targetId: "scholar_co_authorship_clause", label: "Read the co-authorship clause." },
      { id: "sch_s3_dialogue", type: "dialogue_topic_played", targetId: "scholar_us", label: "Reach the 'us' topic with the Scholar (bond ≥ 75)." },
      { id: "sch_s3_gift", type: "gift_given", targetId: "rare_codex", label: "Gift the Scholar a rare codex." },
    ],
  },
  revenant: {
    stage1: [
      { id: "rvn_s1_witness", type: "commons_scene_witnessed", targetId: "commons_revenant_silent_seat", label: "Sit with the Revenant in the Commons silent seat." },
      { id: "rvn_s1_dialogue", type: "dialogue_topic_played", targetId: "revenant_past", label: "Hear the Revenant on the prior life (bond ≥ 25)." },
      { id: "rvn_s1_gift", type: "gift_given", targetId: "old_locket", label: "Gift the Revenant an old locket." },
    ],
    stage2: [
      { id: "rvn_s2_loredex", type: "loredex_read", targetId: "revenant_predecessor_ledger", label: "Read the predecessor's ledger." },
      { id: "rvn_s2_mission_tag", type: "mission_tag_complete", targetId: "theme:extraction", label: "Run an extraction mission with the Revenant present." },
      { id: "rvn_s2_dialogue", type: "dialogue_topic_played", targetId: "revenant_mortality", label: "Press the Revenant on mortality (bond ≥ 60)." },
    ],
    stage3: [
      { id: "rvn_s3_loredex", type: "loredex_read", targetId: "revenant_second_resurrection_doctrine", label: "Read the second-resurrection doctrine." },
      { id: "rvn_s3_dialogue", type: "dialogue_topic_played", targetId: "revenant_us", label: "Reach the 'us' topic with the Revenant (bond ≥ 75)." },
      { id: "rvn_s3_gift", type: "gift_given", targetId: "candlewax", label: "Gift the Revenant ceremonial candlewax." },
    ],
  },
  artisan: {
    stage1: [
      { id: "art_s1_witness", type: "commons_scene_witnessed", targetId: "commons_artisan_workbench", label: "Visit the Artisan at the Commons workbench." },
      { id: "art_s1_dialogue", type: "dialogue_topic_played", targetId: "artisan_past", label: "Ask the Artisan about the first piece (bond ≥ 25)." },
      { id: "art_s1_gift", type: "gift_given", targetId: "rare_pigment", label: "Gift the Artisan a rare pigment." },
    ],
    stage2: [
      { id: "art_s2_loredex", type: "loredex_read", targetId: "artisan_signature_doctrine", label: "Read the Artisan's signature doctrine." },
      { id: "art_s2_mission_tag", type: "mission_tag_complete", targetId: "theme:calibration", label: "Run a calibration mission so the Artisan can match a tool." },
      { id: "art_s2_dialogue", type: "dialogue_topic_played", targetId: "artisan_calling", label: "Press the Artisan on the calling (bond ≥ 40)." },
    ],
    stage3: [
      { id: "art_s3_loredex", type: "loredex_read", targetId: "artisan_unsigned_masterwork", label: "Read about the unsigned masterwork." },
      { id: "art_s3_dialogue", type: "dialogue_topic_played", targetId: "artisan_us", label: "Reach the 'us' topic with the Artisan (bond ≥ 75)." },
      { id: "art_s3_gift", type: "gift_given", targetId: "calibration_jig", label: "Gift the Artisan a calibration jig." },
    ],
  },
  oracle: {
    stage1: [
      { id: "orc_s1_witness", type: "commons_scene_witnessed", targetId: "commons_oracle_quiet_table", label: "Sit at the Oracle's quiet Commons table." },
      { id: "orc_s1_dialogue", type: "dialogue_topic_played", targetId: "oracle_past", label: "Hear what the Oracle saw first (bond ≥ 25)." },
      { id: "orc_s1_gift", type: "gift_given", targetId: "blank_dice", label: "Gift the Oracle a pair of blank dice." },
    ],
    stage2: [
      { id: "orc_s2_loredex", type: "loredex_read", targetId: "oracle_revision_doctrine", label: "Read the Oracle's revision doctrine." },
      { id: "orc_s2_mission_tag", type: "mission_tag_complete", targetId: "danger:routine", label: "Run a routine mission so the Oracle's restraint is rewarded." },
      { id: "orc_s2_dialogue", type: "dialogue_topic_played", targetId: "oracle_calling", label: "Press the Oracle on the calling (bond ≥ 40)." },
    ],
    stage3: [
      { id: "orc_s3_loredex", type: "loredex_read", targetId: "oracle_kindness_axis", label: "Read the kindness-axis entry." },
      { id: "orc_s3_dialogue", type: "dialogue_topic_played", targetId: "oracle_us", label: "Reach the 'us' topic with the Oracle (bond ≥ 75)." },
      { id: "orc_s3_gift", type: "gift_given", targetId: "sealed_letter", label: "Gift the Oracle a sealed letter." },
    ],
  },
  wanderer: {
    stage1: [
      { id: "wnd_s1_witness", type: "commons_scene_witnessed", targetId: "commons_wanderer_packing", label: "Watch the Wanderer pack and unpack a single bag." },
      { id: "wnd_s1_dialogue", type: "dialogue_topic_played", targetId: "wanderer_past", label: "Ask the Wanderer about the road home (bond ≥ 25)." },
      { id: "wnd_s1_gift", type: "gift_given", targetId: "old_map", label: "Gift the Wanderer an old map." },
    ],
    stage2: [
      { id: "wnd_s2_loredex", type: "loredex_read", targetId: "wanderer_root_ledger", label: "Read the Wanderer's root-ledger." },
      { id: "wnd_s2_mission_tag", type: "mission_tag_complete", targetId: "era:pre_fall", label: "Run a pre-Fall era mission with the Wanderer." },
      { id: "wnd_s2_dialogue", type: "dialogue_topic_played", targetId: "wanderer_calling", label: "Press the Wanderer on the calling (bond ≥ 40)." },
    ],
    stage3: [
      { id: "wnd_s3_loredex", type: "loredex_read", targetId: "wanderer_settled_doctrine", label: "Read the settled-doctrine entry." },
      { id: "wnd_s3_dialogue", type: "dialogue_topic_played", targetId: "wanderer_us", label: "Reach the 'us' topic with the Wanderer (bond ≥ 75)." },
      { id: "wnd_s3_gift", type: "gift_given", targetId: "compass_rose", label: "Gift the Wanderer a compass rose." },
    ],
  },
  martyr: {
    stage1: [
      { id: "mty_s1_witness", type: "commons_scene_witnessed", targetId: "commons_martyr_vigil", label: "Stand at the Martyr's Commons vigil." },
      { id: "mty_s1_dialogue", type: "dialogue_topic_played", targetId: "martyr_past", label: "Hear the Martyr on the first sacrifice (bond ≥ 25)." },
      { id: "mty_s1_gift", type: "gift_given", targetId: "vigil_candle", label: "Gift the Martyr a vigil candle." },
    ],
    stage2: [
      { id: "mty_s2_loredex", type: "loredex_read", targetId: "martyr_disposable_doctrine", label: "Read the disposable-self doctrine." },
      { id: "mty_s2_mission_tag", type: "mission_tag_complete", targetId: "danger:dangerous", label: "Run a dangerous mission and bring the Martyr back alive." },
      { id: "mty_s2_dialogue", type: "dialogue_topic_played", targetId: "martyr_mortality", label: "Press the Martyr on mortality (bond ≥ 60)." },
    ],
    stage3: [
      { id: "mty_s3_loredex", type: "loredex_read", targetId: "martyr_reverence_alternative", label: "Read the alternative-reverence entry." },
      { id: "mty_s3_dialogue", type: "dialogue_topic_played", targetId: "martyr_us", label: "Reach the 'us' topic with the Martyr (bond ≥ 75)." },
      { id: "mty_s3_gift", type: "gift_given", targetId: "memorial_pin", label: "Gift the Martyr a memorial pin from someone they kept alive." },
    ],
  },
  heretic: {
    stage1: [
      { id: "her_s1_witness", type: "commons_scene_witnessed", targetId: "commons_heretic_argument", label: "Witness the Heretic arguing in the Commons." },
      { id: "her_s1_dialogue", type: "dialogue_topic_played", targetId: "heretic_past", label: "Ask the Heretic which orthodoxy fell first (bond ≥ 25)." },
      { id: "her_s1_gift", type: "gift_given", targetId: "heretical_pamphlet", label: "Gift the Heretic a heretical pamphlet." },
    ],
    stage2: [
      { id: "her_s2_loredex", type: "loredex_read", targetId: "heretic_doctrine_diff", label: "Read the doctrine-diff entry." },
      { id: "her_s2_mission_tag", type: "mission_tag_complete", targetId: "faction:syndicate_of_death", label: "Run a Syndicate-tagged mission and recover doctrinal evidence." },
      { id: "her_s2_dialogue", type: "dialogue_topic_played", targetId: "heretic_calling", label: "Press the Heretic on the calling (bond ≥ 40)." },
    ],
    stage3: [
      { id: "her_s3_loredex", type: "loredex_read", targetId: "heretic_new_orthodoxy_protocol", label: "Read the new-orthodoxy protocol." },
      { id: "her_s3_dialogue", type: "dialogue_topic_played", targetId: "heretic_us", label: "Reach the 'us' topic with the Heretic (bond ≥ 75)." },
      { id: "her_s3_gift", type: "gift_given", targetId: "uncited_correction", label: "Gift the Heretic an uncited correction." },
    ],
  },
  jester: {
    stage1: [
      { id: "jst_s1_witness", type: "commons_scene_witnessed", targetId: "commons_jester_routine", label: "Catch the Jester's Commons routine." },
      { id: "jst_s1_dialogue", type: "dialogue_topic_played", targetId: "jester_past", label: "Hear the Jester's first joke (bond ≥ 25)." },
      { id: "jst_s1_gift", type: "gift_given", targetId: "trick_coin", label: "Gift the Jester a trick coin." },
    ],
    stage2: [
      { id: "jst_s2_loredex", type: "loredex_read", targetId: "jester_punchline_ledger", label: "Read the punchline-ledger entry." },
      { id: "jst_s2_mission_tag", type: "mission_tag_complete", targetId: "theme:performance", label: "Run a performance-themed mission with the Jester." },
      { id: "jst_s2_dialogue", type: "dialogue_topic_played", targetId: "jester_calling", label: "Press the Jester on the calling (bond ≥ 40)." },
    ],
    stage3: [
      { id: "jst_s3_loredex", type: "loredex_read", targetId: "jester_unfunny_truth_doctrine", label: "Read the unfunny-truth doctrine." },
      { id: "jst_s3_dialogue", type: "dialogue_topic_played", targetId: "jester_us", label: "Reach the 'us' topic with the Jester (bond ≥ 75)." },
      { id: "jst_s3_gift", type: "gift_given", targetId: "old_joke_book", label: "Gift the Jester an old joke book." },
    ],
  },
  sentinel: {
    stage1: [
      { id: "snt_s1_witness", type: "commons_scene_witnessed", targetId: "commons_sentinel_post", label: "Stand the Sentinel's Commons post for one watch." },
      { id: "snt_s1_dialogue", type: "dialogue_topic_played", targetId: "sentinel_past", label: "Hear the Sentinel on the first oath (bond ≥ 25)." },
      { id: "snt_s1_gift", type: "gift_given", targetId: "oath_token", label: "Gift the Sentinel an oath token." },
    ],
    stage2: [
      { id: "snt_s2_loredex", type: "loredex_read", targetId: "sentinel_relief_protocol", label: "Read the Sentinel's relief protocol." },
      { id: "snt_s2_mission_tag", type: "mission_tag_complete", targetId: "faction:insurgency", label: "Run an Insurgency-tagged mission alongside the Sentinel." },
      { id: "snt_s2_dialogue", type: "dialogue_topic_played", targetId: "sentinel_calling", label: "Press the Sentinel on the calling (bond ≥ 40)." },
    ],
    stage3: [
      { id: "snt_s3_loredex", type: "loredex_read", targetId: "sentinel_succession_doctrine", label: "Read the succession doctrine." },
      { id: "snt_s3_dialogue", type: "dialogue_topic_played", targetId: "sentinel_us", label: "Reach the 'us' topic with the Sentinel (bond ≥ 75)." },
      { id: "snt_s3_gift", type: "gift_given", targetId: "hand_polished_blade", label: "Gift the Sentinel a hand-polished blade." },
    ],
  },
  prodigal: {
    stage1: [
      { id: "prd_s1_witness", type: "commons_scene_witnessed", targetId: "commons_prodigal_returning", label: "Watch the Prodigal returning to the Commons." },
      { id: "prd_s1_dialogue", type: "dialogue_topic_played", targetId: "prodigal_past", label: "Ask the Prodigal what they fled (bond ≥ 25)." },
      { id: "prd_s1_gift", type: "gift_given", targetId: "torn_letter", label: "Gift the Prodigal a torn letter from before." },
    ],
    stage2: [
      { id: "prd_s2_loredex", type: "loredex_read", targetId: "prodigal_return_ledger", label: "Read the Prodigal's return-ledger." },
      { id: "prd_s2_mission_tag", type: "mission_tag_complete", targetId: "era:post_fall", label: "Run a post-Fall era mission with the Prodigal." },
      { id: "prd_s2_dialogue", type: "dialogue_topic_played", targetId: "prodigal_calling", label: "Press the Prodigal on the calling (bond ≥ 40)." },
    ],
    stage3: [
      { id: "prd_s3_loredex", type: "loredex_read", targetId: "prodigal_reconciliation_clause", label: "Read the reconciliation clause." },
      { id: "prd_s3_dialogue", type: "dialogue_topic_played", targetId: "prodigal_us", label: "Reach the 'us' topic with the Prodigal (bond ≥ 75)." },
      { id: "prd_s3_gift", type: "gift_given", targetId: "annotated_footnote", label: "Gift the Prodigal an annotated footnote." },
    ],
  },
};
