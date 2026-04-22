# Acts 2–7 — Consolidated Asset Prompt Bible

> **Status:** All code wiring for Acts 2–7 is live on `main` as of 2026-04-22. Every
> asset referenced in this document has a `public/` target path the client will
> auto-discover once bytes land. Pages ship with graceful fallbacks (reduced-motion
> prose, silent-audio stubs, Lucide icon placeholders) so gameplay is not blocked
> by asset generation.
>
> **This doc is a single operator-handoff.** Hand it to whoever runs the art and
> VO generation pipelines; nothing else in the repo is required for them to work.
> Cross-references to existing per-act docs are intentional — this bible is the
> canonical index, the sub-docs contain the full line-level scripts.

---

## 0 · Scope, conventions, pipeline

### What this covers

- Act openers (5 slideshows, Acts 4 / 4.5 / 5 / 6 / 7) — audio beds + three
  frames per act + reduced-motion hero frames.
- Per-act gameplay VO — Act 2 bench/Zephyr/Game Masters, Act 3 Eyes whispers,
  Act 4 Prisoner chapters, Act 5 Cades FPS + Bridge of Kael post-credits,
  Act 6 confession + stance reactions, Act 7 convergence + final stances.
- Supplementary art — Memory Energy HUD, Engineer's Bench states, Game Master
  portraits, Silence of Two Witnesses cinematic frames, prestige ceremony
  backdrop, per-act Hub panel icons.

### What this does NOT cover

- Act 1 and the Prelude — already shipped by the PR #125–#128 delivery pass
  (`elara-vo-script.md`, `ACT_1_SHIP_READY_BIBLE.md`, `PRELUDE_SHIP_READY_BIBLE.md`).
- Collector's Arena / Terminus Swarm / TCG card portraits — covered by
  `ART_PRODUCTION_BIBLE.md` + `COMPLETE_ART_PROMPT_BIBLE.md`.
- Room-state mystery renders and parallax rooms — see
  `PARALLAX_ROOMS_ART_BIBLE.md`.

### Voice preset registry

All VO generated via ElevenLabs. Presets reused from Act 1 are noted; the
remainder were introduced in the spine expansion.

| Preset ID         | Character              | Direction summary                                                                 |
|-------------------|------------------------|-----------------------------------------------------------------------------------|
| `EngineerZero`    | Elara                  | Warm AI, subtle British, quieter when afraid, more precise when angry.            |
| `TrenchCoat`      | The Human              | Deep resonant, timeless British, conspiratorial, digital-static undertone.        |
| `Quarchon9`       | Zephyr-9               | Chess tutor — dry, patient, exhales between sentences, never hurried.             |
| `TheEyes`         | The Eyes (Act 3)       | Female-Bond cadence, Asian formal precision, seductive-confident, never hot.      |
| `FrontManLeft`    | Left Game Master       | Cheshire-grin baritone, mocking, pitched slightly sharp.                          |
| `FrontManRight`   | Right Game Master      | Cheshire-grin baritone, melancholic, pitched slightly flat — same actor as Left.  |
| `KaelPrisoner`    | Kael (Act 4 Prisoner)  | Broken-recovering baritone, low register, the thing between Warlord and Engineer. |
| `IronLion`        | Iron Lion (Cades cmd)  | Weathered male, military clipped, smoke-damaged.                                  |
| `AgentZeroSignal` | Agent Zero             | Female, urgent, military-clipped, signal static, haunted underneath.              |
| `VexSolene`       | Vex Solène (M6 reveal) | Low female, wry, trailing-word cadence, pre-insurgency diplomat.                  |
| `EngineerRecall`  | The Engineer (Act 5)   | Male, measured, tired — same voice bank as Engineer Recordings, not the Prisoner. |
| `NarratorNeutral` | System / out-of-energy | Ungendered, dry, unprocessed.                                                     |

### Generation pipeline

1. **Drop bytes** into `apps/client/public/{art,audio,vo}/...` at the exact
   paths listed in each act's section below.
2. **Commit** the new files on a `chore(assets): ...` branch so CI can validate
   sizes (`apps/scripts/check-asset-sizes.ts` runs in pre-commit).
3. **Upload to S3** with `pnpm tsx apps/scripts/upload-public-to-s3.ts` — the
   codemod in PR #144 routes all runtime reads through `assetUrl()` so the S3
   CDN becomes authoritative the moment the upload completes. Local dev also
   works because Vite serves `apps/client/public/` directly.
4. **Verify** the page: Vite HMR picks up the new file; for slideshow frames
   the player just needs to re-enter the affected route. See §8 for smoke-test
   curls.

### File size & format targets

| Asset kind           | Format       | Dimensions / duration | Target bitrate |
|----------------------|--------------|-----------------------|----------------|
| Slideshow frame      | WebP         | 1920×1080             | ~350 KB        |
| Reduced-motion hero  | WebP         | 1920×1080             | ~420 KB        |
| HUD icon / UI chip   | SVG or PNG   | 64×64 or vector       | < 20 KB        |
| Portrait             | WebP         | 1024×1536 (2:3)       | ~280 KB        |
| Ambient bed (opener) | MP3          | 21 s, mono OK         | 128 kbps       |
| VO line              | MP3          | variable, typ. 5–14 s | 128 kbps       |
| SFX (Cades)          | MP3 or OGG   | < 2 s                 | 192 kbps       |

### Global prompt style

Unless an individual entry overrides, every image prompt in this doc targets:

- **Style**: dark sci-fi, Void Energy palette, Blade Runner × Mass Effect,
  volumetric atmosphere, cinematic rim lighting.
- **Negative**: `cartoon, anime, low quality, blurry, watermark, flat lighting,
  illustration, painting, text, letters, watermark, logo`.
- **Flags**: `--ar 16:9 --v 6.1 --s 750 --q 2` for cinematic frames;
  `--ar 2:3 --v 6.1 --s 500 --q 2` for portraits.
- **Generation**: target 2× resolution → Magnific upscale → downscale for crisp
  detail on the 1920×1080 deliverable.
- **Composition**: leave headroom for UI overlays on the bottom third of every
  cinematic frame (the slideshow player draws captions there in reduced-motion
  mode).

---

## 1 · Act 2 — The Engineer's Bench / The Whisper

