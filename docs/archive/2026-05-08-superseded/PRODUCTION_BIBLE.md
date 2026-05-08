# Loredex OS — Asset & VO Production Bible

**Document role.** Single-source dashboard of what is *designed* in the codebase versus what has been *generated, staged, or shipped to the CDN*. Generated 2026-05-02 from a fresh repo scan. Supersedes the previous Collector's Arena draft of this filename.

**Scope.** Four registers: (1) art manifests vs. CDN coverage, (2) VO that is written but not yet generated, (3) VO that is referenced in code but not yet written, (4) per-subsystem art gaps.

---

## Executive Summary

The art surface is overwhelmingly producer-delivered and CDN-resident: 11 typed manifests under `apps/shared/expansionArt/` declare **~3,300 producer assets** (album frames, cinematic mp4s + keyframes, VFX clips, base-set + Hierarchy card art, login Meme cinematic shots, guild cutscenes, professor signature triggers). The local `apps/client/public/` tree holds only **~45 binary files** — almost entirely Prelude room art, Prelude VFX clips, and PWA icons. Everything else lives on `dgrsart` S3 at `cdn/client-public/`. The `_check-art-coverage.mjs` HEAD-probe currently audits 928 producer keys.

VO is in much better shape: `_vo-audit.mjs` reports **0 missing** generations across **24 audited surfaces** (2,136 manifest entries fully cover the 1,044 distinct script-line ids — the manifest count is higher because per-speaker manifests like `elara` and `human` aggregate lines from many sources including dialog trees, companion lines, prelude CSVs, and act scripts). Generators are idempotent.

**Top three real gaps right now:**
1. **NPC first-meeting dialog VO is referenced but not written.** 63 distinct `voLineId`s appear in `apps/shared/npcs/dialogTrees/<character>/first_meeting.ts` (vex, degen, seer, locke, gm, meme, nilmorg, hierophant, oracle) with no matching script-JSON entry and no manifest URL. The dialog UI will fall back to text-only until these scripts are authored.
2. **Dreamer Vision 4 ("The Dreamer Sees You", threshold 23) is held.** Visions 1–3 are built; Vision 4 is stubbed pending writers' caption ratification. The two Veo flashes it depends on (`vfx_iris_collapse`, `vfx_cryo_frost_retreat`) ARE typed in `cinematicsManifest.ts` and either ship from the producer drop or degrade to keyframe stills.
3. **Albums 2-5 frames** (~1,691 webp keyframes across 93 tracks) are typed in their `albumNSlideshows.ts` registries but the producer drop pipeline is the only thing standing between them and the CDN. They are the long pole for any reader-facing slideshow content past Album 1.

---

## SECTION 1 — Art designed vs. on-CDN

### 1.1 Typed manifests under `apps/shared/expansionArt/`

