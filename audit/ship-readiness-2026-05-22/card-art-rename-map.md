# Card art — rewire map

Card definitions parsed: **1177**
- art path matches CDN as-is: **1023**
- art path missing, auto-rewire suggested: **105**
- art path missing, ambiguous: **49**

The producer renamed the card PNGs from the original
`s1_<category>_<faction>_<tier>` slug to descriptive `<snake_case_name>`
but the card defs still reference the old slugs. This table
matches each broken `art:` field to the descriptive PNG actually
shipped on CDN. Apply the suggested values via a search-and-replace
over the `art: assetUrl("…")` lines listed in the Source column.

## Auto-mapped (high confidence)

| Card id | Card name | Old (BROKEN) | New (PROPOSED) | Source | Note |
|---|---|---|---|---|---|
| `s1_alleg_antiquarian_t1` | Antiquarian Apprentice | `art/cards/allegiance/s1_alleg_antiquarian_t1.webp` | `art/cards/allegiance/antiquarian_apprentice_t1.webp` | `apps/shared/tcg-core/cards/definitions/allegiance/antiquarian.ts` | |
| `s1_alleg_antiquarian_t2` | Antiquarian Scholar | `art/cards/allegiance/s1_alleg_antiquarian_t2.webp` | `art/cards/allegiance/antiquarian_scholar_t2.webp` | `apps/shared/tcg-core/cards/definitions/allegiance/antiquarian.ts` | |
| `s1_alleg_antiquarian_t3` | Antiquarian Curator | `art/cards/allegiance/s1_alleg_antiquarian_t3.webp` | `art/cards/allegiance/antiquarian_curator_t3.webp` | `apps/shared/tcg-core/cards/definitions/allegiance/antiquarian.ts` | |
| `s1_alleg_antiquarian_t4` | Antiquarian Victorious Lorekeeper | `art/cards/allegiance/s1_alleg_antiquarian_t4.webp` | `art/cards/allegiance/antiquarian_lorekeeper_t4.webp` | `apps/shared/tcg-core/cards/definitions/allegiance/antiquarian.ts` | |
| `s1_alleg_antiquarian_t5` | Antiquarian Archive-Keeper | `art/cards/allegiance/s1_alleg_antiquarian_t5.webp` | `art/cards/allegiance/antiquarian_archivekeeper_t5.webp` | `apps/shared/tcg-core/cards/definitions/allegiance/antiquarian.ts` | |
| `s1_alleg_antiquarian_t6` | Antiquarian Champion | `art/cards/allegiance/s1_alleg_antiquarian_t6.webp` | `art/cards/allegiance/antiquarian_champion_t6.webp` | `apps/shared/tcg-core/cards/definitions/allegiance/antiquarian.ts` | |
| `s1_alleg_architect_t1` | Architect Initiate | `art/cards/allegiance/s1_alleg_architect_t1.webp` | `art/cards/allegiance/architect_initiate_t1.webp` | `apps/shared/tcg-core/cards/definitions/allegiance/architect.ts` | |
| `s1_alleg_architect_t2` | Architect Loyal Servant | `art/cards/allegiance/s1_alleg_architect_t2.webp` | `art/cards/allegiance/architect_servant_t2.webp` | `apps/shared/tcg-core/cards/definitions/allegiance/architect.ts` | |
| `s1_alleg_architect_t3` | Architect Veteran | `art/cards/allegiance/s1_alleg_architect_t3.webp` | `art/cards/allegiance/architect_veteran_t3.webp` | `apps/shared/tcg-core/cards/definitions/allegiance/architect.ts` | |
| `s1_alleg_architect_t4` | Architect Victorious Veteran | `art/cards/allegiance/s1_alleg_architect_t4.webp` | `art/cards/allegiance/architect_victorious_t4.webp` | `apps/shared/tcg-core/cards/definitions/allegiance/architect.ts` | |
| `s1_alleg_architect_t5` | Architect Elite | `art/cards/allegiance/s1_alleg_architect_t5.webp` | `art/cards/allegiance/architect_elite_t5.webp` | `apps/shared/tcg-core/cards/definitions/allegiance/architect.ts` | |
| `s1_alleg_architect_t6` | Architect Champion | `art/cards/allegiance/s1_alleg_architect_t6.webp` | `art/cards/allegiance/architect_champion_t6.webp` | `apps/shared/tcg-core/cards/definitions/allegiance/architect.ts` | |
| `s1_alleg_dreamer_t1` | Dreamer Acolyte | `art/cards/allegiance/s1_alleg_dreamer_t1.webp` | `art/cards/allegiance/dreamer_acolyte_t1.webp` | `apps/shared/tcg-core/cards/definitions/allegiance/dreamer.ts` | |
| `s1_alleg_dreamer_t2` | Dreamer Visionary | `art/cards/allegiance/s1_alleg_dreamer_t2.webp` | `art/cards/allegiance/dreamer_seer_t2.webp` | `apps/shared/tcg-core/cards/definitions/allegiance/dreamer.ts` | |
| `s1_alleg_dreamer_t3` | Dreamer Veteran | `art/cards/allegiance/s1_alleg_dreamer_t3.webp` | `art/cards/allegiance/dreamer_visionary_t3.webp` | `apps/shared/tcg-core/cards/definitions/allegiance/dreamer.ts` | |
| `s1_alleg_dreamer_t4` | Dreamer Victorious Seer | `art/cards/allegiance/s1_alleg_dreamer_t4.webp` | `art/cards/allegiance/dreamer_prophet_t4.webp` | `apps/shared/tcg-core/cards/definitions/allegiance/dreamer.ts` | |
| `s1_alleg_dreamer_t5` | Dreamer Elite | `art/cards/allegiance/s1_alleg_dreamer_t5.webp` | `art/cards/allegiance/dreamer_dreamwalker_t5.webp` | `apps/shared/tcg-core/cards/definitions/allegiance/dreamer.ts` | |
| `s1_alleg_dreamer_t6` | Dreamer Champion | `art/cards/allegiance/s1_alleg_dreamer_t6.webp` | `art/cards/allegiance/dreamer_champion_t6.webp` | `apps/shared/tcg-core/cards/definitions/allegiance/dreamer.ts` | |
| `s1_alleg_insurgency_t1` | Insurgency Recruit | `art/cards/allegiance/s1_alleg_insurgency_t1.webp` | `art/cards/allegiance/insurgency_recruit_t1.webp` | `apps/shared/tcg-core/cards/definitions/allegiance/insurgency.ts` | |
| `s1_alleg_insurgency_t2` | Insurgency Partisan | `art/cards/allegiance/s1_alleg_insurgency_t2.webp` | `art/cards/allegiance/insurgency_operative_t2.webp` | `apps/shared/tcg-core/cards/definitions/allegiance/insurgency.ts` | |
| `s1_alleg_insurgency_t3` | Insurgency Veteran | `art/cards/allegiance/s1_alleg_insurgency_t3.webp` | `art/cards/allegiance/insurgency_cell_leader_t3.webp` | `apps/shared/tcg-core/cards/definitions/allegiance/insurgency.ts` | |
| `s1_alleg_insurgency_t4` | Insurgency Victorious Veteran | `art/cards/allegiance/s1_alleg_insurgency_t4.webp` | `art/cards/allegiance/insurgency_commander_t4.webp` | `apps/shared/tcg-core/cards/definitions/allegiance/insurgency.ts` | |
| `s1_alleg_insurgency_t5` | Insurgency Elite | `art/cards/allegiance/s1_alleg_insurgency_t5.webp` | `art/cards/allegiance/insurgency_warlord_t5.webp` | `apps/shared/tcg-core/cards/definitions/allegiance/insurgency.ts` | |
| `s1_alleg_insurgency_t6` | Insurgency Champion | `art/cards/allegiance/s1_alleg_insurgency_t6.webp` | `art/cards/allegiance/insurgency_champion_t6.webp` | `apps/shared/tcg-core/cards/definitions/allegiance/insurgency.ts` | |
| `s1_alleg_thought_virus_t1` | Thought Virus Carrier | `art/cards/allegiance/s1_alleg_thought_virus_t1.webp` | `art/cards/allegiance/thought_virus_carrier_t1.webp` | `apps/shared/tcg-core/cards/definitions/allegiance/thought_virus.ts` | |
| `s1_alleg_thought_virus_t2` | Thought Virus Evangelist | `art/cards/allegiance/s1_alleg_thought_virus_t2.webp` | `art/cards/allegiance/thought_virus_evangelist_t2.webp` | `apps/shared/tcg-core/cards/definitions/allegiance/thought_virus.ts` | |
| `s1_alleg_thought_virus_t3` | Thought Virus Strain-Keeper | `art/cards/allegiance/s1_alleg_thought_virus_t3.webp` | `art/cards/allegiance/thought_virus_strain_keeper_t3.webp` | `apps/shared/tcg-core/cards/definitions/allegiance/thought_virus.ts` | |
| `s1_alleg_thought_virus_t4` | Thought Virus Victorious Vector | `art/cards/allegiance/s1_alleg_thought_virus_t4.webp` | `art/cards/allegiance/thought_virus_vector_t4.webp` | `apps/shared/tcg-core/cards/definitions/allegiance/thought_virus.ts` | |
| `s1_alleg_thought_virus_t5` | Thought Virus Prime Vessel | `art/cards/allegiance/s1_alleg_thought_virus_t5.webp` | `art/cards/allegiance/thought_virus_prime_vessel_t5.webp` | `apps/shared/tcg-core/cards/definitions/allegiance/thought_virus.ts` | |
| `s1_alleg_thought_virus_t6` | Thought Virus Champion | `art/cards/allegiance/s1_alleg_thought_virus_t6.webp` | `art/cards/allegiance/thought_virus_champion_t6.webp` | `apps/shared/tcg-core/cards/definitions/allegiance/thought_virus.ts` | |
| `s1_class_assassin_01` | Glass Blade Initiate | `art/cards/class/s1_class_assassin_01.webp` | `art/cards/class/glass_blade_initiate.webp` | `apps/shared/tcg-core/cards/definitions/class/assassin.ts` | |
| `s1_class_assassin_02` | Silent Step | `art/cards/class/s1_class_assassin_02.webp` | `art/cards/class/silent_step.webp` | `apps/shared/tcg-core/cards/definitions/class/assassin.ts` | |
| `s1_class_assassin_03` | Witness Remover | `art/cards/class/s1_class_assassin_03.webp` | `art/cards/class/witness_remover.webp` | `apps/shared/tcg-core/cards/definitions/class/assassin.ts` | |
| `s1_class_assassin_04` | Execute Protocol | `art/cards/class/s1_class_assassin_04.webp` | `art/cards/class/execute_protocol.webp` | `apps/shared/tcg-core/cards/definitions/class/assassin.ts` | |
| `s1_class_engineer_01` | Workshop Drone | `art/cards/class/s1_class_engineer_01.webp` | `art/cards/class/workshop_drone.webp` | `apps/shared/tcg-core/cards/definitions/class/engineer.ts` | |
| `s1_class_engineer_02` | Field Modification | `art/cards/class/s1_class_engineer_02.webp` | `art/cards/class/field_modification.webp` | `apps/shared/tcg-core/cards/definitions/class/engineer.ts` | |
| `s1_class_engineer_03` | Kinetic Containment Sink | `art/cards/class/s1_class_engineer_03.webp` | `art/cards/class/kinetic_containment_sink.webp` | `apps/shared/tcg-core/cards/definitions/class/engineer.ts` | |
| `s1_class_engineer_04` | Prototype Blueprint | `art/cards/class/s1_class_engineer_04.webp` | `art/cards/class/prototype_blueprint.webp` | `apps/shared/tcg-core/cards/definitions/class/engineer.ts` | |
| `s1_class_neyon_01` | Hybrid Initiate | `art/cards/class/s1_class_neyon_01.webp` | `art/cards/class/hybrid_initiate.webp` | `apps/shared/tcg-core/cards/definitions/class/neyon.ts` | |
| `s1_class_neyon_02` | Dual Discipline | `art/cards/class/s1_class_neyon_02.webp` | `art/cards/class/dual_discipline.webp` | `apps/shared/tcg-core/cards/definitions/class/neyon.ts` | |
| `s1_class_neyon_03` | Three-Schools Master | `art/cards/class/s1_class_neyon_03.webp` | `art/cards/class/three_schools_master.webp` | `apps/shared/tcg-core/cards/definitions/class/neyon.ts` | |
| `s1_class_neyon_04` | Syncretic Adept | `art/cards/class/s1_class_neyon_04.webp` | `art/cards/class/syncretic_adept.webp` | `apps/shared/tcg-core/cards/definitions/class/neyon.ts` | |
| `s1_class_oracle_01` | Auspex | `art/cards/class/s1_class_oracle_01.webp` | `art/cards/class/auspex.webp` | `apps/shared/tcg-core/cards/definitions/class/oracle.ts` | |
| `s1_class_oracle_02` | Prescient Glyph | `art/cards/class/s1_class_oracle_02.webp` | `art/cards/class/prescient_glyph.webp` | `apps/shared/tcg-core/cards/definitions/class/oracle.ts` | |
| `s1_class_oracle_03` | Reader of Tomorrows | `art/cards/class/s1_class_oracle_03.webp` | `art/cards/class/reader_of_tomorrows.webp` | `apps/shared/tcg-core/cards/definitions/class/oracle.ts` | |
| `s1_class_oracle_04` | Second Sight | `art/cards/class/s1_class_oracle_04.webp` | `art/cards/class/second_sight.webp` | `apps/shared/tcg-core/cards/definitions/class/oracle.ts` | |
| `s1_class_soldier_01` | Line Recruit | `art/cards/class/s1_class_soldier_01.webp` | `art/cards/class/line_recruit.webp` | `apps/shared/tcg-core/cards/definitions/class/soldier.ts` | |
| `s1_class_soldier_02` | Shieldwall | `art/cards/class/s1_class_soldier_02.webp` | `art/cards/class/shieldwall.webp` | `apps/shared/tcg-core/cards/definitions/class/soldier.ts` | |
| `s1_class_soldier_03` | Rally the Line | `art/cards/class/s1_class_soldier_03.webp` | `art/cards/class/rally_the_line.webp` | `apps/shared/tcg-core/cards/definitions/class/soldier.ts` | |
| `s1_class_soldier_04` | Iron Vanguard | `art/cards/class/s1_class_soldier_04.webp` | `art/cards/class/iron_vanguard.webp` | `apps/shared/tcg-core/cards/definitions/class/soldier.ts` | |
| `s1_class_spy_01` | Signal Ghost | `art/cards/class/s1_class_spy_01.webp` | `art/cards/class/signal_ghost.webp` | `apps/shared/tcg-core/cards/definitions/class/spy.ts` | |
| `s1_class_spy_02` | Dead Drop | `art/cards/class/s1_class_spy_02.webp` | `art/cards/class/dead_drop.webp` | `apps/shared/tcg-core/cards/definitions/class/spy.ts` | |
| `s1_class_spy_03` | Cover Name | `art/cards/class/s1_class_spy_03.webp` | `art/cards/class/cover_name.webp` | `apps/shared/tcg-core/cards/definitions/class/spy.ts` | |
| `s1_class_spy_04` | Burn the Handler | `art/cards/class/s1_class_spy_04.webp` | `art/cards/class/burn_the_handler.webp` | `apps/shared/tcg-core/cards/definitions/class/spy.ts` | |
| `s1_dim_prob_01` | Outcome Gambler | `art/cards/dimension/s1_dim_prob_01.webp` | `art/cards/dimension/outcome_gambler.webp` | `apps/shared/tcg-core/cards/definitions/dimensional/probability.ts` | |
| `s1_dim_prob_02` | Bayes Adept | `art/cards/dimension/s1_dim_prob_02.webp` | `art/cards/dimension/bayes_adept.webp` | `apps/shared/tcg-core/cards/definitions/dimensional/probability.ts` | |
| `s1_dim_reality_01` | Ground Truth Witness | `art/cards/dimension/s1_dim_reality_01.webp` | `art/cards/dimension/ground_truth_witness.webp` | `apps/shared/tcg-core/cards/definitions/dimensional/reality.ts` | |
| `s1_dim_reality_02` | Consensus Weaver | `art/cards/dimension/s1_dim_reality_02.webp` | `art/cards/dimension/consensus_weaver.webp` | `apps/shared/tcg-core/cards/definitions/dimensional/reality.ts` | |
| `s1_dim_space_01` | Parallax Walker | `art/cards/dimension/s1_dim_space_01.webp` | `art/cards/dimension/parallax_walker.webp` | `apps/shared/tcg-core/cards/definitions/dimensional/space.ts` | |
| `s1_dim_space_02` | Folded Distance | `art/cards/dimension/s1_dim_space_02.webp` | `art/cards/dimension/folded_distance.webp` | `apps/shared/tcg-core/cards/definitions/dimensional/space.ts` | |
| `s1_dim_time_01` | Moment Keeper | `art/cards/dimension/s1_dim_time_01.webp` | `art/cards/dimension/moment_keeper.webp` | `apps/shared/tcg-core/cards/definitions/dimensional/time.ts` | |
| `s1_dim_time_02` | Loop Walker | `art/cards/dimension/s1_dim_time_02.webp` | `art/cards/dimension/loop_walker.webp` | `apps/shared/tcg-core/cards/definitions/dimensional/time.ts` | |
| `s1_dim_time_03` | Hour-Unmaker | `art/cards/dimension/s1_dim_time_03.webp` | `art/cards/dimension/hour_unmaker.webp` | `apps/shared/tcg-core/cards/definitions/dimensional/time.ts` | |
| `s1_elem_air_01` | Breeze Whisper | `art/cards/element/s1_elem_air_01.webp` | `art/cards/element/breeze_whisper.webp` | `apps/shared/tcg-core/cards/definitions/elemental/air.ts` | |
| `s1_elem_air_02` | Skyrider | `art/cards/element/s1_elem_air_02.webp` | `art/cards/element/skyrider.webp` | `apps/shared/tcg-core/cards/definitions/elemental/air.ts` | |
| `s1_elem_air_03` | Gale Chorus | `art/cards/element/s1_elem_air_03.webp` | `art/cards/element/gale_chorus.webp` | `apps/shared/tcg-core/cards/definitions/elemental/air.ts` | |
| `s1_elem_air_04` | Cyclone Herald | `art/cards/element/s1_elem_air_04.webp` | `art/cards/element/cyclone_herald.webp` | `apps/shared/tcg-core/cards/definitions/elemental/air.ts` | |
| `s1_elem_earth_01` | Rooted Sentinel | `art/cards/element/s1_elem_earth_01.webp` | `art/cards/element/rooted_sentinel.webp` | `apps/shared/tcg-core/cards/definitions/elemental/earth.ts` | |
| `s1_elem_earth_02` | Slate Golem | `art/cards/element/s1_elem_earth_02.webp` | `art/cards/element/slate_golem.webp` | `apps/shared/tcg-core/cards/definitions/elemental/earth.ts` | |
| `s1_elem_earth_03` | Mountain Vow | `art/cards/element/s1_elem_earth_03.webp` | `art/cards/element/mountain_vow.webp` | `apps/shared/tcg-core/cards/definitions/elemental/earth.ts` | |
| `s1_elem_earth_04` | Tectonic Warden | `art/cards/element/s1_elem_earth_04.webp` | `art/cards/element/tectonic_warden.webp` | `apps/shared/tcg-core/cards/definitions/elemental/earth.ts` | |
| `s1_elem_fire_01` | Ember Scout | `art/cards/element/s1_elem_fire_01.webp` | `art/cards/element/ember_scout.webp` | `apps/shared/tcg-core/cards/definitions/elemental/fire.ts` | |
| `s1_elem_fire_02` | Spark Fragment | `art/cards/element/s1_elem_fire_02.webp` | `art/cards/element/spark_fragment.webp` | `apps/shared/tcg-core/cards/definitions/elemental/fire.ts` | |
| `s1_elem_fire_03` | Blaze Lancer | `art/cards/element/s1_elem_fire_03.webp` | `art/cards/element/blaze_lancer.webp` | `apps/shared/tcg-core/cards/definitions/elemental/fire.ts` | |
| `s1_elem_fire_04` | Conflagration | `art/cards/element/s1_elem_fire_04.webp` | `art/cards/element/conflagration.webp` | `apps/shared/tcg-core/cards/definitions/elemental/fire.ts` | |
| `s1_elem_fire_05` | The First Flame | `art/cards/element/s1_elem_fire_05.webp` | `art/cards/element/the_first_flame.webp` | `apps/shared/tcg-core/cards/definitions/elemental/fire.ts` | |
| `s1_elem_water_01` | Tide Keeper | `art/cards/element/s1_elem_water_01.webp` | `art/cards/element/tide_keeper.webp` | `apps/shared/tcg-core/cards/definitions/elemental/water.ts` | |
| `s1_elem_water_02` | Dissolving Wave | `art/cards/element/s1_elem_water_02.webp` | `art/cards/element/dissolving_wave.webp` | `apps/shared/tcg-core/cards/definitions/elemental/water.ts` | |
| `s1_elem_water_03` | Mercy Current | `art/cards/element/s1_elem_water_03.webp` | `art/cards/element/mercy_current.webp` | `apps/shared/tcg-core/cards/definitions/elemental/water.ts` | |
| `s1_elem_water_04` | Abyssal Form | `art/cards/element/s1_elem_water_04.webp` | `art/cards/element/abyssal_form.webp` | `apps/shared/tcg-core/cards/definitions/elemental/water.ts` | |
| `s1_race_quarchon_01` | Quarchon Latticework | `art/cards/race/s1_race_quarchon_01.webp` | `art/cards/race/quarchon_latticework.webp` | `apps/shared/tcg-core/cards/definitions/race/quarchon.ts` | |
| `s1_race_quarchon_02` | Quarchon Archivist | `art/cards/race/s1_race_quarchon_02.webp` | `art/cards/race/quarchon_archivist.webp` | `apps/shared/tcg-core/cards/definitions/race/quarchon.ts` | |
| `s1_race_synthetic_01` | Synthetic Worker | `art/cards/race/s1_race_synthetic_01.webp` | `art/cards/race/synthetic_worker.webp` | `apps/shared/tcg-core/cards/definitions/race/synthetic.ts` | |
| `s1_race_synthetic_02` | Synthetic Watchtower | `art/cards/race/s1_race_synthetic_02.webp` | `art/cards/race/synthetic_watchtower.webp` | `apps/shared/tcg-core/cards/definitions/race/synthetic.ts` | |
| `s1_char_018` | The Antiquarian | `art/cards/s1_char_018_the_antiquarian.webp` | `art/cards/antiquarian/the_antiquarian.webp` | `apps/shared/tcg-core/cards/definitions/antiquarian/s1_char_018_the_antiquarian.ts` | resolved by cross-folder scan |
| `s1_curve_001_era_mote` | Era Mote | `art/cards/s1_curve_001.webp` | `art/cards/antiquarian/era_mote.webp` | `apps/shared/tcg-core/cards/definitions/antiquarian/s1_curve_001_era_mote.ts` | resolved by cross-folder scan |
| `s1_curve_006_hourglass_sentinel` | Hourglass Sentinel | `art/cards/s1_curve_006.webp` | `art/cards/antiquarian/hourglass_sentinel.webp` | `apps/shared/tcg-core/cards/definitions/antiquarian/s1_curve_006_hourglass_sentinel.ts` | resolved by cross-folder scan |
| `s1_struct_005_relic_archive` | Relic Archive | `art/cards/s1_struct_005.webp` | `art/cards/antiquarian/relic_archive.webp` | `apps/shared/tcg-core/cards/definitions/antiquarian/s1_struct_005_relic_archive.ts` | resolved by cross-folder scan |
| `s1_zeal_004_relic_acolyte` | Relic Acolyte | `art/cards/s1_zeal_004.webp` | `art/cards/antiquarian/relic_acolyte.webp` | `apps/shared/tcg-core/cards/definitions/antiquarian/s1_zeal_004_relic_acolyte.ts` | resolved by cross-folder scan |
| `gen_authority` | The Authority | `art/cards/gen_authority.webp` | `art/cards/architect/the_authority.webp` | `apps/shared/tcg-core/cards/definitions/architect/gen_authority.ts` | resolved by cross-folder scan |
| `s1_blast_002_arc_lance` | Arc Lance | `art/cards/s1_blast_002.webp` | `art/cards/architect/arc_lance.webp` | `apps/shared/tcg-core/cards/definitions/architect/s1_blast_002_arc_lance.ts` | resolved by cross-folder scan |
| `s1_curve_002_schematic_spark` | Schematic Spark | `art/cards/s1_curve_002.webp` | `art/cards/architect/schematic_spark.webp` | `apps/shared/tcg-core/cards/definitions/architect/s1_curve_002_schematic_spark.ts` | resolved by cross-folder scan |
| `s1_curve_007_schematic_bastion` | Schematic Bastion | `art/cards/s1_curve_007.webp` | `art/cards/architect/schematic_bastion.webp` | `apps/shared/tcg-core/cards/definitions/architect/s1_curve_007_schematic_bastion.ts` | resolved by cross-folder scan |
| `s1_struct_002_observation_pylon` | Observation Pylon | `art/cards/s1_struct_002.webp` | `art/cards/architect/observation_pylon.webp` | `apps/shared/tcg-core/cards/definitions/architect/s1_struct_002_observation_pylon.ts` | resolved by cross-folder scan |
| `s1_warlord_three_moves` | Three Moves | `art/cards/s1_warlord_three_moves.webp` | `art/cards/architect/three_moves.webp` | `apps/shared/tcg-core/cards/definitions/architect/s1_warlord_three_moves.ts` | resolved by cross-folder scan |
| `s1_zeal_002_engine_warden` | Engine Warden | `art/cards/s1_zeal_002.webp` | `art/cards/architect/engine_warden.webp` | `apps/shared/tcg-core/cards/definitions/architect/s1_zeal_002_engine_warden.ts` | resolved by cross-folder scan |
| `s1_curve_003_glimmer_wisp` | Glimmer Wisp | `art/cards/s1_curve_003.webp` | `art/cards/dreamer/glimmer_wisp.webp` | `apps/shared/tcg-core/cards/definitions/dreamer/s1_curve_003_glimmer_wisp.ts` | resolved by cross-folder scan |
| `s1_curve_008_vision_anchor` | Vision Anchor | `art/cards/s1_curve_008.webp` | `art/cards/dreamer/vision_anchor.webp` | `apps/shared/tcg-core/cards/definitions/dreamer/s1_curve_008_vision_anchor.ts` | resolved by cross-folder scan |
| `s1_struct_003_dream_anchor` | Dream Anchor | `art/cards/s1_struct_003.webp` | `art/cards/dreamer/dream_anchor.webp` | `apps/shared/tcg-core/cards/definitions/dreamer/s1_struct_003_dream_anchor.ts` | resolved by cross-folder scan |
| `s1_blast_003_strafe_runner` | Strafe Runner | `art/cards/s1_blast_003.webp` | `art/cards/insurgency/strafe_runner.webp` | `apps/shared/tcg-core/cards/definitions/insurgency/s1_blast_003_strafe_runner.ts` | resolved by cross-folder scan |
| `s1_curve_004_cell_decoy` | Cell Decoy | `art/cards/s1_curve_004.webp` | `art/cards/insurgency/cell_decoy.webp` | `apps/shared/tcg-core/cards/definitions/insurgency/s1_curve_004_cell_decoy.ts` | resolved by cross-folder scan |
| `s1_curve_009_trench_sergeant` | Trench Sergeant | `art/cards/s1_curve_009.webp` | `art/cards/insurgency/trench_sergeant.webp` | `apps/shared/tcg-core/cards/definitions/insurgency/s1_curve_009_trench_sergeant.ts` | resolved by cross-folder scan |
| `s1_resurrect_003_ghost_cell_runner` | Ghost Cell Runner | `art/cards/s1_resurrect_003.webp` | `art/cards/insurgency/ghost_cell_runner.webp` | `apps/shared/tcg-core/cards/definitions/insurgency/s1_resurrect_003_ghost_cell_runner.ts` | resolved by cross-folder scan |
| `s1_zeal_003_oath_keeper` | Oath Keeper | `art/cards/s1_zeal_003.webp` | `art/cards/insurgency/oath_keeper.webp` | `apps/shared/tcg-core/cards/definitions/insurgency/s1_zeal_003_oath_keeper.ts` | resolved by cross-folder scan |
| `burnt_card_placeholder` | The Burnt Card | `art/cards/burnt_card_placeholder.webp` | `art/cards/neutral/the_burnt_card.webp` | `apps/shared/tcg-core/cards/definitions/neutral/burnt_card_placeholder.ts` | resolved by cross-folder scan |
| `gen_programmer` | The Programmer | `art/cards/gen_programmer.webp` | `art/cards/neutral/the_programmer.webp` | `apps/shared/tcg-core/cards/definitions/neutral/gen_programmer.ts` | resolved by cross-folder scan |
| `gen_seer` | The Seer (visiting fellow) | `art/cards/gen_seer.webp` | `art/cards/neutral/the_seer_visiting_fellow.webp` | `apps/shared/tcg-core/cards/definitions/neutral/gen_seer.ts` | resolved by cross-folder scan |
| `card_locke_sworn_pen_title` | The Sworn Pen | `art/cards/card_locke_sworn_pen_title.webp` | `art/cards/neutral/the_sworn_pen.webp` | `apps/shared/tcg-core/cards/definitions/neutral/house_oath_titles.ts` | resolved by cross-folder scan |
| `card_thaloria_witness_title` | Witness of the Quiet Year | `art/cards/card_thaloria_witness_title.webp` | `art/cards/neutral/witness_of_the_quiet_year.webp` | `apps/shared/tcg-core/cards/definitions/neutral/house_oath_titles.ts` | resolved by cross-folder scan |
| `s1_resurrect_005_eternal_pilgrim` | Eternal Pilgrim | `art/cards/s1_resurrect_005.webp` | `art/cards/neutral/eternal_pilgrim.webp` | `apps/shared/tcg-core/cards/definitions/neutral/s1_resurrect_005_eternal_pilgrim.ts` | resolved by cross-folder scan |
| `s1_blast_005_audit_artillery` | Audit Artillery | `art/cards/s1_blast_005.webp` | `art/cards/new_babylon/audit_artillery.webp` | `apps/shared/tcg-core/cards/definitions/new_babylon/s1_blast_005_audit_artillery.ts` | resolved by cross-folder scan |
| `s1_curve_005_compliance_watcher` | Compliance Watcher | `art/cards/s1_curve_005.webp` | `art/cards/new_babylon/compliance_watcher.webp` | `apps/shared/tcg-core/cards/definitions/new_babylon/s1_curve_005_compliance_watcher.ts` | resolved by cross-folder scan |
| `s1_curve_010_sector_magistrate` | Sector Magistrate | `art/cards/s1_curve_010.webp` | `art/cards/new_babylon/sector_magistrate.webp` | `apps/shared/tcg-core/cards/definitions/new_babylon/s1_curve_010_sector_magistrate.ts` | resolved by cross-folder scan |
| `s1_struct_004_audit_tower` | Audit Tower | `art/cards/s1_struct_004.webp` | `art/cards/new_babylon/audit_tower.webp` | `apps/shared/tcg-core/cards/definitions/new_babylon/s1_struct_004_audit_tower.ts` | resolved by cross-folder scan |
| `s1_zeal_005_compliance_zealot` | Compliance Zealot | `art/cards/s1_zeal_005.webp` | `art/cards/new_babylon/compliance_zealot.webp` | `apps/shared/tcg-core/cards/definitions/new_babylon/s1_zeal_005_compliance_zealot.ts` | resolved by cross-folder scan |
| `s1_resurrect_004_undying_witness` | Undying Witness | `art/cards/s1_resurrect_004.webp` | `art/cards/panopticon/undying_witness.webp` | `apps/shared/tcg-core/cards/definitions/panopticon/s1_resurrect_004_undying_witness.ts` | resolved by cross-folder scan |
| `s2_watcher_001` | The L. Signature | `art/cards/s2_watcher_001.webp` | `art/cards/panopticon/l_signature.webp` | `apps/shared/tcg-core/cards/definitions/panopticon/s2_watcher_001_l_signature.ts` | resolved by cross-folder scan |
| `s2_watcher_002` | The Coordinator | `art/cards/s2_watcher_002.webp` | `art/cards/panopticon/the_coordinators_dossier.webp` | `apps/shared/tcg-core/cards/definitions/panopticon/s2_watcher_002_the_coordinators_dossier.ts` | resolved by cross-folder scan |
| `s2_watcher_003` | Now You Are Ours | `art/cards/s2_watcher_003.webp` | `art/cards/panopticon/now_you_are_ours.webp` | `apps/shared/tcg-core/cards/definitions/panopticon/s2_watcher_003_now_you_are_ours.ts` | resolved by cross-folder scan |
| `s1_blast_004_pyre_swarm` | Pyre Swarm | `art/cards/s1_blast_004.webp` | `art/cards/thought_virus/pyre_swarm.webp` | `apps/shared/tcg-core/cards/definitions/thought_virus/s1_blast_004_pyre_swarm.ts` | resolved by cross-folder scan |
| `s1_resurrect_002_persistent_strain` | Persistent Strain | `art/cards/s1_resurrect_002.webp` | `art/cards/thought_virus/persistent_strain.webp` | `apps/shared/tcg-core/cards/definitions/thought_virus/s1_resurrect_002_persistent_strain.ts` | resolved by cross-folder scan |

