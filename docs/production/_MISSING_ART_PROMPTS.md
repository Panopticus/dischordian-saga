# _MISSING_ART_PROMPTS.md — outstanding producer-art deliverables

> **STATUS 2026-05-12 (late)** — all original gaps in this doc are now
> either closed or have a staged producer brief ready for handoff.
>
> | § | Status | Closing artifact |
> |---|---|---|
> | §A | **brief shipped** | `docs/production/_ORPHAN_POSTER_VEO_BRIEF.md` — 3 Veo 3.1 prompts with subject-reference poster URLs ready for render |
> | §B | **automated** | `apps/scripts/extract_cutscene_posters.sh` — ffmpeg one-shot extracts the 58 missing posters; manifest now declares posterRelPath for all 67 cutscenes |
> | §C | **closed** | NEW_ART_1 megadrop delivered all 7 vehicle baselines |
> | §D | **closed** | NEW_ART_2 megadrop delivered all 60 destinations |
> | §E | **spec retrofit shipped** | `docs/production/_PRODUCTION_FINAL_PART_III_RETROFIT.md` — full §4 architect specs for the 5 producer-NEW rooms (auction_house, dreamers_sanctum, game_masters_sanctum, meditation_garden, order_tribunal) |
> | §F | **closed** | NEW_ART_2 megadrop's apprentice + recruit sprite atlases close this gap |
>
> The only outstanding art work is the **25 chess cutscenes** declared in
> `docs/production/_CHESS_CUTSCENE_PROMPTS.md` (manifest entries +
> triggers + flags already wired in PR #623; mp4 renders pending
> producer per the prompts file). When those land, CDN coverage =
> 100%.
>
> The original gap analysis below is preserved for traceability.

---

Generated 2026-05-12 from `roomArtManifest.roomArtCoverageReport()` + the
NEW_CUTSCENES_67.zip ingest. Each section below maps to a category of
missing asset, with a producer-ready prompt scaffolded against the
established Nano Banana 2 (`gemini-3-pro-image-preview`) / Veo 3.1
(`veo-3.1-generate-001`) schema documented in `_PRODUCTION_FINAL.md` §0.2–§0.4.

**Summary**

| Category | Count | Asset type |
|---|---|---|
| §A Orphan posters → mp4 needed       | 3  | Veo 3.1 8s clip |
| §B Cutscene keyframes (no poster)    | 58 | NB2 still 1280×720 OR mp4 first-frame extract |
| §C Deferred vehicles                 | 7  | NB2 baseline still (16:9) |
| §D Deferred destinations             | 60 | NB2 baseline still + per-§4 fly-through |
| §E Producer-NEW (spec-retrofit only) | 5  | doc work, art already delivered |
| §F Apprentice/pedagogy extras (TBD)  | ≤8 | NB2 baseline still per spec |

**Total: 81 outstanding art deliverables + 8 documentation retrofits.**

---

## §A — Orphan posters needing animation (Veo 3.1)

Producer shipped `_start.png` poster stills in NEW_CUTSCENES_67.zip with no
matching `.mp4`. Each needs a Veo 3.1 clip rendered such that its first frame
matches the supplied poster (use the poster as the Veo subject-reference image
to lock continuity).

### A.1 `cs_guild_iron_first_arrival`

- **Category**: `guild_room`
- **CDN dest**: `cdn/client-public/art/cutscenes/guild_room/cs_guild_iron_first_arrival.mp4`
- **Poster reference**: `cdn/client-public/art/cutscenes/guild_room/cs_guild_iron_first_arrival_start.png` (already on CDN)

**VEO_PROMPT** (5-part schema + audio + timestamps; see _PRODUCTION_FINAL.md §0.3):

```
1. CINEMATOGRAPHY: first-person POV; static lockoff for 0–2s then slow dolly forward 2–6s; 35mm equivalent; smooth.
2. SUBJECT + ACTION: guild common-room of the House of Iron; first-arrival POV; iron-anvil dais + ember braziers; mood: foundational. Producer shipped poster cs_guild_iron_first_arrival_start.png; mp4 still missing.
3. ENVIRONMENT: per the supplied poster image; honour palette + props + lighting verbatim.
4. STYLE: match poster frame; preserve aesthetic_tier; void-energy compliant.
5. CONSTRAINTS: FPV_LOCK_PHRASE_VEO; subject-reference = the supplied _start.png poster.
AUDIO: room-ambient bed only; no diegetic dialogue (VO laid in post).
TIMESTAMPS: [00:00–00:02] hold on first frame; [00:02–00:06] slow dolly into scene; [00:06–00:08] settle on closing beat.
DURATION: 8s.  ASPECT: 16:9.  RESOLUTION: 1080p.
NEGATIVE_PROMPT: VEO_NEGATIVE_PROMPT (canonical; see §0.4).
```

