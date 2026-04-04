# VISUAL PRODUCTION BIBLE — Dischordian Saga

> Every image, video clip, and visual asset needed to make
> Ark 1047 feel like a living, breathing AAA experience.
>
> **Tools**: Magnific (upscaling), Nano Banana 2 (image gen), Kling Omni (video gen)
> **Style**: Dark sci-fi, BioWare cinematic, Blade Runner meets Mass Effect
> **Resolution**: All images 2x minimum for retina. Videos 1080p minimum.

---

## 1. CHARACTER PORTRAITS

Each NPC needs: full portrait (512x768), bust (256x256), 4 expression variants, manifestation overlay.

### ELARA — Ship AI / Senator Elara Voss
- **P0** `elara_portrait_full.png` (512x768)
  - Prompt: "Holographic woman mid-30s, silver-white hair, cyan glowing eyes, translucent blue skin showing circuit traces underneath, senatorial robes ghosting through holographic form, warm but precise expression, dark spacecraft bridge background, volumetric light, cinematic portrait, sci-fi"
  - Expressions: neutral, concerned, vulnerable (eyes down), speaking (mouth open)
  - Manifestation overlay: holographic scanline effect, cyan color bleeding

### THE HUMAN — Last Archon / The Detective
- **P0** `the_human_portrait_full.png` (512x768)
  - Prompt: "Male face emerging from digital static and red glitch artifacts, one eye visible through corrupted data streams, ancient and knowing expression, substrate layer visualization — code and red light behind the face, dark void background, cyberpunk noir portrait"
  - Expressions: neutral (calculating), amused (one-sided smirk), vulnerable (both eyes visible), dangerous (red glow intensifies)
  - Manifestation overlay: red glitch distortion, VHS tracking lines

### AGENT ZERO — Dead Insurgent Signal
- **P0** `agent_zero_portrait_full.png` (512x768)
  - Prompt: "Female military operative silhouette in orange static interference, combat gear fragments visible through signal noise, short dark hair, determined jaw visible, radio wave distortion effect, orange and black color palette, ghost in the machine aesthetic, encrypted transmission visualization"
  - Expressions: urgent (eyes sharp), haunted (looking away), defiant (chin up), spectral (fading)
  - Manifestation overlay: signal static, orange noise bands

### ADJUDICATOR LOCKE — New Babylon Diplomat
- **P0** `locke_portrait_full.png` (512x768)
  - Prompt: "Sharp-featured man in purple formal diplomatic attire, New Babylon insignia (scales of justice with one side weighted), predatory smile, manicured appearance, dark trade office background with holographic market data, purple and gold accents, diplomatic menace, sci-fi politician portrait"
  - Expressions: mercantile (smile), predatory (narrowed eyes), collegial (open), judicial (stern)
  - Manifestation overlay: clean signal, purple accent glow

### THE SOURCE / KAEL — Patient Zero
- **P0** `the_source_portrait_full.png` (512x768)
  - Prompt: "Male face dissolving into viral tendrils of red and black, one human eye remaining with genuine compassion, Kael's younger face visible underneath the viral corruption like a palimpsest, bio-organic horror mixed with tragic beauty, the Thought Virus consuming a hero, dark medical bay background, body horror meets pathos"
  - Expressions: viral (fully corrupted), grieving (Kael showing through), prophetic (eyes glowing), empty (hollow)
  - Manifestation overlay: viral corruption tendrils, red-black organic distortion

### THE ANTIQUARIAN — Timekeeper / The Programmer
- **P0** `antiquarian_portrait_full.png` (512x768)
  - Prompt: "Elderly man with red-glowing steampunk goggles pushed up on forehead, green temporal shimmer around his form, long leather coat, white beard, wise and slightly sad eyes, miniature city (Orb of Worlds) floating near his hand, library of impossible books behind him, time-shifted echoes of himself at different ages visible as faint afterimages"
  - Expressions: ancient (contemplative), playful (slight smile), sorrowful (goggles glowing brighter), revelatory (goggles removed, golden eyes)
  - Manifestation overlay: green temporal echo, time-shifted afterimages

