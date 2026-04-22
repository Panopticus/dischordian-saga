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

### 2B — ADJUDICATOR LOCKE

Canon anchors: purple hair in messy top-bun updo with loose bangs and rain-wet trailing strands; red glowing cyber-eyepatch over left eye (the signature — judgment-as-optical-device, subtle chain-strap running up into hair); right eye visible, pale, cold-judging; small cross-shaped piercing mark beneath visible eye; purple leather jacket, zippered, studded, lapels up; stacked gold chains at collar; two blue-eyed masked enforcer silhouettes flanking her in authority contexts (rendered as separate background meshes, not in bust). Confrontational-forward idle pose (she never leans away).

Reference: `apps/client/public/references/npcs/locke/REFERENCE.md`.

#### 2B.1 — Bundle A: Neutral bust

> Three-quarter bust portrait of a woman, late twenties to early thirties, striking features, confrontational forward weight (shoulder pushed slightly toward camera — she does not lean away). Purple hair (#8b5cf6 base, #a78bfa highlights) in a messy top-bun updo — loose bangs falling across the forehead, ~4 strands hanging down past her jawline on the camera-left side, rain-wet and clumped together (wet-hair shader). Left eye fully covered by a circular cyber-monocle EYEPATCH — dark metallic frame (#1a1a1d gunmetal), embedded red scanner display inside the lens showing a faint red scan-line pattern (#e11d48, subtle emissive), a fine silver chain-strap running from the eyepatch frame UP into her hairline and disappearing into the bun. Right eye fully visible — pale cold iris (#b8c0c8, near-grey with blue undertone), direct unblinking gaze, dark eyeliner, kohl-smudged lower lid. Directly beneath the visible right eye: a small cross-shaped piercing/mark (a tiny metal cross ornament or a henna-style ink cross, artist's choice as long as it reads as a "crying cross" motif). Wearing a purple leather jacket (#6d3ba8, deep plum with specular highlights) zipped halfway up, studded lapels turned UP in an assertive collar, button detail visible. Beneath the jacket: stacked gold chain necklaces at the collarbone (3 chains of varying thickness, warm yellow gold #d4a04a). Black undershirt beneath the jacket, minimal crew-neck. Backdrop: heavy neon-rain cyberpunk bokeh — magenta #e040fb and cyan #06b6d4 sign-light bokeh, rain streaks barely legible, volumetric rain haze. Rim light: magenta from back-right, cool cyan fill from back-left (implied enforcer point-lights at 7 and 5 o'clock behind her). Mouth closed neutral with a faint downturn at the corners — assessing. Film grain. 4K. No rendered text.

#### 2B.2 — Bundle B: Breathing loop (8 frames)

> Same subject, same lighting, same pose, 8-frame seamless breathing cycle. Standard chest scale curve (1.000 at frames 1/8, 1.008 peak at frames 4–5). Hair strands on camera-left drift ±1.5px at peak (wet hair has lower drift amplitude than dry). Gold chains at collarbone shift 1px at peak inhalation. Jacket fabric unchanged. Eyepatch UNCHANGED (it's rigid metal). Backdrop UNCHANGED. 8 PNGs.

#### 2B.3 — Bundle C: Blink triptych

> 3 frames of same subject. OPEN: right eye fully open, pale iris and catchlight visible, eyelash sharp. HALF: right upper eyelid at 50% travel. CLOSED: right eye fully closed. LEFT EYE UNCHANGED in all three frames (it's behind the eyepatch — no visible lid). No other facial change. 3 PNGs.

#### 2B.4 — Bundle D: Viseme grid

> 15-panel viseme reference sheet of Adjudicator Locke's mouth region, tight crop nose-tip to chin. Same phoneme spec per Part 1A.2. Matched lighting, consistent lip tone (pale neutral, slightly matte — not glossy). 4K.

#### 2B.5 — Bundle E: Expressions (5 variants)

> 5-panel expression sheet, same canon elements. Panels:
> 1. SPEAKING — mid-syllable AH open mouth, right eye locked, eyepatch scan accelerated (stronger red glow — driven by overlay, not this still).
> 2. CONCERNED — brows pull together, mouth tight, right eye narrows 10%, head tilts FORWARD (not away — she advances when concerned).
> 3. EMOTIONAL1 (judgment-pronounced) — chin slightly raised, lips pressed thin, right eye half-lidded in appraisal, a single deliberate exhale caught mid-breath. This is her "verdict delivered" frame.
> 4. EMOTIONAL2 (vulnerable moment) — exceedingly rare; the right eye wets with a single catchlight tear suggestion, mouth slightly parted, the confrontational forward lean softens 4°. Reserved for a specific plot beat where she drops the adjudicator mask.
> 5. REVEALING — she lifts the eyepatch 20% up onto her forehead (the metal frame visible at a higher angle, the LEFT EYE BENEATH briefly exposed for the first time — pale, ordinary, human, unaugmented). Mouth parted pre-line. This is the SINGLE frame where the eyepatch is not covering her left eye; reserve strictly for the one reveal beat.
> 4K. No rendered text.

#### 2B.6 — Bundle F: Eyepatch scan-sweep VFX overlay

> **Output:** `apps/client/public/vfx-atlases/locke_eyepatch_scan.png` — 512×512, transparent.

> A circular red scan-line pattern texture, 512×512, transparent background. Inside a 400px-diameter circular zone (the eyepatch lens area): fine horizontal scan-lines in red (#e11d48) at 60% opacity, 2px line width, 4px spacing, with a brighter 8px band traveling vertically at the center of the frame (the "scanning head") — render as one frame with the bright band at mid-travel (~50% through cycle). Faint HUD-ring etchings in fainter red around the circle perimeter: crosshairs, small tick marks every 30°, a single alphanumeric glyph cluster at the top (not legible text — decorative cipher). Outside the 400px lens circle: fully transparent. Additive blend at runtime.

**Runtime behavior:** The scan-band animates vertically top↔bottom over a 2.8s loop at idle (slow). When Track D detects Locke is speaking, the loop accelerates to 0.9s period and the scan-line brightness boosts 1.6×. Eyepatch intensity uniform `scanActive: 0..1` drives both speed and brightness.

---

### 2C — THE SOURCE / KAEL (THREE-PHASE RIG)

One character, three narrative states. Implemented as **three complete asset sets** keyed by `kaelTransformProgress`:

- **Phase 1** (`progress=0.0`) — Kael the Recruiter (ICL white armor)
- **Phase 2** (`progress=0.5`) — Enslaved Kael on the Panopticon (shirtless, prisoner-bracers)
- **Phase 3** (`progress=1.0`) — The Source (petrified, void-fractured, chrome gauntlets)

Each phase gets its OWN 32-image asset bundle (Bundles A–E per Part 2.0). Reference: `apps/client/public/references/npcs/source/{phase-1_recruiter,phase-2_enslaved,phase-3_source}.png`.

**Locked identity constants across all three phases:**
- Long brown dreadlocks (length grows by phase)
- Goatee/beard (volume grows by phase)
- Muscular heroic build, same face structure
- Gauntlet/bracer motif on forearm across ALL phases (phase 1 hides them under white armor)
- Amber-gold eyes; intensity ramps 0.2 → 0.3 → 1.0 by phase

**Default render at runtime:** Phase 3 unless a narrative flag forces flashback. Phases 1 and 2 are reserved for flashback beats.

#### 2C.1 — PHASE 1: Kael the Recruiter (`progress=0.0`)

**Bundle A — Neutral bust:**
> Three-quarter bust portrait of a muscular man, late twenties, warm medium-brown skin (#a47348), heroic confident stance with chest forward. Long well-maintained brown dreadlocks (#3a2518) pulled back from the face in a loose low gather, clean edges, ~18 primary locks visible, shoulder-length. Trim goatee, short, clean-lined. Subtle amber eye-glow (iris #c98230, faint warm emissive — detectable but not yet otherworldly). Wearing white Iron Clad Lions plate armor: a segmented white ceramic chestplate (#f0ede8) with "ICL" stenciled in clean black lettering on the right pec (readable, small), matching "ICL" stencil on the right shoulder pauldron. Low-poly sci-fi hero silhouette of the armor — angular plates at shoulders, collarbone, and chest. Red-orange tribal ink on both exposed forearms (#c74a1a) — ceremonial flame motif, clean lines. Expression: recruiter's earned confidence — mouth closed relaxed, eyes direct, a trace of welcome at the mouth corners. Backdrop: defocused ICL recruitment hall — white marble pillars, warm amber wall-sconces, faint cyan institutional ambient. Warm key light from camera-left simulating sconce, cool fill from camera-right. Film grain. 4K. No rendered text other than the "ICL" stencils on the armor.

**Bundle B — Breathing loop (8 frames):** Same subject, standard 8-frame chest cycle, peak 1.008 at frames 4–5. Armor plates move as rigid pieces — chest plate rises 1.5px at peak; pauldrons unchanged. Dreadlocks drift ±0.5px. 8 PNGs.

**Bundle C — Blink triptych:** 3 frames (open / half / closed). Standard. Amber eye-glow visible in OPEN frame at baseline 0.2 intensity.

**Bundle D — Viseme grid:** 15-panel sheet, tight mouth crop, standard phoneme set. Goatee hair trimmed to clear mouth silhouette (same strategy as Antiquarian beard) — but at phase 1 the goatee is short enough not to need morph offsets.

**Bundle E — Expressions (5):** SPEAKING / CONCERNED / EMOTIONAL1 (welcoming-warm) / EMOTIONAL2 (doubtful — a rare private moment where the recruiter's confidence wavers) / REVEALING (head tilted up, chest fully forward, the "join us" peak frame).

#### 2C.2 — PHASE 2: Enslaved Kael (`progress=0.5`)

**Bundle A — Neutral bust:**
> Three-quarter bust portrait of the SAME man as Phase 1 — same face structure, same bone — but worn. Skin shifted to pale prisoner pallor with cool gray undertone (#987256), sweat sheen on the brow and collarbone. Dreadlocks longer (now mid-chest length), wild and unkempt, unstyled, several locks falling forward across his face and one plastered to his left cheek by sweat. Beard fuller, longer, raw — no longer trimmed, with occasional stray hairs visible. Shirtless. Armor GONE — chest fully exposed showing expanded tattoo coverage: heavy black/navy tribal ink (#1a1d3a) now covering chest, stomach, and one full left sleeve down the forearm. Same tribal style as Phase 1's red, but corrupted/rewritten — the Panopticon captors have re-inked his identity. Both forearms now bear bronze/brass ornate prisoner-bracers: intricate embossed panels, riveted edges, ornamental grillework — these become the permanent silhouette element through Phase 3. At the collarbone: a heavy brass medallion pendant on a braided cord, bearing a sigil (a simple sun-crescent, the first appearance of what becomes the Source's sigil). Eyes still amber (#c98230) but dimmer — eye-glow at 0.3, defiant stare, jaw set. Expression: beaten but not broken. Backdrop: defocused Panopticon prison-stone — cold desaturated blue-gray walls, a distant strip of harsh cyan light above, damp atmosphere. Rim light: cold blue-gray from behind, minimal warm fill. Film grain. 4K. No rendered text.

**Bundle B — Breathing loop (8 frames):** Slightly shallower breathing curve (1.000 to 1.005 peak — he's guarded, less expansive). Shoulders tense, lift only 0.8px. Dreadlocks drift ±1.2px (longer hair = more motion). Medallion at collarbone swings 1.5px at peak inhalation. 8 PNGs.

**Bundle C — Blink triptych:** Standard. Amber eye baseline 0.3 on OPEN.

**Bundle D — Viseme grid:** 15-panel sheet. Fuller beard now requires a beard-clear crop strategy (mustache and upper beard trimmed digitally in the reference plate so visemes read; the runtime rig will drive a beard-part morph at vowels).

**Bundle E — Expressions (5):** SPEAKING / CONCERNED (already his default — dial it 10% stronger for this tag) / EMOTIONAL1 (defiant — jaw thrust forward, eye-glow flares to 0.4 briefly) / EMOTIONAL2 (broken-private — head down, eye-glow dims to 0.15, a single rare frame of despair) / REVEALING (he looks up direct for the first time, catches the camera — eye-glow surges to 0.5, the first pre-transformation tell).

#### 2C.3 — PHASE 3: The Source (`progress=1.0`) — DEFAULT RENDER

**Bundle A — Neutral bust:**
> Three-quarter bust portrait of the same man, now transformed. Ashen pale cool skin (#7a6858, desaturated) with black crack-like fractures spreading across the visible body — chest, collarbone, jawline, temple — like dry earth where something leaks through. From inside the fractures, a cold pale blue emissive light bleeds outward (#5a9abc, subtle — not glowing aggressively, just seeping). Dreadlocks grown wild and weathered, now below chest length, PARTIALLY PETRIFIED — individual locks fossilized into stone-moss textures at the tips, some locks writhing faintly like Medusa-roots (the stillness of stone with the hint of motion). Beard heavy, fully grown, longer than Phase 2, weathered and grayed at the edges. The Phase 2 black tribal ink has been SUBSUMED — no longer legible as tattoos, now indistinguishable from the skin fractures. Corruption ate the identity. The brass prisoner-bracers have REFORGED into chrome/silver cybernetic gauntlets (#c0c4cc) — more intricate, etched with sun-sigil glyphs, the re-alloying of enslavement into power. At the waist: a bronze utility belt with a prominent sun-sigil medallion (#c49a36) — the emergence mark. Eyes: FULL amber-gold glow (#e6b040 emissive, intensity 1.0), unblinking intensity. Head bowed slightly by default (weight of his presence). Expression: still, almost meditative, lips closed. Backdrop: defocused broken-stone cavern, dust motes frozen in a cold shaft of pale blue light from above, faint warm amber from the belt-medallion glow reflecting on the stone. Cool ambient, warm subject-center. Film grain. 4K. No rendered text.

**Bundle B — Breathing loop (8 frames):** Slower cycle — 4.8s instead of 3.2s (he breathes like something ancient). Chest scale 1.000 to 1.012 (deeper). Stone-petrified dreadlocks move LESS at the tips (0.3px drift) than at the scalp base (1.5px drift) — the stone is heavy. Fracture emissive pulses subtly in sync with breathing (inhale dims the blue leak, exhale brightens it — visual breath). 8 PNGs.

**Bundle C — Blink triptych:** Standard. Amber eye at 1.0 intensity in OPEN.

**Bundle D — Viseme grid:** 15-panel sheet. Full beard requires beard-part morph strategy on runtime; reference plates render mouth with mustache cleared.

**Bundle E — Expressions (5):** SPEAKING (head lifts fully from bowed default for the first time, eye-glow 1.2×) / CONCERNED (a deep stillness — the fractures darken subtly, emissive dims) / EMOTIONAL1 (awakening — the petrified dreadlocks at the nape animate briefly like Medusa-roots for 400ms) / EMOTIONAL2 (mourning-Kael — a flicker of the Phase 2 man visible beneath the fractures, the blue leak warms to amber briefly before re-cooling) / REVEALING (head fully lifted, eyes direct at camera, full eye-glow 1.5×, the fracture pattern across his chest visibly expands by 15% — new cracks light up — he is claiming his power in this frame).

#### 2C.4 — Bundle F (Phase 3 only): Void-fracture emissive overlay

> **Output:** `apps/client/public/vfx-atlases/source_void_fractures.png` — 2048×2048, transparent.

> A texture of cracking stone-skin fractures, 2048×2048, transparent background. Irregular thin dark crack lines (1–4px width) branching organically across the surface like dry earth or obsidian cooling — ~40 primary cracks, each branching into 3–6 secondary cracks, no symmetry, organic distribution. Along the INSIDE edge of each crack: a 2px emissive band in cold pale blue (#5a9abc at 90% opacity fading to 0% across 6px). The emissive edge is brightest at the deepest part of the crack, dim at the tapered tips. No colors outside the narrow palette (black crack, blue emissive). Masked in post to match the Phase 3 silhouette shape. Used as additive overlay driven by `fractureEmission: 0..1` shader uniform.

#### 2C.5 — Shared shader uniform block

```json
{
  "rigId": "npc_source_kael",
  "shaderProgram": "PhaseBlendedPortrait",
  "uniforms": {
    "kaelTransformProgress": 1.0,
    "phase1Bundle": "portraits2d/source_phase1/",
    "phase2Bundle": "portraits2d/source_phase2/",
    "phase3Bundle": "portraits2d/source_phase3/",
    "fractureEmission": 0.7,
    "fractureTexture": "vfx-atlases/source_void_fractures.png",
    "eyeGlowBaseline": 1.0,
    "hairPetrification": 1.0,
    "blendDuration": 1.2
  },
  "stateTriggers": {
    "flashbackRecruiter": "kaelTransformProgress=0.0",
    "flashbackEnslaved": "kaelTransformProgress=0.5",
    "presentDaySource": "kaelTransformProgress=1.0",
    "transformationCinematic": "playVideo:kael_three_phase_transform.mp4"
  }
}
```

#### 2C.6 — Veo 3.1 cinematics (spec'd here, rendered in Part 9)

- **CIN-KAEL-01:** 14s transformation from Phase 1 → Phase 2 → Phase 3. Start frame = Phase 1 Recruiter in ICL recruitment hall. End frame = Phase 3 Source emerging from broken stone. Scrubs `kaelTransformProgress` 0.0 → 0.5 at 5s → 1.0 at 12s with held reveal beat through 14s. See Part 9 for full beat breakdown.
- **CIN-KAEL-02:** 6s rock-break emergence loop (first in-game Source encounter). Start frame = closed stone crevice. End frame = Kael (Phase 3) standing framed by broken rock, stone shards mid-fall, cold blue fracture light spilling out from his body. See Part 9.

---

### 2D — THE ANTIQUARIAN

Canon anchors: older gentleman, late 50s–60s, weathered scholar; MAGNIFICENT long silver-white chest-length beard continuous with mustache (THE signature silhouette); silver-white hair tousled and brushed back; deep-set piercing blue-gray eyes, narrowed in evaluation; black velvet coat with gold baroque embroidery (curling filigree lapels, ornate pauldrons); white cravat/frilled jabot at throat; gold medallion buttons; warm candle-lit library backdrop with vaulted ceiling + stained glass upper-right + amber lamp glow.

Reference: `apps/client/public/references/npcs/antiquarian/REFERENCE.md`. Existing matchup canon in `docs/production/SHIP_READY_ASSET_BIBLE.md` CIN-012 + CIN-040 reveal.

**Critical rigging note:** The beard physically covers the mouth. Viseme reference plates render with the mustache digitally cleared so phoneme shapes read; the runtime rig adds a `beardPart: 0..1` morph target that parts the mustache on open-vowel visemes (AA, O, U) enough for the viseme to show through. Without this, lip-sync reads as "the beard is moving on its own."

#### 2D.1 — Bundle A: Neutral bust

> Three-quarter bust portrait of an older gentleman, late 50s to early 60s, weathered scholar's face, deep-set blue-gray eyes (#6b7a88) beneath pronounced brow ridges with a signature evaluative narrow. Piercing gaze direct to camera — not welcoming. Information must be earned with him. A magnificent long silver-white beard (#e4e8eb to #c8ccd2), flowing, well-groomed, reaching his mid-chest, continuous with a full mustache — the single most legible silhouette feature. Silver-white hair brushed back from the forehead, slightly tousled, medium length. Wearing a black velvet frock coat (#0a0b0d deep near-black velvet) with heavy gold baroque embroidery (#d4a04a) — curling filigree on the lapels, ornate shoulder pauldrons, gold medallion buttons running down the front, a single embroidered sigil at the left breast (abstract geometric — a book-and-key motif). White frilled silk cravat/jabot at the throat, starched, Victorian-formal. Backdrop: heavily defocused tall candle-lit library — vaulted ceiling implied in the upper bokeh, stained-glass window fragment catching colored light in the upper-right corner, warm amber lamp-glow dominant. Key light: tungsten amber from camera-left (lamp angle). Fill: cool stained-glass pale cyan from above. Mouth closed neutral behind the beard — lips visible only as a faint line through the mustache. Film grain. 4K. No rendered text.

#### 2D.2 — Bundle B: Breathing loop (8 frames)

> Same subject, 8-frame seamless breathing cycle. **Critical: the BEARD carries the breath, not the chest.** Chest scale 1.000 to 1.004 only (shallow — he is an older man, and the coat hides rise). The long beard drifts on subtle ambient air currents: individual beard strands shift ±3px at peak, the overall beard silhouette expanding/contracting almost imperceptibly as if breathing through it. Silver hair at the crown drifts ±0.8px. Coat UNCHANGED. Mouth UNCHANGED. 8 PNGs.

#### 2D.3 — Bundle C: Blink triptych

> 3 frames, standard (open / half / closed). The deep brow ridges cast a pronounced shadow across the CLOSED frame — his eyes "go dark" more than other characters. Preserve this as atmospheric detail. Eye catchlights sharp on OPEN.

#### 2D.4 — Bundle D: Viseme grid (WITH beard-clear digital edit)

> 15-panel viseme reference sheet of the Antiquarian's mouth region, tight crop from nose-tip to chin. **Critical modification:** digitally thin the mustache to ~40% of its canon volume in these reference plates so the lip shape reads cleanly in each viseme. The runtime rig drives the beard-part morph from the full-canon beard at idle toward these thinned plates during active speech. Same phoneme spec per Part 1A.2. Matched tungsten + stained-glass lighting. Consistent lip tone (pale neutral, slightly chapped — matching the older-man skin). 4K. No rendered text.

#### 2D.5 — Bundle E: Expressions (5 variants)

> 5-panel expression sheet. Panels:
> 1. SPEAKING — mouth mid-syllable AH (beard parts visibly at center), head lifts 4°, eyes softer / less narrow.
> 2. CONCERNED — brows pull together, deep furrow deepens, mouth tight behind beard, eyes search mid-distance (not direct).
> 3. EMOTIONAL1 (evaluating) — one brow lifts 3°, a trace of amusement at the mouth corner visible through mustache, direct gaze.
> 4. EMOTIONAL2 (remembering) — eyes unfocused, drift 8° to middle distance, mouth slightly open behind beard, the reading-focus state.
> 5. REVEALING — head lifted, eyes direct with brow ridges RELAXED for the first time (unguarded), mouth open pre-speech, beard parts slightly. This is the rare "the Antiquarian has chosen to tell you the truth" frame. Reserved for the Year-One reveal event.
> 4K. No rendered text.

#### 2D.6 — Bundle F: Optional VFX overlay

None required as a texture. Runtime behavior: the `readingFocus: 0..1` uniform drives the eye saccade pattern — `0.0` = direct locked gaze, `1.0` = middle-distance drift (small random targets every 1.8s). When Track D detects he's speaking, `readingFocus` auto-dips to 0 so the lock-on is dramatic. When idle and the player is not interacting, `readingFocus` rises to 0.6 (he's reading something offstage).

#### 2D.7 — Shader uniform block

```json
{
  "rigId": "npc_antiquarian",
  "shaderProgram": "BeardCarriedPortrait",
  "uniforms": {
    "beardPart": 0.0,
    "beardPartMax": 0.8,
    "beardDriftAmplitude": 3.0,
    "hairDriftAmplitude": 0.8,
    "readingFocus": 0.4,
    "libraryAmberKey": "#d4a04a",
    "stainedGlassFillIntensity": 0.35
  },
  "stateTriggers": {
    "speaking": "beardPart ramps with viseme openness; readingFocus=0",
    "idle": "readingFocus=0.6; beardPart=0",
    "yearOneReveal": "expression=REVEALING; readingFocus=0; beardPart=0.4"
  }
}
```

---

### 2E — SHADOW TONGUE (CORPORATE-ADAPTED)

Canon anchors (lore-locked from `apps/shared/characterVisualDNA.ts:147-164`):

- Species: anomaly (NOT human — the suit is a performance)
- Skin tone #221a2a (near-black undertone)
- Hair resembles shadow fabric rather than hair — in corporate form, a slicked-back executive cut whose strands subtly flow like smoke when no one's looking directly
- Violet slit-pupil eyes, slightly too large (the one thing the suit cannot disguise)
- Mouth opens too wide when speaking — second row of teeth visible on revelatory lines only
- Face rearranges subtly across frames — never exactly the same twice
- Palette: #08020a near-black, #7a3fb8 deep violet, #c084fc bloom violet
- NEVER DEPICT: consistent face across two panels, stillness, warm expression

Corporate translation (charcoal-violet pinstripe suit, corporate floor backdrop, fingertip corrupted-text streams instead of bloody claws) authored earlier in planning. Reference: `apps/client/public/references/npcs/shadow_tongue/REFERENCE.md`.

**Critical rigging note:** Shadow Tongue DOES NOT BREATHE. His chest is static in Bundle B. His only idle motion is blink (off-rhythm) and fingertip text drift (Bundle F overlay). This is what sells him as anomaly-in-a-suit — everyone else in the game breathes; he doesn't.

#### 2E.1 — Bundle A: Neutral bust

> Three-quarter bust portrait of a tall androgynous executive-presenting figure, skin tone near-black with a deep violet undertone (#221a2a). Hair slicked-back executive cut, deep black (#0a0609) — individual strands faintly flow like thin smoke at the ends when observed peripherally (render as the still canonical pose, knowing runtime will add subtle animation). Violet slit-pupil eyes (iris #7a3fb8 with #c084fc bloom around the slit-pupil), set slightly too large for the face — uncanny but subtle. Eye contact direct and unbreaking. Wearing an immaculately tailored three-piece charcoal-to-deep-violet pinstripe executive suit: the pinstripes subtly shift in tone from near-black base to deep violet accent lines (~3mm spacing), the fabric catches light with a silk-to-oil sheen transition. White dress shirt, high collar, fully buttoned. Deep violet silk tie (#6d3ba8) with a barely-legible CRT-scanline pattern woven into the silk at close inspection. Gold signet ring visible on the right pinky (the editor's pen mark). Corporate lanyard at the lapel with an ID badge reading "EDITOR" in clean Helvetica (this text IS rendered but should shimmer-flicker at runtime — for the still, render it crisp and legible as "EDITOR"). Hands resting symmetrically at chest level — fingertips pointed loosely toward camera, with a barely-visible faint violet mist trailing from the tips (this is the canon idle state of the text streams — Bundle F handles the full-intensity version). Backdrop: heavily defocused executive corner office at night — floor-to-ceiling glass, neon city grid reflecting in the glass creating rectilinear violet light patterns, a dark desk with an open bound volume (the Loredex) visible in the deep background, a floating violet cursor hovering over a name mid-edit. Recessed overhead lighting casts a sharp vertical shadow behind him that does NOT quite match where his body should cast it. Mouth closed, lips set in an almost-correct neutral — slightly too wide by 4% to feel wrong on close inspection. Film grain. 4K. No rendered text except the "EDITOR" lanyard.

#### 2E.2 — Bundle B: Breathing loop (8 frames)

> 8-frame static loop. **NO CHEST MOTION. NO SHOULDER MOTION. NO BREATHING.** The ONLY per-frame variation is a micro-geometric rearrangement of the face: frame 1 baseline, frame 2 cheekbone up 0.4px, frame 3 nose length +0.3px, frame 4 eye spacing +0.5px, frame 5 jaw width −0.3px, frame 6 back to near-baseline with chin offset, frame 7 upper-lip curve shifted 0.6px, frame 8 returns to frame 1 baseline. Each shift is SUBLIMINAL — audience shouldn't consciously notice, but the face feels wrong over time. Deliver as 8 PNGs; runtime cycles at 4.8s (slower than a breathing loop — he moves on anomaly-time).

#### 2E.3 — Bundle C: Blink triptych + bonus frame

> Standard 3 frames (open / half / closed) PLUS a 4th "NICTITATING" frame: eyes show a horizontal sideways eyelid sweep instead of vertical — a nictitating membrane flickering from the outer corner inward, eyes partially occluded by a faint translucent violet film. Runtime behavior: every ~6-7 normal blinks, one blink is the nictitating frame instead. Subliminal — audience notices without knowing why. 4 PNGs total.

#### 2E.4 — Bundle D: Viseme grid + hyperextension variants

> 30-panel viseme reference sheet (15 standard + 15 hyperextended duplicates). Standard 15 panels match Part 1A.2 phoneme spec at conservative openness — his "passing" visemes. The HYPEREXTENDED 15 panels push the O, U, AA, AE, AW visemes beyond human limits: jaw dropped further than anatomy allows, mouth corners retracted wider than cheek geometry should permit, a SECOND ROW OF TEETH visible in the back of the mouth cavity (small, sharp, inward-curving, humanoid-adjacent but clearly wrong) on the deepest vowels only. Consonant visemes (B_M_P, F_V, D_S_T) do NOT have hyperextended variants — his consonants always read human. Runtime opts into hyperextended viseme on a per-line basis via `hyperextendOnVowels: boolean` in the VO manifest. 4K. No rendered text.

#### 2E.5 — Bundle E: Expressions (5 variants)

> 5 panels:
> 1. SPEAKING — mouth mid-AH at standard (not hyperextended) openness, violet eyes lock.
> 2. CONCERNED — a deeply wrong expression: mouth corners lift as if smiling, but eyes narrow as if suspicious. The combination reads as "I am performing concern for you and we both know it."
> 3. EMOTIONAL1 (amused) — a thin practiced smile that engages the mouth only, eyes unchanged direct. The smile does not reach the face.
> 4. EMOTIONAL2 (caught) — one frame of the illusion cracking: face asymmetry spikes to 8% (beyond subliminal — the viewer sees something is WRONG), a single stray strand of smoke-hair visibly detaches from the slicked-back cut and drifts upward, the lanyard text briefly reads "HIERARCHY SVP" instead of "EDITOR." This is the anomaly caught mid-edit.
> 5. REVEALING (second-teeth) — jaw hyperextended fully, mouth open wide enough to show both rows of teeth, violet eye-bloom intensity doubled. Face asymmetry at 10%. This is the lore-locked "I am the universe's editor" frame. Reserved strictly for specific revelatory lines — per-line opt-in via `revealSecondTeeth: boolean` VO manifest field.
> 4K. No rendered text except the emotional2 lanyard shimmer.

#### 2E.6 — Bundle F: Fingertip text-stream VFX overlay

> **Output:** `apps/client/public/vfx-atlases/shadow_tongue_fingertip_text.png` — 1024×1024, transparent.

> A particle-spawner reference sheet of corrupted text stream emissions, 1024×1024 transparent background. Contents: a scattered collection of ~120 small glowing violet glyph characters (#c084fc emissive) of varying opacity (20%-90%), scaled from 8px to 22px, rotated at random angles. Characters are drawn from a set that mixes: Latin letters, numerical digits, punctuation, and subtle glitch-corruption marks (zero-width combining glyphs, broken unicode artifacts). Each glyph has a faint directional streak behind it (4-12px, semi-transparent, same violet) suggesting motion. No complete readable words. Characters distribute organically, not gridded. Used as source atlas for a GPU particle system that spawns glyphs from the fingertip sockets of Shadow Tongue's hand rig, drifting upward and fading at ~2-3s per particle.

**Runtime:** `fingertipTextIntensity: 0..1` drives particle spawn rate (0.1 idle → 0.8 mid-gesture → 1.0 on revelatory lines). Always on, never fully off — even at rest, faint mist trails.

#### 2E.7 — Shader uniform block

```json
{
  "rigId": "npc_shadow_tongue",
  "shaderProgram": "AnomalyPortrait",
  "uniforms": {
    "suitMaterialPhase": 0.3,
    "facialInconsistency": 0.4,
    "jawHyperextend": 0.0,
    "secondRowTeeth": 0.0,
    "fingertipTextIntensity": 0.1,
    "eyeVioletEmissive": 0.3,
    "hairSmokeDrift": 0.15,
    "lanyardTextShimmer": "random:8s-14s peek for 200ms",
    "breathingPhase": null
  },
  "stateTriggers": {
    "speaking": "jawHyperextend=0 unless flagged; suitMaterialPhase=0.7; fingertipTextIntensity=0.8",
    "speakingHyperextend": "jawHyperextend=1.0; facialInconsistency=0.8; suitMaterialPhase=1.0",
    "revelatory": "secondRowTeeth=1.0; jawHyperextend=1.0; eyeVioletEmissive=0.6",
    "idle": "no chest motion, nictitating blink every 6-7 regular blinks"
  }
}
```

---

### 2F — THE ARCHITECT (ENTITY-TIER, STATUESQUE RIG)

Canon anchors: entity-tier (not human-tier) — designer of the Panopticon and the player's Story Mode. Deep black hooded cloak absorbing light; full-face black metallic demon mask with fractal wing/flame ridges radiating from the forehead, narrow vertical bridge ending in a pointed beak-like lower jaw; piercing golden-amber glowing eyes through narrow slits — the ONLY warm light on him; silver/chrome fractal sigil pendant at the chest (smaller echo of the mask motif); pure void backdrop — no scene, no environment, HE lights the room.

Reference: `apps/client/public/references/npcs/architect/REFERENCE.md`.

**Critical rigging divergence from human NPCs:** The Architect is a STATUE rig, not a humanoid rig. No breathing. No blink. No hair. No mouth. No skin. His viseme timeline drives `maskVibration`, NOT mouth morphs. His "blink" is absent — the eyes are emission fields, not flesh. His only aliveness markers are sigil-pulse and hood-drift. This is DELIBERATE — he is architecturally distinct from every other character in the game.

#### 2F.1 — Bundle A: Neutral bust

> Three-quarter bust portrait of a tall humanoid figure, entirely concealed within a deep black hooded cloak (#050507, near-pure black, fabric absorbs light with only faint fold highlights at the peaks of the drape). The hood pulled fully up, casting the face into near-total shadow except for: a full-face black metallic demon mask (#1a1c20 gunmetal with deep fractal-sculpted surface detail), angular and sharply faceted. Mask design: wing-like or flame-like ridges radiate upward and outward from the forehead, sculpted in 3D relief, symmetrical. A narrow vertical ridge runs down the bridge of the nose and ends in a pointed beak-like lower jaw. The mask surface is faceted armor plating — multiple planes catching light at different angles. Piercing golden-amber glowing eyes (#e6b040 emissive, HDR bloom) visible through narrow horizontal eye-slits in the mask — these are the ONLY warm light source in the frame. At the chest, hanging on a fine chain: a silver/chrome fractal sigil pendant (#c0c4cc), a smaller crown/spike crest that mirrors the mask motif — like a miniature version of the mask worn as a medallion, with a subtle cool emissive pulse along its edges. Backdrop: PURE VOID. No scene. No environment. Only the figure and the glow emanating from him. Key light: the amber from his eye-slits bounces subtly onto the mask's cheekbone relief; the silver pendant casts a cool faint glow up onto the underside of the hood fabric. No external key, no fill, no rim — he IS the light. Mouth: absent (the mask has no mouth opening). Film grain. 4K. No rendered text.

#### 2F.2 — Bundle B: Breathing loop (8 frames) — STATUE BASELINE

> 8-frame static loop. **NO BREATHING. NO BLINK. NO HEAD MOTION.** The ONLY per-frame variation:
> - Frames 1-8 subtle hood-drape drift: individual hood folds shift ±0.8px on a slow 8-second cycle (one full cycle across all 8 frames). Subliminal.
> - Sigil pendant emissive pulse cycles across the 8 frames: intensity 0.6 → 0.8 → 1.0 → 0.8 → 0.6 → 0.4 → 0.6 → return to 0.6. Barely perceptible, but present — this is his "breathing" equivalent, unhurried and mechanical.
> - Eye-slit amber intensity UNCHANGED across all 8 frames (baseline 0.8, HDR bloom stable).
> 8 PNGs.

#### 2F.3 — Bundle C: Blink triptych — NOT GENERATED

> Skip. Architect does not blink. Runtime blink channel is unused for this rig. Deliver a single 3-panel "BLINK NOT USED" marker sheet so the pipeline asset inventory tool does not flag him as missing assets.

#### 2F.4 — Bundle D: Viseme grid — NOT GENERATED (mask-vibration routing)

> Skip traditional viseme plates. Instead, deliver a single **Mask Vibration Emissive Sheet**: 15 panels showing the mask surface with per-phoneme emissive hairline-crack glow patterns. The crack-glow patterns correspond to phoneme intensity: SIL = no cracks visible; strong-open vowels (AA, AO) = maximum crack spread with violet-amber bleed from the cracks; softer consonants = narrow crack-threads only. Crack glyph patterns are sculpted-fractal (following the mask's geometric ridges, not random), always symmetrical, always readable as "the voice is ringing a bell from inside." Same 15 phoneme labels as standard viseme set. Used as texture for the runtime `maskVibration` shader (NOT as morph targets on a mouth — the mask is rigid; only the emissive is animated). 4K.

#### 2F.5 — Bundle E: Expressions (5 variants) — EYE-INTENSITY BASED

> Architect's expressions are communicated entirely through eye-amber intensity, sigil pulse rate, and mask vibration baseline. 5 panels:
> 1. SPEAKING — eye-amber 1.0 (25% above baseline), faint maskVibration crack-glow active at low amplitude, sigil pulse accelerated to 3s cycle.
> 2. CONCERNED — eye-amber 0.9 (dimmed), sigil pulse slowed to 6s cycle, hood-drape subtly pulls forward 2px (contracts into himself).
> 3. EMOTIONAL1 (AUTHORITY BEAT) — eye-amber 1.4, sigil pulse 2s, mask cracks visibly glow at 30% amplitude even without active phoneme — a declaration-of-authority idle. Reserved for judgment lines.
> 4. EMOTIONAL2 (true-final-message) — rare: eye-amber 1.8 (overdriven, near white-hot center), sigil pulse accelerates to 1s, the mask surface shows the FIRST hairline fracture along a single cheekbone plane (not lit up yet — just a visible crack in the armor). Reserved for the Shadow-Tongue-exposure reveal.
> 5. REVEALING (mask-breach) — one frame of the climactic beat: eye-amber at max 2.0, sigil pulse 0.5s, the mask shows a full fracture running from the left cheekbone to the lower jaw with violet-amber light leaking through the crack and a single tear of light running down. Suggests — does NOT confirm — that there is someone behind the mask. Reserved for the True Final Message reveal cinematic end-frame.
> 4K. No rendered text.

#### 2F.6 — Bundle F: Mask-crack emissive VFX overlay

> **Output:** `apps/client/public/vfx-atlases/architect_mask_cracks.png` — 2048×2048, transparent.

> A fracture-crack emissive texture mapped to the mask's surface, 2048×2048 transparent background. A network of thin hairline cracks traversing the mask's symmetrical ridges — crack paths follow the fractal-geometric sculpting (not random — the cracks run along the seams of the mask's armor plates). Each crack lined with a 1-3px emissive band in gradient from deep violet at the crack core (#7a3fb8) transitioning to amber (#e6b040) at the outermost 20% of the crack depth. Intensity brightest at the cheekbone regions, dimmer along the forehead ridges, absent at the nose bridge (which is structurally sound). Black/transparent mask outside the crack regions. Used as additive emissive overlay driven by `maskVibration: 0..1` (phoneme intensity) and `masterOverride` (gated by authority/reveal triggers).

#### 2F.7 — Shader uniform block

```json
{
  "rigId": "npc_architect",
  "shaderProgram": "EntityStatueRig",
  "uniforms": {
    "breathingPhase": null,
    "blinkChannel": null,
    "eyeAmber": 0.8,
    "eyeAmberMax": 2.0,
    "sigilPulseRate": 4.0,
    "sigilPulseTexture": "additive_glow_preset",
    "hoodDrift": 0.08,
    "maskVibration": 0.0,
    "maskCrackTexture": "vfx-atlases/architect_mask_cracks.png",
    "voidLighting": true,
    "sceneKillsExternalLights": true
  },
  "stateTriggers": {
    "speaking": "maskVibration ramps with phoneme intensity; eyeAmber +0.2",
    "authority": "eyeAmber=1.4; sigilPulseRate=2.0",
    "trueFinalMessage": "playVideo:architect_mask_ignition.mp4 then eyeAmber=1.8",
    "firstReveal": "eyeAmber ramps 0.0→2.0 over 3s; mask cracks ignite"
  }
}
```

#### 2F.8 — Veo 3.1 cinematic pointer

- **CIN-ARCH-01:** 6s mask-ignition reveal. Start frame = default hooded-mask portrait at eye-amber baseline. End frame = mask fractured along cheekbone with a violet-amber light-tear running down. See Part 9 for full spec.

---

### 2G — THE AUTHORITY

Canon anchor: `docs/production/act1-asset-build/prompts/matchups/the-authority.txt` — The Authority has NO FACE because the Authority is not a person, it is the verdict. Deep-perspective hall shot with six crystal coffins (3 amber, 2 violet, 1 cyan), a barely-visible featureless silhouette on a shadowed dais at the back of the hall.

**Critical divergence:** The Authority has NO bust portrait. He is a background silhouette that fills a hall — the player sits in the foreground chair. He doesn't lip-sync; he doesn't breathe; he doesn't blink. His "portrait" is the environment, and his voice issues from the featureless shape at the back. Track D routes his VO through an off-screen text-only subtitle channel with no facial animation.

Reference: `apps/client/public/references/npcs/authority/REFERENCE.md`.

#### 2G.1 — Bundle A (modified): Environmental portrait

> Deep-perspective hall shot, 16:9 1920×1080. Camera at seated eye-level, foreground (lower third) is the back of a plain empty wooden chair facing away toward the depth of the hall. Left wall: six crystal coffins set into alcoves along the hall — three pale amber glowing at #d9a66a, two pale violet at #8b7fbf, one pale cyan at #4ba3b5 — all low saturation. Right wall: black marble (#1c1a1a) reflecting the coffin glow as faint vertical streaks. Floor: black marble stretching in deep perspective to a shallow dais at the far end under a stone archway. Above the arch in deep shadowed upper stone: the Authority's silhouette — a barely-visible darker shape against darker stone, readable only as a seated or standing outline, completely featureless (no face, no hands, no color, no reflective surface, no insignia, no indication of scale). Lit so faintly that the viewer's eye searches for it; first-pass reads as "empty hall with chair and coffins." Palette: #1c1a1a black marble dominant, #d9a66a amber, #8b7fbf violet, #4ba3b5 cyan (all desaturated), #6b4a2d warm wood on chair. No ambient warm lighting; no overhead lighting; no brass; no artificial color. Faint film grain. Volumetric cool air at ankle height, still. Cinematic 4K. No rendered text.

#### 2G.2 — Bundles B, C, D — NOT GENERATED

> Skip all three. Authority does not breathe, does not blink, does not have visemes. Deliver a single "AUTHORITY: NO MOTION BUNDLES" marker sheet for pipeline inventory. Runtime character-sheet presence = environmental portrait only.

#### 2G.3 — Bundle E (modified): Verdict-state variants (5 environmental shots)

> 5 variants of the same deep-perspective hall, each with a different lighting state representing the Authority's verdict mood:
> 1. NEUTRAL — baseline (as Bundle A).
> 2. LISTENING — one of the amber coffins glows 15% brighter; the silhouette upper-stone region very faintly darkens (+0.3 value shift) as if the shape has leaned forward an impossible distance.
> 3. JUDGING — all three amber coffins pulse up 20%, the two violet coffins dim 10%; the silhouette is essentially invisible now (the hall is lit too brightly around it).
> 4. VERDICT-GUILTY — the single cyan coffin flares to 2x baseline cyan intensity and washes the hall in pale cyan; the silhouette has visibly VANISHED (no shape at all in the upper stone — the verdict IS the light).
> 5. VERDICT-ACQUITTED — all amber coffins synchronize to a warm glow, violet coffins warm toward amber, cyan coffin dims to near-black; the silhouette briefly reads as present and still — verdict is acceptance of silence.
> 4K. No rendered text.

#### 2G.4 — Shader uniform block

```json
{
  "rigId": "npc_authority",
  "shaderProgram": "EnvironmentalPortrait",
  "uniforms": {
    "verdictState": "NEUTRAL | LISTENING | JUDGING | VERDICT-GUILTY | VERDICT-ACQUITTED",
    "silhouetteVisibility": 0.15,
    "coffinAmberIntensity": 1.0,
    "coffinVioletIntensity": 1.0,
    "coffinCyanIntensity": 1.0,
    "hallAmbient": 0.2,
    "breathingPhase": null,
    "blinkChannel": null,
    "visemeChannel": null
  },
  "stateTriggers": {
    "speaking": "silhouetteVisibility jitters ±0.05 at phoneme peaks; no mouth",
    "verdictPronounced": "verdictState ramps over 2s to target",
    "idle": "coffin intensities slow-drift at 12s period"
  }
}
```

---

### 2H — CADES

Canon clarification: CADES is both an **acronym organization** in-fiction and a recurring on-screen NPC form — the Panopticon's internal signals/monitoring entity that surfaces as scattered broadcast moments. Existing client components (`CADESConspiracyBoard.tsx`, `CADESFeed.tsx`, `CADESClueBoard.tsx`, `CADESAmbientLines.tsx`) treat CADES as a glitchy CRT-broadcast presence, not a humanoid.

**Critical rigging:** CADES has no body. His "portrait" is a corrupted CRT broadcast feed. Track D routes his VO through a CRT-distortion audio visualizer. No breathing, no blink, no visemes in the traditional sense — instead, the broadcast frame glitches more intensely on phoneme peaks.

Reference: `apps/client/public/references/npcs/cades/REFERENCE.md`.

#### 2H.1 — Bundle A (modified): CRT broadcast frame

> A heavily glitched CRT monitor screen, 1024×1536 portrait orientation, filling a dark terminal chamber. The screen's content: a PARTIAL face — fragments of human facial features visible in unstable flicker, never resolving to a complete portrait. Eyes visible mid-screen (pale, unblinking, slightly wrong spacing), lower face fragmenting into static, upper forehead replaced by scrolling alphanumeric code rows. Color palette: phosphor green (#2dd45a) dominant for the face fragments, magenta (#e040fb) for chromatic-aberration bleed along edges, amber (#d4a04a) for urgent-alert highlights, deep black for CRT void between scan lines. Heavy horizontal scan-line texture across the entire frame (60% opacity). A single bright vertical tracking-bar slowly descending through the frame. Noise texture: analog VHS-grade static peppering the image at 15% density. In the corner of the broadcast frame: a timestamp ticker glitching between values (render as random corrupted numerals — never a stable readable time). Backdrop: a dark terminal chamber with faint console-lights bleeding around the edges of the monitor housing. The CRT monitor itself is a boxy steel-framed unit (#3a3d42), scratches visible. Film grain blended with CRT noise. 4K. No rendered text other than the glitching timestamp.

#### 2H.2 — Bundles B, C — NOT GENERATED

> Skip traditional breathing + blink. CADES instead uses a `glitchDensity` uniform on a continuous 0.0–0.3 idle loop; phoneme peaks spike it to 0.8 momentarily.

#### 2H.3 — Bundle D (modified): 15 glitch-signature frames

> A 15-panel reference sheet of the same CRT broadcast frame at different phoneme-driven glitch intensities. For each of the 15 viseme labels (SIL, AA, AE, AH, AO, etc.), render a corresponding frame where the broadcast distortion corresponds to mouth openness:
> - SIL: baseline distortion (15% noise, calm scan-lines, readable partial face)
> - Strong-open vowels (AA, AO, OW): max distortion (70% noise, face fragment completely dissolves into static, vertical tracking-bar accelerated, chromatic aberration doubled)
> - Soft consonants (B_M_P, F_V): minimal distortion (20% noise, face fragment briefly fully resolves for a single frame — the viewer gets a split-second clear read of his actual face, which is NOT a human — it's a composite of dozens of faces averaged into one uncanny non-face).
> The 15-panel sheet is effectively a distortion-intensity-vs-phoneme keyframe bank. Runtime crossfades between them based on Track D timeline. 4K.

#### 2H.4 — Bundle E (modified): Broadcast-state variants (5)

> 5 CRT frames corresponding to standard expression tags:
> 1. SPEAKING — mid-glitch, partial face legible, tracking-bar active.
> 2. CONCERNED — distortion calms briefly to 10% noise, face fragment momentarily stabilizes, scan-lines slow. Unsettling — a broadcast that has noticed something.
> 3. EMOTIONAL1 (surveillance) — all four corners of the frame pulse with small red "REC" indicators (no text, just the color pattern suggesting it), broadcast feels outward-facing (watching).
> 4. EMOTIONAL2 (signal-loss) — the face fragment FULLY dissolves into pure static, 100% noise, broadcast effectively gone, a single faint horizontal line visible at mid-screen (the signal trying to return).
> 5. REVEALING — the broadcast briefly stabilizes for a single canonical frame: the full "composite-of-dozens-of-faces" non-face is visible in clean high-fidelity green phosphor, direct gaze to camera. Reserved for a specific plot-reveal beat — CADES showing you who's been watching all along.
> 4K.

#### 2H.5 — Bundle F: CRT glitch texture atlas

> **Output:** `apps/client/public/vfx-atlases/cades_{static_noise,scanlines,tracking_bar,chromatic_bleed}.png` — each 2048×2048.

> Four tiling textures:
> - **STATIC_NOISE:** full-frame analog VHS-grade noise pattern, black-to-white grain, used as overlay.
> - **SCANLINES:** horizontal scanline pattern, green phosphor tinted, standard tiling strip.
> - **TRACKING_BAR:** a single vertical bright horizontal bar with soft falloff, used as moving overlay at y-offset.
> - **CHROMATIC_BLEED:** R/G/B channel separation mask for edge fringing, radial gradient intensified at frame edges.

#### 2H.6 — Shader uniform block

```json
{
  "rigId": "npc_cades",
  "shaderProgram": "CRTBroadcastPortrait",
  "uniforms": {
    "glitchDensity": 0.15,
    "staticNoiseTexture": "vfx-atlases/cades_static_noise.png",
    "scanlineTexture": "vfx-atlases/cades_scanlines.png",
    "trackingBarY": "auto:drift",
    "chromaticBleed": 0.3,
    "faceResolution": 0.4,
    "phosphorColor": "#2dd45a",
    "breathingPhase": null
  },
  "stateTriggers": {
    "speaking": "glitchDensity ramps with phoneme intensity; faceResolution inversely",
    "revealing": "glitchDensity=0; faceResolution=1.0 for 800ms hold",
    "signalLoss": "glitchDensity=1.0; faceResolution=0"
  }
}
```

---

### 2I — THE COLLECTOR (COREY)

Canon anchor: `docs/production/act1-asset-build/prompts/matchups/little-collector.txt` + `act1_art_prompts__opponent_portrait.csv:portrait_corey_collector`. A 7-year-old boy, sweet button-up sage-green shirt, neat side-parted hair, clasping a smoky glass mason jar at his chest that glows with trapped iridescent shimmer. Not a bully — a hoarder in the making. The sweetness is the menace.

Reference: `apps/client/public/references/npcs/collector/REFERENCE.md`.

#### 2I.1 — Bundle A: Neutral bust

> Three-quarter bust portrait of a seven-year-old boy, innocent face, fair skin, medium-brown hair parted neatly to the side (over-combed for a child his age), clean-cut bangs. Earnest direct gaze, a sweet half-smile that is — on a second look — decided. He has already chosen to keep something that isn't his. Wearing a tidy button-up shirt in soft sage-green (#7ba67a) with the top button fastened, an overly-grown-up collar for his small frame. Both small hands clasped around a smoky glass mason jar (#f0ede8 translucent glass, fogged from the inside) held protectively at his chest — the jar roughly the size of his clasped hands. Inside the jar: a faint iridescent golden shimmer (#d4a04a with prismatic highlights) suggesting trapped emotions, NOT distinct creatures — ambiguous captured light. Backdrop: defocused classroom with warm afternoon window-light bokeh (honey #d9a66a), sunlight catching the jar glass and making the trapped shimmer glow golden. Key light: warm yellow window-sun from camera-right, catching his face and the jar. Fill: warm amber bounce. Soft film grain. 4K. No rendered text.

#### 2I.2 — Bundle B: Breathing loop (8 frames)

> 8-frame standard chest cycle (1.000 to 1.008 peak). The mason jar rises and falls with his chest — held tightly. Inside the jar, the iridescent shimmer pulses in counter-phase with his breathing (exhale brightens shimmer, inhale dims it) — the trapped emotions respond to him. 8 PNGs.

#### 2I.3 — Bundle C: Blink triptych

Standard. The sweet-menace read is strongest when the eyes are OPEN — eyelash sharp, catchlight clear. On CLOSED frames, a brief flicker of the jar's shimmer brightens 20% (the trapped thing notices when he isn't looking).

#### 2I.4 — Bundle D: Viseme grid

Standard 15-panel sheet, tight crop, child's lip tone and size. Small mouth — visemes read at ~60% of adult-scale openness by anatomy.

#### 2I.5 — Bundle E: Expressions (5)

> 1. SPEAKING — child's direct earnestness, jar held steady.
> 2. CONCERNED — small pout-downturn, eyes wide, head tilted.
> 3. EMOTIONAL1 (delighted-wrong) — broad child's smile that reaches the eyes, jar shimmer INTENSIFIES 2× baseline. He just added to the collection.
> 4. EMOTIONAL2 (protective) — jar pulled tighter to his chest, shoulders curl forward 3°, eyes narrow with child's possessiveness. The sweet mask slips by 5%.
> 5. REVEALING — he looks down at the jar and then back up to camera slowly, eyes now DIRECT and adult-serious (impossible on a 7-year-old's face), mouth closed. The shimmer inside the jar dims — he is no longer performing for the jar. This is the Archon beneath the child.

#### 2I.6 — Bundle F: Jar-shimmer VFX overlay

> **Output:** `apps/client/public/vfx-atlases/collector_jar_shimmer.png` — 512×512 transparent. A soft golden iridescent cloud confined to a ~380px circular region matching the jar's interior. Cloud structure: layered soft gaussian clouds in warm gold (#d4a04a to #f5d98a) with subtle prismatic rainbow hints at the edges (thin rings of magenta/cyan). Particle-like emberwisps distributed in the cloud, each 3-8px, slightly varying opacity. Outside the 380px circle: transparent. Used as animated pulse overlay inside the mason-jar geometry.

#### 2I.7 — Shader uniform block

```json
{
  "rigId": "npc_collector_corey",
  "shaderProgram": "ChildPortraitWithProp",
  "uniforms": {
    "jarShimmerIntensity": 0.6,
    "jarShimmerTexture": "vfx-atlases/collector_jar_shimmer.png",
    "shimmerBreathCounterPhase": true,
    "breathingPhase": "autoLoop:3.2s"
  },
  "stateTriggers": {
    "collectingEmotion": "jarShimmerIntensity=2.0 for 600ms then settle to 1.1",
    "archonRevealed": "jarShimmerIntensity=0.2; eyeIntensity=adult"
  }
}
```

---

### 2J — THE DEGEN (11TH NE-YON, CASINO HOST)

Canon anchor: `docs/production/SHIP_READY_ASSET_BIBLE.md` CIN-013 + `CASINO_EXPANSION_ART_BIBLE.md`. Genderfluid mid-thirties figure in a half-violet-sequin / half-cloth-of-gold tailored suit, one gold eye + one violet eye, wild theatrical grin, standing in a deep-space casino pit with nebula skylight. Carnival-barker energy. Entropy embodied.

Reference: `apps/client/public/references/npcs/degen/REFERENCE.md`.

#### 2J.1 — Bundle A: Neutral bust

> Three-quarter bust portrait of a genderfluid figure in their mid-thirties, androgynous striking features, medium-brown skin with a subtle sheen (slight sweat-glow — they burn hot). Wild dark hair styled in an extravagant asymmetric sweep — one side slicked up and back, the other side falling in loose waves across the forehead. Wearing the iconic split suit: the LEFT half (viewer's left / subject's right) is dense violet sequins (#e040fb, each sequin catching highlight as a tiny specular pinpoint); the RIGHT half (viewer's right / subject's left) is smooth cloth-of-gold (#fbbf24, rich warm metallic weave with fine thread detail). The split runs cleanly vertical down the center of the suit — chest, lapels, one shoulder sequin one shoulder gold. Beneath the suit: a crisp black silk shirt, collar open showing a single thin gold chain. Theatrical wide grin — mouth open, teeth showing, genuine delight. EYES: one gold (#d4a04a emissive, warm pupil-glow) and one violet (#e040fb emissive, slit-pupil narrowed), set in heterochromic asymmetry. Earrings: one gold stud, one violet crystal drop. Backdrop: defocused deep-space casino pit — circular black-velvet roulette pit edge visible in the lower bokeh, purple-and-gold neon perimeter lighting, a massive transparent dome ceiling with actual nebula visible above (blue-violet gas clouds, distant stars). Heavy anamorphic lens flares where neon meets edges. Volumetric neon haze in the foreground. Film grain. 4K. No rendered text.

#### 2J.2 — Bundle B: Breathing loop (8 frames)

> Standard 8-frame cycle but with elevated amplitude (1.000 to 1.012 peak — he breathes BIG; he's a carnival barker). Sequins on the left shift subtly between frames as each individual sequin catches light at different angles (simulate at render time with subtle ±2° rotation per sequin). Gold side cloth unchanged. Hair drifts ±1.5px. Grin held across all 8 frames (never fully closes).

#### 2J.3 — Bundle C: Blink triptych

> Standard. On CLOSED frame, the violet eye-slit emissive dims dramatically to 10% while the gold eye emissive stays at 80% — his eyes don't blink together. Always asymmetric.

#### 2J.4 — Bundle D: Viseme grid

Standard 15-panel. Grin is the baseline — even SIL viseme shows teeth visible, lips slightly parted. Visemes exaggerate upward from there.

#### 2J.5 — Bundle E: Expressions (5)

> 1. SPEAKING — theatrical over-projected, jaw dropped wider than necessary for phonemes.
> 2. CONCERNED — rare; grin narrows but doesn't vanish, eye-asymmetry flips (gold eye slit-narrows; violet eye widens).
> 3. EMOTIONAL1 (house-wins) — mouth opens in a WIDE bark of laughter (teeth fully exposed, head thrown back 8°), both eyes blaze 1.5× brighter. The casino just took something from someone.
> 4. EMOTIONAL2 (predator-reveal) — rare; the theatrical grin stays but the eyes go DEAD — emissive drops to 20%, pupils contract to points. One terrifying frame where the performance pauses and the entropy-god beneath is visible.
> 5. REVEALING — a full tarot-card card flourish mid-gesture; a single holographic card held face-up at the subject's right hand in-frame, showing the abstract "Universe" arcana (render as a stylized galaxy card-face), gold & violet neon rim light bathes the card. The Degen's smile is softer here, knowing.
> 4K. No rendered text on card.

#### 2J.6 — Bundle F: Sequin + eye-asymmetry overlay

> **Output:** `apps/client/public/vfx-atlases/degen_{sequin_glint,eye_violet,eye_gold}.png`.
> - **sequin_glint:** a tiling texture of randomized bright pinpoint sparkles (4-12px) on transparent background, purple-violet tint — used as overlay on the sequin half for animated glint.
> - **eye_violet:** 256×256 radial violet emissive texture with slit-pupil mask.
> - **eye_gold:** 256×256 radial gold emissive texture with round-pupil mask.

#### 2J.7 — Shader uniform block

```json
{
  "rigId": "npc_degen",
  "shaderProgram": "DualNeonEntropyPortrait",
  "uniforms": {
    "sequinGlintRate": 0.6,
    "eyeGoldEmissive": 0.8,
    "eyeVioletEmissive": 0.8,
    "eyeAsymmetry": 1.0,
    "neonAmbient": "#e040fb + #fbbf24 mix",
    "breathingPhase": "autoLoop:3.2s:amp=1.012"
  },
  "stateTriggers": {
    "housewins": "eyeEmissive both=1.5x for 1.2s",
    "predatorReveal": "eyeEmissive both=0.2x for 400ms pupils contract",
    "casinoVeoLoop": "playVideo:entity_99_degen.mp4 as discovery intro"
  }
}
```

---

### 2K — EIDOLA (PROFESSOR EIDOLA, MECHRONIS ETHICS)

Canon anchor: `docs/production/act1-asset-build/prompts/matchups/professor-eidola.txt`. Early-fifties ethics professor, charcoal-grey academic robe with silver piping + ethics-department sigil, silver-streaked black hair short and parted, reading glasses PUSHED UP INTO HAIR (not worn), asymmetric face (one brow lifted, one mouth-corner softened), tired-but-kind direct gaze. Chalk dust on left sleeve.

Reference: `apps/client/public/references/npcs/eidola/REFERENCE.md`.

#### 2K.1 — Bundle A: Neutral bust

> Three-quarter bust portrait of a woman in her early fifties, Mediterranean features, weathered-beautiful face with unmistakable asymmetry — one eyebrow naturally sits 3° higher than the other, one corner of her mouth softens more than the other. Direct gaze to camera: tired (she has made this assessment a thousand times), kind (she has not stopped caring). Skin warm medium, fine laugh-lines at eye corners. Silver-streaked black hair (#2a2a2d with #a6a6a6 streaks) cut short and neat, parted to her left side. Reading glasses pushed UP into the hair at her crown (thin silver wire frames, clear lenses). A single chalk-dust smudge on her left sleeve. Wearing a long charcoal-grey wool academic robe (#3a3d42) with narrow silver piping along the lapel and a single embroidered ethics-department sigil at the collar (geometric pattern, no rendered letters). Under the robe, a plain dark high-collared blouse. Both hands folded on a surface-edge in the lower frame over a closed matte-cream folder. Backdrop: defocused academic atrium — pale cyan institutional ambient (#4ba3b5), polished brass (#b8752d) on a table edge, a warm sun-shaft falling across her hands from camera-right window. Palette balance: cyan dominant on robe shadows, brass accent, warm sun on hands, silver-grey in hair. Film grain. 4K. No rendered text.

#### 2K.2 — Bundle B: Breathing loop (8 frames)

> Standard chest cycle (1.000 to 1.006 peak — moderate, she's relaxed but upright). Robe folds unchanged. Reading glasses in hair UNCHANGED. Chalk-dust smudge UNCHANGED. Hair drift ±0.4px only — her hair is recently combed.

#### 2K.3 — Bundle C: Blink triptych

Standard. On CLOSED frame, the laugh-line creases at the outer eye corners deepen visibly — she blinks with her whole face.

#### 2K.4 — Bundle D: Viseme grid

Standard 15-panel, natural asymmetry preserved across all frames (one mouth-corner consistently softer).

#### 2K.5 — Bundle E: Expressions (5)

> 1. SPEAKING — mid-syllable, one corner of mouth slightly higher than the other, natural asymmetric speech pattern.
> 2. CONCERNED — asymmetric brow knit (one brow pulls down more than the other), mouth tight, eyes soften — worried for, not worried about.
> 3. EMOTIONAL1 (wry-teaching) — one brow lifted 5° higher (the natural-high brow), half-smile at the soft-corner, eyes direct. Her default teaching face.
> 4. EMOTIONAL2 (disappointed) — both brows lower, mouth flat, eyes hold direct without warmth. Rare and devastating — she has made her assessment and it was not what she hoped.
> 5. REVEALING — reading glasses come DOWN onto her face for the first time in the rig set, mouth parts pre-speech, eyes wet at the inner corners (a single catchlight suggesting tears). She has chosen to write a word you CAN read. Reserved for the pivotal assessment beat.

#### 2K.6 — Bundle F: None required.

#### 2K.7 — Shader uniform block

```json
{
  "rigId": "npc_eidola",
  "shaderProgram": "AsymmetricAcademicPortrait",
  "uniforms": {
    "facialAsymmetry": 0.35,
    "glassesOnFace": false,
    "chalkDustVisible": true,
    "academicAmbientCyan": 0.55,
    "breathingPhase": "autoLoop:3.2s:amp=1.006"
  },
  "stateTriggers": {
    "wryTeaching": "asymmetry=0.5",
    "revealing": "glassesOnFace=true for line",
    "disappointed": "facialAsymmetry=0.1 (uncharacteristic symmetry)"
  }
}
```

---

### 2L — THE GAMEMASTER (PRE-SPLIT FORM)

Canon anchor: `docs/production/act1-asset-build/prompts/matchups/game-master-original.txt`. Thin man, early fifties, tailored Empire legal-black suit, thin black hair combed flat and receding, clean-shaven. **Single conventional pair of wire-rimmed spectacles** (pre-split — both lenses in one frame). Measured prosecutor neutrality. Hard clinical white panel light.

"Remember his face. This is the last time he is one person."

Reference: `apps/client/public/references/npcs/gamemaster/REFERENCE.md`.

#### 2L.1 — Bundle A: Neutral bust

> Three-quarter bust portrait of a thin man, early fifties, angular scholarly features, measured neutral expression — no hostility, no smugness, no warmth. The specific professional composure of a prosecutor who has decided the outcome long before procedure begins. Hair thin, black (#1c1a1d), combed flat, receding hairline at the temples. Clean-shaven, pale skin with slight unhealthy pallor. Eyes: dark brown (#2a2318), direct to camera, unhurried, unreadable. Wearing a tailored Empire legal-black suit (#0a0a0c matte obsidian wool, no lapel insignia, no tie) with a plain high-collared white shirt (#e8e8e8) buttoned fully to the throat. Wire-rimmed spectacles: thin slim dark silver frames (#a8a8ac), TWO LENSES IN ONE CONVENTIONAL FRAME — clear glass, eyes fully visible through them, not obscured. **Critical: single frame, not the later two-eyepiece Left/Right configuration.** Hands (if visible at edge of frame): flat, palms down, fingers unnaturally still. Backdrop: defocused institutional grey cell chamber, hard clinical white (#e8e8e8) panel-light cone from above cast hard down on face and hands, deep shadow (#2a2a2d) at the frame edges and on the suit. No brass, no warm light of any kind, no cyan — the only color temperature is the panel light's clinical white. Thin silver glint on the spectacle frames. Mouth closed, neutral, completely still. Film grain. 4K. No rendered text.

#### 2L.2 — Bundle B: Breathing loop (8 frames)

> Shallow breathing (1.000 to 1.003 peak — he is still, deliberate). Hands (if in frame) UNCHANGED across all 8 frames — they are unnaturally motionless. Hair UNCHANGED. Spectacles UNCHANGED. Only the chest/shoulders breathe minimally.

#### 2L.3 — Bundle C: Blink triptych

Standard, but with one subtle detail: on the HALF frame, the spectacles' lenses catch a hard highlight briefly (the overhead panel-light glints off the glass during the blink — the viewer's eye is drawn to the lenses for a split second, reinforcing "there are still two lenses here"). This is a foreshadowing tell for Act 2's split.

#### 2L.4 — Bundle D: Viseme grid

Standard 15-panel. Small measured mouth movements — his visemes read at ~70% of typical openness. He speaks economically.

#### 2L.5 — Bundle E: Expressions (5)

> 1. SPEAKING — minimal mouth motion, eyes locked, head unmoving.
> 2. CONCERNED — NOT genuine concern; the brows furrow with professional registration of a complication, nothing more.
> 3. EMOTIONAL1 (procedural-pleased) — the faintest possible uptick at one mouth corner (2mm). Not a smile — a checkmark.
> 4. EMOTIONAL2 (about-to-split) — a SINGLE reserved frame: the spectacles show a hairline vertical fracture running down the center of the frame between the two lenses. He has not noticed. The viewer does. Foreshadowing only — never played in Act 1, available for Act 2 transition moment.
> 5. REVEALING — head tilts 3° in analytical curiosity, spectacles catch light fully (both lenses shine), a precise smile that tells the player they have been understood exactly and there is no escape. Reserved for his verdict beats.

#### 2L.6 — Bundle F: Spectacle glint overlay

> **Output:** `apps/client/public/vfx-atlases/gamemaster_spectacle_glint.png` — 512×256, transparent.

> Two rectangular bright-white glint patterns matching the spectacles' lens positions, soft gaussian falloff, pure white at center fading to transparent. Used as animated specular overlay triggered during blinks and at emphasis beats. When the lenses split in Act 2, this atlas gets paired with a split variant.

#### 2L.7 — Shader uniform block

```json
{
  "rigId": "npc_gamemaster_pre_split",
  "shaderProgram": "ClinicalProcedurePortrait",
  "uniforms": {
    "spectacleGlintIntensity": 0.3,
    "spectacleSplitProgress": 0.0,
    "clinicalWhiteKey": "#e8e8e8",
    "handMotionLock": true,
    "breathingPhase": "autoLoop:3.2s:amp=1.003"
  },
  "stateTriggers": {
    "verdict": "spectacleGlintIntensity=1.0 for 1s",
    "preActTwoForeshadow": "expression=EMOTIONAL2 (hairline fracture visible)",
    "actTwoTransitionTrigger": "spectacleSplitProgress ramps 0.0→1.0 over cinematic"
  }
}
```

---

### 2M — MATRIKALA (PROFESSOR MATRIKALA, MECHRONIS REACTOR MENTOR)

Canon anchor: `docs/production/act1-asset-build/prompts/matchups/professor-matrikala.txt`. Early sixties, workshop-mentor energy, oxide-red canvas coveralls (NOT the academic robe), sleeves rolled, short silver-grey hair, warm weathered face. Hands are the portrait's subject weight — knuckled, scarred, callused. Brass reactor coupling on the table as prop. She will teach you to hear the reactor hum.

Reference: `apps/client/public/references/npcs/matrikala/REFERENCE.md`.

#### 2M.1 — Bundle A: Neutral bust

> Three-quarter bust portrait of a woman in her early sixties, South-Asian features, weathered warm face, bright attentive eyes — a professor who has spent her life teaching the same thing and is still delighted every time a student finally hears it. Body-language: leaning FORWARD, forearms on a surface in the lower frame, workshop-mentor rather than formal examiner. Wearing warm oxide-red canvas coveralls (#c66b3d, heavy work canvas, visible weave), sleeves rolled to the elbows revealing strong scarred forearms, collar open. A single polished brass Academy pin (#b8752d) holds the coverall collar closed at the throat — faculty status in miniature. NO academic robe. Hands are the compositional weight: bare, strong, knuckled, a web of fine scars and callus patterns covering the backs and palms. Short silver-grey hair (#a6a6a6), practical cut. Reading glasses on a brass chain around her neck, NOT worn. On the surface beside her elbow: a half-disassembled brass reactor coupling (#b8752d polished brass, intricate inner calibration ring visible, partly exposed), with fine needle-point calipers resting across it. Backdrop: defocused atrium with a small tool-rack visible behind her (her workshop spilling into the formal room). Lighting: warm sun-shaft falls full across the coupling and her hands (camera-right window), cyan atrium ambient lights her face. Hands and work get the warm light; her face gets the cool. Palette: cyan #4ba3b5 ambient, oxide-red #c66b3d coveralls, brass #b8752d (pin, coupling, calipers, table edge), warm sun #f5d98a on hands and coupling, amber-undertone skin. Film grain. 4K. No rendered text.

#### 2M.2 — Bundle B: Breathing loop (8 frames)

> Standard chest cycle (1.000 to 1.007 peak). Brass pin at throat catches slightly shifted highlight across the 8 frames (subtle light-play). The forearm muscles flex subtly on the leaning-forward pose. Hair UNCHANGED. Reactor coupling in foreground UNCHANGED (it is not alive).

#### 2M.3 — Bundle C: Blink triptych

Standard. Her eyes have lived in dust and sparks — on CLOSED frame, render a faint crease pattern from long squinting-at-work. Catchlights on OPEN warm.

#### 2M.4 — Bundle D: Viseme grid

Standard 15-panel. Her mouth readily opens — she is a teacher used to projecting across a workshop. Visemes read at 110% of baseline openness.

#### 2M.5 — Bundle E: Expressions (5)

> 1. SPEAKING — head tilts 4° toward the listener (she leans in when she speaks), hands gesture forward toward the coupling (one finger extended pointing-indicating).
> 2. CONCERNED — brows knit, eyes drop to the coupling on the table, lips tight. She is diagnosing a problem with the hardware, not you.
> 3. EMOTIONAL1 (delighted) — a broad warm smile that shows teeth, laugh-lines deepen, eyes crinkle. When a student finally hears the reactor hum.
> 4. EMOTIONAL2 (disappointed-tender) — mouth gently closes, eyes search the student's face, shoulders settle back. A disappointment that is also care.
> 5. REVEALING — she picks up the coupling in her scarred hands, holds it up toward the camera, and her expression opens into an unguarded "look" — mouth slightly parted, eyes shining, offering. The tool is the teaching; the teaching is the gift.

#### 2M.6 — Bundle F: Coupling glow overlay

> **Output:** `apps/client/public/vfx-atlases/matrikala_coupling_glow.png` — 512×512 transparent. A soft warm amber emissive texture masked to a brass reactor coupling silhouette. Inner calibration ring emits a subtle cyan glow. Used as animated overlay on the coupling prop during REVEALING and during the reactor-hum teaching beats.

#### 2M.7 — Shader uniform block

```json
{
  "rigId": "npc_matrikala",
  "shaderProgram": "WorkshopMentorPortrait",
  "uniforms": {
    "couplingGlowIntensity": 0.4,
    "couplingGlowTexture": "vfx-atlases/matrikala_coupling_glow.png",
    "warmHandLight": 0.8,
    "coolFaceLight": 0.6,
    "breathingPhase": "autoLoop:3.2s:amp=1.007"
  },
  "stateTriggers": {
    "teaching": "couplingGlowIntensity=0.8; hand gesture toward it",
    "revealing": "coupling lifted in frame; couplingGlowIntensity=1.2"
  }
}
```

---

### 2N — THE MEME (MINNIE THE MEME, FIRST FORM)

Canon anchor: `docs/production/act1-asset-build/prompts/matchups/little-meme.txt` + `act1_art_prompts__opponent_portrait.csv:portrait_minnie_meme`. Seven-year-old girl in a pastel sundress and black plastic headband with felt-covered Minnie Mouse ears (worn earnestly, not ironically), short dark-brown hair under the headband, mid-chant expression with lips parted between syllables. Eyes locked at camera — certain. Archon of the Meme in a child's body.

Reference: `apps/client/public/references/npcs/meme/REFERENCE.md`.

#### 2N.1 — Bundle A: Neutral bust

> Three-quarter bust portrait of a seven-year-old girl, sweet round face, dark-brown hair under a black plastic headband with two round felt-covered Minnie Mouse ears (Disney-theme-park-souvenir style, earnest not ironic wear), bare knees implied below frame. Skin fair, light freckles across nose bridge. Eyes: rich warm brown (#4a3828), locked directly at camera with unnatural certainty for a child her age — not shy, not cruel, just CERTAIN. Mouth closed with lips slightly parted (she is always about to chant). Wearing a plain pastel sundress in soft pink (#fbc4c4) with a thin white lace trim at the collar. One hand flat on a surface-edge in lower frame (fingers splayed over an imaginary card), the other half-raised pointing index finger extended as if tracking something the viewer cannot yet see. Backdrop: softly defocused classroom interior with a honey-oak card-table surface in the lower third empty for UI overlay — warm-yellow window sun from camera-right striping her left cheek and the table surface. Palette: honey #d9a66a dominant (table and warm-sun bounce), dusty rose #c98b8b accent, warm sunlight #f5d98a on skin. Soft film grain. 4K. No rendered text.

#### 2N.2 — Bundle B: Breathing loop (8 frames)

> Standard child-scale chest cycle (1.000 to 1.008 peak). The Minnie ears (rigid plastic) DO NOT MOVE with her breathing — they're a fixed accessory. Headband UNCHANGED. Pointing index finger UNCHANGED (she holds that gesture). 8 PNGs.

#### 2N.3 — Bundle C: Blink triptych

Standard. But add a rare CLOSED variant: every ~10 blinks, her closed frame shows one of the Minnie ears has subtly MOVED 2px (impossible — the headband is rigid). When she opens her eyes, the ear is back in place. Subliminal wrongness.

#### 2N.4 — Bundle D: Viseme grid

Standard 15-panel sheet, child-scale mouth (~60% of adult openness). But on the viseme for the vowel "AH" specifically: the mouth opens WIDER than physically expected for her small face (an Archon's cadence in a child's throat). That one viseme runs at 120% of expected scale — reserved for when she chants.

#### 2N.5 — Bundle E: Expressions (5)

> 1. SPEAKING — mid-chant lips mid-syllable, eyes locked, finger still pointing. She does not break the chant pattern.
> 2. CONCERNED — a momentary child's pout that does NOT reach her eyes. Performed concern.
> 3. EMOTIONAL1 (viral-spread) — broadest delighted child-grin, eyes wide, the chant has taken hold. The room around her has subtly blurred more than it was — the meme is working.
> 4. EMOTIONAL2 (archon-visible) — one frame: the child's face stays child-shaped but her eyes go ADULT-KNOWING, direct, uncanny. Four thousand years old in a kid's face.
> 5. REVEALING — both hands come up clapping at head-height (the chant is the gesture), mouth wide open mid-shout, eyes closed in delight. Contagious. The viewer almost joins in.

#### 2N.6 — Bundle F: Chant-wave overlay (environmental)

> **Output:** `apps/client/public/vfx-atlases/meme_chant_wave.png` — 1024×1024 transparent.

> A radial texture of concentric ring-waves emanating outward from a center point, soft gaussian, warm-gold tinted (#f5d98a at inner rings fading to transparent at edges). Used as animated overlay during SPEAKING and REVEALING expressions — the meme propagates outward from her as visible faint rings. Fades in/out with phoneme intensity.

#### 2N.7 — Shader uniform block

```json
{
  "rigId": "npc_meme_minnie",
  "shaderProgram": "ChildArchonPortrait",
  "uniforms": {
    "chantWaveIntensity": 0.3,
    "chantWaveTexture": "vfx-atlases/meme_chant_wave.png",
    "archonEyesVisible": false,
    "earMicroDrift": 0.02,
    "breathingPhase": "autoLoop:3.2s:amp=1.008"
  },
  "stateTriggers": {
    "chanting": "chantWaveIntensity ramps with phoneme peaks",
    "archonReveal": "archonEyesVisible=true for 600ms single-frame hold",
    "viralSpread": "chantWaveIntensity=1.0; backdrop blur +30%"
  }
}
```

---

### 2O — THE NECROMANCER

Canon anchor: `apps/shared/characterVisualDNA.ts` (id: "necromancer"). Anomaly species, gaunt-ageless, ashen skin (#c4c0b8), long white hair that trails downward as if underwater, milk-white eyes with no pupils occasionally showing faces of the dead through them, sunken cheeks, death-mask porcelain stillness, burial-ink sigils on forehead. Funeral-black tattered robes. Floats low to the ground rather than walks.

Reference: `apps/client/public/references/npcs/necromancer/REFERENCE.md`.

**Critical rigging note:** The Necromancer floats — no shoulder weight. In the bust frame, his shoulders sit higher than gravity would allow for a standing human. Breathing amplitude is near-zero (the dead don't breathe much); aliveness carried by hair-drift and eye-face overlays.

#### 2O.1 — Bundle A: Neutral bust

> Three-quarter bust portrait of a gaunt ageless figure, skin ashen pale with a faint greyish undertone (#c4c0b8), porcelain death-mask stillness — an unearthly smoothness as if the face is slightly too flawless. Sunken cheeks, hollow cheekbones cast soft shadow. Hair: long, straight, pure white (#f0ede8), shoulder-length, drifting DOWNWARD AS IF UNDERWATER — individual strands splay outward slightly as if suspended in a medium denser than air. Eyes: milk-white, NO pupils, just opaque white orbs with a faint luminous core. Forehead bears burial-ink sigils: three small geometric glyphs in deep black (#0a0a0a), horizontally spaced across the brow — funeral marks. Wearing funeral-black tattered robes (#1a1d1f deep charcoal, fabric frayed at the edges, multiple overlapping layers of torn cloth). Backdrop: defocused ancient crypt — pale violet void with faint drifting motes of ash, a distant suggestion of stone archways, no warm light. Shoulders sit unnaturally HIGH — he is not standing, he is suspended. Rim light: faint cool violet from behind, no warm fill. Mouth closed in porcelain stillness. Film grain. 4K. No rendered text.

#### 2O.2 — Bundle B: Breathing loop (8 frames)

> Minimal chest motion (1.000 to 1.001 peak — nearly zero). The hair is the motion carrier: individual strands drift in slow suspended-medium motion, ±4px across the 8-frame cycle, with distinct wave patterns (strands move in slow sine waves). Robe layers drift subtly (±1px). Shoulders UNCHANGED (he is not standing). 8 PNGs.

#### 2O.3 — Bundle C: Blink triptych

> Standard 3 frames. BUT: every ~5 blinks, on a CLOSED frame, a faint FACE-OF-THE-DEAD texture overlays the closed eyelids — a suggestion of another person's features visible through his eyelids. Render this variant as a separate rare CLOSED file (`closed_face_variant.png`). 4 total PNGs for this bundle.

#### 2O.4 — Bundle D: Viseme grid

> Standard 15-panel. Lips pale (#b0a8a8), almost colorless. Mouth movement is SLOW in runtime — viseme transitions at 60% standard speed. His speech is measured like a eulogy.

#### 2O.5 — Bundle E: Expressions (5)

> 1. SPEAKING — minimal movement, lips barely parted on consonants, only strong vowels open the mouth fully.
> 2. CONCERNED — the burial-ink sigils on the forehead DARKEN 30% (he is focused on an imminent death).
> 3. EMOTIONAL1 (welcoming-the-dead) — a gentle mortician's softening of the mouth, eyes luminous-core brightens, a single white hair strand floats OUT toward the camera rather than downward (a greeting).
> 4. EMOTIONAL2 (grief) — the hair stops drifting and falls straight DOWN as gravity returns briefly, shoulders settle to human height. For one frame he is a mortal man grieving.
> 5. REVEALING — the milk-white eyes part and show clear FACES of specific characters scrolling across the whites (abstract portrait silhouettes of ~5 known dead from the game's lore — keep them suggestive, not identifiable). Head bowed 8°, hair drifts upward toward the camera. This is the rare moment he speaks with the voices of the dead.

#### 2O.6 — Bundle F: Eye-faces overlay

> **Output:** `apps/client/public/vfx-atlases/necromancer_eye_faces.png` — 512×512 transparent.

> A subtle texture showing ghostly faces overlaid on a milk-white background. 3 to 5 very faint face silhouettes drifting across the texture, semi-transparent (10-25% opacity), desaturated. Used as scrolling overlay on the eye-whites driven by `deadFacesVisible: 0..1` uniform. Only used on REVEALING expression and occasionally on blink-closed.

#### 2O.7 — Shader uniform block

```json
{
  "rigId": "npc_necromancer",
  "shaderProgram": "UndeathFloatingPortrait",
  "uniforms": {
    "hairGravityInverted": true,
    "hairDriftAmplitude": 4.0,
    "breathingPhase": "autoLoop:3.2s:amp=1.001",
    "shoulderLiftHeight": 12,
    "deadFacesVisible": 0.0,
    "burialSigilDarkness": 0.4,
    "eyeLuminousCore": 0.5,
    "visemeSpeedMultiplier": 0.6
  },
  "stateTriggers": {
    "welcomingTheDead": "hairGravityInverted toggles for 800ms (strand drifts toward camera)",
    "grief": "hairGravityInverted=false; shoulderLiftHeight=0",
    "revealing": "deadFacesVisible=1.0; head bowed"
  }
}
```

---

### 2P — NILMORG (DMC RACE-HOST)

Canon anchor: `docs/production/SHIP_READY_ASSET_BIBLE.md` CIN-031/032. The Dead Man's Circuit kart-racing master of ceremonies. Theatrical carnival-barker with a microphone at a raised podium. Wide-brim race-flag-patterned coat, broadcast-ready showman. The prize IS the severance.

Reference: `apps/client/public/references/npcs/nilmorg/REFERENCE.md`.

#### 2P.1 — Bundle A: Neutral bust

> Three-quarter bust portrait of a theatrical showman, mid-forties, olive-skinned, sharp wolfish features. Dark hair slicked back with a pronounced widow's peak, thin dark mustache with curled waxed ends. Eyes: amber (#d4a04a) with warm crinkle at the corners — performative delight. Wearing a wide-shouldered tailored coat in checkerboard black-and-white (race-flag pattern) (#0a0a0a and #f0ede8), cut long at the lapels, broad brass buttons down the front. Underneath: a deep-red silk shirt (#a81e1e) with a high Mandarin collar and a single thin gold chain visible above the collar. Holding a chromed microphone (#c0c4cc) to his mouth at chest level (mic-head visible in frame lower-right, cord trailing offscreen). Backdrop: defocused kart-racing starting line — hazard lights (red and yellow) flare in the lower bokeh, distant cheering-crowd silhouettes in the darkness, a massive holographic countdown glyph suspended above but defocused. Palette: warm-red-yellow race lighting dominant, cool-blue edge hints, checkerboard accent. Film grain, anamorphic flares. 4K. No rendered text.

#### 2P.2 — Bundle B: Breathing loop (8 frames)

> Elevated chest amplitude (1.000 to 1.011 peak — theatrical projection). Mustache curls shift subtly on exhale (curl tightens at peak, relaxes at valley). The microphone is held STEADY — it does not move with breath. Checkerboard coat catches different-frame highlights on the black cells.

#### 2P.3 — Bundle C: Blink triptych

Standard. His eyes crinkle fully at outer corners on HALF and CLOSED — a showman's blink is always half a grin.

#### 2P.4 — Bundle D: Viseme grid

Standard 15-panel, but at 130% of baseline openness (he is OVER-projecting for the crowd). On AA and OW visemes his mouth approaches impossible theatrical scale.

#### 2P.5 — Bundle E: Expressions (5)

> 1. SPEAKING — broad mouth, mustache curls pulled outward by the corners of the smile, mic at mouth.
> 2. CONCERNED — eyebrows raised theatrically high (mock-concern, not real), mouth in an O of feigned worry. He doesn't do genuine concern.
> 3. EMOTIONAL1 (showtime) — broadest grin, mouth wide, one arm extending offscreen-left (gesture implied). Crowd-rousing.
> 4. EMOTIONAL2 (winner-crowned) — a gracious smile, eyes soft-warm, head tilted slightly in approval. The moment right before the prize-severs-the-winner reveal.
> 5. REVEALING — he leans in toward camera, mic lowered from mouth, eyes sharpen from performative delight to cold assessment. The mask slips: he is NOT actually the showman. He is the Hierarchy's asset-converter. Reserved for post-race severance moment.

#### 2P.6 — Bundle F: None required. His VFX is in the cinematics (Part 9).

#### 2P.7 — Shader uniform block

```json
{
  "rigId": "npc_nilmorg",
  "shaderProgram": "TheatricalShowmanPortrait",
  "uniforms": {
    "micAlwaysAtMouth": true,
    "visemeScale": 1.3,
    "mustacheCurlTightness": 0.5,
    "raceLightingAmbient": "#d9a66a + #a81e1e + #0a0a0a checkerboard",
    "breathingPhase": "autoLoop:3.2s:amp=1.011"
  },
  "stateTriggers": {
    "showtime": "visemeScale=1.5; crowd noise ambient +20%",
    "maskSlips": "visemeScale=0.8; mic lowered; eyes cold"
  }
}
```

---

### 2Q — PALIMPSEST HOST

Canon anchor: the Palimpsest is an in-fiction episodic broadcast (game-mode `/palimpsest`) where the "casualty crawl runs backwards mid-broadcast." The Palimpsest Host is the broadcast-medium NPC who anchors each episode — a showrunner presenting from a broadcast studio set. Polished veneer, something fundamentally wrong beneath.

Reference: `apps/client/public/references/npcs/palimpsest_host/REFERENCE.md`.

**Critical rigging note:** The Palimpsest Host's broadcast frame subtly REWINDS when plot edits are in progress — background crawl text scrolls backward, fine detail deresolves, their own posture rewinds a micro-beat (head jerks back 1° then forward again in a stutter). This is the signature aliveness tell.

#### 2Q.1 — Bundle A: Neutral bust

> Three-quarter bust portrait of a composed broadcast host in their forties, ambiguous ethnicity (deliberately smoothed/generic — broadcast-appropriate), polished-camera-ready features. Hair: perfectly styled (slicked back for male presentation / neat chignon for female presentation — deliver BOTH variants, runtime picks one based on canon), artificial highlight sheen. Eyes: hazel (#8a6a3a), direct to camera, unwavering broadcast gaze. A tasteful earpiece visible in one ear (skin-tone silicone, subtle). Wearing a tailored broadcast-studio blazer in navy-charcoal (#2a2d3a) with crisp white inner collar, no tie (the open-collar anchor look), a small metallic lapel pin in brushed silver (no rendered logo — abstract geometric). Hands folded at the lower frame edge on a desktop surface. Backdrop: polished broadcast-studio set — deep indigo backdrop with a subtle large-scale logo silhouette (geometric, no legible text), soft warm key from camera-right, cool practicals along the wall, a holographic "crawl" strip running horizontally across the lower backdrop (scrolling abstract glyph shapes — NOT legible text). Lighting: broadcast-perfect three-point with warm key + cool fill + soft backlight rim. Mouth closed in a practiced neutral-ready expression — the mouth that has just finished one sentence and will start the next. Film grain, very subtle (broadcast cameras). 4K. No rendered text.

#### 2Q.2 — Bundle B: Breathing loop (8 frames) + Rewind variants

> Standard chest cycle (1.000 to 1.007 peak). Earpiece UNCHANGED. Backdrop crawl strip: across the 8 frames, the glyphs scroll LEFT normally. Hair UNCHANGED.
> **BONUS: 4 additional REWIND frames** (deliver as `breathing/rewind_01..04.png`): same subject but the backdrop crawl scrolls RIGHT (backward), and the host's head is subtly rewound 1° on frames 1–2 then forward 1° on frames 3–4 (net-zero; it's a stutter-revert). These 4 frames splice into the normal loop when narrative edits trigger.

#### 2Q.3 — Bundle C: Blink triptych + REWIND-BLINK variant

> Standard 3 frames. PLUS a rewind-blink variant: 3 additional frames where the blink plays BACKWARD (closed → half → open). Used at edit-triggered moments. 6 total PNGs.

#### 2Q.4 — Bundle D: Viseme grid

Standard 15-panel. Broadcast-ready enunciation — crisp, over-articulated at ~110% of baseline openness. The host is PAID to be intelligible.

#### 2Q.5 — Bundle E: Expressions (5)

> 1. SPEAKING — broadcast-perfect delivery, mouth crisp, eyes locked.
> 2. CONCERNED — a practiced sympathetic furrow; the brows pull together but the eyes stay bright. Performed empathy.
> 3. EMOTIONAL1 (segment-transition) — a subtle knowing smile; head tilts 2°, eyebrow raises in the "and now, something remarkable" broadcaster cadence.
> 4. EMOTIONAL2 (edit-in-progress) — the face FROZEN mid-expression with one eye half-closed and mouth slightly open, as if paused; a barely-perceptible double-exposure ghost of an ALTERNATE expression hovers 2px offset. The broadcast is being edited. Rare.
> 5. REVEALING — direct gaze, the practiced neutral drops, the mouth forms a single sentence they were not supposed to say. One frame, no theatrics. The host has broken the broadcast.

#### 2Q.6 — Bundle F: Broadcast-crawl overlay

> **Output:** `apps/client/public/vfx-atlases/palimpsest_crawl.png` — 2048×128 (wide strip), transparent.

> A horizontal strip texture of abstract glyph-shape crawl text (NOT legible letters — stylized character-like forms), 2048px wide x 128px tall, on transparent background. Characters alternate in two sizes (24px primary + 16px secondary) and drift on dark gradient backing. Used as tiling texture on the backdrop crawl strip, scrolling left at 12px/s normally, reversing direction and accelerating on edit triggers.

#### 2Q.7 — Shader uniform block

```json
{
  "rigId": "npc_palimpsest_host",
  "shaderProgram": "BroadcastHostPortrait",
  "uniforms": {
    "crawlScrollSpeed": -12,
    "crawlTexture": "vfx-atlases/palimpsest_crawl.png",
    "editInProgress": 0.0,
    "rewindAmplitude": 0.0,
    "ghostDoubleExposure": 0.0,
    "breathingPhase": "autoLoop:3.2s:amp=1.007",
    "broadcastKeyLight": 0.9
  },
  "stateTriggers": {
    "editTriggered": "crawlScrollSpeed=+18; rewindAmplitude=1.0 for 1.2s",
    "castingRewindFrames": "swap breathing frames to rewind variants",
    "brokenBroadcast": "expression=REVEALING; editInProgress=1.0 held"
  }
}
```

---

### 2R — THE PROGRAMMER (ANTIQUARIAN'S PRIOR IDENTITY)

Canon anchor: `docs/production/act1-asset-build/prompts/matchups/programmer.txt` + `antiquariansJournal.ts:662` — "I was the Programmer then, not yet the Antiquarian." Same person, earlier phase. Mid-forties, plain cold-weather travel clothing (no faction insignia), short greying-at-temples hair, trimmed salt-and-pepper beard, calm and final composure — the man who has already decided to lose.

**Critical rigging note:** This is a TWO-PHASE rig like Kael (but simpler — just two states, not three). Phase 1 is the Programmer (mid-forties, modest, calm-and-final). Phase 2 is the Antiquarian (late 50s-60s, see Part 2D). Runtime blends via `antiquarianEmergenceProgress: 0..1`. Phase 1 is default for flashback beats; Phase 2 is present-day.

Reference: `apps/client/public/references/npcs/programmer/REFERENCE.md`.

#### 2R.1 — Bundle A: Neutral bust (Programmer phase)

> Three-quarter bust portrait of a man in his mid-forties, temperate features, dark hair short and side-parted with grey streaking the temples, trimmed salt-and-pepper beard (kept neat). Eyes: dark warm brown (#2a1f1a), direct to camera, steady, warm but unbound — the specific composure of someone who has already made every decision that matters and is only waiting for the match to end. No grief, no fear. Wearing plain cold-weather travel clothing: a weather-worn dark-grey canvas coat (#6b6b65) buttoned to the throat, a simple coarse-knit wool scarf in muted ember-rust (#b85a1a) visible at the neck, fingerless work-gloves visible at the frame edges, NO FACTION INSIGNIA of any kind. Over his shoulder in the deep background: a canvas satchel half-packed resting on a chair, flap open with a rolled map and a small brass lockbox visible inside. A folded piece of thick paper peeks from his coat pocket (closed, creased — no rendered text). One hand flat on the surface-edge of the frame, fingers spread over a single face-up card in mid-play (card-face is stylized abstract, no rendered suit). Backdrop: defocused Nexon breach battlefield — a shattered amber-lit ruined parapet far behind, dust-brown #6b5a48 dominant, ember-orange #b85a1a rim light from distant city fires. Warm amber spotlight from camera-right falls across his face and the surface. Palette: dusky grey #6b6b65 (coat), ember-rust #b85a1a (scarf), brass #b8752d (satchel buckle), amber spotlight (face), dust-brown (backdrop). Film grain. 4K. No rendered text.

#### 2R.2 — Bundle B: Breathing loop (8 frames)

> Measured chest cycle (1.000 to 1.005 peak — contained, calm). The folded paper in his coat pocket ripples subtly across the 8 frames (the wind from the battlefield is touching it). Satchel contents UNCHANGED. Card hand UNCHANGED — he holds his hand STILL with the intentional quiet of someone not playing to win.

#### 2R.3 — Bundle C: Blink triptych

Standard. CLOSED frame: eyes close with gentle finality — the slight wetness at the inner corners visible in profile, never quite tears.

#### 2R.4 — Bundle D: Viseme grid

Standard 15-panel, mouth at 90% baseline openness (he speaks quietly, finally).

#### 2R.5 — Bundle E: Expressions (5)

> 1. SPEAKING — measured, soft, unhurried delivery.
> 2. CONCERNED — a brief break of the composure; brows pull together, mouth tightens, eyes dart to the satchel for a second. Reminded of something he's leaving behind.
> 3. EMOTIONAL1 (calm-final) — the default, at 110% intensity; mouth softens fully, eyes steady, the decision is made.
> 4. EMOTIONAL2 (grief-forward) — rare, a single frame where his composure cracks fully: eyes wet, mouth trembling, jaw held tight. The cost of what he has decided.
> 5. REVEALING — he lifts the folded paper from his pocket, holds it folded toward the camera (still closed — the content is never shown), eyes direct. This is the letter for the reader; the reveal is that it exists.

#### 2R.6 — Bundle F: Antiquarian-emergence blend overlay

> Not a standalone VFX; the blend target IS the Antiquarian's Bundle A (Part 2D). Runtime holds both Bundle A references in memory and linearly blends A→B on `antiquarianEmergenceProgress`. The two characters are canonically the same face aged ~15 years — the blend works naturally.

#### 2R.7 — Shader uniform block

```json
{
  "rigId": "npc_programmer_antiquarian",
  "shaderProgram": "PhaseBlendedPortrait",
  "uniforms": {
    "antiquarianEmergenceProgress": 0.0,
    "phase1Bundle": "portraits2d/programmer/",
    "phase2Bundle": "portraits2d/antiquarian/",
    "blendDuration": 2.0,
    "breathingPhase": "autoLoop:3.2s:amp=1.005"
  },
  "stateTriggers": {
    "flashbackProgrammer": "antiquarianEmergenceProgress=0.0",
    "presentDayAntiquarian": "antiquarianEmergenceProgress=1.0",
    "agingCinematic": "progress ramps 0.0→1.0 over 8s reveal"
  }
}
```

#### 2R.8 — Veo 3.1 cinematic pointer

- **CIN-PROG-01:** 8s aging cinematic. Start frame = Programmer mid-forties at the Nexon battlefield (Bundle A). End frame = Antiquarian mid-60s at his library lectern (Part 2D Bundle A). Scrubs `antiquarianEmergenceProgress` 0.0 → 1.0 over 8s. See Part 9.

---

### 2S — THE SEER

Canon anchor: `docs/production/act1-asset-build/prompts/matchups/seer-visit.txt` + `docs/production/ART_PRODUCTION_BIBLE.md` ("The Seer is FEMALE — beautiful blue-skinned woman, long black hair, hooded robe"). Indeterminate age (older than she looks), unbleached linen-cream robes with no institutional markings, long dark loose hair, serene-slightly-sad expression — the expression of a person remembering something that hasn't happened yet. A dark wooden staff as tall as a standing adult, subtly burnt at its lower third (memory, not prophecy).

Reference: `apps/client/public/references/npcs/seer/REFERENCE.md`.

**Critical rigging note:** The Seer's aliveness tell is a "pre-echo" — her expressions sometimes PRE-RESPOND to what the player is about to do (e.g., she smiles softly 200ms before the player clicks a dialogue option). Implemented via a `precognitionLead: 0..400ms` uniform that lets the animation state lead the player's input.

#### 2S.1 — Bundle A: Neutral bust

> Three-quarter bust portrait of a woman of indeterminate age (could read forty or seventy — canon is older than she looks), ethereal beautiful features, soft complexion with a COOL BLUE undertone (#b0c4d4 — subtle, not cartoonish; reads as "her people are adjacent to humans"). Long dark hair (near-black #1a1818) loose and flowing over one shoulder, unstyled, silken fall. Eyes: deep blue-grey (#4a5a6a) with an unusual inner stillness, soft-focused slightly beyond the camera — she is looking at where the viewer is ABOUT to be. Wearing plain traveler's robes in unbleached linen-cream (#e6dcc2) with NO institutional markings, a wide undyed flax sash loosely tied at the waist. Hands loosely clasped in her lap (not on the surface — she does not commit). Leaning against a chair to her subject-right, angled upright: a dark wooden staff tall as a standing adult (#3a2618 dark wood), worn smooth at the middle from a hand that has held it for decades, simple blunt carved sphere at the top (no ornament, no crystal, no metal). The staff's LOWER THIRD is subtly BURNT — charred, cracked, as if it has already lived through a fire that has not yet happened. Backdrop: defocused academic atrium columns, cyan institutional ambient, a pale sun-shaft from camera-right falling across the staff's burnt section and the chair beside her, illuminating the char in warm gold while leaving her face in the cool cyan. Palette: cyan #4ba3b5 ambient on her face, warm sun #f5d98a on the staff, unbleached cream #e6dcc2 robes, dark wood #3a2618. Film grain. 4K. No rendered text.

#### 2S.2 — Bundle B: Breathing loop (8 frames)

> Very slow breathing cycle — 4.8s full cycle (not 3.2s), amplitude 1.000 to 1.006. She breathes the way the ocean breathes. Hair drift ±1.2px slow. Robe folds UNCHANGED. Staff UNCHANGED (it doesn't notice her breath). 8 PNGs, but at 4.8s runtime period instead of standard 3.2s.

#### 2S.3 — Bundle C: Blink triptych

Standard. On OPEN frame, a faint shimmer overlay across the eye-whites (the tell that the eyes are seeing something beyond the immediate frame). On CLOSED frame, the lower lashes are visibly WET (the eyes water from seeing too much).

#### 2S.4 — Bundle D: Viseme grid

Standard 15-panel, at 85% baseline openness — she speaks softly, as if each word has already been said before.

#### 2S.5 — Bundle E: Expressions (5)

> 1. SPEAKING — soft, mouth barely opens, eyes continue their pre-echo off-focus gaze.
> 2. CONCERNED — she looks at you DIRECTLY for the first time in the rig (rare — her default is pre-echo); brows knit in present-moment worry. When she looks at you, she has stopped seeing ahead.
> 3. EMOTIONAL1 (resignation) — the soft sadness deepens, one hand gently unclasping from the other in her lap, head tilts 3°. She has seen this ending and is at peace.
> 4. EMOTIONAL2 (fire-memory) — her gaze drops briefly to the staff's burnt section, eyes wet. For one frame, the burnt section appears to glow faintly warm (the fire remembered as embers). Reserved for when the topic of the Prelude's staff-burn comes up.
> 5. REVEALING — she lifts her hand from her lap and PLACES it on the staff (first contact with the prop in the rig), her grip settling into the worn smooth middle section. Mouth parts pre-sentence. Eyes DIRECT at the camera for one sustained beat. She has decided to tell you what she has seen.

#### 2S.6 — Bundle F: Staff-char ember overlay

> **Output:** `apps/client/public/vfx-atlases/seer_staff_ember.png` — 512×512 transparent.

> A warm-amber emissive texture masked to a narrow vertical band (the staff's lower third silhouette). Ember-glow at 40% opacity, hot core at 20%, radial falloff to transparent at 80% edge. Used as animated overlay when the fire-memory is active. Subtle — barely visible without triggering.

#### 2S.7 — Shader uniform block

```json
{
  "rigId": "npc_seer",
  "shaderProgram": "PrecognitionPortrait",
  "uniforms": {
    "precognitionLead": 200,
    "staffEmberIntensity": 0.0,
    "staffEmberTexture": "vfx-atlases/seer_staff_ember.png",
    "eyeShimmerAlways": 0.2,
    "gazeOffsetFromCamera": 8,
    "breathingPeriod": 4.8,
    "breathingPhase": "autoLoop:4.8s:amp=1.006"
  },
  "stateTriggers": {
    "directContact": "gazeOffsetFromCamera=0 (she looks AT you)",
    "fireMemory": "staffEmberIntensity=0.6 for 2s",
    "revealing": "hand placed on staff; precognitionLead=0 (she is fully present)"
  }
}
```

---

### 2T — THE WARLORD

Canon anchor: `docs/production/act1-asset-build/prompts/matchups/warlord-zero-first.txt` + `act1_art_prompts__opponent_portrait.csv:portrait_warlord_swarm_env`. The Warlord is a FULLY ARMORED FIGURE — no exposed face, deliberately unornamented field armor, brass-and-composite dusky-chrome plate, full-face helm with continuous horizontal scanning slit. Under the helm: the host body (Agent Zero, 18) infested with a Vex-swarm — indicated by faint iridescent shimmer inside the visor's lower inner edge. THE FACE IS NEVER SHOWN through all of Act 1.

Reference: `apps/client/public/references/npcs/warlord/REFERENCE.md`.

**Critical rigging note:** The Warlord has NO face, NO viseme, NO blink. All lip-sync data routes to the visor's shimmer intensity (same pattern as The Architect's maskVibration). Breathing is minimal (the armor is rigid; the body inside is half-swarm). The shimmer is her sole tell.

#### 2T.1 — Bundle A: Neutral bust

> Three-quarter bust portrait of a fully armored figure, standing still, mid-distance. Brass-and-composite dusky-chrome plate armor (#6b6b65 dusky chrome, #b8752d polished brass at joints and edges) — articulated segmented cuirass with visible overlapping plates, broad pauldrons, gauntlets in frame. NO Empire insignia, NO faction marks — deliberately unornamented field armor, the armor of a professional arriving to complete a transaction. The helm is full-face: a sculpted brass-rimmed visor (#b8752d brass rim, black interior #0a0a0a matte), continuous horizontal scanning slit across eye level (~8cm wide, 1.5cm tall), face completely hidden. Along the visor's lower inner edge (inside the scanning slit): a faint iridescent shimmer barely visible — almost a heat-haze, the sole visible indicator of the Vex-swarm infesting the body inside. Subtle rainbow-pale chromatic shimmer, NOT flashy. A viewer who doesn't know to look reads it as spotlight refraction on the visor metal. One gauntleted hand visible at lower frame edge resting on the hilt of a broad short-bladed weapon at the hip (not drawn). Her stance: still, not aggressive. Backdrop: defocused Nexon breach battlefield — smoke columns, torn banner at screen-right edge, distant ember-orange city fires, faint cold cyan from emergency flares. Lighting: amber spotlight on pauldron and upper visor from camera-right; ember-orange rim from back (city glow); faint cold cyan rim from back-left (flares). Visor scanning slit reflects the ember glow. Film grain. 4K. No rendered text.

#### 2T.2 — Bundle B: Breathing loop (8 frames)

> Minimal chest motion (1.000 to 1.002 peak — the armor is rigid, and the body inside is half-swarm). Shimmer inside the visor slit SLIGHTLY modulates across the 8 frames — intensity cycles 0.25 → 0.35 → 0.25 (subliminal). This is the swarm "breathing." Armor plates UNCHANGED. Weapon hand UNCHANGED.

#### 2T.3 — Bundle C: Blink triptych — NOT GENERATED

Skip. The Warlord has no eyes visible. Runtime blink channel unused. Deliver a "WARLORD: NO BLINK" marker.

#### 2T.4 — Bundle D: Viseme grid — ROUTED TO VISOR SHIMMER

Skip traditional visemes. Deliver 15 visor-shimmer intensity frames matching the phoneme set: SIL = 0.25 baseline; strong-open vowels (AA, AO, OW) = 0.9; soft consonants (B_M_P) = 0.35; etc. Runtime modulates shimmer via `visorShimmerIntensity` uniform in sync with the VO timeline. 15 reference frames to lock the curve. 4K.

#### 2T.5 — Bundle E: Expressions (5) — ALL VISOR-MEDIATED

> 1. SPEAKING — visor shimmer baseline + phoneme modulation; no other change.
> 2. CONCERNED — shimmer dims to 0.15, a pause in modulation for 400ms; the swarm is registering.
> 3. EMOTIONAL1 (predatory-focus) — shimmer intensity drops to 0.1 but GAIN aligns to a single concentrated 3px bright point that moves across the visor slit (the swarm focusing on a target). Unsettling.
> 4. EMOTIONAL2 (swarm-leak) — one frame: shimmer EXITS the visor slit as a single faint rainbow-pale wisp rising ~15px above the helm before dissipating. Reserved — the swarm almost left.
> 5. REVEALING — the weapon hand lifts from the hilt and extends toward the camera open-palmed (a transactional offer). Visor shimmer acceleratesto  a frantic 2Hz flicker. The swarm is engaged. NEVER render the helm removed — the face stays hidden for all of Act 1.

#### 2T.6 — Bundle F: Visor shimmer overlay

> **Output:** `apps/client/public/vfx-atlases/warlord_visor_shimmer.png` — 1024×256 transparent.

> A narrow horizontal band texture matching the visor slit's aspect ratio. Subtle iridescent shimmer — rainbow-pale soft gradient (pink → cyan → gold → violet) at 25% base opacity, with an animated "scan" band traveling horizontally across. Used as additive overlay on the visor slit driven by `visorShimmerIntensity: 0..1`.

#### 2T.7 — Shader uniform block

```json
{
  "rigId": "npc_warlord",
  "shaderProgram": "SwarmHostedArmorPortrait",
  "uniforms": {
    "visorShimmerIntensity": 0.25,
    "visorShimmerTexture": "vfx-atlases/warlord_visor_shimmer.png",
    "breathingPhase": "autoLoop:3.2s:amp=1.002",
    "visemeChannel": "routeToVisorShimmer",
    "blinkChannel": null,
    "helmRemovalLocked": true
  },
  "stateTriggers": {
    "speaking": "visorShimmerIntensity modulates with phoneme",
    "predatoryFocus": "shimmer drops; single bright point moves across slit",
    "swarmLeak": "1-frame shimmer wisp rises above helm",
    "transactionalOffer": "weapon hand lifts; shimmer 2Hz flicker"
  }
}
```

---
