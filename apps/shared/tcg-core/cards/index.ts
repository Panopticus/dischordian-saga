/**
 * Card registry barrel — 103 Season 1 cards + 1 token(s) = 104 definitions.
 */
import type { CardDefinition } from "../index";

/* ─── Antiquarian ─── */
import { cardDef as s1_char_018_the_antiquarian } from "./definitions/antiquarian/s1_char_018_the_antiquarian.ts";
import { cardDef as s1_char_043_the_programmer } from "./definitions/antiquarian/s1_char_043_the_programmer.ts";
import { cardDef as s1_char_058_epoch_walker } from "./definitions/antiquarian/s1_char_058_epoch_walker.ts";
import { cardDef as s1_char_059_chronosplicer } from "./definitions/antiquarian/s1_char_059_chronosplicer.ts";
import { cardDef as s1_char_060_relic_keeper } from "./definitions/antiquarian/s1_char_060_relic_keeper.ts";
import { cardDef as s1_char_061_temporal_archivist } from "./definitions/antiquarian/s1_char_061_temporal_archivist.ts";
import { cardDef as s1_char_062_hourglass_golem } from "./definitions/antiquarian/s1_char_062_hourglass_golem.ts";
import { cardDef as s1_char_063_paradox_acolyte } from "./definitions/antiquarian/s1_char_063_paradox_acolyte.ts";
import { cardDef as s1_char_064_memory_thief } from "./definitions/antiquarian/s1_char_064_memory_thief.ts";
import { cardDef as s1_char_065_age_ender } from "./definitions/antiquarian/s1_char_065_age_ender.ts";

/* ─── Architect ─── */
import { cardDef as s1_char_006_dr_lyra_vox } from "./definitions/architect/s1_char_006_dr_lyra_vox.ts";
import { cardDef as s1_char_007_general_alarik } from "./definitions/architect/s1_char_007_general_alarik.ts";
import { cardDef as s1_char_008_general_binath } from "./definitions/architect/s1_char_008_general_binath.ts";
import { cardDef as s1_char_009_general_prometheus } from "./definitions/architect/s1_char_009_general_prometheus.ts";
import { cardDef as s1_char_013_master_of_rlyeh } from "./definitions/architect/s1_char_013_master_of_rlyeh.ts";
import { cardDef as s1_char_015_panoptic_elara } from "./definitions/architect/s1_char_015_panoptic_elara.ts";
import { cardDef as s1_char_016_senator_elara_voss } from "./definitions/architect/s1_char_016_senator_elara_voss.ts";
import { cardDef as s1_char_019_the_architect } from "./definitions/architect/s1_char_019_the_architect.ts";
import { cardDef as s1_char_021_the_conexus } from "./definitions/architect/s1_char_021_the_conexus.ts";
import { cardDef as s1_char_022_the_collector } from "./definitions/architect/s1_char_022_the_collector.ts";
import { cardDef as s1_char_024_the_detective } from "./definitions/architect/s1_char_024_the_detective.ts";
import { cardDef as s1_char_030_the_game_master } from "./definitions/architect/s1_char_030_the_game_master.ts";
import { cardDef as s1_char_035_the_jailer } from "./definitions/architect/s1_char_035_the_jailer.ts";
import { cardDef as s1_char_038_the_meme } from "./definitions/architect/s1_char_038_the_meme.ts";
import { cardDef as s1_char_039_the_necromancer } from "./definitions/architect/s1_char_039_the_necromancer.ts";
import { cardDef as s1_char_042_the_politician } from "./definitions/architect/s1_char_042_the_politician.ts";

/* ─── Dreamer ─── */
import { cardDef as s1_char_005_destiny } from "./definitions/dreamer/s1_char_005_destiny.ts";
import { cardDef as s1_char_014_nythera } from "./definitions/dreamer/s1_char_014_nythera.ts";
import { cardDef as s1_char_017_the_advocate } from "./definitions/dreamer/s1_char_017_the_advocate.ts";
import { cardDef as s1_char_023_the_degen } from "./definitions/dreamer/s1_char_023_the_degen.ts";
import { cardDef as s1_char_025_the_dreamer } from "./definitions/dreamer/s1_char_025_the_dreamer.ts";
import { cardDef as s1_char_027_the_enigma } from "./definitions/dreamer/s1_char_027_the_enigma.ts";
import { cardDef as s1_char_029_the_forgotten } from "./definitions/dreamer/s1_char_029_the_forgotten.ts";
import { cardDef as s1_char_034_the_inventor } from "./definitions/dreamer/s1_char_034_the_inventor.ts";
import { cardDef as s1_char_036_the_judge } from "./definitions/dreamer/s1_char_036_the_judge.ts";
import { cardDef as s1_char_037_the_knowledge } from "./definitions/dreamer/s1_char_037_the_knowledge.ts";
import { cardDef as s1_char_045_the_resurrectionist } from "./definitions/dreamer/s1_char_045_the_resurrectionist.ts";
import { cardDef as s1_char_046_the_seer } from "./definitions/dreamer/s1_char_046_the_seer.ts";
import { cardDef as s1_song_082_top_floor_door } from "./definitions/dreamer/s1_song_082_top_floor_door.ts";

