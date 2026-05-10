# Loredex OS — Apprentice + Commons production spec

Companion to `_PRODUCTION_ARK_ROOMS.md`, `_PRODUCTION_CROSS_CUT.md`,
and `_PRODUCTION_CUTSCENE_PROMPTS.md`. Authors the rooms, cutscenes,
and art-resource manifests for the apprentice system (PR #509,
#513, #517) and the commons banter system (commons 126/126
coverage in PR #513).

The runtime systems already shipped to main on `apps/shared/`,
`apps/server/routers/`, and `apps/client/src/components/commons/`.
This document is the **production-side architecture** that the
runtime references but never authored — every Ark room, sub-zone,
cutscene, and art reference the apprentice + commons systems
imply.

## Status of the apprentice + commons systems

What shipped (already on main; verified per agent
`apprentice-commons-feature-deep-dive`):

- **12 apprentice archetypes** — Zealot, Ghost, Scholar, Revenant,
  Artisan, Oracle, Wanderer, Martyr, Heretic, Jester, Sentinel,
  Prodigal. Source: `apps/shared/apprentices.ts:27–131`.
- **Apprentice identity system** — gifts, personal quests, romance
  curves, betrayal flavor, VO lines, bartering preferences per
  archetype. Source: `apps/shared/apprenticeIdentity.ts:71–550+`.
- **Apprentice trial lifecycle** — Recruit → 28-day trial
  (Celebration) → graduate or permadeath → if survives, becomes
  `productionPath: "trained"` crew. Source:
  `apps/server/routers/apprenticeTrial.ts:29–100+`.
- **Blood weave** — cumulative `hierarchyAlignment` track;
  5 bands (dormant → braiding → woven → bound → claimed). Source:
  `apps/shared/bloodWeave.ts:1–150+`.
- **Hellbox clone** — apprentice-only one-shot restoration
  ("salvage tech bench-built on Ark"). Source:
  `apps/shared/hellboxClone.ts`.
- **Commons banter** — 157 pre-authored social pairings in 3
  sub-zones (bar / long table / alcove) of the Social Hub
  (§A.15). Source: `apps/shared/commonsScenePool.ts`.
- **Mourning system** — obituaries, mourning sweep, permadeath
  resolution. Source: `apps/shared/apprenticeToCrew.ts`.
- **Narrative flag bridge** — `apprenticeTrial` and
  `essenceHarvest` emit `apprentice_trial_completed_<archetype>`,
  `apprentice_trial_graduated_any`, `essence_harvest_first`,
  `essence_harvest_veteran` flags. Source:
  `apps/server/services/narrativeFlagService.ts`.
- **VO coverage** — 24 JSON line-files (12 archetypes × 2
  genders), ~1294 lines total. Source:
  `apps/scripts/apprentice-{archetype}-{gender}-lines.json`.

What was missing (this document supplies):

- **No physical rooms** for the apprentice cohort during the
  28-day trial. The system implies a residential cohort space
  but `_PRODUCTION_ARK_ROOMS.md` only covers A.1–A.49 with no
  apprentice-specific rooms.
- **No sub-zone full-spec** for the commons bar / long table /
  alcove. Social Hub §A.15 documents the room as multi-zone but
  the three sub-zones are not specced at §4 depth.
- **No cutscenes** for archetype recruits, graduations,
  permadeath obituaries, blood-weave threshold transitions,
  or essence-harvest rituals.
- **No art-resource manifest** for any apprentice surface. The
  user has fixed the aesthetic — **steampunk cyberpunk with an
  occult twist** — and this document threads that anchor through
  every art prompt.

## §AC.0 Framework

### §AC.0.1 Aesthetic anchor — APPRENTICE_AESTHETIC (steampunk cyberpunk occult)

This anchor is trait-locked across **every** apprentice room,
sub-zone, cutscene, and art prompt in this document. It is
imported verbatim into Nano Banana 2 and Veo 3.1 prompts as
`<APPRENTICE_AESTHETIC>`.

```
APPRENTICE_AESTHETIC:
  steampunk_layer:
    - brass armatures + copper piping
    - leather-bound ledgers + mechanical typewriters
    - pneumatic message-tubes
    - exposed cog-mechanisms behind glass-front cabinets
    - gas-mantle wall-lamps at 1800 K equivalents
    - mahogany-and-brass workbenches
    - riveted iron deck plating
    - dial-array switchboards with ivory key-faces
  cyberpunk_layer:
    - holographic UI overlays in cyan-magenta with glitch-flicker
    - fiber-optic conduits emerging from brass fittings
    - neural-jack ports embedded in skull-relics or control panels
    - retina-tracking eye-cameras on swing-arms
    - neon-trim signage in low-saturation amber-cyan
    - datapad-grafted-to-brass-keyboard input devices
    - biolume-fungal LEDs underlighting consoles
  occult_layer:
    - chalk-circle inlays around the base of every workbench
    - sigil-etched brass plates on doorframes
    - sacrificial-blood channels in floor inlay (gold-filled)
    - incense-thurible hangings z+2.4–3.6 m
    - candle clusters at every console (real-flame practical)
    - Latin / cipher inscriptions on instrument faces
    - eldritch tarot cards in glass-front display cases
    - demon-summoning chalkboards on workshop walls
  palette:
    primary:   "#c9a14a"   # brass
    secondary: "#5fa8ff"   # cyber-cyan
    tertiary:  "#0d0a08"   # occult-black
    accent_a:  "#ff2a8a"   # corruption-pink
    accent_b:  "#5a1a1f"   # blood-red
    accent_c:  "#dccfaa"   # parchment-cream
  lighting:
    key:       "1800 K candle / gas-mantle equivalent"
    fill:      "5400 K diffuse"
    rim:       "6500 K cyber-cyan from fiber-optic conduits"
    practical: "12000 K occult-violet at sigil hot-spots"
  film_stock: "Kodak Vision3 500T pushed +1; ARRI Alexa anamorphic"
  atmosphere:
    smell:     "incense + ozone + leather + machine-oil"
    sound:     "gas-mantle hiss + fiber-optic hum + distant chant-loop"
    haze:      "z+1.5–3.0 m volumetric oil-smoke + cyber-mist mix"
  forbidden:
    - clean-white sterile surfaces (clinical-sterile is wrong era)
    - pure-digital flat-shaded UIs (cyberpunk here always
      surfaces THROUGH brass / leather / candle-wax)
    - pure stone-medieval (medieval here always wears brass
      armature and fiber-optic conduit)
```

This anchor reads in NB2 prompts as one inline phrase:
> APPRENTICE_AESTHETIC: steampunk-cyberpunk-occult; brass
> armatures and copper piping with cyber-cyan fiber-optic
> conduits emerging from brass fittings, sigil-etched brass
> plates and chalk-circle floor inlay, gas-mantle 1800K key
> with cyber-cyan rim and occult-violet practicals at sigil
> hot-spots; palette `#c9a14a / #5fa8ff / #0d0a08 / #ff2a8a /
> #5a1a1f / #dccfaa`; Kodak Vision3 500T pushed +1; ARRI Alexa
> anamorphic; volumetric oil-smoke + cyber-mist haze
> z+1.5–3.0 m.

### §AC.0.2 13-state axis grid (for every new room below)

Every new room and every commons sub-zone in this document
carries the canonical Ark-room 13-state axis grid (per
`INCEPTION_ARK_FINAL_PRODUCTION.md` §2.x.6 back-fill convention):

```
AXIS  NAME                              STATES
1     architect-layer geometry          fixed (1 state)
2     floor / walls / ceiling / lights  fixed (1 state)
3     atmosphere + sound + smell        fixed (1 state)
4     objects + camera spawns +         fixed (1 state)
      doorways + story-tie + FX
      + performance budget
5     connection rules                  fixed (1 state)
6     economic surface                  modulated (3 states: idle / active / contested)
7     governance modifier reactions     modulated (per-modifier; e.g.
                                          prestige_unlock_active,
                                          community_milestone)
8     tournament / event window         modulated (off / qualifier / finals / champion)
9     TV-infection                      5 states (clean / exposed / spreading / corrupted / quarantined)
10    epoch / shadowtongue              4 states (low / rising / high / grand-edit)
11    cycle-phase lighting              4 states (dawn / balanced / dimming / long-night)
12    faction livery                    8 states (none / hierarchy /
                                          dreamers / pureflame /
                                          insurgency / panopticon /
                                          collectors / multi)
13    storyteller hooks + HUD overlap   open list (mystery-arc bindings,
                                          investigation tier, expansion-
                                          reserved zones)
```

For brevity the 13-axis grid below is rendered as a 13-row
table per room with the canonical state-list per axis.

### §AC.0.3 Cutscene template inheritance

All cutscenes in §AC.5 below inherit the
`_PRODUCTION_CUTSCENE_PROMPTS.md` §G.0 framework:
- model: `gemini-3-pro-image-preview` for stills, `veo-3.1-generate-001`
  for video
- aspect: 21:9 cinematic, 16:9 video
- canonical FPV trait-lock + canonical negative-prompt
- pipeline metadata (nb2_seed / veo_seed / cdn_target / vo_manifest_ref)
- AND `<APPRENTICE_AESTHETIC>` inline in every NB2 + Veo prompt

The §G.0.4 CDN convention applies: each apprentice cutscene
deposits at `cdn/client-public/cutscenes/<cs_id>/{start,end}.png +
clip.mp4 + audio_post.wav + meta.json`.

---

## §AC.1 New rooms — Apprentice cohort spaces (10 rooms)

### §AC.1.1 A.50 The Apprentice Hall — FULL

**Status: FULL spec.** The main commons-bonded gathering space
for the 12-apprentice cohort during the 28-day trial. The room
the runtime `apps/shared/apprentices.ts` lifecycle implies but
never names; the room where commons banter scenes co-occur
when an apprentice is featured.

#### Header

```
space_id:        ark.apprentice_hall
space_name:      The Apprentice Hall
space_type:      ark_room
act_introduced:  Act 2 (apprentice system unlocks)
lore_anchor:     loredex.system.apprentice + arc.apprentice_trial + arc.cohort_bonding
aesthetic_tier:  steampunk_cyberpunk_occult  (APPRENTICE_AESTHETIC)
```

#### Geometry

```
dimensions:           20.00 m × 16.00 m × 5.20 m
origin_point:         centre of floor at south entry threshold
coordinate_axes:      +x = right, +y = forward (north), +z = up
floor_plan_geometry:  rectangular with 4 m × 4 m alcove offset at NE corner (the Mentor's Bench alcove)
volumetric_anomalies: none
```

The Apprentice Hall sits adjacent to A.15 Social Hub on the Ark's
domestic deck. Floor area: 320 m² + 16 m² alcove = 336 m². The
hall is multi-zone:

- **South**: 12-station workbench arc (one per archetype, themed
  per APPRENTICE_AESTHETIC archetype-specific overlay)
- **Centre**: 4 m circular chalk-inlay floor sigil ringed by 12
  candle-thuribles on chains z+0–2.4 m descending
- **North**: cohort-roster brass plaque wall (12 brass plaques,
  one per active apprentice; etches in real-time as cohort
  changes)
- **East alcove**: Mentor's Bench (a single mahogany-and-brass
  workbench where graduated mentors sit during open-bench hours)
- **West**: bookshelf wall housing 12 leather-bound archetype-
  ledgers (one per archetype; each ledger is a readable in-world
  document of past apprentice runs)
- **Ceiling**: exposed pneumatic-tube network terminating at a
  central junction; tubes pulse with messages between hall and
  recruit vestibule

