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

## A.7 Engineering Bay — CORE

```
space_id:        ark.engineering_bay
space_name:      Engineering Bay
space_type:      ark_room  (also Hellbox-4 host)
act_introduced:  Act 3
lore_anchor:     loredex.system.ark_reactor + loredex.faction.mechronis + arc.act_3_engineering_revelations
aesthetic_tier:  solar_punk_cathedral  (with industrial-grit accents)
master_of_rlyeh_question: "Is the worker the work, or the work's prisoner?" (per HB4)
```

The reactor is the centerpiece; vast vertical-shaft chamber visible
through a reinforced viewport at the rear of the room. Workbench
in the foreground (HB4 gateway: hands enter workbench → reveals
Mechronis classroom).

```
dimensions:           14.00 m × 16.00 m × 12.00 m  (tall — reactor shaft)
floor_plan_geometry:  rectangular  (with vertical shaft visible through rear)
```

Key objects:
- `ark.engineering_bay.workbench.primary` — HB4 gateway workbench
- `ark.engineering_bay.reactor.viewport` — viewport into reactor shaft
- `ark.engineering_bay.tool_rack.east.1-3` — tool racks
- `ark.engineering_bay.crafting_station` — crafting interface
- `ark.engineering_bay.engineer_chair` — Cogsworth/engineer's seat (NPC anchor)
- `ark.engineering_bay.maintenance_panels.<n>` — multiple maintenance access panels

(Full spec deferred.)

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

## A.11 Captain's Quarters (Degen's Corner) — CORE

```
space_id:        ark.captain_quarters
space_name:      Captain's Quarters (with Degen's Corner)
space_type:      ark_room  (also Hellbox-7 host)
act_introduced:  Act 0  (visible from start; Degen's Corner unlocks Act 4)
lore_anchor:     loredex.character.kael_voss + loredex.character.degen + arc.act_5_degen_appears
aesthetic_tier:  solar_punk_cathedral  (with film-noir accents in Degen's Corner)
master_of_rlyeh_question: "What is owed to a debt that was never agreed to?" (per HB7)
```

Two-zone room: the formal Captain's Quarters (where Kael lived
before he died) and Degen's Corner (a smaller alcove that becomes
HB7's gateway in Act 5).

```
dimensions:           12.00 m × 14.00 m × 4.50 m
floor_plan_geometry:  l_shape  (main quarters + Degen's Corner alcove)
```

Key objects:
- `ark.captain_quarters.bed` — Kael's bed (preserved)
- `ark.captain_quarters.desk` — Kael's writing desk (gameplay-key items)
- `ark.captain_quarters.bookshelf` — Kael's personal library
- `ark.captain_quarters.degen_corner.chair` — the empty chair (HB7 anchor)
- `ark.captain_quarters.degen_corner.brass_coin` — the coin on the seat (HB7 trigger)
- `ark.captain_quarters.kael_portrait` — portrait above the desk (lore-discoverable)

(Full spec deferred.)

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

## A.21 Cipher Den (D8 — Hellbox 8 host) — CORE

```
space_id:        ark.cipher_den
space_name:      Cipher Den (with Uncorruption Bench)
space_type:      ark_room  (also Hellbox-8 host)
act_introduced:  Act 5
lore_anchor:     loredex.system.uncorruption_bench + loredex.character.editor + arc.act_5_meta_narrative
aesthetic_tier:  solar_punk_cathedral  (scholarly-editorial accents)
master_of_rlyeh_question: "Is what was written, or what was edited, the truth?" (per HB8)
```

Houses the Shadow Tongue Uncorruption Bench (where forbidden
texts are cleaned). The Bench is the HB8 gateway. Player can edit
their own lore-narrative here (cross-ref Editor's Workshop
destination spec, deferred to Phase E).

```
dimensions:           10.00 m × 10.00 m × 4.50 m
floor_plan_geometry:  rectangular
```

Key objects:
- `ark.cipher_den.uncorruption_bench` — HB8 gateway
- `ark.cipher_den.forbidden_text_archive` — sealed archive (player must unlock to access)
- `ark.cipher_den.editor_anchor` — designated NPC anchor (Editor presence)

(Full spec deferred.)

---

## A.22 Hierarchy Throne Sanctum (D9 — Hellbox 2 host) — CORE

```
space_id:        ark.hierarchy_throne
space_name:      Hierarchy Throne Sanctum
space_type:      ark_room  (also Hellbox-2 host; faction-locked)
act_introduced:  faction-locked (Hierarchy alignment required; typically Act 5+)
lore_anchor:     loredex.faction.hierarchy + arc.hierarchy_devotion
aesthetic_tier:  hierarchy_ritual  (Wagnerian baroque)
master_of_rlyeh_question: "Is mercy a debt, or a gift?" (per HB2)
```