**Wiring source of truth**: `apps/shared/act2Interlude.ts`,
`apps/client/src/pages/EngineersBenchPage.tsx`,
`apps/client/src/pages/GameMastersArenaAct2Page.tsx`,
`apps/client/src/pages/Act2InterludePage.tsx`. The Memory Energy currency and
Chess Climb tier bridge consume several of these assets.

**Per-line canonical script**: `docs/production/act2-vo-script.md` (30 lines
across 8 sections). This file is the single source for dialog; do not
re-author lines here.

**Status tracker (extended)**: `docs/production/act2-asset-pipeline.md`.

### 1.1 Voice-over — 29 MP3s + 2 ambient beds

| #  | Path                                                              | Speaker         | Section in `act2-vo-script.md` | Direction snapshot                                     |
|----|-------------------------------------------------------------------|-----------------|--------------------------------|--------------------------------------------------------|
| 1  | `vo/act2/human-commentary-1.mp3`                                  | The Human       | §1 L1                          | Low, steady, conspiratorial, slight reverb.            |
| 2  | `vo/act2/human-commentary-2.mp3`                                  | The Human       | §1 L2                          | Same register; "second opinion from inside the walls." |
| 3  | `vo/act2/elara-recognition.mp3`                                   | Elara           | §2 L3                          | Measured, protective, not panicked.                    |
| 4  | `audio/act2/bench-first-power-on.mp3`                             | Elara + bench   | §3 L4                          | Ambient cinema, bench hum as second voice.             |
| 5  | `audio/act2/bench-light-craft.mp3`                                | Bench hum       | §3 L5                          | Hum pitches up a major third.                          |
| 6  | `audio/act2/bench-dark-craft.mp3`                                 | Bench hum       | §3 L6                          | Hum pitches down a minor third.                        |
| 7  | `audio/act2/bench-out-of-memory-energy.mp3`                       | NarratorNeutral | §3 L7                          | Dry, clinical — "the bench is silent today."           |
| 8  | `audio/act2/bench-mastered.mp3`                                   | Elara           | §3 L8                          | Quiet pride, a teacher closing a lesson.               |
| 9  | `audio/act2/bench-first-light-craft.mp3`                          | Elara           | §3 L9                          | First-time accent: "you found the light side."         |
| 10 | `audio/act2/bench-first-dark-craft.mp3`                           | The Human       | §3 L10                         | First-time accent: "you felt the pull."                |
| 11 | `audio/act2/zephyr-greeting.mp3`                                  | Zephyr-9        | §4 L11                         | Patient, professorial, not warm.                       |
| 12 | `audio/act2/zephyr-tier1-cross.mp3`                               | Zephyr-9        | §4 L12                         | "You may play. I will not let you win."                |
| 13 | `audio/act2/zephyr-tier3-cross.mp3`                               | Zephyr-9        | §4 L13                         | Peek-top-card unlock.                                  |
| 14 | `audio/act2/zephyr-tier5-cross.mp3`                               | Zephyr-9        | §4 L14                         | Undo unlock.                                           |
| 15 | `audio/act2/zephyr-tier8-cross.mp3`                               | Zephyr-9        | §4 L15                         | "The Engineer's Opening is yours. Use it sparingly."   |
| 16 | `audio/act2/zephyr-mastered.mp3`                                  | Zephyr-9        | §4 L16                         | Closing bow, formal.                                   |
| 17 | `audio/act2/game-master-greeting-left.mp3`                        | FrontManLeft    | §5 L17                         | Mocking, sharp-pitched.                                |
| 18 | `audio/act2/game-master-greeting-right.mp3`                       | FrontManRight   | §5 L18                         | Melancholic, flat-pitched.                             |
| 19 | `audio/act2/game-master-first-loss.mp3`                           | Left or Right   | §5 L19                         | Canonical line — pick voice by player morality.        |
| 20 | `audio/act2/game-master-first-defeat-left.mp3`                    | FrontManLeft    | §5 L20                         | Arena win by the player, Left's reaction.              |
| 21 | `audio/act2/game-master-first-defeat-right.mp3`                   | FrontManRight   | §5 L21                         | Arena win by the player, Right's reaction.             |
| 22 | `audio/act2/game-master-repeat-victory-left.mp3`                  | FrontManLeft    | §5 L22                         | Rematch — dismissive.                                  |
| 23 | `audio/act2/game-master-repeat-victory-right.mp3`                 | FrontManRight   | §5 L23                         | Rematch — resigned.                                    |
| 24 | `audio/act2/climb-tier-1-won.mp3`                                 | Elara           | §6 L24                         | Chess Climb companion reaction.                        |
| 25 | `audio/act2/climb-tier-2-won.mp3`                                 | The Human       | §6 L25                         | Chess Climb companion reaction.                        |
| 26 | `audio/act2/climb-tier-3-won.mp3`                                 | Elara + Human   | §6 L26                         | Both react; record separately, mix in post.            |
| 27 | `audio/act2/engineer-recording-2.mp3`                             | EngineerRecall  | §7 L27                         | The Worlds I Saved — archival tone.                    |
| 28 | `audio/act2/engineer-recording-3.mp3`                             | EngineerRecall  | §7 L28                         | Closing recording for the Bench arc.                   |
| 29 | `audio/act2/silence-of-two-witnesses.mp3`                         | Both narrators  | §8 L29                         | Whispered simultaneously, centered.                    |
| AB | `audio/act2/ambient-bench.mp3`                                    | —               | §3 ambient bed                 | 30 s loopable, bench hum + distant tools.              |
| AB | `audio/act2/ambient-silence-of-witnesses.mp3`                     | —               | §8 ambient bed                 | 30 s, held pedal chord, breath-quiet room tone.        |

### 1.2 Imagery — 12 frames + 1 authored SVG

