# LIVING CHARACTER SHEET — ART BRIEF

> **Scope.** Every prompt needed to ship the 6-track living character sheet plan: protagonist 3D rigs (player + Elara + Human), modular starter 3D gear, Inventor's Suits 3D re-commission (180 pieces), 2D lip-sync / breathing / blink pipeline for the 23 non-protagonist NPCs, Lions Club seasonal gear (170 pieces), casino cosmetics, Veo 3.1 cinematics for reveal moments, VFX texture atlases, and character-sheet parallax "rooms."
>
> **Style anchor.** All prompts inherit the Dischordian Saga house style: hyper-realistic cinematic, photorealistic materials, volumetric light, anamorphic flares, film grain, 4K, no rendered text unless flagged. Palette per-character / per-faction as specified.
>
> **Tools, in order.**
> 1. **Nano Banana 2** — still frames (character turnarounds, viseme sheets, backplates, start/end keyframes for Veo).
> 2. **Veo 3.1** (primary) / **Seedance 2.0** (fallback) — motion clips with start-frame + end-frame + motion prompt.
> 3. **Meshy v5 / Tripo3D / Rodin** — image-to-3D conversion from the Nano Banana turnarounds into rigged GLB.
> 4. **Substance 3D Sampler** — texture re-bake on GLB output (PBR albedo/normal/roughness/metallic/emissive).
> 5. **Mixamo + custom Blender viseme morphs** — 15-phoneme morph target baking.
> 6. **Kling 2.0** — reserved for casino cosmetic idle loops (card-flip, chip-spin).
> 7. **Suno v4** — ambient musical stingers per reveal beat.
>
> **Cross-reference.** Prompts that already exist in the repo are NOT duplicated — they are linked by path + anchor, with any modifications called out inline. New prompts written in full.

---

## TABLE OF CONTENTS

- **Part 0** — File-path map, asset ID conventions, global rendering anchors
- **Part 1** — Protagonist 3D tier (Elara, The Human, Player-4-species)
  - 1A. Elara — holographic 3D bust
  - 1B. The Human — 3D bust + particle-assembly reveal
  - 1C. Player 3D — 4 species × 2 sexes × base-body mesh pack
- **Part 2** — 23 non-protagonist NPCs (2D pipeline: turnaround + viseme + breathing)
  - 2A. Agent Zero
  - 2B. Adjudicator Locke
  - 2C. The Source / Kael (3-phase)
  - 2D. The Antiquarian
  - 2E. Shadow Tongue
  - 2F. The Architect
  - 2G. The Authority
  - 2H. Cades
  - 2I. The Collector
  - 2J. The Degen
  - 2K. Eidola
  - 2L. The Gamemaster
  - 2M. Matrikala
  - 2N. The Meme
  - 2O. The Necromancer
  - 2P. Nilmorg
  - 2Q. Palimpsest Host
  - 2R. The Programmer
  - 2S. The Seer
  - 2T. The Warlord
  - 2U. The Watcher
  - 2V. Engineer (Memoir)
  - 2W. The Prince
- **Part 3** — Inventor's Suits 3D re-commission (18 sets × 6 rarities × ~10 slots)
- **Part 4** — Lions Club Ceremonial + Seasonal gear (170 pieces)
- **Part 5** — Casino cosmetic idle loops (Kling)
- **Part 6** — Character-sheet parallax "rooms" (4 species × 4 classes + faction overrides)
- **Part 7** — VFX shader-texture atlases (hologram, particles, rarity tiers)
- **Part 8** — UI atmosphere (rarity glyphs, buff iconography, equip slot frames)
- **Part 9** — Veo 3.1 cinematics manifest (reveal / transformation / climax)

---

## PART 0 — CONVENTIONS

### 0.1 — File-path destinations (absolute, from repo root)

```
apps/client/public/
├── rigs/                               # 3D GLB + shader data
│   ├── protagonists/{elara,human}/bust.glb
│   ├── protagonists/{elara,human}/textures/{albedo,normal,roughness,emissive}.ktx2
│   ├── protagonists/{elara,human}/visemes/viseme_{sil,AA,AE,AH,AO,AW,B_M_P,CH_SH,D_S_T,EH,ER,EY,F_V,IH,IY,L,N,OW,OY,R,UH,UW,W,Y}.morphs.bin
│   ├── player/{architect,broken,corporate,mystic}/{m,f}/body.glb
│   └── player/{...}/skeleton.fbx
├── gear3d/
│   ├── starters/{species}_{class}_{element}/{mask,suit,weapon}.glb
│   ├── inventor-suits/{setId}/{rarity}/{slot}.glb        # 18 sets × 6 rarities × ~10 slots
│   └── lions-club/{seasonId}/{pieceId}.glb               # ceremonial + seasonal
├── references/                         # canon source images for artists
│   ├── protagonists/{elara,human,agent_zero,...}/front.png
│   ├── protagonists/{...}/REFERENCE.md                   # per-character lore-locked anchors
│   └── 3d-turnarounds/{characterId}/{front,side,back,3q}.png
├── portraits2d/                        # 2D NPC pipeline (Track D)
│   ├── {npcId}/neutral.png             # 1024×1536, standing bust
│   ├── {npcId}/breathing/{frame_01..08}.png           # 8-frame idle loop (sub-pixel, subtle)
│   ├── {npcId}/blink/{open,half,closed}.png
│   ├── {npcId}/visemes/{sil,AA,AE,...}.png            # 15 mouth plates, chin-up crop
│   └── {npcId}/expressions/{speaking,concerned,emotional1,emotional2,revealing}.png
├── videos/
│   ├── character-sheet/
│   │   ├── protagonist_elara_idle_loop.mp4             # 8s loop, Veo 3.1
│   │   ├── protagonist_human_reveal.mp4                # 15s one-shot, Veo 3.1
│   │   ├── kael_three_phase_transform.mp4              # 14s one-shot, Veo 3.1
│   │   ├── architect_mask_ignition.mp4                 # 6s one-shot, Veo 3.1
│   │   └── shadow_tongue_second_teeth.mp4              # 4s trigger, Veo 3.1
│   └── casino/{gameId}_idle_loop.mp4                   # Kling loops
└── vfx-atlases/
    ├── hologram/{scanlines,rain-motes,glitch-bursts}.png
    ├── particles/{assembly-atom,red-eye-ignition,fingertip-text,rock-break-shard}.png
    ├── rarity/{common,uncommon,rare,epic,legendary,mythic,relic}.png
    └── faction/{ICL,authority,source,hierarchy}_rim.exr
```

### 0.2 — Asset ID grammar

