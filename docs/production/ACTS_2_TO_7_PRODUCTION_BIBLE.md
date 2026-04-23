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

### 1.4 — CIN-ACT2-GAMEMASTER-LEFT-INTRO (6s, P1) + CIN-ACT2-GAMEMASTER-RIGHT-INTRO (6s, P1)

Two companion cinematics introducing the Two Game Masters (tactical vs. improvisational). Each fires ONCE when the player first encounters its Game Master at the Arena.

**LEFT GAME MASTER — tactical**

**START FRAME:** Empty tactical board on a dark mahogany table, 16:9 1920×1080. Overhead surgical-white light. Two chairs — one empty (far side, player POV), one occupied but figure visible only as silhouette edges (back-lit). Board pieces pre-arranged in a closed position that reads as "worked out in advance." Palette: cold clinical white dominant, deep mahogany accent, no warm color. Film grain. No rendered text.

**END FRAME:** Same composition but the Left Game Master is now fully lit — a thin, angular figure in charcoal-black wool three-piece suit (no tie, high collar), pale skin, close-cropped grey hair, surgical-framed spectacles with rectangular lenses catching a single hot highlight. His hands are folded on the table beside the board. Expression: absolutely composed, a trace of impatience at the corners. Palette: same cold clinical tone but his skin and suit now carry sharp detail. Film grain.

**MOTION PROMPT:** 6-second one-shot. Camera locked. Beats: 0-2s silhouette holds, 2-3s light ramp reveals him in focus, 3-5s he turns his head ONCE 5° toward the camera in a precise assessment (no other motion), 5-6s held on end frame. No spoken VO in the cinematic itself; his first line plays after on the dialog surface.

**RIGHT GAME MASTER — improvisational**

**START FRAME:** Same table but LIT DIFFERENTLY — warm amber side-light from a single angled lamp, the far chair occupied by silhouette that reads as energetic (posture slightly forward, hands gesturing mid-air frozen in a conversation already in progress). Board pieces scattered chaotically as if a game is mid-play. Warm amber dominant, deep shadow on the player-POV side. Film grain.

**END FRAME:** Right Game Master in full light: shorter, warmer, dark hair unkempt, open-collar cotton shirt with sleeves rolled, no jacket, a pencil behind one ear and a half-drunk glass of tea on the table. Mid-GESTURE — one hand extended toward the board, mid-explanation. Expression: curious delighted engagement. Palette: warm amber, earth-tones, sepia-adjacent. Film grain.

**MOTION PROMPT:** 6-second one-shot. Camera locked. Beats: 0-2s silhouette gesturing mid-air (his hand moves 3cm during this window — unlike the Left Master, he NEVER stops moving), 2-3s warm light shifts and he is revealed in full, 3-5s he picks up a pencil from behind his ear and taps it once against the board (pointing at a piece), 5-6s held on end frame. No spoken VO — dialog plays after.

Both cinematics share palette-oppositional framing: Left = cold/still/tactical, Right = warm/moving/improvisational. When played back-to-back in the Arena intro they telegraph the binary the player is about to choose between.

### 1.5 — CIN-ACT2-ENGINEER-RECORDING-2 — "The Prince's Truth" (12s, P1)

**Output:** `apps/client/public/videos/acts/act-2/cin_act2_engineer_recording_2.mp4` · 16:9 · 1920×1080 · **Trigger:** `engineer_recording_2_discovered` flag

Second of seven Engineer Recordings (see `engineerRecordings.ts`). The Engineer reveals he was the Prince of Celebration before the Fall.

**START FRAME:** A small holographic playback rig sitting on the Bench — brass cylinder with a blue-white projector beam stretching upward 40cm into the air. The beam is inactive (hollow, just light). Composition: low angle looking up at the beam, Bench workbench in foreground, empty air above where the hologram will appear. Warm amber Bench-glow bleeding in from frame edges. Film grain.

**END FRAME:** Same rig, beam now FILLED with the holographic recording: a half-resolved figure of the Engineer (same man as Part 2V/W in LIVING_CHARACTER_SHEET_ART_BRIEF.md Phase 2 — Black, short dreadlocks, trimmed beard, but rendered in cool blue-white holographic flicker rather than his canonical warm red palette — this is a RECORDING, not him). He is mid-gesture, one hand raised as if in the middle of a sentence. Behind him faintly: a ghostly echo-layer of his YOUNGER self (Phase 1 Prince) overlaid at 20% opacity, ceremonial cream-and-gold attire visible through the blue hologram — the past bleeding through the present at the moment he speaks about it. Film grain, chromatic aberration subtle at hologram edges.

