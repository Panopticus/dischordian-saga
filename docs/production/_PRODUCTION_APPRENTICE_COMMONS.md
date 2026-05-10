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

---

## §AC.10 Character art — apprentice + recruit + named-NPC profile + dialog portraits

The §AC.4–§AC.9 expansion authored rooms, cutscenes, and
diegetic-fixture art (workbenches, plaques, comm-screens,
dossier-folios). It cited per-archetype portrait references
(`apprentice_<archetype>_portrait.png`) but did not author the
**character art set itself** at production-spec depth. The
apprentice runtime (PRs #509, #513, #517) ships:

- BioWare-style branching dialog UIs (need per-character dialog
  headshots with expression states)
- Roster + recruitment + mission-board UIs (need profile heroes
  + dossier thumbnails)
- Doctrine slip + signature card + memory card artifact UIs
  (need character-faced artifacts)
- Audit transcript readable in-world artifact (needs apprentice
  bust + Auditor bust on transcript header)
- Cohort-roster brass plaque wall in §AC.1.1 (needs etched
  apprentice portrait per plaque)

This section authors all of it. Every portrait inherits §AC.0.1
APPRENTICE_AESTHETIC anchor; every prompt follows the
`_PRODUCTION_CUTSCENE_PROMPTS.md` §G.0 Nano Banana 2 5-block
schema. **Production-side, the character portrait set is the
single largest art-asset bundle in this document.**

### §AC.10.1 Roster overview — character-art subjects

| group | count | sub-counts |
|---|---|---|
| 12 apprentice archetypes × 2 genders | 24 base characters | each with full set per §AC.10.3 |
| 5 named recruits | 5 base characters | per-recruit identity locked (Vex Solène, Wraith Calder, Locke, Jericho Jones, Akai Shi) |
| Inspector Veil-7 (the Warden) | 1 | named NPC |
| 12 Archon Professors (one per guild) | 12 | named NPCs (simulacra) |
| 4 Warden's candidate apprentices | 4 | parametric — picked from existing 24 archetype-gender pool, but with Warden-livery overlay |
| Mechronis Auditor (faceless) | 1 | brass-mask only; non-portrait |
| Quartermaster | 1 | named NPC |
| Apprentice cohort group portrait | parametric | per cohort cycle; 12-portrait composite for roster wall |
| **TOTAL named-character art subjects** | **44** | + 24 apprentice archetype-genders |

### §AC.10.2 Trait-lock per archetype (visual identity description)

Each apprentice archetype carries a **canonical visual identity**
trait-locked across every portrait, expression, and overlay
variant. The identity strings below are reused **verbatim**
across all NB2 prompts featuring that archetype (per Nano Banana
2 character-consistency research — `prompting.systems` guide:
"reuse identical descriptive tokens verbatim across batches").

| archetype | canonical visual identity (trait-lock; reuse verbatim) |
|---|---|
| **Zealot** | a true-believer figure in their late twenties; brass-bound cassock with cyber-cyan stitched scripture-cipher running down the seam; a single brass-bound scripture-medallion on a chain at chest; eyes lit from within with conviction; close-cropped hair (gender-variant); a thin scar across the right brow; gas-mantle aureole effect rim-lighting the head |
| **Ghost** | a near-silent figure in charcoal-grey gambeson with brass clasps; a half-mask covering the lower face (brass with cyber-cyan inlay); only the eyes visible above the mask; high cheekbones; gloved hands always at rest at sides; a small audio-recorder pendant at the throat |
| **Scholar** | a knowledge-hungry figure in a cipher-stained leather coat over a parchment-cream tunic; brass-rim reading-glasses pushed up on the brow; ink-stained fingertips; an open book held against the chest in left hand; a pen behind the right ear; eyes that seem to be reading even in conversation |
| **Revenant** | a returned-from-death figure in iron-grey robe over leather; visible scarification in cipher-script along the inside of both forearms; one eye milky-white from past damage; the other eye lit cyber-cyan; a small bandage permanently wrapped around the left wrist; breath audible even in stillness |
| **Artisan** | a quiet-handed maker in a leather apron with 24 brass tool-loops at the chest; cog-mechanism brass goggles pushed up on the forehead; ink and machine-oil staining the fingertips; a cog-mechanism wristwatch on the right wrist; eyes always slightly distant — looking at the project, not the viewer |
| **Oracle** | a seer in a velvet hooded cloak with cyber-cyan threading through the seams; a single silver tarot-card visible in the right hand; one eye slightly larger than the other (parametric tell); a neural-jack port at the temple visible beneath the hood; eyes that seem to look just past the viewer's shoulder |
| **Wanderer** | a restless figure in a dust-stained travelling cloak with a brass walking-stick at the side; sun-and-storm-weathered skin; one earring (small brass hoop); a small leather map-pouch at the hip; never quite still — even in a portrait, the cloak suggests the figure was about to step away |
| **Martyr** | a self-giving figure in a pale gambeson with a bandage-roll across the chest like a sash; both palms permanently faintly raised (open posture); a small redirect-rune brass plate stitched over the heart; eyes wet with concern; a scar across one cheek |
| **Heretic** | a question-everything figure in a black robe with cipher-script in chalk dust along the hem; one ear visible (cocked, listening); a brass debate-bell suppressed in the left hand (cloth muffler); chalk-dust on the fingertips; eyes amused, slightly sceptical |
| **Jester** | a humour-as-armour figure in a motley cloak (asymmetric panels of brass / leather / parchment); a small brass skull-headed staff at the side; a half-smile that does not reach the eyes; bells on the cuffs (silenced — cloth-muffled); a single retort-card visible in the right hand |
| **Sentinel** | a dutiful watcher in a brass-armoured tunic with cyber-cyan piping along the seams; a watch-cap with brass insignia; eyes scanning the horizon (slightly off-camera); a brass siren-key on a lanyard at the chest; one gloved hand resting on the hilt of a sheathed brass-bladed knife |
| **Prodigal** | a returned-not-forgiven figure in a travel-worn formal cloak; a signet ring on the right hand (visibly removed and re-placed many times); one earring (small brass hoop, matching Wanderer — narrative bond); eyes downcast or slightly averted; a half-empty leather coin-purse at the belt |

For each archetype, gender variants follow the gendered VO
manifest split (`apprentice-<archetype>-<gender>-lines.json`):
**female** and **male** primary genders, with parametric
non-binary variants generated at runtime by mixing.

### §AC.10.3 Per-archetype art set — what to render (per archetype × gender)

For each of 24 archetype-gender combinations, the production-art
deliverables are:

| asset id | use | aspect | resolution | description |
|---|---|---|---|---|
| `apprentice_<archetype>_<gender>_profile_hero.png` | roster card / recruitment hero / mission-board dossier full image | 2:3 portrait | 4K | full-bust 70% canvas, cinematic dramatic lighting; archetype's signature object visible; APPRENTICE_AESTHETIC backdrop |
| `apprentice_<archetype>_<gender>_dialog_headshot.png` | BioWare-style dialog UI (when speaking) | 1:1 square | 1080×1080 | head-and-shoulders, flat-lit dialog-friendly; eyes meeting camera; mouth at neutral; framed for left/right 3/4 turn |
| `apprentice_<archetype>_<gender>_dialog_3qbody.png` | 3/4-body dialog framing (alternate) | 3:4 portrait | 1536×2048 | from mid-thigh up; archetype-signature gesture; APPRENTICE_AESTHETIC environment hinted in DOF bokeh |
| `apprentice_<archetype>_<gender>_thumbnail.png` | roster grid, mission-board tile, comm-screen corner-overlay | 1:1 square | 256×256 | tight crop on face; recognizable at thumbnail scale |
| `apprentice_<archetype>_<gender>_silhouette.png` | mourning-wall fallen state + locked-roster pre-recruitment + comm-screen narrative_silence overlay | 1:1 square | 1080×1080 | full silhouette in cyber-cyan only; no facial detail; archetype-signature object faintly visible in silhouette |
| `apprentice_<archetype>_<gender>_expression_<state>.png` × 6 expressions | dialog UI expression-set; 6 states per archetype | 1:1 square | 1080×1080 | each state described in §AC.10.4 |

Per archetype × gender = **11 distinct PNG renders** (5 base + 6 expressions).
Total apprentice art: **24 × 11 = 264 renders**.

### §AC.10.4 Expression states (6 per archetype × gender)

Each archetype gets 6 expression-state portraits to feed the
dialog UI:

| state | trigger / use | facial direction |
|---|---|---|
| `neutral` | default dialog state; idle banter | neutral mouth, eyes meeting camera, archetype-signature posture |
| `focused` | combat / mission / audit dialog | jaw set, eyes narrowed, slight forward lean |
| `triumphant` | mission-success / signature-card-forged / graduation | small smile (closed-mouth), eyes lit, slight head-up |
| `wounded` | combat-damage / personal-quest-failure / breaking-point | jaw tight, eyes downcast, scar / wound visible (per archetype tell — Revenant scar enhanced; Martyr bandage bloodied; Sentinel wrist-band torn) |
| `corrupted` | high-corruption ratio (architect-coopted forge state); blood-weave alignment > 30 | one eye glowing corruption-pink; slight asymmetry; archetype-signature object visibly inverted (Zealot's scripture-cipher inverted; Oracle's tarot card upside-down; Heretic's chalkboard-script in mirror-hand) |
| `doctrinal` | post-doctrine-binding state-shift; visible bound-doctrine cue | doctrine slip pinned at chest visible in frame; eyes carry the doctrine's specific gravitas (Compliant Mouth: serene / Forked Path: alert / Cold Hand: still / Heretical Quiet: silent / Human Remainder: present) |

### §AC.10.5 NB2 master prompt — apprentice profile hero (per archetype × gender)

```yaml
# Generic template — instantiate 24× with archetype + gender variants
nb2:
  model: gemini-3-pro-image-preview
  aspect_ratio: "2:3"
  resolution: "4K"
  reference_images:
    - cdn/client-public/art/refs/apprentice_aesthetic_anchor.png
  prompt: |
    SUBJECT: <archetype canonical visual identity from §AC.10.2,
      verbatim>; gender presentation: <female | male>; full bust
      framing 70% canvas; cinematic dramatic three-quarter pose;
      archetype's signature object visible per §AC.10.2 (Zealot
      scripture-medallion / Ghost mask / Scholar open book /
      Revenant scarification / Artisan tool-apron / Oracle
      tarot-card / Wanderer walking-stick / Martyr bandage-roll /
      Heretic muffled bell / Jester retort-card / Sentinel
      siren-key / Prodigal signet-ring); APPRENTICE_AESTHETIC
      backdrop (steampunk-cyberpunk-occult environment
      hinted in soft bokeh — brass armatures, fiber-optic
      conduits, sigil-etched plates, chalk-circle inlay
      visible at frame edge).
    COMPOSITION: 2:3 portrait, 50mm equivalent, three-quarter
      turn, eyes meeting camera, shallow DOF on face and signature
      object; backdrop in soft bokeh.
    LIGHTING/CAMERA: 1800K candle / gas-mantle key from upper-
      left at 45°; 5400K cold cyber-cyan rim from upper-right
      framing the silhouette; 12000K occult-violet practical
      visible in foreground bokeh from a sigil-etched brass
      fixture; ARRI Alexa anamorphic; Kodak Vision3 500T
      pushed +1; subtle anamorphic flare across the rim.
    STYLE: APPRENTICE_AESTHETIC: steampunk-cyberpunk-occult; the
      archetype is a real person captured in a real
      apprentice-hall environment; palette `#c9a14a / #5fa8ff /
      #0d0a08 / #ff2a8a / #5a1a1f / #dccfaa`; volumetric oil-
      smoke + cyber-mist haze z+1.5–2.0m thinner than ceremonial
      chambers (this is a portrait, not a wide ceremonial shot).
    CONSTRAINTS: no extra fingers; no watermark; no on-screen UI;
      no studio logo; no modern brand insignia; consistent facial
      structure — character must read as the same person across
      every portrait of this archetype × gender (see
      `apprentice_<archetype>_<gender>_master_face.png` reference
      bundle); text rendering only for diegetic signage already
      specified in the prompt and never longer than 25 characters;
      no third-person environmental framing of an unseen viewer
      (this is a third-person OF the apprentice — the apprentice
      is the subject; no FPV constraint applies).
    Output 4K, 2:3 portrait.

pipeline:
  nb2_seed: 190001 + (archetype_index * 100) + gender_offset
              # 12 archetypes × 2 genders × 11 asset-types
              # = 264 unique seeds in the 190001..190264 range
  cdn_target: cdn/client-public/art/portraits/apprentice_<archetype>_<gender>_<asset_id>.png
  reference_image_bundle: |
    Use the apprentice_<archetype>_<gender>_master_face.png as a
    consistent-face anchor across all 11 asset types; the
    master_face render is generated FIRST (single canonical face
    pass), then the 5 base assets + 6 expressions reference back
    to it. This is the standard Nano Banana 2 character-
    consistency workflow per `prompting.systems` (≤5 distinct
    characters per ref bundle; trait-locking by reusing identical
    descriptive tokens verbatim across the batch).
```

### §AC.10.6 NB2 prompt — dialog headshot (per archetype × gender × expression)

```yaml
# Generic template — instantiate 24 archetypes × 6 expressions = 144 renders
nb2:
  model: gemini-3-pro-image-preview
  aspect_ratio: "1:1"
  resolution: "1080x1080"
  reference_images:
    - cdn/client-public/art/portraits/apprentice_<archetype>_<gender>_master_face.png
    - cdn/client-public/art/portraits/apprentice_<archetype>_<gender>_profile_hero.png
  prompt: |
    SUBJECT: <archetype canonical visual identity from §AC.10.2,
      verbatim>; gender presentation: <female | male>; head-and-
      shoulders dialog headshot, eyes meeting camera, mouth at
      neutral but expression at <state>; expression details per
      §AC.10.4: <state-specific direction — e.g. "jaw tight, eyes
      downcast, archetype-signature wound visible" for wounded>;
      framed for the BioWare-style dialog UI which crops to
      square at 1080x1080; the figure occupies 80% of canvas
      vertical; backdrop is APPRENTICE_AESTHETIC environment
      bokeh (NOT a clinical headshot — the room reads behind
      the character at a soft DOF).
    COMPOSITION: 1:1 square, 85mm equivalent (intimate dialog
      lens), shallow DOF on face; head occupies upper 60% of
      canvas; shoulders fill lower 40%; environment-bokeh at
      40% saturation behind.
    LIGHTING/CAMERA: 1800K candle key from upper-left 45°;
      5400K diffuse fill; 6500K cyber-cyan rim from upper-right;
      practical 12000K occult-violet in background bokeh; ARRI
      Alexa anamorphic; Kodak Vision3 500T; flatter than the
      profile-hero (this is a dialog frame — must read at any
      moment in conversation without dramatic shadows occluding
      eyes).
    STYLE: APPRENTICE_AESTHETIC; head-and-shoulders dialog
      portrait that holds character consistency across all 6
      expression states for this archetype × gender.
    CONSTRAINTS: same face structure as
      `apprentice_<archetype>_<gender>_master_face.png` reference;
      no extra fingers (hands not in frame for headshot); no
      watermark; no on-screen UI; consistent eye-spacing,
      jaw-line, hairline across the 6-expression batch;
      expression-state tell per §AC.10.4 must be visible without
      caricature.
    Output 1080x1080, 1:1.

pipeline:
  nb2_seed: 190401 + (archetype_index * 12) + (gender * 6) + expression_index
              # 12 archetypes × 2 genders × 6 expressions = 144 unique seeds
              # in the 190401..190544 range
  cdn_target: cdn/client-public/art/portraits/apprentice_<archetype>_<gender>_expression_<state>.png
```

### §AC.10.7 Recruit character art (5 named recruits)

Each named recruit gets the same 11-asset set as an apprentice,
**but** their visual identity is locked to their existing
runtime portrait (per `apps/client/src/game/npcPortraits.ts`).
The runtime ships base portrait registrations; this section
authors the 11-asset production set per recruit using each
recruit's locked visual identity:

| recruit | locked visual identity (trait-lock; reuse verbatim) |
|---|---|
| **Vex Solène** | engineer in mid-thirties; close-cropped silver hair (early-greying); a workshop apron over a brass-bound utility shirt; oil-stained fingertips; cog-mechanism goggles permanently pushed up on the forehead; one earring (brass cog); a single tool-loop with a brass wrench at the right hip; eyes that read like she is solving the room's structural integrity |
| **Wraith Calder** | a wraith in their late forties; long greying-brown hair tied back loose; deep-shadowed eyes; a leather long-coat in survival-grit aesthetic; a brass-bound pocket-watch (broken hands frozen) on a chain at the chest; one scar across the throat; a scratched-out photograph carried in the breast pocket |
| **Locke** | an adjudicator in formal-grey middle-age; close-cropped brown hair; brass-rim spectacles; a high-collar grey cassock with brass-bound buttons; a brass-bound code-book in the right hand; eyes that have read the rules and are reading them again; a single brass key on a chain at the throat |
| **Jericho Jones** | a trade-broker in the late thirties; weather-worn brown hair shoulder-length; a leather jacket over a tradesman's tunic; a brass-rim pocket-watch (working hands) on a chain; a half-empty whiskey-flask at the belt; a holstered pistol on the right hip (decorative — never drawn casually); a framed certificate (illicit broker license) implied behind |
| **Akai Shi** | a necromancer in middle-age; long black hair partially braided with cyber-cyan thread; a black robe with brass-bound sleeves; visible scarification in cipher-script along the right cheek; one specimen-jar (small, glowing faintly) at the belt; an altar-bell (small brass) in the left hand; eyes that look at the dead before they look at the living |

Each recruit gets the same 11-asset render set as an apprentice
(profile hero + dialog headshot + 3qbody + thumbnail + silhouette
+ 6 expressions). No gender variants (these are named characters
with locked identity).

Total recruit art: **5 × 11 = 55 renders.**

### §AC.10.8 Named-NPC character art

#### Inspector Veil-7 (the Warden)

Visual identity (trait-lock; reuse verbatim):
> a procedural inspector in their fifties; close-cropped iron-
> grey hair; a long grey-wool greatcoat over a high-collar
> grey-and-brass uniform; a brass nameplate clip-on lapel
> reading "VEIL-7" (8 chars, NB2 text-rendering-safe); eyes
> that lip-read; mouth that records nothing; one gloved hand
> always visible (never holding); a Mechronis-issue brass-rim
> notebook closed at the hip; the greatcoat fabric subtly
> draped — no creases, no wear; a faint amber service-medallion
> at the lapel above the nameplate

Asset set (full 11):
- `warden_veil7_profile_hero.png` (2:3, 4K)
- `warden_veil7_dialog_headshot.png` (1:1, 1080×1080)
- `warden_veil7_dialog_3qbody.png` (3:4, 1536×2048)
- `warden_veil7_thumbnail.png` (1:1, 256×256)
- `warden_veil7_silhouette.png` (1:1, 1080×1080) — used for
  comm-screen `warden_line_tap` overlay
- `warden_veil7_expression_neutral.png`
- `warden_veil7_expression_focused.png` — Day-21 audit lean-in
- `warden_veil7_expression_triumphant.png` — recruitment success
- `warden_veil7_expression_wounded.png` — never used in normal
  play; reserved for Act-7
- `warden_veil7_expression_corrupted.png` — Act-7 reveal state;
  one eye Mechronis-violet
- `warden_veil7_expression_doctrinal.png` — Compliant Mouth
  recitation pose

Pipeline: `nb2_seed: 190551..190561; cdn_target:
cdn/client-public/art/portraits/warden_veil7_<asset>.png`.

#### 12 Archon Professors (one per guild)

Each Archon Professor's visual identity is locked to their guild
aesthetic. Per-Archon trait-lock strings:

| guild | Archon | visual identity (trait-lock) |
|---|---|---|
| Iron | Professor Steele | iron-grey scholar in late fifties; close-cropped silver hair; a brass-bound iron-grey academic robe; iron-and-brass spectacles; one iron-rim pendant; eyes that have judged a thousand essays |
| Glass | Professor Lenz | crystal-pale scholar in late forties; long pale hair pulled back; a translucent crystal-rimmed academic robe with cyber-cyan threading; brass-rim spectacles with crystal-fragment lenses; eyes that read x-ray-clear |
| Smoke | Professor Veil | shadowed scholar in late fifties; long grey hair loose; a smoke-grey academic robe with ember-orange piping; brass-rim spectacles tinted ember; one smoke-trail emerging from the left cuff (always); eyes that disappear in smoke |
| Ledger | Professor Quill | parchment-cream scholar in their sixties; close-cropped white hair; a leather-and-brass academic robe; ink-stained fingertips; brass-rim spectacles permanently smudged; a quill behind each ear; eyes that have audited every alumnus |
| Circuit | Professor Wirework | cyber-cyan scholar in their forties; short black hair with cyber-cyan thread woven; a brass-and-fiber-optic academic robe; circuit-board spectacles; one neural-jack port at the temple visible; eyes that flicker with fiber-optic pulse |
| Thurible | Professor Smoke | occult-violet scholar in their fifties; long black hair partially braided; a black-and-brass academic robe with violet-trim; an incense-thurible always at the side; brass-rim spectacles tinted occult-violet; eyes that smell what others see |
| Anvil | Professor Hammer | forge-orange scholar in their fifties; close-cropped grey-brown hair; a leather-and-brass forge-master's apron over an academic robe; brass-rim goggles pushed up; soot-stained hands; eyes lit by ember-glow |
| Mirror | Professor Glass-Mask | reflective scholar in their forties; head fully concealed by a brass-bound mirror-mask (their reflection always shows the viewer); a silver-and-occult-violet academic robe; gloved hands; the mirror-mask faintly cracked across the right cheek; eyes never directly visible |
| Garden | Professor Vine | green-and-brass scholar in their fifties; long brown hair with vine-and-cyber-cyan-thread woven; a green-and-brass academic robe with vine-overlay; brass-rim spectacles dusted with pollen; one small living sprout at the lapel; eyes warm with growth |
| Chapel | Professor Bell | candle-amber scholar in their sixties; long silver hair loose; a candle-amber-and-brass academic robe with occult-violet trim; brass-bound book carried always; one candle stub in the right pocket; eyes that toll like a bell |
| Tower | Professor Watch | command-cool scholar in their fifties; close-cropped black hair; a command-grey-and-brass academic uniform with cyber-cyan piping; a brass watch-cap; brass-rim spectacles; one surveillance-monitor pendant at the chest; eyes that scan |
| Remnant | Professor Sigh | bone-white scholar in their sixties; long silver-white hair loose; a bone-and-blood-red-and-brass academic robe; one ash-mark visible on the cheek; gloved hands; brass-rim spectacles; eyes carrying every fallen alumnus |

Each Archon gets the same 11-asset render set. Total Archon
art: **12 × 11 = 132 renders.**

Pipeline seeds: `190601..190732; cdn_target:
cdn/client-public/art/portraits/archon_<house_id>_<asset>.png`.

#### Mechronis Auditor (faceless)

A faceless brass-mask figure used for Day-7 / Day-14 audits.
Trait-lock:
> a brass-masked Mechronis Auditor in a high-collar brass-and-
> grey uniform; the brass mask covers the entire face (no eye-
> holes — the face is a featureless brass plate with cipher-
> script "MECHRONIS AUDITOR" lightly etched at chin level);
> gloved hands clasped at the chest; a brass-bound interview-
> ledger at the hip; the body language is procedural,
> motionless

Asset set (5 base only — no expression variants for a faceless
character):
- `mechronis_auditor_profile_hero.png`
- `mechronis_auditor_dialog_headshot.png`
- `mechronis_auditor_dialog_3qbody.png`
- `mechronis_auditor_thumbnail.png`
- `mechronis_auditor_silhouette.png`

Pipeline: `nb2_seed: 190751..190755; cdn_target:
cdn/client-public/art/portraits/mechronis_auditor_<asset>.png`.

#### Quartermaster (mission briefing NPC)

Trait-lock:
> a quartermaster in their fifties; close-cropped iron-grey hair;
> a leather-and-brass field-uniform with rank-pips at the collar;
> a brass clipboard always in the left hand; a deployment-bell-
> rope coiled around the right shoulder; one cog-mechanism
> wristwatch on the left wrist; weather-worn face; eyes that
> have signed every order

Full 11-asset set. Pipeline: `nb2_seed: 190761..190771;
cdn_target: cdn/client-public/art/portraits/quartermaster_<asset>.png`.

#### Apprentice cohort group portrait (per cohort cycle)

A 12-portrait composite for the §AC.1.1 cohort-roster brass
plaque wall. Each cycle produces a single wide group-portrait
of all 12 active apprentices in matching cohort-livery — used
as the reference still that the 12 individual brass plaques are
etched from.

Trait-lock:
> the 12 active apprentices arranged in 3-row × 4-column
> formal cohort group portrait; each apprentice in their
> doctrine-bound state per §AC.10.4 expression `doctrinal`;
> backdrop is the Apprentice Hall (§AC.1.1) cohort-roster wall;
> APPRENTICE_AESTHETIC; the composition reads as a Mechronis
> Academy class photograph but the candidates are the
> apprentices

Single render per cycle. Pipeline: `nb2_seed: 190801 + cycle_id;
cdn_target: cdn/client-public/art/portraits/cohort_group_<cycle_id>.png`.

### §AC.10.9 Artifact-faced character art (per archetype)

The diegetic in-world artifacts that bear apprentice character
imagery:

| artifact | per-archetype renders | use |
|---|---|---|
| **Doctrine slip** (5 doctrines, no archetype overlay) | 5 renders | south wall of §AC.4.1 mints; pinned to apprentice berth wall (§AC.5.1) |
| **Audit transcript** brass-bound artifact | 12 archetypes × 3 days = 36 renders | header carries apprentice's profile_hero + Auditor's silhouette; cipher-script body fills the page |
| **Mission dossier folio** | 17 missions × archetype-on-deployment = parametric | dossier cover carries apprentice's thumbnail + role-glyph; 17 mission-template covers + 12 archetype-overlay variants = 17 + 12 = 29 renders (composited at runtime) |
| **Memory card** (mint state) | 12 archetypes × 1 = 12 renders | card-face carries apprentice's profile_hero in cipher-script frame; archetype-glyph in upper-right |
| **Memory card** (post-consumption burn state) | 12 archetypes × 1 = 12 renders | same card with edge-burn animation frames; voice-over surface |
| **Signature card** | 12 archetypes × 6 effect-slots × 3 corruption-bands = 216 renders | card-face carries archetype-glyph + effect-slot icon + corruption-band trim |
| **Cohort-roster brass plaque** | 12 archetypes × 2 states (blank / etched) = 24 renders | wall-mount in §AC.1.1; etched with apprentice profile + name + dates |
| **Mourning-wall brass plaque** | 12 archetypes × 2 states (blank / etched) = 24 renders | wall-mount in §AC.1.6; etched after permadeath |

#### NB2 prompt — signature card (template; instantiate 216×)

```yaml
nb2:
  model: gemini-3-pro-image-preview
  aspect_ratio: "2:3"
  resolution: "1024x1536"
  reference_images:
    - cdn/client-public/art/portraits/apprentice_<archetype>_<gender>_profile_hero.png
    - cdn/client-public/art/refs/apprentice_signature_card_template.png
  prompt: |
    SUBJECT: a forged Signature Card belonging to the apprentice
      <archetype canonical identity per §AC.10.2 verbatim>; the
      card is brass-rim mahogany card-stock, 2.5 × 4 inches,
      with cyber-cyan fiber-optic edge-trim per the corruption-
      band: <pristine: brass + cyber-cyan / midstate: brass +
      corruption-pink mottle / corrupted: corruption-pink with
      eye visible inside the trim>; card face shows: top third
      = archetype-glyph in cipher-script (one of: Z-cipher /
      G-cipher / S-cipher / R-cipher / A-cipher / O-cipher /
      W-cipher / M-cipher / H-cipher / J-cipher / Sn-cipher /
      P-cipher); centre 50% = the apprentice's profile-hero
      image rendered in brass-and-cyber-cyan halftone (NB2
      cipher-engraving style); bottom third = effect-slot icon
      + brass-rim cipher-text label per slot
      (battle_cry_recitation / deathwatch_lament / rebirth_silence
      / rally_chorus / drain_witness / stun_keyturn — all 25
      chars max, NB2 text-rendering-safe); the card sits warm on
      the brass-and-iron Forge anvil surface (per §AC.4.3) with
      slight surface-warmth shimmer.
    COMPOSITION: top-down 90° view of the card on anvil; 50mm;
      soft DOF on card face; anvil surface in soft bokeh.
    LIGHTING/CAMERA: 1800K candle key + 1800K forge-flue ember-
      orange backlight; 6500K cyber-cyan rim from active effect-
      slot pillar; 12000K occult-violet practical at sigil-circle
      nodes (visible in soft bokeh); ARRI Alexa anamorphic;
      Kodak Vision3 500T pushed +1.
    STYLE: APPRENTICE_AESTHETIC; the card reads as forged-warm,
      not printed; palette `#c9a14a / #5fa8ff / #0d0a08 /
      #ff2a8a / #5a1a1f / #dccfaa` plus forge-orange `#ff5a1a`
      backlight.
    CONSTRAINTS: no extra fingers (no hands in frame); no
      watermark; no studio logo; archetype-glyph cipher-script
      ≤25 chars; effect-slot label ≤25 chars; corruption-band
      visual cue must be visible without caricature; consistent
      apprentice profile across all 18 cards bearing this
      apprentice (3 corruption bands × 6 effect-slots = 18).
    Output 1024x1536, 2:3.

pipeline:
  nb2_seed: 191001..191216    # 216 unique seeds
  cdn_target: cdn/client-public/art/cards/signature_<archetype>_<effect_slot>_<corruption_band>.png
```

### §AC.10.10 Comm-screen portrait overlays (live in-game)

The 9 comm-screen states (§AC.5.5) consume per-character
portrait overlays at runtime. The portrait variants needed for
this surface are:

| comm-screen state | portrait variant used |
|---|---|
| `idle` | none (archetype-glyph only) |
| `call_in` | Elara `expression_focused` thumbnail at corner |
| `call_out` | The Human at current reveal stage (4 progressive thumbnails) |
| `audit_in_progress` | Mechronis Auditor `silhouette` thumbnail |
| `narrative_silence` | apprentice's `silhouette` thumbnail |
| `warden_line_tap` | Warden Veil-7 `silhouette` thumbnail (cyber-cyan corruption-pink corner indicator) |
| `mourning_call` | fallen apprentice's `expression_doctrinal` thumbnail (the doctrine they died bound to) |
| `cohort_banter` | cohort-mate's `expression_neutral` thumbnail at corner |
| `commons_phone_mode` | live-feed sub-zone (no character overlay; sub-zone backdrop only) |

All thumbnails for these states are derived from the §AC.10.3–§AC.10.8
existing render set; **no new portrait renders needed**, just
runtime composition.

### §AC.10.11 Cutscene-side portrait usage (cross-reference)

Every cutscene in §AC.2 + §AC.7 consumes one or more portrait
references for character consistency. Cross-reference:

| cutscene group | portrait set consumed |
|---|---|
| §AC.2.1 archetype recruit (12) | profile_hero per archetype × gender; backdrop rendered fresh per cut |
| §AC.2.2 archetype graduation (12) | profile_hero + expression_triumphant per archetype × gender |
| §AC.2.3 archetype obituary (12) | silhouette + expression_doctrinal per archetype × gender |
| §AC.7.1 doctrine binding (5+1) | expression_doctrinal per chosen-doctrine archetype |
| §AC.7.2 audits (38) | profile_hero per archetype + Mechronis_auditor full set; Day-21 also Warden full set |
| §AC.7.3 forge (14) | expression_focused per archetype + signature card render |
| §AC.7.4 memory card (24) | expression_doctrinal per archetype + memory card mint/burn render |
| §AC.7.5 cohort + park (10) | profile_hero per active + training_a + training_b (3 apprentices in frame) |
| §AC.7.6 Warden's Dock (6) | Warden full set + apprentice expression_focused |
| §AC.7.7 missions (51) | profile_hero per deployed apprentice + Quartermaster full set + role-zone backdrop |
| §AC.7.8 berths (80) | profile_hero per archetype/recruit + per-phase activity sprite (separate atlas, §AC.5.1) |
| §AC.7.9 comm-screen (9) | composition only (per §AC.10.10) |
| §AC.7.10 guild common rooms (60) | Archon Professor full set per guild + parametric guild-member backgrounds |

### §AC.10.12 Total character-art deliverables (cumulative)

| group | renders |
|---|---|
| 12 archetypes × 2 genders × 11 assets | 264 |
| 5 named recruits × 11 assets | 55 |
| Inspector Veil-7 × 11 | 11 |
| 12 Archon Professors × 11 | 132 |
| Mechronis Auditor × 5 (no expressions) | 5 |
| Quartermaster × 11 | 11 |
| Cohort group portrait (per cycle, 1 per save) | parametric |
| Doctrine slip × 5 | 5 |
| Audit transcript × 36 | 36 |
| Mission dossier folio × 29 | 29 |
| Memory card × 24 (12 mint + 12 burn) | 24 |
| Signature card × 216 (12 × 6 effect-slots × 3 corruption-bands) | 216 |
| Cohort-roster + Mourning-wall brass plaques × 48 | 48 |
| **TOTAL CHARACTER-FACED ART RENDERS** | **836** |

### §AC.10.13 Reference-image bundle convention (NB2 best practice)

Per Nano Banana 2 character-consistency research:
- **Master face render first** per archetype × gender (24 master
  faces) — these are the canonical face references that all
  subsequent renders for that archetype × gender link back to.
- **≤5 distinct characters per ref bundle** in any single NB2
  call; for ensemble shots (cohort group portrait, Warden Dock
  scene with 2 characters, etc.) this is the limit.
- **Trait-lock** by reusing the §AC.10.2 / §AC.10.7 / §AC.10.8
  visual-identity strings VERBATIM in every prompt — this is
  what produces the "same person across every render" outcome.
- **Reference-image bundle** for each downstream render: the
  master face + 1 environment ref + (optional) 1 wardrobe ref;
  3-image bundle is the canonical workflow.

CDN convention for master-face references:

```
cdn/client-public/art/portraits/_masters/
├── apprentice_zealot_female_master_face.png
├── apprentice_zealot_male_master_face.png
├── apprentice_ghost_female_master_face.png
├── apprentice_ghost_male_master_face.png
├── ...                                         (24 total apprentice masters)
├── recruit_vex_solene_master_face.png
├── recruit_wraith_calder_master_face.png
├── recruit_locke_master_face.png
├── recruit_jericho_jones_master_face.png
├── recruit_akai_shi_master_face.png
├── warden_veil7_master_face.png
├── archon_<house_id>_master_face.png × 12
├── mechronis_auditor_master_face.png   (the brass mask itself)
└── quartermaster_master_face.png
```

Production-side, master faces are generated FIRST as a
production-art batch before any other portrait or cutscene
render is started. This is the gating step.

### §AC.10.14 Storage + cost estimate (character art only)

| metric | value |
|---|---|
| character renders | 836 |
| avg render size | 6 MB (1080×1080 PNG) — 18 MB for 4K (2:3) and 3:4 — average 8 MB |
| total raw storage | ~6.7 GB |
| NB2 generation cost (est. $0.04/image) | ~$33 |
| audio post for portraits | n/a (portraits are static) |

### §AC.10.15 Outstanding TBDs (character art)

- Per-archetype × per-gender naming-convention for non-binary
  parametric variants — runtime mixes male+female master faces
  at runtime; production-side does NOT need separate non-binary
  master renders.
- Audit-transcript per-archetype × per-day artifact (36 renders)
  needs apprentice profile_hero + Auditor silhouette
  composition lock — production-side workflow can composite at
  paste-up (each transcript is profile_hero + cipher-script
  body + Auditor signature in three layers).
- Recruit's Wraith Calder's "scratched-out photograph" carried
  in his breast pocket (per §AC.10.7 visual identity) is a
  diegetic reveal at Act-5 (per `_PRODUCTION_CROSS_CUT.md`
  cs_wraith_e2_betrayal_reveal narrative-tie); the photograph's
  contents (Game Master's younger form) is a separate authoring
  task — out of scope for this section.
- 4 Warden's-candidate apprentices (per `apprenticeWarden.ts`)
  inherit existing apprentice archetype × gender renders + a
  Warden-livery overlay (greyscale wash + brass-coin lapel-pin)
  — overlay is a runtime compositing task, not a separate
  render batch.

End of §AC.10.

---

## §AC.11 Apprentice canon — 12 named apprentices (species × class × origin)

This section establishes the **canon character description** for
each of the 12 apprentice archetypes. The user-mandated lore
shape: **steampunk + cyberpunk + occult**, with apprentices
distributed across three species (Quarchon / Demagi / Human)
and a class roster covering Spy / Assassin / Soldier / Engineer
/ Oracle / Priest / Scholar / Diplomat / Smuggler / Healer /
Warlock.

**This canon is authoritative and supersedes the §AC.10.2 visual-
identity strings.** Every downstream cutscene, NB2 prompt, dialog
line, and artifact-render uses these canon names + species
+ class + visual identity verbatim.

The 5 named recruits (Vex Solène / Wraith Calder / Locke /
Jericho Jones / Akai Shi) are **not affected** — their canon is
locked at §AC.10.7 and remains canonical.

### §AC.11.0 Species + class distribution

```
Demagi:  Zealot, Revenant, Oracle, Martyr, Heretic           (5 of 12)
Quarchon: Ghost, Artisan, Jester                              (3 of 12)
Human:   Scholar, Wanderer, Sentinel, Prodigal               (4 of 12)

Class roster (12 distinct):
  Priest:        Zealot
  Spy:           Ghost
  Scholar:       Scholar
  Soldier:       Revenant
  Engineer:      Artisan
  Oracle:        Oracle
  Smuggler:      Wanderer
  Healer:        Martyr
  Warlock:       Heretic
  Diplomat-Spy:  Jester
  Sentinel:      Sentinel
  Smuggler-Heir: Prodigal
```

### §AC.11.A Species visual cues (trait-lock; reuse verbatim)

```yaml
Demagi:
  skin:        "faint occult-violet tint, most visible at the temples and
                along the line of the jaw"
  morphology:  "a thin dorsal ridge of soft chitin running from the nape of
                the neck down between the shoulder blades; visible above any
                collar that sits below the neck"
  eyes:        "iris carries a faint inner ring of cyber-cyan around the
                pupil; sclera slightly off-white toward parchment-cream"
  occult_mark: "every Demagi carries one chalk-glyph somewhere on the body —
                usually traced along the inner forearm or behind one ear;
                parametric to bound Hierarchy faction"
  voice_mark:  "a faint sub-harmonic 8 Hz drone under their speaking voice"

Quarchon:
  skin:        "pale-grey with a subtle metallic sheen at high points (cheek-
                bones, brow-ridge, knuckles) — brass dust polished into skin"
  morphology:  "small cyber-mechanical inserts in canonical positions —
                neural-jack port at one temple, brass-rim aperture-iris
                around one eye; remaining anatomy is biological"
  eyes:        "one eye is mechanical (brass-rim aperture iris that visibly
                contracts/expands), one is biological (any natural colour);
                the mechanical eye is always the same side per individual"
  occult_mark: "Quarchon do not carry occult markers natively; if a Quarchon
                binds an occult doctrine, marker = a small fiber-optic-thread
                tattoo at the wrist, lit cyber-cyan when active"
  voice_mark:  "a faint mechanical click on every plosive consonant"