### A.2 `cs_audit_day21_warden`

- **Category**: `mechronis_audit`
- **CDN dest**: `cdn/client-public/art/cutscenes/mechronis_audit/cs_audit_day21_warden.mp4`
- **Poster reference**: `cdn/client-public/art/cutscenes/mechronis_audit/cs_audit_day21_warden_start.png` (already on CDN)

**VEO_PROMPT** (5-part schema + audio + timestamps; see _PRODUCTION_FINAL.md §0.3):

```
1. CINEMATOGRAPHY: first-person POV; static lockoff for 0–2s then slow dolly forward 2–6s; 35mm equivalent; smooth.
2. SUBJECT + ACTION: mechronis audit chamber; day-21 verdict pillar lit on the Warden dial; warden official reading charges; cold blue judgement light. Producer shipped poster cs_audit_day21_warden_start.png; mp4 still missing.
3. ENVIRONMENT: per the supplied poster image; honour palette + props + lighting verbatim.
4. STYLE: match poster frame; preserve aesthetic_tier; void-energy compliant.
5. CONSTRAINTS: FPV_LOCK_PHRASE_VEO; subject-reference = the supplied _start.png poster.
AUDIO: room-ambient bed only; no diegetic dialogue (VO laid in post).
TIMESTAMPS: [00:00–00:02] hold on first frame; [00:02–00:06] slow dolly into scene; [00:06–00:08] settle on closing beat.
DURATION: 8s.  ASPECT: 16:9.  RESOLUTION: 1080p.
NEGATIVE_PROMPT: VEO_NEGATIVE_PROMPT (canonical; see §0.4).
```

### A.3 `cs_mission_return_success`

- **Category**: `mission`
- **CDN dest**: `cdn/client-public/art/cutscenes/mission/cs_mission_return_success.mp4`
- **Poster reference**: `cdn/client-public/art/cutscenes/mission/cs_mission_return_success_start.png` (already on CDN)

**VEO_PROMPT** (5-part schema + audio + timestamps; see _PRODUCTION_FINAL.md §0.3):

```
1. CINEMATOGRAPHY: first-person POV; static lockoff for 0–2s then slow dolly forward 2–6s; 35mm equivalent; smooth.
2. SUBJECT + ACTION: mission-briefing war room; squad returning with full crates + extracted survivors; tactical map glowing green; mood: triumphant. Producer shipped poster cs_mission_return_success_start.png; mp4 still missing.
3. ENVIRONMENT: per the supplied poster image; honour palette + props + lighting verbatim.
4. STYLE: match poster frame; preserve aesthetic_tier; void-energy compliant.
5. CONSTRAINTS: FPV_LOCK_PHRASE_VEO; subject-reference = the supplied _start.png poster.
AUDIO: room-ambient bed only; no diegetic dialogue (VO laid in post).
TIMESTAMPS: [00:00–00:02] hold on first frame; [00:02–00:06] slow dolly into scene; [00:06–00:08] settle on closing beat.
DURATION: 8s.  ASPECT: 16:9.  RESOLUTION: 1080p.
NEGATIVE_PROMPT: VEO_NEGATIVE_PROMPT (canonical; see §0.4).
```

---

## §B — Cutscene keyframes (NB2 stills; 58 cutscenes lack a producer-supplied poster)

Two acceptable delivery paths:

1. **ffmpeg extract** — pull the first frame of the existing mp4 and convert to
   webp/png. Fast, deterministic, no producer time needed. Command:

   ```bash
   for cs in cs_berth_sleep cs_berth_wake ... ; do
     ffmpeg -y -i apps/client/public/art/cutscenes/<cat>/$cs.mp4 \
       -frames:v 1 apps/client/public/art/cutscenes/<cat>/${cs}_start.png
   done
   ```

2. **NB2 hero-still authoring** — render a 1280×720 hero still per the per-cutscene
   prompt below. Use when the first frame of the mp4 is not visually descriptive
   enough for a marketing/poster surface (e.g. fade-in opening, black-frame transitions).

All keyframe outputs target the canonical filename `<cutscene_id>_start.png` at
`cdn/client-public/art/cutscenes/<category>/`.

### B.berth

