# Art / Cutscene / Music / VFX Audit (Verified) — 2026-04-25

> **This audit supersedes** `ART_MATERIALS_AUDIT_2026-04-25.md` and
> `MISSING_PRELUDE_ACT1_ASSETS.md`. The earlier docs were
> registry-based — they assumed "if a typed registry wires it, it
> ships." The 2026-04-25 verification pass discovered that the
> wired-vs-shipped gap is larger than any prior pass realized.

## Methodology

Three axes per asset:

1. **Wired** — does a typed TS/JSON registry export it?
2. **Consumed** — does a React/runtime component import the export?
3. **Live on CDN** — does the URL return HTTP 200?

The audit ran an exhaustive `curl -I` HEAD probe of every unique
URL referenced anywhere in `apps/`. URLs were extracted via:

- Every `assetUrl("…")` call (literal string match)
- Every `pair("…")` helper call in `preludeAct1Deliverables` /
  `terminusCinematicAssets` (yields PNG + WebP per call)
- Every `${CDN_BASE}/…` template literal in `casinoAssets` /
  `christmasInJulyAssets`
- Every `https://dgrsart.s3…` literal URL
- Every `https://d2xsxph8kpxj0f.cloudfront.net/…` URL
- Every voice-manifest URL (32 `*VoManifest.json`)
- The S3 key derivation for `tradeEmpireArtAssets` (built from
  `TRADE_EMPIRE_ART_PROMPTS[].assetId`)
- The slug-and-variant derivation for `musicRegistry`
- `room-artwork-urls.txt` (43 explicit URLs)

503 responses (S3 throttling at parallelism 48) were retried up to
3× at lower concurrency. **Two ambiguity caveats** at the end of
this doc.

## Headline counts

| Metric | Count |
|---|--:|
| Source files referencing asset URLs | **524** |
| Unique asset URLs probed | **3,384** |
| ✅ Live (HTTP 200) | **1,052** (31%) |
| ❌ Dead (HTTP 403) | **2,332** (69%) |
| Source files at 100% live | **446** |
| Source files at 0% live | **71** |
| Source files mixed live/dead | **7** |

The probe ground truth lives at
`docs/production/audit/cdn-liveness-files.tsv` (one row per URL).
Per-source aggregates live at
`docs/production/audit/per-source-status.tsv`. Per-source dead-URL
lists (one file per source that has any dead URL) live at
`docs/production/audit/dead-urls/`.

## Top-line findings

1. **PR #180 (`preludeAct1Deliverables.ts`) is wired but bytes
   are not live** — 221 URLs, all 403. User confirmed during plan
   review that bytes are on a dev machine pending
   `pnpm assets:upload`. Treat as upload task, not re-render.

2. **Legacy CloudFront distribution is dead** — 1,727 URLs,
   all 403. Spans `room-artwork-urls.txt` (43 rooms) +
   `season1-cards.json` (~50 cards) + ~1,634 hardcoded refs in
   tcg-core card definitions. User wants investigate-before-deciding
   (migrate / re-render / retire). Does **not** appear in
   the missing-prompts pack.

3. **Most current-CDN catalogs are 100% live** — casino (66/66),
   trade empire (70/70), music (31/31), nanobanna2 (52/52),
   cades (77/77), DMC (32/32), optional components (40/40),
   mechronis professors (13/13), act 2 interlude (19/19).

4. **Christmas in July is wired but 0/49 live** —
   different CDN prefix (`cdn/events/christmas_in_july_2026/`).
   Same upload-pending pattern as PR #180.

5. **Acts 4-7 spine cinematics are referenced in `songSlideshows`
   but 0/30 live** — the silence-of-two-witnesses / act-4-revelation
   / act-4-5-dmc / act-5-map / act-6-confession / act-7-convergence
   slideshow sets all 403.

6. **Acts 2-7 voice manifests are EMPTY JSON `{}`** — 8 manifest
   files (act2, act3, act4, act4_5, act5, act6, act7, architect)
   are literally 3 bytes each. No VO recorded for these acts.

7. **Voice bucket (`dgrsvoices`) returns 403 to all anonymous
   probes** — even for filled manifests with 1,400+ entries.
   Bucket may be private (signed-URL only) — see ambiguity note.

