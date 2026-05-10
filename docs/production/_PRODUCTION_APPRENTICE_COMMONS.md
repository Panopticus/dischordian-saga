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

---

## §AC.4 PR #580 expansion — pedagogy hub + audit + forge spaces

PR #580 (squash commit `b0e56cc`) shipped the KOTOR-grade
pedagogy lift + Berth System (13,794 lines, 68 files, 8 new
ship:check parity gates, 6 new DB tables, 17 tRPC endpoints).
The runtime systems are listed below; each one implies physical
/ ceremonial surfaces this section authors at full §4 + 13-axis
fidelity per the Phase A canonical Ark-room schema, plus NB2 +
Veo prompts following `_PRODUCTION_CUTSCENE_PROMPTS.md` §G.0.

Runtime systems (existing on main):
- `apps/shared/apprenticeDoctrines.ts` — 5 doctrines × 4 stanzas
- `apps/shared/apprenticeMechronisAudits.ts` + `apprenticeMechronisLink.ts` — Day-7 / Day-14 / Day-21 audits
- `apps/shared/apprenticeSignatureCard.ts` + `expansionArt/signatureCardManifest.ts` — 6 effect-slot signature cards
- `apps/shared/apprenticeMemoryInheritance.ts` — 12 inherited lines + 12 breaking-point echoes
- `apps/shared/apprenticeCohort.ts` — cohort-of-3 (active + training_a + training_b)
- `apps/shared/apprenticeMissionTypes.ts` — 17 graduate-legion missions across 7 roles
- `apps/shared/apprenticeWarden.ts` — Inspector Veil-7 + 4 candidates + Day-14 dock scene
- `apps/shared/berthCommScreen.ts` + `partyMemberBerth.ts` — per-companion berth + comm screen
- `apps/client/src/pages/GuildCommonRoomPage.tsx` (456 lines) — 12 guild common rooms
- `apps/shared/timeOfDay.ts` — 4 phases (dawn / midday / dusk / nightwatch)

The aesthetic anchor (§AC.0.1 APPRENTICE_AESTHETIC) is
trait-locked across every room, fixture, cutscene, and NB2 / Veo
prompt below. **All prompts follow the §G.0 5-block NB2 schema
+ 5-part Veo schema + canonical FPV trait-lock + canonical
negative-prompt.**

### §AC.4.1 A.59 The Doctrine Binding Chamber — FULL

**Status: FULL spec.** A formal ceremonial space where a Day-1
apprentice recites their chosen doctrine before the player and
the cohort. The doctrine slip artifact (per
`apprenticeDoctrines.ts` doctrine-binding state) materialises
on the apprentice's bunk after binding.

#### Header

```
space_id:        ark.doctrine_binding_chamber
space_name:      The Doctrine Binding Chamber
space_type:      ark_room
act_introduced:  Act 2 (alongside apprentice system unlock)
lore_anchor:     loredex.system.apprentice_doctrine + arc.doctrine_binding
aesthetic_tier:  steampunk_cyberpunk_occult  (APPRENTICE_AESTHETIC)
```

#### Geometry

```
dimensions:           10.00 m × 10.00 m × 5.00 m
origin_point:         centre of floor at south door threshold
floor_plan_geometry:  square with 5 perimeter doctrine-pulpits
                      (one per doctrine) at 72° spacing
volumetric_anomalies: ceiling apex rises to z+5.0 m at centre
```

Floor area: 100 m². The chamber is intentionally intimate —
binding is a private commitment between apprentice, doctrine,
and player-mentor.

#### Floor / walls / ceiling / lighting (compact)

```
floor:    riveted iron deck plating + central 4 m chalk-circle inlay
          with gold-blood-channel sigil; 5 brass-rim doctrine-glyphs
          inlaid at 72° around perimeter (Compliant Mouth, Forked Path,
          Cold Hand, Heretical Quiet, Human Remainder)
walls:    stone-and-brass with 5 doctrine-pulpits at perimeter (each pulpit
          carries the doctrine's brass-bound book opened to the binding stanza);
          cyber-cyan fiber-optic conduits running ceiling-to-floor at each pulpit
ceiling:  5.0 m apex; 1 central pendant chandelier; 5 candle-clusters on chains
          descending z+3.0 to z+1.5 m above each pulpit
key:      1800 K candles + 5400 K diffuse fill; 6500 K cyan rim from fiber-optic;
          12000 K occult-violet practical at active doctrine's pulpit (when chosen)
ambient:  35 lux (intentionally dim, ceremonial)
```

#### Atmosphere + sound

```
temperature:  16°C
humidity:     30%
smell:        incense (heavy) + leather + parchment + machine-oil
sound:        4.4 s reverb; chant-loop bed -32 dB; gas-mantle hiss; sigil-
              circle low chord 8 Hz when binding ceremony active
```

#### Objects (full inventory)

```
- 1 central chalk-circle + sigil-channel (4 m diameter)
- 5 doctrine-pulpits (one per doctrine):
    Compliant Mouth: gilt-brass pulpit, scripture-wheel, gas-mantle aureole
    Forked Path: split-pulpit (two opened books at oblique angles)
    Cold Hand: iron pulpit with leather-bound ledger, no candles
    Heretical Quiet: stone pulpit with chalkboard, brass debate-bell suppressed
    Human Remainder: mahogany pulpit with brass family-portrait frame (empty)
- 1 mentor's chair at south (player-position; mahogany-and-brass; cog-arm-rest)
- 1 apprentice's binding-stool at centre of chalk-circle
- 5 candle-clusters on chains (one per pulpit; lit when that doctrine activated)
- 1 doctrine-slip drawer (south wall, brass-bound; produces the slip artifact
  on binding completion)
- 4 fiber-optic conduits (cyan; running ceiling-to-floor at each pulpit and
  central sigil-circle base)
```

#### Camera spawns

```
- cs_doctrine_binding_first_arrival
- cs_doctrine_binding_recitation_compliant_mouth
- cs_doctrine_binding_recitation_forked_path
- cs_doctrine_binding_recitation_cold_hand
- cs_doctrine_binding_recitation_heretical_quiet
- cs_doctrine_binding_recitation_human_remainder
- cs_doctrine_binding_slip_minted
```

#### Doorways

```
- south: connects to A.50 Apprentice Hall
- north: connects to A.60 Audit Chamber (one-way; ceremonial passage)
```

#### Story-tie

When `apprenticeDoctrines.bind(<doctrine>)` fires, the chosen
doctrine's pulpit ignites (candles lit; cyber-cyan rim
intensifies), the central chalk-circle activates, and the
doctrine-slip drawer south wall mints the artifact in real-time.
The apprentice's recitation cutscene plays as the binding-stool
fills.

#### FX + performance

```
FX:           candle-flicker (5 clusters); fiber-optic shimmer; chalk-circle
              gold-blood-channel pulse on activation; doctrine-slip-mint
              brass-spark micro-particle
performance:  0.6M tris; 144 MB; 14 lights
```

#### 13-state axis grid

| axis | state-list (canonical) |
|---|---|
| 1 architect | fixed |
| 2 floor/walls/ceiling/lights | fixed |
| 3 atmosphere + sound + smell | fixed |
| 4 objects + cameras + doors + story-tie + FX + perf | fixed |
| 5 connection rules | south↔apprentice_hall; north↔audit_chamber |
| 6 economic surface | idle (no cohort) / active (binding ceremony in progress) / contested (apprentice rejecting all 5 pulpits — Warden recruitment opens) |
| 7 governance modifier reactions | `doctrine_binding_pending` → all 5 pulpits dim-pulse; `doctrine_bound_<id>` → that pulpit ignites for 24 h; `doctrine_rejected_all` → north door warms cyan + Warden's dock event activates |
| 8 tournament / event window | off / qualifier / finals (binding ceremony live) / champion (cohort-wide simultaneous binding — once-per-cycle event) |
| 9 TV-infection | clean / exposed (chalk-circle smudges) / spreading (one pulpit's candles flicker out) / corrupted (doctrine-slip drawer mints corruption-pink slips) / quarantined |
| 10 epoch / shadowtongue | low / rising / high (chant-loop +6 dB) / grand-edit (one pulpit's brass-bound book rewrites itself) |
| 11 cycle-phase / time-of-day | dawn (5800K, fiber-optic dimmer) / midday (5400K canonical) / dusk (5000K, candles dominant) / nightwatch (4500K, only candles + fiber-optic; chamber feels much more occult) |
| 12 faction livery | none / hierarchy (gold-blood-channel intensified) / dreamers (one Pool-of-Tears miniature added behind central sigil) / pureflame (doctrine-slip drawer ember-glow) / insurgency (rebel-amber sconces) / panopticon (eye-camera count = 5, one per pulpit) / collectors (specimen-jar shelf) / multi |
| 13 storyteller + HUD overlap | mystery-arc: the 5th pulpit's brass family-portrait frame is empty until Act-7, when it inscribes the player's choice. HUD overlap: doctrine-pulpit ring doubles as the Doctrine Picker UI. |

#### Art resources

Textures: `doctrine_chamber_floor_chalk_sigil.png`,
`doctrine_chamber_pulpit_<doctrine>.png` × 5,
`doctrine_chamber_walls.png`, `doctrine_chamber_ceiling_apex.png`,
`doctrine_chamber_doctrine_slip_drawer.png`.
Models: `doctrine_chamber_pulpit_<doctrine>.glb` × 5,
`doctrine_chamber_chalk_circle.glb` (animated),
`doctrine_chamber_binding_stool.glb`,
`doctrine_chamber_doctrine_slip.glb` (5 variants).

#### NB2 master-still prompt

```yaml
nb2:
  model: gemini-3-pro-image-preview
  aspect_ratio: "21:9"
  resolution: "4K"
  reference_images:
    - cdn/client-public/art/refs/apprentice_hall_master_still.png
  prompt: |
    SUBJECT: the Doctrine Binding Chamber on the Ark — a 10×10×5m
      square ceremonial chamber, central 4m chalk-circle on iron
      deck plating with gold-blood-channel sigil, 5 perimeter
      doctrine-pulpits at 72° spacing (Compliant Mouth gilt-brass
      with scripture-wheel and gas-mantle aureole / Forked Path
      split-pulpit with two oblique books / Cold Hand iron pulpit
      with leather ledger / Heretical Quiet stone pulpit with
      chalkboard / Human Remainder mahogany pulpit with empty
      family-portrait frame), apex pendant chandelier z+5m, 5
      candle-clusters on chains z+1.5–3.0m above each pulpit,
      south mentor's chair (player position).
    COMPOSITION: wide establishing, 24mm, eye-level +1.65m, deep
      DOF, vanishing point on apex chandelier.
    LIGHTING/CAMERA: 1800K candle key + 5400K diffuse fill;
      6500K cyber-cyan rim from fiber-optic conduits at each
      pulpit base; 12000K occult-violet practicals at chalk-
      circle nodes; ARRI Alexa anamorphic; Kodak Vision3 500T
      pushed +1.
    STYLE: APPRENTICE_AESTHETIC: steampunk-cyberpunk-occult;
      brass armatures and copper piping with cyber-cyan
      fiber-optic conduits emerging from brass fittings,
      sigil-etched brass plates and chalk-circle floor inlay;
      palette `#c9a14a / #5fa8ff / #0d0a08 / #ff2a8a / #5a1a1f
      / #dccfaa`; volumetric oil-smoke + cyber-mist haze
      z+1.5–3.0m.
    CONSTRAINTS: no extra fingers; no watermark; no on-screen UI;
      no studio logo; first-person POV from the player's eyes; only
      the player's gloved hands enter lower frame from below; no
      third-person body; no mirrors or reflections of the player;
      consistent eye-height per host_space (medium 1.65m).
    Output 4K, 21:9.
pipeline:
  nb2_seed: 180001
  cdn_target: cdn/client-public/art/refs/doctrine_binding_chamber_master_still.png
```

---

### §AC.4.2 A.60 The Audit Chamber — FULL (with Day-21 Warden variant)

**Status: FULL spec, with sub-state for Day-21.** The Mechronis
audit interrogation venue. Day-7 (Intake) and Day-14 (Midpoint)
are conducted by a faceless Mechronis Auditor; Day-21 (Final)
is attended by Inspector Veil-7 (the Warden) personally.

The player **observes from a parallel observation booth, not
inside the chamber** — the audit's transcript is delivered to
the player after; the chamber-interior view is the apprentice's
POV (one of the few non-FPV-of-player perspectives in the game,
which is FPV-of-apprentice-character).

#### Header

```
space_id:        ark.audit_chamber
space_name:      The Audit Chamber
space_type:      ark_room (with Day-21 Warden sub-state)
act_introduced:  Act 2
lore_anchor:     loredex.system.mechronis_audit + arc.apprentice_audits
aesthetic_tier:  steampunk_cyberpunk_occult
```

#### Geometry

```
dimensions:           8.00 m × 6.00 m × 3.20 m + 4 m × 3 m observation booth
origin_point:         centre of floor at south door threshold
floor_plan_geometry:  rectangular interrogation room + adjacent observation booth
                      separated by one-way mirror
volumetric_anomalies: none
```

#### Floor / walls / ceiling / lighting

```
floor:    polished black-marble + sigil-etched brass channel running south-to-north;
          observation booth floor is parquet
walls:    interrogation room: leather-padded with brass studs; one north wall is
          floor-to-ceiling one-way mirror (apprentice cannot see player); cyber-cyan
          fiber-optic conduits along the mirror frame; 4 sigil-etched brass plates
          observation booth: stone with brass-bound copper piping and 1 readable
          transcript-reader pulpit at south
ceiling:  3.20m; central pendant chandelier in interrogation room (single 1800K
          gas-mantle); booth has 1 candle-sconce only
key:      interrogation: 1800K key (single pendant) + 5400K diffuse fill from rear
          booth: 1800K candle (intentionally lower lit; player observing in shadow)
rim:      cyber-cyan from fiber-optic mirror frame
practical: 12000K occult-violet at the auditor's brass nameplate (Day-7 / Day-14:
           "Mechronis Auditor"; Day-21: "Inspector Veil-7")
```

#### Atmosphere + sound

```
temperature: 14°C  (intentionally cold)
humidity:    25%
smell:       leather + machine-oil + parchment + ozone
sound:       3.2 s reverb interrogation; 1.6 s reverb booth; chant-loop -36 dB
             interrogation only; cog-mechanism interview-recorder ticking at 1 Hz
```

#### Objects

```
INTERROGATION ROOM:
- 1 mahogany-and-brass interview-table (1.80m × 0.90m)
- 2 brass-and-leather chairs (apprentice + auditor)
- 1 cog-mechanism interview-recorder (mechanical typewriter + reel-to-reel; brass)
- 1 Auditor's brass nameplate (changes per audit day)
- 1 mahogany pulpit at north for transcript-output
- 1 single pendant chandelier at z+3.0m

OBSERVATION BOOTH:
- 1 player-observation chair (mahogany-and-brass; faces one-way mirror)
- 1 transcript-reader pulpit (delivers transcript after audit ends)
- 1 candle-sconce
- 1 audio-feed brass speaker (relays audit dialogue at -6 dB)

DAY-21 SUB-STATE (Warden variant):
- Auditor's nameplate flips to "Inspector Veil-7"
- Warden's grey-wool greatcoat hangs on a brass coat-hook (visible
  through one-way mirror)
- Audit-chamber lighting drops 20% (Warden prefers dim)
- Cog-mechanism interview-recorder goes silent (Warden lip-reads,
  records nothing — visible-difference detail)
- Player's audio-feed speaker emits ONLY breath-and-pen-scratch
  (no transcribed dialogue audible)
