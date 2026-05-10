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
