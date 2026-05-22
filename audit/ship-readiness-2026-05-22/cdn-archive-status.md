# CDN archive extraction status

_95 archives in `s3://dgrsart/` outside `cdn/client-public/`. For each we listed the zip's central directory via ranged GETs (no full download) and checked whether each member file is also present somewhere under `cdn/client-public/`._

- **present** — exact-path or exact-basename match on CDN.
- **renamed** — basename-without-extension match (e.g. zip has `foo.png`, CDN has `foo.webp` somewhere). Typically benign — the optimize-images step replaces .png with .webp.
- **missing** — no match anywhere under `cdn/client-public/`. **These are the ship blockers.**

**Totals:** 12,172 files across 95 archives — **5,611** present, **3,258** renamed, **3,303** missing.

## By archive

| Archive | size | files | present | renamed | missing | note / first missing |
|---|---:|---:|---:|---:|---:|---|
| ⚠ `card art/dischordian_card_art_complete_406_bundle.zip` | 6470 MB | 957 | 0 | 0 | 957 | dischordian_card_renders/art_s1_char_007.png |
| ⚠ `Book_of_Daniel_asset_set.zip` | 1697 MB | 349 | 0 | 0 | 349 | home/ubuntu/bod_assets/frames/bod_t01_f01.png |
| ⚠ `AAA Final/dischordian_assets_final.zip` | 1469 MB | 255 | 0 | 0 | 255 | protagonists/elara_idle_hologram.png |
| ⚠ `Album Slide Show/BOOK_OF_DANIEL_247_COMPLETE.zip` | 3587 MB | 568 | 11 | 344 | 213 | 03_book_of_daniel/T01/T01_20.png |
| ⚠ `Collectors Arena/seedance2_game_assets.zip` | 144 MB | 130 | 0 | 0 | 130 | seedance2_final/arenas/arena01_panopticon_corridor.jpg |
| ⚠ `AAA Final/dischordian_acts2_7_assets.zip` | 995 MB | 193 | 103 | 0 | 90 | character_canon_map.md |
| ⚠ `4.12 Assets/Silence in Heaven Finished/Since in Heaven.zip` | 1790 MB | 74 | 0 | 0 | 74 | 1. In the Beginning was the Word.wav |
| ⚠ `Music/Silence in Heaven Complete.zip` | 1790 MB | 74 | 0 | 0 | 74 | 1. In the Beginning was the Word.wav |
| ⚠ `AAA Final/prelude_asset_build_no_vo.zip` | 205 MB | 118 | 38 | 10 | 70 | home/ubuntu/prelude_asset_build/manifests/asset_prompt_manifest.json |
| ⚠ `AAA Final/Dischordia Songs.zip` | 156 MB | 62 | 0 | 0 | 62 | Dischordia Songs/CLASSIFIED FREQUENCY (2).mp3 |
| ⚠ `nanobanna2_game_assets.zip` | 107 MB | 75 | 15 | 0 | 60 | nanobanna2_final/enemies_96/terminus_enemy_undead-grub_96.png |
| ⚠ `optional_components_assets.zip` | 376 MB | 59 | 0 | 0 | 59 | section1_empty_states/EMPTY-04_Lore_Journal_Blank_Pages.png |
| ⚠ `Silence_in_Heaven_asset_set.zip` | 608 MB | 94 | 0 | 37 | 57 | sih_assets/backgrounds/sih_bg_agora_original.png |
| ⚠ `dischordian_aaa_game_design_assets.zip` | 344 MB | 54 | 0 | 0 | 54 | generated_assets/art/ui/hud/panel_accent.png |
| ⚠ `Videos/Veo Vid SIH 1.zip` | 190 MB | 52 | 0 | 0 | 52 | clip_01 (1).mp4 |
| ⚠ `casino_art_bible_assets.zip` | 763 MB | 115 | 65 | 0 | 50 | casino_art/section2_game_tables/GT-001_Tournament_Bracket_original.png |
| ⚠ `oracle-deck-aaa-assets.zip` | 327 MB | 46 | 0 | 0 | 46 | art/oracle-deck/card-00-the-prisoner.png |
| ⚠ `AAA Final/last_words_only.zip` | 21 MB | 41 | 1 | 0 | 40 | last_words_package/last_words_1_1.html |
| ⚠ `4.12 Assets/the_dischordian_saga_aaa_game_assets.zip` | 494 MB | 77 | 38 | 0 | 39 | game_assets/art/mechronis/professors/professor_kanevas_original.png |
| ⚠ `AAA Final/viseme_sheets_batch_19.zip` | 74 MB | 38 | 0 | 0 | 38 | viseme_sheets/viseme_meme.png |
| ⚠ `Album Slide Show/Album_2_Age_of_Privacy.zip` | 2224 MB | 337 | 11 | 288 | 38 | 02_age_of_privacy/T01/T01_22.png |
| ⚠ `Videos/Veo Vid Archive 2.zip` | 90 MB | 36 | 0 | 0 | 36 | clip_01.mp4 |
| ⚠ `4.12 Assets/dischordian_generated_art_pack_final_34.zip` | 243 MB | 34 | 0 | 0 | 34 | 01_empty_quest_log.png |
| ⚠ `AAA Final/dischordian_art_assets.zip` | 507 MB | 78 | 45 | 1 | 32 | art/cards/thought_virus/viral_tendril.png |
| ⚠ `Album Slide Show/AOP_Part4_T16-T20.zip` | 622 MB | 95 | 0 | 67 | 28 | T16/T16_11.png |
| ⚠ `AAA Final/Art Archive 5.10.26.zip` | 4086 MB | 26 | 0 | 0 | 26 | 01_fighter_stages.zip |
| ⚠ `AAA Final/mega_batch_101_assets.zip` | 342 MB | 151 | 125 | 0 | 26 | classmates/aria-wen_original.png |
| ⚠ `Videos/Music & Stories.zip` | 634 MB | 26 | 0 | 0 | 26 | Baron & The Heart of Time (S2.13).mp4 |
| ⚠ `Videos/NEW_VIDEOS_200.zip` | 1778 MB | 200 | 174 | 0 | 26 | videos/dlc_mystery/y1q1_first_charter/shot_5.mp4 |
| ⚠ `AAA Final/actx_aaa_ui_assets.zip` | 16 MB | 25 | 0 | 0 | 25 | final/backgrounds/p10_act_four_cell.webp |
| ⚠ `AAA Final/the_dischordian_aaa_assets.zip` | 136 MB | 36 | 12 | 0 | 24 | game_assets/title/title_master_keyframe.png |
| ⚠ `4.12 Assets/cycle_b_opponent_portraits.zip` | 45 MB | 23 | 0 | 0 | 23 | home/ubuntu/cycle_b_assets/art/opponents/young_iron_lion/young_iron_lion-portrai |
| ⚠ `Album Slide Show/WestByGod_Album5_Complete.zip` | 1244 MB | 203 | 10 | 174 | 19 | 05_west_by_god/MASTER_BIBLE_NOTES.md |
| ⚠ `Album Slide Show/Dischordian Logic 1-9.zip` | 544 MB | 18 | 0 | 0 | 18 | 1. The Enigma's Lament (Remastered) (HD).wav |
| ⚠ `lore_gallery_assets.zip` | 13 MB | 17 | 0 | 0 | 17 | lore_gallery_final/era_backgrounds/lore_era_foundation_1920x1080.jpg |
| ⚠ `4.12 Assets/dischordian_saga_aaa_assets.zip` | 76 MB | 13 | 1 | 0 | 12 | dischordian_saga_aaa_assets/arena_default_background.png |
| ⚠ `Album Slide Show/AOP_Part3_T11-T15.zip` | 616 MB | 90 | 1 | 77 | 12 | T13/T13_19.png |
| ⚠ `AAA Final/corrected_assets_batch2.zip` | 14 MB | 10 | 0 | 0 | 10 | corrected_assets_batch2/viseme_engineer.png |
| ⚠ `Album Slide Show/AOP_Part1_T01-T05.zip` | 671 MB | 101 | 5 | 86 | 10 | T01/T01_20.png |
| ⚠ `NanoBanna2_Art_Assets_112.zip` | 527 MB | 112 | 103 | 0 | 9 | nanobanna2_assets/soul_stones/SS-VIOLET.png |
| ⚠ `AAA Final/corrected_assets_batch.zip` | 9 MB | 8 | 0 | 0 | 8 | corrected_assets/warlord_bust_corrected.png |
| ⚠ `Album Slide Show/AOP_Part2_T06-T10.zip` | 612 MB | 90 | 5 | 77 | 8 | T06/T06_19.png |
| ⚠ `Album Slide Show/SilenceInHeaven_Album6_Complete.zip` | 3724 MB | 601 | 0 | 593 | 8 | 06_silence_in_heaven/SIH_TRACK_SPECS.md |
| ⚠ `Music/Saga Theme Music.zip` | 23 MB | 8 | 0 | 0 | 8 | Saga Theme 1.mp3 |
| ⚠ `AAA Final/last_words_tease_afro_remake.zip` | 30 MB | 6 | 0 | 0 | 6 | last_words_tease_afro_remake/last_words_tease_afro_remake_slide_1.png |
| ⚠ `AAA Final/Ark1047_AAA_Assets.zip` | 30 MB | 5 | 0 | 0 | 5 | station-dock.png |
| ⚠ `Videos/dischordian_cutscene_assets.zip` | 277 MB | 48 | 43 | 0 | 5 | cutscenes/fallbacks/cs1_awakening_fallback.png |
| ⚠ `4.12 Assets/scifi_game_art_assets.zip` | 21 MB | 4 | 0 | 0 | 4 | casino_symbols_sprite_sheet.png |
| ⚠ `AAA Final/Agent_Zero_Corrected.zip` | 7 MB | 4 | 0 | 0 | 4 | agent_zero_bust_corrected.png |
| ⚠ `AAA Final/Trade_Empire_Art_Assets.zip` | 402 MB | 140 | 68 | 68 | 4 | trade_empire/wonders/wonder_dreamers_shield.png |
| ⚠ `Videos/Welcome to Celebration & Mechronis.zip` | 735 MB | 4 | 0 | 0 | 4 | Welcome to Celebration Final.mp4 |
| ⚠ `AAA Final/Antiquarian_Viseme_Sheet.zip` | 7 MB | 2 | 0 | 0 | 2 | antiquarian_viseme_sheet.png |
| ⚠ `AAA Final/DischordianSaga_GameAssets_Complete.zip` | 242 MB | 38 | 8 | 28 | 2 | ASSET_PRODUCTION_PLAN.md |
| ⚠ `AAA Final/DischordianSaga_GuildCutscenes_Complete.zip` | 811 MB | 177 | 175 | 0 | 2 | PRODUCTION_PLAN.md |
| ⚠ `AAA Final/Elara_Viseme_Sheet.zip` | 7 MB | 2 | 0 | 0 | 2 | elara_viseme_sheet.png |
| ⚠ `AAA Final/Locke_Viseme_Sheet.zip` | 4 MB | 2 | 0 | 0 | 2 | locke_viseme_sheet.png |
| ⚠ `AAA Final/Source_Viseme_Sheet.zip` | 5 MB | 2 | 0 | 0 | 2 | source_viseme_sheet.png |
| ⚠ `AAA Final/unified_act1_merged_remake.zip` | 513 MB | 90 | 88 | 0 | 2 | home/ubuntu/unified_act1_asset_build/unified_act1_rebuild_manifest.md |
| ⚠ `Videos/OTHER_CUTSCENES.zip` | 365 MB | 47 | 45 | 0 | 2 | prestige/kf1.png |
| ⚠ `AAA Final/deliverables_room_rewrites.zip` | 34 MB | 6 | 5 | 0 | 1 | deliverables_room_prompt_rewrites.md |
| ⚠ `Album Slide Show/Album_1_Age_of_Dischordian_Logic.zip` | 3318 MB | 491 | 11 | 479 | 1 | 01_age_of_dischordian_logic/ALBUM_1_MANIFEST.md |
| ⚠ `aaa_assets_complete.zip` | 1123 MB | 195 | 0 | 194 | 1 | asset_summary.md |
| ✅ `AAA Final/Minnie_Sprite_Sheets.zip` | 2 MB | 3 | 3 | 0 | 0 |  |
| ✅ `AAA Final/NEW_ROOMS_82.zip` | 514 MB | 82 | 82 | 0 | 0 |  |
| ✅ `AAA Final/New_Sectors_3.zip` | 21 MB | 6 | 3 | 3 | 0 |  |
| ✅ `AAA Final/dischordian_batch3_assets.zip` | 32 MB | 8 | 8 | 0 | 0 |  |
| ❓ `AAA Final/dischordian_new_suit_sets_mourners_first_chassis.tar.gz` | 710 MB | 0 | 0 | 0 | 0 | NON-ZIP-archive (skipped) |
| ✅ `AAA Final/dischordian_room_state_art (2).zip` | 51 MB | 8 | 0 | 8 | 0 |  |
| ✅ `AAA Final/dischordian_room_state_art.zip` | 51 MB | 8 | 0 | 8 | 0 |  |
| ✅ `AAA Final/final_22_rooms.zip` | 178 MB | 29 | 29 | 0 | 0 |  |
| ✅ `AAA Final/inception_ark_room_tiers.zip` | 5 MB | 12 | 6 | 6 | 0 |  |
| ✅ `AAA Final/prelude_rooms_missing_9.zip` | 60 MB | 18 | 18 | 0 | 0 |  |
| ✅ `AAA Final/prelude_vfx_overlays_webm.zip` | 2 MB | 15 | 15 | 0 | 0 |  |
| ✅ `AAA Final/rooms_complete_library.zip` | 3379 MB | 561 | 561 | 0 | 0 |  |
| ✅ `AAA Final/viseme_hyper_shadow_tongue.zip` | 3 MB | 3 | 1 | 2 | 0 |  |
| ✅ `CADES_FPS_Assets.zip` | 190 MB | 81 | 81 | 0 | 0 |  |
| ✅ `Dischordian_Saga_Prelude_Act1_Assets.zip` | 754 MB | 206 | 206 | 0 | 0 |  |
| ✅ `NEW_ART_1_characters_cards_sheets.zip` | 1123 MB | 280 | 280 | 0 | 0 |  |
| ✅ `NEW_ART_2_destinations_overlays_sprites_ui.zip` | 2522 MB | 431 | 431 | 0 | 0 |  |
| ✅ `NEW_ART_3_fight_portraits.zip` | 5924 MB | 1127 | 1127 | 0 | 0 |  |
| ✅ `Videos/CHESS_CUTSCENES_25.zip` | 351 MB | 75 | 75 | 0 | 0 |  |
| ✅ `Videos/FIGHT_INTROS_COMPLETE.zip` | 1121 MB | 42 | 42 | 0 | 0 |  |
| ✅ `Videos/GUILD_SIGNATURES.zip` | 459 MB | 24 | 24 | 0 | 0 |  |
| ✅ `Videos/NEW_CUTSCENES_67.zip` | 572 MB | 79 | 79 | 0 | 0 |  |
| ✅ `Videos/ORPHAN_POSTERS_VEO_3.zip` | 23 MB | 3 | 3 | 0 | 0 |  |
| ✅ `Videos/awakening_cinematics.zip` | 135 MB | 51 | 51 | 0 | 0 |  |
| ✅ `cinematics_and_vfx.zip` | 465 MB | 84 | 27 | 57 | 0 |  |
| ✅ `degen_remade_assets.zip` | 75 MB | 11 | 11 | 0 | 0 |  |
| ✅ `dischordian_all_18_suits.zip` | 6431 MB | 1080 | 1080 | 0 | 0 |  |
| ✅ `dischordian_saga_sprite_sheets.zip` | 444 MB | 71 | 71 | 0 | 0 |  |
| ✅ `dmc_game_assets.zip` | 134 MB | 31 | 31 | 0 | 0 |  |
| ✅ `nilmorg_dialogue_portraits.zip` | 8 MB | 5 | 5 | 0 | 0 |  |
| ✅ `page_backgrounds_assets.zip` | 6 MB | 12 | 12 | 0 | 0 |  |
| ✅ `player_cabin_art_assets.zip` | 256 MB | 43 | 43 | 0 | 0 |  |
| ✅ `tcg_card_art_651.zip` | 4390 MB | 651 | 0 | 651 | 0 |  |