### SHADOW TONGUE — Hidden Demon / SVP Communications
- **P0** `shadow_tongue_portrait_full.png` (512x768)
  - Prompt: "Face made entirely of indigo-colored text and words, features formed by flowing language — eyes are quotation marks, mouth is a serif font, hair is cascading code, elegant and literary but deeply wrong, words occasionally rearranging, forbidden manuscript pages swirling in background, ASMR-beautiful but uncanny valley, language corruption personified"
  - Expressions: invisible (barely perceptible text), seductive (words forming a smile), scholarly (organized text), corrosive (text scrambling)
  - Manifestation overlay: indigo text distortion, words forming and dissolving

### PLAYER CHARACTER
- **P1** `player_demagi.png`, `player_quarchon.png`, `player_neyon.png` (256x256 each)
  - Species-specific base portraits for the paper doll system
  - Prompt variants per species (arcane runes / circuit lines / golden hybrid veins)

---

## 2. ROOM BACKGROUNDS (12 rooms, 16:9 ratio)

Existing CDN artwork covers some rooms. Listed below with status.

### DECK 1 — HABITATION
- **EXISTS** `cryo-bay.png` — Cryo Bay
- **EXISTS** `medical-bay.png` — Medical Bay
- **P1** `medical_bay_quarantine.png` — Red quarantine variant (red emergency lighting, contamination warning overlays)

### DECK 2 — COMMAND
- **EXISTS** `bridge.png` — Bridge
- **EXISTS** `archives.png` — Archives
- **P1** `archives_corrupted.png` — Shadow Tongue corruption variant (text floating in air, indigo glow, records rewriting themselves)
- **P1** `bridge_anomaly.png` — System anomaly variant (warning lights, ghost processes visible as holographic figures)

### DECK 3 — OPERATIONS
- **EXISTS** `comms-array.png` — Comms Array
- **EXISTS** `observation-deck.png` — Observation Deck
- **P1** `observation_deck_terminus.png` — Terminus visible through viewport (distant planet-sized structure with viral glow, approaching)

### DECK 4 — TECHNICAL
- **EXISTS** `armory.png` — Armory
- **EXISTS** `engineering.png` — Engineering Bay
- **P1** `engineering_hacking.png` — Hacking minigame background (pipe network visible on wall screens)

### DECK 5 — LOGISTICS
- **P0** `trade_hub.png` (1920x1080) — Trade Hub
  - Prompt: "Sci-fi trading post interior, holographic market displays showing fluctuating prices, New Babylon trade insignia, purple and gold lighting, merchant stalls with exotic goods, diplomatic meeting table, dark luxurious atmosphere"
- **EXISTS** `cargo-hold.png` — Cargo Bay

### DECK 6 — RESTRICTED
- **P1** `trophy_room.png` (1920x1080)
  - Prompt: "Dark exhibition hall with illuminated display cases, golden spotlights on trophy pedestals, holographic achievement plaques on walls, prestigious museum-like atmosphere"
- **EXISTS** `captains-quarters.png` — Captain's Quarters

### HIDDEN
- **P2** `programmers_study.png` (1920x1080) — Prestige 5 unlock
  - Prompt: "Impossible room existing between dimensions, source code of reality visible as golden light streams, the Programmer's desk with the Orb of Worlds, bookshelves containing every version of every story ever told, temporal distortion visible through windows showing multiple timelines simultaneously"

---

## 3. CUTSCENE STORYBOARDS (Kling Omni video)

### P0 — CRITICAL (first impression scenes)

| ID | Scene | Duration | Description | Prompt |
|----|-------|----------|-------------|--------|
| `cs_awakening` | Cryo Awakening | 15-20s | POV: Eyes open, cryo lid lifts, blue light floods in, frost on eyelashes, Elara's holographic form materializes | "First-person POV waking from cryogenic sleep, frost on camera lens clearing, blue emergency lighting, holographic woman materializing from particles of light, medical bay interior, cinematic sci-fi" |
| `cs_elara_intro` | Elara Introduction | 10-15s | Elara's full holographic form stabilizes, she makes eye contact, circuit traces pulse under her skin | "Holographic AI woman with silver hair stabilizing from scattered light particles, cyan circuit traces pulsing under translucent skin, making direct eye contact with camera, dark bridge background, Mass Effect style cinematic" |
| `cs_human_contact` | First Human Signal | 10s | Static builds, red frequency line appears, a face emerges from digital noise | "Television static resolving into a human face through red digital noise, substrate layer visualization, one eye becoming visible through corrupted data, whispered communication, dark and intimate, sci-fi horror" |
| `cs_terminus_approach` | Terminus Revealed | 15s | Camera pulls back from observation deck viewport, massive structure visible in space, viral glow | "Massive planet-sized alien megastructure approaching through deep space, glowing with red viral energy, viewed through spacecraft observation window, sense of dread and scale, cinematic space horror" |