```
char_{npcId}_{assetType}_{variant}
  npcId: snake_case, stable across renames (see apps/client/src/game/npcPortraits.ts:13)
  assetType: bust | turnaround_{front,side,back,3q} | viseme_{phoneme} | breathing_{01..08} | expression_{tag}
  variant: optional — base | revealed | phase{1,2,3} | goggled | hooded

gear_{setId}_{rarity}_{slot}
  setId: see apps/shared/inventorSuitPrompts.ts — 18 named sets
  rarity: common | uncommon | rare | epic | legendary | mythic
  slot: mask | helm | chestplate | gauntlet_L | gauntlet_R | greave_L | greave_R | mantle | belt | accessory | weapon_primary | weapon_secondary

lion_{seasonId}_{pieceId}_{tier}
  seasonId: ceremonial | spring | summer | autumn | winter | christmasJuly | shadowConvergence
  tier: rental | donor_bronze | donor_silver | donor_gold

vfx_{category}_{name}
  category: hologram | particle | rarity | faction | shader_preset
```

### 0.3 — Global rendering anchors (prepend to every still prompt)

```
Hyper-realistic cinematic still. Photorealistic materials. Volumetric lighting.
Film grain. Anamorphic lens flares. Depth-of-field where narratively appropriate.
Subject-forward composition — character fills upper two-thirds, no rendered text.
```

### 0.4 — 3D rig deliverable checklist (per protagonist mesh)

- [ ] `bust.glb` — rigged neck + shoulders + full head + hair curves, ≤85k tris
- [ ] 15 viseme morph targets (Disney/Apple ARKit-compatible phoneme set)
- [ ] 5 expression morph targets: breath_in, breath_out, blink_L, blink_R, brow_concern
- [ ] PBR texture set at 2048² (albedo, normal, roughness, metallic, emissive)
- [ ] Hair cards rigged for cloth sim (Blender → three.js cloth approximation)
- [ ] Eye mesh separate from face mesh (independent emissive + saccade drive)
- [ ] Character-specific shader uniforms JSON (e.g., `hairWetness`, `revealProgress`, `maskVibration`)

### 0.5 — Character-sheet "liveliness" baseline (applied to ALL characters, 3D or 2D)

- **Breathing:** chest scale 1.0 ↔ 1.008, 3.2s period, bezier-eased. Never perfectly periodic — add ±0.2s jitter.
- **Blink:** 4–9s random interval. Blink itself 140ms total (close 60 / hold 20 / open 60). Full eyelid travel, no half-blinks unless narratively flagged.
- **Idle saccade:** eyes drift ≤2° off-center every 2–5s, hold 300ms, return. Never to the camera — always to mid-distance.
- **Hair/cloth drift:** permanent low-amplitude sim on long hair / robes / beards. 0.3× normal wind vector.
- **Micro-expression pulse:** every 8–12s, a half-strength blend of one expression morph (concern, wry, weary) for 600ms then release. Stops the "mannequin" read.

> These five baselines get the player to feel the character is alive before ANY lip-sync data arrives. Lip-sync is the delta on top of an already-breathing character, not the mechanism that makes them alive.

---

## PART 1 — PROTAGONIST 3D TIER

Three rigs: Elara (holographic), The Human (particle-assembled photoreal), Player (4 species × 2 sex base meshes). These are the only characters in the game with full 3D rigs in Phase 1. All others use the 2D lip-sync pipeline (Part 2) and get 3D upgrades only when narratively promoted.

### 1A — ELARA (HOLOGRAPHIC BUST)