| #  | Path                                                          | Size       | Source                                      | Notes / prompt origin                                    |
|----|---------------------------------------------------------------|------------|---------------------------------------------|----------------------------------------------------------|
| A  | `art/ui/icon-memory-energy.svg`                               | vector     | authored in-repo                            | ✅ Already shipped.                                      |
| B  | `art/rooms/engineers-bench-off.webp`                          | 1920×1080  | `EngineersBenchPage.tsx` (unpowered state)  | Prompt §A2.1 in `MISSING_ART_PROMPTS.md`.                |
| C  | `art/rooms/engineers-bench-powered.webp`                      | 1920×1080  | `EngineersBenchPage.tsx` (powered, neutral) | Prompt §A2.2.                                            |
| D  | `art/rooms/engineers-bench-light-humming.webp`                | 1920×1080  | `EngineersBenchPage.tsx` (after light craft)| Prompt §A2.3.                                            |
| E  | `art/rooms/engineers-bench-dark-humming.webp`                 | 1920×1080  | `EngineersBenchPage.tsx` (after dark craft) | Prompt §A2.4.                                            |
| F  | `art/rooms/zephyr-classroom.webp`                             | 1920×1080  | `EngineersBenchPage.tsx` (Zephyr sidebar)   | Prompt §A2.5.                                            |
| G  | `art/portraits/game-master-left.webp`                         | 1024×1536  | `GameMastersArenaAct2Page.tsx`              | Prompt §A2.6 — Cheshire-smile, sharp-featured.           |
| H  | `art/portraits/game-master-right.webp`                        | 1024×1536  | `GameMastersArenaAct2Page.tsx`              | Prompt §A2.7 — Cheshire-smile, soft-featured.            |
| I  | `art/props/split-goggles.webp`                                | 1024×1024  | Ark hotspot icon                            | Prompt §A2.8.                                            |
| J  | `art/cinematics/silence-of-two-witnesses/frame01.webp`        | 1920×1080  | `songSlideshows.ts` L1429                   | Prompt §A2.9 — Elara and Human hands, not touching.      |
| K  | `art/cinematics/silence-of-two-witnesses/frame02.webp`        | 1920×1080  | same slideshow                              | Prompt §A2.10 — a shared held breath.                    |
| L  | `art/cinematics/silence-of-two-witnesses/frame03.webp`        | 1920×1080  | same slideshow                              | Prompt §A2.11 — the room continues without them.         |
| M  | `art/cinematics/silence-of-two-witnesses/hero.webp`           | 1920×1080  | reducedMotionFallback                       | Prompt §A2.12 — composite of the three frames.           |


---

## 2 · Act 3 — The Offer / Eyes in the Dark

**Wiring source of truth**: `apps/shared/galacticMap.ts` (sector whispers),
`apps/shared/narrativeActs.ts` ACT_3_THE_OFFER (choice tree), Eyes Voice Layer
shipped in PR #138.

The Act 3 completion gate requires one of three canonical infiltration paths
committed through `/trade-empire` plus the Kael Logs discovery via
`Act3CardLadderPage.tsx`. All content is already authored; audio is the only
pending asset class.

### 2.1 Voice-over — Eyes whispers (auxiliary sector pass, 5 lines)

The original 15-line Eyes whisper manifest shipped in PR #138. The auxiliary
sector expansion adds 5 more per `acts-4-through-7-asset-pipeline.md` §Eyes
whispers.

| Sector ID                 | Path                                                     | Length        | Tone                                   |
|---------------------------|----------------------------------------------------------|---------------|----------------------------------------|
| `abyssal_sectors`         | `audio/act3/eyes-whisper-abyssal_sectors.mp3`            | 4 sentences   | Cold. Register half a step lower.      |
| `syndicate_route_prime`   | `audio/act3/eyes-whisper-syndicate_route_prime.mp3`      | 4 sentences   | Conspiratorial. Close-mic proximity.   |
| `command_post_iron`       | `audio/act3/eyes-whisper-command_post_iron.mp3`          | 4 sentences   | Respectful. No irony.                  |
| `atarion_ruins`           | `audio/act3/eyes-whisper-atarion_ruins.mp3`              | 5 sentences   | Nostalgic. Slower than baseline.       |
| `tidewater_archive`       | `audio/act3/eyes-whisper-tidewater_archive.mp3`          | 3 sentences   | Dry, archival, almost bored.           |

**Direction reminder**: The Eyes is a Asian female-Bond baritone — intelligent,
confident, seductive, never hot. The whisper is the diegetic observation of a
woman who already knows the ending and is choosing to let you arrive there.
Preset `TheEyes`.

### 2.2 Voice-over — narrative beats (already authored dialog, ~14 lines)

Already written in `narrativeActs.ts` ACT_3_THE_OFFER. Generate in one batch:

| Context                                                       | Path root                          | Speaker         | Count |
|---------------------------------------------------------------|------------------------------------|-----------------|-------|
| Kael's opener ("They called me an archivist first…")          | `vo/act3/kael-opener-*.mp3`        | The Engineer    | 3     |
| The three infiltration pitches (Insurgency / Empire / Hierarchy) | `vo/act3/pitch-{path}-*.mp3`    | Elara + Human   | 6     |
| Eyes path-commit acknowledgements                             | `vo/act3/eyes-commit-{path}.mp3`   | TheEyes         | 3     |
| Kael Logs discovery (Warden defeat)                           | `vo/act3/kael-logs-unlocked.mp3`   | The Engineer    | 2     |

### 2.3 Imagery — 4 frames

| #  | Path                                                          | Size       | Source                                         |
|----|---------------------------------------------------------------|------------|------------------------------------------------|
| A  | `art/cinematics/act-3-eyes-in-the-dark/hero.webp`             | 1920×1080  | Opener slideshow reduced-motion fallback       |
| B  | `art/rooms/eyes-voice-layer.webp`                             | 1920×1080  | Eyes surface (sector hover / first contact)    |
| C  | `art/portraits/the-eyes.webp`                                 | 1024×1536  | Eyes portrait — back-lit silhouette preferred  |
| D  | `art/rooms/trade-empire-commit-gate.webp`                     | 1920×1080  | `/trade-empire` path-commit backdrop           |

**Ready-to-paste prompt — A (act-3 hero)**:
```
An observation room aboard an ancient ark interior, hundreds of thin violet
threads of light running from ceiling to floor in parallel columns like a
data curtain, a single figure standing behind the threads seen only as a
silhouette with bright pale eyes, the room extends into impossible depth
behind her, volumetric fog at knee height, dark sci-fi aesthetic, cinematic
composition, photoreal, leave bottom third negative space for UI overlay,
--ar 16:9 --v 6.1 --s 750 --q 2
```