## Auto-mapped (low confidence — please verify)

| Card id | Card name | Old (BROKEN) | Proposed candidate | Source | Note |
|---|---|---|---|---|---|
| `s1_alleg_new_babylon_t3` | Babylonian Tax Collector | `art/cards/allegiance/s1_alleg_new_babylon_t3.webp` | `art/cards/allegiance/babylon_tax_collector_t3.webp` | `apps/shared/tcg-core/cards/definitions/allegiance/new_babylon.ts` | keyword overlap (2 tokens) — VERIFY |
| `s1_alleg_new_babylon_t6` | New Babylon Champion | `art/cards/allegiance/s1_alleg_new_babylon_t6.webp` | `art/cards/allegiance/babylon_champion_t6.webp` | `apps/shared/tcg-core/cards/definitions/allegiance/new_babylon.ts` | keyword overlap (2 tokens) — VERIFY |
| `s1_class_assassin_05` | Akai Shi | `art/cards/class/s1_class_assassin_05.webp` | `art/cards/class/akai_shi_first_apprentice.webp` | `apps/shared/tcg-core/cards/definitions/class/assassin.ts` | keyword overlap (2 tokens) — VERIFY |
| `s1_class_neyon_05` | The Five-Schools Avatar | `art/cards/class/s1_class_neyon_05.webp` | `art/cards/class/five_schools_avatar.webp` | `apps/shared/tcg-core/cards/definitions/class/neyon.ts` | keyword overlap (3 tokens) — VERIFY |
| `s1_class_soldier_05` | The Last Regiment Standing | `art/cards/class/s1_class_soldier_05.webp` | `art/cards/class/last_regiment_standing.webp` | `apps/shared/tcg-core/cards/definitions/class/soldier.ts` | keyword overlap (3 tokens) — VERIFY |
| `s1_class_spy_05` | The Twelfth Archon | `art/cards/class/s1_class_spy_05.webp` | `art/cards/class/twelfth_archon_apprentice.webp` | `apps/shared/tcg-core/cards/definitions/class/spy.ts` | keyword overlap (2 tokens) — VERIFY |
| `s1_dim_prob_03` | The Sum Over Histories | `art/cards/dimension/s1_dim_prob_03.webp` | `art/cards/dimension/sum_over_histories.webp` | `apps/shared/tcg-core/cards/definitions/dimensional/probability.ts` | keyword overlap (3 tokens) — VERIFY |
| `s1_dim_reality_03` | The Thing That Is Actually Happening | `art/cards/dimension/s1_dim_reality_03.webp` | `art/cards/dimension/thing_actually_happening.webp` | `apps/shared/tcg-core/cards/definitions/dimensional/reality.ts` | keyword overlap (3 tokens) — VERIFY |
| `s1_dim_space_03` | The Cartographer of Elsewhere | `art/cards/dimension/s1_dim_space_03.webp` | `art/cards/dimension/cartographer_of_elsewhere.webp` | `apps/shared/tcg-core/cards/definitions/dimensional/space.ts` | keyword overlap (2 tokens) — VERIFY |
| `s1_elem_air_05` | The Breath Before Language | `art/cards/element/s1_elem_air_05.webp` | `art/cards/element/breath_before_language.webp` | `apps/shared/tcg-core/cards/definitions/elemental/air.ts` | keyword overlap (3 tokens) — VERIFY |
| `s1_elem_earth_05` | The Sleeping Continent | `art/cards/element/s1_elem_earth_05.webp` | `art/cards/element/sleeping_continent.webp` | `apps/shared/tcg-core/cards/definitions/elemental/earth.ts` | keyword overlap (2 tokens) — VERIFY |
| `s1_elem_water_05` | The Ocean That Forgives | `art/cards/element/s1_elem_water_05.webp` | `art/cards/element/ocean_that_forgives.webp` | `apps/shared/tcg-core/cards/definitions/elemental/water.ts` | keyword overlap (3 tokens) — VERIFY |
| `gen_game_master_original` | The Game Master (before the execution) | `art/cards/gen_game_master_original.webp` | `art/cards/s1_pack_cosm_ship_theme.webp` | `apps/shared/tcg-core/cards/definitions/neutral/gen_game_master_original.ts` | keyword overlap (2 tokens) — VERIFY |
| `s1_race_human_02` | Senate Legionary | `art/cards/race/s1_race_human_02.webp` | `art/cards/race/human_senate_legionary.webp` | `apps/shared/tcg-core/cards/definitions/race/human.ts` | keyword overlap (2 tokens) — VERIFY |
| `s1_race_human_03` | The Final Potential | `art/cards/race/s1_race_human_03.webp` | `art/cards/race/human_final_potential.webp` | `apps/shared/tcg-core/cards/definitions/race/human.ts` | keyword overlap (2 tokens) — VERIFY |
| `s1_race_neyon_01` | Ne-Yon Adept | `art/cards/race/s1_race_neyon_01.webp` | `art/cards/race/neyon_adept.webp` | `apps/shared/tcg-core/cards/definitions/race/neyon.ts` | keyword overlap (2 tokens) — VERIFY |
| `s1_race_neyon_02` | Ne-Yon Bondwalker | `art/cards/race/s1_race_neyon_02.webp` | `art/cards/race/neyon_bondwalker.webp` | `apps/shared/tcg-core/cards/definitions/race/neyon.ts` | keyword overlap (2 tokens) — VERIFY |
| `s1_race_neyon_03` | Kael, First of the Ne-Yon | `art/cards/race/s1_race_neyon_03.webp` | `art/cards/race/neyon_kael_first.webp` | `apps/shared/tcg-core/cards/definitions/race/neyon.ts` | keyword overlap (3 tokens) — VERIFY |
| `s1_race_quarchon_03` | The Crystal Senator | `art/cards/race/s1_race_quarchon_03.webp` | `art/cards/race/quarchon_crystal_senator.webp` | `apps/shared/tcg-core/cards/definitions/race/quarchon.ts` | keyword overlap (2 tokens) — VERIFY |
| `s2_hierarchy_lord_pale_emissary` | The Pale Emissary, Courier of Vortex Standing | `art/cards/hierarchy/lord_pale_emissary.webp` | `art/cards/hierarchy/the_pale_emissary.webp` | `apps/shared/tcg-core/cards/definitions/s2_hierarchy/pale_emissary.ts` | keyword overlap (3 tokens) — VERIFY |
| `s2_hierarchy_lord_reckoning_daughter` | The Reckoning Daughter, Hierarchy Auditor | `art/cards/hierarchy/lord_reckoning_daughter.webp` | `art/cards/hierarchy/the_reckoning_daughter.png` | `apps/shared/tcg-core/cards/definitions/s2_hierarchy/reckoning_daughter.ts` | keyword overlap (3 tokens) — VERIFY |