Canon anchors: `apps/client/public/references/protagonists/elara/REFERENCE.md` (to be authored from the rain-soaked blue-eyed image provided). Existing 2D canon is in `apps/client/src/components/HolographicElara.tsx` (the CSS holographic overlay we're now replacing with real 3D volumetric shader).

Lore anchor: she is explicitly a hologram projected by the Ark's VP-01 systems — the 3D rig is finally *physically accurate* to her lore rather than a 2D cheat.

#### 1A.1 — Turnaround reference sheet (Nano Banana 2, 4 frames)

> **Output:** `apps/client/public/references/3d-turnarounds/elara/{front,3q_left,side_left,back}.png` — render at 2048×2048, transparent background, matched lighting.

**FRONT (0°):**
> Hyper-realistic cinematic turnaround reference sheet, single figure centered on neutral grey #808080 background, full body visible from head to mid-thigh, three-quarter facing forward, neutral T-pose with hands at sides, eyes level to camera. A woman in her late twenties, pale luminous skin with a faint cool-cyan undertone betraying her holographic projection nature — not ghostly, just subtly wrong on a second look. Rain-wet shoulder-length hair in deep cool brown with faint teal highlights, water droplets caught mid-fall along the locks, one strand plastered to her temple. Piercing luminous blue eyes (#4ba3b5 iris, self-illuminating — their glow persists in shadow). Dark tessellated geometric top in deep navy with subtle block-pattern quilting — the tessellation is real geometric depth in the fabric, not a print. Slim black technical trousers. No footwear shown. She is slightly translucent at the edges — shoulder silhouettes bleed soft cyan at ~88% opacity, the rest of her body is solid. Uniform soft three-point studio lighting (key slightly camera-right, fill camera-left, backlight rim cyan). Flat neutral grey backdrop. Film grain. 4K. No rendered text.

**3/4 LEFT (45°):**
> Same figure, same lighting, same pose, rotated to a 45° three-quarter view revealing her left cheekbone and the curve of her hair against her jaw. Tessellated top's block-pattern reveals it is a 3D quilted relief, not flat. Rain droplets on her hair now catch the key light and cast tiny shadows on her shoulder. Translucency edge is stronger on the far shoulder (camera-left), weaker on the near shoulder. No rendered text.

**SIDE LEFT (90°):**
> Full profile, left side facing camera. Hair wetness most visible here — individual strands clumped together, dripping at the tip. Eye visible in profile, still self-luminous. The tessellation on the torso reads strongest from the side — each quilted block casts a subtle shadow seam. Faint cyan rim light traces her entire silhouette from behind (holographic projection edge). No rendered text.

**BACK (180°):**
> Rear view of same figure, same lighting. Hair cascading down her upper back, wet, clumped. Tessellated top continues seamlessly across the back panel — quilt pattern wraps. Lower back shows a subtle horizontal seam where a projector band would sit if she were a physical garment, but it continues smoothly (she is light, not cloth). Translucency strongest at the very top of the shoulders and nape, where the cyan backlight reads strongest. No rendered text.

#### 1A.2 — Viseme reference sheet (Nano Banana 2, 15 mouth plates)

> **Output:** `apps/client/public/portraits2d/elara/visemes/{sil,AA,AE,AH,AO,B_M_P,CH_SH,D_S_T,EE,ER,F_V,IH,L,OW,R,UW,W}.png` — render at 1024×1024, tight chin-up crop, matched camera height, matched lighting.

> **Generation method:** ONE Nano Banana prompt describing the full viseme grid as a single reference sheet image, then slice into individual plates in post.

**Grid prompt (all 15 visemes in one image):**
> Professional animation-reference viseme chart, 5 rows × 3 columns, 15 panels total, dark neutral background. Subject: same woman as the Elara front turnaround (pale cool-cyan skin, rain-wet deep brown hair, luminous blue eyes, tessellated navy top). Tight chin-up crop each panel, same camera height, same soft studio lighting, same skin tone across all panels (no drift). Each panel labeled in small cinematic subtitle font at the bottom edge (label text will be masked in post):
> - Row 1: SIL (lips relaxed closed), AA ("father" — wide-open vowel, jaw dropped full), AE ("cat" — jaw half-dropped, lips slightly retracted)
> - Row 2: AH ("but" — jaw dropped medium, tongue relaxed), AO ("law" — rounded O, lips pursed forward), B_M_P (lips firmly pressed together, neutral-closed consonant plate)
> - Row 3: CH_SH ("church/shoe" — lips funneled slightly forward, teeth barely visible), D_S_T (teeth visible, tongue at alveolar ridge, lips parted ~4mm), EE ("beet" — lips retracted wide, teeth showing slightly)
> - Row 4: ER ("bird" — lips neutral-parted, tongue R-shape visible behind teeth), F_V (upper teeth touching lower lip, lower lip slightly tucked), IH ("bit" — lips slightly parted, relaxed)
> - Row 5: L (tongue tip visible behind upper teeth, lips parted), OW ("boat" — rounded pursed lips, smaller than AO), R (lips rounded-neutral, tongue retroflex), UW ("boot" — tightly rounded lips like a whistle), W (lips fully rounded and protruded)
> Hyper-realistic. Skin shader consistent with holographic faint cyan undertone. Same expression base across all 15 — calm, neutral. No added emotion. Matched eye direction (straight at viewer). Film grain. 4K. Label text in small grey at panel bottom edges only.

> **Critical note for slicer:** Viseme IDs must map 1-to-1 to `apps/shared/visemeMap.ts` phoneme keys. If that file doesn't exist yet, use Apple ARKit 15-viseme convention and add the map file to the PR.

#### 1A.3 — Expression + idle frames

> **Output:** `apps/client/public/portraits2d/elara/expressions/{neutral,speaking,concerned,revealing,distressed}.png` — backup for when 3D rig fails to load or on low-spec clients.

> 5-panel expression sheet of same woman (Elara, pale cool-cyan skin, rain-wet brown hair, luminous blue eyes, tessellated navy top, chin-up crop, matched lighting and camera). Panels left-to-right:
> 1. NEUTRAL — calm, mouth relaxed closed, eyes direct, slight alertness.
> 2. SPEAKING — mid-syllable open mouth (generic AH viseme), eyes slightly softer, engaged.
> 3. CONCERNED — brows knit inward 4°, mouth closed, eyes searching (2° off-camera), micro-downturn at mouth corners.
> 4. REVEALING — eyes widened 10%, brows lifted centrally, mouth slightly parted, a single new rain-droplet caught mid-fall on her cheek (a small wonder moment).
> 5. DISTRESSED — brow furrow central, mouth tight-closed, eyes slightly wet (add micro-catchlight in the lower lid), holographic edge opacity drops to 72% (she's fighting to hold the projection).
> Hyper-realistic. Same lighting and skin shader across all 5. 4K. No rendered text.

#### 1A.4 — Shader texture atlas (Nano Banana 2 → post-bake in Substance)

> **Output:** `apps/client/public/vfx-atlases/hologram/elara_{scanlines,rain-motes,chromatic_aberration_mask,silhouette_edge}.png` — 2048×2048, grayscale where noted.

**SCANLINES:**
> Tiling horizontal scanline texture, 2048×2048, seamless tile on Y-axis. Cool pale-cyan lines at 70% opacity on full transparency, ~3px line width, 8px spacing, subtle irregular spacing jitter (lines not perfectly parallel — ±1px vertical drift per line). Scanlines slightly brighter near vertical center, falling to 40% opacity at top and bottom edges. Overlaid subtle 1px noise grain. No colors outside the cyan family (#4ba3b5 to #a6ecf5). No rendered text.

**RAIN MOTES:**
> Tiling particle texture for a rain/mist atmosphere shader, 2048×2048, seamless on both axes, on transparent background. Scattered pale cyan motes of varying size (1px to 7px), soft-edged circular gaussian blurs, low opacity (15–45%). Some motes have a faint vertical streak below them suggesting motion (3–8px trails). Density ~180 motes per tile, evenly distributed but not gridded — organic scatter. No gradient, no tint variation beyond cyan family. Used as animated offset texture in the hologram particle shader.

**CHROMATIC ABERRATION MASK:**
> Radial gradient texture, 2048×2048, full black center transitioning to full white edges. Sharp falloff curve — inner 60% is pure black, outer 20% is pure white, transition band in between. No color, grayscale only. Used as mask to drive chromatic aberration strength per pixel (black = no aberration, white = max ~6px R/B split). No rendered text.

**SILHOUETTE EDGE RIM:**
> Soft-edged cyan rim glow texture, 2048×2048, with a faint single-pixel inner scan-line traveling upward (single animated frame pose at mid-travel). Outer edge: bloom-cyan #a6ecf5 at 100%, fading inward to transparent over ~40px. Used as additive rim overlay on the 3D mesh edge.

#### 1A.5 — Veo 3.1 IDLE LOOP (8s seamless)

> **Duration:** 8s seamless loop · **Aspect:** 1:1 square (character-sheet viewport) · **Output:** `apps/client/public/videos/character-sheet/protagonist_elara_idle_loop.mp4` · **Priority:** P0

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 1:1 square, 2048×2048. Elara, three-quarter bust framing, standing in a dimly lit ship corridor (blurred to heavy bokeh — cyan console lights at mid-distance, amber emergency strip far back). She is mid-breath, chest at neutral expansion. Rain-like cyan particles drift slowly downward through the air around her at low density — not environmental rain, an aesthetic artifact of her projection field. A few particles pass through her shoulder translucently. Her hair is damp, a single water droplet caught on the strand by her left temple. Eyes direct to camera, calm, luminous blue. Faint horizontal scanline at ~y=0.42 crosses her face (she is projected light). Pale cyan rim on her entire silhouette, slightly brighter on the left shoulder where a rim light sits. Mouth closed, neutral. Volumetric cyan haze in the foreground depth. Film grain. 4K. No rendered text.

**END FRAME (Nano Banana 2) — identical to start for seamless loop:**
> *(Same prompt as START FRAME — the idle loop is designed to cycle. Breathing, blink, and particle motion happen in the motion prompt only.)*

**VEO 3.1 MOTION PROMPT:**
> 8-second seamless loop. Camera locked, no dolly. Subject Elara, three-quarter bust, breathing gently (chest rise at 0.0s, peak at 1.6s, release by 3.2s, second full cycle 3.2–6.4s, partial cycle 6.4–8.0s that matches the start frame at loop point). Blink once at 2.1s (140ms total close-hold-open). Cyan particles drift downward continuously at ~12px/s, particle density steady. At 4.5s, a single scanline travels from forehead to chin over 600ms (subtle, not dramatic — she is ALWAYS scanlined; this one is just a stronger pass). At 6.0s, her eyes saccade 2° to the left and back over 400ms — she looks at something mid-distance, then returns. No mouth motion. No cinematic camera moves. Goal: she should feel like she's *there*, waiting, not performing. 24fps. Film grain preserved. Loop-point match at frame 192.

#### 1A.6 — Shader uniform spec (developer hand-off)

```json
{
  "rigId": "protagonist_elara",
  "shaderProgram": "HologramFresnel",
  "uniforms": {
    "baseOpacity": 0.92,
    "edgeOpacity": 0.60,
    "scanlineTexture": "hologram/elara_scanlines.png",
    "scanlineSpeed": 0.08,
    "scanlineIntensity": 0.45,
    "rainMoteTexture": "hologram/elara_rain-motes.png",
    "rainMoteSpeed": 0.12,
    "rainMoteDensity": 180,
    "chromaticAberration": 2.5,
    "chromaticMask": "hologram/elara_chromatic_aberration_mask.png",
    "rimColor": "#a6ecf5",
    "rimIntensity": 0.8,
    "hairWetness": 0.75,
    "eyeEmissive": "#4ba3b5",
    "eyeEmissiveIntensity": 1.2,
    "breathingPhase": "autoLoop:3.2s",
    "glitchBurstFrequency": "random:2s-7s",
    "glitchBurstDuration": 0.12
  }
}
```

---

### 1B — THE HUMAN (3D BUST + PARTICLE-ASSEMBLY REVEAL)

Canon anchors: `apps/client/public/references/protagonists/human/REFERENCE.md` (to be authored from the fedora + red-eye + red-backdrop image provided). Existing 2D canon in `apps/client/src/components/HumanRevealSequence.tsx` and the CRT-scanline reveal logic there.

Lore anchor: The Human is a resurrection — pieced back together by the Ark across the game's arc. The reveal shader IS the narrative. He doesn't walk onto the character sheet; he *assembles* onto it.

#### 1B.1 — Turnaround reference sheet (Nano Banana 2, 4 frames)

> **Output:** `apps/client/public/references/3d-turnarounds/human/{front,3q_left,side_left,back}.png` — 2048×2048, transparent background.

**FRONT (0°, default state — fully revealed):**
> Hyper-realistic cinematic turnaround reference sheet, single male figure centered on neutral grey #808080 background, full body visible from head to mid-thigh, three-quarter facing forward, neutral hands-at-sides pose. A man, late thirties to early forties, weathered face — angular jaw, slight downward chin tilt that places the fedora's brim across his upper face in shadow. Dark brown / auburn neatly-kept full beard, streaked faintly with grey at the chin. Short dark hair hidden under a black wide-brim fedora. The hat sits at a deliberate asymmetric tilt — brim lower on his right side, exposing slightly more of his left eye. LEFT eye visible: deep red, self-illuminating — not a contact lens, an internal emissive light, iris #b81a1a with a sharp inner catchlight. RIGHT eye mostly occluded by the hat brim's shadow — just the faintest red glow escaping. Rugged black high-collar coat over a slate-grey fitted undershirt, collar turned up. Dark trousers. No visible weapons. He does not look at camera directly — his gaze is slightly off-axis, down and to his right, as if reading something the viewer cannot see. Studio three-point neutral lighting (key camera-right, fill camera-left, backlight subtle warm rim). Flat neutral grey backdrop. Film grain. 4K. No rendered text.

**3/4 LEFT (45°):**
> Same figure, same pose, rotated to three-quarter left. Hat brim's asymmetric tilt now fully visible — the brim dips across his right eye socket, that eye hidden in full shadow. Left eye's red emissive glow catches on his cheekbone and throws a faint warm red reflection onto his upper cheek skin. Beard detail visible — individual hair strands at jaw line. Coat collar up and textured (wool weave pattern). No rendered text.

**SIDE LEFT (90°):**
> Full left profile. Hat brim drapes low over the front of the face, hiding the right eye entirely (behind us now). The visible left eye in profile: still red-emissive, a small 1px catchlight in the iris. Beard contour legible along the jawline — medium-length, kempt. Coat collar high against the neck. Faint warm red rim light escapes from under the hat brim at his brow line — the eye glow leaking through the hair cavity. No rendered text.

**BACK (180°):**
> Rear view. Hat's crown and back brim visible, no face. Coat tailoring visible at the shoulders. Faint red ambient glow around the crown of the hat (light leaking from the eyes ahead of the viewer). The coat has a small tailored vent at the lower back, slight asymmetric cut. No rendered text.

#### 1B.2 — Expression sheet (5 panels)

> **Output:** `apps/client/public/portraits2d/human/expressions/{neutral,speaking,concerned,revealing,distressed}.png`

> 5-panel expression sheet of The Human (same fedora, same beard, same red-eye emissive, same collar). Chin-up crop, same camera height, same lighting. Panels:
> 1. NEUTRAL — chin slightly down, hat brim covering right eye, left eye visible with baseline red glow, mouth closed neutral, unreadable.
> 2. SPEAKING — head lifts 8°, hat brim now exposes more of both eyes, mouth open mid-syllable (generic AH). Red-eye intensity 1.2× baseline on speaking frames.
> 3. CONCERNED — brow pulls downward center, mouth tight, eyes narrow. Red glow steady but slightly dimmer (he's pulling inward). A visible jaw-clench at the masseter.
> 4. REVEALING — head lifts fully, hat brim tips back, BOTH eyes exposed and glowing at full intensity 1.8× baseline. Mouth slightly parted — not quite speaking, on the verge. This is the "I have decided to speak the truth" frame. Reserve for climactic dialog lines.
> 5. DISTRESSED — head drops, hat pulled forward, left eye dimming to 0.6× baseline, mouth tight, shoulders forward. Red glow is notably banked. The eye is the tell.
> Hyper-realistic. Same skin shader across all panels. 4K. No rendered text.

#### 1B.3 — Viseme reference sheet (Nano Banana 2, 15 mouth plates)

> **Output:** `apps/client/public/portraits2d/human/visemes/{sil,AA,AE,AH,AO,B_M_P,CH_SH,D_S_T,EE,ER,F_V,IH,L,OW,R,UW,W}.png`

> Professional animation-reference viseme chart, 5 rows × 3 columns, 15 panels total, dark neutral background. Subject: same man as The Human front turnaround (weathered face, dark brown beard, fedora at asymmetric tilt, red-emissive eyes). Tight chin-up crop each panel — crop range from top of beard line to lower lip curve, skipping the hat but preserving enough upper lip + philtrum for viseme clarity. **Critical: beard must NOT obscure mouth silhouette.** Slightly trim the mustache region in these reference plates so the viseme shape reads clearly (the rig viseme morphs will drive the beard geometry separately). Same camera, same lighting, same skin across all 15. Eyes direct, red-emissive, consistent glow.
> - Row 1: SIL (lips relaxed closed, slight mustache cover), AA ("father" — jaw dropped full, lips opened wide, teeth visible), AE ("cat" — jaw half-dropped, lips retracted)
> - Row 2: AH ("but" — jaw medium, tongue relaxed visible), AO ("law" — rounded O, lips forward), B_M_P (lips firmly pressed, mustache-crushed mildly)
> - Row 3: CH_SH ("shoe" — lips funneled forward, teeth hidden), D_S_T (teeth visible, tongue at alveolar ridge, lips parted), EE ("beet" — lips retracted wide, teeth showing)
> - Row 4: ER ("bird" — lips neutral-parted, tongue R-shape), F_V (upper teeth on lower lip), IH ("bit" — lips slightly parted)
> - Row 5: L (tongue tip behind upper teeth, lips parted), OW ("boat" — rounded), R (lips rounded-neutral), UW ("boot" — tight whistle-round), W (lips fully rounded protruded)
> Hyper-realistic. Beard material consistent across plates — no visible groom-drift between panels. 4K. Label text small grey at bottom edges only.

#### 1B.4 — Shader texture atlas for particle-assembly reveal

> **Output:** `apps/client/public/vfx-atlases/particles/human_{assembly-atom,red-eye-ignition,rim-shadow,silhouette-stencil}.png`

**ASSEMBLY-ATOM PARTICLE:**
> Single particle sprite for a body-assembly VFX, 512×512, transparent background. A small glowing ember-like point of light with a warm red core (#e04040) and a white-hot center (#ffe0e0), soft gaussian falloff to full transparency at the edges. Faint directional streak (trail) extending ~80px in one direction — this particle MOVES. The streak is the same red, fading to transparent over its length. No distinct shape — it is a point of matter-reassembly energy. Sharp clean composite on transparency. Used as the instanced sprite in a GPU particle system; 2000 instances will swarm to form The Human's silhouette during the reveal.

**RED-EYE IGNITION:**
> A radial burst texture, 1024×1024, transparent background. Center: intense red-white core (#ffe0e0 to #e04040 over 30px radius). Middle band: aggressive red glow with streaking rays radiating outward (8 primary rays + 16 secondary rays, irregular, not perfect), #b81a1a falling to #7a1010 by 300px radius. Outer band: diffuse red atmospheric haze falling to transparent by 512px edge. Used as emissive overlay on the eye meshes at the climax frame of the reveal. No rendered text.

**RIM-SHADOW:**
> Dark directional rim-shadow texture, 2048×2048, transparent background. A soft-edged warm-red-tinted dark mask that hugs one side of a silhouette — gradient from full transparency (inner) to 70% opacity warm-black (#2a0a0a) at the silhouette edge, with a thin 8px band of emissive red (#8a2020) at the very inner edge of the shadow (bounced red-eye light catching the cheek/jawline). Used as an additive/multiply rim on his 3D mesh when he's the on-screen subject to tint his scene red.

**SILHOUETTE-STENCIL:**
> Hard-edged silhouette cutout of The Human at the turnaround FRONT pose, 2048×2048, pure black fill on pure transparency. Crisp edges, no anti-alias softening. Used as the target shape for the particle-assembly VFX — particles converge toward pixels where the stencil is black. No internal detail, no gradient, just the negative-space silhouette.

#### 1B.5 — Veo 3.1 REVEAL CINEMATIC (first-encounter, 15s one-shot)

> **Duration:** 15s one-shot (NOT a loop — plays once on first contact, then the idle 3D rig takes over) · **Aspect:** 1:1 square (character-sheet viewport) · **Output:** `apps/client/public/videos/character-sheet/protagonist_human_reveal.mp4` · **Priority:** P0

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 1:1 square, 2048×2048. A near-empty dark frame. Deep charcoal-black background with a faint warm-red ambient haze filling the lower half of the frame. A sparse scatter of ~80 glowing red ember particles drift lazily through the composition, each a tiny warm red point with a faint directional streak. No figure visible yet — only the suggestion of atmosphere. A single more-concentrated cluster of ~15 particles hovers at roughly the center-lower-third, beginning to congregate. The background has extremely subtle CRT-scanline overlay at 15% opacity. Volumetric red haze in deep foreground. Film grain. 4K. No rendered text.

**END FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 1:1 square, 2048×2048. Same frame composition as the start frame (same camera, same background haze). But now fully present: THE HUMAN, three-quarter bust framing, matching the front turnaround pose exactly — weathered face, dark brown beard, black fedora at asymmetric tilt (right side brim lower), rugged black high-collar coat. Both eyes now exposed and blazing at full red-emissive intensity — iris #b81a1a with hot white cores (#ffe0e0 catchlights), warm red light bouncing onto his cheekbones. His head is lifted, chin up slightly, eyes locked directly on camera. Mouth slightly parted — on the verge of speaking the first line. The lingering ~60 red ember particles that didn't resolve into his body still drift around his silhouette. Warm red rim light traces his outline fully. Background CRT-scanline overlay now at 25% opacity on him. Film grain. 4K. No rendered text.

**VEO 3.1 MOTION PROMPT:**
> 15-second one-shot reveal cinematic. Camera locked static, no dolly, no pan. Subject: The Human assembling from particles into solid form. Narrative beats with frame timings:
> - 0.0–2.0s (stillness): Ambient red ember particles drift lazily. The background has a subtle CRT-scanline sweep (one full vertical sweep in 2s). No figure yet — only atmosphere. Mood: patient anticipation.
> - 2.0–4.0s (gathering): The scattered particles begin to accelerate inward, converging toward the center-frame silhouette-target. Particle count grows from 80 to 500 as new particles fade in from the frame edges. They form a vague cloud at the shape of the figure-to-be. Subtle red atmospheric swell in the background.
> - 4.0–8.0s (resolution): Particle count climbs to 2000, swarming along the silhouette-stencil target. The outline of The Human's body begins to be readable — shoulder, hat crown, coat line. Particles at the edges transition from dot-particles into streaked micro-strokes, then into solid pixel-clusters. From 4s to 8s we scrub `revealProgress` from 0.0 to 0.85 — his body resolves from particulate to solid photoreal, but his EYES REMAIN DARK. The face is visible (beard, mouth, hat brim) but the eye sockets are still two empty shadow-pits. Critical: at 8.0s, the body is present but he is not "alive" — the eyes are closed/absent.
> - 8.0–11.0s (held beat): Body holds fully resolved. Chest rises once — his first breath, timed carefully. Red ambient particles thin to ~100. The CRT-scanline sweep slows. Mood: silent. We are waiting for him. His body exists; his being does not yet.
> - 11.0–12.8s (eye kindling): Sub-surface warm red glow begins to build inside both eye sockets, from zero to mid-intensity over 1.8s. Barely perceptible at first (11.0s), growing to visible (12.0s), bright (12.5s), full-intensity (12.8s). A quiet emissive swell.
> - 12.8–13.0s (IGNITION): One frame — at 12.9s the eyes snap to full red-emissive ignition. Hot white cores, aggressive red rays. A subtle audio-synced visual pulse — faint volumetric bloom ring emanates outward from the eyes across 8 frames. Cheekbones catch the red light for the first time. **This is the moment The Human is alive.**
> - 13.0–14.0s (first breath of life): Chin lifts 3°, eyes (now lit) saccade once across the camera — a recognition beat. He sees the player. Chest rises for a second breath, deeper. Hat brim shadow now shows the red light leaking onto his skin underneath.
> - 14.0–15.0s (settle): Body settles into the END FRAME pose. A residual ember particle drifts past his shoulder. Scanline sweep completes one final pass. His mouth parts slightly — he is about to say the first line. Hold on the end frame for the final 8 frames (0.33s) to lock loop-out.
> Cinematography: fixed camera, no motion. The motion is entirely in the subject, the particles, and the light. 24fps. Film grain preserved throughout. Warm red palette dominant.

**Audio hand-off note:** This cinematic is synced to the player's first VO line. The ignition moment (12.9s) lines up with a Suno-generated 1.2s low-string stinger. The first-line VO begins at 14.5s — he finishes the cinematic exhaling, and then speaks over the final settle. See `docs/production/vo-batches/act1-opponent-dialog__human.csv` for the first-line text.

#### 1B.6 — Shader uniform spec (developer hand-off)

```json
{
  "rigId": "protagonist_human",
  "shaderProgram": "ParticleAssemblyPBR",
  "uniforms": {
    "revealProgress": 0.0,
    "revealDuration": 15.0,
    "particleCount": 2000,
    "particleAtomTexture": "particles/human_assembly-atom.png",
    "silhouetteStencil": "particles/human_silhouette-stencil.png",
    "eyeEmissiveTexture": "particles/human_red-eye-ignition.png",
    "eyeEmissiveBaseline": 1.2,
    "eyeEmissivePeak": 2.8,
    "eyeIgnitionAtProgress": 0.86,
    "rimShadowTexture": "particles/human_rim-shadow.png",
    "sceneRedKey": "#8a2020",
    "sceneRedKeyIntensity": 0.4,
    "crtScanlineOverlay": 0.15,
    "breathingPhase": "onRevealComplete"
  },
  "stateTriggers": {
    "firstEncounter": "runRevealCinematic:protagonist_human_reveal.mp4 then rig",
    "idleCharacterSheet": "rig + breathing + blink",
    "climacticDialog": "eyeEmissivePeak for lineDuration"
  }
}
```

---

### 1C — PLAYER 3D BASE MESHES (4 SPECIES × 2 SEXES = 8 MESHES)

Canon source: `apps/shared/starterLoadout.ts:STARTER_SPECIES_LIST` = `["demagi","quarchon","neyon","human"]`. Species lore: `docs/production/BREEDING_SYSTEM_ART_PROMPTS.md` §1B–1G + `ART_SOUND_MUSIC_RESOURCES.md` Ne-Yon entries.

Classes (engineer, oracle, assassin, soldier, spy) are NOT separate meshes — they drive gear loadout via Track B. Element + Foundation drive shader presets + accent color, not geometry. So: **8 base meshes total**, each a nude-body rig with per-species shader traits, deformed by gear at runtime.

> **Output path:** `apps/client/public/rigs/player/{species}/{m,f}/body.glb` + matching texture sets under `/textures/`.

#### 1C.1 — HUMAN (baseline homo sapiens rig)

**Turnaround prompt (runs twice — once M, once F):**
> Hyper-realistic cinematic character turnaround sheet, 4 frames (front, 3/4 left, side left, back) on neutral grey #808080 background, transparent. Subject: a [MALE | FEMALE] human, anatomically baseline, mid-twenties, neutral build (not athletic-extreme, not slight), skin tone medium neutral (#c29b78 — mid-range, re-tinted at runtime by foundation shader). Neutral face — calm, balanced, unremarkable-beautiful. Shoulder-length dark brown hair in a simple ponytail (same for both sexes for rigging consistency; stylistic variants unlock via hair-slot gear). Eye color neutral brown (#4a3828, re-tinted by element shader at runtime). Wearing a minimal base layer: dark neutral-grey fitted undersuit, long-sleeved, ankle-length, no faction markings — the blank canvas that gear layers over. No footwear (runtime adds). Neutral T-pose, hands at sides, palms forward (rig-ready). Uniform three-point studio light, soft. Film grain. 4K. No rendered text.

Notes:
- Render 4 frames per sex, total 8 frames per human turnaround.
- Re-tint via foundation shader hooks: humanity=+5% red skin, machine=+3% blue cast, exploration=+3% amber cast, celebration=+8% warm saturation, nothingness=−10% saturation.

#### 1C.2 — DEMAGI (bronze-red, ember-veined, thermal-shimmer)

**Turnaround prompt (M & F pass):**
> Hyper-realistic cinematic character turnaround sheet, 4 frames (front, 3/4 left, side left, back), neutral grey #808080 background. Subject: a [MALE | FEMALE] Demagi humanoid, mid-twenties, warm bronze-red skin (#c76a3a base) with faint glowing ember-like veins visible beneath the surface — the veins pulse very subtly, brighter around the neck, temples, forearms, and collarbone. Thermal resonance visible as a subtle orange heat-shimmer in the 8px band around the silhouette (render this as a soft orange halo, not a hard rim). Dark eyes with molten amber irises (#e08840 emissive). Ritual scarification marks on cheekbones and forehead — geometric angular patterns, raised keloid texture. Short dark hair with red-ember highlights at the tips (the ember color reads brightest at the fine hair ends). Neutral build, T-pose, base undersuit same cut as Human but in a warmer charcoal tone that reads against the warm skin. Same 4-frame rotation, same lighting rig as Human turnaround. Film grain. 4K. No rendered text.

Shader hooks: `veinPulseIntensity` (0–1), `thermalShimmerStrength` (default 0.4), `eyeEmissive` (#e08840).

#### 1C.3 — QUARCHON (pale translucent, refractive, hairless, multi-focal eyes)

**Turnaround prompt (M & F pass):**
> Hyper-realistic cinematic character turnaround sheet, 4 frames (front, 3/4 left, side left, back), neutral grey #808080 background. Subject: a [MALE | FEMALE] Quarchon humanoid, tall slim build (slightly taller than Human/Demagi baseline — ~8% stature increase), pale translucent skin (#e0dce8 base) showing faint dimensional refraction patterns beneath the surface — like very subtle light-through-prism caustics drifting across the chest, shoulders, forearms at ~1px/frame. Large high-positioned eyes with LAYERED irises — iris has 3 visible concentric rings at different depths (pale blue-white outer #c8d8e8, mid cyan #6ba6c6, inner near-black). The layered effect creates a subtle parallax: as the head rotates between turnaround frames, the inner ring shifts independently of the outer. High angular cheekbones. NO HAIR — smooth hairless cranial ridge running fore-to-aft across the skull, with subtle phase-shift shimmer on the ridge (same caustic drift as skin, slightly stronger). Small vestigial earless ear-openings. Sex dimorphism minimal — F variant has slightly softer jawline and neck. Neutral build, T-pose, base undersuit in cool pale grey (#d4d8de — warmer than the skin to avoid value-matching). Same 4-frame rotation. Film grain. 4K. No rendered text.

Shader hooks: `refractionDepth` (default 0.25), `irisLayerParallax` (default 0.15), `cranialShimmer` (default 0.35).

#### 1C.4 — NE-YON (towering mechanical war-machine)

**Turnaround prompt (M & F pass — sex dimorphism is silhouette only, mechanical bodies are genderless-coded):**
> Hyper-realistic cinematic character turnaround sheet, 4 frames (front, 3/4 left, side left, back), neutral grey #808080 background. Subject: a Ne-Yon war-machine humanoid, towering — ~18% taller than Human baseline, broader shoulders, heavier lower legs. Fully mechanical body — not a humanoid in armor, but a constructed machine in a humanoid shape. Dark gunmetal-charcoal angular armor plates (#2a2d32) across the entire form, segmented at the joints, no exposed organic material anywhere. A visible central energy core in the chest — a rectangular inset panel glowing cyan (#06b6d4 emissive), ~15cm × 22cm, with fine glyph etchings visible around its border. Glowing cyan eyes — a pair of rectangular slit-sensors in the head's face-plate, same cyan as the core. Ancient Ne-Yon runes etched into the plates at the shoulders, forearms, and thighs — geometric angular glyphs, NOT readable text. Sex dimorphism: [MALE] variant has squarer shoulder plates, heavier gauntlets, broader chest core. [FEMALE] variant has slimmer waist plates, slightly softer shoulder curves, narrower core panel — still clearly mechanical, not gendered, just build-variant. No hair, no beard, no skin. No base undersuit — the machine IS the body. T-pose, palms forward. Same 4-frame rotation. Film grain. 4K. No rendered text.

Shader hooks: `coreGlowIntensity` (0–1, default 0.7), `eyeSlitEmissive` (#06b6d4), `runePulseRate` (default 6.0s period), `armorWeathering` (0–1, cosmetic only).

#### 1C.5 — Per-species viseme handling

- **Human, Demagi, Quarchon** — full 15-viseme morph set on the face mesh, same pipeline as Elara/Human protagonist tier.
- **Ne-Yon** — NO mouth. Track D viseme timeline routes to `coreGlowIntensity` pulse (like The Architect). When the Ne-Yon player speaks, the core panel pulses in sync with phoneme intensity. No viseme morphs needed; just a shader-uniform ramp.

#### 1C.6 — Shared base-mesh rig requirements (ALL 8 meshes)

- 85k tris or less per mesh (character-sheet viewport, not in-combat).
- Shared skeleton across all 4 species (Mixamo-compatible rig), bone lengths auto-scaled per species height.
- 5 expression morphs: breath_in, breath_out, blink_L, blink_R, brow_concern (Ne-Yon blink = brief core-glow dip instead of eyelid — same morph slot, different behavior).
- Gear attachment sockets at: head, neck, chest, L_shoulder, R_shoulder, L_forearm, R_forearm, L_hand, R_hand, waist, L_thigh, R_thigh, L_foot, R_foot, back (for cape/mantle).
- UV layout consistent across species so a single gear-GLB fits all 4 species with minor scale offsets.

---

## PART 2 — 23 NON-PROTAGONIST NPCs (2D LIP-SYNC PIPELINE)

### 2.0 — Shared pipeline spec (applies to EVERY NPC in Part 2)

Every NPC in this section ships with the same four asset bundles, generated from a single canon reference image per character. The bundles feed Track D (universal lip-sync + breathing + blink).

**Bundle A — Neutral bust** (1 image, `{npcId}/neutral.png`, 1024×1536)
Three-quarter bust portrait, direct-to-camera gaze, closed mouth neutral expression, standardized chin-up crop from collarbone to top of head with ~15% headroom. This is the base layer that breathing/blink/visemes composite over.

**Bundle B — Breathing loop** (8 images, `{npcId}/breathing/frame_01..08.png`)
Same subject, same camera, same lighting, 8 frames of a seamless chest-rise loop. Chest scale varies from 1.000 (frames 1, 8) to 1.008 (frame 4–5). Shoulders lift 1.5px at peak. No head motion. No eye motion. No mouth motion. Only the torso/shoulders breathe. Sub-pixel difference between adjacent frames — this is intentional. Runtime crossfades through frames at 3.2s full cycle.

**Bundle C — Blink triptych** (3 images, `{npcId}/blink/{open,half,closed}.png`)
Same subject. OPEN = eyes fully open, neutral. HALF = upper eyelid ~50% travel. CLOSED = eyes fully closed. Runtime plays open→half→closed→half→open over 140ms. Must preserve eyelash detail and inner catchlight on OPEN frame.

**Bundle D — 15-viseme mouth plate grid** (single sheet, slice to 15 images)
Same subject, tight crop from nose-tip to chin. Generated as one Nano Banana sheet (5×3 grid) matching the Elara/Human viseme spec (Part 1A.2 phoneme labels). Runtime swaps the mouth region only; rest of face stays on the neutral/breathing/blink layers.

**Bundle E — Expression variants** (5 images, `{npcId}/expressions/{speaking,concerned,emotional1,emotional2,revealing}.png`)
Same subject, same crop. Tags map to `apps/client/src/game/npcPortraits.ts:NPCPortrait` interface — existing call sites don't need refactoring.

**Bundle F (optional) — Signature VFX overlay**
Character-specific shader or particle overlay PNG (e.g., Locke's eye-patch scan sweep, Shadow Tongue's fingertip text stream, Architect's mask-crack emissive). Spec'd per-character below.

**Total per NPC:** 1 + 8 + 3 + 15 + 5 = **32 images baseline**, plus optional VFX overlay. 23 NPCs × 32 = ~736 images in this tier.

**Style anchor for ALL Part 2 prompts (prepend to every generation):**
> Hyper-realistic cinematic portrait, 1024×1536, 4K, three-quarter bust framing. Photorealistic skin, hair, and fabric materials. Volumetric lighting. Film grain. Anamorphic micro-flares at strong light edges. No rendered text. Neutral dark backdrop softly defocused unless the character's canon scene is specified.

---

### 2A — AGENT ZERO

Canon anchors: yellow hood (not purple — reference was a color study), hood UP, NO face mask (mouth must be visible for lip-sync), windswept long dark-auburn hair, amber-brown eyes, dark tactical armor under saffron hood + scarf + bra, cyberpunk neon-rain urban backdrop (informs rim light only, not embedded in bust).

Reference: `apps/client/public/references/protagonists/agent_zero/REFERENCE.md` (to be authored from provided image + modifications).

#### 2A.1 — Bundle A: Neutral bust

> Three-quarter bust portrait of a woman in her late twenties, East-Asian features, confident predatory forward lean (shoulder slightly forward toward camera). She wears a saffron-yellow tactical hood pulled UP over her head — hazard-yellow canvas-weave fabric (#f5c518), draping asymmetrically so the hood edge falls lower on her right brow. Mouth fully visible — no mask, no scarf pulled over the nose. Scarf bunched loosely at the collarbone in the same saffron yellow. Under the hood: long dark-auburn hair streaming out to the subject's left, windswept, dynamic motion caught mid-gust (individual locks legible, ~20 primary strands). Amber-brown eyes (#b08a4a iris), dark eyeliner, direct intense gaze to camera. Beneath the scarf: a fitted black tactical armor bra (#2a2d32, matte gunmetal), visible straps, a faint hexagonal plate pattern. Over the bra on each shoulder: black tactical pauldron plates (also matte gunmetal). Exposed mid-section (saffron hood + armor contrast). Backdrop: heavy bokeh of a neon cyberpunk street at night — magenta and cyan sign-light bokeh, rain-slick atmosphere, no legible signage. Rim light: cool cyan from back-right, warm amber key from camera-left (streetlamp simulation). Mouth closed, neutral, slight resting lip-press. Film grain. 4K. No rendered text.

#### 2A.2 — Bundle B: Breathing loop (8 frames)

> Same subject, same lighting, same pose, 8-frame seamless breathing loop. Each frame identical EXCEPT: chest expansion (frames 1+8: baseline 1.000; frames 2+7: 1.002; frames 3+6: 1.005; frames 4+5: 1.008). Shoulders lift 1.5px at frames 4–5. Hood drape shifts subtly (fabric settles 1–2px lower at full inhalation). Hair strands drift ±1px. Eyes, mouth, face geometry UNCHANGED across all 8 frames. Backdrop UNCHANGED. Deliver as 8 separate PNG files in-order, or as one stitched horizontal strip 8192×1536.

#### 2A.3 — Bundle C: Blink triptych

> 3 frames of same subject, same pose, same lighting. OPEN: eyes fully open, full iris and catchlight visible, eyelashes sharp. HALF: upper eyelid traveled 50% downward, lower lid unchanged, iris partially occluded, catchlight partially hidden. CLOSED: both eyelids fully closed, eyelashes meet, a faint crescent shadow beneath the lash line. No other facial change. 3 PNGs.

#### 2A.4 — Bundle D: Viseme grid

> 15-panel viseme reference sheet (5 rows × 3 columns) of Agent Zero's face, TIGHT crop from nose-tip to chin only — the hood, eyes, hair are NOT needed for this sheet (they come from the base layers). Same lighting, same skin tone, same lip color and lip gloss level across all 15 panels. Phoneme labels per Part 1A.2 viseme spec (SIL, AA, AE, AH, AO, B_M_P, CH_SH, D_S_T, EE, ER, F_V, IH, L, OW, R, UW, W). Small grey label text at each panel's bottom edge. 4K.

#### 2A.5 — Bundle E: Expressions (5 variants)

> 5-panel expression sheet of Agent Zero, same hood/hair/armor/backdrop as neutral bust, matched lighting. Panels:
> 1. SPEAKING — mid-syllable, generic AH open mouth, eyes engaged direct.
> 2. CONCERNED — brow knit inward 5°, mouth closed tight, eyes narrowed slightly, head tilted 2° away from camera.
> 3. EMOTIONAL1 (wry) — one corner of mouth lifted 1mm, eyebrow quirked, eyes amused-watchful. Her "I already knew that" default.
> 4. EMOTIONAL2 (vulnerable) — eyes widened 8%, lips parted slightly, shoulders dropped back to square (no predatory lean). This is rare for her — reserved for her reveal moment about the Warlord host.
> 5. REVEALING — eyes locked direct, mouth slightly open pre-speech, hood pushed back 15% so more of her face is exposed. The "I'm going to tell you the truth now" pose.
> 4K. No rendered text.

#### 2A.6 — Bundle F: Optional VFX overlay

None required. Agent Zero uses standard breathing + visemes + blink. Her aliveness is carried entirely by the windswept hair (which can be driven by a subtle motion overlay — shift the breathing-loop hair deltas to loop at 5.2s on a separate channel from the chest breath).

---
