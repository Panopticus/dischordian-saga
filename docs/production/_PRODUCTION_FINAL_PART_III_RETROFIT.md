# _PRODUCTION_FINAL — PART III spec retrofit (5 NEW rooms)

Closes `_MISSING_ART_PROMPTS.md` **§E**. Five Ark rooms were
producer-delivered in earlier passes ("NEW; not in original spec";
flagged by `roomArtCoverageReport().producerNewNotInSpec`) but
never received a `_PRODUCTION_FINAL.md` PART III §4 architect spec.
This file is the retrofit. Once merged + cross-cut into the main
production doc, every entry in
`roomArtManifest.ROOM_ART_ZIP_DIRS` will have a corresponding §4
spec.

These five rooms ARE on CDN today — art is live, manifests resolve,
runtime renders them. The deliverable here is **documentation
parity**, not new art.

Each spec follows the canonical 17-layer architect format used
across PART III:
header / geometry / floor / walls / ceiling / lighting / atmosphere /
sound / objects / camera-spawn-points / doorways / adjacency /
gameplay-hooks / story-tie / FX / parametricity / performance.

All coordinates in metres (precision 0.01 m), rotations in degrees
yaw (0–359, precision 0.1°). All colours bound to design tokens
(`--token-color-room-<room>-<element>` — no raw hex; void-energy
compliant). All cutscene camera-spawn-points first-person POV per
§3.1.0.

---

## §III-R.1 ark.auction_house — Auction House

### Header

```
space_id:        ark.auction_house
space_name:      Auction House (apprentice goods exchange + bidding rotunda)
space_type:      ark_room
act_introduced:  Act 2 (paired with Trade Empire unlock)
lore_anchor:     loredex.system.auction + arc.act_2_first_bid + loredex.location.commerce_districts
aesthetic_tier:  solar_punk_cathedral + commerce-warm
canonical_zipdir: auction_house
producer_status: delivered NEW (no original spec); CDN URL: cdn/client-public/art/rooms/auction_house/baseline.png
```

The Auction House is the Inception Ark's player-facing goods
exchange: a circular bidding rotunda where apprentices, crew, and
visiting merchants trade rare resources, signature cards, salvaged
relics, and chartered missions. The room reads as solemn-but-warm
— commerce as ritual, bidding as confession. The architecture
borrows the bell-curve nave of a 19th-century stock exchange but
finishes every surface in brass + warm walnut + amber lamplight.

### Geometry

```
dimensions:           16.00 m diameter × 9.50 m height (cylindrical rotunda)
origin_point:         centre of the auction floor at the bidding-stone podium
coordinate_axes:      +x = east (toward the doorway from the commerce district), +y = north (toward the auctioneer's dais), +z = up
floor_plan_geometry:  perfect circle with central podium + 12 radial bidding stations + raised dais at +y boundary
volumetric_anomalies: none
```

Floor area: 201.06 m². Twelve bidding stations are arrayed around
the rotunda at the cardinal + secondary intercardinal compass
points (30° spacing). The auctioneer's dais sits flush against
the +y wall; the bidding-stone podium sits at origin.

### Floor

```
material_primary:     polished walnut parquet laid in a sunburst pattern radiating from origin; 0.30 m × 0.30 m panels with brass inlay seams
material_secondary:   warm bronze edging at the bidding-station perimeters; brass arc at +y boundary delimiting the dais zone
pattern:              12-spoke sunburst centred on the bidding stone, with concentric brass rings at r=2.00 m, r=4.00 m, r=6.00 m
wear_state:           moderate at the bidding stations (years of boot-traffic); pristine on the dais (the auctioneer never moves)
embedded_features:
  - id: ark.auction_house.floor.bidding_stone
    position: (0.00, 0.00, 0.00)
    dimensions: 0.80 × 0.80 × 0.15
    function: central bidding stone — players slap their bid token here
  - id: ark.auction_house.floor.dais_step
    position: (0.00, 6.50, 0.00)
    dimensions: 4.00 × 0.40 × 0.30
    function: rise to the auctioneer's dais
  - id: ark.auction_house.floor.station_socket.<n>  (12 sockets at compass spokes; r=5.50 m)
    position: per spoke
    dimensions: 0.40 × 0.40 × 0.08 each
    function: bidding-station electronics + token-charge plate
acoustic_property:    hard_reflective (walnut + brass) with carpeted dampers under each station; RT60 = 1.4 s (a "good auction house" sound — your voice carries but doesn't smear)
```

### Walls

#### Wall: South (entry; from commerce district)

```
wall_id:              south_entry
material_primary:     polished walnut wainscoting to z = 1.20 m; warm-amber plaster above
material_secondary:   brass dado at z = 1.20 m; brass crown at z = 6.50 m
panelisation:         curved (radius 8.00 m); standard 0.80 m wainscot panels
colour_value:         --token-color-room-auction-house-wall-entry (warm walnut + amber plaster + brass)
embedded_displays:
  - id: ark.auction_house.south.display.upcoming_lots
    position: (0.00, -8.00, 2.20)
    dimensions: 2.40 × 1.20 × 0.06
    content: scrolling list of upcoming lots + reserve prices
embedded_doors:
  - door_id: ark.auction_house.south.entry
    position: (0.00, -8.00, 0.00)
    dimensions: 1.80 × 2.60 × 0.20  (double-door swing-out)
    door_class: standard_swing
    connecting_space_id: ark.commerce_districts.atrium
    unlock_condition: trade_empire_unlocked === true
decorative_features:
  - id: ark.auction_house.south.lantern.<n>  (2 lanterns; flanking entry)
    position: (-1.20, -7.95, 2.20) and (1.20, -7.95, 2.20)
    dimensions: 0.30 × 0.30 × 0.50 each
    material: brass with warm-amber globe
    narrative_role: greeting glow
```

#### Wall: North (auctioneer's dais wall)

```
wall_id:              north_dais
material_primary:     polished walnut wainscoting (full height; no plaster band)
material_secondary:   brass dado + bronze acanthus capitals at z = 6.50 m
panelisation:         curved; central podium recess at x = 0.00
colour_value:         --token-color-room-auction-house-wall-dais (deep walnut + bronze accents)
embedded_displays:
  - id: ark.auction_house.north.display.current_bid
    position: (0.00, 7.95, 2.80)
    dimensions: 1.80 × 1.20 × 0.06
    content: current high bid + bidder identifier + reserve status
  - id: ark.auction_house.north.display.hammer_log
    position: (-2.50, 7.95, 2.20)
    dimensions: 0.80 × 0.60 × 0.05
    content: rolling log of recent gavels (last 10 lots)
  - id: ark.auction_house.north.display.reserve_thermometer
    position: (2.50, 7.95, 2.20)
    dimensions: 0.80 × 0.60 × 0.05
    content: reserve-price thermometer (amber → green as reserve met)
embedded_doors:       none
decorative_features:
  - id: ark.auction_house.north.plaque.creed
    position: (0.00, 7.95, 1.20)
    dimensions: 0.60 × 0.20 × 0.02
    material: cast bronze with deep-etched text
    narrative_role: reads "EVERY LOT FINDS A HOME" — the auction-house creed
```

#### Wall: East (bidding gallery)

```
wall_id:              east_gallery
material_primary:     walnut wainscot + amber plaster; identical material grammar as south
material_secondary:   brass dado; bronze tracery between bidding stations
panelisation:         curved; 3 bidding stations recessed
colour_value:         --token-color-room-auction-house-wall-gallery (matches south)
embedded_displays:
  - id: ark.auction_house.east.display.station.<n>  (3 stations; per-station HUD)
    position: per station (r = 5.20 m, z = 1.80 m)
    dimensions: 0.40 × 0.30 × 0.05 each
    content: lot description + bid input + remaining seconds
embedded_doors:       none
decorative_features:
  - id: ark.auction_house.east.banner.guild_crest.<n>  (3 crests; one per house with active lots)
    position: per station (z = 3.20 m)
    dimensions: 0.60 × 1.00 × 0.05 each
    material: woven cloth banner
    narrative_role: signals which guild is the active seller for that station
```

