# Inception Ark — Production: Hellbox Interior Destinations Architect-Layer Spec

> **Phase C of the Dreamer-Architect production roadmap.** This
> document holds the full §4 architect-layer spec for all 12
> active Hellbox interior destinations (numbered §H.1 through
> §H.12, mirroring the HB1-HB12 numbering in
> `INCEPTION_ARK_FINAL_PRODUCTION.md` §3.12).
>
> The §4 universal spec format is defined in
> `INCEPTION_ARK_FINAL_PRODUCTION.md` §4. The Bridge exemplar
> (`INCEPTION_ARK_FINAL_PRODUCTION.md` §4.18) is the worked-spec
> pattern. Hellbox interiors are larger and more elaborate than
> Ark rooms — each is a Matrix-of-Dreams destination, often
> involving non-Euclidean geometry, dramatically extended scale,
> and faction-philosophy mechanics.
>
> **Authoring discipline**: every Hellbox interior conforms to
> the §4 format EXACTLY. Layers are present in the same order.
> Coordinates are precise to 0.01 m. Rotations precise to 0.1°.
> Colours bound to design tokens. Every object justified by the
> story.
>
> **Cross-reference:** `INCEPTION_ARK_FINAL_PRODUCTION.md` §3.12
> defines each Hellbox's cosmology, transit cinematic, Master of
> R'lyeh question, and 5-faction philosophical answer mechanic.
> This doc (§H) is the geometric/architectural spec for the
> destination interior.

## H.0 How this document works

### H.0.1 Cross-doc relationship

| spec layer | document | purpose |
|---|---|---|
| Hellbox cosmology | `INCEPTION_ARK_FINAL_PRODUCTION.md` §3.12 | which rooms are gateways, transit cinematics, faction-pull mechanics |
| Cinematic direction | `INCEPTION_ARK_FINAL_PRODUCTION.md` §3 | universal cutscene direction (FPV, Categories A/B/C) |
| Architect-layer spec (Ark rooms) | `_PRODUCTION_ARK_ROOMS.md` §A | the host rooms in the Ark |
| Architect-layer spec (Hellbox interiors) | this document (§H) | the destination interiors |
| Living-world routines | `INCEPTION_ARK_FINAL_PRODUCTION.md` §11 | how Hellbox interiors evolve between visits |

### H.0.2 Coordinate convention

All positions are (x, y, z) in metres from the destination's
origin point. +x = right, +y = forward (deeper into the
destination), +z = up. Rotation is yaw degrees (0-359.99); pitch
and roll default to 0 unless specified.

Hellbox interiors frequently use non-Euclidean geometry. When a
volumetric anomaly is present, dimensions are noted as
PERCEPTUAL — what the player experiences — not as the tractable
external footprint of the host room.

### H.0.3 Aesthetic tier alignment

Hellbox interiors typically use the `matrix_dream` aesthetic
tier as a base, with sub-tier overlays per Hellbox character:
- HB1 Celebration School: `matrix_dream` + `solar_punk_cathedral` cathedral overlay
- HB2 Castle of Death: `wagner_baroque`
- HB3 Quiz Show Palimpsest: `matrix_dream` + theatrical-studio overlay
- HB4 Mechronis Academy: `architect_geometric`
- HB5 Universal Selector: minimal aesthetic (navigation-only)
- HB6 Dead Man's Circuit: `matrix_dream` + speed-circuit overlay
- HB7 Degenerate's Casino: `matrix_dream` + film-noir-baroque overlay
- HB8 Editor's Workshop: `matrix_dream` + scribe-cosmic overlay
- HB9 Eternal Match: `architect_geometric` + chamber-chapel overlay
- HB10 Hall of Collected Souls: `dreamers_oneiric` + gallery-mausoleum overlay
- HB11 The Hive: `terminus_organic`
- HB12 Dischordian Arena: `matrix_dream` + meta-arena overlay

### H.0.4 Master of R'lyeh return-transit

Every Hellbox interior includes a return-transit anchor — the
specific position from which the player invokes return to the
host Ark room. Per §3.12.2, the return-transit is a ~5s fade
that lands the player back at the host room (or, if invoked from
HB5 Universal Selector, back at HB5).

---

## H.1 Celebration School (HB1 — Med Bay gateway)

**Status: FULL spec.** Cross-ref `INCEPTION_ARK_FINAL_PRODUCTION.md`
§3.12.3 for cosmology + transit + faction answers.

### H.1.1 Header

```
space_id:        hellbox.celebration_school
space_name:      Celebration School
space_type:      hellbox_interior  (Matrix-of-Dreams destination)
act_introduced:  Act 1
host_room:       ark.med_bay (autoclave statue gateway)
lore_anchor:     loredex.system.celebration_school + arc.act_1_first_HB1_invocation + loredex.character.master_of_rlyeh
aesthetic_tier:  matrix_dream + solar_punk_cathedral cathedral overlay  (1950s American elementary school crossed with Italianate-baroque cathedral)
```

### H.1.2 Geometry

```
dimensions:           48.00 m × 36.00 m × 18.00 m  (perceptual; bigger-on-inside ratio 6× external Med Bay footprint)
origin_point:         centre of central courtyard (where the player materialises after transit)
coordinate_axes:      +x = right, +y = forward (north — toward main school building façade), +z = up
floor_plan_geometry:  non_euclidean  (school courtyard surrounded by classrooms + cathedral apse to the north + playground to the south + childrens' garden to east + memorial chapel to west)
volumetric_anomalies:
  - bigger_on_inside ratio: 6× external host-room footprint
  - children-time-shift: NPCs visibly shift between child-form (1950s schoolchild) and adult-form (the same crew member as adult); the shifts are gentle + non-disturbing
  - cathedral-extends-up: north wall of central courtyard opens upward into a cathedral that extends impossibly far above (visible up to z = 60.00 perceptual; visually fades into starfield)
  - sunlight-without-source: continuous golden-hour sunlight fills the courtyard with no visible sun; light bleeds from a non-physical "above"
```

The Celebration School is intentionally UNSETTLING-WHOLESOME. It
is a celebration of the dead — every NPC the player has lost
(canonically; in canon Acts 1+) appears here as a child-version
of themselves, attending school. The school is in perpetual
golden-hour sunlight; classrooms have grade-school chalkboards;
a cathedral apse rises impossibly to the north. The player is
honoured-greeted by the children who recognise them as if the
player has always been part of this school.

Floor area (perceptual): central courtyard ~720 m²; total
across all sub-zones ~1,800 m².

### H.1.3 Floor

```
material_primary:     warm-brick paving in herringbone pattern at central courtyard; 0.30 × 0.15 m bricks; weathered + worn (1950s school feel)
material_secondary:   gold-leaf inlay forming a 5-pointed star at courtyard centre (this is where the player materialises); brass perimeter trim demarcating sub-zones
pattern:              herringbone bricks + central 5-star inlay; chalk-game outlines (hopscotch, four-square) at south-courtyard zone
wear_state:           pristine but well-loved; chalk-game outlines visibly chalk-rubbed; brick at most-walked paths slightly more polished
embedded_features:
  - id: hellbox.celebration_school.floor.charge_point.player_arrival_star
    position: (0.00, 0.00, 0.00)  # at room centre; player materialises here
    dimensions: 0.40 × 0.40 × 0.05
    function: arrival-anchor + return-transit invocation
  - id: hellbox.celebration_school.floor.classroom_threshold.<n>  (4 thresholds; one per classroom door — east row)
    position: (-12.00, 6.00, 0.00), (-12.00, 12.00, 0.00), (-12.00, 18.00, 0.00), (-12.00, 24.00, 0.00)
    dimensions: 1.20 × 0.20 × 0.05 each
    function: classroom-entry threshold
  - id: hellbox.celebration_school.floor.cathedral_threshold
    position: (0.00, 30.00, 0.00)  # at north end where cathedral apse begins
    dimensions: 6.00 × 0.20 × 0.05
    function: cathedral-entry threshold; subtle haptic change
  - id: hellbox.celebration_school.floor.playground_threshold.south
    position: (0.00, -8.00, 0.00)
    dimensions: 6.00 × 0.20 × 0.05
    function: playground-entry threshold
acoustic_property:    soft_absorbent (warm bricks + open courtyard); RT60 = 0.55s (intimate-cathedral-like with playground edge)
```

### H.1.4 Walls

The Celebration School has multiple discrete sub-zones, each with
distinct walls. Specced per zone.

#### Central Courtyard Walls (all 4 walls of central 24×24m space)

```
wall_id:              courtyard_perimeter  (east + west + south are short-walls; north opens to cathedral)
material_primary:     warm-cream stuccoed plaster on solid backing (1950s school architecture); 0.80 × 1.60 m panels
material_secondary:   bronze dado at z = 1.20 m; weathered-brass trim; chalkboard panels mounted on east + west walls
panelisation:         standard
colour_value:         --token-color-hellbox-celebration-school-stucco  (warm cream + faint gold-amber accent — perpetual golden hour)
embedded_displays:
  - id: hellbox.celebration_school.east.chalkboard.lesson  (east wall main chalkboard)
    position: (-12.00, 12.00, 1.50)  # at central east classroom approach
    dimensions: 4.00 × 1.50 × 0.05
    content: chalk-board with current "lesson" — varies by player's emotional state (canonical: a lesson on grief / a lesson on releasing / a lesson on remembrance)
  - id: hellbox.celebration_school.west.chalkboard.attendance
    position: (12.00, 12.00, 1.50)  # at west wall
    dimensions: 4.00 × 1.50 × 0.05
    content: attendance ledger of the dead; updates as player progresses
embedded_doors:
  - door_id: hellbox.celebration_school.east.classroom_door.<n>  (4 classroom doors east)
    position: (-12.00, 6.00, 0.00), (-12.00, 12.00, 0.00), etc.
    dimensions: 1.20 × 2.40 × 0.10 each
    door_class: arch  (warm walnut frame; 1950s school door aesthetic)
    connecting_space_id: hellbox.celebration_school.classroom.<grade>  (4 classrooms; grades 1-4; deferred sub-spaces)
  - door_id: hellbox.celebration_school.west.classroom_door.<n>  (4 classroom doors west; mirror)
    position: mirror of east
    door_class: arch
    connecting_space_id: hellbox.celebration_school.classroom.<grade>  (grades 5-8; deferred)
  - door_id: hellbox.celebration_school.north.cathedral_archway
    position: (0.00, 30.00, 0.00)  # at north end
    dimensions: 6.00 × 8.00 × 0.20  (large archway; cathedral begins beyond)
    door_class: portal  (open archway with mild light-bloom; cathedral apse beyond)
    connecting_space_id: hellbox.celebration_school.cathedral_apse
  - door_id: hellbox.celebration_school.south.playground_archway
    position: (0.00, -8.00, 0.00)
    dimensions: 6.00 × 6.00 × 0.20
    door_class: open_passage
    connecting_space_id: hellbox.celebration_school.playground
decorative_features:
  - id: hellbox.celebration_school.flagpole_central
    position: (0.00, 6.00, 0.00)
    dimensions: 0.20 × 0.20 × 8.00
    material: brass + ivory pole + canvas flag
    narrative_role: school flag — flies at half-mast (always); lore-readable
  - id: hellbox.celebration_school.bell_tower_north  (visible from courtyard)
    position: (0.00, 36.00, 14.00)  # tall tower at north end
    dimensions: 4.00 × 4.00 × 4.00  (tower top; visible silhouette)
    material: brick + brass bell + clock-face
    narrative_role: school bell tower; tolls every 30 minutes (perceptual time); each toll causes child-NPCs to gently shift form
```

#### Cathedral Apse Walls (extends north from courtyard)

```
wall_id:              cathedral_apse_north  (the north wall of the cathedral; impossibly tall; non-Euclidean)
material_primary:     polished marble (apsidal; curved) with stained-glass windows depicting "the children of the morning" + "the children of the evening" + "the children of the eternal"; gold-leaf trim
material_secondary:   bronze ribbing (impossibly tall; rises to z = 60+)
panelisation:         apsidal — single curved + ribbed surface
colour_value:         --token-color-hellbox-celebration-school-cathedral-marble  (warm-cream marble with gold + amber + cyan stained-glass accents)
embedded_displays:    none (the stained-glass + relief is the content)
embedded_doors:        none (no exits from cathedral apse; only the south archway back to courtyard)
decorative_features:
  - id: hellbox.celebration_school.cathedral_apse.relief.children_eternal
    position: (0.00, 36.00, 12.00)
    dimensions: 6.00 × 4.00 × 0.20 (deep relief)
    material: cast bronze with gilt + jewel inlays
    narrative_role: depicts ALL the children (every NPC the player has lost; cumulative; updates over time); the relief literally adds new figures as more crew die in player's playthrough
  - id: hellbox.celebration_school.cathedral_apse.altar
    position: (0.00, 32.00, 0.00)
    dimensions: 2.00 × 1.20 × 1.10
    material: white marble with bronze altar-cloth holder + gold rim
    narrative_role: where the Master of R'lyeh's voice emanates from during faction-philosophy answer-commitment moments
```

#### Playground (south of courtyard) — partial spec

The playground extends south from the courtyard with swings,
slide, jungle gym, sandbox. Specced as decorative_features:

```
playground_features:
  - swing_set: (0.00, -16.00, 0.00); 6.00×0.30×3.50
  - slide: (4.00, -14.00, 0.00); 1.40×3.00×3.50
  - jungle_gym: (-4.00, -14.00, 0.00); 4.00×4.00×3.00
  - sandbox: (0.00, -20.00, 0.00); 4.00×4.00×0.30; with 3-4 child NPCs playing
```

### H.1.5 Ceiling

```
height_above_floor:     no traditional ceiling at central courtyard (open to perceptual sky); cathedral apse extends to z = 60+ perceptual
material:               n/a at courtyard (open sky); apsidal vault is polished marble + stained-glass windows + gold-coffer detailing
lighting_integrated:    sunlight-without-source (perpetual golden hour; no visible sun); cathedral apse has 12 stained-glass windows that bleed light from the impossible-above; courtyard lamp posts at 4 corners (1950s school aesthetic)
atmospheric_features:   golden-hour particles drift continuously (cosmetic; reinforces "eternal afternoon" feel); birds fly visibly across the perceptual-sky
acoustic_treatment:     open-air (courtyard); apsidal echo (cathedral)
```

### H.1.6 Lighting

```
ambient_baseline:     2400 K (golden hour; very warm); 320 lux at floor (bright; reassuring); CRI 95
direct_fixtures:
  - id: hellbox.celebration_school.light.sunlight_without_source
    position: distributed (the entire perceptual sky bleeds light; no single source)
    beam_angle: ambient (everywhere)
    colour: --token-color-hellbox-celebration-school-sunlight  (golden hour; 2400-2600 K)
    intensity: 14000 lumens equivalent (continuous; no flicker)
    function: principal — defines the eternal-afternoon aesthetic
  - id: hellbox.celebration_school.light.cathedral_stained_glass
    position: (12 windows distributed in cathedral apse at z = 30, 40, 50; warm-amber + cyan)
    beam_angle: 60° downward (each)
    colour: per-window (warm amber baseline; cyan accents)
    intensity: 3000 lumens each (warm dramatic light shafts)
    function: cathedral atmosphere
  - id: hellbox.celebration_school.light.lamp_post.<corner>  (4 lamp posts at courtyard corners)
    position: (12.00, -3.00, 0.00), (-12.00, -3.00, 0.00), (12.00, 27.00, 0.00), (-12.00, 27.00, 0.00)
    beam_angle: 270° (upward + lateral)
    colour: warm 2700 K
    intensity: 1500 lumens each
    function: courtyard accent (reads as 1950s school lamp post)
  - id: hellbox.celebration_school.light.bell_tower_glow
    position: (0.00, 36.00, 14.00)
    beam_angle: 180° outward
    colour: warm gold; 3000 lumens
    function: bell-tower aesthetic anchor
practical_sources:
  - id: hellbox.celebration_school.flagpole_subtle_glint
    position: at flagpole tip
    intensity: 50 lumens (sun-glint)
    flicker_pattern: stable
  - id: hellbox.celebration_school.cathedral_altar_subtle_glow
    position: (0.00, 32.00, 1.10)  # altar top
    intensity: 200 lumens (warm; pulses with R'lyeh resonance during answer moments)
    flicker_pattern: deeply slow pulse
time_of_day_variation:
  acts_1_to_7: stable golden hour throughout — Celebration School never changes light; the eternal afternoon is a feature, not a bug
  state-conditional: during faction-answer commitment moments (Master of R'lyeh question), cathedral stained-glass intensifies + altar glow blooms
dynamic_response:
  - on_player_arrival: sunlight pulses gently (welcoming); child-NPCs nearest player turn to greet
  - on_master_of_rlyeh_question: altar glow blooms; cathedral stained-glass intensifies; perceptual-sky momentarily darkens then returns
  - on_faction_answer_commit: relevant alcove (one per faction) intensifies; cathedral relief gains a new figure if applicable
```

### H.1.7 Atmosphere

```
air_temperature:    24°C (warm; perpetual late-spring afternoon)
humidity:           48% RH (comfortable); smells of fresh-cut grass + chalk-dust + wax (cathedral candles) + faint cinnamon (cafeteria) + bread-baking (cafeteria)
particulate:
  - dust_motes: medium (visible in golden-hour light; magical-quality shimmer)
  - chalk_dust: low (rises from chalkboards when chalk is used)
  - bee_drift: very low (cosmetic; 2-3 bees occasionally cross the courtyard from playground gardens)
  - leaves_drift: medium (autumn leaves perpetually falling though it's not autumn — eternal afternoon paradox)
volumetric_fog:     absent in baseline; subtle haze at apsidal vault apex during cathedral events
wind_drift:         very faint; 0.04 m/s; slight inward-spiral toward courtyard centre
smell_canon:        grass + chalk + wax + cinnamon + bread; voice-line: "smells like Tuesday afternoon, before everything"
```

### H.1.8 Sound

```
ambient_bed:           file: celebration_school_ambient_bed_v1.ogg (loop); -28 dB; distant children's laughter (continuous; cosmologically ageless), school bell-toll period 30 min, distant playground sounds (swings, slide), bird-song
point_sources:
  - id: hellbox.celebration_school.sound.bell_toll
    position: (0.00, 36.00, 14.00)
    sound: deep bell-toll (period 30 min; -22 dB per toll)
    occlusion_behaviour: omnidirectional
    trigger: cyclic
  - id: hellbox.celebration_school.sound.children_laughter
    position: distributed (multiple sources)
    sound: continuous distant laughter (varies; pseudo-random; -32 dB)
    occlusion_behaviour: omnidirectional
    trigger: continuous
  - id: hellbox.celebration_school.sound.playground_play
    position: (0.00, -16.00, 0.00)
    sound: swings creaking, slide-whoops, sandbox-shuffle (-30 dB)
    occlusion_behaviour: standard
    trigger: continuous
  - id: hellbox.celebration_school.sound.cathedral_choir
    position: (0.00, 32.00, 30.00)
    sound: faint distant choir (children singing wordless hymns; -34 dB; emerges from impossibly-above)
    occlusion_behaviour: omnidirectional with bias upward
    trigger: continuous
  - id: hellbox.celebration_school.sound.master_of_rlyeh_voice
    position: (0.00, 32.00, 1.10)  # at altar
    sound: Master of R'lyeh's deep oceanic alien voice (per §3.12.2 voice ID; only during faction-answer moments)
    occlusion_behaviour: omnidirectional with bias toward apse
    trigger: state-conditional
reverb_zone:           IR-impulse: celebration_school_v1.wav; wet-mix 28% (apsidal cathedral with open-air courtyard)
music_eligibility:     ambient music ALLOWED — distant orchestral pad (warm; childlike + reverent) at -32 dB throughout
voice_line_eligibility:
  - speaker: child_versions_of_dead_crew  (rotating; one per known dead crew member): line set §H.1-specific (each child-form has lines + greets player by player's chosen name)
  - speaker: the_school_principal  (named NPC; appears at cathedral altar; canonically: a deceased pre-Ark elder)
  - speaker: master_of_rlyeh  (only during faction-answer moments)
```

### H.1.9 Object inventory

Celebration School has 64 inventory objects.

#### H.1.9.1 The Player Arrival Star (centre of courtyard)

```
object_id:           hellbox.celebration_school.player_arrival_star
object_class:        fx_emitter  (also gameplay-anchor)
position:            (0.00, 0.00, 0.005)
dimensions:          0.40 × 0.40 × 0.005
rotation:            0°
material_primary:    gold-leaf inlay forming a 5-pointed star
material_secondary:  brass perimeter ring
colour_value:        --token-color-hellbox-celebration-school-arrival-star  (warm gold)
interaction:         interactable
  - return_to_med_bay: invoke return-transit (Master of R'lyeh asks if player wishes to leave); ~5s fade back to ark.med_bay
narrative_role:      THE arrival point + return-transit invocation point
lore_anchor:         arc.return_transit
art_status:          producer_handoff
gameplay_hook_id:    trpc.hellbox.hb1.return_transit
wear_state:          pristine (cosmologically pristine; cannot be damaged)
physical_constraints: non-collide; player-step-on triggers subtle warmth pulse
```

#### H.1.9.2-9 Eight Classroom Doors (4 east + 4 west)

```
object_id:           hellbox.celebration_school.east.classroom_door.grade_<n>  (and .west.classroom_door.grade_<n>)
positions:           [
  (-12.00, 6.00, 0.00), (-12.00, 12.00, 0.00), (-12.00, 18.00, 0.00), (-12.00, 24.00, 0.00)  # east; grades 1-4
  (12.00, 6.00, 0.00), (12.00, 12.00, 0.00), (12.00, 18.00, 0.00), (12.00, 24.00, 0.00)      # west; grades 5-8
]
dimensions (each):   1.20 × 2.40 × 0.10
rotation (each):     varies (90° east / 270° west)
material_primary:    warm walnut frame with frosted-glass panel + brass handle
material_secondary:  bronze nameplate per grade
colour_value:        --token-color-hellbox-celebration-school-classroom-door
interaction:         interactable
  - open: enters classroom (deferred sub-space; treat as showing classroom interior peek)
  - inspect: lore-note about that grade-level (each grade contains a different age-group of dead crew as children)
narrative_role:      classroom doors; entering reveals the dead crew as their child-selves
lore_anchor:         arc.celebration_school_grades
art_status:          producer_handoff
gameplay_hook_id:    trpc.hellbox.hb1.classroom.enter
wear_state:          slight wear at handle
physical_constraints: collides
```

#### H.1.9.10 The Cathedral Archway