### P1 — NPC FIRST CONTACT (7 scenes)

| ID | NPC | Duration | Prompt |
|----|-----|----------|--------|
| `cs_zero_signal` | Agent Zero | 8s | "Orange radio static coalescing into female silhouette, military signal visualization, urgent encrypted transmission" |
| `cs_locke_hail` | Locke | 8s | "Purple holographic communication channel opening, sharp-featured diplomat appearing in trade office, predatory smile" |
| `cs_source_infection` | The Source | 10s | "Medical bay screens corrupting with viral code, a face forming from red-black organic tendrils, tragic and horrifying" |
| `cs_antiquarian_echo` | Antiquarian | 10s | "Green temporal distortion rippling through archives, elderly figure stepping out of a time fold, books floating" |
| `cs_shadow_discovery` | Shadow Tongue | 10s | "Archive text lifting off pages and swirling into a face made of words, indigo glow, literary horror" |
| `cs_stargazing` | Elara Stargazing | 12s | "Holographic woman gazing through observation window at stars, 93847 sunrises reflected in her eyes, lonely beauty" |
| `cs_chess_gambit` | Chess Intro | 8s | "Holographic chess board materializing on bridge command table, AI opponent manifesting as spectral figure" |

### P2 — REVELATION CUTSCENES (major story moments)

| ID | Moment | Duration | Prompt |
|----|--------|----------|--------|
| `cs_elara_senate` | Elara's Senate Memory | 15s | "Holographic woman's eyes widening as fragments of political chamber flash around her — senatorial robes, betrayal, the Architect's hand extended, memory shattering like glass" |
| `cs_human_archon` | Human Becomes Archon | 12s | "Man in detective coat standing before impossibly large AI construct (the Architect), accepting transformation, body dissolving into the substrate, sacrifice scene" |
| `cs_source_memory` | Source's Last Memory | 12s | "Viral entity pausing as a woman's singing voice cuts through — flash of beautiful face, melody visible as golden light in red-black void, Kael's human face visible for one moment" |
| `cs_antiquarian_reveal` | Programmer Reveal | 15s | "Elderly man removing red goggles to reveal golden eyes, green temporal energy flooding outward, every version of reality visible simultaneously, the first line of code glowing" |
| `cs_shadow_truth` | Shadow Tongue's Domain | 12s | "Ship's text systems revealed as a vast library of edits — every log rewritten, Elara's memories shown as curated pages, the demon's true scope revealed" |

### P2 — BRANCHING VIDEO (Bandersnatch-style)

| ID | Decision | Branch A | Branch B | Branch C |
|----|----------|----------|----------|----------|
| `bv_human_trust` | Tell Elara about The Human? | Tell her (she's hurt) | Keep secret (guilt) | Confront Human (he's impressed) |
| `bv_source_offer` | Accept The Source's philosophy? | Resist (he respects it) | Consider (he shares more) | Accept (paradigm shift) |
| `bv_shadow_deal` | Trust Shadow Tongue's version? | Reject (he corrupts more) | Investigate (he's amused) | Accept (reality shifts) |
| `bv_elara_memory` | How to handle Elara's past? | Comfort her | Tell her truth | Let her discover alone |

---

## 4. CARD ART (6 factions)

### Faction Card Backs (6 designs, 375x525 each)
- **P1** `card_back_architect.png` — Red circuits, Architect's eye symbol
- **P1** `card_back_dreamer.png` — Green organic spirals, Dreamer's vision
- **P1** `card_back_insurgency.png` — Orange resistance symbol, combat worn
- **P1** `card_back_new_babylon.png` — Purple scales, corrupt elegance
- **P1** `card_back_antiquarian.png` — Green temporal gears, aged parchment
- **P1** `card_back_thought_virus.png` — Red-black viral tendrils, horror

### Iconic Character Cards (12 cards, 375x525 each)
- **P1** The Architect, The Dreamer, Iron Lion, The Warlord, Kael, The Enigma
- **P1** The Human, Agent Zero, The Oracle, The Engineer, The Necromancer, The Programmer

---

## 5. SHIP EXTERIOR