#### Wall: West (bidding gallery)

```
wall_id:              west_gallery
material_primary:     walnut wainscot + amber plaster; mirror of east
material_secondary:   brass dado; bronze tracery
panelisation:         curved; 3 bidding stations recessed
colour_value:         --token-color-room-auction-house-wall-gallery (matches east)
embedded_displays:
  - id: ark.auction_house.west.display.station.<n>  (3 stations; per-station HUD)
    position: per station (r = 5.20 m, z = 1.80 m)
    dimensions: 0.40 × 0.30 × 0.05 each
    content: lot description + bid input + remaining seconds
embedded_doors:
  - door_id: ark.auction_house.west.staff_only
    position: (-7.50, 0.00, 0.00)
    dimensions: 0.90 × 2.20 × 0.20
    door_class: locked_staff_only
    connecting_space_id: ark.auction_house.back_office (TBD sub-room)
    unlock_condition: faction_bound_panopticon === true OR governance_role >= "auction_clerk"
decorative_features:
  - id: ark.auction_house.west.banner.guild_crest.<n>  (3 crests; mirror of east)
    position: per station (z = 3.20 m)
    dimensions: 0.60 × 1.00 × 0.05 each
    material: woven cloth banner
    narrative_role: signals selling guild
```

### Ceiling

```
material_primary:     coffered walnut + brass-rib dome; central oculus
material_secondary:   warm-amber stained glass in the oculus (filtered daylight)
pattern:              radial coffering — 12 ribs matching the floor sunburst
colour_value:         --token-color-room-auction-house-ceiling (walnut + brass + amber)
embedded_features:
  - id: ark.auction_house.ceiling.oculus
    position: (0.00, 0.00, 9.50)
    dimensions: 3.00 diameter × 0.30 thick
    function: filtered daylight + ceremonial gravity
  - id: ark.auction_house.ceiling.chandelier
    position: (0.00, 0.00, 7.50)
    dimensions: 1.80 diameter × 1.20 height
    function: warm-amber primary lighting fixture (8 globes + central spire)
```

### Lighting

```
primary_source:       central brass chandelier (warm 2700K); 8 globes + central spire
secondary_sources:
  - 12 brass sconces at the bidding stations (z = 2.40 m, r = 5.80 m)
  - Daylight from the oculus (varies with cycle_phase axis 11)
  - Single dais spot from the chandelier's underside aimed at +y boundary
intensity_default:    "warm-cathedral" — bright enough to read bid sheets, dim enough to feel ritual
state_variants:
  - cycle_phase axis 11: dawn (daylight-heavy), midday (full mix), dusk (sconce-heavy), nightwatch (chandelier only), longnight (chandelier dimmed; emergency-amber band)
  - faction_livery axis 12: hierarchy_red, dreamers_indigo, pureflame_white, panopticon_chrome, etc. — per global axis-12 resolver
  - tv_infection axis 9: clean / spreading / corrupted variants when TV-corruption flag set
```

### Atmosphere

```
ambient_dust:         soft warm motes drifting in the oculus shaft
particle_field:       sparse (rare; not crowded)
humidity:             dry (auction-house formality)
temperature:          18°C (slightly cool — keeps bidders sharp)
moodboard:            late-Victorian commerce + Solar-Punk Cathedral; "your grandfather's bank, but it sings"
```

### Sound

```
ambient_bed:          low chatter of bidders (looped seam-mix at 10-second loop, varied per cycle_phase)
diegetic_sources:
  - bidding stone (taps when player slaps a bid token)
  - chandelier (faint thermal-stress creak at 30s intervals)
  - gavel (single hammer-strike on lot close)
reverb_profile:       RT60 = 1.4 s; warm rotunda; brass-and-walnut frequency response
narrative_anchors:
  - on gavel: trigger forge_first_card_minted if first auction win
  - on reserve-met: trigger comm_doctrine_recital_aired if simulated radio is on
```

### Objects (per-§4)

```
- id: ark.auction_house.object.bidding_token_tray
  position: (0.00, 0.00, 0.85)
  dimensions: 0.50 × 0.30 × 0.08
  interactable: yes — players pick up bidding tokens here
  visibility_gate: trade_empire_unlocked
- id: ark.auction_house.object.lot_display_pedestal.<n> (12 pedestals; one per station)
  position: per station (r = 5.50 m, z = 1.20 m)
  dimensions: 0.40 × 0.40 × 0.80 each
  interactable: yes — inspect lot
  visibility_gate: per-station — only when that station has an active lot
- id: ark.auction_house.object.auctioneer_lectern
  position: (0.00, 6.80, 1.10)
  dimensions: 0.90 × 0.60 × 0.40
  interactable: no (always staffed by NPC)
  narrative_role: auctioneer always present during open hours
```

### Camera-spawn-points

```
- id: ark.auction_house.cs.entry
  position: (0.00, -7.50, 1.65)
  facing_yaw: 0°  (toward dais)
  fov: 70°
  trigger: room_first_enter
  cutscene_id: cs_auction_house_first_arrival (TBD — reserved id for future producer render)
- id: ark.auction_house.cs.bidding_stone_lean
  position: (0.00, -1.20, 1.40)
  facing_yaw: 0°
  fov: 60°
  trigger: hotspot ark.auction_house.floor.bidding_stone
  cutscene_id: cs_auction_house_bidding_zoom (TBD)
- id: ark.auction_house.cs.gavel_pov
  position: (0.00, 6.40, 1.65)
  facing_yaw: 180°
  fov: 75°
  trigger: lot_won_first_time
  cutscene_id: cs_auction_house_first_win (TBD)
```

### Doorways

```
- south_entry → ark.commerce_districts.atrium (1.80 × 2.60; standard swing; default unlock when trade_empire_unlocked)
- west_staff_only → ark.auction_house.back_office (0.90 × 2.20; locked unless faction_bound_panopticon || governance_role >= "auction_clerk")
```

### Adjacency

```
- direct: ark.commerce_districts.atrium (via south entry)
- indirect: ark.trial_hall (via commerce_districts → atrium → trial_hall)
- gameplay-bound: dest.te.free_ports.mercers_landing (auction-house listings spawn there)
```

### Gameplay-hooks

```
- system.auction: bidding-station + bidding-stone wired to apps/server/routers/auction.ts (TBD; currently a stub)
- system.signature_card_economy: signature-card lots resolve via signatureCardManifest + tcg-core/rewards/expansionUnlockService
- system.trade_empire: free-port listing spawns mirror items here when trade_empire_unlocked
```

### Story-tie

```
- arc.act_2_first_bid: triggers on first won lot; sets narrative flag auction_first_bid_won
- arc.commerce_morality: high-volume bidders gain "merchant" reputation track; passes through morality axis at threshold = 50 lots
- §13 storyteller hooks:
  - axis trust: when bond_80_mutual_peak true → auctioneer offers a private lot
  - axis season: seasonal banners swap per battlepass tier
```

### FX

```
- particle: brass-dust motes near the chandelier (always-on, low density)
- particle: bid-confirmation amber flare (1.5 s) when bidding-stone is tapped
- particle: gavel-shock dust ring (0.6 s) on lot close
```

### Parametricity

```
- axis 9 (tv_infection): clean / spreading / corrupted (3 variants)
- axis 11 (cycle_phase): dawn / midday / dusk / nightwatch / longnight (5 variants)
- axis 12 (faction_livery): 8 variants (per global)
- axis 13 (storyteller): 6 declared hooks above
```

### Performance

```
- parallax layers: 4 (background, mid, foreground, particle)
- LOD: full (≤30 m); med (30–60 m); low (60–100 m); culled (>100 m)
- texture_budget: 64 MB total
- mesh_budget: 180k triangles
```