/* ─── Insurgency ─── */
import { cardDef as s1_char_002_agent_zero } from "./definitions/insurgency/s1_char_002_agent_zero.ts";
import { cardDef as s1_char_010_iron_lion } from "./definitions/insurgency/s1_char_010_iron_lion.ts";
import { cardDef as s1_char_011_jericho_jones } from "./definitions/insurgency/s1_char_011_jericho_jones.ts";
import { cardDef as s1_char_012_kael } from "./definitions/insurgency/s1_char_012_kael.ts";
import { cardDef as s1_char_026_the_engineer } from "./definitions/insurgency/s1_char_026_the_engineer.ts";
import { cardDef as s1_char_028_the_eyes } from "./definitions/insurgency/s1_char_028_the_eyes.ts";
import { cardDef as s1_char_031_the_hierophant } from "./definitions/insurgency/s1_char_031_the_hierophant.ts";
import { cardDef as s1_char_040_the_nomad } from "./definitions/insurgency/s1_char_040_the_nomad.ts";
import { cardDef as s1_char_041_the_oracle } from "./definitions/insurgency/s1_char_041_the_oracle.ts";
import { cardDef as s1_char_044_the_recruiter } from "./definitions/insurgency/s1_char_044_the_recruiter.ts";
import { cardDef as s1_char_047_the_shadow_tongue } from "./definitions/insurgency/s1_char_047_the_shadow_tongue.ts";
import { cardDef as s1_song_091_i_love_war } from "./definitions/insurgency/s1_song_091_i_love_war.ts";

/* ─── Neutral ─── */
import { cardDef as s1_char_004_ambassador_veron } from "./definitions/neutral/s1_char_004_ambassador_veron.ts";
import { cardDef as s1_char_086_wandering_merchant } from "./definitions/neutral/s1_char_086_wandering_merchant.ts";
import { cardDef as s1_char_087_scrapyard_golem } from "./definitions/neutral/s1_char_087_scrapyard_golem.ts";
import { cardDef as s1_char_088_field_medic } from "./definitions/neutral/s1_char_088_field_medic.ts";
import { cardDef as s1_char_089_courier_sprite } from "./definitions/neutral/s1_char_089_courier_sprite.ts";
import { cardDef as s1_char_090_hired_blade } from "./definitions/neutral/s1_char_090_hired_blade.ts";
import { cardDef as s1_char_091_border_scout } from "./definitions/neutral/s1_char_091_border_scout.ts";
import { cardDef as s1_char_092_ruin_stalker } from "./definitions/neutral/s1_char_092_ruin_stalker.ts";
import { cardDef as s1_char_093_ironclad_veteran } from "./definitions/neutral/s1_char_093_ironclad_veteran.ts";
import { cardDef as s1_song_059_lip_service } from "./definitions/neutral/s1_song_059_lip_service.ts";
import { cardDef as s1_song_060_nonos } from "./definitions/neutral/s1_song_060_nonos.ts";
import { cardDef as s1_song_061_the_enigmas_lament } from "./definitions/neutral/s1_song_061_the_enigmas_lament.ts";
import { cardDef as s1_song_062_the_two_witnesses } from "./definitions/neutral/s1_song_062_the_two_witnesses.ts";
import { cardDef as s1_song_063_building_the_architect } from "./definitions/neutral/s1_song_063_building_the_architect.ts";
import { cardDef as s1_song_064_dischordian_logic } from "./definitions/neutral/s1_song_064_dischordian_logic.ts";
import { cardDef as s1_song_065_sixth_sense } from "./definitions/neutral/s1_song_065_sixth_sense.ts";
import { cardDef as s1_song_066_the_book_of_daniel } from "./definitions/neutral/s1_song_066_the_book_of_daniel.ts";
import { cardDef as s1_song_070_traces_of_something_spiritual } from "./definitions/neutral/s1_song_070_traces_of_something_spiritual.ts";
import { cardDef as s1_song_079_shades_of_grey } from "./definitions/neutral/s1_song_079_shades_of_grey.ts";
import { cardDef as s1_song_084_judgment_day } from "./definitions/neutral/s1_song_084_judgment_day.ts";