```

#### Camera spawns

```
- cs_audit_day7_<archetype>     (12 archetype variants, FPV-of-apprentice in chair)
- cs_audit_day14_<archetype>    (12 archetype variants)
- cs_audit_day21_<archetype>    (12 archetype variants — Warden present)
- cs_audit_observation_first_view
- cs_audit_transcript_delivered  (parametric — pulpit shows current day's transcript)
- cs_audit_warden_arrives        (Day-21 unique cut; player sees Warden cross
                                   from booth to interrogation room)
```

#### Doorways

```
- south: connects to A.59 Doctrine Binding Chamber (interrogation entry; locked
         except during scheduled audit)
- west:  observation booth entry (player access; from a corridor connecting back
         to A.50 Apprentice Hall — separate from interrogation entry)
- north: connects to A.61 The Forge (one-way; only opens after Day-21 audit
         passes)
```

#### Story-tie

When `apprenticeMechronisAudits.runAudit(day)` fires, the
appropriate cutscene plays. Day-21 carries the Warden variant.
Each archetype × audit-day cell (12 × 3 = 36) has its own VO
take per `apprentice-pedagogy-audits-lines.json` (578 lines
total). The transcript-reader pulpit south wall ANIMATES the
brass-bound transcript appearing for player to read post-audit.

#### FX + performance

```
FX:           cog-mechanism interview-recorder ticking; brass-bound transcript
              animation at audit close; one-way mirror cyan-rim shimmer; Warden's
              greatcoat fabric subtle drape
performance:  0.7M tris (interrogation + booth combined); 168 MB; 12 lights
```

#### 13-state axis grid

| axis | state-list |
|---|---|
| 1–4 | fixed (per above) |
| 5 connection rules | south↔doctrine_chamber; west↔corridor (observation entry); north↔forge (one-way after Day-21) |
| 6 economic surface | idle (no audit scheduled) / active (audit in progress) / contested (apprentice walks out — fail-state branch) |
| 7 governance | `audit_day7_pending` → south door warms cyan; `audit_day21_warden_attending` → Warden coat-hook fills; `audit_passed_<archetype>` → north door warms cyan (Forge unlock) |
| 8 tournament | off (no audit) / qualifier (Day-7) / finals (Day-14) / champion (Day-21 — Warden personally observes) |
| 9 TV-infection | clean / exposed (transcript-reader animates with mycelium thread) / spreading (cog-recorder skips) / corrupted (transcript outputs corruption-pink ink) / quarantined (yellow-X across one-way mirror) |
| 10 epoch / shadowtongue | low / rising / high / grand-edit (one prior transcript rewrites with indigo marginalia) |
| 11 time-of-day | dawn / midday / dusk / nightwatch (Day-21 Warden audits ONLY happen at dawn — narrative locked; per `apprenticeWarden.ts` spec) |
| 12 faction livery | none / hierarchy / dreamers / pureflame / insurgency / panopticon (Auditor's nameplate framed in panopticon-violet) / collectors / multi |
| 13 storyteller + HUD | HUD overlap: transcript-reader pulpit doubles as the Audit Transcript UI. Mystery-arc: Day-21 Warden's greatcoat coat-hook reveals at Act-7 — a second coat hangs there belonging to a previous player. |

#### NB2 prompt — Day-7/14 audit (FPV-of-apprentice variant)

```yaml
nb2:
  model: gemini-3-pro-image-preview
  aspect_ratio: "21:9"
  resolution: "4K"
  reference_images:
    - cdn/client-public/art/refs/apprentice_<archetype>_portrait.png
  prompt: |
    SUBJECT: the interrogation side of the Audit Chamber from
      the apprentice's seated FPV — a Mechronis Auditor in a
      faceless brass mask seated across an 1.80m mahogany
      interview-table; one-way mirror at frame-right (player
      observation behind, unseen); brass cog-mechanism interview-
      recorder at table's left clicking once per second; a brass
      nameplate on the table reads "MECHRONIS AUDITOR".
    COMPOSITION: medium close-up FPV from apprentice's seated
      eye-line +1.55m; 50mm; shallow DOF on Auditor; one-way
      mirror in soft foreground bokeh.
    LIGHTING/CAMERA: 1800K single pendant key from above; 5400K
      diffuse fill from rear booth; 6500K cyber-cyan rim from
      one-way mirror frame; 12000K occult-violet practical at
      Auditor's nameplate; ARRI Alexa anamorphic; Kodak Vision3
      500T pushed +1.
    STYLE: APPRENTICE_AESTHETIC: steampunk-cyberpunk-occult; cold
      institutional with cog-mechanism brass and cyber-cyan rim;
      palette `#c9a14a / #5fa8ff / #0d0a08 / #ff2a8a / #5a1a1f
      / #dccfaa`; volumetric oil-smoke z+1.5–3.0m.
    CONSTRAINTS: no extra fingers; no watermark; no on-screen UI;
      first-person POV from the apprentice's eyes (NOT player —
      this is one of the rare non-player FPV cuts); the
      apprentice's gloved hands rest on the interview-table;
      no third-person body of the apprentice; no mirrors or
      reflections of the apprentice; the Auditor's mask never
      reveals a face.
    Output 4K, 21:9.
pipeline:
  nb2_seed: 180101..180136     # 12 archetypes × 3 days
  veo_seed: 280101..280136
  vo_manifest_ref: apps/scripts/apprentice-pedagogy-audits-lines.json (line ranges per archetype × day)
  cdn_target: cdn/client-public/cutscenes/cs_audit_day<n>_<archetype>/
```

#### NB2 prompt — Day-21 Warden variant overrides

```yaml
nb2_overrides_day21:
  Auditor's nameplate now reads "INSPECTOR VEIL-7" (16 chars,
    NB2 text-rendering-safe).
  Warden's grey-wool greatcoat is hung on a brass coat-hook at
    frame-left mid-distance — visible to the apprentice (and to
    the player through the one-way mirror).
  Cog-mechanism interview-recorder is silent (no rotation).
  Lighting drops 20% across the chamber.
  Auditor figure remains faceless brass-masked but their
    posture is shifted forward 0.10m — leaning in — with hands
    folded on the table.
  Veo audio: cog-recorder is SILENT for the entire 8s; the
    chant-loop drops to -42 dB; only breath + pen-scratch.
  Veo dialogue: Inspector Veil-7 says, "Tell me about the
    rope." (lip-sync; one of 12 archetype-specific lines —
    line-list TBD per `apprenticeWarden.ts` Day-21 dialog).
```

---

### §AC.4.3 A.61 The Forge — FULL

**Status: FULL spec.** A ritual chamber where the player and
apprentice **co-forge** the apprentice's Signature Card at
Day-28. The card emerges tinted by archetype × doctrine × bond /
corruption ratio. This is the BioWare-grade lightsaber-build
moment of the apprentice arc.

#### Header

```
space_id:        ark.the_forge
space_name:      The Forge
space_type:      ark_room
act_introduced:  Act 2 (Day-28 graduation week)
lore_anchor:     loredex.system.signature_card + arc.signature_card_forge
aesthetic_tier:  steampunk_cyberpunk_occult
```

#### Geometry

```
dimensions:    10.00 m × 8.00 m × 4.20 m
origin_point:  centre of floor at south door threshold
floor_plan:    rectangular with central 2.5 m × 1.5 m brass-and-iron forge-anvil;
               6 effect-slot inlays around the anvil at 60° spacing (one slot per
               eligible effect: battle_cry_recitation, deathwatch_lament,
               rebirth_silence, rally_chorus, drain_witness, stun_keyturn)
```

#### Floor / walls / ceiling / lighting

```
floor:    iron deck plating with central 4m chalk-and-gold-blood-channel sigil
          surrounding the anvil; 6 effect-slot brass inlays at 60° spacing
walls:    stone-and-brass with cyber-cyan fiber-optic conduits running ceiling-to-
          floor at 6 positions (one per effect-slot); each wall-position has a
          glass-fronted display case showing past-cohort signature cards (forged-
          card library; readable lore)
ceiling:  4.20m; 1 central pendant + 6 candle-clusters on chains z+2.4m above
          each effect-slot; forge-flue at apex (always-active ember-glow)
key:      1800K candle (6 clusters) + 1800K forge-flue ember-orange (forge-active
          state); 6500K cyber-cyan rim from fiber-optic; 12000K occult-violet
          at sigil-circle nodes; per-active-effect-slot the corresponding pillar
          ignites that effect's signature colour
ambient:  60 lux when forge inactive; 120 lux when active
```

#### Atmosphere + sound

```
temperature: 22°C (warmer; forge-active 28°C)
humidity:    25%
smell:       incense + machine-oil + iron + smoke (forge) + leather
sound:       2.8 s reverb; chant-loop bed -28 dB; forge-bellow rhythm 4 s cycle
             when active; anvil-strike echo on card-forge moment
```

#### Objects

```
- 1 central forge-anvil (2.5m × 1.5m brass-and-iron; chalk-circle inlay around base;
  6 effect-slot positions; 4 fiber-optic neural-jack ports at corners; the card-forge
  surface is brass-rim mahogany set into iron — cards emerge from this surface)
- 6 wall-mounted glass-fronted display cases (past-cohort signature cards; readable)
- 1 forge-flue at apex (always-glowing ember-orange; intensifies during forge)
- 1 player-position bench at south (mahogany-and-brass; player sits during forge)
- 1 apprentice-position position-mark at north (chalk-circle outline on floor;
  apprentice stands here)
- 6 candle-clusters on chains
- 6 fiber-optic conduits (cyber-cyan; ceiling-to-floor at each effect-slot pillar)
- 1 brass-bound forge-ledger on a swivel-pulpit at east wall (records every
  card forged this cycle)
- 1 anvil-hammer (brass-headed; sits on hook beside anvil; struck once per forge)
```

#### Camera spawns

```
- cs_forge_first_arrival
- cs_forge_signature_<archetype>     (12 archetype variants, Day-28 forge)
- cs_forge_card_handed_off           (apprentice receives the warm card)
- cs_forge_past_cohort_display_view  (player examines the wall-display library)
```

#### Doorways

```
- south: connects to A.60 Audit Chamber (one-way; only opens after Day-21 pass)
- north: connects to A.51 Trial Hall (graduation-day procession)
```

#### Story-tie

When `apprenticeSignatureCard.forge(<archetype>, <doctrine>,
<bond_ratio>)` fires, the corresponding effect-slot pillar
ignites in that effect's signature colour, the central anvil
surface produces a card visibly forming over 3 seconds, the
player and apprentice each place a gloved hand on the anvil-rim
(2-handed forge — the BioWare-grade beat), the anvil-hammer
strikes once at the moment of forge-completion, and the card
emerges warm. The forged card is then placed in the wall-
display library's "current cohort" panel.

#### FX + performance

```
FX:           candle-flicker (6 clusters); forge-flue ember-glow (always);
              forge-active intensification; per-effect-slot pillar ignite;
              card-forming animation (brass-spark micro-particle); anvil-hammer
              strike vibration shimmer; 4-corner neural-jack port arc-flash
              during forge
performance:  1.0M tris; 256 MB; 24 lights
```

#### 13-state axis grid

| axis | state-list |
|---|---|
| 1–4 | fixed |
| 5 connection rules | south↔audit_chamber (one-way after Day-21); north↔trial_hall |
| 6 economic | idle (no candidate Day-28) / active (forge in progress) / contested (architect-coopted forge — high corruption ratio; card emerges with corruption-pink trim) |
| 7 governance | `signature_card_forge_pending` → all 6 effect-slots dim-pulse; `signature_card_forged_<id>` → that effect-slot ignites for 24h; `signature_card_corrupted_high` → forge-flue ember turns corruption-pink |
| 8 tournament | off / qualifier / finals (forge week) / champion (12-archetype simultaneous forge; all 6 slot-pillars ignite) |
| 9 TV-infection | clean / exposed (forge-flue mycelium) / spreading (display library cards rewrite themselves) / corrupted (anvil-surface inverts to mirror that shows the player as Architect) / quarantined |
| 10 epoch / shadowtongue | low / rising / high / grand-edit (one display-card rewrites with indigo marginalia) |
| 11 time-of-day | dawn / midday / dusk / nightwatch (forge runs at any phase; ember-glow strongest at nightwatch) |
| 12 faction | 8 states (changes the forged-card frame colour) |
| 13 storyteller + HUD | mystery-arc: 13th display case behind north-wall mirror reveals at Act-7 — every player's previous signature card. HUD overlap: anvil surface doubles as the Signature Card Forge UI. |

#### NB2 prompt — forge moment (FPV-of-player at anvil)

```yaml
nb2:
  model: gemini-3-pro-image-preview
  aspect_ratio: "21:9"
  resolution: "4K"
  reference_images:
    - cdn/client-public/art/refs/apprentice_<archetype>_portrait.png
    - cdn/client-public/art/refs/apprentice_signature_card_template.png
  prompt: |
    SUBJECT: the central forge-anvil at The Forge — a 2.5×1.5m
      brass-and-iron anvil with 6 effect-slot inlays at 60°
      spacing (battle_cry_recitation / deathwatch_lament /
      rebirth_silence / rally_chorus / drain_witness /
      stun_keyturn — each labelled in cipher-script around its
      brass rim); the apprentice (per archetype, mid-forge) stands
      at north of anvil with one gloved hand on anvil-rim;
      cyber-cyan fiber-optic conduits ignite at the active effect-
      slot pillar in the wall behind; forge-flue at apex glows
      ember-orange; brass anvil-hammer rests on hook at
      frame-right.
    COMPOSITION: medium close-up FPV from player's seated bench
      eye-line +1.65m; the player's gloved hands enter lower
      frame from below resting on anvil-rim opposite the
      apprentice's hand; 50mm; shallow DOF on the apprentice
      and the active effect-slot.
    LIGHTING/CAMERA: 1800K candle key (6 clusters); 1800K forge-
      flue ember-orange backlight on apprentice silhouette;
      6500K cyber-cyan rim from active effect-slot pillar;
      12000K occult-violet practicals at sigil-circle nodes;
      ARRI Alexa anamorphic; Kodak Vision3 500T pushed +1.
    STYLE: APPRENTICE_AESTHETIC; the forge moment — brass-and-
      ember warmth meeting cyber-cyan ritual; palette
      `#c9a14a / #5fa8ff / #0d0a08 / #ff2a8a / #5a1a1f /
      #dccfaa` plus forge-orange `#ff5a1a`; volumetric oil-smoke
      + ember-haze z+1.5–3.0m; anamorphic flare on forge-flue.
    CONSTRAINTS: no extra fingers; no watermark; no on-screen UI;
      no studio logo; first-person POV from the player's eyes;
      only the player's gloved hands enter lower frame from
      below resting on anvil-rim; no third-person body of the
      player; no mirrors or reflections of the player; the
      apprentice across the anvil is fully visible (third-person
      OF THE APPRENTICE is acceptable since the player is FPV);
      consistent eye-height per host_space (medium 1.65m).
    Output 4K, 21:9.
pipeline:
  nb2_seed: 180201..180212    # one per archetype
  veo_seed: 280201..280212
  vo_manifest_ref: apps/scripts/apprentice-<archetype>-<gender>-lines.json (forge cluster)
  cdn_target: cdn/client-public/cutscenes/cs_forge_signature_<archetype>/
```

---

### §AC.4.4 A.62 The Memory Card Library — COMPACT FULL

```
space_id: ark.memory_card_library
size: 12.00m × 8.00m × 3.60m
purpose: museum / archive of fallen-apprentice Memory Cards;
  per-card consumption ritual happens at south consumption-pulpit
zones: 1 wall-of-portraits (north — 12 archetype portrait positions
  + parametric expansion shelving); 1 consumption-pulpit (south);
  12 pedestal-cases at perimeter (one per recently-active Memory Card);
  1 candle-bench at west (12 candles, one per active card)
