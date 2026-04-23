# ACTS 2-7 PRODUCTION BIBLE — VFX, Cinematics, Music

> **Scope.** Every VFX atlas, Veo 3.1 cinematic (with start + end frames + motion prompt), and Suno v4 music prompt needed to ship the narrative spine of Dischordian Saga Acts 2 through 7. Companion to `LIVING_CHARACTER_SHEET_ART_BRIEF.md` (which handles character rigs + gear) — this bible covers the STORY-BEAT assets: the moments that land on the player as discrete cinematic events.
>
> **Anchor files.** Before reading any section, confirm canon in:
> - `docs/production/ALL_ACTS_ROADMAP.md` — narrative spine, bond progression, per-act triggers/premises
> - `docs/production/acts-4-through-7-asset-pipeline.md` — already-spec'd act-opener slideshows + VO batch expectations
> - `docs/production/act2-vo-script.md` — Act 2 VO script (30 lines across 8 sections)
> - `apps/client/src/data/narrativeActs.ts` — authoritative dialog + choice branching
> - `apps/shared/actsFourFiveShells.ts` + `act2Interlude.ts` + `act3EyesBiography.ts` — per-act data shells
>
> **Tools, in order.**
> 1. **Nano Banana 2** — all start/end still frames, VFX texture atlases, reference plates
> 2. **Veo 3.1** (primary) / **Seedance 2.0** (fallback) — motion clips with start + end keyframes + motion prompt
> 3. **Suno v4** — ambient beds (21s act openers) + stingers + the Act 7 voices-align sustained chord
> 4. **Substance 3D Sampler** — post-authoring of procedural VFX atlases (particle sprites, scan overlays)
> 5. **ffmpeg** — loop-point trimming on idle loops, concatenation for multi-segment cinematics

---

## TABLE OF CONTENTS

- **Part 0** — Conventions, file paths, style anchors
- **Part 1** — Act 2 "The Engineer's Bench / The Whisper"
- **Part 2** — Act 3 "The Eyes in the Dark / The Offer"
- **Part 3** — Act 4 "The Prisoner / The Revelation"
- **Part 4** — Act 4.5 "Dead Man's Circuit"
- **Part 5** — Act 5 "The Reckoning / The Map"
- **Part 6** — Act 6 "The Confession"
- **Part 7** — Act 7 "The Convergence"
- **Part 8** — Consolidated Suno v4 music manifest (all acts)
- **Part 9** — Commission CSV (acts-2-7-tranche.csv, Phase 2 priority)

---

## PART 0 — CONVENTIONS

### 0.1 — Output file paths

```
apps/client/public/
├── videos/acts/
│   ├── act-2/
│   │   ├── cin_act2_opener.mp4                    # opener, 21s
│   │   ├── cin_act2_silence_of_two_witnesses.mp4  # Bond 60 beat
│   │   ├── cin_act2_gamemaster_left_intro.mp4
│   │   ├── cin_act2_gamemaster_right_intro.mp4
│   │   ├── cin_act2_engineer_recording_2.mp4
│   │   └── cin_act2_engineer_recording_3.mp4
│   ├── act-3/
│   │   ├── cin_act3_opener.mp4
│   │   ├── cin_act3_thaloria_echo.mp4             # Eyes bio flashback
│   │   ├── cin_act3_eyes_fall.mp4                 # Eyes' death
│   │   ├── cin_act3_infiltration_{insurgency,empire,hierarchy}.mp4
│   │   └── cin_act3_engineer_recording_{4,5}.mp4
│   ├── act-4/
│   │   ├── cin_act4_opener.mp4
│   │   ├── cin_act4_path_{willing,discovery,betrayal}.mp4
│   │   ├── cin_act4_memorial_corridor.mp4         # Bond 80 Two Witnesses Meet
│   │   ├── cin_act4_kael_extraction_{1,2,3,4}.mp4
│   │   └── cin_act4_engineer_recording_6.mp4
│   ├── act-4_5/
│   │   ├── cin_act4_5_opener.mp4
│   │   └── cin_act4_5_identity_wager.mp4
│   ├── act-5/
│   │   ├── cin_act5_opener.mp4
│   │   ├── cin_act5_bulb_dims.mp4                 # Vortex Advance
│   │   ├── cin_act5_sector_wakes.mp4              # community reclamation
│   │   ├── cin_act5_iron_lion_final.mp4           # the Veridian VI beat
│   │   ├── cin_act5_bridge_of_kael.mp4            # post-credits
│   │   └── cin_act5_engineer_recording_7.mp4      # Prayers in Metal
│   ├── act-6/
│   │   ├── cin_act6_opener.mp4
│   │   ├── cin_act6_elara_confession.mp4          # her face first visible
│   │   ├── cin_act6_human_confession.mp4
│   │   └── cin_act6_watcher_reveal.mp4
│   └── act-7/
│       ├── cin_act7_opener.mp4
│       ├── cin_act7_two_wars_diagram.mp4
│       ├── cin_act7_voices_align.mp4              # THE moment
│       └── cin_act7_stance_{humanity,pattern,bridge,command}.mp4
├── vfx-atlases/acts/
│   ├── act-2/{substrate_layer,bench_glow,chess_depth_ring,silence_freeze}.png
│   ├── act-3/{thaloria_echo_mist,infiltration_choice_beam,eyes_helmet_dust}.png
│   ├── act-4/{kael_memory_palace,caravaggio_light_cone,prison_mirror}.png
│   ├── act-4_5/{identity_chip_etching,entropy_table_glow}.png
│   ├── act-5/{iron_lion_broadcast_static,vortex_consumption_edge,kael_map_ink}.png
│   ├── act-6/{elara_face_resolve_grain,watcher_shape_stencil}.png
│   └── act-7/{army_composite_parallax,voices_align_chord_ring,invisible_war_overlay}.png
└── audio/acts/
    ├── act-{2,3,4,4_5,5,6,7}-intro.mp3            # 21s opener beds
    ├── act-{N}-stingers/
    │   ├── {beat_id}.mp3                          # per-beat music stingers
    └── act-{N}-underscore/
        └── {cinematic_id}.mp3                     # underscores tied to cinematics
```