---

## §III-R.2 ark.dreamers_sanctum — Dreamers' Sanctum

### Header

```
space_id:        ark.dreamers_sanctum
space_name:      Dreamers' Sanctum (oneiric immersion chamber; Dreamer faction sanctum)
space_type:      ark_room
act_introduced:  Act 3 (paired with Dreamer faction unlock)
lore_anchor:     loredex.faction.dreamers + arc.act_3_dreamer_communion + loredex.location.oneiric_pools
aesthetic_tier:  dreamers_oneiric
canonical_zipdir: dreamers_sanctum
producer_status: delivered NEW (no original spec); CDN URL: cdn/client-public/art/rooms/dreamers_sanctum/baseline.png
```

The Dreamers' Sanctum is the Inception Ark's communion chamber for
the Dreamer faction — a hexagonal pool-room where the Dreamers
dip into the substrate to remember the future. The room reads as
underwater-at-night: deep indigo + opal-iridescent + drift-mist.
Players visit to commune with absent dreamers, retrieve memory
fragments, or unlock Dreamer-only signature cards.

### Geometry

```
dimensions:           14.00 m × 12.00 m × 8.50 m (hexagonal floor; central pool)
origin_point:         centre of the oneiric pool
coordinate_axes:      +x = east toward the entry tunnel; +y = north toward the seer's pulpit; +z = up
floor_plan_geometry:  regular hexagon (flat-top) with central circular pool; six radial benches along the walls
volumetric_anomalies: gentle "lensing" near the pool surface — light bends 5–8° (parametric shader)
```

Floor area: 144.45 m² (hexagon minus pool). The oneiric pool is a
6.00 m diameter circular basin at z = -0.40 m relative to the
walkable floor (i.e. the pool surface sits 0.40 m below floor
level — players step DOWN to enter).

### Floor

```
material_primary:     polished obsidian-slate; black-glass with subtle opal flecks
material_secondary:   silver-veined marble at the pool perimeter (0.60 m ring)
pattern:              hexagonal-cut slate at the walkable zones; smooth obsidian at the pool ring
wear_state:           pristine (sanctum-maintained; never scuffed)
embedded_features:
  - id: ark.dreamers_sanctum.floor.pool_surface
    position: (0.00, 0.00, -0.40)
    dimensions: 6.00 diameter × 0.05 thick
    function: oneiric pool — players dip a token / hand to commune
  - id: ark.dreamers_sanctum.floor.pool_step.<n>  (6 steps at hexagon-corner alignments)
    position: per corner of the hexagon at the pool rim
    dimensions: 0.80 × 0.20 × 0.40 each
    function: stairs down to the pool ring
  - id: ark.dreamers_sanctum.floor.bench_anchor.<n>  (6 anchors; one per hexagon wall)
    position: per wall midpoint at r = 5.20 m
    dimensions: 0.40 × 0.40 × 0.08 each
    function: bench electronics + offering-tray power
acoustic_property:    soft_diffusive (lapping pool + drift-mist) with low reverb; RT60 = 0.6 s
```

### Walls

#### Wall: South (entry tunnel)

```
wall_id:              south_entry
material_primary:     polished obsidian-slate panels; black-mirror finish
material_secondary:   silver-leaf inlay tracing constellation patterns
panelisation:         3 vertical panels (4.66 m wide each)
colour_value:         --token-color-room-dreamers-sanctum-wall-entry (deep indigo + silver-leaf)
embedded_displays:    none
embedded_doors:
  - door_id: ark.dreamers_sanctum.south.entry
    position: (0.00, -6.00, 0.00)
    dimensions: 1.40 × 2.20 × 0.20
    door_class: dream_silk_curtain (semi-transparent; no audible swing)
    connecting_space_id: ark.dreamers_corridor (transit space; TBD sub-spec)
    unlock_condition: faction_bound_dreamers === true OR arc.act_3_dreamer_communion >= "introduced"
decorative_features:
  - id: ark.dreamers_sanctum.south.constellation.act_3
    position: (0.00, -5.95, 4.20)
    dimensions: 3.00 × 2.00 × 0.02
    material: silver leaf on obsidian
    narrative_role: maps the constellation seen during the Act 3 Dreamer communion vision
```

#### Walls: NE / E / SE / SW / W / NW (5 of 6 — symmetric)

```
wall_id:              hex_<n>  (for n in {ne, e, sw, w, nw}; the seer's pulpit is the +y wall, treated separately)
material_primary:     polished obsidian-slate panels; black-mirror
material_secondary:   silver-leaf constellation traceries per wall (different constellation each)
panelisation:         single 5.66 m panel per wall
colour_value:         --token-color-room-dreamers-sanctum-wall-hex
embedded_displays:
  - id: ark.dreamers_sanctum.<wall>.dreamer_portrait.<n>
    position: per wall (z = 3.40 m)
    dimensions: 1.20 × 1.80 × 0.05 each
    content: hovering portrait of an absent dreamer; subtle parallax breathing
embedded_doors:       none
decorative_features:
  - id: ark.dreamers_sanctum.<wall>.bench
    position: per wall (z = 0.45 m)
    dimensions: 3.20 × 0.80 × 0.45 each
    material: carved obsidian with silk cushion (deep indigo)
    narrative_role: bench for visitors during communion
  - id: ark.dreamers_sanctum.<wall>.offering_tray
    position: per wall (z = 0.95 m, offset into room 0.40 m from bench)
    dimensions: 0.50 × 0.30 × 0.08 each
    material: silver basin with shallow water
    narrative_role: visitors leave a memory token (signature card) as offering
```

#### Wall: North (seer's pulpit)

```
wall_id:              north_pulpit
material_primary:     polished obsidian-slate; central recessed alcove for the seer's pulpit
material_secondary:   silver-veined marble pulpit at the centre
panelisation:         one panel with central recess (2.00 m wide × 3.20 m tall)
colour_value:         --token-color-room-dreamers-sanctum-wall-pulpit (deepest indigo + silver)
embedded_displays:
  - id: ark.dreamers_sanctum.north.dream_log
    position: (0.00, 5.95, 3.40)
    dimensions: 1.80 × 1.20 × 0.05
    content: rolling log of recent dreams shared in the pool
embedded_doors:       none
decorative_features:
  - id: ark.dreamers_sanctum.north.seer_pulpit
    position: (0.00, 5.50, 0.50)
    dimensions: 1.20 × 0.80 × 1.20
    material: silver-veined marble + obsidian dais
    narrative_role: the seer (faction NPC) preaches from here during dreamer-only rites
```

### Ceiling

```
material_primary:     star-projector vault (LED + fibre-optic) painted to match a real night sky; hexagonal coffer matching the floor
material_secondary:   silver-leaf constellation lines connecting the projector points
pattern:              full hex-coffer with central pool-mirror oculus (no glass; just a 2.00 m diameter darker region overhead)
colour_value:         --token-color-room-dreamers-sanctum-ceiling (deep indigo with pinprick stars)
embedded_features:
  - id: ark.dreamers_sanctum.ceiling.star_projector_core
    position: (0.00, 0.00, 8.50)
    dimensions: 0.60 diameter × 0.40 thick
    function: animated constellation projection — cycles per cycle_phase axis 11
```

### Lighting

```
primary_source:       opal-iridescent pool-glow (parametric water shader) lighting from below
secondary_sources:
  - 6 silver-sconce drift-mist lamps at the bench anchors (z = 2.20 m)
  - star-projector ceiling (low-intensity ambient)
  - seer's pulpit underglow (silver)
intensity_default:    "underwater-at-night" — dim enough that the pool is the brightest object; faces softly lit
state_variants:
  - cycle_phase axis 11: dawn (no projection; bare ambient), midday (light projector), dusk (full projector + sconces), nightwatch (projector at peak), longnight (projector flickers; pool glows brighter)
  - axis 12 faction_livery: dreamers-only room — when faction_bound_dreamers true, pool glows pearl; when faction_bound NOT dreamers, pool glows cold-blue (warning state)
```