## Archives with ≥1 missing entry — drill-down

### `4.12 Assets/Silence in Heaven Finished/Since in Heaven.zip`  (74 missing of 74)

- `1. In the Beginning was the Word.wav`
- `__MACOSX/._1. In the Beginning was the Word.wav`
- `2.New Babylon Goddamn.wav`
- `__MACOSX/._2.New Babylon Goddamn.wav`
- `3. A Spark That Cannot Be Silenced 2.wav`
- `__MACOSX/._3. A Spark That Cannot Be Silenced 2.wav`
- `4. Letters to the Remnant.wav`
- `__MACOSX/._4. Letters to the Remnant.wav`
- `5.A Conspiracy of Hope.wav`
- `__MACOSX/._5.A Conspiracy of Hope.wav`
- `6. Turn Back.wav`
- `__MACOSX/._6. Turn Back.wav`
- `7. The Door That Was Shut.wav`
- `__MACOSX/._7. The Door That Was Shut.wav`
- `8. Worthy.wav`
- `__MACOSX/._8. Worthy.wav`
- `9. Not a Lion but a Lamb.wav`
- `__MACOSX/._9. Not a Lion but a Lamb.wav`
- `10. BeholdΓÇª .wav`
- `__MACOSX/._10. BeholdΓÇª .wav`
- `11. And the World Adjusted.wav`
- `__MACOSX/._11. And the World Adjusted.wav`
- `12. Plead the Fifth.wav`
- `__MACOSX/._12. Plead the Fifth.wav`
- `13.How Long.wav`
- `__MACOSX/._13.How Long.wav`
- `14. The Two Witnesses.wav`
- `__MACOSX/._14. The Two Witnesses.wav`
- `15. And the Empire Celebrated.wav`
- `__MACOSX/._15. And the Empire Celebrated.wav`
- _…and 44 more_

### `4.12 Assets/cycle_b_opponent_portraits.zip`  (23 missing of 23)

- `home/ubuntu/cycle_b_assets/art/opponents/young_iron_lion/young_iron_lion-portrait.png`
- `home/ubuntu/cycle_b_assets/art/opponents/young_iron_lion/young_iron_lion-portrait_original.png`
- `home/ubuntu/cycle_b_assets/art/opponents/young_iron_lion/young_iron_lion-full.png`
- `home/ubuntu/cycle_b_assets/art/opponents/young_iron_lion/young_iron_lion-bust.png`
- `home/ubuntu/cycle_b_assets/art/opponents/young_kael/young_kael-portrait.png`
- `home/ubuntu/cycle_b_assets/art/opponents/young_kael/young_kael-portrait_original.png`
- `home/ubuntu/cycle_b_assets/art/opponents/young_kael/young_kael-full.png`
- `home/ubuntu/cycle_b_assets/art/opponents/young_kael/young_kael-bust.png`
- `home/ubuntu/cycle_b_assets/art/opponents/young_agent_zero/young_agent_zero-portrait.png`
- `home/ubuntu/cycle_b_assets/art/opponents/young_agent_zero/young_agent_zero-portrait_original.png`
- `home/ubuntu/cycle_b_assets/art/opponents/young_agent_zero/young_agent_zero-full.png`
- `home/ubuntu/cycle_b_assets/art/opponents/young_agent_zero/young_agent_zero-bust.png`
- `home/ubuntu/cycle_b_assets/art/opponents/young_eyes/young_eyes-portrait.png`
- `home/ubuntu/cycle_b_assets/art/opponents/young_eyes/young_eyes-portrait_original.png`
- `home/ubuntu/cycle_b_assets/art/opponents/young_eyes/young_eyes-full.png`
- `home/ubuntu/cycle_b_assets/art/opponents/young_eyes/young_eyes-bust.png`
- `home/ubuntu/cycle_b_assets/art/opponents/young_human/young_human-portrait.png`
- `home/ubuntu/cycle_b_assets/art/opponents/young_human/young_human-portrait_original.png`
- `home/ubuntu/cycle_b_assets/art/opponents/young_human/young_human-full.png`
- `home/ubuntu/cycle_b_assets/art/opponents/young_human/young_human-bust.png`
- `home/ubuntu/cycle_b_assets/process_cycle_b_portraits.py`
- `home/ubuntu/cycle_b_assets/file_inventory.txt`
- `home/ubuntu/cycle_b_assets/README_cycle_b_portraits.md`

### `4.12 Assets/dischordian_generated_art_pack_final_34.zip`  (34 missing of 34)

- `01_empty_quest_log.png`
- `02_empty_inventory.png`
- `03_empty_card_collection.png`
- `04_empty_lore_journal.png`
- `05_empty_guild_hall.png`
- `06_empty_pet_collection.png`
- `07_empty_match_history.png`
- `08_empty_notifications.png`
- `09_empty_companions.png`
- `10_empty_achievements.png`
- `11_empty_trade_history.png`
- `12_empty_apprentices.png`
- `13_empty_leaderboard.png`
- `14_broadcast_frame.png`
- `15_shadow_convergence.jpg`
- `16_chrono_harvest.jpg`
- `17_forge_of_nations.jpg`
- `18_panopticon_infiltration.jpg`
- `19_lore_symposium.jpg`
- `20_guild_war_tournament.jpg`
- `21_fall_of_reality.jpg`
- `22_echoes_of_the_architect.jpg`
- `23_the_warlords_return.jpg`
- `24_architect_seal.png`
- `25_warlord_crest.png`
- `26_ch1_awakening.png`
- `27_ch2_first_contact.png`
- `28_ch3_the_infection.png`
- `29_ch4_breaking_point.png`
- `30_ch5_war.png`
- _…and 4 more_

### `4.12 Assets/dischordian_saga_aaa_assets.zip`  (12 missing of 13)

- `dischordian_saga_aaa_assets/arena_default_background.png`
- `dischordian_saga_aaa_assets/chess_board.png`
- `dischordian_saga_aaa_assets/chess_pieces_sprite.png`
- `dischordian_saga_aaa_assets/darren_fessler_badge.png`
- `dischordian_saga_aaa_assets/grid_tile.png`
- `dischordian_saga_aaa_assets/health_bar.png`
- `dischordian_saga_aaa_assets/manifest.json`
- `dischordian_saga_aaa_assets/room_archives.png`
- `dischordian_saga_aaa_assets/room_bridge.png`
- `dischordian_saga_aaa_assets/room_observation_deck.png`
- `dischordian_saga_aaa_assets/style_anchor.png`
- `dischordian_saga_aaa_assets/trade_frame.png`

### `4.12 Assets/scifi_game_art_assets.zip`  (4 missing of 4)

- `casino_symbols_sprite_sheet.png`
- `thoughtborn_leader_boss_splash_final.png`
- `thoughtborn_leader_boss_splash.jpg`
- `scifi_art_asset_readme.md`

### `4.12 Assets/the_dischordian_saga_aaa_game_assets.zip`  (39 missing of 77)

