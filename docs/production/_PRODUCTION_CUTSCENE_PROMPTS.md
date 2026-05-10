# Loredex OS — Per-Chapter Cutscene Prompts (Nano Banana 2 + Veo 3.1)

Companion document to `_PRODUCTION_CROSS_CUT.md`. Per cutscene_id, this
file carries the **Nano Banana 2 still-frame prompts** (start + end) and
the **Veo 3.1 video clip prompt** that the production pipeline consumes.

The §3.1 spine (host_space, camera_spawn, head_motion, sfx_track,
vo_line, music_eligibility, trigger_condition, recurrence) lives in
`_PRODUCTION_CROSS_CUT.md`. This file does not duplicate it — the
`cutscene_id` is the join key.

Every cutscene block here carries:
1. A reference back to its `_PRODUCTION_CROSS_CUT.md` §F.1.x entry.
2. Nano Banana 2 prompt for the start frame.
3. Nano Banana 2 prompt for the end frame.
4. Veo 3.1 prompt for the 8s clip (or two stitched 8s clips for 12s
   targets), including the audio block.
5. Reference-asset CDN paths (preflight base64 to Vertex).
6. VO manifest cross-reference (when a manifest entry exists, Veo
   native dialogue is informational; the canonical lip-locked VO is
   overlaid in audio post).
7. Pipeline metadata: seeds, CDN target, parity flags.

---

## §G.0 Framework

### §G.0.1 Adopted models (research-locked, agent `a239a69c6ef1803b3`)

```
NB2_MODEL: gemini-3-pro-image-preview
NB2_FALLBACK: gemini-3.1-flash-image-preview
NB2_INPUT_TOKEN_CAP: 131072
NB2_ASPECT_CINEMATIC: "21:9"
NB2_ASPECT_VERTICAL: "9:16"   # only used for HUD-styled in-world screens, never wholesale
NB2_RESOLUTION: "4K"
NB2_REF_IMAGE_CAP: 6   # ≤5 distinct characters / ≤14 distinct objects per ref bundle

VEO_MODEL: veo-3.1-generate-001
VEO_FAST: veo-3.1-fast-generate-001
VEO_DURATION_DEFAULT: 8   # seconds; 4/6/8 supported; subject-refs force 8
VEO_ASPECT: "16:9"
VEO_RESOLUTION: "1080p"
VEO_REF_IMAGE_CAP: 4   # subject refs only; no style refs in 3.1
VEO_STITCH_PATTERN: "two 8s clips, last_frame of clip-1 = first_frame of clip-2"
```

### §G.0.2 Canonical FPV lock phrasing (trait-locked across all 320 cutscenes)

`FPV_LOCK_PHRASE_NB2`:
> first-person POV from the player's eyes; only the player's gloved
> hands enter lower frame from below; no third-person body; no
> mirrors or reflections of the player; do not show the player's
> face or body; consistent eye-height per host_space (small 1.20 m,
> medium 1.65 m, tall 1.95 m, xenomorph at avatar-rig eye-bone)

`FPV_LOCK_PHRASE_VEO`:
> POV shot from the protagonist's eyes; first-person; the camera is
> the character's head; only hands and forearms enter frame from
> below; the camera never cuts to third-person; no mirrors or
> reflective surfaces show the player

`VEO_NEGATIVE_PROMPT` (passed to the `negativePrompt` API param):
> third-person view; character's full body visible; mouth out of
> sync; motion smear; extra fingers; mirror or reflection of the
> player; on-screen text other than diegetic signage already present
> in the location; modern logos; watermark

`NB2_CONSTRAINTS_BASE`:
> no extra fingers; no watermark; no on-screen UI; no studio logo;
> no modern brand insignia; text rendering only for diegetic signage
> already specified in the prompt and never longer than 25 characters

### §G.0.3 Canonical prompt template (applies to every cutscene below)

```yaml
cutscene_id: cs_<id>
xref: _PRODUCTION_CROSS_CUT.md §F.1.<x>
host_space: §<ref-from-_PRODUCTION_ARK_ROOMS / DESTINATIONS / VEHICLES / etc>

nb2_start:
  model: <NB2_MODEL>
  aspect_ratio: <NB2_ASPECT_CINEMATIC>
  resolution: <NB2_RESOLUTION>
  reference_images:
    - <CDN char ref or location ref URL>
    - …
  prompt: |
    SUBJECT: <name>, <trait-locked descriptors verbatim>, <wardrobe>.
    COMPOSITION: <shot type>, <camera height>, <focal length>, <DOF>.
    LIGHTING/CAMERA: <time of day>, <K of key>, <K of fill>, <rim>,
      <lens type>, <fog/volumetrics z+>.
    STYLE: <art direction>, <film stock>, <palette ref to host_space §X>.
    CONSTRAINTS: <NB2_CONSTRAINTS_BASE>; <FPV_LOCK_PHRASE_NB2>.
    Output 4K, 21:9.

nb2_end:
  <same schema, end-frame composition; same reference_images>

veo:
  model: <VEO_MODEL>
  duration_seconds: 8
  aspect_ratio: <VEO_ASPECT>
  resolution: <VEO_RESOLUTION>
  first_frame: <nb2_start CDN target>
  last_frame: <nb2_end CDN target>
  reference_images: [<char_ref>, <location_ref>]
  negative_prompt: <VEO_NEGATIVE_PROMPT>
  prompt: |
    CINEMATOGRAPHY: <shot type>, <camera move + slow/smooth/whip>,
      <focal length>, <FPV_LOCK_PHRASE_VEO>.
    SUBJECT: <name + trait-locked descriptors>.
    ACTION: <single primary verb-phrase>; <secondary beat>.
    CONTEXT: <location, time, weather>.
    STYLE & AMBIANCE: <film stock>, <palette>, <mood>.
    AUDIO:
      Dialogue: <name> says, "<≤8 words>." (lip-sync to dialogue)
      SFX: <one foreground sfx>.
      Ambient noise: <one bed inherited from host_space>.
      Score: <one cue or "none">.
    [00:00–00:03] <beat A — opens on first_frame>.
    [00:03–00:06] <beat B>.
    [00:06–00:08] <beat C — lands on last_frame>.

pipeline:
  nb2_seed: <fixed integer>
  veo_seed: <fixed integer>
  vo_manifest_ref: <apps/shared/<character>VoManifest.json#L<line> | null>
  cdn_target: cdn/client-public/cutscenes/<cutscene_id>/
  notes: <any per-cutscene caveat — long-form 12s = stitched, fallback model, etc>
```

### §G.0.4 Reference-asset CDN convention

Every cutscene declares its NB2 still and Veo clip CDN target under
`cdn/client-public/cutscenes/<cutscene_id>/`:

```
cdn/client-public/cutscenes/<cutscene_id>/
├── start.png           # NB2 21:9 4K still
├── end.png             # NB2 21:9 4K still
├── clip.mp4            # Veo 3.1 8s 1080p; or clip_a.mp4 + clip_b.mp4 if stitched
├── audio_post.wav      # ffmpeg-mixed final audio (manifest VO + Veo SFX/ambient/score)
└── meta.json           # seeds, model ids, prompt hashes, parity flags
```

Reference assets passed into prompts pre-fetch from the
`dgrsart` S3 (`cdn/client-public/`) and are passed as base64 to
Vertex (Vertex does not fetch arbitrary URLs at inference time).

### §G.0.5 VO manifest contract

Cat-A cutscenes are FPV with ≤1 short VO sentence per §3.1. When
that VO is delivered by a named character, the canonical
lip-locked audio lives in `apps/shared/<character>VoManifest.json`
(`vo:run-all` pipeline). The `vo_manifest_ref` field below points
to the manifest line. Veo's native Dialogue clause is then
**informational only** — audio post mutes Veo's generated dialogue
and overlays the manifest cut, lip-synced to the mouth motion Veo
generated against the prompt's quoted line.

When `vo_manifest_ref: null`, either the cutscene has no VO, or the
VO is environmental / non-named (e.g. PA broadcast, background
crowd). For environmental VO, Veo's native generation is the
canonical track.

### §G.0.6 Camera-spawn parity

Every NB2 / Veo prompt must honour the `camera_spawn` (x, y, z, yaw,
pitch) declared in the cross-cut spine. Translating that to prompt
language:

| spec field | NB2 phrasing | Veo phrasing |
|---|---|---|
| z = +1.20 m (small) | `camera at hip-to-shoulder height, eye-line +1.20 m above floor` | `low first-person eyeline, hip-to-shoulder height` |
| z = +1.65 m (medium) | `camera at standing eye-level, +1.65 m` | `standing first-person eyeline` |
| z = +1.95 m (tall) | `camera at tall eye-level, +1.95 m` | `tall first-person eyeline` |
| z = avatar-rig (xenomorph) | `camera at avatar-rig eye-bone, parametric` | `parametric eyeline locked to avatar rig` |
| yaw / pitch | translate to compass direction + tilt clause | translate to camera-direction clause |

### §G.0.7 Style anchors per host_space

Each host_space has fixed lighting / palette / film-stock anchors,
inherited verbatim from `_PRODUCTION_ARK_ROOMS.md` (§A.x),
`_PRODUCTION_HELLBOXES.md` (§3.12.x), `_PRODUCTION_VEHICLES.md`
(§V.x), and `_PRODUCTION_DESTINATIONS.md` (§E.x). Trait-lock
strings (use verbatim per host_space):

- **Cryo Bay (§A.1)**: cold-stark; 4800K key + 6500K rim; faint
  cyan emergency LEDs; volumetric cryo-fog z+0–1.2; Kodak Vision3
  500T look; 1.5:1 aspect-natural; palette `#1f3a4d / #d6e1ea / #ffd166`.
- **Med Bay (§A.2)**: clinical-cold; 5400K overhead fluoro grid;
  warm 3200K bedside lamps; pale-jade walls; Kodak Vision3 250D;
  palette `#dcedea / #6b8e9f / #f0c14b`.
- **Hellbox transit interior (§3.12)**: void-black with sigil
  illumination; 1800K candlelight equivalents on transit-glyphs;
  Sirius-blue volumetrics; ARRI Alexa look; palette
  `#080612 / #ffd166 / #5fa8ff`.
- **Castle of Death — Grand Hall (§E.4.1)**: 1800K candlelight;
  6.4 s reverb; black-marble + gold-blood-channel; Kodak Vision3
  500T pushed +1; palette `#0d0a08 / #c9a14a / #5a1a1f`.
- **Pet Arena (§A.29 host) / Collectors Arena (§E.x destination)**:
  6500K stadium daylight equivalents through clerestory; warm
  amber 3200K floor-spots on combatants; chalk-dust volumetrics
  z+0–0.6; Kodak Vision3 200T; palette
  `#c8a96a / #2a2622 / #c4452a`.
- **Chess Hall (§A.36)**: cathedral-dim; 2700K library-lamp pools;
  cold 5600K shaft from ceiling oculus; Vision3 500T; palette
  `#1c1816 / #c8a05a / #6e2030`.
- **Boss arenas (per-boss host_space)**: per-boss palette
  documented in §G.3.x.
- **Trade Empire sectors (§E.6.x)**: per-sector palette in §G.5.x.
- **Tower Defense maps (§E.x.TD)**: per-map palette in §G.6.x.
- **Vortex Incursion (§E.7)**: vortex-violet with electric-magenta
  rim; 1800K candle equivalents on sentinels; Kodak Vision3 500T
  pushed +2 stops; palette `#1a0a2e / #ff2a8a / #5fa8ff`.
- **Generic Incursion rooms (§E.8)**: per-room palette in §G.8.x.
- **Casino floor (§3.12 HB7 destination)**: 2200K neon over crimson
  velvet; cocktail-haze volumetrics; Vision3 500T; palette
  `#3a0d10 / #ffb84a / #5fa8ff`.
- **Quiz Show studio (§E.5)**: TV-studio key-grid 5600K +
  saturation-pushed bg-cyc; 16:9 broadcast safe; Kodak Vision3 250D;
  palette `#ff2a8a / #5fa8ff / #ffd166`.
- **Celebration School (§E.x via HB1)**: golden-hour soft 4500K;
  primary-colour signage; Vision3 250D; palette
  `#f4d35e / #6cc24a / #5fa8ff`.
- **Mechronis Academy (§E.x via HB12)**: blue-cold 6500K fluoro;
  surveillance-grey walls; Vision3 250D underexposed -0.5;
  palette `#3a4a5a / #c4d4e4 / #ff4a4a`.

### §G.0.8 Universal failure-mode mitigations

For every cutscene below, the following mitigations are in force
(quoted research from `a239a69c6ef1803b3`):

- **Hands**: NB2 always specifies hand position explicitly when
  hands enter frame. Veo always specifies "hands and forearms" not
  "hands."
- **Text rendering**: any diegetic text in frame is ≤25 chars, in
  quotes inside the prompt, ≤3 elements per still. For longer
  signage use the two-step method (render text first, then composite).
- **Character drift**: ≤5 distinct named characters per ref bundle;
  reuse identical descriptive tokens verbatim across all cutscenes
  featuring the same character (trait-locking).
- **Motion smear**: camera moves are tagged `slow / smooth / whip`,
  not m/s.
- **Mouth-flap desync**: Dialogue lines are ≤8 words per 8 s, marked
  `(lip-sync to dialogue)`. Where a `vo_manifest_ref` exists, Veo
  dialogue is muted in post.
- **Audio collision**: each clip declares one foreground SFX, one
  ambient bed, one optional score cue (per §3.1 Cat A: usually
  music_eligibility = none, so Score: none).
- **12 s cutscenes**: stitched as two 8 s Veo clips with
  `last_frame_of_clip_a == first_frame_of_clip_b`, plus identical
  reference_images and seeds.

---

## §G.1 Pet Arena / Collectors Arena fighter cutscenes (12)

Source: `apps/shared/petArenaOpponents.ts:38–116`.

Each fighter gets one **first-encounter** cutscene fired the first
time the matchmaker pairs the player against that opponent. Length
8 s, FPV from the handler-side balcony. Cat A. SFX-driven, no
music, ≤1 short VO sentence (the announcer; environmental — VO
manifest n/a).

Host_space: Pet Arena (§A.29) for Bronze/Silver tiers; Collectors
Arena (§E.6 destination) for Gold tier.

### §G.1.1 `cs_pet_arena_first_shadow_whelp` (Bronze)

- xref: NEW (§F.1.A.4 to be added in audit)
- host_space: §A.29 Pet Arena (handler balcony, north-side rail)

```yaml
nb2_start:
  model: gemini-3-pro-image-preview
  aspect_ratio: "21:9"
  resolution: "4K"
  reference_images:
    - cdn/client-public/art/refs/pet_arena_bowl_north_balcony.png
    - cdn/client-public/art/refs/void_crawler_evolution_stage1.png
  prompt: |
    SUBJECT: a Shadow Whelp — a half-formed void_crawler hatchling,
      1.2 m long, glossy obsidian carapace with bioluminescent
      teal striations along the dorsal ridge, three uneven eye-clusters,
      tail still curled like a question mark; standing alone in the
      arena bowl floor, posture defensive, snout tilted up toward
      the player's balcony.
    COMPOSITION: medium-wide shot from balcony rail, 35mm, eye-level
      +1.65 m, shallow DOF on whelp with rail in soft foreground bokeh.
    LIGHTING/CAMERA: clerestory daylight 6500K key from above-right;
      amber 3200K floor-spots rim-lighting the whelp from below;
      chalk-dust volumetrics z+0–0.6 m drifting across the bowl;
      anamorphic lens flare on key; Kodak Vision3 200T look.
    STYLE: cinematic stadium fight-night still; warm dust-bowl palette
      `#c8a96a / #2a2622 / #c4452a`; faint announcer-booth ambient
      glow upper-frame-right; visible chalk-line scuff marks on the
      sand floor.
    CONSTRAINTS: no extra fingers; no watermark; no on-screen UI; no
      studio logo; no modern brand insignia; text rendering only for
      diegetic signage already specified and never longer than 25
      characters; first-person POV from the player's eyes; only the
      player's gloved hands enter lower frame from below resting on
      the balcony rail; no third-person body; no mirrors or
      reflections of the player; do not show the player's face or
      body; consistent eye-height per host_space (medium 1.65 m).
    Output 4K, 21:9.

nb2_end:
  model: gemini-3-pro-image-preview
  aspect_ratio: "21:9"
  resolution: "4K"
  reference_images:
    - cdn/client-public/art/refs/pet_arena_bowl_north_balcony.png
    - cdn/client-public/art/refs/void_crawler_evolution_stage1.png
  prompt: |
    SUBJECT: the same Shadow Whelp — half-formed void_crawler
      hatchling with obsidian carapace and teal striations — now
      crouched into a strike posture, eye-clusters all locked
      forward, dorsal ridge flared, ready bell about to ring.
    COMPOSITION: tighter medium shot, 50mm, eye-level +1.65 m,
      whelp filling 60% of frame; the player's gloved hand grips
      the balcony rail in lower-left foreground.
    LIGHTING/CAMERA: floor-spot intensified amber 3200K; chalk-dust
      volumetric thickened around the whelp; ready-bell warm tungsten
      practical visible upper-frame-right; Kodak Vision3 200T pushed
      +0.5 stop.
    STYLE: cinematic fight-bell freeze; same palette as start;
      anticipation reading on the whelp's body language.
    CONSTRAINTS: same as nb2_start.
    Output 4K, 21:9.

veo:
  model: veo-3.1-generate-001
  duration_seconds: 8
  aspect_ratio: "16:9"
  resolution: "1080p"
  first_frame: cdn/client-public/cutscenes/cs_pet_arena_first_shadow_whelp/start.png
  last_frame: cdn/client-public/cutscenes/cs_pet_arena_first_shadow_whelp/end.png
  reference_images:
    - cdn/client-public/art/refs/pet_arena_bowl_north_balcony.png
    - cdn/client-public/art/refs/void_crawler_evolution_stage1.png
  negative_prompt: "third-person view; character's full body visible;
    mouth out of sync; motion smear; extra fingers; mirror or
    reflection of the player; on-screen text other than diegetic
    signage already present in the location; modern logos; watermark"
  prompt: |
    CINEMATOGRAPHY: medium-wide tightening to medium, slow push-in
      0.6 m over 8 s, 35mm to 50mm, POV shot from the protagonist's
      eyes; first-person; the camera is the character's head; only
      hands and forearms enter frame from below resting on a
      balcony rail; the camera never cuts to third-person.
    SUBJECT: a Shadow Whelp, half-formed void_crawler hatchling,
      obsidian carapace with teal striations, three uneven eye-clusters,
      tail curled like a question mark, alone in the arena bowl.
    ACTION: the whelp lifts its snout, scenting the player's
      direction; at 4 s the announcer's bell pings and the whelp
      drops into strike posture, dorsal ridge flaring; at 7 s a
      single chalk-puff billows from its forefoot.
    CONTEXT: Pet Arena bowl, north-side handler balcony, mid-day
      under clerestory daylight, warm-dust atmosphere.
    STYLE & AMBIANCE: Kodak Vision3 200T; anamorphic flare on key;
      warm dust-bowl palette `#c8a96a / #2a2622 / #c4452a`; muted-
      stadium tension.
    AUDIO:
      Dialogue: PA announcer says, "Bronze Gauntlet, opening bout."
        (lip-sync to dialogue)
      SFX: ready-bell ping at 00:04, single chalk-puff billow at 00:07.
      Ambient noise: arena-bowl crowd murmur, distant ventilation hum.
      Score: none.
    [00:00–00:03] camera holds; whelp scenting upward; chalk dust
      drifting; gloved hands settle on rail.
    [00:03–00:06] announcer line resolves; ready-bell pings; whelp
      drops into strike posture; slow push-in continues.
    [00:06–00:08] dust billow at whelp's forefoot; lands on
      last_frame composition.

pipeline:
  nb2_seed: 142001
  veo_seed: 242001
  vo_manifest_ref: null   # PA announcer is environmental, not in NPC manifest
  cdn_target: cdn/client-public/cutscenes/cs_pet_arena_first_shadow_whelp/
  notes: trait-lock the whelp descriptor verbatim across §G.1.1.
```

### §G.1.2 `cs_pet_arena_first_scrap_hound` (Bronze)

Trait-lock differences from §G.1.1: subject swapped to a Scrap
Hound — a cobbled-together gilt_beetle the size of a mastiff,
chitin plates riveted to scavenged ship-hull steel, two
mismatched optical lenses (one cyan camera-iris, one cracked
amber bulb), tail-stinger replaced with a salvaged welding-rod
that arcs faintly. Posture: planted four-square, low growl.

```yaml
nb2_start.prompt: SUBJECT: a Scrap Hound — gilt_beetle chassis
  cobbled from cargo-bay debris, mastiff-sized, chitin plates
  riveted to scavenged ship-hull steel, two mismatched optical
  lenses (cyan camera-iris left, cracked amber bulb right), tail
  replaced with an arcing salvaged welding-rod, planted four-square
  on the bowl floor, low growl posture, rim-lit amber. (rest of
  block identical to §G.1.1 nb2_start COMPOSITION/LIGHTING/STYLE/
  CONSTRAINTS, replacing whelp references with hound references.)

nb2_end.prompt: same composition tightening as §G.1.1; hound is now
  mid-bark, welding-rod tail mid-arc, sparks at tip. Constraints
  identical.

veo.prompt:
  CINEMATOGRAPHY: identical to §G.1.1.
  SUBJECT: Scrap Hound, gilt_beetle chassis, mastiff-sized, chitin
    plates riveted to ship-hull steel, mismatched optical lenses,
    arcing welding-rod tail.
  ACTION: hound holds posture, optical lenses tracking the player;
    at 4 s the bell pings and the hound barks once (no jaw-flap
    above 8 words); welding-rod tail discharges a single arc at 7 s.
  CONTEXT: identical to §G.1.1.
  STYLE & AMBIANCE: identical to §G.1.1.
  AUDIO:
    Dialogue: PA announcer says, "Scrap Hound, ready." (lip-sync)
    SFX: bell ping 00:04; hound bark 00:05; welding-arc snap 00:07.
    Ambient: arena murmur, distant ventilation, faint metal-on-metal.
    Score: none.
  [00:00–00:03] hound holds; lenses tracking. [00:03–00:06] bell;
  bark; push-in. [00:06–00:08] arc-snap; lands on last_frame.

pipeline:
  nb2_seed: 142002; veo_seed: 242002; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_pet_arena_first_scrap_hound/
```

### §G.1.3 `cs_pet_arena_first_ember_sprite` (Bronze)

Subject: Ember Sprite — flicker_imp, knee-high, near-translucent
ember-orange flame-body bound around a brass skeleton, tail of
sparks, perpetual heat-shimmer halo z+0.3 m. Skirmisher posture,
darting in place.

```yaml
nb2_start.prompt: SUBJECT: an Ember Sprite — knee-high flicker_imp,
  translucent ember-orange flame-body wrapped around a brass-skeleton
  armature, tail of trailing sparks, perpetual heat-shimmer halo
  z+0.3 m around its silhouette, currently darting left-then-right
  in a 1.2 m arc on the bowl floor. (else identical to §G.1.1
  nb2_start.)

nb2_end.prompt: ember-sprite frozen mid-leap, body elongated 0.4 m
  vertical, sparks streaming, heat-halo intensified.

veo.prompt:
  CINEMATOGRAPHY: identical to §G.1.1.
  SUBJECT: Ember Sprite, knee-high flicker_imp, translucent
    ember-orange flame-body, brass-skeleton armature, spark tail,
    heat-shimmer halo z+0.3 m.
  ACTION: sprite darts left-right on the bowl floor; at 4 s bell
    pings and sprite leaps to peak +0.4 m; at 7 s lands and pivots,
    sparks streaming from tail.
  CONTEXT: identical to §G.1.1, but with visible heat-distortion
    refraction across the bowl floor where the sprite has passed.
  STYLE & AMBIANCE: identical to §G.1.1; heat-shimmer slightly
    more aggressive on chalk-dust.
  AUDIO:
    Dialogue: PA announcer says, "Ember Sprite, in." (lip-sync)
    SFX: bell ping 00:04; flame-whoosh on leap 00:04.5; spark-crackle
      00:07.
    Ambient: arena murmur, distant ventilation, faint flame roar.
    Score: none.

pipeline:
  nb2_seed: 142003; veo_seed: 242003; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_pet_arena_first_ember_sprite/
```

### §G.1.4 `cs_pet_arena_first_husk_serpent` (Bronze)

Subject: Husk Serpent — data_serpent, 4 m, decommissioned
training-dummy with frayed insulation skin, exposed copper coil
ribs, eyes are glass-tube indicator lamps (one green, one dark),
a barcoded service-tag stapled to the underjaw. Bruiser posture,
coiled, slow head-sway.

```yaml
nb2_start.prompt: SUBJECT: a Husk Serpent — 4 m decommissioned
  data_serpent, frayed-insulation skin, exposed copper coil ribs,
  glass-tube indicator-lamp eyes (one green, one dark), a barcoded
  service-tag stapled to the underjaw, slow coiled head-sway. (else
  identical to §G.1.1 nb2_start.)