```yaml
Human:
  skin:        "natural human range — no morphological cues; the apprentice is
                identified as Human at first glance only by the absence of
                Demagi or Quarchon markers"
  morphology:  "no canonical inserts; any cyber-mechanical augmentation is
                acquired (not born), and signals individual history rather
                than species"
  eyes:        "natural human range; no inner ring, no aperture-iris"
  occult_mark: "Humans bind occult markers only through deliberate ritual;
                marker takes the form of a tattooed cipher-glyph at the
                inner wrist or behind one ear"
  voice_mark:  "no species marker; baseline human cadence"
```


### §AC.11.1 Zealot — **Kareth Vael-Drumm**

```yaml
canonical_name:    "Kareth Vael-Drumm"
species:           Demagi
class:             Priest
faction_origin:    Pureflame
home_zone:         "Pureflame Cell A-7, Hidden Pureflame Cell sector"
age:               24
gender_default:    female (male variant per `apprentice-zealot-male-lines.json`)
defining_incident: "At seventeen, Kareth was the only initiate to walk
                    out of Cell A-7's Day-of-Ash ritual still breathing —
                    the cell's chant-master had set the brazier-floor
                    alight as a 'devotion test.' Twelve died. Kareth
                    walked out with a spiral-shaped burn across the
                    right brow and an unwavering belief that the
                    Hierarchy is not the answer but the only path
                    that does not lie about being fire."
distinguishing_trait: "spiral burn-scar across right brow; eyes lit
                    from within when speaking scripture; carries the
                    chant-master's brass scripture-medallion (taken
                    from his neck after the fire died) — the medallion
                    is dim until Kareth recites the Compliant Mouth
                    binding stanza, at which point it ignites cyber-cyan"
voice_mark:        "Demagi 8 Hz sub-harmonic + a slight rasp from
                    smoke damage to the throat; speaks slowly,
                    enunciates carefully"
relationship_hooks: |
  - knows the Hierarchy Throne attendant by name (her older sister
    Issa Vael-Drumm; never referenced in dialog unless the player
    asks)
  - distrusts Inspector Veil-7 on sight (Mechronis purged her cell)
  - bonds easily with Martyr (recognises the same self-giving)
  - resonance pair: Zealot ↔ Martyr
visual_identity: |
  a Demagi priest-aspirant in their mid-twenties; faint occult-violet
  tint at the temples and along the jawline; a thin dorsal chitin ridge
  visible above the cassock collar at the nape of the neck; iris
  carries a faint inner ring of cyber-cyan around the pupil; a brass-
  bound cassock with cyber-cyan stitched scripture-cipher running down
  the seam; a single brass scripture-medallion on a chain at chest
  (dim until binding stanza); close-cropped hair; a spiral-shaped
  burn-scar across the right brow; gas-mantle aureole effect rim-
  lighting the head when speaking scripture; chalk-glyph tracing the
  Pureflame faction along the inner left forearm
master_face_seed: 190001 (female), 190002 (male)
```

### §AC.11.2 Ghost — **Sira Null-Echo**

```yaml
canonical_name:    "Sira Null-Echo"
species:           Quarchon
class:             Spy / Assassin
faction_origin:    Panopticon (defected)
home_zone:         "Panopticon Ruins (former assignment); current resident of the Ark"
age:               29
gender_default:    female
defining_incident: "Sira was conscripted into the Panopticon's Silent
                    Corps at age twelve — her vocal cords replaced
                    with a silent-modulation cog-implant, her voice
                    locked to whisper-only by mechanical override.
                    For seventeen years she watched, recorded, and
                    erased. At twenty-nine she watched her handler
                    Glenmar Veil-2 be purged on the Day-21 audit
                    of his own apprentice. She left the same night
                    on a stolen courier and arrived at the Ark with
                    no luggage and the audio-recorder pendant Glenmar
                    had tried to mail to his wife."
distinguishing_trait: "her left eye is the mechanical Quarchon
                    aperture-iris; her right is biological grey-
                    blue; she has never raised her voice in living
                    memory; the audio-recorder pendant at her throat
                    plays Glenmar's last message in a continuous
                    silent loop — only the LED on the recorder
                    pulses to indicate it is running"
voice_mark:        "Quarchon plosive-click + a permanent whisper
                    from the Silent Corps cog-implant; if she
                    chooses to speak above whisper, the implant
                    audibly grinds (decision-cost signal)"
relationship_hooks: |
  - hates the Warden's faction (her handler's purger was Mechronis-
    aligned)
  - silent watch toward Sentinel — they share watch-shifts on
    nightwatch by mutual silent agreement
  - resonance pair: Ghost ↔ Oracle
visual_identity: |
  a Quarchon assassin in her late twenties; pale-grey skin with brass-
  dust sheen at cheekbones and brow-ridge; left eye is a brass-rim
  aperture-iris that visibly contracts when threat is sensed; right
  eye is biological grey-blue; charcoal-grey gambeson with brass
  clasps; a half-mask covering the lower face in brass with cyber-
  cyan inlay; only the eyes visible above the mask; high cheekbones;
  gloved hands always at rest at sides; a small audio-recorder pendant
  at the throat (silent-loop LED pulsing every 4.0 s); small fiber-
  optic-thread tattoo at the right wrist (dormant unless occult
  doctrine bound)
master_face_seed: 190003 (female), 190004 (male — note: male variant
  named Sirov Null-Echo, otherwise canon-identical)
```

### §AC.11.3 Scholar — **Tien Ceadrune**

```yaml
canonical_name:    "Tien Ceadrune"
species:           Human
class:             Scholar
faction_origin:    Chronarchive Vault (Empire-aligned)
home_zone:         "Chronarchive Vault sector"
age:               38
gender_default:    female
defining_incident: "Tien spent eighteen years in the Chronarchive
                    Vault's restoration wing, specialising in pre-
                    Empire cipher-script restoration. At thirty-six
                    she lost the left index finger to a binding
                    accident with a mimic-codex (the codex grew teeth
                    when she touched the wrong page). She has since
                    refused replacement augmentation — she wants to
                    feel the absence. She came to the apprentice
                    cohort because the Vault's master-archivist
                    discovered that Tien's mother had been a Game
                    Master alumna; the Vault asked her to leave
                    quietly."
distinguishing_trait: "missing left index finger (no replacement);
                    ink-stained fingertips on the surviving four
                    fingers; brass-rim reading-glasses pushed up on
                    the brow; carries a small leather-bound cipher-
                    notebook at all times; her marginalia have been
                    cited in three pre-Empire scholarly journals
                    (one of which is in Tidewater Archive)"
voice_mark:        "soft, scholarly, slightly distracted; tends to
                    finish other people's sentences then immediately
                    apologise"
relationship_hooks: |
  - knows Locke (Tier-2 recruit) from old archive correspondence;
    they have never met in person
  - Heretic finds her insufferable but they cannot stop talking
  - resonance pair: Scholar ↔ Heretic
visual_identity: |
  a Human academic in her late thirties; cipher-stained leather coat
  over a parchment-cream tunic; brass-rim reading-glasses pushed up
  on the brow; ink-stained fingertips on right hand and surviving
  four fingers of left hand (left index finger is absent — bare
  knuckle visible); an open book held against the chest in left hand
  (always); a pen behind the right ear; eyes that seem to be reading
  even in conversation; a small leather-bound cipher-notebook at the
  belt; no species occult marker (Human baseline)
master_face_seed: 190005 (female), 190006 (male)
```

### §AC.11.4 Revenant — **Bohl-Mor Krellix**

```yaml
canonical_name:    "Bohl-Mor Krellix"
species:           Demagi
class:             Soldier
faction_origin:    Empire 12th Legion
home_zone:         "Veridian VI battlefield (died there); restored on
                    a Forward Bastion black-market clone-bench"
age:               31 (apparent); died at 30
gender_default:    male
defining_incident: "Bohl-Mor died at the Battle of Veridian VI
                    holding a corridor for forty-three minutes
                    while his squad evacuated three civilians.
                    Six months later a black-market resurrectionist
                    on a Forward Bastion clone-bench restored him
                    from harvested essence and a stolen Hierarchy
                    sigil-circle. He woke remembering his death.
                    Seventy-three percent of his pre-death memories
                    survived; the missing twenty-seven percent
                    includes his wife's name and the colour of his
                    daughter's eyes. He came to the Ark because the
                    Empire 12th Legion will not accept a restored
                    soldier on the rolls and the Hierarchy will not
                    accept anything else."
distinguishing_trait: "visible scarification in cipher-script along
                    the inside of both forearms (the resurrectionist's
                    work); one eye is milky-white from past damage;
                    the other is lit faint cyber-cyan from clone-
                    bench phototherapy; a permanent thin bandage
                    around the left wrist (covers the original
                    death-wound's clone-scar); breath audible even
                    in stillness"
voice_mark:        "Demagi 8 Hz sub-harmonic plus a slight rasp from
                    a damaged windpipe (the original cause of death
                    was a thrown brass spike to the throat); pauses
                    mid-sentence as if listening for breath he no
                    longer needs"
relationship_hooks: |
  - the only apprentice who remembers dying; this gives him weight
    when he speaks of the Hierarchy
  - bonded with Sentinel (both were soldiers); shares nightwatch
  - distrustful of Hellbox Clone Bench (§AC.1.5) on principle —
    he does not want a second resurrection
  - resonance pair: Revenant ↔ Sentinel
visual_identity: |
  a Demagi infantry sergeant in his early thirties; faint occult-
  violet tint at temples; a thin dorsal chitin ridge above the
  collar at the nape; iris carries cyber-cyan inner ring (more
  pronounced on the unscarred right eye; left eye is milky-white);
  iron-grey robe over leather; visible scarification in cipher-
  script along the inside of both forearms; a small bandage
  permanently wrapped around the left wrist; chalk-glyph tracing
  the Empire 12th Legion sigil along the inner right forearm
  (dim — Empire is dead to him now)
master_face_seed: 190007 (male), 190008 (female — variant Bohla-Mor)
```

### §AC.11.5 Artisan — **Pellix Vaun-Brass**

```yaml
canonical_name:    "Pellix Vaun-Brass"
species:           Quarchon
class:             Engineer
faction_origin:    Skyforge Plateau (independent)
home_zone:         "Skyforge Plateau workshop"
age:               26
gender_default:    male
defining_incident: "Pellix grew up in the Skyforge Plateau clockmaker
                    caste — a five-generation Quarchon family
                    specialising in cog-mechanism resonance work.
                    At eighteen he was offered conscription into
                    Mechronis Academy (academy seekers had identified
                    him as 'unusual aptitude'). He refused. The
                    Mechronis answer was to revoke his caste licence
                    in retaliation. Pellix went freelance, took
                    contracts from Insurgency cells (under-the-table),
                    and built three custom resonance-rifles for
                    Free Ports brokers before being recommended for
                    the apprentice cohort by a Free Ports contact."
distinguishing_trait: "his Quarchon mechanical eye is the right
                    (most Quarchon are left); cog-mechanism brass
                    goggles permanently pushed up on the forehead;
                    machine-oil and brass-dust on the fingertips;
                    a cog-mechanism wristwatch on the right wrist
                    that he built himself at age fourteen (still
                    runs to the second); always has a small project
                    on the workbench (rotates per cohort cycle)"
voice_mark:        "Quarchon plosive-click + slight Skyforge accent
                    (the Plateau dialect is known for clipping
                    consonants); speaks while looking at the work,
                    not the listener"
relationship_hooks: |
  - refuses to work with Mechronis-purged components
  - admires Vex Solène (Tier-2 recruit) silently — they have
    never been introduced; Pellix knows her work from blueprint
    leaks
  - resonance pair: Artisan ↔ Sentinel
visual_identity: |
  a Quarchon engineer in his mid-twenties; pale-grey skin with brass
  dust at cheekbones and brow-ridge; right eye is a brass-rim
  aperture-iris (the unusual side); left eye is biological dark-
  brown; cog-mechanism brass goggles pushed up on the forehead;
  ink and machine-oil staining the fingertips; a cog-mechanism
  wristwatch on the right wrist; a leather apron with 24 brass
  tool-loops at the chest; eyes always slightly distant — looking
  at the project, not the viewer; small fiber-optic-thread tattoo
  at the left wrist (cyber-cyan when active)
master_face_seed: 190009 (male), 190010 (female)
```

### §AC.11.6 Oracle — **Aevel of the Five Gates**

```yaml
canonical_name:    "Aevel of the Five Gates"
species:           Demagi
class:             Oracle
faction_origin:    Tidewater Archive (Dreamers-aligned)
home_zone:         "Tidewater Archive submerged library"
age:               33
gender_default:    female
defining_incident: "Aevel was raised by the Tidewater Archive's
                    Five-Gate Order — a sect of Demagi seers who
                    train in cipher-tongue interpretation by
                    submersion (the seer is held underwater for
                    increasing periods until they begin to dream
                    awake). Aevel reached the fifth gate at age
                    twenty-four; the sixth gate is rumoured but
                    no one returns from it. She read the Game
                    Master's true birth-name in a tea-leaf reading
                    at age thirty and the Order asked her to leave
                    'for her own protection.' She does not believe
                    in coincidence."
distinguishing_trait: "her left eye is permanently 30 minutes
                    ahead of her right eye in perceiving time —
                    she sometimes responds to questions before
                    they are asked; carries a deck of cipher-tarot
                    cards everywhere (54-card deck, hand-painted);
                    a neural-jack port at the temple (rare for a
                    Demagi — installed during the Five-Gate ritual
                    to record dream-trance)"
voice_mark:        "Demagi 8 Hz sub-harmonic + a faint underwater-
                    pressure quality (a permanent acoustic shift
                    from years of submerged training); pauses
                    sometimes mid-sentence to look at something
                    no one else can see"
relationship_hooks: |
  - knows Sira Null-Echo's audio-recorder pendant carries Glenmar's
    last message — has never said so aloud
  - sees Inspector Veil-7's true face in tarot readings — one
    card shows him without the brass nameplate
  - resonance pair: Oracle ↔ Ghost
visual_identity: |
  a Demagi seeress in her early thirties; faint occult-violet tint
  at temples; thin dorsal chitin ridge at nape; iris carries cyber-
  cyan inner ring (left eye 30 minutes ahead of right — visibly
  asynchronous when she blinks); a velvet hooded cloak with cyber-
  cyan threading through the seams; a single silver tarot-card
  visible in the right hand (drawn at random per render); one eye
  slightly larger than the other; a neural-jack port at the right
  temple (visible beneath the hood); chalk-glyph tracing the Five-
  Gate Order along the inside of the right wrist (lit cyan when she
  is mid-vision)
master_face_seed: 190011 (female), 190012 (male — variant Aevor)
```

### §AC.11.7 Wanderer — **Roon Calpha**

```yaml
canonical_name:    "Roon Calpha"
species:           Human
class:             Smuggler / Scout
faction_origin:    Free Ports
home_zone:         "Free Ports outer ring (orphan)"
age:               27
gender_default:    male
defining_incident: "Roon was orphaned at eight when Hierarchy
                    raiders collapsed a market dome on top of
                    his parents. He was hidden in a cargo-container
                    by his older sister Tava (who died in the dome
                    collapse) and was found by a Insurgency
                    smuggler the next day. He grew up running
                    cargo for the Insurgency, learned six trade
                    routes from memory, and stole a brass walking-
                    stick that doubles as a folding pneumatic-rifle
                    from a Hierarchy bishop at sixteen. He came
                    to the apprentice cohort because his Insurgency
                    handler was killed and the apprentice trial is
                    a kind of cover for someone whose face is on
                    eight bounty boards."
distinguishing_trait: "carries a brass walking-stick that doubles
                    as a folding pneumatic-rifle (pneumatic stock
                    visible if examined closely); sun-and-storm-
                    weathered skin; one earring (small brass hoop —
                    matches Prodigal's; coincidence not narrative
                    bond... yet); a small leather map-pouch at the
                    hip with six maps of trade routes drawn from
                    memory; never quite still"
voice_mark:        "baseline human cadence; Free Ports street-
                    accent (drops the final consonant on most
                    words); laughs easily but never at himself"
relationship_hooks: |
  - shares a brass earring with Prodigal — neither has noticed,
    both will notice at Day-14 if cohort routes them through the
    same triangle event
  - distrusts Sentinel (Sentinel's old unit raided Free Ports)
  - resonance pair: Wanderer ↔ Prodigal
visual_identity: |
  a Human smuggler in his late twenties; dust-stained travelling
  cloak over a Free Ports tradesman's tunic; sun-and-storm-weathered
  skin; one small brass hoop earring; a brass walking-stick at the
  side (folding pneumatic-rifle stock visible at the handle); a
  small leather map-pouch at the right hip; never quite still —
  the cloak suggests the figure was about to step away; no species
  occult marker (Human baseline)
master_face_seed: 190013 (male), 190014 (female — variant Rona)
```

### §AC.11.8 Martyr — **Iva-Marl Sinder**

```yaml
canonical_name:    "Iva-Marl Sinder"
species:           Demagi
class:             Healer / Priest
faction_origin:    Remembrance Archive (Hierarchy-aligned)
home_zone:         "Remembrance Archive medical wing"
age:               29
gender_default:    female
defining_incident: "Iva-Marl trained as a redirect-rune trauma
                    surgeon — Demagi medicine that channels harm
                    away from the wound and into a sacrificial
                    redirect-target (usually the surgeon's own
                    body, briefly). She has six redirect-scars
                    from saving five patients and one stranger.
                    Her defining incident was when she
                    voluntarily took the place of a Pureflame
                    conscript on a Hierarchy death-row run — the
                    conscript was nineteen and pregnant. Iva-Marl
                    survived; the run was a clerical error. The
                    Hierarchy classified her as 'unstable for
                    surgical duty' and routed her here."
distinguishing_trait: "six visible redirect-rune scars in cipher-
                    script along the chest, sternum, and forearms
                    (positions corresponding to redirected
                    wounds); a permanent bandage-roll across the
                    chest worn like a sash (the seventh redirect
                    is folded and waiting); both palms permanently
                    faintly raised in open posture; eyes wet with
                    concern when speaking to anyone wounded; a
                    small redirect-rune brass plate stitched over
                    the heart (functional — not decorative)"
voice_mark:        "Demagi 8 Hz sub-harmonic + a soft, careful
                    cadence; speaks like she is closing a wound"
relationship_hooks: |
  - carries the rescued conscript's letter of thanks (folded in
    the bandage-roll); references it once on Day-17 if cohort
    hits a low-cohesion band
  - bonds with Zealot (both Pureflame-adjacent)
  - quietly horrified by Heretic's chalkboard — but sits with
    him at meals anyway
  - resonance pair: Martyr ↔ Zealot
visual_identity: |
  a Demagi healer in her late twenties; faint occult-violet tint
  at temples; thin dorsal chitin ridge at nape; iris carries
  cyber-cyan inner ring; a pale gambeson with a bandage-roll
  across the chest like a sash; both palms permanently faintly
  raised (open posture); a small redirect-rune brass plate
  stitched over the heart; eyes wet with concern; a thin scar
  across one cheek (the eldest of the six redirect-scars);
  chalk-glyph tracing the Hierarchy redirect-discipline along
  the inner left wrist
master_face_seed: 190015 (female), 190016 (male — variant Iv-Marl)
```

### §AC.11.9 Heretic — **Caedex Vorr**

```yaml
canonical_name:    "Caedex Vorr"
species:           Demagi
class:             Warlock / Scholar
faction_origin:    House of Ledger (expelled)
home_zone:         "House of Ledger guild rooms (expelled); current
                    apprentice on the Ark"
age:               34
gender_default:    male
defining_incident: "Caedex was a senior alumnus of the House of
                    Ledger guild before Professor Quill expelled
                    him for asking — in full guild assembly —
                    whether the Game Master's classroom rule had
                    ever been written down or whether it was
                    invented retroactively after each game. The
                    question itself was treason in House of Ledger.
                    Caedex was stripped of his guild-pin, his
                    alumni-roster entry was etched out, and he
                    was given six hours to leave the guild rooms.
                    He carries a chalkboard fragment with his
                    original heresy still legible (he scraped it
                    off the wall on his way out)."
distinguishing_trait: "carries a chalkboard fragment in a leather
                    sling at the hip — the original heresy still
                    legible: 'WHO WROTE IT FIRST' (16 chars); a
                    brass debate-bell suppressed in the left hand
                    (cloth muffler — once a House of Ledger
                    tradition, now a personal token); chalk-dust
                    permanently on the fingertips; eyes amused,
                    slightly sceptical"
voice_mark:        "Demagi 8 Hz sub-harmonic + a House of Ledger
                    formal cadence (the trained alumni cadence
                    — slow, precise, with subordinate clauses);
                    occasionally pauses to laugh at his own
                    questions"
relationship_hooks: |
  - hates Professor Quill (House of Ledger Archon); will refuse
    any cohort routing through that guild common room
  - sparring partner with Scholar (Tien Ceadrune); they argue
    about cipher-script provenance for hours
  - secretly afraid of Oracle's tarot readings (he does not
    want to know what she sees about him)
  - resonance pair: Heretic ↔ Scholar
visual_identity: |
  a Demagi questioner in his mid-thirties; faint occult-violet
  tint at temples; thin dorsal chitin ridge at nape; iris carries
  cyber-cyan inner ring (the inner ring is unusually thick on him
  — Order theorists believe heretical thought intensifies the
  Demagi cyber-cyan ring); a black robe with cipher-script in
  chalk dust along the hem; one ear visible (cocked, listening);
  a brass debate-bell suppressed in the left hand (cloth muffler);
  chalk-dust on the fingertips; a chalkboard fragment in a
  leather sling at the hip; chalk-glyph tracing 'EXPELLED' along
  the inner right wrist (House of Ledger ritual mark, retained)
master_face_seed: 190017 (male), 190018 (female — variant Caede Vorr)
```

### §AC.11.10 Jester — **Vex'rah Halflaugh**

```yaml
canonical_name:    "Vex'rah Halflaugh"
species:           Quarchon
class:             Diplomat / Spy
faction_origin:    Empire (children's puppeteer; recruited to
                    Panopticon at age 19)
home_zone:         "Empire entertainment circuit; Panopticon HQ
                    until age 23; current Ark resident"
age:               25
gender_default:    non-binary (default; gendered variants exist)
defining_incident: "Vex'rah was Empire's most gifted child-show
                    puppeteer at sixteen — the kind whose touring
                    lifted morale in Frontier garrison towns.
                    Panopticon recruited her at nineteen for
                    her articulation-grade lip-reading skill
                    (she could read at fifty paces through a
                    pane of glass). She spent four years lip-
                    reading high-value targets in Empire dining-
                    rooms while telling jokes children loved.
                    At twenty-three she lip-read her brother's
                    name on an assassination-list and asked
                    Panopticon to remove him from the list. They
                    declined. She left the next morning with the
                    list folded inside her motley-cloak."
distinguishing_trait: "her cog-implant articulates speech
                    suspiciously well — she is the only Quarchon
                    in the cohort whose plosive-click is barely
                    audible (Panopticon-grade calibration); a
                    half-smile that does not reach the eyes; a
                    small brass skull-headed staff (children's-
                    puppet origin); bells on the cuffs (silenced
                    — cloth-muffled); a single retort-card
                    visible in the right hand (rotates per cohort
                    cycle)"
voice_mark:        "Quarchon plosive-click (suppressed); voices
                    Vex'rah uses include three Empire-court
                    accents and one perfect imitation of
                    Inspector Veil-7 (saved for the Day-14 dock
                    cut, if the player's heretical_quiet doctrine
                    + cohort triangulation align)"
relationship_hooks: |
  - watches everyone (lip-reads at distance); says nothing about
    what she has read
  - bonded with Revenant (he reminds her of her brother — they
    look nothing alike; the bond is the part she cannot name)
  - hates the Warden's faction (her brother's name was on
    Panopticon's list)
  - resonance pair: Jester ↔ Revenant
visual_identity: |
  a Quarchon court-spy in their mid-twenties; pale-grey skin with
  brass dust at high points; left eye is a brass-rim aperture-iris;
  right eye is biological hazel; a motley cloak with asymmetric
  panels of brass / leather / parchment; a small brass skull-
  headed staff at the side; a half-smile that does not reach the
  eyes; bells on the cuffs (cloth-muffled); a single retort-card
  in the right hand (parametric); fiber-optic-thread tattoo at
  the right wrist (cyber-cyan when active — usually when lip-
  reading)
master_face_seed: 190019 (non-binary default), 190020 (male),
                  190021 (female)
```

### §AC.11.11 Sentinel — **Marcus Farrow**

```yaml
canonical_name:    "Marcus Farrow"
species:           Human
class:             Sentinel / Soldier
faction_origin:    Imperial Guard (honorably discharged)
home_zone:         "Forward Bastion (14 years stationed); current
                    Ark resident"
age:               42
gender_default:    male
defining_incident: "Marcus served fourteen years on the Forward
                    Bastion as Imperial Guard, with a clean
                    service record until the seventh year of his
                    tour, when his unit executed a wrongful
                    sentence — the man they shot was not the
                    insurgent the warrant named. Marcus filed
                    the after-action report. The Empire honoured
                    him with discharge papers and a brass-bound
                    commendation. He has not displayed the
                    commendation. He took the apprentice cohort
                    because the bunkroom is small and quiet and
                    he can see the door from the bunk."
distinguishing_trait: "a brass-bound commendation visibly carried
                    in his pocket (folded; never displayed); a
                    siren-key on a lanyard at the chest (never
                    used; would summon a Bastion garrison that
                    no longer exists); one gloved hand always on
                    the hilt of a sheathed brass-bladed knife;
                    eyes that scan the horizon even indoors"
voice_mark:        "baseline human cadence; clipped Imperial-Guard
                    formal-address (he addresses everyone by rank,
                    even cohort apprentices — Cadet Vael-Drumm,
                    Cadet Null-Echo, Cadet Vorr); speaks reluctantly
                    about the wrongful execution — never names
                    the victim"
relationship_hooks: |
  - bonds with Revenant (they talk about death without flinching)
  - watches Wanderer warily — Wanderer's smuggling-routes overlap
    with Bastion patrol-routes; they have not crossed paths
  - the only apprentice who has read every line of the Hierarchy
    code-of-arms — out of professional duty
  - resonance pair: Sentinel ↔ Revenant
visual_identity: |
  a Human ex-Imperial-Guard sergeant in his early forties; brass-
  armoured tunic with cyber-cyan piping along the seams (Imperial-
  Guard issue); a watch-cap with brass insignia (faded — the unit
  insignia is no longer official); eyes scanning the horizon
  (slightly off-camera even in portraits); a brass siren-key on
  a lanyard at the chest; one gloved hand always resting on the
  hilt of a sheathed brass-bladed knife; no species occult marker
  (Human baseline); a small Imperial-Guard service-medallion at
  the lapel above the siren-key (unpolished)
master_face_seed: 190022 (male), 190023 (female — variant Marcia)
```