```
object_id:           hellbox.celebration_school.north.cathedral_archway
object_class:        door  (portal-class)
position:            (0.00, 30.00, 0.00)
dimensions:          6.00 × 8.00 × 0.20
rotation:            180°
material_primary:    polished white marble with gold-leaf trim; deep relief carving in archway
material_secondary:  bronze ribbing flanking
colour_value:        --token-color-hellbox-celebration-school-cathedral-archway  (warm cream marble + gold)
interaction:         interactable
  - traverse: enters cathedral apse (continuous space; not a sub-room transition)
  - inspect: lore-note about archway (engraved children's names — every dead crew member, listed)
narrative_role:      THE threshold to the cathedral apse; player crosses here for faction-answer commitment moments
lore_anchor:         arc.cathedral_threshold
art_status:          producer_handoff
gameplay_hook_id:    trpc.hellbox.hb1.cathedral.traverse
wear_state:          slight wear at threshold
physical_constraints: open passage (player walks through)
```

#### H.1.9.11 The Cathedral Altar

```
object_id:           hellbox.celebration_school.cathedral_apse.altar
object_class:        interactive  (also npc_anchor — Master of R'lyeh voice emanates from here)
position:            (0.00, 32.00, 0.00)
dimensions:          2.00 × 1.20 × 1.10
rotation:            0°
material_primary:    polished white marble with bronze altar-cloth holder + gold rim
material_secondary:  cast bronze candle-stand at corners; gold-leaf cross-inlay top (cosmologically symbolic; not religiously specific)
colour_value:        --token-color-hellbox-celebration-school-altar
interaction:         interactable
  - approach_for_master_of_rlyeh: triggers Master of R'lyeh question delivery (one-shot Act 1 first invocation; subsequently re-invocable for faction-pull adjustment)
  - inspect: lore-note about altar (canonical pre-Ark; the altar that received first death)
narrative_role:      THE Master of R'lyeh anchor; "When the body fails, does the self?" delivered here
lore_anchor:         arc.act_1_HB1_invocation + loredex.character.master_of_rlyeh
art_status:          producer_handoff
gameplay_hook_id:    trpc.hellbox.hb1.altar.invoke_master_of_rlyeh
wear_state:          slight wear at altar centre
physical_constraints: collides
```

#### H.1.9.12 The Cathedral Relief — Children Eternal

```
object_id:           hellbox.celebration_school.cathedral_apse.relief.children_eternal
object_class:        decoration  (also fx_emitter — additions appear as new dead crew added)
position:            (0.00, 36.00, 12.00)
dimensions:          6.00 × 4.00 × 0.20
rotation:            180°
material_primary:    cast bronze with gilt + jewel inlays
material_secondary:  none
colour_value:        --token-color-hellbox-celebration-school-children-relief
interaction:         inspectable
  - inspect: opens multi-screen lore (every figure in the relief has a name + cause-of-death + canonical-life-summary; updates as more crew die in player's playthrough)
narrative_role:      THE relief; visible from courtyard; updates with each death; emotional anchor
lore_anchor:         arc.fallen_crew + arc.cumulative_grief
art_status:          producer_handoff
gameplay_hook_id:    trpc.hellbox.hb1.relief.inspect
wear_state:          slight patina; new figures more recent (less patina)
physical_constraints: non-collide (at height)
```

#### H.1.9.13 The Bell Tower

```
object_id:           hellbox.celebration_school.bell_tower
object_class:        decoration  (visible silhouette + sound source)
position:            (0.00, 36.00, 14.00)
dimensions:          4.00 × 4.00 × 4.00 (tower top)
rotation:            0°
material_primary:    weathered red brick with brass bell visible inside; clock-face on south side (frozen at 2:47 — canonically the time of first canonical death)
material_secondary:  brass + ivory pole tipped in gilt
colour_value:        --token-color-hellbox-celebration-school-bell-tower
interaction:         inspectable (cannot be approached directly; visible from courtyard)
narrative_role:      THE bell tower; tolls every 30 perceptual-minutes; clock face frozen at 2:47 (cosmological detail player can notice)
lore_anchor:         arc.celebration_school_canon + arc.first_death
art_status:          producer_handoff
gameplay_hook_id:    none (atmospheric)
wear_state:          weathered (intentional 1950s aesthetic)
physical_constraints: non-collide (overhead)
```

#### H.1.9.14 The Flagpole

```
object_id:           hellbox.celebration_school.flagpole_central
object_class:        decoration
position:            (0.00, 6.00, 0.00)
dimensions:          0.20 × 0.20 × 8.00
rotation:            0°
material_primary:    brass + ivory pole
material_secondary:  canvas flag at half-mast (always)
colour_value:        --token-color-hellbox-celebration-school-flag  (white canvas with gold-thread embroidered "CELEBRATION SCHOOL — FOREVER" motto)
interaction:         inspectable
  - inspect: lore-note about flag (always at half-mast; canonical: one is always being mourned)
narrative_role:      visible courtyard centerpiece; never lowered fully; never raised fully
lore_anchor:         arc.celebration_school_canon
art_status:          producer_handoff
gameplay_hook_id:    trpc.hellbox.hb1.flagpole.read
wear_state:          flag slightly faded (perpetual sun); pole pristine
physical_constraints: collides
```

#### H.1.9.15-22 Eight Child-NPC Anchors (one per dead crew currently rendered)

```
object_id:           hellbox.celebration_school.child_npc_anchor.<dead_crew_id>  (varies; rendered based on player's playthrough — the ~6-8 currently-known dead crew members)
object_class:        npc_anchor
positions:           varied (children move freely; each has 3-5 anchor positions across courtyard + classrooms + playground)
dimensions (each):   0.50 × 0.50 × 1.20 (anchor only — child-form heights)
rotation:            varies (NPC pose-driven)
material_primary:    n/a (anchor only; NPC overrides)
material_secondary:  n/a
colour_value:        n/a
interaction:         interactable
  - greet: child-NPC turns to player + gives age-appropriate greeting (each has unique line set; canonically warm + welcoming + slightly uncanny)
  - converse: extended dialogue; child-NPC remembers things from their past life as adult crew + may reveal hidden lore
  - hug: gameplay-passive (very emotional; lore-flag)
narrative_role:      THE dead crew, alive-as-children; every NPC the player has lost is here; primary emotional content of the Hellbox
lore_anchor:         per-deceased
art_status:          producer_handoff
gameplay_hook_id:    trpc.hellbox.hb1.child_npc.<id>.greet + .converse + .hug
wear_state:          n/a (children are eternally fresh)
physical_constraints: collide (children-sized; gentle)
```

#### H.1.9.23 The School Principal Anchor

```
object_id:           hellbox.celebration_school.school_principal_anchor
object_class:        npc_anchor
position:            (0.00, 32.50, 0.00)  # at altar
dimensions:          0.80 × 0.80 × 1.80
rotation:            varies
material_primary:    n/a
material_secondary:  n/a
colour_value:        n/a
interaction:         interactable
  - converse: the Principal speaks for canonical Hellbox-cosmology — gives lore + reveals the Master of R'lyeh's nature
narrative_role:      THE Principal; canonically a pre-Ark elder who died centuries ago; he tends the school; holds the cathedral altar
lore_anchor:         loredex.character.celebration_school_principal + arc.celebration_school_canon
art_status:          producer_handoff
gameplay_hook_id:    trpc.hellbox.hb1.principal.converse
wear_state:          n/a
physical_constraints: n/a
```

#### H.1.9.24-32 Playground Equipment (9 items)

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `hellbox.celebration_school.playground.swing_set` | interactive | (0.00, -16.00, 0.00) | 6.00×0.30×3.50 | swing-set with 3 swings; player can sit + swing |
| `hellbox.celebration_school.playground.slide` | interactive | (4.00, -14.00, 0.00) | 1.40×3.00×3.50 | slide; player can climb + slide |
| `hellbox.celebration_school.playground.jungle_gym` | interactive | (-4.00, -14.00, 0.00) | 4.00×4.00×3.00 | jungle gym; player can climb |
| `hellbox.celebration_school.playground.sandbox` | interactive | (0.00, -20.00, 0.00) | 4.00×4.00×0.30 | sandbox with sand + 3-4 child NPCs playing |
| `hellbox.celebration_school.playground.merry_go_round` | interactive | (-6.00, -16.00, 0.00) | 2.00 dia × 0.40 | merry-go-round with painted horses |
| `hellbox.celebration_school.playground.see_saw.pair` | interactive | (6.00, -18.00, 0.00) | 4.00×0.30×0.80 | see-saw |
| `hellbox.celebration_school.playground.tetherball.pole` | decoration | (-6.00, -20.00, 0.00) | 0.20×0.20×3.50 | tetherball |
| `hellbox.celebration_school.playground.basketball_hoop` | decoration | (6.00, -22.00, 0.00) | 0.20×1.20×3.50 | basketball hoop |
| `hellbox.celebration_school.playground.bench.<n>` (3) | furniture | distributed | 1.40×0.40×0.45 each | playground benches |

#### H.1.9.33-36 Four Lamp Posts

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `hellbox.celebration_school.lamp_post.<corner>` (4) | fx_emitter+decoration | courtyard corners at z=0 to 4.50 | 0.20×0.20×4.50 each | 1950s school lamp posts |

#### H.1.9.37-44 Eight Cathedral Stained-Glass Windows

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `hellbox.celebration_school.cathedral_apse.stained_glass.<n>` (8) | decoration+fx_emitter | distributed in apse at z=20-40 | 1.40×3.00×0.05 each | stained-glass windows depicting children-eternal |

#### H.1.9.45-52 Eight Courtyard Trees + Shrubs

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `hellbox.celebration_school.courtyard.oak_tree.<n>` (4) | decoration | corners + perimeter | varied (3.00×3.00×8.00 each canopy) | mature oak trees; eternal autumn leaves drift from them |
| `hellbox.celebration_school.courtyard.shrub.<n>` (4) | decoration | distributed | 0.80×0.80×1.20 each | small shrubs/flowers |

#### H.1.9.53-58 Six Courtyard Benches

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `hellbox.celebration_school.courtyard.bench.<n>` (6) | furniture | distributed | 1.80×0.40×0.45 each | reading benches; player can sit and watch children |

#### H.1.9.59-60 Two Chalkboards (east + west)

Specced in walls. Inventoried for completeness.

#### H.1.9.61-64 Closing Items

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `hellbox.celebration_school.cathedral_apse.altar_cloth` | decoration | on altar | 1.80 × 0.10 × 0.40 | white cloth with gold-thread embroidery |
| `hellbox.celebration_school.cathedral_apse.altar.candle.east, .west` (2) | fx_emitter | on altar corners | 0.10×0.10×0.30 each | bronze + wax candles; eternal flames |
| `hellbox.celebration_school.return_transit_indicator_glow` | fx_emitter | (0.00, 0.00, 1.50) above arrival star | 0.40 dia × 0.05 | subtle gold-glow indicating return-transit available |

Total: 64 inventory objects (NPC anchors counted; sub-space classroom contents deferred).

### H.1.10 Camera-spawn-points (FPV cutscenes)

```
cutscene_id:         cs_hellbox_1_arrival  (Act 1 first-time + every subsequent visit)
camera_position:     (0.00, 0.00, eye_level)  # at arrival star
camera_facing:       (0°, 5°, 0°)  # facing forward; slight upward tilt to take in cathedral apse
avatar_height_anchor: eye_level
head_motion:         camera materialises with petals dissolving from previous transit; slow head-pan from south (playground) to north (cathedral); lasts 8s

cutscene_id:         cs_hellbox_1_first_child_greet  (Act 1 first-time only)
camera_position:     (0.00, 4.00, eye_level)
camera_facing:       (0°, -5°, 0°)
avatar_height_anchor: eye_level
head_motion:         child-NPC of first canonical dead crew approaches; greets player by name; slow zoom on child's face; lasts 14s

cutscene_id:         cs_hellbox_1_master_of_rlyeh_question  (Act 1 first-time + re-invocable per visit)
camera_position:     (0.00, 30.00, eye_level)  # at cathedral threshold
camera_facing:       (0°, 0°, 0°)  # facing altar
avatar_height_anchor: eye_level
head_motion:         player approaches altar; cathedral apse extends impossibly upward; Master of R'lyeh's voice asks: "When the body fails, does the self?"; radial 5-faction menu appears

cutscene_id:         cs_hellbox_1_close  (return-transit invocation)
camera_position:     (0.00, 0.00, eye_level)  # at arrival star
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         player at arrival star; petals begin to drift; ~5s fade to ark.med_bay
```

### H.1.11 Doorways

```
door_id:            hellbox.celebration_school.return_transit_anchor
connecting_space_id: ark.med_bay  (host room)
door_position:      (0.00, 0.00, 0.005)  # at arrival star
door_dimensions:    n/a (cosmological return-transit; not physical)
door_class:         portal  (cosmological)
unlock_condition:   always available once player is in Hellbox
transit_animation:  ~5s petal-drift fade per §3.12.3 cs_hellbox_1_close
audio_signature:    petals fading; ozone clearing; Med Bay ambient bed fades in

(Internal doorways within Hellbox interior — classroom doors, cathedral archway — specced in walls.)
```

### H.1.12 Adjacency map

```
direct_adjacencies:
  - ark.med_bay (return-transit; host room)
  - hellbox.celebration_school.classroom.<grade> (8 sub-spaces; deferred from FULL spec)
  - hellbox.celebration_school.cathedral_apse (continuous space; cathedral within Hellbox)
  - hellbox.celebration_school.playground (continuous space; playground within Hellbox)
one_hop_adjacencies:
  - ark.cryo_bay (via Med Bay corridor; thematic kinship — both spaces meditate on death)
  - hellbox.master_hellbox (HB5 Universal Selector; if player has unlocked)
state_shared_with:
  - ark.med_bay (HB1-faction-pull state)
  - the player's running list of dead crew (cumulative; updates relief + child-NPC roster)
```

### H.1.13 Gameplay hooks

```
hooks:
  - hook_id:         hb1.return_transit
    trigger:         player.interact on player_arrival_star
    procedure:       trpc.hellbox.hb1.return_transit
    success_state:   transit_started_to_med_bay
  - hook_id:         hb1.invoke_master_of_rlyeh
    trigger:         player.approach_for_master_of_rlyeh on cathedral_apse.altar
    procedure:       trpc.hellbox.hb1.altar.invoke_master_of_rlyeh
    success_state:   master_of_rlyeh_question_active = true (faction-radial-menu UI shows)
  - hook_id:         hb1.commit_faction_answer
    trigger:         (state-conditional) player commits faction answer in radial menu
    procedure:       trpc.hellbox.hb1.faction_answer.commit
    success_state:   faction_answer_committed = <faction>; faction_pull recorded
  - hook_id:         hb1.greet_child
    trigger:         player.greet on child_npc_anchor.<id>
    procedure:       trpc.hellbox.hb1.child_npc.<id>.greet
    success_state:   child_greeted = true (per-child)
  - hook_id:         hb1.converse_child
    trigger:         player.converse on child_npc_anchor.<id>
    procedure:       trpc.hellbox.hb1.child_npc.<id>.converse
    success_state:   child_dialogue_unlocked = true (per-child)
  - hook_id:         hb1.hug_child
    trigger:         (state-conditional) player.hug on child_npc_anchor.<id>
    procedure:       trpc.hellbox.hb1.child_npc.<id>.hug
    success_state:   child_hugged = true (per-child; emotional lore-flag)
  - hook_id:         hb1.read_relief
    trigger:         player.inspect on cathedral_apse.relief.children_eternal
    procedure:       trpc.hellbox.hb1.relief.inspect
    success_state:   relief_read = true (multi-screen lore)
  - hook_id:         hb1.read_chalkboard
    trigger:         player.inspect on east.chalkboard.lesson or west.chalkboard.attendance
    procedure:       trpc.hellbox.hb1.chalkboard.read
    success_state:   chalkboard_read = true (per-board; varies by player state)
  - hook_id:         hb1.use_playground
    trigger:         player.interact on playground.swing_set / .slide / .jungle_gym / .sandbox
    procedure:       trpc.hellbox.hb1.playground.use
    success_state:   playground_used = true (per-equipment; emotional lore-flag)
  - hook_id:         hb1.converse_principal
    trigger:         player.converse on school_principal_anchor
    procedure:       trpc.hellbox.hb1.principal.converse
    success_state:   principal_dialogue_unlocked = true
  - hook_id:         hb1.read_flagpole
    trigger:         player.inspect on flagpole_central
    procedure:       trpc.hellbox.hb1.flagpole.read
    success_state:   flagpole_read = true
```

### H.1.14 Story-tie

```
primary_arcs:
  - arc.act_1_first_HB1_invocation
  - arc.act_1_master_of_rlyeh_first_question
  - arc.cumulative_grief (continuous; updates Hellbox content per dead crew)
  - arc.fallen_crew (cross-ref; child-form NPCs)
per_act_evolution:
  act_1: room first invocable; first child-greet; first Master of R'lyeh question
  acts_2_4: more child-NPCs as more crew die; relief grows; player's faction-pull deepens with each visit
  act_5: deeper conversations with children possible; principal's full lore reveals
  act_6: rare child-form revelations (some children reveal hidden truths about their adult-life that the player didn't know)
  act_7: state-branched: deep-grief ending (child relief is full + warm; player has wept here often) vs. cold-grief ending (relief sparse + cold; player has minimised visits)
npc_roster:
  - 6-8 child-form versions of dead crew (varies by playthrough; updates dynamically)
  - the_school_principal: pre-Ark elder; cathedral altar anchor
  - rare_courtyard_visitors: cosmetic NPCs (other children playing)
  - the_master_of_rlyeh: voice-only at altar during faction-answer moments
readables:
  - cathedral relief (children eternal; multi-screen lore; updates per death)
  - east + west chalkboards (lesson + attendance)
  - flagpole inscription
  - 8 classroom doors (per-grade lore previews)
  - cathedral altar inscription
master_of_rlyeh_question: "When the body fails, does the self?"
faction_answers: per §3.12.3 (Architect Remnants / New Babylon / Hierarchy / Insurgency / Dreamers Children — Dreamers Children strongest pull)
```

### H.1.15 Special-FX

```
particle_systems:
  - dust_motes (medium; magical golden-hour shimmer)
  - chalk_dust (low; rises from chalkboards on use)
  - leaves_drift (medium; perpetual autumn leaves)
  - bee_drift (very low; cosmetic)
  - cathedral_dust (low; visible in stained-glass light shafts)
  - return_transit_petals (one-shot during transit cutscenes)
  - master_of_rlyeh_resonance (state-conditional during answer moments)
volumetric_effects:
  - sunlight_volumetric_envelope (golden-hour cone-cascade across courtyard)
  - cathedral_stained_glass_volumetric_beams (8 dramatic light shafts)
  - bell_tower_subtle_glow (warm gold halo)
  - master_of_rlyeh_voice_radiance (state-conditional; subtle volumetric glow at altar)
procedural_animations:
  - sunlight_continuous_drift (very slow; matches "eternal afternoon")
  - children_play_loops (multiple; each child has 3-5 idle behaviours that loop)
  - bell_toll_visualisation (each toll causes brief bell-shape pulse from tower)
  - flag_subtle_ripple (faint wind)
  - leaves_continuous_fall (eternal autumn)
  - cathedral_relief_subtle_animation (figures in relief subtly shift posture; uncanny)
  - clock_face_frozen (clock visibly frozen at 2:47; only second-hand ticks impossibly slowly)
reactive_systems:
  - children_turn_to_greet_on_player_proximity (within 3 m, child-NPCs face player)
  - chalkboard_lesson_changes_on_player_emotional_state (lesson text updates based on cumulative grief level)
  - relief_adds_figure_on_new_canonical_death (one-shot per death event)
  - master_of_rlyeh_altar_glow_on_proximity (within 5 m of altar, altar glow blooms)
  - playground_equipment_warmth_on_use (subtle thermal feedback)
```

### H.1.16 Avatar-parametricity

```
camera_height_variation:
  small_xenomorph (0.85m eye): camera height 0.85m; child-NPCs at near-eye-height (intimate); cathedral feels even more impossibly tall
  short_humanoid (1.40m eye): standard short scale; child-NPCs slightly below eye-level
  average_humanoid (1.70m eye): standard
  tall_humanoid (2.05m eye): comfortable; child-NPCs feel small (intentional emotional weight)
  tall_xenomorph (2.70m eye): some courtyard items (lamp posts) at near-head; alternate route around playground
reachability:
  small_xenomorph: cannot reach top of jungle gym (3.00 m); alternate climb-assist
  small_xenomorph: cannot reach top of stained-glass windows (z = 30+); inspect-from-below
  others: all-reachable
audio_occlusion_variation:
  xenomorph_sensitive_hearing: children's laughter overwhelming; cathedral choir more pronounced
  synthetic_voice_avatar: child-NPC greetings have subtle synthetic-resonance bias (uncanny for non-organic player)
```

### H.1.17 Performance

```
polygon_budget:      650,000 polygons (large perceptual scale + many NPCs + cathedral apse architecture is expensive)
texture_budget:      400 MB total (stained glass + child-NPC unique textures + cathedral materials)
light_count_limit:   28 simultaneous dynamic lights (sunlight + 12 stained-glass + 4 lamp posts + various practical sources)
lod_plan:
  - hero_distance: 0-15m, full detail (immediate courtyard)
  - mid_distance: 15-35m, mid detail (cathedral relief simplified; children further away as billboards; classroom doors as silhouettes)
  - long_distance: 35m+, low detail (bell tower as silhouette; perceptual sky as skybox)
streaming_behaviour:
  - preload: ark.med_bay (host room)
  - on_classroom_door_approach: preload that classroom sub-space (gameplay-deferred)
  - on_cathedral_traverse: preload cathedral apse fully (already partially loaded as continuous space)
```

---

## H.2 Castle of Death (HB2 — Hierarchy Throne gateway)

**Status: FULL spec.** Cross-ref `INCEPTION_ARK_FINAL_PRODUCTION.md`
§3.12.4 for cosmology + transit + faction answers.

### H.2.1 Header

```
space_id:        hellbox.castle_of_death
space_name:      Castle of Death
space_type:      hellbox_interior  (Matrix-of-Dreams destination; faction-locked Hierarchy)
act_introduced:  Act 5  (faction-locked Hierarchy alignment)
host_room:       ark.hierarchy_throne (offering kneel gateway)
lore_anchor:     loredex.system.castle_of_death + arc.hierarchy_devotion + loredex.character.master_of_rlyeh + arc.demon_summoning
aesthetic_tier:  wagner_baroque  (vast Wagnerian-baroque death-castle; the most monumental Hellbox interior)
```

