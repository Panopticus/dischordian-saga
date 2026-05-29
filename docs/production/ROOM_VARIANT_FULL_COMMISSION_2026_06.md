# Room Variant Full Commission — 2026-06

**Status:** producer-facing commission package.
**Audience:** art producers, generator operators, finishing painters.
**Scope:** every variant for every main Ark room + hotspot sprite layer specs.
**Read these first:**

- `docs/production/AXIS_STATE_ART_PROMPT_GUIDE.md` — technical specs (2752×1536 PNG, sRGB, no alpha), composition lock, **per-axis prompt vocabulary** (Axis 9 TV, Axis 11 cycle, Axis 12 faction).
- `docs/production/AXIS_STATE_ART_PRODUCER_BRIEF.md` — ZIP delivery convention + ratchet tracking.
- `docs/production/_PRODUCTION_ARK_ROOMS.md` — canonical room geometry (dimensions, walls, props, lighting tokens) for each space.

This file does **not** repeat the axis vocabulary — fill the vocabulary templates from §4 of the prompt guide using the per-room **Layout Sentence** below as the composition anchor.

---

## How to use this file

For each room you'll find:

1. **zipDir / canonicalSpaceId** — how the room is keyed in the manifest and the runtime.
2. **Layout sentence** — the camera + blocking lock the producer pastes at the start of every variant prompt for that room. This is what keeps all 14 variants overlay-compatible.
3. **Variants — shipped vs missing** — the producer manifest entries that already exist on the CDN, and the gaps to fill (axes 9/11/12 per `AXIS_STATE_ART_PRODUCER_BRIEF.md`).
4. **Per-variant delta** — one or two sentences of room-specific narrative dressing layered on top of the §4 axis template.
5. **Hotspot sprite layer specs** — the in-room interactive surfaces, with screen-percentage coordinates so the artist can guarantee silhouettes.

**Prompt assembly formula:**

```
[LAYOUT SENTENCE]
+ [AXIS TEMPLATE from AXIS_STATE_ART_PROMPT_GUIDE.md §4.1/§4.2/§4.3]
+ [PER-VARIANT DELTA from this file]
+ "Painterly sci-fi illustration, muted color palette, cinematic lighting, no text overlays, no signage other than what's specified, no watermarks. 16:9 wide-cinema framing at 2752×1536."
```

**Filename convention** (strict): `state_<axis>_<value>.png` for axis-keyed variants, `baseline.png` for the room ground truth.

---

## Shared style anchor (reuse the existing project anchor)

Prepend `ROOM_STATE_STYLE_ANCHOR` from `apps/shared/roomStateArtPrompts.ts` automatically at CSV emit. Do **not** retype it in any prompt. Authors must NOT prepend their own anchor — the export pipeline composes it once at row-emit time.

Palette: cold institutional steel, patinated brass fittings, deep oxblood accent lighting, warm-gold service lamps, phosphor-lavender and phosphor-green glyph glows where sorcerous circuitry runs. Cyberpunk-meets-steampunk-sorcery aesthetic, 28mm wide-shot, no figures, no rendered text.

---

## Variant matrix — the 15 main rooms

`✓` = ships in producer manifest (`apps/shared/expansionArt/roomArtManifest.data.ts`). Blank = gap to commission.

| Room | base | tv_spread | tv_corr | tv_exposed | tv_quarant | cycle_dawn | cycle_midday | cycle_dusk | cycle_nightwatch | cycle_longnight | faction_(varied) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| cryo_bay | ✓ | ✓ | | | | | | | | ✓ | ✓ insurgency |
| medical_bay | ✓ | ✓ | | | | | | | | ✓ | ✓ hierarchy |
| bridge | ✓ | ✓ | | | | | | | | ✓ | ✓ authority + ✓ insurgency |
| archives | ✓ | ✓ | | | | | | | | ✓ | ✓ antiquarian |
| comms_array | ✓ | ✓ | | | | | | | | ✓ | ✓ insurgency |
| observation_deck | ✓ | ✓ | | | | | | | | ✓ | ✓ dreamer |
| engineering_bay | ✓ | ✓ | | | | | | | | ✓ | ✓ insurgency |
| forge_workshop | ✓ | ✓ | ✓ | | | | | | | ✓ | ✓ insurgency |
| armory | ✓ | ✓ | | | | | | | | ✓ | ✓ authority + ✓ insurgency |
| cargo_hold | ✓ | ✓ | ✓ | | | | | | | ✓ | ✓ authority |
| captains_quarters | ✓ | ✓ | | | | | | | | ✓ | |
| antiquarians_library | ✓ | | | | | | | | | ✓ | |
| engineering_core | ✓ | ✓ | | | | | | | | ✓ | ✓ ironlions |
| oracle_sanctum | ✓ | ✓ | ✓ | | | | | | | ✓ | ✓ antiquarian |
| war_room | ✓ | ✓ | | | | | | | | ✓ | ✓ succession |

**Total commissions this package authorizes:** 15 baselines (all ✓) + filling the gaps below. Highest-impact gaps: `tv_exposed` (0 shipped), `tv_quarantined` (0 shipped), `cycle_dawn/midday/dusk/nightwatch` (each near-0). Order of commission priority: tv_exposed > tv_quarantined > cycle phases > additional factions.

---

# Per-room blocks

## 1. cryo_bay

**zipDir:** `cryo_bay` · **canonical:** `ark.cryo_bay`

**Layout sentence:**
> Cryo Bay seen from the operative's waking-pod vantage — three parallel rows of upright cryogenic pods receding into the frame, the viewer's own open pod at lower-right (pod rim and frost-rimed interior visible, no figure inside). Left wall: bank of diagnostic cryo-terminals with warm-gold indicator lights. Right wall: brass-framed corridor junction. Ceiling: vaulted hull-rib architecture in oil-blued steel with exposed copper conduit. Floor: textured plate metal with frost pooled at pod bases. Far end: reinforced bulkhead door to the Medical Bay marked with a single warm-gold sigil.

**Existing manifest variants (14):** baseline, act_tier_2, battlepass_winter, companion_trust, cycle_longnight, epoch_shadowtongue, faction_insurgency, governance_quarantine, lore_ark_origins, morality_dark, season_closing, system_unlock_crew, trust_elara_luminous, tv_spreading.

**Variants to commission (axis gaps):**