**B.1 `cs_berth_nightmare`** — `art/cutscenes/berth/cs_berth_nightmare_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: apprentice in their berth, mid-nightmare; gloved hands gripping the edge of the bunk; HUD glitch overlay; dream-leak red tendrils crawling up the locker; clock at 03:14 AM
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.2 `cs_berth_sleep`** — `art/cutscenes/berth/cs_berth_sleep_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: apprentice settling into their berth bunk; comm-screen dimming; locker chime acknowledging good-night protocol; ambient cycle-phase blue
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.3 `cs_berth_visitor`** — `art/cutscenes/berth/cs_berth_visitor_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: berth comm-screen lit with an incoming caller silhouette; door indicator showing visitor at threshold; bunk just made; bronze-and-blue palette
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.4 `cs_berth_wake`** — `art/cutscenes/berth/cs_berth_wake_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: berth at dawn; pale gold light through the porthole; comm-screen showing daily docket; gloved hand reaching for the helmet on the table; clock at 06:00
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

### B.cohort_park

**B.5 `cs_cohort_argument`** — `art/cutscenes/cohort_park/cs_cohort_argument_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: cohort park bench; two apprentices facing each other mid-shout; third turning away; brass railings + ember planters; tension lighting
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.6 `cs_cohort_bonding`** — `art/cutscenes/cohort_park/cs_cohort_bonding_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: cohort park bench; four apprentices sharing a memory card; warm bronze-amber bonding glow; petals drifting; mood: tender
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.7 `cs_cohort_farewell`** — `art/cutscenes/cohort_park/cs_cohort_farewell_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: cohort park gate; cohort silhouettes saying goodbye to a departing member who carries a packed locker; soft dusk light; mood: melancholy
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.8 `cs_cohort_training`** — `art/cutscenes/cohort_park/cs_cohort_training_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: cohort park training mat; apprentices sparring with practice glyphs; HUD showing drill progress; daylit; mood: industrious
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

### B.comm_screen

**B.9 `cs_comm_archon_call`** — `art/cutscenes/comm_screen/cs_comm_archon_call_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: comm-screen showing an Archon's masked silhouette; static interference; caller-ID readout 'ARCHON / PRIORITY 1'; brass frame
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.10 `cs_comm_cohort_banter`** — `art/cutscenes/comm_screen/cs_comm_cohort_banter_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: comm-screen split into 3 panes showing cohort members laughing; bronze frame; warm tone
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.11 `cs_comm_doctrine_recitation`** — `art/cutscenes/comm_screen/cs_comm_doctrine_recitation_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: comm-screen broadcasting the canonical doctrine recitation; on-screen scrolling text in stylised Latinate script; austere theology palette
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.12 `cs_comm_mourning_call`** — `art/cutscenes/comm_screen/cs_comm_mourning_call_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: comm-screen showing the Mourning Wall fragment; candles flickering; caller-ID redacted; mood: grave
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.13 `cs_comm_warden_tap`** — `art/cutscenes/comm_screen/cs_comm_warden_tap_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: comm-screen with a warden's tap-warrant header; thin red border; small-text warrant body in monospace; mood: cold compliance
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

### B.doctrine_binding

**B.14 `cs_doctrine_cold_hand`** — `art/cutscenes/doctrine_binding/cs_doctrine_cold_hand_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: doctrine binding chamber; cold-hand sigil mid-projection on the binding altar; apprentice's gloved hand hovering just above; pale-blue ritual light
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.15 `cs_doctrine_compliant_mouth`** — `art/cutscenes/doctrine_binding/cs_doctrine_compliant_mouth_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: doctrine chamber; apprentice mouth-shape glyph carved into the binding stone; brass shackles glowing; mood: surrender
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.16 `cs_doctrine_forked_path`** — `art/cutscenes/doctrine_binding/cs_doctrine_forked_path_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: doctrine chamber; two divergent floor-glyphs lit one warm, one cold; player POV at the choice threshold
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.17 `cs_doctrine_heretical_quiet`** — `art/cutscenes/doctrine_binding/cs_doctrine_heretical_quiet_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: doctrine chamber; binding altar dimmed; apprentice's hand withdrawn; small heretical mark glowing at the apprentice's feet; mood: defiance
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.18 `cs_doctrine_human_remainder`** — `art/cutscenes/doctrine_binding/cs_doctrine_human_remainder_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: doctrine chamber; binding stone fractured to reveal an organic core; pale-pink flesh-light leaking through gold cracks; mood: revelation
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

### B.forge