### H.2.2 Geometry

```
dimensions:           96.00 m × 72.00 m × 36.00 m  (perceptual; bigger-on-inside ratio 9× external Hierarchy Throne footprint)
origin_point:         centre of central Sanctum of the First Death (where the player materialises after transit)
coordinate_axes:      +x = right, +y = forward (north — toward apsidal Throne of Mercy), +z = up
floor_plan_geometry:  non_euclidean  (central Sanctum of the First Death + radiating wings: north apsidal Throne of Mercy + west Hall of Acknowledged Debts + east Chamber of the Forgotten + south Forgive-or-Damn Tribunal + outer ring of 15 minor chambers — most deferred)
volumetric_anomalies:
  - bigger_on_inside ratio: 9× external Hierarchy Throne footprint
  - apsidal_extends_up: Throne of Mercy at north extends to z = 60+ perceptual; throne itself at z = 8.00 on raised dais
  - perpetual_dusk: continuous twilight throughout (no day/night cycle); shadows are deep + long
  - bells_audible_from_everywhere: deep bell-toll period 60s; audible from any chamber
  - corridors_are_longer_than_they_should_be: walking from Sanctum to any wing-chamber takes ~2× perceived distance (intentional disorientation)
```

The Castle of Death is the Hierarchy faction's deepest cosmological
expression — a vast Wagnerian-baroque death-castle where the
ritualised sacrifice of mercy IS the architecture. Central
Sanctum of the First Death is a hexagonal hall with a black-marble
floor inscribed with the Hierarchy's full death-creed. North
apsidal extends impossibly into the Throne of Mercy chamber. Four
wing-chambers radiate from the Sanctum, each focused on a different
aspect of mercy/death: Acknowledged Debts (west), the Forgotten
(east), Forgive-or-Damn Tribunal (south), and Throne of Mercy
(north — the apse). Demon-summoning mechanics happen at the
central Sanctum altar.

Floor area (perceptual): central Sanctum ~480 m²; 4 primary wings
~280 m² each; total across primary spaces ~1,600 m² + 15 deferred
minor chambers.

### H.2.3 Floor

```
material_primary:     polished black-and-blood-red marble in inscribed pattern; 0.80 × 0.80 m tiles; the inscriptions form the full Hierarchy death-creed visible only when carefully read
material_secondary:   gold-leaf inlay forming a 6-pointed mercy-mandala at the Sanctum centre (3.00 m diameter; player materialises here); brass perimeter trim along all walls
pattern:              inscribed marble + central mercy-mandala + radial path inlays toward each wing-chamber (4 radial paths from Sanctum)
wear_state:           pristine (sacred); slight wear at most-used radial paths; central mercy-mandala shows ritual-pattern of feet (player + others who have stood here through canonical history)
embedded_features:
  - id: hellbox.castle_of_death.floor.charge_point.player_arrival_mandala
    position: (0.00, 0.00, 0.00)  # at Sanctum centre
    dimensions: 0.40 × 0.40 × 0.05
    function: arrival-anchor + return-transit invocation
  - id: hellbox.castle_of_death.floor.altar_anchor.central_sanctum
    position: (0.00, 8.00, 0.00)  # at Sanctum north end (between centre and apse)
    dimensions: 0.60 × 0.60 × 0.10
    function: central altar — Master of R'lyeh anchor + demon-summoning ritual point
  - id: hellbox.castle_of_death.floor.wing_threshold.<wing>  (4 thresholds; one per wing-chamber)
    position: north (0.00, 16.00), east (16.00, 0.00), south (0.00, -16.00), west (-16.00, 0.00) all z = 0.00
    dimensions: 4.00 × 0.30 × 0.10 each
    function: wing-chamber entry threshold
  - id: hellbox.castle_of_death.floor.minor_chamber_threshold.<n>  (15 minor-chamber thresholds; deferred)
    position: along outer-ring perimeter
    dimensions: 1.40 × 0.20 × 0.10 each
    function: minor-chamber entry threshold (deferred sub-spaces)
acoustic_property:    hard_reflective (marble); RT60 = 1.20s (very long; cathedral-resonance + bell-decay; supports chant-voice)
```

### H.2.4 Walls

The Castle of Death has a hexagonal central Sanctum + 4 primary
wing-chambers + outer ring. Specced per zone.

#### Central Sanctum of the First Death (hexagonal central hall)

```
wall_id:              sanctum_perimeter  (6 hexagonal faces; each leads to a wing-chamber or minor-chamber)
material_primary:     polished black-marble cladding with deep-relief carved figures (Hierarchy death-canon scenes; figures of mercy-givers + mercy-receivers)
material_secondary:   bronze dado at z = 1.20 m, ornately cast with serpent-and-mercy motif; brass cresting at z = 5.00 m
panelisation:         hexagonal corners + wing-chamber archways
colour_value:         --token-color-hellbox-castle-of-death-sanctum  (deep charcoal-black + blood-red marble + bronze + gold accents)
embedded_displays:
  - id: hellbox.castle_of_death.sanctum.south.display.death_register
    position: (0.00, -8.00, 1.80)  # south side, near south wing entrance
    dimensions: 1.20 × 0.80 × 0.05
    content: continuously-updating registry of canonical deaths in player's playthrough; cross-ref with Med Bay HB1 child-NPC roster
embedded_doors:
  - door_id: hellbox.castle_of_death.sanctum.south.door.return_threshold
    position: (0.00, 0.00, 0.005)  # at arrival mandala; cosmological return
    dimensions: n/a (cosmological; not physical)
    door_class: portal
    connecting_space_id: ark.hierarchy_throne (host room)
  - door_id: hellbox.castle_of_death.sanctum.north.archway.throne_of_mercy
    position: (0.00, 16.00, 0.00)
    dimensions: 6.00 × 12.00 × 0.30  (massive archway; cathedral begins beyond)
    door_class: portal  (open passage with deep shadow + cold-air-bleed)
    connecting_space_id: hellbox.castle_of_death.throne_of_mercy_apse
  - door_id: hellbox.castle_of_death.sanctum.east.archway.chamber_of_forgotten
    position: (16.00, 0.00, 0.00)
    dimensions: 4.00 × 8.00 × 0.30
    door_class: portal
    connecting_space_id: hellbox.castle_of_death.chamber_of_the_forgotten
  - door_id: hellbox.castle_of_death.sanctum.south.archway.tribunal
    position: (0.00, -16.00, 0.00)
    dimensions: 4.00 × 8.00 × 0.30
    door_class: portal
    connecting_space_id: hellbox.castle_of_death.forgive_or_damn_tribunal
  - door_id: hellbox.castle_of_death.sanctum.west.archway.hall_of_debts
    position: (-16.00, 0.00, 0.00)
    dimensions: 4.00 × 8.00 × 0.30
    door_class: portal
    connecting_space_id: hellbox.castle_of_death.hall_of_acknowledged_debts
  - door_id: hellbox.castle_of_death.sanctum.outer_ring.minor_chamber.<n>  (15 minor archways; deferred sub-spaces)
    position: along hex outer-ring perimeter at varied angles
    dimensions: 2.40 × 4.00 × 0.20 each
    door_class: arch
    connecting_space_id: hellbox.castle_of_death.minor_chamber.<id>  (15 sub-spaces; deferred from FULL spec — major chambers below cover canonical narrative)
decorative_features:
  - id: hellbox.castle_of_death.sanctum.south.plaque.creed
    position: (0.00, -10.00, 4.50)  # high above south wall
    dimensions: 4.00 × 1.20 × 0.20
    material: cast bronze with deep-etched proto-Latin text + gold inlay
    narrative_role: reads the full Hierarchy death-creed: "MERCY IS A SACRAMENT / DEBT IS A SACRAMENT / DEATH IS A SACRAMENT / WHAT WE HAVE IS WHAT WE HAVE GIVEN"
  - id: hellbox.castle_of_death.sanctum.relief_pattern.death_canon  (6 reliefs around hex perimeter; one per wall)
    position: per hex face at z = 6.00
    dimensions: 6.00 × 2.40 × 0.30 each
    material: cast bronze with deep relief; gilt highlights
    narrative_role: 6 canonical death-scenes (the first death / the mercy-given death / the debt-paid death / the forgotten death / the forgiven death / the eternal death)
```

#### Throne of Mercy Apse (north wing — the apsidal hall)

```
wall_id:              throne_of_mercy_apse  (curved apsidal; impossibly tall)
material_primary:     polished black-marble cladding (curved); ribbed bronze structural detail; impossibly tall (z = 60+ perceptual)
material_secondary:   gold-leaf trim around ribs; deep crimson velvet drapery between ribs
panelisation:         apsidal — single curved + ribbed surface
colour_value:         --token-color-hellbox-castle-of-death-throne-apse  (deep charcoal + crimson velvet + gold + bronze)
embedded_displays:    none (the relief + throne are the content)
embedded_doors:        none (no exits from apse; only the south archway back to Sanctum)
decorative_features:
  - id: hellbox.castle_of_death.throne_of_mercy_apse.relief
    position: (0.00, 32.00, 12.00)  # high north apse
    dimensions: 8.00 × 6.00 × 0.30 (deep relief)
    material: cast bronze with gilt + jewel inlays
    narrative_role: depicts a robed figure (the Master of Mercy) offering mercy to a kneeling supplicant; the supplicant is canonically the player; the relief subtly shifts to reflect player's accumulated mercy-acts
  - id: hellbox.castle_of_death.throne_of_mercy
    position: (0.00, 32.00, 8.00)  # raised dais; 8.00 m above Sanctum floor
    dimensions: 4.00 × 3.00 × 6.00 (throne + dais; oversized)
    material: cast bronze with gilt detailing; black-velvet upholstery on seat + backrest; white-marble armrests
    narrative_role: THE Throne of Mercy; symbolic; the Master of Mercy sits here (canonically; rarely visible — usually empty or shadowed); during faction-answer commitment moments, the throne becomes inhabited
  - id: hellbox.castle_of_death.throne_of_mercy_apse.dais_steps  (12 steps from Sanctum floor to throne)
    position: (0.00, 24.00 to 32.00, 0.00 to 8.00)
    dimensions: ~12 steps; each 0.40 m run × 0.67 m rise
    material: polished black marble with gold-inlay step nosing
    narrative_role: the player must climb to reach the throne; the climb itself is symbolic
```

#### Hall of Acknowledged Debts (west wing)

```
wall_id:              hall_of_debts_perimeter  (rectangular wing; 16.00 × 12.00 m)
material_primary:     polished black-marble + bronze ledger-shelving (full-height; covers all walls); each ledger-shelf holds bronze ledgers
material_secondary:   bronze dado; brass ledger-spines visible
panelisation:         continuous shelving except for archway entrance (east) + ritual altar (west wall)
colour_value:         --token-color-hellbox-castle-of-death-hall-debts  (deep charcoal + bronze + faint gold-glint from ledgers)
decorative_features:
  - id: hellbox.castle_of_death.hall_of_debts.ledger_walls
    position: distributed across all walls
    dimensions: continuous shelving; ~1,000 ledgers visible; each ~0.40 × 0.05 × 0.30
    material: cast bronze ledger-spines with gilt-engraved name + amount on each
    narrative_role: registry of all acknowledged debts (canonical pre-Ark + Ark cumulative); player can pull a ledger to inspect
  - id: hellbox.castle_of_death.hall_of_debts.altar_west
    position: (-12.00, 0.00, 0.00)
    dimensions: 1.20 × 0.80 × 1.10
    material: polished black granite with gold-leaf rim; bronze ledger-stand on top
    narrative_role: where the player can place a debt-acknowledgement; gameplay-active
```

#### Chamber of the Forgotten (east wing)

```
wall_id:              chamber_of_forgotten_perimeter  (rectangular wing; 16.00 × 12.00 m)
material_primary:     polished black-marble + bronze portrait-frames (full-height; covers all walls); each frame holds a portrait — but the portraits are EMPTY (canonically: the names are lost; only the frames remain)
material_secondary:   bronze dado; brass portrait-cord visible
panelisation:         continuous portrait-frame walls except for archway entrance (west)
colour_value:         --token-color-hellbox-castle-of-death-chamber-forgotten  (deep charcoal + bronze frames + dim cold-grey paintings)
decorative_features:
  - id: hellbox.castle_of_death.chamber_of_forgotten.empty_portraits
    position: distributed across all walls
    dimensions: ~200 empty portrait-frames; each ~0.60 × 0.05 × 0.80
    material: cast bronze frames with empty canvases
    narrative_role: every forgotten dead — names lost to time; player can "remember" by stating a name; doing so fills one portrait
  - id: hellbox.castle_of_death.chamber_of_forgotten.altar_east
    position: (16.00, 0.00, 0.00)  # east-most; altar of remembrance
    dimensions: 1.20 × 0.80 × 1.10
    material: polished black granite + bronze + small candle-flame
    narrative_role: where the player names a forgotten one; gameplay-active
```

#### Forgive-or-Damn Tribunal (south wing)

```
wall_id:              tribunal_perimeter  (rectangular wing; 16.00 × 12.00 m)
material_primary:     polished black-marble with judicial-formal architecture; central raised tribunal-platform with 7 jurist-seats
material_secondary:   bronze dado; gold-leaf rim around tribunal; crimson velvet drapery framing the platform
panelisation:         tribunal architecture
colour_value:         --token-color-hellbox-castle-of-death-tribunal  (deep charcoal + bronze + crimson + gold)
decorative_features:
  - id: hellbox.castle_of_death.tribunal.platform
    position: (0.00, -24.00, 0.40)  # raised 0.40 m above floor
    dimensions: 8.00 × 6.00 × 0.40 (platform)
    material: polished black marble + crimson velvet upholstery on jurist seats
    narrative_role: where the 7 jurists sit; player addresses them when seeking forgiveness or damnation for canonical figures
  - id: hellbox.castle_of_death.tribunal.jurist_chairs.<n>  (7 jurist chairs on platform)
    position: distributed on platform
    dimensions: 0.90 × 0.90 × 1.50 each
    material: cast bronze frame + crimson velvet
    narrative_role: 7 jurists; each is a faction-aligned NPC (one per major faction + 2 cosmic visitors)
  - id: hellbox.castle_of_death.tribunal.player_lectern
    position: (0.00, -16.00, 0.00)  # facing platform
    dimensions: 0.40 × 0.30 × 1.20
    material: cast bronze + walnut + leather inset
    narrative_role: where the player stands to plead; gameplay-active during forgive-or-damn rituals
```

### H.2.5 Ceiling

```
height_above_floor:     central Sanctum: 24.00 m baseline + apsidal vault rises to 60+ perceptual (Throne of Mercy apse); wing-chambers: 12.00 m baseline + 16.00 m vaulted apex
material:               polished black-marble cladding with bronze rib detailing radiating from oculus-positions; central Sanctum has hexagonal coffered ceiling
lighting_integrated:    hexagonal central oculus over Sanctum (deep red + amber light); chandelier clusters in each wing; deep amber sconces along wing walls; throne-apse stained glass at impossibly-high windows
atmospheric_features:   incense smoke pools at Sanctum vault apex (rises continuously from 6 censers); subtle frostbreath visible in cold zones; bell-toll visualisation pulses
acoustic_treatment:     coffered + apsidal echo at Throne; wing-chambers have warmer reverb (less dampening)
```

### H.2.6 Lighting

```
ambient_baseline:     1800 K (extremely warm; candle-and-firelight; perpetual dusk); 60 lux at floor (very dim — gravity); CRI 75 (low; intentionally warm-bronze palette)
direct_fixtures:
  - id: hellbox.castle_of_death.sanctum.oculus_central
    position: (0.00, 0.00, 24.00)
    beam_angle: 60° downward
    colour: --token-color-hellbox-castle-of-death-sanctum-oculus  (deep red-amber; pulses with bell-toll)
    intensity: 6000 lumens
    function: principal Sanctum illumination; pulses with bell-toll
  - id: hellbox.castle_of_death.throne_of_mercy_apse.dome_emitter
    position: (0.00, 32.00, 30.00)
    beam_angle: 90° downward
    colour: --token-color-hellbox-castle-of-death-throne-apse  (warm gold-red; intensifies during faction-answer moments)
    intensity: 8000 lumens (variable)
    function: throne-apse light; symbolic
  - id: hellbox.castle_of_death.sanctum.chandelier.<n>  (6 hanging chandeliers in hexagonal pattern around oculus at z = 16.00)
    position: distributed
    beam_angle: 270°
    colour: warm amber; 4000 lumens each
    function: ambient ritual atmosphere
  - id: hellbox.castle_of_death.wing_chandelier.<wing>  (4 wing chandelier-clusters; one central per wing-chamber)
    position: per wing centre at z = 8.00
    beam_angle: 270°
    colour: warm amber per wing (slight variation per aspect)
    intensity: 3500 lumens each
    function: wing-chamber ambient
practical_sources:
  - id: hellbox.castle_of_death.sanctum.censer.<n>  (6 censers in hex pattern around Sanctum at radius 5.00 m)
    position: per censer base at z = 0.00, top z = 1.40
    intensity: 80 lumens each (warm candle-flame; smoke continuous)
    flicker_pattern: organic
  - id: hellbox.castle_of_death.sanctum.altar_glow
    position: (0.00, 8.00, 1.10)  # central altar
    intensity: 200 lumens (variable; pulses with R'lyeh resonance)
    flicker_pattern: deeply slow pulse
  - id: hellbox.castle_of_death.throne_of_mercy_glow
    position: (0.00, 32.00, 9.00)  # throne seat backlight
    intensity: 400 lumens (variable; intensifies during answer-moments)
    flicker_pattern: stable with pulse on faction-answer
time_of_day_variation:
  acts_5_to_7: stable perpetual dusk; intensifies during ritual events; in late-act7, if player has fully Hierarchy-aligned, throne becomes visibly inhabited
dynamic_response:
  - on_player_arrival: oculus pulses dramatically; central altar illuminates
  - on_master_of_rlyeh_question_invocation: throne-apse glow blooms; oculus pulse synchronises with player's heartbeat
  - on_demon_summoning: forge-fire flares through Sanctum from a manifestation point; ambient intensifies briefly
  - on_faction_answer_commit: relevant wing-chandelier intensifies + central altar flames briefly
```

### H.2.7 Atmosphere

```
air_temperature:    16°C (cold — death-cosmology); colder in Chamber of Forgotten (12°C) and warmer near Throne (18°C from braziers)
humidity:           42% RH; smells of incense (frankincense + myrrh + something darker — death-incense) + cold-stone + faint blood + bronze + warm-wax
particulate:
  - incense_smoke: high (6 censers + 4 wing braziers); rises continuously through chimneys
  - cold_breath_motes: very low (visible breath in cold zones)
  - candle_smoke: medium
  - dust: very low (sacred; meticulously maintained)
  - ritual_residue_motes: state-conditional (during demon-summoning + answer-moments)
volumetric_fog:     present at Sanctum vault apex (incense pool); 0.30 g/m³, warm-amber; intensifies during rituals
wind_drift:         very faint; 0.04 m/s; cold convection toward sanctum centre
smell_canon:        incense + cold-stone + bronze + blood + wax; voice-line: "smells like the world's first goodbye"
```

### H.2.8 Sound

```
ambient_bed:           file: castle_of_death_ambient_bed_v1.ogg (loop); -28 dB; deep continuous chant (Hierarchy-faction proto-Latin chants), distant bell-toll period 60s, censer-burn crackles, cold-wind whistle
point_sources:
  - id: hellbox.castle_of_death.sanctum.oculus_resonance
    position: (0.00, 0.00, 24.00)
    sound: deep cosmic harmonic resonance (continuous, -30 dB; pulses with bell-toll)
    occlusion_behaviour: omnidirectional
    trigger: continuous
  - id: hellbox.castle_of_death.bell_toll
    position: (0.00, 32.00, 50.00)  # impossibly above Throne apse
    sound: deep bell-toll (period 60s; -22 dB per toll)
    occlusion_behaviour: omnidirectional
    trigger: cyclic
  - id: hellbox.castle_of_death.distant_chants
    position: distributed around Sanctum perimeter
    sound: faint Hierarchy chants (Latin proto-language; -32 dB)
    occlusion_behaviour: omnidirectional
    trigger: continuous (cycles through ritual hours)
  - id: hellbox.castle_of_death.censer_burn.<n>  (6 censers)
    position: per censer
    sound: incense-burn crackle (-36 dB each)
    occlusion_behaviour: standard
    trigger: continuous
  - id: hellbox.castle_of_death.sanctum.altar_subtle_resonance
    position: (0.00, 8.00, 0.00)
    sound: subtle harmonic hum (continuous, -38 dB; intensifies during R'lyeh moments)
    occlusion_behaviour: omnidirectional
    trigger: continuous
  - id: hellbox.castle_of_death.master_of_rlyeh_voice
    position: (0.00, 8.00, 1.10)  # at central altar; secondary anchor at Throne
    sound: Master of R'lyeh's voice per §3.12.2
    occlusion_behaviour: omnidirectional
    trigger: state-conditional
  - id: hellbox.castle_of_death.demon_manifestation_resonance
    position: (0.00, 8.00, 0.00)  # at altar during demon-summon
    sound: low rumble + air-rush + demon vocalisation (per §3.1.A.4)
    occlusion_behaviour: omnidirectional
    trigger: state-conditional
reverb_zone:           IR-impulse: castle_of_death_v1.wav; wet-mix 42% (very long; cathedral-monumental)
music_eligibility:     ambient music ALLOWED — Hierarchy choral pad at -32 dB throughout; intensifies during ritual events
voice_line_eligibility:
  - speaker: hierarchy_priest_of_death (named NPC; primary occupant): line set §H.2-specific
  - speaker: 7 tribunal jurists (rotating): line set §H.2-specific (one per faction + 2 cosmic visitors)
  - speaker: chant_voices_distant: continuous proto-Latin chants
  - speaker: master_of_rlyeh: state-conditional at altar + throne
  - speaker: demon_voice (per summoning): state-conditional during demon-summoning
```

### H.2.9 Object inventory

Castle of Death has 88 inventory objects (excluding 15 deferred
minor-chamber sub-spaces).

#### H.2.9.1 The Player Arrival Mandala (Sanctum centre)