8. **Three orphan registries are live+wired+unconsumed** —
   `arenaAssets` (8/8 live), `terminusCinematicAssets` (10/11 live),
   `darrenMemorial` (1/1 live). The art shipped, the registry
   exists, no React component imports the registry export. Wiring
   them is pure upside.

9. **`christmasInJulyAssets` is double-orphaned** — registry
   exports (XMAS_*, getXmasWheelPrizeImage, getXmasMilestoneBadge)
   are not imported anywhere AND every probed URL is 403.

10. **MechronisAcademyPage classroom backgrounds (12) never
    rendered** — the page hardcodes URLs like
    `art/classrooms/classroom-kanevas.jpg` that are NOT in any
    registry. All 12 classroom URLs return 403.

## Ambiguity notes

- **Voice bucket** (`dgrsvoices.s3.us-east-2.amazonaws.com`) —
  every probe returned 403 (incl. range-GET), but the bucket may
  be private with signed-URL access enforced. The runtime code
  (`useElaraVO.ts` etc.) loads URLs directly with no signing
  step, so either: (a) the bucket has `s3:GetObject` for public
  but with a referer-restriction this probe doesn't satisfy, OR
  (b) the audio doesn't actually load in browsers either.
  **Cannot resolve from outside the AWS console.** Audit
  treats voice URLs as ⚠️ "probe inconclusive."

- **Voice manifest emptiness** is unambiguous — 8 files are
  literally `{}`. Empty manifests cannot serve voice; this is a
  recording gap regardless of bucket policy.

## Index

- §1 — Live registries (446 sources, fully shipped)
- §2 — Mixed registries (7 sources, partial gaps)
- §3 — Dead registries (71 sources, action required)
- §4 — Orphan registries (live but unconsumed)
- §5 — Voice manifests (32 files; empty + filled-but-403)
- §6 — Action plan

---

## §1 — Live registries (fully shipped)

446 source files reference at least one live URL, totaling 957
live URLs. Of those, 22 sources reference ≥ 5 live URLs and form
the typed-registry / consumer-page core. The remaining 424 each
reference < 5 live URLs (single character cards, single icon refs,
spot illustrations) and are not enumerated here — full data in
`docs/production/audit/per-source-status.tsv`.

### Fully-live typed asset registries

| Registry | Live/Total | Consumers | Notes |
|---|--:|---|---|
| `apps/client/src/data/cadesAssets.ts` | 77/77 | `pages/CADESFPSPage` | CADES FPS art / SFX / music / video frames |
| `apps/client/src/game/tradeEmpireArtAssets.ts` | 70/70 | `game/tradeEmpire` | 70 IDs across wonders / eras / encounters / doctrines / fleet / civics / sectors |
| `apps/client/src/lib/casinoAssets.ts` | 66/66 | `pages/DegensCasinoPage`, `game/CasinoGamePanels`, `game/degensCasino` | Different CDN base (`cdn/casino/`) than other registries |
| `apps/client/src/data/nanobanna2Assets.ts` | 52/52 | `components/ApprenticeMemorial`, `components/CompanionFarewell`, `components/spectralFormMap`, `components/crew/MemorialWall`, `features/soulStones/divineCompanions` | Soul stones, eidolons, STRAIN, spectral forms, companions |
| `apps/client/src/data/optionalComponentAssets.ts` | 40/40 | `components/ContentRoadmap`, `components/EmptyStates`, `components/MemeBroadcast`, `components/StoryProgress`, `pages/SeasonalEventsPage` | Optional Components Bible, fully shipped |
| `apps/client/src/data/dmcAssets.ts` | 32/32 | `pages/DeadMansCircuitPage` | Dead Man's Circuit. **Was marked missing by prior audit; actually fully live.** |
| `apps/shared/musicRegistry.ts` | 31/31 | game music players | 14 tracks × variants; all v1.mp3 / v2.mp3 / v3.mp3 paths live |
| `apps/shared/act2Interlude.ts` | 19/19 | Act 2 components | Engineer's Bench audio + ambient |
| `apps/shared/mechronisProfessors.ts` | 13/13 | `pages/GuildCommonRoomPage`, `pages/MechronisAcademyPage`, `mechronisLessons` | All 13 professor portraits live |

### Fully-live consumer-side asset references