**Ready-to-paste prompt — C (Eyes portrait)**:
```
A tall poised Asian woman mid-30s in a high-collared dark suit, back-lit
against a wall of soft violet holographic data, her face half in shadow,
expression confident and amused, not smiling, perfectly still, one gloved
hand resting on the back of a chair, the chair is empty, behind her the
silhouette of the observation deck, rim lighting from above, photoreal
portrait, cinematic depth of field, dark sci-fi, --ar 2:3 --v 6.1 --s 500 --q 2
```


---

## 3 · Act 4 — The Revelation

**Wiring source of truth**: `apps/shared/actsFourFiveShells.ts`
ACT_4_PRISONER_CHAPTERS, `apps/client/src/pages/Act4PrisonerStoryPage.tsx`,
`apps/client/src/pages/Act4MatchPage.tsx`. Act 4 reuses Act 1 path flags
(`act1_path_A` / `act3_partial_share` / `act3_full_secret`) to determine which
Prisoner chapter is the primary arc.

### 3.1 Voice-over — opener (1) + Prisoner chapters (8)

| #  | Path                                              | Speaker          | Direction                                                        |
|----|---------------------------------------------------|------------------|------------------------------------------------------------------|
| 1  | `audio/acts/act-4-revelation-intro.mp3`           | —                | 21 s ambient bed, low slow cello + distant held breath. No VO.   |
| 2  | `audio/act4/prisoner-the_cell.mp3`                | KaelPrisoner     | Opening line of the Cell chapter. Quiet, flat.                   |
| 3  | `audio/act4/prisoner-the_extraction.mp3`          | KaelPrisoner     | Opening line of the Extraction chapter. Slightly warmer.         |
| 4  | `audio/act4/prisoner-the_warlord.mp3`             | KaelPrisoner     | Opening line of the Warlord Rematch. Guarded.                    |
| 5  | `audio/act4/prisoner-the_white_oracle.mp3`        | KaelPrisoner     | Opening line of the White Oracle. Resigned.                      |
| 6  | `audio/act4/extraction-the_cell.mp3`              | KaelPrisoner     | Post-chapter resolution. Memory extraction delivered.            |
| 7  | `audio/act4/extraction-the_extraction.mp3`        | KaelPrisoner     | Post-chapter resolution.                                         |
| 8  | `audio/act4/extraction-the_warlord.mp3`           | KaelPrisoner     | Post-chapter resolution.                                         |
| 9  | `audio/act4/extraction-the_white_oracle.mp3`      | KaelPrisoner     | Post-chapter resolution. The canon "lay down the fight" beat.    |

### 3.2 Imagery — opener slideshow (3 frames + hero)

Paths per `acts-4-through-7-asset-pipeline.md` §Act 4 opener. Prompts reproduced
here for operator convenience:

| #  | Path                                                          | Prompt                                                                                                                                                                                                                                                       |
|----|---------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| A  | `art/cinematics/act-4-revelation/frame01.webp`                | `Prison cell door aboard a capital ship, dim blue emergency lighting, a wide mirror where the observation window should be, a faint silhouette of a man visible inside the mirror's reflection but not inside the cell, --ar 16:9 --v 6.1 --s 750 --q 2`    |
| B  | `art/cinematics/act-4-revelation/frame02.webp`                | `An inverted Collector's Arena, empty raked seats above, a single overhead spotlight on the center ring, the ring itself is a hand-drawn map of a childhood neighborhood slowly burning around its outer edge, --ar 16:9 --v 6.1 --s 750 --q 2`              |
| C  | `art/cinematics/act-4-revelation/frame03.webp`                | `Close-up of a man's hands palms-up in the gesture of surrender, seventy-three names inked across both forearms in fine black script, some of the names beginning to fade, --ar 16:9 --v 6.1 --s 750 --q 2`                                                  |
| D  | `art/cinematics/act-4-revelation/hero.webp`                   | Composite of A + B + C. Use Photopea to layer the three into a single wide composition — cell door on the left, arena center, hands on the right.                                                                                                            |

### 3.3 Imagery — supplementary

| #  | Path                                                          | Size       | Source                                   |
|----|---------------------------------------------------------------|------------|------------------------------------------|
| E  | `art/rooms/room-panopticon-cell.webp`                         | 1920×1080  | `Act4PrisonerStoryPage.tsx` background.  |
| F  | `art/portraits/kael-prisoner.webp`                            | 1024×1536  | Prisoner persona portrait.               |

**Prompt — F (Kael Prisoner portrait)**:
```
Middle-aged man in a prison jumpsuit the colour of old bone, close-cropped
dark hair going silver at the temples, a week of stubble, eyes clear and
exhausted, a thin ink line on his cheekbone like a tear that has been
deliberately preserved, no restraints visible, hands folded on a plain
steel table, no hostility in his face, no pleading either, photoreal
portrait, high contrast rim lighting from the left, dark sci-fi,
--ar 2:3 --v 6.1 --s 500 --q 2
```

---

## 4 · Act 4.5 — Dead Man's Circuit (optional sibling)

**Wiring source of truth**: `apps/shared/actsFourFiveShells.ts`
DEAD_MANS_CIRCUIT_TRACKS + CASINO_SIDE_QUESTS,
`apps/server/routers/deadMansCircuit.ts` (flag-bridge for both tracks),
`apps/client/src/pages/DeadMansCircuitPage.tsx` and `DegensCasinoPage.tsx`.

Already has its own production bible: `docs/production/DEAD_MANS_CIRCUIT_PRODUCTION.md`
+ `docs/production/CASINO_EXPANSION_ART_BIBLE.md`. What follows is the
remaining asset shortlist specific to the opener and cross-page wiring.

### 4.1 Voice-over — opener (1)

| #  | Path                                              | Speaker | Direction                                                                                 |
|----|---------------------------------------------------|---------|-------------------------------------------------------------------------------------------|
| 1  | `audio/acts/act-4-5-dmc-intro.mp3`                | —       | 21 s ambient bed, racing engine warming up + dealer shuffling, both at half volume.       |

### 4.2 Imagery — opener slideshow (3 frames + hero)

Full prompts per `acts-4-through-7-asset-pipeline.md` §Act 4.5 opener. Paths:

| #  | Path                                                        |
|----|-------------------------------------------------------------|
| A  | `art/cinematics/act-4-5-dmc/frame01.webp`                   |
| B  | `art/cinematics/act-4-5-dmc/frame02.webp`                   |
| C  | `art/cinematics/act-4-5-dmc/frame03.webp`                   |
| D  | `art/cinematics/act-4-5-dmc/hero.webp`                      |


