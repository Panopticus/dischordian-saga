# Loredex OS — Art Department Production Document

> **Single source of truth for the art department.**
> Generated 2026-05-08 by direct audit of code, manifests, and CDN references.
> All older art / asset / production / "missing-prompts" / "ship-ready" bibles
> have been archived to `docs/archive/2026-05-08-superseded/` — see appendix.

This document is **drag-and-drop**: hand it to a producer and they have everything
they need to commission and track every art, video, music, SFX, VFX, and VO asset
that is wired into the game today, plus everything that still needs to be made.

---

## Table of contents

1. [Pipeline & conventions](#1-pipeline--conventions)
2. [Live asset inventory (what exists today)](#2-live-asset-inventory-what-exists-today)
3. [Production queue (what still needs to be made)](#3-production-queue-what-still-needs-to-be-made)
4. [Canon character roster](#4-canon-character-roster)
5. [Characters needing canon descriptions ⚠️](#5-characters-needing-canon-descriptions-️)
6. [Tools & prompt templates](#6-tools--prompt-templates)
7. [Doc archive ledger](#7-doc-archive-ledger)

---

## 1. Pipeline & conventions

### CDN

All assets resolve to the dgrsart S3 bucket (us-east-2):

```
https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/<path>
```

Code references the bucket via `assetUrl("<path>")` (`apps/client/src/lib/assetUrl.ts`).
Local mirror was historically at `apps/client/public/{art,audio,videos,music,games}` —
that mirror is **empty today**; CDN is the only source of truth.

### Path mirror

| Type   | CDN prefix              | Notes |
|--------|-------------------------|-------|
| Art    | `art/...`               | webp default, png/jpg only when transparency or photo |
| Video  | `videos/...`            | mp4 (h264) primary, webm fallback for cutscenes |
| Music  | `audio/album{1-5}/`, `audio/music/`, `audio/outergroove/` | mp3 |
| SFX    | `audio/chess_sfx/`, `audio/cades/sfx/` | wav for FPS, mp3 for UI |
| VFX    | `videos/vfx/<category>/` + `art/vfx/<category>/` keyframes | mp4 + webp keyframe pair |
| VO     | served from `dgrsvoices` bucket via per-character VoManifest.json | mp3 |

### Art tools (canonical stack)

| Tool             | Used for |
|------------------|----------|
| Nano Banana 2    | Card illustrations, character portraits, environment stills |
| Midjourney v6    | Reference / mood boards (not shipped, never go to CDN) |
| Seedance 2.0 4K  | Cinematic shots (DMC, story-mode fights, act openers) |
| Veo 3.1          | Looping cinematic clips, idle loops, dreamer-vision flashes |
| Kling Omni       | Long-form act-intro reveals, mechanic-intro reveals |
| ElevenLabs       | Voice-over (all characters; one ElevenLabs voice per character — see VOICE_OVER_BIBLE) |
| Suno v4          | Music tracks (album cuts, FNORD-23 OUTERGROOVE instrumentals) |

### Naming convention

Always lowercase, hyphen-separated, no spaces. Prefix character/scene id, then variant.
Example: `art/cards/imprint/elara-tier3.webp`, `videos/dmc/dmc_cin_nilmorg-chair.mp4`.

---

## 2. Live asset inventory (what exists today)

Every asset wired into the runtime, grouped by system. **"Live"** = manifest-declared
AND HEAD-checked on the CDN as of the most recent `pnpm tsx scripts/_check-art-coverage.mjs`
run. **"Wired-not-verified"** = referenced in code but not yet HEAD-checked.

### 2.1 Card art — 1,154 unique paths

Directly under `art/cards/<category>/<id>.webp`. Loaded by every CardDefinition under
`apps/shared/tcg-core/cards/definitions/`.

| Faction / category | Card count | Manifest |
|---|---:|---|
| Dischordia base set (s1_pack2) | 530 | `expansionArt/dischordiaBaseSet.ts` (652 entries incl. 31 review tier-grids) |
| Hierarchy of the Damned (s2)   | 127 | `expansionArt/hierarchyOfDamned.ts` (8 rarity buckets) |
| Allegiance                     | 36  | `cards/definitions/allegiance/` |
| Antiquarian                    | 39  | `cards/definitions/antiquarian/` |
| Architect                      | 63  | `cards/definitions/architect/` |
| Class                          | 30  | `cards/definitions/class/` |
| Dimensional                    | 12  | `cards/definitions/dimensional/` |
| Dreamer                        | 62  | `cards/definitions/dreamer/` |
| Elemental                      | 20  | `cards/definitions/elemental/` |
| Imprint (NPC characters)       | 90  | `cards/definitions/imprint/` |
| Insurgency                     | 51  | `cards/definitions/insurgency/` |
| Neutral                        | 91  | `cards/definitions/neutral/` |
| New Babylon                    | 52  | `cards/definitions/new_babylon/` |
| Panopticon                     | 8   | `cards/definitions/panopticon/` |
| Race                           | 15  | `cards/definitions/race/` |
| s2 professors (signature)      | 2   | `cards/definitions/s2_professors/` |
| Thought Virus                  | 54  | `cards/definitions/thought_virus/` |

**Zero cards have empty/TODO art fields.** All 1,154 paths resolve in code.

### 2.2 Album slideshow art + music — 5 albums

Each album = MP3 track + per-track keyframe slideshow. Manifests at
`apps/shared/expansionArt/album{1..5}Slideshows.ts`.

| Album | Tracks | Keyframes | Music CDN | Art CDN |
|---|---:|---:|---|---|
| 1 — Age of Dischordian Logic | 29 | 491 | `audio/album1/T01.mp3 … T29.mp3` | `art/slideshows/album1/T<NN>/*.webp` |
| 2 — Dissonance & Order       | 20 | 335 | `audio/album2/...` | `art/slideshows/album2/...` |
| 3                            | 22 | 568 | `audio/album3/...` | `art/slideshows/album3/...` |
| 4                            | 10 | 201 | `audio/album4/...` | `art/slideshows/album4/...` |
| 5 — Silence in Heaven        | 37 | 593 | `audio/album5/...` | `art/slideshows/album5/...` |

Track titles are listed verbatim in the album manifest files (search for `title:`).

### 2.3 Cinematics — 9 act-spanning + 5 animated cutscenes

Manifest: `apps/shared/expansionArt/cinematicsManifest.ts` and `apps/shared/cutsceneRegistry.ts`.

| ID | CDN path | Duration | Triggered by |
|---|---|---|---|
| 01_pack_opening      | `videos/cinematics/01_pack_opening/cinematic_01_card_pack_opening.mp4` | — | Universal pack open |
| 02_hierarchy_reveal  | `videos/cinematics/02_hierarchy_reveal/cinematic_02_hierarchy_reveal.mp4` | — | Universal S2 reveal |
| 03_act1_memoir       | `videos/cinematics/03_act1_memoir/cinematic_03_act1_memoir_opens.mp4` | — | gateAct: 1 |
| 04_act2_whisper      | `videos/cinematics/04_act2_whisper/cinematic_04_act2_whisper_begins.mp4` | — | gateAct: 2 |
| 05_act3_offer        | `videos/cinematics/05_act3_offer/cinematic_05_act3_offer_presented.mp4` | — | gateAct: 3 |
| 06_act4_revelation   | `videos/cinematics/06_act4_revelation/cinematic_06_act4_revelation_meets.mp4` | — | gateAct: 4 |
| 07_act5_map          | `videos/cinematics/07_act5_map/cinematic_07_act5_map_year_one_close.mp4` | — | gateAct: 5 |
| 08_act6_confession   | `videos/cinematics/08_act6_confession/cinematic_08_act6_confession_spoken.mp4` | — | gateAct: 6 |
| 09_act7_convergence  | `videos/cinematics/09_act7_convergence/cinematic_09_act7_convergence_resolves.mp4` | — | gateAct: 7 |
| awakening (3 shots)              | `/videos/cutscenes/awakening/shot{1..3}.mp4` (+ webm) | 45 s | Prelude beat 0 complete |
| first_human_contact (2 shots)    | `/videos/cutscenes/first_human_contact/shot{1..2}.mp4` | 30 s | Human narrator intro |
| elara_memory_recovery (4 shots)  | `/videos/cutscenes/elara_memory_recovery/shot{1..4}.mp4` | 60 s | Elara memory flag |
| breaking_point (5 shots)         | `/videos/cutscenes/breaking_point/shot{1..5}.mp4` | 45 s | Act 2 → 3 transition |
| thought_virus_manifests (2 shots)| `/videos/cutscenes/thought_virus_manifests/shot{1..2}.mp4` | 30 s | First infection |

### 2.4 Prelude beats — 14 shots

Manifest: `apps/shared/preludeSequence.ts`. Naming: `videos/prelude/prelude-beat-<letter>-<slug>.mp4`.

A · A.5 · B · C · C.5 · D · D.5 · E · F · F.5 · G · H · H.5 · J — see `preludeSequence.ts:200-800+`
for full beat metadata, durations, and per-beat VO line ids.

### 2.5 Act-opener slideshows — 5 reels

`videos/acts/act-{4,4_5,5,6,7}/cin_act<N>_opener.mp4` — 21 s each (3×7 s frames).
Source: `apps/shared/songSlideshows.ts:2272+`.

### 2.6 Title page + opening cinematic

| Path | Use |
|---|---|
| `videos/title/the-dischordia-opening.mp4` | First-visit cinematic (190 s); unmutes T01 |
| `videos/title/ark-drift-loop.mp4` (+ webm) | Title-page background loop |
| `videos/title/music/the-book-of-daniel.mp4` | Featured music video (Malkia Ukweli & the Panopticon) |
| `videos/title/music/building-the-architect.mp4` | Featured music video |
| `videos/title/music/hypnotized.mp4` | Featured music video |
| `videos/title/music/brushstroke-of-the-empire.mp4` | Featured music video |
| `videos/title/music/baron-heart-of-time.mp4` | Featured music video |
| `videos/title/music/the-last-christmas.mp4` | Featured music video |

### 2.7 Epoch Zero transmissions — 14 episodes

Source: `apps/shared/transmissions.ts:300-468`. Sequential unlock via `epoch0_ep<N>_viewed`.

`videos/epochs/epoch-0/ep{02..15}-<slug>.mp4` (e.g. `ep02-the-meme.mp4`, `ep03-agent-zero.mp4`,
`ep04-iron-lion.mp4`, `ep05-the-spy.mp4`, `ep06-north-pole-inc.mp4`, `ep07-the-oracle.mp4`,
`ep08-late-night.mp4`, `ep09-meme-and-mascot.mp4`, `ep10-rest-in-peace.mp4`,
`ep11-generation-degen.mp4`, `ep12-the-detective.mp4`, `ep13-to-be-the-human.mp4`,
`ep14-the-experiment.mp4`, `ep15-brushstrokes.mp4`). 200–320 s each.

### 2.8 Discovery videos (entity database) — 16 entries

Source: `apps/client/src/components/DiscoveryVideoOverlay.tsx`. Each entity opens a Kling-rendered
talking-head clip when discovered: `videos/discoveries/entity_<N>.mp4` for entries 1–66
(Programmer, Architect, Conexus, Watcher, Collector, Warlord, Iron Lion, Agent Zero, The Eyes,
Oracle, Enigma, Engineer, Necromancer, Human, Source, Antiquarian).

### 2.9 Awakening sequence — 10 looping clips

Source: `apps/shared/awakeningCinematicPrompts.ts`. 6–10 s loops play under Elara VO.

`videos/awakening/{CRYO_OPEN, ELARA_INTRO, SPECIES_QUESTION, CLASS_QUESTION, ALIGNMENT_QUESTION,
ELEMENT_QUESTION_DEMAGI, ELEMENT_QUESTION_QUARCHON, NAME_INPUT, ATTRIBUTES, FIRST_STEPS}.mp4`.

### 2.10 Guild cutscenes — 27 unique videos + 24 signature pairs

Source: `apps/shared/expansionArt/guildCutscenesManifest.ts`. 175 total assets across:

| Bucket | Videos | Notes |
|---|---:|---|
| f1_onboarding   | 4 | join, first-message, friend-accept, sorting-ceremony |
| f2_daily        | 4 | contract unlock/complete, weekly reset, donation milestone |
| f2_emotes       | 0 | sticker-only (12 anchors), no video |
| f3_combat       | 8 | war declared/first-blood/MVP/victory/defeat, placement-lock, thought-virus, epoch-change |
| f4_signature    | 24 | 12 professors × {light, dark} variants — `cs_sig_<N>_{light,dark}.mp4` |
| f5_guild_hall   | 7 | tier-up, oracle-room, generic-room, training-grounds, trophy-case, war-room, decor |

### 2.11 Tower-defense and DMC cinematics

| Mode | CDN paths |
|---|---|
| Terminus Swarm (TD) | `videos/game-modes/tower-defense/cin01_comms_room_discovery.mp4` … `cin05_first_wave_discovery.mp4` |
| Dead Man's Circuit  | `videos/dmc/dmc_cin_circuit-opens.mp4`, `the-race`, `nilmorg-speaks`, `clone-awakening-v2`, `race-gameplay`, `race-tracking`, `severance-podium`, `signal-lost-v2`, `nilmorg-lipsync`, `nilmorg-chair` |

### 2.12 VFX clips — 18 live, 3 missing

Source: `apps/shared/expansionArt/cinematicsManifest.ts:208-350`. Each clip ships as
`videos/vfx/<category>/vfx_<id>.mp4` plus an `art/vfx/<category>/kf_<id>.webp` keyframe fallback.

| Category | Clips |
|---|---|
| Act spells (5)        | confession_flame, convergence_chord, memoir_glyph, soul_map_lock, whisper_mist |
| Card flips (7)        | pack_flip_{common, uncommon, rare, epic, legendary, mythic, neyon} |
| Cosmetic ceremonies (3)| card_back_reveal, founder_badge, season_title |
| Hierarchy mechanics (3)| perf_review, quarterly_earnings, stock_buyback |
| **Dreamer visions (3) — ⚠ MISSING** | substrate_pulse, iris_collapse, cryo_frost_retreat |

### 2.13 Music

| System | Paths | Source |
|---|---|---|
| Album tracks (118)   | `audio/album{1..5}/T<NN>.mp3` | album*Slideshows.ts |
| OUTERGROOVE (10 live, 31 designed) | `audio/outergroove/og_<NNN>.mp3` | `apps/shared/tcg-core/audio/outergroove.ts` + `docs/FNORD23_MUSIC_PROMPTS.md` |
| Game-mode music (33 variants across 14 tracks) | `audio/music/<slug>/v<N>.mp3` | `apps/shared/musicRegistry.ts` |
| CADES FPS scores (7) | `audio/cades/music/cades_music_*.{wav,mp3}` | `apps/client/src/data/cadesAssets.ts` |

### 2.14 SFX

| System | Paths |
|---|---|
| Chess (6)  | `audio/chess_sfx/{move, capture, check, mate, mate_climb, leak}.mp3` |
| CADES (22) | `audio/cades/sfx/cades_sfx_*.wav` (weapons 7, enemies 6, player/ambience 9) |
| **Card-game UI SFX (0) — ⚠ MISSING** | no card-play / hover / shuffle / draw SFX exist |

### 2.15 Voice-over

51 character/context manifests at `apps/shared/*VoManifest.json`. Largest manifests:

| Character | Lines | Manifest |
|---|---:|---|
| Elara      | 1068 | elaraVoManifest.json |
| Human      |  572 | humanVoManifest.json |
| Episode narration | 208 | episodeVoManifest.json |
| Meme       |   87 | memeVoManifest.json |
| Antiquarian|   81 | antiquarianVoManifest.json |
| Act 3      |   78 | act3VoManifest.json |
| Game Master|   43 | gamemasterVoManifest.json |
| CADES      |   42 | cadesVoManifest.json |
| Engineer (memoir) | 35 | engineerMemoirVoManifest.json |
| Palimpsest Host (placeholder) | 35 | palimpsestHostVoManifest.json |

Plus 41 smaller manifests for Source, Agent Zero, Necromancer, Locke, Nilmorg, Vex,
each guild Professor (12 of them), each guild emote character (7), and the Acts 2/4/5/6/7
narration.

**Empty / malformed manifests** that need re-validation:
`act4_5VoManifest.json`, `authorityVoManifest.json`, `eidolaVoManifest.json`,
`matrikalaVoManifest.json`, `programmerVoManifest.json`.

### 2.16 Environments, portraits, and other component-referenced art

Pulled directly via `assetUrl()` in pages and components (not in expansion manifests). Categories
and counts:

| Category | Asset count | CDN root |
|---|---:|---|
| Arenas (battle envs)         | 9 | `art/arenas/` |
| Mechronis Academy            | 3 | `art/mechronis/environments/` |
| Celebration (city envs + 12 mascoteers) | 26 | `art/celebration/` |
| Loading screens              | 7 | `art/loading/` |
| Terminus (cinematics, enemies, turrets, maps) | 35+ | `art/terminus/` |
| DMC racing environments      | 13 | `art/dmc/` |
| Guild halls                  | 12 | `art/guilds/` |
| Professor classrooms         | 12 | `art/classrooms/` |
| Card frames + era backgrounds + story icons | 26 | `art/lore-gallery/` |
| Trade Empire planets         | 4 | `art/trade-empire/planets/` |
| Room point-and-click states  | 15 | `art/rooms/` (mystery + ark + envs + videos) |
| CADES props/UI/sprites       | 50+ | `art/cades/` |
| Prelude VFX overlays         | 8 | `art/vfx/prelude/` |
| Fusion VFX                   | 12 | `art/vfx/fusion/` |
| Spectral forms               | 13 | `art/spectral/` |
| Constellations               | 5 | `art/constellations/` |
| Page backgrounds (separate prefix) | 12 | `s3://dgrsart/page-backgrounds/` |
| Logos                        | 2 | `art/logos/` |
| Soul stones                  | 3 | `art/soul-stones/` |
| Special maps                 | 3 | `art/maps/` |
| Seasonal events              | 8 | `art/events/` |
| UI overlays (frames, BGs, title screens) | 23 | `art/ui/` |

Full path list embedded in §2 of the original audit transcript — every category here
resolves through `assetUrl()` at build time and is therefore "wired".

---

## 3. Production queue (what still needs to be made)

Sorted by priority. Each row is one deliverable for the art / audio / video department.

### 3.1 Critical-path missing assets (gate ship)

| # | Type | Asset | Notes / source |
|---|---|---|---|
| 1 | VFX  | `videos/vfx/dreamer_visions/vfx_substrate_pulse.mp4` (+ keyframe) | 403 on CDN; renderer falls back to still |
| 2 | VFX  | `videos/vfx/dreamer_visions/vfx_iris_collapse.mp4` (+ keyframe) | 403 on CDN |
| 3 | VFX  | `videos/vfx/dreamer_visions/vfx_cryo_frost_retreat.mp4` (+ keyframe) | 403 on CDN |
| 4 | VO   | Palimpsest Host voice session (35 lines) | currently text-fallback; book ElevenLabs session |
| 5 | VO   | Validate 5 empty/malformed VO manifests | act4_5, authority, eidola, matrikala, programmer |
| 6 | VO   | Upload Prelude beat audio to CDN | currently served from local disk only |

### 3.2 Story-mode fight intro cinematics — 17 missing

Each is a Seedance 2.0 4K shot, 12–20 s, character-vs-player tableau. Slot under
`videos/cutscenes/fights/<chapter>_<slug>.mp4`.

| Chapter | Boss | Companion / setting cue |
|---:|---|---|
| 5  | The Watcher       | All-seeing eye tattoo, white outfit, ponytail |
| 6  | The Necromancer   | Spiky white hair, red+black robe, red steampunk goggles |
| 7  | The Meme          | Shape-shifting archon, broadcast static |
| 8  | The Collector     | DNA / machine-code harvest field |
| 9  | Kael (Recruiter)  | Pre-Source, Insurgency leader form |
| 10 | The Human         | The Detective phase |
| 11 | The Game Master   | Robot OR human form (player choice — produce both) |
| 12 | The Collector (rematch) | Late-game variant |
| 13 | The Architect     | Final form, Panopticon throne |
| 14 | The Source        | Kael-corrupted eternal form |
| 15 | The Jailer        | Liberated Oracle warden form |
| 16 | Iron Lion (rematch) | Veteran scarred variant |
| 17 | Elara             | Antagonist phase, glitched hologram |
| 18 | Agent Zero        | Zenon kill scene callback |
| 19 | The Antiquarian   | 17,000 A.A. pocket-dimension reveal |
| 20 | The Dreamer       | Beyond-time-and-space tableau |
| 21 | The Oracle / The Meme | Ambiguous final-form |

### 3.3 DMC cutscene set — 6 missing

Drop into `videos/dmc/dmc_cin_<slug>.mp4` (Seedance 2.0 4K, 12–20 s):
`circuit-opens`, `clone-awakening` (V1 archived; consider V2 already covered),
`the-race`, `signal-lost`, `severance-prize`, `nilmorg-speaks`. Cross-check
against §2.11 — V2 versions already cover several; only the V1 names below
are still gaps per the registry.

### 3.4 Living-universe event cinematics — 5 missing

Veo 3.1 looping clips, 8–12 s, triggered by world-event flags. Path:
`videos/events/<slug>.mp4`.

- `necromancer-returns`
- `dreamer-awakens`
- `terminus-advance`
- `antiquarian-reveals`
- `shadow-tongue-edits`

### 3.5 Crew awakening cinematics — 3 missing

`videos/awakening/{first-clone-born, 93847-sunrises, the-mandate}.mp4`.

### 3.6 Prestige cycle — 1 missing

`videos/prestige/the-reset.mp4` — ceremony cutscene, all four POVs (Player, Elara,
Human, Antiquarian).

### 3.7 Guild cutscenes — Professor signature pairs

24 of 24 are wired in the manifest but several are placeholder. Verify each
`cs_sig_<N>_{light,dark}.mp4` either renders or is queued; commission missing.

### 3.8 OUTERGROOVE music — 31 missing instrumentals

Suno v4 prompts already authored in `docs/FNORD23_MUSIC_PROMPTS.md`. Render and
upload to `audio/outergroove/og_<NNN>.mp3`:

`og_021, og_023, og_025, og_027, og_029, og_031, og_033, og_035, og_037, og_039`
(keyword instrumentals)

`og_041, og_042, og_043, og_044, og_045, og_046, og_047` (faction instrumentals)

`og_051, og_052, og_053, og_054, og_055, og_056, og_057` (bloodborn instrumentals)

`og_061, og_062, og_063, og_064, og_065, og_066, og_067` (trigger instrumentals)

### 3.9 Card-game UI SFX — design + commission

No SFX exist for card play, hover, shuffle, or draw. Author 8–12 short stings
(50–200 ms each) and upload to `audio/sfx/card-game/`. Match Suno + iZotope
processing chain used for chess SFX.

### 3.10 Scene-music registry resolution

`apps/shared/sceneMusicRegistry.ts` references `sih-track-24`, `sih-track-32`,
`sih-track-37` which do not resolve in `musicRegistry.ts`. Either add the slugs
to the music registry or remap the scene cues. Audio assets exist in Album 5
(`T24`, `T32`, `T37`) — likely a slug reconciliation, not new production.

---

## 4. Canon character roster

113 characters total. Full descriptions live in `docs/built/LORE_BIBLE.md`
(78,157 words, Rev 7, auto-generated from `loredex-data.json`). This section is
the **art-relevant** distillation: every character that needs visual reference,
sorted by faction.

### 4.1 Archons (12)

| Character | Visual canon | Card | VO | Cutscene refs |
|---|---|---|---|---|
| The Architect | Final-form throne; Panopticon iconography | ✓ | ✓ | Acts 4, 6, 7 |
| The Programmer / Antiquarian | Dr. Daniel Cross; revealed identity in Act 7 | ✓ | ✓ | Act 7, 17,000 A.A. |
| The Watcher | Japanese man, ponytail, white outfit, all-seeing-eye tattoo | ✓ | ✓ | Story-mode ch 5 |
| The Meme | Shape-shifting; broadcast static; mascot variants | ✓ | ✓ | Ep 02, ep 09 |
| The Collector | DNA/machine-code harvester; Inception Ark facility | ✓ | ✓ | Story-mode ch 8, 12 |
| The Shadow Tongue | SVP Comms & Propaganda; voice-of-static | ✓ | ✓ | Living-universe event |
| The Warlord | (classified) Thought-Virus host body Dr. Lyra Vox | ✓ | ✓ | Hierarchy story arc |
| The Politician | Engineered manipulator; New Babylon governor | ✓ | ✓ | Acts 4–5 |
| The Warden | Panopticon overseer; Thought-Virus dev partner | ✓ | ✓ | Acts 5–6 |
| The Authority | Six-citizen merge; New Babylon arbiter | ✓ | ✓ (empty manifest) | Act 5 |
| The Vortex | Annihilation entity; star-system devastator | ✓ | ✓ | Act 7 background |
| The Game Master | Dual form: dark-haired man w/ blue trench coat OR robot | ✓ | ✓ | Story-mode ch 11; Zenon |
| The Human / Detective / Student / Seeker | Last Archon; Mechronis grad; phase-shifts visually | ✓ | ✓ | All acts |
| The Necromancer | Dark-elf magician; spiky white hair; red+black robe; red steampunk goggles | ✓ | ✓ | Story-mode ch 6 |

### 4.2 Insurgency (8)

| Character | Visual canon | Card | VO |
|---|---|---|---|
| Iron Lion (legacy) | Last Great Human General; battle-worn | ✓ | ✓ |
| Iron Lion (Jericho Jones) | Trainee; Heart-of-Time arc | ✓ | needs |
| Agent Zero | Combat / espionage specialist; black-on-black | ✓ | ✓ |
| The Eyes | Synthetic Watcher protégé; infiltrator | ✓ | ✓ |
| The Nomad | Hood + mask, cyber-warfare | ✓ | ✓ |
| Kael / The Recruiter | Pre-Source; mentor figure | ✓ | ✓ |
| The Oracle | Prophet; abducted → becomes The Jailer | ✓ | ✓ |
| The White Oracle | Liberated; partners with The Enigma | ✓ | ✓ |

### 4.3 Hierarchy of the Damned (10 executives)

All have card art live (s2_hierarchy/_art.ts, 127 entries). Visual canon below.

| Role | Character | Description |
|---|---|---|
| CEO/Chair    | Mol'Garath the Unmaker | Predates time; shadow of creation; not born, discovered |
| CFO          | Xeth'Raal the Debt Collector | Accountant; ledger of ruin |
| COO          | Riri'Ahlia the Taskmaster | Six-armed warrior-queen; demon-legion commander |
| SVP Acquisitions | Drael'Mon the Harvester | Centaur-like; tendrils; crown of collapsed stars |
| SVP R&D      | Zyr'Koth the Flayer | Lab coat of dimensional membranes |
| SVP HR       | Syl'Vex the Corruptor | Most human-looking; androgynous; perfect tailored suit |
| SVP Comms    | The Shadow Tongue | (also an Archon — see §4.1) |
| Director Special Projects | Ith'Rael the Whisperer | Translucent humanoid of whispers; suit of static |
| Director Security | Varkul the Blood Lord | Vampiric; commands undead; blood-magic |
| Director Operations | Fenra the Moon Tyrant | Lycanthropic; executive coat + reading glasses |

### 4.4 Ne-Yons (8)

The Dreamer · The Judge · The Inventor · The Storm · The Silence · The Knowledge ·
The Degen (8th Ne-Yon, casino host, golden eye-shaped Heart-of-Time ship) ·
The Resurrectionist.

### 4.5 Potentials (8+)

The Wolf · Wraith Calder · Akai Shi · Jericho Jones · Nythera · The Forgotten ·
The Host · Marion Kell.

### 4.6 Ark companions (6 imprints)

Elara (holographic AI, Ark-1047 guide) · The Human (companion form) · Kael (companion) ·
Agent Zero (imprint) · Adjudicar Locke (New Babylon politician companion) · Max (origin TBD).

### 4.7 Mechronis Academy professors (12)

These all have VO manifests and card art but need visual canon — see §5.

Aoki · Greenshaw · Halverez · Kanevas · Kasra · Mireille · Orphic · Proctor · Vasara ·
Vellis · Vent · Vex.

### 4.8 Independent / supporting

The Seer · Senator Elara Voss · Dr. Lyra Vox · Ambassador Veron · Panoptic Elara ·
The Enigma · The Hierophant · The Star Whisperer · Destiny (Ark-1047 AI) · The Source ·
The Clone · The Overseer · Darren Fessler · Vex Solène · Nilmorg · Eidola.

### 4.9 Generals & factions

General Prometheus · General Binath-VII · General Alarik · Master of R'lyeh ·
The Council of Harmony · The League · The Terminus Swarm · The Syndicate of Death ·
The Thought Virus · The Awakened Clone Army · The Wraith of Death.

---

## 5. Characters needing canon descriptions ⚠️

These characters appear in cards, cutscenes, and/or VO but lack a visual canon
in `LORE_BIBLE.md`. **Please upload canon descriptions for each — they will be
folded directly into §4 of this document.**

### High priority (3+ cutscene refs, art commission imminent)

1. **Nilmorg** — appears in 4+ DMC cinematics; SVP of Kinetic Acquisition; voice exists
2. **Jericho Jones** — Iron Lion in training; Heart-of-Time arc; killed Akai Shi
3. **Wraith Calder** — Potentials member, resurrected Year 107,652 A.A.
4. **Akai Shi** — Potentials member; Battle of Thaloria; energy/healing master
5. **The Clone** — Oracle DNA clone; breaks free in Panopticon labs
6. **Nythera** — dual heritage harvested DNA + machine code; 83,000-year consciousness
7. **Marion Kell** — performance-review analyst; erased by Shadow Tongue; partial restore
8. **Darren Fessler** — Palimpsest Season 1 segment producer; deceased Episode 12

### Mechronis Academy professors (medium priority — have VO + card, need visual)

9.  **Aoki**
10. **Greenshaw**
11. **Halverez**
12. **Kanevas** *(also referenced as Kanesvas in some manifests — please disambiguate)*
13. **Kasra**
14. **Matrikala**
15. **Mireille**
16. **Orphic**
17. **Proctor**
18. **Vasara**
19. **Vellis**
20. **Vent**
21. **Eidola**
22. **Prince** *(royalty theme; existing VO references "toy-soldier" and "diploma" beats)*

### Lower priority (referenced but minimal canon)

23. **Vex Solène** — Ne-Yon agent; Degen counterpart; first-wave Potential
24. **The Student / The Seeker** — early phases of The Human; need visual differentiation arc
25. **Left Game Master** — thin angular man, charcoal 3-piece suit, grey hair, rectangular spectacles *(partial canon exists in `acts-2-7-aaa-final/character_canon_map.md`)*
26. **Right Game Master** — shorter, warm; dark unkempt hair; open-collar cotton shirt; pencil behind ear *(partial canon exists)*
27. **Max** — companion option; origin and visual TBD

> **How to provide:** drop a markdown block per character with the keys: `name`,
> `also_known_as`, `species`, `silhouette`, `wardrobe`, `signature_props`,
> `palette`, `expression_default`, `motion_signature`, `voice_direction_oneliner`.
> I will splice these directly into §4 and update `loredex-data.json` so the
> next `pnpm run lore:build` regenerates LORE_BIBLE.md with the full canon.

---

## 6. Tools & prompt templates

The following narrowly-scoped prompt files are still active references — **don't
regenerate them, just point producers at them**. They have not been archived.

| File | Purpose |
|---|---|
| `docs/TCG_ART_SPEC.md` (+ ADDENDUM)            | Card-art Nano Banana 2 prompts (206 illustrations + frames + keyword icons) |
| `docs/NANO_BANANA_*` (6 files)                 | Allegiance / class / element-dim-race / NPC-imprint card prompts |
| `docs/FNORD23_MUSIC_PROMPTS.md`                | Suno prompts for OUTERGROOVE engineer-log instrumentals |
| `docs/production/CADES_SFX_PROMPTS.md`         | CADES FPS Suno SFX prompts |
| `docs/production/dreamer-vision-veo-flashes.md`| Veo prompts for the 3 missing dreamer-vision flashes |
| `docs/production/CUTSCENE_SEEDANCE_PROMPTS.md` | Seedance 2.0 prompts for narrative cutscenes |
| `docs/production/prompts/kling-omni-act-intros/*.md` | 8 Kling Omni act-intro prompts (Prelude + Acts 1-7) |
| `docs/production/prompts/kling-omni-mechanic-intros/*.md` | 10 Kling Omni mechanic-intro prompts |
| `docs/production/prompts/kling-discovery-video-prompts.md` | Kling prompts for the 16 discovery videos |
| `docs/production/prompts/suno-game-music-prompts.md` | Suno v4 prompts for game-mode music |
| `docs/production/VOICE_OVER_BIBLE.md`          | ElevenLabs voice profiles + pipeline |
| `docs/production/LIVING_CHARACTER_SHEET_ART_BRIEF.md` | 6-track character rig + cosmetics plan (Meshy v5, NB2 viseme grids) |
| `docs/production/GUILD_CUTSCENE_BIBLE.md`      | Guild signature-cutscene Veo 3.1 prompts |
| `docs/production/CASINO_EXPANSION_ART_BIBLE.md`| Casino expansion Nano Banana 2 prompts |

---

## 7. Doc archive ledger

Twenty-eight overlapping or superseded production docs were moved to
`docs/archive/2026-05-08-superseded/` on the same commit that created this
document. Nothing was deleted — every file is preserved at its archived path.

| Archived path (under `docs/archive/2026-05-08-superseded/`) | Original path | Reason |
|---|---|---|
| `PRODUCTION_BIBLE.md`                  | `docs/production/PRODUCTION_BIBLE.md`                  | Superseded by §2 of this doc |
| `ART_PRODUCTION_BIBLE.md`              | `docs/production/ART_PRODUCTION_BIBLE.md`              | Superseded by §2 + §6 |
| `VISUAL_PRODUCTION_BIBLE.md`           | `docs/production/VISUAL_PRODUCTION_BIBLE.md`           | Superseded by §4 + §6 |
| `COMPLETE_ART_PROMPT_BIBLE.md`         | `docs/production/COMPLETE_ART_PROMPT_BIBLE.md`         | Folded into §3 + §6 |
| `MISSING_ART_PROMPTS.md`               | `docs/production/MISSING_ART_PROMPTS.md`               | Superseded by §3 |
| `MISSING_PRELUDE_ACT1_ASSETS.md`       | `docs/production/MISSING_PRELUDE_ACT1_ASSETS.md`       | Superseded by §3 |
| `MISSING_CUTSCENES.md`                 | `docs/production/MISSING_CUTSCENES.md`                 | Stub; superseded by §3.2-3.6 |
| `CONSOLIDATED_MISSING_PROMPTS.md`      | `docs/production/CONSOLIDATED_MISSING_PROMPTS.md`      | Superseded by §3 + §6 |
| `PROMPT_BOOK_2026-04-25.md`            | `docs/production/PROMPT_BOOK_2026-04-25.md`            | Dated snapshot; current prompts in §6 |
| `ART_AUDIT_VERIFIED_2026-04-25.md`     | `docs/production/ART_AUDIT_VERIFIED_2026-04-25.md`     | Superseded by §2 (live audit) |
| `ART_MATERIALS_AUDIT_2026-04-25.md`    | `docs/production/ART_MATERIALS_AUDIT_2026-04-25.md`    | Superseded by ART_AUDIT_VERIFIED then by §2 |
| `ACTS_2_THROUGH_7_ASSET_BIBLE.md`      | `docs/production/ACTS_2_THROUGH_7_ASSET_BIBLE.md`      | Folded into §3 |
| `ACTS_2_TO_7_PRODUCTION_BIBLE.md`      | `docs/production/ACTS_2_TO_7_PRODUCTION_BIBLE.md`      | Folded into §3 + §6 (kept in §6 reference if still needed) |
| `ACT_1_SHIP_READY_BIBLE.md`            | `docs/production/ACT_1_SHIP_READY_BIBLE.md`            | Folded into §3 + §6 |
| `PRELUDE_SHIP_READY_BIBLE.md`          | `docs/production/PRELUDE_SHIP_READY_BIBLE.md`          | Folded into §3 + §6 |
| `SHIP_READY_ASSET_BIBLE.md`            | `docs/production/SHIP_READY_ASSET_BIBLE.md`            | Folded into §3 + §6 |
| `STORY_MODE_ART_BIBLE.md`              | `docs/production/STORY_MODE_ART_BIBLE.md`              | Folded into §3.2 |
| `UNIVERSAL_PROMPTING_DOC_PRELUDE_ACT1.md` | `docs/production/UNIVERSAL_PROMPTING_DOC_PRELUDE_ACT1.md` | Superseded by §6 |
| `room-pointclick-audit.md`             | `docs/production/room-pointclick-audit.md`             | Stub; superseded by ROOM_POINTCLICK_AUDIT.md (kept active) |
| `ROOM_POINTCLICK_AUDIT.md`             | `docs/production/ROOM_POINTCLICK_AUDIT.md`             | Folded into §2.16 + STREAMED_PRISM_MYSTERY_ENGINE.md |
| `WRITING_AUDIT_V2_INGAME.md`           | `docs/narrative-audit/WRITING_AUDIT_V2_INGAME.md`      | Superseded by V3 (kept active in narrative-audit) |
| `FULL-PROJECT-AUDIT.md`                | `docs/design/FULL-PROJECT-AUDIT.md`                    | Superseded by CONNECTION_AUDIT_2026-05-07 + INCOMPLETE_DESIGNS_AUDIT_2026-05-08 |
| `act2-asset-pipeline.md`               | `docs/production/act2-asset-pipeline.md`               | Folded into §3 + §6 |
| `acts-4-through-7-asset-pipeline.md`   | `docs/production/acts-4-through-7-asset-pipeline.md`   | Folded into §3 + §6 |
| `act2-vo-script.md`                    | `docs/production/act2-vo-script.md`                    | VO script archived (manifest in code is canonical) |
| `elara-vo-script.md`                   | `docs/production/elara-vo-script.md`                   | VO script archived (manifest in code is canonical) |
| `chess-vo-direction.md`                | `docs/production/chess-vo-direction.md`                | Folded into VOICE_OVER_BIBLE |
| `OPTIONAL_COMPONENTS_ART_BIBLE.md`     | `docs/production/OPTIONAL_COMPONENTS_ART_BIBLE.md`     | Superseded by §2.16 |
| `PAGE_BACKGROUND_ART_PROMPTS.md`       | `docs/production/PAGE_BACKGROUND_ART_PROMPTS.md`       | Superseded by §2.16 |
| `PARALLAX_ROOMS_ART_BIBLE.md`          | `docs/production/PARALLAX_ROOMS_ART_BIBLE.md`          | Superseded by §2.16 |
| `LORE_GALLERY_ART_BIBLE.md`            | `docs/production/LORE_GALLERY_ART_BIBLE.md`            | Superseded by §2.16 |
| `PLAYER_CABIN_ART_BIBLE.md`            | `docs/production/PLAYER_CABIN_ART_BIBLE.md`            | Superseded by §2.16 |
| `MECHRONIS_ART_PROMPTS.md`             | `docs/production/MECHRONIS_ART_PROMPTS.md`             | Folded into §2.16 + §6 |
| `CELEBRATION_ART_PROMPTS.md`           | `docs/production/CELEBRATION_ART_PROMPTS.md`           | Folded into §2.16 |
| `CELEBRATION_MECHRONIS_ART_PROMPTS.md` | `docs/production/CELEBRATION_MECHRONIS_ART_PROMPTS.md` | Folded into §2.16 |
| `CHRISTMAS_IN_JULY_ART_BIBLE.md`       | `docs/production/CHRISTMAS_IN_JULY_ART_BIBLE.md`       | Seasonal; folded into §2.16 |
| `BREEDING_SYSTEM_ART_PROMPTS.md`       | `docs/production/BREEDING_SYSTEM_ART_PROMPTS.md`       | Folded into §2.16 + §6 |
| `DEAD_MANS_CIRCUIT_PRODUCTION.md`      | `docs/production/DEAD_MANS_CIRCUIT_PRODUCTION.md`      | Folded into §3.3 + §2.11 |
| `GAME_MODE_ENVIRONMENTS_ART_BIBLE.md`  | `docs/production/GAME_MODE_ENVIRONMENTS_ART_BIBLE.md`  | Folded into §2.16 |
| `ART_SOUND_MUSIC_RESOURCES.md`         | `docs/production/ART_SOUND_MUSIC_RESOURCES.md`         | Folded into §1 + §6 |

**Kept active and referenced from this doc:**

`README.md`, `DISCHORDIAN_SAGA_PRODUCTION_BIBLE.md`, `built/LORE_BIBLE.md`,
`built/PROPHECY_INDEX.md`, `built/CADES_PVP.md`, `built/PVP_OVERHAUL.md`,
`built/WATCHER_DESIGN.md`, `built/TIER_3_LAYERED_ARCHITECTURE.md`,
`design/*` (all design proposals, ADRs), `narrative-audit/DOC1..DOC4`,
`operations/*`, `legal/*`, `audits/CONNECTION_AUDIT_2026-05-07.md`,
`design/INCOMPLETE_DESIGNS_AUDIT_2026-05-08.md`, `AUDIT_2026-05_FINAL_TODO.md`,
`HIDDEN_SYSTEMS_AUDIT_2026-05.md`, `TCG_ART_SPEC.md` + addendum,
all `NANO_BANANA_*.md`, `FNORD23_MUSIC_PROMPTS.md`,
`production/VOICE_OVER_BIBLE.md`, `production/LIVING_CHARACTER_SHEET_ART_BRIEF.md`,
`production/GUILD_CUTSCENE_BIBLE.md`, `production/CASINO_EXPANSION_ART_BIBLE.md`,
`production/CADES_SFX_PROMPTS.md`, `production/dreamer-vision-veo-flashes.md`,
`production/CUTSCENE_SEEDANCE_PROMPTS.md`, all `production/prompts/**`,
all `production/act1*` references, all `production/acts-2-7-aaa-final/**`,
all `production/commission-packages/**`, all `production/prelude-asset-build/**`,
all `production/vo-batches/**`, `production/CONSISTENCY_GATE.md`,
`production/CHOICE_IMPACT_PRODUCER_HANDOFF.md`, `production/ASSET_URLS.md`,
`production/FIGHT_CDN_URLS.md`, `production/FIGHTER_LORE_CROSSREF.md`,
`production/ENGINE_DEMO_CARDS_ART_HANDOFF.md`,
`production/ACT1_TAUNTS_PIPELINE_OPS_HANDOFF.md`,
`production/ACT1_NARRATIVE_STRUCTURE.md`, `production/ALL_ACTS_ROADMAP.md`,
`production/GUILD_CUTSCENE_PORTAL_CHAMBER_FOLLOW_UP.md`,
`production/WRITING_AUDIT_AND_REVISIONS.md`,
`silence-in-heaven/ART-PRODUCTION-GUIDE.md`,
`refactor-plans/*`, `asset-uploads/*`.
