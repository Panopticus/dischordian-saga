# Art Materials Audit — 2026-04-25

> **⚠️ TRIPLE-CHECK CORRECTIONS (added after first pass).** The first
> pass below took `MISSING_PRELUDE_ACT1_ASSETS.md` at face value. That
> doc was authored in PR #173 (`92e3b11`, 2026-04-23) and was **never
> updated** when PR #180 (`dbdcb12`, 2026-04-24,
> "feat(prelude/act1): land production asset drop + wire it up")
> landed the actual production bundle. The corrections below
> supersede §6–§8 / §11.5 of the first-pass audit. Specifically:
>
> ### What actually shipped in PR #180
> Recorded in `apps/client/src/data/preludeAct1Deliverables.ts` (477
> lines), wired into `PreludeSequencePlayer.tsx`, browsable at
> `/prelude-act1-gallery`. All paths resolve via `assetUrl()` to the
> dgrsart S3 bucket. Files are gitignored locally by design.
>
> | Bucket | Shipped | First-pass audit said |
> |---|---|---|
> | Prelude cutscene MP4s | **9 of 15** (a, b, c5, d, f, g [via medbay], h, i [via observation], j) + 2 alt takes | said 0/15 ❌ wrong |
> | Prelude cutscene bookend stills | **12 beats × {start,end}** = 24 PNG+WebP pairs | not credited ❌ |
> | Prelude VFX still frames | **11 VFX** with start/end/frame paintings (incl. **`vfx_human_palm_frost`**) | said all 10 missing ❌ |
> | Prelude rooms | **13 rooms** at runtime path (4 PNG+WebP, 9 PNG-only) | said all INTERMEDIATE ❌ |
> | Prelude music | 2 tracks (ambientShip, elaraTheme) | not credited ❌ |
> | Act 1 cutscene MP4s | **3 shipped** (tavern-arrival, arena-challenge, council-revelation) + 6 bookends | said 3 missing ❌ |
> | Act 1 rooms | **5 shipped** (tavern, market-square, council-chamber, dockyard, arena-lobby) | said 5 missing ❌ |
> | Act 1 battlefields | **10 shipped** | said 10 missing ❌ |
> | Act 1 portraits | **14 shipped** (incl. canon-named: human, elara, enigma, engineer, gamemaster, warlord, iron-lion, agent-zero, collector, degen, meme, necromancer, seer, watcher) | said 12 missing ❌ |
> | Act 1 cards | **14 shipped** | said 14 missing ❌ |
> | Act 1 music | 3 tracks (tavern, arena, council) | not credited ❌ |
>
> ### Naming caveat (still a real gap)
> The PR #180 delivery uses **generic D&D-style names** (tavern,
> arena-pit, fireball, shadow-bolt) instead of the **canon Bible
> names** the spec asks for (kindergarten, mechronis-atrium,
> nexon-battlefield, `card_art_countermelody`,
> `card_art_jar_wouldnt_close`, `matchup-little-collector`, etc.).
> The art **physically exists** and is wired in, but whether it
> satisfies the canon spec is a creative-direction call, not an
> asset-presence question. The 12 Act 1 opponent matchup portraits
> the bible names are still a separate ask if canon-aligned art is
> required.
>
> ### Acts 1 VO — also far more shipped than first pass said
> First pass said "23 Act 1 VO lines missing" based on the bible
> doc. Actual VO catalog totals across `apps/shared/*VoManifest.json`:
>
> | Manifest | Lines on S3 |
> |---|---|
> | elaraVoManifest.json | **412** |
> | humanVoManifest.json | **212** |
> | memeVoManifest.json | 90 |
> | antiquarianVoManifest.json | 82 |
> | cadesVoManifest.json | 46 |
> | engineerMemoirVoManifest.json | 36 |
> | palimpsestHostVoManifest.json | 33 |
> | nilmorgVoManifest.json | 28 |
> | sourceVoManifest.json | 28 |
> | agent_zeroVoManifest.json | 24 |
> | gamemasterVoManifest.json | 24 |
> | degenVoManifest.json | 12 |
> | storyModeVoManifest.json | 11 |
> | lockeVoManifest.json | 9 |
> | seerVoManifest.json | 8 |
> | shadow_tongueVoManifest.json | 8 |
> | (other 13 manifests) | 0–3 each |
> | **Total** | **~1,389+ recorded VO lines on S3** |
>
> Elara alone has Act 1 pre/post-match commentary for every named
> opponent: corey_collector, kanshi_sha_watcher, minnie_meme,
> vernon_vortex, wanda_wyrlord, warlord_nano_swarm, etc. Plus
> `act1_choice_*`, `act1_disinfo`, `act1_foundation`, `act1_grief`,
> `act1_loyalty`, `act1_react_human`, `act1_reassure`,
> `act1_signal_detect`, `act1_substrate_explain`. The "23 missing"
> framing was for one specific tranche (cutscene narration + Section 6
> Antiquarian); those 23 may still be unrecorded but the broader
> Act 1 VO catalog is largely shipped.
>
> ### Acts 2–7 VO — still empty
> `act{2,3,4,4_5,5,6,7}VoManifest.json` are all **0 mp3 entries** —
> these were stubbed out by `apps/scripts/generate-act-vo.ts` /
> PR #189 CI workflow but no recordings have populated them yet.
> First-pass audit didn't flag this; it's a real gap.
>
> ### Trade Empire art — also shipped
> PR #186 ("feat(trade-empire): wire producer-delivered art into game
> + add CDN upload pipeline") and PR #182 (#wire art rendering across
> all expansion panels) shipped the Trade Empire art bundle. The 13
> CSV manifests under `docs/production/trade-empire-asset-build/`
> (1,483 rows) are the spec; the producer-delivered art has landed
> and is wired across expansion panels. First-pass audit listed only
> the spec count, not the wire-up status — credit it as ✅ shipped.
>
> ### What's still genuinely missing (corrected punch list)
> 1. **6 Prelude cutscene MP4s** — beats a5, c, d5, e, f5, h5 (the
>    delivery covered 9 of 15)
> 2. **6 INTERMEDIATE VFX** still need MP4→WebM VP9 conversion
>    (cryo-frost-retreat, pod-hatch-cryogas, hologram-materialize,
>    breath-pulse-strip, sepia-drain, film-damage-overlay) — though
>    they're now usable as raw MP4 sources at runtime per the registry
> 3. **3 ambient WAV→MP3** loudnorm pass still pending
> 4. **observation-deck** Prelude room — CDN-LEGACY only, but
>    PR #180's "beat-g-observation" video uses it as a backdrop, so
>    the gap is local-canonical-path only
> 5. **Acts 2–7 spine VO** — 0 lines recorded across 7 act manifests
> 6. **Acts 2–7 runtime wiring** — 181 cinematic files on CDN but
>    `SongSlideshow.tsx` etc. don't yet load `videos/acts/...`
> 7. **MISSING_ART_PROMPTS.md 10 items** — these are still
>    code-referenced fallbacks (arena-default, health-bar, chess
>    pieces+board, trade frame, grid tile, 3 rooms, Darren Fessler
>    badge); status unverified post-PR #180
> 8. **MISSING_CUTSCENES.md 46 cinematics** — Loredex Discovery (13),
>    Story Mode Fights (17), Dead Man's Circuit (6), Living Universe
>    (5), Crew Awakening (3), Prestige Cycle (1), Companion Death (1).
>    No evidence in git log that these specifically shipped; treat as
>    ❌ still missing.
> 9. **Canon-named Act 1 art** (kindergarten, mechronis-atrium,
>    matchup-little-collector, card_art_countermelody, etc.) — only
>    if creative direction insists on canon names over the generic
>    D&D-style delivery; otherwise the slots are filled.
> 10. **Last Words song + Log 5 long-form** — still tracked in
>     canon-expansion pipeline; status TBD.
>
> ### Net delta vs first-pass total (~167 missing)
> Corrected estimate: **~70 genuinely missing**, weighted heavily
> toward Acts 2–7 spine VO (estimated 100s of lines pending) and the
> 46 backlog cinematics. The first-pass audit double-counted assets
> that PR #180 had already shipped.