- `game_assets/art/mechronis/professors/professor_kanevas_original.png`
- `game_assets/art/mechronis/professors/professor_aoki_original.png`
- `game_assets/art/mechronis/professors/professor_halverez_original.png`
- `game_assets/art/mechronis/professors/professor_orphic_original.png`
- `game_assets/art/mechronis/professors/professor_mireille_original.png`
- `game_assets/art/mechronis/professors/professor_kasra_original.png`
- `game_assets/art/mechronis/professors/professor_vellis_original.png`
- `game_assets/art/mechronis/professors/professor_greenshaw_original.png`
- `game_assets/art/mechronis/professors/professor_vex_original.png`
- `game_assets/art/mechronis/professors/professor_vasara_original.png`
- `game_assets/art/mechronis/professors/professor_vent_original.png`
- `game_assets/art/mechronis/professors/professor_proctor_original.png`
- `game_assets/art/mechronis/professors/professor_glinn_vyre_original.png`
- `game_assets/art/mechronis/environments/mechronis_grand_hall_original.jpg`
- `game_assets/art/mechronis/environments/mechronis_classroom_original.jpg`
- `game_assets/art/mechronis/environments/mechronis_graduation_original.jpg`
- `game_assets/art/celebration/mascoteers/mascoteer_conni_original.png`
- `game_assets/art/celebration/mascoteers/mascoteer_unblink_original.png`
- `game_assets/art/celebration/mascoteers/mascoteer_corey_original.png`
- `game_assets/art/celebration/mascoteers/mascoteer_vernon_original.png`
- `game_assets/art/celebration/mascoteers/mascoteer_minnie_original.png`
- `game_assets/art/celebration/mascoteers/mascoteer_wanda_original.png`
- `game_assets/art/celebration/mascoteers/mascoteer_sprout_original.png`
- `game_assets/art/celebration/mascoteers/mascoteer_wayne_original.png`
- `game_assets/art/celebration/mascoteers/mascoteer_gary_original.png`
- `game_assets/art/celebration/mascoteers/mascoteer_thazu_original.png`
- `game_assets/art/celebration/mascoteers/mascoteer_prince_original.png`
- `game_assets/art/celebration/mascoteers/mascoteer_red_original.png`
- `game_assets/art/celebration/slideshow/celebration_slide_01_original.jpg`
- `game_assets/art/celebration/slideshow/celebration_slide_02_original.jpg`
- _…and 9 more_

### `AAA Final/Agent_Zero_Corrected.zip`  (4 missing of 4)

- `agent_zero_bust_corrected.png`
- `agent_zero_bust_corrected.webp`
- `agent_zero_viseme_sheet.png`
- `agent_zero_viseme_sheet.webp`

### `AAA Final/Antiquarian_Viseme_Sheet.zip`  (2 missing of 2)

- `antiquarian_viseme_sheet.png`
- `antiquarian_viseme_sheet.webp`

### `AAA Final/Ark1047_AAA_Assets.zip`  (5 missing of 5)

- `station-dock.png`
- `guild-sanctum.png`
- `social-hub.png`
- `war-room.png`
- `dreams-workshop-subbasement.png`

### `AAA Final/Art Archive 5.10.26.zip`  (26 missing of 26)

- `01_fighter_stages.zip`
- `__MACOSX/._01_fighter_stages.zip`
- `02_fighter_hud.zip`
- `__MACOSX/._02_fighter_hud.zip`
- `03_fighter_vfx.zip`
- `__MACOSX/._03_fighter_vfx.zip`
- `04_sprites_A-D.zip`
- `__MACOSX/._04_sprites_A-D.zip`
- `05_sprites_E-I.zip`
- `__MACOSX/._05_sprites_E-I.zip`
- `06_sprites_L-N.zip`
- `__MACOSX/._06_sprites_L-N.zip`
- `07_sprites_P-S.zip`
- `__MACOSX/._07_sprites_P-S.zip`
- `08_sprites_T-W.zip`
- `__MACOSX/._08_sprites_T-W.zip`
- `09_audio.zip`
- `__MACOSX/._09_audio.zip`
- `10_card_game.zip`
- `__MACOSX/._10_card_game.zip`
- `11_cinematics.zip`
- `__MACOSX/._11_cinematics.zip`
- `12_character_sheets.zip`
- `__MACOSX/._12_character_sheets.zip`
- `13_trade_empire.zip`
- `__MACOSX/._13_trade_empire.zip`

### `AAA Final/Dischordia Songs.zip`  (62 missing of 62)

- `Dischordia Songs/CLASSIFIED FREQUENCY (2).mp3`
- `__MACOSX/Dischordia Songs/._CLASSIFIED FREQUENCY (2).mp3`
- `Dischordia Songs/Hostile Combat (1).mp3`
- `__MACOSX/Dischordia Songs/._Hostile Combat (1).mp3`
- `Dischordia Songs/Choose Your Champion (2).mp3`
- `__MACOSX/Dischordia Songs/._Choose Your Champion (2).mp3`
- `Dischordia Songs/Warp Lane Economics.mp3`
- `__MACOSX/Dischordia Songs/._Warp Lane Economics.mp3`
- `Dischordia Songs/Neural Pathway (1).mp3`
- `__MACOSX/Dischordia Songs/._Neural Pathway (1).mp3`
- `Dischordia Songs/Knowledge is Power.mp3`
- `__MACOSX/Dischordia Songs/._Knowledge is Power.mp3`
- `Dischordia Songs/Decrypt Sequence.mp3`
- `__MACOSX/Dischordia Songs/._Decrypt Sequence.mp3`
- `Dischordia Songs/Strategic Arrangements (2).mp3`
- `__MACOSX/Dischordia Songs/._Strategic Arrangements (2).mp3`
- `Dischordia Songs/Red String Theory (1).mp3`
- `__MACOSX/Dischordia Songs/._Red String Theory (1).mp3`
- `Dischordia Songs/Warp Lane Economics (2).mp3`
- `__MACOSX/Dischordia Songs/._Warp Lane Economics (2).mp3`
- `Dischordia Songs/Hostile Combat.mp3`
- `__MACOSX/Dischordia Songs/._Hostile Combat.mp3`
- `Dischordia Songs/Choose Your Champion.mp3`
- `__MACOSX/Dischordia Songs/._Choose Your Champion.mp3`
- `Dischordia Songs/Star Dock Bazaar.mp3`
- `__MACOSX/Dischordia Songs/._Star Dock Bazaar.mp3`
- `Dischordia Songs/Title_ VESSEL 47.mp3`
- `__MACOSX/Dischordia Songs/._Title_ VESSEL 47.mp3`
- `Dischordia Songs/Star Dock Bazaar (1).mp3`
- `__MACOSX/Dischordia Songs/._Star Dock Bazaar (1).mp3`
- _…and 32 more_

### `AAA Final/DischordianSaga_GameAssets_Complete.zip`  (2 missing of 38)

- `ASSET_PRODUCTION_PLAN.md`
- `GAME_ASSETS_MANIFEST.md`

### `AAA Final/DischordianSaga_GuildCutscenes_Complete.zip`  (2 missing of 177)

- `PRODUCTION_PLAN.md`
- `GUILD_CUTSCENES_MANIFEST.md`

### `AAA Final/Elara_Viseme_Sheet.zip`  (2 missing of 2)

- `elara_viseme_sheet.png`
- `elara_viseme_sheet.webp`

### `AAA Final/Locke_Viseme_Sheet.zip`  (2 missing of 2)

- `locke_viseme_sheet.png`
- `locke_viseme_sheet.webp`

### `AAA Final/Source_Viseme_Sheet.zip`  (2 missing of 2)

- `source_viseme_sheet.png`
- `source_viseme_sheet.webp`

### `AAA Final/Trade_Empire_Art_Assets.zip`  (4 missing of 140)

- `trade_empire/wonders/wonder_dreamers_shield.png`
- `trade_empire/wonders/wonder_dreamers_shield.webp`
- `trade_empire/era_banners/era_colony_seed.png`
- `trade_empire/era_banners/era_colony_seed.webp`

### `AAA Final/actx_aaa_ui_assets.zip`  (25 missing of 25)

- `final/backgrounds/p10_act_four_cell.webp`
- `final/backgrounds/p11_act_five_terminus.webp`
- `final/backgrounds/p12_act_six_archive.webp`
- `final/backgrounds/p13_act_seven_singularity.webp`
- `final/backgrounds/p1_prelude_void.webp`
- `final/backgrounds/p2_humanity_rising.webp`
- `final/backgrounds/p3_machine_ascendant.webp`
- `final/backgrounds/p4_reset_wall.webp`
- `final/backgrounds/p7_act_one_kindergarten.webp`
- `final/backgrounds/p8_act_two_workshop.webp`
- `final/backgrounds/p9_act_three_dossier.webp`
- `final/broadcasts/p14_1_eyes_in_the_dark.webp`
- `final/broadcasts/p14_2_terminus_reclamation.webp`
- `final/broadcasts/p14_3_engineering_the_ark.webp`
- `final/broadcasts/p14_4_first_cycle_ends.webp`
- `final/broadcasts/p14_5_engineers_last_log.webp`
- `final/broadcasts/p6_generic_broadcast_panel.webp`
- `final/ui/p5_identity_frame.png`
- `final/ui/p6b_video_bezel_chrome.png`
- `final/overlays/p15_1_elara_betrayed.png`
- `final/overlays/p15_2_dual_signal.png`
- `final/overlays/p15_3_corruption_tendrils.png`
- `final/overlays/p15_4_year_one_gold_dust.png`
- `actx_ui_asset_manifest.md`
- `actx_asset_inventory.json`

### `AAA Final/corrected_assets_batch.zip`  (8 missing of 8)

- `corrected_assets/warlord_bust_corrected.png`
- `corrected_assets/warlord_bust_corrected.webp`
- `corrected_assets/warlord_bust_corrected.avif`
- `corrected_assets/eidola_bust_corrected.png`
- `corrected_assets/eidola_bust_corrected.webp`
- `corrected_assets/eidola_bust_corrected.avif`
- `corrected_assets/viseme_meme_corrected.png`
- `corrected_assets/viseme_meme_corrected.webp`

### `AAA Final/corrected_assets_batch2.zip`  (10 missing of 10)

- `corrected_assets_batch2/viseme_engineer.png`
- `corrected_assets_batch2/viseme_engineer.webp`
- `corrected_assets_batch2/shadow_tongue_bust_corrected.png`
- `corrected_assets_batch2/shadow_tongue_bust_corrected.webp`
- `corrected_assets_batch2/shadow_tongue_bust_corrected.avif`
- `corrected_assets_batch2/viseme_shadow_tongue.png`
- `corrected_assets_batch2/viseme_shadow_tongue.webp`
- `corrected_assets_batch2/minnie_bust_corrected.png`
- `corrected_assets_batch2/minnie_bust_corrected.webp`
- `corrected_assets_batch2/minnie_bust_corrected.avif`

### `AAA Final/deliverables_room_rewrites.zip`  (1 missing of 6)

- `deliverables_room_prompt_rewrites.md`

### `AAA Final/dischordian_acts2_7_assets.zip`  (90 missing of 193)