| Manifest | Declared assets | On disk under `apps/client/public/` | Likely on CDN | Delta (designed-not-shipped) |
|---|---|---|---|---|
| `album1Slideshows.ts` (30 tracks) | 490 webp frames | 0 | Yes — Album 1 is the live reference album per `dreamerVisions.ts` ("Album 1 frames live on the CDN today") | 0 known gaps |
| `album2Slideshows.ts` (21 tracks) | 334 webp frames | 0 | Partial — referenced as "typed but not yet uploaded" by the Dreamer-Visions doc-comment | ~334 frames pending CDN upload |
| `album3Slideshows.ts` (23 tracks) | 567 webp frames | 0 | Partial — same status as Album 2 | ~567 frames pending |
| `album4Slideshows.ts` (11 tracks) | 200 webp frames | 0 | Partial — same status | ~200 frames pending |
| `album5Slideshows.ts` (37 tracks + 20 narrator portraits + 18 dialog backgrounds) | 590 webp frames + portraits/bgs (~628 total entries; 40 single `relPath:` rows for portraits/bgs) | 0 | Producer drop landed 2026-04-29 (`SilenceInHeaven_Album6_Complete.zip`); upload status pending | ~590 frames pending CDN verification |
| `cinematicsManifest.ts` (CINEMATICS, 9 entries) | 9 mp4s + 41 keyframe webps = 50 | 0 | Yes — producer drop 2026-04-28 + audit script verifies | 0 known gaps |
| `cinematicsManifest.ts` (VFX_CLIPS, 21 entries across 5 categories) | 21 mp4s + 21 keyframe webps = 42; includes 3 `dreamer_visions` Veo flashes | 6 mp4s under `art/vfx/prelude/` (NOT the same set — these are Prelude bespoke VFX) | Yes for shipped VFX; the 3 `dreamer_visions` clips degrade to held keyframes if mp4 is absent | Verify `vfx_substrate_pulse`, `vfx_iris_collapse`, `vfx_cryo_frost_retreat` mp4s; keyframes cover the failure path |
| `hierarchyOfDamned.ts` | 125 art entries (assetId → relPath) | 0 | Yes — covered by `_check-art-coverage.mjs` HEAD probe | 0 known gaps |
| `dischordiaBaseSet.ts` (BASE_SET + TIER_GRIDS) | 652 art entries (605 base + 47 tier grids approx) | 0 | Yes — covered by `_check-art-coverage.mjs` HEAD probe | 0 known gaps |
| `loginMemeSequence.ts` (Kling Omni 3:45 cinematic) | 16 shots (no `.webp`/`.mp4` literals — script + prompts only; the rendered shots are produced as a single chained Kling Omni job) | 0 | Generation-pending — this is a producer cinematic that has not been rendered/uploaded yet | Entire 3m45s cinematic + chained shot keyframes |
| `guildCutscenesManifest.ts` | 10 distinct mp4 paths emitted by `videoPath()` helpers + 24 professor signature variants (`cs_sig_<N>_<light|dark>.mp4` × 12 professors) ≈ 34 cutscene mp4s | 0 | Partial — Onboarding (5), Daily (`f2_daily`), Combat (`f3_combat`), Epoch change, and 24 Signature cutscenes all reference live producer mp4s; signatures are gated by `professorSignatureCards.ts` (14 mappings live) | Verify all 24 signature mp4s + `cs_epoch_change.mp4` are uploaded |
| `professorSignatureCards.ts` | 14 cardDefId → professorId mappings (no asset paths — cinematic side-effect registry) | n/a | n/a | n/a (folds into `guildCutscenesManifest.ts`) |

**Aggregate for `apps/client/public/` (the local staging tree):**

| Bucket | Count | Notes |
|---|---|---|
| `art/rooms/prelude/` | 28 (.webp + .png) | 14 Prelude rooms × 2 formats. Source-of-truth lives here for the Prelude UI; CDN mirror identical |
| `art/vfx/prelude/` | 6 mp4 | film-damage-overlay, hologram-materialize, pod-hatch-cryogas, sepia-drain, breath-pulse-strip, cryo-frost-retreat |
| `audio/ambient/prelude/` | 0 binary, 1 `.gitkeep` | Empty — Prelude ambient bed not staged yet |
| `icons/` | 9 png | PWA icons |
| `references/`, `characters/` | 0 binary, structure only | Holding pens for legacy refs |
| **Other** | manifest.json, sw.js, robots.txt, sitemap.xml, etc. | Boilerplate |

**Card-art register (`apps/shared/tcg-core/cards/definitions/`):**

| Surface | Count |
|---|---|
| Card-definition `.ts` files (excluding tests) | 473 |
| Distinct `art/cards/...` paths referenced (raw string literal grep) | 1,139 |
| Distinct paths shipped to local public dir | 0 |
| Therefore: card art is **100% CDN-resident**; no local card-art staging |

**Commentary.** The asset model is "everything ships from `dgrsart` S3 except the Prelude". Prelude lives both on disk (for fast Vite dev cycles) and on the CDN. Once a producer drop is uploaded, the typed manifest is the contract — `_check-art-coverage.mjs` HEAD-checks every URL the manifest expresses. Today the script verifies four manifests (trade-empire, hierarchy-of-damned, base-set + tier grids, cinematics + VFX, album1 frames) totalling 928 keys. Albums 2–5 (~1,691 frames + 78 portrait/bg singles), the rendered Login-Meme cinematic, and the 24 professor-signature guild cutscenes are the largest typed-but-unverified blocks.

---

## SECTION 2 — VO designed vs. generated