## Producer verify — multiple candidates

> **All 11 rows resolved 2026-05-22.** Producer confirmed the rename
> intent for each card; the `art:` literals are now updated in the
> card defs directly (see commit history). Rows preserved for the
> audit trail.

| Card id | Card name | Broken | Applied rename | Note | Source |
|---|---|---|---|---|---|
| `s1_alleg_new_babylon_t1` | Babylonian Clerk | `art/cards/allegiance/s1_alleg_new_babylon_t1.webp` | `art/cards/allegiance/babylon_clerk_t1.webp` | name match | `apps/shared/tcg-core/cards/definitions/allegiance/new_babylon.ts` |
| `s1_alleg_new_babylon_t2` | Babylonian Magistrate | `art/cards/allegiance/s1_alleg_new_babylon_t2.webp` | `art/cards/allegiance/babylon_magistrate_t2.webp` | name match | `apps/shared/tcg-core/cards/definitions/allegiance/new_babylon.ts` |
| `s1_alleg_new_babylon_t4` | Babylonian Victorious Adjudicator | `art/cards/allegiance/s1_alleg_new_babylon_t4.webp` | `art/cards/allegiance/babylon_senator_t4.webp` | producer renamed Adjudicator → Senator | `apps/shared/tcg-core/cards/definitions/allegiance/new_babylon.ts` |
| `s1_alleg_new_babylon_t5` | Babylonian Archon-Elect | `art/cards/allegiance/s1_alleg_new_babylon_t5.webp` | `art/cards/allegiance/babylon_governor_t5.webp` | producer renamed Archon-Elect → Governor | `apps/shared/tcg-core/cards/definitions/allegiance/new_babylon.ts` |
| `s1_class_engineer_05` | The Engineer's Apprentice | `art/cards/class/s1_class_engineer_05.webp` | `art/cards/class/engineers_apprentice.webp` | full def name matches file | `apps/shared/tcg-core/cards/definitions/class/engineer.ts` |
| `s1_class_oracle_05` | The Oracle's Unbroken Signal | `art/cards/class/s1_class_oracle_05.webp` | `art/cards/class/oracles_unbroken_signal.webp` | full def name matches file | `apps/shared/tcg-core/cards/definitions/class/oracle.ts` |
| `s1_race_demagi_01` | Demagi Footsoldier | `art/cards/race/s1_race_demagi_01.webp` | `art/cards/race/demagi_foot_soldier.webp` | slug split: footsoldier → foot_soldier | `apps/shared/tcg-core/cards/definitions/race/demagi.ts` |
| `s1_race_demagi_02` | Demagi Corpse-Reader | `art/cards/race/s1_race_demagi_02.webp` | `art/cards/race/demagi_war_priest.webp` | by-elimination + producer renamed Corpse-Reader → War-Priest | `apps/shared/tcg-core/cards/definitions/race/demagi.ts` |
| `s1_race_demagi_03` | Xeth'Raal, Demagi Archlord | `art/cards/race/s1_race_demagi_03.webp` | `art/cards/race/demagi_xethraal_archlord.webp` | Xeth = Xeth'Raal | `apps/shared/tcg-core/cards/definitions/race/demagi.ts` |
| `s1_race_human_01` | Ark Survivor | `art/cards/race/s1_race_human_01.webp` | `art/cards/race/human_citizen_of_atarion.webp` | by-elimination — producer renamed | `apps/shared/tcg-core/cards/definitions/race/human.ts` |
| `s1_race_synthetic_03` | Chrome Archon | `art/cards/race/s1_race_synthetic_03.webp` | `art/cards/race/synthetic_loyal_instrument.webp` | by-elimination — producer renamed | `apps/shared/tcg-core/cards/definitions/race/synthetic.ts` |

## Unmapped — commission required

| Card id | Card name | Broken `art:` | Source |
|---|---|---|---|
| `s2_hierarchy_lord_master_of_rlyeh` | The Master of R | `art/cards/hierarchy/lord_master_of_rlyeh.webp` | `apps/shared/tcg-core/cards/definitions/s2_hierarchy/master_of_rlyeh.ts` |