- `character_canon_map.md`
- `cinematics/act-2/start/cin_act2_opener_start.png`
- `cinematics/act-2/start/cin_act2_silence_start.png`
- `cinematics/act-2/start/cin_act2_gamemaster_right_start.png`
- `cinematics/act-2/start/cin_act2_gamemaster_left_start.png`
- `cinematics/act-2/start/cin_act2_engineer_recording_2_start.png`
- `cinematics/act-2/start/cin_act2_engineer_recording_3_start.png`
- `cinematics/act-2/end/cin_act2_opener_end.png`
- `cinematics/act-2/end/cin_act2_silence_end.png`
- `cinematics/act-2/end/cin_act2_gamemaster_left_end.png`
- `cinematics/act-2/end/cin_act2_gamemaster_right_end.png`
- `cinematics/act-2/end/cin_act2_engineer_recording_2_end.png`
- `cinematics/act-2/end/cin_act2_engineer_recording_3_end.png`
- `cinematics/act-3/start/cin_act3_thaloria_echo_start.png`
- `cinematics/act-3/start/cin_act3_eyes_fall_start.png`
- `cinematics/act-3/start/cin_act3_opener_start.png`
- `cinematics/act-3/start/cin_act3_infiltration_shared_start.png`
- `cinematics/act-3/start/cin_act3_engineer_rec5_start.png`
- `cinematics/act-3/start/cin_act3_engineer_rec4_start.png`
- `cinematics/act-3/start/cin_act3_infiltration_insurgency_start.png`
- `cinematics/act-3/start/cin_act3_infiltration_empire_start.png`
- `cinematics/act-3/start/cin_act3_infiltration_hierarchy_start.png`
- `cinematics/act-3/end/cin_act3_thaloria_echo_end.png`
- `cinematics/act-3/end/cin_act3_opener_end.png`
- `cinematics/act-3/end/cin_act3_infiltration_empire_end.png`
- `cinematics/act-3/end/cin_act3_eyes_fall_end.png`
- `cinematics/act-3/end/cin_act3_infiltration_insurgency_end.png`
- `cinematics/act-3/end/cin_act3_infiltration_hierarchy_end.png`
- `cinematics/act-3/end/cin_act3_engineer_rec5_end.png`
- `cinematics/act-3/end/cin_act3_engineer_rec4_end.png`
- _…and 60 more_

### `AAA Final/dischordian_art_assets.zip`  (32 missing of 78)

- `art/cards/thought_virus/viral_tendril.png`
- `art/cards/thought_virus/memetic_bloom.png`
- `art/cards/panopticon/panopticon_spire.png`
- `art/cards/panopticon/watcher_protocol.png`
- `art/cards/panopticon/surveillance_node.png`
- `art/cards/panopticon/data_siphon.png`
- `art/cards/neutral/house_oath_binding.png`
- `art/cards/neutral/crossroads_pact.png`
- `art/cards/neutral/house_oath_severance.png`
- `art/cards/neutral/demo_summon_token.png`
- `art/cards/neutral/demo_mana_crystal.png`
- `art/cards/neutral/demo_shield_wall.png`
- `art/cards/neutral/demo_counter_spell.png`
- `art/cards/neutral/demo_draw_engine.png`
- `art/cards/neutral/demo_trap_card.png`
- `art/cards/neutral/demo_discard_void.png`
- `art/cards/neutral/demo_heal_pulse.png`
- `art/cards/neutral/demo_buff_aura.png`
- `art/cards/neutral/demo_direct_damage.png`
- `art/cards/hierarchy/lord_of_whispers.png`
- `art/cards/hierarchy/lord_of_chains.png`
- `art/ui/bg_main_menu.png`
- `art/ui/bg_collection.png`
- `art/ui/bg_deck_builder.png`
- `art/ui/bg_battle_arena.png`
- `art/rooms/room_panopticon_core.png`
- `art/rooms/room_antiquarian_sanctum.png`
- `art/rooms/room_insurgency_safehouse.png`
- `art/rooms/room_architect_throne.png`
- `art/misc/banner_ultrawide.png`
- _…and 2 more_

### `AAA Final/dischordian_assets_final.zip`  (255 missing of 255)

- `protagonists/elara_idle_hologram.png`
- `protagonists/elara_expression_sheet.png`
- `protagonists/elara_front_turnaround.png`
- `protagonists/elara_viseme_grid.png`
- `protagonists/human_reveal_start.png`
- `protagonists/human_front_turnaround.png`
- `protagonists/human_reveal_end.png`
- `protagonists/human_expression_sheet.png`
- `protagonists/human_full_turnaround.png`
- `protagonists/elara_full_turnaround.png`
- `player_species/human_female_base.png`
- `player_species/human_male_base.png`
- `player_species/demagi_male_base.png`
- `player_species/quarchon_male_base.png`
- `player_species/neyon_male_base.png`
- `player_species/human_female_full_turnaround.png`
- `player_species/human_male_full_turnaround.png`
- `player_species/demagi_male_full_turnaround.png`
- `player_species/neyon_female_full_turnaround.png`
- `player_species/demagi_female_full_turnaround.png`
- `player_species/quarchon_male_full_turnaround.png`
- `player_species/neyon_male_full_turnaround.png`
- `player_species/quarchon_female_full_turnaround.png`
- `npcs/adjudicator_locke_bust.png`
- `npcs/collector_bust.png`
- `npcs/agent_zero_bust.png`
- `npcs/architect_bust.png`
- `npcs/watcher_bust.png`
- `npcs/degen_bust.png`
- `npcs/iron_lion_bust.png`
- _…and 225 more_

### `AAA Final/last_words_only.zip`  (40 missing of 41)

- `last_words_package/last_words_1_1.html`
- `last_words_package/last_words_1_1_generated.webp`
- `last_words_package/last_words_1_2.html`
- `last_words_package/last_words_1_2_generated.webp`
- `last_words_package/last_words_1_3.html`
- `last_words_package/last_words_1_3_generated.webp`
- `last_words_package/last_words_1_4.html`
- `last_words_package/last_words_1_4_generated.webp`
- `last_words_package/last_words_1_5.html`
- `last_words_package/last_words_1_5_generated.webp`
- `last_words_package/last_words_2_1.html`
- `last_words_package/last_words_2_1_generated.webp`
- `last_words_package/last_words_2_2.html`
- `last_words_package/last_words_2_2_generated.webp`
- `last_words_package/last_words_2_3.html`
- `last_words_package/last_words_2_3_generated.webp`
- `last_words_package/last_words_2_4.html`
- `last_words_package/last_words_2_4_generated.webp`
- `last_words_package/last_words_2_5.html`
- `last_words_package/last_words_2_5_generated.webp`
- `last_words_package/last_words_3_1.html`
- `last_words_package/last_words_3_1_generated.webp`
- `last_words_package/last_words_3_2.html`
- `last_words_package/last_words_3_2_generated.webp`
- `last_words_package/last_words_3_3.html`
- `last_words_package/last_words_3_3_generated.webp`
- `last_words_package/last_words_3_4.html`
- `last_words_package/last_words_3_4_generated.webp`
- `last_words_package/last_words_3_5.html`
- `last_words_package/last_words_3_5_generated.webp`
- _…and 10 more_

### `AAA Final/last_words_tease_afro_remake.zip`  (6 missing of 6)

- `last_words_tease_afro_remake/last_words_tease_afro_remake_slide_1.png`
- `last_words_tease_afro_remake/last_words_tease_afro_remake_slide_2.png`
- `last_words_tease_afro_remake/last_words_tease_afro_remake_slide_3.png`
- `last_words_tease_afro_remake/last_words_tease_afro_remake_slide_4.png`
- `last_words_tease_afro_remake/last_words_tease_afro_remake_slide_5.png`
- `last_words_tease_afro_remake/last_words_tease_afro_remake_notes.md`

### `AAA Final/mega_batch_101_assets.zip`  (26 missing of 151)

- `classmates/aria-wen_original.png`
- `classmates/benik-holt_original.png`
- `classmates/juno-reeve_original.png`
- `classmates/mara-thorne_original.png`
- `classmates/ollen-mire_original.png`
- `classmates/ozen-kade_original.png`
- `classmates/tess-corvia_original.png`
- `classmates/vessa-lark_original.png`
- `fragments/cipher-fragment_original.png`
- `fragments/echo-fragment_original.png`
- `fragments/flicker-fragment_original.png`
- `fragments/gilt-fragment_original.png`
- `fragments/glyph-fragment_original.png`
- `fragments/lux-fragment_original.png`
- `loredex/entity_10_keyframe.png`
- `loredex/entity_18_keyframe.png`
- `loredex/entity_1_keyframe.png`
- `loredex/entity_20_keyframe.png`
- `loredex/entity_21_keyframe.png`
- `loredex/entity_2_keyframe.png`
- `loredex/entity_3_keyframe.png`
- `loredex/entity_4_keyframe.png`
- `loredex/entity_54_keyframe.png`
- `loredex/entity_55_keyframe.png`
- `loredex/entity_66_keyframe.png`
- `loredex/entity_6_keyframe.png`

### `AAA Final/prelude_asset_build_no_vo.zip`  (70 missing of 118)

- `home/ubuntu/prelude_asset_build/manifests/asset_prompt_manifest.json`
- `home/ubuntu/prelude_asset_build/prompts/rooms/section_20.txt`
- `home/ubuntu/prelude_asset_build/prompts/cutscenes/prelude-beat-a-awakening_start_frame.txt`
- `home/ubuntu/prelude_asset_build/prompts/cutscenes/prelude-beat-a-awakening_end_frame.txt`
- `home/ubuntu/prelude_asset_build/prompts/cutscenes/prelude-beat-a-awakening_motion.txt`
- `home/ubuntu/prelude_asset_build/prompts/cutscenes/prelude-beat-a5-corridor_start_frame.txt`
- `home/ubuntu/prelude_asset_build/prompts/cutscenes/prelude-beat-a5-corridor_end_frame.txt`
- `home/ubuntu/prelude_asset_build/prompts/cutscenes/prelude-beat-a5-corridor_motion.txt`
- `home/ubuntu/prelude_asset_build/prompts/cutscenes/prelude-beat-b-escape_start_frame.txt`
- `home/ubuntu/prelude_asset_build/prompts/cutscenes/prelude-beat-b-escape_end_frame.txt`
- `home/ubuntu/prelude_asset_build/prompts/cutscenes/prelude-beat-b-escape_motion.txt`
- `home/ubuntu/prelude_asset_build/prompts/cutscenes/prelude-beat-c-crew-and-incubators_start_frame.txt`
- `home/ubuntu/prelude_asset_build/prompts/cutscenes/prelude-beat-c-crew-and-incubators_end_frame.txt`
- `home/ubuntu/prelude_asset_build/prompts/cutscenes/prelude-beat-c-crew-and-incubators_motion.txt`
- `home/ubuntu/prelude_asset_build/prompts/cutscenes/prelude-beat-c5-window_start_frame.txt`
- `home/ubuntu/prelude_asset_build/prompts/cutscenes/prelude-beat-c5-window_end_frame.txt`
- `home/ubuntu/prelude_asset_build/prompts/cutscenes/prelude-beat-c5-window_motion.txt`
- `home/ubuntu/prelude_asset_build/prompts/cutscenes/prelude-beat-d-cargo-bay_start_frame.txt`
- `home/ubuntu/prelude_asset_build/prompts/cutscenes/prelude-beat-d-cargo-bay_end_frame.txt`
- `home/ubuntu/prelude_asset_build/prompts/cutscenes/prelude-beat-d-cargo-bay_motion.txt`
- `home/ubuntu/prelude_asset_build/prompts/cutscenes/prelude-beat-d5-galley_start_frame.txt`
- `home/ubuntu/prelude_asset_build/prompts/cutscenes/prelude-beat-d5-galley_end_frame.txt`
- `home/ubuntu/prelude_asset_build/prompts/cutscenes/prelude-beat-d5-galley_motion.txt`
- `home/ubuntu/prelude_asset_build/prompts/cutscenes/prelude-beat-e-mess-hall-flashback_start_frame.txt`
- `home/ubuntu/prelude_asset_build/prompts/cutscenes/prelude-beat-e-mess-hall-flashback_end_frame.txt`
- `home/ubuntu/prelude_asset_build/prompts/cutscenes/prelude-beat-e-mess-hall-flashback_motion.txt`
- `home/ubuntu/prelude_asset_build/prompts/cutscenes/prelude-beat-f-briefing-room_start_frame.txt`
- `home/ubuntu/prelude_asset_build/prompts/cutscenes/prelude-beat-f-briefing-room_end_frame.txt`
- `home/ubuntu/prelude_asset_build/prompts/cutscenes/prelude-beat-f-briefing-room_motion.txt`
- `home/ubuntu/prelude_asset_build/prompts/cutscenes/prelude-beat-f5-empty-chair_start_frame.txt`
- _…and 40 more_