---

## 5 · Act 5 — The Reckoning / Cades FPS

**Wiring source of truth**: `apps/shared/actsFourFiveShells.ts`
CADES_FPS_MISSIONS, `apps/client/src/pages/CADESFPSPage.tsx` (postMessage
bridge to the Godot 4.3 iframe), `apps/client/src/pages/Act5InterludePage.tsx`
(map reveal), `apps/shared/actsFourFiveShells.ts` BRIDGE_OF_KAEL_POST_CREDITS.

This is the largest VO batch in the spine — 7 Cades missions × 3 phases each
plus the Bridge of Kael post-credits sequence.

### 5.1 Voice-over — opener (1) + Cades missions (20) + Bridge of Kael (3)

| #  | Path                                                  | Speaker           | Direction                                                              |
|----|-------------------------------------------------------|-------------------|------------------------------------------------------------------------|
| 1  | `audio/acts/act-5-map-intro.mp3`                      | EngineerRecall    | 21 s bed. Kael reading coordinates low-and-hoarse. Gunshot at 20 s.    |
| 2  | `audio/act5/cades-m1-brief.mp3`                       | IronLion          | Scout's Gambit briefing. "Go quiet, come back with your count."        |
| 3  | `audio/act5/cades-m1-mid.mp3`                         | IronLion          | Mid-run callout.                                                       |
| 4  | `audio/act5/cades-m1-debrief.mp3`                     | IronLion          | Debrief.                                                               |
| 5  | `audio/act5/cades-m2-brief.mp3`                       | IronLion          | Digital Onslaught — "hold the node."                                   |
| 6  | `audio/act5/cades-m2-mid.mp3`                         | IronLion          | Late-wave callout.                                                     |
| 7  | `audio/act5/cades-m2-debrief.mp3`                     | IronLion          | Debrief.                                                               |
| 8  | `audio/act5/cades-m3-brief.mp3`                       | IronLion          | Void Corridor — two-voice dispatch, IL + AgentZeroSignal.              |
| 9  | `audio/act5/cades-m3-mid.mp3`                         | IronLion          | Mid-corridor.                                                          |
| 10 | `audio/act5/cades-m3-debrief.mp3`                     | IronLion          | Debrief.                                                               |
| 11 | `audio/act5/cades-m4-brief.mp3`                       | IronLion          | Kael's Own — the only mission briefed without the usual intro music.   |
| 12 | `audio/act5/cades-m4-mid.mp3`                         | EngineerRecall    | Kael breaks in.                                                        |
| 13 | `audio/act5/cades-m4-debrief.mp3`                     | IronLion          | Debrief; IL is visibly shaken.                                         |
| 14 | `audio/act5/cades-m5-brief.mp3`                       | IronLion          | Operation Trojan Downfall — warns you about the mandatory partial loss.|
| 15 | `audio/act5/cades-m5-mid.mp3`                         | IronLion          | Canon beat: "you will feel it."                                        |
| 16 | `audio/act5/cades-m5-debrief.mp3`                     | IronLion          | Debrief — no triumphal close.                                          |
| 17 | `audio/act5/cades-m6-brief.mp3`                       | IronLion          | Recruitment reveal — Vex Solène arrives in dialogue.                   |
| 18 | `audio/act5/cades-m6-mid.mp3`                         | VexSolene         | Mid-mission: "I know what you came for."                               |
| 19 | `audio/act5/cades-m6-debrief.mp3`                     | VexSolene         | Debrief by Vex, not IL. Tone shift registered.                         |
| 20 | `audio/act5/cades-m7-brief.mp3`                       | IronLion          | Last Stand briefing. Short, almost apologetic.                         |
| 21 | `audio/act5/cades-m7-mid.mp3`                         | IronLion          | Final transmission. "If you see the wall, turn right. I love you all." |
| 22 | `audio/act5/cades-m7-debrief.mp3`                     | EngineerRecall    | Kael delivers the debrief. IL is gone.                                 |
| 23 | `audio/act5/bridge-of-kael-1.mp3`                     | EngineerRecall    | Console activating. Tired, gentle.                                     |
| 24 | `audio/act5/bridge-of-kael-2.mp3`                     | EngineerRecall    | Dischordia card reveal.                                                |
| 25 | `audio/act5/bridge-of-kael-3.mp3`                     | EngineerRecall    | Closing line. Record two takes — final mix lands the quieter one.      |

### 5.2 Imagery — opener (3 + hero) + mission splash frames (7)

Opener frames per `acts-4-through-7-asset-pipeline.md` §Act 5 opener. Paths
listed; prompts in the source doc.

| #   | Path                                                            | Size       | Source                                            |
|-----|-----------------------------------------------------------------|------------|---------------------------------------------------|
| A   | `art/cinematics/act-5-map/frame01.webp`                         | 1920×1080  | Opener                                            |
| B   | `art/cinematics/act-5-map/frame02.webp`                         | 1920×1080  | Opener                                            |
| C   | `art/cinematics/act-5-map/frame03.webp`                         | 1920×1080  | Opener                                            |
| D   | `art/cinematics/act-5-map/hero.webp`                            | 1920×1080  | Reduced-motion fallback                           |
| E   | `art/cades/missions/m1-scouts-gambit.webp`                      | 1280×720   | `CADES_FPS_MISSIONS` M1 splash                    |
| F   | `art/cades/missions/m2-digital-onslaught.webp`                  | 1280×720   | M2 splash                                         |
| G   | `art/cades/missions/m3-void-corridor.webp`                      | 1280×720   | M3 splash                                         |
| H   | `art/cades/missions/m4-kaels-own.webp`                          | 1280×720   | M4 splash                                         |
| I   | `art/cades/missions/m5-trojan-downfall.webp`                    | 1280×720   | M5 splash — composition must imply partial loss   |
| J   | `art/cades/missions/m6-vex-arrives.webp`                        | 1280×720   | M6 splash                                         |
| K   | `art/cades/missions/m7-last-stand.webp`                         | 1280×720   | M7 splash — sombre, no triumph                    |

**Prompt — I (M5, partial-loss composition)**:
```
Aerial view of a joint assault on a bunker complex, two flags planted at
the far end of the objective, half the attacking force visible still in
motion forward, the other half already still on the ground, snow and smoke
drifting over everything, no sun, no heroism, just the work, photoreal
cinematic composition, dark sci-fi, --ar 16:9 --v 6.1 --s 750 --q 2
```

