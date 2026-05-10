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

## A.4 Archives — FULL

**Status: FULL spec.** Cross-ref: `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.4 (art-state prompts) and §A.13 Antiquarian's Library (the
Archives is the precursor; the hidden archway in the Archives
opens the pocket-dimension Library).

### A.4.1 Header

```
space_id:        ark.archives
space_name:      Archives
space_type:      ark_room
act_introduced:  Act 2
lore_anchor:     loredex.system.archives + arc.lore_recovery + arc.act_3_library_discovery
aesthetic_tier:  solar_punk_cathedral  (with reading-room-museum accents — quiet, scholarly)
```

### A.4.2 Geometry

```
dimensions:           12.00 m × 10.00 m × 4.20 m
origin_point:         centre of floor at south entrance threshold
coordinate_axes:      +x = right, +y = forward (north), +z = up
floor_plan_geometry:  rectangular  (with hidden archway in north wall — discovered Act 3 — leading to ark.antiquarian_library pocket-dimension)
volumetric_anomalies: none in baseline; hidden archway behind a decorative bookcase becomes visible / accessible Act 3+
```

The Archives is the public-facing companion to the Antiquarian's
Library. Quiet, scholarly atmosphere. Central reading table is
the focal point. East and west walls are full-height bookshelves
(galleries with 6 bays each). The hidden archway is concealed
behind the central north bookshelf bay; it doesn't appear until
the player has gathered specific lore (Act 3 cipher-key from
elsewhere in the Ark).

Floor area: 120 m².

### A.4.3 Floor

```
material_primary:     polished walnut hardwood plank in herringbone; 0.20 m × 1.20 m planks running diagonal at 45° from south wall
material_secondary:   bronze inlay outlining the central reading-table area (3 × 4 m); brass perimeter trim
pattern:              herringbone with bronze accents around focal area
wear_state:           pristine in early acts; slight wear-trail Act 2+ from entrance to reading table to archive terminal
embedded_features:
  - id: ark.archives.floor.charge_point.reading_table
    position: (0.00, 5.00, 0.00)
    dimensions: 0.30 × 0.30 × 0.05
    function: reading-table lamp + reading-tools power
  - id: ark.archives.floor.charge_point.archive_terminal
    position: (0.00, 9.50, 0.00)
    dimensions: 0.30 × 0.30 × 0.05
    function: archive terminal electronics
acoustic_property:    soft_absorbent (paper-rich); RT60 = 0.45s (intimate)
```

### A.4.4 Walls

#### Wall: South (entrance)

```
wall_id:              south
material_primary:     painted plaster with classic-textured wood paneling at z = 0.00 to z = 1.20 (wainscoting); plaster from z = 1.20 to ceiling
material_secondary:   walnut chair-rail at z = 1.20; walnut crown-molding at z = 4.00
panelisation:         standard
colour_value:         --token-color-ark-archives-wall-south  (warm cream upper plaster + dark walnut wainscoting)
embedded_displays:
  - id: ark.archives.south.display.archive_index
    position: (-3.00, 0.20, 1.80)
    dimensions: 0.80 × 0.60 × 0.05
    content: index of archive contents (categories + entry counts)
  - id: ark.archives.south.display.recent_lookups
    position: (3.00, 0.20, 1.80)
    dimensions: 0.80 × 0.60 × 0.05
    content: log of recent player lookups (own history)
embedded_doors:
  - door_id: ark.archives.south.door.main
    position: (0.00, 0.00, 0.00)
    dimensions: 1.20 × 2.40 × 0.10
    door_class: arch  (walnut-framed glass-pane door; classical-museum aesthetic)
    connecting_space_id: ark.corridor.archives_approach
decorative_features:
  - id: ark.archives.south.plaque.creed
    position: (0.00, 0.20, 3.20)
    dimensions: 0.80 × 0.30 × 0.02
    material: brass with engraved text
    narrative_role: reads "WHAT IS WRITTEN, IS REMEMBERED" — archives creed
```

#### Wall: East (bookshelf wall)

```
wall_id:              east
material_primary:     dark walnut shelving full-height (z = 0.00 to z = 4.20); 6 bays separated by walnut pilasters
material_secondary:   bronze shelf-supports; bronze name-plates per bay
panelisation:         6 bays × ~1.95 m wide × 0.40 m deep × 4.20 m tall each
colour_value:         --token-color-ark-archives-bookshelf  (dark walnut)
embedded_displays:    none (the books ARE the content)
embedded_doors:        none
decorative_features:
  - id: ark.archives.east.shelf_bay.<n>  (6 bays at y = 1.0, 2.5, 4.0, 5.5, 7.0, 8.5)
    position: along east wall
    dimensions: 1.95 × 0.40 × 4.20 each
    material: walnut + bronze
    narrative_role: each bay holds books on a different category (sciences, languages, exploration, philosophy, military, civic record); bays' contents are gameplay-relevant
```

#### Wall: North (with hidden archway behind central bay)

```
wall_id:              north
material_primary:     dark walnut shelving (matches east + west); 5 visible bays + 1 hidden (the central bay conceals the archway)
material_secondary:   bronze shelf-supports
panelisation:         5 visible bays + concealed archway
colour_value:         --token-color-ark-archives-bookshelf
embedded_displays:
  - id: ark.archives.north.archive_terminal
    position: (0.00, 9.95, 1.50)  # at central bay; the terminal IS the unlock-mechanism for the archway
    dimensions: 1.40 × 0.80 × 0.05
    content: archive terminal — search interface for LOREDEX; in Act 3+, has a hidden subroutine that reveals the archway when correct lore-keys are entered
embedded_doors:
  - door_id: ark.archives.north.archway.hidden
    position: (0.00, 9.95, 0.00)  # behind central bay
    dimensions: 1.40 × 2.40 × 0.10
    door_class: portal  (non-Euclidean teleporter to ark.antiquarian_library)
    unlock_condition: Act 3+ + has gathered lore-keys (multi-step quest)
    connecting_space_id: ark.antiquarian_library
decorative_features:
  - id: ark.archives.north.shelf_bay.<n>  (5 visible bays at x = -4.0, -2.0, 0.0 (central, hides archway), 2.0, 4.0)
    position: along north wall
    dimensions: 1.95 × 0.40 × 4.20 each
    material: walnut + bronze
    narrative_role: each bay holds rare-references (mythological, prophetic, occult, lost-language, restricted-historical)
  - id: ark.archives.north.relief.scholar_motto
    position: (0.00, 9.85, 4.50)  # high above central bay
    dimensions: 1.20 × 0.40 × 0.10
    material: cast bronze
    narrative_role: reads "TO READ IS TO ENTER" — uncanny foreshadowing (the player WILL physically enter the Library through this wall in Act 3)
```

#### Wall: West (bookshelf wall; mirror of east)

```
wall_id:              west
material_primary:     same as east
material_secondary:   bronze shelf-supports
panelisation:         6 bays × ~1.95 m wide × 0.40 m deep × 4.20 m tall (mirror)
colour_value:         --token-color-ark-archives-bookshelf
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: ark.archives.west.shelf_bay.<n>  (6 bays mirror)
    position: mirror of east
    dimensions: 1.95 × 0.40 × 4.20 each
    material: walnut + bronze
    narrative_role: each bay holds books on a different category (geography, biology, mathematics, music, theatre, recreation)
```

### A.4.5 Ceiling

```
height_above_floor:     4.20 m baseline; central skylight (1.20 × 2.00 m) above reading table at z = 4.50 (lets natural light onto reading surface)
material:               painted plaster with walnut crown-molding and coffered detailing; central skylight is translucent panel
lighting_integrated:    central skylight (warm-white emitter); recessed strip-lights at perimeter; pendant lamp above reading table
atmospheric_features:   visible dust-motes in skylight beam (especially during ambient cutscenes)
acoustic_treatment:     coffered + paper-absorbent
```

### A.4.6 Lighting

```
ambient_baseline:     3500 K (warm-neutral; museum-library); 220 lux at floor level; CRI 95
direct_fixtures:
  - id: ark.archives.light.skylight_central
    position: (0.00, 5.00, 4.50)
    beam_angle: 60° downward
    colour: --token-color-ark-archives-skylight  (warm sunlight equivalent)
    intensity: 4000 lumens
    function: principal task lighting at reading table
  - id: ark.archives.light.pendant_reading
    position: (0.00, 5.00, 3.80)  # above reading table, below skylight
    beam_angle: 90° downward
    colour: --token-color-ark-archives-pendant  (warm amber)
    intensity: 2500 lumens
    function: secondary task lighting
  - id: ark.archives.light.shelf_strip.<wall>  (continuous strips along east, west, north walls at z = 4.00)
    beam_angle: 180° wash inward + downward into shelves
    colour: --token-color-ark-archives-shelf-strip  (warm amber-white)
    intensity: 600 lumens per metre
    function: bookshelf-defining accent
practical_sources:
  - id: ark.archives.reading_table.lamp
    position: (0.00, 5.00, 0.85)  # on reading table
    intensity: 800 lumens (when in use)
    flicker_pattern: stable
  - id: ark.archives.archive_terminal.glow
    position: (0.00, 9.50, 0.95)
    intensity: 80 lumens
    flicker_pattern: stable
time_of_day_variation:
  acts_2_to_7: stable lighting; in late-act7, if hidden archway is open, north central bay glows softly (visible from anywhere)
dynamic_response:
  - on_player_at_reading_table: pendant_reading and table-lamp activate
  - on_archway_unlocked: central north bay glows (one-shot)
  - on_archway_traversal: central glow intensifies briefly
```

### A.4.7 Atmosphere

```
air_temperature:    19°C (cool — paper preservation)
humidity:           42% RH; smells of old paper + walnut + leather (book bindings) + faint tea (lingering scholar presence)
particulate:
  - dust_motes: medium (visible in skylight beam; magical-quality shimmer)
  - book_page_motes: low (rises slightly; cosmetic)
volumetric_fog:     absent in baseline; subtle haze near central north bay during archway-active states
wind_drift:         minimal; 0.02 m/s
smell_canon:        old paper + walnut + leather + faint tea; voice-line: "smells like patient hours"
```

### A.4.8 Sound

```
ambient_bed:           file: archives_ambient_bed_v1.ogg (loop); -38 dB; very quiet; faint distant page-rustle (continuous), occasional book-creak (random), faint clock-tick from reading-table mantle clock
point_sources:
  - sound.book_settling: distributed across shelves; occasional book-creak; -38 dB; random period 60-120s
  - sound.page_rustle: dynamic; faint page-turn; -36 dB; random period 30-90s
  - sound.reading_table_clock: at reading table; tick-tock period 1s; -32 dB; continuous
  - sound.archive_terminal_buzz: at terminal; very faint electronic buzz; -42 dB; continuous
  - sound.archway_resonance (Act 3+): at hidden archway; very subtle dimensional resonance; -42 dB; continuous when archway is unlocked
reverb_zone:           IR-impulse: archives_v1.wav; wet-mix 14% (quiet, paper-absorbed)
music_eligibility:     cutscene only (Category B cs_amb_archives — deferred catalogue)
voice_line_eligibility:
  - speaker: archives_assistant (silent NPC; rarely present)
    trigger: rare scripted events
    line_set: see §2.4.2
```

### A.4.9 Object inventory

Archives has 36 inventory objects.

#### A.4.9.1 The Central Reading Table

```
object_id:           ark.archives.reading_table
object_class:        furniture
position:            (0.00, 5.00, 0.00)
dimensions:          2.40 × 1.20 × 0.85
rotation:            0°
material_primary:    polished walnut with deep-leather inset top (charcoal); brass rim
material_secondary:  brass corner-caps with engraved laurel
colour_value:        --token-color-ark-archives-reading-table
interaction:         interactable
  - operate: opens reading-table UI (player can lay out reference books simultaneously)
  - inspect: lore-note about the table's history
narrative_role:      THE focal table; where players sit to research; mantle clock + lamp on top; can lay out books from any shelf
lore_anchor:         loredex.system.archives + arc.lore_recovery
art_status:          producer_handoff
gameplay_hook_id:    trpc.archives.reading_table.operate
wear_state:          worn at the leather inset (centre-most position; most-handled)
physical_constraints: collides
```

#### A.4.9.2-5 Reading Chairs (4)

```
object_id:           ark.archives.reading_chair.<position>  (4 chairs around table)
positions:           [
  (-1.50, 4.00, 0.00),  # west
  (1.50, 4.00, 0.00),   # east
  (-1.50, 6.00, 0.00),  # NW
  (1.50, 6.00, 0.00),   # NE
]
dimensions (each):   0.80 × 0.80 × 1.20
rotation (each):     varies (faces table)
material_primary:    walnut frame with charcoal-leather seat
material_secondary:  brass tacks
colour_value:        --token-color-ark-archives-reading-chair
interaction:         interactable - sit
narrative_role:      research seating; player can sit for extended reading
art_status:          producer_handoff
wear_state:          slight wear at most-occupied seats
physical_constraints: collides; sittable
```

#### A.4.9.6 The Reading Table Lamp

```
object_id:           ark.archives.reading_table.lamp
object_class:        fx_emitter
position:            (0.00, 5.00, 0.85)
dimensions:          0.20 × 0.20 × 0.50
rotation:            0°
material_primary:    cast bronze base + green-shaded glass (classic library aesthetic)
material_secondary:  brass pull-chain
colour_value:        --token-color-ark-archives-lamp
interaction:         interactable
  - toggle: lamp on/off
  - inspect: lore-note about lamp
narrative_role:      classical library lamp; warm focused light at reading position
lore_anchor:         loredex.aesthetic.solar_punk_cathedral
art_status:          producer_handoff
gameplay_hook_id:    trpc.archives.lamp.toggle
wear_state:          slight wear at pull-chain
physical_constraints: collides
```

#### A.4.9.7 The Reading Table Mantle Clock

```
object_id:           ark.archives.reading_table.mantle_clock
object_class:        decoration  (also fx_emitter — ticking SFX)
position:            (-0.80, 5.00, 0.85)
dimensions:          0.30 × 0.20 × 0.40
rotation:            0°
material_primary:    polished brass case with mahogany inlay
material_secondary:  white porcelain face with Roman numerals
colour_value:        --token-color-ark-archives-clock
interaction:         inspectable (read inscription)
narrative_role:      ticking adds room-rhythm; canonically Kael Voss's predecessor's clock (lore connection)
lore_anchor:         arc.captain_lineage
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          slight patina
physical_constraints: collides; non-movable
```

#### A.4.9.8 The Archive Terminal (north central; gateway to Library)

```
object_id:           ark.archives.archive_terminal
object_class:        console
position:            (0.00, 9.50, 0.00)
dimensions:          1.40 × 0.80 × 1.10
rotation:            180°
material_primary:    brushed brass + matte-black control surface with green-tinted display
material_secondary:  walnut bezel; bronze status-light at top
colour_value:        --token-color-ark-archives-terminal
interaction:         interactable
  - operate: opens LOREDEX search interface (multi-screen UI; player searches all known entities + recent player updates)
  - hidden_subroutine (Act 3+): when player enters specific cipher-keys gathered from across Ark, the central north bay slides aside and the archway is revealed
narrative_role:      DUAL FUNCTION — operationally the LOREDEX search interface; cosmologically the unlock-key for the hidden archway to Antiquarian's Library
lore_anchor:         loredex.system.archives + arc.act_3_library_discovery
art_status:          producer_handoff
gameplay_hook_id:    trpc.archives.terminal.operate + trpc.archives.terminal.unlock_archway (state-conditional)
wear_state:          slight wear at most-pressed search keys
physical_constraints: collides
```

#### A.4.9.9-20 Twelve East-West Shelf Bays (6 east + 6 west)

```
object_id:           ark.archives.shelf_bay.east.<category>  (6 bays) and .west.<category>  (6 bays)
positions:           per A.4.4 walls section (12 bays total)
dimensions (each):   1.95 × 0.40 × 4.20
material_primary:    dark walnut + bronze
colour_value:        --token-color-ark-archives-bookshelf
interaction:         interactable
  - inspect_book: each book is a multi-screen lore-readable; ~30-60 books per bay
narrative_role:      categorised reference materials; covers all 12 knowledge domains
lore_anchor:         per-category
art_status:          producer_handoff
gameplay_hook_id:    trpc.archives.shelf_bay.inspect_book
wear_state:          slight wear at most-handled books
physical_constraints: collides
```

(12 bays × ~40 books each = ~480 multi-screen lore-readables in
total across the Archives.)

#### A.4.9.21-25 Five North Shelf Bays (visible)

```
object_id:           ark.archives.shelf_bay.north.<category>  (5 visible bays)
positions:           (-4.0, 9.85, 0.00), (-2.0, 9.85, 0.00), (0.00, 9.85, 0.00) [hides archway], (2.0, 9.85, 0.00), (4.0, 9.85, 0.00)
dimensions (each):   1.95 × 0.40 × 4.20
material_primary:    dark walnut + bronze
colour_value:        --token-color-ark-archives-bookshelf
interaction:         interactable - inspect_book
narrative_role:      restricted-references (mythological, prophetic, occult, lost-language, restricted-historical)
lore_anchor:         loredex.system.restricted_archives
art_status:          producer_handoff
gameplay_hook_id:    trpc.archives.shelf_bay_north.inspect_book
wear_state:          pristine (rarely accessed)
physical_constraints: collides
```

#### A.4.9.26 The Hidden Archway (concealed behind north central bay)

Specced in walls A.4.4. Inventoried for completeness:

```
object_id:           ark.archives.north.archway.hidden
object_class:        door  (portal-class)
position:            (0.00, 9.95, 0.00)  # behind north central bay
dimensions:          1.40 × 2.40 × 0.10
rotation:            180°
material_primary:    cast bronze frame with non-Euclidean teleport seal
material_secondary:  gold-inlaid threshold
colour_value:        --token-color-ark-archives-archway-bronze
interaction:         interactable
  - traverse: opens transit to ark.antiquarian_library (one-shot fade animation)
  - inspect (locked): "the archway is sealed"
  - inspect (unlocked): "the archway resonates with deeper depth"
narrative_role:      THE secret entry; only visible Act 3+ after lore-keys gathered + terminal-unlock subroutine triggered
lore_anchor:         arc.act_3_library_discovery + loredex.character.the_antiquarian
art_status:          producer_handoff
gameplay_hook_id:    trpc.archives.archway.traverse
wear_state:          pristine
physical_constraints: collides; portal traversal
```

#### A.4.9.27-30 Decorative + Reference Tools

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.archives.east.painting.scholarship` | decoration | (5.95, 5.00, 2.40) on east wall | 0.80 × 1.00 × 0.04 | painting depicting "the great scholar's vigil" |
| `ark.archives.west.painting.discovery` | decoration | (0.05, 5.00, 2.40) on west wall | mirror | painting depicting a moment of discovery |
| `ark.archives.south.relief.creed` (rolled walls) | decoration | (0.00, 0.20, 4.50) | 4.00 × 1.20 × 0.10 | low-relief frieze of scholarly figures |
| `ark.archives.north.relief.scholar_motto` (rolled walls) | decoration | (0.00, 9.85, 4.50) | 1.20 × 0.40 × 0.10 | "TO READ IS TO ENTER" |

#### A.4.9.31-36 Closing Items

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.archives.south.intercom` | console | (-1.50, 0.20, 1.50) | 0.20 × 0.10 × 0.30 | comms relay |
| `ark.archives.fire_extinguisher.south` | interactive | (1.50, 0.20, 1.20) | 0.20 × 0.20 × 0.50 | safety |
| `ark.archives.first_aid.kit` | container | (-2.50, 0.20, 1.50) | 0.40 × 0.10 × 0.30 | medical |
| `ark.archives.tea_cart` | container | (4.50, 1.50, 0.00) | 0.50 × 0.40 × 0.85 | tea service cart (cosmetic) |
| `ark.archives.coat_stand.east` | decoration | (5.50, 1.50, 0.00) | 0.30 × 0.30 × 1.80 | coat stand |
| `ark.archives.compass_inlay` | decoration | (0.00, 5.00, 0.005) | 1.20 × 1.20 × 0.005 | floor compass-rose under reading table |

Total: 36 inventory objects.

### A.4.10 Camera-spawn-points (FPV cutscenes)

```
cutscene_id:         cs_amb_archives  (Category B; deferred catalogue)
camera_position:     (0.00, 0.50, eye_level)
camera_facing:       (0°, 0°, 0°)  # facing reading table
avatar_height_anchor: eye_level
head_motion:         slow approach to reading table; head pans up to skylight; lasts 18s

cutscene_id:         cs_archives_archway_revealed  (Act 3 one-shot)
camera_position:     (0.00, 8.50, eye_level)  # at archive terminal
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         hand-rig enters frame at terminal; cipher-keys entered; central north bay slides aside; archway revealed; transit fade
```

### A.4.11 Doorways

```
door_id:            ark.archives.south.door.main
connecting_space_id: ark.corridor.archives_approach
door_position:      (0.00, 0.00, 0.00)
door_dimensions:    1.20 × 2.40 × 0.10
door_class:         arch  (walnut-framed glass-pane)
unlock_condition:   Act 2+
transit_animation:  fade
audio_signature:    walnut-creak + soft bell-chime

door_id:            ark.archives.north.archway.hidden
connecting_space_id: ark.antiquarian_library
door_position:      (0.00, 9.95, 0.00)
door_dimensions:    1.40 × 2.40 × 0.10
door_class:         portal  (non-Euclidean teleporter)
unlock_condition:   Act 3+ + lore-keys gathered
transit_animation:  fade with subtle warp (1.5s)
audio_signature:    page-rustle + faint chime + walnut creak
```

### A.4.12 Adjacency map

```
direct_adjacencies:
  - ark.corridor.archives_approach (south door)
  - ark.antiquarian_library (north hidden archway, Act 3+ conditional)
one_hop_adjacencies:
  - ark.cipher_den (via approach corridor; thematic kinship — Cipher Den's editor works on Archive entries)
  - ark.bridge (via long-route corridor)
state_shared_with:
  - ark.cipher_den (player's edited LOREDEX entries propagate here)
  - ark.antiquarian_library (deeper lore subset visible only there)
```

### A.4.13 Gameplay hooks

```
hooks:
  - hook_id:         archives.operateReadingTable
    trigger:         player.operate on reading_table
    procedure:       trpc.archives.reading_table.operate
    success_state:   reading_table_active = true
  - hook_id:         archives.operateTerminal
    trigger:         player.operate on archive_terminal
    procedure:       trpc.archives.terminal.operate
    success_state:   terminal_active = true
  - hook_id:         archives.unlockArchway
    trigger:         (state-conditional) player has cipher-keys + operates terminal subroutine
    procedure:       trpc.archives.terminal.unlock_archway
    success_state:   archway_revealed = true (one-shot triggers cs_archives_archway_revealed)
  - hook_id:         archives.traverseArchway
    trigger:         player.interact on archway (when revealed)
    procedure:       trpc.archives.archway.traverse
    success_state:   library_entered = true
  - hook_id:         archives.inspectShelfBook
    trigger:         player.inspect on shelf_bay book
    procedure:       trpc.archives.shelf_bay.inspect_book
    success_state:   book_read = true (per-book; ~480 total readables)
  - hook_id:         archives.toggleLamp
    trigger:         player.interact on reading_table.lamp
    procedure:       trpc.archives.lamp.toggle
    success_state:   lamp_state = on | off
  - hook_id:         archives.takeReadingChair
    trigger:         player.sit on reading_chair.<position>
    procedure:       trpc.archives.reading_chair.sit
    success_state:   reading_chair_active = true
```

### A.4.14 Story-tie

```
primary_arcs:
  - arc.lore_recovery (continuous)
  - arc.act_3_library_discovery (the hidden archway reveal)
  - arc.cipher_key_quest (one of 4 keys in the Archives)
  - arc.player_canon (cross-ref with §A.21 Cipher Den)
per_act_evolution:
  acts_0_1: room locked; player has no awareness
  act_2: player gains access; LOREDEX search available; bookshelves browsable; tea-cart present
  act_3: hidden archway revealed (after cipher-key quest); player can enter Antiquarian's Library
  act_4: more advanced search functions available; cross-references unlock
  act_5: player's edits from Cipher Den propagate to Archives terminal
  act_6: restricted-archives north bays fully unlocked
  act_7: state-branched: scholarly ending (player has read deeply, archway is well-traveled) vs. neglectful ending (most books unread, archway dim)
npc_roster:
  - the_archives_assistant: silent NPC; rare scripted appearance
  - the_player: visitor / scholar
  - the_antiquarian: not present here (he is in his Library); but his presence is felt in archive entries
readables:
  - dedication plaque (south)
  - 12 east+west shelf-bay book sets (~480 multi-screen readables)
  - 5 north shelf-bay book sets (restricted; gameplay-key)
  - 2 wall paintings (scholarship + discovery)
  - "TO READ IS TO ENTER" relief above central bay (Acts 0-2 cryptic; Act 3+ revelatory)
  - tea-cart contents (cosmetic with optional lore)
master_of_rlyeh_question: n/a (Archives is not a Hellbox host; it is the gateway to Antiquarian's Library which is itself a destination)
```

### A.4.15 Special-FX

```
particle_systems:
  - dust_motes (medium; visible in skylight beam; magical-quality shimmer)
  - book_page_motes (low; rises through volume)
  - archway_resonance_particles (Act 3+; subtle warp shimmer at central north bay)
volumetric_effects:
  - skylight_volumetric_beam (warm sunlight cone above reading table)
  - archway_glow_envelope (Act 3+; subtle volumetric glow at hidden archway)
procedural_animations:
  - mantle_clock_tick (continuous; tick-tock period 1s; hands DO move)
  - book_subtle_settle (occasional; cosmetic)
  - skylight_dust_drift (continuous slow downward drift)
  - archway_subtle_pulse (Act 3+; central north bay glows with breath rhythm)
reactive_systems:
  - reading_table_lamp_on_player_proximity (within 1.5 m, lamp warms)
  - terminal_glow_on_proximity
  - archway_glow_intensify_on_archway_proximity (Act 3+)
  - archway_unlock_one_shot (Act 3 cipher-key event)
```

### A.4.16 Avatar-parametricity

```
camera_height_variation:
  small_xenomorph (0.85m eye): camera height 0.85m; reading table at chest-level; alternate stand-on-step animation
  short_humanoid (1.40m eye): standard
  average_humanoid (1.70m eye): standard
  tall_humanoid (2.05m eye): pendant-lamp at near-head level
  tall_xenomorph (2.70m eye): alternate kneel-at-table mode
reachability:
  small_xenomorph: cannot reach top shelf-bay rows; alternate ladder provided at each shelf
  others: all-reachable
audio_occlusion_variation:
  xenomorph_sensitive_hearing: clock-tick more pronounced; book-creaks more frequent perceived
  synthetic_voice_avatar: terminal interface has subtle resonance bias
```

### A.4.17 Performance

```
polygon_budget:      280,000 polygons (rich shelving; many decorative items)
texture_budget:      170 MB total (many unique book covers + decorative friezes)
light_count_limit:   16 simultaneous dynamic lights
lod_plan:
  - hero_distance: 0-10m, full detail
  - mid_distance: 10-22m, mid detail (book covers as billboards)
  - low_distance: 22m+, low detail
streaming_behaviour:
  - preload: ark.corridor.archives_approach (south)
  - on_archway_revealed (Act 3+): preload ark.antiquarian_library
```

---

## A.5 Comms Array — FULL

**Status: FULL spec.** Cross-ref: `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.5 (art-state prompts) and §3.12.16 future Hellbox candidate
(Programmer's Sanctum — deferred to expansion).

### A.5.1 Header

```
space_id:        ark.comms_array
space_name:      Comms Array
space_type:      ark_room
act_introduced:  Act 2
lore_anchor:     loredex.character.the_human + loredex.character.locke + arc.act_2_first_human_contact + arc.signal_52_7
aesthetic_tier:  solar_punk_cathedral  (with broadcast-station accents; high-vault aesthetic resembling a radio observatory)
```

### A.5.2 Geometry

```
dimensions:           10.00 m × 14.00 m × 5.50 m
origin_point:         centre of floor at south entrance threshold (entrance south wall; +y toward north frequency wall)
coordinate_axes:      +x = right, +y = forward (north), +z = up
floor_plan_geometry:  rectangular  (long-rectangle; entrance on south short wall)
volumetric_anomalies: none in baseline; subtle EM-aurora effect in upper volume during 52.7 MHz transmission events
```

The Comms Array is a vertical-volume room (5.50 m height vs. typical 4.50 m) to support the frequency wall's full visibility. Operator station ring at room centre; frequency wall dominates the north end. Floor area: 140 m².

### A.5.3 Floor

```
material_primary:     polished steel deck plate with cool-blue tint enamel coating; 1.20 m × 1.20 m tiles; 4 mm gap; etched grid-pattern reads as "signal field"
material_secondary:   bronze inlay ringing central operator station (4 m circular ring); brass perimeter trim
pattern:              grid + concentric rings around central operator station (radar-like)
wear_state:           pristine in early acts; slight wear-trail Act 2+ from entrance to operator station and to archive terminal
embedded_features:
  - id: ark.comms_array.floor.charge_point.operator
    position: (0.00, 8.50, 0.00)  # under operator chair
    dimensions: 0.30 × 0.30 × 0.05
    function: operator-chair power coupling
  - id: ark.comms_array.floor.charge_point.console
    position: (0.00, 7.00, 0.00)
    dimensions: 0.30 × 0.30 × 0.05
    function: console electronics
  - id: ark.comms_array.floor.signal_amplifier_grate
    position: (0.00, 13.00, 0.00)  # in front of frequency wall
    dimensions: 4.00 × 0.40 × 0.10
    function: amplifier cooling grate
acoustic_property:    hard_reflective with damping panels at upper volumes; RT60 = 0.55s
```

### A.5.4 Walls

#### Wall: South (entrance)

```
wall_id:              south
material_primary:     painted aluminium honeycomb panel with cool-blue tint; 0.80 × 1.60 m panels; vertical joints, 6 mm reveal
material_secondary:   brass dado at z = 1.10 m
panelisation:         standard
colour_value:         --token-color-ark-comms-array-wall-south  (deep navy with cyan pin-stripe at z = 2.00 m)
embedded_displays:
  - id: ark.comms_array.south.display.transmission_log
    position: (-3.00, 0.20, 1.80)
    dimensions: 1.20 × 0.80 × 0.05
    content: log of recent transmissions
  - id: ark.comms_array.south.display.signal_strength_graph
    position: (3.00, 0.20, 1.80)
    dimensions: 1.20 × 0.80 × 0.05
    content: signal-strength graph across all monitored frequencies
embedded_doors:
  - door_id: ark.comms_array.south.door.main
    position: (0.00, 0.00, 0.00)
    dimensions: 1.40 × 2.40 × 0.10
    door_class: pressure_seal  (RF-isolation seal)
    connecting_space_id: ark.corridor.comms_approach
decorative_features:
  - id: ark.comms_array.south.plaque.creed
    position: (0.00, 0.20, 3.20)
    dimensions: 1.00 × 0.40 × 0.02
    material: brass with engraved text
    narrative_role: reads "TO LISTEN IS THE FIRST DUTY"
  - id: ark.comms_array.south.warning_sign.rf_shielding
    position: (4.00, 0.20, 3.50)
    dimensions: 0.40 × 0.30 × 0.01
    material: yellow-and-black painted steel
    narrative_role: RF shielding warning
```

#### Wall: East

```
wall_id:              east
material_primary:     painted aluminium with cool-blue tint
material_secondary:   brass dado
panelisation:         standard
colour_value:         --token-color-ark-comms-array-wall-east
embedded_displays:
  - id: ark.comms_array.east.display.signal_visualiser
    position: (4.95, 7.00, 1.50)
    dimensions: 1.20 × 1.20 × 0.05
    content: oscilloscope-style live waveforms
  - id: ark.comms_array.east.display.bandwidth_allocator
    position: (4.95, 11.00, 1.50)
    dimensions: 0.80 × 0.60 × 0.05
    content: bandwidth allocation per channel
embedded_doors:        none
decorative_features:
  - id: ark.comms_array.east.broadcasting_booth_window
    position: (4.95, 4.00, 1.80)
    dimensions: 0.60 × 1.20 × 0.05
    material: composite plexiglas with RF-shielded glass + brass surround
    narrative_role: window into a small broadcasting booth (sub-space; treated as cosmetic in this spec)
```

#### Wall: North (the Frequency Wall)

```
wall_id:              north_frequency
material_primary:     panel of reinforced display screens (modular); 12.00 × 4.50 m display surface from z = 0.50 to 5.00; gentle convex curve (radius 12 m)
material_secondary:   brass viewport surround with structural ribbing every 0.60 m
panelisation:         single-piece display
colour_value:         --token-color-ark-comms-array-frequency-wall  (deep cosmic navy with cyan accents)
embedded_displays:
  - id: ark.comms_array.north.frequency_wall_main
    position: (0.00, 13.95, 2.50)
    dimensions: 12.00 × 4.50 × 0.10
    content: THE frequency wall — full radio-spectrum visualisation; 52.7 MHz indicator central
  - id: ark.comms_array.north.frequency_indicator.52_7
    position: (0.00, 13.95, 2.80)  # within frequency wall
    dimensions: 0.40 × 0.40 highlight
    content: THE INDICATOR — pulses with the Human's signal; opens Act 2 first contact
embedded_doors:        none
decorative_features:
  - id: ark.comms_array.north.relief.communication_emblem
    position: (0.00, 13.95, 5.30)
    dimensions: 0.80 × 0.60 × 0.04
    material: bronze relief — stylised "ear" sigil
    narrative_role: comms-array emblem
```

#### Wall: West

Mirror of east.

```
wall_id:              west
material_primary:     same as east
material_secondary:   brass dado
panelisation:         standard
colour_value:         --token-color-ark-comms-array-wall-west
embedded_displays:
  - id: ark.comms_array.west.console.archive_terminal
    position: (-4.50, 7.00, 1.50)
    dimensions: 1.20 × 0.80 × 0.05
    content: archive of historical signal records
  - id: ark.comms_array.west.display.tutorial_guides
    position: (-4.95, 11.00, 1.50)
    dimensions: 0.80 × 0.60 × 0.05
    content: operator's-guide content
embedded_doors:        none
decorative_features:
  - id: ark.comms_array.west.observation_window
    position: (-4.95, 4.00, 1.80)
    dimensions: 0.60 × 1.20 × 0.05
    material: composite plexiglas + brass surround
    narrative_role: window into corridor approach
```

### A.5.5 Ceiling

```
height_above_floor:     5.50 m baseline; small skylight (1.50 × 1.50 m) at z = 6.00 above operator station
material:               painted aluminium honeycomb with damping; central skylight opening; suspended antenna-truss structure visible
lighting_integrated:    recessed cool-blue strip-lights at perimeter (z = 5.30); central skylight (cosmic light onto operator)
atmospheric_features:   subtle EM-aurora effect in upper volume during 52.7 MHz transmissions
acoustic_treatment:     baffled (reduces echoes for voice transmission clarity)
```

### A.5.6 Lighting

```
ambient_baseline:     5500 K (cool; technical-clinical); 240 lux at floor level; CRI 90
direct_fixtures:
  - id: ark.comms_array.light.skylight_central
    position: (0.00, 8.50, 6.00)
    beam_angle: 60° downward
    colour: --token-color-ark-comms-array-skylight  (cool starlight)
    intensity: 3000 lumens (variable based on cosmic state)
    function: principal accent
  - id: ark.comms_array.light.recessed_strip_perimeter
    position: along all 4 walls at z = 5.30
    beam_angle: 180° wash
    colour: --token-color-ark-comms-array-strip  (cool blue-white)
    intensity: 1000 lumens per metre
    function: ambient task lighting
  - id: ark.comms_array.light.frequency_wall_glow
    position: (0.00, 13.95, 2.50)
    beam_angle: 180° wash inward
    colour: variable (matches content)
    intensity: variable (1500-6000 lumens; pulses with signal activity)
    function: ambient + signal-presence
  - id: ark.comms_array.light.operator_station_glow
    position: (0.00, 8.50, 1.10)
    beam_angle: 60° downward
    colour: 4500 K
    intensity: 2000 lumens
    function: focused operator task light
practical_sources:
  - console.primary.glow: at (0.00, 7.00, 0.95); 100 lumens; data-flow flicker
  - console.archive_terminal.glow: at (-4.50, 7.00, 0.95); 80 lumens; stable
  - frequency_indicator.52_7.glow: at (0.00, 13.95, 2.80); 200 lumens; heartbeat-paced (period 1.2s; matches the Human's breathing)
time_of_day_variation:
  acts_0_2: ambient at 240 lux; frequency wall mostly empty; 52.7 MHz quiet
  act_2: 52.7 MHz becomes active; signal-strength pulses
  acts_3_to_7: signal richer; in late Act 7, if Human is "lost", signal goes silent and 52.7 MHz dims to silver
dynamic_response:
  - on_player_at_operator_station: operator_station_glow intensifies 30%
  - on_52_7_transmission: frequency_wall_glow pulses + skylight intensifies + EM-aurora visible at upper volume
  - on_signal_lost: dimming + cool-tone shift
```

### A.5.7 Atmosphere

```
air_temperature:    20°C (cool-comfortable; rises slightly during sustained operations)
humidity:           38% RH; smells of ozone (RF radiation) + warm electronics + faint coffee (operators)
particulate:
  - dust: low; warm-greyish; slow random
  - ozone_haze: very low; pale-cyan; rises continuously
volumetric_fog:     absent in baseline; subtle EM-aurora at upper volume (0.05 g/m³, cyan)
wind_drift:         very faint; 0.04 m/s; HVAC south-to-north
smell_canon:        ozone + warm electronics + coffee; voice-line: "smells like the air carries voices"
```

### A.5.8 Sound

```
ambient_bed:           file: comms_array_ambient_bed_v1.ogg (loop); -32 dB; faint EM-whine, comms-static rolling-shift, occasional voice-fragments from passing transmissions, distant hum from antenna-truss
point_sources:
  - sound.frequency_wall_static: at (0.00, 13.95, 2.50); shifting comms-static bed; -34 dB; continuous
  - sound.52_7_signal_pulse: at (0.00, 13.95, 2.80); single repeating signal at 52.7 MHz (sounds almost like breathing); -36 dB; period 1.2s; continuous (Act 2+)
  - sound.consoles_buzz: distributed; console buzz + tick; -38 dB; continuous
  - sound.distant_voices_whisper: dynamic; faint voice-fragments; -44 dB; random period 30-60s
  - sound.skylight_cosmic_resonance: at (0.00, 8.50, 6.00); deep-space resonance; -42 dB; continuous
reverb_zone:           IR-impulse: comms_array_v1.wav; wet-mix 16% (technical-clean)
music_eligibility:     cutscene only (Category B cs_amb_comms_array)
voice_line_eligibility:
  - speaker: the_human (signal): trigger 52.7 MHz events; line set §2.5.2
  - speaker: locke (comms-feed): state-conditional; line set §2.5.2 + §2.3.2
```

### A.5.9 Object inventory

Comms Array has 36 inventory objects.

#### A.5.9.1 The Frequency Wall (north)

```
object_id:           ark.comms_array.frequency_wall_main
object_class:        display
position:            (0.00, 13.95, 2.50)
dimensions:          12.00 × 4.50 × 0.10
rotation:            180°
material_primary:    composite display panel with holographic overlay
material_secondary:  brass surround with structural ribbing
colour_value:        --token-color-ark-comms-array-frequency-wall
interaction:         interactable
  - operate: deep frequency-spectrum analysis UI
  - inspect_indicator: select 52.7 MHz indicator for detailed signal inspection
narrative_role:      THE wall; primary visual element; 52.7 MHz indicator is the load-bearing detail
lore_anchor:         loredex.character.the_human + arc.signal_52_7
art_status:          producer_handoff
gameplay_hook_id:    trpc.comms.frequency_wall.operate
wear_state:          pristine
physical_constraints: collides
```

#### A.5.9.2 The 52.7 MHz Indicator

```
object_id:           ark.comms_array.frequency_indicator.52_7
object_class:        display
position:            (0.00, 13.95, 2.80)
dimensions:          0.40 × 0.40 × 0.005  (highlight zone within frequency wall)
rotation:            180°
material_primary:    backlit panel with high-precision pulse animation
colour_value:        --token-color-ark-comms-array-52-7  (cyan-bright with white core)
interaction:         interactable
  - inspect: 52.7 MHz signal-detail UI; live waveform; recorded transmission playback
  - tune: tuning-precision UI (Act 2 first contact gameplay)
narrative_role:      THE INDICATOR; LITERALLY where Act 2 first contact happens
lore_anchor:         loredex.character.the_human + arc.act_2_first_human_contact
art_status:          producer_handoff
gameplay_hook_id:    trpc.comms.signal_52_7.inspect + .tune
wear_state:          slight wear at most-touched zones (Act 5+)
physical_constraints: non-collide (recessed)
```

#### A.5.9.3 The Primary Comms Console

```
object_id:           ark.comms_array.console.primary
object_class:        console
position:            (0.00, 7.00, 0.00)
dimensions:          2.40 × 1.20 × 1.10
rotation:            0°
material_primary:    brushed steel + matte-black control surface
material_secondary:  brass bezel with cool-blue + cyan LED accents
colour_value:        --token-color-ark-comms-array-console-primary
interaction:         interactable
  - operate: comms UI (transmit / receive / scan)
  - inspect: lore-note about comms-array history
narrative_role:      primary console; first contact happens here
lore_anchor:         loredex.character.the_human + arc.act_2_first_human_contact
art_status:          producer_handoff
gameplay_hook_id:    trpc.comms.console_primary.operate
wear_state:          pristine in early acts; "broadcast" button wears by Act 4
physical_constraints: collides
```

#### A.5.9.4 Operator's Chair

```
object_id:           ark.comms_array.operator_chair
object_class:        furniture  (also npc_anchor)
position:            (0.00, 8.50, 0.00)
dimensions:          0.80 × 0.80 × 1.40
rotation:            180°
material_primary:    matte-black leather; titanium frame
material_secondary:  brass armrests
colour_value:        --token-color-ark-comms-array-chair
interaction:         interactable - sit
narrative_role:      operator seat; Locke occasionally sits here when he physically visits (rare)
lore_anchor:         loredex.character.locke + arc.comms_operator_lineage
art_status:          producer_handoff
gameplay_hook_id:    trpc.comms.operator_chair.sit
wear_state:          slight wear
physical_constraints: collides; sittable
```

#### A.5.9.5 Archive Terminal

```
object_id:           ark.comms_array.console.archive_terminal
object_class:        console
position:            (-4.50, 7.00, 0.00)
dimensions:          1.20 × 0.80 × 1.10
rotation:            90°
material_primary:    brushed steel + matte-black
material_secondary:  brass bezel
colour_value:        --token-color-ark-comms-array-archive-terminal
interaction:         interactable
  - operate: archive UI; browse/replay all recorded transmissions
  - inspect: lore-note
narrative_role:      historical comms record; gameplay-key for clue-replay
lore_anchor:         loredex.system.comms_archive
art_status:          producer_handoff
gameplay_hook_id:    trpc.comms.archive.openTerminal
wear_state:          slight wear
physical_constraints: collides
```

#### A.5.9.6 Signal Visualiser (east wall)

Specced in walls section. Inventoried for completeness.

#### A.5.9.7-12 Six Broadcasting Chairs (3 east + 3 west)

```
object_id:           ark.comms_array.broadcasting_chair.<position>  (6 chairs)
positions:           [
  (3.00, 4.00, 0.00), (3.00, 7.00, 0.00), (3.00, 10.00, 0.00),    # east 1-3
  (-3.00, 4.00, 0.00), (-3.00, 7.00, 0.00), (-3.00, 10.00, 0.00), # west 1-3
]
dimensions (each):   0.80 × 0.80 × 1.20
material_primary:    matte-black leather; titanium frame
material_secondary:  none
colour_value:        --token-color-ark-comms-array-chair-secondary
interaction:         interactable - sit
narrative_role:      observer / second-operator seating; multi-person comms sessions
art_status:          producer_handoff
wear_state:          slight wear
physical_constraints: collides; sittable
```

#### A.5.9.13-16 Operator Workspace Items

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.comms_array.operator.headset_rest` | interactive | (0.50, 7.00, 1.10) on console | 0.20 × 0.10 × 0.10 | comms headset (gameplay-key for hidden-frequency listen) |
| `ark.comms_array.operator.notebook` | container | (-0.50, 7.00, 1.10) | 0.30 × 0.20 × 0.04 | running notebook; multi-screen lore-readable; gameplay-key Act 5+ |
| `ark.comms_array.operator.coffee_mug` | decoration | (0.80, 7.00, 1.10) | 0.10 × 0.10 × 0.12 | coffee residue — operator was just here |
| `ark.comms_array.operator.pen_holder` | decoration | (-0.80, 7.00, 1.10) | 0.10 × 0.10 × 0.20 | bronze pen-holder with 3 pens |

#### A.5.9.17-22 Decorative + Functional

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.comms_array.south.intercom` | console | (-2.00, 0.20, 1.50) | 0.20 × 0.10 × 0.30 | comms relay |
| `ark.comms_array.fire_extinguisher.south` | interactive | (2.00, 0.20, 1.20) | 0.20 × 0.20 × 0.50 | safety |
| `ark.comms_array.first_aid.kit` | container | (-2.50, 0.20, 1.50) | 0.40 × 0.10 × 0.30 | medical |
| `ark.comms_array.east.broadcasting_booth_window` (rolled into walls) | decoration | (4.95, 4.00, 1.80) | 0.60 × 1.20 × 0.05 | window |
| `ark.comms_array.west.observation_window` (rolled into walls) | decoration | (-4.95, 4.00, 1.80) | mirror | window |
| `ark.comms_array.north.relief.communication_emblem` (rolled into walls) | decoration | (0.00, 13.95, 5.30) | 0.80 × 0.60 × 0.04 | sigil |

#### A.5.9.23-30 Floor + Ceiling FX

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.comms_array.skylight_central` | fx_emitter | (0.00, 8.50, 6.00) | 1.50 × 1.50 × 0.10 | central skylight |
| `ark.comms_array.signal_amplifier_grate` (rolled into floor) | decoration | (0.00, 13.00, 0.00) | 4.00 × 0.40 × 0.10 | grate |
| `ark.comms_array.antenna_truss` | decoration | (0.00, 8.50, 5.50) | 4.00 × 0.40 × 0.50 | suspended antenna structure |
| `ark.comms_array.cable_management_overhead` | decoration | distributed at z = 5.20 | 0.30 × 14.00 × 0.10 | cable conduit |
| `ark.comms_array.em_aurora_emitter` | fx_emitter | (0.00, 8.50, 5.20) | n/a (volumetric) | EM-aurora during 52.7 MHz events |
| `ark.comms_array.broadcast_lockout_indicator` | decoration | (0.50, 0.20, 1.50) on south wall | 0.20 × 0.10 × 0.10 | red light during broadcast |
| `ark.comms_array.transmission_record_drawer` | container | (-4.50, 8.20, 0.85) under archive terminal | 0.80 × 0.40 × 0.30 | physical drawer with backups |
| `ark.comms_array.spare_headset_drawer` | container | (4.50, 8.20, 0.85) | 0.40 × 0.30 × 0.20 | spare headsets |

#### A.5.9.31-36 Closing Items (rolled into walls or lighting)

| object_id | class | role |
|---|---|---|
| `ark.comms_array.dedication_plaque` (rolled walls) | decoration | "TO LISTEN IS THE FIRST DUTY" |
| `ark.comms_array.south.warning_sign.rf_shielding` (rolled walls) | decoration | RF warning |
| `ark.comms_array.console_primary.glow` (rolled lighting) | fx_emitter | console glow |
| `ark.comms_array.console_archive.glow` (rolled lighting) | fx_emitter | archive glow |
| `ark.comms_array.frequency_indicator_52_7.glow` (rolled lighting) | fx_emitter | THE indicator glow |
| `ark.comms_array.skylight_cosmic_resonance_emitter` (rolled sound) | fx_emitter | cosmic-resonance SFX source |

Total: 36 inventory objects.

### A.5.10 Camera-spawn-points

```
cutscene_id:         cs_amb_comms_array  (Category B; per §3.1.B.3)
camera_position:     (0.00, 0.50, eye_level)
camera_facing:       (0°, 5°, 0°)
avatar_height_anchor: eye_level
head_motion:         very slow approach to 52.7 MHz indicator; head locks on as player approaches; lasts 22s

cutscene_id:         cs_first_human_contact  (existing shipped cutscene; FPV audit pending — see §3.1.0.9)
camera_position:     (0.00, 8.00, eye_level)
camera_facing:       (0°, -10°, 0°)
avatar_height_anchor: eye_level
head_motion:         seated; slight head-shake at first contact; eyes drift up to 52.7 MHz indicator
notes_for_audit:     Refactor to first-person POV from operator's chair; looking at console then drifting up to 52.7 MHz indicator on frequency wall.

cutscene_id:         cs_signal_first_pulse  (Act 2 transmission unlock)
camera_position:     (0.00, 10.00, eye_level)
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         locked on 52.7 MHz indicator as it pulses; lasts ~10s
```

### A.5.11 Doorways

```
door_id:            ark.comms_array.south.door.main
connecting_space_id: ark.corridor.comms_approach
door_position:      (0.00, 0.00, 0.00)
door_dimensions:    1.40 × 2.40 × 0.10
door_class:         pressure_seal  (RF-isolation)
unlock_condition:   Act 1+
transit_animation:  airlock-cycle (3s); RF-shielding equilibrium
audio_signature:    pressure-equalisation hiss + magnetic-clack + faint EM-static-quiet
```

### A.5.12 Adjacency map

```
direct_adjacencies:
  - ark.corridor.comms_approach (south door)
one_hop_adjacencies:
  - ark.bridge (via comms approach + Deck-1 main; Bridge has comms-relay)
  - ark.observation_deck (one hop; Eidolon hears signals here too)
state_shared_with:
  - ark.bridge (comms feed; Locke's voice originates here)
```

### A.5.13 Gameplay hooks

```
hooks:
  - operatePrimaryConsole: trpc.comms.console_primary.operate
  - inspect52_7: trpc.comms.signal_52_7.inspect
  - tune52_7: trpc.comms.signal_52_7.tune (Act 2 conditional + headset; one-shot triggers cs_first_human_contact)
  - openArchiveTerminal: trpc.comms.archive.openTerminal
  - equipHeadset: trpc.comms.headset.equip
  - readNotebook: trpc.comms.notebook.read
  - takeOperatorChair: trpc.comms.operator_chair.sit
  - broadcast: trpc.comms.broadcast
```

### A.5.14 Story-tie

```
primary_arcs:
  - arc.act_2_first_human_contact
  - arc.signal_52_7 (continuous; the Human's signal cadence is the room's heartbeat)
  - arc.comms_operator_notes (Act 5+ gameplay-key)
  - §3.12.16 future Hellbox candidate (Programmer's Sanctum; deferred)
per_act_evolution:
  acts_0_1: room locked
  act_2: player gains access; first 52.7 MHz tune triggers cs_first_human_contact; signal becomes continuous heartbeat
  act_3: more frequencies activate; archive browseable; Locke's comms-feed established here
  act_4: operator's notebook becomes gameplay-key
  act_5: signal pattern shifts; EM-aurora more frequent
  act_6: 52.7 MHz transmission events scripted to specific narrative beats
  act_7: state-branched: signal active (Human survived; wall lit) vs. silent (Human lost; wall dim)
npc_roster:
  - the_human: signal-only via 52.7 MHz
  - locke: signal-only typically; rare physical visits
  - the_player: visitor / operator
readables:
  - dedication plaque (south)
  - operator's notebook (multi-screen)
  - archive terminal (transmission archive)
  - signal-pattern visualiser readouts
  - tutorial guide displays
master_of_rlyeh_question: n/a
```

### A.5.15 Special-FX

```
particle_systems:
  - dust (low; RF-shielded environment)
  - ozone_haze (very low; rises continuously)
  - em_aurora (state-conditional; cyan shimmer at upper volume during 52.7 MHz events)
  - dust_motes (visible in skylight beam)
volumetric_effects:
  - frequency_wall_glow (variable; matches content)
  - skylight_volumetric_beam (cool starlight cone from skylight to operator station)
  - em_aurora_envelope (state-conditional)
procedural_animations:
  - frequency_bars_animate (continuous radar-style sweep)
  - 52_7_indicator_pulse (continuous; period 1.2s; matches Human's heartbeat)
  - skylight_cosmic_drift (subtle starfield motion)
  - antenna_truss_subtle_sway (cosmetic)
  - operator_chair_swivel_on_proximity
reactive_systems:
  - 52_7_indicator_intensify_on_listen (with headset + within 2 m of frequency wall)
  - em_aurora_on_transmission
  - operator_glow_on_seated
  - archive_terminal_glow_on_proximity
  - first_contact_one_shot (Act 2)
```

### A.5.16 Avatar-parametricity

```
camera_height_variation:
  small_xenomorph (0.85m eye): camera height 0.85m; frequency wall feels enormous; 52.7 MHz indicator at face-level
  short_humanoid (1.40m eye): standard
  average_humanoid (1.70m eye): standard
  tall_humanoid (2.05m eye): frequency wall at chest-level
  tall_xenomorph (2.70m eye): antenna truss collides at head
reachability:
  small_xenomorph: cannot reach upper frequency-wall zones; relay-inspect; alternate "lift" mechanism
  others: all-reachable
audio_occlusion_variation:
  xenomorph_sensitive_hearing: voice fragments more pronounced; comms-static richer
  synthetic_voice_avatar: signal patterns have a different "feel" (synthetic resonance match)
```

### A.5.17 Performance

```
polygon_budget:      240,000 polygons
texture_budget:      140 MB total (frequency wall is shader-heavy)
light_count_limit:   16 simultaneous dynamic lights
lod_plan:
  - hero_distance: 0-10m, full detail
  - mid_distance: 10-20m, mid detail (frequency bars simplified)
  - low_distance: 20m+, low detail
streaming_behaviour:
  - preload: ark.corridor.comms_approach (south)
  - on_player_at_frequency_wall + Act 2+: preload signal-recordings cache for archive playback
```

---

## A.6 Observation Deck — FULL

**Status: FULL spec.** Cross-ref: `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.6 (art-state prompts).

### A.6.1 Header

```
space_id:        ark.observation_deck
space_name:      Observation Deck
space_type:      ark_room
act_introduced:  Act 1
lore_anchor:     loredex.character.eidolon + arc.eidolon_arc + arc.cosmic_witness + arc.bond_chamber_resonance
aesthetic_tier:  solar_punk_cathedral  (with cathedral-of-the-cosmos accents — the Ark's most contemplative space)
```

### A.6.2 Geometry

```
dimensions:           16.00 m × 8.00 m × 6.00 m
origin_point:         centre of floor at south entrance threshold (entrance south wall; +y axis points north toward viewport)
coordinate_axes:      +x = right, +y = forward (north — directly toward viewport), +z = up
floor_plan_geometry:  rectangular  (long-rectangle aligned east-west; viewport on long north wall)
volumetric_anomalies: none in baseline; subtle cosmic-resonance shimmer at upper volume during Eidolon manifestations
```

The Observation Deck is the Ark's largest contemplation space.
The 16m-wide × 6m-tall viewport on the north wall dominates the
room — it spans nearly the entire long wall. The reflective floor
doubles the star-field below the player's feet, creating the
illusion of standing IN space. Inner-wall benches face the
viewport. The Eidolon manifests at a designated anchor near the
viewport centre.

Floor area: 128 m².

### A.6.3 Floor

```
material_primary:     mirror-polished obsidian-black marble; 1.20 m × 1.20 m tiles; 2 mm gap (very tight; emphasises mirror); high-precision flatness for true reflection
material_secondary:   bronze inlay forming a 7-pointed star centred 4 m from the viewport; the star's points align with constellations visible in the viewport
pattern:              mirror-polish with 7-pointed star inlay at viewing-station centre
wear_state:           pristine (sacred space; meticulously maintained); slight wear at viewport approach
embedded_features:
  - id: ark.observation_deck.floor.charge_point.eidolon_anchor
    position: (0.00, 5.00, 0.00)  # at Eidolon anchor near viewport
    dimensions: 0.40 × 0.40 × 0.05
    function: Eidolon-manifestation power coupling (provides energy when Eidolon is present)
  - id: ark.observation_deck.floor.charge_point.telescope_mount
    position: (-5.00, 5.00, 0.00)
    dimensions: 0.40 × 0.40 × 0.05
    function: telescope mount power
  - id: ark.observation_deck.floor.charge_point.star_table
    position: (5.00, 5.00, 0.00)
    dimensions: 0.40 × 0.40 × 0.05
    function: star-table electronics
acoustic_property:    hard_reflective (marble); RT60 = 0.65s (long; supports cosmic atmospheric resonance)
```

### A.6.4 Walls

#### Wall: South (entrance)

```
wall_id:              south
material_primary:     polished obsidian-black marble cladding with carved cosmological motifs at z = 0.40 to 1.20 (constellations + nebulae in low relief)
material_secondary:   gold dado at z = 1.20 m
panelisation:         standard
colour_value:         --token-color-ark-observation-deck-wall-south  (deep cosmic-black with gold pin-stripe)
embedded_displays:
  - id: ark.observation_deck.south.display.celestial_almanac
    position: (-3.00, 0.20, 1.80)
    dimensions: 1.00 × 0.80 × 0.05
    content: live celestial almanac (current visible constellations + planetary positions)
  - id: ark.observation_deck.south.display.eidolon_log
    position: (3.00, 0.20, 1.80)
    dimensions: 1.00 × 0.80 × 0.05
    content: log of Eidolon manifestations (date + duration + resonance reading)
embedded_doors:
  - door_id: ark.observation_deck.south.door.main
    position: (0.00, 0.00, 0.00)
    dimensions: 1.40 × 2.40 × 0.10
    door_class: arch  (gold-inlaid bronze; opens with hush)
    connecting_space_id: ark.corridor.observation_approach
decorative_features:
  - id: ark.observation_deck.south.plaque.creed
    position: (0.00, 0.20, 3.20)
    dimensions: 1.00 × 0.40 × 0.02
    material: cast bronze with gilt text
    narrative_role: reads "TO WITNESS IS TO BE WITNESSED" — observation-deck creed
  - id: ark.observation_deck.south.relief.cosmic_witness
    position: (0.00, 0.20, 4.50)
    dimensions: 4.00 × 1.20 × 0.10
    material: cast bronze with carved figures of an observer + observed (mirror-cosmic motif)
    narrative_role: depicts "the witness and the witnessed are one" canon
```

#### Wall: East

```
wall_id:              east
material_primary:     polished obsidian-black marble (matches south)
material_secondary:   gold dado
panelisation:         standard
colour_value:         --token-color-ark-observation-deck-wall-east
embedded_displays:    none (intentional; the only display in this room is THE viewport)
embedded_doors:        none
decorative_features:
  - id: ark.observation_deck.east.painting.first_witness
    position: (7.95, 5.00, 2.40)
    dimensions: 0.80 × 1.00 × 0.04
    material: oil on canvas (depicts the first Eidolon manifestation; canonical pre-game event)
    narrative_role: lore-readable; players who inspect learn Eidolon canon
```

#### Wall: North (THE VIEWPORT WALL)

```
wall_id:              north_viewport
material_primary:     reinforced transparent aluminium oxynitride (transparent armor); 16.00 m wide × 6.00 m tall (from z = 0.00 to z = 6.00); slightly bowed outward (radius of curvature 32 m, gives a subtle 0.40 m bow at centre)
material_secondary:   bronze viewport surround; 100 mm wide; structural ribbing every 0.80 m
panelisation:         single-piece transparent armor (with structural ribbing)
colour_value:         (transparent — content is the cosmos beyond)
embedded_displays:
  - id: ark.observation_deck.north.hud_overlay
    position: (0.00, 7.95, 3.00)
    dimensions: 16.00 × 6.00 (overlay only; transparent)
    content: optional HUD overlay — constellation labels, planetary positions, distance markers (player can toggle on/off)
embedded_doors:        none
decorative_features:
  - id: ark.observation_deck.north.relief.observers_motto
    position: (0.00, 7.95, 6.50)  # high above viewport
    dimensions: 1.20 × 0.40 × 0.10
    material: cast bronze relief
    narrative_role: visible from anywhere in room; reads "WE LOOK / AND THE LOOK LOOKS BACK"
```

#### Wall: West

Mirror of east.

```
wall_id:              west
material_primary:     same as east
material_secondary:   gold dado
panelisation:         standard
colour_value:         --token-color-ark-observation-deck-wall-west
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: ark.observation_deck.west.painting.last_witness
    position: (0.05, 5.00, 2.40)
    dimensions: 0.80 × 1.00 × 0.04
    material: oil on canvas (depicts a future Eidolon manifestation that hasn't happened yet — like Game Hall west painting, content subtly shifts)
    narrative_role: uncanny lore-readable; content evolves with player's Eidolon-arc progress
```

### A.6.5 Ceiling

```
height_above_floor:     6.00 m baseline; central dome rises to 7.20 m above the Eidolon anchor (gives Eidolon its "dome of cosmos" feel); perimeter drop to 5.50 m within 1.50 m of walls
material:               polished obsidian-black marble cladding with gold-leaf coffer detailing radiating from central dome; central dome is itself a transparent panel (extends viewport feel upward)
lighting_integrated:    minimal — the room is intentionally lit primarily by the viewport's cosmos; recessed strip-lights at perimeter (very dim; warm-amber); central dome is partially transparent
atmospheric_features:   subtle dust-motes visible in any star-light beam through viewport (intensifies during Eidolon manifestations)
acoustic_treatment:     coffered + dome-resonant (slight harmonic effect from central dome curvature)
```

### A.6.6 Lighting

```
ambient_baseline:     2700 K (very warm; emergency-only baseline); 60 lux at floor level (DELIBERATELY VERY DIM — the viewport IS the room's primary light source); CRI 90
direct_fixtures:
  - id: ark.observation_deck.light.viewport_glow
    position: (0.00, 7.95, 3.00)  # at viewport
    beam_angle: 180° wash inward
    colour: variable (matches starfield content; deep cosmic-blue with white starlight points)
    intensity: variable (varies with cosmic state; 800-3000 lumens average)
    function: PRINCIPAL light source; the cosmos illuminates the room
  - id: ark.observation_deck.light.dome_starfield
    position: (0.00, 5.00, 7.20)  # central dome
    beam_angle: 90° downward
    colour: variable (matches starfield content)
    intensity: variable (similar to viewport)
    function: secondary cosmic light; gives ceiling its "extension of viewport" feel
  - id: ark.observation_deck.light.recessed_strip_perimeter
    position: along all 4 walls at z = 5.50
    beam_angle: 180° wash
    colour: --token-color-ark-observation-deck-strip  (very warm amber)
    intensity: 200 lumens per metre (dim — preserves cosmic atmosphere)
    function: ambient minimal task lighting (so player can navigate without losing cosmic feel)
  - id: ark.observation_deck.light.eidolon_anchor_resonance
    position: (0.00, 5.00, 1.80)  # at Eidolon anchor
    beam_angle: 360° (radial)
    colour: --token-color-ark-observation-deck-eidolon-glow  (variable; depends on player-Eidolon bond state)
    intensity: 500 lumens (when Eidolon manifesting; off when absent)
    function: Eidolon-presence indicator; pulses with Eidolon's resonance
practical_sources:
  - id: ark.observation_deck.telescope_eyepiece_glow
    position: (-5.00, 5.00, 1.50)
    intensity: 30 lumens (when in use; suggests "the lens is alive")
    flicker_pattern: stable
  - id: ark.observation_deck.star_table_glow
    position: (5.00, 5.00, 0.95)
    intensity: 100 lumens (always on; soft amber)
    flicker_pattern: stable
time_of_day_variation:
  acts_1_to_3: viewport is calm cosmos; Eidolon resonance very faint
  act_3+: Eidolon resonance active; Eidolon manifests during scripted events
  acts_5_to_7: viewport content reflects ship-state (e.g., if ship is damaged, distant nebulae have warning hue)
dynamic_response:
  - on_eidolon_manifestation: eidolon_anchor_resonance activates; cosmic light shifts subtly toward Eidolon's faction-tone
  - on_player_at_telescope: telescope_eyepiece_glow activates
  - on_player_at_star_table: star_table_glow intensifies 20%
  - on_cosmic_event (e.g., supernova, planetfall): viewport intensifies; ambient warms 1000K
```

### A.6.7 Atmosphere

```
air_temperature:    18°C (cool — cosmic; intentionally below typical Ark baseline)
humidity:           36% RH (low — cosmic preservation atmosphere); smells of cold-stone + bronze + faint ozone (from cosmic radiation shielding)
particulate:
  - dust_motes: low (visible in viewport-light beams; magical-quality shimmer)
  - cosmic_dust: very low (cosmetic; suggests "the cosmos enters")
volumetric_fog:     absent in baseline; subtle haze at upper dome during Eidolon manifestations (0.05 g/m³)
wind_drift:         minimal; 0.01 m/s; very subtle inward-toward-viewport convection
smell_canon:        cold-stone + bronze + ozone; voice-line: "smells like deep space leaking in"
```

### A.6.8 Sound

```
ambient_bed:           file: observation_deck_ambient_bed_v1.ogg (loop); -38 dB; very quiet; very faint deep-space resonance, occasional cosmic-shimmer (random)
point_sources:
  - id: ark.observation_deck.sound.deep_space_resonance
    position: (0.00, 7.95, 3.00)  # from viewport
    sound: continuous deep low rumble (-38 dB; suggests cosmic vastness)
    occlusion_behaviour: omnidirectional
    trigger: continuous
  - id: ark.observation_deck.sound.eidolon_breath
    position: (0.00, 5.00, 1.80)  # Eidolon anchor
    sound: very faint slow breath / cosmic whisper (only when Eidolon present; -42 dB)
    occlusion_behaviour: omnidirectional
    trigger: state-conditional
  - id: ark.observation_deck.sound.telescope_subtle_servo
    position: (-5.00, 5.00, 1.50)
    sound: telescope drive servos when in use (-36 dB)
    occlusion_behaviour: standard
    trigger: state-conditional
  - id: ark.observation_deck.sound.star_table_low_hum
    position: (5.00, 5.00, 0.95)
    sound: star-table electronics hum (-40 dB)
    occlusion_behaviour: standard
    trigger: continuous
  - id: ark.observation_deck.sound.cosmic_shimmer_random
    position: dynamic (random)
    sound: subtle cosmic-chime (random; -42 dB; period 60-180s)
    occlusion_behaviour: omnidirectional
    trigger: random
reverb_zone:           IR-impulse: observation_deck_v1.wav; wet-mix 32% (long, dome-resonant)
music_eligibility:     cutscene only (cs_amb_observation_deck Category B + Eidolon-arc cutscenes)
voice_line_eligibility:
  - speaker: your_eidolon
    trigger: presence (Acts 3+)
    line_set: see §2.6.2 Eidolon presence-line set
```

### A.6.9 Object inventory

Observation Deck has 28 inventory objects.

#### A.6.9.1 The Viewport (north wall)

Specced in walls A.6.4. Inventoried for completeness:

```
object_id:           ark.observation_deck.viewport
object_class:        display
position:            (0.00, 7.95, 3.00)
dimensions:          16.00 × 6.00 × 0.10
rotation:            180°
material_primary:    reinforced transparent aluminium oxynitride
material_secondary:  bronze surround with structural ribbing
colour_value:        (transparent)
interaction:         inert (looking only); player can lean on
narrative_role:      THE viewport; the room's primary visual; cosmos source
lore_anchor:         loredex.system.observation_viewport
art_status:          producer_handoff
gameplay_hook_id:    none (visual only)
wear_state:          pristine
physical_constraints: collides
```

#### A.6.9.2 The Eidolon Anchor (NPC manifestation point)

```
object_id:           ark.observation_deck.eidolon_anchor
object_class:        npc_anchor
position:            (0.00, 5.00, 0.00)
dimensions:          1.20 dia × 0.05 height (subtle bronze inlay marking the anchor on floor)
rotation:            0°
material_primary:    bronze inlay with engraved seven-point star
material_secondary:  gold-leaf accents
colour_value:        --token-color-ark-observation-deck-eidolon-anchor
interaction:         interactable (when Eidolon present)
  - resonate: opens Eidolon-bond UI; player can deepen bond, accept guidance, etc.
narrative_role:      THE manifestation point; Eidolon appears here when conditions are met (player's emotional state, cosmic alignment, time-of-day)
lore_anchor:         loredex.character.eidolon
art_status:          producer_handoff
gameplay_hook_id:    trpc.eidolon.resonate
wear_state:          pristine
physical_constraints: non-collide (low-profile; player can stand on it)
```

#### A.6.9.3 The Telescope (west of Eidolon anchor)

```
object_id:           ark.observation_deck.telescope
object_class:        interactive
position:            (-5.00, 5.00, 0.00)
dimensions:          0.50 × 0.50 × 1.80  (mounted on tripod)
rotation:            0°  (initially facing north toward viewport; player can pan)
material_primary:    cast bronze tube with brass detailing; reinforced glass lens at viewing end
material_secondary:  walnut grip; brass focusing ring
colour_value:        --token-color-ark-observation-deck-telescope-bronze
interaction:         interactable
  - operate: player looks through eyepiece; opens telescopic-zoom UI; can identify constellations + distant celestial objects
  - inspect: lore-note about the telescope (canonical artifact; brought aboard at commission)
narrative_role:      gameplay-active astronomical observation; player can identify cosmic objects + earn lore-flags
lore_anchor:         loredex.system.observation_telescope + arc.cosmic_witness
art_status:          producer_handoff
gameplay_hook_id:    trpc.observation.telescope.operate
wear_state:          worn at most-handled focusing-ring + grip
physical_constraints: collides; player can mount eye to eyepiece (interaction)
```

#### A.6.9.4 The Star-Chart Table (east of Eidolon anchor)

```
object_id:           ark.observation_deck.star_table
object_class:        display
position:            (5.00, 5.00, 0.00)
dimensions:          1.40 × 1.40 × 0.95
rotation:            0°
material_primary:    polished walnut frame with backlit glass top showing live star-chart
material_secondary:  brass corner caps; gold-inlay constellation lines
colour_value:        --token-color-ark-observation-deck-star-table  (warm walnut + cool starlight)
interaction:         interactable
  - operate: opens interactive star-chart UI; player can rotate, zoom, identify, and bookmark constellations
  - inspect: lore-note about the star-chart system
narrative_role:      gameplay-active navigation tool; player can identify visible cosmic landmarks; gameplay-key in Acts 5+ for navigation choices
lore_anchor:         loredex.system.observation_navigation
art_status:          producer_handoff
gameplay_hook_id:    trpc.observation.star_table.operate
wear_state:          slight wear at corner caps (most-handled)
physical_constraints: collides; player can lean
```

#### A.6.9.5-12 Eight Observation Benches (4 along south wall + 2 along east + 2 along west)

```
object_id:           ark.observation_deck.bench.<position>  (8 benches; positioned to face viewport)
object_class:        furniture
positions:           [
  (-6.00, 1.00, 0.00),  # south, position 1 (far west of door)
  (-2.00, 1.00, 0.00),  # south, position 2 (west of door)
  (2.00, 1.00, 0.00),   # south, position 3 (east of door)
  (6.00, 1.00, 0.00),   # south, position 4 (far east of door)
  (7.50, 3.00, 0.00),   # east-SE
  (7.50, 6.50, 0.00),   # east-NE
  (-7.50, 3.00, 0.00),  # west-SW
  (-7.50, 6.50, 0.00),  # west-NW
]
dimensions (each):   1.40 × 0.40 × 0.45
rotation (each):     varies (faces toward viewport)
material_primary:    polished obsidian-black marble seat with bronze-leg supports
material_secondary:  none (deliberately minimal — bench not the focus; viewport is)
colour_value:        --token-color-ark-observation-deck-bench  (dark stone)
interaction:         interactable - sit
narrative_role:      contemplation seating; player can sit and watch cosmos for extended periods (gameplay-passive but emotionally meaningful)
lore_anchor:         arc.cosmic_witness
art_status:          producer_handoff
gameplay_hook_id:    none (positional; sitting may trigger Eidolon manifestation if other conditions met)
wear_state:          slight wear at most-occupied seats (positions 1, 2, 3 have most accumulated player-presence)
physical_constraints: collides; sittable
```

#### A.6.9.13 The Curator's Plinth (lectern; east of door)

```
object_id:           ark.observation_deck.curator_plinth
object_class:        container
position:            (3.00, 1.50, 0.00)
dimensions:          0.40 × 0.40 × 1.10
rotation:            45°
material_primary:    cast bronze stand with inclined display-plate
material_secondary:  open lore-readable book (canonical "field-guide to the cosmos")
colour_value:        --token-color-ark-observation-deck-plinth-bronze
interaction:         interactable
  - inspect: opens cosmic field-guide UI (multi-screen lore-readable about visible celestial objects)
narrative_role:      provides lore-grounding for what the player sees through telescope/star-table
lore_anchor:         loredex.system.cosmic_canon + arc.cosmic_witness
art_status:          producer_handoff
gameplay_hook_id:    trpc.observation.curator_plinth.read
wear_state:          slight wear
physical_constraints: collides
```

#### A.6.9.14-20 Decorative + Lighting Stands

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.observation_deck.candle_stand.east_alcove` | decoration | (7.50, 5.00, 0.00) | 0.20 × 0.20 × 1.20 | bronze candle stand with eternal flame |
| `ark.observation_deck.candle_stand.west_alcove` | decoration | (-7.50, 5.00, 0.00) | mirror | bronze candle stand |
| `ark.observation_deck.compass_inlay` | decoration | (0.00, 5.00, 0.005) | 1.20 × 1.20 × 0.005 | floor compass-rose at Eidolon anchor (subtle gold inlay) |
| `ark.observation_deck.dust_motes_emitter` | fx_emitter | distributed throughout volume | n/a | dust-motes particle source |
| `ark.observation_deck.eidolon_resonance_emitter` | fx_emitter | (0.00, 5.00, 1.80) | n/a | volumetric Eidolon-presence shimmer |
| `ark.observation_deck.cosmic_dust_emitter` | fx_emitter | upper volume distributed | n/a | cosmic-dust particle source |
| `ark.observation_deck.dome_starfield_emitter` | fx_emitter | (0.00, 5.00, 7.20) | 4.00 dia | central dome starfield |

#### A.6.9.21-28 Closing Items

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.observation_deck.south.intercom` | console | (-2.00, 0.20, 1.50) | 0.20 × 0.10 × 0.30 | comms relay (silent in baseline) |
| `ark.observation_deck.fire_extinguisher.south` | interactive | (2.00, 0.20, 1.20) | 0.20 × 0.20 × 0.50 | safety |
| `ark.observation_deck.first_aid.kit` | container | (-2.50, 0.20, 1.50) | 0.40 × 0.10 × 0.30 | medical |
| `ark.observation_deck.south.plaque.creed` (rolled walls) | decoration | (0.00, 0.20, 3.20) | 1.00 × 0.40 × 0.02 | "TO WITNESS IS TO BE WITNESSED" |
| `ark.observation_deck.east.painting.first_witness` (rolled walls) | decoration | (7.95, 5.00, 2.40) | 0.80 × 1.00 × 0.04 | first-witness painting |
| `ark.observation_deck.west.painting.last_witness` (rolled walls) | decoration | (0.05, 5.00, 2.40) | mirror | last-witness painting (uncanny shifting) |
| `ark.observation_deck.south.relief.cosmic_witness` (rolled walls) | decoration | (0.00, 0.20, 4.50) | 4.00 × 1.20 × 0.10 | cosmic-witness relief |
| `ark.observation_deck.north.relief.observers_motto` (rolled walls) | decoration | (0.00, 7.95, 6.50) | 1.20 × 0.40 × 0.10 | "WE LOOK / AND THE LOOK LOOKS BACK" |

Total: 28 inventory objects.

### A.6.10 Camera-spawn-points (FPV cutscenes)

```
cutscene_id:         cs_amb_observation_deck  (Category B Myst-ambient; deferred catalogue)
camera_position:     (0.00, 0.50, eye_level)
camera_facing:       (0°, 5°, 0°)  # looking forward and slightly up at viewport
avatar_height_anchor: eye_level
head_motion:         very slow walk-forward toward viewport; head tilts up to take in cosmos; lasts 24s

cutscene_id:         cs_eidolon_first_manifestation  (Act 3 first-time event)
camera_position:     (0.00, 4.00, eye_level)  # near Eidolon anchor, facing it
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         standing; cosmic shimmer materialises at anchor; Eidolon's resonance fills the room
```

### A.6.11 Doorways

```
door_id:            ark.observation_deck.south.door.main
connecting_space_id: ark.corridor.observation_approach
door_position:      (0.00, 0.00, 0.00)
door_dimensions:    1.40 × 2.40 × 0.10
door_class:         arch  (gold-inlaid bronze)
unlock_condition:   Act 1+
transit_animation:  hush-open (3s); door slides slowly with reverence
audio_signature:    bronze handle + soft slide + cosmic-shimmer SFX on full open
```

### A.6.12 Adjacency map

```
direct_adjacencies:
  - ark.corridor.observation_approach (south door)
one_hop_adjacencies:
  - ark.bridge (via observation approach corridor; thematic kinship — both are cosmic surfaces)
  - ark.eidolon_sanctum (via long-route corridor; sub-room dedicated to Eidolon-bonding)
  - ark.comms_array (one-hop; signals + cosmic both arrive here)
```

### A.6.13 Gameplay hooks

```
hooks:
  - hook_id:         observation_deck.operateViewport
    trigger:         player.inspect on viewport
    procedure:       trpc.observation.viewport.inspect
    success_state:   viewport_inspected = true
  - hook_id:         observation_deck.operateTelescope
    trigger:         player.operate on telescope
    procedure:       trpc.observation.telescope.operate
    success_state:   telescope_active = true
  - hook_id:         observation_deck.operateStarTable
    trigger:         player.operate on star_table
    procedure:       trpc.observation.star_table.operate
    success_state:   star_table_active = true
  - hook_id:         observation_deck.eidolonResonate
    trigger:         (state-conditional) player.interact on eidolon_anchor when Eidolon present
    procedure:       trpc.eidolon.resonate
    success_state:   eidolon_bond_deepened = true (per-event)
  - hook_id:         observation_deck.readCuratorPlinth
    trigger:         player.inspect on curator_plinth
    procedure:       trpc.observation.curator_plinth.read
    success_state:   curator_plinth_read = true
  - hook_id:         observation_deck.takeBenchSeat
    trigger:         player.sit on bench.<position>
    procedure:       trpc.observation.bench.sit
    success_state:   bench_seat_active = true (gameplay-passive; may trigger Eidolon)
```

### A.6.14 Story-tie

```
primary_arcs:
  - arc.eidolon_arc (continuous; central to the room)
  - arc.cosmic_witness
  - arc.bond_chamber_resonance (cross-ref §A.48 Eidolon Sanctum)
  - arc.act_3_first_eidolon_manifestation (one-shot Act 3)
per_act_evolution:
  acts_0_1: room locked (player's bond not yet established)
  act_1: player gains access; viewport calm; Eidolon dormant
  act_2: telescope and star-table active; player learns cosmic landmarks
  act_3: first Eidolon manifestation (Category A cutscene); bond mechanic unlocks
  act_4: deeper Eidolon dialogues; bond ladder progression
  act_5: cosmic events (supernovae, planetfall) become visible; viewport content reflects ship-state
  act_6: rare Eidolon-witness moments (silent communion)
  act_7: state-branched: Eidolon-bonded ending (cosmic resonance pervades) vs. Eidolon-distant ending (room cold + silent)
npc_roster:
  - your_eidolon: primary NPC (cosmic presence; manifests at anchor)
  - the_player: visitor / observer
  - cosmic_phantoms: rare presence (acts 5+; visible silhouettes against viewport — never identified)
readables:
  - dedication plaque (south)
  - first-witness painting (east)
  - last-witness painting (west; uncanny shifting)
  - cosmic-witness relief (south)
  - observer's-motto relief (north)
  - curator's plinth field-guide
  - celestial almanac display (south)
  - eidolon log display (south)
master_of_rlyeh_question: n/a (Observation Deck is not a Hellbox host; but it shares cosmic-presence with HB cosmology)
```

### A.6.15 Special-FX

```
particle_systems:
  - dust_motes (low; visible in viewport-light beams)
  - cosmic_dust (very low; cosmetic; suggests "cosmos enters")
  - eidolon_shimmer (state-conditional; cyan-gold particles around Eidolon anchor when Eidolon present)
  - candle_smoke (2 candle stands; very subtle)
volumetric_effects:
  - viewport_volumetric_glow (cosmic light bleeding into room)
  - dome_starfield_volumetric (extends viewport feel into ceiling)
  - eidolon_resonance_envelope (state-conditional volumetric glow)
procedural_animations:
  - viewport_starfield_drift (continuous; very slow; matches actual cosmic motion)
  - telescope_subtle_drift (when in use; slight automatic tracking of celestial object)
  - star_table_glow_breath (slow breathing pulse)
  - eidolon_anchor_gentle_pulse (state-conditional; matches Eidolon's breathing)
  - last_witness_painting_uncanny_shift (Acts 5+; content evolves with player's Eidolon-arc)
reactive_systems:
  - viewport_glow_intensifies_on_player_approach (within 3 m, viewport content brightens 10%)
  - eidolon_anchor_warmth_on_proximity (within 2 m, anchor inlay glows softly)
  - telescope_eyepiece_glow_on_player_eye (when player looks through; eyepiece warms)
  - star_table_glow_on_proximity
  - eidolon_manifestation_one_shot (Act 3; subsequent are state-conditional)
```

### A.6.16 Avatar-parametricity

```
camera_height_variation:
  small_xenomorph (0.85m eye): camera height 0.85m; viewport feels enormous; bench seats are at chest-level — alternate climb-onto-bench animation
  short_humanoid (1.40m eye): standard short scale
  average_humanoid (1.70m eye): standard
  tall_humanoid (2.05m eye): viewport feels closer; player can see more of viewport at standing
  tall_xenomorph (2.70m eye): central dome at head-level; alternate route through room centre
reachability:
  small_xenomorph: cannot reach upper viewport zones; relay-inspect from below; alternate "lift" mechanism near telescope
  others: all-reachable
audio_occlusion_variation:
  xenomorph_sensitive_hearing: deep-space resonance more pronounced; cosmic shimmer more frequent
  synthetic_voice_avatar: Eidolon's resonance has a distinct "feel" (synthetic ear interprets cosmic frequencies differently)
```

### A.6.17 Performance

```
polygon_budget:      260,000 polygons (large rectangular space; viewport is shader-heavy)
texture_budget:      180 MB total (cosmic skybox shader + reflective floor are expensive)
light_count_limit:   12 simultaneous dynamic lights (viewport + dome are hero; everything else minimal)
lod_plan:
  - hero_distance: 0-12m, full detail
  - mid_distance: 12-25m, mid detail (bench detail simplified)
  - low_distance: 25m+, low detail
streaming_behaviour:
  - preload: ark.corridor.observation_approach (south)
  - on_eidolon_manifestation: preload destination.eidolon_sanctum (sub-room available for deep-bond cutscenes)
```

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

## A.8 Forge Workshop — FULL

**Status: FULL spec.** Cross-ref: `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.8 (art-state prompts). Companion to Engineering Bay (§A.7);
forge gameplay accessed from Engineering's east door.

### A.8.1 Header

```
space_id:        ark.forge_workshop
space_name:      Forge Workshop
space_type:      ark_room
act_introduced:  Act 3
lore_anchor:     loredex.faction.mechronis + arc.crafting_progression + arc.forge_legacy
aesthetic_tier:  solar_punk_cathedral  (with industrial-heat accents — the most overtly industrial space on the Ark)
```

### A.8.2 Geometry

```
dimensions:           11.00 m × 11.00 m × 6.00 m
origin_point:         centre of floor at south entrance threshold
coordinate_axes:      +x = right, +y = forward (north), +z = up
floor_plan_geometry:  rectangular  (with the forge-chimney rising through the ceiling at room centre, taking the room's vertical height to 6.00 m)
volumetric_anomalies: none in baseline; minor heat-shimmer at upper volume (cosmetic)
```

The Forge is a square workshop with the central forge-fire as
its heart. The chimney rises through the ceiling. Anvils flank
the forge; hammer-stations line the east and west walls;
quench-tanks line the north wall. The room is louder, hotter,
and more visceral than other Ark rooms.

Floor area: 121 m².

### A.8.3 Floor

```
material_primary:     industrial cast-iron grating with heat-resistant coating; 1.00 m × 1.00 m panels with 40 mm × 6 mm slot pattern; allows heat dissipation and slag management
material_secondary:   solid cast-iron plate at central forge zone (3.00 × 3.00 m square; thicker than grating; resists ember scorch); brass perimeter trim
pattern:              grating with central solid plate; subtle anti-slip tread pattern
wear_state:           well-used; scorch-marks accumulate around forge; oil-stains around quench-tanks; hammer-rebound dents around anvils
embedded_features:
  - id: ark.forge_workshop.floor.charge_point.forge
    position: (0.00, 5.50, 0.00)  # under forge fire
    dimensions: 0.40 × 0.40 × 0.05
    function: forge-fire ignition + heat regulation
  - id: ark.forge_workshop.floor.slag_drain.east
    position: (4.50, 5.50, 0.00)
    dimensions: 0.30 × 0.30 × 0.10
    function: molten-slag drainage
  - id: ark.forge_workshop.floor.slag_drain.west
    position: (-4.50, 5.50, 0.00)
    dimensions: 0.30 × 0.30 × 0.10
    function: molten-slag drainage (mirror)
  - id: ark.forge_workshop.floor.quench_tank_anchor.<n>  (3 anchors)
    position: along north wall (y = 9.00); x = -3.00, 0.00, +3.00
    dimensions: 0.80 × 0.80 × 0.10 each
    function: quench-tank base + water/oil-coolant supply
acoustic_property:    hard_reflective with heat-shimmer-induced acoustic distortion; RT60 = 0.55s
```

### A.8.4 Walls

#### Wall: South (entrance)

```
wall_id:              south
material_primary:     painted steel panel with rivet-detail; matte slate-grey with copper accents
material_secondary:   bronze dado at z = 1.10 m
panelisation:         standard
colour_value:         --token-color-ark-forge-workshop-wall-south  (slate-grey + copper pin-stripe)
embedded_displays:
  - id: ark.forge_workshop.south.display.recipe_index
    position: (-3.00, 0.20, 1.80)
    dimensions: 1.20 × 0.80 × 0.05
    content: forge recipe index (player's known recipes)
  - id: ark.forge_workshop.south.display.heat_state
    position: (3.00, 0.20, 1.80)
    dimensions: 1.20 × 0.80 × 0.05
    content: live forge-temperature gauge + slag-drain status
embedded_doors:
  - door_id: ark.forge_workshop.south.door.main
    position: (0.00, 0.00, 0.00)
    dimensions: 1.40 × 2.40 × 0.10
    door_class: pressure_seal  (heat-isolation; thermal barrier)
    connecting_space_id: ark.engineering_bay  (east door of Engineering Bay opens to this)
decorative_features:
  - id: ark.forge_workshop.south.plaque.creed
    position: (0.00, 0.20, 3.20)
    dimensions: 1.00 × 0.40 × 0.02
    material: cast bronze with engraved text + heat-anodised colouring
    narrative_role: reads "FIRE FORGES; HAND SHAPES" — Mechronis-faction creed
  - id: ark.forge_workshop.south.warning_sign.high_heat
    position: (4.00, 0.20, 3.50)
    dimensions: 0.40 × 0.30 × 0.01
    material: yellow-and-black painted steel
    narrative_role: high-temperature warning
```

#### Wall: East (with hammer-stations)

```
wall_id:              east
material_primary:     painted steel panel; reinforced with structural ribbing
material_secondary:   bronze dado
panelisation:         standard
colour_value:         --token-color-ark-forge-workshop-wall-east
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: ark.forge_workshop.east.hammer_rack
    position: (4.95, 5.50, 0.00)
    dimensions: 0.40 × 4.00 × 2.40
    material: iron rack with hanging hammers (varied sizes)
    narrative_role: hammer storage; player can select hammer for crafting
  - id: ark.forge_workshop.east.hammer_station.work_zone
    position: (4.00, 5.50, 0.00)
    dimensions: 1.50 × 1.50 × 0.85 (anvil + workzone)
    material: cast iron anvil on stone block
    narrative_role: east hammer-work station; dedicated to small-piece work (jewellery, components)
```

#### Wall: North (with quench-tanks)

```
wall_id:              north
material_primary:     painted steel panel; reinforced
material_secondary:   bronze dado
panelisation:         standard
colour_value:         --token-color-ark-forge-workshop-wall-north
embedded_displays:
  - id: ark.forge_workshop.north.display.crafting_journal
    position: (0.00, 10.95, 1.80)
    dimensions: 1.40 × 0.80 × 0.05
    content: master craftsmen's recorded notes (journal entries from past Mechronis masters)
embedded_doors:
  - door_id: ark.forge_workshop.north.hatch.exhaust
    position: (-4.00, 10.95, 0.40)  # low hatch for slag-removal access
    dimensions: 0.80 × 1.40 × 0.10
    door_class: slide
    connecting_space_id: ark.cargo_hold (slag-removal route)
    unlock_condition: Act 3+ (when player needs to remove crafted goods)
decorative_features:
  - id: ark.forge_workshop.north.quench_tank.<position>  (3 tanks: water, oil, mercury-equivalent)
    position: (-3.00, 9.00, 0.00), (0.00, 9.00, 0.00), (3.00, 9.00, 0.00)
    dimensions: 0.80 × 0.80 × 1.40 each (deep tanks)
    material: cast iron with bronze trim
    narrative_role: quench-tanks for cooling crafted pieces; each fluid affects final piece's properties
```

#### Wall: West (with hammer-stations; mirror of east)

```
wall_id:              west
material_primary:     same as east
material_secondary:   bronze dado
panelisation:         standard
colour_value:         --token-color-ark-forge-workshop-wall-west
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: ark.forge_workshop.west.hammer_rack (mirror of east)
  - id: ark.forge_workshop.west.hammer_station.work_zone (mirror; dedicated to large-piece work — weapons + armor)
    position: (-4.00, 5.50, 0.00)
    dimensions: 1.50 × 1.50 × 0.85
```

### A.8.5 Ceiling

```
height_above_floor:     6.00 m baseline; central chimney rises through ceiling at z = 6.00 (chimney visible up to z = 12.00 when looking up)
material:               exposed steel framework with heat-resistant ceramic-tile sections; central chimney is cast-iron (visible internal heat-glow)
lighting_integrated:    suspended industrial pendants on 2.40 × 2.40 grid (excluding chimney zone); central chimney has internal LED accent for heat-visibility
atmospheric_features:   visible heat-shimmer rising from forge through chimney; smoke-haze pools at ceiling perimeter
acoustic_treatment:     coffered with heat-resistant baffling
```

### A.8.6 Lighting

```
ambient_baseline:     3000 K (warm; firelight equivalent); 220 lux at floor level; CRI 88
direct_fixtures:
  - id: ark.forge_workshop.light.high_bay_array
    position: distributed at z = 5.50 on 2.40 × 2.40 grid (4 fixtures around chimney)
    beam_angle: 90°
    colour: --token-color-ark-forge-workshop-high-bay  (warm industrial)
    intensity: 4000 lumens each
    function: ambient task lighting
  - id: ark.forge_workshop.light.forge_fire_glow
    position: (0.00, 5.50, 0.50)  # at forge fire centre
    beam_angle: 360° (radial)
    colour: --token-color-ark-forge-workshop-forge-glow  (orange-red; varies with heat state — 800-2000K equivalent)
    intensity: 8000 lumens (variable based on forge active state)
    function: punctuation; the forge IS the room's primary visual element
  - id: ark.forge_workshop.light.hammer_station_task.east, .west
    position: above each hammer-station at z = 4.00
    beam_angle: 30° downward
    colour: 5500 K bright
    intensity: 5000 lumens each
    function: precision task lighting at anvil work-zones
practical_sources:
  - id: ark.forge_workshop.quench_tank.ember_glow.<n>  (3 emitters)
    position: per quench-tank top
    intensity: 100 lumens (when quenching; bursts of ember-light)
    flicker_pattern: irregular
  - id: ark.forge_workshop.chimney.internal_glow
    position: (0.00, 5.50, 6.00)  # chimney interior
    intensity: 1500 lumens (when forge active; visible from below)
    flicker_pattern: matches forge rhythm
time_of_day_variation:
  acts_3_to_7: stable lighting; in late-act7, if player has crafted heavily, scorch-marks accumulate visibly on floor + walls; if not, floor is pristine
dynamic_response:
  - on_forge_ignite: forge_fire_glow activates; ambient warms to 2400 K (very warm)
  - on_quench: quench_tank ember_glow flashes; brief steam-burst
  - on_hammer_strike: localised flash + sound
```

### A.8.7 Atmosphere

```
air_temperature:    32°C baseline (very warm — the Ark's hottest interior); rises to 42°C during active forging
humidity:           20% RH (very dry); smells of hot iron + coal-smoke + quench-water-evaporation + oil
particulate:
  - type: smoke
    density: medium during active forge; low in baseline
    colour: blue-grey
    drift_direction: upward toward chimney
  - type: ember
    density: low (cosmetic; sparks from anvil work)
    colour: bright orange (lifetime <0.5s)
    drift_direction: random spray from hammer strikes
  - type: steam
    density: spike during quenching; otherwise zero
    colour: white-translucent
    drift_direction: rises rapidly
volumetric_fog:     subtle haze at upper volume during active states (0.20 g/m³, warm-grey)
wind_drift:         strong upward draft toward chimney; 0.80 m/s convection
smell_canon:        hot iron + coal-smoke + quench-evaporation + oil; voice-line: "smells like the world's beginning"
```

### A.8.8 Sound

```
ambient_bed:           file: forge_workshop_ambient_bed_v1.ogg (loop); -28 dB; deep forge-fire roar (continuous), occasional metal-creak from cooling pieces, distant chimney-draft hum
point_sources:
  - id: ark.forge_workshop.sound.forge_fire_roar
    position: (0.00, 5.50, 0.50)
    sound: deep fire-roar (continuous, -22 dB; varies with intensity)
    occlusion_behaviour: omnidirectional
    trigger: continuous (active state)
  - id: ark.forge_workshop.sound.chimney_draft
    position: (0.00, 5.50, 5.50)
    sound: continuous draft-pull (-32 dB)
    occlusion_behaviour: omnidirectional
    trigger: continuous
  - id: ark.forge_workshop.sound.hammer_strike  (per-strike SFX)
    position: dynamic (per hammer-station)
    sound: anvil ring (per-strike; -18 dB; bright)
    occlusion_behaviour: standard
    trigger: per-action
  - id: ark.forge_workshop.sound.quench_hiss  (per-quench SFX)
    position: dynamic (per quench-tank)
    sound: violent steam-hiss (per-quench; -20 dB)
    occlusion_behaviour: standard
    trigger: per-action
  - id: ark.forge_workshop.sound.metal_creak
    position: distributed (cooling pieces)
    sound: occasional creak (random; -38 dB)
    occlusion_behaviour: standard
    trigger: random (period 30-60s)
reverb_zone:           IR-impulse: forge_workshop_v1.wav; wet-mix 26% (industrial reverb)
music_eligibility:     cutscene only (Category B cs_amb_forge_workshop; deferred catalogue)
voice_line_eligibility:
  - speaker: forgemaster (named NPC; rare presence)
    trigger: state-conditional
    line_set: see §2.8.2
```

### A.8.9 Object inventory

Forge Workshop has 32 inventory objects.

#### A.8.9.1 The Central Forge

```
object_id:           ark.forge_workshop.forge.central
object_class:        interactive  (also fx_emitter — primary heat + light source)
position:            (0.00, 5.50, 0.00)
dimensions:          2.00 × 2.00 × 1.40  (forge body + chimney base)
rotation:            0°
material_primary:    cast-iron forge body with brass-trim accents; firebrick interior
material_secondary:  bronze regulating-valves and bellows-handle
colour_value:        --token-color-ark-forge-workshop-forge-iron
interaction:         interactable
  - operate: opens forge-control UI (player adjusts heat, opens/closes bellows, prepares for crafting)
  - inspect: lore-note about the forge's history (canonically pre-Ark; the oldest functional forge in the fleet)
narrative_role:      THE forge; central focal point; player crafts here; canonically a Mechronis sacred object
lore_anchor:         loredex.faction.mechronis + arc.crafting_progression
art_status:          producer_handoff
gameplay_hook_id:    trpc.forge.forge_central.operate
wear_state:          well-used; soot-blackened; brass valves polished from use
physical_constraints: collides; player can lean
```

#### A.8.9.2-3 Two Anvils (east + west of forge)

```
object_id:           ark.forge_workshop.anvil.east, .west
object_class:        interactive
positions:           (4.00, 5.50, 0.00), (-4.00, 5.50, 0.00)
dimensions (each):   0.80 × 0.40 × 0.85 (anvil) on 0.80 × 0.80 × 0.85 stone block
rotation:            varies (faces forge)
material_primary:    cast-iron anvil top; stone-block base
material_secondary:  brass identification plate
colour_value:        --token-color-ark-forge-workshop-anvil
interaction:         interactable
  - operate: hammer-strike crafting UI (paired with hammer from east/west rack)
  - inspect: lore-note about anvil (each is a different age; east is younger, west is older)
narrative_role:      where player shapes hot pieces; east anvil for small work, west for large work
lore_anchor:         loredex.faction.mechronis + arc.crafting_progression
art_status:          producer_handoff
gameplay_hook_id:    trpc.forge.anvil.operate
wear_state:          worn at most-struck zones (centre-east of east anvil; centre-west of west anvil)
physical_constraints: collides
```

#### A.8.9.4-5 Two Hammer Racks (east + west)

```
object_id:           ark.forge_workshop.hammer_rack.east, .west
object_class:        container
positions:           (4.95, 5.50, 0.00), (-4.95, 5.50, 0.00)
dimensions (each):   0.40 × 4.00 × 2.40
rotation:            varies (parallel to wall)
material_primary:    iron rack with hanging hammers (8 hammers per rack, varied sizes/types)
material_secondary:  brass labels per slot
colour_value:        --token-color-ark-forge-workshop-hammer-rack
interaction:         interactable
  - select_hammer: player selects hammer for use at adjacent anvil (gameplay-key — different hammers for different pieces)
  - inspect: lore-note about hammer types
narrative_role:      crafting-tool selection; visual demonstration of progression (some slots empty until player progresses)
lore_anchor:         loredex.system.crafting_tools
art_status:          producer_handoff
gameplay_hook_id:    trpc.forge.hammer_rack.select
wear_state:          slight wear at most-used slots
physical_constraints: collides
```

#### A.8.9.6-8 Three Quench Tanks (north wall)

```
object_id:           ark.forge_workshop.quench_tank.water, .oil, .mercury
object_class:        interactive
positions:           (-3.00, 9.00, 0.00), (0.00, 9.00, 0.00), (3.00, 9.00, 0.00)
dimensions (each):   0.80 × 0.80 × 1.40
rotation:            0°
material_primary:    cast-iron tanks with bronze trim; each has a distinct colour-coded bronze label
material_secondary:  brass valve-handles
colour_value:        --token-color-ark-forge-workshop-quench-tank
interaction:         interactable
  - quench_piece: player drops hot piece in tank (gameplay-key — affects final piece properties)
  - inspect: lore-note about each fluid (water for hardness, oil for resilience, mercury-equivalent for arcane properties)
narrative_role:      cooling stations; each fluid has different gameplay properties; player chooses based on desired output
lore_anchor:         loredex.system.crafting_quenching
art_status:          producer_handoff
gameplay_hook_id:    trpc.forge.quench_tank.use
wear_state:          rim-wear at most-used (water tank typically); fluid-stains around base
physical_constraints: collides
```

#### A.8.9.9-12 Four Tool Storage Cabinets

```
object_id:           ark.forge_workshop.tool_cabinet.<position>  (4 cabinets distributed in corners)
positions:           [
  (-4.50, 1.50, 0.00),  # SW
  (4.50, 1.50, 0.00),   # SE
  (-4.50, 9.50, 0.00),  # NW (near quench tanks)
  (4.50, 9.50, 0.00),   # NE
]
dimensions (each):   0.60 × 0.40 × 1.80
rotation:            varies
material_primary:    cast-iron cabinet with brass handle
material_secondary:  brass nameplate (categorised tools)
colour_value:        --token-color-ark-forge-workshop-tool-cabinet
interaction:         interactable
  - open: contains tongs, files, calipers, brushes (varied tools)
  - inspect: lore-note
narrative_role:      tool storage; player accesses additional tools for fine work
lore_anchor:         loredex.system.crafting_tools
art_status:          producer_handoff
gameplay_hook_id:    trpc.forge.tool_cabinet.open
wear_state:          slight wear at handle
physical_constraints: collides
```

#### A.8.9.13-16 Four Workbenches (perimeter; for assembly + finishing)

```
object_id:           ark.forge_workshop.workbench.<position>  (4 benches between cabinets)
positions:           [
  (-3.00, 1.50, 0.00), (3.00, 1.50, 0.00),    # south (near entrance)
  (-3.00, 9.00, 0.00), (3.00, 9.00, 0.00),    # north (near quench)
]
dimensions (each):   1.20 × 0.60 × 0.95
rotation:            varies
material_primary:    cast-iron frame with hardwood top + leather inset for fine work
material_secondary:  brass corner caps; vise mounted on each
colour_value:        --token-color-ark-forge-workshop-workbench
interaction:         interactable
  - operate: opens fine-finishing UI (assembly, polishing, engraving)
  - inspect: lore-note
narrative_role:      fine-finishing zones; player assembles components after forging + quenching
lore_anchor:         loredex.system.crafting_finishing
art_status:          producer_handoff
gameplay_hook_id:    trpc.forge.workbench.operate
wear_state:          worn at most-used zones; vise jaws worn
physical_constraints: collides
```

#### A.8.9.17 Forgemaster's Anchor (NPC anchor)

```
object_id:           ark.forge_workshop.forgemaster_anchor
object_class:        npc_anchor
position:            (0.00, 4.00, 0.00)  # in front of forge
dimensions:          0.80 × 0.80 × 1.80 (anchor)
rotation:            varies (NPC pose-driven)
material_primary:    n/a
material_secondary:  n/a
colour_value:        n/a
interaction:         n/a (NPC presence)
narrative_role:      where the Forgemaster (named NPC TBD) anchors when present (rare); typically he's in transit or absent
lore_anchor:         loredex.character.forgemaster + arc.forge_legacy
art_status:          producer_handoff
gameplay_hook_id:    none (presence-driven)
wear_state:          n/a
physical_constraints: n/a
```

#### A.8.9.18-25 Atmospheric + Decorative

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.forge_workshop.bellows.east` | interactive | (1.50, 5.50, 1.00) on forge side | 0.40 × 0.30 × 0.30 | brass bellows handle (active state) |
| `ark.forge_workshop.coal_bin.west` | container | (-3.00, 4.00, 0.00) | 0.80 × 0.40 × 0.80 | coal/fuel storage |
| `ark.forge_workshop.coal_bin.east` | container | (3.00, 4.00, 0.00) | mirror | coal storage |
| `ark.forge_workshop.water_bucket.east` | decoration | (4.50, 4.00, 0.00) | 0.30 × 0.30 × 0.40 | water bucket (cosmetic; emergency) |
| `ark.forge_workshop.water_bucket.west` | decoration | (-4.50, 4.00, 0.00) | mirror | water bucket |
| `ark.forge_workshop.completed_pieces_rack.east` | container | (4.50, 8.00, 0.00) | 0.40 × 1.20 × 1.80 | finished work display |
| `ark.forge_workshop.completed_pieces_rack.west` | container | (-4.50, 8.00, 0.00) | mirror | display |
| `ark.forge_workshop.bellows.west` | interactive | (-1.50, 5.50, 1.00) | mirror | bellows handle |

#### A.8.9.26-32 Closing Items

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.forge_workshop.south.intercom` | console | (-2.00, 0.20, 1.50) | 0.20 × 0.10 × 0.30 | comms relay |
| `ark.forge_workshop.fire_extinguisher.south` | interactive | (2.00, 0.20, 1.20) | 0.20 × 0.20 × 0.50 | safety |
| `ark.forge_workshop.fire_extinguisher.east` | interactive | (4.95, 1.50, 1.20) | mirror | redundant safety |
| `ark.forge_workshop.fire_extinguisher.west` | interactive | (-4.95, 1.50, 1.20) | mirror | redundant safety |
| `ark.forge_workshop.first_aid.kit` | container | (-2.50, 0.20, 1.50) | 0.40 × 0.10 × 0.30 | medical |
| `ark.forge_workshop.fire_alarm.east` | fx_emitter | (4.95, 8.00, 4.50) | 0.20 × 0.20 × 0.20 | fire-alarm strobe (off in baseline) |
| `ark.forge_workshop.fire_alarm.west` | fx_emitter | (-4.95, 8.00, 4.50) | mirror | strobe |

Total: 32 inventory objects.

### A.8.10 Camera-spawn-points (FPV cutscenes)

```
cutscene_id:         cs_amb_forge_workshop  (Category B; deferred catalogue)
camera_position:     (0.00, 0.50, eye_level)
camera_facing:       (0°, 5°, 0°)  # facing forge with slight upward tilt
avatar_height_anchor: eye_level
head_motion:         slow approach to forge; head turns to anvils; lasts 18s

cutscene_id:         cs_first_forge_use  (Act 3 first crafting)
camera_position:     (0.00, 4.50, eye_level)  # at forge approach
camera_facing:       (0°, -10°, 0°)  # looking down at forge
avatar_height_anchor: eye_level
head_motion:         hand-rig enters frame; tongs lift heated piece; ember-shower; lasts ~12s
```

### A.8.11 Doorways

```
door_id:            ark.forge_workshop.south.door.main
connecting_space_id: ark.engineering_bay  (Engineering's east door connects here)
door_position:      (0.00, 0.00, 0.00)
door_dimensions:    1.40 × 2.40 × 0.10
door_class:         pressure_seal  (heat-isolation; thermal barrier)
unlock_condition:   Act 3+
transit_animation:  airlock-cycle (3s)
audio_signature:    pneumatic-hiss + magnetic-clack + heat-warmth-equalisation tone

door_id:            ark.forge_workshop.north.hatch.exhaust
connecting_space_id: ark.cargo_hold (slag-removal route)
door_position:      (-4.00, 10.95, 0.40)
door_dimensions:    0.80 × 1.40 × 0.10
door_class:         slide
unlock_condition:   Act 3+ (when player needs cargo-output)
transit_animation:  fade
audio_signature:    pneumatic-hiss + servo-whir
```

### A.8.12 Adjacency map

```
direct_adjacencies:
  - ark.engineering_bay (south door; via Engineering's east door)
  - ark.cargo_hold (north exhaust hatch; for finished-piece transport)
one_hop_adjacencies:
  - ark.armory (via Engineering Bay; tactical equipment chain)
  - ark.trade_hub (via Cargo Hold; trade economy)
```

### A.8.13 Gameplay hooks

```
hooks:
  - hook_id:         forge_workshop.operateForge
    trigger:         player.operate on forge.central
    procedure:       trpc.forge.forge_central.operate
    success_state:   forge_active = true
  - hook_id:         forge_workshop.useAnvil
    trigger:         player.operate on anvil.<position> with selected hammer
    procedure:       trpc.forge.anvil.operate
    success_state:   anvil_active = true (per-strike adds gameplay state)
  - hook_id:         forge_workshop.selectHammer
    trigger:         player.select_hammer on hammer_rack.<position>
    procedure:       trpc.forge.hammer_rack.select
    success_state:   hammer_held = <hammer_id>
  - hook_id:         forge_workshop.quenchPiece
    trigger:         player.quench_piece on quench_tank.<fluid> with hot piece in inventory
    procedure:       trpc.forge.quench_tank.use
    success_state:   piece_quenched = <piece_id> with <fluid> properties
  - hook_id:         forge_workshop.useWorkbench
    trigger:         player.operate on workbench.<position>
    procedure:       trpc.forge.workbench.operate
    success_state:   workbench_active = true
  - hook_id:         forge_workshop.openToolCabinet
    trigger:         player.open on tool_cabinet.<position>
    procedure:       trpc.forge.tool_cabinet.open
    success_state:   tool_cabinet_open = true
  - hook_id:         forge_workshop.useBellows
    trigger:         player.interact on bellows.<east|west>
    procedure:       trpc.forge.bellows.use
    success_state:   bellows_active = true (heat regulation)
```

### A.8.14 Story-tie

```
primary_arcs:
  - arc.act_3_first_forge_use
  - arc.crafting_progression (continuous)
  - arc.forge_legacy (Mechronis-faction history; revealed via journal in Act 5)
  - arc.act_3_HB4_invocation (cross-ref §A.7 Engineering; HB4 Mechronis Academy unlocks crafting tutorials)
per_act_evolution:
  acts_0_2: room locked
  act_3: first crafting available; basic recipes; HB4 unlocks reveal advanced techniques
  act_4: more recipes; new hammer types unlock
  act_5: forgemaster journal lore reveal; legacy crafting recipes available
  act_6: legendary crafting unlocked (rare materials)
  act_7: state-branched: master craftsman ending (room shows accumulated wear + many completed pieces) vs. neglectful ending (clean but unproductive)
npc_roster:
  - the_forgemaster: named NPC (TBD canon); rare presence Acts 3+
  - the_player: visitor / craftsman
  - mechronis_apprentices: rare cosmetic NPCs (Acts 5+)
readables:
  - dedication plaque (south)
  - heat-state display (south)
  - recipe-index display (south)
  - crafting journal display (north)
  - tool-cabinet labels (per-cabinet)
  - hammer-rack labels (per-slot)
  - quench-tank labels (per-fluid)
master_of_rlyeh_question: n/a
```

### A.8.15 Special-FX

```
particle_systems:
  - smoke (medium during active forge; rises through chimney)
  - ember (low; sparks from hammer strikes)
  - steam (spike during quenching)
  - heat_shimmer (continuous above forge; cosmetic distortion)
volumetric_effects:
  - forge_volumetric_glow (radial from forge fire)
  - chimney_internal_glow (vertical light shaft up through chimney)
  - heat_shimmer_envelope (above forge; warps light slightly)
procedural_animations:
  - forge_fire_dance (continuous; flame motion)
  - bellows_pump_animation (when used; cosmetic)
  - quench_steam_burst (per-quench)
  - hammer_rebound (per-strike)
  - cooling_pieces_subtle_glow_fade (newly-quenched pieces glow then fade over 30s)
reactive_systems:
  - forge_glow_intensify_on_player_proximity
  - anvil_ring_on_strike
  - quench_hiss_on_use
  - heat_warmth_perception (player-camera radial heat-effect when close to forge — slight distortion)
```

### A.8.16 Avatar-parametricity

```
camera_height_variation:
  small_xenomorph (0.85m eye): camera height 0.85m; forge feels enormous; alternate stand-on-step at anvils
  short_humanoid (1.40m eye): standard
  average_humanoid (1.70m eye): standard
  tall_humanoid (2.05m eye): high-bay fixtures at near-head level
  tall_xenomorph (2.70m eye): chimney structure at head; alternate route around forge
reachability:
  small_xenomorph: cannot reach top hammer-rack hammers; alternate ladder
  small_xenomorph: cannot reach quench tank rim from standing; alternate step provided
  others: all-reachable
audio_occlusion_variation:
  xenomorph_sensitive_hearing: forge-roar and anvil-ring overwhelming; alternate ambient-mute setting
  synthetic_voice_avatar: heat-effects perceived differently
```

### A.8.17 Performance

```
polygon_budget:      280,000 polygons (rich industrial detail; forge fire shader is expensive)
texture_budget:      170 MB total
light_count_limit:   16 simultaneous dynamic lights
lod_plan:
  - hero_distance: 0-10m, full detail
  - mid_distance: 10-22m, mid detail (small tools simplified)
  - low_distance: 22m+, low detail
streaming_behaviour:
  - preload: ark.engineering_bay (south door)
  - on_player_at_forge + Act 3+: preload crafting recipe assets
```

---

## A.9 Armory — FULL

**Status: FULL spec.** Cross-ref: `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.9 (art-state prompts) and §A.47 CADES Console / Mission
Briefing Pod.

### A.9.1 Header

```
space_id:        ark.armory
space_name:      Armory
space_type:      ark_room
act_introduced:  Act 2
lore_anchor:     loredex.system.armory + arc.combat_progression + arc.cades_loadout
aesthetic_tier:  solar_punk_cathedral  (military-tactical; austere but functional)
```

### A.9.2 Geometry

```
dimensions:           10.00 m × 10.00 m × 4.00 m
origin_point:         centre of floor at south entrance threshold
coordinate_axes:      +x = right, +y = forward, +z = up
floor_plan_geometry:  rectangular
volumetric_anomalies: none
```

The Armory is a square, austere room. Weapons racks line east
and west walls. Armor lockers line the north wall (10 personal
loadout cubicles). Central area has a tactical loadout station
where players prepare for CADES missions. Compact and efficient
— the Armory is utilitarian by design.

Floor area: 100 m².

### A.9.3 Floor

```
material_primary:     industrial steel deck plate with anti-static coating; 1.00 m × 1.00 m tiles; 4 mm gap; tactical-grid etch pattern
material_secondary:   bronze inlay outlining central loadout zone (3 × 3 m square); brass perimeter trim
pattern:              tactical grid + central square loadout-marker
wear_state:           pristine in early acts; in Act 4+ wear-trail to most-used loadout positions
embedded_features:
  - id: ark.armory.floor.charge_point.loadout_station
    position: (0.00, 5.00, 0.00)  # under loadout station
    dimensions: 0.40 × 0.40 × 0.05
    function: loadout-station electronics
  - id: ark.armory.floor.weapon_rack_anchor.east, .west  (continuous strips)
    position: along east + west walls
    dimensions: 0.10 × 8.00 × 0.05 each
    function: weapon-rack power + security-coupling
  - id: ark.armory.floor.locker_anchor.<n>  (10 anchors along north wall)
    position: per locker base
    dimensions: 0.40 × 0.40 × 0.05 each
    function: locker electronics + biometric-coupling
acoustic_property:    hard_reflective (steel); RT60 = 0.40s (intentionally clean acoustic for tactical comms clarity)
```

### A.9.4 Walls

#### Wall: South (entrance)

```
wall_id:              south
material_primary:     painted steel panel with rivet-detail; matte gunmetal
material_secondary:   bronze dado at z = 1.10 m
panelisation:         standard
colour_value:         --token-color-ark-armory-wall-south  (gunmetal-grey + tactical-amber pin-stripe at z = 2.00 m)
embedded_displays:
  - id: ark.armory.south.display.alert_status
    position: (-3.00, 0.20, 1.80)
    dimensions: 1.00 × 0.80 × 0.05
    content: current alert level (matches Defense Command Center)
  - id: ark.armory.south.display.loadout_history
    position: (3.00, 0.20, 1.80)
    dimensions: 1.00 × 0.80 × 0.05
    content: player's loadout history + mission outcomes
embedded_doors:
  - door_id: ark.armory.south.door.main
    position: (0.00, 0.00, 0.00)
    dimensions: 1.40 × 2.40 × 0.10
    door_class: pressure_seal  (security; biometric authentication)
    connecting_space_id: ark.engineering_bay  (Engineering's west door connects here)
decorative_features:
  - id: ark.armory.south.plaque.creed
    position: (0.00, 0.20, 3.20)
    dimensions: 1.00 × 0.40 × 0.02
    material: cast bronze with deep-etched text
    narrative_role: reads "WE ARM AGAINST WHAT THE DARK WILL BRING"
```

#### Wall: East (weapons rack)

```
wall_id:              east
material_primary:     painted steel panel + reinforced weapons-display backing
material_secondary:   bronze dado
panelisation:         standard
colour_value:         --token-color-ark-armory-wall-east
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: ark.armory.east.weapons_rack
    position: (4.95, 5.00, 0.00)
    dimensions: 0.40 × 8.00 × 3.40
    material: reinforced steel rack with mag-locks
    narrative_role: weapons display + storage; player can take/return weapons (gameplay-key for CADES missions)
```

#### Wall: North (loadout cubicles)

```
wall_id:              north
material_primary:     painted steel panel with 10 vertical loadout cubicles
material_secondary:   bronze dado + bronze name-plates per cubicle
panelisation:         10 cubicles (each 1.00 × 0.50 × 4.00) along the wall
colour_value:         --token-color-ark-armory-wall-north
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: ark.armory.north.loadout_cubicle.<n>  (10 cubicles at x = -4.5, -3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5, 4.5)
    position: distributed
    dimensions: 1.00 × 0.50 × 4.00 each (full-height cubicle for armor + weapons)
    material: reinforced steel with bronze name-plate
    narrative_role: per-player or per-mission loadout cubicles; cubicle 6 (x = 0.5) is the player's primary
  - id: ark.armory.north.relief.tactical_doctrine
    position: (0.00, 9.85, 4.00)  # high above cubicles
    dimensions: 1.20 × 0.40 × 0.10
    material: cast bronze
    narrative_role: reads "AIM TRUE / HOLD GROUND / RETURN HOME"
```

#### Wall: West (weapons rack; mirror of east)

```
wall_id:              west
material_primary:     same as east
material_secondary:   bronze dado
panelisation:         standard
colour_value:         --token-color-ark-armory-wall-west
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: ark.armory.west.weapons_rack (mirror)
```

### A.9.5 Ceiling

```
height_above_floor:     4.00 m baseline; central drop coffer at 3.50 m above loadout station (tactical intimacy)
material:               painted steel with industrial conduits visible
lighting_integrated:    recessed cool-white grid 1.20 m × 1.20 m; central coffer is task-light over loadout station
atmospheric_features:   minimal — utilitarian space
acoustic_treatment:     baffled
```

### A.9.6 Lighting

```
ambient_baseline:     5500 K (cool; tactical-clinical); 320 lux at floor level (bright; precision required); CRI 92
direct_fixtures:
  - id: ark.armory.light.recessed_grid
    position: distributed across ceiling on 1.20 × 1.20 grid
    beam_angle: 60° each
    colour: --token-color-ark-armory-recessed  (cool white)
    intensity: 1500 lumens each
    function: ambient task lighting
  - id: ark.armory.light.loadout_station_task
    position: (0.00, 5.00, 3.50)
    beam_angle: 30° downward
    colour: 6000 K bright
    intensity: 8000 lumens
    function: precision loadout task
  - id: ark.armory.light.weapons_rack_strip.east, .west
    position: along weapons racks at z = 3.40
    beam_angle: 90° downward
    colour: --token-color-ark-armory-rack-strip  (cool tactical)
    intensity: 800 lumens per metre
    function: weapons-rack accent (silhouettes weapons clearly)
  - id: ark.armory.light.cubicle_strip
    position: along cubicles at z = 3.90
    beam_angle: 90° downward
    colour: --token-color-ark-armory-cubicle-strip  (cool tactical)
    intensity: 600 lumens per metre
    function: cubicle definition
practical_sources:
  - id: ark.armory.cubicle_status_light.<n>  (10 small lights; one per cubicle)
    position: per cubicle top
    intensity: 30 lumens (varies — green for loaded; amber for partial; red for empty)
    flicker_pattern: stable
time_of_day_variation:
  acts_2_to_7: stable; in alert states (cross-ref Defense Command), red strobe activates
dynamic_response:
  - on_alert: ambient warms to 6500 K combat-tone; cubicle status lights all amber
  - on_player_at_loadout_station: task light intensifies 20%
  - on_player_at_cubicle: cubicle's strip-light brightens 30%
```

### A.9.7 Atmosphere

```
air_temperature:    19°C (cool; precision)
humidity:           34% RH (low; weapon-friendly); smells of gun oil + steel + faint leather
particulate:
  - dust: very low (security maintenance)
  - cordite_residue: very low (cosmetic; hint at recent use)
volumetric_fog:     absent
wind_drift:         minimal; 0.04 m/s; ventilation
smell_canon:        gun oil + steel + leather; voice-line: "smells like preparation"
```

### A.9.8 Sound

```
ambient_bed:           file: armory_ambient_bed_v1.ogg (loop); -36 dB; very quiet; faint mag-lock buzz, distant cooling fans
point_sources:
  - sound.maglock_buzz: distributed at racks; -40 dB; continuous
  - sound.cubicle_status_buzz: distributed at cubicles; -42 dB; continuous
  - sound.alert_klaxon: at (0.00, 5.00, 4.00); off baseline; -22 dB during alert; cyclic
reverb_zone:           IR-impulse: armory_v1.wav; wet-mix 14% (clean tactical)
music_eligibility:     cutscene only
voice_line_eligibility:
  - speaker: armory_quartermaster: named NPC; rare presence; line set §2.9.2
  - speaker: defense_command_relay: ambient announcements during alert
```

### A.9.9 Object inventory

Armory has 28 inventory objects.

#### A.9.9.1 The Tactical Loadout Station

```
object_id:           ark.armory.loadout_station
object_class:        interactive  (also display)
position:            (0.00, 5.00, 0.00)
dimensions:          1.80 × 1.20 × 1.10
rotation:            0°
material_primary:    brushed steel + matte-black control surface with holographic loadout-display
material_secondary:  brass bezel with status-LED accents
colour_value:        --token-color-ark-armory-loadout-station
interaction:         interactable
  - operate: opens loadout UI; player selects weapons + armor for current mission
  - inspect: lore-note about loadout system
narrative_role:      THE central station; primary CADES gameplay-launcher
lore_anchor:         loredex.system.cades + arc.cades_loadout
art_status:          producer_handoff
gameplay_hook_id:    trpc.armory.loadout_station.operate
wear_state:          worn at most-touched zones
physical_constraints: collides
```

#### A.9.9.2-3 Two Weapons Racks (east + west walls)

```
object_id:           ark.armory.weapons_rack.east, .west
object_class:        container
positions:           (4.95, 5.00, 0.00), (-4.95, 5.00, 0.00)
dimensions (each):   0.40 × 8.00 × 3.40
rotation:            varies
material_primary:    reinforced steel rack with mag-locks
material_secondary:  bronze nameplate per weapon-slot
colour_value:        --token-color-ark-armory-weapons-rack
interaction:         interactable
  - take_weapon: player can equip weapon (gameplay-key)
  - return_weapon: player returns weapon
  - inspect: lore-note per weapon
narrative_role:      weapons inventory + display; east is primary CADES; west is secondary + ceremonial
lore_anchor:         loredex.system.cades_weapons
art_status:          producer_handoff
gameplay_hook_id:    trpc.armory.weapons_rack.take + .return
wear_state:          mag-locks slightly worn at most-used positions
physical_constraints: collides
```

#### A.9.9.4-13 Ten Loadout Cubicles (north wall)

```
object_id:           ark.armory.loadout_cubicle.<n>  (10 cubicles)
object_class:        container
positions:           per A.9.4 walls (x = -4.5 to +4.5 step 1.0; y = 9.95)
dimensions (each):   1.00 × 0.50 × 4.00
rotation:            180°
material_primary:    reinforced steel; bronze nameplate
material_secondary:  biometric lock
colour_value:        --token-color-ark-armory-cubicle
interaction:         interactable
  - open: player can equip / store armor + auxiliary gear
  - inspect: lore-note about cubicle assignment
narrative_role:      personal loadout storage; cubicle 6 (x = +0.5) is the player's primary; others assigned to crew NPCs
lore_anchor:         loredex.system.cades_cubicles
art_status:          producer_handoff
gameplay_hook_id:    trpc.armory.cubicle.open
wear_state:          slight wear
physical_constraints: collides
```

#### A.9.9.14 Quartermaster's Anchor

```
object_id:           ark.armory.quartermaster_anchor
object_class:        npc_anchor
position:            (-2.00, 5.00, 0.00)  # to west of loadout station
dimensions:          0.80 × 0.80 × 1.80 (anchor)
rotation:            varies
material_primary:    n/a
material_secondary:  n/a
colour_value:        n/a
interaction:         n/a (NPC presence)
narrative_role:      Quartermaster anchors here when present; rare physical visits
lore_anchor:         loredex.character.armory_quartermaster
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          n/a
physical_constraints: n/a
```

#### A.9.9.15-22 Atmospheric Items

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.armory.weapons_cleaning_table` | furniture | (-2.50, 1.50, 0.00) | 1.20 × 0.60 × 0.85 | weapons-cleaning workstation |
| `ark.armory.weapons_cleaning_table.kit` | container | on cleaning table | 0.30 × 0.20 × 0.10 | cleaning supplies |
| `ark.armory.armor_repair_table` | furniture | (2.50, 1.50, 0.00) | 1.20 × 0.60 × 0.85 | armor-repair workstation |
| `ark.armory.armor_repair_table.kit` | container | on repair table | 0.30 × 0.20 × 0.10 | repair supplies |
| `ark.armory.tactical_briefing_table` | furniture | (0.00, 7.50, 0.00) | 1.40 × 0.80 × 0.85 | mission briefing surface |
| `ark.armory.tactical_briefing_chair.east, .west` | furniture | flanking briefing table | 0.80 × 0.80 × 1.20 each | seating |
| `ark.armory.briefing_holo_table` | display | on briefing table | 0.60 × 0.60 × 0.05 | mission overlay |

#### A.9.9.23-28 Closing Items

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.armory.south.intercom` | console | (-1.50, 0.20, 1.50) | 0.20 × 0.10 × 0.30 | comms relay |
| `ark.armory.fire_extinguisher.south` | interactive | (1.50, 0.20, 1.20) | 0.20 × 0.20 × 0.50 | safety |
| `ark.armory.first_aid.kit` | container | (-2.50, 0.20, 1.50) | 0.40 × 0.10 × 0.30 | medical |
| `ark.armory.alert_strobe.east` | fx_emitter | (4.95, 9.50, 3.80) | 0.20 × 0.20 × 0.20 | alert strobe (off baseline) |
| `ark.armory.alert_strobe.west` | fx_emitter | (-4.95, 9.50, 3.80) | mirror | strobe |
| `ark.armory.cadet_locker_history_plaque` | decoration | (-4.50, 0.20, 1.80) on south wall | 0.30 × 0.20 × 0.02 | small bronze plaque listing names of crew lost in CADES missions |

Total: 28 inventory objects.

### A.9.10 Camera-spawn-points (FPV cutscenes)

```
cutscene_id:         cs_amb_armory  (Category B; deferred)
camera_position:     (0.00, 0.50, eye_level)
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         slow approach to loadout station; head turns to scan racks; lasts 18s

cutscene_id:         cs_first_loadout  (Act 2 first CADES mission prep)
camera_position:     (0.00, 4.50, eye_level)
camera_facing:       (0°, -10°, 0°)
avatar_height_anchor: eye_level
head_motion:         seated at loadout station; hand-rig selects equipment; ~14s
```

### A.9.11 Doorways

```
door_id:            ark.armory.south.door.main
connecting_space_id: ark.engineering_bay  (via Engineering's west door)
door_position:      (0.00, 0.00, 0.00)
door_dimensions:    1.40 × 2.40 × 0.10
door_class:         pressure_seal  (biometric authentication)
unlock_condition:   Act 2+
transit_animation:  airlock-cycle (3s)
audio_signature:    pneumatic-hiss + biometric-confirm tone + magnetic-clack
```

### A.9.12 Adjacency map

```
direct_adjacencies:
  - ark.engineering_bay (south door; via Engineering's west door)
one_hop_adjacencies:
  - ark.forge_workshop (via Engineering Bay; equipment crafting chain)
  - ark.cades_console_pod (via Engineering Bay corridor; CADES mission briefing annex)
  - ark.defense_command_center (via long corridor; tactical command)
```

### A.9.13 Gameplay hooks

```
hooks:
  - hook_id:         armory.operateLoadoutStation
    trigger:         player.operate on loadout_station
    procedure:       trpc.armory.loadout_station.operate
    success_state:   loadout_ui_open = true
  - hook_id:         armory.takeWeapon
    trigger:         player.take on weapons_rack.<position>.<weapon>
    procedure:       trpc.armory.weapons_rack.take
    success_state:   weapon_equipped = true (per-weapon)
  - hook_id:         armory.returnWeapon
    trigger:         player.return on weapons_rack
    procedure:       trpc.armory.weapons_rack.return
    success_state:   weapon_returned = true
  - hook_id:         armory.openCubicle
    trigger:         player.open on loadout_cubicle.<n>
    procedure:       trpc.armory.cubicle.open
    success_state:   cubicle_open = true
  - hook_id:         armory.useCleaningTable
    trigger:         player.operate on weapons_cleaning_table
    procedure:       trpc.armory.cleaning_table.operate
    success_state:   cleaning_active = true
  - hook_id:         armory.useRepairTable
    trigger:         player.operate on armor_repair_table
    procedure:       trpc.armory.repair_table.operate
    success_state:   repair_active = true
  - hook_id:         armory.briefMission
    trigger:         player.operate on tactical_briefing_table
    procedure:       trpc.armory.briefing.start
    success_state:   briefing_active = true
```

### A.9.14 Story-tie

```
primary_arcs:
  - arc.act_2_first_loadout
  - arc.combat_progression (continuous)
  - arc.cades_loadout (continuous)
  - arc.cades_missions (cross-ref §A.47 CADES Console Pod)
per_act_evolution:
  acts_0_1: room locked
  act_2: opens; first loadout prep; basic weapons
  act_3: more weapons available; CADES mission archive accessible
  act_4: alert states begin; cubicle 6 (player's) shows accumulated mission gear
  act_5: cadet_locker_history_plaque becomes notable (lost crew names appear)
  act_6: legendary weapons accessible (rare)
  act_7: state-branched: well-armed-and-trained ending vs. minimal-engagement ending
npc_roster:
  - the_armory_quartermaster: named NPC; rare presence
  - the_player: visitor / loadout
  - cades_squadmates: cosmetic NPCs in late-act
readables:
  - dedication plaque (south)
  - tactical doctrine relief (north)
  - cadet locker history plaque (lost crew)
  - loadout history display (south)
  - alert status display (south)
master_of_rlyeh_question: n/a
```

### A.9.15 Special-FX

```
particle_systems:
  - dust (very low; security maintenance)
  - cordite_residue (very low; cosmetic; hint at recent CADES use)
volumetric_effects:
  - alert_strobe_envelope (state-conditional)
  - loadout_station_holo_overlay (3D loadout visualisation)
procedural_animations:
  - cubicle_status_light_pulse (per-cubicle; varies by state)
  - weapons_rack_subtle_shimmer (cosmetic)
  - briefing_holo_table_idle_animation
reactive_systems:
  - cubicle_strip_intensify_on_proximity
  - loadout_task_intensify_on_seated
  - alert_strobes_on_alert_state
```

### A.9.16 Avatar-parametricity

```
camera_height_variation:
  small_xenomorph (0.85m eye): 0.85m; cubicles tower; alternate "lift platform" inside cubicle
  short_humanoid (1.40m eye): standard
  average_humanoid (1.70m eye): standard
  tall_humanoid (2.05m eye): cubicle ceiling at near-head; slight crouch on entry
  tall_xenomorph (2.70m eye): cubicle entry requires crouch animation
reachability:
  small_xenomorph: cannot reach top weapons-rack slots; alternate ladder
  others: all-reachable
audio_occlusion_variation:
  xenomorph_sensitive_hearing: alarm klaxon overwhelming
  synthetic_voice_avatar: biometric-auth feedback subtly different
```

### A.9.17 Performance

```
polygon_budget:      200,000 polygons (compact room)
texture_budget:      120 MB total
light_count_limit:   12 simultaneous dynamic lights
lod_plan:
  - hero_distance: 0-8m, full detail
  - mid_distance: 8-15m, mid detail
  - low_distance: 15m+, low detail
streaming_behaviour:
  - preload: ark.engineering_bay (south door)
  - on_loadout_station_active: preload destination.cades_mission_maps (current mission)
```

---

## A.10 Cargo Hold — FULL

**Status: FULL spec.** Cross-ref: `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.10 (art-state prompts).

### A.10.1 Header

```
space_id:        ark.cargo_hold
space_name:      Cargo Hold
space_type:      ark_room
act_introduced:  Act 2
lore_anchor:     loredex.system.cargo + arc.trade_economy + arc.act_2_first_cargo_inventory
aesthetic_tier:  solar_punk_cathedral  (warehouse-industrial; the Ark's largest interior)
```

### A.10.2 Geometry

```
dimensions:           24.00 m × 16.00 m × 8.00 m
origin_point:         centre of floor at south entrance threshold
coordinate_axes:      +x = right, +y = forward, +z = up
floor_plan_geometry:  rectangular  (with overhead crane gantry running east-west at z = 7.00)
volumetric_anomalies: none
```

The Cargo Hold is the Ark's largest single interior. Vast warehouse
with crates, freight equipment, and a crane gantry overhead.
Freight elevator at the north end leads to the Trade Hub.
Players visit here for trade-economy interactions and for
cross-room transit (Forge Workshop's exhaust hatch, etc.).

Floor area: 384 m².

### A.10.3 Floor

```
material_primary:     industrial steel deck plate (heavy-duty load-bearing); 1.50 m × 1.50 m panels; 6 mm gap; reinforced anti-skid texture for cargo handling
material_secondary:   bronze trim along forklift-paths (grid pattern indicating safe routes); brass perimeter trim
pattern:              load-bearing grid + bronze forklift-route inlay (3 main routes: south-to-elevator, east-to-forge-exhaust, west-to-trade-hub-corridor)
wear_state:           well-used; oil-stains around freight zones; tire-tread marks along forklift routes; in late-act, scorch-marks if cargo has been damaged
embedded_features:
  - id: ark.cargo_hold.floor.charge_point.crane
    position: (0.00, 8.00, 0.00)  # under crane gantry centre
    dimensions: 0.40 × 0.40 × 0.05
    function: crane gantry power
  - id: ark.cargo_hold.floor.charge_point.elevator
    position: (0.00, 15.00, 0.00)  # north freight elevator
    dimensions: 2.00 × 2.00 × 0.10
    function: elevator base
  - id: ark.cargo_hold.floor.drain.south
    position: (0.00, 1.00, 0.00)
    dimensions: 0.40 × 0.40 × 0.10
    function: cargo-fluid drainage
  - id: ark.cargo_hold.floor.drain.north
    position: (0.00, 15.00, 0.00)
    dimensions: 0.40 × 0.40 × 0.10
    function: drainage at elevator
  - id: ark.cargo_hold.floor.crate_anchor.<grid>  (24 crate-anchor grid points)
    position: distributed in 4×6 grid (every 4 m × 4 m)
    dimensions: 0.30 × 0.30 × 0.05 each
    function: secured cargo anchor points
acoustic_property:    hard_reflective with industrial echo; RT60 = 0.85s (long; warehouse character)
```

### A.10.4 Walls

#### Wall: South (entrance)

```
wall_id:              south
material_primary:     painted steel panel with industrial reinforcement; gunmetal-grey
material_secondary:   bronze dado at z = 1.20 m
panelisation:         standard
colour_value:         --token-color-ark-cargo-hold-wall-south  (gunmetal-grey + amber-warning pin-stripe at z = 2.00 m)
embedded_displays:
  - id: ark.cargo_hold.south.display.cargo_manifest
    position: (-4.00, 0.20, 1.80)
    dimensions: 1.40 × 0.80 × 0.05
    content: live cargo inventory
  - id: ark.cargo_hold.south.display.shipping_log
    position: (4.00, 0.20, 1.80)
    dimensions: 1.40 × 0.80 × 0.05
    content: incoming/outgoing shipping log
embedded_doors:
  - door_id: ark.cargo_hold.south.door.main
    position: (0.00, 0.00, 0.00)
    dimensions: 2.00 × 3.00 × 0.10  (wider — cargo door)
    door_class: slide
    connecting_space_id: ark.corridor.cargo_approach
decorative_features:
  - id: ark.cargo_hold.south.plaque.mission
    position: (0.00, 0.20, 3.20)
    dimensions: 1.20 × 0.40 × 0.02
    material: cast bronze
    narrative_role: reads "WHAT WE CARRY, WE BECOME"
  - id: ark.cargo_hold.south.warning_sign.heavy_load
    position: (5.00, 0.20, 3.50)
    dimensions: 0.40 × 0.30 × 0.01
    material: yellow-and-black painted steel
    narrative_role: heavy-load warning
```

#### Wall: East (with forge-exhaust hatch + workshop access)

```
wall_id:              east
material_primary:     painted steel; reinforced
material_secondary:   bronze dado
panelisation:         standard
colour_value:         --token-color-ark-cargo-hold-wall-east
embedded_displays:    none
embedded_doors:
  - door_id: ark.cargo_hold.east.hatch.forge_exhaust
    position: (7.95, 4.00, 0.40)  # low hatch from forge
    dimensions: 0.80 × 1.40 × 0.10
    door_class: slide
    connecting_space_id: ark.forge_workshop  (Forge's north exhaust)
    unlock_condition: Act 3+
  - door_id: ark.cargo_hold.east.door.maintenance
    position: (7.95, 12.00, 0.00)
    dimensions: 1.40 × 2.40 × 0.10
    door_class: slide
    connecting_space_id: ark.corridor.cargo_maintenance  (deferred)
    unlock_condition: late-act
decorative_features:
  - id: ark.cargo_hold.east.warning_sign.machinery
    position: (7.95, 8.00, 4.50)
    dimensions: 0.40 × 0.30 × 0.01
    material: yellow-and-black painted steel
    narrative_role: machinery-active warning
```

#### Wall: North (with freight elevator)

```
wall_id:              north
material_primary:     painted steel; reinforced
material_secondary:   bronze dado
panelisation:         standard
colour_value:         --token-color-ark-cargo-hold-wall-north
embedded_displays:
  - id: ark.cargo_hold.north.display.elevator_status
    position: (0.00, 15.95, 1.80)
    dimensions: 1.20 × 0.80 × 0.05
    content: elevator position + payload + arrival ETA
embedded_doors:
  - door_id: ark.cargo_hold.north.elevator.freight
    position: (0.00, 15.50, 0.00)
    dimensions: 2.40 × 3.40 × 0.10
    door_class: slide  (large freight elevator door)
    connecting_space_id: ark.trade_hub
    unlock_condition: Act 2+
decorative_features:
  - id: ark.cargo_hold.north.elevator_frame
    position: (0.00, 15.95, 0.00)
    dimensions: 3.00 × 0.10 × 4.50  (frame around elevator)
    material: cast iron + brass trim
    narrative_role: structural + aesthetic frame
```

#### Wall: West (with trade-hub corridor access)

```
wall_id:              west
material_primary:     same as east
material_secondary:   bronze dado
panelisation:         standard
colour_value:         --token-color-ark-cargo-hold-wall-west
embedded_displays:    none
embedded_doors:
  - door_id: ark.cargo_hold.west.door.trade_corridor
    position: (-7.95, 8.00, 0.00)  # mid-wall
    dimensions: 1.60 × 2.40 × 0.10
    door_class: slide
    connecting_space_id: ark.corridor.trade_long_route  (alternate route to Trade Hub)
    unlock_condition: Act 2+
decorative_features:
  - id: ark.cargo_hold.west.warning_sign.crane
    position: (-7.95, 8.00, 4.50)
    dimensions: 0.40 × 0.30 × 0.01
    material: yellow-and-black painted steel
    narrative_role: overhead-crane warning
```

### A.10.5 Ceiling

```
height_above_floor:     8.00 m baseline; crane gantry track at z = 7.00 (visible structural element)
material:               exposed steel framework with industrial conduits + crane rails
lighting_integrated:    suspended high-bay fixtures at z = 7.50 on 3.00 × 3.00 grid (excluding crane-rail zones)
atmospheric_features:   visible dust drift in light shafts; occasional cargo-particles from transferred goods
acoustic_treatment:     mostly bare-steel (industrial; intentional reverb)
```

### A.10.6 Lighting

```
ambient_baseline:     4500 K (cool-neutral; warehouse); 200 lux at floor level; CRI 85
direct_fixtures:
  - id: ark.cargo_hold.light.high_bay_array
    position: distributed at z = 7.50 on 3.00 × 3.00 grid
    beam_angle: 90°
    colour: --token-color-ark-cargo-hold-high-bay  (cool industrial)
    intensity: 6000 lumens each
    function: ambient lighting (warehouse scale demands strong fixtures)
  - id: ark.cargo_hold.light.crane_gantry_strip
    position: along crane gantry track at z = 7.00
    beam_angle: 60° downward
    colour: --token-color-ark-cargo-hold-crane-strip  (cool tactical)
    intensity: 800 lumens per metre
    function: gantry definition + safety
  - id: ark.cargo_hold.light.elevator_warning_strobe
    position: (0.00, 15.50, 4.00)  # at elevator
    beam_angle: 360°
    colour: amber
    intensity: 500 lumens (during elevator motion)
    flicker_pattern: cyclic-strobe
practical_sources:
  - id: ark.cargo_hold.crate_indicator_light.<grid>
    position: at each crate-anchor with secured cargo
    intensity: 30 lumens (varies by crate-status)
    flicker_pattern: stable
time_of_day_variation:
  acts_2_to_7: stable; in alert states, all warning strobes activate
dynamic_response:
  - on_elevator_motion: elevator_warning_strobe activates
  - on_crane_motion: localised gantry lights pulse
  - on_player_at_specific_crate: indicator_light brightens
```

### A.10.7 Atmosphere

```
air_temperature:    18°C (cool — warehouse standard)
humidity:           45% RH; smells of cardboard + grease + steel + mild ozone (electronic shipping)
particulate:
  - dust: medium (warehouse accumulation)
  - cargo_particles: low (cosmetic; suggests "things being moved")
volumetric_fog:     absent in baseline; mild haze at upper volume during heavy-cargo days
wind_drift:         strong; 0.30 m/s; HVAC-driven from south to north toward elevator
smell_canon:        cardboard + grease + steel; voice-line: "smells like waiting"
```

### A.10.8 Sound

```
ambient_bed:           file: cargo_hold_ambient_bed_v1.ogg (loop); -28 dB; deep HVAC drone, distant cargo-hum, occasional creak from settling cargo, faint elevator-cycle in distance
point_sources:
  - sound.crane_gantry_idle: at gantry; servo-quiet hum; -38 dB; continuous
  - sound.elevator_motion: at elevator; mechanical engagement; -22 dB during motion
  - sound.crate_settling: distributed; occasional creak; random; -36 dB
  - sound.distant_voices: dynamic; faint workers' voices; -42 dB; random period 60-120s (suggests off-screen workforce)
reverb_zone:           IR-impulse: cargo_hold_v1.wav; wet-mix 32% (long industrial)
music_eligibility:     cutscene only (Category B cs_amb_cargo_hold; deferred catalogue)
voice_line_eligibility:
  - speaker: cargo_handler: rare named NPC; line set §2.10.2
  - speaker: distant_workers_chatter: ambient atmosphere only
```

### A.10.9 Object inventory

Cargo Hold has 38 inventory objects.

#### A.10.9.1 The Crane Gantry (overhead)

```
object_id:           ark.cargo_hold.crane_gantry
object_class:        interactive
position:            (0.00, 8.00, 7.00)  # spans east-west at z = 7.00
dimensions:          16.00 × 0.40 × 0.40 (rail length × width × height; runs full east-west)
rotation:            0°
material_primary:    cast steel rail with travelling crane unit (positioned at variable x)
material_secondary:  bronze status indicators
colour_value:        --token-color-ark-cargo-hold-crane
interaction:         interactable (via floor control)
  - operate (via crane control panel): player can move cargo with crane (gameplay-key for trade missions)
  - inspect: lore-note about crane mechanics
narrative_role:      central cargo-moving infrastructure; gameplay-active during trade events
lore_anchor:         loredex.system.cargo_handling
art_status:          producer_handoff
gameplay_hook_id:    trpc.cargo_hold.crane.operate
wear_state:          slight wear at most-traversed rail zones
physical_constraints: non-collide (player can pass under)
```

#### A.10.9.2 The Crane Control Panel

```
object_id:           ark.cargo_hold.crane_control_panel
object_class:        console
position:            (0.00, 8.00, 0.00)  # central, ground floor
dimensions:          1.40 × 0.80 × 1.10
rotation:            0°
material_primary:    brushed steel + matte-black with bronze accents
material_secondary:  brass status-LED bezel
colour_value:        --token-color-ark-cargo-hold-crane-control
interaction:         interactable
  - operate: opens crane-control UI; player drives crane and lifts/drops cargo
  - inspect: lore-note
narrative_role:      crane operator station
lore_anchor:         loredex.system.cargo_handling
art_status:          producer_handoff
gameplay_hook_id:    trpc.cargo_hold.crane_control.operate
wear_state:          worn at most-pressed buttons
physical_constraints: collides
```

#### A.10.9.3 The Freight Elevator (north)

```
object_id:           ark.cargo_hold.elevator.freight
object_class:        interactive  (also door-class)
position:            (0.00, 15.50, 0.00)
dimensions:          2.40 × 2.40 × 4.50  (large freight elevator car)
rotation:            0°
material_primary:    reinforced steel cage with bronze trim
material_secondary:  bronze nameplate "TRADE HUB ↑"
colour_value:        --token-color-ark-cargo-hold-elevator
interaction:         interactable
  - operate: calls/dispatches elevator (ascends to Trade Hub or descends to here)
  - traverse: player + cargo travels to Trade Hub
narrative_role:      vertical transit to Trade Hub; gameplay-key cargo route
lore_anchor:         loredex.system.cargo_handling
art_status:          producer_handoff
gameplay_hook_id:    trpc.cargo_hold.elevator.operate
wear_state:          slight wear at door tracks
physical_constraints: collides; player can enter
```

#### A.10.9.4-27 Twenty-Four Crate Anchor Positions (4×6 grid)

```
object_id:           ark.cargo_hold.crate.<grid_position>  (24 anchors; not always occupied)
object_class:        container
positions:           4×6 grid distributed across floor (every 4 m × 4 m starting from (-6, 4, 0))
dimensions (each occupied): 1.20 × 1.20 × 0.80 (standard cargo crate; some are stacked 2-high to z = 1.60)
rotation:            varies
material_primary:    reinforced cardboard (cosmetic) or wood-and-metal (heavy crates)
material_secondary:  bronze nameplate per crate (manifest item)
colour_value:        --token-color-ark-cargo-hold-crate  (varied: brown cardboard, dark wood, grey metal)
interaction:         interactable (when player has lift permission)
  - inspect: read crate manifest
  - lift (with crane): move crate to another position
narrative_role:      living trade economy; crate inventory varies by player's trade activity
lore_anchor:         loredex.system.cargo_inventory
art_status:          producer_handoff
gameplay_hook_id:    trpc.cargo_hold.crate.inspect + .lift
wear_state:          varies
physical_constraints: collides; can be lifted/moved via crane
```

#### A.10.9.28 Cargo Handler's Anchor (NPC anchor)

```
object_id:           ark.cargo_hold.cargo_handler_anchor
object_class:        npc_anchor
position:            (-2.00, 5.00, 0.00)
dimensions:          0.80 × 0.80 × 1.80 (anchor)
rotation:            varies
material_primary:    n/a
material_secondary:  n/a
colour_value:        n/a
interaction:         n/a (NPC presence)
narrative_role:      Cargo Handler anchors here when present (rare; trade events)
lore_anchor:         loredex.character.cargo_handler
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          n/a
physical_constraints: n/a
```

#### A.10.9.29-32 Workspace + Tool Items

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.cargo_hold.manifest_terminal` | console | (-2.00, 4.00, 0.00) | 1.40 × 0.80 × 1.10 | inventory management terminal |
| `ark.cargo_hold.workbench.south` | furniture | (3.50, 4.00, 0.00) | 1.40 × 0.60 × 0.85 | inspection workbench |
| `ark.cargo_hold.forklift.east_zone` | decoration | (5.00, 5.00, 0.00) | 1.20 × 1.80 × 1.50 | parked forklift (cosmetic) |
| `ark.cargo_hold.tool_cabinet` | container | (-5.00, 4.50, 0.00) | 0.60 × 0.40 × 1.80 | cargo-tools cabinet |

#### A.10.9.33-38 Atmospheric + Decorative + Closing

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.cargo_hold.south.intercom` | console | (-2.50, 0.20, 1.50) | 0.20 × 0.10 × 0.30 | comms relay |
| `ark.cargo_hold.fire_extinguisher.south` | interactive | (2.50, 0.20, 1.20) | 0.20 × 0.20 × 0.50 | safety |
| `ark.cargo_hold.fire_extinguisher.north` | interactive | (-3.00, 15.50, 1.20) | mirror | safety |
| `ark.cargo_hold.first_aid.kit` | container | (-3.50, 0.20, 1.50) | 0.40 × 0.10 × 0.30 | medical |
| `ark.cargo_hold.cargo_hooks_overhead` | decoration | distributed at z = 7.00 along crane | 0.10 × 16.00 × 0.30 | hooks for hanging cargo |
| `ark.cargo_hold.distant_workers_emitter` | fx_emitter | dynamic | n/a | distant-voices SFX source |

Total: 38 inventory objects.

### A.10.10 Camera-spawn-points (FPV cutscenes)

```
cutscene_id:         cs_amb_cargo_hold  (Category B Myst-ambient; per §3.1.B.3)
camera_position:     (0.00, 0.50, eye_level)
camera_facing:       (0°, 5°, 0°)
avatar_height_anchor: eye_level
head_motion:         slow walk-pan around the lamp; shadow-crate-stack visible against the lamp; lasts 22s

cutscene_id:         cs_first_cargo_inventory  (Act 2)
camera_position:     (-2.00, 4.50, eye_level)  # at manifest terminal
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         hand-rig at terminal; manifests scroll past
```

### A.10.11 Doorways

```
door_id:            ark.cargo_hold.south.door.main
connecting_space_id: ark.corridor.cargo_approach
door_position:      (0.00, 0.00, 0.00)
door_dimensions:    2.00 × 3.00 × 0.10
door_class:         slide
unlock_condition:   Act 2+
transit_animation:  fade
audio_signature:    pneumatic-hiss + servo-whir (cargo door)

door_id:            ark.cargo_hold.east.hatch.forge_exhaust
connecting_space_id: ark.forge_workshop
door_position:      (7.95, 4.00, 0.40)
door_dimensions:    0.80 × 1.40 × 0.10
door_class:         slide
unlock_condition:   Act 3+
transit_animation:  fade
audio_signature:    pneumatic-hiss

door_id:            ark.cargo_hold.north.elevator.freight
connecting_space_id: ark.trade_hub
door_position:      (0.00, 15.50, 0.00)
door_dimensions:    2.40 × 3.40 × 0.10
door_class:         slide  (elevator)
unlock_condition:   Act 2+
transit_animation:  elevator-cycle (4s ascent)
audio_signature:    elevator-mechanical engagement + bell-toll on arrival

door_id:            ark.cargo_hold.west.door.trade_corridor
connecting_space_id: ark.corridor.trade_long_route
door_position:      (-7.95, 8.00, 0.00)
door_dimensions:    1.60 × 2.40 × 0.10
door_class:         slide
unlock_condition:   Act 2+
transit_animation:  fade
audio_signature:    pneumatic-hiss
```

### A.10.12 Adjacency map

```
direct_adjacencies:
  - ark.corridor.cargo_approach (south)
  - ark.forge_workshop (east hatch; Act 3+)
  - ark.trade_hub (north elevator; Act 2+)
  - ark.corridor.trade_long_route (west door; Act 2+)
one_hop_adjacencies:
  - ark.engineering_bay (via cargo approach + Engineering corridor)
  - ark.armory (via Engineering Bay)
```

### A.10.13 Gameplay hooks

```
hooks:
  - hook_id:         cargo_hold.operateCrane
    trigger:         player.operate on crane_control_panel
    procedure:       trpc.cargo_hold.crane.operate
    success_state:   crane_active = true
  - hook_id:         cargo_hold.operateElevator
    trigger:         player.operate on elevator.freight
    procedure:       trpc.cargo_hold.elevator.operate
    success_state:   elevator_active = true
  - hook_id:         cargo_hold.inspectCrate
    trigger:         player.inspect on crate.<grid>
    procedure:       trpc.cargo_hold.crate.inspect
    success_state:   crate_manifest_read = true
  - hook_id:         cargo_hold.liftCrate
    trigger:         player.lift on crate.<grid> with crane active
    procedure:       trpc.cargo_hold.crate.lift
    success_state:   crate_lifted = true
  - hook_id:         cargo_hold.operateManifestTerminal
    trigger:         player.operate on manifest_terminal
    procedure:       trpc.cargo_hold.manifest.operate
    success_state:   manifest_active = true
  - hook_id:         cargo_hold.openToolCabinet
    trigger:         player.open on tool_cabinet
    procedure:       trpc.cargo_hold.tool_cabinet.open
    success_state:   tool_cabinet_open = true
```

### A.10.14 Story-tie

```
primary_arcs:
  - arc.act_2_first_cargo_inventory
  - arc.trade_economy (continuous)
  - arc.cargo_handling_progression
per_act_evolution:
  acts_0_1: room locked
  act_2: opens; player can inspect manifest, operate elevator
  act_3: more crates appear (player's trade activity affects inventory); forge-exhaust hatch unlocks
  act_4: trade events drive crate dynamics (incoming/outgoing shipments)
  act_5: cargo handler appears occasionally; deeper trade dialogues
  act_6: rare cargo arrives (legendary items)
  act_7: state-branched: rich-trader ending (warehouse full + organised) vs. spartan ending (mostly empty)
npc_roster:
  - the_cargo_handler: named NPC; rare presence
  - the_player: visitor / trader
  - distant_workers: ambient atmosphere only
readables:
  - mission plaque (south)
  - crate manifests (per-crate; varied)
  - shipping log display (south)
  - elevator status display (north)
master_of_rlyeh_question: n/a
```

### A.10.15 Special-FX

```
particle_systems:
  - dust (medium; warehouse accumulation)
  - cargo_particles (low; cosmetic during transfers)
  - elevator_steam (subtle during elevator motion)
volumetric_effects:
  - high_bay_volumetric_beams (visible in dust)
  - elevator_motion_volumetric (during travel)
procedural_animations:
  - crane_idle_sway (subtle; gantry has slight motion)
  - elevator_indicator_pulse
  - crate_subtle_settle
  - distant_workers_visualisation (very rare; cosmetic; figures move past distant doorway)
reactive_systems:
  - crane_glow_on_proximity_to_control
  - elevator_glow_on_call
  - crate_indicator_light_on_player_proximity
  - alert_strobes_on_alert_state
```

### A.10.16 Avatar-parametricity

```
camera_height_variation:
  small_xenomorph (0.85m eye): 0.85m; ceilings feel impossibly tall; alternate "lift platform" for crane control
  short_humanoid (1.40m eye): standard
  average_humanoid (1.70m eye): standard
  tall_humanoid (2.05m eye): comfortable scale
  tall_xenomorph (2.70m eye): comfortable scale (warehouse accommodates)
reachability:
  small_xenomorph: cannot reach crate manifests on top-stacked crates without crane assistance
  others: all-reachable
audio_occlusion_variation:
  xenomorph_sensitive_hearing: distant-voices more pronounced; warehouse echo richer
  synthetic_voice_avatar: elevator mechanical-engagement perceived differently
```

### A.10.17 Performance

```
polygon_budget:      400,000 polygons (large room; many crates; LOD critical)
texture_budget:      200 MB total (varied crate textures + crane shaders)
light_count_limit:   20 simultaneous dynamic lights
lod_plan:
  - hero_distance: 0-12m, full detail
  - mid_distance: 12-30m, mid detail (crates simplified)
  - low_distance: 30m+, low detail
streaming_behaviour:
  - preload: ark.corridor.cargo_approach (south)
  - on_elevator_call: preload ark.trade_hub
  - on_player_at_east_hatch + Act 3+: preload ark.forge_workshop
```

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

## A.12 Trophy Room — FULL

**Status: FULL spec.** Cross-ref: `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.12 + §4.2 (art-state prompts).

### A.12.1 Header

```
space_id:        ark.trophy_room
space_name:      Trophy Room
space_type:      ark_room
act_introduced:  Act 3
lore_anchor:     loredex.system.trophies + arc.player_progression + arc.act_3_first_trophy
aesthetic_tier:  solar_punk_cathedral  (gallery-display aesthetic; warm and proud)
```

### A.12.2 Geometry

```
dimensions:           10.00 m × 12.00 m × 5.00 m
origin_point:         centre of floor at south entrance
coordinate_axes:      +x = right, +y = forward (north), +z = up
floor_plan_geometry:  rectangular  (with central display plinth + perimeter trophy cases)
volumetric_anomalies: none
```

The Trophy Room is a gallery — display cases line all 4 walls;
central display plinth holds the player's most recent / most
significant trophy. Tiered display shelves rise on east + west
walls. North wall is reserved for "Hall of Fame" — fight records
+ legendary achievements.

Floor area: 120 m².

### A.12.3 Floor

```
material_primary:     polished walnut hardwood plank in herringbone; 0.20 × 1.20 m planks at 45° from south
material_secondary:   bronze inlay outlining central plinth zone (3 × 3 m square); brass perimeter trim
pattern:              herringbone with bronze accents around plinth + walls
wear_state:           pristine; slight wear-trail to plinth and most-frequented displays
embedded_features:
  - id: ark.trophy_room.floor.charge_point.central_plinth
    position: (0.00, 6.00, 0.00)
    dimensions: 0.40 × 0.40 × 0.05
    function: plinth display electronics
  - id: ark.trophy_room.floor.case_anchor.<n>  (16 case anchors along perimeter)
    position: distributed along walls
    dimensions: 0.20 × 0.20 × 0.05 each
    function: display-case electronics
acoustic_property:    soft_absorbent (rugs + soft-furniture); RT60 = 0.40s (intimate gallery)
```

### A.12.4 Walls

#### Wall: South (entrance)

```
wall_id:              south
material_primary:     painted plaster with walnut wainscoting (z = 0.00 to 1.20); cream plaster above
material_secondary:   walnut chair-rail
panelisation:         standard
colour_value:         --token-color-ark-trophy-room-wall-south  (warm cream + walnut)
embedded_displays:
  - id: ark.trophy_room.south.display.recent_trophies
    position: (-3.00, 0.20, 1.80)
    dimensions: 0.80 × 0.60 × 0.05
    content: log of most-recent trophies earned
  - id: ark.trophy_room.south.display.player_achievements
    position: (3.00, 0.20, 1.80)
    dimensions: 0.80 × 0.60 × 0.05
    content: player's overall achievement summary
embedded_doors:
  - door_id: ark.trophy_room.south.door.main
    position: (0.00, 0.00, 0.00)
    dimensions: 1.20 × 2.40 × 0.10
    door_class: arch  (warm walnut; brass handle)
    connecting_space_id: ark.corridor.trophy_approach
decorative_features:
  - id: ark.trophy_room.south.plaque.creed
    position: (0.00, 0.20, 3.20)
    dimensions: 0.80 × 0.30 × 0.02
    material: brass
    narrative_role: reads "WHAT IS WON, IS REMEMBERED"
```

#### Wall: East (trophy cases — 6-bay)

```
wall_id:              east
material_primary:     painted plaster with built-in trophy-case backings + glass display panels (full-height; 4.20 m tall)
material_secondary:   walnut framing + bronze tier-rails; gold-leaf nameplate on each case
panelisation:         6 cases at y = 1.5, 3.5, 5.5, 7.5, 9.5, 11.5 (each 1.40 m wide × 0.40 m deep)
colour_value:         --token-color-ark-trophy-room-wall-east
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: ark.trophy_room.east.case.<n>  (6 cases; categorised: combat, trade, chess, pet-arena, exploration, social)
    position: along east wall
    dimensions: 1.40 × 0.40 × 4.20 each
    material: walnut + glass + bronze
    narrative_role: per-category trophy display
```

#### Wall: North (Hall of Fame)

```
wall_id:              north
material_primary:     polished walnut paneling (full-height; no plaster); the most formal wall
material_secondary:   crown-molding at z = 4.80; gold inlay forming "HALL OF FAME" heading
panelisation:         3 panels: west (decorative), centre (Hall of Fame), east (decorative)
colour_value:         --token-color-ark-trophy-room-wall-north
embedded_displays:
  - id: ark.trophy_room.north.display.hall_of_fame
    position: (0.00, 11.95, 2.50)
    dimensions: 2.40 × 1.60 × 0.05
    content: prestige trophies + legendary achievement records
embedded_doors:        none
decorative_features:
  - id: ark.trophy_room.north.relief.victory_eternal
    position: (0.00, 11.85, 4.30)
    dimensions: 2.00 × 0.60 × 0.10
    material: cast bronze with gilt highlights
    narrative_role: "VICTORY ETERNAL" relief
```

#### Wall: West (trophy cases — mirror of east)

```
wall_id:              west
material_primary:     same as east
material_secondary:   walnut framing
panelisation:         6 cases mirror
colour_value:         --token-color-ark-trophy-room-wall-west
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: ark.trophy_room.west.case.<n>  (6 cases mirror; categories: pvp_tier5, tower_defense, alliance_war, dischordian_arena, hellbox_completion, faction_alignment)
    position: mirror
    dimensions: 1.40 × 0.40 × 4.20 each
    material: walnut + glass + bronze
    narrative_role: per-category display
```

### A.12.5-8 Ceiling / Lighting / Atmosphere / Sound (compact)

```
ceiling: 5.00 m baseline; central coffer at 4.50 m; painted plaster + walnut crown-molding; central pendant chandelier; recessed strip-lights along trophy cases; uplights on Hall of Fame
lighting:
  ambient_baseline: 3000 K warm; 220 lux; CRI 95
  central_chandelier: at (0.00, 6.00, 4.50); warm amber crystal scatter; 5000 lumens
  trophy_case_strip.east + .west: above each case at z=4.20; 600 lumens/m
  hall_of_fame_uplights: along north wall base; warm gold; 1200 lumens/m
  plinth_glow: at (0.00, 6.00, 1.10); 400 lumens when occupied
  case_indicator_lights: per case; 30 lumens each; subtle
atmosphere: 20°C / 42% RH / smells walnut+bronze+leather; dust_motes low
sound:
  ambient_bed: -38 dB very quiet; case-electronics buzz; occasional creak
  point_sources: case_buzz; plinth_resonance (when occupied); distant_cheer_residue (rare; -44 dB; period 120-300s)
  reverb_zone: trophy_room_v1.wav wet 14% intimate
  music_eligibility: cutscene only (Cat A on new trophy)
  voice_line: trophy_curator (silent presence)
```

### A.12.9 Object inventory (compact)

Trophy Room has 32 inventory objects.

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.trophy_room.central_plinth` | interactive | (0.00, 6.00, 0.00) | 1.20 dia × 1.10 | central display plinth |
| `ark.trophy_room.east.case.<n>` (6) | container | along east wall | 1.40 × 0.40 × 4.20 each | per-category cases |
| `ark.trophy_room.west.case.<n>` (6) | container | along west wall | mirror | per-category cases |
| `ark.trophy_room.north.hall_of_fame_display` | display | (0.00, 11.95, 2.50) | 2.40 × 1.60 × 0.05 | Hall of Fame |
| `ark.trophy_room.observation_bench.south_arc` | furniture | (0.00, 4.00, 0.00) | 1.40 × 0.40 × 0.45 | bench facing plinth |
| `ark.trophy_room.observation_bench.north_arc` | furniture | (0.00, 8.00, 0.00) | mirror | bench |
| `ark.trophy_room.curator_lectern` | container | (-3.00, 1.50, 0.00) | 0.40 × 0.30 × 1.20 | bronze lectern with curator's tome |
| `ark.trophy_room.south.intercom` | console | (-2.00, 0.20, 1.50) | 0.20 × 0.10 × 0.30 | comms relay |
| `ark.trophy_room.fire_extinguisher.south` | interactive | (2.00, 0.20, 1.20) | 0.20 × 0.20 × 0.50 | safety |
| `ark.trophy_room.first_aid.kit` | container | (-2.50, 0.20, 1.50) | 0.40 × 0.10 × 0.30 | medical |
| `ark.trophy_room.south.plaque.creed` | decoration | (0.00, 0.20, 3.20) | 0.80 × 0.30 × 0.02 | "WHAT IS WON, IS REMEMBERED" |
| `ark.trophy_room.north.relief.victory_eternal` | decoration | (0.00, 11.85, 4.30) | 2.00 × 0.60 × 0.10 | "VICTORY ETERNAL" |
| `ark.trophy_room.compass_inlay` | decoration | (0.00, 6.00, 0.005) | 0.80 × 0.80 × 0.005 | floor compass |
| `ark.trophy_room.dust_motes_emitter` | fx_emitter | distributed | n/a | dust source |

Total: 32 inventory objects.

### A.12.10-17 Compact

```
camera_spawn_points:
  cs_amb_trophy_room (Cat B): POV at threshold; slow walk to plinth; head turns to scan cases; 18s
  cs_first_trophy_added (Act 3, one-shot): POV at plinth; new trophy materialises; chandelier flares

doorways:
  south.door.main: connects to ark.corridor.trophy_approach; arch; Act 3+

adjacency:
  direct: ark.corridor.trophy_approach (south)
  one_hop: ark.bridge, ark.captain_quarters (via approach corridor)

gameplay_hooks:
  - inspectPlinth: trpc.trophy_room.plinth.inspect
  - inspectCase: trpc.trophy_room.case.inspect (per-case)
  - readCuratorLectern: trpc.trophy_room.curator_lectern.read
  - inspectHallOfFame: trpc.trophy_room.hall_of_fame.inspect

story_tie:
  primary_arcs:
    - act_3_first_trophy
    - player_progression (continuous; cumulative)
    - hall_of_fame_inscription (legendary achievements)
  per_act:
    acts_0_2: locked
    act_3: opens; first trophies displayed
    acts_4_6: cases fill as player progresses
    act_7: state-branched: well-trophied vs. minimal
  npc_roster: trophy_curator (silent presence-only)
  readables: creed plaque; victory-eternal relief; curator's tome; per-case nameplates
  master_of_rlyeh_question: n/a

special_fx:
  particle_systems: dust_motes (low)
  volumetric: chandelier_crystal_scatter; plinth_glow_envelope; hall_of_fame_uplight_envelope
  procedural_animations: chandelier_subtle_sway; case_indicator_breath; trophy_subtle_glint
  reactive: chandelier_intensify_on_proximity; case_pulse_on_new_trophy; plinth_flare_on_addition

avatar_parametricity:
  small_xenomorph: alternate ladder for top-shelf; relay-inspect for Hall of Fame
  others: all-reachable
  audio_occlusion: xenomorph: distant_cheer_residue more pronounced

performance:
  polygon_budget: 200,000 / texture_budget: 130 MB / light_count_limit: 14
  streaming_behaviour: preload trophy_approach corridor
```

---

## A.13 Antiquarian's Library — FULL

**Status: FULL spec.** Cross-ref: `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.13 (art-state prompts) and §11.3.1 cross-centuries chess game.

### A.13.1 Header

```
space_id:        ark.antiquarian_library
space_name:      Antiquarian's Library (Pocket Dimension)
space_type:      destination_zone  (pocket-dimension; accessed from Archives §A.4 via a hidden archway)
act_introduced:  Act 3
lore_anchor:     loredex.character.the_antiquarian + loredex.faction.architect_remnants + arc.lore_recovery + §11.3.1 cross-centuries chess
aesthetic_tier:  dreamers_oneiric  (impossibly tall library; non-Euclidean architecture)
```

### A.13.2 Geometry

```
dimensions:           28.00 m × 28.00 m × 24.00 m  (bounding box; perceptual; physical entry portal is 1.40 × 2.40 m archway in Archives §A.4)
origin_point:         centre of floor at the entry archway threshold (south-centre)
coordinate_axes:      +x = right, +y = forward (north into the library), +z = up
floor_plan_geometry:  non_euclidean  (impossible geometry; bigger-on-inside ratio 4× external footprint; multiple gallery levels with recursive looping at upper galleries)
volumetric_anomalies:
  - bigger_on_inside ratio: 4× external footprint
  - recursive upper galleries: galleries 5+ loop back to gallery 3 (player ascending past gallery 4 ends up in gallery 3 again — the library has no defined "top")
  - light geometry impossible: skylights show impossible-physics sunlight (a light shaft enters a gallery from above when there is no gallery above it)
  - book-stack escapement: books on highest shelves occasionally fall UPWARD through the ceiling (purely cosmetic; bookshelves at apparent z=24 m feed into bookshelves at apparent z=2 m)
```

The Library is the most architecturally ambiguous space in the
game. Its coordinates are best described as PERCEPTUAL — a player
walking forward 10 m may emerge 30 m further along than expected
in some directions, or only 5 m further in others. The Antiquarian
sits at a central reading table on the ground floor; player can
ascend to galleries 1, 2, 3, 4 via spiral staircase, but galleries
5+ reset to gallery 3 (creating an infinite-recursion loop).

Floor area (perceptual): ~2000 m² across all galleries.
Floor area (ground floor only): 784 m² (28 × 28 m).

### A.13.3 Floor

```
material_primary:     dark walnut hardwood plank in a herringbone pattern; 0.20 m × 1.20 m planks; running diagonal at 45° from south wall
material_secondary:   bronze inlay outlining the central reading-table area (4 × 4 m square inlay band); brass walkway-strip from entry to chess-table to spiral-stair base
pattern:              herringbone with bronze accents around focal areas
wear_state:           pristine in pristine state but well-used; pacing-trails to Antiquarian's chair, chess-table, spiral-stair base
embedded_features:
  - id: ark.antiquarian_library.floor.charge_point.reading_table
    position: (0.00, 12.00, 0.00)  # under reading table
    dimensions: 0.40 × 0.40 × 0.05
    function: reading-table lamp + lectern power
  - id: ark.antiquarian_library.floor.charge_point.chess_table
    position: (-6.00, 14.00, 0.00)  # under chess table (west of reading area)
    dimensions: 0.40 × 0.40 × 0.05
    function: chess-clock electronics
  - id: ark.antiquarian_library.floor.spiral_stair_base
    position: (10.00, 14.00, 0.00)  # east of reading area
    dimensions: 1.80 × 1.80 × 0.05
    function: spiral-stair base + ascent-trigger hook
acoustic_property:    soft_absorbent (lots of paper); RT60 = 0.50s (intimate despite scale)
```

### A.13.4 Walls

The Antiquarian's Library has 4 walls forming a square perimeter,
but each wall is essentially A FLOOR-TO-CEILING BOOKSHELF (no
"flat" wall surface). The walls are continuous bookshelves rising
to z = 24.00 m.

#### Wall: South (entrance, with archway)

```
wall_id:              south_bookshelf
material_primary:     dark walnut shelving from z = 0.00 to z = 24.00, divided into "gallery levels" (4.80 m tall each, so 5 visible levels — galleries 1-5; gallery 5 is recursive, looping back to 3)
material_secondary:   bronze shelf-supports; bronze rail along each gallery walkway
panelisation:         continuous shelving except for entry archway recess at (0, 0, 0) ground level
colour_value:         --token-color-ark-antiquarian-library-bookshelf  (dark walnut + phosphorescent text-glow from books)
embedded_displays:    none (the books ARE the content)
embedded_doors:
  - door_id: ark.antiquarian_library.south.archway.entry
    position: (0.00, 0.00, 0.00)
    dimensions: 1.40 × 2.40 × 0.10
    door_class: portal  (non-Euclidean teleport; the archway is the only physical exit — leads back to Archives §A.4)
    connecting_space_id: ark.archives
decorative_features:
  - id: ark.antiquarian_library.south.gallery_railings.<n>  (4 visible gallery railings at z = 4.80, 9.60, 14.40, 19.20)
    position: along south wall at each gallery
    dimensions: 28.00 × 0.10 × 1.05 each (long railing; bronze)
    material: bronze with brass capping
    narrative_role: gives galleries their architectural definition; player can lean against to look down
  - id: ark.antiquarian_library.south.entry_archway_relief
    position: (0.00, 0.20, 3.20)  # above archway
    dimensions: 1.40 × 0.60 × 0.10
    material: cast bronze with engraved text + carved laurel
    narrative_role: reads "WHAT IS LOST IS FOUND HERE" — the library's primary maxim
```

#### Walls: East, North, West (continuous bookshelves; near-identical structure)

```
wall_id:              east_bookshelf, north_bookshelf, west_bookshelf
material_primary:     same as south
material_secondary:   bronze shelf-supports + gallery railings
panelisation:         continuous bookshelves with periodic decorative friezes
colour_value:         --token-color-ark-antiquarian-library-bookshelf
embedded_displays:    none
embedded_doors:        none (all walls are bookshelves; no other exits)
decorative_features:
  - id: ark.antiquarian_library.<wall>.gallery_railings.<n>  (continuing around perimeter)
  - id: ark.antiquarian_library.east.painted_inscription_zone
    position: (13.95, 14.00, 8.00)  # mid-wall on east, gallery 2 level
    dimensions: 4.00 × 1.20 × 0.05
    material: cast bronze with high-relief carved text
    narrative_role: depicts "the first lost book" (a canonical mythological event); inspect-readable lore
  - id: ark.antiquarian_library.north.relief.first_chess_match
    position: (0.00, 27.95, 8.00)  # mid-wall on north
    dimensions: 4.00 × 2.40 × 0.10
    material: cast bronze with carved figures of two robed scholars at a chess board
    narrative_role: depicts the FIRST move of the cross-centuries chess game (cf §11.3.1); gameplay-relevant lore
  - id: ark.antiquarian_library.west.painted_inscription_zone
    position: (0.05, 14.00, 8.00)
    dimensions: 4.00 × 1.20 × 0.05
    material: cast bronze with high-relief carved text
    narrative_role: depicts "the last unwritten book" — the future-counterpart of east's first-lost-book
```

### A.13.5 Ceiling

```
height_above_floor:     24.00 m visible (perceptual); recursive above 19.20 m (galleries 5+ loop back)
material:               wooden coffered ceiling at z = 24.00; alternating skylights (4 large skylights at corners + 1 central) and book-mosaic panels
lighting_integrated:    skylights are the principal light source (impossible-physics sunlight); recessed accent strip-lights at each gallery walkway ceiling; central pendant chandelier above reading table (only at ground floor); occasional book-page-glow visible from adjacent galleries (lighting from books themselves)
atmospheric_features:   visible dust-motes in skylight beams; occasional book-particles (small motes from old paper) drifting in light shafts; subtle volumetric haze at upper galleries
acoustic_treatment:     coffered + paper-absorbent
```

### A.13.6 Lighting

```
ambient_baseline:     3500 K (warm-neutral; museum-library); 200 lux at floor level; CRI 96 (very high — preserves book-page legibility)
direct_fixtures:
  - id: ark.antiquarian_library.light.skylight_central
    position: (0.00, 14.00, 24.00)  # central in apparent ceiling
    beam_angle: 60° downward
    colour: --token-color-ark-antiquarian-library-skylight  (warm sunlight equivalent; varies through the day in canon)
    intensity: 8000 lumens
    function: principal task lighting at ground floor reading table
  - id: ark.antiquarian_library.light.skylight_corner.<n>  (4 corner skylights)
    position: (-12.00, 26.00, 24.00), (12.00, 26.00, 24.00), (-12.00, 2.00, 24.00), (12.00, 2.00, 24.00)
    beam_angle: 45° downward
    colour: same as central
    intensity: 4000 lumens each
    function: corner-illumination; creates dramatic light-and-shadow zones
  - id: ark.antiquarian_library.light.gallery_strip.<n>  (4 visible gallery strips)
    position: along each gallery walkway ceiling at z = 4.50, 9.30, 14.10, 18.90
    beam_angle: 180° wash
    colour: --token-color-ark-antiquarian-library-gallery-strip  (warm amber-white)
    intensity: 800 lumens per metre (long strip; 28 × 4 walls = 448 m of strip total per gallery)
    function: gallery walkway illumination
  - id: ark.antiquarian_library.light.central_chandelier
    position: (0.00, 14.00, 4.50)  # above reading table
    beam_angle: 360° (radial)
    colour: --token-color-ark-antiquarian-library-chandelier  (warm amber)
    intensity: 5000 lumens
    function: ground-floor focal lighting
  - id: ark.antiquarian_library.light.reading_table_lamp
    position: (0.00, 12.00, 0.85)  # on reading table
    beam_angle: 60° downward
    colour: 2400 K very warm
    intensity: 1500 lumens
    function: focused reading task light
practical_sources:
  - id: ark.antiquarian_library.book_page_glow.<varied>
    position: distributed throughout shelves (Acts 5+; some books have inherent phosphorescent ink)
    intensity: 30 lumens per glowing book (~12 books glow; positions varied)
    flicker_pattern: stable
  - id: ark.antiquarian_library.candle_array.antiquarian_chair
    position: (0.00, 16.00, 0.85)  # on Antiquarian's reading table
    intensity: 80 lumens
    flicker_pattern: organic flicker
time_of_day_variation:
  acts_3_to_7: lighting stable; in Act 7, if Antiquarian is "absent" (canonical end-state), skylights dim and a permanent twilight fills the library
dynamic_response:
  - on_player_at_reading_table: chandelier intensifies 10%; reading_table_lamp activates
  - on_player_at_chess_table: localised candle-array on chess-table activates (state-axis)
  - on_player_ascend_stair: gallery strip-lights ahead intensify 20%
  - on_player_at_recursive_gallery_5_loop: visual-distortion shimmer (player feels the loop)
```

### A.13.7 Atmosphere

```
air_temperature:    19°C (cool — preservation of paper); slightly warmer near skylights
humidity:           42% RH (book-friendly); smells of old paper + leather binding + walnut + faint tea (Antiquarian's habit)
particulate:
  - type: dust_motes
    density: medium (visible in skylight beams; magical quality — they almost shimmer)
    colour: warm-white
    drift_direction: slow downward in light shafts; random in shadow zones
  - type: book_page_motes
    density: low
    colour: very pale beige
    drift_direction: rises (cosmetic; suggests "knowledge ascending")
  - type: candle_smoke (Antiquarian's chair area)
    density: very low
    colour: very pale grey
    drift_direction: upward
volumetric_fog:     subtle haze in upper galleries (gallery 4+); 0.05 g/m³, warm-amber
wind_drift:         very faint; 0.01 m/s; subtle convection toward skylights
smell_canon:        old paper + leather + walnut + faint tea; voice-line: "smells like the long memory of the world"
```

### A.13.8 Sound

```
ambient_bed:           file: antiquarian_library_ambient_bed_v1.ogg (loop); -36 dB; very faint distant page-rustle (continuous), book-creak (random), faint footsteps somewhere in upper galleries (player can never find their source — Easter egg)
point_sources:
  - id: ark.antiquarian_library.sound.book_settling.<various>
    position: distributed across shelves
    sound: occasional book-creak (random; -38 dB)
    occlusion_behaviour: standard
    trigger: random (period 60-120s)
  - id: ark.antiquarian_library.sound.page_rustle
    position: dynamic (random shelf at random time)
    sound: faint page-turn (random; -36 dB)
    occlusion_behaviour: standard
    trigger: random (period 30-90s)
  - id: ark.antiquarian_library.sound.distant_footsteps
    position: dynamic (varies between visits)
    sound: faint footsteps (very subtle; -42 dB; can never be located)
    occlusion_behaviour: with random pseudo-source
    trigger: random + long-period (period 120-240s)
  - id: ark.antiquarian_library.sound.antiquarian_breath
    position: (0.00, 16.00, 1.40)  # Antiquarian's chair
    sound: very faint slow breath (-44 dB)
    occlusion_behaviour: omnidirectional with subtle directional bias
    trigger: state-conditional (Antiquarian present)
  - id: ark.antiquarian_library.sound.chess_piece_settle
    position: (-6.00, 14.00, 0.85)  # chess table
    sound: occasional chess-piece-on-board (very rare; -34 dB)
    occlusion_behaviour: standard
    trigger: state-conditional (chess game progressing — state shared with §A.36 + §A.11)
  - id: ark.antiquarian_library.sound.upper_gallery_loop_shimmer
    position: at galleries 4-5 boundary
    sound: very subtle shimmer SFX when player crosses recursive boundary
    occlusion_behaviour: localised
    trigger: state-conditional (player ascending past gallery 4)
reverb_zone:           IR-impulse: antiquarian_library_v1.wav; wet-mix 24% (paper-absorbed reverb; intimate despite scale)
music_eligibility:     cutscene only (Category B cs_amb_antiquarian_library)
voice_line_eligibility:
  - speaker: the_antiquarian
    trigger: presence (Acts 3+)
    line_set: see §2.13.2 (Antiquarian presence-line set; full canonical voice direction in §2.4.2 of INCEPTION doc)
```

### A.13.9 Object inventory

Antiquarian's Library has 64 inventory objects. Many are bookshelves
(treated as multi-volume containers) — actual book counts in the
hundreds, but inventoried as their parent shelves.

#### A.13.9.1 The Central Reading Table

```
object_id:           ark.antiquarian_library.central_reading_table
object_class:        furniture
position:            (0.00, 14.00, 0.00)  # ground floor centre
dimensions:          2.40 × 1.20 × 0.85
rotation:            0°
material_primary:    polished walnut with a deep-leather inset top (charcoal); brass rim
material_secondary:  brass corner-caps with engraved laurel motifs
colour_value:        --token-color-ark-antiquarian-library-reading-table
interaction:         interactable
  - operate: opens reading-table UI (player can lay out books and inspect simultaneously)
  - inspect: lore-note about the table's history
narrative_role:      THE focal table; where the Antiquarian works; player can sit here when Antiquarian is absent
lore_anchor:         loredex.character.the_antiquarian
art_status:          producer_handoff
gameplay_hook_id:    trpc.antiquarian_library.reading_table.operate
wear_state:          worn at the leather inset (Antiquarian's preferred zone visible)
physical_constraints: collides
```

#### A.13.9.2 The Antiquarian's Chair

```
object_id:           ark.antiquarian_library.antiquarian_chair
object_class:        furniture  (also npc_anchor)
position:            (0.00, 16.00, 0.00)  # north of reading table
dimensions:          0.90 × 0.90 × 1.50
rotation:            180°  (faces south, toward reading table)
material_primary:    walnut frame with charcoal velvet upholstery; oversized armrests (the Antiquarian is large)
material_secondary:  brass detail-work; bronze nameplate "THE ANTIQUARIAN" (slightly worn)
colour_value:        --token-color-ark-antiquarian-library-antiquarian-chair
interaction:         interactable - sit (when Antiquarian is absent)
narrative_role:      THE Antiquarian's chair; permanent physical anchor; Antiquarian almost always present here
lore_anchor:         loredex.character.the_antiquarian
art_status:          producer_handoff
gameplay_hook_id:    trpc.antiquarian_library.chair.sit
wear_state:          worn at right armrest (Antiquarian is right-handed); cushion permanently indented
physical_constraints: collides; sittable
```

#### A.13.9.3 The Chess Table (cross-room state)

```
object_id:           ark.antiquarian_library.chess_table
object_class:        interactive  (state shared with §A.11 Captain's Quarters coffee-table chess + §A.36 Chess Hall central board)
position:            (-6.00, 14.00, 0.00)  # west of reading area
dimensions:          0.80 × 0.80 × 0.85
rotation:            0°
material_primary:    polished walnut with inlaid chess-board top
material_secondary:  brass corner-caps; bronze chess-clock fitted at side
colour_value:        --token-color-ark-antiquarian-library-chess-table
interaction:         interactable
  - examine: shows current state of cross-centuries chess game (cf §11.3.1)
  - move_piece (Antiquarian's turn): Antiquarian considers + moves
  - inspect: lore-note about the centuries-long match
narrative_role:      ANOTHER VIEW of the cross-centuries game; same game state as captain's coffee-table + chess hall central board (synchronised across rooms); shows the Antiquarian's working analysis position
lore_anchor:         §11.3.1 + §3.12.11 (HB9 Eternal Match)
art_status:          producer_handoff
gameplay_hook_id:    trpc.chess.antiquarian_library.examine + .move
wear_state:          worn at most-played pieces; centuries of patina
physical_constraints: collides
```

#### A.13.9.4 The Spiral Staircase (east of reading area)

```
object_id:           ark.antiquarian_library.spiral_staircase
object_class:        furniture  (functional traversal element)
position:            (10.00, 14.00, 0.00)  # base
dimensions:          1.80 × 1.80 × 24.00 (footprint × visible height; recursive above z = 19.20)
rotation:            0°
material_primary:    cast-bronze tread plates with brass railings; helix path
material_secondary:  brass nosing on each step; brass handrail
colour_value:        --token-color-ark-antiquarian-library-stair
interaction:         interactable
  - climb: player ascends to higher galleries; gallery 5 recursively loops back to gallery 3
narrative_role:      THE traversal element; emphasises the library's verticality; the recursive gallery 5 is a deliberate disorienting moment
lore_anchor:         loredex.aesthetic.dreamers_oneiric
art_status:          producer_handoff
gameplay_hook_id:    trpc.antiquarian_library.stair.ascend / .descend
wear_state:          worn at most-used steps (ground floor and gallery 1 transitions)
physical_constraints: collides; player can climb
```

#### A.13.9.5-12 The Eight Gallery-1 Bookshelves

Gallery 1 (z = 0 to 4.80) wraps the room with bookshelves.
Counted as 8 bookshelves around the perimeter (2 per wall).

```
object_id:           ark.antiquarian_library.bookshelf.gallery_1.<position>  (8 shelves; 2 per wall)
object_class:        container
positions:           distributed along all 4 walls at gallery 1 level
dimensions (each):   variable (~3.50 × 0.40 × 4.20)
rotation:            varies (faces inward toward room centre)
material_primary:    dark walnut with inlaid bronze name-plates (one per shelf-bay)
material_secondary:  bronze shelf-supports
colour_value:        --token-color-ark-antiquarian-library-bookshelf
interaction:         interactable
  - inspect_book: each book is a multi-screen lore-readable; ~50-100 books per shelf
narrative_role:      gallery 1 is "Common Knowledge" — accessible histories, philosophies, public records
lore_anchor:         loredex.system.lore_recovery + sub-categories per shelf
art_status:          producer_handoff
gameplay_hook_id:    trpc.antiquarian_library.bookshelf.inspect_book
wear_state:          slight wear at most-handled book-edges
physical_constraints: collides
```

#### A.13.9.13-20 Gallery-2 Bookshelves (8; "Hidden Knowledge")

Same template, gallery 2 level (z = 4.80 to 9.60). Books are
LESS accessible — gameplay-conditional (some require the cipher
key from §A.21).

#### A.13.9.21-28 Gallery-3 Bookshelves (8; "Forbidden Knowledge")

Gallery 3 level. Books are HIGHLY restricted — locked behind
gameplay puzzles + cross-room cipher-key requirements.

#### A.13.9.29-36 Gallery-4 Bookshelves (8; "Lost Knowledge")

Gallery 4 level. Books that the Antiquarian himself has not yet
read; some books shift content between visits.

#### A.13.9.37-44 Gallery-5+ Recursive Bookshelves (apparent shelves; recursive loop)

When the player ascends past gallery 4, they enter "gallery 5"
which is actually gallery 3 again (rendered with subtle visual
distortion to signal the loop). Total shelves rendered for the
loop are 8.

**Inventoried as a recursive gallery-stub** (not separate shelves;
the same shelves as gallery 3 with rendering offset).

Continuing inventory:

#### A.13.9.45 The Antiquarian's Personal Locker

```
object_id:           ark.antiquarian_library.antiquarian_locker
object_class:        container
position:            (-2.00, 16.50, 0.00)  # west of Antiquarian's chair
dimensions:          0.80 × 0.40 × 1.80
rotation:            180°
material_primary:    dark walnut with bronze handle
material_secondary:  bronze nameplate engraved with abstract sigil
colour_value:        --token-color-ark-antiquarian-library-locker
interaction:         interactable
  - open: contains Antiquarian's personal effects (a journal — the gameplay-key journal in Act 6; a portrait of his wife (deceased); a brass coin; an unfinished letter)
  - inspect (closed): lore-note
narrative_role:      personal effects of the Antiquarian; humanises him; gameplay-key Act 6
lore_anchor:         loredex.character.the_antiquarian + arc.act_6_antiquarian_personal_arc
art_status:          producer_handoff
gameplay_hook_id:    trpc.antiquarian_library.locker.open
wear_state:          worn at handle; cherished
physical_constraints: collides
```

#### A.13.9.46 The Antiquarian's Tea Service (on reading table)

```
object_id:           ark.antiquarian_library.tea_service
object_class:        decoration
position:            (0.30, 14.50, 0.85)  # on reading table corner
dimensions:          0.30 × 0.30 × 0.20
rotation:            0°
material_primary:    cast porcelain (ceremonial pattern) + brass tray
material_secondary:  brass teaspoon
colour_value:        --token-color-ark-antiquarian-library-tea-service
interaction:         inspectable
  - inspect: lore-note about Antiquarian's tea preferences (small but humanising detail)
narrative_role:      humanises Antiquarian; tea is canonically his anchor habit
lore_anchor:         loredex.character.the_antiquarian
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          slight wear at most-touched cup edges
physical_constraints: collides
```

#### A.13.9.47-50 Reading Chairs (4 visitor chairs around reading table)

```
object_id:           ark.antiquarian_library.visitor_chair.<position>  (4 chairs around reading table)
object_class:        furniture
positions:           [
  (-1.50, 12.50, 0.00),  # west
  (1.50, 12.50, 0.00),   # east
  (-1.50, 15.50, 0.00),  # NW
  (1.50, 15.50, 0.00),   # NE
]
dimensions (each):   0.80 × 0.80 × 1.20
rotation:            varies (faces reading table)
material_primary:    walnut frame with charcoal-leather seat
material_secondary:  brass tacks
colour_value:        --token-color-ark-antiquarian-library-visitor-chair
interaction:         interactable - sit
narrative_role:      visitor seating; player joins Antiquarian at the reading table
lore_anchor:         arc.lore_recovery
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          slight wear
physical_constraints: collides; sittable
```

#### A.13.9.51-54 The Four Painted Inscription Zones (one per wall)

Counted in walls section (see §A.13.4). Each is inspectable.

#### A.13.9.55-58 Gallery Railings (4 visible rings; one per gallery 1-4)

Counted in walls section (decorative_features).

#### A.13.9.59-62 Atmospheric Decorative Items

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.antiquarian_library.globe.celestial` | decoration | (1.50, 11.50, 0.00) on reading-table-adjacent stand | 0.40 × 0.40 × 1.20 | ornate brass celestial globe (canonical pre-Ark artifact) |
| `ark.antiquarian_library.globe.terrestrial` | decoration | (-1.50, 11.50, 0.00) | mirror | terrestrial globe |
| `ark.antiquarian_library.bust.first_antiquarian` | decoration | (-2.50, 11.00, 0.00) on plinth | 0.40 × 0.40 × 1.20 (plinth) + 0.40 × 0.40 × 0.50 (bust) | bust of "the first Antiquarian" |
| `ark.antiquarian_library.bust.first_programmer` | decoration | (2.50, 11.00, 0.00) on plinth | mirror | bust of "the first Programmer" (deliberate paired symmetry — the Antiquarian and Programmer have always been twins) |

#### A.13.9.62a — The Superhero Snowglobe (NEW future-DLC Hellbox candidate)

```
object_id:           ark.antiquarian_library.snowglobe.superhero_world
object_class:        interactive  (future Hellbox-class fx_emitter; gateway-pending)
position:            (0.00, 11.00, 0.00)  # on a small bronze pedestal between the two busts, centred on the reading-table back-line
dimensions:          0.30 dia × 0.40 height (snowglobe + brass base; pedestal beneath)
rotation:            0°
material_primary:    hand-blown glass dome with internal contained miniature world; cast-bronze base with engraved sigils (heroic motifs)
material_secondary:  bronze pedestal at z = 0.00 to 0.85 (0.40 × 0.40 × 0.85); the snowglobe sits at z = 0.85 to 1.25
colour_value:        --token-color-ark-antiquarian-library-snowglobe  (transparent dome with rich-saturated interior — primary colours visible through glass; bronze base + pedestal accent)
interaction:         interactable
  - inspect: opens lore-readable about the snowglobe's contained world (a vibrant city with figures in capes flying between skyscrapers, fighting cosmic threats; lightning crackles when shaken)
  - shake: subtle interactive — snow + lightning visible inside; faint distant heroic-orchestra music briefly audible
  - HB13_invoke (FUTURE DLC ONLY): when activated (gameplay conditions TBD in DLC), the snowglobe expands into a Matrix-of-Dreams Hellbox — player enters the contained superhero world
narrative_role:      DUAL FUNCTION — operationally a decorative artifact in baseline canon; cosmologically a FUTURE-DLC Hellbox gateway. Canonically: the Antiquarian collected it from a forgotten dimensional fold; the world inside is alive but contained. It pulses faintly at night (subtle cosmetic glow). Future DLC will make it a fully-functional Hellbox where the player enters as a hero/civilian/villain (player-choice) in the world inside.
lore_anchor:         loredex.system.future_dlc_hellboxes + loredex.character.the_antiquarian + arc.future_dlc_superhero_world (deferred)
art_status:          producer_handoff  (concept-only for baseline; full art-spec for DLC deferred)
gameplay_hook_id:    trpc.antiquarian_library.snowglobe.inspect + .shake (baseline) + trpc.hellbox.hb13.openGate (FUTURE DLC; not active in base game)
wear_state:          slight wear at base (Antiquarian shakes it occasionally — heard in his living-world routine §11.3.X cross-ref); the bronze base is polished from handling
physical_constraints: collides; cannot be taken; cannot be moved; pedestal is anchored
DLC notes:
  - For future DLC integration, the snowglobe will be the gateway anchor for HB13 — "The Vitruvian Tower" or similar (working title) — where player enters a vibrant superhero metropolis as a participant. The world inside has its own internal physics (enhanced gravity, energy projection, flight) and its own factions (Heroes / Villains / Civilians / Power Brokers).
  - The Master of R'lyeh moral question for HB13 is reserved: "Is power a duty, or a temptation?" (working draft; subject to DLC author confirmation).
  - When DLC ships, this object's interaction will expand from "inspect/shake" to full HB13_invoke transit per §3.12 cosmology pattern.
  - Physical realisation pre-DLC: the snowglobe pulses faintly (cosmetic — see ark.antiquarian_library.snowglobe.subtle_pulse_emitter below) and shaking shows brief inner-world lightning + distant music as a teaser.
```

#### A.13.9.62b — Snowglobe Subtle-Pulse Emitter (cosmetic; DLC tease)

```
object_id:           ark.antiquarian_library.snowglobe.subtle_pulse_emitter
object_class:        fx_emitter
position:            (0.00, 11.00, 1.05)  # at snowglobe centre
dimensions:          0.20 dia (volumetric)
rotation:            0°
material_primary:    n/a (volumetric source)
material_secondary:  n/a
colour_value:        --token-color-ark-antiquarian-library-snowglobe-pulse  (variable; primary-colour shifts; visible only at close range in low-light states)
interaction:         inert (cosmetic)
narrative_role:      teaser; subtle pulse signals "this is more than a decoration"; lightning-flash visible inside on rare random events (period 60-180s)
lore_anchor:         arc.future_dlc_superhero_world (teaser)
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          n/a
physical_constraints: non-collide
```

(NOTE: total inventory object count for §A.13 increases from 64 to 66 with these two additions. Future-DLC integration will shift A.13.9.62a's class from "interactive" (with limited baseline interaction) to "interactive + Hellbox-anchor" (full HB13 invocation). Documented in INCEPTION_ARK_FINAL_PRODUCTION.md §3.12.16 future-Hellbox-candidate registry as HB13.)

#### A.13.9.63-64 Closing Decorative Items

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.antiquarian_library.entry_archway_relief` (rolled into walls) | decoration | (0.00, 0.20, 3.20) | 1.40 × 0.60 × 0.10 | "WHAT IS LOST IS FOUND HERE" |
| `ark.antiquarian_library.distant_footsteps_emitter` | fx_emitter | dynamic | n/a | unlocateable distant-footsteps SFX source |

Total: 64 inventory objects.

### A.13.10 Camera-spawn-points (FPV cutscenes)

```
cutscene_id:         cs_amb_antiquarian_library  (Category B)
camera_position:     (0.00, 0.50, eye_level)  # at archway
camera_facing:       (0°, 15°, 0°)  # looking up at vaulted ceiling
avatar_height_anchor: eye_level
head_motion:         very slow pan upward from doorway; books on upper shelves visibly re-arrange themselves; lasts 22s

cutscene_id:         cs_lore_antiquarian_chair_first_meet  (one-shot Act 3)
camera_position:     (0.00, 12.00, eye_level)  # at reading table, opposite Antiquarian
camera_facing:       (0°, 0°, 0°)  # facing Antiquarian
avatar_height_anchor: eye_level
head_motion:         seated; Antiquarian looks up from book; first eye-contact moment

cutscene_id:         cs_lore_antiquarian_locker_open  (Act 6 gameplay-key)
camera_position:     (-1.50, 16.00, eye_level)  # at locker
camera_facing:       (-90°, -10°, 0°)
avatar_height_anchor: eye_level
head_motion:         hand-rig opens locker; reveals personal effects; Antiquarian's gentle voice in distance
```

### A.13.11 Doorways

```
door_id:            ark.antiquarian_library.south.archway.entry
connecting_space_id: ark.archives  (Archives §A.4)
door_position:      (0.00, 0.00, 0.00)
door_dimensions:    1.40 × 2.40 × 0.10
door_class:         portal  (non-Euclidean teleporter; the archway is the only physical exit; entering traverses the bigger-on-inside pocket)
unlock_condition:   Act 3+ (player must first discover the hidden archway in Archives)
transit_animation:  fade with subtle warp (1.5s); player feels the geometric shift
audio_signature:    page-rustle + faint chime + walnut creak
```

### A.13.12 Adjacency map

```
direct_adjacencies:
  - ark.archives (south archway; only physical adjacency)
one_hop_adjacencies:
  - none direct (the Library is a pocket dimension; no other portal entries)
state_shared_with (cross-room state coordination):
  - ark.captain_quarters (chess game state shared)
  - ark.chess_hall (chess game state shared; HB9 cosmology)
```

### A.13.13 Gameplay hooks

```
hooks:
  - hook_id:         antiquarian_library.operateReadingTable
    trigger:         player.operate on central_reading_table
    procedure:       trpc.antiquarian_library.reading_table.operate
    success_state:   reading_table_active = true
  - hook_id:         antiquarian_library.openLocker
    trigger:         player.open on antiquarian_locker
    procedure:       trpc.antiquarian_library.locker.open
    success_state:   antiquarian_locker_opened = true (one-shot triggers cutscene)
  - hook_id:         antiquarian_library.examineChessTable
    trigger:         player.examine on chess_table
    procedure:       trpc.chess.antiquarian_library.examine
    success_state:   chess_state_viewed = true
  - hook_id:         antiquarian_library.makeAntiquarianMove (player-as-antiquarian, rare)
    trigger:         (state-conditional) player.move on chess_table when Antiquarian is absent and player is Antiquarian-aligned
    procedure:       trpc.chess.antiquarian_library.move
    success_state:   move_made_as_antiquarian = true (rare lore-flag)
  - hook_id:         antiquarian_library.inspectShelfBook
    trigger:         player.inspect on bookshelf book
    procedure:       trpc.antiquarian_library.bookshelf.inspect_book
    success_state:   book_read = true (per-book; ~hundreds across all galleries)
  - hook_id:         antiquarian_library.ascendStair
    trigger:         player.climb on spiral_staircase
    procedure:       trpc.antiquarian_library.stair.ascend
    success_state:   gallery_<n>_visited = true (per-gallery)
  - hook_id:         antiquarian_library.recursiveGalleryLoop
    trigger:         player.ascend past gallery 4
    procedure:       trpc.antiquarian_library.recursion.loop
    success_state:   recursion_experienced = true (lore-flag; gives player the disorienting moment)
  - hook_id:         antiquarian_library.inspectGlobe
    trigger:         player.inspect on celestial_globe or terrestrial_globe
    procedure:       trpc.antiquarian_library.globe.inspect
    success_state:   globe_read = true (per-globe)
  - hook_id:         antiquarian_library.readPaintedInscription
    trigger:         player.inspect on painted_inscription_zone
    procedure:       trpc.antiquarian_library.inscription.read
    success_state:   inscription_read = true (per-inscription)
```

### A.13.14 Story-tie

```
primary_arcs:
  - arc.lore_recovery
  - §11.3.1 cross-centuries chess game (ground-state recorder)
  - arc.act_3_first_antiquarian_meeting
  - arc.act_6_antiquarian_personal_arc (locker)
  - arc.cipher_key_quest (one of 4 keys hidden in gallery 3 books — cf §A.21)
per_act_evolution:
  acts_0_2: room locked; player has no awareness of pocket dimension
  act_3: player discovers hidden archway in Archives §A.4; first meeting with Antiquarian (Category A cutscene); galleries 1-2 accessible
  act_4: gallery 3 accessible (with cipher unlock from §A.21); chess-table state visible
  act_5: gallery 4 accessible; some books shift content between visits (Editor's hand cross-ref)
  act_6: locker unlockable (with key gathered earlier); reveals Antiquarian's personal arc
  act_7: state-branched: if Antiquarian becomes "absent" (Acts 7 canonical end-state), library dims, books fall silent, recursion loop becomes more pronounced
npc_roster:
  - the_antiquarian: primary occupant; presence Acts 3+
  - the_player: visitor / scholar
  - the_distant_footsteps_emitter: presence-only (mysterious; never identified)
  - chess pieces (state shared with §A.11 + §A.36)
readables:
  - entry archway relief
  - 4 painted inscription zones (one per wall; canonical mythological events)
  - apsidal relief on north (first chess match)
  - hundreds of books across galleries 1-4 (varied lore-readables)
  - Antiquarian's locker contents (Act 6 reveal)
  - 2 globes (celestial + terrestrial)
  - 2 busts (first Antiquarian + first Programmer)
master_of_rlyeh_question: n/a (Library is not a Hellbox host; but it shares cosmology with HB9 Eternal Match)
```

### A.13.15 Special-FX

```
particle_systems:
  - dust_motes (medium; visible in skylight beams; magical-quality shimmer)
  - book_page_motes (low; rises through galleries)
  - candle_smoke (Antiquarian's tea-table)
  - recursion_distortion_particles (only visible at gallery 4-5 boundary; subtle warp shimmer)
volumetric_effects:
  - skylight_volumetric_beams (5 beams; dramatic light shafts through galleries)
  - upper_gallery_haze (subtle volumetric fog at galleries 4+)
  - non_euclidean_book_drift (books on highest shelves occasionally fall UPWARD through ceiling — cosmetic; tied to recursion)
procedural_animations:
  - books_subtle_re_arrange (Acts 3+; books on upper shelves slowly re-arrange themselves; very gradual; barely perceptible)
  - dust_motes_slow_drift (continuous)
  - antiquarian_breath_subtle_chest (when present)
  - candle_flicker (Antiquarian's tea-table; organic)
  - chess_pieces_settle (rare; very subtle when Antiquarian "considers")
  - distant_footsteps_random (rare; pseudo-random source)
  - bust_subtle_eye_track (Acts 6+; busts subtly track player movement; uncanny)
reactive_systems:
  - reading_table_lamp_on_player_proximity
  - antiquarian_chair_warmth_on_proximity (chair velvet ripples slightly)
  - chess_table_glow_on_examine
  - locker_glow_on_proximity (Acts 6+; faint outline glow as player approaches)
  - recursive_gallery_distortion_on_ascent (when player ascends past gallery 4)
```

### A.13.16 Avatar-parametricity

```
camera_height_variation:
  small_xenomorph (0.85m eye): camera height 0.85m; reading table feels at chest-level; alternate stand-on-step animation; gallery railings tower overhead
  short_humanoid (1.40m eye): standard
  average_humanoid (1.70m eye): standard
  tall_humanoid (2.05m eye): chandelier feels closer; reading-table feels small
  tall_xenomorph (2.70m eye): chandelier collides at head; alternate "kneel-at-table" mode; spiral-stair railings at hip-level
reachability:
  small_xenomorph: cannot reach top shelves at any gallery; alternate ladder provided at each gallery's bookshelf base
  small_xenomorph: cannot reach apsidal relief inspect-zone; relay-inspect from below
  others: all-reachable (with stair access)
audio_occlusion_variation:
  xenomorph_sensitive_hearing: distant-footsteps audible from any gallery; book-creak more pronounced
  synthetic_voice_avatar: Antiquarian's presence has slightly different "feel" (synthetic ear interprets the warm-velvet acoustics differently)
```

### A.13.17 Performance

```
polygon_budget:      450,000 polygons (massive perceptual scale + rich decoration; LOD critical)
texture_budget:      280 MB total (book covers are unique; many decorative carvings)
light_count_limit:   24 simultaneous dynamic lights
lod_plan:
  - hero_distance: 0-12m, full detail (immediate gallery)
  - mid_distance: 12-30m, mid detail (book covers as billboards; gallery details simplified)
  - low_distance: 30m+, low detail (mostly billboarded; recursion loop simplified to texture warp)
streaming_behaviour:
  - preload: ark.archives (south; entry portal)
  - on_player_at_reading_table: continuous-load chess game state from §A.11 + §A.36
```

---

## A.14 Guild Sanctum — FULL

**Status: FULL spec.** Cross-ref `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.14 (art-state prompts).

### A.14.1 Header

```
space_id:        ark.guild_sanctum
space_name:      Guild Sanctum
space_type:      ark_room  (faction-aligned but not deck-locked)
act_introduced:  Act 4
lore_anchor:     loredex.faction.guilds + arc.guild_progression + arc.act_4_first_guild_oath
aesthetic_tier:  solar_punk_cathedral  (faction-decorated; warm + ceremonial; the Ark's most communal-formal space outside the Bridge)
```

### A.14.2 Geometry

```
dimensions:           14.00 m × 14.00 m × 5.00 m  (bounding box; hexagonal footprint inscribed)
origin_point:         centre of floor (room is hexagonal; origin at geometric centre)
coordinate_axes:      +x = right, +y = forward (north), +z = up
floor_plan_geometry:  hexagonal  (7.00 m apothem; primary entrance at south face)
volumetric_anomalies: none in baseline; subtle resonance during multi-guild ceremonies (cosmetic; faction colours drift across central area)
```

The Guild Sanctum is hexagonal — six walls, each housing a guild
banner alcove. Central altar holds the player's guild allegiance
mark + cross-guild reputation tracker. North wall holds the Grand
Guild Charter (continuously-updating registry). The room is
intentionally communal — designed for multi-guild assemblies, not
private rituals.

Floor area: ~187 m².

### A.14.3 Floor

```
material_primary:     polished hardwood plank in radial pattern (6 wedges; one per hexagonal face); each wedge tinted slightly different per guild colour
material_secondary:   bronze inlay forming a 6-pointed star centred on altar; brass perimeter trim
pattern:              radial wedges + 6-pointed star inlay
wear_state:           pristine in early acts; in Act 5+, wear-trail to altar + most-used guild alcove
embedded_features:
  - id: ark.guild_sanctum.floor.charge_point.altar
    position: (0.00, 0.00, 0.00)
    dimensions: 0.40 × 0.40 × 0.05
    function: altar electronics + reputation-tracker
  - id: ark.guild_sanctum.floor.guild_alcove_anchor.<guild>  (6 anchors at 60° intervals; radius 5.50 m)
    position: per guild alcove
    dimensions: 0.30 × 0.30 × 0.05 each
    function: alcove banner power
acoustic_property:    soft_absorbent (hardwood + tapestry); RT60 = 0.45s (warm communal acoustic)
```

### A.14.4 Walls

The Guild Sanctum has 6 walls. The south face is the entrance;
the other 5 + south face all hold guild-banner alcoves (6 total
guilds represented).

```
wall_id:              perimeter_hex (6 walls; each hexagonal face holds a guild banner alcove)
material_primary:     polished walnut wainscoting (z = 0 to 1.20) + cream painted plaster above; warm domestic feel
material_secondary:   walnut chair-rail at z = 1.20; brass dado above; gold-leaf trim around guild alcoves
panelisation:         hexagonal corners + alcove recesses
colour_value:         --token-color-ark-guild-sanctum-wall  (warm cream + walnut + gold)
embedded_displays:
  - id: ark.guild_sanctum.south.display.guild_charter
    position: (0.00, -6.95, 1.80)  # near south entrance
    dimensions: 1.20 × 0.80 × 0.05
    content: live guild charter (player's allegiance + cross-guild reputation)
embedded_doors:
  - door_id: ark.guild_sanctum.south.door.main
    position: (0.00, -7.00, 0.00)
    dimensions: 1.40 × 2.40 × 0.10
    door_class: arch  (warm walnut frame; ceremonial bronze handles)
    connecting_space_id: ark.corridor.guild_approach
    unlock_condition: Act 4+
decorative_features:
  - id: ark.guild_sanctum.alcove.<guild>  (6 alcoves at 60° intervals; each 1.40 × 0.80 × 4.20)
    position: per hexagonal face
    dimensions: 1.40 × 0.80 × 4.20 each
    material: walnut backplane + gold-leaf rim + bronze guild-emblem display niche
    narrative_role: each alcove holds a guild banner + guild-emblem; player's allegiance shows here
  - id: ark.guild_sanctum.south.plaque.creed
    position: (0.00, -6.95, 3.20)
    dimensions: 1.00 × 0.40 × 0.02
    material: cast bronze with engraved text
    narrative_role: reads "ALONE WE ARE; TOGETHER WE BECOME"
```

### A.14.5 Ceiling

```
height_above_floor:     5.00 m baseline; central hexagonal dome rises to 6.20 m above altar
material:               warm-painted hardwood with bronze rib detailing radiating from oculus
lighting_integrated:    central oculus pendant; 6 alcove ceiling-strips define guild zones
atmospheric_features:   subtle warm dust drift in oculus light shaft
acoustic_treatment:     coffered + dome-resonant (warm)
```

### A.14.6-8 Lighting / Atmosphere / Sound (compact at full FULL fidelity)

```
lighting:
  ambient_baseline: 3000 K warm; 200 lux; CRI 92
  oculus_central: at (0.00, 0.00, 6.20); warm amber crystal scatter; 5000 lumens
  guild_alcove_strip.<n>×6: per alcove ceiling; 800 lumens each; tinted per guild
  altar_uplight: at (0.00, 0.00, 0.05); warm gold; 800 lumens
  practical_sources: alcove_emblem_glow.<guild>×6 — 80 lumens each (varies by guild allegiance status)
atmosphere: 22°C / 45% RH / smells of polished walnut + faint candle-wax + parchment
sound:
  ambient_bed: -34 dB; faint distant guild-chants, occasional bell, parchment rustle
  point_sources: altar_subtle_resonance; alcove_emblem_humm.<n>×6 (faint per-guild tone); distant_chants_random
  reverb_zone: guild_sanctum_v1.wav wet 24%
  music_eligibility: cutscene only (Guild-arc cutscenes; ceremonial gatherings)
  voice_line_eligibility: the_grand_master (rare named NPC); guild_voices_distant (ambient chants)
```

### A.14.9 Object inventory (compact)

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.guild_sanctum.central_altar` | interactive | (0.00, 0.00, 0.00) | 1.20 dia × 1.10 | altar with reputation-tracker |
| `ark.guild_sanctum.alcove.<guild>` (6) | container | per 60° interval at radius 5.50 m | 1.40×0.80×4.20 each | guild banner alcoves |
| `ark.guild_sanctum.guild_emblem.<guild>` (6) | decoration | per alcove niche at z=2.40 | 0.40×0.05×0.40 each | guild emblems (cast bronze) |
| `ark.guild_sanctum.guild_banner.<guild>` (6) | decoration | per alcove at z=2.50 | 0.05×1.20×3.00 each | hanging guild banners |
| `ark.guild_sanctum.observation_bench.<n>` (3) | furniture | between alcoves; radius 4.00 m | 1.40×0.40×0.45 each | curved hex benches |
| `ark.guild_sanctum.grand_master_anchor` | npc_anchor | (0.00, 3.00, 0.00) | 0.8×0.8×1.8 | Grand Master NPC |
| `ark.guild_sanctum.grand_master_lectern` | container | (-2.00, 3.00, 0.00) | 0.40×0.30×1.20 | bronze lectern; charter-tome |
| `ark.guild_sanctum.charter_book` | container | on lectern | 0.30×0.20×0.05 | open ledger |
| `ark.guild_sanctum.south.intercom` | console | (-1.00, -6.95, 1.50) | 0.20×0.10×0.30 | comms |
| `ark.guild_sanctum.fire_extinguisher.south` | interactive | (1.00, -6.95, 1.20) | 0.20×0.20×0.50 | safety |
| `ark.guild_sanctum.first_aid` | container | (-2.00, -6.95, 1.50) | 0.40×0.10×0.30 | medical |
| `ark.guild_sanctum.south.plaque.creed` | decoration | (0.00, -6.95, 3.20) | 1.00×0.40×0.02 | "ALONE WE ARE; TOGETHER WE BECOME" |
| `ark.guild_sanctum.compass_inlay` | decoration | (0.00, 0.00, 0.005) | 1.40×1.40×0.005 | 6-pointed star floor inlay |
| `ark.guild_sanctum.candle_array.<n>` (6) | interactive | per alcove base | 0.20×0.30×0.30 each | per-guild candle clusters |

Total: 30 inventory objects.

### A.14.10-17 Compact

```
camera_spawn_points:
  cs_amb_guild_sanctum (Cat B): POV at threshold; slow walk to altar; head pans across 6 guild banners; 18s
  cs_first_guild_oath (Act 4): POV at altar; player's hand on emblem of chosen guild; oath ritual

doorways: south.door.main → ark.corridor.guild_approach; arch; Act 4+

adjacency: direct ark.corridor.guild_approach (south); one_hop most other Ark rooms (community crossroads)

gameplay_hooks:
  - swearGuildOath: trpc.guild_sanctum.altar.swear (per-guild)
  - inspectGuildBanner: trpc.guild_sanctum.alcove.inspect (per-guild)
  - readGrandMasterCharter: trpc.guild_sanctum.lectern.read
  - lightCandle: trpc.guild_sanctum.candle.light

story_tie:
  primary_arcs:
    - act_4_first_guild_oath
    - guild_progression (continuous)
    - cross_guild_reputation
    - act_7_grand_alliance_ending (state-branched)
  per_act:
    acts_0_3: locked
    act_4: opens; first guild oath
    acts_5_6: cross-guild dynamics; reputation tracking
    act_7: state-branched: grand-alliance ending (all guilds aligned) vs. fractured ending
  npc_roster: the_grand_master (rare presence); the_player; guild_voices_distant (ambient)
  readables: creed plaque; charter-tome; 6 guild emblems (per-faction lore)
  master_of_rlyeh_question: n/a

special_fx: warm_dust; alcove_glow_per_guild; altar_resonance
procedural: oculus_subtle_pulse; banner_subtle_ripple; candle_flicker
reactive: alcove_intensify_on_approach; altar_glow_on_emblem_touch; charter_update_on_oath

avatar_parametricity: standard
performance: polygon_budget 220,000 / texture_budget 130 MB / light_count 16
streaming: preload guild_approach corridor
```

---

## A.15 Social Hub (Mess Hall) — FULL

**Status: FULL spec.** Cross-ref: `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.15 (art-state prompts).

### A.15.1 Header

```
space_id:        ark.social_hub
space_name:      Social Hub / Mess Hall
space_type:      ark_room
act_introduced:  Act 1
lore_anchor:     loredex.system.crew_social + arc.crew_relationships + arc.act_1_first_mess_meal
aesthetic_tier:  solar_punk_cathedral  (warm-domestic; the Ark's most lived-in room)
```

### A.15.2 Geometry

```
dimensions:           16.00 m × 12.00 m × 4.50 m
origin_point:         centre of floor at south entrance threshold
coordinate_axes:      +x = right, +y = forward (north), +z = up
floor_plan_geometry:  rectangular  (with alcove zones; bar zone at north-west, kitchen-pass at north-east, dining tables across central area, lounge zone at south-east)
volumetric_anomalies: none
```

The Social Hub is the Ark's most domestic space. Multi-zone:
8 dining tables in central area, bar at north-west corner,
kitchen pass-through at north-east, lounge zone with sofas at
south-east. The room is intentionally MULTI-FUNCTION — meals,
casual dialogues, NPC bonding events, scheduled gatherings.

Floor area: 192 m².

### A.15.3 Floor

```
material_primary:     polished walnut hardwood plank in herringbone pattern; 0.20 m × 1.20 m planks running diagonal at 45° from south wall
material_secondary:   wool rug (warm crimson with gold border) covering lounge zone (4.00 × 4.00 m at south-east corner); brass walkway-strip from entrance through to bar
pattern:              herringbone with rug accent in lounge; subtle wear-trails to bar + kitchen pass
wear_state:           well-used; pacing-trails to most-frequented tables; rug shows wear at sit-positions; subtle stains around bar
embedded_features:
  - id: ark.social_hub.floor.charge_point.bar
    position: (-6.00, 9.00, 0.00)  # under bar
    dimensions: 0.40 × 0.40 × 0.05
    function: bar electronics
  - id: ark.social_hub.floor.charge_point.kitchen_pass
    position: (5.50, 10.50, 0.00)  # at kitchen pass
    dimensions: 0.40 × 0.40 × 0.05
    function: warmer + display lights
  - id: ark.social_hub.floor.heating_grate.south
    position: (0.00, 1.50, 0.00)
    dimensions: 0.60 × 0.60 × 0.05
    function: under-floor heating
acoustic_property:    soft_absorbent (wool rug + warm wood); RT60 = 0.40s (warm and intimate)
```

### A.15.4 Walls

#### Wall: South (entrance)

```
wall_id:              south
material_primary:     painted plaster with walnut wainscoting (z = 0.00 to 1.20); warm cream plaster from z = 1.20 to ceiling
material_secondary:   walnut chair-rail; walnut crown-molding at z = 4.30
panelisation:         standard
colour_value:         --token-color-ark-social-hub-wall-south  (warm cream + dark walnut wainscoting)
embedded_displays:
  - id: ark.social_hub.south.display.menu_board
    position: (-3.00, 0.20, 1.80)
    dimensions: 1.00 × 0.80 × 0.05
    content: today's menu (chalk-style; rotates daily)
  - id: ark.social_hub.south.display.event_board
    position: (3.00, 0.20, 1.80)
    dimensions: 1.00 × 0.80 × 0.05
    content: scheduled gatherings, birthdays, ceremonies
embedded_doors:
  - door_id: ark.social_hub.south.door.main
    position: (0.00, 0.00, 0.00)
    dimensions: 1.40 × 2.40 × 0.10
    door_class: arch  (warm walnut frame; opens with welcome chime)
    connecting_space_id: ark.corridor.social_approach
decorative_features:
  - id: ark.social_hub.south.plaque.welcome
    position: (0.00, 0.20, 3.20)
    dimensions: 0.80 × 0.30 × 0.02
    material: brass with engraved text
    narrative_role: reads "ALL ARE FED HERE"
  - id: ark.social_hub.south.coat_hooks
    position: (-3.00, 0.20, 1.80) and (3.00, 0.20, 1.80) — banks of 4 hooks each
    dimensions: 0.30 × 0.05 × 0.10 each set
    material: brass
    narrative_role: visitors hang coats; gives "homely" feel
```

#### Wall: East

```
wall_id:              east
material_primary:     painted plaster with wainscoting
material_secondary:   walnut chair-rail
panelisation:         standard
colour_value:         --token-color-ark-social-hub-wall-east
embedded_displays:    none (intentional — domestic feel)
embedded_doors:        none
decorative_features:
  - id: ark.social_hub.east.painting.crew_portraits
    position: (7.95, 5.00, 1.80)
    dimensions: 2.40 × 1.20 × 0.04
    material: oil-on-canvas crew portrait collage (commissioned crew images; replaces with new crew over time)
    narrative_role: the "family" wall; visual record of Ark's living crew
  - id: ark.social_hub.east.bookshelf_recreational
    position: (7.95, 9.50, 0.00)
    dimensions: 0.40 × 1.50 × 2.00
    material: walnut shelf with novels, magazines, board games
    narrative_role: recreational reading; player can borrow items
```

#### Wall: North (bar + kitchen pass)

```
wall_id:              north
material_primary:     painted plaster with reinforced backsplash at kitchen-pass zone (white-tile from z = 0.85 to 2.40 for 4 m wide section)
material_secondary:   walnut chair-rail
panelisation:         standard except kitchen-pass zone
colour_value:         --token-color-ark-social-hub-wall-north  (warm cream + tile accent)
embedded_displays:
  - id: ark.social_hub.north.display.kitchen_status
    position: (5.00, 11.95, 1.80)  # at kitchen pass
    dimensions: 0.80 × 0.60 × 0.05
    content: kitchen status (currently serving / breakfast / lunch / dinner / late-snack)
embedded_doors:
  - door_id: ark.social_hub.north.door.kitchen
    position: (3.50, 11.95, 0.00)  # to kitchen sub-space (deferred)
    dimensions: 1.20 × 2.40 × 0.10
    door_class: slide
    connecting_space_id: ark.kitchen  (sub-space; deferred from FULL spec)
    unlock_condition: always (Act 1+)
decorative_features:
  - id: ark.social_hub.north.bar_zone
    position: (-6.00, 11.95, 0.00)
    dimensions: 4.00 × 0.05 × 4.00 (alcove zone)
    material: walnut wall + brass shelving
    narrative_role: bar zone — bottles + glasses on display
  - id: ark.social_hub.north.kitchen_pass_window
    position: (5.00, 11.95, 1.20)
    dimensions: 2.40 × 0.10 × 1.50  (pass-through window from kitchen)
    material: tile + bronze frame
    narrative_role: meal-pickup window
```

#### Wall: West

```
wall_id:              west
material_primary:     painted plaster with wainscoting
material_secondary:   walnut chair-rail
panelisation:         standard
colour_value:         --token-color-ark-social-hub-wall-west
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: ark.social_hub.west.fireplace
    position: (-7.95, 6.00, 0.00)
    dimensions: 1.80 × 0.40 × 1.80
    material: brick + cast-iron fireplace
    narrative_role: large stone fireplace — central west feature; players gather around for late-night dialogues
  - id: ark.social_hub.west.fireplace_mantle
    position: (-7.95, 6.00, 1.80)
    dimensions: 2.20 × 0.30 × 0.10
    material: stone mantle with bronze trim
    narrative_role: holds framed photos, candleholders, small tokens
```

### A.15.5 Ceiling

```
height_above_floor:     4.50 m baseline; coffered ceiling pattern (1.50 × 1.50 m squares)
material:               painted plaster with walnut crown-molding + coffered detailing
lighting_integrated:    central pendant chandelier above main dining area; recessed grid in coffers; bar pendants; kitchen-pass task lighting
atmospheric_features:   slight haze near bar (cosmetic; suggests beverage steam); occasional dust-motes in pendant beams
acoustic_treatment:     coffered + soft (rug + upholstery)
```

### A.15.6 Lighting

```
ambient_baseline:     2700 K (very warm; domestic); 200 lux at floor level; CRI 95
direct_fixtures:
  - id: ark.social_hub.light.central_chandelier
    position: (0.00, 6.00, 4.30)
    beam_angle: 360° (radial)
    colour: --token-color-ark-social-hub-chandelier  (warm amber)
    intensity: 6000 lumens (with crystal scatter)
    function: principal dining-area lighting
  - id: ark.social_hub.light.bar_pendant.<n>  (3 pendants over bar)
    position: (-7.00, 11.50, 3.80), (-6.00, 11.50, 3.80), (-5.00, 11.50, 3.80)
    beam_angle: 90° downward
    colour: 2400 K very warm
    intensity: 1500 lumens each
    function: bar task lighting
  - id: ark.social_hub.light.kitchen_pass_task
    position: (5.00, 11.50, 3.80)
    beam_angle: 60° downward
    colour: 4500 K bright
    intensity: 3000 lumens
    function: kitchen-pass food display
  - id: ark.social_hub.light.fireplace_mantle_uplight
    position: (-7.50, 6.00, 1.80)
    beam_angle: 30° upward
    colour: 2400 K very warm
    intensity: 800 lumens
    function: dramatic mantle accent
  - id: ark.social_hub.light.recessed_coffer_grid
    position: distributed in coffers
    beam_angle: 60° each
    colour: 3000 K
    intensity: 1200 lumens each
    function: ambient task
practical_sources:
  - id: ark.social_hub.fireplace_glow
    position: (-7.50, 6.00, 0.50)
    intensity: 800 lumens (when lit; usually lit Acts 4+)
    flicker_pattern: organic flicker
  - id: ark.social_hub.candle.dining.<n>  (3 small candles on dining tables; gameplay-conditional)
    position: per candle
    intensity: 30 lumens each
    flicker_pattern: organic
time_of_day_variation:
  acts_1_to_7: stable warm baseline; in late-act7, depending on player's social engagement, fireplace may always be lit (warm) or always cold (sterile)
dynamic_response:
  - on_player_at_bar: bar pendants intensify 20%
  - on_player_at_dining_table: nearest candles activate
  - on_player_at_fireplace: localised warmth glow
```

### A.15.7 Atmosphere

```
air_temperature:    22°C (warm, cosy)
humidity:           50% RH (welcoming); smells of bread + coffee + faint smoke (fireplace) + warm wood
particulate:
  - dust: very low (well-maintained)
  - bar_steam: low (cocktail-steam from bar)
  - kitchen_steam: medium (during meal service; from kitchen pass)
  - fireplace_smoke: low (when lit; rises through chimney)
volumetric_fog:     absent in baseline; subtle haze near bar + kitchen pass during peak meal-times
wind_drift:         minimal; 0.02 m/s
smell_canon:        bread + coffee + smoke + wood; voice-line: "smells like home"
```

### A.15.8 Sound

```
ambient_bed:           file: social_hub_ambient_bed_v1.ogg (loop); -28 dB; faint conversational hum, distant cookware-clatter from kitchen, occasional glass-clink, fireplace crackle
point_sources:
  - sound.fireplace_crackle: at fireplace; -28 dB; continuous when lit
  - sound.kitchen_clatter_distant: at kitchen pass; -34 dB; continuous (varies by time)
  - sound.bar_glassware: at bar; occasional glass-tink; -36 dB; random
  - sound.dining_chatter: dynamic at populated tables; -32 dB; ambient cyclic
  - sound.crew_laughter_random: dynamic; rare laugh-burst; -34 dB; random period 60-180s
reverb_zone:           IR-impulse: social_hub_v1.wav; wet-mix 18% (intimate)
music_eligibility:     ambient music allowed (warm jazz / soft instrumental during meals); cutscene-conditional during scripted events
voice_line_eligibility:
  - speaker: vex_solene, locke, elara: presence (any time off-duty)
    line set: see §2.15.2 (Social Hub multi-NPC presence)
  - speaker: cook (named NPC): rare
    line set: §2.15.2
```

### A.15.9 Object inventory

Social Hub has 56 inventory objects.

#### A.15.9.1-8 The Eight Dining Tables

```
object_id:           ark.social_hub.dining_table.<n>  (8 tables; arranged in 2 rows of 4)
object_class:        furniture
positions:           [
  (-4.50, 3.00, 0.00),  # SW row 1
  (-1.50, 3.00, 0.00),
  (1.50, 3.00, 0.00),
  (4.50, 3.00, 0.00),   # SE row 1
  (-4.50, 6.50, 0.00),  # SW row 2
  (-1.50, 6.50, 0.00),
  (1.50, 6.50, 0.00),
  (4.50, 6.50, 0.00),   # SE row 2
]
dimensions (each):   1.40 × 0.80 × 0.85
rotation:            0°
material_primary:    polished walnut with brass corner caps
material_secondary:  small bronze numbered plate (table 1-8)
colour_value:        --token-color-ark-social-hub-dining-table
interaction:         interactable
  - sit_with_npc: if NPC seated, opens dialogue; otherwise positional
  - inspect: lore-note about table (each has subtle NPC associations)
narrative_role:      seating for crew meals + casual dialogues; NPCs tend to claim specific tables (Vex frequents table 3, Locke table 5, etc.)
lore_anchor:         arc.crew_relationships
art_status:          producer_handoff
gameplay_hook_id:    trpc.social_hub.dining_table.sit
wear_state:          slight wear at most-frequented seats
physical_constraints: collides
```

#### A.15.9.9-40 Thirty-Two Dining Chairs (4 per table × 8 tables)

```
object_id:           ark.social_hub.dining_chair.<table>.<position>  (32 chairs)
object_class:        furniture
positions:           4 per dining table; flanking sides
dimensions (each):   0.80 × 0.80 × 1.20
rotation (each):     varies (faces table)
material_primary:    walnut frame with charcoal leather seat
material_secondary:  brass tacks
colour_value:        --token-color-ark-social-hub-dining-chair
interaction:         interactable - sit
narrative_role:      meal seating
art_status:          producer_handoff
gameplay_hook_id:    none (positional)
wear_state:          slight wear at most-frequented seats
physical_constraints: collides; sittable
```

#### A.15.9.41 The Bar

```
object_id:           ark.social_hub.bar
object_class:        interactive
position:            (-6.00, 11.00, 0.00)
dimensions:          4.00 × 1.00 × 1.10
rotation:            0°  (faces south, into the room)
material_primary:    polished walnut bar-top with brass foot-rail; underbench cabinets
material_secondary:  brass + glass shelves behind bar (with bottles + glasses display)
colour_value:        --token-color-ark-social-hub-bar
interaction:         interactable
  - operate: opens bar UI (player can order beverages, talk to bartender NPC)
  - inspect: lore-note about bar
narrative_role:      central social-zone; players catch NPCs here for dialogues
lore_anchor:         arc.crew_relationships
art_status:          producer_handoff
gameplay_hook_id:    trpc.social_hub.bar.operate
wear_state:          worn at bar-top (most touched)
physical_constraints: collides
```

#### A.15.9.42-45 Four Bar Stools

```
object_id:           ark.social_hub.bar_stool.<n>  (4 stools at bar)
object_class:        furniture
positions:           (-7.20, 10.20, 0.00), (-6.40, 10.20, 0.00), (-5.60, 10.20, 0.00), (-4.80, 10.20, 0.00)
dimensions (each):   0.40 × 0.40 × 0.85
rotation:            0°  (faces bar)
material_primary:    walnut + charcoal-leather seat
material_secondary:  brass footrest
colour_value:        --token-color-ark-social-hub-bar-stool
interaction:         interactable - sit
narrative_role:      bar seating; player can drink + talk
lore_anchor:         arc.crew_relationships
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          slight wear
physical_constraints: collides; sittable
```

#### A.15.9.46 Lounge Sofa (south-east corner)

```
object_id:           ark.social_hub.lounge_sofa
object_class:        furniture
position:            (5.00, 4.50, 0.00)
dimensions:          2.40 × 0.90 × 0.80
rotation:            225°  (faces SW into lounge zone)
material_primary:    deep crimson velvet upholstery on walnut frame
material_secondary:  brass tacks; brass armrest caps
colour_value:        --token-color-ark-social-hub-lounge-sofa
interaction:         interactable - sit (3-seat capacity)
narrative_role:      casual lounge seating; comfortable for extended dialogues
lore_anchor:         arc.crew_relationships
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          worn at sit-zones; cushions slightly indented
physical_constraints: collides; sittable
```

#### A.15.9.47-48 Two Lounge Armchairs

```
object_id:           ark.social_hub.lounge_armchair.east, .west
object_class:        furniture
positions:           (6.50, 3.00, 0.00), (3.50, 3.00, 0.00)
dimensions (each):   0.90 × 0.90 × 1.10
rotation (each):     faces lounge centre
material_primary:    crimson velvet on walnut frame
material_secondary:  brass armrest caps
colour_value:        --token-color-ark-social-hub-lounge-sofa
interaction:         interactable - sit
narrative_role:      paired armchairs face the sofa; intimate-conversation seating
lore_anchor:         arc.crew_relationships
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          slight wear
physical_constraints: collides; sittable
```

#### A.15.9.49 Lounge Coffee Table

```
object_id:           ark.social_hub.lounge_coffee_table
object_class:        furniture
position:            (5.00, 3.00, 0.00)
dimensions:          1.20 × 0.60 × 0.45
rotation:            0°
material_primary:    walnut with brass corner caps
material_secondary:  none
colour_value:        --token-color-ark-social-hub-coffee-table
interaction:         interactable
  - inspect: shows current items (chess board mid-game; books; glasses)
narrative_role:      shared surface; NPCs leave items here
lore_anchor:         arc.crew_relationships
art_status:          producer_handoff
gameplay_hook_id:    trpc.social_hub.coffee_table.inspect
wear_state:          slight wear
physical_constraints: collides
```

#### A.15.9.50 Fireplace (west wall)

Specced in walls A.15.4. Inventoried for completeness:

```
object_id:           ark.social_hub.fireplace
object_class:        interactive
position:            (-7.50, 6.00, 0.00)
dimensions:          1.80 × 0.40 × 1.80
rotation:            90°
material_primary:    brick + cast-iron
material_secondary:  brass screen + tools
colour_value:        --token-color-ark-social-hub-fireplace
interaction:         interactable
  - light: lights fire (ambient warmth + light; gameplay-flag for cosy state)
  - extinguish: extinguishes
  - inspect: lore-note
narrative_role:      west-wall focal feature; gathering point for late-night dialogues
lore_anchor:         arc.crew_relationships
art_status:          producer_handoff
gameplay_hook_id:    trpc.social_hub.fireplace.toggle
wear_state:          soot patina
physical_constraints: collides
```

#### A.15.9.51-56 Decorative + Closing Items

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.social_hub.fireplace_mantle.framed_photos` | decoration | on mantle | 0.20 × 0.30 × 0.04 each (3 photos) | crew family photos |
| `ark.social_hub.fireplace_mantle.candleholders` | decoration | on mantle | 0.10 × 0.10 × 0.30 each (2 sets) | bronze candleholders |
| `ark.social_hub.south.intercom` | console | (-2.00, 0.20, 1.50) | 0.20 × 0.10 × 0.30 | comms relay |
| `ark.social_hub.fire_extinguisher.south` | interactive | (2.00, 0.20, 1.20) | 0.20 × 0.20 × 0.50 | safety |
| `ark.social_hub.first_aid.kit` | container | (-2.50, 0.20, 1.50) | 0.40 × 0.10 × 0.30 | medical |
| `ark.social_hub.bookshelf_recreational` (rolled walls) | container | east wall | 0.40 × 1.50 × 2.00 | books / games |

Total: 56 inventory objects.

### A.15.10 Camera-spawn-points (FPV cutscenes)

```
cutscene_id:         cs_amb_social_hub  (Category B; deferred catalogue)
camera_position:     (0.00, 0.50, eye_level)
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         slow walk-pan; head turns to fireplace (lit), bar (active), kitchen pass; lasts 22s

cutscene_id:         cs_first_mess_meal  (Act 1)
camera_position:     (0.00, 4.50, eye_level)  # at central dining area
camera_facing:       (0°, -10°, 0°)
avatar_height_anchor: eye_level
head_motion:         seated at table; meal placed before player; first crew dialogue
```

### A.15.11 Doorways

```
door_id:            ark.social_hub.south.door.main
connecting_space_id: ark.corridor.social_approach
door_position:      (0.00, 0.00, 0.00)
door_dimensions:    1.40 × 2.40 × 0.10
door_class:         arch
unlock_condition:   Act 1+
transit_animation:  fade
audio_signature:    walnut-creak + welcome chime

door_id:            ark.social_hub.north.door.kitchen
connecting_space_id: ark.kitchen  (sub-space; deferred)
door_position:      (3.50, 11.95, 0.00)
door_dimensions:    1.20 × 2.40 × 0.10
door_class:         slide
unlock_condition:   always
transit_animation:  fade
audio_signature:    soft slide
```

### A.15.12 Adjacency map

```
direct_adjacencies:
  - ark.corridor.social_approach (south door)
  - ark.kitchen (north kitchen door; sub-space)
one_hop_adjacencies:
  - many — Social Hub is a community crossroads adjacent to most decks
```

### A.15.13 Gameplay hooks

```
hooks:
  - hook_id:         social_hub.sitAtDiningTable
    trigger:         player.sit on dining_chair.<table>.<position>
    procedure:       trpc.social_hub.dining_table.sit
    success_state:   table_seat_active = true
  - hook_id:         social_hub.operateBar
    trigger:         player.operate on bar
    procedure:       trpc.social_hub.bar.operate
    success_state:   bar_active = true
  - hook_id:         social_hub.toggleFireplace
    trigger:         player.interact on fireplace
    procedure:       trpc.social_hub.fireplace.toggle
    success_state:   fireplace_state = lit | extinguished
  - hook_id:         social_hub.inspectCoffeeTable
    trigger:         player.inspect on lounge_coffee_table
    procedure:       trpc.social_hub.coffee_table.inspect
    success_state:   coffee_table_inspected = true
  - hook_id:         social_hub.takeBookFromShelf
    trigger:         player.inspect on bookshelf_recreational
    procedure:       trpc.social_hub.bookshelf.take
    success_state:   book_borrowed = true
  - hook_id:         social_hub.takeBarStool
    trigger:         player.sit on bar_stool.<n>
    procedure:       trpc.social_hub.bar_stool.sit
    success_state:   bar_stool_active = true
```

### A.15.14 Story-tie

```
primary_arcs:
  - arc.crew_relationships (continuous; central to the room)
  - arc.act_1_first_mess_meal
  - arc.npc_bonding_events
per_act_evolution:
  acts_0: room locked
  act_1: opens; first mess meal cutscene; basic dialogue available
  acts_2_4: NPC bonding events (varied by player choices); fireplace gets used more often as crew "settles in"
  act_5: deep crew dialogues; secrets revealed at fireside
  act_6: rare crew gatherings (events affect ambient occupancy)
  act_7: state-branched: well-bonded ending (room is alive, full of warmth) vs. distant ending (room is sterile, fireplace cold)
npc_roster:
  - vex_solene: frequent off-duty presence
  - locke: occasional presence (when not on bridge)
  - elara: occasional presence
  - the_cook: rare presence
  - other crew NPCs: rotating
readables:
  - welcome plaque (south)
  - menu board (south)
  - event board (south)
  - fireplace mantle photos (lore-readable)
  - bookshelf books (varied lore)
  - crew portraits (east wall)
master_of_rlyeh_question: n/a
```

### A.15.15 Special-FX

```
particle_systems:
  - dust (very low)
  - bar_steam (low; cocktail steam)
  - kitchen_steam (medium; from pass during meal-times)
  - fireplace_glow_particles (when lit)
  - candle_smoke (per candle)
volumetric_effects:
  - chandelier_crystal_scatter (rainbow prisms on rug)
  - fireplace_volumetric_glow (when lit)
  - bar_pendant_volumetric_beams
procedural_animations:
  - chandelier_subtle_sway
  - fireplace_flame_dance (when lit)
  - candle_individual_flicker
  - distant_kitchen_steam_rise
  - dining_chair_subtle_settle
reactive_systems:
  - chandelier_intensify_during_meals (state-conditional)
  - bar_pendant_warmth_on_bar_use
  - kitchen_pass_brighten_during_service
  - fireplace_warmth_pulse_on_lit_state
```

### A.15.16 Avatar-parametricity

```
camera_height_variation:
  small_xenomorph (0.85m eye): 0.85m; tables at chest-level; alternate child-height seating
  short_humanoid (1.40m eye): standard short scale
  average_humanoid (1.70m eye): standard
  tall_humanoid (2.05m eye): comfortable
  tall_xenomorph (2.70m eye): chandelier collides; alternate route
reachability:
  small_xenomorph: cannot reach top bar shelves; bartender NPC handles requests
  others: all-reachable
audio_occlusion_variation:
  xenomorph_sensitive_hearing: chatter and laughter more pronounced; intimate
  synthetic_voice_avatar: subtle audio bias
```

### A.15.17 Performance

```
polygon_budget:      280,000 polygons (rich furniture density)
texture_budget:      150 MB total
light_count_limit:   18 simultaneous dynamic lights
lod_plan:
  - hero_distance: 0-10m, full detail
  - mid_distance: 10-22m, mid detail (small decor simplified)
  - low_distance: 22m+, low detail
streaming_behaviour:
  - preload: ark.corridor.social_approach (south)
  - on_meal_time: preload kitchen sub-space content
```

---

## A.16 Station Dock — FULL

**Status: FULL spec.** Cross-ref `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.16 (art-state prompts).

### A.16.1 Header

```
space_id:        ark.station_dock
space_name:      Station Dock
space_type:      ark_room
act_introduced:  Act 2
lore_anchor:     loredex.system.station_dock + arc.station_visits + arc.act_2_first_dock
aesthetic_tier:  solar_punk_cathedral  (industrial-port accents; the Ark's primary external-trade interface)
```

### A.16.2 Geometry

```
dimensions:           18.00 m × 12.00 m × 8.00 m
origin_point:         centre of floor at south entrance threshold (entrance is the south wall; +y axis points north toward the dock airlock)
coordinate_axes:      +x = right, +y = forward (north), +z = up
floor_plan_geometry:  rectangular  (with tall vertical volume; cargo gantry visible overhead at z = 6.00)
volumetric_anomalies: none
```

The Station Dock is the Ark's primary external-trade interface
where visiting NPCs board the ship from external space stations.
North wall has a large airlock door (3.00 × 3.00 m). A central
inspection counter sits at floor level. East wall houses customs
displays + visitor manifest. West wall has a 3-bay cargo storage
area. Cargo gantry visible overhead. The dock is busy (NPC
traffic) Acts 2-7 and increasingly cosmopolitan as more factions
visit.

Floor area: 216 m².

### A.16.3-8 Compact (full FULL fidelity)

```
floor: industrial steel deck plate (heavy load-bearing); 1.50×1.50 m tiles; bronze inlay outlining inspection-counter zone (3×3 m); brass walkway-strip from entrance to airlock
walls:
  south: gunmetal panel; south.display.dock_status (-2.5,0.2,1.8); south.display.visitor_log (2.5,0.2,1.8); south.door.main pressure_seal connects to ark.corridor.dock_approach (Act 2+); plaque "WELCOME / FAREWELL"
  east: gunmetal with customs-station display (4.95, 6.00, 2.50; 1.20×0.80); visitor-manifest display (4.95, 9.00, 2.50; 0.80×0.60); east_door.customs_office connects to ark.dock.customs_office (sub-space; deferred); customs warning sign
  north: airlock wall — dual-stage airlock door (3.00×3.00 pressure_seal; opens to ark.station.exterior — destination zone deferred); side panels with arrival-departure schedule + visitor-greeting display
  west: gunmetal with 3 cargo storage alcoves (each 1.40×1.20×3.00); cargo crane gantry visible above; west_door.warehouse connects to ark.cargo_hold (Act 3+ alternate route)
ceiling: 8.00 m baseline; cargo gantry track at z=6.00; high-bay industrial fixtures
lighting:
  ambient_baseline: 4500 K cool-industrial; 240 lux; CRI 88
  high_bay_array: distributed at z=7.00; 6000 lumens each
  airlock_warning_strobe: red-orange; activates during airlock cycles
  cargo_gantry_strip: along gantry; 600 lumens/m
  customs_station_pendant: focused over inspection counter; 4000 lumens
  visitor_indicator_lights: per visitor station; varies by status
atmosphere: 18°C / 42% RH / smells of steel + ozone (airlock cycles) + faint exhaust + diverse cargo (foreign goods)
sound:
  ambient_bed: -28 dB; HVAC drone, distant cargo-clank, occasional airlock-cycle, visitor-chatter ambient
  point_sources: airlock_cycle_engagement; cargo_gantry_servo; customs_terminal_buzz; visitor_voice_chatter (pseudo-random; multiple languages)
  reverb_zone: station_dock_v1.wav wet 28% (industrial)
  music_eligibility: cutscene only
  voice_line_eligibility: the_dockmaster (named NPC); customs_officer; visiting_npcs (rotating; multiple cultures)
```

### A.16.9 Object inventory (compact)

Station Dock has 32 inventory objects.

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.station_dock.inspection_counter` | interactive | (0.00, 6.00, 0.00) | 3.00×0.80×1.10 | central inspection counter |
| `ark.station_dock.customs_terminal` | console | (4.50, 6.00, 1.10) | 0.60×0.40×0.80 | east customs station |
| `ark.station_dock.visitor_log_display` | display | (4.95, 9.00, 2.50) | 0.80×0.60×0.05 | live visitor manifest |
| `ark.station_dock.cargo_alcove.<n>` (3) | container | west wall at y=2,6,10 | 1.40×1.20×3.00 each | cargo storage alcoves |
| `ark.station_dock.cargo_gantry_overhead` | interactive | overhead at z=6.00 | 18.0×0.40×0.40 | cargo crane track |
| `ark.station_dock.cargo_gantry_control` | console | (-3.00, 6.00, 0.00) | 0.80×0.40×1.10 | gantry operator station |
| `ark.station_dock.airlock_door.north` | door | (0.00, 11.95, 0.00) | 3.00×3.00×0.20 | dual-stage pressure-seal airlock |
| `ark.station_dock.airlock_warning_strobe` | fx_emitter | (0.00, 11.95, 4.50) | 0.40×0.40×0.40 | red-orange strobe |
| `ark.station_dock.airlock_status_display` | display | (-2.0, 11.95, 1.80) | 0.80×0.60×0.05 | airlock cycle status |
| `ark.station_dock.dockmaster_anchor` | npc_anchor | (0.00, 4.50, 0.00) | 0.8×0.8×1.8 | Dockmaster NPC |
| `ark.station_dock.customs_officer_anchor` | npc_anchor | (4.50, 4.50, 0.00) | 0.8×0.8×1.8 | Customs Officer NPC |
| `ark.station_dock.visitor_seating_bench.<n>` (4) | furniture | south wall benches | 2.00×0.40×0.45 each | visitor waiting seating |
| `ark.station_dock.south.intercom` | console | (-2.0, 0.2, 1.5) | 0.20×0.10×0.30 | comms |
| `ark.station_dock.fire_extinguisher.south` | interactive | (2.0, 0.2, 1.2) | 0.20×0.20×0.50 | safety |
| `ark.station_dock.first_aid` | container | (-3.0, 0.2, 1.5) | 0.40×0.10×0.30 | medical |
| `ark.station_dock.south.plaque.creed` | decoration | (0.00, 0.20, 3.20) | 1.00×0.40×0.02 | "WELCOME / FAREWELL" |
| `ark.station_dock.east.warning_sign.customs` | decoration | (4.95, 0.20, 3.50) | 0.40×0.30×0.01 | customs warning |
| `ark.station_dock.gantry_winch.<n>` (4) | decoration | along gantry | 0.30×0.30×0.20 each | cargo winches |
| `ark.station_dock.cargo_indicator_light.<alcove>` (3) | fx_emitter | per alcove | 0.10×0.10×0.10 | status (full/empty/locked) |
| `ark.station_dock.alert_strobe.<corner>` (4) | fx_emitter | corners at z=4.20 | 0.20×0.20×0.20 each | alert strobes |
| `ark.station_dock.compass_inlay` | decoration | (0.00, 6.00, 0.005) | 1.40×1.40×0.005 | floor inlay under counter |
| `ark.station_dock.diverse_cargo_pile.<n>` (varied) | decoration | scattered | varied | cosmetic foreign cargo containers |

Total: 32 inventory objects.

### A.16.10-17 Compact

```
camera_spawn_points:
  cs_amb_station_dock (Cat B): POV at threshold; slow walk past inspection counter to airlock; cargo gantry visible above; 22s
  cs_first_dock (Act 2): POV at inspection counter; first visiting NPC arrives; customs interaction begins

doorways:
  south.door.main → ark.corridor.dock_approach (Act 2+)
  north.airlock_door → ark.station.exterior (destination zone; deferred)
  east_door.customs_office → ark.dock.customs_office (sub-space; deferred)
  west_door.warehouse → ark.cargo_hold (Act 3+ alternate route)

adjacency:
  direct: ark.corridor.dock_approach (south), ark.cargo_hold (west, Act 3+), customs office (east; deferred)
  one_hop: ark.bridge (long-route), ark.trade_hub (via Cargo Hold)

gameplay_hooks:
  - operateInspectionCounter: trpc.station_dock.inspection.operate
  - operateCargoGantry: trpc.station_dock.gantry.operate
  - cycleAirlock: trpc.station_dock.airlock.cycle
  - inspectVisitorLog: trpc.station_dock.visitor_log.inspect
  - openCargoAlcove: trpc.station_dock.cargo_alcove.open

story_tie:
  primary_arcs: act_2_first_dock; station_visits (continuous); diplomatic_relations; act_5_first_alien_visitor
  per_act:
    acts_0_1: locked
    act_2: opens; first visiting NPC; basic customs
    acts_3_5: more diverse visitors; deeper diplomatic events
    acts_6_7: state-branched: cosmopolitan-hub ending vs. xenophobic-cold ending
  npc_roster: the_dockmaster; the_customs_officer; rotating visiting NPCs (multiple cultures + factions); the_player
  readables: creed plaque; visitor log; arrival-departure schedule; customs warnings; gantry-operation manual
  master_of_rlyeh_question: n/a

special_fx: dust low; airlock_steam (during cycles); cargo_drift_motes; multicultural_chatter_visualisation
volumetric: airlock_volumetric_steam; high_bay_volumetric_beams; gantry_motion_envelope
procedural_animations: gantry_idle_sway; airlock_cycle_animation; visitor_arrival_random
reactive: airlock_strobe_on_cycle; gantry_servo_on_use; dockmaster_response_on_arrival

avatar_parametricity: standard; xenomorph: comfortable scale (warehouse-like)
audio_occlusion: xenomorph: multicultural chatter more pronounced
performance: polygon_budget 320,000 / texture_budget 180 MB / light_count 18
streaming: preload dock_approach corridor + ark.cargo_hold (west door); on_visitor_arrival: preload visitor's faction-specific assets
```

---

## A.17 Engineering Core (Soldier Sanctum) — FULL

**Status: FULL spec.** Cross-ref `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.17 (art-state prompts).

### A.17.1 Header

```
space_id:        ark.engineering_core_sanctum
space_name:      Engineering Core (Soldier Sanctum)
space_type:      ark_room  (faction-locked; D8 hidden sanctum)
act_introduced:  Act 5 (Soldier-aligned only)
lore_anchor:     loredex.faction.soldiers + arc.faction_sanctum_unlocks + arc.act_5_soldier_oath
aesthetic_tier:  solar_punk_cathedral  (military-austere; barracks-aesthetic with sacred-oath accents)
```

### A.17.2 Geometry

```
dimensions:           10.00 m × 10.00 m × 4.50 m
origin_point:         centre of floor at south entrance threshold (entrance is the south wall, hidden behind a false bulkhead in Engineering Bay)
coordinate_axes:      +x = right, +y = forward (north), +z = up
floor_plan_geometry:  rectangular
volumetric_anomalies: none
```

The Soldier Sanctum is hidden behind Engineering Bay — a false
bulkhead in the southwest of Engineering reveals the door only
to faction-aligned players. Inside: square barracks with central
oath-stone dais. East + west walls hold 4 bunks each (8 total,
one per ranked soldier in the Ark's roster). North wall is
sacred — regimental colours banner + continuously-updating
fallen-soldier memorial. South wall has the duty roster +
sergeant's briefing zone.

Floor area: 100 m².

### A.17.3 Floor

```
material_primary:     industrial gunmetal-grey steel deck plate; 1.00 m × 1.00 m tiles; 4 mm gap; reinforced anti-skid texture (combat-spec)
material_secondary:   bronze inlay outlining the central oath-stone zone (2.00 × 2.00 m); brass perimeter trim; brass walkway-strip from entrance to oath-stone
pattern:              tactical grid + central oath-stone marker
wear_state:           well-used; pacing-trails to oath-stone, bunks, and weapons rack; in late-act if many soldiers fallen, additional wear at memorial-wall approach
embedded_features:
  - id: ark.engineering_core_sanctum.floor.charge_point.oath_stone
    position: (0.00, 5.00, 0.00)
    dimensions: 0.40 × 0.40 × 0.05
    function: oath-stone ritual-resonance power
  - id: ark.engineering_core_sanctum.floor.charge_point.bunk.east.<n>, .west.<n>  (8 anchor points)
    position: per bunk base
    dimensions: 0.30 × 0.30 × 0.05 each
    function: bunk-electronics + reading-lamp power
  - id: ark.engineering_core_sanctum.floor.cleansing_water_drain.south
    position: (0.00, 1.00, 0.00)
    dimensions: 0.20 × 0.20 × 0.10
    function: ritual cleansing-water drain (used during oath ceremonies)
acoustic_property:    hard_reflective (steel + bronze); RT60 = 0.50s (intentionally clean for oath-clarity)
```

### A.17.4 Walls

#### Wall: South (entrance)

```
wall_id:              south
material_primary:     painted steel panel with rivet-detail; matte gunmetal grey; reinforced
material_secondary:   bronze dado at z = 1.10 m
panelisation:         standard; 6 panels wide × 3 tall
colour_value:         --token-color-ark-engineering-core-sanctum-wall-south  (gunmetal-grey + crimson pin-stripe at z = 2.00 m — soldier-faction accent)
embedded_displays:
  - id: ark.engineering_core_sanctum.south.display.duty_roster
    position: (-2.50, 0.20, 1.80)
    dimensions: 0.80 × 0.60 × 0.05
    content: live duty-roster of the 8 soldiers; rotation schedule
  - id: ark.engineering_core_sanctum.south.display.recent_oaths
    position: (2.50, 0.20, 1.80)
    dimensions: 0.80 × 0.60 × 0.05
    content: log of oaths sworn (player's own + others')
embedded_doors:
  - door_id: ark.engineering_core_sanctum.south.door.main
    position: (0.00, 0.00, 0.00)
    dimensions: 1.20 × 2.40 × 0.10
    door_class: pressure_seal  (security; biometric + faction-token authentication)
    connecting_space_id: ark.engineering_bay  (via false bulkhead in Engineering's southwest corner)
decorative_features:
  - id: ark.engineering_core_sanctum.south.plaque.creed
    position: (0.00, 0.20, 3.20)
    dimensions: 1.00 × 0.40 × 0.02
    material: cast bronze with deep-etched text (battle-scarred patina)
    narrative_role: reads "DUTY UNTO DEATH / RETURN UNTO DUTY" — the soldier-faction creed
  - id: ark.engineering_core_sanctum.south.relief.fallen_companies
    position: (0.00, 0.20, 4.00)
    dimensions: 4.00 × 0.40 × 0.10
    material: cast bronze with relief-carving of historical soldier companies
    narrative_role: depicts the lineage of soldier-companies that have served the Ark
```

#### Wall: East (4 bunks)

```
wall_id:              east
material_primary:     painted steel with rivet-detail; reinforced
material_secondary:   bronze dado; bronze nameplates per bunk
panelisation:         standard; 4 bunk-recesses at y = 2.00, 4.00, 6.00, 8.00
colour_value:         --token-color-ark-engineering-core-sanctum-wall-east
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: ark.engineering_core_sanctum.east.bunk_alcove.<n>  (4 alcoves)
    position: distributed along east wall
    dimensions: 2.00 × 0.80 × 1.50 (alcove recess; bunk fits inside)
    material: reinforced steel with backing bracket
    narrative_role: each alcove holds a soldier's bunk + footlocker; bronze nameplate above
  - id: ark.engineering_core_sanctum.east.bunk_lamp.<n>  (4 lamps; one per bunk)
    position: above each bunk at z = 2.20
    dimensions: 0.20 × 0.10 × 0.20 each
    material: bronze pivot-arm with shielded bulb
    narrative_role: reading lamp; player-toggle
```

#### Wall: North (regimental colours + fallen memorial — the sacred wall)

```
wall_id:              north
material_primary:     polished obsidian-black stone cladding (NOT painted steel — sacred-formal); apsidal-vault detail at upper portion (3.50 m to 4.50 m)
material_secondary:   bronze dado; bronze sergeant's-platform railing
panelisation:         3 zones: west (memorial), centre (sergeant's elevated platform), east (regimental colours)
colour_value:         --token-color-ark-engineering-core-sanctum-wall-north  (deep obsidian-black with bronze + crimson accents)
embedded_displays:
  - id: ark.engineering_core_sanctum.north.display.alliance_status
    position: (-3.00, 9.95, 1.80)
    dimensions: 0.80 × 0.60 × 0.05
    content: current alliance-war status (cross-ref ark.war_room)
embedded_doors:        none
decorative_features:
  - id: ark.engineering_core_sanctum.north.regimental_banner
    position: (3.00, 9.85, 2.00)
    dimensions: 1.20 × 0.05 × 3.00
    material: deep crimson velvet with gold-embroidered soldier-faction sigil; bronze hanging-rod
    narrative_role: the regimental colours; the only banner of its kind on the Ark
  - id: ark.engineering_core_sanctum.north.fallen_memorial_wall
    position: (-3.00, 9.95, 1.50)
    dimensions: 0.05 × 4.00 × 2.00
    material: bronze panels with engraved fallen-soldier names; continuously updates as soldiers die in player's playthrough
    narrative_role: living memorial; the most-touched object in the room; soldiers stop here every shift to read
  - id: ark.engineering_core_sanctum.north.sergeant_platform
    position: (0.00, 9.50, 0.40)
    dimensions: 1.40 × 0.80 × 0.40 (raised platform)
    material: polished walnut + bronze railing
    narrative_role: where the Sergeant addresses soldiers from; elevated 0.40 m above floor
  - id: ark.engineering_core_sanctum.north.relief.duty_eternal
    position: (0.00, 9.85, 4.00)
    dimensions: 1.40 × 0.40 × 0.10
    material: cast bronze with deep relief
    narrative_role: depicts a soldier saluting; the room's symbolic apex
```

#### Wall: West (4 bunks; mirror of east)

```
wall_id:              west
material_primary:     same as east
material_secondary:   bronze dado; bronze nameplates per bunk
panelisation:         4 bunk-recesses (mirror of east)
colour_value:         --token-color-ark-engineering-core-sanctum-wall-west
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: ark.engineering_core_sanctum.west.bunk_alcove.<n>  (4 alcoves; mirror)
  - id: ark.engineering_core_sanctum.west.bunk_lamp.<n>  (4 lamps; mirror)
  - id: ark.engineering_core_sanctum.west.weapons_rack
    position: (-4.95, 1.50, 0.00)  # SW corner; below the southernmost bunk
    dimensions: 0.40 × 3.00 × 2.40
    material: reinforced steel rack with mag-locks + bronze trim
    narrative_role: service-weapons rack; 6 weapon slots; player can equip
```

### A.17.5 Ceiling

```
height_above_floor:     4.50 m baseline; central drop coffer at 4.00 m above the oath-stone (gives the central area intimacy)
material:               painted steel with industrial conduits visible; central coffer is matte-bronze panel
lighting_integrated:    recessed cool-white grid 1.20 m × 1.20 m on outer perimeter; central coffer has dim warm pendant for oath-rituals; bunk strip-lights along east + west walls; memorial uplights along north wall base
atmospheric_features:   subtle dust at perimeter; minimal — utilitarian
acoustic_treatment:     baffled (combat-grade dampening for oath-clarity)
```

### A.17.6 Lighting

```
ambient_baseline:     5500 K (cool; tactical-clinical; austere); 240 lux at floor level; CRI 88
direct_fixtures:
  - id: ark.engineering_core_sanctum.light.recessed_grid
    position: distributed across ceiling on 1.20 × 1.20 grid (excluding central coffer zone)
    beam_angle: 60° each
    colour: --token-color-ark-engineering-core-sanctum-recessed  (cool tactical white)
    intensity: 1500 lumens each
    function: ambient task lighting
  - id: ark.engineering_core_sanctum.light.central_coffer_pendant
    position: (0.00, 5.00, 4.00)
    beam_angle: 60° downward
    colour: --token-color-ark-engineering-core-sanctum-coffer  (warm amber — symbolic of oath)
    intensity: 4500 lumens (intensifies during ritual)
    function: oath-stone illumination; symbolic warm spotlight
  - id: ark.engineering_core_sanctum.light.bunk_strip.east, .west
    position: along bunk alcoves at z = 3.40
    beam_angle: 90° downward
    colour: 4500 K cool
    intensity: 800 lumens per metre
    function: bunk-zone definition
  - id: ark.engineering_core_sanctum.light.memorial_uplight
    position: along north wall memorial base at z = 0.05
    beam_angle: 30° upward
    colour: --token-color-ark-engineering-core-sanctum-memorial  (warm gold)
    intensity: 400 lumens per metre
    function: dramatic memorial uplighting
  - id: ark.engineering_core_sanctum.light.regimental_banner_uplight
    position: along banner base at z = 1.95
    beam_angle: 30° upward
    colour: --token-color-ark-engineering-core-sanctum-banner  (warm crimson-gold)
    intensity: 600 lumens
    function: banner accent
practical_sources:
  - id: ark.engineering_core_sanctum.bunk_reading_lamp.east.<n>, .west.<n>  (8 lamps)
    position: above each bunk
    intensity: 60 lumens each (when player-toggled on)
    flicker_pattern: stable
  - id: ark.engineering_core_sanctum.oath_stone_resonance_glow
    position: (0.00, 5.00, 0.05)  # at oath-stone base
    intensity: 600 lumens (during ritual; off baseline)
    flicker_pattern: pulses with player heartbeat during oath
time_of_day_variation:
  acts_5_to_7: stable cool baseline; in alert states (cross-ref Defense Command), red strobe activates; in late-act7, if many soldiers fallen, memorial uplight intensifies + bunks dim
dynamic_response:
  - on_oath_ritual: central coffer warms; oath-stone resonance glow activates; banner uplight intensifies
  - on_player_at_memorial: memorial uplight pulses with player breath
  - on_recent_death: memorial wall briefly flares red-orange (one-shot per death)
  - on_alert: red strobe at corners (state-conditional)
```

### A.17.7 Atmosphere

```
air_temperature:    19°C (cool, tactical)
humidity:           38% RH (low; weapon-friendly); smells of steel + gun oil + faint sweat (lived-in barracks) + bronze + leather (boots)
particulate:
  - type: dust
    density: low (well-maintained barracks)
    colour: greyish-iron
    drift_direction: random
  - type: cordite_residue
    density: very low (cosmetic; hint at recent training)
    colour: pale-grey
    drift_direction: rises slightly
volumetric_fog:     absent in baseline
wind_drift:         minimal; 0.04 m/s; HVAC pattern
smell_canon:        steel + gun oil + sweat + bronze + leather; voice-line: "smells like the oath, kept"
```

### A.17.8 Sound

```
ambient_bed:           file: engineering_core_sanctum_ambient_bed_v1.ogg (loop); -34 dB; rhythmic bunk-breathing (when bunks occupied), distant Engineering Bay reactor pulse audible through wall, occasional metal-creak
point_sources:
  - id: ark.engineering_core_sanctum.sound.bunk_breath.east.<n>, .west.<n>
    position: per occupied bunk
    sound: slow rhythmic breathing (when occupant present; -42 dB each)
    occlusion_behaviour: occluded by bunk-frame
    trigger: state-conditional
  - id: ark.engineering_core_sanctum.sound.reactor_through_wall
    position: (0.00, 0.20, 2.00)  # near south wall
    sound: muffled reactor pulse from Engineering Bay (period 4.2s; -38 dB)
    occlusion_behaviour: heavy wall-attenuation
    trigger: continuous
  - id: ark.engineering_core_sanctum.sound.oath_stone_resonance
    position: (0.00, 5.00, 0.40)
    sound: subtle harmonic hum (continuous, -40 dB)
    occlusion_behaviour: omnidirectional
    trigger: continuous
  - id: ark.engineering_core_sanctum.sound.sergeant_footstep
    position: dynamic (when Sergeant walks)
    sound: heavy boot on steel (-32 dB per step)
    occlusion_behaviour: standard
    trigger: state-conditional
  - id: ark.engineering_core_sanctum.sound.memorial_wall_subtle_resonance
    position: (-3.00, 9.95, 1.50)
    sound: very faint metallic resonance (continuous, -44 dB; reverent)
    occlusion_behaviour: omnidirectional
    trigger: continuous
reverb_zone:           IR-impulse: barracks_v1.wav; wet-mix 22% (clean tactical with reverent depth at memorial)
music_eligibility:     cutscene only (Hierarchy / Soldier-arc ritual cutscenes)
voice_line_eligibility:
  - speaker: the_sergeant (named NPC; rare presence Acts 5+): line set §2.17.2
  - speaker: soldier_oaths (state-conditional during ritual): pre-recorded oath texts
  - speaker: soldier_squadmates (rotating bunk-occupants): occasional ambient
```

### A.17.9 Object inventory

Engineering Core Sanctum has 32 inventory objects.

#### A.17.9.1 The Central Oath-Stone

```
object_id:           ark.engineering_core_sanctum.oath_stone
object_class:        interactive  (also fx_emitter — ritual-resonance source)
position:            (0.00, 5.00, 0.00)
dimensions:          1.20 dia × 0.80 height (cylindrical stone)
rotation:            0°
material_primary:    polished black granite with gold-inlay rim at top; carved soldier-faction sigil on top surface
material_secondary:  bronze base ring with engraved oath text (proto-Latin); brass interior glow when active
colour_value:        --token-color-ark-engineering-core-sanctum-oath-stone
interaction:         interactable
  - swear_oath: opens oath-ritual UI; player commits allegiance to soldier-faction; one-shot per playthrough
  - inspect: lore-note about the stone's history (canonical pre-Ark artifact; transferred from each predecessor ship)
narrative_role:      THE central artifact; soldier-faction allegiance ritual point; canonically the oldest object in the room
lore_anchor:         loredex.faction.soldiers + arc.act_5_soldier_oath
art_status:          producer_handoff
gameplay_hook_id:    trpc.soldier_sanctum.oath_stone.swear
wear_state:          worn at top surface (centuries of palm-prints from oath-takers); bronze base patinated
physical_constraints: collides; player can lay hand on top (interaction)
```

#### A.17.9.2-9 The Eight Bunks (4 east + 4 west)

```
object_id:           ark.engineering_core_sanctum.bunk.<wall>.<n>  (8 bunks total)
object_class:        furniture
positions:           [
  (3.50, 2.00, 0.00), (3.50, 4.00, 0.00), (3.50, 6.00, 0.00), (3.50, 8.00, 0.00),    # east 1-4
  (-3.50, 2.00, 0.00), (-3.50, 4.00, 0.00), (-3.50, 6.00, 0.00), (-3.50, 8.00, 0.00) # west 1-4
]
dimensions (each):   2.00 × 0.80 × 0.60 (mattress + frame)
rotation (each):     varies (faces aisle)
material_primary:    reinforced steel frame with thin grey wool blanket + folded crisp white sheet
material_secondary:  bronze nameplate above bunk (assigned soldier name)
colour_value:        --token-color-ark-engineering-core-sanctum-bunk
interaction:         interactable
  - sit / lay: player can rest (gameplay-buff)
  - inspect: shows soldier's nameplate + minor personal touches
narrative_role:      assigned bunks; player can sleep here for soldier-faction restoration buff
lore_anchor:         per-soldier (8 named NPCs)
art_status:          producer_handoff
gameplay_hook_id:    trpc.soldier_sanctum.bunk.sleep
wear_state:          slight wear at most-used (varies per soldier)
physical_constraints: collides; sittable + layable
```

#### A.17.9.10-17 Eight Footlockers (one per bunk)

```
object_id:           ark.engineering_core_sanctum.footlocker.<wall>.<n>  (8 lockers)
object_class:        container
positions:           at foot of each bunk (y-offset 1.00 m from bunk)
dimensions (each):   0.40 × 0.40 × 0.40
rotation:            varies
material_primary:    reinforced steel with bronze handle
material_secondary:  bronze nameplate (matches bunk)
colour_value:        --token-color-ark-engineering-core-sanctum-footlocker
interaction:         interactable
  - open: contains soldier's personal effects (varies per soldier — letters home, family photo, personal token, religious item, etc.)
  - inspect: lore-note
narrative_role:      personal storage; humanises the 8 named soldiers; gameplay-key in Act 6 if soldiers begin to die
lore_anchor:         per-soldier
art_status:          producer_handoff
gameplay_hook_id:    trpc.soldier_sanctum.footlocker.open
wear_state:          varies; most-handled lockers show wear at handle
physical_constraints: collides
```

#### A.17.9.18 The West Weapons Rack

```
object_id:           ark.engineering_core_sanctum.west.weapons_rack
object_class:        container
position:            (-4.95, 1.50, 0.00)
dimensions:          0.40 × 3.00 × 2.40
rotation:            90°
material_primary:    reinforced steel rack with mag-locks
material_secondary:  bronze nameplate per slot; brass grip-rests
colour_value:        --token-color-ark-engineering-core-sanctum-weapons-rack
interaction:         interactable
  - take_weapon: 6 weapon slots (rifle, pistol, knife, grenades, side-arm, ceremonial-blade); player can equip
  - inspect_weapon: per-weapon lore (each has history)
narrative_role:      service weapons; ceremonial-blade is gameplay-key for oath-ritual
lore_anchor:         loredex.system.cades_weapons + soldier-faction
art_status:          producer_handoff
gameplay_hook_id:    trpc.soldier_sanctum.weapons_rack.take
wear_state:          mag-locks slightly worn
physical_constraints: collides
```

#### A.17.9.19 The Sergeant's Platform + Briefing Podium

```
object_id:           ark.engineering_core_sanctum.sergeant_platform
object_class:        furniture  (also npc_anchor)
position:            (0.00, 9.50, 0.40)
dimensions:          1.40 × 0.80 × 0.40 (raised platform)
rotation:            180°  (faces south, addressing the room)
material_primary:    polished walnut platform with bronze railing
material_secondary:  bronze nameplate on railing front "THE SERGEANT"
colour_value:        --token-color-ark-engineering-core-sanctum-sergeant-platform
interaction:         interactable
  - stand_at_podium (when Sergeant absent; rare): symbolic player-position
  - inspect: lore-note
narrative_role:      where the Sergeant addresses soldiers; elevated to enforce hierarchy
lore_anchor:         loredex.character.the_sergeant
art_status:          producer_handoff
gameplay_hook_id:    trpc.soldier_sanctum.sergeant_platform.stand
wear_state:          worn at platform's south edge (where Sergeant's boots stand)
physical_constraints: collides; player can step up

object_id:           ark.engineering_core_sanctum.sergeant_briefing_podium
object_class:        container
position:            (0.00, 9.50, 1.20)  # on platform
dimensions:          0.40 × 0.40 × 0.40
rotation:            180°
material_primary:    polished walnut with brass corner caps
material_secondary:  brass plate on top with engraved soldier-faction sigil
colour_value:        --token-color-ark-engineering-core-sanctum-podium
interaction:         interactable
  - inspect: opens Sergeant's briefing notes (gameplay-key in Act 5+; reveals ongoing missions)
narrative_role:      Sergeant's working podium; daily briefings happen here
lore_anchor:         loredex.character.the_sergeant
art_status:          producer_handoff
gameplay_hook_id:    trpc.soldier_sanctum.briefing_podium.inspect
wear_state:          worn at most-touched corner
physical_constraints: collides
```

#### A.17.9.21 The Fallen Memorial Wall (north)

Specced in walls A.17.4. Inventoried for completeness:

```
object_id:           ark.engineering_core_sanctum.north.fallen_memorial_wall
object_class:        decoration  (also fx_emitter — uplight)
position:            (-3.00, 9.95, 1.50)
dimensions:          0.05 × 4.00 × 2.00
rotation:            180°
material_primary:    bronze panels with engraved fallen-soldier names
material_secondary:  bronze foundation strip with continuous uplight
colour_value:        --token-color-ark-engineering-core-sanctum-memorial
interaction:         inspectable
  - inspect: opens memorial-wall UI (player can read each fallen soldier's record + cause-of-death)
narrative_role:      continuously-updating memorial; emotional anchor; player visits between missions
lore_anchor:         loredex.system.cades_fallen + arc.act_6_first_squad_loss
art_status:          producer_handoff
gameplay_hook_id:    trpc.soldier_sanctum.memorial_wall.read
wear_state:          slight patina on most-touched names (where soldiers stop daily)
physical_constraints: non-collide (wall surface)
```

#### A.17.9.22 The Regimental Banner

Specced in walls. Inventoried for completeness.

```
object_id:           ark.engineering_core_sanctum.regimental_banner
object_class:        decoration
position:            (3.00, 9.85, 2.00)
dimensions:          1.20 × 0.05 × 3.00
rotation:            180°
material_primary:    deep crimson velvet with gold-embroidered soldier-faction sigil
material_secondary:  bronze hanging-rod
colour_value:        --token-color-ark-engineering-core-sanctum-banner
interaction:         inspectable
  - inspect: reads banner's history (canonical: carried into 7 wars before reaching the Ark)
narrative_role:      faction symbol; the only banner of its kind; reverent
lore_anchor:         loredex.faction.soldiers
art_status:          producer_handoff
gameplay_hook_id:    trpc.soldier_sanctum.banner.read
wear_state:          slight fading at edges (campaign-worn)
physical_constraints: non-collide (suspended)
```

#### A.17.9.23 The Sergeant's NPC Anchor

```
object_id:           ark.engineering_core_sanctum.sergeant_anchor
object_class:        npc_anchor
position:            (0.00, 9.50, 0.40)  # on the platform
dimensions:          0.80 × 0.80 × 1.80 (anchor only)
rotation:            varies (NPC pose-driven)
material_primary:    n/a
material_secondary:  n/a
colour_value:        n/a
interaction:         n/a (NPC presence — Sergeant addresses soldiers from here)
narrative_role:      Sergeant's primary anchor; he's present during morning + evening briefings
lore_anchor:         loredex.character.the_sergeant
art_status:          producer_handoff
gameplay_hook_id:    none (presence-driven)
wear_state:          n/a
physical_constraints: n/a
```

#### A.17.9.24 The Apsidal Relief

Specced in walls. Inventoried for completeness.

```
object_id:           ark.engineering_core_sanctum.north.relief.duty_eternal
object_class:        decoration
position:            (0.00, 9.85, 4.00)
dimensions:          1.40 × 0.40 × 0.10
rotation:            180°
material_primary:    cast bronze with deep relief
material_secondary:  none
colour_value:        --token-color-ark-engineering-core-sanctum-relief-bronze
interaction:         inspectable
  - inspect: lore-readable about the duty-eternal ideal
narrative_role:      depicts a saluting soldier; the room's symbolic apex
lore_anchor:         loredex.faction.soldiers
art_status:          producer_handoff
gameplay_hook_id:    trpc.soldier_sanctum.relief.read
wear_state:          slight patina
physical_constraints: non-collide (at height)
```

#### A.17.9.25-32 Closing Items

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.engineering_core_sanctum.south.intercom` | console | (-1.50, 0.20, 1.50) | 0.20 × 0.10 × 0.30 | comms relay |
| `ark.engineering_core_sanctum.fire_extinguisher.south` | interactive | (1.50, 0.20, 1.20) | 0.20 × 0.20 × 0.50 | safety |
| `ark.engineering_core_sanctum.first_aid.kit.south` | container | (-2.50, 0.20, 1.50) | 0.40 × 0.10 × 0.30 | medical |
| `ark.engineering_core_sanctum.alert_strobe.<corner>` (4) | fx_emitter | corners at z = 4.20 | 0.20 × 0.20 × 0.20 each | combat-alert strobes (off baseline) |
| `ark.engineering_core_sanctum.compass_inlay` | decoration | (0.00, 5.00, 0.005) | 1.40 × 1.40 × 0.005 | floor inlay around oath-stone |

Total: 32 inventory objects.

### A.17.10 Camera-spawn-points (FPV cutscenes)

```
cutscene_id:         cs_amb_engineering_core_sanctum  (Category B; deferred catalogue)
camera_position:     (0.00, 0.50, eye_level)
camera_facing:       (0°, 5°, 0°)
avatar_height_anchor: eye_level
head_motion:         slow walk-pan; head turns to scan bunks (left + right); pause; turns to memorial wall; lasts 22s

cutscene_id:         cs_first_oath  (Act 5 one-shot Soldier-aligned)
camera_position:     (0.00, 4.50, eye_level)  # at oath-stone, facing it
camera_facing:       (0°, -10°, 0°)
avatar_height_anchor: eye_level
head_motion:         hand-rig enters frame placing palm on stone-top; oath-stone glow activates; Sergeant's voice from north

cutscene_id:         cs_first_squad_loss  (Act 6+ state-conditional)
camera_position:     (-3.00, 9.00, eye_level)  # at memorial wall
camera_facing:       (-90°, -10°, 0°)
avatar_height_anchor: eye_level
head_motion:         hand-rig enters frame touching newly-engraved name; memorial uplight intensifies briefly

cutscene_id:         cs_alert_response  (state-conditional during alert)
camera_position:     (0.00, 5.00, eye_level)
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         room scrambles to alert (camera shake + ambient drops to red)
```

### A.17.11 Doorways

```
door_id:            ark.engineering_core_sanctum.south.door.main
connecting_space_id: ark.engineering_bay  (via false bulkhead in Engineering's southwest corner)
door_position:      (0.00, 0.00, 0.00)
door_dimensions:    1.20 × 2.40 × 0.10
door_class:         pressure_seal  (biometric + faction-token authentication)
unlock_condition:   Act 5+ Soldier-aligned only
transit_animation:  airlock-cycle (3s); on first entry, false-bulkhead reveal animation (8s)
audio_signature:    pneumatic-hiss + magnetic-clack + faction-recognition tone
```

### A.17.12 Adjacency map

```
direct_adjacencies:
  - ark.engineering_bay (south door; via false bulkhead)
one_hop_adjacencies:
  - ark.armory (via Engineering Bay west door)
  - ark.cades_console_pod (via Engineering Bay corridor)
  - ark.forge_workshop (via Engineering Bay east door)
state_shared_with:
  - ark.cades_console_pod (memorial-wall fallen-soldier names sync)
  - ark.armory (cadet-locker history-plaque sync)
```

### A.17.13 Gameplay hooks

```
hooks:
  - hook_id:         engineering_core_sanctum.swearOath
    trigger:         (state-conditional) player.interact on oath_stone (Act 5+ Soldier-aligned, first time)
    procedure:       trpc.soldier_sanctum.oath_stone.swear
    success_state:   soldier_oath_taken = true (one-shot triggers cs_first_oath)
  - hook_id:         engineering_core_sanctum.openFootlocker
    trigger:         player.open on footlocker.<wall>.<n>
    procedure:       trpc.soldier_sanctum.footlocker.open
    success_state:   footlocker_open = true (per-locker)
  - hook_id:         engineering_core_sanctum.takeWeaponFromRack
    trigger:         player.take on weapons_rack with selected weapon
    procedure:       trpc.soldier_sanctum.weapons_rack.take
    success_state:   weapon_equipped = true
  - hook_id:         engineering_core_sanctum.readMemorialWall
    trigger:         player.inspect on fallen_memorial_wall
    procedure:       trpc.soldier_sanctum.memorial_wall.read
    success_state:   memorial_read = true
  - hook_id:         engineering_core_sanctum.sleepInBunk
    trigger:         player.lay on bunk.<wall>.<n>
    procedure:       trpc.soldier_sanctum.bunk.sleep
    success_state:   sleep_buff_active (gameplay restoration)
  - hook_id:         engineering_core_sanctum.standOnSergeantPlatform
    trigger:         player.interact on sergeant_platform (when Sergeant absent)
    procedure:       trpc.soldier_sanctum.sergeant_platform.stand
    success_state:   sat_on_platform = true (rare lore-flag)
  - hook_id:         engineering_core_sanctum.readBriefingPodium
    trigger:         player.inspect on sergeant_briefing_podium
    procedure:       trpc.soldier_sanctum.briefing_podium.inspect
    success_state:   briefing_read = true
  - hook_id:         engineering_core_sanctum.readBanner
    trigger:         player.inspect on regimental_banner
    procedure:       trpc.soldier_sanctum.banner.read
    success_state:   banner_read = true
```

### A.17.14 Story-tie

```
primary_arcs:
  - arc.act_5_soldier_oath
  - arc.soldier_faction_progression (continuous Acts 5-7)
  - arc.fallen_soldier_lineage (memorial wall accumulates)
  - arc.act_6_first_squad_loss
per_act_evolution:
  acts_0_4: room locked + invisible (false bulkhead conceals door)
  act_5: room unlocks for Soldier-aligned players; first oath ritual; bunks initially fully occupied (8 named soldiers)
  act_6: first squad-loss (a named soldier dies in mission) — bunk emptied, name added to memorial wall, footlocker contents become readable lore
  act_7: state-branched: well-led-and-loyal ending (most soldiers alive; bunks occupied; banner pristine) vs. catastrophic-leadership ending (most bunks empty; memorial wall full; banner blood-stained)
npc_roster:
  - the_sergeant: named NPC; primary occupant; presence Acts 5+
  - the_8_named_soldiers: rotating bunk-occupants; 8 named NPCs (TBD canonical)
  - the_player: visitor / oath-taker
  - the_master_of_rlyeh: not present here (sanctum is sub-Hellbox; cosmology inherited from Hierarchy/HB2)
readables:
  - creed plaque (south)
  - fallen-companies relief (south)
  - duty-eternal relief (north)
  - regimental banner (history)
  - memorial wall (continuously updating)
  - 8 footlocker contents (per-soldier personal items)
  - sergeant's briefing podium notes
master_of_rlyeh_question: n/a (this is sub-content; cosmology is HB2-aligned for Hierarchy-aligned soldiers, secular for non-aligned)
```

### A.17.15 Special-FX

```
particle_systems:
  - dust (low; barracks accumulation)
  - cordite_residue (very low; cosmetic; suggests recent training)
  - oath_stone_resonance_motes (during ritual; gold-amber motes rise from stone)
volumetric_effects:
  - central_coffer_pendant_volumetric_beam (soft warm spotlight on oath-stone)
  - memorial_uplight_envelope (warm gold up the wall)
  - banner_uplight_envelope (warm crimson-gold)
  - alert_strobe_envelope (state-conditional)
procedural_animations:
  - oath_stone_subtle_pulse (continuous very-slow pulse; period 8s)
  - bunk_breath_visualisation (when occupied; very subtle chest rise)
  - banner_subtle_ripple (faint air-flow)
  - memorial_wall_name_etching_one_shot (when new name added)
  - regimental_banner_warmth_oscillation (during ritual)
reactive_systems:
  - oath_stone_glow_on_proximity (within 1.5 m, stone glows warmer)
  - memorial_intensify_on_player_proximity (warmth pulses with player breath)
  - bunk_lamp_on_player_interact (player-toggle)
  - sergeant_response_on_player_at_platform (presence-conditional)
  - alert_strobes_on_alert_state (state-conditional)
  - oath_ritual_one_shot (first-time gameplay)
  - memorial_etching_on_squad_death (state-conditional one-shot per death)
```

### A.17.16 Avatar-parametricity

```
camera_height_variation:
  small_xenomorph (0.85m eye): camera height 0.85m; bunks at chest-level (alternate climb-into-bunk animation); memorial wall feels enormous
  short_humanoid (1.40m eye): standard short scale
  average_humanoid (1.70m eye): standard
  tall_humanoid (2.05m eye): bunk ceiling at near-head-level; slight crouch
  tall_xenomorph (2.70m eye): bunks too small for sleep; alternate "rest standing" animation; alternate sergeant-platform approach
reachability:
  small_xenomorph: cannot reach top of weapons rack (top 2 slots); alternate stool provided
  small_xenomorph: cannot reach upper memorial-wall names; relay-inspect from below
  small_xenomorph: cannot reach apsidal relief; relay-inspect
  others: all-reachable
audio_occlusion_variation:
  xenomorph_sensitive_hearing: bunk-breathing more pronounced; reactor-pulse-through-wall richer
  synthetic_voice_avatar: oath-resonance has subtle synthetic bias (interprets harmonic differently)
```

### A.17.17 Performance

```
polygon_budget:      200,000 polygons (compact room; reinforced detail)
texture_budget:      120 MB total
light_count_limit:   14 simultaneous dynamic lights
lod_plan:
  - hero_distance: 0-8m, full detail
  - mid_distance: 8-15m, mid detail (bunk detail simplified; small items billboarded)
  - low_distance: 15m+, low detail
streaming_behaviour:
  - preload: ark.engineering_bay (south door; parent room)
  - on_oath_complete: unlock soldier-faction sub-content (mission archives, faction dialogues)
```

---

## A.18 Oracle Sanctum — FULL

**Status: FULL spec.** Cross-ref `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.18 (art-state prompts).

### A.18.1 Header

```
space_id:        ark.oracle_sanctum
space_name:      Oracle Sanctum
space_type:      ark_room  (D8 sanctum; faction-aligned)
act_introduced:  Act 5 (Oracle-aligned only)
lore_anchor:     loredex.faction.oracles + loredex.character.the_oracle + arc.oracle_arc + arc.act_5_first_scrying
aesthetic_tier:  dreamers_oneiric  (mystic-water; the Ark's most fluid space)
```

### A.18.2 Geometry

```
dimensions:           9.00 m diameter × 5.00 m  (circular footprint; bounding box 9×9×5)
origin_point:         centre of floor (room is circular; origin at geometric centre)
coordinate_axes:      +x = right, +y = forward (north), +z = up
floor_plan_geometry:  circular  (4.50 m radius; perfect symmetry)
volumetric_anomalies: subtle perceptual depth at scrying pool (1.30× perceptual; pool reads as deeper than physics suggests; reinforces oracular vision); gravity slightly reduced (~0.94g) at room centre
```

The Oracle Sanctum is a circular chamber dominated by a 4 m
diameter scrying pool at room centre. Oracle's chair sits at the
pool's north edge. Three observation alcoves at 120° intervals
hold scrying-fluid jars and ritual artifacts. Continuous
water-sound soundscape pervades the room. Hanging silver-mist
drapery between alcoves at z = 2.00 to 4.00 m gives the room
an ethereal threshold-of-vision quality.

Floor area: ~63.6 m².

### A.18.3 Floor

```
material_primary:     polished obsidian-black slate in radial-wedge tiles emanating from pool; 3 wedges (one per alcove); each wedge tapers from 0.30 m wide at pool-edge to ~3.00 m wide at perimeter; 4 mm gap between wedges
material_secondary:   bronze inlay forming a 3-pointed star centred on pool (5.00 m diameter inscribed); brass perimeter trim along curved wall base
pattern:              radial wedges + 3-pointed star inlay; subtle anti-slip etch radiating outward from pool
wear_state:           pristine in early acts; in Act 5+, slight wear-trail to pool edge from Oracle's chair; in Act 7, if many scryings performed, pool-edge tiles show repeated barefoot-prints
embedded_features:
  - id: ark.oracle_sanctum.floor.charge_point.scrying_pool
    position: (0.00, 0.00, 0.00)  # pool centre
    dimensions: 0.40 × 0.40 × 0.05
    function: pool fluid-circulation + lighting power
  - id: ark.oracle_sanctum.floor.charge_point.oracle_chair
    position: (0.00, 2.50, 0.00)  # under Oracle's chair
    dimensions: 0.30 × 0.30 × 0.05
    function: chair electronics
  - id: ark.oracle_sanctum.floor.alcove_anchor.<n>  (3 anchors at 120° intervals; radius 3.20 m)
    position: per alcove base
    dimensions: 0.30 × 0.30 × 0.05 each
    function: alcove resonance + scrying-fluid jar power
  - id: ark.oracle_sanctum.floor.water_drain.south
    position: (0.00, -4.30, 0.00)  # at south, near entrance
    dimensions: 0.20 × 0.20 × 0.10
    function: pool overflow drain (during high-stress scryings)
acoustic_property:    hard_reflective with subtle water-resonance overlay; RT60 = 0.65s (long; aquatic — supports Oracle's hum + ripple-cascade)
```

### A.18.4 Walls

The Oracle Sanctum has ONE continuous curved wall divided into
3 alcove-zones by structural pilasters between alcoves.

```
wall_id:              perimeter_curved (single continuous wall divided into 3 alcove-zones at 120° intervals)
material_primary:     polished obsidian-black marble cladding curving with the room; alternating with deep alcove recesses (3 alcoves; each 1.00 m wide × 0.80 m deep × 3.50 m tall)
material_secondary:   gold-leaf rim around each alcove; bronze pilasters (24 mm wide × 4.20 m tall) between alcoves; hanging silver-mist drapery between pilasters (z = 2.00 to 4.00)
panelisation:         3 alcoves + 3 pilasters + 3 drapery zones
colour_value:         --token-color-ark-oracle-sanctum-wall  (deep obsidian-black with gold + faint cyan accents)
embedded_displays:
  - id: ark.oracle_sanctum.south.display.scrying_log
    position: (0.00, -4.45, 1.80)  # at south, near entrance
    dimensions: 0.60 × 0.40 × 0.05
    content: log of recent scryings + their interpretations
embedded_doors:
  - door_id: ark.oracle_sanctum.south.door.main
    position: (0.00, -4.50, 0.00)
    dimensions: 1.20 × 2.40 × 0.10
    door_class: arch  (gold-inlaid bronze; opens with hush of falling water)
    connecting_space_id: ark.corridor.oracle_approach
    unlock_condition: Act 5+ (Oracle-aligned)
decorative_features:
  - id: ark.oracle_sanctum.alcove.<n>  (3 alcoves at 120° intervals — north, southeast, southwest of pool)
    position: per perimeter at radius 3.20 m
    dimensions: 1.00 × 0.80 × 3.50 each
    material: marble backplane + gold-leaf relief (Oracle sigil) + scrying-fluid jar display niche
    narrative_role: each alcove holds a scrying-fluid jar of different aspect (past, present, future); activates in different states
  - id: ark.oracle_sanctum.pilaster.<n>  (3 pilasters between alcoves)
    position: per perimeter at intervals between alcoves
    dimensions: 0.24 × 0.24 × 4.20 each
    material: cast bronze with gilt detail; fluted shaft
    narrative_role: structural; reinforces sacred geometry
  - id: ark.oracle_sanctum.drapery.<n>  (3 silver-mist drapes between pilasters)
    position: between pilasters at z = 2.00 to 4.00
    dimensions: 0.05 × 2.40 × 2.00 each (hanging)
    material: silver-mist gauze (semi-transparent; lightweight; flutters in convection)
    narrative_role: ethereal accent; suggests "veil between waking and vision"
  - id: ark.oracle_sanctum.south.plaque.principle
    position: (0.00, -4.45, 3.20)
    dimensions: 0.80 × 0.30 × 0.02
    material: cast bronze with gilt text + faint patina
    narrative_role: reads "WHAT WILL BE, IS" — Oracle's primary maxim
  - id: ark.oracle_sanctum.south.relief.first_scrying
    position: (0.00, -4.45, 4.00)
    dimensions: 1.40 × 0.40 × 0.10
    material: cast bronze with deep relief (Oracle figure leaning over pool)
    narrative_role: depicts the canonical first scrying; lore-discoverable
```

### A.18.5 Ceiling

```
height_above_floor:     5.00 m baseline; central oculus rises to 6.20 m above scrying pool (mirror-finish panel inside oculus reflects pool's surface upward — creates "infinite well" illusion)
material:               polished obsidian-black marble cladding with gold-leaf coffer pattern radiating from oculus; central dome is partially mirrored (reflects pool surface)
lighting_integrated:    central oculus (variable colour; matches scrying state); 3 alcove ceiling-strips define faction-aspect zones; subtle gold-edge lighting along pilaster tops
atmospheric_features:   visible mystic-motes drift continuously (cosmetic; suggests "presence of vision"); intensifies during active scryings
acoustic_treatment:     domed apsidal (slight whispering effect from curved geometry); supports cosmic-resonance harmonic
```

### A.18.6 Lighting

```
ambient_baseline:     2400 K (very warm) with cyan accent; 80 lux at floor (intentionally dim — gravity); CRI 90
direct_fixtures:
  - id: ark.oracle_sanctum.light.oculus_central
    position: (0.00, 0.00, 6.20)
    beam_angle: 60° downward
    colour: --token-color-ark-oracle-sanctum-oculus  (variable; matches current scrying state — neutral cyan baseline; warmer for past-aspect scryings; cooler for future-aspect)
    intensity: 3000 lumens (pulses with pool ripples; period 4-8s organic)
    function: principal — illuminates pool surface
  - id: ark.oracle_sanctum.light.alcove_strip.<n>  (3 alcove ceiling strips)
    position: at top of each alcove at z = 3.40
    beam_angle: 180° wash inward-downward
    colour: --token-color-ark-oracle-sanctum-alcove-strip  (warm amber per alcove; varies subtly per aspect)
    intensity: 600 lumens each
    function: alcove definition
  - id: ark.oracle_sanctum.light.pool_underwater_glow
    position: (0.00, 0.00, -0.20)  # below pool surface
    beam_angle: 360° upward
    colour: --token-color-ark-oracle-sanctum-pool-glow  (cyan-amber; flickers organically)
    intensity: 1500 lumens (varies with pool state)
    function: pool-surface illumination from beneath; reinforces "looking into" feel
  - id: ark.oracle_sanctum.light.pilaster_uplight.<n>  (3 pilaster uplights at base)
    position: at base of each pilaster (z = 0.05)
    beam_angle: 30° upward
    colour: --token-color-ark-oracle-sanctum-pilaster-uplight  (warm gold)
    intensity: 200 lumens each
    function: dramatic vertical uplighting
practical_sources:
  - id: ark.oracle_sanctum.candle_array.<alcove>  (3 candle clusters; one per alcove base)
    position: per alcove
    intensity: 50 lumens each (subtle; 3 candles per cluster)
    flicker_pattern: organic
  - id: ark.oracle_sanctum.scrying_fluid_jar_glow.<alcove>  (3 jars; one per alcove)
    position: in each alcove niche at z = 1.50
    intensity: 80 lumens each (active when that aspect is being scried)
    flicker_pattern: stable when active; off when dormant
time_of_day_variation:
  acts_5_to_7: stable warm-cyan baseline; in late-act7, oculus colour reflects player's strongest faction-alignment (echoes Eidolon Sanctum oculus mechanic)
dynamic_response:
  - on_player_at_pool: pool_underwater_glow intensifies; oculus pulse synchronises with player's heartbeat
  - on_scrying_initiated: mystic-motes intensify; alcove-strip of relevant aspect brightens; drapery flutters
  - on_oracle_visitation: subtle harmonic chime + Oracle's silhouette suggested in pool (rare cutscene-only)
```

### A.18.7 Atmosphere

```
air_temperature:    18°C (cool — water-source convection); rises slightly during active scryings
humidity:           55% RH (high; water source); smells of warm-stone + mineral water + faint salt + ozone (cosmic radiation hint)
particulate:
  - type: mystic_motes
    density: medium (continuous; cosmetic suggesting "presence of vision")
    colour: pale-cyan with gold flecks
    drift_direction: slow upward toward oculus
  - type: water_vapor
    density: low (cosmetic; rises from pool surface)
    colour: white-translucent
    drift_direction: rises slowly
  - type: candle_smoke
    density: very low (3 small candle clusters)
    colour: very pale grey
    drift_direction: upward
volumetric_fog:     subtle haze at upper volume (0.05 g/m³, warm-amber); intensifies during active scryings
wind_drift:         very faint; 0.02 m/s; subtle inward-spiral toward pool (water-convection)
smell_canon:        warm-stone + mineral water + salt + ozone; voice-line: "smells like the pool of seeing"
```

### A.18.8 Sound

```
ambient_bed:           file: oracle_sanctum_ambient_bed_v1.ogg (loop); -36 dB; continuous water-trickle from pool, faint distant bell-toll (period 90s), Oracle's hum (very faint, sub-perceptual when she's not present), mystic resonance overlay
point_sources:
  - id: ark.oracle_sanctum.sound.pool_lapping
    position: (0.00, 0.00, 0.00)  # pool centre
    sound: continuous water-lapping at edges (-30 dB)
    occlusion_behaviour: omnidirectional
    trigger: continuous
  - id: ark.oracle_sanctum.sound.distant_bell
    position: (0.00, 0.00, 6.20)  # from oculus
    sound: deep bell-toll (period 90s; -36 dB per toll)
    occlusion_behaviour: omnidirectional
    trigger: cyclic
  - id: ark.oracle_sanctum.sound.oracle_breath
    position: (0.00, 2.50, 1.40)  # at Oracle's chair
    sound: very faint slow breath (-44 dB; only when Oracle present)
    occlusion_behaviour: omnidirectional
    trigger: state-conditional
  - id: ark.oracle_sanctum.sound.cosmic_resonance_overlay
    position: (0.00, 0.00, 6.20)
    sound: very faint deep cosmic harmonic (-42 dB; continuous)
    occlusion_behaviour: omnidirectional
    trigger: continuous
  - id: ark.oracle_sanctum.sound.mystic_chime_random
    position: dynamic
    sound: subtle single-chime (random; -42 dB; period 60-180s; suggests "vision approaches")
    occlusion_behaviour: omnidirectional
    trigger: random
  - id: ark.oracle_sanctum.sound.candle_flicker.<n>  (3 sources)
    position: per candle cluster
    sound: very faint candle-flame (-44 dB each)
    occlusion_behaviour: standard
    trigger: continuous
reverb_zone:           IR-impulse: oracle_sanctum_v1.wav; wet-mix 32% (long; aquatic-cathedral)
music_eligibility:     cutscene only (Category B cs_amb_oracle_sanctum + Oracle-arc scrying cutscenes); ambient possible during active scrying (low oceanic pad)
voice_line_eligibility:
  - speaker: the_oracle: presence (Acts 5+ Oracle-aligned); line set §2.18.2
  - speaker: cosmic_resonance_voices: rare whispers during scryings (proto-language; subtitled per player choice)
  - speaker: vision_echoes: gameplay-driven during scrying-results
```

### A.18.9 Object inventory

Oracle Sanctum has 26 inventory objects.

#### A.18.9.1 The Central Scrying Pool

```
object_id:           ark.oracle_sanctum.scrying_pool
object_class:        interactive  (also fx_emitter — water + light source)
position:            (0.00, 0.00, 0.00)  # at room centre
dimensions:          4.00 dia × 0.40 deep (visible); 5.20 m perceptual depth (volumetric anomaly)
rotation:            0°
material_primary:    polished obsidian-black stone basin with bronze rim; clear water with faint cyan-amber luminescence
material_secondary:  gold-inlay band around rim with engraved Oracle text (proto-language)
colour_value:        --token-color-ark-oracle-sanctum-pool  (water clear with cyan-amber undertone)
interaction:         interactable
  - perform_scrying: opens scrying UI; player chooses aspect (past/present/future); pool reveals visions
  - inspect: lore-note about pool's history (canonical pre-Ark artifact; the original well of all visions)
  - touch_water: gameplay-active in some Acts; subtle sensation of "looking back"
narrative_role:      THE central artifact; primary scrying surface; cosmologically the only access point to oracular visions
lore_anchor:         loredex.system.scrying + arc.oracle_arc
art_status:          producer_handoff
gameplay_hook_id:    trpc.oracle_sanctum.pool.scry + .inspect
wear_state:          worn at rim where Oracle leans (north edge); pristine elsewhere
physical_constraints: collides at rim; player can lean over (interaction)
```

#### A.18.9.2 The Oracle's Chair

```
object_id:           ark.oracle_sanctum.oracle_chair
object_class:        furniture  (also npc_anchor)
position:            (0.00, 2.50, 0.00)  # north of pool, facing pool
dimensions:          0.90 × 0.90 × 1.50
rotation:            180°  (faces south, toward pool)
material_primary:    walnut frame with deep velvet-blue upholstery (cosmic-water aesthetic)
material_secondary:  gold-leaf armrests; bronze base
colour_value:        --token-color-ark-oracle-sanctum-oracle-chair  (velvet-blue with gold-leaf)
interaction:         interactable - sit (when Oracle absent — rare)
narrative_role:      THE Oracle's chair; her permanent physical anchor; she's almost always present here when player visits
lore_anchor:         loredex.character.the_oracle
art_status:          producer_handoff
gameplay_hook_id:    trpc.oracle_sanctum.oracle_chair.sit
wear_state:          worn at right armrest (Oracle's preferred posture; she leans forward to scry)
physical_constraints: collides; sittable
```

#### A.18.9.3 The Scrying Lectern

```
object_id:           ark.oracle_sanctum.scrying_lectern
object_class:        container
position:            (-1.50, 1.00, 0.00)
dimensions:          0.40 × 0.30 × 1.20
rotation:            45°  (faces Oracle's chair)
material_primary:    cast bronze with inclined display-plate
material_secondary:  open scrying-tome on the inclined plate
colour_value:        --token-color-ark-oracle-sanctum-lectern
interaction:         interactable
  - inspect: opens scrying-tome (multi-screen lore-readable; Oracle's working notes; gameplay-key for advanced scryings)
narrative_role:      Oracle's reference book; she consults during difficult scryings; player can read when Oracle absent
lore_anchor:         loredex.character.the_oracle + arc.oracle_arc
art_status:          producer_handoff
gameplay_hook_id:    trpc.oracle_sanctum.lectern.read
wear_state:          well-used; pages dog-eared at most-consulted entries
physical_constraints: collides
```

#### A.18.9.4-6 Three Alcoves (with scrying-fluid jars)

```
object_id:           ark.oracle_sanctum.alcove.<aspect>  (3 alcoves: past, present, future)
object_class:        container
positions:           [
  (0.00, 3.20, 0.00),                 # north — present-aspect (above Oracle's chair direction)
  (2.77, -1.60, 0.00),                # SE — past-aspect
  (-2.77, -1.60, 0.00),               # SW — future-aspect
]
dimensions (each):   1.00 × 0.80 × 3.50
rotation:            varies (faces inward toward pool)
material_primary:    polished obsidian-black marble backplane + display niche
material_secondary:  gold-leaf rim around alcove; bronze nameplate per aspect
colour_value:        --token-color-ark-oracle-sanctum-alcove
interaction:         interactable
  - examine: opens alcove-detail UI; player sees aspect-specific scrying-fluid jar + ritual artifacts
  - activate_aspect: choose which aspect to scry (past/present/future); affects oculus colour
narrative_role:      per-aspect ritual-zone; each holds scrying-fluid jar tuned to that temporal aspect
lore_anchor:         loredex.system.scrying_aspects
art_status:          producer_handoff
gameplay_hook_id:    trpc.oracle_sanctum.alcove.activate
wear_state:          slight wear at most-used aspect (varies by player)
physical_constraints: collides; player can step inside
```

#### A.18.9.7-9 Three Scrying-Fluid Jars (one per alcove)

```
object_id:           ark.oracle_sanctum.scrying_fluid_jar.<aspect>  (3 jars)
object_class:        decoration  (also fx_emitter — glow when active)
positions:           in each alcove niche at z = 1.50
dimensions (each):   0.30 × 0.30 × 0.50
rotation:            0°
material_primary:    cut-crystal jar with cast-bronze stand; fluid colour varies (past = warm amber; present = clear cyan; future = silver-pale)
material_secondary:  bronze stopper with engraved sigil
colour_value:        per-aspect (3 token families)
interaction:         inspectable
  - inspect: lore-note about that aspect's scrying-fluid (each canonically pre-Ark)
narrative_role:      ritual artifacts; their glow signals which aspect is active
lore_anchor:         loredex.system.scrying_aspects
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          slight patina on stoppers
physical_constraints: collides
```

#### A.18.9.10-12 Three Candle Arrays (one per alcove)

```
object_id:           ark.oracle_sanctum.candle_array.<alcove>  (3 arrays)
object_class:        interactive  (also fx_emitter)
positions:           per alcove base
dimensions (each):   0.20 × 0.30 × 0.30 (cluster of 3 candles per array)
rotation:            varies
material_primary:    cast bronze stand + 3 ivory wax candles
material_secondary:  none
colour_value:        --token-color-ark-oracle-sanctum-candle
interaction:         interactable
  - light_candle: lights candles (one-shot per cluster)
  - extinguish: extinguishes
  - inspect: lore-note about ritual-candle protocol
narrative_role:      ritual lighting; activates aspect alcove
lore_anchor:         loredex.system.scrying_rituals
art_status:          producer_handoff
gameplay_hook_id:    trpc.oracle_sanctum.candle.toggle
wear_state:          varies
physical_constraints: collides
```

#### A.18.9.13-15 Three Observation Benches (between alcoves)

```
object_id:           ark.oracle_sanctum.observation_bench.<n>  (3 benches at radius 3.50 m, between alcoves; positions at 60°, 180°, 300°)
object_class:        furniture
positions:           [
  (3.03, 1.75, 0.00),                # NE-arc
  (0.00, -3.50, 0.00),               # south
  (-3.03, 1.75, 0.00),               # NW-arc
]
dimensions (each):   1.00 × 0.40 × 0.45  (curved bench matching circular geometry)
rotation:            varies (radial; faces pool)
material_primary:    polished obsidian-black marble seat with gold-leaf trim
material_secondary:  bronze leg-supports
colour_value:        --token-color-ark-oracle-sanctum-bench
interaction:         interactable - sit
narrative_role:      contemplation seating; player can sit and watch pool ripples for extended periods
lore_anchor:         arc.oracle_contemplation
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          slight wear
physical_constraints: collides; sittable
```

#### A.18.9.16-18 Three Pilasters

Specced in walls. Inventoried for completeness.

```
object_id:           ark.oracle_sanctum.pilaster.<n>  (3 pilasters between alcoves)
object_class:        decoration
positions:           radial; between each alcove pair (at 60°, 180°, 300°)
dimensions (each):   0.24 × 0.24 × 4.20
rotation:            radial (faces inward)
material_primary:    cast bronze with gilt detail; fluted shaft
material_secondary:  bronze cap top; bronze base
colour_value:        --token-color-ark-oracle-sanctum-pilaster-bronze
interaction:         inert
narrative_role:      structural; reinforces sacred geometry
lore_anchor:         loredex.aesthetic.dreamers_oneiric
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          slight patina at base
physical_constraints: collides
```

#### A.18.9.19-21 Three Drapery Hangings

Specced in walls. Inventoried for completeness.

```
object_id:           ark.oracle_sanctum.drapery.<n>  (3 silver-mist drapes between pilasters)
object_class:        decoration
positions:           between pilaster pairs at z = 2.00 to 4.00
dimensions (each):   0.05 × 2.40 × 2.00
rotation:            varies
material_primary:    silver-mist gauze (semi-transparent; lightweight)
material_secondary:  bronze hanging-rod
colour_value:        --token-color-ark-oracle-sanctum-drapery-silver-mist
interaction:         inert (but flutters reactively)
narrative_role:      ethereal accent; suggests "veil between waking and vision"
lore_anchor:         loredex.aesthetic.dreamers_oneiric
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          slight fading at edges
physical_constraints: non-collide (suspended)
```

#### A.18.9.22-26 Closing Items + Atmosphere

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.oracle_sanctum.south.intercom` | console | (-1.00, -4.45, 1.50) | 0.20 × 0.10 × 0.30 | comms relay |
| `ark.oracle_sanctum.fire_extinguisher.south` | interactive | (1.00, -4.45, 1.20) | 0.20 × 0.20 × 0.50 | safety |
| `ark.oracle_sanctum.first_aid.kit.south` | container | (-2.00, -4.45, 1.50) | 0.40 × 0.10 × 0.30 | medical |
| `ark.oracle_sanctum.compass_inlay` | decoration | (0.00, 0.00, 0.005) | 1.40 × 1.40 × 0.005 | floor 3-pointed star inlay around pool |
| `ark.oracle_sanctum.dust_motes_emitter` | fx_emitter | distributed throughout volume | n/a | mystic-mote source |
| `ark.oracle_sanctum.pool_ripple_emitter` | fx_emitter | (0.00, 0.00, 0.00) | n/a | pool-surface ripple SFX + visual source |

Total: 26 inventory objects.

### A.18.10 Camera-spawn-points (FPV cutscenes)

```
cutscene_id:         cs_amb_oracle_sanctum  (Category B; deferred catalogue)
camera_position:     (0.00, -4.00, eye_level)  # at threshold
camera_facing:       (0°, 0°, 0°)  # facing pool
avatar_height_anchor: eye_level
head_motion:         very slow walk-forward toward pool; head turns slightly to scan alcoves; pause at pool's edge; lasts 22s

cutscene_id:         cs_first_scrying  (Act 5 one-shot Oracle-aligned)
camera_position:     (0.00, -1.50, eye_level)  # at pool edge, facing pool
camera_facing:       (0°, -45°, 0°)  # looking down into pool
avatar_height_anchor: eye_level
head_motion:         hand-rig enters frame; touches water surface; ripples form; vision begins (cuts to vision sequence)

cutscene_id:         cs_oracle_first_meeting  (Act 5 first encounter with Oracle)
camera_position:     (0.00, -2.50, eye_level)
camera_facing:       (0°, 0°, 0°)  # facing Oracle's chair
avatar_height_anchor: eye_level
head_motion:         seated bench; Oracle looks up from book; first eye-contact moment

cutscene_id:         cs_aspect_activation  (state-conditional during scrying)
camera_position:     (0.00, 0.00, eye_level)  # at pool centre
camera_facing:       (varies; turns to relevant aspect alcove)
avatar_height_anchor: eye_level
head_motion:         alcove glow intensifies; mystic-motes rush toward pool
```

### A.18.11 Doorways

```
door_id:            ark.oracle_sanctum.south.door.main
connecting_space_id: ark.corridor.oracle_approach
door_position:      (0.00, -4.50, 0.00)
door_dimensions:    1.20 × 2.40 × 0.10
door_class:         arch  (gold-inlaid bronze; ceremonial)
unlock_condition:   Act 5+ (Oracle-aligned)
transit_animation:  hush-open with falling-water SFX (3s) on first entry; instant subsequent
audio_signature:    bronze handle + soft water-drip + mystic-chime
```

### A.18.12 Adjacency map

```
direct_adjacencies:
  - ark.corridor.oracle_approach (south door)
one_hop_adjacencies:
  - ark.bridge (oracle prophecies feed into command via comms)
  - ark.observation_deck (cosmic kinship; Eidolon and Oracle are paired cosmic NPCs)
  - ark.oracles_sanctum_annual (one-hop; deeper annual oracle-question vote space §A.43)
state_shared_with:
  - ark.bridge (Oracle's prophecies appear on bridge tactical-display)
```

### A.18.13 Gameplay hooks

```
hooks:
  - hook_id:         oracle_sanctum.performScrying
    trigger:         player.interact on scrying_pool with aspect selected
    procedure:       trpc.oracle_sanctum.pool.scry
    success_state:   scrying_active = true; aspect-specific vision unlocks
  - hook_id:         oracle_sanctum.readScryingTome
    trigger:         player.inspect on scrying_lectern
    procedure:       trpc.oracle_sanctum.lectern.read
    success_state:   scrying_tome_read = true (multi-screen; gameplay-key)
  - hook_id:         oracle_sanctum.activateAspect
    trigger:         player.interact on alcove.<aspect>
    procedure:       trpc.oracle_sanctum.alcove.activate
    success_state:   active_aspect = <past|present|future>
  - hook_id:         oracle_sanctum.lightCandleArray
    trigger:         player.interact on candle_array.<alcove>
    procedure:       trpc.oracle_sanctum.candle.toggle
    success_state:   candle_state = lit | extinguished (per-array)
  - hook_id:         oracle_sanctum.takeOracleChair
    trigger:         player.sit on oracle_chair (when Oracle absent — rare)
    procedure:       trpc.oracle_sanctum.oracle_chair.sit
    success_state:   sat_in_oracle_chair = true (rare lore-flag)
  - hook_id:         oracle_sanctum.touchWater
    trigger:         player.interact (touch) on scrying_pool surface
    procedure:       trpc.oracle_sanctum.pool.touch
    success_state:   water_touched = true (subtle gameplay flag)
```

### A.18.14 Story-tie

```
primary_arcs:
  - arc.act_5_first_scrying
  - arc.oracle_arc (continuous Acts 5-7)
  - arc.oracle_prophecy_unlocks (per-scrying narrative reveals)
  - arc.act_6_oracle_personal_revelation (deep dialogue path)
per_act_evolution:
  acts_0_4: room locked + invisible
  act_5: room unlocks for Oracle-aligned players; first scrying ritual; Oracle first appears
  act_6: deeper aspect-scryings unlock; player can ask harder questions
  act_7: state-branched: prophecy-fulfilled ending (Oracle's prophecies came true; pool glows brightly) vs. prophecy-defied ending (player ignored visions; pool glows dim)
npc_roster:
  - the_oracle: primary occupant; presence Acts 5+
  - the_player: visitor / scryer
  - cosmic_resonance_voices: rare whispers (proto-language)
  - vision_echoes: gameplay-driven during scrying-results
readables:
  - principle plaque (south)
  - first-scrying relief (south)
  - scrying-tome (lectern; multi-screen)
  - 3 alcove sigils (per-aspect lore)
  - scrying-log display (south)
  - 3 scrying-fluid jar inscriptions (per-aspect)
master_of_rlyeh_question: n/a (Oracle-aligned cosmology; not Hellbox host)
```

### A.18.15 Special-FX

```
particle_systems:
  - mystic_motes (medium; continuous; rises toward oculus)
  - water_vapor (low; rises from pool surface)
  - candle_smoke (very low; per cluster)
  - aspect_activation_motes (state-conditional; intensifies when alcove activated)
volumetric_effects:
  - oculus_volumetric_glow (variable colour; matches aspect)
  - pool_underwater_volumetric_beam (cyan-amber cone from pool floor upward)
  - alcove_glow_per_aspect (subtle ambient glow per alcove)
  - drapery_subtle_volumetric_haze (between drapes)
procedural_animations:
  - pool_ripple_continuous (subtle; period 4-8s organic)
  - oracle_chair_subtle_sway (when Oracle present; her contemplation)
  - mystic_motes_drift (continuous slow upward)
  - candle_flicker_individual (3 sources)
  - drapery_subtle_ripple (faint air convection)
  - alcove_subtle_glow_breath (period 6s)
reactive_systems:
  - pool_intensify_on_proximity (within 1.5 m, pool_underwater_glow brightens 20%)
  - oculus_colour_shift_on_aspect_activation (matches active aspect)
  - alcove_glow_on_inspect (when player approaches alcove, glow brightens)
  - drapery_flutter_on_player_pass (drapes subtly stir as player walks past)
  - mystic_chime_on_scrying_initiated (one-shot)
  - vision_overlay_on_pool_during_scrying (state-conditional)
```

### A.18.16 Avatar-parametricity

```
camera_height_variation:
  small_xenomorph (0.85m eye): camera height 0.85m; pool feels enormous; Oracle's chair feels tall; alternate kneel-at-pool posture
  short_humanoid (1.40m eye): standard short scale
  average_humanoid (1.70m eye): standard
  tall_humanoid (2.05m eye): pool feels small from above; oculus closer
  tall_xenomorph (2.70m eye): pilasters at hip-level; alternate stand-back posture for scrying
reachability:
  small_xenomorph: cannot reach scrying-fluid jars (alcove niche at 1.50m); alternate elevator-stool provided
  small_xenomorph: cannot reach apsidal relief; relay-inspect from below
  others: all-reachable
audio_occlusion_variation:
  xenomorph_sensitive_hearing: water-trickle + Oracle's hum more pronounced; slightly overwhelming on first entry
  synthetic_voice_avatar: Oracle's presence has different "feel" (cosmic harmonic interpreted differently)
```

### A.18.17 Performance

```
polygon_budget:      220,000 polygons (compact circular room; rich decorative density + water shader)
texture_budget:      140 MB total (water + cosmic shaders are expensive)
light_count_limit:   14 simultaneous dynamic lights
lod_plan:
  - hero_distance: 0-6m, full detail (immediate alcove and pool)
  - mid_distance: 6-12m, mid detail (drapery as billboards; alcove items simplified)
  - low_distance: 12m+, low detail (mystic-motes culled)
streaming_behaviour:
  - preload: ark.corridor.oracle_approach (south door)
  - on_scrying_initiated: preload current vision-content assets
```

---

## A.19 Shadow Vault (Assassin Sanctum) — FULL

**Status: FULL spec.** Cross-ref `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.19 (art-state prompts).

### A.19.1 Header

```
space_id:        ark.shadow_vault
space_name:      Shadow Vault (Assassin Sanctum)
space_type:      ark_room  (faction-locked; hidden D8 sanctum)
act_introduced:  Act 5 (Assassin-aligned only)
lore_anchor:     loredex.faction.assassins + arc.shadow_arc + arc.act_5_first_contract + arc.act_6_shadow_token_quest
aesthetic_tier:  solar_punk_cathedral  (shadow-tactical; deeply dim; the Ark's darkest room — intentionally light-suppressed)
```

### A.19.2 Geometry

```
dimensions:           10.00 m × 12.00 m × 4.00 m
origin_point:         centre of floor at south entrance threshold (entrance is the south wall)
coordinate_axes:      +x = right, +y = forward (north), +z = up
floor_plan_geometry:  rectangular  (with 4 hidden alcoves recessed at corners)
volumetric_anomalies: dim-pocket effect — light decays faster than physics suggests (intentional aesthetic; ambient lighting falls off ~2× faster than expected); slight sound-suppression (RT60 = 0.18s — extremely dry)
```

The Shadow Vault is intentionally dark, intentionally quiet,
intentionally still. Central planning table dominates the room.
4 hidden alcoves at the corners are concealed behind sliding
panels — only revealed when the player has gathered shadow-tokens
(Act 6+ quest). East wall holds a 6-slot weapons rack of
mag-locked tools (knives, bows, garrotes). West wall holds a
4-cabinet sealed-contracts archive. North wall is sacred to the
Assassin faction: a single ritual blade on a pedestal beneath
the banner "WE ARE THE NIGHT BREATH."

Floor area: 120 m².

### A.19.3 Floor

```
material_primary:     matte-black slate (deliberately non-reflective; absorbs light); 0.60 m × 0.60 m tiles; 4 mm gap; subtle anti-slip etch in radial pattern
material_secondary:   bronze inlay outlining the planning-table zone (3.00 × 2.40 m); brass perimeter trim along walls (intentionally faint — barely visible in dim light)
pattern:              radial etch + central planning-zone marker
wear_state:           pristine in early acts; very subtle wear-trail to planning table; in late-act if many contracts completed, slight wear at weapons-rack approach
embedded_features:
  - id: ark.shadow_vault.floor.charge_point.planning_table
    position: (0.00, 6.00, 0.00)  # under planning table
    dimensions: 0.40 × 0.40 × 0.05
    function: planning-table electronics + holographic projection power
  - id: ark.shadow_vault.floor.hidden_alcove_threshold.<corner>  (4 thresholds; one per corner alcove)
    position: per corner (NE, NW, SE, SW)
    dimensions: 0.80 × 0.20 × 0.05 each
    function: alcove-reveal trigger anchor (responds to shadow-tokens)
  - id: ark.shadow_vault.floor.silent_drain.south
    position: (0.00, 1.00, 0.00)
    dimensions: 0.20 × 0.20 × 0.10
    function: ritual blood-drain (rare gameplay; for ceremonial post-contract cleansing)
acoustic_property:    soft_absorbent (extreme; sound-suppressed); RT60 = 0.18s (intentionally dry — every footstep, breath, blade-edge sounds isolated)
```

### A.19.4 Walls

#### Wall: South (entrance)

```
wall_id:              south
material_primary:     matte-charcoal painted steel panel; reinforced; matte finish absorbs light
material_secondary:   bronze dado at z = 1.10 m (heavily-patinated; nearly invisible in dim light)
panelisation:         standard; 6 panels wide × 3 tall; matte finish ensures no reflection
colour_value:         --token-color-ark-shadow-vault-wall-south  (matte charcoal; faint bronze accent at z = 2.00 m)
embedded_displays:
  - id: ark.shadow_vault.south.display.contract_status
    position: (-2.00, 0.20, 1.50)
    dimensions: 0.80 × 0.60 × 0.05
    content: live contract status (active assassinations + targets); minimalist OLED display with red-amber accents only
  - id: ark.shadow_vault.south.display.shadow_token_count
    position: (2.00, 0.20, 1.50)
    dimensions: 0.40 × 0.30 × 0.05
    content: small display of player's collected shadow-tokens (rare; gameplay-key for alcove unlocks)
embedded_doors:
  - door_id: ark.shadow_vault.south.door.main
    position: (0.00, 0.00, 0.00)
    dimensions: 1.20 × 2.40 × 0.10
    door_class: slide  (silent-glide; magnetic; opens with whisper of friction)
    connecting_space_id: ark.corridor.shadow_approach
    unlock_condition: Act 5+ (Assassin-aligned only); biometric + shadow-token authentication
decorative_features:
  - id: ark.shadow_vault.south.plaque.creed
    position: (0.00, 0.20, 3.20)
    dimensions: 0.80 × 0.30 × 0.02
    material: cast bronze with deep-etched text + heavy patina (intentionally aged)
    narrative_role: reads "STRIKE BETWEEN HEARTBEATS" — the Assassin-faction creed
```

#### Wall: East (weapons rack)

```
wall_id:              east
material_primary:     matte-charcoal painted steel; reinforced; sound-absorbent backing panels
material_secondary:   bronze dado (heavily-patinated); reinforced backplate behind weapons rack
panelisation:         standard
colour_value:         --token-color-ark-shadow-vault-wall-east  (matte charcoal)
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: ark.shadow_vault.east.weapons_rack
    position: (4.95, 6.00, 0.00)
    dimensions: 0.40 × 4.00 × 2.40
    material: matte-black reinforced steel rack with mag-locks; bronze trim (patinated); leather-bound grip-rests for each weapon
    narrative_role: weapons display; 6 slots: throwing-knife, garrote, recurve-bow, bolt-pistol, ceremonial-blade, poison-vial
  - id: ark.shadow_vault.east.warning_sign.weapon_zone
    position: (4.95, 1.50, 2.40)
    dimensions: 0.30 × 0.20 × 0.01
    material: black-on-blood-red painted steel
    narrative_role: cautionary; subtle reinforcement of the room's purpose
```

#### Wall: North (the Ritual Blade + banner)

```
wall_id:              north
material_primary:     full-wall matte-black painted steel (the darkest wall in the room; absorbs almost all light)
material_secondary:   bronze dado (extremely patinated); central recess for the ritual blade
panelisation:         3 panels: west (decorative), centre (blade recess + banner above), east (decorative)
colour_value:         --token-color-ark-shadow-vault-wall-north  (matte black with subtle bronze + crimson accents)
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: ark.shadow_vault.north.ritual_blade_recess
    position: (0.00, 11.95, 2.50)
    dimensions: 0.40 dia × 0.10 (recessed niche)
    material: matte-black with bronze rim; single carved-bronze ritual blade displayed inside
    narrative_role: THE blade; the Assassin-faction's most sacred artifact; canonical first-blade carried into 9 historical contracts
  - id: ark.shadow_vault.north.banner_above_blade
    position: (0.00, 11.85, 3.50)
    dimensions: 1.00 × 0.05 × 0.80
    material: deep crimson velvet with silver-thread embroidery (silver, not gold — Assassin-faction signal)
    narrative_role: reads "WE ARE THE NIGHT BREATH" — Assassin-faction motto
  - id: ark.shadow_vault.north.relief.invisible
    position: (0.00, 11.85, 4.00)
    dimensions: 1.40 × 0.40 × 0.10
    material: cast bronze; depicts a figure stepping into shadow (almost invisible; only revealed by careful inspection)
    narrative_role: subtle reinforcement; player who inspects discovers Assassin-faction's deeper philosophy
```

#### Wall: West (contract archive cabinets)

```
wall_id:              west
material_primary:     matte-charcoal painted steel; reinforced
material_secondary:   bronze dado (patinated); biometric-lock plates per cabinet
panelisation:         4-cabinet vertical stack
colour_value:         --token-color-ark-shadow-vault-wall-west
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: ark.shadow_vault.west.contract_archive_cabinet.<n>  (4 cabinets stacked vertically at z = 0, 1, 2, 3)
    position: (-4.95, 6.00, varies)
    dimensions: 0.40 × 3.00 × 1.00 each (4 stacked = 4.00 m tall)
    material: matte-black reinforced steel with biometric-lock plate; each holds active sealed contracts
    narrative_role: contract archive; gameplay-key for assassin missions; each cabinet covers a different contract category (active / completed / unfulfilled / blacklisted)
  - id: ark.shadow_vault.west.painting.first_assassin
    position: (-4.95, 1.50, 2.40)
    dimensions: 0.40 × 0.50 × 0.04
    material: oil portrait of the first canonical Assassin (silhouette only; face shadowed)
    narrative_role: lineage acknowledgment
```

### A.19.5 Ceiling

```
height_above_floor:     4.00 m baseline; intentional low-coffer at 3.40 m above central planning table (gives intimacy + dramatic lighting falloff)
material:               matte-black painted plaster with bronze rib detail (heavily patinated); central coffer is a dim translucent panel
lighting_integrated:    minimal — single central pendant over planning table; weapon-rack strip-light along east; contract-archive strip-light along west; blade-uplight; intentionally NO general ambient lighting
atmospheric_features:   subtle sub-perceptual shadow-motes drift (cosmetic; reinforces shadow-aesthetic)
acoustic_treatment:     extreme baffling (acoustic dampening; the room is sound-suppressed)
```

### A.19.6 Lighting

```
ambient_baseline:     1800 K (extremely warm; candle-tone equivalent); 30 lux at floor level (DELIBERATELY VERY DIM — 1/10 of typical Ark room); CRI 70 (low; matches shadow-aesthetic)
direct_fixtures:
  - id: ark.shadow_vault.light.central_pendant
    position: (0.00, 6.00, 3.40)
    beam_angle: 90° downward (tight)
    colour: --token-color-ark-shadow-vault-pendant  (warm amber-bronze; intentionally low temp)
    intensity: 800 lumens (intentionally low — single isolated bulb)
    function: principal task lighting at planning table; everything else falls into darkness
  - id: ark.shadow_vault.light.weapon_rack_strip.east
    position: along weapons rack at z = 2.50
    beam_angle: 90° downward
    colour: --token-color-ark-shadow-vault-weapon-strip  (warm amber)
    intensity: 200 lumens per metre (silhouettes weapons in dim glow without revealing detail)
    function: weapon-rack accent (deliberately dim)
  - id: ark.shadow_vault.light.contract_archive_strip.west
    position: along contract cabinets at z = 4.00
    beam_angle: 90° downward
    colour: 1800 K very warm
    intensity: 200 lumens per metre
    function: archive accent (matches weapon-rack dim level)
  - id: ark.shadow_vault.light.blade_uplight.north
    position: (0.00, 11.95, 0.05)
    beam_angle: 30° upward
    colour: --token-color-ark-shadow-vault-blade-uplight  (warm bronze; symbolic)
    intensity: 400 lumens
    function: dramatic blade illumination; the only "warm" point in the room
practical_sources:
  - id: ark.shadow_vault.hidden_alcove_glow.<corner>  (4 emitters; only active when alcoves revealed)
    position: per revealed alcove
    intensity: 30 lumens each (very subtle; only revealed alcoves emit)
    flicker_pattern: stable
  - id: ark.shadow_vault.pendulum_clock_glow
    position: on planning table
    intensity: 20 lumens (very subtle; clock face glows)
    flicker_pattern: stable
time_of_day_variation:
  acts_5_to_7: stable extremely-dim baseline; in late-act7, if player has been a "shadow-master" (many contracts completed), pendant intensifies slightly; if light-aligned ending, room becomes even darker (eerie cold)
dynamic_response:
  - on_player_at_planning_table: pendant pulses subtly with player heartbeat (deeply intimate)
  - on_alcove_reveal: that alcove's hidden_alcove_glow activates (one-shot)
  - on_blade_inspection: blade_uplight intensifies briefly
  - on_contract_completion: brief silver-mist drift from west cabinets toward planning table (cosmetic)
```

### A.19.7 Atmosphere

```
air_temperature:    17°C (cool — sound-suppressed; air feels "still")
humidity:           38% RH (low; weapon-friendly); smells of bronze + leather (grip-rests + boot-tread) + faint metallic-blood (canonical post-contract residue) + cold-iron + old-paper (contracts)
particulate:
  - type: dust
    density: very low (security maintenance; the Vault is meticulously clean)
    colour: matte-grey
    drift_direction: random; very slow
  - type: shadow_motes
    density: very low (sub-perceptual; cosmetic; suggests "presence in absence")
    colour: faintly-darker-than-ambient
    drift_direction: slow
volumetric_fog:     absent in baseline; subtle silver-mist drift from west cabinets during contract events
wind_drift:         minimal; 0.01 m/s (HVAC pattern is suppressed; air feels "stilled")
smell_canon:        bronze + leather + blood + cold-iron + paper; voice-line: "smells like patience"
```

### A.19.8 Sound

```
ambient_bed:           file: shadow_vault_ambient_bed_v1.ogg (loop); -42 dB (extremely quiet; the room is sound-suppressed); faint distant heartbeat (NOT player's — someone ELSE'S; uncanny), occasional knife-edge whisper, very faint clock-tick
point_sources:
  - id: ark.shadow_vault.sound.distant_heartbeat
    position: dynamic (random — often from corner alcoves)
    sound: faint heartbeat; -44 dB; period 0.9-1.1s
    occlusion_behaviour: omnidirectional; pseudo-random source
    trigger: continuous (uncanny — never-located; hints at "presences")
  - id: ark.shadow_vault.sound.blade_subtle_resonance
    position: (0.00, 11.95, 2.50)
    sound: faint metallic resonance from ritual blade (-42 dB; continuous; almost sub-perceptual)
    occlusion_behaviour: omnidirectional
    trigger: continuous
  - id: ark.shadow_vault.sound.pendulum_clock_tick
    position: on planning table
    sound: pendulum tick (period 1s; -38 dB)
    occlusion_behaviour: standard
    trigger: continuous
  - id: ark.shadow_vault.sound.contract_seal_creak
    position: distributed at west cabinets
    sound: occasional contract-seal creak (random; -40 dB)
    occlusion_behaviour: standard
    trigger: random (period 60-120s)
  - id: ark.shadow_vault.sound.knife_edge_whisper
    position: dynamic (random near weapons rack)
    sound: faint blade-edge whisper (random; -42 dB)
    occlusion_behaviour: standard
    trigger: random (period 30-90s)
  - id: ark.shadow_vault.sound.shadow_master_breath
    position: (0.00, 7.50, 1.40)
    sound: very faint slow breath (-44 dB; only when Shadow Master present)
    occlusion_behaviour: omnidirectional with subtle directional bias
    trigger: state-conditional
reverb_zone:           IR-impulse: shadow_vault_v1.wav; wet-mix 8% (extremely dry; sound-suppressed)
music_eligibility:     cutscene only (Assassin-arc cutscenes; deferred catalogue)
voice_line_eligibility:
  - speaker: the_shadow_master: presence (Acts 5+ Assassin-aligned); line set §2.19.2
  - speaker: contract_whispers: state-conditional during planning (proto-language; subtitled)
  - speaker: distant_heartbeat: ambient atmosphere only (no spoken voice)
```

### A.19.9 Object inventory

Shadow Vault has 28 inventory objects.

#### A.19.9.1 The Central Planning Table

```
object_id:           ark.shadow_vault.planning_table
object_class:        interactive  (also display)
position:            (0.00, 6.00, 0.00)
dimensions:          1.80 × 1.20 × 0.85
rotation:            0°
material_primary:    matte-black reinforced steel top with leather-bound edges; sound-suppressed material
material_secondary:  bronze corner caps with engraved Assassin sigils; pendant-light reflector panel (matte) above
colour_value:        --token-color-ark-shadow-vault-planning-table
interaction:         interactable
  - operate: opens contract-planning UI; player plans assassinations + reviews targets
  - inspect: lore-note about the table's history (canonical pre-Ark; carved from a single block of dark stone)
narrative_role:      THE central planning surface; primary Assassin-faction gameplay-launcher
lore_anchor:         loredex.faction.assassins + arc.shadow_arc
art_status:          producer_handoff
gameplay_hook_id:    trpc.shadow_vault.planning_table.operate
wear_state:          worn at most-touched corner (slightly bronze-toned wear);
physical_constraints: collides; player can lean
```

#### A.19.9.2 The Shadow Master's Chair

```
object_id:           ark.shadow_vault.shadow_master_chair
object_class:        furniture  (also npc_anchor)
position:            (0.00, 7.50, 0.00)
dimensions:          0.90 × 0.90 × 1.50
rotation:            180°  (faces south; Shadow Master watches client + door)
material_primary:    matte-black hardwood frame with deep-charcoal leather upholstery
material_secondary:  bronze armrests (heavily patinated); bronze nameplate "THE SHADOW MASTER" (almost invisible in dim light)
colour_value:        --token-color-ark-shadow-vault-shadow-master-chair
interaction:         interactable - sit (when Shadow Master absent — extremely rare)
narrative_role:      THE Shadow Master's chair; permanent physical anchor; he's almost always present
lore_anchor:         loredex.character.the_shadow_master
art_status:          producer_handoff
gameplay_hook_id:    trpc.shadow_vault.shadow_master_chair.sit
wear_state:          worn at right armrest (Shadow Master is right-handed); cushion permanently indented
physical_constraints: collides; sittable
```

#### A.19.9.3-4 Two Visitor Chairs (flanking planning table; client seats)

```
object_id:           ark.shadow_vault.visitor_chair.east, .west
object_class:        furniture
positions:           (1.20, 6.00, 0.00), (-1.20, 6.00, 0.00)
dimensions (each):   0.80 × 0.80 × 1.20
rotation (each):     varies (faces table)
material_primary:    matte-black hardwood frame with charcoal leather seat
material_secondary:  bronze tacks (almost invisible)
colour_value:        --token-color-ark-shadow-vault-visitor-chair
interaction:         interactable - sit
narrative_role:      where clients sit; player negotiates contracts here
lore_anchor:         arc.shadow_arc
art_status:          producer_handoff
gameplay_hook_id:    none (positional)
wear_state:          slight wear
physical_constraints: collides; sittable
```

#### A.19.9.5 The East Weapons Rack

```
object_id:           ark.shadow_vault.east.weapons_rack
object_class:        container
position:            (4.95, 6.00, 0.00)
dimensions:          0.40 × 4.00 × 2.40
rotation:            270°  (parallel to east wall)
material_primary:    matte-black reinforced steel rack with mag-locks
material_secondary:  bronze trim (patinated); leather-bound grip-rests per slot; bronze nameplates per slot
colour_value:        --token-color-ark-shadow-vault-weapons-rack
interaction:         interactable
  - take_weapon: 6 weapon slots — throwing-knife, garrote, recurve-bow, bolt-pistol, ceremonial-blade, poison-vial
  - inspect_weapon: per-weapon lore (each has named history)
narrative_role:      Assassin-faction weapon arsenal; gameplay-key for contracts
lore_anchor:         loredex.system.assassin_weapons + arc.shadow_arc
art_status:          producer_handoff
gameplay_hook_id:    trpc.shadow_vault.weapons_rack.take + .inspect
wear_state:          worn at most-used slots (varies per playstyle); ceremonial-blade slot slightly more polished
physical_constraints: collides
```

#### A.19.9.6-9 Four Contract Archive Cabinets (west wall stacked)

```
object_id:           ark.shadow_vault.west.contract_archive_cabinet.<n>  (4 cabinets stacked vertically; categorised: active, completed, unfulfilled, blacklisted)
positions:           [
  (-4.95, 6.00, 0.00),  # bottom — active contracts
  (-4.95, 6.00, 1.00),  # middle-low — completed
  (-4.95, 6.00, 2.00),  # middle-high — unfulfilled
  (-4.95, 6.00, 3.00),  # top — blacklisted (rare; sealed)
]
dimensions (each):   0.40 × 3.00 × 1.00
rotation:            90°
material_primary:    matte-black reinforced steel with biometric-lock plate
material_secondary:  bronze handle (patinated); bronze nameplate per cabinet
colour_value:        --token-color-ark-shadow-vault-archive-cabinet
interaction:         interactable
  - open: contains sealed contracts (per-cabinet category)
  - inspect: lore-note per cabinet
narrative_role:      contract archive; gameplay-key for mission lookup + lore
lore_anchor:         loredex.system.assassin_contracts
art_status:          producer_handoff
gameplay_hook_id:    trpc.shadow_vault.archive_cabinet.open
wear_state:          slight wear at active cabinet handle (most-used); top blacklisted cabinet pristine (rarely opened)
physical_constraints: collides
```

#### A.19.9.10 The Ritual Blade

Specced in walls A.19.4. Inventoried for completeness.

```
object_id:           ark.shadow_vault.ritual_blade
object_class:        decoration  (also fx_emitter — subtle resonance)
position:            (0.00, 11.95, 2.55)  # within recess; 0.05 m forward of wall
dimensions:          0.05 × 0.05 × 0.60 (blade)
rotation:            0°  (vertical)
material_primary:    carved bronze blade with subtle metallic engraving
material_secondary:  bronze stand (0.40 dia × 0.10 height); base of recess
colour_value:        --token-color-ark-shadow-vault-ritual-blade  (deep bronze with silver edge-glint)
interaction:         inspectable
  - inspect: opens multi-screen lore about the blade's 9 historical contracts
narrative_role:      THE sacred artifact; cannot be taken; symbolic anchor of Assassin-faction
lore_anchor:         loredex.faction.assassins + arc.shadow_origin_myth
art_status:          producer_handoff
gameplay_hook_id:    trpc.shadow_vault.ritual_blade.inspect
wear_state:          well-aged; centuries of handling visible at grip; edge still razor-sharp
physical_constraints: non-collide (recessed; cannot interact except inspect)
```

#### A.19.9.11-14 Four Hidden Alcoves (concealed at corners)

```
object_id:           ark.shadow_vault.hidden_alcove.<corner>  (4 alcoves: NE, NW, SE, SW)
object_class:        container
positions:           [
  (4.50, 11.50, 0.00),    # NE
  (-4.50, 11.50, 0.00),   # NW
  (4.50, 0.50, 0.00),     # SE
  (-4.50, 0.50, 0.00),    # SW
]
dimensions (each):   0.80 × 0.80 × 2.40 (alcove recess)
rotation:            varies (radial; faces inward toward planning table)
material_primary:    matte-black sliding-panel (concealed in baseline); reveals matte-charcoal alcove with shadow-aesthetic specialised tools
material_secondary:  bronze trim around revealed alcove edge
colour_value:        --token-color-ark-shadow-vault-hidden-alcove
interaction:         interactable (only when revealed by shadow-tokens)
  - reveal: requires shadow-token (1 per alcove); slides panel aside; one-shot per alcove
  - take_tool: each alcove holds specialised gear (NE = poison kit; NW = lockpick set; SE = climb gear; SW = escape rope)
  - inspect: lore-note
narrative_role:      hidden specialised-tools; gameplay-key for advanced contracts
lore_anchor:         loredex.system.assassin_specialised_tools + arc.act_6_shadow_token_quest
art_status:          producer_handoff
gameplay_hook_id:    trpc.shadow_vault.hidden_alcove.reveal + .take_tool
wear_state:          pristine until revealed
physical_constraints: collides only when revealed
```

#### A.19.9.15 The Pendulum Clock (on planning table)

```
object_id:           ark.shadow_vault.pendulum_clock
object_class:        decoration  (also fx_emitter — clock-tick sound + subtle glow)
position:            (-0.80, 6.00, 0.85)  # on planning table corner
dimensions:          0.20 × 0.20 × 0.30
rotation:            0°
material_primary:    matte-black bronze case with polished pendulum
material_secondary:  silver clock face (very subtle; almost invisible)
colour_value:        --token-color-ark-shadow-vault-clock
interaction:         inspectable
narrative_role:      ticking adds room-rhythm; the clock is canonically frozen at midnight (00:00) but mysteriously ticks anyway (matches Captain's mantle clock at 03:47 — both are temporal anchors)
lore_anchor:         loredex.aesthetic.temporal_anchors
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          well-aged; bronze patinated
physical_constraints: collides
```

#### A.19.9.16-19 Atmospheric + Decorative Items

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.shadow_vault.weapon_oil_kit` | decoration | (4.50, 4.00, 0.00) on small ledge | 0.30 × 0.20 × 0.10 | weapon-maintenance kit |
| `ark.shadow_vault.contract_seal_box` | container | on planning table | 0.20 × 0.15 × 0.08 | bronze box with sealing wax + Assassin sigil press |
| `ark.shadow_vault.tea_service_minimal` | decoration | (1.50, 7.50, 0.85) on table | 0.20 × 0.20 × 0.15 | minimal silver tea service (Shadow Master's quiet ritual) |
| `ark.shadow_vault.silent_bell` | decoration | (-1.50, 7.50, 0.85) on table | 0.10 × 0.10 × 0.15 | silent bell (rung soundlessly to summon Shadow Master) |

#### A.19.9.20-23 Closing Items + Atmosphere

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.shadow_vault.south.intercom` | console | (-1.50, 0.20, 1.50) | 0.20 × 0.10 × 0.30 | comms relay (silent in baseline) |
| `ark.shadow_vault.fire_extinguisher.south` | interactive | (1.50, 0.20, 1.20) | 0.20 × 0.20 × 0.50 | safety (matte-black housing) |
| `ark.shadow_vault.first_aid.kit.south` | container | (-2.50, 0.20, 1.50) | 0.40 × 0.10 × 0.30 | medical |
| `ark.shadow_vault.silent_drain_grate` | decoration | (0.00, 1.00, 0.005) | 0.20 × 0.20 × 0.005 | bronze grate over silent drain |

#### A.19.9.24-28 Dim-State Decorative

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.shadow_vault.south.plaque.creed` (rolled walls) | decoration | (0.00, 0.20, 3.20) | 0.80 × 0.30 × 0.02 | "STRIKE BETWEEN HEARTBEATS" |
| `ark.shadow_vault.banner_above_blade` (rolled walls) | decoration | (0.00, 11.85, 3.50) | 1.00 × 0.05 × 0.80 | "WE ARE THE NIGHT BREATH" |
| `ark.shadow_vault.compass_inlay.dim` | decoration | (0.00, 6.00, 0.005) | 1.40 × 1.40 × 0.005 | nearly-invisible floor compass-rose under planning table |
| `ark.shadow_vault.shadow_motes_emitter` | fx_emitter | distributed | n/a | sub-perceptual shadow-motes source |
| `ark.shadow_vault.distant_heartbeat_emitter` | fx_emitter | dynamic (random near corners) | n/a | uncanny distant-heartbeat source |

Total: 28 inventory objects.

### A.19.10 Camera-spawn-points (FPV cutscenes)

```
cutscene_id:         cs_amb_shadow_vault  (Category B; deferred catalogue)
camera_position:     (0.00, 0.50, eye_level)  # at threshold
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         very slow walk into dim; eyes adjust (vignette opens slowly); head turns to scan (left ⇒ right); pause; camera locks on ritual blade in apsidal recess; lasts 22s

cutscene_id:         cs_first_contract  (Act 5 one-shot Assassin-aligned)
camera_position:     (0.00, 5.00, eye_level)  # at planning table, facing Shadow Master
camera_facing:       (0°, -10°, 0°)
avatar_height_anchor: eye_level
head_motion:         seated at visitor chair; Shadow Master across from player; first contract briefing
notes:               Shadow Master's face is partially in shadow (cinematic); his hands gesture briefly before grasping table edge

cutscene_id:         cs_alcove_reveal  (Act 6 first-time per alcove)
camera_position:     (varies; at revealed alcove)
camera_facing:       (radial)
avatar_height_anchor: eye_level
head_motion:         hand-rig presents shadow-token; alcove panel slides aside silently; specialised gear revealed within
```

### A.19.11 Doorways

```
door_id:            ark.shadow_vault.south.door.main
connecting_space_id: ark.corridor.shadow_approach
door_position:      (0.00, 0.00, 0.00)
door_dimensions:    1.20 × 2.40 × 0.10
door_class:         slide  (silent-glide; magnetic)
unlock_condition:   Act 5+ (Assassin-aligned only); biometric + shadow-token authentication
transit_animation:  silent-slide (1.5s; almost no audible cue)
audio_signature:    near-silent magnetic-disengage + soft friction-whisper; absent of typical door sounds
```

### A.19.12 Adjacency map

```
direct_adjacencies:
  - ark.corridor.shadow_approach (south door)
one_hop_adjacencies:
  - ark.archives (via long-route corridor; rare assassin-research)
  - ark.shadow_vault.contract_dispatch (sub-space; deferred — where contracts are physically dispatched to operatives)
state_shared_with:
  - ark.archives (high-level historical contracts cross-reference)
  - ark.bridge (rare contract-feedback to command, only for high-stakes targets)
```

### A.19.13 Gameplay hooks

```
hooks:
  - hook_id:         shadow_vault.planContract
    trigger:         player.operate on planning_table
    procedure:       trpc.shadow_vault.planning_table.operate
    success_state:   contract_planning_active = true
  - hook_id:         shadow_vault.takeWeaponFromRack
    trigger:         player.take on weapons_rack with selected weapon
    procedure:       trpc.shadow_vault.weapons_rack.take
    success_state:   weapon_equipped = true (per-weapon)
  - hook_id:         shadow_vault.openContractCabinet
    trigger:         player.open on contract_archive_cabinet.<n>
    procedure:       trpc.shadow_vault.archive_cabinet.open
    success_state:   archive_cabinet_open = true (per-cabinet)
  - hook_id:         shadow_vault.revealHiddenAlcove
    trigger:         (state-conditional) player.interact on hidden_alcove.<corner> with shadow_token
    procedure:       trpc.shadow_vault.hidden_alcove.reveal
    success_state:   alcove_revealed = true (per-alcove; one-shot)
  - hook_id:         shadow_vault.takeToolFromAlcove
    trigger:         player.take on hidden_alcove.<corner>.tool
    procedure:       trpc.shadow_vault.hidden_alcove.take_tool
    success_state:   tool_equipped = true
  - hook_id:         shadow_vault.inspectRitualBlade
    trigger:         player.inspect on ritual_blade
    procedure:       trpc.shadow_vault.ritual_blade.inspect
    success_state:   ritual_blade_read = true (multi-screen lore)
  - hook_id:         shadow_vault.inspectFirstAssassin
    trigger:         player.inspect on west.painting.first_assassin
    procedure:       trpc.shadow_vault.first_assassin.read
    success_state:   first_assassin_lore_read = true
  - hook_id:         shadow_vault.takeShadowMasterChair
    trigger:         player.sit on shadow_master_chair (rare; Shadow Master absent)
    procedure:       trpc.shadow_vault.shadow_master_chair.sit
    success_state:   sat_in_shadow_master_chair = true (rare lore-flag)
```

### A.19.14 Story-tie

```
primary_arcs:
  - arc.act_5_first_contract
  - arc.shadow_arc (continuous Acts 5-7)
  - arc.assassin_faction_progression
  - arc.act_6_shadow_token_quest (4 tokens scattered across Ark; required for hidden alcoves)
  - arc.shadow_origin_myth (ritual blade lore)
per_act_evolution:
  acts_0_4: room locked + invisible (door is concealed; only Assassin-aligned players can find it)
  act_5: room unlocks for Assassin-aligned players; first contract; Shadow Master first appears
  act_6: hidden alcoves revealable with shadow-tokens (gathered through faction-quest)
  act_7: state-branched: shadow-master ending (room is well-tended; subtle warmth) vs. light-aligned ending (room is even darker; Shadow Master absent)
npc_roster:
  - the_shadow_master: primary occupant; presence Acts 5+
  - the_player: visitor / contract-taker
  - rare_contract_clients: scripted events (high-stakes targets bring clients)
  - the_distant_heartbeat: presence-only (uncanny; never identified)
readables:
  - creed plaque (south)
  - "WE ARE THE NIGHT BREATH" banner (north)
  - ritual blade lore (multi-screen; 9 historical contracts)
  - 4 contract archive cabinets (per-category multi-readables)
  - first-assassin painting (west)
  - invisible-relief (north; subtle reinforcement of philosophy)
master_of_rlyeh_question: n/a (Assassin-aligned cosmology; not Hellbox host)
```

### A.19.15 Special-FX

```
particle_systems:
  - dust (very low; Vault is meticulously clean)
  - shadow_motes (very low; sub-perceptual; cosmetic)
  - contract_silver_mist (state-conditional; when contract event happens)
  - alcove_reveal_dust (one-shot per alcove; brief dust-burst as panel slides)
volumetric_effects:
  - pendant_isolated_beam (single warm cone above planning table; sharp falloff)
  - weapon_silhouette_envelope (along east rack; subtle dim glow)
  - blade_uplight_envelope (warm bronze cone at north blade)
  - contract_archive_strip_envelope (along west cabinets; subtle warm wash)
procedural_animations:
  - pendulum_clock_tick_subtle (subtle visual + audio)
  - blade_subtle_resonance_visualisation (very faint vibration; cosmetic)
  - banner_subtle_ripple (faint air-flow)
  - shadow_motes_drift_continuous (sub-perceptual)
  - distant_heartbeat_pulse (uncanny; pseudo-random source)
reactive_systems:
  - ambient_dim_on_entry (eyes adjust over 3s; vignette opens; reinforces "the room is dark")
  - weapon_glow_on_proximity (within 1.0 m, weapon silhouette intensifies 30%)
  - alcove_reveal_one_shot (shadow-token state-conditional)
  - blade_intensify_on_inspection
  - shadow_master_response_on_player_proximity (presence-conditional; subtle breath-amplification)
  - contract_silver_mist_on_completion (cosmetic one-shot per major contract)
```

### A.19.16 Avatar-parametricity

```
camera_height_variation:
  small_xenomorph (0.85m eye): camera height 0.85m; planning table at chest-level; alternate stand-on-step animation; ritual blade feels enormous overhead
  short_humanoid (1.40m eye): standard short scale
  average_humanoid (1.70m eye): standard
  tall_humanoid (2.05m eye): pendant at near-head level; intentional physical compression matches mood
  tall_xenomorph (2.70m eye): pendant collides; alternate route around table
reachability:
  small_xenomorph: cannot reach top weapons rack (top 2 slots — recurve-bow, ceremonial-blade); alternate stool provided in concealed alcove
  small_xenomorph: cannot reach upper contract archive cabinets without ladder; alternate
  small_xenomorph: cannot reach blade recess (2.55m); relay-inspect from below
  others: all-reachable
audio_occlusion_variation:
  xenomorph_sensitive_hearing: distant heartbeat MORE pronounced (deeply uncanny); blade resonance audible from anywhere
  synthetic_voice_avatar: Shadow Master's presence has different "feel" (his breath has organic warmth that feels alien)
```

### A.19.17 Performance

```
polygon_budget:      180,000 polygons (intentionally minimal — supports the dim aesthetic; many surfaces are matte-black absorbers)
texture_budget:      100 MB total
light_count_limit:   8 simultaneous dynamic lights (DELIBERATELY VERY LOW; every light is "considered")
lod_plan:
  - hero_distance: 0-6m, full detail (immediate planning table + nearby weapons)
  - mid_distance: 6-12m, mid detail (cabinets simplified; alcoves reduced to billboards)
  - low_distance: 12m+, low detail (most decorative items culled)
streaming_behaviour:
  - preload: ark.corridor.shadow_approach (south door)
  - on_alcove_revealed: preload alcove-specific tool assets
  - on_contract_planning: preload current contract assets (target dossier, location terrain)
```

---

## A.20 War Room (Strategist Sanctum) — FULL

**Status: FULL spec.** Cross-ref `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.20 (art-state prompts).

### A.20.1 Header

```
space_id:        ark.war_room
space_name:      War Room (Strategist Sanctum)
space_type:      ark_room  (D8 sanctum)
act_introduced:  Act 4
lore_anchor:     loredex.system.alliance_war + loredex.faction.strategists + arc.faction_war + arc.act_4_first_strategy_session
aesthetic_tier:  solar_punk_cathedral  (strategic-grit; tactical-formal; the most formal command space outside the Bridge)
```

### A.20.2 Geometry

```
dimensions:           14.00 m × 14.00 m × 4.50 m
origin_point:         centre of floor at south entrance threshold
coordinate_axes:      +x = right, +y = forward (north), +z = up
floor_plan_geometry:  rectangular
volumetric_anomalies: none
```

The War Room is square, formal, dominated by a vast central
strategic holo-map (5.00 × 4.00 m footprint) that displays the
entire galactic alliance theatre as a 3D projection. Wall-mounted
faction-standing displays line east and west walls (6 displays
per side, one per major faction in each alliance). Long briefing
table on south side seats 8 strategists; chief strategist's chair
at the south end faces north toward the holo-map. North wall
holds the grand alliance-war central display + historical war
relief.

Floor area: 196 m².

### A.20.3 Floor

```
material_primary:     industrial gunmetal-grey steel deck plate (heavy-duty); 1.20 m × 1.20 m tiles; 4 mm gap; reinforced anti-static coating
material_secondary:   bronze inlay outlining the central holo-map zone (5.00 × 4.00 m); brass perimeter trim; brass walkway-strip from entrance through to holo-map
pattern:              tactical-grid etch + central holo-map marker; subtle radial echo from entrance to holo-map suggesting "all paths lead to command"
wear_state:           pristine in early acts; in late-act if multiple alliance-wars fought, slight wear-trail to holo-map approach + chief strategist chair; in Act 7 if alliance is in collapse, fluid-stains around briefing table
embedded_features:
  - id: ark.war_room.floor.charge_point.holo_map
    position: (0.00, 7.00, 0.00)  # under holo-map centre
    dimensions: 0.60 × 0.60 × 0.05
    function: holo-map projection power + battle-data feeds
  - id: ark.war_room.floor.charge_point.briefing_table
    position: (0.00, 1.50, 0.00)
    dimensions: 0.40 × 0.40 × 0.05
    function: briefing-table electronics
  - id: ark.war_room.floor.alert_anchor.<corner>  (4 corner anchors)
    position: per corner of room
    dimensions: 0.20 × 0.20 × 0.05 each
    function: alert-strobe + alarm-system electronics
  - id: ark.war_room.floor.emergency_lockdown_seal
    position: (0.00, 0.50, 0.00)  # at south entrance
    dimensions: 1.40 × 0.20 × 0.10
    function: emergency-lockdown bulkhead deploys here in critical states
acoustic_property:    hard_reflective (steel) with directional baffling toward holo-map; RT60 = 0.55s (intentional; supports tactical voice clarity at briefing)
```

### A.20.4 Walls

#### Wall: South (entrance + briefing zone)

```
wall_id:              south
material_primary:     painted steel panel with rivet-detail; matte gunmetal-grey; reinforced
material_secondary:   bronze dado at z = 1.10 m
panelisation:         standard; 9 panels wide × 3 tall
colour_value:         --token-color-ark-war-room-wall-south  (gunmetal-grey + tactical-amber pin-stripe at z = 2.00 m)
embedded_displays:
  - id: ark.war_room.south.display.alliance_status
    position: (-3.00, 0.20, 1.80)
    dimensions: 1.20 × 0.80 × 0.05
    content: current alliance-war status (cross-ref ark.defense_command_center)
  - id: ark.war_room.south.display.briefing_schedule
    position: (3.00, 0.20, 1.80)
    dimensions: 1.20 × 0.80 × 0.05
    content: scheduled strategy sessions + attendees
embedded_doors:
  - door_id: ark.war_room.south.door.main
    position: (0.00, 0.00, 0.00)
    dimensions: 1.60 × 2.40 × 0.10
    door_class: pressure_seal  (security; biometric authentication; war-room-grade)
    connecting_space_id: ark.corridor.war_room_approach
    unlock_condition: Act 4+
decorative_features:
  - id: ark.war_room.south.plaque.creed
    position: (0.00, 0.20, 3.20)
    dimensions: 1.20 × 0.40 × 0.02
    material: cast bronze with deep-etched text + heavy patina
    narrative_role: reads "WAR DEMANDS PATIENCE / PEACE DEMANDS WAR" — the Strategist-faction creed
  - id: ark.war_room.south.warning_sign.classified
    position: (5.00, 0.20, 3.50)
    dimensions: 0.40 × 0.30 × 0.01
    material: yellow-and-black painted steel
    narrative_role: classified-room warning; reinforces formality
```

#### Wall: East (6 faction-standing displays + tactical wall-display)

```
wall_id:              east
material_primary:     painted steel; reinforced; some rust patina at lower corners (lived-in feel)
material_secondary:   bronze dado
panelisation:         standard
colour_value:         --token-color-ark-war-room-wall-east  (gunmetal with subtle alliance-amber pin-stripe)
embedded_displays:
  - id: ark.war_room.east.faction_standing.<n>  (6 displays at y = 2.0, 3.5, 5.0, 6.5, 8.0, 9.5)
    position: along east wall
    dimensions: 1.00 × 0.60 × 0.05 each
    content: per-faction status (one per major faction in player's alliance)
  - id: ark.war_room.east.alliance_bracket_display
    position: (6.95, 11.50, 1.80)
    dimensions: 1.40 × 0.80 × 0.05
    content: alliance bracket showing current war structure
  - id: ark.war_room.east.tactical_wall_display
    position: (6.95, 7.00, 2.50)
    dimensions: 2.40 × 1.60 × 0.05
    content: deep-tactical analysis (terrain + threat-projections from holo-map)
embedded_doors:        none
decorative_features:
  - id: ark.war_room.east.warning_strobe
    position: (6.95, 12.00, 4.20)
    dimensions: 0.30 × 0.30 × 0.30
    material: red-orange housing with warning lens
    narrative_role: combat-alert strobe (off in baseline; activates on declaration of war)
```

#### Wall: North (grand alliance-war display + historical war relief)

```
wall_id:              north
material_primary:     painted steel; reinforced; full-height grand-display backing
material_secondary:   bronze dado; bronze frame around grand display
panelisation:         standard
colour_value:         --token-color-ark-war-room-wall-north
embedded_displays:
  - id: ark.war_room.north.grand_war_display
    position: (0.00, 13.95, 2.50)
    dimensions: 4.00 × 2.40 × 0.10
    content: THE central display; full grand-alliance war state (real-time + historical overlay)
embedded_doors:        none
decorative_features:
  - id: ark.war_room.north.relief.victory_through_unity
    position: (0.00, 13.85, 4.00)
    dimensions: 2.40 × 0.60 × 0.10
    material: cast bronze with deep relief
    narrative_role: depicts allied figures clasping arms; reads "VICTORY THROUGH UNITY"
  - id: ark.war_room.north.alliance_emblem
    position: (0.00, 13.85, 5.00)
    dimensions: 0.80 × 0.60 × 0.04
    material: cast bronze with gilt highlights
    narrative_role: alliance-faction emblem; player's alliance only
```

#### Wall: West (6 opposing faction displays — mirror of east)

```
wall_id:              west
material_primary:     same as east
material_secondary:   bronze dado
panelisation:         standard
colour_value:         --token-color-ark-war-room-wall-west
embedded_displays:
  - id: ark.war_room.west.opposing_faction_standing.<n>  (6 displays mirror of east)
    position: along west wall
    dimensions: 1.00 × 0.60 × 0.05 each
    content: per-opposing-faction status (enemy alliance)
  - id: ark.war_room.west.opposing_alliance_bracket
    position: (0.05, 11.50, 1.80)
    dimensions: 1.40 × 0.80 × 0.05
    content: opposing alliance bracket
  - id: ark.war_room.west.tactical_wall_display.opposing
    position: (0.05, 7.00, 2.50)
    dimensions: 2.40 × 1.60 × 0.05
    content: opposing-side tactical analysis
embedded_doors:        none
decorative_features:
  - id: ark.war_room.west.warning_strobe
    position: (0.05, 12.00, 4.20)
    dimensions: 0.30 × 0.30 × 0.30
    material: red-orange housing
    narrative_role: combat-alert strobe (mirror of east)
```

### A.20.5 Ceiling

```
height_above_floor:     4.50 m baseline; central drop coffer at 4.00 m above holo-map (gives the central command-area intimacy)
material:               exposed structural steel framework with industrial conduits; central coffer is a dark backlit panel (cool-tactical tone)
lighting_integrated:    suspended high-bay fixtures on 2.40 m × 2.40 m grid (excluding holo-map central zone); central coffer has direct holo-map illumination; perimeter strip-lighting at z = 4.20 wall-edge
atmospheric_features:   subtle haze in central volume above holo-map (cosmetic; suggests "battle smoke"); intensifies during alert states (warning strobes activate)
acoustic_treatment:     baffled (war-room-grade voice clarity)
```

### A.20.6 Lighting

```
ambient_baseline:     5000 K (cool-neutral; tactical-formal); 280 lux at floor level; CRI 90
direct_fixtures:
  - id: ark.war_room.light.high_bay_array
    position: distributed at z = 4.20 on 2.40 × 2.40 grid (excluding holo-map zone)
    beam_angle: 90°
    colour: --token-color-ark-war-room-high-bay  (cool tactical white)
    intensity: 4500 lumens each
    function: ambient task lighting
  - id: ark.war_room.light.holo_map_central_glow
    position: (0.00, 7.00, 0.00)  # at holo-map centre
    beam_angle: 360° upward + outward (radial)
    colour: variable (matches holo-map content; deep navy with red/amber/cyan accents)
    intensity: variable (3000-15000 lumens; pulses with battle activity)
    function: principal — the holo-map IS the room's primary visual
  - id: ark.war_room.light.briefing_table_pendant
    position: (0.00, 1.50, 4.00)
    beam_angle: 60° downward
    colour: --token-color-ark-war-room-briefing-pendant  (cool white)
    intensity: 4000 lumens
    function: focused briefing-table illumination
  - id: ark.war_room.light.faction_display_strip.east
    position: along east wall above faction-standing displays at z = 3.40
    beam_angle: 90° downward
    colour: 4500 K cool
    intensity: 600 lumens per metre
    function: display-bezel accent
  - id: ark.war_room.light.faction_display_strip.west
    position: mirror of east
    beam_angle: 90° downward
    colour: 4500 K cool
    intensity: 600 lumens per metre
    function: display-bezel accent
  - id: ark.war_room.light.grand_display_uplight
    position: along base of north grand display at z = 1.20
    beam_angle: 30° upward
    colour: --token-color-ark-war-room-grand-uplight  (cool tactical with amber hints)
    intensity: 1200 lumens per metre
    function: dramatic backlighting for grand display
practical_sources:
  - id: ark.war_room.faction_display_glow.east.<n>, .west.<n>  (12 small glows; one per faction display)
    position: per display
    intensity: 80 lumens each (varies by faction-status — green for allied; amber for tense; red for hostile)
    flicker_pattern: stable
  - id: ark.war_room.alert_strobe_glow.<corner>  (4 emitters; off baseline)
    position: per corner
    intensity: 0 lumens (off); 5000 lumens at strobe-flash
    flicker_pattern: cyclic-strobe (alert states only)
time_of_day_variation:
  acts_4_to_7: stable cool baseline; in late-act7, if alliance is winning, holo-map glows brighter + grand-uplight intensifies; if losing, dim + red-tinted
dynamic_response:
  - on_alliance_war_declaration: ambient warms to 5800 K alert-tone; alarm-strobes activate; holo-map intensifies
  - on_briefing_active: briefing pendant intensifies + ambient dims slightly (tactical focus)
  - on_holo_map_inspection: that-region of holo-map brightens 30%
  - on_faction_status_change: relevant faction-display flashes briefly + glow colour shifts
```

### A.20.7 Atmosphere

```
air_temperature:    19°C (cool — tactical-formal)
humidity:           38% RH (low; display-electronics-friendly); smells of steel + ozone (display electronics) + faint coffee (strategist's beverages) + warm leather (chair upholstery)
particulate:
  - type: dust
    density: low (tactical-grade air filtration)
    colour: greyish-iron
    drift_direction: random
  - type: ozone_haze
    density: very low (continuous; from heavy display use)
    colour: pale-cyan
    drift_direction: rises
  - type: combat_visualisation_motes
    density: state-conditional (during active war; cosmetic motes drift across holo-map zone matching battle activity)
    colour: red/amber/cyan per battle state
    drift_direction: matches holo-map flow
volumetric_fog:     absent in baseline; present during alert states (0.10 g/m³, cool-grey)
wind_drift:         minimal; 0.04 m/s; HVAC pattern toward central holo-map (heat from electronics)
smell_canon:        steel + ozone + coffee + leather; voice-line: "smells like the weight of decisions"
```

### A.20.8 Sound

```
ambient_bed:           file: war_room_ambient_bed_v1.ogg (loop); -32 dB; cooling fans, distant alliance-comms-static, occasional alarm-chirp, holo-map projection hum
point_sources:
  - id: ark.war_room.sound.holo_map_hum
    position: (0.00, 7.00, 1.05)
    sound: deep electronic hum (continuous, -28 dB; varies with battle activity)
    occlusion_behaviour: omnidirectional
    trigger: continuous
  - id: ark.war_room.sound.faction_display_buzz.east.<n>, .west.<n>  (12 sources)
    position: per display
    sound: low electronic buzz (continuous, -42 dB each)
    occlusion_behaviour: standard
    trigger: continuous
  - id: ark.war_room.sound.cooling_fan.<n>  (8 fans distributed in ceiling)
    position: distributed
    sound: HVAC cooling drone (continuous, -38 dB)
    occlusion_behaviour: omnidirectional
    trigger: continuous
  - id: ark.war_room.sound.alarm_klaxon
    position: (0.00, 13.95, 4.50)
    sound: low rumble warning tone (off in baseline; -22 dB during alert)
    occlusion_behaviour: omnidirectional
    trigger: state-conditional
  - id: ark.war_room.sound.distant_alliance_comms_static
    position: (0.00, 13.95, 2.00)
    sound: muffled radio voices from grand display (cycles random clips; -42 dB)
    occlusion_behaviour: standard
    trigger: continuous
  - id: ark.war_room.sound.briefing_chair_subtle_creak
    position: distributed at briefing table
    sound: occasional leather-chair creak (-38 dB)
    occlusion_behaviour: standard
    trigger: random (period 60-90s; more frequent during briefings)
reverb_zone:           IR-impulse: war_room_v1.wav; wet-mix 22% (intentional voice-clarity; tactical)
music_eligibility:     cutscene only (alliance-war declaration / strategy-session cutscenes)
voice_line_eligibility:
  - speaker: the_chief_strategist (named NPC; primary occupant Acts 4+): line set §2.20.2
  - speaker: alliance_command_relay (institutional voice; ambient announcements): line set §2.20.2
  - speaker: visiting_alliance_leaders (rotating during briefings): scripted events
```

### A.20.9 Object inventory

War Room has 36 inventory objects.

#### A.20.9.1 The Central Strategic Holo-Map

```
object_id:           ark.war_room.holo_map.alliance
object_class:        display
position:            (0.00, 7.00, 0.00)
dimensions:          5.00 × 4.00 × 1.05 (large rectangular footprint; holographic projection rises above)
rotation:            0°
material_primary:    brushed-titanium frame with matte-black holographic projection surface
material_secondary:  bronze edge-trim with status LEDs at corners; brass control panels recessed at south + north sides
colour_value:        --token-color-ark-war-room-holo-map  (titanium-black with bronze accents; hologram is variable)
interaction:         interactable
  - operate: spawns 3D holographic display of full alliance-war theatre; player can plan strategy + issue orders
  - inspect: lore-note about strategic-table system
  - inspect_region: zoom to specific battle-region
narrative_role:      THE central command surface; primary alliance-war gameplay-launcher; strategists gather around for briefings
lore_anchor:         loredex.system.alliance_war + arc.faction_war
art_status:          producer_handoff
gameplay_hook_id:    trpc.war_room.holo_map.operate + .inspect_region
wear_state:          slight wear at most-touched control panels
physical_constraints: collides; player can lean
```

#### A.20.9.2 The Briefing Table (south)

```
object_id:           ark.war_room.briefing_table
object_class:        furniture
position:            (0.00, 1.50, 0.00)
dimensions:          4.00 × 1.00 × 0.85
rotation:            0°
material_primary:    polished walnut top with leather inset; brass corner caps
material_secondary:  bronze trim; bronze nameplates per seat (8 strategist names)
colour_value:        --token-color-ark-war-room-briefing-table
interaction:         interactable
  - operate: opens briefing UI (player initiates strategy session with attending NPCs)
  - inspect: lore-note about briefing protocols
narrative_role:      where strategists meet; gameplay-active during alliance-war events
lore_anchor:         loredex.system.alliance_war
art_status:          producer_handoff
gameplay_hook_id:    trpc.war_room.briefing.start
wear_state:          worn at the leather inset (centre of table); subtle ink-stains visible
physical_constraints: collides
```

#### A.20.9.3-10 Eight Strategist Briefing Chairs

```
object_id:           ark.war_room.briefing_chair.<n>  (8 chairs at briefing table; 4 per side)
object_class:        furniture
positions:           [
  (-1.50, 0.50, 0.00), (-0.50, 0.50, 0.00), (0.50, 0.50, 0.00), (1.50, 0.50, 0.00),    # south side (4)
  (-1.50, 2.50, 0.00), (-0.50, 2.50, 0.00), (0.50, 2.50, 0.00), (1.50, 2.50, 0.00),    # north side (4)
]
dimensions (each):   0.80 × 0.80 × 1.20
rotation (each):     varies (faces table)
material_primary:    matte-black leather; titanium frame; ergonomic for long briefings
material_secondary:  brass armrests with engraved alliance sigil
colour_value:        --token-color-ark-war-room-briefing-chair
interaction:         interactable - sit
narrative_role:      strategist seating; player can attend briefings; chair 1 (chief's seat) has subtly different upholstery
lore_anchor:         loredex.system.strategist_council
art_status:          producer_handoff
gameplay_hook_id:    trpc.war_room.briefing_chair.sit
wear_state:          slight wear at most-occupied seats (varies by attendance)
physical_constraints: collides; sittable
```

#### A.20.9.11 The Chief Strategist's Chair

```
object_id:           ark.war_room.chief_strategist_chair
object_class:        furniture  (also npc_anchor)
position:            (0.00, -0.30, 0.00)  # at south end of briefing table; faces north
dimensions:          0.90 × 0.90 × 1.50
rotation:            0°  (faces north, into the room toward holo-map)
material_primary:    matte-black leather with deeper-charcoal velvet upholstery; reinforced titanium frame
material_secondary:  brass armrests with engraved chief-strategist sigil; bronze nameplate "THE CHIEF STRATEGIST"
colour_value:        --token-color-ark-war-room-chief-chair
interaction:         interactable - sit (when Chief Strategist absent)
narrative_role:      THE chief's chair; permanent physical anchor; he's almost always present during briefings
lore_anchor:         loredex.character.the_chief_strategist
art_status:          producer_handoff
gameplay_hook_id:    trpc.war_room.chief_chair.sit
wear_state:          worn at right armrest (Chief is right-handed); cushion permanently indented
physical_constraints: collides; sittable
```

#### A.20.9.12-23 Twelve Faction-Standing Displays (6 east + 6 west)

```
object_id:           ark.war_room.east.faction_standing.<n>  (6 displays at east wall) and .west.opposing_faction_standing.<n>  (6 displays at west wall)
object_class:        display
positions:           per A.20.4 walls section (12 displays total)
dimensions (each):   1.00 × 0.60 × 0.05
rotation:            varies (270° east; 90° west)
material_primary:    OLED display panel
material_secondary:  brass surround with bronze nameplate per faction (12 distinct factions named)
colour_value:        per-faction (12 token families; varies by status)
interaction:         interactable
  - inspect: deep faction-status detail (military strength, alliances, rivalries, recent actions)
narrative_role:      per-faction status; visual-key for alliance management
lore_anchor:         per-faction
art_status:          producer_handoff
gameplay_hook_id:    trpc.war_room.faction_standing.inspect
wear_state:          pristine
physical_constraints: non-collide (recessed)
```

#### A.20.9.24-25 Two Alliance Bracket Displays (east + west)

```
object_id:           ark.war_room.east.alliance_bracket_display, .west.opposing_alliance_bracket
object_class:        display
positions:           (6.95, 11.50, 1.80), (0.05, 11.50, 1.80)
dimensions (each):   1.40 × 0.80 × 0.05
rotation:            varies
material_primary:    OLED display
material_secondary:  brass surround
colour_value:        (variable + bezel token)
interaction:         inspectable
  - inspect: opens bracket-detail UI
narrative_role:      visual organisation of alliance structure (player's side + enemy side)
lore_anchor:         loredex.system.alliance_brackets
art_status:          producer_handoff
gameplay_hook_id:    trpc.war_room.bracket.inspect
wear_state:          pristine
physical_constraints: non-collide
```

#### A.20.9.26-27 Two Tactical Wall-Displays (east + west; deep analysis)

```
object_id:           ark.war_room.east.tactical_wall_display, .west.tactical_wall_display.opposing
object_class:        display
positions:           (6.95, 7.00, 2.50), (0.05, 7.00, 2.50)
dimensions (each):   2.40 × 1.60 × 0.05
rotation:            varies
material_primary:    OLED + holographic overlay capability
material_secondary:  brass surround
colour_value:        (variable)
interaction:         inspectable
  - inspect: deep tactical analysis (terrain + threat-projections)
narrative_role:      large-scale tactical view; complements central holo-map
lore_anchor:         loredex.system.tactical_analysis
art_status:          producer_handoff
gameplay_hook_id:    trpc.war_room.tactical.inspect
wear_state:          pristine
physical_constraints: non-collide
```

#### A.20.9.28 The Grand Alliance-War Display (north)

```
object_id:           ark.war_room.north.grand_war_display
object_class:        display
position:            (0.00, 13.95, 2.50)
dimensions:          4.00 × 2.40 × 0.10
rotation:            180°
material_primary:    composite OLED panel with full-spectrum colour + holographic overlay
material_secondary:  bronze frame with gilt highlights
colour_value:        --token-color-ark-war-room-grand-display  (variable; cosmic-amber to red-tinged based on war-state)
interaction:         interactable
  - operate: opens grand-strategy UI (highest-level commands)
  - inspect: war-history archive
narrative_role:      THE grand display; visible from anywhere in the room
lore_anchor:         loredex.system.alliance_war
art_status:          producer_handoff
gameplay_hook_id:    trpc.war_room.grand_display.operate
wear_state:          pristine
physical_constraints: collides
```

#### A.20.9.29 The Alarm Trigger Console

```
object_id:           ark.war_room.alarm_panel
object_class:        console
position:            (0.00, 0.50, 1.20)  # at south wall, near entrance
dimensions:          0.60 × 0.20 × 0.80
rotation:            180°
material_primary:    red-painted steel housing
material_secondary:  bronze keyhole + bronze trigger-handle
colour_value:        --token-color-ark-war-room-alarm-panel  (red with bronze)
interaction:         interactable
  - trigger_alarm: deploys emergency alliance-wide alert
  - inspect: lore-note about alert protocols
narrative_role:      gameplay-active in critical states; multiplayer alliance-wide alert
lore_anchor:         loredex.system.alliance_alerts
art_status:          producer_handoff
gameplay_hook_id:    trpc.war_room.alarm_panel.trigger
wear_state:          pristine (rare use)
physical_constraints: collides
```

#### A.20.9.30-33 Four Corner Alert Strobes

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.war_room.alert_strobe.<corner>` (4) | fx_emitter | corners at z = 4.20 | 0.30 × 0.30 × 0.30 each | combat-alert strobes (off baseline; activate during alert) |

#### A.20.9.34-36 Closing Items

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.war_room.south.intercom` | console | (-2.00, 0.20, 1.50) | 0.20 × 0.10 × 0.30 | comms relay |
| `ark.war_room.fire_extinguisher.south` | interactive | (2.00, 0.20, 1.20) | 0.20 × 0.20 × 0.50 | safety |
| `ark.war_room.first_aid.kit.south` | container | (-3.00, 0.20, 1.50) | 0.40 × 0.10 × 0.30 | medical |

Total: 36 inventory objects.

### A.20.10 Camera-spawn-points (FPV cutscenes)

```
cutscene_id:         cs_amb_war_room  (Category B; deferred catalogue)
camera_position:     (0.00, 0.50, eye_level)  # at threshold
camera_facing:       (0°, 5°, 0°)  # looking forward and up at holo-map + grand display
avatar_height_anchor: eye_level
head_motion:         slow approach to holo-map; head pans east + west to scan faction displays; pause at holo-map; head looks up at grand display; lasts 22s

cutscene_id:         cs_first_strategy_session  (Act 4 one-shot)
camera_position:     (0.00, -0.30, eye_level)  # at chief strategist chair
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         seated; chief strategist enters; first alliance briefing begins

cutscene_id:         cs_alliance_war_declaration  (state-conditional)
camera_position:     (0.00, 7.00, eye_level)  # at holo-map
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         locked at holo-map; battle-icons explode across map; ambient warms to alert-tone

cutscene_id:         cs_alliance_collapse  (Act 7+ state-conditional)
camera_position:     (0.00, 7.00, eye_level)
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         ambient dims; faction-displays flash red one by one; grand display cracks visually
```

### A.20.11 Doorways

```
door_id:            ark.war_room.south.door.main
connecting_space_id: ark.corridor.war_room_approach
door_position:      (0.00, 0.00, 0.00)
door_dimensions:    1.60 × 2.40 × 0.10
door_class:         pressure_seal  (biometric authentication)
unlock_condition:   Act 4+
transit_animation:  airlock-cycle (3s); slow ceremonial open on first entry per session
audio_signature:    pneumatic-hiss + magnetic-clack + alliance-recognition tone
```

### A.20.12 Adjacency map

```
direct_adjacencies:
  - ark.corridor.war_room_approach (south door)
one_hop_adjacencies:
  - ark.bridge (via long corridor; tactical command escalation)
  - ark.governance_chamber (Act 4+; alliance governance)
  - ark.defense_command_center (long route; tactical execution)
state_shared_with:
  - ark.bridge (tactical-display data feeds here)
  - ark.defense_command_center (threat-display data shared)
  - ark.governance_chamber (alliance governance state)
```

### A.20.13 Gameplay hooks

```
hooks:
  - hook_id:         war_room.operateHoloMap
    trigger:         player.operate on holo_map
    procedure:       trpc.war_room.holo_map.operate
    success_state:   strategic_view_active = true
  - hook_id:         war_room.briefAlliance
    trigger:         player.operate on briefing_table
    procedure:       trpc.war_room.briefing.start
    success_state:   briefing_active = true
  - hook_id:         war_room.inspectFactionStanding
    trigger:         player.inspect on faction_standing.<wall>.<n>
    procedure:       trpc.war_room.faction_standing.inspect
    success_state:   faction_inspected = true (per-faction)
  - hook_id:         war_room.inspectAllianceBracket
    trigger:         player.inspect on alliance_bracket_display.<wall>
    procedure:       trpc.war_room.bracket.inspect
    success_state:   bracket_inspected = true
  - hook_id:         war_room.operateGrandDisplay
    trigger:         player.operate on grand_war_display
    procedure:       trpc.war_room.grand_display.operate
    success_state:   grand_display_active = true
  - hook_id:         war_room.triggerAlarm
    trigger:         player.interact on alarm_panel (with biometric)
    procedure:       trpc.war_room.alarm_panel.trigger
    success_state:   alliance_alert_active = true
  - hook_id:         war_room.takeChiefSeat
    trigger:         player.sit on chief_strategist_chair (when Chief absent)
    procedure:       trpc.war_room.chief_chair.sit
    success_state:   sat_in_chief_chair = true (rare lore-flag; player-as-chief moments)
  - hook_id:         war_room.takeBriefingChair
    trigger:         player.sit on briefing_chair.<n>
    procedure:       trpc.war_room.briefing_chair.sit
    success_state:   briefing_chair_active = true
```

### A.20.14 Story-tie

```
primary_arcs:
  - arc.act_4_first_strategy_session
  - arc.faction_war (continuous Acts 4-7)
  - arc.alliance_progression
  - arc.act_5_alliance_betrayal (state-conditional)
  - arc.act_7_alliance_collapse_or_victory (state-branched)
per_act_evolution:
  acts_0_3: room locked
  act_4: opens; first alliance war briefing; faction-standings established
  act_5: alliance dynamics shift; betrayals possible; faction-displays flicker red as enemies declare
  act_6: deep multi-front war; grand-display populated; many briefings
  act_7: state-branched: alliance-victory ending (faction-displays all green; grand display triumphant) vs. alliance-collapse ending (faction-displays mostly red; grand display cracked; chief strategist absent)
npc_roster:
  - the_chief_strategist: primary occupant; presence Acts 4+
  - alliance_leaders: rotating during briefings; up to 8 attendees per session
  - the_player: visitor / strategist
  - alliance_command_relay: ambient voice presence
readables:
  - creed plaque (south)
  - victory-through-unity relief (north)
  - alliance emblem (north)
  - 12 faction-standing displays (per-faction lore)
  - grand-display war-history archive
  - briefing-table nameplates (8 named strategists)
master_of_rlyeh_question: n/a
```

### A.20.15 Special-FX

```
particle_systems:
  - dust (low; tactical-grade air filtration)
  - ozone_haze (very low; cosmetic from heavy display use)
  - combat_visualisation_motes (state-conditional; matches holo-map battle-flow)
  - alert_smoke (cosmetic during stress states; rises from corner emitters)
volumetric_effects:
  - holo_map_volumetric_overlay (3D battle theatre projection above table)
  - faction_display_glow_per_panel (subtle ambient per faction)
  - grand_display_uplight_envelope (warm cool wash up north wall)
  - alert_strobe_envelope (state-conditional)
procedural_animations:
  - holo_map_battle_animations (continuous; matches real-time war-state)
  - faction_status_pulses (per-faction pulse rhythm matching their faction-status)
  - alert_strobe_cycles (state-conditional)
  - cooling_fans_rotate (8 fans; subtle blade animation)
  - grand_display_war_history_scroll (cosmetic; subtle background animation)
reactive_systems:
  - holo_map_intensify_on_proximity (within 3 m, holo-map content brightens 20%)
  - faction_display_flash_on_status_change (one-shot per change)
  - briefing_pendant_intensify_on_briefing
  - alert_strobes_on_alert_state
  - grand_display_dramatic_zoom_on_alliance_event (cinematic moment when major event happens)
```

### A.20.16 Avatar-parametricity

```
camera_height_variation:
  small_xenomorph (0.85m eye): camera height 0.85m; holo-map feels enormous; alternate "lift platform" at chief strategist chair
  short_humanoid (1.40m eye): standard short scale
  average_humanoid (1.70m eye): standard
  tall_humanoid (2.05m eye): comfortable scale; pendant-light at near-head level
  tall_xenomorph (2.70m eye): some high-bay fixtures collide; alternate route through room centre
reachability:
  small_xenomorph: cannot reach upper grand-display zones; relay-inspect from below; alternate elevator-stool at briefing table
  small_xenomorph: cannot reach top faction-standings (north end of column); alternate ladder
  others: all-reachable
audio_occlusion_variation:
  xenomorph_sensitive_hearing: cooling fans + comms-static more pronounced
  synthetic_voice_avatar: alliance command relay has subtle resonance bias (synthetic affinity)
```

### A.20.17 Performance

```
polygon_budget:      300,000 polygons (display-heavy; many shaders; LOD critical)
texture_budget:      200 MB total (12 faction-display content shaders + grand display + holo-map)
light_count_limit:   20 simultaneous dynamic lights
lod_plan:
  - hero_distance: 0-12m, full detail
  - mid_distance: 12-25m, mid detail (faction-displays simplified to icons; chairs simplified)
  - low_distance: 25m+, low detail (mostly billboarded)
streaming_behaviour:
  - preload: ark.corridor.war_room_approach (south door)
  - on_alliance_war_active: preload destination.alliance_war_maps (current battle theatre only)
  - on_briefing_active: preload current alliance-data feeds
```

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

## A.23 Chaos Forge (Hierarchy alignment) — FULL

**Status: FULL spec.** Cross-ref `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.23 (art-state prompts).

### A.23.1 Header

```
space_id:        ark.chaos_forge
space_name:      Chaos Forge (D9 Hierarchy alignment)
space_type:      ark_room  (Hierarchy sub-sanctum; D9-deck)
act_introduced:  Act 5 (Hierarchy-aligned only)
lore_anchor:     loredex.faction.hierarchy + arc.chaos_forge_rituals + arc.act_5_first_chaos_offering + arc.hierarchy_chaos_doctrine
aesthetic_tier:  hierarchy_ritual  (Wagnerian baroque + industrial fire — the contradiction is intentional)
```

### A.23.2 Geometry

```
dimensions:           11.00 m × 11.00 m × 7.00 m
origin_point:         centre of floor at south entrance threshold
coordinate_axes:      +x = right, +y = forward (north), +z = up
floor_plan_geometry:  rectangular  (with central chaos-forge fire on raised brass dais; chimney rises through ceiling)
volumetric_anomalies: heat-shimmer + ritual-energy distortion above forge during active rituals; subtle volumetric warping during chaos invocations
```

The Chaos Forge is the Hierarchy faction's deeper ritual chamber
— accessible only to Hierarchy-aligned players from Act 5+. The
room combines Wagnerian-baroque cathedral atmosphere with raw
industrial forge: charcoal stone walls + cast-iron grating floor
+ central fire on a raised brass dais. The contradiction is the
point — Hierarchy doctrine teaches that order emerges from chaos
through ritual sacrifice. Three offering altars at 120° intervals
around the central forge. Three censers between altars. Six
chandeliers hang from the vaulted ceiling. The chimney pierces
the ceiling at room centre, drawing forge-smoke upward.

Floor area: 121 m².

### A.23.3 Floor

```
material_primary:     cast-iron grating with anti-slag heat-resistant coating; 1.00 m × 1.00 m panels with 50 mm × 5 mm slot pattern; allows ember-drift management
material_secondary:   dark marble inlay around forge dais (3.00 × 3.00 m square; deeper colour than gratings); bronze inlay forming a triple-axis (3-arm star) at 120° intervals from forge centre, aligning with the three offering altars
pattern:              cast-iron grating + central marble dais + 3-arm star bronze inlay
wear_state:           well-used; scorch-marks accumulate around forge; oil + slag stains visible; ember-burn marks at the 3 altar approach paths
embedded_features:
  - id: ark.chaos_forge.floor.charge_point.central_forge
    position: (0.00, 5.50, 0.00)  # under forge centre
    dimensions: 0.40 × 0.40 × 0.05
    function: forge ignition + ritual-energy power
  - id: ark.chaos_forge.floor.slag_drain.east, .west, .north  (3 drains)
    position: (4.50, 5.50, 0.00), (-4.50, 5.50, 0.00), (0.00, 9.00, 0.00)
    dimensions: 0.40 × 0.40 × 0.10 each
    function: molten-slag drainage during forge active states
  - id: ark.chaos_forge.floor.altar_anchor.<n>  (3 altar anchors at 120° intervals; radius 3.50 m from forge)
    position: per altar (north, southeast, southwest)
    dimensions: 0.30 × 0.30 × 0.05 each
    function: altar electronics + offering-burn power
  - id: ark.chaos_forge.floor.censer_anchor.<n>  (3 censer anchors at 60° intervals between altars)
    position: per censer
    dimensions: 0.20 × 0.20 × 0.05 each
    function: censer-flame power
acoustic_property:    hard_reflective with industrial echo + cathedral-resonance overlay; RT60 = 0.65s (long industrial-cathedral)
```

### A.23.4 Walls

#### Wall: South (entrance)

```
wall_id:              south
material_primary:     charcoal stone-clad (matches Hierarchy Throne aesthetic) with carved Hierarchy-faction reliefs at z = 1.20 to 4.00 (figures + script)
material_secondary:   bronze dado at z = 1.20 m, 80 mm tall, ornately cast
panelisation:         standard with stone-relief integration
colour_value:         --token-color-ark-chaos-forge-wall-south  (deep charcoal with bronze pin-stripe + heat-residue patina at z = 2.00 m)
embedded_displays:
  - id: ark.chaos_forge.south.display.ritual_status
    position: (-2.50, 0.20, 1.80)
    dimensions: 1.20 × 0.80 × 0.05
    content: current ritual schedule + recent offerings log
  - id: ark.chaos_forge.south.display.offering_register
    position: (2.50, 0.20, 1.80)
    dimensions: 1.20 × 0.80 × 0.05
    content: registry of player's chaos-offerings made
embedded_doors:
  - door_id: ark.chaos_forge.south.door.main
    position: (0.00, 0.00, 0.00)
    dimensions: 1.40 × 2.40 × 0.10
    door_class: pressure_seal  (heat-isolation + faction-token authentication)
    connecting_space_id: ark.hierarchy_throne  (sub-chamber of Hierarchy Throne; accessed through the Throne's east aspect)
    unlock_condition: Act 5+ Hierarchy-aligned
decorative_features:
  - id: ark.chaos_forge.south.plaque.creed
    position: (0.00, 0.20, 3.20)
    dimensions: 1.00 × 0.40 × 0.02
    material: cast bronze with deep-etched text + heat-anodised colouring (the bronze has been forge-tempered)
    narrative_role: reads "FORGE THE OFFERING / FORGE THE WORLD" — Chaos Forge creed
  - id: ark.chaos_forge.south.relief.chaos_doctrine
    position: (0.00, 0.20, 4.50)
    dimensions: 4.00 × 0.40 × 0.10
    material: cast bronze with high-relief carving
    narrative_role: depicts the chaos-doctrine canon — figures emerging from flame
  - id: ark.chaos_forge.south.warning_sign.high_heat
    position: (4.50, 0.20, 3.50)
    dimensions: 0.40 × 0.30 × 0.01
    material: yellow-and-black painted steel
    narrative_role: high-temperature warning
```

#### Wall: East (ritual robes alcove + censer)

```
wall_id:              east
material_primary:     stone-clad with deep alcove (mirrored from west) for ritual robes
material_secondary:   bronze dado; bronze altar-anchor for east censer
panelisation:         alcove + standard wall
colour_value:         --token-color-ark-chaos-forge-wall-east
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: ark.chaos_forge.east.alcove.robes
    position: (4.95, 5.50, 0.00)
    dimensions: 1.20 × 0.80 × 3.50 (deep alcove)
    material: charcoal stone backplane + bronze hanging-rods
    narrative_role: holds 6 ritual robes (one per Hierarchy ritual category — confession, dedication, sacrifice, supplication, exaltation, lamentation); player can equip
  - id: ark.chaos_forge.east.candle_stand.south_of_alcove
    position: (4.95, 1.50, 0.00)
    dimensions: 0.30 × 0.30 × 0.40
    material: cast bronze with 3-candle holder
    narrative_role: paired bronze candle stand for ritual-prep
```

#### Wall: North (apsidal — chaos emblem + banner)

```
wall_id:              north_apsidal
material_primary:     stone-clad apse (curved); central recess holds THE CHAOS EMBLEM (cast-bronze relief; 1.40 × 0.40 × 0.10)
material_secondary:   bronze dado around apse base; bronze rib detail above
panelisation:         apsidal — single curved surface
colour_value:         --token-color-ark-chaos-forge-wall-apse  (warmer charcoal; reflects forge-light)
embedded_displays:    none (the emblem is the visual focus)
embedded_doors:        none
decorative_features:
  - id: ark.chaos_forge.north.relief.chaos_emblem
    position: (0.00, 10.95, 4.00)
    dimensions: 1.40 × 0.40 × 0.10
    material: cast bronze with heat-anodised gilt highlights
    narrative_role: THE chaos emblem; depicts a stylised flame within a circle (chaos contained by ritual)
  - id: ark.chaos_forge.north.banner
    position: (0.00, 10.85, 6.00)
    dimensions: 1.00 × 0.05 × 1.50
    material: deep crimson velvet with gold-thread embroidery; bronze hanging-rod
    narrative_role: reads "CHAOS IS THE WAY" — the room's primary motto
  - id: ark.chaos_forge.north.altar.offering
    position: (0.00, 9.00, 0.00)  # north altar (closest to apse)
    dimensions: 0.80 × 0.80 × 0.95
    material: polished black granite with inlaid gold cross + gold-leaf rim
    narrative_role: north offering altar (largest of 3); ritual focal point for chaos-offerings
```

#### Wall: West (ritual tools alcove + censer)

Mirror of east.

```
wall_id:              west
material_primary:     same as east
material_secondary:   bronze dado
panelisation:         alcove + standard wall
colour_value:         --token-color-ark-chaos-forge-wall-west
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: ark.chaos_forge.west.alcove.tools
    position: (-4.95, 5.50, 0.00)
    dimensions: 1.20 × 0.80 × 3.50
    material: charcoal stone backplane + bronze tool-mounts
    narrative_role: holds 8 ritual tools (chains, brand, censer-tongs, sacred bell, ritual blade, libation cup, sealing wax, prayer beads); gameplay-key for advanced rituals
  - id: ark.chaos_forge.west.candle_stand.south_of_alcove
    position: (-4.95, 1.50, 0.00)
    dimensions: 0.30 × 0.30 × 0.40
    material: cast bronze with 3-candle holder
    narrative_role: mirror of east candle stand
```

### A.23.5 Ceiling

```
height_above_floor:     7.00 m baseline; central chimney rises through ceiling at z = 7.00 (chimney visible up to z = 14.00 when looking up)
material:               vaulted stone with bronze rib detailing; central chimney is cast-iron
lighting_integrated:    6 hanging chandeliers at z = 5.50 in a hexagonal pattern around the chimney (warm amber); central chimney has internal heat-glow (visible from below)
atmospheric_features:   visible heat-shimmer rising from forge through chimney; smoke-haze pools at vault apex during active rituals
acoustic_treatment:     coffered + apsidal echo at rear; supports chant-voice resonance
```

### A.23.6 Lighting

```
ambient_baseline:     2200 K (very warm; firelight + candle-tone); 100 lux at floor (intentionally dim — ritual atmosphere); CRI 78 (low; supports warm ritual palette)
direct_fixtures:
  - id: ark.chaos_forge.light.chaos_forge_glow
    position: (0.00, 5.50, 0.50)  # at forge centre
    beam_angle: 360° (radial)
    colour: --token-color-ark-chaos-forge-forge-glow  (orange-red baseline; intensifies to white-hot during active rituals)
    intensity: 12000 lumens (variable; baseline 6000; ritual peak 16000)
    function: principal — the forge IS the room's primary visual element
  - id: ark.chaos_forge.light.chandelier.<n>  (6 hanging chandeliers in hexagonal arrangement around chimney)
    position: hex pattern at z = 5.50; positions per 60° around (0.00, 5.50, 5.50)
    beam_angle: 270° (downward + lateral)
    colour: --token-color-ark-chaos-forge-chandelier  (warm amber)
    intensity: 3000 lumens each (pulses with distant chants; period varies)
    function: ambient + ritual atmosphere
  - id: ark.chaos_forge.light.altar_glow.<n>  (3 altar uplights)
    position: at base of each altar
    beam_angle: 30° upward
    colour: --token-color-ark-chaos-forge-altar-glow  (warm amber-gold)
    intensity: 1500 lumens each
    function: dramatic altar illumination
  - id: ark.chaos_forge.light.chimney_internal_glow
    position: (0.00, 5.50, 7.00)  # chimney interior
    intensity: 2000 lumens (visible from below; varies with forge state)
    flicker_pattern: matches forge rhythm
practical_sources:
  - id: ark.chaos_forge.censer_smoke_emitter.<n>  (3 censers; one per 60° between altars)
    position: per censer
    intensity: 100 lumens (when burning; warm amber)
    flicker_pattern: organic flame + smoke emission
  - id: ark.chaos_forge.candle_stand.<east|west>.flames
    position: per candle in stand
    intensity: 50 lumens each (3 candles per stand × 2 stands)
    flicker_pattern: organic
time_of_day_variation:
  acts_5_to_7: stable warm baseline; in late-act7, if player has been deeply Hierarchy-aligned, all flames glow brighter + chandeliers pulse in deep harmonic; if not, only minimal forge-glow
dynamic_response:
  - on_player_at_forge: forge glow intensifies 30%; ambient warms to 2400 K; ritual-shimmer activates
  - on_offering_placed: relevant altar glow flares + forge consumes offering with white-hot flash + brief volumetric energy distortion
  - on_chaos_invocation: deep low rumble + forge rises to white-hot + chimney glow intensifies
```

### A.23.7 Atmosphere

```
air_temperature:    30°C very warm during active forge (rises to 38°C during major rituals); 24°C baseline
humidity:           38% RH; smells of incense (frankincense + myrrh + something darker — ritual-specific) + hot iron + ozone + faint blood (canonical ritual residue) + warm bronze
particulate:
  - type: incense_smoke
    density: high (continuous from 3 censers; visible plumes rising through chimney)
    colour: pale grey-blue with amber underglow
    drift_direction: rises rapidly through chimney
  - type: forge_smoke
    density: medium during active forge; low baseline
    colour: dark grey
    drift_direction: rises through chimney
  - type: ember
    density: low (cosmetic; sparks from forge during active states)
    colour: bright orange (lifetime <0.5s)
    drift_direction: random spray upward
  - type: ritual_energy_motes
    density: state-conditional (during chaos invocations)
    colour: gold-amber with red flecks
    drift_direction: spirals upward
volumetric_fog:     present during rituals (0.20 g/m³, warm-amber); dissipates between rituals
wind_drift:         strong upward draft toward chimney; 0.80 m/s convection
smell_canon:        incense + hot iron + ozone + blood + bronze; voice-line: "smells like the world's beginning, again"
```

### A.23.8 Sound

```
ambient_bed:           file: chaos_forge_ambient_bed_v1.ogg (loop); -28 dB; deep forge-roar continuous, distant chants (faint), censer-burn crackles, occasional metallic creak from cooling pieces, bell-toll period 30s
point_sources:
  - id: ark.chaos_forge.sound.forge_roar
    position: (0.00, 5.50, 0.50)
    sound: deep fire-roar (continuous, -22 dB; rises during rituals)
    occlusion_behaviour: omnidirectional
    trigger: continuous (active state)
  - id: ark.chaos_forge.sound.chimney_draft
    position: (0.00, 5.50, 5.50)
    sound: continuous draft-pull (-30 dB)
    occlusion_behaviour: omnidirectional
    trigger: continuous
  - id: ark.chaos_forge.sound.distant_chants
    position: (0.00, 10.95, 4.00)  # from beyond apse
    sound: faint Hierarchy-faction chants (Latin proto-language; -34 dB)
    occlusion_behaviour: omnidirectional with bias toward apse
    trigger: continuous (cycles through ritual hours)
  - id: ark.chaos_forge.sound.bell_toll
    position: (0.00, 10.95, 6.50)
    sound: deep bell-toll (period 30s; -32 dB per toll)
    occlusion_behaviour: omnidirectional
    trigger: cyclic
  - id: ark.chaos_forge.sound.censer_burn.<n>  (3 censers)
    position: per censer
    sound: incense-burn crackle (continuous, -36 dB each)
    occlusion_behaviour: standard
    trigger: continuous (when burning)
  - id: ark.chaos_forge.sound.altar_offering_consumption
    position: per altar (state-conditional)
    sound: brief intense flame-roar (during offering consumption; -18 dB)
    occlusion_behaviour: standard
    trigger: state-conditional (per offering)
  - id: ark.chaos_forge.sound.priest_breath
    position: (0.00, 8.00, 1.40)  # at priest anchor
    sound: very faint slow breath (when priest present; -42 dB)
    occlusion_behaviour: omnidirectional
    trigger: state-conditional
reverb_zone:           IR-impulse: chaos_forge_v1.wav; wet-mix 32% (cathedral-industrial)
music_eligibility:     cutscene only (Hierarchy-arc ritual cutscenes; deferred catalogue)
voice_line_eligibility:
  - speaker: hierarchy_priest_chaos (named NPC; primary occupant Acts 5+): line set §2.23.2
  - speaker: chant_voices_distant (continuous ambient): proto-Latin Hierarchy chants
```

### A.23.9 Object inventory

Chaos Forge has 30 inventory objects.

#### A.23.9.1 The Central Chaos-Forge Fire

```
object_id:           ark.chaos_forge.central_forge
object_class:        interactive  (also fx_emitter — primary heat + light)
position:            (0.00, 5.50, 0.40)  # on raised brass dais
dimensions:          1.80 × 1.80 × 1.40 (forge body + dais; chimney rises above)
rotation:            0°
material_primary:    cast-iron forge body with brass dais (raised 0.40 m); firebrick interior; bronze regulating valves at sides
material_secondary:  bronze sigil-engraved rim (Hierarchy chaos-doctrine glyphs); bronze chain (decorative; 4 chains hang from dais)
colour_value:        --token-color-ark-chaos-forge-forge-iron
interaction:         interactable
  - operate: opens chaos-ritual UI (player initiates ritual; chooses category — confession / sacrifice / dedication / etc.)
  - inspect: lore-note about forge's history (canonical pre-Ark sacred artifact; the same forge that hosted Hierarchy founding-rituals)
narrative_role:      THE forge; central focal point; cosmologically the heart of the Hierarchy chaos-doctrine; player offerings consumed here
lore_anchor:         loredex.faction.hierarchy + arc.chaos_forge_rituals
art_status:          producer_handoff
gameplay_hook_id:    trpc.chaos_forge.forge.operate
wear_state:          well-used; soot-blackened; brass valves polished from use; centuries of patina
physical_constraints: collides; player can lean on dais (cosmetic)
```

#### A.23.9.2-4 Three Offering Altars (at 120° intervals around forge)

```
object_id:           ark.chaos_forge.altar.<n>  (3 altars: north, southeast, southwest)
positions:           [
  (0.00, 9.00, 0.00),                  # north altar (apse-aligned; largest)
  (3.03, 4.00, 0.00),                  # SE altar
  (-3.03, 4.00, 0.00),                 # SW altar
]
dimensions (each):   0.80 × 0.80 × 0.95
rotation (each):     varies (faces forge centre)
material_primary:    polished black granite with gold-leaf rim; gold-cross inlay top
material_secondary:  cast-bronze altar-cloth holder; cast-bronze candle-stand at corners
colour_value:        --token-color-ark-chaos-forge-altar-granite
interaction:         interactable
  - place_offering: player commits an offering (item from inventory); offering is consumed by forge with brief intense flame
  - inspect: lore-note about altar (each is dedicated to a different aspect — sacrifice / mercy / authority)
narrative_role:      ritual offering surfaces; player commits to Hierarchy chaos-doctrine here
lore_anchor:         arc.chaos_forge_rituals + arc.act_5_first_chaos_offering
art_status:          producer_handoff
gameplay_hook_id:    trpc.chaos_forge.altar.placeOffering
wear_state:          worn at the centre of each altar-top; gold-cross slightly polished
physical_constraints: collides
```

#### A.23.9.5-7 Three Censers (at 60° intervals between altars)

```
object_id:           ark.chaos_forge.censer.<n>  (3 censers)
positions:           [
  (1.75, 6.50, 0.00),                  # north-east censer
  (-1.75, 6.50, 0.00),                 # north-west censer
  (0.00, 3.00, 0.00),                  # south censer
]
dimensions (each):   0.40 × 0.40 × 1.40
rotation:            0°
material_primary:    cast bronze with hanging chains and decorative perforations; firebox interior
material_secondary:  bronze base; brass burner-bowl
colour_value:        --token-color-ark-chaos-forge-censer-bronze
interaction:         interactable
  - inspect: lore-note about each censer (carries different proto-Latin meditation)
  - rekindle: if censer has gone out, player can rekindle (gameplay-active in late-act if reactor degradation has affected sacred space)
narrative_role:      ritual incense; visually + olfactorily anchors the room's atmosphere; smoke rises through chimney
lore_anchor:         loredex.aesthetic.hierarchy_ritual
art_status:          producer_handoff
gameplay_hook_id:    trpc.chaos_forge.censer.rekindle
wear_state:          slight wear; soot-patinated
physical_constraints: collides
```

#### A.23.9.8 The Hierarchy Priest's Anchor (NPC anchor)

```
object_id:           ark.chaos_forge.priest_anchor
object_class:        npc_anchor
position:            (0.00, 8.00, 0.00)  # north of forge, between forge and north altar
dimensions:          0.80 × 0.80 × 1.80 (anchor)
rotation:            varies (NPC pose-driven)
material_primary:    n/a
material_secondary:  n/a
colour_value:        n/a
interaction:         n/a (NPC presence)
narrative_role:      Hierarchy Priest of Chaos (named NPC; rare physical presence) anchors here during major rituals
lore_anchor:         loredex.character.hierarchy_priest_chaos
art_status:          producer_handoff
gameplay_hook_id:    none (presence-driven)
wear_state:          n/a
physical_constraints: n/a (NPC overrides)
```

#### A.23.9.9 East Alcove — Ritual Robes Cabinet

```
object_id:           ark.chaos_forge.east.alcove.robes
object_class:        container
position:            (4.95, 5.50, 0.00)
dimensions:          1.20 × 0.80 × 3.50 (deep alcove)
rotation:            270°
material_primary:    charcoal stone backplane + bronze hanging-rods + brass nameplate
material_secondary:  6 ritual robes hanging (one per ritual category)
colour_value:        --token-color-ark-chaos-forge-alcove
interaction:         interactable
  - take_robe: player can equip ritual robe (per-category)
  - inspect: lore-note per robe
narrative_role:      ritual attire; required for advanced rituals
lore_anchor:         loredex.system.hierarchy_ritual_robes
art_status:          producer_handoff
gameplay_hook_id:    trpc.chaos_forge.alcove.east.takeRobe
wear_state:          slight wear at most-used robe positions
physical_constraints: collides
```

#### A.23.9.10 West Alcove — Ritual Tools Cabinet

```
object_id:           ark.chaos_forge.west.alcove.tools
object_class:        container
position:            (-4.95, 5.50, 0.00)
dimensions:          1.20 × 0.80 × 3.50
rotation:            90°
material_primary:    charcoal stone backplane + bronze tool-mounts
material_secondary:  8 ritual tools (chains, brand, censer-tongs, sacred bell, ritual blade, libation cup, sealing wax, prayer beads); bronze nameplates per tool
colour_value:        --token-color-ark-chaos-forge-alcove
interaction:         interactable
  - take_tool: player can equip ritual tool (gameplay-key for advanced rituals)
  - inspect: lore-note per tool
narrative_role:      ritual implements
lore_anchor:         loredex.system.hierarchy_ritual_tools
art_status:          producer_handoff
gameplay_hook_id:    trpc.chaos_forge.alcove.west.takeTool
wear_state:          slight wear at most-used tools
physical_constraints: collides
```

#### A.23.9.11-12 Two Bronze Candle Stands (east + west, south of alcoves)

```
object_id:           ark.chaos_forge.candle_stand.east, .west
object_class:        decoration  (also fx_emitter — flames)
positions:           (4.95, 1.50, 0.00), (-4.95, 1.50, 0.00)
dimensions (each):   0.30 × 0.30 × 0.40 (stand) + flames above
rotation:            varies
material_primary:    cast bronze stand
material_secondary:  3 ivory wax candles per stand
colour_value:        --token-color-ark-chaos-forge-candle-stand
interaction:         interactable
  - light_candles: light all 3 candles (one-shot per stand)
  - extinguish: extinguish
  - inspect: lore-note
narrative_role:      ritual candle-prep; symbolic of incoming ritual
lore_anchor:         loredex.aesthetic.hierarchy_ritual
art_status:          producer_handoff
gameplay_hook_id:    trpc.chaos_forge.candle_stand.toggle
wear_state:          slight wear at base
physical_constraints: collides
```

#### A.23.9.13 The Chaos Emblem Relief (north apse)

Specced in walls A.23.4. Inventoried for completeness.

```
object_id:           ark.chaos_forge.north.relief.chaos_emblem
object_class:        decoration
position:            (0.00, 10.95, 4.00)
dimensions:          1.40 × 0.40 × 0.10
rotation:            180°
material_primary:    cast bronze with heat-anodised gilt highlights
material_secondary:  none
colour_value:        --token-color-ark-chaos-forge-emblem-bronze
interaction:         inspectable
  - inspect: opens multi-screen lore about chaos-doctrine (3 screens)
narrative_role:      THE chaos emblem; visible from forge; sub-cosmology anchor
lore_anchor:         arc.hierarchy_chaos_doctrine
art_status:          producer_handoff
gameplay_hook_id:    trpc.chaos_forge.emblem.read
wear_state:          slight patina
physical_constraints: non-collide (at height)
```

#### A.23.9.14 The North Banner

```
object_id:           ark.chaos_forge.north.banner
object_class:        decoration
position:            (0.00, 10.85, 6.00)
dimensions:          1.00 × 0.05 × 1.50
rotation:            180°
material_primary:    deep crimson velvet with gold-thread embroidery
material_secondary:  bronze hanging-rod
colour_value:        --token-color-ark-chaos-forge-banner-crimson
interaction:         inspectable
  - inspect: reads embroidery — "CHAOS IS THE WAY"
narrative_role:      faction motto; visible from anywhere
lore_anchor:         loredex.faction.hierarchy
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          slight fading at edges
physical_constraints: non-collide (suspended)
```

#### A.23.9.15-20 Six Hanging Chandeliers

```
object_id:           ark.chaos_forge.chandelier.<n>  (6 chandeliers in hexagonal arrangement around chimney)
positions:           hex pattern at z = 5.50 around chimney centre at radius 2.20 m (per 60° interval)
dimensions (each):   0.80 × 0.80 × 1.20 (cluster)
rotation:            varies
material_primary:    cast bronze with hanging-chain
material_secondary:  amber-tinted glass shades; brass candle-cups (decorative; LED-simulated flames)
colour_value:        --token-color-ark-chaos-forge-chandelier
interaction:         inert
narrative_role:      principal cathedral-style ambient lighting; pulses with distant chants
lore_anchor:         loredex.aesthetic.hierarchy_ritual
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          slight patina
physical_constraints: non-collide (suspended)
```

#### A.23.9.21-25 Chimney + Slag Drains + Atmosphere

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.chaos_forge.chimney_internal` | fx_emitter | (0.00, 5.50, 7.00) | 1.20 dia × 7.00 m height | chimney shaft (visible upward; internal heat-glow emitter) |
| `ark.chaos_forge.slag_drain.east` (rolled floor) | decoration | (4.50, 5.50, 0.00) | 0.40 × 0.40 × 0.10 | bronze grate over slag drain |
| `ark.chaos_forge.slag_drain.west` (rolled floor) | decoration | (-4.50, 5.50, 0.00) | mirror | bronze grate |
| `ark.chaos_forge.slag_drain.north` (rolled floor) | decoration | (0.00, 9.00, 0.00) | 0.40 × 0.40 × 0.10 | bronze grate |
| `ark.chaos_forge.ritual_energy_emitter` | fx_emitter | suspended at z = 6.00 above forge | n/a (volumetric) | ritual-energy distortion source during invocations |

#### A.23.9.26-30 Closing Items + Decorative

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.chaos_forge.south.intercom` | console | (-1.50, 0.20, 1.50) | 0.20 × 0.10 × 0.30 | comms relay |
| `ark.chaos_forge.fire_extinguisher.south` | interactive | (1.50, 0.20, 1.20) | 0.20 × 0.20 × 0.50 | safety |
| `ark.chaos_forge.first_aid.kit.south` | container | (-2.50, 0.20, 1.50) | 0.40 × 0.10 × 0.30 | medical |
| `ark.chaos_forge.south.plaque.creed` (rolled walls) | decoration | (0.00, 0.20, 3.20) | 1.00 × 0.40 × 0.02 | "FORGE THE OFFERING / FORGE THE WORLD" |
| `ark.chaos_forge.compass_inlay.triple_axis` | decoration | (0.00, 5.50, 0.005) | 1.40 × 1.40 × 0.005 | floor 3-arm star inlay |

Total: 30 inventory objects.

### A.23.10 Camera-spawn-points (FPV cutscenes)

```
cutscene_id:         cs_amb_chaos_forge  (Category B; deferred catalogue)
camera_position:     (0.00, 0.50, eye_level)  # at threshold
camera_facing:       (0°, 5°, 0°)
avatar_height_anchor: eye_level
head_motion:         very slow walk into intense heat-shimmer; head turns to scan altars; pause; camera locks on chaos-emblem on north apse; lasts 22s

cutscene_id:         cs_first_chaos_offering  (Act 5 one-shot Hierarchy-aligned)
camera_position:     (0.00, 8.00, eye_level)  # at north altar
camera_facing:       (0°, -25°, 0°)
avatar_height_anchor: eye_level
head_motion:         hand enters frame placing offering; flame from forge consumes offering with white-hot flash; camera shake; lasts 14s

cutscene_id:         cs_chaos_invocation  (state-conditional; major rituals)
camera_position:     (0.00, 5.50, eye_level)  # at forge
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         locked at forge; deep low rumble; forge rises to white-hot; chimney glow intensifies; ritual-energy distortion visible
```

### A.23.11 Doorways

```
door_id:            ark.chaos_forge.south.door.main
connecting_space_id: ark.hierarchy_throne  (sub-chamber accessed through Throne's east aspect)
door_position:      (0.00, 0.00, 0.00)
door_dimensions:    1.40 × 2.40 × 0.10
door_class:         pressure_seal  (heat-isolation + faction-token authentication)
unlock_condition:   Act 5+ Hierarchy-aligned only
transit_animation:  airlock-cycle (3s); brief heat-equalisation
audio_signature:    pneumatic-hiss + magnetic-clack + heat-warmth-equalisation tone + faint chant-bleed
```

### A.23.12 Adjacency map

```
direct_adjacencies:
  - ark.hierarchy_throne (south door; parent ritual chamber)
one_hop_adjacencies:
  - hellbox.castle_of_death (via Hierarchy Throne; HB2 cosmology inherited for Hierarchy-aligned)
state_shared_with:
  - ark.hierarchy_throne (faction-alignment state shared)
  - hellbox.castle_of_death (chaos-offerings tracked across)
```

### A.23.13 Gameplay hooks

```
hooks:
  - hook_id:         chaos_forge.invokeForge
    trigger:         player.operate on central_forge
    procedure:       trpc.chaos_forge.forge.operate
    success_state:   chaos_ritual_active = true
  - hook_id:         chaos_forge.placeOffering
    trigger:         player.interact on altar.<n> with offering item
    procedure:       trpc.chaos_forge.altar.placeOffering
    success_state:   offering_consumed = true (per-altar; per-offering)
  - hook_id:         chaos_forge.equipRitualRobe
    trigger:         player.take on east.alcove.robes
    procedure:       trpc.chaos_forge.alcove.east.takeRobe
    success_state:   robe_equipped = true
  - hook_id:         chaos_forge.equipRitualTool
    trigger:         player.take on west.alcove.tools
    procedure:       trpc.chaos_forge.alcove.west.takeTool
    success_state:   tool_equipped = true
  - hook_id:         chaos_forge.lightCandles
    trigger:         player.interact on candle_stand.<wall>
    procedure:       trpc.chaos_forge.candle_stand.toggle
    success_state:   candle_state = lit | extinguished (per-stand)
  - hook_id:         chaos_forge.rekindleCenser
    trigger:         (state-conditional) player.interact on extinguished censer.<n>
    procedure:       trpc.chaos_forge.censer.rekindle
    success_state:   censer_relit = true
  - hook_id:         chaos_forge.readEmblem
    trigger:         player.inspect on north.relief.chaos_emblem
    procedure:       trpc.chaos_forge.emblem.read
    success_state:   emblem_read = true (lore-flag)
```

### A.23.14 Story-tie

```
primary_arcs:
  - arc.act_5_first_chaos_offering
  - arc.chaos_forge_rituals (continuous Acts 5-7)
  - arc.hierarchy_chaos_doctrine
  - arc.act_6_deep_chaos_invocation (advanced ritual unlock)
per_act_evolution:
  acts_0_4: room locked + invisible (sub-chamber of HB2 host; only Hierarchy-aligned players can find it)
  act_5: room unlocks for Hierarchy-aligned players; first chaos-offering ritual; basic robes + tools accessible
  act_6: deep-invocation rituals unlock (player can perform major chaos-rituals); chaos-emblem reveals deeper lore
  act_7: state-branched: chaos-master ending (Hierarchy fully invoked; forge perpetually white-hot; player has performed major rituals) vs. faction-distant ending (forge cold; censers extinguished; sub-chamber barely-touched)
npc_roster:
  - the_hierarchy_priest_chaos: named NPC; primary occupant; rare physical presence Acts 5+
  - the_player: ritual participant
  - chant_voices_distant: ambient atmosphere only (proto-Latin)
  - the_master_of_rlyeh: not present here; HB2 cosmology is parent
readables:
  - creed plaque (south)
  - chaos-doctrine relief (south, multi-panel)
  - chaos-emblem relief (north; deep lore; 3-screen multi-readable)
  - banner ("CHAOS IS THE WAY")
  - 6 robe descriptions (per-category)
  - 8 tool descriptions (per-tool)
  - 3 altar dedications (per-aspect)
  - 3 censer meditations (proto-Latin)
master_of_rlyeh_question: n/a (sub-chamber of HB2 host; cosmology inherited via Hierarchy-aligned player path; "Is mercy a debt, or a gift?")
```

### A.23.15 Special-FX

```
particle_systems:
  - incense_smoke (high during ritual; rises through chimney)
  - forge_smoke (medium during active forge)
  - ember (low; sparks from forge during active states)
  - ritual_energy_motes (state-conditional; gold-amber spirals during invocations)
  - ash_drift (very low; cosmetic; suggests "sacred residue")
volumetric_effects:
  - forge_volumetric_glow (radial from forge fire)
  - chimney_internal_volumetric_beam (vertical light shaft up through chimney)
  - heat_shimmer_envelope (above forge; warps light slightly)
  - ritual_energy_distortion (state-conditional; volumetric warp during invocations)
  - chandelier_volumetric_aura (warm amber glow per chandelier)
procedural_animations:
  - forge_fire_dance (continuous; flame motion; varies with intensity)
  - chandelier_pulse_with_chants (matches distant chant rhythm)
  - censer_smoke_rise (continuous emission)
  - chimney_smoke_ascent (smoke columns visibly rise)
  - banner_subtle_ripple (faint air convection)
  - bell_toll_visualisation (subtle pulse radiates from apse during toll)
reactive_systems:
  - forge_intensify_on_offering (one-shot per offering)
  - altar_glow_on_proximity (within 1.5 m, altar gold-cross brightens 20%)
  - chaos_invocation_one_shot (during major rituals)
  - chimney_glow_pulse_with_forge (synchronised)
  - state_branched_warmth_in_act_7 (full rituals = full warmth; neglect = cold)
```

### A.23.16 Avatar-parametricity

```
camera_height_variation:
  small_xenomorph (0.85m eye): camera height 0.85m; forge feels enormous; alternate kneel-at-altar posture
  short_humanoid (1.40m eye): standard short scale
  average_humanoid (1.70m eye): standard
  tall_humanoid (2.05m eye): comfortable; chandeliers at near-head level
  tall_xenomorph (2.70m eye): chimney at head; alternate route around forge
reachability:
  small_xenomorph: cannot reach top of robes alcove; alternate ladder
  small_xenomorph: cannot reach top of tools alcove; alternate
  small_xenomorph: cannot reach chaos-emblem inspect-zone; relay-inspect from below
  others: all-reachable
audio_occlusion_variation:
  xenomorph_sensitive_hearing: forge-roar overwhelming during rituals; chants more pronounced
  synthetic_voice_avatar: heat-effects perceived differently; chant-resonance has different "feel"
```

### A.23.17 Performance

```
polygon_budget:      280,000 polygons (rich industrial-cathedral detail; forge fire shader is expensive)
texture_budget:      170 MB total
light_count_limit:   18 simultaneous dynamic lights (chandeliers + altar uplights + forge glow)
lod_plan:
  - hero_distance: 0-10m, full detail
  - mid_distance: 10-22m, mid detail (chandeliers simplified to billboards; small decor culled)
  - low_distance: 22m+, low detail
streaming_behaviour:
  - preload: ark.hierarchy_throne (south door; parent room)
  - on_chaos_invocation: preload destination.castle_of_death (HB2 cross-ref via Hierarchy)
```

---

## A.24 Elemental Nexus (Demagi alignment) — FULL

**Status: FULL spec.** Cross-ref `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.24 (art-state prompts).

### A.24.1 Header

```
space_id:        ark.elemental_nexus
space_name:      Elemental Nexus (D10 Demagi alignment)
space_type:      ark_room  (Demagi sub-sanctum; D10-deck)
act_introduced:  Act 6 (Demagi-aligned only)
lore_anchor:     loredex.faction.demagi + arc.elemental_attunement + arc.act_6_first_attunement
aesthetic_tier:  dreamers_oneiric  (elemental-weave aesthetic; the four classical elements expressed as architectural alcoves)
```

### A.24.2 Geometry

```
dimensions:           12.00 m × 12.00 m × 6.00 m  (bounding box; hexagonal footprint inscribed)
origin_point:         centre of floor (room is hexagonal; origin at geometric centre)
coordinate_axes:      +x = right, +y = forward (north), +z = up
floor_plan_geometry:  hexagonal  (6.00 m apothem; primary entrance at south face)
volumetric_anomalies: subtle elemental-weave distortion at central plinth (1.20× perceptual; the four elements appear to "bleed into" each other)
```

The Elemental Nexus is hexagonal — six walls, four of which house
elemental alcoves (north = water, east = fire, south-east = earth,
south-west = air; the entrance face at south + the south-southwest
face are non-elemental). Central plinth holds the elemental-weave
focus (a stylised glass orb suspending all four elements in
contained chaos). Demagi-aligned players come here to attune to
specific elements — gameplay-key for late-act Demagi spells.

Floor area: ~187 m².

### A.24.3 Floor

```
material_primary:     polished obsidian-black marble in radial wedge tiles emanating from central plinth; 6 wedges (one per hexagonal face); each wedge tinted with elemental colour (water = pale-cyan, fire = warm-amber, earth = deep-emerald, air = pale-silver, neutral = dark-grey)
material_secondary:   gold inlay forming an elemental-circle around plinth (4 m diameter); brass perimeter trim along curved hex wall
pattern:              radial wedges + elemental-circle inlay; subtle four-element symbology visible in floor markings
wear_state:           pristine (sacred); slight wear at most-used elemental-alcove approach (varies per player attunement)
embedded_features:
  - id: ark.elemental_nexus.floor.charge_point.plinth
    position: (0.00, 0.00, 0.00)  # at room centre
    dimensions: 0.40 × 0.40 × 0.05
    function: plinth power + elemental-weave projection
  - id: ark.elemental_nexus.floor.elemental_anchor.<element>  (4 anchors at hex corners aligned with elemental alcoves)
    position: per element (north, east, SE, SW)
    dimensions: 0.30 × 0.30 × 0.05 each
    function: alcove resonance
  - id: ark.elemental_nexus.floor.purification_drain
    position: (0.00, -5.20, 0.00)  # at south entrance
    dimensions: 0.20 × 0.20 × 0.10
    function: ritual purification drain (used during attunement-cleansing)
acoustic_property:    hard_reflective with elemental-resonance overlay; RT60 = 0.55s with chaos-resonance cross-talk between elemental zones
```

### A.24.4 Walls

The Elemental Nexus has 6 walls (hexagonal). Four house elemental
alcoves; one is the entrance; one is the entrance-adjacent
non-elemental face. Each wall specced separately.

#### Wall: South (entrance — non-elemental)

```
wall_id:              south
material_primary:     polished obsidian-black marble cladding with gold-leaf trim; the only non-elemental wall (besides SSW)
material_secondary:   gold dado at z = 1.20 m
panelisation:         single curved hexagonal face
colour_value:         --token-color-ark-elemental-nexus-wall-south  (deep obsidian + gold)
embedded_displays:
  - id: ark.elemental_nexus.south.display.attunement_status
    position: (0.00, -5.95, 1.80)
    dimensions: 1.00 × 0.80 × 0.05
    content: live player-attunement status (4 elements + master-balance)
embedded_doors:
  - door_id: ark.elemental_nexus.south.door.main
    position: (0.00, -6.00, 0.00)
    dimensions: 1.40 × 2.40 × 0.10
    door_class: arch  (gold-inlaid bronze; opens with hush of elemental-shimmer)
    connecting_space_id: ark.corridor.demagi_approach
    unlock_condition: Act 6+ Demagi-aligned
decorative_features:
  - id: ark.elemental_nexus.south.plaque.principle
    position: (0.00, -5.95, 3.20)
    dimensions: 0.80 × 0.30 × 0.02
    material: cast bronze with gilt text
    narrative_role: reads "ATTUNE OR BE ATTUNED"
```

#### Wall: North (water alcove)

```
wall_id:              north_water
material_primary:     polished marble with deep alcove for water-elemental focus; alcove backplane is mirror-finish (suggests water-surface)
material_secondary:   gold-leaf rim around alcove; bronze trim
panelisation:         hexagonal face with central alcove recess
colour_value:         --token-color-ark-elemental-nexus-water  (pale cyan with silver accents)
embedded_displays:    none (alcove is content)
embedded_doors:        none
decorative_features:
  - id: ark.elemental_nexus.north.alcove.water
    position: (0.00, 5.95, 0.00)
    dimensions: 1.40 × 0.80 × 4.20 (deep alcove)
    material: mirror-finish marble + water-feature within (small contained pool)
    narrative_role: water-attunement zone; player can dip hand for water-element bond
  - id: ark.elemental_nexus.north.alcove.water.scrying_pool
    position: (0.00, 5.95, 0.40)
    dimensions: 0.60 × 0.40 × 0.40 (small contained pool)
    material: bronze basin + clear water with cyan luminescence
    narrative_role: water-element focal point
```

#### Wall: East (fire alcove)

```
wall_id:              east_fire
material_primary:     polished marble with deep alcove for fire-elemental focus; alcove backplane is heat-resistant cast iron
material_secondary:   gold-leaf rim; bronze trim with fire-resistant coating
panelisation:         hexagonal face
colour_value:         --token-color-ark-elemental-nexus-fire  (warm amber with deep-orange accents)
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: ark.elemental_nexus.east.alcove.fire
    position: (5.20, 2.95, 0.00)
    dimensions: 1.40 × 0.80 × 4.20
    material: cast-iron backplane + bronze brazier with eternal flame
    narrative_role: fire-attunement zone; player can pass hand near flame for fire-element bond
  - id: ark.elemental_nexus.east.alcove.fire.brazier
    position: (5.20, 2.95, 0.85)
    dimensions: 0.40 × 0.40 × 0.50
    material: cast bronze brazier with continuous flame
    narrative_role: fire-element focal point
```

#### Wall: South-East (earth alcove)

```
wall_id:              southeast_earth
material_primary:     polished marble with deep alcove for earth-elemental focus
material_secondary:   gold-leaf rim; bronze trim with earthy-patina
panelisation:         hexagonal face
colour_value:         --token-color-ark-elemental-nexus-earth  (deep emerald + bronze)
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: ark.elemental_nexus.southeast.alcove.earth
    position: (5.20, -2.95, 0.00)
    dimensions: 1.40 × 0.80 × 4.20
    material: marble backplane + earth-element altar
    narrative_role: earth-attunement zone
  - id: ark.elemental_nexus.southeast.alcove.earth.altar
    position: (5.20, -2.95, 0.85)
    dimensions: 0.40 × 0.40 × 0.50
    material: cast bronze altar with bowl of soil + crystal-cluster + small green fern
    narrative_role: earth-element focal point
```

#### Wall: South-West (air alcove)

```
wall_id:              southwest_air
material_primary:     polished marble with deep alcove for air-elemental focus; alcove backplane has subtle wind-aperture
material_secondary:   gold-leaf rim; bronze trim
panelisation:         hexagonal face
colour_value:         --token-color-ark-elemental-nexus-air  (pale silver + sky-blue accents)
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: ark.elemental_nexus.southwest.alcove.air
    position: (-5.20, -2.95, 0.00)
    dimensions: 1.40 × 0.80 × 4.20
    material: marble backplane with subtle wind-aperture (continuous gentle breeze)
    narrative_role: air-attunement zone
  - id: ark.elemental_nexus.southwest.alcove.air.bell_chime
    position: (-5.20, -2.95, 1.80)
    dimensions: 0.30 × 0.30 × 0.40
    material: bronze chime cluster (5 small bells suspended in vertical arrangement)
    narrative_role: air-element focal point; rings when wind passes (continuous subtle music)
```

#### Wall: West-Northwest (south-southwest non-elemental)

```
wall_id:              ssw  (south-southwest; non-elemental balance face)
material_primary:     polished obsidian-black marble (matches south)
material_secondary:   gold dado
panelisation:         single curved hexagonal face
colour_value:         --token-color-ark-elemental-nexus-wall-ssw  (deep obsidian + gold)
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: ark.elemental_nexus.ssw.relief.balance
    position: (-3.00, -5.20, 2.40)
    dimensions: 0.80 × 0.60 × 0.10
    material: cast bronze with deep relief (depicts a figure balancing all four elements simultaneously)
    narrative_role: master-balance ideal; visible from plinth perspective
```

### A.24.5 Ceiling

```
height_above_floor:     6.00 m baseline; central oculus rises to 7.50 m above plinth
material:               polished obsidian-black marble with gold-leaf coffer pattern radiating from oculus; central dome is partially transparent (lets cosmic-glow through)
lighting_integrated:    central oculus emits balanced four-elemental-glow; 4 alcove ceiling-strips define elemental zones; subtle gold-edge lighting along all 6 hex pilaster tops
atmospheric_features:   visible elemental-motes drift continuously (cosmetic; each elemental-mote tinted to its alcove)
acoustic_treatment:     domed apsidal (slight whisper-gallery from hexagonal geometry); supports elemental-resonance harmonic
```

### A.24.6 Lighting

```
ambient_baseline:     3000 K (warm-elemental; balanced); 140 lux at floor (intentionally dim — gravity); CRI 90
direct_fixtures:
  - id: ark.elemental_nexus.light.oculus_central
    position: (0.00, 0.00, 7.50)
    beam_angle: 60° downward
    colour: --token-color-ark-elemental-nexus-oculus  (variable; matches player's strongest attunement; balanced cyan-amber-emerald-silver baseline)
    intensity: 4000 lumens (pulses at deep cosmic rhythm)
    function: principal — illuminates plinth
  - id: ark.elemental_nexus.light.alcove_water_strip
    position: at top of north alcove at z = 4.00
    beam_angle: 180° wash
    colour: --token-color-ark-elemental-nexus-water  (pale cyan)
    intensity: 800 lumens
    function: water-zone definition
  - id: ark.elemental_nexus.light.alcove_fire_glow
    position: at fire brazier
    beam_angle: 360°
    colour: warm amber-orange
    intensity: 1200 lumens (continuous flame)
    function: fire-zone illumination
  - id: ark.elemental_nexus.light.alcove_earth_strip
    position: at top of SE alcove
    beam_angle: 180° wash
    colour: deep emerald
    intensity: 800 lumens
    function: earth-zone definition
  - id: ark.elemental_nexus.light.alcove_air_strip
    position: at top of SW alcove
    beam_angle: 180° wash
    colour: pale silver
    intensity: 800 lumens
    function: air-zone definition
practical_sources:
  - id: ark.elemental_nexus.plinth_glow
    position: (0.00, 0.00, 1.10)  # at plinth orb
    intensity: 600 lumens (variable; matches elemental balance)
    flicker_pattern: pulses with cosmic rhythm
  - id: ark.elemental_nexus.candle_array.<element>  (4 small candle clusters; one per alcove base)
    position: per alcove
    intensity: 50 lumens each
    flicker_pattern: organic per element
time_of_day_variation:
  acts_6_to_7: stable; in late-act7, oculus colour reflects player's dominant attunement
dynamic_response:
  - on_player_at_alcove: that-element's strip + practicals intensify 30%
  - on_attunement_initiated: oculus pulses with that element; plinth orb shifts colour
  - on_master_balance: all four alcoves activate simultaneously; oculus shows perfect-balance prism
```

### A.24.7 Atmosphere

```
air_temperature:    21°C (warm-balanced; slight variation per zone — water cooler, fire warmer)
humidity:           50% RH; smells of mineral water (water alcove) + wood-smoke (fire alcove) + damp earth (earth alcove) + ozone (air alcove)
particulate:
  - water_motes: low (cosmetic; cyan motes drift from water alcove)
  - fire_motes: low (cosmetic; ember-orange motes from fire alcove)
  - earth_motes: low (cosmetic; deep-emerald motes from earth alcove)
  - air_motes: low (cosmetic; pale-silver motes from air alcove)
volumetric_fog:     subtle haze at upper volume (0.05 g/m³, balanced-warm); intensifies during attunements
wind_drift:         minimal at room centre; faint elemental-specific drifts at each alcove
smell_canon:        mineral water + wood-smoke + damp earth + ozone; voice-line: "smells like the world's elements remembered"
```

### A.24.8 Sound

```
ambient_bed:           file: elemental_nexus_ambient_bed_v1.ogg (loop); -34 dB; faint elemental harmonics (4-element chord), water-trickle from north, gentle flame-crackle from east, distant earth-resonance from SE, subtle wind-bell-chimes from SW
point_sources:
  - sound.water_trickle: at water alcove; -32 dB; continuous
  - sound.flame_crackle: at fire alcove; -30 dB; continuous
  - sound.earth_resonance: at earth alcove; -34 dB; continuous (deep low harmonic)
  - sound.air_bell_chime: at air alcove; -32 dB; cyclic (period 5-15s; bells ring as wind passes)
  - sound.plinth_orb_subtle_hum: at plinth; -36 dB; continuous
  - sound.elemental_balance_chord: distributed (when balanced); -38 dB
reverb_zone:           IR-impulse: elemental_nexus_v1.wav; wet-mix 28% (long; with elemental cross-talk)
music_eligibility:     cutscene only (Demagi-arc attunement cutscenes; deferred catalogue)
voice_line_eligibility:
  - speaker: the_demagi_master (named NPC; rare presence Acts 6+): line set §2.24.2
  - speaker: elemental_voices: rare whispers (one per element)
```

### A.24.9 Object inventory (compact catalogue)

Elemental Nexus has 28 inventory objects.

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.elemental_nexus.central_plinth` | interactive | (0.00, 0.00, 0.00) | 1.20 dia × 1.10 | central plinth holding elemental-weave orb |
| `ark.elemental_nexus.elemental_orb` | interactive | on plinth | 0.40 dia | glass orb suspending all 4 elements; HB-like attunement gateway |
| `ark.elemental_nexus.alcove.water` | container | (0.00, 5.95, 0.00) | 1.40×0.80×4.20 | water alcove |
| `ark.elemental_nexus.alcove.water.scrying_pool` | interactive | (0.00, 5.95, 0.40) | 0.60×0.40×0.40 | water-element pool |
| `ark.elemental_nexus.alcove.fire` | container | (5.20, 2.95, 0.00) | 1.40×0.80×4.20 | fire alcove |
| `ark.elemental_nexus.alcove.fire.brazier` | interactive | (5.20, 2.95, 0.85) | 0.40×0.40×0.50 | eternal flame brazier |
| `ark.elemental_nexus.alcove.earth` | container | (5.20, -2.95, 0.00) | 1.40×0.80×4.20 | earth alcove |
| `ark.elemental_nexus.alcove.earth.altar` | interactive | (5.20, -2.95, 0.85) | 0.40×0.40×0.50 | earth-element altar (soil + crystal + fern) |
| `ark.elemental_nexus.alcove.air` | container | (-5.20, -2.95, 0.00) | 1.40×0.80×4.20 | air alcove |
| `ark.elemental_nexus.alcove.air.bell_chime` | interactive | (-5.20, -2.95, 1.80) | 0.30×0.30×0.40 | air-element bell-chime cluster |
| `ark.elemental_nexus.candle_array.<element>` (4) | interactive | per alcove base | 0.20×0.30×0.30 each | per-element candle clusters |
| `ark.elemental_nexus.demagi_master_anchor` | npc_anchor | (0.00, 2.50, 0.00) | 0.8×0.8×1.8 | Demagi Master NPC anchor |
| `ark.elemental_nexus.observation_bench.<n>` (3) | furniture | between alcoves; radius 4.00 m | 1.00×0.40×0.45 each | curved hex benches |
| `ark.elemental_nexus.demagi_lectern` | container | (-3.00, -3.00, 0.00) | 0.40×0.30×1.20 | Demagi attunement-tome |
| `ark.elemental_nexus.south.intercom` | console | (-1.00, -5.95, 1.50) | 0.20×0.10×0.30 | comms |
| `ark.elemental_nexus.fire_extinguisher.south` | interactive | (1.00, -5.95, 1.20) | 0.20×0.20×0.50 | safety |
| `ark.elemental_nexus.first_aid.kit.south` | container | (-2.00, -5.95, 1.50) | 0.40×0.10×0.30 | medical |
| `ark.elemental_nexus.south.plaque.principle` | decoration | (0.00, -5.95, 3.20) | 0.80×0.30×0.02 | "ATTUNE OR BE ATTUNED" |
| `ark.elemental_nexus.ssw.relief.balance` | decoration | (-3.00, -5.20, 2.40) | 0.80×0.60×0.10 | master-balance relief |
| `ark.elemental_nexus.compass_inlay` | decoration | (0.00, 0.00, 0.005) | 1.40×1.40×0.005 | floor elemental-circle inlay |
| `ark.elemental_nexus.elemental_motes_emitter` | fx_emitter | distributed | n/a | per-element mote source |

Total: 28 inventory objects.

### A.24.10-17 Compact

```
camera_spawn_points:
  cs_amb_elemental_nexus (Cat B): POV at threshold; slow walk to plinth; head pans across 4 elemental alcoves; 22s
  cs_first_attunement (Act 6 one-shot): POV at chosen alcove; hand enters frame to touch element; bond ritual

doorways: south.door.main → ark.corridor.demagi_approach; arch; Act 6+ Demagi-aligned

adjacency: direct ark.corridor.demagi_approach (south); one_hop ark.observation_deck (cosmic kinship)

gameplay_hooks:
  - attune_to_element: trpc.elemental_nexus.alcove.attune (per-element)
  - inspect_orb: trpc.elemental_nexus.orb.inspect
  - readDemagiLectern: trpc.elemental_nexus.lectern.read
  - lightCandle: trpc.elemental_nexus.candle.light (per-element)

story_tie:
  primary_arcs: act_6_first_attunement; elemental_attunement; demagi_master_arc; act_7_master_balance
  per_act:
    acts_0_5: locked
    act_6: opens for Demagi-aligned; first attunement to one element
    act_7: state-branched: master-balance ending (all 4 attuned) vs. dominant-element ending (one attuned strongly) vs. unattuned ending (room cold)
  npc_roster: the_demagi_master (rare presence); the_player; elemental_voices (rare whispers)
  readables: principle plaque; balance relief; demagi lectern (multi-screen); 4 alcove inscriptions
  master_of_rlyeh_question: n/a

special_fx:
  particle_systems: 4 elemental_motes (water/fire/earth/air); plinth_orb_motes; balance_motes (when 4-balanced)
  volumetric: oculus_volumetric_glow (variable colour); 4 alcove_glow_per_element; plinth_radiance
  procedural_animations: orb_continuous_rotation (slow); flame_dance (fire); water_ripple (water); fern_subtle_sway (earth); bell_chime_breeze (air); elemental_motes_drift_per_alcove
  reactive_systems: alcove_intensify_on_proximity; orb_colour_shift_on_attunement; oculus_balance_visualisation (4-balance state); master_balance_one_shot (Act 7 unlock)

avatar_parametricity: small_xenomorph: alternate kneel-at-alcove for low elements; others all-reachable
audio_occlusion: xenomorph: elemental harmonic chord more pronounced
performance: polygon_budget 250,000 / texture_budget 150 MB / light_count 16
streaming: preload demagi_approach corridor; on_master_balance: unlock late-Demagi sub-content
```

---

## A.25 Quantum Lab / Probability Chamber (Quarchon alignment) — FULL

**Status: FULL spec.** Cross-ref `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.25 (art-state prompts).

### A.25.1 Header

```
space_id:        ark.quantum_lab
space_name:      Quantum Lab / Probability Chamber (D10 Quarchon alignment)
space_type:      ark_room  (Quarchon sub-sanctum; D10-deck)
act_introduced:  Act 6 (Quarchon-aligned only)
lore_anchor:     loredex.faction.quarchon + arc.probability_manipulation + arc.act_6_first_calibration
aesthetic_tier:  architect_geometric  (precise-mathematical; the most cerebrally-rigorous space on the Ark)
```

### A.25.2 Geometry

```
dimensions:           11.00 m × 11.00 m × 5.00 m
origin_point:         centre of floor at south entrance threshold
coordinate_axes:      +x = right, +y = forward (north), +z = up
floor_plan_geometry:  rectangular  (with central cylindrical probability-engine; 4 probability-output stations at cardinals)
volumetric_anomalies: subtle reality-flicker around probability-engine during active calibrations (1.05× perceptual; matter shimmers between alternate states)
```

The Quantum Lab is square, mathematical, intentionally cool. Central
cylindrical probability-engine (1.20 m dia × 3.50 m tall) projects
quantum-state holograms upward. Four probability-output stations
arranged at cardinals (N, E, S, W) around the engine for player
queries. Walls hold theorem displays + reference equations + the
Quarchon's calibration-tools cabinet. North wall contains the
"Equation of Equations" — a continuously-evolving formula that
recalibrates with each Quarchon decision.

Floor area: 121 m².

### A.25.3 Floor

```
material_primary:     polished black-and-white marble in alternating tile pattern (precise grid; no chevron); 0.50 m × 0.50 m tiles laid as a perfect 22 × 22 chessboard
material_secondary:   gold inlay forming a probability-curve (continuous bell-curve) running along the cardinal axes from engine; brass perimeter trim
pattern:              chessboard grid + central engine-zone with probability-curves
wear_state:           pristine (Quarchon meticulous); slight wear-trail to engine + each station; in late-act7, scuff-marks at most-used station (tracks player's probability-query patterns)
embedded_features:
  - id: ark.quantum_lab.floor.charge_point.engine
    position: (0.00, 5.50, 0.00)  # under engine
    dimensions: 0.40 × 0.40 × 0.05
    function: probability-engine power
  - id: ark.quantum_lab.floor.station_anchor.<cardinal>  (4 anchors at N/E/S/W)
    position: per station; radius 3.00 m from engine
    dimensions: 0.30 × 0.30 × 0.05 each
    function: per-station electronics
  - id: ark.quantum_lab.floor.calibration_grate.engine_base
    position: (0.00, 5.50, 0.00) (concentric ring around engine base)
    dimensions: 1.60 dia ring (0.20 m wide; 0.05 m height)
    function: engine cooling + waste-probability dissipation
acoustic_property:    hard_reflective (marble); RT60 = 0.45s (intentional; supports voice clarity for theorem recitation)
```

### A.25.4 Walls

#### Wall: South (entrance)

```
wall_id:              south
material_primary:     polished black marble cladding with engraved theorems at z = 1.20 to 4.00 (depicts Quarchon canonical probability theorems in proto-mathematical script)
material_secondary:   gold dado at z = 1.20 m
panelisation:         standard
colour_value:         --token-color-ark-quantum-lab-wall-south  (deep black with gold + cyan accent)
embedded_displays:
  - id: ark.quantum_lab.south.display.calibration_status
    position: (-3.00, 0.20, 1.80)
    dimensions: 1.00 × 0.80 × 0.05
    content: live engine calibration + last-query results
  - id: ark.quantum_lab.south.display.theorem_index
    position: (3.00, 0.20, 1.80)
    dimensions: 1.00 × 0.80 × 0.05
    content: index of canonical Quarchon theorems
embedded_doors:
  - door_id: ark.quantum_lab.south.door.main
    position: (0.00, 0.00, 0.00)
    dimensions: 1.40 × 2.40 × 0.10
    door_class: pressure_seal  (precision-controlled atmosphere)
    connecting_space_id: ark.corridor.quarchon_approach
    unlock_condition: Act 6+ Quarchon-aligned
decorative_features:
  - id: ark.quantum_lab.south.plaque.principle
    position: (0.00, 0.20, 3.20)
    dimensions: 0.80 × 0.30 × 0.02
    material: cast bronze with gilt text
    narrative_role: reads "PROBABILITY IS THE KIND OF TRUTH"
  - id: ark.quantum_lab.south.relief.theorems
    position: (0.00, 0.20, 4.00)
    dimensions: 4.00 × 0.40 × 0.10
    material: cast bronze with proto-mathematical script (Quarchon theorems)
    narrative_role: depicts the 7 canonical theorems; player can inspect each
```

#### Wall: East (probability-output station 1 + tools cabinet)

```
wall_id:              east
material_primary:     polished black marble with gold-leaf detail; cabinet recessed at south end
material_secondary:   gold dado
panelisation:         alcove + standard wall
colour_value:         --token-color-ark-quantum-lab-wall-east
embedded_displays:
  - id: ark.quantum_lab.east.display.theorem_active
    position: (4.95, 5.50, 2.00)
    dimensions: 1.20 × 0.80 × 0.05
    content: currently-active theorem (varies by player calibration)
embedded_doors:        none
decorative_features:
  - id: ark.quantum_lab.east.calibration_tools_cabinet
    position: (4.95, 1.50, 0.00)
    dimensions: 0.40 × 4.00 × 2.40
    material: brushed-titanium cabinet with bronze handles + biometric lock
    narrative_role: holds Quarchon calibration tools (8 instruments — phase-meter, probability-tongs, theorem-key, equation-press, calibration-stone, paradox-stabiliser, certainty-mirror, doubt-cube)
```

#### Wall: North (Equation of Equations — the room's symbolic apex)

```
wall_id:              north
material_primary:     polished black marble with full-wall integrated display panel (z = 0.50 to 4.50); the Equation of Equations runs continuously across this surface
material_secondary:   gold-leaf frame around display; bronze trim
panelisation:         single integrated display
colour_value:         --token-color-ark-quantum-lab-wall-north
embedded_displays:
  - id: ark.quantum_lab.north.display.equation_of_equations
    position: (0.00, 10.95, 2.50)
    dimensions: 6.00 × 4.00 × 0.05
    content: THE Equation; continuously evolves as the canonical Quarchon master-equation; recalibrates with each Quarchon faction decision player makes
embedded_doors:        none
decorative_features:
  - id: ark.quantum_lab.north.relief.first_calibration
    position: (0.00, 10.85, 4.80)  # high above equation display
    dimensions: 1.20 × 0.40 × 0.10
    material: cast bronze with deep relief
    narrative_role: depicts the canonical first calibration ritual; lore-readable
```

#### Wall: West (probability-output station 2 + reference cabinet; mirror of east)

```
wall_id:              west
material_primary:     same as east
material_secondary:   gold dado
panelisation:         standard
colour_value:         --token-color-ark-quantum-lab-wall-west
embedded_displays:
  - id: ark.quantum_lab.west.display.outcome_log
    position: (0.05, 5.50, 2.00)
    dimensions: 1.20 × 0.80 × 0.05
    content: outcome log of all probability-queries player has run
embedded_doors:        none
decorative_features:
  - id: ark.quantum_lab.west.reference_cabinet
    position: (0.05, 1.50, 0.00)
    dimensions: 0.40 × 4.00 × 2.40
    material: brushed-titanium cabinet
    narrative_role: holds reference materials (theorem proofs, alternate-state archives, paradox-resolution journals)
```

### A.25.5 Ceiling

```
height_above_floor:     5.00 m baseline; central oculus rises to 6.20 m above probability-engine
material:               polished black marble with gold-leaf coffer pattern radiating from oculus; central dome partially transparent (lets quantum-shimmer through)
lighting_integrated:    central oculus emits cool-cyan probability-light; 4 station accent strips define each cardinal; subtle gold-edge lighting along all edges
atmospheric_features:   subtle quantum-shimmer at upper volume (cosmetic; suggests "uncertain matter"); intensifies during calibrations
acoustic_treatment:     coffered + minimal whisper-gallery effect
```

### A.25.6 Lighting

```
ambient_baseline:     5500 K (cool-clinical; precision-mathematical); 280 lux at floor level (precision required); CRI 95
direct_fixtures:
  - id: ark.quantum_lab.light.oculus_central
    position: (0.00, 5.50, 6.20)
    beam_angle: 60° downward
    colour: --token-color-ark-quantum-lab-oculus  (cool cyan; varies during calibrations)
    intensity: 5000 lumens (pulses with engine rhythm)
    function: principal illumination of probability-engine
  - id: ark.quantum_lab.light.station_strip.<cardinal>  (4 strips; one per cardinal station)
    position: above each station at z = 4.20
    beam_angle: 90° downward
    colour: --token-color-ark-quantum-lab-station-strip  (cool cyan-white)
    intensity: 1000 lumens each
    function: station-specific task lighting
  - id: ark.quantum_lab.light.equation_uplight.north
    position: along base of north wall display at z = 0.05
    beam_angle: 30° upward
    colour: --token-color-ark-quantum-lab-equation-uplight  (cool cyan with gold accents)
    intensity: 1200 lumens per metre
    function: dramatic backlighting for Equation of Equations
practical_sources:
  - id: ark.quantum_lab.engine_hologram_glow
    position: (0.00, 5.50, 1.10 to 4.50)  # along engine height
    intensity: 2000 lumens (variable; quantum-state hologram colours)
    flicker_pattern: pulses with calibration rhythm
  - id: ark.quantum_lab.station_indicator_light.<cardinal>  (4 emitters)
    position: per station console
    intensity: 60 lumens (varies — green for stable; amber for uncertain; red for paradox)
    flicker_pattern: stable
time_of_day_variation:
  acts_6_to_7: stable cool baseline; in late-act7, oculus colour reflects state-branched ending (mastery vs. neglect)
dynamic_response:
  - on_player_at_station: that station strip + indicator intensifies
  - on_calibration_active: oculus pulses faster + engine hologram blooms
  - on_paradox_event: red strobe through whole room (rare; one-shot)
```

### A.25.7 Atmosphere

```
air_temperature:    18°C (cool — precision)
humidity:           32% RH (low; instrument-friendly); smells of ozone (display electronics) + faint cold-iron (Quarchon tools) + old-paper (theorem references)
particulate:
  - dust: very low (precision-clean)
  - quantum_shimmer_motes: low (cosmetic; cool-cyan motes drift around engine)
volumetric_fog:     absent in baseline; subtle haze at upper volume during paradox events
wind_drift:         minimal; 0.04 m/s; HVAC-precision
smell_canon:        ozone + cold-iron + paper; voice-line: "smells like the world's hesitation"
```

### A.25.8 Sound

```
ambient_bed:           file: quantum_lab_ambient_bed_v1.ogg (loop); -36 dB; faint quantum-engine harmonic, distant cooling fans, occasional theorem-recitation murmur
point_sources:
  - sound.engine_harmonic: at engine; deep continuous harmonic; -32 dB
  - sound.station_console_buzz.<cardinal>: per station; -42 dB; continuous
  - sound.equation_recalibration_tone: at north wall display; subtle musical-tone when equation updates; -38 dB; cyclic
  - sound.cooling_fan.<n>: ceiling distributed; HVAC drone; -38 dB; continuous
  - sound.calibration_chime: state-conditional during calibrations; -28 dB
reverb_zone:           IR-impulse: quantum_lab_v1.wav; wet-mix 16% (clean precision)
music_eligibility:     cutscene only (Quarchon-arc calibration cutscenes; deferred catalogue)
voice_line_eligibility:
  - speaker: the_quarchon_master (named NPC; rare presence Acts 6+): line set §2.25.2
  - speaker: theorem_recitation: ambient (cycles canonical theorems in proto-mathematical script)
```

### A.25.9 Object inventory (compact catalogue)

Quantum Lab has 26 inventory objects.

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.quantum_lab.probability_engine` | interactive+display | (0.00, 5.50, 0.00) | 1.20 dia × 3.50 | THE central probability-engine cylinder |
| `ark.quantum_lab.station.<cardinal>` (4) | console | at cardinals; radius 3.00 m | 1.00×0.60×1.10 each | per-cardinal probability-query stations |
| `ark.quantum_lab.station_chair.<cardinal>` (4) | furniture | per station | 0.80×0.80×1.20 each | seats |
| `ark.quantum_lab.east.calibration_tools_cabinet` | container | (4.95, 1.50, 0.00) | 0.40×4.0×2.4 | 8 calibration tools |
| `ark.quantum_lab.west.reference_cabinet` | container | (0.05, 1.50, 0.00) | 0.40×4.0×2.4 | reference materials |
| `ark.quantum_lab.quarchon_master_anchor` | npc_anchor | (0.00, 8.00, 0.00) | 0.8×0.8×1.8 | Quarchon Master NPC |
| `ark.quantum_lab.quarchon_lectern` | container | (-2.00, 8.00, 0.00) | 0.40×0.30×1.20 | bronze lectern; theorem-tome |
| `ark.quantum_lab.south.intercom` | console | (-1.50, 0.20, 1.50) | 0.20×0.10×0.30 | comms |
| `ark.quantum_lab.fire_extinguisher.south` | interactive | (1.50, 0.20, 1.20) | 0.20×0.20×0.50 | safety |
| `ark.quantum_lab.first_aid.kit` | container | (-2.50, 0.20, 1.50) | 0.40×0.10×0.30 | medical |
| `ark.quantum_lab.south.plaque.principle` | decoration | (0.00, 0.20, 3.20) | 0.80×0.30×0.02 | "PROBABILITY IS THE KIND OF TRUTH" |
| `ark.quantum_lab.south.relief.theorems` | decoration | (0.00, 0.20, 4.00) | 4.00×0.40×0.10 | 7 canonical theorems relief |
| `ark.quantum_lab.north.relief.first_calibration` | decoration | (0.00, 10.85, 4.80) | 1.20×0.40×0.10 | first-calibration relief |
| `ark.quantum_lab.compass_inlay` | decoration | (0.00, 5.50, 0.005) | 1.40×1.40×0.005 | floor probability-curve inlay |
| `ark.quantum_lab.quantum_motes_emitter` | fx_emitter | distributed | n/a | quantum-shimmer mote source |
| `ark.quantum_lab.calibration_grate.engine_base` | decoration | concentric ring around engine | 1.60 dia ring | bronze grate over cooling/dissipation |
| `ark.quantum_lab.alert_strobe.<corner>` (4) | fx_emitter | corners at z = 4.20 | 0.20×0.20×0.20 each | paradox-event strobes (off baseline) |

Total: 26 inventory objects.

### A.25.10-17 Compact

```
camera_spawn_points:
  cs_amb_quantum_lab (Cat B): POV at threshold; slow approach to probability-engine; 18s
  cs_first_calibration (Act 6 one-shot Quarchon-aligned): hand at station; theorem displayed; engine hum rises; 14s

doorways: south.door.main → ark.corridor.quarchon_approach; pressure_seal; Act 6+ Quarchon-aligned

adjacency: direct ark.corridor.quarchon_approach (south); one_hop ark.archives (Quarchon-research kinship)

gameplay_hooks:
  - operateProbabilityEngine: trpc.quantum_lab.engine.operate
  - querryStation: trpc.quantum_lab.station.query (per-cardinal)
  - openCalibrationCabinet: trpc.quantum_lab.east.cabinet.open
  - openReferenceCabinet: trpc.quantum_lab.west.cabinet.open
  - readQuarchonLectern: trpc.quantum_lab.lectern.read

story_tie:
  primary_arcs:
    - act_6_first_calibration
    - probability_manipulation (continuous)
    - quarchon_master_arc
    - act_7_master_equation_solved (state-branched ending)
  per_act:
    acts_0_5: locked
    act_6: opens; first calibration; basic theorems available
    act_7: state-branched: master-equation-solved (Equation of Equations stable + glowing) vs. paradox-fallen (Equation chaotic + room cold)
  npc_roster: the_quarchon_master (named NPC; rare presence); the_player; theorem_recitation_voices (ambient)
  readables:
    - principle plaque (south)
    - 7 theorems relief (south; multi-screen)
    - first-calibration relief (north)
    - quarchon_lectern theorem-tome
    - 4 station outcome logs
  master_of_rlyeh_question: n/a (Quarchon-aligned cosmology)

special_fx:
  particle_systems: dust very low; quantum_shimmer_motes; equation_recalibration_motes; paradox_distortion_motes (rare)
  volumetric: oculus_glow; engine_hologram_volumetric; equation_uplight_envelope; station_glow_per_cardinal
  procedural_animations: engine_hologram_cycle; equation_recalibration_animation (continuous; subtle); station_indicator_pulses
  reactive_systems: engine_intensify_on_calibration; oculus_cycle_on_paradox; alert_strobes_on_paradox_event

avatar_parametricity: small_xenomorph alternate stand-on-step at engine; others all-reachable
audio_occlusion: xenomorph-sensitive: engine harmonic + theorem recitation more pronounced
performance: polygon_budget 220,000 / texture_budget 130 MB / light_count 16
streaming: preload quarchon_approach corridor; on_calibration_active: preload calibration-data feeds
```

---

## A.26 Synthesis Chamber (Neyon alignment) — FULL

**Status: FULL spec.** Cross-ref `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.26 (art-state prompts).

### A.26.1 Header

```
space_id:        ark.synthesis_chamber
space_name:      Synthesis Chamber (D10 Neyon alignment)
space_type:      ark_room  (Neyon sub-sanctum; D10-deck)
act_introduced:  Act 6 (Neyon-aligned only)
lore_anchor:     loredex.faction.neyon + arc.synthesis_progression + arc.act_6_first_synthesis
aesthetic_tier:  architect_geometric  (clean-synthesis; the most sterile precision-clinical space on the Ark)
```

### A.26.2 Geometry

```
dimensions:           10.00 m × 12.00 m × 4.50 m
origin_point:         centre of floor at south entrance threshold
coordinate_axes:      +x = right, +y = forward (north), +z = up
floor_plan_geometry:  rectangular  (with central synthesis-bench + perimeter component-storage cabinets)
volumetric_anomalies: none in baseline; subtle reality-knit visible above bench during active syntheses (pre-synthesis components visibly merge into post-synthesis result)
```

The Synthesis Chamber is rectangular, sterile, precise — the
Neyon faction's craft-laboratory where elements are SYNTHESISED
into compounds (chemical, narrative, spiritual). Central
synthesis-bench dominates floor. Perimeter walls hold component-
storage cabinets (4 east + 4 west). North wall houses the
"Synthesis Index" — a continuously-updating display of all
recipes the faction has discovered. Ceiling has direct overhead
lighting + 4 corner exhaust fans (precision atmospheric control).

Floor area: 120 m².

### A.26.3 Floor

```
material_primary:     polished white-tinted glazed ceramic; 0.50 × 0.50 m tiles; 2 mm gap; mirror-finish; intentionally easy-to-clean (laboratory-grade)
material_secondary:   bronze inlay outlining synthesis-bench zone (2.40 × 1.60 m); brass perimeter trim (laboratory-aesthetic)
pattern:              precise grid + central bench-zone marker
wear_state:           pristine; slight wear at bench-approach
embedded_features:
  - id: ark.synthesis_chamber.floor.charge_point.bench
    position: (0.00, 6.00, 0.00)
    dimensions: 0.40 × 0.40 × 0.05
    function: synthesis-bench power
  - id: ark.synthesis_chamber.floor.cabinet_anchor.<wall>.<n>  (8 anchors; 4 per wall)
    position: per cabinet base
    dimensions: 0.20 × 0.20 × 0.05 each
    function: cabinet electronics
  - id: ark.synthesis_chamber.floor.exhaust_drain.<corner>  (4 drains)
    position: per corner
    dimensions: 0.30 × 0.30 × 0.10 each
    function: synthesis-residue drainage
acoustic_property:    hard_reflective (ceramic + bronze); RT60 = 0.35s (intentionally clean for instrumentation clarity)
```

### A.26.4 Walls

#### Wall: South (entrance)

```
wall_id:              south
material_primary:     painted clean-white panelled steel with subtle gold-leaf detailing; reinforced
material_secondary:   bronze dado at z = 1.10 m
panelisation:         standard
colour_value:         --token-color-ark-synthesis-chamber-wall-south  (clean white + gold accent + cyan pin-stripe at z = 2.00 m)
embedded_displays:
  - id: ark.synthesis_chamber.south.display.recipe_index
    position: (-2.50, 0.20, 1.80)
    dimensions: 1.20 × 0.80 × 0.05
    content: live synthesis-recipe index (player's known recipes)
  - id: ark.synthesis_chamber.south.display.batch_log
    position: (2.50, 0.20, 1.80)
    dimensions: 1.20 × 0.80 × 0.05
    content: completed-synthesis batch log
embedded_doors:
  - door_id: ark.synthesis_chamber.south.door.main
    position: (0.00, 0.00, 0.00)
    dimensions: 1.40 × 2.40 × 0.10
    door_class: pressure_seal  (laboratory-grade; biometric)
    connecting_space_id: ark.corridor.neyon_approach
    unlock_condition: Act 6+ Neyon-aligned
decorative_features:
  - id: ark.synthesis_chamber.south.plaque.principle
    position: (0.00, 0.20, 3.20)
    dimensions: 0.80 × 0.30 × 0.02
    material: cast bronze with engraved text + gilt accent
    narrative_role: reads "WHAT IS COMBINED, BECOMES"
```

#### Wall: East (4 component cabinets)

```
wall_id:              east
material_primary:     painted clean-white steel panel
material_secondary:   bronze dado; brushed-titanium cabinet frames recessed
panelisation:         4-cabinet vertical stack
colour_value:         --token-color-ark-synthesis-chamber-wall-east
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: ark.synthesis_chamber.east.cabinet.<category>  (4 cabinets at y = 2.0, 4.5, 7.0, 9.5)
    position: along east wall
    dimensions: 0.40 × 1.80 × 2.40 each
    material: brushed-titanium with biometric lock + transparent display front
    narrative_role: per-category component storage (elements / catalysts / vessels / fluids)
```

#### Wall: North (Synthesis Index — symbolic apex)

```
wall_id:              north
material_primary:     painted clean-white panelled steel
material_secondary:   bronze frame around full-wall display
panelisation:         single integrated display
colour_value:         --token-color-ark-synthesis-chamber-wall-north
embedded_displays:
  - id: ark.synthesis_chamber.north.display.synthesis_index
    position: (0.00, 11.95, 2.20)
    dimensions: 4.00 × 2.40 × 0.05
    content: THE Synthesis Index; continuously-updating registry of all recipes Neyon faction has discovered
embedded_doors:        none
decorative_features:
  - id: ark.synthesis_chamber.north.relief.first_synthesis
    position: (0.00, 11.85, 4.00)
    dimensions: 1.20 × 0.40 × 0.10
    material: cast bronze with deep relief
    narrative_role: depicts the canonical first synthesis ritual
```

#### Wall: West (4 component cabinets; mirror of east)

```
wall_id:              west
material_primary:     same as east
material_secondary:   bronze dado
panelisation:         4-cabinet vertical stack mirror
colour_value:         --token-color-ark-synthesis-chamber-wall-west
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: ark.synthesis_chamber.west.cabinet.<category>  (4 cabinets mirror; categories: residues / specimens / archives / tools)
    position: mirror of east
    dimensions: 0.40 × 1.80 × 2.40 each
    material: brushed-titanium + transparent display front
    narrative_role: secondary storage
```

### A.26.5 Ceiling

```
height_above_floor:     4.50 m baseline; central drop coffer at 3.80 m above synthesis-bench
material:               painted clean-white panel + bronze conduit detail; central coffer is translucent backlit
lighting_integrated:    high-precision overhead grid 1.20 × 1.20; central coffer is task-light over bench; 4 corner exhaust-fan emitters
atmospheric_features:   subtle synthesis-shimmer above bench during active syntheses
acoustic_treatment:     baffled (instrumentation clarity)
```

### A.26.6 Lighting

```
ambient_baseline:     5500 K (cool-clinical); 320 lux at floor (high precision); CRI 95
direct_fixtures:
  - id: ark.synthesis_chamber.light.bench_pendant
    position: (0.00, 6.00, 3.80)
    beam_angle: 60° downward
    colour: --token-color-ark-synthesis-chamber-pendant  (cool white)
    intensity: 5000 lumens
    function: principal task at bench
  - id: ark.synthesis_chamber.light.recessed_grid
    position: distributed; 1.20 × 1.20 grid
    beam_angle: 60° each
    colour: 5500 K cool
    intensity: 1500 lumens each
    function: ambient task
  - id: ark.synthesis_chamber.light.cabinet_strip.east, .west
    position: above each cabinet column at z = 3.20
    beam_angle: 90° downward
    colour: 5500 K
    intensity: 600 lumens per metre
    function: cabinet definition
  - id: ark.synthesis_chamber.light.synthesis_index_uplight
    position: along base of north display at z = 0.05
    beam_angle: 30° upward
    colour: --token-color-ark-synthesis-chamber-uplight  (cool with cyan accent)
    intensity: 1000 lumens per metre
    function: dramatic backlighting for index
practical_sources:
  - id: ark.synthesis_chamber.bench_glow
    position: (0.00, 6.00, 0.95)
    intensity: 200 lumens (when synthesis active)
    flicker_pattern: matches synthesis rhythm
  - id: ark.synthesis_chamber.cabinet_indicator_light.<wall>.<n>  (8 small lights; one per cabinet)
    position: per cabinet
    intensity: 30 lumens each (varies — green stable; amber active; red paradox)
    flicker_pattern: stable
time_of_day_variation:
  acts_6_to_7: stable cool baseline; in late-act7, if many syntheses completed, all cabinets glow brighter
dynamic_response:
  - on_player_at_bench: bench pendant + glow intensify
  - on_synthesis_active: bench glow + relevant cabinet indicators flash
  - on_synthesis_complete: brief cyan flash at bench + index updates with new recipe
```

### A.26.7 Atmosphere

```
air_temperature:    18°C (cool — laboratory)
humidity:           30% RH (very low; precision); smells of antiseptic + ozone (instrumentation) + faint chemical-residue
particulate:
  - dust: very low (laboratory)
  - synthesis_motes: low during syntheses (cosmetic; cool-cyan particles)
volumetric_fog:     absent in baseline; subtle haze at upper volume during stress states (paradox)
wind_drift:         strong toward exhaust corners; 0.30 m/s convection (precision atmospheric control)
smell_canon:        antiseptic + ozone + chemical; voice-line: "smells like beginnings"
```

### A.26.8 Sound

```
ambient_bed:           file: synthesis_chamber_ambient_bed_v1.ogg (loop); -34 dB; faint instrument-hum, cooling-fan drone, occasional cabinet-buzz
point_sources:
  - sound.bench_hum: at bench; -36 dB; continuous
  - sound.cabinet_buzz.<wall>.<n>: per cabinet; -42 dB; continuous
  - sound.exhaust_fan.<corner>: per corner; HVAC drone; -38 dB; continuous
  - sound.synthesis_completion_chime: state-conditional; -28 dB at success; -22 dB at failure (different tone)
reverb_zone:           IR-impulse: synthesis_chamber_v1.wav; wet-mix 14% (clean precision)
music_eligibility:     cutscene only (Neyon-arc synthesis cutscenes; deferred catalogue)
voice_line_eligibility:
  - speaker: the_neyon_master (named NPC; rare presence Acts 6+): line set §2.26.2
  - speaker: synthesis_completion_voice: institutional voice ("synthesis complete" / "synthesis failed")
```

### A.26.9 Object inventory (compact catalogue)

Synthesis Chamber has 26 inventory objects.

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.synthesis_chamber.synthesis_bench` | interactive | (0.00, 6.00, 0.00) | 2.40×1.20×0.95 | THE central synthesis bench |
| `ark.synthesis_chamber.synthesis_bench.holographic_overlay` | fx_emitter | above bench | 2.40×1.20 | holographic synthesis-progress |
| `ark.synthesis_chamber.bench_chair.east, .west` (2) | furniture | flanking bench | 0.80×0.80×1.20 each | seating for synthesis preparation |
| `ark.synthesis_chamber.east.cabinet.<category>` (4) | container | east wall | 0.40×1.80×2.40 each | per-category components (elements/catalysts/vessels/fluids) |
| `ark.synthesis_chamber.west.cabinet.<category>` (4) | container | west wall | mirror | secondary storage (residues/specimens/archives/tools) |
| `ark.synthesis_chamber.neyon_master_anchor` | npc_anchor | (0.00, 8.00, 0.00) | 0.8×0.8×1.8 | Neyon Master NPC |
| `ark.synthesis_chamber.neyon_lectern` | container | (-2.00, 8.00, 0.00) | 0.40×0.30×1.20 | bronze lectern; recipe-tome |
| `ark.synthesis_chamber.precision_scales` | decoration | on bench | 0.30×0.20×0.30 | bronze precision balance scales |
| `ark.synthesis_chamber.fume_hood.east_corner` | interactive | (4.50, 1.50, 0.00) | 0.80×0.40×2.40 | fume hood (precision ventilation; rare-synthesis use) |
| `ark.synthesis_chamber.exhaust_fan.<corner>` (4) | fx_emitter | corners | 0.40×0.40×0.20 each | precision exhaust fans |
| `ark.synthesis_chamber.south.intercom` | console | (-1.50, 0.20, 1.50) | 0.20×0.10×0.30 | comms |
| `ark.synthesis_chamber.fire_extinguisher.south` | interactive | (1.50, 0.20, 1.20) | 0.20×0.20×0.50 | safety |
| `ark.synthesis_chamber.first_aid.kit` | container | (-2.50, 0.20, 1.50) | 0.40×0.10×0.30 | medical |
| `ark.synthesis_chamber.south.plaque.principle` | decoration | (0.00, 0.20, 3.20) | 0.80×0.30×0.02 | "WHAT IS COMBINED, BECOMES" |
| `ark.synthesis_chamber.north.relief.first_synthesis` | decoration | (0.00, 11.85, 4.00) | 1.20×0.40×0.10 | first-synthesis relief |
| `ark.synthesis_chamber.compass_inlay` | decoration | (0.00, 6.00, 0.005) | 0.80×0.80×0.005 | floor inlay under bench |

Total: 26 inventory objects.

### A.26.10-17 Compact

```
camera_spawn_points:
  cs_amb_synthesis_chamber (Cat B): POV at threshold; slow approach to synthesis bench; head pans across cabinets; 14s
  cs_first_synthesis (Act 6 one-shot Neyon-aligned): hand at bench; components arranged; synthesis activates with cyan flash; 18s

doorways: south.door.main → ark.corridor.neyon_approach; pressure_seal; Act 6+ Neyon-aligned

adjacency: direct ark.corridor.neyon_approach (south); one_hop ark.archives, ark.cipher_den (Neyon-research kinship)

gameplay_hooks:
  - operateBench: trpc.synthesis_chamber.bench.operate
  - openComponentCabinet: trpc.synthesis_chamber.cabinet.open (per-cabinet)
  - readNeyonLectern: trpc.synthesis_chamber.lectern.read
  - operateFumeHood: trpc.synthesis_chamber.fume_hood.operate

story_tie:
  primary_arcs:
    - act_6_first_synthesis
    - synthesis_progression (continuous Acts 6-7)
    - neyon_master_arc
    - act_7_final_synthesis (state-branched ending — depends on rare-recipe completion)
  per_act:
    acts_0_5: locked
    act_6: opens; first synthesis; basic recipes
    act_7: state-branched: master-synthesist ending vs. abandoned-bench ending
  npc_roster: the_neyon_master; the_player; synthesis_completion_voice (institutional ambient)
  readables: principle plaque; first-synthesis relief; recipe-tome; synthesis index
  master_of_rlyeh_question: n/a

special_fx:
  particle_systems: synthesis_motes; cabinet_glow_per_state; paradox_motes (rare)
  volumetric: bench_holographic_overlay; cabinet_glow_per_cabinet
  procedural_animations: bench_holo_cycle; synthesis_index_continuous_update; cabinet_indicator_pulse
  reactive: bench_glow_on_proximity; synthesis_completion_flash; index_update_one_shot

avatar_parametricity: standard
audio_occlusion: xenomorph-sensitive: instrument-hum more pronounced
performance: polygon_budget 200,000 / texture_budget 120 MB / light_count 14
streaming: preload neyon_approach corridor
```

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

## A.28 Pet Garden (Pocket — breeding/dynasty room) — FULL

**Status: FULL spec.** Cross-ref: `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.28 (art-state prompts).

### A.28.1 Header

```
space_id:        ark.pet_garden
space_name:      Pet Garden
space_type:      ark_room  (pocket dimension; non-Euclidean botanical zone)
act_introduced:  Act 3
lore_anchor:     loredex.system.pets + arc.pet_breeding + arc.act_3_first_pet_acquisition
aesthetic_tier:  dreamers_oneiric  (botanical-organic; the Ark's most living space)
```

### A.28.2 Geometry

```
dimensions:           14.00 m diameter × 6.00 m  (circular footprint; bounding box 14×14×6)
origin_point:         centre of floor (room is circular; origin at geometric centre)
coordinate_axes:      +x = right, +y = forward (north), +z = up
floor_plan_geometry:  circular  (7.00 m radius)
volumetric_anomalies: subtle bigger-on-inside ratio 1.5× (botanical zones extend slightly beyond physical footprint); incubation pods exhibit minor temporal dilation (cosmetic)
```

The Pet Garden is a circular botanical chamber; central founder-
pet incubation pods cluster in the centre; surrounding zones are
themed botanical alcoves (one per pet-species type). Soft bio-
luminescent walls; gravity slightly reduced (~0.95g) to simulate
natural pet habitats.

Floor area: ~154 m².

### A.28.3 Floor

```
material_primary:     polished moss-green stone (treated for biological-fluid resistance); 0.60 m × 0.60 m hexagonal tiles
material_secondary:   bronze inlay forming a 6-pointed mandala centred on incubation pods; bio-luminescent strips along walkways
pattern:              hexagonal tiles + mandala inlay; 6 walkway-radii from centre to perimeter
wear_state:           pristine; slight wear at incubation-pod approach
embedded_features:
  - id: ark.pet_garden.floor.charge_point.incubation_pods
    position: (0.00, 0.00, 0.00)
    dimensions: 0.40 × 0.40 × 0.05
    function: incubation-pod power
  - id: ark.pet_garden.floor.bio_lume_strip.<radii>  (6 radial strips)
    position: 6 walkways from centre to perimeter at 60° intervals
    dimensions: 0.10 × 6.50 × 0.005 each
    function: bio-luminescent walkway lights
acoustic_property:    soft_absorbent (organic surfaces); RT60 = 0.50s
```

### A.28.4 Walls

```
wall_id:              perimeter_curved (circular)
material_primary:     bio-luminescent cast-coral panels (organic-grown over time); soft-pulse with pet-life rhythm
material_secondary:   bronze structural ribs at 60° intervals
panelisation:         continuous curved surface
colour_value:         --token-color-ark-pet-garden-wall  (warm bio-luminescent green-gold)
embedded_displays:
  - id: ark.pet_garden.south.display.species_register
    position: (0.00, -6.95, 1.80)
    dimensions: 1.00 × 0.80 × 0.05
    content: registry of all species + player's collection
embedded_doors:
  - door_id: ark.pet_garden.south.door.main
    position: (0.00, -7.00, 0.00)
    dimensions: 1.40 × 2.40 × 0.10
    door_class: arch  (organic curved frame)
    connecting_space_id: ark.corridor.pet_approach
decorative_features:
  - id: ark.pet_garden.alcove.<species_zone>  (6 botanical alcoves at 60° intervals)
    position: distributed perimeter at radius 6.20 m
    dimensions: 1.80 × 0.80 × 4.00 each
    material: bio-luminescent backplane + species-themed planting
    narrative_role: each alcove reflects a different pet-species' natural habitat
  - id: ark.pet_garden.south.plaque.principle
    position: (0.00, -6.95, 3.20)
    dimensions: 0.80 × 0.30 × 0.02
    material: cast bronze with engraved text
    narrative_role: reads "ALL CREATURES KEEP THEIR OWN COUNSEL"
```

### A.28.5 Ceiling

```
height_above_floor:     6.00 m baseline; central oculus rises to 7.50 m above incubation pods (bio-luminescent dome)
material:               bio-luminescent cast-coral with bronze structural ribs
lighting_integrated:    central oculus emits warm bio-luminescent light; 6 alcove ceiling-strips define species zones
atmospheric_features:   floating bio-luminescent motes drift naturally (cosmetic; suggests "spores of life")
acoustic_treatment:     domed organic absorption
```

### A.28.6 Lighting

```
ambient_baseline:     3500 K (warm bio-luminescent); 180 lux at floor level; CRI 90
direct_fixtures:
  - id: ark.pet_garden.light.oculus_central
    position: (0.00, 0.00, 7.50)
    beam_angle: 60° downward
    colour: --token-color-ark-pet-garden-oculus  (warm bio-luminescent gold-green)
    intensity: 4000 lumens (pulses with pet-life rhythm)
    function: principal incubation-pod illumination
  - id: ark.pet_garden.light.alcove_strip.<n>  (6 alcove ceiling strips)
    position: each alcove ceiling
    beam_angle: 180° wash inward-downward
    colour: --token-color-ark-pet-garden-alcove-strip  (varies per species — green for botanicals, blue for aquatics, gold for celestials, etc.)
    intensity: 800 lumens each
    function: species-zone identification
practical_sources:
  - id: ark.pet_garden.incubation_pod.<n>  (varies by population; up to 12 pods)
    position: per-pod within central cluster
    intensity: 100 lumens (when active; varies by occupant lifecycle)
    flicker_pattern: matches gestation rhythm
time_of_day_variation:
  acts_3_to_7: stable; in late-act7, if many pets thriving, oculus pulses richly; if neglectful, dim
dynamic_response:
  - on_pet_birth: oculus pulses brightly; nearby alcove brightens
  - on_pet_death: localised dimming
```

### A.28.7 Atmosphere

```
air_temperature:    24°C (warm; biological)
humidity:           65% RH (high; supports botanical + organic life); smells of fresh foliage + earthy soil + faint pet-musk + mineral water
particulate:
  - bio_luminescent_motes: medium (cosmetic; "life floats")
  - pollen_spores: very low (varies per alcove)
  - water_vapor: low (from incubation pods)
volumetric_fog:     subtle haze at upper volume (0.05 g/m³, warm-amber)
wind_drift:         minimal; 0.02 m/s; subtle inward-spiral toward incubation pods
smell_canon:        foliage + soil + pet-musk + mineral water; voice-line: "smells like a world being born"
```

### A.28.8 Sound

```
ambient_bed:           file: pet_garden_ambient_bed_v1.ogg (loop); -32 dB; soft chittering, occasional pet-vocalisation, water-trickle from alcoves, faint heartbeat-rhythm of incubation pods
point_sources:
  - sound.incubation_pod_hum.<n>: per active pod; -38 dB; continuous
  - sound.pet_vocalisation.<species>: dynamic; per alcove; varies by species; -34 dB; cyclic
  - sound.water_trickle.<alcove>: per alcove; -38 dB; continuous
  - sound.pollen_spores_drift: omnidirectional; very faint; -44 dB; ambient
reverb_zone:           IR-impulse: pet_garden_v1.wav; wet-mix 22%
music_eligibility:     cutscene only (Category B cs_amb_pet_garden + Category C cs_disc_pet_arena loading from §A.29)
voice_line_eligibility:
  - speaker: the_mascoteer (named NPC; rare presence): line set §2.28.2
```

### A.28.9 Object inventory

Pet Garden has 32 inventory objects.

#### A.28.9.1 The Central Incubation Pod Cluster

```
object_id:           ark.pet_garden.incubation_pod_cluster
object_class:        interactive
position:            (0.00, 0.00, 0.00)
dimensions:          2.40 dia × 1.50 height (cluster of 12 pods arranged in tight ring)
rotation:            0°
material_primary:    transparent organic-resin pods + brass cradles
material_secondary:  bronze nameplates per pod (currently-incubating species)
colour_value:        --token-color-ark-pet-garden-incubation-pod
interaction:         interactable
  - operate: opens incubation-management UI (player monitors gestation, intervenes if needed)
  - inspect: lore-note about pet-genealogy mechanics
narrative_role:      THE breeding heart; player manages founding-pet lineage here
lore_anchor:         loredex.system.pets + arc.pet_breeding
art_status:          producer_handoff
gameplay_hook_id:    trpc.pet_garden.incubation_cluster.operate
wear_state:          slight wear at pod-glass touch zones
physical_constraints: collides
```

#### A.28.9.2-7 Six Species Alcoves

```
object_id:           ark.pet_garden.alcove.<species_zone>  (6 alcoves: botanicals, aquatics, celestials, terrestrials, mystics, swarm)
positions:           perimeter at 60° intervals (radius 6.20 m)
dimensions (each):   1.80 × 0.80 × 4.00
material_primary:    bio-luminescent backplane + species-themed planting / habitat (botanicals = ferns, aquatics = water-feature, celestials = star-field, etc.)
material_secondary:  bronze name-plate per alcove
colour_value:        --token-color-ark-pet-garden-alcove
interaction:         interactable
  - inspect: opens species-detail UI
  - care: provides species-specific care actions
narrative_role:      species-identity zones; pets visit/rest in their natural alcove
lore_anchor:         per-species lore
art_status:          producer_handoff
gameplay_hook_id:    trpc.pet_garden.alcove.inspect + .care
wear_state:          varies per alcove based on player engagement
physical_constraints: collides; player can step inside
```

#### A.28.9.8 Mascoteer's Anchor

```
object_id:           ark.pet_garden.mascoteer_anchor
object_class:        npc_anchor
position:            (-1.50, 2.00, 0.00)
dimensions:          0.80 × 0.80 × 1.80 (anchor)
rotation:            varies
material_primary:    n/a
material_secondary:  n/a
colour_value:        n/a
interaction:         n/a
narrative_role:      Mascoteer NPC anchors here; rare physical visits Acts 4+
lore_anchor:         loredex.character.mascoteer
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          n/a
physical_constraints: n/a
```

#### A.28.9.9-14 Six Care Stations (one near each alcove)

```
object_id:           ark.pet_garden.care_station.<species_zone>
object_class:        interactive
positions:           between centre and each alcove (radius 4.00 m, at 60° intervals)
dimensions (each):   0.80 × 0.40 × 1.10
rotation (each):     faces alcove
material_primary:    brass + glass with species-themed tools
material_secondary:  none
colour_value:        --token-color-ark-pet-garden-care-station
interaction:         interactable
  - operate: opens species-specific care UI (feeding, grooming, training)
narrative_role:      hands-on pet care; gameplay-active
lore_anchor:         loredex.system.pet_care
art_status:          producer_handoff
gameplay_hook_id:    trpc.pet_garden.care_station.operate
wear_state:          slight wear
physical_constraints: collides
```

#### A.28.9.15-20 Six Bronze Pedestals (decorative; one per alcove)

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.pet_garden.pedestal.botanicals` | decoration | near botanicals alcove | 0.40 × 0.40 × 1.20 | bronze pedestal with species emblem |
| (5 more, one per remaining species) | | | | |

#### A.28.9.21-24 Atmospheric Items

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.pet_garden.water_feature.aquatics` | fx_emitter | within aquatics alcove | n/a | bubbling water feature |
| `ark.pet_garden.starfield_emitter.celestials` | fx_emitter | within celestials alcove | n/a | localised starfield projection |
| `ark.pet_garden.fern_cluster.botanicals` | decoration | within botanicals alcove | varied | dense fern planting |
| `ark.pet_garden.crystal_cluster.mystics` | decoration | within mystics alcove | varied | luminescent crystal cluster |

#### A.28.9.25-28 Bench + Observation Items

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.pet_garden.observation_bench.south_arc` | furniture | (0.00, -3.50, 0.00) | 1.40 × 0.40 × 0.45 | curved bench facing centre |
| `ark.pet_garden.observation_bench.north_arc` | furniture | (0.00, 3.50, 0.00) | mirror | bench |
| `ark.pet_garden.lectern.species_guide` | container | (-2.50, -3.00, 0.00) | 0.40 × 0.30 × 1.20 | bronze lectern with species field-guide |
| `ark.pet_garden.species_guide_book` | container | on lectern | 0.30 × 0.20 × 0.05 | open lore-readable |

#### A.28.9.29-32 Closing Items

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.pet_garden.south.intercom` | console | (-1.00, -6.95, 1.50) | 0.20 × 0.10 × 0.30 | comms relay |
| `ark.pet_garden.fire_extinguisher.south` | interactive | (1.00, -6.95, 1.20) | 0.20 × 0.20 × 0.50 | safety |
| `ark.pet_garden.first_aid.kit` | container | (-2.00, -6.95, 1.50) | 0.40 × 0.10 × 0.30 | medical |
| `ark.pet_garden.compass_inlay` | decoration | (0.00, 0.00, 0.005) | 1.40 × 1.40 × 0.005 | floor mandala |

Total: 32 inventory objects.

### A.28.10-17 Camera-spawn-points / Doorways / Adjacency / Hooks / Story / FX / Parametricity / Performance (compact)

```
cs_amb_pet_garden:  POV at threshold; slow walk-pan inward; head turns to alcoves; pet stirs; lasts 22s
cs_first_pet_acquisition (Act 3): hand at alcove; pet emerges; first bond

door_id: ark.pet_garden.south.door.main → ark.corridor.pet_approach (Act 3+; arch; fade)

direct_adjacencies: ark.corridor.pet_approach (south)
one_hop: ark.pet_arena (via approach), ark.pet_medical_annex (via approach)

hooks:
  - operateIncubationCluster: trpc.pet_garden.incubation_cluster.operate
  - inspectAlcove: trpc.pet_garden.alcove.inspect
  - careAlcove: trpc.pet_garden.alcove.care
  - operateCareStation: trpc.pet_garden.care_station.operate
  - readSpeciesGuide: trpc.pet_garden.species_guide.read

primary_arcs:
  - arc.act_3_first_pet_acquisition
  - arc.pet_breeding (continuous)
  - arc.species_collection
per_act:
  acts_0_2: locked
  act_3: opens; first pet acquisition
  acts_4_6: deeper breeding; rare species
  act_7: state-branched: thriving menagerie vs. minimal collection

npc_roster: the_mascoteer; pets (hundreds)
readables: principle plaque; species guide; alcove name-plates
master_of_rlyeh_question: n/a

particle_systems: bio_luminescent_motes; pollen_spores; water_vapor
volumetric_effects: oculus_volumetric_glow; alcove_glow_per_zone
procedural_animations: incubation_pod_pulse; pet_vocalisation_random; pollen_drift
reactive_systems: oculus_pulse_on_birth; alcove_brighten_on_engagement

camera_height_variation: small_xenomorph alternate ladder for upper alcove; others all-reachable
audio_occlusion_variation: xenomorph-sensitive: pet vocalisations pronounced

polygon_budget: 280,000 / texture_budget: 150 MB / light_count_limit: 16
streaming_behaviour: preload pet_approach corridor + (Act 3+) preload pet_arena + pet_medical_annex
```

---

## A.29 Pet Arena + Spectator Gallery — FULL

**Status: FULL spec.** Cross-ref: `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.29 (art-state prompts); companion to Pet Garden §A.28.

### A.29.1 Header

```
space_id:        ark.pet_arena
space_name:      Pet Arena + Spectator Gallery
space_type:      ark_room  (pocket dimension — colosseum aesthetic)
act_introduced:  Act 3
lore_anchor:     loredex.system.pet_arena + arc.pet_combat + arc.act_3_first_pet_match
aesthetic_tier:  solar_punk_cathedral  (colosseum aesthetic; tiered seating; central combat oval)
```

### A.29.2 Geometry

```
dimensions:           18.00 m × 14.00 m × 8.00 m  (bounding box; central oval arena floor + tiered gallery)
origin_point:         centre of arena floor
coordinate_axes:      +x = right, +y = forward (north), +z = up
floor_plan_geometry:  oval arena floor (12.00 × 8.00 m) surrounded by tiered spectator gallery (3 tiers rising); rectangular outer footprint
volumetric_anomalies: none in baseline; combat-fx generate visible energy distortion at upper volume during matches
```

The Pet Arena is a colosseum — central oval combat floor with
3-tier spectator gallery rising on east + west sides. Pet entry
gates at south. Mascoteer's referee box at north. Match-board
holographic display above central arena. Sand-and-organic-matter
floor (resilient under combat).

Floor area: ~252 m².

### A.29.3 Floor

```
material_primary:     compacted organic-sand (combat oval; 12 × 8 m); resilient + absorbs blood; raked between matches
material_secondary:   polished obsidian-black stone (gallery walkway); 0.60 × 0.60 m tiles
pattern:              oval combat floor with raked-sand pattern; gallery tiles in radial pattern
wear_state:           combat-worn at oval centre; pristine at gallery
embedded_features:
  - id: ark.pet_arena.floor.charge_point.match_board
    position: (0.00, 0.00, 0.00)  # centre of oval
    dimensions: 0.40 × 0.40 × 0.05
    function: holographic match-board projection power
  - id: ark.pet_arena.floor.drain.south
    position: (0.00, -6.50, 0.00)
    dimensions: 0.40 × 0.40 × 0.10
    function: arena-floor drainage
  - id: ark.pet_arena.floor.gate_threshold.south.east, .south.west  (2 entry gates)
    position: (3.50, -6.50, 0.00), (-3.50, -6.50, 0.00)
    dimensions: 1.40 × 0.20 × 0.10 each
    function: pet-entry gate threshold
acoustic_property:    mixed (sand absorbs; stone reflects); RT60 = 0.55s with strong crowd-resonance during matches
```

### A.29.4 Walls

#### Wall: South (entrance + pet gates)

```
wall_id:              south
material_primary:     polished obsidian-black stone cladding with reinforced gate frames
material_secondary:   bronze dado at z = 1.20; bronze gate frames
panelisation:         standard with 2 gate recesses (east and west of central player entrance)
colour_value:         --token-color-ark-pet-arena-wall-south  (charcoal stone + bronze)
embedded_displays:
  - id: ark.pet_arena.south.display.match_schedule
    position: (-2.50, -6.95, 1.80)
    dimensions: 1.20 × 0.80 × 0.05
    content: upcoming pet matches; tournament bracket
  - id: ark.pet_arena.south.display.player_record
    position: (2.50, -6.95, 1.80)
    dimensions: 1.20 × 0.80 × 0.05
    content: player's pet-combat record
embedded_doors:
  - door_id: ark.pet_arena.south.door.main
    position: (0.00, -6.95, 0.00)
    dimensions: 1.40 × 2.40 × 0.10
    door_class: arch
    connecting_space_id: ark.corridor.pet_approach
  - door_id: ark.pet_arena.south.gate.east
    position: (3.50, -6.95, 0.00)
    dimensions: 1.40 × 2.40 × 0.10
    door_class: slide  (heavy combat gate)
    connecting_space_id: ark.pet_arena.staging.east  (sub-space; deferred)
    unlock_condition: Act 3+
  - door_id: ark.pet_arena.south.gate.west
    position: (-3.50, -6.95, 0.00)
    dimensions: 1.40 × 2.40 × 0.10
    door_class: slide
    connecting_space_id: ark.pet_arena.staging.west  (sub-space; deferred)
    unlock_condition: Act 3+
decorative_features:
  - id: ark.pet_arena.south.plaque.creed
    position: (0.00, -6.95, 3.20)
    dimensions: 1.00 × 0.40 × 0.02
    material: cast bronze
    narrative_role: reads "BLOOD WITH HONOUR / VICTORY WITH MERCY"
```

#### Wall: East + West (tiered spectator gallery — both walls)

```
wall_id:              east, west
material_primary:     polished obsidian-black stone with bronze tier-divider rails; 3 spectator tiers (z = 0.40, 1.60, 2.80; each 1.20 m higher than previous)
material_secondary:   bronze tier-rails; warm-leather padded bench-tops on each tier
panelisation:         tiered spectator zones
colour_value:         --token-color-ark-pet-arena-wall-gallery
embedded_displays:    none (gallery views the arena directly)
embedded_doors:        none
decorative_features:
  - id: ark.pet_arena.<east|west>.tier_seating.<n>  (3 tiers each side; specced in inventory)
  - id: ark.pet_arena.east.banner.victory
    position: (8.95, 0.00, 7.50)  # high above tier 3
    dimensions: 0.10 × 1.20 × 4.00
    material: deep crimson velvet with gold "WINNER" embroidery
    narrative_role: changes to victor's faction colours after major matches
  - id: ark.pet_arena.west.banner.tribute
    position: (-8.95, 0.00, 7.50)
    dimensions: mirror
    material: same as east; deep crimson with gold "TRIBUTE" embroidery
    narrative_role: honours fallen pets
```

#### Wall: North (Mascoteer's referee box)

```
wall_id:              north
material_primary:     polished obsidian-black stone with elevated referee box recess
material_secondary:   bronze dado; brass railing on referee box
panelisation:         standard with elevated central recess
colour_value:         --token-color-ark-pet-arena-wall-north
embedded_displays:
  - id: ark.pet_arena.north.display.match_referee
    position: (0.00, 13.95, 2.40)
    dimensions: 1.20 × 0.80 × 0.05
    content: live match-state from referee perspective
embedded_doors:        none
decorative_features:
  - id: ark.pet_arena.north.referee_box
    position: (0.00, 13.50, 2.00)  # elevated above floor
    dimensions: 2.40 × 1.20 × 0.80 (raised platform with railing)
    material: polished walnut + brass railing
    narrative_role: where Mascoteer (or named referee NPC) judges matches
  - id: ark.pet_arena.north.relief.eternal_combat
    position: (0.00, 13.85, 6.00)
    dimensions: 2.40 × 1.80 × 0.10
    material: cast bronze
    narrative_role: depicts the eternal pet-combat cycle (creatures of dreams + waking)
```

### A.29.5 Ceiling

```
height_above_floor:     8.00 m baseline; central oculus rises to 9.50 m above arena (skylight effect for combat-aerial visibility)
material:               polished obsidian-black stone with bronze rib detail; central oculus is translucent panel emitting cosmic-tournament light
lighting_integrated:    central oculus emits dramatic combat-light; 6 spotlight arrays around oculus aim at oval; 3-tier gallery ceiling-strips
atmospheric_features:   visible energy-distortion above oval during active matches (combat FX); subtle smoke during high-stakes matches
acoustic_treatment:     domed apsidal at oculus; supports crowd-roar amplification during matches
```

### A.29.6 Lighting

```
ambient_baseline:     3500 K (warm-tactical; gladiatorial); 200 lux at floor (dim baseline; intensifies during matches); CRI 90
direct_fixtures:
  - id: ark.pet_arena.light.oculus_central
    position: (0.00, 0.00, 9.50)
    beam_angle: 60° downward
    colour: --token-color-ark-pet-arena-oculus  (warm gold-white)
    intensity: 12000 lumens (during matches; 4000 baseline)
    function: principal arena task lighting
  - id: ark.pet_arena.light.spotlight_array.<n>  (6 spots around oculus)
    position: surrounding oculus at 60° intervals at z = 9.20
    beam_angle: 30° downward
    colour: --token-color-ark-pet-arena-spotlight  (combat-warm white)
    intensity: 6000 lumens each
    function: theatrical spotlights
  - id: ark.pet_arena.light.gallery_strip.east, .west, .tier_<n>  (6 strips total; one per tier per side)
    position: along each gallery tier ceiling
    beam_angle: 180° wash
    colour: warm amber
    intensity: 600 lumens per metre
    function: spectator-area lighting
practical_sources:
  - id: ark.pet_arena.referee_box_glow
    position: (0.00, 13.50, 2.80)
    intensity: 800 lumens (spotlight-equivalent)
    flicker_pattern: stable
  - id: ark.pet_arena.gate_threshold_glow.east, .west
    position: above each pet gate
    intensity: 400 lumens (red — "gate active")
    flicker_pattern: pulses during pet entry
time_of_day_variation:
  acts_3_to_7: dim baseline; matches activate full theatrical lighting
dynamic_response:
  - on_match_start: oculus + spotlights + strips all intensify dramatically
  - on_pet_victory: victor's banner-colours intensify; oculus pulses
  - on_pet_death: tribute banner brightens; tier strips dim respectfully
```

### A.29.7 Atmosphere

```
air_temperature:    23°C (warm; combat-anticipation)
humidity:           45% RH; smells of organic-sand + leather (gallery upholstery) + faint ozone (combat FX)
particulate:
  - sand_drift: very low (cosmetic; raked between matches)
  - blood_motes: very low (visible during combat; cosmetic)
  - combat_energy_motes: low during matches (cosmetic FX)
volumetric_fog:     subtle haze at upper volume during matches
wind_drift:         minimal; 0.04 m/s; slight inward toward oval
smell_canon:        organic-sand + leather + ozone; voice-line: "smells like stakes"
```

### A.29.8 Sound

```
ambient_bed:           file: pet_arena_ambient_bed_v1.ogg (loop); -32 dB (baseline empty); -18 dB (during matches); crowd-anticipation murmur, sand-rustle, distant pet-vocalisations from staging
point_sources:
  - sound.crowd_roar: dynamic; -16 dB during matches; ambient cyclic when populated
  - sound.gate_engage: at pet gates; -22 dB at gate-open
  - sound.referee_horn: at referee box; -14 dB at match-start
  - sound.match_clock_tick: at match-board; -32 dB; period 1s
  - sound.pet_vocalisations: dynamic per-pet; -20 dB
reverb_zone:           IR-impulse: pet_arena_v1.wav; wet-mix 28% (colosseum)
music_eligibility:     cutscene only (Category C cs_disc_pet_arena + cs_load_pet_arena per §3.1.C)
voice_line_eligibility:
  - speaker: the_mascoteer: presence (Acts 3+ during matches)
    line set: see §2.29.2
  - speaker: crowd_chants: ambient atmosphere only
```

### A.29.9 Object inventory

Pet Arena has 38 inventory objects.

#### A.29.9.1 The Match-Board (overhead holographic display)

```
object_id:           ark.pet_arena.match_board
object_class:        display
position:            (0.00, 0.00, 5.00)  # suspended above arena centre
dimensions:          3.00 × 0.60 × 0.10  (transparent holographic display)
rotation:            0°
material_primary:    suspended bronze frame with holographic projection
material_secondary:  none
colour_value:        --token-color-ark-pet-arena-match-board  (transparent; content variable)
interaction:         inert (display only)
narrative_role:      central match-state display visible from all gallery seats
lore_anchor:         loredex.system.pet_arena
art_status:          producer_handoff
gameplay_hook_id:    none (display-only)
wear_state:          pristine
physical_constraints: non-collide (suspended)
```

#### A.29.9.2 The Mascoteer's Referee Box

```
object_id:           ark.pet_arena.referee_box
object_class:        furniture  (also npc_anchor)
position:            (0.00, 13.50, 2.00)  # elevated platform
dimensions:          2.40 × 1.20 × 0.80 (platform) + 1.00 × 0.80 × 1.10 (referee chair on platform)
rotation:            180°  (faces south, toward arena)
material_primary:    polished walnut platform + brass railing + matching walnut chair
material_secondary:  brass nameplate "THE MASCOTEER"
colour_value:        --token-color-ark-pet-arena-referee-box
interaction:         interactable (when Mascoteer absent — rare)
  - sit_in_referee_chair: rare lore-flag
  - inspect: lore-note about Mascoteer position
narrative_role:      Mascoteer's anchor; judges all matches
lore_anchor:         loredex.character.mascoteer
art_status:          producer_handoff
gameplay_hook_id:    trpc.pet_arena.referee_box.sit
wear_state:          slight wear at chair
physical_constraints: collides; sittable
```

#### A.29.9.3-8 Six Gallery Tier-Bench Sections (3 east + 3 west)

```
object_id:           ark.pet_arena.tier_bench.<east|west>.<tier_n>  (6 long curved benches)
object_class:        furniture
positions:           per gallery tiers along east + west walls
dimensions (each):   18.00 × 0.50 × 0.40 (long curved spectator bench)
rotation:            varies (faces arena oval)
material_primary:    polished walnut bench-top with crimson-velvet padding
material_secondary:  brass armrests at aisle ends
colour_value:        --token-color-ark-pet-arena-tier-bench
interaction:         interactable - sit (multi-seat capacity ~12 per bench)
narrative_role:      spectator seating; player can watch matches; tier 3 (highest) is best-view
lore_anchor:         arc.pet_combat
art_status:          producer_handoff
gameplay_hook_id:    none (positional)
wear_state:          slight wear at most-frequented seats
physical_constraints: collides; sittable
```

#### A.29.9.9-10 Two Pet Entry Gates (south)

```
object_id:           ark.pet_arena.gate.east, .west
object_class:        door
positions:           (3.50, -6.95, 0.00), (-3.50, -6.95, 0.00)
dimensions (each):   1.40 × 2.40 × 0.10
rotation:            180°
material_primary:    reinforced steel gate with bronze trim + amber warning lights
material_secondary:  bronze nameplate
colour_value:        --token-color-ark-pet-arena-gate
interaction:         interactable (during match prep)
  - operate: dispatches pet from staging into arena (gameplay-key)
  - inspect: lore-note about gate mechanics
narrative_role:      pet-entry gates; gameplay-active during matches
lore_anchor:         loredex.system.pet_arena
art_status:          producer_handoff
gameplay_hook_id:    trpc.pet_arena.gate.dispatch
wear_state:          slight wear
physical_constraints: collides; opens to staging sub-space
```

#### A.29.9.11 The Player's Match-Coach Anchor (south central)

```
object_id:           ark.pet_arena.coach_anchor
object_class:        npc_anchor  (player's pet-coach position during matches)
position:            (0.00, -5.00, 0.00)  # at south edge of arena
dimensions:          0.80 × 0.80 × 1.80 (anchor)
rotation:            0°  (faces north, into arena)
material_primary:    n/a
material_secondary:  n/a
colour_value:        n/a
interaction:         interactable (during matches)
  - command_pet: open coaching UI; player issues pet-commands during fight
narrative_role:      where the player stands during their pet's match; coaches from sideline
lore_anchor:         arc.pet_combat
art_status:          producer_handoff
gameplay_hook_id:    trpc.pet_arena.coach.command
wear_state:          slight wear
physical_constraints: n/a
```

#### A.29.9.12 The Coach's Bench (south)

```
object_id:           ark.pet_arena.coach_bench
object_class:        furniture
position:            (0.00, -5.50, 0.00)
dimensions:          1.20 × 0.40 × 0.45
rotation:            0°  (faces north)
material_primary:    polished walnut + crimson-velvet padding
material_secondary:  brass armrests
colour_value:        --token-color-ark-pet-arena-coach-bench
interaction:         interactable - sit
narrative_role:      coach seating during matches
lore_anchor:         arc.pet_combat
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          slight wear
physical_constraints: collides; sittable
```

#### A.29.9.13-14 Two Banner Tapestries (east + west)

Specced in walls A.29.4. Inventoried for completeness.

#### A.29.9.15 Apsidal Relief

Specced in walls A.29.4 (north relief).

#### A.29.9.16-23 Atmosphere + Decorative Items (8 items)

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.pet_arena.fanfare_horn.east` | fx_emitter | (8.95, 13.50, 6.00) | 0.40 × 0.40 × 0.40 | bronze fanfare horn for match-start |
| `ark.pet_arena.fanfare_horn.west` | fx_emitter | mirror | mirror | fanfare horn |
| `ark.pet_arena.victory_pedestal` | decoration | (0.00, 12.00, 0.00) | 0.80 × 0.80 × 1.00 | bronze pedestal for victor presentation |
| `ark.pet_arena.tribute_pedestal` | decoration | (0.00, -3.50, 0.00) | 0.80 × 0.80 × 1.00 | bronze pedestal for tribute (fallen pets) |
| `ark.pet_arena.water_basin.east` | decoration | (8.50, 0.00, 0.00) | 0.40 × 0.40 × 0.40 | water basin (for pet hydration between rounds) |
| `ark.pet_arena.water_basin.west` | decoration | (-8.50, 0.00, 0.00) | mirror | water basin |
| `ark.pet_arena.sand_rake.east` | decoration | (8.95, -3.00, 0.00) | 0.20 × 0.20 × 1.40 | bronze sand-rake for between-match grooming |
| `ark.pet_arena.sand_rake.west` | decoration | (-8.95, -3.00, 0.00) | mirror | sand-rake |

#### A.29.9.24-31 Eight Concession Items (gallery refreshments)

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.pet_arena.gallery.refreshment_cart.east` | container | (8.50, 6.50, 0.40) on tier 1 | 0.80 × 0.40 × 0.85 | concession cart |
| `ark.pet_arena.gallery.refreshment_cart.west` | container | mirror | mirror | concession cart |
| `ark.pet_arena.gallery.tip_jar.east` | decoration | on east cart | 0.10 × 0.10 × 0.20 | bronze tip jar |
| `ark.pet_arena.gallery.tip_jar.west` | decoration | on west cart | mirror | tip jar |
| `ark.pet_arena.gallery.flag_stand.east.tier_1, .tier_2, .tier_3` | decoration | per tier | 0.20 × 0.20 × 0.40 each | small fan-flag stands |
| `ark.pet_arena.gallery.flag_stand.west.tier_1, .tier_2, .tier_3` (3) | decoration | mirror | mirror | flag stands |

#### A.29.9.32-38 Closing Items

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.pet_arena.south.intercom` | console | (-2.00, -6.95, 1.50) | 0.20 × 0.10 × 0.30 | comms relay |
| `ark.pet_arena.fire_extinguisher.south` | interactive | (2.00, -6.95, 1.20) | 0.20 × 0.20 × 0.50 | safety |
| `ark.pet_arena.first_aid.kit.south` | container | (-2.50, -6.95, 1.50) | 0.40 × 0.10 × 0.30 | medical |
| `ark.pet_arena.pet_first_aid.kit.coach_zone` | container | (1.00, -5.50, 0.00) | 0.40 × 0.20 × 0.40 | pet-medical kit (gameplay-active) |
| `ark.pet_arena.combat_energy_emitter` | fx_emitter | suspended at z = 7.00 | n/a | energy distortion source above oval |
| `ark.pet_arena.compass_inlay` | decoration | (0.00, 0.00, 0.005) | 1.40 × 1.40 × 0.005 | floor inlay at oval centre |
| `ark.pet_arena.crowd_emitter` | fx_emitter | distributed in galleries | n/a | crowd-roar SFX source |

Total: 38 inventory objects.

### A.29.10-17 Camera-spawn-points / Doorways / Adjacency / Hooks / Story / FX / Parametricity / Performance (compact)

```
camera_spawn_points:
  cs_amb_pet_arena (Cat B): POV at threshold; head turns to gallery + match-board; 18s
  cs_disc_pet_arena (Cat C): POV at coach anchor; arena lights up; pet roar + crowd cheer; 22s
  cs_load_pet_arena (Cat C): close-up at gate as it engages; 8s
  cs_first_pet_match (Act 3): POV at coach bench; first match begins

doorways:
  south.door.main: connects to ark.corridor.pet_approach; arch; Act 3+
  south.gate.east, .west: connect to staging sub-spaces (deferred); slide; Act 3+

adjacency:
  direct: ark.corridor.pet_approach (south); ark.pet_arena.staging.east + .west (south gates; deferred)
  one_hop: ark.pet_garden, ark.pet_medical_annex (via approach corridor)

gameplay_hooks:
  - dispatchPet: trpc.pet_arena.gate.dispatch
  - commandPet: trpc.pet_arena.coach.command (during match)
  - takeGalleryBench: trpc.pet_arena.tier_bench.sit
  - takeRefereeBox: trpc.pet_arena.referee_box.sit (rare; Mascoteer absent)
  - usePetFirstAid: trpc.pet_arena.pet_first_aid.use (between rounds)
  - inspectMatchBoard: trpc.pet_arena.match_board.inspect

story_tie:
  primary_arcs:
    - act_3_first_pet_match
    - pet_combat (continuous Acts 3-7)
    - pet_combat_progression (player rating + tournament rank)
    - mascoteer_arc (the Mascoteer's relationship with player evolves)
  per_act:
    acts_0_2: locked
    act_3: opens; first match available
    act_4: tournaments + faction-aligned matches
    act_5: pet-deaths begin to weigh; tribute pedestal more populated
    act_6: legendary matches (rare opponents)
    act_7: state-branched: champion ending vs. neglectful ending
  npc_roster: the_mascoteer (referee); pets (combatants); crowd_emitter (ambient)
  readables: creed plaque; eternal-combat relief; match schedule + player record displays
  master_of_rlyeh_question: n/a

special_fx:
  particle_systems: sand_drift; blood_motes; combat_energy_motes
  volumetric: oculus_glow; spotlight_volumetric_beams; combat_energy_distortion (during matches)
  procedural_animations: match_board_holo_cycle; banner_subtle_ripple; sand_subtle_settle; crowd_visualisation (cosmetic figures during matches)
  reactive: oculus_intensify_on_match; spotlights_on_match; banner_colour_shift_on_victory; tribute_brighten_on_pet_death

avatar_parametricity:
  small_xenomorph: alternate "lift platform" at coach anchor
  others: all-reachable (with tier-stair access)
  audio_occlusion: xenomorph: crowd-roar overwhelming during matches

performance:
  polygon_budget: 350,000 / texture_budget: 200 MB / light_count_limit: 22
  streaming_behaviour: preload pet_approach corridor; on_match_start: preload current pet-combat assets
```

---

## A.30 Pet Medical Annex — FULL

**Status: FULL spec.** Cross-ref: `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.30 (art-state prompts); companion to Pet Garden + Pet Arena.

### A.30.1 Header

```
space_id:        ark.pet_medical_annex
space_name:      Pet Medical Annex
space_type:      ark_room  (pocket dimension; clinical-warm)
act_introduced:  Act 3
lore_anchor:     loredex.system.pet_medical + arc.pet_health + arc.act_3_first_pet_treatment
aesthetic_tier:  solar_punk_cathedral  (clinical-warm hybrid; companion to Med Bay aesthetic but warmer)
```

### A.30.2 Geometry

```
dimensions:           8.00 m × 10.00 m × 4.00 m
origin_point:         centre of floor at south entrance
coordinate_axes:      +x = right, +y = forward, +z = up
floor_plan_geometry:  rectangular  (with apsidal rear — north wall slightly curved)
volumetric_anomalies: none in baseline
```

The Pet Medical Annex is small, focused, warm. Central
examination table for pet diagnostics. East cabinets hold
medicines + tools. West cabinets hold pet-records. North
recovery bay (3 pet beds) for resting pets. Soft lighting +
warm tones to calm pets.

Floor area: 80 m².

### A.30.3 Floor

```
material_primary:     polished cream-tinted enamel-coated steel deck plate (matches Med Bay aesthetic but warmer); 1.00 × 1.00 m tiles; 4 mm gap; anti-bacterial coating
material_secondary:   bronze inlay outlining examination zone (3 × 3 m square); brass perimeter trim
pattern:              clinical grid + central exam-zone marker
wear_state:           pristine; slight wear at exam table approach
embedded_features:
  - id: ark.pet_medical_annex.floor.charge_point.exam_table
    position: (0.00, 5.00, 0.00)
    dimensions: 0.40 × 0.40 × 0.05
    function: exam-table electronics + lighting power
  - id: ark.pet_medical_annex.floor.drain.south
    position: (0.00, 1.00, 0.00)
    dimensions: 0.30 × 0.30 × 0.10
    function: medical-fluid drain
  - id: ark.pet_medical_annex.floor.recovery_bay_anchor.<n>  (3 anchors at north)
    position: (-2.00, 9.00, 0.00), (0.00, 9.00, 0.00), (2.00, 9.00, 0.00)
    dimensions: 0.30 × 0.30 × 0.05 each
    function: pet-bed power
acoustic_property:    soft_absorbent (acoustic dampening for calm pets); RT60 = 0.30s (intentionally muted)
```

### A.30.4 Walls (compact)

- **South** (entrance): cream painted aluminium with walnut wainscoting; brass dado at z = 1.10 m; main door at (0.00, 0.00, 0.00) 1.20 × 2.40 pressure_seal door connecting to ark.corridor.pet_approach (Act 3+); plaque "EVERY LIFE COUNTS" at (0.00, 0.20, 3.20).
- **East** (medicine cabinets): cream walls with built-in walnut cabinets (3 cabinets stacked vertically at (3.95, 5.00, 0.00); 0.40 × 3.00 × 1.00 each); cabinets hold meds, tools, surgical kits; bronze nameplates per cabinet.
- **North** (apsidal rear; recovery bay): cream walls with 3 alcove-recesses for pet beds at z = 0.40; soft warm-amber backlight per alcove; relief above central alcove "REST WELL" in cast bronze.
- **West** (records cabinets + window): cream walls with built-in walnut cabinets (3 cabinets stacked at (-3.95, 5.00, 0.00); same dim as east); cabinets hold pet-records; observation window at (-3.95, 1.50, 1.80) 0.60 × 1.20 looking out at corridor.

### A.30.5 Ceiling

```
height_above_floor:     4.00 m baseline; central drop coffer at 3.50 m above exam table; apsidal vault at recovery bay rises to 4.50 m
material:               painted cream plaster with walnut crown-molding + apsidal-vault detail; central coffer is translucent panel
lighting_integrated:    central pendant over exam table; recessed warm-white grid; recovery-bay alcove ceilings have soft-warm glow
atmospheric_features:   subtle warm haze in apsidal vault during recovery (cosmetic; suggests "healing aura")
acoustic_treatment:     coffered + soft (intentional muted)
```

### A.30.6 Lighting

```
ambient_baseline:     3500 K (warm-clinical; calm); 200 lux at floor (intentionally soft); CRI 95
direct_fixtures:
  - id: ark.pet_medical_annex.light.exam_pendant
    position: (0.00, 5.00, 3.50)
    beam_angle: 60° downward
    colour: --token-color-ark-pet-medical-pendant  (warm white)
    intensity: 4500 lumens (precision required for diagnostics)
    function: principal exam task lighting
  - id: ark.pet_medical_annex.light.recovery_alcove_glow.<n>  (3 alcove backlights)
    position: each alcove
    beam_angle: 180° wash
    colour: --token-color-ark-pet-medical-recovery  (very warm amber)
    intensity: 600 lumens each
    function: recovery-zone calm
  - id: ark.pet_medical_annex.light.cabinet_strip.east, .west
    position: above each cabinet column at z = 3.20
    beam_angle: 90° downward
    colour: warm 3000 K
    intensity: 400 lumens per metre
    function: cabinet accent
practical_sources:
  - id: ark.pet_medical_annex.exam_table_glow
    position: (0.00, 5.00, 0.85)
    intensity: 200 lumens (when active diagnostic)
    flicker_pattern: stable
time_of_day_variation:
  acts_3_to_7: stable warm-calm; recovery alcoves dim further at "rest" hours
dynamic_response:
  - on_player_at_exam_table: exam_pendant + table_glow intensify
  - on_pet_in_recovery: alcove_glow dims to lullaby-warmth
```

### A.30.7 Atmosphere

```
air_temperature:    23°C (warm; pet-comfort)
humidity:           48% RH; smells of antiseptic + warm fur (when pets present) + soft hay + faint herbs
particulate:
  - dust: very low
  - fur_motes: low (when pets present)
volumetric_fog:     absent
wind_drift:         minimal; 0.02 m/s
smell_canon:        antiseptic + fur + hay + herbs; voice-line: "smells like care"
```

### A.30.8 Sound

```
ambient_bed:           file: pet_medical_ambient_bed_v1.ogg (loop); -38 dB; very quiet; faint pet-breath (when occupied), distant pet-vocalisation through walls, occasional medical-equipment beep
point_sources:
  - sound.exam_table_diagnostic_hum: at table; -38 dB; continuous
  - sound.recovery_bay_pet_breath.<n>: per occupied alcove; very faint slow breath; -42 dB
  - sound.cabinet_buzz: at cabinets; -42 dB; continuous
  - sound.medical_equipment_chirp: random; -40 dB; period 60-180s
reverb_zone:           IR-impulse: pet_medical_v1.wav; wet-mix 14% (intimate, calm)
music_eligibility:     cutscene only (lullaby-style ambient during scripted moments)
voice_line_eligibility:
  - speaker: the_pet_medic (named NPC; rare presence): line set §2.30.2
  - speaker: vex_solene: rare appearance for cross-species emergencies
```

### A.30.9 Object inventory (compact)

Pet Medical Annex has 24 inventory objects.

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.pet_medical_annex.exam_table` | furniture | (0.00, 5.00, 0.00) | 1.80 × 0.80 × 0.85 | central exam table; cushioned + heated |
| `ark.pet_medical_annex.exam_table.diagnostic_arm` | fx_emitter | suspended above table | 0.20 × 0.40 × 0.10 | diagnostic-overlay arm |
| `ark.pet_medical_annex.exam_table.lamp` | fx_emitter | suspended above | 0.20 × 0.20 × 0.30 | task lamp |
| `ark.pet_medical_annex.exam_chair_pet_owner` | furniture | (0.00, 3.50, 0.00) | 0.80 × 0.80 × 1.20 | owner's chair (player sits while pet examined) |
| `ark.pet_medical_annex.east.cabinet.medicines.<n>` (3) | container | (3.95, 5.00, 0/1/2) | 0.40 × 3.00 × 1.00 each | medicines, tools, surgical |
| `ark.pet_medical_annex.west.cabinet.records.<n>` (3) | container | (-3.95, 5.00, 0/1/2) | 0.40 × 3.00 × 1.00 each | pet records, history, breeding logs |
| `ark.pet_medical_annex.recovery_bed.<n>` (3) | furniture | (-2.00/0.00/+2.00, 9.00, 0.40) | 1.20 × 0.80 × 0.40 each | cushioned pet beds in alcoves |
| `ark.pet_medical_annex.recovery_water_bowl.<n>` (3) | decoration | per alcove | 0.20 × 0.20 × 0.10 each | water bowl |
| `ark.pet_medical_annex.medic_anchor` | npc_anchor | (-1.50, 5.00, 0.00) | 0.80 × 0.80 × 1.80 | Pet Medic NPC anchor |
| `ark.pet_medical_annex.south.intercom` | console | (-1.00, 0.20, 1.50) | 0.20 × 0.10 × 0.30 | comms relay |
| `ark.pet_medical_annex.fire_extinguisher.south` | interactive | (1.00, 0.20, 1.20) | 0.20 × 0.20 × 0.50 | safety |
| `ark.pet_medical_annex.first_aid.kit.south` | container | (-2.00, 0.20, 1.50) | 0.40 × 0.10 × 0.30 | medical (humanoid) |
| `ark.pet_medical_annex.south.plaque.creed` | decoration | (0.00, 0.20, 3.20) | 1.00 × 0.40 × 0.02 | "EVERY LIFE COUNTS" |
| `ark.pet_medical_annex.north.relief.rest_well` | decoration | (0.00, 9.85, 3.50) | 1.20 × 0.40 × 0.10 | "REST WELL" relief |
| `ark.pet_medical_annex.west.observation_window` | decoration | (-3.95, 1.50, 1.80) | 0.60 × 1.20 × 0.05 | corridor view |
| `ark.pet_medical_annex.recovery_alcove_glow_emitter.<n>` (3) | fx_emitter | per alcove ceiling | n/a | warm alcove glow |

Total: 24 inventory objects.

### A.30.10-17 Compact

```
camera_spawn_points:
  cs_amb_pet_medical (Cat B): POV at threshold; head turns to recovery alcoves; 14s
  cs_first_pet_treatment (Act 3): POV at exam table; pet placed by player; diagnostic begins

doorways:
  south.door.main: connects to ark.corridor.pet_approach; pressure_seal; Act 3+

adjacency:
  direct: ark.corridor.pet_approach (south)
  one_hop: ark.pet_garden, ark.pet_arena (via approach)

gameplay_hooks:
  - operateExamTable: trpc.pet_medical.exam_table.operate
  - openMedicineCabinet: trpc.pet_medical.cabinet.east.open
  - openRecordsCabinet: trpc.pet_medical.cabinet.west.open
  - placePetInRecovery: trpc.pet_medical.recovery_bed.place

story_tie:
  primary_arcs: act_3_first_pet_treatment; pet_health (continuous)
  per_act: locked Acts 0-2; opens Act 3; deepens Acts 4-7
  npc_roster: the_pet_medic; vex_solene (rare cross-species emergencies)
  readables: creed plaque; "REST WELL" relief; pet-records cabinet contents
  master_of_rlyeh_question: n/a

special_fx:
  particle_systems: dust (very low); fur_motes (when pets present); diagnostic_holo_motes (during exam)
  procedural_animations: diagnostic_arm_subtle_motion; recovery_bed_pet_breath; alcove_glow_breath
  reactive: exam_pendant_intensify_on_player_proximity; alcove_dim_when_pet_resting

avatar_parametricity: standard (small/short/avg/tall scales)
audio_occlusion: xenomorph-sensitive: pet-breath audible across room

performance:
  polygon_budget: 160,000 / texture_budget: 90 MB / light_count_limit: 10
  streaming_behaviour: preload pet_approach corridor
```

---

## A.31 Trade Hub — FULL

**Status: FULL spec.** Cross-ref: `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.31 (art-state prompts) and §A.32 Trade Command Center
(adjacent broker's office sub-room).

### A.31.1 Header

```
space_id:        ark.trade_hub
space_name:      Trade Hub
space_type:      ark_room
act_introduced:  Act 2
lore_anchor:     loredex.system.trade + arc.trade_empire + arc.act_2_first_trade_session
aesthetic_tier:  solar_punk_cathedral  (with mercantile-ornate accents — the most aesthetically rich Ark room outside the cathedral spaces)
```

### A.31.2 Geometry

```
dimensions:           18.00 m × 18.00 m × 6.00 m  (bounding box; hexagonal footprint inscribed)
origin_point:         centre of floor (room is hexagonal; origin at geometric centre)
coordinate_axes:      +x = right, +y = forward (north), +z = up
floor_plan_geometry:  hexagonal  (regular hexagon; 9.00 m apothem; primary entrance at south face)
volumetric_anomalies: none in baseline
```

The Trade Hub is hexagonal — six trade-stations occupy the six
corners (one per faction trade route + galactic markets). The
central area is a galactic-trade holo-table where players see
all trade routes in 3D. Freight elevator from Cargo Hold opens
on the south face.

Floor area: ~234 m².

### A.31.3 Floor

```
material_primary:     polished marble in alternating gold and obsidian-black tile pattern; 0.60 m × 0.60 m tiles in radial-from-centre pattern
material_secondary:   bronze inlay forming a 6-pointed star centred on holo-table; gold-leaf accents in the 6 trade-station zones
pattern:              radial 6-arm star (one arm per trade station) + central hexagonal hub
wear_state:           pristine; slight wear-trail to most-used trade stations (varies by player's trade activity)
embedded_features:
  - id: ark.trade_hub.floor.charge_point.holo_table
    position: (0.00, 0.00, 0.00)  # at room centre
    dimensions: 0.40 × 0.40 × 0.05
    function: holo-table power
  - id: ark.trade_hub.floor.trade_station_anchor.<n>  (6 anchors at the 6 hexagonal corners)
    position: at each station base (radius 7.50 m from centre)
    dimensions: 0.60 × 0.60 × 0.05 each
    function: trade-station electronics
  - id: ark.trade_hub.floor.elevator_threshold
    position: (0.00, -7.50, 0.00)  # at south face entry
    dimensions: 2.40 × 0.20 × 0.10
    function: freight elevator threshold marker
acoustic_property:    hard_reflective (marble); RT60 = 0.65s (rich; supports market-bustle atmosphere)
```

### A.31.4 Walls

The Trade Hub has 6 walls forming a regular hexagon. Each wall
is a "trade-quadrant" and carries either a trade-station booth
or a structural connector.

#### Wall: South (entrance + freight elevator)

```
wall_id:              south
material_primary:     polished marble cladding with carved trade-relief details (figures of merchants from various cultures); elevator door at centre
material_secondary:   gold dado at z = 1.20 m
panelisation:         single curved face (hexagonal corner)
colour_value:         --token-color-ark-trade-hub-wall-south  (warm cream marble + gold accents)
embedded_displays:
  - id: ark.trade_hub.south.display.market_status
    position: (-3.00, -7.95, 1.80)
    dimensions: 1.20 × 0.80 × 0.05
    content: live galactic market overview
  - id: ark.trade_hub.south.display.player_trade_history
    position: (3.00, -7.95, 1.80)
    dimensions: 1.20 × 0.80 × 0.05
    content: player's trade history + reputation per faction
embedded_doors:
  - door_id: ark.trade_hub.south.elevator.freight
    position: (0.00, -7.95, 0.00)
    dimensions: 2.40 × 3.00 × 0.10  (large freight elevator door from Cargo Hold)
    door_class: slide  (elevator)
    connecting_space_id: ark.cargo_hold
    unlock_condition: Act 2+
  - door_id: ark.trade_hub.south.door.broker
    position: (-5.00, -7.95, 0.00)  # west of elevator
    dimensions: 1.40 × 2.40 × 0.10
    door_class: slide
    connecting_space_id: ark.trade_command_center  (sub-room A.32)
    unlock_condition: Act 2+
decorative_features:
  - id: ark.trade_hub.south.plaque.principle
    position: (0.00, -7.95, 3.20)
    dimensions: 1.20 × 0.40 × 0.02
    material: cast bronze with gilt text
    narrative_role: reads "FAIR TRADE BUILDS WORLDS"
```

#### Walls: SE, NE, N, NW, SW (the 5 trade-station walls)

Each wall has a similar structure — gold-and-marble alcove with
trade-station booth.

```
wall_id:              southeast, northeast, north, northwest, southwest  (5 walls)
material_primary:     polished marble with gold-leaf trade-route motifs in low relief
material_secondary:   gold dado
panelisation:         hexagonal-corner curved faces
colour_value:         --token-color-ark-trade-hub-wall  (warm cream + gold)
embedded_displays:
  - id: ark.trade_hub.<wall>.display.route_status  (5 displays; one per non-south wall)
    position: at each trade-station booth
    dimensions: 0.80 × 0.60 × 0.05
    content: trade-route specific status
embedded_doors:        none (only the south face has doors)
decorative_features:
  - id: ark.trade_hub.<wall>.trade_station_alcove  (5 alcoves; specced in inventory)
    position: per wall corner
    dimensions: 2.40 × 1.20 × 4.00 each
    material: marble with gold trim
    narrative_role: hosts a trade-station booth (one per faction trade route)
```

(Five trade routes per Phase 1.5 catalog: Galactic Markets,
Architect Remnants Routes, New Babylon Routes, Hierarchy Routes,
Insurgency Routes. Sixth quadrant — south — is the entry.)

### A.31.5 Ceiling

```
height_above_floor:     6.00 m baseline; central hexagonal dome rises to 7.50 m above holo-table
material:               polished marble cladding with gold-leaf coffer pattern radiating from central dome; 6 dome-spokes align with trade-station alcoves
lighting_integrated:    central oculus dome (warm golden emitter); recessed strip-lights in each dome-spoke; trade-station booth ceilings have task-lighting
atmospheric_features:   subtle dust-motes in oculus light shaft (reinforces "cathedral of commerce" feel)
acoustic_treatment:     coffered + dome-resonant (supports market-bustle warm acoustic)
```

### A.31.6 Lighting

```
ambient_baseline:     3000 K (warm; mercantile-rich); 220 lux at floor level; CRI 95
direct_fixtures:
  - id: ark.trade_hub.light.oculus_dome
    position: (0.00, 0.00, 7.50)
    beam_angle: 60° downward (illuminates holo-table)
    colour: --token-color-ark-trade-hub-oculus  (warm gold-amber)
    intensity: 7000 lumens
    function: principal task lighting at holo-table
  - id: ark.trade_hub.light.dome_spoke_strip.<n>  (6 spokes)
    position: along dome spokes from oculus to walls
    beam_angle: 90° downward
    colour: --token-color-ark-trade-hub-dome-spoke  (warm amber)
    intensity: 1200 lumens per metre
    function: defines hexagonal symmetry; visually directs eye toward trade stations
  - id: ark.trade_hub.light.trade_station_task.<n>  (5 task lights; one per trade station)
    position: above each station booth at z = 4.00
    beam_angle: 60° downward
    colour: 2700 K very warm
    intensity: 2500 lumens each
    function: trade-station task lighting (warm; encourages "deal-making" atmosphere)
practical_sources:
  - id: ark.trade_hub.holo_table_glow
    position: (0.00, 0.00, 1.10)  # holo-table top
    intensity: 600 lumens (variable; matches table content)
    flicker_pattern: stable
  - id: ark.trade_hub.trade_station_indicator.<n>  (5 indicators)
    position: per station
    intensity: 80 lumens (stable; varies by route activity)
    flicker_pattern: stable
time_of_day_variation:
  acts_2_to_7: stable; in late-act7, if player is well-traded, trade-station task lights warm + bright; if neglectful, they dim
dynamic_response:
  - on_player_at_holo_table: oculus_dome intensifies 20%
  - on_trade_completion: nearby station task light brightens briefly
  - on_market_event: oculus_dome pulses
```

### A.31.7 Atmosphere

```
air_temperature:    22°C (warm-comfortable; encourages dwelling)
humidity:           45% RH; smells of leather (trade goods) + spices (galactic markets) + faint coffee + warm marble
particulate:
  - dust_motes: low (visible in oculus light)
  - market_particles: very low (cosmetic; suggests goods being moved)
volumetric_fog:     absent in baseline
wind_drift:         minimal; 0.04 m/s; subtle inward-spiral toward holo-table
smell_canon:        leather + spices + coffee + warm marble; voice-line: "smells like the world's commerce"
```

### A.31.8 Sound

```
ambient_bed:           file: trade_hub_ambient_bed_v1.ogg (loop); -32 dB; subtle market-bustle (faint distant chatter; merchants' voices), occasional bell-toll (transaction completion), faint coin-clatter
point_sources:
  - sound.bell_toll_transaction: dynamic; subtle bell on each completed trade; -34 dB
  - sound.holo_table_hum: at holo-table; -38 dB; continuous
  - sound.distant_merchant_voices: dynamic; -42 dB; ambient cyclic
  - sound.coin_clatter: random; -36 dB; period 60-120s
reverb_zone:           IR-impulse: trade_hub_v1.wav; wet-mix 26%
music_eligibility:     cutscene only (Category B cs_amb_trade_hub + Category C cs_disc_trade_empire + cs_load_trade_empire)
voice_line_eligibility:
  - speaker: trade_clerks (5 per trade route; named NPCs): trigger presence; line set §2.31.2
  - speaker: trade_hub_announcer: ambient voice for transaction completions
```

### A.31.9 Object inventory

Trade Hub has 42 inventory objects.

#### A.31.9.1 The Galactic Trade Holo-Table (centre)

```
object_id:           ark.trade_hub.holo_table.galactic
object_class:        display
position:            (0.00, 0.00, 0.00)
dimensions:          3.00 × 3.00 × 1.05  (hexagonal footprint with circular projection above)
rotation:            0°
material_primary:    brushed-titanium frame with gold inlay; matte-black holographic projection surface
material_secondary:  gold edge-trim with 6-route status indicators at corners
colour_value:        --token-color-ark-trade-hub-holo-table  (titanium-black with gold; hologram is variable cosmic-blue)
interaction:         interactable
  - operate: spawns 3D galactic trade-route map (interactive); player can plan trades + see prices
  - inspect: lore-note about trade-table system
narrative_role:      THE primary Trade Empire gameplay-launcher; player initiates all trade missions here
lore_anchor:         loredex.system.trade + arc.trade_empire
art_status:          producer_handoff
gameplay_hook_id:    trpc.trade.holo_table.operate
wear_state:          slight wear at most-touched corners
physical_constraints: collides; player can lean
```

#### A.31.9.2-6 Five Trade-Station Booths (one per non-south wall)

```
object_id:           ark.trade_hub.trade_station.<route>  (5 stations)
object_class:        interactive  (also npc_anchor — clerk anchors here)
positions:           per A.31.4 walls (5 stations at hexagonal corners SE, NE, N, NW, SW)
dimensions (each):   2.40 × 1.20 × 1.10  (booth counter)
rotation:            varies (faces room centre)
material_primary:    polished walnut counter with marble inset; brass trim
material_secondary:  bronze nameplate per route ("Galactic Markets", "Architect Remnants", "New Babylon", "Hierarchy", "Insurgency")
colour_value:        --token-color-ark-trade-hub-station
interaction:         interactable
  - operate: opens trade-route specific UI (player engages with that faction's trade)
  - inspect: lore-note about that route's trade philosophy
narrative_role:      per-route trade transactions; clerks (NPCs) staff each station
lore_anchor:         per-faction trade
art_status:          producer_handoff
gameplay_hook_id:    trpc.trade.station.operate
wear_state:          worn at most-used stations (varies)
physical_constraints: collides
```

#### A.31.9.7-11 Five Trade-Clerk Anchors (NPC anchors; one per station)

```
object_id:           ark.trade_hub.trade_clerk_anchor.<route>  (5 anchors)
object_class:        npc_anchor
positions:           behind each station (interior side)
dimensions (each):   0.80 × 0.80 × 1.80 (anchor)
rotation:            varies (faces customer-side)
material_primary:    n/a
material_secondary:  n/a
colour_value:        n/a
interaction:         n/a (NPC presence; clerks are part of dialogue)
narrative_role:      clerks staff each station; player negotiates here
lore_anchor:         per-clerk lore
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          n/a
physical_constraints: n/a
```

#### A.31.9.12-21 Customer Seats (10 stools at trade stations; 2 per station)

```
object_id:           ark.trade_hub.trade_stool.<route>.<side>  (10 stools)
object_class:        furniture
positions:           2 per trade station, in front of counter
dimensions (each):   0.40 × 0.40 × 0.85  (bar-stool height; faces counter)
rotation:            varies
material_primary:    polished walnut with charcoal-leather seat
material_secondary:  brass footrest
colour_value:        --token-color-ark-trade-hub-stool
interaction:         interactable - sit
narrative_role:      where the player sits to negotiate
lore_anchor:         arc.trade_empire
art_status:          producer_handoff
gameplay_hook_id:    none (positional; opens trade UI when interacting with station while seated)
wear_state:          slight wear
physical_constraints: collides; sittable
```

#### A.31.9.22-26 Five Decorative Trade-Goods Display Cabinets

```
object_id:           ark.trade_hub.goods_display.<route>  (5 displays; one beside each trade station)
object_class:        decoration
positions:           at each trade station booth
dimensions (each):   0.80 × 0.60 × 1.80
rotation:            varies
material_primary:    walnut with glass front + gold trim
material_secondary:  per-route theming (galactic = star-charts; architect = blueprints; new babylon = ledgers; hierarchy = ritual artifacts; insurgency = encrypted devices)
colour_value:        --token-color-ark-trade-hub-goods-display
interaction:         inspectable
  - inspect: opens display UI (showcases route's specialty goods)
narrative_role:      visual route-flavoring; each display tells the route's character
lore_anchor:         per-route
art_status:          producer_handoff
gameplay_hook_id:    trpc.trade.goods_display.inspect
wear_state:          slight wear at glass front
physical_constraints: collides
```

#### A.31.9.27-32 Six Decorative Lighting Stands

```
object_id:           ark.trade_hub.lighting_stand.<n>  (6 stands; one at each hexagonal corner near walls)
object_class:        decoration  (also fx_emitter — soft glow)
positions:           at hexagonal corners between trade stations
dimensions (each):   0.30 × 0.30 × 1.40
rotation:            varies
material_primary:    cast bronze with gilt detail
material_secondary:  warm-amber light-globe at top
colour_value:        --token-color-ark-trade-hub-lighting-stand
interaction:         inert
narrative_role:      reinforces hexagonal geometry; warm ambient
lore_anchor:         loredex.aesthetic.solar_punk_cathedral
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          slight patina
physical_constraints: collides
```

#### A.31.9.33-37 Closing Items

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.trade_hub.south.intercom` | console | (-2.00, -7.95, 1.50) on south wall | 0.20 × 0.10 × 0.30 | comms relay |
| `ark.trade_hub.fire_extinguisher.south` | interactive | (2.00, -7.95, 1.20) | 0.20 × 0.20 × 0.50 | safety |
| `ark.trade_hub.first_aid.kit` | container | (-3.50, -7.95, 1.50) | 0.40 × 0.10 × 0.30 | medical |
| `ark.trade_hub.compass_inlay` | decoration | (0.00, 0.00, 0.005) | 1.40 × 1.40 × 0.005 | floor inlay (compass-rose under holo-table) |
| `ark.trade_hub.market_bell` | interactive | (0.00, 7.50, 1.20) on north wall | 0.30 × 0.30 × 0.40 | bronze bell (rung at major trade events) |

#### A.31.9.38-42 Atmospheric Closing

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.trade_hub.merchant_bench.east_arc` | furniture | (4.00, 4.00, 0.00) | 1.40 × 0.40 × 0.45 | spectator bench (curved to follow hex) |
| `ark.trade_hub.merchant_bench.west_arc` | furniture | (-4.00, 4.00, 0.00) | mirror | bench |
| `ark.trade_hub.market_table.south` | furniture | (0.00, -4.00, 0.00) | 1.20 × 0.80 × 0.85 | small table for casual deal-making |
| `ark.trade_hub.market_chair.south.east, .west` | furniture | flanking south table | 0.80 × 0.80 × 1.20 each | seating |
| `ark.trade_hub.distant_merchant_voices_emitter` | fx_emitter | dynamic | n/a | ambient market chatter source |

Total: 42 inventory objects.

### A.31.10 Camera-spawn-points (FPV cutscenes)

```
cutscene_id:         cs_amb_trade_hub  (Category B; deferred)
camera_position:     (0.00, -7.50, eye_level)
camera_facing:       (0°, 5°, 0°)
avatar_height_anchor: eye_level
head_motion:         slow walk-pan into hexagonal hub; head turns to scan trade stations; lasts 22s

cutscene_id:         cs_disc_trade_empire  (Category C discovery)
camera_position:     (0.00, -2.00, eye_level)  # at holo-table approach
camera_facing:       (0°, -10°, 0°)
avatar_height_anchor: eye_level
head_motion:         hands enter frame at holo-table; star-map zooms through trade routes; bell-toll chord; lasts 22s

cutscene_id:         cs_load_trade_empire  (Category C loading)
camera_position:     (0.00, 0.00, eye_level)  # at holo-table
camera_facing:       (0°, -25°, 0°)
avatar_height_anchor: eye_level
head_motion:         star-map zooms; trade-route selection; lasts 8s
```

### A.31.11 Doorways

```
door_id:            ark.trade_hub.south.elevator.freight
connecting_space_id: ark.cargo_hold
door_position:      (0.00, -7.95, 0.00)
door_dimensions:    2.40 × 3.00 × 0.10
door_class:         slide  (elevator)
unlock_condition:   Act 2+
transit_animation:  elevator-cycle (4s descent)
audio_signature:    elevator-mechanical engagement + bell-toll on arrival

door_id:            ark.trade_hub.south.door.broker
connecting_space_id: ark.trade_command_center
door_position:      (-5.00, -7.95, 0.00)
door_dimensions:    1.40 × 2.40 × 0.10
door_class:         slide
unlock_condition:   Act 2+
transit_animation:  fade
audio_signature:    pneumatic-hiss
```

### A.31.12 Adjacency map

```
direct_adjacencies:
  - ark.cargo_hold (south freight elevator)
  - ark.trade_command_center (south door; broker's office sub-room)
one_hop_adjacencies:
  - ark.engineering_bay (via cargo + Engineering corridor)
  - ark.armory (via Engineering Bay)
state_shared_with:
  - ark.cargo_hold (cargo inventory cross-references trade activity)
  - ark.trade_command_center (deeper broker tools)
```

### A.31.13 Gameplay hooks

```
hooks:
  - hook_id:         trade_hub.operateHoloTable
    trigger:         player.operate on holo_table.galactic
    procedure:       trpc.trade.holo_table.operate
    success_state:   trade_view_active = true
  - hook_id:         trade_hub.startTradeMission
    trigger:         player.operate on holo_table + select_route
    procedure:       trpc.trade.startMission
    success_state:   trade_mission_started = true
  - hook_id:         trade_hub.engageStation
    trigger:         player.operate on trade_station.<route>
    procedure:       trpc.trade.station.operate
    success_state:   station_active = true (per-route)
  - hook_id:         trade_hub.inspectGoodsDisplay
    trigger:         player.inspect on goods_display.<route>
    procedure:       trpc.trade.goods_display.inspect
    success_state:   goods_inspected = true
  - hook_id:         trade_hub.takeStool
    trigger:         player.sit on trade_stool.<route>.<side>
    procedure:       trpc.trade.stool.sit
    success_state:   stool_active = true (positional; opens trade UI when paired with station)
  - hook_id:         trade_hub.ringMarketBell
    trigger:         (state-conditional) player.interact on market_bell after major trade
    procedure:       trpc.trade.market_bell.ring
    success_state:   bell_rung = true (lore-flag; ambient SFX cascade)
```

### A.31.14 Story-tie

```
primary_arcs:
  - arc.act_2_first_trade_session
  - arc.trade_empire (continuous; central to Acts 3-7)
  - arc.faction_trade_relationships (per-route reputation tracks)
  - arc.galactic_market_dynamics
per_act_evolution:
  acts_0_1: room locked
  act_2: opens; player can engage all 5 trade routes; first trades shape faction reputations
  act_3: more goods unlock; clerks become familiar with player
  act_4: market events drive route dynamics (some routes prosper; others decline based on player choices + canon events)
  act_5: deeper broker negotiations available (cross-ref §A.32 Trade Command Center)
  act_6: galactic-market crisis events; player can intervene
  act_7: state-branched: trade-titan ending (well-traded across all 5; warehouse full) vs. minimal-trader ending
npc_roster:
  - the_trade_clerks: 5 named NPCs (one per route); rotating shift
  - the_galactic_broker: rare appearance for high-stakes deals
  - the_player: visitor / trader
  - distant_merchants: ambient atmosphere only
readables:
  - principle plaque (south)
  - market status display (south)
  - player trade history display (south)
  - 5 route-status displays (per-station)
  - 5 goods display cabinets (per-route lore)
master_of_rlyeh_question: n/a
```

### A.31.15 Special-FX

```
particle_systems:
  - dust_motes (low; visible in oculus light)
  - market_particles (very low; cosmetic — coins glinting, papers fluttering)
volumetric_effects:
  - oculus_volumetric_beam (golden cone above holo-table)
  - dome_spoke_glow_envelope (subtle volumetric glow defining hex symmetry)
procedural_animations:
  - holo_table_galactic_drift (continuous; slow rotation of star-map)
  - trade_station_indicator_pulse (per-station; varies by route activity)
  - distant_merchants_visualisation (rare; figures cross at distant doorway)
  - market_bell_subtle_resonance (very subtle vibration; cosmetic)
reactive_systems:
  - holo_table_glow_on_proximity
  - station_task_light_intensify_on_engagement
  - bell_resonance_on_trade_completion (one-shot per major deal)
  - dome_oculus_pulse_on_market_event
```

### A.31.16 Avatar-parametricity

```
camera_height_variation:
  small_xenomorph (0.85m eye): 0.85m; trade-station counters at chest-level; alternate stand-on-stool
  short_humanoid (1.40m eye): standard
  average_humanoid (1.70m eye): standard
  tall_humanoid (2.05m eye): comfortable; counters at hip
  tall_xenomorph (2.70m eye): counters too low; alternate kneel-at-counter for negotiations
reachability:
  small_xenomorph: cannot reach top of goods-display cabinets; relay-inspect from below
  others: all-reachable
audio_occlusion_variation:
  xenomorph_sensitive_hearing: market-bustle more pronounced; bell-toll richer
  synthetic_voice_avatar: clerks' voices have subtle resonance bias (synthetic interprets warm-velvet acoustics differently)
```

### A.31.17 Performance

```
polygon_budget:      330,000 polygons (rich decoration; many trade stations + display cabinets)
texture_budget:      190 MB total
light_count_limit:   20 simultaneous dynamic lights
lod_plan:
  - hero_distance: 0-12m, full detail
  - mid_distance: 12-25m, mid detail (decoration simplified)
  - low_distance: 25m+, low detail
streaming_behaviour:
  - preload: ark.cargo_hold (south elevator)
  - preload: ark.trade_command_center (south door)
  - on_holo_table_active: preload destination.galactic_trade_routes (current route only)
```

---

## A.32 Trade Command Center / Broker's Office — FULL

**Status: FULL spec.** Cross-ref: `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.32 (art-state prompts); sub-room of Trade Hub §A.31.

### A.32.1 Header

```
space_id:        ark.trade_command_center
space_name:      Trade Command Center / Broker's Office
space_type:      ark_room  (sub-room of Trade Hub; deeper-than-counter trade negotiations)
act_introduced:  Act 2
lore_anchor:     loredex.system.trade + arc.broker_arc + arc.act_2_first_broker_meeting
aesthetic_tier:  solar_punk_cathedral  (executive accents — wood-and-leather formal)
```

### A.32.2 Geometry

```
dimensions:           9.00 m × 11.00 m × 4.50 m
origin_point:         centre of floor at south entrance (door from Trade Hub)
coordinate_axes:      +x = right, +y = forward (north), +z = up
floor_plan_geometry:  rectangular  (with broker's desk at north end + private vault recess)
volumetric_anomalies: none
```

The Trade Command Center is the broker's private office; smaller
than the public Trade Hub, more formal, more intimate. Broker's
desk dominates the north end. Two visitor chairs face desk.
Side cabinets along east and west walls hold sealed contracts +
trade agreements. A small private vault recesses into the north
wall (deeper trades require vault access).

Floor area: 99 m².

### A.32.3 Floor

```
material_primary:     polished walnut hardwood plank in herringbone; 0.20 × 1.20 m planks at 45° from south wall
material_secondary:   wool rug (forest-green with gold border) covering desk-area (3.00 × 4.00 m); brass walkway-strip from entrance
pattern:              herringbone with rug accent
wear_state:           pristine in early acts; slight wear-trail to desk
embedded_features:
  - id: ark.trade_command_center.floor.charge_point.broker_desk
    position: (0.00, 8.00, 0.00)  # under broker's desk
    dimensions: 0.40 × 0.40 × 0.05
    function: desk + lamp power
  - id: ark.trade_command_center.floor.heating_grate
    position: (0.00, 1.50, 0.00)
    dimensions: 0.40 × 0.40 × 0.05
    function: under-floor heating
acoustic_property:    soft_absorbent (rug + upholstery + drapery); RT60 = 0.35s (intentionally dampened — confidentiality)
```

### A.32.4 Walls

#### Wall: South (entrance from Trade Hub)

```
wall_id:              south
material_primary:     painted plaster with walnut wainscoting (z = 0.00 to 1.20); cream plaster above
material_secondary:   walnut chair-rail at z = 1.20; crown-molding at z = 4.30
panelisation:         standard
colour_value:         --token-color-ark-trade-command-center-wall-south  (warm cream + walnut)
embedded_displays:
  - id: ark.trade_command_center.south.display.contract_status
    position: (-2.50, 0.20, 1.80)
    dimensions: 0.80 × 0.60 × 0.05
    content: live contract status; player's active deals
embedded_doors:
  - door_id: ark.trade_command_center.south.door.main
    position: (0.00, 0.00, 0.00)
    dimensions: 1.40 × 2.40 × 0.10
    door_class: slide  (warm walnut frame; brass handle)
    connecting_space_id: ark.trade_hub
decorative_features:
  - id: ark.trade_command_center.south.plaque.discretion
    position: (0.00, 0.20, 3.20)
    dimensions: 0.80 × 0.30 × 0.02
    material: brass with engraved text
    narrative_role: reads "DISCRETION IS THE FIRST CURRENCY"
```

#### Wall: East (contract cabinets)

```
wall_id:              east
material_primary:     painted plaster with walnut wainscoting
material_secondary:   walnut chair-rail
panelisation:         standard
colour_value:         --token-color-ark-trade-command-center-wall-east
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: ark.trade_command_center.east.cabinet.contracts
    position: (4.45, 5.50, 0.00)
    dimensions: 0.40 × 4.00 × 2.40
    material: walnut cabinet with brass handles + glass display panels
    narrative_role: sealed contracts archive; gameplay-key for replay/lookup
  - id: ark.trade_command_center.east.painting.first_broker
    position: (4.45, 9.50, 1.80)
    dimensions: 0.60 × 0.80 × 0.04
    material: oil portrait of first Ark broker
    narrative_role: lineage acknowledgment
```

#### Wall: North (broker's desk + vault)

```
wall_id:              north
material_primary:     painted plaster with full-height walnut paneling (executive aesthetic; no plaster above wainscoting on this wall)
material_secondary:   crown-molding at z = 4.30
panelisation:         3 panels: west panel (decorative), centre panel (vault recess), east panel (decorative)
colour_value:         --token-color-ark-trade-command-center-wall-north
embedded_displays:
  - id: ark.trade_command_center.north.display.market_overview
    position: (-2.00, 10.95, 2.00)
    dimensions: 1.20 × 0.80 × 0.05
    content: galactic market overview (executive view)
embedded_doors:
  - door_id: ark.trade_command_center.north.vault_door
    position: (0.00, 10.95, 0.00)
    dimensions: 1.20 × 2.40 × 0.20  (deep vault door)
    door_class: pressure_seal  (vault-class; biometric authentication)
    connecting_space_id: ark.trade_command_center.private_vault  (sub-space; deferred from FULL spec; treat as inaccessible alcove)
    unlock_condition: Act 4+ (broker grants access for high-stakes trades)
decorative_features:
  - id: ark.trade_command_center.north.decorative_panel.east_west
    position: flanking vault door
    dimensions: 1.50 × 0.10 × 4.20 each
    material: walnut with carved trade-route motifs
    narrative_role: executive aesthetic
  - id: ark.trade_command_center.north.relief.scales_of_trade
    position: (0.00, 10.95, 3.50)  # above vault
    dimensions: 1.40 × 0.40 × 0.10
    material: cast bronze
    narrative_role: scales-of-balance relief; reads "WEIGHT TRUE / WEIGHT FAIR"
```

#### Wall: West (mirror cabinets)

```
wall_id:              west
material_primary:     same as east
material_secondary:   walnut chair-rail
panelisation:         standard
colour_value:         --token-color-ark-trade-command-center-wall-west
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: ark.trade_command_center.west.cabinet.records (mirror of east)
    position: (-4.45, 5.50, 0.00)
    dimensions: 0.40 × 4.00 × 2.40
    material: walnut + brass + glass
    narrative_role: trade records archive (companion to east contracts)
  - id: ark.trade_command_center.west.painting.last_broker
    position: (-4.45, 9.50, 1.80)
    dimensions: 0.60 × 0.80 × 0.04
    material: oil portrait — uncanny: depicts a broker who has not yet served (future-broker; portrait shifts subtly Acts 5+)
    narrative_role: uncanny lineage; complements east first-broker portrait
```

### A.32.5 Ceiling

```
height_above_floor:     4.50 m baseline; central coffered area above desk
material:               painted plaster with walnut crown-molding + coffered detailing (3 × 3 grid of square coffers)
lighting_integrated:    central pendant chandelier; recessed strip-lights in coffers; cabinet task-lights
atmospheric_features:   minimal — executive office discretion
acoustic_treatment:     coffered + upholstery
```

### A.32.6 Lighting

```
ambient_baseline:     2700 K (very warm; executive); 180 lux at floor (intentionally dim — confidential atmosphere); CRI 95
direct_fixtures:
  - id: ark.trade_command_center.light.central_chandelier
    position: (0.00, 5.50, 4.30)
    beam_angle: 360° (radial)
    colour: --token-color-ark-trade-command-center-chandelier  (warm amber with crystal scatter)
    intensity: 4000 lumens
    function: principal lighting
  - id: ark.trade_command_center.light.broker_desk_lamp
    position: (0.00, 8.00, 0.95)  # on desk
    beam_angle: 60° downward
    colour: 2400 K very warm
    intensity: 1500 lumens
    function: focused desk task light
  - id: ark.trade_command_center.light.cabinet_strip.east, .west
    position: above each cabinet at z = 2.50
    beam_angle: 90° downward
    colour: 2700 K warm
    intensity: 600 lumens per metre
    function: cabinet accent
practical_sources:
  - id: ark.trade_command_center.fireplace_glow (cosmetic — small fireplace at south-west)
    position: (-3.50, 1.50, 0.40)
    intensity: 400 lumens (when lit; conditional)
    flicker_pattern: organic
time_of_day_variation:
  acts_2_to_7: stable warm baseline; in Act 7 broker may be permanently absent (room cold)
dynamic_response:
  - on_player_at_desk: desk_lamp activates
  - on_high_stakes_trade: chandelier brightens 20%
  - on_vault_open: vault_glow emerges (Act 4+ only)
```

### A.32.7 Atmosphere

```
air_temperature:    21°C (warm, comfortable)
humidity:           42% RH; smells of walnut + leather (chair upholstery) + faint cigar (canonical broker habit) + paper (contracts)
particulate:
  - dust: very low (well-maintained executive)
  - cigar_smoke: very low (when broker present + smoking; cosmetic)
volumetric_fog:     absent
wind_drift:         minimal; 0.02 m/s
smell_canon:        walnut + leather + cigar + paper; voice-line: "smells like quiet money"
```

### A.32.8 Sound

```
ambient_bed:           file: trade_command_ambient_bed_v1.ogg (loop); -38 dB; very quiet; faint mantle clock tick, very faint ambient bustle from Trade Hub through south door
point_sources:
  - sound.mantle_clock_tick: at desk; period 1s; -34 dB; continuous
  - sound.cabinet_subtle_creak: random; -38 dB; period 60-120s
  - sound.distant_market_bustle: at south door; -42 dB; ambient cyclic
reverb_zone:           IR-impulse: trade_command_v1.wav; wet-mix 14% (intimate, confidential)
music_eligibility:     cutscene only (deferred)
voice_line_eligibility:
  - speaker: the_galactic_broker: presence (Acts 2+; primary occupant); line set §2.32.2
  - speaker: rare visiting NPCs: scripted events
```

### A.32.9 Object inventory

Trade Command Center has 32 inventory objects.

#### A.32.9.1 The Broker's Desk

```
object_id:           ark.trade_command_center.broker_desk
object_class:        furniture
position:            (0.00, 8.00, 0.00)
dimensions:          2.00 × 1.00 × 0.85
rotation:            0°
material_primary:    polished walnut with deep-green leather inset top; brass rim
material_secondary:  brass corner-caps with engraved laurel; brass drawer handles
colour_value:        --token-color-ark-trade-command-center-desk
interaction:         interactable
  - operate: opens broker-deal UI (high-stakes negotiations; rare items; faction pacts)
  - inspect: lore-note about desk
narrative_role:      THE broker's negotiation surface; player engages here for deals beyond Trade Hub counters
lore_anchor:         loredex.character.galactic_broker + arc.broker_arc
art_status:          producer_handoff
gameplay_hook_id:    trpc.trade_command.broker_desk.operate
wear_state:          worn at leather inset
physical_constraints: collides
```

#### A.32.9.2 Broker's Chair

```
object_id:           ark.trade_command_center.broker_chair
object_class:        furniture  (also npc_anchor)
position:            (0.00, 9.00, 0.00)  # behind desk
dimensions:          0.90 × 0.90 × 1.50
rotation:            180°  (faces south, toward visitor chairs)
material_primary:    walnut frame with deep-green velvet upholstery
material_secondary:  brass armrests with engraving
colour_value:        --token-color-ark-trade-command-center-broker-chair
interaction:         interactable - sit (when broker absent)
narrative_role:      broker's chair; player can rarely sit
lore_anchor:         loredex.character.galactic_broker
art_status:          producer_handoff
gameplay_hook_id:    trpc.trade_command.broker_chair.sit
wear_state:          worn at right armrest (broker is right-handed)
physical_constraints: collides; sittable
```

#### A.32.9.3-4 Two Visitor Chairs (facing desk)

```
object_id:           ark.trade_command_center.visitor_chair.east, .west
object_class:        furniture
positions:           (1.00, 6.50, 0.00), (-1.00, 6.50, 0.00)
dimensions (each):   0.80 × 0.80 × 1.20
rotation (each):     varies (faces desk)
material_primary:    walnut frame with deep-green leather seat
material_secondary:  brass tacks
colour_value:        --token-color-ark-trade-command-center-visitor-chair
interaction:         interactable - sit
narrative_role:      where visitors negotiate
lore_anchor:         arc.broker_arc
art_status:          producer_handoff
gameplay_hook_id:    none (positional; opens UI when paired with broker present)
wear_state:          slight wear
physical_constraints: collides; sittable
```

#### A.32.9.5 Mantle Clock (on broker's desk)

```
object_id:           ark.trade_command_center.broker_desk.mantle_clock
object_class:        decoration
position:            (-0.80, 8.00, 0.85)
dimensions:          0.30 × 0.20 × 0.40
rotation:            0°
material_primary:    polished brass case with mahogany inlay
material_secondary:  porcelain face
colour_value:        --token-color-ark-trade-command-center-clock
interaction:         inspectable
narrative_role:      ticking adds room-rhythm; matches Captain's Quarters mantle clock
lore_anchor:         loredex.aesthetic.solar_punk_cathedral
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          slight patina
physical_constraints: collides
```

#### A.32.9.6 Broker's Personal Locker

```
object_id:           ark.trade_command_center.broker_locker
object_class:        container
position:            (-3.00, 10.50, 0.00)  # NW corner
dimensions:          0.50 × 0.40 × 1.80
rotation:            180°
material_primary:    polished walnut + brass handle
material_secondary:  brass nameplate
colour_value:        --token-color-ark-trade-command-center-locker
interaction:         interactable
  - open: contains broker's personal effects (cigar humidor, journal — gameplay-key; portraits)
narrative_role:      humanises broker
lore_anchor:         loredex.character.galactic_broker + arc.broker_personal_arc
art_status:          producer_handoff
gameplay_hook_id:    trpc.trade_command.broker_locker.open
wear_state:          slight wear
physical_constraints: collides
```

#### A.32.9.7-12 Six Cabinet Slots (east + west; 3 each)

```
object_id:           ark.trade_command_center.east.cabinet.contracts.<slot>  (3 slots) and .west.cabinet.records.<slot>  (3 slots)
object_class:        container
positions:           per cabinet positions
dimensions (each):   0.40 × 1.30 × 2.40
rotation:            varies (faces room)
material_primary:    walnut + brass handles + glass display panels
material_secondary:  bronze nameplate per slot
colour_value:        --token-color-ark-trade-command-center-cabinet
interaction:         interactable
  - open: contains sealed contracts / trade records; player can review
  - inspect: lore-note
narrative_role:      records of past deals; gameplay-key for high-stakes lookups
lore_anchor:         loredex.system.trade_records
art_status:          producer_handoff
gameplay_hook_id:    trpc.trade_command.cabinet.open
wear_state:          slight wear
physical_constraints: collides
```

#### A.32.9.13 Vault Door (north central)

Specced in walls. Inventoried for completeness (door_class: pressure_seal; Act 4+).

#### A.32.9.14-16 Decorative + Atmosphere

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.trade_command_center.fireplace.sw` | interactive | (-3.50, 1.50, 0.00) | 1.20 × 0.40 × 1.20 | small wood-fired fireplace |
| `ark.trade_command_center.fireplace.mantle` | decoration | (-3.50, 1.50, 1.30) | 1.40 × 0.30 × 0.10 | stone mantle |
| `ark.trade_command_center.fireplace.mantle.cigar_box` | container | on mantle | 0.20 × 0.10 × 0.10 | broker's cigar box |

#### A.32.9.17-22 Six Reading-Light + Decorative Pieces

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.trade_command_center.broker_desk.lamp` | fx_emitter | (1.00, 8.00, 0.85) | 0.20 × 0.20 × 0.50 | cast-bronze + green-glass desk lamp |
| `ark.trade_command_center.broker_desk.contract_pile` | decoration | on desk | 0.30 × 0.20 × 0.05 | active contracts |
| `ark.trade_command_center.broker_desk.fountain_pen_set` | decoration | on desk | 0.10 × 0.05 × 0.04 | bronze pen set |
| `ark.trade_command_center.broker_desk.inkwell` | decoration | on desk | 0.10 × 0.10 × 0.08 | bronze inkwell |
| `ark.trade_command_center.broker_desk.framed_photo` | decoration | on desk | 0.10 × 0.15 × 0.04 | broker's family photo |
| `ark.trade_command_center.broker_desk.scales_decorative` | decoration | on desk | 0.20 × 0.15 × 0.30 | small bronze scales-of-trade decoration |

#### A.32.9.23-26 Carpet + Floor + Accents

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.trade_command_center.lounge_rug` | decoration | (0.00, 5.50, 0.005) | 3.00 × 4.00 × 0.005 | central rug |
| `ark.trade_command_center.coat_stand` | decoration | (3.50, 1.50, 0.00) | 0.30 × 0.30 × 1.80 | coat stand |
| `ark.trade_command_center.umbrella_stand` | decoration | (-3.50, 0.50, 0.00) | 0.20 × 0.20 × 0.80 | bronze umbrella stand |
| `ark.trade_command_center.framed_photos.north` | decoration | (0.00, 10.95, 1.80) flanking vault | 0.30 × 0.40 × 0.04 each (2) | crew family photos |

#### A.32.9.27-32 Closing Items

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.trade_command_center.south.intercom` | console | (-1.50, 0.20, 1.50) | 0.20 × 0.10 × 0.30 | comms relay |
| `ark.trade_command_center.fire_extinguisher.south` | interactive | (1.50, 0.20, 1.20) | 0.20 × 0.20 × 0.50 | safety |
| `ark.trade_command_center.first_aid.kit` | container | (-2.50, 0.20, 1.50) | 0.40 × 0.10 × 0.30 | medical |
| `ark.trade_command_center.private_drinks_cabinet` | container | (3.50, 9.00, 0.00) | 0.50 × 0.40 × 1.40 | broker's private liquor cabinet |
| `ark.trade_command_center.scales_of_trade_relief` (rolled walls) | decoration | (0.00, 10.95, 3.50) | 1.40 × 0.40 × 0.10 | scales relief above vault |
| `ark.trade_command_center.compass_inlay` | decoration | (0.00, 5.50, 0.005) | 0.80 × 0.80 × 0.005 | small floor compass under chandelier |

Total: 32 inventory objects.

### A.32.10-17 Camera-spawn-points / Doorways / Adjacency / Hooks / Story / FX / Parametricity / Performance (compact)

```
camera_spawn_points:
  cs_amb_trade_command (Cat B): POV at threshold; slow approach to desk; lasts 18s
  cs_first_broker_meeting (Act 2): seated at visitor chair; broker enters from elsewhere

doorways:
  south.door.main: connects to ark.trade_hub; slide; Act 2+
  north.vault_door: connects to ark.trade_command_center.private_vault (deferred); pressure_seal; Act 4+

adjacency:
  direct: ark.trade_hub (south)
  one_hop: ark.cargo_hold (via Trade Hub elevator)

gameplay_hooks:
  - operateBrokerDesk: trpc.trade_command.broker_desk.operate
  - openCabinet: trpc.trade_command.cabinet.open
  - openBrokerLocker: trpc.trade_command.broker_locker.open
  - unlockVault: trpc.trade_command.vault.unlock (Act 4+ conditional)
  - takeCigar: trpc.trade_command.cigar_box.take (gameplay-conditional)
  - sitBrokerChair: trpc.trade_command.broker_chair.sit (when broker absent)

story_tie:
  primary_arcs: act_2_first_broker_meeting; broker_arc; act_4_vault_unlock
  per_act:
    act_2: opens; first broker negotiation
    act_4: vault unlocks for high-stakes trades
    act_5: deeper broker dialogues; locker reveals lore
    act_7: state-branched (broker present + lit; or absent + cold)
  npc_roster: the_galactic_broker (primary); the_player; rare visitors
  readables: discretion plaque; first-broker portrait; last-broker portrait (uncanny shift); contracts cabinet; broker journal (locker)
  master_of_rlyeh_question: n/a

special_fx:
  particle_systems: dust (very low); cigar_smoke (low when broker smoking)
  volumetric: chandelier_crystal_scatter; fireplace_glow; vault_glow_on_open
  procedural_animations: clock_tick (hands move); chandelier_subtle_sway; cigar_smoke_drift
  reactive: desk_lamp_on_proximity; cabinet_glow_on_inspection; vault_unlock_one_shot

avatar_parametricity:
  small_xenomorph: alternate stand-on-step at desk; cabinet upper slots via ladder
  others: all-reachable
  audio_occlusion: xenomorph: clock-tick more pronounced

performance:
  polygon_budget: 220,000 / texture_budget: 130 MB / light_count_limit: 12
  streaming_behaviour: preload ark.trade_hub (south); on_vault_open + Act 4+: preload private_vault sub-space
```

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

## A.34 Trophy Armory (TD) — FULL

**Status: FULL spec.** Cross-ref `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.34 (art-state prompts).

### A.34.1 Header

```
space_id:        ark.trophy_armory
space_name:      Trophy Armory (Tower Defense)
space_type:      ark_room  (sub-room of Defense Command Center)
act_introduced:  Act 4
lore_anchor:     loredex.system.tower_defense_trophies + arc.td_progression + arc.act_4_first_td_trophy
aesthetic_tier:  solar_punk_cathedral  (military-tactical with display-gallery accents)
```

### A.34.2 Geometry

```
dimensions:           8.00 m × 10.00 m × 4.00 m
origin_point:         centre of floor at south entrance (door from Defense Command Center east side)
coordinate_axes:      +x = right, +y = forward (north), +z = up
floor_plan_geometry:  rectangular  (with central display plinth + perimeter trophy cases)
volumetric_anomalies: none
```

The Trophy Armory is the TD-specific trophy gallery — accessed
from Defense Command Center's east door. Compact rectangular
display chamber. Central plinth holds the player's most-recent
TD trophy. East + west walls hold league-scaled trophy cases
(bronze / silver / gold / platinum / diamond / champion = 6
tiers). North wall displays the Hall of Fallen Towers — towers
that valiantly held but did not survive.

Floor area: 80 m².

### A.34.3-8 Compact (full FULL fidelity)

```
floor: industrial steel deck plate; 1.00×1.00 m tiles; bronze inlay outlining central plinth zone (2×2 m); brass perimeter trim; tactical-grid etch
walls:
  south: gunmetal panel + tactical-amber stripe; south.display.recent_trophies (-2.0,0.2,1.5; 0.8×0.6); south.display.tier_progress (2.0,0.2,1.5); south.door.main pressure_seal connects to ark.defense_command_center (east door); plaque "WHAT WE HELD, WE EARNED"
  east: gunmetal with 6-tier trophy case (bronze→champion; one tier per 0.65 m vertical column at radius 0.40 m; full-height 4.00 m); bronze tier-rails + biometric trophy-display
  north: gunmetal with full-wall Hall of Fallen Towers display (1.20×0.80; updates with every fallen tower in player's TD playthrough); apsidal "HONOURED FALLEN" relief above
  west: mirror of east — second 6-tier trophy case (TD season-specific or seasonal-event trophies)
ceiling: 4.00 m baseline; central drop coffer at 3.50 m above plinth; recessed warm-amber strip-lights along trophy cases; tactical-cool ambient grid
lighting:
  ambient_baseline: 4500 K cool-tactical with warm-display accents; 220 lux; CRI 92
  central_plinth_pendant: at (0.00, 5.00, 3.50); warm amber + crystal scatter; 4000 lumens
  trophy_case_strip.east, .west: above each case at z=3.40; warm 3000 K; 600 lumens/m
  hall_of_fallen_uplight: along north wall base at z=0.05; warm gold; 1000 lumens/m (dramatic backlighting)
  alert_strobes.<corner>×4: red-orange; off baseline
  practical_sources: tier_indicator_glow.east.<n>×6 + .west.<n>×6 (per tier); 30 lumens each (varies — green earned; amber active; grey unearned)
atmosphere: 19°C cool / 38% RH dry / smells of steel + bronze + faint cordite-residue (subtle hint at past battles)
sound:
  ambient_bed: -36 dB very quiet; faint case-electronics buzz, distant Defense Command Center bleed
  point_sources: trophy_case_buzz.<n>; plinth_resonance (when occupied); fallen_tower_subtle_resonance (faint reverent hum at memorial)
  reverb_zone: trophy_armory_v1.wav wet 14% (intimate gallery)
  music_eligibility: cutscene only (Cat A on new TD trophy)
  voice_line_eligibility: trophy_curator (silent presence); td_announcer (rare ambient on trophy events)
```

### A.34.9 Object inventory (compact)

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.trophy_armory.central_plinth` | interactive | (0.00, 5.00, 0.00) | 1.20 dia × 1.10 | plinth holding most-recent TD trophy |
| `ark.trophy_armory.east.case.<tier>` (6) | container | east wall vertical column | 0.40×0.40×0.65 each | per-tier trophy display cases |
| `ark.trophy_armory.west.case.<tier>` (6) | container | west wall vertical column | mirror | seasonal/event trophy cases |
| `ark.trophy_armory.north.hall_of_fallen_display` | display | (0.00, 9.95, 2.00) | 1.20×0.80×0.05 | fallen towers memorial |
| `ark.trophy_armory.observation_bench.south` | furniture | (0.00, 3.00, 0.00) | 1.40×0.40×0.45 | bench facing plinth |
| `ark.trophy_armory.curator_lectern` | container | (-3.00, 1.50, 0.00) | 0.40×0.30×1.20 | bronze lectern with TD-history tome |
| `ark.trophy_armory.south.intercom` | console | (-1.5, 0.2, 1.5) | 0.20×0.10×0.30 | comms |
| `ark.trophy_armory.fire_extinguisher` | interactive | (1.5, 0.2, 1.2) | 0.20×0.20×0.50 | safety |
| `ark.trophy_armory.first_aid` | container | (-2.5, 0.2, 1.5) | 0.40×0.10×0.30 | medical |
| `ark.trophy_armory.south.plaque.creed` | decoration | (0.00, 0.20, 3.20) | 0.80×0.30×0.02 | "WHAT WE HELD, WE EARNED" |
| `ark.trophy_armory.north.relief.honoured_fallen` | decoration | (0.00, 9.85, 3.40) | 1.20×0.40×0.10 | "HONOURED FALLEN" relief |
| `ark.trophy_armory.alert_strobe.<corner>` (4) | fx_emitter | corners | 0.20×0.20×0.20 each | alert strobes |
| `ark.trophy_armory.compass_inlay` | decoration | (0.00, 5.00, 0.005) | 0.80×0.80×0.005 | floor inlay under plinth |

Total: 26 inventory objects.

### A.34.10-17 Compact

```
camera_spawn_points:
  cs_amb_trophy_armory (Cat B): POV at threshold; slow walk to plinth; head pans across tier cases; 14s
  cs_first_td_trophy (Act 4 one-shot): POV at plinth; new trophy materialises; pendant flares
  cs_tower_fell_memorial (state-conditional Acts 5+): POV at north wall; memorial updates with new fallen tower

doorways: south.door.main → ark.defense_command_center (via DC east door); pressure_seal; Act 4+

adjacency: direct ark.defense_command_center (south); one_hop ark.tower_assembly_bay, ark.armory (via DC)

gameplay_hooks:
  - inspectPlinth: trpc.trophy_armory.plinth.inspect
  - inspectTierCase: trpc.trophy_armory.case.inspect (per-tier per-wall)
  - inspectHallOfFallen: trpc.trophy_armory.hall.inspect
  - readCuratorLectern: trpc.trophy_armory.lectern.read

story_tie:
  primary_arcs: act_4_first_td_trophy; td_progression; tower_lineage_lore
  per_act:
    acts_0_3: locked
    act_4: opens; first TD trophy displayed; bronze tier earned
    acts_5_7: progress through tiers; fallen-towers memorial accumulates; state-branched Act 7: champion-tier vs. minimal-engagement
  npc_roster: trophy_curator (silent presence); td_announcer (ambient)
  readables: creed plaque; honoured-fallen relief; curator's TD-history tome; per-tier nameplates; Hall of Fallen Towers (per-tower lore)
  master_of_rlyeh_question: n/a

special_fx: dust low; tier_glow_per_state; memorial_uplight_envelope
volumetric: pendant_scatter; tier_indicator_glow; fallen_uplight
procedural: tier_indicator_pulse; trophy_subtle_glint; memorial_subtle_pulse
reactive: pendant_intensify_on_proximity; tier_pulse_on_new_trophy; memorial_flash_on_new_fallen

avatar_parametricity: small_xenomorph: alternate ladder for top tiers; others all-reachable
audio_occlusion: xenomorph: distant DC bleed more pronounced
performance: polygon_budget 160,000 / texture_budget 90 MB / light_count 12
streaming: preload ark.defense_command_center (parent room)
```

---

## A.35 Tower Assembly Bay (TD) — FULL

**Status: FULL spec.** Cross-ref `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.35 (art-state prompts).

### A.35.1 Header

```
space_id:        ark.tower_assembly_bay
space_name:      Tower Assembly Bay (TD)
space_type:      ark_room  (sub-room of Defense Command Center)
act_introduced:  Act 4
lore_anchor:     loredex.system.tower_crafting + arc.tower_progression + arc.act_4_first_tower_built
aesthetic_tier:  solar_punk_cathedral  (industrial-craft accents; tower-building workshop)
```

### A.35.2 Geometry

```
dimensions:           11.00 m × 11.00 m × 5.00 m
origin_point:         centre of floor at south entrance (door from Defense Command Center west side)
coordinate_axes:      +x = right, +y = forward (north), +z = up
floor_plan_geometry:  rectangular
volumetric_anomalies: none
```

The Tower Assembly Bay is the TD-specific tower-crafting workshop
— accessed from Defense Command Center's west door (mirror of
Trophy Armory). Central assembly platform is a 2.40 × 2.40 m
raised dais where towers are constructed. East wall holds
component cabinets (8 cabinets — 1 per tower-type). West wall
holds tool racks. North wall displays the Tower Schematic Index
+ recipes. Cargo gantry at z = 4.20 carries assembled towers
out to the Defense Command Center for deployment.

Floor area: 121 m².

### A.35.3-8 Compact (full FULL fidelity)

```
floor: cast-iron grating (heat-resistant; tower-construction generates ember + slag); 1.20×1.20 m panels; bronze inlay outlining assembly platform (2.40×2.40 m); brass perimeter trim
walls:
  south: gunmetal panel; south.display.assembly_status (-2.5,0.2,1.8); south.display.recipe_index (2.5,0.2,1.8); south.door.main pressure_seal connects to ark.defense_command_center (west door); plaque "BUILD WHAT THE WORLD NEEDS"
  east: 8-cabinet stack (one per tower-type — guard / sniper / artillery / shield / repair / rare / legendary / experimental); reinforced steel cabinets with biometric locks; bronze nameplates per cabinet
  north: full-wall Tower Schematic Index display (4.0×2.4); flanked by tower-recipe relief; gantry-track exit point (north door not for player; tower transport only)
  west: tool racks for tower-assembly tools (laser-cutter, riveter, calibrator, plasma-welder, finishing-set, charge-coupler, frame-aligner, tower-base-builder)
ceiling: 5.00 m baseline; cargo gantry track at z=4.20; recessed warm-amber strip-lights along cabinets; high-bay industrial fixtures
lighting:
  ambient_baseline: 4500 K cool-industrial; 280 lux (precision crafting); CRI 92
  assembly_platform_pendant: at (0.00, 5.50, 4.50); warm white precision; 6000 lumens
  cabinet_strip.east: warm 3000 K; 600 lumens/m
  tool_rack_strip.west: warm; 600 lumens/m
  gantry_motion_strip: along gantry; 400 lumens/m
  practical_sources: assembly_platform_glow (during construction; varies per tower-type colour); cabinet_indicator_lights.<n>×8
atmosphere: 23°C warm during active assembly / 42% RH / smells of steel + ozone + warm-metal + faint plasma-residue
sound:
  ambient_bed: -30 dB; gantry servo-hum, distant cooling fans, occasional tool-clank
  point_sources: assembly_platform_construction_sfx (state-conditional); gantry_servo_continuous; cabinet_buzz; tool_rack_subtle_clank
  reverb_zone: tower_assembly_v1.wav wet 24% (industrial-warm)
  music_eligibility: cutscene only (TD-arc construction cutscenes)
  voice_line_eligibility: the_chief_engineer (named NPC; rare presence); assembly_announcer (institutional ambient)
```

### A.35.9 Object inventory (compact)

Tower Assembly Bay has 30 inventory objects.

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.tower_assembly_bay.assembly_platform` | interactive | (0.00, 5.50, 0.20) | 2.40×2.40×0.20 (raised dais) | THE central tower-construction platform |
| `ark.tower_assembly_bay.assembly_platform.holographic_overlay` | fx_emitter | above platform | 2.40×2.40 | tower-progress hologram |
| `ark.tower_assembly_bay.east.cabinet.<tower_type>` (8) | container | east wall stack | 0.40×4.00×0.50 each | per-tower-type component cabinets |
| `ark.tower_assembly_bay.west.tool_rack` | container | (-4.95, 5.50, 0.00) | 0.40×4.00×2.40 | 8-tool tower-assembly tools |
| `ark.tower_assembly_bay.gantry_overhead` | interactive | along ceiling at z=4.20 | 11.0×0.40×0.20 | tower-transport gantry |
| `ark.tower_assembly_bay.gantry_control` | console | (-3.00, 5.50, 0.00) | 0.80×0.40×1.10 | gantry operator station |
| `ark.tower_assembly_bay.chief_engineer_anchor` | npc_anchor | (0.00, 8.00, 0.00) | 0.8×0.8×1.8 | Chief Engineer NPC |
| `ark.tower_assembly_bay.work_chair.south_east, .south_west` (2) | furniture | flanking platform | 0.80×0.80×1.20 each | working seats |
| `ark.tower_assembly_bay.south.intercom` | console | (-1.5, 0.2, 1.5) | 0.20×0.10×0.30 | comms |
| `ark.tower_assembly_bay.fire_extinguisher.south, .east` (2) | interactive | south + east | 0.20×0.20×0.50 each | safety |
| `ark.tower_assembly_bay.first_aid` | container | (-2.5, 0.2, 1.5) | 0.40×0.10×0.30 | medical |
| `ark.tower_assembly_bay.south.plaque.creed` | decoration | (0.00, 0.20, 3.20) | 0.80×0.30×0.02 | "BUILD WHAT THE WORLD NEEDS" |
| `ark.tower_assembly_bay.north.tower_schematic_index_display` | display | (0.00, 10.95, 2.00) | 4.00×2.40×0.05 | tower recipes + schematics |
| `ark.tower_assembly_bay.north.relief.first_tower_built` | decoration | (0.00, 10.85, 4.20) | 1.20×0.40×0.10 | first-tower-built relief |
| `ark.tower_assembly_bay.compass_inlay` | decoration | (0.00, 5.50, 0.005) | 1.40×1.40×0.005 | floor inlay under platform |
| `ark.tower_assembly_bay.alert_strobe.<corner>` (4) | fx_emitter | corners | 0.20×0.20×0.20 each | alert strobes |
| `ark.tower_assembly_bay.cabinet_indicator_light.east.<n>` (8) | fx_emitter | per cabinet | 0.10×0.10×0.10 | status lights |

Total: 30 inventory objects.

### A.35.10-17 Compact

```
camera_spawn_points:
  cs_amb_tower_assembly_bay (Cat B): POV at threshold; slow walk to assembly platform; head pans east + west (cabinets + tools); 18s
  cs_first_tower_built (Act 4 one-shot): POV at platform; tower assembled with sparks + components clicking together; 22s

doorways: south.door.main → ark.defense_command_center (via DC west door); pressure_seal; Act 4+

adjacency: direct ark.defense_command_center (south); one_hop ark.trophy_armory, ark.armory (via DC)

gameplay_hooks:
  - operateAssemblyPlatform: trpc.tower_assembly.platform.operate
  - openComponentCabinet: trpc.tower_assembly.cabinet.open (per-cabinet)
  - operateGantry: trpc.tower_assembly.gantry.operate
  - takeToolFromRack: trpc.tower_assembly.tool_rack.take
  - inspectSchematicIndex: trpc.tower_assembly.schematic_index.inspect

story_tie:
  primary_arcs: act_4_first_tower_built; tower_progression (continuous); tower_lineage_lore
  per_act:
    acts_0_3: locked
    act_4: opens; first tower built; basic types
    acts_5_7: rare + legendary towers unlock; experimental tower research
  npc_roster: the_chief_engineer (named NPC); the_player; assembly_announcer (institutional ambient)
  readables: creed plaque; first-tower-built relief; schematic-index (per-tower lore); 8 cabinet labels
  master_of_rlyeh_question: n/a

special_fx: dust low; ember (during construction); spark spray; plasma-shimmer at platform during high-tier builds
volumetric: assembly_platform_holo; cabinet_glow_per_type; gantry_motion_envelope
procedural: gantry_idle_sway; cabinet_indicator_pulse; assembly_platform_construction_animation
reactive: platform_intensify_on_active; gantry_engagement_on_complete; cabinet_glow_on_open

avatar_parametricity: standard
audio_occlusion: xenomorph: gantry-servo more pronounced
performance: polygon_budget 220,000 / texture_budget 130 MB / light_count 14
streaming: preload ark.defense_command_center (parent); on_assembly_active: preload current tower-asset
```

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

## A.37 Grand Master's Sanctum (top-10 ladder) — FULL

**Status: FULL spec.** Cross-ref `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.37 (art-state prompts).

### A.37.1 Header

```
space_id:        ark.grand_masters_sanctum
space_name:      Grand Master's Sanctum (top-10 ladder)
space_type:      ark_room  (sub-room of Chess Hall)
act_introduced:  Act 5 (top-10 chess-ladder rank required)
lore_anchor:     loredex.system.chess_ladder + loredex.character.the_grand_master + arc.act_5_grand_master_meeting
aesthetic_tier:  solar_punk_cathedral  (austere-master; the Ark's most cerebral private chamber)
```

### A.37.2 Geometry

```
dimensions:           8.00 m × 8.00 m × 5.00 m  (intentionally compact)
origin_point:         centre of floor at south entrance
coordinate_axes:      +x = right, +y = forward (north), +z = up
floor_plan_geometry:  rectangular  (with central chess-board on raised marble dais)
volumetric_anomalies: none
```

The Grand Master's Sanctum is intimate — only top-10-ranked
chess players can enter. Central chess board on a 0.40 m raised
marble dais. Two austere chairs flank the board. North wall
holds the Grand Master's lifetime-record + the Lineage Wall
(every Grand Master who has ever served). East + west walls hold
study materials: opening-theory tomes, end-game studies, and the
Grand Master's personal annotations.

Floor area: 64 m².

### A.37.3-8 Compact (full FULL fidelity)

```
floor: polished black-and-white marble in chess-pattern; 0.50 × 0.50 m tiles; mirror-finish; bronze inlay outlining central dais (2.40 × 2.40 m)
walls:
  south: charcoal stone-clad with gold-leaf accents; south.display.ladder_status (-1.5,0.2,1.8); south.door.main slide connects to ark.chess_hall (Act 5+ top-10 only); plaque "TIME REVEALS THE WINNER"
  east: stone-clad with built-in walnut bookshelves (full-height; opening theory; ~80 books); brass nameplates per study category
  north: full-wall walnut paneling with grand-master lineage display (3.0×2.0); flanked by historical busts (one per past grand master); apsidal "MASTER OF MASTERS" relief
  west: stone-clad with built-in walnut bookshelves (mirror; end-game studies; ~80 books)
ceiling: 5.00 m baseline; central drop coffer at 4.50 m; recessed amber strip-lights along bookshelves; subtle warm pendant over board
lighting:
  ambient_baseline: 2700 K very warm; 200 lux (intimate); CRI 95
  central_pendant: at (0.00, 4.00, 4.50); warm amber crystal scatter; 4500 lumens
  bookshelf_strip.east, .west: warm 3000 K; 600 lumens/m
  lineage_uplight.north: along base; warm gold; 800 lumens/m
  practical_sources: chess_clock_glow + bust_indicator_lights.<n>
atmosphere: 19°C cool / 42% RH / smells of polished walnut + book-paper + warm leather + faint tea
sound:
  ambient_bed: -38 dB very quiet; faint chess-clock tick from board, occasional book-creak, distant Chess Hall bleed
  point_sources: chess_board_clock_tick (continuous when match active); bookshelf_subtle_creak (random); grand_master_breath (when present); distant_chess_hall_bustle (very faint through south door)
  reverb_zone: grand_master_v1.wav wet 14% (intimate)
  music_eligibility: cutscene only (Chess-arc / lifetime-match cutscenes)
  voice_line_eligibility: the_grand_master (named NPC; primary occupant Acts 5+); chess_clock_subtle_voice (institutional)
```

### A.37.9 Object inventory (compact)

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.grand_masters_sanctum.chess_board.central` | interactive | (0.00, 4.00, 0.40) on dais | 0.80×0.80×0.05 | THE central chess board |
| `ark.grand_masters_sanctum.chess_clock.central` | console | (0.50, 4.00, 0.45) | 0.20×0.10×0.30 | dual-face chess clock |
| `ark.grand_masters_sanctum.chess_pieces.<set>` (32+) | interactive | on board | varied | chess pieces (Grand Master's set) |
| `ark.grand_masters_sanctum.player_chair` | furniture | (0.00, 2.50, 0.00) | 0.90×0.90×1.50 | player's chair |
| `ark.grand_masters_sanctum.grand_master_chair` | furniture+npc_anchor | (0.00, 5.50, 0.00) | 0.90×0.90×1.50 | Grand Master's chair |
| `ark.grand_masters_sanctum.east.bookshelf.opening_theory` | container | (3.95, 4.00, 0.00) | 0.40×6.00×3.40 | east bookshelf (~80 opening theory books) |
| `ark.grand_masters_sanctum.west.bookshelf.endgame_studies` | container | (-3.95, 4.00, 0.00) | mirror | west bookshelf (~80 end-game studies) |
| `ark.grand_masters_sanctum.north.lineage_display` | display | (0.00, 7.95, 2.00) | 3.0×2.0×0.05 | grand master lineage |
| `ark.grand_masters_sanctum.bust.past_master.<n>` (4) | decoration | flanking lineage display; 2 east + 2 west | 0.40×0.40×0.50 each (on plinths) | past grand master busts |
| `ark.grand_masters_sanctum.south.intercom` | console | (-1.0, 0.2, 1.5) | 0.20×0.10×0.30 | comms |
| `ark.grand_masters_sanctum.fire_extinguisher` | interactive | (1.0, 0.2, 1.2) | 0.20×0.20×0.50 | safety |
| `ark.grand_masters_sanctum.first_aid` | container | (-2.0, 0.2, 1.5) | 0.40×0.10×0.30 | medical |
| `ark.grand_masters_sanctum.south.plaque.principle` | decoration | (0.00, 0.20, 3.20) | 0.80×0.30×0.02 | "TIME REVEALS THE WINNER" |
| `ark.grand_masters_sanctum.north.relief.master_of_masters` | decoration | (0.00, 7.85, 4.20) | 1.20×0.40×0.10 | "MASTER OF MASTERS" |
| `ark.grand_masters_sanctum.tea_service` | decoration | small side table | 0.30×0.30×0.20 | grand master's tea service (humanising) |
| `ark.grand_masters_sanctum.compass_inlay` | decoration | (0.00, 4.00, 0.005) | 1.40×1.40×0.005 | floor inlay around chess dais |

Total: 22 inventory objects.

### A.37.10-17 Compact

```
camera_spawn_points:
  cs_amb_grand_master_sanctum (Cat B): POV at threshold; slow approach to chess board; 14s
  cs_first_grand_master_match (Act 5 top-10 unlock): POV at player chair; Grand Master across the board; first lifetime match begins

doorways: south.door.main → ark.chess_hall; slide; Act 5+ top-10 ladder rank
adjacency: direct ark.chess_hall (south); state-shared chess game with §A.13 antiquarian + §A.36 chess hall

gameplay_hooks:
  - playLifetimeMatch: trpc.grand_masters_sanctum.match.start (one-shot Act 5+; only when player rank >= top-10)
  - readBookshelf: trpc.grand_masters_sanctum.bookshelf.read (per-side per-book)
  - inspectLineage: trpc.grand_masters_sanctum.lineage.inspect

story_tie:
  primary_arcs: act_5_grand_master_meeting; chess_progression_top_10; act_7_lifetime_match (canonical match between player and Grand Master)
  per_act:
    acts_0_4: locked
    act_5: opens for top-10 players; first lifetime match initiated
    act_6: deeper studies; player's annotations contribute to bookshelves
    act_7: state-branched: lifetime-master ending (Grand Master concedes; player's bust appears among lineage) vs. continued-pupil ending
  npc_roster: the_grand_master (primary; physically present); the_player; rare past-grand-masters (cosmic-presence cameos)
  readables: principle plaque; master-of-masters relief; lineage display; ~160 books (opening + endgame); past-master busts (per-bust lore)
  master_of_rlyeh_question: n/a

special_fx: dust low; chess_board_holo_overlay (subtle); lineage_glow
volumetric: pendant_scatter; lineage_uplight_envelope
procedural: chess_clock_tick; bookshelf_subtle_creak; pieces_settle_subtle
reactive: pendant_intensify_on_player_at_chair; bookshelf_strip_warm_on_proximity; lineage_glow_on_inspect

avatar_parametricity: small_xenomorph: alternate ladder for top bookshelf; others all-reachable
audio_occlusion: xenomorph: chess-clock tick more pronounced
performance: polygon_budget 180,000 / texture_budget 110 MB / light_count 12
streaming: preload ark.chess_hall (parent)
```

---

## A.38 Puzzle Study Chamber (daily puzzle) — FULL

**Status: FULL spec.** Cross-ref `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.38 (art-state prompts).

### A.38.1 Header

```
space_id:        ark.puzzle_study_chamber
space_name:      Puzzle Study Chamber (daily puzzle)
space_type:      ark_room  (sub-room of Chess Hall)
act_introduced:  Act 4
lore_anchor:     loredex.system.daily_puzzle + arc.puzzle_progression
aesthetic_tier:  solar_punk_cathedral  (study-academic; warm scholarly)
```

### A.38.2 Geometry

```
dimensions:           6.00 m × 8.00 m × 4.00 m  (small, focused study space)
origin_point:         centre of floor at south entrance
floor_plan_geometry:  rectangular
volumetric_anomalies: none
```

The Puzzle Study Chamber is a small study where players solve the
daily chess puzzle. Compact rectangular room. Central study desk
holds the daily puzzle board. Bookshelves line east and west walls
(puzzle archives). North wall displays the player's puzzle-solving
streak + leaderboard.

Floor area: 48 m².

### A.38.3-9 Compact (full FULL fidelity — single block as the room is intentionally compact)

```
floor: polished walnut hardwood; 0.20×1.20 m planks; 45° from south; bronze inlay outlining puzzle desk zone
walls:
  south: cream plaster + walnut wainscoting; south.display.daily_puzzle_status (-1.0,0.2,1.5; 0.6×0.4); south.door.main slide connects to ark.chess_hall (Act 4+); plaque "EVERY DAY, A NEW PROBLEM"
  east + west: full-height walnut bookshelves with ~50 puzzle archive volumes per side
  north: full-wall display with player's puzzle streak + leaderboard; small relief above
ceiling: 4.00 m baseline; central pendant; warm strip-lights along bookshelves
lighting:
  ambient_baseline: 3000 K warm; 280 lux (precision reading); CRI 95
  central_pendant: at (0.00, 4.00, 3.80); warm amber; 3000 lumens
  bookshelf_strip: 600 lumens/m; warm
atmosphere: 21°C / 42% RH / smells of walnut + book-paper + faint tea
sound: -36 dB; faint clock-tick, page-rustle, distant Chess Hall ambient

object inventory (compact; 18 objects):
  - puzzle_desk: (0.00, 4.00, 0.00) 1.20×0.80×0.85; central
  - puzzle_chair: (0.00, 3.00, 0.00) 0.80×0.80×1.20
  - east.bookshelf.puzzle_archive: (2.95, 4.00, 0.00) 0.40×6.00×3.40; ~50 volumes
  - west.bookshelf.puzzle_archive: mirror
  - north.display.streak_leaderboard: (0.00, 7.95, 2.00) 1.20×0.80×0.05
  - mantle_clock: on desk; 0.20×0.20×0.30
  - tea_set: on desk corner; 0.30×0.30×0.20
  - reading_lamp_desk: on desk; 0.20×0.20×0.50
  - small_observation_chair (alt position) (3 chairs at perimeter)
  - south.intercom + fire_extinguisher + first_aid (3 items)
  - south.plaque.creed: "EVERY DAY, A NEW PROBLEM"
  - north.relief.daily_master: above display
  - puzzle_pieces_box: small bronze box on desk
  - score_chalkboard.<east|west>: small chalkboards on bookshelf flanks
```

### A.38.10-17 Compact

```
camera_spawn_points:
  cs_amb_puzzle_study (Cat B): POV at threshold; slow walk to desk; 12s
  cs_first_daily_puzzle_solved (Act 4 first-time): hand at desk; new puzzle materialises; clock starts

doorways: south.door.main → ark.chess_hall; slide; Act 4+
adjacency: direct ark.chess_hall (south)
gameplay_hooks: solveDailyPuzzle; inspectArchive; readChalkboard; useDeskLamp
story_tie: arc.daily_puzzle (continuous); locked Acts 0-3; opens Act 4
npc_roster: the_player; rare lobby observer
readables: creed plaque; daily-master relief; ~100 puzzle archive volumes; chalkboards
master_of_rlyeh_question: n/a

special_fx: dust very low; reading-lamp glow; chess-piece subtle glint
procedural: clock_tick; bookshelf_creak; pendant_subtle_sway
reactive: desk_lamp_on_proximity; chalkboard_update_on_solve; streak_display_animate

avatar_parametricity: standard
audio_occlusion: xenomorph: clock-tick + page-rustle pronounced
performance: polygon_budget 120,000 / texture_budget 70 MB / light_count 8
streaming: preload ark.chess_hall (parent)
```

---

## A.39 Casino Gaming Floor (chess-in-July event) — FULL

**Status: FULL spec.** Cross-ref `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.39 (art-state prompts).

### A.39.1 Header

```
space_id:        ark.casino_gaming_floor
space_name:      Casino Gaming Floor (Chess-in-July seasonal event)
space_type:      ark_room  (event-only; seasonal activation)
act_introduced:  seasonal (Chess-in-July recurring event; first available Act 4+)
lore_anchor:     loredex.event.chess_in_july + arc.seasonal_chess_carnival
aesthetic_tier:  solar_punk_cathedral  (festive-casino accents — atypical for the Ark)
```

### A.39.2 Geometry

```
dimensions:           16.00 m × 12.00 m × 5.00 m
origin_point:         centre of floor at south entrance
coordinate_axes:      +x = right, +y = forward (north), +z = up
floor_plan_geometry:  rectangular  (with central event-stage + perimeter chess tables)
volumetric_anomalies: none in baseline; festive-confetti cascade during high-prize matches
```

The Casino Gaming Floor only activates during Chess-in-July
seasonal events. Central event stage at room centre hosts
high-stakes matches. Perimeter has 8 themed chess tables
(each themed differently: classical, blitz, problem, lightning,
tag-team, fischerrandom, etc.). North wall has a leaderboard +
prize display. East has VIP booth; west has snack/coin vendor.

Floor area: 192 m².

### A.39.3-9 Compact (full FULL fidelity)

```
floor: polished walnut hardwood with rich-crimson wool rug zones at perimeter; bronze inlay outlining central stage zone (4×4 m); brass walkway-strip from entrance through to stage
walls:
  south: warm walnut + cream plaster; south.display.event_schedule (-3,0.2,1.8); south.display.player_winnings (3,0.2,1.8); south.door.main arch connects to ark.chess_hall (Acts 4+ during seasonal event); plaque "THE GAME IS THE PRIZE"
  east: VIP booth alcove (large; 3.0×2.0 with private chess board + 2 luxury chairs); curtain demarcation; bronze nameplate "VIP TABLE"
  north: walnut paneled wall + grand-leaderboard display (3.0×2.0); flanked by prize-display cabinets (silver/gold/platinum trophies); festive bunting at z=4.30
  west: snack/coin vendor alcove with cash desk + bronze coin-stack display + "house chips" + 2 spectator stools
ceiling: 5.00 m baseline; central event-stage rises with circular drop coffer at 4.30 m above stage; chandelier above central stage (theatrical); recessed strip-lights along walls; festive bunting
lighting:
  ambient_baseline: 3000 K warm festive; 220 lux; CRI 92
  central_chandelier_stage: at (0.00, 6.00, 4.30); warm amber + crystal scatter; 8000 lumens (theatrical pulse)
  bunting_uplight: along ceiling perimeter; warm crimson; 400 lumens/m
  vip_booth_pendant.east: warm 2400 K; 2500 lumens; intimate
  vendor_cash_desk_pendant.west: warm 2700 K; 2000 lumens
  trophy_display_uplight: along base of north prize cabinets; warm gold; 1000 lumens/m
  practical_sources: 8 chess_table_clock_glows; chip_glow_per_table
atmosphere: 22°C festive-warm / 48% RH / smells of walnut + cigar (rare during VIP matches) + bronze coin + faint perfume + buttery snacks
sound:
  ambient_bed: -28 dB; festive-jazz-piano (cosmetic; only during events), excited chatter, chip-clatter, occasional bell-toll on win
  point_sources: chess_clock_clicks_per_table; chip_clatter; vip_booth_intimate_chatter; vendor_cash_register; jazz_piano_subtle
  reverb_zone: casino_gaming_v1.wav wet 22% (warm festive)
  music_eligibility: ambient music ALLOWED (jazz piano during events); cutscene during prize wins
  voice_line_eligibility: the_event_host (named NPC; rotating per event); rotating tournament players; the_vip_booth_attendant
```

### A.39.10-17 Compact

```
camera_spawn_points:
  cs_amb_casino_gaming (Cat B): POV at threshold during event; head pans across festive crowd + central stage; 22s
  cs_first_chess_in_july (seasonal first-time): POV at central stage; opening ceremony; trumpets + crowd cheer
  cs_grand_prize_win (state-conditional): POV at central stage as prize is awarded; confetti cascade

doorways: south.door.main → ark.chess_hall; arch; seasonal Act 4+ activation
adjacency: direct ark.chess_hall (south)
gameplay_hooks: enterTournament; placeBet; takeVIPBooth; useVendor; inspectLeaderboard; inspectPrize
story_tie: arc.seasonal_chess_carnival; chess_progression_seasonal; locked outside seasonal window
npc_roster: the_event_host; vip_booth_attendant; vendor; rotating tournament players + spectators
readables: creed plaque; event schedule; player winnings; ~30 prize descriptions; leaderboard
master_of_rlyeh_question: n/a

special_fx: festive_dust; confetti_cascade (state-conditional); chip_glint_motes
procedural: chandelier_pulse_with_jazz; chess_clock_clicks; chip_clatter_motion; jazz_piano_visualisation
reactive: stage_intensify_during_match; vip_booth_glow_when_occupied; trophy_pulse_on_prize_award

avatar_parametricity: standard
audio_occlusion: xenomorph: jazz + chatter overwhelming; alternate quiet-zone setting
performance: polygon_budget 320,000 / texture_budget 180 MB / light_count 22 (festive density)
streaming: preload ark.chess_hall; on_event_active: load tournament-specific assets
```

8 chess tables: 8 inventory objects (each with chess_board + chess_clock + 2 chairs as sub-set; ~32 total sub-objects rolled).

Total: ~40 inventory objects (multi-themed event-room).

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

## A.47 CADES Console / Mission Briefing Pod (Med Bay annex) — FULL

**Status: FULL spec.** Cross-ref: `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.47 (art-state prompts); annex of Med Bay §A.2 (accessible
through Med Bay's CADES Console alcove on west wall).

### A.47.1 Header

```
space_id:        ark.cades_console_pod
space_name:      CADES Console / Mission Briefing Pod
space_type:      ark_room  (annex sub-room of Med Bay)
act_introduced:  Act 2
lore_anchor:     loredex.system.cades + arc.cades_missions + arc.act_2_first_cades_briefing
aesthetic_tier:  solar_punk_cathedral  (military-clinical hybrid; small but consequential)
```

### A.47.2 Geometry

```
dimensions:           6.00 m × 8.00 m × 4.00 m
origin_point:         centre of floor at south entrance (door from Med Bay)
coordinate_axes:      +x = right, +y = forward (north), +z = up
floor_plan_geometry:  rectangular  (compact pod-style; intentional intimacy for briefings)
volumetric_anomalies: none
```

The CADES Pod is a small, focused room — designed for one to
three people to plan a CADES (Coordinated Atmospheric Defense
& Engagement Squad) mission. Briefing table dominates the centre.
Mission archive cabinets along east wall. Pre-mission preparation
locker at north end. Holographic mission overlay rises from
briefing table when active.

Floor area: 48 m².

### A.47.3 Floor

```
material_primary:     industrial steel deck plate with anti-static coating; 1.00 × 1.00 m tiles; 4 mm gap
material_secondary:   bronze inlay outlining briefing-table zone (3 × 3 m square inlay); brass perimeter trim
pattern:              tactical grid + central briefing-zone marker
wear_state:           pristine in early acts; slight wear-trail to briefing table + locker
embedded_features:
  - id: ark.cades_console_pod.floor.charge_point.briefing_table
    position: (0.00, 4.00, 0.00)
    dimensions: 0.40 × 0.40 × 0.05
    function: briefing-table holographic projection power
  - id: ark.cades_console_pod.floor.charge_point.prep_locker
    position: (0.00, 7.50, 0.00)
    dimensions: 0.30 × 0.30 × 0.05
    function: locker electronics
acoustic_property:    hard_reflective with damping (intentional clean acoustic for briefing clarity); RT60 = 0.30s
```

### A.47.4 Walls

#### Wall: South (entrance from Med Bay)

```
wall_id:              south
material_primary:     painted steel panel; matte gunmetal; reinforced
material_secondary:   bronze dado at z = 1.10 m
panelisation:         standard
colour_value:         --token-color-ark-cades-pod-wall-south  (gunmetal-grey + tactical-amber stripe)
embedded_displays:
  - id: ark.cades_console_pod.south.display.mission_status
    position: (-1.50, 0.20, 1.80)
    dimensions: 0.80 × 0.60 × 0.05
    content: current mission status / next briefing
  - id: ark.cades_console_pod.south.display.squad_roster
    position: (1.50, 0.20, 1.80)
    dimensions: 0.80 × 0.60 × 0.05
    content: CADES squad members + readiness
embedded_doors:
  - door_id: ark.cades_console_pod.south.door.main
    position: (0.00, 0.00, 0.00)
    dimensions: 1.20 × 2.40 × 0.10
    door_class: pressure_seal  (security; brief-room confidentiality)
    connecting_space_id: ark.med_bay  (via Med Bay west wall CADES Console alcove)
decorative_features:
  - id: ark.cades_console_pod.south.plaque.creed
    position: (0.00, 0.20, 3.20)
    dimensions: 0.80 × 0.30 × 0.02
    material: cast bronze
    narrative_role: reads "RETURN. ALWAYS RETURN."
```

#### Wall: East (mission archive cabinets)

```
wall_id:              east
material_primary:     painted steel panel; reinforced
material_secondary:   bronze dado
panelisation:         standard
colour_value:         --token-color-ark-cades-pod-wall-east
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: ark.cades_console_pod.east.archive_cabinet.<n>  (3 cabinets stacked vertically)
    position: (2.95, 4.00, 0.00)
    dimensions: 0.40 × 3.00 × 1.00 each (3 stacked = 3.00 m tall)
    material: reinforced steel cabinet with bronze handle + bronze nameplate
    narrative_role: archived mission records (each cabinet covers a different mission category)
  - id: ark.cades_console_pod.east.relief.fallen_squads
    position: (2.95, 4.00, 3.20)
    dimensions: 0.80 × 0.60 × 0.10
    material: cast bronze
    narrative_role: relief depicting CADES squads who did not return
```

#### Wall: North (preparation locker)

```
wall_id:              north
material_primary:     painted steel panel; reinforced
material_secondary:   bronze dado
panelisation:         standard
colour_value:         --token-color-ark-cades-pod-wall-north
embedded_displays:
  - id: ark.cades_console_pod.north.display.tactical_overview
    position: (0.00, 7.95, 1.50)
    dimensions: 1.20 × 0.80 × 0.05
    content: tactical overview of current mission (when active); maps + threats
embedded_doors:        none
decorative_features:
  - id: ark.cades_console_pod.north.prep_locker
    position: (0.00, 7.95, 0.00)
    dimensions: 1.40 × 0.40 × 2.40
    material: reinforced steel locker with biometric + bronze nameplate
    narrative_role: pre-mission preparation locker; player equips final-loadout items here
```

#### Wall: West (memorial wall)

```
wall_id:              west
material_primary:     painted steel; gunmetal
material_secondary:   bronze dado
panelisation:         standard
colour_value:         --token-color-ark-cades-pod-wall-west
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: ark.cades_console_pod.west.memorial_wall
    position: (-2.95, 4.00, 1.50)
    dimensions: 0.10 × 5.00 × 2.20
    material: bronze panels with engraved names of fallen CADES squad members
    narrative_role: continuously-updating memorial; new names added when squadmates die in player's missions
```

### A.47.5 Ceiling

```
height_above_floor:     4.00 m baseline; central drop coffer at 3.50 m above briefing table
material:               painted steel + tactical conduit (visible)
lighting_integrated:    central pendant over briefing table; recessed fixtures around perimeter; cabinet task-lights
atmospheric_features:   minimal — utilitarian
acoustic_treatment:     baffled (intentional clean acoustic for voice clarity)
```

### A.47.6 Lighting

```
ambient_baseline:     5500 K (cool; tactical-clinical); 280 lux at floor level; CRI 92
direct_fixtures:
  - id: ark.cades_console_pod.light.briefing_table_pendant
    position: (0.00, 4.00, 3.50)
    beam_angle: 60° downward
    colour: --token-color-ark-cades-pod-pendant  (cool tactical white with amber-edge)
    intensity: 5000 lumens
    function: principal briefing-table illumination
  - id: ark.cades_console_pod.light.recessed_perimeter
    position: along all 4 walls at z = 3.80
    beam_angle: 180° wash
    colour: --token-color-ark-cades-pod-recessed  (cool white)
    intensity: 800 lumens per metre
    function: ambient task lighting
  - id: ark.cades_console_pod.light.cabinet_strip.east
    position: above east cabinets at z = 3.20
    beam_angle: 90° downward
    colour: cool 5500 K
    intensity: 600 lumens per metre
    function: cabinet definition
  - id: ark.cades_console_pod.light.locker_strip.north
    position: above north locker at z = 2.80
    beam_angle: 90° downward
    colour: cool 5500 K
    intensity: 400 lumens per metre
    function: locker accent
practical_sources:
  - id: ark.cades_console_pod.briefing_table_holo_glow
    position: (0.00, 4.00, 1.10)  # at briefing table top
    intensity: 600 lumens (when active; variable hologram colour)
    flicker_pattern: matches mission overlay
  - id: ark.cades_console_pod.memorial_wall_uplight
    position: along memorial wall base at z = 0.05
    intensity: 200 lumens (very subtle; reverent)
    flicker_pattern: stable
time_of_day_variation:
  acts_2_to_7: stable; in alert states (cross-ref Defense Command), red strobe activates
dynamic_response:
  - on_briefing_active: pendant + holo overlay intensify
  - on_squad_death: memorial wall briefly intensifies (one-shot)
  - on_alert: red strobe activates
```

### A.47.7 Atmosphere

```
air_temperature:    19°C (cool, focused)
humidity:           38% RH; smells of steel + gun oil + faint coffee
particulate:
  - dust: very low
  - cordite_residue: very low (cosmetic; suggests recent CADES use)
volumetric_fog:     absent
wind_drift:         minimal; 0.04 m/s
smell_canon:        steel + gun oil + coffee; voice-line: "smells like preparation and consequence"
```

### A.47.8 Sound

```
ambient_bed:           file: cades_console_pod_ambient_bed_v1.ogg (loop); -36 dB; very quiet; faint cooling-fan, distant Med Bay ambient through south door
point_sources:
  - sound.briefing_holo_hum: at table; -38 dB; continuous when active
  - sound.cabinet_buzz: at archive cabinets; -42 dB; continuous
  - sound.locker_biometric_buzz: at prep locker; -42 dB; continuous
  - sound.distant_med_bay: at south door; very faint Med Bay ambient bleed; -44 dB
  - sound.fallen_squads_resonance: at memorial wall; very faint reverent resonance; -44 dB; continuous
  - sound.alarm_klaxon: off baseline; -22 dB during alert
reverb_zone:           IR-impulse: cades_pod_v1.wav; wet-mix 12% (clean tactical)
music_eligibility:     cutscene only (Category C cs_disc_cades + cs_load_cades)
voice_line_eligibility:
  - speaker: the_captain (briefing voice; recorded): trigger active mission briefing
  - speaker: cades_squadmates (per mission): scripted
  - speaker: defense_command_relay: alert-state announcements
```

### A.47.9 Object inventory

CADES Pod has 24 inventory objects.

#### A.47.9.1 The Briefing Table

```
object_id:           ark.cades_console_pod.briefing_table
object_class:        display
position:            (0.00, 4.00, 0.00)
dimensions:          1.80 × 1.20 × 1.00
rotation:            0°
material_primary:    brushed-titanium frame with matte-black holographic projection top
material_secondary:  bronze edge-trim with status LEDs
colour_value:        --token-color-ark-cades-pod-briefing-table
interaction:         interactable
  - operate: opens CADES mission briefing UI; spawns 3D mission overlay above table
  - inspect: lore-note about CADES briefing system
narrative_role:      THE central briefing surface; primary CADES gameplay-launcher (paired with Armory loadout)
lore_anchor:         loredex.system.cades + arc.cades_missions
art_status:          producer_handoff
gameplay_hook_id:    trpc.cades.briefing_table.operate
wear_state:          slight wear at edges
physical_constraints: collides
```

#### A.47.9.2-3 Two Briefing Chairs (flanking table)

```
object_id:           ark.cades_console_pod.briefing_chair.east, .west
object_class:        furniture
positions:           (1.20, 4.00, 0.00), (-1.20, 4.00, 0.00)
dimensions (each):   0.80 × 0.80 × 1.20
rotation (each):     faces table
material_primary:    matte-black leather; titanium frame
material_secondary:  brass armrests
colour_value:        --token-color-ark-cades-pod-chair
interaction:         interactable - sit
narrative_role:      briefing seating (player + squad-leader briefer)
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          slight wear
physical_constraints: collides; sittable
```

#### A.47.9.4 The Pre-Mission Preparation Locker

```
object_id:           ark.cades_console_pod.prep_locker
object_class:        container
position:            (0.00, 7.95, 0.00)
dimensions:          1.40 × 0.40 × 2.40
rotation:            180°
material_primary:    reinforced steel with biometric lock
material_secondary:  bronze nameplate per slot (squadmate names)
colour_value:        --token-color-ark-cades-pod-prep-locker
interaction:         interactable
  - open: contains pre-mission essentials (medkits, comms gear, armor accessories)
  - inspect: lore-note about CADES pre-mission protocols
narrative_role:      final-loadout preparation; gameplay-key
lore_anchor:         loredex.system.cades_loadout
art_status:          producer_handoff
gameplay_hook_id:    trpc.cades.prep_locker.open
wear_state:          slight wear at handle
physical_constraints: collides
```

#### A.47.9.5-7 Three East Archive Cabinets (stacked)

```
object_id:           ark.cades_console_pod.east.archive_cabinet.<n>  (3 cabinets stacked: bottom = active missions, middle = completed missions, top = lost-squad records)
positions:           (2.95, 4.00, 0.00), (2.95, 4.00, 1.00), (2.95, 4.00, 2.00)
dimensions (each):   0.40 × 3.00 × 1.00
rotation:            270°  (parallel to east wall)
material_primary:    reinforced steel cabinet with bronze handle
material_secondary:  bronze nameplate per cabinet
colour_value:        --token-color-ark-cades-pod-archive-cabinet
interaction:         interactable
  - open: contains mission records / equipment manifests / lost-squad memorabilia
  - inspect: lore-note
narrative_role:      mission archive; gameplay-key for replay/review/lost-squad lore
lore_anchor:         loredex.system.cades_archive
art_status:          producer_handoff
gameplay_hook_id:    trpc.cades.archive_cabinet.open
wear_state:          slight wear at handles (top cabinet most-used)
physical_constraints: collides
```

#### A.47.9.8 The Memorial Wall (west)

Specced in walls A.47.4. Inventoried for completeness:

```
object_id:           ark.cades_console_pod.west.memorial_wall
object_class:        decoration  (also fx_emitter — uplight)
position:            (-2.95, 4.00, 1.50)
dimensions:          0.10 × 5.00 × 2.20
rotation:            90°
material_primary:    bronze panels with engraved fallen-squad names
material_secondary:  bronze foundation strip with continuous uplight
colour_value:        --token-color-ark-cades-pod-memorial
interaction:         inspectable
  - inspect: opens memorial-wall UI (player can read each fallen squadmate's record)
narrative_role:      continuously-updated memorial; reverent space; emotional anchor
lore_anchor:         loredex.system.cades_fallen + arc.player_squadmate_relationships
art_status:          producer_handoff
gameplay_hook_id:    trpc.cades.memorial_wall.read
wear_state:          slight patina on most-touched names
physical_constraints: non-collide (wall surface)
```

#### A.47.9.9-11 Captain's Briefing Anchor (NPC anchor) + 2 Squadmate Anchors

```
object_id:           ark.cades_console_pod.captain_anchor
object_class:        npc_anchor
position:            (0.00, 5.00, 0.00)  # at briefing table north side
dimensions:          0.80 × 0.80 × 1.80 (anchor)
rotation:            varies
material_primary:    n/a
material_secondary:  n/a
colour_value:        n/a
interaction:         n/a
narrative_role:      Captain (or briefing officer) anchors here when present (Acts 2+; varies by mission)
lore_anchor:         loredex.character.captain
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          n/a
physical_constraints: n/a

object_id:           ark.cades_console_pod.squadmate_anchor.east, .west  (2 anchors)
object_class:        npc_anchor
positions:           (1.50, 5.50, 0.00), (-1.50, 5.50, 0.00)
dimensions (each):   0.80 × 0.80 × 1.80 (anchor)
rotation:            varies
material_primary:    n/a
material_secondary:  n/a
colour_value:        n/a
interaction:         n/a
narrative_role:      CADES squadmates anchor here during pre-mission briefings
lore_anchor:         loredex.system.cades_squad
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          n/a
physical_constraints: n/a
```

#### A.47.9.12-15 Standing Equipment + Decorative

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.cades_console_pod.ammo_dispenser` | container | (1.00, 7.50, 0.00) | 0.40 × 0.30 × 1.40 | last-minute ammo restock |
| `ark.cades_console_pod.medkit_dispenser` | container | (-1.00, 7.50, 0.00) | 0.40 × 0.30 × 1.40 | last-minute medkit restock |
| `ark.cades_console_pod.tactical_overview_terminal` | console | (-1.50, 7.50, 0.00) | 0.60 × 0.40 × 1.10 | secondary tactical terminal |
| `ark.cades_console_pod.coffee_pot` | decoration | (1.50, 7.50, 0.85) | 0.20 × 0.20 × 0.30 | "always brewing" coffee pot |

#### A.47.9.16-20 Briefing Items + Atmosphere

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.cades_console_pod.briefing_table.holo_emitter` | fx_emitter | within table | n/a | holographic projection |
| `ark.cades_console_pod.briefing_table.notes_pad` | decoration | on table | 0.20 × 0.30 × 0.04 | briefing notes |
| `ark.cades_console_pod.briefing_table.tactical_pieces` | decoration | on table | varied | small tactical figurines |
| `ark.cades_console_pod.captain_lectern` | container | (0.00, 5.50, 0.00) | 0.40 × 0.40 × 1.20 | Captain's lectern (when briefing) |
| `ark.cades_console_pod.briefing_screen.overhead` | display | (0.00, 4.00, 3.00) | 1.40 × 1.00 × 0.05 | overhead briefing screen |

#### A.47.9.21-24 Closing Items

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.cades_console_pod.south.intercom` | console | (-1.00, 0.20, 1.50) | 0.20 × 0.10 × 0.30 | comms relay |
| `ark.cades_console_pod.fire_extinguisher.south` | interactive | (1.00, 0.20, 1.20) | 0.20 × 0.20 × 0.50 | safety |
| `ark.cades_console_pod.first_aid.kit.south` | container | (-2.00, 0.20, 1.50) | 0.40 × 0.10 × 0.30 | medical |
| `ark.cades_console_pod.alert_strobe` | fx_emitter | (0.00, 7.95, 3.50) | 0.20 × 0.20 × 0.20 | alert strobe (off baseline) |

Total: 24 inventory objects.

### A.47.10-17 Camera-spawn-points / Doorways / Adjacency / Hooks / Story / FX / Parametricity / Performance (compact)

```
camera_spawn_points:
  cs_amb_cades_pod (Cat B): POV at threshold; slow approach to briefing table; 14s
  cs_disc_cades (Cat C): seated; helmet POV; HUD calibrating; comms-static; 22s (per §3.1.C.3 catalogue — Captain narrates)
  cs_load_cades (Cat C): close-up on helmet placing on player's head; loading bar in HUD; 8s
  cs_first_cades_briefing (Act 2): seated at briefing table; Captain enters; first mission outline

doorways:
  south.door.main: connects to ark.med_bay; pressure_seal; Act 2+

adjacency:
  direct: ark.med_bay (south)
  one_hop: ark.armory (via Med Bay corridor + Engineering Bay); ark.defense_command (long route)

gameplay_hooks:
  - operateBriefingTable: trpc.cades.briefing_table.operate
  - openPrepLocker: trpc.cades.prep_locker.open
  - openArchiveCabinet: trpc.cades.archive_cabinet.open
  - readMemorialWall: trpc.cades.memorial_wall.read
  - takeAmmo: trpc.cades.ammo_dispenser.take
  - takeMedkit: trpc.cades.medkit_dispenser.take
  - operateTacticalTerminal: trpc.cades.tactical_terminal.operate
  - sitBriefingChair: trpc.cades.briefing_chair.sit

story_tie:
  primary_arcs:
    - act_2_first_cades_briefing
    - cades_missions (continuous Acts 2-7)
    - cades_squadmate_relationships
    - act_5_cades_revelations (lost-squad lore unlocks)
  per_act:
    acts_0_1: locked
    act_2: opens; first briefing
    act_3: more missions; squad expands
    act_4: alert states begin
    act_5: deep cades lore; lost-squad memorial expands
    act_7: state-branched: well-led ending vs. tragic ending
  npc_roster: the_captain (briefing); cades_squadmates (varies); the_player
  readables: creed plaque; fallen-squads relief; memorial wall; mission archives; briefing notes
  master_of_rlyeh_question: n/a

special_fx:
  particle_systems: dust (very low); cordite_residue (very low)
  volumetric: briefing_table_holo_overlay (3D mission map)
  procedural_animations: holo_overlay_cycle; memorial_uplight_breath
  reactive: pendant_intensify_on_briefing; memorial_intensify_on_squad_death; alert_strobe_on_alert

avatar_parametricity:
  small_xenomorph: alternate stand-on-step at briefing table
  others: all-reachable
  audio_occlusion: xenomorph: clean tactical acoustic richer

performance:
  polygon_budget: 180,000 / texture_budget: 100 MB / light_count_limit: 12
  streaming_behaviour: preload ark.med_bay (south); on_briefing_active: preload current mission map
```

---

## A.48 Eidolon Sanctum / Bond Chamber — FULL

**Status: FULL spec.** Cross-ref: `INCEPTION_ARK_FINAL_PRODUCTION.md`
§2.48 (art-state prompts); companion sanctum to Observation
Deck §A.6 (Eidolon-anchor) and Soul Stones system.

### A.48.1 Header

```
space_id:        ark.eidolon_sanctum
space_name:      Eidolon Sanctum / Bond Chamber
space_type:      ark_room  (sub-sanctum; Eidolon's deepest chamber)
act_introduced:  Act 3
lore_anchor:     loredex.system.soul_stones + loredex.character.eidolon + arc.eidolon_arc + arc.bond_chamber_resonance + arc.act_3_first_bond_session
aesthetic_tier:  dreamers_oneiric  (deeply mystic; soul-bound aesthetic)
```

### A.48.2 Geometry

```
dimensions:           9.00 m diameter × 5.50 m  (circular footprint)
origin_point:         centre of floor
coordinate_axes:      +x = right, +y = forward (north), +z = up
floor_plan_geometry:  circular  (4.50 m radius; perfect symmetry)
volumetric_anomalies: subtle non-Euclidean depth at central plinth (1.10× perceptual; reinforces "soul-bound" feel)
```

The Eidolon Sanctum is small, circular, intentionally
intimate. Central plinth holds the Soul Stones cradle. Walls
have 7 alcoves at 51.4° intervals — one per faction-aligned
soul-form. Domed ceiling with central oculus echoing
Observation Deck's. Gravity slightly reduced (~0.92g) to
reinforce "soul-realm" presence.

Floor area: ~63.6 m².

### A.48.3 Floor

```
material_primary:     polished obsidian-black marble in radial-wedge tiles (7 wedges; one per alcove); high-polish mirror finish
material_secondary:   gold inlay forming a 7-pointed star centred on plinth; brass perimeter trim
pattern:              7-wedge radial + 7-pointed star inlay
wear_state:           pristine (sacred space)
embedded_features:
  - id: ark.eidolon_sanctum.floor.charge_point.plinth
    position: (0.00, 0.00, 0.00)
    dimensions: 0.40 × 0.40 × 0.05
    function: plinth electronics + soul-stone resonance amplifier
  - id: ark.eidolon_sanctum.floor.alcove_anchor.<n>  (7 anchors at 51.4° intervals; radius 3.50 m)
    position: per alcove
    dimensions: 0.30 × 0.30 × 0.05 each
    function: alcove resonance + soul-form display
acoustic_property:    hard_reflective (marble); RT60 = 0.60s with subtle cosmic-resonance overlay
```

### A.48.4 Walls

```
wall_id:              perimeter_curved (single continuous curved wall divided into 7 alcove-zones at 51.4° intervals)
material_primary:     polished obsidian-black marble cladding curving with the room; alternating with deep alcove recesses (7 alcoves; each 1.20 m wide × 0.80 m deep × 4.20 m tall)
material_secondary:   gold-leaf rim around each alcove; bronze pilasters between
panelisation:         alcoves alternate with marble pilasters
colour_value:         --token-color-ark-eidolon-sanctum-wall  (deep obsidian-black with gold accents)
embedded_displays:
  - id: ark.eidolon_sanctum.south.display.bond_status
    position: (0.00, -4.45, 1.80)  # at south, near entrance
    dimensions: 0.60 × 0.40 × 0.05
    content: live Eidolon-bond strength + faction alignment
embedded_doors:
  - door_id: ark.eidolon_sanctum.south.door.main
    position: (0.00, -4.50, 0.00)
    dimensions: 1.20 × 2.40 × 0.10
    door_class: arch  (gold-inlaid bronze; opens with hush)
    connecting_space_id: ark.corridor.eidolon_approach
decorative_features:
  - id: ark.eidolon_sanctum.alcove.<faction>  (7 alcoves: architect_remnants, new_babylon, hierarchy, insurgency, dreamers_children, eidolon_unity, void)
    position: per perimeter at 51.4° intervals
    dimensions: 1.20 × 0.80 × 4.20 each
    material: marble backplane + gold-leaf relief (faction sigil) + soul-stone display niche
    narrative_role: each alcove represents one faction's soul-form; player's bond can deepen toward any of the 7
  - id: ark.eidolon_sanctum.south.plaque.principle
    position: (0.00, -4.45, 3.20)
    dimensions: 0.80 × 0.30 × 0.02
    material: cast bronze with gilt text
    narrative_role: reads "BIND TO BE BOUND"
```

### A.48.5 Ceiling

```
height_above_floor:     5.50 m baseline; central oculus rises to 7.20 m (echoes Observation Deck's central oculus; both feel cosmically connected)
material:               polished obsidian-black marble with gold-leaf coffer pattern radiating from oculus; central dome is partially transparent
lighting_integrated:    central oculus emits soul-resonance light; 7 alcove ceiling-strips define faction zones
atmospheric_features:   visible soul-motes drift continuously (cosmetic; matches Observation Deck Eidolon-presence)
acoustic_treatment:     domed apsidal (slight whispering effect; supports cosmic resonance)
```

### A.48.6 Lighting

```
ambient_baseline:     2700 K (very warm; sacred); 100 lux at floor (intentionally dim — gravity); CRI 95
direct_fixtures:
  - id: ark.eidolon_sanctum.light.oculus_central
    position: (0.00, 0.00, 7.20)
    beam_angle: 60° downward
    colour: --token-color-ark-eidolon-sanctum-oculus  (variable; depends on player's strongest faction-bond)
    intensity: 4500 lumens (pulses with Eidolon's resonance; period 4.2s — matches reactor heartbeat)
    function: principal — illuminates plinth
  - id: ark.eidolon_sanctum.light.alcove_strip.<n>  (7 strips)
    position: top of each alcove at z = 4.00
    beam_angle: 180° wash inward-downward
    colour: --token-color-ark-eidolon-sanctum-alcove  (varies per faction)
    intensity: 600 lumens each
    function: faction-zone illumination
  - id: ark.eidolon_sanctum.light.plinth_resonance
    position: (0.00, 0.00, 1.10)
    beam_angle: 360°
    colour: --token-color-ark-eidolon-sanctum-plinth  (variable based on bond state)
    intensity: 800 lumens (pulses with resonance)
    function: focal — soul-stone presence
practical_sources:
  - id: ark.eidolon_sanctum.candle_array.<n>  (7 small candle clusters, one per alcove base)
    position: per alcove
    intensity: 30 lumens each (subtle)
    flicker_pattern: organic flicker
time_of_day_variation:
  acts_3_to_7: stable; in late-act7, oculus colour reflects player's final faction-alignment from Hellbox commitments
dynamic_response:
  - on_player_at_plinth: plinth_resonance intensifies; oculus pulse synchronises with player's heartbeat
  - on_eidolon_summoned: all alcove strips intensify briefly
  - on_faction_bond_deepened: that alcove's strip intensifies permanently 20%
```

### A.48.7 Atmosphere

```
air_temperature:    19°C (cool — sacred)
humidity:           38% RH; smells of cold stone + gold-leaf metal + faint incense + ozone (cosmic radiation hint)
particulate:
  - soul_motes: medium (continuous; cosmetic suggesting "presence")
  - dust: very low
  - candle_smoke: very low (per candle)
volumetric_fog:     subtle haze at upper volume (0.05 g/m³, warm-gold)
wind_drift:         minimal; 0.01 m/s; subtle inward toward plinth
smell_canon:        cold stone + gold + incense + ozone; voice-line: "smells like the soul"
```

### A.48.8 Sound

```
ambient_bed:           file: eidolon_sanctum_ambient_bed_v1.ogg (loop); -38 dB; very quiet; cosmic resonance bed; faint single chime (period 30s); player's heartbeat audible
point_sources:
  - sound.cosmic_resonance: at oculus; -38 dB; continuous
  - sound.player_heartbeat_amplified: at plinth; subtle player-heartbeat amplification when standing on plinth; -34 dB
  - sound.distant_chime: at oculus; period 30s; -38 dB
  - sound.candle_flicker.<n>: 7 sources; -42 dB each
  - sound.eidolon_breath_amplified: at plinth when Eidolon present; -36 dB
reverb_zone:           IR-impulse: eidolon_sanctum_v1.wav; wet-mix 32% (long; cosmic)
music_eligibility:     cutscene only (Category B cs_amb_eidolon_sanctum + Eidolon-arc cutscenes)
voice_line_eligibility:
  - speaker: your_eidolon: rare presence; cross-ref Observation Deck Eidolon
  - speaker: faction_resonance_voices: 7 ambient whispers (one per faction); rare
```

### A.48.9 Object inventory (compact)

Eidolon Sanctum has 22 inventory objects.

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.eidolon_sanctum.central_plinth` | interactive | (0.00, 0.00, 0.00) | 1.20 dia × 1.10 | THE plinth; soul-stone cradle; Eidolon-bond ritual point |
| `ark.eidolon_sanctum.soul_stone_cradle` | interactive | on plinth | 0.40 × 0.40 × 0.20 | bronze cradle holding active soul stones |
| `ark.eidolon_sanctum.alcove.<faction>` (7) | container | per alcove | 1.20 × 0.80 × 4.20 each | faction soul-form display |
| `ark.eidolon_sanctum.candle_cluster.<alcove>` (7) | interactive | per alcove base | 0.20 × 0.30 × 0.30 each | bronze stand + 3 candles per cluster |
| `ark.eidolon_sanctum.observation_bench.south_arc` | furniture | (0.00, -2.50, 0.00) | 1.40 × 0.40 × 0.45 | curved bench facing plinth |
| `ark.eidolon_sanctum.curator_lectern` | container | (-1.50, -2.00, 0.00) | 0.40 × 0.30 × 1.20 | bronze lectern with bond-ritual guide |
| `ark.eidolon_sanctum.south.intercom` | console | (-0.80, -4.45, 1.50) | 0.20 × 0.10 × 0.30 | comms relay |
| `ark.eidolon_sanctum.first_aid.kit` | container | (0.80, -4.45, 1.50) | 0.40 × 0.10 × 0.30 | medical |
| `ark.eidolon_sanctum.compass_inlay` | decoration | (0.00, 0.00, 0.005) | 1.40 × 1.40 × 0.005 | floor 7-pointed star |
| `ark.eidolon_sanctum.dust_motes_emitter` | fx_emitter | distributed | n/a | soul-motes source |
| `ark.eidolon_sanctum.eidolon_resonance_emitter` | fx_emitter | (0.00, 0.00, 1.80) | n/a | Eidolon-presence shimmer source |
| `ark.eidolon_sanctum.south.plaque.principle` | decoration | (0.00, -4.45, 3.20) | 0.80 × 0.30 × 0.02 | "BIND TO BE BOUND" |

Total: 22 inventory objects (note: 7 alcoves + 7 candle clusters
counted as object class types; full per-alcove sub-inventory
deferred to Phase E).

### A.48.10-17 Compact

```
camera_spawn_points:
  cs_amb_eidolon_sanctum (Cat B): POV at threshold; slow approach to plinth; head pans to scan alcoves; 22s
  cs_first_bond_session (Act 3): POV at plinth; soul-stone placed; alcove resonates; 18s
  cs_eidolon_summon (state-conditional): POV facing oculus; Eidolon manifests through plinth resonance

doorways:
  south.door.main: connects to ark.corridor.eidolon_approach; arch; Act 3+; ceremonial slow-open

adjacency:
  direct: ark.corridor.eidolon_approach (south)
  one_hop: ark.observation_deck (via approach corridor; thematic kinship — both Eidolon spaces)

gameplay_hooks:
  - placeSoulStone: trpc.eidolon_sanctum.cradle.place
  - performBondRitual: trpc.eidolon_sanctum.plinth.ritual
  - inspectAlcove: trpc.eidolon_sanctum.alcove.inspect
  - lightCandle: trpc.eidolon_sanctum.candle.light
  - readCuratorLectern: trpc.eidolon_sanctum.curator_lectern.read

story_tie:
  primary_arcs:
    - act_3_first_bond_session
    - eidolon_arc (continuous; central)
    - bond_chamber_resonance
    - faction_alignment_via_soul_stones
  per_act:
    acts_0_2: locked
    act_3: opens; first bond ritual; soul stones become collectable
    act_4: alcove faction-bonds deepen via Hellbox commitments
    act_5: rare soul-stones unlock (legendary alcove)
    act_6: deep eidolon-fusion possible
    act_7: state-branched: deep-bonded (oculus matches dominant faction colour) vs. sparse-bonded (oculus dim)
  npc_roster: your_eidolon (rare presence); faction_resonance_voices (whispers); the_player
  readables: principle plaque; curator's bond-ritual guide; alcove sigils (per-faction lore)
  master_of_rlyeh_question: n/a (this is Eidolon's chamber; not Hellbox host)

special_fx:
  particle_systems: soul_motes (continuous); candle_smoke; dust (very low)
  volumetric: oculus_volumetric_glow; alcove_glow_per_faction
  procedural_animations: plinth_resonance_pulse (period 4.2s); soul_motes_drift; candle_flicker; alcove_subtle_glow_breath
  reactive: oculus_colour_shift_on_faction_alignment; plinth_intensify_on_player_proximity; alcove_intensify_on_inspection

avatar_parametricity:
  small_xenomorph: 0.85m; plinth feels enormous; alternate kneel-at-plinth posture
  others: all-reachable
  audio_occlusion: xenomorph: cosmic resonance more pronounced

performance:
  polygon_budget: 180,000 / texture_budget: 110 MB / light_count_limit: 14
  streaming_behaviour: preload eidolon_approach corridor
```

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

## A.50 Collectors Arena — NEW (Hellbox-10 host) — FULL

**NEW SPACE** introduced in v5 of the Hellbox cosmology. Did not
exist in the §2.x art-state catalogue prior to this branch. Added
to the deck between Pet Garden (§A.28) and Cargo Hold (§A.10).

**Status: FULL spec.** Cross-ref §3.12.12 HB10 Hall of Collected
Souls gateway.

### A.50.1 Header

```
space_id:        ark.collectors_arena
space_name:      Collectors Arena
space_type:      ark_room  (Hellbox-10 host; NEW v5 space)
act_introduced:  Act 3
lore_anchor:     loredex.system.collections + arc.collectors_arena_unlock + arc.act_3_HB10_first_invocation
aesthetic_tier:  dreamers_oneiric  (gallery-mausoleum hybrid; the room is between collection and elegy)
master_of_rlyeh_question: "What is the price of keeping?" (per HB10)
```

### A.50.2 Geometry

```
dimensions:           10.00 m diameter × 4.50 m  (circular footprint; bounding box 10.00 × 10.00 × 4.50)
origin_point:         centre of floor (room is circular; origin at geometric centre)
coordinate_axes:      +x = right (east), +y = forward (north), +z = up
floor_plan_geometry:  circular  (5.00 m radius)
volumetric_anomalies: none in baseline; HB10 transit briefly extends the room non-Euclidean (~10s — alcoves recede impossibly into infinite-gallery dimension)
```

The Collectors Arena is the smallest of the Ark's Hellbox-host
rooms by floor-area (~78.5 m²). The compactness is intentional —
it concentrates the player's relationship with their collected
items into a single confronting space. The central plinth is the
room's heart; alcoves are arranged in a ring around the perimeter.

Floor area: ~78.5 m².

### A.50.3 Floor

```
material_primary:     polished obsidian-black marble in radial wedge tiles; 12 wedges (one per alcove); each wedge tapers from 0.30 m wide at centre to ~2.60 m wide at perimeter; 4 mm gap between wedges
material_secondary:   gold inlay forming a 12-pointed star centred on plinth; the star's points align with the 12 alcoves
pattern:              radial wedges + 12-pointed star inlay; subtle anti-slip etch radiating outward from plinth
wear_state:           pristine in early acts; the 12 wedges show wear differentially based on which collectibles the player has prioritised (e.g., if player heavily plays cards, the "cards" wedge shows pacing-wear); a visual record of player priorities
embedded_features:
  - id: ark.collectors_arena.floor.charge_point.plinth
    position: (0.00, 0.00, 0.00)  # at room centre
    dimensions: 0.40 × 0.40 × 0.05
    function: plinth power-coupling
  - id: ark.collectors_arena.floor.alcove_anchor.<n>  (12 anchors)
    position: at base of each alcove (radius 4.20 m from centre at 30° intervals)
    dimensions: 0.30 × 0.30 × 0.05 each
    function: alcove display electronics
  - id: ark.collectors_arena.floor.entrance_threshold
    position: (0.00, -5.00, 0.00)  # at south entrance (south of centre, at perimeter)
    dimensions: 1.20 × 0.20 × 0.10
    function: entrance threshold + gameplay-flag trigger
acoustic_property:    hard_reflective (marble); RT60 = 0.60s (slight chamber-cathedral feel from circular geometry)
```

### A.50.4 Walls

The Collectors Arena has ONE continuous curved wall (circular
room). It is divided into 12 alcove-zones by structural pilasters
between alcoves.

```
wall_id:              perimeter_curved (single continuous wall divided into 12 alcove-zones)
material_primary:     polished obsidian-black marble cladding curving with the room; alternating with deep alcove recesses (12 alcoves, each 1.40 m wide at perimeter, 0.80 m deep)
material_secondary:   gold inlay along the wall-floor join; brass pilasters (24 mm wide × 4.20 m tall) between alcoves
panelisation:         each "panel" between pilasters is a marble alcove backplane
colour_value:         --token-color-ark-collectors-arena-wall  (deep obsidian-black with gold pin-stripe at z = 2.20 m)
embedded_displays:
  - id: ark.collectors_arena.south.display.collection_count
    position: (0.00, -4.95, 1.80)  # at south wall, near entrance
    dimensions: 0.60 × 0.40 × 0.05
    content: live-counter of player's total collectibles owned
embedded_doors:
  - door_id: ark.collectors_arena.south.door.main
    position: (0.00, -5.00, 0.00)
    dimensions: 1.40 × 2.40 × 0.10
    door_class: arch  (gold-inlaid bronze double-door; opens slowly with reverent sound)
    connecting_space_id: ark.corridor.collectors_approach
decorative_features:
  - id: ark.collectors_arena.alcove.<n>  (12 alcoves; specced in inventory)
  - id: ark.collectors_arena.pilaster.<n>  (12 pilasters between alcoves; specced in inventory)
  - id: ark.collectors_arena.south.plaque.principle
    position: (0.00, -4.95, 3.20)  # above entrance door
    dimensions: 0.80 × 0.30 × 0.02
    material: cast bronze with gilt text
    narrative_role: reads "WHAT IS KEPT, IS HELD" — the room's primary maxim
```

### A.50.5 Ceiling

```
height_above_floor:     4.50 m baseline; central oculus rises to 5.50 m (a domed translucent glass eye at the centre, directly above the plinth)
material:               polished obsidian-black marble with gold-leaf coffer detailing radiating from the central oculus
lighting_integrated:    central oculus emits soft warm-white light (acts as a "spotlight from above" on the plinth); 12 recessed accent lights at outer ring (one per alcove ceiling); subtle gold-edge lighting along all 12 pilaster tops
atmospheric_features:   subtle dust-mote drift visible in the oculus light shaft (intensifies during HB10 transit)
acoustic_treatment:     domed apsidal (slight whispering effect from curved geometry); coffered at perimeters
```

### A.50.6 Lighting

```
ambient_baseline:     2800 K (warm; gallery-museum); 140 lux at floor level (deliberately dim — gives gravity); CRI 95
direct_fixtures:
  - id: ark.collectors_arena.light.oculus_central
    position: (0.00, 0.00, 5.50)
    beam_angle: 60° downward
    colour: --token-color-ark-collectors-arena-oculus  (warm amber-white; suggests distant sun)
    intensity: 5000 lumens
    function: principal — "spotlight from above" on plinth
  - id: ark.collectors_arena.light.alcove_strip.<n>  (12 alcove ceiling strips)
    position: at top of each alcove (z = 4.20)
    beam_angle: 180° wash inward-downward
    colour: --token-color-ark-collectors-arena-alcove-strip  (warm amber)
    intensity: 800 lumens each
    function: alcove-defining (each alcove is its own gallery)
  - id: ark.collectors_arena.light.pilaster_uplight.<n>  (12 pilaster uplights at base)
    position: at base of each pilaster (z = 0.05)
    beam_angle: 30° upward
    colour: --token-color-ark-collectors-arena-pilaster-uplight  (warm gold)
    intensity: 200 lumens each
    function: dramatic vertical uplighting; reinforces the gallery-cathedral aesthetic
  - id: ark.collectors_arena.light.plinth_glow
    position: (0.00, 0.00, 1.10)  # at plinth top
    beam_angle: 360°
    colour: --token-color-ark-collectors-arena-plinth-glow  (warm amber pulsing slowly)
    intensity: 500 lumens (when plinth-object present); 0 when empty
    function: focal — signals "an object awaits"
practical_sources:
  - none  (intentional; the room's lighting is curated, not lived-in)
time_of_day_variation:
  acts_3_to_7: stable lighting; in HB10-active state, oculus glow intensifies and turns slightly cyan-amber
dynamic_response:
  - on_plinth_object_appears: plinth_glow activates; oculus brightens 20%
  - on_HB10_invoke: oculus pulses asymmetrically; pilasters dim; alcove strips flicker; transit begins (cf §3.12.12)
```

### A.50.7 Atmosphere

```
air_temperature:    19°C (cool — gallery)
humidity:           36% RH (low — preservation atmosphere); smells of cold-stone + faint metallic-bronze + very faint pine-resin (canonical scent of "what is kept")
particulate:
  - type: dust_motes
    density: low (visible in oculus light shaft)
    colour: warm-greyish
    drift_direction: slow downward
volumetric_fog:     absent in baseline; subtle volumetric beam from oculus during HB10 transit
wind_drift:         minimal; 0.02 m/s; slight inward-spiral toward plinth (subtle convection)
smell_canon:        cold-stone + bronze + pine-resin; voice-line: "smells like a museum at night"
```

### A.50.8 Sound

```
ambient_bed:           file: collectors_arena_ambient_bed_v1.ogg (loop); -38 dB; very quiet; faint distant chime (period 60s), subtle marble-resonance from circular geometry
point_sources:
  - id: ark.collectors_arena.sound.distant_chime
    position: (0.00, 0.00, 5.50)  # from oculus
    sound: faint single chime (period 60s; -38 dB per chime)
    occlusion_behaviour: omnidirectional
    trigger: cyclic
  - id: ark.collectors_arena.sound.plinth_object_resonance
    position: (0.00, 0.00, 1.10)
    sound: subtle metallic resonance (when object present; -36 dB)
    occlusion_behaviour: standard
    trigger: state-conditional (when plinth_object present)
  - id: ark.collectors_arena.sound.alcove_subtle_hum.<n>  (12 sources)
    position: per alcove
    sound: very faint hum unique to each alcove's category (-44 dB each; e.g., cards alcove has card-shuffle, pets alcove has faint creature-breath)
    occlusion_behaviour: standard
    trigger: continuous
  - id: ark.collectors_arena.sound.curtain_curtain  (HB10 transit)
    position: dynamic
    sound: spirit-form chime + vast space opening audibly (one-shot during HB10)
    occlusion_behaviour: omnidirectional
    trigger: state-conditional
reverb_zone:           IR-impulse: collectors_arena_v1.wav; wet-mix 30% (slight whisper-gallery from circular)
music_eligibility:     cutscene only (HB10 transit + Category B cs_amb_collectors_arena — deferred)
voice_line_eligibility:
  - speaker: the_master_of_rlyeh
    trigger: HB10 transit only
    line_set: HB10-specific
  - speaker: the_collected_souls_whispers  (during HB10 active states; rare, brief)
    trigger: state-conditional
    line_set: HB10-specific (in destination)
```

### A.50.9 Object inventory

Collectors Arena has 32 inventory objects.

#### A.50.9.1 The Central Plinth (HB10 gateway)

```
object_id:           ark.collectors_arena.central_plinth
object_class:        interactive  (also fx_emitter for HB10 transit)
position:            (0.00, 0.00, 0.00)
dimensions:          1.20 dia × 1.10 tall (cylindrical)
rotation:            0°
material_primary:    polished black granite cylinder with gold rim at top (40 mm gold band)
material_secondary:  brass interior glow when active
colour_value:        --token-color-ark-collectors-arena-plinth  (deep granite-black with gold accents)
interaction:         interactable
  - inspect (empty): "the plinth waits"
  - examine (object present): inspect the most-neglected collectible the player owns
  - lift_object: lifts the plinth-object — triggers HB10 transit cutscene (cf §3.12.12)
narrative_role:      THE plinth; cosmologically the HB10 gateway. When the player has 10+ collectibles, the most-neglected item materialises here. Lifting it is the gateway invocation.
lore_anchor:         loredex.system.collections + arc.act_3_HB10_first_invocation
art_status:          producer_handoff
gameplay_hook_id:    trpc.collectors_arena.plinth.examine + trpc.hellbox.hb10.openGate (state-conditional)
wear_state:          pristine but with subtle wear-rim where most-neglected items materialise (worn down by repeated invocations across timelines)
physical_constraints: collides; player can lean
```

#### A.50.9.2-13 The Twelve Alcoves (12 collectible-category galleries)

```
object_id:           ark.collectors_arena.alcove.<category>  (12 alcoves)
object_class:        container  (each alcove is a curated mini-gallery)
positions:           around perimeter at radius 4.20 m from centre, at 30° intervals starting from north (12 o'clock):
  - alcove.cards: at 0° (north)
  - alcove.pets: at 30° (NNE)
  - alcove.trade_goods: at 60° (ENE)
  - alcove.soul_stones: at 90° (east)
  - alcove.songs: at 120° (ESE)
  - alcove.memories: at 150° (SSE)
  - alcove.scars: at 180° (south of plinth, but near south door)
  - alcove.debts: at 210° (SSW)
  - alcove.promises: at 240° (WSW)
  - alcove.trophies: at 270° (west)
  - alcove.tools: at 300° (WNW)
  - alcove.vows: at 330° (NNW)
dimensions (each):   1.40 wide × 0.80 deep × 4.20 tall
rotation (each):     faces inward toward plinth
material_primary:    polished obsidian-black marble backplane + display-stand
material_secondary:  gold-inlay frame around alcove; bronze nameplate
colour_value:        --token-color-ark-collectors-arena-alcove-frame
interaction:         interactable
  - examine: opens alcove-detail UI; player sees a representative sample of their collection in this category + reflective lore-readable about the category
  - inspect_item: each item shown is inspectable
  - release_item (HB10 sub-mechanic): player can release a specific item from this alcove (loses item permanently; gains lore-flag)
narrative_role:      gallery-mausoleum aesthetic; each alcove tells the story of what the player has collected in that category; the categorisation itself is the player's character arc
lore_anchor:         per-category (12 sub-systems)
art_status:          producer_handoff
gameplay_hook_id:    trpc.collectors_arena.alcove.examine + .release
wear_state:          varies by player's engagement with each category (e.g., heavily-used alcoves show subtle wear at frame-edges)
physical_constraints: collides; player can step inside
```

(All 12 alcoves follow the same template. The 12 categories
align with the player's 12 axes of accumulation across the
entire game; releasing items from an alcove is the principal
HB10 mechanic per §3.12.12.)

#### A.50.9.14-25 The Twelve Pilasters

```
object_id:           ark.collectors_arena.pilaster.<n>  (12 pilasters; n = 1..12)
object_class:        decoration
positions:           between alcoves at radius 4.95 m from centre, at 15° intervals offset from alcove positions (one pilaster between each pair of alcoves)
dimensions (each):   0.24 × 0.24 × 4.20
rotation:            radial (each faces inward)
material_primary:    cast bronze with gilt detail
material_secondary:  bronze cap top; bronze base
colour_value:        --token-color-ark-collectors-arena-pilaster-bronze
interaction:         inert
narrative_role:      structural + aesthetic; reinforces the cathedral-gallery feel; each pilaster is identical (intentional uniformity — the variation is in the alcoves between)
lore_anchor:         loredex.aesthetic.collectors_arena
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          slight patina at base; pristine elsewhere
physical_constraints: collides
```

#### A.50.9.26-28 Three Observation Benches

```
object_id:           ark.collectors_arena.observation_bench.<n>  (n = 1..3; positioned at 0°, 120°, 240° on a smaller inner radius of 2.80 m)
object_class:        furniture
positions:           [
  (0.00, 2.80, 0.00),                # bench 1 (south of plinth, faces north)
  (-2.42, -1.40, 0.00),              # bench 2 (north-west, faces SE toward plinth)
  (2.42, -1.40, 0.00),               # bench 3 (north-east, faces SW toward plinth)
]
dimensions (each):   1.40 × 0.40 × 0.45  (curved bench matching circular room)
rotation:            varies (radial; faces plinth)
material_primary:    polished obsidian-black marble seat with gold-leaf trim
material_secondary:  bronze leg-supports
colour_value:        --token-color-ark-collectors-arena-bench
interaction:         interactable - sit (positions player to contemplate plinth + alcoves)
narrative_role:      contemplation seating; player can sit in three triangulated positions and reflect on collection
lore_anchor:         arc.player_reflection
art_status:          producer_handoff
gameplay_hook_id:    none (positional)
wear_state:          slight wear at sit-zones
physical_constraints: collides; sittable
```

#### A.50.9.29 The Curator's Lectern (south-east, near entrance)

```
object_id:           ark.collectors_arena.curator_lectern
object_class:        container
position:            (1.50, -3.50, 0.00)  # near south entrance, slightly east
dimensions:          0.50 × 0.40 × 1.20
rotation:            45°  (faces inward)
material_primary:    cast bronze stand with inclined display-plate
material_secondary:  open lore-readable tome on the inclined plate
colour_value:        --token-color-ark-collectors-arena-lectern
interaction:         interactable
  - inspect: opens the curator's tome — multi-screen lore-readable about the room's purpose (canonical narrative of "what is kept")
narrative_role:      sets the room's emotional register on entry; the curator is canonically an Editor-adjacent figure
lore_anchor:         arc.collectors_arena_canon + cross-ref §A.21 Cipher Den
art_status:          producer_handoff
gameplay_hook_id:    trpc.collectors_arena.curator_lectern.read
wear_state:          slight wear at most-handled pages
physical_constraints: collides
```

#### A.50.9.30 South Entrance Plaque (above door)

```
object_id:           ark.collectors_arena.south.plaque.principle
object_class:        decoration
position:            (0.00, -4.95, 3.20)
dimensions:          0.80 × 0.30 × 0.02
rotation:            180°
material_primary:    cast bronze with gilt text
material_secondary:  none
colour_value:        --token-color-ark-collectors-arena-plaque-bronze
interaction:         inspectable
  - inspect: reads "WHAT IS KEPT, IS HELD"
narrative_role:      sets the room's principle on entry
lore_anchor:         arc.collectors_arena_canon
art_status:          producer_handoff
gameplay_hook_id:    trpc.collectors_arena.plaque.read
wear_state:          slight wear
physical_constraints: non-collide
```

#### A.50.9.31-32 Closing Decorative Items

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.collectors_arena.south.intercom` | console | (-0.50, -4.95, 1.50) on south wall | 0.20 × 0.10 × 0.30 | comms relay (silent in baseline) |
| `ark.collectors_arena.fire_extinguisher.south` | interactive | (0.50, -4.95, 1.20) on south wall | 0.20 × 0.20 × 0.50 | safety |

Total: 32 inventory objects.

### A.50.10 Camera-spawn-points (FPV cutscenes)

```
cutscene_id:         cs_amb_collectors_arena  (Category B Myst-ambient; deferred catalogue)
camera_position:     (0.00, -4.50, eye_level)
camera_facing:       (0°, 0°, 0°)  # facing plinth
avatar_height_anchor: eye_level
head_motion:         very slow forward dolly toward plinth, slight head-pan to scan alcoves; lasts 24s

cutscene_id:         cs_hellbox_10_open  (HB10 Hall of Collected Souls gateway)
camera_position:     (0.00, -1.00, eye_level)  # at plinth, hands lifted
camera_facing:       (0°, -25°, 0°)  # looking down at plinth-object
avatar_height_anchor: eye_level
head_motion:         hand-rig enters frame; hand picks up plinth-object; object dissolves into spirit-form; Hall manifests around player

cutscene_id:         cs_hellbox_10_transit  (HB10 transit)
camera_position:     (0.00, -1.00, eye_level)
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         POV travels through gallery of pedestals, each holding a spirit-form figure

cutscene_id:         cs_hellbox_10_release  (per-release in destination; rare in source-room)
camera_position:     (varies; at destination)
camera_facing:       (0°, -10°, 0°)
avatar_height_anchor: eye_level
head_motion:         hand enters frame touching figure; figure dissolves to motes

cutscene_id:         cs_hellbox_10_close  (HB10 return)
camera_position:     (0.00, -1.00, eye_level)
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         figures fade; gallery resolves back to Collectors Arena
```

### A.50.11 Doorways

```
door_id:            ark.collectors_arena.south.door.main
connecting_space_id: ark.corridor.collectors_approach
door_position:      (0.00, -5.00, 0.00)
door_dimensions:    1.40 × 2.40 × 0.10
door_class:         arch
unlock_condition:   Act 3+ (player must have acquired 3+ collectibles before entry)
transit_animation:  ceremonial slow-open (3s) on first entry; instant on subsequent
audio_signature:    bronze-on-stone resonance + chain-rattle + faint chime
```

### A.50.12 Adjacency map

```
direct_adjacencies:
  - ark.corridor.collectors_approach (south door)
  - hellbox.hall_of_collected_souls (HB10 portal via plinth, conditional on 10+ collectibles)
one_hop_adjacencies:
  - ark.pet_garden (via approach corridor; thematic kinship — Pet Garden's collected pets feed into HB10's pets alcove)
  - ark.cargo_hold (via approach; trade-goods alcove sources)
  - destination.hall_of_collected_souls (via HB10)
```

### A.50.13 Gameplay hooks

```
hooks:
  - hook_id:         collectors_arena.examineAlcove
    trigger:         player.examine on alcove.<category>
    procedure:       trpc.collectors_arena.alcove.examine
    success_state:   alcove_examined = true (per-alcove)
  - hook_id:         collectors_arena.releaseAlcoveItem
    trigger:         player.release on alcove.<category>.item
    procedure:       trpc.collectors_arena.alcove.release
    success_state:   item_released = true (per-item; permanent loss but lore-flag gain)
  - hook_id:         collectors_arena.examinePlinth
    trigger:         player.examine on central_plinth (with plinth_object present)
    procedure:       trpc.collectors_arena.plinth.examine
    success_state:   plinth_object_examined = true
  - hook_id:         collectors_arena.invokeHB10
    trigger:         player.lift on central_plinth (with plinth_object + 10+ collectibles)
    procedure:       trpc.hellbox.hb10.openGate
    success_state:   hellbox_10_transit_started = true
  - hook_id:         collectors_arena.readCuratorTome
    trigger:         player.inspect on curator_lectern
    procedure:       trpc.collectors_arena.curator_lectern.read
    success_state:   curator_tome_read = true
  - hook_id:         collectors_arena.readPlaque
    trigger:         player.inspect on south.plaque.principle
    procedure:       trpc.collectors_arena.plaque.read
    success_state:   plaque_read = true
```

### A.50.14 Story-tie

```
primary_arcs:
  - arc.collectors_arena_unlock
  - arc.act_3_HB10_first_invocation
  - arc.collectors_arena_canon (the curator's tome)
  - arc.player_collection_history (continuous; tracks across all 12 categories)
per_act_evolution:
  acts_0_2: room locked; player must accumulate 3+ collectibles to gain entry
  act_3: room opens; player visits and explores 12 alcoves; HB10 first invocable when 10+ collectibles owned
  act_4: more alcoves become "active" (their content expands as player accumulates); plinth-object refreshes between visits to most-neglected item
  act_5: deep alcove inspections reveal hidden lore; cumulative releases tracked
  act_6: cumulative release-vs-keep ratio begins affecting "collected souls" count (visible in HB10 destination)
  act_7: state branched: hoarder ending (released few; kept many) vs. ascetic ending (released many; kept few); both have their own lore weight
npc_roster:
  - the_player: visitor; only NPC who interacts with this room
  - the_curator: presence-only (felt as faint guidance in alcove inspections; never visible)
  - the_master_of_rlyeh: HB10 transit voice only
  - collected_souls_whispers: presence in HB10 destination only
readables:
  - principle plaque (south)
  - curator's tome (multi-screen canonical narrative)
  - 12 alcove lore-readables (one per category; expands with accumulation)
  - cumulative collection-count display (south wall)
master_of_rlyeh_question: "What is the price of keeping?"
```

### A.50.15 Special-FX

```
particle_systems:
  - dust_motes (low; visible in oculus light shaft)
  - alcove_subtle_glow_per_alcove (each alcove has its own particle signature based on its category; e.g., cards alcove has card-edge glints, pets alcove has spirit-wisps)
  - HB10_spirit_form_dissolution (one-shot during HB10 transit; plinth-object dissolves into spirit motes)
volumetric_effects:
  - oculus_light_shaft (visible in lower-light states; cone from oculus to plinth)
  - alcove_glow_per_alcove (subtle ambient glow per alcove)
  - HB10_gallery_extension (one-shot; alcoves recede impossibly during transit)
procedural_animations:
  - plinth_object_subtle_rotation (when present; very slow; cosmetic)
  - distant_chime_visualisation (very subtle pulse on each chime)
  - alcove_content_re_arrange (Acts 4+; alcove content re-organises slowly between visits — Editor's hand)
reactive_systems:
  - plinth_glow_on_proximity (within 1.5 m, plinth glows softly)
  - alcove_strip_intensify_on_proximity (when player enters alcove)
  - oculus_brightness_on_plinth_object_appears (one-shot)
  - HB10_transit_one_shot (when conditions met)
  - alcove_lore_unlock_on_release (when player releases an item, that alcove's lore-readable expands)
```

### A.50.16 Avatar-parametricity

```
camera_height_variation:
  small_xenomorph (0.85m eye): camera height 0.85m; plinth feels enormous; alcove items appear at face-level
  short_humanoid (1.40m eye): standard
  average_humanoid (1.70m eye): standard
  tall_humanoid (2.05m eye): plinth feels smaller; oculus nearer head
  tall_xenomorph (2.70m eye): pilasters appear short; player must duck slightly inside alcoves
reachability:
  small_xenomorph: cannot reach top alcove items; alternate inspect-from-below mode
  small_xenomorph: cannot reach principle plaque (3.20 m); relay-inspect from below
  others: all-reachable
audio_occlusion_variation:
  xenomorph_sensitive_hearing: distant chime audible from any alcove; alcove subtle hums each distinct
  synthetic_voice_avatar: curator's presence has different "feel" (synthetic resonance bias)
```

### A.50.17 Performance

```
polygon_budget:      220,000 polygons (compact room; rich alcove decorative density)
texture_budget:      130 MB total (12 alcove categories × unique textures)
light_count_limit:   16 simultaneous dynamic lights
lod_plan:
  - hero_distance: 0-6m, full detail
  - mid_distance: 6-12m, mid detail (small alcove items simplified)
  - low_distance: 12m+, low detail (mostly billboarded)
streaming_behaviour:
  - preload: ark.corridor.collectors_approach (south)
  - on_player_at_plinth + 10+_collectibles: preload destination.hall_of_collected_souls
```

---

## A.51 Game Hall — NEW (Hellbox-12 host) — FULL

**NEW SPACE** introduced in v5 of the Hellbox cosmology. Did not
exist in the §2.x art-state catalogue prior to this branch. Added
to the deck in the entertainment / community zone (between Social
Hub §A.15 and the Casino Gaming Floor §A.39).

**Status: FULL spec.** Cross-ref §3.12.14 HB12 Dischordian Arena
gateway.

### A.51.1 Header

```
space_id:        ark.game_hall
space_name:      Game Hall (Dischordia card duel hall)
space_type:      ark_room  (Hellbox-12 host; NEW v5 space)
act_introduced:  Act 2  (after first Dischordia card tutorial; HB12 unlocks Act 2 after first duel)
lore_anchor:     loredex.system.dischordia_card_game + loredex.character.game_master + arc.act_2_first_card_duel + arc.act_2_HB12_first_invocation
aesthetic_tier:  solar_punk_cathedral  (theatrical-arena aesthetic; with deeper shadows than other Ark rooms — meta-narrative gravity)
master_of_rlyeh_question: "Does the game play you, or do you play the game?" (per HB12)
```

### A.51.2 Geometry

```
dimensions:           16.00 m × 14.00 m × 6.50 m
origin_point:         centre of floor at the south entrance threshold
coordinate_axes:      +x = right, +y = forward (north), +z = up
floor_plan_geometry:  rectangular  (with a slight elevation change — tiered seating along east + west walls rises in 3 steps)
volumetric_anomalies: none in baseline; HB12 transit briefly distorts the central duel-board (~10s — cards' illustrations look directly at the camera; corridor of cards extends impossibly north)
```

The Game Hall is theatrical: the central duel-board is on a
raised dais (0.60 m above floor); tiered observer seating flanks
east and west; a Game Master's elevated chair faces the duel-
board from the north; smaller practice tables ring the perimeter.
The room is taller than typical Ark rooms (6.50 m) to accommodate
spectator galleries.

Floor area: 224 m².

### A.51.3 Floor

```
material_primary:     polished black-and-crimson marble in a chevron pattern (matching Hierarchy throne, but with crimson instead of white — signals "performance space"); 0.60 m × 0.60 m tiles
material_secondary:   gold inlay outlining the central dais (3.20 × 3.20 m raised area); brass meditation-circle inlays at each corner of the room
pattern:              chevron with focal radial pattern around central dais
wear_state:           pristine; slight wear at central dais access points (south + east + west steps)
embedded_features:
  - id: ark.game_hall.floor.dais_steps  (3 steps up to central dais on south side)
    position: (0.00, 4.00 to 4.40, 0.00)
    dimensions: 4.40 × 0.20 × 0.20 each step (3 steps)
    function: dais access (south side only — east + west are flanked by tiered seating)
  - id: ark.game_hall.floor.charge_point.duel_board
    position: (0.00, 7.00, 0.60)  # under central duel-board, on dais top
    dimensions: 0.40 × 0.40 × 0.05
    function: duel-board electronics + holographic projection power
  - id: ark.game_hall.floor.practice_table_anchor.<n>  (4 practice tables; one per corner of room)
    position: per corner
    dimensions: 0.30 × 0.30 × 0.05 each
    function: practice-table electronics
acoustic_property:    hard_reflective (marble) with subtle damping from velvet curtains; RT60 = 0.65s
```

### A.51.4 Walls

#### Wall: South (entrance)

```
wall_id:              south
material_primary:     polished black-marble cladding with carved theatrical-mask reliefs at z = 1.20 to 2.40
material_secondary:   gold dado at z = 1.20 m
panelisation:         9 panels wide × 4 panels tall
colour_value:         --token-color-ark-game-hall-wall-south  (black marble with gold pin-stripe; faint crimson-glow at z = 2.00 m during HB12-active states)
embedded_displays:
  - id: ark.game_hall.south.display.tournament_ladder
    position: (-3.50, 0.20, 1.80)
    dimensions: 1.20 × 0.80 × 0.05
    content: tournament ladder + player rankings
  - id: ark.game_hall.south.display.player_deck_stats
    position: (3.50, 0.20, 1.80)
    dimensions: 1.20 × 0.80 × 0.05
    content: player's current deck statistics + match history
embedded_doors:
  - door_id: ark.game_hall.south.door.main
    position: (0.00, 0.00, 0.00)
    dimensions: 1.40 × 2.40 × 0.10
    door_class: arch  (gold-inlaid bronze double-door with theatrical-mask motif)
    connecting_space_id: ark.corridor.game_hall_approach
decorative_features:
  - id: ark.game_hall.south.plaque.principle
    position: (0.00, 0.20, 3.20)
    dimensions: 1.00 × 0.40 × 0.02
    material: cast bronze with gilt text
    narrative_role: reads "THE GAME PLAYS BACK" — the room's primary maxim
  - id: ark.game_hall.south.theatrical_mask.left, .right
    position: (-2.00, 0.20, 4.50), (2.00, 0.20, 4.50)
    dimensions: 0.40 × 0.30 × 0.10 each
    material: cast bronze (one comedy mask, one tragedy mask)
    narrative_role: theatrical aesthetic; signals "this is performance space"
```

#### Wall: East (with tiered observer seating)

```
wall_id:              east
material_primary:     polished black-marble cladding with deep theatrical-style velvet curtains at upper sections (z = 3.00 to 6.50)
material_secondary:   gold dado; tiered seating built into wall (3 tiers rising west-to-east; each tier 0.40 m higher than previous; tier 1 at z = 0.40, tier 2 at z = 0.80, tier 3 at z = 1.20)
panelisation:         walls + tiered seating zones
colour_value:         --token-color-ark-game-hall-wall-east  (black marble with crimson velvet upper)
embedded_displays:
  - id: ark.game_hall.east.display.live_match_view
    position: (7.95, 7.00, 4.50)  # high on east wall, central
    dimensions: 1.80 × 1.20 × 0.05
    content: live match view from spectator angle
embedded_doors:        none
decorative_features:
  - id: ark.game_hall.east.tier_seating.tier_1, .tier_2, .tier_3
    position: along east wall at varying heights
    dimensions: 14.00 × 0.50 × 0.40 (each tier; long benches)
    material: polished walnut with crimson-velvet padding
    narrative_role: tiered observer seating; spectators watch matches
  - id: ark.game_hall.east.curtain.upper
    position: (7.95, 7.00, 4.50 to 6.50)
    dimensions: 0.10 × 14.00 × 2.00
    material: deep crimson velvet (theatrical drapery)
    narrative_role: theatrical aesthetic + acoustic damping
```

#### Wall: North (Game Master's elevated chair zone)

```
wall_id:              north
material_primary:     polished black-marble with deep apsidal niche at centre-north (where Game Master's elevated chair is anchored)
material_secondary:   gold dado; gold-inlaid relief of "the eternal contest"
panelisation:         apsidal central niche
colour_value:         --token-color-ark-game-hall-wall-north  (black marble with prominent gold + crimson detailing)
embedded_displays:
  - id: ark.game_hall.north.display.match_judge_panel
    position: (0.00, 13.95, 1.50)  # below Game Master's elevated chair
    dimensions: 1.00 × 0.60 × 0.05
    content: match-judge tools (referee panel; only Game Master uses)
embedded_doors:        none
decorative_features:
  - id: ark.game_hall.north.alcove.game_master
    position: (0.00, 13.95, 1.50)  # raised platform for Game Master
    dimensions: 2.40 × 1.20 × 0.80 (alcove platform)
    material: polished black marble + crimson velvet upholstery on platform
    narrative_role: Game Master's elevated chair anchors here; he watches all duels from above
  - id: ark.game_hall.north.relief.eternal_contest
    position: (0.00, 13.85, 4.00)  # high above Game Master alcove
    dimensions: 3.00 × 2.40 × 0.10
    material: cast bronze with gilt highlights
    narrative_role: depicts dueling figures across eternity; sub-narrative: "the game has always been"
```

#### Wall: West (mirror of east)

```
wall_id:              west
material_primary:     same as east (with mirrored tiered seating + curtains)
material_secondary:   gold dado
panelisation:         mirror of east
colour_value:         --token-color-ark-game-hall-wall-west
embedded_displays:
  - id: ark.game_hall.west.display.live_match_view
    position: (0.05, 7.00, 4.50)  # mirror
    dimensions: 1.80 × 1.20 × 0.05
    content: live match view (mirror perspective)
embedded_doors:        none
decorative_features:
  - id: ark.game_hall.west.tier_seating.tier_1, .tier_2, .tier_3
    position: mirror
    dimensions: 14.00 × 0.50 × 0.40 each
    material: same as east
    narrative_role: tiered observer seating (mirror)
  - id: ark.game_hall.west.curtain.upper
    position: (0.05, 7.00, 4.50 to 6.50)
    dimensions: 0.10 × 14.00 × 2.00
    material: deep crimson velvet
    narrative_role: theatrical aesthetic + acoustic damping
```

### A.51.5 Ceiling

```
height_above_floor:     6.50 m baseline; central dome rises to 7.50 m above central dais (theatrical apex); perimeter drop to 5.50 m within 1.50 m of walls
material:               polished black marble cladding with gold-leaf coffer detailing radiating from central dome
lighting_integrated:    central pendant chandelier (7-tier crystal) above duel-board; recessed strip-lights at each tier-seating ceiling; spotlight clusters mounted on apsidal dome (theatrical lighting)
atmospheric_features:   subtle dust-mote drift visible in central pendant light shaft (intensifies during HB12 transit + match-completion moments)
acoustic_treatment:     coffered + apsidal dome echo; velvet curtains absorb mid-frequencies (intentional audio damping for clear voice-line delivery)
```

### A.51.6 Lighting

```
ambient_baseline:     2400 K (very warm; theatrical); 90 lux at floor level baseline (deliberately dim — gives drama); CRI 95
direct_fixtures:
  - id: ark.game_hall.light.central_pendant_chandelier
    position: (0.00, 7.00, 7.30)  # above duel-board
    beam_angle: 90° downward
    colour: --token-color-ark-game-hall-pendant  (warm amber with crystal scatter to create rainbow prisms)
    intensity: 8000 lumens (with prism dispersion)
    function: principal task lighting on duel-board; highly visible focal point
  - id: ark.game_hall.light.dais_perimeter
    position: along edges of central dais at z = 0.60
    beam_angle: 30° upward (uplight)
    colour: --token-color-ark-game-hall-dais-uplight  (warm amber with crimson tint)
    intensity: 800 lumens per metre (12.8 metres total perimeter)
    function: dramatically separates central dais; reinforces theatrical staging
  - id: ark.game_hall.light.tier_seating_strip.east, .west
    position: along tier seating ceilings
    beam_angle: 180° wash
    colour: --token-color-ark-game-hall-tier-strip  (warm amber)
    intensity: 600 lumens per metre
    function: spectator-area lighting (slightly dimmer than central; observer atmosphere)
  - id: ark.game_hall.light.game_master_alcove_glow
    position: (0.00, 13.95, 4.00)  # above Game Master alcove
    beam_angle: 60° downward
    colour: --token-color-ark-game-hall-game-master-alcove  (warm gold)
    intensity: 3500 lumens
    function: dramatic apse-light onto Game Master's chair
  - id: ark.game_hall.light.spot_array.dome  (4 theatrical spotlights from dome apex)
    position: (varied; arranged around dome apex at z = 7.50; aimed at central dais)
    beam_angle: 30° each
    colour: --token-color-ark-game-hall-spotlight  (warm white; slightly variable per spot)
    intensity: 4000 lumens each
    function: theatrical spotlights — focus eye on duel-board action
practical_sources:
  - id: ark.game_hall.duel_board.cards_face_glow
    position: (0.00, 7.00, 0.65)  # at duel-board top
    intensity: 200 lumens (when match in progress; cards have subtle face-lighting for legibility)
    flicker_pattern: stable
  - id: ark.game_hall.duel_board.match_clock_glow
    position: (0.00, 7.00 + 0.50, 0.65)  # match clock at edge of board
    intensity: 80 lumens
    flicker_pattern: ticks with clock
time_of_day_variation:
  acts_2_to_7: stable lighting; in HB12-active state, central pendant flickers; cards glow more strongly; theatrical spotlights pulse with match rhythm
dynamic_response:
  - on_match_start: theatrical_spots intensify; ambient dims 30%; tier-seating lights warm; pendant focuses tighter beam
  - on_match_end: theatrical_spots ease; ambient returns; victory-flash on relevant tier-strip
  - on_HB12_invoke: pendant flickers; cards' illustrations momentarily reveal player avatar (uncanny visual); transit begins
```

### A.51.7 Atmosphere

```
air_temperature:    21°C baseline (cool — performance-focused); rises slightly during sustained spectator presence
humidity:           42% RH; smells of polished-wood + bronze + faint cologne (Game Master's preference) + cards' resin (the cards are coated)
particulate:
  - type: dust
    density: low
    colour: warm-greyish
    drift_direction: random + slight downward in pendant light shaft
volumetric_fog:     absent in baseline; subtle "spotlight beam" volumetric on dome spots during matches (theatrical haze)
wind_drift:         minimal; 0.02 m/s; slight upward circulation toward dome apex
smell_canon:        polished-wood + bronze + cards' resin + faint cologne; voice-line: "smells like the night before a tournament"
```

### A.51.8 Sound

```
ambient_bed:           file: game_hall_ambient_bed_v1.ogg (loop); -34 dB; very faint orchestral-tuning hum (the room "warms up"), distant card-shuffle sounds, occasional tier-seating creak
point_sources:
  - id: ark.game_hall.sound.central_chandelier_subtle_creak
    position: (0.00, 7.00, 7.30)
    sound: occasional crystal-tinkle (random; -40 dB)
    occlusion_behaviour: omnidirectional
    trigger: random (period 30-90s)
  - id: ark.game_hall.sound.duel_board_cards_face
    position: (0.00, 7.00, 0.65)
    sound: faint card-resin hum (continuous, -42 dB)
    occlusion_behaviour: standard
    trigger: continuous (subtle)
  - id: ark.game_hall.sound.tier_seating_creak.east, .west
    position: distributed across tier seating
    sound: occasional bench-creak (random; -38 dB)
    occlusion_behaviour: standard
    trigger: random
  - id: ark.game_hall.sound.distant_phantom_applause
    position: (0.00, 7.00, 6.00)  # phantom audience above
    sound: faint applause echo (only during cs_amb_game_hall; very subtle in baseline; -40 dB)
    occlusion_behaviour: omnidirectional
    trigger: cyclic (rare; period 120s in baseline; common in cutscenes)
  - id: ark.game_hall.sound.game_master_chuckle
    position: (0.00, 13.95, 1.40)  # at Game Master alcove
    sound: faint chuckle (only when GM present; -36 dB)
    occlusion_behaviour: omnidirectional with bias toward alcove
    trigger: state-conditional
reverb_zone:           IR-impulse: game_hall_v1.wav; wet-mix 25% (theatrical reverb)
music_eligibility:     cutscene only (HB12 transit + Category B cs_amb_game_hall + Category C cs_disc_card_duel + cs_load_card_duel)
voice_line_eligibility:
  - speaker: the_game_master
    trigger: presence (Acts 2+)
    line_set: see §2.34.2 (Game Hall NPC presence-line set; if not specced, see GM canonical voice direction)
  - speaker: the_master_of_rlyeh
    trigger: HB12 transit only
    line_set: HB12-specific
  - speaker: phantom_audience
    trigger: cs_amb_game_hall + match-completion moments
    line_set: applause / collective gasp patterns
```

### A.51.9 Object inventory

Game Hall has 48 inventory objects.

#### A.51.9.1 The Central Dischordia Duel Board (HB12 anchor)

```
object_id:           ark.game_hall.duel_board.central
object_class:        interactive  (also fx_emitter for HB12 transit)
position:            (0.00, 7.00, 0.60)  # on dais top at room centre
dimensions:          1.20 × 1.20 × 0.10  (board) + cards above to z = 0.85
rotation:            0°
material_primary:    polished walnut with green-felt playing surface
material_secondary:  bronze edge-trim; gold-inlay rank/file markings; reinforced display-glass beneath felt for holographic card-state visualisation
colour_value:        --token-color-ark-game-hall-duel-board
interaction:         interactable
  - operate (player's turn): play card / pass turn / attack / use ability
  - examine: shows current match state
  - HB12_invoke: when conditions met (player has completed first card duel + interacts with central board), last-played card flickers + card's illustration looks at camera + transit begins (cf §3.12.14)
narrative_role:      THE central duel-board; primary card-game gameplay surface; cosmologically the HB12 gateway. The card's "looking back" moment IS the meta-narrative reveal.
lore_anchor:         loredex.system.dischordia_card_game + arc.act_2_HB12_first_invocation
art_status:          producer_handoff
gameplay_hook_id:    trpc.dischordia.duel_board.operate + trpc.hellbox.hb12.openGate (state-conditional)
wear_state:          slight wear at most-used card-zones; pristine elsewhere
physical_constraints: collides; player can lean
```

#### A.51.9.2-3 Player + Opponent Anchor Positions

```
object_id:           ark.game_hall.player_anchor
object_class:        npc_anchor  (player's seated position at south end of duel-board)
position:            (0.00, 5.20, 0.60)
dimensions:          0.80 × 0.80 × 1.40 (anchor only)
rotation:            0°
material_primary:    n/a (anchor; chair displays here in active matches)
material_secondary:  n/a
colour_value:        n/a
interaction:         n/a (anchor; chair appears when player approaches)
narrative_role:      where the player sits to play; faces north toward opponent
lore_anchor:         arc.act_2_first_card_duel
art_status:          producer_handoff
gameplay_hook_id:    n/a
wear_state:          n/a
physical_constraints: n/a

object_id:           ark.game_hall.opponent_anchor
object_class:        npc_anchor  (opponent's seated position at north end of duel-board)
position:            (0.00, 8.80, 0.60)
dimensions:          0.80 × 0.80 × 1.40 (anchor only)
rotation:            180°
material_primary:    n/a
material_secondary:  n/a
colour_value:        n/a
interaction:         n/a
narrative_role:      where opponent sits; faces south toward player
lore_anchor:         arc.opponent_relationships
art_status:          producer_handoff
gameplay_hook_id:    n/a
wear_state:          n/a
physical_constraints: n/a
```

#### A.51.9.4-5 Player + Opponent Chairs (deploys when match active)

```
object_id:           ark.game_hall.player_chair
object_class:        furniture
position:            (0.00, 5.20, 0.60)  # at player anchor
dimensions:          0.80 × 0.80 × 1.40
rotation:            0°
material_primary:    polished walnut frame with charcoal velvet seat
material_secondary:  bronze armrests with engraving
colour_value:        --token-color-ark-game-hall-player-chair
interaction:         interactable - sit
narrative_role:      where the player sits during a match; chair has a slight ergonomic tilt toward duel-board
lore_anchor:         arc.act_2_first_card_duel
art_status:          producer_handoff
gameplay_hook_id:    trpc.dischordia.player_chair.sit
wear_state:          slight wear at sit-zone
physical_constraints: collides; sittable

object_id:           ark.game_hall.opponent_chair
object_class:        furniture
position:            (0.00, 8.80, 0.60)
dimensions:          0.80 × 0.80 × 1.40
rotation:            180°
material_primary:    same as player_chair (mirrored)
material_secondary:  bronze armrests
colour_value:        --token-color-ark-game-hall-opponent-chair
interaction:         interactable - sit (rare; used when AI/NPC opponent is "physically present")
narrative_role:      opponent's seat
lore_anchor:         arc.opponent_relationships
art_status:          producer_handoff
gameplay_hook_id:    none (NPC-driven seating)
wear_state:          slight wear
physical_constraints: collides
```

#### A.51.9.6 Match Clock (on duel-board edge)

```
object_id:           ark.game_hall.duel_board.match_clock
object_class:        console
position:            (0.50, 7.00, 0.85)  # on side of duel-board
dimensions:          0.20 × 0.10 × 0.30
rotation:            0°
material_primary:    polished walnut case with porcelain dual face
material_secondary:  bronze knob and dial
colour_value:        --token-color-ark-game-hall-clock
interaction:         interactable
  - press_player_side: ends turn; transfers clock to opponent
  - inspect: lore-note about the match-clock (canonical pre-Ark artifact; mirrors the chess clock in §A.36)
narrative_role:      tracks turn-time; in HB12-active state, clock briefly runs backward (uncanny meta-effect)
lore_anchor:         loredex.system.dischordia_card_game
art_status:          producer_handoff
gameplay_hook_id:    trpc.dischordia.match_clock.press
wear_state:          worn at most-pressed buttons
physical_constraints: collides
```

#### A.51.9.7 The Game Master's Elevated Chair (HB12 NPC anchor)

```
object_id:           ark.game_hall.game_master_chair
object_class:        furniture  (also npc_anchor)
position:            (0.00, 13.50, 1.50)  # on raised alcove platform at north
dimensions:          1.00 × 1.00 × 1.80  (oversized — Game Master is theatrical)
rotation:            180°  (faces south, toward duel-board)
material_primary:    polished walnut frame with deep-crimson velvet upholstery; oversized armrests
material_secondary:  gold detail-work; bronze finials at top corners; decorative theatrical-mask carving on backrest
colour_value:        --token-color-ark-game-hall-game-master-chair
interaction:         interactable - sit (only when Game Master absent; rare; counts as lore-flag)
narrative_role:      THE Game Master's chair; he sits here to "judge" matches; permanent physical anchor; in Acts 2+, GM appears here
lore_anchor:         loredex.character.game_master
art_status:          producer_handoff
gameplay_hook_id:    trpc.game_hall.game_master_chair.sit
wear_state:          worn at right armrest (GM's preferred posture)
physical_constraints: collides; sittable
```

#### A.51.9.8-15 The Eight Tier-Seating Sections (4 east + 4 west)

```
object_id:           ark.game_hall.tier_seating.east.tier_<n>  (n = 1..3) and .west.tier_<n>  (n = 1..3)  + .east.tier_short and .west.tier_short
object_class:        furniture
positions:           tiered along east + west walls
dimensions (each tier): 14.00 × 0.50 × 0.40 (long bench); short tiers at corners are 4.00 × 0.50 × 0.40
rotation:            varies (faces inward toward duel-board)
material_primary:    polished walnut bench-tops with crimson-velvet padding
material_secondary:  brass armrest at aisle ends
colour_value:        --token-color-ark-game-hall-tier-seating
interaction:         interactable - sit (multi-seat; up to 8 spectators per tier section)
narrative_role:      spectator seating; in lore, players' supporters watch matches here; in late-act tournaments, full attendance
lore_anchor:         arc.community_spectatorship
art_status:          producer_handoff
gameplay_hook_id:    none (positional)
wear_state:          slight wear at most-used positions
physical_constraints: collides; sittable
```

#### A.51.9.16-19 Four Practice Tables (corner of room)

```
object_id:           ark.game_hall.practice_table.<corner>  (4 tables; one per corner)
object_class:        interactive
positions:           [
  (-7.00, 1.50, 0.00),  # SW corner
  (7.00, 1.50, 0.00),   # SE corner
  (-7.00, 12.50, 0.00), # NW corner
  (7.00, 12.50, 0.00),  # NE corner
]
dimensions (each):   1.20 × 1.20 × 0.85
rotation:            varies
material_primary:    polished walnut with green-felt top
material_secondary:  bronze corner caps
colour_value:        --token-color-ark-game-hall-practice-table
interaction:         interactable
  - play_practice: opens tutorial / practice card-duel UI
  - inspect: lore-note about practice opportunities
narrative_role:      practice tables for new players; player learns deck-building here in Act 2
lore_anchor:         loredex.system.dischordia_practice
art_status:          producer_handoff
gameplay_hook_id:    trpc.dischordia.practice_table.play
wear_state:          slight wear at felt centre
physical_constraints: collides
```

#### A.51.9.20-27 Eight Practice Chairs (2 per practice table)

```
object_id:           ark.game_hall.practice_chair.<corner>.<side>  (8 chairs)
object_class:        furniture
positions:           flanking each practice table
dimensions (each):   0.80 × 0.80 × 1.20
rotation:            faces practice table
material_primary:    walnut with charcoal-leather seat
material_secondary:  bronze tacks
colour_value:        --token-color-ark-game-hall-practice-chair
interaction:         interactable - sit
narrative_role:      practice seating
lore_anchor:         loredex.system.dischordia_practice
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          slight wear
physical_constraints: collides; sittable
```

#### A.51.9.28-31 Card-Holder Stands (4 stands; one per practice table; for keeping decks during matches)

```
object_id:           ark.game_hall.card_holder_stand.<corner>  (4 stands)
object_class:        decoration
positions:           on each practice table; at table-edge
dimensions (each):   0.30 × 0.10 × 0.20
rotation:            faces table centre
material_primary:    bronze with felt-lined slots
material_secondary:  gold engraving
colour_value:        --token-color-ark-game-hall-card-holder
interaction:         inspectable (each is a beautifully crafted decoration; the slots hold the player's deck during matches)
narrative_role:      tactile detail; supports practical gameplay
lore_anchor:         loredex.system.dischordia_card_game
art_status:          producer_handoff
gameplay_hook_id:    trpc.dischordia.card_holder.inspect
wear_state:          slight wear at most-used slot positions
physical_constraints: collides
```

#### A.51.9.32 Tournament Trophy Display (south-west corner)

```
object_id:           ark.game_hall.tournament_trophy_display
object_class:        container
position:            (-7.00, 0.50, 0.00)  # SW corner
dimensions:          1.40 × 0.40 × 2.40
rotation:            45°
material_primary:    cherrywood case with glass front
material_secondary:  gold-inlaid trim; brass nameplates
colour_value:        --token-color-ark-game-hall-trophy-display
interaction:         interactable
  - inspect: opens trophy display UI (player can browse all earned trophies)
  - inspect_individual_trophy: shows lore-note for each
narrative_role:      visual record of player tournament victories; gameplay-active record-keeping
lore_anchor:         loredex.system.tournament_records
art_status:          producer_handoff
gameplay_hook_id:    trpc.game_hall.trophy_display.inspect
wear_state:          slight wear at glass front (frequently inspected)
physical_constraints: collides
```

#### A.51.9.33-36 Wall Paintings + Apsidal Relief

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.game_hall.east.painting.first_match` | decoration | (7.95, 7.00, 6.00) | 1.20 × 0.80 × 0.04 | painting of "the first card duel" |
| `ark.game_hall.west.painting.last_match` | decoration | (0.05, 7.00, 6.00) | mirror | "the last card duel that hasn't happened yet" — uncanny |
| `ark.game_hall.north.relief.eternal_contest` (rolled into wall north) | decoration | (0.00, 13.85, 4.00) | 3.00 × 2.40 × 0.10 | apsidal relief |
| `ark.game_hall.south.theatrical_masks` (rolled into wall south) | decoration | (-2.00, 0.20, 4.50) and (2.00, 0.20, 4.50) | each 0.40 × 0.30 × 0.10 | comedy + tragedy masks |

#### A.51.9.37-44 Decorative Lighting Stands + Spotlights

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.game_hall.spotlight.dome.<n>` | fx_emitter (4 spots) | distributed at z = 7.50 above central dais | 0.30 × 0.30 × 0.30 each | theatrical spotlights |
| `ark.game_hall.dais_perimeter_uplight.<n>` | fx_emitter (continuous strip) | along central dais edge | 0.05 × 0.05 × 0.05 (per emitter; ~20 emitters total) | dais-perimeter uplighting |
| `ark.game_hall.tier_seating_strip.east, .west` | fx_emitter | along tier seating ceilings | linear | spectator-area strips |
| `ark.game_hall.game_master_alcove_glow_emitter` | fx_emitter | (0.00, 13.95, 4.00) | 0.40 × 0.40 × 0.10 | apsidal alcove glow |

#### A.51.9.45-48 Closing Decorative + Functional

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `ark.game_hall.south.intercom` | console | (-2.00, 0.20, 1.50) | 0.20 × 0.10 × 0.30 | comms relay |
| `ark.game_hall.fire_extinguisher.south` | interactive | (2.00, 0.20, 1.20) | 0.20 × 0.20 × 0.50 | safety |
| `ark.game_hall.first_aid.kit` | container | (-2.50, 0.20, 1.50) | 0.40 × 0.10 × 0.30 | medical |
| `ark.game_hall.dais_step_uplight.<n>` | fx_emitter (3 emitters, one per step) | south side of dais | 0.10 × 4.40 × 0.005 each | step uplighting |

Total: 48 inventory objects.

### A.51.10 Camera-spawn-points (FPV cutscenes)

```
cutscene_id:         cs_amb_game_hall  (Category B Myst-ambient; per §3.1.B.3)
camera_position:     (0.00, 0.50, eye_level)  # at threshold
camera_facing:       (0°, 5°, 0°)  # looking forward and slightly up at duel-board
avatar_height_anchor: eye_level
head_motion:         slow approach to dais; head turns slightly to absorb tier-seating; pause; camera locks on duel-board as cards animate; lasts 22s

cutscene_id:         cs_disc_card_duel  (Category C discovery; per §3.1.C)
camera_position:     (0.00, 5.20, eye_level)  # at player anchor seated
camera_facing:       (0°, -10°, 0°)  # facing duel-board
avatar_height_anchor: eye_level
head_motion:         seated; hand-rig enters frame setting up starting deck; GM appears across board; camera pulls back briefly to reveal scope; lasts 22s

cutscene_id:         cs_load_card_duel  (Category C loading)
camera_position:     (0.00, 5.20, eye_level)
camera_facing:       (0°, -25°, 0°)
avatar_height_anchor: eye_level
head_motion:         hands shuffle player's deck (close-up); cut to top-card reveal; lasts 7s

cutscene_id:         cs_hellbox_12_open  (HB12 Dischordian Arena gateway)
camera_position:     (0.00, 5.20, eye_level)
camera_facing:       (0°, -10°, 0°)
avatar_height_anchor: eye_level
head_motion:         locked on duel-board; last-played card flickers; for one frame, card's illustration looks DIRECTLY at the camera

cutscene_id:         cs_hellbox_12_transit  (HB12 transit)
camera_position:     (0.00, 5.20, eye_level)
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         POV travels through corridor of cards (each previously-played card hangs as banner)

cutscene_id:         cs_hellbox_12_self_duel  (rare, in destination — first time facing previous-self)
camera_position:     (varies; at destination)
camera_facing:       (0°, -10°, 0°)
avatar_height_anchor: eye_level
head_motion:         shadow-opponent's hand draws first card; close-up reveals SHADOW figure mirroring player's exact pose

cutscene_id:         cs_hellbox_12_close  (HB12 return)
camera_position:     (0.00, 5.20, eye_level)
camera_facing:       (0°, -10°, 0°)
avatar_height_anchor: eye_level
head_motion:         cards fade from banner-corridor; arena collapses; Game Hall re-materialises
```

### A.51.11 Doorways

```
door_id:            ark.game_hall.south.door.main
connecting_space_id: ark.corridor.game_hall_approach
door_position:      (0.00, 0.00, 0.00)
door_dimensions:    1.40 × 2.40 × 0.10
door_class:         arch  (gold-inlaid bronze; theatrical)
unlock_condition:   Act 2+ (after first Dischordia card tutorial)
transit_animation:  ceremonial slow-open (3s) on first entry; instant on subsequent
audio_signature:    bronze handle + soft gold-rim resonance
```

### A.51.12 Adjacency map

```
direct_adjacencies:
  - ark.corridor.game_hall_approach (south door)
  - hellbox.dischordian_arena (HB12 portal via central duel-board, conditional on first card duel)
one_hop_adjacencies:
  - ark.social_hub (via approach corridor; thematic kinship — community gaming)
  - ark.casino_gaming_floor (via long-route; chess-in-July event)
  - destination.dischordian_arena (via HB12)
```

### A.51.13 Gameplay hooks

```
hooks:
  - hook_id:         game_hall.startCardDuel
    trigger:         player.operate on duel_board.central
    procedure:       trpc.dischordia.duel.start
    success_state:   duel_started = true
  - hook_id:         game_hall.playCard
    trigger:         (state-conditional) player.operate during their turn
    procedure:       trpc.dischordia.card.play
    success_state:   card_played = true (per-card)
  - hook_id:         game_hall.invokeHB12
    trigger:         (state-conditional) player has completed first card duel + interacts with central board
    procedure:       trpc.hellbox.hb12.openGate
    success_state:   hellbox_12_transit_started = true
  - hook_id:         game_hall.playPracticeMatch
    trigger:         player.interact on practice_table.<corner>
    procedure:       trpc.dischordia.practice_table.play
    success_state:   practice_match_started = true
  - hook_id:         game_hall.sitGameMasterChair
    trigger:         player.sit on game_master_chair (when GM absent)
    procedure:       trpc.game_hall.game_master_chair.sit
    success_state:   sat_in_gm_chair = true (rare lore-flag)
  - hook_id:         game_hall.inspectTrophyDisplay
    trigger:         player.inspect on tournament_trophy_display
    procedure:       trpc.game_hall.trophy_display.inspect
    success_state:   trophy_display_examined = true
  - hook_id:         game_hall.takeSpectatorSeat
    trigger:         player.sit on tier_seating.<id>
    procedure:       trpc.game_hall.spectator.sit
    success_state:   spectator_seat_active = true
```

### A.51.14 Story-tie

```
primary_arcs:
  - arc.act_2_first_card_duel
  - arc.act_2_HB12_first_invocation
  - arc.player_card_progression
  - arc.community_spectatorship (continuous)
  - §3.12.14 (HB12 destination canonical)
per_act_evolution:
  acts_0_1: room locked; player can see door but cannot enter
  act_2: player gains access after first Dischordia card tutorial. First duel here; HB12 unlocks after first duel completed
  act_3: tournament ladder visible; practice tables fully active; trophies begin accumulating
  act_4: more spectators in tier-seating; Game Master more frequently present
  act_5: GM's chair displays slight wear (he's been here often); apsidal painting "the last match that hasn't happened yet" begins to subtly shift (uncanny)
  act_6: in HB12-active state, cards' illustrations occasionally look DIRECTLY at player as they pass duel-board (uncanny — meta-narrative escalation)
  act_7: state-branched: tournament-champion ending (player has won most tournaments; trophy display full) vs. underdog ending (player has lost most; opposite display); in either case, HB12 destination's "shadow opponents" reflect player's actual played decks
npc_roster:
  - the_game_master: primary NPC; presence Acts 2+; sits at Game Master alcove
  - the_player: visitor / duelist
  - opponent_NPCs: varied (assigned by tournament system)
  - phantom_audience: presence during ambient cutscenes
  - the_master_of_rlyeh: HB12 transit voice only
  - shadow_opponents: presence in HB12 destination only (player's previous decks)
readables:
  - principle plaque (south)
  - "first match" painting (east)
  - "last match that hasn't happened yet" painting (west; uncanny — content shifts)
  - apsidal relief (north): "the eternal contest"
  - GM's match-judge log (gameplay-readable)
  - trophy display individual trophies (varied)
  - ladder display historical entries
master_of_rlyeh_question: "Does the game play you, or do you play the game?"
```

### A.51.15 Special-FX

```
particle_systems:
  - dust_motes (low; visible in pendant light shaft)
  - card_resin_glints (subtle sparkles on duel-board cards; cosmetic)
  - HB12_card_illustration_eye_glint (one-shot during HB12 invocation; cards' eyes flicker)
  - phantom_audience_silhouettes (very subtle; semi-transparent figures in tier-seating during ambient cutscenes; never present in baseline)
volumetric_effects:
  - pendant_light_shaft (visible in lower-light states)
  - dome_spot_volumetric_beams (4 spots create theatrical haze beams during matches)
  - dais_uplight_glow_envelope (defines central area)
  - HB12_card_corridor_extension (one-shot; corridor of cards extends north during transit)
procedural_animations:
  - chandelier_subtle_sway (very slow; period 60s+)
  - cards_subtle_face_glow (subtle; cards "breathe" during long pauses)
  - tier_seating_phantom_settle (cosmetic; tier benches settle as if recently vacated; rare random)
  - apsidal_painting_uncanny_shift (Acts 5+; "last match" painting subtly shifts between visits — Editor's hand again)
  - GM_chair_warmth (the chair's velvet ripples slightly when GM is "about to appear")
reactive_systems:
  - dais_uplight_intensify_on_proximity (player approaches dais)
  - theatrical_spots_intensify_on_match_start
  - GM_chuckle_on_player_proximity (within 3.0 m of GM alcove, faint chuckle SFX even when GM not visible)
  - HB12_card_eye_glint_one_shot (during HB12 invocation)
  - shadow_opponent_in_baseline (Acts 6+; very rare cameo — a shadow figure stands at opponent_anchor for 2 seconds before fading; Easter egg)
```

### A.51.16 Avatar-parametricity

```
camera_height_variation:
  small_xenomorph (0.85m eye): camera height 0.85m; duel-board feels enormous; pendant chandelier spans most of vision
  short_humanoid (1.40m eye): standard
  average_humanoid (1.70m eye): standard
  tall_humanoid (2.05m eye): pendant feels closer; tier-seating slightly cramped
  tall_xenomorph (2.70m eye): chandelier collides at head; alternate "kneel-at-board" animation for play
reachability:
  small_xenomorph: cannot reach top-tier seating without ladder; alternate ladder provided
  small_xenomorph: cannot reach apsidal relief inspect-zone; relay-inspect from below
  others: all-reachable
audio_occlusion_variation:
  xenomorph_sensitive_hearing: GM's chuckle audible from threshold; cards' resin hum more pronounced
  synthetic_voice_avatar: phantom audience applause has different "feel" (synthetic-resonance bias)
```

### A.51.17 Performance

```
polygon_budget:      330,000 polygons (theatrical density; many decorative elements)
texture_budget:      190 MB total (cards have unique textures; tier seating + curtains add complexity)
light_count_limit:   24 simultaneous dynamic lights
lod_plan:
  - hero_distance: 0-10m, full detail
  - mid_distance: 10-22m, mid detail (tier seating spectators simplified; small decorations billboarded)
  - low_distance: 22m+, low detail
streaming_behaviour:
  - preload: ark.corridor.game_hall_approach (south)
  - on_player_at_duel_board + HB12_unlocked: preload destination.dischordian_arena
```

---

## Document status (Phase B-2 — through Wave 3 commit)

**FULL spec authored** (all 17 layers):
- A.1 Cryo Bay
- A.2 Med Bay
- A.3 Bridge (cross-ref §4.18 in main doc)
- A.4 Archives
- A.5 Comms Array
- A.6 Observation Deck
- A.7 Engineering Bay (HB4 host)
- A.8 Forge Workshop
- A.9 Armory
- A.10 Cargo Hold
- A.11 Captain's Quarters (HB7 host)
- A.12 Trophy Room
- A.13 Antiquarian's Library
- A.15 Social Hub / Mess Hall
- A.21 Cipher Den (HB8 host)
- A.22 Hierarchy Throne (HB2 host)
- A.27 Memorial Corridor (HB6 host)
- A.28 Pet Garden
- A.29 Pet Arena + Spectator Gallery
- A.30 Pet Medical Annex
- A.31 Trade Hub
- A.32 Trade Command Center / Broker's Office
- A.33 Defense Command Center (HB11 host)
- A.36 Chess Hall (HB9 host)
- A.47 CADES Console / Mission Briefing Pod
- A.48 Eidolon Sanctum / Bond Chamber
- A.50 Collectors Arena (HB10 host; NEW v5)
- A.51 Game Hall (HB12 host; NEW v5)

**Total FULL: 28 rooms** — covers every Hellbox-host room, every
narrative-load-bearing room, all major gameplay-launchers, the
complete pet system trio (Garden + Arena + Annex), the complete
trade chain (Hub + Command Center + Cargo Hold), the complete
CADES chain (Pod + Armory + Med Bay), Eidolon Sanctum, and
Trophy Room.

**SCAFFOLDED**: all remaining (A.14, A.16-A.20, A.23-A.26,
A.34, A.35, A.37-A.46, A.49 — 21 rooms)

Phase B-3 future (Wave 7+): convert remaining SCAFFOLDED rooms
(faction sanctums, late-act ceremonial rooms, prelude rooms,
chess sub-rooms, TD companions) to FULL. Estimated 20,000-30,000
additional lines.

---