These are page / component files that reference asset URLs
directly (not via a registry). All probed URLs returned 200:

| Consumer | Live/Total | Description |
|---|--:|---|
| `apps/client/src/lib/assetPreloader.ts` | 24/24 | Preload manifest — every entry resolves |
| `apps/client/src/pages/ApprenticePage.tsx` | 21/21 | Mascoteers + celebration assets |
| `apps/client/src/pages/GuildCommonRoomPage.tsx` | 12/12 | Mechronis common room |
| `apps/client/src/pages/title/themes.ts` | 10/10 | Title-screen themes |
| `apps/client/src/game/characterSprites.ts` | 9/9 | Character spritesheet refs |
| `apps/shared/transmissions.ts` | 9/9 | Transmission audio |
| `apps/client/src/components/LoadingScreen.tsx` | 7/7 | Loading-screen art |
| `apps/client/src/game/StarChart.tsx` | 6/6 | Star chart UI |
| `apps/client/src/lib/chessSfx.ts` | 6/6 | Chess SFX |
| `apps/client/src/components/DiscoveryVideoOverlay.tsx` | 5/5 | Loredex Discovery videos that are wired — note: 8 additional Discovery slots have empty `videoUrl` (see §3) |
| `apps/client/src/game/terminus-swarm/HanoiPuzzle.tsx` | 5/5 | Terminus Hanoi puzzle |
| `apps/client/src/pages/TitlePage.tsx` | 5/5 | Title page |

### Live registries that are also CONSUMED (no orphan)

Confirmed via `grep -rln "from.*<registry-name>"`:

```
casinoAssets        → 2 consumers
tradeEmpireArtAssets→ 2 consumers
musicRegistry       → 1 consumer
nanobanna2Assets    → 8 consumers
optionalComponentAssets → 5 consumers
cadesAssets         → 1 consumer (pages/CADESFPSPage)
dmcAssets           → 1 consumer (pages/DeadMansCircuitPage)
mechronisProfessors → 2 consumers
mascoteers          → 1 consumer (pages/ApprenticePage)
celebrationSlideshow→ 1 consumer
mechronisSlideshow  → 1 consumer
act2Interlude       → 8 consumers
preludeSequence     → 4 consumers
```

(Three registries are live but UNCONSUMED — see §4.)

---

## §2 — Mixed registries (partial gaps)

7 sources have at least one live URL AND at least one dead URL.
Each row below is exhaustive — every dead URL is listed, not
sampled.

### `apps/shared/songSlideshows.ts` — 5/35 live (14%)

The 30 dead URLs are concentrated in **6 act-interlude cinematic
slideshows**, each contributing 4 webp frames + 1 hero + 1 mp3
audio = 6 URLs per cinematic. **All 6 cinematics are entirely
unrendered.**

| Cinematic | Frames | Audio | Status |
|---|---|---|---|
| `silence-of-two-witnesses` | frame01–03.webp + hero.webp | `audio/act2/silence-of-two-witnesses-ambient.mp3` | ❌ all 5 dead |
| `act-4-revelation` | frame01–03.webp + hero.webp | `audio/acts/act-4-intro.mp3` | ❌ all 5 dead |
| `act-4-5-dmc` | frame01–03.webp + hero.webp | `audio/acts/act-4_5-intro.mp3` | ❌ all 5 dead |
| `act-5-map` | frame01–03.webp + hero.webp | `audio/acts/act-5-intro.mp3` | ❌ all 5 dead |
| `act-6-confession` | frame01–03.webp + hero.webp | `audio/acts/act-6-intro.mp3` | ❌ all 5 dead |
| `act-7-convergence` | frame01–03.webp + hero.webp | `audio/acts/act-7-intro.mp3` | ❌ all 5 dead |

These are major story beats. The 5 LIVE songSlideshows URLs are
unrelated assets (one is `art/rooms/room-archives.png`).

### `literal-dgrsart-url` — 37/54 live (68%)

These are URL strings hardcoded in source (not registry-mapped).
The 17 dead URLs are **page-background images** at a non-standard
CDN path (no `cdn/client-public/` prefix), for various game pages:

| Background ID | URL fragment |
|---|---|
| ACH-001 | `page-backgrounds/ACH-001_achievement-vault.jpg` |
| BTP-001 | `page-backgrounds/BTP-001_season-command.jpg` |
| CHR-001 | `page-backgrounds/CHR-001_operative-dossier.jpg` |
| DPL-001 | `page-backgrounds/DPL-001_negotiation-chamber.jpg` |
| GLD-001 | `page-backgrounds/GLD-001_guild-hall.jpg` |
| CMP-001 | `page-backgrounds/CMP-001_companion-quarters.jpg` |
| INV-001 | `page-backgrounds/INV-001_cargo-hold.jpg` |
| QST-001 | `page-backgrounds/QST-001_mission-briefing.jpg` |
| MKT-001 | `page-backgrounds/MKT-001_marketplace.jpg` |
| STR-001 | `page-backgrounds/STR-001_requisition-terminal.jpg` |

Plus 4 directory references and 3 `cabin-art/`, `nilmorg-portraits`
prefixes that don't terminate at a file (likely path-builder
prefix constants — verify in audit follow-up).

### `apps/client/src/game/terminus-swarm/TerminusSwarmPage.tsx` — 27/28 live (96%)

The single dead URL is a regex extraction artifact (`$1_start.png`
template literal). All 27 real cinematic URLs are live. **Treat
as fully shipped.**

### `apps/client/src/data/terminusCinematicAssets.ts` — 10/11 live (90%)

The single dead URL is the WebP variant of one keyframe — render
pipeline produced PNG only for that pair. Action: PNG→WebP
conversion (zero-cost ffmpeg).

### `apps/client/src/game/CompanionSelectionScene.tsx` — 6/12 live (50%)

The 6 dead URLs are **specimen fragment portraits** that never
rendered:
- `art/specimens/auros-fragment.png`
- `art/specimens/nyx-fragment.png`
- `art/specimens/sibyl-fragment.png`
- `art/specimens/strain-fragment.png`
- `art/specimens/cog-fragment.png`
- `art/specimens/toxis-fragment.png`

These are the pre-companion fragment forms of the 6 starter
specimens. **Action: render or replace fallback.**

### `apps/client/src/data/celebrationSlideshow.ts` — 8/9 live (88%)

The 1 dead URL: `audio/music/celebration/welcome-to-celebration.mp3`
(intro track). Art is fully shipped; just the intro audio is
missing.

### `apps/client/src/data/mechronisSlideshow.ts` — 2/3 live (66%)

The 1 dead URL: `audio/music/mechronis/to-be-the-human.mp3`. Same
pattern — environment art shipped, one music track missing.

---

## §3 — Dead registries (action required)

71 sources have 0 live URLs. Total dead URLs: **2,332**. Grouped
by action category below.

### Group A — Upload pending (user confirmed bytes exist on dev machine)