**B.19 `cs_forge_failure`** — `art/cutscenes/forge/cs_forge_failure_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: the_forge; crafting plate cracked; ember-glow inverted to cold-blue; failed card-blank ejected onto the anvil; smoke + dust
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.20 `cs_forge_purified`** — `art/cutscenes/forge/cs_forge_purified_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: the_forge; purification basin with a card-blank hovering inside a vortex of white ember-light; mood: serenity
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.21 `cs_forge_upgrade`** — `art/cutscenes/forge/cs_forge_upgrade_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: the_forge; an upgraded card emerging from the anvil's heart; tier-glow gold; sparks; brass-bronze + amber palette
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

### B.guild_room

**B.22 `cs_guild_anvil_first_arrival`** — `art/cutscenes/guild_room/cs_guild_anvil_first_arrival_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: guild common-room of the House of Anvil; first-arrival POV; anvil-and-hammer crest above the hearth; iron-grey + bronze; warm forge-glow
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.23 `cs_guild_blood_first_arrival`** — `art/cutscenes/guild_room/cs_guild_blood_first_arrival_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: cs guild blood first arrival — beat-specific opening still
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.24 `cs_guild_bone_first_arrival`** — `art/cutscenes/guild_room/cs_guild_bone_first_arrival_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: cs guild bone first arrival — beat-specific opening still
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.25 `cs_guild_chapel_first_arrival`** — `art/cutscenes/guild_room/cs_guild_chapel_first_arrival_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: guild common-room of the House of Chapel; first-arrival POV; stained-glass triptych + pews; golden afternoon light
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.26 `cs_guild_cipher_first_arrival`** — `art/cutscenes/guild_room/cs_guild_cipher_first_arrival_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: guild common-room of the House of Cipher; first-arrival POV; lattice-glyph walls + decoded scrolls; cyan-on-violet palette
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.27 `cs_guild_circuit_first_arrival`** — `art/cutscenes/guild_room/cs_guild_circuit_first_arrival_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: guild common-room of the House of Circuit; first-arrival POV; circuit-board mosaic floor + neon trace walls; cyan + amber
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.28 `cs_guild_dust_first_arrival`** — `art/cutscenes/guild_room/cs_guild_dust_first_arrival_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: guild common-room of the House of Dust; first-arrival POV; sand-glass mandala floor + faded relics; bone-white + ochre
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.29 `cs_guild_garden_first_arrival`** — `art/cutscenes/guild_room/cs_guild_garden_first_arrival_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: guild common-room of the House of Garden; first-arrival POV; hanging-vines + biomimetic terrarium walls; verdant green + brass
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.30 `cs_guild_glass_first_arrival`** — `art/cutscenes/guild_room/cs_guild_glass_first_arrival_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: guild common-room of the House of Glass; first-arrival POV; crystalline-glass column rotunda + scryer's lens; cool-white + ice-blue
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.31 `cs_guild_ledger_first_arrival`** — `art/cutscenes/guild_room/cs_guild_ledger_first_arrival_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: guild common-room of the House of Ledger; first-arrival POV; ledger-stacked walls + abacus altar; sepia + brass
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.32 `cs_guild_mirror_first_arrival`** — `art/cutscenes/guild_room/cs_guild_mirror_first_arrival_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: guild common-room of the House of Mirror; first-arrival POV; mirrored colonnade reflecting into infinity; mood: vertiginous
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.33 `cs_guild_remnant_first_arrival`** — `art/cutscenes/guild_room/cs_guild_remnant_first_arrival_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: guild common-room of the House of Remnant; first-arrival POV; salvaged relics + spirit-mantles on hooks; copper + ash-grey
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.34 `cs_guild_smoke_first_arrival`** — `art/cutscenes/guild_room/cs_guild_smoke_first_arrival_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: guild common-room of the House of Smoke; first-arrival POV; censer-chains + incense haze; deep grey + bronze; mood: oneiric
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.35 `cs_guild_song_first_arrival`** — `art/cutscenes/guild_room/cs_guild_song_first_arrival_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: guild common-room of the House of Song; first-arrival POV; harp + sound-bowl arrangement; warm gold + maroon
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.36 `cs_guild_storm_first_arrival`** — `art/cutscenes/guild_room/cs_guild_storm_first_arrival_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: guild common-room of the House of Storm; first-arrival POV; lightning-glyph banners + tempered-steel altar; deep indigo + electric blue
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.37 `cs_guild_thread_first_arrival`** — `art/cutscenes/guild_room/cs_guild_thread_first_arrival_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: guild common-room of the House of Thread; first-arrival POV; loom + thread-mandala wall; gold-on-black
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.38 `cs_guild_thurible_first_arrival`** — `art/cutscenes/guild_room/cs_guild_thurible_first_arrival_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: guild common-room of the House of Thurible; first-arrival POV; swinging thurible chains + reliquary altar; gold + crimson
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.39 `cs_guild_tide_first_arrival`** — `art/cutscenes/guild_room/cs_guild_tide_first_arrival_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: guild common-room of the House of Tide; first-arrival POV; rippling pool floor + sea-glass colonnade; cool-blue + sea-green
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.40 `cs_guild_tower_first_arrival`** — `art/cutscenes/guild_room/cs_guild_tower_first_arrival_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: guild common-room of the House of Tower; first-arrival POV; spire-window + observation telescope; brass + warm gold
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.41 `cs_guild_vine_first_arrival`** — `art/cutscenes/guild_room/cs_guild_vine_first_arrival_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: guild common-room of the House of Vine; first-arrival POV; living-vine vault + lantern fruit; verdant + amber
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

### B.mechronis_audit

**B.42 `cs_audit_day14_heretic`** — `art/cutscenes/mechronis_audit/cs_audit_day14_heretic_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: mechronis audit chamber; day-14 verdict pillar lit on the Heretic dial; apprentice in the dock; cold blue judgement light
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.43 `cs_audit_day14_scholar`** — `art/cutscenes/mechronis_audit/cs_audit_day14_scholar_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: mechronis audit chamber; day-14 verdict pillar lit on the Scholar dial; ledger-clerks reviewing exhibits; warm brass + parchment
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.44 `cs_audit_day21_martyr`** — `art/cutscenes/mechronis_audit/cs_audit_day21_martyr_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: mechronis audit chamber; day-21 verdict pillar lit on the Martyr dial; apprentice in red robes; mood: solemn
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.45 `cs_audit_day28_verdict_mercy`** — `art/cutscenes/mechronis_audit/cs_audit_day28_verdict_mercy_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: mechronis audit chamber; day-28 verdict crystal glowing white; jurors rising; mood: relief
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.46 `cs_audit_day28_verdict_purge`** — `art/cutscenes/mechronis_audit/cs_audit_day28_verdict_purge_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: mechronis audit chamber; day-28 verdict crystal glowing crimson; jurors stone-faced; mood: dread
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