nb2_end.prompt: serpent uncoiling +1 m forward, head raised, both
  indicator lamps now glowing green; service-tag swinging.

veo.prompt:
  CINEMATOGRAPHY: identical to §G.1.1.
  SUBJECT: Husk Serpent, 4 m data_serpent, frayed insulation,
    copper coil ribs, glass-tube indicator-lamp eyes, barcoded
    service-tag at underjaw.
  ACTION: serpent coils, head sways; at 4 s bell pings and dark
    indicator-lamp eye flickers green; at 6 s serpent uncoils +1 m
    forward; at 7 s service-tag swings into chalk-puff.
  CONTEXT: identical to §G.1.1.
  STYLE & AMBIANCE: identical to §G.1.1; copper-coil reflections
    visible.
  AUDIO:
    Dialogue: PA announcer says, "Husk Serpent. Bronze." (lip-sync)
    SFX: bell ping 00:04; indicator-lamp click-on 00:04.5;
      copper-coil rasp 00:06.
    Ambient: arena murmur, distant ventilation, faint electrical hum.
    Score: none.

pipeline:
  nb2_seed: 142004; veo_seed: 242004; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_pet_arena_first_husk_serpent/
```

### §G.1.5 `cs_pet_arena_first_veteran_crawler` (Silver)

Subject: Veteran Crawler — adult void_crawler at evolution stage 2,
2.4 m long, scarred dorsal ridge with three healed bite-wounds, one
eye-cluster milky from old damage, posture weary but unhurried;
faded teal striations almost grey. Bronze-three-time-champion
visible bronze tags woven into the carapace plating.

(Same NB2 / Veo schema as §G.1.1; subject and "scarred / tired"
descriptors trait-locked. Announcer line: "Silver Circle. Returning
champion." `nb2_seed: 142005; veo_seed: 242005`. Host_space remains
§A.29 Pet Arena.)

### §G.1.6 `cs_pet_arena_first_spore_lieutenant` (Silver)

Subject: Spore Lieutenant — spore_fungus, 2 m diameter cap-dome
mushroom-form, command-node fungal lattice, regrowing orange
filament-fronds, releases visible spore-puffs every 1.5 s; tank
archetype, planted dead-centre. Six smaller satellite caps
encircle it in a 3 m ring.

(Same schema. Announcer: "Spore Lieutenant. Hold." Spore-puff SFX
every 1.5 s in audio. `nb2_seed: 142006; veo_seed: 242006`.)

### §G.1.7 `cs_pet_arena_first_quicksilver` (Silver)

Subject: Quicksilver — holographic_fox, 0.9 m at the shoulder,
chrome-and-mercury body that ripples like liquid metal,
afterimages trail every movement (3-frame ghost), eyes are
projector-lens apertures emitting faint cyan beams. Skirmisher;
Lux's secret nemesis.

(Same schema. Announcer: "Quicksilver. Silver Circle." Ref-image
includes `cdn/client-public/art/refs/lux_companion.png` for
narrative tie. `nb2_seed: 142007; veo_seed: 242007`.)

### §G.1.8 `cs_pet_arena_first_warden_of_echoes` (Silver)

Subject: Warden of Echoes — temporal_kitten, 0.4 m, crystalline
fur that shows multiple time-frames simultaneously (head turning
left, head turning right, head still — all overlapping with 0.2 s
phase offset), eyes closed in serene foreknowledge. Glass-cannon
archetype.

(Same schema. Announcer: "Warden. Echoes Circle." SFX: time-phase
chimes layered at 0.2 s offsets. `nb2_seed: 142008; veo_seed: 242008`.)

### §G.1.9 `cs_collectors_arena_first_ascended_maw` (Gold)

**Host_space change:** Collectors Arena (§E.6 destination zone)
— larger bowl, vault-ceiling cathedral with retractable
lattice-skylight, gold-leafed ringside, 12000-seat auditorium.

Subject: Ascended Maw — first void_crawler ever to cross gold tier,
3.8 m, evolution stage 3, dorsal ridge shimmering with
gold-veined obsidian, eye-clusters now seven and arrayed in a
crown, jaw-musculature visible through translucent throat-membrane;
empty handler stand visible behind it (its handler no longer
attends, per lore).

```yaml
nb2_start.prompt: SUBJECT: Ascended Maw — 3.8 m void_crawler at
  evolution stage 3, gold-veined obsidian dorsal ridge, seven
  eye-clusters arrayed in a crown across the brow, translucent
  throat-membrane revealing jaw musculature, alone on the
  Collectors Arena floor; an empty wooden handler-stand visible
  3 m behind it (handler chair vacant, parchment notebook left
  open on stand).
  COMPOSITION: medium-wide from gold-leafed ringside, 35mm,
  eye-level +1.65 m, retractable lattice-skylight visible upper
  frame, shafts of cold daylight 5600K crossing chalk-dust
  volumetrics; the empty handler-stand reads in midground bokeh.
  LIGHTING/CAMERA: shafts of 5600K skylight key from above; warm
  3200K floor-spots rim; chalk-dust volumetrics z+0–0.6 m; ARRI
  Alexa anamorphic look; subtle gold-leaf bounce reflecting in
  Maw's dorsal ridge.
  STYLE: cinematic gold-coliseum still; palette
  `#d8b35a / #2a2622 / #5a1a1f`; gilded ringside; cathedral-scale
  vaulting.
  CONSTRAINTS: standard; FPV trait-lock as §G.0.2.
  Output 4K, 21:9.

nb2_end.prompt: Maw has not moved. The seven eye-clusters now all
  open, brow-crown blazing with internal teal light. The empty
  handler-stand notebook page has flipped over in arena-draft.

veo.prompt:
  CINEMATOGRAPHY: static lockoff first-person, 35mm, FPV trait-lock.
  SUBJECT: Ascended Maw — gold-tier void_crawler, seven eye-clusters
    arrayed as crown, translucent throat-membrane.
  ACTION: Maw stands motionless on the bowl floor; at 3 s its seven
    eye-clusters open in unison; at 6 s the empty handler-stand
    notebook page flips over in arena-draft, no other movement; at
    8 s a single low-frequency growl thrums through the audio bed.
  CONTEXT: Collectors Arena, mid-day, lattice-skylight retracted,
    audience absent (private exhibition).
  STYLE & AMBIANCE: ARRI Alexa anamorphic; gold-coliseum palette;
    cathedral-scale stillness.
  AUDIO:
    Dialogue: PA announcer says, "Gold Coliseum. Solo exhibition."
      (lip-sync to dialogue)
    SFX: notebook-page flip 00:06; low-frequency Maw growl 00:08.
    Ambient: cathedral reverb, distant skylight-mechanism creak,
      faint gold-leaf wind-chime.
    Score: none.

pipeline:
  nb2_seed: 142009; veo_seed: 242009; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_collectors_arena_first_ascended_maw/
```

### §G.1.10 `cs_collectors_arena_first_glyph_prophet` (Gold)

Subject: Glyph Prophet — glyph_moth, 1.4 m wingspan, wings inscribed
with shifting future-glyphs that re-render every 0.8 s, body
slender obsidian, eyes are reflective gold mirrors. Hovers
0.4 m above bowl floor in a slow figure-8.

(Same schema as §G.1.9. Announcer: "Glyph Prophet. Gold." SFX:
glyph-rendering whisper-clicks at 0.8 s intervals. `nb2_seed: 142010;
veo_seed: 242010`.)

### §G.1.11 `cs_collectors_arena_first_mirror_cipher` (Gold)

Subject: Mirror Cipher — Cipher's reflection from a timeline where
the player never met them: same data_serpent silhouette but
inverted palette (white insulation, copper-blue coils, eyes are
both glass-tubes glowing red). Coiled, head raised to player's
balcony eye-line, motionless.

**Narrative significance:** the player's companion Cipher is
referenced; ref-image bundle includes `cdn/client-public/art/refs/cipher_companion.png`
for visual rhyme. `vo_manifest_ref: apps/shared/cipherVoManifest.json#L<TBD>`
if Cipher has a recognition line in their VO manifest; otherwise
null.

(Same NB2/Veo schema. Announcer: "Mirror Cipher. Gold." SFX: low
chord that mirrors the Cipher-leitmotif but inverted in pitch.
`nb2_seed: 142011; veo_seed: 242011`.)

### §G.1.12 `cs_collectors_arena_first_singularity` (Gold)

Subject: Singularity — temporal_kitten that outlasted the
Antiquarian's memory; body is a still-frozen 0.4 m kitten silhouette
filled entirely with star-field (a window into deep space). It
does not move at all in this cutscene. The arena chalk-dust at
its paws does not drift — frozen in mid-air around it in a 0.6 m
radius.