`scripts/_vo-audit.mjs` is the canonical coverage probe. It reads every `apps/scripts/*-lines.json` (and the prelude/act1 CSVs) as the *designed-line* source and every `apps/shared/*VoManifest.json` as the *generated-line* register. Run from repo root: `node scripts/_vo-audit.mjs`.

**Latest run (2026-05-02):** TOTAL missing across all surfaces = **0**.

### 2.1 Per-surface coverage

| Surface | Script lines (designed) | In manifest | Missing | Generator |
|---|---:|---:|---:|---|
| `agent_zero` | 23 | 23 | 0 | `python3 apps/scripts/generate_agent_zero_vo.py` |
| `antiquarian` | 8 | 8 | 0 | `python3 apps/scripts/generate_antiquarian_vo.py` |
| `cades` | 43 | 43 | 0 | `python3 apps/scripts/generate_cades_vo.py` |
| `degen` | 12 | 12 | 0 | `python3 apps/scripts/generate_degen_vo.py` |
| `elara` (script-driven slice) | 193 | 193 | 0 | `python3 apps/scripts/generate_elara_vo.py` |
| `human` (script-driven slice) | 95 | 95 | 0 | `python3 apps/scripts/generate_human_vo.py` |
| `locke` | 7 | 7 | 0 | `python3 apps/scripts/generate_locke_vo.py` |
| `meme` | 87 | 87 | 0 | `python3 apps/scripts/generate_meme_vo.py` |
| `necromancer` | 3 | 3 | 0 | `python3 apps/scripts/generate_necromancer_vo.py` |
| `nilmorg` | 28 | 28 | 0 | `python3 apps/scripts/generate_nilmorg_vo.py` |
| `shadow_tongue` | 8 | 8 | 0 | `python3 apps/scripts/generate_shadow_tongue_vo.py` |
| `source` | 27 | 27 | 0 | `python3 apps/scripts/generate_source_vo.py` |
| `story-mode` | 11 | 11 | 0 | `pnpm vo:story-mode` |
| `chess-climb` (gamemaster) | 41 | 41 | 0 | `pnpm tsx apps/scripts/generate-chess-climb-vo.ts` |
| `act2` | 28 | 28 | 0 | `pnpm vo:act2` |
| `act3` | 79 | 79 | 0 | `pnpm vo:te-sync && pnpm vo:act3` |
| `act4` | 8 | 8 | 0 | `pnpm vo:act4` |
| `act5` | 24 | 24 | 0 | `pnpm vo:act5` |
| `act6` | 15 | 15 | 0 | `pnpm vo:act6` |
| `act7` | 13 | 13 | 0 | `pnpm vo:act7` |
| `elaraLines.ts` (companion) | 210 | 210 | 0 | `pnpm vo:companion` |
| `humanLines.ts` (companion) | 49 | 49 | 0 | `pnpm vo:companion` |
| `prelude (csv)` | 4 | 4 | 0 | `pnpm vo:prelude` |
| `act1-opponent (csv)` | 144 | 144 | 0 | `pnpm vo:act1` |
| **TOTAL audited script-driven lines** | **1,160** (counts include duplicates that fold into per-speaker manifests) | **1,160** | **0** | — |

### 2.2 Per-character manifest sizes (independent register)

These are the *aggregate* per-character VO inventories — many are populated from multiple sources (script JSONs, companion `.ts` modules, act-script JSONs, prelude CSVs). The audit confirms every script-line id appears in one of them.

| Character | Manifest entries | | Character | Manifest entries |
|---|---:|---|---|---:|
| `elara` | 920 | | `act5` | 24 |
| `human` | 500 | | `agent_zero` | 24 |
| `meme` | 91 | | `act6` | 15 |
| `antiquarian` | 82 | | `act7` | 13 |
| `act3` | 79 | | `degen` | 12 |
| `cades` | 46 | | `storyMode` | 11 |
| `gamemaster` | 44 | | `awakening` | 11 |
| `palimpsestHost` | 36 | | `warlord` | 10 |
| `engineerMemoir` | 36 | | `architect` | 9 |
| `source` | 28 | | `locke` | 9 |
| `nilmorg` | 28 | | `seer` | 8 |
| `act2` | 28 | | `shadow_tongue` | 8 |
| `act4` | 8 | | `watcher` | 4 |
| `necromancer` | 4 | | `collector` | 4 |
| `vex`, `programmer`, `matrikala`, `eidola`, `authority` | 3 each | | `vent`, `vellis`, `vasara`, `proctor`, `prince`, `orphic`, `mireille`, `kasra`, `kanevas`, `halverez`, `greenshaw`, `aoki` | 2 each |
| `warden`, `politician`, `engineer`, `chorus`, `between` | 1 each | | `act4_5` | 0 (intentional — Act 4.5 is text-only narrative) |