```
object_id:           hellbox.castle_of_death.player_arrival_mandala
object_class:        fx_emitter  (also gameplay-anchor)
position:            (0.00, 0.00, 0.005)
dimensions:          3.00 dia × 0.005
rotation:            0°
material_primary:    gold-leaf inlay forming a 6-pointed mercy-mandala
material_secondary:  bronze perimeter ring with engraved death-creed
colour_value:        --token-color-hellbox-castle-of-death-mandala  (deep gold + bronze)
interaction:         interactable
  - return_to_hierarchy_throne: invoke return-transit (~5s ceremonial fade back to ark.hierarchy_throne)
  - inspect: reads the mandala's death-creed (multi-screen)
narrative_role:      THE arrival point + return-transit invocation
lore_anchor:         arc.return_transit + arc.hierarchy_devotion
art_status:          producer_handoff
gameplay_hook_id:    trpc.hellbox.hb2.return_transit
wear_state:          slight wear at most-walked positions (centuries of supplicants)
physical_constraints: non-collide; player-step-on triggers warmth pulse
```

#### H.2.9.2 The Central Sanctum Altar (Master of R'lyeh + demon-summon anchor)

```
object_id:           hellbox.castle_of_death.sanctum_altar_central
object_class:        interactive  (also fx_emitter; also npc_anchor — Master of R'lyeh voice)
position:            (0.00, 8.00, 0.00)
dimensions:          2.40 × 1.40 × 1.10
rotation:            0°
material_primary:    polished black granite with inlaid gold-cross + gold-leaf rim
material_secondary:  cast-bronze altar-cloth holder; cast-bronze candle-stand at corners (4 black wax candles burning eternally); central recessed offering bowl
colour_value:        --token-color-hellbox-castle-of-death-altar
interaction:         interactable
  - approach_for_master_of_rlyeh: triggers "Is mercy a debt, or a gift?" delivery (one-shot Act 5 first invocation; re-invocable per visit)
  - place_offering: player commits an offering (item from inventory); offering consumed by altar with brief intense flame
  - invoke_demon_summon: when conditions met (player has placed sufficient offerings + has demon-summon contract), triggers full demon-summoning sequence (per §3.1.A.4)
  - inspect: lore-note about altar (canonical pre-Ark; received the first ritual-mercy)
narrative_role:      THE central altar; faction-answer commitment + demon-summoning anchor; the room's cosmological heart
lore_anchor:         arc.act_5_HB2_invocation + loredex.character.master_of_rlyeh + arc.demon_summoning
art_status:          producer_handoff
gameplay_hook_id:    trpc.hellbox.hb2.altar.invoke_master_of_rlyeh + .place_offering + .invoke_demon_summon
wear_state:          worn at centre of altar-top (centuries of palms)
physical_constraints: collides; player can lean
```

#### H.2.9.3 The Throne of Mercy

```
object_id:           hellbox.castle_of_death.throne_of_mercy
object_class:        furniture  (also npc_anchor — Master of Mercy NPC)
position:            (0.00, 32.00, 8.00)  # raised dais
dimensions:          4.00 × 3.00 × 6.00 (oversized)
rotation:            180°  (faces south, toward Sanctum)
material_primary:    cast bronze with gilt detailing
material_secondary:  black-velvet upholstery on seat + backrest; white-marble armrests; gold cushion
colour_value:        --token-color-hellbox-castle-of-death-throne  (bronze + gilt + black-velvet + white-marble)
interaction:         interactable
  - approach: cinematic moment; throne becomes visibly inhabited (Master of Mercy materialises silhouette-only); brief dialogue
  - inspect: lore-note about throne (the canonical seat of mercy; centuries of mercy-givers)
narrative_role:      THE throne; symbolic; Master of Mercy NPC anchor (rare visible)
lore_anchor:         loredex.character.master_of_mercy + arc.hierarchy_devotion
art_status:          producer_handoff
gameplay_hook_id:    trpc.hellbox.hb2.throne_of_mercy.approach
wear_state:          slight wear at right armrest (Master is right-handed); cushion permanently indented
physical_constraints: collides
```

#### H.2.9.4 The Throne of Mercy Apsidal Relief

```
object_id:           hellbox.castle_of_death.throne_apse.relief
object_class:        decoration
position:            (0.00, 32.00, 12.00)
dimensions:          8.00 × 6.00 × 0.30
rotation:            180°
material_primary:    cast bronze with gilt + jewel inlays
material_secondary:  none
colour_value:        --token-color-hellbox-castle-of-death-throne-relief  (deep bronze + gilt highlights)
interaction:         inspectable
  - inspect: opens multi-screen lore (the Master of Mercy + a kneeling supplicant — the supplicant is canonically the player; the relief subtly evolves with player's mercy-acts)
narrative_role:      THE relief; visible from Sanctum; cosmologically anchoring
lore_anchor:         arc.hierarchy_devotion + arc.player_mercy_acts
art_status:          producer_handoff
gameplay_hook_id:    trpc.hellbox.hb2.throne_relief.inspect
wear_state:          slight patina; centre figures more polished (centuries of supplicants gazing upward)
physical_constraints: non-collide (at height)
```

#### H.2.9.5-10 Six Sanctum Censers

```
object_id:           hellbox.castle_of_death.sanctum.censer.<n>  (6 censers in hex pattern around Sanctum at radius 5.00 m)
positions:           [
  (0.00, 5.00, 0.00),     # north
  (4.33, 2.50, 0.00),     # NE
  (4.33, -2.50, 0.00),    # SE
  (0.00, -5.00, 0.00),    # south
  (-4.33, -2.50, 0.00),   # SW
  (-4.33, 2.50, 0.00),    # NW
]
dimensions (each):   0.40 × 0.40 × 1.40
rotation:            0°
material_primary:    cast bronze with chains + decorative perforations
material_secondary:  white marble base; brass burner-bowl; gold-inlay rim
colour_value:        --token-color-hellbox-castle-of-death-censer-bronze
interaction:         interactable
  - inspect: lore-note about each censer (carries different proto-Latin meditation)
  - rekindle: gameplay-conditional rekindle if extinguished
narrative_role:      ritual incense; visually + olfactorily anchors Sanctum atmosphere
lore_anchor:         loredex.aesthetic.hierarchy_ritual
art_status:          producer_handoff
gameplay_hook_id:    trpc.hellbox.hb2.censer.rekindle
wear_state:          slight wear; centuries of patina
physical_constraints: collides
```

#### H.2.9.11-16 Six Sanctum Hexagonal Reliefs (one per hex face)

```
object_id:           hellbox.castle_of_death.sanctum.relief.<aspect>  (6 reliefs; one per hex face)
positions:           per hex face at z = 6.00
dimensions (each):   6.00 × 2.40 × 0.30
rotation:            varies (radial; faces inward)
material_primary:    cast bronze with deep relief; gilt highlights
material_secondary:  none
colour_value:        --token-color-hellbox-castle-of-death-sanctum-relief
interaction:         inspectable
  - inspect: opens multi-screen lore (each is a canonical death-scene)
narrative_role:      6 death-canon scenes (the first death / the mercy-given death / the debt-paid death / the forgotten death / the forgiven death / the eternal death)
lore_anchor:         per-aspect canon
art_status:          producer_handoff
gameplay_hook_id:    trpc.hellbox.hb2.sanctum_relief.inspect (per-aspect)
wear_state:          slight patina
physical_constraints: non-collide (at height)
```

#### H.2.9.17 The Hierarchy Priest of Death (NPC anchor)

```
object_id:           hellbox.castle_of_death.hierarchy_priest_anchor
object_class:        npc_anchor
position:            (0.00, 12.00, 0.00)  # near central altar; slightly south
dimensions:          0.80 × 0.80 × 1.80 (anchor)
rotation:            varies (NPC pose-driven)
material_primary:    n/a
material_secondary:  n/a
colour_value:        n/a
interaction:         interactable
  - converse: dialogue with Hierarchy Priest; deep faction-lore reveals
narrative_role:      Hierarchy Priest of Death; primary occupant of Castle; conducts canonical death-rituals
lore_anchor:         loredex.character.hierarchy_priest_of_death + arc.hierarchy_devotion
art_status:          producer_handoff
gameplay_hook_id:    trpc.hellbox.hb2.priest.converse
wear_state:          n/a
physical_constraints: n/a
```

#### H.2.9.18-25 Eight Throne-Apse Stained-Glass Windows

```
object_id:           hellbox.castle_of_death.throne_apse.stained_glass.<n>  (8 windows; impossibly tall)
positions:           distributed in apse from z = 24 to z = 56
dimensions (each):   2.00 × 4.00 × 0.05 each
material_primary:    stained-glass depicting Hierarchy mercy-canon scenes (in dramatic baroque style)
material_secondary:  bronze frames + lead came
colour_value:        per-window (warm amber + crimson + gold + cyan)
interaction:         inert (visible only from apse)
narrative_role:      cathedral atmosphere; bleed dramatic light shafts onto throne
lore_anchor:         loredex.aesthetic.wagner_baroque
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          weathered (intentional aesthetic)
physical_constraints: non-collide (at height)
```

#### H.2.9.26-31 Throne Dais Steps (12 steps)

```
object_id:           hellbox.castle_of_death.throne_apse.dais_step.<n>  (12 steps)
positions:           sequential at z = 0.00 to 8.00
dimensions (each):   varied; 6.00 × 0.40 × 0.67 each
rotation:            0°
material_primary:    polished black marble with gold-inlay step nosing
material_secondary:  none
colour_value:        --token-color-hellbox-castle-of-death-dais
interaction:         interactable (player can climb)
narrative_role:      symbolic ascent; player must climb 12 steps to reach throne
lore_anchor:         arc.hierarchy_devotion
art_status:          producer_handoff
gameplay_hook_id:    none (movement)
wear_state:          worn at most-used positions
physical_constraints: collides; climbable
```

#### H.2.9.32-35 Hall of Acknowledged Debts — 4 key elements

```
object_id:           hellbox.castle_of_death.hall_of_debts.altar_west
object_class:        interactive
position:            (-12.00, 0.00, 0.00)  # west wing, west wall
dimensions:          1.20 × 0.80 × 1.10
rotation:            90°
material_primary:    polished black granite + gold-leaf rim
material_secondary:  bronze ledger-stand on top
colour_value:        --token-color-hellbox-castle-of-death-altar-west
interaction:         interactable
  - place_debt_acknowledgement: player names a debt (canonical or personal; gameplay-active)
  - inspect: lore-note about altar
narrative_role:      where player commits debt-acknowledgement; gameplay-active
lore_anchor:         arc.hierarchy_devotion
art_status:          producer_handoff
gameplay_hook_id:    trpc.hellbox.hb2.hall_debts.altar.acknowledge
wear_state:          worn at altar-centre
physical_constraints: collides

object_id:           hellbox.castle_of_death.hall_of_debts.ledger_walls (representative)
object_class:        container
position:            distributed around all walls
dimensions:          continuous; ~1,000 ledgers
material_primary:    bronze ledger-spines with gilt-engraved name + amount
material_secondary:  walnut shelving
colour_value:        --token-color-hellbox-castle-of-death-ledger-walls
interaction:         interactable
  - take_ledger: player can pull a ledger to inspect (multi-screen lore; varies per-ledger; ~1,000 unique)
narrative_role:      registry of all canonical pre-Ark + Ark debts; the room IS the registry
lore_anchor:         arc.hierarchy_devotion + cumulative_debt_history
art_status:          producer_handoff
gameplay_hook_id:    trpc.hellbox.hb2.hall_debts.ledger.take
wear_state:          slight wear at most-pulled ledgers
physical_constraints: collides (ledger-fronts)

object_id:           hellbox.castle_of_death.hall_of_debts.scribe_anchor
object_class:        npc_anchor
position:            (-12.00, -2.00, 0.00)  # near west altar
dimensions:          0.80 × 0.80 × 1.80
rotation:            varies
material_primary:    n/a
material_secondary:  n/a
colour_value:        n/a
interaction:         interactable - converse
narrative_role:      The Scribe of Debts; eternally writing in canonical ledgers; player can converse to learn names
lore_anchor:         loredex.character.scribe_of_debts
art_status:          producer_handoff
gameplay_hook_id:    trpc.hellbox.hb2.scribe.converse
wear_state:          n/a
physical_constraints: n/a

object_id:           hellbox.castle_of_death.hall_of_debts.relief.eternal_ledger
object_class:        decoration
position:            (-14.00, 0.00, 6.00)  # high on west wall
dimensions:          2.40 × 1.20 × 0.20
rotation:            90°
material_primary:    cast bronze
material_secondary:  none
colour_value:        --token-color-hellbox-castle-of-death-relief
interaction:         inspectable
narrative_role:      depicts a robed scribe writing in an infinite ledger; lore-readable
lore_anchor:         arc.hierarchy_devotion
art_status:          producer_handoff
gameplay_hook_id:    trpc.hellbox.hb2.hall_debts.relief.read
wear_state:          slight patina
physical_constraints: non-collide
```

#### H.2.9.36-39 Chamber of the Forgotten — 4 key elements

```
object_id:           hellbox.castle_of_death.chamber_of_forgotten.altar_east
object_class:        interactive
position:            (16.00, 0.00, 0.00)  # east wing, east wall
dimensions:          1.20 × 0.80 × 1.10
rotation:            270°
material_primary:    polished black granite + bronze + small candle-flame
material_secondary:  cast bronze name-plate
colour_value:        --token-color-hellbox-castle-of-death-altar-east
interaction:         interactable
  - name_a_forgotten: player names a canonical-forgotten one (gameplay-active; fills a portrait)
  - inspect: lore-note
narrative_role:      where player remembers the forgotten; gameplay-active
lore_anchor:         arc.hierarchy_devotion + arc.fallen_crew
art_status:          producer_handoff
gameplay_hook_id:    trpc.hellbox.hb2.chamber_forgotten.altar.name
wear_state:          slight wear at centre
physical_constraints: collides

object_id:           hellbox.castle_of_death.chamber_of_forgotten.empty_portraits (representative)
object_class:        decoration  (also fx_emitter — fills as player names)
position:            distributed across all walls
dimensions:          ~200 frames; each 0.60 × 0.05 × 0.80
material_primary:    cast bronze frames with empty canvases
material_secondary:  none
colour_value:        --token-color-hellbox-castle-of-death-empty-portraits
interaction:         inspectable
  - inspect: each frame; before naming, inspect shows "FORGOTTEN" + cold-grey canvas; after naming, frame holds a portrait
narrative_role:      every forgotten dead; cumulative gameplay-driven content
lore_anchor:         arc.fallen_crew
art_status:          producer_handoff
gameplay_hook_id:    trpc.hellbox.hb2.chamber_forgotten.portrait.inspect
wear_state:          n/a
physical_constraints: non-collide

object_id:           hellbox.castle_of_death.chamber_of_forgotten.candle_array  (continuous along east wall)
object_class:        interactive  (also fx_emitter)
position:            distributed along east wall at z = 0.50
dimensions:          continuous strip; ~50 candles
material_primary:    cast bronze stand + ivory wax candles
material_secondary:  none
colour_value:        --token-color-hellbox-castle-of-death-candle
interaction:         interactable
  - light_candle: light candle in honour of a forgotten one (gameplay-active; pairs with naming)
narrative_role:      light + warmth for the forgotten
lore_anchor:         arc.fallen_crew
art_status:          producer_handoff
gameplay_hook_id:    trpc.hellbox.hb2.chamber_forgotten.candle.light
wear_state:          varies per candle
physical_constraints: collides

object_id:           hellbox.castle_of_death.chamber_of_forgotten.relief.no_one_remembers
object_class:        decoration
position:            (16.00, 4.00, 6.00)  # high east wall north end
dimensions:          2.40 × 1.20 × 0.20
rotation:            270°
material_primary:    cast bronze
material_secondary:  none
colour_value:        --token-color-hellbox-castle-of-death-relief
interaction:         inspectable
narrative_role:      reads "WE WHO HAVE NO NAME / REMEMBER US" — cosmologically anchoring
lore_anchor:         arc.hierarchy_devotion + arc.fallen_crew
art_status:          producer_handoff
gameplay_hook_id:    trpc.hellbox.hb2.chamber_forgotten.relief.read
wear_state:          slight patina
physical_constraints: non-collide
```

#### H.2.9.40-49 Forgive-or-Damn Tribunal — 10 key elements

```
object_id:           hellbox.castle_of_death.tribunal.platform
object_class:        furniture
position:            (0.00, -24.00, 0.40)
dimensions:          8.00 × 6.00 × 0.40
rotation:            0°
material_primary:    polished black marble
material_secondary:  crimson velvet drapery framing
colour_value:        --token-color-hellbox-castle-of-death-tribunal-platform
interaction:         inert (jurists' seating)
narrative_role:      raised platform where 7 jurists sit
lore_anchor:         arc.tribunal_canon
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          slight wear at jurist-positions
physical_constraints: collides

object_id:           hellbox.castle_of_death.tribunal.jurist_chair.<faction>  (7 chairs; 5 faction + 2 cosmic)
object_class:        furniture  (also npc_anchor)
positions:           distributed on platform
dimensions (each):   0.90 × 0.90 × 1.50
rotation:            varies (faces player lectern)
material_primary:    cast bronze frame with crimson velvet upholstery + faction-themed accent
material_secondary:  bronze nameplate per jurist
colour_value:        per-faction (5 faction tokens + 2 cosmic tokens)
interaction:         interactable - jurists converse during forgive-or-damn rituals
narrative_role:      7 jurists; each is a faction-aligned NPC + 2 cosmic visitors
lore_anchor:         per-faction
art_status:          producer_handoff
gameplay_hook_id:    trpc.hellbox.hb2.tribunal.jurist.converse
wear_state:          slight wear (varies by frequency of use per faction)
physical_constraints: collides; sittable (NPCs)

object_id:           hellbox.castle_of_death.tribunal.player_lectern
object_class:        container  (also interactive — pleading station)
position:            (0.00, -16.00, 0.00)
dimensions:          0.40 × 0.30 × 1.20
rotation:            0°  (faces platform)
material_primary:    cast bronze + walnut + leather inset
material_secondary:  open canonical-pleading book
colour_value:        --token-color-hellbox-castle-of-death-player-lectern
interaction:         interactable
  - plead_for_forgiveness: player opens forgive-or-damn UI; selects canonical figure; pleads (gameplay-active)
  - plead_for_damnation: opposite path; gameplay-active
  - inspect: lore-note about lectern
narrative_role:      player's pleading station; gameplay-active for forgive-or-damn rituals
lore_anchor:         arc.forgive_or_damn_arc
art_status:          producer_handoff
gameplay_hook_id:    trpc.hellbox.hb2.tribunal.lectern.plead
wear_state:          worn at most-touched corner
physical_constraints: collides

object_id:           hellbox.castle_of_death.tribunal.banner.<n>  (4 banners hanging from upper tribunal walls)
object_class:        decoration
positions:           flanking platform; high on east + west tribunal walls
dimensions (each):   1.00 × 0.05 × 3.00
material_primary:    deep crimson velvet with gold-thread embroidery
material_secondary:  bronze hanging-rod
colour_value:        --token-color-hellbox-castle-of-death-tribunal-banner
interaction:         inspectable
narrative_role:      tribunal symbolism; "JUDGE WITH CARE"; "MERCY HAS A PRICE"
lore_anchor:         arc.tribunal_canon
art_status:          producer_handoff
gameplay_hook_id:    trpc.hellbox.hb2.tribunal.banner.read
wear_state:          slight fading
physical_constraints: non-collide (suspended)

object_id:           hellbox.castle_of_death.tribunal.relief.justice_eternal
object_class:        decoration
position:            (0.00, -28.00, 6.00)  # high on south tribunal wall
dimensions:          4.00 × 1.20 × 0.30
rotation:            0°
material_primary:    cast bronze with deep relief
material_secondary:  gilt highlights
colour_value:        --token-color-hellbox-castle-of-death-relief
interaction:         inspectable
narrative_role:      depicts the canonical first-tribunal; lore-readable
lore_anchor:         arc.tribunal_canon
art_status:          producer_handoff
gameplay_hook_id:    trpc.hellbox.hb2.tribunal.relief.read
wear_state:          slight patina
physical_constraints: non-collide
```

#### H.2.9.50-87 Decorative + Closing Items (38 items rolled into category)

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `hellbox.castle_of_death.sanctum.skylight_obscured` | decoration | impossibly above oculus | n/a | obscured night-sky view; cosmic stars visible only during certain rituals |
| `hellbox.castle_of_death.wing_chandelier.<wing>` (4) | fx_emitter | per wing centre at z=8 | 1.20 dia × 0.80 each | wing-chamber chandeliers |
| `hellbox.castle_of_death.wing_brazier.<wing>` (4) | fx_emitter | per wing centre at z=0 | 0.40 dia × 1.20 each | warm braziers in each wing |
| `hellbox.castle_of_death.sanctum.relief_pattern.outer_ring` (15 thresholds) | decoration | along outer-ring perimeter at z=4.00 | 1.40 × 0.40 × 0.10 each | 15 minor-chamber threshold reliefs (per chamber lore tease) |
| `hellbox.castle_of_death.sanctum.priest_chair_hierarchy` | furniture | (0.00, 4.00, 0.00) | 0.90 × 0.90 × 1.50 | priest's chair (Hierarchy priest sits here when not standing) |
| `hellbox.castle_of_death.sanctum.benches.<n>` (8) | furniture | distributed at hex outer ring | 1.40 × 0.40 × 0.45 each | meditation benches |
| `hellbox.castle_of_death.tribunal.observer_pew.<n>` (4) | furniture | south of tribunal platform | 1.40 × 0.40 × 0.45 each | observer pews |
| `hellbox.castle_of_death.minor_chamber_marker.<n>` (15) | decoration | per outer-ring threshold | 0.40 × 0.40 × 0.05 each | minor-chamber name plaques |
| `hellbox.castle_of_death.sanctum.intercom_silent` | console | south wall hidden | 0.20 × 0.10 × 0.30 | silent comms-relay (cosmologically inactive but present) |
| `hellbox.castle_of_death.sanctum.fire_extinguisher_silent` | interactive | south wall | 0.20 × 0.20 × 0.50 | safety (cosmologically inactive) |
| `hellbox.castle_of_death.sanctum.first_aid_silent` | container | south wall | 0.40 × 0.10 × 0.30 | medical (cosmologically inactive) |
| `hellbox.castle_of_death.sanctum.compass_inlay_central_mandala` | decoration | (0.00, 0.00, 0.005) | 3.00 dia × 0.005 | mandala (already specced) |
| `hellbox.castle_of_death.return_transit_indicator_glow` | fx_emitter | (0.00, 0.00, 1.50) | 0.40 dia | warm gold-glow |
| `hellbox.castle_of_death.demon_summoning_circle_emitter` | fx_emitter | at central altar | n/a | demon-summon volumetric source |

