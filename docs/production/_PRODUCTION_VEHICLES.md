# Inception Ark — Production: Vehicle Interiors Architect-Layer Spec

> **Phase D of the Dreamer-Architect production roadmap.** This
> document holds the full §4 architect-layer spec for the 7 canonical
> vehicle interiors players inhabit, dock, or pilot from the Ark.
>
> The §4 universal spec format is defined in
> `INCEPTION_ARK_FINAL_PRODUCTION.md` §4. The Bridge exemplar
> (`INCEPTION_ARK_FINAL_PRODUCTION.md` §4.18) is the worked-spec
> pattern. Vehicle interiors are typically smaller than Ark rooms,
> mobile, and constrained by their structural shells — but each
> still gets all 17 architect layers.
>
> **Authoring discipline**: every vehicle interior conforms to the
> §4 format EXACTLY. Coordinates precise to 0.01 m. Rotations
> precise to 0.1°. Materials bound to design tokens. Every object
> justified by the story.

## V.0 How this document works

### V.0.1 Cross-doc relationship

| spec layer | document | purpose |
|---|---|---|
| Architect-layer spec (Ark rooms) | `_PRODUCTION_ARK_ROOMS.md` §A | the Ark rooms |
| Architect-layer spec (Hellbox interiors) | `_PRODUCTION_HELLBOXES.md` §H | the destination interiors |
| Architect-layer spec (vehicles) | this document (§V) | mobile vehicle interiors |
| Cinematic direction | `INCEPTION_ARK_FINAL_PRODUCTION.md` §3 | cutscene direction (FPV, Categories A/B/C) |

### V.0.2 Coordinate convention