**Commentary.** Generation pipeline is healthy. The two largest per-character manifests (`elara` 920, `human` 500) reflect those characters' double-duty as protagonist + companion — they aggregate companion-line modules (`elaraLines.ts`, `humanLines.ts`), Act 1 opponent CSVs, and `act3-vo-lines.json` Act 3 spillover. Per-act manifests track exactly the `apps/scripts/actN-vo-lines.json` script length, so any act-script change produces a one-line manifest delta on the next `pnpm vo:actN` run. All generators are idempotent — re-running them after a script edit will skip already-generated entries and only synthesize the new lines.

---

## SECTION 3 — VO that isn't written

This is the gap the audit script does **not** catch: lines referenced in code (`voLineId: "…"` in dialog trees) for which there is no script-JSON entry and consequently no manifest URL.

### 3.1 Method

We grepped every `voLineId:` literal under `apps/shared/`, deduplicated to **82 distinct ids**, and intersected against the union of all `apps/shared/*VoManifest.json` keys. Result: **63 declared ids are not present in any manifest**. By origin file these are nearly all in `apps/shared/npcs/dialogTrees/<character>/first_meeting.ts`.

### 3.2 By speaker

| Character (npc dialog tree) | Missing voLineIds | Source file |
|---|---:|---|
| `vex_solene` | 9 | `apps/shared/npcs/dialogTrees/vex_solene/first_meeting.ts` |
| `the_degen` | 9 | `apps/shared/npcs/dialogTrees/the_degen/first_meeting.ts` |
| `the_seer` | 6 | `apps/shared/npcs/dialogTrees/the_seer/first_meeting.ts` |
| `the_oracle` | 6 | `apps/shared/npcs/dialogTrees/the_oracle/first_meeting.ts` |
| `nilmorg` | 6 | `apps/shared/npcs/dialogTrees/nilmorg/first_meeting.ts` (note: `nilmorg-lines.json` covers a *different* 28-line set — companion comments, not first-meeting branches) |
| `the_meme` | 6 | `apps/shared/npcs/dialogTrees/the_meme/first_meeting.ts` |
| `adjudicator_locke` | 6 | `apps/shared/npcs/dialogTrees/adjudicator_locke/first_meeting.ts` (note: `locke-lines.json` covers 7 unrelated companion lines) |
| `the_game_master` | 6 | `apps/shared/npcs/dialogTrees/the_game_master/first_meeting.ts` (note: `chess-climb-lines.json` covers 41 different gamemaster lines for chess; first-meeting is its own surface) |
| `hierophant` (`wraith_calder/first_meeting.ts`) | 6 | `apps/shared/npcs/dialogTrees/wraith_calder/first_meeting.ts` |
| `vo`, `x`, `y` (test fixtures) | 3 | `apps/shared/dialogTree.test.ts` — IGNORE (test seeds) |
| **Total real first-meeting lines awaiting scripts** | **60** | — |

### 3.3 Other VO id surfaces (companion comments, transmissions, witnessing events, episode mysteries)

| Surface | `voLineId` references in code | Status |
|---|---:|---|
| `apps/shared/companionComments.ts` | 0 | Companion VO is generated from `apps/shared/elaraLines.ts` + `apps/shared/humanLines.ts` (which DO carry `lineId:` fields) — no extra ids needed. |
| `apps/shared/transmissions.ts` | 0 | Transmissions are videos + body copy; no per-broadcast VO id. |
| `apps/shared/witnessingEvents.ts` | 0 | No per-event VO id. |
| `apps/shared/episodeMysteries.ts` | 0 distinct voLineIds; mysteries reference clue/deduction/choice ids only, not VO. | VO for mystery dialog flows through the dialog-tree first-meeting surfaces above. |
| `apps/shared/dreamerVisions.ts` | 0 | Visions are caption + slideshow; no VO. |