#### H.2.9.88 The Master of Mercy NPC Anchor (rare visible at Throne)

```
object_id:           hellbox.castle_of_death.master_of_mercy_anchor
object_class:        npc_anchor
position:            (0.00, 32.00, 8.50)  # at throne
dimensions:          0.80 × 0.80 × 1.80
rotation:            varies
material_primary:    n/a
material_secondary:  n/a
colour_value:        n/a
interaction:         n/a (NPC presence; rarely visible)
narrative_role:      Master of Mercy; cosmologically alive at Throne; appears as silhouette during faction-answer commitment moments
lore_anchor:         loredex.character.master_of_mercy
art_status:          producer_handoff
gameplay_hook_id:    none (presence-driven)
wear_state:          n/a
physical_constraints: n/a
```

Total: 88 inventory objects.

### H.2.10 Camera-spawn-points (FPV cutscenes)

```
cutscene_id:         cs_hellbox_2_arrival  (Act 5 first-time + every subsequent visit)
camera_position:     (0.00, 0.00, eye_level)  # at arrival mandala
camera_facing:       (0°, 8°, 0°)  # facing forward; slight upward tilt to take in throne apse
avatar_height_anchor: eye_level
head_motion:         camera materialises with bell-toll resonance; slow head-pan to take in massive Sanctum scale; lasts 12s

cutscene_id:         cs_hellbox_2_master_of_rlyeh_question
camera_position:     (0.00, 8.00, eye_level)  # at central altar
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         player approaches altar; oculus pulses; throne backlight blooms; Master of R'lyeh asks: "Is mercy a debt, or a gift?"; radial menu appears

cutscene_id:         cs_hellbox_2_throne_approach  (rare; Acts 6+)
camera_position:     (0.00, 32.00, eye_level)  # at throne dais top
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         player has climbed dais; throne becomes inhabited; Master of Mercy silhouette materialises; brief silent acknowledgement

cutscene_id:         cs_demon_summon_prep + cs_demon_summon + cs_demon_contract_bind + cs_demon_summon_success + cs_demon_summon_dismiss  (per §3.1.A.4; 5 cutscenes)
camera_position:     (0.00, 8.00, eye_level)  # all 5 at central altar
camera_facing:       varies per phase
avatar_height_anchor: eye_level
head_motion:         per §3.1.A.4 (full sequence specced in INCEPTION doc)

cutscene_id:         cs_hellbox_2_close  (return-transit invocation)
camera_position:     (0.00, 0.00, eye_level)  # at arrival mandala
camera_facing:       (0°, 0°, 0°)
avatar_height_anchor: eye_level
head_motion:         player kneels at mandala; bell-toll fades; throne re-materialises faintly in distance; ~5s ceremonial fade to ark.hierarchy_throne
```

### H.2.11 Doorways

```
door_id:            hellbox.castle_of_death.return_transit_anchor
connecting_space_id: ark.hierarchy_throne (host room)
door_position:      (0.00, 0.00, 0.005)  # at arrival mandala
door_dimensions:    n/a (cosmological)
door_class:         portal
unlock_condition:   always available once player is in Hellbox
transit_animation:  ~5s ceremonial fade (bell-toll fades; throne dims)
audio_signature:    bell-toll dissipating; ozone clearing; Hierarchy Throne ambient bed fades in

(Internal doorways within Hellbox interior — wing archways + minor-chamber thresholds — specced in walls.)
```

### H.2.12 Adjacency map

```
direct_adjacencies:
  - ark.hierarchy_throne (return-transit; host room)
  - hellbox.castle_of_death.throne_of_mercy_apse (continuous space; cathedral within Hellbox)
  - hellbox.castle_of_death.hall_of_acknowledged_debts (west wing; continuous space)
  - hellbox.castle_of_death.chamber_of_the_forgotten (east wing; continuous space)
  - hellbox.castle_of_death.forgive_or_damn_tribunal (south wing; continuous space)
  - hellbox.castle_of_death.minor_chamber.<n> (15 minor-chambers; deferred sub-spaces)
one_hop_adjacencies:
  - hellbox.master_hellbox (HB5 Universal Selector; if unlocked Act 7)
  - hellbox.celebration_school (HB1; thematic kinship — both meditate on death)
state_shared_with:
  - ark.hierarchy_throne (HB2-faction-pull state)
  - the player's running list of dead crew (cumulative; updates death-register + portrait-walls)
  - the player's mercy-acts log (visible in throne-apse relief)
  - the player's debt-acknowledgements (visible in hall-of-debts ledger walls)
```

### H.2.13 Gameplay hooks

```
hooks:
  - hook_id:         hb2.return_transit
    trigger:         player.interact on player_arrival_mandala
    procedure:       trpc.hellbox.hb2.return_transit
    success_state:   transit_started_to_hierarchy_throne
  - hook_id:         hb2.invoke_master_of_rlyeh
    trigger:         player.approach_for_master_of_rlyeh on sanctum_altar_central
    procedure:       trpc.hellbox.hb2.altar.invoke_master_of_rlyeh
    success_state:   master_of_rlyeh_question_active = true
  - hook_id:         hb2.commit_faction_answer
    trigger:         (state-conditional) player commits faction answer
    procedure:       trpc.hellbox.hb2.faction_answer.commit
    success_state:   faction_answer_committed = <faction>
  - hook_id:         hb2.place_offering
    trigger:         player.interact on sanctum_altar_central with offering
    procedure:       trpc.hellbox.hb2.altar.place_offering
    success_state:   offering_consumed = true
  - hook_id:         hb2.invoke_demon_summon
    trigger:         (state-conditional) player has placed sufficient offerings + has contract
    procedure:       trpc.hellbox.hb2.altar.invoke_demon_summon
    success_state:   demon_summoning_started = true (triggers 5-cutscene sequence per §3.1.A.4)
  - hook_id:         hb2.dismiss_demon
    trigger:         player.dismiss on summoned demon
    procedure:       trpc.hellbox.hb2.demon.dismiss
    success_state:   demon_dismissed
  - hook_id:         hb2.approach_throne
    trigger:         player.approach on throne_of_mercy (climbed dais)
    procedure:       trpc.hellbox.hb2.throne.approach
    success_state:   throne_approached = true (rare lore-flag; Master of Mercy materialises)
  - hook_id:         hb2.read_throne_relief
    trigger:         player.inspect on throne_apse.relief
    procedure:       trpc.hellbox.hb2.throne_relief.inspect
    success_state:   throne_relief_read = true
  - hook_id:         hb2.read_sanctum_relief
    trigger:         player.inspect on sanctum.relief.<aspect>
    procedure:       trpc.hellbox.hb2.sanctum_relief.inspect (per-aspect)
    success_state:   sanctum_relief_read = true (per-aspect; 6 total)
  - hook_id:         hb2.acknowledge_debt
    trigger:         player.interact on hall_of_debts.altar_west
    procedure:       trpc.hellbox.hb2.hall_debts.altar.acknowledge
    success_state:   debt_acknowledged = true (per-acknowledgement)
  - hook_id:         hb2.take_ledger
    trigger:         player.interact on hall_of_debts.ledger_walls
    procedure:       trpc.hellbox.hb2.hall_debts.ledger.take
    success_state:   ledger_read = true (per-ledger)
  - hook_id:         hb2.converse_scribe
    trigger:         player.converse on hall_of_debts.scribe_anchor
    procedure:       trpc.hellbox.hb2.scribe.converse
    success_state:   scribe_dialogue_unlocked
  - hook_id:         hb2.name_a_forgotten
    trigger:         player.interact on chamber_of_forgotten.altar_east
    procedure:       trpc.hellbox.hb2.chamber_forgotten.altar.name
    success_state:   forgotten_named = true (per-name; fills a portrait)
  - hook_id:         hb2.light_forgotten_candle
    trigger:         player.interact on chamber_of_forgotten.candle_array
    procedure:       trpc.hellbox.hb2.chamber_forgotten.candle.light
    success_state:   candle_lit = true (per-candle)
  - hook_id:         hb2.tribunal_plead_forgiveness
    trigger:         player.interact on tribunal.player_lectern (forgiveness path)
    procedure:       trpc.hellbox.hb2.tribunal.lectern.plead (forgiveness)
    success_state:   pleading_active = forgiveness
  - hook_id:         hb2.tribunal_plead_damnation
    trigger:         player.interact on tribunal.player_lectern (damnation path)
    procedure:       trpc.hellbox.hb2.tribunal.lectern.plead (damnation)
    success_state:   pleading_active = damnation
  - hook_id:         hb2.converse_jurist
    trigger:         player.converse on tribunal.jurist_chair.<faction>
    procedure:       trpc.hellbox.hb2.tribunal.jurist.converse
    success_state:   jurist_dialogue_unlocked = true (per-jurist; 7 total)
  - hook_id:         hb2.converse_priest
    trigger:         player.converse on hierarchy_priest_anchor
    procedure:       trpc.hellbox.hb2.priest.converse
    success_state:   priest_dialogue_unlocked = true
```

### H.2.14 Story-tie

```
primary_arcs:
  - arc.act_5_HB2_invocation
  - arc.act_5_master_of_rlyeh_second_question
  - arc.hierarchy_devotion (continuous Acts 5-7)
  - arc.demon_summoning (continuous after first contract; per §3.1.A.4)
  - arc.forgive_or_damn_tribunal (continuous; player's accumulated mercy-acts shape outcomes)
  - arc.fallen_crew (cross-ref; Chamber of Forgotten + portrait-walls)
  - arc.cumulative_debt (Hall of Acknowledged Debts; ledger updates)
per_act_evolution:
  acts_0_4: room locked + invisible (Hierarchy faction-alignment required)
  act_5: room first invocable (after Hierarchy alignment); first Master of R'lyeh question; first canonical death in Castle relief
  act_6: deeper rituals available; demon-summoning unlocked (after first contract); jurists begin to converse meaningfully
  act_7: state-branched: Hierarchy-master ending (player has been deeply Hierarchy-aligned; Master of Mercy appears at Throne) vs. Hierarchy-distant ending (cold + empty)
npc_roster:
  - the_hierarchy_priest_of_death: primary occupant; conducts rituals
  - the_master_of_mercy: rare visible at Throne (Acts 6+ only when Hierarchy fully aligned)
  - 7 tribunal jurists: 5 faction-aligned + 2 cosmic visitors
  - the_scribe_of_debts: Hall of Acknowledged Debts NPC
  - rare_minor_chamber_NPCs: deferred 15 sub-spaces have their own NPCs
  - the_master_of_rlyeh: voice-only at altar + throne during faction-answer moments
  - demons (per summoning): manifestations only during demon-summoning
readables:
  - sanctum south plaque (Hierarchy death-creed; 4-line proto-Latin canon)
  - 6 sanctum hexagonal reliefs (per-aspect canonical death-scene)
  - throne apse relief (Master of Mercy + supplicant)
  - 8 throne-apse stained-glass windows (mercy-canon scenes)
  - Hall of Debts ledger walls (~1,000 unique ledger entries)
  - Hall of Debts eternal-ledger relief
  - Chamber of Forgotten "no-one-remembers" relief
  - Chamber of Forgotten ~200 empty portraits (each fills as player names)
  - Tribunal banners (4 mottos)
  - Tribunal "justice eternal" relief
  - Jurist nameplates (7 jurists)
  - Player lectern pleading-book (canonical pleadings template)
master_of_rlyeh_question: "Is mercy a debt, or a gift?"
faction_answers: per §3.12.4 (Architect Remnants / New Babylon / Hierarchy / Insurgency / Dreamers Children — Hierarchy strongest pull)
```

### H.2.15 Special-FX

```
particle_systems:
  - incense_smoke (high; from 6 censers + 4 wing braziers; rises continuously)
  - cold_breath_motes (very low; visible breath in cold zones — Sanctum + Chamber of Forgotten)
  - candle_smoke (medium; 50 candles in Chamber of Forgotten + altar + censers)
  - dust (very low; sacred maintenance)
  - ritual_residue_motes (state-conditional during demon-summoning + answer-moments)
  - portrait_filling_motes (state-conditional; when player names a forgotten one, motes flow into the empty frame)
  - debt_ledger_glint (subtle; bronze-spine catches light)
  - tribunal_judgement_motes (state-conditional during forgive-or-damn)
  - return_transit_petals (one-shot)
  - master_of_mercy_silhouette_emanation (rare; state-conditional; warm-gold motes flow from throne)
volumetric_effects:
  - sanctum_oculus_volumetric_glow (deep red-amber down through Sanctum)
  - throne_apse_dome_volumetric_beam (warm gold-red cone above throne)
  - apsidal_stained_glass_volumetric_beams (8 dramatic light shafts in Throne apse)
  - bell_toll_visualisation (subtle pulse radiates from impossibly-above)
  - censer_smoke_columns (6 vertical pillars rising)
  - master_of_rlyeh_voice_radiance (state-conditional)
  - demon_manifestation_volumetric (state-conditional; per §3.1.A.4)
procedural_animations:
  - oculus_pulse_with_bell (period 60s)
  - chandelier_subtle_sway (very slow)
  - censer_flame_organic (continuous)
  - candle_flickers (continuous; 50+ sources)
  - throne_subtle_warmth (when Master of Mercy present)
  - apsidal_relief_subtle_animation (figure subtly shifts; uncanny)
  - debt_ledger_subtle_glint
  - portrait_subtle_age_shift (frames slowly accumulate patina)
  - bell_toll_air_pulse_visualisation
reactive_systems:
  - sanctum_oculus_intensifies_on_player_at_altar
  - chandelier_intensifies_on_player_at_wing_centre
  - throne_glow_intensifies_on_dais_climb
  - relief_animates_on_inspection
  - censer_intensify_on_proximity (within 1.5 m)
  - master_of_mercy_silhouette_appears_on_dais_top
  - demon_summoning_one_shot_full_sequence
  - portrait_fills_on_naming_one_shot
```

### H.2.16 Avatar-parametricity

```
camera_height_variation:
  small_xenomorph (0.85m eye): camera height 0.85m; Sanctum scale feels overwhelming; Throne dais climb is harder (alternate slow-climb animation)
  short_humanoid (1.40m eye): standard short scale
  average_humanoid (1.70m eye): standard
  tall_humanoid (2.05m eye): comfortable; sanctum oculus feels closer
  tall_xenomorph (2.70m eye): some chandeliers at near-head-level; alternate route around centre
reachability:
  small_xenomorph: cannot reach throne (climb 12 steps with smaller-stride animation; takes ~8s instead of ~6s)
  small_xenomorph: cannot reach upper sanctum reliefs at z = 6.00; relay-inspect from below with magnifier
  small_xenomorph: cannot reach throne-apse relief at z = 12.00; relay-inspect
  small_xenomorph: cannot reach upper hall-of-debts ledgers; alternate rolling ladder
  small_xenomorph: cannot reach upper portrait-frames in Chamber of Forgotten; relay-inspect
  others: all-reachable
audio_occlusion_variation:
  xenomorph_sensitive_hearing: bell-toll deeply pronounced; chants overwhelming during ritual hours
  synthetic_voice_avatar: Master of R'lyeh voice has subtle synthetic-resonance bias; demon-voice too
```

### H.2.17 Performance

```
polygon_budget:      950,000 polygons (very large perceptual scale + complex architecture + many NPCs + cathedral apse + 4 wings + 15 minor-chamber threshold-stubs)
texture_budget:      560 MB total (extensive bronze, marble, gold-leaf, stained-glass, velvet materials)
light_count_limit:   36 simultaneous dynamic lights (oculus + 6 chandeliers + 4 wing chandeliers + 8 stained-glass + practical sources)
lod_plan:
  - hero_distance: 0-20m, full detail (immediate Sanctum)
  - mid_distance: 20-50m, mid detail (wing-chambers as silhouettes; minor-chamber thresholds simplified)
  - long_distance: 50m+, low detail (apsidal-vault distant detail; perceptual sky)
streaming_behaviour:
  - preload: ark.hierarchy_throne (host room)
  - on_wing_threshold_approach: preload that wing-chamber fully (already partially loaded as continuous space)
  - on_minor_chamber_threshold_approach: preload that minor-chamber sub-space (deferred from FULL spec; placeholder loading)
  - on_demon_summon_invocation: preload demon-manifestation assets
  - on_throne_dais_top_reached: preload Master of Mercy NPC silhouette + dialogue
```

---

## H.3 Quiz Show Palimpsest (HB3 — Bridge gateway)

**Status: FULL spec.** Cross-ref `INCEPTION_ARK_FINAL_PRODUCTION.md`
§3.12.5 for cosmology + transit + faction answers.

### H.3.1 Header

```
space_id:        hellbox.quiz_show_palimpsest
space_name:      Quiz Show Palimpsest
space_type:      hellbox_interior  (Matrix-of-Dreams; theatrical-studio)
act_introduced:  Act 6
host_room:       ark.bridge (captain's chair + holo-table gateway)
lore_anchor:     loredex.system.quiz_show_palimpsest + loredex.character.velkraal + loredex.character.brel + arc.gm_arc_payoff + loredex.character.master_of_rlyeh
aesthetic_tier:  matrix_dream + theatrical-studio overlay  (1970s game-show set crossed with cosmic theatre)
```

### H.3.2 Geometry

```
dimensions:           42.00 m × 28.00 m × 14.00 m  (perceptual; bigger-on-inside ratio 5× external Bridge footprint)
origin_point:         centre of contestant podium (where the player materialises after transit)
coordinate_axes:      +x = right, +y = forward (north — toward host's-desk + back-wall), +z = up
floor_plan_geometry:  rectangular  (theatrical proscenium-style stage; 3-tiered audience gallery on 3 sides)
volumetric_anomalies:
  - bigger_on_inside ratio: 5× external Bridge footprint
  - perpetual_studio_lighting: theatrical lighting with no day/night; perpetual production-time
  - audience_phantoms: ~500 audience-seat phantoms in gallery (silhouettes only; cheering + groaning audibly but never visibly clear)
  - palimpsest_residue: faint earlier-show footage occasionally bleeds through walls (cosmetic; suggests "this set has been reused for centuries")
```

The Quiz Show Palimpsest is theatrical, garish, deeply uncanny.
A 1970s American game-show set crossed with cosmic theatre.
Velkraal + Brel — the GM-arc twin hosts — preside from their
host's-desk at the north end. The player materialises at a
contestant podium centre-stage. Audience gallery rises on east,
south, and west sides (3-tiered; ~500 phantom seats; never fully
visible). The studio is perpetually lit; no day/night cycle.
The set itself bears traces of EVERY previous show it has hosted
— faint footage occasionally bleeds through walls (palimpsest
residue), suggesting cosmologically the set has been reused
across centuries.

Floor area (perceptual): stage + audience ~840 m².

### H.3.3 Floor

```
material_primary:     polished black-and-white-checkerboard linoleum on stage zone (8.00 × 6.00 m central stage; 0.40 × 0.40 tiles); audience gallery has crimson-velvet carpeting in radial wedges
material_secondary:   gold-leaf inlay forming a 5-pointed contestant-star at podium position (where player materialises); brass apron-edge of stage
pattern:              checkerboard stage + radial crimson aisle in audience
wear_state:           well-used; stage tiles show centuries of contestant-pacing; central podium-star slightly more polished
embedded_features:
  - id: hellbox.quiz_show_palimpsest.floor.charge_point.contestant_podium
    position: (0.00, 0.00, 0.00)  # where player materialises; centre-stage
    dimensions: 0.40 × 0.40 × 0.05
    function: arrival-anchor + return-transit invocation
  - id: hellbox.quiz_show_palimpsest.floor.charge_point.host_desk
    position: (0.00, 12.00, 0.00)  # at host's desk, north end
    dimensions: 0.60 × 0.40 × 0.05
    function: host-desk holographic display power
  - id: hellbox.quiz_show_palimpsest.floor.audience_threshold.east, .south, .west  (3 thresholds)
    position: at edges of stage on 3 sides
    dimensions: varied; demarcate stage from audience
    function: stage/audience boundary; phantom audience cannot cross
  - id: hellbox.quiz_show_palimpsest.floor.spotlight_anchors.<n>  (4 spotlight floor anchors)
    position: 4 corners of stage
    dimensions: 0.20 × 0.20 × 0.05 each
    function: theatrical spotlight calibration
acoustic_property:    mixed (linoleum stage hard-reflective; carpeted audience soft-absorbent); RT60 = 0.55s with applause-resonance during shows
```

### H.3.4 Walls

#### Stage Walls (north wall + back-stage flanking)

```
wall_id:              stage_wall_north + flanking
material_primary:     painted scenery-board with 1970s game-show graphics (warm orange + brown + gold geometric patterns); palimpsest-residue subtle (earlier shows bleed through)
material_secondary:   bronze stage-apron trim; gold-leaf around marquee
panelisation:         scenery-board panels
colour_value:         --token-color-hellbox-quiz-show-stage-wall  (warm garish 1970s palette + faint cosmic-cyan undertone from palimpsest)
embedded_displays:
  - id: hellbox.quiz_show_palimpsest.north.marquee
    position: (0.00, 14.00, 6.00)  # high above host's desk
    dimensions: 6.00 × 1.20 × 0.10
    content: live show-title display + scoreboard; pulses with applause
  - id: hellbox.quiz_show_palimpsest.north.host_desk_screen
    position: (0.00, 12.00, 1.50)  # at host's desk back-panel
    dimensions: 4.00 × 1.50 × 0.05
    content: question-of-the-moment + multiple-choice options + faction-answer radial during Master of R'lyeh moments
embedded_doors:        none (no physical exits; only return-transit at podium)
decorative_features:
  - id: hellbox.quiz_show_palimpsest.north.host_desk
    position: (0.00, 12.00, 0.00)
    dimensions: 4.00 × 1.50 × 1.20  (oversized desk for 2 hosts)
    material: polished walnut + glittery gold + 1970s wood-panel laminate
    narrative_role: where Velkraal + Brel preside
  - id: hellbox.quiz_show_palimpsest.north.applause_sign  (suspended above stage)
    position: (0.00, 8.00, 9.00)
    dimensions: 2.00 × 1.00 × 0.20 (illuminated sign)
    material: cast bronze with neon-tube embedded letters
    narrative_role: "APPLAUSE" sign that lights up when audience claps
```

#### Audience Gallery Walls (east, south, west; 3 sides)