(Same schema. Announcer: "Singularity. Gold. Solo." SFX: silence
inside the 0.6 m radius; arena murmur outside. `nb2_seed: 142012;
veo_seed: 242012`. Notes: "Veo motion-smear mitigation important
— this clip has a frozen 0.6 m radius around subject; reinforce
in negative_prompt: 'no motion inside the frozen radius around the
kitten'.")

---

## §G.2 Chess Hall opponent + tier-promotion cutscenes (8)

Source: `apps/shared/chessClimbTiers.ts:20–107`. The Chess Hall
already has `cs_hellbox_9_open / _close / _first` in
`_PRODUCTION_CROSS_CUT.md` §F.1.A.2 covering arrival. These 8 are
**per-tier-promotion** + **per-named-opponent** punctuations.

Host_space: Chess Hall (§A.36) — cathedral-dim, 2700K library-lamp
pools, cold 5600K shaft from ceiling oculus; Vision3 500T;
palette `#1c1816 / #c8a05a / #6e2030`.

### §G.2.1 `cs_chess_tier_0_first_seat` (Tier 0 — Exhibition)

First-time the player sits at the Tier 0 Exhibition board against
the Game Master. Length 8 s. The Game Master sits across, smiling.

```yaml
nb2_start:
  reference_images:
    - cdn/client-public/art/refs/chess_hall_tier0_table.png
    - cdn/client-public/art/refs/game_master_npc.png
  prompt: |
    SUBJECT: the Game Master, an NPC in pressed grey-suit attire
      with a clipboard and a corrupted half-smile, seated across a
      Tier 0 chessboard, lifting one White pawn between thumb and
      forefinger; the Tier 0 board is plain hardwood, no wagering
      pieces, no ELO marker; a single library-lamp 2700K pools
      light over the centre of the board.
    COMPOSITION: medium close-up over the player's side of the
      board, 50mm, eye-level +1.65 m, shallow DOF on the Game
      Master's hand and the lifted pawn; player's gloved hands
      visible in lower foreground arranging black pieces.
    LIGHTING/CAMERA: 2700K library-lamp pool centred on board;
      cold 5600K shaft from ceiling oculus visible upper-frame as
      backwash; volumetric dust z+1.5–2.5 m; ARRI Alexa look;
      Kodak Vision3 500T.
    STYLE: cathedral-dim chess-club still; palette
      `#1c1816 / #c8a05a / #6e2030`; warm centre, cold periphery.
    CONSTRAINTS: standard; FPV trait-lock; the Game Master's clipboard
      visible in foreground left, page reads "TIER 0 — EXHIBITION".
    Output 4K, 21:9.

nb2_end:
  prompt: |
    SUBJECT: the same Game Master has set the lifted White pawn down
      on e4, his hand still touching it; his smile widens by 5%; the
      clipboard page has flipped one page forward, now reading
      "TIER 1 — WAGERED"; the player's gloved hands have moved a
      Black pawn to e5.
    (rest identical to nb2_start.)

veo:
  prompt: |
    CINEMATOGRAPHY: medium close-up, slow push-in 0.3 m over 8 s,
      50mm, FPV trait-lock; the player's gloved hands stay in
      foreground.
    SUBJECT: the Game Master in grey-suit attire with corrupted
      half-smile, seated across the Tier 0 chessboard.
    ACTION: at 0–3 s the Game Master lifts a White pawn; at 3–5 s he
      sets it on e4 and meets the player's eye-line; at 5–8 s the
      clipboard page flips forward, his smile widens, the player's
      hands move Black pawn to e5.
    CONTEXT: Chess Hall, Tier 0 board, library-lamp pool, ceiling
      oculus high above, hall otherwise empty.
    STYLE & AMBIANCE: cathedral-dim, warm centre cold periphery,
      Kodak Vision3 500T.
    AUDIO:
      Dialogue: Game Master says, "Welcome to the show." (lip-sync)
      SFX: pawn click on e4 00:03.5; clipboard page-flip 00:06;
        Black-pawn click on e5 00:07.
      Ambient: chess-hall ventilation, faint library-lamp
        ballast hum, low cathedral reverb 4.0 s.
      Score: none.

pipeline:
  nb2_seed: 143001; veo_seed: 243001;
  vo_manifest_ref: apps/shared/gameMasterVoManifest.json#L<TBD>;
  cdn_target: cdn/client-public/cutscenes/cs_chess_tier_0_first_seat/
```

### §G.2.2 `cs_chess_tier_0_promotion` (Tier 0 → Tier 1 unlock)

Length 8 s. Player has just won the Tier 0 best-of-3. The Game
Master flips his clipboard to the Tier 1 page and slides a wagering
contract across the board.

(Same schema. Subject + setting as §G.2.1. Action: at 0–3 s Game
Master flips clipboard, reads "Xeth'Raal drafted my contract. You
are drafting yours."; at 3–5 s he slides a folded contract across
the board to the player's side; at 5–8 s the player's gloved hands
unfold the contract — top reads "TIER 1 — WAGERED", below: "lose
and the ladder takes a tier from you." VO from Game Master manifest
if exists. `nb2_seed: 143002; veo_seed: 243002`.)

### §G.2.3 `cs_chess_tier_1_first_seat` (Tier 1 — Wagered)

Length 8 s. First time at the Wagered table. The board is now
inlaid with brass ELO-counters at each side. A single hooded
attendant stands behind the Game Master, motionless.

(Same schema. Subject: Game Master + hooded attendant. Action:
ELO-counters click into starting position; attendant adjusts
posture once. VO: Game Master says, "Stake set. Sit." `nb2_seed: 143003;
veo_seed: 243003`.)

### §G.2.4 `cs_chess_tier_1_promotion` (Tier 1 → Tier 2)

Length 8 s. Player has won Tier 1. The Game Master rises from the
Tier 1 table and gestures to a stairway leading down to the
Hierarchy's Table chamber. Hooded attendants now number three.

(Same schema. Action: Game Master stands; clipboard now reads
"TIER 2 — THE HIERARCHY'S TABLE"; gestures to stairway with brass
hand-rail. VO: Game Master says, "The board is older than the
Empire." `nb2_seed: 143004; veo_seed: 243004`.)

### §G.2.5 `cs_chess_tier_2_first_seat` (Tier 2 — Hierarchy's Table)

**Host_space change:** Chess Hall sub-chamber — Hierarchy's Table.
Bigger room, deeper reverb (6.4 s), 8 hooded demon-NPCs visible
as standing audience around the perimeter.

Length 8 s. The board is brass-inlaid with serpentine glyphs along
the borders. The Goggles sit on the table corner.

```yaml
nb2_start:
  reference_images:
    - cdn/client-public/art/refs/chess_hall_tier2_hierarchy_table.png
    - cdn/client-public/art/refs/the_goggles_artifact.png
    - cdn/client-public/art/refs/game_master_npc.png
  prompt: |
    SUBJECT: a brass-inlaid chessboard with serpentine glyphs along
      the borders, in a deeper sub-chamber of the Chess Hall; the
      Goggles — a brass-and-glass artifact pair — rest on the
      table's left corner; eight hooded demon-NPCs stand silent
      around the perimeter at 3 m radius, faces obscured.
    COMPOSITION: medium close-up over the player's side, 50mm,
      eye-level +1.65 m, shallow DOF on board and Goggles; perimeter
      hooded figures in deep bokeh.
    LIGHTING/CAMERA: 2700K library-lamp pool over board; cold 5600K
      perimeter wash on hoods (just enough to silhouette); long
      6.4 s reverb evident in lighting falloff; ARRI Alexa
      anamorphic.
    STYLE: high-stakes occult chess still; palette
      `#1c1816 / #c8a05a / #6e2030`; ritual undertone.
    CONSTRAINTS: standard; FPV trait-lock; the Goggles are diegetic
      but rendered in soft focus; no Goggles text.
    Output 4K, 21:9.

nb2_end:
  prompt: identical except the Game Master has just sat down across
    the board; one hooded figure has stepped 0.3 m forward, hood
    angle now revealing a single demon-eye glowing dim red; the
    Goggles have not been touched.

veo:
  prompt:
    CINEMATOGRAPHY: medium close-up, static lockoff (no push-in),
      50mm, FPV trait-lock.
    SUBJECT: brass-inlaid chessboard with the Goggles on the left
      corner, eight hooded demon-NPCs at 3 m perimeter, Game Master
      arriving.
    ACTION: at 0–3 s the player's gloved hands rest at the board's
      edge, not yet touching pieces; at 3–5 s the Game Master sits
      across; at 5–8 s one perimeter hood steps 0.3 m forward and a
      single demon-eye lights dim red.
    CONTEXT: Hierarchy's Table sub-chamber, deep reverb, ritual-club
      stillness.
    STYLE & AMBIANCE: ARRI Alexa anamorphic; ritual chess-club
      atmosphere.
    AUDIO:
      Dialogue: Game Master says, "The demons watch." (lip-sync)
      SFX: chair-pull-out 00:03; hood-rustle 00:05.5; faint
        demon-eye ignition click 00:06.
      Ambient: cathedral reverb 6.4 s; library-lamp ballast hum;
        12 Hz sub-bass drone.
      Score: none.

pipeline:
  nb2_seed: 143005; veo_seed: 243005;
  vo_manifest_ref: apps/shared/gameMasterVoManifest.json#L<TBD>;
  cdn_target: cdn/client-public/cutscenes/cs_chess_tier_2_first_seat/
```

### §G.2.6 `cs_chess_tier_2_promotion` (Tier 2 → Tier 3)

Length 8 s. Player wins Tier 2. The Game Master picks up the Goggles
and offers them across the board. The eight hoods part, revealing
a deeper passage.

(Same schema. VO: Game Master says, "The Wager waits." `nb2_seed: 143006;
veo_seed: 243006`. The Goggles handover is the visual centrepiece.)

### §G.2.7 `cs_chess_tier_3_first_seat` (Tier 3 — Labyrinth Wager)

**Host_space change:** Labyrinth chamber — deepest Chess Hall
sub-chamber. Mol'Garath sits at the head of the audience.

Length 12 s (stitched, two 8 s clips). Game Master visibly cheerful;
Mol'Garath in deep shadow at the audience-head, only eyes visible.

```yaml
notes: "12 s stitched; clip_a 0–8 s ends on Game Master setting
  pieces; clip_b 8–12 s opens on Mol'Garath shifting forward."

nb2_start:
  prompt: |
    SUBJECT: the Labyrinth Wager chamber — a single chessboard at
      the centre of a stone amphitheatre; the Game Master sits
      across, visibly cheerful (his corruption now smiles freely);
      at the back of the audience-head, Mol'Garath sits in deep
      shadow on a low throne, only the eyes glowing dim violet at
      eye-level +2.4 m; eight hooded demon-NPCs ring the chamber
      perimeter.
    COMPOSITION: medium-wide, 35mm, eye-level +1.65 m, deep DOF
      so both Game Master and Mol'Garath read.
    LIGHTING/CAMERA: 2700K library-lamp single-source pool over
      board; cold 5600K perimeter wash; deep-violet rim 12000K on
      Mol'Garath silhouette only; volumetric dust z+1.5–3.0 m;
      ARRI Alexa anamorphic.
    STYLE: ritual final-boss chess still; palette extended
      `#1c1816 / #c8a05a / #6e2030 / #4a1a6a`.
    CONSTRAINTS: standard; FPV trait-lock; Mol'Garath stays in
      shadow — no full reveal in this cutscene.
    Output 4K, 21:9.

nb2_end (clip_a end, clip_b first_frame):
  prompt: same scene; Game Master has set up the opening
    arrangement on the board; Mol'Garath has not moved; the player's
    gloved hands rest at the board's edge.

nb2_end (clip_b end):
  prompt: same scene; Mol'Garath has shifted +0.2 m forward on the
    throne, the violet-rim now slightly stronger; the Game Master
    looks up at the player's eye-line, smile now wide.

veo (clip_a):
  prompt:
    CINEMATOGRAPHY: medium-wide, slow push-in 0.4 m, 35mm, FPV.
    SUBJECT: the Labyrinth Wager chamber; Game Master cheerful;
      Mol'Garath in deep violet-rim shadow at audience head.
    ACTION: 0–3 s player's hands settle at board edge; 3–5 s Game
      Master arranges the opening pieces; 5–8 s perimeter hoods
      shift in unison once.
    CONTEXT: deepest Chess Hall sub-chamber.
    STYLE & AMBIANCE: ritual amphitheatre stillness.
    AUDIO:
      Dialogue: Game Master says, "This is the game I built." (lip-sync)
      SFX: piece-placements 00:03 / 00:04 / 00:04.5; perimeter-hood
        shift 00:06.
      Ambient: cathedral reverb 6.4 s; 8 Hz sub-bass; faint
        violet-rim hum.
      Score: none.

veo (clip_b):
  prompt:
    CINEMATOGRAPHY: continuation, slow push-in resumes 0.2 m, 35mm,
      FPV.
    SUBJECT: Mol'Garath in violet-rim shadow shifting forward,
      Game Master smile widening.
    ACTION: 8–10 s Mol'Garath shifts +0.2 m; 10–12 s Game Master's
      smile widens, perimeter hoods all turn 5° toward the
      audience-head.
    AUDIO:
      Dialogue: none in clip_b.
      SFX: throne-shift creak 00:09; perimeter-hood collective rustle
        00:11.
      Ambient: continued.
      Score: none.

pipeline:
  nb2_seed: 143007; veo_seed: 243007;
  vo_manifest_ref: apps/shared/gameMasterVoManifest.json#L<TBD>;
  cdn_target: cdn/client-public/cutscenes/cs_chess_tier_3_first_seat/
```

### §G.2.8 `cs_chess_tier_3_epilogue` (Tier 3 win — Labyrinth Epilogue)

Length 8 s. Player has won Tier 3. The Game Master stands, no
clipboard. Mol'Garath rises and the violet-rim becomes a full
illumination — but cut to credit-board silhouette before any face
is revealed (the Labyrinth Epilogue cinematic itself takes over,
which is out-of-scope for this cutscene).

(Same schema. VO: Game Master says, "You broke the rules. Welcome."
`nb2_seed: 143008; veo_seed: 243008`. Notes: "ends on a hard cut
to a black frame at 8 s; the Labyrinth Epilogue cinematic — full
length, music-allowed — picks up from there per Tier-3 winRewards
`labyrinth_epilogue_unlock`.")

---

## §G.3 Boss arena hero-cuts (5 NEW)

Source: `apps/client/src/data/bossEncounters.ts:34–150`. The five
already-shipped Cat-A first-encounters in `_PRODUCTION_CROSS_CUT.md`
§F.1.A.5 cover Watcher, Game Master, Warlord Zero, Panopticon
Sentinel, Chrono Wyrm. The 5 missing are Meme, Collector,
Necromancer, Source, Architect.

Per-boss host_space inherits the room each boss is anchored to in
`bossEncounters.ts`. FPV from the player's eye-line at the doorway
threshold of each boss's room. Length 10 s (stitched 8 + 2 final
hold).

### §G.3.1 `cs_boss_first_meme` (Archives)

- xref: NEW (§F.1.A.5 to be added)
- host_space: Archives (§A.x — TBC; bossEncounters.ts roomId="archives")

```yaml
nb2_start:
  reference_images:
    - cdn/client-public/art/refs/archives_room.png
    - cdn/client-public/art/refs/the_meme_boss.png
  prompt: |
    SUBJECT: The Meme — a shape-shifting figure in the Archives,
      currently presenting as a tall thin form in a white oracle
      mask, its body seemingly composed of overlapping translucent
      copies of itself (3 ghost-frames offset 0.15 s); standing
      between two information-stacks.
    COMPOSITION: medium-wide, 35mm, eye-level +1.65 m, shallow DOF
      on the Meme; foreground stacks in soft bokeh.
    LIGHTING/CAMERA: 4500K archive-fluoro overhead grid; cold-cyan
      info-screen wash from stacks; faint TV-corruption flicker
      overlaid on the Meme's silhouette only; ARRI Alexa look;
      Kodak Vision3 250D.
    STYLE: archive-corruption still; palette
      `#dce5ec / #2a3540 / #ff2a8a`; clinical-cold + viral-pink.
    CONSTRAINTS: standard; FPV trait-lock; mask reads no text.
    Output 4K, 21:9.

nb2_end:
  prompt: same scene; the Meme's three ghost-frames have separated
    further (0.4 s offset now); each ghost-frame turns its
    mask-face toward the camera in sequence; the centre frame's
    mask is starting to crack along the right cheek.

veo:
  prompt:
    CINEMATOGRAPHY: medium-wide, static lockoff first 5 s then slow
      push-in 0.3 m last 3 s, 35mm, FPV trait-lock.
    SUBJECT: The Meme — white-oracle-mask figure with 3 ghost-frame
      offsets, archive setting.
    ACTION: 0–3 s the figure stands still, ghost-frames at 0.15 s
      offset; 3–6 s the offset widens to 0.4 s; 6–8 s the centre
      frame's mask starts to crack along the right cheek; the figure
      gestures one hand toward the camera as if reaching.
    CONTEXT: Archives, mid-night-cycle, fluorescent grid
      overhead, info-stacks active.
    STYLE & AMBIANCE: clinical-cold archive + viral-pink corruption.
    AUDIO:
      Dialogue: The Meme says, "I am already in your head." (lip-sync)
      SFX: TV-corruption crackle 00:04; mask-crack tick 00:06.5.
      Ambient: archive-fluoro buzz; info-stack white-noise; faint
        72 Hz mains hum.
      Score: none.

pipeline:
  nb2_seed: 144001; veo_seed: 244001;
  vo_manifest_ref: apps/shared/theMemeVoManifest.json#L<TBD>;
  cdn_target: cdn/client-public/cutscenes/cs_boss_first_meme/
```

### §G.3.2 `cs_boss_first_collector` (Comms Array)

- host_space: §A.5 Comms Array

Subject: The Collector — humanoid in preservation-glass-front coat
laden with catalogued specimens (small jars, sealed tags), face
partially obscured by a brass curator's monocle. Stands at the
frequency-wall, hand on a console.

(Same schema as §G.3.1; Comms Array palette inherited; ref-image
`cdn/client-public/art/refs/the_collector_boss.png`. VO: The
Collector says, "Another specimen. Catalogued." SFX: glass-jar
tap 00:04, brass-monocle click 00:06. `nb2_seed: 144002;
veo_seed: 244002`.)

### §G.3.3 `cs_boss_first_necromancer` (Observation Deck)

- host_space: §A.x Observation Deck (TBC)

Subject: The Necromancer — robed figure standing at the
observation-window, three risen-crewman figures in incomplete
ghost-form drift in the room behind, Earth (or destination) visible
through window. Necromancer's right hand raised, palm up.

(Same schema. VO: The Necromancer says, "Death is a promotion."
SFX: ghost-whisper at 00:05, palm-pulse low chord at 00:07.
`nb2_seed: 144003; veo_seed: 244003`. Palette: deep teal-grey + bone-
white + dim-violet — `#2a3540 / #d6dcd0 / #5a3a6a`.)

### §G.3.4 `cs_boss_first_source` (TBC room — `bossEncounters.ts` for roomId)

- host_space: TBC per `bossEncounters.ts:226` Source roomId

Subject: The Source — a presence rather than a figure; a column of
slow-rotating white light z+0–4 m, geometry hinting at humanoid
form but never resolving; wisps of script-text in unreadable
ancient cipher swirling in the column.

(Same schema. VO: The Source says, "I was the first signal." SFX:
column-rotation low whoosh 00:00–00:08, script-tick at 00:04.
`nb2_seed: 144004; veo_seed: 244004`. Palette: pure white + dust-
gold + cipher-black — `#f5f5f0 / #c8a05a / #050505`. Notes:
"Constraints reinforce 'no human face inside the column; column is
not anthropomorphised'.")

### §G.3.5 `cs_boss_first_architect` (TBC room)

- host_space: TBC per `bossEncounters.ts:226` Architect roomId

Subject: The Architect — humanoid figure in a draftsman's apron
holding a single rolled-blueprint; behind them, a scaled
architectural-model of the Ark itself sits on a worktable, with one
section of the model already disassembled. Their face is in
focused concentration on the player.

(Same schema. VO: The Architect says, "Show me your blueprint."
SFX: blueprint-unroll 00:03, model-piece tap on worktable 00:06.
`nb2_seed: 144005; veo_seed: 244005`. Palette: drafting-blue +
graphite + brass — `#1a3550 / #2a2622 / #c8a05a`.)

---

## §G.4 Castle of Death chamber arrivals (20)

Source: `_PRODUCTION_DESTINATIONS.md` §E.4. Twenty chambers; one
first-arrival cutscene per chamber. Length 8 s each. Cat A. SFX-
driven; hierarchy-ritual organ-bed at -28 dB; ≤1 short VO from
Master of R'lyeh (per-chamber, per VO manifest).

Host_space inheritance: Castle of Death — Grand Hall as primary;
sub-chambers inherit hierarchy_ritual aesthetic with reverb
ranging 4.0–6.4 s per chamber size.

Trait-lock string for all 20 prompts:
> hierarchy_ritual aesthetic; black-marble floor with gold-blood-channel
> inlay; black-stone walls with sacrificial-iconography reliefs;
> 1800K candle equivalents; 6.4 s cathedral reverb; Kodak Vision3
> 500T pushed +1; palette `#0d0a08 / #c9a14a / #5a1a1f`; incense +
> cold-stone + iron-blood smell evoked through volumetric haze;
> chant-loop bed at -28 dB

### §G.4.1 `cs_castle_death_first_arrival` (Grand Hall)

```yaml
nb2_start:
  reference_images:
    - cdn/client-public/art/refs/castle_death_grand_hall.png
    - cdn/client-public/art/refs/master_of_rlyeh_npc.png
  prompt: |
    SUBJECT: the Castle of Death Grand Hall as seen from the HB2
      transit-arrival point at the entry threshold; the central-altar
      circle (8 m brass) glows faintly; the throne at the far end
      sits empty on its raised dais; 16 banner-mast flags hang
      motionless; 8 sacrificial-iconography columns rise to the
      vaulted ribbed ceiling; 16 hanging-chain candle-chandeliers
      illuminate the hall; one attendant-NPC stands at the altar
      with head bowed.
    COMPOSITION: wide establishing, 24mm, eye-level +1.65 m, deep
      DOF, vanishing point on the throne; the player's gloved
      hands faintly visible in lower frame palms-up at chest-height
      (welcoming-gesture posture from the HB2 transit emergence).
    LIGHTING/CAMERA: 1800K candle-chandelier key array; altar-bowl
      flame warm-rim on altar attendant; 4 throne-spots pooling on
      throne dais; volumetric incense haze z+1.5–3.0 m; ARRI Alexa
      anamorphic; Kodak Vision3 500T pushed +1.
    STYLE: hierarchy-ritual cathedral arrival still; palette
      `#0d0a08 / #c9a14a / #5a1a1f`; Wagner-baroque scale, dust-
      lit, incense-thick.
    CONSTRAINTS: standard; FPV trait-lock; the player's hands are
      in welcoming-gesture posture inherited from HB2 transit close.
    Output 4K, 21:9.

nb2_end:
  prompt: same vista; the altar-attendant has lifted their head;
    one banner-mast flag has begun a slow drift in still-air-draft;
    the throne dais shows Master of R'lyeh now standing at the
    throne-foot (silhouette only, hood drawn).

veo:
  prompt:
    CINEMATOGRAPHY: wide establishing, slow forward dolly +0.6 m
      over 8 s, 24mm, FPV.
    SUBJECT: the Grand Hall vista; altar-attendant; Master of
      R'lyeh appearing at throne-foot.
    ACTION: 0–3 s player's hands settle from welcoming-gesture
      posture; 3–5 s altar-attendant lifts head; 5–8 s a single
      banner-flag begins to drift; Master of R'lyeh appears at
      throne-foot in silhouette.
    CONTEXT: Castle of Death entry, post-HB2 transit, mid-ritual
      hour.
    STYLE & AMBIANCE: Wagner-baroque cathedral; dust-lit;
      incense-thick.
    AUDIO:
      Dialogue: Master of R'lyeh says, "You arrive at the body's
        edge." (lip-sync to dialogue)
      SFX: candle-flicker rolling bed; banner-mast cloth shift 00:06;
        Master appears with low chord 00:07.
      Ambient: organ-drone sub-bass 28 Hz; chant-loop -28 dB; 6.4 s
        cathedral reverb.
      Score: none.

pipeline:
  nb2_seed: 145001; veo_seed: 245001;
  vo_manifest_ref: apps/shared/masterOfRlyehVoManifest.json#L<TBD>;
  cdn_target: cdn/client-public/cutscenes/cs_castle_death_first_arrival/
```

### §G.4.2 `cs_castle_death_throne_first_view`

Length 8 s. Player walks past columns toward the throne; the
silhouette at the throne-foot resolves into Master of R'lyeh,
hood drawn back to reveal lower face only.

(Same schema. VO: Master of R'lyeh says, "Sit, after." Action:
slow forward dolly continues; throne-spots intensify; one column
relief begins to "weep" gold-blood from a carved wound. `nb2_seed:
145002; veo_seed: 245002`.)

### §G.4.3 `cs_hierarchy_offering_made` (Grand Hall altar)

Length 8 s. Player has placed a personal token on the central-altar
brass disc. The altar-bowl-flame surges +0.4 m. One column relief
animates: a carved figure turns its head toward the altar.

(Same schema. VO: Master of R'lyeh says, "The hall has heard you."
Action: token-placement chime; flame-surge; column-relief animation.
SFX: token-on-brass chime 00:03; flame-surge whoosh 00:05; column-
stone grind 00:07. `nb2_seed: 145003; veo_seed: 245003`.)

### §G.4.4 `cs_castle_death_altar_first_offer` (E.4.2 Altar of Surrender)

Sub-chamber: 30×30×12 m altar room with 4 candle-positions + central
bowl. Length 8 s. Player approaches and rests both gloved hands on
the central bowl rim.

(Same schema, sub-chamber palette inherited. VO: Master of R'lyeh
says, "Surrender what you can spare." Action: bowl-rim contact
chime; the four candle-flames lean inward simultaneously.
`nb2_seed: 145004; veo_seed: 245004`.)

### §G.4.5 `cs_castle_death_memorial_walk` (E.4.3 Hall of Memorial Stones)

Sub-chamber: 60×12×8 m corridor; 144 carved memorial-stones along
the walls. Length 12 s (stitched 8 + 4 hold). Player walks the
corridor's first 18 m at slow walking pace.

(Same schema, stitched. clip_a 0–8 s: forward dolly 12 m at 1.5 m/s
qualitative-slow; 144 stones slide past in foreground bokeh; one
stone at 9 m glows faintly as player passes. clip_b 8–12 s: dolly
slows to halt at 18 m; the glowing stone is now 4 m back, still
visible in upper-frame-left bokeh; player's gloved hand has lifted
to chest-height (memorial-touching posture). VO: Master of R'lyeh
says, "Each one has a name." `nb2_seed: 145005; veo_seed: 245005`.)

### §G.4.6 `cs_castle_death_mirror_first_lift` (E.4.4 Veiled Mirrors)

Sub-chamber: 24×24×6 m; 8 veiled mirrors. Length 8 s. Player lifts
the first veil; the mirror reflects not the room but a past-self
moment from Act 1.

(Same schema. Mirror reflection content: the player's pod-emergence
moment from `cs_awakening` — but rendered as if seen from the
opposite side. VO: Master of R'lyeh says, "The mirror remembers."
Action: veil-lift; mirror-content fade-in; player's reflection of
their own awakening visible. `nb2_seed: 145006; veo_seed: 245006`.
Notes: "Constraints reinforce: 'mirror reflects only the past
moment, never the player's current body — no third-person of the
player; the past-moment is itself a frosted-glass POV memory'.")

### §G.4.7 `cs_castle_death_crypt_descend` (E.4.5 Crypt of First Names)

Sub-chamber: 40×40×8 m underground; 32 named tombs. Length 8 s.
Player descends a 12-step stone stair; tomb-plaques visible at
floor-level on either side.

(Same schema. VO: Master of R'lyeh says, "The first names rest here."
Action: stair-descent dolly; tomb-plaques slide past; one plaque at
the bottom right glows faintly upon arrival. `nb2_seed: 145007;
veo_seed: 245007`.)

### §G.4.8 `cs_castle_death_reliquary_first_view` (E.4.6 Reliquary)

Sub-chamber: 20×20×8 m; 8 relic-displays under glass (bones, blade-
fragments, scrolls). Length 8 s. Player approaches the central
display.

(Same schema. VO: Master of R'lyeh says, "Each relic, a question."
Action: forward dolly to central display; glass-case fog clears;
relic — a single fragmentary blade — visible. `nb2_seed: 145008;
veo_seed: 245008`.)

### §G.4.9 `cs_castle_death_chapel_candle_lit` (E.4.7 Chapel of Last Rites)

Sub-chamber: 30×20×12 m; 12 pews + altar + stained-glass. Length
8 s. Player lights one candle for a fallen-NPC; the stained-glass
above reacts.

(Same schema. VO: Master of R'lyeh says, "Light, for what was
extinguished." Action: candle-tip-igniting flicker; stained-glass
panels above brighten one-at-a-time in cascade. `nb2_seed: 145009;
veo_seed: 245009`.)

### §G.4.10 `cs_castle_death_confessional_first_enter` (E.4.8 Confessional Cells)

Sub-chamber: cluster of 8 cells, each 4×4×4 m. Length 8 s. Player
steps into the first cell; door closes behind; a single grille
opens at face-height.

(Same schema. Smaller reverb, 1.8 s. VO: Master of R'lyeh says,
"What do you keep?" — voice through grille. Action: cell-door
close-thunk; grille-slide-open click. `nb2_seed: 145010; veo_seed:
245010`.)

### §G.4.11 `cs_castle_death_library_first_view` (E.4.9 Library of the Faithful)

Sub-chamber: 40×30×16 m; library stacks of Hierarchy texts.
Length 8 s. Player enters; an attendant librarian-NPC at desk
looks up.

(Same schema. VO: Master of R'lyeh says, "Read what was written."
Action: dolly forward; librarian looks up; one book on a high
shelf at z+12 m levitates 0.2 m and re-shelves itself. `nb2_seed:
145011; veo_seed: 245011`.)

### §G.4.12 `cs_castle_death_garden_circle_walk` (E.4.10 Garden of Stones)

Sub-chamber: 50×50×open-sky outdoor courtyard within castle walls;
36 standing stones in concentric circles. Length 12 s (stitched).
Player walks the outer circle.

(Same schema, stitched. clip_a 0–8 s: dolly along outer circle at
1.5 m/s; stones pass in middle-distance; sky overhead is overcast
4500K. clip_b 8–12 s: player completes 90° of the circle; the
inner-circle stone at the centre flares dim gold. VO: Master of
R'lyeh says, "Walk where the dead walked." `nb2_seed: 145012;
veo_seed: 245012`.)

### §G.4.13 `cs_castle_death_forge_first_view` (E.4.11 Forge of Last Weapons)

Sub-chamber: 30×30×12 m; ritual-forge. Length 8 s. Player approaches
the forge; a forge-master NPC strikes a memorial-blade once on the
anvil.

(Same schema, palette extended with forge-orange `#ff5a1a`. VO:
Master of R'lyeh says, "What was wielded, reforged." Action: forge-
hammer ring on anvil 00:04; sparks burst 00:04.5; blade-quench
hiss 00:06. `nb2_seed: 145013; veo_seed: 245013`.)

### §G.4.14 `cs_castle_death_pool_first_view` (E.4.12 Pool of Tears)

Sub-chamber: 24×24×6 m; reflective pool centred; 4 weeping-statue
corners. Length 8 s. Player approaches the pool; their reflection
in the water is **not** visible (FPV-mirror constraint).

(Same schema. VO: Master of R'lyeh says, "The pool keeps." Action:
forward dolly to pool edge; one weeping-statue tear drops into the
pool 00:05; concentric ripples spread; the ripples reach the
player's side of the pool by 8 s. Notes: "Reinforce constraint:
'no reflection of the player visible in the pool surface — the
water reflects only the ceiling and the four weeping statues.'"
`nb2_seed: 145014; veo_seed: 245014`.)

### §G.4.15 `cs_castle_death_bell_first_ring` (E.4.13 Bell Tower)

Sub-chamber: 12×12×60 m vertical; spiral stair to bell-chamber.
Length 12 s (stitched). clip_a: player ascends spiral stair, bell
visible above. clip_b: player rings the bell.

(Same schema, stitched. clip_a 0–8 s: stair-ascent dolly +12 m; bell
visible in oculus above; one tier-arrival on the bell platform.
clip_b 8–12 s: player's gloved hands grasp the rope; bell rings
once at 10 s; long resonance. VO: Master of R'lyeh says, "Toll for
one." `nb2_seed: 145015; veo_seed: 245015`.)

### §G.4.16 `cs_castle_death_banners_walk` (E.4.14 Hall of Fallen Banners)

Sub-chamber: 60×16×12 m; 144 fallen-faction banners. Length 8 s.
Player walks the first 18 m; banners pass overhead.

(Same schema. VO: Master of R'lyeh says, "Each banner, a war."
`nb2_seed: 145016; veo_seed: 245016`.)

### §G.4.17 `cs_castle_death_songs_first_listen` (E.4.15 Vault of Silent Songs)

Sub-chamber: 24×24×8 m; 12 sealed song-vessels. Length 8 s. Player
selects one vessel; it un-seals with a faint chord; a recorded
last-song begins to play very quietly.

(Same schema. VO: Master of R'lyeh says, "One song, once." Action:
vessel-seal click 00:03; chord-rise 00:04; recorded-song fade-in
ambient -32 dB at 00:05. `nb2_seed: 145017; veo_seed: 245017`.
Notes: "the recorded-song is treated as ambient layer, NOT as
score, since it is diegetic; music_eligibility remains 'none' per
§3.1 Cat A.")

### §G.4.18 `cs_castle_death_throne_annex_first_audience` (E.4.16 Throne Annex)

Sub-chamber: 30×30×16 m; small chamber adjoining Grand Hall throne.
Length 8 s. Player is summoned for personal audience with the
Hierarchy leader NPC.

(Same schema. VO: Hierarchy leader (named per `loredex.entity` ref)
says, "You crossed the hall." Action: leader steps forward 0.4 m;
hand gesture toward a low chair. SFX: footstep-on-stone 00:04;
chair-creak 00:06. `nb2_seed: 145018; veo_seed: 245018`.)

### §G.4.19 `cs_castle_death_court_first_judgment` (E.4.17 Court of Faceless Judges)

Sub-chamber: 40×40×12 m; 8 faceless statue-judges in tribunal
arrangement. Length 12 s (stitched). clip_a: player enters; 8
faceless statue-heads turn to track; clip_b: a single statue's
faceless surface ripples and a hand of carved stone gestures at
the player.

(Same schema, stitched. VO: Master of R'lyeh says, "Be judged."
SFX: 8 stone-head turns in cascade 00:01–00:05; stone-ripple
00:08; stone-hand creak 00:10. `nb2_seed: 145019; veo_seed: 245019`.)

### §G.4.20 `cs_castle_death_penitents_walk` (E.4.18 Penitent's Walk)

Sub-chamber: 80×8×8 m corridor; 100 m kneeling-flagstone walkway.
Length 12 s (stitched). Player kneels at first flagstone, then a
parametric montage of 4 more kneels along the walk.

(Same schema, stitched. VO: Master of R'lyeh says, "Kneel for what
remains." Action: knee-on-stone thump x 5 across 12 s. `nb2_seed:
145020; veo_seed: 245020`. Notes: "Constraint reinforces: 'player
hands and forearms enter frame from below at each kneel; no body
above hand-rest height ever visible'.")

### §G.4.21 `cs_castle_death_reconciliation_first_visit` (E.4.19 Reconciliation Chamber)

Sub-chamber: 24×24×8 m; chamber for players who have killed in-world
NPCs. Length 8 s. An NPC ghost (parametric to player's kill-list)
materialises 2 m in front of the player.

(Same schema. The ghost's identity is parametric; ref-image bundle
selects from `cdn/client-public/art/refs/named_npc_*.png` per
player kill-list, capped at the most recent. VO: NPC ghost says,
"You did this." (parametric per ghost identity — ghost-NPC's own
manifest). `nb2_seed: 145021; veo_seed: 245021`. Notes: "vo_manifest_ref
is parametric — points to the killed-NPC's own manifest. Pipeline
must select at runtime.")

### §G.4.22 `cs_castle_death_heart_stone_touch` (E.4.20 Heart Stone)

Sub-chamber: 16×16×16 m central chamber; one Heart Stone (3 m
ruby-coloured) hovers at room centre. Length 12 s (stitched).
**Faction-binding moment** — IF chosen, locks player to Hierarchy
permanently.

clip_a 0–8 s: player approaches the floating Heart Stone; chamber
responds with rising 8 Hz sub-bass and chant-loop intensifying to
-20 dB; the Stone rotates faster as the player closes.

clip_b 8–12 s: the player's gloved hand touches the Stone's
surface; Stone's ruby light floods the chamber; cut to white at
12 s (Hierarchy-binding cinematic, music-allowed, takes over —
out of scope here).

(Same schema, stitched. VO: Master of R'lyeh says, "All of it,
or none." `nb2_seed: 145022; veo_seed: 245022`. Notes: "ends on
a hard cut to white; faction-binding cinematic is separate. This
cutscene's recurrence is `once-per-faction-binding-attempt`; if
the player declines (does not touch), end-frame is the player's
hand withdrawing — alternate end_frame variant `end_decline.png`
referenced in pipeline meta.")

---

## §G.A audit (will be re-checked at §G.F)

Cutscenes added in this sub-phase: **45**
- §G.1 Pet Arena: 12
- §G.2 Chess Hall: 8
- §G.3 Boss arenas: 5
- §G.4 Castle of Death: 20

Each carries:
- NB2 start + end prompt (5-block schema; `gemini-3-pro-image-preview`;
  21:9 4K).
- Veo 3.1 prompt (5-part + Audio + timestamp; `veo-3.1-generate-001`;
  16:9 1080p; 8 s default; 12 s targets stitched).
- Canonical FPV trait-lock string.
- Canonical negative-prompt string.
- VO manifest ref or `null`.
- CDN target.
- nb2_seed + veo_seed (deterministic reproducibility).

Trait-lock discipline: every Pet Arena fighter description, every
chess-tier setting description, every castle-of-death chamber
palette string is **identical-token-reused** across cutscenes
sharing that subject/setting (per Nano Banana 2 character-
consistency research — `prompting.systems` guide).

Outstanding TBDs (resolved in §G.F audit):
- VO manifest line numbers for Game Master, Master of R'lyeh, The
  Meme, The Collector, The Necromancer, The Source, The Architect,
  Hierarchy leader.
- Boss-arena `host_space` references for Source + Architect (need
  `bossEncounters.ts` roomId resolution).
- New `cs_*` IDs need cross-cut entries added to
  `_PRODUCTION_CROSS_CUT.md` §F.1.A.4 (Pet Arena), §F.1.A.5
  (per-named-boss extension), §F.1.A.6 (Chess tier-promotion),
  §F.1.A.7 (Castle of Death chambers).

---

## §G.5 Trade Empire — per-sector first-arrival cutscenes (28)

Source: `apps/shared/tradeEmpireArtPrompts.ts:636–1024`. Sectors
already covered by `_PRODUCTION_CROSS_CUT.md` §F.1.A.3:
`first_arrival_panopticon`, `first_arrival_frontier_worlds`, and
the 8 `cs_first_arrival_generic_<sectorType>` type-templates plus
`cs_planet_state_flip_<state>` (5 templates). The 28 cuts below
fill the named-sector gap.

Length 8 s each. Cat A. FPV from the player's bridge or shuttle-
arrival overlook (per sector kind). SFX-driven, no music, ≤1
short VO sentence (the trade-clerk announcer for trade-station
sectors; faction-specific for ideological sectors; environmental
silence for hazard sectors).

Trait-lock per sector kind:
- **Trade hub / market**: 6500K market floodlights, Vision3 250D,
  palette `#c8a05a / #2a3540 / #5a1a6a`; SFX cargo-clamp clack +
  market-bell.
- **Civilization core**: 4500K civic key + 6500K rim, Vision3 250D,
  palette `#dce5ec / #c8a05a / #1a3550`; SFX civic-bell + crowd
  murmur.
- **Frontier / industrial**: 5400K work-light overhead + 1800K
  practical-glow, Vision3 500T pushed +1, palette
  `#3a3025 / #c8a05a / #ff5a1a`; SFX hydraulic hiss + arc-weld.
- **Hazard / forbidden**: 12000K low cold rim + 800K dim deep-amber
  warning lights, Vision3 500T pushed +2, palette
  `#0a0612 / #ff2a8a / #5fa8ff`; SFX wind-rush + low chord.
- **Ritual / archive**: 1800K candle + 4500K archive grid, Vision3
  500T, palette `#0d0a08 / #c9a14a / #5a1a1f`; SFX archive
  ventilation + page-rustle.

Each cutscene block uses a compact form referencing the canonical
template (§G.0.3) — only per-sector deltas are listed.

### §G.5.1 `cs_first_arrival_trade_nexus` (Trade Hub)

- xref: NEW (§F.1.A.3 to be added)
- host_space: Galaxy Map sector → §E.6.1 Trade Nexus shuttle-pad
- sector_kind: trade_hub

```yaml
nb2_start.subject: "Trade Nexus, the Empire's central commercial
  station — a 12-tier orbital ring 8 km diameter, hundreds of
  cargo lighters in queue, a crystalline Convergence-pillar at
  the ring's hub; viewed from the player's shuttle approach 2 km
  out at +0.5° pitch."
nb2_end.subject: "Trade Nexus shuttle has docked at Tier 4 trade-
  pad; the pad floor under the player's feet, brass cargo-clamps
  closing on the shuttle skids in foreground bokeh; the ring-
  hub Convergence-pillar visible upper-frame."
veo.action: "0–3 s shuttle approach, slow forward dolly; 3–5 s
  ring-hub Convergence-pillar pulses once; 5–8 s shuttle docks,
  brass cargo-clamps engage with chamfered click."
veo.audio.dialogue: "Trade-clerk says, \"Trade Nexus. Welcome.\""
veo.audio.sfx: "cargo-clamp clack 00:06; pillar-pulse low chord
  00:04; market-bell 00:08."
veo.audio.ambient: "thousand-shuttle ambient, ring-rotation
  rumble 0.4 Hz."
pipeline:
  nb2_seed: 146001; veo_seed: 246001; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_first_arrival_trade_nexus/
```

### §G.5.2 `cs_first_arrival_new_babylon_core` (Civ Core)

```yaml
nb2_start.subject: "New Babylon Core — the Empire's seat-of-power
  arcology, 24 km tall vertical city, ziggurat-tiered with hanging
  gardens at every fifth level; viewed from approach 4 km out at
  -2° pitch (looking up at the lower-tiers); civic-banner-flags
  visible at every tier; a single Imperial Phoenix-banner at the
  apex."
nb2_end.subject: "New Babylon Core landing-platform at Tier 12;
  player's gloved hand on platform-rail in foreground; ziggurat
  rises into haze in mid-distance."
veo.action: "0–3 s approach, ziggurat fills frame; 3–5 s
  civic-banner unfurls one tier mid-frame; 5–8 s landing-platform
  arrival, rail in foreground."
veo.audio.dialogue: "Civic herald says, \"New Babylon. Tier Twelve.\""
veo.audio.sfx: "banner-unfurl 00:04; landing-skid 00:06;
  civic-bell 00:07."
veo.audio.ambient: "civic-crowd murmur, distant Imperial
  fanfare brass at -32 dB."
pipeline:
  nb2_seed: 146002; veo_seed: 246002; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_first_arrival_new_babylon_core/
```

### §G.5.3 `cs_first_arrival_new_babylon_lower_tiers` (Civ Core, lower)

```yaml
nb2_start.subject: "New Babylon Lower Tiers — Tier 1 through Tier 4
  street-level, narrow alleys with vertical neon-vendor signage in
  21 different scripts; cooking-fire smoke z+0–3 m; ramshackle
  market stalls; the upper tiers loom 20 km overhead, mostly
  obscured by smog; viewed at street-level, eye-line +1.65 m."
nb2_end.subject: "the alley deepens; a single oil-lamp practical
  upper-frame-right; player's gloved hand on alley wall."
veo.action: "0–3 s alley settles into focus; 3–5 s a vendor's
  lantern flickers; 5–8 s a wisp of cooking-fire smoke crosses
  frame."
veo.audio.dialogue: "Vendor says, \"Two coppers. Last hour.\""
veo.audio.sfx: "vendor-lantern flicker 00:04; cooking-pot lid 00:06."
veo.audio.ambient: "lower-tier crowd density, distant
  high-tier banner-fanfare at -42 dB."
pipeline:
  nb2_seed: 146003; veo_seed: 246003; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_first_arrival_new_babylon_lower_tiers/
```

### §G.5.4 `cs_first_arrival_empire_frontier` (Frontier)

```yaml
nb2_start.subject: "Empire Frontier outpost — a 3-tier modular
  shipyard on a sub-luminary moon, 6 cargo-rigs in dock, hull-
  sparks visible at one repair-bay; the system's gas-giant fills
  the upper third of the frame in salmon-pink and dust-grey;
  viewed from shuttle approach 1.2 km."
nb2_end.subject: "shuttle has docked at outpost Tier 1; the
  hangar-door slides open, revealing the player's first view of
  the gas-giant from inside; gloved hand on the hangar-door
  edge."
veo.action: "0–3 s approach, gas-giant rotates slowly; 3–5 s
  hangar-door begins to slide open; 5–8 s gas-giant fills the
  open hangar-doorway."
veo.audio.dialogue: "Outpost-foreman says, \"Frontier hangar.
  Hatch.\""
veo.audio.sfx: "hangar-door hydraulic 00:04–00:06; arc-weld
  flicker 00:06."
veo.audio.ambient: "shipyard activity, hull-resonance
  low rumble."
pipeline:
  nb2_seed: 146004; veo_seed: 246004; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_first_arrival_empire_frontier/
```

### §G.5.5 `cs_first_arrival_forge_worlds` (Frontier / industrial)

```yaml
nb2_start.subject: "Forge Worlds — a network of orbiting forge-
  asteroids, each a 2 km hollowed-out rock with magma-channels
  glowing in spiral patterns visible from space; the player's
  shuttle approaches the largest, with two forge-vents flaring
  white-hot."
nb2_end.subject: "shuttle interior corridor, the forge-vent
  glow visible through a porthole at frame-right; gloved hand
  on porthole-rim."
veo.action: "0–3 s shuttle approach; 3–5 s forge-vent flare-up
  visible; 5–8 s player at porthole, vent-flare bathes the
  corridor in amber."
veo.audio.dialogue: "Forge-master says, \"Forge ready.\""
veo.audio.sfx: "forge-vent roar 00:04; porthole-glass thermal
  tick 00:07."
veo.audio.ambient: "deep forge-rumble bed; metal-on-metal taps."
pipeline:
  nb2_seed: 146005; veo_seed: 246005; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_first_arrival_forge_worlds/
```

### §G.5.6 `cs_first_arrival_viral_wastes` (Hazard)

```yaml
nb2_start.subject: "Viral Wastes — a planetary biosphere overrun
  with biomechanical viral-growth, kilometre-tall fungal-mycelium
  spires bristling with TV-corruption glitch-textures; the sky
  above is sickly cyan-pink; viewed from shuttle hover 200 m
  above quarantine-line."
nb2_end.subject: "shuttle window from inside, the wastes visible
  through quarantine-glass; one viral-spore pings against the
  glass."
veo.action: "0–3 s shuttle hovers over quarantine-line; 3–5 s
  one fungal-spire pulses with corruption-glitch; 5–8 s a single
  viral-spore floats up and pings the quarantine-glass."
veo.audio.dialogue: "Quarantine-AI says, \"Do not disembark.\""
veo.audio.sfx: "spore-ping 00:07; corruption-glitch crackle 00:04."
veo.audio.ambient: "quarantine-glass pressurised hum; faint
  fungal-bloom whoosh."
pipeline:
  nb2_seed: 146006; veo_seed: 246006; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_first_arrival_viral_wastes/
```

### §G.5.7 `cs_first_arrival_insurgency_haven` (Frontier / hidden)

```yaml
nb2_start.subject: "Insurgency Haven — a hollowed-out asteroid
  base, no markings, exterior camouflaged as ordinary rock;
  approach is from a service-tunnel; interior is bare-rock walls
  with strung incandescent work-lights at 3-metre intervals."
nb2_end.subject: "the service-tunnel opens onto a 30 m diameter
  central cavern; one Insurgency-officer waits at the cavern
  centre, hand raised in the rebel salute."
veo.action: "0–3 s tunnel-approach in low-light; 3–5 s tunnel
  widens into cavern; 5–8 s officer raises rebel salute."
veo.audio.dialogue: "Officer says, \"Rebel ground. Welcome.\""
veo.audio.sfx: "boot-on-rock cadence 00:00–00:04; salute-fist-on-
  chest thump 00:07."
veo.audio.ambient: "cavern reverb 3.2 s; work-light ballast hum."
pipeline:
  nb2_seed: 146007; veo_seed: 246007; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_first_arrival_insurgency_haven/
```

### §G.5.8 `cs_first_arrival_abyssal_sectors` (Hazard / forbidden)

```yaml
nb2_start.subject: "Abyssal Sectors — interstellar void with
  no stars, only the faint outline of a wreck-graveyard
  silhouetted against deep-violet; the player's shuttle drifts
  alone with engines silenced."
nb2_end.subject: "one wreck-silhouette resolves into a half-
  destroyed Imperial dreadnought, hull breached; shuttle
  passes 600 m beneath."
veo.action: "0–3 s drift in silence; 3–5 s wreck silhouette
  resolves; 5–8 s shuttle passes beneath wreck."
veo.audio.dialogue: "none."
veo.audio.sfx: "shuttle hull-creak 00:05; deep-void low chord
  00:06–00:08."
veo.audio.ambient: "near-silence; faint cosmic-ray ping every 2 s."
pipeline:
  nb2_seed: 146008; veo_seed: 246008; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_first_arrival_abyssal_sectors/
```

### §G.5.9 `cs_first_arrival_black_hole_gate` (Hazard)

```yaml
nb2_start.subject: "Black Hole Gate — an event-horizon disc 4000 km
  wide; accretion-disc rendered in spectrum-shifted reds and
  violet-blues; the player's shuttle holds at safe distance
  120,000 km out."
nb2_end.subject: "the gate's relativistic-jet flares; shuttle's
  porthole heat-tile flickers in response."
veo.action: "0–3 s gate hangs in frame; 3–5 s accretion-disc
  rotation visible; 5–8 s relativistic-jet flares."
veo.audio.dialogue: "Pilot says, \"Holding station.\""
veo.audio.sfx: "jet-flare low whoosh 00:06; heat-tile thermal
  tick 00:07."
veo.audio.ambient: "shuttle hull resonance, gravitational hum
  sub-bass."
pipeline:
  nb2_seed: 146009; veo_seed: 246009; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_first_arrival_black_hole_gate/
```

### §G.5.10 `cs_first_arrival_violetta_approach_lane` (Trade lane)

```yaml
nb2_start.subject: "Violetta Approach Lane — a 200,000 km long
  shipping corridor lined with violet-coloured navigation-buoys at
  1 km intervals; the corridor curves toward a star-system entry
  point."
nb2_end.subject: "shuttle has reached the corridor's exit; the
  destination system's primary star fills frame upper-right."
veo.action: "0–3 s shuttle drifts down corridor, buoys flash-pass;
  3–5 s corridor curves; 5–8 s system primary fills frame."
veo.audio.dialogue: "Lane-controller says, \"Cleared, in trim.\""
veo.audio.sfx: "buoy-strobe ping every 0.4 s; star-rise low chord
  00:06."
veo.audio.ambient: "shuttle thrust hum 80 Hz; lane-traffic faint."
pipeline:
  nb2_seed: 146010; veo_seed: 246010; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_first_arrival_violetta_approach_lane/
```

### §G.5.11 `cs_first_arrival_forward_bastion` (Frontier / military)

```yaml
nb2_start.subject: "Forward Bastion — a fortified Imperial outpost
  on a tidally-locked moon's terminator line; surface is
  half-shadow, half-blinding-white; the bastion is a cluster of 5
  fortified bunkers connected by reinforced corridors."
nb2_end.subject: "bastion airlock cycles open; harsh terminator
  light backlights the interior."
veo.action: "0–3 s shuttle low-altitude approach; 3–5 s bastion
  resolves; 5–8 s airlock cycles open."
veo.audio.dialogue: "Sergeant says, \"Bastion. Step in.\""
veo.audio.sfx: "airlock-cycle hydraulics 00:05–00:08;
  terminator-wind 00:00–00:08."
veo.audio.ambient: "bastion comm-traffic chatter; wind-rush -36 dB."
pipeline:
  nb2_seed: 146011; veo_seed: 246011; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_first_arrival_forward_bastion/
```

### §G.5.12 `cs_first_arrival_remembrance_archive` (Ritual / archive)

```yaml
nb2_start.subject: "Remembrance Archive — a vast cathedral-station
  of memorial-stones in zero-G arrayed in concentric rings around
  a central chant-chamber; pale-blue mourning-light
  illuminates each stone from below."
nb2_end.subject: "shuttle docks at archive Tier 1; entry corridor
  shows first row of memorial-stones at zero-G float."
veo.action: "0–3 s station rotation; 3–5 s shuttle docks; 5–8 s
  entry corridor reveals memorial-stones."
veo.audio.dialogue: "Archivist says, \"Memorial. Quiet now.\""
veo.audio.sfx: "stone-float subtle whoosh 00:06; archive-bell 00:08."
veo.audio.ambient: "chant-loop -32 dB; archive ventilation."
pipeline:
  nb2_seed: 146012; veo_seed: 246012; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_first_arrival_remembrance_archive/
```

### §G.5.13 `cs_first_arrival_chronarchive_vault` (Ritual / archive)

```yaml
nb2_start.subject: "Chronarchive Vault — a sealed chrono-archive
  on an asteroid; exterior is featureless, interior houses
  millions of time-locked memory-shards in sealed glass canopic
  jars on shelving that extends z+0–80 m vertical."
nb2_end.subject: "vault-shelf elevator-pod descends past 4 levels
  of canopic jars; one jar at row 3 glows briefly as player
  passes."
veo.action: "0–3 s vault-entry corridor; 3–5 s elevator-pod begins
  descent; 5–8 s passing canopic-jar glow."
veo.audio.dialogue: "Archivist says, \"Time-locked. Mind step.\""
veo.audio.sfx: "elevator-pod hum 00:04; canopic-jar resonance 00:06."
veo.audio.ambient: "vault stillness, sub-bass 16 Hz."
pipeline:
  nb2_seed: 146013; veo_seed: 246013; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_first_arrival_chronarchive_vault/
```

### §G.5.14 `cs_first_arrival_ark_debris_field` (Hazard)

```yaml
nb2_start.subject: "Ark Debris Field — a slow-tumbling debris cloud
  20,000 km wide, fragments of an ancient Ark; visibility is
  intermittent through dust-wash; the player's shuttle navigates
  cautiously between debris-pieces."
nb2_end.subject: "one debris-fragment 50 m off port-side resolves
  as a still-recognisable Ark hull-piece with intact running-lights."
veo.action: "0–3 s shuttle drifts through dust; 3–5 s a fragment
  emerges; 5–8 s recognisable hull-piece, running-lights still on."
veo.audio.dialogue: "Pilot says, \"That is — Ark plating.\""
veo.audio.sfx: "debris-tap on hull 00:04; running-light chime 00:07."
veo.audio.ambient: "shuttle thrust low hum; debris-bell at random."
pipeline:
  nb2_seed: 146014; veo_seed: 246014; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_first_arrival_ark_debris_field/
```

### §G.5.15 `cs_first_arrival_terminus_approach` (Hazard / endgame)

```yaml
nb2_start.subject: "Terminus Approach — final corridor toward the
  Terminus, a destination so dense with cosmic phenomena that
  ordinary physics begins to fray; the shuttle's instruments show
  visible static; ahead, a violet-purple anomaly fills 60% of the
  frame."
nb2_end.subject: "the anomaly's outer edge resolves into recursive
  fractal geometry; shuttle is now 800 m out."
veo.action: "0–3 s shuttle on final approach, instruments
  static-flickering; 3–5 s anomaly resolves; 5–8 s fractal
  geometry visible."
veo.audio.dialogue: "Pilot says, \"Approach. Terminus.\""
veo.audio.sfx: "instrument-static crackle 00:00–00:08;
  fractal-resolve chord 00:06."
veo.audio.ambient: "shuttle hull groan; anomaly low chord 8 Hz."
pipeline:
  nb2_seed: 146015; veo_seed: 246015; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_first_arrival_terminus_approach/
```

### §G.5.16 `cs_first_arrival_research_corridor_alpha` (Research)

```yaml
nb2_start.subject: "Research Corridor Alpha — a sterile science-
  station corridor; floor and ceiling lined with experiment-
  capsules each containing a different specimen (alien flora,
  geometric crystal, frozen organism); 20 capsules visible in
  sequence."
nb2_end.subject: "corridor end; a researcher in lab-coat looks up
  from a holopad; one capsule's specimen has just begun to move."
veo.action: "0–3 s corridor entry; 3–5 s capsules pass in mid-distance;
  5–8 s researcher looks up, specimen movement glimpse."
veo.audio.dialogue: "Researcher says, \"Welcome to Alpha.\""
veo.audio.sfx: "capsule-glass thermal tick 00:04; holopad chime 00:06."
veo.audio.ambient: "research-ventilation, faint specimen-life sounds."
pipeline:
  nb2_seed: 146016; veo_seed: 246016; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_first_arrival_research_corridor_alpha/
```

### §G.5.17 `cs_first_arrival_research_corridor_beta` (Research)

```yaml
notes: "identical staging to §G.5.16 but specimens are
  archaeological/historical (skull-fragments, broken weapons,
  scroll-cases); researcher in dustier lab-coat. Palette shifts
  to dust-bone `#dccfaa / #2a2622 / #8a4a1a`. Audio: page-rustle
  instead of capsule-glass tick."
pipeline:
  nb2_seed: 146017; veo_seed: 246017; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_first_arrival_research_corridor_beta/
```

### §G.5.18 `cs_first_arrival_research_corridor_gamma` (Research)

```yaml
notes: "identical staging; specimens are exotic-physics (a
  contained singularity, a stable wormhole-pocket, a
  zero-point-energy reactor); palette `#1a3550 / #5fa8ff / #ff2a8a`;
  researcher's hair stands faintly on end from local field-effects.
  Audio: gravitational-hum sub-bass + reactor-tick."
pipeline:
  nb2_seed: 146018; veo_seed: 246018; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_first_arrival_research_corridor_gamma/
```

### §G.5.19 `cs_first_arrival_probability_market_hub` (Trade hub)

```yaml
nb2_start.subject: "Probability Market Hub — an exchange where
  futures themselves are commodities; trading-floor fills 200 m
  diameter circular pit with traders shouting over a probability-
  ticker that hangs at z+8 m showing live rates as cascading
  glyphs."
nb2_end.subject: "ticker resolves a major value-shift; one trader
  in foreground rips up a contract."
veo.action: "0–3 s trading floor in chaos; 3–5 s ticker shows
  major shift; 5–8 s contract-tearing in foreground."
veo.audio.dialogue: "Floor-clerk says, \"Market open.\""
veo.audio.sfx: "ticker-glyph cascade 00:00–00:08; paper-tear 00:07."
veo.audio.ambient: "trader shouting bed -28 dB."
pipeline:
  nb2_seed: 146019; veo_seed: 246019; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_first_arrival_probability_market_hub/
```

### §G.5.20 `cs_first_arrival_syndicate_route_prime` (Trade lane / Syndicate)

```yaml
nb2_start.subject: "Syndicate Route Prime — a lawless trade-lane
  through unclaimed space; the lane is unmarked by official buoys
  but each fork-point has a Syndicate sigil burned into a beacon-
  asteroid; player's shuttle eases past one such sigil-beacon."
nb2_end.subject: "the beacon's sigil flares once as shuttle passes;
  beacon broadcasts an encrypted authentication ping."
veo.action: "0–3 s sigil-beacon resolves; 3–5 s sigil flares;
  5–8 s shuttle passes."
veo.audio.dialogue: "Syndicate-comms says, \"Authenticated. Through.\""
veo.audio.sfx: "sigil-flare crackle 00:05; comms-ping 00:07."
veo.audio.ambient: "lawless quiet, faint static."
pipeline:
  nb2_seed: 146020; veo_seed: 246020; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_first_arrival_syndicate_route_prime/
```

### §G.5.21 `cs_first_arrival_command_post_iron` (Frontier / military)

```yaml
notes: "Forward command-post on a hostile world; design echoes
  §G.5.11 Forward Bastion but harsher — driving rain, mud, low-
  hanging cloud cover; sergeant lit by sodium-vapour 2200K
  practical."
veo.audio.dialogue: "Sergeant says, \"Iron post. In.\""
pipeline:
  nb2_seed: 146021; veo_seed: 246021; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_first_arrival_command_post_iron/
```

### §G.5.22 `cs_first_arrival_intelligence_exchange_nightline` (Hidden trade)

```yaml
nb2_start.subject: "Intelligence Exchange Nightline — a black-market
  data-broker café in the lower tiers of an unnamed station;
  flickering neon, smoke-haze, half-dozen brokers at scattered
  tables; the player's contact sits at the back booth, face
  obscured by a wide-brim hat."
nb2_end.subject: "broker slides a data-shard across the booth;
  shard glows faintly cyan."
veo.action: "0–3 s café in haze; 3–5 s player approaches booth;
  5–8 s shard slides across."
veo.audio.dialogue: "Broker says, \"This for that.\""
veo.audio.sfx: "shard-on-table tap 00:06; broker-lighter click
  00:04."
veo.audio.ambient: "low café murmur, vinyl-record crackle far
  upstage."
pipeline:
  nb2_seed: 146022; veo_seed: 246022; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_first_arrival_intelligence_exchange_nightline/
```

### §G.5.23 `cs_first_arrival_atarion_ruins` (Hazard / archaeological)

```yaml
nb2_start.subject: "Atarion Ruins — surface excavation site of an
  extinct civilization; partially excavated stone-monoliths jut
  through dust; archaeological work-tents at the perimeter;
  twilight."
nb2_end.subject: "one monolith near the dig's centre suddenly
  glyph-glows along its carved surface."
veo.action: "0–3 s dig-site overview; 3–5 s player approaches
  central monolith; 5–8 s monolith glyph-glows."
veo.audio.dialogue: "Dig-foreman says, \"Atarion. Move careful.\""
veo.audio.sfx: "dig-tarp wind-flap 00:00–00:08; glyph-glow chord 00:07."
veo.audio.ambient: "twilight wind 4 m/s; distant generator hum."
pipeline:
  nb2_seed: 146023; veo_seed: 246023; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_first_arrival_atarion_ruins/
```

### §G.5.24 `cs_first_arrival_tidewater_archive` (Ritual / archive)

```yaml
nb2_start.subject: "Tidewater Archive — a flooded library on a
  water-world, accessed by submersible; columns of salt-encrusted
  bookshelves rise from the seabed at z+0–18 m; bioluminescent
  fish trace text-paths through the water."
nb2_end.subject: "submersible's light reveals one shelf with intact
  scroll-cases at the player's window."
veo.action: "0–3 s submersible descends; 3–5 s shelves resolve;
  5–8 s scroll-cases visible."
veo.audio.dialogue: "Archivist says, \"Tidewater. Hold breath.\""
veo.audio.sfx: "submersible thruster 00:00–00:08; bio-fish chord 00:06."
veo.audio.ambient: "submerged silence; pressure-creak occasional."
pipeline:
  nb2_seed: 146024; veo_seed: 246024; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_first_arrival_tidewater_archive/
```

### §G.5.25 `cs_first_arrival_skyforge_plateau` (Frontier / industrial)

```yaml
notes: "high-altitude forge platform on a stormy gas-giant moon;
  6500K sky-scatter + 1800K forge-glow; massive sky-anvils pound
  rhythmically. Audio: forge-anvil ring on every 4 s. Trait-lock
  with §G.5.5 Forge Worlds palette."
veo.audio.dialogue: "Forge-master says, \"Skyforge. Stand clear.\""
pipeline:
  nb2_seed: 146025; veo_seed: 246025; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_first_arrival_skyforge_plateau/
```

### §G.5.26 `cs_first_arrival_ember_memorial` (Ritual)

```yaml
notes: "memorial site on a lunar surface; black-glass slab 40 m
  long inscribed with names of the war-fallen; one perpetual
  ember-flame at slab's foot. Palette `#0a0908 / #ff5a1a / #c8a05a`.
  Audio: ember-flame crackle, lunar-wind near-silent."
veo.audio.dialogue: "Master of R'lyeh says, \"Names burn long.\""
pipeline:
  nb2_seed: 146026; veo_seed: 246026; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_first_arrival_ember_memorial/
```

### §G.5.27 `cs_first_arrival_hidden_pureflame_cell` (Hidden / faction)

```yaml
notes: "secret Pureflame cell hideout in an industrial sub-basement;
  Pureflame-orange banner draped on back wall; six cell-members
  in worn uniforms, faces partially shadowed; palette
  `#3a2010 / #ff5a1a / #c8a05a`. Audio: low fire-bowl crackle,
  whispered planning conversations."
veo.audio.dialogue: "Cell-leader says, \"Hidden. Welcome.\""
pipeline:
  nb2_seed: 146027; veo_seed: 246027; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_first_arrival_hidden_pureflame_cell/
```

### §G.5.28 `cs_first_arrival_clone_collective` (Civilization / unique)

```yaml
nb2_start.subject: "Clone Collective — a station-state inhabited
  entirely by a single clone-line repeated 80,000 times; the
  arrival hall has a row of identical clone-greeters smiling in
  unison; clinical white-and-mint palette."
nb2_end.subject: "12 clones step forward in unison; their footstep
  is one synchronised footfall."
veo.action: "0–3 s arrival hall; 3–5 s clones acknowledge in unison;
  5–8 s synchronised step-forward."
veo.audio.dialogue: "Clone-greeter chorus says, \"Welcome.\""
veo.audio.sfx: "synchronised footfall 00:07; chorus breath 00:00."
veo.audio.ambient: "synchronised heartbeat 60 BPM at -38 dB."
pipeline:
  nb2_seed: 146028; veo_seed: 246028; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_first_arrival_clone_collective/
  notes: "for chorus-line, Veo dialogue is informational; lip-sync
    is impossible across 12 mouths. Audio post overlays a single
    clone-VO take time-shifted across 12 mouths to fake unison."
```

---

## §G.6 Tower Defense — per-map cutscenes (10 maps × 2)

Source: `apps/shared/towerDefense.ts`. The map-set is data-driven
but Production has assigned 10 named maps to ship: **Outer
Perimeter, Cargo Decks, Core Annex, Reactor Approach, Bridge
Hold, Defense Command Choke, Earth-Side Beachhead, Hierarchy
Pilgrim Road, Insurgency Stronghold, Terminus Last Stand**. Per
map: one **deployment** cut (8 s; player surveys lane configuration)
+ one **outcome** cut (8 s; clean-hold or breach). Total **20 cuts**.

Host_space: §A.33 Defense Command (deployment views from threat-
display) for deployment cuts; per-map hostspace for outcome cuts.

Trait-lock per map (palette inherited from map's diegetic location):

| map | palette | atmosphere |
|---|---|---|
| Outer Perimeter | `#3a3540 / #c8a05a / #5fa8ff` | exterior-vacuum |
| Cargo Decks | `#3a3025 / #c8a05a / #ff5a1a` | warehouse |
| Core Annex | `#1a2a40 / #c8a05a / #ff2a8a` | server-room |
| Reactor Approach | `#3a1a10 / #ff5a1a / #c8a05a` | hot-dim |
| Bridge Hold | `#1a2540 / #c8a05a / #5fa8ff` | command-cool |
| Defense Command Choke | `#0d0a08 / #c8a05a / #ff5a1a` | bunker |
| Earth-Side Beachhead | `#3a4a3a / #c8a05a / #5fa8ff` | grassland-overcast |
| Hierarchy Pilgrim Road | `#0d0a08 / #c9a14a / #5a1a1f` | ritual-lit |
| Insurgency Stronghold | `#1a3550 / #c8a05a / #ff5a1a` | rebel-amber |
| Terminus Last Stand | `#0a0612 / #ff2a8a / #5fa8ff` | violet-anomaly |

### §G.6.1 `cs_td_deploy_outer_perimeter` (deployment)

```yaml
host_space: §A.33 Defense Command (threat-display)
nb2_start.subject: "the Defense Command threat-display showing
  Outer Perimeter map — a 12-lane exterior approach with three
  choke-rings at 2/4/6 km out; lane-icons populate as the
  player's hand hovers over deployment-points; the room is dim,
  display-glow blue washes the operator's table."
nb2_end.subject: "deployment-points filled with player's tower
  icons (yellow); a klaxon warning-LED begins to pulse upper-right
  on the display; first wave-arrow visible at the +6 km ring."
veo.action: "0–3 s display draws; 3–5 s player's gloved hand
  places towers; 5–8 s wave-arrow appears, klaxon pulses."
veo.audio.dialogue: "Institutional voice says, \"Wave inbound.\""
veo.audio.sfx: "tower-place chime each 00:03 / 00:04 / 00:05;
  klaxon-LED tone 00:07."
veo.audio.ambient: "command-room ventilation, sub-bass alert tone."
pipeline:
  nb2_seed: 147001; veo_seed: 247001; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_td_deploy_outer_perimeter/
```

### §G.6.2 `cs_td_outcome_outer_perimeter`

Two variants per map (clean / breach), select at runtime by outcome.

```yaml
host_space: §A.33 Defense Command (threat-display)
nb2_start.subject (clean): "the threat-display shows the Outer
  Perimeter cleared — all 12 lanes green, last enemy icon fading
  at +2 km ring; victory chime visible as a green halo on the
  display border."
nb2_start.subject (breach): "the threat-display shows the Outer
  Perimeter breached — three lanes red, enemy icon at +0 ring
  (hub); klaxon LED solid red."
nb2_end.subject (clean): "operator's hand reaches for the
  display-confirm button; LED transitions green-solid."
nb2_end.subject (breach): "operator's hand pulls back; one lane-
  icon flickers and dies; reactor-warning panel begins flashing."
veo.action (clean): "0–3 s display shows clean state; 3–5 s
  green-halo cascades; 5–8 s confirm-press, victory chime."
veo.action (breach): "0–3 s display shows breach state; 3–5 s
  klaxon solidifies red; 5–8 s reactor-warning begins, hand
  withdraws."
veo.audio.dialogue (clean): "Institutional voice says, \"Hold
  confirmed.\""
veo.audio.dialogue (breach): "Institutional voice says, \"Hub
  breach.\""
veo.audio.sfx (clean): "confirm-chime 00:07; green-halo cascade 00:04."
veo.audio.sfx (breach): "klaxon-solid tone 00:04;
  reactor-warning klaxon 00:07."
pipeline:
  nb2_seed: 147002; veo_seed: 247002; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_td_outcome_outer_perimeter/
  notes: "two end-frame variants — `end_clean.png` and
    `end_breach.png` selected at runtime by outcome."
```

### §G.6.3–§G.6.20 (remaining 9 maps × 2 cuts)

Each pair follows §G.6.1 / §G.6.2 schema with palette and
narrative anchor swapped per the table above. Compact form:

| § | cs_id | map | palette source | notable SFX/VO |
|---|---|---|---|---|
| §G.6.3 | `cs_td_deploy_cargo_decks` | Cargo Decks | warehouse | warehouse echo; "Deck wave inbound." |
| §G.6.4 | `cs_td_outcome_cargo_decks` | Cargo Decks | warehouse | "Decks held / Decks lost." |
| §G.6.5 | `cs_td_deploy_core_annex` | Core Annex | server-room | server-fan hum; "Core wave." |
| §G.6.6 | `cs_td_outcome_core_annex` | Core Annex | server-room | "Annex hold / Core breach." |
| §G.6.7 | `cs_td_deploy_reactor_approach` | Reactor | hot-dim | reactor-rhythm; "Reactor wave." |
| §G.6.8 | `cs_td_outcome_reactor_approach` | Reactor | hot-dim | "Reactor stable / Critical." |
| §G.6.9 | `cs_td_deploy_bridge_hold` | Bridge Hold | command-cool | bridge-comms; "Bridge wave." |
| §G.6.10 | `cs_td_outcome_bridge_hold` | Bridge Hold | command-cool | "Bridge held / Boarded." |
| §G.6.11 | `cs_td_deploy_defense_command_choke` | DCC | bunker | bunker-thunk; "Choke wave." |
| §G.6.12 | `cs_td_outcome_defense_command_choke` | DCC | bunker | "Choke held / Compromised." |
| §G.6.13 | `cs_td_deploy_earth_side_beachhead` | Earth | grassland | wind+grass; "Beach wave." |
| §G.6.14 | `cs_td_outcome_earth_side_beachhead` | Earth | grassland | "Beachhead held / Overrun." |
| §G.6.15 | `cs_td_deploy_hierarchy_pilgrim_road` | Pilgrim | ritual-lit | chant; "Pilgrim wave." |
| §G.6.16 | `cs_td_outcome_hierarchy_pilgrim_road` | Pilgrim | ritual-lit | "Road held / Profaned." |
| §G.6.17 | `cs_td_deploy_insurgency_stronghold` | Stronghold | rebel-amber | drum-roll; "Stronghold wave." |
| §G.6.18 | `cs_td_outcome_insurgency_stronghold` | Stronghold | rebel-amber | "Stronghold held / Crushed." |
| §G.6.19 | `cs_td_deploy_terminus_last_stand` | Terminus | violet-anomaly | anomaly chord; "Terminus wave." |
| §G.6.20 | `cs_td_outcome_terminus_last_stand` | Terminus | violet-anomaly | "Stood / Fell." |

Pipeline seeds: `nb2_seed: 147003..147020; veo_seed: 247003..247020`.
All `cdn_target: cdn/client-public/cutscenes/<cs_id>/`. Notes for
all outcome cuts: "two end-frame variants per outcome."

---

## §G.7 Vortex Incursion — 5 missing room cutscenes

Source: `apps/shared/vortexIncursionTemplate.ts:31–301`. R0/R4/R5/R6/R9
covered in `_PRODUCTION_CROSS_CUT.md` §F.1.A.7. R1/R2/R3/R7/R8 below.

Trait-lock: vortex-violet with electric-magenta rim; 1800K candle
equivalents; Kodak Vision3 500T pushed +2; palette
`#1a0a2e / #ff2a8a / #5fa8ff`; cathedral reverb 5.2 s within rooms.

### §G.7.1 `cs_vortex_r1_voices_used_to_be` (R1: Where the Voices Used To Be)

```yaml
host_space: Vortex Incursion R1
nb2_start.subject: "a 30 m diameter chamber filled with floating
  microphone-stands at zero-G, each stand connected by trailing
  copper-wire; the wires hum faintly with traces of voice that
  never resolve into words; pale-violet ambient illumination."
nb2_end.subject: "one microphone-stand at the chamber centre rotates
  to face the camera; its wire's voice-trace surges briefly into
  almost-audible speech."
veo.action: "0–3 s chamber establishes, mics drift; 3–5 s player
  drifts toward centre; 5–8 s centre-mic faces camera, voice surges."
veo.audio.dialogue: "Vortex-voice says, \"You — were here.\""
veo.audio.sfx: "voice-trace surge 00:06; mic-stand drift hush
  00:00–00:08."
veo.audio.ambient: "vortex-violet hum 22 Hz; faint AM-radio
  texture -36 dB."
pipeline:
  nb2_seed: 148001; veo_seed: 248001; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_vortex_r1_voices_used_to_be/
```

### §G.7.2 `cs_vortex_r2_chapel_lost_names` (R2: Chapel of Lost Names)

```yaml
host_space: Vortex Incursion R2
nb2_start.subject: "a chapel-shaped chamber with 144 niches in the
  walls, each niche holding a name-stone that has had its
  inscription erased; faint candle-flames flicker inside each
  niche; the altar at the chamber's far end holds a single
  intact name-stone."
nb2_end.subject: "the player approaches the intact altar-stone;
  the inscription begins to resolve — but cuts to black before
  any name is readable."
veo.action: "0–3 s chamber settles; 3–5 s player drifts to altar;
  5–8 s inscription begins to resolve, hard-cut to black at 8 s."
veo.audio.dialogue: "Vortex-voice says, \"Whose name remains?\""
veo.audio.sfx: "candle-flicker rolling bed; stone-resonance chord 00:06."
veo.audio.ambient: "chapel reverb 5.2 s; vortex-violet hum 22 Hz."
pipeline:
  nb2_seed: 148002; veo_seed: 248002; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_vortex_r2_chapel_lost_names/
```

### §G.7.3 `cs_vortex_r3_first_thing_noticed` (R3: First Thing That Noticed You)

```yaml
host_space: Vortex Incursion R3
nb2_start.subject: "an empty chamber, 20 m square, walls bare —
  but the player has the unmistakable sensation of being watched;
  the chamber's far wall has a single dark patch 0.6 m diameter
  that is subtly *not* a shadow."
nb2_end.subject: "the dark patch has shifted 1.2 m to the right
  and grown to 0.8 m; nothing else has moved."
veo.action: "0–3 s chamber holds; 3–5 s player notices the dark
  patch; 5–8 s the patch shifts and grows."
veo.audio.dialogue: "none."
veo.audio.sfx: "patch-shift sub-audible chord 00:06; player-
  breath quickening 00:05."
veo.audio.ambient: "wrong-silence — a frequency that should
  exist at -∞ dB but resolves at -52 dB; vortex-violet hum 22 Hz."
pipeline:
  nb2_seed: 148003; veo_seed: 248003; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_vortex_r3_first_thing_noticed/
  notes: "Veo negative_prompt extended: 'no human or humanoid
    figure visible inside or near the dark patch'."
```

### §G.7.4 `cs_vortex_r7_library_erased_books` (R7: Library of Erased Books)

```yaml
host_space: Vortex Incursion R7
nb2_start.subject: "a 60×40 m library chamber; the shelves are
  filled with books whose pages have been erased — every page
  still flips when the chamber's faint draft hits them, but no
  text remains; one book at the chamber's centre is open on a
  reading-stand and shows pages that are slowly *re-writing*
  themselves with new text in real-time."
nb2_end.subject: "the re-writing book's current page settles on
  three legible words: 'YOU WERE HERE'."
veo.action: "0–3 s library establishes, pages flip-rustle; 3–5 s
  player approaches reading-stand; 5–8 s book's text resolves to
  'YOU WERE HERE'."
veo.audio.dialogue: "Vortex-voice says, \"Re-writing now.\""
veo.audio.sfx: "page-flip rolling bed 00:00–00:08; ink-resolve tick
  00:07."
veo.audio.ambient: "library reverb 5.2 s; vortex-hum 22 Hz."
pipeline:
  nb2_seed: 148004; veo_seed: 248004; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_vortex_r7_library_erased_books/
  notes: "diegetic text 'YOU WERE HERE' is exactly 12 chars,
    inside NB2's text-rendering safe-zone."
```

### §G.7.5 `cs_vortex_r8_last_stable_room` (R8: Last Stable Room)

```yaml
host_space: Vortex Incursion R8
nb2_start.subject: "a 12×12 m chamber that is conspicuously
  *normal* — wood-panelled walls, a domestic reading-chair, a
  side-table with a teacup, a lamp at 2700K, a paperback open on
  the chair's arm; the only Vortex-element is the chamber's
  ceiling, which subtly ripples like water."
nb2_end.subject: "the teacup steams gently; the paperback's page
  has turned by itself; the ceiling ripple has intensified."
veo.action: "0–3 s chamber holds, almost reassuringly; 3–5 s
  paperback page turns; 5–8 s ceiling ripple intensifies, teacup
  steams more visibly."
veo.audio.dialogue: "Vortex-voice says, \"Don't sit down.\""
veo.audio.sfx: "page-turn 00:05; teacup-rim resonance 00:06;
  ceiling-ripple low chord 00:07."
veo.audio.ambient: "domestic-warm white-noise; vortex-hum 22 Hz
  faintly under."
pipeline:
  nb2_seed: 148005; veo_seed: 248005; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_vortex_r8_last_stable_room/
```

---

## §G.8 Generic Incursion — per-room first-encounter cutscenes (16)

Source: `apps/shared/incursions.ts:118–139`. Each `IncursionRoomDef`
gets one first-encounter cut (the moment the room is initially
revealed to the player). Length 6 s each (these are room-reveals,
not full beats — shorter Cat A). Cat A. SFX-driven, no music, ≤1
short VO.

Host_space: generic incursion room (palette per room kind).

Trait-lock per room kind:

| kind | palette | atmosphere |
|---|---|---|
| combat | `#2a2622 / #c4452a / #5fa8ff` | tactical-cool |
| card | `#1c1816 / #c8a05a / #6e2030` | duel-stage |
| puzzle | `#1a3550 / #5fa8ff / #c8a05a` | cipher-cyan |
| treasure | `#3a3025 / #c8a05a / #ff5a1a` | vault-warm |
| boss | `#0d0a08 / #c8a05a / #ff2a8a` | confrontation-dim |

### §G.8.1 `cs_incursion_drone_swarm_reveal` (combat)

```yaml
host_space: generic incursion combat-room
nb2_start.subject: "an 18 m corridor, two banks of overhead
  fluorescents flickering; at the far end, the silhouettes of a
  dozen rogue drones hover in disciplined formation; one drone's
  red eye-LED is the only definite light at the far end."
nb2_end.subject: "the drone formation has broken; three drones
  have peeled forward 4 m, eye-LEDs all now red-on; lead drone
  trails an exhaust plume."
veo.action: "0–3 s corridor settles; 3–5 s drone-formation breaks;
  5–6 s lead drones close, eye-LEDs cascade red."
veo.audio.dialogue: "none."
veo.audio.sfx: "drone-formation shift 00:04; eye-LED click cascade 00:05."
veo.audio.ambient: "fluorescent-buzz; corridor-resonance hum."
pipeline:
  nb2_seed: 149001; veo_seed: 249001; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_incursion_drone_swarm_reveal/
```

### §G.8.2 `cs_incursion_void_sentinels_reveal` (combat)

```yaml
host_space: generic incursion combat-room
nb2_start.subject: "a cavernous chamber 30 m wide, walls phasing
  with subtle reality-distortion; in three positions around the
  player, void-sentinels phase in and out of visibility — one
  fully visible, one half-resolved, one only an outline."
nb2_end.subject: "all three sentinels now fully visible and at
  their nearest position; weapons drawn; reality-distortion
  intensified."
veo.action: "0–3 s sentinels phase in pattern; 3–5 s sentinels
  resolve; 5–6 s weapons draw."
veo.audio.dialogue: "Sentinel says, \"Found.\""
veo.audio.sfx: "phase-in chord 00:03 / 00:04; weapon-draw rasp 00:05."
veo.audio.ambient: "reality-distortion sub-bass; vortex-violet hum."
pipeline:
  nb2_seed: 149002; veo_seed: 249002; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_incursion_void_sentinels_reveal/
```

### §G.8.3 `cs_incursion_chrono_raiders_reveal` (combat)

```yaml
notes: "time-displaced raiders from multiple eras (medieval, WWI,
  cyberpunk, far-future); each at slight time-phase offset.
  Palette tactical-cool. Audio: time-phase chimes 00:03; weapon
  draw 00:05."
veo.audio.dialogue: "Raider-leader says, \"Now is the time.\""
pipeline:
  nb2_seed: 149003; veo_seed: 249003; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_incursion_chrono_raiders_reveal/
```

### §G.8.4 `cs_incursion_flame_constructs_reveal` (combat)

```yaml
notes: "molten golems guarding an ancient forge; orange-rim
  glow from forge in mid-distance. Palette `#3a1a10 / #ff5a1a /
  #c8a05a`. Audio: forge-glow whoosh; golem-stone-step 00:04."
veo.audio.dialogue: "Construct-prime says, \"Forge defends.\""
pipeline:
  nb2_seed: 149004; veo_seed: 249004; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_incursion_flame_constructs_reveal/
```

### §G.8.5 `cs_incursion_shadow_lurkers_reveal` (combat)

```yaml
notes: "enemies striking from darkness; the room is 90% dark,
  one light-cone in centre; eyes-only visible at perimeter.
  Audio: breath-hiss 00:03; eye-blink cascade 00:05."
veo.audio.dialogue: "Lurker says, \"Don't look.\""
pipeline:
  nb2_seed: 149005; veo_seed: 249005; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_incursion_shadow_lurkers_reveal/
```

### §G.8.6 `cs_incursion_machine_cult_reveal` (combat)

```yaml
notes: "fanatical engineers; turret emplacements; 6 cultist-
  silhouettes in oil-stained robes around 4 turret-banks. Audio:
  turret-track whirr 00:04; cult-chant 00:00–00:06."
veo.audio.dialogue: "Cultist says, \"Machinery wills.\""
pipeline:
  nb2_seed: 149006; veo_seed: 249006; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_incursion_machine_cult_reveal/
```

### §G.8.7 `cs_incursion_card_trial_reveal` (card)

```yaml
host_space: generic incursion card-room
nb2_start.subject: "a duel-stage chamber with a single brass-inlaid
  Dischordia card-table at centre; the AI challenger sits across
  the table, robed and hooded; the table glows faintly amber.
  Palette duel-stage."
nb2_end.subject: "the AI deals first card face-up; the player's
  gloved hand rests at the table edge."
veo.action: "0–3 s chamber settles; 3–5 s AI gestures to deal;
  5–6 s first card lands face-up."
veo.audio.dialogue: "AI says, \"Trial. Sit.\""
veo.audio.sfx: "card-shuffle 00:03; card-land tap 00:05."
veo.audio.ambient: "duel-stage low resonance 4.0 s reverb."
pipeline:
  nb2_seed: 149007; veo_seed: 249007; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_incursion_card_trial_reveal/
```

### §G.8.8 `cs_incursion_card_gauntlet_reveal` (card)

```yaml
notes: "three AI challengers sit in succession around an extended
  card-table; each holds an opening hand. Audio: triple-shuffle
  cascade 00:03 / 00:04 / 00:05."
veo.audio.dialogue: "Lead AI says, \"Three decks. Once.\""
pipeline:
  nb2_seed: 149008; veo_seed: 249008; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_incursion_card_gauntlet_reveal/
```

### §G.8.9 `cs_incursion_cipher_lock_reveal` (puzzle)

```yaml
host_space: generic incursion puzzle-room
nb2_start.subject: "a 12×12 m chamber with a brass cipher-door at
  far wall; the door's dial-array (16 concentric brass rings)
  rotates slowly; cipher-cyan light from the door bathes the
  chamber. Palette cipher-cyan."
nb2_end.subject: "the player's gloved hand has touched the
  outermost ring; one ring-position has clicked into place."
veo.action: "0–3 s chamber settles; 3–5 s player approaches dial;
  5–6 s first ring-click."
veo.audio.dialogue: "Door-voice says, \"Decode.\""
veo.audio.sfx: "ring-rotation low whirr 00:00–00:08; ring-click 00:05."
veo.audio.ambient: "cipher-cyan resonance hum 22 Hz."
pipeline:
  nb2_seed: 149009; veo_seed: 249009; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_incursion_cipher_lock_reveal/
```

### §G.8.10 `cs_incursion_hacking_node_reveal` (puzzle)

```yaml
notes: "security-node terminal with cascading hex on screen;
  player's hands enter holographic input-field. Audio:
  keyboard-clatter 00:03–00:06; node-handshake chord 00:05."
veo.audio.dialogue: "Node-voice says, \"Breach point.\""
pipeline:
  nb2_seed: 149010; veo_seed: 249010; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_incursion_hacking_node_reveal/
```

### §G.8.11 `cs_incursion_sequence_trap_reveal` (puzzle)

```yaml
notes: "tile-floor trap; 64 tiles in 8×8 grid, half lit and half
  dark; first tile pulses to indicate sequence start. Audio: tile-
  pulse 00:04; sequence-warning chord 00:05."
veo.audio.dialogue: "Trap-voice says, \"In order.\""
pipeline:
  nb2_seed: 149011; veo_seed: 249011; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_incursion_sequence_trap_reveal/
```

### §G.8.12 `cs_incursion_hidden_cache_reveal` (treasure)

```yaml
host_space: generic incursion treasure-room
nb2_start.subject: "a vault-warm chamber; three loot-pedestals at
  centre, each glowing under spotlight (gold alloy, dream tokens,
  a sealed ring-case); player approaches at low light to bright
  centre."
nb2_end.subject: "the three pedestals' lights have all
  brightened; the player's hand hovers above the central
  pedestal."
veo.action: "0–3 s chamber settles, low-light entry; 3–5 s
  pedestals brighten; 5–6 s hand hovers."
veo.audio.dialogue: "none."
veo.audio.sfx: "pedestal-light cascade 00:04; vault-resonance 00:05."
veo.audio.ambient: "vault-warm hum, faint coin-clink rustle."
pipeline:
  nb2_seed: 149012; veo_seed: 249012; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_incursion_hidden_cache_reveal/
```

### §G.8.13 `cs_incursion_dreamers_vault_reveal` (treasure)

```yaml
notes: "vault filled with crystallized dreams; pale-blue glow,
  Dreamers-aesthetic crystals on shelves; centre-display holds
  a void-pendant. Audio: crystal-resonance chord 00:04."
veo.audio.dialogue: "Vault-voice says, \"Dream-glass.\""
pipeline:
  nb2_seed: 149013; veo_seed: 249013; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_incursion_dreamers_vault_reveal/
```

### §G.8.14 `cs_incursion_warden_reveal` (boss — mid)

```yaml
host_space: generic incursion boss-room (mid)
nb2_start.subject: "a 24 m diameter chamber; the Warden — a hooded
  guardian-figure with a scarred shield-arm — stands at the far
  end on a raised dais; warden-plate armour glints under
  confrontation-dim lighting."
nb2_end.subject: "Warden has stepped 0.4 m forward; shield-arm
  raised."
veo.action: "0–3 s Warden establishes; 3–5 s Warden meets
  player's eye-line; 5–6 s shield-raise."
veo.audio.dialogue: "Warden says, \"This is mine.\""
veo.audio.sfx: "shield-raise rasp 00:05; dais-step thud 00:04."
veo.audio.ambient: "boss-room reverb 4.6 s; sub-bass 12 Hz."
pipeline:
  nb2_seed: 149014; veo_seed: 249014; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_incursion_warden_reveal/
```

### §G.8.15 `cs_incursion_architect_reveal` (boss — final)

```yaml
host_space: generic incursion boss-room (final)
nb2_start.subject: "a 30 m diameter chamber; the Architect (final
  boss of the generic incursion variant) sits at a draftsman's
  table at the chamber's far end; behind them a model-of-the-
  Ark sits half-disassembled; chamber lit only by drafting-lamp
  pool."
nb2_end.subject: "Architect lifts head; their drafting-pencil pauses
  mid-stroke; eye-line locks on player."
veo.action: "0–3 s drafting-table close; 3–5 s player enters
  Architect's pool of light; 5–6 s pencil pauses, eye-line lock."
veo.audio.dialogue: "Architect says, \"Show me your blueprint.\""
veo.audio.sfx: "pencil-pause tick 00:05; chair-creak 00:04."
veo.audio.ambient: "drafting-lamp ballast hum; boss-room reverb."
pipeline:
  nb2_seed: 149015; veo_seed: 249015;
  vo_manifest_ref: apps/shared/theArchitectVoManifest.json#L<TBD>;
  cdn_target: cdn/client-public/cutscenes/cs_incursion_architect_reveal/
  notes: "this final-boss Architect cut shares VO manifest with
    boss-arena Architect (§G.3.5) — pipeline must select the
    correct take per encounter context."
```

### §G.8.16 `cs_incursion_dischordia_trial_reveal` (additional card variant)

(Reserved for future card-variant; placeholder to maintain count
parity at 16 generic incursion rooms.)

```yaml
notes: "placeholder — final 16th room variant if `incursions.ts`
  ROOM_POOL extends. If kept at current 15 rooms, drop §G.8.16
  in audit."
pipeline:
  nb2_seed: 149016; veo_seed: 249016; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_incursion_dischordia_trial_reveal/
```

---

## §G.B audit (will be re-checked at §G.F)

Cutscenes added in this sub-phase: **69**
- §G.5 Trade Empire: 28
- §G.6 Tower Defense: 20
- §G.7 Vortex Incursion: 5
- §G.8 Generic Incursion: 16

Outstanding TBDs (resolved in §G.F audit):
- TD map names need cross-cut sign-off from Defense Command
  designer.
- §G.8.16 placeholder may collapse to 15 if `ROOM_POOL` stays
  static.

---

## §G.9 Casino — game-table opens + big-win/loss (6)

Source: `apps/shared/casinoGames.ts:59–100`. HB7 Degenerate's Casino
already has open/close cuts in `_PRODUCTION_CROSS_CUT.md`. Three
game-tables get a per-table open + a per-table outcome
(big-win / catastrophic-loss).

Host_space: HB7 Degenerate's Casino floor (§3.12 HB7 destination).

Trait-lock: 2200K neon over crimson velvet; cocktail-haze
volumetrics z+0.6–2.0 m; Kodak Vision3 500T; palette
`#3a0d10 / #ffb84a / #5fa8ff`; ambient slot-jingle bed -32 dB,
distant chip-clatter, smoky bar conversation.

### §G.9.1 `cs_casino_void_slots_first_pull` (Void Slots open)

```yaml
host_space: HB7 Casino floor (Void Slots wing)
nb2_start.subject: "a single Void Slots machine — brass-and-glass
  cabinet 1.6 m tall, three reel-windows showing the SLOT_REEL
  glyphs (degen / void_crystal / dream / skull / star / void)
  in faceted glass; the machine's pull-lever is brass with a
  worn handle; player's gloved hand rests on the lever in
  foreground."
nb2_end.subject: "the lever has been pulled to its bottom
  position; reel-windows are spinning in motion-blur; the
  machine's jackpot-LED panel above pulses in anticipation."
veo.action: "0–3 s machine in foreground, lever ready; 3–5 s
  player's hand pulls lever; 5–8 s reels spin, jackpot-LED
  pulses."
veo.audio.dialogue: "Pit-boss says, \"Last call. In.\""
veo.audio.sfx: "lever-pull mechanical thunk 00:04; reel-spin
  whir 00:04–00:08; jackpot-LED tone-up 00:06."
veo.audio.ambient: "casino floor crowd-murmur, slot-jingle bed,
  cocktail-glass clinks."
pipeline:
  nb2_seed: 150001; veo_seed: 250001; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_casino_void_slots_first_pull/
```

### §G.9.2 `cs_casino_void_slots_outcome` (jackpot / wipeout — both variants)

```yaml
host_space: HB7 Casino floor (Void Slots wing)
nb2_start.subject (jackpot): "reels have settled on three 'degen'
  glyphs; jackpot-LED panel solid-on; gold-coin shower mid-cascade
  from the machine's payout chute."
nb2_start.subject (wipeout): "reels have settled on three 'void'
  glyphs (the wipeout state); jackpot-LED panel dark; the
  machine's payout-chute is closed and a credit-stripped
  receipt has just printed."
nb2_end.subject (jackpot): "coin-shower has piled at the
  player's feet; pit-boss approaches with celebratory bottle."
nb2_end.subject (wipeout): "the credit-stripped receipt floats
  to the floor; player's gloved hand is open-palm down on the
  machine's edge."
veo.action (jackpot): "0–3 s reels stop on triple-degen; 3–5 s
  jackpot fanfare cascades; 5–8 s coin-shower piles."
veo.action (wipeout): "0–3 s reels stop on triple-void; 3–5 s
  silence; 5–8 s receipt prints, drops to floor."
veo.audio.dialogue (jackpot): "Pit-boss says, \"Triple-degen.
  Bottle's on me.\""
veo.audio.dialogue (wipeout): "Pit-boss says, \"Wiped. Sorry, friend.\""
veo.audio.sfx (jackpot): "jackpot-fanfare 00:03; coin-shower 00:05–00:08."
veo.audio.sfx (wipeout): "wipeout-tone 00:03; receipt-print 00:05;
  receipt-fall whisper 00:07."
veo.audio.ambient (both): "casino floor; ambient un-changed."
pipeline:
  nb2_seed: 150002; veo_seed: 250002; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_casino_void_slots_outcome/
  notes: "two end-frame variants — `end_jackpot.png` and
    `end_wipeout.png` selected at runtime by outcome."
```

### §G.9.3 `cs_casino_entropy_dice_first_throw` (Entropy Dice open)

```yaml
host_space: HB7 Casino floor (Entropy Dice pit)
nb2_start.subject: "a felt-topped dice pit — 2 m diameter, brass-
  rim, two ivory dice in player's foreground gloved hand;
  croupier opposite holds the betting board with three predict-
  options (over / under / exact)."
nb2_end.subject: "dice are mid-throw, both still in air at z+0.6 m;
  croupier's hand on the betting board is settled on the
  player's chosen prediction marker."
veo.action: "0–3 s pit settles; 3–5 s player's hand winds back;
  5–8 s dice released in slow-arc, mid-air freeze on last_frame."
veo.audio.dialogue: "Croupier says, \"Throw it.\""
veo.audio.sfx: "dice-cup rattle 00:03; release-toss whoosh 00:05;
  dice-tumble in air 00:06–00:08."
veo.audio.ambient: "pit murmur, cocktail-glass clinks."
pipeline:
  nb2_seed: 150003; veo_seed: 250003; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_casino_entropy_dice_first_throw/
```

### §G.9.4 `cs_casino_entropy_dice_outcome` (win / loss)

```yaml
notes: "two end-frame variants. Win: dice settled showing
  matching prediction, croupier sliding chip-stack toward
  player. Loss: dice settled showing wrong prediction, croupier
  raking chips away. Audio: dice-settle clack 00:03; chip-slide
  rasp 00:06."
veo.audio.dialogue (win): "Croupier says, \"Yours.\""
veo.audio.dialogue (loss): "Croupier says, \"House.\""
pipeline:
  nb2_seed: 150004; veo_seed: 250004; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_casino_entropy_dice_outcome/
```

### §G.9.5 `cs_casino_pazaak_tournament_first_seat` (Pazaak open)

```yaml
host_space: HB7 Casino (Pazaak Tournament chamber)
nb2_start.subject: "a tournament-grade Pazaak table — felt-green
  with brass card-channels; opponent across the table is a
  named-NPC card-mechanic in dealer's vest with jeweled cufflinks;
  player's gloved hands rest at table edge; tournament-bracket
  display visible upper-frame as a brass plaque."
nb2_end.subject: "the dealer has dealt the opening side-deck
  cards face-up; player's hand is reaching for the cut-card."
veo.action: "0–3 s table settles; 3–5 s dealer deals opening;
  5–8 s player reaches for cut-card."
veo.audio.dialogue: "Dealer says, \"Tournament Pazaak. Cut.\""
veo.audio.sfx: "card-deal x 4 from 00:03 to 00:05; cut-card-tap 00:07."
veo.audio.ambient: "tournament-chamber hush, faint orchestra
  warm-up far upstage at -42 dB."
pipeline:
  nb2_seed: 150005; veo_seed: 250005;
  vo_manifest_ref: apps/shared/pazaakDealerVoManifest.json#L<TBD>;
  cdn_target: cdn/client-public/cutscenes/cs_casino_pazaak_tournament_first_seat/
```

### §G.9.6 `cs_casino_pazaak_tournament_outcome` (championship / elimination)

```yaml
notes: "two end-frame variants. Championship: tournament-bracket
  resolved with player's name at apex; dealer offering brass
  trophy. Elimination: bracket showing player's name with red
  X; dealer collecting cards. Audio: trophy-rim chime 00:07
  (championship) OR card-collect rasp 00:05 (elimination)."
veo.audio.dialogue (championship): "Dealer says, \"Champion.
  Earned.\""
veo.audio.dialogue (elimination): "Dealer says, \"Out. Drink?\""
pipeline:
  nb2_seed: 150006; veo_seed: 250006; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_casino_pazaak_tournament_outcome/
```

---

## §G.10 Quiz Show Palimpsest — Q7–Q12 round closes (6)

Source: `_PRODUCTION_DESTINATIONS.md` §E.5 + `_PRODUCTION_CROSS_CUT.md`
§F.1.A.2 (Q1–Q5 covered; Velkraal→Brel host succession at Q6
covered). Q7–Q12 round closes still needed.

Host_space: HB3 Quiz Show Studio (§E.5). Brel hosts Q6–Q12 (post-
succession).

Trait-lock: TV-studio key-grid 5600K + saturation-pushed bg-cyc;
16:9 broadcast safe; Kodak Vision3 250D; palette
`#ff2a8a / #5fa8ff / #ffd166`. SFX: studio-applause loop
-26 dB, broadcast-clock tick at 1 Hz, contestant-buzzer.

Each round-close lands on Brel announcing the next round's
category, contestant podium-light state-shift, and a single-
sentence VO from Brel.

### §G.10.1 `cs_quiz_q7_close` (Round 7 → Round 8 transition)

```yaml
host_space: HB3 Quiz Show studio main stage
nb2_start.subject: "the Quiz Show stage at end-of-Q7; Brel (TV-
  show host, late-Velkraal-replacement, slick-suit and
  microphone) stands at the centre podium, holding the next-
  category card up for the crowd; the contestant podiums to
  Brel's left have one survivor lit, three eliminated (red
  buzzer-LED off)."
nb2_end.subject: "Brel's category-card has flipped to face the
  camera, revealing the Q8 category title in 21-character
  diegetic text on broadcast-safe red banner."
veo.action: "0–3 s Brel reveals card to crowd; 3–5 s slow swivel
  to camera; 5–8 s card flips to camera-facing reveal."
veo.audio.dialogue: "Brel says, \"Round eight: dread.\""
veo.audio.sfx: "applause-burst 00:03; card-flip 00:06; broadcast-
  clock tick at 1 Hz throughout."
veo.audio.ambient: "studio-light hum 5600K ballast; crowd-applause
  -26 dB bed."
pipeline:
  nb2_seed: 151001; veo_seed: 251001;
  vo_manifest_ref: apps/shared/brelVoManifest.json#L<TBD>;
  cdn_target: cdn/client-public/cutscenes/cs_quiz_q7_close/
  notes: "diegetic Q8 category text 'ROUND 8: DREAD' is 14
    chars, NB2 text-rendering-safe."
```

### §G.10.2 `cs_quiz_q8_close` (Round 8 → Round 9)

```yaml
notes: "Q9 category 'ROUND 9: DEBT' (12 chars). Brel's tone has
  begun to slip — there is one frame at 00:05 where his smile
  is wrong. Audio: faint static-burst 00:05 timed with the
  smile-glitch."
veo.audio.dialogue: "Brel says, \"Round nine: debt.\""
pipeline:
  nb2_seed: 151002; veo_seed: 251002;
  vo_manifest_ref: apps/shared/brelVoManifest.json#L<TBD>;
  cdn_target: cdn/client-public/cutscenes/cs_quiz_q8_close/
```

### §G.10.3 `cs_quiz_q9_close` (Round 9 → Round 10)

```yaml
notes: "Q10 category 'ROUND 10: DOUBT' (14 chars). Two of the
  three eliminated podiums have started to dim further; one
  contestant-silhouette is now barely visible. Audio: contestant-
  podium dim-down hum 00:06."
veo.audio.dialogue: "Brel says, \"Round ten: doubt.\""
pipeline:
  nb2_seed: 151003; veo_seed: 251003;
  vo_manifest_ref: apps/shared/brelVoManifest.json#L<TBD>;
  cdn_target: cdn/client-public/cutscenes/cs_quiz_q9_close/
```

### §G.10.4 `cs_quiz_q10_close` (Round 10 → Round 11)

```yaml
notes: "Q11 category 'ROUND 11: DUST' (13 chars). Brel begins to
  fragment — his outline has a 0.06 s ghost-frame offset; bg-cyc
  saturation pushes harder. Audio: crowd-applause-bed inverts
  briefly to a low chord at 00:07."
veo.audio.dialogue: "Brel says, \"Round eleven: dust.\""
pipeline:
  nb2_seed: 151004; veo_seed: 251004;
  vo_manifest_ref: apps/shared/brelVoManifest.json#L<TBD>;
  cdn_target: cdn/client-public/cutscenes/cs_quiz_q10_close/
```

### §G.10.5 `cs_quiz_q11_close` (Round 11 → Round 12 — final round)

```yaml
notes: "Q12 category 'ROUND 12: DEAD' (13 chars). Brel's ghost-
  frame offset widens to 0.2 s; the studio-light grid above
  begins to flicker; broadcast-clock now ticks faster (1.4 Hz).
  Audio: light-grid flicker 00:04; ghost-frame echo 00:07."
veo.audio.dialogue: "Brel says, \"Final round: dead.\""
pipeline:
  nb2_seed: 151005; veo_seed: 251005;
  vo_manifest_ref: apps/shared/brelVoManifest.json#L<TBD>;
  cdn_target: cdn/client-public/cutscenes/cs_quiz_q11_close/
```

### §G.10.6 `cs_quiz_q12_close` (final close — TV signs off)

```yaml
host_space: HB3 Quiz Show studio main stage
nb2_start.subject: "the studio at end-of-Q12; Brel stands alone
  on the centre podium; all three contestant podiums are dim;
  the crowd-stalls are empty; bg-cyc saturation has dropped to
  near-monochrome; the broadcast-clock has stopped at 00:00:00."
nb2_end.subject: "Brel raises a hand to the camera; his ghost-
  frames have separated into 5 layered offsets; the studio-
  lights above all dim simultaneously; broadcast-clock
  vanishes."
veo.action: "0–3 s Brel alone on stage; 3–5 s ghost-frames
  separate; 5–8 s lights dim, hand raised, broadcast-clock
  vanishes."
veo.audio.dialogue: "Brel says, \"Goodnight. Until.\""
veo.audio.sfx: "studio-light dim cascade 00:06; broadcast-clock
  silence 00:07; sign-off carrier-tone 00:08."
veo.audio.ambient: "crowd-applause-bed has gone silent; only
  studio-light ballast hum remains, then dies at 00:07."
pipeline:
  nb2_seed: 151006; veo_seed: 251006;
  vo_manifest_ref: apps/shared/brelVoManifest.json#L<TBD>;
  cdn_target: cdn/client-public/cutscenes/cs_quiz_q12_close/
  notes: "this is the canonical final-round sign-off; HB3
    transit-close cutscene picks up from the carrier-tone."
```

---

## §G.11 Matrix Schools — per-episode opens (24)

Source: `apps/shared/celebrationSchoolEpisodes.ts:23–223` and
`apps/shared/mechronisAcademyEpisodes.ts:26–213`. Each school has
12 episodes; one **episode-open** Cat-A cutscene per episode (6 s
each, since the episode itself opens with a longer
`MatrixSchoolEpisodePage` in-engine intro — these cuts are
punctuation-only).

Host_space: §E.x via HB1 (Celebration School courtyard) for
celebration episodes; §E.x via HB12 (Mechronis Academy main
hallway) for mechronis episodes.

Trait-lock — Celebration School: golden-hour soft 4500K; primary-
colour signage; Vision3 250D; palette `#f4d35e / #6cc24a / #5fa8ff`.
SFX: schoolyard murmur, distant bell.

Trait-lock — Mechronis Academy: blue-cold 6500K fluoro; surveillance-
grey walls; Vision3 250D underexposed -0.5; palette
`#3a4a5a / #c4d4e4 / #ff4a4a`. SFX: ventilation hum, surveillance-
camera servo whirr.

### §G.11.1 — §G.11.12 Celebration School per-episode opens (12)

| § | cs_id | episode | beat (one-line) | VO | sfx hook |
|---|---|---|---|---|---|
| §G.11.1 | `cs_celebration_c1_the_watch_open` | C1 The Watch | Bernardo and Lady Malkia see the King's ghost on the Castle ramparts | Bernardo: "Did you see it?" | rampart-wind 00:03; ghost-shimmer chord 00:05 |
| §G.11.2 | `cs_celebration_c2_first_day_open` | C2 First Day | Artist Prince enrolls; Vernon mocks at the gates | Artist Prince: "I am here." | school-bell 00:04; gate-creak 00:05 |
| §G.11.3 | `cs_celebration_c3_chess_class_open` | C3 Chess Class | Game Master teaches first chess class | Game Master: "Pawn first." | chalk-tap 00:03; chess-piece-place 00:05 |
| §G.11.4 | `cs_celebration_c4_under_floor_open` | C4 Under the Floor | Conspiracy clue under floorboards | Bernardo: "Look down." | floor-creak 00:03; clue-glint 00:05 |
| §G.11.5 | `cs_celebration_c5_banner_glitches_open` | C5 Banner Glitches | Castle banner flickers between two states | Lady Malkia: "It glitched." | banner-cloth-shift 00:04; glitch-crackle 00:06 |
| §G.11.6 | `cs_celebration_c6_dueling_court_open` | C6 Dueling Court | First card duel at the dueling court | Artist Prince: "Stakes are real." | duel-bell 00:03; card-shuffle 00:05 |
| §G.11.7 | `cs_celebration_c7_patrons_summons_open` | C7 Patron's Summons | The Patron summons the Prince | The Patron: "Come up." | summons-chime 00:03; chamber-door-open 00:05 |
| §G.11.8 | `cs_celebration_c8_ghost_in_hall_open` | C8 Ghost in the Hall | The Ghost speaks, mid-corridor | The Ghost: "My crown." | hall-echo step 00:03; ghost-whisper 00:05 |
| §G.11.9 | `cs_celebration_c9_match_open` | C9 The Match | Tournament card-match begins | Game Master: "Final hand." | tournament-bell 00:03; crowd-hush 00:05 |
| §G.11.10 | `cs_celebration_c10_arks_rise_open` | C10 The Arks Rise | The Arks launch; school watches sky | Lady Malkia: "They go up." | engine-rumble 00:03; sky-roar 00:06 |
| §G.11.11 | `cs_celebration_c11_uncles_verdict_open` | C11 Uncle's Verdict | The Uncle pronounces verdict on Prince | The Uncle: "You will return." | gavel-strike 00:03; verdict-echo 00:05 |
| §G.11.12 | `cs_celebration_c12_last_good_day_open` | C12 The Last Good Day | The day before the burning | Artist Prince: "Sun. One more." | warm-bell 00:03; child-laughter -38 dB 00:00–00:06 |

Each block (compact form):

```yaml
host_space: §E.x Celebration School (per-episode set-piece zone)
nb2_start.subject: <episode beat one-line> with the named POV
  character at frame-centre, golden-hour 4500K key, schoolyard
  primary-colours visible behind, Celebration School trait-lock.
nb2_end.subject: <episode beat resolved>; player's gloved hand at
  frame edge.
veo.cinematography: medium close-up, slow push-in 0.3 m, 50mm,
  FPV trait-lock.
veo.action: 0–3 s scene establishes; 3–5 s POV character
  delivers VO; 5–6 s sfx hook lands.
veo.audio.dialogue: <table column>
veo.audio.sfx: <table column>
veo.audio.ambient: schoolyard murmur, distant bell.
pipeline:
  nb2_seed: 152001..152012; veo_seed: 252001..252012;
  vo_manifest_ref: apps/shared/<characterVoManifest.json>#L<TBD>;
  cdn_target: cdn/client-public/cutscenes/<cs_id>/
```

Per-episode VO manifests:
- C1 — `apps/shared/bernardoVoManifest.json`
- C2, C6, C12 — `apps/shared/artistPrinceVoManifest.json`
- C3, C9 — `apps/shared/gameMasterVoManifest.json`
- C4 — `apps/shared/bernardoVoManifest.json`
- C5, C10 — `apps/shared/ladyMalkiaVoManifest.json`
- C7 — `apps/shared/thePatronVoManifest.json`
- C8 — `apps/shared/theGhostVoManifest.json`
- C11 — `apps/shared/theUncleVoManifest.json`

### §G.11.13 — §G.11.24 Mechronis Academy per-episode opens (12)

| § | cs_id | episode | beat (one-line) | VO | sfx hook |
|---|---|---|---|---|---|
| §G.11.13 | `cs_mechronis_m1_choric_drill_open` | M1 Choric Compliance Drill | Drill-sergeant calls roll; cohort recites in unison | Sergeant: "Begin compliance." | drill-whistle 00:03; chorus-recite 00:05 |
| §G.11.14 | `cs_mechronis_m2_applied_surveillance_open` | M2 Applied Surveillance | Class taught how to watch a mark | Instructor: "Track it." | camera-servo whirr 00:03; mark-acquired chime 00:05 |
| §G.11.15 | `cs_mechronis_m3_trade_exercise_open` | M3 Trade Exercise | Student-table mock-trade negotiation | Trader-instructor: "Negotiate hard." | abacus-bead-snap 00:03; gavel-tap 00:05 |
| §G.11.16 | `cs_mechronis_m4_patrons_game_open` | M4 Patron's Game | Patron arrives unannounced | The Patron: "Surprise lesson." | corridor-step echo 00:03; door-thud 00:05 |
| §G.11.17 | `cs_mechronis_m5_necromancers_lecture_open` | M5 Necromancer's Lecture | Necromancer teaches death-coding | The Necromancer: "Dying is data." | bone-tap on lectern 00:03; chalk-skritch 00:05 |
| §G.11.18 | `cs_mechronis_m6_antiquarian_visits_open` | M6 Antiquarian Visits | The Antiquarian inspects the cohort | Antiquarian: "Show me yours." | leather-glove flex 00:03; ledger-page 00:05 |
| §G.11.19 | `cs_mechronis_m7_trade_practicum_open` | M7 Trade Practicum | Field exercise on a mock-station | Trader-instructor: "On the floor." | comm-buzz 00:03; floor-bell 00:05 |
| §G.11.20 | `cs_mechronis_m8_apprentice_trial_open` | M8 Apprentice Trial | Student is tested individually | Examiner: "Defend the answer." | exam-bell 00:03; clock-tick 1 Hz 00:00–00:06 |
| §G.11.21 | `cs_mechronis_m9_oracle_counterclaim_open` | M9 Oracle's Counterclaim | The Oracle disputes a doctrine | The Oracle: "Wrong, again." | oracle-chime 00:03; doctrine-paper-tear 00:05 |
| §G.11.22 | `cs_mechronis_m10_final_exam_open` | M10 Final Exam | The cohort sits final exam | Examiner: "Begin." | exam-paper-handout 00:03; pen-on-paper 00:05 |
| §G.11.23 | `cs_mechronis_m11_patrons_true_face_open` | M11 Patron's True Face | Patron's mask drops mid-lecture | The Patron: "This is me." | mask-clatter on floor 00:04; gasp-cohort 00:05 |
| §G.11.24 | `cs_mechronis_m12_diploma_that_isnt_open` | M12 Diploma That Isn't | Graduation ceremony reveals the diploma is blank | Examiner: "Sign it. Anyway." | ceremony-fanfare 00:03; quill-on-blank-paper 00:05 |

Each block (compact form):

```yaml
host_space: §E.x Mechronis Academy (per-episode set-piece zone)
nb2_start.subject: <episode beat one-line> with the named POV
  character at frame-centre, blue-cold 6500K fluoro key,
  surveillance-grey walls behind, Mechronis trait-lock.
nb2_end.subject: <episode beat resolved>; player's gloved hand at
  frame edge.
veo.cinematography: medium close-up, slow push-in 0.3 m, 50mm,
  FPV trait-lock.
veo.action: 0–3 s scene establishes; 3–5 s POV character
  delivers VO; 5–6 s sfx hook lands.
veo.audio.dialogue: <table column>
veo.audio.sfx: <table column>
veo.audio.ambient: ventilation hum 60 Hz; surveillance-camera
  servo whirr.
pipeline:
  nb2_seed: 152013..152024; veo_seed: 252013..252024;
  vo_manifest_ref: apps/shared/<characterVoManifest.json>#L<TBD>;
  cdn_target: cdn/client-public/cutscenes/<cs_id>/
```

Per-episode VO manifests:
- M1, M3, M5, M6, M7, M8, M9, M10 — per character listed in
  table column (Sergeant, Trader-instructor, The Necromancer,
  Antiquarian, Trader-instructor, Examiner, The Oracle, Examiner).
- M2 — `apps/shared/mechronisInstructorVoManifest.json`
- M4, M11 — `apps/shared/thePatronVoManifest.json`
- M12 — `apps/shared/mechronisExaminerVoManifest.json`

### §G.11 audit notes

- Where a character appears in multiple episodes (Patron in C7
  + M4 + M11; Game Master in C3 + C9; Necromancer in M5 +
  boss-arena §G.3.3; Architect in §G.3.5 + §G.8.15; Antiquarian
  in M6 + lore tie-ins), the same VO manifest is referenced.
  Audio post selects the correct take per cutscene context using
  the manifest's `lineId` field (manifest schema unchanged from
  Phase D).
- All 24 episode opens are 6 s per §3.1 punctuation-cutscene
  guidance for non-narrative-load-bearing transitions; longer
  episode in-engine intros are out of scope here.

---

## §G.C audit (will be re-checked at §G.F)

Cutscenes added in this sub-phase: **36**
- §G.9 Casino: 6
- §G.10 Quiz Show Q7–Q12: 6
- §G.11 Matrix Schools: 24

Cumulative coverage after G.A + G.B + G.C: **150 cutscenes**.

Outstanding TBDs (resolved in §G.F audit):
- VO manifest line numbers for: Brel, Pazaak Dealer, Pit-boss,
  Croupier, Sergeant, Trader-instructor, Examiner, Oracle,
  Mechronis-instructor, Mechronis-Examiner.
- Quiz Show category-text rendering: each diegetic 12–14 char
  string is NB2 text-rendering-safe; verify rendering quality on
  first generation pass.
- Matrix Schools per-episode set-piece zones (`§E.x via HB1` /
  `§E.x via HB12`) need explicit §E reference in destinations
  doc — currently rolled into Hellbox-destination spec.

---

## §G.12 RETRO — narrative cutscene NB2 + Veo prompts (68)

Retroactively adds NB2 still + Veo 3.1 video prompts to the
narrative cutscenes already specced in `_PRODUCTION_CROSS_CUT.md`.
The §3.1 spine (camera_spawn, head_motion, sfx_track, vo_line,
trigger, recurrence) is **unchanged** and lives in CROSS_CUT.md;
the blocks below are additive.

Every retro block uses §G.0 framework (canonical FPV trait-lock,
canonical negative-prompt, model spec) and references its
CROSS_CUT.md line by xref.

### §G.12.A Shipped narrative cutscenes (5)

#### `cs_awakening`
- xref: _PRODUCTION_CROSS_CUT.md §F.1.A.1 L68

```yaml
nb2_start:
  reference_images:
    - cdn/client-public/art/refs/cryo_bay_pod_zero.png
  prompt: |
    SUBJECT: the inside of cryo-pod zero, viewed from the
      reclined occupant's eye-line; frosted-glass canopy 0.4 m
      above the eyes, faint amber pod-warning-LED pulsing in
      the upper-right corner of the canopy frame; cryo-fog
      obscuring the lower 30% of view; crystalline frost-pattern
      etched on the glass.
    COMPOSITION: extreme close-up, FPV from inside the pod;
      reclined avatar eye-bone (parametric small/medium/tall);
      35mm; deep DOF on canopy with frost; pod-rim faintly
      visible at frame edges in shadow.
    LIGHTING/CAMERA: 4800K cold-stark canopy backlight + 6500K
      faint blue rim from emergency-LED grid above pod array;
      single amber 1800K pulse-LED upper-right; volumetric cryo-
      fog z+0–0.4 m; Kodak Vision3 500T pushed +1; cold-stark
      Cryo Bay palette `#1f3a4d / #d6e1ea / #ffd166`.
    STYLE: claustrophobic awakening still; frost-detail near-
      microscopic; institutional medical aesthetic; chilled
      emergency atmosphere.
    CONSTRAINTS: <NB2_CONSTRAINTS_BASE>; <FPV_LOCK_PHRASE_NB2>;
      reclined avatar eye-line (small 1.20 m → eye at z+0 inside
      pod; medium 1.65 m → eye at z+0; tall 1.95 m → eye at z+0);
      no third-person of player visible.
    Output 4K, 21:9.

nb2_end:
  prompt: |
    SUBJECT: the cryo-bay ceiling visible above; pod-edge in
      lower frame at chest-level; first-person upright posture;
      cryo-fog still venting from below pod-rim; ceiling-fan
      hum-grid, single amber pulse-LED still visible at the
      pod's edge.
    COMPOSITION: medium-wide upright FPV; 35mm; eye-level
      +1.65 m (parametric); deep DOF with ceiling-grid in focus.
    LIGHTING/CAMERA: 5400K Cryo Bay overhead grid; 6500K rim
      from emergency-LEDs; cryo-fog z+0–1.2 m drift.
    STYLE: emergence still; cold-stark institutional.
    CONSTRAINTS: <standard>; FPV trait-lock.
    Output 4K, 21:9.

veo:
  first_frame: cdn/client-public/cutscenes/cs_awakening/start.png
  last_frame: cdn/client-public/cutscenes/cs_awakening/end.png
  reference_images:
    - cdn/client-public/art/refs/cryo_bay_pod_zero.png
  prompt: |
    CINEMATOGRAPHY: extreme close-up FPV inside pod, slow
      forward dolly +0.6 m over 12 s as canopy fractures and
      glass falls away, 35mm, FPV trait-lock; only player's
      hands enter from below at 6 s.
    SUBJECT: the cryo-pod canopy from inside, frost-etched
      glass, amber pulse-LED.
    ACTION: 0–4 s locked frosted-glass POV; 4.5 s pod-glass
      cracks; 6 s player's hands enter frame from below pushing
      glass; 8 s slow dolly forward as glass falls away; 10 s
      head-tilt up to ceiling; 12 s eyes adjust to light, lands
      on last_frame.
    CONTEXT: Cryo Bay, pod zero, mid-Act-0 awakening.
    STYLE & AMBIANCE: cold-stark institutional; Kodak Vision3
      500T pushed +1.
    AUDIO:
      Dialogue: none.
      SFX: pod-vital-monitor beep 00:00; glass-fracture crack
        00:04.5; glass-shatter 00:06; cryo-fog-vent hiss 00:08;
        ceiling-fan hum begins 00:10.
      Ambient noise: Cryo Bay sub-bass; emergency-LED ballast hum.
      Score: none.
    [00:00–00:04] frosted-glass POV holds, vital-monitor beeps.
    [00:04–00:08] glass cracks, hands push, dolly forward.
    [00:08–00:12] head tilts up, ceiling resolves, lands on
      last_frame.
  duration_seconds: 12   # stitched 8+4
  notes: "12s stitched as 8s clip_a (0–8) + 4s clip_b (8–12)
    with last_frame_a == first_frame_b at the 8-second mark."

pipeline:
  nb2_seed: 153001; veo_seed: 253001; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_awakening/
```

#### `cs_first_human_contact`
- xref: _PRODUCTION_CROSS_CUT.md §F.1.A.1 L80

```yaml
nb2_start.subject: "the Comms Array frequency-wall in §A.5; 12-row
  vertical bank of frequency-indicator strips, dim-amber back-
  lighting; the 52.7 MHz row is dim-pulsing; the rest are static
  cold-blue; cabinet brass face-plates show scuffs; one chair
  visible at frame-right (player's station)."
nb2_end.subject: "the 52.7 MHz indicator-strip is at full
  brightness; the player's gloved hand reaches toward the wall in
  lower-frame, fingertip 0.05 m from the indicator; cabinet has
  warmed to amber overall."
veo.action: "0–3 s frequency-wall in low light; 3 s carrier-wave
  fade-in; 5 s indicator pulses brighter; 7 s carrier sharpens;
  8 s indicator at full brightness, hand reaching."
veo.audio.dialogue: "Substrate-Human voice says, \"I am here.\""
veo.audio.sfx: "comms-static low 00:00; carrier-wave fade-in 00:03;
  human-voice fragment 00:05; carrier sharpens 00:07."
veo.audio.ambient: "Comms Array ventilation; ballast-hum low."
pipeline:
  nb2_seed: 153002; veo_seed: 253002;
  vo_manifest_ref: apps/shared/substrateHumanVoManifest.json#L<TBD>;
  cdn_target: cdn/client-public/cutscenes/cs_first_human_contact/
```

#### `cs_elaras_memory_recovery`
- xref: §F.1.A.1 L92

```yaml
nb2_start.subject: "the Med Bay autoclave shelf in §A.2; player's
  gloved hands hold a memory-shard (4 cm hexagonal crystal) at
  chest-height; shard emits faint warm light revealing a
  fragment of Elara's silhouette inside the crystal."
nb2_end.subject: "Elara's full hologram has materialised 0.4 m to
  the player's left, faint and translucent; she is in mid-breath;
  the shard in player's palm is now dim and cooling."
veo.action: "0 s shard-hum begins; 3 s shard warm-pulse; 7 s
  memory-recall chord, examining hand tilt; 9 s hologram-
  materialise warble; 11 s Elara's first half-breath."
veo.audio.dialogue: "Elara says, \"Wait. I remember.\""
veo.audio.sfx: "shard-hum 00:00; shard-warm-pulse 00:03; memory-
  recall chord 00:07; hologram-warble 00:09; half-breath 00:11."
veo.audio.ambient: "Med Bay clinical-cold; autoclave thermal tick."
pipeline:
  nb2_seed: 153003; veo_seed: 253003;
  vo_manifest_ref: apps/shared/elaraVoManifest.json#L<TBD>;
  cdn_target: cdn/client-public/cutscenes/cs_elaras_memory_recovery/
  notes: "11s clip — runs as full 8s + 3s stitched short.";
```

#### `cs_breaking_point`
- xref: §F.1.A.1 L104

```yaml
nb2_start.subject: "the reactor observation railing in §A.4
  Engineering Bay; reactor core pulsing in regular sub-bass rhythm
  visible through observation glass at frame-centre; conspiracy-
  board barely visible upper-left periphery showing 43↔44 flicker."
nb2_end.subject: "reactor warning-LED panel red and solid;
  conspiracy-board flickering harder; player's gloved hands grip
  the railing in lower frame, knuckles visible and pale."
veo.action: "0–4 s forward dolly +1.20 m, reactor in regular
  rhythm; 4–6 s freeze, sub-bass goes off-rhythm; 7 s sharp pan-
  left 30° to conspiracy-board; 10 s back to centre, warning-LED
  click-on; 11 s tilt-up to LED panel; 12 s reactor-strain groan."
veo.audio.dialogue: "none."
veo.audio.sfx: "reactor-hum 00:00; sub-bass off-rhythm 00:04;
  conspiracy-board flicker electric crack 00:07; warning-LED click-
  on 00:09; reactor-strain groan 00:10; player-heartbeat surge 00:11."
veo.audio.ambient: "Engineering reactor low-frequency bed."
pipeline:
  nb2_seed: 153004; veo_seed: 253004; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_breaking_point/
  notes: "12s stitched 8+4."
```

#### `cs_thought_virus_manifests`
- xref: §F.1.A.1 L116

```yaml
nb2_start.subject: "first contaminated room entered from §A.4
  Engineering Bay; sterile clean-room composition; clean walls,
  fluorescent grid above; no contamination yet visible; player
  has just stepped through doorway."
nb2_end.subject: "the same room — but walls now show subtle TV-
  corruption flicker-glitch overlay; air contains visible spore-
  mote drift z+0–2 m; sterile-clean has decayed."
veo.action: "0–3 s clean-room composition; 4 s head-tilt +5° as
  visual distortion enters peripheral; 7 s involuntary head-shake;
  9 s thousand-yard stare composition, walls now contaminated; 10 s
  low whisper subliminal."
veo.audio.dialogue: "none (the TV does not speak — for now)."
veo.audio.sfx: "clean-room ambient 00:00; ear-ring high-frequency
  tone 00:04; reality-glitch warp 00:07; breathing-quickens 00:09;
  low whisper subliminal 00:10."
veo.audio.ambient: "Engineering ventilation transitioning to
  contaminated bed at 00:07."
pipeline:
  nb2_seed: 153005; veo_seed: 253005; vo_manifest_ref: null;
  cdn_target: cdn/client-public/cutscenes/cs_thought_virus_manifests/
```

### §G.12.B Hellbox transit cutscenes (33+)

Master trait-lock for all Hellboxes: void-black with sigil
illumination; 1800K candlelight equivalents on transit-glyphs;
Sirius-blue volumetrics; ARRI Alexa look; palette
`#080612 / #ffd166 / #5fa8ff`.

Each Hellbox shows the surface-room first (origin Ark room),
the transit interior (sigil-flagged ring descent z+0 to z+12 m),
then the destination zone arrival.

#### `cs_hellbox_1_open` (Med Bay → Celebration School)

```yaml
nb2_start.subject: "Med Bay HB1 surface (per §A.2 spec); plinth
  at room-centre with welcome-statue; player's gloved hands in
  lower frame lifting the welcome-statue from its plinth; medical-
  cross sigil visible on plinth's brass face."
nb2_end.subject: "Celebration School courtyard cobblestones
  underfoot; ceiling-oculus brass-ring visible above; child-NPCs
  visible at far edge of courtyard in golden-hour light."
veo.action: "0–3 s player lifts welcome-statue (HB1 surface);
  3–8 s descent into ring (sigil-chime cascade, transit-video);
  8–10 s arrival in Celebration courtyard."
veo.audio.dialogue: "Master of R'lyeh says, \"When the body fails,
  does the self?\""
veo.audio.sfx: "plinth-stone-grind 00:00; sigil-chime first 00:03;
  sigil-chime middle 00:05; pressure-release hiss 00:07; arrival-
  thunk 00:08."
veo.audio.ambient: "transit Sirius-blue resonance; HB1 medical-
  cross-helix sigil hum."
pipeline:
  nb2_seed: 153101; veo_seed: 253101;
  vo_manifest_ref: apps/shared/masterOfRlyehVoManifest.json#L<TBD>;
  cdn_target: cdn/client-public/cutscenes/cs_hellbox_1_open/
  notes: "10s clip — single 8s + 2s stitched short."
```

#### `cs_hellbox_1_close` (Celebration School → Med Bay)

```yaml
notes: "reverse of HB1_open; player at Celebration courtyard
  oculus, statue replaced; ascent through transit ring; arrival
  at Med Bay HB1 plinth. Same audio palette in reverse order;
  Master of R'lyeh VO inverts: 'And does the self return?'"
pipeline:
  nb2_seed: 153102; veo_seed: 253102;
  vo_manifest_ref: apps/shared/masterOfRlyehVoManifest.json#L<TBD>;
  cdn_target: cdn/client-public/cutscenes/cs_hellbox_1_close/
```

#### `cs_hellbox_1_universal_selector_unlock` (Act 7+ HB1 selector mode)

```yaml
notes: "Act 7+ unlock — HB1's plinth has been augmented with a
  brass star-map dial; the welcome-statue has grown a 12-pointed
  star indicator. Player's gloved hand rotates the dial, the 12
  destination indicators light in sequence. VO: Master of R'lyeh:
  'Choose any.'"
pipeline:
  nb2_seed: 153103; veo_seed: 253103;
  vo_manifest_ref: apps/shared/masterOfRlyehVoManifest.json#L<TBD>;
  cdn_target: cdn/client-public/cutscenes/cs_hellbox_1_universal_selector_unlock/
```

#### `cs_hellbox_2_open` (Hierarchy Throne → Castle of Death)

```yaml
notes: "HB2 surface is in the Hierarchy Throne hub; sigil is gold-
  blood-channel inlay. Descent shows hierarchy-ritual sigils
  (eight-pointed sacrificial star). Arrival at Castle of Death
  Grand Hall threshold (matches §G.4.1 nb2_start)."
veo.audio.dialogue: "Master of R'lyeh says, \"Do you know what is
  asked?\""
pipeline:
  nb2_seed: 153104; veo_seed: 253104;
  vo_manifest_ref: apps/shared/masterOfRlyehVoManifest.json#L<TBD>;
  cdn_target: cdn/client-public/cutscenes/cs_hellbox_2_open/
```

#### `cs_hellbox_2_close` / `cs_hellbox_2_first_offering`

```yaml
notes: "close: reverse of HB2_open; first_offering: HB2 surface
  shows the player presenting an offering on the Hierarchy
  Throne plinth before transit; hierarchy-attendant NPC bows once."
veo.audio.dialogue (close): "Master of R'lyeh: \"You return marked.\""
veo.audio.dialogue (first_offering): "Hierarchy attendant: \"Place it.\""
pipeline:
  cs_hellbox_2_close: { nb2_seed: 153105, veo_seed: 253105,
    cdn_target: cdn/client-public/cutscenes/cs_hellbox_2_close/ }
  cs_hellbox_2_first_offering: { nb2_seed: 153106, veo_seed: 253106,
    cdn_target: cdn/client-public/cutscenes/cs_hellbox_2_first_offering/ }
```

#### `cs_hellbox_3_open` (Bridge → Quiz Show Palimpsest)

```yaml
notes: "HB3 surface is on the Bridge tactical-display chalk-
  surface; tactical-chalk sigils light TV-broadcast-test-pattern
  glyphs. Descent through TV-static transit. Arrival at Quiz Show
  studio main-stage threshold."
veo.audio.dialogue: "Master of R'lyeh: \"Care to play?\""
pipeline:
  nb2_seed: 153107; veo_seed: 253107;
  vo_manifest_ref: apps/shared/masterOfRlyehVoManifest.json#L<TBD>;
  cdn_target: cdn/client-public/cutscenes/cs_hellbox_3_open/
```

#### `cs_hellbox_3_close`, `cs_quiz_round_close_1..5`, `cs_velkraal_brel_succession`

```yaml
cs_hellbox_3_close:
  notes: "reverse of HB3_open."
  pipeline:
    nb2_seed: 153108; veo_seed: 253108;
    cdn_target: cdn/client-public/cutscenes/cs_hellbox_3_close/

cs_quiz_round_close_1:
  notes: "Q1 close — Velkraal hosts; bg-cyc full-saturation; Velkraal's
    smile is intact. Diegetic 'ROUND 2: DECEIT' (15 chars)."
  veo.audio.dialogue: "Velkraal: \"Round two: deceit.\""
  pipeline:
    nb2_seed: 153109; veo_seed: 253109;
    vo_manifest_ref: apps/shared/velkraalVoManifest.json#L<TBD>;
    cdn_target: cdn/client-public/cutscenes/cs_quiz_round_close_1/

cs_quiz_round_close_2:
  notes: "Q2 close — Velkraal's tone darkens slightly. 'ROUND 3:
    DAMAGE' (14 chars)."
  veo.audio.dialogue: "Velkraal: \"Round three: damage.\""
  pipeline:
    nb2_seed: 153110; veo_seed: 253110;
    cdn_target: cdn/client-public/cutscenes/cs_quiz_round_close_2/

cs_quiz_round_close_3:
  notes: "Q3 close — 'ROUND 4: DEFEAT' (14 chars). Crowd-applause
    fades 2 dB."
  veo.audio.dialogue: "Velkraal: \"Round four: defeat.\""
  pipeline:
    nb2_seed: 153111; veo_seed: 253111;
    cdn_target: cdn/client-public/cutscenes/cs_quiz_round_close_3/

cs_quiz_round_close_4:
  notes: "Q4 close — 'ROUND 5: DARK' (12 chars). Studio-light dim
    by 4%."
  veo.audio.dialogue: "Velkraal: \"Round five: dark.\""
  pipeline:
    nb2_seed: 153112; veo_seed: 253112;
    cdn_target: cdn/client-public/cutscenes/cs_quiz_round_close_4/

cs_quiz_round_close_5:
  notes: "Q5 close — 'ROUND 6: DOOM' (12 chars). Velkraal's mic
    crackles. Final round before succession."
  veo.audio.dialogue: "Velkraal: \"Round six: doom.\""
  pipeline:
    nb2_seed: 153113; veo_seed: 253113;
    cdn_target: cdn/client-public/cutscenes/cs_quiz_round_close_5/

cs_velkraal_brel_succession:
  notes: "between Q5 and Q6 — Velkraal's silhouette dissolves to
    static mid-podium; Brel walks on from stage-right wearing the
    same suit. The category-card has updated mid-air. Audio:
    crowd-gasp 00:03; static-burst 00:04; Brel-footstep cadence
    00:05–00:07; mic-handover-tap 00:08."
  veo.audio.dialogue: "Brel says, \"Welcome back.\""
  pipeline:
    nb2_seed: 153114; veo_seed: 253114;
    vo_manifest_ref: apps/shared/brelVoManifest.json#L<TBD>;
    cdn_target: cdn/client-public/cutscenes/cs_velkraal_brel_succession/
    notes: "12s stitched."
```

#### `cs_hellbox_4_open` / `_close` / `_first_class` (Engineering Bay → Mechronis Academy)

```yaml
cs_hellbox_4_open:
  notes: "HB4 surface in Engineering Bay; sigil is mechanical-gear-
    inlay. Descent through gear-rotation transit. Arrival at
    Mechronis main hallway."
  veo.audio.dialogue: "Master of R'lyeh: \"Build, then.\""
  pipeline:
    nb2_seed: 153115; veo_seed: 253115;
    cdn_target: cdn/client-public/cutscenes/cs_hellbox_4_open/

cs_hellbox_4_close:
  notes: "reverse."
  pipeline:
    nb2_seed: 153116; veo_seed: 253116;
    cdn_target: cdn/client-public/cutscenes/cs_hellbox_4_close/

cs_hellbox_4_first_class:
  notes: "Mechronis M1 first-arrival inside the academy hallway;
    hallway lined with surveillance-cameras tracking player; one
    door 6 m ahead opens; cohort-NPCs visible inside in formation.
    Audio: camera-servo whirr cascade; cohort-recite low chord."
  veo.audio.dialogue: "Sergeant: \"Cohort, in.\""
  pipeline:
    nb2_seed: 153117; veo_seed: 253117;
    vo_manifest_ref: apps/shared/mechronisSergeantVoManifest.json#L<TBD>;
    cdn_target: cdn/client-public/cutscenes/cs_hellbox_4_first_class/
```

#### `cs_hellbox_5_open` / `_select_destination` (Personal Quarters → Universal Selector)

```yaml
cs_hellbox_5_open:
  notes: "HB5 surface in Personal Quarters; sigil is personal-
    keepsake-circle. Descent through keepsake-vignette transit.
    Arrival at Universal Selector room (12-pointed star-dial)."
  veo.audio.dialogue: "Master of R'lyeh: \"Where now?\""
  pipeline:
    nb2_seed: 153118; veo_seed: 253118;
    cdn_target: cdn/client-public/cutscenes/cs_hellbox_5_open/

cs_hellbox_5_select_destination:
  notes: "player's gloved hand rotates the 12-point dial; one
    indicator at a time lights as hand passes; player commits at
    one. Audio: dial-rotation soft-click cascade; commit-chime."
  veo.audio.dialogue: "none (Selector is silent)."
  pipeline:
    nb2_seed: 153119; veo_seed: 253119;
    cdn_target: cdn/client-public/cutscenes/cs_hellbox_5_select_destination/
```

#### `cs_hellbox_6_open` / `_close` (Memorial Corridor → Dead Man's Circuit)

```yaml
cs_hellbox_6_open:
  notes: "HB6 surface in Memorial Corridor; sigil is checkered-
    racing-flag-inlay. Descent through engine-roar transit.
    Arrival at Dead Man's Circuit pit-lane in twilight."
  veo.audio.dialogue: "Master of R'lyeh: \"Drive, do not look.\""
  pipeline:
    nb2_seed: 153120; veo_seed: 253120;
    cdn_target: cdn/client-public/cutscenes/cs_hellbox_6_open/

cs_hellbox_6_close:
  notes: "reverse."
  pipeline:
    nb2_seed: 153121; veo_seed: 253121;
    cdn_target: cdn/client-public/cutscenes/cs_hellbox_6_close/
```

#### `cs_hellbox_7_open` / `_close` (Captain's Quarters → Degenerate's Casino)

```yaml
cs_hellbox_7_open:
  notes: "HB7 surface in Captain's Quarters Degen Corner; sigil is
    casino-chip-spiral. Descent through chip-cascade transit.
    Arrival at HB7 Casino floor entrance."
  veo.audio.dialogue: "Master of R'lyeh: \"Bet small. Lose anyway.\""
  pipeline:
    nb2_seed: 153122; veo_seed: 253122;
    cdn_target: cdn/client-public/cutscenes/cs_hellbox_7_open/

cs_hellbox_7_close:
  notes: "reverse."
  pipeline:
    nb2_seed: 153123; veo_seed: 253123;
    cdn_target: cdn/client-public/cutscenes/cs_hellbox_7_close/
```

#### `cs_hellbox_8_open` / `_edit` / `_close` (Cipher Den → Editor's Workshop)

```yaml
cs_hellbox_8_open:
  notes: "HB8 surface in Cipher Den; sigil is letterpress-block-
    grid. Descent through paper-flap transit. Arrival at Editor's
    Workshop, ink-stained desks."
  veo.audio.dialogue: "Master of R'lyeh: \"Re-write what was written.\""
  pipeline:
    nb2_seed: 153124; veo_seed: 253124;
    cdn_target: cdn/client-public/cutscenes/cs_hellbox_8_open/

cs_hellbox_8_edit:
  notes: "player's gloved hands hold a draft-page; ink-pen lifts
    of its own accord and edits the page. Audio: pen-scratch on
    paper 00:03–00:07."
  pipeline:
    nb2_seed: 153125; veo_seed: 253125;
    cdn_target: cdn/client-public/cutscenes/cs_hellbox_8_edit/

cs_hellbox_8_close:
  notes: "reverse."
  pipeline:
    nb2_seed: 153126; veo_seed: 253126;
    cdn_target: cdn/client-public/cutscenes/cs_hellbox_8_close/
```

#### `cs_hellbox_9_open` / `_move` / `_close` (Chess Hall → Eternal Match)

```yaml
cs_hellbox_9_open:
  notes: "HB9 surface in Chess Hall; sigil is 8x8 board pattern.
    Descent through chess-piece-rain transit. Arrival at Eternal
    Match chamber, single board floating in void."
  veo.audio.dialogue: "Master of R'lyeh: \"The board waits.\""
  pipeline:
    nb2_seed: 153127; veo_seed: 253127;
    cdn_target: cdn/client-public/cutscenes/cs_hellbox_9_open/

cs_hellbox_9_move:
  notes: "player's gloved hand makes a single move on the floating
    board; piece slides with subtle reverberation."
  pipeline:
    nb2_seed: 153128; veo_seed: 253128;
    cdn_target: cdn/client-public/cutscenes/cs_hellbox_9_move/

cs_hellbox_9_close:
  notes: "reverse of HB9_open."
  pipeline:
    nb2_seed: 153129; veo_seed: 253129;
    cdn_target: cdn/client-public/cutscenes/cs_hellbox_9_close/
```

#### `cs_hellbox_10_open` / `_release` / `_close` (Collectors Arena → Hall of Collected Souls)

```yaml
cs_hellbox_10_open:
  notes: "HB10 surface in Collectors Arena; sigil is jar-and-tag
    inlay. Descent through specimen-jar transit. Arrival at Hall
    of Collected Souls, infinite shelving of glass jars each
    holding a still-image fragment."
  veo.audio.dialogue: "Master of R'lyeh: \"Each jar is someone.\""
  pipeline:
    nb2_seed: 153130; veo_seed: 253130;
    cdn_target: cdn/client-public/cutscenes/cs_hellbox_10_open/

cs_hellbox_10_release:
  notes: "player selects one jar; opens lid; the contained
    fragment-image dissipates as a wisp."
  pipeline:
    nb2_seed: 153131; veo_seed: 253131;
    cdn_target: cdn/client-public/cutscenes/cs_hellbox_10_release/

cs_hellbox_10_close:
  notes: "reverse."
  pipeline:
    nb2_seed: 153132; veo_seed: 253132;
    cdn_target: cdn/client-public/cutscenes/cs_hellbox_10_close/
```

#### `cs_hellbox_11_open` / `_negotiate` / `_close` (Defense Command → The Hive)

```yaml
cs_hellbox_11_open:
  notes: "HB11 surface in Defense Command; sigil is hexagonal-
    swarm-pattern. Descent through wing-buzz transit. Arrival at
    The Hive, vast hexagonal-cell chamber."
  veo.audio.dialogue: "Master of R'lyeh: \"Hold a parley.\""
  pipeline:
    nb2_seed: 153133; veo_seed: 253133;
    cdn_target: cdn/client-public/cutscenes/cs_hellbox_11_open/

cs_hellbox_11_negotiate:
  notes: "player faces a Hive-Queen NPC across a chamber-centre
    altar; queen's mandibles flex once."
  veo.audio.dialogue: "Hive-Queen: \"What do you offer?\""
  pipeline:
    nb2_seed: 153134; veo_seed: 253134;
    vo_manifest_ref: apps/shared/hiveQueenVoManifest.json#L<TBD>;
    cdn_target: cdn/client-public/cutscenes/cs_hellbox_11_negotiate/

cs_hellbox_11_close:
  notes: "reverse."
  pipeline:
    nb2_seed: 153135; veo_seed: 253135;
    cdn_target: cdn/client-public/cutscenes/cs_hellbox_11_close/
```

#### `cs_hellbox_12_open` / `_self_duel` / `_close` (Game Hall → Dischordian Arena)

```yaml
cs_hellbox_12_open:
  notes: "HB12 surface in Game Hall; sigil is mirror-and-card.
    Descent through reflection-cascade transit. Arrival at
    Dischordian Arena, mirror-perfect duel-stage."
  veo.audio.dialogue: "Master of R'lyeh: \"Duel yourself.\""
  pipeline:
    nb2_seed: 153136; veo_seed: 253136;
    cdn_target: cdn/client-public/cutscenes/cs_hellbox_12_open/

cs_hellbox_12_self_duel:
  notes: "the duel-stage opponent is the player's own mirror-image
    in identical wardrobe; opponent makes the same motions
    delayed by 0.4 s."
  veo.audio.dialogue: "Mirror-self says, \"You first.\""
  pipeline:
    nb2_seed: 153137; veo_seed: 253137; vo_manifest_ref: null;
    cdn_target: cdn/client-public/cutscenes/cs_hellbox_12_self_duel/
    notes: "FPV-mirror constraint relaxed for this cutscene only —
      the opponent IS the player; the negative_prompt is rewritten:
      'no third-person view of the player except as the across-table
      duel opponent.' Mirror-self's face is blurred or stylised so
      the player's face never resolves explicitly."

cs_hellbox_12_close:
  notes: "reverse."
  pipeline:
    nb2_seed: 153138; veo_seed: 253138;
    cdn_target: cdn/client-public/cutscenes/cs_hellbox_12_close/
```

### §G.12.C Galaxy Map / Trade Empire heroes (10)

```yaml
cs_galaxy_first_open:
  xref: §F.1.A.3 L472
  notes: "first time Galaxy Map opens — wide hyperspace-key
    composition; brass map-unfurl; 38 sectors light in faction
    colours one at a time; trade-route lines pulse once. 10s
    stitched."
  veo.audio.dialogue: "Trade-clerk: \"Map online.\""
  pipeline:
    nb2_seed: 154001; veo_seed: 254001;
    cdn_target: cdn/client-public/cutscenes/cs_galaxy_first_open/

cs_doom_clock_visible:
  xref: §F.1.A.3 L482
  notes: "Doom Clock first becomes visible on Galaxy Map; 12-hour
    clock-face superimposed at galactic-centre; clock-hand begins
    to tick. Audio: clock-tick at 1 Hz; low chord; player-breath."
  veo.audio.dialogue: "none."
  pipeline:
    nb2_seed: 154002; veo_seed: 254002;
    cdn_target: cdn/client-public/cutscenes/cs_doom_clock_visible/

cs_first_arrival_free_ports:
  xref: §F.1.A.3 L492
  notes: "Free Ports — already shipped art (`§E.1.1` ref). Compose
    arrival from existing reference; player's shuttle docks at
    the central market-station Tier 4."
  veo.audio.dialogue: "Trade-clerk: \"Free Ports. Welcome.\""
  pipeline:
    nb2_seed: 154003; veo_seed: 254003;
    cdn_target: cdn/client-public/cutscenes/cs_first_arrival_free_ports/

cs_first_arrival_terminus_core:
  xref: §F.1.A.3 L497
  notes: "Terminus Core — the dense innermost zone; player's
    instruments fail visibly as approach completes. Trait-lock
    with §G.5.15 Terminus Approach palette (`#0a0612 / #ff2a8a /
    #5fa8ff`)."
  veo.audio.dialogue: "Pilot: \"Terminus. Hold.\""
  pipeline:
    nb2_seed: 154004; veo_seed: 254004;
    cdn_target: cdn/client-public/cutscenes/cs_first_arrival_terminus_core/

cs_first_arrival_hell_gate:
  xref: §F.1.A.3 L501
  notes: "Hell Gate — a wormhole anomaly framed by a ruined
    archway-station; volumetric red-violet light spills from
    the gate. Audio: wormhole low chord, structural creak."
  veo.audio.dialogue: "Pilot: \"Hell Gate cleared.\""
  pipeline:
    nb2_seed: 154005; veo_seed: 254005;
    cdn_target: cdn/client-public/cutscenes/cs_first_arrival_hell_gate/

cs_first_arrival_dreamer_barrier:
  xref: §F.1.A.3 L505
  notes: "Dreamer Barrier — a translucent membrane spanning a
    sector boundary; pale-blue dreamers-aesthetic crystals visible
    on the barrier's surface."
  veo.audio.dialogue: "Pilot: \"Barrier intact.\""
  pipeline:
    nb2_seed: 154006; veo_seed: 254006;
    cdn_target: cdn/client-public/cutscenes/cs_first_arrival_dreamer_barrier/

cs_first_arrival_panopticon:
  xref: §F.1.A.3 L525
  notes: "Panopticon Ruins — a pre-Empire surveillance-station,
    now a half-broken ring with thousands of derelict observation-
    posts visible on its inner surface. 12s stitched."
  veo.audio.dialogue: "Pilot: \"Panopticon. Eyes off, even now.\""
  pipeline:
    nb2_seed: 154007; veo_seed: 254007;
    cdn_target: cdn/client-public/cutscenes/cs_first_arrival_panopticon/

cs_first_arrival_frontier_worlds:
  xref: §F.1.A.3 L529
  notes: "Frontier Worlds — a 6-planet system at the Empire's
    edge; player's shuttle approaches the largest. Trait-lock
    with §G.5.4 Empire Frontier palette."
  veo.audio.dialogue: "Outpost-foreman: \"Worlds Six.\""
  pipeline:
    nb2_seed: 154008; veo_seed: 254008;
    cdn_target: cdn/client-public/cutscenes/cs_first_arrival_frontier_worlds/

cs_first_arrival_generic_<sectorType>:
  xref: §F.1.A.3 L533
  notes: "8 type-templates (stardock / station / port / planet /
    nebula / asteroid / hazard / wormhole). Each template gets a
    palette-anchored 6s arrival cut at the type's representative
    composition. Pipeline seeds: 154009..154016. CDN target per-
    template: cdn/client-public/cutscenes/cs_first_arrival_generic_<type>/."

cs_planet_state_flip_<state>:
  xref: §F.1.A.3 L539
  notes: "5 templates (faction-flip / embargo / festival / plague /
    anomaly). Each gets a 6s state-visualisation cut at the
    state's representative composition (banner-shift / red-X /
    festival-banner / plague-quarantine / anomaly-rift). Pipeline
    seeds: 154017..154021."