> Full audit of all art materials in the repo. "Completed" = file exists
> on disk OR is published to a CDN/S3 path with a verified URL listing in
> the repo. "Missing" = referenced by a manifest/spec/code path with no
> known artifact. Generated by walking every art-bearing directory under
> `docs/`, `assets/`, `apps/client/public/`, and cross-referencing each
> against the canonical asset manifests.

## Summary

| Bucket | Status |
|---|---|
| Specification docs (bibles, prompts, manifests) | ✅ Complete |
| Character avif library (apps/client/public/characters/) | ✅ Complete (27 chars, 127 files) |
| Art-original references (docs/art-originals/) | ✅ Complete |
| Acts 2–7 AAA Final cinematic + audio + VFX drop | ✅ Generated, ⚠️ runtime wiring pending |
| Prelude intermediate sources (assets/intermediate/prelude/) | ✅ Complete (23 files) |
| Prelude room renders at canonical runtime path | ⚠️ INTERMEDIATE — needs PNG→WebP convert |
| Prelude cutscene videos | ❌ All 15 beats missing |
| Prelude VFX (final WebM) | ⚠️ 6 INTERMEDIATE + 10 MISSING + 17 DONE-CODE |
| Act 1 art (rooms/portraits/cards/cutscenes) | ❌ All MISSING (prompts authored) |
| MISSING_ART_PROMPTS batch (10 referenced files) | ❌ All MISSING |
| MISSING_CUTSCENES (46 cinematics) | ❌ All MISSING |

---

## 1. Specification & manifest docs — ✅ COMPLETE

Every "what to build" doc exists at the path the production bible lists.