### 5.3 SFX — Cades FPS audio (handled separately)

See `docs/production/CADES_SFX_PROMPTS.md` — weapon sounds, impacts, HUD
chimes. Already scoped; not duplicated here.


---

## 6 · Act 6 — The Confession

**Wiring source of truth**: `apps/client/src/data/narrativeActs.ts`
ACT_6_THE_CONFESSION (all lines already authored, `vo*AudioUrl` fields point at
`/vo/act6/*`), `apps/client/src/pages/Act6CardLadderPage.tsx` (confession
ladder + stance picker shipped on `claude/build-act-2-Oimdk` branch,
PR #153 and follow-up), `apps/shared/act6CompletionGate.ts`.

### 6.1 Voice-over — opener (1) + confessions (10) + stance reactions (4) + meta (2)

| #  | Path                                                        | Speaker        | Direction                                                             |
|----|-------------------------------------------------------------|----------------|-----------------------------------------------------------------------|
| 1  | `audio/acts/act-6-confession-intro.mp3`                     | —              | 21 s bed. Two voices through a shared wall + third breathing.         |
| 2  | `vo/act6/elara-confession-01.mp3`                           | EngineerZero   | "I don't want to be remembered as the kind one."                      |
| 3  | `vo/act6/elara-confession-02.mp3`                           | EngineerZero   | Escalation. Name the thing.                                           |
| 4  | `vo/act6/elara-confession-03.mp3`                           | EngineerZero   | The admission of the vote she cast.                                   |
| 5  | `vo/act6/elara-confession-04.mp3`                           | EngineerZero   | Why she went into the Ark instead of into the ground.                 |
| 6  | `vo/act6/elara-confession-05.mp3`                           | EngineerZero   | Close. No forgiveness asked.                                          |
| 7  | `vo/act6/human-confession-01.mp3`                           | TrenchCoat     | The trench coat is not the costume he thought it was.                 |
| 8  | `vo/act6/human-confession-02.mp3`                           | TrenchCoat     | The cases he solved that were never cases.                            |
| 9  | `vo/act6/human-confession-03.mp3`                           | TrenchCoat     | The people he let fall.                                               |
| 10 | `vo/act6/human-confession-04.mp3`                           | TrenchCoat     | Why he took the role anyway.                                          |
| 11 | `vo/act6/human-confession-05.mp3`                           | TrenchCoat     | Close. "I don't want absolution. I want you to know."                 |
| 12 | `vo/act6/stance-empathy.mp3`                                | Both, in turn  | Player chose empathy. Record both narrators; mix one behind the other.|
| 13 | `vo/act6/stance-challenge.mp3`                              | Both           | Player chose the harder honesty back.                                 |
| 14 | `vo/act6/stance-refusal.mp3`                                | Both           | Player refused absolution.                                            |
| 15 | `vo/act6/stance-reluctant-ally.mp3`                         | Both           | Player picked up the shift.                                           |
| 16 | `vo/act6/silence-stance-meta.mp3` *(optional)*              | NarratorNeutral| Only plays if `act7_silence_stance` set on a prestige replay.         |

### 6.2 Imagery — opener (3 + hero) + confession portraits

Opener frames and prompts per `acts-4-through-7-asset-pipeline.md` §Act 6.

| #   | Path                                                           | Size       | Source                                      |
|-----|----------------------------------------------------------------|------------|---------------------------------------------|
| A   | `art/cinematics/act-6-confession/frame01.webp`                 | 1920×1080  | Opener — Elara portrait, first full-res.    |
| B   | `art/cinematics/act-6-confession/frame02.webp`                 | 1920×1080  | Opener — The Human's hanging coat + badge.  |
| C   | `art/cinematics/act-6-confession/frame03.webp`                 | 1920×1080  | Opener — the empty third chair.             |
| D   | `art/cinematics/act-6-confession/hero.webp`                    | 1920×1080  | Reduced-motion fallback composite.          |
| E   | `art/portraits/elara-full-resolution.webp`                     | 1024×1536  | Act6CardLadderPage Woman She Was opponent.  |
| F   | `art/portraits/the-human-unmasked.webp`                        | 1024×1536  | Act6CardLadderPage Detective opponent.      |

**Prompt — E (Elara full-resolution portrait)**:
```
A woman in her late thirties, Mediterranean features, short dark hair going
silver at one temple, wearing a simple linen shirt in ark-grey, eyes
precisely the blue of the fractal AI portrait from earlier acts but not
flickering, she is breathing in a way the AI could not, she is afraid and
not hiding it, the room behind her is out of focus, she is more present
than any frame of her before, photoreal portrait, natural lighting,
dark sci-fi, --ar 2:3 --v 6.1 --s 500 --q 2
```

**Prompt — F (The Human unmasked)**:
```
A man in his late fifties, dark hair flecked grey, a week unshaven, thick
black-framed reading glasses pushed up onto his forehead, his trench coat
is on the chair behind him (not worn), he is sitting forward at a table
with both hands visible and empty, expression careful and plain, one eye
slightly more damaged than the other, the badge that was his authority is
face-down on the table, natural lighting from a single lamp at shoulder
height, photoreal portrait, dark sci-fi, --ar 2:3 --v 6.1 --s 500 --q 2
```

---

## 7 · Act 7 — The Convergence

**Wiring source of truth**: `apps/client/src/data/narrativeActs.ts`
ACT_7_THE_CONVERGENCE (lines already authored), `apps/client/src/pages/Act7CardLadderPage.tsx`
(ladder + final-stance picker including silence), `apps/client/src/pages/PrestigeCycleResetPage.tsx`
(§15 ceremony), `apps/shared/act7CompletionGate.ts`.

### 7.1 Voice-over — opener (1) + convergence (7) + final stances (5) + prestige ceremony (3)

| #  | Path                                                           | Speaker             | Direction                                                              |
|----|----------------------------------------------------------------|---------------------|------------------------------------------------------------------------|
| 1  | `audio/acts/act-7-convergence-intro.mp3`                       | Both                | 21 s bed. First and only time both narrators align on a held chord.    |
| 2  | `vo/act7/visible-war-win.mp3`                                  | Both                | After the Visible War match wins. Both voices, same register.          |
| 3  | `vo/act7/watcher-shadow-resolve.mp3`                           | TheEyes             | Watcher's Yawn beat — she narrates what the narrators cannot see.      |
| 4  | `vo/act7/patient-zero-close.mp3`                               | Both                | Narrators self-mute. Record silence with room tone.                    |
| 5  | `vo/act7/convergence-landing-elara.mp3`                        | EngineerZero        | Elara's landing. "I want to see what happens next, with you."          |
| 6  | `vo/act7/convergence-landing-human.mp3`                        | TrenchCoat          | The Human's landing. "The work is the work. Thank you for the lift."   |
| 7  | `vo/act7/convergence-landing-dual.mp3`                         | Both, sustained     | The closing line held in unison.                                       |
| 8  | `vo/act7/arc-closes.mp3`                                       | NarratorNeutral     | Epilogue title beat only. Short.                                       |
| 9  | `vo/act7/final-stance-humanity.mp3`                            | EngineerZero        | FOR HUMANITY stance reaction.                                          |
| 10 | `vo/act7/final-stance-machine.mp3`                             | TrenchCoat          | SEE THE PATTERN stance reaction.                                       |
| 11 | `vo/act7/final-stance-balance.mp3`                             | Both                | THE BRIDGE stance reaction.                                            |
| 12 | `vo/act7/final-stance-command.mp3`                             | IronLion-echo       | TAKE COMMAND — echo of Iron Lion's last transmission, pitched up.      |
| 13 | `vo/act7/final-stance-silence.mp3`                             | *(none)*            | 12 s of held room tone; no words. Ship an empty MP3 or silence stub.   |
| 14 | `audio/prestige/ceremony-bed.mp3`                              | —                   | 45 s loop for the ceremony page. Low drone + slow pulse.               |
| 15 | `vo/prestige/ceremony-open.mp3`                                | NarratorNeutral     | "One measure of silence. Then the next cycle."                         |
| 16 | `vo/prestige/ceremony-close.mp3`                               | Both, overlapping   | Last line both narrators speak before the wipe.                        |

### 7.2 Imagery — opener (3 + hero) + prestige ceremony + army composite

Opener frames per `acts-4-through-7-asset-pipeline.md` §Act 7. Paths:

| #   | Path                                                           | Size       | Source                                         |
|-----|----------------------------------------------------------------|------------|------------------------------------------------|
| A   | `art/cinematics/act-7-convergence/frame01.webp`                | 1920×1080  | Opener — assembled army composite              |
| B   | `art/cinematics/act-7-convergence/frame02.webp`                | 1920×1080  | Opener — chalkboard war diagram                |
| C   | `art/cinematics/act-7-convergence/frame03.webp`                | 1920×1080  | Opener — four stance icons                     |
| D   | `art/cinematics/act-7-convergence/hero.webp`                   | 1920×1080  | Reduced-motion fallback                        |
| E   | `art/rooms/prestige-ceremony.webp`                             | 1920×1080  | `PrestigeCycleResetPage.tsx` backdrop          |
| F   | `art/ui/stance-icon-humanity.svg`                              | vector     | Final stance picker                            |
| G   | `art/ui/stance-icon-machine.svg`                               | vector     | Final stance picker                            |
| H   | `art/ui/stance-icon-balance.svg`                               | vector     | Final stance picker                            |
| I   | `art/ui/stance-icon-command.svg`                               | vector     | Final stance picker                            |
| J   | `art/ui/stance-icon-silence.svg`                               | vector     | Final stance picker (refuse-to-choose option)  |

**Prompt — E (prestige ceremony backdrop)**:
```
A large empty circular chamber aboard the ark's uppermost deck, a single
seated audience of one thousand figures in shadow — humans, Authority
defectors, Dreamer's Shield survivors, Antiquarian scholars — arranged in
concentric rings, a central pedestal with a plain metal console on it, the
ceiling is open to a slow drift of stars, no ornament, no ceremony objects,
just the room and the witnesses, photoreal cinematic composition, dark
sci-fi, leave bottom third negative space for UI overlay, --ar 16:9 --v 6.1
--s 750 --q 2
```

**Prompt — F/G/H/I/J (stance icons)**:

Icons are flat SVG, stroke-only, 64×64 viewBox. Author by hand or in Figma;
generation not required. Shapes per canon:

- F (Humanity) — a single open hand, palm up, five thin rays emanating outward.
- G (Machine) — a radial lattice of 8 thin lines converging on a central dot.
- H (Balance) — two unequal arcs sharing a single vertical axis, neither touching.
- I (Command) — an upward-pointing chevron with a short bar beneath it (rank).
- J (Silence) — a single horizontal line. Nothing else.


---

## 8 · Cross-act & supplementary

### 8.1 Witnessing Hub panel icons

Each spine act's Hub panel displays a decorative chip icon. Lucide fallbacks
are already in place; custom SVGs are nice-to-have.

| Path                              | Act   | Motif                                    |
|-----------------------------------|-------|------------------------------------------|
| `art/ui/hub-act-2-chip.svg`       | Act 2 | Crystalline hex + bench anvil            |
| `art/ui/hub-act-3-chip.svg`       | Act 3 | Violet eye centered in a data lattice    |
| `art/ui/hub-act-4-chip.svg`       | Act 4 | Cell door frame with an unkept key       |
| `art/ui/hub-act-4-5-chip.svg`     | Act 4.5 | Wheel + card, overlapped at the center |
| `art/ui/hub-act-5-chip.svg`       | Act 5 | Five-pointed compass with one point dim  |
| `art/ui/hub-act-6-chip.svg`       | Act 6 | Two chairs + the absent third            |
| `art/ui/hub-act-7-chip.svg`       | Act 7 | Four quadrants, one empty                |

### 8.2 Companion comment VO (Act 2–7 triggers)

Companion comments fire on trigger flags (see `apps/shared/companionComments.ts`).
Text is authored; audio is optional. Batch the missing MP3s:

- Act 2: `act2_bench_first_light_craft_elara`, `act2_bench_first_dark_craft_human`,
  `chess_climb_tier_{1,2,3}_won_elara`, `chess_climb_tier_{1,2,3}_won_human`.
- Act 6: `act6_elara_confession_heard_*`, `act6_human_confession_heard_*`,
  `act6_confession_close_{empathy,challenge,refusal,reluctant_ally}_*`.
- Act 7: `act7_visible_war_won_*`, `act7_convergence_landing_*`,
  `act7_arc_closes_*`, `act7_silence_stance_*`.

All paths follow `vo/companion/{actN}/{trigger}.mp3`. Direction: keep these
tight — companion comments fire often and need to be quick to skip.

### 8.3 Eyes Voice Layer — full-sector pass (20 sectors total)

The original 15 whispers were shipped in PR #138 + 5 auxiliary added here (§2.1).
Full sector roster in `apps/shared/galacticMap.ts` `eyesNarrator` field.
Generate via `TheEyes` preset.

### 8.4 Story-mode VO — Act 4 Prisoner chapter stances

The Prisoner chapters (`Act4PrisonerStoryPage.tsx`) offer three stances per
chapter (fight / listen / lay_down). Each stance currently ships text-only.
Audio is a nice-to-have:

- Path convention: `vo/act4/prisoner-{chapter}-{stance}.mp3`.
- Voice: `KaelPrisoner` — if the stance is "lay_down", the delivery is quieter
  and half a step lower than "fight".

### 8.5 Cross-game beats — Watcher's Yawn thread

Several optional endgame beats fire cross-game callbacks via
`fireCrossGameBeat()`. No new audio required — reuses Act 5 and Act 7 lines.
Reference: `apps/shared/crossGameBeats.ts`.

---

## 9 · Verification

Once bytes are in place, smoke-test the serving layer:

```bash
# Local dev
curl -sI http://localhost:5173/audio/acts/act-5-map-intro.mp3 | head -1
curl -sI http://localhost:5173/art/cinematics/act-6-confession/frame01.webp | head -1

# Post-S3-upload (production URL pattern)
curl -sI https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/audio/acts/act-5-map-intro.mp3 | head -1
```

For slideshow frames specifically, re-enter the act's opener route
(`/witnessing` + trigger flag) and confirm the cinematic plays the real frames
instead of the text fallback. For VO, the line fires on the event that wrote
its flag — use the architect console (`/architect-console`) to raise the flag
directly while QA-ing audio delivery.

---

## 10 · Tracking checklist

Check boxes as batches land. This is the single aggregate status surface; the
per-act sub-docs stay in sync via direct path references above.

### Act 2

- [ ] 29 VO MP3s + 2 ambient beds (§1.1)
- [ ] 12 cinematic / room / portrait frames (§1.2)
- [x] Memory Energy HUD SVG

### Act 3

- [ ] 5 Eyes whisper MP3s (auxiliary sector pass, §2.1)
- [ ] ~14 narrative-beat VO (§2.2 — opener, pitches, commit lines, Kael logs)
- [ ] 4 cinematic / room / portrait frames (§2.3)

### Act 4

- [ ] Opener bed + 4 frames (§3.1 #1 + §3.2)
- [ ] 8 Prisoner chapter VO (§3.1 #2–9)
- [ ] 2 supplementary frames (§3.3)

### Act 4.5

- [ ] Opener bed + 4 frames (§4.1, §4.2)
- [ ] DMC-specific imagery — tracked in `DEAD_MANS_CIRCUIT_PRODUCTION.md`
- [ ] Casino-specific imagery — tracked in `CASINO_EXPANSION_ART_BIBLE.md`

### Act 5

- [ ] Opener bed (§5.1 #1)
- [ ] 20 Cades mission VO (§5.1 #2–22)
- [ ] 3 Bridge of Kael VO (§5.1 #23–25)
- [ ] 4 opener frames + 7 mission splashes (§5.2)
- [ ] Cades SFX — tracked in `CADES_SFX_PROMPTS.md`

### Act 6

- [ ] Opener bed (§6.1 #1)
- [ ] 10 confession VO (§6.1 #2–11)
- [ ] 4 stance reactions (§6.1 #12–15) + optional silence-meta (#16)
- [ ] 4 opener frames + 2 confession portraits (§6.2)

### Act 7

- [ ] Opener bed (§7.1 #1)
- [ ] 7 convergence VO (§7.1 #2–8)
- [ ] 5 final-stance reactions (§7.1 #9–13)
- [ ] Prestige ceremony bed + 2 ceremony VO (§7.1 #14–16)
- [ ] 4 opener frames + prestige backdrop + 5 stance SVGs (§7.2)

### Cross-act

- [ ] 7 Hub panel chip SVGs (§8.1)
- [ ] Companion comment audio (Acts 2, 6, 7 triggers — §8.2)
- [ ] Optional Prisoner-chapter stance audio (§8.4)

---

## 11 · Canonical references

- **`docs/production/act2-vo-script.md`** — Act 2 per-line script (30 lines).
- **`docs/production/act2-asset-pipeline.md`** — Act 2 status tracker with
  per-shell `audioUrl` wiring notes.
- **`docs/production/acts-4-through-7-asset-pipeline.md`** — per-act prompts
  for openers; this bible condenses + extends that doc.
- **`docs/production/elara-vo-script.md`** — Act 1 Elara VO (shipped). Use as
  the voice-direction reference when generating Act 6/7 Elara lines.
- **`docs/production/VOICE_OVER_BIBLE.md`** — character-voice profiles, the
  canonical ElevenLabs prompts for every preset.
- **`docs/production/MISSING_ART_PROMPTS.md`** — numbered prompt index that
  this bible cross-references (§A2.*).
- **`docs/production/DEAD_MANS_CIRCUIT_PRODUCTION.md`** + **`CASINO_EXPANSION_ART_BIBLE.md`** —
  Act 4.5 sub-system assets.
- **`docs/production/CADES_SFX_PROMPTS.md`** — Act 5 Cades FPS SFX.
- **`docs/production/PARALLAX_ROOMS_ART_BIBLE.md`** — room-state rendering
  used across multiple acts.
- **`apps/shared/songSlideshows.ts`** — canonical slideshow registry;
  `flagsSetOnComplete` fields name every completion-gate flag the openers
  raise.
- **`apps/client/src/hooks/useNarrativeIntegration.ts` SLIDESHOW_TRIGGERS** —
  the fan-out table that ties trigger flags to slideshows.

---

*Generated 2026-04-22 during the Acts 2–7 spine-completion pass. Keep this doc
up to date whenever a new gameplay surface introduces a new asset target.*