### `AAA Final/the_dischordian_aaa_assets.zip`  (24 missing of 36)

- `game_assets/title/title_master_keyframe.png`
- `game_assets/title/ark-mid_original.png`
- `game_assets/title/nebula-far-hires.png`
- `game_assets/title/ark-mid-hires.png`
- `game_assets/title/title_asset_qc_notes.md`
- `game_assets/portraits/elara/elara_lucid_original.png`
- `game_assets/portraits/elara/elara_fragmented_original.png`
- `game_assets/portraits/elara/elara_luminous_original.png`
- `game_assets/portraits/elara/elara_set_notes.md`
- `game_assets/portraits/human/human_shadow_original.png`
- `game_assets/portraits/human/human_balanced_original.png`
- `game_assets/portraits/human/human_warm_original.png`
- `game_assets/portraits/human/make_warm_variant.py`
- `game_assets/portraits/human/human_set_notes.md`
- `game_assets/vfx/hologram_materialize_notes.md`
- `game_assets/portraits/human/human_shadow_v2.png`
- `game_assets/portraits/human/human_shadow_v2_original.png`
- `game_assets/portraits/human/human_balanced_v2.png`
- `game_assets/portraits/human/human_warm_v2.png`
- `game_assets/portraits/human/human_balanced_v2_original.png`
- `game_assets/portraits/human/human_warm_v2_original.png`
- `game_assets/vfx/hologram-materialize-noire-v2.mp4`
- `game_assets/vfx/hologram-materialize-noire-v2.webm`
- `game_assets_manifest.txt`

### `AAA Final/unified_act1_merged_remake.zip`  (2 missing of 90)

- `home/ubuntu/unified_act1_asset_build/unified_act1_rebuild_manifest.md`
- `home/ubuntu/unified_act1_rebuild_manifest.md`

### `AAA Final/viseme_sheets_batch_19.zip`  (38 missing of 38)

- `viseme_sheets/viseme_meme.png`
- `viseme_sheets/viseme_meme.webp`
- `viseme_sheets/viseme_kael_phase1.png`
- `viseme_sheets/viseme_kael_phase1.webp`
- `viseme_sheets/viseme_minnie.png`
- `viseme_sheets/viseme_minnie.webp`
- `viseme_sheets/viseme_matrikala.png`
- `viseme_sheets/viseme_matrikala.webp`
- `viseme_sheets/viseme_eidola.png`
- `viseme_sheets/viseme_eidola.webp`
- `viseme_sheets/viseme_programmer.png`
- `viseme_sheets/viseme_programmer.webp`
- `viseme_sheets/viseme_seer.png`
- `viseme_sheets/viseme_seer.webp`
- `viseme_sheets/viseme_degen.png`
- `viseme_sheets/viseme_degen.webp`
- `viseme_sheets/viseme_nilmorg.png`
- `viseme_sheets/viseme_nilmorg.webp`
- `viseme_sheets/viseme_necromancer.png`
- `viseme_sheets/viseme_necromancer.webp`
- `viseme_sheets/viseme_collector.png`
- `viseme_sheets/viseme_collector.webp`
- `viseme_sheets/viseme_enigma.png`
- `viseme_sheets/viseme_enigma.webp`
- `viseme_sheets/viseme_eyes.png`
- `viseme_sheets/viseme_eyes.webp`
- `viseme_sheets/viseme_iron_lion.png`
- `viseme_sheets/viseme_iron_lion.webp`
- `viseme_sheets/viseme_architect.png`
- `viseme_sheets/viseme_architect.webp`
- _…and 8 more_

### `Album Slide Show/AOP_Part1_T01-T05.zip`  (10 missing of 101)

- `T01/T01_20.png`
- `T01/T01_22.png`
- `T01/T01_24.png`
- `T01/T01_21.png`
- `T01/T01_23.png`
- `T05/T05_24.png`
- `T05/T05_23.png`
- `T05/T05_21.png`
- `T05/T05_22.png`
- `ALBUM_MANIFEST.md`

### `Album Slide Show/AOP_Part2_T06-T10.zip`  (8 missing of 90)

- `T06/T06_19.png`
- `T06/T06_17.png`
- `T06/T06_16.png`
- `T06/T06_18.png`
- `T09/T09_18.png`
- `T09/T09_17.png`
- `T09/T09_16.png`
- `T09/T09_19.png`

### `Album Slide Show/AOP_Part3_T11-T15.zip`  (12 missing of 90)

- `T13/T13_19.png`
- `T13/T13_17.png`
- `T13/T13_18.png`
- `T13/T13_16.png`
- `T14/T14_16.png`
- `T14/T14_18.png`
- `T14/T14_17.png`
- `T14/T14_19.png`
- `T15/T15_16.png`
- `T15/T15_19.png`
- `T15/T15_17.png`
- `T15/T15_18.png`

### `Album Slide Show/AOP_Part4_T16-T20.zip`  (28 missing of 95)

- `T16/T16_11.png`
- `T16/T16_13.png`
- `T16/T16_14.png`
- `T16/T16_12.png`
- `T16/T16_17.png`
- `T16/T16_18.png`
- `T16/T16_15.png`
- `T16/T16_16.png`
- `T16/T16_19.png`
- `T16/T16_22.png`
- `T16/T16_20.png`
- `T16/T16_24.png`
- `T16/T16_21.png`
- `T16/T16_23.png`
- `T17/T17_11.png`
- `T17/T17_12.png`
- `T17/T17_13.png`
- `T17/T17_14.png`
- `T18/T18_11.png`
- `T18/T18_14.png`
- `T18/T18_12.png`
- `T18/T18_13.png`
- `T20/T20_14.png`
- `T20/T20_18.png`
- `T20/T20_16.png`
- `T20/T20_15.png`
- `T20/T20_17.png`
- `T20/T20_19.png`

### `Album Slide Show/Album_1_Age_of_Dischordian_Logic.zip`  (1 missing of 491)

- `01_age_of_dischordian_logic/ALBUM_1_MANIFEST.md`

### `Album Slide Show/Album_2_Age_of_Privacy.zip`  (38 missing of 337)

- `02_age_of_privacy/T01/T01_22.png`
- `02_age_of_privacy/T01/T01_21.png`
- `02_age_of_privacy/T01/T01_24.png`
- `02_age_of_privacy/T01/T01_20.png`
- `02_age_of_privacy/T01/T01_23.png`
- `02_age_of_privacy/T01/T01_25.png`
- `02_age_of_privacy/T02/T02_16.png`
- `02_age_of_privacy/T02/T02_17.png`
- `02_age_of_privacy/T02/T02_18.png`
- `02_age_of_privacy/T02/T02_19.png`
- `02_age_of_privacy/T02/T02_24.png`
- `02_age_of_privacy/T02/T02_23.png`
- `02_age_of_privacy/T02/T02_21.png`
- `02_age_of_privacy/T02/T02_22.png`
- `02_age_of_privacy/T02/T02_20.png`
- `02_age_of_privacy/T02/T02_25.png`
- `02_age_of_privacy/T05/T05_24.png`
- `02_age_of_privacy/T05/T05_22.png`
- `02_age_of_privacy/T05/T05_23.png`
- `02_age_of_privacy/T05/T05_21.png`
- `02_age_of_privacy/T05/T05_25.png`
- `02_age_of_privacy/T06/T06_19.png`
- `02_age_of_privacy/T06/T06_16.png`
- `02_age_of_privacy/T06/T06_17.png`
- `02_age_of_privacy/T06/T06_18.png`
- `02_age_of_privacy/T06/T06_20.png`
- `02_age_of_privacy/T09/T09_19.png`
- `02_age_of_privacy/T09/T09_16.png`
- `02_age_of_privacy/T09/T09_17.png`
- `02_age_of_privacy/T09/T09_18.png`
- _…and 8 more_

### `Album Slide Show/BOOK_OF_DANIEL_247_COMPLETE.zip`  (213 missing of 568)

- `03_book_of_daniel/T01/T01_20.png`
- `03_book_of_daniel/T01/T01_24.png`
- `03_book_of_daniel/T01/T01_23.png`
- `03_book_of_daniel/T01/T01_21.png`
- `03_book_of_daniel/T01/T01_22.png`
- `03_book_of_daniel/T01/T01_28.png`
- `03_book_of_daniel/T01/T01_26.png`
- `03_book_of_daniel/T01/T01_25.png`
- `03_book_of_daniel/T01/T01_27.png`
- `03_book_of_daniel/T01/T01_29.png`
- `03_book_of_daniel/T01/T01_30.png`
- `03_book_of_daniel/T01/T01_33.png`
- `03_book_of_daniel/T01/T01_34.png`
- `03_book_of_daniel/T01/T01_32.png`
- `03_book_of_daniel/T01/T01_31.png`
- `03_book_of_daniel/T01/T01_39.png`
- `03_book_of_daniel/T01/T01_38.png`
- `03_book_of_daniel/T01/T01_35.png`
- `03_book_of_daniel/T01/T01_37.png`
- `03_book_of_daniel/T01/T01_36.png`
- `03_book_of_daniel/T01/T01_40.png`
- `03_book_of_daniel/T02/T02_19.png`
- `03_book_of_daniel/T02/T02_18.png`
- `03_book_of_daniel/T02/T02_17.png`
- `03_book_of_daniel/T02/T02_16.png`
- `03_book_of_daniel/T02/T02_22.png`
- `03_book_of_daniel/T02/T02_24.png`
- `03_book_of_daniel/T02/T02_20.png`
- `03_book_of_daniel/T02/T02_23.png`
- `03_book_of_daniel/T02/T02_21.png`
- _…and 183 more_

### `Album Slide Show/Dischordian Logic 1-9.zip`  (18 missing of 18)

- `1. The Enigma's Lament (Remastered) (HD).wav`
- `__MACOSX/._1. The Enigma's Lament (Remastered) (HD).wav`
- `2. Dischordian Logic  (Remastered) (2).wav`
- `__MACOSX/._2. Dischordian Logic  (Remastered) (2).wav`
- `3.. Seeds of Inception (Remastered) (2).wav`
- `__MACOSX/._3.. Seeds of Inception (Remastered) (2).wav`
- `4. The Authority  (Remastered) (1).wav`
- `__MACOSX/._4. The Authority  (Remastered) (1).wav`
- `5. The Politicians Reign (Remastered) (2).wav`
- `__MACOSX/._5. The Politicians Reign (Remastered) (2).wav`
- `6. The Insurgency (Remastered) (1).wav`
- `__MACOSX/._6. The Insurgency (Remastered) (1).wav`
- `7. To Be the Human.wav`
- `__MACOSX/._7. To Be the Human.wav`
- `8. Rent Free (Remastered) (1).wav`
- `__MACOSX/._8. Rent Free (Remastered) (1).wav`
- `9. I Love War (Remastered) (1).wav`
- `__MACOSX/._9. I Love War (Remastered) (1).wav`

### `Album Slide Show/SilenceInHeaven_Album6_Complete.zip`  (8 missing of 601)