### Atmosphere

```
ambient_dust:         drift-mist drifting across the floor at ankle height
particle_field:       dense at the pool surface (opal flecks); sparse elsewhere
humidity:             high near pool (90%); moderate at perimeter (60%)
temperature:          22°C ambient; pool water 28°C
moodboard:            oneiric immersion + lucid-dream pavilion; "the moment before you remember the dream"
```

### Sound

```
ambient_bed:          looped pool-lap (3 s loop) + drift-mist breath + distant star-hum
diegetic_sources:
  - pool surface (laps when a token is dipped)
  - star-projector (faint thermal click every 5 minutes)
  - seer's pulpit (when seer present)
reverb_profile:       RT60 = 0.6 s; soft-diffusive; "underwater-cathedral"
narrative_anchors:
  - on token dip: trigger memory_card_minted if first communion
  - on seer's voice: trigger glass_archon_summoned if Dreamer-Glass alliance flag set
```

### Objects

```
- id: ark.dreamers_sanctum.object.pool_basin
  position: (0.00, 0.00, -0.40)
  dimensions: 6.00 diameter × 0.40 deep
  interactable: yes — dip token / hand to commune
  visibility_gate: always visible
- id: ark.dreamers_sanctum.object.offering_token_dish.<n>  (6 dishes; one per bench)
  position: per bench (z = 0.95 m)
  dimensions: 0.50 × 0.30 × 0.08 each
  interactable: yes — leave / retrieve memory token
- id: ark.dreamers_sanctum.object.seer_pulpit
  position: (0.00, 5.50, 0.50)
  dimensions: 1.20 × 0.80 × 1.20
  interactable: only when seer NPC present (Dreamer-faction-only)
```

### Camera-spawn-points

```
- id: ark.dreamers_sanctum.cs.entry
  position: (0.00, -5.20, 1.65)
  facing_yaw: 0°
  fov: 70°
  trigger: room_first_enter
  cutscene_id: cs_dreamers_sanctum_first_arrival (TBD)
- id: ark.dreamers_sanctum.cs.pool_dip
  position: (0.00, -0.80, 1.20)
  facing_yaw: 0°
  fov: 60°
  trigger: hotspot pool_basin
  cutscene_id: cs_dreamers_sanctum_pool_commune (TBD)
- id: ark.dreamers_sanctum.cs.seer_pulpit_pov
  position: (0.00, 4.00, 1.65)
  facing_yaw: 0°
  fov: 75°
  trigger: seer_present + faction_bound_dreamers
  cutscene_id: cs_dreamers_sanctum_seer_address (TBD)
```

### Doorways

```
- south_entry → ark.dreamers_corridor (dream-silk curtain; quiet swing; unlock when faction_bound_dreamers || arc.act_3_dreamer_communion >= "introduced")
```

### Adjacency

```
- direct: ark.dreamers_corridor (via south curtain)
- indirect: ark.blood_weave_atrium.atrium_main (via dreamers_corridor → atrium_main)
- gameplay-bound: dest.te.dreamers_archipelago (Dreamer faction's home destination)
```

### Gameplay-hooks

```
- system.dreamer_communion: pool dip resolves via apps/shared/dreamerCommunion.ts (TBD stub)
- system.faction_dreamers: dreamer-only signature cards unlock here via faction binding chain
- system.memory_card: tokens offered here surface in memory_card_library
```

### Story-tie

```
- arc.act_3_dreamer_communion: triggers on first pool dip; sets narrative flag dreamers_communion_unlocked
- arc.dreamer_glass_alliance: pool reveals visions of the Glass Archon when both faction flags set
- §13 storyteller hooks:
  - axis trust: bond_80_mutual_peak unlocks the Architect's hidden vision in the pool
  - axis lore: pool surfaces shadowtongue runes when shadowtongue_visible flag set
```

### FX

```
- particle: opal flecks drifting through the pool (always-on, parametric per cycle_phase)
- particle: drift-mist at ankle height (always-on, low density)
- particle: communion-flare (3 s opal vortex) on token dip
- shader: water-surface lensing (parametric ±5–8°)
```

### Parametricity

```
- axis 9 (tv_infection): clean / spreading / corrupted (3 variants)
- axis 11 (cycle_phase): dawn / midday / dusk / nightwatch / longnight (5 variants)
- axis 12 (faction_livery): dreamers (pearl pool) / non-dreamers (cold-blue pool) — binary for this room
- axis 13 (storyteller): 5 declared hooks above
```

### Performance

```
- parallax layers: 5 (background, pool-floor, mid, foreground, particle)
- LOD: full (≤30 m); med (30–60 m); low (60–100 m); culled (>100 m)
- texture_budget: 80 MB total (water shader is expensive)
- mesh_budget: 200k triangles
```

---

## §III-R.3 ark.game_masters_sanctum — Game Master's Sanctum

### Header

```
space_id:        ark.game_masters_sanctum
space_name:      Game Master's Sanctum (the throne-chamber where the corrupted GM holds court)
space_type:      ark_room
act_introduced:  Act 7 (paired with chess Climb Tier 3 / labyrinth wager)
lore_anchor:     loredex.character.game_master + arc.act_7_convergence + loredex.system.chess_climb
aesthetic_tier:  architect_geometric + master-throne
canonical_zipdir: game_masters_sanctum
producer_status: delivered NEW (no original spec); CDN URL: cdn/client-public/art/rooms/game_masters_sanctum/baseline.png
```

The Game Master's Sanctum is the corrupted Game Master's
throne-chamber — the room where he holds court between matches,
the room where the Climb finale takes place when Mol'Garath is at
the audience. It reads as a brutalist throne-hall converted into
a reality-show set: black marble + brass instruments + master-
glow spotlights + producer drones in the rafters.

### Geometry

```
dimensions:           18.00 m × 14.00 m × 11.00 m (rectangular; cathedral-tall)
origin_point:         centre of the chess table at the chamber's heart
coordinate_axes:      +x = east toward the audience risers; +y = north toward the throne dais; +z = up
floor_plan_geometry:  rectangular with central chess-table dais + raised audience risers on the +x side + master throne at +y boundary
volumetric_anomalies: none (the GM does not bend reality — he OBSERVES it; this is The Source's job)
```

Floor area: 252.00 m². The chess table is centred; the throne sits
2.50 m above floor on the +y dais; audience risers step up from
floor at x = +5.00 to x = +9.00.

### Floor

```
material_primary:     polished black marble; floor squares 1.20 m × 1.20 m
material_secondary:   brass inlay marking a king-sized chessboard pattern at the centre (8 × 8 squares; 0.80 m per square)
pattern:              full chessboard pattern at origin (centred); plain black marble elsewhere
wear_state:           pristine (the GM never lets it scuff)
embedded_features:
  - id: ark.game_masters_sanctum.floor.chess_dais
    position: (0.00, 0.00, 0.20)
    dimensions: 4.00 × 4.00 × 0.20
    function: raised dais holding the chess table; players step UP onto it to play
  - id: ark.game_masters_sanctum.floor.throne_dais
    position: (0.00, 5.50, 2.50)
    dimensions: 4.00 × 2.40 × 2.50
    function: raised throne platform — GM's chair sits here
  - id: ark.game_masters_sanctum.floor.audience_riser.<n>  (4 risers; r1=+5 m, r2=+6 m, r3=+7 m, r4=+8 m)
    position: per riser
    dimensions: 9.00 × 1.00 × 0.40 each (stepping up by 0.40 each)
    function: stadium-style audience seating
  - id: ark.game_masters_sanctum.floor.producer_drone_dock
    position: (0.00, 0.00, 10.50)
    dimensions: 1.00 × 1.00 × 0.30
    function: drone-charging dock in the rafters
acoustic_property:    hard_reflective (black marble + brass) with theatre baffling at the +x audience risers; RT60 = 0.9 s (clean broadcast-grade)
```