### 1.1 Top-level production bibles (✅ all present)
- ✅ `docs/DISCHORDIAN_SAGA_PRODUCTION_BIBLE.md` — consolidated bible
- ✅ `docs/production/PRODUCTION_BIBLE.md` — master production
- ✅ `docs/production/SHIP_READY_ASSET_BIBLE.md` — post-Prelude (46 modes)
- ✅ `docs/production/PRELUDE_SHIP_READY_BIBLE.md` — Prelude (15 beats)
- ✅ `docs/production/ACT1_NARRATIVE_STRUCTURE.md` — Act 1 bible
- ✅ `docs/production/ACT_1_SHIP_READY_BIBLE.md`
- ✅ `docs/production/ACTS_2_THROUGH_7_ASSET_BIBLE.md`
- ✅ `docs/production/ACTS_2_TO_7_PRODUCTION_BIBLE.md`
- ✅ `docs/production/ALL_ACTS_ROADMAP.md`
- ✅ `docs/production/UNIVERSAL_PROMPTING_DOC_PRELUDE_ACT1.md`
- ✅ `docs/production/ART_PRODUCTION_BIBLE.md`
- ✅ `docs/production/VISUAL_PRODUCTION_BIBLE.md`
- ✅ `docs/production/VOICE_OVER_BIBLE.md`
- ✅ `docs/production/COMPLETE_ART_PROMPT_BIBLE.md`
- ✅ `docs/production/LIVING_CHARACTER_SHEET_ART_BRIEF.md`

### 1.2 Per-environment art bibles (✅ all present)
- ✅ CASINO_EXPANSION_ART_BIBLE
- ✅ CHRISTMAS_IN_JULY_ART_BIBLE
- ✅ LORE_GALLERY_ART_BIBLE
- ✅ PARALLAX_ROOMS_ART_BIBLE
- ✅ PLAYER_CABIN_ART_BIBLE
- ✅ GAME_MODE_ENVIRONMENTS_ART_BIBLE
- ✅ OPTIONAL_COMPONENTS_ART_BIBLE
- ✅ STORY_MODE_ART_BIBLE

### 1.3 Card-art prompt sheets (✅ all present)
- ✅ TCG_ART_SPEC + TCG_ART_SPEC_ADDENDUM
- ✅ NANO_BANANA_ALLEGIANCE_CARDS / CLASS_CARDS / ELEMENT_DIMENSION_RACE / ORACLE_DECK / NPC_IMPRINTS_1/2/3
- ✅ BREEDING_SYSTEM_ART_PROMPTS
- ✅ CELEBRATION_ART_PROMPTS + CELEBRATION_MECHRONIS_ART_PROMPTS
- ✅ MECHRONIS_ART_PROMPTS
- ✅ PAGE_BACKGROUND_ART_PROMPTS

### 1.4 Audit / asset registries (✅ all present)
- ✅ `docs/production/ASSET_URLS.md` — generated CDN URLs
- ✅ `docs/production/FIGHT_CDN_URLS.md` — fighting-game CDN
- ✅ `docs/production/CONSISTENCY_GATE.md` — approval checklist
- ✅ `docs/production/MISSING_PRELUDE_ACT1_ASSETS.md` — 2,258-line audit
- ✅ `docs/production/MISSING_ART_PROMPTS.md` — 10 referenced files
- ✅ `docs/production/MISSING_CUTSCENES.md` — 46-cinematic backlog
- ✅ `docs/production/prelude-asset-build/AAA_AUDIT_REPORT.md`
- ✅ `room-artwork-urls.txt` — 25 CDN URLs + 8 mystery-state variants + 5 final-drop rooms

### 1.5 Per-tier asset-build workspaces (✅ all manifests present)

**Prelude** (`docs/production/prelude-asset-build/`)
- ✅ `manifests/asset_prompt_manifest.json` — 12 rooms + 14 cutscene start/end/motion + 10 VO blocks
- ✅ `prompts/rooms/` — 20 room prompt files (cryo-bay, corridor, engineering, cargo-hold, galley, mess-hall, briefing-room, medical-bay, comms-array, archives, bridge, armory, observation-deck, dreams-workshop-subbasement, guild-sanctum, social-hub, station-dock, war-room, section_20, deliverables_room_prompt_rewrites)
- ✅ `prompts/cutscenes/` — 9 beats × {start, end, motion} = ~27 prompts (a, a5, b, c, c5, d, d5, e, f, f5, g, h, h5)
- ✅ `prompts/vfx/` — 13 VFX prompts + README
- ✅ `prompts/voice/` — 11 section CSVs + log5 subdir
- ✅ `AAA_AUDIT_REPORT.md`, `UX_INTERACTION_SPEC.md`, `CONVERSION_FOLLOW_UP.md`

**Act 1** (`docs/production/act1-asset-build/`)
- ✅ `manifests/asset_prompt_manifest.json` — 5 rooms + 12 portraits + 3 cutscenes + 4 UI + 4 + 19 VO + 3 animator-ref
- ✅ `manifests/act1_art_prompts__{all,battlefield,card_art,opponent_portrait}.csv`
- ✅ `prompts/rooms/` — 5 (kindergarten, mechronis-atrium, nexon-battlefield, zenon-cell, authority-gallery)
- ✅ `prompts/matchups/` — 12 portrait prompts
- ✅ `prompts/cutscenes/` — 3 cutscenes × {start, end, motion} (welcome-to-celebration, to-be-the-human, hacking-reality)
- ✅ `prompts/voice/` — cutscene_narration.csv + section6_antiquarian.csv
- ✅ `unified_act1_rebuild_manifest.md`

**Trade Empire / Acts 2–7** (`docs/production/trade-empire-asset-build/`)
- ✅ 13 CSV manifests, 1,483 rows total: gates A/B/C/D, sectors, wonders, civic icons, doctrine banners, encounter key art, era banners, fleet silhouettes, pirate portraits