### 3.4 Action

Each of the nine NPC `first_meeting.ts` modules needs a corresponding script-JSON of ~6–9 lines authored. Recommended slot: drop new files at `apps/scripts/<character>-first-meeting-lines.json`, register a generator entry in `_vo-audit.mjs`'s `surfaces` table, and the existing TS-driven companion-style pipeline (`pnpm vo:companion`) will pick them up. Or fold them into the per-character existing JSONs (e.g. add 6 `nilmorg.first_meeting.*` lines to `nilmorg-lines.json`).

**Commentary.** Sixty NPC first-meeting beats — typically root + 4–7 branch responses + one terminal — are the entire WRITTEN-NEEDED queue today. Until they ship, the dialog UI must fall back to silent text rendering for those nine encounters.

---

## SECTION 4 — Per-subsystem art status

### 4.1 Mystery Engine

| Source | Mystery / scene count | Asset references | Status |
|---|---:|---|---|
| `apps/shared/episodeMysteries.ts` | 6 arcs declared (`wraith_calder`, `jericho_jones`, `the_seer`, `vex_solene`, `game_master`, `the_degen`); ~5 episodes per arc | 0 direct image URLs in the file (clues + deductions + choices + suspects only — pure data graph) | Mystery boards reuse existing Loredex portrait + CADESConspiracyBoard plumbing per the design doc; no bespoke art block here |
| `apps/shared/roomMysteries/*.ts` (28 modules) | 28 rooms (antiquarianLibrary, archives, armory, bridge, cargoHold, captainsQuarters, chaosForge, cipherDen, commsArray, dreamsWorkshop, elementalNexus, engineering, engineeringCore, forgeWorkshop, guildSanctum, medicalBay, observationDeck, oracleSanctum, orderTribunal, quantumLab, shadowVault, socialHub, stationDock, synthesisChamber, warRoom, etc.) | 0 raw `art/` paths in the room mystery modules — they reference room-background art via the existing rooms registry (`apps/client/public/art/rooms/prelude/*` for Prelude rooms; CDN paths for the rest) | Prelude rooms shipped (28 files local + CDN); other rooms rely on shared room-art coverage |

**Commentary.** The Mystery Engine is data, not art. Its art surface bleeds through to (a) room backgrounds (covered by the rooms art track), (b) suspect portraits (covered by the existing card / loredex portrait set), and (c) clue thumbnails (currently rendered as iconography from lucide-react, not bespoke art). No mystery-specific commission queue is open.

### 4.2 Governance Hub

| Surface | Asset refs | Status |
|---|---:|---|
| `apps/server/routers/governance*.ts` | None found (no governance router file present) | The hub is currently client-only or routed through a generic router |
| `apps/client/src/pages/GovernanceHubPage.tsx` (800 LOC) | No `art/`, `assetUrl`, `imageUrl`, `backgroundImage`, or `portrait` references — uses lucide-react icons (Vote, BookOpen, Crown, Shield, etc.) and CSS `rgba()` panels for material treatment | No art commission queue; visual identity is icon + color-token driven |

**Commentary.** Governance Hub is intentionally chromeless — Tier-3A Void Energy material panels, lucide iconography, and live data. There is no missing-art block here.

### 4.3 Engineer's Logs

| File | Logs declared | Asset references |
|---|---:|---|
| `engineerLogs.ts` | 5 | None — logs are `transcript` + `mechanicExplanation` + `musicPrompt` (Suno/Udio) + `linkedCardDefIds` |
| `engineerLogs_batch2.ts` | 5 | None |
| `engineerLogs_batch3.ts` | 5 | None |
| `engineerLogs_batch4.ts` | 5 | None |
| `engineerLogs_factions.ts` | 7 | None |
| `engineerLogs_triggers.ts` | 7 | None |
| `engineerLogs_bloodborn.ts` | 7 | None |
| `engineerLogs_lionsClub.ts` | 1 | None |
| **Total** | **42** logs | 0 art assets — VO + music only |