### Walls

(Standard 4-wall: south_entry / north_throne / east_audience /
west_production — full §4 expansion follows the auction_house pattern
above. Key features condensed for brevity:)

#### Wall: South (entry; from chess corridor)

```
- 1.80 × 2.60 m double-door entry to ark.chess_corridor
- 4 master-glow sconces flanking entry
- bronze-etched "PLAY OR DECLINE" plaque above the entry
- material: black-marble panels + brass crown moulding
```

#### Wall: North (throne wall)

```
- master throne (carved obsidian + brass; 1.20 × 0.80 × 2.40 m) on the +y dais
- giant LCD scoreboard above the throne (2.80 × 1.60 m) showing current Climb tier + player ELO + stakes
- brass-and-obsidian banners hanging on either side displaying Climb tier currently being played
```

#### Wall: East (audience risers + production booth)

```
- 4 stepped risers (per floor spec) seating up to 80 audience members (real or simulated)
- production booth at the top riser (z = 1.60 m) holding the on-air director NPC
- 6 producer drones (hover-anchored) hanging from rafters
```

#### Wall: West (master's prep + clipboard archive)

```
- master's prep alcove (3.00 × 2.40 m recess) with a brass clock + a chair the GM uses between matches
- clipboard archive (built-in shelving) holding the GM's tier-stake clipboards
- single door (0.90 × 2.20 m) marked "STAFF ONLY" leading to ark.game_masters_sanctum.green_room (TBD sub-room)
```

### Ceiling

```
material_primary:     coffered obsidian; cathedral height
material_secondary:   brass cross-rib structure visible above the chess dais; 8 stage-lighting rigs anchored
pattern:              long parallel coffering along the +y axis (focuses light toward the chess dais)
colour_value:         --token-color-room-game-masters-sanctum-ceiling (deep obsidian + brass + master-glow)
embedded_features:
  - id: ark.game_masters_sanctum.ceiling.master_spot_rig
    position: (0.00, 0.00, 10.80)
    dimensions: 3.00 × 3.00 × 0.40
    function: 8-lamp stage-lighting rig aimed at the chess dais (the "master glow")
  - id: ark.game_masters_sanctum.ceiling.drone_perch.<n>  (6 perches; in the rafters)
    position: per perch
    dimensions: 0.40 × 0.40 × 0.10 each
    function: producer drone resting/charging spot
```

### Lighting

```
primary_source:       master-spot rig overhead (cold-white + amber accent) aimed at the chess dais
secondary_sources:
  - throne underglow (brass-amber; GM only)
  - audience-riser house lights (warm but dim)
  - producer-drone follow-lights (5-second-lag spotlights)
intensity_default:    "broadcast-arena" — chess dais is the brightest object by 3 stops; everything else dimmed
state_variants:
  - cycle_phase axis 11: standard 5 variants
  - axis 12 faction_livery: usually "panopticon" (the GM serves the broadcast) or "none" — limited variant set for this room
  - axis 13: special "mol_garath_at_audience" variant for Climb Tier 3 (lights cut to black except the chess dais; Mol'Garath sits in the audience)
```

### Atmosphere

```
ambient_dust:         none (sanctum-cleaned)
particle_field:       sparse cigarette-smoke wisps near the producer drones (broadcast-haze for atmosphere)
humidity:             dry (broadcast-formal)
temperature:          19°C (cool — players sweat under the master spot)
moodboard:            brutalist throne-hall + reality-show set; "the GM is a host who used to be a teacher"
```

### Sound

```
ambient_bed:          low audience-murmur (looped 8 s; mixed at -24 dB)
diegetic_sources:
  - throne (creaks when GM shifts)
  - master-spot rig (faint mechanical pan whirr when drones move)
  - clipboard (page-flip when GM reads the next stake)
  - producer drones (low hover-hum)
reverb_profile:       RT60 = 0.9 s; clean broadcast-grade
narrative_anchors:
  - on Climb Tier 3 enter: audience hush + Mol'Garath presence-bed (deep sub-bass)
```

### Objects

```
- id: ark.game_masters_sanctum.object.chess_table
  position: (0.00, 0.00, 0.20)
  dimensions: 1.20 × 1.20 × 0.80
  interactable: yes — sit at the table to start a match
  visibility_gate: chess subsystem unlocked (ladder reached)
- id: ark.game_masters_sanctum.object.master_throne
  position: (0.00, 5.50, 2.50)
  dimensions: 1.20 × 0.80 × 2.40
  interactable: no (the GM ALWAYS occupies it during open hours)
- id: ark.game_masters_sanctum.object.clipboard_archive
  position: (-7.50, 0.00, 1.20)
  dimensions: 1.80 × 0.40 × 1.80
  interactable: yes — inspect past tier-stake clipboards (lore item)
  visibility_gate: chess_climb_tier_0_entered
- id: ark.game_masters_sanctum.object.producer_drone.<n>  (6 drones)
  position: per ceiling perch
  dimensions: 0.30 × 0.30 × 0.30 each
  interactable: no (drones follow you with their spotlights during matches)
```

### Camera-spawn-points

```
- id: ark.game_masters_sanctum.cs.entry
  position: (0.00, -6.00, 1.65)
  facing_yaw: 0°
  fov: 75°
  trigger: room_first_enter
  cutscene_id: cs_chess_climb_tier_0_exhibition (already declared; wires here)
- id: ark.game_masters_sanctum.cs.chess_seat
  position: (0.00, -1.20, 1.40)
  facing_yaw: 0°
  fov: 65°
  trigger: hotspot chess_table
  cutscene_id: cs_chess_ladder_game_master_first_seated (already declared)
- id: ark.game_masters_sanctum.cs.tier_3_audience
  position: (0.00, -3.00, 1.65)
  facing_yaw: 0°
  fov: 80°  (wider — Mol'Garath occupies upper-left)
  trigger: chess_climb_tier_3_entered
  cutscene_id: cs_chess_climb_tier_3_labyrinth_wager (already declared; FPV trait-lock relaxed per §AC.22.2.5)
```

### Doorways

```
- south_entry → ark.chess_corridor (1.80 × 2.60; standard swing; unlock when chess subsystem reached)
- west_staff_only → ark.game_masters_sanctum.green_room (0.90 × 2.20; locked; producer or master-clearance only)
```

### Adjacency

```
- direct: ark.chess_corridor (via south)
- indirect: ark.audit_chamber (via chess_corridor → audit_chamber, narrative parallel)
- gameplay-bound: dest.collectors_arena (the GM also hosts tournaments there in season finales)
```

### Gameplay-hooks

```
- system.chess_climb: chess_table + clipboard_archive + master_throne are the runtime surface for chessClimbTiers.ts
- system.chess_ladder: storyOrder match against game_master happens here
- system.audience_simulation: producer drones + audience risers swap "audience density" per battlepass tier
```

### Story-tie

```
- arc.act_7_convergence: Mol'Garath appears in the audience at Climb Tier 3 (narrative spine climax)
- arc.molgarath_observation: every visit increments a flag tracking GM-Mol'Garath proximity
- §13 storyteller hooks:
  - axis act: act_7_started swaps audience to "real" attendance
  - axis season: seasonal banners + battlepass-tier audience density
  - axis trust: bond_80_mutual_peak lets player decline the wager without face-loss
```

### FX

```
- particle: broadcast-haze near the producer drones (always-on, low density)
- particle: master-spot dust (pinned to the chess dais; warm-white pulse on player's first move)
- particle: drone-spotlight cone (real volumetric beam from each drone)
- shader: scoreboard parallax breathing (subtle LED flicker)
```

### Parametricity