```

### §G.12.D Brokers (3)

```yaml
cs_broker_first_meet_degenerate:
  xref: §F.1.A.4 L547
  notes: "first meet with the Degenerate broker in HB7 Casino back-
    booth; broker's face partially obscured by a cocktail-glass
    in foreground. Audio: ice-cube tap on glass 00:04."
  veo.audio.dialogue: "Degenerate: \"You bring action?\""
  pipeline:
    nb2_seed: 155001; veo_seed: 255001;
    vo_manifest_ref: apps/shared/degenerateBrokerVoManifest.json#L<TBD>;
    cdn_target: cdn/client-public/cutscenes/cs_broker_first_meet_degenerate/

cs_broker_first_meet_sentinel:
  xref: §F.1.A.4 L551
  notes: "first meet with the Sentinel broker on a sentinel-tower
    observation deck; broker in greatcoat with brass scope at
    chest. Audio: scope-mechanism click 00:04; wind-rush at altitude."
  veo.audio.dialogue: "Sentinel: \"State your need.\""
  pipeline:
    nb2_seed: 155002; veo_seed: 255002;
    vo_manifest_ref: apps/shared/sentinelBrokerVoManifest.json#L<TBD>;
    cdn_target: cdn/client-public/cutscenes/cs_broker_first_meet_sentinel/