| Variant | Per-variant delta (paste after axis template) |
|---|---|
| `tv_exposed` | "Hairline scan-lines on the cryo-terminal CRTs along the left wall. The Pod-3 diagnostic display flickers once mid-frame; faint chromatic-aberration fringe on its edge. Pod interiors unaffected." |
| `tv_corrupted` | "Every cryo-terminal CRT is alive with phosphor-static. The walls within 1 m of the terminal bank show 4–8 px mosaic creep. Frost on the foreground pod has begun to RGB-fringe at the rim. The far bulkhead door's sigil reads in two layers — warm-gold underlayer + indigo-overlayer slightly out of register." |
| `tv_quarantined` | "Yellow-and-black hazard tape sealing the central walkway between pod rows. Hierarchy quarantine sigils painted onto every pod glass in red-on-grey. Terminals dark, screens cracked. The reinforced bulkhead is welded shut with new bronze plate." |
| `cycle_dawn` | "Soft warm pink light raking through the hull-rib ceiling slits, long thin shadows across the plate floor. Cryo-pod indicator lamps barely register against the new light." |
| `cycle_midday` | "Bright 5600K daylight overhead, shadows short and crisp under the foreground pod rim. Cryo glow muted by ambient sun." |
| `cycle_dusk` | "Warm magenta-orange falling on the right-wall corridor junction. Pod indicator lamps begin to dominate as the overhead light cools." |
| `cycle_nightwatch` | "No external light. Only the cryo-terminal warm-gold lamps + pod-rim safety LEDs carrying the room. Bulkhead corridor reads as a dim warm-gold rectangle." |

**Hotspot sprite layer specs** (cx/cy/width/height in % of 2752×1536):

| # | id | name | type | action | cx | cy | w | h | Art note |
|---|---|---|---|---|---|---|---|---|---|
| 1 | cryo-terminal | Cryo Terminal | terminal | /character-sheet | 6.6 | 54 | 3.8 | 8.7 | Standalone vertical CRT silhouette, left-wall foreground |
| 2 | cryo-terminal-2 | Diagnostics Kiosk | terminal | /profile | 12.2 | 52.7 | 3.5 | 9.5 | Mirror-pair to #1; 5.5% gap between silhouettes |
| 3 | antiquarian-tome | Tome on the Pedestal | item | tome-antiquarian-cryo | 19 | 56.2 | 4.1 | 5.5 | Brass pedestal foreground-left; small oxblood-leather book on top |
| 4 | door-medical | Medical Bay Door | door | medical-bay | 90.3 | 46.7 | 7.9 | 18 | Reinforced bulkhead, right wall; single warm-gold sigil |
| 5 | door-bridge | Bridge Access | door | bridge | 50.4 | 49.4 | 9.9 | 14.7 | Center-back wall; secondary archway |
| 6 | ichor-trail | Green Ichor Trail | examine | — | 58.5 | 71.7 | 23.3 | 8.6 | Phosphor-green liquid pooled across floor plates |
| 7 | dead-pod | Sealed Diplomatic Pod | interact | cryo-mystery:dead-pod | 85.1 | 66 | 10 | 11.6 | Pod near the medical-bay door, frosted glass, clear interior silhouette |
| 8 | frosted-glass | Frosted Pod Glass | interact | cryo-mystery:frosted-glass | 67.3 | 56 | 7.4 | 3.9 | Single pod glass panel, heavy frost |
| 9 | medical-chart | Medical Chart | interact | cryo-mystery:medical-chart | 87.2 | 77 | 4.4 | 6.9 | Wall-mounted brass clipboard near dead-pod |
| 10 | cracked-panel | Cracked Control Panel | interact | cryo-mystery:cracked-panel | 92.4 | 58.5 | 3.1 | 4.8 | Damaged terminal, sparking conduit |
| 11 | data-slate | Hidden Data Slate | interact | cryo-mystery:data-slate | 71.2 | 92.1 | 3.8 | 4.7 | Floor-pickup; partial under pod base |
| 12 | personal-effect | Fallen Locket | interact | cryo-mystery:personal-effect | 66.7 | 90 | 4.3 | 5.1 | Floor-pickup; brass locket on ichor trail |
| 13 | data-crystal | Data Crystal | item | data-crystal-alpha | 26.6 | 66.1 | 2.5 | 2.8 | Small phosphor-lavender crystal on floor, glints in baseline lighting |
| 14 | cryo-pod | Your Cryo Pod | examine | — | 5.7 | 69.9 | 16.9 | 10.3 | Foreground-left pod; open and empty |
| 15 | sealed-pods-left | Sealed Pods (Tilted) | examine | — | 34.2 | 55.9 | 3.5 | 10.7 | Pod cluster in left mid-ground, tilted -54° |
| 16 | sealed-pods-right | Sealed Pods (Right Cluster) | examine | — | 61.7 | 52.6 | 6 | 6.2 | Pod cluster center-right mid-ground |
| 17 | candle-ring | Lit Candles (Left) | examine | — | 50.8 | 75.9 | 25.4 | 15.9 | Ritual candle ring on floor, mid-frame |
| 18 | ark-seal | Inception Ark Seal | examine | — | 50.4 | 77.7 | 11.4 | 8.9 | Brass floor seal at center |
| 19 | egg-cryo-scratch | Scratched Symbol | examine | — | 50.1 | 36.9 | 5 | 5.6 | Wall scratch on back wall, easter-egg scale |

---

## 2. medical_bay

**zipDir:** `medical_bay` · **canonical:** `ark.medical_bay`

**Layout sentence:**
> Medical Bay symmetric wide shot — bio-bed scanner dead-center mid-ground with twin medical consoles flanking, aetheric crown skylight directly above. Far-back wall: hellbox lattice on the right. Stage-left wall: medicine cabinet, autopsy console area. Stage-right wall: DNA helix analysis station. Doors: cryo-bay (left), corridor to engineering (back). Floor: brass-bound circular seal at center. Lighting: cool steel + warm-gold service lamps; phosphor-violet hellbox lattice accent.

**Existing manifest variants (15):** baseline, act_tier_2, battlepass_winter, companion_trust, cycle_longnight, epoch_shadowtongue, faction_hierarchy, governance_quarantine, investigation_device_awakened, lore_research_vessel, morality_dark, season_closing, trust_vex_confidant, tv_spreading, unlock_hellbox.

**Variants to commission (axis gaps):**

| Variant | Per-variant delta |
|---|---|
| `tv_exposed` | "DNA helix station readout flickers; one autopsy console screen drops a frame mid-render. Faint scan-lines on the medicine-cabinet glass." |
| `tv_corrupted` | "Bio-bed scanner display alive with phosphor static; the floor reflects screen-light in cyan/magenta. Hellbox lattice phosphor-violet glow shifted toward unnameable-indigo, RGB-fringed at the lattice edges." |
| `tv_quarantined` | "Hazard tape across the bio-bed and the cryo-door. Hierarchy quarantine sigils on the cabinet. Hellbox lattice powered off, glass cracked. Aetheric crown skylight shuttered with welded bronze plate." |
| `cycle_dawn/midday/dusk/nightwatch` | "Lighting only — through the aetheric crown skylight (warm pink → bright white → magenta-orange → dark) plus interior-fixture compensation as in §4.2 of the prompt guide." |
| `faction_authority` / `faction_dreamer` / `faction_pureflame` / `faction_panopticon` / `faction_collectors` / `faction_multi` | Re-dress per §4.3: banners on the back wall behind the bio-bed, sigils on the medicine cabinet glass, particulate per faction. Geometry locked. |

