/* ═══════════════════════════════════════════════════════
   S2 HIERARCHY OF THE DAMNED — expansion art manifest
   AUTO-GENERATED from scripts/_gen-art-manifests.mjs.

   Source: producer drop s3://dgrsart/aaa_assets_complete.zip
   (2026-04-28). Files served from
   s3://dgrsart/cdn/client-public/art/expansions/hierarchy-of-damned/
   <rarity>/<assetId>.webp via assetUrl().

   124 cards across 8 rarity buckets.
   ═══════════════════════════════════════════════════════ */

import { assetUrl } from "../../client/src/lib/assetUrl";

export type HierarchyOfDamnedRarity =
  | "mythic"
  | "legendary"
  | "epic"
  | "rare"
  | "uncommon"
  | "common"
  | "act-exclusive"
  | "special-edition";

export interface HierarchyOfDamnedArtEntry {
  /** Canonical asset id (matches uploaded webp filename, no extension). */
  assetId: string;
  /** Rarity bucket. Drives the CDN sub-directory. */
  rarity: HierarchyOfDamnedRarity;
  /** Path relative to apps/client/public, suitable for assetUrl(). */
  relPath: string;
}

const PRODUCER_TO_RARITY: Record<string, HierarchyOfDamnedRarity> = {
  c_suite_mythic: "mythic",
  vp_legendary: "legendary",
  director_epic: "epic",
  manager_rare: "rare",
  analyst_uncommon: "uncommon",
  intern_common: "common",
  act_exclusives: "act-exclusive",
  special_editions: "special-edition"
};

const PRODUCER_TO_CDN: Record<string, string> = {
  c_suite_mythic: "c-suite",
  vp_legendary: "vps",
  director_epic: "directors",
  manager_rare: "managers",
  analyst_uncommon: "analysts",
  intern_common: "interns",
  act_exclusives: "act-exclusives",
  special_editions: "special-editions"
};