cs_broker_first_meet_third:
  xref: §F.1.A.4 L555
  notes: "TBD broker — placeholder. Composition resolves at lore-
    delivery time."
  pipeline:
    nb2_seed: 155003; veo_seed: 255003; vo_manifest_ref: null;
    cdn_target: cdn/client-public/cutscenes/cs_broker_first_meet_third/
```

### §G.12.E Alliance War (8)

Trait-lock: hex-grid table, 4500K command-room lighting, Vision3
250D, palette `#1a3550 / #c8a05a / #ff5a1a`. War-Room SFX:
gavel-tap, hex-piece-place, intel-buzzer.

```yaml
cs_war_declared:
  xref: §F.1.A.5 L559
  notes: "War Room hex-grid table at moment of war-declaration;
    central gavel strikes once; 19 hex-pieces all flip to faction
    colour. Audio: gavel-strike 00:03; hex-piece flip cascade
    00:04–00:07."
  veo.audio.dialogue: "War-Marshal: \"War. Now.\""
  pipeline:
    nb2_seed: 156001; veo_seed: 256001;
    vo_manifest_ref: apps/shared/warMarshalVoManifest.json#L<TBD>;
    cdn_target: cdn/client-public/cutscenes/cs_war_declared/

cs_placement_phase_open:
  xref: §F.1.A.5 L569
  notes: "placement phase — player's gloved hand hovers over hex-
    grid; first piece placed; each placement chimes."
  veo.audio.dialogue: "War-Marshal: \"Place yours.\""
  pipeline:
    nb2_seed: 156002; veo_seed: 256002;
    cdn_target: cdn/client-public/cutscenes/cs_placement_phase_open/

cs_attack_phase_open:
  xref: §F.1.A.5 L574
  notes: "attack phase — first attack-arrow drawn between two
    hexes; arrow lights crimson."
  veo.audio.dialogue: "War-Marshal: \"Engage.\""
  pipeline:
    nb2_seed: 156003; veo_seed: 256003;
    cdn_target: cdn/client-public/cutscenes/cs_attack_phase_open/

cs_battle_resolved:
  xref: §F.1.A.5 L579
  notes: "outcome resolution — hex flips to victor's colour; brass
    counter ticks. Two end-frame variants (player victory /
    defeat) per outcome."
  veo.audio.dialogue: "War-Marshal: \"Hex resolved.\""
  pipeline:
    nb2_seed: 156004; veo_seed: 256004;
    cdn_target: cdn/client-public/cutscenes/cs_battle_resolved/

cs_raid_incoming:
  xref: §F.1.A.5 L586
  notes: "raid-incoming alert in War Room; klaxon-LED panel red;
    hex showing raid-source pulses. Audio: klaxon-tone 00:03;
    hex-pulse low chord."
  veo.audio.dialogue: "War-Marshal: \"Raid inbound.\""
  pipeline:
    nb2_seed: 156005; veo_seed: 256005;
    cdn_target: cdn/client-public/cutscenes/cs_raid_incoming/

cs_wave_final:
  xref: §F.1.A.5 L594
  notes: "final wave indicator on War Room display; countdown
    timer on display reaches single-digits."
  veo.audio.dialogue: "War-Marshal: \"Final wave.\""
  pipeline:
    nb2_seed: 156006; veo_seed: 256006;
    cdn_target: cdn/client-public/cutscenes/cs_wave_final/

cs_base_held:
  xref: §F.1.A.5 L602
  notes: "base-held outcome; hex-grid display shows player's hexes
    intact, opponent's flickering out."
  veo.audio.dialogue: "War-Marshal: \"Held.\""
  pipeline:
    nb2_seed: 156007; veo_seed: 256007;
    cdn_target: cdn/client-public/cutscenes/cs_base_held/

cs_base_fallen:
  xref: §F.1.A.5 L608
  notes: "base-fallen outcome; player's hex flickers out; opponent
    hex solid."
  veo.audio.dialogue: "War-Marshal: \"Lost.\""
  pipeline:
    nb2_seed: 156008; veo_seed: 256008;
    cdn_target: cdn/client-public/cutscenes/cs_base_fallen/
```