#### Floor

```
material_primary:     riveted iron deck plating (1.20 m × 0.60 m sheets)
material_secondary:   brass-rim inlay around the central 4 m sigil-circle
floor_inlay:          chalk-circle (real chalk, smudged at edges) +
                      gold-blood-channel concentric rings at 1.5 / 2.5 / 3.5 m radii
                      (cuneiform sigils etched in brass at each ring)
charge_points:        4 (one at each archetype-cluster of 3 workbenches)
heating_grates:       2 (south wall, NE alcove)
performance:          1.2M tris floor; baked-in oil-stain noise map
```

#### Walls

```
south_wall:    workbench arc back-panel — exposed cog-mechanisms behind glass-front
               cabinets, brass instrument racks, datapad-grafted-to-brass-keyboard
               input panels (12 stations, archetype-themed)
north_wall:    cohort-roster brass plaque wall — 12 etched plaques on a teak-and-brass
               armature; pneumatic-tube cluster at top-centre
east_wall:     bookshelf housing 12 archetype-ledgers + 4 candle-sconce practicals
               at z+1.8 m
west_wall:     stone-and-brass with sigil-etched brass plates at every door-frame; one
               demon-summoning chalkboard 4 m × 2 m at centre (real-chalk drawings updated
               by mentor-NPCs)
trim:          brass armatures at all corners; copper piping running ceiling-to-floor
               at 4 m intervals; fiber-optic conduits laced through copper piping in
               cyber-cyan glow
```

#### Ceiling

```
height:        5.20 m
finish:        exposed iron beams + pneumatic-tube network running NE-SW + central
               junction-box at room centre
fixtures:      8 gas-mantle pendant lamps at 1800 K (z+4.0 m, hung on brass chains);
               12 candle-thurible cluster on chains descending to z+0–2.4 m around
               central sigil-circle; 4 cyber-cyan fiber-optic ribbons running E-W
               at z+4.8 m
```

#### Lighting

```
ambient:       40 lux ground level (warm-dim domestic)
key:           1800 K gas-mantle pendants (8 at z+4.0 m)
fill:          5400 K diffuse from west wall sconces (4)
rim:           6500 K cyber-cyan from fiber-optic ribbons z+4.8 m
practical:     12000 K occult-violet at the central sigil-circle nodes (12 candle
               thuribles; flickering)
```

#### Atmosphere

```
temperature:   18°C
humidity:      35%
smell:         incense + machine-oil + leather + candle-wax (burnt + extant)
sound:         gas-mantle hiss bed at -32 dB; fiber-optic hum 60 Hz at -38 dB;
               candle-flicker rolling; pneumatic-tube whoosh every 12–40 s
               (parametric to message-traffic); distant chant-loop at -40 dB
               (apprentice cohort vocal-warm-ups)
```

#### Sound

```
reverb:        2.4 s (room-tone)
ambient_bed:   gas-mantle + fiber-optic hum + candle-flicker + chant
SFX_hooks:     cohort-plaque-etching brass-tap (random 30–120 s); pneumatic-tube
               arrival-thunk (random 20–60 s); chalkboard-chalk-tap (when mentor
               present); ledger-page-flip (random 60–180 s)
```

#### Objects (full inventory)

```
- 12 archetype workbenches (south arc):
    - mahogany top with brass rim, cog-mechanism glass cabinet below,
      datapad input panel, candle-sconce, archetype-themed tool selection:
        Zealot:    sermon-pulpit-bench with brass scripture-wheel + gas-mantle aureole
        Ghost:     low silent-bench with retina-tracking eye-camera on swing-arm
        Scholar:   library-stack-bench with 12 readable cipher-volumes + brass page-marker
        Revenant:  blood-channel-bench with sacrificial-bowl drip-port (drains to chalk-circle)
        Artisan:   crafting-bench with 24 brass-rack tool slots + cog-vice
        Oracle:    scrying-bench with 4-card tarot display under glass + neural-jack port
        Wanderer:  map-bench with 36 leather-bound region-atlases on a swivelling rack
        Martyr:    altar-bench with redirect-rune brass plate + bandage-kit drawer
        Heretic:   debate-bench with chalkboard-back + brass debate-bell
        Jester:    juggling-bench with 6 brass juggling-clubs + retort-card stack
        Sentinel:  watch-bench with 8-monitor cyber-cyan surveillance grid + brass siren-key
        Prodigal:  return-bench with two seats (one always empty) + locked drawer

- 1 central sigil-circle (4 m diameter chalk + gold-blood-channel + 12 candle-thuribles)

- 1 cohort-roster brass plaque wall (12 plaques, etching mechanism on rear armature)

- 1 Mentor's Bench (NE alcove; mahogany-and-brass workbench, 2 chairs, brass kettle)

- 12 archetype-ledgers (west bookshelf; each leather-bound, ~400 pages, readable lore)

- 1 demon-summoning chalkboard (west wall; 4 m × 2 m; mentor-NPC updates with chalk drawings)

- 4 charge-points (one per archetype-cluster of 3 workbenches)

- 2 heating-grates (south wall, NE alcove)

- 8 gas-mantle pendants + 12 candle-thuribles + 4 cyber-cyan fiber-optic ribbons

- 1 pneumatic-tube central junction-box (ceiling centre; 12 tubes radiating)
```

#### Camera spawns

```
- cs_apprentice_hall_first_arrival     (centre of room, FPV at +1.65 m, looking N)
- cs_apprentice_hall_cohort_etched     (north plaque wall close-up)
- cs_apprentice_hall_mentor_open_hours (NE alcove, mentor seated)
- cs_apprentice_hall_sigil_lit         (centre sigil-circle, candles all lit)
- cs_apprentice_hall_pneumatic_arrival (south door, message-tube arriving)
```

#### Doorways

```
- south_main_door: connects to A.15 Social Hub (1.20 m × 2.20 m brass-rim
                   double-door with sigil-etched plate; sigil glows cyan when
                   apprentice is on cohort)
- north_passage:   connects to A.51 Trial Hall (1.50 m × 2.40 m vault-door
                   with brass cog-mechanism opening; locked except during
                   trial graduation events)
- east_alcove:     connects to A.53 Apprentice Cellblock (1.10 m × 2.10 m
                   wooden door with brass keyhole; cohort-only access)
- west_passage:    connects to A.52 Recruit Vestibule (1.20 m × 2.20 m
                   leather-bound door with eye-camera surveillance)
```

#### Story-tie

The Apprentice Hall is the social heart of the apprentice
system. When `apps/server/routers/apprenticeTrial.ts` writes
`apprentice_trial_completed_<archetype>`, the cohort-roster wall
etches the new graduate's plaque (real-time animation triggered
by the runtime). When the runtime writes
`apprentice_trial_graduated_any`, the central sigil-circle's 12
candles all light simultaneously. Permadeath dim-out: when an
apprentice dies, their plaque dim-down and the corresponding
workbench's candle-sconce snuffs.

#### FX

```
- candle-flicker on 12 thuribles + 12 workbench sconces
- gas-mantle gentle pulse (4 s cycle) on 8 pendants
- fiber-optic ribbon shimmer (cyan, 0.4 Hz)
- sigil-circle gold-blood-channel: occult-violet glow when sigil active
- cohort-roster plaque-etching: brass-spark micro-particle on plaque etch event
- pneumatic-tube whoosh visible cyan-mist trail
```

#### Performance

```
tris:          2.4M
materials:     32
lights:        24 (8 pendants + 12 thuribles + 4 sconces + sigil-circle baked)
shadow_casters: 16
mem_budget:    640 MB
```

#### 13-state axis grid

| axis | state-list (canonical) |
|---|---|
| 1 architect-layer | fixed |
| 2 floor/walls/ceiling/lights | fixed |
| 3 atmosphere + sound + smell | fixed |
| 4 objects + cameras + doorways + story-tie + FX + perf | fixed |
| 5 connection rules | south↔social_hub; north↔trial_hall; east↔cellblock; west↔recruit_vestibule |
| 6 economic surface | idle (no cohort) / active (cohort training) / contested (apprentice betrayal in progress) |
| 7 governance modifier reactions | `apprentice_trial_active` → workbench candles all lit; `cohort_milestone` → cohort-plaque mass-etch animation; `apprentice_betrayal_active` → west chalkboard self-erases |
| 8 tournament / event window | off (no graduation pending) / qualifier (1 apprentice at trial-day-21+) / finals (graduation week) / champion (graduation day; full sigil-circle ignites) |
| 9 TV-infection | clean / exposed (mycelium thread on cohort plaques) / spreading (candles flicker out one-by-one) / corrupted (sigil-circle inverts; floor-channel runs corruption-pink) / quarantined (yellow-tape across all workbench glass-cabinets, sealed-X across central sigil) |
| 10 epoch / shadowtongue | low (canonical) / rising (occult-violet practicals brighten 20%) / high (sigil-circle hums 8 Hz sub-bass; chant-loop -28 dB) / grand-edit (one archetype-ledger rewrites itself with indigo marginalia) |
| 11 cycle-phase lighting | dawn 5800K (gas-mantles dimmer, fiber-optic brighter) / balanced 5400K canonical / dimming 5200K / long-night 4800K (only candles + fiber-optic, gas-mantles off) |
| 12 faction livery | none (canonical) / hierarchy (gold-blood-channel intensified, blood-red wall trim) / dreamers (one Pool-of-Tears miniature added to centre table) / pureflame (forge-orange undertint, ember-flame z+0.3 m permanent) / insurgency (rebel-amber sconces) / panopticon (eye-camera count doubles to 24) / collectors (specimen-jar shelf added to NE alcove) / multi (palette mixing — used during war / coalition events) |
| 13 storyteller hooks + HUD overlap | mystery-arc binding: the locked-drawer Prodigal workbench reveals at end-of-Act-7 (player's predecessor's letter). Investigation tier: initial / investigating (yellow tape on Prodigal drawer) / partial (cyan tape) / case-closed (drawer open, letter readable). HUD overlap: cohort-roster plaque wall doubles as the apprentice-system UI when player toggles `roster-mode`. Expansion-reserved zones: Mentor's Bench has a reserved second-mentor seat for Act 8+ DLC. |

#### Art resources needed

Textures (steampunk-cyberpunk-occult):
- `apprentice_hall_floor_iron_plating.png` (4K seamless)
- `apprentice_hall_wall_brass_armature.png`
- `apprentice_hall_wall_demon_chalkboard.png`
- `apprentice_hall_ceiling_pneumatic_tubes.png`
- `apprentice_hall_sigil_circle_inlay.png` (4K, alpha for chalk-edge)
- `apprentice_hall_workbench_<archetype>.png` × 12 (per archetype variant)
- `apprentice_hall_cohort_plaque_blank.png` + `_etched.png`
- `apprentice_hall_archetype_ledger_<archetype>.png` × 12 (cover variants)

Models (3D):
- `apprentice_hall_workbench_zealot.glb` … 12 archetype variants
- `apprentice_hall_pendant_lamp.glb`
- `apprentice_hall_candle_thurible.glb`
- `apprentice_hall_pneumatic_tube_junction.glb`
- `apprentice_hall_cohort_plaque_armature.glb`
- `apprentice_hall_archetype_ledger.glb`
- `apprentice_hall_mentor_bench.glb`
- `apprentice_hall_eye_camera_swingarm.glb`