### 0.2 — Asset ID grammar

```
cin_act{N}_{beat_id}                  # Veo cinematic
vfx_act{N}_{atlas_name}               # VFX atlas texture
mus_act{N}_{beat_id}                  # Suno music clip

Where N ∈ {2, 3, 4, 4_5, 5, 6, 7}
```

### 0.3 — Global style anchors (prepend to every still / motion prompt)

```
Hyper-realistic cinematic composition. Photorealistic materials. Volumetric
lighting. Film grain. Anamorphic lens flares where narratively appropriate.
Subject-forward composition. No rendered text unless explicitly flagged.
Palette per the act's visual bible (see §0.4).
```

### 0.4 — Per-act palette + mood anchors

| Act | Palette | Mood signature |
|---|---|---|
| 2 | Warm tungsten amber + substrate cyan; Bench brass | Workshop, whisper, half-silence |
| 3 | Trade Empire ember-rust + surveillance violet; Thaloria green mist | Infiltration, choice, grief over the Eyes |
| 4 | Prison-cell blue + Caravaggio warm spotlight; memory-palace fire-orange | Memory extraction, judgment, reconciliation-or-break |
| 4.5 | Entropy-violet + bone-chrome; identity-chip gold-accent | Wager, dread-adjacent curiosity, the identity chain |
| 5 | Map-ration-brown + Veridian green; Kael broadcast static-grey | Reckoning, final recordings, the last broadcast |
| 6 | Confession-amber + third-chair-shadow; Elara's face-resolve clean | Unguarded silence, first honest surfaces |
| 7 | Army-composite gold + sustained-chord white; Watcher-shape void | Convergence, alignment, stance |

### 0.5 — Cinematic commission standard

Every Veo 3.1 cinematic in this bible ships with three artifacts:
1. **START FRAME** — Nano Banana 2 still at 1920×1080 (16:9) or 2048×2048 (1:1)
2. **END FRAME** — Nano Banana 2 still, same aspect/resolution
3. **MOTION PROMPT** — Veo 3.1 directive with explicit frame timings for every beat

Act openers are 21s one-shots (per the existing `acts-4-through-7-asset-pipeline.md` spec). Mid-act cinematics run 6-15s. Post-credits beats are 12s. Music beds are sized to match.

---

## PART 1 — ACT 2 "THE ENGINEER'S BENCH / THE WHISPER"

### 1.0 — Narrative anchor

**Trigger:** Complete first game-mode tutorial. Hub detects via `act_2_started` or `crafting_mastered`.

**Premise:** The Human breaks protocol and begins offering commentary during gameplay. Three systems unlock: Crafting Bench, Chess depth progression (Zephyr-9 tiers 1/3/5/8), and the Two Game Masters (Left: tactical, Right: improvisational). Bond climbs toward 60 where the Silence of Two Witnesses milestone lands.

**Source files:** `narrativeActs.ts:381-498` (ACT_2_THE_WHISPER), `act2Interlude.ts:20-186` (§6.2 Bench framing, §6.3 Zephyr classroom, §6.4 Game Masters), `docs/production/act2-vo-script.md` (30 VO lines).