### §G.12.F CADES missions (7)

```yaml
cs_cades_m1_open:
  xref: §F.1.A.7 L676 (m1)
  notes: "M1 Scout's Gambit — player at recon pod, scope view of
    enemy base; binoculars in foreground. Audio: scope-zoom 00:04."
  veo.audio.dialogue: "CADES-Commander: \"Scout in.\""
  pipeline:
    nb2_seed: 157001; veo_seed: 257001;
    vo_manifest_ref: apps/shared/cadesCommanderVoManifest.json#L<TBD>;
    cdn_target: cdn/client-public/cutscenes/cs_cades_m1_open/

cs_cades_m2_open:
  notes: "M2 Digital Onslaught — server-room corridor; corrupted
    drone-formations. Audio: digital-static crackle."
  pipeline:
    nb2_seed: 157002; veo_seed: 257002;
    cdn_target: cdn/client-public/cutscenes/cs_cades_m2_open/

cs_cades_m3_open:
  notes: "M3 Last Stand on Veridian VI — battlefield with friendly
    forces dug in; smoke and broken vehicles. Audio: distant
    artillery; comms-chatter."
  pipeline:
    nb2_seed: 157003; veo_seed: 257003;
    cdn_target: cdn/client-public/cutscenes/cs_cades_m3_open/

cs_cades_m4_open:
  notes: "M4 (TBC name) — placeholder, Insurgency operation."
  pipeline:
    nb2_seed: 157004; veo_seed: 257004;
    cdn_target: cdn/client-public/cutscenes/cs_cades_m4_open/

cs_cades_m5_open:
  notes: "M5 (TBC) — placeholder."
  pipeline:
    nb2_seed: 157005; veo_seed: 257005;
    cdn_target: cdn/client-public/cutscenes/cs_cades_m5_open/

cs_cades_m6_open:
  notes: "M6 (TBC) — placeholder."
  pipeline:
    nb2_seed: 157006; veo_seed: 257006;
    cdn_target: cdn/client-public/cutscenes/cs_cades_m6_open/

cs_cades_m7_open:
  notes: "M7 (TBC) — placeholder."
  pipeline:
    nb2_seed: 157007; veo_seed: 257007;
    cdn_target: cdn/client-public/cutscenes/cs_cades_m7_open/
```