### §AC.11.12 Prodigal — **Lord Avern Thessler**

```yaml
canonical_name:    "Lord Avern Thessler"
species:           Human
class:             Smuggler-Heir / Diplomat
faction_origin:    Trade Empire shipping-house (heir; vanished six
                    years; lived as Free Ports broker under fake
                    name 'Ren Calpha')
home_zone:         "Thessler Shipping-house, New Babylon Core
                    Tier 12 (heir); current apprentice on the
                    Ark"
age:               28
gender_default:    male
defining_incident: "Avern was the heir to a small Trade Empire
                    shipping-house; at twenty-two he disappeared
                    on the night of his betrothal-ceremony. For
                    six years he lived in the Free Ports outer
                    ring as 'Ren Calpha' — broker, fence, occasional
                    Insurgency contact. He returned at twenty-
                    eight to claim the apprentice trial as
                    anonymity from his House (which assumed him
                    dead). He has not told his House he is alive.
                    The brass earring he wears matches Wanderer's
                    — they shared a Free Ports rooming-house wall
                    for two years and never met face to face."
distinguishing_trait: "a signet ring on the right hand (Thessler
                    crest; visibly removed and re-placed many
                    times — the ring is dull on its inside face
                    where his thumb touches it); one earring
                    (small brass hoop, Free Ports outer-ring
                    standard issue — matches Wanderer's exactly);
                    a half-empty leather coin-purse at the belt
                    (Free Ports brass mixed with Empire silver —
                    the mix gives him away to anyone who watches);
                    eyes downcast or slightly averted"
voice_mark:        "baseline human cadence; vocal-shift mid-sentence
                    between New Babylon court-formal and Free
                    Ports outer-ring street; tells about which
                    voice he uses for which cohort-mate (formal
                    for Sentinel, street for Wanderer, neutral
                    for Scholar)"
relationship_hooks: |
  - shares the brass earring with Wanderer (Roon Calpha) — at
    Day-14 if cohort triangulates, both will recognise the
    earring and realise they shared a wall
  - avoids Inspector Veil-7 (Thessler shipping has Mechronis
    audit history; his face matches the missing-heir bulletin)
  - resonance pair: Prodigal ↔ Wanderer
visual_identity: |
  a Human noble in his late twenties; travel-worn formal cloak
  over a once-fine tunic; a signet ring on the right hand
  (Thessler crest; dull where the thumb touches); one small
  brass hoop earring (matching Wanderer); eyes downcast or
  slightly averted; a half-empty leather coin-purse at the belt
  (mixed Free Ports brass + Empire silver coins visible);
  weather-worn but the bones-of-the-face are still aristocratic;
  no species occult marker (Human baseline)
master_face_seed: 190024 (male), 190025 (female — variant Lady
                  Avern Thessler; same canon)
```

### §AC.11.13 Canon-propagation policy

**Authority hierarchy** (when reading downstream sections that
reference apprentices):

1. §AC.11 canon entry — TAKES PRECEDENCE
2. §AC.10.2 visual identity strings — superseded by §AC.11
   `visual_identity` blocks
3. §AC.10.3–§AC.10.6 NB2 prompts — must reference §AC.11
   `canonical_name` and `master_face_seed` (the seed table here
   replaces the earlier §AC.10.5 placeholder seed range)

**Naming convention** in cutscenes / dialog / prompts: full name
on first reference per scene, given name (or Quarchon-style
clan-fragment) thereafter. E.g. "Kareth Vael-Drumm" → "Kareth";
"Sira Null-Echo" → "Sira" or "Null-Echo" (her preferred);
"Bohl-Mor Krellix" → "Bohl-Mor"; "Lord Avern Thessler" → "Avern"
(intimate) or "Thessler" (formal).