**Commentary.** Engineer's Logs are an audio surface (Engineer voice take + Suno/Udio backing instrumental) with NO bespoke visual asset. The FNORD-23 browser UI is the visual; no log-specific commission. The 42 logs do, however, imply 42 instrumental tracks and 42 VO recordings — neither register is wired into `_vo-audit.mjs` today (the Engineer character manifest holds only 1 entry). This is a gap for a future generator.

### 4.4 Card art

| Register | Count |
|---|---:|
| Card definition files (`apps/shared/tcg-core/cards/definitions/**/*.ts`, excl. tests) | 473 |
| Distinct `art/cards/...` paths grepped from definitions | 1,139 |
| Local files under `apps/client/public/art/cards/` | 0 (directory does not exist) |
| Audited by `_check-art-coverage.mjs` | 652 (DISCHORDIA_BASE_SET_ART) + 47 (TIER_GRIDS) + 125 (HIERARCHY_OF_DAMNED_ART) + 142 (TRADE_EMPIRE) ≈ **966 keys cross-referenced today** |

**Commentary.** All card art is CDN-only — there is no local staging for cards. The art-coverage script verifies the three primary card registries (base set, hierarchy of damned, trade empire) plus tier grids. The delta between `1,139` distinct path references in definitions and `~966` audited keys is largely (a) deck-cover and special-card art that lives outside the typed registries and (b) per-tier file naming that resolves through helpers rather than literal strings. A formal sweep that walks every CardDefinition's `imageUrl` and HEADs each path would produce a definitive number.

### 4.5 Egregore sprites

| Source | Status |
|---|---|
| `apps/shared/expansionArt/egregoreSpriteManifest.ts` | **Does not exist.** No egregore-sprite typed registry has been created. |
| Any other egregore sprite asset block | None found in `apps/shared/` |

**Commentary.** The Egregore-sprite manifest referenced in the brief has not yet been authored. If egregore sprites are an active production track, the canonical pattern is to add a new typed manifest at `apps/shared/expansionArt/egregoreSpriteManifest.ts` modelled on `cinematicsManifest.ts` (typed `id` union → `relPath` strings → `assetUrl(...)` helper) and add it to the `_check-art-coverage.mjs` job list.

### 4.6 Dreamer Visions

| Vision | Threshold | Status | Assets it depends on |
|---|---:|---|---|
| Vision 1 — "The First Notice" | 3 | **Built and shipping** | Album 1 T03 ("Seeds of Inception") frames (CDN-live); 8 frames × 14s = 112s |
| Vision 2 — "The Coin Without a Face" | 7 | **Built** (10 frames × 14s = 140s) | Album frames typed but pending CDN verification per the doc-comment |
| Vision 3 — "The Hidden Hand" | 13 | **Built** (12 image frames × 14s + 3s flash) | Mixed image + Veo flash |
| Vision 4 — "The Dreamer Sees You" | 23 | **Stubbed pending writers' caption ratification** — entry in `VISIONS_BY_THRESHOLD` is commented out. Renderer supports the mixed shape; this is a content task, not an engine task. | Album 1 T23 (6 image frames) + `vfx_iris_collapse` opener + `vfx_cryo_frost_retreat` closer (both typed in `cinematicsManifest.ts` `dreamer_visions` category) |

| Dreamer-Visions Veo flash | Typed at | Mp4 status | Keyframe fallback |
|---|---|---|---|
| `vfx_substrate_pulse` | `cinematicsManifest.ts:332` | Producer drop pending verify | `art/vfx/dreamer_visions/kf_substrate_pulse.webp` |
| `vfx_iris_collapse` | `cinematicsManifest.ts:338` | Producer drop pending verify | `art/vfx/dreamer_visions/kf_iris_collapse.webp` |
| `vfx_cryo_frost_retreat` | `cinematicsManifest.ts:344` | Producer drop pending verify | `art/vfx/dreamer_visions/kf_cryo_frost_retreat.webp` |

**Commentary.** SongSlideshow.tsx falls back to the keyframe still on video-load failure, so any missing Veo mp4 degrades to a held image rather than breaking the cutscene. Vision 4's blocker is captions, not pixels.