fixtures:
  - portrait-wall: north wall floor-to-ceiling; 12 archetype-positioned
    glass-fronted brass frames; faces appear post-permadeath (parametric
    to fallen-apprentice's portrait); empty-frame state when no card minted
  - 12 pedestal-cases at perimeter: each holds a Memory Card under glass;
    cyber-cyan rim ignites when card is "active" (eligible for inheritance);
    cards visible in cipher-script + archetype-glyph
  - consumption-pulpit at south: brass-bound book + brass-rim slot for
    Memory Card insertion; consumption-animation: card burns at edge,
    brass-spark cascade, voice-over of dead apprentice
  - candle-bench at west: 12 candles, one per minted-but-unconsumed card;
    snuffs on consumption
floor: black-marble + gold-blood-channel inlay running south-to-north
walls: stone-and-brass; cyber-cyan fiber-optic conduits at each pedestal;
  4 sigil-etched plates between portrait positions
ceiling: 3.60m; 4 hanging candle-clusters z+2.4m; fiber-optic ribbon
  spelling "INHERIT WHAT THEY KNEW" in cipher-script (24 chars)
lighting: 1800K candle key only (museum-dim); 6500K cyan rim at active
  pedestals; 12000K violet at consumption-pulpit
atmosphere: incense + parchment + cold-stone; reverb 4.6 s; chant-loop
  -38 dB bed; absolute-silence during consumption ritual
camera_spawns:
  - cs_memory_library_first_arrival
  - cs_memory_card_minted_<archetype>      (12 variants — when an apprentice
                                             permadeaths; card materialises
                                             on its pedestal)
  - cs_memory_card_inheritance_<archetype>  (12 variants — when a new
                                             apprentice consumes the card;
                                             card burns; voice surfaces)
doorways:
  - south: connects to A.55 Mourning Wall (one-way; cards minted there feed here)
  - east: connects to A.50 Apprentice Hall (cohort access)
13-axis grid (compact):
  6 economic: idle / active (consumption ritual underway) / contested (multiple
    cards being inherited concurrently)
  7 governance: `memory_card_minted_<archetype>` → portrait-frame fills + pedestal
    glass-case ignites + candle-bench candle ignites; `memory_card_consumed_<archetype>`
    → card-burn animation + voice-over trigger
  8 event: off / qualifier / finals / champion (12-card-active state — all 12
    pedestals lit simultaneously)
  9 TV: clean / exposed (portrait faces flicker between identities) / spreading
    (cards in pedestals rewrite themselves) / corrupted (consumption-pulpit
    outputs corruption-pink ink) / quarantined
  10 epoch: low / rising / high / grand-edit (one Memory Card text rewrites
    with indigo marginalia — premonition of a death not yet happened)
  11 time-of-day: dawn / midday / dusk / nightwatch (cards' cyan-rim brightest
    at nightwatch — ghost-hour reading)
  12 faction: 8 states (per-card faction allegiance shows on pedestal trim)
  13 storyteller + HUD: HUD overlap: portrait wall doubles as Memory Card
    Library UI. Mystery-arc: 13th portrait-frame appears at Act-7 — the
    player's own pre-emptive Memory Card (minted before any death).
art_resources:
  textures: memory_library_floor.png, memory_library_portrait_wall.png,
    memory_library_pedestal_case.png, memory_library_consumption_pulpit.png,
    memory_library_candle_bench.png
  models: memory_library_portrait_frame.glb (×12), memory_library_pedestal.glb (×12),
    memory_library_consumption_pulpit.glb, memory_library_candle_bench.glb,
    memory_library_memory_card.glb (animated burn for consumption)
performance: 1.0M tris; 256 MB; 22 lights
```

---

### §AC.4.5 A.63 Celebration Park — Training Barracks (sub-zone of HB1 destination)

**Status: FULL spec, sub-zone of `dest.celebration_school`.**
The cohort-of-3 system (active companion + training_a + training_b)
splits the 12-apprentice cohort across the Ark and Celebration
Park. The two training-pair apprentices live in the Park
during their 28-day trials. This is their residence.

#### Header

```
space_id:        dest.celebration_school.training_barracks
space_name:      Celebration Park — Training Barracks
space_type:      destination_zone (sub-zone of HB1 Celebration School)
act_introduced:  Act 2
aesthetic_tier:  hybrid_celebration_apprentice  (Celebration School
                 golden-hour palette + APPRENTICE_AESTHETIC overlay
                 on the apprentice-specific fixtures)
```

#### Geometry

```
dimensions:    20.00 m × 12.00 m × 6.00 m (covered pavilion, partial-outdoor)
origin_point:  centre of pavilion at south arch entry
floor_plan:    open-plan pavilion; 2 apprentice bunk-alcoves at NE + NW;
               1 stage-3 observation post at north-centre (raised dais);
               1 cohort-warm-up area at south
```

#### Floor / walls / ceiling / lighting

```
floor:    cobblestone (Celebration aesthetic) with brass-rim inlay around the
          apprentice bunk-alcoves and the stage-3 dais
walls:    pavilion-wall is half-height (1.20m brass-and-cobble); above the half-
          wall, the Park's open-air canopy with vine-and-fiber-optic decor
          (cyber-cyan fiber-optic threaded through real vines)
ceiling:  partially open-air; covered by canopy of solar-fabric stretched over
          brass arches at z+5.0–6.0m; 8 gas-mantle lamps hang from arch nodes;
          4 cyber-cyan fiber-optic ribbons running E-W at z+5.5m
key:      hybrid: 4500K Celebration-golden-hour daylight (when in Celebration's
          internal day-cycle) + 1800K gas-mantle accent at night; 6500K cyber-cyan
          rim from fiber-optic; 12000K occult-violet at the stage-3 dais
ambient:  240 lux daylight equivalent / 60 lux nightwatch
```

#### Atmosphere + sound

```
temperature: 24°C (Celebration's perpetual mild climate)
humidity:    50%
smell:       grass + cobblestone-warm + incense + machine-oil
sound:       Celebration ambient bed (children-laughter -42 dB, distant bell
             every 3 min) + APPRENTICE-specific hiss + chant-loop at -36 dB
             from the stage-3 dais
```

#### Objects

```
- 2 apprentice bunk-alcoves (NE + NW; each is a 4×3×3m sub-zone with archetype-
  themed cot, locker, table, candle-sconce, cog-mechanism alarm-clock per
  archetype; identical structure to A.53 Cellblock cells but Celebration-Park-
  themed with cobblestone floor and vine-and-fiber-optic decor); occupants are
  training_a and training_b apprentices
- 1 stage-3 observation post (north-centre raised 0.6m brass-and-mahogany dais;
  active companion stands here to witness training pair's stage-3 betrayal/
  doctrine choice)
- 1 cohort-warm-up area (south; 4 brass-bound exercise-rigs)
- 1 Park-bell (brass; rings at training-day boundaries)
- 8 gas-mantle pendant lamps + 4 fiber-optic ribbons + 4 candle-sconces at the
  observation-post corners
- 1 weather-glass (brass-bound; reads Celebration's day-cycle)
```

#### Camera spawns

```
- cs_park_barracks_first_arrival
- cs_park_training_pair_assigned        (one per cohort-of-3 spawn cycle)
- cs_park_stage3_observation            (active companion witnesses stage-3 choice)
- cs_park_park_bell_training_day_boundary (every 3.5 in-game days during a 28-day
                                            trial; 8 such boundaries)
- cs_park_cohort_resonance_<archetype_pair>  (parametric; cohort banter when
                                               training_a + training_b doctrines
                                               resonate)
```

#### Doorways

```
- south: connects to A.50 Apprentice Hall via HB1 Celebration School transit
  (dest.celebration_school.courtyard)
- north: connects to A.64 Triangle Event Alcove (private dialogue space)
```

#### Story-tie

The cohort-of-3 system runs training_a + training_b apprentices
through their 28-day trials in this barracks. The active
companion witnesses the stage-3 doctrine choice from the
observation post. Cohort banter fires when training pair's
doctrines resonate (per `apprenticeBanter.ts` cohort-banter
candidate list). The Park-bell rings at training-day boundaries.

#### 13-state axis grid (compact)

| axis | state |
|---|---|
| 1–4 | fixed |
| 5 connection | south↔HB1 transit; north↔triangle_alcove |
| 6 economic | idle / active (training pair in residence) / contested (training pair feud) |
| 7 governance | `training_pair_assigned` → both bunk-alcove sconces ignite; `stage3_choice_pending` → observation-post fiber-optic intensifies |
| 8 event | off / qualifier (Day 7 boundary) / finals (Day 21 boundary) / champion (Day 28 — pair graduates simultaneously) |
| 9 TV | clean / exposed (canopy vines wither) / spreading / corrupted (cobblestones invert to swarm-pattern) / quarantined |
| 10 epoch | low / rising / high / grand-edit |
| 11 time-of-day | dawn / midday / dusk / nightwatch (golden-hour brightest at midday; nightwatch is the most occult-feeling phase here) |
| 12 faction | 8 states (Park-bell rim colour modulates) |
| 13 storyteller + HUD | HUD overlap: stage-3 dais doubles as the Cohort-3-Slot-Panel UI. Mystery-arc: stage-3 dais reserves a 4th seat (active player) for Act-7 reveal. |

#### Art resources

`park_barracks_floor_cobblestone.png`,
`park_barracks_canopy_solar_fabric.png`,
`park_barracks_bunk_alcove_<archetype>.png` × 12,
`park_barracks_stage3_dais.png`, `park_barracks_park_bell.glb`,
`park_barracks_exercise_rig.glb`.

---

### §AC.4.6 A.64 The Triangle Event Alcove — COMPACT FULL

```
space_id: dest.celebration_school.triangle_alcove
size: 6.00m × 4.00m × 3.60m
purpose: private dialogue alcove off the Training Barracks where
  cohort triangle events fire (intra-pair tension dialog scenes;
  active witnesses or intervenes); per `apprenticeCohort.ts` triangle-
  event resolver
zones: 1 brass-and-leather two-seat bench (south); 1 active-companion
  observation-stool (north — single seat, FPV-anchored); 1 candle-cluster
  ceiling pendant (centre); 1 chalkboard wall (east)
floor: cobblestone with brass-rim inlay; chalk-circle inlay around bench foot
walls: half-cobble half-leather-padded; 1 chalkboard at east (mentor-NPC
  updates with triangle-event notes); cyber-cyan fiber-optic conduits at
  the bench backrest
ceiling: 3.60m; 1 candle-cluster pendant z+2.4m
lighting: 1800K candle key (intentionally tense-dim); 6500K cyan rim from
  fiber-optic at bench backrest; 12000K violet at chalkboard
atmosphere: cobble-warm + incense + leather + machine-oil; reverb 1.6 s
  (acoustic isolation — dialogue not overheard from barracks)
camera_spawns:
  - cs_triangle_event_<archetype_pair>      (parametric per pair × event-type;
                                              3 event-types × C(12,2) pairs but
                                              authored as 6 representative
                                              templates)
  - cs_triangle_event_resolved_intervene
  - cs_triangle_event_resolved_witness
  - cs_triangle_event_resolved_walkaway
doorways:
  - south: connects to A.63 Park Barracks
13-axis grid:
  6 economic: idle / active (event firing) / contested (active companion
    walks out — bond-break)
  7 governance: `triangle_event_pending_<pair>` → bench fiber-optic ignites
  8 event: off / qualifier / finals / champion (3-pair simultaneous events —
    rare cycle event)
  9 TV: clean / exposed / spreading / corrupted (chalkboard self-erases) / quarantined
  10 epoch: low / rising / high / grand-edit
  11 time-of-day: triangle events biased toward dusk-and-nightwatch in
    runtime; chamber's intentional dim works at all phases
  12 faction: 8 states
  13 storyteller + HUD: HUD overlap: chalkboard wall doubles as triangle-event
    UI. Mystery-arc: at Act-7 the chalkboard reveals a list of every player's
    triangle-event choice across save-game history.
art_resources:
  textures: triangle_alcove_bench.png, triangle_alcove_chalkboard.png
  models: triangle_alcove_bench.glb, triangle_alcove_observation_stool.glb,
    triangle_alcove_chalkboard.glb (animated text)
performance: 0.4M tris; 96 MB; 8 lights
```

---

### §AC.4.7 A.65 The Warden's Dock — COMPACT FULL (heretical_quiet path only)

```
space_id: dest.warden_dock
space_name: The Warden's Dock — First Light
space_type: destination_zone (sub-zone of Ark dockside, accessible only
  during Day-14 cutscene; not enterable in free-roam)
purpose: emotional-apex 1-on-1 with Inspector Veil-7 at first light;
  fires only on heretical_quiet doctrine; offers the apprentice a
  "way out" — recite Compliant Mouth instead. Refuse and the Warden's
  interest deepens.
size: 12.00m × 6.00m × open-sky (outdoor)
zones: 1 dockside table with two enamel coffee mugs (one cold, one hot);
  Warden in grey-wool greatcoat seated north of table; apprentice in
  default cohort gear seated south (FPV-of-apprentice for this cut);
  brass-bound cargo containers in mid-distance background; the Ark's
  hull rises at far-north
fixtures:
  - 1 dockside table (mahogany-and-brass; chalk-circle inlay on table-top — the
    Warden has chalked a single sigil for this conversation)
  - 2 enamel coffee mugs (one steaming hot at apprentice's side; one cold and
    untouched at Warden's side)
  - 1 brass-and-iron pier-bell (background; never rung)
  - 1 cargo-container stack (mid-distance; brass-bound; Warden's exit-route at
    end of scene)
  - 1 audio-feed brass speaker on a pole (broadcasts wake-up klaxons across the
    Ark; muted for this cutscene)
floor: ridge-iron pier-plating with copper-trim caulk-line; chalk-circle inlay
  on table-top (not floor)
walls: open-sky; the Ark's hull rises north as a canyon-wall; 4 cargo-container
  stacks at mid-distance
ceiling: open-sky; pre-dawn sky in steel-grey transitioning to first-amber at
  scene's 5-second mark
lighting: 800K dim deep-amber from the Ark's hull running-lights + 5800K cold
  pre-dawn sky from above; 6500K cyber-cyan rim from the audio-feed speaker
  pole; 12000K occult-violet practical at the Warden's nameplate (clip-on
  lapel)
atmosphere: cold-air (8°C — coastal pre-dawn); damp pier-warm + machine-oil +
  coffee-steam (apprentice's mug); reverb 0.8 s (open outdoor)
camera_spawns:
  - cs_warden_dock_first_light                     (12 archetype variants — VO
                                                     line per archetype × Warden's
                                                     pitch)
  - cs_warden_dock_pitch_compliant_mouth           (Warden's offer)
  - cs_warden_dock_apprentice_decline              (heretical_quiet refusal)
  - cs_warden_dock_apprentice_accept               (Warden's recruitment success)
  - cs_warden_dock_warden_walks_away               (closing — Warden disappears
                                                     into cargo-container stacks)
doorways:
  - none enterable; this is a cutscene-only sub-zone
13-axis grid:
  6 economic: idle / active (cutscene firing) — never contested (no fail-out
    state; one of three resolutions always lands)
  7 governance: `warden_dock_event_pending` → Warden NPC pathing fires; only
    activates when `apprenticeDoctrines.bind == "heretical_quiet"` AND day=14
  8 event: off / qualifier / finals / champion (rare path)
  9 TV: clean / exposed (pier-plating surface phases between iron and bone) /
    spreading / corrupted (Warden's coffee mug fills with corruption-pink) /
    quarantined
  10 epoch: low / rising / high / grand-edit (Warden's lapel-nameplate rewrites
    itself with indigo)
  11 time-of-day: NARRATIVELY LOCKED to dawn (pre-dawn → first-amber transition
    in-cutscene)
  12 faction: panopticon (canonical; the Warden serves the Panopticon faction
    even if Warden's lapel reads Mechronis); none / hierarchy / dreamers
    (3 alternate faction-livery states; rare branches)
  13 storyteller + HUD: mystery-arc: at Act-7, the cold coffee mug at Warden's
    side reveals a small printed photograph at its base — of the player's
    own Day-1 face. HUD overlap: dialogue-choice wheel for accept / decline.
art_resources:
  textures: warden_dock_pier_iron.png, warden_dock_dawn_sky.png,
    warden_dock_cargo_containers.png, warden_dock_table_chalk_sigil.png
  models: warden_dock_table.glb, warden_dock_coffee_mug.glb (×2),
    warden_dock_audio_speaker_pole.glb, warden_grey_greatcoat_figure.glb,
    warden_lapel_nameplate.glb
  vfx: dawn-sky transition gradient (5800K → 4500K over 8s); coffee-steam
    volumetric (apprentice's mug only); audio-speaker subtle electrical hum
    visible-distortion
performance: 0.5M tris; 144 MB; 8 lights
```

---

### §AC.4.8 A.66 The Mission Briefing Board / War Room — COMPACT FULL

```
space_id: ark.mission_briefing_war_room
size: 12.00m × 10.00m × 4.40m
purpose: where 17 graduate-legion missions are briefed; per-role
  assignments routed from here per `apprenticeMissionTypes.ts`
zones: 1 holodisplay-table at centre (3m × 2m brass-rim mahogany; cyber-cyan
  holographic deployment-grid); 1 dossier-wall at north (17 slots, one per
  mission template); 1 quartermaster-NPC pulpit at south; 7 role-station
  alcoves at perimeter (companion / cryo_vault / army_leader / trade_envoy /
  tower_captain / sacrificed / relationship_gift)
fixtures:
  - holodisplay-table: brass-rim mahogany top with cog-mechanism armature
    suspending a cyber-cyan holographic deployment-grid z+0.6m above the table;
    4 fiber-optic neural-jack ports at corners; chalk-circle inlay around
    table base
  - dossier-wall: 17-slot brass-bound rack at north; each slot holds a
    mission-dossier folio (parchment-cream paper bound in brass clip);
    parametric per current cycle
  - quartermaster-NPC pulpit: south wall; mahogany-and-brass; quartermaster
    stands here when in residence
  - 7 role-station alcoves: 1.5×1.5×2.5m alcoves with role-specific fixtures:
      companion: brass berth-key on hook
      cryo_vault: vial-rack with 12 specimen-jars
      army_leader: brass war-banner mounted on wall
      trade_envoy: brass-bound ledger and abacus
      tower_captain: surveillance-grid 4-monitor array
      sacrificed: incense-thurible cluster (extinguished candle)
      relationship_gift: small velvet-lined gift-box display
  - 1 brass deployment-bell at south (rung once per mission deployment)
floor: parquet with brass-rim; central chalk-circle around holotable
walls: leather-padded with brass studs; cyber-cyan fiber-optic conduits in
  cog-mechanism cabinets behind glass; 4 sigil-etched brass plates
ceiling: 4.40m; 4 gas-mantle pendants + 8 candle-sconces; 4 fiber-optic
  ribbons running E-W
lighting: 1800K candle/gas-mantle key + 5400K diffuse fill from holodisplay
  + 6500K cyan rim + 12000K violet at role-station alcoves
atmosphere: incense + machine-oil + paper-dust + leather; reverb 2.4 s;
  holodisplay 60 Hz hum bed
camera_spawns:
  - cs_mission_briefing_first_arrival
  - cs_mission_briefing_<mission_id>     (17 mission variants; brief = open of
                                           dossier on holodisplay)
  - cs_mission_deployment_bell           (rung at deployment moment)
  - cs_mission_quartermaster_address
doorways:
  - south: connects to A.50 Apprentice Hall
  - east: connects to A.31 Trade Hub (existing — trade-mission departure)
  - north: connects to A.20 War Room (existing — army-leader briefings overflow here)
13-axis grid:
  6 economic: idle (no missions briefing) / active (briefing in progress) /
    contested (insufficient cohort for deployment)
  7 governance: `mission_briefing_pending_<id>` → that mission's dossier slot
    illuminates; `mission_deployed_<id>` → role-station alcove ignites for 24h
  8 event: off / qualifier / finals (graduation-day mass-deployment) /
    champion (12 missions deployed simultaneously)
  9 TV: clean / exposed / spreading / corrupted / quarantined
  10 epoch: low / rising / high / grand-edit
  11 time-of-day: dawn / midday / dusk / nightwatch
  12 faction: 8 states
  13 storyteller + HUD: HUD overlap: holodisplay = the Mission Resolver UI.
    Mystery-arc: 18th dossier-slot at end of north rack reveals at Act-7 —
    the player's own deployment.
art_resources:
  textures: mission_briefing_floor_parquet.png,
    mission_briefing_dossier_wall_rack.png,
    mission_briefing_role_alcove_<role>.png × 7,
    mission_briefing_holotable.png,
    mission_briefing_deployment_bell.png
  models: mission_briefing_holotable.glb (animated holographic grid),
    mission_briefing_dossier_folio.glb (×17),
    mission_briefing_role_alcove.glb (×7),
    mission_briefing_quartermaster_pulpit.glb,
    mission_briefing_deployment_bell.glb
performance: 1.0M tris; 256 MB; 24 lights
```

---

### §AC.4.9 A.67 Post-Mission Return Hub (7 role-variant sub-zones)

The 7 role-variant return scenes inherit the apprentice's role
classification (companion / cryo_vault / army_leader / trade_envoy
/ tower_captain / sacrificed / relationship_gift) and play at
the appropriate ship location:

| role | return-zone (existing room) | sub-zone authored here |
|---|---|---|
| companion | A.42 Hangar Dock | §AC.4.9.1 dock-return-bay |
| cryo_vault | A.01 Cryo Bay | §AC.4.9.2 cryo-return-aisle |
| army_leader | A.50 Apprentice Hall | §AC.4.9.3 hall-return-arch |
| trade_envoy | A.31 Trade Hub | §AC.4.9.4 trade-counter |
| tower_captain | A.33 Defense Command | §AC.4.9.5 tower-comm-relay |
| sacrificed | A.55 Mourning Wall | §AC.4.9.6 mourning-wall-fresh-plaque (reuses §AC.1.6) |
| relationship_gift | A.15 Social Hub alcove | §AC.4.9.7 alcove-gift-table (reuses §AC.1.10.3) |

Each non-reused sub-zone (5 of 7) carries a compact §4 + 13-axis
spec inheriting the parent room's existing trait-lock. Camera
spawns:

```
- cs_mission_return_<mission_id>_<outcome>   (17 missions × 3 outcome
                                               variants = 51 cuts; compact
                                               form per outcome)
```

Trait-lock per role:
- **companion**: standard FPV at hangar; apprentice walks down ramp; brass
  pier-bell rings on arrival
- **cryo_vault**: FPV at cryo-pod array; apprentice steps from pod-rim;
  vial-rack delivery on table
- **army_leader**: FPV at Apprentice Hall north arch; apprentice carries
  war-banner; cohort plaque animates
- **trade_envoy**: FPV at Trade Hub counter; apprentice slides ledger
  across; abacus clicks once
- **tower_captain**: FPV at comm-relay; apprentice at the comm-screen;
  surveillance-grid resolves their face
- **sacrificed**: FPV at Mourning Wall; their plaque etches in real-time
  (reuses §AC.2.3 obituary cuts but with sacrificed-only modifier — bell
  tolls THREE times instead of once)
- **relationship_gift**: FPV at Social Hub alcove; apprentice places a
  gift-box on coffee table; velvet-lined gift-box opens to reveal the
  per-archetype gift (per `apprenticeIdentity.ts` archetype-gift table)

#### 13-state axis grid (compact — applies to all 7 sub-zones)

| axis | state |
|---|---|
| 6 economic | idle / active (return underway) / contested (mission failed; apprentice returns wounded or not at all) |
| 7 governance | `mission_returned_<id>_<outcome>` → role-station alcove in §AC.4.8 dims; return-zone fixture animates |
| 8 event | off / qualifier / finals / champion |
| 9 TV | per parent room |
| 10 epoch | per parent room |
| 11 time-of-day | per parent room (most missions return at dusk per runtime) |
| 12 faction | 8 states |
| 13 storyteller + HUD | each role's return-zone reserves an Act-7 reveal slot for player's own mission report |

#### Art resources

Per role: 1 backdrop overlay + 1 apprentice-arrival animation
+ 1 role-specific prop (war-banner / vial-rack / ledger-slide /
comm-resolve-frame / gift-box). All prompts inherit
APPRENTICE_AESTHETIC + parent-room trait-lock.

---

## §AC.5 PR #580 expansion — berth system spaces

### §AC.5.1 A.68 Apprentice Berth Bunkrooms — 12 archetype variants

**Status: FULL spec (modular shared core + 12 archetype-specific
overlays).** Per-companion private cabin. Each apprentice's
berth is a 12 ft × 16 ft (3.66 m × 4.88 m) cabin with wall-
mounted Mechronis comm screen, archetype-specific activity sprite,
and ambient detail. The 4 time-of-day phases modulate backdrop
tint, brightness, and apprentice activity per `timeOfDay.ts`.

#### Shared header (one per apprentice; archetype overlays in §AC.5.1.1–§AC.5.1.12)

```
space_id_pattern:    ark.apprentice_berth.<archetype>
space_type:          ark_room
act_introduced:      Act 2 (apprentice system unlock)
lore_anchor:         loredex.system.berth + arc.berth_<archetype>
aesthetic_tier:      steampunk_cyberpunk_occult  (APPRENTICE_AESTHETIC)
```

#### Shared geometry

```
dimensions:    3.66 m × 4.88 m × 2.60 m  (12ft × 16ft, 8.5ft ceiling)
origin:        centre of floor at south door threshold
floor_plan:    rectangular; bunk at NE corner; small table at NW; locker at SW;
               wall-mount comm screen at one of three anchor positions
               (wall_left / wall_right / shelf_top — per-archetype overlay)
```

#### Shared floor / walls / ceiling / lighting

```
floor:    iron deck plating (1.20m × 0.60m sheets) with brass-rim around bunk
walls:    base coat: leather-padded with brass studs; archetype-overlay textures
          per cell (see §AC.1.4 Cellblock — same archetype-overlay scheme;
          berth-version is more spacious + has a comm screen)
ceiling:  2.60m; 1 central pendant + 2 corner candle-sconces
key:      1800K candle/gas-mantle (intentionally domestic-warm); per-archetype
          accent practical
rim:      6500K cyber-cyan from comm-screen frame fiber-optic
practical: 12000K occult-violet at the archetype-signature object
```

#### Shared atmosphere

```
temperature: 21°C
humidity:    35%
smell:       leather + machine-oil + per-archetype accent (incense for Zealot,
             ozone for Sentinel, paper-dust for Scholar, etc.)
sound:       gas-mantle hiss bed -34 dB; comm-screen hum 60 Hz at -38 dB; per-
             archetype activity SFX (Zealot whispered prayer / Ghost silence /
             Scholar page-flip / etc.)
```

#### Shared object inventory

```
- 1 single bunk (NE corner; archetype-themed pillow/blanket)
- 1 small table (NW; mahogany-and-brass; archetype-themed work surface)
- 1 wall-locker (SW; brass-bound)
- 1 deck-window (1.20m × 0.40m brass-rim porthole; shows ship-corridor or
  archetype-themed view)
- 1 wall-mounted Mechronis comm screen (wall_left or wall_right or shelf_top per
  archetype; cyber-cyan fiber-optic frame; cog-mechanism brass armature)
- 1 archetype-signature object (the diegetic detail per archetype):
    Zealot: doctrine slip pinned to wall (post-binding) + brass scripture-wheel
    Ghost: mask on hook + audio-recorder
    Scholar: open cipher-volume + reading-glasses
    Revenant: scarification-tool kit + bandage-roll
    Artisan: 24-tool brass-rack + work-in-progress on table
    Oracle: 4-card tarot spread on table + neural-jack port at bunk-side
    Wanderer: bedroll always-packed + walking-stick at door
    Martyr: redirect-rune brass plate at bunk-side + bandage-kit
    Heretic: chalkboard-fragment on wall + brass debate-bell suppressed
    Jester: 6 brass juggling-clubs on rack + retort-card stack
    Sentinel: 4-monitor surveillance-grid + brass siren-key
    Prodigal: locked drawer at bunk-side + framed photograph (face scratched)
- 1 cohort-keepsake on wall (parametric — current cohort's cohort-mate gift)
- 1 comm-screen activity overlay (parametric per timeOfDay phase + cohort state):
    DAWN:        morning-prayer / morning-watch / morning-read / etc. per archetype
    MIDDAY:      cohort-report / mission-prep / etc.
    DUSK:        evening-conversation / cohort-banter / etc.
    NIGHTWATCH:  prayer-vigil / silent-watch / late-read / etc.
```

#### Camera spawns (per berth)

```
- cs_berth_<archetype>_first_knock      (player's first visit to the berth)
- cs_berth_<archetype>_<phase>          (4 time-of-day phase variants —
                                          dawn / midday / dusk / nightwatch)
- cs_berth_<archetype>_doctrine_slip_arrived   (the moment after doctrine binding;
                                                 the slip materialises on bunk)
- cs_berth_<archetype>_audit_transcript_pinned (after Day-7/14/21; transcript
                                                 pinned to wall)
- cs_berth_<archetype>_signature_card_displayed (after forge; card warm on table)
```

#### Doorways

```
- south: connects to a shared corridor (the Berth Deck) which connects back to
  A.50 Apprentice Hall (south alcove) and A.53 Apprentice Cellblock
```

#### Story-tie (per apprentice)

The berth's diegetic detail is a real-time mirror of the
apprentice's runtime state. As the apprentice progresses (binds
doctrine, passes audits, forges signature card, deploys on
mission), wall-pinned artifacts accumulate. The comm screen
shows the apprentice's current activity per `berthCommScreen.ts`
resolver state.

#### 13-state axis grid (per berth)

| axis | state |
|---|---|
| 1–4 | fixed per archetype overlay |
| 5 connection | south↔berth-deck-corridor↔apprentice_hall |
| 6 economic | idle (apprentice asleep / off-duty) / active (apprentice present + working) / contested (apprentice in audit / mission / sleep cycle prevents visit) |
| 7 governance | `apprentice_in_residence` → bunk-light ignites; `apprentice_doctrine_bound` → doctrine-slip pinned (wall); `apprentice_audit_transcript_delivered_<day>` → transcript pinned; `apprentice_signature_card_forged` → card on table; `apprentice_in_mission` → bunk made-up + locker shut + comm-screen off |
| 8 event | off / qualifier / finals / champion (cohort-graduation week — all 12 berths simultaneously brighten) |
| 9 TV | clean / exposed (deck-window mycelium) / spreading (archetype-signature object phases between baseline and corruption) / corrupted (comm-screen shows player as Architect) / quarantined |
| 10 epoch | low / rising / high / grand-edit (one wall-pinned artifact rewrites itself with indigo) |
| 11 **time-of-day** | dawn (5800K backdrop tint, brightness 0.85) / midday (5400K, 1.0) / dusk (4500K amber-bronze, 0.78) / nightwatch (3200K cold-blue, 0.55) — modulates per `timeOfDay.ts` runtime |
| 12 faction | 8 states (per-archetype faction allegiance overlays cohort-keepsake) |
| 13 storyteller + HUD | HUD overlap: comm-screen doubles as berth-comm-screen UI. Per-archetype mystery-arc reveals at Act-7: locker contents, deck-window scene change, archetype-signature-object provenance. |

#### Art resources (per archetype)

```
For each of 12 archetypes:
  textures:
    apprentice_berth_<archetype>_floor.png
    apprentice_berth_<archetype>_walls.png
    apprentice_berth_<archetype>_archetype_signature.png
    apprentice_berth_<archetype>_bunk_pillow.png
    apprentice_berth_<archetype>_table.png
  models:
    apprentice_berth_<archetype>_bunk.glb
    apprentice_berth_<archetype>_table.glb
    apprentice_berth_<archetype>_locker.glb
    apprentice_berth_<archetype>_comm_screen.glb
    apprentice_berth_<archetype>_archetype_signature_object.glb
  activity_sprites (4 phases × 12 archetypes = 48):
    apprentice_berth_<archetype>_<phase>_activity.png
  comm_screen_overlays (parametric):
    apprentice_berth_comm_overlay_<state>.png  (state = idle / call_in / call_out
                                                 / audit_in_progress / narrative_silence
                                                 / warden_line_tap / mourning_call /
                                                 cohort_banter / commons_phone_mode)
```

#### NB2 prompt — per-archetype berth (FPV from south door, midday phase)

```yaml
nb2:
  model: gemini-3-pro-image-preview
  aspect_ratio: "21:9"
  resolution: "4K"
  reference_images:
    - cdn/client-public/art/refs/apprentice_<archetype>_portrait.png
    - cdn/client-public/art/refs/apprentice_hall_master_still.png
  prompt: |
    SUBJECT: a private apprentice berth on the Ark — 12ft × 16ft
      cabin, 8.5ft ceiling, single bunk at NE with archetype-themed
      pillow, small mahogany-and-brass table at NW with the
      archetype's work surface (per archetype: <Zealot scripture-
      wheel / Ghost audio-recorder / Scholar open cipher-volume /
      Revenant scarification-tool kit / Artisan 24-tool brass-rack /
      Oracle tarot spread / Wanderer packed bedroll / Martyr
      bandage-kit / Heretic chalkboard-fragment / Jester juggling-
      clubs / Sentinel 4-monitor surveillance-grid / Prodigal
      locked drawer with framed photograph face-scratched>),
      brass-bound wall-locker at SW, deck-window porthole with
      ship-corridor view, wall-mounted Mechronis comm screen
      (cyber-cyan fiber-optic frame, cog-mechanism brass armature,
      currently displaying archetype's midday activity overlay).
    COMPOSITION: medium-wide FPV from south door threshold; 24mm;
      eye-level +1.65m; deep DOF; the apprentice (per archetype)
      is mid-activity in the room (not posed for player —
      reading / praying / scarification-tool-cleaning / etc.);
      the comm-screen overlays a reactive activity sprite at
      its anchor.
    LIGHTING/CAMERA: 1800K central pendant key + 2 corner candle-
      sconces; 6500K cyber-cyan rim from comm-screen frame fiber-
      optic; 12000K occult-violet practical at the archetype-
      signature object; 5400K diffuse fill via deck-window;
      ARRI Alexa anamorphic; Kodak Vision3 500T pushed +1.
    STYLE: APPRENTICE_AESTHETIC: steampunk-cyberpunk-occult; a
      private interior space that is domestic-warm but accented
      with brass + cyber-cyan + occult-violet per archetype;
      palette `#c9a14a / #5fa8ff / #0d0a08 / #ff2a8a / #5a1a1f
      / #dccfaa`; volumetric oil-smoke + cyber-mist haze
      z+1.5–2.0m (slightly thinner than ceremonial chambers).
    CONSTRAINTS: standard NB2 constraints; first-person POV from
      the player's eyes from the south door; only the player's
      gloved hands enter lower frame from below resting on the
      door-frame; no third-person body of the player; no mirrors
      or reflections of the player; the apprentice across the
      room is fully visible; consistent eye-height per host_space
      (medium 1.65m).
    Output 4K, 21:9.
pipeline:
  nb2_seed: 181001..181012   # one per archetype for canonical midday phase
  veo_seed: 281001..281012
  vo_manifest_ref: apps/scripts/apprentice-<archetype>-<gender>-lines.json
                   (berth-greet / berth-ambient cluster)
  cdn_target: cdn/client-public/cutscenes/cs_berth_<archetype>_midday/
notes_per_phase: |
  DAWN variant overrides:    backdrop tint shifts to 5800K warm-gold; brightness
                             0.85; apprentice activity is the dawn-task
                             (Zealot prays / Ghost watches bay-2 ladder /
                             Scholar reads / Revenant scarification ritual /
                             etc.); candles all extinguished, cyber-cyan rim
                             dominant.
  DUSK variant overrides:    backdrop tint 4500K amber-bronze; brightness 0.78;
                             apprentice activity is the dusk-task (cohort meal /
                             evening conversation / etc.); 1 candle lit; comm-
                             screen shows cohort-banter content.
  NIGHTWATCH overrides:      backdrop tint 3200K cold-blue; brightness 0.55;
                             apprentice activity is the nightwatch-task
                             (Zealot prayer-vigil / Ghost silent watch / Scholar
                             late-read / etc.); only 1 candle plus comm-screen
                             cyber-cyan rim; the room reads markedly more occult
                             at this phase.
```

---

### §AC.5.2 A.69 Recruit Bunkrooms — 5 named recruits

Per `npcPortraits.ts` registrations and `partyMemberBerth.ts`,
five Tier-2 recruits have berth surfaces:
**Vex Solène, Wraith Calder, Locke, Jericho Jones, Akai Shi.**

Each gets a single COMPACT FULL spec inheriting the §AC.5.1
shared shell, with recruit-specific overlay:

| § | recruit | signature object | comm anchor | activity (4 phases) |
|---|---|---|---|---|
| §AC.5.2.1 | **Vex Solène** | engineer's tool-bench with 24 brass-tool rack + workshop apron | wall_right | dawn: tool-cleaning / midday: project-build / dusk: blueprint-sketch / nightwatch: bench-asleep |
| §AC.5.2.2 | **Wraith Calder** | scratched-out photograph + locked chest containing past-trade ledgers + broken brass-pocket-watch | wall_left | dawn: pocket-watch examines / midday: ledger-cipher work / dusk: photograph touches / nightwatch: lantern-out |
| §AC.5.2.3 | **Locke** | adjudicator's brass-bound code-book + brass-rim spectacles + reading-bench | shelf_top | dawn: code-citing / midday: inquiry-letter writing / dusk: judgment-pondering / nightwatch: silent-pacing |
| §AC.5.2.4 | **Jericho Jones** | brass-pocket-watch (working) + half-empty whiskey bottle + framed certificate (illicit broker license) + pistol on hip | wall_right | dawn: pistol-cleaning / midday: trade-negotiations / dusk: whiskey-pour / nightwatch: window-staring |
| §AC.5.2.5 | **Akai Shi** | necromancer's altar + 12 specimen-jars + brass-bound spell-book + scarification-tool kit | wall_left | dawn: jar-arranging / midday: spell-citing / dusk: altar-tending / nightwatch: necromantic-reading |

Each recruit-berth carries the same shared 13-axis grid as
§AC.5.1 with recruit-specific governance modifiers (e.g.
`recruit_vex_recruited` → tool-bench animates; `recruit_jericho_betrayed`
→ Wraith pulls a pistol from a drawer in his cell-block).

#### Camera spawns

```
- cs_recruit_berth_<recruit>_first_knock     (5 variants)
- cs_recruit_berth_<recruit>_<phase>         (5 × 4 = 20 phase variants)
- cs_recruit_berth_<recruit>_<event>         (per recruit, 1–3 narrative
                                               events; e.g. Wraith E2-betrayal
                                               cs already exists in
                                               `_PRODUCTION_CROSS_CUT.md` —
                                               retro-upgrade with NB2/Veo
                                               in this doc)
```

#### NB2 prompt template (per recruit, FPV from south door, midday phase)

Same canonical template as §AC.5.1, with archetype-signature
object swapped for the recruit's signature object per the table
above. Trait-lock with the recruit's existing portrait reference
(per `npcPortraits.ts` registration).

```yaml
pipeline (recruits):
  nb2_seed: 181101..181125   # 5 recruits × 5 cuts each (first_knock + 4 phases)
  veo_seed: 281101..281125
  vo_manifest_ref: apps/shared/<recruit>VoManifest.json#L<TBD>
  cdn_target: cdn/client-public/cutscenes/cs_recruit_berth_<recruit>_<phase>/
```

---

### §AC.5.3 A.70 Elara's Bridge Berth — COMPACT FULL

```
space_id: ark.elara_bridge_berth
size: 6.00m × 5.00m × 3.20m  (a sub-zone of the Bridge proper, not a separate
  cabin — Elara lives at the Bridge captain's pedestal)
purpose: per-companion berth for Elara
zones: 1 captain's chair (centre, raised dais 0.4m); 1 console array (north-
  curve, 240° wraparound); 1 starfield viewport at south (full-height, 4m
  wide); 1 holographic-Elara figure-mount at right side of chair
fixtures:
  - captain's chair: mahogany-and-brass with cog-mechanism reclining
    armatures; cyber-cyan fiber-optic conduits running through the seat-
    base; chalk-circle inlay around chair's base
  - console array: 240° wraparound brass-rim console with 12 dial-arrays,
    8 holographic readouts, 4 fiber-optic neural-jack ports; Elara's
    holographic interface at frame-right
  - starfield viewport: 4m × 2.4m brass-rim porthole; real-time stars +
    occasional ship-passing
  - holographic Elara: subtle cyan-violet figure visible at frame-right
    of captain's chair; standing posture; faint translucent
  - wall-mounted Mechronis comm screen at shelf_top above starfield viewport
  - 1 brass-bound captain's-log on swivel-pulpit at south
floor: parquet with brass-rim and central chalk-circle inlay (matches
  Bridge canonical floor)
walls: stone-and-brass; cyber-cyan fiber-optic conduits running ceiling-to-
  floor at 4 positions; sigil-etched brass plates between
ceiling: 3.20m; central pendant + 4 corner candle-sconces; 1 fiber-optic
  ribbon at z+2.8m
lighting: 1800K candle key + 5400K diffuse fill from console-array
  holographics; 6500K cyber-cyan rim from console fiber-optic; 12000K
  occult-violet practicals at chair-base sigil-circle nodes
atmosphere: ozone + leather + machine-oil + faint perfume (Elara's signature);
  reverb 1.8 s; console hum bed -36 dB; star-field is silent
camera_spawns:
  - cs_elara_bridge_berth_first_knock
  - cs_elara_bridge_berth_<phase>           (4 variants — calibrating-at-
                                              dawn / running-diagnostics-at-
                                              midday / log-write-at-dusk /
                                              silent-watch-at-nightwatch)
  - cs_elara_bridge_berth_console_alarm     (parametric — fired on Bridge alarm)
doorways:
  - south: connects to A.07 Bridge corridor (existing — main Bridge access)
13-axis grid:
  6 economic: idle / active (Elara at console) / contested (Bridge alarm)
  7 governance: per Bridge canonical + `elara_present` → holographic figure
    materialises; `elara_calibrating_dawn` → console fiber-optic wave-pulse;
    `elara_log_writing_dusk` → captain's-log pulpit page-flip animation
  8 event / 9 TV / 10 epoch / 11 time-of-day / 12 faction: per Bridge canonical
    with phase-modulated holographic-Elara translucency
  13 storyteller + HUD: HUD overlap: console array doubles as the Bridge
    captain's UI. Mystery-arc: at Act-7 Elara's holographic figure walks off-
    bridge for the first time and returns transformed (out-of-scope cinematic).
art_resources:
  textures: elara_bridge_berth_chair.png, elara_bridge_berth_console.png,
    elara_bridge_berth_starfield_porthole.png, elara_bridge_berth_holo_overlay.png
  models: elara_bridge_berth_chair.glb (animated reclining), elara_bridge_berth_console.glb,
    elara_bridge_berth_holo_elara_figure.glb (animated breathing),
    elara_bridge_berth_captains_log.glb
  vfx: holographic-figure subtle breathing; console fiber-optic wave-pulse
    (per phase); starfield ship-passing parametric
performance: 0.6M tris; 144 MB; 14 lights
```

---

### §AC.5.4 A.71 The Human's Observation Deck — COMPACT FULL (with progressive reveal stages)

```
space_id: ark.human_observation_deck
size: 8.00m × 6.00m × 4.00m
purpose: per-companion berth for The Human; signal-static to signal-
  convergence reveal progression per `npcPortraits.ts` Human reveal-
  stages
zones: 1 single chair at south (FPV-anchor for player visit); 1 long
  table at centre (3m × 1m brass-rim mahogany); 1 observation
  porthole at north (3m × 1.6m); 1 wall-mount comm screen at wall_right
  (the Human's portrait progressively resolves here)
fixtures:
  - chair: brass-and-leather single seat at south door; chalk-circle
    inlay around the chair-base
  - long table: mahogany-and-brass; cyber-cyan fiber-optic underglow;
    centre of table holds a single radio-receiver (brass-bound; cog-
    mechanism dial; pulses with the Human's signal at active phases)
  - observation porthole: 3m × 1.6m brass-rim window facing the great
    void; star-field with occasional anomaly-rift visible
  - comm screen: wall_right; the Human's portrait resolves across 4
    reveal stages — signal-static (pure interference) → signal-ghost
    (silhouette bleeds through) → signal-fragment (face partially
    resolves) → signal-convergence (full portrait resolved); the
    transitions are gated by player's act-progress per `npcPortraits.ts`
floor: brass-rim parquet with central chalk-circle around long table;
  gold-blood-channel inlay running south to north (chair to porthole)
walls: stone-and-brass; cyber-cyan fiber-optic conduits running floor-
  to-ceiling at 4 positions; sigil-etched plates between
ceiling: 4.00m; central pendant + 2 corner candle-sconces; 1 fiber-
  optic ribbon at z+3.4m
lighting: 1800K candle key + 5400K starfield-porthole diffuse fill from
  north; 6500K cyber-cyan rim from comm-screen fiber-optic; 12000K
  occult-violet practical at the radio-receiver
atmosphere: ozone + leather + cold-stone + faint static-electricity;
  reverb 2.4 s; AM-radio static bed at -32 dB (modulated by reveal
  stage); chant-loop -42 dB
camera_spawns:
  - cs_human_observation_first_knock
  - cs_human_observation_signal_static       (reveal stage 1; 8s)
  - cs_human_observation_signal_ghost        (reveal stage 2; 8s; fires
                                                on stage-2 unlock)
  - cs_human_observation_signal_fragment     (reveal stage 3; 8s)
  - cs_human_observation_signal_convergence  (reveal stage 4; 12s stitched —
                                                full portrait resolution)
  - cs_human_observation_<phase>             (4 phase variants per current
                                                reveal stage)
doorways:
  - south: connects to A.07 Bridge corridor or A.18 Observation Lounge
    (existing; route per ship layout)
13-axis grid:
  6 economic: idle / active (Human's signal active; pulse visible) /
    contested (signal corruption — radio-receiver outputs corruption-pink)
  7 governance: `human_reveal_stage_<n>` (n=1..4) → comm-screen reveal
    state; `human_signal_active` → radio-receiver pulse
  8 event: off / qualifier / finals / champion (full convergence — Act-7+)
  9 TV: clean / exposed / spreading / corrupted / quarantined
  10 epoch: low / rising / high / grand-edit (Human's signal speaks
    in cipher — out-of-scope cinematic)
  11 time-of-day: dawn / midday / dusk / nightwatch (Human's signal
    strongest at nightwatch)
  12 faction: 8 states (per faction the porthole reveals different
    void anomalies — collectors faction reveals specimen-jar drift,
    hierarchy reveals gold-blood-channel cosmic, etc.)
  13 storyteller + HUD: HUD overlap: comm-screen + radio-receiver double
    as Human-status UI. Mystery-arc: at full convergence, the chair at
    south shifts position (it has rotated 180° to face the porthole,
    not the comm-screen — Human revealed not as a screen-being but
    as a void-being).
art_resources:
  textures: human_observation_floor.png, human_observation_porthole.png,
    human_observation_radio_receiver.png,
    human_observation_comm_screen_<stage>.png × 4
  models: human_observation_chair.glb (animated rotation at stage 4),
    human_observation_long_table.glb,
    human_observation_radio_receiver.glb (animated pulse),
    human_observation_porthole.glb,
    human_portrait_<stage>.glb × 4 (progressive resolution)
  vfx: AM-radio static bed (modulated per stage); porthole parallax with
    void-anomaly drift; chair-rotation animation (stage 4 only)
performance: 0.6M tris; 144 MB; 12 lights
```

---

### §AC.5.5 A.72 Bunkroom Comm Screen — diegetic UI surface specification

The comm screen is not a room but a **per-berth diegetic UI
fixture** that resolves content per `berthCommScreen.ts`. Each
of the 18 berth-surfaces (12 apprentices + 5 recruits + Elara +
Human) carries one comm screen; each comm screen is a
production-side sprite + overlay set.

#### Comm-screen anchor positions (per archetype / recruit)

```
wall_left:   Ghost, Wraith Calder, Akai Shi, Locke
wall_right:  Zealot, Revenant, Heretic, Sentinel, Vex Solène, Jericho Jones, Human
shelf_top:   Scholar, Artisan, Oracle, Wanderer, Martyr, Jester, Prodigal, Locke, Elara
```

(Some characters allow multiple anchors; runtime picks per
`berthCommScreen.resolve()`.)

#### Comm-screen content states (per resolver)

```
- idle:                  apprentice's archetype-glyph + clock + cohort-roster
                         minimum overlay
- call_in:               Elara's portrait corner-overlay (incoming call)
- call_out:              Human's portrait corner-overlay (outgoing call)
- audit_in_progress:     "AUDIT IN PROGRESS" watermark (16 chars) + cipher-script
                         text feed (live transcript scroll)
- narrative_silence:     blank screen with cyber-cyan static bed
- warden_line_tap:       "WARDEN LINE TAP DETECTED" watermark (24 chars) +
                         red corruption-pink corner indicator
- mourning_call:         fallen-apprentice's portrait + dirge text scroll
- cohort_banter:         secondary apprentice's portrait corner + banter-text
                         scroll
- commons_phone_mode:    bar / long-table / alcove sub-zone live-feed (audio +
                         video); one of three view-pickers
```

#### Camera spawns (per state, parametric)

```
cs_berth_comm_screen_<state>     (9 state variants — generic across all 18
                                   berths; per-berth NB2 reference is the
                                   parent berth's master still)
```

#### Art resources

```
- 18 comm-screen frame textures (anchor-position variants × per-character)
- 9 state-overlay sprites (idle / call_in / call_out / audit_in_progress /
  narrative_silence / warden_line_tap / mourning_call / cohort_banter /
  commons_phone_mode)
- 18 archetype-glyph + recruit-glyph overlays
- vfx: corner-overlay portrait animation (Elara breathing / Human at current
  reveal stage); cyber-cyan static bed (modulated); cipher-script text scroll
  (parametric content)
```

#### NB2 prompt — comm screen close-up

```yaml
nb2:
  model: gemini-3-pro-image-preview
  aspect_ratio: "21:9"
  resolution: "4K"
  reference_images:
    - cdn/client-public/art/refs/apprentice_<archetype>_portrait.png
  prompt: |
    SUBJECT: a wall-mounted Mechronis comm screen on the apprentice
      berth wall — 0.6m × 0.4m brass-bound display in cog-
      mechanism brass armature with cyber-cyan fiber-optic frame;
      screen surface is curved CRT glass with subtle scan-lines;
      currently showing <state> content (per overlay table); a
      smaller corner-overlay portrait at upper-right (when call-
      state); cipher-script text feed scrolling at bottom (when
      audit / cohort-banter state).
    COMPOSITION: medium close-up FPV; 50mm; eye-level +1.65m;
      shallow DOF on the screen surface; berth-wall in soft
      foreground bokeh.
    LIGHTING/CAMERA: 6500K cyber-cyan rim from fiber-optic
      frame; 1800K candle backlight from berth-room ambient;
      12000K occult-violet at brass-armature sigil-etched
      plate; ARRI Alexa anamorphic.
    STYLE: APPRENTICE_AESTHETIC; the comm screen as a brass-and-
      cyber UI surface — never a flat-shaded modern UI; palette
      `#c9a14a / #5fa8ff / #0d0a08 / #ff2a8a / #5a1a1f / #dccfaa`.
    CONSTRAINTS: standard NB2 constraints; first-person POV
      from the player's eyes; only the player's gloved hands
      enter lower frame from below; no third-person body of
      the player; the cipher-script text on screen is ≤25
      characters per text-element (NB2 text-rendering-safe);
      consistent eye-height per host_space (medium 1.65m).
    Output 4K, 21:9.
pipeline:
  nb2_seed: 181201..181209   # one per state
  veo_seed: 281201..281209
  cdn_target: cdn/client-public/cutscenes/cs_berth_comm_screen_<state>/
```

---

## §AC.6 12 Guild Common Rooms

`apps/client/src/pages/GuildCommonRoomPage.tsx` (456 lines)
implements 12 guild houses, each with its own aesthetic,
Archon Professor simulacrum, signature ability unlock progress,
and Notable Alumni roster. The page ships room-art paths +
particle effects + scanlines + ambient light pulse (guild-house
specific colour).

This section authors each guild common room at full §4 +
13-axis depth.

### §AC.6.0 Shared spec

#### Header pattern

```
space_id_pattern:    ark.guild_common_room.<house_id>
space_type:          ark_room
act_introduced:      Act 2 (guild system unlock)
lore_anchor:         loredex.system.guild + arc.guild_house_<house_id>
aesthetic_tier:      hybrid_guild_apprentice  (per-guild palette layered
                     on APPRENTICE_AESTHETIC steampunk-cyberpunk-occult
                     baseline)
```

#### Geometry pattern

```
dimensions:    16.00m × 12.00m × 5.00m (canonical; per-guild geometry overlays
               can shift by ±20%)
floor_plan:    rectangular with 4 m × 4 m alcove offset for the Archon
               Professor portrait-mount; 1 large central table (4 m × 2 m;
               guild-themed) + 12 chairs; 1 bookshelf or ledger-wall on
               west; 1 trophy / signature-ability-progress display on east;
               1 entry-arch on south
```

#### Shared 13-state axis grid

| axis | state |
|---|---|
| 1–4 | per-guild overlay |
| 5 connection | south↔guild-corridor↔A.50 Apprentice Hall (or commons sub-zone routing) |
| 6 economic | idle (no member present) / active (guild meeting) / contested (guild faction-shift live event) |
| 7 governance | `guild_member_present_<player>` → entry-arch warms cyan; `guild_signature_ability_progress_<n>` → trophy display animates; `guild_archon_dialogue_unlocked` → portrait subtle breathing + interactable |
| 8 event | off / qualifier / finals (guild tournament) / champion (player anointed; full house particle-effect cascade) |
| 9 TV | clean / exposed (guild-banner mycelium) / spreading / corrupted (Archon portrait phases between simulacrum and real Archon) / quarantined |
| 10 epoch | low / rising / high / grand-edit (Notable Alumni roster rewrites with indigo) |
| 11 time-of-day | dawn / midday / dusk / nightwatch (per-guild palette modulates intensity per phase) |
| 12 faction | the guild's own faction is canonical; cross-faction states show as banners overlay |
| 13 storyteller + HUD | HUD overlap: Archon portrait + signature-ability display + Notable Alumni roster all double as guild UI. Mystery-arc per-guild: divergence between simulacrum Archon and real Archon (per `apps/shared/guildHouses` runtime) — at Act-7, the simulacrum's "hidden agenda" is revealed; one alumnus disappears from the roster. |

### §AC.6.1–§AC.6.12 Per-guild overlays

Each guild gets a 4-row spec: **palette / archon professor /
signature ability / notable alumni / particle accent / room-art
trait-lock**.

| § | guild_id | palette | Archon Professor | signature ability | particle accent |
|---|---|---|---|---|---|
| §AC.6.1 | `house_of_iron` | iron-grey + brass `#3a3540 / #c9a14a / #5fa8ff` | Professor Steele | Iron Hand | brass-cog particle drift |
| §AC.6.2 | `house_of_glass` | crystal-white + cyber-cyan `#dce5ec / #5fa8ff / #ff2a8a` | Professor Lenz | Glass Eye | crystal-shimmer dust |
| §AC.6.3 | `house_of_smoke` | smoke-grey + ember-orange `#3a3025 / #ff5a1a / #c9a14a` | Professor Veil | Smoke Walk | smoke-curl drift |
| §AC.6.4 | `house_of_ledger` | parchment-cream + brass `#dccfaa / #c9a14a / #5a1a1f` | Professor Quill | Ledger Bind | paper-flutter motes |
| §AC.6.5 | `house_of_circuit` | cyber-cyan + brass `#5fa8ff / #c9a14a / #ff2a8a` | Professor Wirework | Circuit Sing | electric-spark micro |
| §AC.6.6 | `house_of_thurible` | occult-violet + brass `#4a1a6a / #c9a14a / #5a1a1f` | Professor Smoke (no relation to Veil) | Thurible Cast | incense-smoke drift |
| §AC.6.7 | `house_of_anvil` | forge-orange + iron `#ff5a1a / #3a2520 / #c9a14a` | Professor Hammer | Anvil Strike | ember-spark cascade |
| §AC.6.8 | `house_of_mirror` | reflective-silver + occult-violet `#c4d4e4 / #4a1a6a / #ff2a8a` | Professor Glass-Mask | Mirror Witness | mirror-fragment drift |
| §AC.6.9 | `house_of_garden` | green + brass + cyber-cyan `#6cc24a / #c9a14a / #5fa8ff` | Professor Vine | Garden Bind | leaf-and-light drift |
| §AC.6.10 | `house_of_chapel` | candle-amber + occult-violet `#ffb84a / #4a1a6a / #c9a14a` | Professor Bell | Chapel Toll | candle-flame motes |
| §AC.6.11 | `house_of_tower` | command-cool + cyber-cyan `#1a3550 / #5fa8ff / #c9a14a` | Professor Watch | Tower Sight | surveillance-line micro |
| §AC.6.12 | `house_of_remnant` | bone-white + blood-red `#dcdcd0 / #5a1a1f / #c9a14a` | Professor Sigh | Remnant Carry | dust-and-ash drift |

#### Per-guild compact §4 spec template

```yaml
space_id: ark.guild_common_room.<house_id>
size: 16.00m × 12.00m × 5.00m
purpose: guild house common room; member meeting space + Archon Professor
  simulacrum residence + signature-ability progress tracker + Notable
  Alumni roster
zones: 1 entry-arch (south); 1 central table + 12 chairs; 1 west bookshelf
  / ledger-wall; 1 east trophy / signature-ability display; 1 NE alcove
  for Archon Professor portrait + lectern + brass-bound book; 1 ceiling
  pendant cluster
fixtures:
  - central table (4m × 2m; guild-themed: iron / crystal / smoke / parchment /
    circuit / thurible / anvil / mirror / garden / chapel / tower / bone-relic);
    chalk-circle inlay around table-foot
  - 12 chairs (guild-themed)
  - west bookshelf with guild's history-volumes (readable; ~120 volumes
    per guild)
  - east trophy/signature-ability display (brass-bound case showing player's
    progress toward signature ability; animates on milestone)
  - NE alcove: Archon Professor portrait (animated breathing); brass-and-
    leather lectern; brass-bound book of guild's "philosophy + classroom
    rule + grading style + hidden agenda + divergence from real Archon"
  - 4–8 guild-themed wall-banners (parametric to current member-count)
  - 1 brass guild-bell at south entry (rung once on member arrival)
floor: per-guild palette (iron deck for House of Iron / parquet for House
  of Ledger / etc.) with brass-rim and chalk-circle inlay around table
walls: stone-and-brass with per-guild palette overlay; cyber-cyan fiber-
  optic conduits running ceiling-to-floor at 4 positions; sigil-etched
  plates between
ceiling: 5.00m; per-guild pendant-cluster + 4 candle-sconces; 1 fiber-
  optic ribbon at z+4.4m running the guild's signature colour
lighting: 1800K candle key + per-guild accent practical (iron: cool-blue
  rim; glass: crystal-shimmer; smoke: ember; etc.); 6500K cyber-cyan rim
  from fiber-optic; 12000K occult-violet at the Archon portrait alcove
atmosphere: per-guild specific (House of Smoke is incense-heavy;
  House of Ledger is paper-dust dominant; House of Anvil is iron-warm;
  etc.); reverb 3.2 s
camera_spawns:
  - cs_guild_<house_id>_first_arrival
  - cs_guild_<house_id>_archon_dialogue
  - cs_guild_<house_id>_signature_ability_progress
  - cs_guild_<house_id>_notable_alumnus_inscribed
art_resources:
  textures: guild_<house_id>_floor.png, guild_<house_id>_wall.png,
    guild_<house_id>_table.png, guild_<house_id>_archon_portrait.png,
    guild_<house_id>_trophy_display.png
  models: guild_<house_id>_table.glb, guild_<house_id>_archon_portrait.glb
    (animated breathing), guild_<house_id>_trophy_display.glb,
    guild_<house_id>_lectern.glb, guild_<house_id>_guild_bell.glb,
    guild_<house_id>_chair.glb (×12)
  vfx: per-guild particle accent (table); per-guild light-pulse cycle
    (4-second period); scanline overlay on Archon portrait
performance: 1.4M tris; 320 MB; 24 lights
```

---

## §AC.7 PR #580 cutscene roster (compact form, ~150 cuts)

All cuts inherit `_PRODUCTION_CUTSCENE_PROMPTS.md` §G.0
framework + §AC.0.1 APPRENTICE_AESTHETIC. NB2 + Veo prompts
follow the Nano Banana 2 5-block schema and Veo 3.1 5-part
schema.

### §AC.7.1 Doctrine binding cutscenes (5 + 1 first-arrival = 6)

```yaml
cs_doctrine_binding_first_arrival:
  host_space: §AC.4.1 Doctrine Binding Chamber
  notes: "Cat A; 8s; player's first time entering the chamber; all 5 pulpits
    dim; central chalk-circle dim; mentor's chair empty."
  veo.audio.dialogue: "Master of R'lyeh: \"Choose, then say it.\""
  pipeline:
    nb2_seed: 180001; veo_seed: 280001;
    vo_manifest_ref: apps/shared/masterOfRlyehVoManifest.json#L<TBD>;
    cdn_target: cdn/client-public/cutscenes/cs_doctrine_binding_first_arrival/

cs_doctrine_binding_recitation_<doctrine_id>:   # 5 variants
  host_space: §AC.4.1
  notes: "Cat A; 8s; apprentice (per archetype) ascends to chosen doctrine's
    pulpit, recites the 4-stanza binding text; corresponding pulpit ignites,
    fiber-optic intensifies, doctrine-slip drawer south wall mints the slip."
  veo.audio.dialogue: "Apprentice recites stanza 1 (lip-sync; ≤8 words from
    `apprentice-pedagogy-doctrines-lines.json`)."
  veo.audio.sfx: "pulpit-ignite chord 00:03; doctrine-slip-mint brass-spark
    00:07."
  pipeline:
    nb2_seed: 180002..180006; veo_seed: 280002..280006;
    vo_manifest_ref: apps/scripts/apprentice-pedagogy-doctrines-lines.json
                     (4-stanza cluster per doctrine);
    cdn_target: cdn/client-public/cutscenes/cs_doctrine_binding_recitation_<doctrine_id>/
```

### §AC.7.2 Mechronis audit cutscenes (36 = 12 archetypes × 3 days, with Day-21 Warden variant)

```yaml
cs_audit_day7_<archetype>:    # 12 variants
  host_space: §AC.4.2 Audit Chamber (Day-7 Intake)
  notes: "Cat A; 8s; FPV-of-apprentice in chair; faceless Mechronis Auditor
    asks Day-7 question; archetype-specific answer per
    apprentice-pedagogy-audits-lines.json; cog-mechanism interview-recorder
    clicks at 1Hz throughout; player observes from booth."
  pipeline:
    nb2_seed: 180101..180112; veo_seed: 280101..280112;
    vo_manifest_ref: apps/scripts/apprentice-pedagogy-audits-lines.json
                     (Day-7 cluster per archetype);
    cdn_target: cdn/client-public/cutscenes/cs_audit_day7_<archetype>/

cs_audit_day14_<archetype>:   # 12 variants
  host_space: §AC.4.2
  notes: "Cat A; 8s; same staging; Day-14 Midpoint question; if doctrine =
    heretical_quiet, the Warden Day-14 dock cut may pre-empt this — the
    audit still fires AFTER the dock event, but with shifted dialog."
  pipeline:
    nb2_seed: 180201..180212; veo_seed: 280201..280212;
    cdn_target: cdn/client-public/cutscenes/cs_audit_day14_<archetype>/

cs_audit_day21_<archetype>:   # 12 variants — Day-21 Warden variant
  host_space: §AC.4.2 (Day-21 sub-state)
  notes: "Cat A; 12s stitched 8+4; Inspector Veil-7 attends in person;
    Auditor's nameplate reads 'INSPECTOR VEIL-7'; cog-recorder is silent;
    chamber lighting drops 20%; Warden's grey greatcoat hangs on coat-hook
    (visible through one-way mirror); audit-conclusion classification (pass /
    flagged / purge-recommended) is delivered in writing on transcript."
  veo.audio.dialogue: "Inspector Veil-7: \"<archetype-specific Day-21 line>\""
  veo.audio.sfx: "absolute-silence first 4s; pen-scratch 00:04; transcript-
    page-flip 00:09; Warden-coat fabric shift 00:11."
  pipeline:
    nb2_seed: 180301..180312; veo_seed: 280301..280312;
    vo_manifest_ref: apps/scripts/apprentice-pedagogy-warden-lines.json
                     (Day-21 cluster per archetype);
    cdn_target: cdn/client-public/cutscenes/cs_audit_day21_<archetype>/
    notes: "12s stitched per Veo First-and-Last-Frame contract."

cs_audit_warden_arrives:
  host_space: §AC.4.2 (Day-21)
  notes: "Cat A; 6s; Warden crosses from observation booth into interrogation
    room before audit begins; player FPV from booth chair as the Warden
    passes through the booth door."
  veo.audio.dialogue: "Warden (over speaker): \"Booth, please.\""
  pipeline:
    nb2_seed: 180313; veo_seed: 280313;
    cdn_target: cdn/client-public/cutscenes/cs_audit_warden_arrives/

cs_audit_transcript_delivered:
  host_space: §AC.4.2 booth side
  notes: "Cat A; 6s; transcript-reader pulpit south wall animates the brass-
    bound transcript appearing for player to read post-audit; per-archetype-
    per-day variant; 36 variants but compact form references one canonical
    cut + parametric content."
  pipeline:
    nb2_seed: 180314; veo_seed: 280314;
    cdn_target: cdn/client-public/cutscenes/cs_audit_transcript_delivered/
```

### §AC.7.3 Forge cutscenes (12 + 2 = 14)

```yaml
cs_forge_first_arrival:
  host_space: §AC.4.3 The Forge
  notes: "Cat A; 8s; player's first entry to the Forge at Day-28; all 6
    effect-slots dim; anvil empty; forge-flue ember-glow steady; past-cohort
    cards visible in west wall display."
  veo.audio.dialogue: "Master of R'lyeh: \"It is time.\""
  pipeline:
    nb2_seed: 180401; veo_seed: 280401;
    cdn_target: cdn/client-public/cutscenes/cs_forge_first_arrival/

cs_forge_signature_<archetype>:    # 12 variants
  host_space: §AC.4.3
  notes: "Cat A; 12s stitched 8+4; the signature-card forge moment per
    archetype; corresponding effect-slot pillar ignites (per archetype's
    chosen effect from `apprenticeSignatureCard.ts`); 2-handed forge —
    player + apprentice each place a gloved hand on anvil-rim; anvil-hammer
    strikes at 00:08; card emerges warm at 00:10; warmth-ripple visible on
    card surface; apprentice receives card at 00:12."
  veo.audio.dialogue: "Apprentice: \"<archetype-specific forge-line per
    `apprentice-<archetype>-<gender>-lines.json` forge cluster>\""
  veo.audio.sfx: "forge-bellow rhythm 4s cycle; effect-slot pillar ignite-
    chord 00:04; card-form brass-spark cascade 00:06–00:08; anvil-hammer
    strike at 00:08; card-emerges warm-resonance 00:10."
  pipeline:
    nb2_seed: 180402..180413; veo_seed: 280402..280413;
    vo_manifest_ref: apps/scripts/apprentice-<archetype>-<gender>-lines.json
                     (forge cluster);
    cdn_target: cdn/client-public/cutscenes/cs_forge_signature_<archetype>/

cs_forge_card_handed_off:
  host_space: §AC.4.3
  notes: "Cat A; 6s; apprentice receives the warm card; brings it to chest;
    walks toward north door (Trial Hall procession)."
  pipeline:
    nb2_seed: 180414; veo_seed: 280414;
    cdn_target: cdn/client-public/cutscenes/cs_forge_card_handed_off/

cs_forge_past_cohort_display_view:
  host_space: §AC.4.3 west wall display
  notes: "Cat A; 6s; player examines past-cohort signature cards in west
    wall display library; one card glows faintly (player's previous run's
    favorite apprentice — parametric per save history)."
  pipeline:
    nb2_seed: 180415; veo_seed: 280415;
    cdn_target: cdn/client-public/cutscenes/cs_forge_past_cohort_display_view/
```

### §AC.7.4 Memory Card cutscenes (24 = 12 mints + 12 inheritances)

```yaml
cs_memory_card_minted_<archetype>:    # 12 variants
  host_space: §AC.4.4 Memory Card Library
  notes: "Cat A; 8s; the moment after permadeath; card materialises on its
    pedestal; portrait-frame fills with apprentice's portrait; pedestal-
    cyan-rim ignites; candle on south candle-bench ignites."
  veo.audio.dialogue: "Master of R'lyeh: \"What they knew remains.\""
  pipeline:
    nb2_seed: 180501..180512; veo_seed: 280501..280512;
    cdn_target: cdn/client-public/cutscenes/cs_memory_card_minted_<archetype>/

cs_memory_card_inheritance_<archetype>:   # 12 variants
  host_space: §AC.4.4 consumption-pulpit
  notes: "Cat A; 12s stitched 8+4; new apprentice inserts the Memory Card
    into the consumption-pulpit slot; card burns at edge with brass-spark
    cascade; voice-over of the dead apprentice surfaces (one of 12 inherited
    lines per `apprenticeMemoryInheritance.ts`); candle on west candle-bench
    snuffs."
  veo.audio.dialogue: "Dead apprentice (parametric per archetype): \"<inherited
    line from apprenticeMemoryInheritance.ts>\""
  veo.audio.sfx: "card-slot insert click 00:03; card-edge burn ignite 00:05;
    voice-over surface low-chord 00:06; candle-snuff 00:11."
  pipeline:
    nb2_seed: 180601..180612; veo_seed: 280601..280612;
    vo_manifest_ref: apps/shared/apprenticeMemoryInheritance.ts inherited-
                     line table per archetype (parametric per fallen
                     apprentice's identity);
    cdn_target: cdn/client-public/cutscenes/cs_memory_card_inheritance_<archetype>/
```

### §AC.7.5 Cohort + park cutscenes (10)

```yaml
cs_park_barracks_first_arrival:
  host_space: §AC.4.5 Celebration Park Training Barracks
  notes: "Cat A; 8s; player first visits the Park barracks; both apprentice
    bunk-alcoves dim; Park-bell silent; observation-post empty; Celebration
    daylight 4500K full intensity."
  pipeline:
    nb2_seed: 180701; veo_seed: 280701;
    cdn_target: cdn/client-public/cutscenes/cs_park_barracks_first_arrival/

cs_park_training_pair_assigned:
  host_space: §AC.4.5
  notes: "Cat A; 6s; both bunk-alcoves' sconces ignite; park-bell rings
    (assignment toll); training_a + training_b apprentices appear at their
    bunks (per archetype)."
  veo.audio.dialogue: "Park-bell rings (no VO)."
  pipeline:
    nb2_seed: 180702; veo_seed: 280702;
    cdn_target: cdn/client-public/cutscenes/cs_park_training_pair_assigned/

cs_park_stage3_observation:
  host_space: §AC.4.5 stage-3 dais
  notes: "Cat A; 12s stitched 8+4; active companion ascends observation-
    post to witness training pair's stage-3 doctrine choice; observation-
    post fiber-optic intensifies; stage-3 choice resolution plays in
    mid-distance (training_a or training_b commits to doctrine)."
  pipeline:
    nb2_seed: 180703; veo_seed: 280703;
    cdn_target: cdn/client-public/cutscenes/cs_park_stage3_observation/

cs_park_park_bell_training_day_boundary:
  host_space: §AC.4.5
  notes: "Cat A; 6s; Park-bell rings at training-day boundaries (Day 7 / 14 /
    21 / 28; 4 boundaries per cycle but parametric); brief cohort
    acknowledgement at bunk-alcoves."
  pipeline:
    nb2_seed: 180704; veo_seed: 280704;
    cdn_target: cdn/client-public/cutscenes/cs_park_park_bell_training_day_boundary/

cs_park_cohort_resonance_<archetype_pair>:    # 6 representative pair templates
  host_space: §AC.4.5 (or §AC.4.6 triangle alcove if private)
  notes: "Cat A; 8s; cohort banter when training_a + training_b doctrines
    resonate; 6 representative pair-templates cover the most common
    resonance combos (e.g. zealot+martyr / scholar+heretic / oracle+ghost /
    artisan+sentinel / wanderer+prodigal / jester+revenant); banter VO
    sourced from existing apprenticeBanter.ts."
  pipeline:
    nb2_seed: 180705..180710; veo_seed: 280705..280710;
    cdn_target: cdn/client-public/cutscenes/cs_park_cohort_resonance_<archetype_pair>/

cs_triangle_event_<archetype_pair>:    # 6 representative templates
  host_space: §AC.4.6 Triangle Event Alcove
  notes: "Cat A; 12s stitched 8+4; intra-pair tension dialog scene; active
    companion observes; player chooses intervene / witness / walk-away;
    chalkboard wall east of alcove updates with mentor-NPC notes."
  pipeline:
    nb2_seed: 180711..180716; veo_seed: 280711..280716;
    cdn_target: cdn/client-public/cutscenes/cs_triangle_event_<archetype_pair>/
```

### §AC.7.6 Warden's Dock cutscene (6)

```yaml
cs_warden_dock_first_light:
  host_space: §AC.4.7 Warden's Dock
  notes: "Cat A; 12s stitched 8+4; **fires only on heretical_quiet doctrine
    + day=14**; FPV-of-apprentice (one of the rare non-player-FPV cuts);
    Warden seated north of dockside table at first light; two coffee mugs
    (one steaming hot at apprentice's side, one cold at Warden's); pre-dawn
    sky transitions to first-amber across 8s clip; cargo-container stacks
    in mid-distance background; Warden's grey-wool greatcoat visible.

    Audio: dawn-wind soft 4 m/s; coffee-steam subtle hiss (apprentice's
    mug); Warden's voice low + procedural; chant-loop -42 dB."
  veo.audio.dialogue: "Warden: \"Two coffees. Yours got cold.\" (lip-sync;
    one of 12 archetype-specific Day-14 lines per `apprentice-pedagogy-warden-
    lines.json`)"
  pipeline:
    nb2_seed: 180801; veo_seed: 280801;
    vo_manifest_ref: apps/scripts/apprentice-pedagogy-warden-lines.json (Day-14 cluster);
    cdn_target: cdn/client-public/cutscenes/cs_warden_dock_first_light/

cs_warden_dock_pitch_compliant_mouth:
  host_space: §AC.4.7
  notes: "Cat A; 6s; Warden offers heretical_quiet apprentice a 'way out' —
    recite Compliant Mouth doctrine instead; choice wheel surfaces."
  pipeline:
    nb2_seed: 180802; veo_seed: 280802;
    cdn_target: cdn/client-public/cutscenes/cs_warden_dock_pitch_compliant_mouth/

cs_warden_dock_apprentice_decline:
  host_space: §AC.4.7
  notes: "Cat A; 8s; apprentice declines; Warden's interest deepens; Warden's
    coffee stays cold; sky has reached first-amber; Warden walks away into
    cargo-container stacks at 00:06; final 2s holds on apprentice's empty
    table position."
  veo.audio.dialogue: "Warden: \"I will be watching.\" (lip-sync)"
  pipeline:
    nb2_seed: 180803; veo_seed: 280803;
    cdn_target: cdn/client-public/cutscenes/cs_warden_dock_apprentice_decline/

cs_warden_dock_apprentice_accept:
  host_space: §AC.4.7
  notes: "Cat A; 8s; apprentice accepts Warden's recruitment; doctrine
    rebinds to Compliant Mouth (runtime side-effect); Warden slides a brass
    coin across the table; apprentice picks it up; Warden walks away. The
    apprentice is now a Warden's candidate (per `apprenticeWarden.ts` 4
    candidates list)."
  veo.audio.dialogue: "Warden: \"Recite the right one.\" (lip-sync)"
  pipeline:
    nb2_seed: 180804; veo_seed: 280804;
    cdn_target: cdn/client-public/cutscenes/cs_warden_dock_apprentice_accept/

cs_warden_dock_warden_walks_away:
  host_space: §AC.4.7
  notes: "Cat A; 4s; closing shot; Warden disappears between cargo-container
    stacks; apprentice's POV remains; sky finishes transition to full
    morning."
  pipeline:
    nb2_seed: 180805; veo_seed: 280805;
    cdn_target: cdn/client-public/cutscenes/cs_warden_dock_warden_walks_away/

cs_warden_dock_cold_coffee_act7_reveal:
  host_space: §AC.4.7
  notes: "Cat A; 6s; Act-7 reveal cut; player encounters the dockside table
    again; the cold coffee mug is still there; at its base, a small printed
    photograph — of the player's own Day-1 face."
  pipeline:
    nb2_seed: 180806; veo_seed: 280806;
    cdn_target: cdn/client-public/cutscenes/cs_warden_dock_cold_coffee_act7_reveal/
    notes: "Act-7 only; out-of-cycle for normal play; storyteller-hook reveal."
```

### §AC.7.7 Mission cutscenes (51 = 17 missions × 3 outcome variants)

```yaml
cs_mission_briefing_<mission_id>:    # 17 variants
  host_space: §AC.4.8 Mission Briefing War Room (holodisplay-table)
  notes: "Cat A; 8s; mission's dossier-folio opens on holodisplay-table;
    cyber-cyan deployment-grid resolves the deployment plan; chalk-circle
    around table-base ignites; quartermaster-NPC reads a 1-line briefing;
    role-station alcove for the mission's role lights up."
  veo.audio.dialogue: "Quartermaster: \"<mission-name>: <one-line objective>\""
  pipeline:
    nb2_seed: 180901..180917; veo_seed: 280901..280917;
    vo_manifest_ref: apps/scripts/apprentice-pedagogy-missions-lines.json
                     (briefing cluster per mission_id);
    cdn_target: cdn/client-public/cutscenes/cs_mission_briefing_<mission_id>/

cs_mission_return_<mission_id>_success:    # 17 variants
  host_space: per role's return-zone (§AC.4.9)
  notes: "Cat A; 8s; success outcome; apprentice arrives back at role's
    return-zone; role-specific arrival animation; mission report delivered."
  pipeline:
    nb2_seed: 180918..180934; veo_seed: 280918..280934;
    cdn_target: cdn/client-public/cutscenes/cs_mission_return_<mission_id>_success/

cs_mission_return_<mission_id>_partial:    # 17 variants
  host_space: per role's return-zone
  notes: "Cat A; 8s; partial outcome; apprentice returns wounded or with
    incomplete objectives; role-specific debrief."
  pipeline:
    nb2_seed: 180935..180951; veo_seed: 280935..280951;
    cdn_target: cdn/client-public/cutscenes/cs_mission_return_<mission_id>_partial/

cs_mission_return_<mission_id>_failure:    # 17 variants — outcome 'failed'
  host_space: per role's return-zone (or §AC.1.6 Mourning Wall if 'sacrificed' role)
  notes: "Cat A; 8s; failure outcome; for sacrificed-role missions this
    becomes a permadeath obituary cut routed to Mourning Wall."
  pipeline:
    nb2_seed: 180952..180968; veo_seed: 280952..280968;
    cdn_target: cdn/client-public/cutscenes/cs_mission_return_<mission_id>_failure/
```

### §AC.7.8 Berth cutscenes (per archetype, per recruit, plus Elara + Human; ~80)

```yaml
cs_berth_<archetype>_first_knock:    # 12 variants
  host_space: §AC.5.1 (per archetype)
  notes: "Cat A; 8s; player's first visit to apprentice's berth; comm-
    screen at idle state; archetype-signature object visible; apprentice
    is mid-activity (NOT posed for player)."
  pipeline:
    nb2_seed: 181001..181012 (already declared in §AC.5.1);
    veo_seed: 281001..281012;
    vo_manifest_ref: apps/scripts/apprentice-<archetype>-<gender>-lines.json
                     (berth-greet cluster);
    cdn_target: cdn/client-public/cutscenes/cs_berth_<archetype>_first_knock/

cs_berth_<archetype>_<phase>:    # 12 archetypes × 4 phases = 48 variants
  host_space: §AC.5.1
  notes: "Cat A; 8s; ambient visit per time-of-day phase; per-archetype
    activity overlay. Phase variants follow §AC.5.1 nb2_overrides per phase."
  pipeline:
    nb2_seed: 181013..181060;
    veo_seed: 281013..281060;
    cdn_target: cdn/client-public/cutscenes/cs_berth_<archetype>_<phase>/

cs_berth_<archetype>_doctrine_slip_arrived:    # 12 variants
  host_space: §AC.5.1 (post doctrine binding)
  notes: "Cat A; 6s; the moment after doctrine binding; doctrine-slip
    materialises pinned to wall above bunk; brass-spark micro-particle
    cascade."
  pipeline:
    nb2_seed: 181061..181072;
    veo_seed: 281061..281072;
    cdn_target: cdn/client-public/cutscenes/cs_berth_<archetype>_doctrine_slip_arrived/

cs_berth_<archetype>_audit_transcript_pinned:    # 12 archetypes × 3 days = 36 variants
  host_space: §AC.5.1 (post Day-7 / 14 / 21 audit)
  notes: "Cat A; 6s; brass-bound transcript appears pinned to wall above
    table; cyber-cyan ink visible from frame edges."
  pipeline:
    nb2_seed: 181073..181108;
    veo_seed: 281073..281108;
    cdn_target: cdn/client-public/cutscenes/cs_berth_<archetype>_audit_transcript_pinned/

cs_berth_<archetype>_signature_card_displayed:    # 12 variants
  host_space: §AC.5.1 (post Day-28 forge)
  notes: "Cat A; 6s; the warm signature card on the table; brass-spark
    cooling animation; per-archetype card-glyph visible."
  pipeline:
    nb2_seed: 181109..181120;
    veo_seed: 281109..281120;
    cdn_target: cdn/client-public/cutscenes/cs_berth_<archetype>_signature_card_displayed/

cs_recruit_berth_<recruit>_first_knock:    # 5 variants
  host_space: §AC.5.2
  notes: "Cat A; 8s; per recruit first-visit. Per-recruit signature object
    visible; recruit mid-activity per recruit-table."
  pipeline:
    nb2_seed: 181125..181129;
    veo_seed: 281125..281129;
    vo_manifest_ref: apps/shared/<recruit>VoManifest.json;
    cdn_target: cdn/client-public/cutscenes/cs_recruit_berth_<recruit>_first_knock/

cs_recruit_berth_<recruit>_<phase>:    # 5 recruits × 4 phases = 20 variants
  host_space: §AC.5.2
  notes: "Cat A; 8s; per phase per recruit."
  pipeline:
    nb2_seed: 181130..181149;
    veo_seed: 281130..281149;
    cdn_target: cdn/client-public/cutscenes/cs_recruit_berth_<recruit>_<phase>/

cs_elara_bridge_berth_first_knock:
  host_space: §AC.5.3
  pipeline:
    nb2_seed: 181150; veo_seed: 281150;
    vo_manifest_ref: apps/shared/elaraVoManifest.json#L<TBD>;
    cdn_target: cdn/client-public/cutscenes/cs_elara_bridge_berth_first_knock/

cs_elara_bridge_berth_<phase>:    # 4 variants
  host_space: §AC.5.3
  pipeline:
    nb2_seed: 181151..181154; veo_seed: 281151..281154;
    cdn_target: cdn/client-public/cutscenes/cs_elara_bridge_berth_<phase>/

cs_elara_bridge_berth_console_alarm:
  host_space: §AC.5.3
  notes: "Cat A; 8s; parametric — fired on Bridge alarm; Elara hand on
    console; cyber-cyan fiber-optic wave-pulse."
  pipeline:
    nb2_seed: 181155; veo_seed: 281155;
    cdn_target: cdn/client-public/cutscenes/cs_elara_bridge_berth_console_alarm/

cs_human_observation_first_knock:
  host_space: §AC.5.4
  notes: "Cat A; 8s; player's first visit; comm-screen at signal-static
    (reveal stage 1); radio-receiver pulses faintly; chair at south."
  pipeline:
    nb2_seed: 181160; veo_seed: 281160;
    cdn_target: cdn/client-public/cutscenes/cs_human_observation_first_knock/

cs_human_observation_signal_<stage>:    # 4 variants — signal-static, ghost,
                                          fragment, convergence
  host_space: §AC.5.4
  notes: "Cat A; 8s for stages 1-3; 12s stitched for stage 4; comm-screen
    Human portrait progressively resolves; radio-receiver pulse intensifies
    per stage; chair rotates 180° at stage 4 (animated)."
  veo.audio.dialogue (stage 4 only): "Human: \"You are still listening.\""
  pipeline:
    nb2_seed: 181161..181164; veo_seed: 281161..281164;
    cdn_target: cdn/client-public/cutscenes/cs_human_observation_signal_<stage>/
    notes: "stage 4 = 12s stitched."

cs_human_observation_<phase>:    # 4 variants
  host_space: §AC.5.4
  pipeline:
    nb2_seed: 181165..181168; veo_seed: 281165..281168;
    cdn_target: cdn/client-public/cutscenes/cs_human_observation_<phase>/
```

### §AC.7.9 Comm-screen state cutscenes (9)

```yaml
cs_berth_comm_screen_<state>:    # 9 state variants per §AC.5.5
  host_space: §AC.5.5
  notes: "Cat A; 6s each; close-up of comm-screen at one of 9 resolved
    states; parametric per-berth (NB2 prompt expanded per archetype/recruit
    using their portrait reference)."
  pipeline:
    nb2_seed: 181201..181209; veo_seed: 281201..281209;
    cdn_target: cdn/client-public/cutscenes/cs_berth_comm_screen_<state>/
```

### §AC.7.10 Guild Common Room cutscenes (12 + per-event variants)

```yaml
cs_guild_<house_id>_first_arrival:    # 12 variants
  host_space: §AC.6.x (per guild)
  notes: "Cat A; 8s; player's first entry to guild common room; entry-arch
    warms cyan; central table fills with chair-NPCs (parametric to current
    guild membership); Archon Professor portrait subtle breathing animation
    starts; per-guild palette light-pulse cycle begins."
  veo.audio.dialogue: "Archon Professor: \"<guild's house motto / classroom-
    rule signature line>\" (lip-sync)"
  pipeline:
    nb2_seed: 182001..182012; veo_seed: 282001..282012;
    vo_manifest_ref: apps/shared/<archonProfessor_<house_id>>VoManifest.json#L<TBD>;
    cdn_target: cdn/client-public/cutscenes/cs_guild_<house_id>_first_arrival/

cs_guild_<house_id>_archon_dialogue:    # 12 variants
  host_space: §AC.6.x
  notes: "Cat A; 12s stitched 8+4; player engages Archon Professor portrait;
    portrait animates more deeply (eyes follow player; breathing audible);
    Archon delivers full philosophy + classroom rule line; brass-bound book
    on lectern animates page-flip."
  pipeline:
    nb2_seed: 182013..182024; veo_seed: 282013..282024;
    cdn_target: cdn/client-public/cutscenes/cs_guild_<house_id>_archon_dialogue/

cs_guild_<house_id>_signature_ability_progress:    # 12 variants
  host_space: §AC.6.x east trophy display
  notes: "Cat A; 6s; signature-ability-progress display animates milestone;
    east-wall trophy case glass-front fills with progress fill-bar; per-
    guild particle accent intensifies."
  pipeline:
    nb2_seed: 182025..182036; veo_seed: 282025..282036;
    cdn_target: cdn/client-public/cutscenes/cs_guild_<house_id>_signature_ability_progress/

cs_guild_<house_id>_notable_alumnus_inscribed:    # 12 variants
  host_space: §AC.6.x west bookshelf / ledger-wall
  notes: "Cat A; 6s; new alumnus inscribed in west-wall ledger-wall; brass-
    spark cascade; per-guild alumni-roster updates in real-time."
  pipeline:
    nb2_seed: 182037..182048; veo_seed: 282037..282048;
    cdn_target: cdn/client-public/cutscenes/cs_guild_<house_id>_notable_alumnus_inscribed/

cs_guild_<house_id>_archon_divergence_act7:    # 12 variants
  host_space: §AC.6.x
  notes: "Cat A; 8s; Act-7 storyteller-hook reveal — simulacrum Archon's
    portrait subtly diverges from real Archon; one alumnus's portrait
    fades from the roster; per-guild light-pulse desyncs from cycle. Out-
    of-cycle for normal play."
  pipeline:
    nb2_seed: 182049..182060; veo_seed: 282049..282060;
    cdn_target: cdn/client-public/cutscenes/cs_guild_<house_id>_archon_divergence_act7/
```

---

## §AC.8 Time-of-day overlay framework (timeOfDay.ts integration)

Per `apps/shared/timeOfDay.ts` (88 lines), the runtime defines
4 phases with the following intervals + lighting modulation:

| phase | interval | backdrop tint K | brightness | apprentice activity bias |
|---|---|---|---|---|
| `dawn` | 05:00–10:00 | 5800 K (warm-gold) | 0.85 | morning-prayer / morning-watch / morning-read |
| `midday` | 10:00–17:00 | 5400 K (neutral) | 1.00 | mission-prep / cohort-report / project-build |
| `dusk` | 17:00–22:00 | 4500 K (amber-bronze) | 0.78 | cohort-banter / evening-conversation / blueprint-sketch |
| `nightwatch` | 22:00–05:00 | 3200 K (cold-blue) | 0.55 | prayer-vigil / silent-watch / late-read |

### §AC.8.1 Per-room time-of-day modulation

Every room in §AC.4 / §AC.5 / §AC.6 carries axis 11 (cycle-phase
/ time-of-day) with the canonical 4-state list. The runtime's
`timeOfDay.getCurrent()` selects the phase; per-room art prompts
swap the corresponding NB2 nb2_overrides_per_phase block.

Phase-specific NB2 overrides (apply across all apprentice-side
rooms):

```
DAWN:        backdrop tint 5800K warm-gold; brightness 0.85; gas-mantle
             pendants dimmer; cyber-cyan rim dominant; candle-sconces lit
             at 60% capacity; volumetric haze warmer; APPRENTICE_AESTHETIC's
             palette shifts emphasis to brass + parchment-cream
MIDDAY:      backdrop tint 5400K neutral; brightness 1.00 (canonical); all
             lighting at full intensity; APPRENTICE_AESTHETIC palette canonical
DUSK:        backdrop tint 4500K amber-bronze; brightness 0.78; pendants
             warmer; candles dominant; cyber-cyan rim slightly cooler;
             palette shifts emphasis to brass + corruption-pink + blood-red
NIGHTWATCH:  backdrop tint 3200K cold-blue; brightness 0.55; gas-mantle
             pendants extinguished or very dim; candle-sconces and cyber-
             cyan rim dominant; APPRENTICE_AESTHETIC's occult-violet
             practicals brightest at this phase; volumetric haze cooler
             and thicker; palette shifts emphasis to occult-black +
             cyber-cyan + occult-violet
```

### §AC.8.2 Special phase locks (narrative)

| phase lock | rooms / cuts affected | reason |
|---|---|---|
| dawn-only | A.65 Warden's Dock cs_warden_dock_first_light | narrative — Warden meets at first light |
| dawn-only | Day-21 Mechronis audits (`cs_audit_day21_<archetype>`) | narrative — Inspector Veil-7 attends only at dawn |
| nightwatch-only | A.62 Memory Card Library inheritance ritual | atmospheric — ghost-hour reading |
| nightwatch-only | A.61 The Forge ember-glow strongest state | atmospheric |
| nightwatch-biased (60%) | A.64 Triangle Event Alcove triangle events | atmospheric — tense-dim |
| nightwatch-biased (50%) | A.71 Human's Observation Deck signal-active state | narrative — Human's signal strongest |

These locks are documented in axis 11 of each affected room.

---

## §AC.9 Updated audit + production handoff (cumulative through PR #580)

### §AC.9.1 Cumulative roster (after §AC.4–§AC.8 additions)

Total spaces authored across this document (now combining
§AC.1–§AC.6 + §AC.4 PR #580 expansion):

| sub-phase | spaces | type |
|---|---|---|
| §AC.1 (original) | 12 | apprentice cohort + commons sub-zones |
| §AC.4 | 9 | pedagogy hub + audit + forge + memory + park + warden + mission |
| §AC.5 | 5 (12 berths + 5 recruits + Elara + Human + comm screens) | berth system |
| §AC.6 | 12 | guild common rooms |
| **TOTAL** | **38 spaces** | |

(The §AC.5 row counts each archetype-berth as one space-template
that fans out to 12 production assets — total production-asset
count is 12 archetypes + 5 recruits + 1 Elara + 1 Human + 1 comm
screen surface = 20 distinct production assets within §AC.5.)

Total cutscenes authored across this document:

| sub-phase | cutscenes |
|---|---|
| §AC.2 (original) | 59 |
| §AC.7.1 doctrine | 6 |
| §AC.7.2 audits | 36 + 2 = 38 |
| §AC.7.3 forge | 14 |
| §AC.7.4 memory | 24 |
| §AC.7.5 cohort + park | 10 |
| §AC.7.6 warden's dock | 6 |
| §AC.7.7 missions | 51 |
| §AC.7.8 berth | 80 |
| §AC.7.9 comm-screen | 9 |
| §AC.7.10 guild rooms | 60 |
| **TOTAL** | **357 cutscenes** |

### §AC.9.2 Art-resource manifest (cumulative additions for PR #580)

| category | count | notes |
|---|---|---|
| new room textures (§AC.4 + §AC.5 + §AC.6) | ~150 | 4K seamless floor/wall/ceiling/fixture sets per room |
| new .glb models | ~180 | per-room fixtures + 12 archetype-overlay variants for berths + 12 guild-overlay models for common rooms |
| NB2 master-still reference passes | ~50 | one per room + per-archetype-berth + per-guild |
| cutscene asset directories | ~298 (PR #580 cuts) | per `cs_id` × `{start.png + end.png + clip.mp4 + audio_post.wav + meta.json}` |
| comm-screen state overlays | 9 sprites | reusable across 18 berths |
| activity-sprite atlas | 48 (12 archetypes × 4 phases) + 20 (5 recruits × 4 phases) | per `berthCommScreen.ts` activity resolver |
| **storage estimate (added)** | **~5.4 GB** | new cutscenes 3.6 GB + new room references 1.8 GB |

### §AC.9.3 VO manifest TBDs (cumulative)

24 archetype manifests already shipped on main per PR #517.
PR #580 ships:
- `apps/scripts/apprentice-pedagogy-doctrines-lines.json` (162)
- `apps/scripts/apprentice-pedagogy-audits-lines.json` (578)
- `apps/scripts/apprentice-pedagogy-missions-lines.json` (1666)
- `apps/scripts/apprentice-pedagogy-warden-lines.json` (90)

These are JSON line-banks, not VoManifest.json. Production
handoff: convert each to per-character VoManifest.json with
canonical lineId fields so the audio-post pipeline can address
them consistently with the existing 24 archetype manifests.

NEW manifests authored as part of follow-up:
- `essenceHarvesterVoManifest.json` (already in §AC.3 TBD)
- `restoredApprenticeGenericVoManifest.json` (already in §AC.3 TBD)
- 12 `archonProfessor_<house_id>VoManifest.json` (one per guild
  Archon Professor)
- `inspectorVeil7VoManifest.json` (the Warden's canonical manifest)
- `mechronisAuditorGenericVoManifest.json` (faceless-auditor for
  Day-7/14)
- `quartermasterVoManifest.json` (mission briefing room NPC)

Total new manifests: 17 (essence + restored + 12 archons +
warden + auditor + quartermaster).

### §AC.9.4 ship:check parity gate cross-check

The 8 new ship:check parity gates added in PR #580 should align
with the rooms / cutscenes / art-assets authored here. Mapping:

| ship:check gate | declared | this doc covers |
|---|---|---|
| apprenticeAuditCoverage | 12 archetypes × 3 days = 36 | §AC.4.2 + §AC.7.2 (38 cutscenes — 36 audit cuts + 2 framing cuts) |
| apprenticeDoctrineCoverage | 5 doctrines | §AC.4.1 + §AC.7.1 (6 cutscenes — 5 recitations + 1 first-arrival) |
| apprenticeMechronisLinkCoverage | mentor signature math | §AC.4.2 + §AC.4.3 (the audit→forge progression) |
| apprenticeMissionCoverage | 17 missions × 7 roles | §AC.4.8 + §AC.4.9 + §AC.7.7 (51 cutscenes) |
| apprenticePedagogyAssetCoverage | VO line counts + art asset paths | §AC.9.2 + §AC.9.3 (asset manifest covers; TBD line numbers) |
| apprenticeWardenCoverage | 4 candidates + Day-14 dock | §AC.4.7 + §AC.7.6 (6 cutscenes) |
| berthCoverage | 48 apprentice activities + 5 recruit activities + 8 berth doors + NPC portraits + comm-screen smoke tests | §AC.5 (12 berths + 5 recruits + Elara + Human + comm screen surface; §AC.7.8 80 cutscenes) |
| **8th gate** (likely apprenticeMemoryInheritanceCoverage) | 12 archetypes × inherited line + 12 breaking-point echoes | §AC.4.4 + §AC.7.4 (24 cutscenes) |

### §AC.9.5 Cross-references back to existing docs

- `_PRODUCTION_ARK_ROOMS.md`: §A.07 Bridge (§AC.5.3 Elara's berth
  is a sub-zone); §A.18 Observation Lounge (§AC.5.4 Human's
  Observation Deck connects); §A.20 War Room (§AC.4.8 Mission
  Briefing connects); §A.31 Trade Hub (§AC.4.9 trade-envoy
  return); §A.33 Defense Command (§AC.4.9 tower-captain return);
  §A.42 Hangar Dock (§AC.4.9 companion return); §A.50–§A.58
  (§AC.1 apprentice cohort spaces).
- `_PRODUCTION_DESTINATIONS.md`: HB1 Celebration School →
  §AC.4.5 + §AC.4.6 are sub-zones extending the existing
  destination.
- `_PRODUCTION_HELLBOXES.md`: HB cosmology unchanged.
- `_PRODUCTION_CROSS_CUT.md`: ~298 new cutscene IDs need spine
  entries added in a follow-up doc-sync (sub-section §F.1.A.15
  "Apprentice + commons + pedagogy cuts" appended to the existing
  §F.1.A.14 from the original §AC apprentice rollout).
- `_PRODUCTION_CUTSCENE_PROMPTS.md`: §AC.7 cutscenes inherit
  §G.0 framework; APPRENTICE_AESTHETIC stacks on canonical FPV
  trait-lock + canonical negative-prompt.
- `_PRODUCTION_VEHICLES.md`: not affected.

### §AC.9.6 Outstanding TBDs (PR #580 scope)

- VO manifest line numbers for all pedagogy line-banks (162 +
  578 + 1666 + 90 = 2496 lines need lineId mapping to per-
  character VoManifest.json files).
- 17 new VO manifests needed (essence harvester + restored
  apprentice + 12 archon professors + Inspector Veil-7 +
  Mechronis auditor + quartermaster).
- §F.1.A cross-cut sync for 298 new cutscene IDs (separate
  doc-pass).
- 8 storyteller-hook expansion-reserved Act-7 reveal slots
  documented in §AC.4 / §AC.5 / §AC.6 (chair-rotation in Human's
  observation deck; cold-coffee photograph at Warden's Dock;
  4th seat at stage-3 dais; 13th display case at Forge; 18th
  dossier at Mission Briefing; per-guild Archon-divergence;
  Prodigal locked drawer revealed earlier in §AC.1; 13th
  essence-vault cabinet earlier in §AC.1).
- Time-of-day phase-locks for narrative cuts (dawn-only Warden
  + Day-21 audits; nightwatch-only Memory Card inheritance) are
  tagged at axis 11 of each room; production-side QA must verify
  runtime gating.

### §AC.9.7 Production handoff (cumulative)

After this PR merges, the asset-generation pipeline can:

1. Generate the ~50 new master-still NB2 references (§AC.4 +
   §AC.5 + §AC.6 rooms) — trait-locked to APPRENTICE_AESTHETIC
   + per-room palette overlays.
2. Submit the 12 archetype-berth × 4 phase = 48 NB2 still
   batches + 12 doctrine-slip arrival cuts + 36 audit-transcript
   cuts + 12 forge-card-displayed cuts (per §AC.5.1 berth
   evolutions).
3. Submit the 12 guild common room × 4 cutscene-types = 48 +
   12 act-7 divergence cuts (60 guild cutscenes total).
4. Submit the 51 mission-briefing + 51 mission-return cuts (per
   §AC.4.8 + §AC.4.9).
5. Submit the 12 + 24 + 14 + 38 + 10 + 6 + 9 = 113 ceremonial /
   pedagogy cutscenes.
6. Audio post: existing 24 archetype VO manifests feed lip-locked
   dialogue per archetype-berth; 17 new VO manifests authored
   as side-task; pedagogy line-banks consumed via lineId mapping.
7. CDN upload per `cs_id` directory contract.
8. `_PRODUCTION_CROSS_CUT.md` §F.1.A.15 added in follow-up
   doc-sync PR.

The runtime is unchanged; this is a production-doc deliverable
only. `pnpm check` and `pnpm ship:check` remain N/A for the doc.

End of `_PRODUCTION_APPRENTICE_COMMONS.md` with PR #580 expansion.