**VO manifest update requirement**: the existing 24 archetype-
gender VO manifests (`apprentice-<archetype>-<gender>-lines.json`,
shipped per PR #517) carry no canonical names — they are
parametric. Production-side action: add a `canonical_name` field
at the top of each manifest pointing to §AC.11; downstream
audio-post pipeline reads the canon name when assembling
dialog.

**Relationship-hook resonance pair bindings** (new): the §AC.7.5
`cs_park_cohort_resonance_<archetype_pair>` cuts now have
named resonance pairs per §AC.11.x relationship_hooks:

```
Zealot ↔ Martyr      (Pureflame + Hierarchy-redirect; faith resonance)
Ghost ↔ Oracle        (silent + sees-ahead; surveillance resonance)
Scholar ↔ Heretic     (cited + expelled; question resonance)
Revenant ↔ Sentinel   (death-witnesses; soldier resonance)
Artisan ↔ Sentinel    (this is a SECOND resonance pair for Sentinel —
                       Sentinel resonates with both Revenant AND
                       Artisan; runtime picks based on current
                       cohesion state)
Wanderer ↔ Prodigal   (the brass earring match — Day-14 reveal)
Jester ↔ Revenant     (the brother-shaped silence)
```

The 6 representative resonance-pair templates from §AC.7.5 are
now locked to these 6 pairs (Sentinel-Revenant takes priority
over Sentinel-Artisan when both are eligible).

### §AC.11.14 Apprentice face/look variants — randomized at instantiation

The §AC.11.1–§AC.11.12 canon entries lock **canonical name +
species + class + defining incident + visual identity baseline**.
This section adds **multiple racial-complexion / face / backstory-
microbeat variants per archetype × gender** so the runtime can
pick a randomized presentation per cohort cycle. Each variant
inherits the canon entry's species, class, age, defining incident,
and signature-object loadout — only the body, face, complexion,
and a small backstory-microbeat shift between variants.

**Production rule:** every variant has its own master-face NB2
seed. The 11-asset downstream batch (§AC.10.3) is generated per
variant, so a player who recruits "Zealot female variant B" gets
a different face than another player who recruited "Zealot female
variant A" — but both are canonically Kareth Vael-Drumm with
the same scripture-medallion, the same A-7 burn-scar story, the
same voice-mark.

**Total variants authored**: 12 archetypes × 2 genders × 3 variants
= **72 variant looks**. Production renders 72 master faces +
72 × 11 downstream assets = **864 apprentice character renders**
(replaces the §AC.10.12 count of 264 with the 3-variant
expansion).

The 5 named recruits (Vex Solène / Wraith Calder / Locke / Jericho
Jones / Akai Shi) are **not affected** — their canon and faces
remain locked to the §AC.10.7 single-variant identity.

#### §AC.11.14.1 Zealot — Kareth Vael-Drumm (3 female + 3 male variants)

```yaml
zealot_female_a:
  ethnicity_cue: "Pureflame creche of the inner colonies; warm-olive
                  skin with the canonical occult-violet undertone at
                  temples and along the jaw; faint Demagi dorsal ridge
                  visible above the cassock collar"
  hair:          "close-cropped raven-black with slight natural wave;
                  smoke-singed ends never fully grown out"
  face_shape:    "oval; high cheekbones; full lower lip; the spiral
                  burn-scar across the right brow is keloid (raised
                  pale ridge against the olive skin)"
  age_visible:   24
  backstory_microbeat: "the daughter of Cell A-7's chant-master; the
                  one who took her father's medallion off his neck
                  while the brazier-floor still burned"
  master_face_seed: 190001
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_zealot_female_a_master_face.png

zealot_female_b:
  ethnicity_cue: "Pureflame outer-frontier descent; pale pearl-grey skin
                  with strong occult-violet wash at the temples (almost
                  bruise-coloured); pronounced Demagi dorsal ridge"
  hair:          "shaved at the sides with a thin rope-braid down the
                  centre, ash-blonde with cyber-cyan thread woven near
                  the nape"
  face_shape:    "narrow heart-shape; sharp jaw; ice-blue eyes with
                  pronounced cyber-cyan inner ring; the spiral scar is
                  thin and silver against the pale skin"
  age_visible:   24
  backstory_microbeat: "raised by an aunt after her cell's chant-master
                  was purged by the Hierarchy six years before A-7;
                  has worn the medallion only since the fire"
  master_face_seed: 190001a
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_zealot_female_b_master_face.png

zealot_female_c:
  ethnicity_cue: "Pureflame Cell A-7 was a multi-creche; this variant
                  is a Far-South Demagi descent with deep umber-brown
                  skin overlaid with the violet undertone (cooler at
                  temples, warmer at cheeks)"
  hair:          "tightly coiled black, pulled back into a scripture-
                  knot at the crown of the head; one cyber-cyan thread
                  woven through the knot"
  face_shape:    "round face; soft jaw; wide-set dark eyes; the spiral
                  scar is a faint hyperpigmented mark just visible
                  above the brow"
  age_visible:   24
  backstory_microbeat: "the only one in the cell who could read the
                  pre-Empire scripture-cipher on the medallion before
                  the fire — taught herself at thirteen from a
                  smuggled archive"
  master_face_seed: 190001b
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_zealot_female_c_master_face.png

zealot_male_a:
  ethnicity_cue: "Pureflame creche, central-empire descent; warm-tan
                  skin with the violet undertone; mid-density Demagi
                  dorsal ridge"
  hair:          "close-cropped chestnut-brown, slightly receding at
                  the temples; smoke-singed at the back of the neck"
  face_shape:    "rectangular; pronounced brow; deep-set eyes with
                  cyber-cyan inner ring; the spiral burn-scar is
                  raised keloid against tan skin; faint stubble"
  age_visible:   24
  backstory_microbeat: "youngest of three brothers in Cell A-7; both
                  brothers died in the fire; he keeps their two
                  smaller medallions on the same chain as the chant-
                  master's"
  master_face_seed: 190002
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_zealot_male_a_master_face.png

zealot_male_b:
  ethnicity_cue: "Pureflame north-frontier descent; pale skin with
                  cool-violet undertone at temples; very pronounced
                  dorsal ridge that visibly displaces the cassock
                  collar"
  hair:          "shaved entirely; cyber-cyan scripture-cipher tattooed
                  across the back of the skull (visible as he bows
                  his head in prayer)"
  face_shape:    "long jaw; thin mouth; pale grey eyes; the spiral
                  burn-scar runs from the right brow up over the
                  shaved scalp (uniquely visible because of the
                  shave)"
  age_visible:   24
  backstory_microbeat: "scripture-cipher across the skull was tattooed
                  the morning after the fire — his decision, not
                  the cell's; the tattoo includes the names of the
                  twelve who died"
  master_face_seed: 190002a
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_zealot_male_b_master_face.png

zealot_male_c:
  ethnicity_cue: "Pureflame Far-East Demagi descent; rich olive-bronze
                  skin with the violet undertone tracing along the
                  cheekbones rather than the temples; medium dorsal
                  ridge"
  hair:          "shoulder-length black, pulled into a low scripture-
                  knot at the nape; ember-orange thread woven into
                  the knot (Pureflame mark — kept after the fire)"
  face_shape:    "diamond face; angular cheekbones; full lower lip;
                  amber-flecked dark eyes; the spiral scar runs
                  through the right brow into the hairline"
  age_visible:   24
  backstory_microbeat: "the cell's youngest scripture-reader; his
                  voice has the trained Pureflame chant-cadence (a
                  separate VO manifest cluster — the singing-voice
                  variant)"
  master_face_seed: 190002b
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_zealot_male_c_master_face.png
```

#### §AC.11.14.2 Ghost — Sira Null-Echo (3 female + 3 male variants)

```yaml
ghost_female_a:
  ethnicity_cue: "Quarchon Panopticon-creche; pale-grey skin with brass
                  dust at cheekbones, brow-ridge, and knuckles; the
                  brass dust is most concentrated at the temples
                  (Panopticon's Silent Corps ritual application)"
  hair:          "close-cropped silver-black, asymmetric (longer left
                  side, shaved right side where the neural-jack
                  port is)"
  face_shape:    "narrow oval; high cheekbones; sharp chin; left eye
                  is the brass-rim aperture-iris (mid-aperture
                  default), right eye is biological grey-blue with
                  no occult inner ring (Quarchon baseline)"
  age_visible:   29
  backstory_microbeat: "her pre-Silent-Corps name (before her vocal
                  cords were replaced) is in a sealed dossier at
                  Panopticon HQ — she has never told it to anyone"
  master_face_seed: 190003
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_ghost_female_a_master_face.png

ghost_female_b:
  ethnicity_cue: "Quarchon Free-Ports-descent (rare; most Quarchon are
                  Empire-aligned); pale-grey skin with green-blue
                  undertone at the throat (a marker of Free Ports
                  Quarchon manufacturing); brass dust uneven —
                  applied in irregular maintenance rather than
                  ritual"
  hair:          "shoulder-length pale-blonde with cyber-cyan ends;
                  the asymmetric cut is hidden under the longer
                  hair on the right side"
  face_shape:    "rounded oval; soft cheekbones; full mouth (a Free
                  Ports Quarchon body design — the manufacturers
                  prioritised passing-as-Human ability); right eye
                  is the aperture-iris (rare side; flagged her as
                  'unusual' during Panopticon recruitment)"
  age_visible:   29
  backstory_microbeat: "Free-Ports-manufactured Quarchon, then sold
                  on into Empire service; the Silent Corps cog-implant
                  was retrofitted onto Free Ports anatomy and clicks
                  louder than standard"
  master_face_seed: 190003a
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_ghost_female_b_master_face.png

ghost_female_c:
  ethnicity_cue: "Quarchon Empire-Inner-Ring; the most uniform brass
                  dust application (Panopticon's elite calibration);
                  skin tone is the canonical pale-grey with no
                  undertone"
  hair:          "fully shaved; the bare scalp shows the canonical
                  Quarchon temple-port scar plus an inscribed cipher
                  along the right occiput (Silent Corps service
                  number — visible because the head is fully shaved)"
  face_shape:    "narrow heart-shape; sharp brow; thin lips; left
                  eye aperture-iris with high-end Panopticon
                  calibration (visible micro-articulation in the
                  iris-leaves); a faint scar at the corner of the
                  mouth from a calibration error in childhood"
  age_visible:   29
  backstory_microbeat: "served the longest of the three variants —
                  20 years in Silent Corps; her cog-implant has
                  developed a personal idiosyncrasy (a barely-
                  audible thrum when she lies; she has learned to
                  not lie)"
  master_face_seed: 190003b
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_ghost_female_c_master_face.png

ghost_male_a:
  ethnicity_cue: "Quarchon Empire-Outer-Ring; pale-grey skin, even
                  brass dust application; mechanical eye on the
                  left (canonical)"
  hair:          "close-cropped charcoal-black, deliberate stubble
                  growth (looks like he forgot to shave; he didn't)"
  face_shape:    "rectangular; strong jaw; deep-set eyes; thin scar
                  along the left jaw from a knife in a back alley
                  (he was the one who ended the fight; that detail
                  isn't his backstory)"
  age_visible:   29
  backstory_microbeat: "the male variant's pre-Silent-Corps name
                  (Sirov) was the name of his father — unrelated;
                  the Corps assigns names from a registry"
  master_face_seed: 190004
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_ghost_male_a_master_face.png

ghost_male_b:
  ethnicity_cue: "Quarchon Free-Ports-descent variant (matches the
                  female_b ethnic cue); pale-grey with green-blue
                  throat; brass dust uneven"
  hair:          "asymmetric — longer left, shaved right; the
                  shaved right side shows the temple-port and a
                  Free Ports manufacturer's serial-number tattoo"
  face_shape:    "soft jaw; wide cheekbones; full mouth; left
                  aperture-iris is older-design (visible bezel
                  wear)"
  age_visible:   29
  backstory_microbeat: "the only Free-Ports-manufactured Quarchon
                  in the Silent Corps cohort of his year; was
                  the only survivor of his cohort's first
                  assignment"
  master_face_seed: 190004a
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_ghost_male_b_master_face.png

ghost_male_c:
  ethnicity_cue: "Quarchon Empire-Inner-Ring (matches female_c);
                  uniform brass dust; cipher along the occiput
                  scalp"
  hair:          "fully shaved; the cipher-inscription on the
                  scalp is visible from any angle"
  face_shape:    "narrow rectangular; pronounced brow; thin
                  lips; pale grey biological right eye"
  age_visible:   29
  backstory_microbeat: "the longest-serving Silent Corps assassin
                  to have defected; his service number on the
                  occiput is the lowest in the cohort (Panopticon
                  numbers low = senior)"
  master_face_seed: 190004b
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_ghost_male_c_master_face.png
```

#### §AC.11.14.3 Scholar — Tien Ceadrune (3 female + 3 male variants)

```yaml
scholar_female_a:
  ethnicity_cue: "Human, Inner-Empire descent; warm-tan skin; no
                  species occult marker; ink-stains on right four
                  fingers (left index missing)"
  hair:          "shoulder-length brown with grey at the temples
                  (early-greying; she was thirty when it started);
                  loose; one strand always escaping the brass-rim
                  reading-glasses pushed up on the brow"
  face_shape:    "oval; soft cheekbones; warm-brown eyes; thin
                  scar along the left palm where the missing
                  finger used to attach"
  age_visible:   38
  backstory_microbeat: "her mother's Game Master alumna entry was
                  redacted from House of Ledger archives — Tien
                  found a single citation in a margin note"
  master_face_seed: 190005
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_scholar_female_a_master_face.png

scholar_female_b:
  ethnicity_cue: "Human, Far-North descent; pale skin with cold
                  undertone; very small freckles across the nose
                  and cheeks (faded with age); no species occult
                  marker"
  hair:          "long ash-blonde, almost-grey with prominent silver
                  streaks; pulled back into a low knot; the brass
                  reading-glasses are pushed up on the knot itself"
  face_shape:    "long oval; aquiline nose; pale-blue eyes; the
                  missing-finger scar is more pronounced (younger
                  injury than the canon — she was 33 when it
                  happened, not 36)"
  age_visible:   38
  backstory_microbeat: "the mimic-codex incident was at Tidewater
                  Archive (variant) — she has been a guest there
                  three times since; once she helped Aevel of the
                  Five Gates with a cipher-translation"
  master_face_seed: 190005a
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_scholar_female_b_master_face.png

scholar_female_c:
  ethnicity_cue: "Human, Far-South descent; deep umber-brown skin;
                  small mole at the corner of the right eye; no
                  species occult marker"
  hair:          "tightly-coiled black with grey at the temples;
                  pulled back into two small knots at the nape;
                  brass-rim reading-glasses pushed up on the brow"
  face_shape:    "round face; soft jaw; warm dark eyes; the missing-
                  finger scar is faint (well-healed)"
  age_visible:   38
  backstory_microbeat: "spent seven years cataloguing pre-Empire
                  Far-South cipher-script before the Chronarchive
                  asked her to leave; she took copies of her
                  catalogue with her — they live in the leather
                  notebook at her belt"
  master_face_seed: 190005b
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_scholar_female_c_master_face.png

scholar_male_a:
  ethnicity_cue: "Human, Inner-Empire (matches female_a ethnic);
                  warm-tan skin; ink-stained right four fingers
                  (left index missing)"
  hair:          "salt-and-pepper, swept back; receding at the
                  temples; brass reading-glasses on the bridge
                  of the nose (worn, not pushed up)"
  face_shape:    "rectangular; strong jaw; warm-brown eyes; well-
                  groomed beard with grey accents"
  age_visible:   42
  backstory_microbeat: "the male variant is named Tien Caedrune
                  (note alternate spelling — a brother registry
                  variant; Chronarchive accepted both); his Game
                  Master alumna was his older sister"
  master_face_seed: 190006
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_scholar_male_a_master_face.png

scholar_male_b:
  ethnicity_cue: "Human, Far-North descent; pale skin; faded
                  freckles; pale-blue eyes"
  hair:          "long iron-grey, tied back at the nape; clean-
                  shaven; brass reading-glasses pushed up on the
                  brow; a pen permanently behind the right ear"
  face_shape:    "long oval; aquiline nose; thin lips; pale-blue
                  eyes that have read everything"
  age_visible:   45
  backstory_microbeat: "older variant — has been at Chronarchive
                  for 25 years; was offered tenure six times,
                  declined six times; finally asked to leave"
  master_face_seed: 190006a
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_scholar_male_b_master_face.png

scholar_male_c:
  ethnicity_cue: "Human, Far-South descent; deep umber-brown skin;
                  small chin scar (childhood); brown eyes"
  hair:          "shaved short; greying at the sides; clean-shaven;
                  brass reading-glasses on the bridge of the nose"
  face_shape:    "round face; soft jaw; warm dark eyes; the missing
                  left index finger is the most-recent injury (six
                  months pre-cohort)"
  age_visible:   38
  backstory_microbeat: "his catalogue is the smallest of the three
                  scholar variants — he was younger to the wing
                  and had less time; what he has is meticulously
                  cross-referenced"
  master_face_seed: 190006b
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_scholar_male_c_master_face.png
```

#### §AC.11.14.4 Revenant — Bohl-Mor Krellix (3 male + 3 female variants)

```yaml
revenant_male_a:
  ethnicity_cue: "Demagi Empire-Central; faint occult-violet at
                  temples; pronounced dorsal chitin ridge above
                  iron-grey collar; cyber-cyan inner ring on right
                  eye (left eye milky-white)"
  hair:          "close-cropped iron-grey at the temples,
                  brown-black at the crown; smoke-singed ends never
                  fully grown out"
  face_shape:    "rectangular; pronounced brow; weather-worn skin;
                  visible scarification cipher-script along the
                  inside of both forearms; small bandage permanently
                  wrapped around the left wrist"
  age_visible:   31 (apparent); died at 30
  backstory_microbeat: "his daughter's name was Mira; he remembers
                  this; he doesn't remember her eye colour"
  master_face_seed: 190007
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_revenant_male_a_master_face.png

revenant_male_b:
  ethnicity_cue: "Demagi Empire-East; deeper olive-tan skin; the
                  occult-violet undertone is most visible along
                  the jawline; mid-density dorsal ridge"
  hair:          "long black hair (just-grew-back-after-death length
                  — clone-bench restoration regrew his hair from
                  scalp follicles); pulled back into a soldier's
                  short tail"
  face_shape:    "diamond face; angular cheekbones; deep-set eyes;
                  scarification cipher is more elaborate than
                  variant_a (the resurrectionist who restored him
                  was more skilled)"
  age_visible:   31 (apparent)
  backstory_microbeat: "his wife's name was Lera; he remembers
                  this; what he doesn't remember is the seven
                  years before they met"
  master_face_seed: 190007a
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_revenant_male_b_master_face.png

revenant_male_c:
  ethnicity_cue: "Demagi Empire-North; pale skin with cool occult-
                  violet at temples; wider, more pronounced dorsal
                  ridge"
  hair:          "shaved entirely; the scalp shows the cipher-
                  scarification continuing across (a clone-bench
                  ritual signature); a thin scar along the right
                  ear from the brass spike that killed him"
  face_shape:    "long jaw; thin mouth; pale grey biological
                  eyes (right eye has the cyber-cyan ring; left
                  is clouded white)"
  age_visible:   31 (apparent)
  backstory_microbeat: "his squad-mates' names: Henn, Kross, Tela,
                  Gris, Vorr-Mar; he remembers all five; he is
                  the only one who returned"
  master_face_seed: 190007b
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_revenant_male_c_master_face.png

revenant_female_a:
  ethnicity_cue: "Demagi Empire-Central; same descent as male_a
                  (variant Bohla-Mor)"
  hair:          "long black, pulled into a soldier's tight bun;
                  smoke-singed at the ends"
  face_shape:    "oval; high cheekbones; the cyber-cyan ring is
                  more pronounced on her than on male variants
                  (Demagi female biology runs the inner ring
                  thicker on average)"
  age_visible:   31 (apparent)
  backstory_microbeat: "her partner's name was Vael; she
                  remembers this; what she doesn't remember is
                  the song they used to sing together"
  master_face_seed: 190008
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_revenant_female_a_master_face.png

revenant_female_b:
  ethnicity_cue: "Demagi Empire-East; same descent as male_b"
  hair:          "shoulder-length black with a single grey streak
                  at the right temple (clone-bench scar — restoration
                  regrows hair imperfectly)"
  face_shape:    "diamond; angular; the bandage on the left wrist
                  is replaced regularly (the clone-scar weeps when
                  the weather changes)"
  age_visible:   31 (apparent)
  backstory_microbeat: "her squad's banner was the only thing
                  that survived Veridian VI intact; she found it
                  three months after restoration in a Free Ports
                  pawnshop and bought it back"
  master_face_seed: 190008a
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_revenant_female_b_master_face.png

revenant_female_c:
  ethnicity_cue: "Demagi Empire-North; same descent as male_c"
  hair:          "shaved entirely; the cipher-scarification visible
                  on the scalp"
  face_shape:    "long oval; thin lips; pale grey eyes; the death-
                  wound scar at the throat is the most visible
                  on this variant (she was killed differently —
                  a thrown blade rather than a brass spike)"
  age_visible:   31 (apparent)
  backstory_microbeat: "the clone-bench resurrectionist who
                  restored her was Demagi (rare); she remembers
                  his face though they have never spoken since"
  master_face_seed: 190008b
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_revenant_female_c_master_face.png
```

#### §AC.11.14.5 Artisan — Pellix Vaun-Brass (3 male + 3 female variants)

```yaml
artisan_male_a:
  ethnicity_cue: "Quarchon Skyforge clockmaker caste; canonical
                  pale-grey with brass dust at cheekbones, brow-
                  ridge, knuckles; right-side mechanical eye (his
                  family's distinguishing trait — clockmaker caste
                  installs on the dominant-hand side)"
  hair:          "shoulder-length copper-brown with brass thread
                  woven near the nape (clockmaker caste mark);
                  cog-mechanism brass goggles permanently pushed
                  up on the forehead"
  face_shape:    "rectangular; strong jaw; deep-set eyes; weather-
                  worn fingertips with permanent ink and machine-
                  oil staining"
  age_visible:   26
  backstory_microbeat: "his family workshop was three generations
                  in the same Skyforge bay; the caste licence
                  number on his back-of-neck tattoo is 4423"
  master_face_seed: 190009
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_artisan_male_a_master_face.png

artisan_male_b:
  ethnicity_cue: "Quarchon Skyforge but Far-South descent (rare
                  combination); pale-grey skin with subtle warm
                  undertone (Skyforge southern shops use a
                  different brass-dust ritual application)"
  hair:          "close-cropped copper-grey, shaved on the right
                  side where the mechanical eye is mounted (his
                  variant's mechanical eye is recent — he had a
                  workshop accident at age 22 and replaced the
                  damaged biological eye; canon mech-eye-side
                  was right by family tradition, also
                  coincidentally the side he lost)"
  face_shape:    "diamond face; angular cheekbones; the right
                  side of the face is slightly thinner (residual
                  scarring from the accident)"
  age_visible:   26
  backstory_microbeat: "his accident at 22 took the eye and his
                  brother (the brother died in the same accident);
                  the cog-mechanism wristwatch he built at 14
                  was given to him by that brother — he wears it
                  on the right wrist out of grief"
  master_face_seed: 190009a
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_artisan_male_b_master_face.png

artisan_male_c:
  ethnicity_cue: "Quarchon Skyforge Far-North; pale-grey with cool
                  blue undertone at the throat; brass dust uneven
                  (his shop used minimal ritual)"
  hair:          "shoulder-length pale-grey with cyber-cyan thread
                  near the temples; brass goggles pushed up"
  face_shape:    "long oval; pronounced brow; pale-grey biological
                  left eye, brass aperture-iris right eye"
  age_visible:   26
  backstory_microbeat: "his shop refused conscription so visibly
                  that Mechronis sent inspectors twice; the
                  inspectors took the third-generation founder's
                  cog-vice with them as 'evidence'; he has built
                  himself a replacement, slightly better than the
                  original"
  master_face_seed: 190009b
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_artisan_male_c_master_face.png

artisan_female_a:
  ethnicity_cue: "Quarchon Skyforge clockmaker caste; same descent
                  as male_a"
  hair:          "long copper-brown braided down the back with
                  brass beads; cog-mechanism goggles on the brow"
  face_shape:    "oval; soft cheekbones; warm hazel biological
                  left eye, brass aperture-iris right eye"
  age_visible:   26
  backstory_microbeat: "her family expected her to take over the
                  shop; she said no; she still sends a brass-
                  bound letter every six weeks"
  master_face_seed: 190010
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_artisan_female_a_master_face.png

artisan_female_b:
  ethnicity_cue: "Quarchon Skyforge Far-South; pale-grey with warm
                  undertone (matches male_b)"
  hair:          "shoulder-length copper, asymmetric (longer left,
                  shaved right where the recent mech-eye sits);
                  brass goggles"
  face_shape:    "diamond; angular cheekbones; the right side of
                  the face still shows accident scarring; full
                  mouth"
  age_visible:   26
  backstory_microbeat: "her brother (matching male_b's brother)
                  was her twin; her grief takes a different shape
                  — she works longer hours at the bench than any
                  other variant"
  master_face_seed: 190010a
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_artisan_female_b_master_face.png

artisan_female_c:
  ethnicity_cue: "Quarchon Skyforge Far-North; pale-grey with
                  cool throat (matches male_c)"
  hair:          "long pale-grey braided with cyber-cyan thread;
                  brass goggles pushed up"
  face_shape:    "long oval; sharp brow; pale-grey biological
                  left eye, brass aperture-iris right eye"
  age_visible:   26
  backstory_microbeat: "she designed the cog-vice replacement her
                  brother (male_c variant) built; she signed her
                  initials in micro-cipher on the underside of
                  the vice — even Mechronis would not see it
                  unless they took the vice apart"
  master_face_seed: 190010b
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_artisan_female_c_master_face.png
```

#### §AC.11.14.6 Oracle — Aevel of the Five Gates (3 female + 3 male variants)

```yaml
oracle_female_a:
  ethnicity_cue: "Demagi Tidewater descent; faint occult-violet at
                  temples; thin dorsal chitin ridge; the cyber-
                  cyan inner ring is most pronounced on her left
                  eye (the 30-minutes-ahead eye)"
  hair:          "long black, loose under the velvet hood; cyber-
                  cyan thread braided into a single side-strand;
                  damp-looking from the underwater training"
  face_shape:    "oval; soft cheekbones; full lips; the left eye
                  visibly slightly larger (the Five-Gate ritual
                  asymmetry); a neural-jack port at the right
                  temple"
  age_visible:   33
  backstory_microbeat: "her tea-leaf reading of the Game Master's
                  birth-name was witnessed by three other seers;
                  one of them disappeared the next month, one
                  recanted the witness, the third sent her this
                  hooded cloak (Order's secret support)"
  master_face_seed: 190011
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_oracle_female_a_master_face.png

oracle_female_b:
  ethnicity_cue: "Demagi Tidewater Far-East descent; rich olive
                  skin with violet wash along cheekbones; mid
                  dorsal ridge; cyber-cyan ring thicker than
                  baseline (Five-Gate ritual intensifies it)"
  hair:          "shaved at the sides, long black braid down the
                  centre with five cyber-cyan threads (one per
                  gate she has crossed)"
  face_shape:    "diamond face; angular jaw; amber-flecked dark
                  eyes; the left-eye time-lag is harder to see
                  on her (the eye is steady; the lag is in her
                  voice)"
  age_visible:   33
  backstory_microbeat: "she crossed the fifth gate alone — the
                  Order does not officially permit solo crossings;
                  her solo scarification (a small Cipher-T mark
                  on the left collarbone) is the only visible
                  proof"
  master_face_seed: 190011a
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_oracle_female_b_master_face.png

oracle_female_c:
  ethnicity_cue: "Demagi Tidewater Far-South descent; deep brown
                  skin with cool occult-violet wash at the temples;
                  cyber-cyan ring is the brightest of the variants
                  (the Far-South ritual application uses pigment
                  in the iris)"
  hair:          "tightly coiled black with grey at the temples;
                  pulled back into a damp-looking knot; the
                  underwater-training residue is visible as a
                  faint salt-rim along the hairline"
  face_shape:    "round face; soft jaw; warm dark eyes; the
                  asymmetric eye is more visible in repose"
  age_visible:   33
  backstory_microbeat: "the oldest of the three female variants —
                  was already at the second gate when the Empire
                  collapsed her cell's outer-ring branch (cell
                  is a Pureflame term, but Tidewater Order uses
                  it adjacently)"
  master_face_seed: 190011b
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_oracle_female_c_master_face.png

oracle_male_a:
  ethnicity_cue: "Demagi Tidewater (matches female_a); name
                  variant Aevor (canon-equivalent)"
  hair:          "shoulder-length black, loose under the hood;
                  damp-looking; one cyber-cyan side-thread"
  face_shape:    "rectangular; soft brow; full lower lip; left
                  eye larger asymmetry; neural-jack port at right
                  temple"
  age_visible:   33
  backstory_microbeat: "he was the youngest member of his Five-
                  Gate cohort; the seers older than him have all
                  either disappeared or recanted — he is the
                  last living witness of his cohort's training"
  master_face_seed: 190012
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_oracle_male_a_master_face.png

oracle_male_b:
  ethnicity_cue: "Demagi Tidewater Far-East (matches female_b)"
  hair:          "long black with five cyber-cyan thread-braids;
                  damp-look; partial dorsal ridge visible at
                  nape"
  face_shape:    "diamond; angular; amber-flecked dark eyes;
                  collarbone scarification visible above an
                  open-collar tunic (when the cloak parts)"
  age_visible:   33
  backstory_microbeat: "his solo fifth-gate crossing was witnessed
                  by Aevel female_b — they are the only two who
                  have done it; they have never met but they
                  know about each other"
  master_face_seed: 190012a
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_oracle_male_b_master_face.png

oracle_male_c:
  ethnicity_cue: "Demagi Tidewater Far-South (matches female_c)"
  hair:          "shaved short with grey at the sides; the
                  underwater-training salt-rim visible at the
                  hairline"
  face_shape:    "round face; soft jaw; warm dark eyes; the
                  cyber-cyan ring is brightest of all male
                  variants; lips slightly parted in the
                  half-trance state"
  age_visible:   33
  backstory_microbeat: "the only male oracle variant who has
                  asked the Order to be returned to the second
                  gate (he is the most willing to step backward;
                  he says forward is the wrong direction)"
  master_face_seed: 190012b
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_oracle_male_c_master_face.png
```

#### §AC.11.14.7 Wanderer — Roon Calpha (3 male + 3 female variants)

```yaml
wanderer_male_a:
  ethnicity_cue: "Human Free-Ports outer-ring; sun-and-storm-
                  weathered olive-tan skin; one small brass hoop
                  earring (left ear)"
  hair:          "short brown with sun-bleached tips; perpetual
                  stubble"
  face_shape:    "rectangular; weather-worn; warm-brown eyes;
                  small scar along the left cheek (from a Free
                  Ports knife in his teens)"
  age_visible:   27
  backstory_microbeat: "his sister Tava's name is etched on the
                  inside of the brass walking-stick handle; he
                  has never told another living soul what is
                  etched there"
  master_face_seed: 190013
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_wanderer_male_a_master_face.png

wanderer_male_b:
  ethnicity_cue: "Human Far-North descent (Free-Ports adjacent);
                  pale skin with sun-darkening on the forearms
                  and forehead; freckles across nose"
  hair:          "shoulder-length sandy-blonde, pulled into a
                  rough tail at the nape; clean-shaven"
  face_shape:    "long oval; aquiline nose; pale-blue eyes;
                  weathered around the eyes from years of
                  squinting at horizons"
  age_visible:   27
  backstory_microbeat: "his collection of route-maps is the
                  largest of the variants — sixteen routes from
                  memory; he can recite any of them at any
                  moment"
  master_face_seed: 190013a
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_wanderer_male_b_master_face.png

wanderer_male_c:
  ethnicity_cue: "Human Far-South descent; deep umber-brown skin;
                  small mole at the corner of the left eye"
  hair:          "tightly-curled black with sun-bleached fringe;
                  short; small brass hoop earring on the right
                  ear (mirrors variant_a's left-side hoop —
                  symmetry quirk)"
  face_shape:    "round face; soft jaw; warm-brown eyes; full
                  lower lip; small scar across the right brow
                  (Free Ports market fight when he was twelve)"
  age_visible:   27
  backstory_microbeat: "his Insurgency handler had a daughter
                  named Tava — coincidence; the smuggler refused
                  to use her name out of superstition; she ended
                  up as the cohort's quartermaster's
                  granddaughter (out of scope for this doc)"
  master_face_seed: 190013b
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_wanderer_male_c_master_face.png

wanderer_female_a:
  ethnicity_cue: "Human Free-Ports outer-ring; warm-tan skin;
                  one small brass hoop earring (left ear); name
                  variant Rona Calpha"
  hair:          "shoulder-length brown with sun-bleached tips;
                  pulled into a smuggler's loose tail; small
                  braid behind the right ear"
  face_shape:    "oval; soft cheekbones; warm-brown eyes; small
                  cheek scar mirror of male_a"
  age_visible:   27
  backstory_microbeat: "her sister Tav (different spelling) died
                  in the dome collapse — her sister's name is
                  also etched in the walking-stick"
  master_face_seed: 190014
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_wanderer_female_a_master_face.png

wanderer_female_b:
  ethnicity_cue: "Human Far-North descent (matches male_b);
                  pale; freckles"
  hair:          "long sandy-blonde, mostly tied back; clean
                  freckled forehead"
  face_shape:    "long oval; aquiline nose; pale-blue eyes;
                  weathered fine-line around the eyes"
  age_visible:   27
  backstory_microbeat: "the only variant who has personally
                  walked the smuggler's route across the
                  northern ice — three weeks alone with the
                  walking-stick"
  master_face_seed: 190014a
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_wanderer_female_b_master_face.png

wanderer_female_c:
  ethnicity_cue: "Human Far-South (matches male_c); deep umber-
                  brown skin; small mole at corner of left eye"
  hair:          "tightly-curled black, kept short; brass hoop
                  on right ear (mirrors variant_a's left side —
                  same symmetry quirk)"
  face_shape:    "round face; soft jaw; warm-brown eyes; full
                  lower lip; thin scar across the right brow"
  age_visible:   27
  backstory_microbeat: "her brother (variant_c's male equivalent)
                  is also alive; she does not know this; the
                  cohort might cross their paths during a Day-7
                  resonance event"
  master_face_seed: 190014b
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_wanderer_female_c_master_face.png
```

#### §AC.11.14.8 Martyr — Iva-Marl Sinder (3 female + 3 male variants)

```yaml
martyr_female_a:
  ethnicity_cue: "Demagi Remembrance Archive descent (Hierarchy-
                  aligned); faint occult-violet at temples; thin
                  dorsal ridge; cyber-cyan inner ring on both eyes"
  hair:          "shoulder-length black with one early-grey
                  streak at the right temple (a Hierarchy-redirect
                  side-effect); pulled back loose"
  face_shape:    "oval; soft cheekbones; warm hazel eyes; thin
                  scar across the left cheek (the eldest of the
                  six redirect-scars); both palms permanently
                  faintly raised"
  age_visible:   29
  backstory_microbeat: "the rescued conscript wrote her a letter
                  every year for seven years; the seventh letter
                  is folded inside the bandage-roll across her
                  chest"
  master_face_seed: 190015
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_martyr_female_a_master_face.png

martyr_female_b:
  ethnicity_cue: "Demagi Remembrance Archive Far-East descent;
                  rich olive skin with violet wash along jawline;
                  pronounced dorsal ridge"
  hair:          "long black braid down the back with brass-
                  rim redirect-rune beads woven through (one
                  bead per redirect-scar — six beads)"
  face_shape:    "diamond face; angular cheekbones; amber-
                  flecked dark eyes; the cheek scar is more
                  prominent on her (better-healed, but bigger)"
  age_visible:   29
  backstory_microbeat: "she is the only Martyr variant who has
                  successfully redirected a fatal wound from a
                  cohort-mate (during a training exercise; the
                  cohort-mate was Bohl-Mor variant_b — they have
                  a private bond about this)"
  master_face_seed: 190015a
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_martyr_female_b_master_face.png

martyr_female_c:
  ethnicity_cue: "Demagi Remembrance Archive Far-South descent;
                  deep brown skin with cool occult-violet at
                  temples; mid dorsal ridge"
  hair:          "tightly-coiled black with grey at the temples;
                  pulled into a knot at the nape; the bandage
                  sash crosses the chest under the hair-knot"
  face_shape:    "round face; soft jaw; warm-brown eyes;
                  redirect-scars more diffuse (Far-South tradition
                  spreads the scar over a larger area)"
  age_visible:   29
  backstory_microbeat: "she carries seven redirect-scars (one
                  more than canon — the seventh was a quiet
                  redirect during a Hierarchy execution she
                  was not authorised to interrupt; she did
                  anyway; the warrant was wrong)"
  master_face_seed: 190015b
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_martyr_female_c_master_face.png

martyr_male_a:
  ethnicity_cue: "Demagi Remembrance Archive (matches female_a);
                  name variant Iv-Marl"
  hair:          "close-cropped black with the right-temple grey
                  streak; clean-shaven"
  face_shape:    "rectangular; pronounced brow; warm hazel eyes;
                  the left-cheek scar is more visible on him
                  (less-padded face)"
  age_visible:   29
  backstory_microbeat: "his rescued-conscript was a man (the male
                  variant's narrative is parallel; the rescued
                  remains parametric)"
  master_face_seed: 190016
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_martyr_male_a_master_face.png

martyr_male_b:
  ethnicity_cue: "Demagi Remembrance Archive Far-East (matches
                  female_b)"
  hair:          "long black, pulled into a low tail with the six
                  redirect-rune beads"
  face_shape:    "diamond; angular cheekbones; amber-flecked
                  dark eyes"
  age_visible:   29
  backstory_microbeat: "the male variant_b also redirected a
                  fatal wound from a cohort-mate during training
                  — but the cohort-mate was a different person
                  (the Revenant male_a variant); the bond is
                  parallel"
  master_face_seed: 190016a
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_martyr_male_b_master_face.png

martyr_male_c:
  ethnicity_cue: "Demagi Remembrance Archive Far-South (matches
                  female_c)"
  hair:          "shaved short with grey at the sides;
                  redirect-scars visible at the side of the
                  scalp (Far-South tradition tattoos a mirror-
                  rune on the side of the head rather than the
                  scalp interior)"
  face_shape:    "round face; soft jaw; warm-brown eyes;
                  diffuse redirect-scars"
  age_visible:   29
  backstory_microbeat: "the only Martyr variant who has not yet
                  redirected (he is at six redirect-scars and
                  has not taken the seventh — the bandage sash
                  carries the seventh, folded, waiting; it will
                  be used during cohort cycle's second Mission
                  return event for a critical NPC)"
  master_face_seed: 190016b
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_martyr_male_c_master_face.png
```

#### §AC.11.14.9 Heretic — Caedex Vorr (3 male + 3 female variants)

```yaml
heretic_male_a:
  ethnicity_cue: "Demagi Inner-Empire scholar descent; faint
                  occult-violet tint; thin dorsal ridge; cyber-
                  cyan inner ring is unusually thick (the
                  heretical-thought intensification)"
  hair:          "shoulder-length salt-and-pepper, slightly
                  unkempt (he stopped caring after expulsion);
                  one ear visible (cocked, listening)"
  face_shape:    "rectangular; pronounced brow; chalk-dust on
                  fingertips; lips amused"
  age_visible:   34
  backstory_microbeat: "his last words at the guild assembly
                  were 'who wrote it first?'; he repeated them
                  into the brass debate-bell; the bell was
                  muffled but the words echoed"
  master_face_seed: 190017
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_heretic_male_a_master_face.png

heretic_male_b:
  ethnicity_cue: "Demagi Inner-Empire Far-East scholar descent;
                  rich olive skin with violet wash; pronounced
                  dorsal ridge"
  hair:          "long black, pulled into a scholar's low knot;
                  brass debate-bell with cloth-muffler hangs
                  beside the knot at the back of the neck"
  face_shape:    "diamond; angular cheekbones; amber-flecked
                  dark eyes; cyber-cyan ring extra-thick"
  age_visible:   34
  backstory_microbeat: "his expulsion was filmed; the footage
                  is in House of Ledger archives; he has never
                  watched it — has always wondered if his face
                  in the moment looks different from how he
                  remembers feeling"
  master_face_seed: 190017a
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_heretic_male_b_master_face.png

heretic_male_c:
  ethnicity_cue: "Demagi Inner-Empire Far-South scholar descent;
                  deep brown skin with cool violet at temples"
  hair:          "shaved short with grey at the sides; chalk-
                  dust visible on the scalp from chalkboard
                  fragments he carries"
  face_shape:    "long oval; sharp brow; thin lips; pale-grey
                  biological eyes with the thick cyber-cyan
                  ring"
  age_visible:   34
  backstory_microbeat: "his chalkboard fragment carries an
                  additional question on the back side that
                  no other variant has: 'what is the fourth
                  doctrine of the Quill?' — Quill being the
                  guild Archon (a private heresy within the
                  heresy; reveals at Day-21 audit if cohort
                  hits Heretic-archetype audit cluster)"
  master_face_seed: 190017b
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_heretic_male_c_master_face.png

heretic_female_a:
  ethnicity_cue: "Demagi Inner-Empire scholar descent (matches
                  male_a); name variant Caede Vorr"
  hair:          "long black with grey at the temples; pulled
                  into a scholar's knot; one strand always
                  escaping the knot (chalk-dust on the strand)"
  face_shape:    "oval; soft cheekbones; pale-grey eyes;
                  amused mouth"
  age_visible:   34
  backstory_microbeat: "she was the youngest senior alumnus
                  of the House of Ledger to be expelled in
                  forty years; the expulsion record is sealed
                  except to Quill"
  master_face_seed: 190018
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_heretic_female_a_master_face.png

heretic_female_b:
  ethnicity_cue: "Demagi Inner-Empire Far-East scholar (matches
                  male_b)"
  hair:          "shoulder-length black, asymmetric (longer
                  left, shaved right where the dorsal ridge
                  meets the scalp — a heretical visible
                  display of the species marker)"
  face_shape:    "diamond; angular; amber-flecked dark eyes"
  age_visible:   34
  backstory_microbeat: "her shave-right asymmetric haircut is
                  the heresy itself — Demagi traditionally
                  cover the dorsal ridge; she does not"
  master_face_seed: 190018a
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_heretic_female_b_master_face.png

heretic_female_c:
  ethnicity_cue: "Demagi Inner-Empire Far-South scholar (matches
                  male_c)"
  hair:          "tightly-coiled black, kept short; chalk-dust
                  visible on the scalp"
  face_shape:    "round face; soft jaw; warm-brown eyes;
                  cyber-cyan ring extra-thick"
  age_visible:   34
  backstory_microbeat: "her chalkboard fragment is the most
                  worn of the variants (most-erased, most-
                  rewritten) — she has rewritten her original
                  heresy seventeen times in seventeen different
                  cipher-tongues; only one is still legible"
  master_face_seed: 190018b
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_heretic_female_c_master_face.png
```

#### §AC.11.14.10 Jester — Vex'rah Halflaugh (3 non-binary + 3 alternate variants)

```yaml
jester_nb_a:
  ethnicity_cue: "Quarchon Empire-Court descent; canonical pale-
                  grey with brass dust; left aperture-iris;
                  Panopticon-grade calibration (suppressed
                  plosive-click)"
  hair:          "short pale-blonde, asymmetric (longer left, shaved
                  right where the temple-port is); cyber-cyan thread
                  woven into the longer side"
  face_shape:    "narrow oval; sharp jaw; the half-smile that
                  doesn't reach the eyes is the canonical Vex'rah
                  expression"
  age_visible:   25
  backstory_microbeat: "their brother's name was on the assassination
                  list — first name Mer; they have never said it
                  out loud since"
  master_face_seed: 190019
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_jester_nb_a_master_face.png

jester_nb_b:
  ethnicity_cue: "Quarchon Empire-Court Far-East descent; pale-grey
                  with subtle warm undertone at the throat (rare
                  Quarchon variant); left aperture-iris"
  hair:          "long pale-grey, asymmetric (longer right, shaved
                  left); brass thread woven through the long side"
  face_shape:    "diamond; angular cheekbones; full mouth; the
                  half-smile is sharper on this variant (more
                  performative)"
  age_visible:   25
  backstory_microbeat: "this variant's puppeteer training was at
                  a Far-East troupe; the troupe-master is still
                  alive and writes them every six months
                  asking when they will return; they reply
                  every other letter"
  master_face_seed: 190019a
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_jester_nb_b_master_face.png

jester_nb_c:
  ethnicity_cue: "Quarchon Free-Ports manufactured (rare for
                  Panopticon recruits — they had to sign a
                  Free-Ports release); pale-grey with green-blue
                  throat undertone; left aperture-iris (Free-Ports
                  manufacturing standard)"
  hair:          "shaved entirely; the manufacturer's serial-number
                  visible on the temple; cyber-cyan thread tattooed
                  across the back of the head (a heretical court-
                  spy mark)"
  face_shape:    "long oval; sharp brow; thin lips; the half-smile
                  is harder to detect on this variant (the manufacturing
                  body has fewer expression-articulation degrees of
                  freedom)"
  age_visible:   25
  backstory_microbeat: "their puppeteer career was in the Free Ports
                  — never the Empire; Panopticon hired them anyway
                  because their lip-reading was the best the
                  recruiter had ever tested"
  master_face_seed: 190019b
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_jester_nb_c_master_face.png

jester_male_a:
  ethnicity_cue: "Quarchon Empire-Court (matches nb_a); brass-bound
                  panel coat slightly more masculine cut"
  hair:          "short pale-blonde asymmetric; cyber-cyan thread"
  face_shape:    "narrow rectangular; sharp jaw; light stubble"
  age_visible:   25
  backstory_microbeat: "his brother (Mer) was a Quarchon court-
                  guard — also Panopticon-aligned; the irony was
                  never lost on Vex'rah"
  master_face_seed: 190020
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_jester_male_a_master_face.png

jester_female_a:
  ethnicity_cue: "Quarchon Empire-Court (matches nb_a); cut more
                  fitted; same pale-blonde asymmetric hair"
  hair:          "long pale-blonde asymmetric; cyber-cyan thread;
                  one bell silenced at the right ear"
  face_shape:    "narrow oval; soft cheekbones; full mouth"
  age_visible:   25
  backstory_microbeat: "her brother (Mer-feminine variant Mera) was
                  her twin; the name on the list felt like seeing
                  her own"
  master_face_seed: 190021
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_jester_female_a_master_face.png
```

#### §AC.11.14.11 Sentinel — Marcus Farrow (3 male + 3 female variants)

```yaml
sentinel_male_a:
  ethnicity_cue: "Human Inner-Empire descent; weathered tan skin;
                  no species occult marker"
  hair:          "close-cropped iron-grey at temples, brown-black
                  at crown; clean-shaven (Imperial Guard discipline)"
  face_shape:    "rectangular; pronounced brow; deep-set warm-brown
                  eyes; thin scar along the right jaw (knife,
                  Bastion sixth year)"
  age_visible:   42
  backstory_microbeat: "the wrongful execution victim's name was
                  Pell Caedrune (no relation to Tien — coincidence
                  the cohort might notice if cohesion runs warm)"
  master_face_seed: 190022
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_sentinel_male_a_master_face.png

sentinel_male_b:
  ethnicity_cue: "Human Far-North descent; pale skin; faded
                  freckles across nose"
  hair:          "shoulder-length sandy-grey with iron at the temples;
                  pulled into a soldier's tail"
  face_shape:    "long oval; aquiline nose; pale-blue eyes;
                  weathered fine lines around the eyes"
  age_visible:   42
  backstory_microbeat: "served at the Forward Bastion alongside
                  Bohl-Mor variant_a's older brother (now dead at
                  Veridian VI); Bohl-Mor remembers his brother's
                  face; Marcus remembers his brother's name"
  master_face_seed: 190022a
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_sentinel_male_b_master_face.png

sentinel_male_c:
  ethnicity_cue: "Human Far-South descent; deep brown skin;
                  small mole at the chin"
  hair:          "short tightly-coiled black with grey at the
                  temples; clean-shaven"
  face_shape:    "round face; soft jaw; warm dark eyes;
                  visible siren-key on lanyard at the chest"
  age_visible:   42
  backstory_microbeat: "the wrongful execution victim was a Far-
                  South Demagi (Pell Caedrune's full ethnicity
                  detail) — Marcus carries the warrant in his
                  pocket folded next to the brass commendation;
                  the cohort might find the warrant during a
                  cellblock search"
  master_face_seed: 190022b
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_sentinel_male_c_master_face.png

sentinel_female_a:
  ethnicity_cue: "Human Inner-Empire (matches male_a); name
                  variant Marcia"
  hair:          "shoulder-length iron-grey, pulled into a
                  Imperial-Guard-issue bun; clean cut"
  face_shape:    "oval; soft cheekbones; warm-brown eyes;
                  right-jaw scar mirror of male_a"
  age_visible:   42
  backstory_microbeat: "her variant's wrongful-execution victim
                  was a woman named Pelha Caedrune — the warrant
                  carried mistaken gender alongside everything
                  else"
  master_face_seed: 190023
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_sentinel_female_a_master_face.png

sentinel_female_b:
  ethnicity_cue: "Human Far-North descent (matches male_b);
                  pale; freckles; pale-blue eyes"
  hair:          "long sandy-grey, tied back in a tight braid;
                  one strand always escaping over the left
                  temple"
  face_shape:    "long oval; aquiline nose; weathered around
                  the eyes"
  age_visible:   42
  backstory_microbeat: "she has the only sentinel variant
                  who keeps her commendation visible — a
                  brass-bound pin at the breast (canon Marcus
                  hides his); she carries the heavier shame
                  in a different way"
  master_face_seed: 190023a
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_sentinel_female_b_master_face.png

sentinel_female_c:
  ethnicity_cue: "Human Far-South descent (matches male_c)"
  hair:          "tightly-coiled black with grey at the temples;
                  pulled back into two short knots at the nape"
  face_shape:    "round face; soft jaw; warm dark eyes;
                  the siren-key lanyard at the chest is the
                  most visible of the variants (longer than
                  the male canon)"
  age_visible:   42
  backstory_microbeat: "her warrant-victim Pelha was the fiancée
                  of a Demagi who is now a Hierarchy bishop —
                  the bishop and Marcia's variant cross paths
                  during an Act-5 mission deployment;
                  parametric; out of scope for this doc"
  master_face_seed: 190023b
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_sentinel_female_c_master_face.png
```

#### §AC.11.14.12 Prodigal — Lord Avern Thessler (3 male + 3 female variants)

```yaml
prodigal_male_a:
  ethnicity_cue: "Human Inner-Empire noble descent; warm-tan skin;
                  no species occult marker; one small brass hoop
                  earring (right ear — matches Wanderer male_a's
                  left side hoop; the Free Ports outer-ring stock
                  pierces both ears for symmetry; Avern only
                  pierced one)"
  hair:          "shoulder-length brown with sun-bleached tips
                  (Free Ports years); pulled into a tail at the
                  nape"
  face_shape:    "rectangular; aristocratic brow; deep-set warm-
                  brown eyes; the bones of the face are still
                  Empire-noble despite weathering"
  age_visible:   28
  backstory_microbeat: "his betrothal-ceremony fiancée's name
                  was Ileva Thessler-Vekka — they were childhood
                  friends; he has never told her he is alive"
  master_face_seed: 190024
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_prodigal_male_a_master_face.png

prodigal_male_b:
  ethnicity_cue: "Human Far-North descent (rare for Empire
                  noble); pale skin with sun-darkening on
                  forearms; faded freckles"
  hair:          "long sandy-blonde, pulled into a Free-Ports-
                  rough tail; clean-shaven (Empire-noble
                  hold-over)"
  face_shape:    "long oval; aquiline nose; pale-blue eyes;
                  weathered around the eyes from Free Ports
                  exposure; Empire-noble jawline still visible"
  age_visible:   28
  backstory_microbeat: "his Thessler shipping-house variant
                  is in the Far-North trading-belt; his
                  fiancée was a Far-North noble too — Ilara
                  Vekka; the betrothal was cross-house"
  master_face_seed: 190024a
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_prodigal_male_b_master_face.png

prodigal_male_c:
  ethnicity_cue: "Human Far-South descent; deep umber-brown skin;
                  small chin scar (childhood — fall from a
                  parapet at age six)"
  hair:          "tightly-coiled black with sun-bleached fringe;
                  short; brass hoop on the right ear (matches
                  Wanderer male_c's right hoop — different
                  symmetry coincidence; both hoops on right
                  is the rare collision the cohort never
                  notices unless triangle-event runs both
                  Wanderer and Prodigal as Far-South descent)"
  face_shape:    "round face; soft jaw; warm dark eyes;
                  noble bone structure"
  age_visible:   28
  backstory_microbeat: "his Free-Ports broker name 'Ren Calpha'
                  was deliberately chosen to echo Roon Calpha
                  (Wanderer); he heard the name through a
                  shared-wall in the rooming house and liked
                  the sound; he has never met Roon and does
                  not know Roon's full name; the brass earring
                  on the right ear was a wedding-favour from
                  someone Avern doesn't remember at a Free-
                  Ports party"
  master_face_seed: 190024b
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_prodigal_male_c_master_face.png

prodigal_female_a:
  ethnicity_cue: "Human Inner-Empire noble (matches male_a);
                  name variant Lady Avern Thessler (gender-
                  neutral first name; same canon)"
  hair:          "long brown with sun-bleached tips; pulled
                  into a Free-Ports-rough tail; small brass
                  hoop on right ear"
  face_shape:    "oval; aristocratic cheekbones; warm-brown
                  eyes; the half-empty leather coin-purse at
                  the belt visible"
  age_visible:   28
  backstory_microbeat: "her betrothal was to a Trade Empire
                  countess (not a count) — Lady Ileva
                  Thessler-Vekka — Empire-noble lesbian
                  betrothal is canon and was the actual
                  reason the family pushed; Avern's vanishing
                  was less rebellion against the marriage
                  than against the family's politics"
  master_face_seed: 190025
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_prodigal_female_a_master_face.png

prodigal_female_b:
  ethnicity_cue: "Human Far-North noble (matches male_b)"
  hair:          "long sandy-blonde, Free-Ports tail; clean
                  freckled forehead"
  face_shape:    "long oval; aquiline nose; pale-blue eyes"
  age_visible:   28
  backstory_microbeat: "her variant left the cross-house
                  betrothal because she found out the betrothal
                  was a cover for a Trade Empire weapons-
                  smuggling deal — she went to Free Ports as
                  a kind of moral protest; the family thinks
                  she ran away with a lover"
  master_face_seed: 190025a
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_prodigal_female_b_master_face.png

prodigal_female_c:
  ethnicity_cue: "Human Far-South noble (matches male_c)"
  hair:          "tightly-coiled black with sun-bleached fringe;
                  short; brass hoop on right ear (the rare
                  same-side-as-Wanderer-c collision)"
  face_shape:    "round face; soft jaw; warm dark eyes;
                  Empire-noble bones"
  age_visible:   28
  backstory_microbeat: "she is the variant who DID meet Roon
                  Calpha in person — once, at a Free Ports
                  market, two years ago; she remembers him
                  arguing with a vendor; she did not know
                  who he was; Roon does not remember her at
                  all; if the cohort runs Far-South Wanderer
                  + Far-South Prodigal, the recognition
                  scene happens at Day-14 — out of scope for
                  this doc but reserved as a storyteller hook"
  master_face_seed: 190025b
  cdn_target: cdn/client-public/art/portraits/_masters/apprentice_prodigal_female_c_master_face.png
```

### §AC.11.15 Variant selection runtime contract

The 72 variants above are selected at instantiation per
cohort cycle by `apps/server/services/apprenticePedagogyBootstrap.ts`
(or equivalent) — when an apprentice spawns into the cohort,
the runtime:

1. Reads `apprentice.archetype` (one of 12)
2. Reads `apprentice.gender` (canonical female / male / non-binary)
3. Hashes the apprentice's runtime UUID + cohort cycle into
   a pseudo-random selector
4. Picks one of the 3 variants per archetype × gender
5. Locks the variant for the apprentice's lifetime (variants
   never re-randomize mid-cycle)
6. Loads the variant's master_face from CDN as the canonical
   reference for downstream cutscenes / portraits in that
   apprentice's run

Backstory micro-beats from the variant inform unique dialog
hooks at runtime (e.g., Ghost female_b's Free-Ports manufactured
status surfaces in audit Day-14 dialogue if her variant is
selected).

### §AC.11.16 Master-face NB2 prompt template (canonical)

For each of the 72 variants, the master-face render is generated
via this canonical NB2 prompt template. **This is the gating
production-art batch** — every downstream apprentice render
references the master face for character-consistency.

```yaml
nb2:
  model: gemini-3-pro-image-preview
  aspect_ratio: "1:1"
  resolution: "1080x1080"
  reference_images:
    - cdn/client-public/art/refs/apprentice_aesthetic_anchor.png
  prompt: |
    SUBJECT: <APPRENTICE_<archetype>_<gender>_<variant>_VISUAL>
      from §AC.11.14.<n>: ethnicity_cue + hair + face_shape +
      species visual cues per §AC.11.A — verbatim concatenation
      of the variant's three trait-lock fields plus the species
      cues. The apprentice is shown in head-and-shoulders
      framing, eyes meeting the camera at the same eye-line,
      mouth at neutral expression, neutral lighting designed
      to capture the canonical face structure.
    COMPOSITION: 1:1 square, 85mm equivalent (intimate portrait
      lens), shallow DOF on face, head occupying upper 65% of
      canvas, shoulders filling lower 35%, neutral grey APPRENTICE_
      AESTHETIC backdrop in soft bokeh.
    LIGHTING/CAMERA: 5400K diffuse front-fill key (no dramatic
      shadows on the face — this is the canonical face reference,
      not a cinematic still); 6500K cyber-cyan rim from upper-
      right at low intensity (signal the APPRENTICE_AESTHETIC
      world without obscuring face structure); ARRI Alexa
      anamorphic; Kodak Vision3 250D (NOT 500T pushed +1 — for
      master face we want the cleanest reproducible reference,
      not pushed grain).
    STYLE: APPRENTICE_AESTHETIC subtle — brass armatures and
      cyber-cyan conduits in soft bokeh behind the figure;
      occult-violet and corruption-pink palette absent from
      the master face (those are added in downstream
      expression / state variants); palette focus is character-
      face-readability.
    CONSTRAINTS: NB2_CONSTRAINTS_BASE; this is the master face
      reference — must be reproducible across all 11 downstream
      assets; the face structure here is canonical for this
      apprentice variant; no extra fingers (hands not in
      frame); no watermark; no logo; no signature object in
      this render (signature objects are added in downstream
      hero / dialog / 3qbody renders); the canonical 11-asset
      pipeline references back to THIS image as the face
      anchor.
    Output 1080x1080, 1:1.

pipeline:
  nb2_seed: <variant master_face_seed from §AC.11.14>
  cdn_target: <variant cdn_target from §AC.11.14>
  reference_image_bundle: |
    The single reference image is the apprentice_aesthetic_anchor.png
    from §AC.0.1; the master face render is otherwise un-referenced
    (this is the gating batch — no other character is established
    yet, so trait-locking is via prose only).
```

**Generation order**:
1. Generate `apprentice_aesthetic_anchor.png` (single-image,
   establishes APPRENTICE_AESTHETIC; render once).
2. For each of 72 variants, run the master-face NB2 prompt
   above. Output 72 master_face PNGs to
   `cdn/client-public/art/portraits/_masters/`.
3. For each master face, run the §AC.10.5–§AC.10.6
   downstream 11-asset templates with the master face as
   reference image. Total downstream renders: 72 × 11 = 792.
4. Plus the 5 named recruits × 11 = 55, plus Inspector
   Veil-7 + 12 Archons + Mechronis Auditor + Quartermaster
   per §AC.10.8 = 159.
5. **Total apprentice + named-character master-aware art
   batch: 1 + 72 + 792 + 55 + 159 = 1,079 renders.**
   (Replaces the prior §AC.10.12 count of 836.)

End of §AC.11.

---

## §AC.12 UI surface art — dialog / pedagogy hub / mission resolver / comm-screen frames