```
wall_id:              gallery_east + .south + .west
material_primary:     painted theatrical-studio walls in deep crimson + gold trim; backstage curtain texture suggested
material_secondary:   bronze tiered gallery-railings; warm-amber footlights at each tier
panelisation:         tiered seating zones
colour_value:         --token-color-hellbox-quiz-show-gallery-wall  (deep crimson + gold + warm theatrical palette)
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: hellbox.quiz_show_palimpsest.gallery.tier_seating.<side>.<n>  (3 tiers per side × 3 sides = 9 tier sections; each holds ~50-60 phantom seats)
    position: tiered along east, south, west walls; each tier 1.20 m higher than previous
    dimensions: 14.00 × 0.50 × 0.40 each tier
    material: crimson-velvet padded benches; phantom audience occupy as silhouettes
    narrative_role: phantom audience; ~500 total seats; canonically: every contestant who has ever appeared on this show is in the audience
  - id: hellbox.quiz_show_palimpsest.gallery.spotlight_clusters.<n>  (8 theatrical spotlight clusters in ceiling)
    position: distributed in ceiling rigging at z = 12.00
    dimensions: 0.40 × 0.40 × 0.40 each
    material: cast-aluminium with gel-filter
    narrative_role: theatrical lighting on contestants
```

### H.3.5 Ceiling

```
height_above_floor:     14.00 m baseline; theatrical rigging + catwalks visible at z = 12.00; back-stage scrims
material:               exposed black-painted theatrical rigging with cable management visible; catwalks for stage-hand silhouettes (cosmetic)
lighting_integrated:    extensive theatrical lighting rig (20+ spotlight clusters); central ceiling has illuminated scoreboard panel
atmospheric_features:   theatrical-haze emitters create dramatic light-shaft effect during show; subtle palimpsest-residue ghosts at upper volume
acoustic_treatment:     mixed (damp panels above gallery; reflective above stage)
```

### H.3.6 Lighting

```
ambient_baseline:     3200 K (warm theatrical); 280 lux at floor level (production-bright); CRI 92
direct_fixtures:
  - id: hellbox.quiz_show_palimpsest.light.contestant_podium_spot
    position: (0.00, 0.00, 12.00)  # spotlight on podium
    beam_angle: 15° (tight)
    colour: --token-color-hellbox-quiz-show-spot  (bright warm white)
    intensity: 8000 lumens
    function: hero-light on contestant
  - id: hellbox.quiz_show_palimpsest.light.host_desk_pendant
    position: (0.00, 12.00, 6.00)
    beam_angle: 30° downward
    colour: warm white
    intensity: 5000 lumens
    function: hosts illumination
  - id: hellbox.quiz_show_palimpsest.light.stage_floods
    position: 4 floor-flood lights at stage corners
    beam_angle: 60° each
    colour: 3200 K warm
    intensity: 4000 lumens each
    function: stage fill lighting
  - id: hellbox.quiz_show_palimpsest.light.spotlight_cluster.<n>  (8 ceiling spots)
    position: distributed in catwalk rigging at z = 12.00
    beam_angle: 20° each
    colour: variable per cluster (some white; some warm; some red for "wrong answer")
    intensity: 4000 lumens each
    function: theatrical drama
  - id: hellbox.quiz_show_palimpsest.light.gallery_footlights
    position: along edge of each tier
    beam_angle: 90° upward (footlights)
    colour: warm amber; 200 lumens per metre
    function: audience definition
practical_sources:
  - id: hellbox.quiz_show_palimpsest.applause_sign_neon
    position: (0.00, 8.00, 9.00)
    intensity: 1500 lumens (when "applause" active)
    flicker_pattern: pulse during applause; off otherwise
  - id: hellbox.quiz_show_palimpsest.host_desk_screen_glow
    position: at host desk
    intensity: 800 lumens
    flicker_pattern: matches displayed content
  - id: hellbox.quiz_show_palimpsest.marquee_glow
    position: at marquee
    intensity: 1200 lumens (always on)
    flicker_pattern: stable
time_of_day_variation:
  acts_6_to_7: stable theatrical baseline; intensifies during Master of R'lyeh moments + show climaxes
dynamic_response:
  - on_player_arrival: contestant_spot blooms; audience-cheer rises
  - on_master_of_rlyeh_question: all spots focus on contestant; ambient drops 30%; host_desk_screen shows faction-radial menu
  - on_correct_answer: applause_sign ignites; warm-white flood from above
  - on_wrong_answer: red-spot from above; ambient warms uneasily
```

### H.3.7 Atmosphere

```
air_temperature:    22°C (warm theatrical); rises slightly during show climax
humidity:           45% RH; smells of stage-oil + theatrical greasepaint + warm electronics + faint hairspray (1970s style) + popcorn (audience)
particulate:
  - dust_motes: medium (visible in spotlight beams; theatrical haze)
  - theatrical_smoke: low (fog-machine baseline; medium during dramatic moments)
  - palimpsest_residue_motes: very low (cosmetic; faint earlier-show ghosts)
volumetric_fog:     subtle haze at upper volume (theatrical); intensifies during shows
wind_drift:         minimal; 0.04 m/s; HVAC pattern; air-conditioning audible
smell_canon:        stage-oil + greasepaint + warm electronics + hairspray + popcorn; voice-line: "smells like a thousand tapings"
```

### H.3.8 Sound

```
ambient_bed:           file: quiz_show_palimpsest_ambient_bed_v1.ogg (loop); -22 dB; phantom audience murmur, distant 1970s game-show theme music (faint), occasional cough/laugh, cooling fans, ticking clock
point_sources:
  - id: hellbox.quiz_show_palimpsest.audience_murmur
    position: distributed (3-side gallery)
    sound: continuous low-volume audience murmur (-32 dB)
    occlusion_behaviour: omnidirectional with 3-side bias
    trigger: continuous
  - id: hellbox.quiz_show_palimpsest.applause_burst
    position: distributed (gallery)
    sound: sudden burst of phantom applause (-18 dB; state-conditional)
    occlusion_behaviour: omnidirectional
    trigger: state-conditional (during shows)
  - id: hellbox.quiz_show_palimpsest.applause_sign_buzz
    position: at sign
    sound: neon-buzz (when active; -34 dB)
    occlusion_behaviour: standard
    trigger: state-conditional
  - id: hellbox.quiz_show_palimpsest.host_desk_screen_subtle_hum
    position: at host desk
    sound: electronic hum (-38 dB; continuous)
    occlusion_behaviour: standard
    trigger: continuous
  - id: hellbox.quiz_show_palimpsest.theme_music_distant
    position: distributed
    sound: faint 1970s game-show theme music loop (-34 dB; pseudo-detuned, slightly off-key — uncanny)
    occlusion_behaviour: omnidirectional
    trigger: continuous
  - id: hellbox.quiz_show_palimpsest.master_of_rlyeh_voice
    position: (0.00, 12.00, 1.50)  # at host desk during Master of R'lyeh moments (Velkraal + Brel become silent)
    sound: Master of R'lyeh's voice per §3.12.2
    occlusion_behaviour: omnidirectional
    trigger: state-conditional
  - id: hellbox.quiz_show_palimpsest.host_voices.velkraal + .brel
    position: at host desk
    sound: Velkraal's + Brel's quiz-show patter (theatrical-uncanny)
    occlusion_behaviour: standard
    trigger: continuous
reverb_zone:           IR-impulse: quiz_show_studio_v1.wav; wet-mix 22% (theatrical with applause-resonance)
music_eligibility:     ambient music ALLOWED — 1970s game-show theme loop at -28 dB (uncanny; slightly off-key); intensifies during dramatic moments
voice_line_eligibility:
  - speaker: velkraal: continuous (game-show host patter)
  - speaker: brel: continuous (co-host)
  - speaker: phantom_audience_voices: cyclic
  - speaker: master_of_rlyeh: state-conditional during answer moments
```

### H.3.9 Object inventory

Quiz Show Palimpsest has 56 inventory objects.

#### H.3.9.1 The Player Arrival Star (centre-stage)

```
object_id:           hellbox.quiz_show_palimpsest.player_arrival_star
object_class:        fx_emitter  (also gameplay-anchor)
position:            (0.00, 0.00, 0.005)
dimensions:          0.40 × 0.40 × 0.005
material_primary:    gold-leaf inlay forming a 5-pointed contestant-star
material_secondary:  bronze perimeter ring
colour_value:        --token-color-hellbox-quiz-show-arrival-star
interaction:         interactable
  - return_to_bridge: invoke return-transit
narrative_role:      THE arrival point; centre-stage; player materialises here
lore_anchor:         arc.return_transit
art_status:          producer_handoff
gameplay_hook_id:    trpc.hellbox.hb3.return_transit
wear_state:          slightly more polished than surrounding tiles
physical_constraints: non-collide
```

#### H.3.9.2 The Contestant Podium

```
object_id:           hellbox.quiz_show_palimpsest.contestant_podium
object_class:        interactive
position:            (0.00, 0.50, 0.00)
dimensions:          0.80 × 0.60 × 1.20
rotation:            0°  (faces north toward hosts)
material_primary:    polished walnut + chrome trim + brass nameplate (player's name appears)
material_secondary:  illuminated answer-buttons (4 buttons; one per multiple-choice answer)
colour_value:        --token-color-hellbox-quiz-show-podium
interaction:         interactable
  - operate: activates contestant interface; player can ring-in + answer questions
  - inspect: lore-note about podium (canonical pre-Ark; the same podium has hosted every contestant in canon history)
narrative_role:      THE contestant station; gameplay-active during shows + Master of R'lyeh moments
lore_anchor:         arc.act_6_HB3_invocation + loredex.character.master_of_rlyeh
art_status:          producer_handoff
gameplay_hook_id:    trpc.hellbox.hb3.podium.operate
wear_state:          worn at most-touched buttons
physical_constraints: collides
```

#### H.3.9.3 The Host's Desk

```
object_id:           hellbox.quiz_show_palimpsest.host_desk
object_class:        interactive  (also npc_anchor for both hosts)
position:            (0.00, 12.00, 0.00)
dimensions:          4.00 × 1.50 × 1.20
rotation:            180°  (faces south toward contestant + audience)
material_primary:    polished walnut + glittery gold + 1970s wood-panel laminate
material_secondary:  back-panel display screen; bronze nameplates (Velkraal + Brel)
colour_value:        --token-color-hellbox-quiz-show-host-desk
interaction:         interactable
  - approach_for_master_of_rlyeh: Velkraal + Brel gravely change tone; Master of R'lyeh asks: "Does a child's first death haunt the world that buried them?"
  - inspect: lore-note about desk (centuries of palimpsest residue; the desk has been re-stained dozens of times)
narrative_role:      THE hosts' station; primary cosmological anchor for HB3
lore_anchor:         loredex.character.velkraal + loredex.character.brel + loredex.character.master_of_rlyeh
art_status:          producer_handoff
gameplay_hook_id:    trpc.hellbox.hb3.host_desk.invoke_master_of_rlyeh
wear_state:          deeply worn at hosts' positions; palimpsest-stained
physical_constraints: collides
```

#### H.3.9.4-5 Velkraal + Brel Anchors (NPC anchors at host desk)

```
object_id:           hellbox.quiz_show_palimpsest.velkraal_anchor + .brel_anchor
object_class:        npc_anchor
positions:           (-1.00, 12.50, 0.00) Velkraal; (1.00, 12.50, 0.00) Brel  (behind desk; standing)
dimensions (each):   0.80 × 0.80 × 1.80 (anchors only)
rotation:            varies (NPC pose-driven)
material_primary:    n/a
material_secondary:  n/a
colour_value:        n/a
interaction:         interactable
  - converse: dialogue with hosts; canonical GM-arc payoff happens here
narrative_role:      THE twin GM-arc hosts; Velkraal asks twisted questions, Brel reveals what player has buried
lore_anchor:         loredex.character.velkraal + loredex.character.brel + arc.gm_arc_payoff
art_status:          producer_handoff
gameplay_hook_id:    trpc.hellbox.hb3.velkraal.converse + .brel.converse
wear_state:          n/a
physical_constraints: n/a
```

#### H.3.9.6-13 Eight Theatrical Spotlight Clusters

```
object_id:           hellbox.quiz_show_palimpsest.spotlight_cluster.<n>  (8 clusters)
object_class:        fx_emitter
positions:           distributed in ceiling rigging at z = 12.00
dimensions (each):   0.40 × 0.40 × 0.40
rotation:            varies (aimed at stage)
material_primary:    cast aluminium with gel-filter mounts
material_secondary:  bronze rigging brackets
colour_value:        --token-color-hellbox-quiz-show-spotlight  (variable; warm white baseline; red for wrong; cyan for cosmic)
interaction:         inert
narrative_role:      theatrical drama; tracks contestant + responds to answers
lore_anchor:         loredex.aesthetic.theatrical_studio
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          slight wear at most-used spots
physical_constraints: non-collide (overhead)
```

#### H.3.9.14 The Marquee

```
object_id:           hellbox.quiz_show_palimpsest.north.marquee
object_class:        display
position:            (0.00, 14.00, 6.00)
dimensions:          6.00 × 1.20 × 0.10
rotation:            180°
material_primary:    cast aluminium frame with neon-tube + LED panel
material_secondary:  gold-leaf trim
colour_value:        --token-color-hellbox-quiz-show-marquee
interaction:         inspectable
  - inspect: shows all canonical show-titles in palimpsest (centuries of titles overlaid)
narrative_role:      visible from anywhere; cosmologically anchoring (the show has many names)
lore_anchor:         arc.gm_arc_payoff
art_status:          producer_handoff
gameplay_hook_id:    trpc.hellbox.hb3.marquee.inspect
wear_state:          weathered (centuries of lighting)
physical_constraints: non-collide
```

#### H.3.9.15 The Applause Sign

```
object_id:           hellbox.quiz_show_palimpsest.applause_sign
object_class:        fx_emitter+display
position:            (0.00, 8.00, 9.00)
dimensions:          2.00 × 1.00 × 0.20
rotation:            180°
material_primary:    cast bronze with neon-tube embedded letters
material_secondary:  none
colour_value:        --token-color-hellbox-quiz-show-applause-sign  (warm amber when on; off otherwise)
interaction:         inert
narrative_role:      visual cue for audience-applause moments
lore_anchor:         loredex.aesthetic.theatrical_studio
art_status:          producer_handoff
gameplay_hook_id:    none (state-driven)
wear_state:          slight wear; bulb-flicker simulated
physical_constraints: non-collide (suspended)
```

#### H.3.9.16-24 Nine Audience Tier Sections (3 tiers × 3 sides)

```
object_id:           hellbox.quiz_show_palimpsest.gallery.tier_seating.<side>.<tier_n>  (9 sections)
object_class:        furniture  (with phantom audience anchors)
positions:           distributed along east, south, west walls (3 tiers per side; 1.20 m rise per tier)
dimensions (each):   14.00 × 0.50 × 0.40
rotation:            varies (faces stage)
material_primary:    crimson-velvet padded benches with bronze tier-rails
material_secondary:  bronze armrests at aisle ends
colour_value:        --token-color-hellbox-quiz-show-gallery-bench
interaction:         interactable - sit (player can sit if they wish; rare)
narrative_role:      ~500 phantom audience seats; player can occupy one to "watch" (rare gameplay)
lore_anchor:         arc.gm_arc_payoff
art_status:          producer_handoff
gameplay_hook_id:    trpc.hellbox.hb3.gallery.sit
wear_state:          slight wear at most-occupied phantom positions
physical_constraints: collides; sittable
```

#### H.3.9.25-32 Eight Floor Spotlight Anchors + Stage Apron

```
object_id:           hellbox.quiz_show_palimpsest.stage_apron_lights.<n>  (8 footlight emitters along stage edge)
object_class:        fx_emitter
positions:           distributed along stage front-edge at z = 0.05
dimensions (each):   0.20 × 0.20 × 0.10
rotation:            varies
material_primary:    cast aluminium + warm-amber bulb
material_secondary:  bronze trim
colour_value:        --token-color-hellbox-quiz-show-footlight
interaction:         inert
narrative_role:      stage edge demarcation + theatrical atmosphere
lore_anchor:         loredex.aesthetic.theatrical_studio
art_status:          producer_handoff
gameplay_hook_id:    none
wear_state:          slight wear
physical_constraints: non-collide (low-profile)
```

#### H.3.9.33-44 Twelve Costume + Set Decorations (1970s game-show details)

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `hellbox.quiz_show_palimpsest.host_desk.coffee_mug.velkraal` | decoration | on desk | 0.10×0.10×0.12 | Velkraal's coffee mug ("WORLD'S WORST HOST" engraved) |
| `hellbox.quiz_show_palimpsest.host_desk.coffee_mug.brel` | decoration | on desk | 0.10×0.10×0.12 | Brel's coffee mug ("ASK ME ABOUT YOUR REGRETS") |
| `hellbox.quiz_show_palimpsest.host_desk.cue_cards` | decoration | on desk | 0.30×0.20×0.04 | Hosts' cue cards |
| `hellbox.quiz_show_palimpsest.host_desk.bell_buzzer` | interactive | on desk | 0.20×0.20×0.20 | bronze ring-bell buzzer |
| `hellbox.quiz_show_palimpsest.host_desk.timer_clock` | decoration | on desk | 0.20×0.20×0.30 | bronze countdown-timer |
| `hellbox.quiz_show_palimpsest.stage.confetti_cannon.east, .west` (2) | fx_emitter | at stage corners | 0.40×0.40×0.40 each | confetti cannons (cosmetic; fire on correct answers) |
| `hellbox.quiz_show_palimpsest.contestant_chair_alt` | furniture | (-3.00, 0.50, 0.00) | 0.80×0.80×1.20 | spare contestant chair (mostly empty; suggests other contestants) |
| `hellbox.quiz_show_palimpsest.set_dressing.geometric_panel.<n>` (4) | decoration | back-stage flanking | varied | 1970s geometric scenery panels |
| `hellbox.quiz_show_palimpsest.cosmetic_makeup_table` | decoration | (8.00, 14.00, 0.00) backstage | 1.20×0.40×0.85 | cosmetic table with mirror (makeup stations; hint at canonical show-prep) |
| `hellbox.quiz_show_palimpsest.cosmetic_mirror` | decoration | on makeup table | 0.60×0.05×0.80 | mirror (the only mirror in any Hellbox; per §3.1.0.10 must NOT show player reflection — shows only blurred ghost-of-prior-contestants) |
| `hellbox.quiz_show_palimpsest.fog_machine.east, .west` (2) | fx_emitter | at stage corners | 0.40×0.40×0.40 each | theatrical haze emitters |

#### H.3.9.45-50 Six Decorative + Atmospheric Items

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `hellbox.quiz_show_palimpsest.audience_murmur_emitter` | fx_emitter | distributed in gallery | n/a | continuous phantom audience murmur source |
| `hellbox.quiz_show_palimpsest.theme_music_emitter` | fx_emitter | distributed | n/a | 1970s game-show theme loop |
| `hellbox.quiz_show_palimpsest.palimpsest_residue_emitter` | fx_emitter | walls + upper volume | n/a | faint earlier-show footage bleeds through walls |
| `hellbox.quiz_show_palimpsest.applause_burst_emitter` | fx_emitter | distributed | n/a | applause-burst SFX source |
| `hellbox.quiz_show_palimpsest.master_of_rlyeh_voice_emitter` | fx_emitter | at host desk | n/a | Master of R'lyeh voice during answer moments |
| `hellbox.quiz_show_palimpsest.compass_inlay_arrival_star` | decoration | (0.00, 0.00, 0.005) | 0.40 dia × 0.005 | already specced |

#### H.3.9.51-56 Closing Items + Buried-Truth Display

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `hellbox.quiz_show_palimpsest.south.return_transit_indicator_glow` | fx_emitter | at podium | 0.40 dia × 0.05 | warm gold-glow |
| `hellbox.quiz_show_palimpsest.south.intercom_silent` | console | (-2.00, 0.20, 1.50) | 0.20×0.10×0.30 | comms (cosmologically silent) |
| `hellbox.quiz_show_palimpsest.south.fire_extinguisher_silent` | interactive | (2.00, 0.20, 1.20) | 0.20×0.20×0.50 | safety (cosmologically silent) |
| `hellbox.quiz_show_palimpsest.south.first_aid_silent` | container | (-3.00, 0.20, 1.50) | 0.40×0.10×0.30 | medical (cosmologically silent) |
| `hellbox.quiz_show_palimpsest.host_desk.buried_truth_display` | display | on desk | 0.40×0.30×0.05 | secondary display showing the player's buried truths (revealed during questions) |
| `hellbox.quiz_show_palimpsest.host_desk.canonical_question_book` | container | on desk | 0.30×0.20×0.05 | canonical-pleading-question repository (lore-readable) |

Total: 56 inventory objects.

### H.3.10-17 Camera-spawn-points / Doorways / Adjacency / Hooks / Story / FX / Parametricity / Performance (compact full FULL fidelity)