All positions are (x, y, z) in metres from each vehicle's origin
point. Vehicle origin is typically the centre of the cockpit floor
or the centre of the primary occupant zone. +x = right when
seated; +y = forward (along vehicle's primary motion axis);
+z = up.

### V.0.3 Vehicle list

| § | Vehicle | Class | Primary use |
|---|---|---|---|
| V.1 | CADES APC | armoured personnel carrier | CADES mission deployment + transport |
| V.2 | Captain's Personal Shuttle | small craft | Captain's private transport + Personal Quarters extension |
| V.3 | Trade Hub Cargo Vessel | bulk hauler | Trade Empire long-range cargo transport |
| V.4 | Combat Dropship | strike craft | PvP/Tier-5 + Tower Defense raid insertion |
| V.5 | Pet Transport Vessel | mobile arena | Pet competition transport + traveling arena |
| V.6 | Eidolon Vessel | cosmic craft | Observation Deck Eidolon-bond extended journeys |
| V.7 | Memorial Hearse | ceremonial transport | Memorial Corridor processions + final-rites |

---

## V.1 CADES APC

**Status: FULL spec.** Cross-ref `_PRODUCTION_ARK_ROOMS.md` §A.9
Armory + §A.47 CADES Console / Mission Briefing Pod.

### V.1.1 Header

```
space_id:        vehicle.cades_apc
space_name:      CADES APC (Coordinated Atmospheric Defense & Engagement Squad — Armoured Personnel Carrier)
space_type:      vehicle  (mobile interior; deployable)
act_introduced:  Act 2  (paired with first CADES mission)
lore_anchor:     loredex.system.cades + arc.cades_missions + arc.act_2_first_cades_deployment + loredex.character.captain
aesthetic_tier:  solar_punk_cathedral  (military-tactical hybrid; reinforced + functional + warm-hostile)
```

### V.1.2 Geometry

```
dimensions:           7.20 m × 3.00 m × 2.40 m  (interior; external footprint slightly larger)
origin_point:         centre of squad bay floor at the rear access ramp threshold
coordinate_axes:      +x = right (when facing forward toward cockpit), +y = forward (toward cockpit), +z = up
floor_plan_geometry:  rectangular  (long-rectangular; rear access ramp + squad bay + central control + cockpit at front)
volumetric_anomalies: none
```

The CADES APC is a 7.2 m long armoured carrier. Layout from rear
to front: rear access ramp + ramp control panel; central squad
bay with 6 squad seats (3 east + 3 west, facing inward); central
operations console between squad seats; cockpit at front with
2 pilot stations (driver + commander). Compact + reinforced +
intentionally claustrophobic — the design is "a tank with squad
seats."

Floor area: 21.6 m².

### V.1.3 Floor

```
material_primary:     industrial steel deck plate with anti-skid mil-spec coating; 0.60 m × 0.60 m panels with cross-bracing every 0.30 m
material_secondary:   bronze inlay outlining the central operations console zone (1.80 × 1.20 m); brass perimeter trim along squad-bay walls
pattern:              tactical-grid + central console-zone marker + ramp-threshold pattern at rear
wear_state:           well-used; combat-scuff at squad-seat approach paths; ramp-threshold worn from boots
embedded_features:
  - id: vehicle.cades_apc.floor.charge_point.central_console
    position: (0.00, 0.00, 0.00)
    dimensions: 0.40 × 0.40 × 0.05
    function: central console electronics
  - id: vehicle.cades_apc.floor.charge_point.cockpit
    position: (0.00, 2.40, 0.00)
    dimensions: 0.40 × 0.40 × 0.05
    function: cockpit electronics
  - id: vehicle.cades_apc.floor.ramp_threshold
    position: (0.00, -3.20, 0.00)
    dimensions: 1.80 × 0.20 × 0.10
    function: rear ramp deploy/retract threshold
  - id: vehicle.cades_apc.floor.squad_seat_anchor.<n>  (6 anchors; 3 east + 3 west)
    position: per seat base
    dimensions: 0.30 × 0.30 × 0.05 each
    function: seat electronics + harness power
  - id: vehicle.cades_apc.floor.drain.central
    position: (0.00, 0.00, 0.00)  # under console
    dimensions: 0.20 × 0.20 × 0.10
    function: combat-fluid drain
acoustic_property:    hard_reflective (steel) with tactical baffling; RT60 = 0.25s (intentionally clean for comm clarity)
```

### V.1.4 Walls

#### Wall: South (rear; access ramp)

```
wall_id:              south_rear
material_primary:     reinforced ceramic-composite plate (mil-spec armour); 0.80 × 1.60 m panels with rivet-detail
material_secondary:   bronze dado at z = 1.00 m (lower than typical Ark rooms — height-constrained interior); brass ramp-frame trim
panelisation:         standard with central ramp recess
colour_value:         --token-color-vehicle-cades-apc-wall-rear  (gunmetal-grey + tactical-amber stripe + reinforcement-black at ramp edge)
embedded_displays:
  - id: vehicle.cades_apc.south.display.ramp_status
    position: (-1.00, -1.49, 1.50)  # left of ramp
    dimensions: 0.40 × 0.30 × 0.05
    content: ramp deploy/retract status; lock indicator
  - id: vehicle.cades_apc.south.display.deployment_log
    position: (1.00, -1.49, 1.50)  # right of ramp
    dimensions: 0.40 × 0.30 × 0.05
    content: deployment timer + crew manifest
embedded_doors:
  - door_id: vehicle.cades_apc.south.access_ramp
    position: (0.00, -1.50, 0.00)
    dimensions: 1.80 × 2.20 × 0.20  (deploys outward + downward; 30° angle when fully deployed)
    door_class: pressure_seal  (hydraulic-deploy; reinforced; combat-grade)
    connecting_space_id: external (ground / hangar / drop-zone — depends on deployment context)
    unlock_condition: deployment-mode active OR cockpit override
decorative_features:
  - id: vehicle.cades_apc.south.plaque.creed
    position: (0.00, -1.49, 1.95)  # high on rear wall
    dimensions: 0.60 × 0.20 × 0.02
    material: cast bronze with deep-etched text + battle-scarred patina
    narrative_role: reads "RIDE OUT / RETURN HOME" — the CADES squad creed
  - id: vehicle.cades_apc.south.warning_sign.deployment_zone
    position: (0.00, -1.49, 0.40)
    dimensions: 0.40 × 0.30 × 0.01
    material: yellow-and-black painted steel
    narrative_role: deployment-zone warning at ramp threshold
```

#### Wall: East (3 squad seats inboard)

```
wall_id:              east
material_primary:     reinforced ceramic-composite plate; matte gunmetal
material_secondary:   bronze dado at z = 1.00 m; reinforced steel seat-mounting brackets
panelisation:         standard; 3 seat-recesses at y = -2.00, 0.00, 2.00
colour_value:         --token-color-vehicle-cades-apc-wall-east  (gunmetal-grey + crimson-faction-stripe at z = 1.50 m)
embedded_displays:
  - id: vehicle.cades_apc.east.display.tactical_seat.<n>  (3 displays; one per east squad seat)
    position: per seat back at z = 1.40
    dimensions: 0.30 × 0.20 × 0.05 each
    content: per-squadmate tactical view (helmet-cam + map + threat assessment)
embedded_doors:        none
decorative_features:
  - id: vehicle.cades_apc.east.warning_sign.high_voltage
    position: (1.49, 0.00, 1.80)
    dimensions: 0.20 × 0.20 × 0.01
    material: yellow-and-black painted steel
    narrative_role: electronics warning
  - id: vehicle.cades_apc.east.weapon_rack
    position: (1.49, 0.00, 0.50)  # mounted at low-mid height
    dimensions: 0.10 × 4.00 × 0.40
    material: reinforced steel rack with mag-locks; 6 weapon slots
    narrative_role: tactical weapons accessible from squad seats
```

#### Wall: North (cockpit forward bulkhead + cockpit consoles)

```
wall_id:              north_cockpit
material_primary:     reinforced ceramic-composite plate; matte gunmetal with tactical-display recesses
material_secondary:   bronze dado; brass cockpit-console frames
panelisation:         standard with central pilot-console recesses
colour_value:         --token-color-vehicle-cades-apc-wall-cockpit
embedded_displays:
  - id: vehicle.cades_apc.cockpit.display.driver_main
    position: (-0.60, 2.99, 1.20)  # in front of driver (left seat)
    dimensions: 0.80 × 0.60 × 0.05
    content: driver's main HUD — speed + heading + terrain
  - id: vehicle.cades_apc.cockpit.display.commander_main
    position: (0.60, 2.99, 1.20)  # in front of commander (right seat)
    dimensions: 0.80 × 0.60 × 0.05
    content: commander's main HUD — tactical overview + threat radar + mission objectives
  - id: vehicle.cades_apc.cockpit.display.shared_overhead
    position: (0.00, 2.99, 1.90)
    dimensions: 1.20 × 0.40 × 0.05
    content: shared status display visible to both pilots
embedded_doors:        none (cockpit accessed from squad bay; no separate door)
decorative_features:
  - id: vehicle.cades_apc.cockpit.viewport
    position: (0.00, 2.99, 1.50)  # central cockpit viewport
    dimensions: 1.40 × 0.60 × 0.20
    material: reinforced transparent armour with HUD overlay capability
    narrative_role: cockpit forward-view; primary visibility
  - id: vehicle.cades_apc.cockpit.relief.cades_emblem
    position: (0.00, 2.99, 2.10)
    dimensions: 0.30 × 0.20 × 0.04
    material: cast bronze relief
    narrative_role: CADES sigil; visible to both pilots
```

#### Wall: West (3 squad seats inboard; mirror of east)

```
wall_id:              west
material_primary:     same as east
material_secondary:   bronze dado; reinforced seat brackets
panelisation:         standard; 3 seat-recesses (mirror of east)
colour_value:         --token-color-vehicle-cades-apc-wall-west
embedded_displays:
  - id: vehicle.cades_apc.west.display.tactical_seat.<n>  (3 displays; mirror of east)
embedded_doors:        none
decorative_features:
  - id: vehicle.cades_apc.west.medkit_rack
    position: (-1.49, 0.00, 0.50)
    dimensions: 0.10 × 4.00 × 0.40
    material: reinforced steel rack with red-cross emblems; 4 medkit slots
    narrative_role: medical kits accessible from squad seats
  - id: vehicle.cades_apc.west.warning_sign.coolant
    position: (-1.49, 1.00, 1.80)
    dimensions: 0.20 × 0.20 × 0.01
    material: yellow-and-black painted steel
    narrative_role: coolant-line warning
```

### V.1.5 Ceiling

```
height_above_floor:     2.40 m baseline (low; vehicle-constrained); slight drop at central operations console to 2.20 m
material:               reinforced ceramic-composite ceiling panel with conduit access strips
lighting_integrated:    recessed cool-white tactical strips on 1.20 m grid; central operations-console pendant; cockpit dual-task lights
atmospheric_features:   minimal — combat-functional
acoustic_treatment:     baffled (mil-spec voice clarity)
```

### V.1.6 Lighting

```
ambient_baseline:     5500 K (cool tactical); 320 lux at floor (precision required); CRI 88
direct_fixtures:
  - id: vehicle.cades_apc.light.recessed_strip
    position: distributed across ceiling
    beam_angle: 60° each
    colour: --token-color-vehicle-cades-apc-recessed  (cool tactical white)
    intensity: 1500 lumens each
    function: ambient task lighting
  - id: vehicle.cades_apc.light.central_console_pendant
    position: (0.00, 0.00, 2.00)
    beam_angle: 60° downward
    colour: cool tactical
    intensity: 3000 lumens
    function: central console task light
  - id: vehicle.cades_apc.light.cockpit_dual_task
    position: (-0.60, 2.40, 2.20) and (0.60, 2.40, 2.20)
    beam_angle: 30° each
    colour: 5000 K
    intensity: 2000 lumens each
    function: pilot task lights
  - id: vehicle.cades_apc.light.ramp_floods
    position: (-0.80, -1.40, 1.80) and (0.80, -1.40, 1.80)
    beam_angle: 60° outward
    colour: warm 3500 K (deployment-friendly)
    intensity: 4000 lumens each (when deployed)
    function: ramp floodlights for deployment visibility
practical_sources:
  - id: vehicle.cades_apc.alert_strobe.<corner>  (4 corner strobes; off baseline)
    position: corners at z = 2.30
    intensity: 0 lumens (off); 5000 lumens at strobe-flash
    flicker_pattern: cyclic during alert
  - id: vehicle.cades_apc.viewport_hud_overlay
    position: at viewport
    intensity: variable
    flicker_pattern: stable
  - id: vehicle.cades_apc.weapon_rack_indicator_lights
    position: per weapon-slot
    intensity: 30 lumens each (green = present; red = empty)
    flicker_pattern: stable
time_of_day_variation:
  acts_2_to_7: stable cool baseline; in alert states (combat), red strobes activate
dynamic_response:
  - on_deployment_mode: ramp floods activate; ambient warms slightly
  - on_combat_alert: red strobe + ambient drops 30%
  - on_critical_damage: emergency red ambient + warning klaxon
```

### V.1.7 Atmosphere

```
air_temperature:    20°C (cool-comfortable; combat-controlled); rises to 28°C during sustained combat
humidity:           34% RH (dry; weapon-friendly); smells of steel + gun oil + ozone (electronics) + leather (seat upholstery) + faint diesel (engine bleed-through)
particulate:
  - dust: very low (sealed environment); rises during engine-startup
  - cordite_residue: low (cosmetic; hint at recent combat)
  - coolant_mist: zero in baseline; rises in damage states
volumetric_fog:     absent in baseline; subtle haze during sustained combat
wind_drift:         minimal; 0.05 m/s; HVAC pattern
smell_canon:        steel + gun oil + ozone + leather + diesel; voice-line: "smells like duty"
```

### V.1.8 Sound

```
ambient_bed:           file: cades_apc_ambient_bed_v1.ogg (loop); -28 dB; engine-rumble (continuous; varies with throttle), HVAC drone, faint comm-static, occasional metal-creak
point_sources:
  - id: vehicle.cades_apc.sound.engine_rumble
    position: forward of cockpit (engine bay)
    sound: deep low rumble (varies with throttle; -22 to -16 dB)
    occlusion_behaviour: omnidirectional with forward bias
    trigger: continuous (when active)
  - id: vehicle.cades_apc.sound.console_buzz
    position: at central console
    sound: low electronic buzz (-38 dB; continuous)
    occlusion_behaviour: standard
    trigger: continuous
  - id: vehicle.cades_apc.sound.hvac_drone
    position: distributed
    sound: HVAC fan drone (-34 dB; continuous)
    occlusion_behaviour: omnidirectional
    trigger: continuous
  - id: vehicle.cades_apc.sound.comm_static
    position: at cockpit
    sound: faint comm-channel static (-40 dB)
    occlusion_behaviour: standard
    trigger: continuous
  - id: vehicle.cades_apc.sound.alarm_klaxon
    position: distributed
    sound: low-rumble warning tone (-22 dB during alert; off baseline)
    occlusion_behaviour: omnidirectional
    trigger: state-conditional
  - id: vehicle.cades_apc.sound.ramp_hydraulics
    position: at rear ramp
    sound: hydraulic deploy/retract whirr + clack (-18 dB)
    occlusion_behaviour: standard
    trigger: state-conditional
reverb_zone:           IR-impulse: cades_apc_v1.wav; wet-mix 12% (intentionally clean for voice clarity)
music_eligibility:     cutscene only (deployment cinematics + alarm sequences)
voice_line_eligibility:
  - speaker: the_captain (cockpit; comms during deployment)
  - speaker: cades_squadmates (rotating per mission; per-mission voice lines)
  - speaker: vehicle_ai (institutional; status announcements)
```

### V.1.9 Object inventory

CADES APC has 38 inventory objects.

#### V.1.9.1-2 Two Pilot Stations (driver + commander)

```
object_id:           vehicle.cades_apc.cockpit.station.driver
object_class:        console
position:            (-0.60, 2.40, 0.00)
dimensions:          0.80 × 0.60 × 0.85
rotation:            0°  (faces forward)
material_primary:    brushed steel + matte-black control surface
material_secondary:  brass control bezels + amber LED accents
colour_value:        --token-color-vehicle-cades-apc-driver-station
interaction:         interactable
  - operate: opens driver UI (steering, throttle, terrain navigation)
  - inspect: lore-note about APC-driver lineage
narrative_role:      driver's primary station; gameplay-active during deployment
lore_anchor:         loredex.system.cades_pilots
art_status:          producer_handoff
gameplay_hook_id:    trpc.vehicle.cades_apc.driver.operate
wear_state:          worn at most-touched controls
physical_constraints: collides

object_id:           vehicle.cades_apc.cockpit.station.commander
object_class:        console
position:            (0.60, 2.40, 0.00)
dimensions:          0.80 × 0.60 × 0.85
rotation:            0°
material_primary:    same as driver
material_secondary:  same
colour_value:        --token-color-vehicle-cades-apc-commander-station
interaction:         interactable
  - operate: opens commander UI (tactical overview, mission objectives, comms, weapons control)
  - inspect: lore-note
narrative_role:      commander's primary station; tactical decisions made here
lore_anchor:         loredex.character.captain (when captain is present) + loredex.system.cades_command
art_status:          producer_handoff
gameplay_hook_id:    trpc.vehicle.cades_apc.commander.operate
wear_state:          worn at tactical-controls
physical_constraints: collides
```

#### V.1.9.3-4 Two Pilot Chairs

```
object_id:           vehicle.cades_apc.cockpit.chair.driver, .commander
object_class:        furniture  (also npc_anchor)
positions:           (-0.60, 2.00, 0.00), (0.60, 2.00, 0.00)
dimensions (each):   0.60 × 0.60 × 1.30
rotation:            0°
material_primary:    matte-black leather; titanium frame; 5-point harness
material_secondary:  brass armrest caps; harness-buckles
colour_value:        --token-color-vehicle-cades-apc-pilot-chair
interaction:         interactable - sit
narrative_role:      pilot chairs; reinforced for combat
lore_anchor:         loredex.system.cades_pilots
art_status:          producer_handoff
gameplay_hook_id:    trpc.vehicle.cades_apc.pilot_chair.sit
wear_state:          worn at harness contact points
physical_constraints: collides; sittable
```

#### V.1.9.5 The Central Operations Console

```
object_id:           vehicle.cades_apc.central_operations_console
object_class:        interactive
position:            (0.00, 0.00, 0.00)
dimensions:          1.80 × 1.20 × 0.95
rotation:            0°
material_primary:    brushed steel + matte-black with holographic overlay
material_secondary:  brass edge-trim with bronze status LEDs
colour_value:        --token-color-vehicle-cades-apc-central-console
interaction:         interactable
  - operate: spawns 3D mission overlay; commander can issue squad orders here while in motion
  - inspect: lore-note
narrative_role:      central tactical hub; commander coordinates squad from here when not in cockpit
lore_anchor:         loredex.system.cades_tactical_overview
art_status:          producer_handoff
gameplay_hook_id:    trpc.vehicle.cades_apc.central_console.operate
wear_state:          slight wear at touch-zones
physical_constraints: collides; player can lean
```

#### V.1.9.6-11 Six Squad Seats (3 east + 3 west)

```
object_id:           vehicle.cades_apc.squad_seat.<wall>.<n>  (6 seats total)
object_class:        furniture  (also npc_anchor)
positions:           [
  (1.30, -2.00, 0.00), (1.30, 0.00, 0.00), (1.30, 2.00, 0.00),    # east 1-3
  (-1.30, -2.00, 0.00), (-1.30, 0.00, 0.00), (-1.30, 2.00, 0.00), # west 1-3
]
dimensions (each):   0.50 × 0.60 × 1.20
rotation (each):     varies (faces inward toward central console)
material_primary:    matte-black leather; titanium frame; 5-point harness
material_secondary:  bronze nameplate per seat (squadmate names)
colour_value:        --token-color-vehicle-cades-apc-squad-seat
interaction:         interactable - sit
narrative_role:      squad seating; player can sit in any when seat is unassigned; otherwise NPC-occupied
lore_anchor:         loredex.system.cades_squad
art_status:          producer_handoff
gameplay_hook_id:    trpc.vehicle.cades_apc.squad_seat.sit
wear_state:          worn at harness contact points; varies per most-occupied seat
physical_constraints: collides; sittable
```

#### V.1.9.12-17 Six Squad Tactical Displays (one per seat back)

```
object_id:           vehicle.cades_apc.tactical_seat_display.<wall>.<n>  (6 displays)
object_class:        display
positions:           per seat back at z = 1.40
dimensions (each):   0.30 × 0.20 × 0.05
rotation:            varies
material_primary:    OLED display + brass bezel
material_secondary:  none
colour_value:        --token-color-vehicle-cades-apc-tactical-display
interaction:         inspectable
  - inspect: shows that squadmate's helmet-cam + tactical map + threat assessment
narrative_role:      per-squadmate situational awareness
lore_anchor:         loredex.system.cades_tactical_systems
art_status:          producer_handoff
gameplay_hook_id:    trpc.vehicle.cades_apc.tactical_seat_display.inspect
wear_state:          pristine (recessed)
physical_constraints: non-collide
```

#### V.1.9.18 The Rear Access Ramp

```
object_id:           vehicle.cades_apc.south.access_ramp
object_class:        door  (interactive — hydraulic deploy)
position:            (0.00, -1.50, 0.00)
dimensions:          1.80 × 2.20 × 0.20
rotation:            180°
material_primary:    reinforced ceramic-composite plate
material_secondary:  brass hydraulic-rams; safety-yellow stripe; reinforcement-black edge
colour_value:        --token-color-vehicle-cades-apc-ramp
interaction:         interactable
  - deploy: hydraulic deploy outward + downward (30° angle when fully deployed)
  - retract: retract + seal
narrative_role:      rear access ramp; deployment + extraction
lore_anchor:         loredex.system.cades_deployment
art_status:          producer_handoff
gameplay_hook_id:    trpc.vehicle.cades_apc.ramp.deploy + .retract
wear_state:          worn at hinge + seal
physical_constraints: collides; deploy-animation
```

#### V.1.9.19 The Weapon Rack (east wall)

```
object_id:           vehicle.cades_apc.east.weapon_rack
object_class:        container
position:            (1.49, 0.00, 0.50)
dimensions:          0.10 × 4.00 × 0.40
rotation:            270°
material_primary:    reinforced steel rack with mag-locks
material_secondary:  bronze nameplates per slot (6 weapon slots)
colour_value:        --token-color-vehicle-cades-apc-weapon-rack
interaction:         interactable
  - take_weapon: equip from 6 slots (rifle, sidearm, knife, grenades, breaching-charge, sniper)
  - inspect: lore-note per weapon
narrative_role:      tactical weapons accessible from squad seats
lore_anchor:         loredex.system.cades_weapons
art_status:          producer_handoff
gameplay_hook_id:    trpc.vehicle.cades_apc.weapon_rack.take
wear_state:          mag-locks slightly worn at most-used slots
physical_constraints: collides
```

#### V.1.9.20 The Medkit Rack (west wall)

```
object_id:           vehicle.cades_apc.west.medkit_rack
object_class:        container
position:            (-1.49, 0.00, 0.50)
dimensions:          0.10 × 4.00 × 0.40
rotation:            90°
material_primary:    reinforced steel rack with red-cross emblems
material_secondary:  bronze nameplates per slot (4 medkit slots)
colour_value:        --token-color-vehicle-cades-apc-medkit-rack
interaction:         interactable
  - take_medkit: equip a medkit
  - inspect: lore-note about CADES medical procedures
narrative_role:      medical kits accessible during combat
lore_anchor:         loredex.system.cades_medical
art_status:          producer_handoff
gameplay_hook_id:    trpc.vehicle.cades_apc.medkit_rack.take
wear_state:          slight wear
physical_constraints: collides
```

#### V.1.9.21 The Cockpit Viewport

Specced in walls. Inventoried for completeness.

#### V.1.9.22 The Captain's Comm Anchor (cockpit)

```
object_id:           vehicle.cades_apc.cockpit.captain_anchor
object_class:        npc_anchor
position:            (0.00, 2.40, 1.40)  # between pilots; mid-height
dimensions:          0.40 × 0.40 × 0.20 (anchor only — Captain is comm-only typically)
rotation:            varies
material_primary:    n/a
material_secondary:  n/a
colour_value:        n/a
interaction:         n/a (Captain is comm-only most of time; rare physical visit)
narrative_role:      Captain's comm-channel anchor; primary mission narrator
lore_anchor:         loredex.character.captain
art_status:          producer_handoff
gameplay_hook_id:    none (presence-driven)
wear_state:          n/a
physical_constraints: n/a
```

#### V.1.9.23 The Cockpit Emblem Relief

Specced in walls. Inventoried for completeness.

#### V.1.9.24-29 Six Equipment Lockers (under squad seats; one per seat)

```
object_id:           vehicle.cades_apc.equipment_locker.<seat>  (6 lockers)
object_class:        container
positions:           under each squad seat (z = 0.00 to 0.50)
dimensions (each):   0.40 × 0.50 × 0.50
rotation:            varies
material_primary:    reinforced steel with bronze handle
material_secondary:  bronze nameplate
colour_value:        --token-color-vehicle-cades-apc-equipment-locker
interaction:         interactable
  - open: per-squadmate personal effects + spare ammo
narrative_role:      per-squadmate equipment storage
lore_anchor:         per-squadmate
art_status:          producer_handoff
gameplay_hook_id:    trpc.vehicle.cades_apc.equipment_locker.open
wear_state:          slight wear at handles
physical_constraints: collides
```

#### V.1.9.30-33 Four Corner Alert Strobes

```
object_id:           vehicle.cades_apc.alert_strobe.<corner>  (4 strobes; off baseline)
object_class:        fx_emitter
positions:           corners at z = 2.30
dimensions (each):   0.20 × 0.20 × 0.20
rotation:            varies
material_primary:    red-orange housing with warning lens
material_secondary:  none
colour_value:        --token-color-vehicle-cades-apc-alert-strobe
interaction:         inert
narrative_role:      combat-alert strobes (off baseline; flash during alert)
lore_anchor:         loredex.system.cades_alerts
art_status:          producer_handoff
gameplay_hook_id:    none (state-driven)
wear_state:          slight wear at housing
physical_constraints: non-collide (overhead)
```

#### V.1.9.34-38 Five Closing Items

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `vehicle.cades_apc.south.intercom` | console | (-0.50, -1.49, 1.50) | 0.20 × 0.10 × 0.30 | comms relay (rear-side) |
| `vehicle.cades_apc.fire_extinguisher.east` | interactive | (1.49, -1.50, 0.50) | 0.20 × 0.20 × 0.50 | safety |
| `vehicle.cades_apc.fire_extinguisher.west` | interactive | (-1.49, -1.50, 0.50) | mirror | safety |
| `vehicle.cades_apc.first_aid.kit.south` | container | (0.50, -1.49, 1.50) | 0.40 × 0.10 × 0.30 | medical (rear-side; supplements west medkit rack) |
| `vehicle.cades_apc.cades_emblem_floor_inlay` | decoration | (0.00, 0.00, 0.005) | 0.80 × 0.80 × 0.005 | floor-inlay sigil under central console |

Total: 38 inventory objects.

### V.1.10 Camera-spawn-points (FPV cutscenes)

```
cutscene_id:         cs_amb_cades_apc  (Category B; deferred catalogue)
camera_position:     (0.00, -1.00, eye_level)  # at threshold inside ramp
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         slow walk forward through squad bay; head turns to scan east + west weapons + squad seats; pauses at central console; lasts 16s

cutscene_id:         cs_first_cades_deployment  (Act 2 first-time)
camera_position:     (0.00, -1.00, eye_level)
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         seated at squad-seat (player anchor varies); ramp closes; engine roars; first deployment begins

cutscene_id:         cs_cades_alert  (state-conditional; alert mode)
camera_position:     varies (player position)
camera_facing:       (varies)
avatar_height_anchor: eye_level
head_motion:         red-strobe activates; klaxon; ambient shifts to alert-tone

cutscene_id:         cs_cades_extraction  (per mission completion)
camera_position:     varies
camera_facing:       (varies)
avatar_height_anchor: eye_level
head_motion:         ramp deploys; squadmates board; engine throttles up; departure
```

### V.1.11 Doorways

```
door_id:            vehicle.cades_apc.south.access_ramp
connecting_space_id: external (varies by deployment context)
door_position:      (0.00, -1.50, 0.00)
door_dimensions:    1.80 × 2.20 × 0.20
door_class:         pressure_seal  (hydraulic-deploy)
unlock_condition:   deployment-mode active OR cockpit override
transit_animation:  hydraulic deploy/retract (3s)
audio_signature:    hydraulic whirr + servo-clack + magnetic seal
```

### V.1.12 Adjacency map

```
direct_adjacencies:
  - external (deployment context): destination.cades_mission_maps (varies); ark.armory (when stowed in Ark hangar — deferred sub-space); ark.cades_console_pod (when stowed)
one_hop_adjacencies:
  - ark.armory (via Ark hangar; weapon resupply)
  - ark.cades_console_pod (via mission briefing chain)
  - ark.med_bay (via Ark medical chain)
state_shared_with:
  - ark.armory (weapon-rack inventory cross-references)
  - ark.cades_console_pod (mission state + squad roster)
  - ark.med_bay (medkit inventory; medical relay)
```

### V.1.13 Gameplay hooks

```
hooks:
  - hook_id:         cades_apc.driver_operate
    trigger:         player.operate on cockpit.station.driver
    procedure:       trpc.vehicle.cades_apc.driver.operate
    success_state:   driver_active = true
  - hook_id:         cades_apc.commander_operate
    trigger:         player.operate on cockpit.station.commander
    procedure:       trpc.vehicle.cades_apc.commander.operate
    success_state:   commander_active = true
  - hook_id:         cades_apc.deploy_ramp
    trigger:         player.deploy on south.access_ramp
    procedure:       trpc.vehicle.cades_apc.ramp.deploy
    success_state:   ramp_deployed = true
  - hook_id:         cades_apc.retract_ramp
    trigger:         player.retract on south.access_ramp
    procedure:       trpc.vehicle.cades_apc.ramp.retract
    success_state:   ramp_retracted = true
  - hook_id:         cades_apc.take_weapon
    trigger:         player.take on east.weapon_rack
    procedure:       trpc.vehicle.cades_apc.weapon_rack.take
    success_state:   weapon_equipped = true
  - hook_id:         cades_apc.take_medkit
    trigger:         player.take on west.medkit_rack
    procedure:       trpc.vehicle.cades_apc.medkit_rack.take
    success_state:   medkit_equipped = true
  - hook_id:         cades_apc.sit_squad_seat
    trigger:         player.sit on squad_seat.<n>
    procedure:       trpc.vehicle.cades_apc.squad_seat.sit
    success_state:   squad_seat_active = true
  - hook_id:         cades_apc.operate_central_console
    trigger:         player.operate on central_operations_console
    procedure:       trpc.vehicle.cades_apc.central_console.operate
    success_state:   tactical_overview_active = true
  - hook_id:         cades_apc.inspect_squadmate_display
    trigger:         player.inspect on tactical_seat_display.<n>
    procedure:       trpc.vehicle.cades_apc.tactical_seat_display.inspect
    success_state:   squadmate_status_inspected = true (per-squadmate)
  - hook_id:         cades_apc.open_equipment_locker
    trigger:         player.open on equipment_locker.<seat>
    procedure:       trpc.vehicle.cades_apc.equipment_locker.open
    success_state:   equipment_locker_open = true
```

### V.1.14 Story-tie

```
primary_arcs:
  - arc.act_2_first_cades_deployment
  - arc.cades_missions (continuous Acts 2-7)
  - arc.cades_squadmate_relationships (cross-ref §A.47 memorial wall)
  - arc.act_5_squadmate_loss (state-conditional; emotional)
per_act_evolution:
  acts_0_1: vehicle locked + invisible (CADES program not yet active)
  act_2: first deployment; first squadmates assigned; basic missions
  acts_3_4: more missions; squadmate roster grows + occasionally rotates
  act_5: first squadmate loss possible; equipment locker becomes memorial
  act_6: deeper missions; legendary CADES deployments
  act_7: state-branched: well-led-and-loyal ending vs. catastrophic-leadership ending (matches §A.17 Soldier Sanctum + §A.47 memorial wall state-branch)
npc_roster:
  - the_captain (cockpit comm-only typically; rare physical visit)
  - cades_squadmates (6 named NPCs; rotating per mission)
  - vehicle_ai (institutional voice for status announcements)
readables:
  - creed plaque (rear)
  - 6 squadmate nameplates (per-seat lore)
  - cockpit relief (CADES emblem)
  - tactical-seat displays (per-squadmate live data)
  - equipment-locker contents (per-squadmate personal effects)
master_of_rlyeh_question: n/a (vehicle; not Hellbox)
```

### V.1.15 Special-FX

```
particle_systems:
  - dust (low; vehicle interior)
  - cordite_residue (very low)
  - coolant_mist (state-conditional; damage states)
  - viewport_motion_blur (during high-speed)
  - alert_strobe_pulses (state-conditional)
volumetric_effects:
  - cockpit_hud_overlay (transparent overlay on viewport)
  - central_console_holo_overlay (3D mission map above console)
  - alert_strobe_envelope (state-conditional)
procedural_animations:
  - engine_subtle_vibration (continuous; subtle camera-shake)
  - squadmate_idle_animations (when seated)
  - hydraulic_ramp_deploy_animation
  - weapon_rack_indicator_pulse
reactive_systems:
  - red_strobe_on_alert (state-conditional)
  - cockpit_console_intensify_on_pilot_seated
  - central_console_holo_on_commander_action
  - hydraulic_ramp_animation_one_shot
```

### V.1.16 Avatar-parametricity

```
camera_height_variation:
  small_xenomorph (0.85m eye): camera height 0.85m; pilot-station controls at chest-level — alternate kid-seat boost
  short_humanoid (1.40m eye): standard short
  average_humanoid (1.70m eye): standard
  tall_humanoid (2.05m eye): ceiling at near-head; slight crouch in cockpit
  tall_xenomorph (2.70m eye): cannot fit cockpit comfortably — alternate "stand-in-squad-bay" configuration with comms relay
reachability:
  small_xenomorph: cannot reach top weapon rack; alternate booster step
  small_xenomorph: pilot harness adjusts; child-fitted version
  others: all-reachable
audio_occlusion_variation:
  xenomorph_sensitive_hearing: engine-rumble + comm-static more pronounced
  synthetic_voice_avatar: vehicle_ai institutional voice has affinity-resonance
```

### V.1.17 Performance

```
polygon_budget:      180,000 polygons (compact vehicle interior)
texture_budget:      120 MB total
light_count_limit:   12 simultaneous dynamic lights
lod_plan:
  - hero_distance: 0-5m, full detail
  - mid_distance: 5-10m, mid detail (squad seats simplified)
  - low_distance: external view (vehicle as silhouette only)
streaming_behaviour:
  - preload: ark.armory (when stowed)
  - on_deployment_active: preload current mission map
  - on_alert_state: preload alert assets
```

---

## V.2 Captain's Personal Shuttle

**Status: FULL spec.** Cross-ref `_PRODUCTION_ARK_ROOMS.md` §A.11
Captain's Quarters.

### V.2.1 Header

```
space_id:        vehicle.captain_personal_shuttle
space_name:      Captain's Personal Shuttle
space_type:      vehicle  (small craft; private)
act_introduced:  Act 1  (player gains access alongside Captain's Quarters)
lore_anchor:     loredex.system.captain_shuttle + loredex.character.kael_voss + arc.captain_personal_arc
aesthetic_tier:  solar_punk_cathedral  (warm-domestic + executive; the most personal vehicle)
```

### V.2.2 Geometry

```
dimensions:           5.40 m × 2.40 m × 2.20 m  (compact small craft)
origin_point:         centre of cockpit floor (single-pilot cockpit; rear is small storage)
coordinate_axes:      +x = right, +y = forward, +z = up
floor_plan_geometry:  rectangular  (small; cockpit + small rear cabin)
volumetric_anomalies: none
```

The Captain's Personal Shuttle is small, private, intentionally
warm-domestic. Single-pilot cockpit with a side passenger seat;
small rear cabin with built-in bench, storage, and a small
holographic-table for navigation. Kael Voss kept this shuttle
maintained but rarely used it (he preferred the Bridge); it has
become "abandoned-loved" since his death.

Floor area: ~13 m².

### V.2.3 Floor

```
material_primary:     polished walnut hardwood plank (rare in vehicles — signals "captain's personal taste"); 0.20 × 1.20 m planks at 30° from cockpit centre
material_secondary:   small wool rug (charcoal-grey with brass border) at rear cabin; brass walkway-strip from rear entry to cockpit
pattern:              walnut planking + rug accent
wear_state:           pristine but well-maintained; no recent wear (Kael's last flight was years ago)
embedded_features:
  - id: vehicle.captain_personal_shuttle.floor.charge_point.cockpit
    position: (0.00, 0.50, 0.00)
    dimensions: 0.30 × 0.30 × 0.05
    function: cockpit electronics
  - id: vehicle.captain_personal_shuttle.floor.charge_point.rear_holo_table
    position: (0.00, -1.50, 0.00)
    dimensions: 0.30 × 0.30 × 0.05
    function: rear holographic-table
  - id: vehicle.captain_personal_shuttle.floor.access_threshold
    position: (0.00, -2.40, 0.00)
    dimensions: 0.80 × 0.20 × 0.05
    function: rear-access door threshold
acoustic_property:    soft_absorbent (rug + walnut + leather); RT60 = 0.25s (intimate)
```

### V.2.4 Walls (compact)

```
wall_id:              south_rear  (access)
material_primary:     painted plaster with walnut wainscoting
material_secondary:   brass dado at z = 1.00
embedded_doors:
  - vehicle.captain_personal_shuttle.south.access_door at (0.00, -2.40, 0.00); 0.80 × 1.90 × 0.10; pressure_seal slide; connects to ark.captain_personal_quarters (when stowed); always-unlocked when in Ark
decorative_features:
  - vehicle.captain_personal_shuttle.south.plaque.commission at (0.00, -2.39, 1.70); 0.30 × 0.10 × 0.02; brass; reads "K. VOSS — Personal Shuttle"

wall_id:              east, west  (port/starboard sidewalls)
material_primary:     warm walnut paneling
material_secondary:   brass trim
decorative_features:
  - small framed photos (3 each side; family photos of Kael's late wife + crew memorabilia)
  - small bookshelf (east wall; rear cabin); ~12 books

wall_id:              north_cockpit  (forward bulkhead)
material_primary:     reinforced transparent armour viewport at z = 1.00 to 1.80
material_secondary:   brass cockpit-frame trim
embedded_displays:
  - cockpit main HUD overlay
  - secondary tactical display (smaller; commander/passenger info)
decorative_features:
  - cockpit relief (small bronze "ARK-7" emblem)
```

### V.2.5-8 Compact (full FULL fidelity)

```
ceiling: 2.20 m baseline; small dome above pilot seat; recessed warm-amber strip-lights
lighting:
  ambient_baseline: 2700 K warm; 200 lux; CRI 95
  cockpit_pendant: warm 2400 K; 1500 lumens
  rear_cabin_pendant: warm 2700 K; 1200 lumens
  reading_lamp_pilot: warm 2400 K; 600 lumens (above pilot chair)
  reading_lamp_passenger: warm 2400 K; 400 lumens
  practical_sources: bookshelf_subtle_glow; framed_photo_subtle_uplights
atmosphere: 21°C / 45% RH / smells of walnut + leather + faint cologne (Kael's residual presence) + warm-electronics
sound:
  ambient_bed: -36 dB; faint engine-hum (when active), cockpit-clicks, distant cosmic-radiation hiss
  point_sources: cockpit_console_buzz; reading_lamp_subtle_buzz
  reverb_zone: captain_shuttle_v1.wav wet 14% (intimate)
  music_eligibility: ambient music ALLOWED — Kael's preferred playlist persists (slow piano + light orchestra) at -32 dB
  voice_line_eligibility: kael_voss_residual (recorded log only; never live); the_player; rare passenger NPC
```

### V.2.9 Object inventory (compact catalogue; 24 inventory objects)

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `vehicle.captain_personal_shuttle.cockpit.station.pilot` | console | (0.00, 0.40, 0.00) | 0.80 × 0.60 × 0.85 | pilot's station (steering, navigation, comms) |
| `vehicle.captain_personal_shuttle.cockpit.chair.pilot` | furniture+npc_anchor | (0.00, 0.00, 0.00) | 0.60 × 0.60 × 1.30 | pilot chair (Kael's original) |
| `vehicle.captain_personal_shuttle.cockpit.chair.passenger` | furniture | (0.80, 0.00, 0.00) | 0.60 × 0.60 × 1.30 | passenger chair |
| `vehicle.captain_personal_shuttle.cockpit.viewport` | decoration | forward bulkhead | 1.40 × 0.10 × 0.80 | viewport |
| `vehicle.captain_personal_shuttle.cockpit.hud_overlay` | display | overlays viewport | 1.40 × 0.80 | navigation HUD |
| `vehicle.captain_personal_shuttle.rear_cabin.bench` | furniture | (-0.80, -1.50, 0.00) | 1.40 × 0.40 × 0.45 | built-in bench |
| `vehicle.captain_personal_shuttle.rear_cabin.holo_table` | display | (0.00, -1.50, 0.00) | 0.80 × 0.60 × 0.95 | small holographic-navigation table |
| `vehicle.captain_personal_shuttle.east.bookshelf` | container | (1.19, -1.50, 0.00) | 0.20 × 1.20 × 1.40 | ~12 books |
| `vehicle.captain_personal_shuttle.east.framed_photos.<n>` (3) | decoration | (1.19, varied, varied) | 0.15 × 0.04 × 0.20 each | Kael's family + crew photos |
| `vehicle.captain_personal_shuttle.west.framed_photos.<n>` (3) | decoration | (-1.19, varied, varied) | mirror | family photos |
| `vehicle.captain_personal_shuttle.south.access_door` | door | (0.00, -2.40, 0.00) | 0.80 × 1.90 × 0.10 | rear access |
| `vehicle.captain_personal_shuttle.south.plaque.commission` | decoration | rear at z=1.70 | 0.30 × 0.10 × 0.02 | "K. VOSS — Personal Shuttle" |
| `vehicle.captain_personal_shuttle.cockpit.emblem` | decoration | forward at z=1.90 | 0.20 × 0.15 × 0.04 | "ARK-7" emblem |
| `vehicle.captain_personal_shuttle.captain_locker.kael` | container | (0.00, -1.20, 0.00) | 0.40 × 0.30 × 1.40 | Kael's small personal locker (parallel to Captain's Locker §A.11) |
| `vehicle.captain_personal_shuttle.coffee_cup_kael` | decoration | on cockpit console | 0.10 × 0.10 × 0.12 | Kael's coffee mug (still half-full; a residual artifact) |
| `vehicle.captain_personal_shuttle.intercom_silent` | console | south wall | 0.20 × 0.10 × 0.30 | comms |
| `vehicle.captain_personal_shuttle.fire_extinguisher` | interactive | south wall | 0.20 × 0.20 × 0.50 | safety |
| `vehicle.captain_personal_shuttle.first_aid` | container | south wall | 0.40 × 0.10 × 0.30 | medical |
| `vehicle.captain_personal_shuttle.compass_inlay` | decoration | (0.00, 0.00, 0.005) | 0.40 dia × 0.005 | small floor compass-rose |

Total: 24 inventory objects.

### V.2.10-17 Compact

```
camera_spawn_points:
  cs_amb_captain_shuttle (Cat B): POV at threshold; slow walk forward; head turns to bookshelf + photos; pause at cockpit; 16s
  cs_first_shuttle_use (when player first decides to take Kael's shuttle out — emotional moment)
  cs_kael_residual_log_playback (state-conditional): pre-recorded Kael messages auto-play during certain flights

doorways: south.access_door → ark.captain_quarters (when stowed in Ark)
adjacency: direct ark.captain_quarters; one_hop ark.bridge (via Ark hangar relay)
gameplay_hooks: pilot_operate; passenger_chair_sit; bookshelf_take_book; holo_table_operate; captain_locker_open; cockpit_emblem_inspect
story_tie:
  primary_arcs: act_1_kael_legacy; captain_shuttle_first_use; act_5_kael_journal_in_cockpit (gameplay-key); state-branched Act 7
  per_act:
    acts_0: locked
    act_1: opens (alongside Captain's Quarters); player can take shuttle out
    acts_2-7: more missions accessible; emotional resonance grows
    act_7: state-branched: shuttle-cherished vs. shuttle-abandoned
  npc_roster: kael_voss_residual (recorded only); the_player; rare passenger NPCs
  readables: commission plaque; ~12 books; framed photos; Kael's locker contents
  master_of_rlyeh_question: n/a

special_fx: dust low; warm-amber-cone-from-pendant; engine-vibration-subtle
procedural: cockpit_subtle_idle; coffee-cup-subtle-tilt-when-flying (the cup never spills — magical); reading-lamp-subtle-flicker
reactive: cockpit_intensify_on_pilot_seated; framed_photos_warmth_on_proximity

avatar_parametricity: small_xenomorph: cockpit comfortable; tall_xenomorph: must crouch; alternate stand-in-rear-cabin
audio_occlusion: xenomorph: engine-hum + cosmic-hiss more pronounced

performance: polygon_budget 80,000 / texture_budget 60 MB / light_count 6
streaming: preload ark.captain_quarters (when stowed); on_active_flight: preload destination context
```

---

## V.3 Trade Hub Cargo Vessel

**Status: FULL spec (compact at full FULL fidelity).** Cross-ref
`_PRODUCTION_ARK_ROOMS.md` §A.10 Cargo Hold + §A.31 Trade Hub.

### V.3.1 Header

```
space_id:        vehicle.trade_hub_cargo_vessel
space_name:      Trade Hub Cargo Vessel
space_type:      vehicle  (bulk hauler; deep-space cargo)
act_introduced:  Act 2  (alongside first Trade Empire mission)
lore_anchor:     loredex.system.trade_cargo_vessels + arc.trade_empire + arc.act_2_first_long_haul
aesthetic_tier:  solar_punk_cathedral  (mercantile-industrial; functional + warm-utilitarian)
```

### V.3.2 Geometry

```
dimensions:           18.00 m × 6.00 m × 4.00 m  (large cargo vessel interior; cargo bay dominates)
origin_point:         centre of central cargo bay
coordinate_axes:      +x = right, +y = forward (toward cockpit), +z = up
floor_plan_geometry:  rectangular  (cockpit at front + bridge area + central cargo bay + crew quarters at rear)
volumetric_anomalies: none
```

Compact bulk hauler. Cockpit at front (2-pilot); short bridge
zone; vast central cargo bay (~12m long; primary purpose);
rear small crew quarters (3-bunk + small mess + comms station).

Floor area: 108 m².

### V.3.3-9 Compact (full FULL fidelity; ~32 inventory objects)

```
floor: cast-iron grating (cargo-bay zone) + walnut hardwood (crew quarters + bridge) + brushed steel (cockpit); 1.20×1.20 m panels
walls:
  cockpit_north: reinforced transparent armour viewport + dual pilot stations + tactical-mission HUD overlay
  bridge_central: brass dado; tactical-display (1.40×0.80) + comms-station; small chart-table
  cargo_bay_walls: industrial steel panels with cargo gantry tracks at z=3.20; mag-lock anchor points
  rear_crew_quarters: warm walnut + cream plaster; 3 bunks + small mess + intercom
  south_rear_access: 1.60 × 2.40 cargo-grade ramp door; pressure_seal
ceiling: 4.00 m; cargo gantry rails; recessed cool-white grid; cockpit + crew-quarters dome lights
lighting:
  ambient_baseline: 4500 K cool-tactical at cargo bay; 3000 K warm at crew quarters; 240 lux
  high_bay_array: 4 fixtures distributed in cargo bay; 4500 lumens each
  cockpit_dual_pendants: 3000 lumens each
  crew_quarters_pendant: warm amber 2500 lumens
atmosphere: 19°C cool / 38% RH dry / smells of cardboard + grease + steel + faint coffee
sound:
  ambient_bed: -28 dB; engine-rumble + cargo-creak + comm-chatter
  point_sources: cargo_gantry_servo; cockpit_console_buzz; bunk_breath (when occupied); engine-rumble continuous
  reverb_zone: trade_cargo_vessel_v1.wav wet 26% (industrial)
  music_eligibility: cutscene only
  voice_line_eligibility: trade_clerk (cockpit operator); cargo_handlers (crew quarters); the_player

object inventory (~32):
  - 2 pilot stations + 2 pilot chairs (cockpit)
  - cockpit viewport + HUD overlay
  - tactical-mission display
  - chart-table (bridge)
  - tactical-display (1.40×0.80)
  - comms station
  - cargo gantry track + cargo crane control
  - cargo crates (varies; gameplay-driven)
  - 6 cargo anchor points along walls
  - 3 crew bunks + 3 footlockers
  - small mess table + 4 chairs
  - galley sink + small fridge
  - rear cargo ramp + ramp control
  - intercom + fire_extinguisher + first_aid
  - cargo manifest display + cargo log
  - emergency suit locker
  - tools cabinet
```

### V.3.10-17 Compact

```
camera_spawn_points: cs_amb_trade_cargo_vessel; cs_first_long_haul (Act 2 first-time); cs_cargo_loaded; cs_cargo_unloaded
doorways: south.access_ramp → external (varies); cockpit-front-shutter (rare; emergency-only)
adjacency: direct ark.cargo_hold + ark.trade_hub when stowed; one_hop destination.trade_routes
gameplay_hooks: pilot_operate; cargo_gantry_operate; cargo_crate_inspect; bunk_sleep; mess_meal; tactical_mission_brief
story_tie: act_2_first_long_haul; trade_empire (continuous); cargo_lineage; act_7_trade_master state-branched
npc_roster: trade_clerk (pilot); cargo_handlers (rotating); the_player; visiting_npcs (per-route)
readables: cargo manifest; trade-canon notes; bunk nameplates; emergency procedures
master_of_rlyeh_question: n/a

special_fx: cargo_dust low; engine-vibration; gantry-track-glint; viewport-motion-blur
procedural: gantry_idle_sway; bunk_breath (when occupied); engine-rumble continuous
reactive: cockpit_intensify_on_pilot_seated; cargo_anchor_lock_on_secure; ramp_open/close hydraulic

avatar_parametricity: small_xenomorph alternate cargo-bay perspective; bunk-fitting parametric
performance: polygon_budget 240,000 / texture_budget 160 MB / light_count 14
streaming: preload ark.cargo_hold + ark.trade_hub when stowed; on_long_haul: preload destination route assets
```

---

## V.4 Combat Dropship

**Status: FULL spec (compact at full FULL fidelity).** Cross-ref
`_PRODUCTION_ARK_ROOMS.md` §A.33 Defense Command Center.

### V.4.1 Header

```
space_id:        vehicle.combat_dropship
space_name:      Combat Dropship
space_type:      vehicle  (strike craft; raid insertion)
act_introduced:  Act 4  (alongside first Tower Defense raid)
lore_anchor:     loredex.system.combat_dropship + arc.tower_defense + arc.pvp_tier_5 + arc.act_4_first_drop
aesthetic_tier:  solar_punk_cathedral  (combat-tactical; reinforced + fast + brutal)
```

### V.4.2 Geometry

```
dimensions:           5.40 m × 3.00 m × 2.20 m  (compact strike craft)
origin_point:         centre of squad bay floor
coordinate_axes:      +x = right, +y = forward (toward cockpit), +z = up
floor_plan_geometry:  rectangular  (cockpit + squad bay + side-doors)
volumetric_anomalies: none
```

Combat Dropship — fast, brutal, designed for rapid raid insertion.
Compact cockpit at front; squad bay with 4 squad seats (2 east +
2 west, facing inward); side-doors on east + west for rapid
deployment (rope-drop or ramp-down).

Floor area: 16.2 m².

### V.4.3-9 Compact (full FULL fidelity; ~28 inventory objects)

```
floor: industrial steel deck plate (mil-spec); 1.00×1.00 m panels; tactical-grid; bronze inlay outlining squad-bay zone
walls:
  cockpit_north: reinforced transparent armour viewport + dual pilot stations + drop-zone overlay
  east_side_door: 1.40 × 2.20 × 0.10 pressure_seal slide; rapid-deploy
  west_side_door: mirror; rapid-deploy
  rear_south: reinforced wall + small ramp door (1.20 × 1.80) for stowed-stack deployment
ceiling: 2.20 m; reinforced ceramic-composite; recessed cool-white tactical strips; 4 corner alert strobes
lighting:
  ambient_baseline: 5500 K cool-tactical; 320 lux; CRI 88
  recessed_strip: distributed; 1500 lumens each
  cockpit_dual_pendants: 3000 lumens each
  side_door_floods: at each side door; warm 3500 K; 4000 lumens (when deployed)
  alert_strobes×4: red-orange; off baseline; flash during alert
atmosphere: 20°C cool / 34% RH dry / smells of steel + gun oil + ozone + leather (seats) + faint cordite
sound:
  ambient_bed: -22 dB (loud; combat environment); engine-roar + comm-chatter + occasional cordite-snap
  point_sources: engine_roar; alarm_klaxon (state-conditional); ramp_hydraulics (each side); comm_static
  reverb_zone: combat_dropship_v1.wav wet 14% (clean tactical)
  music_eligibility: cutscene only
  voice_line_eligibility: pilot (named NPC); 4 squadmates per mission; vehicle_ai institutional

object inventory (~28):
  - 2 pilot stations + 2 pilot chairs
  - cockpit viewport + HUD overlay
  - drop-zone tactical display
  - 4 squad seats (2 east + 2 west) + 4-point harnesses
  - 4 squadmate tactical displays (per seat back)
  - east side-door + east door floodlight
  - west side-door + west door floodlight
  - rear ramp + ramp control
  - east weapon-rack (4 slots)
  - west weapon-rack (4 slots)
  - emergency medkits (2)
  - comm-station (cockpit)
  - 4 corner alert strobes
  - intercom + fire_extinguisher + first_aid
  - drop-zone illuminator (rare; high-altitude drops)
  - 4 squadmate equipment lockers (under seats)
```

### V.4.10-17 Compact

```
camera_spawn_points: cs_amb_combat_dropship; cs_first_drop (Act 4 first raid); cs_drop_zone_arrival; cs_extraction
doorways: east + west side-doors → external drop zone (varies); rear ramp → external (rare)
adjacency: direct ark.defense_command_center + ark.tower_assembly_bay when stowed; one_hop destination.tower_defense_maps + destination.pvp_arenas
gameplay_hooks: pilot_operate; squad_seat_sit; deploy_via_side_door; deploy_via_rear_ramp; take_weapon; take_medkit; tactical_drop_zone_inspect
story_tie: act_4_first_drop; tower_defense_raids (Acts 4-7); pvp_tier_5 (Acts 5-7); act_7_combat_master state-branched
npc_roster: pilot (named NPC); 4 squadmates (rotating per raid); vehicle_ai
readables: drop-zone tactical display; squadmate nameplates; weapon descriptions; emergency procedures
master_of_rlyeh_question: n/a

special_fx: motion-blur; cordite_residue; engine-vibration; alert-strobe-pulses
procedural: engine_roar_continuous; squadmate_idle_animations; harness_rumble_during_flight
reactive: red_strobe_on_alert; side_door_floods_on_deploy; cockpit_intensify_on_pilot_seated

avatar_parametricity: small_xenomorph alternate kid-fit harness; tall_xenomorph cockpit-cramping; alternate stand-in-bay
performance: polygon_budget 160,000 / texture_budget 110 MB / light_count 12
streaming: preload defense_command_center when stowed; on_drop_active: preload destination raid map
```

---

## V.5 Pet Transport Vessel

**Status: FULL spec (compact at full FULL fidelity).** Cross-ref
`_PRODUCTION_ARK_ROOMS.md` §A.29 Pet Arena.

### V.5.1 Header

```
space_id:        vehicle.pet_transport_vessel
space_name:      Pet Transport Vessel
space_type:      vehicle  (mobile arena; pet competition transport)
act_introduced:  Act 3  (alongside first traveling pet competition)
lore_anchor:     loredex.system.pet_transport + loredex.character.mascoteer + arc.pet_competitions
aesthetic_tier:  solar_punk_cathedral  (colosseum-traveling-aesthetic; festive + colourful)
```

### V.5.2 Geometry

```
dimensions:           8.40 m × 4.00 m × 3.20 m  (medium vessel; mobile arena)
origin_point:         centre of central pet-care zone
coordinate_axes:      +x = right, +y = forward, +z = up
floor_plan_geometry:  rectangular  (cockpit at front + central pet-care + small mobile-arena floor at rear)
volumetric_anomalies: none
```

Festive mobile pet vessel. Cockpit + central pet-care + small
mobile-arena floor at rear (for pre-event pet warm-up). Mascoteer
travels with vessel.

Floor area: 33.6 m².

### V.5.3-9 Compact (~30 inventory objects)

```
floor: cushioned bio-friendly mat (pet-care zone) + standard hardwood (cockpit) + raked organic-sand (rear arena floor)
walls:
  cockpit_north: viewport + 2 pilot stations + festive bunting at z=2.50
  east + west: 4 pet incubation pods (2 each side); cushioned + temperature-controlled
  rear_south: small mobile-arena (3×3m); rear-access door + festive entrance gate
ceiling: 3.20 m; warm bio-luminescent emitters; festive lights for arena warm-up
lighting:
  ambient_baseline: 3500 K warm bio-luminescent; 200 lux; CRI 90
  pet_pod_warmth_emitters×4: per pod; 200 lumens each
  arena_warm_up_lights: festive amber + crimson; 800 lumens each
  cockpit_pendant: 2500 lumens
atmosphere: 23°C warm / 55% RH humid / smells of fresh-fur + fresh-grass + bio-luminescent-fungal + festive-popcorn
sound:
  ambient_bed: -28 dB; pet-vocalisations (varied); festive-crowd-residue (faint); engine-rumble
  point_sources: pet_breath×4; engine_subtle; mascoteer_voice; festive_music_subtle (Acts 4+)
  reverb_zone: pet_transport_v1.wav wet 22%
  music_eligibility: ambient music ALLOWED — festive carnival theme
  voice_line_eligibility: mascoteer (cockpit + arena); pets; visiting_audience_npcs

object inventory (~30):
  - 2 pilot stations + 2 chairs
  - cockpit viewport + HUD
  - 4 pet incubation pods (east + west; 2 each side)
  - 4 pet-care stations
  - mobile-arena floor (3×3m raked sand)
  - festive bunting (perimeter; 4 sides)
  - mascoteer's anchor (cockpit/pet-care)
  - small medical-pet-kit
  - 4 pet feeding stations
  - east + west walls have viewing windows for spectators
  - small commentator booth
  - rear-access door + festive entrance gate
  - festive lighting clusters
  - intercom + fire_extinguisher + first_aid
  - small kitchen (for handler/audience snacks)
  - 4 spectator seats (rear; near arena)
  - mascoteer's personal locker
```

### V.5.10-17 Compact

```
camera_spawn_points: cs_amb_pet_transport; cs_first_pet_competition; cs_pet_arena_warm_up
doorways: rear.access_door → external (festive arena destinations); cockpit (rare emergency)
adjacency: direct ark.pet_arena + ark.pet_garden when stowed; one_hop destination.pet_competition_circuits
gameplay_hooks: pilot_operate; pet_pod_operate; arena_warm_up; mascoteer_converse; festive_lights_toggle
story_tie: act_3_first_pet_competition; pet_competitions (Acts 3-7); act_7_pet_champion state-branched
npc_roster: mascoteer; pets (player's traveling roster); rare audience npcs
readables: festive bunting; mascoteer's championship records; pet care procedures
master_of_rlyeh_question: n/a

special_fx: bio_luminescent_motes; pet_pod_warmth_glow; festive_lighting_pulses; arena_warm_up_glow
procedural: pet_breath; pet_subtle_vocalisations; festive_music_visualisation; bunting_subtle_ripple
reactive: pet_pod_warmth_intensify_on_proximity; arena_warm_up_lights_on_event; mascoteer_acknowledgement_on_player_proximity

avatar_parametricity: pet pods accommodate diverse species; festive aesthetic warm to all
performance: polygon_budget 200,000 / texture_budget 130 MB / light_count 14
streaming: preload ark.pet_arena + ark.pet_garden when stowed; on_competition_event: preload destination circuit
```

---

## V.6 Eidolon Vessel

**Status: FULL spec (compact at full FULL fidelity).** Cross-ref
`_PRODUCTION_ARK_ROOMS.md` §A.6 Observation Deck + §A.48 Eidolon
Sanctum.

### V.6.1 Header

```
space_id:        vehicle.eidolon_vessel
space_name:      Eidolon Vessel
space_type:      vehicle  (cosmic craft; rare extended-Eidolon journey)
act_introduced:  Act 4  (alongside Eidolon-bond depth Acts 4+)
lore_anchor:     loredex.system.eidolon_vessel + loredex.character.eidolon + arc.cosmic_witness + arc.eidolon_arc
aesthetic_tier:  dreamers_oneiric  (cosmic-bound; the vessel itself is cosmologically alive)
```

### V.6.2 Geometry

```
dimensions:           6.00 m diameter × 4.00 m  (circular footprint; cosmic-anchor-like)
origin_point:         centre of floor (circular)
coordinate_axes:      +x = right, +y = forward, +z = up
floor_plan_geometry:  circular  (3.00 m radius)
volumetric_anomalies: subtle cosmic-resonance — vessel pulses with Eidolon-bond rhythm
```

Cosmic small vessel. Single-pilot configuration. Player + Eidolon
travel together; the vessel's interior is cosmologically connected
to Observation Deck + Eidolon Sanctum.

Floor area: ~28 m².

### V.6.3-9 Compact (~24 inventory objects)

```
floor: polished obsidian-black slate radiating from central plinth; gold inlay 7-pointed star at centre
walls (continuous curved): polished obsidian-black marble + gold-leaf rim; 3 alcove-recesses for cosmic-thread anchors
ceiling: 4.00 m; central oculus rises to 4.80 m; mirror-finish dome; star-field projection
lighting:
  ambient_baseline: 2400 K very warm + cyan accent; 80 lux (intentionally dim — cosmic gravity); CRI 90
  oculus_central: variable cosmic colour; 2000 lumens; pulses with Eidolon-bond rhythm
  cosmic_thread_alcove_glows×3: subtle warm-amber; 200 lumens each
  central_plinth_glow: variable; 400 lumens
atmosphere: 17°C cool / 38% RH / smells of cold-stone + bronze + ozone (cosmic radiation residue)
sound:
  ambient_bed: -38 dB very quiet; cosmic-resonance harmonic; faint distant chime; eidolon-breath subtle
  point_sources: cosmic_resonance from oculus; eidolon_breath_subtle (when bonded); plinth_resonance
  reverb_zone: eidolon_vessel_v1.wav wet 32%
  music_eligibility: cutscene only (deep eidolon-bond cinematics)
  voice_line_eligibility: eidolon (rare presence); the_player

object inventory (~24):
  - central plinth (Soul Stones cradle; mirrors §A.48)
  - pilot/eidolon shared chair (cosmic; one shared spot)
  - 3 cosmic-thread alcoves (radial; matching §A.45 Nexus Point pattern)
  - oculus (ceiling; mirror-finish; star-field)
  - cosmic-thread maps lectern
  - candle array (3; one per alcove)
  - eidolon's manifestation anchor
  - small bench (radial; for player meditation)
  - cockpit overlay (pilot interface; subtle)
  - intercom + fire_extinguisher + first_aid
  - dust_motes_emitter (cosmic motes)
```

### V.6.10-17 Compact

```
camera_spawn_points: cs_amb_eidolon_vessel; cs_first_extended_journey (Act 4); cs_eidolon_manifestation_in_vessel
doorways: external cosmic-portal (rare; cosmologically-mediated); ark.observation_deck or ark.eidolon_sanctum (when "stowed"; cosmologically-adjacent)
adjacency: direct ark.observation_deck + ark.eidolon_sanctum (cosmologically); one_hop hellbox.master_hellbox if Act 7
gameplay_hooks: pilot_operate; eidolon_bond_resonate; thread_alcove_inspect; soul_stone_place; cosmic_chart_read
story_tie: act_4_first_extended_eidolon_journey; eidolon_arc (continuous); act_7_lifetime_bond state-branched
npc_roster: eidolon (rare; cosmic-presence); the_player
readables: cosmic-thread maps; principle plaque "WE TRAVEL TOGETHER"; alcove inscriptions
master_of_rlyeh_question: n/a (eidolon-aligned cosmology)

special_fx: cosmic_motes; oculus_starfield_drift; eidolon_resonance_envelope; thread-glow-per-alcove
procedural: oculus_subtle_pulse; eidolon_breath_subtle (when present); thread-strum-distant
reactive: oculus_colour_shift_on_eidolon_state; thread_alcove_glow_on_inspect; plinth_glow_on_soul_stone_placed

avatar_parametricity: small_xenomorph alternate kneel-at-plinth; cosmic-aesthetic accommodating
performance: polygon_budget 140,000 / texture_budget 100 MB / light_count 10
streaming: preload ark.observation_deck + ark.eidolon_sanctum (cosmologically adjacent)
```

---

## V.7 Memorial Hearse

**Status: FULL spec (compact at full FULL fidelity).** Cross-ref
`_PRODUCTION_ARK_ROOMS.md` §A.27 Memorial Corridor.

### V.7.1 Header

```
space_id:        vehicle.memorial_hearse
space_name:      Memorial Hearse
space_type:      vehicle  (ceremonial transport; final-rites)
act_introduced:  Act 4  (alongside first canonical death-procession)
lore_anchor:     loredex.system.memorial_hearse + arc.fallen_crew + arc.memorial_processions
aesthetic_tier:  solar_punk_cathedral  (mausoleum-mortuary; reverent + warm-cold)
```

### V.7.2 Geometry

```
dimensions:           5.40 m × 2.40 m × 2.20 m  (small ceremonial vehicle)
origin_point:         centre of central catafalque platform
coordinate_axes:      +x = right, +y = forward (toward cockpit), +z = up
floor_plan_geometry:  rectangular  (cockpit + central catafalque + rear small officiant zone)
volumetric_anomalies: none
```

Memorial Hearse for canonical processions. Cockpit at front
(driver only); central catafalque platform for the deceased;
rear small officiant zone with ceremonial regalia rack.

Floor area: ~13 m².

### V.7.3-9 Compact (~22 inventory objects)

```
floor: polished dark-grey granite slabs (matches §A.27); 0.50×0.50 m tiles; bronze inlay outlining catafalque
walls:
  cockpit_north: reinforced transparent armour viewport + driver station + ceremonial-status display
  east + west: dark-grey granite cladding with sympathy-flowers carved in low relief; 4 small candle-stands per side
  rear_south: ceremonial entrance door + officiant zone + regalia rack
ceiling: 2.20 m baseline; small dome above catafalque; coffered with bronze rib detailing; subtle warm-amber strip-lighting
lighting:
  ambient_baseline: 2400 K very warm reverent; 100 lux (intentionally dim); CRI 90
  catafalque_uplight: warm gold; 800 lumens
  candle_stands×8: warm amber; 50 lumens each
  cockpit_pendant: warm 2400 K; 1500 lumens
  practical_sources: ceremonial-flame on each candle stand
atmosphere: 16°C cool reverent / 38% RH / smells of cold-stone + flame-smoke + faint metallic-bronze + brass-polish + funeral-flowers
sound:
  ambient_bed: -38 dB very quiet; faint distant bell-toll (period 60s); flame-crackle; engine-rumble subtle
  point_sources: bell_toll_distant; flame_crackle×8; engine_subtle; ceremonial-music-subtle (cutscene-only)
  reverb_zone: memorial_hearse_v1.wav wet 32% (long; reverent)
  music_eligibility: cutscene only — requiem-tonality pad
  voice_line_eligibility: officiant (rare named NPC); flame_keeper (rare visit)

object inventory (~22):
  - driver station + driver chair (cockpit)
  - cockpit viewport + ceremonial-status display
  - central catafalque platform (1.80 × 0.80 × 0.40)
  - bronze ceremonial-rail around catafalque
  - 8 candle stands (4 east + 4 west)
  - 4 framed photos of recently deceased (rotating; canonical)
  - rear ceremonial-entrance door
  - regalia rack (officiant robes + ceremonial implements)
  - small officiant podium
  - intercom + fire_extinguisher + first_aid
  - flame-keeper's_log (small lectern with current procession info)
  - bell-toll emitter
  - dust_motes_emitter (very low; reverent)
  - ceremonial-flowers_holder (perimeter)
```

### V.7.10-17 Compact

```
camera_spawn_points: cs_amb_memorial_hearse; cs_first_canonical_procession (Act 4 first-death); cs_canonical_burial (rare)
doorways: rear ceremonial-entrance → external memorial-corridor or burial-site; cockpit (rare emergency)
adjacency: direct ark.memorial_corridor when stowed; one_hop destination.canonical_burial_sites
gameplay_hooks: drive_procession; light_candle; place_flowers; converse_officiant; read_flame_keepers_log
story_tie: act_4_first_procession; memorial_processions (Acts 4-7); state-branched: well-mourned vs. cold-mourned ending
npc_roster: officiant (rare named NPC); flame_keeper (rare visit); the_player
readables: photos of deceased; flame_keepers_log; ceremonial procedures; principle plaque "WE CARRY OUR OWN"
master_of_rlyeh_question: n/a (parallel cosmology to §A.27 Memorial Corridor)

special_fx: dust very low reverent; flame-flicker; bell-toll-visualisation; ceremonial-incense subtle
procedural: candle_flicker_organic_per_candle; bell_toll_period_60s; engine_subtle_continuous
reactive: catafalque_uplight_intensify_on_player_proximity; candle_stand_glow_on_flame_relit; bell_toll_visualisation_per_toll

avatar_parametricity: small_xenomorph alternate ladder for upper candle-stands; catafalque-fitting parametric
performance: polygon_budget 100,000 / texture_budget 80 MB / light_count 10
streaming: preload ark.memorial_corridor when stowed
```

---

## Document status (Phase D complete)

**FULL spec authored** (all 17 layers): All 7 canonical vehicle
interiors.

| § | Vehicle | Total objects | Class |
|---|---|---|---|
| V.1 | CADES APC | 38 | armoured personnel carrier |
| V.2 | Captain's Personal Shuttle | 24 | small craft (private) |
| V.3 | Trade Hub Cargo Vessel | 32 | bulk hauler |
| V.4 | Combat Dropship | 28 | strike craft |
| V.5 | Pet Transport Vessel | 30 | mobile arena |
| V.6 | Eidolon Vessel | 24 | cosmic craft |
| V.7 | Memorial Hearse | 22 | ceremonial transport |

**Total: 7 vehicle interiors specced at full FULL.** ~198 inventory
objects across all vehicles.

Future Phase E-F (deferred to follow-up branches per the
production roadmap):
- Phase E: ~60 destination zones (`_PRODUCTION_DESTINATIONS.md`)
- Phase F: ~165 cutscenes shot-by-shot + NPC homes + audit
  (`_PRODUCTION_CROSS_CUT.md`)

---
