# CDN coverage by category

Per-folder counts so you can see at a glance which subsystems
are fully wired (high coverage %, zero missing) and which are
still drifting (low coverage % means lots of dead CDN files,
high missing count means code expects art that isn't there).

- **coverage %** = `matched / cdn_count` — what fraction of CDN files this code path wires up. Low values are either orphans or generated-at-runtime templates the static scan can't see.
- **shippedness %** = `matched / (matched + missing)` — what fraction of THIS code path's references are actually on the CDN. Low values are ship-blockers.

## `art/`  —  CDN: 9288, matched: 5062, missing: 237

| sub | CDN | matched | orphans | missing | cov % | ship % |
|---|---:|---:|---:|---:|---:|---:|
| `suits` | 2160 | 1080 | 0 | 1 | 50% | 100% ⚠ |
| `cards` | 1179 | 1025 | 154 | 165 | 87% | 86% ⚠ |
| `slideshows` | 1108 | 52 | 1056 | 0 | 5% | 100% ❓ |
| `rooms` | 781 | 654 | 117 | 10 | 84% | 98% ⚠ |
| `fight` | 639 | 605 | 34 | 0 | 95% | 100% |
| `portraits` | 573 | 523 | 49 | 0 | 91% | 100% |
| `cutscenes` | 329 | 8 | 321 | 1 | 2% | 89% ⚠ |
| `overlays` | 180 | 180 | 0 | 0 | 100% | 100% |
| `fighters` | 142 | 0 | 142 | 3 | 0% | 0% ⚠ |
| `guild-cutscenes` | 128 | 0 | 128 | 0 | 0% | 0% ❓ |
| `ui` | 125 | 107 | 15 | 0 | 86% | 100% |
| `expansions` | 124 | 0 | 124 | 0 | 0% | 0% ❓ |
| `eidolons` | 120 | 0 | 120 | 1 | 0% | 0% ⚠ |
| `vfx` | 120 | 26 | 76 | 1 | 22% | 96% ⚠ |
| `cinematics` | 116 | 44 | 72 | 0 | 38% | 100% |
| `cades` | 106 | 53 | 0 | 6 | 50% | 90% ⚠ |
| `characters` | 104 | 104 | 0 | 0 | 100% | 100% |
| `trade-empire` | 73 | 1 | 72 | 0 | 1% | 100% ❓ |
| `terminus` | 71 | 35 | 1 | 1 | 49% | 97% ⚠ |
| `celebration` | 69 | 26 | 17 | 0 | 38% | 100% |
| `destinations` | 68 | 68 | 0 | 0 | 100% | 100% |
| `sprites` | 68 | 68 | 0 | 0 | 100% | 100% |
| `specimens` | 67 | 15 | 37 | 7 | 22% | 68% ⚠ |
| `signature_cards` | 60 | 60 | 0 | 0 | 100% | 100% |
| `mechronis` | 56 | 28 | 0 | 0 | 50% | 100% |
| `trade_empire` | 47 | 25 | 22 | 0 | 53% | 100% |
| `character_sheets` | 43 | 25 | 18 | 0 | 58% | 100% |
| `keyframes` | 41 | 0 | 41 | 0 | 0% | 0% |
| `dmc` | 38 | 19 | 0 | 2 | 50% | 90% ⚠ |
| `lore-gallery` | 34 | 17 | 0 | 1 | 50% | 94% ⚠ |
| `battlefields` | 31 | 0 | 31 | 0 | 0% | 0% |
| `card_game` | 30 | 15 | 15 | 0 | 50% | 100% |
| `opponents` | 30 | 5 | 20 | 0 | 17% | 100% |
| `chapter_cards` | 28 | 28 | 0 | 0 | 100% | 100% |
| `empty-states` | 26 | 13 | 0 | 1 | 50% | 93% ⚠ |
| `spectral` | 26 | 13 | 0 | 1 | 50% | 93% ⚠ |
| `guilds` | 25 | 12 | 1 | 0 | 48% | 100% |
| `prelude` | 25 | 1 | 24 | 0 | 4% | 100% |
| `classrooms` | 24 | 12 | 0 | 0 | 50% | 100% |
| `strain` | 24 | 12 | 0 | 1 | 50% | 92% ⚠ |
| `art_runtime` | 23 | 0 | 23 | 0 | 0% | 0% |
| `arenas` | 19 | 9 | 1 | 1 | 47% | 90% ⚠ |
| `story-icons` | 18 | 9 | 0 | 1 | 50% | 90% ⚠ |
| `vehicles` | 17 | 17 | 0 | 0 | 100% | 100% |
| `seasonal` | 16 | 8 | 0 | 1 | 50% | 89% ⚠ |
| `card-game` | 15 | 6 | 3 | 0 | 40% | 100% |
| `loading` | 15 | 7 | 1 | 0 | 47% | 100% |
| `card_art` | 14 | 0 | 14 | 0 | 0% | 0% |
| `constellations` | 11 | 5 | 1 | 0 | 45% | 100% |
| `gears` | 11 | 5 | 1 | 0 | 45% | 100% |
| `planets` | 9 | 4 | 1 | 0 | 44% | 100% |
| `special-maps` | 9 | 3 | 3 | 0 | 33% | 100% |
| `roadmap` | 8 | 4 | 0 | 1 | 50% | 80% ⚠ |
| `chess` | 7 | 2 | 3 | 0 | 29% | 100% |
| `minigames` | 7 | 3 | 1 | 0 | 43% | 100% |
| `room_overlays` | 7 | 7 | 0 | 0 | 100% | 100% |
| `broadcasts` | 6 | 0 | 6 | 0 | 0% | 0% |
| `logos` | 6 | 2 | 2 | 0 | 33% | 100% |
| `soul-stones` | 6 | 3 | 0 | 1 | 50% | 75% ⚠ |
| `art_reference` | 5 | 0 | 5 | 0 | 0% | 0% |
| `manuscript_vault` | 4 | 4 | 0 | 0 | 100% | 100% |
| `misc` | 4 | 0 | 4 | 0 | 0% | 0% |
| `casino` | 2 | 1 | 0 | 0 | 50% | 100% |
| `crew` | 2 | 1 | 0 | 0 | 50% | 100% |
| `duel` | 2 | 1 | 1 | 0 | 50% | 100% |
| `td` | 2 | 1 | 0 | 0 | 50% | 100% |
| `pet-battles` | 1 | 0 | 1 | 0 | 0% | 0% |
| `pvp` | 1 | 0 | 1 | 0 | 0% | 0% |
| `ship` | 1 | 1 | 0 | 0 | 100% | 100% |
| `station` | 1 | 0 | 1 | 0 | 0% | 0% |
| `trade` | 1 | 0 | 1 | 0 | 0% | 0% |
| `(root)` | 0 | 0 | 0 | 1 | 0% | 0% ⚠ |
| `bodies` | 0 | 0 | 0 | 4 | 0% | 0% ⚠ |
| `dischordian-logic` | 0 | 0 | 0 | 1 | 0% | 0% ⚠ |
| `recruits` | 0 | 0 | 0 | 24 | 0% | 0% ⚠ |

## `audio/`  —  CDN: 2750, matched: 104, missing: 8

| sub | CDN | matched | orphans | missing | cov % | ship % |
|---|---:|---:|---:|---:|---:|---:|
| `elara` | 1214 | 0 | 1214 | 0 | 0% | 0% ❓ |
| `human` | 807 | 0 | 807 | 0 | 0% | 0% ❓ |
| `episodes` | 209 | 0 | 209 | 0 | 0% | 0% ❓ |
| `antiquarian` | 73 | 0 | 73 | 1 | 0% | 0% ⚠ |
| `act3` | 65 | 0 | 65 | 0 | 0% | 0% ❓ |
| `guild-cutscenes` | 62 | 0 | 62 | 0 | 0% | 0% ❓ |
| `acts` | 44 | 5 | 39 | 1 | 11% | 83% ⚠ |
| `romance` | 42 | 0 | 42 | 0 | 0% | 0% |
| `music` | 37 | 9 | 28 | 0 | 24% | 100% |
| `cades` | 29 | 29 | 0 | 2 | 100% | 94% ⚠ |
| `act2` | 26 | 20 | 6 | 0 | 77% | 100% |
| `act5` | 24 | 0 | 24 | 0 | 0% | 0% |
| `act7` | 21 | 0 | 21 | 0 | 0% | 0% |
| `stage_music` | 15 | 0 | 15 | 0 | 0% | 0% |
| `ambient` | 14 | 9 | 5 | 0 | 64% | 100% |
| `sfx` | 12 | 0 | 12 | 0 | 0% | 0% |
| `outergroove` | 11 | 11 | 0 | 0 | 100% | 100% |
| `encounters` | 10 | 0 | 10 | 0 | 0% | 0% |
| `album1` | 9 | 9 | 0 | 3 | 100% | 75% ⚠ |
| `act4` | 8 | 0 | 8 | 0 | 0% | 0% |
| `chess_sfx` | 6 | 6 | 0 | 0 | 100% | 100% |
| `act1` | 3 | 3 | 0 | 0 | 100% | 100% |
| `voice_barks` | 3 | 0 | 3 | 0 | 0% | 0% |
| `prelude` | 2 | 2 | 0 | 0 | 100% | 100% |
| `prince` | 2 | 0 | 2 | 0 | 0% | 0% |
| `locke` | 1 | 0 | 1 | 0 | 0% | 0% |
| `songs` | 1 | 1 | 0 | 0 | 100% | 100% |
| `chess_tutorial` | 0 | 0 | 0 | 1 | 0% | 0% ⚠ |

## `backgrounds/`  —  CDN: 1, matched: 1, missing: 0

| sub | CDN | matched | orphans | missing | cov % | ship % |
|---|---:|---:|---:|---:|---:|---:|
| `room-archives.webp` | 1 | 1 | 0 | 0 | 100% | 100% |

## `cabin-art/`  —  CDN: 43, matched: 0, missing: 0

| sub | CDN | matched | orphans | missing | cov % | ship % |
|---|---:|---:|---:|---:|---:|---:|
| `items` | 35 | 0 | 35 | 0 | 0% | 0% |
| `backgrounds` | 8 | 0 | 8 | 0 | 0% | 0% |

## `casino/`  —  CDN: 65, matched: 0, missing: 0

| sub | CDN | matched | orphans | missing | cov % | ship % |
|---|---:|---:|---:|---:|---:|---:|
| `game_tables` | 14 | 0 | 14 | 0 | 0% | 0% |
| `effects` | 11 | 0 | 11 | 0 | 0% | 0% |
| `environmental` | 9 | 0 | 9 | 0 | 0% | 0% |
| `environments` | 8 | 0 | 8 | 0 | 0% | 0% |
| `degen` | 7 | 0 | 7 | 0 | 0% | 0% |
| `props_chips` | 7 | 0 | 7 | 0 | 0% | 0% |
| `interaction` | 5 | 0 | 5 | 0 | 0% | 0% |
| `trust` | 4 | 0 | 4 | 0 | 0% | 0% |

## `characters/`  —  CDN: 146, matched: 15, missing: 0

| sub | CDN | matched | orphans | missing | cov % | ship % |
|---|---:|---:|---:|---:|---:|---:|
| `gamemaster` | 7 | 1 | 6 | 0 | 14% | 100% |
| `agent_zero` | 6 | 1 | 5 | 0 | 17% | 100% |
| `degen` | 6 | 1 | 5 | 0 | 17% | 100% |
| `iron_lion` | 6 | 1 | 5 | 0 | 17% | 100% |
| `seer` | 6 | 1 | 5 | 0 | 17% | 100% |
| `shadow_tongue` | 6 | 1 | 5 | 0 | 17% | 100% |
| `watcher` | 6 | 1 | 5 | 0 | 17% | 100% |
| `adjudicator_locke` | 5 | 0 | 5 | 0 | 0% | 0% |
| `architect` | 5 | 0 | 5 | 0 | 0% | 0% |
| `cades` | 5 | 0 | 5 | 0 | 0% | 0% |
| `collector` | 5 | 0 | 5 | 0 | 0% | 0% |
| `eidola` | 5 | 0 | 5 | 0 | 0% | 0% |
| `elara` | 5 | 2 | 3 | 0 | 40% | 100% |
| `engineer` | 5 | 0 | 5 | 0 | 0% | 0% |
| `enigma` | 5 | 0 | 5 | 0 | 0% | 0% |
| `eyes` | 5 | 0 | 5 | 0 | 0% | 0% |
| `kael_recruiter` | 5 | 0 | 5 | 0 | 0% | 0% |
| `matrikala` | 5 | 0 | 5 | 0 | 0% | 0% |
| `minnie` | 5 | 5 | 0 | 0 | 100% | 100% |
| `necromancer` | 5 | 0 | 5 | 0 | 0% | 0% |
| `nilmorg` | 5 | 0 | 5 | 0 | 0% | 0% |
| `programmer` | 5 | 0 | 5 | 0 | 0% | 0% |
| `the_antiquarian` | 5 | 0 | 5 | 0 | 0% | 0% |
| `the_human` | 5 | 1 | 4 | 0 | 20% | 100% |
| `the_meme` | 5 | 0 | 5 | 0 | 0% | 0% |
| `the_source` | 5 | 0 | 5 | 0 | 0% | 0% |
| `warlord` | 5 | 0 | 5 | 0 | 0% | 0% |
| `.DS_Store` | 1 | 0 | 1 | 0 | 0% | 0% |
| `_inventory.json` | 1 | 0 | 1 | 0 | 0% | 0% |
| `conexus_authority` | 1 | 0 | 1 | 0 | 0% | 0% |

## `games/`  —  CDN: 24, matched: 2, missing: 0

| sub | CDN | matched | orphans | missing | cov % | ship % |
|---|---:|---:|---:|---:|---:|---:|
| `cades-fps` | 15 | 1 | 14 | 0 | 7% | 100% |
| `circuit` | 9 | 1 | 8 | 0 | 11% | 100% |

## `music/`  —  CDN: 6, matched: 6, missing: 1

| sub | CDN | matched | orphans | missing | cov % | ship % |
|---|---:|---:|---:|---:|---:|---:|
| `dmc` | 6 | 6 | 0 | 1 | 100% | 86% ⚠ |

## `nilmorg-portraits/`  —  CDN: 5, matched: 0, missing: 0

| sub | CDN | matched | orphans | missing | cov % | ship % |
|---|---:|---:|---:|---:|---:|---:|
| `nilmorg_amused.png` | 1 | 0 | 1 | 0 | 0% | 0% |
| `nilmorg_disappointed.png` | 1 | 0 | 1 | 0 | 0% | 0% |
| `nilmorg_neutral.png` | 1 | 0 | 1 | 0 | 0% | 0% |
| `nilmorg_pleased.png` | 1 | 0 | 1 | 0 | 0% | 0% |
| `nilmorg_threatening.png` | 1 | 0 | 1 | 0 | 0% | 0% |

## `page-backgrounds/`  —  CDN: 12, matched: 0, missing: 0

| sub | CDN | matched | orphans | missing | cov % | ship % |
|---|---:|---:|---:|---:|---:|---:|
| `ACH-001_achievement-vault.jpg` | 1 | 0 | 1 | 0 | 0% | 0% |
| `BTP-001_season-command.jpg` | 1 | 0 | 1 | 0 | 0% | 0% |
| `CDX-001_archive-room.jpg` | 1 | 0 | 1 | 0 | 0% | 0% |
| `CHR-001_operative-dossier.jpg` | 1 | 0 | 1 | 0 | 0% | 0% |
| `CMP-001_companion-quarters.jpg` | 1 | 0 | 1 | 0 | 0% | 0% |
| `DPL-001_negotiation-chamber.jpg` | 1 | 0 | 1 | 0 | 0% | 0% |
| `GLD-001_guild-hall.jpg` | 1 | 0 | 1 | 0 | 0% | 0% |
| `INV-001_cargo-hold.jpg` | 1 | 0 | 1 | 0 | 0% | 0% |
| `MKT-001_marketplace.jpg` | 1 | 0 | 1 | 0 | 0% | 0% |
| `QST-001_mission-briefing.jpg` | 1 | 0 | 1 | 0 | 0% | 0% |
| `SET-001_system-terminal.jpg` | 1 | 0 | 1 | 0 | 0% | 0% |
| `STR-001_requisition-terminal.jpg` | 1 | 0 | 1 | 0 | 0% | 0% |

## `path/`  —  CDN: 0, matched: 0, missing: 1

| sub | CDN | matched | orphans | missing | cov % | ship % |
|---|---:|---:|---:|---:|---:|---:|
| `(root)` | 0 | 0 | 0 | 1 | 0% | 0% ⚠ |

## `vfx-atlases/`  —  CDN: 21, matched: 0, missing: 0

| sub | CDN | matched | orphans | missing | cov % | ship % |
|---|---:|---:|---:|---:|---:|---:|
| `acts` | 21 | 0 | 21 | 0 | 0% | 0% |

## `videos/`  —  CDN: 312, matched: 67, missing: 3

| sub | CDN | matched | orphans | missing | cov % | ship % |
|---|---:|---:|---:|---:|---:|---:|
| `guild-cutscenes` | 47 | 0 | 47 | 0 | 0% | 0% |
| `acts` | 43 | 5 | 38 | 0 | 12% | 100% |
| `prelude` | 25 | 9 | 16 | 0 | 36% | 100% |
| `epochs` | 21 | 14 | 7 | 0 | 67% | 100% |
| `fight-intros` | 21 | 0 | 21 | 0 | 0% | 0% |
| `vfx` | 21 | 0 | 21 | 0 | 0% | 0% |
| `game-modes` | 15 | 5 | 10 | 0 | 33% | 100% |
| `confession_close` | 14 | 0 | 14 | 0 | 0% | 0% |
| `cinematics` | 13 | 0 | 13 | 0 | 0% | 0% |
| `dmc` | 13 | 10 | 3 | 1 | 77% | 91% ⚠ |
| `discoveries` | 12 | 12 | 0 | 0 | 100% | 100% |
| `awakening` | 10 | 0 | 10 | 0 | 0% | 0% |
| `features` | 9 | 0 | 9 | 0 | 0% | 0% |
| `title` | 9 | 8 | 1 | 1 | 89% | 89% ⚠ |
| `wheel_reactions` | 6 | 0 | 6 | 0 | 0% | 0% |
| `dlc_mystery` | 5 | 0 | 5 | 0 | 0% | 0% |
| `events` | 5 | 0 | 5 | 0 | 0% | 0% |
| `music` | 5 | 0 | 5 | 0 | 0% | 0% |
| `prestige` | 5 | 0 | 5 | 0 | 0% | 0% |
| `human_reveal` | 4 | 0 | 4 | 0 | 0% | 0% |
| `act1` | 3 | 3 | 0 | 0 | 100% | 100% |
| `cutscenes` | 3 | 0 | 3 | 0 | 0% | 0% |
| `openings` | 2 | 1 | 1 | 0 | 50% | 100% |
| `transmissions` | 1 | 0 | 1 | 0 | 0% | 0% |
| `arena-intros` | 0 | 0 | 0 | 1 | 0% | 0% ⚠ |

## `vo/`  —  CDN: 45, matched: 0, missing: 0

| sub | CDN | matched | orphans | missing | cov % | ship % |
|---|---:|---:|---:|---:|---:|---:|
| `act6` | 15 | 0 | 15 | 0 | 0% | 0% |
| `act3` | 14 | 0 | 14 | 0 | 0% | 0% |
| `act7` | 11 | 0 | 11 | 0 | 0% | 0% |
| `act2` | 3 | 0 | 3 | 0 | 0% | 0% |
| `prestige` | 2 | 0 | 2 | 0 | 0% | 0% |