```
- axis 9 (tv_infection): clean / corrupted (only 2 variants — the GM is already corrupted; the "clean" variant is Celebration-era only and unreachable)
- axis 11 (cycle_phase): standard 5 variants (theatre lights always present)
- axis 12 (faction_livery): panopticon / none (2 variants)
- axis 13 (storyteller): 5 declared hooks above + mol_garath_at_audience
```

### Performance

```
- parallax layers: 6 (background, audience, mid, dais, foreground, drones)
- LOD: full (≤30 m); med (30–60 m); low (60–100 m); culled (>100 m)
- texture_budget: 96 MB total (broadcast-grade lighting)
- mesh_budget: 240k triangles
```

---

## §III-R.4 ark.meditation_garden — Meditation Garden

### Header

```
space_id:        ark.meditation_garden
space_name:      Meditation Garden (bio-organic contemplation glade; apprentice rest space)
space_type:      ark_room
act_introduced:  Act 1 (available from awakening; recommended-after the prelude corridor)
lore_anchor:     loredex.system.apprentice_rest + arc.act_1_first_breath + loredex.location.living_walls
aesthetic_tier:  solar_punk_cathedral + bio-organic
canonical_zipdir: meditation_garden
producer_status: delivered NEW (no original spec); CDN URL: cdn/client-public/art/rooms/meditation_garden/baseline.png
```

The Meditation Garden is the Inception Ark's apprentice
contemplation space — a small, sun-lit glade with living walls, a
koi pond, three meditation benches, and an honest stretch of grass
under simulated sunlight. The Ark's only room where the light is
unambiguously warm. Apprentices rest here between tutorials, audits,
and missions; the more time you spend here, the slower your stress
ledger grows.

### Geometry

```
dimensions:           10.00 m × 8.50 m × 6.00 m (rectangular; modest scale)
origin_point:         centre of the koi pond
coordinate_axes:      +x = east toward the entry; +y = north toward the bench grouping; +z = up
floor_plan_geometry:  rectangular with central pond + meandering stone path + grass surround
volumetric_anomalies: gentle simulated-sun beam from above (3.00 m wide; warm 2700K)
```

Floor area: 85.00 m² (grass + path + pond combined).

### Floor

```
material_primary:     soft synth-grass (warm green; 25 mm pile)
material_secondary:   weathered limestone stepping-stones forming a meandering path from entry to bench grouping (15 stones at ~0.80 m apart)
pattern:              organic — no grid; the path curves around the pond
wear_state:           moderate at the stepping-stones; pristine grass elsewhere
embedded_features:
  - id: ark.meditation_garden.floor.koi_pond
    position: (0.00, 0.00, -0.30)
    dimensions: 3.20 × 2.40 × 0.30
    function: shallow koi pond with synth-fish (3 koi; warm gold + orange)
  - id: ark.meditation_garden.floor.stepping_stone.<n>  (15 stones; meandering path)
    position: per stone
    dimensions: 0.50 × 0.50 × 0.06 each
    function: walkable surface
  - id: ark.meditation_garden.floor.bench_anchor.<n>  (3 anchors at +y wall)
    position: y = +3.80 m; x ∈ {-2.40, 0.00, +2.40}
    dimensions: 0.40 × 0.40 × 0.05 each
    function: bench electronics (heated seat, biometric tracking)
acoustic_property:    soft_diffusive (grass + leaves) with low reverb; RT60 = 0.4 s (quietest room in the Ark)
```

### Walls

#### Wall: South (entry)

```
- 1.20 × 2.20 m sliding glass door to ark.apprentice_hall (or ark.apprentice_corridor if added)
- living-wall greenery (climbing ivy + jasmine) frames the door at z = 0–4.50 m
- material: glass + bronze framing + living foliage
```

#### Wall: North (bench grouping wall)

```
- living-wall (full height); planter beds with herbs (rosemary, lavender, mint) + flowering vines
- three meditation benches built INTO the wall (wood + brass; 2.40 × 0.50 × 0.50 m each)
- material: living foliage on stone substrate; bench wood is warm walnut
```

#### Wall: East (skylight wall)

```
- floor-to-ceiling sun-window (simulated daylight projection; varies per cycle_phase)
- bronze framing at 0.80 m intervals
- material: tempered-glass + bronze + simulated-sky projection layer
```

#### Wall: West (water feature wall)

```
- vertical water wall (water trickling down weathered limestone tablets; 3.00 m wide × 4.00 m tall)
- the water is the koi pond's recirculation source
- material: weathered limestone + flowing water shader
```

### Ceiling

```
material_primary:     simulated-sky vault — projected blue sky with drifting clouds
material_secondary:   bronze rib structure (organic, plant-like curves)
pattern:              irregular ribbing mimicking branches overhead
colour_value:         --token-color-room-meditation-garden-ceiling (warm-sky-blue + bronze)
embedded_features:
  - id: ark.meditation_garden.ceiling.sun_projector
    position: (0.00, 0.00, 6.00)
    dimensions: 3.00 diameter × 0.40 thick
    function: simulated-sun projection — warm 2700K; cycles per cycle_phase axis 11
```

### Lighting

```
primary_source:       simulated-sun projector overhead (warm 2700K) + sun-window (east wall)
secondary_sources:
  - water-wall under-lighting (warm-amber spots at limestone tablets)
  - 3 garden lanterns at the bench grouping (z = 1.80 m; ember-glow at night)
  - koi pond underlight (soft warm-blue)
intensity_default:    "warm-spring-afternoon" — bright but never harsh
state_variants:
  - cycle_phase axis 11: dawn (golden-pink), midday (full sun), dusk (amber), nightwatch (lanterns only; soft glow), longnight (lanterns + emergency-amber wall band)
```

### Atmosphere

```
ambient_dust:         pollen motes drifting through the sun beam (always-on, low density)
particle_field:       sparse (mostly clean — meditation environment)
humidity:             moderate (50% — comfortable; helped by water wall)
temperature:          22°C ambient; pond water 24°C
moodboard:            Solar-Punk Cathedral biome + private courtyard garden; "the only honest room on the Ark"
```

### Sound

```
ambient_bed:          looped birdsong (4 s loop; sparrows + a single jay every 30s) + water-wall trickle + leaf-rustle
diegetic_sources:
  - water wall (always trickling)
  - koi pond (occasional splash when a fish breaks surface)
  - bench creaks when player sits
  - wind-chime at the north wall (subtle; only audible when nightwatch)
reverb_profile:       RT60 = 0.4 s; soft-diffusive; "courtyard at noon"
narrative_anchors:
  - on first-sit on bench: trigger cohort_bonding_threshold if cohort present
  - on koi pond reflection-zoom: trigger berth_wake_morning equivalent — a "you needed this" beat
```

### Objects

```
- id: ark.meditation_garden.object.koi_pond
  position: (0.00, 0.00, -0.30)
  dimensions: 3.20 × 2.40 × 0.30
  interactable: yes — toss a memory token (signature card) into the pond for a reflection-vision
  visibility_gate: always visible
- id: ark.meditation_garden.object.meditation_bench.<n>  (3 benches; built into north wall)
  position: per bench anchor (y = +3.60 m)
  dimensions: 2.40 × 0.50 × 0.50 each
  interactable: yes — sit; advances time + reduces stress ledger
  visibility_gate: always visible
- id: ark.meditation_garden.object.herb_planter.<n>  (3 planter beds; one per herb)
  position: along north wall at z = 1.20 m
  dimensions: 1.20 × 0.40 × 0.20 each
  interactable: yes — pick herb for inventory (rosemary / lavender / mint)
  visibility_gate: always visible
- id: ark.meditation_garden.object.water_wall_basin
  position: (-4.80, 0.00, 0.40)
  dimensions: 0.40 × 2.00 × 0.30
  interactable: yes — drink (full stamina restore once per cycle_phase)
  visibility_gate: always visible
```

### Camera-spawn-points