**Hotspot sprite layer specs:** 21 hotspots. Key sprite anchors:

| # | id | name | type | cx | cy | w | h | Art note |
|---|---|---|---|---|---|---|---|---|
| 1 | bio-bed | Bio-Bed Scanner | terminal | 50 | 55.6 | 5.3 | 9 | Dead-center mid-ground; primary focal |
| 2 | hellbox-lattice | Hellbox Lattice | terminal | 59.8 | 80.2 | 4.9 | 11.6 | Phosphor-violet lattice, back wall right of center |
| 3 | aetheric-arch | Aetheric Crown Window | examine | 49.7 | 37.5 | 11.1 | 9.2 | Skylight directly above bio-bed |
| 4 | medicine-cabinet | Medicine Cabinet | examine | 12.1 | 41.4 | 11.1 | 15.4 | Stage-left brass-framed glass cabinet |
| 5 | dna-helix | DNA Analysis Station | examine | 76 | 53.7 | 3.8 | 23.5 | Tall vertical helix display, stage-right |
| 6 | door-cryo | Cryo Bay Door | door | 23.2 | 51.2 | 4.1 | 26.7 | Tall reinforced doorway, left of medicine cabinet |
| 7 | autopsy-console | Bio-Bed Autopsy Console | interact | 58.1 | 49.7 | 4.1 | 5.7 | Small console right of bio-bed |
| 8 | emergency-safe | Emergency Safe | interact | 40.6 | 49 | 3.3 | 7.5 | Vertical wall safe between bio-bed and medicine cabinet |
| 9 | floor-seal | Medical Bay Floor Seal | examine | 49.9 | 77.6 | 10 | 9.8 | Brass-bound circular floor inscription |
| 10 | egg-vox-neural-bridge | Unkempt Neural Device | interact | 55.8 | 63.8 | 4 | 5 | Small device on bio-bed surface |