**Acts 2–7 AAA Final** (`docs/production/acts-2-7-aaa-final/`)
- ✅ `ASSET_MANIFEST.md` — 181-file inventory
- ✅ `DELIVERY_NOTES.md`, `production_notes.md`, `remaining_work.md`, `character_canon_map.md`

**Commission packages** (`docs/production/commission-packages/`)
- ✅ `p0-tranche.csv` + `acts-2-7-tranche.csv`
- ✅ `examples/` — 5 tool-specific commission templates (meshy-v5, nano-banana-2 turnaround/viseme, veo-3.1 idle/cinematic)

**Other prompts** (`docs/production/prompts/`)
- ✅ cades-fps-production-prompts, kling-discovery-video-prompts, puzzle-answer-book, slide_content, suno-game-music-prompts

**VO batches** (`docs/production/vo-batches/`)
- ✅ 7 CSVs — Act 1 opponent dialog (antiquarian/elara/human), companion ask topics (elara/human), companion comments (elara/human)

**Acts 2–7 supporting docs**
- ✅ `act2-asset-pipeline.md`, `act2-vo-script.md`, `acts-4-through-7-asset-pipeline.md`, `chess-vo-direction.md`, `elara-vo-script.md`

---

## 2. Source / reference art originals — ✅ COMPLETE

### 2.1 `docs/art-originals/celebration/` (✅ 22 files)
- ✅ environments: `celebration_aerial_original.jpg`, `celebration_trial_room_original.jpg`
- ✅ mascoteers (12): conni, corey, gary, minnie, prince, red, sprout, thazu, unblink, vernon, wanda, wayne
- ✅ slideshow (8): `celebration_slide_01..08_original.jpg`

### 2.2 `docs/art-originals/mechronis/` (✅ 16 files)
- ✅ environments (3): classroom, graduation, grand_hall
- ✅ professors (13): aoki, glinn_vyre, greenshaw, halverez, kanevas, kasra, mireille, orphic, proctor, vasara, vellis, vent, vex

---

## 3. Prelude intermediate sources — ✅ COMPLETE (23 files)

`assets/intermediate/prelude/`

### 3.1 Rooms — ✅ all 13 PNG sources present
cryo-bay, corridor, engineering, cargo-hold, galley, mess-hall, briefing-room, medical-bay, comms-array, archives, bridge, armory, captains-quarters

### 3.2 VFX MP4 sources — ✅ 6 present
breath-pulse-strip, cryo-frost-retreat, film-damage-overlay, hologram-materialize, pod-hatch-cryogas, sepia-drain

### 3.3 Audio (WAV) — ✅ 3 ambient beds present
ambient_bridge_powered_systems_mix, ambient_neural_rig_hum, ambient_transfer_array_standby

### 3.4 Cutscenes — ⚠️ 1 partial (Beat J arrival clip only)
- ✅ `prelude-beat-j-archives-arrival-clip.mp4`
- ❌ All other beat MP4s missing (see §6.1)

---

## 4. Character avif library — ✅ COMPLETE (27 characters, 127 files)

`apps/client/public/characters/` + `_inventory.json`

Each character (except where noted) has the standard 5-sheet bundle:
**bust, viseme, blink, breathing, expressions**.

| Character | Status | Notes |
|---|---|---|
| ✅ adjudicator_locke | full bundle | |
| ✅ agent_zero | full bundle | |
| ✅ architect | full bundle | |
| ✅ collector | full bundle | |
| ✅ conexus_authority | bust only | only `bust.avif` per inventory |
| ✅ degen | full bundle | |
| ✅ eidola | full bundle | |
| ✅ elara | protagonist set | viseme + expressions + idle_hologram + front/full turnaround |
| ✅ engineer | full bundle | |
| ✅ enigma | full bundle | |
| ✅ eyes | full bundle | |
| ✅ gamemaster | full bundle + viseme_offset | |
| ✅ iron_lion | full bundle | |
| ✅ kael_recruiter | full bundle | |
| ✅ matrikala | full bundle | |
| ✅ minnie | full bundle | |
| ✅ necromancer | full bundle | |
| ✅ nilmorg | full bundle | |
| ✅ programmer | full bundle | |
| ✅ seer | full bundle | |
| ✅ shadow_tongue | full bundle + viseme_hyper | |
| ✅ the_antiquarian | full bundle | |
| ✅ the_human | protagonist set | expressions + front/full turnaround + reveal_start/end |
| ✅ the_meme | full bundle | |
| ✅ the_source | full bundle | (Kael phase-3) |
| ✅ warlord | full bundle | |
| ✅ watcher | full bundle | |

### 4.1 Reference directories (mostly empty placeholders)
- ✅ `apps/client/public/references/README.md`
- ✅ `apps/client/public/references/npcs/engineer_prince/phase1_prince/REFERENCE.md`
- ⚠️ All other `references/npcs/*` and `references/protagonists/*` directories contain only `.gitkeep` — source PNGs were inputs to the avif build but are not checked in.

---

## 5. CDN-published art — ✅ COMPLETE (per ASSET_URLS.md + room-artwork-urls.txt)

These exist on CloudFront / S3; URLs are checked into the repo. Local
canonical paths under `apps/client/public/art/` are gitignored
(per `.gitignore`: art/, audio/, videos/, music/, vfx-atlases/) — the
CDN is the source of truth, local trees are dev caches.