/* ─── New Babylon ─── */
import { cardDef as s1_char_001_adjudicar_locke } from "./definitions/new_babylon/s1_char_001_adjudicar_locke.ts";
import { cardDef as s1_char_003_akai_shi } from "./definitions/new_babylon/s1_char_003_akai_shi.ts";
import { cardDef as s1_char_020_the_authority } from "./definitions/new_babylon/s1_char_020_the_authority.ts";
import { cardDef as s1_char_033_the_human } from "./definitions/new_babylon/s1_char_033_the_human.ts";
import { cardDef as s1_char_061_vexahlia_the_taskmaster } from "./definitions/new_babylon/s1_char_061_vexahlia_the_taskmaster.ts";
import { cardDef as s1_char_066_fenra_the_moon_tyrant } from "./definitions/new_babylon/s1_char_066_fenra_the_moon_tyrant.ts";
import { cardDef as s1_char_078_governor_thane } from "./definitions/new_babylon/s1_char_078_governor_thane.ts";
import { cardDef as s1_char_079_citadel_guardian } from "./definitions/new_babylon/s1_char_079_citadel_guardian.ts";
import { cardDef as s1_char_080_district_enforcer } from "./definitions/new_babylon/s1_char_080_district_enforcer.ts";
import { cardDef as s1_char_081_tribunal_magistrate } from "./definitions/new_babylon/s1_char_081_tribunal_magistrate.ts";
import { cardDef as s1_char_082_spire_assassin } from "./definitions/new_babylon/s1_char_082_spire_assassin.ts";
import { cardDef as s1_char_083_propaganda_herald } from "./definitions/new_babylon/s1_char_083_propaganda_herald.ts";
import { cardDef as s1_char_084_iron_decree } from "./definitions/new_babylon/s1_char_084_iron_decree.ts";
import { cardDef as s1_char_085_sector_warden } from "./definitions/new_babylon/s1_char_085_sector_warden.ts";

/* ─── Panopticon ─── */
import { cardDef as s1_char_050_warden_prime } from "./definitions/panopticon/s1_char_050_warden_prime.ts";
import { cardDef as s1_char_051_oculus_sentinel } from "./definitions/panopticon/s1_char_051_oculus_sentinel.ts";
import { cardDef as s1_char_052_compliance_officer } from "./definitions/panopticon/s1_char_052_compliance_officer.ts";
import { cardDef as s1_char_053_data_harvester } from "./definitions/panopticon/s1_char_053_data_harvester.ts";
import { cardDef as s1_char_054_panoptic_drone } from "./definitions/panopticon/s1_char_054_panoptic_drone.ts";
import { cardDef as s1_char_055_thought_censor } from "./definitions/panopticon/s1_char_055_thought_censor.ts";
import { cardDef as s1_char_056_registry_clerk } from "./definitions/panopticon/s1_char_056_registry_clerk.ts";
import { cardDef as s1_char_057_blacksite_interrogator } from "./definitions/panopticon/s1_char_057_blacksite_interrogator.ts";

/* ─── Thought Virus ─── */
import { cardDef as s1_char_032_the_host } from "./definitions/thought_virus/s1_char_032_the_host.ts";
import { cardDef as s1_char_049_the_source } from "./definitions/thought_virus/s1_char_049_the_source.ts";
import { cardDef as s1_char_070_patient_zero } from "./definitions/thought_virus/s1_char_070_patient_zero.ts";
import { cardDef as s1_char_071_neural_parasite } from "./definitions/thought_virus/s1_char_071_neural_parasite.ts";
import { cardDef as s1_char_072_memetic_carrier } from "./definitions/thought_virus/s1_char_072_memetic_carrier.ts";
import { cardDef as s1_char_073_cognitive_blight } from "./definitions/thought_virus/s1_char_073_cognitive_blight.ts";
import { cardDef as s1_char_074_vector_swarm } from "./definitions/thought_virus/s1_char_074_vector_swarm.ts";
import { cardDef as s1_char_075_plague_herald } from "./definitions/thought_virus/s1_char_075_plague_herald.ts";
import { cardDef as s1_char_076_synaptic_horror } from "./definitions/thought_virus/s1_char_076_synaptic_horror.ts";
import { cardDef as s1_char_077_mind_rot_drone } from "./definitions/thought_virus/s1_char_077_mind_rot_drone.ts";