(Plus 11 secondary mystery hotspots — sized 2.4–5.2% — distributed across cabinet/console/wall surfaces; see GameContext.tsx:1018-1098 for the full list. These do not need dedicated sprite focal points — they're investigation overlays.)

---

## 3. bridge

**zipDir:** `bridge` · **canonical:** `ark.bridge`

**Layout sentence:**
> Command Bridge wide shot from the captain's chair vantage looking forward — central round war-table holo-projector dead-center mid-ground, three overhead holographic UI panels (green/cyan/purple) hanging above. Five faction banners standing on the table edge. Far-back: panoramic viewport showing void-black starfield. Stage-left: bookshelf bound folios, archives access door. Stage-right: white text panel with brass frame, comms array door. Foreground: two captain's chairs with seated figures only as silhouettes (no detail). Floor: oil-blued steel etched with brass insignias.

**Existing manifest variants (15):** baseline, act_tier_2, battlepass_winter, cycle_longnight, epoch_shadowtongue, faction_authority, faction_insurgency, governance_vote, investigation_tier, lore_elara_senator, morality_dark, season_closing, trust_elara_luminous, tv_spreading, unlock_trade_empire.

**Variants to commission:** `tv_exposed`, `tv_corrupted`, `tv_quarantined`, `cycle_dawn/midday/dusk/nightwatch`, `faction_dreamer`, `faction_pureflame`, `faction_panopticon`, `faction_collectors`, `faction_multi`.

| Variant | Delta |
|---|---|
| `tv_exposed` | "One of the three overhead holos drops a frame; faint scan-lines on the right-wall white text panel." |
| `tv_corrupted` | "All three overhead holos carry phosphor static; war-table's projection RGB-fringes at the edges. Banners on the table edge appear in two layers — warm-gold underlayer + indigo overlayer." |
| `tv_quarantined` | "Hazard tape across the captain's chair. War-table covered with a sealed evidence-tarp. Hierarchy quarantine sigil painted across the brass plaque. Holos dark." |
| `cycle_*` | Through the panoramic viewport — starfield → daylight haze through atmospheric layer → magenta dusk through orbital glow → black with stars → deep void with red emergency-fixture interior. |

**Hotspot sprite layer specs:** 50 hotspots — top-level interactive anchors:

| # | id | type | cx | cy | w | h | Art note |
|---|---|---|---|---|---|---|---|
| 1 | tactical-display | terminal `/board` | 50 | 71 | 44 | 38 | Central war-table; primary focal blob |
| 2 | war-map-display | terminal `/war-map` | — | — | — | — | One of overhead holos |
| 3 | timeline-projector | terminal `/saga-timeline` | — | — | — | — | Overhead holo |
| 4 | guild-registry | terminal `/guild` | — | — | — | — | Overhead holo |
| 5 | sealed-memory-board | terminal `/conspiracy-board` | — | — | — | — | Bookshelf folio binder |
| 6 | diplomacy-table | terminal `/diplomacy` | — | — | — | — | Side console |
| 7 | mission-board | terminal `/quests` | — | — | — | — | Side console |
| 8 | nav-console | interact `nav-calibration` | — | — | — | — | Navigation seat between chairs |

(45+ additional architect-channel mystery hotspots — sized 2–6% — distributed across the room. See GameContext.tsx for full list. Bridge is one of three highest-density rooms.)

---

## 4. archives

**zipDir:** `archives` · **canonical:** `ark.archives`

**Layout sentence:**
> Archives main reading hall, wide architectural shot from the entry-arch vantage. Centre-back: curved data-orb pedestal. Left and right walls: tall brass-framed scroll racks with frosted-glass fronts. Floor: red-veined marble inlaid with brass index lines. Far end: vaulted reading-table chamber. Ceiling: hand-stitched signage banners + warm-gold service strips.

**Existing manifest variants (15):** baseline, act_tier_2, battlepass_winter, companion_trust, cycle_longnight, epoch_shadowtongue, faction_antiquarian, governance_lore_unlock, investigation_tier, lore_shadowtongue, morality_dark, season_closing, trust_shelfmate, tv_spreading, unlock_loredex.

**Variants to commission:** `tv_exposed`, `tv_corrupted`, `tv_quarantined`, `cycle_dawn/midday/dusk/nightwatch`, additional factions.

| Variant | Delta |
|---|---|
| `tv_exposed` | "Data-orb pedestal flickers; one scroll-rack glass panel shows hairline scan-lines." |
| `tv_corrupted` | "Multiple scroll racks show two-layer text — warm-gold underlayer in Elara's hand, slightly out-of-register indigo overlayer. Data-orb glows the unnameable indigo. Walls within 1 m of the orb show mosaic creep." |
| `tv_quarantined` | "Reading hall sealed. Hazard tape across the data-orb pedestal. Antiquarian quarantine sigils on each scroll rack. Reading table covered in a sealed tarp." |

**Hotspot sprite layer specs:** 46 hotspots — primary anchors:

| # | id | type | Art note |
|---|---|---|---|
| 1 | the-codex | terminal `/codex` | Reading-table central pedestal |
| 2 | search-terminal | terminal `/search` | Wall console |
| 3 | clue-journal | terminal `/clue-journal` | Bookshelf-mounted journal |
| 4 | data-banks | examine `room-mystery:archives:data-banks` | Back-wall data-orb |

(42 architect-channel + lore mysteries — sized 2–5% — distributed across scroll racks, lectern, drawers, reading table. Archives is the Shadow Tongue primary room — corrupted/text-corruption-loop video variants already shipped.)

---

## 5. comms_array

**zipDir:** `comms_array` · **canonical:** `ark.comms_array`

**Layout sentence:**
> Comms Array operations bay wide shot. Back wall: bank of CRT-style monitors (16-screen grid). Centre mid-ground: radio console with brass dials. Stage-left: pirate-frequency TV station. Stage-right: training console + corridor to bridge. Floor: plate steel with cable trays. Lighting: amber CRT phosphor + warm-gold ceiling strips.

**Existing manifest variants (14):** baseline, act_tier_2, battlepass_winter, cycle_longnight, epoch_shadowtongue, faction_insurgency, governance_blackout, human_reveal_ghost, investigation_tier, morality_dark, season_closing, trust_human_warm, tv_spreading, unlock_cipher_den.

**Variants to commission:** TV axis (this is the room most affected by TV; commission all 4 missing TV states as P0), cycle phases, additional factions.

| Variant | Delta |
|---|---|
| `tv_exposed` | "Roughly 4 of 16 CRTs show hairline scan-lines + intermittent broadcast-static. The radio-console oscilloscope flickers; pirate-frequency TV shows a single ghost-frame." |
| `tv_corrupted` | "All 16 CRTs alive with phosphor static + shifting RGB. The radio console's brass dials reflect cyan/magenta chromatic bands. Air carries faint pixel-shaped motes drifting toward every CRT." |
| `tv_quarantined` | "CRT bank dark, glass cracked. Hazard tape across every console. Hierarchy quarantine sigil painted across the radio console. Pirate-frequency TV smashed." |

**Hotspot sprite specs:** 36 hotspots — primary anchors:

| # | id | type | cx | cy | w | h | Art note |
|---|---|---|---|---|---|---|---|
| 1 | broadcast-screen | terminal `/watch` | — | — | — | — | One of the 16-screen grid screens |
| 2 | pirate-frequency-tv | terminal `/transmissions` | — | — | — | — | Standalone vintage CRT, stage-left |
| 3 | training-console | terminal `/lore-tutorials` | — | — | — | — | Stage-right console |
| 4 | radio-console | examine `room-mystery:comms-array:radio-console` | — | — | — | — | Centre mid-ground primary focal |
| 5 | comms-relay | interact `comms-relay-import` | — | — | — | — | Wall-mounted relay rack |

(31 architect/audio mysteries distributed across desk + wall surfaces.)

---

## 6. observation_deck

**zipDir:** `observation_deck` · **canonical:** `ark.observation_deck`

**Layout sentence:**
> Observation Deck panoramic dome wide shot — vaulted glass viewport occupying the upper 60% of frame, showing void-black starfield. Foreground: hex-tile floor with phosphor-lavender grout. Centre-back: bond-resonance altar (low brass plinth). Stage-left: music terminal. Stage-right: crystal cradle in brass armature. Doors: comms array (left), engineering (right).

**Existing manifest variants (14):** baseline, act_tier_2, battlepass_winter, cycle_longnight, epoch_shadowtongue, faction_dreamer, governance_classified, investigation_tier, lore_architect, morality_dark, season_interregnum, trust_eidolon_resonant, tv_spreading, unlock_memorial.

**Variants to commission:** `tv_exposed`, `tv_corrupted`, `tv_quarantined`, `cycle_dawn/midday/dusk/nightwatch`, additional factions.

**Notable:** observation_deck has 3 already-shipped state variants in `roomMediaPrompts.ts` (`initial`, `bond-resonance`, `purification-active`) — these are FLAG states, separate from axis variants. Producer keeps them intact when adding axis variants.

| Variant | Delta |
|---|---|
| `tv_exposed` | "Music terminal CRT shows hairline scan-lines. The viewport starfield carries faint pixel-motes that drift slowly outward from the centre." |
| `tv_corrupted` | "Hex floor's phosphor-lavender grout shifts toward unnameable-indigo. The viewport starfield rasterizes at 4–8 px mosaic. Crystal cradle's quartz reflects cyan/magenta bands." |
| `tv_quarantined` | "Bond-altar covered in evidence tarp. Music terminal smashed. Viewport sealed with welded bronze plate over the lower 30%." |

**Hotspot sprite specs:** 13 hotspots:

| # | id | type | Art note |
|---|---|---|---|
| 1 | music-terminal | terminal `/discography` | Stage-left console with vinyl-style affordance |
| 2 | panoramic-viewport | interact | Vaulted glass dome occupying upper frame |
| 3 | bond-resonance-altar | interact | Centre-back low brass plinth |
| 4 | crystal-cradle | interact | Brass armature stage-right with quartz orb |
| 5 | crew-memorial | examine | Plaque on side wall |
| 6 | strange-constellation | examine | Specific star cluster in viewport upper-left |

(7 mystery hotspots for the cosmic-weather console + calms register + akai cycle telemetry + dreamer's shield diagnostic — sized 2–4%.)

---

## 7. engineering_bay

**zipDir:** `engineering_bay` · **canonical:** `ark.engineering_bay`

**Layout sentence:**
> Engineering bay wide shot framed on the workbench. Reactor occupies back-right at half height with containment lens visible. Centre mid-ground: crafting workbench with rolled schematics + bench tools. Stage-left mid-ground: research-station mini-game console. Stage-right foreground: tool rack + engineer's locker. Doors: forge workshop (back-right), observation deck (back-left), armory (right). Floor: heavy plate steel; ceiling: exposed copper conduit.

**Existing manifest variants (14):** baseline, act_tier_3, battlepass_winter, cycle_longnight, epoch_shadowtongue, faction_insurgency, governance_quarantine, investigation_tier, lore_shadowtongue_complete, morality_dark, trust_shadowtongue, tv_spreading, unlock_chaos, unlock_crafting.

**Variants to commission:** TV gaps, cycle phases, additional factions.

| Variant | Delta |
|---|---|
| `tv_exposed` | "Reactor containment lens flickers once mid-frame. Research-station CRT shows hairline scan-lines." |
| `tv_corrupted` | "Reactor's phosphor-lavender containment lens shifts to unnameable-indigo. Schematic pad two-layers — warm-gold underlayer + slightly out-of-register indigo overlayer." |
| `tv_quarantined` | "Reactor sealed with bronze welded plates. Bench covered. Hierarchy quarantine sigils across all three doors." |

**Hotspot sprite specs:** 23 hotspots:

| # | id | type | Art note |
|---|---|---|---|
| 1 | crafting-bench | terminal `/research-lab` (→ `/card-crafting` per plan) | Centre mid-ground bench (per Forge cleanup plan, this is now "Card Synthesis Console") |
| 2 | research-station | terminal `/research-minigame` | Stage-left console |
| 3 | reactor-core | examine `room-mystery:engineering:reactor-core` | Back-right reactor (large silhouette) |
| 4 | holographic-blueprints | examine | Wall-mounted projection |
| 5 | door-forge-workshop | door `forge-workshop` | Back-right blast door |
| 6 | door-observation-deck | door | Back-left door |
| 7 | door-armory | door | Right-side door |

(16 mystery hotspots + ambient examines.)

---

## 8. forge_workshop

**zipDir:** `forge_workshop` · **canonical:** `ark.forge_workshop`

**Layout sentence:** *(replaces the manifest's current baseline framing; see commission plan for hotspot rewiring)*
> Forge Workshop wide shot from the south-door threshold looking NORTH into the chamber. 11×11 m square plan with 6 m central chimney. Cast-iron grating floor with central 3×3 m solid-plate forge zone. **Centre-frame at 50% horizontal / 60% vertical:** the central brass-rimmed forge fire-pit + cast-iron anvil on basalt block. **Stage-left ~15% horizontal / 55% vertical:** brass-bound ceramic kiln. **Stage-right ~80% horizontal / 35% vertical:** apprentice signature-card shrine (phosphor-lavender ritual circle on low oxblood-leather altar). **Lower-left ~25% horizontal / 82% vertical:** bench workstation with leather recipe ledger, calipers, oil lamp. **Stage-left mid ~10% horizontal / 70% vertical:** schema rack of bound folios. North wall: 3 quench tanks + crafting-journal display. East/West walls: hammer-stations with hanging hammers.

**Existing manifest variants (14):** baseline, act_tier_3, act_tier_7, battlepass_winter, cycle_longnight, epoch_shadowtongue, faction_insurgency, governance_quarantine, investigation_tier, morality_dark, tv_corrupted, tv_spreading, unlock_apprentice, unlock_mastered.

**Variants to commission:** `tv_exposed`, `tv_quarantined`, `cycle_dawn/midday/dusk/nightwatch`, additional factions (authority, dreamer, pureflame, panopticon, collectors, multi).

| Variant | Delta |
|---|---|
| `tv_exposed` | "Crafting-journal display on the north wall flickers. Kiln-glow status pulse drops a frame. Faint scan-lines on the recipe-archive south-wall display." |
| `tv_quarantined` | "Forge cold, ash-banked. Bench workstation covered. Hierarchy quarantine sigils painted across the central forge zone. Hammer racks bare." |
| `cycle_dawn/midday/dusk/nightwatch` | "Lighting only — the room has no exterior windows, so cycle reads through the south-door window cone and the crafting-journal back-wall display brightness shifting." |
| `faction_authority` | "Authority red-on-black banners draped from the chimney; ranked column flags flanking the central forge. Hammer-rack handles in red-gold." |
| `faction_dreamer` | "Indigo-violet gauze veils draped from the chimney over the forge zone. Shrine altar dressed with silver moon glyphs." |
| `faction_pureflame` | "Vertical-flame icons inscribed on the kiln door. Candle racks lining the bench workstation. Smoke haze hugs the chimney." |
| `faction_panopticon` | "Lens-aperture orange accents on every hammer-rack. Surveillance camera housings mounted above each anvil station." |
| `faction_collectors` | "Deep-blue + bone-white banners. Specimen-jar labels on the schema-rack folios. Archival dust on the kiln." |
| `faction_multi` | "Authority red banners on the south wall, insurgency stencils tagged across the central forge zone. Visible tension." |

**Hotspot sprite layer specs (15):**

| # | id | type | action | cx | cy | w | h | Art note |
|---|---|---|---|---|---|---|---|---|
| 1 | central-forge | terminal | `/forge` → `/engineers-bench` | 41.5 | 47 | 27 | 50 | Primary focal — brass-rimmed fire-pit + anvil, dead-centre |
| 2 | material-vault | examine | — | 9 | 45 | 18 | 40 | Far-left stacked storage; scroll rack + dark cabinet |
| 3 | recipe-archive | terminal | `/forge` → `/engineers-bench?view=recipes` | 54.5 | 49 | 15 | 22 | Right-of-forge tool wall with rolled schematics |
| 4 | skill-totems | examine | — | 87 | 56 | 24 | 68 | Tall carved brass throne stage-right with 5 totem-medallions |
| 5 | door-engineering | door | `engineering` | 50 | 96 | 20 | 6 | Foreground bottom-centre blast door |
| 6 | anvil | interact | `room-mystery:forge-workshop:anvil` → `/engineers-bench?skill=weaponsmith` | 53.5 | 65.5 | 13 | 15 | Anvil at foot of forge; dished brass face |
| 7 | schema-rack | interact | `room-mystery:forge-workshop:schema-rack` → `/engineers-bench?view=discovery` | 5 | 44 | 10 | 32 | Far-left scroll rack of rolled diagrams |
| 8 | kiln | interact | `room-mystery:forge-workshop:kiln` → `/engineers-bench?skill=alchemy` | 19 | 83 | 28 | 22 | Foreground-left brass-bound clay quenching pool |
| 9 | signature-forge-altar | terminal | `/signature-forge` (NEW per plan) | ~80 | ~35 | ~14 | ~22 | Stage-right phosphor-violet ritual altar — must read as ritual not industrial |
| 10 | chained-auro-tally | interact | mystery | 14.5 | 39 | 5 | 6 | Notebook on peg beside scroll rack |
| 11 | chained-auro-side-room | interact | mystery | 14.5 | 48 | 5 | 6 | Cabinet whiteboard side-room |
| 12 | chained-tarn-letter | interact | mystery | 51.5 | 43.5 | 5 | 5 | Sealed letter on tool wall |
| 13 | advocate-weave-spec | interact | mystery | 57.5 | 43.5 | 5 | 5 | Spec panel on tool wall |
| 14 | infernal-blank-pages | interact | mystery | 14.5 | 56.5 | 5 | 5 | Box of preliminaries in material-vault cabinet |
| 15 | charter2-house-othisen | interact | mystery | 90.5 | 53 | 5 | 6 | Throne left-arm plaque |

---

## 9. armory

**zipDir:** `armory` · **canonical:** `ark.armory`

**Layout sentence:**
> Armory wide shot. Centre mid-ground: combat arena demo-platform. Stage-left: weapon rack along left wall. Stage-right: card-battle station + strategy chess table + spectator screen. Far-back: knowledge terminal alcove. Foreground: strategy table and competitive bench. Doors: engineering (back-left), cargo hold (back-right). Lighting: cold steel + accent oxblood under-glow on the arena.

**Existing manifest variants (14):** baseline, act_tier_3, act_tier_5, battlepass_winter, cycle_longnight, epoch_shadowtongue, faction_authority, faction_insurgency, governance_quarantine, investigation_tier, morality_dark, trust_jericho, tv_spreading, unlock_combat.

**Variants to commission:** TV gaps, cycle phases, dreamer/pureflame/panopticon/collectors/multi factions.

| Variant | Delta |
|---|---|
| `tv_exposed` | "Card-battle station CRT shows hairline scan-lines. One spectator screen drops a frame." |
| `tv_corrupted` | "All terminal screens carry phosphor static. Combat arena platform reflects cyan/magenta from screen bleed. Strategy-table chess pieces RGB-fringe at the squares." |
| `tv_quarantined` | "Arena sealed with hazard tape. Card-battle station off; chess table covered." |

**Hotspot sprite specs (11):**

| # | id | type | action | Art note |
|---|---|---|---|---|
| 1 | combat-arena | terminal | `/fight` | Centre mid-ground demo-platform |
| 2 | card-battle-station | terminal | `/battle` | Stage-right CRT cabinet |
| 3 | knowledge-terminal | terminal | `/quiz` | Far-back wall alcove |
| 4 | strategy-table | terminal | `/chess` | Foreground table with chess set |
| 5 | spectator-screen | terminal | `/spectate` | Stage-right large wall-mounted screen |
| 6 | weapon-rack | examine | — | Stage-left wall rack |
| 7 | fallen-dog-tag | item | `agent-zero-dogtag` | Foreground pickup near weapon rack |
| 8 | motivational-poster | examine | mystery | Side-wall poster |
| 9 | agent-zero | npc | `npc:agent_zero` | Standing NPC silhouette (only NPC rendered in baseline) |
| 10 | door-engineering | door | — | Back-left door |
| 11 | door-cargo-hold | door | — | Back-right door |

---

## 10. cargo_hold

**zipDir:** `cargo_hold` · **canonical:** `ark.cargo_hold`

**Layout sentence:**
> Cargo Hold wide-shot — heavy crane gantry across the upper third with chain-tackle hanging. Mid-ground: stacked crates in the central aisle, manifest terminal at right of frame. Stage-left: trade empire terminal + marketplace board. Stage-right: store counter + personal inventory locker. Far-back: fleet docking-bay massive doors (closed in baseline). Foreground: brass-bound floor demarcation lines.

**Existing manifest variants (14):** baseline, act_tier_2, act_tier_4, battlepass_winter, cycle_longnight, epoch_shadowtongue, faction_authority, governance_trade, investigation_tier, morality_dark, season_interregnum, tv_corrupted, tv_spreading, unlock_cosmetic.

**Variants to commission:** `tv_exposed`, `tv_quarantined`, cycle phases, dreamer/pureflame/insurgency/panopticon/collectors/multi factions.

**Note:** `cargoHoldComposite.ts` is the canonical composite reference for this room — TV-infection ships 3 base states (clean / spreading / corrupted) per the composite resolver. `tv_exposed` and `tv_quarantined` are gaps.

| Variant | Delta |
|---|---|
| `tv_exposed` | "Manifest terminal CRT flickers. Crane-gantry indicator lamps drop a frame." |
| `tv_quarantined` | "Hazard tape across the central aisle. Crates covered. Hierarchy quarantine sigil on fleet bay door. Trade empire terminal off." |

**Hotspot sprite specs (13):**

| # | id | type | action | Art note |
|---|---|---|---|---|
| 1 | trade-empire-terminal | terminal | `/trade-empire` | Stage-left primary console |
| 2 | requisitions-counter | terminal | `/store` | Stage-right service counter |
| 3 | marketplace-board | terminal | `/marketplace` | Wall-mounted board left of trade-empire |
| 4 | personal-locker | terminal | `/inventory` | Stage-right locker bank |
| 5 | fleet-docking-bay | terminal | `/fleet` | Back-wall massive bay doors |
| 6 | sealed-crate | examine | — | Foreground featured crate |
| 7 | door-armory | door | `armory` | Stairs / back-left |
| 8 | door-captains-quarters | door | `captains-quarters` | Stage-right secondary door |
| 9 | rubber-chicken | examine | mystery | Easter-egg pickup on a crate |

(4 architect mystery hotspots distributed across crates + walls.)

---

## 11. captains_quarters

**zipDir:** `captains_quarters` · **canonical:** `ark.captains_quarters`

**Layout sentence:**
> Captain's Quarters wide-shot — private chamber framing. Foreground-centre: strategic table with deck-builder schematic. Stage-left: trophy wall with mounted faction relics. Stage-right: companion quarters door + season terminal. Centre-back wall: star viewport showing void with faint nebula. Stage-right wall: morality compass instrument. Floor: oxblood carpet with brass inlay. Door foreground: cargo-hold stairs.

**Existing manifest variants (14):** baseline, act_tier_1, act_tier_3, act_tier_5, battlepass_winter, cycle_longnight, epoch_shadowtongue, governance_vote, investigation_tier, lore_captain_kael, morality_dark, trust_dmc_wary, tv_spreading, unlock_companion_hub.

**Variants to commission:** TV gaps, cycle phases, all factions (no faction variants ship yet — biggest gap of any main room).

| Variant | Delta |
|---|---|
| `tv_exposed` | "Season terminal flickers; morality compass needle stutters." |
| `tv_corrupted` | "Star viewport rasterizes at the lower edge. Trophy wall relics show two-layer engraving — warm-gold underlayer + indigo overlayer." |
| `tv_quarantined` | "Strategic table covered; companion quarters door welded shut. Trophy wall draped in hazard cloth." |

**Hotspot sprite specs (20):**

| # | id | type | action | Art note |
|---|---|---|---|---|
| 1 | trophy-wall | terminal | `/trophy` | Stage-left primary focal |
| 2 | strategic-table | terminal | `/deck-builder` | Foreground-centre table with cards laid out |
| 3 | companion-quarters | terminal | `/companions` | Stage-right doorway with affordance |
| 4 | season-terminal | terminal | `/battle-pass` | Wall-mounted CRT |
| 5 | morality-compass | terminal | `/morality-census` | Brass instrument on stage-right wall |
| 6 | star-viewport | examine | — | Centre-back panoramic window |
| 7 | photo-cat | examine | mystery | Foreground desk photo of a cat |
| 8 | cracked-mirror | examine | — | Stage-left wall mirror with hairline crack |
| 9 | door-cargo-hold | door | `cargo-hold` | Foreground stairs |
| 10 | door-antiquarian-library | door | `antiquarian-library` | Stage-right hidden passage (only revealed at tier 5) |

(10 architect/investigation mysteries — Locke correspondence, Coordinator summons, Director summons, Mechronis file, Vex diary, etc.)

---

## 12. antiquarians_library

**zipDir:** `antiquarians_library` · **canonical:** `ark.antiquarians_library`

**Layout sentence:**
> Antiquarian's Library pocket-dimension wide-shot. Vaulted hall with brass-bound bookshelves floor to ceiling, six aisles receding. Centre mid-ground: reading table with stacked folios + brass reading lamp. Stage-left: catalog drawers wall. Stage-right: lectern on raised dais. Floor: red-veined marble inlaid with brass family-tree branches. Lighting: cold rim + warm-gold reading-table key + faint phosphor-violet glow from the back-wall index.

**Existing manifest variants (14):** baseline, battlepass_winter, cycle_longnight, epoch_shadowtongue, governance_lore_unlock, investigation_tier, lore_hierophant_complete, lore_recipe_archive, lore_tome_discovered, morality_dark, reveal_daniel_cross, season_closing, unlock_conexus, unlock_vault.

**Variants to commission:** ALL TV-axis (this room ships zero TV variants today), cycle phases, ALL factions (none ship).

**Note:** The Antiquarian's Library is a pocket dimension — not in the `ARK_ROOM_ADJACENCY` virus spread graph. Producer may choose to skip TV-axis on lore grounds (architect-channel mysteries are the room's domain, not virus). Confirm with the writing team before commissioning TV variants.

| Variant | Delta |
|---|---|
| `cycle_*` | Lighting only — through the back-wall index glow + faint sky beyond the upper galleries that don't exist in baseline; treat as a "phosphor-violet day-cycle" rather than diurnal. |

**Hotspot sprite specs (110):** the densest hotspot room in the game. Surfaces clustered on:

- **Reading table** (centre): tarn artifacts, the antiquarian's notes
- **Left wall** (catalog drawers): charter mysteries, severance audit
- **Right wall** (lectern): closing rite mysteries, ratification record
- **Back wall** (index): Daniel Cross reveal, ConneXus story
- **Aisles 1-6**: 80+ architect-channel mysteries

For the artist: render with broad clean silhouettes for the 6 aisles, the reading table, the lectern, and the back-wall index. The 110 hotspots are sized 2–5% each and overlay onto book-spine / drawer-front / lectern-page regions — they do not need individual focal points. **Critical:** keep aisle perspective stable across all variants — perspective jitter on a multi-vanishing-point room is jarring.

---

## 13. engineering_core

**zipDir:** `engineering_core` · **canonical:** `ark.engineering_core`

**Layout sentence:**
> Engineering Core hidden-deck wide-shot. Cylindrical chamber framing — reactor coil at frame-centre rising the full vertical extent, surrounded by 8 brass-bound coolant pipes radiating outward. Stage-left foreground: core terminal. Stage-right foreground: coolant valve cluster. Floor: cast-iron grating with reactor-glow up-light. Ceiling: open framework with the chamber's vertical shaft visible above.

**Existing manifest variants (10):** baseline, battlepass_winter, cycle_longnight, epoch_shadowtongue, faction_ironlions, governance_combat, governance_quarantine, investigation_tier, morality_dark, tv_spreading.

**Variants to commission:** TV gaps, cycle phases (longnight already ships), more factions.

| Variant | Delta |
|---|---|
| `tv_exposed` | "Core terminal CRT flickers; coolant-pipe indicator lamps drop a frame." |
| `tv_corrupted` | "Reactor coil's warm-gold glow shifts toward unnameable-indigo at the rim. Coolant pipes show two-layer fluid level — warm-gold underlayer + indigo overlayer." |
| `tv_quarantined` | "Reactor shut down. Hazard tape across all 8 coolant pipes. Core terminal smashed. Chamber sealed." |

**Hotspot sprite specs (14):**

| # | id | type | action | Art note |
|---|---|---|---|---|
| 1 | reactor-core | examine | — | Frame-centre primary focal (largest silhouette) |
| 2 | reactor-coil | interact | mystery | Coil at the heart of the core |
| 3 | coolant-pipe-array | interact | mystery | Radiating pipes around reactor |
| 4 | core-terminal | interact | mystery | Stage-left console |
| 5 | warp-drive-schematics | examine | — | Wall-mounted blueprint |
| 6 | resonance-frequency | item | `core-frequency` | Item pickup on terminal |
| 7 | door-engineering-bay | door | `engineering` | Foreground bottom door |

(7 architect-mystery hotspots distributed across the reactor face + walls.)

---

## 14. oracle_sanctum

**zipDir:** `oracle_sanctum` · **canonical:** `ark.oracle_sanctum`

**Layout sentence:**
> Oracle Sanctum hidden-deck wide-shot. Circular ritual chamber. Centre-frame: low ritual altar with brass armillary sphere above. Walls: alternating brass-and-glass panels showing prophecy fragments. Floor: phosphor-lavender inlaid sigil pattern. Ceiling: vaulted with central oculus showing void-starfield. Stage-left: speaker assignment console. Stage-right: line-matching console.

**Existing manifest variants (10):** baseline, battlepass_winter, cycle_longnight, epoch_shadowtongue, faction_antiquarian, governance_blessing, investigation_tier, morality_dark, tv_corrupted, tv_spreading.

**Variants to commission:** `tv_exposed`, `tv_quarantined`, cycle phases, more factions.

| Variant | Delta |
|---|---|
| `tv_exposed` | "Two of the prophecy-fragment glass panels flicker. Armillary sphere drops a rotational frame." |
| `tv_quarantined` | "Altar covered. Armillary sphere bagged. Oculus sealed with welded plate. Prophecy panels blacked out." |

**Hotspot sprite specs (40):** primary focals on the altar + 2 consoles + 4 of the 6 prophecy panels. ~30 architect-mystery hotspots distributed across the panels.

| # | id | type | Art note |
|---|---|---|---|
| 1 | ritual-altar | interact | Centre-frame primary focal |
| 2 | armillary-sphere | examine | Directly above altar |
| 3 | speaker-assignment-console | interact | Stage-left console |
| 4 | line-matching-console | interact | Stage-right console |

---

## 15. war_room

**zipDir:** `war_room` · **canonical:** `ark.war_room`

**Layout sentence:**
> War Room wide-shot — council-style chamber. Round war-table dead-centre mid-ground with cosmic star-map projection above. 5 faction banners standing on the table edge. Stage-left: bookshelf of bound folios in oxblood-leather binders. Stage-right: white text panel with brass frame. Three overhead holographic UI panels (green/cyan/purple). Foreground: 2 captain's chairs with seated figures only as silhouettes. South wall (behind camera): captured-document archive racks visible only at upper frame edges.

**Existing manifest variants (9):** baseline, battlepass_winter, cycle_longnight, epoch_shadowtongue, faction_succession, investigation_tier, morality_dark, tournament_finals, tv_spreading.

**Variants to commission:** `tv_exposed`, `tv_corrupted`, `tv_quarantined`, cycle phases, more factions.

| Variant | Delta |
|---|---|
| `tv_exposed` | "One of the three overhead holos drops a frame; faint scan-lines on the right-wall white text panel." |
| `tv_corrupted` | "War-table projection RGB-fringes at edges. Banners on table edge in two layers — warm-gold underlayer + indigo overlayer. Bookshelf folios spines show mosaic creep." |
| `tv_quarantined` | "War-table covered with sealed evidence-tarp. Hierarchy quarantine sigils across the captain's chair. Holos dark. Bookshelf draped in hazard cloth." |

**Hotspot sprite specs (73):** highest-density action-room. Primary focal anchors:

| # | id | type | action | Art note |
|---|---|---|---|---|
| 1 | battle-map | examine | — | Centre war-table primary focal |
| 2 | tactical-archives | examine | — | Right-wall text panel |
| 3 | guild-war-console | terminal | `/guild-war` (DEAD link per cleanup plan; reroute to `/guild`) | Stage-left bookshelf as console |
| 4 | faction-war-map | terminal | `/faction-wars` | Three overhead holos |
| 5 | egg-war-medal | item | `war-medal` | Pinned to foreground chair |
| 6 | door-bridge | door | `bridge` | Bottom-left return corridor |

(67 architect-channel mysteries laid out in three zones — overhead holos + banners 6×7 grid, right text panel 4×5 grid, special surfaces. See `GameContext.tsx:2689` for the existing producer-annotation block.)

---

# Hotspot sprite layer — universal rules

For every room above, sprite layers are **not separate PNG files** in the current pipeline. Hotspots are coordinate rectangles overlaid on the single room render. So the artist's job for each hotspot is:

1. **Place a clear, well-silhouetted feature at the cx/cy coordinates** such that the rectangle (cx ± w/2, cy ± h/2) lands on a visually meaningful surface.
2. **Maintain that silhouette across all variants** so the hotspot stays aimable when the runtime swaps base art.
3. **Critical-anchor hotspots** (any hotspot routing to a `/route` terminal — these are the gameplay entry points) must NEVER be obscured by axis overlays. The composition lock from `AXIS_STATE_ART_PROMPT_GUIDE.md` §2 protects this if followed.

If the project ever moves to per-hotspot sprite assets (e.g. for tooltip thumbnails), the sprite-asset spec is:

- **Path:** `art/rooms/sprites/<zipDir>/<hotspot-id>.webp`
- **Resolution:** 512×512 (square 1:1) for items + terminals + interactives; 768×432 (16:9) for landscape features like the bench workstation
- **Format:** 8-bit RGB WebP at quality 90+; transparent background optional (room palette as natural backdrop is preferred)
- **Crop:** centred on the hotspot's feature with 10–15% padding on all sides
- **Lighting:** match the room's baseline lighting tone (not corrupted / not factioned)

---

# Validation checklist for the whole package

Before any commission ZIP is accepted:

- [ ] Every baseline renders at exactly **2752 × 1536 px**, 8-bit RGB PNG, sRGB, no alpha.
- [ ] Every axis-variant PNG passes the toggle test against its baseline — architectural features within ±5 px.
- [ ] Filename matches `state_<axis>_<value>.png` exactly (snake-case for both axis name and state name).
- [ ] No rendered UI text anywhere; banners use stylized glyphs only.
- [ ] No watermarks, no signatures.
- [ ] All critical-anchor hotspots (every `terminal` or `door` action) have unambiguous silhouettes in the baseline that survive every variant render.
- [ ] `pnpm tsx apps/scripts/audit-art-ratchet-gaps.ts` reports a smaller gap than before the commission.
- [ ] `pnpm ship:check` shows `art.axis9_state_coverage`, `art.axis11_state_coverage`, `art.axis12_state_coverage` ratchets shrink (or at minimum do not grow).

---

# Commission priorities (recommended order)

If the producer ships incrementally rather than all at once:

1. **P0 — TV-infection completeness** (axis 9 gaps). Fills the dramatic-narrative axis the runtime already pipes flags into.
   - Commission `tv_exposed` + `tv_quarantined` across the 8 main rooms in the `ARK_ROOM_ADJACENCY` graph: cryo_bay, medical_bay, bridge, comms_array, observation_deck, engineering_bay, armory, cargo_hold. **16 PNGs.**
   - Commission `tv_corrupted` for the rooms missing it: cryo_bay, medical_bay, bridge, archives, comms_array, observation_deck, engineering_bay, captains_quarters, engineering_core, war_room. **10 PNGs.**

2. **P1 — Cycle-phase completeness** (axis 11 gaps). Lowest authoring overhead per variant; high atmospheric payoff.
   - Commission `cycle_dawn`, `cycle_midday`, `cycle_dusk`, `cycle_nightwatch` across the 9 rooms with exterior views or atmospheric registers (cryo_bay, medical_bay, bridge, comms_array, observation_deck, cargo_hold, captains_quarters, war_room, antiquarians_library). **36 PNGs.**

3. **P2 — Faction-livery completeness** (axis 12 gaps). Heaviest decorative authoring; reserve for after P0/P1.
   - Per-room faction gaps as enumerated in each block above. Priority order: hierarchy, insurgency, panopticon, dreamer, pureflame, collectors, multi.

**Total package authorized: ~120–150 PNGs across the 15 main rooms** (depending on how aggressively axis 12 is commissioned).

---

# Notes for the runtime team (engineering)

After producer drop:

1. Drop the ZIPs in the asset-ingest folder; the normaliser (`pnpm tsx apps/scripts/normalize-room-art-zip.ts`) maps `state_<axis>_<value>.png` → `art/rooms/<zipDir>/state_<axis>_<value>.png`.
2. Upload via `pnpm assets:upload`.
3. Re-run `pnpm tsx scripts/_check-art-coverage.mjs` to confirm CDN HEAD-200 on every new entry.
4. Re-run `pnpm ship:check` — confirm the three axis ratchets shrink.
5. Update `roomArtManifest.data.ts` with new entries (one `{ id, zipDir, canonicalSpaceId, ..., relPath }` block per PNG). The normaliser dry-run prints the exact block.
6. Add or extend per-room composite resolvers in `apps/shared/roomComposition/` if any new room is being authored with axis-specific overlay logic (cryo_bay, medical_bay, etc. already have composites; new rooms beyond the first 14 may need one).

The CSV-export pipeline at `apps/shared/_csvExport/roomArtExport.ts` (if present) regenerates the spreadsheet feed producers consume — re-run after manifest updates.