### B.memory_card

**B.47 `cs_memory_card_corrupt`** — `art/cutscenes/memory_card/cs_memory_card_corrupt_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: memory_card_library; a card on the anvil glitching with dream-leak red tendrils; gold-cracked surface; mood: dread
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.48 `cs_memory_card_inherit`** — `art/cutscenes/memory_card/cs_memory_card_inherit_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: memory_card_library; a card sliding from one apprentice's locker into another's; lineage glyphs glowing; mood: continuity
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.49 `cs_memory_card_release`** — `art/cutscenes/memory_card/cs_memory_card_release_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: memory_card_library; a card lifting upward into the archive flue; warm gold dust trail; mood: bittersweet
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

### B.mission

**B.50 `cs_mission_ambush`** — `art/cutscenes/mission/cs_mission_ambush_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: mission-briefing war room; tactical map flashing red intrusion markers; CADES squadmates turning toward the doorway; mood: urgent
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.51 `cs_mission_deploy`** — `art/cutscenes/mission/cs_mission_deploy_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: mission-briefing war room; squad mustering at the deployment hatch; helmet locking onto player's POV; mood: charged
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.52 `cs_mission_discovery`** — `art/cutscenes/mission/cs_mission_discovery_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: mission-briefing war room; new map sector unfolding holographically above the table; bronze + cyan; mood: anticipation
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.53 `cs_mission_return_failure`** — `art/cutscenes/mission/cs_mission_return_failure_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: mission-briefing war room; squad returning with empty crates; tactical map dimmed; mood: defeated
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.54 `cs_mission_tier2_briefing`** — `art/cutscenes/mission/cs_mission_tier2_briefing_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: mission-briefing war room; tier-2 mission card on the table; brass mission-stripe across the holo; mood: standard ops
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.55 `cs_mission_tier3_briefing`** — `art/cutscenes/mission/cs_mission_tier3_briefing_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: mission-briefing war room; tier-3 mission card on the table with red caution stripe; squad leaning in; mood: high-stakes
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

### B.wardens_dock

**B.56 `cs_warden_comply`** — `art/cutscenes/wardens_dock/cs_warden_comply_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: warden's dock customs hall; player presenting documents; warden's hand reaching to accept; mood: defeated compliance
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.57 `cs_warden_escape`** — `art/cutscenes/wardens_dock/cs_warden_escape_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: warden's dock customs hall; player POV looking back over shoulder at shouting wardens as they bolt for a side passage; mood: panicked flight
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

**B.58 `cs_warden_resist`** — `art/cutscenes/wardens_dock/cs_warden_resist_start.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720
1. SUBJECT + ACTION: warden's dock customs hall; player POV with raised hand pushing aside the warden's notice; tension lighting red
2. CAMERA + LENS: first-person POV; 28-35mm; eye-height per host_space.
3. ENVIRONMENT + LIGHTING: per the canonical room aesthetic in _PRODUCTION_FINAL.md; honour
   palette + props + reverb; preserve aesthetic_tier.