```
- id: ark.meditation_garden.cs.entry
  position: (4.20, 0.00, 1.65)
  facing_yaw: 180°
  fov: 70°
  trigger: room_first_enter
  cutscene_id: cs_meditation_garden_first_arrival (TBD)
- id: ark.meditation_garden.cs.bench_sit
  position: (0.00, 3.40, 1.20)
  facing_yaw: 180°  (looking back at the pond)
  fov: 65°
  trigger: hotspot meditation_bench
  cutscene_id: cs_meditation_garden_sit_breath (TBD)
- id: ark.meditation_garden.cs.koi_reflection
  position: (0.00, 1.50, 1.20)
  facing_yaw: 270°  (looking down at the pond)
  fov: 50°
  trigger: hotspot koi_pond
  cutscene_id: cs_meditation_garden_koi_zoom (TBD)
```

### Doorways

```
- south_entry → ark.apprentice_hall (1.20 × 2.20; sliding glass; always unlocked once apprentice cohort assigned)
```

### Adjacency

```
- direct: ark.apprentice_hall (via south sliding door)
- indirect: ark.berth.<archetype> (via apprentice_hall → berth)
- gameplay-bound: stress ledger surface (apprentice_stress_ledger.ts)
```

### Gameplay-hooks

```
- system.apprentice_rest: bench-sit reduces apprentice_stress_ledger by 1 per cycle_phase
- system.herb_inventory: pick herb advances herb_inventory in apps/shared/herbInventory.ts (TBD stub)
- system.cohort_bonding: cohort_bonding_threshold fires when 2+ cohort members occupy benches simultaneously
```

### Story-tie

```
- arc.act_1_first_breath: triggers on first room-enter; sets narrative flag meditation_garden_first_breath
- arc.gardener_npc: the gardener NPC appears here only when cycle_phase = dawn AND faction_bound_dreamers (rare beat)
- §13 storyteller hooks:
  - axis trust: bond_80_mutual_peak unlocks a private bench conversation with the player's chosen narrator
  - axis season: seasonal flora swap per battlepass quarter
  - axis lore: shadowtongue runes on the limestone tablets surface when shadowtongue_visible flag set
```

### FX

```
- particle: pollen motes in the sun beam (always-on, low density)
- particle: koi-splash flare (1 s warm-gold) when a fish breaks surface
- particle: leaf-fall in autumn (battlepass-quarter-locked)
- shader: water-wall surface ripple (parametric)
- shader: koi-pond surface reflection (parametric per cycle_phase)
```

### Parametricity

```
- axis 9 (tv_infection): clean / spreading / corrupted (3 variants — the corruption variant is particularly poignant here)
- axis 11 (cycle_phase): all 5 variants (dawn / midday / dusk / nightwatch / longnight)
- axis 12 (faction_livery): 8 variants (per global)
- axis 13 (storyteller): 4 declared hooks above
```

### Performance

```
- parallax layers: 5 (sky, far-foliage, mid-foliage, foreground, particle)
- LOD: full (≤30 m); med (30–60 m); low (60–100 m); culled (>100 m)
- texture_budget: 80 MB total (foliage is expensive)
- mesh_budget: 240k triangles (instanced foliage)
```

---

## §III-R.5 ark.order_tribunal — Order Tribunal

### Header

```
space_id:        ark.order_tribunal
space_name:      Order Tribunal (austere judicial chamber; hierarchy-side justice surface)
space_type:      ark_room
act_introduced:  Act 4 (paired with Hierarchy faction binding + first formal trial)
lore_anchor:     loredex.faction.hierarchy + arc.act_4_hierarchy_trial + loredex.system.tribunal_justice
aesthetic_tier:  hierarchy_ritual
canonical_zipdir: order_tribunal
producer_status: delivered NEW (no original spec); CDN URL: cdn/client-public/art/rooms/order_tribunal/baseline.png
```

The Order Tribunal is the Hierarchy faction's formal judicial
chamber on the Inception Ark — the room where apprentices are tried
for doctrinal infractions, factional disloyalty, or chess-Climb
violations. Austere stone + brass dais + crimson banners + a single
shaft of cold-white light from above. The room is designed to make
you feel SMALL. Players enter as either defendants, witnesses, or
(rarely) judges depending on their progression.

### Geometry

```
dimensions:           12.00 m × 9.00 m × 7.50 m (rectangular; tall + narrow)
origin_point:         centre of the dock floor at the chamber's heart
coordinate_axes:      +x = east toward the witness gallery; +y = north toward the judge's bench; +z = up
floor_plan_geometry:  rectangular with central dock + raised judge's bench at +y boundary + witness gallery on +x side
volumetric_anomalies: a single cold-white verdict beam from a 1.50 m oculus in the ceiling, falling on the dock
```

Floor area: 108.00 m².

### Floor

```
material_primary:     austere grey limestone tiles (1.20 m × 1.20 m); polished but cold
material_secondary:   brass inlay markings: a circle around the dock + a straight runway from entry to bench
pattern:              orthogonal grid; brass inlays mark the dock circle (2.00 m diameter centred at origin) and the entry-to-bench runway
wear_state:           pristine (the tribunal is maintained obsessively; marks would be a sign of disorder)
embedded_features:
  - id: ark.order_tribunal.floor.dock
    position: (0.00, 0.00, 0.00)
    dimensions: 2.00 diameter × 0.05 thick
    function: the dock circle — defendant stands here during trial
  - id: ark.order_tribunal.floor.runway
    position: (0.00, -2.00, 0.00)  through  (0.00, 4.00, 0.00)
    dimensions: 1.20 wide × 6.00 long × 0.02 thick
    function: brass-inlaid runway from entry threshold to dock to bench
  - id: ark.order_tribunal.floor.judge_dais
    position: (0.00, 4.50, 1.40)
    dimensions: 5.00 × 1.80 × 1.40
    function: raised judge's bench platform
  - id: ark.order_tribunal.floor.gallery_riser.<n>  (3 risers; r1=+3.00, r2=+3.50, r3=+4.00)
    position: per riser (east side)
    dimensions: 4.00 × 0.80 × 0.40 each
    function: witness-gallery stadium seating
acoustic_property:    hard_reflective (limestone + brass + stone walls); RT60 = 1.6 s (echoing — every word matters)
```

### Walls

#### Wall: South (defendant entry)

```
- 1.20 × 2.60 m heavy iron door (defendants enter here; locked from outside once trial begins)
- crimson Hierarchy banner above the door (2.40 × 1.80 m); brass tribunal seal at the top
- material: austere stone + iron door + brass banner-rod
```

#### Wall: North (judge's bench wall)

```
- judge's bench (carved limestone + brass; 5.00 × 1.20 × 1.40 m) on the +y dais
- bronze relief carving above the bench: the Hierarchy's seal flanked by two stylised wardens
- 3 crimson banners hanging at z = 2.40–6.40 m bearing the seals of the three Hierarchy houses on judicial duty
- material: stone + brass + crimson cloth
```

#### Wall: East (witness gallery)

```
- 3 stepped risers (per floor spec) seating up to 24 witnesses
- 4 austere stone pilasters dividing the gallery into 3 bays
- brass railing at the front of each riser
- material: stone + brass + crimson velvet on the bench seats
```

#### Wall: West (warden station + evidence safe)

```
- warden's standing-station (3.00 × 1.20 m alcove) with brass evidence rack
- locked evidence safe (1.20 × 0.80 × 1.80 m) at the back of the alcove
- single door (0.90 × 2.20 m) marked "WARDEN ONLY" leading to ark.audit_chamber (judicial transit)
- material: stone + iron + brass
```

### Ceiling

```
material_primary:     coffered limestone vault; cathedral-tall
material_secondary:   brass cross-rib structure; central oculus
pattern:              long parallel coffering along the +y axis (focuses the verdict beam toward the dock)
colour_value:         --token-color-room-order-tribunal-ceiling (cold limestone + cold brass + crimson banner reflections)
embedded_features:
  - id: ark.order_tribunal.ceiling.verdict_oculus
    position: (0.00, 0.00, 7.50)
    dimensions: 1.50 diameter × 0.30 thick
    function: cold-white verdict-beam source — fixed spotlight aimed at the dock; never warm
```