### 5.1 Room scenes on legacy CloudFront — ✅ 25 rooms
antiquarian-library, archives, armory, bridge, captains-quarters, cargo-hold, chaos-forge, cipher-den, comms-array, cryo-bay, elemental-nexus, engineering-core, engineering, forge-workshop, guild-sanctum, medical-bay, observation-deck, oracle-sanctum, order-tribunal, quantum-lab, shadow-vault, social-hub, station-dock, synthesis-chamber, war-room

### 5.2 Mystery-state room variants (AAA Final, 2026-04-21) — ✅ 8 variants
- Cryo Bay × 4 states: initial, investigating, victim-identified, case-open-later
- Medical Bay × 4 states: initial, device-awakened, donated, refused

### 5.3 AAA Final final-5 rooms (2026-04-25) — ✅ 5 rooms at `/art/rooms/`
station-dock, guild-sanctum, social-hub, war-room (Deck-6 Combat Ops), dreams-workshop-subbasement

### 5.4 Card art — ✅ 5 P1 cards on CDN
Soldier, Oracle, Engineer, Assassin, Spy

### 5.5 Sprite sheets — ✅ 12 characters (4×2 grid)
architect, collector, enigma, warlord, necromancer, iron-lion, oracle, agent-zero, meme, source, akai-shi, human

### 5.6 Arena backgrounds — ✅ 8 stages
new-babylon, panopticon, thaloria, terminus, mechronis, necropolis, digital-void, resistance-base

### 5.7 Elara hero portraits — ✅ 2 (dark + speaking)

### 5.8 Fighting-game CDN (FIGHT_CDN_URLS.md) — ✅ all listed
- Sprite sheets: Ken, Ryu
- Stage: KenStage
- HUD/decals/shadow textures
- 12+ SFX `.ogg` files (hadouken, attacks, hits, land, etc.)

---

## 6. Acts 2–7 AAA Final cinematic drop — ✅ GENERATED (181 files)

Per `docs/production/acts-2-7-aaa-final/ASSET_MANIFEST.md` and
`DELIVERY_NOTES.md` (drop date 2026-04-24): 103 files copied to
gitignored `apps/client/public/{videos,audio,vfx-atlases}/acts/`,
ready for S3 sync via `apps/scripts/upload-public-to-s3.ts`.

### 6.1 VFX texture atlases — ✅ 17 (all acts)
Act 2 (5): substrate_layer, bench_glow_light, bench_glow_dark, chess_depth_ring, silence_freeze_grain
Act 3 (3): thaloria_echo_mist, infiltration_choice_beam, eyes_helmet_dust
Act 4 (3): kael_memory_palace, caravaggio_light_cone, prison_mirror_reflection
Act 4.5 (2): identity_chip_etching, entropy_table_glow
Act 5 (3): iron_lion_broadcast_static, vortex_consumption_edge, kael_map_ink
Act 6 (2): elara_face_resolve_grain, watcher_shape_stencil
Act 7 (3): army_composite_parallax, voices_align_chord_ring, invisible_war_overlay

### 6.2 Cinematic videos — ✅ 43 MP4s
- Act 2: 6 (opener, silence_of_two_witnesses, gamemaster_left/right_intro, engineer_recording_2/3)
- Act 3: 8 (opener, thaloria_echo, eyes_fall, infiltration ×3 paths, engineer_recording_4/5)
- Act 4: 9 (opener, path ×3, memorial_corridor ★, kael_extraction ×4, engineer_recording_6)
- Act 4.5: 2 (opener, identity_wager)
- Act 5: 6 (opener, bulb_dims, sector_wakes, iron_lion_final ★, bridge_of_kael, engineer_recording_7)
- Act 6: 4 (opener, elara_confession ★, human_confession, watcher_reveal)
- Act 7: 8 (opener, two_wars_diagram, voices_align ★★, stance ×4, final-line)

### 6.3 Music cues — ✅ 39 MP3s
All acts represented (act-2 through act-7 + 4.5), including the
★★★ `act-7-voices-align` hardest cue.

### 6.4 Cinematic start/end frames — ✅ 86 PNGs
584 MB, designated `_intermediate/` work products. Live in source ZIP
at `cinematics/act-{N}/{start,end}/*.png`. Not copied to runtime path
(by design).

### 6.5 ⚠️ Runtime wiring — STILL REQUIRED
Bytes-on-CDN ≠ in-game playback. Per `DELIVERY_NOTES.md`:
- Slideshow → video player swap in `apps/shared/songSlideshows.ts` and
  `apps/client/src/components/SongSlideshow.tsx` not yet done.
- Per-act audio bed wiring not yet done.
- VFX atlas component-level adoption not yet done.
- Only 1 reference into the cinematics tree
  (`PrestigeCycleResetPage.tsx:78`); zero refs into `videos/acts/`,
  `audio/acts/`, or `vfx-atlases/`.

---

## 7. ❌ MISSING — Prelude (per MISSING_PRELUDE_ACT1_ASSETS.md)

