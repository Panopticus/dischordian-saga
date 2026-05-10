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