/* ─── Tokens ─── */
import { cardDef as token_wolf_2_2 } from "./tokens/token_wolf_2_2";

export const ALL_CARD_DEFINITIONS: readonly CardDefinition[] = Object.freeze([
  s1_char_018_the_antiquarian,
  s1_char_043_the_programmer,
  s1_char_058_epoch_walker,
  s1_char_059_chronosplicer,
  s1_char_060_relic_keeper,
  s1_char_061_temporal_archivist,
  s1_char_062_hourglass_golem,
  s1_char_063_paradox_acolyte,
  s1_char_064_memory_thief,
  s1_char_065_age_ender,
  s1_char_006_dr_lyra_vox,
  s1_char_007_general_alarik,
  s1_char_008_general_binath,
  s1_char_009_general_prometheus,
  s1_char_013_master_of_rlyeh,
  s1_char_015_panoptic_elara,
  s1_char_016_senator_elara_voss,
  s1_char_019_the_architect,
  s1_char_021_the_conexus,
  s1_char_022_the_collector,
  s1_char_024_the_detective,
  s1_char_030_the_game_master,
  s1_char_035_the_jailer,
  s1_char_038_the_meme,
  s1_char_039_the_necromancer,
  s1_char_042_the_politician,
  s1_char_005_destiny,
  s1_char_014_nythera,
  s1_char_017_the_advocate,
  s1_char_023_the_degen,
  s1_char_025_the_dreamer,
  s1_char_027_the_enigma,
  s1_char_029_the_forgotten,
  s1_char_034_the_inventor,
  s1_char_036_the_judge,
  s1_char_037_the_knowledge,
  s1_char_045_the_resurrectionist,
  s1_char_046_the_seer,
  s1_song_082_top_floor_door,
  s1_char_002_agent_zero,
  s1_char_010_iron_lion,
  s1_char_011_jericho_jones,
  s1_char_012_kael,
  s1_char_026_the_engineer,
  s1_char_028_the_eyes,
  s1_char_031_the_hierophant,
  s1_char_040_the_nomad,
  s1_char_041_the_oracle,
  s1_char_044_the_recruiter,
  s1_char_047_the_shadow_tongue,
  s1_song_091_i_love_war,
  s1_char_004_ambassador_veron,
  s1_char_086_wandering_merchant,
  s1_char_087_scrapyard_golem,
  s1_char_088_field_medic,
  s1_char_089_courier_sprite,
  s1_char_090_hired_blade,
  s1_char_091_border_scout,
  s1_char_092_ruin_stalker,
  s1_char_093_ironclad_veteran,
  s1_song_059_lip_service,
  s1_song_060_nonos,
  s1_song_061_the_enigmas_lament,
  s1_song_062_the_two_witnesses,
  s1_song_063_building_the_architect,
  s1_song_064_dischordian_logic,
  s1_song_065_sixth_sense,
  s1_song_066_the_book_of_daniel,
  s1_song_070_traces_of_something_spiritual,
  s1_song_079_shades_of_grey,
  s1_song_084_judgment_day,
  s1_char_001_adjudicar_locke,
  s1_char_003_akai_shi,
  s1_char_020_the_authority,
  s1_char_033_the_human,
  s1_char_061_vexahlia_the_taskmaster,
  s1_char_066_fenra_the_moon_tyrant,
  s1_char_078_governor_thane,
  s1_char_079_citadel_guardian,
  s1_char_080_district_enforcer,
  s1_char_081_tribunal_magistrate,
  s1_char_082_spire_assassin,
  s1_char_083_propaganda_herald,
  s1_char_084_iron_decree,
  s1_char_085_sector_warden,
  s1_char_050_warden_prime,
  s1_char_051_oculus_sentinel,
  s1_char_052_compliance_officer,
  s1_char_053_data_harvester,
  s1_char_054_panoptic_drone,
  s1_char_055_thought_censor,
  s1_char_056_registry_clerk,
  s1_char_057_blacksite_interrogator,
  s1_char_032_the_host,
  s1_char_049_the_source,
  s1_char_070_patient_zero,
  s1_char_071_neural_parasite,
  s1_char_072_memetic_carrier,
  s1_char_073_cognitive_blight,
  s1_char_074_vector_swarm,
  s1_char_075_plague_herald,
  s1_char_076_synaptic_horror,
  s1_char_077_mind_rot_drone,
  token_wolf_2_2,
]);