The runtime ships React components (`PedagogyHub.tsx`,
`BerthCommScreen.tsx`, `BerthScene.tsx`, `MissionResolver.tsx`,
`AuditTranscript.tsx`, `CohortSlotsPanel.tsx`, `WardenPanel.tsx`,
`SignatureCardForge.tsx`, `MemoryCardLibrary.tsx`,
`DoctrinePicker.tsx`, `CommonsScenesPanel.tsx`) but the **chrome
art** (frame textures, choice-wheels, response indicators,
rarity-band trim, kiosk panels) was not specced. This section
authors them.

All UI chrome inherits APPRENTICE_AESTHETIC: brass armatures
+ cyber-cyan fiber-optic frames + sigil-etched plates
+ chalk-circle accents. UI panels are diegetic — the player
reads them as in-world brass-bound terminals, not modern flat-
shaded UI. Per the §AC.0.1 forbidden-list: pure-digital flat-
shaded UIs are wrong; cyberpunk surfaces THROUGH brass / leather
/ candle-wax.

### §AC.12.1 BioWare-style branching dialog UI frame

```yaml
asset_id: ui_dialog_frame
purpose: BioWare-style branching dialog overlay — used during
  every named-character dialog scene (apprentice + recruits +
  named NPCs)
geometry: full-screen overlay; lower 35% holds the dialog box;
  upper 65% shows the live scene behind
fixtures:
  - speaker_portrait_pane (lower-left, 1:1 square at 320x320 px;
    holds the dialog_headshot of the current speaker; brass-bound
    frame with cyber-cyan fiber-optic trim; sigil-etched corner-
    plates; the portrait inside is the §AC.10.6 dialog_headshot
    in current expression state)
  - dialog_text_pane (lower-centre-and-right; brass-rim mahogany
    surface texture with cipher-script for non-quote text;
    speaker-name brass plate at top-left of pane in 25-char
    safe text; dialog-text body in cipher-cream parchment-tone
    on dark-mahogany backing)
  - choice_wheel (lower-right when player's turn; 4-spoke radial
    brass wheel; each spoke is a brass-rim mahogany blade with
    a chosen-response icon; cyber-cyan fiber-optic trim that
    intensifies on hover; the centre of the wheel carries a
    chalk-circle inlay with the player's brass apprentice-
    glyph)
  - response_indicator (small 32x32 px brass-rim icon at the
    end of each choice-wheel spoke; 4 canonical icons:
    direct=brass-arrow / careful=brass-shield / probe=brass-
    eye / heretic=brass-question-mark)
  - audio_visualizer (faint cyber-cyan waveform along the top
    edge of the dialog text pane; modulates with current
    speaker's voice; absent during silent beats)
art_resources:
  textures: ui_dialog_frame_brass.png (1920x1080 master),
    ui_dialog_speaker_pane_frame.png (340x340 with brass-rim
    + fiber-optic trim alpha),
    ui_dialog_text_pane_mahogany.png (1280x340),
    ui_dialog_choice_wheel_4spoke.png (480x480 alpha-channel),
    ui_dialog_response_icon_<type>.png × 4 (32x32 alpha)
  models: none (UI overlay is 2D)
  vfx: choice_wheel_hover_intensify (cyber-cyan rim brightens
    150%); audio_visualizer_waveform (animated; modulates per
    voice amplitude); chalk-circle pulse (every 8s when no
    interaction)
nb2_prompt:
  model: gemini-3-pro-image-preview
  aspect_ratio: "16:9"
  resolution: "4K"
  reference_images:
    - cdn/client-public/art/refs/apprentice_aesthetic_anchor.png
  prompt: |
    SUBJECT: a BioWare-style dialog UI overlay panel, lower 35%
      of a 16:9 screen, designed as a diegetic brass-bound
      terminal interface (NOT a flat-shaded modern UI); panel
      consists of: lower-left speaker-portrait pane in brass-
      rim mahogany frame with cyber-cyan fiber-optic trim and
      sigil-etched corner-plates (320x320 viewport for the
      live portrait); lower-centre dialog-text pane in mahogany
      with brass speaker-name plate at top-left and cipher-
      cream parchment body text on dark-mahogany backing;
      lower-right 4-spoke radial brass choice-wheel with each
      spoke a brass-rim mahogany blade carrying a brass-rim
      response icon; chalk-circle inlay at the wheel's centre;
      cyber-cyan fiber-optic conduits running between all
      panes; faint audio-visualizer waveform along the top
      edge; the panel reads as if etched into the bottom of
      a brass-and-glass viewing terminal that has been part
      of the Ark for years.
    COMPOSITION: 16:9 wide, designed for full-screen overlay
      consumption; the lower 35% is the UI; upper 65% is
      transparent (alpha-channel) for the underlying scene
      to show through.
    LIGHTING/CAMERA: 1800K candle key warming the brass; 6500K
      cyber-cyan rim from fiber-optic; 12000K occult-violet
      practical at the chalk-circle wheel-centre; ARRI Alexa
      anamorphic; Kodak Vision3 500T pushed +1.
    STYLE: APPRENTICE_AESTHETIC; the UI is steampunk-
      cyberpunk-occult — brass armatures with cyber-cyan
      conduits emerging through them, sigil-etched plates,
      chalk-circle inlay; palette `#c9a14a / #5fa8ff / #0d0a08
      / #ff2a8a / #5a1a1f / #dccfaa`.
    CONSTRAINTS: NB2_CONSTRAINTS_BASE; the UI must be visually
      diegetic (in-world brass terminal, not modern flat UI);
      cipher-script body-text shown is dummy lorem-cipher
      (≤25 chars per visible line — NB2 text-rendering-safe);
      no real readable dialog text in the master prompt (the
      runtime fills text); transparent upper 65%.
    Output 4K, 16:9 with alpha-channel.
pipeline:
  nb2_seed: 192001
  cdn_target: cdn/client-public/art/ui/ui_dialog_frame_master.png
```

### §AC.12.2 Pedagogy Hub 6-tab UI

```yaml
asset_id: ui_pedagogy_hub
purpose: 6-tab navigation for ApprenticePedagogyPage.tsx
  (Doctrine / Audits / Forge / Missions / Cohort / Memories)
geometry: full-screen panel; left 25% holds tab spine; right
  75% holds tab content
fixtures:
  - tab_spine (left-vertical bank of 6 brass-bound tab-keys;
    each tab is a brass key with cipher-script label, sigil-
    etched plate, candle-sconce LED that ignites when active);
    6 canonical tabs:
      Doctrine: brass key + scripture-medallion glyph
      Audits: brass key + cog-mechanism interview-recorder glyph
      Forge: brass key + anvil glyph
      Missions: brass key + holodisplay deployment-grid glyph
      Cohort: brass key + 3-figure cohort-roster glyph
      Memories: brass key + memory-card-pedestal glyph
  - tab_content_panel (right-75% mahogany-and-brass workspace;
    chalk-circle inlay around active workspace; cipher-script
    header in 25-char safe text)
  - status_bar (top edge; brass-rim with current cohort-day,
    blood-weave alignment band, current cohesion-weather state)
art_resources:
  textures: ui_pedagogy_tab_spine.png (480x1920 with 6-key alpha),
    ui_pedagogy_tab_<tab_id>_inactive.png × 6,
    ui_pedagogy_tab_<tab_id>_active.png × 6,
    ui_pedagogy_content_panel_mahogany.png (1440x1920),
    ui_pedagogy_status_bar.png (1920x96)
  vfx: tab-key candle-sconce ignite on active; chalk-circle
    pulse; cipher-script header parametric per tab
nb2_prompt: |
  (Same template as §AC.12.1 but framed for the 6-tab spine
  with 6 brass keys descending vertically, each carrying a
  distinct sigil-etched glyph; tab content area is mahogany-
  and-brass with chalk-circle inlay; status bar across top in
  brass-rim with cipher-script display fields. Output 4K,
  16:9 with alpha for content area.)
pipeline:
  nb2_seed: 192002
  cdn_target: cdn/client-public/art/ui/ui_pedagogy_hub_master.png
```

### §AC.12.3 Mission Resolver UI

```yaml
asset_id: ui_mission_resolver
purpose: surface for `apprenticeMissionTypes.ts` deployment +
  crisis-choice + return resolution; embedded in the Pedagogy
  Hub Missions tab and standalone via mission_briefing_war_room
  (§AC.4.8) holodisplay
geometry: triptych — left holds 17-slot mission roster; centre
  holds active-mission deployment cyber-cyan holographic grid;
  right holds 7-role-station alcove array
fixtures:
  - roster_panel (left; 17 brass-bound dossier-tabs; each tab
    carries a mission-name plate + role-glyph + status-icon
    (idle / briefed / deployed / returned-success / partial /
    failure))
  - holographic_grid (centre; 3D cyber-cyan deployment-grid
    with apprentice-counters as small brass figures — animated
    placement / movement / extraction)
  - role_alcove_array (right; 7 mini-alcove icons with
    role-glyph; each alcove ignites when an apprentice is
    deployed in that role)
  - crisis_choice_overlay (modal — surfaces during mid-
    mission; carries 3-choice brass wheel with crisis-resolution
    options)
art_resources:
  textures: ui_mission_roster_panel.png (480x1920),
    ui_mission_holographic_grid_master.png (960x1080),
    ui_mission_role_alcove_array.png (480x1080),
    ui_mission_crisis_choice_modal.png (640x480),
    ui_mission_dossier_tab_<status>.png × 5
  models: ui_mission_apprentice_brass_figure.glb (animated;
    5-pose set for grid placement)
  vfx: hologram cyber-cyan flicker (60Hz); crisis-modal
    chalk-circle pulse; brass-figure pose-transitions
pipeline:
  nb2_seed: 192003
  cdn_target: cdn/client-public/art/ui/ui_mission_resolver_master.png
```

### §AC.12.4 Cohort Slots Panel UI

```yaml
asset_id: ui_cohort_slots_panel
purpose: surface for `apprenticeCohort.ts` 3-slot system
  (active + training_a + training_b); embedded in Pedagogy
  Hub Cohort tab
geometry: 3-column horizontal panel; each column is a slot
fixtures:
  - 3 slot_panels each carrying:
      - apprentice_dialog_headshot (1:1 at 320x320; pulled
        from §AC.10.6)
      - apprentice_name_plate (brass; 25-char-safe)
      - archetype_glyph + species_marker (small brass-rim
        glyph at top-right of headshot)
      - trial_day_counter (brass cog-mechanism dial; 1-28)
      - bond_corruption_meter (brass-rim horizontal bar;
        bond fill from left in cyber-cyan; corruption fill
        from right in corruption-pink)
      - doctrine_slip_pinned (small brass-rim slip-icon;
        absent until binding)
      - audit_transcript_pinned (small brass-bound transcript-
        icon; absent until Day-7+)
  - cross-slot resonance-line (animated cyber-cyan thread
    drawn between slots when doctrines resonate)
art_resources:
  textures: ui_cohort_slot_panel.png (640x1080 single slot),
    ui_cohort_archetype_glyph_<archetype>.png × 12,
    ui_cohort_species_marker_<species>.png × 3,
    ui_cohort_trial_day_dial.png (animated 1-28),
    ui_cohort_bond_corruption_meter.png (animated parametric)
pipeline:
  nb2_seed: 192004
  cdn_target: cdn/client-public/art/ui/ui_cohort_slots_panel_master.png
```

### §AC.12.5 Warden Panel UI

```yaml
asset_id: ui_warden_panel
purpose: surface for `apprenticeWarden.ts` Inspector Veil-7
  + 4 Warden's-candidate apprentices + purge-notice; embedded
  in Pedagogy Hub Audits tab when heretical_quiet doctrine
  + Day-14 dock event triggered
geometry: vertical panel; top holds Inspector Veil-7's silhouette
  + nameplate; middle holds 4 candidate-roster slots; bottom
  holds purge-notice overlay (when active)
fixtures:
  - veil7_silhouette_panel (top; 1:1 silhouette in cyber-cyan
    only; brass nameplate "INSPECTOR VEIL-7" in 16-char safe
    text)
  - candidate_roster (middle; 4 mini-slot panels with each
    candidate's silhouette + brass-coin lapel-pin + Warden-
    livery overlay greyscale wash)
  - purge_notice_overlay (bottom; brass-bound document with
    cipher-script parchment text "PURGE NOTICE" 12-char safe;
    3 response options: dispute / comply / disappear)
art_resources:
  textures: ui_warden_panel_master.png (640x1920),
    ui_warden_veil7_silhouette.png (320x320 cyber-cyan only),
    ui_warden_candidate_slot.png (320x240 with greyscale wash),
    ui_warden_purge_notice_doc.png (480x480),
    ui_warden_response_option_<type>.png × 3
pipeline:
  nb2_seed: 192005
  cdn_target: cdn/client-public/art/ui/ui_warden_panel_master.png
```

### §AC.12.6 Comm-screen frame layouts (9 states × 3 anchor positions = 27 frame variants)

The §AC.5.5 9 comm-screen states each have their own frame
layout. Combined with the 3 anchor positions (wall_left /
wall_right / shelf_top), there are 27 frame-variant renders.

```yaml
asset_pattern: ui_comm_screen_<state>_<anchor>.png   # 27 renders
states: idle / call_in / call_out / audit_in_progress /
  narrative_silence / warden_line_tap / mourning_call /
  cohort_banter / commons_phone_mode
anchors: wall_left / wall_right / shelf_top
geometry: 0.6m × 0.4m brass-bound CRT-screen frame; cog-
  mechanism brass armature; cyber-cyan fiber-optic frame trim
  (the trim colour modulates per state — cyan idle, amber
  call-in, corruption-pink warden-line-tap, etc.)
fixtures (per state):
  idle:                  archetype-glyph centred + cohort-roster minimum
                         overlay + clock at corner
  call_in:               Elara expression_focused thumbnail at upper-right
                         + amber rim
  call_out:              Human current-reveal-stage thumbnail at upper-
                         right + cyan rim
  audit_in_progress:     "AUDIT IN PROGRESS" watermark (16 chars) +
                         live-transcript scroll + cog-mechanism
                         interview-recorder pulse-light
  narrative_silence:     blank with cyber-cyan static bed; apprentice
                         silhouette faintly visible in centre
  warden_line_tap:       "WARDEN LINE TAP" watermark (15 chars) + Warden
                         silhouette + corruption-pink corner indicator
  mourning_call:         fallen apprentice's expression_doctrinal
                         thumbnail + dirge-text scroll + grey wash
  cohort_banter:         cohort-mate's expression_neutral thumbnail at
                         upper-right + banter-text scroll
  commons_phone_mode:    sub-zone live-feed selector (3 mini-thumbnails
                         for bar / long-table / alcove sub-zones) +
                         active-feed in main viewport
nb2_prompt: |
  (One canonical NB2 prompt per state; per-anchor variants
  generated by post-processing the wall-mount transform.
  The state's content overlay is described in the
  fixtures above; the frame chrome is the §AC.0.1 brass-and-
  cyber-cyan canonical comm-screen.)
pipeline:
  nb2_seed: 192006..192014   # 9 state seeds
  cdn_target: cdn/client-public/art/ui/ui_comm_screen_<state>.png
                              # × 9; anchor variants generated by
                              # runtime transform
```

### §AC.12.7 Memory Card Library kiosk UI

```yaml
asset_id: ui_memory_library_kiosk
purpose: standalone kiosk surface for §AC.4.4 Memory Card
  Library (consumption-pulpit interaction)
geometry: vertical kiosk; brass-bound; cyber-cyan fiber-optic
  trim; 3 functional zones (browse / select / consume)
fixtures:
  - browse_zone (top 50%; 12 portrait-frame grid showing
    minted Memory Cards; each frame is brass-rim mahogany with
    cyber-cyan fiber-optic trim and the apprentice's
    expression_doctrinal thumbnail; minted state shows the
    portrait, unminted state shows an empty silhouette)
  - select_zone (middle 25%; brass-bound card-tray that animates
    a selected Memory Card sliding into position; chalk-circle
    inlay around the tray)
  - consume_zone (bottom 25%; brass-rim consumption-pulpit
    slot; the slot animates the card-burn at edge with brass-
    spark cascade; pulpit's brass-bound book displays the
    inherited line in cipher-script after consumption)
art_resources:
  textures: ui_memory_library_kiosk_master.png (480x1920),
    ui_memory_library_browse_grid.png (480x960 with 12 cells),
    ui_memory_library_select_tray.png (480x480 animated),
    ui_memory_library_consume_slot.png (480x480 animated burn)
pipeline:
  nb2_seed: 192015
  cdn_target: cdn/client-public/art/ui/ui_memory_library_kiosk_master.png
```

### §AC.12.8 Doctrine Picker UI

```yaml
asset_id: ui_doctrine_picker
purpose: standalone surface for `DoctrinePicker.tsx`; embedded
  in Pedagogy Hub Doctrine tab; player-facing version of the
  §AC.4.1 Doctrine Binding Chamber 5-pulpit ring
geometry: pentagonal layout; 5 doctrine-pulpit-thumbnails
  arranged at 72° spacing around a central chalk-circle
