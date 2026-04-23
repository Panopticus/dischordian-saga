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