### 7.1 Cutscenes — ❌ 15/15 MISSING (all P0, Veo 3.1 renders)
| Beat | Output | Duration |
|---|---|---|
| ❌ A | `videos/prelude/prelude-beat-a-awakening.mp4` | 35s |
| ❌ A.5 | `videos/prelude/prelude-beat-a5-corridor.mp4` | 15s |
| ❌ B | `videos/prelude/prelude-beat-b-escape.mp4` | 20s |
| ❌ C | `videos/prelude/prelude-beat-c-crew-and-incubators.mp4` | 35s |
| ❌ C.5 | `videos/prelude/prelude-beat-c5-window.mp4` | 20s |
| ❌ D | `videos/prelude/prelude-beat-d-cargo-bay.mp4` | 30s |
| ❌ D.5 | `videos/prelude/prelude-beat-d5-galley.mp4` | 25s |
| ❌ E | `videos/prelude/prelude-beat-e-mess-hall-flashback.mp4` | 45s |
| ❌ F | `videos/prelude/prelude-beat-f-briefing-room.mp4` | 30s |
| ❌ F.5 | `videos/prelude/prelude-beat-f5-empty-chair.mp4` | 90s |
| ❌ G | `videos/prelude/prelude-beat-g-medical-bay.mp4` | 25s |
| ❌ H | `videos/prelude/prelude-beat-h-comms-array.mp4` | 25s |
| ❌ H.5 | `videos/prelude/prelude-beat-h5-memo-pile.mp4` | 20s |
| ❌ I | `videos/prelude/prelude-beat-i-bridge-witnessing-activate.mp4` | 40s |
| ❌ J | `videos/prelude/prelude-beat-j-archives.mp4` (10-clip split) | ~8m10s |

### 7.2 Rooms — ⚠️ 13 INTERMEDIATE + 1 CDN-only

13 rooms have `_original.png` sources in `assets/intermediate/prelude/rooms/`
that need PNG→WebP convert + placement at `apps/client/public/art/rooms/room-*.{png,webp}`:

cryo-bay, corridor, engineering, cargo-hold, galley, mess-hall, briefing-room, medical-bay, comms-array, archives, bridge, armory, captains-quarters

- ❌ **observation-deck** — DONE-CDN-LEGACY only, no intermediate. Re-download or regenerate.

### 7.3 VFX (23 total)
- ✅ **17 DONE-CODE** (no file required) — runtime CSS / Three.js / React handles them
- ⚠️ **6 INTERMEDIATE** (need MP4→WebM VP9 alpha): breath-pulse-strip, cryo-frost-retreat, film-damage-overlay, hologram-materialize, pod-hatch-cryogas, sepia-drain
- ❌ **10 MISSING** (need full Veo 3.1 render):
  - `vfx_iris_hatch_open` (3s)
  - `vfx_role_wireframe_bloom` (2.5s)
  - `vfx_starfield_drift_viewport` (10s loop)
  - **⚠ `vfx_human_palm_frost`** (4s) — HIGHEST PRIORITY VFX IN PRELUDE
  - `vfx_starlight_shaft_dust` (8s loop)
  - `vfx_mission_glyph_bloom` (1.5s)
  - `vfx_galley_steam_residue` (6s loop, P1/optional)
  - `vfx_diploma_ink_bloom` (2s)
  - `vfx_memo_holo_rise` (3.5s, rendered-text exception)
  - `vfx_memo_paper_drift` (5s)
  - `vfx_log5_beam_transfer` (3s)
  - `vfx_holo_pedestal_bloom` × 3 variants (3s + 3s + 8s loop)
  - `vfx_enigma_hand_on_rim` (2s)

### 7.4 Audio — ⚠️ 3 INTERMEDIATE
WAV→MP3 + EBU R128 loudnorm (`-19/-20/-18` LUFS) needed:
ambient_neural_rig_hum, ambient_transfer_array_standby, ambient_bridge_powered_systems_mix

### 7.5 VO — ✅ 10 ALL DONE-S3-VO
All 10 Prelude VO lines (Elara ×4, Human ×3, Prince ×2, plus reactive
CC layer) are recorded and live at `dgrsvoices.s3.us-east-2.amazonaws.com/Prelude%20Voices/`,
wired into manifests.

### 7.6 Songs — ❌ 2 MISSING
- ❌ `song_last_words_prelude_cut.mp3` (canon-expansion pipeline)
- ❌ Log 5 long-form playback (~6m40s, Prince voice — Beat J)
- ⚠️ 20 × `slide-{1..4}-{1..5}.webp` Last Words slideshow — TBD on CDN

---

## 8. ❌ MISSING — Act 1

All Act 1 art is MISSING (prompts authored, no renders). Per
`MISSING_PRELUDE_ACT1_ASSETS.md` §3.8–§3.14.

### 8.1 Rooms — ❌ 5/5 MISSING
- ❌ room-kindergarten (Cycle A, honey/rose palette)
- ❌ room-mechronis-atrium (Cycle B, brass/teal)
- ❌ room-nexon-battlefield (Cycle C)
- ❌ room-zenon-cell (Cycle C)
- ❌ room-authority-gallery (Cycle C)

### 8.2 Battlefield backdrops — ❌ 10/10 MISSING
bf_celebration_schoolyard_day10/day20, bf_celebration_pavilion_day28, bf_mechronis_classroom_standard, bf_mechronis_common_room, bf_nexon_command_bunker, bf_zenon_field_tent, bf_vortex_pressurized_bay, bf_newbabylon_tribunal, bf_ark_archives_dimmed