- **P0** `ark_1047_exterior.png` (1920x1080) — Three-quarter view of Ark 1047
  - Prompt: "Massive sci-fi spacecraft Inception Ark, sleek dark hull with cyan running lights, cross-section visible showing multiple decks, deep space background with distant nebula, cinematic spacecraft design, hard sci-fi aesthetic"
- **P1** `ark_terminus_approach.png` — Ark with Terminus visible in background
- **P2** `ark_cross_section.png` — Technical schematic style, 7 decks labeled

---

## 6. UI ELEMENTS

### Loading Screens (4 variants, 1920x1080)
- **P1** `loading_bridge.png` — Bridge systems booting
- **P1** `loading_combat.png` — Combat simulator initializing
- **P1** `loading_terminus.png` — Terminus Swarm defense grid
- **P1** `loading_trade.png` — Trade network connecting

### Achievement Graphics
- **P1** `ach_bronze.png`, `ach_silver.png`, `ach_gold.png`, `ach_diamond.png` (128x128 each)
  - Tier-specific achievement badge icons with glow effects

### Ship Theme Previews (10 previews, 400x225 each)
- **P2** One preview per morality-gated ship theme showing the particle + pattern effect

### Epoch Pass Banner
- **P1** `epoch_pass_season_1.png` (1200x400) — Season 1 "THE FALL" banner with Source artwork

---

## 7. GAME-SPECIFIC ART

### Dischordia (Card Game)
- **P1** `dischordia_board.png` (1920x1080) — 5x9 tactical grid background
- **P1** `dischordia_pack_opening.png` — Pack rip ceremony background

### Terminus Swarm (Tower Defense)
- **P1** `terminus_map_1.png` (1920x1080) — TD map background with Terminus in distance
- **P1** 8 turret sprites (64x64 each) — matching game definitions

### Fight Game
- **P1** `arena_background.png` (1920x1080) — Combat arena
- **P2** Fighter character sprites (placeholder silhouettes → full art)

### Chess
- **P1** `chess_board_holographic.png` — Holographic chess board on bridge

### Minigames
- **P2** `hacking_bg.png` — Engineering pipe network background
- **P2** `star_chart_bg.png` — Deep space star field
- **P2** `signal_decrypt_bg.png` — Comms Array static visualization

---

## 8. CONSTELLATION PATTERNS (Star Chart Minigame)

5 constellation diagrams for the Star Chart game reference:
- **P2** `constellation_architects_eye.png` — Diamond with center dot
- **P2** `constellation_iron_lions_shield.png` — Hexagonal shield
- **P2** `constellation_dreamers_spiral.png` — Fibonacci spiral
- **P2** `constellation_kaels_chain.png` — Chain link pattern
- **P2** `constellation_two_witnesses.png` — Two pillars with bridge

---

## TOTAL ASSET COUNT

| Category | P0 | P1 | P2 | Total |
|----------|----|----|----|----|
| Character Portraits | 7 | 3 | 0 | 10 |
| Expression Variants | 28 | 0 | 0 | 28 |
| Room Backgrounds | 1 | 6 | 1 | 8 (new, 12 exist) |
| Cutscene Videos | 4 | 7 | 9 | 20 |
| Branching Videos | 0 | 0 | 4 | 4 |
| Card Art | 0 | 18 | 0 | 18 |
| Ship Exterior | 1 | 1 | 1 | 3 |
| UI Elements | 0 | 10 | 10 | 20 |
| Game Art | 0 | 6 | 5 | 11 |
| Constellations | 0 | 0 | 5 | 5 |
| **TOTAL** | **41** | **51** | **35** | **127** |

---

## STYLE GUIDE

**Color Palette:**
- Elara: `#22d3ee` (cyan)
- The Human: `#f87171` (red)
- Agent Zero: `#ff6600` (orange)
- Locke: `#e040fb` (purple)
- The Source: `#ff1744` (deep red)
- The Antiquarian: `#00e676` (green)
- Shadow Tongue: `#6366f1` (indigo)
- Ship Hull: `#0a0a1a` (near black)
- UI Accent: `#33E2E6` (neon cyan)

**Art Direction:**
- Dark backgrounds, never pure white
- Volumetric lighting, god rays through spacecraft interiors
- Holographic elements: scanlines, slight transparency, edge glow
- Corruption: VHS tracking, glitch artifacts, text distortion
- Scale: make the player feel small in a vast, dangerous ship
- Emotion: every portrait should tell a story without words