The Hierarchy throne is the gateway to the Castle of Death (HB2).
A vast Wagnerian-baroque chamber: tall vaulted ceiling, deep red
banners, brass-and-bronze fixtures, central throne raised on three
steps, censers burning incense.

```
dimensions:           12.00 m × 16.00 m × 9.00 m
floor_plan_geometry:  rectangular  (with apsidal throne-rear)
```

Key objects:
- `ark.hierarchy_throne.throne` — central throne (HB2 gateway via offering)
- `ark.hierarchy_throne.altar.offering` — offering altar
- `ark.hierarchy_throne.censer.east.1-3, .west.1-3` — six burning censers
- `ark.hierarchy_throne.banner.east, .west` — faction banners

(Full spec deferred to Phase B-2.)

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

## A.27 Memorial Corridor / Plaza (Hellbox-6 host) — CORE

```
space_id:        ark.memorial_corridor
space_name:      Memorial Corridor / Plaza
space_type:      ark_room  (also Hellbox-6 host)
act_introduced:  Act 4
lore_anchor:     loredex.system.memorial + arc.fallen_crew + arc.act_4_dead_mans_circuit
aesthetic_tier:  solar_punk_cathedral  (with mausoleum-grave accents)
master_of_rlyeh_question: "If you knew the race was already lost, would you still run?" (per HB6)
```

Long corridor lined with procession-stones (one per fallen crew
member). Brass bowl with eternal flame at the rear. The corridor
is a Hellbox-6 gateway: touching a procession-stone initiates the
Dead Man's Circuit transit.

```
dimensions:           24.00 m × 6.00 m × 4.00 m  (long corridor; tall but narrow)
floor_plan_geometry:  rectangular
```

Key objects:
- `ark.memorial_corridor.procession_stone.<n>` — 8-12 procession stones along walls
- `ark.memorial_corridor.brass_bowl_flame` — at corridor's rear (HB6 anchor)
- `ark.memorial_corridor.offering_basket` — offerings (coins, mementos) accumulate here
- `ark.memorial_corridor.bench.east.1-3, .west.1-3` — meditation benches

(Full spec deferred.)

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

## A.33 Defense Command Center (TD — Hellbox 11 host) — CORE

```
space_id:        ark.defense_command_center
space_name:      Defense Command Center
space_type:      ark_room  (also Hellbox-11 host)
act_introduced:  Act 4
lore_anchor:     loredex.system.tower_defense + loredex.character.terminus_swarm + arc.act_4_terminus_swarm_first_contact
aesthetic_tier:  solar_punk_cathedral  (military-tactical)
master_of_rlyeh_question: "Is one mind worth more than many?" (per HB11)
```

The Defense Command Center is the gameplay-launcher for Tower
Defense. The threat-display dominates the rear wall. HB11 gateway
is invoked when a swarm-cluster icon escapes the display.

```
dimensions:           14.00 m × 14.00 m × 5.50 m
floor_plan_geometry:  rectangular
```

Key objects:
- `ark.defense_command_center.threat_display` — primary threat display (HB11 gateway)
- `ark.defense_command_center.tactical_holo_table` — tactical holo-overlay
- `ark.defense_command_center.station_consoles.<n>` — 4-6 operator stations
- `ark.defense_command_center.alarm_panel` — alarm-trigger station

(Full spec deferred.)

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

## A.36 Chess Hall (Hellbox-9 host) — CORE

```
space_id:        ark.chess_hall
space_name:      Chess Hall
space_type:      ark_room  (also Hellbox-9 host)
act_introduced:  Act 4
lore_anchor:     loredex.system.chess + loredex.character.the_antiquarian + loredex.character.the_programmer + arc.act_4_eternal_match
aesthetic_tier:  solar_punk_cathedral  (cerebral-academic)
master_of_rlyeh_question: "Whose move is the final one?" (per HB9)
```

The Chess Hall hosts chess multiplayer + tournaments. Its central
chess-board is the HB9 gateway: after the player's first match,
the king-piece flickers and moves on its own — opening transit.
Cross-ref §11.3.1 (the centuries-long Antiquarian-vs-Programmer
chess game).

```
dimensions:           14.00 m × 14.00 m × 5.50 m
floor_plan_geometry:  rectangular
```

Key objects:
- `ark.chess_hall.chess_board.central` — HB9 gateway board
- `ark.chess_hall.chess_board.tournament.<n>` — tournament boards (4-8)
- `ark.chess_hall.antiquarian_chair` — Antiquarian's NPC anchor
- `ark.chess_hall.programmer_chair` — Programmer's NPC anchor
- `ark.chess_hall.observation_seating` — for spectators

(Full spec deferred.)

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