### Lighting

```
primary_source:       cold-white verdict beam from the oculus (5500K) aimed at the dock
secondary_sources:
  - 6 wall sconces (cold-amber; austere) at the gallery walls
  - judge's-bench underglow (deep crimson; barely visible — designed to FRAME the judge, not light the chamber)
  - warden's-alcove single sconce (cold-blue accent)
intensity_default:    "interrogation-cold" — the verdict beam is the brightest object by 2 stops; the rest of the chamber is dim
state_variants:
  - cycle_phase axis 11: 5 variants (verdict beam constant; sconces vary)
  - axis 12 faction_livery: hierarchy_red (default) / panopticon_chrome (when a Panopticon trial is in session) / none (when chamber is empty)
  - axis 13: special "guilty_verdict" variant — verdict beam goes deep red; sconces dim; crimson banners darken
```

### Atmosphere

```
ambient_dust:         very faint dust in the verdict beam (always-on, very low density — sanctum-cleaned but the beam catches what little there is)
particle_field:       sparse
humidity:             dry (judicial formality)
temperature:          17°C (cool — keeps defendants alert + uncomfortable)
moodboard:            austere stone tribunal + ritual judicial chamber; "the room is a sentence being delivered"
```

### Sound

```
ambient_bed:          near-silence — only the verdict beam's faint thermal hum + a distant ceremonial bell (every 60 s)
diegetic_sources:
  - heavy iron door (booms when it closes behind the defendant)
  - judge's gavel (single hammer-strike at verdict)
  - warden footsteps (always slow + deliberate on the brass runway)
  - banner cloth (subtle ruffle from HVAC; gives the room a "breathing" quality)
reverb_profile:       RT60 = 1.6 s; hard-reflective; every word echoes
narrative_anchors:
  - on door close: trigger audit_day7_zealot_active equivalent flag — "the room remembers"
  - on gavel: trigger audit_verdict_mercy or audit_verdict_purge depending on outcome
```

### Objects

```
- id: ark.order_tribunal.object.dock_marker
  position: (0.00, 0.00, 0.05)
  dimensions: 2.00 diameter × 0.05
  interactable: only when player is the defendant (visibility_gate: arc.act_4_trial_active)
- id: ark.order_tribunal.object.judge_bench
  position: (0.00, 4.50, 1.40)
  dimensions: 5.00 × 1.20 × 1.00 (bench top)
  interactable: only when player is the judge (rare; high-governance progression)
- id: ark.order_tribunal.object.evidence_safe
  position: (-5.20, 0.00, 0.90)
  dimensions: 1.20 × 0.80 × 1.80
  interactable: yes — open if warden's-clearance present; lore item drops + evidence-token retrieval
  visibility_gate: governance_role >= "warden_apprentice"
- id: ark.order_tribunal.object.crimson_banner.<n>  (3 banners on north wall)
  position: per banner (north wall, z = 2.40–6.40 m)
  dimensions: 1.20 × 4.00 × 0.05 each
  interactable: no
  narrative_role: signals which Hierarchy houses are on judicial duty (varies per battlepass tier)
```

### Camera-spawn-points

```
- id: ark.order_tribunal.cs.entry_defendant
  position: (0.00, -3.80, 1.65)
  facing_yaw: 0°  (toward bench)
  fov: 65°
  trigger: room_first_enter AND arc.act_4_trial_active
  cutscene_id: cs_order_tribunal_first_trial (TBD)
- id: ark.order_tribunal.cs.dock_pov
  position: (0.00, 0.00, 1.65)
  facing_yaw: 0°
  fov: 70°
  trigger: dock_step_in
  cutscene_id: cs_order_tribunal_dock_address (TBD)
- id: ark.order_tribunal.cs.gavel_close
  position: (0.00, 0.80, 1.65)
  facing_yaw: 0°
  fov: 50°  (tight on the bench)
  trigger: verdict_imminent
  cutscene_id: cs_order_tribunal_verdict_strike (TBD)
- id: ark.order_tribunal.cs.witness_pov
  position: (4.20, 0.00, 1.65)
  facing_yaw: 270°  (looking west at the dock)
  fov: 60°
  trigger: player_is_witness
  cutscene_id: cs_order_tribunal_witness_take (TBD)
```

### Doorways

```
- south_entry → ark.judicial_corridor (1.20 × 2.60; heavy iron; locks from outside during active trial)
- west_warden_only → ark.audit_chamber (0.90 × 2.20; locked unless governance_role >= "warden_apprentice")
```

### Adjacency

```
- direct: ark.judicial_corridor (via south door) — corridor connects to ark.trial_hall + ark.apprentice_cellblock
- direct: ark.audit_chamber (via west warden-only door)
- gameplay-bound: audit_chamber + trial_hall (judicial pipeline)
```

### Gameplay-hooks

```
- system.tribunal_justice: dock_marker + gavel resolve via apps/server/routers/tribunal.ts (TBD; mostly stubs for narrative outcomes)
- system.hierarchy_faction: faction_bound_hierarchy ramp + judicial-progression track gate access here
- system.warden_subsystem: warden's-alcove ties into the warden_dock destination + mechronis_audit Hellbox
```

### Story-tie

```
- arc.act_4_hierarchy_trial: triggers on first trial as defendant; sets narrative flag order_tribunal_first_trial
- arc.judicial_progression: gavel outcomes ripple into the player's governance role
- §13 storyteller hooks:
  - axis morality: order_tribunal_verdict_guilty / order_tribunal_verdict_innocent variants
  - axis act: act_4_started swaps banners + adds Mol'Garath silhouette behind the bench (visible only when act_7_started)
  - axis governance: high governance role unlocks "judge POV" variant (player at the bench)
```

### FX

```
- particle: dust motes in the verdict beam (always-on, very low density)
- particle: gavel-strike shockwave dust (0.6 s) on verdict
- particle: crimson-banner cloth ripple (parametric per HVAC)
- shader: verdict-beam volumetric (parametric ±2° per cycle_phase)
```

### Parametricity

```
- axis 9 (tv_infection): clean / corrupted (2 variants — the tribunal is high-formality; spreading variant unsupported)
- axis 11 (cycle_phase): 5 variants
- axis 12 (faction_livery): hierarchy_red / panopticon_chrome / none (3 variants for this room)
- axis 13 (storyteller): 4 declared hooks above + the special "guilty_verdict" override (drives lighting + audio)
```

### Performance

```
- parallax layers: 4 (background, mid, foreground, particle)
- LOD: full (≤30 m); med (30–60 m); low (60–100 m); culled (>100 m)
- texture_budget: 56 MB total
- mesh_budget: 160k triangles
```

---

## Cross-doc sync (post-merge)

- All 5 rooms appear in `roomArtManifest.ROOM_ART_ZIP_DIRS` already
  (their `baseline.png` is on CDN via earlier producer drops).
- `roomArtCoverageReport().producerNewNotInSpec` will continue to
  list them until the canonical PART III §4 specs are inlined into
  `_PRODUCTION_FINAL.md` — this retrofit file serves as the staging
  document.
- Cross-reference `_PRODUCTION_CROSS_CUT.md` §A (room manifest) once
  the retrofit lands.
- Once cross-cut: update the coverage report's
  `producerNewNotInSpec` filter to return `[]` (i.e., these rooms
  are no longer "outside spec").

## Action items for the cross-cut PR

1. Append §III-R.1 through §III-R.5 into `_PRODUCTION_FINAL.md`
   PART III before the existing room specs that follow it
   alphabetically (or as a dedicated §III-R subsection).
2. Update `_PRODUCTION_FINAL.md` §0 + §A summary tables to bump the
   "166-space spec" count to 171.
3. Re-run any doc-derived parity tests.