```
camera_spawn_points:
  cs_hellbox_3_arrival (Act 6 first-time + every visit): POV at podium with bridge-residue dissipating; head pans to take in studio; lasts 12s
  cs_velkraal_brel_first_meet (Act 6 first-time): POV at podium; Velkraal + Brel from host desk; first uncomfortable greeting
  cs_master_of_rlyeh_question: POV at podium; hosts go silent + cosmic; Master of R'lyeh asks "Does a child's first death haunt the world that buried them?"; radial menu
  cs_buried_truth_revelation (state-conditional): POV at host desk; Brel reveals one of player's buried truths
  cs_hellbox_3_close: POV at podium; theatrical-curtain falls; ~5s fade to ark.bridge

doorways:
  return_transit_anchor → ark.bridge (host room); cosmological portal at podium

adjacency:
  direct: ark.bridge (return-transit; via captain's chair + holo-table gateway)
  one_hop: hellbox.master_hellbox (HB5; if Act 7 unlocked)
  state_shared: ark.bridge (HB3 faction-pull); the player's buried-truths log (Brel's reveals affect player's narrative state)

gameplay_hooks:
  - hb3.return_transit
  - hb3.invoke_master_of_rlyeh: trpc.hellbox.hb3.host_desk.invoke (one-shot per visit; faction-radial)
  - hb3.commit_faction_answer
  - hb3.converse_velkraal: per dialogue tree
  - hb3.converse_brel: per dialogue tree (reveals buried truths)
  - hb3.sit_audience: rare gameplay-passive
  - hb3.ring_buzzer: gameplay-active during shows
  - hb3.read_canonical_question_book

story_tie:
  primary_arcs:
    - act_6_HB3_invocation
    - gm_arc_payoff (Velkraal + Brel reveal centuries of GM-arc subtext)
    - cumulative_buried_truth (player's secrets revealed by Brel; affects ending state)
  per_act:
    acts_0_5: locked
    act_6: opens; first show; first buried-truth revelation
    act_7: state-branched: full-confessed ending (player has heard most truths) vs. truth-resistant ending
  npc_roster: velkraal + brel (twin hosts); ~500 phantom audience; the_master_of_rlyeh (voice during answer moments)
  readables:
    - canonical question book (multi-screen)
    - palimpsest marquee (centuries of show-titles)
    - host desk back-panel (live show state)
    - cosmetic mirror (uncanny ghost-imagery)
  master_of_rlyeh_question: "Does a child's first death haunt the world that buried them?"
  faction_answers: per §3.12.5 (Architect Remnants / New Babylon / Hierarchy / Insurgency / Dreamers Children — Insurgency strongest pull)

special_fx:
  particle_systems: theatrical_haze; dust_motes_in_spots; palimpsest_residue_motes; confetti_burst (state-conditional); applause_visualisation
  volumetric: spotlight_volumetric_beams; haze_envelope; marquee_glow; applause_sign_glow
  procedural_animations: spotlight_track_contestant; phantom_audience_subtle_sway; velkraal_brel_idle_animations; theme_music_visualisation; palimpsest_subtle_bleed (earlier shows visible briefly)
  reactive_systems: spot_focuses_on_contestant_on_proximity; confetti_on_correct_answer; red_spot_on_wrong; applause_intensify_on_correct; brel_buried_truth_reveal_one_shot

avatar_parametricity: small_xenomorph alternate stage-apron-step; cosmetic_mirror shows blurred-ghost regardless of avatar (cosmologically; per §3.1.0.10 mirror exception); others all-reachable
audio_occlusion: xenomorph: phantom audience murmur overwhelming; theme music slightly off-key uncanny

performance:
  polygon_budget: 480,000 (large theatrical set; many phantom anchors)
  texture_budget: 280 MB (palimpsest residue + theatrical materials)
  light_count_limit: 28 (extensive theatrical rigging)
  lod_plan: hero 0-12m full; mid 12-25m simplified phantom audience as billboards; long 25m+ skybox
  streaming: preload ark.bridge; on_master_of_rlyeh: preload faction-radial UI assets
```

---

## H.4 Mechronis Academy (HB4 — Engineering Bay gateway)

**Status: FULL spec.** Cross-ref `INCEPTION_ARK_FINAL_PRODUCTION.md`
§3.12.6 for cosmology + transit + faction answers.

### H.4.1 Header

```
space_id:        hellbox.mechronis_academy
space_name:      Mechronis Academy
space_type:      hellbox_interior  (Matrix-of-Dreams; Mechronis-faction trade-school)
act_introduced:  Act 3
host_room:       ark.engineering_bay (workbench gateway)
lore_anchor:     loredex.system.mechronis_academy + loredex.faction.mechronis + arc.act_3_first_HB4_invocation + arc.crafting_revelations
aesthetic_tier:  architect_geometric  (precise Mechronis-faction trade-school; functional + warm + structurally honest)
```

### H.4.2 Geometry

```
dimensions:           36.00 m × 28.00 m × 12.00 m  (perceptual; bigger-on-inside ratio 4× external Engineering Bay)
origin_point:         centre of central classroom (where the player materialises after transit; corresponds to Engineering's workbench)
coordinate_axes:      +x = right, +y = forward (north — toward master forge), +z = up
floor_plan_geometry:  rectangular  (central classroom + master forge to north + 6 specialist workshops radiating outward)
volumetric_anomalies:
  - bigger_on_inside ratio: 4× external Engineering Bay
  - perpetual_workshop_lighting: continuous warm crafting-light
  - mechronis_apprentice_visualisation: ~30 apprentice NPCs visible at workshops (some real; most cosmetic)
  - tutorial_progress_subtle_evolution: walls + objects slowly add player's accumulated craftworks as visible relief over time
```

The Mechronis Academy is a Matrix-of-Dreams trade school where
the player learns crafting, engineering, and deck-building from
master craftsmen. Functional + warm + structurally honest aesthetic.
Central classroom holds the arrival position; master forge
dominates the north end; 6 specialist workshops radiate outward
(tools / weapons / armor / mechanisms / materials / mastery).

Floor area (perceptual): central classroom ~280 m²; master
forge ~120 m²; 6 workshops ~80 m² each; total ~880 m².

### H.4.3 Floor

```
material_primary:     polished cast-iron grating with anti-slag heat-resistant coating; 1.20 × 1.20 m panels with 50 mm slot pattern
material_secondary:   bronze inlay forming a 6-pointed gear-mandala at central classroom centre; brass perimeter trim; copper-strip inlays demarcating workshop boundaries
pattern:              cast-iron grating + central gear-mandala + 6 radial copper-strip paths to workshops
wear_state:           well-used; central mandala worn by centuries of arrivals; workshop-paths show specific apprentice-pacing
embedded_features:
  - id: hellbox.mechronis_academy.floor.charge_point.player_arrival_mandala
    position: (0.00, 0.00, 0.00)
    dimensions: 1.40 × 1.40 × 0.05
    function: arrival-anchor + return-transit invocation
  - id: hellbox.mechronis_academy.floor.charge_point.master_forge
    position: (0.00, 14.00, 0.00)
    dimensions: 0.60 × 0.60 × 0.10
    function: master forge-fire ignition
  - id: hellbox.mechronis_academy.floor.workshop_threshold.<workshop>  (6 thresholds)
    position: per workshop entrance
    dimensions: varied
    function: workshop-entry threshold
  - id: hellbox.mechronis_academy.floor.slag_drains.<n>  (4 drains)
    position: distributed near master forge + workshops
    dimensions: 0.40 × 0.40 × 0.10 each
    function: slag drainage
acoustic_property:    hard_reflective with industrial echo + workshop-clatter; RT60 = 0.65s
```

### H.4.4 Walls (compact at full FULL fidelity)

#### Central Classroom Walls (4 walls forming a rectangular hub)

```
wall_id:              classroom_perimeter (4 walls)
material_primary:     painted cast-iron honeycomb panel with rivet-detail
material_secondary:   bronze dado at z = 1.20; chalk-board panels for tutorial progress
panelisation:         standard
colour_value:         --token-color-hellbox-mechronis-academy-classroom-wall
embedded_displays:
  - hellbox.mechronis_academy.classroom.south.display.tutorial_progress (0.00, -10.00, 1.80) 1.40 × 1.00 × 0.05; live tutorial progress board
  - hellbox.mechronis_academy.classroom.east.chalkboard (12.00, 0.00, 1.80) 4.00 × 1.50 × 0.05; current lesson
  - hellbox.mechronis_academy.classroom.west.chalkboard (-12.00, 0.00, 1.80) mirror; secondary lesson
embedded_doors:
  - south.return_threshold → ark.engineering_bay (cosmological portal at arrival mandala)
  - north.archway.master_forge (0.00, 12.00, 0.00) 4.00 × 5.00 × 0.20 open_passage → hellbox.mechronis_academy.master_forge
  - east.archway.workshop.<n> (3 east) → workshop sub-spaces (continuous)
  - west.archway.workshop.<n> (3 west) → workshop sub-spaces (continuous)
decorative_features:
  - south.plaque.creed: "THE WORK SHAPES THE WORKER / THE WORKER SHAPES THE WORK"
  - 4 craft-pillar reliefs at corners (precision / patience / persistence / passion); each 1.20 × 4.00 × 0.10
```

#### Master Forge Walls (north end; vertical industrial)

```
wall_id:              master_forge_perimeter
material_primary:     reinforced steel with forge-blackened patina + brick + cast-iron details
material_secondary:   bronze dado; brass forge-rail trim
panelisation:         industrial
colour_value:         --token-color-hellbox-mechronis-academy-master-forge-wall
embedded_displays:
  - heat_indicator (0.00, 18.00, 2.50) 1.20 × 0.80 × 0.05; live forge-temperature
embedded_doors:        none (continuous space)
decorative_features:
  - master_anvil_relief (0.00, 18.00, 5.00) 2.00 × 1.20 × 0.20; "first anvil" canon relief
```

### H.4.5-8 Compact

```
ceiling: 12.00 m baseline; central classroom drop-coffer at 9.00 m; master forge has open vertical chimney rising through ceiling at z=12; 6 workshop ceilings at 8.00 m
lighting:
  ambient_baseline: 3000 K warm-craft; 240 lux; CRI 88
  master_forge_glow: continuous orange-red; 12000 lumens variable; pulses with tutorial-fire
  classroom_pendant: at (0.00, 0.00, 8.50); warm amber; 6000 lumens
  workshop_pendant.<n>×6: per workshop; 3500 lumens each
  practical_sources: anvil_glow×6; bench_lamp_glow×8; tool_rack_subtle_glint
atmosphere: 26°C warm during tutorials / 38% RH / smells of hot iron + ozone + sweat + warm metal + faint coal-smoke
sound:
  ambient_bed: -28 dB; continuous workshop-clatter, master forge-roar, distant Mechronis chants (proto-engineering language), occasional anvil-strike
  point_sources: master_forge_roar; 6 workshop SFX; mechronis_master_voice; apprentice_chatter_distant
  reverb_zone: mechronis_academy_v1.wav wet 26%
  music_eligibility: cutscene only (Mechronis-arc tutorial)
  voice_line_eligibility: the_mechronis_master; ~30 apprentice NPCs (most cosmetic); the_master_of_rlyeh (state-conditional); chant_voices_distant
```

### H.4.9 Object inventory (compact catalogue; 60 inventory objects)

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `hellbox.mechronis_academy.player_arrival_mandala` | fx_emitter+gameplay-anchor | (0.00, 0.00, 0.005) | 1.40 dia × 0.005 | gold-bronze 6-pointed gear-mandala; arrival + return-transit |
| `hellbox.mechronis_academy.classroom.master_lectern` | container | (0.00, 6.00, 0.00) | 0.40×0.30×1.20 | bronze lectern; tutorial-tome |
| `hellbox.mechronis_academy.mechronis_master_anchor` | npc_anchor | (0.00, 5.50, 0.00) | 0.8×0.8×1.8 | THE Mechronis Master |
| `hellbox.mechronis_academy.classroom.student_chairs.<n>` (12) | furniture | classroom seating | 0.80×0.80×1.20 each | apprentice seats |
| `hellbox.mechronis_academy.classroom.east.chalkboard` | display | (12.00, 0.00, 1.80) | 4.00×1.50×0.05 | east lesson |
| `hellbox.mechronis_academy.classroom.west.chalkboard` | display | (-12.00, 0.00, 1.80) | mirror | west lesson |
| `hellbox.mechronis_academy.master_forge.central_forge` | interactive+fx_emitter | (0.00, 18.00, 0.40) | 2.40×2.40×1.40 | THE master forge (fire-pit + chimney) |
| `hellbox.mechronis_academy.master_forge.anvil_central` | interactive | (0.00, 16.00, 0.00) | 0.80×0.40×0.85 | central master anvil |
| `hellbox.mechronis_academy.master_forge.altar.master_of_rlyeh` | interactive | (0.00, 17.00, 0.00) | 1.40×0.80×1.10 | Master of R'lyeh anchor |
| `hellbox.mechronis_academy.workshop.<type>` (6) | container | distributed | 8.00×6.00 each | tools/weapons/armor/mechanisms/materials/mastery |
| `hellbox.mechronis_academy.apprentice_anchor.<n>` (~30) | npc_anchor | distributed | 0.8×0.8×1.8 each | apprentice NPCs |
| `hellbox.mechronis_academy.classroom.tutorial_progress_display` | display | (0.00, -10.00, 1.80) | 1.40×1.00×0.05 | progress board |
| `hellbox.mechronis_academy.classroom.return_transit_indicator_glow` | fx_emitter | at arrival | 0.40 dia | warm gold |
| `hellbox.mechronis_academy.classroom.south.plaque.creed` | decoration | (0.00, -10.00, 3.20) | 1.20×0.40×0.02 | "THE WORK SHAPES THE WORKER" |
| `hellbox.mechronis_academy.classroom.relief.craft_pillars` (4) | decoration | corner pillars at z=4 | 1.20×4.00×0.10 each | precision/patience/persistence/passion |
| `hellbox.mechronis_academy.master_forge.master_anvil_relief` | decoration | (0.00, 18.00, 5.00) | 2.00×1.20×0.20 | "first anvil" |
| `hellbox.mechronis_academy.master_forge.bellows_central` | interactive | (1.50, 18.00, 0.50) | 0.80×0.50×0.40 | master bellows |
| `hellbox.mechronis_academy.master_forge.quench_tanks.<n>` (3) | interactive | along master forge perimeter | 0.80×0.80×1.40 each | water/oil/mercury (tutorial-tier) |
| `hellbox.mechronis_academy.master_forge.tool_rack` | container | flanking master anvil | 0.40×4.00×2.40 | master-tier tools |
| `hellbox.mechronis_academy.master_forge.heat_indicator` | display | (0.00, 18.00, 2.50) | 1.20×0.80×0.05 | live forge-temp |
| `hellbox.mechronis_academy.classroom.intercom_silent + .fire_extinguisher_silent + .first_aid_silent` | various | south wall | varied | cosmologically silent |
| `hellbox.mechronis_academy.master_of_rlyeh_voice_emitter` | fx_emitter | at master forge altar | n/a | Master of R'lyeh voice |
| `hellbox.mechronis_academy.tutorial_completion_indicator_array` | fx_emitter | east + west walls | n/a | tutorial-completion lights (one per lesson) |
| `hellbox.mechronis_academy.compass_inlay_central` | decoration | at arrival mandala | already specced | floor inlay |

Total: 60 inventory objects.

### H.4.10-17 Compact

```
camera_spawn_points:
  cs_hellbox_4_arrival (Act 3 first-time + every visit): POV at gear-mandala; classroom emerges from workbench-residue dissolution; 12s
  cs_first_mechronis_lesson (Act 3): seated at student chair; Mechronis Master enters from north; first tutorial begins
  cs_master_of_rlyeh_question: POV at master forge altar; "Is the worker the work, or the work's prisoner?"; radial menu
  cs_tutorial_completion (state-conditional): tutorial-progress display updates; classroom relief expands
  cs_hellbox_4_close: POV at arrival mandala; ~5s fade; workbench re-materialises in Engineering Bay with new tools added (per §3.12.6)

doorways: return_transit_anchor → ark.engineering_bay (host)

adjacency:
  direct: ark.engineering_bay; 6 workshop sub-spaces (continuous); master forge
  one_hop: hellbox.master_hellbox (HB5); ark.forge_workshop (kinship)
  state_shared: ark.engineering_bay (HB4 faction-pull); player's crafting recipe cache (tutorial completions unlock recipes)

gameplay_hooks:
  - hb4.return_transit
  - hb4.start_tutorial (per-lesson; ~24 lessons)
  - hb4.complete_tutorial (one-shot per lesson; updates progress + unlocks recipe)
  - hb4.invoke_master_of_rlyeh
  - hb4.commit_faction_answer
  - hb4.converse_mechronis_master
  - hb4.read_tutorial_tome
  - hb4.use_master_forge (Act 5+; legendary-tier)
  - hb4.quench_piece (per quench-tank)

story_tie:
  primary_arcs:
    - act_3_first_HB4_invocation
    - act_3_first_mechronis_lesson
    - mechronis_master_arc
    - cumulative_crafting_progression (Acts 3-7)
    - act_7_legendary_master_smith (state-branched)
  per_act:
    acts_0_2: locked
    act_3: first invocation + first tutorials
    act_4: more workshops + Master of R'lyeh first asked
    act_5: legendary tier unlocked
    act_6: deep apprentice dialogues
    act_7: state-branched: Mechronis-master ending vs. abandoned-bench ending
  npc_roster: the_mechronis_master; ~30 apprentices; the_master_of_rlyeh (voice); chant_voices_distant
  readables:
    - creed plaque (south)
    - 4 craft-pillars reliefs
    - master anvil relief
    - tutorial-tome
    - 24 tutorial chalkboards
    - 6 workshop curriculum displays
  master_of_rlyeh_question: "Is the worker the work, or the work's prisoner?"
  faction_answers: per §3.12.6 (Architect Remnants strongest pull)

special_fx:
  particle_systems: forge_smoke (medium); ember (low); sparks (workshop); apprentice_breath_motes; tutorial_completion_motes (state-conditional)
  volumetric: master_forge_glow_envelope; classroom_pendant_scatter; workshop_pendant_glows; chimney_internal_volumetric
  procedural_animations: forge_fire_dance; apprentice_idle_workshop_loops; chalkboard_subtle_chalk-shift; tutorial_progress_continuous_update
  reactive_systems: master_forge_intensify_on_proximity; apprentice_acknowledgement_on_pass; tutorial_completion_one_shot; master_of_rlyeh_invocation_one_shot; relief_panel_expansion_on_completion

avatar_parametricity: small_xenomorph alternate stand-on-step at master forge + benches; others all-reachable
audio_occlusion: xenomorph: workshop-clatter overwhelming; chant-voices more pronounced

performance:
  polygon_budget: 720,000 (large workshop complex; many anchors)
  texture_budget: 420 MB (industrial materials + apprentice unique textures)
  light_count_limit: 32
  lod_plan: hero 0-15m full; mid 15-35m simplified workshops; long 35m+ skybox
  streaming: preload ark.engineering_bay; on_workshop_approach: preload that workshop interior; on_master_forge_use: preload legendary-tier crafting assets
```

---

## H.5 Universal Selector (HB5 — Personal Quarters gateway; navigation hub)

**Status: FULL spec.** Cross-ref `INCEPTION_ARK_FINAL_PRODUCTION.md`
§3.12.7. Unique among Hellboxes: navigation-only, no Master of
R'lyeh question, no faction-pull mechanic.

### H.5.1 Header

```
space_id:        hellbox.master_hellbox  (canonical alternate name; "Universal Selector" is the user-facing display name)
space_name:      Universal Selector
space_type:      hellbox_interior  (navigation-hub; smallest of all Hellbox interiors)
act_introduced:  Act 0 latent (visible but unresponsive); Act 7 active
host_room:       ark.captain_quarters (Personal Quarters; bedside locker brass-trim dial gateway)
lore_anchor:     loredex.system.universal_selector + arc.act_7_master_hellbox_activation
aesthetic_tier:  matrix_dream  (minimal; the room is intentionally unfurnished — the dial IS the destination)
```

### H.5.2 Geometry

```
dimensions:           8.00 m × 8.00 m × 4.00 m  (perceptual; intentionally compact)
origin_point:         centre of floor (player materialises here)
coordinate_axes:      +x = right, +y = forward (north — toward dial display), +z = up
floor_plan_geometry:  circular  (4.00 m radius; 12 demarcation lines radiating from centre)
volumetric_anomalies:
  - bigger_on_inside ratio: 2× external (smallest perceptual expansion of any Hellbox)
  - dial_orientation: the room itself is the dial; floor lines + ceiling pattern align with 12 destinations
  - destination_preview_glimpses: each of 12 destination zones is faintly visible as a subtle "edge" of the room
```

The Universal Selector is intentionally minimal. The room IS the
dial. Player stands at centre. 12 demarcation lines radiate from
centre to perimeter — one per Hellbox destination. The dial is
gameplay-mechanically rotated; a subtle preview-glimpse of that
destination materialises as the dial points to it. Activating the
dial transports the player to that destination's interior.

Floor area (perceptual): ~50 m².

### H.5.3 Floor

```
material_primary:     polished obsidian-black slate; mirror-finish; 0.30 × 0.30 m tiles in concentric rings around centre
material_secondary:   gold-leaf inlay forming a 12-pointed star at centre + 12 radial demarcation lines reaching the perimeter (each line marked with the Hellbox name + a small symbol of the destination)
pattern:              concentric rings + radial lines + central 12-point star
wear_state:           pristine (cosmologically pristine — the dial is sacred infrastructure)
embedded_features:
  - id: hellbox.master_hellbox.floor.charge_point.dial_centre
    position: (0.00, 0.00, 0.00)
    dimensions: 0.40 dia × 0.05
    function: dial centre; player materialises here + invokes return-transit
  - id: hellbox.master_hellbox.floor.dial_demarcation.<n>  (12 lines; one per destination)
    position: radiating from centre at 30° intervals
    dimensions: 0.05 × 4.00 m × 0.005 each
    function: dial selection
acoustic_property:    hard_reflective (mirror-finish); RT60 = 0.40s
```

### H.5.4 Walls

```
wall_id:              perimeter_curved (single continuous curved wall)
material_primary:     polished obsidian-black marble cladding curving with the room
material_secondary:   gold-leaf rim around the perimeter at z = 1.20 + bronze trim at z = 0.05
panelisation:         single curved surface
colour_value:         --token-color-hellbox-master-hellbox-wall  (deep obsidian-black with gold accents)
embedded_displays:    none
embedded_doors:        none
decorative_features:
  - id: hellbox.master_hellbox.destination_preview_panel.<n>  (12 panels; one per Hellbox at perimeter)
    position: at perimeter; 12 panels at 30° intervals at z = 1.50 to 3.50
    dimensions: 1.20 wide × 2.00 tall × 0.05 each
    material: deep obsidian-black backing with subtle preview-image of each destination
    narrative_role: preview panels showing each Hellbox destination
  - id: hellbox.master_hellbox.wall.principle_inscription
    position: ringing perimeter at z = 0.50
    dimensions: ringed gold-leaf inscription
    material: gold-leaf engraved on obsidian
    narrative_role: reads "ALL ROADS, ONE TURN"
```

### H.5.5-8 Compact

```
ceiling: 4.00 m baseline; central oculus rises to 5.00 m (subtle dome); polished obsidian-black with gold-leaf coffer pattern matching floor
lighting:
  ambient_baseline: 2400 K very warm; 80 lux (very dim — dial is the light source); CRI 90
  oculus_central: 1500 lumens warm amber (intentionally low — minimal aesthetic)
  dial_centre_glow: variable; 500 lumens; intensifies during selection
  destination_preview_backlight.<n>×12: per panel; 300 lumens each (matches that destination's primary colour-token)
  practical_sources: demarcation_line_subtle_glow.<n>×12; 100 lumens/m; flows on selection
atmosphere: 19°C cool / 38% RH / smells of cold-stone + bronze + faint ozone (cosmic-radiation residue) + brass (the dial)
sound:
  ambient_bed: -42 dB extremely quiet; cosmic-resonance harmonic + faint distant chimes (one per destination)
  point_sources: cosmic_resonance from oculus; destination_preview_chime per panel; dial_lock_in_tone; transit_invocation_drone
  reverb_zone: master_hellbox_v1.wav wet 36% (cosmologically resonant)
  music_eligibility: cutscene only (Act 7 first activation); silent otherwise (intentional)
  voice_line_eligibility: master_of_rlyeh (rare; one-shot on first Act 7 activation: "ALL ROADS, ONE TURN — choose")
```

