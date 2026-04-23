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