**Cinematics in this part:** 6 clips — opener (21s), Silence of Two Witnesses (10s), Left Game Master intro (6s), Right Game Master intro (6s), Engineer Recording 2 "The Prince's Truth" (12s), Engineer Recording 3 "Ghosts in the System" (12s).

**VFX atlases:** 4 — substrate-layer overlay, bench-glow light/dark variants, chess-depth ring, silence-freeze grain.

**Music:** act-2 opener bed (21s), silence stinger (8s), bench ambient loop (60s looping), Engineer Recording underscore (reused across recordings 2 + 3).

### 1.1 — VFX atlases (Act 2)

> Prepend Part 0.3 global style anchor to every prompt.

**vfx_act2_substrate_layer** — `apps/client/public/vfx-atlases/acts/act-2/substrate_layer.png` · 2048×2048 transparent

> Seamless tiling atlas texture representing the "substrate" underneath Elara's OS layer where The Human speaks. Fine horizontal scan-lines in deep teal-cyan (#1a5a78) at 40% opacity, ~3px line width, 7px spacing. Subtle 1px random vertical drift per line (lines not perfectly parallel — they drift like a signal below the surface). Overlaid with a 12% noise grain. Occasional brighter "transmission bursts" — small 15px horizontal streaks at ~5 randomized positions. Used as additive overlay over gameplay UI during The Human's Commentary lines. No rendered text.

**vfx_act2_bench_glow_light** — `.../act-2/bench_glow_light.png` · 1024×1024 transparent