4. STYLE: void-energy compliant; FPV trait-lock applies.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; no third-person body; no reflections of player.
```

---

## §C — Deferred vehicles (7 spaces; PART V of _PRODUCTION_FINAL.md)

Each vehicle needs a baseline interior still + the §4 architect-layer fly-through
(per _PRODUCTION_FINAL.md §V.1–§V.7 source content). Baseline still goes to
`art/rooms/<zipDir>/baseline.png`; fly-through video to
`videos/vehicles/<zipDir>/walkthrough.mp4` (referenced from a sidecar manifest at
wire-in time).

### C.1 `veh.cades_apc` — CADES APC

- **zipDir**: `cades_apc`
- **CDN baseline**: `cdn/client-public/art/rooms/cades_apc/baseline.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1920x1080
1. SUBJECT + ACTION: armoured personnel carrier; 7.2m × 3.0m × 2.4m interior; rear access ramp + central squad bay (6 seats) + cockpit; gunmetal-grey + bronze + tactical-amber; aesthetic_tier: solar_punk_cathedral_military_hybrid; per _PRODUCTION_FINAL.md §V.1
2. CAMERA + LENS: first-person POV from the player's eyes; centre of squad bay floor;
   28-35mm; eye-height 1.65m.
3. ENVIRONMENT + LIGHTING: as canonicalised in _PRODUCTION_FINAL.md PART V.
4. STYLE: per aesthetic_tier; preserve palette tokens; void-energy compliant.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; canonical seed range 170000-179999 (vehicles).
```

### C.2 `veh.captains_shuttle` — Captain's Shuttle

- **zipDir**: `captains_shuttle`
- **CDN baseline**: `cdn/client-public/art/rooms/captains_shuttle/baseline.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1920x1080
1. SUBJECT + ACTION: personal command shuttle; 6.0m × 2.8m × 2.4m interior; pilot cockpit + officer alcove + small briefing nook; brass-and-velvet officer trim; warm amber HUD; aesthetic_tier: solar_punk_cathedral; per _PRODUCTION_FINAL.md §V.2
2. CAMERA + LENS: first-person POV from the player's eyes; centre of squad bay floor;
   28-35mm; eye-height 1.65m.
3. ENVIRONMENT + LIGHTING: as canonicalised in _PRODUCTION_FINAL.md PART V.
4. STYLE: per aesthetic_tier; preserve palette tokens; void-energy compliant.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; canonical seed range 170000-179999 (vehicles).
```

### C.3 `veh.cargo_vessel` — Cargo Vessel

- **zipDir**: `cargo_vessel`
- **CDN baseline**: `cdn/client-public/art/rooms/cargo_vessel/baseline.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1920x1080
1. SUBJECT + ACTION: long-haul cargo vessel; 14.0m × 5.0m × 3.0m interior; main hold with crate-stacks + lift gantry + crew galley alcove; industrial steel + amber sodium-lamp; aesthetic_tier: survival_grit; per _PRODUCTION_FINAL.md §V.3
2. CAMERA + LENS: first-person POV from the player's eyes; centre of squad bay floor;
   28-35mm; eye-height 1.65m.
3. ENVIRONMENT + LIGHTING: as canonicalised in _PRODUCTION_FINAL.md PART V.
4. STYLE: per aesthetic_tier; preserve palette tokens; void-energy compliant.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; canonical seed range 170000-179999 (vehicles).
```

### C.4 `veh.combat_dropship` — Combat Dropship

- **zipDir**: `combat_dropship`
- **CDN baseline**: `cdn/client-public/art/rooms/combat_dropship/baseline.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1920x1080
1. SUBJECT + ACTION: atmospheric combat dropship; 8.0m × 3.5m × 2.6m interior; harness-row for 8 troopers + rear deployment ramp + pilot bay; reinforced-ceramic plate + crimson-faction stripe; aesthetic_tier: survival_grit; per _PRODUCTION_FINAL.md §V.4
2. CAMERA + LENS: first-person POV from the player's eyes; centre of squad bay floor;
   28-35mm; eye-height 1.65m.
3. ENVIRONMENT + LIGHTING: as canonicalised in _PRODUCTION_FINAL.md PART V.
4. STYLE: per aesthetic_tier; preserve palette tokens; void-energy compliant.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; canonical seed range 170000-179999 (vehicles).
```

### C.5 `veh.pet_transport` — Pet Transport

- **zipDir**: `pet_transport`
- **CDN baseline**: `cdn/client-public/art/rooms/pet_transport/baseline.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1920x1080
1. SUBJECT + ACTION: ark-pet logistics carrier; 5.0m × 2.4m × 2.2m interior; padded transit cells + caretaker station + telemetry rack; warm bronze + pet-soft-blue; aesthetic_tier: solar_punk_cathedral; per _PRODUCTION_FINAL.md §V.5
2. CAMERA + LENS: first-person POV from the player's eyes; centre of squad bay floor;
   28-35mm; eye-height 1.65m.