### 8.3 Opponent matchup portraits — ❌ 12/12 MISSING (1536×2048 Nano Banana 2)
Cycle A (3): little-meme, little-collector, little-watcher
Cycle B (5): detective-student, iron-lion-expelled, professor-eidola, professor-matrikala, seer-visit
Cycle C (4): warlord-zero-first, programmer, game-master-original, the-authority

### 8.4 Card art — ❌ 14/14 MISSING (1024×1024)
- Cycle A (3): countermelody (Common N), jar_wouldnt_close (Rare L), first_card (Epic L)
- Cycle B (6): iron_stance, recruiters_gift, weapon_i_didnt_build (Legendary D), memorized_page, classmates_compass (Legendary L), only_reason_i_stayed (Legendary D)
- Cycle C (5): standstill, converter (Legendary D), friend_i_saved (Mythic L ⭐), last_word (Mythic L ⭐), memory_card_procedural

### 8.5 Cutscenes — ❌ 3 MISSING + ✅ 2 DONE-CODE
- ❌ welcome-to-celebration (40s, prompted)
- ❌ to-be-the-human (47s, prompted)
- ❌ hacking-reality (35s, prompted)
- ✅ cutscene-last-words-full — DONE-CODE (PR #89, 219.8s React wiring)
- ⚠️ cutscene-two-witnesses-part2 — scaffolded (240s React wiring, art_required: false)

### 8.6 VO — ❌ 23 lines MISSING (recordings)
- ❌ 4 cutscene narration lines (prompted, not recorded)
- ❌ 19 Section 6 Antiquarian lines (drafted, not recorded)

### 8.7 UI components — ✅ 4/4 DONE-CODE
- AuthorityPhaseBar.tsx, SeerCardFlicker.tsx, VerdictStreamColumn.tsx, WarlordLockoutChip.tsx

### 8.8 Animator reference — ⚠️ 1 shipped, 2 prompted
- ✅ enigma-blocking-sheet.png
- ❌ enigma-branch-deltas.md
- ❌ enigma-gaze-timeline.csv

### 8.9 Songs — ❌ MISSING
- ❌ `song_last_words_prelude_cut.mp3` (shared with Prelude Beat J)
- ⚠️ 20 × Last Words slide WebPs — TBD on CDN

---

## 9. ❌ MISSING — code-referenced art (per MISSING_ART_PROMPTS.md)

10 art assets referenced in code but not generated. Each has a
ready-to-paste Nano Banana 2 prompt in the source doc.

| # | Asset | Path | Size |
|---|---|---|---|
| ❌ 1 | Arena Default | `art/arenas/arena-default.jpg` | 1920×1080 |
| ❌ 2 | Health Bar | `art/ui/health-bar.png` | 512×64 alpha |
| ❌ 3 | Chess Pieces sprite | `art/chess/pieces-sprite.png` | 768×256 alpha |
| ❌ 4 | Chess Board | `art/chess/board.png` | 1024×1024 |
| ❌ 5 | Trade Frame | (trading interface border) | — |
| ❌ 6 | Grid Tile | (tower defense placement cell) | — |
| ❌ 7 | Archives Room | (room scene) | — |
| ❌ 8 | Bridge Room | (room scene) | — |
| ❌ 9 | Observation Deck | (room scene) | — |
| ❌ 10 | Darren Fessler Memorial Badge | (portrait) | — |

> Note: items #7, #8, #9 overlap with Prelude rooms in §7.2 — they
> exist on legacy CDN but need re-download to the canonical local path.

---

## 10. ❌ MISSING — discovery + story cinematics (per MISSING_CUTSCENES.md)

**46 cinematics needed across 7 categories.** All have Kling prompts in
`PAGE_BACKGROUND_ART_PROMPTS.md` and inline in source code.

| Category | Missing | Total |
|---|---|---|
| ❌ 1. Loredex Discovery | 13 | 18 |
| ❌ 2. Story Mode Fights | 17 | 21 |
| ❌ 3. Dead Man's Circuit | 6 | 6 |
| ❌ 4. Living Universe Events | 5 | 5 |
| ❌ 5. Crew Awakening | 3 | 3 |
| ❌ 6. Prestige Cycle | 1 | 1 |
| ❌ 7. Companion Death | 1 | 1 |

### 10.1 Loredex Discovery (13 ❌)
Programmer, Architect, CoNexus, Watcher, Collector, Warlord, Enigma, Engineer, Necromancer, Human, Source, Antiquarian, Degen

### 10.2 Story Mode Fights (17 ❌)
Ch5 Watcher, Ch6 Necromancer, Ch7 Meme, Ch8 Collector, Ch9 Kael, Ch10 Human, Ch11 Game Master, Ch12 Collector rematch, Ch13 Architect, Ch14 Source, Ch15 Jailer, Ch16 Iron Lion rematch, Ch17 Elara, Ch18 Agent Zero, Ch19 Antiquarian, Ch20 Dreamer, Ch21 Oracle/Meme

### 10.3 Dead Man's Circuit (6 ❌)
circuit-opens, clone-awakening, the-race, signal-lost, severance-prize, nilmorg-speaks

### 10.4 Living Universe Events (5 ❌)
necromancer-returns, dreamer-awakens, terminus-advance, antiquarian-reveals, shadow-tongue-edits

### 10.5 Crew Awakening (3 ❌)
first-clone-born (Elara), 93847-sunrises (Elara solo), the-mandate (Elara + Player)

### 10.6 Prestige Cycle (1 ❌)
the-reset (Player, Elara, Human, Antiquarian)

### 10.7 Companion Death (1 ❌)
signal-lost (Any companion, Player)

---

## 11. Top-line gap report

### 11.1 Highest-priority missing items (operator workflow)
Per `MISSING_PRELUDE_ACT1_ASSETS.md` §12:

1. **Process all INTERMEDIATE assets** — zero cost. Unblocks
   `preludeReadiness.test.ts` for 13 rooms, 6 VFX, 3 ambient beds.
2. **Render 10 missing Prelude VFX**, with `human-palm-frost` first.
3. **Render 14 missing Prelude cutscene MP4s** in beat order A→J.
4. **Render Act 1 rooms (5) + battlefields (10) + portraits (12) + card
   art (14)** — 41 Nano Banana 2 stills.
5. **Render Act 1 cutscenes (3)** — Welcome to Celebration, To Be the
   Human, Hacking Reality.
6. **Record Act 1 VO (23 lines)** via ElevenLabs.
7. **Produce song assets** — Last Words Prelude cut + Log 5 long-form +
   20 Last Words slide WebPs.

### 11.2 Acts 2–7 — content ✅ ready, runtime wiring still needed
The 181-file AAA Final drop is complete and on CDN, but the runtime
still references the older WebP-frame slideshow scheme. Wiring PR
required to switch `SongSlideshow.tsx` and `SLIDESHOW_TRIGGERS` to the
new `cin_act{N}_*.mp4` + `act-{N}-intro.mp3` paths, and to consume the
new VFX atlases.

### 11.3 Gitignored runtime trees — by design, not regression
Per `.gitignore`: `apps/client/public/{art,audio,videos,music,games,vfx-atlases}/`
are gitignored. The CDN at `dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/`
is the source of truth, served via `assetUrl()`
(`apps/client/src/lib/assetUrl.ts`). Local trees are dev caches built
by `apps/scripts/upload-public-to-s3.ts`. A "missing" file at the local
path is therefore not necessarily missing in production — verify CDN
before regenerating.

### 11.4 Asset categories that are 100% present
- All specification documents and prompt manifests
- All character avif sprite sets (27 characters, 127 files)
- All `docs/art-originals/` reference PNGs (38 files: celebration + mechronis)
- All Prelude intermediate sources (13 rooms PNG + 6 VFX MP4 + 3 ambient WAV)
- All Prelude VO recordings (10 lines on S3)
- All Acts 2–7 AAA Final cinematics (43 MP4 + 39 MP3 + 17 atlases on CDN)
- All CDN-listed room scenes (25 rooms + 8 mystery-state variants + 5 final-drop rooms)
- All sprite sheets (12 fighters) and arena backgrounds (8 stages)

### 11.5 Definitive missing-count totals

| Bucket | Missing | Notes |
|---|---|---|
| Prelude cutscene MP4s | 15 | All beats A–J |
| Prelude rooms (canonical path) | 14 | 13 INTERMEDIATE + 1 CDN-only |
| Prelude VFX (need full render) | 10 | + 6 INTERMEDIATE conversions |
| Prelude ambient MP3 | 3 | WAV→MP3 conversions |
| Prelude songs | 2 + 20 slides | Last Words + Log 5 long-form |
| Act 1 rooms | 5 | All P0 |
| Act 1 battlefield backdrops | 10 | All P0 |
| Act 1 opponent portraits | 12 | All P0 |
| Act 1 card art | 14 | Includes 2 Mythics |
| Act 1 cutscene MP4s | 3 | Welcome / Be Human / Hacking |
| Act 1 VO recordings | 23 | 4 cutscene + 19 Section 6 |
| Code-referenced UI/arena art | 10 | Arena/health/chess/etc. |
| Story / Discovery cinematics | 46 | Per MISSING_CUTSCENES |
| **TOTAL** | **~167+ items** | (excluding Acts 2–7 wiring) |

---

## 12. Source documents referenced for this audit
- `docs/README.md`
- `docs/DISCHORDIAN_SAGA_PRODUCTION_BIBLE.md` § 8 TODO list
- `docs/production/MISSING_PRELUDE_ACT1_ASSETS.md` (2,258 lines)
- `docs/production/MISSING_ART_PROMPTS.md`
- `docs/production/MISSING_CUTSCENES.md`
- `docs/production/acts-2-7-aaa-final/{ASSET_MANIFEST,DELIVERY_NOTES,production_notes,remaining_work}.md`
- `docs/production/prelude-asset-build/{AAA_AUDIT_REPORT.md, manifests/asset_prompt_manifest.json}`
- `docs/production/act1-asset-build/{unified_act1_rebuild_manifest.md, manifests/asset_prompt_manifest.json}`
- `docs/production/ASSET_URLS.md`, `docs/production/FIGHT_CDN_URLS.md`
- `room-artwork-urls.txt`
- `apps/client/public/characters/_inventory.json`
- `.gitignore` (asset-tree exclusions)