### 4.7 Title screen + featured transmissions

`FEATURE_SPECS` in `apps/client/src/pages/TitlePage.tsx:87` declares 6 music-video MP4s, all served from `cdn/client-public/videos/title/music/<filename>`:

| # | Slug | Filename | Status |
|---|---|---|---|
| 1 | `the-book-of-daniel` | `the-book-of-daniel.mp4` | Likely live (manual catalog; non-trigger) |
| 2 | `building-the-architect` | `building-the-architect.mp4` | Likely live |
| 3 | `hypnotized` | `hypnotized.mp4` | Likely live |
| 4 | `brushstroke-of-the-empire` | `brushstroke-of-the-empire.mp4` | Likely live |
| 5 | `baron-heart-of-time` | `baron-heart-of-time.mp4` | Likely live |
| 6 | `the-last-christmas` | `the-last-christmas.mp4` | Likely live |

Plus the title page's ambient loop:

| Asset | Source path | Local? | CDN? |
|---|---|---|---|
| `videos/title/ark-drift-loop.webm` | `assetUrl(...)` | No | Required |
| `videos/title/ark-drift-loop.mp4` | `assetUrl(...)` | No | Required |

**Commentary.** None of these are HEAD-checked by `_check-art-coverage.mjs`; that script does not touch the `videos/title/` prefix today. Recommend adding a `TITLE_VIDEOS` entry to the coverage script so missing music-video uploads surface in CI rather than as a black `<video>` element on the live title screen.

---

## Next Production Drops Recommended

Prioritized by surface impact (player-facing breadth × current blocker severity):

1. **Author the 60 NPC first-meeting VO scripts.** Nine `apps/scripts/<character>-first-meeting-lines.json` files (or appended sections in the existing per-character JSONs) covering vex_solene, the_degen, the_seer, the_oracle, nilmorg, the_meme, adjudicator_locke, the_game_master, wraith_calder. Unblocks the entire NPC first-encounter dialog VO surface — currently silent for those nine characters.
2. **Album 2 frames upload (~334 webp).** Single largest typed-but-unshipped art block tied to playable content. Album 2 slideshow tracks fail closed today (image not found); shipping unblocks both the album reader and Dreamer Vision 2's full visual integrity.
3. **Album 3 frames upload (~567 webp).** Same as #2; the largest of the four pending album drops. Unblocks the album reader for the canonical mid-saga arc.
4. **Album 5 frames upload (~590 webp + 20 narrator portraits + 18 dialog backgrounds).** Producer drop landed 2026-04-29; HEAD-verify and add to `_check-art-coverage.mjs` coverage. Unblocks Silence In Heaven album playback and the Antiquarian-as-Architect-narrator B1 anchor of the Dreamer recruitment plan.
5. **Render and upload the Login Meme cinematic (3:45 Kling Omni, 16 chained shots).** First-ever-login moment for every new player. Currently typed as prompts only; no rendered mp4 exists. Highest first-impression leverage of any single asset commission.
6. **Album 4 frames upload (~200 webp).** Smallest of the four pending album drops; cheapest checkbox to clear.
7. **Verify and upload the 24 professor signature guild cutscenes** (`cs_sig_<1..12>_{light,dark}.mp4`). Each fires on-cardplay through `professorSignatureCards.ts`. 14 of 24 cardDefId mappings are wired today; the other 10 will go live the moment the corresponding cards ship. Missing mp4s mean no F4 ability cinematic on signature plays.
8. **Ratify Vision 4 captions and ship.** Pure writer task (no new art); flips one comment in `dreamerVisions.ts` from `// [23, VISION_4]` to a live entry. Completes the four-vision Dreamer-awareness arc.
9. **Author an Engineer's-Log generator + 42 instrumental Suno/Udio tracks + 42 VO takes.** Engineer character manifest currently holds 1 line; the 42 declared logs (`engineerLogs*.ts`) imply a full music + VO pipeline that isn't wired into `_vo-audit.mjs`. Largest hidden VO + music surface in the codebase.
10. **Add `videos/title/*.mp4` to `_check-art-coverage.mjs`.** Cheap CI wire-up; prevents a regression where a missing music-video upload renders as a black box on the title page.
