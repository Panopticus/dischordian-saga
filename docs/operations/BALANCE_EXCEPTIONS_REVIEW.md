# Balance Exceptions — designer review

> 45 cards carry `balanceException` entries with reviewer `2026-05-stat-curve-recalibration`. Each was auto-classified by `apps/scripts/backfill-balance-exceptions.ts` based on structural heuristics (pet, reward, imprint, ability-driven, etc.). Designer review either rebalances the card (and removes the entry) or upgrades the reason to intent-on-record sign-off, replacing the reviewer field with the human approver's name.

Find them all: `grep -rln '"2026-05-stat-curve-recalibration"' apps/shared/tcg-core/cards/definitions`

## Review table

| Cost | Card | Stats | Keywords | Auto-reason category | File |
|------|------|-------|----------|---------------------|------|
| 1 | **Courier Sprite** (`s1_char_089`) | 1/1 | flying, rush | ability-driven | `neutral/s1_char_089_courier_sprite.ts` |
| 1 | **Starlight Familiar** (`s1_pack_021`) | 1/1 | flying | ability-driven | `dreamer/s1_pack_021_starlight_familiar.ts` |
| 1 | **Bronze Scarab** (`s1_pack_pet_gilt_beetle_1`) | 1/3 | provoke | pet | `architect/s1_pack_pet_gilt_beetle_1.ts` |
| 1 | **Spore Seedling** (`s1_pack_pet_spore_fungus_1`) | 0/2 | — | pet | `insurgency/s1_pack_pet_spore_fungus_1.ts` |
| 1 | **Chrono Kitten** (`s1_pack_pet_temporal_kitten_1`) | 1/1 | rush | pet | `dreamer/s1_pack_pet_temporal_kitten_1.ts` |
| 1 | **Battle-Hardened Companion** (`s1_reward_pet_streak`) | 1/1 | rush | pet | `neutral/s1_reward_pet_streak.ts` |
| 2 | **Breeze Whisper** (`s1_elem_air_01`) | 1/2 | flying | thematic | `elemental/air.ts` |
| 2 | **Wolfpack Initiate** (`s1_neutral_pack_001`) | 1/2 | pack | ability-driven | `neutral/engine_demo_cards.ts` |
| 3 | **General Prometheus** (`s1_char_009`) | 3/6 | — | low-cost util | `architect/s1_char_009_general_prometheus.ts` |
| 3 | **Vision Walker** (`s1_char_111`) | 2/3 | flying | ability-driven | `dreamer/s1_char_111_vision_walker.ts` |
| 3 | **Viral Vector** (`s1_char_114`) | 2/3 | — | ability-driven | `thought_virus/s1_char_114_viral_vector.ts` |
| 3 | **Age Walker** (`s1_char_124`) | 2/3 | grow | ability-driven | `antiquarian/s1_char_124_age_walker.ts` |
| 3 | **Moment Keeper** (`s1_dim_time_01`) | 1/4 | grow | ability-driven | `dimensional/time.ts` |
| 3 | **Imprint: The Detective (Uncommon)** (`s1_imprint_the_detective_t2`) | 2/3 | backstab | general/imprint | `imprint/the_detective.ts` |
| 3 | **Imprint: The Engineer (Uncommon)** (`s1_imprint_the_engineer_t2`) | 2/3 | — | general/imprint | `imprint/the_engineer.ts` |
| 3 | **Imprint: The Oracle (Uncommon)** (`s1_imprint_the_oracle_t2`) | 2/3 | dispel | general/imprint | `imprint/the_oracle.ts` |
| 3 | **Witness Whose Time Has Come** (`s1_neutral_if_001`) | 2/3 | — | ability-driven | `neutral/engine_demo_cards.ts` |
| 3 | **The Reading Room** (`s1_neutral_oncardplayed_001`) | 2/3 | — | ability-driven | `neutral/engine_demo_cards.ts` |
| 3 | **Honor Guard** (`s1_neutral_zeal_001`) | 2/3 | zeal | ability-driven | `neutral/engine_demo_cards.ts` |
| 3 | **Signal Repeater** (`s1_pack_010`) | 2/3 | — | ability-driven | `insurgency/s1_pack_010_signal_repeater.ts` |
| 3 | **Sigil Moth** (`s1_pack_pet_glyph_moth_2`) | 2/3 | flying | pet | `dreamer/s1_pack_pet_glyph_moth_2.ts` |
| 3 | **Master Spy** (`s1_reward_class_spy`) | 3/2 | backstab | reward | `insurgency/s1_reward_class_spy.ts` |
| 4 | **Wraith Calder** (`s1_char_106`) | 3/4 | rebirth | ability-driven | `insurgency/s1_char_106_wraith_calder.ts` |
| 4 | **Loop Walker** (`s1_dim_time_02`) | 3/4 | grow, rebirth | ability-driven | `dimensional/time.ts` |
| 4 | **Imprint: The Detective (Rare)** (`s1_imprint_the_detective_t3`) | 3/4 | backstab, deathwatch | general/imprint | `imprint/the_detective.ts` |
| 4 | **Imprint: The Engineer (Rare)** (`s1_imprint_the_engineer_t3`) | 3/4 | — | general/imprint | `imprint/the_engineer.ts` |
| 4 | **Imprint: The Oracle (Rare)** (`s1_imprint_the_oracle_t3`) | 3/4 | dispel | general/imprint | `imprint/the_oracle.ts` |
| 4 | **The Anchor of Kael** (`s1_neutral_struct_001`) | 4/8 | structure | low-cost util | `neutral/engine_demo_cards.ts` |
| 4 | **Chrono Blade** (`s1_pack_038`) | 4/3 | celerity | ability-driven | `antiquarian/s1_pack_038_chrono_blade.ts` |
| 4 | **Elara, Advocate** (`s1_pack_id_elara_advocate`) | 2/5 | — | ability-driven | `neutral/s1_pack_id_elara_advocate.ts` |
| 4 | **Akai Shi, the Red Death** (`s1_pack_seed_fighter`) | 4/3 | rush, pierce | ability-driven | `new_babylon/s1_pack_seed_fighter.ts` |
| 4 | **The Balanced Witness** (`s1_reward_campaign_balanced`) | 3/4 | — | reward | `neutral/s1_reward_campaign_balanced.ts` |
| 4 | **Nebula Shark** (`s1_reward_casino_poker`) | 3/4 | — | reward | `new_babylon/s1_reward_casino_poker.ts` |
| 4 | **Cipher, Logic's Edge** (`s1_reward_eidolon_cipher`) | 3/4 | — | reward | `architect/s1_reward_eidolon_cipher.ts` |
| 4 | **Echo, the Resonance** (`s1_reward_eidolon_echo`) | 3/4 | — | reward | `insurgency/s1_reward_eidolon_echo.ts` |
| 4 | **Graduated Operative** (`s1_reward_graduate_deploy`) | 3/4 | — | reward | `neutral/s1_reward_graduate_deploy.ts` |
| 5 | **Senator Voss** (`s1_char_117`) | 3/4 | — | ability-driven | `new_babylon/s1_char_117_senator_voss.ts` |
| 5 | **Timeline Splitter** (`s1_char_122`) | 3/5 | — | ability-driven | `antiquarian/s1_char_122_timeline_splitter.ts` |
| 5 | **Arcane Monarch** (`s1_pack_pet_glyph_moth_3`) | 3/5 | flying | pet | `dreamer/s1_pack_pet_glyph_moth_3.ts` |
| 6 | **The Sum Over Histories** (`s1_dim_prob_03`) | 4/6 | flying, dispel | ability-driven | `dimensional/probability.ts` |
| 6 | **Elara, Awakened** (`s1_pack_id_elara_panoptic`) | 3/7 | — | ability-driven | `neutral/s1_pack_id_elara_panoptic.ts` |
| 7 | **White Oracle** (`s1_char_104`) | 3/8 | — | ability-driven | `architect/s1_char_104_white_oracle.ts` |
| 8 | **Mor-Vethic, CHRO** (`s2_hierarchy_chro_mor_vethic`) | 4/9 | provoke | ability-driven | `s2_hierarchy/c_suite.ts` |
| 8 | **Vex'Drelm, CMO** (`s2_hierarchy_cmo_vex_drelm`) | 5/7 | dispel | ability-driven | `s2_hierarchy/c_suite.ts` |
| 8 | **Skarn-Iterate, CTO** (`s2_hierarchy_cto_skarn_iterate`) | 5/8 | — | ability-driven | `s2_hierarchy/c_suite.ts` |

## Upgrade workflow

For each card the designer reviews:

1. **Confirm the deviation is intentional.** Check the abilities + keywords against current playtest data. If the stat profile is wrong, rebalance and remove the `balanceException` block entirely.
2. **Upgrade the reason.** Replace the auto-classified text with a one-line designer note that names the specific mechanic justifying the deviation (e.g. "Wraith Calder: rebirth keyword effectively doubles HP; printed line under raw curve compensates").
3. **Replace the reviewer.** Change `reviewer: "2026-05-stat-curve-recalibration"` to your name / handle. The string is the audit trail; replacing it signals the entry has been reviewed.
4. **Remove from this doc.** Delete the card's row.

When the table is empty, delete this doc.