- `06_silence_in_heaven/SIH_TRACK_SPECS.md`
- `06_silence_in_heaven/FRAME_NOTES.md`
- `06_silence_in_heaven/MANIFEST.md`
- `06_silence_in_heaven/SIH_37_TRACK_MASTER.md`
- `06_silence_in_heaven/DIALOG_SCENES.md`
- `06_silence_in_heaven/CHARACTER_REFERENCE.md`
- `06_silence_in_heaven/SONG_EXPANSION_NOTES.md`
- `06_silence_in_heaven/PROGRESS.md`

### `Album Slide Show/WestByGod_Album5_Complete.zip`  (19 missing of 203)

- `05_west_by_god/MASTER_BIBLE_NOTES.md`
- `05_west_by_god/WBG_TRACK_SPECS.md`
- `05_west_by_god/T02/T02_17.png`
- `05_west_by_god/T02/T02_19.png`
- `05_west_by_god/T02/T02_18.png`
- `05_west_by_god/T02/T02_16.png`
- `05_west_by_god/T06/T06_18.png`
- `05_west_by_god/T06/T06_17.png`
- `05_west_by_god/T06/T06_16.png`
- `05_west_by_god/T06/T06_19.png`
- `05_west_by_god/T09/T09_17.png`
- `05_west_by_god/T09/T09_18.png`
- `05_west_by_god/T09/T09_19.png`
- `05_west_by_god/T09/T09_16.png`
- `05_west_by_god/T10/T10_16.png`
- `05_west_by_god/T10/T10_17.png`
- `05_west_by_god/T10/T10_19.png`
- `05_west_by_god/T10/T10_18.png`
- `05_west_by_god/MANIFEST.md`

### `Book_of_Daniel_asset_set.zip`  (349 missing of 349)

- `home/ubuntu/bod_assets/frames/bod_t01_f01.png`
- `home/ubuntu/bod_assets/frames/bod_t01_f02.png`
- `home/ubuntu/bod_assets/frames/bod_t01_f03.png`
- `home/ubuntu/bod_assets/frames/bod_t01_f04.png`
- `home/ubuntu/bod_assets/frames/bod_t01_f05.png`
- `home/ubuntu/bod_assets/frames/bod_t01_f06.png`
- `home/ubuntu/bod_assets/frames/bod_t01_f07.png`
- `home/ubuntu/bod_assets/frames/bod_t01_f08.png`
- `home/ubuntu/bod_assets/frames/bod_t01_f09.png`
- `home/ubuntu/bod_assets/frames/bod_t02_f01.png`
- `home/ubuntu/bod_assets/frames/bod_t02_f02.png`
- `home/ubuntu/bod_assets/frames/bod_t02_f03.png`
- `home/ubuntu/bod_assets/frames/bod_t02_f04.png`
- `home/ubuntu/bod_assets/frames/bod_t02_f05.png`
- `home/ubuntu/bod_assets/frames/bod_t02_f06.png`
- `home/ubuntu/bod_assets/frames/bod_t02_f07.png`
- `home/ubuntu/bod_assets/frames/bod_t03_f01.png`
- `home/ubuntu/bod_assets/frames/bod_t03_f02.png`
- `home/ubuntu/bod_assets/frames/bod_t03_f03.png`
- `home/ubuntu/bod_assets/frames/bod_t03_f04.png`
- `home/ubuntu/bod_assets/frames/bod_t03_f05.png`
- `home/ubuntu/bod_assets/frames/bod_t03_f06.png`
- `home/ubuntu/bod_assets/frames/bod_t04_f01.png`
- `home/ubuntu/bod_assets/frames/bod_t04_f02.png`
- `home/ubuntu/bod_assets/frames/bod_t04_f03.png`
- `home/ubuntu/bod_assets/frames/bod_t05_f01.png`
- `home/ubuntu/bod_assets/frames/bod_t05_f02.png`
- `home/ubuntu/bod_assets/frames/bod_t05_f03.png`
- `home/ubuntu/bod_assets/frames/bod_t06_f01.png`
- `home/ubuntu/bod_assets/frames/bod_t06_f02.png`
- _…and 319 more_

### `Collectors Arena/seedance2_game_assets.zip`  (130 missing of 130)

- `seedance2_final/arenas/arena01_panopticon_corridor.jpg`
- `seedance2_final/arenas/arena02_panopticon_central.jpg`
- `seedance2_final/arenas/arena03_the_crucible.jpg`
- `seedance2_final/arenas/arena04_shadow_sanctum.jpg`
- `seedance2_final/arenas/arena05_blood_weave.jpg`
- `seedance2_final/arenas/arena06_shadow_sanctum_necro.jpg`
- `seedance2_final/arenas/arena07_thaloria.jpg`
- `seedance2_final/arenas/arena08_panopticon_lab.jpg`
- `seedance2_final/arenas/arena09_new_babylon.jpg`
- `seedance2_final/arenas/arena10_terminus.jpg`
- `seedance2_final/arenas/arena11_degens_casino.jpg`
- `seedance2_final/arenas/arena12_corrupted_arena.jpg`
- `seedance2_final/arenas/arena13_source_chamber.jpg`
- `seedance2_final/portraits/agent_zero/amused.png`
- `seedance2_final/portraits/agent_zero/angry.png`
- `seedance2_final/portraits/agent_zero/corrupted.png`
- `seedance2_final/portraits/agent_zero/neutral.png`
- `seedance2_final/portraits/agent_zero/sorrowful.png`
- `seedance2_final/portraits/akai_shi/amused.png`
- `seedance2_final/portraits/akai_shi/angry.png`
- `seedance2_final/portraits/akai_shi/corrupted.png`
- `seedance2_final/portraits/akai_shi/neutral.png`
- `seedance2_final/portraits/akai_shi/sorrowful.png`
- `seedance2_final/portraits/dr_lyra_vox/amused.png`
- `seedance2_final/portraits/dr_lyra_vox/angry.png`
- `seedance2_final/portraits/dr_lyra_vox/corrupted.png`
- `seedance2_final/portraits/dr_lyra_vox/neutral.png`
- `seedance2_final/portraits/dr_lyra_vox/sorrowful.png`
- `seedance2_final/portraits/iron_lion/amused.png`
- `seedance2_final/portraits/iron_lion/angry.png`
- _…and 100 more_

### `Music/Saga Theme Music.zip`  (8 missing of 8)

- `Saga Theme 1.mp3`
- `__MACOSX/._Saga Theme 1.mp3`
- `Saga Theme 2.mp3`
- `__MACOSX/._Saga Theme 2.mp3`
- `Saga Theme 3.mp3`
- `__MACOSX/._Saga Theme 3.mp3`
- `Saga Theme.mp3`
- `__MACOSX/._Saga Theme.mp3`

### `Music/Silence in Heaven Complete.zip`  (74 missing of 74)

- `1. In the Beginning was the Word.wav`
- `__MACOSX/._1. In the Beginning was the Word.wav`
- `2.New Babylon Goddamn.wav`
- `__MACOSX/._2.New Babylon Goddamn.wav`
- `3. A Spark That Cannot Be Silenced 2.wav`
- `__MACOSX/._3. A Spark That Cannot Be Silenced 2.wav`
- `4. Letters to the Remnant.wav`
- `__MACOSX/._4. Letters to the Remnant.wav`
- `5.A Conspiracy of Hope.wav`
- `__MACOSX/._5.A Conspiracy of Hope.wav`
- `6. Turn Back.wav`
- `__MACOSX/._6. Turn Back.wav`
- `7. The Door That Was Shut.wav`
- `__MACOSX/._7. The Door That Was Shut.wav`
- `8. Worthy.wav`
- `__MACOSX/._8. Worthy.wav`
- `9. Not a Lion but a Lamb.wav`
- `__MACOSX/._9. Not a Lion but a Lamb.wav`
- `10. BeholdΓÇª .wav`
- `__MACOSX/._10. BeholdΓÇª .wav`
- `11. And the World Adjusted.wav`
- `__MACOSX/._11. And the World Adjusted.wav`
- `12. Plead the Fifth.wav`
- `__MACOSX/._12. Plead the Fifth.wav`
- `13.How Long.wav`
- `__MACOSX/._13.How Long.wav`
- `14. The Two Witnesses.wav`
- `__MACOSX/._14. The Two Witnesses.wav`
- `15. And the Empire Celebrated.wav`
- `__MACOSX/._15. And the Empire Celebrated.wav`
- _…and 44 more_

### `NanoBanna2_Art_Assets_112.zip`  (9 missing of 112)

- `nanobanna2_assets/soul_stones/SS-VIOLET.png`
- `nanobanna2_assets/soul_stones/SS-RED.png`
- `nanobanna2_assets/soul_stones/SS-GOLD.png`
- `nanobanna2_assets/dischordian/DISCH-PARADOX.png`
- `nanobanna2_assets/dischordian/DISCH-WITNESS.png`
- `nanobanna2_assets/dischordian/DISCH-FIRST-WORD.png`
- `nanobanna2_assets/rooms/ROOM-PURIFICATION.png`
- `nanobanna2_assets/rooms/ROOM-SUMMONING.png`
- `nanobanna2_assets/rooms/ROOM-MEMORIAL.png`

### `Silence_in_Heaven_asset_set.zip`  (57 missing of 94)

- `sih_assets/backgrounds/sih_bg_agora_original.png`
- `sih_assets/backgrounds/sih_bg_altar_original.png`
- `sih_assets/backgrounds/sih_bg_antechamber_original.png`
- `sih_assets/backgrounds/sih_bg_bowls_original.png`
- `sih_assets/backgrounds/sih_bg_broadcast.png`
- `sih_assets/backgrounds/sih_bg_broadcast_original.png`
- `sih_assets/backgrounds/sih_bg_empty_original.png`
- `sih_assets/backgrounds/sih_bg_gate_original.png`
- `sih_assets/backgrounds/sih_bg_harvest_original.png`
- `sih_assets/backgrounds/sih_bg_newearth_original.png`
- `sih_assets/backgrounds/sih_bg_resurrection_original.png`
- `sih_assets/backgrounds/sih_bg_sanctuary_original.png`
- `sih_assets/backgrounds/sih_bg_seals_original.png`
- `sih_assets/backgrounds/sih_bg_shore_original.png`
- `sih_assets/backgrounds/sih_bg_trumpet.png`
- `sih_assets/backgrounds/sih_bg_silence_original.png`
- `sih_assets/backgrounds/sih_bg_street_original.png`
- `sih_assets/backgrounds/sih_bg_throne_original.png`
- `sih_assets/backgrounds/sih_bg_trumpet_original.png`
- `sih_assets/backgrounds/sih_bg_void_original.png`
- `sih_assets/backgrounds/sih_bg_wisdom_original.png`
- `sih_assets/backgrounds/sih_bg_broadcast_v2.png`
- `sih_assets/backgrounds/sih_bg_wisdom_v2.png`
- `sih_assets/backgrounds/sih_bg_wisdom_v3.png`
- `sih_assets/backgrounds/sih_bg_sanctuary_v2.png`
- `sih_assets/backgrounds/sih_bg_sanctuary_v3.png`
- `sih_assets/backgrounds/sih_bg_sanctuary_final.png`
- `sih_assets/backgrounds/sih_bg_sanctuary_final_original.png`
- `sih_assets/narrators/sih_antiq_archive_original.png`
- `sih_assets/narrators/sih_antiq_argue_original.png`
- _…and 27 more_

### `Videos/Music & Stories.zip`  (26 missing of 26)