NB2 reference still (for art-direction handoff):
```
nb2:
  model: gemini-3-pro-image-preview
  aspect_ratio: "21:9"
  resolution: "4K"
  reference_images:
    - cdn/client-public/art/refs/social_hub_warm_domestic.png
  prompt: |
    SUBJECT: the Apprentice Hall on the Ark — a 20×16×5.2m
      multi-zone hall, 12-station archetype workbench arc along
      the south wall (each bench themed: pulpit-bench / silent-
      bench / library-stack-bench / blood-channel-bench / etc.),
      central 4m chalk-inlay sigil-circle ringed by 12 candle-
      thuribles on chains z+0–2.4m descending, north cohort-
      roster wall with 12 etched brass plaques, west bookshelf
      with 12 leather-bound archetype-ledgers, NE Mentor's Bench
      alcove with mahogany-and-brass workbench, ceiling
      pneumatic-tube network terminating at central junction.
    COMPOSITION: wide establishing, 24mm, eye-level +1.65m, deep
      DOF, vanishing point on north plaque wall.
    LIGHTING/CAMERA: 1800K gas-mantle pendant key (8 at z+4.0m);
      5400K diffuse fill from west sconces; 6500K cyber-cyan rim
      from fiber-optic ribbons at z+4.8m; 12000K occult-violet
      practicals at sigil-circle thuribles; ARRI Alexa
      anamorphic; Kodak Vision3 500T pushed +1.
    STYLE: APPRENTICE_AESTHETIC: steampunk-cyberpunk-occult;
      brass armatures and copper piping with cyber-cyan fiber-
      optic conduits emerging from brass fittings, sigil-etched
      brass plates and chalk-circle floor inlay, palette
      `#c9a14a / #5fa8ff / #0d0a08 / #ff2a8a / #5a1a1f /
      #dccfaa`; volumetric oil-smoke + cyber-mist haze
      z+1.5–3.0m.
    CONSTRAINTS: standard NB2 constraints; FPV trait-lock — only
      player's gloved hands enter lower frame from below.
    Output 4K, 21:9.
pipeline:
  nb2_seed: 170001
  cdn_target: cdn/client-public/art/refs/apprentice_hall_master_still.png
```

---

### §AC.1.2 A.51 The Trial Hall — FULL

**Status: FULL spec.** The graduation-ceremony venue and the
permadeath-resolution venue. The 28-day apprentice trial
culminates here — a successful candidate is etched into the
Mentor's Roll; a failed candidate is given final rites and the
permadeath flag is written.

#### Header

```
space_id:        ark.trial_hall
space_name:      The Trial Hall
space_type:      ark_room
act_introduced:  Act 2
lore_anchor:     loredex.system.apprentice_trial + arc.apprentice_graduation + arc.apprentice_permadeath
aesthetic_tier:  steampunk_cyberpunk_occult
```

#### Geometry

```
dimensions:           14.00 m × 14.00 m × 7.20 m
origin_point:         centre of floor at south door threshold
floor_plan_geometry:  square with raised 1.20 m central dais (3 m diameter)
volumetric_anomalies: ceiling-vault rises to z+7.20 m at centre
```

#### Floor / walls / ceiling / lighting (compact)

```
floor:    black-marble + gold-blood-channel inlay; central brass dais 3m diameter
walls:    black-stone with 12 sigil-etched brass plates (one per archetype) at z+1.5m;
          cog-mechanism armature visible at upper z+5–7 m; fiber-optic conduits running
          ceiling-to-dais
ceiling:  ribbed cathedral-vault to z+7.2m at centre; 12-pointed sigil
          inscribed in brass at apex; 4 hanging-chain candle-clusters
          descending z+5.0 m to z+2.5 m
key:      1800K candle (12 cluster-lights) + 6500K cyber-cyan from
          dais-rim fiber-optic; 12000K occult-violet at apex sigil
fill:     none (ceremonial dim)
ambient:  20 lux ground (intentionally dim; ceremonial)
```

#### Atmosphere + sound

```
temperature: 14°C   # cold ceremonial
humidity:    25%
smell:       incense (heavy) + cold-stone + parchment
sound:       6.4 s reverb (cathedral-grade); chant-loop bed at -28 dB; sub-bass 12 Hz
             when ceremony active; absolute-silence mode during permadeath rites
```

#### Objects

```
- 1 central brass dais (3m diameter, 1.20m raised; chalk-circle on dais top)
- 12 perimeter brass-plates (one per archetype, sigil-etched)
- 1 Mentor's Roll (mahogany pulpit at south of dais; brass-bound book; readable)
- 1 dais-rim fiber-optic ribbon (cyber-cyan; ignites during ceremony)
- 4 hanging candle-clusters (descending; lit only during ceremony)
- 12 perimeter candle-sconces (lit per active apprentice during their trial)
- 1 permadeath bell (bronze; rung once for permadeath rites)
- 1 graduation tassel-rack (12 silk tassels, one per archetype, hung at south)
```

#### Camera spawns

```
- cs_trial_hall_first_arrival
- cs_trial_hall_graduation_ceremony   (12 archetype-specific variants)
- cs_trial_hall_permadeath_rites      (12 archetype-specific variants)
- cs_trial_hall_bell_rung
- cs_trial_hall_mentors_roll_etched
```

#### Doorways

```
south:  connects to A.50 Apprentice Hall (vault-door 1.50 m × 2.40 m, brass cog-mechanism;
        opens only during ceremony)
north:  connects to A.55 Mourning Wall (1.20 m × 2.20 m wooden door with brass keyhole;
        opens only after permadeath rite)
```

#### Story-tie

When `apprenticeTrial.recordCompletion(graduated=true)` fires,
the Trial Hall's south door opens, the cohort enters, the
permadeath bell stays silent, and the candidate ascends the
dais. When `graduated=false`, the bell rings once. Mentor's
Roll etching is animated by the runtime in real-time.

#### FX + performance

```
FX:           candle-flicker (16 lights); fiber-optic dais-rim shimmer;
              apex-sigil pulse (only during ceremony); brass-bell vibration shimmer
performance:  1.6M tris; 320 MB; 28 lights
```

#### 13-state axis grid

| axis | state-list |
|---|---|
| 1–4 | fixed (per above) |
| 5 connection rules | south↔apprentice_hall; north↔mourning_wall (one-way after permadeath) |
| 6 economic | idle (no ceremony) / active (graduation/permadeath underway) / contested (split-cohort vote, multi-apprentice rite) |
| 7 governance | `apprentice_graduation_pending` → south door warms cyan; `apprentice_permadeath_pending` → bell-rope drops |
| 8 tournament | off / qualifier / finals (cohort gathered) / champion (12-archetype simultaneous graduation — once-per-cycle; perimeter brass-plates all glow) |
| 9 TV-infection | clean / exposed (mycelium on Mentor's Roll) / spreading (apex sigil drips corruption-pink) / corrupted (dais inverts to floor-pit) / quarantined (yellow-X across south door) |
| 10 epoch / shadowtongue | low / rising / high (chant-loop +6 dB) / grand-edit (Mentor's Roll page rewrites with indigo) |
| 11 cycle-phase | dawn / balanced / dimming / long-night (only apex sigil + dais-rim fiber-optic visible) |
| 12 faction livery | none / hierarchy (gold-blood-channel intensified, blood-red dais cloth) / dreamers / pureflame / insurgency / panopticon / collectors / multi |
| 13 storyteller | mystery-arc: Mentor's Roll has 4 reserved blank pages — last one inscribes the player's choice at end-of-Act-7. Investigation: initial / investigating / partial / case-closed (final blank inscribes player legacy phrase). |

#### Art resources

Textures: `trial_hall_floor_black_marble.png`, `trial_hall_wall_sigil_plates.png`,
`trial_hall_ceiling_apex_sigil.png`, `trial_hall_dais_brass.png`,
`trial_hall_mentors_roll_pulpit.png`, `trial_hall_permadeath_bell.png`.
Models: `trial_hall_dais.glb`, `trial_hall_apex_sigil.glb`,
`trial_hall_mentors_roll_pulpit.glb`, `trial_hall_permadeath_bell.glb`,
`trial_hall_candle_cluster.glb`.

---

### §AC.1.3 A.52 The Recruit Vestibule — COMPACT FULL

```
space_id: ark.recruit_vestibule
size: 8.00 m × 6.00 m × 3.20 m
purpose: initial interview chamber where new apprentices arrive;
  the runtime's `recruit` UI opens onto this room
zones: 1 interview-bench (south); 1 archetype-detection
  brass-armature scrying-mirror (north — reads candidate's
  archetype affinity via neural-jack contact); 1 leather-bound
  recruit-ledger pulpit (east); 1 eye-camera surveillance bank
  (west; 6 cameras on swing-arms)
floor: brass-rim parquet with chalk-circle inlay at interview-bench foot
walls: leather-padded with brass studs; cyber-cyan fiber-optic conduits in
  exposed cog-mechanism cabinets behind glass at east wall
ceiling: 3.20 m; gas-mantle pendant + 4 candle-sconces; 1 fiber-optic ribbon
lighting: 1800K key + 6500K cyan rim + 12000K violet practical at scrying-mirror
atmosphere: incense + leather + ozone; reverb 1.6 s
camera_spawns:
  - cs_recruit_first_meet_<archetype>   (12 variants, one per archetype)
  - cs_recruit_archetype_revealed
  - cs_recruit_signature_inked
doorways:
  - east: connects to A.50 Apprentice Hall (cohort entry after acceptance)
  - south: connects to corridor (recruit ingress)