fixtures:
  - 5 doctrine-pulpit-thumbnails (each is a small brass-bound
    panel with: doctrine name in 25-char safe text, doctrine
    glyph, 4-stanza preview text in cipher-script, cost +
    consequence cipher-text)
  - central chalk-circle (with brass-bound binding-button at
    centre; ignites when a doctrine is hovered)
  - doctrine-stakes-display (bottom edge; cipher-script display
    of selected doctrine's loss-stakes + win-rewards)
art_resources:
  textures: ui_doctrine_picker_master.png (1920x1080),
    ui_doctrine_pulpit_thumbnail_<doctrine>.png × 5,
    ui_doctrine_chalk_circle_button.png (320x320 animated)
pipeline:
  nb2_seed: 192016
  cdn_target: cdn/client-public/art/ui/ui_doctrine_picker_master.png
```

### §AC.12.9 Signature Card Forge UI

```yaml
asset_id: ui_signature_card_forge
purpose: standalone surface for `SignatureCardForge.tsx`;
  embedded in Pedagogy Hub Forge tab; player-facing version
  of the §AC.4.3 Forge anvil + 6 effect-slots
geometry: anvil-centred layout; 6 effect-slot thumbnails at 60°
  spacing; central anvil holds the forming card during forge
fixtures:
  - 6 effect-slot thumbnails (each: brass-rim panel with
    effect name in 25-char safe text, cipher-script effect
    description, archetype-resonance-meter)
  - central anvil (with cyber-cyan fiber-optic conduit
    igniting the active effect-slot's cone-of-light)
  - corruption_band_indicator (right edge; vertical brass-rim
    meter showing pristine / midstate / corrupted band based
    on bond/corruption ratio)
  - card_preview (left edge; live preview of the card-as-forged-
    so-far; animates as effect-slot is selected)
art_resources:
  textures: ui_forge_master.png (1920x1080),
    ui_forge_effect_slot_<slot>.png × 6,
    ui_forge_anvil_animated.png (480x480),
    ui_forge_corruption_band_meter.png (96x720),
    ui_forge_card_preview.png (320x480 animated)
pipeline:
  nb2_seed: 192017
  cdn_target: cdn/client-public/art/ui/ui_signature_card_forge_master.png
```

### §AC.12.10 Audit Transcript UI (readable artifact)

```yaml
asset_id: ui_audit_transcript
purpose: surface for `AuditTranscript.tsx`; the brass-bound
  transcript artifact pinned to apprentice berth wall after
  audits; readable in-world
geometry: brass-bound book-leaf layout; left page shows
  apprentice profile_hero + nameplate + audit-day badge;
  right page shows cipher-script transcript body + Auditor's
  signature at bottom; Day-21 variant shows Inspector Veil-7
  signature instead
fixtures:
  - left page: apprentice's profile_hero + name + Day-7 / 14 /
    21 badge in 12-char safe text + chalk-circle margin
  - right page: cipher-cream parchment body with cipher-script
    transcript (parametric per archetype × day); Auditor's
    brass-rim signature stamp at bottom; Day-21 variant
    swaps signature for INSPECTOR VEIL-7
  - leather-bound spine + brass-rim corners
art_resources:
  textures: ui_audit_transcript_book_master.png (1920x1080),
    ui_audit_transcript_left_page_template.png (960x1080),
    ui_audit_transcript_right_page_cipher.png (960x1080),
    ui_audit_transcript_signature_<auditor>.png × 2 (generic
    Mechronis Auditor + Inspector Veil-7)
pipeline:
  nb2_seed: 192018
  cdn_target: cdn/client-public/art/ui/ui_audit_transcript_master.png
```

### §AC.12.11 Commons Scenes Panel UI

```yaml
asset_id: ui_commons_scenes_panel
purpose: surface for `CommonsScenesPanel.tsx`; live-feed of
  the 157 commons banter scenes available to player; embedded
  in the Social Hub berth-comm-screen `commons_phone_mode`
  state and standalone as a roster
geometry: 3-column layout per Social Hub sub-zone (bar / long-
  table / alcove); each column lists active banter pairs
fixtures:
  - 3 sub-zone columns (bar / long-table / alcove); each carries:
      live-feed thumbnail (current banter pair if any)
      banter-pair list (sorted by relevance to current cohort)
      bond-delta-preview (how each scene affects bond on
        approach / eavesdrop / leave)
  - chalk-circle inlay at the bottom (cohesion-weather indicator
    band: hostile / tense / warm / bonded / family)
art_resources:
  textures: ui_commons_panel_master.png (1920x1080),
    ui_commons_subzone_bar.png (640x1080),
    ui_commons_subzone_long_table.png (640x1080),
    ui_commons_subzone_alcove.png (640x1080),
    ui_commons_cohesion_weather_band.png (1920x96 animated)
pipeline:
  nb2_seed: 192019
  cdn_target: cdn/client-public/art/ui/ui_commons_scenes_panel_master.png
```

### §AC.12.12 UI surface-art summary

| asset | renders |
|---|---|
| dialog frame | 1 master + 4 response icons = 5 |
| pedagogy hub | 1 master + 12 tab variants (active/inactive × 6) = 13 |
| mission resolver | 1 master + 5 dossier-tab statuses + 1 brass-figure model = 7 |
| cohort slots panel | 1 master + 12 archetype glyphs + 3 species markers = 16 |
| warden panel | 1 master + 1 silhouette + 1 candidate slot + 1 purge doc + 3 response options = 7 |
| comm-screen frames (9 states) | 9 |
| memory library kiosk | 1 master + 4 zone variants = 5 |
| doctrine picker | 1 master + 5 pulpit thumbs + 1 button = 7 |
| signature card forge | 1 master + 6 effect-slots + 1 anvil + 1 band meter + 1 preview = 10 |
| audit transcript | 1 master + 2 page templates + 2 signatures = 5 |
| commons scenes panel | 1 master + 3 sub-zones + 1 weather band = 5 |
| **TOTAL UI RENDERS** | **89** |

---

## §AC.13 Activity sprite NB2 prompts (48 apprentice + 20 recruit = 68)

Per §AC.5.1, every apprentice berth carries a per-phase activity
overlay sprite. The runtime resolves which sprite shows on the
comm-screen + apprentice presence in the room based on
`timeOfDay.getCurrent()` + cohort state.

12 archetypes × 4 phases = **48 apprentice activity sprites**
+ 5 recruits × 4 phases = **20 recruit activity sprites**
= **68 total**.

### §AC.13.0 Sprite spec

```yaml
geometry:        1:1 square 1080x1080 PNG with alpha-channel
purpose:         live activity overlay shown in the apprentice's
                 berth (or comm-screen idle state); the sprite
                 is composited over the berth backdrop at runtime
sprite_kind:     mid-action pose, eyes NOT on camera (the sprite
                 is the apprentice doing their activity, NOT
                 posing for the player)
trait_locks:     §AC.11.14 variant master_face + signature object
                 + species cues (Demagi dorsal ridge / Quarchon
                 mech-eye / Human absence)
```

### §AC.13.1 12 archetype × 4 phases = 48 sprite prompts

Per archetype, 4 phase-specific activities (per the `timeOfDay.ts`
4-phase contract):

| archetype | DAWN activity | MIDDAY activity | DUSK activity | NIGHTWATCH activity |
|---|---|---|---|---|
| **Zealot** | dawn-prayer (kneeling at scripture-medallion) | scripture-cipher reading at desk | cohort-meal at long-table (alcove visible behind) | prayer-vigil (eyes closed, candles lit) |
| **Ghost** | watching-bay-2-ladder (silent at deck-window porthole) | audio-recorder maintenance | dusk-watch (silent at door) | silent-bunk (lying flat on cot, eyes open) |
| **Scholar** | morning-cipher-read (book open, brass-rim glasses on) | annotation work at table (pen-in-hand) | dusk-meal alone (quiet eating, book open) | late-read by candlelight (book lit by single candle) |
| **Revenant** | scarification-tool-cleaning (cipher-rune blade on cloth) | corridor-pace (walking the bunk in slow circles) | quiet-conversation with Sentinel (visitor frame) | nightwatch breathing exercises (eyes closed, audible breath) |
| **Artisan** | tool-cleaning at workbench | active project-build (cog-vice in use) | blueprint-sketch at table | bench-asleep (head on workbench, candles out) |
| **Oracle** | morning-tarot-spread (4 cards, dawn-light from porthole) | scrying-vision at neural-jack port | dusk-tea-for-two (one cup unfilled) | nightwatch-half-trance (eyes wide, asynchronous) |
| **Wanderer** | route-map study (maps spread on bedroll) | walking-stick maintenance (rifle-stock visible) | cohort-banter at long-table | nightwatch packing-and-repacking |
| **Martyr** | redirect-rune brass plate polish | bandage-kit inventory | cohort-meal (sitting close to wounded cohort-mate) | nightwatch-prayer (palms up, eyes wet) |
| **Heretic** | chalkboard-fragment study (rewriting heresy) | debate-bell muffler-replacement | dusk-meal with Scholar (arguing) | nightwatch-chalk-erasing (the heresy back to legible) |
| **Jester** | morning-juggling (3 brass clubs) | retort-card sorting | dusk-banter (3 cohort-mates) | nightwatch-mask-removal (face neutral, no smile) |
| **Sentinel** | dawn-patrol (cohort-corridor walk) | siren-key maintenance | dusk-watch from corridor | nightwatch-bunk-watch (siren-key in hand) |
| **Prodigal** | morning-signet-ring polish | coin-purse counting (Free Ports + Empire mix) | dusk-meal alone (one extra plate, never used) | nightwatch-window-watch (looking out porthole) |

#### NB2 prompt template (per activity sprite — instantiate 48×)

```yaml
nb2:
  model: gemini-3-pro-image-preview
  aspect_ratio: "1:1"
  resolution: "1080x1080"
  reference_images:
    - cdn/client-public/art/portraits/_masters/apprentice_<archetype>_<gender>_<variant>_master_face.png
    - cdn/client-public/art/refs/apprentice_berth_<archetype>_master_still.png
  prompt: |
    SUBJECT: <APPRENTICE_<archetype>_<gender>_<variant>_VISUAL>
      from §AC.11.14 — full canonical visual identity verbatim;
      mid-action pose performing the <phase>_<activity> from the
      table above; eyes NOT meeting camera (looking at the
      activity, not at the viewer); the apprentice's signature
      object is in use per the activity (e.g., Zealot
      DAWN scripture-medallion in hand at chest while kneeling;
      Artisan MIDDAY cog-vice in active use; Oracle DUSK tea-
      cup raised); hands and forearms visible engaged with
      the activity; archetype-signature wardrobe matching the
      §AC.11.14 variant.
    COMPOSITION: 1:1 square, 50mm equivalent, three-quarter
      pose, the apprentice fills the upper 70% of canvas;
      the berth backdrop in soft DOF in the lower 30% (bunk-
      corner / table-corner / archetype-signature-fixture in
      bokeh).
    LIGHTING/CAMERA: per-phase overrides — DAWN 5800K warm-gold
      backdrop tint, brightness 0.85, gas-mantle dim and cyber-
      cyan rim dominant; MIDDAY 5400K neutral, brightness 1.0,
      all lighting at full; DUSK 4500K amber-bronze, brightness
      0.78, candles dominant; NIGHTWATCH 3200K cold-blue,
      brightness 0.55, candles + cyber-cyan rim only; ARRI
      Alexa anamorphic; Kodak Vision3 500T pushed +1 (DAWN/
      MIDDAY) or pushed +2 (DUSK/NIGHTWATCH).
    STYLE: APPRENTICE_AESTHETIC; the apprentice in their
      private domestic-warm but accented brass + cyber-cyan
      space; palette `#c9a14a / #5fa8ff / #0d0a08 / #ff2a8a /
      #5a1a1f / #dccfaa`.
    CONSTRAINTS: NB2_CONSTRAINTS_BASE; consistent face structure
      with master_face reference (NB2 character-consistency
      contract); the apprentice is NOT looking at the camera
      (eyes on activity); no third-person framing of an
      observer (the player is implied as visiting but not
      visible — the apprentice is captured as if being seen
      from a doorway threshold); no extra fingers; alpha-
      channel transparent background outside the berth-room
      bokeh extent (so runtime can composite over varying
      backdrops).
    Output 1080x1080 1:1 PNG with alpha-channel transparent
    backdrop edges.
pipeline:
  nb2_seed: 193001..193048   # 12 archetypes × 4 phases = 48
  cdn_target: cdn/client-public/art/sprites/apprentice_<archetype>_<phase>_activity.png
notes: |
  Per-variant master-face matching: the runtime selects the
  apprentice's variant at instantiation per §AC.11.15; the
  activity sprite is generated per ARCHETYPE × PHASE (not per
  variant — that would be 12 × 4 × 3 variants × 2 genders = 288
  sprites, prohibitive). Instead, the activity sprite uses the
  CANONICAL master-face for the archetype × gender × variant_a
  (the default variant); runtime can compose face-replace at
  runtime for variant_b/_c presentations. This is documented
  as a known-quality-tradeoff: variant_b/_c apprentices in their
  berth show the variant_a face from the activity sprite layer,
  with the variant's actual face only resolving in dialog
  headshots (where the variant master_face is correctly
  composited).
```

### §AC.13.2 5 recruits × 4 phases = 20 sprite prompts

Per §AC.5.2, the 5 recruits each have phase-specific activities
(documented in §AC.5.2 table). The NB2 prompts for these
sprites follow the same template as §AC.13.1, with recruit
master_face + recruit signature objects from §AC.10.7 visual
identity strings.

| recruit | activities (DAWN / MIDDAY / DUSK / NIGHTWATCH) |
|---|---|
| **Vex Solène** | tool-cleaning / project-build / blueprint-sketch / bench-asleep |
| **Wraith Calder** | pocket-watch examines / ledger-cipher work / photograph touches / lantern-out |
| **Locke** | code-citing / inquiry-letter writing / judgment-pondering / silent-pacing |
| **Jericho Jones** | pistol-cleaning / trade-negotiations / whiskey-pour / window-staring |
| **Akai Shi** | jar-arranging / spell-citing / altar-tending / necromantic-reading |

```yaml
pipeline:
  nb2_seed: 193049..193068   # 5 recruits × 4 phases = 20
  cdn_target: cdn/client-public/art/sprites/recruit_<recruit>_<phase>_activity.png
```

### §AC.13.3 Activity sprite summary

```
48 apprentice phase-activity sprites
+ 20 recruit phase-activity sprites
= 68 total activity sprites
```

---

## §AC.14 Doctrine-bound outfit overlay (60 variants)

Per §AC.10.4, the `doctrinal` expression state hints at "eyes
carry the doctrine's specific gravitas" but no wardrobe overlay
is specced. Each archetype × doctrine binding gets a small
wardrobe overlay rendered as a separate layer composited over
the base portrait at runtime.

12 archetypes × 5 doctrines = **60 outfit overlay variants**.

### §AC.14.0 Doctrine overlay spec

```yaml
overlay_kind:    additive layer composited over the apprentice's
                 base portrait (any expression state); the overlay
                 introduces a visible doctrine-specific accessory
                 + chalk-glyph + small wardrobe shift
overlay_geometry: 1:1 square 1080x1080 PNG with alpha-channel;
                 the overlay covers only the doctrine-specific
                 elements (mouth-clasp / chalk-marks / wardrobe
                 shift); rest of the layer is fully transparent
applied_when:    apprenticeDoctrines.bind(<doctrine>) state-shift;
                 overlay applies for the apprentice's lifetime
                 (until permadeath or doctrine_rebound, which
                 swaps the overlay)
trait_lock:      doctrine-specific wardrobe per §AC.14.1
```

### §AC.14.1 Per-doctrine wardrobe trait-locks

| doctrine | wardrobe shift | chalk-glyph location | accessory | reason |
|---|---|---|---|---|
| **Compliant Mouth** | a small brass mouth-clasp visible at the lower lip (silenced; ceremonial); the apprentice's voice still works but the clasp is canonically present | a chalk-glyph "𓏏𒌋" (cipher-tongue) traced along the inner left forearm | a brass-bound scripture-medallion (single, not dual) on a chain at chest | "the mouth that is bound, the silence that fits" — Hierarchy Compliant Mouth doctrine signature |
| **Forked Path** | two contrasting brass cuffs — one cyber-cyan-trim, one corruption-pink-trim — on opposing wrists | a chalk-glyph "𒁎𒌋" on the inner right forearm (the choice-glyph) | a single split-coin pendant (half brass, half tarnished silver) at the throat | "the choice that splits" — the apprentice always carries both possibilities |
| **Cold Hand** | thicker leather-and-iron gloves replacing the canonical cohort-issue gloves; one glove permanently holds something small (per archetype: Zealot a brass-bound book / Ghost an audio-recorder / Scholar a pen / etc.) | a chalk-glyph "𒅎𒌋" on the inner left wrist (the still-hand-glyph) | iron-rim glove buckles | "the hand that does not flinch" — Mechronis Cold Hand doctrine of decisive action without compassion |
| **Heretical Quiet** | a chalkboard fragment in a leather sling at the hip (similar to Heretic archetype's signature, but smaller — 6 inch fragment); chalk-dust on the fingertips | NO chalk-glyph (Heretical Quiet refuses faction marks) — but cipher-script in chalk-dust along the cuff edge | brass debate-bell suppressed (cloth-muffled) | "the question that does not stop" — the apprentice carries their question with them |
| **Human Remainder** | a small brass-bound family-portrait frame at the chest (the frame is empty until a memory triggers; per cohort cycle, the frame may fill with a parametric face — the apprentice's lost beloved, lost squad-mate, lost teacher) | a chalk-glyph "𓊞𒌋" on the inner right collarbone (the remembrance-glyph) | a small leather coin-purse at the belt with one specific coin marked (parametric per apprentice's lost connection) | "the remainder that stays" — the apprentice keeps one human bond visible |

### §AC.14.2 Per-archetype × doctrine intersection (60 variants)

For each of the 60 archetype × doctrine pairs, the wardrobe
shift inherits the doctrine's canonical accessory but takes
on archetype-specific texture (e.g., Zealot's Compliant Mouth
mouth-clasp is brass with scripture-cipher engraved on it;
Ghost's Compliant Mouth mouth-clasp is brass with Quarchon
manufacturer's serial-number etched on it; Sentinel's Cold
Hand glove buckle is iron with Imperial-Guard regimental
sigil; etc.).

The full 60-cell matrix is rendered as an enumerated table
at production-time. The runtime composites the appropriate
overlay layer based on `apprentice.archetype` + `apprentice.doctrine`.

### §AC.14.3 NB2 prompt template (per overlay; instantiate 60×)

```yaml
nb2:
  model: gemini-3-pro-image-preview
  aspect_ratio: "1:1"
  resolution: "1080x1080"
  reference_images:
    - cdn/client-public/art/portraits/_masters/apprentice_<archetype>_<gender>_<variant>_master_face.png
  prompt: |
    SUBJECT: a doctrine-bound wardrobe overlay layer for the
      apprentice <APPRENTICE_<archetype>_<variant>_VISUAL> from
      §AC.11.14. The overlay shows ONLY the doctrine-specific
      additions to the apprentice's wardrobe — per the §AC.14.1
      doctrine table: <doctrine-specific wardrobe shift +
      chalk-glyph location + accessory>; archetype-specific
      texture tweak: <archetype-specific tweak per §AC.14.2>;
      the rest of the apprentice's body is transparent (alpha-
      channel) so this overlay can composite over the base
      portrait.
    COMPOSITION: 1:1 square, full body extent; head-and-shoulders
      framing matches the dialog_headshot at 1080x1080;
      transparency where no doctrine-element is present.
    LIGHTING/CAMERA: matches the canonical dialog_headshot
      lighting (5400K diffuse front-fill with 6500K rim) so
      the overlay seamlessly composites; ARRI Alexa
      anamorphic; Kodak Vision3 250D.
    STYLE: APPRENTICE_AESTHETIC; the doctrine-overlay is a
      diegetic in-world wardrobe shift, not a glow-effect or
      modern UI overlay; palette per doctrine — Compliant
      Mouth = brass + cyber-cyan; Forked Path = brass + cyber-
      cyan + corruption-pink; Cold Hand = iron + brass; Heretical
      Quiet = brass + chalk-white; Human Remainder = brass +
      parchment-cream.
    CONSTRAINTS: NB2_CONSTRAINTS_BASE; the overlay layer must
      align pixel-perfectly with the master_face dialog_headshot
      framing; transparent everywhere outside the doctrine-
      element extent; chalk-glyph rendering ≤25 characters
      cipher-script visible; consistent location of chalk-glyph
      across all 12 archetype variants of this doctrine.
    Output 1080x1080 1:1 PNG with alpha-channel.
pipeline:
  nb2_seed: 194001..194060   # 12 archetypes × 5 doctrines = 60
  cdn_target: cdn/client-public/art/overlays/doctrine_<doctrine>_<archetype>_overlay.png
```

---

## §AC.15 Consolidated VFX library

Per-room FX sections in §AC.1 / §AC.4 / §AC.5 / §AC.6 list
inline FX. This section consolidates them into a single
production-side VFX atlas for the audio-post + render pipelines.

### §AC.15.1 Particle effects (atomic VFX assets)

```yaml
brass_spark_micro_particle:
  use: cohort-plaque-etching, doctrine-slip-mint, signature-
    card-form, memory-card-mint, mourning-wall-etching, generic
    "brass-on-brass commemoration" beats
  pipeline: 60 fps; 0.8s burst; warm-gold #c9a14a at peak
    intensity; fades to brass-dust ash in 1.2s
  asset: vfx_brass_spark_micro.glb (animated particle system)

cyber_cyan_static_bed:
  use: comm-screen narrative_silence state, audio-feed bed
    in §AC.4.2 audit booth, dialog UI audio_visualizer
  pipeline: continuous; modulated by amplitude param; brightness
    0-0.4; blue-cyan #5fa8ff with 60Hz mains-hum overlay
  asset: vfx_cyber_cyan_static_bed.shader

candle_flicker_rolling:
  use: every candle-cluster + candle-sconce in apprentice rooms
    (§AC.1.1, §AC.4.1, §AC.4.3, §AC.4.4, §AC.4.6, §AC.5.1, §AC.6
    Archon alcoves)
  pipeline: 4Hz random flicker; warm-amber #ffb84a; subtle
    smoke-curl trail (z+0.3m); intensity-band 0.6-1.0
  asset: vfx_candle_flicker_rolling.shader

gas_mantle_pulse:
  use: pendant lamps in §AC.1.1, §AC.4.1, §AC.4.6 etc.
  pipeline: 4s gentle pulse cycle; warm-amber #ffd166; baseline
    intensity 0.85; pulse to 1.0; phased per-lamp
  asset: vfx_gas_mantle_pulse.shader

fiber_optic_shimmer:
  use: cyber-cyan ribbons in every apprentice room ceiling +
    wall conduits
  pipeline: subtle shimmer + 0.4Hz wave-pulse; cyber-cyan
    #5fa8ff; intensity-band 0.6-0.9
  asset: vfx_fiber_optic_shimmer.shader

sigil_circle_pulse:
  use: every chalk-circle-sigil floor inlay (§AC.1.1, §AC.1.5,
    §AC.4.1, §AC.4.3, §AC.4.4, §AC.5 berths, §AC.6 guild
    common rooms)
  pipeline: 8Hz sub-bass pulse on activation; gold #c9a14a
    rim with occult-violet #4a1a6a inner; activated state
    only (idle = dim)
  asset: vfx_sigil_circle_pulse.shader

incense_smoke_curl:
  use: incense-thurible clusters in §AC.1.1, §AC.1.7, §AC.4.1,
    §AC.4.4, §AC.6 House of Thurible
  pipeline: continuous; thin smoke-curls rising z+0-2.4m;
    subtle parallax; opacity-band 0.05-0.2
  asset: vfx_incense_smoke_curl.particle

forge_ember_glow:
  use: §AC.4.3 forge-flue at apex (always-active)
  pipeline: continuous; warm-orange #ff5a1a peak; subtle
    radiance + ember-spark intermittent
  asset: vfx_forge_ember_glow.shader

corruption_pink_inversion:
  use: TV-infection axis-9 corrupted state across every room
  pipeline: rim-overlay; corruption-pink #ff2a8a replaces
    cyber-cyan at TV-infection band 'corrupted'; chalk-circle
    inverts to occult-pit
  asset: vfx_corruption_pink_inversion.shader

audio_visualizer_waveform:
  use: dialog UI top-edge waveform (per §AC.12.1)
  pipeline: animated; modulates per-voice amplitude; cyber-
    cyan #5fa8ff
  asset: vfx_audio_visualizer.shader

cohort_plaque_etching_animation:
  use: §AC.1.1 cohort-roster wall, §AC.1.6 mourning-wall,
    §AC.4.4 memory-library portrait wall
  pipeline: brass-spark micro-particle cascade + plaque-
    surface text-emerge over 4s
  asset: vfx_plaque_etching.animation

card_burn_at_edge_animation:
  use: §AC.4.4 memory-card consumption, signature-card
    corruption transitions
  pipeline: edge-ignition spreads over 3s; brass-spark
    cascade; voice-over surface chord
  asset: vfx_card_burn_edge.animation

archon_portrait_breathing:
  use: §AC.6 each guild common room Archon Professor
    portrait alcove (12 instances)
  pipeline: subtle 0.25Hz chest-rise/fall; eye-blink every
    8-15s parametric; per-guild light-pulse cycle below
  asset: vfx_archon_breathing.animation

scanline_overlay:
  use: §AC.6 guild Archon portraits + §AC.5.4 Human
    observation comm-screen + §AC.5.5 comm-screen
  pipeline: 4-pixel scanline sweep; opacity 0.05-0.15;
    cyber-cyan tint
  asset: vfx_scanline_overlay.shader

doctrine_slip_mint_animation:
  use: §AC.4.1 doctrine-slip drawer + §AC.5.1 berth wall
    pin animation
  pipeline: brass-spark cascade 1.2s + slip-emerges + slip-
    pin-to-wall sound + visual stick
  asset: vfx_doctrine_slip_mint.animation

braiding_pillar_rope_state_animation:
  use: §AC.1.8 Blood Weave Atrium central pillar
  pipeline: rope strands re-weave on threshold cross; 6s
    transition per band; 5 band-states (dormant→braiding→
    woven→bound→claimed)
  asset: vfx_braiding_pillar_state.animation
```

### §AC.15.2 Per-guild particle accents (12 unique)

```yaml
house_of_iron:        brass-cog particle drift          # vfx_iron_cog.particle
house_of_glass:       crystal-shimmer dust              # vfx_glass_shimmer.particle
house_of_smoke:       smoke-curl drift                  # vfx_smoke_curl.particle
house_of_ledger:      paper-flutter motes               # vfx_ledger_paper.particle
house_of_circuit:     electric-spark micro              # vfx_circuit_spark.particle
house_of_thurible:    incense-smoke drift               # vfx_thurible_smoke.particle
house_of_anvil:       ember-spark cascade               # vfx_anvil_ember.particle
house_of_mirror:      mirror-fragment drift             # vfx_mirror_fragment.particle
house_of_garden:      leaf-and-light drift              # vfx_garden_leaf.particle
house_of_chapel:      candle-flame motes                # vfx_chapel_motes.particle
house_of_tower:       surveillance-line micro           # vfx_tower_lines.particle
house_of_remnant:     dust-and-ash drift                # vfx_remnant_ash.particle
```

---

## §AC.16 Consolidated SFX library

Per-cutscene SFX sections list inline. This consolidates the
canonical set + production-side asset bank.

### §AC.16.1 Atomic SFX assets

```yaml
audio_set:
  brass_etching_chisel:        sfx_brass_etching.wav        (3.0s loop)
  candle_flicker_rolling_bed:  sfx_candle_flicker.wav       (12s loop)
  candle_ignite_chord:         sfx_candle_ignite.wav        (1.2s)
  candle_snuff_chord:          sfx_candle_snuff.wav         (0.8s)
  cog_mechanism_click_1hz:     sfx_cog_click_1hz.wav        (4s loop)
  cog_mechanism_interview_recorder: sfx_interview_recorder.wav (8s loop)
  fiber_optic_hum_60hz:        sfx_fiber_optic_hum.wav      (8s loop)
  forge_bellow_4s_cycle:       sfx_forge_bellow.wav         (4s loop)
  gas_mantle_hiss_bed:         sfx_gas_mantle_hiss.wav      (16s loop)
  pneumatic_tube_whoosh:       sfx_pneumatic_tube.wav       (1.0s)
  pneumatic_tube_arrival:      sfx_pneumatic_arrival.wav    (0.6s)
  brass_spark_micro_particle:  sfx_brass_spark.wav          (0.4s)
  chalk_circle_activate_chord: sfx_chalk_circle.wav         (1.6s)
  doctrine_slip_mint_chord:    sfx_doctrine_mint.wav        (2.0s)
  signature_card_forged_chord: sfx_signature_forged.wav     (3.0s)
  anvil_hammer_strike:         sfx_anvil_hammer.wav         (0.4s)
  card_burn_at_edge:           sfx_card_burn.wav            (3.0s)
  card_emerge_warm_resonance:  sfx_card_warm.wav            (2.4s)
  voice_over_surface_chord:    sfx_voice_surface.wav        (1.6s)
  permadeath_bell_toll:        sfx_permadeath_bell.wav      (4.0s long-decay)
  triple_bell_toll:            sfx_triple_bell.wav          (sacrificed-role return)
  pier_bell:                   sfx_pier_bell.wav            (companion-role return)
  brass_park_bell:             sfx_park_bell.wav            (Celebration Park)
  audit_chamber_silence:       sfx_audit_silent_4s.wav      (Day-21 Warden audit)
  pen_scratch_on_paper:        sfx_pen_scratch.wav          (4s loop)
  page_flip_brass_bound:       sfx_page_flip.wav            (0.8s)
  hooded_figure_robe_rustle:   sfx_robe_rustle.wav          (0.6s)
  warden_greatcoat_subtle_drape: sfx_greatcoat_drape.wav    (1.2s loop)
  scrying_mirror_clear_chord:  sfx_scrying_clear.wav        (2.0s)
  glass_case_ignite_chime:     sfx_case_ignite.wav          (1.2s)
  pneumatic_rifle_unfold:      sfx_pneumatic_rifle.wav      (1.6s — Wanderer's stick)
  cohort_chorus_archetype_recite: sfx_chorus_<archetype>.wav (12 variants × 3.0s)
  dawn_wind_4ms:               sfx_dawn_wind.wav            (16s loop — Warden's Dock)
  coffee_steam_hiss:           sfx_coffee_steam.wav         (16s loop — Warden's Dock)
  sky_transition_dawn_to_amber: sfx_dawn_amber_chord.wav    (8s)
  brass_coin_slide_across_table: sfx_coin_slide.wav         (1.0s)
  thurible_chain_swing:        sfx_thurible_swing.wav       (4s loop)
  console_hum_60hz_bed:        sfx_console_hum.wav          (16s loop — Elara bridge)
  starfield_silent_void:       sfx_starfield_silent.wav     (silent / -56 dB bed)
  shuttle_passing_low_frequency_whoosh: sfx_shuttle_pass.wav (3.0s)
  am_radio_static:             sfx_am_radio_static.wav      (Human's deck)
  signal_resolve_partial:      sfx_signal_partial.wav       (Human reveal stages 2/3)
  signal_resolve_full:         sfx_signal_full.wav          (Human stage 4)
  rope_weave_whisper:          sfx_rope_weave.wav           (Blood Weave Atrium)
  alcove_light_cascade:        sfx_alcove_cascade.wav       (Blood Weave loredex)
  game_master_chord_low:       sfx_gm_chord.wav             (Game Master meta-arc)
  brass_walking_stick_strike:  sfx_walking_stick.wav        (Wanderer)
  archon_portrait_breath:      sfx_archon_breath.wav        (12s loop)
  guild_bell_member_arrival:   sfx_guild_bell.wav           (per guild × 12)
  hierarchy_organ_sub_bass:    sfx_hierarchy_organ.wav      (28Hz; long loop)
  chant_loop_minus_28db:       sfx_chant_loop.wav           (32s loop; ambient bed)
  triangle_event_tense_chord:  sfx_triangle_tense.wav       (8s)
  cohort_resonance_chord:      sfx_cohort_resonance.wav     (4s)
```

### §AC.16.2 Per-archetype VO chord (graduation cohort-chorus)

12 archetype-specific chorus chords for §AC.7.7 graduation cuts:

```
sfx_chorus_zealot.wav        (Pureflame-creche scripture-cadence)
sfx_chorus_ghost.wav         (silent-corps whisper-only, audible only by amplitude)
sfx_chorus_scholar.wav       (Chronarchive cipher-tongue)
sfx_chorus_revenant.wav      (Empire 12th Legion battle-cry, low-decibel)
sfx_chorus_artisan.wav       (Skyforge clockmaker-caste anvil-rhythm)
sfx_chorus_oracle.wav        (Tidewater Five-Gate underwater-trance)
sfx_chorus_wanderer.wav      (Free Ports outer-ring street-cadence)
sfx_chorus_martyr.wav        (Hierarchy redirect-rune chant)
sfx_chorus_heretic.wav       (House of Ledger cipher-tongue, slowed)
sfx_chorus_jester.wav        (Empire-court formal cadence with subtle threat)
sfx_chorus_sentinel.wav      (Imperial Guard regimental cadence)
sfx_chorus_prodigal.wav      (Inner-Empire noble-house anthem, half-remembered)
```

---

## §AC.17 Music score spec — ceremonial chambers

Ambient music score targets per ceremonial chamber. Each carries
a unique cue identity with looping music score. **Cat A
cutscenes are music_eligibility = none**; these scores are for
**ambient room-music**, not cutscene-score.

### §AC.17.1 Per-room music cues

```yaml
A.50_apprentice_hall:
  cue_name:    "The Cohort"
  composition: "harp + harmonium + sub-bass drone 16Hz; chant-loop
                bed -28dB; warm-amber palette match"
  duration:    32s loop
  asset:       music_apprentice_hall.wav

A.51_trial_hall:
  cue_name:    "The Roll"
  composition: "single church-organ note 8Hz; chant-loop -28dB;
                ABSOLUTE-SILENCE during permadeath-bell"
  duration:    16s loop
  asset:       music_trial_hall.wav

A.52_recruit_vestibule:
  cue_name:    "The Mirror"
  composition: "thin string-trio; reverb 1.6s; cyber-cyan
                shimmer accent"
  duration:    24s loop
  asset:       music_recruit_vestibule.wav

A.53_apprentice_cellblock:
  cue_name:    "The Hours"
  composition: "low harp + clock-tick rhythm 1Hz; per-cell
                archetype melody overlay (12 variants)"
  duration:    32s loop with 12 archetype overlays
  assets:      music_cellblock_<archetype>.wav × 12 + base

A.54_hellbox_clone_bench:
  cue_name:    "The Restored"
  composition: "sub-bass 8Hz + church-organ + sigil-chord; absolute-
                silence during restoration"
  duration:    16s loop
  asset:       music_clone_bench.wav

A.55_mourning_wall:
  cue_name:    "The Names"
  composition: "candle-flicker rolling bed + dirge-cadence chant-
                loop -32dB; absolute-silence outside event"
  duration:    24s loop
  asset:       music_mourning_wall.wav

A.56_essence_harvest_sanctum:
  cue_name:    "The Vault"
  composition: "low harp + thurible-rhythm + cyber-cyan accent"
  duration:    32s loop
  asset:       music_harvest_sanctum.wav

A.57_blood_weave_atrium:
  cue_name:    "The Weave"
  composition: "five-strand harp counterpoint (one per band-state);
                sub-bass 16Hz; reverb 5.2s"
  duration:    48s loop with 5 band-state variations
  asset:       music_blood_weave.wav (+ 4 transition cues)

A.58_personal_quest_ledger:
  cue_name:    "The Ledger"
  composition: "thin harp + parchment-rustle bed; cyber-cyan
                accent"
  duration:    24s loop
  asset:       music_personal_quest_ledger.wav

A.59_doctrine_binding_chamber:
  cue_name:    "The Pulpit"
  composition: "single chamber-organ chord; reverb 4.4s;
                chant-loop -32dB"
  duration:    32s loop
  asset:       music_doctrine_chamber.wav

A.60_audit_chamber:
  cue_name:    "The Inquiry"
  composition: "absolute-silence interrupted by cog-mechanism
                interview-recorder 1Hz; chant-loop -36dB; Day-21
                Warden variant ABSOLUTE-SILENCE"
  duration:    16s loop
  asset:       music_audit_chamber.wav

A.61_the_forge:
  cue_name:    "The Hammer"
  composition: "anvil-strike rhythm 4s cycle; bellows 4s; ember-
                glow chord; reverb 2.8s"
  duration:    32s loop
  asset:       music_forge.wav

A.62_memory_card_library:
  cue_name:    "The Remembered"
  composition: "single harp note + wind-instrument-trio + chant-
                loop -36dB; absolute-silence during inheritance"
  duration:    24s loop
  asset:       music_memory_library.wav

A.63_park_training_barracks:
  cue_name:    "The Park"
  composition: "soft children-laughter -42dB + park-bell-chime +
                APPRENTICE_AESTHETIC accent"
  duration:    32s loop
  asset:       music_park_barracks.wav

A.64_triangle_event_alcove:
  cue_name:    "The Triangle"
  composition: "tense-chord 4-second cadence; reverb 1.6s;
                acoustic isolation"
  duration:    16s loop
  asset:       music_triangle_alcove.wav

A.65_warden_dock:
  cue_name:    "The Coffee"
  composition: "single piano-note + dawn-wind + audio-feed-speaker
                hum; absolute-silence between Warden's lines"
  duration:    24s loop (but used only in cutscene context)
  asset:       music_warden_dock.wav

A.66_mission_briefing_war_room:
  cue_name:    "The Roster"
  composition: "low brass-bass + holographic-grid 60Hz hum +
                deployment-bell chime"
  duration:    32s loop
  asset:       music_war_room.wav

A.67_post_mission_return:
  cue_name:    "The Return"
  composition: "per-role variation: companion = pier-bell;
                cryo_vault = vital-monitor cadence; army_leader =
                regimental brass; trade_envoy = abacus + ledger
                rustle; tower_captain = surveillance-grid hum;
                sacrificed = triple-bell-toll; relationship_gift
                = harp single-note"
  asset:       music_return_<role>.wav × 7

A.68_apprentice_berths:
  cue_name:    "The Bunk"
  composition: "domestic-warm white-noise + per-archetype 12-melody
                overlay; per-phase tint modulation"
  duration:    32s loop with 12 archetype × 4 phase = 48 variants
  asset:       music_berth_<archetype>_<phase>.wav (sparse — most
               variants are minor variations)

A.6_guild_common_rooms:
  cue_name:    "The Hall"
  composition: "per-guild palette music; 12 variants with shared
                Archon Professor breathing-rhythm bed"
  duration:    32s loop × 12 guild variants
  asset:       music_guild_<house_id>.wav × 12
```

---

## §AC.18 Trained-crew graduation outfit overlay

When an apprentice graduates from `productionPath: "trial"` to
`productionPath: "trained"` (per `apprenticeToCrew.ts`), their
visual presentation shifts. This shift is rendered as a separate
overlay layer composited over the base portrait at runtime.

### §AC.18.1 Trained-crew overlay spec

```yaml
overlay_kind: full-body wardrobe shift; replaces the apprentice
              cohort-issue gear with trained-crew gear specific
              to their assigned post-graduation role
applied_when: `apprentice_trial_graduated_<archetype>` flag fires
              AND mission deployment role is assigned
trait_lock:   per role + archetype; archetype-specific signature
              object retained, cohort-issue gear replaced

per_role_overlay:
  companion:           full-crew issue uniform (Empire-style brass-
                       and-leather; archetype-signature-object retained
                       at appropriate location); cohort-roster brass
                       graduation-pin at lapel
  cryo_vault:          medical-aide robe (Med Bay clinical-cold palette;
                       redirect-rune for Martyr-archetype)
  army_leader:         field-officer brass-and-leather; graduation
                       brass war-banner adornment
  trade_envoy:         trade-attaché brass-rim formal coat
  tower_captain:       surveillance-officer command-grey + brass-rim
                       collar-pin
  sacrificed:          (this role does not graduate to trained — they
                       are honoured posthumously; outfit overlay is
                       posthumous mourning-livery for ghost-portrait
                       use only)
  relationship_gift:   private-citizen civilian wear; brass-rim
                       graduation-pin only

graduation_pin: brass-and-cyber-cyan trim with archetype-glyph;
                12 archetype-pin variants
```

### §AC.18.2 Per-role × archetype intersection

5 graduation-eligible roles × 12 archetypes = **60 trained-crew
overlay variants**. (Sacrificed and relationship_gift roles
are posthumous-only or non-uniform.)

NB2 prompt template (per overlay; instantiate 60×):

```yaml
nb2:
  reference_images:
    - cdn/client-public/art/portraits/_masters/apprentice_<archetype>_<gender>_<variant>_master_face.png
  prompt: |
    SUBJECT: a graduation outfit overlay for the trained-crew
      apprentice <archetype>-<role>; per §AC.18.1 the overlay
      shows the role-specific wardrobe replacement (full-body
      extent); archetype-signature object retained at canonical
      position; brass-and-cyber-cyan graduation-pin at lapel
      with archetype-glyph; cohort-issue gear absent (replaced
      by role uniform); all transparency outside the body
      extent.
    [...standard NB2 5-block schema continues...]
pipeline:
  nb2_seed: 195001..195060   # 5 roles × 12 archetypes
  cdn_target: cdn/client-public/art/overlays/trained_crew_<role>_<archetype>_overlay.png
```

---

## §AC.19 Notable Alumni rosters (12 guilds × 5 alumni each = 60)

Each of the 12 guild common rooms (§AC.6) carries a Notable
Alumni roster on the west bookshelf / ledger-wall. The roster
is a real list of 5 named alumni per guild, each with a
mini-canon entry. These are non-player-character lore figures
referenced in the runtime via `apps/shared/guildHouses` and
visible in §AC.6 Archon Professor dialog.

### §AC.19.1 Per-guild alumni (5 each)

Each entry: name + alumni-class-year + brief lore bio (1-2
sentences) + alumni-portrait reference.

```yaml
house_of_iron:
  - "Arval Steele-Drumm (Y8): forged the brass cog-mechanism for the
    Hierarchy Throne's vault-door; assassinated at age 51."
  - "Prima Steele-Vorr (Y14): only Iron alumna to also bind the Forge
    of Anvil signature; current Empire 12th Legion's metallurgy chief."
  - "Halix Caldarn-Steele (Y22): expelled at Y22 for forging brass
    counterfeit Hierarchy medallions; fugitive."
  - "Cassia Steele-Drumm (Y30): sister of Arval; rebuilt the cog-
    mechanism after his assassination; now Archon Steele's deputy."
  - "Voxar Iron-Mor (Y34): Quarchon — only Quarchon Iron alumnus;
    designed the Mechronis Auditor brass-mask."

house_of_glass:
  - "Lenz the Younger (Y6): grand-niece of Archon Lenz; built the
    Tidewater scrying-mirror prototype; vanished at age 28."
  - "Vermeil Lenz-Caedrune (Y12): cipher-script restoration; co-
    cited with Tien Ceadrune in Far-South archives."
  - "Aev Lenz (Y19): Demagi — Five-Gate Order seer's apprentice;
    built the Glass Eye signature ability used by Oracle archetype."
  - "Markus Lenz-Drumm (Y26): Empire 12th Legion liaison; killed
    at Veridian VI alongside Bohl-Mor Krellix."
  - "Ilara Lenz-Vekka (Y31): Free Ports brokerage; current trade
    contact of Lord Avern Thessler (Prodigal canon)."

house_of_smoke:
  - "Veil-Mor (Y4): founder of the Panopticon's Silent Corps;
    Glenmar's grandfather; purged at age 67 by Inspector Veil-7."
  - "Smokara Veil-Drumm (Y11): wrote the canonical Silent Corps
    training manual; current location classified."
  - "Calyx Veil-Mor (Y18): fled to Free Ports at age 22; Wraith
    Calder's mentor (Tier-2 recruit canon)."
  - "Ressa Veil (Y25): Demagi — only non-Quarchon Smoke alumna;
    assassinated by her own brother."
  - "Glenmar Veil-2 (Y31): Sira Null-Echo's handler in Silent
    Corps; purged on Day-21 audit of his own apprentice (Ghost
    canon backstory)."

house_of_ledger:
  - "Quill the Elder (Y2): founder of House of Ledger; Archon Quill's
    great-uncle; alive at 102."
  - "Pell-Mor Caedex (Y9): expelled at Y9 for the same heresy
    Caedex Vorr asked at Y34 — the question runs in the family."
  - "Iva-Marl Sinder (current Y31): Martyr archetype apprentice;
    her name is etched in Notable Alumni though she has not
    graduated yet — cohort-mid ledger entry."
  - "Tien Ceadrune Sr. (Y17): Tien Ceadrune's mother; Game Master
    alumna; redacted from House of Ledger archives."
  - "Avern Thessler-Quill (Y24): Lord Avern's elder sister;
    declined the apprentice trial; runs the Thessler shipping-
    house in his absence (knows he is alive)."

house_of_circuit:
  - "Wirework the Elder (Y3): founder; Archon Wirework's grand-
    parent; Quarchon — the first Quarchon to bind the Circuit
    signature."
  - "Pellix Vaun-Brass (current Y26): Artisan archetype apprentice;
    cohort-mid ledger entry."
  - "Vex Solène (current; non-graduate): Tier-2 recruit canon;
    listed as Notable Alumna for her Skyforge inventions even
    though she did not attend the apprentice cohort."
  - "Mer Halflaugh (Y26): Vex'rah's brother; Quarchon court-
    guard; assassinated at Y28 — name on the Panopticon list
    (Jester canon backstory)."
  - "Ilex Wirework-Vorr (Y32): Demagi — Heretic-aligned; built
    the Pedagogy Hub holographic deployment-grid (§AC.4.8)."

house_of_thurible:
  - "Smoke (Y5): founder; Archon Smoke's predecessor."
  - "Aevel of the Five Gates (current Y33): Oracle archetype
    apprentice; cohort-mid ledger entry; her tea-leaf reading
    of the Game Master's birth-name is recorded here."
  - "Ila Smoke-Sinder (Y14): Iva-Marl Sinder's mother; redirect-
    rune surgeon; killed protecting a Pureflame conscript."
  - "Cael Veil-Smoke (Y22): collaborated with Veil family across
    factions; current location: Tidewater Archive."
  - "Ren Calpha (Y27): Prodigal's Free Ports alias; listed under
    his alias in Thurible records (which means Thurible knew —
    a quiet revelation for Lord Avern)."

house_of_anvil:
  - "Hammer the Elder (Y1): founder; Archon Hammer's
    grandparent."
  - "Bohl-Mor Krellix (current Y31): Revenant archetype apprentice;
    cohort-mid ledger entry; the only restored-soldier alumna
    in Anvil records."
  - "Marsa Hammer-Drumm (Y9): forged the Heart Stone for §AC.1.x
    Castle of Death A.20; assassinated at her own forge."
  - "Vorr Anvil-Steele (Y16): cross-house Anvil/Iron; current
    Empire 12th Legion's quartermaster."
  - "Pell Caedrune (Y23): the wrongful-execution victim from
    Sentinel canon backstory; his name is etched on the alumni
    roster despite his execution — a Hammer protest gesture."

house_of_mirror:
  - "Glass-Mask the Elder (Y2): founder; the original brass-
    bound mirror-mask; deceased at Y45."
  - "Reva Mirror-Drumm (Y8): only alumna to remove the mirror-
    mask; killed by it within the same hour (the mask was
    cursed; this is canonical)."
  - "Aevor of the Five Gates (current Y33): Oracle male variant
    apprentice; cohort-mid ledger entry."
  - "Cael Mirror-Veil (Y17): cross-house Mirror/Smoke; current
    Panopticon archivist."
  - "Sira Null-Echo (current Y29): Ghost archetype apprentice;
    cohort-mid ledger entry; the mirror-mask in the Mirror common
    room shows her face only when she is not looking — recorded
    Y29 anomaly."

house_of_garden:
  - "Vine the Elder (Y4): founder; Archon Vine's grandmother;
    cultivated the first cyber-cyan-thread vine."
  - "Iva-Marl Sinder (current Y31): Martyr archetype; cross-
    house Garden/Thurible; cohort-mid entry."
  - "Marsa Garden-Sinder (Y11): Iva-Marl's grand-aunt; redirect-
    rune surgeon and gardener; her hybrid plants are in the
    Tidewater Archive."
  - "Cassia Garden-Drumm (Y19): Empire 12th Legion's herbalist;
    current location classified."
  - "Avern Garden-Thessler (Y26): Lord Avern Thessler's
    great-grandfather; founded the Thessler shipping-house's
    Garden division."

house_of_chapel:
  - "Bell the Elder (Y6): founder; Archon Bell's grandparent."
  - "Iva-Marl Sinder (current Y31): Martyr; cross-house Chapel/
    Thurible; cohort-mid entry."
  - "Kareth Vael-Drumm (current Y24): Zealot archetype apprentice;
    cohort-mid ledger entry."
  - "Sera Chapel-Vael (Y15): Pureflame priest; survived the same
    Day-of-Ash ritual as Kareth (8 years prior); her medallion
    is the one Kareth's chant-master wore."
  - "Pell Caedrune (Y23): cross-listed with Anvil; the wrongful-
    execution victim; etched here too as a Chapel protest."

house_of_tower:
  - "Watch the Elder (Y3): founder; Archon Watch's grandparent."
  - "Marcus Farrow (current Y42): Sentinel archetype apprentice;
    cohort-mid ledger entry."
  - "Ren Calpha (Y27): cross-listed with Thurible; Prodigal's
    Free Ports alias."
  - "Halix Tower-Caldarn (Y14): Forward Bastion garrison
    commander; killed in the wrongful-execution incident's
    aftermath six months later."
  - "Veil-2 (Y31): cross-listed with Smoke; Sira Null-Echo's
    handler."

house_of_remnant:
  - "Sigh the Elder (Y4): founder; Archon Sigh's mother;
    bone-and-blood-red robes."
  - "Bohl-Mor Krellix (current Y31): Revenant; cross-house
    Remnant/Anvil; cohort-mid entry."
  - "Pell Caedrune (Y23): cross-listed with Anvil and Chapel;
    the wrongful-execution victim; Remnant carries his ash."
  - "Mer Halflaugh (Y26): cross-listed with Circuit; Vex'rah's
    brother."
  - "Tava Calpha (Y19): Roon Calpha's older sister; died in the
    Free Ports market dome collapse; her name is etched here
    despite never having attended the cohort."
```

### §AC.19.2 Cross-references

Notable Alumni names that are cross-listed across multiple
guilds (the canonical "this person was significant to multiple
houses") are highlighted in italics in the rendered roster.
The cross-listing is canonically the apprentice / ancestor's
multi-faceted life — Pell Caedrune appears in 3 houses
(Anvil, Chapel, Remnant) because he was significant in three
different ways (forge-master, Pureflame priest, bone-relic-
keeper) before his wrongful execution.

---

## §AC.20 Memory-card-recipient visual overlay

When a new apprentice consumes a Memory Card (per §AC.7.4
`cs_memory_card_inheritance_<archetype>`), the dead apprentice's
voice surfaces in the new apprentice's dialog. The visual
companion to this beat: the new apprentice briefly carries the
dead apprentice's eye-glow or scarification overlay.

### §AC.20.1 Overlay spec

```yaml
overlay_kind:    transient (8s) overlay layer composited over
                 the inheriting apprentice's portrait during
                 the inherited line's delivery
applied_when:    inherited line surface (per
                 `apprenticeMemoryInheritance.ts` trigger)
trait_lock:      dead apprentice's signature visual cue overlays
                 the recipient's face for 8s; cue includes one
                 of: cyber-cyan eye-glow, scarification cipher
                 micro-pattern, faint occult-violet temple-tint
                 (Demagi inheriting Demagi only), or chalk-glyph
                 transfer

duration:        8 seconds; fade-in 0.8s, hold 6.0s, fade-out 1.2s

asset_id:        ui_memory_inheritance_overlay_<archetype>.png
                 × 12 (one per dead-apprentice archetype)

nb2_prompt:      same template as §AC.14 doctrine overlay; the
                 overlay shows ONLY the dead-apprentice's signature
                 visual cue (eye-glow / scarification overlay /
                 etc.) with alpha-channel transparency outside the
                 cue extent

pipeline:
  nb2_seed:      196001..196012   # 12 dead-apprentice archetypes
  cdn_target:    cdn/client-public/art/overlays/memory_inheritance_<archetype>.png
```

---

## §AC.21 Cross-doc TBDs final reconciliation

This section is the canonical close of the apprentice + commons +
pedagogy + berth production-doc rollout. It enumerates every
outstanding TBD across all sub-sections and assigns a follow-up
action.

### §AC.21.1 Cumulative roster (post-PR)

| group | renders / spaces / cuts |
|---|---|
| Apprentice rooms (§AC.1 + §AC.4) | 21 |
| Berth surfaces (§AC.5) | 5 logical, 20 production assets |
| Guild common rooms (§AC.6) | 12 |
| Cutscenes (§AC.2 + §AC.7) | 357 |
| Apprentice canon characters (§AC.11) | 12 archetypes × 2 genders × 3 variants = 72 |
| Recruit canon characters (§AC.10.7) | 5 |
| Named-NPC canon (§AC.10.8 + Inspector Veil-7) | 16 (12 Archons + Veil-7 + Auditor + Quartermaster + Cohort group) |
| Master-face renders (§AC.11.16) | 1 anchor + 72 apprentice + 5 recruits + 16 NPC = 94 |
| Downstream 11-asset renders | 94 × 11 = 1,034 |
| Artifact-faced art (§AC.10.9) | 358 (5 doctrine slips + 36 audit transcripts + 29 mission dossiers + 24 memory cards + 216 signature cards + 48 plaques) |
| UI surface renders (§AC.12) | 89 |
| Activity sprites (§AC.13) | 68 |
| Doctrine outfit overlays (§AC.14) | 60 |
| VFX assets (§AC.15) | ~30 atomic + 12 per-guild |
| SFX assets (§AC.16) | ~80 atomic |
| Music score cues (§AC.17) | ~25 distinct cues + variants |
| Trained-crew outfit overlays (§AC.18) | 60 |
| Notable Alumni rosters (§AC.19) | 60 entries |
| Memory-recipient overlays (§AC.20) | 12 |
| **TOTAL ART RENDERS** | **~1,800 PNG renders** |
| **TOTAL CDN STORAGE** | **~14 GB** (rendered assets + reference images) |

### §AC.21.2 Outstanding TBDs by category

```
[A] §F.1 cross-cut sync — 460 cutscene IDs need spine entries
    in _PRODUCTION_CROSS_CUT.md §F.1.A.4-A.16
    Owner: production doc-sync; not blocking asset generation

[B] VO manifest line numbers — 24 archetype × gender + 17 new
    NPC manifests + 4 pedagogy line-banks (2,496 lines) need
    lineId mapping
    Owner: VO pipeline lead; blocking audio post

[C] 17 new VO manifests (essence harvester, restored apprentice,
    12 archons, Veil-7, Mechronis auditor, quartermaster) need
    initial authoring
    Owner: VO authoring; blocking dialog system

[D] Banter scene 157-pair × dialog-headshot rendering — these
    are dialog-system content not cutscenes; production renders
    are 5 named recruits + 12 archetypes × 6 expressions = 102
    headshots already covered by §AC.10.4 expression set;
    Owner: no additional TBD; covered in §AC.10

[E] Game Master meta-arc cinematic — at blood-weave alignment 40+,
    the §AC.2.5 alignment-40 cut leads into a separate cinematic
    arc; production scope lives in a separate doc (out of
    scope for this rollout)
    Owner: separate cinematic doc; reserved as Act-7 storyteller hook

[F] Wraith Calder's scratched photograph — Act-5 reveal cut
    (cs_wraith_e2_betrayal_reveal); the photograph's contents
    (Game Master's younger form) is a separate authoring task
    Owner: narrative pass; reserved storyteller hook

[G] 4 Warden's-candidate apprentice runtime overlay — runtime
    composition, not a separate render batch (per §AC.10.15)
    Owner: runtime; resolved

[H] Non-binary apprentice parametric variants — runtime mixes
    male+female master faces; no separate non-binary master
    render needed (per §AC.10.15)
    Owner: runtime; resolved

[I] Audit-transcript per-archetype × per-day composition —
    profile_hero + cipher-script body + Auditor signature in
    3 layers; production-side paste-up workflow (no NB2 render
    per cell)
    Owner: production-side composition; not blocking

[J] 13th-essence-vault, 13th-mourning-frame, 13th-deliverable-
    case Act-7 reveals — narrative reveals; production-side
    asset reserved but content authored at narrative pass
    Owner: narrative pass; reserved

[K] Per-archetype × variant face composition for activity
    sprites — runtime face-replace via composition (per §AC.13.1
    notes); if production wants explicit per-variant activity
    sprites, expand to 12 × 4 × 3 × 2 = 288 sprites (out-of-
    scope; runtime workaround documented)
    Owner: runtime; resolved (with quality-tradeoff note)

[L] Music score loops — 25 cue identities listed; production
    audio team to compose; per-loop duration + texture spec
    in §AC.17
    Owner: audio composition; not blocking visuals

[M] Cohort group portrait per-cycle render — parametric per
    cohort cycle; runtime composes from individual master_faces;
    no separate batch render needed
    Owner: runtime; resolved

[N] Notable Alumni portrait references — §AC.19 has 60 named
    alumni; portrait renders for these are out-of-scope (alumni
    appear as etched names + brass plaques in §AC.6 west bookshelves;
    no individual portraits rendered)
    Owner: not rendered; resolved as text-only

[O] Trained-crew outfit overlay × archetype × variant matrix —
    60 role × archetype overlays in §AC.18 are per archetype only
    (variant face composed at runtime); same approach as activity
    sprites
    Owner: runtime; resolved

[P] Per-guild Archon Professor full master_face + 11-asset set —
    12 Archons × 11 = 132 renders; covered in §AC.10.8 + master_
    face seeds documented (190601..190732)
    Owner: covered; in scope of upcoming render batch
```

### §AC.21.3 Production handoff (final)

The cumulative production-side asset-generation pipeline is:

1. **Master-face anchor batch** (§AC.11.16):
   - 1 `apprentice_aesthetic_anchor.png` (single render)
   - 72 apprentice variant master_faces (12 archetypes × 2
     genders × 3 variants)
   - 5 recruit master_faces (per §AC.10.7)
   - 16 named-NPC master_faces (12 Archons + Veil-7 +
     Auditor + Quartermaster + Cohort group)
   - **Total: 94 master-face renders**

2. **Downstream 11-asset batch per character** (§AC.10.3):
   - 94 master_faces × 11 assets each = 1,034 renders

3. **Artifact-faced batch** (§AC.10.9):
   - 358 renders (cards, plaques, transcripts, dossiers, slips)

4. **UI surface batch** (§AC.12):
   - 89 renders (UI chrome)

5. **Activity sprite batch** (§AC.13):
   - 68 renders (apprentice + recruit per-phase activities)

6. **Outfit overlay batch** (§AC.14 + §AC.18 + §AC.20):
   - 60 doctrine + 60 trained-crew + 12 memory-inheritance =
     132 renders (overlay layers)

7. **Cutscene asset batch** (per §AC.7 + §AC.2 cutscenes):
   - 357 cutscenes × ~5 assets each (start.png + end.png +
     clip.mp4 + audio_post.wav + meta.json) = ~1,785 cutscene
     production files

8. **Audio asset batch** (§AC.16 + §AC.17):
   - ~80 atomic SFX + 25 music cues + 12 per-archetype chorus +
     pedagogy line-bank lineId mapping (2,496 lines)

9. **VFX asset batch** (§AC.15):
   - ~30 atomic VFX + 12 per-guild particles + various per-room
     animations

**Cumulative render count**: ~3,500 individual production assets.
**Cumulative storage estimate**: ~14 GB CDN.
**Cumulative NB2 generation cost**: ~$140 (94 master + 1,034
downstream + 358 artifacts + 89 UI + 68 sprites + 132 overlays
= 1,775 still renders × ~$0.04 + cutscene Veo costs from earlier
audits).

The runtime is unchanged across this entire rollout. `pnpm check`
+ `pnpm ship:check` remain N/A for the doc.

End of `_PRODUCTION_APPRENTICE_COMMONS.md` final rollout (PR #580
expansion + canon characters + variant faces + remaining art /
UI / VFX / SFX / music / overlays / alumni).

---

## §AC.22 Game Master Act-7 meta-arc cinematic

This section authors the **Game Master Act-7 meta-arc cinematic** —
the climactic cutscene that fires when the player crosses
**blood-weave alignment 40+** (the "claimed" band) per
`apps/shared/bloodWeave.ts` threshold table. It was reserved as
Outstanding TBD [E] in §AC.21.2 / referenced as the
end_shatter variant of `cs_blood_weave_loredex_revealed_n=12`
in §AC.2.5 / and as the Act-5 photograph-reveal narrative-tie
in §AC.21.2 [F] (Wraith Calder's scratched-out photograph =
Game Master in younger form).

This is a **NEW cinematic category**: **Cat D — meta-arc**
(distinct from Cat A / B / C from §3.1). Cat D specifications:

```
length:              4 minutes total = 30 × 8s clips stitched
duration_seconds:    240 (longer than any prior cutscene)
veo_stitch_pattern:  29 frame-stitches; first/last frames chained;
                     consistent reference_images across all 30 clips
music_eligibility:   theme-defining (full orchestral score allowed;
                     Cat D is the ONLY category with composer-led
                     score)
fpv_strict:          relaxed for the Game Master reveal beat (a
                     mirror cut shows the player's own face from
                     across the chessboard — the only canonical
                     player-face reveal in the entire game)
trigger:              `bloodWeave.alignment >= 40` AND player has
                      crossed loredex thresholds 1–11 in order
recurrence:           once per save-game; the cinematic plays once
                      and locks runtime branch state
```

### §AC.22.1 NEW host_space — A.73 The Tier-Infinity Chess Hall

A pocket-dimension Chess Hall accessible only via the Blood
Weave Atrium's central braiding-pillar at alignment 40+. The
Atrium's pillar serves as the threshold; crossing into Tier-
Infinity is one-way until the cinematic resolves.

#### Header

```
space_id:        ark.tier_infinity_chess_hall
space_name:      The Tier-Infinity Chess Hall
space_type:      pocket_dimension (sub-Ark; non-Euclidean)
act_introduced:  Act 7 (cinematic-only; not free-roam)
lore_anchor:     loredex.system.game_master_metaarc + arc.alignment_claimed +
                 arc.act_7_metaarc_unlock
aesthetic_tier:  steampunk_cyberpunk_occult_metaarc  (APPRENTICE_AESTHETIC
                 + Tier-3 Labyrinth Wager violet-rim overlay + non-
                 Euclidean geometry distortion)
```

#### Geometry — non-Euclidean

```
dimensions:           apparent 24m × 24m × 16m chamber, but the
                      geometry is non-Euclidean — walls recede at
                      shallow angles, ceiling rises non-linearly,
                      floor pattern repeats infinitely toward the
                      horizon
origin_point:         centre of floor at the 12-board chessboard array
floor_plan_geometry:  square apparent footprint with infinite-recursion
                      perspective; 12 chessboards arrayed in a 3×4 grid
                      at the centre
volumetric_anomalies: gravity-axis tilts 8° at z+0–8m (player feels
                      slightly off-balance throughout); below z+0 the
                      floor pattern continues visually but is a
                      projection (false-floor); above z+12m the
                      ceiling vanishes into deep-violet anomaly mist
```

#### Floor / walls / ceiling / lighting (compact)

```
floor:    polished black-marble + gold-blood-channel concentric inlay
          + 12-board chessboard array at centre (3×4 grid; each board
          is the canonical Hierarchy's-Table brass-rim with serpentine
          glyphs from §AC.4 / §G.2.5; one board per past cohort + one
          unfilled for the player)
walls:    stone-and-brass with cyber-cyan fiber-optic conduits running
          from floor to vanishing point at the horizon; 12 perimeter
          brass plates etched with the 12 Game Masters from prior
          cycles (each plate carries a name + cycle-id + alignment-
          signature); one plate is unfilled (reserved for the current
          player IF they accept the meta-arc)
ceiling:  vaults to z+12m apparent, then opens into deep-violet anomaly
          mist; 12 hanging-chain candle-clusters descending z+10–4m
          (one above each chessboard); apex sigil etched in brass
          spans the entire visible ceiling (the Hierarchy claim-mark)
key:      1800K candle (12 cluster-lights); 6500K cyber-cyan rim from
          fiber-optic conduits at the horizon-vanishing-point;
          12000K occult-violet at apex sigil; deep-violet ambient
          from the ceiling-mist
ambient:  20 lux ground (intentionally dim; ceremonial); brightness
          per-beat parametric per cinematic act-structure
```

#### Atmosphere + sound

```
temperature: 12°C (cold; non-Euclidean spaces have ambient cold)
humidity:    20% (very dry — the chess pieces never warp)
smell:       cold-stone + parchment-cream + machine-oil + faint ozone
             from the fiber-optic horizon
sound:       8.4 s reverb (cathedral-grade plus pocket-dimension
             extension — the longest reverb in the game); chant-loop
             bed -24 dB; sub-bass 4 Hz drone (pocket-dimension
             gravitational signature); chess-piece tap echoes audibly
             across the entire chamber
```

#### Objects (cinematic-only inventory)

```
- 1 central 12-board chessboard array (3×4 grid; each board is brass-
  rim mahogany with serpentine glyphs):
    Boards 1-11: each carries a partial chess game in progress (the
                 prior 11 cycle-Game-Masters' games; pieces parametric
                 to that cycle's outcome)
    Board 12:    fully arranged opening position; the player's board
- 1 Game Master figure seated at board 12, north side (FACELESS until
  the reveal beat — wears the Tier-3 hooded variant of the canonical
  Game Master figure)
- 1 Mol'Garath silhouette at the audience-head (z+8m raised dais; only
  the eyes glow dim violet; never speaks until beat 5)
- 12 hooded demon-bishops at perimeter (3 m radius rings; one per
  chessboard; each watches their assigned board)
- 1 mentor's chair at south of board 12 (player-position; mahogany-and-
  brass; cog-arm-rest)
- 12 brass-bound clipboards (each at a perimeter post; carries the
  cycle-Game-Master's name + alignment-signature + final-game-state)
- 1 mirror-mask in a brass case at frame-right of board 12 (the Game
  Master's mask; closed throughout cinematic; opens at the choice
  beat)
- 1 shattered loredex alcove visible high in the back wall (the
  origin-portal from the Blood Weave Atrium pillar — visible as
  a violet cracked sigil; closed but still glowing)
```

#### Camera spawns (one per cinematic beat)

```
- cs_act7_metaarc_b1_atrium_dissolves       (beat 1; 8s)
- cs_act7_metaarc_b2_chesshall_reforms      (beat 2; 8s)
- cs_act7_metaarc_b3_twelve_boards_reveal   (beat 3; 8s)
- cs_act7_metaarc_b4_game_master_face       (beat 4; 12s stitched 8+4)
- cs_act7_metaarc_b5_molgarath_speaks       (beat 5; 8s)
- cs_act7_metaarc_b6_wraith_appears         (beat 6; 12s stitched 8+4)
- cs_act7_metaarc_b7_the_choice             (beat 7; 16s stitched 8+8)
- cs_act7_metaarc_b8a_choice_take_his_place (beat 8a outcome; 8s)
- cs_act7_metaarc_b8b_choice_refuse         (beat 8b outcome; 8s)
- cs_act7_metaarc_b8c_choice_negotiate      (beat 8c outcome; 12s stitched)
```

Total cinematic length per branch:
- Take his place branch: 88 s
- Refuse branch: 88 s
- Negotiate branch: 92 s

Plus pre-branch beats 1–7: 72 s. **Total cinematic ~160-164 s
per playthrough** (not the full 240 s the 30-clip estimate
suggested — the meta-arc compresses; final length is closer to
3 minutes than 4 minutes).

#### Doorways

```
- north (origin):  shattered loredex alcove (one-way from Atrium pillar)
- exit:            no canonical doorway — player exits via the choice
                   beat outcome:
  branch_take_place: player teleports back to Tier 0 Chess Hall as the
                     new Game Master (NPC role-shift)
  branch_refuse:     player teleports back to Apprentice Hall with
                     alignment reset to 30 (loses 10 alignment;
                     "unclaimed" branch)
  branch_negotiate:  player teleports back to Apprentice Hall with
                     alignment locked at 40 indefinitely; access to
                     a hidden Tier-4 chess match against Mol'Garath
                     (out-of-scope cinematic; Act-7+ DLC reservation)
```

#### Story-tie

When `bloodWeave.alignment >= 40` AND player crosses the
12 loredex thresholds (1, 2, 3, 5, 7, 9, 12, 15, 20, 25, 30,
40), the runtime fires the cinematic. The cinematic plays
once per save-game; outcome locks runtime state. The
Game Master's true face is revealed at beat 4 — and is the
player's own face from the canonical master_face render
(per §AC.11.16 master-face anchor; the cinematic uses the
player's own canonical face composited at runtime).

#### FX + performance

```
FX:           candle-flicker (12 clusters); fiber-optic horizon-
              vanishing-point shimmer; non-Euclidean geometry warp
              shader (subtle perspective distortion); sub-bass 4 Hz
              gravitational pulse (visible as floor-pattern
              breathing); apex sigil pulse (intensifies during
              choice beat); pillar-shatter origin alcove cracked-
              sigil cyber-cyan glow; mirror-mask hinge animation
performance:  3.6M tris (12 chessboards × 32 pieces each = 384
              chess pieces alone); 720 MB; 36 lights; non-Euclidean
              shader budget +20% over canonical Ark room
```

#### 13-state axis grid (Act-7 meta-arc room)

| axis | state-list |
|---|---|
| 1 architect | non-Euclidean (gravity tilts 8°; horizon vanishing-point) |
| 2 floor/walls/ceiling/lights | fixed; per-beat-modulated brightness |
| 3 atmosphere + sound + smell | fixed (cold + dry + parchment) |
| 4 objects + cameras + doors + story-tie + FX + perf | fixed |
| 5 connection rules | one-way from Blood Weave Atrium pillar; exits via choice outcome to one of three destinations |
| 6 economic surface | active (cinematic-only — no idle / contested states) |
| 7 governance modifier reactions | `metaarc_pending` → cinematic begins; `metaarc_complete_<branch>` → outcome-routing fires |
| 8 tournament / event window | qualifier (player approaching alignment 40) / **finals (cinematic playing — only state visible to runtime)** / champion (player chose "take his place" — locked-in) / contested (player chose "negotiate" — Tier-4 path opens) |
| 9 TV-infection | clean / corrupted (mirror-mask shows player's face inverted with corruption-pink rim — "if you take his place, you become this") / quarantined (yellow-X across all 12 brass plates if player chose "refuse" — meta-arc sealed for this save) |
| 10 epoch / shadowtongue | grand-edit (canonical for this room; the entire cinematic IS a grand-edit moment) |
| 11 cycle-phase / time-of-day | pocket-dimension; no cycle-phase modulation; lighting locked to ceremonial dim |
| 12 faction livery | hierarchy CANONICAL (this is the Hierarchy's claim-room); the brass plates' faction-livery lights show the prior 11 Game Masters' factions (mostly hierarchy, some panopticon, one collectors) |
| 13 storyteller hooks + HUD overlap | mystery-arc bindings: this room IS the storyteller-hook for the entire game; HUD overlap is forbidden during the cinematic (full-screen takeover); the 12 brass-bound clipboards are readable AFTER the cinematic ends if player chose "take his place" branch (player becomes the 12th Game Master and inherits the role's documentation) |

### §AC.22.2 Cinematic beat-cutscenes (10 cuts; full NB2 + Veo prompts)

#### §AC.22.2.1 Beat 1 — `cs_act7_metaarc_b1_atrium_dissolves`

```yaml
host_space: §AC.1.8 Blood Weave Atrium → §AC.22.1 Tier-Infinity threshold
xref: cinematic beat 1; Cat D meta-arc

nb2_start:
  model: gemini-3-pro-image-preview
  aspect_ratio: "21:9"
  resolution: "4K"
  reference_images:
    - cdn/client-public/art/refs/blood_weave_atrium_master_still.png
    - cdn/client-public/art/portraits/_masters/<player_master_face>.png
  prompt: |
    SUBJECT: the Blood Weave Atrium central braiding-pillar at the
      moment of alignment 40+ resolution; the rope-state has
      finished braiding all 5 strands; the pillar's glass column
      is entirely cyan-cyan-violet luminous; the 12th loredex
      alcove at perimeter is mid-shatter (glass-fragment cascade
      visible); the alignment-pulpit south shows "ALIGNMENT 40 /
      CLAIMED" in 23-char illuminated cipher-script; player's
      gloved hands at the alignment-pulpit edge; mid-frame the
      Atrium's geometry begins to dissolve at the edges (subtle
      pixelation effect resolving into deep-violet anomaly).
    COMPOSITION: medium-wide FPV at the alignment-pulpit, eye-level
      +1.65m, 35mm; deep DOF; pillar at frame-centre filling
      vertical; alcove-shatter at frame-right.
    LIGHTING/CAMERA: 1800K candle key + 6500K cyber-cyan rim from
      fiber-optic; 12000K occult-violet practical; deep-violet
      anomaly-light bleeding in from frame edges (corrupting the
      canonical Atrium palette); ARRI Alexa anamorphic; Kodak
      Vision3 500T pushed +2.
    STYLE: APPRENTICE_AESTHETIC + meta-arc violet-rim overlay; the
      moment of dissolution is shown as the canonical Atrium
      losing definition at the edges while the centre remains
      coherent.
    CONSTRAINTS: NB2_CONSTRAINTS_BASE; first-person POV from the
      player's eyes; only the player's gloved hands visible at
      pulpit-rim; no third-person body of the player; no mirrors
      or reflections of the player; consistent eye-height per
      host_space (medium 1.65m).
    Output 4K, 21:9.

nb2_end:
  model: gemini-3-pro-image-preview
  aspect_ratio: "21:9"
  resolution: "4K"
  reference_images:
    - cdn/client-public/art/refs/blood_weave_atrium_master_still.png
  prompt: |
    SUBJECT: the same Atrium frame, but the dissolution has reached
      75% of the canvas; the pillar at centre is fully luminous;
      the Atrium walls are gone, replaced by a gradient of deep-
      violet anomaly mist; the alcove-shatter has fully cascaded;
      the alignment-pulpit remains visible but the south-wall it
      sat against is gone; player's gloved hands at the pulpit
      edge are about to lose their contact with the pulpit
      surface.
    [CONSTRAINTS as nb2_start]
    Output 4K, 21:9.

veo:
  model: veo-3.1-generate-001
  duration_seconds: 8
  aspect_ratio: "16:9"
  resolution: "1080p"
  first_frame: cdn/client-public/cutscenes/cs_act7_metaarc_b1_atrium_dissolves/start.png
  last_frame: cdn/client-public/cutscenes/cs_act7_metaarc_b1_atrium_dissolves/end.png
  negative_prompt: "third-person view; character's full body visible;
    mouth out of sync; motion smear; extra fingers; mirror or
    reflection of the player; on-screen text other than diegetic
    signage already present in the location; modern logos; watermark"
  prompt: |
    CINEMATOGRAPHY: medium-wide FPV, slow forward dolly +0.4m over
      8s, 35mm, FPV trait-lock (player's gloved hands at pulpit-
      rim throughout).
    SUBJECT: the Blood Weave Atrium central braiding-pillar at
      the alignment 40 transition moment; rope-state finishing
      braiding; alcove shattering at frame-right.
    ACTION: 0–3s pillar fully ignites cyan-violet; 3–5s 12th
      loredex alcove shatters cyber-cyan glass-fragments cascade;
      5–8s Atrium walls dissolve at edges into deep-violet mist;
      lands on last_frame.
    CONTEXT: Blood Weave Atrium centre (§AC.1.8); the alignment
      transition moment.
    STYLE & AMBIANCE: APPRENTICE_AESTHETIC + meta-arc violet-rim;
      Kodak Vision3 500T pushed +2; deep-violet anomaly-light
      bleed at frame edges.
    AUDIO:
      Dialogue: none.
      SFX: pillar-resonance crescendo 00:00–00:08; alcove-glass-
        shatter cascade 00:03–00:05; Atrium-wall dissolution
        whisper 00:05–00:08.
      Ambient noise: cathedral reverb 5.2s; sub-bass 16Hz pulse;
        chant-loop -28dB rising to -18dB.
      Score: meta-arc theme begins — single sustained string-
        chord, full orchestra holds in silent reserve; the chord
        rises across the 8s in volume but not in pitch.
    [00:00–00:03] pillar ignites + rope finishes braiding.
    [00:03–00:05] alcove shatters + glass-cascade.
    [00:05–00:08] dissolution begins; lands on last_frame.

pipeline:
  nb2_seed: 197001
  veo_seed: 297001
  vo_manifest_ref: null
  cdn_target: cdn/client-public/cutscenes/cs_act7_metaarc_b1_atrium_dissolves/
```

#### §AC.22.2.2 Beat 2 — `cs_act7_metaarc_b2_chesshall_reforms`

```yaml
host_space: §AC.22.1 Tier-Infinity Chess Hall (entry threshold)

nb2_start.subject: |
  the player's POV at the threshold of an unfamiliar dim chamber;
  ahead, the geometry is reforming — an apparent corridor of
  black-marble + gold-blood-channel inlay extends into a vanishing-
  point at deep distance; cyber-cyan fiber-optic conduits run
  along the floor and ceiling toward the vanishing point; the
  player's gloved hands are at chest-height, palms-down (as if
  the player just stepped through a threshold); the deep-violet
  anomaly mist is dissipating behind.

nb2_end.subject: |
  the same corridor, now fully resolved; the vanishing-point at
  deep distance shows the first hint of the 12-board chessboard
  array (one apex candle-cluster visible above the array); the
  cyber-cyan fiber-optic conduits brighten as the player advances;
  the Hierarchy claim-mark apex sigil is barely visible at the
  ceiling above the array.

veo.action: |
  0–3s threshold-emergence; 3–5s corridor resolves around the
  player; 5–8s player begins forward dolly; lands on last_frame
  (corridor fully visible to the chessboard array).

veo.audio.dialogue: "Master of R'lyeh: \"You crossed.\""
veo.audio.sfx: "footstep echoes 00:03 / 00:04 / 00:06; corridor-
  reverb tail 8.4s; sub-bass 4Hz pulse 00:00–00:08."
veo.audio.ambient: "Tier-Infinity ambient bed; chant-loop -24dB."
veo.audio.score: "meta-arc theme — second chord enters in low
  brass + harp; full orchestra still in reserve; tension build."

pipeline:
  nb2_seed: 197002
  veo_seed: 297002
  vo_manifest_ref: apps/shared/masterOfRlyehVoManifest.json#L<TBD>
  cdn_target: cdn/client-public/cutscenes/cs_act7_metaarc_b2_chesshall_reforms/
```

#### §AC.22.2.3 Beat 3 — `cs_act7_metaarc_b3_twelve_boards_reveal`

```yaml
host_space: §AC.22.1 Tier-Infinity Chess Hall (12-board array)

nb2_start.subject: |
  the player's POV approaching the 12-board chessboard array; 12
  boards arranged in a 3×4 grid at the centre of the chamber; each
  board is brass-rim mahogany with serpentine glyphs (canonical
  Hierarchy's-Table style); 11 boards show partial chess games in
  progress (mid-game positions); the 12th board (lower-right of
  the grid) shows a fully-arranged opening position with no moves
  played; behind each board, a hooded demon-bishop watches; at the
  audience-head (raised dais z+8m), Mol'Garath sits in deep shadow
  with only violet eye-glow visible; a faceless hooded figure is
  seated north of the 12th board (the Game Master, mask-closed).

nb2_end.subject: |
  the player has reached the south side of the 12th board (mentor's
  chair); the 11 prior boards visibly resolve their final game-
  states (each shows a checkmate or stalemate position); the
  faceless Game Master across the 12th board has not moved; the
  cyan-cyan-violet candle-cluster above the 12th board has lit;
  Mol'Garath has not moved; player's gloved hands are at the
  mentor's chair-back.

veo.action: |
  0–4s player approach reveals the 12-board scope (camera rotates
  slightly to show full grid); 4–6s the 11 prior boards resolve to
  final positions; 6–8s player reaches mentor's-chair south of
  12th board; lands on last_frame.

veo.audio.dialogue: "Game Master (still faceless, voice modulated):
  \"Welcome to the table.\""
veo.audio.sfx: "candle-cluster ignite chord 00:06; chess-piece
  echoes from the 11 boards 00:04 / 00:04.5 / 00:05 (final-move
  ticks); demon-bishop hood-rustle 00:05.5."
veo.audio.ambient: "Tier-Infinity bed continues; chant-loop -22dB."
veo.audio.score: "meta-arc theme — third chord; strings join at
  low intensity; orchestral build remains in reserve; the
  unmistakable Game Master leitmotif (5-note descending) plays
  in the harp at 00:06."

pipeline:
  nb2_seed: 197003
  veo_seed: 297003
  vo_manifest_ref: apps/shared/gameMasterVoManifest.json#L<TBD>
  cdn_target: cdn/client-public/cutscenes/cs_act7_metaarc_b3_twelve_boards_reveal/
```

#### §AC.22.2.4 Beat 4 — `cs_act7_metaarc_b4_game_master_face` (12 s stitched)

The reveal beat. The Game Master's mirror-mask opens. **The face
revealed is the player's own canonical face** (composed at runtime
from the player's master_face render per §AC.11.16). This is the
ONLY canonical player-face reveal in the entire game.

```yaml
host_space: §AC.22.1 Tier-Infinity Chess Hall (12th board)
notes: "12s stitched 8+4 per Veo First-and-Last-Frame contract."

veo (clip_a — 0:00-0:08):
  prompt: |
    CINEMATOGRAPHY: medium close-up FPV across the 12th board, 50mm,
      eye-level +1.65m, FPV trait-lock; player's gloved hands rest
      on the mentor's-chair-back, then move forward to the chair
      seat at 00:04.
    SUBJECT: the faceless hooded Game Master across the 12th board;
      the brass mirror-mask in its case at frame-right of the board;
      the case begins to open at 00:03.
    ACTION: 0–3s Game Master holds posture; 3–5s mirror-mask case
      opens with cog-mechanism rotation; 5–8s the Game Master
      raises both gloved hands to remove the mask; lands on
      last_frame (mask in hands, face still partially obscured by
      the cog-mechanism armature shadow).
    CONTEXT: 12th-board confrontation; Mol'Garath silent at audience-
      head; 12 demon-bishops watching.
    STYLE & AMBIANCE: APPRENTICE_AESTHETIC + meta-arc violet-rim;
      ARRI Alexa anamorphic; Kodak Vision3 500T pushed +2;
      anamorphic flare on the candle-cluster apex.
    AUDIO:
      Dialogue: Game Master: "You earned this view." (lip-sync to
        dialogue; modulated voice still).
      SFX: cog-mechanism mask-case rotation 00:03–00:05; mask-
        lifting brass-rim slide 00:06; Mol'Garath's eye-violet
        intensifies (no sound — visible-only signal).
      Ambient noise: continued bed.
      Score: meta-arc theme — orchestral strings join the harp;
        the 5-note Game Master leitmotif plays in counterpoint
        with the meta-arc theme.
    [00:00–00:03] Game Master holds; mirror-mask case dim.
    [00:03–00:05] case opens via cog-mechanism.
    [00:05–00:08] Game Master raises mask; lands on last_frame.
  pipeline:
    nb2_seed: 197004 (clip_a)
    veo_seed: 297004 (clip_a)
    cdn_target: cdn/client-public/cutscenes/cs_act7_metaarc_b4_game_master_face/clip_a.mp4

veo (clip_b — 0:08-0:12):
  reference_images:
    - cdn/client-public/art/portraits/_masters/<player_master_face_runtime_composited>.png
  prompt: |
    CINEMATOGRAPHY: continuation; medium close-up FPV; the Game
      Master fully removes the mirror-mask at 00:09; the mask is
      lowered to the chess-table at 00:10.5; the camera holds on
      the revealed face from 00:10–00:12.
    SUBJECT: the Game Master's true face — IDENTICAL to the
      player's canonical master_face (per §AC.11.16; runtime
      composites the player's own face into this clip); the hood
      remains drawn so only the face is fully visible; the eyes
      meet the player's gloved-hand POV directly; the mouth is
      mid-line (the dialogue line straddles clips a/b).
    ACTION: 0–1s mask comes off; 1–3s face revealed in full;
      3–4s eye-contact held; the line "I was you" lands at
      00:10.
    CONTEXT: continuation of beat 4.
    STYLE & AMBIANCE: APPRENTICE_AESTHETIC + meta-arc violet-rim;
      anamorphic; the score swells.
    AUDIO:
      Dialogue: Game Master (now in unmodulated voice — IDENTICAL
        to the player's canonical voice if the player has voice
        defined): "I was you. Once."
      SFX: mirror-mask placed on chess-table click 00:10.5; Mol'
        Garath's chair-shift creak 00:11; demon-bishop perimeter
        gasp (collective inhale) 00:11.5.
      Ambient noise: continued; chant-loop intensifies to -16dB.
      Score: meta-arc theme orchestral peak — full orchestra
        joins; brass + strings + horn + harp counterpoint; the
        leitmotif resolves to a sustained chord at 00:12.
    [00:08–00:09] mask comes off completely.
    [00:09–00:10] face revealed; "I was you. Once." line.
    [00:10–00:12] eye-contact held; orchestral peak; lands on
      last_frame.
  pipeline:
    nb2_seed: 197005 (clip_b)
    veo_seed: 297005 (clip_b)
    cdn_target: cdn/client-public/cutscenes/cs_act7_metaarc_b4_game_master_face/clip_b.mp4

notes: |
  Runtime composition: at the moment Veo generates clip_b, the
  reference_image must include the PLAYER'S own master_face
  (the canonical apprentice/player rendered face per §AC.11.16).
  This is the only beat in the entire game where the player's
  face is canonically rendered as a third-person figure. The
  runtime compositing approach: pass the player's chosen
  master_face from save-game state as the reference image at
  generation time. If the player chose a custom apprentice
  appearance during character creation, that appearance is the
  Game Master's face here. This is canonical: the rope of the
  Hierarchy's claim is the player's own future-self.

vo_manifest_ref: |
  Special handling: this is the player's voice, not Game
  Master's. If the player's character has a defined voice
  manifest (apps/shared/playerVoManifests/<voice_id>.json),
  audio post overlays the player's voice. If no voice is
  defined, Veo's native dialogue is canonical (with the line
  "I was you. Once." rendered in a default voice). Production
  side: 12 default voices ship in `apps/shared/playerVoManifests/`
  for cohort fallback.
```

#### §AC.22.2.5 Beat 5 — `cs_act7_metaarc_b5_molgarath_speaks`

```yaml
host_space: §AC.22.1 (audience-head; Mol'Garath silhouette)
xref: cinematic beat 5; 8s

nb2_start.subject: |
  the audience-head dais z+8m raised; Mol'Garath in deep shadow,
  only violet eye-glow visible; behind Mol'Garath, the apex sigil
  fills the upper canvas (Hierarchy claim-mark, brass-etched);
  the 12 demon-bishops at perimeter have all turned 5° toward the
  dais; the camera is at Mol'Garath's eye-level (z+8m) — a single
  cinematic break from FPV trait-lock for this beat (since
  Mol'Garath is canonically not the player; the camera is
  authoring's-side, not player-POV).

nb2_end.subject: |
  Mol'Garath has shifted +0.2m forward on the throne; the violet-
  rim has intensified by 25%; the apex sigil now visibly pulses
  with sub-bass 4Hz; one of Mol'Garath's gloved hands rests on
  the dais-rim, brass-bound rings visible.

veo.cinematography: medium-wide; static lockoff at the dais level;
  35mm; the camera does NOT move (this is the only stationary
  beat in the cinematic). FPV is BROKEN for this beat — clearly
  documented per §AC.22.0 fpv_strict relaxation.

veo.action: |
  0–3s Mol'Garath holds posture; 3–6s line is delivered (subtitled
  in cipher-script); 6–8s rings tap the dais-rim once; eye-violet
  intensifies; lands on last_frame.

veo.audio.dialogue: "Mol'Garath: \"The rope is a contract.\""
veo.audio.sfx: "ring-tap brass-on-stone 00:07; sub-bass 4Hz pulse
  amplifies 00:00–00:08; demon-bishop perimeter rustle 00:06."
veo.audio.score: "meta-arc theme drops to single sustained low-
  brass + harp; the orchestra recedes; tension reset for the
  contract revelation."

pipeline:
  nb2_seed: 197006
  veo_seed: 297006
  vo_manifest_ref: apps/shared/molgarathVoManifest.json#L<TBD>
  cdn_target: cdn/client-public/cutscenes/cs_act7_metaarc_b5_molgarath_speaks/
```

#### §AC.22.2.6 Beat 6 — `cs_act7_metaarc_b6_wraith_appears` (12 s stitched)

This beat reveals **Wraith Calder's scratched-out photograph** —
the photograph contents are the Game Master's younger form
(per §AC.21.2 [F] Act-5 reveal). At Act-7 the photograph
appears in the player's POV: held by the Game Master.

```yaml
host_space: §AC.22.1 (12th board)
notes: "12s stitched 8+4. Resolves the Act-5 photograph reveal hook.
        Wraith Calder canonically appears here as a vision /
        memory — he was the Game Master's escape route and was
        refused. His hut/hideout is at §F.2.1 Wraith Calder's
        Hideout in _PRODUCTION_CROSS_CUT.md."

veo (clip_a):
  reference_images:
    - cdn/client-public/art/refs/wraith_calder_canonical_portrait.png
    - cdn/client-public/art/portraits/_masters/<player_master_face>.png
  prompt: |
    CINEMATOGRAPHY: continuation FPV at the mentor's chair south
      of the 12th board; the Game Master (player's-face revealed)
      reaches into his cassock pocket and removes a small
      photograph; the photograph is held face-down at 00:02; turned
      face-up at 00:04; held out to the player's POV.
    SUBJECT: the photograph — the canonical Wraith Calder scratched-
      out photograph from §F.2.1; the scratching has been recently
      removed (the Game Master holds it pre-scratch) — the
      photograph shows Wraith Calder + the Game Master's younger
      form (the player's face but younger, ~16-17yo) standing in
      front of the Wraith Calder Hideout cargo-stack; both figures
      smiling; both wearing Free Ports broker outfits.
    ACTION: 0–3s photograph emerges from pocket; 3–6s held out to
      player's POV (full visibility of the photograph); 6–8s at
      00:07 a third figure materialises mid-frame above the photo
      — Wraith Calder himself, transparent vision-form (Cat D
      cinematic allows this).
    CONTEXT: the contract revelation continues.
    STYLE & AMBIANCE: meta-arc violet-rim + photograph in warm-
      sepia palette (the past); Vision3 500T pushed +2.
    AUDIO:
      Dialogue: Game Master: "He offered me a way out." (00:04;
        the line concludes during clip_a)
      SFX: photograph paper-rustle 00:02; photo-turn-over 00:04;
        vision-form Wraith manifestation chord 00:07.
      Ambient noise: chant-loop -16dB.
      Score: meta-arc theme — minor-key shift; the photograph's
        memory-bed (a piano-and-strings cue) plays.
    [00:00–00:03] photograph emerges.
    [00:03–00:06] held face-up to player POV.
    [00:06–00:08] Wraith vision-form materialises.

veo (clip_b — 0:08-0:12):
  prompt: |
    CINEMATOGRAPHY: same; the Wraith vision continues; at 00:10
      the Wraith vision speaks his canonical line; at 00:11 the
      vision dissolves; the photograph remains in the Game
      Master's hand.
    SUBJECT: Wraith Calder's vision-form fully resolved at 00:08;
      he is in his canonical visual identity (per §AC.10.7);
      his eye-line is the player's POV; he speaks directly.
    ACTION: 0–1s vision fully resolves; 1–3s Wraith speaks; 3–4s
      Wraith dissolves; lands on last_frame (photograph in Game
      Master's hand; the vision gone; the Game Master's face
      slightly older-feeling).
    CONTEXT: vision-resolution.
    STYLE & AMBIANCE: meta-arc violet-rim; Wraith's dissolution
      uses cyber-cyan glass-fragment cascade VFX.
    AUDIO:
      Dialogue: Wraith Calder: "I tried." (00:10; lip-sync;
        Wraith's canonical voice from §AC.10.7).
      SFX: vision-dissolution glass-fragment cascade 00:11–00:12;
        photograph-grip tighten 00:11.5.
      Ambient noise: chant-loop drops to -22dB.
      Score: photograph-bed continues; meta-arc theme returns at
        clip end.
    [00:08–00:10] vision resolves.
    [00:10–00:11] Wraith's line.
    [00:11–00:12] dissolution; lands on last_frame.

pipeline:
  nb2_seed: 197007 (clip_a) / 197008 (clip_b)
  veo_seed: 297007 / 297008
  vo_manifest_ref: apps/shared/wraithCalderVoManifest.json#L<TBD>
  cdn_target: cdn/client-public/cutscenes/cs_act7_metaarc_b6_wraith_appears/
```

#### §AC.22.2.7 Beat 7 — `cs_act7_metaarc_b7_the_choice` (16 s stitched 8+8)

The choice point. The player is offered three branches.

```yaml
host_space: §AC.22.1 (12th board)
notes: "16s stitched 8+8. Choice presentation + interactive resolution.
        Diegetic choice-wheel UI surfaces at 00:08 (per §AC.12.1
        BioWare dialog UI; this is its sole Cat D usage)."

veo (clip_a — 0:00-0:08):
  prompt: |
    CINEMATOGRAPHY: medium close-up FPV at the 12th board; the
      Game Master (player-face revealed) places the photograph
      face-down on the chess-table at 00:01; he places his
      gloved hand on the brass king-piece at his side of the
      board at 00:03; he meets the player's POV at 00:05; the
      camera holds; the 12 demon-bishops have all turned to face
      the player; Mol'Garath is silent at audience-head.
    SUBJECT: the choice presentation; the Game Master's posture
      shifts from instructor to invitor; his eyes (the player's
      eyes) are level and questioning.
    ACTION: 0–3s photo placed + king-piece hand-on; 3–5s eye-
      contact held; 5–8s the question is delivered and lands.
    CONTEXT: meta-arc choice point.
    STYLE & AMBIANCE: meta-arc violet-rim; orchestra builds.
    AUDIO:
      Dialogue: Game Master: "Sit. Take my place. Or refuse it.
        Or barter for something else."
      SFX: photo-place 00:01; king-piece hand-on 00:03; eye-
        contact silence 00:05.
      Ambient noise: chant-loop returns to -16dB.
      Score: meta-arc theme — full orchestral peak rebuilds; the
        leitmotif plays in resolution-form.

veo (clip_b — 0:08-0:16):
  prompt: |
    CINEMATOGRAPHY: continuation; at 00:08 the diegetic choice-
      wheel UI surfaces from below the 12th board (a brass-bound
      wheel rises from the chalk-circle inlay around the board);
      the wheel has 3 spokes (take_his_place / refuse / negotiate);
      cyber-cyan fiber-optic trim ignites; the player's gloved
      hand approaches the wheel.
    SUBJECT: the choice-wheel surfacing; the Game Master watches;
      Mol'Garath's eye-glow intensifies on the player's choice
      hover.
    ACTION: 0–3s wheel surfaces; 3–8s player's hand hovers (the
      cinematic pauses for input here at 00:13 IF runtime
      allows; otherwise the hand picks the canonical choice
      based on cohort state); the chosen spoke ignites at clip
      end; lands on last_frame (choice-locked; specific spoke
      lit).
    CONTEXT: meta-arc choice interaction.
    AUDIO:
      Dialogue: none in clip_b (silence is the interactive
        moment).
      SFX: wheel-rise from chalk-circle 00:08; fiber-optic
        ignite 00:09; choice-spoke select chord 00:13;
        cinematic-lock chord 00:16.
      Ambient noise: chant-loop -14dB peak.
      Score: meta-arc theme holds at peak; resolution-form
        leitmotif sustains.

pipeline:
  nb2_seed: 197009 (clip_a) / 197010 (clip_b)
  veo_seed: 297009 / 297010
  vo_manifest_ref: apps/shared/gameMasterVoManifest.json#L<TBD>
  cdn_target: cdn/client-public/cutscenes/cs_act7_metaarc_b7_the_choice/
notes: |
  Runtime branch: the player's choice is captured at 00:13 (mid-
  clip_b). The cinematic continues into one of three outcome
  beats (8a / 8b / 8c) per the chosen branch.
```

#### §AC.22.2.8 Beat 8a — `cs_act7_metaarc_b8a_choice_take_his_place` (8 s)

```yaml
host_space: §AC.22.1
xref: outcome branch — player chose "take his place"

veo.action: |
  0–3s the Game Master rises from the 12th-board chair and steps
  back; 3–5s he gestures to the chair (offer); 5–8s the player's
  POV moves forward and the player takes the chair (the camera
  shifts to the seated POV at 00:08); the Game Master walks past
  the camera and exits frame-left; lands on last_frame (player
  is now the Game Master, seated; Mol'Garath nods once).

veo.audio.dialogue: "Game Master: \"Be welcome.\""
veo.audio.sfx: "chair-shift creak 00:03 / 00:05; footsteps walking
  out 00:05–00:07; Mol'Garath nod (visible-only)."
veo.audio.score: "meta-arc theme — final resolution chord;
  orchestra fades to single sustained string-note; chant-loop
  rises to -10dB (the Hierarchy claim has resolved)."

post_outcome: |
  - bloodWeave.alignment LOCKED at 50 (claimed-permanent)
  - player avatar replaced with the canonical Game Master visual
    (player's face stays; cassock + scripture-medallion + chair-
    of-office added)
  - Tier 0 Chess Hall now displays the player's own image as the
    Game Master to subsequent visitors / cohorts
  - apprentice cohort permanently disbanded (the player no longer
    runs cohorts; instead, NEW players in subsequent save-cycles
    will face the player's face as their Game Master)

pipeline:
  nb2_seed: 197011
  veo_seed: 297011
  cdn_target: cdn/client-public/cutscenes/cs_act7_metaarc_b8a_choice_take_his_place/
```

#### §AC.22.2.9 Beat 8b — `cs_act7_metaarc_b8b_choice_refuse` (8 s)

```yaml
host_space: §AC.22.1
xref: outcome branch — player chose "refuse"

veo.action: |
  0–3s the Game Master nods once (acceptance); 3–5s he places his
  own gloved hand back on the king-piece and sets it on its
  side (a forfeit gesture); 5–8s the chamber's geometry begins
  to dissolve again (return-portal); the deep-violet anomaly
  mist returns; lands on last_frame (player is back at Blood
  Weave Atrium with alignment 30; the 12th alcove is sealed
  with yellow-X quarantine).

veo.audio.dialogue: "Game Master: \"Then we are not the same.\""
veo.audio.sfx: "king-piece tip-over 00:04; chamber-dissolution
  whisper 00:05–00:08."
veo.audio.score: "meta-arc theme — minor-key resolution; the
  leitmotif is incomplete; chant-loop drops sharply at 00:08
  to -42dB."

post_outcome: |
  - bloodWeave.alignment RESET to 30 (Hierarchy claim retracted)
  - player loses 10 alignment + the 12th loredex entry is sealed
    in their save (un-readable)
  - cinematic SEALED for this save (cannot be replayed)
  - the Game Master continues to be a separate NPC; the player
    is unchanged
  - Pell Caedrune wrongful-execution cohort-thread (per Sentinel
    canon) reopens — the refused alignment makes the player a
    re-eligible witness for that thread
  - 12th brass plate at the perimeter remains UNFILLED

pipeline:
  nb2_seed: 197012
  veo_seed: 297012
  cdn_target: cdn/client-public/cutscenes/cs_act7_metaarc_b8b_choice_refuse/
```

#### §AC.22.2.10 Beat 8c — `cs_act7_metaarc_b8c_choice_negotiate` (12 s stitched 8+4)

The negotiation branch — opens the hidden Tier-4 chess-match
against Mol'Garath. This is the "secret third option" branch
and reserves an Act-7+ DLC cinematic.

```yaml
host_space: §AC.22.1
xref: outcome branch — player chose "negotiate"
notes: "12s stitched 8+4. Reserves the Tier-4 Mol'Garath match
        cinematic for Act-7+ DLC (out of scope for this rollout)."

veo (clip_a):
  prompt: |
    CINEMATOGRAPHY: medium close-up FPV at the 12th board; the
      Game Master tilts his head (acknowledgement); at 00:03 he
      places his own gloved hand on the photograph (face-up);
      at 00:05 he turns to look at Mol'Garath at the audience-
      head; at 00:07 Mol'Garath rises from the throne for the
      first time.
    SUBJECT: the negotiation acknowledgement; Mol'Garath rising.
    ACTION: 0–3s Game Master tilts head; 3–5s photograph examined;
      5–8s Game Master turns to Mol'Garath; Mol'Garath rises;
      lands on last_frame (Mol'Garath standing on dais, full
      figure visible for the first time).
    AUDIO:
      Dialogue: Game Master: "He hears you."
      SFX: photograph-flip 00:03; Mol'Garath chair-rise creak 00:07.
      Score: meta-arc theme — orchestra shifts to a new key; the
        Mol'Garath leitmotif (a sub-bass 4Hz pulse with low-brass)
        joins for the first time in the cinematic.

veo (clip_b — 0:08-0:12):
  prompt: |
    CINEMATOGRAPHY: continuation; the camera shifts to a wide
      angle revealing Mol'Garath's full standing figure (8m tall;
      brass-and-violet armoured demon-form; the 12th board is
      far in the foreground); at 00:10 Mol'Garath gestures to a
      brass-bound chess-board that descends from the apex sigil
      (a 13th board, hidden until this moment); at 00:12 the 13th
      board lands on the floor between the player and Mol'Garath;
      lands on last_frame.
    SUBJECT: Mol'Garath full reveal + 13th-board descent.
    ACTION: 0–2s Mol'Garath fully visible; 2–4s 13th-board
      descends; 4s lands; cinematic ends here.
    AUDIO:
      Dialogue: Mol'Garath: "Sit then."
      SFX: 13th-board descent chain-rattle 00:10; board-floor-
        impact 00:12; chant-loop -18dB.
      Score: Mol'Garath leitmotif sustains; the meta-arc theme
        ends on an unresolved cadence (this is the cliffhanger
        — the Tier-4 match is not played here).

post_outcome: |
  - bloodWeave.alignment LOCKED at 40 indefinitely
  - the 12th brass plate at perimeter remains UNFILLED but
    pulses cyber-cyan (reserved for the Tier-4 match outcome)
  - Tier-4 Mol'Garath chess-match unlocks at A.36 Chess Hall
    (per `apps/shared/chessClimbTiers.ts` — extends the existing
    4-tier ladder to 5 tiers; new Tier 4 spec out-of-scope here)
  - cinematic SEALED for this save (Tier-4 match is the next
    chess-arc beat; not playable in current rollout)
  - the Game Master remains a separate NPC; the player retains
    apprentice-cohort access

pipeline:
  nb2_seed: 197013 (clip_a) / 197014 (clip_b)
  veo_seed: 297013 / 297014
  vo_manifest_ref: apps/shared/molgarathVoManifest.json#L<TBD> +
                   gameMasterVoManifest.json#L<TBD>
  cdn_target: cdn/client-public/cutscenes/cs_act7_metaarc_b8c_choice_negotiate/
```

### §AC.22.3 Score spec — meta-arc theme

Cat D meta-arc cinematic is the **first cinematic in the entire
production with full theme-defining orchestral score**. Score
specifications:

```yaml
score_id:    music_act7_metaarc_theme.wav
duration:    160-164s (matches cinematic length per branch)
composition: |
  - Opening (Beat 1): single sustained string-chord; orchestra
    in silent reserve; brightness rises across 8s
  - Build (Beats 2-3): low brass + harp join; 5-note Game Master
    leitmotif emerges in harp at Beat 3 / 00:06
  - Reveal (Beat 4): full orchestra at peak; leitmotif counterpoint
    with theme; orchestral peak at clip_b 00:12 ("I was you. Once.")
  - Recede (Beat 5): orchestra drops to single sustained low-
    brass + harp; tension reset
  - Memory (Beat 6): minor-key shift; piano-and-strings memory-
    bed for the photograph
  - Choice (Beat 7): orchestra rebuilds to peak; resolution-
    form leitmotif sustains
  - Outcome (Beat 8a/b/c): per-branch resolution:
      8a take-his-place: final resolution chord; orchestra fades
                         to single sustained string-note
      8b refuse:         minor-key resolution; leitmotif incomplete
      8c negotiate:      Mol'Garath leitmotif joins (sub-bass 4Hz
                         + low-brass); unresolved cadence
                         (cliffhanger)

leitmotifs:
  game_master_leitmotif:  "5-note descending phrase in harp;
                           introduced Beat 3; reprised throughout"
  metaarc_theme:          "8-bar string-and-brass theme; develops
                           across cinematic; resolves at outcome"
  molgarath_leitmotif:    "sub-bass 4Hz pulse + low-brass; joins
                           only in Beat 8c negotiate branch"
  photograph_memory_bed:  "piano-and-strings cue; Beat 6 only"
  hierarchy_claim_chord:  "sustained low-brass + chant-loop;
                           Beat 8a outcome only"

production:
  composer:    full orchestral commission (out of scope for asset-
               render; production-side audio team)
  duration:    ~3 minutes of unique score material (with branches);
               recorded at 96kHz 24-bit; mixed to -14 LUFS
  asset_files:
    music_act7_metaarc_theme.wav        (full theme-bed)
    music_act7_game_master_leitmotif.wav (5-note phrase)
    music_act7_metaarc_outcome_8a.wav   (take-his-place outcome)
    music_act7_metaarc_outcome_8b.wav   (refuse outcome)
    music_act7_metaarc_outcome_8c.wav   (negotiate outcome)
    music_act7_photograph_memory.wav    (Beat 6 piano-and-strings)
```

### §AC.22.4 Choice branches — runtime contract

Per the choice resolution at Beat 7, the runtime branches:

```yaml
choice_take_his_place:
  alignment_post:        50 (claimed-permanent)
  cinematic_outcome:     8a (8s, music_act7_metaarc_outcome_8a.wav)
  player_avatar_change:  YES — player face stays; cassock +
                         scripture-medallion + Game Master chair-
                         of-office overlay added
  apprentice_cohort:     PERMANENTLY DISBANDED (player no longer
                         runs cohorts; future-save-cycle players
                         will face the player's face as Game Master)
  brass_plate_12:        FILLED (player's name etched at the 12th
                         perimeter brass plate of A.22.1)
  game_world_ripple:     subsequent player save-cycles see the
                         player's face as Game Master (canonical
                         meta-arc continuation; the rope continues)

choice_refuse:
  alignment_post:        30 (claim-retracted)
  cinematic_outcome:     8b (8s, music_act7_metaarc_outcome_8b.wav)
  player_avatar_change:  none
  apprentice_cohort:     unchanged
  brass_plate_12:        UNFILLED (the alcove is yellow-X quarantined)
  pell_caedrune_thread:  REOPENS (Sentinel canon: the wrongful-
                         execution witness thread becomes
                         re-eligible)
  game_world_ripple:     player retains apprentice cohort access;
                         the Game Master continues as separate NPC

choice_negotiate:
  alignment_post:        40 (locked indefinitely)
  cinematic_outcome:     8c (12s stitched, music_act7_metaarc_outcome_8c.wav)
  player_avatar_change:  none
  apprentice_cohort:     unchanged
  brass_plate_12:        UNFILLED but pulses cyber-cyan (reserved
                         for Tier-4 match outcome)
  tier4_chess_match:     UNLOCKS at A.36 Chess Hall (extends
                         existing 4-tier chess ladder to 5 tiers;
                         out of scope for this rollout — Act-7+
                         DLC reservation)
  game_world_ripple:     player retains apprentice cohort access;
                         the Game Master remains as NPC; Mol'Garath
                         becomes accessible at the new Tier-4
                         board
```

### §AC.22.5 Cross-references resolved

PR resolves Outstanding TBDs:

- **§AC.21.2 [E]**: Game Master meta-arc cinematic — RESOLVED in
  this section (§AC.22.1 + §AC.22.2.1–§AC.22.2.10).
- **§AC.21.2 [F]**: Wraith Calder's scratched photograph Act-5
  reveal — RESOLVED at Beat 6; the photograph contents are the
  Game Master's younger form (the player's face but ~16-17yo)
  + Wraith Calder; the scratched-out version visible at §F.2.1
  Wraith Calder's Hideout in Act 5 is the post-loss scratched
  state, with the Act-7 cinematic showing the pre-scratch state.
- **§AC.2.5 alignment-40 end_shatter variant**: the
  `cs_blood_weave_loredex_revealed_n=12` end_shatter variant
  feeds DIRECTLY into Beat 1 of this cinematic. The end_shatter
  is the cinematic's Beat 1 first_frame.

The cinematic also touches:
- §AC.4.2 Audit Chamber Day-21 Warden variant (Inspector Veil-7's
  Day-21 dialog references "the Game Master" obliquely; if cohort
  has reached this cinematic, Veil-7's dialog re-resolves with
  per-branch awareness)
- §AC.6 House of Ledger guild common room (Caedex Vorr's
  expulsion question — "who wrote it first" — is canonically
  answered by this cinematic: the rope was written first; the
  Hierarchy didn't author the contract, the Hierarchy IS the
  contract)
- §AC.10.13 master-face anchor batch (the player's master_face
  is the runtime composition reference for Beat 4; production-
  side, ensure player's master_face render is canonical-locked
  per §AC.11.16 before this cinematic ships)
- §AC.12.1 BioWare dialog UI choice-wheel (the wheel surfacing
  at Beat 7 is the canonical instance of the dialog UI in Cat D
  cinematic; the wheel here uses the §AC.12.1 chrome verbatim)

### §AC.22.6 Production deliverables (this cinematic)

| asset | count | notes |
|---|---|---|
| §AC.22.1 Tier-Infinity Chess Hall master still | 1 | full §4 + 13-axis grid; `gemini-3-pro-image-preview` 21:9 4K |
| beat NB2 stills | 14 | 10 cuts × ~1.4 stills each (some 12s stitched cuts have 3+ stills) |
| beat Veo clips | 14 | 10 cuts (8 single + 2 stitched 12s + 1 stitched 16s) |
| audio_post tracks | 10 | per cut |
| meta.json | 10 | per cut |
| cinematic master soundtrack | 6 score files | meta-arc theme + leitmotifs + 3 outcome variants + photograph memory bed |
| 12 prior-Game-Master brass plates | 12 | parametric; etched at runtime per save-game state |
| Tier-Infinity room textures + models | ~25 | non-Euclidean shader budget +20% |
| **TOTAL** | ~78 production assets | |

CDN target: `cdn/client-public/cutscenes/cs_act7_metaarc_b<n>_<id>/`
+ `cdn/client-public/art/refs/tier_infinity_chess_hall_master_still.png`
+ `cdn/client-public/audio/score/music_act7_metaarc_*.wav`.

Storage estimate: ~600 MB (cinematic-heavy due to longer Veo
clips and 6 score-file audio assets).

NB2 generation cost: ~$1.50 (small batch, mostly stills).
Veo generation cost: ~$60 (10 cuts at 8-12s, full theme-music
audio, peak production fidelity).

### §AC.22.7 Outstanding TBDs (this cinematic)

- Mol'Garath full visual identity — Beat 8c clip_b reveals
  Mol'Garath as 8m tall brass-and-violet armoured demon-form;
  no canonical visual reference exists yet; production needs to
  author Mol'Garath's master visual identity (parallel to §AC.10.7
  recruit identities) before Beat 5 + 8c can render
- Player's voice manifest — Beat 4 clip_b uses the player's voice
  for "I was you. Once."; if no player voice manifest exists,
  Veo native dialogue is canonical with 12 default voice pool;
  production-side: ship 12 default voices in `apps/shared/playerVoManifests/`
- Game Master master visual identity in younger form — the Beat 6
  photograph shows the Game Master at age ~16-17; production
  needs a "Game Master younger" master_face render that matches
  the player's chosen master_face at adolescent age (runtime
  composition: pass player's master_face + age-regression
  parameter to NB2 reference bundle)
- Tier-4 chess match (negotiate branch) — out of scope; reserved
  for Act-7+ DLC cinematic
- 12 prior-Game-Master brass plate names + cycle-IDs — parametric
  at runtime per save-game state; production-side, the runtime
  generates these names from existing apprentice canonical-name
  pool (per §AC.11) + cycle-ID
- Score commission — full orchestral score for ~3 minutes of
  unique material with branches; production audio team timeline
  is separate from this doc

End of `_PRODUCTION_APPRENTICE_COMMONS.md` Game Master Act-7
meta-arc cinematic addition.