3. ENVIRONMENT + LIGHTING: as canonicalised in _PRODUCTION_FINAL.md PART V.
4. STYLE: per aesthetic_tier; preserve palette tokens; void-energy compliant.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; canonical seed range 170000-179999 (vehicles).
```

### C.6 `veh.eidolon_vessel` — Eidolon Vessel

- **zipDir**: `eidolon_vessel`
- **CDN baseline**: `cdn/client-public/art/rooms/eidolon_vessel/baseline.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1920x1080
1. SUBJECT + ACTION: spirit-bearing ceremonial vessel; 9.0m × 3.5m × 3.0m interior; central reliquary nave + lateral viewing pews + transept altar; pale-marble + brass-and-stained-glass; aesthetic_tier: hierarchy_ritual; per _PRODUCTION_FINAL.md §V.6
2. CAMERA + LENS: first-person POV from the player's eyes; centre of squad bay floor;
   28-35mm; eye-height 1.65m.
3. ENVIRONMENT + LIGHTING: as canonicalised in _PRODUCTION_FINAL.md PART V.
4. STYLE: per aesthetic_tier; preserve palette tokens; void-energy compliant.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; canonical seed range 170000-179999 (vehicles).
```

### C.7 `veh.memorial_hearse` — Memorial Hearse

- **zipDir**: `memorial_hearse`
- **CDN baseline**: `cdn/client-public/art/rooms/memorial_hearse/baseline.png`

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1920x1080
1. SUBJECT + ACTION: memorial transit hearse; 6.5m × 2.6m × 2.4m interior; central catafalque + side mourners' bench + clergy alcove; ebony + bronze + candle-amber; aesthetic_tier: hierarchy_ritual; per _PRODUCTION_FINAL.md §V.7
2. CAMERA + LENS: first-person POV from the player's eyes; centre of squad bay floor;
   28-35mm; eye-height 1.65m.
3. ENVIRONMENT + LIGHTING: as canonicalised in _PRODUCTION_FINAL.md PART V.
4. STYLE: per aesthetic_tier; preserve palette tokens; void-energy compliant.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; canonical seed range 170000-179999 (vehicles).
```

---

## §D — Deferred destinations (60 zones; PART VI of _PRODUCTION_FINAL.md)

60 destination zones across 5 categories (§E.1 Trade Empire planets × 10, §E.2 PvP
Crucible arenas × 15, §E.3 Tower Defense raid maps × 10, §E.4 Castle of Death
chambers × 20, §E.5 Quiz Show set pieces × 5). Each zone has a canonical §4 spec
in `_PRODUCTION_DESTINATIONS.md`; the missing art deliverable is a baseline
first-person still per zone.

Rather than 60 inline prompts (the source spec already authors them at full
architect precision in PART VI), use the canonical generator pattern below for
each zone:

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1920x1080
1. SUBJECT + ACTION: <zone-spec from _PRODUCTION_FINAL.md §E.x.x §header + §floor + §lighting>
2. CAMERA + LENS: FPV at primary entry threshold; 28-35mm; eye-height 1.65m unless
   xenomorph host (then per avatar-rig eye-bone).
