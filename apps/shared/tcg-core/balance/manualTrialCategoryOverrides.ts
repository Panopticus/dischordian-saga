/**
 * Hand-authored trial-category assignments for cards that neither
 * the main proposer (./trialCategoryProposer.ts) nor the second-pass
 * categorizer (./secondPassTrialCategorizer.ts) can categorize.
 *
 * These are the residual ~30 cards from the §5.8 backfill — almost
 * all vanilla low-tier cards (imprint t1/t2 collectibles, allegiance
 * t1 reward cards, faction tokens, two grant-keyword spells whose
 * granted-keyword identity isn't visible to either heuristic pass).
 *
 * Each entry gets at least one TrialCategory. The most common
 * pattern is `["defensive", "narrative"]` — vanilla units with
 * substantive flavor read as "board presence + character
 * introduction". Tokens get `["defensive"]` only (no flavor weight).
 *
 * If you add a card to the live pool that the proposer + second-
 * pass leave empty, add it here too. Keep entries alphabetized
 * within each section for grep-ability.
 */
import type { TrialCategory } from "../types/Card";

export const MANUAL_TRIAL_CATEGORIES: Readonly<
  Record<string, readonly TrialCategory[]>
> = {
  // ---- §4.9 Seer — reserved winnable-path card ----
  // Narrative because the card IS the narrative beat ("you
  // remembered"); evidence because playing it IS the proof. Not
  // reachable via normal deck-building — delivered via Acts 2+
  // unlock routes (spec §3.3), so §5.8 admissibility never fires
  // against it during Act 1 play.
  burnt_card_placeholder: ["evidence", "narrative"],

  // ---- Tokens (vanilla, no abilities, basic rarity) ----
  // Flavor weight is light; categorize by board-presence only.
  // The Crystal Senator token is the exception: 5/5 with civic
  // flavor that lands as a small narrative beat.
  tok_calculation: ["defensive"],
  tok_dream_wisp_1_1: ["defensive"],
  tok_infected_2_2: ["defensive", "offensive"],
  token_crystal_senator_5_5: ["defensive", "narrative"],
  token_wolf_2_2: ["defensive"],

  // ---- Imprint tier-1 + tier-2 cards (character-track unlocks) ----
  // All read as "character introduction" board pieces. Defensive +
  // narrative covers the dual function (the card holds a board slot
  // and announces a character the player will meet again later).
  s1_imprint_agent_zero_t1: ["defensive", "narrative"],
  s1_imprint_agent_zero_t2: ["defensive", "narrative"],
  s1_imprint_akai_shi_t1: ["defensive", "narrative"],
  s1_imprint_antiquarian_t1: ["defensive", "narrative"],
  s1_imprint_antiquarian_t2: ["defensive", "narrative"],
  s1_imprint_iron_lion_t1: ["defensive", "narrative"],
  s1_imprint_locke_t1: ["defensive", "narrative"],
  s1_imprint_the_architect_t1: ["defensive", "narrative"],
  s1_imprint_the_collector_t1: ["defensive", "narrative"],
  s1_imprint_the_detective_t1: ["defensive", "narrative"],
  s1_imprint_the_engineer_t1: ["defensive", "narrative"],
  s1_imprint_the_enigma_t1: ["defensive", "narrative"],
  s1_imprint_the_human_t1: ["defensive", "narrative"],
  s1_imprint_the_necromancer_t1: ["defensive", "narrative"],
  s1_imprint_the_oracle_t1: ["defensive", "narrative"],
  s1_imprint_the_source_t1: ["defensive", "narrative"],

  // ---- Allegiance tier-1 reward cards ("Unlocked by playing 10 X
  //      matches"). Vanilla units rewarded for faction loyalty;
  //      same defensive + narrative read as imprints.
  s1_alleg_antiquarian_t1: ["defensive", "narrative"],
  s1_alleg_architect_t1: ["defensive", "narrative"],
  s1_alleg_insurgency_t1: ["defensive", "narrative"],
  s1_alleg_new_babylon_t1: ["defensive", "narrative"],

  // ---- Class & elemental basics (grant-keyword on deploy) ----
  // s1_class_spy_01 grants stealth on deploy — defensive (avoidance);
  // narrative because the flavor is a substantive Insurgency origin
  // story. s1_class_soldier_01 is the genuinely vanilla "no ability
  // is the ability" card — defensive only. s1_elem_fire_01 grants
  // rush — offensive in spirit; narrative for the substantive ember
  // image.
  s1_class_soldier_01: ["defensive"],
  s1_class_spy_01: ["defensive", "narrative"],
  s1_elem_fire_01: ["narrative", "offensive"],

  // ---- Insurgency utility spells (grant-keyword on cast) ----
  // The second-pass misses these because the proposer's offensive
  // heuristic looks at intrinsic keywords, not granted ones. Both
  // grant offensive keywords (stealth/rush variants) to a target;
  // categorize as offensive + reactive (insurgency's "we strike on
  // your move" theme).
  s1_spell_106: ["narrative", "offensive"],
  s1_spell_207: ["offensive", "reactive"],

  // ---- Mechronis Professor signature spells (s2_professors) ----
  // 12 Professors × light + dark = 24 spells. Light variants are
  // sanctioned casts → narrative (the spell IS the Professor's
  // authoritative beat) + reactive (responds to game state). Dark
  // variants are the corruption arc → narrative + offensive (twisted
  // intent, harms others). The proposer can't categorise these
  // because abilities are intentionally empty (auto-draft pending
  // a design balance pass); when abilities land, the proposer will
  // pick them up automatically and these overrides become redundant.
  s2_professors_aoki_private_confession: ["narrative", "offensive"],
  s2_professors_aoki_unseen_passage: ["narrative", "reactive"],
  s2_professors_greenshaw_quarantine: ["narrative", "reactive"],
  s2_professors_greenshaw_thought_virus: ["narrative", "offensive"],
  s2_professors_halverez_soul_read: ["narrative", "reactive"],
  s2_professors_halverez_soul_take: ["narrative", "offensive"],
  s2_professors_kanevas_dissonance: ["narrative", "offensive"],
  s2_professors_kanevas_harmonize: ["narrative", "reactive"],
  s2_professors_kasra_acceptable_casualties: ["narrative", "offensive"],
  s2_professors_kasra_parade_order: ["narrative", "reactive"],
  s2_professors_mireille_thought_carry: ["narrative", "offensive"],
  s2_professors_mireille_viral_word: ["narrative", "reactive"],
  s2_professors_orphic_dimensional_drift: ["narrative", "offensive"],
  s2_professors_orphic_phase_step: ["narrative", "reactive"],
  s2_professors_proctor_architect_s_eye: ["narrative", "offensive"],
  s2_professors_proctor_investigator_s_sight: ["narrative", "reactive"],
  s2_professors_vasara_borrowed_time: ["narrative", "offensive"],
  s2_professors_vasara_second_breath: ["narrative", "reactive"],
  s2_professors_vellis_blood_oath: ["narrative", "offensive"],
  s2_professors_vellis_verbal_contract: ["narrative", "reactive"],
  s2_professors_vent_field_repair: ["narrative", "reactive"],
  s2_professors_vent_salvage_rights: ["narrative", "offensive"],
  s2_professors_vex_house_rules: ["narrative", "offensive"],
  s2_professors_vex_rule_rewrite: ["narrative", "reactive"],
};