export const HIERARCHY_OF_DAMNED_ART: readonly HierarchyOfDamnedArtEntry[] = [
  { assetId: "act1_first_witness", rarity: "act-exclusive", relPath: "art/expansions/hierarchy-of-damned/act-exclusives/act1_first_witness.webp" },
  { assetId: "act1_substrate_static", rarity: "act-exclusive", relPath: "art/expansions/hierarchy-of-damned/act-exclusives/act1_substrate_static.webp" },
  { assetId: "act1_the_signal", rarity: "act-exclusive", relPath: "art/expansions/hierarchy-of-damned/act-exclusives/act1_the_signal.webp" },
  { assetId: "act1_twelve_step_inheritance", rarity: "act-exclusive", relPath: "art/expansions/hierarchy-of-damned/act-exclusives/act1_twelve_step_inheritance.webp" },
  { assetId: "act2_bond_60_silence", rarity: "act-exclusive", relPath: "art/expansions/hierarchy-of-damned/act-exclusives/act2_bond_60_silence.webp" },
  { assetId: "act2_conspiracy_of_two", rarity: "act-exclusive", relPath: "art/expansions/hierarchy-of-damned/act-exclusives/act2_conspiracy_of_two.webp" },
  { assetId: "act2_engineers_bench", rarity: "act-exclusive", relPath: "art/expansions/hierarchy-of-damned/act-exclusives/act2_engineers_bench.webp" },
  { assetId: "act2_the_whisper", rarity: "act-exclusive", relPath: "art/expansions/hierarchy-of-damned/act-exclusives/act2_the_whisper.webp" },
  { assetId: "act3_ithrael_scouts", rarity: "act-exclusive", relPath: "art/expansions/hierarchy-of-damned/act-exclusives/act3_ithrael_scouts.webp" },
  { assetId: "act3_soul_map_calibration", rarity: "act-exclusive", relPath: "art/expansions/hierarchy-of-damned/act-exclusives/act3_soul_map_calibration.webp" },
  { assetId: "act3_the_offer", rarity: "act-exclusive", relPath: "art/expansions/hierarchy-of-damned/act-exclusives/act3_the_offer.webp" },
  { assetId: "act3_three_path_crossroads", rarity: "act-exclusive", relPath: "art/expansions/hierarchy-of-damned/act-exclusives/act3_three_path_crossroads.webp" },
  { assetId: "act4_memory_extraction", rarity: "act-exclusive", relPath: "art/expansions/hierarchy-of-damned/act-exclusives/act4_memory_extraction.webp" },
  { assetId: "act4_oracle_half_mask", rarity: "act-exclusive", relPath: "art/expansions/hierarchy-of-damned/act-exclusives/act4_oracle_half_mask.webp" },
  { assetId: "act4_the_revelation", rarity: "act-exclusive", relPath: "art/expansions/hierarchy-of-damned/act-exclusives/act4_the_revelation.webp" },
  { assetId: "act4_two_witnesses_meet", rarity: "act-exclusive", relPath: "art/expansions/hierarchy-of-damned/act-exclusives/act4_two_witnesses_meet.webp" },
  { assetId: "act5_antiquarian_prestige", rarity: "act-exclusive", relPath: "art/expansions/hierarchy-of-damned/act-exclusives/act5_antiquarian_prestige.webp" },
  { assetId: "act5_sector_navigation_charm", rarity: "act-exclusive", relPath: "art/expansions/hierarchy-of-damned/act-exclusives/act5_sector_navigation_charm.webp" },
  { assetId: "act5_the_map_decoded", rarity: "act-exclusive", relPath: "art/expansions/hierarchy-of-damned/act-exclusives/act5_the_map_decoded.webp" },
  { assetId: "act5_vortex_core_cleared", rarity: "act-exclusive", relPath: "art/expansions/hierarchy-of-damned/act-exclusives/act5_vortex_core_cleared.webp" },
  { assetId: "act6_banishment_glyph", rarity: "act-exclusive", relPath: "art/expansions/hierarchy-of-damned/act-exclusives/act6_banishment_glyph.webp" },
  { assetId: "act6_bond_90_confessional", rarity: "act-exclusive", relPath: "art/expansions/hierarchy-of-damned/act-exclusives/act6_bond_90_confessional.webp" },
  { assetId: "act6_narrators_truth", rarity: "act-exclusive", relPath: "art/expansions/hierarchy-of-damned/act-exclusives/act6_narrators_truth.webp" },
  { assetId: "act6_the_confession", rarity: "act-exclusive", relPath: "art/expansions/hierarchy-of-damned/act-exclusives/act6_the_confession.webp" },
  { assetId: "act7_all_faction_convergence", rarity: "act-exclusive", relPath: "art/expansions/hierarchy-of-damned/act-exclusives/act7_all_faction_convergence.webp" },
  { assetId: "act7_convergence_chord", rarity: "act-exclusive", relPath: "art/expansions/hierarchy-of-damned/act-exclusives/act7_convergence_chord.webp" },
  { assetId: "act7_final_witness_bond100", rarity: "act-exclusive", relPath: "art/expansions/hierarchy-of-damned/act-exclusives/act7_final_witness_bond100.webp" },
  { assetId: "act7_the_convergence", rarity: "act-exclusive", relPath: "art/expansions/hierarchy-of-damned/act-exclusives/act7_the_convergence.webp" },
  { assetId: "s2_hierarchy_anl_brand_coordinator", rarity: "uncommon", relPath: "art/expansions/hierarchy-of-damned/analysts/s2_hierarchy_anl_brand_coordinator.webp" },
  { assetId: "s2_hierarchy_anl_compliance_auditor", rarity: "uncommon", relPath: "art/expansions/hierarchy-of-damned/analysts/s2_hierarchy_anl_compliance_auditor.webp" },
  { assetId: "s2_hierarchy_anl_cs_drone", rarity: "uncommon", relPath: "art/expansions/hierarchy-of-damned/analysts/s2_hierarchy_anl_cs_drone.webp" },
  { assetId: "s2_hierarchy_anl_data_analyst", rarity: "uncommon", relPath: "art/expansions/hierarchy-of-damned/analysts/s2_hierarchy_anl_data_analyst.webp" },
  { assetId: "s2_hierarchy_anl_finance_analyst", rarity: "uncommon", relPath: "art/expansions/hierarchy-of-damned/analysts/s2_hierarchy_anl_finance_analyst.webp" },
  { assetId: "s2_hierarchy_anl_internal_comms", rarity: "uncommon", relPath: "art/expansions/hierarchy-of-damned/analysts/s2_hierarchy_anl_internal_comms.webp" },
  { assetId: "s2_hierarchy_anl_internal_mobility", rarity: "uncommon", relPath: "art/expansions/hierarchy-of-damned/analysts/s2_hierarchy_anl_internal_mobility.webp" },
  { assetId: "s2_hierarchy_anl_ir_coordinator", rarity: "uncommon", relPath: "art/expansions/hierarchy-of-damned/analysts/s2_hierarchy_anl_ir_coordinator.webp" },
  { assetId: "s2_hierarchy_anl_knowledge_management", rarity: "uncommon", relPath: "art/expansions/hierarchy-of-damned/analysts/s2_hierarchy_anl_knowledge_management.webp" },
  { assetId: "s2_hierarchy_anl_marketing_analyst", rarity: "uncommon", relPath: "art/expansions/hierarchy-of-damned/analysts/s2_hierarchy_anl_marketing_analyst.webp" },
  { assetId: "s2_hierarchy_anl_office_manager", rarity: "uncommon", relPath: "art/expansions/hierarchy-of-damned/analysts/s2_hierarchy_anl_office_manager.webp" },
  { assetId: "s2_hierarchy_anl_pricing_analyst", rarity: "uncommon", relPath: "art/expansions/hierarchy-of-damned/analysts/s2_hierarchy_anl_pricing_analyst.webp" },
  { assetId: "s2_hierarchy_anl_procurement_clerk", rarity: "uncommon", relPath: "art/expansions/hierarchy-of-damned/analysts/s2_hierarchy_anl_procurement_clerk.webp" },
  { assetId: "s2_hierarchy_anl_project_coordinator", rarity: "uncommon", relPath: "art/expansions/hierarchy-of-damned/analysts/s2_hierarchy_anl_project_coordinator.webp" },
  { assetId: "s2_hierarchy_anl_qa_imp", rarity: "uncommon", relPath: "art/expansions/hierarchy-of-damned/analysts/s2_hierarchy_anl_qa_imp.webp" },
  { assetId: "s2_hierarchy_anl_recruiting_coordinator", rarity: "uncommon", relPath: "art/expansions/hierarchy-of-damned/analysts/s2_hierarchy_anl_recruiting_coordinator.webp" },
  { assetId: "s2_hierarchy_anl_reporting_specialist", rarity: "uncommon", relPath: "art/expansions/hierarchy-of-damned/analysts/s2_hierarchy_anl_reporting_specialist.webp" },
  { assetId: "s2_hierarchy_anl_risk_modeler", rarity: "uncommon", relPath: "art/expansions/hierarchy-of-damned/analysts/s2_hierarchy_anl_risk_modeler.webp" },
  { assetId: "s2_hierarchy_anl_sales_ops", rarity: "uncommon", relPath: "art/expansions/hierarchy-of-damned/analysts/s2_hierarchy_anl_sales_ops.webp" },
  { assetId: "s2_hierarchy_anl_tax_compliance", rarity: "uncommon", relPath: "art/expansions/hierarchy-of-damned/analysts/s2_hierarchy_anl_tax_compliance.webp" },
  { assetId: "s2_hierarchy_anl_training_content_designer", rarity: "uncommon", relPath: "art/expansions/hierarchy-of-damned/analysts/s2_hierarchy_anl_training_content_designer.webp" },
  { assetId: "s2_hierarchy_anl_travel_expense_auditor", rarity: "uncommon", relPath: "art/expansions/hierarchy-of-damned/analysts/s2_hierarchy_anl_travel_expense_auditor.webp" },
  { assetId: "s2_hierarchy_anl_ux_researcher", rarity: "uncommon", relPath: "art/expansions/hierarchy-of-damned/analysts/s2_hierarchy_anl_ux_researcher.webp" },
  { assetId: "s2_hierarchy_anl_vendor_coordinator", rarity: "uncommon", relPath: "art/expansions/hierarchy-of-damned/analysts/s2_hierarchy_anl_vendor_coordinator.webp" },
  { assetId: "s2_hierarchy_ceo_mol_garath", rarity: "mythic", relPath: "art/expansions/hierarchy-of-damned/c-suite/s2_hierarchy_ceo_mol_garath.webp" },
  { assetId: "s2_hierarchy_cfo_xeth_raal", rarity: "mythic", relPath: "art/expansions/hierarchy-of-damned/c-suite/s2_hierarchy_cfo_xeth_raal.webp" },
  { assetId: "s2_hierarchy_chro_mor_vethic", rarity: "mythic", relPath: "art/expansions/hierarchy-of-damned/c-suite/s2_hierarchy_chro_mor_vethic.webp" },
  { assetId: "s2_hierarchy_ciso_iglarath", rarity: "mythic", relPath: "art/expansions/hierarchy-of-damned/c-suite/s2_hierarchy_ciso_iglarath.webp" },
  { assetId: "s2_hierarchy_cmo_vex_drelm", rarity: "mythic", relPath: "art/expansions/hierarchy-of-damned/c-suite/s2_hierarchy_cmo_vex_drelm.webp" },
  { assetId: "s2_hierarchy_coo_ririahlia", rarity: "mythic", relPath: "art/expansions/hierarchy-of-damned/c-suite/s2_hierarchy_coo_ririahlia.webp" },
  { assetId: "s2_hierarchy_cto_skarn_iterate", rarity: "mythic", relPath: "art/expansions/hierarchy-of-damned/c-suite/s2_hierarchy_cto_skarn_iterate.webp" },
  { assetId: "s2_hierarchy_dir_bottom_line_decimator", rarity: "epic", relPath: "art/expansions/hierarchy-of-damned/directors/s2_hierarchy_dir_bottom_line_decimator.webp" },
  { assetId: "s2_hierarchy_dir_compliance_inquisitor", rarity: "epic", relPath: "art/expansions/hierarchy-of-damned/directors/s2_hierarchy_dir_compliance_inquisitor.webp" },
  { assetId: "s2_hierarchy_dir_cross_functional_predator", rarity: "epic", relPath: "art/expansions/hierarchy-of-damned/directors/s2_hierarchy_dir_cross_functional_predator.webp" },
  { assetId: "s2_hierarchy_dir_fenra", rarity: "epic", relPath: "art/expansions/hierarchy-of-damned/directors/s2_hierarchy_dir_fenra.webp" },
  { assetId: "s2_hierarchy_dir_jira_ghoul", rarity: "epic", relPath: "art/expansions/hierarchy-of-damned/directors/s2_hierarchy_dir_jira_ghoul.webp" },
  { assetId: "s2_hierarchy_dir_metrics_oracle", rarity: "epic", relPath: "art/expansions/hierarchy-of-damned/directors/s2_hierarchy_dir_metrics_oracle.webp" },
  { assetId: "s2_hierarchy_dir_okr_specter", rarity: "epic", relPath: "art/expansions/hierarchy-of-damned/directors/s2_hierarchy_dir_okr_specter.webp" },
  { assetId: "s2_hierarchy_dir_pivot_demon", rarity: "epic", relPath: "art/expansions/hierarchy-of-damned/directors/s2_hierarchy_dir_pivot_demon.webp" },
  { assetId: "s2_hierarchy_dir_q4_ritualist", rarity: "epic", relPath: "art/expansions/hierarchy-of-damned/directors/s2_hierarchy_dir_q4_ritualist.webp" },
  { assetId: "s2_hierarchy_dir_rif_custodian", rarity: "epic", relPath: "art/expansions/hierarchy-of-damned/directors/s2_hierarchy_dir_rif_custodian.webp" },
  { assetId: "s2_hierarchy_dir_synergy_vampire", rarity: "epic", relPath: "art/expansions/hierarchy-of-damned/directors/s2_hierarchy_dir_synergy_vampire.webp" },
  { assetId: "s2_hierarchy_dir_townhall_phantom", rarity: "epic", relPath: "art/expansions/hierarchy-of-damned/directors/s2_hierarchy_dir_townhall_phantom.webp" },
  { assetId: "s2_hierarchy_dir_velm_acrith", rarity: "epic", relPath: "art/expansions/hierarchy-of-damned/directors/s2_hierarchy_dir_velm_acrith.webp" },
  { assetId: "s2_hierarchy_dir_velocity_wraith", rarity: "epic", relPath: "art/expansions/hierarchy-of-damned/directors/s2_hierarchy_dir_velocity_wraith.webp" },
  { assetId: "s2_hierarchy_intn_calendar_sync_imp", rarity: "common", relPath: "art/expansions/hierarchy-of-damned/interns/s2_hierarchy_intn_calendar_sync_imp.webp" },
  { assetId: "s2_hierarchy_intn_coffee_runner", rarity: "common", relPath: "art/expansions/hierarchy-of-damned/interns/s2_hierarchy_intn_coffee_runner.webp" },
  { assetId: "s2_hierarchy_intn_data_entry_drone", rarity: "common", relPath: "art/expansions/hierarchy-of-damned/interns/s2_hierarchy_intn_data_entry_drone.webp" },
  { assetId: "s2_hierarchy_intn_document_reviewer", rarity: "common", relPath: "art/expansions/hierarchy-of-damned/interns/s2_hierarchy_intn_document_reviewer.webp" },
  { assetId: "s2_hierarchy_intn_eoq_casualty", rarity: "common", relPath: "art/expansions/hierarchy-of-damned/interns/s2_hierarchy_intn_eoq_casualty.webp" },
  { assetId: "s2_hierarchy_intn_lunch_order_coordinator", rarity: "common", relPath: "art/expansions/hierarchy-of-damned/interns/s2_hierarchy_intn_lunch_order_coordinator.webp" },
  { assetId: "s2_hierarchy_intn_new_hire", rarity: "common", relPath: "art/expansions/hierarchy-of-damned/interns/s2_hierarchy_intn_new_hire.webp" },
  { assetId: "s2_hierarchy_intn_note_taker", rarity: "common", relPath: "art/expansions/hierarchy-of-damned/interns/s2_hierarchy_intn_note_taker.webp" },
  { assetId: "s2_hierarchy_intn_onboarding_shadow", rarity: "common", relPath: "art/expansions/hierarchy-of-damned/interns/s2_hierarchy_intn_onboarding_shadow.webp" },
  { assetId: "s2_hierarchy_intn_onboarding_survivor", rarity: "common", relPath: "art/expansions/hierarchy-of-damned/interns/s2_hierarchy_intn_onboarding_survivor.webp" },
  { assetId: "s2_hierarchy_intn_print_room_attendant", rarity: "common", relPath: "art/expansions/hierarchy-of-damned/interns/s2_hierarchy_intn_print_room_attendant.webp" },
  { assetId: "s2_hierarchy_intn_slack_reactor", rarity: "common", relPath: "art/expansions/hierarchy-of-damned/interns/s2_hierarchy_intn_slack_reactor.webp" },
  { assetId: "s2_hierarchy_intn_stand_up_lurker", rarity: "common", relPath: "art/expansions/hierarchy-of-damned/interns/s2_hierarchy_intn_stand_up_lurker.webp" },
  { assetId: "s2_hierarchy_intn_status_update_drone", rarity: "common", relPath: "art/expansions/hierarchy-of-damned/interns/s2_hierarchy_intn_status_update_drone.webp" },
  { assetId: "s2_hierarchy_intn_survey_form_drone", rarity: "common", relPath: "art/expansions/hierarchy-of-damned/interns/s2_hierarchy_intn_survey_form_drone.webp" },
  { assetId: "s2_hierarchy_intn_ticket_triager", rarity: "common", relPath: "art/expansions/hierarchy-of-damned/interns/s2_hierarchy_intn_ticket_triager.webp" },
  { assetId: "s2_hierarchy_mgr_backlog_maw", rarity: "rare", relPath: "art/expansions/hierarchy-of-damned/managers/s2_hierarchy_mgr_backlog_maw.webp" },
  { assetId: "s2_hierarchy_mgr_burndown_imp", rarity: "rare", relPath: "art/expansions/hierarchy-of-damned/managers/s2_hierarchy_mgr_burndown_imp.webp" },
  { assetId: "s2_hierarchy_mgr_calendar_demon", rarity: "rare", relPath: "art/expansions/hierarchy-of-damned/managers/s2_hierarchy_mgr_calendar_demon.webp" },
  { assetId: "s2_hierarchy_mgr_channel_conflict_goblin", rarity: "rare", relPath: "art/expansions/hierarchy-of-damned/managers/s2_hierarchy_mgr_channel_conflict_goblin.webp" },
  { assetId: "s2_hierarchy_mgr_demand_gen_phantom", rarity: "rare", relPath: "art/expansions/hierarchy-of-damned/managers/s2_hierarchy_mgr_demand_gen_phantom.webp" },
  { assetId: "s2_hierarchy_mgr_estimation_goblin", rarity: "rare", relPath: "art/expansions/hierarchy-of-damned/managers/s2_hierarchy_mgr_estimation_goblin.webp" },
  { assetId: "s2_hierarchy_mgr_midyear_adjuster", rarity: "rare", relPath: "art/expansions/hierarchy-of-damned/managers/s2_hierarchy_mgr_midyear_adjuster.webp" },
  { assetId: "s2_hierarchy_mgr_perf_review_wraith", rarity: "rare", relPath: "art/expansions/hierarchy-of-damned/managers/s2_hierarchy_mgr_perf_review_wraith.webp" },
  { assetId: "s2_hierarchy_mgr_pivot_memo_phantom", rarity: "rare", relPath: "art/expansions/hierarchy-of-damned/managers/s2_hierarchy_mgr_pivot_memo_phantom.webp" },
  { assetId: "s2_hierarchy_mgr_process_imp", rarity: "rare", relPath: "art/expansions/hierarchy-of-damned/managers/s2_hierarchy_mgr_process_imp.webp" },
  { assetId: "s2_hierarchy_mgr_quarterly_forecaster", rarity: "rare", relPath: "art/expansions/hierarchy-of-damned/managers/s2_hierarchy_mgr_quarterly_forecaster.webp" },
  { assetId: "s2_hierarchy_mgr_reorg_specter", rarity: "rare", relPath: "art/expansions/hierarchy-of-damned/managers/s2_hierarchy_mgr_reorg_specter.webp" },
  { assetId: "s2_hierarchy_mgr_roadmap_banshee", rarity: "rare", relPath: "art/expansions/hierarchy-of-damned/managers/s2_hierarchy_mgr_roadmap_banshee.webp" },
  { assetId: "s2_hierarchy_mgr_slack_phantom", rarity: "rare", relPath: "art/expansions/hierarchy-of-damned/managers/s2_hierarchy_mgr_slack_phantom.webp" },
  { assetId: "s2_hierarchy_mgr_stakeholder_wrangler", rarity: "rare", relPath: "art/expansions/hierarchy-of-damned/managers/s2_hierarchy_mgr_stakeholder_wrangler.webp" },
  { assetId: "s2_hierarchy_mgr_stand_up_wraith", rarity: "rare", relPath: "art/expansions/hierarchy-of-damned/managers/s2_hierarchy_mgr_stand_up_wraith.webp" },
  { assetId: "s2_hierarchy_mgr_token_economy_imp", rarity: "rare", relPath: "art/expansions/hierarchy-of-damned/managers/s2_hierarchy_mgr_token_economy_imp.webp" },
  { assetId: "s2_hierarchy_mgr_vendor_mgmt_wraith", rarity: "rare", relPath: "art/expansions/hierarchy-of-damned/managers/s2_hierarchy_mgr_vendor_mgmt_wraith.webp" },
  { assetId: "secret_act1_memoirist_is_memoir", rarity: "special-edition", relPath: "art/expansions/hierarchy-of-damned/special-editions/secret_act1_memoirist_is_memoir.webp" },
  { assetId: "secret_act2_engineers_bench", rarity: "special-edition", relPath: "art/expansions/hierarchy-of-damned/special-editions/secret_act2_engineers_bench.webp" },
  { assetId: "secret_act3_pledge_was_made", rarity: "special-edition", relPath: "art/expansions/hierarchy-of-damned/special-editions/secret_act3_pledge_was_made.webp" },
  { assetId: "secret_act4_witnesses_always_knew", rarity: "special-edition", relPath: "art/expansions/hierarchy-of-damned/special-editions/secret_act4_witnesses_always_knew.webp" },
  { assetId: "secret_act5_source_is_reflection", rarity: "special-edition", relPath: "art/expansions/hierarchy-of-damned/special-editions/secret_act5_source_is_reflection.webp" },
  { assetId: "secret_act6_confession_mutual", rarity: "special-edition", relPath: "art/expansions/hierarchy-of-damned/special-editions/secret_act6_confession_mutual.webp" },
  { assetId: "secret_act7_chord_is_listener", rarity: "special-edition", relPath: "art/expansions/hierarchy-of-damned/special-editions/secret_act7_chord_is_listener.webp" },
  { assetId: "special_authors_edition_s2", rarity: "special-edition", relPath: "art/expansions/hierarchy-of-damned/special-editions/special_authors_edition_s2.webp" },
  { assetId: "special_founding_author", rarity: "special-edition", relPath: "art/expansions/hierarchy-of-damned/special-editions/special_founding_author.webp" },
  { assetId: "special_the_author_bp50", rarity: "special-edition", relPath: "art/expansions/hierarchy-of-damned/special-editions/special_the_author_bp50.webp" },
  { assetId: "s2_hierarchy_vp_drask_vornal", rarity: "legendary", relPath: "art/expansions/hierarchy-of-damned/vps/s2_hierarchy_vp_drask_vornal.webp" },
  { assetId: "s2_hierarchy_vp_kelv_orth", rarity: "legendary", relPath: "art/expansions/hierarchy-of-damned/vps/s2_hierarchy_vp_kelv_orth.webp" },
  { assetId: "s2_hierarchy_vp_kragvex", rarity: "legendary", relPath: "art/expansions/hierarchy-of-damned/vps/s2_hierarchy_vp_kragvex.webp" },
  { assetId: "s2_hierarchy_vp_nessith", rarity: "legendary", relPath: "art/expansions/hierarchy-of-damned/vps/s2_hierarchy_vp_nessith.webp" },
  { assetId: "s2_hierarchy_vp_shadow_tongue", rarity: "legendary", relPath: "art/expansions/hierarchy-of-damned/vps/s2_hierarchy_vp_shadow_tongue.webp" },
  { assetId: "s2_hierarchy_vp_thelv_oss", rarity: "legendary", relPath: "art/expansions/hierarchy-of-damned/vps/s2_hierarchy_vp_thelv_oss.webp" },
  { assetId: "s2_hierarchy_vp_varkul", rarity: "legendary", relPath: "art/expansions/hierarchy-of-damned/vps/s2_hierarchy_vp_varkul.webp" },
];

const BY_ID = new Map(HIERARCHY_OF_DAMNED_ART.map((e) => [e.assetId, e] as const));

/** Resolve a Hierarchy of the Damned art assetId → CDN URL.
 *  Returns undefined if the id isn't in the manifest. */
export function hierarchyOfDamnedArtUrl(
  assetId: string | undefined,
): string | undefined {
  if (!assetId) return undefined;
  const e = BY_ID.get(assetId);
  return e ? assetUrl(e.relPath) : undefined;
}

/** Every assetId for a given rarity bucket, alphabetically. */
export function hierarchyOfDamnedByRarity(
  rarity: HierarchyOfDamnedRarity,
): readonly HierarchyOfDamnedArtEntry[] {
  return HIERARCHY_OF_DAMNED_ART.filter((e) => e.rarity === rarity);
}

/** Total card count, exposed for tests + dashboards. */
export const HIERARCHY_OF_DAMNED_TOTAL = HIERARCHY_OF_DAMNED_ART.length;