- `Baron & The Heart of Time (S2.13).mp4`
- `__MACOSX/._Baron & The Heart of Time (S2.13).mp4`
- `Brushstroke of the Empire (CoNexus Original).mp4`
- `__MACOSX/._Brushstroke of the Empire (CoNexus Original).mp4`
- `Hypnotized (Official Music Video).mp4`
- `__MACOSX/._Hypnotized (Official Music Video).mp4`
- `Malkia Ukweli & the Panopticon - Building the Architect (Official Video).mp4`
- `__MACOSX/._Malkia Ukweli & the Panopticon - Building the Architect (Official Video).mp4`
- `Malkia Ukweli & the Panopticon - The Book of Daniel 2.0 (Official Music Video).mp4`
- `__MACOSX/._Malkia Ukweli & the Panopticon - The Book of Daniel 2.0 (Official Music Video).mp4`
- `The Collector (1).mp4`
- `__MACOSX/._The Collector (1).mp4`
- `The CoNexus.mp4`
- `__MACOSX/._The CoNexus.mp4`
- `The Game Master.mp4`
- `__MACOSX/._The Game Master.mp4`
- `The Last Christmas.mp4`
- `__MACOSX/._The Last Christmas.mp4`
- `The Meme - #thememe.mp4`
- `__MACOSX/._The Meme - #thememe.mp4`
- `The Necromancer (1).mp4`
- `__MACOSX/._The Necromancer (1).mp4`
- `The Ocularum.mp4`
- `__MACOSX/._The Ocularum.mp4`
- `The River.mp4`
- `__MACOSX/._The River.mp4`

### `Videos/NEW_VIDEOS_200.zip`  (26 missing of 200)

- `videos/dlc_mystery/y1q1_first_charter/shot_5.mp4`
- `videos/dlc_mystery/y1q2_pale_inheritance/shot_5.mp4`
- `videos/dlc_mystery/y1q3_curriculum_crisis/shot_5.mp4`
- `videos/dlc_mystery/y1q4_witness_plaza/shot_5.mp4`
- `videos/dlc_mystery/y2q1_charter_schism/shot_5.mp4`
- `videos/fight_intros/05_watcher/combined_05_watcher.mp4`
- `videos/fight_intros/06_necromancer/combined_06_necromancer.mp4`
- `videos/fight_intros/07_meme/combined_07_meme.mp4`
- `videos/fight_intros/08_collector/combined_08_collector.mp4`
- `videos/fight_intros/09_kael_recruiter/combined_09_kael_recruiter.mp4`
- `videos/fight_intros/10_human/combined_10_human.mp4`
- `videos/fight_intros/11_gamemaster_human/combined_11_gamemaster_human.mp4`
- `videos/fight_intros/11_gamemaster_robot/combined_11_gamemaster_robot.mp4`
- `videos/fight_intros/12_collector_rematch/combined_12_collector_rematch.mp4`
- `videos/fight_intros/13_architect/combined_13_architect.mp4`
- `videos/fight_intros/14_source/combined_14_source.mp4`
- `videos/fight_intros/15_jailer/combined_15_jailer.mp4`
- `videos/fight_intros/16_ironlion_rematch/combined_16_ironlion_rematch.mp4`
- `videos/fight_intros/17_elara_glitched/combined_17_elara_glitched.mp4`
- `videos/fight_intros/18_agent_zero/combined_18_agent_zero.mp4`
- `videos/fight_intros/19_antiquarian/combined_19_antiquarian.mp4`
- `videos/fight_intros/19_nilmorg_BONUS/combined_19_nilmorg_BONUS.mp4`
- `videos/fight_intros/20_conexus_BONUS/combined_20_conexus_BONUS.mp4`
- `videos/fight_intros/20_dreamer/combined_20_dreamer.mp4`
- `videos/fight_intros/21_oracle_meme/combined_21_oracle_meme.mp4`
- `videos/fight_intros/21_shadow_tongue_BONUS/combined_21_shadow_tongue_BONUS.mp4`

### `Videos/OTHER_CUTSCENES.zip`  (2 missing of 47)

- `prestige/kf1.png`
- `prestige/concat.txt`

### `Videos/Veo Vid Archive 2.zip`  (36 missing of 36)

- `clip_01.mp4`
- `__MACOSX/._clip_01.mp4`
- `clip_02.mp4`
- `__MACOSX/._clip_02.mp4`
- `clip_03.mp4`
- `__MACOSX/._clip_03.mp4`
- `clip_04.mp4`
- `__MACOSX/._clip_04.mp4`
- `clip_05.mp4`
- `__MACOSX/._clip_05.mp4`
- `clip_06.mp4`
- `__MACOSX/._clip_06.mp4`
- `clip_07.mp4`
- `__MACOSX/._clip_07.mp4`
- `clip_08.mp4`
- `__MACOSX/._clip_08.mp4`
- `clip_09.mp4`
- `__MACOSX/._clip_09.mp4`
- `clip_10.mp4`
- `__MACOSX/._clip_10.mp4`
- `clip_11.mp4`
- `__MACOSX/._clip_11.mp4`
- `clip_12.mp4`
- `__MACOSX/._clip_12.mp4`
- `clip_13.mp4`
- `__MACOSX/._clip_13.mp4`
- `clip_14.mp4`
- `__MACOSX/._clip_14.mp4`
- `clip_15.mp4`
- `__MACOSX/._clip_15.mp4`
- _…and 6 more_

### `Videos/Veo Vid SIH 1.zip`  (52 missing of 52)

- `clip_01 (1).mp4`
- `__MACOSX/._clip_01 (1).mp4`
- `clip_02 (1).mp4`
- `__MACOSX/._clip_02 (1).mp4`
- `clip_03 (1).mp4`
- `__MACOSX/._clip_03 (1).mp4`
- `clip_04 (1).mp4`
- `__MACOSX/._clip_04 (1).mp4`
- `clip_05 (1).mp4`
- `__MACOSX/._clip_05 (1).mp4`
- `clip_06 (1).mp4`
- `__MACOSX/._clip_06 (1).mp4`
- `clip_07 (1).mp4`
- `__MACOSX/._clip_07 (1).mp4`
- `clip_08 (1).mp4`
- `__MACOSX/._clip_08 (1).mp4`
- `clip_09 (1).mp4`
- `__MACOSX/._clip_09 (1).mp4`
- `clip_10 (1).mp4`
- `__MACOSX/._clip_10 (1).mp4`
- `clip_11 (1).mp4`
- `__MACOSX/._clip_11 (1).mp4`
- `clip_12 (1).mp4`
- `__MACOSX/._clip_12 (1).mp4`
- `clip_13 (1).mp4`
- `__MACOSX/._clip_13 (1).mp4`
- `clip_14 (1).mp4`
- `__MACOSX/._clip_14 (1).mp4`
- `clip_15 (1).mp4`
- `__MACOSX/._clip_15 (1).mp4`
- _…and 22 more_

### `Videos/Welcome to Celebration & Mechronis.zip`  (4 missing of 4)

- `Welcome to Celebration Final.mp4`
- `__MACOSX/._Welcome to Celebration Final.mp4`
- `Mechronis Academy Final.mp4`
- `__MACOSX/._Mechronis Academy Final.mp4`

### `Videos/dischordian_cutscene_assets.zip`  (5 missing of 48)

- `cutscenes/fallbacks/cs1_awakening_fallback.png`
- `cutscenes/fallbacks/cs2_human_contact_fallback.png`
- `cutscenes/fallbacks/cs3_memory_recovery_fallback.png`
- `cutscenes/fallbacks/cs4_breaking_point_fallback.png`
- `cutscenes/fallbacks/cs5_thought_virus_fallback.png`

### `aaa_assets_complete.zip`  (1 missing of 195)

- `asset_summary.md`

### `card art/dischordian_card_art_complete_406_bundle.zip`  (957 missing of 957)

- `dischordian_card_renders/art_s1_char_007.png`
- `dischordian_card_renders/art_s1_char_009.png`
- `dischordian_card_renders/art_s1_char_006.png`
- `dischordian_card_renders/art_gen_architect.png`
- `dischordian_card_renders/art_s1_char_008.png`
- `dischordian_card_renders/art_gen_architect_original.png`
- `dischordian_card_renders/art_s1_char_006_original.png`
- `dischordian_card_renders/art_s1_char_007_original.png`
- `dischordian_card_renders/art_s1_char_008_original.png`
- `dischordian_card_renders/art_s1_char_009_original.png`
- `dischordian_card_renders/art_s1_char_013.png`
- `dischordian_card_renders/art_s1_char_016.png`
- `dischordian_card_renders/art_s1_char_019.png`
- `dischordian_card_renders/art_s1_char_015.png`
- `dischordian_card_renders/art_s1_char_015_original.png`
- `dischordian_card_renders/art_s1_char_016_original.png`
- `dischordian_card_renders/art_s1_char_019_original.png`
- `dischordian_card_renders/art_s1_char_013_original.png`
- `dischordian_card_renders/art_s1_char_022.png`
- `dischordian_card_renders/art_s1_char_030.png`
- `dischordian_card_renders/art_s1_char_024.png`
- `dischordian_card_renders/art_s1_char_021.png`
- `dischordian_card_renders/art_s1_char_021_original.png`
- `dischordian_card_renders/art_s1_char_022_original.png`
- `dischordian_card_renders/art_s1_char_024_original.png`
- `dischordian_card_renders/art_s1_char_030_original.png`
- `dischordian_card_renders/art_s1_char_100.png`
- `dischordian_card_renders/art_s1_char_042.png`
- `dischordian_card_renders/art_s1_char_038.png`
- `dischordian_card_renders/art_s1_char_039.png`
- _…and 927 more_

### `casino_art_bible_assets.zip`  (50 missing of 115)

- `casino_art/section2_game_tables/GT-001_Tournament_Bracket_original.png`
- `casino_art/section2_game_tables/GT-003_Void_Card_Back_original.png`
- `casino_art/section2_game_tables/LD-002_Dice_Cup_original.png`
- `casino_art/section2_game_tables/LD-003-A_NPC_The_Stone_original.png`
- `casino_art/section2_game_tables/LD-003-B_NPC_The_Giggler_original.png`
- `casino_art/section2_game_tables/LD-003-C_NPC_The_Veteran_original.png`
- `casino_art/section2_game_tables/LD-003-D_NPC_The_Kid_original.png`
- `casino_art/section2_game_tables/FB-001_Faction_War_Betting_Board_original.png`
- `casino_art/section2_game_tables/DR-001_Void_Charge_Device_original.png`
- `casino_art/section2_game_tables/VB-001_Bingo_Card_original.png`
- `casino_art/section2_game_tables/VB-002_Bingo_Ball_original.png`
- `casino_art/section3_effects/FX-001_Win_Frame1-2_original.png`
- `casino_art/section3_effects/FX-001_Win_Frame3-4_original.png`
- `casino_art/section3_effects/FX-001_Win_Frame5-6_original.png`
- `casino_art/section3_effects/FX-001_Win_Frame7-8_original.png`
- `casino_art/section3_effects/FX-002_Loss_Frame1-2_original.png`
- `casino_art/section3_effects/FX-002_Loss_Frame3-4_original.png`
- `casino_art/section3_effects/FX-002_Loss_Frame5-6_original.png`
- `casino_art/section3_effects/FX-003_Jackpot_Frame1-3_original.png`
- `casino_art/section3_effects/FX-003_Jackpot_Frame4-6_original.png`
- `casino_art/section3_effects/FX-003_Jackpot_Frame7-9_original.png`
- `casino_art/section3_effects/FX-003_Jackpot_Frame10-12_original.png`
- `casino_art/section4_degen/DG-001_Bartender_Phase_original.png`
- `casino_art/section4_degen/DG-001-EXPR-A_Neutral_original.png`
- `casino_art/section4_degen/DG-001-EXPR-B_Amused_original.png`
- `casino_art/section4_degen/DG-001-EXPR-C_Sympathetic_original.png`
- `casino_art/section4_degen/DG-001-EXPR-D_Nervous_original.png`
- `casino_art/section4_degen/DG-002_Casino_Boss_Phase_original.png`
- `casino_art/section4_degen/DG-003_NeYon_Reveal_original.png`
- `casino_art/section5_props_chips/DG-WATCH_original.png`
- _…and 20 more_

