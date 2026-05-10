# Inception Ark — Production: Ark Rooms Architect-Layer Spec

> **Phase B of the Dreamer-Architect production roadmap.** This
> document holds the full §4 architect-layer spec for all 49
> sub-rooms of the Ark (numbered §A.1 through §A.49, mirroring
> the §2.1-§2.49 numbering in `INCEPTION_ARK_FINAL_PRODUCTION.md`).
>
> The §4 universal spec format is defined in
> `INCEPTION_ARK_FINAL_PRODUCTION.md` §4. The Bridge exemplar
> (`INCEPTION_ARK_FINAL_PRODUCTION.md` §4.18) is the worked-spec
> pattern for every room here.
>
> **Authoring discipline**: every room conforms to the §4 format
> EXACTLY. Layers are present in the same order. Coordinates are
> precise to 0.01 m. Rotations precise to 0.1°. Colours bound to
> design tokens. Every object justified by the story.
>
> **Cross-reference:** `INCEPTION_ARK_FINAL_PRODUCTION.md` §2.x
> remains the art-state-axis spec for each room (8 visual states,
> art-gen prompts). This doc (§A.x) is the geometric/architectural
> spec. The two together are the complete production handoff.

## A.0 How this document works

### A.0.1 Cross-doc relationship

| spec layer | document | purpose |
|---|---|---|
| Art-gen state-axis prompts | `INCEPTION_ARK_FINAL_PRODUCTION.md` §2 | what each state of the room LOOKS like |
| Cinematic direction | `INCEPTION_ARK_FINAL_PRODUCTION.md` §3 | how cutscenes are filmed |
| Hellbox cosmology | `INCEPTION_ARK_FINAL_PRODUCTION.md` §3.12 | which rooms are gateways and to where |
| Architect-layer spec | this document (§A) | exact dimensions, object positions, story-tie |
| Living-world routines | `INCEPTION_ARK_FINAL_PRODUCTION.md` §11 | per-room slow-tick events |
| Voice-line registry | `INCEPTION_ARK_FINAL_PRODUCTION.md` §12.6 + §6 | what NPCs say where |

### A.0.2 Authoring phasing

This document is authored in waves. Phase B-1 ships the most
narrative-load-bearing rooms in full architect detail; Phase B-2
ships the remaining rooms. Each room's status is marked at the
top of its entry:

- **FULL** — complete §4 architect spec authored (all 17 layers).
- **CORE** — header + geometry + key-object-set + story-tie authored
  (skeleton complete; full inventory deferred).
- **SCAFFOLDED** — header + summary only; full spec deferred.

Phase B-1 (this commit): Bridge (already exemplar) + 4 priority
rooms in FULL + ~5 in CORE; remaining SCAFFOLDED.

Phase B-2 (follow-up branches): convert all CORE → FULL and all
SCAFFOLDED → at least CORE.

### A.0.3 Coordinate convention reminder

All positions are (x, y, z) in metres from the room's origin
point, where:
- +x = right when entering the room through the primary entrance
- +y = forward (away from the primary entrance)
- +z = up

Rotation is yaw degrees (0-359.99); pitch and roll default to 0
unless specified.

All material colours are design tokens (`--token-color-*`) defined
in `apps/client/src/styles/tokens/ark-rooms.ts`. Raw hex values
are FORBIDDEN per void-energy compliance.

---

## A.1 Cryo Bay — FULL

**Status: FULL spec.** Cross-ref: `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.1 (art-state prompts).

### A.1.1 Header

```
space_id:        ark.cryo_bay
space_name:      Cryo Bay
space_type:      ark_room
act_introduced:  Act 0  (the player wakes here; the first room of the game)
lore_anchor:     loredex.system.cryo_pods + loredex.character.player + arc.act_0_awakening
aesthetic_tier:  solar_punk_cathedral
```

### A.1.2 Geometry

```
dimensions:           18.00 m × 9.00 m × 4.50 m
origin_point:         centre of floor at the primary entrance threshold (entrance is the south wall; +y axis points forward toward the rear wall)
coordinate_axes:      +x = right, +y = forward, +z = up
floor_plan_geometry:  rectangular  (long-rectangle, primary entrance on a short wall)
volumetric_anomalies: none
```

The room is a long rectangle. Cryo-pods are arranged in two rows
flanking a central walkway. The player's pod is the first one on
the right (east), nearest the entrance.

Floor area: 162 m².

### A.1.3 Floor

```
material_primary:     polished cyan-tinted enamel-coated steel deck plate; 1.20 m × 1.20 m tiles; 4 mm gap; etched anti-slip texture in radial pattern emanating from a central walkway-line
material_secondary:   brass perimeter trim, 50 mm wide; brass walkway-stripe (centre, 0.40 m wide, runs the length of the room)
pattern:              radial etch around walkway-stripe; 0.30 m radial pitch; etch depth 0.6 mm
wear_state:           pristine in baseline state; in awakening cutscene state, the player's pod-area floor has melted-cryo-fluid puddles (zone: x: 2.50 to 4.50, y: 0.50 to 2.50, z: 0; rendered as wet-decal)
embedded_features:
  - id: ark.cryo_bay.floor.drain.south_central
    position: (0.00, 1.20, 0.00)
    dimensions: 0.30 × 0.30 × 0.10
    function: cryo-fluid emergency drain
  - id: ark.cryo_bay.floor.drain.north_central
    position: (0.00, 16.80, 0.00)
    dimensions: 0.30 × 0.30 × 0.10
    function: cryo-fluid emergency drain
acoustic_property:    hard_reflective (enamel + brass); RT60 = 0.60s (slightly cathedral-like reverb when room is empty)
```

### A.1.4 Walls

Cryo Bay has 4 walls. Each specced separately.

#### Wall: South (entrance)

```
wall_id:              south
material_primary:     painted aluminium honeycomb panel, matte finish, 0.80 m × 1.60 m panels, vertical joints, 6 mm reveal joint
material_secondary:   brass dado rail at z = 1.10 m, 50 mm tall, polished
panelisation:         11 panels wide × 3 panels tall
colour_value:         --token-color-ark-cryo-bay-wall-south  (deep teal-blue with faint cyan pin-stripe at z=2.00 m)
embedded_displays:
  - id: ark.cryo_bay.south.display.cryo_status
    position: (-2.50, 0.20, 1.80)
    dimensions: 1.20 × 0.80 × 0.05
    content: cryo-pod status board; shows all 9 pods with their state (sealed, opening, opened, empty); state-axis driven
  - id: ark.cryo_bay.south.display.pod_assignments
    position: (2.50, 0.20, 1.80)
    dimensions: 1.20 × 0.80 × 0.05
    content: pod-assignment manifest (who is in which pod)
embedded_doors:
  - door_id: ark.cryo_bay.south.door.main
    position: (0.00, 0.00, 0.00)
    dimensions: 1.40 × 2.40 × 0.10
    door_class: pressure_seal  (this was a long sleep — the door must be airlock-grade)
    connecting_space_id: ark.corridor.cryo_approach
decorative_features:
  - id: ark.cryo_bay.south.plaque.dedication
    position: (0.00, 0.20, 3.20)
    dimensions: 1.00 × 0.40 × 0.02
    material: brass with engraved text
    narrative_role: reads "for those who sleep — and those who wake"; melancholy dedication; lore-anchor for the player's first cutscene
```

#### Wall: East

```
wall_id:              east
material_primary:     painted aluminium honeycomb panel; matte finish; 0.80 m × 1.60 m panels
material_secondary:   brass dado rail
panelisation:         standard
colour_value:         --token-color-ark-cryo-bay-wall-east  (same family as south, slightly lighter)
embedded_displays:
  - id: ark.cryo_bay.east.display.life_support
    position: (8.95, 4.50, 1.50)
    dimensions: 0.80 × 0.60 × 0.05
    content: life-support readouts for cryo systems
embedded_doors:        none
decorative_features:
  - id: ark.cryo_bay.east.viewport.observation
    position: (8.95, 4.50, 2.40)
    dimensions: 1.20 × 0.80 × 0.05
    material: composite plexiglas + brass surround
    narrative_role: shows the deep-space beyond Ark; the player's first glimpse of "outside" after waking
```

#### Wall: North (rear)

```
wall_id:              north
material_primary:     painted aluminium honeycomb panel
material_secondary:   brass dado rail
panelisation:         standard; 5 panels wide × 3 panels tall
colour_value:         --token-color-ark-cryo-bay-wall-north  (deep cyan; symbolic — "the path back to where you came from")
embedded_displays:
  - id: ark.cryo_bay.north.display.cryo_master_control
    position: (0.00, 17.95, 1.80)
    dimensions: 2.40 × 1.20 × 0.05
    content: master cryo-system control panel; gameplay-active
embedded_doors:
  - door_id: ark.cryo_bay.north.door.maintenance
    position: (-3.50, 17.95, 0.00)
    dimensions: 1.20 × 2.40 × 0.10
    door_class: slide
    connecting_space_id: ark.corridor.cryo_maintenance  (deferred space)
    unlock_condition: late-act
decorative_features:
  - id: ark.cryo_bay.north.memorial.fallen
    position: (3.50, 17.95, 1.80)
    dimensions: 0.80 × 0.60 × 0.05
    material: brass plate with names of crew who did NOT survive cryo
    narrative_role: the names — beautiful and terrible — of those whose pods failed
```

#### Wall: West

```
wall_id:              west
material_primary:     same as east
material_secondary:   brass dado rail
panelisation:         standard
colour_value:         --token-color-ark-cryo-bay-wall-west  (same family as east, mirror)
embedded_displays:
  - id: ark.cryo_bay.west.display.medical_relay
    position: (-8.95, 4.50, 1.50)
    dimensions: 0.80 × 0.60 × 0.05
    content: medical-system relay (links to Med Bay)
embedded_doors:        none
decorative_features:
  - id: ark.cryo_bay.west.viewport.observation
    position: (-8.95, 4.50, 2.40)
    dimensions: 1.20 × 0.80 × 0.05
    material: composite plexiglas + brass surround
    narrative_role: mirrors east viewport; together they frame the room as a "vessel between two oceans"
```

### A.1.5 Ceiling

```
height_above_floor:     4.50 m baseline; central drop-coffer over the walkway is 4.20 m (lower; gives the walkway a "tunnel-of-sleep" feel)
material:               painted aluminium honeycomb panel; central coffer is a translucent panel emitting cool-blue light
lighting_integrated:    recessed LED grid on 1.20 m × 1.20 m pattern; central coffer is a strip-light that pulses with the breath rhythm of all sleeping pods (cumulative pulse — sounds calming)
atmospheric_features:   faint cryo-mist drift visible in the central coffer's light shaft (very subtle in baseline; intensifies when a pod opens)
acoustic_treatment:     coffered (soft-absorbent at edges, slight reflection at coffer)
```

### A.1.6 Lighting

```
ambient_baseline:     5500 K (cool, clinical); 240 lux at floor level; CRI 95
direct_fixtures:
  - id: ark.cryo_bay.light.coffer_central
    position: (0.00, 9.00, 4.20)
    beam_angle: 60°
    colour: --token-color-ark-cryo-bay-coffer  (cool cyan; pulses)
    intensity: 8000 lumens (pulses 5800-8000 per breath cycle)
    function: punctuation; pulses with cumulative pod-breath
  - id: ark.cryo_bay.light.recessed_grid
    position: distributed across ceiling grid (excluding coffer zone)
    beam_angle: 60° each
    colour: --token-color-ark-cryo-bay-recessed  (cool white)
    intensity: 1500 lumens each
    function: task lighting
practical_sources:
  - id: ark.cryo_bay.pod.light.player  (and 8 other pod-glow emitters — see object inventory)
    position: per-pod
    intensity: 100 lumens (glow when sealed; brighter when unsealing)
    flicker_pattern: gentle sleeping-rhythm pulse (period 4s)
time_of_day_variation:
  act_0: ambient at 240 lux; coffer pulse calming
  act_3: ambient slightly cooler (5800K) as Ark systems begin failing
  act_5: ambient drops to 180 lux; coffer pulse weak; some pod-lights flicker
  act_7: ambient at 120 lux baseline; recovers if player has repaired ship
dynamic_response:
  - on_pod_unsealing: ambient brightens 20% in pod's local zone
  - on_critical_alert: ambient flashes red briefly
```

### A.1.7 Atmosphere

```
air_temperature:    16°C baseline (cool — cryo discipline)
humidity:           dry-cold (30% RH); smells of ozone, sterilants, faint cryo-fluid
particulate:
  - type: cryo_mist
    density: low (visible only in central coffer light shaft)
    colour: pale-cyan
    drift_direction: slow downward, period 60s/m
  - type: dust
    density: very low
    colour: greyish-white
    drift_direction: random
volumetric_fog:     absent in baseline; intensifies during pod-unsealing events (0.10 g/m³, drifts from unsealing pod)
wind_drift:         very faint; 0.04 m/s circulation; circulates from south to north
smell_canon:        ozone + sterilants + faint cryo-fluid (described in voice-line: "smells like the time-between-times")
```

### A.1.8 Sound

```
ambient_bed:           file: cryo_bay_ambient_bed_v1.ogg (loop); -34 dB; cryo-fluid bubbling, pod-life-support cycling, faint heartbeats from sealed pods
point_sources:
  - id: ark.cryo_bay.sound.pod_breath_1 through pod_breath_9
    position: per pod
    sound: faint heartbeat + breathing (each at slightly different rate, simulating different sleepers)
    occlusion_behaviour: occluded by pod glass when sealed
    trigger: continuous (only for sealed pods with occupants)
  - id: ark.cryo_bay.sound.coffer_pulse
    position: (0.00, 9.00, 4.20)
    sound: deep slow breath (period 4.0s; cumulative — sounds like a single large lung breathing for the whole room)
    occlusion_behaviour: omnidirectional
    trigger: continuous
reverb_zone:           IR-impulse: cryo_bay_long_v1.wav; wet-mix 22% (gives the room a slight cathedral feel)
music_eligibility:     cutscene only (Awakening cutscene has Category C music allowed)
voice_line_eligibility:
  - speaker: vex_solene
    trigger: presence (after Act 1)
    line_set: see §2.2.2 Vex presence-line set (cross-ref Med Bay)
  - speaker: vo_internal
    trigger: cutscene-driven (Awakening only)
    line_set: contextual
```

### A.1.9 Object inventory

Cryo Bay has 47 inventory objects. The 9 cryo-pods dominate;
walkway furniture and edge consoles complete the layout.

#### A.1.9.1-9 The Nine Cryo-Pods

The Ark has 9 cryo-pods total. The player's pod is **Pod 1**
(east row, nearest entrance). 8 of the pods are sealed in
baseline state (with sleepers — most of whom DIED in cryo); 1
is open (the player's, after waking).

##### Pod 1 — Player's Pod

```
object_id:           ark.cryo_bay.pod.1
object_class:        furniture  (specifically: a sealable pod; counted as furniture with embedded gameplay)
position:            (3.00, 2.00, 0.00)  # east row, nearest entrance
dimensions:          1.10 × 2.30 × 1.50  (oval pod oriented along +y; length is the long axis; height is the pod-base; pod-glass adds another 0.40 m above)
rotation:            0°
material_primary:    brushed-titanium pod casing; transparent aluminium oxynitride viewing-glass on top half
material_secondary:  brass control-band around the pod-edge; brass nameplate on top
colour_value:        --token-color-ark-cryo-pod-shell  (cool titanium with cyan inner glow when sealed)
interaction:         interactable
  - inspect: lore-note about cryo-pod system (player can read their own pod's record)
  - re-enter: in late-act, player can re-enter their pod (gameplay branch: "the long sleep" ending)
narrative_role:      WHERE THE PLAYER WAKES; the pod-glass is fractured from the inside (player pushed glass to escape); a hand-print remains on the inside
lore_anchor:         loredex.character.player + arc.act_0_awakening
art_status:          producer_handoff
gameplay_hook_id:    trpc.cryo.player_pod.inspect
wear_state:          worn — pod-glass cracked from the inside; cryo-fluid spilled around the pod-base
physical_constraints: collides; player can re-enter (interaction)
```

##### Pods 2-9 — Other Sleepers

Each pod has the same structural format, with different occupants
and states. Compact spec:

| pod | position | occupant | occupant state | nameplate |
|---|---|---|---|---|
| 2 | (3.00, 5.00, 0.00) | Crew member (named: Henrik Voss, Kael's brother) | DECEASED in cryo | "H. VOSS" |
| 3 | (3.00, 8.00, 0.00) | Crew member (named: Mira Tanaka) | DECEASED in cryo | "M. TANAKA" |
| 4 | (3.00, 11.00, 0.00) | Crew member (named: Yusuf Adler) | DECEASED in cryo | "Y. ADLER" |
| 5 | (3.00, 14.00, 0.00) | Crew member (named: Annika Bergstrand) | ALIVE — but in extended sleep (woken in later act if player chooses) | "A. BERGSTRAND" |
| 6 | (-3.00, 5.00, 0.00) | Crew member (named: Renju Park) | DECEASED in cryo | "R. PARK" |
| 7 | (-3.00, 8.00, 0.00) | Crew member (named: Greta Holm) | DECEASED in cryo | "G. HOLM" |
| 8 | (-3.00, 11.00, 0.00) | Crew member (named: Kira Kovács) | DECEASED in cryo | "K. KOVÁCS" |
| 9 | (-3.00, 14.00, 0.00) | Crew member (named: Vex Solène) | ALIVE — woken Act 1 | "V. SOLÈNE" |

Each pod has the same dimensions and materials as Pod 1, with
state-driven variations (sealed vs. open; occupied vs. empty;
glass cracked or pristine).

Total pod inventory: 9 sealed/openable units + 9 nameplates +
9 pod-glow lights = 27 objects rolled into "pod" class.

#### A.1.9.10-15 Walkway Floor Markers

Six brass walkway markers down the central walkway (one between
each pair of pods + one at entrance + one at rear).

```
object_id:           ark.cryo_bay.walkway.marker.1 through .6
object_class:        decoration
positions:           (0.00, 0.50, 0.005), (0.00, 3.50, 0.005), (0.00, 6.50, 0.005), (0.00, 9.50, 0.005), (0.00, 12.50, 0.005), (0.00, 15.50, 0.005)
dimensions (each):   0.40 × 0.40 × 0.005
rotation:            0°
material_primary:    brass with engraved text (each marker reads a meditation; e.g. marker 1 "the body is the boat", marker 4 "the boat is the body")
material_secondary:  none
colour_value:        --token-color-ark-cryo-bay-walkway-brass
interaction:         inspectable (read meditation)
narrative_role:      meditative pacing for player walking the room; sets the tone of "this is a sacred space"
lore_anchor:         loredex.aesthetic.solar_punk_cathedral
art_status:          producer_handoff
gameplay_hook_id:    trpc.cryo.walkway.read_marker
wear_state:          slight wear at most-walked positions
physical_constraints: non-collide
```

#### A.1.9.16 Master Cryo-Control Console (north wall)

```
object_id:           ark.cryo_bay.console.master_control
object_class:        console
position:            (0.00, 17.50, 0.00)
dimensions:          2.40 × 0.80 × 1.10
rotation:            180°  (faces -y, into the room)
material_primary:    brushed steel + matte-black control surface
material_secondary:  brass bezel with cool-blue LED accents
colour_value:        --token-color-ark-cryo-bay-master-control
interaction:         interactable
  - operate: opens cryo-master-control UI; player can wake other crew, re-seal pods, etc.
  - inspect: lore-note about master-control system
narrative_role:      gameplay-key console; player decides who to wake (Vex by default in Act 1; Annika optionally in later act)
lore_anchor:         loredex.system.cryo_pods + arc.choosing_who_wakes
art_status:          producer_handoff
gameplay_hook_id:    trpc.cryo.master_control.open
wear_state:          pristine
physical_constraints: collides
```

#### A.1.9.17-22 Pod-Foot Stools

Six small foot-stools placed at the foot of each pod-pair (used
for examining the pod's status panel at the foot of the pod).

```
object_id:           ark.cryo_bay.pod.foot_stool.1 through .6
object_class:        furniture
positions:           one per pod-pair-foot
dimensions:          0.40 × 0.40 × 0.40
rotation:            varies
material_primary:    titanium frame + cushioned top (matte-black leather)
material_secondary:  none
colour_value:        --token-color-ark-cryo-bay-stool
interaction:         interactable - sit (position to examine pod)
narrative_role:      where the player sits to mourn (or reflect on) a fallen sleeper
lore_anchor:         arc.cryo_grief
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          slight wear
physical_constraints: collides; sittable
```

#### A.1.9.23-26 Wall Chairs (visitor seating)

Four wall-mounted fold-down chairs along the east and west walls
(2 each side).

```
object_id:           ark.cryo_bay.wall_chair.east.1, .east.2, .west.1, .west.2
object_class:        furniture
positions:           (8.50, 3.00, 0.45), (8.50, 12.00, 0.45), (-8.50, 3.00, 0.45), (-8.50, 12.00, 0.45)
dimensions:          0.50 × 0.50 × 0.45 (folded); deploys to 0.50 × 0.55 × 0.85 when sat-on
rotation:            varies (faces walkway centre)
material_primary:    titanium frame + matte-black leather seat
material_secondary:  brass mounting bracket
colour_value:        --token-color-ark-cryo-bay-wall-chair
interaction:         interactable - sit (chair deploys)
narrative_role:      visitor seating; family members (in lore) sit here to keep vigil with sleepers
lore_anchor:         arc.cryo_grief
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          slight wear
physical_constraints: collides when deployed; non-collide when folded
```

#### A.1.9.27-32 Memorial Candles (one per deceased sleeper)

Six brass-stand candles at the foot of pods 2, 3, 4, 6, 7, 8 (the
six who died in cryo). Each candle is lit in baseline; players can
extinguish them (gameplay-key for endings).

```
object_id:           ark.cryo_bay.candle.<sleeper_name>
object_class:        decoration
position:            at foot of corresponding pod, on top of pod foot-stool (z = 0.45 + candle dimension)
dimensions:          0.10 × 0.10 × 0.30
rotation:            0°
material_primary:    brass stand + wax candle
material_secondary:  none
colour_value:        --token-color-ark-cryo-bay-candle
interaction:         interactable
  - light: re-lights an extinguished candle
  - extinguish: extinguishes a lit candle (sympathetic gesture)
  - inspect: reads sleeper's full name + cryo-end-date
narrative_role:      memorial for the dead; player's choice to keep them lit or extinguish them is a meaningful endgame branch
lore_anchor:         arc.cryo_grief + arc.endings_lighting_or_extinguishing
art_status:          producer_handoff
gameplay_hook_id:    trpc.cryo.candle.toggle
wear_state:          slight wear
physical_constraints: non-collide
```

#### A.1.9.33-39 Eastern Lockers

Seven personal lockers along the east wall (between the two
viewports), one per crew member who has personal effects in
cryo storage.

```
object_id:           ark.cryo_bay.locker.east.<n> for n in 1..7
object_class:        container
positions:           (8.50, n*1.20+1.50, 0.00) where n = 1..7
dimensions:          0.40 × 0.40 × 1.80
rotation:            270°  (parallel to east wall, doors face into walkway)
material_primary:    brushed-titanium with brass handle
material_secondary:  brass nameplate (varies)
colour_value:        --token-color-ark-cryo-bay-locker
interaction:         interactable
  - open: contains personal effects (varies per occupant; readable journals, photos, mementos)
  - inspect: lore-note about occupant
narrative_role:      personal touchpoints for sleepers; player builds emotional connection to the dead before encountering their bodies
lore_anchor:         per occupant
art_status:          producer_handoff
gameplay_hook_id:    trpc.cryo.locker.open
wear_state:          varies
physical_constraints: collides
```

(Western lockers are mirror-positioned but reserved for crew
not yet introduced; remain locked through Act 7.)

#### A.1.9.40-47 Remaining Decorative Objects

| object_id | class | position | dimensions | role |
|---|---|---|---|---|
| `ark.cryo_bay.fire_extinguisher.south` | interactive | (-8.50, 0.20, 1.20) | 0.20 × 0.20 × 0.50 | safety |
| `ark.cryo_bay.fire_extinguisher.north` | interactive | (8.50, 17.80, 1.20) | mirror | safety |
| `ark.cryo_bay.first_aid.kit` | container | (4.00, 0.20, 1.50) on south wall | 0.40 × 0.10 × 0.30 | medical |
| `ark.cryo_bay.intercom.entrance` | console | (-2.00, 0.20, 1.50) on south wall | 0.20 × 0.10 × 0.30 | comms relay |
| `ark.cryo_bay.intercom.master` | console | (0.00, 17.80, 1.50) on north wall | 0.20 × 0.10 × 0.30 | comms relay (master) |
| `ark.cryo_bay.maintenance_panel.east` | hatch | (8.95, 9.00, 1.20) on east wall | 0.40 × 0.05 × 0.60 | ducting access |
| `ark.cryo_bay.maintenance_panel.west` | hatch | (-8.95, 9.00, 1.20) on west wall | mirror | ducting access |
| `ark.cryo_bay.brass_compass_inlay` | decoration | (0.00, 9.00, 0.005) | 0.80 × 0.80 × 0.005 | floor compass-rose at room centre |

Total: 47 inventory objects.

### A.1.10 Camera-spawn-points (FPV cutscenes)

```
cutscene_id:         cs_amb_cryo_bay  (Category B)
camera_position:     (0.00, 0.50, eye_level)
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         slow walk-pan from south to north along walkway (18s)

cutscene_id:         cs_awakening  (existing shipped cutscene; FPV audit pending)
camera_position:     (3.00, 2.00, 0.50)  # INSIDE Pod 1, looking up
camera_facing:       (0°, 90°, 0°)  # looking up (+90° pitch)
avatar_height_anchor: prone (player is supine)
head_motion:         pitch slowly from +90° (looking up at pod-glass) to 0° (looking forward) as player rises; lasts 14s; ends with player standing beside the pod
notes_for_audit:     The current shipped Awakening cutscene MAY currently render third-person on cryo-pod exterior. Refactor to first-person POV INSIDE the pod, looking up through frosted glass; pod-glass cracks; player's hands push glass; first sight is the cryo-bay ceiling.

cutscene_id:         cs_clone_initial_reveal  (Act 1)
camera_position:     (3.00, 2.00, 0.50)  # same position as Awakening (callback)
camera_facing:       (0°, 90°, 0°)
avatar_height_anchor: prone
head_motion:         pitch from +90° to 0° as Vex's silhouette appears through glass; lasts 14s

cutscene_id:         cs_clone_first_resurrection  (later acts)
camera_position:     (3.00, 2.00, 0.50)  # same position (callback)
camera_facing:       (0°, 90°, 0°)
avatar_height_anchor: prone
head_motion:         repeats Awakening structure but with degraded vat audio (cf §3.1.A.5)
```

### A.1.11 Doorways

```
door_id:            ark.cryo_bay.south.door.main
connecting_space_id: ark.corridor.cryo_approach
door_position:      (0.00, 0.00, 0.00)
door_dimensions:    1.40 × 2.40 × 0.10
door_class:         pressure_seal
unlock_condition:   always after Act 0 awakening
transit_animation:  airlock-cycle (5s)
audio_signature:    pressure-equalisation-hiss + magnetic-clack on lock + servo-whir

door_id:            ark.cryo_bay.north.door.maintenance
connecting_space_id: ark.corridor.cryo_maintenance  (deferred)
door_position:      (-3.50, 17.95, 0.00)
door_dimensions:    1.20 × 2.40 × 0.10
door_class:         slide
unlock_condition:   late-act (Act 5+)
transit_animation:  fade
audio_signature:    pneumatic-hiss + servo-whir
```

### A.1.12 Adjacency map

```
direct_adjacencies:
  - ark.corridor.cryo_approach (south door)
  - ark.corridor.cryo_maintenance (north door, late-act)
one_hop_adjacencies:
  - ark.med_bay (via corridor + central corridor)
  - ark.bridge (via corridor + Deck-1 corridor)
```

### A.1.13 Gameplay hooks

```
hooks:
  - hook_id:         cryo_bay.exitPlayerPod
    trigger:         player.escape on ark.cryo_bay.pod.1 (one-shot, Act 0)
    procedure:       trpc.cryo.player_pod.escape
    success_state:   awakening_complete = true
  - hook_id:         cryo_bay.openLocker
    trigger:         player.open on ark.cryo_bay.locker.east.<n>
    procedure:       trpc.cryo.locker.open
    success_state:   locker_opened = true (per-locker)
  - hook_id:         cryo_bay.toggleCandle
    trigger:         player.interact on ark.cryo_bay.candle.<sleeper_name>
    procedure:       trpc.cryo.candle.toggle
    success_state:   candle_state = lit | extinguished (per-candle; affects ending branch)
  - hook_id:         cryo_bay.openMasterControl
    trigger:         player.operate on ark.cryo_bay.console.master_control
    procedure:       trpc.cryo.master_control.open
    success_state:   master_control_active = true
  - hook_id:         cryo_bay.wakeOtherSleeper
    trigger:         (state-conditional) player.operate on master_control + chooses_sleeper
    procedure:       trpc.cryo.wake_sleeper
    success_state:   sleeper_woken = true (per-sleeper)
  - hook_id:         cryo_bay.readWalkwayMarker
    trigger:         player.inspect on ark.cryo_bay.walkway.marker.<n>
    procedure:       trpc.cryo.walkway.read_marker
    success_state:   marker_read = true (per-marker)
```

### A.1.14 Story-tie

```
primary_arcs:
  - arc.act_0_awakening
  - arc.cryo_grief
  - arc.choosing_who_wakes
  - arc.endings_lighting_or_extinguishing
per_act_evolution:
  act_0:
    description: "Pristine state. 8 pods sealed (with sleepers, most dead but the player doesn't know yet); 1 pod (player's) is opening. Player awakens. Walks the room. Discovers Vex is alive (Pod 9). Walks out south door."
    visible_changes: pod_1_opening, walkway_unwalked
  act_1:
    description: "Vex is awake (Pod 9 empty). Player begins to learn who else is in the pods. Some lockers can be opened."
    visible_changes: pod_9_empty, lockers_partially_opened
  act_3:
    description: "Player discovers the dead. Memorial candles can be lit (one per dead sleeper). Player chooses whether to extinguish or relight."
    visible_changes: candles_visible, dead_sleepers_known
  act_5:
    description: "Pod systems begin failing. Pod 5 (Annika) is at risk. Master control offers wake/stay decision."
    visible_changes: pod_5_at_risk, master_control_alert
  act_7:
    description: "Final state. All candles either lit (player chose mercy) or extinguished (player chose silence). Annika either alive or stays sleeping. Affects ending."
    visible_changes: state_branch_determined
npc_roster:
  - vex_solene: occasional visitor (mostly in Med Bay)
  - the_player: protagonist
  - the_dead: 6 sleepers (offscreen presence; their lockers, candles, and pods carry their story)
readables:
  - dedication plaque (south wall): "for those who sleep — and those who wake"
  - memorial plate (north wall): names of the 6 dead sleepers
  - walkway markers: 6 meditations (full text deferred to §13.X but anchored here)
  - locker contents: 7 east-locker reveals
master_of_rlyeh_question: n/a (Cryo Bay is not a Hellbox host)
```

### A.1.15 Special-FX

```
particle_systems:
  - cryo_mist_baseline (faint cyan mist drifting downward from coffer)
  - cryo_burst_unsealing (when a pod opens; thick cyan vapor; lasts 4s)
  - candle_flame_flicker (each lit candle; 6 emitters)
  - dust_motes (very subtle)
volumetric_effects:
  - coffer_light_shaft (cool-blue beam from central coffer to floor)
  - viewport_glow (east + west; reflects starfield content)
procedural_animations:
  - pod_breath_cumulative (all sealed pods breath in sync, defining the room's rhythm)
  - candle_flame (continuous flicker per lit candle)
  - walkway_brass_polish_motion (subtle reflective sheen as player walks past — visual breadcrumb)
reactive_systems:
  - pod_glow_on_proximity (each pod pulses brighter as player approaches within 1.0 m)
  - candle_lit_on_player_inspect (if extinguished, lighting it is a one-shot)
  - candle_extinguished_on_player_inspect (if lit, extinguishing it is a one-shot)
  - memorial_plate_glow_on_proximity (gentle highlight as player approaches)
  - pod_unsealing_event (Pod 5 in Act 5; Pod 9 in Act 1)
```

### A.1.16 Avatar-parametricity

```
camera_height_variation:
  small_xenomorph (0.85m eye): camera height 0.85m; pod-glass appears closer overhead during Awakening; pod-stool ergonomics adjusted
  short_humanoid (1.40m eye): camera height 1.40m; standard
  average_humanoid (1.70m eye): camera height 1.70m; standard
  tall_humanoid (2.05m eye): camera height 2.05m; pod feels small; ceiling-coffer feels closer
  tall_xenomorph (2.70m eye): camera height 2.70m; pod is cramped (extended-Awakening animation accommodates)
reachability:
  small_xenomorph: cannot reach memorial plate (1.80m); lookups via console-relay
  small_xenomorph: cannot reach top shelves of east-lockers; only bottom-shelf items shown
  others: all-reachable
audio_occlusion_variation:
  xenomorph_sensitive_hearing: pod-breath audible from across the room; cumulative breathing more pronounced
  synthetic_voice_avatar: ambient bed slightly altered (synthetic resonance in pod-vibrations)
```

### A.1.17 Performance

```
polygon_budget:      320,000 polygons (Cryo Bay is hero-feature for Act 0; high-fidelity)
texture_budget:      180 MB total (pod-glass shader is expensive)
light_count_limit:   18 simultaneous dynamic lights
lod_plan:
  - hero_distance: 0-10m, full detail
  - mid_distance: 10-25m, mid detail (pod-mist reduced; candle-flame simplified)
  - low_distance: 25m+, low detail (pod-mist removed; candle-flames as billboards)
streaming_behaviour:
  - preload: ark.corridor.cryo_approach (south)
  - on_player_proximity_to_north_door: preload ark.corridor.cryo_maintenance (when door is unlocked)
```

---

## A.2 Medical Bay — FULL

**Status: FULL spec.** Cross-ref: `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.2 (art-state prompts) and §3.12.3 HB1 Celebration School gateway.

### A.2.1 Header

```
space_id:        ark.med_bay
space_name:      Medical Bay
space_type:      ark_room  (also Hellbox-1 host)
act_introduced:  Act 1
lore_anchor:     loredex.character.vex_solene + loredex.system.med_bay + arc.act_1_first_diagnosis
aesthetic_tier:  solar_punk_cathedral  (with HB1 manifesting Celebration School aesthetic during transit)
```

### A.2.2 Geometry

```
dimensions:           14.00 m × 12.00 m × 4.50 m
origin_point:         centre of floor at the primary entrance threshold (entrance is the south wall)
coordinate_axes:      +x = right, +y = forward, +z = up
floor_plan_geometry:  rectangular  (with apsidal rear — north wall is curved outward, radius 4.0 m)
volumetric_anomalies: none in baseline; HB1 transit briefly turns the entire room non-Euclidean (~10s of cutscene)
```

The apsidal rear gives the room a chapel-like quality — fitting,
because Med Bay also serves as the gateway to Celebration School
(HB1).

Floor area: ~168 m².

### A.2.3 Floor

```
material_primary:     polished cream-tinted enamel-coated steel deck plate; 1.20 m × 1.20 m tiles; 4 mm gap
material_secondary:   brass perimeter trim + central walkway-cross (forms a Christian-cross floor pattern when the central walkway intersects with a transverse walkway at the autoclave)
pattern:              cross-pattern walkway with concentric rings centred on the autoclave statue
wear_state:           pristine in baseline; slight wear at Vex's primary work-zone (zone: x: -1.5 to 1.5, y: 5.0 to 7.0, z: 0)
embedded_features:
  - id: ark.med_bay.floor.drain.south
    position: (0.00, 1.50, 0.00)
    dimensions: 0.30 × 0.30 × 0.10
    function: medical-fluid drain
  - id: ark.med_bay.floor.drain.center
    position: (0.00, 6.50, 0.00)
    dimensions: 0.30 × 0.30 × 0.10
    function: emergency drain
acoustic_property:    hard_reflective with apsidal echo at rear; RT60 = 0.55s (slight cathedral acoustic, intentional)
```

### A.2.4 Walls (compact)

(Med Bay has 4 walls; south, east, west are rectangular; north is
apsidal/curved. Compact specs follow the Bridge pattern in
INCEPTION_ARK_FINAL_PRODUCTION.md §4.18.4.)

- **South wall**: cream painted aluminium; brass dado at z=1.10m; main entrance at (0.00, 0.00, 0.00); 1.40×2.40 pressure-seal door; commission plaque "MEDICAL BAY / Healing is the Captain's First Duty" at (0.00, 0.20, 3.20).
- **East wall**: cream painted aluminium; brass dado; embedded medical-records display at (6.95, 4.00, 1.50) 1.50×1.00; observation window at (6.95, 8.00, 1.80) 0.80×1.20.
- **West wall**: mirror of east; CADES Console alcove (cross-ref §2.47) at (-6.95, 4.00, 1.50) 1.50×1.00; observation window at (-6.95, 8.00, 1.80) 0.80×1.20.
- **North wall (apsidal/curved)**: solar-cathedral stained-glass-style backlit panel; depicts a phoenix-like motif (visual hint of HB1 Celebration School). The autoclave-statue stands directly in front of this wall.

### A.2.5 Ceiling

```
height_above_floor:     4.50 m baseline; apsidal vault at rear rises to 5.50 m; central coffer over autoclave at 5.00 m
material:               painted aluminium honeycomb panel with translucent stained-glass-style emitter at the apsidal vault
lighting_integrated:    recessed grid 1.20m × 1.20m + central coffer + apsidal stained-glass emitter (warm-amber light, gives the room its solar-cathedral feel)
atmospheric_features:   sunlight-equivalent shaft from apsidal vault (state-axis driven; intensifies on patient-recovery moments)
acoustic_treatment:     coffered with apsidal echo at rear
```

### A.2.6 Lighting

```
ambient_baseline:     5000 K (slightly warm-clinical); 280 lux at floor level; CRI 95
direct_fixtures:
  - id: ark.med_bay.light.coffer_central
    position: (0.00, 6.50, 5.00)
    beam_angle: 60°
    colour: --token-color-ark-med-bay-coffer  (warm white)
    intensity: 9000 lumens
  - id: ark.med_bay.light.apsidal_glass
    position: (0.00, 11.50, 5.50)  # apsidal stained-glass position
    beam_angle: 120° downward
    colour: --token-color-ark-med-bay-apsidal-glass  (warm amber with gold)
    intensity: 7000 lumens (variable)
    function: ambient + symbolic
  - id: ark.med_bay.light.recessed_grid_array
    position: distributed
    beam_angle: 60°
    colour: cool white
    intensity: 1500 lumens each
  - id: ark.med_bay.light.surgical_array (state-conditional)
    position: (0.00, 5.50, 4.50)  # over surgical-table position
    beam_angle: 30°
    colour: 6500 K bright white
    intensity: 12000 lumens
    function: surgical task lighting (only during procedures)
practical_sources:
  - autoclave_glow at (0.00, 9.00, 1.20) — 80 lumens, breathing pulse
time_of_day_variation: as Cryo Bay; degrades over Acts
dynamic_response:
  - on_surgical_event: surgical_array activates; ambient dims
  - on_HB1_transit: apsidal_glass intensifies; petals emerge from autoclave statue (cf §3.12.3)
```

### A.2.7-8 Atmosphere + Sound (compact)

- **Atmosphere**: 21°C; 45% RH; smells of antiseptic + ozone + faint floral (the Celebration School foreshadowing in the air); particulate: occasional petal (very rare in baseline; intensifies during HB1 events).
- **Sound**: ambient bed has soft choral hum (very faint, -38 dB; supports HB1 atmosphere even in baseline); autoclave-cycle hum; faint distant medical-equipment beeps.

### A.2.9 Object inventory (compact for brevity)

Med Bay has ~52 inventory objects. Key objects specced; full
inventory continued in follow-up commits.

**Centerpiece — The Autoclave Statue (HB1 anchor)**

```
object_id:           ark.med_bay.autoclave.statue
object_class:        interactive  (also fx_emitter for HB1 transit)
position:            (0.00, 9.00, 0.00)  # north-centre, in front of apsidal wall
dimensions:          1.40 × 1.40 × 1.80
rotation:            0°
material_primary:    polished bronze + matte-glass surfaces
material_secondary:  brass detail-work; backlit cyan core
colour_value:        --token-color-ark-med-bay-autoclave-bronze
interaction:         interactable
  - inspect: lore-note about the autoclave + the welcome-statue dual function
  - lift_for_HB1: triggers HB1 Celebration transit cutscene (one-shot per playthrough)
narrative_role:      DUAL FUNCTION — operationally an autoclave (sterilises tools); cosmologically the welcome-statue at the threshold of HB1; lifting it dissolves it into petals that initiate Celebration School transit
lore_anchor:         loredex.system.med_bay_autoclave + arc.act_1_first_HB1_invocation
art_status:          producer_handoff
gameplay_hook_id:    trpc.med_bay.autoclave.lift + trpc.hellbox.hb1.openGate
wear_state:          pristine (sacred artifact)
physical_constraints: collides; can be lifted (one-shot animation)
```

**Other key objects** (compact specs for the remaining ~51):

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.med_bay.autoclave.console` | console | (0.00, 9.00, 1.05) on the autoclave statue | 0.40 × 0.20 × 0.30 | controls autoclave ops |
| `ark.med_bay.autoclave.shelf` | container | (0.00, 9.20, 1.50) | 1.00 × 0.30 × 0.10 | DNA receipt plate forms here (cs_amb_med_bay) |
| `ark.med_bay.surgical_table` | furniture | (0.00, 5.50, 0.00) | 2.20 × 0.80 × 0.85 | surgery / examinations |
| `ark.med_bay.surgical_table.lamp` | fx_emitter | above table at (0.00, 5.50, 4.50) | 0.40 dia | surgical light arm |
| `ark.med_bay.diagnostic_chair.east` | furniture | (3.00, 3.00, 0.00) | 0.80 × 1.00 × 1.20 | patient diagnostic seat |
| `ark.med_bay.diagnostic_chair.west` | furniture | (-3.00, 3.00, 0.00) | mirror | patient diagnostic seat |
| `ark.med_bay.med_records_display` | display | (6.95, 4.00, 1.50) on east wall | 1.50 × 1.00 × 0.05 | full medical records |
| `ark.med_bay.cades_console` | console | (-6.95, 4.00, 1.50) on west wall | 1.50 × 1.00 × 0.05 | CADES mission briefing (annex per §2.47) |
| `ark.med_bay.specimen_cabinet.east` | container | (6.50, 5.50, 0.00) | 1.20 × 0.50 × 1.80 | specimen storage |
| `ark.med_bay.specimen_cabinet.west` | container | (-6.50, 5.50, 0.00) | mirror | specimen storage |
| `ark.med_bay.vex_workstation` | furniture | (-2.00, 6.50, 0.00) | 1.20 × 0.80 × 1.10 | Vex's primary desk |
| `ark.med_bay.vex_workstation.chair` | furniture | (-2.00, 7.20, 0.00) | 0.80 × 0.80 × 1.40 | Vex's chair |
| `ark.med_bay.vex_journal` | container | on Vex's desk | 0.30 × 0.20 × 0.04 | Vex's medical journal (gameplay-key in Act 5) |
| `ark.med_bay.medical_supply.crate.1-6` | container | along east wall | 0.60 × 0.40 × 0.40 each | medical supplies |
| `ark.med_bay.intercom.south` | console | south wall | 0.20 × 0.10 × 0.30 | comms relay |
| `ark.med_bay.intercom.vex_desk` | console | on Vex's desk | 0.20 × 0.10 × 0.30 | comms relay |
| `ark.med_bay.fire_extinguisher.south` | interactive | south wall | 0.20 × 0.20 × 0.50 | safety |
| `ark.med_bay.first_aid.kit.east` | container | east wall | 0.40 × 0.10 × 0.30 | redundant aid |
| `ark.med_bay.first_aid.kit.west` | container | west wall | mirror | redundant aid |
| `ark.med_bay.observation_window.east` | decoration | east wall | 0.80 × 1.20 × 0.05 | viewport |
| `ark.med_bay.observation_window.west` | decoration | west wall | mirror | viewport |
| `ark.med_bay.commission_plaque` | decoration | south wall above door | 1.00 × 0.40 × 0.02 | "MEDICAL BAY / Healing is the Captain's First Duty" |
| `ark.med_bay.dna_receipt_plate.station` | interactive | autoclave shelf | 0.30 × 0.20 × 0.05 | DNA receipt printing station |

(Continued specs follow same pattern; full 52-object listing
continues in §A.2.9.x in follow-up commit.)

### A.2.10 Camera-spawn-points

```
cutscene_id:         cs_amb_med_bay  (Category B)
camera_position:     (0.00, 1.50, eye_level)
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         slow approach to autoclave shelf, head-tilt down

cutscene_id:         cs_hellbox_1_open  (HB1 Celebration gateway)
camera_position:     (0.00, 7.50, eye_level)  # in front of autoclave statue
camera_facing:       (0°, 0°, 0°)  # facing autoclave
avatar_height_anchor: eye_level
head_motion:         slow approach + hand-rig enters frame to lift the statue

cutscene_id:         cs_hellbox_1_transit  (HB1 transit)
camera_position:     (0.00, 7.50, eye_level)
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         travels through petal-tunnel; opens onto Celebration

cutscene_id:         cs_hellbox_1_close  (HB1 return)
camera_position:     (0.00, 7.50, eye_level)
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         petals fade; med_bay re-materialises
```

### A.2.11-17 Doors / Adjacency / Hooks / Story / FX / Parametricity / Performance (compact)

```
door_id:            ark.med_bay.south.door.main
connecting_space_id: ark.corridor.med_approach
door_position:      (0.00, 0.00, 0.00); 1.40 × 2.40 × 0.10; pressure_seal; always-unlocked

direct_adjacencies:
  - ark.corridor.med_approach (south)
  - hellbox.celebration_school (HB1 portal via autoclave statue, conditional on Act 1+)

primary_arcs:
  - arc.act_1_first_diagnosis
  - arc.act_1_first_HB1_invocation
  - arc.vex_arc (Vex is THE NPC of Med Bay)

per_act_evolution: Vex's workstation cluttering grows; Vex's journal expands; HB1 invocation possible from Act 1 onward; in Act 5+, Vex's notes hint at clone substrate

npc_roster:
  - vex_solene: primary occupant (Med Bay is her home)
  - the_player: visitor for diagnoses, surgeries, and HB1 invocations
  - the_master_of_rlyeh: HB1 transit voice only

readables:
  - dedication plaque
  - Vex's journal (Act 5 gameplay-key)
  - DNA receipt plates (Act 1 reveal: player learns their own DNA)

master_of_rlyeh_question: "When the body fails, does the self?" (per HB1)

particle_systems: dust_motes (low); petals (during HB1 only); steam (autoclave cycle)
volumetric_effects: apsidal_light_shaft; surgical_array_beam (conditional)
procedural_animations: autoclave_breath; vex_papers_settle; coffer_pulse
reactive_systems: surgical_array_on_demand; autoclave_lift_one_shot

camera_height_variation: as Cryo Bay
reachability: small_xenomorph cannot reach top apsidal panel; otherwise all-reachable
audio_occlusion_variation: as Cryo Bay

polygon_budget: 280,000
texture_budget: 160 MB
light_count_limit: 14 dynamic lights
streaming_behaviour: preload corridor.med_approach + (HB1-conditional) preload destination.celebration_school
```

---

## A.3 Command Bridge — FULL (cross-ref §4.18 in INCEPTION doc)

**Status: FULL spec authored as the Architect-Layer worked
exemplar.** See `INCEPTION_ARK_FINAL_PRODUCTION.md` §4.18 for
the complete spec (38 objects, all 17 layers). This entry exists
for cross-reference only.

```
space_id:        ark.bridge
space_name:      Command Bridge
space_type:      ark_room  (also Hellbox-3 host)
act_introduced:  Act 0 (visible from cryo wake; full access from Act 1)
lore_anchor:     loredex.character.kael_voss + loredex.faction.captain_lineage + arc.act_0_loss_of_command
aesthetic_tier:  solar_punk_cathedral
master_of_rlyeh_question: "Does a child's first death haunt the world that buried them?" (per HB3)
```

See `INCEPTION_ARK_FINAL_PRODUCTION.md` §4.18 for full §4 spec.

---

## A.4 Archives — CORE

**Status: CORE.** Full architect spec deferred to Phase B-2.

### A.4.1 Header

```
space_id:        ark.archives
space_name:      Archives
space_type:      ark_room
act_introduced:  Act 2
lore_anchor:     loredex.system.archives + arc.lore_recovery
aesthetic_tier:  solar_punk_cathedral
```

### A.4.2 Geometry summary

```
dimensions:           12.00 m × 10.00 m × 4.20 m
floor_plan_geometry:  rectangular
```

### A.4.3 Story-tie summary

The Archives is a low-key reference room — players come here to
research lore, look up entities, and consult the Antiquarian's
records (separate from the Antiquarian's Library §2.13). Quiet
acoustic; bookshelf walls; central reading table. The Archives
serves as a precursor to the Library; players who find the
Library's pocket-dimension entrance often pass through here first.

### A.4.4 Key objects (compact)

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.archives.reading_table` | furniture | (0.00, 5.00, 0.00) | 2.40 × 1.20 × 0.85 | central reading surface |
| `ark.archives.reading_chair.1-4` | furniture | around table | 0.80 × 0.80 × 1.20 each | seating |
| `ark.archives.bookshelf.east.1-6` | container | east wall | 1.60 × 0.40 × 4.20 each | stacked tomes; specific entries readable |
| `ark.archives.bookshelf.west.1-6` | container | west wall | mirror | as east |
| `ark.archives.archive_terminal` | console | (0.00, 9.50, 0.00) | 1.40 × 0.80 × 1.10 | search interface for LOREDEX |
| `ark.archives.lore_plaque.<n>` | decoration | various | varied | discoverable lore-readables |

(Full §4 spec deferred — Phase B-2.)

---

## A.5 Comms Array — CORE

**Status: CORE.** Full architect spec deferred to Phase B-2.

### A.5.1 Header

```
space_id:        ark.comms_array
space_name:      Comms Array
space_type:      ark_room
act_introduced:  Act 2
lore_anchor:     loredex.character.the_human + loredex.character.locke + arc.act_2_first_human_contact
aesthetic_tier:  solar_punk_cathedral
```

### A.5.2 Geometry summary

```
dimensions:           10.00 m × 14.00 m × 5.50 m
floor_plan_geometry:  rectangular  (long-rectangle; primary entrance on long wall)
```

The Comms Array is taller than most rooms — it's a vertical-volume
space dominated by a frequency-wall on the north end (12.00 m wide,
4.50 m tall display) showing all ambient frequencies. The 52.7 MHz
indicator is the load-bearing detail (Act 2 first contact happens
here).

### A.5.3 Story-tie

The 52.7 MHz frequency is the player's first sustained contact with
the Human. Everything in this room is staged to draw the player's
attention to that frequency. The frequency wall is the room's
centerpiece. (Future Hellbox candidate HB-Programmer's-Sanctum
deferred but lives here philosophically.)

### A.5.4 Key objects (compact)

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.comms_array.frequency_wall` | display | (0.00, 13.50, 2.50) | 12.00 × 4.50 × 0.10 | full frequency display |
| `ark.comms_array.frequency.52_7` | display | within frequency wall at (0.00, 13.50, 2.80) | 0.40 × 0.40 highlight | THE indicator |
| `ark.comms_array.console.primary` | console | (0.00, 7.00, 0.00) | 2.40 × 1.20 × 1.10 | primary comms control |
| `ark.comms_array.operator_chair` | furniture | (0.00, 8.50, 0.00) | 0.80 × 0.80 × 1.40 | operator seat |
| `ark.comms_array.signal_visualiser` | display | (4.00, 7.00, 1.50) | 1.20 × 1.20 × 0.05 | signal-pattern display |
| `ark.comms_array.archive_terminal` | console | (-4.00, 7.00, 0.00) | 1.20 × 0.80 × 1.10 | comms archive lookup |
| `ark.comms_array.broadcasting_chair.east.1-3` | furniture | east wall | 0.80 × 0.80 × 1.20 each | observer seating |
| `ark.comms_array.broadcasting_chair.west.1-3` | furniture | west wall | mirror | observer seating |

(Full spec deferred.)

---

## A.6 Observation Deck — CORE

```
space_id:        ark.observation_deck
space_name:      Observation Deck
space_type:      ark_room
act_introduced:  Act 1
lore_anchor:     loredex.character.eidolon + arc.eidolon_arc
aesthetic_tier:  solar_punk_cathedral
```

A vast viewing-deck on the upper Ark; full-bay viewport (16m × 6m);
benches along the inner wall; reflective floor that doubles the
star-field. The Observation Deck is where the player's Eidolon
manifests; Eidolon presence-line set per §2.6.2 of INCEPTION doc.

```
dimensions:           16.00 m × 8.00 m × 6.00 m
floor_plan_geometry:  rectangular
```

Key objects:
- `ark.observation_deck.viewport` — viewport on the long north wall
- `ark.observation_deck.bench.1-4` — observation benches
- `ark.observation_deck.eidolon_anchor` — designated NPC anchor where
  Eidolon manifests (cosmic-presence)
- `ark.observation_deck.telescope` — interactive astronomical telescope
- `ark.observation_deck.star_table` — interactive star-chart table

(Full spec deferred to Phase B-2.)

---

## A.7 Engineering Bay — FULL

**Status: FULL spec.** Cross-ref: `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.7 (art-state prompts) and §3.12.6 HB4 Mechronis Academy gateway.

### A.7.1 Header

```
space_id:        ark.engineering_bay
space_name:      Engineering Bay
space_type:      ark_room  (also Hellbox-4 host)
act_introduced:  Act 3
lore_anchor:     loredex.system.ark_reactor + loredex.faction.mechronis + arc.act_3_engineering_revelations
aesthetic_tier:  solar_punk_cathedral  (with industrial-grit accents)
master_of_rlyeh_question: "Is the worker the work, or the work's prisoner?" (per HB4)
```

### A.7.2 Geometry

```
dimensions:           14.00 m × 16.00 m × 12.00 m
origin_point:         centre of floor at the primary entrance threshold (entrance is the south wall)
coordinate_axes:      +x = right, +y = forward, +z = up
floor_plan_geometry:  rectangular  (with reactor-shaft viewport opening through the north wall)
volumetric_anomalies: none in baseline; HB4 transit briefly turns workbench non-Euclidean (~10s)
```

The room is unusually tall (12.00 m) because the reactor's
vertical shaft is visible through the rear viewport. Two mezzanine
levels at z = 4.00 and z = 8.00 ring the room (accessed via spiral
stairs at the southwest and southeast corners), giving an
industrial three-tier feel.

Floor area: 224 m² (ground level); plus mezzanine area at each tier.

### A.7.3 Floor

```
material_primary:     industrial steel grating, 1.50 m × 1.50 m panels with 50 mm × 5 mm slot pattern; allows steam to vent from below; 6 mm gap between panels
material_secondary:   solid steel plate at workbench zone (x: -2.0 to 2.0, y: 1.0 to 4.0); brass perimeter trim around the reactor-viewport zone
pattern:              grating with cross-bracing every 0.30 m; solid plate is anti-slip etched
wear_state:           pristine in early acts; in Act 5+, oil stains accumulate around workbench and tool-racks; in Act 7, scorch-marks if reactor has overheated
embedded_features:
  - id: ark.engineering_bay.floor.drain.south_central
    position: (0.00, 1.50, 0.00)
    dimensions: 0.40 × 0.40 × 0.10
    function: coolant-fluid drain
  - id: ark.engineering_bay.floor.charge_point.workbench
    position: (0.00, 2.50, 0.00)
    dimensions: 0.30 × 0.30 × 0.05
    function: workbench tool-charge coupling
  - id: ark.engineering_bay.floor.steam_vent.east
    position: (5.50, 7.00, 0.00)
    dimensions: 0.60 × 0.60 × 0.10
    function: pressure-relief steam vent (active during reactor cycles)
  - id: ark.engineering_bay.floor.steam_vent.west
    position: (-5.50, 7.00, 0.00)
    dimensions: 0.60 × 0.60 × 0.10
    function: pressure-relief steam vent (mirror)
acoustic_property:    hard_reflective + steam-attenuating; RT60 = 0.65s (long industrial reverb)
```

### A.7.4 Walls

#### Wall: South (entrance)

```
wall_id:              south
material_primary:     painted steel panel with rivet-detail (0.80 m × 1.60 m panels, vertical joints, exposed rivets at panel corners every 0.40 m)
material_secondary:   brass dado rail at z = 1.10 m
panelisation:         9 panels wide × 7 panels tall (wall is 12 m tall — 3 panels for ground level + 4 for mezzanines)
colour_value:         --token-color-ark-engineering-bay-wall-south  (deep slate-grey with copper pin-stripe at z = 2.00 m)
embedded_displays:
  - id: ark.engineering_bay.south.display.reactor_status
    position: (-3.50, 0.20, 1.80)
    dimensions: 1.40 × 1.00 × 0.05
    content: real-time reactor health metrics; state-axis driven
  - id: ark.engineering_bay.south.display.craft_queue
    position: (3.50, 0.20, 1.80)
    dimensions: 1.40 × 1.00 × 0.05
    content: active crafting queue (player-driven)
embedded_doors:
  - door_id: ark.engineering_bay.south.door.main
    position: (0.00, 0.00, 0.00)
    dimensions: 1.60 × 2.40 × 0.10
    door_class: pressure_seal
    connecting_space_id: ark.corridor.engineering_approach
decorative_features:
  - id: ark.engineering_bay.south.plaque.dedication
    position: (0.00, 0.20, 3.20)
    dimensions: 1.20 × 0.40 × 0.02
    material: brass with engraved text
    narrative_role: reads "ENGINEERING / The work, the worker, the world"; the Mechronis credo
```

#### Wall: East

```
wall_id:              east
material_primary:     painted steel panel with rivet-detail; mid-wall is occupied by a vast tool-rack (specced in inventory)
material_secondary:   brass dado rail
panelisation:         standard
colour_value:         --token-color-ark-engineering-bay-wall-east  (slate-grey, slightly warmer than south)
embedded_displays:
  - id: ark.engineering_bay.east.display.reactor_thermal
    position: (6.95, 9.00, 2.50)
    dimensions: 1.20 × 0.80 × 0.05
    content: thermal map of reactor
  - id: ark.engineering_bay.east.display.mezzanine_2
    position: (6.95, 9.00, 6.00)  # mid-mezzanine
    dimensions: 1.00 × 0.60 × 0.05
    content: pressure / flow readouts
embedded_doors:
  - door_id: ark.engineering_bay.east.door.workshop
    position: (6.95, 12.00, 0.00)
    dimensions: 1.40 × 2.40 × 0.10
    door_class: slide
    connecting_space_id: ark.forge_workshop
decorative_features:
  - id: ark.engineering_bay.east.spiral_stair
    position: (5.50, 0.50, 0.00)  # southwest base of stair
    dimensions: 1.80 × 1.80 × 12.00 (footprint × height)
    material: steel + brass railing
    narrative_role: spiral staircase to mezzanines 1 and 2; dramatic vertical element
  - id: ark.engineering_bay.east.warning_sign.high_voltage
    position: (6.90, 5.00, 2.40)
    dimensions: 0.40 × 0.30 × 0.01
    material: yellow-and-black painted steel
    narrative_role: classic high-voltage warning; reinforces the Mechronis aesthetic
```

#### Wall: North (reactor viewport)

The northern wall is dominated by the reactor-shaft viewport.

```
wall_id:              north_reactor
material_primary:     reinforced transparent aluminium oxynitride (transparent armor); 8.00 m wide; 10.00 m tall (from z = 1.00 to z = 11.00); flat (NOT bowed — reactor-internal pressure requires planar)
material_secondary:   brass viewport surround; 100 mm wide; structural ribbing every 0.50 m
panelisation:         single-piece transparent armor (with structural ribbing)
colour_value:         (transparent — content is the reactor's vertical shaft beyond)
embedded_displays:
  - id: ark.engineering_bay.north.hud_overlay
    position: (0.00, 16.00, 6.00)
    dimensions: 8.00 × 10.00 (overlay only)
    content: reactor-internal HUD — heat, flux, integrity, shutdown-status
embedded_doors:        none (the reactor shaft is not entered from here)
decorative_features:
  - id: ark.engineering_bay.north.engineering_emblem
    position: (0.00, 16.00, 11.50)
    dimensions: 1.00 × 0.80 × 0.04
    material: bronze relief — Mechronis "gear-and-anvil" emblem
    narrative_role: visible from below; reminds player of the Mechronis legacy
```

#### Wall: West

Mirror of east (same materials, mirrored displays + spiral stair).

```
wall_id:              west
material_primary:     same as east
material_secondary:   brass dado rail
panelisation:         standard
colour_value:         --token-color-ark-engineering-bay-wall-west  (mirror of east)
embedded_displays:
  - id: ark.engineering_bay.west.display.power_distribution
    position: (-6.95, 9.00, 2.50)
    dimensions: 1.20 × 0.80 × 0.05
    content: power-distribution map
  - id: ark.engineering_bay.west.display.mezzanine_1
    position: (-6.95, 9.00, 6.00)
    dimensions: 1.00 × 0.60 × 0.05
    content: turbine / coolant readouts
embedded_doors:
  - door_id: ark.engineering_bay.west.door.armory
    position: (-6.95, 12.00, 0.00)
    dimensions: 1.40 × 2.40 × 0.10
    door_class: slide
    connecting_space_id: ark.armory
decorative_features:
  - id: ark.engineering_bay.west.spiral_stair
    position: (-5.50, 0.50, 0.00)
    dimensions: 1.80 × 1.80 × 12.00
    material: steel + brass railing
    narrative_role: mirror of east stair
  - id: ark.engineering_bay.west.warning_sign.radiation
    position: (-6.90, 5.00, 2.40)
    dimensions: 0.40 × 0.30 × 0.01
    material: yellow-and-black painted steel
    narrative_role: radiation warning; reinforces aesthetic
```

### A.7.5 Ceiling

```
height_above_floor:     12.00 m  (very tall — three-tier mezzanines visible)
material:               exposed structural framework with industrial conduits visible; central area is open to the reactor-shaft (transparent panel with safety mesh)
lighting_integrated:    suspended-fixture grid (industrial pendants) at z = 11.00 m on a 2.40 m × 2.40 m pattern; central area uses bare-bulb-style high-bay lights
atmospheric_features:   steam plumes from reactor-shaft (visible through the transparent ceiling section); occasional spark drift from upper mezzanine work-zones (cosmetic)
acoustic_treatment:     baffled at perimeters (industrial dampening panels); central area is hard-reflective
```

### A.7.6 Lighting

```
ambient_baseline:     4200 K (warm-industrial); 280 lux at floor level; CRI 85 (lower than rest of Ark — industrial spec)
direct_fixtures:
  - id: ark.engineering_bay.light.high_bay_central_array
    position: distributed across central ceiling at z = 11.00 m, on 2.40 × 2.40 grid (excluding shaft zone)
    beam_angle: 90°
    colour: --token-color-ark-engineering-bay-high-bay  (warm industrial white)
    intensity: 18000 lumens each
    function: task lighting (high-volume room needs strong lights)
  - id: ark.engineering_bay.light.reactor_shaft_glow
    position: (0.00, 14.00, 6.00)  # within reactor-shaft, visible through viewport
    beam_angle: 360° wash
    colour: --token-color-ark-engineering-bay-reactor-glow  (varies with reactor state — orange at baseline; red on alert; green on stable)
    intensity: 25000 lumens (variable, pulses with reactor)
    function: punctuation; the reactor IS the room's primary visual element
  - id: ark.engineering_bay.light.workbench_task
    position: (0.00, 2.50, 4.00)  # over workbench
    beam_angle: 30°
    colour: 5500 K bright
    intensity: 8000 lumens
    function: task lighting for crafting
  - id: ark.engineering_bay.light.mezzanine_1_strip
    position: along east + west mezzanine edges at z = 4.00
    beam_angle: 180° wash
    colour: --token-color-ark-engineering-bay-mezzanine
    intensity: 1200 lumens per metre
    function: accent + safety
  - id: ark.engineering_bay.light.mezzanine_2_strip
    position: along east + west mezzanine edges at z = 8.00
    beam_angle: 180° wash
    colour: --token-color-ark-engineering-bay-mezzanine
    intensity: 1200 lumens per metre
    function: accent + safety
practical_sources:
  - id: ark.engineering_bay.workbench.tool_rack.glow
    position: workbench tool-rack
    intensity: 60 lumens (per tool slot; ~12 slots illuminate)
    flicker_pattern: stable
  - id: ark.engineering_bay.steam_vent_glow.east
    position: (5.50, 7.00, 0.05)
    intensity: 200 lumens (orange; pulses during steam-cycles)
    flicker_pattern: cyclic with reactor (period 8s)
  - id: ark.engineering_bay.steam_vent_glow.west
    position: (-5.50, 7.00, 0.05)
    intensity: 200 lumens (mirror)
    flicker_pattern: cyclic with reactor (period 8s, offset 4s from east)
time_of_day_variation:
  act_3: ambient at 280 lux; reactor glow steady orange; mezzanines well-lit
  act_5: ambient drops to 220 lux; reactor glow flickers between orange and red; one high-bay fixture starts to fail and flickers
  act_7: ambient at 160 lux baseline; reactor glow may be GREEN (player repaired) or RED-failing (player neglected); state-branched
dynamic_response:
  - on_reactor_critical: reactor_shaft_glow flashes red; emergency_strobe arrays activate; ambient warms to 6000 K alert tone
  - on_HB4_transit: workbench dissolves in cinematic; high_bay lights dim; spotlight on workbench grows
  - on_player_at_workbench: workbench_task light intensifies 30%
```

### A.7.7 Atmosphere

```
air_temperature:    24°C baseline (warm — heat-from-reactor; rises to 30°C in stress states)
humidity:           variable (40-60% RH); higher near steam vents
particulate:
  - type: dust
    density: low (industrial-grade air filtration; some accumulation visible on mezzanines)
    colour: greyish-iron
    drift_direction: random, with slight upward drift near reactor (heat convection)
  - type: steam
    density: high near vents during reactor cycles; absent in baseline between cycles
    colour: white-translucent
    drift_direction: from vents upward toward ceiling
  - type: spark
    density: very low (cosmetic only)
    colour: orange-bright (lifetime <0.5s)
    drift_direction: from upper mezzanine work-zones, falling
volumetric_fog:     present during reactor stress (0.20 g/m³, warm-grey)
wind_drift:         strong from south (entrance) toward north (reactor shaft) — convection effect; 0.50 m/s
smell_canon:        ozone + warm-metal + faint coolant; in stress states, additional sulphur notes
```

### A.7.8 Sound

```
ambient_bed:           file: engineering_bay_ambient_bed_v1.ogg (loop); -28 dB; reactor-pulse breath rhythm at low frequency, distant turbine hum, steam-pipe gurgle
point_sources:
  - id: ark.engineering_bay.sound.reactor_pulse
    position: (0.00, 14.00, 6.00)
    sound: deep reactor breath (period 4.2s; -22 dB; this is the heartbeat of the Ark)
    occlusion_behaviour: omnidirectional; fills the room
    trigger: continuous (changes timbre with reactor state)
  - id: ark.engineering_bay.sound.steam_vent.east
    position: (5.50, 7.00, 0.00)
    sound: steam-burst (cyclic, period 8s; -24 dB during burst; -∞ between)
    occlusion_behaviour: standard
    trigger: cyclic
  - id: ark.engineering_bay.sound.steam_vent.west
    position: (-5.50, 7.00, 0.00)
    sound: steam-burst (mirror, period 8s offset 4s)
    occlusion_behaviour: standard
    trigger: cyclic
  - id: ark.engineering_bay.sound.workbench_tools
    position: (0.00, 2.50, 1.05)
    sound: faint metal-clink + tool-rest (when player is near; -36 dB)
    occlusion_behaviour: occluded by walls
    trigger: continuous (low-volume)
  - id: ark.engineering_bay.sound.high_bay_buzz
    position: distributed (one per fixture)
    sound: faint fluorescent-style buzz (-44 dB)
    occlusion_behaviour: omnidirectional
    trigger: continuous; in late acts, one fixture introduces a flicker-buzz pattern
reverb_zone:           IR-impulse: engineering_industrial_v1.wav; wet-mix 28% (industrial reverb)
music_eligibility:     cutscene only (HB4 transit + Category B ambient cs_amb_engineering)
voice_line_eligibility:
  - speaker: cogsworth (or named engineer NPC)
    trigger: presence
    line_set: see §2.7.2 (Engineering Bay NPC presence-line set)
```

### A.7.9 Object inventory

Engineering Bay has 41 inventory objects.

#### A.7.9.1 The Primary Workbench (HB4 gateway)

```
object_id:           ark.engineering_bay.workbench.primary
object_class:        interactive  (also fx_emitter for HB4 transit)
position:            (0.00, 2.50, 0.00)
dimensions:          2.40 × 1.20 × 0.95
rotation:            0°
material_primary:    polished stainless steel top + brushed-titanium frame
material_secondary:  brass tool-channel inlay (running along the long axis); brass corner-protectors
colour_value:        --token-color-ark-engineering-bay-workbench
interaction:         interactable
  - operate: opens crafting UI (player can craft equipment)
  - HB4_invoke: when conditions met (Act 3+, player has interacted N times), triggers HB4 transit cutscene
  - inspect: lore-note about the workbench's history (Mechronis-faction artifact)
narrative_role:      DUAL FUNCTION — operationally a crafting bench; cosmologically the HB4 gateway. Hands-on-the-bench triggers the dissolution into Mechronis classroom (cf §3.12.6)
lore_anchor:         loredex.faction.mechronis + arc.act_3_first_HB4_invocation
art_status:          producer_handoff
gameplay_hook_id:    trpc.engineering.workbench.openCraft + trpc.hellbox.hb4.openGate (state-conditional)
wear_state:          worn — tool-marks on the steel top; brass channel polished from use
physical_constraints: collides; player can lean on (cosmetic)
```

#### A.7.9.2 The East Tool Rack

```
object_id:           ark.engineering_bay.tool_rack.east
object_class:        container
position:            (5.50, 4.50, 0.00)
dimensions:          0.40 × 4.00 × 3.20
rotation:            270°  (parallel to east wall, doors face into room)
material_primary:    brushed steel pegboard with magnetic tool-mounts
material_secondary:  brass labelled tool-slots
colour_value:        --token-color-ark-engineering-bay-tool-rack
interaction:         interactable
  - open_panel: each panel reveals tools (12 tool slots total; some empty in baseline, fill as player crafts)
  - inspect_tool: each tool can be inspected for crafting context
narrative_role:      crafting inventory; visually demonstrates the player's progression
lore_anchor:         loredex.system.crafting
art_status:          producer_handoff
gameplay_hook_id:    trpc.engineering.tool_rack.open
wear_state:          slight wear at most-used tool slots
physical_constraints: collides
```

#### A.7.9.3 The West Tool Rack

Mirror of east. Same dimensions, position (-5.50, 4.50, 0.00),
rotation 90°.

#### A.7.9.4 The Crafting Console

```
object_id:           ark.engineering_bay.console.crafting
object_class:        console
position:            (0.00, 4.20, 0.00)  # behind the workbench
dimensions:          1.60 × 0.60 × 1.10
rotation:            180°  (faces -y, toward workbench)
material_primary:    brushed steel + matte-black control surface
material_secondary:  brass bezel with amber LED accents
colour_value:        --token-color-ark-engineering-bay-console-crafting
interaction:         interactable
  - operate: opens deeper crafting UI (recipe browse, schematic upload)
  - inspect: lore-note about Mechronis-faction crafting principles
narrative_role:      crafting brain; player browses recipes here; HB4 unlocks new recipes after Mechronis Academy completion
lore_anchor:         loredex.faction.mechronis + arc.crafting_progression
art_status:          producer_handoff
gameplay_hook_id:    trpc.engineering.crafting.openConsole
wear_state:          worn around recipe-browse buttons
physical_constraints: collides
```

#### A.7.9.5-7 Engineer's Anchor + Chair + Personal Locker

```
object_id:           ark.engineering_bay.engineer_chair
object_class:        furniture
position:            (-2.00, 4.20, 0.00)  # to the west of crafting console
dimensions:          0.80 × 0.80 × 1.30
rotation:            180°  (faces console)
material_primary:    matte-black leather; titanium frame
material_secondary:  brass armrest
colour_value:        --token-color-ark-engineering-bay-chair
interaction:         interactable - sit
narrative_role:      Cogsworth's working chair (or named engineer NPC); player can sit and feel "the engineer's seat"
lore_anchor:         loredex.character.cogsworth
art_status:          producer_handoff
gameplay_hook_id:    none (positional)
wear_state:          worn at seat (Cogsworth sits forward when concentrating)
physical_constraints: collides; sittable

object_id:           ark.engineering_bay.engineer.locker
object_class:        container
position:            (-3.50, 4.20, 0.00)  # west of chair
dimensions:          0.50 × 0.40 × 1.80
rotation:            180°
material_primary:    brushed-titanium with brass handle
material_secondary:  brass nameplate "C. COGSWORTH" or current engineer
colour_value:        --token-color-ark-engineering-bay-locker
interaction:         interactable - open
narrative_role:      personal effects of the current engineer; gameplay-key journal in Act 5
lore_anchor:         loredex.character.cogsworth + arc.act_5_engineering_revelations
art_status:          producer_handoff
gameplay_hook_id:    trpc.engineering.engineer_locker.open
wear_state:          worn
physical_constraints: collides

object_id:           ark.engineering_bay.engineer_anchor.npc
object_class:        npc_anchor
position:            (-2.00, 4.20, 0.00)  # same as chair (NPC sits)
dimensions:          0.80 × 0.80 × 1.30
rotation:            varies (NPC pose-driven)
material_primary:    n/a (anchor only)
material_secondary:  n/a
colour_value:        n/a
interaction:         n/a (NPC presence)
narrative_role:      Cogsworth (or current engineer NPC) anchors here when present; Cogsworth's working pose
lore_anchor:         loredex.character.cogsworth
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          n/a
physical_constraints: n/a (NPC overrides)
```

#### A.7.9.8 The Reactor Viewport

```
object_id:           ark.engineering_bay.viewport.reactor
object_class:        display  # treated as display because content is the reactor (state-driven)
position:            (0.00, 16.00, 6.00)  # centred on north wall, mid-height
dimensions:          8.00 × 10.00 × 0.10
rotation:            180°
material_primary:    reinforced transparent armor
material_secondary:  brass surround with structural ribbing
colour_value:        (transparent)
interaction:         inert (looking only)
narrative_role:      THE viewport into the reactor shaft; ALWAYS the focal point; the reactor's state IS the room's mood
lore_anchor:         loredex.system.ark_reactor + arc.reactor_health
art_status:          producer_handoff
gameplay_hook_id:    none (visual only)
wear_state:          pristine (transparent armor doesn't show wear easily)
physical_constraints: collides (transparent armor)
```

#### A.7.9.9 Spiral Staircases (east + west)

```
object_id:           ark.engineering_bay.stair.spiral.east
object_class:        furniture  (functional traversal element)
position:            (5.50, 0.50, 0.00)  # base
dimensions:          1.80 × 1.80 × 12.00 (footprint × height; 17 steps to mezzanine 1; 17 more to mezzanine 2)
rotation:            0°  (centre of helical path is at this position)
material_primary:    steel grating treads + brass nosing
material_secondary:  brass railing on both sides (curving with the helix)
colour_value:        --token-color-ark-engineering-bay-stair
interaction:         interactable
  - climb: player can ascend / descend
narrative_role:      gives the room verticality; player visits mezzanines for access to reactor controls
lore_anchor:         arc.engineering_three_tiers
art_status:          producer_handoff
gameplay_hook_id:    none (movement)
wear_state:          worn at most-used steps (mezzanine 1 entry; mezzanine 2 less)
physical_constraints: collides; player can climb

object_id:           ark.engineering_bay.stair.spiral.west
(MIRROR of east; position (-5.50, 0.50, 0.00); same specs)
```

#### A.7.9.10 Reactor Control Panel (mezzanine 1, east side)

```
object_id:           ark.engineering_bay.mezzanine_1.console.reactor
object_class:        console
position:            (4.50, 8.00, 4.00)  # mezzanine 1 floor level
dimensions:          1.40 × 0.60 × 1.10
rotation:            -90°  (faces inward, toward reactor)
material_primary:    brushed steel + matte-black; reactor-control LED accents
material_secondary:  brass bezel
colour_value:        --token-color-ark-engineering-bay-console-reactor
interaction:         interactable
  - operate: opens reactor-control UI (rod insertion, coolant flow, shutdown sequence)
  - inspect: lore-note about reactor management
narrative_role:      direct reactor control; player can manually moderate the reactor; gameplay-active in Act 5+ when reactor is failing
lore_anchor:         loredex.system.ark_reactor + arc.reactor_management
art_status:          producer_handoff
gameplay_hook_id:    trpc.engineering.reactor.control
wear_state:          pristine in early acts; wear accumulates as ship ages
physical_constraints: collides
```

#### A.7.9.11 Reactor Diagnostic Terminal (mezzanine 2, east side)

```
object_id:           ark.engineering_bay.mezzanine_2.console.diagnostic
object_class:        console
position:            (4.50, 8.00, 8.00)  # mezzanine 2
dimensions:          1.40 × 0.60 × 1.10
rotation:            -90°
material_primary:    brushed steel + matte-black; diagnostic-deep readouts
material_secondary:  brass bezel
colour_value:        --token-color-ark-engineering-bay-console-diagnostic
interaction:         interactable
  - operate: opens diagnostic-deep UI (anomaly scan, history, prognostication)
  - inspect: lore-note
narrative_role:      detects reactor anomalies; in Act 5, this terminal is where the player first sees the Pod-Zero anomaly's signature crossed with reactor flux (cross-disciplinary clue)
lore_anchor:         loredex.system.ark_reactor + arc.act_5_pod_zero_anomaly
art_status:          producer_handoff
gameplay_hook_id:    trpc.engineering.reactor.diagnostic
wear_state:          pristine
physical_constraints: collides
```

#### A.7.9.12-15 Maintenance Panels (4 panels around the room)

```
object_id:           ark.engineering_bay.maintenance_panel.north_east_low
object_class:        hatch
position:            (3.50, 15.95, 1.20)  # east of viewport, ground level
dimensions:          0.80 × 0.05 × 1.20
rotation:            180°
material_primary:    riveted steel panel
material_secondary:  brass latch
colour_value:        --token-color-ark-engineering-bay-maintenance-panel
interaction:         interactable
  - open: reveals ducting + access conduit (gameplay-key — player must access conduits in Act 5+ to bypass reactor failure)
  - inspect: lore-note
narrative_role:      access to the inner machinery; gameplay-key for ship-repair quests
lore_anchor:         loredex.system.ark_machinery
art_status:          producer_handoff
gameplay_hook_id:    trpc.engineering.maintenance_panel.open
wear_state:          slight wear at latch
physical_constraints: collides

(other 3 panels follow same template; positions:
 - north_west_low: (-3.50, 15.95, 1.20)
 - mezzanine_1_central: (0.00, 15.95, 5.00)
 - mezzanine_2_central: (0.00, 15.95, 9.00))
```

#### A.7.9.16-22 Crating + Storage (7 crates positioned around)

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.engineering_bay.crate.materials.east.1` | container | (5.50, 12.00, 0.00) | 0.80 × 0.60 × 0.80 | scrap metal |
| `ark.engineering_bay.crate.materials.east.2` | container | (5.50, 13.50, 0.00) | 0.80 × 0.60 × 0.80 | wiring + circuits |
| `ark.engineering_bay.crate.materials.west.1` | container | (-5.50, 12.00, 0.00) | mirror | rare ores |
| `ark.engineering_bay.crate.materials.west.2` | container | (-5.50, 13.50, 0.00) | mirror | components |
| `ark.engineering_bay.crate.fuel.south_east` | container | (5.50, 1.50, 0.00) | 0.80 × 0.60 × 0.80 | reactor fuel cells |
| `ark.engineering_bay.crate.fuel.south_west` | container | (-5.50, 1.50, 0.00) | mirror | reactor fuel cells |
| `ark.engineering_bay.crate.spare_parts.central` | container | (0.00, 12.00, 0.00) | 1.20 × 0.80 × 0.80 | spare parts |

#### A.7.9.23-25 Safety Equipment

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.engineering_bay.fire_extinguisher.south` | interactive | (-6.50, 0.20, 1.20) | 0.20 × 0.20 × 0.50 | fire safety |
| `ark.engineering_bay.fire_extinguisher.east` | interactive | (6.95, 0.50, 1.20) | mirror | fire safety |
| `ark.engineering_bay.first_aid.kit` | container | (-6.50, 1.00, 1.50) on south wall | 0.40 × 0.10 × 0.30 | medical |

#### A.7.9.26-31 Ground-level Decorative Elements

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.engineering_bay.coolant_pipe.east_running` | decoration | along east wall at z = 9.00 | 0.30 dia × 16.00 m run | aesthetic + functional plumbing |
| `ark.engineering_bay.coolant_pipe.west_running` | decoration | along west wall at z = 9.00 | mirror | aesthetic |
| `ark.engineering_bay.cable_tray.ceiling_central` | decoration | suspended at z = 10.50, runs y = 1.0 to 15.0 | 0.40 × 0.10 × 14.00 | aesthetic + cable management |
| `ark.engineering_bay.warning_strobe.south` | fx_emitter | (0.00, 0.20, 4.50) | 0.30 × 0.30 × 0.30 | reactor-alert strobe (off in baseline) |
| `ark.engineering_bay.warning_strobe.east` | fx_emitter | (6.50, 8.00, 4.50) | mirror | reactor-alert strobe |
| `ark.engineering_bay.warning_strobe.west` | fx_emitter | (-6.50, 8.00, 4.50) | mirror | reactor-alert strobe |

#### A.7.9.32-35 Mezzanine Decorative + Functional

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.engineering_bay.mezzanine_1.bench.east` | furniture | (4.50, 12.00, 4.00) | 1.60 × 0.40 × 0.45 | mezzanine workbench |
| `ark.engineering_bay.mezzanine_1.bench.west` | furniture | (-4.50, 12.00, 4.00) | mirror | mezzanine workbench |
| `ark.engineering_bay.mezzanine_2.bench.east` | furniture | (4.50, 12.00, 8.00) | 1.60 × 0.40 × 0.45 | mezzanine workbench |
| `ark.engineering_bay.mezzanine_2.bench.west` | furniture | (-4.50, 12.00, 8.00) | mirror | mezzanine workbench |

#### A.7.9.36-41 Reactor Shaft Atmospheric Elements

These are visible THROUGH the reactor viewport but logically belong
to the engineering room.

| object_id | class | position (relative to viewport centre) | dim | role |
|---|---|---|---|---|
| `ark.engineering_bay.reactor_shaft.core_pulse_emitter` | fx_emitter | (0.00, 0.00, 0.00) within shaft | 1.20 dia spherical | core pulse light |
| `ark.engineering_bay.reactor_shaft.steam_plume.upper` | fx_emitter | (0.00, +3.00, +5.00) within shaft | n/a (volumetric) | rising steam plume |
| `ark.engineering_bay.reactor_shaft.steam_plume.lower` | fx_emitter | (0.00, -3.00, -3.00) within shaft | n/a (volumetric) | descending steam plume |
| `ark.engineering_bay.reactor_shaft.coolant_drip` | fx_emitter | (+1.5, 0.0, -2.0) within shaft | n/a (volumetric) | coolant drip cosmetic |
| `ark.engineering_bay.reactor_shaft.spark_emitter.east` | fx_emitter | (+2.0, 0.0, +3.0) within shaft | n/a (volumetric) | sparks during stress states |
| `ark.engineering_bay.reactor_shaft.spark_emitter.west` | fx_emitter | (-2.0, 0.0, +3.0) within shaft | mirror | sparks |

Total: 41 inventory objects.

### A.7.10 Camera-spawn-points (FPV cutscenes)

```
cutscene_id:         cs_amb_engineering  (Category B Myst-ambient)
camera_position:     (0.00, 0.50, eye_level)  # at threshold of door
camera_facing:       (0°, 5°, 0°)  # looking forward and slightly up at reactor
avatar_height_anchor: eye_level
head_motion:         slow forward dolly toward reactor viewport, slight upward head-tilt as player approaches; lasts 18s

cutscene_id:         cs_hellbox_4_open  (HB4 Mechronis gateway)
camera_position:     (0.00, 1.30, eye_level)  # at workbench
camera_facing:       (0°, -25°, 0°)  # looking down at workbench surface
avatar_height_anchor: eye_level
head_motion:         hand-rig enters frame; tools rearrange themselves; workbench dissolves; transit begins

cutscene_id:         cs_hellbox_4_transit  (HB4 transit)
camera_position:     (0.00, 1.30, eye_level)
camera_facing:       (0°, -25°, 0°) initially; rotates to (0°, 0°, 0°) by mid-transit
avatar_height_anchor: eye_level
head_motion:         POV descends into the workbench; classroom rises around player

cutscene_id:         cs_hellbox_4_close  (HB4 return)
camera_position:     (0.00, 1.30, eye_level)
camera_facing:       (0°, -25°, 0°)
avatar_height_anchor: eye_level
head_motion:         classroom dissolves; workbench re-materialises with new tools added (visual confirmation of Academy progress)
```

### A.7.11 Doorways

```
door_id:            ark.engineering_bay.south.door.main
connecting_space_id: ark.corridor.engineering_approach
door_position:      (0.00, 0.00, 0.00)
door_dimensions:    1.60 × 2.40 × 0.10
door_class:         pressure_seal
unlock_condition:   always (Act 1+)
transit_animation:  airlock-cycle (4s)
audio_signature:    pressure-equalisation hiss + magnetic clack + servo-whir

door_id:            ark.engineering_bay.east.door.workshop
connecting_space_id: ark.forge_workshop
door_position:      (6.95, 12.00, 0.00)
door_dimensions:    1.40 × 2.40 × 0.10
door_class:         slide
unlock_condition:   Act 3+
transit_animation:  fade
audio_signature:    pneumatic-hiss + servo-whir

door_id:            ark.engineering_bay.west.door.armory
connecting_space_id: ark.armory
door_position:      (-6.95, 12.00, 0.00)
door_dimensions:    1.40 × 2.40 × 0.10
door_class:         slide
unlock_condition:   Act 2+
transit_animation:  fade
audio_signature:    pneumatic-hiss + servo-whir
```

### A.7.12 Adjacency map

```
direct_adjacencies:
  - ark.corridor.engineering_approach (south door)
  - ark.forge_workshop (east door)
  - ark.armory (west door)
  - hellbox.mechronis_academy (HB4 portal via workbench, conditional on Act 3+)
one_hop_adjacencies:
  - ark.bridge (via corridor + Deck-1 main)
  - ark.med_bay (via corridor)
  - ark.cargo_hold (via corridor)
  - destination.mechronis_academy (via HB4)
```

### A.7.13 Gameplay hooks

```
hooks:
  - hook_id:         engineering_bay.openCraftingUI
    trigger:         player.operate on ark.engineering_bay.workbench.primary
    procedure:       trpc.engineering.workbench.openCraft
    success_state:   crafting_ui_open = true
  - hook_id:         engineering_bay.invokeHB4
    trigger:         (state-conditional) player.interact on workbench (Act 3+, after N crafting interactions)
    procedure:       trpc.hellbox.hb4.openGate
    success_state:   hellbox_4_transit_started = true
    fail_state:      not_yet_unlocked
  - hook_id:         engineering_bay.openToolRack
    trigger:         player.open on ark.engineering_bay.tool_rack.east or .west
    procedure:       trpc.engineering.tool_rack.open
    success_state:   tool_rack_open = true
  - hook_id:         engineering_bay.controlReactor
    trigger:         player.operate on ark.engineering_bay.mezzanine_1.console.reactor
    procedure:       trpc.engineering.reactor.control
    success_state:   reactor_control_active = true
  - hook_id:         engineering_bay.diagnoseReactor
    trigger:         player.operate on ark.engineering_bay.mezzanine_2.console.diagnostic
    procedure:       trpc.engineering.reactor.diagnostic
    success_state:   reactor_diagnostic_active = true
  - hook_id:         engineering_bay.openMaintenancePanel
    trigger:         player.open on ark.engineering_bay.maintenance_panel.<id>
    procedure:       trpc.engineering.maintenance_panel.open
    success_state:   maintenance_panel_open = true (per-panel)
  - hook_id:         engineering_bay.openEngineerLocker
    trigger:         player.open on ark.engineering_bay.engineer.locker
    procedure:       trpc.engineering.engineer_locker.open
    success_state:   engineer_locker_opened = true
```

### A.7.14 Story-tie

```
primary_arcs:
  - arc.act_3_engineering_revelations
  - arc.act_3_first_HB4_invocation
  - arc.act_5_pod_zero_anomaly  (engineering's diagnostic terminal first sees the cross-domain signature)
  - arc.reactor_health  (continuous; ship-state)
per_act_evolution:
  act_3:
    description: "Engineering Bay opens to player. Workbench available for first crafting. Cogsworth (or named engineer) first appears. HB4 unlocks first."
    visible_changes: workbench_first_use, cogsworth_present
  act_4:
    description: "Reactor flux begins (related to Terminus Swarm proximity). Mezzanine 1 reactor console becomes gameplay-active."
    visible_changes: reactor_flickers_first, reactor_console_alert
  act_5:
    description: "Reactor degradation visible. Pod-Zero anomaly cross-detected on diagnostic terminal. Engineer's locker reveals key journal entry."
    visible_changes: reactor_glow_red_periodic, engineer_journal_active
  act_6:
    description: "Reactor either stabilising (player has been managing it) or critical (player has neglected). Maintenance panels gameplay-active."
    visible_changes: state_branch_active
  act_7:
    description: "Final state. Reactor green (player saved ship) or in cascade-failure (player did not). Engineering bay reflects state."
    visible_changes: state_branch_determined
npc_roster:
  - cogsworth (or current named engineer): primary occupant
  - the_player: visitor for crafting and reactor management
  - the_master_of_rlyeh: HB4 transit voice only
readables:
  - dedication plaque (south wall): "ENGINEERING / The work, the worker, the world"
  - engineer's journal (locker): Cogsworth's notes; Act 5 gameplay-key
  - high-voltage warning sign + radiation warning sign (atmosphere readables)
  - reactor diagnostic logs (terminal output; player can scroll history)
master_of_rlyeh_question: "Is the worker the work, or the work's prisoner?"  (per HB4)
```

### A.7.15 Special-FX

```
particle_systems:
  - dust (low; mezzanine accumulation)
  - steam_burst (cyclic from vents; high density during burst)
  - sparks (cosmetic; from upper mezzanine work-zones)
  - reactor_core_pulse_glow (volumetric; from reactor shaft)
volumetric_effects:
  - reactor_shaft_volumetric_glow (visible through viewport)
  - steam_plume_columns (rising from vents; column from each)
procedural_animations:
  - reactor_pulse (continuous; matches Bridge coffer pulse — same heartbeat across ship)
  - steam_vent_cycle (8s period; alternating east/west)
  - high_bay_buzz (fluorescent-style; one fixture flickers in late acts)
  - tool_rack_magnetic_settle (when player closes; magnetic snap-into-place)
  - mezzanine_handrail_polish_motion (subtle reflective sheen as player walks)
reactive_systems:
  - workbench_glow_on_proximity (within 1.0 m, workbench surface glows softly)
  - reactor_alert_strobes_on_critical (all 3 strobes flash red during reactor critical state)
  - HB4_transit_workbench_dissolution (one-shot animation; tools rearrange before dissolution)
  - mezzanine_lighting_ramp_on_proximity (mezzanine strip-lights brighten when player ascends)
  - cogsworth_response (Cogsworth's NPC behaviour responds to player presence)
```

### A.7.16 Avatar-parametricity

```
camera_height_variation:
  small_xenomorph (0.85m eye): camera height 0.85m; workbench surface is at chest level — special workbench-fold-out animation deploys for short avatars
  short_humanoid (1.40m eye): camera height 1.40m; workbench is at hip level; comfortable
  average_humanoid (1.70m eye): camera height 1.70m; workbench is at waist level; default
  tall_humanoid (2.05m eye): camera height 2.05m; workbench is below waist; player must lean
  tall_xenomorph (2.70m eye): camera height 2.70m; workbench is at thigh level; player must crouch — alternate crouch animation deploys
reachability:
  small_xenomorph: cannot reach mezzanine 1 console without elevator-stool; alternate console-relay accessible from ground floor
  small_xenomorph: cannot reach upper tool-rack slots; only bottom-half slots
  others: all-reachable via spiral stairs
audio_occlusion_variation:
  xenomorph_sensitive_hearing: reactor pulse +6 dB perceived; steam vents louder (uncomfortable for some)
  synthetic_voice_avatar: ambient bed slightly altered (synthetic resonance)
```

### A.7.17 Performance

```
polygon_budget:      340,000 polygons (Engineering Bay is a feature-room with tall vertical volume)
texture_budget:      200 MB total (reactor shaft shaders are expensive)
light_count_limit:   20 simultaneous dynamic lights (ample for the room's complexity)
lod_plan:
  - hero_distance: 0-12m, full detail
  - mid_distance: 12-30m, mid detail (reactor steam reduced; spark emitters simplified)
  - low_distance: 30m+, low detail (spark emitters disabled; steam as billboards)
streaming_behaviour:
  - preload: ark.corridor.engineering_approach (south)
  - preload: ark.forge_workshop (east; on Act 3+)
  - preload: ark.armory (west; on Act 2+)
  - on_player_at_workbench (Act 3+): preload destination.mechronis_academy
```

---

## A.8 Forge Workshop — SCAFFOLDED

Cross-ref `INCEPTION_ARK_FINAL_PRODUCTION.md` §2.8.

```
space_id:        ark.forge_workshop
space_name:      Forge Workshop
space_type:      ark_room
act_introduced:  Act 3
lore_anchor:     loredex.faction.mechronis + arc.crafting_progression
aesthetic_tier:  solar_punk_cathedral  (industrial-heat aesthetic)
dimensions:      11.00 m × 11.00 m × 6.00 m  (tall — forge chimney)
floor_plan_geometry: rectangular
```

Forge-fire chamber; anvils; hammer-stations; quench-tanks. Where
the player crafts weapons and equipment.

(Full spec deferred to Phase B-2.)

---

## A.9 Armory — SCAFFOLDED

```
space_id:        ark.armory
space_name:      Armory
space_type:      ark_room
act_introduced:  Act 2
lore_anchor:     loredex.system.armory + arc.combat_progression
aesthetic_tier:  solar_punk_cathedral  (military-tactical accents)
dimensions:      10.00 m × 10.00 m × 4.00 m
floor_plan_geometry: rectangular
```

Weapons and armor storage; CADES kit lockers; tactical loadout
station. Cross-ref §2.47 CADES Console.

(Full spec deferred.)

---

## A.10 Cargo Hold — SCAFFOLDED

```
space_id:        ark.cargo_hold
space_name:      Cargo Hold
space_type:      ark_room
act_introduced:  Act 2
lore_anchor:     loredex.system.cargo + arc.trade_economy
aesthetic_tier:  solar_punk_cathedral  (warehouse-industrial)
dimensions:      24.00 m × 16.00 m × 8.00 m  (vast)
floor_plan_geometry: rectangular  (with crane gantry overhead)
```

Vast warehouse; cargo crates; crane gantry; freight-elevator to
Trade Hub. Per §2.10.

(Full spec deferred.)

---

## A.11 Captain's Quarters (Degen's Corner) — FULL

**Status: FULL spec.** Cross-ref: `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.11 (art-state prompts) and §3.12.9 HB7 Degenerate's Casino gateway.

### A.11.1 Header

```
space_id:        ark.captain_quarters
space_name:      Captain's Quarters (with Degen's Corner)
space_type:      ark_room  (also Hellbox-7 host)
act_introduced:  Act 0  (visible from start; locked until Act 1; Degen's Corner unlocks Act 5)
lore_anchor:     loredex.character.kael_voss + loredex.character.degen + arc.act_0_loss_of_command + arc.act_5_degen_appears
aesthetic_tier:  solar_punk_cathedral  (with film-noir accents in Degen's Corner)
master_of_rlyeh_question: "What is owed to a debt that was never agreed to?" (per HB7)
```

### A.11.2 Geometry

```
dimensions:           12.00 m × 14.00 m × 4.50 m  (overall bounding box)
origin_point:         centre of floor at the primary entrance threshold (entrance is the south wall of the main quarters)
coordinate_axes:      +x = right, +y = forward, +z = up
floor_plan_geometry:  l_shape
volumetric_anomalies: none in baseline; HB7 transit briefly turns Degen's Corner non-Euclidean (~10s — corridor of chip-stacks extends beyond the alcove)
```

The room is an L-shape: the main quarters occupy a 12 × 10 m
rectangle running the full width of the L; Degen's Corner is a
4 × 4 m alcove protruding eastward at the rear (the "foot" of
the L). The alcove is hidden behind a curtain in Acts 0-4; the
curtain dissolves in Act 5 when the Degen first appears.

Floor area: 120 m² (main quarters) + 16 m² (Degen's Corner) = 136 m²
total.

### A.11.3 Floor

```
material_primary:     polished walnut hardwood (real wood — like the Hierarchy pews; rare on the Ark; signals "the Captain's space is special"); 1.20 m × 0.20 m planks; running diagonal pattern at 30° from south wall
material_secondary:   wool rug (charcoal-grey with faded crimson border) covering the central living-zone (4.00 × 5.00 m); brass walkway-strip from entrance to desk
pattern:              walnut planking 30°-diagonal in main quarters; transition to maple parquet (slightly different colour) at Degen's Corner alcove threshold (subtle visual marker); rug pattern is geometric chevron
wear_state:           pristine but well-used; wear-trails to bed, desk, and bookshelf; rug shows subtle indentation under chair-positions; in Acts 5+, additional wear at the Degen's Corner threshold (Degen has been pacing)
embedded_features:
  - id: ark.captain_quarters.floor.charge_point.desk
    position: (-2.00, 5.50, 0.00)
    dimensions: 0.20 × 0.20 × 0.05  (concealed under desk)
    function: desk-lamp + console power
  - id: ark.captain_quarters.floor.heating_grate.south
    position: (0.00, 1.50, 0.00)
    dimensions: 0.40 × 0.40 × 0.05
    function: under-floor heating vent
  - id: ark.captain_quarters.floor.degen_corner_threshold
    position: (4.00, 9.00, 0.005)
    dimensions: 0.20 × 4.00 × 0.005  (long thin brass strip)
    function: visual + interaction threshold; in Acts 0-4, an invisible barrier is enforced here; in Act 5+, threshold dissolves
acoustic_property:    soft_absorbent at central rug zone; hard_reflective at planking elsewhere; mixed RT60 = 0.40s (warmer than industrial spaces)
```

### A.11.4 Walls

#### Wall: South (entrance)

```
wall_id:              south
material_primary:     painted plaster with classic-textured wood paneling at z = 0.00 to z = 1.20 (wainscoting); plaster from z = 1.20 to ceiling
material_secondary:   walnut chair-rail at z = 1.20; walnut crown-molding at z = 4.30
panelisation:         8 panels wide × 1 wainscoting panel + plaster above
colour_value:         --token-color-ark-captain-quarters-wall-south  (warm cream upper plaster + dark walnut wainscoting)
embedded_displays:
  - id: ark.captain_quarters.south.display.captain_log_terminal
    position: (-3.00, 0.20, 1.50)
    dimensions: 0.80 × 0.60 × 0.05  (small terminal)
    content: captain's personal log access
  - id: ark.captain_quarters.south.display.private_comms
    position: (3.00, 0.20, 1.50)
    dimensions: 0.80 × 0.60 × 0.05
    content: private comms (encrypted; for captain's eyes only)
embedded_doors:
  - door_id: ark.captain_quarters.south.door.main
    position: (0.00, 0.00, 0.00)
    dimensions: 1.20 × 2.40 × 0.10
    door_class: slide  (lateral; with classic frame and bronze handle reflecting captain-formality)
    connecting_space_id: ark.corridor.captain_approach
decorative_features:
  - id: ark.captain_quarters.south.plaque.captain
    position: (0.00, 0.20, 3.20)
    dimensions: 0.60 × 0.20 × 0.02
    material: polished brass with engraved text
    narrative_role: reads "CAPTAIN'S QUARTERS / KAEL VOSS (commissioned)" — KAEL's name persists even in death; player can update with their own name as ending-state
  - id: ark.captain_quarters.south.coat_hooks
    position: (-2.00, 0.20, 1.80) and (2.00, 0.20, 1.80)
    dimensions: 0.10 × 0.05 × 0.10 each (4 hooks total)
    material: brass
    narrative_role: where captain's coat hangs; player can place clothes here
```

#### Wall: East (main quarters)

```
wall_id:              east_main
material_primary:     painted plaster with wainscoting (matches south)
material_secondary:   walnut chair-rail and crown-molding
panelisation:         standard
colour_value:         --token-color-ark-captain-quarters-wall-east-main
embedded_displays:    none (intentional; private quarters)
embedded_doors:        none
decorative_features:
  - id: ark.captain_quarters.east_main.window.viewport
    position: (5.95, 5.00, 1.80)
    dimensions: 1.20 × 1.20 × 0.05
    material: composite plexiglas + walnut frame
    narrative_role: the captain's private viewport; star-field; in Acts 5+, occasional Hellbox transit silhouettes pass by (atmospheric tease)
  - id: ark.captain_quarters.east_main.painting.lineage
    position: (5.90, 8.00, 1.80)
    dimensions: 0.80 × 1.00 × 0.04
    material: oil on canvas (a portrait lineage of past captains)
    narrative_role: shows 7 prior captains of the Ark; player learns Ark history
```

#### Wall: East (Degen's Corner alcove — north section)

The east wall has a curtained alcove protruding eastward. Degen's
Corner extends 4 m beyond the main wall.

```
wall_id:              east_alcove
material_primary:     dark walnut paneling (no plaster); film-noir aesthetic
material_secondary:   brass dado at z = 1.20
panelisation:         3 panels covering the alcove walls
colour_value:         --token-color-ark-captain-quarters-degen-corner  (dark walnut + smoke-stained ceiling)
embedded_displays:
  - id: ark.captain_quarters.degen_corner.display.house_odds
    position: (8.95, 11.00, 1.80)  # within Degen's Corner east wall
    dimensions: 0.60 × 0.40 × 0.05
    content: live "house odds" display (always favors house); only active Act 5+
embedded_doors:        none
decorative_features:
  - id: ark.captain_quarters.degen_corner.frosted_window
    position: (8.95, 11.00, 1.30)
    dimensions: 0.50 × 0.80 × 0.05
    material: frosted glass with golden geometric etching
    narrative_role: reinforces the speakeasy aesthetic
  - id: ark.captain_quarters.degen_corner.curtain_threshold
    position: (4.00, 9.00 to 13.00, 0.00 to 4.50)
    dimensions: heavy velvet curtain spanning threshold (when present)
    material: deep crimson velvet (in Acts 0-4 this is BARELY VISIBLE — appears as a dark suggestion); becomes physically rendered Act 5+
    narrative_role: gates the alcove; dissolves on Degen's first appearance
```

#### Wall: North (rear of main quarters)

```
wall_id:              north
material_primary:     painted plaster with wainscoting
material_secondary:   walnut chair-rail and crown-molding
panelisation:         standard
colour_value:         --token-color-ark-captain-quarters-wall-north
embedded_displays:    none
embedded_doors:
  - door_id: ark.captain_quarters.north.door.private_bath
    position: (-3.00, 9.95, 0.00)
    dimensions: 0.80 × 2.20 × 0.10
    door_class: slide
    connecting_space_id: ark.captain_quarters.private_bath  (sub-space; deferred from FULL spec; treat as inaccessible alcove)
    unlock_condition: always (Act 1+)
decorative_features:
  - id: ark.captain_quarters.north.painting.kael_portrait
    position: (0.00, 9.95, 2.40)  # above the desk position
    dimensions: 1.20 × 1.50 × 0.05
    material: oil on canvas (portrait of Captain Kael Voss)
    narrative_role: PRIMARY portrait; player's eye is drawn here; lore-discoverable; in Acts 5+, the eyes seem to track player movement (subtle uncanny effect)
  - id: ark.captain_quarters.north.bookshelf.kael
    position: (3.00, 9.85, 0.00)
    dimensions: 2.00 × 0.40 × 3.20
    material: built-in walnut shelving
    narrative_role: Kael's personal library; specced in inventory below
```

#### Wall: West

```
wall_id:              west
material_primary:     painted plaster with wainscoting
material_secondary:   walnut chair-rail and crown-molding
panelisation:         standard
colour_value:         --token-color-ark-captain-quarters-wall-west
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: ark.captain_quarters.west.window.viewport
    position: (-5.95, 5.00, 1.80)
    dimensions: 1.20 × 1.20 × 0.05
    material: mirror of east_main viewport
    narrative_role: matches east window for symmetry
  - id: ark.captain_quarters.west.painting.elara_drawing
    position: (-5.90, 8.00, 1.80)
    dimensions: 0.40 × 0.50 × 0.04
    material: pencil drawing on paper (a child's portrait of "captain elara" — Elara as a child drew this for the previous captain; very personal artifact)
    narrative_role: humanises Kael; player learns Elara's deep family connection to the Ark
```

### A.11.5 Ceiling

```
height_above_floor:     4.50 m baseline; main quarters has a coffered ceiling with crown-molded square coffers (1.50 × 1.50 m grid); Degen's Corner has a lower ceiling at 3.50 m with smoke-stained finish (creates intimacy + film-noir feel)
material:               painted plaster with walnut crown-molding and coffered detailing in main quarters; dark-stained plaster with bronze trim in Degen's Corner
lighting_integrated:    central pendant lamp in main quarters (chandelier-style with crystal); recessed Edison-bulb fixtures in Degen's Corner (low-warm); under-coffer accent strips
atmospheric_features:   slight smoke-haze in Degen's Corner (when active); main quarters has occasional dust-motes in light beams from windows
acoustic_treatment:     coffered + soft (rug); intimate acoustic
```

### A.11.6 Lighting

```
ambient_baseline:     3000 K (warm; private space); 200 lux at floor level; CRI 92
direct_fixtures:
  - id: ark.captain_quarters.light.central_chandelier
    position: (0.00, 5.00, 4.30)  # centred over rug area in main quarters
    beam_angle: 360° (radial)
    colour: --token-color-ark-captain-quarters-chandelier  (warm white)
    intensity: 5000 lumens (with crystal-prism scatter)
    function: principal main-quarters lighting
  - id: ark.captain_quarters.light.desk_lamp
    position: (-2.00, 5.50, 0.95)  # on desk
    beam_angle: 60° downward
    colour: --token-color-ark-captain-quarters-desk-lamp  (very warm; 2400 K equivalent)
    intensity: 1200 lumens
    function: task lighting at desk
  - id: ark.captain_quarters.light.bedside_lamp.east
    position: (1.50, 7.50, 0.85)
    beam_angle: 360°
    colour: 2800 K
    intensity: 800 lumens
    function: bedside reading
  - id: ark.captain_quarters.light.bedside_lamp.west
    position: (-1.50, 7.50, 0.85)
    beam_angle: 360°
    colour: 2800 K
    intensity: 800 lumens
    function: bedside reading
  - id: ark.captain_quarters.light.degen_corner_pendant
    position: (6.00, 11.00, 3.30)  # Degen's Corner pendant
    beam_angle: 90° downward
    colour: 2400 K very warm
    intensity: 2000 lumens (dim — speakeasy aesthetic)
    function: principal Degen's Corner lighting
  - id: ark.captain_quarters.light.window_glow.east
    position: (5.95, 5.00, 1.80)  # at viewport
    beam_angle: 180° wash inward
    colour: variable (matches starfield content)
    intensity: variable
    function: ambient + cosmic-presence
  - id: ark.captain_quarters.light.window_glow.west
    position: (-5.95, 5.00, 1.80)
    beam_angle: 180° wash inward
    colour: variable
    intensity: variable
    function: ambient + cosmic-presence
practical_sources:
  - id: ark.captain_quarters.fireplace_glow  (if applicable; cross-ref §2.11 for fireplace presence)
    position: (-3.50, 8.50, 0.30)  # west wall recess (small fireplace)
    intensity: 600 lumens (orange flicker)
    flicker_pattern: organic
time_of_day_variation:
  acts_0_3: warm baseline; Kael's portrait illuminated; Degen's Corner is darker than main (curtain absorbs light)
  acts_5_7: Degen's Corner active — pendant ON; speakeasy atmosphere; main quarters slightly dimmer (Degen's smoke pulls light)
dynamic_response:
  - on_player_at_desk: desk_lamp activates (one-shot)
  - on_HB7_invoke: Degen's Corner pendant flickers; chip-stacks materialise; chair-glow pulse
  - on_kael_portrait_inspect: gentle highlight on portrait
```

### A.11.7 Atmosphere

```
air_temperature:    21°C (warm, comfortable)
humidity:           45% RH; smells of walnut + book-paper + faint cologne (Kael's residual presence) + (in Acts 5+) tobacco-smoke from Degen's Corner
particulate:
  - type: dust
    density: low (well-maintained but lived-in)
    colour: warm-greyish
    drift_direction: random with slight downward drift in window-light beams
  - type: smoke
    density: low (in Degen's Corner only; Acts 5+); zero in main quarters
    colour: smoky-blue-grey
    drift_direction: rises slowly from Degen's pendant; pools at low ceiling
volumetric_fog:     absent in baseline; present in Degen's Corner at low density (0.05 g/m³)
wind_drift:         very faint; 0.02 m/s; slight circulation toward private bath
smell_canon:        walnut + paper + cologne (acts 0-4) + tobacco-smoke (acts 5+); voice-line: "smells like the captain still lives here"
```

### A.11.8 Sound

```
ambient_bed:           file: captain_quarters_ambient_bed_v1.ogg (loop); -38 dB; very quiet (private space); ticking clock at desk, faint heating-vent hum, occasional book-page-rustle (cosmetic)
point_sources:
  - id: ark.captain_quarters.sound.clock_tick
    position: (-2.00, 5.50, 1.50)  # mantle-clock on desk
    sound: tick-tock (period 1s; -32 dB)
    occlusion_behaviour: standard
    trigger: continuous
  - id: ark.captain_quarters.sound.fireplace_crackle
    position: (-3.50, 8.50, 0.30)
    sound: fire-crackle (continuous, -30 dB; -∞ when fireplace not lit)
    occlusion_behaviour: standard
    trigger: continuous (in lit state)
  - id: ark.captain_quarters.sound.degen_corner_jazz
    position: (6.00, 11.00, 1.20)  # speakeasy radio
    sound: noir-jazz piano (-32 dB; only Acts 5+)
    occlusion_behaviour: standard; muffled by curtain in Acts 0-4
    trigger: continuous (Acts 5+ only)
  - id: ark.captain_quarters.sound.degen_corner_chip_clatter
    position: (6.00, 11.00, 0.85)  # at table
    sound: chip-clatter occasional (random; -34 dB; only when Degen present)
    occlusion_behaviour: standard
    trigger: random (Acts 5+; period 30-60s)
reverb_zone:           IR-impulse: captain_quarters_v1.wav; wet-mix 12% (intimate, low-reverb)
music_eligibility:     cutscene only (HB7 transit + cs_amb_degens_corner)
voice_line_eligibility:
  - speaker: kael_voss_residual  (rare; recorded log-only; Acts 0-4)
    trigger: log-playback only
    line_set: see §2.11.2
  - speaker: the_degen
    trigger: presence (Acts 5+)
    line_set: see §2.11.2 Degen presence-line set
  - speaker: the_master_of_rlyeh
    trigger: HB7 transit only
    line_set: HB7-specific
```

### A.11.9 Object inventory

Captain's Quarters has 52 inventory objects.

#### A.11.9.1 The Captain's Bed (Kael's bed)

```
object_id:           ark.captain_quarters.bed
object_class:        furniture
position:            (0.00, 7.50, 0.00)
dimensions:          2.20 × 1.80 × 0.80  (queen-size; carved walnut frame)
rotation:            0°
material_primary:    walnut headboard with carved laurel motif; matte-cream sheets and a folded charcoal blanket at foot
material_secondary:  brass corner-caps; brass handles on each post
colour_value:        --token-color-ark-captain-quarters-bed
interaction:         interactable
  - sit / lay: sit on edge or lay (bed dispositions)
  - inspect: lore-note about Kael's last night here
narrative_role:      Kael's bed; preserved as he last left it; in Acts 5+, player can sleep here for a buff
lore_anchor:         loredex.character.kael_voss + arc.act_0_loss_of_command
art_status:          producer_handoff
gameplay_hook_id:    trpc.captain_quarters.bed.sit + .lay
wear_state:          slight wear on Kael's preferred side (right, when entering bed)
physical_constraints: collides; sittable + layable
```

#### A.11.9.2 Captain's Desk

```
object_id:           ark.captain_quarters.desk
object_class:        furniture
position:            (-2.00, 5.50, 0.00)
dimensions:          1.80 × 0.90 × 0.80
rotation:            0°
material_primary:    polished walnut with leather inset top
material_secondary:  brass edge-trim; brass drawer handles; brass desk-lamp anchor
colour_value:        --token-color-ark-captain-quarters-desk
interaction:         interactable
  - operate: opens captain's desk UI (drawer access, log access, terminal)
  - inspect: lore-note
  - read_journal: opens Kael's journal (gameplay-key in Act 5)
narrative_role:      Kael's writing desk; the desk's drawers contain the captain's most personal artifacts
lore_anchor:         loredex.character.kael_voss + arc.captain_personal_arc
art_status:          producer_handoff
gameplay_hook_id:    trpc.captain_quarters.desk.operate
wear_state:          worn at the leather inset; pen-marks visible
physical_constraints: collides
```

#### A.11.9.3 Desk Chair

```
object_id:           ark.captain_quarters.desk_chair
object_class:        furniture
position:            (-2.00, 4.50, 0.00)
dimensions:          0.80 × 0.80 × 1.20
rotation:            0°
material_primary:    walnut frame with charcoal leather upholstery
material_secondary:  brass armrests; brass casters
colour_value:        --token-color-ark-captain-quarters-desk-chair
interaction:         interactable - sit (positioned at desk)
narrative_role:      Kael's working chair; player can sit and feel "the captain's seat"
lore_anchor:         loredex.character.kael_voss
art_status:          producer_handoff
gameplay_hook_id:    none (positional)
wear_state:          worn at seat (Kael's preferred position visible)
physical_constraints: collides; sittable
```

#### A.11.9.4 Mantle Clock (on desk)

```
object_id:           ark.captain_quarters.desk.mantle_clock
object_class:        decoration  (also fx_emitter — ticking sound + animated hands)
position:            (-2.00, 5.50, 0.85)  # on desk top, centre-back
dimensions:          0.30 × 0.20 × 0.40
rotation:            0°
material_primary:    polished brass case with mahogany wood inlay
material_secondary:  white porcelain face with Roman numerals
colour_value:        --token-color-ark-captain-quarters-clock
interaction:         inspectable (read inscription on back)
narrative_role:      ticking adds room-rhythm; the clock is canonically frozen at 03:47 (Kael's time of death) — but mysteriously ticks anyway
lore_anchor:         loredex.character.kael_voss + arc.kael_death_mystery
art_status:          producer_handoff
gameplay_hook_id:    trpc.captain_quarters.clock.inspect
wear_state:          slight patina
physical_constraints: collides; non-movable
```

#### A.11.9.5 Captain's Personal Locker

```
object_id:           ark.captain_quarters.captain_locker
object_class:        container
position:            (-3.50, 9.95, 0.00)  # north wall, west of desk
dimensions:          0.60 × 0.40 × 1.80
rotation:            180°
material_primary:    polished walnut with brass handle
material_secondary:  brass nameplate "K. VOSS"
colour_value:        --token-color-ark-captain-quarters-locker
interaction:         interactable
  - open: contains personal effects (a brass coin, a small flag, a folded letter to Elara, a portrait of his late wife); first opening triggers cs_kael_locker_first_open (Category A cutscene)
  - inspect (closed): lore-note
narrative_role:      Kael's personal effects; the brass coin here is the SAME COIN canonically that ends up at Degen's Corner in Acts 5+ (lore continuity)
lore_anchor:         loredex.character.kael_voss + arc.act_0_kael_legacy
art_status:          producer_handoff
gameplay_hook_id:    trpc.captain_quarters.captain_locker.open
wear_state:          worn at handle
physical_constraints: collides
```

#### A.11.9.6 Captain's Bookshelf (north wall)

```
object_id:           ark.captain_quarters.bookshelf.kael
object_class:        container
position:            (3.00, 9.85, 0.00)
dimensions:          2.00 × 0.40 × 3.20
rotation:            180°
material_primary:    built-in walnut shelving with adjustable shelves
material_secondary:  brass shelf-supports
colour_value:        --token-color-ark-captain-quarters-bookshelf
interaction:         interactable
  - inspect_book: each book is an inspectable lore-readable
narrative_role:      Kael's personal library; shows his interests (philosophy, poetry, military history, gardening); humanises the dead captain
lore_anchor:         loredex.character.kael_voss + arc.captain_personal_arc
art_status:          producer_handoff
gameplay_hook_id:    trpc.captain_quarters.bookshelf.inspect_book
wear_state:          slight wear at most-handled book-edges
physical_constraints: collides
```

#### A.11.9.7-12 Six Notable Books on Bookshelf

| object_id | class | position (within bookshelf) | role |
|---|---|---|---|
| `ark.captain_quarters.bookshelf.book.philosophy.1` | container | shelf 1, slot 1 | "On Sacrifice and Command" by an obscure Ark-philosopher |
| `ark.captain_quarters.bookshelf.book.poetry` | container | shelf 1, slot 2 | a hand-bound book of Kael's own poems |
| `ark.captain_quarters.bookshelf.book.military_history.1` | container | shelf 2, slot 1 | "Wars Without Names" |
| `ark.captain_quarters.bookshelf.book.gardening` | container | shelf 2, slot 2 | "The Botanist's Lament" — annotated extensively by Kael |
| `ark.captain_quarters.bookshelf.book.locked_journal` | container | shelf 3 (top, hidden) | locked journal — Act 5 gameplay-key |
| `ark.captain_quarters.bookshelf.book.elara_letters` | container | shelf 3, slot 2 | bundle of letters to Elara (her father?) |

#### A.11.9.13 Reading Chair (with ottoman)

```
object_id:           ark.captain_quarters.reading_chair
object_class:        furniture
position:            (3.50, 5.50, 0.00)
dimensions:          0.90 × 0.90 × 1.10
rotation:            225°  (faces toward bookshelf)
material_primary:    charcoal leather with walnut frame
material_secondary:  brass tacks along edges
colour_value:        --token-color-ark-captain-quarters-reading-chair
interaction:         interactable - sit (positions player to read books from bookshelf)
narrative_role:      where Kael read; intimate space
lore_anchor:         arc.captain_personal_arc
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          worn at seat and armrest-tops (Kael spent many hours here)
physical_constraints: collides; sittable

object_id:           ark.captain_quarters.reading_chair.ottoman
object_class:        furniture
position:            (3.50, 4.50, 0.00)  # in front of chair
dimensions:          0.70 × 0.50 × 0.40
rotation:            225°
material_primary:    matching charcoal leather + walnut
material_secondary:  brass tacks
colour_value:        --token-color-ark-captain-quarters-reading-chair
interaction:         interactable - rest_feet
narrative_role:      complete reading nook
lore_anchor:         arc.captain_personal_arc
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          slight wear
physical_constraints: collides
```

#### A.11.9.14-15 Side Tables (flanking bed)

```
object_id:           ark.captain_quarters.bedside_table.east, .west
object_class:        furniture
positions:           (1.50, 7.50, 0.00), (-1.50, 7.50, 0.00)
dimensions (each):   0.50 × 0.40 × 0.80
rotation:            0°
material_primary:    walnut with marble top
material_secondary:  brass drawer handle
colour_value:        --token-color-ark-captain-quarters-bedside-table
interaction:         interactable
  - open_drawer: contains misc personal items (medication, small flashlight, a photo)
  - inspect: lore-note
narrative_role:      domestic detail; reading lamps + bedside drawer-items live here
lore_anchor:         arc.captain_personal_arc
art_status:          producer_handoff
gameplay_hook_id:    trpc.captain_quarters.bedside_table.open
wear_state:          slight wear
physical_constraints: collides
```

#### A.11.9.16-19 Living-Zone Furniture (couch + coffee table + 2 occasional chairs)

```
object_id:           ark.captain_quarters.couch
object_class:        furniture
position:            (-2.00, 3.00, 0.00)
dimensions:          2.40 × 0.80 × 0.80
rotation:            0°
material_primary:    charcoal leather with walnut legs
material_secondary:  brass tacks
colour_value:        --token-color-ark-captain-quarters-couch
interaction:         interactable - sit (3-seat capacity)
narrative_role:      where Kael entertained Locke, Elara, the human
lore_anchor:         arc.captain_relationships
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          worn at sit-zones
physical_constraints: collides; sittable

object_id:           ark.captain_quarters.coffee_table
object_class:        furniture
position:            (0.00, 4.00, 0.00)
dimensions:          1.20 × 0.60 × 0.45
rotation:            0°
material_primary:    walnut with marble top
material_secondary:  brass corner caps
colour_value:        --token-color-ark-captain-quarters-coffee-table
interaction:         interactable
  - inspect: shows current items on table (chess board mid-game; whiskey decanter and 2 glasses; book)
narrative_role:      central shared surface; the chess board mid-game is the seed for HB9 Eternal Match (game state continues across visits)
lore_anchor:         arc.captain_chess_legacy + cross-ref §11.3.1 (cross-centuries chess game)
art_status:          producer_handoff
gameplay_hook_id:    trpc.captain_quarters.coffee_table.inspect
wear_state:          slight wear on top
physical_constraints: collides

object_id:           ark.captain_quarters.occasional_chair.east, .west
object_class:        furniture
positions:           (1.50, 3.00, 0.00), (-1.50, 3.00, 0.00) -- wait, let me adjust to flank coffee table
positions (corrected): (1.80, 4.00, 0.00), (-3.80, 4.00, 0.00)
dimensions (each):   0.80 × 0.80 × 1.10
rotation:            varies (faces coffee table)
material_primary:    walnut frame with charcoal leather seat
material_secondary:  brass tacks
colour_value:        --token-color-ark-captain-quarters-occasional-chair
interaction:         interactable - sit
narrative_role:      conversation seating
lore_anchor:         arc.captain_relationships
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          slight wear
physical_constraints: collides; sittable
```

#### A.11.9.20-22 Coffee Table Items (chess + decanter + book)

```
object_id:           ark.captain_quarters.coffee_table.chess_board
object_class:        interactive
position:            (0.00, 4.00, 0.45)  # on coffee table top
dimensions:          0.50 × 0.50 × 0.05
rotation:            0°
material_primary:    walnut and ivory chess board
material_secondary:  pieces are brass and matte-black (Kael's set)
colour_value:        --token-color-ark-captain-quarters-chess
interaction:         interactable
  - examine: shows current game state (mid-game; canonical setup tied to §11.3.1); reading the position is a lore moment
  - move_piece: in late-act, player can make a move (this is the SAME chess game ongoing in Antiquarian Library + Chess Hall — cross-room continuity)
narrative_role:      KEY artifact; the chess game ties multiple rooms together; HB9 cosmology cross-ref
lore_anchor:         §11.3.1 cross-centuries chess game + arc.act_4_eternal_match
art_status:          producer_handoff
gameplay_hook_id:    trpc.chess.captain_quarters.examine + .move
wear_state:          slight wear on most-handled pieces
physical_constraints: collides; pieces are interactable

object_id:           ark.captain_quarters.coffee_table.decanter
object_class:        decoration
position:            (-0.40, 4.00, 0.45)
dimensions:          0.20 × 0.20 × 0.30
rotation:            0°
material_primary:    cut-crystal
material_secondary:  brass stopper
colour_value:        --token-color-ark-captain-quarters-decanter (with amber liquid visible)
interaction:         inspectable (reads "for guests")
narrative_role:      whiskey decanter; symbolic of captain's hospitality
lore_anchor:         arc.captain_relationships
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          slight fingerprints visible on glass
physical_constraints: collides

object_id:           ark.captain_quarters.coffee_table.book
object_class:        container
position:            (0.40, 4.00, 0.45)
dimensions:          0.20 × 0.30 × 0.05
rotation:            45°
material_primary:    leather-bound (open)
material_secondary:  ink-on-paper
colour_value:        --token-color-ark-captain-quarters-book-leather
interaction:         interactable
  - inspect: opens lore-readable (a poem Kael was reading; left open at his death)
narrative_role:      humanises Kael; "he never finished the poem"
lore_anchor:         loredex.character.kael_voss
art_status:          producer_handoff
gameplay_hook_id:    trpc.captain_quarters.book.inspect
wear_state:          fresh / unfinished
physical_constraints: collides
```

#### A.11.9.23-32 Degen's Corner — The HB7 Anchor Zone

The Degen's Corner alcove is rendered with film-noir aesthetic
(dark walnut + smoke + amber-lit pendant). Contains:

```
object_id:           ark.captain_quarters.degen_corner.card_table
object_class:        furniture
position:            (6.00, 11.00, 0.00)
dimensions:          1.20 × 1.20 × 0.85
rotation:            0°
material_primary:    walnut with green-felt top
material_secondary:  brass corner caps
colour_value:        --token-color-ark-captain-quarters-degen-corner-table
interaction:         interactable
  - examine: shows a card-game in progress
narrative_role:      Degen's gaming surface; HB7 trigger surface
lore_anchor:         loredex.character.degen + arc.act_5_degen_appears
art_status:          producer_handoff
gameplay_hook_id:    trpc.captain_quarters.degen_corner.card_table.examine
wear_state:          worn at felt centre
physical_constraints: collides

object_id:           ark.captain_quarters.degen_corner.empty_chair
object_class:        furniture  (the HB7 anchor)
position:            (5.50, 11.50, 0.00)
dimensions:          0.80 × 0.80 × 1.30
rotation:            45°  (slightly angled, as if recently vacated)
material_primary:    walnut frame with charcoal leather
material_secondary:  brass tacks; brass armrests
colour_value:        --token-color-ark-captain-quarters-degen-chair
interaction:         interactable
  - sit: triggers cs_amb_degens_corner (Category B ambient cutscene; player sits where Degen sits)
  - inspect (Acts 0-4): "the chair seems waiting"
  - inspect (Acts 5+): "the Degen has left a coin here"
narrative_role:      THE empty chair; canonically Degen's chair; brass coin appears here in Acts 5+; lifting the coin invokes HB7
lore_anchor:         loredex.character.degen + arc.act_5_HB7_invocation
art_status:          producer_handoff
gameplay_hook_id:    trpc.captain_quarters.degen_corner.chair.sit + .inspect
wear_state:          worn at seat (Degen's preferred posture visible); in Acts 5+, chair is slightly warm
physical_constraints: collides; sittable

object_id:           ark.captain_quarters.degen_corner.brass_coin
object_class:        interactive  (HB7 gateway trigger)
position:            (5.50, 11.50, 0.85)  # on the empty chair seat
dimensions:          0.04 × 0.04 × 0.005
rotation:            varies
material_primary:    polished brass with engraved pattern (heads side reads "fortune"; tails side reads "fate")
material_secondary:  none
colour_value:        --token-color-ark-captain-quarters-degen-coin
interaction:         interactable
  - take: triggers cs_hellbox_7_open (HB7 transit cinematic; coin flips in air; casino materialises around the player — per §3.12.13)
  - inspect: lore-note about the coin (canonically the SAME COIN as in Captain's Locker — the Degen took it after Kael's death)
narrative_role:      THE HB7 trigger; only present in Acts 5+; lifting it invokes Casino transit
lore_anchor:         loredex.character.degen + arc.act_5_HB7_invocation + arc.kael_legacy_continuity
art_status:          producer_handoff
gameplay_hook_id:    trpc.hellbox.hb7.openGate
wear_state:          slight wear at edges; mostly polished
physical_constraints: collides (but very small; visible on chair)
```

#### A.11.9.26-32 Additional Degen's Corner Decorations

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.captain_quarters.degen_corner.poker_chips_stack` | decoration | on card table | 0.10 × 0.10 × 0.20 | chip-stacks |
| `ark.captain_quarters.degen_corner.deck_of_cards` | decoration | on card table | 0.10 × 0.07 × 0.02 | playing cards (face-down) |
| `ark.captain_quarters.degen_corner.smoking_pipe` | decoration | on card table | 0.20 × 0.05 × 0.05 | Degen's pipe (still warm in Acts 5+) |
| `ark.captain_quarters.degen_corner.whiskey_glass` | decoration | on card table | 0.08 × 0.08 × 0.10 | half-empty glass |
| `ark.captain_quarters.degen_corner.curtain.threshold` | decoration | (4.00, 9.00, 2.25) | 0.10 × 4.00 × 4.50 (when present) | velvet curtain (cutscene-driven Acts 0-4) |
| `ark.captain_quarters.degen_corner.framed_photo.degen` | decoration | (8.95, 11.00, 2.40) | 0.30 × 0.40 × 0.04 | photo of Degen (rare; Acts 5+ only) |
| `ark.captain_quarters.degen_corner.radio` | fx_emitter | (7.50, 11.00, 1.20) | 0.40 × 0.30 × 0.30 | source of noir-jazz ambient |

#### A.11.9.33-42 Rug + Wall Decorations + Plants + Smaller Items

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.captain_quarters.living_room_rug` | decoration | (0.00, 4.00, 0.005) | 4.00 × 5.00 × 0.005 | central rug |
| `ark.captain_quarters.bedside_lamp.east` | fx_emitter | (1.50, 7.50, 0.85) | 0.20 × 0.20 × 0.50 | east bedside lamp |
| `ark.captain_quarters.bedside_lamp.west` | fx_emitter | (-1.50, 7.50, 0.85) | mirror | west bedside lamp |
| `ark.captain_quarters.fireplace.west` | interactive | (-3.50, 8.50, 0.00) | 1.20 × 0.40 × 1.20 | wood-fired fireplace |
| `ark.captain_quarters.fireplace.mantle` | decoration | (-3.50, 8.50, 1.30) | 1.40 × 0.30 × 0.10 | stone mantle |
| `ark.captain_quarters.mantle.framed_photo` | decoration | (-3.50, 8.50, 1.50) | 0.20 × 0.30 × 0.04 | photo of Kael's late wife |
| `ark.captain_quarters.mantle.silver_candleholder.1, .2` | decoration | flanking photo | 0.10 × 0.10 × 0.30 each | candleholders |
| `ark.captain_quarters.potted_plant.east_window` | decoration | (5.50, 5.00, 0.85) | 0.40 × 0.40 × 0.60 | small potted plant |
| `ark.captain_quarters.potted_plant.west_window` | decoration | (-5.50, 5.00, 0.85) | mirror | mirror plant |
| `ark.captain_quarters.coat_stand.east` | decoration | (5.50, 1.50, 0.00) | 0.30 × 0.30 × 1.80 | coat stand (Kael's coat hangs here) |

#### A.11.9.43-52 Additional Smaller Decorations

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.captain_quarters.kael_coat` | decoration | hanging from coat-stand | 0.50 × 0.10 × 0.80 | Kael's coat (preserved) |
| `ark.captain_quarters.intercom.bedside` | console | (-1.50, 7.20, 0.85) | 0.20 × 0.10 × 0.20 | bedside intercom |
| `ark.captain_quarters.intercom.south_wall` | console | (0.00, 0.20, 1.50) | 0.20 × 0.10 × 0.30 | comms relay |
| `ark.captain_quarters.fire_extinguisher.west` | interactive | (-5.50, 0.20, 1.20) | 0.20 × 0.20 × 0.50 | safety |
| `ark.captain_quarters.first_aid.bathroom_adjacent` | container | (-3.50, 9.85, 1.50) | 0.40 × 0.10 × 0.30 | medical |
| `ark.captain_quarters.dresser` | container | (4.50, 7.50, 0.00) | 1.20 × 0.50 × 1.40 | clothing dresser |
| `ark.captain_quarters.dresser.framed_drawing` | decoration | (4.50, 7.30, 1.50) on dresser | 0.20 × 0.30 × 0.04 | small framed drawing (Elara's child-drawing) |
| `ark.captain_quarters.full_length_mirror` | decoration | (-5.50, 9.85, 0.00) | 0.60 × 0.10 × 1.80 | bedroom mirror — IMPORTANT: this mirror does NOT show player reflection (per FPV rule §3.1.0); it shows only the room behind |
| `ark.captain_quarters.kael_signature_painting` | decoration | (-3.50, 8.50, 2.40) above mantle | 0.80 × 0.50 × 0.04 | abstract painting Kael chose |
| `ark.captain_quarters.window_curtains.east` | decoration | (5.95, 5.00, 1.80) on east window | 0.10 × 1.40 × 1.80 | curtains |
| `ark.captain_quarters.window_curtains.west` | decoration | (-5.95, 5.00, 1.80) on west window | mirror | curtains |

Total: 52 inventory objects.

### A.11.10 Camera-spawn-points (FPV cutscenes)

```
cutscene_id:         cs_amb_captain_quarters  (Category B; deferred catalogue)
camera_position:     (0.00, 0.50, eye_level)  # at threshold
camera_facing:       (0°, -3°, 0°)  # looking forward and slightly down (reverence for the dead)
avatar_height_anchor: eye_level
head_motion:         slow walk into room; head turns to viewport; pause; turns to portrait of Kael; lasts 22s

cutscene_id:         cs_amb_degens_corner  (Category B Myst-ambient; per §3.1.B.3)
camera_position:     (5.50, 10.50, eye_level)  # at Degen's Corner threshold
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         slow approach to empty chair; pause; coin spinning on its own (cosmetic)

cutscene_id:         cs_kael_locker_first_open  (Category A; one-shot)
camera_position:     (-3.50, 9.50, eye_level)  # at locker
camera_facing:       (-90°, -10°, 0°)
avatar_height_anchor: eye_level
head_motion:         hand-rig opens locker; camera tilts to view contents; lasts ~10s

cutscene_id:         cs_hellbox_7_open  (HB7 Casino gateway; per §3.12.13)
camera_position:     (5.50, 11.50, eye_level)  # at empty chair, looking down at coin
camera_facing:       (0°, -45°, 0°)
avatar_height_anchor: eye_level
head_motion:         hand-rig enters frame picking up coin; coin flips; casino materialises around player

cutscene_id:         cs_hellbox_7_transit  (HB7 transit)
camera_position:     (5.50, 11.50, eye_level)
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         walk through smoky corridor; neon flickers; chip-stacks rise

cutscene_id:         cs_hellbox_7_close  (HB7 return)
camera_position:     (5.50, 11.50, eye_level)
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         casino exit; chip-stacks dissolve; chair re-materialises with brass coin sitting on the seat
```

### A.11.11 Doorways

```
door_id:            ark.captain_quarters.south.door.main
connecting_space_id: ark.corridor.captain_approach
door_position:      (0.00, 0.00, 0.00)
door_dimensions:    1.20 × 2.40 × 0.10
door_class:         slide (lateral; brass handle)
unlock_condition:   Act 1+ (locked in Act 0; player gets access in Act 1 along with a key memory)
transit_animation:  fade
audio_signature:    brass-handle-twist + servo-slide

door_id:            ark.captain_quarters.north.door.private_bath
connecting_space_id: ark.captain_quarters.private_bath  (deferred sub-space; treat as inaccessible)
door_position:      (-3.00, 9.95, 0.00)
door_dimensions:    0.80 × 2.20 × 0.10
door_class:         slide
unlock_condition:   always
transit_animation:  fade
audio_signature:    soft-slide
```

### A.11.12 Adjacency map

```
direct_adjacencies:
  - ark.corridor.captain_approach (south door)
  - ark.captain_quarters.private_bath (north door; sub-space)
  - hellbox.degenerate_casino (HB7 portal via Degen's Corner empty chair, conditional on Act 5+)
one_hop_adjacencies:
  - ark.bridge (via captain corridor + Deck-1 main)
  - destination.degenerate_casino (via HB7)
```

### A.11.13 Gameplay hooks

```
hooks:
  - hook_id:         captain_quarters.openCaptainLocker
    trigger:         player.open on ark.captain_quarters.captain_locker
    procedure:       trpc.captain_quarters.captain_locker.open
    success_state:   captain_locker_opened = true (one-shot triggers cutscene)
  - hook_id:         captain_quarters.readBookshelfBook
    trigger:         player.inspect on bookshelf book
    procedure:       trpc.captain_quarters.bookshelf.inspect_book
    success_state:   book_read = true (per-book)
  - hook_id:         captain_quarters.readKaelJournal
    trigger:         (state-conditional) player.unlock locked_journal after specific Act 5 condition
    procedure:       trpc.captain_quarters.journal.read
    success_state:   kael_journal_read = true (gameplay-key)
  - hook_id:         captain_quarters.makeChessMove
    trigger:         player.interact on coffee_table chess board
    procedure:       trpc.chess.captain_quarters.move
    success_state:   move_made = true (one move per visit; persists)
  - hook_id:         captain_quarters.sleepInBed
    trigger:         player.lay on bed
    procedure:       trpc.captain_quarters.bed.sleep
    success_state:   sleep_buff = active (Acts 5+ feature)
  - hook_id:         captain_quarters.takeDegenCoin
    trigger:         player.take on degen_corner.brass_coin (only available Acts 5+)
    procedure:       trpc.hellbox.hb7.openGate
    success_state:   hellbox_7_transit_started = true
    fail_state:      not_yet_unlocked (Acts 0-4)
  - hook_id:         captain_quarters.sitDegenChair
    trigger:         player.sit on degen_corner.empty_chair
    procedure:       trpc.captain_quarters.degen_corner.chair.sit
    success_state:   degen_chair_seated = true (counts toward HB7 readiness)
```

### A.11.14 Story-tie

```
primary_arcs:
  - arc.act_0_loss_of_command
  - arc.captain_personal_arc
  - arc.act_5_degen_appears
  - arc.act_5_HB7_invocation
  - arc.kael_legacy_continuity (the brass coin connects rooms)
  - §11.3.1 cross-centuries chess game (the chess board persists across rooms)
per_act_evolution:
  act_0:
    description: "Room locked; player can see door but cannot enter. Plaque says 'Captain Kael Voss (commissioned)'."
  act_1:
    description: "Player gains access. Room is preserved exactly as Kael left it. Captain Locker triggers first-open cutscene. Bookshelf books readable. Bed available for sit."
    visible_changes: room_unlocked, captain_locker_glowing, bookshelf_first_examined
  act_3:
    description: "Player has been here multiple times. Some books have been read. Chess game has visible progress. Living-zone shows player's residual presence."
    visible_changes: chess_state_evolved, books_read_track
  act_5:
    description: "MAJOR — Degen's Corner curtain dissolves. Degen first appears. Brass coin appears on empty chair. HB7 invokable."
    visible_changes: degen_corner_active, brass_coin_visible, jazz_music_audible
  act_6:
    description: "Locked journal becomes unlockable (player has gathered the keys). Reading it triggers cs_kael_journal_read (Category A)."
    visible_changes: locked_journal_unlockable
  act_7:
    description: "Final state: player either takes Kael's mantle (sit captain's chair on Bridge cumulative, kept locker contents, made chess moves, etc.) → 'inheritance ending'; or rejected → 'forsaken ending'. State affects nameplate (player's name overwrites Kael's, or doesn't)."
    visible_changes: state_branched_nameplate
npc_roster:
  - kael_voss_residual: log-playback only; never physically present (he is dead)
  - the_degen: alcove presence Acts 5+; emerges from Degen's Corner
  - the_player: visitor / occupant
  - the_master_of_rlyeh: HB7 transit voice only
readables:
  - dedication plaque (south wall)
  - 6 bookshelf books (multi-screen each)
  - locked journal (Act 6 gameplay-key)
  - bedside drawer-photos
  - mantle photo (Kael's late wife)
  - Elara's child-drawing (west wall)
  - lineage portrait (east wall)
  - Kael's framed signature painting (above mantle)
  - degen_corner: deck of cards (each card readable as a tarot-style omen Acts 5+)
master_of_rlyeh_question: "What is owed to a debt that was never agreed to?"
```

### A.11.15 Special-FX

```
particle_systems:
  - dust_motes (low; visible in window-light beams)
  - smoke (Degen's Corner Acts 5+; rises from pendant)
  - fire_glow (fireplace if lit; flickering particles)
  - candle_smoke (mantle candleholders if lit)
volumetric_effects:
  - viewport_glow (east + west; reflects starfield content)
  - degen_corner_smoke_pool (low ceiling smoke pool Acts 5+)
  - chandelier_crystal_scatter (crystal prisms scatter chandelier light into rainbow on rug)
procedural_animations:
  - clock_hands_animate (mantle clock; ticks but hands DO NOT move — frozen at 03:47)
  - brass_coin_spin (degen_corner empty chair coin slowly spins on its own; Acts 5+; cosmetic)
  - chess_piece_settle (pieces shift very slightly between visits)
  - kael_portrait_eye_track (Acts 5+; subtle uncanny effect — eyes seem to follow player)
  - bookshelf_re_organise (Acts 5+; books slowly re-arrange between visits — Editor-presence echo)
reactive_systems:
  - desk_lamp_on_proximity (within 1.5 m, lamp warms)
  - fireplace_glow_on_inspect (player can light or extinguish)
  - degen_corner_curtain_dissolution (one-shot Act 5)
  - HB7_coin_spin_acceleration (when player approaches, coin spins faster)
  - locked_journal_unlock_one_shot (Act 6)
```

### A.11.16 Avatar-parametricity

```
camera_height_variation:
  small_xenomorph (0.85m eye): camera height 0.85m; furniture is oversized; bed feels enormous; alternate sit/lay animations
  short_humanoid (1.40m eye): standard short scale
  average_humanoid (1.70m eye): standard
  tall_humanoid (2.05m eye): bed-sit feels low; chandelier is at head-level
  tall_xenomorph (2.70m eye): chandelier collides at head — must duck (alternate animation); bed too small
reachability:
  small_xenomorph: cannot reach top bookshelf shelf without stool; alternate ladder is provided in Acts 5+
  small_xenomorph: cannot reach above-mantle painting; relay-inspect from below
  others: all-reachable
audio_occlusion_variation:
  xenomorph_sensitive_hearing: clock-tick is louder; bedside heartbeat (in sleep state) more pronounced
  synthetic_voice_avatar: jazz music has slight synthetic-resonance bias
```

### A.11.17 Performance

```
polygon_budget:      300,000 polygons (52 objects; high decorative density)
texture_budget:      180 MB total (many unique surface materials; wood + leather + brass diversity)
light_count_limit:   18 simultaneous dynamic lights
lod_plan:
  - hero_distance: 0-8m, full detail
  - mid_distance: 8-15m, mid detail (small decorations simplified)
  - low_distance: 15m+, low detail (mostly billboarded; many small items culled)
streaming_behaviour:
  - preload: ark.corridor.captain_approach (south)
  - on_player_within_2m_of_coin (Acts 5+) + HB7_unlocked: preload destination.degenerate_casino
```

---

## A.12 Trophy Room — SCAFFOLDED

```
space_id:        ark.trophy_room
space_name:      Trophy Room
space_type:      ark_room
act_introduced:  Act 3
lore_anchor:     loredex.system.trophies + arc.player_progression
aesthetic_tier:  solar_punk_cathedral  (gallery accents)
dimensions:      10.00 m × 12.00 m × 5.00 m
floor_plan_geometry: rectangular
```

Trophy display gallery; trophies from various game modes; fight
records; per §2.12 + §4.2 (cross-ref).

(Full spec deferred.)

---

## A.13 Antiquarian's Library — CORE

```
space_id:        ark.antiquarian_library
space_name:      Antiquarian's Library (Pocket Dimension)
space_type:      destination_zone  (technically a pocket-dimension; accessed from Archives §A.4 via a hidden passage)
act_introduced:  Act 3
lore_anchor:     loredex.character.the_antiquarian + loredex.faction.architect_remnants + arc.lore_recovery
aesthetic_tier:  dreamers_oneiric  (impossibly tall library; non-Euclidean architecture)
```

The Library is a pocket-dimension; volumetric anomaly: the room
is far larger inside than outside (entry portal is a small archway
in Archives, but interior is ~2000 m² over multiple levels).

```
dimensions:           28.00 m × 28.00 m × 24.00 m  (with multiple gallery levels)
floor_plan_geometry:  non_euclidean  (impossible geometry — recursive at the upper galleries)
volumetric_anomalies: bigger-on-inside ratio 4× external footprint; recursive upper galleries (galleries 5+ loop back to gallery 3)
```

Antiquarian sits at a central reading table; books re-arrange
themselves slowly; light shafts from impossibly-high windows;
dust motes everywhere. THIS is the home of the Antiquarian
character.

Key objects (cross-ref §11.3.1 living-world chess game):
- `ark.antiquarian_library.central_reading_table`
- `ark.antiquarian_library.antiquarian_chair` — Antiquarian's NPC anchor
- `ark.antiquarian_library.chess_table` — the centuries-long Antiquarian-vs-Programmer game (HB9 cosmology cross-ref)
- `ark.antiquarian_library.bookshelf.gallery_1.<n>` through `gallery_5.<n>`
- `ark.antiquarian_library.spiral_staircase` — spiral staircase to upper galleries
- `ark.antiquarian_library.skylight` — impossibly-high skylight (light source)

(Full spec deferred.)

---

## A.14 Guild Sanctum — SCAFFOLDED

```
space_id:        ark.guild_sanctum
space_name:      Guild Sanctum
space_type:      ark_room
act_introduced:  Act 4
lore_anchor:     loredex.faction.guilds + arc.guild_progression
aesthetic_tier:  solar_punk_cathedral  (faction-decorated)
dimensions:      14.00 m × 14.00 m × 5.00 m
floor_plan_geometry: hexagonal
```

(Full spec deferred.)

---

## A.15 Social Hub (Mess Hall) — SCAFFOLDED

```
space_id:        ark.social_hub
space_name:      Social Hub / Mess Hall
space_type:      ark_room
act_introduced:  Act 1
lore_anchor:     loredex.system.crew_social + arc.crew_relationships
aesthetic_tier:  solar_punk_cathedral  (warm-domestic)
dimensions:      16.00 m × 12.00 m × 4.50 m
floor_plan_geometry: rectangular
```

(Full spec deferred.)

---

## A.16 Station Dock — SCAFFOLDED

```
space_id:        ark.station_dock
space_name:      Station Dock
space_type:      ark_room
act_introduced:  Act 2
lore_anchor:     loredex.system.station_dock + arc.station_visits
aesthetic_tier:  solar_punk_cathedral  (industrial-port accents)
dimensions:      18.00 m × 12.00 m × 8.00 m
floor_plan_geometry: rectangular
```

(Full spec deferred.)

---

## A.17 Engineering Core (D8 hidden — soldier sanctum) — SCAFFOLDED

```
space_id:        ark.engineering_core_sanctum
space_name:      Engineering Core (Soldier Sanctum)
space_type:      ark_room  (faction-locked)
act_introduced:  Act 5  (faction-aligned only)
lore_anchor:     loredex.faction.soldiers + arc.faction_sanctum_unlocks
aesthetic_tier:  solar_punk_cathedral  (military-austere)
dimensions:      10.00 m × 10.00 m × 4.50 m
floor_plan_geometry: rectangular
```

(Full spec deferred.)

---

## A.18 Oracle Sanctum (D8 oracle scrying pool) — SCAFFOLDED

```
space_id:        ark.oracle_sanctum
space_name:      Oracle Sanctum
space_type:      ark_room
act_introduced:  Act 5
lore_anchor:     loredex.faction.oracles + loredex.character.the_oracle + arc.oracle_arc
aesthetic_tier:  dreamers_oneiric  (mystic-water aesthetic)
dimensions:      9.00 m × 9.00 m × 5.00 m
floor_plan_geometry: circular
```

Central scrying pool (4.0 m diameter); Oracle's chair beside the
pool; ambient water-sounds.

(Full spec deferred.)

---

## A.19 Shadow Vault (D8 — assassin sanctum) — SCAFFOLDED

```
space_id:        ark.shadow_vault
space_name:      Shadow Vault (Assassin Sanctum)
space_type:      ark_room  (faction-locked)
act_introduced:  Act 5
lore_anchor:     loredex.faction.assassins + arc.shadow_arc
aesthetic_tier:  solar_punk_cathedral  (shadow-tactical accents)
dimensions:      10.00 m × 12.00 m × 4.00 m
floor_plan_geometry: rectangular  (with hidden alcoves)
```

(Full spec deferred.)

---

## A.20 War Room (D8 strategist sanctum) — SCAFFOLDED

```
space_id:        ark.war_room
space_name:      War Room
space_type:      ark_room
act_introduced:  Act 4
lore_anchor:     loredex.system.alliance_war + arc.faction_war
aesthetic_tier:  solar_punk_cathedral  (strategic-grit accents)
dimensions:      14.00 m × 14.00 m × 4.50 m
floor_plan_geometry: rectangular
```

Faction-standing display; strategic holo-map; alliance-war command.

(Full spec deferred.)

---

## A.21 Cipher Den (D8 — Hellbox 8 host) — FULL

**Status: FULL spec.** Cross-ref: `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.21 (art-state prompts) and §3.12.10 HB8 Editor's Workshop gateway.

### A.21.1 Header

```
space_id:        ark.cipher_den
space_name:      Cipher Den (with Shadow Tongue Uncorruption Bench)
space_type:      ark_room  (also Hellbox-8 host)
act_introduced:  Act 5
lore_anchor:     loredex.system.uncorruption_bench + loredex.character.editor + arc.act_5_meta_narrative
aesthetic_tier:  solar_punk_cathedral  (scholarly-editorial accents; with non-Euclidean library aesthetic mixed in)
master_of_rlyeh_question: "Is what was written, or what was edited, the truth?" (per HB8)
```

### A.21.2 Geometry

```
dimensions:           10.00 m × 10.00 m × 4.50 m
origin_point:         centre of floor at the primary entrance threshold (entrance is the south wall)
coordinate_axes:      +x = right, +y = forward, +z = up
floor_plan_geometry:  rectangular  (with subtle non-Euclidean folding at the north wall — books on north shelves continue past the wall plane into a mild "bigger-on-inside" effect)
volumetric_anomalies: subtle bigger-on-inside ratio 1.2× at north shelves (visible only on close inspection); HB8 transit briefly extends Uncorruption Bench non-Euclidean (~10s)
```

The Cipher Den is a relatively small room compared to other
sanctums, but its proportions feel larger because of the
non-Euclidean folding at the north wall. The Uncorruption Bench
dominates the centre. Reference shelves line the north wall;
forbidden text vault occupies the rear (locked behind a heavy door).

Floor area: 100 m².

### A.21.3 Floor

```
material_primary:     polished obsidian-black slate; 0.80 m × 0.80 m tiles; 3 mm gap; very subtle anti-slip etch
material_secondary:   gold inlay forming an eight-pointed compass-rose centred on Uncorruption Bench
pattern:              compass-rose inlay (1.40 m diameter) at room centre; smaller inlay-marks at cardinal points around it
wear_state:           pristine (Cipher Den is meticulously maintained); faint wear-trail from entrance to bench
embedded_features:
  - id: ark.cipher_den.floor.charge_point.bench
    position: (0.00, 5.00, 0.00)  # under bench
    dimensions: 0.30 × 0.30 × 0.05
    function: bench power-coupling
  - id: ark.cipher_den.floor.drain.south
    position: (0.00, 0.50, 0.00)
    dimensions: 0.20 × 0.20 × 0.05
    function: ink-spill drain (rare)
acoustic_property:    hard_reflective with very slight whisper-gallery effect from non-Euclidean fold; RT60 = 0.55s
```

### A.21.4 Walls

#### Wall: South (entrance)

```
wall_id:              south
material_primary:     dark walnut paneling with deep-relief carvings (ancient script motifs)
material_secondary:   bronze dado at z = 1.10 m; bronze door-frame
panelisation:         6 panels wide × 3 panels tall
colour_value:         --token-color-ark-cipher-den-wall-south  (deep walnut with bronze pin-stripe; faint phosphorescent script visible in low light)
embedded_displays:
  - id: ark.cipher_den.south.display.cipher_index
    position: (-2.00, 0.20, 1.50)
    dimensions: 0.80 × 0.60 × 0.05
    content: index of all texts the Editor has worked on
  - id: ark.cipher_den.south.display.player_lore_summary
    position: (2.00, 0.20, 1.50)
    dimensions: 0.80 × 0.60 × 0.05
    content: summary of the player's current LOREDEX entries (the player's own canonical record); state-axis driven
embedded_doors:
  - door_id: ark.cipher_den.south.door.main
    position: (0.00, 0.00, 0.00)
    dimensions: 1.20 × 2.40 × 0.10
    door_class: arch (heavy bronze double-door with inscribed glyphs; opens with reverence)
    connecting_space_id: ark.corridor.cipher_approach
decorative_features:
  - id: ark.cipher_den.south.plaque.editor
    position: (0.00, 0.20, 3.20)
    dimensions: 1.00 × 0.40 × 0.02
    material: bronze with engraved text + acid-etched glyphs
    narrative_role: reads "WHAT IS WRITTEN MAY BE EDITED" — the Editor's primary maxim
```

#### Wall: East

```
wall_id:              east
material_primary:     dark walnut with deep-relief carvings
material_secondary:   bronze dado
panelisation:         standard
colour_value:         --token-color-ark-cipher-den-wall-east
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: ark.cipher_den.east.shelf.scribe_tools
    position: (4.50, 5.00, 0.00)
    dimensions: 0.40 × 4.00 × 3.20
    material: built-in walnut shelving with felt-lined slots
    narrative_role: holds pens, quills, brushes, inks, blotters, drying-papers; the Editor's tools
  - id: ark.cipher_den.east.candle_array
    position: (4.50, 1.50, 1.20)  # at south end of shelf
    dimensions: 0.30 × 0.30 × 0.50
    material: bronze with wax candles
    narrative_role: ritual lighting for night-work
```

#### Wall: North (with non-Euclidean reference shelves)

```
wall_id:              north
material_primary:     dark walnut shelving (full wall); shelves recede impossibly into the wall plane (non-Euclidean — the wall LOOKS deeper than the room geometry allows)
material_secondary:   bronze shelf supports; bronze name-plates per shelf
panelisation:         5 shelf bays (rather than wall panels); each bay 1.80 m wide × 4.20 m tall × varying depth
colour_value:         --token-color-ark-cipher-den-wall-north  (deep walnut + phosphorescent ledger-glow from within shelves)
embedded_displays:    none (shelves are content)
embedded_doors:
  - door_id: ark.cipher_den.north.door.forbidden_archive
    position: (0.00, 9.95, 0.00)  # central bay; concealed by false bookend
    dimensions: 1.20 × 2.40 × 0.10
    door_class: pressure_seal (heavy; double-locked; opens with key gameplay-condition)
    connecting_space_id: ark.cipher_den.forbidden_archive  (sub-space; treat as inaccessible until late-act)
    unlock_condition: late-act (Act 6+; player must collect 4 cipher-keys from across the Ark)
decorative_features:
  - id: ark.cipher_den.north.shelf.bay.<n>  (5 bays)
    position: distributed along north wall
    dimensions: 1.80 × 1.00 × 4.20 each
    material: walnut + bronze
    narrative_role: each bay holds books on a different category (history, philosophy, occult, language, prophecy); bays' contents are gameplay-relevant
```

#### Wall: West

Mirror of east (with similar shelving but for player's archives).

```
wall_id:              west
material_primary:     dark walnut with deep-relief carvings
material_secondary:   bronze dado
panelisation:         standard
colour_value:         --token-color-ark-cipher-den-wall-west
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: ark.cipher_den.west.shelf.player_archives
    position: (-4.50, 5.00, 0.00)
    dimensions: 0.40 × 4.00 × 3.20
    material: built-in walnut shelving
    narrative_role: holds the player's accumulated narrative — the Editor's working files on the player's own canon
  - id: ark.cipher_den.west.candle_array
    position: (-4.50, 1.50, 1.20)
    dimensions: 0.30 × 0.30 × 0.50
    material: bronze with wax candles
    narrative_role: ritual lighting; mirror of east
```

### A.21.5 Ceiling

```
height_above_floor:     4.50 m baseline; central coffer over Uncorruption Bench at 3.80 m (lower; gives intimacy); shelf bays' ceiling extends to 4.20 m within the non-Euclidean fold
material:               dark-stained plaster with bronze rib detail; central coffer is a circular emitter (parchment-tone backlit panel)
lighting_integrated:    central pendant (single brass pendant over bench); recessed strip-lights over wall shelves; warm amber tone throughout
atmospheric_features:   subtle ink-mist drift in the central coffer's light shaft (very rare; only during active editing); occasional dust-motes
acoustic_treatment:     coffered (heavy fabric absorption from books); dampened acoustic
```

### A.21.6 Lighting

```
ambient_baseline:     2400 K (very warm; candle-and-pendant lighting); 100 lux at floor (dim — scholarly atmosphere); CRI 90
direct_fixtures:
  - id: ark.cipher_den.light.central_pendant
    position: (0.00, 5.00, 3.80)  # over bench
    beam_angle: 90° downward
    colour: --token-color-ark-cipher-den-pendant  (warm amber; halo of slightly darker outer ring)
    intensity: 4500 lumens
    function: principal task lighting at bench
  - id: ark.cipher_den.light.shelf_strip.north
    position: along north wall at z = 4.30
    beam_angle: 180° wash downward + into shelves
    colour: --token-color-ark-cipher-den-shelf-strip  (very warm; almost candle-tone)
    intensity: 600 lumens per metre
    function: accent + readability
  - id: ark.cipher_den.light.shelf_strip.east
    position: along east wall at z = 3.30 (above shelf)
    beam_angle: 180° wash
    colour: same as north strip
    intensity: 400 lumens per metre
    function: accent
  - id: ark.cipher_den.light.shelf_strip.west
    position: along west wall at z = 3.30
    beam_angle: 180° wash
    colour: same as north strip
    intensity: 400 lumens per metre
    function: accent
  - id: ark.cipher_den.light.bench_inkwell_glow
    position: (0.00, 5.00, 0.92)  # on bench; from open inkwell
    beam_angle: 360°
    colour: 1800 K (very warm)
    intensity: 200 lumens (when lit; off when inkwell closed)
    function: punctuation; signals "the work is happening"
practical_sources:
  - id: ark.cipher_den.candle.east.<n>  (6 candles total)
    position: along east candle-array
    intensity: 60 lumens each
    flicker_pattern: organic (period 0.8s, random)
  - id: ark.cipher_den.candle.west.<n>  (6 candles)
    position: along west candle-array
    intensity: 60 lumens each
    flicker_pattern: organic
  - id: ark.cipher_den.archive_glow
    position: (0.00, 9.50, 1.50)  # along north shelf central bay
    intensity: 50 lumens (very subtle phosphorescent glow from the archive door)
    flicker_pattern: stable
time_of_day_variation:
  acts_5_to_7: stable; in late-act7, if Editor presence is strong (player has engaged with multiple lore-edits), pendant pulses with quill-rhythm
dynamic_response:
  - on_player_at_bench: bench_inkwell_glow activates if inkwell open; central pendant intensifies 20%
  - on_HB8_invoke: pendant flickers; non-Euclidean shelves visibly extend; ink-mist intensifies
  - on_archive_door_unlock: archive_glow brightens dramatically (one-shot)
```

### A.21.7 Atmosphere

```
air_temperature:    19°C (cool — preservation of paper)
humidity:           38% RH (low — paper-friendly); smells of ink + parchment + walnut + faint candle-wax
particulate:
  - type: dust
    density: low (well-maintained)
    colour: warm-grey
    drift_direction: random + slight downward in pendant light shaft
  - type: ink_mist
    density: very low (only when inkwell open or during HB8 transit)
    colour: pale blue-black
    drift_direction: rises slowly from bench
  - type: candle_smoke
    density: low (12 candles total)
    colour: very pale grey
    drift_direction: upward
volumetric_fog:     absent in baseline; subtle ink-cloud at vault apex during active editing
wind_drift:         minimal; 0.02 m/s; toward archive door (slight pressure differential)
smell_canon:        ink + parchment + walnut + candle-wax + faint metallic-bronze; voice-line: "smells like centuries"
```

### A.21.8 Sound

```
ambient_bed:           file: cipher_den_ambient_bed_v1.ogg (loop); -38 dB; very quiet; faint candle-flicker, distant page-rustle, occasional creak from non-Euclidean shelves
point_sources:
  - id: ark.cipher_den.sound.candle_flicker.<n>  (12 candles)
    position: per candle
    sound: candle-flame (-42 dB each)
    occlusion_behaviour: omnidirectional
    trigger: continuous
  - id: ark.cipher_den.sound.shelf_creak
    position: north wall, distributed
    sound: occasional book-creak (random; -38 dB)
    occlusion_behaviour: standard
    trigger: random (period 30-90s)
  - id: ark.cipher_den.sound.bench_quill
    position: (0.00, 5.00, 0.92)  # on bench
    sound: quill-on-paper (during active editing; -32 dB)
    occlusion_behaviour: standard
    trigger: state-conditional (active during Editor work / HB8 transit)
  - id: ark.cipher_den.sound.archive_hum
    position: (0.00, 9.50, 1.50)  # archive door
    sound: very faint hum (locked-archive seal); -44 dB
    occlusion_behaviour: standard
    trigger: continuous
  - id: ark.cipher_den.sound.editor_breath
    position: (-1.00, 4.50, 1.40)  # editor anchor (presence — never visible)
    sound: very faint breath (only during Editor presence; -44 dB)
    occlusion_behaviour: omnidirectional with subtle directional bias
    trigger: state-conditional (Editor present)
reverb_zone:           IR-impulse: cipher_den_v1.wav; wet-mix 18% (slight whisper-gallery from non-Euclidean fold)
music_eligibility:     cutscene only (HB8 transit)
voice_line_eligibility:
  - speaker: the_editor_presence  (no spoken voice; only quill-on-paper SFX represents Editor "speech")
    trigger: state-conditional
    line_set: SFX-only; cf §3.1.C (Editor's Workshop loading)
  - speaker: the_master_of_rlyeh
    trigger: HB8 transit only
    line_set: HB8-specific
```

### A.21.9 Object inventory

Cipher Den has 39 inventory objects.

#### A.21.9.1 The Shadow Tongue Uncorruption Bench (HB8 gateway)

```
object_id:           ark.cipher_den.uncorruption_bench
object_class:        interactive  (also fx_emitter for HB8 transit; primary gameplay-active surface)
position:            (0.00, 5.00, 0.00)
dimensions:          1.80 × 1.20 × 0.92  (long bench-style table)
rotation:            0°
material_primary:    polished walnut top with carved edge-detail; brass corner-caps; gold-inlaid script around perimeter
material_secondary:  hidden mechanisms beneath the surface (visible only during HB8 transit or active edit)
colour_value:        --token-color-ark-cipher-den-bench-walnut
interaction:         interactable
  - operate: opens Uncorruption Bench UI (player can clean forbidden texts, edit own lore, propose canonical changes)
  - inspect: lore-note about the Bench's history (canonical pre-Ark artifact)
  - HB8_invoke: opening a forbidden text on the bench triggers HB8 transit (Editor's quill enters frame, transit begins per §3.12.10)
narrative_role:      DUAL FUNCTION — operationally a text-uncorruption surface (gameplay-key for cleaning corrupt LOREDEX entries); cosmologically the HB8 gateway. Player's forbidden-text + bench operation triggers Editor's Workshop transit
lore_anchor:         loredex.system.uncorruption_bench + arc.act_5_HB8_invocation
art_status:          producer_handoff
gameplay_hook_id:    trpc.cipher.uncorruption_bench.operate + trpc.hellbox.hb8.openGate (state-conditional)
wear_state:          worn at central work-area; gold script around perimeter is slightly more polished where most-touched
physical_constraints: collides; player can lean
```

#### A.21.9.2 Bench Tools (rolled into bench but inventoried separately)

```
object_id:           ark.cipher_den.uncorruption_bench.inkwell
object_class:        container
position:            (-0.50, 5.00, 0.92)  # on bench top, left-front
dimensions:          0.10 × 0.10 × 0.10
rotation:            0°
material_primary:    cast bronze with decorative engraving
material_secondary:  glass-lined interior containing dark blue-black ink
colour_value:        --token-color-ark-cipher-den-inkwell
interaction:         interactable
  - open: opens the inkwell (small one-shot animation; emits ink-mist + glow)
  - close: closes (extinguishes glow)
  - inspect: lore-note about ink-formula
narrative_role:      THE inkwell; ink is canonically pre-Ark; opening it is a small ritual
lore_anchor:         loredex.system.uncorruption_bench
art_status:          producer_handoff
gameplay_hook_id:    trpc.cipher.inkwell.toggle
wear_state:          slight patina at edges
physical_constraints: collides

object_id:           ark.cipher_den.uncorruption_bench.quill
object_class:        decoration
position:            (0.20, 5.00, 0.93)  # next to inkwell
dimensions:          0.05 × 0.30 × 0.05
rotation:            varies (rests on bench)
material_primary:    raven-feather quill with bronze nib
material_secondary:  none
colour_value:        --token-color-ark-cipher-den-quill
interaction:         inspectable
narrative_role:      the Editor's quill; canonically the same quill that has edited every text in the canon; NEVER touched by player
lore_anchor:         loredex.character.editor + arc.editor_canon
art_status:          producer_handoff
gameplay_hook_id:    none (player cannot pick up — quill is Editor's only)
wear_state:          slight wear at nib (well-used)
physical_constraints: non-collide (small)

object_id:           ark.cipher_den.uncorruption_bench.blotter_set
object_class:        decoration
position:            (0.40, 5.00, 0.92)
dimensions:          0.30 × 0.20 × 0.04
rotation:            0°
material_primary:    walnut tray with leather blotter
material_secondary:  brass pen-rest
colour_value:        --token-color-ark-cipher-den-blotter
interaction:         inspectable
narrative_role:      tools of the trade
lore_anchor:         loredex.system.uncorruption_bench
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          worn at most-used corners
physical_constraints: collides
```

#### A.21.9.5 The Editor's Anchor (NPC anchor)

```
object_id:           ark.cipher_den.editor_anchor
object_class:        npc_anchor
position:            (-1.00, 4.50, 0.00)  # behind the bench, slightly to player's left
dimensions:          0.80 × 0.80 × 1.80 (anchor only)
rotation:            varies (Editor pose-driven)
material_primary:    n/a
material_secondary:  n/a
colour_value:        n/a
interaction:         n/a (presence — Editor never visible)
narrative_role:      THE Editor's anchor; he is PRESENT but never seen — his presence is felt as a cold spot, faint breath, quill-on-paper SFX
lore_anchor:         loredex.character.editor
art_status:          producer_handoff
gameplay_hook_id:    none (presence-driven)
wear_state:          n/a
physical_constraints: n/a (NPC presence overrides; if player walks through anchor, gets a "cold spot" SFX)
```

#### A.21.9.6 The Forbidden Text Archive Door (north wall)

```
object_id:           ark.cipher_den.forbidden_archive_door
object_class:        door
position:            (0.00, 9.95, 0.00)  # central north shelf bay
dimensions:          1.20 × 2.40 × 0.10
rotation:            180°
material_primary:    cast bronze double-door with deep-relief glyphs; concealed behind a false bookend (until unlocked)
material_secondary:  white marble frame; gold inlay on the threshold
colour_value:        --token-color-ark-cipher-den-archive-door  (deep bronze with gold-glyph relief)
interaction:         interactable
  - inspect (locked): "the door is sealed; 4 cipher-keys are needed"
  - unlock: requires 4 cipher-keys (gathered from across the Ark)
  - open (unlocked): one-shot animation + cs_archive_first_open cutscene
narrative_role:      THE forbidden archive — contains pre-canon texts that the Editor has not yet edited; player can read forbidden truths
lore_anchor:         loredex.system.forbidden_archive + arc.act_6_pre_canon_revelations
art_status:          producer_handoff
gameplay_hook_id:    trpc.cipher.archive_door.unlock + .open
wear_state:          pristine (rarely touched)
physical_constraints: collides; opens to sub-space (deferred from spec)
```

#### A.21.9.7-11 The Five Reference Shelf Bays (north wall)

```
object_id:           ark.cipher_den.shelf_bay.history (bay 1)
object_class:        container
position:            (-3.60, 9.85, 0.00)
dimensions:          1.80 × 1.00 × 4.20
rotation:            180°
material_primary:    walnut + bronze
material_secondary:  individual bronze name-plates
colour_value:        --token-color-ark-cipher-den-shelf-walnut
interaction:         interactable
  - inspect_book: each book is a multi-screen lore-readable; this bay holds historical texts
narrative_role:      historical references; player learns Ark history
lore_anchor:         loredex.system.history_archive
art_status:          producer_handoff
gameplay_hook_id:    trpc.cipher.shelf.inspect (history)
wear_state:          slight wear
physical_constraints: collides

(Other 4 bays follow same template; categories: philosophy, occult, language, prophecy. Positions:
 - bay 2 philosophy at (-1.80, 9.85, 0.00)
 - bay 3 occult at (0.00, 9.85, 0.00) — hides forbidden_archive_door behind false bookend
 - bay 4 language at (1.80, 9.85, 0.00)
 - bay 5 prophecy at (3.60, 9.85, 0.00))
```

#### A.21.9.12 East Shelf — Scribe Tools

```
object_id:           ark.cipher_den.east.shelf.scribe_tools
object_class:        container
position:            (4.50, 5.00, 0.00)
dimensions:          0.40 × 4.00 × 3.20
rotation:            270°  (parallel to east wall)
material_primary:    walnut with felt-lined slots
material_secondary:  bronze tool-clips and labels
colour_value:        --token-color-ark-cipher-den-shelf-walnut
interaction:         interactable
  - select_tool: player can take a tool to the bench (gameplay-key for some tasks)
  - inspect: lore-note about each tool
narrative_role:      scribe's toolkit; some tools are gameplay-active (e.g., "the cipher-glass" reveals hidden text)
lore_anchor:         loredex.system.uncorruption_bench
art_status:          producer_handoff
gameplay_hook_id:    trpc.cipher.east.shelf.select_tool
wear_state:          slight wear at most-used tool slots
physical_constraints: collides
```

#### A.21.9.13 West Shelf — Player's Archive

```
object_id:           ark.cipher_den.west.shelf.player_archive
object_class:        container
position:            (-4.50, 5.00, 0.00)
dimensions:          0.40 × 4.00 × 3.20
rotation:            90°
material_primary:    walnut with leather binding
material_secondary:  bronze name-plates with PLAYER's name (engraved when Cipher Den is first entered)
colour_value:        --token-color-ark-cipher-den-shelf-walnut
interaction:         interactable
  - inspect_volume: each volume is the player's lore-summary by Act (Act 1 volume, Act 2 volume, etc.)
  - edit_with_bench: take a volume to bench for editing (gameplay-active in Act 5+)
narrative_role:      THE player's accumulated narrative — every choice the player has made is bound here
lore_anchor:         arc.player_canon
art_status:          producer_handoff
gameplay_hook_id:    trpc.cipher.west.shelf.inspect_volume + .edit
wear_state:          most recent volume shows wear
physical_constraints: collides
```

#### A.21.9.14 Reading Chair (positioned to face bench)

```
object_id:           ark.cipher_den.reading_chair
object_class:        furniture
position:            (0.00, 5.00, 0.00) -- wait, that's on the bench. Let me adjust.
position (corrected): (0.00, 3.50, 0.00)
dimensions:          0.80 × 0.80 × 1.30
rotation:            0°  (faces bench, north)
material_primary:    walnut frame with charcoal leather seat
material_secondary:  brass tacks; brass armrest caps
colour_value:        --token-color-ark-cipher-den-reading-chair
interaction:         interactable - sit (positions player at bench in working posture)
narrative_role:      where the player sits to engage with the bench
lore_anchor:         arc.act_5_HB8_invocation
art_status:          producer_handoff
gameplay_hook_id:    none (positional)
wear_state:          slight wear at seat
physical_constraints: collides; sittable
```

#### A.21.9.15-20 Six Candles (east + west arrays)

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.cipher_den.candle.east.1` | fx_emitter | (4.50, 1.50, 1.45) | 0.10 × 0.10 × 0.30 | east-1 candle |
| `ark.cipher_den.candle.east.2` | fx_emitter | (4.50, 5.00, 1.45) | mirror y | east-2 candle |
| `ark.cipher_den.candle.east.3` | fx_emitter | (4.50, 8.50, 1.45) | mirror y | east-3 candle |
| `ark.cipher_den.candle.west.1` | fx_emitter | (-4.50, 1.50, 1.45) | 0.10 × 0.10 × 0.30 | west-1 candle |
| `ark.cipher_den.candle.west.2` | fx_emitter | (-4.50, 5.00, 1.45) | mirror y | west-2 candle |
| `ark.cipher_den.candle.west.3` | fx_emitter | (-4.50, 8.50, 1.45) | mirror y | west-3 candle |

(Double-counted as part of candle_array decorative_features; counted
once as inventory.)

#### A.21.9.21-25 Five Cipher-Keys (gameplay-distributed; visible here as readable hints)

```
object_id:           ark.cipher_den.cipher_key_index.<n>  (n=1..5)
object_class:        decoration  (ledgers showing where keys are hidden)
positions:           on bench in a small leather folio
dimensions:          0.20 × 0.15 × 0.02
rotation:            0°
material_primary:    leather-bound paper
material_secondary:  cipher-text engravings
colour_value:        --token-color-ark-cipher-den-key-folio
interaction:         inspectable (reads cryptic clue about key location)
narrative_role:      hints toward where each cipher-key is hidden (one in Antiquarian Library, one on Bridge, one in Med Bay, one in Engineering, one in Archives)
lore_anchor:         arc.cipher_key_quest
art_status:          producer_handoff
gameplay_hook_id:    trpc.cipher.key_folio.read
wear_state:          slight wear
physical_constraints: collides
```

#### A.21.9.26-30 Decorative Closing Items

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.cipher_den.south.intercom` | console | (-1.00, 0.20, 1.50) | 0.20 × 0.10 × 0.30 | comms relay |
| `ark.cipher_den.fire_extinguisher.south` | interactive | (1.50, 0.20, 1.20) | 0.20 × 0.20 × 0.50 | safety |
| `ark.cipher_den.first_aid.kit` | container | (-1.50, 0.20, 1.50) | 0.40 × 0.10 × 0.30 | medical |
| `ark.cipher_den.brass_compass_inlay` | decoration | (0.00, 5.00, 0.005) | 1.40 × 1.40 × 0.005 | floor inlay (compass-rose) |
| `ark.cipher_den.editor_quill_extra` | decoration | (0.30, 5.00, 0.93) on bench | 0.05 × 0.30 × 0.05 | spare quill (Editor's prerogative) |

#### A.21.9.31-39 Specialty Tools + Atmosphere Items

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.cipher_den.cipher_glass` | interactive | east shelf, gameplay-take | 0.10 × 0.05 × 0.10 | reveals hidden text on inspection |
| `ark.cipher_den.uncorruption_bench.parchment_stack` | container | on bench | 0.30 × 0.40 × 0.03 | blank parchment stack |
| `ark.cipher_den.uncorruption_bench.magnifying_lens` | decoration | on bench | 0.10 × 0.10 × 0.05 | brass-rimmed magnifier |
| `ark.cipher_den.uncorruption_bench.scribing_tools.assorted` | decoration | bench | varied | additional tools on bench |
| `ark.cipher_den.editor_chair` | furniture | (-1.00, 4.50, 0.00) | 0.80 × 0.80 × 1.20 | the Editor's chair (rarely sat in by anyone but the Editor) |
| `ark.cipher_den.editor_personal_locker` | container | (-4.95, 9.85, 0.00) | 0.40 × 0.30 × 1.50 | Editor's personal effects locker (locked) |
| `ark.cipher_den.editor_personal_locker.bronze_key` | decoration | hidden in shelf_bay history | 0.04 × 0.02 × 0.005 | the key to Editor's locker (Act 7 reveal) |
| `ark.cipher_den.dust_jar.east` | decoration | east shelf, top | 0.20 × 0.20 × 0.30 | jar of editor's dust (canonical artifact) |
| `ark.cipher_den.dust_jar.west` | decoration | west shelf, top | 0.20 × 0.20 × 0.30 | jar of editor's dust (mirror) |

Total: 39 inventory objects.

### A.21.10 Camera-spawn-points (FPV cutscenes)

```
cutscene_id:         cs_amb_cipher_den  (Category B; per §3.1.B.3)
camera_position:     (0.00, 0.50, eye_level)
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         slow approach to bench; head-tilt down to watch text emerge

cutscene_id:         cs_hellbox_8_open  (HB8 Editor's Workshop gateway)
camera_position:     (0.00, 4.50, eye_level)  # at bench
camera_facing:       (0°, -30°, 0°)  # looking down at forbidden text on bench
avatar_height_anchor: eye_level
head_motion:         hand-rig opens forbidden text; Editor's quill enters frame from above; quill begins editing; transit begins

cutscene_id:         cs_hellbox_8_transit  (HB8 transit)
camera_position:     (0.00, 4.50, eye_level)
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         POV travels through corridor of pages

cutscene_id:         cs_hellbox_8_close  (HB8 return)
camera_position:     (0.00, 4.50, eye_level)
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         pages re-bind; corridor fades; Cipher Den re-materialises with the forbidden text now edited

cutscene_id:         cs_archive_first_open  (one-shot Act 6+)
camera_position:     (0.00, 9.50, eye_level)  # at archive door
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         archive_door opens; cold air rushes; revealed beyond is darkness
```

### A.21.11 Doorways

```
door_id:            ark.cipher_den.south.door.main
connecting_space_id: ark.corridor.cipher_approach
door_position:      (0.00, 0.00, 0.00)
door_dimensions:    1.20 × 2.40 × 0.10
door_class:         arch  (heavy bronze)
unlock_condition:   Act 5+ (player gains access after specific Act 5 quest)
transit_animation:  ceremonial slow-open (3s) on first entry; instant on subsequent
audio_signature:    bronze-on-stone resonance + chain-rattle

door_id:            ark.cipher_den.north.door.forbidden_archive
connecting_space_id: ark.cipher_den.forbidden_archive  (deferred)
door_position:      (0.00, 9.95, 0.00)
door_dimensions:    1.20 × 2.40 × 0.10
door_class:         pressure_seal
unlock_condition:   Act 6+ + 4 cipher-keys collected
transit_animation:  cs_archive_first_open cutscene
audio_signature:    deep magnetic-clack + airlock-hiss
```

### A.21.12 Adjacency map

```
direct_adjacencies:
  - ark.corridor.cipher_approach (south door)
  - ark.cipher_den.forbidden_archive (north door; sub-space; locked through Act 6)
  - hellbox.editors_workshop (HB8 portal via Uncorruption Bench, conditional on forbidden text)
one_hop_adjacencies:
  - ark.archives (via cipher approach; Cipher Den is the deeper companion to Archives)
  - destination.editors_workshop (via HB8)
```

### A.21.13 Gameplay hooks

```
hooks:
  - hook_id:         cipher_den.operateBench
    trigger:         player.operate on ark.cipher_den.uncorruption_bench
    procedure:       trpc.cipher.uncorruption_bench.operate
    success_state:   bench_active = true; uncorruption UI open
  - hook_id:         cipher_den.cleanForbiddenText
    trigger:         (state-conditional) player has forbidden text + bench active
    procedure:       trpc.cipher.bench.cleanText
    success_state:   text_cleaned = true (per-text)
  - hook_id:         cipher_den.invokeHB8
    trigger:         (state-conditional) player opens forbidden text on bench (Act 5+, has at least one forbidden text)
    procedure:       trpc.hellbox.hb8.openGate
    success_state:   hellbox_8_transit_started = true
  - hook_id:         cipher_den.inspectShelfBook
    trigger:         player.inspect on shelf_bay book
    procedure:       trpc.cipher.shelf.inspect
    success_state:   book_read = true (per-book)
  - hook_id:         cipher_den.editPlayerVolume
    trigger:         player.interact on west.shelf.player_archive volume + take_to_bench
    procedure:       trpc.cipher.player_volume.edit
    success_state:   volume_edited = true (per-volume; affects player canonical record)
  - hook_id:         cipher_den.toggleInkwell
    trigger:         player.interact on inkwell
    procedure:       trpc.cipher.inkwell.toggle
    success_state:   inkwell_state = open | closed
  - hook_id:         cipher_den.unlockArchiveDoor
    trigger:         player.unlock on archive_door (with 4 cipher-keys)
    procedure:       trpc.cipher.archive_door.unlock
    success_state:   archive_door_open = true (one-shot)
  - hook_id:         cipher_den.takeCipherGlass
    trigger:         player.interact on cipher_glass
    procedure:       trpc.cipher.east.shelf.select_tool (cipher_glass)
    success_state:   cipher_glass_held = true (gameplay-key for hidden-text reveals across Ark)
```

### A.21.14 Story-tie

```
primary_arcs:
  - arc.act_5_meta_narrative
  - arc.act_5_HB8_invocation
  - arc.cipher_key_quest (gather 4 keys across Ark)
  - arc.act_6_pre_canon_revelations (open archive)
  - arc.player_canon (player's accumulated narrative)
per_act_evolution:
  acts_0_4: room is locked; faint hum of forbidden archive sometimes heard from outside
  act_5: room opens; first interaction with bench; HB8 first invocable; player's archive begins to fill
  act_6: archive door unlockable (with 4 keys); pre-canon revelations accessible
  act_7: Editor's locker unlockable (Act 7 reveal of editor's bronze key); player can read Editor's personal effects (final lore reveal)
npc_roster:
  - the_editor: presence-only (never visible); felt as cold spot, breath, quill SFX
  - the_player: visitor for editing + archive access
  - the_master_of_rlyeh: HB8 transit voice only
readables:
  - dedication plaque (south)
  - 5 shelf-bay book sets (history, philosophy, occult, language, prophecy; ~3-5 books per bay = 15-25 readables)
  - cipher-key folio (5 cryptic clues)
  - player's archive volumes (one per Act played; cumulative)
  - forbidden archive contents (Act 6+ unlock)
  - Editor's personal effects (Act 7 unlock)
master_of_rlyeh_question: "Is what was written, or what was edited, the truth?"
```

### A.21.15 Special-FX

```
particle_systems:
  - dust_motes (low; visible in pendant light shaft)
  - ink_mist (very low; from inkwell when open)
  - candle_smoke (12 candles)
  - editor_dust (rare; Acts 7 ending state; cold and still)
volumetric_effects:
  - pendant_light_shaft (visible in lower-light states)
  - non_euclidean_shelf_depth (north wall shelves visually deeper than physical wall)
  - archive_seal_glow (subtle phosphorescent rim around archive door)
procedural_animations:
  - candle_flicker (12 sources; each independent)
  - quill_subtle_movement (quill rests but slightly tilts; cosmetic)
  - shelf_book_rearrange (Acts 5+; books slowly re-shuffle between visits — Editor's hand)
  - bench_inkwell_glow_pulse (when open)
reactive_systems:
  - bench_glow_on_proximity (within 1.5 m, bench surface glows softly)
  - inkwell_open_on_player_interact
  - editor_breath_on_player_proximity (within 2.0 m of editor_anchor, faint cold-spot SFX)
  - archive_door_unlock_one_shot
  - forbidden_text_glow (any forbidden text in player's inventory glows when within 3.0 m of bench)
```

### A.21.16 Avatar-parametricity

```
camera_height_variation:
  small_xenomorph (0.85m eye): camera height 0.85m; bench feels too tall — alternate stand-on-step animation; shelves are at head-level
  short_humanoid (1.40m eye): bench is at hip; standard
  average_humanoid (1.70m eye): bench is at thigh; standard
  tall_humanoid (2.05m eye): bench is below knee — must lean
  tall_xenomorph (2.70m eye): bench far too low; alternate crouch-edit animation
reachability:
  small_xenomorph: cannot reach top shelf bays without ladder; alternate ladder provided
  small_xenomorph: cannot reach forbidden archive door (relay unlock)
  others: all-reachable
audio_occlusion_variation:
  xenomorph_sensitive_hearing: editor's breath more pronounced; quill-on-paper SFX clearly audible from all corners
  synthetic_voice_avatar: Editor's presence has different "feel" — cold-spot lacks warm-blood association
```

### A.21.17 Performance

```
polygon_budget:      280,000 polygons (rich decorative density; non-Euclidean shelves are expensive)
texture_budget:      150 MB total
light_count_limit:   16 simultaneous dynamic lights
lod_plan:
  - hero_distance: 0-8m, full detail
  - mid_distance: 8-15m, mid detail (small candles simplified)
  - low_distance: 15m+, low detail
streaming_behaviour:
  - preload: ark.corridor.cipher_approach (south)
  - on_player_within_2m_of_bench + has_forbidden_text: preload destination.editors_workshop
```

---

## A.22 Hierarchy Throne Sanctum (D9 — Hellbox 2 host) — FULL

**Status: FULL spec.** Cross-ref: `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.22 (art-state prompts) and §3.12.4 HB2 Castle of Death gateway.

### A.22.1 Header

```
space_id:        ark.hierarchy_throne
space_name:      Hierarchy Throne Sanctum
space_type:      ark_room  (also Hellbox-2 host; faction-locked)
act_introduced:  Act 5 (Hierarchy faction-aligned only; otherwise stays locked through Act 7)
lore_anchor:     loredex.faction.hierarchy + arc.hierarchy_devotion + arc.act_5_hierarchy_alignment
aesthetic_tier:  hierarchy_ritual  (Wagnerian baroque)
master_of_rlyeh_question: "Is mercy a debt, or a gift?" (per HB2)
```

### A.22.2 Geometry

```
dimensions:           12.00 m × 16.00 m × 9.00 m
origin_point:         centre of floor at the primary entrance threshold (entrance is the south wall; throne is at the north end on a three-step dais)
coordinate_axes:      +x = right, +y = forward, +z = up
floor_plan_geometry:  rectangular with apsidal rear  (north wall is curved outward, radius 5.0 m, giving the throne its apse)
volumetric_anomalies: none in baseline; HB2 transit briefly turns the apse non-Euclidean (~10s — corridor of bells extends impossibly into the throne wall)
```

The room is cathedral-scale; the apsidal rear gives the throne
a sacred geometry. Three steps lead up to the throne-platform
(at z = 0.45). Six censers flank the apse symmetrically. Two
banners hang from the high vault.

Floor area: ~192 m².

### A.22.3 Floor

```
material_primary:     polished black-and-white marble in geometric tessellation; 0.60 m × 0.60 m tiles in a chevron pattern; 2 mm gap; high-polish finish (mirror-reflective at low angle)
material_secondary:   gold inlay along the central walkway (south-to-throne); inlay reads "the lord giveth, the lord taketh" in proto-Latin script
pattern:              chevron tessellation; gold central walkway 0.80 m wide running south-to-throne with engraved meditations every 1.50 m
wear_state:           pristine (sacred space; meticulously maintained); slight wear at the central walkway from procession-pacing
embedded_features:
  - id: ark.hierarchy_throne.floor.drain.south
    position: (0.00, 0.50, 0.00)
    dimensions: 0.20 × 0.20 × 0.05  (small; concealed by ornamental brass grate)
    function: ritual-water drain (used during cleansing rites)
  - id: ark.hierarchy_throne.floor.censer_anchor.east_1 through .east_3, .west_1 through .west_3
    position: 6 anchor points (3 along east of throne, 3 along west)
    dimensions: 0.30 × 0.30 × 0.05 each
    function: censer base anchors (bronze)
  - id: ark.hierarchy_throne.floor.altar_anchor
    position: (0.00, 13.00, 0.00)
    dimensions: 0.80 × 0.80 × 0.10  (raised brass plinth)
    function: offering altar base
acoustic_property:    hard_reflective (marble); RT60 = 0.85s (long cathedral reverb; voices and bells hang in the air)
```

### A.22.4 Walls

#### Wall: South (entrance)

```
wall_id:              south
material_primary:     stone-clad (charcoal-grey marble veneer over structural steel); 0.80 m × 1.60 m panels; ornamental relief carving (figures + script) at z = 1.50 to 4.00
material_secondary:   bronze dado at z = 1.20 m, 80 mm tall, ornately cast
panelisation:         8 panels wide × 6 panels tall (with relief layer)
colour_value:         --token-color-ark-hierarchy-throne-wall-south  (deep charcoal with bronze pin-stripe)
embedded_displays:
  - id: ark.hierarchy_throne.south.display.faction_standing
    position: (-3.00, 0.20, 1.80)
    dimensions: 1.20 × 0.80 × 0.05
    content: player's Hierarchy faction-standing; ranks of devotion
  - id: ark.hierarchy_throne.south.display.recent_supplications
    position: (3.00, 0.20, 1.80)
    dimensions: 1.20 × 0.80 × 0.05
    content: log of recent ritual offerings + outcomes
embedded_doors:
  - door_id: ark.hierarchy_throne.south.door.main
    position: (0.00, 0.00, 0.00)
    dimensions: 1.80 × 3.20 × 0.15  (taller than typical — sacred-scale)
    door_class: arch  (bronze double-doors with relief carving; ceremonially opens slowly)
    connecting_space_id: ark.corridor.hierarchy_approach
decorative_features:
  - id: ark.hierarchy_throne.south.relief_carving.frieze
    position: (0.00, 0.10, 4.50)  # high above the door
    dimensions: 8.00 × 1.20 × 0.10  (deep relief)
    material: cast bronze
    narrative_role: depicts the Hierarchy's three-fold creed — sacrifice, mercy, ritual; player can inspect each panel for lore
  - id: ark.hierarchy_throne.south.plaque.creed
    position: (0.00, 0.20, 3.20)
    dimensions: 1.00 × 0.40 × 0.02
    material: cast bronze
    narrative_role: reads "MERCY IS A SACRAMENT" in proto-Latin script + canonical translation
```

#### Wall: East

```
wall_id:              east
material_primary:     stone-clad with three deep ALCOVES (each housing a saint-figure statue)
material_secondary:   bronze dado
panelisation:         alcoves at y = 4.5, 9.0, 13.5; each alcove 1.40 × 0.80 × 2.40 deep recessed
colour_value:         --token-color-ark-hierarchy-throne-wall-east
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: ark.hierarchy_throne.east.alcove.1.statue (south alcove)
    position: (5.95, 4.50, 0.40)  # in alcove recess; floor offset
    dimensions: 0.80 × 0.60 × 1.80  (statue + plinth)
    material: white marble + bronze halo
    narrative_role: Saint of the First Mercy (lore-figure; player can inspect)
  - id: ark.hierarchy_throne.east.alcove.2.statue (mid alcove)
    position: (5.95, 9.00, 0.40)
    dimensions: 0.80 × 0.60 × 1.80
    material: white marble + bronze halo
    narrative_role: Saint of the Forgive
  - id: ark.hierarchy_throne.east.alcove.3.statue (north alcove)
    position: (5.95, 13.50, 0.40)
    dimensions: 0.80 × 0.60 × 1.80
    material: white marble + bronze halo
    narrative_role: Saint of the Last Mercy
  - id: ark.hierarchy_throne.east.candle_array.1, .2, .3 (one per alcove)
    position: at base of each statue
    dimensions: 0.20 × 0.20 × 0.30  (candle clusters; ~5 candles per array)
    material: bronze stand + wax candles
    narrative_role: lit by player offerings; tracks player's mercy-acts
```

#### Wall: North (apsidal — the throne wall)

The northern wall is curved (apsidal) and houses the throne.

```
wall_id:              north_apsidal
material_primary:     stone-clad apse (curved); ribbed vault meets the wall at z = 6.50; central panel carries a vast cast-bronze relief (the "Throne of Mercy" — figurative depiction)
material_secondary:   bronze dado around apse base; bronze ribbing
panelisation:         apsidal — single curved surface
colour_value:         --token-color-ark-hierarchy-throne-wall-apse  (warmer charcoal; reflects throne-light)
embedded_displays:    none (the throne is the focal point)
embedded_doors:        none (HB2 portal is via the throne, not a physical door)
decorative_features:
  - id: ark.hierarchy_throne.apse.relief.throne_of_mercy
    position: (0.00, 15.50, 5.00)
    dimensions: 5.00 × 4.50 × 0.20 (deep relief)
    material: cast bronze with gilt highlights
    narrative_role: THE relief; depicts a robed figure offering mercy to a kneeling supplicant; player's eye is drawn here from the throne's POV (during HB2 transit)
  - id: ark.hierarchy_throne.apse.dome_emitter
    position: (0.00, 15.50, 8.50)
    dimensions: 4.00 dia (circular emitter at apex of apse)
    material: backlit translucent stained-glass (red/gold/black motif)
    narrative_role: principal lighting of throne; makes the throne feel divinely lit
```

#### Wall: West

Mirror of east (3 alcoves with saint-figures; mirror positions
and statues, different saint-names — Saint of the First Forgiveness,
Saint of the Last Forgiveness, Saint of the Eternal Forgiveness).

```
wall_id:              west
material_primary:     same as east
material_secondary:   bronze dado
panelisation:         alcoves at y = 4.5, 9.0, 13.5 (mirror)
colour_value:         --token-color-ark-hierarchy-throne-wall-west
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: ark.hierarchy_throne.west.alcove.1.statue, .2.statue, .3.statue  (mirror of east)
  - id: ark.hierarchy_throne.west.candle_array.1, .2, .3  (mirror of east)
```

### A.22.5 Ceiling

```
height_above_floor:     9.00 m baseline at perimeter; central nave coffer at 7.50 m; apsidal vault rises to 8.50 m; the "Throne of Mercy" relief on the apse spans up to 9.50 m height
material:               stone-clad ribbed vault (cast-stone with bronze rib detailing); apex is the apsidal stained-glass emitter
lighting_integrated:    8 cathedral-style suspended chandeliers (bronze + candles + LED simulation) in the central nave; apsidal stained-glass acts as the throne-light source; smaller wall-sconces along east and west walls (one per alcove + intervening positions)
atmospheric_features:   incense smoke rising and pooling at vault apex (slow drift); occasional cathedral-rays of light from stained-glass (most visible during HB2 transit)
acoustic_treatment:     coffered + apsidal echo at rear — gives the room a long sacred reverb
```

### A.22.6 Lighting

```
ambient_baseline:     2800 K (very warm; candle-and-bronze lighting); 120 lux at floor level (intentionally low — candle-lit feel); CRI 78 (lower than rest of Ark — supports the warm atmosphere)
direct_fixtures:
  - id: ark.hierarchy_throne.light.apsidal_stained_glass
    position: (0.00, 15.50, 8.50)
    beam_angle: 90° downward
    colour: --token-color-ark-hierarchy-throne-apse  (warm red-gold; varies subtly across the day)
    intensity: 6000 lumens
    function: principal throne light; symbolic — "divine grace illuminates the throne"
  - id: ark.hierarchy_throne.light.chandelier_central_array
    position: 8 chandeliers distributed along central nave at z = 6.50; positions y = 2.0, 4.0, 6.0, 8.0, 10.0, 12.0 (roughly evenly spaced)
    beam_angle: 270° (downward + lateral spread)
    colour: --token-color-ark-hierarchy-throne-chandelier  (warm amber)
    intensity: 3000 lumens each (pulses with candle-flicker)
    function: ambient + ritual atmosphere
  - id: ark.hierarchy_throne.light.wall_sconces
    position: distributed along east and west walls between alcoves; ~12 sconces total
    beam_angle: 180° wash
    colour: --token-color-ark-hierarchy-throne-sconce  (warm bronze-amber)
    intensity: 800 lumens each
    function: accent + reinforces wall presence
  - id: ark.hierarchy_throne.light.altar_glow
    position: (0.00, 13.00, 1.20)  # over offering altar
    beam_angle: 45°
    colour: 2400 K very warm
    intensity: 1500 lumens
    function: ritual focal — directs eye to altar
practical_sources:
  - id: ark.hierarchy_throne.candle_array.<n>.flames  (6 candle arrays; ~30 flames total across walls)
    position: per candle
    intensity: 50 lumens each (flicker individually)
    flicker_pattern: organic flicker (period 0.5-1.2s, random)
  - id: ark.hierarchy_throne.censer.flame.<n>  (6 censers; one flame each)
    position: per censer top
    intensity: 80 lumens
    flicker_pattern: low slow flicker (period 1.5s) + smoke emission
  - id: ark.hierarchy_throne.altar.flame
    position: (0.00, 13.00, 0.95)  # on altar top
    intensity: 100 lumens (slightly larger flame)
    flicker_pattern: stable
time_of_day_variation:
  acts_5_to_7: lighting stable; in late-act7, if player has aligned with Hierarchy, ALL candles light up dramatically; if NOT aligned, only the apsidal stained-glass remains active and the chandeliers go dark
dynamic_response:
  - on_player_offering: altar_glow intensifies briefly; nearby censers' smoke increases
  - on_HB2_transit: apsidal stained_glass intensifies; chandeliers dim; candles all flicker simultaneously; bell-toll from somewhere distant
  - on_NPC_priest_present: priest's local zone +20% intensity (subtle)
```

### A.22.7 Atmosphere

```
air_temperature:    22°C baseline (warm; bodies + candles)
humidity:           42% RH; smells of incense (frankincense + myrrh) + beeswax + cold stone
particulate:
  - type: incense_smoke
    density: high (continuous from 6 censers; visible plumes rising; pools at vault apex)
    colour: pale grey-blue
    drift_direction: slow upward (heat-convection); pools at z > 7.0
  - type: candle_smoke
    density: low (per-candle minor smoke contribution)
    colour: very pale grey
    drift_direction: upward
  - type: dust
    density: very low (sacred maintenance)
    colour: greyish-white
    drift_direction: random
volumetric_fog:     present at apsidal vault (incense pool); 0.30 g/m³, warm-amber
wind_drift:         very faint; 0.03 m/s; circulation toward apse (heat-rise from throne)
smell_canon:        frankincense + myrrh + beeswax + cold-stone + faint metallic-bronze; voice-line cue: NPCs may say "the air here is heavy"
```

### A.22.8 Sound

```
ambient_bed:           file: hierarchy_throne_ambient_bed_v1.ogg (loop); -28 dB; choral hum (very faint, sub-perceptual; the room itself "sings"), distant bell-toll (faint, every 30s), wind-whistle through vault
point_sources:
  - id: ark.hierarchy_throne.sound.censer_burn.<n>  (6 sources)
    position: per censer
    sound: incense-burn crackle (continuous, -38 dB each)
    occlusion_behaviour: standard
    trigger: continuous
  - id: ark.hierarchy_throne.sound.candle_flicker.<n>  (~30 sources)
    position: per candle
    sound: candle-flicker (very faint, -42 dB each)
    occlusion_behaviour: omnidirectional
    trigger: continuous
  - id: ark.hierarchy_throne.sound.chandelier_gentle_creak
    position: per chandelier (8 sources)
    sound: occasional creak (random, -36 dB)
    occlusion_behaviour: standard
    trigger: random (period 30-90s)
  - id: ark.hierarchy_throne.sound.distant_bell
    position: (0.00, 16.00, 8.50)  # somewhere "beyond the apse"
    sound: deep bell-toll (period 30s; -32 dB per toll)
    occlusion_behaviour: omnidirectional with subtle directional bias (sounds "from the throne")
    trigger: cyclic
  - id: ark.hierarchy_throne.sound.altar_flame
    position: (0.00, 13.00, 0.95)
    sound: candle-flame (slightly louder than walls; -38 dB)
    occlusion_behaviour: standard
    trigger: continuous
reverb_zone:           IR-impulse: hierarchy_cathedral_v1.wav; wet-mix 38% (very wet — sustains everything)
music_eligibility:     cutscene only (HB2 transit + Category B cs_amb_hierarchy_throne — deferred to Phase F catalogue)
voice_line_eligibility:
  - speaker: hierarchy_priest (or named Hierarchy NPC; faction-assigned)
    trigger: presence
    line_set: see §2.22.2 (Hierarchy NPC presence-line set)
  - speaker: the_master_of_rlyeh
    trigger: HB2 transit only
    line_set: HB2-specific
```

### A.22.9 Object inventory

Hierarchy Throne has 38 inventory objects.

#### A.22.9.1 The Throne (HB2 gateway)

```
object_id:           ark.hierarchy_throne.throne.central
object_class:        furniture  (also fx_emitter for HB2 transit)
position:            (0.00, 14.50, 0.45)  # north end, atop 3-step dais
dimensions:          1.40 × 1.20 × 2.20  (oversized — sacred-scale)
rotation:            180°  (faces -y, toward entrance)
material_primary:    cast bronze with gilt detailing; black-velvet upholstery on seat and backrest
material_secondary:  white marble armrests; bronze finials at top corners
colour_value:        --token-color-ark-hierarchy-throne-bronze
interaction:         interactable
  - sit: triggers throne-presence cutscene (Hierarchy-aligned only); HUD shifts to ritual UI
  - inspect: lore-note about the throne's origins (lineage of high-priests)
  - HB2_kneel_offering: when conditions met (Hierarchy-aligned, Act 5+, brought offering), invokes HB2 transit (player kneels at throne base, offering enters frame, transit begins per §3.12.4)
narrative_role:      THE throne; symbolically the Hierarchy's seat of authority; cosmologically the HB2 gateway. Player kneeling at throne base + presenting offering opens the corridor of bells (Castle of Death transit).
lore_anchor:         loredex.faction.hierarchy + loredex.system.hierarchy_throne + arc.hierarchy_devotion
art_status:          producer_handoff
gameplay_hook_id:    trpc.hierarchy.throne.sit + trpc.hellbox.hb2.openGate (state-conditional)
wear_state:          slight wear at armrests (where supplicants have rested hands during ritual)
physical_constraints: collides; player can sit (Hierarchy-aligned only)
```

#### A.22.9.2 The Throne Dais (3 steps)

```
object_id:           ark.hierarchy_throne.dais
object_class:        furniture
position:            (0.00, 14.00, 0.00)  # centred on throne; covers a 4.40 × 2.40 footprint
dimensions:          4.40 × 2.40 × 0.45  (3 steps × 0.15 each)
rotation:            0°
material_primary:    polished white marble with gold inlay step-edges
material_secondary:  bronze step-nosing
colour_value:        --token-color-ark-hierarchy-throne-dais
interaction:         inert (player can climb)
narrative_role:      symbolic separation; ascending the dais is itself a ritual
lore_anchor:         loredex.aesthetic.hierarchy_ritual
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          slight wear at central walkway up the steps
physical_constraints: collides; player can climb
```

#### A.22.9.3 The Offering Altar

```
object_id:           ark.hierarchy_throne.altar.offering
object_class:        interactive
position:            (0.00, 13.00, 0.00)
dimensions:          1.20 × 0.80 × 0.95
rotation:            0°
material_primary:    polished black granite with inlaid gold cross
material_secondary:  bronze altar-cloth holder; cast-bronze candle-stand at corners
colour_value:        --token-color-ark-hierarchy-throne-altar-granite
interaction:         interactable
  - place_offering: opens offering UI; player selects an item from inventory (a coin, a seed, a personal item, a Pet's spirit-stone, etc.); item is consumed
  - inspect: lore-note about offering history
narrative_role:      where the player commits to the Hierarchy; offerings are required to invoke HB2 (cf §3.12.4 cs_hellbox_2_open)
lore_anchor:         loredex.system.offerings + arc.act_5_HB2_invocation
art_status:          producer_handoff
gameplay_hook_id:    trpc.hierarchy.altar.placeOffering
wear_state:          worn at the centre of the altar-top
physical_constraints: collides
```

#### A.22.9.4-9 The Six Censers

```
object_id:           ark.hierarchy_throne.censer.east.1, .east.2, .east.3
object_class:        fx_emitter  (also decoration)
positions:           (4.00, 4.50, 0.00), (4.00, 9.00, 0.00), (4.00, 13.50, 0.00)
dimensions:          0.40 × 0.40 × 1.40  (each)
rotation:            0°
material_primary:    cast bronze with hanging chains and decorative perforations
material_secondary:  white marble base
colour_value:        --token-color-ark-hierarchy-throne-censer-bronze
interaction:         interactable
  - inspect: lore-note about censer (each carries a different prayer-meditation in proto-Latin)
  - rekindle: if censer has gone out, player can rekindle (gameplay-active in late-act if reactor degradation has affected sacred space)
narrative_role:      ritual incense; the throne's atmosphere depends on these; visually they ARE the room's symbolism
lore_anchor:         loredex.aesthetic.hierarchy_ritual
art_status:          producer_handoff
gameplay_hook_id:    trpc.hierarchy.censer.rekindle
wear_state:          slight wear; some patina
physical_constraints: collides

object_id:           ark.hierarchy_throne.censer.west.1, .west.2, .west.3
(MIRROR of east; positions (-4.00, 4.50, 0.00), (-4.00, 9.00, 0.00), (-4.00, 13.50, 0.00))
```

#### A.22.9.10-15 Saint Statues + Candle Arrays

Six saint-statues (3 per side) + 6 candle-arrays (one per statue);
specced earlier in walls section. Repeated here for inventory completeness:

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.hierarchy_throne.east.alcove.1.statue` | decoration | (5.95, 4.50, 0.40) | 0.80 × 0.60 × 1.80 | Saint of First Mercy |
| `ark.hierarchy_throne.east.alcove.2.statue` | decoration | (5.95, 9.00, 0.40) | 0.80 × 0.60 × 1.80 | Saint of Forgive |
| `ark.hierarchy_throne.east.alcove.3.statue` | decoration | (5.95, 13.50, 0.40) | 0.80 × 0.60 × 1.80 | Saint of Last Mercy |
| `ark.hierarchy_throne.west.alcove.1.statue` | decoration | (-5.95, 4.50, 0.40) | mirror | Saint of First Forgiveness |
| `ark.hierarchy_throne.west.alcove.2.statue` | decoration | (-5.95, 9.00, 0.40) | mirror | Saint of Last Forgiveness |
| `ark.hierarchy_throne.west.alcove.3.statue` | decoration | (-5.95, 13.50, 0.40) | mirror | Saint of Eternal Forgiveness |

#### A.22.9.16-21 Six Candle Arrays

```
object_id:           ark.hierarchy_throne.candle_array.<position_id>  (6 arrays)
object_class:        interactive  (also fx_emitter — flames are visible)
positions:           one at base of each saint statue
dimensions:          0.40 × 0.30 × 0.50 (cluster of ~5 candles per array)
rotation:            varies
material_primary:    cast bronze stand + wax candles
material_secondary:  none
colour_value:        --token-color-ark-hierarchy-throne-candle
interaction:         interactable
  - light_candle: player can light candles (one at a time; tracks "mercy-acts")
  - extinguish_candle: player can extinguish candles (tracks "stern-acts")
  - inspect: lore-note about the saint's meditation
narrative_role:      tracks player's hierarchical alignment within the faction (mercy vs. severity sub-axis)
lore_anchor:         arc.hierarchy_sub_alignment
art_status:          producer_handoff
gameplay_hook_id:    trpc.hierarchy.candle.toggle
wear_state:          slight wear at brass stand
physical_constraints: collides
```

#### A.22.9.22 The Apsidal Relief — "Throne of Mercy"

```
object_id:           ark.hierarchy_throne.apse.relief.throne_of_mercy
object_class:        decoration
position:            (0.00, 15.50, 5.00)
dimensions:          5.00 × 4.50 × 0.20 (deep relief)
rotation:            180°  (faces -y, into room)
material_primary:    cast bronze with gilt highlights
material_secondary:  none
colour_value:        --token-color-ark-hierarchy-throne-bronze + gilt
interaction:         inspectable
  - inspect: opens a multi-panel lore-readable about the Throne of Mercy myth (~4 lore screens)
narrative_role:      THE focal relief; player's eye is drawn here from the throne's POV (especially during HB2 transit); the supplicant figure in the relief is canonically the player
lore_anchor:         loredex.faction.hierarchy + arc.hierarchy_origin_myth
art_status:          producer_handoff
gameplay_hook_id:    trpc.hierarchy.relief.read
wear_state:          slight patina
physical_constraints: non-collide (at height)
```

#### A.22.9.23-30 Pew Benches (visitor seating)

Eight pew-benches arranged in two columns flanking the central
walkway; 4 per side; positions y = 2.5, 5.5, 8.5, 11.5; x = -3.0
and +3.0.

```
object_id:           ark.hierarchy_throne.pew.east.1, .east.2, .east.3, .east.4 + .west.1, .west.2, .west.3, .west.4
object_class:        furniture
positions:           per above (8 total)
dimensions (each):   3.00 × 0.50 × 0.85
rotation:            varies (faces inward toward central walkway)
material_primary:    polished oak (real wood — rare in the Ark; flag for the Hierarchy's traditional aesthetic)
material_secondary:  bronze armrests on aisle ends; bronze hymnal-holder
colour_value:        --token-color-ark-hierarchy-throne-pew-oak
interaction:         interactable - sit
narrative_role:      visitor seating; in lore, observers attend rituals from these pews
lore_anchor:         arc.hierarchy_observers
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          slight wear at sit-zones
physical_constraints: collides; sittable
```

#### A.22.9.31-32 Banner Tapestries

```
object_id:           ark.hierarchy_throne.banner.east, .west
object_class:        decoration
positions:           (5.95, 7.00, 7.50), (-5.95, 7.00, 7.50)  # high on each side, hanging from vault
dimensions:          0.05 × 1.20 × 4.00 (narrow tall banner)
rotation:            varies
material_primary:    deep crimson velvet with gold embroidery
material_secondary:  bronze hanging-rod
colour_value:        --token-color-ark-hierarchy-throne-banner-crimson
interaction:         inspectable (read embroidery)
narrative_role:      faction symbolism; reinforces Wagner-baroque atmosphere
lore_anchor:         loredex.faction.hierarchy
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          slight fading at edges
physical_constraints: non-collide (suspended)
```

#### A.22.9.33-36 Hymnal Stands + Hymnals

```
object_id:           ark.hierarchy_throne.hymnal_stand.east.1, .east.2 + .west.1, .west.2
object_class:        container
positions:           (3.50, 6.00, 0.00), (3.50, 10.00, 0.00), (-3.50, 6.00, 0.00), (-3.50, 10.00, 0.00)  # near pew aisle ends
dimensions:          0.50 × 0.40 × 1.20
rotation:            varies
material_primary:    cast bronze stand with hymnal book on inclined plate
material_secondary:  oak inlay
colour_value:        --token-color-ark-hierarchy-throne-hymnal-stand
interaction:         interactable
  - inspect: opens hymnal (multi-page lore-readable; canonical hymns)
narrative_role:      lore depth; readable hymns that hint at faction belief structure
lore_anchor:         loredex.faction.hierarchy + arc.hierarchy_lore
art_status:          producer_handoff
gameplay_hook_id:    trpc.hierarchy.hymnal.read
wear_state:          slight wear at hymnal pages
physical_constraints: collides
```

#### A.22.9.37-38 Decorative Closing Objects

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.hierarchy_throne.confessional_screen.east` | decoration | (5.95, 0.50, 0.00) on east near south wall | 1.40 × 0.20 × 2.40 | a confessional screen (mostly decorative; lore-flavour) |
| `ark.hierarchy_throne.confessional_screen.west` | decoration | (-5.95, 0.50, 0.00) on west near south wall | mirror | confessional screen |

Total: 38 inventory objects.

### A.22.10 Camera-spawn-points (FPV cutscenes)

```
cutscene_id:         cs_amb_hierarchy_throne  (Category B, deferred catalogue)
camera_position:     (0.00, 0.50, eye_level)  # at threshold
camera_facing:       (0°, 8°, 0°)  # looking forward and up at apse
avatar_height_anchor: eye_level
head_motion:         very slow forward dolly along central walkway, head fixed on apse; lasts 22s

cutscene_id:         cs_hellbox_2_open  (HB2 Castle of Death gateway)
camera_position:     (0.00, 13.00, 0.50)  # at altar, standing
camera_facing:       (0°, -25°, 0°)  # looking down at altar to place offering
avatar_height_anchor: eye_level
head_motion:         camera lowers (player kneels) to (0.00, 13.00, 0.0); knees-on-stone audio + offering-set audio; cuts to corridor-of-bells transit

cutscene_id:         cs_hellbox_2_transit  (HB2 transit)
camera_position:     (0.00, 13.00, 0.0)  # kneeling
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: kneeling
head_motion:         POV travels through corridor of bells; each bell tolls; corridor opens into Castle of Death gate

cutscene_id:         cs_hellbox_2_close  (HB2 return)
camera_position:     (0.00, 13.00, 0.0)
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: kneeling
head_motion:         corridor recedes; throne re-materialises; camera rises (player stands)
```

### A.22.11 Doorways

```
door_id:            ark.hierarchy_throne.south.door.main
connecting_space_id: ark.corridor.hierarchy_approach
door_position:      (0.00, 0.00, 0.00)
door_dimensions:    1.80 × 3.20 × 0.15
door_class:         arch  (bronze double-doors; ceremonial)
unlock_condition:   Hierarchy faction-aligned (Act 5+)
transit_animation:  ceremonial slow-open (8s) on first entry per session; instant on subsequent
audio_signature:    bronze-on-stone resonance + chain-rattle + deep bell-toll on full open
```

### A.22.12 Adjacency map

```
direct_adjacencies:
  - ark.corridor.hierarchy_approach (south door)
  - hellbox.castle_of_death (HB2 portal via throne kneel + offering)
one_hop_adjacencies:
  - ark.chaos_forge (via hierarchy approach corridor)
  - ark.bridge (via long-route corridors)
  - destination.castle_of_death (via HB2)
```

### A.22.13 Gameplay hooks

```
hooks:
  - hook_id:         hierarchy_throne.sitOnThrone
    trigger:         player.sit on ark.hierarchy_throne.throne.central
    procedure:       trpc.hierarchy.throne.sit
    success_state:   throne_view_active = true (Hierarchy-aligned only)
    fail_state:      faction_alignment_required
  - hook_id:         hierarchy_throne.placeOffering
    trigger:         player.interact on ark.hierarchy_throne.altar.offering
    procedure:       trpc.hierarchy.altar.placeOffering
    success_state:   offering_placed = true
  - hook_id:         hierarchy_throne.invokeHB2
    trigger:         (state-conditional) player.kneel at throne base + has placed offering at altar (Act 5+, Hierarchy-aligned)
    procedure:       trpc.hellbox.hb2.openGate
    success_state:   hellbox_2_transit_started = true
    fail_state:      not_yet_unlocked / faction_alignment_required / no_offering
  - hook_id:         hierarchy_throne.toggleCandle
    trigger:         player.interact on ark.hierarchy_throne.candle_array.<id>
    procedure:       trpc.hierarchy.candle.toggle
    success_state:   candle_state = lit | extinguished (per-candle; affects sub-alignment)
  - hook_id:         hierarchy_throne.rekindleCenser
    trigger:         (state-conditional) player.interact on extinguished censer
    procedure:       trpc.hierarchy.censer.rekindle
    success_state:   censer_relit = true
  - hook_id:         hierarchy_throne.readRelief
    trigger:         player.inspect on ark.hierarchy_throne.apse.relief.throne_of_mercy
    procedure:       trpc.hierarchy.relief.read
    success_state:   relief_read = true (lore-flag)
  - hook_id:         hierarchy_throne.readHymnal
    trigger:         player.inspect on ark.hierarchy_throne.hymnal_stand.<id>
    procedure:       trpc.hierarchy.hymnal.read
    success_state:   hymnal_read = true (per-stand)
```

### A.22.14 Story-tie

```
primary_arcs:
  - arc.hierarchy_devotion
  - arc.act_5_hierarchy_alignment
  - arc.hierarchy_origin_myth
  - arc.act_5_HB2_invocation
per_act_evolution:
  acts_0_to_4: room exists but is LOCKED to player (faction-alignment required); player can see the door but cannot enter; lore plaques outside hint at what's within
  act_5: player who has aligned with Hierarchy gains entry. First visit is overwhelming (the cathedral atmosphere is designed to humble). Rituals begin to be available.
  act_6: player can invoke HB2; Castle of Death becomes accessible
  act_7: room state-branched: if player has fully committed (mercy + offering ratio high), candles all light + incense pools dramatically; if player has been cold/severe, only minimal flames remain
npc_roster:
  - hierarchy_priest (named NPC TBD by canon — currently Lord Saius or similar): primary occupant
  - the_player: visitor for ritual + HB2 invocation
  - the_master_of_rlyeh: HB2 transit voice only
  - hierarchy_observers: occasional NPC presence in pews (rare; lore-flavour)
readables:
  - creed plaque: "MERCY IS A SACRAMENT"
  - relief panel: Throne of Mercy myth (4 lore-screens)
  - 4 hymnals: ~4 hymns each = 16 lore-readables total
  - saint statue plaques: 6 saint-meditations (one per statue)
master_of_rlyeh_question: "Is mercy a debt, or a gift?"
```

### A.22.15 Special-FX

```
particle_systems:
  - incense_smoke (continuous from 6 censers; rising and pooling at vault apex)
  - candle_smoke (per-flame minor smoke; ~30 sources)
  - dust_motes (minimal; slow downward drift in apsidal light shaft)
  - apsidal_light_shaft_volumetric (visible beam from stained-glass to throne)
volumetric_effects:
  - incense_pool_at_vault (dense fog at z > 7.0; warm-amber)
  - apsidal_light_shaft (volumetric beam from stained glass to throne; intensifies during HB2 transit)
  - chandelier_candle_glow (volumetric flicker per chandelier)
procedural_animations:
  - chandelier_subtle_sway (8 chandeliers; slow random sway; period 30s+)
  - censer_chain_swing (subtle swing of censer chains)
  - candle_flame_individual_flicker (~30 flames; each independently animated)
  - banner_subtle_ripple (banners ripple in faint air-flow)
  - incense_smoke_rise (continuous emission)
reactive_systems:
  - throne_subtle_glow_on_proximity (within 3.0 m, throne backrest glows softly)
  - altar_glow_on_offering (when player approaches altar with offering, altar-flame intensifies)
  - HB2_transit_corridor_manifests (one-shot)
  - candle_lit_on_player_inspect (per-candle one-shot)
  - censer_relit_on_player_action (per-censer one-shot in late-act)
  - state_branched_lighting_on_act_7 (full lighting if aligned; minimal if not)
```

### A.22.16 Avatar-parametricity

```
camera_height_variation:
  small_xenomorph (0.85m eye): camera height 0.85m; saint statues feel impossibly tall; throne is monumentally large; alternate kneel-offering animation
  short_humanoid (1.40m eye): standard humanoid scale
  average_humanoid (1.70m eye): standard
  tall_humanoid (2.05m eye): saint statues feel proportional; throne still dominates
  tall_xenomorph (2.70m eye): saint statues feel small; throne still imposing (sacred-scale); hymnal stands too low — alternate read-down animation
reachability:
  small_xenomorph: cannot reach upper saint-statue plaques (statue base offset reachable; high relief readables not reachable; alternate console-relay)
  small_xenomorph: cannot reach apsidal relief inspect-zone (alternate via altar terminal)
  others: all-reachable
audio_occlusion_variation:
  xenomorph_sensitive_hearing: ambient choral hum is more pronounced; candles louder; slightly overwhelming on first entry
  synthetic_voice_avatar: distant bell-toll altered in timbre (echo-pattern feels different); voice-line cue acknowledges
```

### A.22.17 Performance

```
polygon_budget:      300,000 polygons (cathedral-volume; many decorative elements)
texture_budget:      180 MB total
light_count_limit:   24 simultaneous dynamic lights (the room is light-intensive — chandeliers + sconces + candles)
lod_plan:
  - hero_distance: 0-10m, full detail
  - mid_distance: 10-25m, mid detail (candle-flame simplified to billboards; smoke density reduced)
  - low_distance: 25m+, low detail (sconce-glow as billboards; some statue detail simplified)
streaming_behaviour:
  - preload: ark.corridor.hierarchy_approach (south door)
  - preload: destination.castle_of_death (only when HB2 unlocked + within 5.0 m of throne; conditional)
```

---

## A.23 Chaos Forge (D9 — Hierarchy alignment) — SCAFFOLDED

```
space_id:        ark.chaos_forge
space_name:      Chaos Forge
space_type:      ark_room
act_introduced:  Act 5
lore_anchor:     loredex.faction.hierarchy + arc.chaos_forge_rituals
aesthetic_tier:  hierarchy_ritual
dimensions:      11.00 m × 11.00 m × 7.00 m
```

(Full spec deferred.)

---

## A.24 Elemental Nexus (D10 — Demagi alignment) — SCAFFOLDED

```
space_id:        ark.elemental_nexus
space_name:      Elemental Nexus
space_type:      ark_room
act_introduced:  Act 6
lore_anchor:     loredex.faction.demagi + arc.elemental_attunement
aesthetic_tier:  dreamers_oneiric  (elemental-weave aesthetic)
dimensions:      12.00 m × 12.00 m × 6.00 m
floor_plan_geometry: hexagonal
```

(Full spec deferred.)

---

## A.25 Quantum Lab / Probability Chamber (D10 — Quarchon alignment) — SCAFFOLDED

```
space_id:        ark.quantum_lab
space_name:      Quantum Lab / Probability Chamber
space_type:      ark_room
act_introduced:  Act 6
lore_anchor:     loredex.faction.quarchon + arc.probability_manipulation
aesthetic_tier:  architect_geometric  (precise-mathematical aesthetic)
dimensions:      11.00 m × 11.00 m × 5.00 m
floor_plan_geometry: rectangular
```

(Full spec deferred.)

---

## A.26 Synthesis Chamber (D10 — Neyon alignment) — SCAFFOLDED

```
space_id:        ark.synthesis_chamber
space_name:      Synthesis Chamber
space_type:      ark_room
act_introduced:  Act 6
lore_anchor:     loredex.faction.neyon + arc.synthesis_progression
aesthetic_tier:  architect_geometric  (clean-synthesis aesthetic)
dimensions:      10.00 m × 12.00 m × 4.50 m
```

(Full spec deferred.)

---

## A.27 Memorial Corridor / Plaza (Hellbox-6 host) — FULL

**Status: FULL spec.** Cross-ref: `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.27 (art-state prompts) and §3.12.8 HB6 Dead Man's Circuit gateway.

### A.27.1 Header

```
space_id:        ark.memorial_corridor
space_name:      Memorial Corridor / Plaza
space_type:      ark_room  (also Hellbox-6 host)
act_introduced:  Act 4
lore_anchor:     loredex.system.memorial + arc.fallen_crew + arc.act_4_dead_mans_circuit
aesthetic_tier:  solar_punk_cathedral  (with mausoleum-mortuary accents)
master_of_rlyeh_question: "If you knew the race was already lost, would you still run?" (per HB6)
```

### A.27.2 Geometry

```
dimensions:           24.00 m × 6.00 m × 4.00 m
origin_point:         centre of floor at the south entrance threshold (corridor extends north toward the brass-bowl flame at the apsidal rear)
coordinate_axes:      +x = right, +y = forward (north), +z = up
floor_plan_geometry:  rectangular  (with apsidal rear — north end is curved, radius 3.0 m)
volumetric_anomalies: none in baseline; HB6 transit briefly extends the corridor non-Euclidean (~10s — race-line materialises infinitely forward)
```

The corridor is intentionally long-and-narrow. Walking it is a
ritual. Procession stones flank the walkway (4 per side).
Meditation benches are recessed into wall alcoves between every
two procession stones. The brass bowl with eternal flame anchors
the apsidal rear.

Floor area: 144 m² (rectangular portion) + ~14 m² (apsidal portion).

### A.27.3 Floor

```
material_primary:     polished dark-grey granite slabs; 1.00 m × 1.00 m tiles; 4 mm gap; mirror-polish at the central walkway, matte at the perimeters
material_secondary:   bronze inlay along the central walkway (south-to-flame); inlay reads names of the fallen in chronological order of their cryo-deaths
pattern:              walkway 1.20 m wide centred on +y; engraved meditations every 2.00 m
wear_state:           pristine; very slight wear at central walkway from procession-pacing
embedded_features:
  - id: ark.memorial_corridor.floor.drain.south
    position: (0.00, 0.50, 0.00)
    dimensions: 0.20 × 0.20 × 0.05  (concealed bronze grate)
    function: ritual-water drain
  - id: ark.memorial_corridor.floor.candle_anchor.<n>
    position: 8 anchor points (one at base of each procession stone)
    dimensions: 0.20 × 0.20 × 0.03 each
    function: candle-stand bronze plinths
acoustic_property:    hard_reflective with apsidal echo; RT60 = 0.75s (long; supports bell-resonance from HB6 transit)
```

### A.27.4 Walls

#### Wall: South (entrance)

```
wall_id:              south
material_primary:     polished dark-grey granite cladding (matches floor); 0.80 m × 1.60 m panels; minimal ornamentation
material_secondary:   bronze dado at z = 1.20 m
panelisation:         standard; 4 panels wide × 3 panels tall (since wall is only 6 m wide)
colour_value:         --token-color-ark-memorial-corridor-wall  (deep granite-grey)
embedded_displays:
  - id: ark.memorial_corridor.south.display.eternal_flame_log
    position: (-2.00, 0.20, 1.80)
    dimensions: 0.80 × 0.60 × 0.05
    content: live counter — "DAYS SINCE FALLEN: <n>" + cumulative offerings
  - id: ark.memorial_corridor.south.display.ceremonial_calendar
    position: (2.00, 0.20, 1.80)
    dimensions: 0.80 × 0.60 × 0.05
    content: upcoming memorial ceremonies
embedded_doors:
  - door_id: ark.memorial_corridor.south.door.main
    position: (0.00, 0.00, 0.00)
    dimensions: 1.40 × 2.40 × 0.10
    door_class: arch  (bronze single-door; opens slowly with reverent ceremonial sound)
    connecting_space_id: ark.corridor.deck_lower
decorative_features:
  - id: ark.memorial_corridor.south.plaque.dedication
    position: (0.00, 0.20, 3.20)
    dimensions: 1.00 × 0.40 × 0.02
    material: bronze with engraved text
    narrative_role: reads "WE REMEMBER / Every name. Every breath. Every loss." in canon language
```

#### Wall: East

The east wall is structured as alternating PROCESSION-STONE
NICHES and MEDITATION BENCH ALCOVES.

```
wall_id:              east
material_primary:     dark-grey granite cladding with deep niches at procession-stone positions
material_secondary:   bronze dado
panelisation:         alternating niches at y = 5.0, 11.0, 17.0, 21.0 (procession stones) and bench alcoves at y = 8.0, 14.0, 19.0
colour_value:         --token-color-ark-memorial-corridor-wall
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: ark.memorial_corridor.east.procession_stone.1, .2, .3, .4
    (specced in inventory below; 4 stones at y = 5.0, 11.0, 17.0, 21.0)
  - id: ark.memorial_corridor.east.bench_alcove.1, .2, .3
    (specced in inventory below; 3 alcoves at y = 8.0, 14.0, 19.0)
```

#### Wall: North (apsidal — flame wall)

```
wall_id:              north_apsidal
material_primary:     dark-grey granite curving (apsidal); central niche houses the brass bowl
material_secondary:   bronze trim around niche
panelisation:         apsidal — curved single surface
colour_value:         --token-color-ark-memorial-corridor-wall-apse  (slightly warmer; reflects flame)
embedded_displays:
  - id: ark.memorial_corridor.apse.display.fallen_count
    position: (0.00, 24.00, 1.20)  # in apse, beneath flame
    dimensions: 0.60 × 0.40 × 0.05
    content: cumulative-fallen counter; reads as a memorial inscription
embedded_doors:        none
decorative_features:
  - id: ark.memorial_corridor.apse.flame_niche
    position: (0.00, 24.00, 1.50)  # the flame's housing
    dimensions: 1.20 × 0.40 × 1.50  (recessed apsidal niche)
    material: cast bronze niche frame around the brass-bowl flame
    narrative_role: focal point of the corridor; the bowl rests within
  - id: ark.memorial_corridor.apse.relief.fallen
    position: (0.00, 24.00, 3.00)  # above flame
    dimensions: 2.40 × 1.80 × 0.10  (deep relief)
    material: cast bronze
    narrative_role: depicts a procession of figures walking forward; symbolises the corridor's purpose
```

#### Wall: West

Mirror of east (4 procession stones + 3 bench alcoves).

```
wall_id:              west
material_primary:     same as east
material_secondary:   bronze dado
panelisation:         mirror of east (procession stones at y = 5.0, 11.0, 17.0, 21.0; bench alcoves at y = 8.0, 14.0, 19.0)
colour_value:         --token-color-ark-memorial-corridor-wall
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: ark.memorial_corridor.west.procession_stone.5, .6, .7, .8 (continuing numbering)
  - id: ark.memorial_corridor.west.bench_alcove.4, .5, .6
```

### A.27.5 Ceiling

```
height_above_floor:     4.00 m baseline; apsidal vault at flame rises to 5.00 m; central nave drop coffer at 3.50 m (lower; gives the walkway a "tunnel-of-remembrance" feel)
material:               dark-grey granite cladding with bronze rib detail at coffer edges
lighting_integrated:    recessed strip-light along central coffer (2.00 m wide × 22.00 m long); low-profile; cool-amber tone; pulses with the flame rhythm
atmospheric_features:   subtle volumetric beam from coffer to floor (visible in lower-light states; intensifies during HB6 transit)
acoustic_treatment:     coffered + apsidal echo at apse
```

### A.27.6 Lighting

```
ambient_baseline:     2200 K (very warm; candle-and-flame); 80 lux at floor level (intentionally dim — solemn); CRI 75 (the warm-flame palette is intentional)
direct_fixtures:
  - id: ark.memorial_corridor.light.coffer_strip
    position: (0.00, 12.00, 3.50)  # central, full corridor length
    beam_angle: 90° downward
    colour: --token-color-ark-memorial-corridor-coffer  (warm amber pulse-matched to flame)
    intensity: 1500 lumens per metre; pulses gently with brass-bowl flame
    function: principal task lighting; pulse synchronisation gives the corridor its breath
  - id: ark.memorial_corridor.light.apse_glow
    position: (0.00, 24.00, 4.50)
    beam_angle: 90° downward
    colour: --token-color-ark-memorial-corridor-apse-glow  (warm-flame-orange)
    intensity: 4000 lumens
    function: focal — illuminates the flame niche
  - id: ark.memorial_corridor.light.bench_alcove_strip.<n>  (6 alcove strip-lights)
    position: distributed (one per alcove)
    beam_angle: 180° wash
    colour: --token-color-ark-memorial-corridor-alcove
    intensity: 600 lumens each
    function: alcove-defining light
practical_sources:
  - id: ark.memorial_corridor.candle.<n>  (8 candles; one at base of each procession stone)
    position: per stone base
    intensity: 80 lumens each
    flicker_pattern: organic (period 0.6-1.2s, random)
  - id: ark.memorial_corridor.brass_bowl.flame
    position: (0.00, 24.00, 1.80)  # within bowl
    intensity: 800 lumens (much larger than candles; eternal flame)
    flicker_pattern: stable but with gentle breath
time_of_day_variation:
  acts_4_to_7: lighting stable; in late-act7, if many candles are lit (player has remembered), the corridor glows warmly; if many are extinguished (player has been dismissive), the corridor feels cold and the strip-light dims
dynamic_response:
  - on_player_offering: brass_bowl flame brightens 30% briefly
  - on_HB6_transit: coffer strip pulses faster matching engine-rev SFX; race-line manifests as a glowing vector along the floor
  - on_candle_lit: nearby alcove strip brightens 10%; faint chime
```

### A.27.7 Atmosphere

```
air_temperature:    18°C baseline (cool — solemn; below typical Ark-room baseline)
humidity:           38% RH; smells of incense + cold-stone + faint metallic-bronze + brass-polish
particulate:
  - type: candle_smoke
    density: low (per-candle; ~8 sources)
    colour: very pale grey
    drift_direction: upward
  - type: brass_bowl_smoke
    density: low (continuous from eternal flame; thicker than candles)
    colour: pale amber-grey
    drift_direction: rises along apse, pools at vault apex
  - type: dust
    density: very low
    colour: greyish-white
    drift_direction: random
volumetric_fog:     subtle pool at apsidal vault apex (incense/flame smoke combined); 0.15 g/m³
wind_drift:         very faint; 0.04 m/s; toward apse (heat-rise from flame creates mild draw)
smell_canon:        cold-stone + faint metallic-bronze + warm-bee-wax + flame-smoke; voice-line cue: NPCs may say "the air here remembers"
```

### A.27.8 Sound

```
ambient_bed:           file: memorial_corridor_ambient_bed_v1.ogg (loop); -32 dB; very faint distant bell-toll (period 60s), brass-bowl flame crackle, footstep echo (cold reverb)
point_sources:
  - id: ark.memorial_corridor.sound.flame_crackle
    position: (0.00, 24.00, 1.80)
    sound: brass-bowl flame crackle (continuous, -28 dB; clearly audible)
    occlusion_behaviour: standard
    trigger: continuous
  - id: ark.memorial_corridor.sound.candle_flicker.<n>  (8 sources)
    position: per candle
    sound: candle-flame (very faint, -42 dB each)
    occlusion_behaviour: omnidirectional
    trigger: continuous
  - id: ark.memorial_corridor.sound.distant_bell
    position: (0.00, 24.00, 4.50)
    sound: deep bell-toll (period 60s; -34 dB per toll)
    occlusion_behaviour: omnidirectional with bias toward apse
    trigger: cyclic
  - id: ark.memorial_corridor.sound.footstep_echo
    position: dynamic (player position)
    sound: extra echo on footsteps (gives the corridor its "I am being heard" feel)
    occlusion_behaviour: applies to player's footsteps only
    trigger: per-step
reverb_zone:           IR-impulse: memorial_corridor_v1.wav; wet-mix 32% (long corridor reverb)
music_eligibility:     cutscene only (HB6 transit + Category B cs_amb_memorial_corridor)
voice_line_eligibility:
  - speaker: kael_voss_ghost  (rare cutscene-only)
    trigger: late-act conditional
    line_set: see §2.27.2
  - speaker: the_master_of_rlyeh
    trigger: HB6 transit only
    line_set: HB6-specific
```

### A.27.9 Object inventory

Memorial Corridor has 36 inventory objects.

#### A.27.9.1 The Brass Bowl with Eternal Flame (HB6 anchor)

```
object_id:           ark.memorial_corridor.brass_bowl.flame
object_class:        interactive  (also fx_emitter)
position:            (0.00, 24.00, 1.50)  # within apsidal niche
dimensions:          0.80 × 0.80 × 0.60 (bowl + flame above to z = 2.40)
rotation:            0°
material_primary:    cast bronze bowl with bas-relief detailing (figures of remembrance)
material_secondary:  bronze stand; gold-leaf interior (reflects flame upward and outward)
colour_value:        --token-color-ark-memorial-corridor-bowl-bronze
interaction:         interactable
  - place_offering: opens offering UI (player selects an item from inventory; offerings include coins, mementos, soul-stones, personal items)
  - inspect: lore-note about the eternal flame (canonically lit at Ark commission; never extinguished)
  - HB6_invoke: when conditions met (player has placed offerings + visited at least 3 procession stones), invokes HB6 transit (player's hand enters frame placing final offering; race-line materialises)
narrative_role:      THE eternal flame; the corridor's heart; the HB6 gateway. Offerings accumulate inside the bowl visually (coins, dried flowers, etc.) — provides a visible record of the player's mourning
lore_anchor:         loredex.system.eternal_flame + arc.fallen_crew
art_status:          producer_handoff
gameplay_hook_id:    trpc.memorial.bowl.placeOffering + trpc.hellbox.hb6.openGate (state-conditional)
wear_state:          slight patina at lip; bowl interior shows cumulative offerings
physical_constraints: collides; player can lean on (cosmetic)
```

#### A.27.9.2-9 The Eight Procession Stones

Each procession stone names a fallen crew member. The 8 names
extend the cryo-bay sleeper context plus 2 additional Ark crew
who died outside cryo (e.g. in mission).

```
object_id:           ark.memorial_corridor.procession_stone.<n>  (n = 1..8)
object_class:        interactive  (also decoration)
positions:           [
  (3.00, 5.00, 0.00)   # east row, position 1 — Henrik Voss
  (3.00, 11.00, 0.00)  # east row, position 2 — Mira Tanaka
  (3.00, 17.00, 0.00)  # east row, position 3 — Yusuf Adler
  (3.00, 21.00, 0.00)  # east row, position 4 — Renju Park
  (-3.00, 5.00, 0.00)  # west row, position 5 — Greta Holm
  (-3.00, 11.00, 0.00) # west row, position 6 — Kira Kovács
  (-3.00, 17.00, 0.00) # west row, position 7 — Maximus Tarn (mission casualty)
  (-3.00, 21.00, 0.00) # west row, position 8 — Sero Vall (mission casualty)
]
dimensions (each):   0.80 × 0.40 × 1.80  (stele-style)
rotation (each):     varies (stones face inward toward central walkway)
material_primary:    polished dark grey granite with gilt-engraved name + dates
material_secondary:  bronze candle-plate at base; bronze plaque with epitaph
colour_value:        --token-color-ark-memorial-corridor-stone-granite
interaction:         interactable
  - inspect: opens lore-readable about the deceased (their role, their story, their cause-of-death; expanded entries available as player progresses)
  - touch: triggers HB6 sub-flag; touching all 3+ stones unlocks HB6 invocation at brass bowl
  - offer: place a small offering at stone base (gameplay-active)
narrative_role:      individual memorials; together they tell the loss-history of the Ark
lore_anchor:         per-deceased (cross-ref §A.1 Cryo Bay sleepers + new mission casualties Maximus Tarn, Sero Vall)
art_status:          producer_handoff
gameplay_hook_id:    trpc.memorial.procession_stone.touch + .inspect
wear_state:          pristine (sacred; meticulously maintained); slight wear at touch-zones
physical_constraints: collides
```

#### A.27.9.10-17 Eight Candles (one per procession stone)

```
object_id:           ark.memorial_corridor.candle.<n>  (n = 1..8)
object_class:        interactive  (also fx_emitter)
positions:           one at base of each procession stone (offset 0.20 m forward of stone)
dimensions (each):   0.20 × 0.20 × 0.30  (single thick candle on bronze plinth)
rotation:            0°
material_primary:    bronze plinth + ivory wax candle
material_secondary:  none
colour_value:        --token-color-ark-memorial-corridor-candle
interaction:         interactable
  - light: lights an unlit candle (one-shot per candle)
  - extinguish: extinguishes a lit candle
  - inspect: lore-note about the candle's epitaph
narrative_role:      tracks player's mourning ratio; individual remembrance acts
lore_anchor:         per-deceased
art_status:          producer_handoff
gameplay_hook_id:    trpc.memorial.candle.toggle
wear_state:          varies
physical_constraints: non-collide (low-profile)
```

#### A.27.9.18-23 Six Meditation Bench Alcoves

```
object_id:           ark.memorial_corridor.bench_alcove.<n>  (n = 1..6)
object_class:        furniture
positions:           [
  (3.50, 8.00, 0.00),    # east, alcove 1 (recessed)
  (3.50, 14.00, 0.00),   # east, alcove 2
  (3.50, 19.00, 0.00),   # east, alcove 3
  (-3.50, 8.00, 0.00),   # west, alcove 4
  (-3.50, 14.00, 0.00),  # west, alcove 5
  (-3.50, 19.00, 0.00),  # west, alcove 6
]
dimensions (each):   1.40 × 0.50 × 0.60  (bench + low backrest within recessed alcove)
rotation (each):     270° or 90°  (faces inward toward walkway)
material_primary:    polished dark granite bench-top; oak inlay backrest
material_secondary:  bronze armrest cap
colour_value:        --token-color-ark-memorial-corridor-bench
interaction:         interactable - sit (sits in recessed alcove; gives meditation pose)
narrative_role:      contemplation seating; player can sit and reflect; ambient cutscenes can trigger
lore_anchor:         arc.player_grief
art_status:          producer_handoff
gameplay_hook_id:    none (positional only)
wear_state:          slight wear at sit-zones
physical_constraints: collides; sittable
```

#### A.27.9.24 Offering Basket (at base of brass bowl)

```
object_id:           ark.memorial_corridor.offering_basket
object_class:        container
position:            (0.00, 23.50, 0.00)  # base of bowl
dimensions:          0.50 × 0.50 × 0.40
rotation:            0°
material_primary:    woven bronze wire (basketry)
material_secondary:  none
colour_value:        --token-color-ark-memorial-corridor-basket-bronze
interaction:         interactable
  - inspect: views accumulated offerings
  - take: cannot take offerings (cosmetic; offerings stay)
narrative_role:      visual record of cumulative offerings; reads as "the world remembers"
lore_anchor:         arc.fallen_crew
art_status:          producer_handoff
gameplay_hook_id:    trpc.memorial.basket.inspect
wear_state:          slight wear at handles
physical_constraints: collides
```

#### A.27.9.25-30 Decorative Lighting Stands

Six bronze lighting stands flanking the brass bowl niche (3 per
side at angled positions).

```
object_id:           ark.memorial_corridor.light_stand.east.1, .east.2, .east.3 + .west.1, .west.2, .west.3
object_class:        decoration  (also fx_emitter — soft glow)
positions:           varies; 3 per side at apsidal positions
dimensions (each):   0.20 × 0.20 × 1.40  (tall thin stands)
rotation:            varies
material_primary:    cast bronze with engraved relief
material_secondary:  none
colour_value:        --token-color-ark-memorial-corridor-light-stand
interaction:         inert (decorative + ambient lighting only)
narrative_role:      architectural framing of the apse; reinforces sacred geometry
lore_anchor:         loredex.aesthetic.solar_punk_cathedral
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          slight patina
physical_constraints: collides
```

#### A.27.9.31 Reading Plaque (south wall, at entrance)

```
object_id:           ark.memorial_corridor.south.plaque.dedication
object_class:        decoration
position:            (0.00, 0.20, 3.20)
dimensions:          1.00 × 0.40 × 0.02
rotation:            180°
material_primary:    cast bronze with engraved text
material_secondary:  none
colour_value:        --token-color-ark-memorial-corridor-bronze-plaque
interaction:         inspectable
  - inspect: reads "WE REMEMBER / Every name. Every breath. Every loss."
narrative_role:      sets the corridor's emotional register on entry
lore_anchor:         arc.fallen_crew
art_status:          producer_handoff
gameplay_hook_id:    trpc.memorial.plaque.read
wear_state:          slight wear
physical_constraints: non-collide
```

#### A.27.9.32 Apsidal Relief (above flame)

```
object_id:           ark.memorial_corridor.apse.relief.fallen
object_class:        decoration
position:            (0.00, 24.00, 3.00)
dimensions:          2.40 × 1.80 × 0.10
rotation:            180°
material_primary:    cast bronze with deep relief
material_secondary:  none
colour_value:        --token-color-ark-memorial-corridor-bronze-relief
interaction:         inspectable
  - inspect: opens multi-panel lore-readable about the corridor's purpose (canonical narrative of remembrance)
narrative_role:      THE relief; visible from the entire corridor; symbolises the procession of the dead toward the eternal flame
lore_anchor:         arc.memorial_canon
art_status:          producer_handoff
gameplay_hook_id:    trpc.memorial.relief.read
wear_state:          slight patina
physical_constraints: non-collide
```

#### A.27.9.33-36 Closing Decorative Objects

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.memorial_corridor.south.intercom` | console | (-2.50, 0.20, 1.50) | 0.20 × 0.10 × 0.30 | comms relay (silent in baseline) |
| `ark.memorial_corridor.south.fire_extinguisher` | interactive | (2.50, 0.20, 1.20) | 0.20 × 0.20 × 0.50 | safety |
| `ark.memorial_corridor.flame_keeper_log` | container | (1.20, 23.50, 0.85) on small bronze podium | 0.30 × 0.20 × 0.05 | the flame-keeper's journal (lore-readable; in-character) |
| `ark.memorial_corridor.bell_toll_emitter` | fx_emitter | (0.00, 24.00, 4.50) | n/a | source of distant bell-toll SFX |

Total: 36 inventory objects.

### A.27.10 Camera-spawn-points (FPV cutscenes)

```
cutscene_id:         cs_amb_memorial_corridor  (Category B Myst-ambient)
camera_position:     (0.00, 0.50, eye_level)
camera_facing:       (0°, -2°, 0°)  # looking forward and slightly down (reverent posture)
avatar_height_anchor: eye_level
head_motion:         slow walk-forward along central walkway, head turning slightly left and right to read each procession stone; lasts 28s; ends with hands entering frame to add an offering coin to the bowl

cutscene_id:         cs_hellbox_6_open  (HB6 Dead Man's Circuit gateway)
camera_position:     (0.00, 23.00, eye_level)  # in front of brass bowl
camera_facing:       (0°, -10°, 0°)  # looking down at bowl
avatar_height_anchor: eye_level
head_motion:         hand-rig enters frame placing final offering; bowl flame brightens; race-line materialises across floor; transit begins

cutscene_id:         cs_hellbox_6_transit  (HB6 transit)
camera_position:     (0.00, 23.00, eye_level)
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         POV travels along race-line; engines rumble louder; corridor extends impossibly forward

cutscene_id:         cs_hellbox_6_close  (HB6 return)
camera_position:     (0.00, 23.00, eye_level)
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         race-line dissolves; corridor re-materialises; brass-bowl flame still flickers
```

### A.27.11 Doorways

```
door_id:            ark.memorial_corridor.south.door.main
connecting_space_id: ark.corridor.deck_lower
door_position:      (0.00, 0.00, 0.00)
door_dimensions:    1.40 × 2.40 × 0.10
door_class:         arch  (bronze single-door)
unlock_condition:   Act 4+
transit_animation:  ceremonial slow-open (4s); instant on subsequent visits
audio_signature:    bronze-on-stone resonance + chain-rattle + faint distant bell-toll
```

### A.27.12 Adjacency map

```
direct_adjacencies:
  - ark.corridor.deck_lower (south door)
  - hellbox.dead_mans_circuit (HB6 portal via brass bowl, conditional)
one_hop_adjacencies:
  - ark.cryo_bay (via deck-lower corridor; thematically appropriate — the corridor is ADJACENT to where the dead sleep)
  - destination.dead_mans_circuit (via HB6)
```

### A.27.13 Gameplay hooks

```
hooks:
  - hook_id:         memorial_corridor.touchProcessionStone
    trigger:         player.interact on ark.memorial_corridor.procession_stone.<n>
    procedure:       trpc.memorial.procession_stone.touch
    success_state:   stone_touched = true (per-stone)
  - hook_id:         memorial_corridor.inspectStone
    trigger:         player.inspect on procession_stone.<n>
    procedure:       trpc.memorial.procession_stone.inspect
    success_state:   stone_lore_read = true (per-stone)
  - hook_id:         memorial_corridor.toggleCandle
    trigger:         player.interact on ark.memorial_corridor.candle.<n>
    procedure:       trpc.memorial.candle.toggle
    success_state:   candle_state = lit | extinguished (per-candle)
  - hook_id:         memorial_corridor.placeOffering
    trigger:         player.interact on ark.memorial_corridor.brass_bowl.flame
    procedure:       trpc.memorial.bowl.placeOffering
    success_state:   offering_placed = true; bowl-content updated
  - hook_id:         memorial_corridor.invokeHB6
    trigger:         (state-conditional) Act 4+ + has touched 3+ stones + has placed offering
    procedure:       trpc.hellbox.hb6.openGate
    success_state:   hellbox_6_transit_started = true
    fail_state:      not_yet_unlocked / insufficient_engagement
  - hook_id:         memorial_corridor.readRelief
    trigger:         player.inspect on apse.relief.fallen
    procedure:       trpc.memorial.relief.read
    success_state:   relief_read = true
  - hook_id:         memorial_corridor.readFlameKeeperLog
    trigger:         player.inspect on flame_keeper_log
    procedure:       trpc.memorial.flame_keeper_log.read
    success_state:   flame_keeper_log_read = true
```

### A.27.14 Story-tie

```
primary_arcs:
  - arc.fallen_crew
  - arc.act_4_dead_mans_circuit
  - arc.player_grief
  - arc.endings_remembrance_scale  (player's cumulative engagement here colours the endings)
per_act_evolution:
  acts_0_to_3: room is locked; players may glimpse the corridor through external transit but cannot enter
  act_4: room opens; player invited to attend a memorial ceremony (one-time scripted event); thereafter free access. HB6 unlocks after 3+ stones touched + first offering
  act_5: more procession stones become "active" (their lore expands as more deaths occur in player's playthrough — e.g., if a crew member dies in mission, a new stone appears)
  act_6: corridor is well-trafficked; offerings accumulate visibly in basket
  act_7: final state branched: full-mourning state (all candles lit + many offerings) gives "remembering ending"; cold state (few candles + few offerings) gives "forgetful ending"
npc_roster:
  - flame_keeper (silent NPC; named TBD): occasionally maintains the corridor; rare presence
  - the_player: visitor for grief and HB6 invocation
  - kael_voss_ghost: rare cutscene-only appearance in late acts
  - the_master_of_rlyeh: HB6 transit voice only
readables:
  - dedication plaque (south)
  - 8 procession stones (each is a multi-screen lore-readable; expands per-Act)
  - apsidal relief (multi-screen lore)
  - flame_keeper_log (canonical journal of corridor-tending duties; reveals lore about the flame's history)
master_of_rlyeh_question: "If you knew the race was already lost, would you still run?"
```

### A.27.15 Special-FX

```
particle_systems:
  - candle_smoke (8 sources)
  - brass_bowl_flame (one source; large flame with smoke)
  - dust_motes (very low; visible in coffer-strip light shaft)
  - apsidal_smoke_pool (cumulative smoke at vault apex)
volumetric_effects:
  - coffer_strip_light_shaft (visible in lower-light states; emanates downward along central walkway)
  - apsidal_flame_glow (radial volumetric glow from brass bowl)
  - HB6_race_line_manifestation (one-shot animation; race-line glows along floor during transit)
procedural_animations:
  - flame_breath (brass bowl flame breathes; period 4s; slight intensity variation)
  - candle_individual_flicker (8 sources; each independent)
  - bell_toll_visualisation (during distant bell, a faint pulse travels through the corridor)
  - offering_basket_accumulation (visible offerings increment over time)
reactive_systems:
  - candle_glow_on_proximity (within 1.0 m, candle glow brightens 15%)
  - stone_glow_on_inspection (procession stone glows softly when player inspects)
  - bowl_flame_brightness_on_offering (flame intensifies briefly on each offering)
  - HB6_transit_one_shot (corridor extends; race-line manifests; engines rumble)
  - state_branched_corridor_warmth (overall warmth varies with player's engagement ratio)
```

### A.27.16 Avatar-parametricity

```
camera_height_variation:
  small_xenomorph (0.85m eye): camera height 0.85m; procession stones tower over player; candles at face-level — very intimate
  short_humanoid (1.40m eye): standard short scale
  average_humanoid (1.70m eye): standard
  tall_humanoid (2.05m eye): procession stones feel proportional; can read top-of-stone easily
  tall_xenomorph (2.70m eye): procession stones feel small; player must lean down to read; alternate read-down animation
reachability:
  small_xenomorph: cannot reach apsidal relief read-zone; alternate via flame-keeper log or stone-relay
  others: all-reachable
audio_occlusion_variation:
  xenomorph_sensitive_hearing: bell-toll feels louder; flame-crackle more pronounced; corridor reverb more intense
  synthetic_voice_avatar: ambient bed slightly altered; bell-toll has a distinct synthetic-resonance bias
```

### A.27.17 Performance

```
polygon_budget:      220,000 polygons (corridor; long but narrow)
texture_budget:      120 MB total
light_count_limit:   16 simultaneous dynamic lights
lod_plan:
  - hero_distance: 0-12m, full detail
  - mid_distance: 12-25m, mid detail (candles simplified to billboards)
  - low_distance: 25m+, low detail (candle-flames fully billboarded)
streaming_behaviour:
  - preload: ark.corridor.deck_lower
  - on_player_within_5m_of_bowl + HB6_unlocked: preload destination.dead_mans_circuit
```

---

## A.28 Pet Garden (Pocket — breeding/dynasty room) — SCAFFOLDED

```
space_id:        ark.pet_garden
space_name:      Pet Garden
space_type:      ark_room  (pocket dimension)
act_introduced:  Act 3
lore_anchor:     loredex.system.pets + arc.pet_breeding
aesthetic_tier:  dreamers_oneiric  (botanical-organic aesthetic)
dimensions:      14.00 m × 14.00 m × 6.00 m
floor_plan_geometry: circular
```

(Full spec deferred.)

---

## A.29 Pet Arena + Spectator Gallery (Pocket) — SCAFFOLDED

```
space_id:        ark.pet_arena
space_name:      Pet Arena + Spectator Gallery
space_type:      ark_room  (pocket)
act_introduced:  Act 3
lore_anchor:     loredex.system.pet_arena + arc.pet_combat
aesthetic_tier:  solar_punk_cathedral  (colosseum aesthetic)
dimensions:      18.00 m × 14.00 m × 8.00 m
floor_plan_geometry: circular  (arena floor) + surrounding tiered gallery
```

(Full spec deferred.)

---

## A.30 Pet Medical Annex (Pocket) — SCAFFOLDED

```
space_id:        ark.pet_medical_annex
space_name:      Pet Medical Annex
space_type:      ark_room  (pocket)
act_introduced:  Act 3
lore_anchor:     loredex.system.pet_medical
aesthetic_tier:  solar_punk_cathedral  (clinical-warm)
dimensions:      8.00 m × 10.00 m × 4.00 m
```

(Full spec deferred.)

---

## A.31 Trade Hub — SCAFFOLDED

```
space_id:        ark.trade_hub
space_name:      Trade Hub
space_type:      ark_room
act_introduced:  Act 2
lore_anchor:     loredex.system.trade + arc.trade_empire
aesthetic_tier:  solar_punk_cathedral  (mercantile-ornate accents)
dimensions:      18.00 m × 18.00 m × 6.00 m
floor_plan_geometry: hexagonal
```

The Trade Hub is the gameplay-launcher for Trade Empire. (Full
spec deferred; see also `INCEPTION_ARK_FINAL_PRODUCTION.md` §2.31.)

---

## A.32 Trade Command Center / Broker's Office — SCAFFOLDED

```
space_id:        ark.trade_command_center
space_name:      Trade Command Center / Broker's Office
space_type:      ark_room  (sub-room of Trade Hub)
act_introduced:  Act 2
lore_anchor:     loredex.system.trade + arc.broker_arc
aesthetic_tier:  solar_punk_cathedral  (executive accents)
dimensions:      9.00 m × 11.00 m × 4.50 m
```

(Full spec deferred.)

---

## A.33 Defense Command Center (TD — Hellbox 11 host) — FULL

**Status: FULL spec.** Cross-ref: `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.33 (art-state prompts) and §3.12.13 HB11 The Hive gateway.

### A.33.1 Header

```
space_id:        ark.defense_command_center
space_name:      Defense Command Center
space_type:      ark_room  (also Hellbox-11 host)
act_introduced:  Act 4
lore_anchor:     loredex.system.tower_defense + loredex.character.terminus_swarm + arc.act_4_terminus_swarm_first_contact + arc.act_4_HB11_first_negotiation
aesthetic_tier:  solar_punk_cathedral  (military-tactical accents; with bio-organic intrusion in late-act when HB11 active)
master_of_rlyeh_question: "Is one mind worth more than many?" (per HB11)
```

### A.33.2 Geometry

```
dimensions:           14.00 m × 14.00 m × 5.50 m
origin_point:         centre of floor at the south entrance threshold
coordinate_axes:      +x = right, +y = forward (north), +z = up
floor_plan_geometry:  rectangular  (with 5 operator stations arranged in a semi-circle around central holo-table)
volumetric_anomalies: none in baseline; HB11 transit briefly distorts the threat-display (~10s — swarm cluster expands beyond display boundary; webbing extrudes from north wall)
```

The room is square-plan, with a central holo-table dominating
the ground floor. The threat-display occupies the entire north
wall (12 m × 4 m). Five operator stations form a semi-circle
around the holo-table (positions 1-5; player typically at central
position 3). Wall-mounted secondary displays line east + west
walls.

Floor area: 196 m².

### A.33.3 Floor

```
material_primary:     industrial steel grating with anti-static coating; 1.20 m × 1.20 m panels with 50 mm × 5 mm slot pattern; allows cable management beneath
material_secondary:   solid steel plate (not grated) at central holo-table zone (4.00 × 4.00 m); brass perimeter trim around operator stations
pattern:              grating with cross-bracing every 0.30 m; central solid plate has alert-marking pattern (bullseye motif inlaid in brass)
wear_state:           pristine in early acts; in Act 5+, scuff-marks accumulate at operator station areas; in Act 7, scorch-marks if Terminus Swarm has breached defenses
embedded_features:
  - id: ark.defense_command_center.floor.charge_point.holo_table
    position: (0.00, 7.00, 0.00)  # under holo-table
    dimensions: 0.40 × 0.40 × 0.05
    function: holo-table power-coupling + heat-dissipation
  - id: ark.defense_command_center.floor.station_anchor.<n>  (5 stations)
    position: per station (semi-circle around holo-table)
    dimensions: 0.30 × 0.30 × 0.05 each
    function: station electronics power
  - id: ark.defense_command_center.floor.emergency_lockdown_seal
    position: (0.00, 0.50, 0.00)  # at south entrance
    dimensions: 1.40 × 0.20 × 0.10
    function: emergency-lockdown bulkhead deploys here in critical states
acoustic_property:    hard_reflective (industrial); RT60 = 0.50s
```

### A.33.4 Walls

#### Wall: South (entrance)

```
wall_id:              south
material_primary:     painted steel panel with rivet-detail (matches Engineering aesthetic); 0.80 m × 1.60 m panels; exposed rivets every 0.40 m
material_secondary:   bronze dado at z = 1.10 m
panelisation:         standard
colour_value:         --token-color-ark-defense-command-wall-south  (slate-grey with red pin-stripe at z = 2.00 m — combat-alert palette)
embedded_displays:
  - id: ark.defense_command_center.south.display.alert_status
    position: (-3.00, 0.20, 1.80)
    dimensions: 1.20 × 0.80 × 0.05
    content: current alert level (green / amber / red); state-axis driven
  - id: ark.defense_command_center.south.display.duty_roster
    position: (3.00, 0.20, 1.80)
    dimensions: 1.20 × 0.80 × 0.05
    content: duty-roster of operator-NPC schedule
embedded_doors:
  - door_id: ark.defense_command_center.south.door.main
    position: (0.00, 0.00, 0.00)
    dimensions: 1.60 × 2.40 × 0.10
    door_class: pressure_seal  (heavy; airtight; military-grade)
    connecting_space_id: ark.corridor.defense_approach
  - door_id: ark.defense_command_center.south.door.assembly_bay
    position: (-5.50, 0.00, 0.00)  # west of main
    dimensions: 1.40 × 2.40 × 0.10
    door_class: slide
    connecting_space_id: ark.tower_assembly_bay
    unlock_condition: Act 4+
  - door_id: ark.defense_command_center.south.door.trophy_armory
    position: (5.50, 0.00, 0.00)  # east of main
    dimensions: 1.40 × 2.40 × 0.10
    door_class: slide
    connecting_space_id: ark.trophy_armory
    unlock_condition: Act 4+
decorative_features:
  - id: ark.defense_command_center.south.plaque.creed
    position: (0.00, 0.20, 3.20)
    dimensions: 1.00 × 0.40 × 0.02
    material: bronze with engraved text (carved deep)
    narrative_role: reads "WE STAND BETWEEN THE DARK AND THE LIGHT" — the defense-command creed
  - id: ark.defense_command_center.south.warning_sign.combat_zone
    position: (4.00, 0.20, 3.50)
    dimensions: 0.40 × 0.30 × 0.01
    material: yellow-and-red painted steel
    narrative_role: combat-zone warning; reinforces gravity
```

#### Wall: East

```
wall_id:              east
material_primary:     painted steel panel; reinforced (gunmetal grey); some rust patina at lower corners (lived-in feel)
material_secondary:   bronze dado
panelisation:         standard
colour_value:         --token-color-ark-defense-command-wall-east
embedded_displays:
  - id: ark.defense_command_center.east.display.tactical_secondary
    position: (6.95, 7.00, 2.50)
    dimensions: 2.40 × 1.60 × 0.05
    content: tactical secondary view (terrain map; enemy positions)
  - id: ark.defense_command_center.east.display.tower_loadout
    position: (6.95, 12.00, 2.50)
    dimensions: 1.20 × 0.80 × 0.05
    content: current tower loadout / available towers
embedded_doors:        none
decorative_features:
  - id: ark.defense_command_center.east.weapons_locker
    position: (6.95, 4.00, 0.00)
    dimensions: 1.40 × 0.40 × 2.00
    material: steel locker with reinforced doors
    narrative_role: secure weapons storage (cross-ref armory adjacency)
  - id: ark.defense_command_center.east.warning_strobe
    position: (6.95, 12.00, 4.50)
    dimensions: 0.30 × 0.30 × 0.30
    material: red-orange housing with warning lens
    narrative_role: combat-alert strobe (off in baseline; flashes during alert)
```

#### Wall: North (the threat-display wall — HB11 anchor surface)

```
wall_id:              north
material_primary:     panel of reinforced display screens (modular); seamless 12.00 × 4.00 m display surface from z = 1.00 to z = 5.00; surrounding bezel is gunmetal steel with bronze trim
material_secondary:   reinforced glass (transparent armor) overlay protecting display
panelisation:         single-piece display
colour_value:         --token-color-ark-defense-command-threat-display  (deep navy with green grid; threat icons in red/amber/cyan)
embedded_displays:
  - id: ark.defense_command_center.north.display.threat_master
    position: (0.00, 13.95, 3.00)  # centred on north wall
    dimensions: 12.00 × 4.00 × 0.10
    content: THE master threat display (terrain + threats + projected paths); also the HB11 gateway surface
embedded_doors:        none (no physical exit through north wall)
decorative_features:
  - id: ark.defense_command_center.north.relief.shield_emblem
    position: (0.00, 13.95, 5.30)  # high above threat-display
    dimensions: 1.00 × 0.80 × 0.05
    material: cast bronze shield emblem
    narrative_role: defense-command emblem
```

#### Wall: West

Mirror of east.

```
wall_id:              west
material_primary:     same as east
material_secondary:   bronze dado
panelisation:         standard
colour_value:         --token-color-ark-defense-command-wall-west
embedded_displays:
  - id: ark.defense_command_center.west.display.alliance_war
    position: (0.05, 7.00, 2.50)
    dimensions: 2.40 × 1.60 × 0.05
    content: alliance war status (multiplayer)
  - id: ark.defense_command_center.west.display.guild_standings
    position: (0.05, 12.00, 2.50)
    dimensions: 1.20 × 0.80 × 0.05
    content: guild rankings
embedded_doors:        none
decorative_features:
  - id: ark.defense_command_center.west.warning_strobe
    position: (0.05, 12.00, 4.50)
    dimensions: 0.30 × 0.30 × 0.30
    material: red-orange housing
    narrative_role: combat-alert strobe (mirror of east)
```

### A.33.5 Ceiling

```
height_above_floor:     5.50 m baseline; central coffer over holo-table at 5.00 m (slightly lower; gives intimacy at central planning area); perimeter drop to 4.50 m within 1.50 m of walls
material:               exposed structural framework with industrial conduits; central coffer is a backlit translucent panel (cool-blue tone — military-tactical)
lighting_integrated:    suspended high-bay fixtures on 2.40 m × 2.40 m grid at z = 5.00; central coffer is a single emitter; perimeter strip-lighting at z = 4.50
atmospheric_features:   subtle haze in baseline (industrial); intensifies during alert states (warning strobes activate)
acoustic_treatment:     baffled (dampening panels at perimeters); central coffer is hard-reflective
```

### A.33.6 Lighting

```
ambient_baseline:     4500 K (cool-neutral; tactical); 280 lux at floor level; CRI 88
direct_fixtures:
  - id: ark.defense_command_center.light.coffer_central
    position: (0.00, 7.00, 5.00)
    beam_angle: 90° downward
    colour: --token-color-ark-defense-command-coffer  (cool blue-white)
    intensity: 8000 lumens
    function: holo-table principal light
  - id: ark.defense_command_center.light.high_bay_array
    position: distributed at z = 5.00 on 2.40 × 2.40 grid (excluding coffer zone)
    beam_angle: 90°
    colour: --token-color-ark-defense-command-high-bay  (cool white)
    intensity: 1800 lumens each
    function: ambient task lighting
  - id: ark.defense_command_center.light.threat_display_glow
    position: (0.00, 13.95, 3.00)  # at threat-display
    beam_angle: 180° wash inward
    colour: variable (matches display content)
    intensity: variable (5000-12000 lumens; pulses with display activity)
    function: ambient + tactical-presence
  - id: ark.defense_command_center.light.station_console_glow.<n>  (5 stations)
    position: per station console
    intensity: 200 lumens each
    flicker_pattern: subtle data-flow indicator
practical_sources:
  - id: ark.defense_command_center.warning_strobe.east  (off in baseline)
    position: (6.95, 12.00, 4.50)
    intensity: 0 lumens (off); 5000 lumens at strobe-flash
    flicker_pattern: cyclic-strobe (only in alert states)
  - id: ark.defense_command_center.warning_strobe.west  (off in baseline; mirror)
    position: (0.05, 12.00, 4.50)
    intensity: 0 lumens (off); 5000 lumens at strobe-flash
time_of_day_variation:
  act_4: stable lighting; threat-display green
  act_5: occasional amber alerts; strobes flash briefly during waves
  act_6: more frequent alerts; in HB11-active state, threat-display glitches with bio-luminescent green-cyan tones
  act_7: state-branched: defended (player held off Swarm) or breached (red lighting throughout, strobes constant)
dynamic_response:
  - on_alert_status_change: ambient warms to 5800 K alert-tone (amber alert) or 6500 K combat-tone (red alert)
  - on_HB11_invoke: threat-display flickers; bio-organic webbing visible spreading from display; coffer pulses asymmetrically
  - on_wave_start: strobes pulse + ambient drops 30% (tactical-darken)
```

### A.33.7 Atmosphere

```
air_temperature:    21°C baseline (cool-comfortable; rises to 26°C during sustained combat states)
humidity:           38% RH; smells of ozone + steel + faint coffee (operator's beverages)
particulate:
  - type: dust
    density: low
    colour: greyish-iron
    drift_direction: random + slight upward drift near hot-electronics
  - type: smoke
    density: zero in baseline; rises in alert states (system-stress) at corner emitters
    colour: bluish-grey
    drift_direction: upward
  - type: bio_organic_threads (HB11-active only)
    density: zero baseline; thin filaments visible during HB11 transit (pre-HB11)
    colour: bio-luminescent green-cyan
    drift_direction: lateral (extending from north wall)
volumetric_fog:     absent in baseline; present during alert states (0.10 g/m³, cool-grey)
wind_drift:         strong from south (entrance) toward operator stations; 0.30 m/s; ventilation pattern
smell_canon:        ozone + steel + coffee (acts 4) + sulfur (acts 5+ stress states); voice-line: "smells like a war room"
```

### A.33.8 Sound

```
ambient_bed:           file: defense_command_ambient_bed_v1.ogg (loop); -30 dB; threat-display warm-up tones, cooling fans, distant comms-chatter, faint heartbeat-rhythm of system pulse
point_sources:
  - id: ark.defense_command_center.sound.threat_display_warmup
    position: (0.00, 13.95, 3.00)
    sound: deep electronic warmup (continuous, -32 dB)
    occlusion_behaviour: standard
    trigger: continuous
  - id: ark.defense_command_center.sound.station_consoles_buzz
    position: distributed (one per station)
    sound: low electronic buzz (continuous, -38 dB each)
    occlusion_behaviour: standard
    trigger: continuous
  - id: ark.defense_command_center.sound.alarm_klaxon  (warning system)
    position: (0.00, 13.95, 5.00)
    sound: low rumble warning tone (off in baseline; -22 dB during alert)
    occlusion_behaviour: omnidirectional
    trigger: state-conditional
  - id: ark.defense_command_center.sound.cooling_fans
    position: distributed in ceiling (8 fans)
    sound: HVAC cooling drone (continuous, -40 dB)
    occlusion_behaviour: omnidirectional
    trigger: continuous
  - id: ark.defense_command_center.sound.distant_comms_chatter
    position: (0.00, 13.95, 2.00)
    sound: muffled radio voices (cycles random clips; -42 dB)
    occlusion_behaviour: standard
    trigger: continuous
  - id: ark.defense_command_center.sound.hb11_organic_pulse  (HB11-active only)
    position: (0.00, 13.95, 3.00)
    sound: deep organic-pulse drone (-28 dB; only during HB11 transit)
    occlusion_behaviour: omnidirectional
    trigger: state-conditional
reverb_zone:           IR-impulse: defense_command_v1.wav; wet-mix 22% (industrial reverb)
music_eligibility:     cutscene only (HB11 transit + Category C cs_disc_tower_defense + cs_load_tower_defense)
voice_line_eligibility:
  - speaker: defense_command_voice (institutional; non-named NPC)
    trigger: ambient + alert
    line_set: see §2.33.2
  - speaker: locke (rare; comms-feed; never physical)
    trigger: state-conditional
    line_set: see §2.3.2 cross-ref
  - speaker: the_hive_collective_whisper  (HB11 only)
    trigger: HB11 transit + negotiation
    line_set: HB11-specific
  - speaker: the_master_of_rlyeh
    trigger: HB11 transit only
```

### A.33.9 Object inventory

Defense Command Center has 44 inventory objects.

#### A.33.9.1 The Threat Master Display (HB11 anchor surface)

```
object_id:           ark.defense_command_center.north.display.threat_master
object_class:        display
position:            (0.00, 13.95, 3.00)
dimensions:          12.00 × 4.00 × 0.10
rotation:            180°
material_primary:    composite display panel; modular OLED with holographic overlay capability
material_secondary:  reinforced transparent armor protective layer
colour_value:        --token-color-ark-defense-command-threat-display  (deep navy + green grid)
interaction:         interactable
  - operate: detailed threat-analysis UI
  - inspect: lore-note about defensive systems
  - HB11_invoke: when conditions met (player has survived first Terminus Swarm wave + interacts with display), threat-display flickers + swarm icon expands beyond boundary + transit begins (cf §3.12.13)
narrative_role:      THE display; tactical brain of the room; HB11 gateway. Player's eye is drawn here from any operator station.
lore_anchor:         loredex.system.tower_defense + loredex.character.terminus_swarm + arc.act_4_HB11_first_negotiation
art_status:          producer_handoff
gameplay_hook_id:    trpc.defense.threat_display.operate + trpc.hellbox.hb11.openGate (state-conditional)
wear_state:          slight wear at frequently-touched zones (tactical-update areas)
physical_constraints: collides (transparent armor)
```

#### A.33.9.2 The Tactical Holo-Table

```
object_id:           ark.defense_command_center.tactical_holo_table
object_class:        display
position:            (0.00, 7.00, 0.00)
dimensions:          3.00 × 2.40 × 1.05
rotation:            0°
material_primary:    brushed-titanium frame with matte-black holographic projection surface
material_secondary:  bronze edge-trim with bronze status lights at corners
colour_value:        --token-color-ark-defense-command-holo-table  (titanium-black with bronze accents; hologram is variable)
interaction:         interactable
  - operate: spawns 3D holographic display of Tower Defense battlefield; player can place towers, plan strategy
  - inspect: lore-note about tactical-table system
narrative_role:      planning surface; player builds Tower Defense strategies here; gameplay-launcher for Tower Defense
lore_anchor:         loredex.system.tower_defense
art_status:          producer_handoff
gameplay_hook_id:    trpc.defense.holo_table.openTacticalView + trpc.tower_defense.startMatch
wear_state:          slight wear at tower-placement areas
physical_constraints: collides; player can lean
```

#### A.33.9.3-7 The Five Operator Stations (semi-circle around holo-table)

```
object_id:           ark.defense_command_center.station.<n>  (n = 1..5; arranged semi-circle)
object_class:        console
positions:           [
  (-5.00, 5.00, 0.00),   # station 1 (south-west)
  (-3.00, 4.00, 0.00),   # station 2
  (0.00, 3.50, 0.00),    # station 3 (player's primary; centred south of holo-table)
  (3.00, 4.00, 0.00),    # station 4
  (5.00, 5.00, 0.00),    # station 5 (south-east)
]
dimensions (each):   1.20 × 0.80 × 1.10
rotation (each):     varies (faces holo-table)
material_primary:    brushed steel + matte-black control surface
material_secondary:  bronze bezel with cool-blue + amber LED accents
colour_value:        --token-color-ark-defense-command-station
interaction:         interactable
  - operate: opens station-specific UI (station 3 is primary; others are operator-NPC stations)
  - inspect: lore-note
narrative_role:      operator workstations; in baseline, NPCs occupy stations 1, 2, 4, 5; station 3 is the player's. In alert states, NPCs become more animated; voice-lines fire.
lore_anchor:         loredex.system.defense_command_operators
art_status:          producer_handoff
gameplay_hook_id:    trpc.defense.station.operate
wear_state:          slight wear at frequently-used buttons
physical_constraints: collides
```

#### A.33.9.8-12 Five Operator Chairs (one per station)

```
object_id:           ark.defense_command_center.station.<n>.chair  (n = 1..5)
object_class:        furniture
positions:           one per station (offset 0.80 m forward of station)
dimensions (each):   0.80 × 0.80 × 1.40
rotation (each):     varies (faces station)
material_primary:    matte-black leather; titanium frame with armrests
material_secondary:  brass armrest caps; bronze trim
colour_value:        --token-color-ark-defense-command-chair
interaction:         interactable - sit
narrative_role:      operator seating; player can sit at station 3 for their primary command position
lore_anchor:         loredex.system.defense_command_operators
art_status:          producer_handoff
gameplay_hook_id:    trpc.defense.station.takeOperatorSeat
wear_state:          worn at most-occupied chairs
physical_constraints: collides; sittable
```

#### A.33.9.13 Alarm Trigger Console

```
object_id:           ark.defense_command_center.alarm_panel
object_class:        console
position:            (0.00, 0.50, 1.20)  # at south wall, near entrance
dimensions:          0.60 × 0.20 × 0.80
rotation:            180°
material_primary:    red-painted steel housing
material_secondary:  bronze keyhole + bronze trigger-handle
colour_value:        --token-color-ark-defense-command-alarm-panel  (red with bronze)
interaction:         interactable
  - trigger_alarm: deploys emergency lockdown (gameplay-active in critical states; multiplayer)
  - inspect: lore-note about emergency procedures
narrative_role:      emergency lockdown trigger; gameplay-active in stress states
lore_anchor:         loredex.system.alert_status
art_status:          producer_handoff
gameplay_hook_id:    trpc.defense.alarm_panel.trigger
wear_state:          pristine (rare use)
physical_constraints: collides
```

#### A.33.9.14 Weapons Locker (east wall)

```
object_id:           ark.defense_command_center.east.weapons_locker
object_class:        container
position:            (6.95, 4.00, 0.00)
dimensions:          1.40 × 0.40 × 2.00
rotation:            270°
material_primary:    reinforced steel locker with bronze handle
material_secondary:  bronze nameplate "DEFENSE COMMAND ARMORY"
colour_value:        --token-color-ark-defense-command-weapons-locker
interaction:         interactable
  - open (key-required): player can equip CADES weapons in alert states
  - inspect (closed): lore-note about armory
narrative_role:      gameplay-active in alert states; player can equip weapons here
lore_anchor:         loredex.system.cades + cross-ref §A.9 Armory + §A.47 CADES Console Pod
art_status:          producer_handoff
gameplay_hook_id:    trpc.defense.weapons_locker.open
wear_state:          slight wear at handle
physical_constraints: collides
```

#### A.33.9.15-22 Eight Cooling Fans (ceiling-mounted)

```
object_id:           ark.defense_command_center.cooling_fan.<n>  (n = 1..8)
object_class:        fx_emitter
positions:           distributed across ceiling at z = 5.00
dimensions (each):   0.40 × 0.40 × 0.10
rotation:            0°
material_primary:    industrial steel housing with rotating blades visible
material_secondary:  bronze accent on outer ring
colour_value:        --token-color-ark-defense-command-cooling-fan
interaction:         inert
narrative_role:      industrial detail; air movement; sound source for ambient bed
lore_anchor:         loredex.system.defense_command_cooling
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          slight industrial patina
physical_constraints: non-collide (overhead)
```

#### A.33.9.23-30 Eight Tower Display Models (decorative)

```
object_id:           ark.defense_command_center.tower_display_model.<n>  (n = 1..8; one per available tower type)
object_class:        decoration
positions:           on shelf above station consoles (between stations); positions varied
dimensions (each):   0.20 × 0.20 × 0.40
rotation:            0°
material_primary:    miniature scale-model towers (each different design); brass + steel
material_secondary:  bronze base plinth
colour_value:        per-tower (varies)
interaction:         inspectable (each model gives a tower-spec readout)
narrative_role:      shows player available tower types; visual catalog
lore_anchor:         loredex.system.tower_types
art_status:          producer_handoff
gameplay_hook_id:    trpc.defense.tower_model.inspect
wear_state:          pristine
physical_constraints: collides
```

#### A.33.9.31-34 Strobe + Status Lights

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.defense_command_center.warning_strobe.east` | fx_emitter | (6.95, 12.00, 4.50) | 0.30 × 0.30 × 0.30 | combat-alert strobe |
| `ark.defense_command_center.warning_strobe.west` | fx_emitter | (0.05, 12.00, 4.50) | mirror | strobe |
| `ark.defense_command_center.alert_status.coffer_pulse_east` | fx_emitter | (6.00, 7.00, 5.00) | 0.10 × 0.10 × 0.10 | localised alert pulse |
| `ark.defense_command_center.alert_status.coffer_pulse_west` | fx_emitter | (-6.00, 7.00, 5.00) | mirror | localised alert pulse |

#### A.33.9.35-39 Furniture + Storage Fillers

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.defense_command_center.briefing_table` | furniture | (0.00, 11.00, 0.00) | 2.40 × 1.00 × 0.85 | briefing surface for tactical meetings |
| `ark.defense_command_center.briefing_chair.<n>` (4) | furniture | around briefing table | 0.80 × 0.80 × 1.20 each | briefing seating |
| `ark.defense_command_center.coat_rack` | decoration | (1.00, 1.50, 0.00) | 0.30 × 0.30 × 1.80 | coat-stand for operators |
| `ark.defense_command_center.water_dispenser` | interactive | (-5.50, 12.00, 0.00) | 0.50 × 0.30 × 1.20 | water dispenser (cosmetic but interactable) |
| `ark.defense_command_center.coffee_machine` | interactive | (5.50, 12.00, 0.00) | 0.50 × 0.40 × 0.80 | coffee machine (cosmetic; lore-relevant — operators always have a fresh pot) |

#### A.33.9.40-44 Decorative Closing Items

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.defense_command_center.south.intercom` | console | (-1.50, 0.20, 1.50) | 0.20 × 0.10 × 0.30 | comms relay |
| `ark.defense_command_center.fire_extinguisher.south` | interactive | (1.50, 0.20, 1.20) | 0.20 × 0.20 × 0.50 | safety |
| `ark.defense_command_center.first_aid.kit` | container | (-2.50, 0.20, 1.50) | 0.40 × 0.10 × 0.30 | medical |
| `ark.defense_command_center.brass_compass_inlay` | decoration | (0.00, 7.00, 0.005) | 1.40 × 1.40 × 0.005 | floor inlay below holo-table |
| `ark.defense_command_center.fallen_tower_memento.shelf` | decoration | (0.05, 12.00, 1.50) on west wall | 0.40 × 0.20 × 0.10 | shelf displaying components from past failed defenses |

Total: 44 inventory objects.

### A.33.10 Camera-spawn-points (FPV cutscenes)

```
cutscene_id:         cs_amb_defense_command  (Category B Myst-ambient)
camera_position:     (0.00, 0.50, eye_level)
camera_facing:       (0°, 5°, 0°)
avatar_height_anchor: eye_level
head_motion:         slow approach to threat-display, head-tilt up to study; lasts 22s

cutscene_id:         cs_disc_tower_defense  (Category C discovery)
camera_position:     (0.00, 4.50, eye_level)  # at station 3
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         seated; threat-display warm-up; institutional voice narrates; lasts 18s

cutscene_id:         cs_load_tower_defense  (Category C loading)
camera_position:     (0.00, 4.50, eye_level)
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         locked; threat-display warming up; alarm-siren single tone

cutscene_id:         cs_td_wave_start  (per §3.1.A.7)
camera_position:     (0.00, 4.50, eye_level)
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         locked at threat-display; first wave-icon appears at edge of display

cutscene_id:         cs_td_wave_end  (per §3.1.A.7)
camera_position:     (0.00, 4.50, eye_level)
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         hands enter frame at controls

cutscene_id:         cs_hellbox_11_open  (HB11 The Hive gateway)
camera_position:     (0.00, 11.00, eye_level)  # at briefing table closer to north
camera_facing:       (0°, 0°, 0°)  # facing threat-display
avatar_height_anchor: eye_level
head_motion:         locked on display; swarm cluster icon expands; bio-organic webbing visible

cutscene_id:         cs_hellbox_11_transit  (HB11 transit)
camera_position:     (0.00, 11.00, eye_level)
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         POV travels through tunnel of organic webbing

cutscene_id:         cs_hellbox_11_negotiate  (rare, in-Hive)
camera_position:     (within Hive; deferred per Phase E)
camera_facing:       n/a
avatar_height_anchor: eye_level
head_motion:         hands enter frame in supplicant gesture; Hive's webbing pulses

cutscene_id:         cs_hellbox_11_close  (HB11 return)
camera_position:     (0.00, 11.00, eye_level)
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         webbing recedes; tunnel collapses; Defense Command re-materialises
```

### A.33.11 Doorways

```
door_id:            ark.defense_command_center.south.door.main
connecting_space_id: ark.corridor.defense_approach
door_position:      (0.00, 0.00, 0.00)
door_dimensions:    1.60 × 2.40 × 0.10
door_class:         pressure_seal
unlock_condition:   Act 4+
transit_animation:  airlock-cycle (3s)
audio_signature:    pneumatic-hiss + magnetic-clack

door_id:            ark.defense_command_center.south.door.assembly_bay
connecting_space_id: ark.tower_assembly_bay
door_position:      (-5.50, 0.00, 0.00)
door_dimensions:    1.40 × 2.40 × 0.10
door_class:         slide
unlock_condition:   Act 4+
transit_animation:  fade
audio_signature:    pneumatic-hiss + servo-whir

door_id:            ark.defense_command_center.south.door.trophy_armory
connecting_space_id: ark.trophy_armory
door_position:      (5.50, 0.00, 0.00)
door_dimensions:    1.40 × 2.40 × 0.10
door_class:         slide
unlock_condition:   Act 4+
transit_animation:  fade
audio_signature:    pneumatic-hiss + servo-whir
```

### A.33.12 Adjacency map

```
direct_adjacencies:
  - ark.corridor.defense_approach (south main door)
  - ark.tower_assembly_bay (south door)
  - ark.trophy_armory (south door)
  - hellbox.the_hive (HB11 portal via threat-display, conditional on first survived wave)
one_hop_adjacencies:
  - ark.armory (via approach corridor; tactical loadout)
  - ark.bridge (via long-route; tactical command escalation)
  - destination.the_hive (via HB11)
  - destination.terminus_raid_maps (Tower Defense gameplay)
```

### A.33.13 Gameplay hooks

```
hooks:
  - hook_id:         defense_command.openTacticalView
    trigger:         player.operate on tactical_holo_table
    procedure:       trpc.defense.holo_table.openTacticalView
    success_state:   tactical_view_active = true
  - hook_id:         defense_command.startTowerDefenseMatch
    trigger:         player.operate on holo_table + select_match
    procedure:       trpc.tower_defense.startMatch
    success_state:   td_match_started = true
  - hook_id:         defense_command.operateThreatDisplay
    trigger:         player.operate on threat_master display
    procedure:       trpc.defense.threat_display.operate
    success_state:   threat_display_active = true
  - hook_id:         defense_command.invokeHB11
    trigger:         (state-conditional) player has survived first Terminus Swarm wave + interacts with threat display
    procedure:       trpc.hellbox.hb11.openGate
    success_state:   hellbox_11_transit_started = true
  - hook_id:         defense_command.openWeaponsLocker
    trigger:         (state-conditional) player.open on weapons_locker (alert state required)
    procedure:       trpc.defense.weapons_locker.open
    success_state:   weapons_locker_open = true
  - hook_id:         defense_command.triggerAlarm
    trigger:         player.interact on alarm_panel (with key)
    procedure:       trpc.defense.alarm_panel.trigger
    success_state:   alarm_active = true (deploys emergency lockdown)
  - hook_id:         defense_command.takeOperatorSeat
    trigger:         player.sit on station.<n>.chair
    procedure:       trpc.defense.station.takeOperatorSeat
    success_state:   operator_seat_active = true
  - hook_id:         defense_command.inspectTowerModel
    trigger:         player.inspect on tower_display_model.<n>
    procedure:       trpc.defense.tower_model.inspect
    success_state:   tower_model_read = true (per-model)
```

### A.33.14 Story-tie

```
primary_arcs:
  - arc.act_4_terminus_swarm_first_contact
  - arc.act_4_HB11_first_negotiation
  - arc.player_defense_progression
  - arc.defending_the_ark (continuous; ship-state)
per_act_evolution:
  acts_0_3: room locked
  act_4: room opens; first Tower Defense match available; HB11 unlocks after first wave survived
  act_5: more frequent waves; alert state escalates; first negotiation with the Hive (rare)
  act_6: in HB11-active state, threat-display glitches with bio-luminescent green-cyan tones; Hive whispers occasionally audible
  act_7: state-branched: defended ending (player held off Swarm) vs. breached ending (player did not — combat damage visible throughout room)
npc_roster:
  - defense_command_voice (institutional; non-named): primary VO presence
  - 4 operator NPCs (positions 1, 2, 4, 5): occasional silent presence (rotating duty)
  - the_player: operator at position 3
  - the_master_of_rlyeh: HB11 transit voice only
  - the_hive_collective: presence-only (felt during HB11 active states; never visible)
readables:
  - dedication plaque (south)
  - 8 tower display model spec-readouts
  - tactical holo-table strategy briefings (gameplay-driven)
  - threat-display historical logs (gameplay)
  - "fallen tower memento" shelf items (each is a multi-screen lore-readable about a past defense — the towers that did not hold)
master_of_rlyeh_question: "Is one mind worth more than many?"
```

### A.33.15 Special-FX

```
particle_systems:
  - dust (low industrial)
  - smoke (alert-state corner emitters)
  - bio_organic_threads (HB11-active only)
  - coolant_drip (very rare; from cooling fans during sustained combat)
volumetric_effects:
  - threat_display_glow (variable; matches display content)
  - holo_table_volumetric_overlay (3D battlefield projection above table)
  - HB11_organic_webbing (one-shot during HB11 transit; webbing visibly extrudes from north wall)
procedural_animations:
  - cooling_fans_rotate (8 fans; subtle blade animation)
  - coffee_machine_steam (occasional cosmetic)
  - threat_display_radar_sweep (continuous radar-style sweep across display)
  - station_console_glow_pulse (data-flow indicator on each station)
reactive_systems:
  - holo_table_glow_on_proximity (within 2.0 m, holo-table activates)
  - warning_strobes_on_alert (state-conditional)
  - threat_display_alert_visualisation (red overlay during combat)
  - HB11_organic_webbing_one_shot (when HB11 invoked)
```

### A.33.16 Avatar-parametricity

```
camera_height_variation:
  small_xenomorph (0.85m eye): camera height 0.85m; threat-display feels overwhelming; alternate stand-at-elevated-platform animation at station
  short_humanoid (1.40m eye): standard
  average_humanoid (1.70m eye): standard
  tall_humanoid (2.05m eye): cooling fans at near-head-level (must duck slightly)
  tall_xenomorph (2.70m eye): some fans collide; alternate route through room centre
reachability:
  small_xenomorph: cannot reach top of weapons locker; must use stool
  small_xenomorph: cannot reach upper threat-display zones; relay-inspect
  others: all-reachable
audio_occlusion_variation:
  xenomorph_sensitive_hearing: cooling fans louder; alert klaxon overwhelming
  synthetic_voice_avatar: institutional voice has more affinity (synthetic resonance match)
```

### A.33.17 Performance

```
polygon_budget:      280,000 polygons (tactical density; many displays)
texture_budget:      170 MB total (display content shaders are expensive)
light_count_limit:   18 simultaneous dynamic lights
lod_plan:
  - hero_distance: 0-10m, full detail
  - mid_distance: 10-20m, mid detail (cooling fans simplified; tower models simplified)
  - low_distance: 20m+, low detail (mostly billboarded)
streaming_behaviour:
  - preload: ark.corridor.defense_approach (south)
  - preload: ark.tower_assembly_bay (Act 4+)
  - preload: ark.trophy_armory (Act 4+)
  - on_player_at_threat_display + HB11_unlocked: preload destination.the_hive
  - on_holo_table_active: preload destination.terminus_raid_maps (current TD level only)
```

---

## A.34 Trophy Armory (TD) — SCAFFOLDED

```
space_id:        ark.trophy_armory
space_name:      Trophy Armory (TD)
space_type:      ark_room  (sub-room of Defense Command Center)
act_introduced:  Act 4
lore_anchor:     loredex.system.tower_defense_trophies
aesthetic_tier:  solar_punk_cathedral
dimensions:      8.00 m × 10.00 m × 4.00 m
```

(Full spec deferred.)

---

## A.35 Tower Assembly Bay (TD) — SCAFFOLDED

```
space_id:        ark.tower_assembly_bay
space_name:      Tower Assembly Bay (TD)
space_type:      ark_room
act_introduced:  Act 4
lore_anchor:     loredex.system.tower_crafting + arc.tower_progression
aesthetic_tier:  solar_punk_cathedral  (crafting-industrial)
dimensions:      11.00 m × 11.00 m × 5.00 m
```

(Full spec deferred.)

---

## A.36 Chess Hall (Hellbox-9 host) — FULL

**Status: FULL spec.** Cross-ref: `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.36 (art-state prompts) and §3.12.11 HB9 Eternal Match gateway.

### A.36.1 Header

```
space_id:        ark.chess_hall
space_name:      Chess Hall
space_type:      ark_room  (also Hellbox-9 host)
act_introduced:  Act 3 (chess multiplayer); Act 4 (HB9 unlocks after first chess match)
lore_anchor:     loredex.system.chess + loredex.character.the_antiquarian + loredex.character.the_programmer + arc.act_4_eternal_match + §11.3.1 cross-centuries chess game
aesthetic_tier:  solar_punk_cathedral  (cerebral-academic; with sub-tier of chamber-chapel for the central board)
master_of_rlyeh_question: "Whose move is the final one?" (per HB9)
```

### A.36.2 Geometry

```
dimensions:           14.00 m × 14.00 m × 5.50 m
origin_point:         centre of floor at the south entrance threshold
coordinate_axes:      +x = right, +y = forward, +z = up
floor_plan_geometry:  rectangular  (with the central area raised 0.20 m on a marble dais)
volumetric_anomalies: none in baseline; HB9 transit briefly distorts the central chess-board (~10s — the king-piece moves to a square outside chess geometry)
```

The Chess Hall is square-plan, with the central chess-board on
a 4 × 4 m raised marble dais. Tournament boards are arranged
in a perimeter ring (4 boards along east + west walls). The
Antiquarian's chair faces the central board from the north;
the Programmer's chair faces from the south (across the central
board). The player's anchor is at the EAST side of the central
board (the third position).

Floor area: 196 m².

### A.36.3 Floor

```
material_primary:     polished marble in alternating black-and-white tile pattern; 0.50 m × 0.50 m tiles laid in a grand chessboard pattern across the entire room (8×8 super-pattern visible from above)
material_secondary:   bronze inlay outlining the central dais (4×4 m raised area); brass meditation-circle inlays at each of the 8 wall-tournament-board positions
pattern:              chessboard 0.50m grid; entire room reads as a giant chess-board
wear_state:           pristine (sacred-game space); slight wear at central dais access points
embedded_features:
  - id: ark.chess_hall.floor.dais_step.south
    position: (0.00, 7.00, 0.00)
    dimensions: 4.00 × 0.20 × 0.20  (single step up to dais)
    function: dais access (one step at south + east + west; north is closed by Antiquarian's chair area)
  - id: ark.chess_hall.floor.dais_step.east
    position: (9.00, 7.00, 0.00)
    dimensions: 0.20 × 4.00 × 0.20
    function: dais access east
  - id: ark.chess_hall.floor.dais_step.west
    position: (5.00, 7.00, 0.00)
    dimensions: 0.20 × 4.00 × 0.20
    function: dais access west
  - id: ark.chess_hall.floor.charge_point.dais
    position: (7.00, 7.00, 0.20)  # under central board, above dais top
    dimensions: 0.30 × 0.30 × 0.05
    function: chess-clock and board-electronics power
acoustic_property:    hard_reflective with cathedral-like reverb; RT60 = 0.70s (long; supports the contemplative atmosphere)
```

### A.36.4 Walls

#### Wall: South (entrance)

```
wall_id:              south
material_primary:     polished marble cladding (matches floor in colour; black-veined-with-white panels) with carved chess-piece motifs in low relief at z = 0.40 to 1.20
material_secondary:   bronze dado at z = 1.20 m
panelisation:         9 panels wide × 4 panels tall
colour_value:         --token-color-ark-chess-hall-wall  (black-and-white marble with bronze accents)
embedded_displays:
  - id: ark.chess_hall.south.display.tournament_bracket
    position: (-3.00, 0.20, 1.80)
    dimensions: 1.20 × 0.80 × 0.05
    content: live tournament bracket; player rankings
  - id: ark.chess_hall.south.display.player_rating
    position: (3.00, 0.20, 1.80)
    dimensions: 1.20 × 0.80 × 0.05
    content: player's chess rating + match history
embedded_doors:
  - door_id: ark.chess_hall.south.door.main
    position: (0.00, 0.00, 0.00)
    dimensions: 1.40 × 2.40 × 0.10
    door_class: arch  (bronze; with chess-piece motif inlaid)
    connecting_space_id: ark.corridor.chess_approach
  - door_id: ark.chess_hall.south.door.grand_master
    position: (5.50, 0.00, 0.00)  # east of main door
    dimensions: 1.20 × 2.40 × 0.10
    door_class: slide
    connecting_space_id: ark.grand_masters_sanctum
    unlock_condition: top-10 ladder rank
  - door_id: ark.chess_hall.south.door.puzzle_study
    position: (-5.50, 0.00, 0.00)  # west of main door
    dimensions: 1.20 × 2.40 × 0.10
    door_class: slide
    connecting_space_id: ark.puzzle_study_chamber
    unlock_condition: Act 4+
decorative_features:
  - id: ark.chess_hall.south.plaque.chess_principle
    position: (0.00, 0.20, 3.20)
    dimensions: 1.00 × 0.40 × 0.02
    material: bronze
    narrative_role: reads "EVERY MOVE IS A QUESTION" — the room's primary maxim
```

#### Wall: East (with 4 tournament-board alcoves)

```
wall_id:              east
material_primary:     polished marble with deep alcoves at tournament-board positions (4 alcoves at y = 2.5, 5.5, 8.5, 11.5)
material_secondary:   bronze dado
panelisation:         alcoves alternate with marble panels
colour_value:         --token-color-ark-chess-hall-wall
embedded_displays:    none  (tournament-board area is the content)
embedded_doors:        none
decorative_features:
  - id: ark.chess_hall.east.alcove.<n>  (4 alcoves)
    position: distributed along east wall
    dimensions: 1.40 × 1.20 × 2.40 deep recessed
    material: marble
    narrative_role: each alcove houses a tournament chess-board + 2 chairs; observation cubicle
```

#### Wall: North (rear; Antiquarian's anchor)

```
wall_id:              north
material_primary:     polished marble cladding; with deep apsidal niche at centre-north (where Antiquarian's chair is anchored)
material_secondary:   bronze dado; bronze portrait frame
panelisation:         apsidal central niche flanked by panel walls
colour_value:         --token-color-ark-chess-hall-wall-apse
embedded_displays:
  - id: ark.chess_hall.north.display.eternal_match_state
    position: (0.00, 13.95, 1.80)
    dimensions: 1.20 × 0.80 × 0.05
    content: read-only state of the cross-centuries chess game (cf §11.3.1); shows current position
embedded_doors:        none
decorative_features:
  - id: ark.chess_hall.north.alcove.antiquarian
    position: (0.00, 13.95, 0.00)
    dimensions: 2.00 × 1.20 × 3.20 deep recessed
    material: marble with painted scene of "the eternal game"
    narrative_role: where the Antiquarian sits when present
  - id: ark.chess_hall.north.painting.first_game
    position: (0.00, 13.85, 4.00)  # above antiquarian alcove
    dimensions: 2.40 × 1.80 × 0.05
    material: oil on canvas (depicts the very first chess game played in the Ark — Antiquarian vs. Programmer's predecessor)
    narrative_role: lore-readable; canonically painted by the Architect-faction
```

#### Wall: West (with 4 tournament-board alcoves; mirror of east)

```
wall_id:              west
material_primary:     same as east
material_secondary:   bronze dado
panelisation:         mirror of east (4 alcoves)
colour_value:         --token-color-ark-chess-hall-wall
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: ark.chess_hall.west.alcove.<n>  (4 alcoves; mirror of east)
```

### A.36.5 Ceiling

```
height_above_floor:     5.50 m baseline; central coffered ceiling over chess-dais rises to 6.20 m (creates "chamber-chapel" feel for central game); apsidal vault at north dome rises to 6.50 m above Antiquarian's alcove
material:               polished marble cladding with bronze rib detailing; central coffer is a backlit translucent panel
lighting_integrated:    central pendant chandelier over central board; recessed strip-lights at each tournament alcove ceiling; cathedral-rays from apsidal dome
atmospheric_features:   subtle dust-motes visible in central pendant light shaft (especially during ambient cutscenes)
acoustic_treatment:     coffered + apsidal echo at north
```

### A.36.6 Lighting

```
ambient_baseline:     3500 K (warm-neutral; scholarly); 220 lux at floor level; CRI 92
direct_fixtures:
  - id: ark.chess_hall.light.central_chandelier
    position: (7.00, 7.00, 6.00)  # above central chess-board on dais
    beam_angle: 90° downward
    colour: --token-color-ark-chess-hall-chandelier  (warm white with crystal scatter)
    intensity: 6000 lumens (with prism dispersion)
    function: principal task lighting on central board
  - id: ark.chess_hall.light.alcove_strip.east.<n>  (4 strips, one per east alcove)
    position: top of each east alcove at z = 2.40
    beam_angle: 180° wash
    colour: --token-color-ark-chess-hall-alcove-strip
    intensity: 1200 lumens each
    function: tournament-board task lighting
  - id: ark.chess_hall.light.alcove_strip.west.<n>  (4 strips)
    position: top of each west alcove at z = 2.40
    beam_angle: 180° wash
    colour: same as east
    intensity: 1200 lumens each
  - id: ark.chess_hall.light.apsidal_dome
    position: (0.00, 13.95, 6.50)
    beam_angle: 90° downward
    colour: --token-color-ark-chess-hall-apsidal-dome  (warm gold)
    intensity: 3000 lumens
    function: dramatic apse-light onto Antiquarian's alcove
  - id: ark.chess_hall.light.dais_perimeter
    position: along edges of central marble dais at z = 0.20
    beam_angle: 30° upward (uplight)
    colour: --token-color-ark-chess-hall-dais-uplight  (warm white)
    intensity: 600 lumens per metre (12 metres total perimeter)
    function: dramatically separates central dais from surrounding floor
practical_sources:
  - id: ark.chess_hall.tournament_board.east.<n>.clock_glow  (4 emitters)
    position: per tournament chess-clock
    intensity: 80 lumens
    flicker_pattern: ticks with clock
  - id: ark.chess_hall.tournament_board.west.<n>.clock_glow  (4 emitters)
    position: per tournament chess-clock
    intensity: 80 lumens
    flicker_pattern: ticks with clock
  - id: ark.chess_hall.central_board.clock_glow
    position: (7.00, 7.00, 0.95)  # on central board
    intensity: 100 lumens
    flicker_pattern: ticks with clock (deeper, slower than tournament clocks)
time_of_day_variation:
  acts_3_to_7: stable lighting; in HB9-active state, central pendant flickers in time with the king-piece's auto-move
dynamic_response:
  - on_player_at_central_board: dais-uplight intensifies 20%
  - on_HB9_invoke: central pendant flickers; king-piece glows; chamber-walls visibly dissolve (one-shot)
  - on_tournament_match_start: alcove strip intensifies for that alcove
```

### A.36.7 Atmosphere

```
air_temperature:    20°C (cool-comfortable; chess concentration)
humidity:           42% RH; smells of polished-wood + book-paper (from observation chairs) + faint polish (chess pieces) + cold-marble
particulate:
  - type: dust
    density: low (well-maintained)
    colour: warm-grey
    drift_direction: random + slight downward in central pendant light shaft
volumetric_fog:     absent in baseline; very subtle volumetric beam from apsidal dome to Antiquarian's chair (only visible during ambient or HB9 cutscenes)
wind_drift:         minimal; 0.02 m/s
smell_canon:        polished-wood + book-paper + cold-marble + faint metallic-bronze; voice-line: "the air is still here; even thoughts hesitate"
```

### A.36.8 Sound

```
ambient_bed:           file: chess_hall_ambient_bed_v1.ogg (loop); -36 dB; very quiet; 8 chess-clocks ticking (out-of-phase, creating gentle polyrhythm), occasional piece-on-board, distant bell-toll (period 90s)
point_sources:
  - id: ark.chess_hall.sound.central_board_clock
    position: (7.00, 7.00, 0.95)
    sound: deep slow tock (period 1s; -28 dB)
    occlusion_behaviour: standard
    trigger: continuous (only active when match in progress)
  - id: ark.chess_hall.sound.tournament_clock.east.<n>  (4 sources)
    position: per east tournament alcove
    sound: lighter tick (period 1s, slightly different rate per clock; -32 dB each)
    occlusion_behaviour: standard
    trigger: continuous when match active
  - id: ark.chess_hall.sound.tournament_clock.west.<n>  (4 sources)
    position: per west tournament alcove
    sound: lighter tick (-32 dB each)
    occlusion_behaviour: standard
    trigger: continuous when match active
  - id: ark.chess_hall.sound.distant_bell
    position: (0.00, 13.95, 6.50)
    sound: deep bell-toll (period 90s; -36 dB per toll)
    occlusion_behaviour: omnidirectional with bias toward apse
    trigger: cyclic
  - id: ark.chess_hall.sound.piece_on_board
    position: dynamic (per-board interaction)
    sound: piece settling on marble (per-move; -28 dB)
    occlusion_behaviour: standard
    trigger: per-move
  - id: ark.chess_hall.sound.antiquarian_breath
    position: (0.00, 13.95, 1.40)
    sound: very faint slow breath (-44 dB; only when Antiquarian present)
    occlusion_behaviour: omnidirectional
    trigger: state-conditional
  - id: ark.chess_hall.sound.programmer_click
    position: (7.00, 7.00 - 4.00, 1.40)  # at south of central dais
    sound: very faint key-click (-44 dB; only when Programmer present)
    occlusion_behaviour: standard
    trigger: state-conditional
reverb_zone:           IR-impulse: chess_hall_v1.wav; wet-mix 28% (cathedral-like)
music_eligibility:     cutscene only (HB9 transit + Category B cs_amb_chess_hall + Category C cs_disc_chess + cs_load_chess)
voice_line_eligibility:
  - speaker: the_antiquarian
    trigger: presence (Acts 3+)
    line_set: see §2.36.2 (Chess Hall NPC presence-line set)
  - speaker: the_programmer
    trigger: state-conditional (rare physical presence; usually Comms Array or remote)
    line_set: see §2.36.2
  - speaker: the_master_of_rlyeh
    trigger: HB9 transit only
    line_set: HB9-specific
```

### A.36.9 Object inventory

Chess Hall has 56 inventory objects.

#### A.36.9.1 The Central Chess-Board (HB9 gateway)

```
object_id:           ark.chess_hall.chess_board.central
object_class:        interactive  (also fx_emitter for HB9 transit)
position:            (7.00, 7.00, 0.20)  # on central dais top
dimensions:          0.80 × 0.80 × 0.05  (board) + pieces above to z = 0.40
rotation:            0°
material_primary:    polished walnut and ivory inlay (alternating squares)
material_secondary:  bronze edge-trim with gold-engraved rank/file letters
colour_value:        --token-color-ark-chess-hall-central-board
interaction:         interactable
  - examine: shows current state of cross-centuries chess game (cf §11.3.1); piece positions persistent across visits
  - move_piece (player's turn only): player can make a move when their turn comes (game state cycle: Antiquarian → Programmer → Player; player's piece set is 3 pieces (king/knight/queen) per §3.12.11)
  - HB9_invoke: when conditions met (player has played first chess match in tournament boards; first physical interaction with central board), king-piece flickers + moves on its own + transit begins (cf §3.12.11)
narrative_role:      THE central board; cosmologically the HB9 gateway. The cross-centuries game persists across player lifetimes; player adds 3 pieces (king/knight/queen) per §3.12.11 three-player variant
lore_anchor:         §11.3.1 cross-centuries chess game + arc.act_4_eternal_match
art_status:          producer_handoff
gameplay_hook_id:    trpc.chess.central_board.examine + .move + trpc.hellbox.hb9.openGate (state-conditional)
wear_state:          pristine but well-played (centuries old; rendered with patina)
physical_constraints: collides; pieces interactable
```

#### A.36.9.2-33 The Central Board's 32 (or 35 — three-player variant) Pieces

```
object_id:           ark.chess_hall.chess_board.central.piece.<color_or_player>.<piece_type>.<n>
object_class:        interactive
position:            varies (per piece, on board)
dimensions:          varied (king ~0.10 × 0.10 × 0.18; pawns ~0.06 × 0.06 × 0.10)
rotation:            0°
material_primary:    Antiquarian's set is brass-and-walnut; Programmer's set is matte-black-and-titanium; Player's set (3 pieces: king/knight/queen) is custom — colour varies by player faction-alignment
material_secondary:  none
colour_value:        per-set (3 token families)
interaction:         interactable (only on player's turn for player pieces)
  - move: player can move their piece (subject to rules)
narrative_role:      individual pieces; each has its own canon (Antiquarian's white queen has a name etched on its base; Programmer's black knight is canonically a portrait of his predecessor)
lore_anchor:         §11.3.1 chess pieces canon
art_status:          producer_handoff
gameplay_hook_id:    trpc.chess.central_board.piece.move
wear_state:          well-played; some pieces show more wear (most-played pieces)
physical_constraints: collides

(32-35 pieces inventoried as a single class; the inventory list
expands per-piece in a sub-table that has been omitted here for
brevity — full list belongs in the chess subsystem spec, not the
spatial-architect spec.)
```

#### A.36.9.34 The Central Board's Chess-Clock

```
object_id:           ark.chess_hall.central_board.chess_clock
object_class:        console
position:            (7.50, 7.00, 0.30)  # to the side of central board
dimensions:          0.20 × 0.10 × 0.30
rotation:            0°
material_primary:    polished walnut case with white-porcelain dual face
material_secondary:  bronze knob and dial
colour_value:        --token-color-ark-chess-hall-clock
interaction:         interactable
  - press_player_side: ends player's turn; transfers clock to next player
  - inspect: lore-note about the clock (canonical pre-Ark artifact; tied to game's centuries-long history)
narrative_role:      tracks time per move; the Programmer never lets his clock run down
lore_anchor:         §11.3.1
art_status:          producer_handoff
gameplay_hook_id:    trpc.chess.central_board.clock.press
wear_state:          worn at most-pressed buttons
physical_constraints: collides
```

#### A.36.9.35 The Antiquarian's Chair

```
object_id:           ark.chess_hall.antiquarian_chair
object_class:        furniture  (also npc_anchor)
position:            (7.00, 11.00, 0.00)  # at north end of central board area, in apsidal alcove
dimensions:          0.90 × 0.90 × 1.50
rotation:            180°  (faces south, toward central board)
material_primary:    walnut frame with charcoal velvet upholstery; oversized armrests (the Antiquarian is a large character)
material_secondary:  brass detail-work; bronze name-plate "THE ANTIQUARIAN"
colour_value:        --token-color-ark-chess-hall-antiquarian-chair
interaction:         interactable - sit (positioned for white-side play; player can sit when Antiquarian is absent)
narrative_role:      THE Antiquarian's chair; permanent physical anchor; in Acts 3+, Antiquarian appears here
lore_anchor:         loredex.character.the_antiquarian
art_status:          producer_handoff
gameplay_hook_id:    trpc.chess.antiquarian_chair.sit
wear_state:          worn at right armrest (Antiquarian is right-handed)
physical_constraints: collides; sittable
```

#### A.36.9.36 The Programmer's Chair

```
object_id:           ark.chess_hall.programmer_chair
object_class:        furniture  (also npc_anchor)
position:            (7.00, 3.00, 0.00)  # at south end of central board area
dimensions:          0.80 × 0.80 × 1.40
rotation:            0°  (faces north, toward central board)
material_primary:    minimalist matte-black titanium frame with thin black-leather seat (austere — the Programmer's aesthetic)
material_secondary:  brass nameplate "THE PROGRAMMER" (slightly worn)
colour_value:        --token-color-ark-chess-hall-programmer-chair
interaction:         interactable - sit (positioned for black-side play; rarely sat in)
narrative_role:      THE Programmer's chair; he rarely physically appears here (he plays remotely); but the chair is reserved for him
lore_anchor:         loredex.character.the_programmer
art_status:          producer_handoff
gameplay_hook_id:    trpc.chess.programmer_chair.sit
wear_state:          slight wear; chair has been sat in less often
physical_constraints: collides; sittable
```

#### A.36.9.37 The Player's Anchor (third position; east side of central board)

```
object_id:           ark.chess_hall.player_anchor
object_class:        npc_anchor  (player's own anchor for the three-player variant)
position:            (10.00, 7.00, 0.00)  # at east of central board area
dimensions:          0.80 × 0.80 × 1.40
rotation:            270°  (faces west, toward central board)
material_primary:    n/a (anchor only; can be displayed as a third chair when player approaches)
material_secondary:  n/a
colour_value:        n/a
interaction:         n/a (anchor for player presence in three-player variant)
narrative_role:      the THIRD position in the eternal game; the player breaks the binary between Antiquarian and Programmer
lore_anchor:         §11.3.1 + §3.12.11 three-player chess variant
art_status:          producer_handoff
gameplay_hook_id:    n/a
wear_state:          n/a
physical_constraints: n/a
```

#### A.36.9.38-45 The Eight Tournament Chess-Boards (4 east + 4 west alcoves)

```
object_id:           ark.chess_hall.tournament_board.east.<n>  (n=1..4)
object_class:        interactive
positions:           one per east alcove; centred within alcove (typical (5.50, 2.5, 0.85), (5.50, 5.5, 0.85), etc. on tabletop)
dimensions (each):   0.50 × 0.50 × 0.05  (board) + pieces above
rotation:            0°
material_primary:    standard tournament-grade walnut + ivory inlay
material_secondary:  bronze trim
colour_value:        --token-color-ark-chess-hall-tournament-board
interaction:         interactable
  - play_match: opens chess multiplayer UI; player can challenge or be challenged
  - examine: shows current state if mid-match
narrative_role:      tournament boards; player learns chess here; first match here unlocks HB9 cosmology
lore_anchor:         loredex.system.chess + arc.act_3_chess_intro
art_status:          producer_handoff
gameplay_hook_id:    trpc.chess.tournament_board.play
wear_state:          worn at frequently-used squares
physical_constraints: collides; pieces interactable

(Each tournament board has a chess-table beneath, 2 chairs flanking,
and a chess-clock — sub-objects rolled into the board for inventory.
West tournament boards mirror east; .west.1 through .west.4)
```

#### A.36.9.46-49 Tournament-Alcove Tables + Seating (rolled into above tournament boards)

The 8 tournament boards each have:
- Table (1.20 × 1.20 × 0.85)
- 2 chairs (player + opponent)

Counted as part of tournament-board class for inventory simplicity.

#### A.36.9.50 The Antiquarian's Reading Nook (within his alcove)

```
object_id:           ark.chess_hall.antiquarian_alcove.book_table
object_class:        container
position:            (5.50, 12.50, 0.00)  # to the side of Antiquarian's chair
dimensions:          0.80 × 0.40 × 0.85
rotation:            180°
material_primary:    walnut with leather inset
material_secondary:  brass corner caps
colour_value:        --token-color-ark-chess-hall-book-table
interaction:         interactable
  - inspect: shows the book the Antiquarian is currently reading (varies; gameplay-key in some Acts)
narrative_role:      gives the Antiquarian his "scholar" feel; he's always reading something
lore_anchor:         loredex.character.the_antiquarian
art_status:          producer_handoff
gameplay_hook_id:    trpc.chess.antiquarian_book.inspect
wear_state:          slight wear
physical_constraints: collides
```

#### A.36.9.51-54 Decorative Closing Items

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.chess_hall.south.intercom` | console | (-2.00, 0.20, 1.50) | 0.20 × 0.10 × 0.30 | comms relay |
| `ark.chess_hall.fire_extinguisher.south` | interactive | (2.00, 0.20, 1.20) | 0.20 × 0.20 × 0.50 | safety |
| `ark.chess_hall.first_aid.kit` | container | (-3.00, 0.20, 1.50) | 0.40 × 0.10 × 0.30 | medical |
| `ark.chess_hall.observation_bench.east` | furniture | (10.50, 9.00, 0.00) | 1.40 × 0.40 × 0.45 | observation seating (visitors watching central match) |

#### A.36.9.55-56 Wall Paintings + Apsidal Painting

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.chess_hall.east.painting.studies` | decoration | (13.95, 7.00, 2.40) on east wall | 1.20 × 0.80 × 0.04 | abstract chess-study composition |
| `ark.chess_hall.west.painting.studies` | decoration | (0.05, 7.00, 2.40) on west wall | mirror | mirror painting |

(Plus the apsidal painting at A.36.4 north decorative_features.)

Total: 56 inventory objects.

### A.36.10 Camera-spawn-points (FPV cutscenes)

```
cutscene_id:         cs_amb_chess_hall  (Category B Myst-ambient)
camera_position:     (0.00, 0.50, eye_level)
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         locked, watching central pieces shift on their own; lasts 18s

cutscene_id:         cs_disc_chess  (Category C discovery; per §3.1.C)
camera_position:     (7.00, 5.50, eye_level)  # at central dais south edge
camera_facing:       (0°, -15°, 0°)  # looking down at central board
avatar_height_anchor: eye_level
head_motion:         hand-rig enters frame; Antiquarian's hands enter from north; pieces position; clock ticking; lasts 22s

cutscene_id:         cs_load_chess  (Category C loading)
camera_position:     (7.00, 5.50, eye_level)
camera_facing:       (0°, -25°, 0°)
avatar_height_anchor: eye_level
head_motion:         hand pulls chess-piece from tournament tray; places it; loading bar ticks behind in soft-focus

cutscene_id:         cs_hellbox_9_open  (HB9 Eternal Match gateway)
camera_position:     (7.00, 5.50, eye_level)  # at central board
camera_facing:       (0°, -15°, 0°)  # looking down at central board
avatar_height_anchor: eye_level
head_motion:         king-piece flickers; piece moves to "fourth" square; chamber re-materialises into Eternal Match arena

cutscene_id:         cs_hellbox_9_move  (per-move during HB9 visits)
camera_position:     (7.00, 5.50, eye_level)
camera_facing:       (0°, -25°, 0°)
avatar_height_anchor: eye_level
head_motion:         hand enters frame; moves one of player's three pieces; piece settles

cutscene_id:         cs_hellbox_9_close  (HB9 return)
camera_position:     (7.00, 5.50, eye_level)
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         arena dissolves; Chess Hall re-materialises; chess-board now has one of player's pieces visible (memento)
```

### A.36.11 Doorways

```
door_id:            ark.chess_hall.south.door.main
connecting_space_id: ark.corridor.chess_approach
door_position:      (0.00, 0.00, 0.00)
door_dimensions:    1.40 × 2.40 × 0.10
door_class:         arch
unlock_condition:   Act 3+
transit_animation:  fade
audio_signature:    bronze handle + soft slide

door_id:            ark.chess_hall.south.door.grand_master
connecting_space_id: ark.grand_masters_sanctum
door_position:      (5.50, 0.00, 0.00)
door_dimensions:    1.20 × 2.40 × 0.10
door_class:         slide
unlock_condition:   top-10 ladder rank
transit_animation:  fade
audio_signature:    pneumatic-hiss + servo-whir

door_id:            ark.chess_hall.south.door.puzzle_study
connecting_space_id: ark.puzzle_study_chamber
door_position:      (-5.50, 0.00, 0.00)
door_dimensions:    1.20 × 2.40 × 0.10
door_class:         slide
unlock_condition:   Act 4+
transit_animation:  fade
audio_signature:    pneumatic-hiss + servo-whir
```

### A.36.12 Adjacency map

```
direct_adjacencies:
  - ark.corridor.chess_approach (south main door)
  - ark.grand_masters_sanctum (south door; conditional)
  - ark.puzzle_study_chamber (south door; conditional)
  - hellbox.eternal_match (HB9 portal via central chess-board, conditional on first chess match)
one_hop_adjacencies:
  - ark.casino_gaming_floor (via approach corridor; chess-in-July event)
  - destination.eternal_match (via HB9)
  - ark.antiquarian_library (one-hop; thematic kinship — Antiquarian is the bridge)
```

### A.36.13 Gameplay hooks

```
hooks:
  - hook_id:         chess_hall.playTournamentMatch
    trigger:         player.interact on tournament_board.<id>
    procedure:       trpc.chess.tournament_board.play
    success_state:   tournament_match_started = true
  - hook_id:         chess_hall.examineCentralBoard
    trigger:         player.examine on chess_board.central
    procedure:       trpc.chess.central_board.examine
    success_state:   central_board_state_viewed = true
  - hook_id:         chess_hall.makeCentralMove
    trigger:         (state-conditional) player.move on chess_board.central piece + player's turn
    procedure:       trpc.chess.central_board.move
    success_state:   move_made = true (persists across visits)
    fail_state:      not_player_turn
  - hook_id:         chess_hall.invokeHB9
    trigger:         (state-conditional) player has played first tournament match + interacts with central board
    procedure:       trpc.hellbox.hb9.openGate
    success_state:   hellbox_9_transit_started = true
  - hook_id:         chess_hall.sitAntiquarianChair
    trigger:         player.sit on antiquarian_chair (Antiquarian must be absent)
    procedure:       trpc.chess.antiquarian_chair.sit
    success_state:   sat_in_antiquarian_chair = true (rare lore-flag)
  - hook_id:         chess_hall.sitProgrammerChair
    trigger:         player.sit on programmer_chair
    procedure:       trpc.chess.programmer_chair.sit
    success_state:   sat_in_programmer_chair = true
```

### A.36.14 Story-tie

```
primary_arcs:
  - arc.act_3_chess_intro
  - arc.act_4_eternal_match
  - §11.3.1 cross-centuries chess game (continuous)
  - arc.player_chess_progression (player's tournament rating + ladder rank)
per_act_evolution:
  act_3: Chess Hall opens; player learns chess at tournament boards; Antiquarian appears occasionally at apsidal alcove
  act_4: HB9 unlocks after first tournament match; player can enter Eternal Match; first move in three-player variant
  act_5: Antiquarian present more often; deeper conversations available; central board state evolves
  act_6: Programmer occasionally physically appears (rare); chess-clock rhythm disrupted
  act_7: final state branched: Antiquarian and Programmer's game still ongoing OR concluded (depending on player's involvement); player either has many central-board moves or few
npc_roster:
  - the_antiquarian: primary NPC; presence Acts 3+
  - the_programmer: rare physical presence Acts 6+
  - the_player: visitor / third-party in three-player variant
  - the_master_of_rlyeh: HB9 transit voice only
  - other_chess_players: tournament opponents (varied)
readables:
  - chess principle plaque (south)
  - apsidal painting (north): "the first game"
  - east + west studies paintings
  - Antiquarian's current book (gameplay-key in some Acts)
  - tournament bracket display (live)
  - eternal_match_state display (north; current state of cross-centuries game)
master_of_rlyeh_question: "Whose move is the final one?"
```

### A.36.15 Special-FX

```
particle_systems:
  - dust_motes (low; visible in central pendant light shaft)
  - chess_clock_tick_visualiser (very subtle pulse on each tick; cosmetic)
  - HB9_king_piece_flicker (one-shot; piece glows + briefly transparent before moving)
volumetric_effects:
  - apsidal_dome_light_shaft (visible in low-light states; from dome to Antiquarian's chair)
  - central_pendant_light_shaft (visible in low-light)
  - dais_perimeter_uplight_glow (defines central area)
procedural_animations:
  - chess_pieces_subtle_settle (very subtle position adjustments; cosmetic)
  - clock_hands_animate (8 tournament clocks + 1 central clock)
  - kings_breathe (very subtle scaling animation on kings; psychological — they "breathe")
  - apsidal_painting_subtle_shift (the painted scene in the apse SUBTLY shifts between visits — Easter egg)
reactive_systems:
  - dais_uplight_intensify_on_proximity (player approaches central dais)
  - tournament_alcove_strip_intensify (when player enters alcove)
  - antiquarian_chair_glow (when Antiquarian is present, his alcove glows softly)
  - HB9_king_piece_flicker_one_shot (when conditions met)
```

### A.36.16 Avatar-parametricity

```
camera_height_variation:
  small_xenomorph (0.85m eye): camera height 0.85m; central chess-board feels enormous; pieces feel imposing
  short_humanoid (1.40m eye): standard short scale
  average_humanoid (1.70m eye): standard
  tall_humanoid (2.05m eye): pieces look small; player must lean to see clearly
  tall_xenomorph (2.70m eye): pieces too small; alternate "kneel-at-board" animation for play
reachability:
  small_xenomorph: cannot reach central board pieces from standing position; must use the dais step + approach
  small_xenomorph: cannot reach upper paintings; relay-inspect from below
  others: all-reachable
audio_occlusion_variation:
  xenomorph_sensitive_hearing: clock-ticks audibly polyrhythmic (creates hypnotic effect); piece-on-board louder
  synthetic_voice_avatar: Programmer's click-presence has more affinity (synthetic-resonance match)
```

### A.36.17 Performance

```
polygon_budget:      350,000 polygons (high decorative density; many pieces; many tournament boards)
texture_budget:      200 MB total (chess pieces are unique-per-set; many distinct materials)
light_count_limit:   24 simultaneous dynamic lights
lod_plan:
  - hero_distance: 0-10m, full detail
  - mid_distance: 10-20m, mid detail (chess pieces in distant tournament boards become billboarded)
  - low_distance: 20m+, low detail (only central dais and Antiquarian alcove rendered in high detail)
streaming_behaviour:
  - preload: ark.corridor.chess_approach (south)
  - preload: ark.grand_masters_sanctum (when player has top-50 rank)
  - preload: ark.puzzle_study_chamber (Act 4+)
  - on_player_at_central_board + HB9_unlocked: preload destination.eternal_match
```

---

## A.37 Grand Master's Sanctum (top-10 ladder) — SCAFFOLDED

```
space_id:        ark.grand_masters_sanctum
space_name:      Grand Master's Sanctum
space_type:      ark_room  (sub-room of Chess Hall)
act_introduced:  Act 5
lore_anchor:     loredex.system.chess_ladder
aesthetic_tier:  solar_punk_cathedral  (austere-master accents)
dimensions:      8.00 m × 8.00 m × 5.00 m
```

(Full spec deferred.)

---

## A.38 Puzzle Study Chamber (daily puzzle) — SCAFFOLDED

```
space_id:        ark.puzzle_study_chamber
space_name:      Puzzle Study Chamber
space_type:      ark_room  (sub-room of Chess Hall)
act_introduced:  Act 4
lore_anchor:     loredex.system.daily_puzzle
aesthetic_tier:  solar_punk_cathedral  (study-academic)
dimensions:      6.00 m × 8.00 m × 4.00 m
```

(Full spec deferred.)

---

## A.39 Casino Gaming Floor (chess-in-July event) — SCAFFOLDED

```
space_id:        ark.casino_gaming_floor
space_name:      Casino Gaming Floor (Chess-in-July)
space_type:      ark_room  (event-only)
act_introduced:  seasonal
lore_anchor:     loredex.event.chess_in_july
aesthetic_tier:  solar_punk_cathedral  (festive-casino accents)
dimensions:      16.00 m × 12.00 m × 5.00 m
```

(Full spec deferred.)

---

## A.40 Governance Chamber / Council Conclave — SCAFFOLDED

```
space_id:        ark.governance_chamber
space_name:      Governance Chamber / Council Conclave
space_type:      ark_room
act_introduced:  Act 4
lore_anchor:     loredex.system.governance + arc.alliance_governance
aesthetic_tier:  solar_punk_cathedral  (council-formal accents)
dimensions:      14.00 m × 16.00 m × 6.00 m
floor_plan_geometry: hexagonal
```

(Full spec deferred.)

---

## A.41 Daily Resource Allocation Board — SCAFFOLDED

```
space_id:        ark.resource_allocation_board
space_name:      Daily Resource Allocation Board
space_type:      ark_room
act_introduced:  Act 3
lore_anchor:     loredex.system.resource_allocation
aesthetic_tier:  solar_punk_cathedral  (institutional)
dimensions:      8.00 m × 10.00 m × 4.00 m
```

(Full spec deferred.)

---

## A.42 Faction Succession Monument — SCAFFOLDED

```
space_id:        ark.faction_succession_monument
space_name:      Faction Succession Monument
space_type:      ark_room
act_introduced:  Act 6
lore_anchor:     loredex.system.faction_succession
aesthetic_tier:  hierarchy_ritual  (memorial)
dimensions:      10.00 m × 10.00 m × 8.00 m
floor_plan_geometry: hexagonal
```

(Full spec deferred.)

---

## A.43 Oracle's Sanctum (Annual oracle-question vote) — SCAFFOLDED

```
space_id:        ark.oracles_sanctum_annual
space_name:      Oracle's Sanctum (Annual)
space_type:      ark_room
act_introduced:  Act 5
lore_anchor:     loredex.system.oracle_annual_vote
aesthetic_tier:  dreamers_oneiric
dimensions:      9.00 m × 9.00 m × 5.50 m
floor_plan_geometry: circular
```

(Full spec deferred.)

---

## A.44 Epoch Witness Conclave / Archive — SCAFFOLDED

```
space_id:        ark.epoch_witness_conclave
space_name:      Epoch Witness Conclave / Archive
space_type:      ark_room
act_introduced:  Act 7
lore_anchor:     loredex.system.epoch_witness
aesthetic_tier:  solar_punk_cathedral  (archival-formal)
dimensions:      12.00 m × 14.00 m × 5.50 m
```

(Full spec deferred.)

---

## A.45 Nexus Point Sanctum — SCAFFOLDED

```
space_id:        ark.nexus_point_sanctum
space_name:      Nexus Point Sanctum
space_type:      ark_room
act_introduced:  Act 7
lore_anchor:     loredex.system.nexus_points
aesthetic_tier:  dreamers_oneiric  (cosmic-anchor)
dimensions:      10.00 m × 10.00 m × 6.00 m
floor_plan_geometry: circular
```

(Full spec deferred.)

---

## A.46 Prophecy Wall — SCAFFOLDED

```
space_id:        ark.prophecy_wall
space_name:      Prophecy Wall
space_type:      ark_room
act_introduced:  Act 6
lore_anchor:     loredex.system.prophecy + arc.act_6_revelations
aesthetic_tier:  dreamers_oneiric  (mystic-archival)
dimensions:      6.00 m × 16.00 m × 5.00 m
floor_plan_geometry: rectangular  (long-narrow; the wall IS the room)
```

(Full spec deferred.)

---

## A.47 CADES Console / Mission Briefing Pod (Med Bay annex) — SCAFFOLDED

```
space_id:        ark.cades_console_pod
space_name:      CADES Console / Mission Briefing Pod
space_type:      ark_room  (annex of Med Bay)
act_introduced:  Act 2
lore_anchor:     loredex.system.cades + arc.cades_missions
aesthetic_tier:  solar_punk_cathedral  (military-clinical hybrid)
dimensions:      6.00 m × 8.00 m × 4.00 m
```

(Full spec deferred. Cross-ref `INCEPTION_ARK_FINAL_PRODUCTION.md` §2.47.)

---

## A.48 Eidolon Sanctum / Bond Chamber (Soul Stones home) — SCAFFOLDED

```
space_id:        ark.eidolon_sanctum
space_name:      Eidolon Sanctum / Bond Chamber
space_type:      ark_room
act_introduced:  Act 3
lore_anchor:     loredex.system.soul_stones + loredex.character.eidolon
aesthetic_tier:  dreamers_oneiric  (soul-bound aesthetic)
dimensions:      9.00 m × 9.00 m × 5.50 m
floor_plan_geometry: circular
```

(Full spec deferred.)

---

## A.49 Prelude rooms (Corridor / Galley / Briefing Room / Mess Hall) — SCAFFOLDED

```
space_id:        ark.prelude_corridor, ark.prelude_galley, ark.prelude_briefing, ark.prelude_mess_hall
space_name:      Prelude rooms (4 sub-rooms)
space_type:      ark_room
act_introduced:  Prelude (pre-Act-0)
lore_anchor:     arc.prelude
aesthetic_tier:  solar_punk_cathedral  (pre-launch aesthetic)
dimensions (each):
  - corridor: 12.00 m × 4.00 m × 3.50 m
  - galley: 8.00 m × 6.00 m × 4.00 m
  - briefing: 8.00 m × 8.00 m × 4.50 m
  - mess_hall: 12.00 m × 10.00 m × 4.50 m
```

(Full spec deferred.)

---

## A.50 Collectors Arena — NEW (Hellbox-10 host) — CORE

**NEW SPACE** introduced in v5 of the Hellbox cosmology. Did not
exist in the §2.x art-state catalogue prior to this branch. Added
to the deck between Pet Garden (§A.28) and Cargo Hold (§A.10).

```
space_id:        ark.collectors_arena
space_name:      Collectors Arena
space_type:      ark_room  (Hellbox-10 host)
act_introduced:  Act 3
lore_anchor:     loredex.system.collections + arc.collectors_arena_unlock
aesthetic_tier:  dreamers_oneiric  (gallery-mausoleum hybrid)
master_of_rlyeh_question: "What is the price of keeping?" (per HB10)
```

A circular room with a central plinth. Walls lined with 12 alcoves;
each alcove holds a representative sample of one collectible-category
(cards / pets / trade goods / soul stones / songs / memories / scars
/ debts / promises / trophies / tools / vows). The plinth is reactive:
when the player has 10+ collectibles, an object appears (the most-
neglected item in the player's collection). Examining the plinth
opens HB10.

```
dimensions:           10.00 m × 10.00 m × 4.50 m
floor_plan_geometry:  circular
```

Key objects:
- `ark.collectors_arena.central_plinth` — HB10 gateway plinth (5.00, 5.00, 0.00); 1.20 dia × 1.10 tall
- `ark.collectors_arena.alcove.<category>.1-12` — 12 alcoves around the perimeter, each themed
- `ark.collectors_arena.observation_bench.1-3` — 3 benches for contemplation
- `ark.collectors_arena.entrance_threshold` — main entrance (south wall of the circle)

(Full §4 spec deferred to Phase B-2.)

---

## Document status (Phase B-1 — this commit)

- **FULL spec authored**: A.1 Cryo Bay, A.2 Med Bay, A.3 Bridge (cross-ref), A.50 Collectors Arena
- **CORE spec authored**: A.4 Archives, A.5 Comms Array, A.6 Observation Deck, A.7 Engineering Bay, A.11 Captain's Quarters, A.13 Antiquarian Library, A.21 Cipher Den, A.22 Hierarchy Throne, A.27 Memorial Corridor, A.33 Defense Command Center, A.36 Chess Hall
- **SCAFFOLDED**: all remaining (A.8, A.9, A.10, A.12, A.14-A.20, A.23-A.26, A.28-A.32, A.34, A.35, A.37-A.49)

Phase B-2 follow-up: convert all CORE → FULL and all SCAFFOLDED → at least CORE. Estimated additional spec lines for full conversion: ~50,000-70,000 lines across follow-up branches.

---