**MOTION PROMPT:** 12-second one-shot. Camera locked. Beats:
- 0-2s: inert rig, empty beam, Bench quiet.
- 2-3s: rig CLICKS on — blue-white beam fills with static for 1 second, scanning.
- 3-6s: the Engineer figure resolves into the beam, starting from feet up to head. Particles of light compose him as he assembles (faster, more jittery version of The Human's particle-assembly reveal from Part 1B — this is memory, not resurrection, so the assembly feels staccato rather than solemn).
- 6-9s: he holds, mid-gesture. Behind him the ghostly YOUNGER self fades in over 3 seconds, never fully resolved (20% peak opacity).
- 9-11s: his mouth moves in silent-mode (he is speaking; the VO track handles the audio). Younger self is fully visible at 20% behind him.
- 11-12s: recording DISSOLVES — both figures fade over 1 second back to empty blue beam.
24fps, film grain, blue-white hologram palette dominant.

### 1.6 — CIN-ACT2-ENGINEER-RECORDING-3 — "Ghosts in the System" (12s, P1)

**Output:** `.../act-2/cin_act2_engineer_recording_3.mp4`

Third recording. The Engineer warns about what's watching the Ark.

**START FRAME:** Same rig, same Bench, beam inert.

**END FRAME:** Same rig, beam now filled — but the Engineer's hologram is PARTIALLY CORRUPTED. Instead of the clean blue-white figure, bands of violet-black glitch-corruption cross his form at random heights (~15% of his body at any moment). The ghostly younger self is NOT visible here — only the main figure. Behind the holographic Engineer, faintly visible in the beam's deep layer: a SHAPE. Humanoid-adjacent but too-tall, with no face, hands at its sides. The viewer notices it on second-look. The Engineer's expression is guarded — he is aware of it and recording this anyway.

**MOTION PROMPT:** 12-second one-shot. Camera locked. Beats:
- 0-2s: inert rig.
- 2-3s: beam activates with more static than Recording 2 — this recording is degraded.
- 3-5s: Engineer resolves with intermittent violet-black glitch bands — he appears normally, then glitches through for 200ms, back, glitch, back, etc.
- 5-8s: held on Engineer speaking (silent in cinematic). The SHAPE behind him fades in at 5-8% opacity over 3 seconds — barely visible. Audience-catches-it-or-doesn't.
- 8-10s: the SHAPE behind Engineer INCREASES to 12% opacity for a single frame at 9.0s, then drops back. The audience subliminally registers "something was there."
- 10-11s: Engineer turns his head 3° toward the SHAPE — acknowledgment.
- 11-12s: recording dissolves, the SHAPE staying visible at 5% for an extra 0.3s after the Engineer has faded (it is NOT part of the recording; it was present in the room where the recording was MADE).
24fps, blue-white dominant with violet-black glitch accents.

### 1.7 — Suno v4 music prompts (Act 2)

**mus_act2_opener** — `apps/client/public/audio/acts/act-2-intro.mp3` · 21s

> Suno v4 prompt: "Quiet tungsten workshop ambience, 21 seconds. Low held cello note in D-minor under distant breathing. At 12 seconds, a single brass-filament string pluck enters — warm, close, like a tuning fork held against wood. At 17 seconds, a faint high-frequency scanline hum joins 5% below the main dynamic — the substrate signal arriving. Ends on a held quarter-rest, unresolved. Cinematic, intimate, patient. No percussion. No vocal."
>
> Mood tag: `workshop_quiet`, `substrate_introduction`, `patient_held`
> Exported as: 21s mono MP3, normalized -14 LUFS

**mus_act2_silence** — `apps/client/public/audio/acts/act-2-stingers/silence_of_two_witnesses.mp3` · 10s (but see note)

> Suno v4 prompt: "2 seconds of a sustained two-voice vocal chord in D-minor (tenor + alto, wordless) held at a steady dynamic — then an ABRUPT CUT to absolute silence that holds for 8 seconds. The music MUST stop at 2 seconds, not fade. Cinematic weight in the silence itself. The chord before the cut should feel like it was about to resolve and was interrupted. Render the full 10 seconds including the 8 seconds of silence — we need them in the file."
>
> Critical rendering note: some Suno presets auto-trim silence at the end of a render. Either disable that behavior or manually extend the file in post (`ffmpeg -i in.mp3 -af "apad=pad_dur=8" out.mp3`). The 8-second trailing silence is the entire point of the cue.

**mus_act2_bench_ambient_loop** — `.../act-2-stingers/bench_ambient_loop.mp3` · 60s seamless loop

> Suno v4 prompt: "60-second seamless loop of a workshop bench humming — low mechanical purr with subtle tonal warmth. In the register of a bass clarinet playing a held note one octave below middle C, but with more harmonic complexity than a pure tone. Occasional faint metallic tick (a cog turning) at 17s, 34s, 51s — three times per loop, unevenly spaced. Ends identically to start for seamless loop. No melody. No progression. Just the sound of the Bench existing."
>
> Loop-point validation: `ffprobe duration` should read 60.0. Splice-test by concatenating to itself — no audible stitch.

**mus_act2_engineer_recording_underscore** — `.../act-2-stingers/engineer_recording_underscore.mp3` · 12s (reusable across Recordings 2 + 3)

> Suno v4 prompt: "12-second underscore for a holographic recording playback. Starts with 1.5 seconds of blue-white static (harmonic hiss in the upper-midrange, not noise), then a warm low piano chord enters at 1.5s, held and soft. The chord breathes — very slow swell up to 8.5s, then gradual release to 12.0s. Sparse. No melody. A single chord holding under a memory. Ends unresolved."
>
> Usage note: reused for both CIN-ACT2-ENGINEER-RECORDING-2 and -3. The GLITCH-BAND beats in Recording 3 don't need music to glitch with them — the contrast between unglitched music and glitched image IS the effect.

---

## PART 2 — ACT 3 "THE EYES IN THE DARK / THE OFFER"

### 2.0 — Narrative anchor

**Trigger:** Unlock 5 rooms on the Ark. Hub detects via `act_3_starting` or infiltration commit flags.

**Premise:** The Human offers Kael's pre-Fall navigation logs. Player chooses how much to tell Elara. Trade Empire faction arcs unlock. The Eyes — a dead Insurgency agent whose biography surfaces across four Trade Empire hubs — becomes a ghost-presence. Three infiltration paths commit the player to Insurgency / Empire / Hierarchy.

**Source files:** `narrativeActs.ts:506-619` (ACT_3_THE_OFFER), `act3EyesBiography.ts` (394 lines covering §7 biography + §7.3 infiltration paths + §8 Trade Empire improvements).

**Cinematics in this part:** 7 — opener (21s), Thaloria Echo flashback (12s), Eyes Fall beat (14s), three infiltration commits (Insurgency / Empire / Hierarchy, 8s each), Engineer Recordings 4 + 5 (12s each, reuse underscore from §1.7).

**VFX atlases:** 3 — Thaloria echo mist, infiltration choice beam, Eyes helmet-in-the-grass dust.

**Music:** act-3 opener, Thaloria Echo underscore, Eyes Fall lament, per-infiltration-path stingers (3 variants).

### 2.1 — VFX atlases (Act 3)

**vfx_act3_thaloria_echo_mist** — `.../act-3/thaloria_echo_mist.png` · 2048×2048 transparent

> A volumetric atmospheric mist texture in muted GREEN (#4a7a5a with #6a9a7a highlights), softly luminous — suggests bioluminescent forest air from Thaloria. Seamless tile. Internal slow drift pattern at ~4px/s. Occasional darker "shape-suggestion" pockets — faint silhouettes of broken columns, a helmet-shape at the edge of readability — embedded at 8% opacity. Used as atmospheric overlay on the Thaloria Echo cinematic + as ambient in Trade Empire hubs that surface Eyes biography beats. No rendered text.

**vfx_act3_infiltration_choice_beam** — `.../act-3/infiltration_choice_beam.png` · 1024×2048 transparent

> A vertical triptych of three light beams, each tinted with its faction color:
> - Left beam: Insurgency orange-red (#c76a3a), textured with a faint static-transmission pattern (the Engineer's signal frequency)
> - Middle beam: Empire magenta (#e040fb), smooth silk-like gradient (New Babylon's polish)
> - Right beam: Hierarchy violet-black (#3d1a5a), with subtle corruption-flecks drifting inside (Shadow Tongue's editorial fingerprint)
> Each beam stands ~900px tall × 250px wide, with 50px gap between. Used as background overlay on the infiltration-commit surface. Runtime highlights the player's chosen beam and dims the other two by 60%.

**vfx_act3_eyes_helmet_dust** — `.../act-3/eyes_helmet_dust.png` · 512×512 transparent

> Close-in texture of dust motes drifting over the surface of a partially-buried military helmet — metallic grey-green with slightly tarnished brass trim. Dust motes warm-yellow against the helmet's cool grey. Used as static backdrop element in Trade Empire hub surfaces where an Eyes biography beat is about to surface (mid-distance composition). Subtly animates (motes drift) at runtime via texture scroll.

### 2.2 — CIN-ACT3-OPENER — Act 3 opener (21s, P0)

**Output:** `apps/client/public/videos/acts/act-3/cin_act3_opener.mp4` · 16:9 · 1920×1080

"The Helmet in the Grass" opener — the player's first glimpse of the Eyes' abandoned gear.

**START FRAME:** Overgrown Thaloria meadow at dawn, 16:9. Wide shot of a field of tall green-blue grass gently moving in a low wind, mist at mid-distance rising off the ground. The frame is mostly empty composition — just the field and the horizon. Low-angle. Palette: muted green dominant, cool dawn-blue sky, no warm color except a faint distant orange horizon hint (sun not yet visible). Film grain. No rendered text.

**END FRAME:** Same field, camera has pushed in slightly (~15% zoom). Now visible in the foreground mid-left: a WEATHERED MILITARY HELMET half-buried in the grass, tilted slightly, its visor cracked. Grass grows through the helmet's crest-holes. A tarnished brass IDENTITY TAG dangles from it, engraved with abstract glyphs (not legible). Mist now carries through the helmet. The camera angle is slightly lower — it tilts down 4° across the push-in, as if we have noticed what we're looking at. Palette: same muted green but with the brass of the tag catching a thin shaft of dawn light. Film grain.

**MOTION PROMPT:**

> 21-second one-shot. Very slow push-in (~15% zoom over 21s, linear) + 4° gentle tilt-down over the final 8 seconds. Beats:
> - 0.0-6.0s: empty field holds. Grass moves gently, mist drifts. Almost no motion — the viewer is looking at nothing and doesn't yet know what they're supposed to see.
> - 6.0-10.0s: the push-in begins (imperceptible at first — just ~3% zoom over 4 seconds).
> - 10.0-14.0s: camera tilts down 2° and the grass in the mid-ground REVEALS a shape. At 12.0s the helmet is visible as a silhouette. At 14.0s it's fully resolved.
> - 14.0-18.0s: continued slow push-in. Mist crosses through the helmet. The brass tag catches dawn light and flickers faintly (reflection shift).
> - 18.0-21.0s: final frame holds. Camera tilt complete. Helmet centered lower-frame. The audience understands someone used to wear this.
> 24fps, no camera shake, deliberate stillness. Film grain heavy.

**SUNO v4:** see mus_act3_opener in §2.7.

### 2.3 — CIN-ACT3-THALORIA-ECHO — Eyes biography flashback (12s, P0)

**Output:** `.../act-3/cin_act3_thaloria_echo.mp4` · **Trigger:** "Thaloria Echo" milestone (bond-independent)

The Eyes' moment at Thaloria, 17,000 years ago. Plays when the player first triggers the Thaloria beat in a Trade Empire hub.

**START FRAME:** Same Thaloria field as the opener but LIT DIFFERENTLY — warm golden sunlight at ~4pm angle, NO mist. A figure in mid-frame: a woman in Insurgency field-armor (olive-drab canvas + tactical black-and-brass), her back to camera, looking at a distant horizon. Her helmet is in her LEFT HAND, held at hip level — the same helmet from the opener but uncracked, new. She has long dark hair in a field-braid. Palette: warm sunlight, olive-drab armor, green-gold grass. Film grain.

**END FRAME:** Same woman, same composition, but IN MOTION — she has turned her head 30° toward the camera (not fully — we see her in profile but not her face directly). Her helmet is still in her hand. A faint second figure has appeared 20m behind her in the field, too distant to read features — just a silhouette. The silhouette is pointing back the way she came. Palette: the golden sunlight has shifted slightly warmer, approaching dusk. Film grain.

**MOTION PROMPT:**

> 12-second one-shot. Camera locked, no camera motion — all motion is in the subject. Beats:
> - 0.0-3.0s: start frame holds. She is looking at the horizon. Breathing visible in the shoulder-line (her canvas armor moves with it).
> - 3.0-5.0s: the second figure FADES IN 20m behind her over 2 seconds (visible as a silhouette, not detailed).
> - 5.0-7.0s: she begins to turn her head toward the camera — slow, not alarmed, just noticing something. Completes 30° turn by 7.0s.
> - 7.0-10.0s: she holds the profile-turn. The second figure behind her raises one arm, pointing back the way she came. She does not react.
> - 10.0-12.0s: the sunlight warms toward dusk. The scene is dissolving into memory — not literally fading, but a subtle chromatic shift toward sepia. Final frame.
> 24fps, warm golden palette, film grain. This is a MEMORY clip — warmer, softer than the opener's cool dawn.

**SUNO v4:** see mus_act3_thaloria_echo in §2.7.

### 2.4 — CIN-ACT3-EYES-FALL — The Eyes' death (14s, P0)

**Output:** `.../act-3/cin_act3_eyes_fall.mp4` · **Trigger:** completion of the §7 EYES_BIOGRAPHY arc across Trade Empire hubs

The beat the player has been assembling. Not shown explicitly — framed as an ABSENCE where the action should be.

**START FRAME:** Night on Thaloria, same field as the opener + echo. Moonlight cool blue-white. Foreground: the helmet sitting intact on the grass, tag dangling, unbroken. Middle-ground: tall grass swaying in night-wind. Deep background: a faint warm orange glow along the horizon — a fire is starting somewhere not visible. Palette: cool moonlight dominant with distant warm-orange threat. Film grain.

**END FRAME:** Same composition, same camera, same framing. But now: the helmet is CRACKED (visor split across the middle), the brass tag has been partially burnt black, the grass immediately around the helmet has been SCORCHED into a 2-meter circular black patch, and the distant warm-orange glow has become a RISING ORANGE WALL — a fire advancing toward the camera from 800m out. Film grain heavier. No sign of the woman. No body. Just what she left behind + what came for her.

**MOTION PROMPT:**

> 14-second one-shot. Camera locked, absolutely no camera motion. This cinematic is about the violence of things CHANGING in a frame that does not.
> - 0.0-3.0s: start frame. Helmet intact. Grass swaying. Distant orange glow faint.
> - 3.0-4.0s: the distant orange glow brightens 30% over 1 second. The grass on the horizon is visibly burning now.
> - 4.0-7.0s: held. The fire advances (visually grows from a hairline to a 15% horizon-height band). The helmet and tag are UNCHANGED. The audience is supposed to feel the contradiction — something violent is happening in the frame and the foreground doesn't know.
> - 7.0-8.0s: SINGLE FRAME of violence — for exactly 1/24 of a second (one frame at 24fps), the scene FLASHES white, blowing out the entire composition. Immediately cuts back.
> - 8.0-11.0s: post-flash frame. Helmet NOW CRACKED (the visor splits during the flash frame — the viewer won't catch it on first pass; it just IS cracked now). Tag half-burnt. Circle of scorched grass around the helmet. The rising orange wall is now 40% horizon-height and advancing visibly.
> - 11.0-14.0s: held. No recovery, no body, no person. Fire keeps advancing (visible 10cm growth over 3 seconds). The helmet sits in the center of its scorched circle like a relic. Final frame holds.
> 24fps, cold moonlight + warm fire, film grain heavy. This is a DEATH cinematic shown as absence.

**SUNO v4:** see mus_act3_eyes_fall in §2.7.

### 2.5 — CIN-ACT3-INFILTRATION-{INSURGENCY,EMPIRE,HIERARCHY} — 8s each, P1

Three sibling cinematics that play when the player commits to one of the three infiltration paths. Each shares a framing device — "the player enters a room" — but the room is unique to the path. All three use the `vfx_act3_infiltration_choice_beam.png` atlas as the initial setup shot.

**Shared START FRAME (all three):** Dark threshold corridor, 16:9. Three vertical light beams visible in mid-distance (the infiltration_choice_beam atlas), each tinted its faction color. The player-POV (implied) stands at the near end. Palette: dark corridor with three color beams — orange-red + magenta + violet. Film grain.

**CIN-ACT3-INFILTRATION-INSURGENCY — END FRAME:**

> The player has stepped through the orange-red beam. Revealed: an Insurgency safe-house interior. Peeling painted walls in muted olive-drab, a wooden table with a disassembled radio on it, a chair with a canvas field-jacket draped over the back, and the ENGINEER (his recording-canonical Phase 2 form — dreadlocks, red coat, red goggles PUSHED UP onto forehead now so his eyes are visible) standing at the far end of the room. His eyes look DIRECTLY at camera. He lifts one gauntleted hand in a small hello-gesture. The other two beams (magenta + violet) are NO LONGER VISIBLE — only the orange-red remains as a faint edge-rim behind him. Film grain.

**MOTION PROMPT (Insurgency):** 8-second one-shot. Camera locked. Beats:
- 0.0-2.0s: shared start frame — three beams visible.
- 2.0-3.5s: subtle walkthrough effect — the camera pushes forward through the orange-red beam (~12% zoom) while the other two beams dim to 15% and slide offscreen. The player has COMMITTED.
- 3.5-6.0s: the safe-house resolves out of the orange-red glow. The Engineer is standing at the far end, initially in silhouette.
- 6.0-7.5s: Engineer's silhouette resolves into his full form. His red goggles lift from eyes to forehead (the memoir-mode → listening-mode gesture, per Part 2V/W in the Living Character Sheet bible).
- 7.5-8.0s: he raises his hand in a small hello. End frame holds.
Palette: orange-red rim dominant, olive-drab safe-house fills, warm amber lamp accent. Film grain.

**CIN-ACT3-INFILTRATION-EMPIRE — END FRAME:**

> The player has stepped through the magenta beam. Revealed: a New Babylon negotiation parlor — polished black obsidian floor, magenta-neon accent wall with an abstract Trade Empire sigil (geometric, no legible letters), a low glass table, and ADJUDICATOR LOCKE (her Living Character Sheet Part 2B canon: purple hair top-bun, red cyber-eyepatch, purple leather jacket) seated on the far side of the table. She has a small glass of amber liquid in one hand. She is looking at the player with the eyepatch's red scan-line visibly active — processing them. Film grain.

**MOTION PROMPT (Empire):** 8-second one-shot. Same camera pattern as Insurgency — forward-push through the magenta beam, other two beams slide off. Beats:
- 0.0-2.0s: shared start frame.
- 2.0-3.5s: push through magenta beam.
- 3.5-6.0s: parlor resolves. Locke seated at the table, glass in hand.
- 6.0-7.5s: she tilts her head 5° — the eyepatch scan-line VISIBLY accelerates from 2.8s period to 0.9s period (her canonical "she is speaking" tell, per Part 2B). She is assessing the player.
- 7.5-8.0s: she raises the glass in a small toast-gesture. End frame.
Palette: magenta-neon + obsidian black + amber liquor glint. Film grain.

**CIN-ACT3-INFILTRATION-HIERARCHY — END FRAME:**

> The player has stepped through the violet-black beam. Revealed: a void antechamber. No walls, no floor detail — just a polished black surface underfoot fading into violet void. THE ARCHITECT stands at the far end, per his Living Character Sheet Part 2F canon — black hooded cloak, black metallic demon mask with fractal ridges, golden-amber eye-slits blazing at 1.4× baseline (his authority-beat intensity). His silver fractal sigil pendant is visible at his chest, pulsing actively. He has NOT moved — but the audience feels he has been waiting for the player for a very long time. Film grain.

**MOTION PROMPT (Hierarchy):** 8-second one-shot. Same forward-push pattern. Beats:
- 0.0-2.0s: shared start frame.
- 2.0-3.5s: push through violet beam.
- 3.5-5.0s: void antechamber resolves. At 4.0s the Architect is visible as silhouette at frame center. At 5.0s his eye-amber ramps from 0 to 1.4 intensity.
- 5.0-7.0s: Architect does NOT move. His sigil-pendant pulse accelerates from 4s period to 2s period.
- 7.0-8.0s: a single thin hairline crack of violet-amber light appears at the top of his mask (foreshadowing his True Final Message reveal — a beat ~4-5 acts later). The crack fades to 0 over the final 0.5s. Audience-catches-it-or-doesn't. End frame.
Palette: violet void + gold-amber eye-slits + silver sigil flash. Film grain.

**SUNO v4:** see mus_act3_infiltration_{insurgency,empire,hierarchy} in §2.7 — three variants sharing a motif-spine.

### 2.6 — CIN-ACT3-ENGINEER-RECORDING-{4,5} — 12s each, P1

Two more Engineer Recordings per `engineerRecordings.ts`:
- Recording 4: "The Line That Was Crossed" — Engineer explains the moment Celebration became Sorrow
- Recording 5: "Instructions for Theft" — Engineer explains how to steal something from the Hierarchy

Both reuse the holographic-rig framing from §1.5/§1.6. Key differences per recording:

**Recording 4 — "The Line That Was Crossed"**

END FRAME addition to the base rig setup: the holographic Engineer is now rendered HALF in his standard blue-white hologram palette (left half of his body) and HALF in a WARM CELEBRATION HONEY-GOLD (right half of his body — his Phase 1 Prince palette bleeding into the playback). The split is clean down the midline, not a gradient. Behind him faintly: a wall of CROSSED-OUT NAMES (abstract calligraphic marks, not legible) at 15% opacity — the list of children Celebration took.

Motion prompt: same 12s structure as Recording 2. At 6.0s the palette-split appears (Engineer was blue-white, then the right half warms to honey-gold over 1 second). At 9.0s the crossed-out names wall fades in behind him.

**Recording 5 — "Instructions for Theft"**

END FRAME: Engineer rendered standard blue-white, holding in one outstretched hand a HOLOGRAPHIC OBJECT — a small key-shape with abstract Hierarchy glyphs on it. The key itself is rendered in a different palette from the Engineer: deep VIOLET (#7a3fb8 — Hierarchy color). He is explaining something, mouth moving silently. Behind him in faint wall-pattern: a schematic/blueprint of a door or lock (abstract technical drawing at 10% opacity).

Motion prompt: same 12s structure. At 4.0s the violet key materializes in his outstretched hand. At 8.0s the schematic fades in behind him. Engineer's violet key emits a subtle magnetic-field ripple effect suggesting it is valuable and dangerous.

Both recordings use the same `mus_act2_engineer_recording_underscore` music from §1.7 — no new composition needed.

### 2.7 — Suno v4 music prompts (Act 3)

**mus_act3_opener** — `apps/client/public/audio/acts/act-3-intro.mp3` · 21s

> Suno v4 prompt: "Overgrown-field dawn ambience, 21 seconds. Distant chorus of wind moving through tall grass (wind + grass + air, NOT voices — though the effect should feel almost-vocal). A very low solo flute enters at 10 seconds, playing a slow descending 3-note phrase in D-Dorian, unresolved. At 17 seconds, a single distant bell tolls once — far away, faint, like someone has died and no one knows yet. Ends on a held silence. No percussion. Patient, empty, elegiac."

**mus_act3_thaloria_echo** — `.../act-3-stingers/thaloria_echo.mp3` · 12s

> Suno v4 prompt: "12-second memory-flashback underscore. Warm acoustic guitar fingerpicking pattern in A-major, gentle and slightly hopeful — this was a good day. Layered with a soft female hummed vowel (no words, just held 'oo' on the tonic) that rises faintly at 5s and holds through the end. Ends on an unresolved suspended 4th chord. Nostalgic. Shows a warm scene that the audience already knows ends badly."

**mus_act3_eyes_fall** — `.../act-3-stingers/eyes_fall.mp3` · 14s

> Suno v4 prompt: "14-second death-as-absence cue. Opens with 3 seconds of the same warm acoustic fingerpicking from mus_act3_thaloria_echo — the memory is starting the same way. At 4 seconds the fingerpicking STOPS and is replaced by a low distant string drone in D-minor. At 7 seconds, a single frame of SILENCE (empty air for ~1/24 of a second — syncs to the visual WHITE FLASH). At 7.1 seconds a single low cello note enters, held until 12 seconds. At 12 seconds a faint high harmonic bell rings once and fades to silence by 14 seconds. The cue should feel like someone cut the song off mid-phrase. Elegiac, restrained, no climax."

**mus_act3_infiltration_insurgency** — `.../act-3-stingers/infiltration_insurgency.mp3` · 8s

> Suno v4 prompt: "8-second commitment cue for Insurgency path. Starts with 2 seconds of low drone (all three paths share this opening motif — D-minor, held). At 2 seconds the Insurgency variant enters: a single warm acoustic guitar playing a resolute ascending phrase in D-minor → F-major (hope inside the grief). Small brass ensemble swells at 5s and resolves by 8s. Warm, determined, homemade. The sound of a resistance in a safe-house."

**mus_act3_infiltration_empire** — `.../act-3-stingers/infiltration_empire.mp3` · 8s

> Suno v4 prompt: "8-second commitment cue for Empire path. Same 2-second shared opening drone. At 2 seconds: a polished lounge-piano phrase in D-minor, sophisticated and coldly-beautiful. Bass walks a slow descending line. Subtle jazz brush drums enter at 4s. Ends on a clean major-7 resolution at 8s — elegant, but vaguely untrustworthy. The sound of a deal in a nice room."

**mus_act3_infiltration_hierarchy** — `.../act-3-stingers/infiltration_hierarchy.mp3` · 8s

> Suno v4 prompt: "8-second commitment cue for Hierarchy path. Same 2-second shared opening drone. At 2 seconds: a single church-organ held chord in D-minor that swells in volume across 6 seconds without changing — the music gets louder, but nothing happens. At 8 seconds, a single high violin harmonic rings out and holds unresolved. No melody, no movement, just weight. The sound of a very patient authority acknowledging you."

All three infiltration cues share the 2-second opening drone so the audience hears "this is the same choice-moment" before the faction-specific second half diverges.

---

## PART 3 — ACT 4 "THE PRISONER / THE REVELATION"

### 3.0 — Narrative anchor

**Trigger:** Level 5 or 3 completed game modes. Hub detects via `act_4_started` or `act_4_prisoner_cell_complete`.

**Premise:** The truth about The Human emerges — one of three paths depending on Act 1 choice (Willing Disclosure / Discovery / Betrayal). Collector's Arena is REFRAMED as memory extraction from Kael. Four boss fights become Kael memories: The Cell, The Extraction, Warlord Rematch, White Oracle Meets. Army recruitment unlocks. Bond 80 = Memorial Corridor milestone (Two Witnesses Meet — Caravaggio light, player's judgment).

**Source files:** `narrativeActs.ts:637-884` (ACT_4_THE_REVELATION full VO + dialog wheels), `actsFourFiveShells.ts:20-110` (§9 ACT_4_PRISONER_CHAPTERS — 4 chapters as Kael memories).

**Cinematics in this part:** 9 — opener (21s), 3 path variants (Willing / Discovery / Betrayal, 12s each), Memorial Corridor (15s — the Bond 80 beat), 4 Kael extraction memories (6s each), Engineer Recording 6 "A Boy from Celebration" (12s).

**VFX atlases:** 3 — Kael memory-palace fire-orange, Caravaggio light cone, prison-mirror reflection.

**Music:** act-4 opener (21s), 3 path underscores, Memorial Corridor cue (the single most important music cue in the bible — first time the narrators' two themes converge), 4 extraction stingers, Recording 6 underscore (reuse §1.7).

### 3.1 — VFX atlases (Act 4)

**vfx_act4_kael_memory_palace** — `.../act-4/kael_memory_palace.png` · 2048×2048 transparent

> Warm fire-orange atlas simulating a memory-palace visualization — slow-motion embers, half-burnt paper fragments drifting, architectural shapes of a childhood neighborhood rendered in orange-on-black line drawings at 30% opacity. Used as the inner-ring overlay during Kael extraction cinematics (the Collector's Arena reframe). Seamless on Y-axis for continuous upward drift. The fragments are DELIBERATELY not-quite-readable (hand-drawn building outlines, a child's chalk map, etc.) — they belong to Kael, not the player.

**vfx_act4_caravaggio_light_cone** — `.../act-4/caravaggio_light_cone.png` · 1024×2048 transparent

> A single angled cone of warm tungsten light falling from upper-left to lower-right, as if from a high window. The cone has soft-edged volumetric air inside it (visible dust motes in the beam) and a warm amber core (#d4a04a) at ~40% opacity fading to transparent at the edges. Used EXCLUSIVELY on CIN-ACT4-MEMORIAL-CORRIDOR. The Caravaggio reference is to the painter's dramatic chiaroscuro — a single diagonal light cone defining the entire composition's morality. The rest of the frame falls into deep shadow; this cone is what the audience judges by.

**vfx_act4_prison_mirror_reflection** — `.../act-4/prison_mirror_reflection.png` · 1024×1024 transparent

> A subtle radial distortion texture that simulates looking INTO a mirror and seeing something that isn't quite in the room. Concentric soft-rings of slight chromatic-aberration (R/B split 2px at center, fading to 0 at the edges). A faint figure-silhouette embedded at the center at 8% opacity (Kael's silhouette shape — broad-shouldered, dreadlocked). Used as overlay on the `vfx_act4_prison_mirror_reflection` compositing surface — where the act-4 opener's prison mirror shows Kael even though he's not physically in the cell.

### 3.2 — CIN-ACT4-OPENER — Act 4 opener (21s, P0)

**Output:** `apps/client/public/videos/acts/act-4/cin_act4_opener.mp4` · 16:9 · 1920×1080

"The Prisoner" opener. Prison cell + mirror where the observation window should be.

**START FRAME:** Interior of a prison cell at night, 16:9. Dim blue emergency lighting from above-frame. Small cell: metal bunk on the right wall (empty), a single metal chair center, a full-length mirror mounted where the observation window would normally be (left wall). The mirror is CLEAN and the cell visible in its reflection — but the reflection is EMPTY (no Kael figure, no prison guard shape behind camera, just the cell). Palette: deep cool blue, metallic-grey, one cold-white light strip. Film grain.

**END FRAME:** Same cell, same composition. The mirror now shows a FAINT FIGURE where the reflection was empty — Kael's silhouette (broad-shouldered, long dreadlocks, rendered per his Part 2C Phase 2 Enslaved canon but desaturated to mirror-tone). He is INSIDE the mirror, looking out at the camera. The cell itself remains empty — nobody on the bunk, nobody in the chair. The prison_mirror_reflection VFX atlas is applied at 100% intensity to the mirror surface. Film grain.

**MOTION PROMPT:**

> 21-second one-shot. Camera locked, no motion. Beats:
> - 0.0-5.0s: start frame holds. Empty cell, empty mirror. The audience is supposed to note the odd emptiness.
> - 5.0-9.0s: the blue cell-light FLICKERS once at 6.0s (150ms flicker). At 8.5s it flickers a second time, longer (400ms). The flickers are subtle disruptions.
> - 9.0-13.0s: during a third flicker at 10.5s (1-second duration — the light is almost OUT for this window), Kael's figure resolves into the mirror. When the light comes back up, he is there. The audience catches it in peripheral vision; the cell itself is still empty.
> - 13.0-17.0s: Kael holds in the mirror. His chest rises ONCE (a held breath). He does not break eye-contact with the camera.
> - 17.0-20.0s: the prison_mirror_reflection radial distortion visibly activates — concentric chromatic rings expand outward from Kael's center through the mirror, as if the mirror surface is BENDING. Still no movement in the cell itself.
> - 20.0-21.0s: held on end frame.
> 24fps, deep cool-blue palette, film grain.

**SUNO v4:** see mus_act4_opener in §3.7.

### 3.3 — CIN-ACT4-PATH-{WILLING,DISCOVERY,BETRAYAL} — Revelation path cinematics (12s each, P0)

Three sibling cinematics, branching on Act 1's `act1_path` flag. Each is the MOMENT the truth about The Human lands on the player. Shared framing device: The Human breaks protocol and shows his face to the player directly — the manner of showing is the branch.

**Shared START FRAME (all three):** Close bust framing of The Human (per Living Character Sheet bible Part 1B canon), 1:1 square 2048×2048. He is in his standard red-eye-emissive pose, fedora at asymmetric tilt. But the CRT-scanline overlay is HEAVIER than standard (40% opacity), and the composition is lit colder than usual — cool cyan rim instead of warm red key. The feeling: he is BROADCASTING from somewhere he shouldn't be broadcasting from.

**Shared setup prompt framework:** all three cinematics play at the same moment in game-flow, but the visual delivery of the revelation differs per path.

**CIN-ACT4-PATH-WILLING — END FRAME:**

> The Human has taken off his FEDORA and set it on a surface (implied — hat visible at lower-frame edge on a dark wooden shelf). Without the hat brim's shadow, both of his red-emissive eyes are FULLY exposed and glowing at 1.5× baseline intensity (his REVEALING expression per Part 1B.2). His face bears a weathered openness the audience hasn't seen before — the weight of a man who has chosen to tell the truth. CRT-scanline overlay drops from 40% to 15% (he is clearer now). Cool cyan rim warms to a cautious amber-cyan mix. Film grain.

**MOTION PROMPT (Willing):** 12-second one-shot. Camera locked. Beats:
- 0.0-3.0s: shared start frame holds. Heavy scanline, cold rim.
- 3.0-5.0s: his left hand (not visible in frame, but gesture implied) lifts off-camera. At 4.0s his head tilts up 3° — the brim-shadow begins to lift from his right eye.
- 5.0-7.0s: the fedora is visibly removed — lifted up and out of frame-top. Both eyes now fully exposed.
- 7.0-10.0s: eye-emissive ramps from baseline 1.0 to 1.5× peak over 3 seconds. The cool cyan rim transitions to warm-cyan mix. Scanline overlay drops from 40% to 15%.
- 10.0-12.0s: held on end frame. He has chosen to show the player his face.
Palette: warming from cool-cyan to cyan-amber mix. Film grain.

**CIN-ACT4-PATH-DISCOVERY — END FRAME:**

> The Human's fedora is STILL ON, but the CRT-scanline overlay has PARTIALLY FAILED — large horizontal bands of the scanlines have dropped out, exposing his face in uneven strips. His eyes are at baseline intensity but his expression reads as UNGUARDED in a way he didn't choose — the player has seen through him, not been shown. One of his eyes (the left, visible one) is cast slightly downward now; he will not look at camera. Palette: colder overall, scanline-break bands at unpredictable positions. Film grain.

**MOTION PROMPT (Discovery):** 12-second one-shot. Camera locked. Beats:
- 0.0-3.0s: shared start frame — Human at baseline, heavy scanline.
- 3.0-7.0s: across 4 seconds, three separate horizontal BANDS of scanline-breakage emerge at random y-positions (one at ~3.5s, one at 5.0s, one at 6.5s), each a 30-pixel vertical zone where the CRT overlay drops to 0 and The Human's skin is fully visible behind. The player is seeing through gaps in his veil.
- 7.0-10.0s: held. The scanline-breakage bands persist. His left eye drifts downward — not looking at camera now.
- 10.0-12.0s: end frame holds. He has been seen, not revealed.
Palette: cold, fragmented. Film grain.

**CIN-ACT4-PATH-BETRAYAL — END FRAME:**

> The Human's fedora is still on. His eyes are at 2.0× intensity (overdriven, hot-red aggressive), staring directly at camera. Behind him, a second layer of VIOLET-MAGENTA GLITCH becomes visible overlaid on his CRT scanlines — the color of the Hierarchy corrupting the signal. Someone is WATCHING this transmission with him. His mouth is set in a line that is not calm; it is resigned. Film grain.

**MOTION PROMPT (Betrayal):** 12-second one-shot. Camera locked. Beats:
- 0.0-3.0s: shared start frame holds.
- 3.0-6.0s: his eye-emissive ramps from 1.0 to 2.0× intensity over 3 seconds — he is STRAINING, barely containing the signal.
- 6.0-9.0s: the VIOLET-MAGENTA second-layer glitch fades in over 3 seconds, reaching 40% opacity at 9.0s. The audience sees: he is being watched. His transmission is being listened to by someone else.
- 9.0-11.0s: held. His mouth sets into a resigned line. The violet-magenta glitch pulses in-and-out at 2Hz (flickering interference).
- 11.0-12.0s: held on end frame. The betrayal is not Kael's — it is his own, forced by the Hierarchy's presence in the channel.
Palette: aggressive red + violet-magenta corruption + cold cyan rim. Film grain.

**SUNO v4:** see mus_act4_path_{willing,discovery,betrayal} in §3.7 — three variants of the revelation cue.

### 3.4 — CIN-ACT4-MEMORIAL-CORRIDOR — Two Witnesses Meet (15s, P0) ★ KEY BEAT

**Output:** `apps/client/public/videos/acts/act-4/cin_act4_memorial_corridor.mp4` · 16:9 · 1920×1080 · **Trigger:** Bond 80 milestone

The single most important character-beat cinematic in the entire bible. For the first time Elara and The Human appear in the same frame at the same time — the Memorial Corridor is a long dark hall lit by a single Caravaggio-style diagonal light cone, and the two narrators stand at its edges looking at each other. The player stands in the light. This is the beat described in `witnessingIntegrations.ts` as "The Two Witnesses Meet" — a judgment scene where the player decides what to do with both of them.

**START FRAME:** Interior of a long narrow corridor, 16:9 1920×1080. Deep-perspective framing — the corridor recedes into darkness at the end. Everything is in deep Caravaggio shadow (80% of the frame near-black). A single diagonal beam of warm tungsten light falls from upper-left to lower-right, crossing the corridor floor at mid-distance. In that light-beam's warmth, ELARA stands on the LEFT WALL's edge — in her Living Character Sheet Part 1A canon (pale cool-cyan skin, rain-wet hair, holographic faint translucency at the shoulders) but rendered SOLID here (not translucent) for the first time. She is looking toward the opposite wall. On the RIGHT WALL's edge, THE HUMAN stands — in his canonical Part 1B pose (black fedora at asymmetric tilt, red-emissive eyes). He is looking toward the left. Between them, IN THE LIGHT BEAM, stands the player (implied, empty spot — the camera is positioned at this empty spot; the audience IS the player here). Palette: deep shadow dominant, warm tungsten amber in the single beam. Film grain heavy.

**END FRAME:** Same corridor, same composition. Both narrators have MOVED — Elara is now one step closer to the light beam (left foot has advanced into the warm light), The Human has removed his FEDORA (held in one hand at his side), his red-emissive eyes fully exposed. They are looking AT EACH OTHER across the beam, not at the player. Elara's expression: grief, recognition. The Human's expression: grief, recognition. Neither is speaking. The Caravaggio light cone is slightly brighter — the moment has been SEEN. Film grain preserved.

**VEO 3.1 MOTION PROMPT:**

> 15-second one-shot. Camera locked in the player-position, looking down the corridor. This is the most heavily composed cinematic in the bible and every beat matters. Narrative beats with frame timings:
> - **0.0-2.0s (held start):** start frame holds. Both narrators in their canonical poses, looking toward each other through the player's space. Neither moves. The warmth of the single light beam is the only warmth in a very cold composition.
> - **2.0-5.0s (Elara steps forward):** Elara's LEFT foot advances ~30cm into the light beam. Her face enters the warm tungsten and her pale-cyan skin is caught in the amber light for the first time in the game — she looks almost WARM. Her expression shifts from steady to grieving. She is recognizing The Human.
> - **5.0-7.0s (Human removes hat):** The Human's right hand lifts toward his head. Over 2 seconds, he takes off the fedora. The gesture is deliberate, respectful. His red-emissive eyes become fully exposed. He holds the hat at his side.
> - **7.0-10.0s (eye contact):** they look AT EACH OTHER across the light beam. Neither looks at the camera (the player). For the audience this is the first time these two characters have seen each other. Both are holding grief. The Caravaggio light slightly intensifies.
> - **10.0-12.0s (held silence):** three full seconds of perfect stillness. Nobody moves. Nobody speaks. The audience is supposed to feel the weight of Bond 80 — everything in the player's relationship with both of them has led to this moment.
> - **12.0-14.0s (subtle gesture):** Elara's head inclines 2° toward The Human. The Human's head inclines 2° toward Elara. Small, mutual. An acknowledgment.
> - **14.0-15.0s (end held):** end frame. The audience has seen them meet. The player now chooses what to do next (dialog surface appears post-cinematic).
> Cinematography: absolutely no camera motion. Focal length LOCKED. 24fps. Film grain HEAVY. Palette: deep Caravaggio shadow with the single warm tungsten beam — the reference is specifically Caravaggio's The Calling of Saint Matthew. The beam of light IS the narrative focus; everything else recedes.

**SUNO v4:** see mus_act4_memorial_corridor in §3.7 — this is the first time Elara's theme and The Human's theme play in the same cue. They don't harmonize; they're in DIFFERENT KEYS simultaneously (Elara in D-minor, Human in F-minor) held as a dissonant-but-not-ugly tension throughout the 15 seconds. No resolution. The tension is the point.

### 3.5 — CIN-ACT4-KAEL-EXTRACTION-{1,2,3,4} — Collector's Arena memory reframe (6s each, P1)

Four sibling cinematics that play BEFORE each of the §9 ACT_4_PRISONER_CHAPTERS boss fights. The Collector's Arena is reframed narratively as MEMORY EXTRACTION from Kael — each "boss fight" is actually the player pulling a specific memory out of Kael's mind.

**Shared framing:** Kael (Part 2C Phase 2 Enslaved — shirtless, prisoner-bracers, brass medallion) is seated/bound in a dim clinical extraction chamber. Around him: warm fire-orange `vfx_act4_kael_memory_palace` overlay activates to visualize the memory being surfaced. Each chapter surfaces a different memory.

**CIN-ACT4-KAEL-EXTRACTION-1 (The Cell)**

- START FRAME: Kael bound in the chair, dim cool-clinical light, no memory-palace overlay yet.
- END FRAME: vfx_act4_kael_memory_palace at 60% intensity forms a warm ring around him. Inside the ring, embers compose a faint CELL DOOR silhouette — the memory is of a PRISON CELL (not the Ark's, an earlier one from his enslavement). Kael's expression: braced.
- MOTION: 0-1s held start. 1-3s memory-palace overlay activates and surfaces the cell-door silhouette over 2 seconds. 3-5s Kael's chest rises once — he is giving up the memory. 5-6s end held.

**CIN-ACT4-KAEL-EXTRACTION-2 (The Extraction)**

- START FRAME: same chamber, memory-palace overlay already partial (the previous memory still resolving).
- END FRAME: memory-palace overlay reconfigures into a different pattern — embers compose a HAND reaching toward Kael's forehead. The memory is meta: a previous extraction BY someone else, before the player. Kael's expression: tired.
- MOTION: 0-1s held start. 1-3s overlay shifts — cell-door shape dissolves, embers reform into a hand-shape. 3-5s Kael's head tilts away from the hand ~5°. 5-6s end held.

**CIN-ACT4-KAEL-EXTRACTION-3 (Warlord Rematch)**

- START FRAME: same chamber, memory-palace activated.
- END FRAME: overlay forms a YELLOW-ARMORED WARLORD SILHOUETTE at the edge of the ring — Kael's memory of the Warlord before she was the host. The silhouette matches the Living Character Sheet bible Part 2T yellow-armor canon. Kael's expression: controlled rage.
- MOTION: 0-1s held start. 1-3s warlord silhouette resolves over 2s. 3-5s Kael's jaw clenches visibly; fracture-tattoos (if visible) darken. 5-6s end held.

**CIN-ACT4-KAEL-EXTRACTION-4 (White Oracle Meets)**

- START FRAME: same chamber, memory-palace activated.
- END FRAME: overlay forms a FIGURE-SILHOUETTE in flowing robes with a staff — the White Oracle (Kael's contact before his fall). The silhouette is luminous-white against the warm fire-orange ring. Kael's expression: grief + gratitude.
- MOTION: 0-1s held start. 1-3s white-oracle silhouette forms from embers. 3-5s Kael closes his eyes briefly — this is the memory he did NOT want to give up. 5-6s end held.

All four share the same composition + camera-lock; the VARIATION is entirely in the memory-palace overlay's ember patterns. Commission as one base plate (Kael in the chair) plus four END FRAME variants + one motion template.

**SUNO v4:** see mus_act4_extraction_{1,2,3,4} in §3.7 — each is a 6s cue on a common harmonic foundation with distinct instrumentation per memory.

### 3.6 — CIN-ACT4-ENGINEER-RECORDING-6 — "A Boy from Celebration" (12s, P1)

**Output:** `.../act-4/cin_act4_engineer_recording_6.mp4` · **Trigger:** `engineer_recording_6_discovered` flag

Sixth recording. The Engineer recounts his childhood in Celebration — the program before Sorrow.

**START FRAME:** Same holographic rig as Recordings 2/3 from Part 1, inert beam.

**END FRAME:** Engineer's hologram resolves in the beam — but FURTHER BACK than previous recordings, in his Phase 1 Prince form (cream-and-gold ceremonial attire, per Part 2V/W.3 canon). The blue-white hologram palette now tints warmer toward honey-gold — 30% amber mix. Behind him, embedded at 15% opacity: faint outlines of PARADE PENNANTS fluttering (Celebration iconography). He is YOUNGER in this recording — before everything. His expression: uncorrupted, earnest.

**MOTION PROMPT:** 12-second one-shot. Camera locked.
- 0-2s: inert rig.
- 2-3s: beam activates with LESS static than Recordings 2-3 (this is an older recording, cleaner).
- 3-6s: Prince Engineer assembles. The assembly particles are BRIGHTER than previous recordings — this memory is vivid. Honey-gold tint emerges over 3s.
- 6-9s: parade pennants fade in behind him at 15% opacity over 3s.
- 9-11s: he speaks (silent in cinematic). Pennants flutter gently.
- 11-12s: dissolves. The pennants fade last — they linger 0.5s after he is gone.
24fps, honey-gold + blue-white tint mix, film grain. Feels warmer than any previous Recording — this is the Engineer before the sorrow took him.

### 3.7 — Suno v4 music prompts (Act 4)

**mus_act4_opener** — `.../act-4-intro.mp3` · 21s

> Suno v4 prompt: "Prison-cell night ambience, 21 seconds. Low ventilator drone underneath, held throughout. At 6 seconds a single metallic TICK (a cell light flickering or a pipe contracting in cool air). At 10.5 seconds, TWO seconds of near-silence — the ambient drone dips to 30% volume. From 12-17 seconds the drone returns and is joined by a distant low male humming — wordless, three slow notes in A-minor. Ends unresolved at 21 seconds. Cold, enclosed, watched. No percussion."

**mus_act4_path_willing** — 12s

> Suno v4 prompt: "12-second revelation cue — WILLING disclosure. Warm acoustic guitar fingerpicking in C-major opens at 0s. Layered at 4s with a single held female wordless vowel ('ah' on tonic). At 8s, low warm strings enter as grounding. Resolves on a major-6 chord at 11s. Hopeful in a grown-up way. The sound of the truth chosen freely."

**mus_act4_path_discovery** — 12s

> Suno v4 prompt: "12-second revelation cue — DISCOVERY. Same tonic starting note as mus_act4_path_willing but in A-minor. Opens with plucked harp (fragmented, unevenly spaced — notes like glimpses through gaps). Layered at 6s with a breathy flute playing a suspended-4th phrase. No resolution — ends on a held question. The sound of seeing through something."

**mus_act4_path_betrayal** — 12s

> Suno v4 prompt: "12-second revelation cue — BETRAYAL. Same tonic note but in D-minor. Opens with a single low piano cluster — dissonant, pressed-down. At 4s a distorted synth wash enters (cool, mechanical — the Hierarchy's signature). At 8s, the original acoustic motif from mus_act4_path_willing appears briefly at 30% volume, then is cut off by the distortion. Ends in grinding uncertainty. The sound of being overheard."

**mus_act4_memorial_corridor** — 15s ★ KEY CUE

> Suno v4 prompt: "15-second dual-theme cue for the Memorial Corridor. Elara's theme and The Human's theme play SIMULTANEOUSLY in DIFFERENT KEYS — Elara in D-minor (a cool-cyan string arrangement with breathy female vocal on tonic), The Human in F-minor (a warm-red low brass + held male vocal on F). Both begin at 0s. They do NOT harmonize. They do NOT resolve. The tension between them is HELD through all 15 seconds as a dissonant-but-not-ugly interval. At 10s a single low bell tolls once — neither theme acknowledges it. Ends on the same held dissonance it started on. 15 seconds of two people in a room who cannot harmonize but are nonetheless present to each other. No percussion. Critical: render the full 15s with the simultaneous layering intact."

**mus_act4_extraction_1,2,3,4** — 6s each

> Suno v4 base prompt (with per-memory instrumentation override): "6-second memory-extraction cue over a common foundation of low cello drone in D-minor. Per-memory instrumentation:
> - Extraction 1 (The Cell): add a slow metronome tick (half-note quarters)
> - Extraction 2 (The Extraction): add a breathy female wordless vowel on dominant
> - Extraction 3 (Warlord Rematch): add low trombone note held
> - Extraction 4 (White Oracle): add single high bell harmonic
> Each variant shares the cello drone foundation; the added instrument reflects the memory's flavor. Each ends on the same unresolved drone. No percussion beyond the metronome in #1."

---

## PART 4 — ACT 4.5 "DEAD MAN'S CIRCUIT"

### 4.0 — Narrative anchor

**Trigger:** After Act 4. Hub detects via `act_4_5_started` or `act_4_5_circuit_complete`.

**Premise:** Identity-as-wager racing + casino (Degen's Pact). The player's identity chain — Student → Seeker → Detective → The Last — is literally wagered at the track. Each race stakes a version of themselves; losing means that identity-stage becomes canon going forward, shaping Act 5-7 dialog.

**Source files:** `actsFourFiveShells.ts:114-165` (§10 DEAD_MANS_CIRCUIT_TRACKS).

**Cinematics in this part:** 2 — opener (21s), Identity Wager (8s; plays before each race to surface the stakes).

**VFX atlases:** 2 — identity-chip etching texture, entropy-table glow.

**Music:** opener (21s), identity-wager stinger (8s).

### 4.1 — VFX atlases (Act 4.5)

**vfx_act4_5_identity_chip_etching** — `.../act-4_5/identity_chip_etching.png` · 1024×1024 transparent

> Close-in texture of a bone-and-brass casino chip with an abstract identity-glyph etched into its surface. The etching is fine — microscopic precision — and lit from within by a soft warm amber emissive along the glyph lines. No legible text. Four glyph variants: STUDENT (crossed quills), SEEKER (compass-rose), DETECTIVE (magnifying-lens ring), THE LAST (single vertical stroke). Deliver as one 2×2 grid sheet; slice into four individual chip sprites in post.

**vfx_act4_5_entropy_table_glow** — `.../act-4_5/entropy_table_glow.png` · 2048×2048 transparent

> Entropy-violet radial glow texture used as the Degen's casino table backdrop. Deep violet (#3a1a5a) center fading to near-black at the edges, with fine GOLD DUST motes drifting upward from the center at ~8px/s. Used as animated background overlay during the Identity Wager cinematic and at the casino UI surfaces.

### 4.2 — CIN-ACT4_5-OPENER — Act 4.5 opener (21s, P1)

**Output:** `apps/client/public/videos/acts/act-4_5/cin_act4_5_opener.mp4` · 16:9 · 1920×1080

Racing + casino composite, per the existing `acts-4-through-7-asset-pipeline.md` Act 4.5 spec. Refined here with Veo 3.1 motion directives.

**START FRAME:** Wide shot of a bone-and-chrome racetrack winding through a void-field. The track is rendered as skeletal white struts + polished chrome rails against cold starless black. One kart sits at the starting line — its driver helmet has no visor, just a blank NAME-TAG SLOT. Palette: bone-white + chrome + cold violet void. Film grain.

**END FRAME:** Same track but the composition has ZOOMED OUT to reveal, in the background, the DEGEN'S CASINO TABLE — a circular table lit from below with entropy-violet glow (the vfx_act4_5_entropy_table_glow texture). On the table: 4 chips — STUDENT / SEEKER / DETECTIVE / THE LAST. A dealer in a dark hood whose hands are visible and whose face is not. Film grain.

**MOTION PROMPT:** 21-second one-shot. Camera slow pull-back from starting line to full composite view. Beats:
- 0-6s: held on start frame. Single kart at line, track extends into void.
- 6-11s: slow pull-back begins. Track recedes, more of the void-field visible.
- 11-16s: casino table REVEALED at the edge of the pull-back at 11s. Table fully visible by 16s.
- 16-19s: one of the four chips (randomly — per-render variant if possible) LIFTS from the table and drifts toward camera for 3s, then settles back down at 19s. The chip briefly shows its etching.
- 19-21s: end frame held — full composite visible.
24fps, bone-white + entropy-violet dual palette. Film grain.

### 4.3 — CIN-ACT4_5-IDENTITY-WAGER — Pre-race stake beat (8s, P1)

**Output:** `.../act-4_5/cin_act4_5_identity_wager.mp4`

Plays before each of the DMC races to surface which identity-chip is being wagered.

**START FRAME:** Close-up of the Degen's casino table (Living Character Sheet Part 2J canon: blue-skinned demonic Ne-Yon, amber eye-glow, olive-drab vest, brass pocket-watch). His hands are visible, holding a single identity chip. Entropy-violet glow below. Film grain.

**END FRAME:** The Degen has PLACED the chip face-up on the table. The chip's etching (one of the four glyphs) is now fully visible and glowing at 1.5× baseline. His amber eye-glow has intensified. One finger of his other hand TAPS the chip once (the "house-edge" gesture from his canonical rig). Film grain.

**MOTION PROMPT:** 8-second one-shot. Camera locked, close on table. Beats:
- 0-2s: start frame holds.
- 2-4s: Degen rotates the chip in his fingers slowly.
- 4-6s: he places the chip face-up on the table. The etching glows from 0 to 1.5× baseline over 2s.
- 6-7s: finger tap on the chip — one decisive tock.
- 7-8s: end held.
Violet + amber palette. Film grain.

### 4.4 — Suno v4 music prompts (Act 4.5)

**mus_act4_5_opener** — 21s

> Suno v4 prompt: "Identity-wager dual-space ambience. 21 seconds. Opens with 7 seconds of a racing engine warming up heard AT HALF VOLUME through a wall — mechanical purr, rising rpm. At 7s, a casino dealer's CARD-SHUFFLE sound enters at the same half-volume, overlaying the engine. Both heard as if from the next room. At 14s, entropy-violet synth wash enters — sustained, slowly descending. At 19s both mechanical sounds (engine + shuffle) drop out, leaving only the synth wash. Ends unresolved at 21s. Neutral, curious, doom-adjacent."

**mus_act4_5_identity_wager** — 8s

> Suno v4 prompt: "8-second pre-race identity-stake cue. Opens with a single deep piano note in D-minor. At 3s, a subtle violet synth pad enters below. At 5s, a bone-dry PERCUSSIVE TICK (a chip being placed on a table). At 6s another tick (the finger tap). At 7s a held cello note joins the synth pad. Ends on an unresolved suspension at 8s. Spare, weighted, formal. The sound of a contract being offered."

---

## PART 5 — ACT 5 "THE RECKONING / THE MAP"

### 5.0 — Narrative anchor

**Trigger:** After Act 4.5 / Act 4 resolution. Hub detects via `act_5_started`.

**Premise:** Kael's five-sector map revealed. Army recruitment becomes primary gameplay loop. CADES FPS introduced — 7 missions, Iron Lion dies in M7 (mandatory narrative death). Veridian VI last stand. Bridge of Kael post-credits reveals Vex Solène (Agent Zero's name).

**Source files:** `narrativeActs.ts:893-980` (ACT_5_THE_MAP), `actsFourFiveShells.ts:166-228` (§11.3 CADES_FPS_MISSIONS + §11.4 BRIDGE_OF_KAEL_POST_CREDITS).

**Cinematics in this part:** 6 — opener (21s), Bulb Dims (8s — Vortex Advance trigger), Sector Wakes (8s — community reclamation), Iron Lion Final Broadcast (14s — M7 death beat), Bridge of Kael post-credits (12s), Engineer Recording 7 "Prayers in Metal" (12s — final recording, the bleakest).

**VFX atlases:** 3 — Iron Lion broadcast static, vortex consumption edge, Kael map ink-on-ration-wrapper.

**Music:** opener (21s), Bulb Dims + Sector Wakes counterpart stingers, Iron Lion final-broadcast score (the single most difficult cue — both triumph and mourning in the same 14 seconds), Bridge of Kael post-credits cue, Engineer Recording 7 score (the bleakest underscore, no reuse — this one needs a unique composition).

### 5.1 — VFX atlases (Act 5)

**vfx_act5_iron_lion_broadcast_static** — `.../act-5/iron_lion_broadcast_static.png` · 2048×2048

> Heavy CRT/radio-broadcast static pattern, grey-warm tinted (slight orange undertone from fire). Seamless tile. Used as overlay during the Iron Lion Final Broadcast cinematic — intensifies across the clip as the signal fails. Heavier than the Palimpsest Host's crawl-strip; this is a SIGNAL DYING in real time. No rendered text.

**vfx_act5_vortex_consumption_edge** — `.../act-5/vortex_consumption_edge.png` · 2048×2048 transparent

> A deep-void encroaching-edge texture. Radial dark-violet-to-black gradient from any edge toward frame center, with subtle scattered "void-flecks" that appear to be consuming light. Used as overlay on the Bulb Dims cinematic + on game-mode UI surfaces during active Vortex Advance periods. No rendered text.

**vfx_act5_kael_map_ink** — `.../act-5/kael_map_ink.png` · 2048×1024 transparent

> Ration-wrapper-paper background (dim beige, creased, slightly translucent) with hand-scrawled KAEL HANDWRITING in low-light-red-flashlight ink. The handwriting lists 5 sectors and 20 worlds in dense columns — intentionally abstract glyph-marks, NOT legible text. Used as background overlay on the Act 5 opener + as atmospheric element in the War Room recruitment UI.

### 5.2 — CIN-ACT5-OPENER — Act 5 opener (21s, P0)

**Output:** `apps/client/public/videos/acts/act-5/cin_act5_opener.mp4` · 16:9 · 1920×1080

Builds on the existing `acts-4-through-7-asset-pipeline.md` Act 5 spec.

**START FRAME:** Dim interior at night, 16:9. A ration wrapper on a scratched metal table, low red-flashlight illumination. The wrapper is flipped to its blank back-side, where a single pre-written word is faintly visible in pencil (render as abstract mark — not legible). Palette: near-black with red-flashlight warmth. Film grain heavy.

**END FRAME:** Same wrapper, same table, but the wrapper is now COVERED in dense red-pencil handwriting — Kael's map (5 sectors, 20 worlds, per `vfx_act5_kael_map_ink` atlas). A faint outline of Iron Lion's silhouette is visible in a mirror surface at frame edge (he is watching from elsewhere). Palette: same red-flashlight palette, slightly warmer as if a second light has entered the frame. Film grain.

**MOTION PROMPT:**

> 21-second one-shot. Camera locked, close on the table. Beats:
> - 0-5s: start frame holds — blank wrapper, single faint pencil mark.
> - 5-15s: across 10 seconds, the handwriting APPEARS on the wrapper — not by a visible hand, but emerging line by line as if drawn by someone just off-camera. Each new line appears at roughly one-second intervals. The marks are scrawled, hasty, desperate. By 15s the wrapper is covered.
> - 15-18s: the camera does NOT move, but the mirror at frame edge catches a reflection — Iron Lion's silhouette visible for 2s then gone.
> - 18-21s: end frame holds. The map is complete. Somewhere else a gunshot echoes (audio hand-off).
> 24fps, red-flashlight palette dominant. Film grain.

**SUNO v4:** see mus_act5_opener in §5.7.

### 5.3 — CIN-ACT5-BULB-DIMS (8s, P1) + CIN-ACT5-SECTOR-WAKES (8s, P1)

Two counterpart cinematics that play when the Vortex Advance crosses its lit-sector ratio thresholds:
- Bulb Dims: lit sectors fall below 20% — warning beat, community loses ground
- Sector Wakes: community reclamation completes — celebration beat, community gains ground

Shared composition: a stylized star-map aerial view of a single sector with a central BULB icon representing civilization status. Palette contrast: Bulb Dims = cold violet consumption encroaching, Sector Wakes = warm golden illumination spreading.

**CIN-ACT5-BULB-DIMS — END FRAME:** star-map view with vortex_consumption_edge texture at 70% opacity encroaching from all edges. Central bulb dimmed to 20% of starting brightness. Surrounding star-points mostly dark. Cold violet dominant, slight warm amber hint at the bulb's last resistance. Film grain.

**MOTION (Bulb Dims):** 8s. Camera locked. Beats: 0-2s map with healthy bright bulb. 2-6s vortex_consumption_edge fades in from 0 to 70% over 4s. 6-7s bulb dims from 100% to 20% brightness. 7-8s end held. Mood: the worst beat the player will ever see on a healthy sector.

**CIN-ACT5-SECTOR-WAKES — END FRAME:** star-map same scale. Central bulb at 150% of starting brightness (overdriven with warm amber bloom). Surrounding star-points LIT — maybe 40% of them glowing. No vortex_consumption overlay. Warm golden dominant, hints of cyan hope around the periphery. Film grain.

**MOTION (Sector Wakes):** 8s. Camera locked. Beats: 0-2s map with dim bulb + dark sector. 2-5s bulb brightens from 40% to 150% over 3s. 5-7s surrounding stars light up one-by-one. 7-8s end held. Mood: the best beat the player will ever see on a recovered sector. Paired with Bulb Dims — they use identical framing so the player feels the difference when they play.

**SUNO v4:** see mus_act5_bulb_dims + mus_act5_sector_wakes in §5.7.

### 5.4 — CIN-ACT5-IRON-LION-FINAL — Veridian VI last stand (14s, P0) ★ KEY BEAT

**Output:** `apps/client/public/videos/acts/act-5/cin_act5_iron_lion_final.mp4` · 16:9 · 1920×1080 · **Trigger:** `cades_m7_complete`

Iron Lion's mandatory narrative death. He has been the player's command-voice through all 7 CADES FPS missions; in M7 he transmits his final broadcast from Veridian VI before being overrun. This cinematic plays after the M7 fight's mechanical completion. Second only to the Memorial Corridor in importance — where Memorial Corridor is dissonant tension, this is RESOLVED GRIEF.

**START FRAME:** Iron Lion in silhouette on the bridge of a command ship, 16:9 1920×1080. Wide shot: broadcast antenna visible above him through the bridge canopy, a Cades approach visible through the forward viewport — ships approaching. He stands facing the viewport (back to camera). Red emergency lighting dominates the bridge. Palette: red emergency light + deep shadow + cool starlight through viewport. Film grain + faint `vfx_act5_iron_lion_broadcast_static` overlay at 15% opacity.

**END FRAME:** Same bridge, same framing. Iron Lion has turned to face CAMERA (partial profile — he is not looking at camera, he is looking slightly past it, mid-broadcast). He is in his Living Character Sheet bible canonical form (to be authored in a future bible addendum; he is Iron Clad Lions faction, white ceremonial plate armor with ICL stenciling, per Kael Phase 1 material family). Behind him through the viewport: the approaching Cades are CLOSER, their details visible — angular gunmetal hulls with red eye-lights. He is speaking to the player one last time. His mouth moves silently (VO track handles audio). Broadcast_static overlay now at 70% intensity — the signal is dying. Film grain heavy.

**VEO 3.1 MOTION PROMPT:**

> 14-second one-shot. Camera locked. This is a DEATH cinematic shown as PRESENCE — Iron Lion is alive for all 14 seconds; his death happens after. Narrative beats:
> - 0-3s: start frame holds. Iron Lion silhouette at viewport, Cades visible but distant. Red emergency light steady.
> - 3-5s: the red emergency light begins to PULSE (1Hz) — alarm system behind the scenes. Cades have gotten closer in the viewport (subtle zoom effect on the approaching ships — not camera motion, just the ships advancing).
> - 5-8s: Iron Lion TURNS to face camera over 3 seconds. Slow, deliberate. His face is revealed — his canonical Part-2-bible form (to be authored), battle-worn but composed. His mouth is already moving silently (he is already speaking; the cinematic has joined his broadcast mid-sentence).
> - 8-11s: held on his face speaking. Broadcast_static overlay RAMPS from 15% to 70% over 3s. His face fragments visually as the signal degrades.
> - 11-13s: at 12s, for a single frame, the image CUTS OUT entirely (black frame with ~60% static at 1/24 second duration). When the image returns at 12.042s, Iron Lion is still there, still speaking. At 13s the Cades explode through the viewport (distant detonation at small scale — the ship is hit).
> - 13-14s: image TRANSITIONS to pure broadcast static at 100% for the final second — Iron Lion is gone, only signal remains.
> 24fps, red emergency palette dominant, broadcast_static intensifies across the clip. Film grain heavy.

**SUNO v4:** see mus_act5_iron_lion_final in §5.7 — a 14-second score that must thread triumph and mourning in the same piece. This is Iron Lion's theme completed for the first and last time.

### 5.5 — CIN-ACT5-BRIDGE-OF-KAEL — Post-credits reveal (12s, P1)

**Output:** `.../act-5/cin_act5_bridge_of_kael.mp4` · **Trigger:** `kael_questline_complete` + `returned_to_bridge_post_kael`

Post-credits scene per §11.4 of `actsFourFiveShells.ts`. Fires ONCE when both flags align. The Engineer (in canonical Part 2V/W Phase 2 form, one final time) activates a console, a Dischordia card materializes from it, and delivers one final line. The card is the ENGINEER'S MEMORIAL CARD — collected permanently in the Trophy Room. Vex Solène (Agent Zero's real name) is revealed as a note inscribed on the back of the card.

**START FRAME:** Empty bridge of the Ark's observation deck, 16:9. A console on a raised platform at frame center, inert. Cold ambient starlight through a wide viewport behind. No figure visible. Palette: deep cool-blue with faint warm amber bleed from the console's standby-light. Film grain.

**END FRAME:** Console is now ACTIVE — the Engineer stands beside it in his full Part 2V/W Phase 2 canon (red coat, red goggles, utility belt with gauges). His goggles are UP on forehead (listening/present mode — the rare honest posture). He is looking at the camera. In the console's hologram beam floats a single DISCHORDIA CARD — its face shows a stylized image of the Engineer's workshop, back-face visible if rotated would show the inscription "Vex Solène" (render as abstract calligraphic mark — not legible text from the player's angle). Film grain, warm amber + cool starlight dual palette.

**MOTION PROMPT:**

> 12-second one-shot. Camera locked, no motion. Beats:
> - 0-2s: inert console, empty bridge.
> - 2-4s: the console ACTIVATES — small amber light warms on, a faint hum begins.
> - 4-6s: the Engineer walks into frame from offscreen-right and stops beside the console. Per canonical rig — brass utility-belt gauges tick audibly (one-tap per 1.7s cycle).
> - 6-8s: he reaches to the console. The hologram beam activates. A single Dischordia Card materializes in the beam over 2 seconds.
> - 8-10s: he lifts his goggles from over-eyes to brim-of-cap (the listening/present gesture). His real eyes are now visible — tired but clear. He looks at camera directly.
> - 10-11s: he speaks (silent in cinematic; VO overlays). One line.
> - 11-12s: the card rotates 90° in the beam — the back-face inscription "Vex Solène" is briefly visible (abstract mark, not legible). End frame.
> 24fps, warm amber + cool blue. Film grain. This is a gentle cinematic; no drama, just closure.

**SUNO v4:** see mus_act5_bridge_of_kael in §5.7.

### 5.6 — CIN-ACT5-ENGINEER-RECORDING-7 — "Prayers in Metal" (12s, P1)

**Output:** `.../act-5/cin_act5_engineer_recording_7.mp4` · **Trigger:** `engineer_recording_7_discovered`

Final Engineer Recording. The bleakest. Departs from Recordings 2-6's holographic-rig format — this one is a DAMAGED signal, recorded in the moment before everything ended.

**START FRAME:** The standard holographic rig on the Bench, but BROKEN — visible scorch marks on the cylinder housing, the projector beam inert but JITTERING (faint blue-white flicker with no content). The Bench itself around the rig is also in disarray: scattered tools, a knocked-over coffee mug, a small dark stain on the floor. Palette: Bench-warm amber, but everything cooler and sadder than previous Recording settings. Film grain heavy.

**END FRAME:** Beam is FULLY ACTIVE but HEAVILY corrupted — the Engineer's hologram is PARTIALLY PRESENT, with large sections missing (maybe 40% of his form is just absence). What IS visible: his face, his shoulders, and one hand. His hologram palette is mostly GREY (desaturated from blue-white) with occasional warm-amber flickers. His expression: the most exhausted he has ever been. Behind him, faintly embedded at 5% opacity: not a younger self, not a corrupted shape, just EMPTY ROOM. He is alone when he records this, and the Ark knows it. Film grain heavy.

**MOTION PROMPT:**

> 12-second one-shot. Camera locked. This is the last Recording — the Engineer's final words. Beats:
> - 0-2s: damaged rig, jittering empty beam, disarray on Bench.
> - 2-4s: beam STRUGGLES to activate — full static for 2s, failed attempts.
> - 4-7s: Engineer's hologram resolves at only 60% completeness. Missing sections are random — shifting per frame as the signal degrades. Face is always present (he fought to make the face transmit); body is intermittent.
> - 7-10s: he speaks silently. His hand occasionally reaches toward camera and is then missing for 1-2 frames before reappearing.
> - 10-11s: recording BEGINS TO FAIL — static RAMPS from 20% to 80% over 1 second, the hologram is dissolving.
> - 11-12s: beam cuts to pure blue-white static for 0.5s, then goes DARK. The rig sparks once and stills. End frame. He is gone.
> 24fps, grey-dominant palette with rare warm-amber flicker. Film grain heavy. This is an ENDING cinematic.

### 5.7 — Suno v4 music prompts (Act 5)

**mus_act5_opener** — 21s

> Suno v4 prompt: "Ration-wrapper-map ambience, 21 seconds. Opens with 7 seconds of near-silence — just a faint air-hiss and the sound of Kael's hoarse breath reading aloud (wordless — register only). At 7s a low held cello note enters in A-minor, sustained. At 14s a second low instrument joins (bassoon, held) — layered below the cello at a tritone interval. At 20s a single distant gunshot audio CRACK echoes once. Ends unresolved. Grief in a locked room."

**mus_act5_bulb_dims** — 8s

> Suno v4 prompt: "8-second consumption stinger. Opens with one held warm amber synth pad in F-minor. At 2s, a COLD violet synth begins to BLEED INTO the warm pad from the edges (stereo-wide panning), gradually dominating. At 5s the warm pad has been reduced to 30% while the violet is at 80%. Ends at 8s with the warm pad at 15%, nearly consumed. The sound of something being drained."

**mus_act5_sector_wakes** — 8s

> Suno v4 prompt: "8-second reclamation stinger. Paired counterpart to mus_act5_bulb_dims — shares harmonic foundation. Opens with a dim warm amber synth pad in F-minor. At 2s, a GOLDEN brass swell enters from below, slowly brightening. At 5s a small choir vowel joins on the major-3 (a single held 'ah'). At 8s the composition resolves on a major chord — the ONLY fully-resolved music cue in the entire bible. Hope, earned. The sound of something coming back."

**mus_act5_iron_lion_final** — 14s ★ KEY CUE

> Suno v4 prompt: "14-second score for Iron Lion's final broadcast. Must thread TRIUMPH and MOURNING in the same piece. Opens with Iron Lion's theme (horn fanfare in D-major, noble, held) at full dynamic for 3 seconds. At 3s, the horn BEGINS TO WAVER (pitch drifts slightly sharp then flat — the broadcast is failing). At 5s, the horn is joined by a low cello playing a MINOR-KEY counter-melody in D-minor — grief underneath the triumph. Both continue through 10s. At 11s, the cinematic CUTS TO BLACK for 1/24 second — render as a single beat of silence in the score (skip 0.042s at 11s). At 11.042s, both instruments RESUME. At 13s, they STOP ABRUPTLY (no decay). Static hiss fills 13-14s. Ends with single low mourning note on cello solo, unresolved. Critical: the horn theme is Iron Lion's SIGNATURE — render so it can be reused in his memorial card + Trophy Room wall."

**mus_act5_bridge_of_kael** — 12s

> Suno v4 prompt: "12-second post-credits closure cue. Opens with 2 seconds of silence, then a gentle piano chord in G-major. At 4s, a warm tenor hums wordlessly in octaves. At 8s, a single Dischordia-card-materialization sound (a soft harp glissando upward). At 10s, the tenor resolves onto the tonic and fades. Ends in silence at 12s. Gentle closure. No drama, just goodbye."

**mus_act5_engineer_recording_7** — 12s (UNIQUE cue, no reuse)

> Suno v4 prompt: "12-second score for Engineer's final recording. Opens with heavy broadcast static at 40% volume for 2 seconds — then the static SUDDENLY DROPS to 5% revealing a single solo cello playing a slow descending phrase in E-flat-minor. At 6s a second cello joins playing the same phrase a fifth below (grieving duet). At 10s, static RAMPS back from 5% to 80% across 1 second, drowning the cellos. At 11s, the beam cuts — render as sudden silence with only a faint room-hum. Ends at 12s. The bleakest cue in the bible. No reuse — this composition belongs to this moment only."

---

## PART 6 — ACT 6 "THE CONFESSION"

### 6.0 — Narrative anchor

**Trigger:** 5+ army recruitment missions completed.

**Premise:** Both narrators break. Elara confesses she was human — she sacrificed her humanity for immortality. The Human confesses he's been playing the villain deliberately to protect something unseen. The "Watcher" concept surfaces — something beyond Architect/Dreamer.

**Source files:** `narrativeActs.ts:988-1144` (ACT_6_THE_CONFESSION — 2 confession sequences + 4 choice branches, fully authored with VO).

**Cinematics in this part:** 4 — opener (21s), Elara Confession (14s — her face resolves in full resolution for first time), The Human Confession (14s — his fedora + coat + badge arrangement on a table), Watcher Reveal (8s — the new threat surfaces as a shape the narrators cannot see).

**VFX atlases:** 2 — Elara face-resolve grain (transition from holographic-flicker to photoreal), Watcher shape stencil (the silhouette players see but narrators don't).

**Music:** opener (21s), dual-confession score (Elara 14s + Human 14s — thematic counterparts), Watcher reveal stinger (8s — the first time the audience gets a MUSICAL hint of what's past the spine's outer edge).

### 6.1 — VFX atlases (Act 6)

**vfx_act6_elara_face_resolve_grain** — `.../act-6/elara_face_resolve_grain.png` · 2048×2048 transparent

> A transitional texture that interpolates from HEAVY holographic scanline + particle-flicker overlay (the Elara players have seen all game) to CLEAN film-grain only (photorealistic portrait quality). Deliver as 5 intermediate stops at 0%, 25%, 50%, 75%, 100% resolution — runtime blends between them during Elara's confession. Used EXCLUSIVELY on her confession cinematic. When the player sees her face clearly, they have never seen her like this before.

**vfx_act6_watcher_shape_stencil** — `.../act-6/watcher_shape_stencil.png` · 2048×2048 transparent

> A humanoid-adjacent shape stencil at 8-15% opacity, intentionally blurry/low-detail — the Watcher is not a character, it is a CONCEPT the players begin to sense. Broad shoulders, no face, hands at sides. Taller than human proportions. Used as an overlay that fades in during specific dialogue moments throughout Act 6 — most players will see it and not register it. The Watcher is visible to the AUDIENCE but not to Elara or The Human. Use sparingly.

### 6.2 — CIN-ACT6-OPENER — Act 6 opener (21s, P0)

**Output:** `apps/client/public/videos/acts/act-6/cin_act6_opener.mp4`

Three-chair composition, per the existing `acts-4-through-7-asset-pipeline.md` Act 6 spec.

**START FRAME:** Empty interior room, 16:9. Simple wooden table at center. Three chairs around it — two facing the camera, one with its back to camera (far side). On the nearest chair's edge: Elara's holographic-tinted empty outline (subtle — 5% opacity, suggests she was there). On the middle chair: The Human's fedora + black coat draped over the back, his badge on the table. On the table also: two glasses of water, half-full. The far chair: empty, but one glass of water sits next to it — with a LIP MARK on the rim. Palette: warm amber room-light, cool shadow in corners. Film grain.

**END FRAME:** Same room, same framing. Elara's holographic outline has RESOLVED (from 5% to 25% opacity — she is becoming more real). The Human's coat is still draped, fedora still on the chair back. But the third chair's glass — the one with the lip mark — has ROTATED ~2° on the table as if it had been set down differently during the 21 seconds. Someone was there. Film grain.

**MOTION PROMPT:** 21-second one-shot. Camera locked. Beats: 0-5s start held. 5-12s Elara's outline gradually resolves from 5% to 25% opacity. 12-14s the third glass rotates 2° on the table (no hand visible). 14-18s warm amber room-light brightens 10%. 18-21s end held. 24fps, warm amber palette, film grain.

### 6.3 — CIN-ACT6-ELARA-CONFESSION — Her face resolves for the first time (14s, P0)

**Output:** `.../act-6/cin_act6_elara_confession.mp4` · 1:1 · 2048×2048

Elara's confession. Her holographic tinting falls away across 14 seconds and the player sees her FACE — not her projection, not her ghost, her — for the first time in the entire game.

**START FRAME:** Elara in her canonical Part 1A holographic bust framing. Heavy scanline + particle overlay, cool cyan hologram palette, translucent at shoulder-edges. She is mid-breath, about to speak. Eyes direct to camera. Film grain + `vfx_act6_elara_face_resolve_grain` at 0% resolve (full holographic).

**END FRAME:** Same framing, same composition, same pose — but rendered CLEAN and PHOTOREAL. No scanlines. No particles. No translucency. Her skin is warm — the cool-cyan undertone she has had all game is GONE. Her hair is not rain-wet. Her eyes are the same blue but without emissive glow. She is a WOMAN — specifically — and the audience realizes what the game has been hiding. Expression: the weight of having been human and chosen otherwise. Film grain only; no special-effect overlays.

**MOTION PROMPT:** 14-second one-shot. Camera locked. Beats:
- 0-3s: start frame held. Full holographic Elara.
- 3-10s: across 7 seconds, the `vfx_act6_elara_face_resolve_grain` blends from 0% to 100%. Scanlines fade, particles dissipate, cool-cyan undertone warms, translucency closes. She BECOMES photoreal.
- 10-12s: she is fully photoreal. Her mouth moves (silent — VO overlays the confession).
- 12-14s: end frame. She looks at camera directly.
24fps, transition from cool-cyan holographic to warm photoreal. Film grain preserved.

### 6.4 — CIN-ACT6-HUMAN-CONFESSION — Trench coat on a chair (14s, P0)

**Output:** `.../act-6/cin_act6_human_confession.mp4` · 16:9 · 1920×1080

The Human's confession, shown as an ABSENCE. His fedora, coat, and badge arranged on a chair + table — but he is not in the composition. He speaks from offscreen. The VO alone carries the confession; the visual is his things without him.

**START FRAME:** Single wooden chair in warm amber room-light, 16:9. His FEDORA hangs on the chair back. His black high-collar coat is draped over the chair seat. His BADGE is on a small side-table to the right. A half-full glass of water sits next to the badge. No figure. Palette: warm amber, deep shadow behind, gold badge glint. Film grain.

**END FRAME:** Same composition — but the CAMERA has subtly moved closer (the only Act 6 cinematic with camera motion, and it is a modest ~15% dolly-in across 14s). The badge is now in sharper focus. Next to the badge: a small folded PIECE OF PAPER that was not there at start frame (it has materialized during the 14s — a letter left behind by someone who couldn't stay to deliver it). The letter is folded; contents not visible. Film grain.

**MOTION PROMPT:** 14-second one-shot. Camera very slow dolly-in (~15% zoom over 14s). Beats:
- 0-4s: start frame, slow zoom begins.
- 4-10s: continued zoom. Nothing visible changes in frame except the growing scale.
- 10-11s: the folded letter APPEARS on the table (fade-in, no hand visible).
- 11-14s: dolly-in completes, end frame held. The audience is left with the letter.
24fps, warm amber palette, film grain. This is a confession shown as ABSENCE — the Human has left the room while still speaking.

### 6.5 — CIN-ACT6-WATCHER-REVEAL — The shape surfaces (8s, P1)

**Output:** `.../act-6/cin_act6_watcher_reveal.mp4` · 16:9 · 1920×1080 · **Trigger:** after Human Confession completes

The first time the audience sees the Watcher's shape clearly — still at low opacity, still vague, but clearly THERE.

**START FRAME:** The Human's chair + coat composition from §6.4. Empty room, no Watcher visible.

**END FRAME:** Same composition — but in the DEEP BACKGROUND (~8m back, at the room's far wall), the `vfx_act6_watcher_shape_stencil` is visible at 18% opacity. Broad-shouldered, too tall, no face, hands at sides. It is STANDING THERE. The Human's things in the foreground are unchanged. The Watcher has been in the room with us. Palette same warm amber. Film grain.

**MOTION PROMPT:** 8-second one-shot. Camera locked. Beats: 0-3s start held, room empty. 3-6s Watcher shape fades in across 3 seconds from 0% to 18% opacity — SLOW, so it reads as something emerging from the wall itself. 6-7s held. 7-8s end held — shape still there. Palette unchanged; the reveal is in the opacity ramp. Film grain.

### 6.6 — Suno v4 music prompts (Act 6)

**mus_act6_opener** — 21s

> Suno v4 prompt: "Three-chairs-at-a-table ambience, 21 seconds. Opens with room-tone + distant wall-sounds (another room behind a wall, muffled — a conversation you cannot quite make out). At 8s a warm cello drone enters in E-flat-major. At 14s, a THIRD PRESENCE breathing enters underneath both — not loud, but audibly present. Breathing is slightly out-of-sync with any visible person would have. Ends on held drone + breath. Unguarded. The first honest silence of the spine."

**mus_act6_elara_confession** — 14s

> Suno v4 prompt: "14-second Elara confession score. Opens with Elara's theme in D-minor (cool-cyan strings + breathy female vocal tonic — the holographic motif she has carried through the spine). Across 7 seconds (3s-10s), the theme TRANSITIONS — string arrangement shifts from cool-cyan timbral palette to WARM earth-toned palette. Same notes, same key, but timbral warmth changes under it. At 10s the theme is FULLY WARM — she is a woman now, musically. At 12s a single high harmonic on violin enters above. Ends unresolved at 14s. The transition of her TIMBRE is the entire point. Render so the notes don't change but the warmth does."

**mus_act6_human_confession** — 14s

> Suno v4 prompt: "14-second Human confession score. Opens with The Human's theme in F-minor (warm-red low brass + held male vocal F — his signature). Across 14 seconds the theme slowly SIMPLIFIES — instruments drop out one at a time. At 4s the low brass cuts. At 8s the male vocal cuts. At 11s a single solo trumpet remains. At 13s the trumpet fades to silence. Ends on 1 second of pure silence at 14s. The confession is not bigger than him — it is smaller. Every instrument that was armor has been set down."

**mus_act6_watcher_reveal** — 8s

> Suno v4 prompt: "8-second stinger for the Watcher shape fading in. Opens with 3 seconds of silence. At 3s, a single SUB-SONIC low note enters below audible range (felt more than heard — around 40Hz, gentle) and holds. At 5s a high etherial harmonic joins one octave above middle C — it has NO KEY relationship to any previous theme. The Watcher is outside the spine's musical palette. At 7s both tones hold steady. Ends at 8s. Uncanny, not-of-this-world, patient. No percussion. No melody. Just presence."

---

## PART 7 — ACT 7 "THE CONVERGENCE"

### 7.0 — Narrative anchor

**Trigger:** 15+ army recruitment missions completed.

**Premise:** Army assembled. Two wars revealed: the visible (order vs. chaos) and the invisible (against the Watcher). For the first and only time, Elara and The Human's voices ALIGN — one sustained chord. Four final stances: FOR HUMANITY / SEE THE PATTERN / THE BRIDGE / TAKE COMMAND. All canon-safe — the choice affects dialog tone, not outcome. Final VO: *"I've been waiting a very long time to say that to someone."*

**Source files:** `narrativeActs.ts:1152-1254` (ACT_7_THE_CONVERGENCE — army status + 4 paths + closing line, fully authored).

**Cinematics in this part:** 7 — opener (21s), Two Wars Diagram (8s — visible war vs. invisible war), Voices Align (15s ★ THE moment), 4 stance variants (4-6s each).

**VFX atlases:** 3 — army composite parallax (assembled factions across 5 sectors), voices-align chord ring (visual manifestation of the single sustained chord), invisible-war overlay (chalkboard-style diagram of the Watcher-threat).

**Music:** opener (21s), two-wars transition stinger, voices-align sustained chord (the KEY cue of the entire bible — Elara's D-minor and Human's F-minor reconcile into a single resolved chord), 4 stance resolution cues.

### 7.1 — VFX atlases (Act 7)

**vfx_act7_army_composite_parallax** — `.../act-7/army_composite_parallax.png` · 3840×1080 (widescreen)

> A wide aerial composite of the assembled army across five sectors. 5 horizontal bands representing the 5 sectors, with silhouettes of faction groupings in each: Insurgents (orange-red, battle-worn), Authority defectors (charcoal-black, uniformed), Dreamer's Shield survivors (pale cyan, ceremonial), Antiquarian scholars (gold, robed), Free Ports smugglers (mixed earth-tones). All facing the same direction. Composition: rendered as a single aerial composite, LOW DETAIL per figure (silhouettes not portraits — this is a WIDE shot of scale). Deliver at 3840×1080 for parallax-scrolling UI use. Film grain.

**vfx_act7_voices_align_chord_ring** — `.../act-7/voices_align_chord_ring.png` · 2048×2048 transparent

> A radial chromatic-gradient ring texture. Center: pure white bloom. Mid-band: a smooth gradient from Elara's cool-cyan (#4ba3b5, inner) through a neutral gold (#d4a04a, mid) to The Human's warm-red (#b81a1a, outer). Outer band: fades to transparent. The ring represents a SUSTAINED CHORD made visible — a single musical moment rendered as light. Used as overlay on the Voices Align cinematic at 100% intensity.

**vfx_act7_invisible_war_overlay** — `.../act-7/invisible_war_overlay.png` · 2048×2048 transparent

> A chalkboard-style diagram texture. Black background with white chalk lines drawing a battle-map: on the LEFT HALF faction boundaries labeled with abstract glyphs (Insurgency / Empire / Hierarchy / Dreamer / Free Ports — no legible text), on the RIGHT HALF a single shape labeled "WATCHER" in slightly different (reddish) chalk. Arrows drawn from the LEFT HALF's chaos toward the RIGHT HALF's shape — the audience now sees both wars at once. The narrators draw this on-screen; the viewer (player) sees the Watcher that narrators cannot. Used as background overlay on the Two Wars Diagram cinematic.

### 7.2 — CIN-ACT7-OPENER — Act 7 opener (21s, P0)

**Output:** `apps/client/public/videos/acts/act-7/cin_act7_opener.mp4` · 16:9 · 1920×1080 (or 3840×1080 widescreen)

Per the existing `acts-4-through-7-asset-pipeline.md` Act 7 spec. Wide army-composite shot.

**START FRAME:** Dark frame with a single warm amber PINPOINT of light at frame center (the only star in the void). Wide 16:9. Palette: deep black + single gold pinpoint. Film grain.

**END FRAME:** The full `vfx_act7_army_composite_parallax` texture rendered at wide-shot — 5 faction bands stretched across the composition, all figures facing a common direction. The single warm pinpoint at frame-center is STILL there but now contextualized as the far-horizon target the army faces. Palette: full spectrum of faction colors balanced against the dark. Film grain.

**MOTION PROMPT:**

> 21-second one-shot. Camera slow pull-back from the pinpoint to the army composite. Beats:
> - 0-4s: pinpoint held, nothing else visible.
> - 4-12s: slow pull-back reveals the first faction band (Insurgency, closest — orange-red silhouettes). Over 8 seconds.
> - 12-17s: additional faction bands reveal as the pull-back continues — Authority, Dreamer, Antiquarian, Free Ports, each entering frame at ~1-second intervals.
> - 17-20s: full army composite visible. All bands facing the pinpoint.
> - 20-21s: end held. The moment of assembly.
> 24fps, full palette. Film grain.

### 7.3 — CIN-ACT7-TWO-WARS-DIAGRAM — The invisible war revealed (8s, P1)

**Output:** `.../act-7/cin_act7_two_wars_diagram.mp4` · 16:9 · 1920×1080

Elara and The Human (both present in a single frame for the first time outside the Memorial Corridor) sketching a diagram on a blackboard. The left side shows factions — the visible war. The right side shows the Watcher — the invisible war.

**START FRAME:** Blackboard in a dim room, 16:9. Blank chalkboard, Elara (photoreal per Part 6) standing at left with chalk in hand, The Human at right with chalk in hand. Both looking at the board. Palette: warm lamp-light, black board, white chalk. Film grain.

**END FRAME:** Board now FULLY DRAWN with the `vfx_act7_invisible_war_overlay` diagram — faction boundaries on the left, Watcher shape on the right (in slightly-redder chalk), arrows connecting them. Both narrators have stepped back from the board, still holding chalk, looking at what they have drawn. Neither has drawn the Watcher — but neither seems surprised it's there. The audience realizes: they KNOW about it, they just cannot perceive it directly. Film grain.

**MOTION PROMPT:** 8-second one-shot. Camera locked. Beats:
- 0-2s: blank board, both narrators ready.
- 2-5s: across 3 seconds, faction boundaries are drawn on the LEFT side — both narrators chalk in alternation, Elara drawing Dreamer/Authority lines while The Human draws Insurgency/Free Ports.
- 5-6s: simultaneously, the Watcher shape APPEARS on the RIGHT side of the board — but NEITHER narrator draws it. It simply manifests in slightly-redder chalk.
- 6-7s: both narrators look at the right side of the board. Neither is surprised.
- 7-8s: they step back. End frame.
Palette: warm chalkboard lamp-light. Film grain.

### 7.4 — CIN-ACT7-VOICES-ALIGN — Single sustained chord (15s, P0) ★★ THE KEY BEAT

**Output:** `.../act-7/cin_act7_voices_align.mp4` · 1:1 · 2048×2048

The beat the player has been waiting for. For the first and only time in the spine, Elara and The Human's voices merge into a SINGLE SUSTAINED CHORD — their themes (D-minor and F-minor) reconcile into a unified resolution. Narratively: they speak one sentence TOGETHER. Visually: the `vfx_act7_voices_align_chord_ring` rings out as a visible manifestation of the chord.

**START FRAME:** Close framing of both narrators' faces in side-by-side composition — Elara photoreal (post-Act-6 canon) on the left, The Human (Part 1B canon, red-emissive eyes at baseline) on the right. Both are in MID-SENTENCE, mouths slightly open. Between them at mid-frame: empty space — ~40% of the composition's width is just the space between them. Palette: warm amber lamp-light, both faces lit. Film grain.

**END FRAME:** Same composition, but the SPACE between them now contains the `vfx_act7_voices_align_chord_ring` overlay at 100% intensity. The ring is a visible manifestation of the single sustained chord — cyan inner (Elara), gold mid (convergence), red outer (The Human), all present in ONE COMPOSITION. Both narrators' faces are now bathed in the ring's light — Elara warmed by the gold and red, The Human cooled by the gold and cyan. They look at each other across the chord. Film grain.

**VEO 3.1 MOTION PROMPT:**

> 15-second one-shot. Camera locked. This is the KEY beat of the entire bible. Narrative beats:
> - 0-2s: start frame held. Both in mid-sentence, separate.
> - 2-5s: both mouths move simultaneously — they speak the SAME SENTENCE in alignment. Their audio tracks lock to each other (audio hand-off) and the cinematic is silent, letting the score carry the weight.
> - 5-9s: the `vfx_act7_voices_align_chord_ring` APPEARS in the center space between them — fades in from 0% to 50% opacity over 4 seconds. Center-bloom first, then mid-band cyan/gold/red emerges. Both narrators' faces are gradually lit by the ring.
> - 9-11s: ring intensifies to 100%. Both narrators' mouths close simultaneously — the sentence is finished.
> - 11-13s: ring holds at 100%. Narrators look at EACH OTHER for the first time in this cinematic — same gesture, same moment. Small mutual nod.
> - 13-15s: end frame held. The chord rings on in the score underneath; the image is still. This is the first full resolution the game has allowed.
> 24fps, warm amber lamp-light + full-spectrum chord-ring. Film grain.

**SUNO v4:** see mus_act7_voices_align in §7.7 — THE key cue of the entire bible. Must render Elara's D-minor theme and The Human's F-minor theme as a CONVERGED CHORD — tonic D, major-third with both narrators' voices singing the shared resolution. 15-second sustained chord. This is the composition's emotional peak.

### 7.5 — CIN-ACT7-STANCE-{HUMANITY,PATTERN,BRIDGE,COMMAND} — Final stance variants (4-6s each, P1)

Four sibling cinematics that play when the player commits to their Act 7 final stance. All are canon-safe — the choice shapes dialog tone, not outcome. Shared framing: the player's final commitment rendered as a simple visual statement.

**Shared START FRAME:** the end frame of CIN-ACT7-VOICES-ALIGN — both narrators in side-by-side composition, chord ring holding at 100% between them. This is the AFTERMATH.

**CIN-ACT7-STANCE-HUMANITY — END FRAME:** the chord ring has SIMPLIFIED from cyan+gold+red gradient to PURE GOLD (the convergence color alone — humanity's warm center, neither narrator tint dominant). Elara and The Human are now looking at CAMERA (not each other). Both are warm-lit. Their expressions: resolute. Warm gold palette. Film grain.

**MOTION (Humanity):** 5s one-shot. 0-2s chord ring transitions from full-spectrum to pure gold across 2s. 2-4s narrators turn from facing each other to facing camera. 4-5s end held. Warm gold dominant.

**CIN-ACT7-STANCE-PATTERN — END FRAME:** the chord ring has COMPLEXIFIED — instead of simplifying, it has fractured into a fractal pattern of nested chord rings at different scales. Elara and The Human still look at each other, but their eyes now track along the pattern's lines. Their expressions: recognition of systems. Cool fractal palette with the original gold at the deepest center. Film grain.

**MOTION (Pattern):** 5s one-shot. 0-2s chord ring begins to fracture — smaller rings emerge from within the main one, nesting recursively. 2-4s narrators' eyes track the pattern. 4-5s end held. Cool palette with deep gold center.

**CIN-ACT7-STANCE-BRIDGE — END FRAME:** the chord ring has EXTENDED — stretching from the left side of the composition (Elara's cool cyan) to the right side (The Human's warm red) as a SPANNING BRIDGE rather than a ring. The narrators now both have one hand raised, reaching across the bridge toward each other (their hands meet in the mid-composition). Their expressions: commitment to connection. Full spectrum, linear. Film grain.

**MOTION (Bridge):** 5s one-shot. 0-2s chord ring deforms from circular to linear span — an ARC stretching across the composition. 2-4s both narrators raise one hand; their hands meet in the middle of the bridge-arc. 4-5s end held. Full spectrum palette, bridge composition.

**CIN-ACT7-STANCE-COMMAND — END FRAME:** the chord ring has CONTRACTED — from 100% opacity at full size down to a single intensely-bright small disc at the center of the composition. Both narrators have stepped FORWARD toward the audience (the player). Their expressions: focused authority. The small bright disc is a TARGET. Palette: deep shadow with one hot concentrated light. Film grain.

**MOTION (Command):** 6s one-shot. 0-2s chord ring contracts to a small bright central disc. 2-4s both narrators step one pace forward. 4-6s end held. Palette contracts from full-spectrum to a single concentrated point.

All four share the voices-align end-frame as their start — each represents a different interpretation of what to DO with the shared chord's resolution.

### 7.6 — Closing line note

After any of the 4 stance cinematics completes, the final VO line plays (per `narrativeActs.ts:1152-1254`): *"I've been waiting a very long time to say that to someone."*

The delivery should be Elara and The Human's voices overlaid on top of each other — both speaking the same line, with their individual timbral differences still audible but aligned. This is a VO production note, not a new cinematic — the line plays over the black fade-out following the chosen stance.

### 7.7 — Suno v4 music prompts (Act 7)

**mus_act7_opener** — 21s

> Suno v4 prompt: "Army-assembly reveal, 21 seconds. Opens with 4 seconds of silence — just distant wind. At 4s a single solo violin begins playing a simple melody in D-major (the army's theme, earnest and unadorned). At 12s a low brass ensemble joins below. At 17s a full orchestral swell fills the composition — the army revealed in full. Ends at 21s on a HELD major-7 chord — unresolved, hopeful, waiting. The sound of an army that has assembled and is not yet in motion."

**mus_act7_two_wars_transition** — 8s

> Suno v4 prompt: "8-second transition stinger. Opens with the Act 7 opener's army theme fading in (low brass holding a D-major chord) at 50% volume. At 3s, a COLD HIGH HARMONIC enters above — the Watcher's frequency from mus_act6_watcher_reveal. At 5s, the two coexist — the Watcher's frequency drifts in and out at uneven intervals as if the army's theme is trying to push it away. At 8s, held. Unresolved. The audience sees: both wars are real, both are happening at once."

**mus_act7_voices_align** — 15s ★★ KEY CUE

> Suno v4 prompt: "15-second SUSTAINED CHORD. This is the single most important music cue in Dischordian Saga. Elara's theme in D-minor and The Human's theme in F-minor CONVERGE into a single resolved chord. The arrangement:
> - 0-2s: both themes begin SEPARATELY, just as they did in mus_act4_memorial_corridor (Elara D-minor cool-cyan strings + female vocal tonic, The Human F-minor warm-red brass + male vocal F). They are still in different keys.
> - 2-5s: across 3 seconds, BOTH TRANSPOSE toward D-MAJOR. Elara's theme shifts from minor to major and brightens. The Human's theme shifts from F-minor to F-major while DESCENDING to D-major.
> - 5-9s: both themes are now in D-MAJOR. They ARE the same chord now. Female vocal + male vocal singing the SAME tonic (D). Strings + brass playing the SAME major-3 (F-sharp).
> - 9-13s: held. The chord RINGS. Full dynamic. This is the convergence.
> - 13-15s: chord holds but begins very slowly to fade. Does NOT disappear by 15s — render the chord still ringing at 20% volume at 15s. The score continues INTO the stance cinematic that follows.
> Render as ONE COMPOSITION. The transposition from minor-to-major across 2-5s is the entire emotional arc of the piece. This is the spine's resolution. Critical: the composition MUST thread both themes' tonal identities so that the audience recognizes them as they reconcile."

**mus_act7_stance_humanity** — 5s

> Suno v4 prompt: "5-second Humanity stance closer. Inherits the voices_align chord still ringing at 20%. Warm gold brass tone joins, simplifying the chord toward a single D-major triad. Confidence, heart, chosen commitment."

**mus_act7_stance_pattern** — 5s

> Suno v4 prompt: "5-second Pattern stance closer. Inherits the voices_align chord. Adds a fractal arrangement of plucked strings — same note pattern played at 4 different rates simultaneously (a visible temporal lattice). Cool intellect, recognition."

**mus_act7_stance_bridge** — 5s

> Suno v4 prompt: "5-second Bridge stance closer. Inherits the voices_align chord. Elara's D-major theme and The Human's D-major theme now alternate across the stereo field — left ear / right ear / left ear / right ear — but both on the same tonic. The bridge spans the listener's head. Connection."

**mus_act7_stance_command** — 6s

> Suno v4 prompt: "6-second Command stance closer. Inherits the voices_align chord but IMMEDIATELY contracts it — full orchestral chord compresses down to a single concentrated trumpet note over 2 seconds. At 2s the trumpet plays a single decisive phrase in D-major. At 5s held on resolved tonic. Focused authority, no ornament."

**mus_act7_final_line_ambient** — ~3s

> Suno v4 prompt: "3-second wordless closing ambient. A single low held cello note in D-major over which Elara's and The Human's shared-sentence VO plays ('I've been waiting a very long time to say that to someone'). The score does NOT compete with the voiceover — it is just a held note underneath. Ends on resolved tonic as the VO ends. Fade to silence over 1 second after the line lands."

---


