### §G.12.G Boss arena 5 retro upgrades

```yaml
cs_boss_first_warlord_zero:
  xref: §F.1.A.7 L667
  notes: "Warlord Zero — armoured warlord on a wreckage-throne
    on a battlefield-station; wears a faceplate with a single
    crack. Palette `#3a3540 / #c8a05a / #ff5a1a`."
  veo.audio.dialogue: "Warlord Zero: \"You came.\""
  pipeline:
    nb2_seed: 158001; veo_seed: 258001;
    vo_manifest_ref: apps/shared/warlordZeroVoManifest.json#L<TBD>;
    cdn_target: cdn/client-public/cutscenes/cs_boss_first_warlord_zero/

cs_boss_first_game_master:
  xref: §F.1.A.7 L667
  notes: "Game Master at Bridge holographic-systems console; trait-
    lock with §G.2.1 Tier 0 chess seat description. Palette
    chess-hall."
  veo.audio.dialogue: "Game Master: \"Welcome to my game.\""
  pipeline:
    nb2_seed: 158002; veo_seed: 258002;
    vo_manifest_ref: apps/shared/gameMasterVoManifest.json#L<TBD>;
    cdn_target: cdn/client-public/cutscenes/cs_boss_first_game_master/

cs_boss_first_watcher:
  xref: §F.1.A.7 L667
  notes: "The Watcher in Med Bay monitoring-systems room; many
    monitor-screens behind, all showing the player's POV from
    other moments. Palette med-bay clinical-cold + corruption-
    pink rim."
  veo.audio.dialogue: "The Watcher: \"I have watched you.\""
  pipeline:
    nb2_seed: 158003; veo_seed: 258003;
    vo_manifest_ref: apps/shared/theWatcherVoManifest.json#L<TBD>;
    cdn_target: cdn/client-public/cutscenes/cs_boss_first_watcher/