> Warm amber radial glow texture (#d4a04a core fading to #7a5a20 edge) with soft gaussian falloff. Simulates the Bench humming in light-alignment state. Subtle brass-filament refraction pattern inside (very faint radial threads suggesting coiled copper). Driven by `benchAlignment: 'light'` uniform — intensity baseline 0.6. Used as overlay on `EngineersBenchPage.tsx` background when `flags.engineers_bench_powered_on && lightDarkAlignment === 'light'`.

**vfx_act2_bench_glow_dark** — `.../act-2/bench_glow_dark.png` · 1024×1024 transparent

> Same radial structure as the light variant but cool violet (#6a3a9a core fading to #3a1a6a edge). Slower refraction pattern — the filaments feel slightly submerged. Driven by same uniform with `benchAlignment: 'dark'`. Both variants are authored so they can cross-fade during alignment shifts; do NOT bake the alignment color into base color — keep emissive channel separate.

**vfx_act2_chess_depth_ring** — `.../act-2/chess_depth_ring.png` · 1024×1024 transparent

> Ring texture of 8 concentric annuli, each a different intensity of pale cyan (Zephyr-9's teaching color). Outermost ring = depth 1 (lightest, calm). Innermost ring = depth 8 (hot-blue, dense). Each ring emits a subtle pulsing glow at a rate inversely proportional to its depth — depth 1 slow, depth 8 fast. Used as overlay behind Zephyr-9 in the `ChessPage.tsx` sidebar, scaled to the player's current `chess_depth` flag (0-8).

**vfx_act2_silence_freeze_grain** — `.../act-2/silence_freeze_grain.png` · 2048×2048

> Heavy film-grain texture at 60% density, desaturated entirely to black-and-white with a subtle cold-gray tint. Used as full-frame overlay during the Silence of Two Witnesses milestone — when both narrators go silent and Light/Dark energy freezes, the WHOLE UI gets this grain applied for the 10-second cinematic duration. Slight vertical streak pattern suggests a held frame that is trying not to move.

### 1.2 — CIN-ACT2-OPENER — Act 2 opener (21s, P0)

**Output:** `apps/client/public/videos/acts/act-2/cin_act2_opener.mp4` · 16:9 · 1920×1080

Builds on the existing slideshow spec in `acts-4-through-7-asset-pipeline.md` §Act 4 pattern but for Act 2: this is the first act-opener moment where the Bench is introduced and The Human's whisper-protocol breaks for the first time.

**START FRAME (Nano Banana 2):**

> Hyper-realistic cinematic still, 16:9 1920×1080. Interior of the Engineer's Bench workshop aboard the Ark — a cold, un-powered iron-and-brass workbench dominating the mid-frame, tools arranged with the precision of someone who planned their absence. Dust in slow columns of light from a single overhead skylight. On the bench: a half-assembled brass mechanism (a Dischordia card-press, partially visible), a worn leather apron folded neatly, a coffee mug left upside-down. Palette: cold institutional grey (#55606e) dominant, warm amber accent from the skylight (#d4a04a) catching brass edges, deep teal-cyan shadow in the corners. Film grain, volumetric dust beams. No rendered text.

**END FRAME (Nano Banana 2):**

> Same Bench, same camera. The Bench is now POWERED ON — subtle warm amber glow pulses from within the brass housing, one overhead rod-light has warmed from dim-cold-white to warm-tungsten. The half-assembled mechanism has moved 2cm (the hands that arranged it have not been visible, but it has changed position). A new object on the bench: a small folded scrap of paper with a single word handwritten (render as abstract calligraphic mark, not legible text). The dust columns now faintly glitter — as if something has entered the room without footfall. At the bottom of the frame, a subtle CYAN SUBSTRATE-SCANLINE overlay has appeared (The Human's signal arriving). Palette shifts: amber warmer, cyan scanline layer faintly visible. Film grain preserved. No rendered text.

**VEO 3.1 MOTION PROMPT:**

> 21-second one-shot cinematic. Camera locked static, no dolly, no pan. Narrative beats:
> - 0.0–4.0s: held still, cold Bench, dust columns, Elara's narrator voice fades in underneath (audio hand-off; the cinematic itself is silent until the audio layer composites).
> - 4.0–8.0s: a subtle warm light builds inside the brass housing from 0 to 30% intensity — the Bench is remembering it was ever ON.
> - 8.0–12.0s: the overhead rod-light transitions from cold-white to warm-tungsten over 4 seconds. Dust columns shift in response. A single brass cog on the half-assembled mechanism rotates ~15° (no hand visible).
> - 12.0–16.0s: the folded paper scrap APPEARS on the bench (fade-in, as if it was always there and we just now notice). Camera depth-of-field pulls fractionally toward it.
> - 16.0–19.0s: the CYAN SUBSTRATE-SCANLINE overlay FADES IN at the bottom of the frame, rising 20% up the composition. The first visual indicator of The Human's signal arriving. Subtle.
> - 19.0–21.0s: held on the end frame. Bench fully powered. Substrate visible. Room has been WOKEN.
> 24fps, film grain preserved, no camera motion at any point.

**SUNO v4 MUSIC BED:** see mus_act2_opener in §1.5.

### 1.3 — CIN-ACT2-SILENCE — Silence of Two Witnesses (10s, P0)

**Output:** `apps/client/public/videos/acts/act-2/cin_act2_silence_of_two_witnesses.mp4` · 16:9 · 1920×1080 · **Trigger:** Bond 60 milestone

When both narrators fall silent simultaneously. Light/Dark energy freezes. The player hears their own breath for the first time since Act 1.

**START FRAME (Nano Banana 2):**

> Hyper-realistic cinematic still, 16:9 1920×1080. Current gameplay UI frozen — whatever surface the player was on when Bond hit 60, rendered in crisp detail but BLEACHED of color (60% desaturation), with a faint cold-grey cast. Two narrator portrait slots visible at upper-left and upper-right (Elara, The Human), both showing their subjects MID-SPEECH but frozen — mouth half-open, expression mid-emphasis. Film grain layer heavy. No rendered text.

**END FRAME (Nano Banana 2):**

> Same composition, held silence deepened. Both portraits' mouths have CLOSED — Elara now showing a slight downturn, The Human showing a slight upturn. Neither is speaking. The Light/Dark energy meter (if visible on that surface) is locked with a pale gold hairline around its entire border — the "frozen" visual. Heavy grain overlay (vfx_act2_silence_freeze_grain at full intensity). Palette: 80% desaturated, cold-grey cast. Film grain. No rendered text.

**VEO 3.1 MOTION PROMPT:**

> 10-second one-shot. Camera locked. Narrative beats:
> - 0.0–2.0s: the bleached-UI start frame holds. Both portraits mid-speech, frozen.
> - 2.0–4.0s: Elara's mouth closes gradually (3 frames of motion across 2 seconds). The Human's mouth closes on a different offset (starting 0.5s later, completing at 4.5s). The mouth-close-timing is deliberately NOT synced — they stop speaking at different moments, and we SEE that.
> - 4.0–6.0s: held silence. Grain overlay intensifies from 40% to 80%.
> - 6.0–8.0s: the Light/Dark meter's hairline golden frozen-border fades IN around its edges. Palette desaturates further.
> - 8.0–10.0s: held on end frame. Pure silence. The longest silence the player has experienced. Film grain heaviest here.
> 24fps. No camera motion. This is a STILLNESS cinematic.

**SUNO v4 MUSIC BED:** see mus_act2_silence in §1.5. Critical: the music itself must END abruptly at 2.0s (mirroring the narrators falling silent), leaving 8 seconds of pure silence for the stillness to land.

---