3. ENVIRONMENT + LIGHTING: per the §E.x.x §atmosphere + §lighting + §sound layers.
4. STYLE: aesthetic_tier as declared in the §header; palette tokens from _PRODUCTION_FINAL.md.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2; canonical seed range 180000-189999 (destinations).
```

Canonical zone list (60):

- §E.1 Trade Empire planets (10): see `apps/shared/tradeEmpireArtPrompts.ts` hero sectors
- §E.2 Crucible / PvP Tier-5 arenas (15): see `apps/shared/tier5Pvp.ts` (7 leagues × variants)
- §E.3 Tower Defense raid maps (10): see `apps/shared/towerDefense.ts` per-class base templates
- §E.4 Castle of Death chambers (20): see _PRODUCTION_FINAL.md §3.12.2
- §E.5 Quiz Show Palimpsest set pieces (5): see _PRODUCTION_FINAL.md §3.12.3

Wire-in: after CDN delivery, append each zone to `roomArtManifest.data.ts` with
`category: "destination"` and re-run `python3 apps/scripts/_phase_h/gen_room_data.py`.

---

## §E — Producer-NEW (5 rooms; spec retrofit only — art already delivered)

These rooms were producer-delivered in earlier passes and are live on CDN, but
they were NOT in the original `_PRODUCTION_FINAL.md` spec. They surface in the
`roomArtCoverageReport().producerNewNotInSpec` list. No art action needed; the
deliverable is a spec retrofit in _PRODUCTION_FINAL.md PART III to document each.

### E.1 `ark.auction_house` — Auction House

- **Art status**: ✅ live on CDN
- **Doc deliverable**: write a full §4 architect spec for this room in _PRODUCTION_FINAL.md PART III.
- **Hint**: producer-delivered NEW; spec retrofit needed in _PRODUCTION_FINAL.md PART III. Aesthetic likely solar_punk_cathedral + commerce-warm; bronze + brass + lot-board cyan.

### E.2 `ark.dreamers_sanctum` — Dreamers' Sanctum

- **Art status**: ✅ live on CDN
- **Doc deliverable**: write a full §4 architect spec for this room in _PRODUCTION_FINAL.md PART III.
- **Hint**: producer-delivered NEW; spec retrofit needed. Aesthetic dreamers_oneiric; deep indigo + opal + drift-mist; oneiric pool centerpiece.

### E.3 `ark.game_masters_sanctum` — Game Master's Sanctum

- **Art status**: ✅ live on CDN
- **Doc deliverable**: write a full §4 architect spec for this room in _PRODUCTION_FINAL.md PART III.
- **Hint**: producer-delivered NEW; spec retrofit needed. Aesthetic architect_geometric + master-throne; black-marble + brass + master-glow.

### E.4 `ark.meditation_garden` — Meditation Garden

- **Art status**: ✅ live on CDN
- **Doc deliverable**: write a full §4 architect spec for this room in _PRODUCTION_FINAL.md PART III.
- **Hint**: producer-delivered NEW; spec retrofit needed. Aesthetic solar_punk_cathedral + bio-organic; living wall + koi pond + warm sunlight.

### E.5 `ark.order_tribunal` — Order Tribunal

- **Art status**: ✅ live on CDN
- **Doc deliverable**: write a full §4 architect spec for this room in _PRODUCTION_FINAL.md PART III.
- **Hint**: producer-delivered NEW; spec retrofit needed. Aesthetic hierarchy_ritual; austere stone + brass dais + crimson banners.

---

## §F — Apprentice / pedagogy extras (≤8 spaces; PART VIII)

The `roomArtCoverageReport()` reports `deferredCount = 75` after the H2.A pass.
Breakdown: `7 vehicles + 60 destinations + 8 apprentice/etc`. The H2.A pass closed
the full archetype-berth set (12), recruit-berth set (5), guild-common-room set (12),
atrium sub-zones, pedagogy sub-rooms, doctrine_binding_chamber, memory_card_library,
and a handful of supporting spaces. The remaining 8 are non-canonical, sub-zone, or
supporting-template spaces that need a spec audit before art authoring.

**Action**: audit `_PRODUCTION_FINAL.md` PART VIII §AC.5 / §AC.6 / §AC.8 against
`ROOM_ART_ZIP_DIRS` (current 142 zipDirs) and list the ≤8 specific spaces still
needing baselines. Once known, each gets the NB2 prompt template from §C above with
category `apprentice_room` or `ark_room_sub`.

---

## Seed namespace + delivery checklist

Per _PRODUCTION_FINAL.md §0.5 deterministic seed namespace, reserve:

- **170000–179999**: vehicle baselines (§C above, 7 entries)
- **180000–189999**: destination baselines (§D above, 60 entries)
- **190000–199999**: orphan-poster Veo clips + cutscene keyframes (§A + §B above)

**Delivery format** (for every render):

```
Output:        single .webp (NB2) or .mp4 (Veo) at the canonical CDN path
Filename:      matches the manifest entry (`baseline.png` for rooms,
               `<cutscene_id>.mp4` / `<cutscene_id>_start.png` for cutscenes)
Folder:        cdn/client-public/art/rooms/<zipDir>/ or
               cdn/client-public/art/cutscenes/<category>/
Upload tool:   ./apps/scripts/upload_room_art.sh --zip <bundle> (for rooms)
               ./apps/scripts/upload_cutscenes.sh --zip <bundle> (for cutscenes)
Verify:        pnpm tsx scripts/_check-art-coverage.mjs (must report ok=N miss=0)
```

Once a category is delivered, re-run the appropriate manifest generator and the
parity gate `art.room_asset_coverage` (or `art.expansion_cutscene_coverage` for
cutscenes) shrinks toward the target.