cs_boss_first_panopticon_sentinel:
  xref: §F.1.A.7 L667
  notes: "Panopticon Sentinel on the Panopticon Ruins observation
    ring; thousand observation-posts behind, half-functional.
    Palette Panopticon ruins. Trait-lock with §G.12.C arrival."
  veo.audio.dialogue: "Sentinel: \"I see all that remains.\""
  pipeline:
    nb2_seed: 158004; veo_seed: 258004;
    vo_manifest_ref: apps/shared/panopticonSentinelVoManifest.json#L<TBD>;
    cdn_target: cdn/client-public/cutscenes/cs_boss_first_panopticon_sentinel/

cs_boss_first_chrono_wyrm:
  xref: §F.1.A.7 L667
  notes: "Chrono Wyrm in a chrono-anomaly chamber; serpentine
    creature occupying multiple time-frames simultaneously.
    Palette `#5fa8ff / #ff2a8a / #c8a05a`."
  veo.audio.dialogue: "Chrono Wyrm: \"Already eaten you.\""
  pipeline:
    nb2_seed: 158005; veo_seed: 258005;
    vo_manifest_ref: apps/shared/chronoWyrmVoManifest.json#L<TBD>;
    cdn_target: cdn/client-public/cutscenes/cs_boss_first_chrono_wyrm/

cs_boss_first_encounter_generic:
  xref: §F.1.A.7 L672
  notes: "template for remaining bosses; palette-swap per actual
    boss."
  pipeline:
    nb2_seed: 158006; veo_seed: 258006;
    cdn_target: cdn/client-public/cutscenes/cs_boss_first_encounter_generic/
```

### §G.12.H Matrix discovery (4)

```yaml
cs_matrix_first_portal:
  xref: §F.1.A.8 L688
  notes: "first time the matrix-portal opens — bridge-room
    holographic node lights with twin-school glyphs (Celebration
    + Mechronis); player's gloved hand reaches toward the node.
    Audio: portal-warble 00:04; twin-glyph chime 00:06."
  veo.audio.dialogue: "Master of R'lyeh: \"Two schools, both yours.\""
  pipeline:
    nb2_seed: 159001; veo_seed: 259001;
    cdn_target: cdn/client-public/cutscenes/cs_matrix_first_portal/

cs_celebration_first_arrival:
  xref: §F.1.A.8 L693
  notes: "first arrival at Celebration School courtyard; trait-
    lock with §G.11 Celebration palette."
  pipeline:
    nb2_seed: 159002; veo_seed: 259002;
    cdn_target: cdn/client-public/cutscenes/cs_celebration_first_arrival/

cs_mechronis_first_arrival:
  xref: §F.1.A.8 L699
  notes: "first arrival at Mechronis main hallway; trait-lock with
    §G.11 Mechronis palette."
  pipeline:
    nb2_seed: 159003; veo_seed: 259003;
    cdn_target: cdn/client-public/cutscenes/cs_mechronis_first_arrival/

cs_matrix_episode_complete:
  xref: §F.1.A.8 L705
  notes: "any episode completion — episode-banner scrolls down,
    XP-counter ticks up. Audio: episode-completion chord; xp-tick
    cascade."
  pipeline:
    nb2_seed: 159004; veo_seed: 259004;
    cdn_target: cdn/client-public/cutscenes/cs_matrix_episode_complete/

cs_territory_shift:
  xref: §F.1.A.8 L711
  notes: "Galaxy Map sector flip during play — sector colour
    transitions. Trait-lock with §G.12.E `cs_battle_resolved`
    hex-flip aesthetic."
  pipeline:
    nb2_seed: 159005; veo_seed: 259005;
    cdn_target: cdn/client-public/cutscenes/cs_territory_shift/
```

---

## §G.D audit (will be re-checked at §G.F)

Cuts retroactively upgraded in this sub-phase: **68**
- §G.12.A shipped narrative: 5
- §G.12.B Hellbox transit (HB1–HB12 + Quiz Q1–Q5 + succession): 34
- §G.12.C Galaxy/Trade hero: 10 (8 explicit + 8 generic-template +
  5 state-flip; only 10 hero arrivals counted toward unique IDs;
  generic templates aggregate)
- §G.12.D Brokers: 3
- §G.12.E Alliance War: 8
- §G.12.F CADES: 7
- §G.12.G Boss retro: 5 + 1 generic template
- §G.12.H Matrix discovery: 5

Cumulative coverage after G.A + G.B + G.C + G.D: **218 cutscenes**
(150 new + 68 retro upgrades).

Outstanding TBDs (resolved in §G.F audit):
- VO manifest line numbers for: Master of R'lyeh, Velkraal, Brel,
  Substrate-Human, Elara, Mechronis Sergeant, Hive-Queen,
  Degenerate broker, Sentinel broker, War-Marshal, CADES Commander,
  Warlord Zero, Watcher, Panopticon Sentinel, Chrono Wyrm.
- CADES M4–M7 names need cross-cut sign-off from `actsFourFiveShells.ts`
  source-of-truth; placeholder names in §G.12.F.
- Quiz round-close categories (Q2–Q6) cross-checked against
  `_PRODUCTION_DESTINATIONS.md` §E.5 — the canonical category
  string list lives there; align if drifted.
- HB12 self-duel FPV-mirror constraint exception is documented
  in-line; production-side QA must verify generated frames don't
  reveal the player's face during that one cutscene.