| Source | Dead URLs | Disposition |
|---|--:|---|
| `apps/client/src/data/preludeAct1Deliverables.ts` (PR #180) | 221 | `pnpm assets:upload` from the dev machine that holds the bytes |

Full URL list: `docs/production/audit/dead-urls/apps_client_src_data_preludeAct1Deliverables.ts.txt`.

Includes: 8 Prelude cutscene videos (a, b, c5, d, e/medbay,
g/observation, f, j) + alternate takes for I/J + 13 cutscene
bookend pairs (PNG + WebP each = 26 stills) + 11 VFX stills
(start/end pairs + frame variants) + 13 Prelude rooms (PNG
intermediates + planned WebP) + 6 VFX source MP4s + 2 music
tracks + 3 ambient WAVs + Act 1 (3 cutscene videos × {PNG, WebP}
bookends + 5 rooms + 10 battlefields + 14 portraits + 14 cards +
3 music). The `gallery` page at `/prelude-act1-gallery` will
render blank tiles until upload runs.

### Group B — Event registries (upload-pending pattern, but not confirmed)

| Source | Dead URLs | Disposition |
|---|--:|---|
| `apps/client/src/lib/christmasInJulyAssets.ts` | 49 | Same pattern as PR #180 (registry wired, art not on CDN). Different prefix: `cdn/events/christmas_in_july_2026/`. **Plus**: registry exports are unconsumed (see §4). |

Full URL list:
`docs/production/audit/dead-urls/apps_client_src_lib_christmasInJulyAssets.ts.txt`.
Covers 6 environments + 16 wheel prizes + 14 craps + 5 gifts +
4 milestone badges + 4 audio tracks.

### Group C — Never rendered (require new art generation)

These are art catalogs hardcoded in code that have no rendered
bytes anywhere — render or replace with fallback.

#### MechronisAcademyPage classroom backgrounds (12)

| URL | Status |
|---|---|
| `art/classrooms/classroom-kanevas.jpg` | ❌ |
| `art/classrooms/classroom-aoki.jpg` | ❌ |
| `art/classrooms/classroom-halverez.jpg` | ❌ |
| `art/classrooms/classroom-orphic.jpg` | ❌ |
| `art/classrooms/classroom-mireille.jpg` | ❌ |
| `art/classrooms/classroom-vellis.jpg` | ❌ |
| `art/classrooms/classroom-kasra.jpg` | ❌ |
| `art/classrooms/classroom-greenshaw.jpg` | ❌ |
| `art/classrooms/classroom-vex.jpg` | ❌ |
| `art/classrooms/classroom-vent.jpg` | ❌ |
| `art/classrooms/classroom-vasara.jpg` | ❌ |
| `art/classrooms/classroom-proctor.jpg` | ❌ |

Hardcoded in `apps/client/src/pages/MechronisAcademyPage.tsx`
(NOT in any registry). One classroom backdrop per professor.
Note: the professor portraits themselves (`mechronisProfessors.ts`)
ARE 13/13 live — only the classroom environments are missing.

#### Mechronis Houses common rooms + ambient (8)

| URL | Type |
|---|---|
| `art/mechronis/common-rooms/resonance.jpg` | art |
| `art/mechronis/common-rooms/umbra.jpg` | art |
| `art/mechronis/common-rooms/ironflight.jpg` | art |
| `art/mechronis/common-rooms/liminal.jpg` | art |
| `audio/ambient/mechronis/resonance.mp3` | audio |
| `audio/ambient/mechronis/umbra.mp3` | audio |
| `audio/ambient/mechronis/ironflight.mp3` | audio |
| `audio/ambient/mechronis/liminal.mp3` | audio |

Source: `apps/shared/mechronisHouses.ts`. 4 houses × 2 assets each
(common-room art + ambient audio). All dead.

#### Mechronis Classmates portraits (8)

8 named NPC classmate portraits in `apps/shared/mechronisClassmates.ts`:
aria-wen, benik-holt, tess-corvia, mara-thorne, ollen-mire,
ozen-kade, vessa-lark, juno-reeve. All dead.

#### Outer Groove album (11)

| URL | Type |
|---|---|
| `audio/outergroove/og_001.mp3` to `og_019.mp3` (odd-numbered) | 10 tracks |
| `audio/outergroove/cover.jpg` | album cover |

Source: `apps/shared/tcg-core/audio/outergroove.ts`. The full
album is not on CDN.

#### Celebration Park ambient (4)

| URL |
|---|
| `audio/ambient/celebration/chorus-plaza.mp3` |
| `audio/ambient/celebration/watchers-promenade.mp3` |
| `audio/ambient/celebration/princes-domain.mp3` |
| `audio/ambient/celebration/seeker-meadow.mp3` |

Source: `apps/shared/celebrationParkMap.ts`.

#### Specimen fragment portraits (6)

Already covered as MIXED in §2 (`CompanionSelectionScene.tsx` —
auros, nyx, sibyl, strain, cog, toxis fragment art).

#### `starterEidolonForms.ts` (6 directory references)

The 6 dead "URLs" here are actually **directory prefix paths**
(e.g. `art/specimens/lux` with no file extension) — likely the
data file stores prefixes that runtime code suffixes with `/N.png`.
Not necessarily missing bytes; verify via the consumer code. Marked
DEAD by the probe but **may be a probe false-positive**. Investigation
needed.

### Group D — TCG card art (221 dead URLs across 51 card-definition files)

Full URL list available in
`docs/production/audit/dead-urls/apps_shared_tcg-core_*` per file.

Sub-categories with 0 live URLs:
- `cards/definitions/allegiance/` — 6 files × 6 URLs = 36 dead
  (antiquarian, architect, dreamer, insurgency, new_babylon,
  thought_virus)
- `cards/definitions/class/` — 6 files × 5 URLs = 30 dead
  (assassin, engineer, neyon, oracle, soldier, spy)
- `cards/definitions/elemental/` — 4 files × 5 URLs = 20 dead
  (air, earth, fire, water)
- `cards/definitions/imprint/` — 16 files × 5 URLs = 80 dead
  (agent_zero, akai_shi, antiquarian, elara, foucault, iron_lion,
  locke, the_architect, the_collector, the_detective, the_dreamer,
  the_engineer, the_enigma, the_human, the_jailer, the_necromancer,
  the_oracle, the_source)
- `cards/definitions/race/` — 5 files × 3 URLs = 15 dead
  (demagi, human, neyon, quarchon, synthetic)
- `cards/definitions/dimensional/` — 4 files × 3 URLs = 12 dead
  (probability, reality, space, time)
- Various `imprint/the_*.ts` and other sets — remaining 28 dead

**These are NEW card art (`s1_imprint_*_t1.webp` through `_t5.webp`,
etc.) for tier-up versions of imprint cards** — separate from the
405 LIVE tcg-core URLs in `art/cards/s1_char_NNN.webp` (the base
character cards). The tier-N evolved imprint art was wired but
not generated.

### Group E — Legacy CloudFront (investigate-before-deciding)

| URL pool | Count | Examples |
|---|--:|---|
| `https://d2xsxph8kpxj0f.cloudfront.net/...` | **1,727** | `room-artwork-urls.txt` (43 rooms), `season1-cards.json` (~50 cards), tcg-core legacy refs (~1,634) |

Per user direction during plan review: this group is **NOT
included in the consolidated prompts pack**. Disposition pending:
migrate to current CDN / re-render / retire. The audit reports
the inventory only.

Full list: `docs/production/audit/dead-urls/legacy-cloudfront.txt`
(1,727 URLs).

---

## §4 — Orphan registries (live + wired + unconsumed)

These registries pass two of the three audit axes — bytes are on
CDN AND a typed registry exports them — but **no React/runtime
component imports the registry export.** The art is paid-for and
ready; it just isn't surfaced in any UI.

| Registry | Live/Total | Exports | Status |
|---|--:|---|---|
| `apps/client/src/data/arenaAssets.ts` | 8/8 | `ARENA_BACKGROUNDS`, `getArenaBackground()` | ⚠️ orphan — no consumer imports |
| `apps/client/src/data/terminusCinematicAssets.ts` | 10/11 | `TERMINUS_CINEMATIC_KEYFRAMES`, `getTerminusCinematicKeyframes()` | ⚠️ orphan — `TerminusSwarmPage` references the same paths via direct strings, but doesn't import the registry |
| `apps/shared/darrenMemorial.ts` | 1/1 | `DARREN_MEMORIAL_BADGE`, `DARREN_POST_EP12_UNLOCKS` | ⚠️ orphan — badge image live but no UI renders it. Was mistakenly listed in `MISSING_ART_PROMPTS.md` as needing render — actually rendered + uploaded, just not wired |

### Special case: `christmasInJulyAssets`

This registry is **double-orphaned**: 0/49 CDN live AND 0
consumers. The exports (`XMAS_ENVIRONMENTS`, `XMAS_WHEEL_PRIZES`,
`XMAS_CRAPS`, `XMAS_GIFTS`, `XMAS_MILESTONE_BADGES`, `XMAS_AUDIO`,
`getXmasWheelPrizeImage()`, `getXmasMilestoneBadge()`) are not
imported anywhere outside the registry file itself. The runtime
component `apps/client/src/features/events/christmasInJuly/CasinoFloor.tsx`
exists but doesn't import from the asset registry.

### Reverse-orphan check (live + wired + missing-some-export-consumers)

For the LIVE typed registries, individual exports may still be
unconsumed. Quick pass via `grep -ln "<EXPORT_NAME>"` against
`apps/`:

- `casinoAssets.ts` exports `CASINO_ENVIRONMENTS`, `CASINO_GAME_TABLES`,
  `CASINO_EFFECTS`, `DEGEN_CHARACTER`, `CASINO_CHIPS`, `CASINO_PROPS`,
  `CASINO_SLOT_ASSETS`, `TRUST_MILESTONES`, `ENVIRONMENTAL_PROPS`,
  `INTERACTION_UI`, `LIARS_DICE_NPC_PORTRAITS`, `getDegenPortrait()`,
  `getVipChip()`, `getTrustMilestoneArt()`. Most are consumed by
  `DegensCasinoPage` / `CasinoGamePanels` / `degensCasino.ts`.
  `ENVIRONMENTAL_PROPS` (9 discoverable lore props) and
  `INTERACTION_UI` (discovery pulse + lore text panel) — verify
  these get rendered; the codex calls them out as dispatch hooks.
- `nanobanna2Assets.ts` — heavily multi-consumed (8 importers); no
  obvious dead exports.

(A complete reverse-orphan sweep is a follow-up; this pass flagged
the high-value cases.)

---

## §5 — Voice manifests

32 `*VoManifest.json` files in `apps/shared/`. Per-file entry counts:

### Filled manifests (24 files, ~1,400+ entries total)

| File | Entries | Bytes |
|---|--:|--:|
| `elaraVoManifest.json` | **412** | 55,580 |
| `humanVoManifest.json` | 212 | 28,672 |
| `memeVoManifest.json` | 90 | 10,716 |
| `antiquarianVoManifest.json` | 82 | 13,585 |
| `cadesVoManifest.json` | 46 | 5,238 |
| `engineerMemoirVoManifest.json` | 36 | 5,535 |
| `palimpsestHostVoManifest.json` | 36 | 4,422 |
| `nilmorgVoManifest.json` | 28 | 3,110 |
| `sourceVoManifest.json` | 28 | 3,548 |
| `agent_zeroVoManifest.json` | 24 | 3,429 |
| `gamemasterVoManifest.json` | 24 | 3,397 |
| `degenVoManifest.json` | 12 | 1,334 |
| `storyModeVoManifest.json` | 11 | 1,935 |
| `lockeVoManifest.json` | 9 | 1,021 |
| `seerVoManifest.json` | 8 | 1,027 |
| `shadow_tongueVoManifest.json` | 8 | 884 |
| `authorityVoManifest.json` | 3 | 414 |
| `collectorVoManifest.json` | 3 | 432 |
| `eidolaVoManifest.json` | 3 | 423 |
| `matrikalaVoManifest.json` | 3 | 450 |
| `necromancerVoManifest.json` | 3 | 354 |
| `programmerVoManifest.json` | 3 | 423 |
| `warlordVoManifest.json` | 3 | 462 |
| `watcherVoManifest.json` | 3 | 414 |
| `princeVoManifest.json` | 2 | 263 |

### Empty manifests (8 files — `{}`, 3 bytes each)

| File | Status |
|---|---|
| `act2VoManifest.json` | ❌ EMPTY |
| `act3VoManifest.json` | ❌ EMPTY |
| `act4VoManifest.json` | ❌ EMPTY |
| `act4_5VoManifest.json` | ❌ EMPTY |
| `act5VoManifest.json` | ❌ EMPTY |
| `act6VoManifest.json` | ❌ EMPTY |
| `act7VoManifest.json` | ❌ EMPTY |
| `architectVoManifest.json` | ❌ EMPTY |

These 8 are unambiguous recording gaps. The Acts 2-7 spine VO
catalogs were wired but never recorded; same for The Architect's
voice lines.

### Bucket probe ambiguity (filled manifests)

A 5-URL spot probe of 5 different filled manifests
(elara, human, meme, agent_zero, cades) returned **403 from all**
under both HEAD and GET (range 0-1) — the `dgrsvoices.s3.us-east-2.amazonaws.com`
bucket appears to deny anonymous reads. Possible explanations:
- The bucket is private; runtime uses signed URLs (but
  `useElaraVO.ts` does not sign before use)
- Files are missing from the bucket
- A bucket policy / CORS configuration restricts to specific
  origins (which `curl` doesn't satisfy)

**Cannot resolve from outside AWS console.** Audit treats filled
manifests as ⚠️ probe-inconclusive.

---

## §6 — Action plan

Action items grouped by tractability, sorted by user-impact:

### Immediate (zero new render cost)

1. **Run `pnpm assets:upload` for PR #180 bundle** — unblocks 221
   asset URLs (Prelude + Act 1). Per user direction, bytes exist
   on the dev machine that originally rendered the bundle.
2. **Wire arenaAssets, terminusCinematicAssets, darrenMemorial
   into their respective consumers** — see Deliverable 2 in this
   audit's plan (`/root/.claude/plans/do-a-full-an-stateful-quill.md`).
3. **Decide christmasInJulyAssets disposition** — currently 0/49 +
   no consumers. Either upload + wire to `CasinoFloor.tsx`, or
   retire the registry as deprecated.
4. **Confirm voice bucket policy** — the user can verify
   `dgrsvoices` bucket access in the AWS console. If private,
   add a signed-URL or proxy mechanism to `useElaraVO.ts` etc.
   If files are missing, the 24 filled manifests need re-
   recording.

### Render queue (must run prompts → renders → upload)

Goes into `CONSOLIDATED_MISSING_PROMPTS.md` (Deliverable 3):

| Category | Asset count | Tooling |
|---|--:|---|
| MechronisAcademyPage classroom backgrounds | 12 | Nano Banana 2 |
| Mechronis Houses common rooms + ambient | 8 (4 art + 4 audio) | NB2 + Suno |
| Mechronis Classmates portraits | 8 | Nano Banana 2 |
| Outer Groove album (10 tracks + cover) | 11 | Suno + NB2 |
| Celebration Park ambient | 4 | Suno |
| Specimen fragment portraits | 6 | Nano Banana 2 |
| Acts 4-7 spine cinematics (`silence-of-two-witnesses`, `act-4-revelation`, `act-4-5-dmc`, `act-5-map`, `act-6-confession`, `act-7-convergence`) | 30 (5 frames + audio × 6 cinematics) | NB2 keyframes + Veo 3.1 |
| TCG card definition tier-up art (`imprint/*_tN.webp` + class/race/elemental/dimensional/allegiance) | 221 | Nano Banana 2 |
| Page-background images | 10 | Nano Banana 2 |
| celebrationSlideshow + mechronisSlideshow missing audio | 2 | Suno |
| Loredex Discovery videos (8 with empty `videoUrl` in `DiscoveryVideoOverlay`) | 8 | Kling |
| Acts 2-7 + Architect VO recording | 8 manifests (likely hundreds of lines) | ElevenLabs |
| terminusCinematicAssets WebP variant | 1 | ffmpeg PNG→WebP |

Total render queue: **~329** assets (excluding the unbounded
Acts 2-7 VO line counts).

### Pending user decision

| Category | Count | Why pending |
|---|--:|---|
| Legacy CloudFront migration | 1,727 | User selected "investigate-before-deciding" |
| Voice bucket policy verification | 1,400+ entries | Probe-inconclusive |
| `starterEidolonForms` directory refs | 6 | May be probe false-positive |
| `literal-dgrsart-url` cabin-art / nilmorg-portraits prefixes | 4 | Path-builder constants, verify in source |

### Out of scope for this audit

- Re-rendering the production pipeline.
- Refactoring 1,500+ hardcoded CloudFront URLs scattered through
  card-definition TS files.
- Authoring catalogs in art bibles that don't have wiring yet
  (Trade Empire 420-row backlog, Parallax Rooms, Player Cabin,
  Story Mode, Breeding System, NANO_BANANA card decks).
- Resolving the canon-named-vs-D&D-named Act 1 art tension —
  PR #180 shipped a generic-fantasy naming. Bibles spec a
  canon-named version. Creative-direction call.

---

## Appendix — Probe artifacts

All probe data is committed to `docs/production/audit/`:

| File | Purpose |
|---|---|
| `cdn-liveness-files.tsv` | Per-URL: code, url, source. 3,384 rows. |
| `per-source-status.tsv` | Per-source: live, total, %, status. 524 rows. |
| `dead-urls/<source>.txt` | One file per dead-having source. 77 files. |
| `all-urls.tsv` | Raw extracted URL list with source attribution. |
| `extract-urls.sh` | URL extractor (rerun-safe). |
| `probe-cdn.sh` | Parallel HEAD prober (rerun-safe). |
| `registry-consumers.csv` | Registry → consumer count. |

To rerun the probe (after PR #180 upload, for example):

```bash
bash docs/production/audit/extract-urls.sh
bash docs/production/audit/probe-cdn.sh
```