### H.5.9 Object inventory (compact catalogue; 28 inventory objects)

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `hellbox.master_hellbox.dial_centre_anchor` | fx_emitter+gameplay-anchor | (0.00, 0.00, 0.005) | 0.40 dia × 0.005 | central gold-leaf dial; player materialises here + invokes |
| `hellbox.master_hellbox.demarcation_line.<n>` (12) | decoration+fx_emitter | radiating at 30° intervals | 0.05 × 4.00 m × 0.005 each | 12 destination-pointers (one per HB) |
| `hellbox.master_hellbox.destination_preview_panel.<n>` (12) | display | at perimeter at 30° intervals | 1.20 × 2.00 × 0.05 each | 12 preview panels |
| `hellbox.master_hellbox.wall.principle_inscription` | decoration | ringing perimeter at z=0.50 | continuous gold-leaf | "ALL ROADS, ONE TURN" |
| `hellbox.master_hellbox.cosmological_resonance_emitter` | fx_emitter | distributed | n/a | cosmological motes source |
| `hellbox.master_hellbox.compass_inlay_central` | decoration | (0.00, 0.00, 0.005) | 0.40 dia × 0.005 | already specced; central 12-point star |

Total: 28 inventory objects.

### H.5.10-17 Compact

```
camera_spawn_points:
  cs_hellbox_5_open_latent (Acts 0-6 first encounter; latent state): hand-rig opens drawer; brass-trim dial visible; tooltip "the dial does nothing yet"; ~6s; player does NOT enter Hellbox in latent state
  cs_hellbox_5_first_activation (Act 7 one-shot; FULL Hellbox entry): hand-rig on dial; dial spins; demarcation lines flow; first-time wonder; ~12s
  cs_hellbox_5_destination_selection (every Act 7+ visit): player rotates; preview panels shift focus; lock-in tone on selection
  cs_hellbox_5_close (return-transit): dial spins back; ~3s ceremonial fade

doorways:
  return_transit_anchor → ark.captain_quarters (host room — Personal Quarters bedside locker)
  destination-portal doors: 12 (one per HB; activated by selecting + invoking dial)

adjacency:
  direct: ark.captain_quarters (return-transit); 12 destinations (HB1-HB12 via dial selection)
  state_shared: all 12 Hellbox interiors (tracks unlocked destinations)

gameplay_hooks:
  - hb5.return_transit
  - hb5.select_destination (player.step on demarcation_line.<n>)
  - hb5.invoke_destination_transit (one-shot per visit)
  - hb5.preview_destination (player.face panel)

story_tie:
  primary_arcs: act_7_master_hellbox_activation; universal_selector_endgame_navigation
  per_act:
    acts_0_6: latent state (dial visible but unresponsive; locker drawer cutscene only)
    act_7: active; first-activation cutscene; full dial responsive; player can revisit any unlocked Hellbox
  npc_roster: the_master_of_rlyeh (one-shot Act 7 acknowledgement); no other NPCs (intentional minimalism)
  readables: principle_inscription ("ALL ROADS, ONE TURN"); 12 destination-preview panels
  master_of_rlyeh_question: NONE (navigation-only)

special_fx: cosmological_resonance_motes; dial_demarcation_flow (state-conditional); destination_preview_subtle_glow×12
volumetric: oculus_warm_glow; dial_centre_radiance; demarcation_line_glow_envelope (per-line; flow when selected)
procedural: dial_subtle_idle_rotation (very slow); preview_panel_image_subtle_breath (cosmologically connected to destinations)
reactive: demarcation_line_flow_on_step; preview_intensify_on_face; dial_centre_glow_on_destination_locked; transit_drone_one_shot

avatar_parametricity: small_xenomorph: alternate kneel-to-select; preview panels at face-level for tall avatars; others all-reachable
audio_occlusion: xenomorph: cosmological resonance more pronounced; chimes audible from any angle

performance:
  polygon_budget: 120,000 (intentionally minimal — matching aesthetic)
  texture_budget: 80 MB total
  light_count_limit: 16 (oculus + 12 preview backlights + dial centre + 2 ambient)
  lod_plan: hero 0-6m full; mid 6m+ mid (room is too small for distant LOD)
  streaming: preload ark.captain_quarters; on_destination_locked: preload that destination's interior (faster transit); precache_priority: HB5 is itself precached on Act 7 +
```

---

## H.6 Dead Man's Circuit (HB6 — Memorial Corridor gateway)

**Status: FULL spec.** Cross-ref `INCEPTION_ARK_FINAL_PRODUCTION.md`
§3.12.8.

### H.6.1 Header

```
space_id:        hellbox.dead_mans_circuit
space_name:      Dead Man's Circuit
space_type:      hellbox_interior  (Matrix-of-Dreams; racing-circuit)
act_introduced:  Act 4
host_room:       ark.memorial_corridor (procession-stone gateway)
lore_anchor:     loredex.system.dead_mans_circuit + arc.act_4_first_dead_mans_race + loredex.character.master_of_rlyeh
aesthetic_tier:  matrix_dream + speed-circuit overlay  (impossible mountain-circuit; 1960s-style speed-aesthetic crossed with cosmic-vastness)
```

### H.6.2 Geometry

```
dimensions:           240.00 m × 180.00 m × 60.00 m  (perceptual; bigger-on-inside ratio 18× external Memorial Corridor)
origin_point:         starting grid centre line (where the player + ghosts line up at start of race)
coordinate_axes:      +x = right, +y = forward (along race direction), +z = up
floor_plan_geometry:  non_euclidean  (a closed circuit with start/finish line; track loops impossibly through alpine landscape; track is ~3.6 km perceptual length)
volumetric_anomalies:
  - bigger_on_inside ratio: 18× external Memorial Corridor
  - perpetual_dusk_with_storm: continuous twilight + occasional thunder-flash cosmically; lighting feels charged + tense
  - track_extends_impossibly: the closed-circuit track loops through alpine cliffs + tunnel sections; ~3.6 km perceptual
  - ghost_visibility: 8 spectral racers (every player who has died in this game; cumulative across player lifetimes — including the current player's prior deaths) appear as glowing-edge silhouette racers
  - lap_compression: track has 4 lap-zones; perceptual time + space compress between laps (each subsequent lap is subtly shorter/faster)
```

The Dead Man's Circuit is THE unwinnable race. Player races
8 spectral ghosts — every player who has died in canon (including
the current player's prior deaths from §3.1.A.5). The lead ghost
is ALWAYS 0.5s ahead. The race CANNOT be won. The gameplay is in
HOW you race a race you cannot win.

The track is a closed-circuit alpine racetrack; ~3.6 km
perceptual. Start/finish line at south (where player materialises).
Track loops north through cliff-side switchbacks + tunnel +
mountain-pass + cathedral-cliff section + return. Memorial
viewing-stands flank start/finish.

Floor area (perceptual): track ~32,400 m² (3,600 m × 9 m wide)
+ start/finish + viewing stands ~2,000 m².

### H.6.3 Floor

```
material_primary:     racing-asphalt with white centerline + red-and-white kerbing at corners; 9.00 m wide track surface
material_secondary:   bronze inlay forming a 4-sector lap-marker pattern (lap zones marked at 25/50/75/100% perceptual completion); brass perimeter at start/finish line; concrete barriers + tire-walls on outside of corners
pattern:              standard racing-circuit asphalt + kerbing + sector demarcations
wear_state:           well-used; rubber-marbles + tire-streaks visible at apex of every corner; brake-zones discoloured
embedded_features:
  - id: hellbox.dead_mans_circuit.floor.charge_point.start_finish_line
    position: (0.00, 0.00, 0.00)  # at race start
    dimensions: 9.00 × 0.20 × 0.05
    function: race-start anchor + return-transit invocation
  - id: hellbox.dead_mans_circuit.floor.lap_marker.<n>  (4 lap markers; sectors 1-4)
    position: distributed along track at perceptual quarter-points
    dimensions: 9.00 × 0.20 × 0.05 each
    function: lap completion detection
  - id: hellbox.dead_mans_circuit.floor.pit_lane_threshold
    position: (-2.00, 0.00, 0.00)  # to the side of start/finish
    dimensions: 4.00 × 0.20 × 0.05
    function: pit-lane access (gameplay-passive; viewing-stands area)
acoustic_property:    hard_reflective (asphalt + concrete) with engine-resonance + wind-noise; RT60 = 1.20s in tunnel, 0.30s on open track (highly variable)
```

### H.6.4 Walls (track perimeter + viewing stands + tunnel)

#### Track Perimeter Walls (concrete barriers + tire-walls along entire 3.6 km loop)

```
wall_id:              track_perimeter  (continuous along inside + outside of track)
material_primary:     concrete safety-barriers (1.20 m tall) on outside of corners + at high-speed sections; reinforced steel tire-walls (stacked tires) at high-impact zones
material_secondary:   safety-fence (chain-link + catch-fence) above barriers in spectator-adjacent zones; bronze sponsorship plaques at strategic positions
panelisation:         continuous; concrete-formed
colour_value:         --token-color-hellbox-dead-mans-circuit-barrier  (concrete-grey + warning-amber stripe + black tire-wall)
embedded_displays:
  - id: hellbox.dead_mans_circuit.start_finish.scoreboard
    position: (0.00, 0.00, 8.00)  # high above start/finish line
    dimensions: 6.00 × 2.40 × 0.10
    content: live race state — player position vs. 8 ghosts (always shows lead ghost 0.5s ahead); lap counter; sector splits
embedded_doors:
  - door_id: hellbox.dead_mans_circuit.return_transit_anchor
    position: (0.00, 0.00, 0.005)  # at start/finish line
    dimensions: n/a (cosmological)
    door_class: portal
    connecting_space_id: ark.memorial_corridor (host)
decorative_features:
  - id: hellbox.dead_mans_circuit.sponsorship_plaque.<n>  (~30 along track)
    position: distributed
    dimensions: 1.40 × 0.60 × 0.04 each
    material: bronze with engraved canonical sponsor names (each canonically a dead crew member's family — humanising)
    narrative_role: every "sponsor" is a fallen-crew family; viewing the plaques reveals lore
  - id: hellbox.dead_mans_circuit.cathedral_cliff_section
    position: at perceptual 60% lap mark
    dimensions: 200 m long section through cathedral-cliff
    material: vast cathedral-style stone-cliff carved with memorial reliefs; track passes between two cliff-faces
    narrative_role: most cinematically dramatic stretch; reliefs depict deceased racers
```

#### Viewing Stands (south of start/finish; 3-tier; phantom audience)

```
wall_id:              viewing_stands_perimeter  (3-tier seating south of start/finish)
material_primary:     concrete + steel tier-rails + crimson-velvet bench tops
material_secondary:   bronze tier-divider rails
panelisation:         tiered concrete
colour_value:         --token-color-hellbox-dead-mans-circuit-stands
embedded_displays:    none (track is the content)
embedded_doors:        none
decorative_features:
  - id: hellbox.dead_mans_circuit.viewing_stands.tier.<n>  (3 tiers)
    position: south of start/finish at z = 0.40, 1.60, 2.80
    dimensions: 12.00 m wide × 0.50 × 0.40 each tier (~80 phantom seats per tier; 240 total)
    material: concrete + steel + crimson-velvet
    narrative_role: phantom audience; ~240 seats; canonical mourning families of deceased racers
  - id: hellbox.dead_mans_circuit.podium
    position: (0.00, -8.00, 0.40)  # south of start/finish
    dimensions: 4.00 × 1.20 × 0.40 (raised platform with 3 podium-step heights)
    material: polished walnut + gold-leaf trim
    narrative_role: victory podium — never used (no winners); 3 podium positions remain canonically empty
```

### H.6.5-8 Compact (full FULL fidelity)

```
ceiling: open sky overhead at most of track (perceptual); cathedral-cliff section has impossibly tall stone cliffs reaching z = 60+; tunnel section has solid stone ceiling at z = 8.00
lighting:
  ambient_baseline: 2000 K (perpetual dusk; storm-charged); 100 lux at track (intentionally dim — race-night atmosphere); CRI 80
  scoreboard_glow: at scoreboard; 4000 lumens; pulses with leader-ghost time-gap
  sponsorship_plaque_uplights: per plaque; 200 lumens each; warm bronze
  cathedral_cliff_volumetric: vast warm-amber cone bleeding from impossibly-tall cliff-tops down onto track at cathedral section
  starting_grid_lights: 8 grid-lights for race-start sequence (5 reds + 1 green + 2 amber)
  pit_lane_strip: warm amber along pit lane
  practical_sources: thunder-flash (cosmetic; periodic; storm-charged); ghost_racer_glow (8 sources; spectral edges)
atmosphere: 14°C cool / 65% RH (alpine humidity) / smells of hot-asphalt + race-fuel + burnt-rubber + cold-mountain-air + ozone (storm)
sound:
  ambient_bed: -22 dB (loud; race environment); engine-roar from 8 ghost racers; wind-howl through cliff-section; thunder-distant; phantom audience cheering
  point_sources: engine_roar.<ghost>×8 (Doppler-shifted as ghosts pass); thunder_flash_periodic; cathedral_choir_distant (faint; emerges at cathedral-cliff section); commentator_voice (canonical race-commentary; uncomfortably present)
  reverb_zone: dead_mans_circuit_v1.wav wet 24% open-air baseline; 0.85 in tunnel section; 1.20 in cathedral-cliff
  music_eligibility: ambient music ALLOWED — race-tension orchestral pad at -28 dB; intensifies during cathedral section + final lap
  voice_line_eligibility: master_of_rlyeh (state-conditional during pre-race + faction-answer); commentator (continuous race-commentary); the_8_ghost_racers (no spoken lines — only engine-roar)
```

### H.6.9 Object inventory (compact catalogue; 64 inventory objects)

| object_id | class | position | dim | role |
|---|---|---|---|---|
| `hellbox.dead_mans_circuit.start_finish_line_anchor` | fx_emitter+gameplay-anchor | (0.00, 0.00, 0.005) | 9.00 × 0.20 × 0.005 | white start/finish line; arrival + return-transit |
| `hellbox.dead_mans_circuit.player_starting_grid_position` | npc_anchor | (0.00, -2.00, 0.00) | 1.00 × 2.00 grid-spot | player materialises at grid position #1 |
| `hellbox.dead_mans_circuit.ghost_racer_grid_position.<n>` (8) | npc_anchor | distributed in 9-position grid (player at 1; 8 ghosts at 2-9) | 1.00 × 2.00 each | ghost-racer grid spots; 8 ghosts |
| `hellbox.dead_mans_circuit.ghost_racer.<n>` (8) | npc_anchor | dynamic (race) | varied | 8 spectral ghost racers; canonical: every player who has died in this game's lineage |
| `hellbox.dead_mans_circuit.start_finish.scoreboard` | display | (0.00, 0.00, 8.00) | 6.00 × 2.40 × 0.10 | live race state; always shows lead 0.5s ahead |
| `hellbox.dead_mans_circuit.starting_grid_lights.<n>` (8) | fx_emitter | above start/finish | 0.30 × 0.30 each | 5 reds + 1 green + 2 amber (race-start sequence) |
| `hellbox.dead_mans_circuit.podium` | decoration | (0.00, -8.00, 0.40) | 4.00 × 1.20 × 0.40 | victory podium (perpetually empty) |
| `hellbox.dead_mans_circuit.viewing_stands.tier.<n>` (3) | furniture+phantom_anchors | south of start/finish | 12.00 × 0.50 × 0.40 each | 3-tier viewing stands; ~240 phantom audience |
| `hellbox.dead_mans_circuit.sponsorship_plaque.<n>` (~30) | decoration | distributed along track | 1.40 × 0.60 × 0.04 each | bronze plaques; canonical fallen-crew families |
| `hellbox.dead_mans_circuit.lap_marker.<n>` (4) | fx_emitter | at sector-marks | 9.00 × 0.20 × 0.05 each | lap-completion detection markers |
| `hellbox.dead_mans_circuit.cathedral_cliff_section` | decoration | at 60% lap | 200 m long stone-cliff section | most cinematic stretch; cathedral-aesthetic stone cliffs with memorial reliefs |
| `hellbox.dead_mans_circuit.cathedral_cliff_relief.<n>` (~12 reliefs) | decoration | along cathedral section | 4.00 × 2.40 × 0.30 each | depicts deceased racers (12 canonical figures) |
| `hellbox.dead_mans_circuit.tunnel_section` | decoration | at 25% lap | 80 m long stone tunnel | acoustic shift + dim atmosphere |
| `hellbox.dead_mans_circuit.mountain_pass_section` | decoration | at 75% lap | 100 m long alpine pass | open + windy; thunder-flash visible |
| `hellbox.dead_mans_circuit.altar.master_of_rlyeh` | interactive | (-4.00, 0.00, 0.00) | 1.40 × 0.80 × 1.10 | Master of R'lyeh anchor (pre-race ritual); "If you knew the race was already lost, would you still run?" |
| `hellbox.dead_mans_circuit.commentator_booth` | decoration+fx_emitter | (10.00, -4.00, 4.00) | 2.40 × 1.40 × 1.20 | elevated commentator box; emanates race-commentary |
| `hellbox.dead_mans_circuit.pit_lane_threshold` | decoration | (-2.00, 0.00, 0.00) | 4.00 × 0.20 × 0.05 | pit-lane entry |
| `hellbox.dead_mans_circuit.pit_garage.<n>` (9) | decoration | along pit lane | 4.00 × 6.00 × 4.00 each | 9 pit garages (1 player + 8 ghost) |
| `hellbox.dead_mans_circuit.thunder_flash_emitter` | fx_emitter | distributed in sky | n/a | periodic thunder-flash + lightning |
| `hellbox.dead_mans_circuit.return_transit_indicator_glow` | fx_emitter | at start/finish | 0.40 dia | warm gold |
| `hellbox.dead_mans_circuit.south.plaque.principle` | decoration | (-4.00, -2.00, 3.20) | 0.80 × 0.30 × 0.02 | "RACE THE LOST RACE" |

Total: 64 inventory objects.

### H.6.10-17 Compact

```
camera_spawn_points:
  cs_hellbox_6_arrival (Act 4 first-time + every visit): POV at grid position 1; engines roar around; scoreboard lights up with player's name + 8 ghost names; start-light sequence begins; 18s
  cs_master_of_rlyeh_question (pre-race): POV at altar near grid; "If you knew the race was already lost, would you still run?"; radial menu
  cs_race_start: 5-red countdown lights; greens; engines flare; race begins
  cs_lap_completion (per lap): scoreboard updates; ghost-times pulse; player remains 0.5s behind lead-ghost
  cs_cathedral_cliff_pass: POV during cathedral-cliff section; reliefs visible; choral pad swells; commentary acknowledges lap
  cs_race_end (4 laps complete): finish line; player crosses; scoreboard shows "FINISHED" — but lead-ghost remains 0.5s ahead; podium ceremony with empty podium
  cs_hellbox_6_close: POV at start/finish; ~5s ceremonial fade

doorways: return_transit_anchor → ark.memorial_corridor (host)

adjacency:
  direct: ark.memorial_corridor (return-transit)
  one_hop: hellbox.master_hellbox (HB5 if Act 7); hellbox.celebration_school (HB1; thematic kinship)
  state_shared: ark.memorial_corridor (HB6 faction-pull); the player's death-history (8 ghost racers; cumulative)

gameplay_hooks:
  - hb6.return_transit
  - hb6.invoke_master_of_rlyeh (pre-race; one-shot per visit)
  - hb6.commit_faction_answer
  - hb6.start_race
  - hb6.complete_lap (per lap; 4 total)
  - hb6.finish_race
  - hb6.read_sponsorship_plaque (per-plaque; ~30)
  - hb6.read_cathedral_relief (per-relief; ~12)
  - hb6.inspect_podium

story_tie:
  primary_arcs:
    - act_4_first_dead_mans_race
    - dead_mans_circuit_canon
    - cumulative_death_lineage (each player-death adds a ghost-racer; cumulative across player + canon)
    - act_7_lifetime_race (state-branched)
  per_act:
    acts_0_3: locked
    act_4: first race; first ghost-racers (canonical-deaths from prior playthrough lineage)
    acts_5_7: more ghost-racers as more deaths occur; cathedral-cliff reliefs accumulate
    act_7: state-branched: persistent-runner ending (player has run repeatedly despite never winning) vs. minimal-engagement ending
  npc_roster:
    - 8 ghost racers (cumulative from death history; never visible-clear; spectral-glow silhouettes)
    - the_commentator (named NPC; voice-only)
    - phantom_audience (~240; mourning families)
    - the_master_of_rlyeh (pre-race + answer moments only)
  readables:
    - principle plaque (south)
    - ~30 sponsorship plaques
    - ~12 cathedral-cliff reliefs
    - scoreboard (live race state + lap history)
    - canonical race-commentary log (multi-screen)
  master_of_rlyeh_question: "If you knew the race was already lost, would you still run?"
  faction_answers: per §3.12.8 (Hierarchy strongest)

special_fx: race_dust + tire-rubber + thunder + cathedral-cliff motes + ghost_racer_spectral_glow (8 sources)
volumetric: cathedral_cliff_volumetric_beams; thunder_flash_envelope; engine_doppler-shift visualisation; ghost_racer_glow_envelopes
procedural: race_continuous_loop; sponsorship_plaque_subtle_glow; cathedral_relief_subtle_animation; ghost_racer_idle_animations + race-loop animations
reactive: scoreboard_continuous_update; lap_marker_flash_on_completion; podium_remain_empty (intentional); cathedral_choir_swell_on_pass

avatar_parametricity: small_xenomorph: alternate kart-cockpit fitting (cosmetic); others all-reachable (race-vehicles auto-fit)
audio_occlusion: xenomorph: engine-roar overwhelming; cathedral choir more pronounced; thunder pronounced

performance:
  polygon_budget: 1,200,000 (very large 3.6 km circuit; many props + LOD critical)
  texture_budget: 700 MB (track + 8 ghost-racer unique + cathedral-cliff materials + sky + alpine)
  light_count_limit: 32 (race-environment lighting + 8 ghost-glows + scoreboard + grid-lights)
  lod_plan: hero 0-25m full; mid 25-100m simplified; long 100m+ (most of track) low (essential prop + skybox)
  streaming: preload ark.memorial_corridor; on_lap_completion: stream next sector ahead; on_cathedral_cliff_approach: load reliefs + cathedral-choir audio
```