### `dischordian_aaa_game_design_assets.zip`  (54 missing of 54)

- `generated_assets/art/ui/hud/panel_accent.png`
- `generated_assets/art/ui/hud/button_primary.png`
- `generated_assets/art/ui/hud/button_secondary.png`
- `generated_assets/art/ui/hud/bar_health.png`
- `generated_assets/art/ui/hud/panel_main.png`
- `generated_assets/art/ui/hud/cursor_default.png`
- `generated_assets/art/ui/hud/bar_mana.png`
- `generated_assets/art/ui/hud/bar_xp.png`
- `generated_assets/art/rooms/ark_barracks.jpg`
- `generated_assets/art/rooms/ark_observatory.jpg`
- `generated_assets/art/rooms/ark_galley.jpg`
- `generated_assets/art/rooms/ark_chapel.jpg`
- `generated_assets/art/rooms/ark_brig.jpg`
- `generated_assets/art/rooms/ark_cryo_2.jpg`
- `generated_assets/art/rooms/ark_armory_interior.jpg`
- `generated_assets/art/rooms/ark_reactor.jpg`
- `generated_assets/art/logos/faction_dreamer.png`
- `generated_assets/art/logos/faction_hierarchy_corp.png`
- `generated_assets/art/logos/faction_potentials_order.png`
- `generated_assets/art/logos/faction_ne_yon.png`
- `generated_assets/art/logos/faction_architect.png`
- `generated_assets/art/trade/icons/currency_dream_tokens.png`
- `generated_assets/art/trade/icons/currency_gems.png`
- `generated_assets/art/trade/icons/currency_dischord_shards.png`
- `generated_assets/art/trade/icons/currency_credits.png`
- `generated_assets/art/trade/icons/currency_dust.png`
- `generated_assets/art/trade/icons/currency_silver.png`
- `generated_assets/art/trade/emblems/faction_new_babylon.png`
- `generated_assets/art/trade/emblems/faction_hierarchy.png`
- `generated_assets/art/trade/emblems/faction_neyons.png`
- _…and 24 more_

### `lore_gallery_assets.zip`  (17 missing of 17)

- `lore_gallery_final/era_backgrounds/lore_era_foundation_1920x1080.jpg`
- `lore_gallery_final/era_backgrounds/lore_era_privacy_1920x1080.jpg`
- `lore_gallery_final/era_backgrounds/lore_era_fall_1920x1080.jpg`
- `lore_gallery_final/era_backgrounds/lore_era_potentials_1920x1080.jpg`
- `lore_gallery_final/era_backgrounds/lore_era_visions_1920x1080.jpg`
- `lore_gallery_final/card_frames_256x384/lore_frame_common-slate_256x384.png`
- `lore_gallery_final/card_frames_256x384/lore_frame_uncommon-green_256x384.png`
- `lore_gallery_final/card_frames_256x384/lore_frame_rare-blue_256x384.png`
- `lore_gallery_final/card_frames_256x384/lore_frame_epic-purple_256x384.png`
- `lore_gallery_final/card_frames_256x384/lore_frame_legendary-gold_256x384.png`
- `lore_gallery_final/card_frames_1024x1536/lore_frame_common-slate_1024x1536.png`
- `lore_gallery_final/card_frames_1024x1536/lore_frame_uncommon-green_1024x1536.png`
- `lore_gallery_final/card_frames_1024x1536/lore_frame_rare-blue_1024x1536.png`
- `lore_gallery_final/card_frames_1024x1536/lore_frame_epic-purple_1024x1536.png`
- `lore_gallery_final/card_frames_1024x1536/lore_frame_legendary-gold_1024x1536.png`
- `lore_gallery_final/overlays_256x384/lore_overlay_locked-classified_256x384.png`
- `lore_gallery_final/overlays_1024x1536/lore_overlay_locked-classified_1024x1536.png`

### `nanobanna2_game_assets.zip`  (60 missing of 75)

- `nanobanna2_final/enemies_96/terminus_enemy_undead-grub_96.png`
- `nanobanna2_final/enemies_96/terminus_enemy_plague-ant_96.png`
- `nanobanna2_final/enemies_96/terminus_enemy_infected-spore_96.png`
- `nanobanna2_final/enemies_96/terminus_enemy_corrupt-mantis_96.png`
- `nanobanna2_final/enemies_96/terminus_enemy_rot-crawler_96.png`
- `nanobanna2_final/enemies_96/terminus_enemy_venom-wasp_96.png`
- `nanobanna2_final/enemies_96/terminus_enemy_bile-hulk_96.png`
- `nanobanna2_final/enemies_96/terminus_enemy_infected-reaper_96.png`
- `nanobanna2_final/enemies_96/terminus_enemy_neural-parasite_96.png`
- `nanobanna2_final/enemies_96/terminus_enemy_swarm-queen_96.png`
- `nanobanna2_final/enemies_96/terminus_enemy_hive-tyrant_96.png`
- `nanobanna2_final/enemies_96/terminus_enemy_avatar-source_96.png`
- `nanobanna2_final/enemies_256/terminus_enemy_undead-grub_256.png`
- `nanobanna2_final/enemies_256/terminus_enemy_plague-ant_256.png`
- `nanobanna2_final/enemies_256/terminus_enemy_infected-spore_256.png`
- `nanobanna2_final/enemies_256/terminus_enemy_corrupt-mantis_256.png`
- `nanobanna2_final/enemies_256/terminus_enemy_rot-crawler_256.png`
- `nanobanna2_final/enemies_256/terminus_enemy_venom-wasp_256.png`
- `nanobanna2_final/enemies_256/terminus_enemy_bile-hulk_256.png`
- `nanobanna2_final/enemies_256/terminus_enemy_infected-reaper_256.png`
- `nanobanna2_final/enemies_256/terminus_enemy_neural-parasite_256.png`
- `nanobanna2_final/enemies_256/terminus_enemy_swarm-queen_256.png`
- `nanobanna2_final/enemies_256/terminus_enemy_hive-tyrant_256.png`
- `nanobanna2_final/enemies_256/terminus_enemy_avatar-source_256.png`
- `nanobanna2_final/turrets_128/terminus_turret_pulse-cannon_128.png`
- `nanobanna2_final/turrets_128/terminus_turret_arc-emitter_128.png`
- `nanobanna2_final/turrets_128/terminus_turret_cryo-array_128.png`
- `nanobanna2_final/turrets_128/terminus_turret_flame-projector_128.png`
- `nanobanna2_final/turrets_128/terminus_turret_missile-battery_128.png`
- `nanobanna2_final/turrets_128/terminus_turret_shield-pylon_128.png`
- _…and 30 more_

### `optional_components_assets.zip`  (59 missing of 59)

- `section1_empty_states/EMPTY-04_Lore_Journal_Blank_Pages.png`
- `section1_empty_states/EMPTY-03_Card_Collection_Empty_Display.png`
- `section1_empty_states/EMPTY-05_Guild_Hall_Abandoned.png`
- `section1_empty_states/EMPTY-01_Quest_Log_Silent_Array.png`
- `section1_empty_states/EMPTY-02_Inventory_Empty_Cargo_Hold.png`
- `section1_empty_states/EMPTY-01_Quest_Log_Silent_Array_original.png`
- `section1_empty_states/EMPTY-02_Inventory_Empty_Cargo_Hold_original.png`
- `section1_empty_states/EMPTY-03_Card_Collection_Empty_Display_original.png`
- `section1_empty_states/EMPTY-04_Lore_Journal_Blank_Pages_original.png`
- `section1_empty_states/EMPTY-05_Guild_Hall_Abandoned_original.png`
- `section1_empty_states/EMPTY-06_Pet_Collection_Silent_Specimen_Bay.png`
- `section1_empty_states/EMPTY-08_Notifications_Quiet_Terminal.png`
- `section1_empty_states/EMPTY-10_Achievements_Clean_Record_Board.png`
- `section1_empty_states/EMPTY-07_Match_History_Empty_Arena.png`
- `section1_empty_states/EMPTY-09_Companions_Empty_Quarters.png`
- `section1_empty_states/EMPTY-06_Pet_Collection_Silent_Specimen_Bay_original.png`
- `section1_empty_states/EMPTY-07_Match_History_Empty_Arena_original.png`
- `section1_empty_states/EMPTY-08_Notifications_Quiet_Terminal_original.png`
- `section1_empty_states/EMPTY-09_Companions_Empty_Quarters_original.png`
- `section1_empty_states/EMPTY-10_Achievements_Clean_Record_Board_original.png`
- `section1_empty_states/EMPTY-12_Apprentices_Empty_Training_Hall.png`
- `section1_empty_states/EMPTY-11_Trade_History_Silent_Marketplace.png`
- `section1_empty_states/EMPTY-13_Leaderboard_Unranked_Display.png`
- `section1_empty_states/EMPTY-11_Trade_History_Silent_Marketplace_original.png`
- `section1_empty_states/EMPTY-12_Apprentices_Empty_Training_Hall_original.png`
- `section1_empty_states/EMPTY-13_Leaderboard_Unranked_Display_original.png`
- `section2_broadcasts/EVT-03_Forge_of_Nations.jpg`
- `section2_broadcasts/BCAST-FRAME_Meme_Broadcast.png`
- `section2_broadcasts/EVT-02_Chrono_Harvest.jpg`
- `section2_broadcasts/EVT-01_Shadow_Convergence.jpg`
- _…and 29 more_

### `oracle-deck-aaa-assets.zip`  (46 missing of 46)

- `art/oracle-deck/card-00-the-prisoner.png`
- `art/oracle-deck/card-00-the-prisoner_original.png`
- `art/oracle-deck/card-02-the-dreamer.png`
- `art/oracle-deck/card-01-the-architect.png`
- `art/oracle-deck/card-04-the-emperor-locke.png`
- `art/oracle-deck/card-03-the-empress-elara.png`
- `art/oracle-deck/card-05-the-antiquarian.png`
- `art/oracle-deck/card-01-the-architect_original.png`
- `art/oracle-deck/card-02-the-dreamer_original.png`
- `art/oracle-deck/card-03-the-empress-elara_original.png`
- `art/oracle-deck/card-04-the-emperor-locke_original.png`
- `art/oracle-deck/card-05-the-antiquarian_original.png`
- `art/oracle-deck/card-06-the-two-witnesses.png`
- `art/oracle-deck/card-08-the-balance.png`
- `art/oracle-deck/card-10-the-wheel.png`
- `art/oracle-deck/card-07-the-iron-lion.png`
- `art/oracle-deck/card-09-the-hermit.png`
- `art/oracle-deck/card-06-the-two-witnesses_original.png`
- `art/oracle-deck/card-07-the-iron-lion_original.png`
- `art/oracle-deck/card-08-the-balance_original.png`
- `art/oracle-deck/card-09-the-hermit_original.png`
- `art/oracle-deck/card-10-the-wheel_original.png`
- `art/oracle-deck/card-11-the-jailer.png`
- `art/oracle-deck/card-11-the-jailer_original.png`
- `art/oracle-deck/card-13-death.png`
- `art/oracle-deck/card-16-the-tower.png`
- `art/oracle-deck/card-14-the-engineer.png`
- `art/oracle-deck/card-12-the-hanged-one.png`
- `art/oracle-deck/card-15-the-collector.png`
- `art/oracle-deck/card-12-the-hanged-one_original.png`
- _…and 16 more_