13-axis grid (compact):
  6 economic: idle / active (interview underway) / contested (rejection)
  7 governance: `recruit_offer_extended` → south door warms cyan
  8 event window: off / qualifier (recruit en route) / finals (interview live) / champion (acceptance ceremony)
  9 TV: clean / exposed (mirror clouds) / spreading (mirror cracks) /
        corrupted (mirror reflects scrying-mirror's interior corruption) / quarantined
  10 epoch: low / rising / high / grand-edit (mirror rewrites archetype-detection result)
  11 cycle: dawn / balanced / dimming / long-night
  12 faction: none / 8 faction states (each tints the scrying-mirror frame)
  13 storyteller: locked-drawer in recruit-ledger pulpit reveals at Act-3 (predecessor's
     recruit-record); HUD overlap: scrying-mirror is the recruit-archetype-detection UI
art_resources:
  textures: recruit_vestibule_wall_leather_padded.png,
    recruit_vestibule_scrying_mirror_frame.png,
    recruit_vestibule_eye_camera_bank.png
  models: recruit_vestibule_interview_bench.glb,
    recruit_vestibule_scrying_mirror.glb (animated),
    recruit_vestibule_recruit_ledger_pulpit.glb,
    recruit_vestibule_eye_camera_swingarm.glb (×6)
performance: 0.6M tris; 128 MB; 12 lights
```

---

### §AC.1.4 A.53 The Apprentice Cellblock — FULL (12 themed cells)

**Status: FULL spec, with 12 archetype-themed cell sub-zones.**
A residential corridor housing 12 archetype cells. Each cell is
4 m × 3 m × 2.8 m, themed per APPRENTICE_AESTHETIC archetype-
specific overlay. Apprentices live here during the 28-day trial.

#### Header

```
space_id:       ark.apprentice_cellblock
space_name:     The Apprentice Cellblock
space_type:     ark_room
act_introduced: Act 2
lore_anchor:    loredex.system.apprentice + arc.cohort_residence
aesthetic_tier: steampunk_cyberpunk_occult
```

#### Geometry

```
dimensions:    24.00 m × 6.00 m × 2.80 m  (corridor + 12 cells offset 4m × 3m each side)
floor_plan:    central 6 m × 24 m corridor with 6 cells on each long side; cell openings are
               1 m × 2.10 m wooden doors with brass keyholes
```

#### Cell sub-zones (per-archetype)

Each cell is 4 m × 3 m × 2.80 m = 12 m². Each is a single sub-
zone with its own §4 inventory. The shared corridor is the
13th sub-zone.

| cell § | archetype | distinguishing fixtures | palette accent |
|---|---|---|---|
| §AC.1.4.1 | Zealot | sermon-pulpit instead of desk; brass scripture-wheel z+1.4 m wall-mount; gas-mantle aureole over single-cot bed; cipher-bible on bedside | brass + parchment-cream |
| §AC.1.4.2 | Ghost | low silent-bed (no frame; cot on floor); 3 retina-tracking eye-cameras on swing-arms tracking the bed; 1 black-curtain rod across cell-half; no candle-sconce — only fiber-optic underglow | occult-black + cyber-cyan |
| §AC.1.4.3 | Scholar | floor-to-ceiling library-stack-shelving (200+ readable cipher-volumes); reading-bench with brass page-marker; 12 candle-sconces (more candles than any other cell); footnote-chalkboard | parchment-cream + brass |
| §AC.1.4.4 | Revenant | iron-frame bed with leather-strap restraints (decorative — never used); blood-channel inlay on cell-floor draining to a small sacrificial-bowl in corner; brass scarification-tool rack | blood-red + brass |
| §AC.1.4.5 | Artisan | 24-tool brass-rack workbench; cog-vice; 4 active project shelves (rotating; visible work-in-progress); spare-parts drawer cluster | brass + machine-oil-amber |
| §AC.1.4.6 | Oracle | 4 tarot cards under glass at corners of cell; ceiling-mounted scrying-mirror (suspended); neural-jack port at bedside; tea-service for 2 (one always set for an absent guest) | corruption-pink + cyber-cyan |
| §AC.1.4.7 | Wanderer | 36 leather-bound region-atlases on swivelling rack; bedroll instead of bed (always packed); brass walking-stick at door; 1 small fire-pit (real-flame practical) at cell-centre | brass + fire-amber |
| §AC.1.4.8 | Martyr | iron altar-bed with redirect-rune brass plate at headboard; bandage-kit in every drawer; chalk-circle on floor with own name written and crossed out | brass + blood-red |
| §AC.1.4.9 | Heretic | chalkboard-wall (every wall is chalkboard, ceiling included); brass debate-bell hanging at door; 4 candle-sconces spelling out a heretical sigil; book-pyre-ready stove (cold) | occult-black + chalk-white |
| §AC.1.4.10 | Jester | 6 brass juggling-clubs on rack; retort-card stack 200+ on bedside; 1 brass-frame mirror that shows the player as a different person; bedposts carved as laughing skulls | brass + corruption-pink |
| §AC.1.4.11 | Sentinel | 8-monitor cyber-cyan surveillance grid covering one wall (showing all apprentice-hall cameras); brass siren-key on bedside; cot positioned for 360° room visibility; alarm-bell at door | cyber-cyan + brass |
| §AC.1.4.12 | Prodigal | two single-cots (one always empty, made up); locked drawer at empty-cot bedside; framed photograph (face scratched out) on wall; brass-bound returnee-letter visible on desk | brass + parchment-cream |
| §AC.1.4.13 | Corridor | shared 24×6×2.8m; 12 brass nameplates on doors; 8 gas-mantle wall-pendants; 4 candle-sconces; 1 pneumatic-tube line running ceiling N-S; eye-camera at each end | brass + cyber-cyan |

#### Camera spawns (cellblock)

```
- cs_cell_first_residence_<archetype>     (12 variants — first night per archetype)
- cs_cell_corridor_first_walk
- cs_cell_corridor_morning_bell
- cs_cell_corridor_permadeath_door_sealed (12 variants — corridor view of one cell sealing)
```

#### Doorways

```
south: connects to A.50 Apprentice Hall (east-alcove door)
north: connects to A.54 Hellbox Clone Bench (single brass-keyhole door)
```

#### Story-tie

When an apprentice graduates, their cell door's brass nameplate
is replaced with a brass-bound graduation-tassel mount. When an
apprentice permadeaths, the corridor camera pans to their cell
and the door seals with a brass-bound seal (visible to
subsequent cohort members). The room's runtime is per-archetype
(`apprentice.archetype` field reads from `apps/shared/apprentices.ts`
and selects the cell's sub-zone).

#### 13-state axis grid (cellblock — corridor canonical, sub-zone variants noted)

| axis | state-list |
|---|---|
| 1–4 | fixed per cell |
| 5 connection | south↔apprentice_hall; north↔hellbox_clone_bench; per-cell↔corridor |
| 6 economic | idle (cohort asleep) / active (cohort awake) / contested (intra-cohort feud underway) |
| 7 governance | `apprentice_in_residence_<archetype>` → that cell's sigil sconce ignites; `apprentice_permadeathed_<archetype>` → corridor brass-seal animation on cell door |
| 8 event | off / qualifier / finals / champion |
| 9 TV-infection | clean / exposed (cell-corner mycelium) / spreading (cohort-wide candle dim-out) / corrupted (cell-floor blood-channel runs corruption-pink) / quarantined |
| 10 epoch | low / rising / high / grand-edit (per-archetype ledger entry rewrites) |
| 11 cycle | dawn / balanced / dimming / long-night |
| 12 faction | none / 8 faction states (per-cell faction allegiance shows on cell-door brass plate) |
| 13 storyteller | per-cell mystery-arc bindings (Prodigal locked-drawer reveals predecessor letter Act-7; Sentinel surveillance-grid shows player's earliest crime Act-5; Oracle scrying-mirror reveals Game Master Act-6); HUD overlap: corridor doubles as cohort-status UI |

#### Art resources

12 cell-themed environment kits + 1 corridor kit:
`apprentice_cell_<archetype>/floor.png`, `walls.png`, `ceiling.png`,
`fixtures.glb`, `bed.glb`, `archetype_signature_object.glb`. Plus
generic corridor: `apprentice_cellblock_corridor_floor.png`,
`apprentice_cellblock_corridor_walls.png`,
`apprentice_cellblock_brass_nameplate.glb`,
`apprentice_cellblock_brass_seal_animated.glb`.

---

### §AC.1.5 A.54 The Hellbox Clone Bench — COMPACT FULL

```
space_id: ark.hellbox_clone_bench
size: 6.00 m × 4.00 m × 3.60 m
purpose: apprentice-only one-shot Hellbox clone restoration site
  (per `apps/shared/hellboxClone.ts`)
zones: 1 brass-and-iron clone-bench (centre); 1 unread-loredex-entry
  consumption pulpit (south); 1 dream-token + materials + voidCrystals
  intake (east); 1 chalk-circle inlay + 12 sigil-thuribles surrounding
  the clone-bench
fixtures:
  - brass-and-iron clone-bench: 1.80 m × 0.80 m flat surface; brass head-stirrups;
    blood-channel inlay running into floor sigil-circle; 4 fiber-optic conduits
    plugging into bench-side neural-jack ports; gas-mantle key over centre
  - unread-loredex pulpit: leather-bound book on a brass swivel-pulpit; book is
    consumed (one entry stripped) per restoration
  - intake station: 3-drawer brass-and-mahogany cabinet; dream-token slot,
    materials slot, voidCrystals slot
  - 12 sigil-thuribles ringing the bench at z+0–2.4m (parametric to each candle
    representing a still-living apprentice in the cohort)
floor: brass-rim with central 4m chalk-circle (gold-blood-channel inlay; sigils
  at 0.8 / 1.6 / 2.4m radii); blood-channel running south from bench to chalk-
  circle centre then to floor-drain
walls: stone with brass-bound copper piping; cyber-cyan fiber-optic conduits
  laced through piping; 4 sigil-etched brass plates (one per cardinal direction)
ceiling: 3.60 m; central gas-mantle pendant; 4 candle-cluster brass chains
  descending z+3.0–2.0m at corners
lighting: 1800K key (gas-mantle); 6500K cyan rim (fiber-optic); 12000K
  occult-violet practicals at sigil-thuribles
atmosphere: incense + ozone + iron-blood; reverb 2.0 s; chant-loop -32 dB;
  gas-mantle hiss bed
camera_spawns:
  - cs_hellbox_clone_bench_first_view
  - cs_hellbox_clone_bench_restoration_<archetype> (12 variants)
  - cs_hellbox_clone_bench_resurrectionist_neyon_absence (Act-4 reveal)
doorways:
  - south: connects to A.53 Apprentice Cellblock (north door)
  - east: connects to A.04 Engineering Bay (service corridor)
13-axis grid:
  6 economic: idle (no candidate) / active (restoration in progress) /
    contested (player has insufficient resources)
  7 governance: `restoration_pending` → all 12 thuribles ignite;
    `restoration_complete` → loredex-entry consumption animation
  8 event: off / qualifier / finals / champion (only Act-4 first
    restoration triggers champion-state — full sigil-circle ignition)
  9 TV: clean / exposed (clone-bench fiber-optic flickers) / spreading
    (chalk-circle erodes) / corrupted (clone-bench surface phases between
    iron-bench and a hospital-cot) / quarantined
  10 epoch: low / rising / high / grand-edit (restoration produces an
    apprentice with corrupted memories — visible as cyan-eye-glow)
  11 cycle: dawn / balanced / dimming / long-night
  12 faction: none / 8 faction states (changes blood-channel colour;
    hierarchy = gold; pureflame = ember-orange; collectors = preserved-glass)
  13 storyteller: HUD overlap: bench-side neural-jack port shows the
    Hellbox Clone UI inline. Mystery-arc: at Act-7 the bench reveals a
    second set of head-stirrups had been there all along but were hidden
    (the original Resurrectionist Ne-Yon had been working on a second
    bench position simultaneously).
art_resources:
  textures: hellbox_clone_bench_brass_iron_top.png,
    hellbox_clone_bench_blood_channel_floor.png,
    hellbox_clone_bench_sigil_thurible.png,
    hellbox_clone_bench_loredex_pulpit.png
  models: hellbox_clone_bench.glb, hellbox_clone_bench_intake_cabinet.glb,
    hellbox_clone_bench_sigil_thurible.glb, hellbox_clone_bench_loredex_pulpit.glb
performance: 0.8M tris; 192 MB; 16 lights
```

---

### §AC.1.6 A.55 The Mourning Wall — COMPACT FULL

```
space_id: ark.mourning_wall
size: 12.00 m × 4.00 m × 3.20 m   (long narrow corridor-room)
purpose: permadeath obituary memorial; visible record of fallen
  apprentices (per `apps/shared/apprenticeToCrew.ts` mourning sweep)
zones: 1 wall-of-12 brass plaque positions (north wall, full length);
  1 candle-bench (south wall — 12 candle-positions); 1 photograph-
  display alcove (east — readable obituary lore); 1 chant-station
  pulpit (west)
fixtures:
  - 12 brass plaques (one per archetype slot; etches with name +
    archetype + cause of death when permadeath fires; etching
    animation runs per plaque)
  - 12 candles on south candle-bench (one lit per fallen apprentice;
    snuffs after 28 in-game days as the runtime processes mourning sweep)
  - photograph alcove: 12 frames, archetype-themed; photograph
    appears post-permadeath (parametric to the dead apprentice's
    portrait)
  - chant pulpit: brass-bound book with the mourning-cycle text
    (12 archetype-specific dirges; readable lore)
floor: black-marble + gold-blood-channel inlay (single channel
  running east-to-west along the centre)
walls: stone with brass-bound copper piping at corners; the north
  wall is the plaque wall; 4 sigil-etched brass plates between
  plaque-positions
ceiling: 3.20 m; 4 hanging-chain candle-clusters z+2.4m; 1 cyber-cyan
  fiber-optic ribbon spelling the word "REMEMBER" in cipher-script
lighting: 1800K candle key only (intentionally dim for memorial);
  6500K rim; 12000K practical at the photograph alcove
atmosphere: cold-stone + incense + paper-dust; reverb 4.6 s;
  silent except chant-loop bed at -36 dB
camera_spawns:
  - cs_mourning_wall_first_arrival
  - cs_mourning_wall_obituary_<archetype>   (12 variants — one per archetype permadeath)
  - cs_mourning_wall_candle_snuff_28_day
  - cs_mourning_wall_chant_recital
doorways:
  - south: connects to A.51 Trial Hall (one-way; opens only after permadeath rite)
  - east: connects to A.05 Memorial Corridor (existing Ark room; the Mourning Wall is
    structurally an apprentice-specific extension of the Memorial Corridor)
13-axis grid:
  6 economic: idle (no recent permadeath) / active (permadeath rite live) /
    contested (multiple permadeaths in same cycle)
  7 governance: `apprentice_permadeathed_<archetype>` → plaque etching +
    candle ignition; mourning_sweep_complete → all candles snuff
  8 event: off / qualifier / finals (mourning-cycle culminates) / champion
  9 TV: clean / exposed (plaque etchings flicker between names) / spreading
    / corrupted (photograph faces invert) / quarantined
  10 epoch: low / rising / high (chant-loop +6 dB) / grand-edit (one plaque
    rewrites with indigo to a name not yet dead — premonition)
  11 cycle: dawn / balanced / dimming / long-night
  12 faction: none / 8 faction states (per-plaque faction allegiance shows
    on plaque rim)
  13 storyteller: HUD overlap: plaque wall doubles as the apprentice-roster
    obituary UI. Mystery-arc: photograph alcove has 13 frames not 12 — the
    13th is reserved for the player's own end-game obituary if Act-7 ends
    in permadeath.
art_resources:
  textures: mourning_wall_brass_plaque_blank.png,
    mourning_wall_brass_plaque_etched.png,
    mourning_wall_candle_bench.png,
    mourning_wall_photograph_alcove.png
  models: mourning_wall_plaque_armature.glb (animated etching),
    mourning_wall_candle_bench.glb,
    mourning_wall_photograph_frame.glb (×13),
    mourning_wall_chant_pulpit.glb
performance: 0.6M tris; 128 MB; 18 lights
```

---

### §AC.1.7 A.56 The Essence Harvest Sanctum — COMPACT FULL

```
space_id: ark.essence_harvest_sanctum
size: 8.00 m × 8.00 m × 4.00 m
purpose: where `essenceHarvest.harvest` ritual happens (per
  `apps/server/routers/...essenceHarvest`); fighter-essence
  extraction and storage
zones: 1 central altar-bench (chalk-circle inlay); 12-vessel
  glass-fronted essence-vault (north wall); 1 fighter-presentation
  brass-rack (south wall — 6 hooks where the fighter is staged
  before harvest); 1 incense-thurible cluster ceiling (centre)
fixtures:
  - altar-bench: 2.40 m × 1.20 m brass-and-marble; chalk-circle
    inlay around base; blood-channel running to floor sigil; 4
    fiber-optic neural-jack ports at corners
  - essence-vault: 12 glass-fronted brass cabinets at z+1.2–2.6 m;
    each holds a single specimen-jar of essence; vault has
    expansion-reserved slots for 24 (Act 8+ DLC anticipation)
  - fighter-presentation rack: 6 brass hooks at z+1.8 m on south wall
  - thurible-cluster: 8 incense-thuribles on chains z+2.4m descending
floor: brass-rim with central chalk-and-gold-blood-channel sigil
  (3 m diameter); blood-channel running from altar to floor-drain
walls: stone-and-brass with sigil-etched plates (4); demon-summoning
  chalkboard at west wall (mentor-NPC updates with extraction notes)
ceiling: 4.00m; 1 central pendant + 8 thurible-chains; 4 fiber-optic
  ribbons running E-W
lighting: 1800K candle/gas-mantle; 6500K cyan rim; 12000K violet at
  thurible cluster
atmosphere: incense (heavy) + ozone + iron-blood + machine-oil;
  reverb 3.2 s; chant-loop -28 dB; sub-bass 8 Hz when extraction active
camera_spawns:
  - cs_essence_harvest_sanctum_first_arrival
  - cs_essence_harvest_first   (the canonical first-time-harvest cut;
    cross-ref to §G.13.B `cs_clone_substrate_confirmation` palette)
  - cs_essence_harvest_veteran  (10th-stack-of-fighter cut)
  - cs_essence_harvest_vault_full   (all 12 essence-vault slots filled)
doorways:
  - south: connects to A.54 Hellbox Clone Bench (essence supplies
    feed the clone-bench restoration)
  - north: connects to A.04 Engineering Bay
13-axis grid:
  6 economic: idle / active (extraction underway) / contested
    (insufficient stack)
  7 governance: `essence_harvest_first` → vault-cabinet 1 ignites;
    `essence_harvest_veteran` → all 12 cabinets ignite for 24h;
    `essence_harvest_vault_full` → expansion-reserved slot reveal
  8 event: off / qualifier / finals / champion (vault-full state)
  9 TV: clean / exposed / spreading / corrupted (vault contents
    invert — essence-jars become predator-jars) / quarantined
  10 epoch: low / rising / high / grand-edit (one essence-jar
    rewrites itself to a different fighter)
  11 cycle: dawn / balanced / dimming / long-night
  12 faction: 8 faction states (changes blood-channel colour and
    vault-cabinet trim)
  13 storyteller: HUD overlap: essence-vault wall doubles as
    essence-stack UI. Mystery-arc: vault has 1 hidden 13th cabinet
    behind the south wall — reveals at Act-7 (player's own essence
    has been harvested all along by an unknown party).
art_resources:
  textures: essence_harvest_altar_brass_marble.png,
    essence_harvest_vault_glass_front.png,
    essence_harvest_specimen_jar.png,
    essence_harvest_thurible_cluster.png
  models: essence_harvest_altar.glb, essence_harvest_vault_cabinet.glb,
    essence_harvest_specimen_jar.glb, essence_harvest_thurible.glb
performance: 0.9M tris; 224 MB; 22 lights
```

---

### §AC.1.8 A.57 The Blood Weave Atrium — COMPACT FULL

```
space_id: ark.blood_weave_atrium
size: 12.00 m × 12.00 m × 8.00 m   (vertical-emphasis chamber)
purpose: visual manifestation of `apps/shared/bloodWeave.ts`
  hierarchyAlignment 5 bands (dormant → braiding → woven → bound →
  claimed); 12-loredex-reveal pool gating Game-Master meta-arc
zones: 1 central braiding-pillar (8m tall, brass-and-glass); 12
  loredex-display alcoves (perimeter at z+0–2.4m); 1 alignment-
  reading-pulpit (south); 1 catwalk at z+4.0m circling the pillar
fixtures:
  - braiding-pillar: an 8 m tall brass-and-glass column at room
    centre; the pillar's interior holds a slow-braiding rope made
    of six strands (one per visual-band thread + a central spine);
    rope movement is parametric to bloodWeave.alignment value;
    rope-state visible to player via glass column at z+0–8m
  - 12 loredex alcoves: brass-framed glass cases at perimeter;
    each holds one of the 12 loredex entries from the bloodWeave
    pool; alcove illumination ignites as the corresponding
    threshold (1, 2, 3, 5, 7, 9, 12, 15, 20, 25, 30, 40) is crossed
  - alignment-reading pulpit: brass-bound book at south; book's
    open page shows current alignment value + band name in
    illuminated cipher
  - catwalk at z+4m: 1.20m wide brass walkway; 4 access-stairs
    at corners
floor: brass-rim with central 4m chalk-circle around the
  braiding-pillar base; gold-blood-channel inlay
walls: stone with sigil-etched brass plates at every catwalk
  pillar; cyber-cyan fiber-optic conduits running floor-to-ceiling
  at 12 perimeter positions (one per loredex alcove)
ceiling: 8.00m; coffered with brass-bound apex sigil; central
  pendant chandelier
lighting: 1800K candle key (perimeter); 6500K cyan rim
  (fiber-optic conduits); 12000K violet practicals at the pillar
  apex
atmosphere: incense + ozone + iron-blood; reverb 5.2 s; sub-bass
  16 Hz on alignment-shift; absolute-silence between thresholds
camera_spawns:
  - cs_blood_weave_atrium_first_arrival
  - cs_blood_weave_band_transition_dormant_to_braiding   (alignment 1)
  - cs_blood_weave_band_transition_braiding_to_woven     (alignment 5)
  - cs_blood_weave_band_transition_woven_to_bound        (alignment 15)
  - cs_blood_weave_band_transition_bound_to_claimed      (alignment 30)
  - cs_blood_weave_loredex_revealed_<n>                  (12 variants — one per threshold)
  - cs_blood_weave_pillar_full_braid                     (alignment 40+)
doorways:
  - south: connects to A.10 Hierarchy Throne (existing — the Atrium is
    the lore-bridge to the Throne)
  - north: connects to A.51 Trial Hall (graduating apprentices enter
    via the Atrium for blood-weave attribution)
13-axis grid:
  6 economic: idle / active (alignment shift in progress) /
    contested (player attempting to lower alignment via cleansing rite)
  7 governance: `blood_weave_alignment_<n>` → pillar-strand braiding
    state shifts; `blood_weave_threshold_crossed_<n>` → corresponding
    alcove ignites
  8 event: off / qualifier / finals (player approaching threshold) /
    champion (claimed-band; pillar fully braided)
  9 TV: clean / exposed / spreading / corrupted (rope unweaves
    randomly) / quarantined
  10 epoch: low / rising / high / grand-edit (rope rewrites itself
    with cipher-script)
  11 cycle: dawn / balanced / dimming / long-night
  12 faction: 8 faction states (each gives the pillar a different
    rope-fibre dominant colour)
  13 storyteller: HUD overlap: the alignment-reading pulpit is the
    bloodWeave UI. Mystery-arc: at alignment 40+ the pillar reveals
    that the rope is not the player's alignment — it is the
    Hierarchy's claim on the player. Game Master meta-arc unlock.
art_resources:
  textures: blood_weave_pillar_glass_column.png,
    blood_weave_rope_strand_<band>.png × 5,
    blood_weave_loredex_alcove_frame.png,
    blood_weave_alignment_pulpit.png
  models: blood_weave_pillar.glb (animated rope-state),
    blood_weave_loredex_alcove.glb,
    blood_weave_alignment_pulpit.glb,
    blood_weave_catwalk_section.glb
performance: 1.4M tris; 384 MB; 32 lights
```

---

### §AC.1.9 A.58 The Personal Quest Ledger Room — COMPACT FULL

```
space_id: ark.personal_quest_ledger
size: 10.00 m × 8.00 m × 3.20 m
purpose: apprentice personal-quest tracking room; consumes
  `apprentice_personal_quest_progress` table state
zones: 1 ledger-wall (north — 12 brass-bound personal-quest ledgers,
  one per active or graduated apprentice); 1 quest-card-table
  (centre — current-cohort quest cards arranged for review);
  1 deliverable-display alcove (east — relics from completed quests);
  1 outstanding-quest pulpit (west)
fixtures:
  - 12 personal-quest ledgers on north wall; each opens to current
    quest progress; ledger animations on milestone events
  - quest-card-table: 12-slot brass-rim table; one card per active
    apprentice's current quest beat
  - deliverable alcove: 12 glass-fronted display cases at z+0.6–2.0m;
    each holds the quest-completion relic
  - outstanding-quest pulpit: brass-bound book at west; lists
    quests awaiting player attention
floor: parquet with brass-rim; central rug (deep-red, ornate
  pattern); chalk-circle inlay around quest-card-table
walls: leather-padded with brass studs; cyber-cyan fiber-optic
  conduits in cog-mechanism cabinets behind glass
ceiling: 3.20m; 4 gas-mantle pendants + 8 candle-sconces
lighting: 1800K key + 6500K cyan rim + 12000K violet at deliverable alcove
atmosphere: incense + leather + paper-dust + machine-oil; reverb 2.0 s
camera_spawns:
  - cs_personal_quest_ledger_first_arrival
  - cs_personal_quest_milestone_<archetype>   (12 variants — per archetype)
  - cs_personal_quest_relic_displayed         (12 variants)
  - cs_personal_quest_complete_<archetype>    (12 variants)
doorways:
  - south: connects to A.50 Apprentice Hall
  - east: connects to A.21 Cipher Den (existing — quest research)
13-axis grid:
  6 economic: idle / active (quest-card review) / contested (failed quest)
  7 governance: `personal_quest_milestone_<archetype>` → ledger animation;
    `personal_quest_complete_<archetype>` → relic display ignition
  8 event: off / qualifier / finals (cohort-wide quest completion) /
    champion (12-archetype simultaneous completion)
  9 TV: clean / exposed (ledger pages glitch) / spreading / corrupted
    (quest cards rewrite themselves) / quarantined
  10 epoch: low / rising / high / grand-edit (one ledger entry rewrites
    its quest objective)
  11 cycle: dawn / balanced / dimming / long-night
  12 faction: 8 faction states (per-ledger faction allegiance shows on cover)
  13 storyteller: HUD overlap: quest-card-table doubles as quest-tracker UI.
    Mystery-arc: deliverable alcove reserves a 13th case for the player's
    own personal quest — locked until Act-7.
art_resources:
  textures: personal_quest_ledger_wall.png,
    personal_quest_card_table.png,
    personal_quest_deliverable_case.png
  models: personal_quest_ledger.glb (×12 archetype-themed),
    personal_quest_card_table.glb,
    personal_quest_deliverable_case.glb (×13)
performance: 0.7M tris; 160 MB; 20 lights
```

---

### §AC.1.10 A.15 (extension) — Commons sub-zones full §4 spec

The Social Hub (§A.15 in `_PRODUCTION_ARK_ROOMS.md`) already
documents three sub-zones — bar, long table, alcove — but at
high level only. The commons banter system
(`apps/shared/commonsScenePool.ts` 157 scenes) anchors specific
banter beats to specific sub-zones. This extension specs each
sub-zone at full §4 with the 13-axis grid.

#### §AC.1.10.1 A.15.bar — The Bar sub-zone

```
sub_zone_id: ark.social_hub.bar
size: 4.00m × 3.00m × 4.50m   (within Social Hub NW corner)
purpose: intimate philosopher-debates; 1-on-1 commons scenes
zones: 1 brass-rim bar (1.80m × 0.60m mahogany top); 4 stools;
  1 rear-shelf with 24 spirits-bottles + 12 cipher-glasses
fixtures:
  - bar: mahogany top with brass rim; built-in cog-mechanism cocktail-shaker
    behind glass; cyber-cyan fiber-optic underglow z-0.05m;
    chalk-circle inlay at the bar foot (visible from stool-side)
  - 4 brass-and-leather stools at z+0.7m
  - rear shelf: cipher-script labels on every bottle; one bottle is a
    perpetually-half-full sigil-bottle (fills again per cohort milestone)
  - 1 brass cash-till at south end (cog-mechanism style; never used —
    decorative)
floor: parquet with chalk-circle inlay at bar-foot
walls: leather-padded behind bar; brass-bound copper piping
ceiling: 4.50m (inherited from Social Hub); 2 gas-mantle pendants
  over bar at z+3.0m
lighting: 1800K key (gas-mantle pendants); 6500K cyan rim
  (fiber-optic underglow); 12000K violet at sigil-bottle
atmosphere: incense (light) + leather + spirits + machine-oil; reverb 1.6 s
camera_spawns:
  - cs_commons_bar_<archetype_pair>   (parametric per commons scene pool)
13-axis grid: per A.15 canonical with bar-sub-zone overrides
art_resources:
  textures: social_hub_bar_mahogany_top.png, social_hub_bar_rear_shelf.png,
    social_hub_bar_cipher_bottle.png
  models: social_hub_bar.glb, social_hub_bar_stool.glb,
    social_hub_bar_cipher_bottle.glb (×24), social_hub_bar_cog_shaker.glb
```

#### §AC.1.10.2 A.15.long_table — The Long Table sub-zone

```
sub_zone_id: ark.social_hub.long_table
size: 6.00m × 2.40m × 4.50m
purpose: group meals + group commons scenes (footnote-wars, cohort meals)
zones: 1 long mahogany dining table (5.00m × 1.20m); 12 brass-and-leather
  chairs; 1 brass-bound chandelier z+3.0m
fixtures:
  - dining table: mahogany top with brass rim; chalk-circle inlay at
    table-foot centre; 12 candle-sconces (one per chair position)
  - 12 brass-and-leather dining chairs
  - chandelier: brass-and-glass with 12 candle-positions
floor: parquet (continues from bar)
walls: shared with Social Hub (no sub-zone walls)
ceiling: 4.50m
lighting: 1800K candles (chandelier 12 + sconces 12); 6500K cyan rim
  (fiber-optic ribbon overhead); 12000K violet at chandelier apex
camera_spawns:
  - cs_commons_long_table_<archetype_pair>   (parametric)
art_resources:
  textures: social_hub_long_table_mahogany.png,
    social_hub_long_table_chair.png
  models: social_hub_long_table.glb (×1), social_hub_long_table_chair.glb (×12),
    social_hub_long_table_chandelier.glb
```

#### §AC.1.10.3 A.15.alcove — The Alcove sub-zone (romance)

```
sub_zone_id: ark.social_hub.alcove
size: 3.00m × 3.00m × 4.50m
purpose: courtship / romantic signature commons scenes
zones: 1 deep-cushioned brass-and-leather sofa (2.40m × 0.90m);
  1 small brass-rim coffee table (0.80m × 0.60m); 1 frosted-
  glass partition at the alcove entry (privacy)
fixtures:
  - sofa: brass-and-leather; deep cushions; chalk-circle inlay
    on coffee-table top instead of foot
  - coffee table: brass-rim mahogany; 1 candle-cluster at centre
    (parametric — number of candles = number of romance-curve
    milestones reached with current partner)
  - partition: frosted glass with sigil-etched brass armature;
    door-leaf swings open when scene begins
floor: deep-pile rug (deep-red ornate); brass-rim border
walls: leather-padded with brass studs; 4 candle-sconces at
  alcove corners
ceiling: 4.50m (inherited); 1 small pendant at z+3.0m above coffee table
lighting: 1800K candle key (intentionally low); 6500K cyan rim
  (fiber-optic conduit on partition); 12000K violet at the
  romance-milestone candles
camera_spawns:
  - cs_commons_alcove_<archetype_romance>   (12 variants — one per
    archetype's romance-curve signature line)
13-axis grid: per A.15 canonical, with alcove-sub-zone overrides;
  axis 13 storyteller hook: at romance-curve milestone-12 with
  any archetype, partition-glass clouds permanently and the alcove
  is removed from public-commons rotation (private space).
art_resources:
  textures: social_hub_alcove_sofa.png, social_hub_alcove_coffee_table.png,
    social_hub_alcove_partition.png, social_hub_alcove_rug.png
  models: social_hub_alcove_sofa.glb, social_hub_alcove_coffee_table.glb,
    social_hub_alcove_partition_animated.glb, social_hub_alcove_pendant.glb
```

---

## §AC.2 Apprentice cutscene roster (45)

All cutscenes inherit `_PRODUCTION_CUTSCENE_PROMPTS.md` §G.0
framework + §AC.0.1 APPRENTICE_AESTHETIC. Per-cutscene NB2 +
Veo prompts use compact form with archetype-specific subject
variants. CDN target: `cdn/client-public/cutscenes/<cs_id>/`.

### §AC.2.1 Archetype recruit cutscenes (12)

`cs_recruit_first_meet_<archetype>` × 12. Length 8 s. Cat A.
Host_space: §AC.1.3 Recruit Vestibule.

Trait-lock per cut:
- **Subject base**: the archetype-themed candidate seated at the
  interview-bench, scrying-mirror at north reading their archetype
  affinity. Each archetype's candidate has signature wardrobe,
  posture, and a single signature gesture.
- **Action**: 0–3 s candidate seated under interview-pendant; 3–5 s
  scrying-mirror clouds and resolves to archetype-glyph; 5–8 s
  candidate's signature gesture (per table below).
- **Audio**: archetype-specific VO line (1 short sentence) + scrying-
  mirror chord at 00:05 + interview-bench cog-mechanism click at 00:07.

| § | cs_id | archetype | wardrobe | signature gesture | VO |
|---|---|---|---|---|---|
| §AC.2.1.1 | `cs_recruit_first_meet_zealot` | Zealot | brass-bound cassock | drops to one knee mid-sentence | "I am ready to burn." |
| §AC.2.1.2 | `cs_recruit_first_meet_ghost` | Ghost | charcoal-grey gambeson + mask | does not move at all | "You will not see me." |
| §AC.2.1.3 | `cs_recruit_first_meet_scholar` | Scholar | cipher-stained leather coat + reading glasses | adjusts glasses, opens a book | "Cite your sources." |
| §AC.2.1.4 | `cs_recruit_first_meet_revenant` | Revenant | iron-grey robe + scarification visible | head bowed, breath audible | "I returned. Wrong." |
| §AC.2.1.5 | `cs_recruit_first_meet_artisan` | Artisan | apron with 24 brass tool-loops | hands on the bench, fingers steady | "Show me what is broken." |
| §AC.2.1.6 | `cs_recruit_first_meet_oracle` | Oracle | velvet hooded cloak + tarot deck | flips three cards face-up | "I saw this already." |
| §AC.2.1.7 | `cs_recruit_first_meet_wanderer` | Wanderer | dust-stained cloak + walking stick | drops a small pebble on the bench | "I do not stay." |
| §AC.2.1.8 | `cs_recruit_first_meet_martyr` | Martyr | white gambeson with bandage-roll across chest | extends both palms upward | "Take what you need." |
| §AC.2.1.9 | `cs_recruit_first_meet_heretic` | Heretic | black robe with cipher-script visible | tears a page from a book and lights it | "Question every answer." |
| §AC.2.1.10 | `cs_recruit_first_meet_jester` | Jester | motley cloak + skull-headed staff | laughs once, no smile | "Lower your guard." |
| §AC.2.1.11 | `cs_recruit_first_meet_sentinel` | Sentinel | brass-armoured tunic + watch-cap | snaps to attention, eyes scanning | "Nothing passes." |
| §AC.2.1.12 | `cs_recruit_first_meet_prodigal` | Prodigal | travel-worn formal cloak + signet ring | slowly removes signet, places it on bench | "I have come back." |

Per-cut block (compact form):
```yaml
host_space: §AC.1.3 Recruit Vestibule
nb2_start.subject: <archetype candidate per table> seated at the
  interview-bench under a 1800K gas-mantle pendant; scrying-
  mirror at north of frame is dark.
nb2_end.subject: same; the scrying-mirror has resolved to the
  candidate's archetype-glyph in cyan-magenta cipher-script;
  candidate is mid-signature-gesture per table.
veo.cinematography: medium close-up FPV from interviewer side;
  35mm; static lockoff first 5s, slow push-in 0.2m last 3s.
veo.action: per table.
veo.audio.dialogue: per table (lip-sync to dialogue).
veo.audio.sfx: scrying-mirror chord 00:05; cog-mechanism click 00:07.
veo.audio.ambient: incense + leather + ozone; reverb 1.6s.
pipeline:
  nb2_seed: 170101 + n;   # n = archetype index 0..11
  veo_seed: 270101 + n;
  vo_manifest_ref: apps/shared/apprentice<Archetype>VoManifest.json#L<TBD>;
  cdn_target: cdn/client-public/cutscenes/cs_recruit_first_meet_<archetype>/
```

### §AC.2.2 Archetype graduation cutscenes (12)

`cs_graduation_<archetype>` × 12. Length 10 s (stitched 8+2).
Cat A. Host_space: §AC.1.2 Trial Hall.

Each: candidate ascends the dais, the apex sigil ignites, the
cohort-roster brass plate at perimeter resolves to the
candidate's name, the dais-rim fiber-optic lights cyan, and
mentor's roll etches a new entry in real-time. Veo audio:
Mentor's bell does NOT ring (graduation = silent bell);
chant-loop crescendos from -28 dB to -16 dB across 10 s; final
brass-spark at 00:08 as the mentor's-roll page settles.

Per-cut compact:
```yaml
host_space: §AC.1.2 Trial Hall
nb2_start.subject: candidate seated at perimeter brass plate
  position, dais empty, apex sigil dim.
nb2_end.subject: candidate atop dais, apex sigil glowing
  occult-violet, dais-rim fiber-optic cyan, cohort-roster
  perimeter all 12 plates lit.
veo.action: 0–3 s perimeter establishes; 3–6 s candidate ascends
  dais; 6–10 s sigil ignites and roll etches.
veo.audio.dialogue: cohort-chorus says, "<archetype>." (lip-sync)
veo.audio.sfx: dais-step thump x3 at 00:03/04/05; sigil-ignite
  chord 00:06; mentor's roll page-flip 00:08; brass-spark 00:08.5.
pipeline:
  nb2_seed: 170201 + n; veo_seed: 270201 + n;
  cdn_target: cdn/client-public/cutscenes/cs_graduation_<archetype>/
```

### §AC.2.3 Archetype permadeath obituary cutscenes (12)

`cs_obituary_<archetype>` × 12. Length 8 s. Cat A. Host_space:
§AC.1.6 Mourning Wall.

Each: the archetype's brass plaque etches in real-time at z+1.4 m
on the north wall; the corresponding candle on south candle-bench
ignites; photograph appears in east alcove. **Permadeath bell
in §AC.1.2 Trial Hall rings once at 00:04** (audible faintly
through east doorway connection). Audio: brass-etching 00:00–00:05;
candle-ignite chord 00:06; photograph-frame thump 00:07; chant-loop
fade-up to -24 dB at 00:08.

Per-cut compact:
```yaml
host_space: §AC.1.6 Mourning Wall
nb2_start.subject: north plaque wall; archetype's plaque is blank;
  candle on south bench is unlit; photograph alcove has empty frame.
nb2_end.subject: plaque etched with name + archetype + cause-of-death;
  candle lit; photograph appearing.
veo.action: 0–5 s brass-etching of plaque; 5 s candle ignites;
  6–7 s photograph appears in frame; 7–8 s chant-loop swells.
veo.audio.dialogue: Master of R'lyeh says, "<archetype>'s name
  remains." (parametric per archetype)
veo.audio.sfx: brass-etching chisel 00:00–00:05; candle-ignite
  chord 00:06; permadeath-bell single-toll 00:04 (faint, distant);
  photograph-frame thump 00:07.
pipeline:
  nb2_seed: 170301 + n; veo_seed: 270301 + n;
  vo_manifest_ref: apps/shared/masterOfRlyehVoManifest.json#L<TBD>;
  cdn_target: cdn/client-public/cutscenes/cs_obituary_<archetype>/
```

### §AC.2.4 Blood-weave threshold transition cutscenes (4)

`cs_blood_weave_band_transition_dormant_to_braiding` (alignment 1)
`cs_blood_weave_band_transition_braiding_to_woven` (alignment 5)
`cs_blood_weave_band_transition_woven_to_bound` (alignment 15)
`cs_blood_weave_band_transition_bound_to_claimed` (alignment 30)

Length 8 s each. Cat A. Host_space: §AC.1.8 Blood Weave Atrium.
Each shows the central braiding-pillar transitioning rope-state
across the named band boundary. Loredex alcove at perimeter
position N (N=1, 2, 3, 4 corresponding to threshold) ignites.

Audio per cut: pillar low-chord rises in pitch as alignment
crosses threshold; alcove-light cascade chime at the transition
moment; sub-bass 16 Hz pulse on the new band-state.

Per-cut compact:
```yaml
host_space: §AC.1.8 Blood Weave Atrium
nb2_start.subject: braiding-pillar at pre-threshold rope state
  (one strand-band).
nb2_end.subject: braiding-pillar at post-threshold rope state
  (next strand-band woven in); corresponding loredex alcove
  ignited cyan.
veo.action: 0–3 s pillar establishes; 3–5 s rope-strands re-weave;
  5–8 s alcove ignites + alignment-pulpit page-flip.
veo.audio.dialogue: Master of R'lyeh says, "<band-name>." (×4)
veo.audio.sfx: rope-weave whisper 00:03–00:05; alcove-light
  cascade chime 00:06; sub-bass 16 Hz pulse 00:07.
pipeline:
  nb2_seed: 170401..170404; veo_seed: 270401..270404;
  cdn_target: cdn/client-public/cutscenes/cs_blood_weave_band_transition_<from>_to_<to>/
```

### §AC.2.5 12 loredex-revealed cutscenes (compact)

`cs_blood_weave_loredex_revealed_<n>` × 12 (n=1..12; one per
threshold value 1, 2, 3, 5, 7, 9, 12, 15, 20, 25, 30, 40).

Length 6 s each. Cat A. Host_space: §AC.1.8 Blood Weave Atrium
(perimeter alcove N).

Each: the corresponding alcove's glass case lights cyan, the
loredex entry inside resolves into legible cipher-script, the
alignment-pulpit page-flips to display the new entry. The 12th
threshold (alignment 40+) is the **Game Master meta-arc unlock**
— a special end-frame variant where the alcove's case shatters
and the loredex entry falls into the player's hand.

Per-cut compact:
```yaml
host_space: §AC.1.8 Blood Weave Atrium (alcove N)
nb2_start.subject: alcove dim; glass case present but contents
  obscured.
nb2_end.subject: alcove cyan-lit; loredex entry visible; alignment-
  pulpit at south showing the entry's title in illuminated cipher.
veo.action: 0–3 s alcove establishes; 3–4 s alcove ignites; 4–6 s
  loredex entry resolves.
veo.audio.dialogue: Game Master (via Master of R'lyeh's voice)
  says, "Loredex entry <n>." (cyan-cipher subtitling)
veo.audio.sfx: alcove-light cascade 00:03; cipher-resolve 00:05;
  page-flip on pulpit 00:06.
pipeline:
  nb2_seed: 170501 + n; veo_seed: 270501 + n;
  cdn_target: cdn/client-public/cutscenes/cs_blood_weave_loredex_revealed_<n>/
notes (n=12 only): "end_frame variant `end_shatter.png` carries
  the case-shatter + loredex-falls; played only at alignment 40+;
  unlocks the Game Master meta-arc cinematic (separate scope)."
```

### §AC.2.6 Essence-harvest cutscenes (3)

```yaml
cs_essence_harvest_first:
  host_space: §AC.1.7 Essence Harvest Sanctum
  notes: "Cat A; 8s; first-time harvest of any fighter; vault-cabinet
    1 ignites; floor-channel runs gold-blood; specimen-jar materialises."
  veo.audio.dialogue: "Harvester says, \"Essence taken. First.\""
  pipeline:
    nb2_seed: 170601; veo_seed: 270601;
    vo_manifest_ref: apps/shared/essenceHarvesterVoManifest.json#L<TBD>;
    cdn_target: cdn/client-public/cutscenes/cs_essence_harvest_first/

cs_essence_harvest_veteran:
  host_space: §AC.1.7
  notes: "Cat A; 8s; tenth-stack-of-any-fighter harvest; all 12 vault-
    cabinets ignite simultaneously for 24h."
  veo.audio.dialogue: "Harvester says, \"Tenth. They are saturated.\""
  pipeline:
    nb2_seed: 170602; veo_seed: 270602;
    cdn_target: cdn/client-public/cutscenes/cs_essence_harvest_veteran/

cs_essence_harvest_vault_full:
  host_space: §AC.1.7
  notes: "Cat A; 8s; all 12 essence-vault slots filled; reveals expansion-
    reserved 13th cabinet behind south wall."
  veo.audio.dialogue: "Harvester says, \"There is one more.\""
  pipeline:
    nb2_seed: 170603; veo_seed: 270603;
    cdn_target: cdn/client-public/cutscenes/cs_essence_harvest_vault_full/
    notes: "Act-7 reveal — out-of-cycle for normal play."
```

### §AC.2.7 Hellbox-clone cutscene (1)

```yaml
cs_hellbox_clone_bench_restoration:
  host_space: §AC.1.5 Hellbox Clone Bench
  notes: "Cat A; 12s stitched (8+4); apprentice-only one-shot
    restoration; loredex-entry consumption animation; clone-bench
    head-stirrups close on a forming silhouette; restored apprentice
    sits up on the bench by 00:12."
  veo.audio.dialogue: "Restored apprentice gasps, \"…I returned.\""
  veo.audio.sfx: "loredex-entry consumption shred 00:03; sigil-circle
    ignite 00:05; flesh-form chord 00:08; first-breath gasp 00:11."
  pipeline:
    nb2_seed: 170701; veo_seed: 270701;
    vo_manifest_ref: apps/shared/restoredApprenticeGenericVoManifest.json#L<TBD>;
    cdn_target: cdn/client-public/cutscenes/cs_hellbox_clone_bench_restoration/

cs_hellbox_clone_bench_resurrectionist_neyon_absence:
  host_space: §AC.1.5
  notes: "Act-4 lore reveal; the bench's second set of head-stirrups is
    visible for the first time; player's gloved hand rests on the empty
    second position; chalk-circle at the second position has been
    smudged out (someone erased it)."
  veo.audio.dialogue: "Master of R'lyeh: \"Someone else worked here.\""
  pipeline:
    nb2_seed: 170702; veo_seed: 270702;
    cdn_target: cdn/client-public/cutscenes/cs_hellbox_clone_bench_resurrectionist_neyon_absence/
```

### §AC.2.8 Trial-Hall + Mentor's-Roll cutscenes (1)

```yaml
cs_trial_hall_first_arrival:
  host_space: §AC.1.2 Trial Hall
  notes: "Cat A; 8s; player's first time entering the Trial Hall as
    apprentice-system unlocks in Act 2; perimeter brass-plates dim,
    apex sigil dim."
  veo.audio.dialogue: "Master of R'lyeh: \"This is where it ends.\""
  pipeline:
    nb2_seed: 170801; veo_seed: 270801;
    cdn_target: cdn/client-public/cutscenes/cs_trial_hall_first_arrival/
```

### §AC.2.9 Cohesion-shift cutscene (1)

```yaml
cs_commons_cohesion_shift:
  host_space: §A.15 Social Hub (multi-zone aware; bar / long-table /
    alcove all visible from establishing wide)
  notes: "Cat A; 8s; played when cohesion-weather band shifts (e.g.
    tense → warm, warm → bonded). Sub-zone lighting transitions in
    cascade: bar candles flicker first, long-table chandelier
    candles ignite second, alcove pendant brightens last. Diegetic
    crew-NPCs in each sub-zone react in unison."
  veo.audio.dialogue: "(distant crew murmur shift; no named-character VO)"
  veo.audio.sfx: "bar-candle flicker cascade 00:03; long-table
    chandelier ignite 00:05; alcove pendant brighten 00:07."
  veo.audio.ambient: "Social Hub baseline + cohesion-shift chord at 00:06."
  pipeline:
    nb2_seed: 170901; veo_seed: 270901;
    cdn_target: cdn/client-public/cutscenes/cs_commons_cohesion_shift/
```

---

## §AC.3 Audit + production handoff

### §AC.3.1 Roster summary

**New rooms authored**: 9 + 3 sub-zones = **12 spaces** at full §4
spec with the 13-state-axis grid:

| § | space_id | type | size (m³) |
|---|---|---|---|
| AC.1.1 | A.50 ark.apprentice_hall | ark_room | 1,664 |
| AC.1.2 | A.51 ark.trial_hall | ark_room | 1,411 |
| AC.1.3 | A.52 ark.recruit_vestibule | ark_room | 154 |
| AC.1.4 | A.53 ark.apprentice_cellblock | ark_room | 403 |
| AC.1.5 | A.54 ark.hellbox_clone_bench | ark_room | 86 |
| AC.1.6 | A.55 ark.mourning_wall | ark_room | 154 |
| AC.1.7 | A.56 ark.essence_harvest_sanctum | ark_room | 256 |
| AC.1.8 | A.57 ark.blood_weave_atrium | ark_room | 1,152 |
| AC.1.9 | A.58 ark.personal_quest_ledger | ark_room | 256 |
| AC.1.10.1 | A.15.bar (sub-zone) | sub_zone | 54 |
| AC.1.10.2 | A.15.long_table (sub-zone) | sub_zone | 65 |
| AC.1.10.3 | A.15.alcove (sub-zone) | sub_zone | 41 |

**New cutscenes**: 45.

| § | scope | count |
|---|---|---|
| AC.2.1 | archetype recruit | 12 |
| AC.2.2 | archetype graduation | 12 |
| AC.2.3 | archetype permadeath obituary | 12 |
| AC.2.4 | blood-weave band transitions | 4 |
| AC.2.5 | blood-weave loredex revealed | 12 (n=1..12) |
| AC.2.6 | essence-harvest first/veteran/vault-full | 3 |
| AC.2.7 | hellbox-clone restoration + Ne-Yon absence | 2 |
| AC.2.8 | trial-hall first-arrival | 1 |
| AC.2.9 | commons cohesion-shift | 1 |
| **TOTAL** | | **59** |

(Headline of 45 was a placeholder; the actual count expands to 59
once the 12 loredex-revealed cuts and the Ne-Yon absence cut are
counted.)

### §AC.3.2 Art resource manifest (cumulative)

**Textures** (new in this phase): ~60 source PNGs spanning room
floor/wall/ceiling/fixture sets + per-archetype workbench/cell
overlays. Estimate ~600 MB raw 4K source.

**Models (.glb)** (new): ~80 models spanning room-scale (workbenches,
plaque walls, dais, pillars, alcoves) + 12 archetype-themed
fixtures + 13 photograph-frames + 12 archetype-ledgers + animated
fixtures (cohort-plaque-etching, mentor's-roll-page-flip,
braiding-pillar-rope-state, alcove-partition-glass).

**Reference images** for NB2 prompt seeding: 1 per room + per
sub-zone (12 master stills) + 12 per-archetype recruit-portrait
refs + 12 per-archetype graduation-portrait refs + 12 per-archetype
mourning-portrait refs = **~60 reference image generation passes**.

**Cutscene asset directories** (per §G.0.4 contract): 59 cutscene
dirs × 5 baseline files = 295 files + 1 stitched (12s) cutscene
adds 1 file = **296 files**. Plus 1 outcome-variant
cutscene (essence-harvest) adds 3 files = **~299 files** total
generated cutscene assets.

**Storage estimate**: ~3.6 GB (300 files at avg 12 MB; PNGs
8–12 MB each, MP4s 25–40 MB each, WAVs 3–5 MB).

### §AC.3.3 VO manifests required (new)

| manifest | first-ref | line-count est. |
|---|---|---|
| `apprenticeZealotMaleVoManifest.json` + female | §AC.2.1.1 etc. | ~54 each (existing per `apps/scripts/apprentice-*-lines.json`) |
| (12 archetypes × 2 genders = 24 manifests, all already exist on main) | | |
| `essenceHarvesterVoManifest.json` (NEW) | §AC.2.6 | ~12 (small) |
| `restoredApprenticeGenericVoManifest.json` (NEW) | §AC.2.7 | ~6 (very small) |

The 24 archetype VO manifests already shipped per PR #517 (~1294
lines total). The two NEW manifests above (~18 lines combined)
need authoring as part of follow-up.

### §AC.3.4 Cross-references back to existing docs

- `_PRODUCTION_ARK_ROOMS.md`: §A.15 Social Hub (extended via §AC.1.10
  sub-zones); §A.05 Memorial Corridor (§AC.1.6 east connection);
  §A.10 Hierarchy Throne (§AC.1.8 south connection); §A.21 Cipher
  Den (§AC.1.9 east connection); §A.04 Engineering Bay (§AC.1.5
  east + §AC.1.7 north connections).
- `_PRODUCTION_HELLBOXES.md`: HB cosmology unchanged. The
  apprentice Hellbox clone (§AC.1.5) is **ship-resident salvage
  tech**, NOT a Hellbox transit destination.
- `_PRODUCTION_CROSS_CUT.md`: 59 new cutscene IDs need entries
  added to §F.1.A (likely as a new sub-section §F.1.A.14
  "Apprentice + commons cuts"). The §3.1 spine fields
  (host_space, camera_spawn, head_motion, sfx_track, vo_line,
  music_eligibility, trigger, recurrence) for each new cutscene
  need authoring as part of follow-up. The compact prompts in
  §AC.2 above carry enough detail for the §3.1 fields to be
  inferred.
- `_PRODUCTION_CUTSCENE_PROMPTS.md`: §AC.2 cutscenes inherit §G.0
  framework verbatim; APPRENTICE_AESTHETIC anchor stacks on top
  of canonical FPV trait-lock and negative-prompt strings.
- `_PRODUCTION_DESTINATIONS.md`: not affected (apprentice rooms
  are Ark-side, not destination-zone).
- `_PRODUCTION_VEHICLES.md`: not affected.

### §AC.3.5 Runtime hooks (existing systems consume this spec)

| runtime file | how this spec is consumed |
|---|---|
| `apps/shared/apprentices.ts` | `apprentice.archetype` field selects per-archetype workbench (§AC.1.1), cell sub-zone (§AC.1.4), recruit vestibule scrying-mirror reveal (§AC.1.3), graduation cutscene (§AC.2.2), and obituary cutscene (§AC.2.3). |
| `apps/shared/apprenticeIdentity.ts` | per-archetype gift / quest / romance / banter content reaches the Apprentice Hall (§AC.1.1) workbench, the alcove (§AC.1.10.3) romance milestone candle-cluster, and the Personal Quest Ledger Room (§AC.1.9). |
| `apps/shared/commonsScenePool.ts` | 157 banter scenes anchor to the 3 Social Hub sub-zones (§AC.1.10). |
| `apps/server/routers/apprenticeTrial.ts` | `apprenticeTrial.recordCompletion(graduated=true|false)` triggers the graduation cutscene (§AC.2.2.x) or obituary cutscene (§AC.2.3.x). The cohort-roster wall (§AC.1.1) etches in real-time. |
| `apps/shared/bloodWeave.ts` | `hierarchyAlignment` value drives Blood Weave Atrium (§AC.1.8) braiding-pillar rope-state in real-time. Each threshold crossing triggers the corresponding loredex-revealed cutscene (§AC.2.5) and band-transition cutscene (§AC.2.4). |
| `apps/shared/hellboxClone.ts` | apprentice-only one-shot restoration runs the §AC.2.7 cutscene; consumes 1 unread loredex entry visible in the §AC.1.5 pulpit. |
| `apps/server/services/narrativeFlagService.ts` | flags `apprentice_trial_completed_<archetype>`, `apprentice_trial_graduated_any`, `essence_harvest_first`, `essence_harvest_veteran` drive the room-axis state-shifts on §AC.1.1, §AC.1.6, §AC.1.7. |
| `apps/shared/apprenticeToCrew.ts` | mourning-sweep processes obituary cutscenes (§AC.2.3) and the 28-day candle-snuff state on §AC.1.6. |

### §AC.3.6 Outstanding TBDs

- VO manifest line numbers for 24 archetype manifests + 2 new
  manifests (essence harvester + restored apprentice).
- §F.1 cross-cut sync: 59 new cutscene IDs need spine entries.
- 13th essence-vault cabinet (§AC.1.7) and 13th photograph frame
  (§AC.1.6) and 13th deliverable case (§AC.1.9) are all
  expansion-reserved storyteller-hook slots; they unlock at
  Act-7 contingent on player choices and need to be
  story-locked per choice-path (separate narrative-pass).
- The Game Master meta-arc unlock (§AC.2.5 n=12 variant) is
  the start of a separate cinematic arc currently scoped only
  here; the cinematic itself is out of scope for this document.
- Sub-zone commons banter scene count (157) needs cross-check
  vs. the 126 declared pairings shipped as "commons 126/126" —
  the runtime is at full coverage but the doc may need to
  reflect 157 vs 126 if scene-pool has expanded since PR #513.

### §AC.3.7 Production handoff

After this PR merges, the asset-generation pipeline can:

1. Generate the 12 master-still NB2 references for the new
   rooms (§AC.1.x), trait-locked to APPRENTICE_AESTHETIC.
2. Submit per-archetype workbench / cell / portrait NB2 still
   batches (12 archetypes × ~6 still types each = ~72 stills).
3. Submit the 59 cutscene NB2 + Veo prompt batches per §AC.2.
4. Audio post per §G.0.5: existing 24 archetype VO manifests
   feed lip-locked dialogue; 2 new VO manifests authored as
   side-task.
5. CDN upload per `cs_id` directory contract.
6. `_PRODUCTION_CROSS_CUT.md` §F.1.A.14 added in a follow-up
   doc-sync PR.

The runtime is unchanged; this is a production-doc deliverable
only. `pnpm check` and `pnpm ship:check` remain N/A.

End of `_PRODUCTION_APPRENTICE_COMMONS.md`.
